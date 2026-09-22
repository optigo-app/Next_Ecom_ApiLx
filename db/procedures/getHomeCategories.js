import { resolveHomeTable } from "./getHomeProducts.js";

/**
 * Ultra-Fast Direct Query for Home Categories from SQLite.
 * Returns unique category names, design counts, and the best first preview product.
 * Strictly respects active store PackageId permissions (matching PLP getDesignsByMenu).
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

    const rawPkgId =
      options.PackageId ??
      options.packageId ??
      options.PackageID ??
      options.packageid ??
      null;
    const rawPkgName = options.PackageName ?? options.packageName ?? null;
    const pkgIdParam =
      rawPkgId != null && rawPkgId !== "" ? Number(rawPkgId) : null;
    const pkgNameParam =
      rawPkgName != null && rawPkgName !== "" ? String(rawPkgName).trim() : null;

    let sql = `
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
          FROM "${targetTable}"
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
        c.category AS categoryName,
        c.categoryid AS categoryId,
        c.categoryid AS id,
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

    const queryParams = [pkgIdParam, pkgNameParam];

    if (limit) {
      sql += ` LIMIT ?`;
      queryParams.push(limit);
    }

    const rows = db.prepare(sql).all(...queryParams);

    const formattedRows = rows.map((row) => ({
      ...row,
      firstProduct: {
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
