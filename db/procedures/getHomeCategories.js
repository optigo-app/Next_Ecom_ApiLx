import { resolveHomeTable } from "./getHomeProducts.js";
import { ensurePolicyCategoriesTable, POLICY_CATEGORIES_TABLE } from "../schema/policyCategories.js";
import { rebuildPolicyCategories } from "./materializePolicyCategories.js";

/**
 * Ultra-Fast Direct Query for Home Categories from SQLite.
 * Reads directly from pre-materialized "policy_categories" table in <0.1ms.
 * Automatically falls back to on-demand materialization if not yet cached.
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} [options={}] 
 * @returns {{ rd: Array<object>, totalCount: number, stat: number, msg: string, targetTable: string }}
 */
export function getHomeCategories(db, options = {}) {
  const targetTable = resolveHomeTable(db, options);
  const limit = options.limit ? Math.max(1, Math.min(Number(options.limit) || 50, 200)) : null;

  try {
    const tableCheck = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(targetTable);

    if (!tableCheck) {
      return {
        rd: [],
        totalCount: 0,
        stat: 1,
        msg: `Table '${targetTable}' does not exist`,
        targetTable,
      };
    }

    ensurePolicyCategoriesTable(db);

    // 1. Fast Path: Read from pre-computed policy_categories table
    let selectSql = `
      SELECT 
        CategoryName,
        CategoryName AS categoryName,
        categoryId,
        categoryId AS id,
        designCount,
        DesignId,
        designno,
        autocode,
        TitleLine,
        ImageCount,
        ImageExtension,
        ImageVideoDetail,
        UnitCostWithMarkUpIncTax,
        UnitCost,
        MetalColorid,
        MetalPurityid
      FROM "${POLICY_CATEGORIES_TABLE}"
      WHERE table_name = ?
      ORDER BY designCount DESC
    `;

    const queryParams = [targetTable];
    if (limit) {
      selectSql += ` LIMIT ?`;
      queryParams.push(limit);
    }

    let rows = db.prepare(selectSql).all(...queryParams);

    // 2. Fallback: If not yet materialized for this policy, compute once and save
    if (!rows || rows.length === 0) {
      const materialized = rebuildPolicyCategories(db, targetTable, options);
      rows = limit ? materialized.slice(0, limit) : materialized;
    }

    const formattedRows = rows.map((row) => ({
      ...row,
      firstProduct: row.firstProduct || {
        DesignId: row.DesignId,
        designno: row.designno,
        autocode: row.autocode,
        TitleLine: row.TitleLine,
        ImageCount: row.ImageCount,
        ImageExtension: row.ImageExtension,
        ImageVideoDetail: row.ImageVideoDetail,
        UnitCostWithMarkUpIncTax: row.UnitCostWithMarkUpIncTax,
        UnitCost: row.UnitCost,
      },
    }));

    return {
      rd: formattedRows,
      totalCount: formattedRows.length,
      stat: 1,
      msg: "success",
      targetTable,
    };
  } catch (err) {
    console.error(`[getHomeCategories] Error querying table '${targetTable}':`, err.message);
    return {
      rd: [],
      totalCount: 0,
      stat: 0,
      msg: err.message,
      targetTable,
    };
  }
}

export default {
  getHomeCategories,
};
