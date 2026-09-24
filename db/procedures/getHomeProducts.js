import { getDynamicDesignTableName, sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";

/**
 * Resolves the target table name in SQLite.
 * Tries:
 * 1. Specified tableName (if exists)
 * 2. Policy-based dynamic table name (if exists)
 * 3. 'designs' table (if exists)
 * 4. First available 'design_Productlist_%' table
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} options 
 * @returns {string}
 */
export function resolveHomeTable(db, options = {}) {
  // 1. Explicit table name
  if (options.tableName) {
    const clean = sanitizeSqlIdentifier(options.tableName, "designs");
    const exists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(clean);
    if (exists) return exists.name;
  }

  // 2. Policy-derived table name from options
  const hasLabourInOpts =
    options.Laboursetid != null ||
    options.laboursetid != null ||
    options.pricemanagement_laboursetid != null;
  const hasDiaInOpts =
    options.diamondpricelistName != null ||
    options.diamondpricelistname != null ||
    options.Diamondpricelistname != null;

  if (hasLabourInOpts || hasDiaInOpts) {
    const candidate = getDynamicDesignTableName(options);
    const exists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(candidate);
    if (exists) return exists.name;
  }

  // 3. Try resolving policy from storeinit in DB
  try {
    const s = db
      .prepare(
        "SELECT pricemanagement_laboursetid, diamondpricelistname, colorstonepricelistname, SettingPriceUniqueNo FROM storeinit LIMIT 1"
      )
      .get();
    if (s && (s.pricemanagement_laboursetid != null || s.diamondpricelistname != null)) {
      const candidateFromStore = getDynamicDesignTableName(s);
      const exists = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
        .get(candidateFromStore);
      if (exists) return exists.name;
    }
  } catch (_) {}

  // 4. Any existing dynamic design table with data
  const anyDynamic = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'design_Productlist_%' LIMIT 1")
    .get();
  if (anyDynamic) return anyDynamic.name;

  // 5. Standard 'designs' table
  const defaultDesigns = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = 'designs'")
    .get();
  if (defaultDesigns) return defaultDesigns.name;

  return "designs";
}

/**
 * Ultra-Fast Direct Query for Home Bestseller Products
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} [options={}] 
 * @returns {{ rd: Array<object>, totalCount: number, stat: number, msg: string, targetTable: string }}
 */
export function getHomeBestsellers(db, options = {}) {
  const targetTable = resolveHomeTable(db, options);
  const limit = Math.max(1, Math.min(Number(options.limit) || 20, 100));

  try {
    const sql = `
      SELECT * FROM "${targetTable}"
      WHERE IsBestSeller = 1
      ORDER BY DisplayOrder ASC, id ASC
      LIMIT ?
    `;
    const rows = db.prepare(sql).all(limit);

    return {
      rd: rows,
      totalCount: rows.length,
      stat: 1,
      msg: "success",
      targetTable,
    };
  } catch (err) {
    console.error(`[getHomeBestsellers] Error querying table '${targetTable}':`, err.message);
    return {
      rd: [],
      totalCount: 0,
      stat: 0,
      msg: err.message,
      targetTable,
    };
  }
}

/**
 * Ultra-Fast Direct Query for Home New Arrival Products
 * Checks: IsNewArrival = 1 AND (FrontEnd1_newArrivalsto IS NULL OR FrontEnd1_newArrivalsto = '' OR date(FrontEnd1_newArrivalsto) >= date('now', 'localtime'))
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} [options={}] 
 * @returns {{ rd: Array<object>, totalCount: number, stat: number, msg: string, targetTable: string }}
 */
export function getHomeNewArrivals(db, options = {}) {
  const targetTable = resolveHomeTable(db, options);
  const limit = Math.max(1, Math.min(Number(options.limit) || 20, 100));

  try {
    const sql = `
      SELECT * FROM "${targetTable}"
      WHERE IsNewArrival = 1
        AND (
          FrontEnd1_newArrivalsto IS NULL 
          OR FrontEnd1_newArrivalsto = '' 
          OR date(FrontEnd1_newArrivalsto) >= date('now', 'localtime')
        )
      ORDER BY DisplayOrder ASC, id ASC
      LIMIT ?
    `;
    const rows = db.prepare(sql).all(limit);

    return {
      rd: rows,
      totalCount: rows.length,
      stat: 1,
      msg: "success",
      targetTable,
    };
  } catch (err) {
    console.error(`[getHomeNewArrivals] Error querying table '${targetTable}':`, err.message);
    return {
      rd: [],
      totalCount: 0,
      stat: 0,
      msg: err.message,
      targetTable,
    };
  }
}

/**
 * Ultra-Fast Direct Query for Home Trending Products
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} [options={}] 
 * @returns {{ rd: Array<object>, totalCount: number, stat: number, msg: string, targetTable: string }}
 */
export function getHomeTrending(db, options = {}) {
  const targetTable = resolveHomeTable(db, options);
  const limit = Math.max(1, Math.min(Number(options.limit) || 20, 100));

  try {
    const sql = `
      SELECT * FROM "${targetTable}"
      WHERE IsTrending = 1
      ORDER BY DisplayOrder ASC, id ASC
      LIMIT ?
    `;
    const rows = db.prepare(sql).all(limit);

    return {
      rd: rows,
      totalCount: rows.length,
      stat: 1,
      msg: "success",
      targetTable,
    };
  } catch (err) {
    console.error(`[getHomeTrending] Error querying table '${targetTable}':`, err.message);
    return {
      rd: [],
      totalCount: 0,
      stat: 0,
      msg: err.message,
      targetTable,
    };
  }
}

/**
 * Unified Dispatcher for Home Product Queries
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} [options={}] 
 * @returns {{ rd: Array<object>, totalCount: number, stat: number, msg: string, targetTable: string }}
 */
export function getHomeProducts(db, options = {}) {
  const type = String(options.type || options.section || "bestseller").toLowerCase();

  switch (type) {
    case "newarrival":
    case "newarrivals":
    case "new_arrival":
      return getHomeNewArrivals(db, options);
    case "trending":
      return getHomeTrending(db, options);
    case "bestseller":
    case "bestsellers":
    case "best_seller":
    default:
      return getHomeBestsellers(db, options);
  }
}
