import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";

/**
 * Temp-table upsert sync helpers.
 *
 * Flow: stage pushed rows into "<mainTable>_tmp" (created by the same
 * ensure* schema functions, so constraints/indexes match), then merge into
 * the live table inside a single transaction:
 *   - UPDATE rows whose key exists in temp
 *   - INSERT rows in temp not present in main
 *   - DELETE rows in main not present in temp (optional, stale cleanup)
 * The live table is NEVER dropped/renamed/truncated/replaced — only
 * row-level changes. Temp table is always dropped afterwards.
 */

const TEMP_SUFFIX = "_tmp";

/**
 * Returns the staging table name for a given main table.
 * @param {string} mainTable
 * @returns {string}
 */
export function getTempTableName(mainTable) {
  return `${sanitizeSqlIdentifier(mainTable, "main")}${TEMP_SUFFIX}`;
}

/**
 * Checks whether a table exists in the tenant database.
 * @param {import('better-sqlite3').Database} db
 * @param {string} tableName
 * @returns {boolean}
 */
export function tableExists(db, tableName) {
  try {
    return Boolean(
      db
        .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?")
        .get(tableName)
    );
  } catch (_) {
    return false;
  }
}

/**
 * Drops a temp staging table if it exists. Never throws.
 * @param {import('better-sqlite3').Database} db
 * @param {string} tempTable
 */
export function dropTempTable(db, tempTable) {
  try {
    const clean = sanitizeSqlIdentifier(tempTable, "");
    if (clean) db.prepare(`DROP TABLE IF EXISTS "${clean}"`).run();
  } catch (_) {}
}

/**
 * Reads the main table's column metadata and splits columns into
 * mergeable data columns vs. columns that must be left alone
 * (autoincrement rowid PKs and created_at/updated_at bookkeeping).
 * @param {import('better-sqlite3').Database} db
 * @param {string} mainTable
 * @returns {{ allCols: string[], dataCols: string[], hasCreatedAt: boolean, hasUpdatedAt: boolean }}
 */
function getMergeColumns(db, mainTable) {
  const cols = db.prepare(`PRAGMA table_info("${mainTable}")`).all();
  const allCols = cols.map((c) => c.name);

  // INTEGER PRIMARY KEY / AUTOINCREMENT columns are rowid aliases — never
  // written explicitly during merge (e.g. articles.id, materials.row_id).
  const autoPk = new Set(
    cols.filter((c) => c.pk > 0 && /INT/i.test(c.type || "")).map((c) => c.name)
  );

  const skip = new Set([...autoPk, "created_at", "updated_at"]);
  return {
    allCols,
    dataCols: allCols.filter((n) => !skip.has(n)),
    hasCreatedAt: allCols.includes("created_at"),
    hasUpdatedAt: allCols.includes("updated_at"),
  };
}

/**
 * Merges a staged temp table into the live main table atomically.
 *
 * @param {import('better-sqlite3').Database} db
 * @param {string} mainTable   - Live table (never dropped/replaced)
 * @param {string} tempTable   - Staging table holding the full pushed dataset
 * @param {object} [options]
 * @param {string[]} [options.keyCols]      - Unique key column(s), e.g. ["ArticleNo"] or ["id"]
 * @param {boolean}  [options.deleteStale]  - Delete main rows missing from temp (default true)
 * @returns {{ insertedCount: number, updatedCount: number, deletedCount: number, totalInDatabase: number, success: boolean }}
 */
