import { sanitizeSqlIdentifier } from "./dynamicDesigns.js";

/**
 * Standard prefix for dynamic stock memo list tables:
 * stock_list_{Laboursetid}_{diamondpricelistname}_{colorstonepricelistname}_{SettingPriceUniqueNo}
 */
export const STOCK_LIST_PREFIX = "stock_list_";

/**
 * Generates standardized dynamic stock list table name from policy configuration parameters.
 * Example:
 * { Laboursetid: 20, diamondpricelistname: "BEdiamond", colorstonepricelistname: "BEcolorStone", SettingPriceUniqueNo: 11 }
 * -> "stock_list_20_BEdiamond_BEcolorStone_11"
 * 
 * @param {object} [config={}]
 * @param {string} [prefix=STOCK_LIST_PREFIX]
 * @returns {string}
 */
export function getDynamicStockListTableName(config = {}, prefix = STOCK_LIST_PREFIX) {
  const labour = sanitizeSqlIdentifier(
    config.Laboursetid ?? config.laboursetid ?? config.pricemanagement_laboursetid ?? "0",
    "0"
  );
  const dia = sanitizeSqlIdentifier(
    config.diamondpricelistName ?? config.diamondpricelistname ?? config.Diamondpricelistname ?? "default",
    "default"
  );
  const cs = sanitizeSqlIdentifier(
    config.colorstonepricelistName ?? config.colorstonepricelistname ?? config.Colorstonepricelistname ?? "default",
    "default"
  );
  const setting = sanitizeSqlIdentifier(
    config.SettingPriceUniqueNo ?? config.settingpriceuniqueno ?? "0",
    "0"
  );

  return `${prefix}${labour}_${dia}_${cs}_${setting}`;
}

/**
 * Ensures the stock_list table (base or policy-specific) and performance indexes exist in the SQLite database.
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {string} tableName 
 */
export function ensureDynamicStockListTable(db, tableName = "stock_list") {
  if (!db) return;
  const cleanTable = sanitizeSqlIdentifier(tableName, "stock_list");

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS "${cleanTable}" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      autocode TEXT,
      designno TEXT,
      StockBarcode TEXT NOT NULL,
      InMemo INTEGER DEFAULT 0,
      InStock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_${cleanTable}_barcode UNIQUE (StockBarcode)
    );
  `;

  const createIndexesSql = `
    CREATE INDEX IF NOT EXISTS "idx_${cleanTable}_autocode" ON "${cleanTable}" (autocode);
    CREATE INDEX IF NOT EXISTS "idx_${cleanTable}_designno" ON "${cleanTable}" (designno);
    CREATE INDEX IF NOT EXISTS "idx_${cleanTable}_stockbarcode" ON "${cleanTable}" (StockBarcode);
    CREATE INDEX IF NOT EXISTS "idx_${cleanTable}_instock" ON "${cleanTable}" (InStock);
    CREATE INDEX IF NOT EXISTS "idx_${cleanTable}_inmemo" ON "${cleanTable}" (InMemo);
  `;

  try {
    db.exec(createTableSql);
    db.exec(createIndexesSql);
  } catch (err) {
    console.error(`[ensureDynamicStockListTable] Error ensuring table ${cleanTable}:`, err.message);
  }
}

/**
 * Default base stock_list table schema SQL.
 */
export const STOCK_LIST_BASE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS stock_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autocode TEXT,
    designno TEXT,
    StockBarcode TEXT NOT NULL,
    InMemo INTEGER DEFAULT 0,
    InStock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_stock_list_barcode UNIQUE (StockBarcode)
  );

  CREATE INDEX IF NOT EXISTS idx_stock_list_autocode ON stock_list (autocode);
  CREATE INDEX IF NOT EXISTS idx_stock_list_designno ON stock_list (designno);
  CREATE INDEX IF NOT EXISTS idx_stock_list_stockbarcode ON stock_list (StockBarcode);
  CREATE INDEX IF NOT EXISTS idx_stock_list_instock ON stock_list (InStock);
  CREATE INDEX IF NOT EXISTS idx_stock_list_inmemo ON stock_list (InMemo);
`;
