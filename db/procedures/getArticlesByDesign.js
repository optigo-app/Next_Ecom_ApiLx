import {
  getDynamicArticleTableName,
  ensureDynamicArticleTable,
  resolveArticleTableName,
  resolveArticleMaterialTableName,
  ensureDynamicArticleMaterialTable,
} from "../schema/dynamicArticles.js";

/**
 * Strips internal SQLite-specific management fields (id, created_at, updated_at).
 * @param {object} row
 * @returns {object}
 */
function cleanArticleRow(row) {
  if (!row) return null;
  const { id, created_at, updated_at, ...clean } = row;
  return clean;
}

/**
 * Strips internal SQLite-specific management fields (row_id, created_at, updated_at).
 * Note: Keeps 'id' because in ERP's rd1, 'id' is the ERP material record id.
 * @param {object} row
 * @returns {object}
 */
function cleanMaterialRow(row) {
  if (!row) return null;
  const { row_id, created_at, updated_at, ...clean } = row;
  return clean;
}

/**
 * Retrieves articles and paired material breakdown from the dynamic policy tables for a given design or entire domain.
 * Supports filtering by designno, autocode, ArticleNo, MetalTypeId, MetalColorId, Size, InStock, etc.
 * Supports pagination (PageNo, PageSize/limit) and sorting (SortBy).
 * 
 * Returns standard ERP format: { Status: "200", Message: "Request processed successfully.", Data: { rd: [...], rd1: [...] } }
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {{ Status: string, Message: string, Data: { rd: Array<object>, rd1: Array<object> } }}
 */
