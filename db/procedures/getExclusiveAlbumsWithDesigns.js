import { resolveHomeTable } from "./getHomeProducts.js";
import { ensureAlbumsTable, isAlbumUsable, isAlbumExpired, parseAlbumExpiry } from "../schema/albums.js";

/**
 * Computes the effective status of an album row.
 * @returns {"active"|"deactivated"|"expired"}
 */
function albumStatus(row) {
  if (!row) return "deactivated";
  if (Number(row.IsDeactive) === 1) return "deactivated";
  if (isAlbumExpired(row.ExpiryDate)) return "expired";
  return "active";
}

/**
 * ISO timestamp of the album expiry moment, or null when no valid ExpiryDate.
 */
function albumExpiresAt(row) {
  const d = parseAlbumExpiry(row?.ExpiryDate);
  return d ? d.toISOString() : null;
}

/**
 * Lightweight status-only listing: rows without the usable filter and without designs.
 */
function buildStatusRows(rows) {
  return (rows || []).map((a) => ({
    id: a.id,
    albumcode: a.albumcode,
    albumName: a.albumName,
    CustomerId: a.CustomerId,
    RandomNo: a.RandomNo,
    AlbumSecurityId: a.AlbumSecurityId,
    IsDeactive: a.IsDeactive,
    ExpiryDate: a.ExpiryDate,
    expiresAt: albumExpiresAt(a),
    status: albumStatus(a),
  }));
}

/**
 * AlbumSecurityId drives visibility: 0/'' = public, 1 = ignored, 2 = private.
 * Column is TEXT, so normalize once and compare numerically.
 */
const ALBUM_SECURITY_SQL =
  "CAST(COALESCE(NULLIF(TRIM(AlbumSecurityId), ''), '0') AS INTEGER)";
const SECURITY_NOT_IGNORED_SQL = `${ALBUM_SECURITY_SQL} <> 1`;
const SECURITY_VISIBLE_SQL = `(${ALBUM_SECURITY_SQL} = 0 OR (${ALBUM_SECURITY_SQL} = 2 AND @customerId <> 0 AND CustomerId = @customerId))`;

/**
 * Retrieves customer-exclusive albums joined with their respective design products from SQLite.
 * Uses default storeinit pricing policy / resolved productlist table.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {number|string} options.customerId - Target Customer ID
 * @param {number|string} [options.id] - Optional filter for specific album ID
 * @param {string} [options.albumcode] - Optional filter for album code
 * @param {string} [options.RandomNo] - Optional filter for RandomNo
 * @param {boolean} [options.includeDesigns=true] - Whether to fetch and attach designs
 * @returns {object} Standard response { Status: "200", Message: "...", Data: { rd: [...], storeConfig: {...} } }
 */
