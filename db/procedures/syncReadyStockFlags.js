import { DESIGN_TABLE_PREFIX, sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";
import { STOCK_LIST_PREFIX } from "../schema/dynamicStockList.js";

const hasTable = (db, name) => Boolean(
  db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name)
);

const getColumns = (db, table) => new Set(
  db.prepare(`PRAGMA table_info("${table}")`).all().map((column) => column.name.toLowerCase())
);

/**
 * Recompute ready stock status after a stock list table has been synced.
 * Barcode is primary; AutoCode is the fallback when no barcode match exists.
 * InMemo takes precedence over InStock: 1 -> status 2, 1 -> status 1, else 0.
 */
export function syncReadyStockFlags(db, stockTableName) {
  const emptyResult = {
    updatedRows: 0,
    tablesUpdated: 0,
    tablesSkipped: [],
    tableErrors: [],
  };
  const stockTable = sanitizeSqlIdentifier(stockTableName, "");
  if (!db || !stockTable || !hasTable(db, stockTable)) {
    return { ...emptyResult, tablesSkipped: [{ table: stockTableName, reason: "Stock list table was not found." }] };
  }

  const stockColumns = getColumns(db, stockTable);
  if (!["stockbarcode", "autocode", "instock", "inmemo"].every((column) => stockColumns.has(column))) {
    return { ...emptyResult, tablesSkipped: [{ table: stockTable, reason: "Stock list table is missing a required barcode, AutoCode, InStock, or InMemo column." }] };
  }

  const suffix = stockTable.startsWith(STOCK_LIST_PREFIX)
    ? stockTable.slice(STOCK_LIST_PREFIX.length)
    : "";
  const preferredDesignTable = suffix ? `${DESIGN_TABLE_PREFIX}${suffix}` : null;
  const designTables = suffix
    ? (hasTable(db, preferredDesignTable) ? [preferredDesignTable] : [])
    : db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name GLOB ? ORDER BY name")
      .all(`${DESIGN_TABLE_PREFIX}*`)
      .map(({ name }) => name);

  let updatedRows = 0;
  let tablesUpdated = 0;
  const tableErrors = [];
  const tablesSkipped = [];

  if (suffix && designTables.length === 0) {
    tablesSkipped.push({
      table: preferredDesignTable,
      reason: "Matching policy product listing table was not found.",
    });
  }

  for (const rawDesignTable of designTables) {
    const designTable = sanitizeSqlIdentifier(rawDesignTable, "");
    if (!designTable || !hasTable(db, designTable)) continue;
    const designColumns = getColumns(db, designTable);
    if (!designColumns.has("isinreadystock") || !designColumns.has("stockbarcode") || !designColumns.has("autocode")) {
      tablesSkipped.push({ table: designTable, reason: "Product listing table is missing a required match or flag column." });
      continue;
    }

    try {
      const update = db.transaction(() => db.prepare(`
        WITH barcode_status AS (
          SELECT StockBarcode,
            MAX(CASE WHEN COALESCE(InMemo, 0) = 1 THEN 2
                     WHEN COALESCE(InStock, 0) = 1 THEN 1
                     ELSE 0 END) AS ready_status
          FROM "${stockTable}"
          WHERE NULLIF(TRIM(StockBarcode), '') IS NOT NULL
          GROUP BY StockBarcode
        ),
        autocode_status AS (
          SELECT autocode,
            MAX(CASE WHEN COALESCE(InMemo, 0) = 1 THEN 2
                     WHEN COALESCE(InStock, 0) = 1 THEN 1
                     ELSE 0 END) AS ready_status
          FROM "${stockTable}"
          WHERE NULLIF(TRIM(autocode), '') IS NOT NULL
          GROUP BY autocode
        )
        UPDATE "${designTable}" AS product
        SET IsInReadyStock = COALESCE(
          (SELECT ready_status FROM barcode_status
           WHERE StockBarcode = TRIM(product.StockBarcode)),
          (SELECT ready_status FROM autocode_status
           WHERE autocode = TRIM(product.autocode)),
          0
        )
        WHERE COALESCE(product.IsInReadyStock, -1) <> COALESCE(
          (SELECT ready_status FROM barcode_status
           WHERE StockBarcode = TRIM(product.StockBarcode)),
          (SELECT ready_status FROM autocode_status
           WHERE autocode = TRIM(product.autocode)),
          0
        )
      `).run());

      updatedRows += update().changes;
      tablesUpdated += 1;
    } catch (error) {
      tableErrors.push({ table: designTable, error: error.message });
    }
  }

  return { updatedRows, tablesUpdated, tablesSkipped, tableErrors };
}

