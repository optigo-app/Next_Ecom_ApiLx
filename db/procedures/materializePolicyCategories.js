import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";
import { ensurePolicyCategoriesTable, POLICY_CATEGORIES_TABLE } from "../schema/policyCategories.js";

/**
 * Materializes and pre-computes unique categories, design counts, and preview product
 * for a specific policy table into the dedicated "policy_categories" table.
 * 
 * Runs atomically inside a SQLite transaction:
 * 1. Aggregates categories and rank 1 preview product from the source table.
 * 2. Deletes previous records for this table_name.
 * 3. Inserts fresh pre-computed rows.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {string} targetTable - Name of the dynamic policy table or 'designs'
 * @param {object} [options={}] - Optional package filtering options
 * @returns {Array<object>} Materialized categories
 */
export function rebuildPolicyCategories(db, targetTable, options = {}) {
  const cleanTable = sanitizeSqlIdentifier(targetTable, "");
  if (!cleanTable) {
    return [];
  }

  // Ensure table exists
  const tableCheck = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
    .get(cleanTable);

  if (!tableCheck) {
    return [];
  }

  ensurePolicyCategoriesTable(db);

  const rawPkgId =
    options.PackageId ??
    options.packageId ??
    options.PackageID ??
    options.packageid ??
    null;
  const rawPkgName = options.PackageName ?? options.packageName ?? null;
  const pkgIdParam = rawPkgId != null && rawPkgId !== "" ? Number(rawPkgId) : null;
  const pkgNameParam = rawPkgName != null && rawPkgName !== "" ? String(rawPkgName).trim() : null;

  const aggSql = `
    WITH RECURSIVE
    TargetPackage AS (
        SELECT CAST(COALESCE(
            ?,
            (SELECT id FROM packagemaster WHERE LOWER(asPackageName) = LOWER(?) LIMIT 1),
            (SELECT PackageId FROM storeinit LIMIT 1)
        ) AS INTEGER) AS base_id
    ),
    ResolvedPackages(package_id) AS (
        SELECT base_id
        FROM TargetPackage
        WHERE base_id IS NOT NULL AND base_id > 0
        
        UNION
        
        SELECT CAST(TRIM(item.value) AS INTEGER)
        FROM packagemaster p
        JOIN ResolvedPackages rp ON (p.id = rp.package_id)
        JOIN json_each(
            CASE 
                WHEN p.IncludePackageid IS NOT NULL AND TRIM(p.IncludePackageid) != ''
                THEN '["' || REPLACE(TRIM(p.IncludePackageid), ',', '","') || '"]'
                ELSE '[]'
            END
        ) item
        WHERE TRIM(item.value) != '' AND CAST(TRIM(item.value) AS INTEGER) > 0
    ),
    FilteredDesigns AS (
        SELECT *
        FROM "${cleanTable}"
        WHERE category IS NOT NULL AND TRIM(category) != ''
          AND (
            NOT EXISTS (SELECT 1 FROM ResolvedPackages)
            OR PackageIdList IS NULL 
            OR TRIM(PackageIdList) = ''
            OR EXISTS (
                SELECT 1 FROM ResolvedPackages rp
                WHERE (',' || REPLACE(COALESCE(PackageIdList, ''), ' ', '') || ',') 
                      LIKE ('%,' || rp.package_id || ',%')
            )
          )
    ),
    CategoryCounts AS (
      SELECT 
        category,
        categoryid,
        COUNT(*) AS designCount
      FROM FilteredDesigns
      GROUP BY category
    ),
    RankedProducts AS (
      SELECT 
        *,
        ROW_NUMBER() OVER (
          PARTITION BY category 
          ORDER BY 
            CASE WHEN ImageCount > 0 THEN 1 ELSE 2 END ASC,
            DisplayOrder ASC, 
            id ASC
        ) AS rank
      FROM FilteredDesigns
    )
    SELECT 
      c.category AS CategoryName,
      c.categoryid AS categoryId,
      c.designCount,
      p.DesignId,
      p.designno,
      p.autocode,
      p.TitleLine,
      p.ImageCount,
      p.ImageExtension,
      p.ImageVideoDetail,
      p.UnitCostWithMarkUpIncTax,
      p.UnitCost,
      p.MetalColorid,
      p.MetalPurityid
    FROM CategoryCounts c
    JOIN RankedProducts p ON c.category = p.category AND p.rank = 1
    ORDER BY c.designCount DESC
  `;

  let rows = [];
  try {
    rows = db.prepare(aggSql).all(pkgIdParam, pkgNameParam);
  } catch (aggErr) {
    console.error(`[rebuildPolicyCategories] Aggregation error for '${cleanTable}':`, aggErr.message);
    return [];
  }

  // Materialize into policy_categories inside an atomic transaction
  const insertStmt = db.prepare(`
    INSERT INTO "${POLICY_CATEGORIES_TABLE}" (
      table_name,
      CategoryName,
      categoryId,
      designCount,
      DesignId,
      designno,
      autocode,
      TitleLine,
      ImageCount,
      ImageExtension,
      ImageVideoDetail,
      UnitCost,
      UnitCostWithMarkUpIncTax,
      MetalColorid,
      MetalPurityid,
      updated_at
    ) VALUES (
      @table_name,
      @CategoryName,
      @categoryId,
      @designCount,
      @DesignId,
      @designno,
      @autocode,
      @TitleLine,
      @ImageCount,
      @ImageExtension,
      @ImageVideoDetail,
      @UnitCost,
      @UnitCostWithMarkUpIncTax,
      @MetalColorid,
      @MetalPurityid,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(table_name, CategoryName) DO UPDATE SET
      categoryId = excluded.categoryId,
      designCount = excluded.designCount,
      DesignId = excluded.DesignId,
      designno = excluded.designno,
      autocode = excluded.autocode,
      TitleLine = excluded.TitleLine,
      ImageCount = excluded.ImageCount,
      ImageExtension = excluded.ImageExtension,
      ImageVideoDetail = excluded.ImageVideoDetail,
      UnitCost = excluded.UnitCost,
      UnitCostWithMarkUpIncTax = excluded.UnitCostWithMarkUpIncTax,
      MetalColorid = excluded.MetalColorid,
      MetalPurityid = excluded.MetalPurityid,
      updated_at = CURRENT_TIMESTAMP
  `);

  const deleteOldStmt = db.prepare(`DELETE FROM "${POLICY_CATEGORIES_TABLE}" WHERE table_name = ?`);

  const persistTx = db.transaction((items) => {
    deleteOldStmt.run(cleanTable);
    for (const item of items) {
      insertStmt.run({
        table_name: cleanTable,
        CategoryName: item.CategoryName,
        categoryId: item.categoryId ?? null,
        designCount: item.designCount || 0,
        DesignId: item.DesignId ?? null,
        designno: item.designno ?? "",
        autocode: item.autocode ?? "",
        TitleLine: item.TitleLine ?? "",
        ImageCount: item.ImageCount || 0,
        ImageExtension: item.ImageExtension || "jpg",
        ImageVideoDetail: item.ImageVideoDetail ?? "",
        UnitCost: item.UnitCost ?? null,
        UnitCostWithMarkUpIncTax: item.UnitCostWithMarkUpIncTax ?? null,
        MetalColorid: item.MetalColorid ?? null,
        MetalPurityid: item.MetalPurityid ?? null,
      });
    }
  });

  persistTx(rows);

  return rows.map((r) => ({
    ...r,
    categoryName: r.CategoryName,
    id: r.categoryId,
    firstProduct: {
      DesignId: r.DesignId,
      designno: r.designno,
      autocode: r.autocode,
      TitleLine: r.TitleLine,
      ImageCount: r.ImageCount,
      ImageExtension: r.ImageExtension,
      ImageVideoDetail: r.ImageVideoDetail,
      UnitCostWithMarkUpIncTax: r.UnitCostWithMarkUpIncTax,
      UnitCost: r.UnitCost,
    },
  }));
}

export default {
  rebuildPolicyCategories,
};