export function mergeTempIntoMain(db, mainTable, tempTable, { keyCols = [], deleteStale = true } = {}) {
  const main = sanitizeSqlIdentifier(mainTable, "");
  const temp = sanitizeSqlIdentifier(tempTable, "");
  if (!main || !temp) throw new Error("mergeTempIntoMain: invalid table name(s)");

  if (!tableExists(db, temp)) {
    const total = tableExists(db, main)
      ? db.prepare(`SELECT COUNT(*) as c FROM "${main}"`).get()?.c || 0
      : 0;
    return { insertedCount: 0, updatedCount: 0, deletedCount: 0, totalInDatabase: total, success: true };
  }

  // Main table missing entirely → temp already has the full correct schema
  // (created via the same ensure* function), so just adopt it.
  if (!tableExists(db, main)) {
    db.prepare(`ALTER TABLE "${temp}" RENAME TO "${main}"`).run();
    const total = db.prepare(`SELECT COUNT(*) as c FROM "${main}"`).get()?.c || 0;
    return { insertedCount: total, updatedCount: 0, deletedCount: 0, totalInDatabase: total, success: true };
  }

  const { allCols, dataCols, hasCreatedAt, hasUpdatedAt } = getMergeColumns(db, main);
  const keys = keyCols.filter((k) => allCols.includes(k));
  if (keys.length === 0) {
    throw new Error(`mergeTempIntoMain: no valid key columns for "${main}" (got: ${keyCols.join(", ")})`);
  }

  const joinCond = keys.map((k) => `m."${k}" = t."${k}"`).join(" AND ");
  const deleteJoinCond = keys.map((k) => `t."${k}" = "${main}"."${k}"`).join(" AND ");
  const updateCols = dataCols.filter((c) => !keys.includes(c));
  const setClause = updateCols.map((c) => `"${c}" = t."${c}"`).join(", ");

  const tempRowCount = db.prepare(`SELECT COUNT(*) as c FROM "${temp}"`).get()?.c || 0;

  let insertedCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;

  const mergeTx = db.transaction(() => {
    // 1. UPDATE existing rows (key match)
    if (setClause) {
      updatedCount = db
        .prepare(
          `UPDATE "${main}" AS m SET ${setClause}${hasUpdatedAt ? ", updated_at = CURRENT_TIMESTAMP" : ""}
           FROM "${temp}" AS t WHERE ${joinCond}`
        )
        .run().changes;
    }

    // 2. INSERT new rows (in temp, not in main)
    const insertColList = dataCols.map((c) => `"${c}"`).join(", ");
    const selectColList = dataCols.map((c) => `t."${c}"`).join(", ");
    insertedCount = db
      .prepare(
        `INSERT INTO "${main}" (${insertColList}${hasCreatedAt ? ", created_at" : ""}${hasUpdatedAt ? ", updated_at" : ""})
         SELECT ${selectColList}${hasCreatedAt ? ", CURRENT_TIMESTAMP" : ""}${hasUpdatedAt ? ", CURRENT_TIMESTAMP" : ""}
         FROM "${temp}" AS t
         WHERE NOT EXISTS (SELECT 1 FROM "${main}" AS m WHERE ${joinCond})`
      )
      .run().changes;

    // 3. DELETE stale rows (in main, not in temp) — skipped for empty pushes
    //    so a bad/empty payload can never wipe the live table.
    if (deleteStale && tempRowCount > 0) {
      deletedCount = db
        .prepare(`DELETE FROM "${main}" WHERE NOT EXISTS (SELECT 1 FROM "${temp}" AS t WHERE ${deleteJoinCond})`)
        .run().changes;
    }
  });

  mergeTx();

  const totalInDatabase = db.prepare(`SELECT COUNT(*) as c FROM "${main}"`).get()?.c || 0;
  return { insertedCount, updatedCount, deletedCount, totalInDatabase, success: true };
}

/**
 * Full temp-table sync orchestration:
 *   drop leftover temp → ensure main exists → stage rows via the caller's
 *   existing batchInsert* function into temp → merge temp into main in one
 *   transaction → always drop temp.
 *
 * @param {import('better-sqlite3').Database} db
 * @param {object} config
 * @param {string}   config.mainTable        - Live target table
 * @param {string[]} config.keyCols          - Unique key column(s) for the compare
 * @param {boolean}  [config.deleteStale]    - Delete main rows missing from push (default true)
 * @param {Function} [config.ensureMainTable]- (db, mainTable) => void — creates main table if missing
 * @param {Function} config.stage            - (tempTable) => result — stages rows into temp (e.g. batchInsertDesigns)
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, deletedCount: number, totalInDatabase: number, success: boolean }}
 */
export function syncTableViaTemp(db, { mainTable, keyCols, deleteStale = true, ensureMainTable, stage }) {
  const main = sanitizeSqlIdentifier(mainTable, "");
  if (!main) throw new Error("syncTableViaTemp: invalid mainTable");
  const temp = getTempTableName(main);

  // Clean slate — remove any leftover temp from a previously failed push
  dropTempTable(db, temp);

  let stageResult = {};
  try {
    if (typeof ensureMainTable === "function") ensureMainTable(db, main);
    if (typeof stage === "function") stageResult = stage(temp) || {};

    const merge = mergeTempIntoMain(db, main, temp, { keyCols, deleteStale });
    return {
      totalReceived: stageResult.totalReceived ?? merge.insertedCount + merge.updatedCount,
      ...merge,
    };
  } finally {
    dropTempTable(db, temp);
    try {
      db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}
  }
}

export default {
  getTempTableName,
  tableExists,
  dropTempTable,
  mergeTempIntoMain,
  syncTableViaTemp,
};
