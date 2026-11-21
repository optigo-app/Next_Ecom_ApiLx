import { getTenantDb } from "@/db/tenantManager";
import { isPackageFilterDisabled } from "@/db/packageScope";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export const PRODUCT_SITEMAP_PAGE_SIZE = 45000;

export function formatProductDetailSlug(product) {
  const title = String(product?.TitleLine ?? "");
  const titlePrefix = !title || title.toLowerCase() === "null"
    ? ""
    : `${title.replace(/\s+/g, "_")}_`;
  return `${titlePrefix}${String(product?.designno ?? "")}`;
}

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function getDesignTables(db) {
  if (!db) return [];
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table'
      AND (name = 'designs' OR name LIKE 'design_Productlist_%')
    ORDER BY CASE WHEN name = 'designs' THEN 0 ELSE 1 END, name
  `).all();

  return tables.map(({ name }) => {
    const columns = new Set(db.prepare(`PRAGMA table_info(${quoteIdentifier(name)})`)
      .all().map((column) => column.name));
    return { name, columns };
  }).filter(({ columns }) => columns.has("designno"));
}

function getPackageCte(disabled) {
  if (disabled) return "";
  return `WITH RECURSIVE
    TargetPackage(base_id) AS (
      SELECT CAST((SELECT PackageId FROM storeinit LIMIT 1) AS INTEGER)
    ),
    ResolvedPackages(package_id) AS (
      SELECT base_id FROM TargetPackage WHERE base_id IS NOT NULL AND base_id > 0
      UNION
      SELECT CAST(TRIM(item.value) AS INTEGER)
      FROM packagemaster p
      JOIN ResolvedPackages rp ON p.id = rp.package_id
      JOIN json_each(
        CASE
          WHEN p.IncludePackageid IS NOT NULL AND TRIM(p.IncludePackageid) != ''
          THEN '["' || REPLACE(TRIM(p.IncludePackageid), ',', '","') || '"]'
          ELSE '[]'
        END
      ) item
      WHERE TRIM(item.value) != '' AND CAST(TRIM(item.value) AS INTEGER) > 0
    ),`;
}

function getSourceRowsCte(db, tables) {
  if (!tables.length) return null;
  const packageFilterDisabled = isPackageFilterDisabled(db);
  const sourceQueries = tables.map(({ name, columns }, sourceRank) => {
    const table = quoteIdentifier(name);
    const title = columns.has("TitleLine") ? "TitleLine" : "''";
    const updated = columns.has("updated_at") ? "updated_at" : "NULL";
    const entryDate = columns.has("EntryDate") ? "EntryDate" : "NULL";
    const rowId = columns.has("id") ? "id" : "rowid";
    const packageIds = columns.has("PackageIdList") ? "PackageIdList" : "NULL";
    const visibility = packageFilterDisabled ? "" : `
      AND (
        ${packageIds} IS NULL OR TRIM(${packageIds}) = ''
        OR NOT EXISTS (SELECT 1 FROM ResolvedPackages)
        OR EXISTS (
          SELECT 1 FROM ResolvedPackages rp
          WHERE (',' || REPLACE(COALESCE(${packageIds}, ''), ' ', '') || ',')
            LIKE ('%,' || rp.package_id || ',%')
        )
      )`;
    return `SELECT designno, ${title} AS TitleLine,
        COALESCE(${updated}, ${entryDate}) AS lastModified,
        ${rowId} AS sourceId, ${sourceRank} AS sourceRank
      FROM ${table}
      WHERE designno IS NOT NULL AND TRIM(CAST(designno AS TEXT)) <> '' ${visibility}`;
  });

  const packageCte = getPackageCte(packageFilterDisabled);
  return `${packageCte}${packageCte ? "," : ""}
    SourceRows AS (${sourceQueries.join("\nUNION ALL\n")})`;
}

function getRankedSourceCte(sourceCte) {
  return `${sourceCte}, RankedRows AS (
    SELECT designno, TitleLine, lastModified,
      ROW_NUMBER() OVER (
        PARTITION BY designno COLLATE NOCASE
        ORDER BY sourceRank, sourceId
      ) AS rowNumber
    FROM SourceRows
  )`;
}

export async function getCurrentTenantDomain() {
  const domainInfo = await getDomainInfo().catch(() => ({}));
  return domainInfo?.hostname || "";
}

export async function getProductSitemapCount() {
  const db = getTenantDb(await getCurrentTenantDomain());
  const sourceCte = getSourceRowsCte(db, getDesignTables(db));
  if (!sourceCte) return 0;
  const result = db.prepare(`
    ${sourceCte}
    SELECT COUNT(*) AS total FROM (
      SELECT designno FROM SourceRows GROUP BY designno COLLATE NOCASE
    )
  `).get();
  return Number(result?.total) || 0;
}

export async function getProductSitemapRows(pageIndex = 0) {
  const db = getTenantDb(await getCurrentTenantDomain());
  const sourceCte = getSourceRowsCte(db, getDesignTables(db));
  if (!sourceCte) return [];
  const page = Math.max(0, Number(pageIndex) || 0);
  return db.prepare(`
    ${getRankedSourceCte(sourceCte)}
    SELECT designno, TitleLine, lastModified
    FROM RankedRows WHERE rowNumber = 1
    ORDER BY designno COLLATE NOCASE
    LIMIT ? OFFSET ?
  `).all(PRODUCT_SITEMAP_PAGE_SIZE, page * PRODUCT_SITEMAP_PAGE_SIZE);
}

function findProductInTables(db, tables, designno) {
  const packageFilterDisabled = isPackageFilterDisabled(db);
  for (const { name, columns } of tables) {
    const table = quoteIdentifier(name);
    const packageIds = columns.has("PackageIdList") ? "PackageIdList" : "NULL";
    const visibility = packageFilterDisabled ? "" : `
      AND (
        ${packageIds} IS NULL OR TRIM(${packageIds}) = ''
        OR NOT EXISTS (SELECT 1 FROM ResolvedPackages)
        OR EXISTS (
          SELECT 1 FROM ResolvedPackages rp
          WHERE (',' || REPLACE(COALESCE(${packageIds}, ''), ' ', '') || ',')
            LIKE ('%,' || rp.package_id || ',%')
        )
      )`;
    const idOrder = columns.has("id") ? "id" : "rowid";
    const cte = getPackageCte(packageFilterDisabled);
    const product = db.prepare(`
      ${cte}
      SELECT * FROM ${table}
      WHERE designno = ? COLLATE NOCASE ${visibility}
      ORDER BY ${idOrder} ASC LIMIT 1
    `).get(String(designno).trim());
    if (product) return product;
  }
  return null;
}

export async function getProductByDesignNo(designno) {
  if (!designno) return null;
  const db = getTenantDb(await getCurrentTenantDomain());
  return findProductInTables(db, getDesignTables(db), designno);
}

export async function getProductByDetailSlug(slug) {
  const normalizedSlug = String(slug ?? "").trim();
  const designNoCandidates = [];
  for (let index = normalizedSlug.lastIndexOf("_"); index >= 0; index = normalizedSlug.lastIndexOf("_", index - 1)) {
    designNoCandidates.push(normalizedSlug.slice(index + 1));
  }
  designNoCandidates.push(normalizedSlug);

  const db = getTenantDb(await getCurrentTenantDomain());
  const tables = getDesignTables(db);
  const candidates = [...new Set(designNoCandidates.filter(Boolean))].slice(0, 900);
  if (!db || tables.length === 0 || candidates.length === 0) return null;

  for (const candidate of candidates) {
    const product = findProductInTables(db, tables, candidate);
    if (product && formatProductDetailSlug(product).toLowerCase() === normalizedSlug.toLowerCase()) {
      return product;
    }
  }
  return null;
}
