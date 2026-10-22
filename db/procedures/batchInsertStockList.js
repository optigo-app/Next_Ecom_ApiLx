import { ensureDynamicStockListTable } from "../schema/dynamicStockList.js";
import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";

/**
 * Batch inserts stock records into a stock list table (main or staging _tmp).
 * Fast insertion using prepared statement and transaction, without duplicate check overhead.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>} rawPayload
 * @param {object} [options={}]
 * @param {string} [tableName='stock_list']
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, totalInDatabase: number, success: boolean }}
 */
export function batchInsertStockList(db, rawPayload = [], options = {}, tableName = "stock_list") {
  const targetTable = sanitizeSqlIdentifier(options?.tableName || tableName, "stock_list");

  let items = [];
  if (Array.isArray(rawPayload)) {
    items = rawPayload;
  } else if (rawPayload && typeof rawPayload === "object") {
    items = rawPayload.products || rawPayload.stockList || rawPayload.Data?.rd || rawPayload.rd || [];
  }

  // Ensure table and indexes exist
  ensureDynamicStockListTable(db, targetTable);

  if (!Array.isArray(items) || items.length === 0) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;
    return {
      totalReceived: 0,
      insertedCount: 0,
      updatedCount: 0,
      totalInDatabase: count,
      success: true,
    };
  }

  // If truncate or clear was requested
  if (options?.truncate || options?.clearBeforeSync || options?.flush) {
    try {
      db.prepare(`DELETE FROM "${targetTable}"`).run();
    } catch (_) {}
  }

  const upsertStmt = db.prepare(`
    INSERT INTO "${targetTable}" (
      autocode,
      designno,
      StockBarcode,
      InMemo,
      InStock,
      updated_at
    ) VALUES (
      @autocode,
      @designno,
      @StockBarcode,
      @InMemo,
      @InStock,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(StockBarcode) DO UPDATE SET
      autocode = excluded.autocode,
      designno = excluded.designno,
      InMemo = excluded.InMemo,
      InStock = excluded.InStock,
      updated_at = CURRENT_TIMESTAMP
  `);

  const toStr = (v) => (v != null ? String(v).trim() : "");
  const toInt = (v) => {
    if (v === true || v === "true" || v === 1 || v === "1") return 1;
    return 0;
  };

  const getVal = (row, ...keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null) return row[k];
    }
    return undefined;
  };

  const countBefore = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;

  // Process in configurable slots (chunks) to avoid huge transaction overhead
  const slotSize = Math.max(1, Number(options?.slotSize || options?.batchSize || 1000));
  const totalSlots = Math.ceil(items.length / slotSize);

  const insertSlot = db.transaction((slotRows) => {
    for (const row of slotRows) {
      const barcode = toStr(getVal(row, "StockBarcode", "stockbarcode", "stockBarcode", "barcode"));
      if (!barcode) continue;

      upsertStmt.run({
        autocode: toStr(getVal(row, "autocode", "AutoCode", "autoCode")),
        designno: toStr(getVal(row, "designno", "DesignNo", "designNo")),
        StockBarcode: barcode,
        InMemo: toInt(getVal(row, "InMemo", "inmemo", "inMemo")),
        InStock: toInt(getVal(row, "InStock", "instock", "inStock")),
      });
    }
  });

  // Execute insertion slot by slot
  for (let i = 0; i < items.length; i += slotSize) {
    const slot = items.slice(i, i + slotSize);
    insertSlot(slot);
  }

  const countAfter = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;
  const insertedCount = Math.max(0, countAfter - countBefore);
  const updatedCount = Math.max(0, items.length - insertedCount);

  return {
    totalReceived: items.length,
    insertedCount,
    updatedCount,
    totalInDatabase: countAfter,
    slotSize,
    slotsProcessed: totalSlots,
    success: true,
  };
}
