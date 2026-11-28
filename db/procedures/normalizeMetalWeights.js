import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";
import { ensureMetalDensityTable } from "../schema/metalDensity.js";
import { ensureMetalTypeMasterTable } from "../schema/metalTypeMaster.js";
import { convertNetWeightByMetal } from "../../app/(core)/utils/product/metalWeightConversion.js";
import { logger } from "../logger.js";

/**
 * Metal normalization after an ERP push.
 *
 * Rule: a metal that is not in metal_type_master (GOLD 18K / 22k / 24k, SILVER S295 ...)
 * is replaced by the first SILVER (if it is silver) or the first GOLD of the master, and
 * its weight is converted with the metal density: weight * oldDensity / newDensity.
 *
 * Order (each part is idempotent and never throws into the caller):
 *   1. normalizeArticleMetals  -> material table (StoneTypeid 4,5 only), then the Info table
 *                                 (all in ONE transaction, so they never disagree)
 *   2. normalizeListingMetals  -> design_Productlist_ table (own transaction)
 */

const round3 = (value) => Number(Number(value).toFixed(3));
const norm = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const text = (value) => String(value ?? "").trim();

// Metal family: silver / gold / first word of anything else.
function familyOf(value) {
  const s = text(value).toLowerCase();
  if (s.includes("silver")) return "silver";
  if (s.includes("gold")) return "gold";
  return s.split(/\s+/)[0] || "";
}

// Purity token: "18K" / "18kt" -> "18k", "S295" / "925" -> "295"/"925".
function purityToken(value) {
  const s = text(value).toLowerCase();
  const karat = s.match(/(\d+)\s*k(?:t|arat)?/);
  if (karat) return `${karat[1]}k`;
  const fineness = s.match(/s?\s*(\d{3})/);
  return fineness ? fineness[1] : "";
}

function tableExists(db, name) {
  return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(name));
}

function loadMaster(db) {
  ensureMetalTypeMasterTable(db);
  return db
    .prepare("SELECT metal_id, metal_type_id, metal_type, metal_type_name, metal_purity FROM metal_type_master ORDER BY sort_order ASC, id ASC")
    .all();
}

function loadDensities(db) {
  ensureMetalDensityTable(db);
  return db.prepare("SELECT gold_type, density FROM metal_density ORDER BY id ASC").all();
}

/**
 * Step A. Is this metal already in the master?
 *   1) exact name (normalized), 2) id + family, 3) rough: same family and same purity.
 */
function matchMaster(master, { name, family, purity, metalId, metalTypeId }) {
  const key = norm(name);
  if (key) {
    const exact = master.find((m) => norm(m.metal_type) === key);
    if (exact) return exact;
  }
  if (metalId != null && metalId > 0) {
    const byId = master.find(
      (m) => m.metal_id === metalId && (metalTypeId == null || m.metal_type_id === metalTypeId || familyOf(m.metal_type_name) === family),
    );
    if (byId && (!family || familyOf(byId.metal_type_name) === family)) return byId;
  }
  const token = purityToken(purity || name);
  if (family && token) {
    return master.find((m) => familyOf(m.metal_type_name) === family && purityToken(m.metal_purity || m.metal_type) === token) || null;
  }
  return null;
}

/** Step B. Replacement metal: first SILVER for silver, otherwise first GOLD, else first master row. */
function pickFallback(master, family) {
  const wanted = family === "silver" ? "silver" : "gold";
  return master.find((m) => familyOf(m.metal_type_name || m.metal_type) === wanted) || master[0] || null;
}

/**
 * Step C. Density row name for a metal, checked carefully: exact, then rough
 * (same family + same purity). Returns "" when the density table has no such metal,
 * so the converter treats it as density 0 and leaves the weight unchanged.
 */
function resolveDensityName(densities, name, family, purity) {
  const key = norm(name);
  const exact = key && densities.find((d) => norm(d.gold_type) === key && Number(d.density) > 0);
  if (exact) return exact.gold_type;
  const token = purityToken(purity || name);
  if (!family || !token) return "";
  const rough = densities.find(
    (d) => Number(d.density) > 0 && familyOf(d.gold_type) === family && purityToken(d.gold_type) === token,
  );
  return rough ? rough.gold_type : "";
}

function convertWeight(weight, fromName, toName, densities) {
  if (weight == null || !Number.isFinite(Number(weight))) return weight;
  return convertNetWeightByMetal({
    fromMetalType: fromName,
    fromWeight: Number(weight),
    toMetalType: toName,
    metalDensities: densities,
  });
}

class RollbackSignal extends Error { }

// Verbose step logging — shows exactly why rows are skipped on live.
function mlog(scope, msg, extra) {
  const line = `[METAL_NORMALIZE][${scope}] ${msg}`;
  console.log(line, extra ?? "");
  logger.info("METAL_NORMALIZE", `[${scope}] ${msg}`, extra);
}