export function getArticlesByDesign(db, options = {}) {
  const targetTable = resolveArticleTableName(db, options);
  const matTable = resolveArticleMaterialTableName(db, options, targetTable);

  // Check if article table exists
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
    .get(targetTable);

  if (!tableExists) {
    return {
      Status: "200",
      Message: "Request processed successfully.",
      Data: {
        rd: [],
        rd1: [],
      },
    };
  }

  const conditions = [];
  const params = [];

  const rawDesignNo = options.designno ?? options.design_no ?? options.DesignNo ?? options.Designno;
  if (rawDesignNo) {
    conditions.push(`designno = ? COLLATE NOCASE`);
    params.push(String(rawDesignNo).trim());
  }

  const rawAutocode = options.autocode ?? options.AutoCode ?? options.autoCode;
  if (rawAutocode) {
    conditions.push(`autocode = ?`);
    params.push(String(rawAutocode).trim());
  }

  const rawArticleNo = options.ArticleNo ?? options.articleNo ?? options.articleno ?? options.Article_No;
  if (rawArticleNo) {
    conditions.push(`ArticleNo = ? COLLATE NOCASE`);
    params.push(String(rawArticleNo).trim());
  }

  const rawMetalTypeId = options.MetalTypeId ?? options.metalTypeId ?? options.metaltypeid;
  if (rawMetalTypeId != null && rawMetalTypeId !== "") {
    conditions.push(`MetalTypeId = ?`);
    params.push(Number(rawMetalTypeId));
  }

  const rawMetalColorId = options.MetalColorId ?? options.metalColorId ?? options.metalcolorid;
  if (rawMetalColorId != null && rawMetalColorId !== "") {
    conditions.push(`MetalColorId = ?`);
    params.push(Number(rawMetalColorId));
  }

  const rawSize = options.Size ?? options.size;
  if (rawSize != null && rawSize !== "") {
    conditions.push(`Size = ? COLLATE NOCASE`);
    params.push(String(rawSize).trim());
  }

  if (options.InStock === 1 || options.InStock === "1" || options.inStock === true) {
    conditions.push(`InStock = 1`);
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "1=1";

  // Sorting
  let orderClause = "ArticleId ASC, id ASC";
  const sort = String(options.SortBy ?? options.sortBy ?? options.sortby ?? "").toLowerCase().trim();
  if (sort.includes("low_to_high") || sort.includes("price_asc") || sort === "1") {
    orderClause = "COALESCE(UnitCostWithmarkup, TotalUnitCost, 0) ASC, ArticleId ASC, id ASC";
  } else if (sort.includes("high_to_low") || sort.includes("price_desc") || sort === "2") {
    orderClause = "COALESCE(UnitCostWithmarkup, TotalUnitCost, 0) DESC, ArticleId ASC, id ASC";
  }

  let query = `SELECT * FROM "${targetTable}" WHERE ${whereClause} ORDER BY ${orderClause}`;

  // Pagination
  const pageNo = Number(options.PageNo ?? options.page ?? options.pageNo) || 1;
  const pageSize = Number(options.PageSize ?? options.pageSize ?? options.limit);
  if (pageSize && pageSize > 0 && pageSize < 1000000) {
    const offset = Number(options.offset) || (pageNo - 1) * pageSize;
    query += ` LIMIT ${pageSize} OFFSET ${offset}`;
  }

  try {
    const rawRows = db.prepare(query).all(...params);
    const cleanedRows = rawRows.map(cleanArticleRow);

    // Query corresponding material breakdown (rd1)
    let cleanedMatRows = [];
    const matTableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(matTable);

    if (matTableExists) {
      try {
        let matQuery = `SELECT * FROM "${matTable}"`;
        const matConditions = [];
        const matParams = [];

        if (rawArticleNo) {
          matConditions.push(`ArticleNo = ? COLLATE NOCASE`);
          matParams.push(String(rawArticleNo).trim());
        } else if (rawDesignNo && !rawMetalTypeId && !rawMetalColorId && !rawSize && !pageSize) {
          matConditions.push(`designno = ? COLLATE NOCASE`);
          matParams.push(String(rawDesignNo).trim());
        } else if (rawAutocode && !rawMetalTypeId && !rawMetalColorId && !rawSize && !pageSize) {
          matConditions.push(`autocode = ?`);
          matParams.push(String(rawAutocode).trim());
        } else if (cleanedRows.length > 0) {
          const articleNos = [...new Set(cleanedRows.map((r) => r.ArticleNo).filter(Boolean))];
          if (articleNos.length > 0 && articleNos.length <= 900) {
            const placeholders = articleNos.map(() => "?").join(",");
            matConditions.push(`ArticleNo IN (${placeholders})`);
            matParams.push(...articleNos);
          } else if (rawDesignNo) {
            matConditions.push(`designno = ? COLLATE NOCASE`);
            matParams.push(String(rawDesignNo).trim());
          }
        }

        if (matConditions.length > 0) {
          matQuery += ` WHERE ${matConditions.join(" AND ")} ORDER BY ArticleId ASC, id ASC`;
          const rawMatRows = db.prepare(matQuery).all(...matParams);
          cleanedMatRows = rawMatRows.map(cleanMaterialRow);
        } else if (!rawDesignNo && !rawArticleNo && !rawAutocode && cleanedRows.length > 0 && cleanedRows.length <= 100) {
          const articleNos = [...new Set(cleanedRows.map((r) => r.ArticleNo).filter(Boolean))];
          if (articleNos.length > 0) {
            const placeholders = articleNos.map(() => "?").join(",");
            matQuery += ` WHERE ArticleNo IN (${placeholders}) ORDER BY ArticleId ASC, id ASC`;
            const rawMatRows = db.prepare(matQuery).all(...articleNos);
            cleanedMatRows = rawMatRows.map(cleanMaterialRow);
          }
        }
      } catch (matErr) {
        console.error(`[getArticlesByDesign] Material query error on '${matTable}':`, matErr.message);
      }
    }

    return {
      Status: "200",
      Message: "Request processed successfully.",
      Data: {
        rd: cleanedRows,
        rd1: cleanedMatRows,
      },
    };
  } catch (err) {
    console.error(`[getArticlesByDesign] Query error on '${targetTable}':`, err.message);
    return {
      Status: "500",
      Message: err.message,
      Data: {
        rd: [],
        rd1: [],
      },
    };
  }
}

export default getArticlesByDesign;
