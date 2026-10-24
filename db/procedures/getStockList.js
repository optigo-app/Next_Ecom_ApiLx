import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";
import { getDynamicStockListTableName, ensureDynamicStockListTable } from "../schema/dynamicStockList.js";

/**
 * Queries stock list records with optional filters.
 * Dynamically resolves target table based on policy parameters or table name.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [filters={}]
 * @returns {{ rd: Array<object>, totalCount: number, success: boolean }}
 */
export function getStockList(db, filters = {}) {
  if (!db) {
    return { rd: [], totalCount: 0, success: false };
  }

  // 1. Resolve target table strictly identical to product listing (getDesignsByMenu)
  let targetTable = null;
  let resolvedCandidate = null;

  const hasLabour =
    (filters.Laboursetid != null && String(filters.Laboursetid).trim() !== "") ||
    (filters.laboursetid != null && String(filters.laboursetid).trim() !== "") ||
    (filters.pricemanagement_laboursetid != null && String(filters.pricemanagement_laboursetid).trim() !== "");
  const hasDia =
    (filters.diamondpricelistName != null && String(filters.diamondpricelistName).trim() !== "") ||
    (filters.diamondpricelistname != null && String(filters.diamondpricelistname).trim() !== "") ||
    (filters.Diamondpricelistname != null && String(filters.Diamondpricelistname).trim() !== "");

  if (filters.tableName || filters.table) {
    resolvedCandidate = sanitizeSqlIdentifier(filters.tableName || filters.table);
    const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(resolvedCandidate);
    if (exists) targetTable = exists.name;
  } else if (hasLabour && hasDia) {
    resolvedCandidate = getDynamicStockListTableName(filters);
    const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(resolvedCandidate);
    if (exists) targetTable = exists.name;
  }

  // 2. If no explicit policy params passed, resolve default policy from tenant storeinit table
  if (!targetTable) {
    try {
      const storeInitExists = db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='storeinit'").get();
      if (storeInitExists) {
        const storeInitRow = db.prepare("SELECT * FROM storeinit LIMIT 1").get();
        if (storeInitRow) {
          const defaultPolicy = {
            Laboursetid: storeInitRow.pricemanagement_laboursetid,
            diamondpricelistname: storeInitRow.diamondpricelistname,
            colorstonepricelistname: storeInitRow.colorstonepricelistname,
            SettingPriceUniqueNo: storeInitRow.SettingPriceUniqueNo,
          };
          resolvedCandidate = getDynamicStockListTableName(defaultPolicy);
          const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(resolvedCandidate);
          if (exists) targetTable = exists.name;
        }
      }
    } catch (_) {}
  }

  // 3. Fallback to active dynamic policy table in tenant db if candidate not yet matched
  if (!targetTable) {
    try {
      const dynamicTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'stock_list_%' ORDER BY name DESC LIMIT 1").get();
      if (dynamicTable) {
        targetTable = dynamicTable.name;
      }
    } catch (_) {}
  }

  if (!targetTable) {
    return {
      rd: [],
      totalCount: 0,
      success: false,
      error: `Policy stock table "${resolvedCandidate || 'unspecified'}" does not exist in database`,
    };
  }

  const cleanTable = targetTable;

  const whereClauses = [];
  const params = [];

  if (filters.autocode) {
    whereClauses.push("autocode = ?");
    params.push(String(filters.autocode).trim());
  }

  if (filters.designno) {
    whereClauses.push("designno = ?");
    params.push(String(filters.designno).trim());
  }

  if (filters.StockBarcode) {
    whereClauses.push("StockBarcode = ?");
    params.push(String(filters.StockBarcode).trim());
  }

  if (filters.InStock !== undefined && filters.InStock !== null && filters.InStock !== "") {
    whereClauses.push("InStock = ?");
    params.push(Number(filters.InStock) ? 1 : 0);
  }

  if (filters.InMemo !== undefined && filters.InMemo !== null && filters.InMemo !== "") {
    whereClauses.push("InMemo = ?");
    params.push(Number(filters.InMemo) ? 1 : 0);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Count total records matching criteria
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM "${cleanTable}" ${whereSql}`);
  const totalCount = countStmt.get(...params)?.total || 0;

  // Pagination support
  let limitClause = "";
  const queryParams = [...params];

  const limit = Number(filters.limit || filters.PageSize || filters.pagesize);
  const page = Number(filters.page || filters.PageNo || filters.CurrentPage || 1);

  if (Number.isFinite(limit) && limit > 0) {
    const offset = Math.max(0, (Math.max(1, page) - 1) * limit);
    limitClause = "LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);
  }

  const querySql = `
    SELECT 
      id,
      autocode,
      designno,
      StockBarcode,
      InMemo,
      InStock,
      created_at,
      updated_at
    FROM "${cleanTable}"
    ${whereSql}
    ORDER BY id ASC
    ${limitClause}
  `;

  const rows = db.prepare(querySql).all(...queryParams);

  return {
    rd: rows,
    totalCount,
    success: true,
  };
}