/**
 * Parts 1+2 of the flow: material rows (StoneTypeid 4,5) then the Info table.
 * @returns {{ success: boolean, skipped?: string, metalRowsScanned: number, metalRowsFixed: number,
 *             articlesUpdated: number, rowsWithoutDensity: number, changes: object[], infoPreview: object[], dryRun: boolean }}
 */
export function normalizeArticleMetals(db, materialTable, infoTable, { dryRun = false, articleNos = null } = {}) {
  const mat = sanitizeSqlIdentifier(materialTable, "article_materials");
  const info = sanitizeSqlIdentifier(infoTable, "articles");
  const result = {
    success: true, dryRun, metalRowsScanned: 0, metalRowsFixed: 0, articlesUpdated: 0,
    rowsWithoutDensity: 0, changes: [], infoPreview: [],
  };

  try {
    mlog(mat, `start normalizeArticleMetals (mat=${mat}, info=${info}, dryRun=${dryRun}, articleNos=${JSON.stringify(articleNos)})`);
    if (!tableExists(db, mat) || !tableExists(db, info)) {
      mlog(mat, `SKIPPED: tables missing (mat exists=${tableExists(db, mat)}, info exists=${tableExists(db, info)})`);
      return { ...result, skipped: "tables missing" };
    }
    const master = loadMaster(db);
    if (master.length === 0) {
      mlog(mat, `SKIPPED: metal_type_master is empty — run store-init sync first`);
      return { ...result, skipped: "metal_type_master is empty" };
    }
    const densities = loadDensities(db);
    mlog(mat, `loaded master: ${master.length} rows [${master.map((m) => m.metal_type).join(", ")}], densities: ${densities.length} rows`);

    const run = db.transaction(() => {
      // Step 1: read only the metal (4) and finding (5) material rows of web designs. The flag
      // IsDesignBaseWeb only exists in the ERP article payload (rd), stored on the Info table —
      // the ERP material rows (rd1) never carry it — so it is checked through the article's
      // Info row. Stones (1,2,3) and non-web designs are never touched.
      // Optional test filter: restrict to specific ArticleNos (e.g. ["1033961-001"]).
      const articleFilter = Array.isArray(articleNos) && articleNos.length > 0
        ? ` AND ArticleNo IN (${articleNos.map(() => "?").join(",")})`
        : "";
      const articleParams = Array.isArray(articleNos) && articleNos.length > 0 ? articleNos.map(String) : [];
      const rows = db.prepare(`
        SELECT row_id, ArticleNo, StoneTypeid, Shapeid, Shape, QualityId, Quality, Weight, GrossDiamondWeight
        FROM "${mat}" WHERE StoneTypeid IN (4, 5)
          AND IsDesignBaseWeb = 1 
          ${articleFilter}
      `).all(...articleParams);
      result.metalRowsScanned = rows.length;
      const totalMetalRows = db.prepare(`SELECT COUNT(*) AS c FROM "${mat}" WHERE StoneTypeid IN (4,5)`).get()?.c || 0;
      const flaggedArticles = db.prepare(`SELECT COUNT(*) AS c FROM "${info}" WHERE IsDesignBaseWeb = 1`).get()?.c || 0;
      mlog(mat, `material rows with StoneTypeid 4,5: ${totalMetalRows} | info rows with IsDesignBaseWeb=1: ${flaggedArticles} | rows passing filter: ${rows.length}`);

      const update = db.prepare(`
        UPDATE "${mat}" SET Shapeid = @shapeid, Shape = @shape, QualityId = @qualityId, Quality = @quality,
          Weight = @weight, GrossDiamondWeight = @gross, updated_at = CURRENT_TIMESTAMP
        WHERE row_id = @rowId
      `);
      const fixedArticles = new Map();

      for (const row of rows) {
        const name = `${text(row.Shape)} ${text(row.Quality)}`.trim();
        const family = familyOf(row.Shape || name);
        // Step 2: already in the master? then leave the row alone.
        const matched = matchMaster(master, { name, family, purity: row.Quality, metalId: Number(row.QualityId), metalTypeId: Number(row.Shapeid) });
        if (matched) {
          mlog(mat, `row ${row.row_id} (${row.ArticleNo}): metal '${name}' already in master as '${matched.metal_type}' — skipped`);
          continue;
        }

        // Step 3: pick the replacement metal (first silver / first gold).
        const target = pickFallback(master, family);
        if (!target) {
          mlog(mat, `row ${row.row_id} (${row.ArticleNo}): no fallback metal found in master — skipped`);
          continue;
        }

        // Step 4: convert the weight by density (unchanged when a density is missing = 0).
        const fromName = resolveDensityName(densities, name, family, row.Quality);
        const toName = resolveDensityName(densities, target.metal_type, familyOf(target.metal_type_name), target.metal_purity);
        const weight = convertWeight(row.Weight, fromName, toName, densities);
        const gross = convertWeight(row.GrossDiamondWeight, fromName, toName, densities);
        if (!fromName || !toName) result.rowsWithoutDensity += 1;
        mlog(mat, `row ${row.row_id} (${row.ArticleNo}): '${name || "(empty)"}' -> '${target.metal_type}' | density ${fromName || "MISSING(=0)"} -> ${toName || "MISSING(=0)"} | gross ${row.GrossDiamondWeight} -> ${gross}`);

        // Step 5: rewrite the 6 columns: Shapeid, Shape, QualityId, Quality, Weight, GrossDiamondWeight.
        update.run({
          rowId: row.row_id, shapeid: target.metal_type_id, shape: target.metal_type_name,
          qualityId: target.metal_id, quality: target.metal_purity, weight, gross,
        });
        result.metalRowsFixed += 1;
        const current = fixedArticles.get(row.ArticleNo);
        if (!current || row.StoneTypeid === 4) fixedArticles.set(row.ArticleNo, target);
        result.changes.push({
          articleNo: row.ArticleNo, stoneTypeId: row.StoneTypeid, from: name || "(empty)", to: target.metal_type,
          densityFrom: fromName || null, densityTo: toName || null,
          grossBefore: row.GrossDiamondWeight, grossAfter: gross,
        });
      }

      if (fixedArticles.size > 0) {
        // Step 6: Info table, only for the articles changed above. Totals are re-summed from the
        // material rows with the same rules as the ERP query (ROUND per row, stones 1,2 / 5, misc by flag).
        db.exec(`CREATE TEMP TABLE IF NOT EXISTS _metal_fix_articles (ArticleNo TEXT PRIMARY KEY, metal_id INTEGER, metal_type TEXT)`);
        db.exec(`DELETE FROM _metal_fix_articles`);
        const addFix = db.prepare(`INSERT OR REPLACE INTO _metal_fix_articles (ArticleNo, metal_id, metal_type) VALUES (?, ?, ?)`);
        for (const [articleNo, target] of fixedArticles) addFix.run(articleNo, target.metal_id, target.metal_type);

        const previewSql = `SELECT ArticleNo, MetalWeight, FindingWeight, NetWeight, ActualGrossWeight, GrossWeightWithLoss, MetalTypeId, MetalType
                            FROM "${info}" WHERE ArticleNo IN (SELECT ArticleNo FROM _metal_fix_articles)`;
        const before = db.prepare(previewSql).all();
        const gwExpr = `ROUND(CASE WHEN StoneTypeid IN (4,5) THEN GrossDiamondWeight
                         WHEN StoneTypeid IN (1,2) THEN GrossDiamondWeight / 5.0
                         WHEN StoneTypeid = 3 AND IsMiscwtAddinGrossWeight = 1 THEN GrossDiamondWeight
                         ELSE 0 END, 3)`;
        const infoUpdate = db.prepare(`
          UPDATE "${info}" AS a SET
            MetalWeight = b.MetalWeight, FindingWeight = b.FindingWeight, NetWeight = b.NetWeight,
            ActualGrossWeight = b.ActualGrossWeight, GrossWeightWithLoss = b.GrossWeightWithLoss,
            MetalTypeId = f.metal_id, MetalType = f.metal_type, updated_at = CURRENT_TIMESTAMP
          FROM (
            SELECT ArticleNo,
              SUM(ROUND(CASE WHEN StoneTypeid = 4 THEN GrossDiamondWeight ELSE 0 END, 3)) AS MetalWeight,
              SUM(ROUND(CASE WHEN StoneTypeid = 5 THEN GrossDiamondWeight ELSE 0 END, 3)) AS FindingWeight,
              SUM(ROUND(CASE WHEN StoneTypeid IN (4,5) THEN GrossDiamondWeight ELSE 0 END, 3)) AS NetWeight,
              SUM(${gwExpr}) AS ActualGrossWeight,
              SUM(${gwExpr}) AS GrossWeightWithLoss
            FROM "${mat}" WHERE ArticleNo IN (SELECT ArticleNo FROM _metal_fix_articles)
            GROUP BY ArticleNo
          ) AS b
          JOIN _metal_fix_articles AS f ON f.ArticleNo = b.ArticleNo
          WHERE a.ArticleNo = b.ArticleNo
        `);
        result.articlesUpdated = infoUpdate.run().changes;
        mlog(mat, `info update: ${result.articlesUpdated} rows updated for ${fixedArticles.size} article(s)`);
        const after = db.prepare(previewSql).all();
        result.infoPreview = before.map((b) => ({ before: b, after: after.find((a) => a.ArticleNo === b.ArticleNo) }));
        db.exec(`DROP TABLE IF EXISTS _metal_fix_articles`);
      }

      if (dryRun) throw new RollbackSignal();
    });

    try { run(); } catch (err) { if (!(err instanceof RollbackSignal)) throw err; }
    mlog(mat, `done: fixed=${result.metalRowsFixed}, infoUpdated=${result.articlesUpdated}, noDensity=${result.rowsWithoutDensity}${dryRun ? " (dry run, rolled back)" : ""}`);
    return result;
  } catch (error) {
    logger.error("METAL_NORMALIZE", `[${mat}] failed, rolled back: ${error.message}`);
    return { ...result, success: false, error: error.message };
  }
}