export function getExclusiveAlbumsWithDesigns(db, options = {}) {
  if (!db) {
    return {
      Status: "400",
      Message: "Database connection unavailable.",
      Data: { rd: [] },
    };
  }

  ensureAlbumsTable(db);

  const startTime = performance.now();
  const customerId = options.customerId || options.CustomerId;

  if (!customerId && !options.RandomNo) {
    return {
      Status: "400",
      Message: "customerId or RandomNo is required to fetch exclusive albums.",
      Data: { rd: [] },
    };
  }

  // 1. Fetch store config for image paths & currency
  let storeConfig = {
    CDNDesignImageFol: "",
    DesignImageFol: "",
    Currencysymbol: "₹",
  };
  try {
    const s = db.prepare("SELECT CDNDesignImageFol, DesignImageFol, Currencysymbol, CurrencySymbol FROM storeinit LIMIT 1").get();
    if (s) {
      storeConfig = {
        CDNDesignImageFol: s.CDNDesignImageFol || s.DesignImageFol || "",
        DesignImageFol: s.DesignImageFol || s.CDNDesignImageFol || "",
        Currencysymbol: s.Currencysymbol || s.CurrencySymbol || "₹",
      };
    }
  } catch (_) {}

  // 2. Fetch albums for this customer. Shared-link queries (RandomNo/albumcode/id)
  //    read the row unfiltered so a blocked album can report its real status.
  const isSpecificQuery = Boolean(
    options.RandomNo ||
      options.albumcode ||
      (options.id !== undefined && options.id !== null && options.id !== "")
  );
  const unfiltered = options.statusOnly === true || isSpecificQuery;

  let sql = `
    SELECT
      id,
      albumName,
      AutocodeList,
      ExpiryDate,
      IsDeactive,
      albumcode,
      CustomerId,
      RandomNo,
      AlbumImageName,
      AlbumImageFol,
      AlbumSecurityId,
      EntryDate
    FROM albums
    WHERE 1 = 1
  `;
  sql += ` AND ${SECURITY_NOT_IGNORED_SQL}`;
  if (!unfiltered) sql += " AND (IsDeactive IS NULL OR IsDeactive = 0)";
  const params = {};

  if (!isSpecificQuery) {
    // Visibility by AlbumSecurityId: public albums for everyone, private
    // albums only for their owning customer. customerId=0 -> public only.
    sql += ` AND ${SECURITY_VISIBLE_SQL}`;
    params.customerId = Number(customerId || 0);
  }

  if (options.id !== undefined && options.id !== null && options.id !== "") {
    sql += " AND id = @id";
    params.id = Number(options.id);
  }
  if (options.albumcode) {
    sql += " AND LOWER(albumcode) = LOWER(@albumcode)";
    params.albumcode = String(options.albumcode).trim();
  }
  if (options.RandomNo) {
    sql += " AND RandomNo = @RandomNo";
    params.RandomNo = String(options.RandomNo).trim();
  }

  sql += " ORDER BY id ASC, EntryDate DESC";

  const rows = db.prepare(sql).all(params);

  // Lightweight status listing for client-side live monitoring.
  if (options.statusOnly === true) {
    const statusRows = buildStatusRows(rows);
    return {
      Status: "200",
      Message: "Request processed successfully.",
      Data: {
        customerId: Number(customerId),
        totalAlbums: statusRows.length,
        statusOnly: true,
        rd: statusRows,
      },
    };
  }

  const usableAlbums = rows.filter(isAlbumUsable);
  const albums = unfiltered ? rows : usableAlbums;

  // A shared link points at one album: if it exists but is blocked, report why
  // instead of pretending it does not exist.
  let blockedStatus = null;
  if (isSpecificQuery && rows.length > 0) {
    const requestedStatus = albumStatus(rows[0]);
    if (requestedStatus !== "active") blockedStatus = requestedStatus;
  }

  for (const a of albums) {
    a.status = albumStatus(a);
    a.expiresAt = albumExpiresAt(a);
  }

  if (blockedStatus) {
    return {
      Status: "200",
      Message: `Album is ${blockedStatus}.`,
      Data: {
        customerId: Number(customerId),
        totalAlbums: albums.length,
        storeConfig,
        blockedStatus,
        rd: albums,
      },
    };
  }

  const albumsToServe = usableAlbums;

  if (!albumsToServe || albumsToServe.length === 0) {
    return {
      Status: "200",
      Message: "No exclusive albums found for this customer.",
      Data: {
        customerId: Number(customerId),
        totalAlbums: 0,
        storeConfig,
        rd: [],
      },
    };
  }

  // 3. Process autocodes
  const allCodesMap = new Map(); // normalized integer string -> Set of raw codes
  for (const a of albumsToServe) {
    const rawList = a.AutocodeList ? a.AutocodeList.split(",").map((s) => s.trim()).filter(Boolean) : [];
    a.autocodeListParsed = rawList;
    a.totalAutocodes = rawList.length;
    a.designs = [];
    a.designCount = 0;

    for (const c of rawList) {
      const num = parseInt(c, 10);
      if (!isNaN(num)) {
        const numStr = String(num);
        if (!allCodesMap.has(numStr)) {
          allCodesMap.set(numStr, new Set());
        }
        allCodesMap.get(numStr).add(c);
      }
    }
  }

  // 4. If designs requested, query from resolved productlist table
  const includeDesigns = options.includeDesigns !== false;
  const intCodes = Array.from(allCodesMap.keys());
  let tableName = "";

  if (includeDesigns && intCodes.length > 0) {
    tableName = resolveHomeTable(db, options);

    if (tableName) {
      const intNums = intCodes.map(Number);
      const placeholders = intNums.map(() => "?").join(",");

      try {
        const colList = db.prepare(`PRAGMA table_info("${tableName}")`).all().map((c) => c.name);
        const hasArticleNo = colList.includes("ArticleNo");
        const hasArticleId = colList.includes("ArticleId");
        const hasStockBarcode = colList.includes("StockBarcode");
        const extraCols = [
          hasArticleNo ? "ArticleNo" : "'' AS ArticleNo",
          hasArticleId ? "ArticleId" : "NULL AS ArticleId",
          hasStockBarcode ? "StockBarcode" : "'' AS StockBarcode",
        ].join(", ");

        const designs = db.prepare(`
          SELECT 
            id,
            designno,
            autocode,
            ${extraCols},
            TitleLine,
            description,
            UnitCost,
            UnitCostWithMarkUp,
            UnitCostWithMarkUpIncTax,
            Metal_Cost,
            Labour_Cost,
            Diamond_Cost,
            ColorStone_Cost,
            Nwt,
            Gwt,
            Dwt,
            Dpcs,
            CSwt,
            CSpcs,
            ImageCount,
            ImageExtension,
            ImageVideoDetail,
            MetalTypePurity,
            category,
            collection,
            sub_category,
            style
          FROM "${tableName}"
          WHERE CAST(autocode AS INTEGER) IN (${placeholders})
        `).all(...intNums);

        // Build lookup map by both normalized integer and raw autocode
        const designMap = new Map();
        for (const d of designs) {
          const numStr = String(parseInt(d.autocode, 10));
          designMap.set(numStr, d);
          if (d.autocode) {
            designMap.set(String(d.autocode).trim(), d);
          }
        }

        // Attach designs to each album
        for (const a of albumsToServe) {
          const matched = [];
          const seen = new Set();
          for (const code of a.autocodeListParsed) {
            const numStr = String(parseInt(code, 10));
            const found = designMap.get(numStr) || designMap.get(code);
            if (found && !seen.has(found.id || found.autocode)) {
              seen.add(found.id || found.autocode);
              matched.push(found);
            }
          }
          a.designs = matched;
          a.designCount = matched.length;
        }
      } catch (err) {
        console.warn("[getExclusiveAlbumsWithDesigns] Error querying design table:", err.message);
      }
    }
  }

  const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    Status: "200",
    Message: "Request processed successfully.",
    Data: {
      customerId: Number(customerId),
      totalAlbums: albumsToServe.length,
      tableName,
      storeConfig,
      elapsedMs,
      rd: albumsToServe,
    },
  };
}

export default getExclusiveAlbumsWithDesigns;