/**
 * Part 3 of the flow: listing table (no StoneTypeid there). The row's own metal is checked
 * against the master; a mismatch gets the fallback metal, Nwt is converted by density and
 * Gwt keeps its stone part: Gwt = oldGwt - oldNwt + newNwt.
 */
export function normalizeListingMetals(db, listingTable, { dryRun = false } = {}) {
  const table = sanitizeSqlIdentifier(listingTable, "designs");
  const result = { success: true, dryRun, rowsScanned: 0, rowsFixed: 0, rowsWithoutDensity: 0, changes: [] };

  try {
    mlog(table, `start normalizeListingMetals (dryRun=${dryRun})`);
    if (!tableExists(db, table)) {
      mlog(table, `SKIPPED: table missing`);
      return { ...result, skipped: "table missing" };
    }
    const master = loadMaster(db);
    if (master.length === 0) {
      mlog(table, `SKIPPED: metal_type_master is empty — run store-init sync first`);
      return { ...result, skipped: "metal_type_master is empty" };
    }
    const densities = loadDensities(db);
    mlog(table, `loaded master: ${master.length} rows, densities: ${densities.length} rows`);

    const run = db.transaction(() => {
      const rows = db.prepare(`
        SELECT rowid AS rid, ArticleNo, Nwt, Gwt, MetalPurityid, MetalTypeid, MetalTypePurity FROM "${table}"
        WHERE TRIM(COALESCE(MetalTypePurity, '')) <> ''
      `).all();
      result.rowsScanned = rows.length;
      mlog(table, `listing rows scanned: ${rows.length}`);
      const update = db.prepare(`
        UPDATE "${table}" SET MetalPurityid = @purityId, MetalTypeid = @typeId, MetalTypePurity = @name,
          Nwt = @nwt, Gwt = @gwt WHERE rowid = @rid
      `);

      for (const row of rows) {
        const name = text(row.MetalTypePurity);
        const family = familyOf(name);
        const purity = name.replace(/^\S+\s*/, "");
        const matched = matchMaster(master, { name, family, purity, metalId: Number(row.MetalPurityid), metalTypeId: Number(row.MetalTypeid) });
        if (matched) {
          mlog(table, `row ${row.rid} (${row.ArticleNo}): metal '${name}' already in master as '${matched.metal_type}' — skipped`);
          continue;
        }

        const target = pickFallback(master, family);
        if (!target) continue;
        const fromName = resolveDensityName(densities, name, family, purity);
        const toName = resolveDensityName(densities, target.metal_type, familyOf(target.metal_type_name), target.metal_purity);
        const nwt = convertWeight(row.Nwt, fromName, toName, densities);
        const gwt = row.Gwt == null || row.Nwt == null || nwt == null ? row.Gwt : round3(Number(row.Gwt) - Number(row.Nwt) + Number(nwt));
        if (!fromName || !toName) result.rowsWithoutDensity += 1;
        mlog(table, `row ${row.rid} (${row.ArticleNo}): '${name}' -> '${target.metal_type}' | nwt ${row.Nwt} -> ${nwt}, gwt ${row.Gwt} -> ${gwt}`);

        update.run({ rid: row.rid, purityId: target.metal_id, typeId: target.metal_type_id, name: target.metal_type, nwt, gwt });
        result.rowsFixed += 1;
        result.changes.push({ articleNo: row.ArticleNo, from: name, to: target.metal_type, nwtBefore: row.Nwt, nwtAfter: nwt, gwtBefore: row.Gwt, gwtAfter: gwt });
      }
      if (dryRun) throw new RollbackSignal();
    });

    try { run(); } catch (err) { if (!(err instanceof RollbackSignal)) throw err; }
    mlog(table, `done: fixed=${result.rowsFixed}, noDensity=${result.rowsWithoutDensity}${dryRun ? " (dry run, rolled back)" : ""}`);
    return result;
  } catch (error) {
    logger.error("METAL_NORMALIZE", `[${table}] failed, rolled back: ${error.message}`);
    return { ...result, success: false, error: error.message };
  }
}
