/**
 * Clean & Ultra-Fast SQLite Query Procedure for Dynamic Filter Lists (GETFILTERLIST)
 * Generates facet options and ranges directly from matching products in SQLite.
 * Matches exact SQL Server GETFILTERLIST structure and response schema.
 *
 * @param {import('better-sqlite3').Database} db
 * @param {object|string} [filtersOrMenu={}]
 * @param {object} [extraFilters={}]
 * @returns {Array<object>} - Array matching the GETFILTERLIST 'rd' response structure
 */
export function getFilterList(db, filtersOrMenu = {}, extraFilters = {}) {
  let filters = {};

  if (Array.isArray(filtersOrMenu) && filtersOrMenu.length >= 2) {
    const keys = Array.isArray(filtersOrMenu[0]) ? filtersOrMenu[0] : [];
    const vals = Array.isArray(filtersOrMenu[1]) ? filtersOrMenu[1] : [];
    keys.forEach((k, idx) => {
      if (k && String(k).toLowerCase() !== "auto") {
        const v = vals[idx];
        if (v) filters[k] = v;
      }
    });
    filters = { ...filters, ...extraFilters };
  } else if (typeof filtersOrMenu === "string") {
    let str = filtersOrMenu;
    if (str.startsWith("M=")) str = str.slice(2);
    try {
      if (!str.includes("/") && /^[A-Za-z0-9+/=]+$/.test(str)) {
        str = Buffer.from(str, "base64").toString("utf-8");
      }
    } catch (_) {}
    if (str.includes("/")) {
      const [valPart, keyPart] = str.split("/");
      const keys = keyPart
        .split(",")
        .map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, ""));
      const vals = valPart.split(",").map((s) => s.trim().replace(/%20/g, " "));
      keys.forEach((k, idx) => {
        const v = vals[idx] ? vals[idx].trim() : "";
        if (k && k.toLowerCase() !== "auto" && v) {
          filters[k] = v;
        }
      });
    }
    filters = { ...filters, ...extraFilters };
  } else if (typeof filtersOrMenu === "object" && filtersOrMenu !== null) {
    filters = { ...filtersOrMenu, ...extraFilters };
    if (filters.M && typeof filters.M === "string") {
      try {
        let rawB64 = filters.M.startsWith("M=")
          ? filters.M.slice(2)
          : filters.M;
        let decoded = Buffer.from(rawB64, "base64").toString("utf-8");
        if (decoded.includes("/")) {
          const [valPart, keyPart] = decoded.split("/");
          const keys = keyPart
            .split(",")
            .map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, ""));
          const vals = valPart
            .split(",")
            .map((s) => s.trim().replace(/%20/g, " "));
          keys.forEach((k, idx) => {
            const v = vals[idx] ? vals[idx].trim() : "";
            if (k && k.toLowerCase() !== "auto" && v) {
              filters[k] = v;
            }
          });
        }
      } catch (_) {}
    }
  }

  // Column mapping for exact match
  const COLUMN_MAP = {
    collection: { nameCol: "collection", idCol: "collectionid" },
    collectionid: { nameCol: "collection", idCol: "collectionid" },
    sub_category: { nameCol: "sub_category", idCol: "sub_categoryid" },
    subcategory: { nameCol: "sub_category", idCol: "sub_categoryid" },
    subcategoryid: { nameCol: "sub_category", idCol: "sub_categoryid" },
    brand: { nameCol: "brand", idCol: "brandid" },
    brandid: { nameCol: "brand", idCol: "brandid" },
    style: { nameCol: "style", idCol: "Styleid" },
    styleid: { nameCol: "style", idCol: "Styleid" },
    product_type: { nameCol: "product_type", idCol: "product_typeid" },
    producttype: { nameCol: "product_type", idCol: "product_typeid" },
    producttypeid: { nameCol: "product_type", idCol: "product_typeid" },
    occasion: { nameCol: "occasion", idCol: "occasionid" },
    ocassion: { nameCol: "occasion", idCol: "occasionid" },
    occasionid: { nameCol: "occasion", idCol: "occasionid" },
    ocassionid: { nameCol: "occasion", idCol: "occasionid" },
    make_type: { nameCol: "make_type", idCol: "make_typeid" },
    maketype: { nameCol: "make_type", idCol: "make_typeid" },
    maketypeid: { nameCol: "make_type", idCol: "make_typeid" },
    category: { nameCol: "category", idCol: "categoryid" },
    categoryid: { nameCol: "category", idCol: "categoryid" },
    gender: { nameCol: "gender", idCol: "genderid" },
    genderid: { nameCol: "gender", idCol: "genderid" },
  };

  const normalizeKey = (key) => {
    if (!key || typeof key !== "string") return null;
    const clean = key
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    return COLUMN_MAP[clean] || null;
  };

  const extractValues = (val) => {
    if (val == null || val === "") return [];
    if (Array.isArray(val)) {
      return val.map((v) => String(v).trim()).filter(Boolean);
    }
    if (typeof val === "string") {
      return val
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [String(val).trim()];
  };

  const collectedAttributes = {};

  // 1. Process FilterKey / FilterVal pairs (e.g. from Menu)
  for (let i = 0; i <= 10; i++) {
    const kName = i === 0 ? "FilterKey" : `FilterKey${i}`;
    const vName = i === 0 ? "FilterVal" : `FilterVal${i}`;

    const rawKey = filters[kName];
    const rawVal = filters[vName];

    if (rawKey && rawVal && String(rawKey).toLowerCase() !== "auto") {
      const colCfg = normalizeKey(rawKey);
      if (colCfg) {
        const keyId = colCfg.nameCol;
        if (!collectedAttributes[keyId]) collectedAttributes[keyId] = { config: colCfg, values: [] };
        collectedAttributes[keyId].values.push(...extractValues(rawVal));
      }
    }
  }

  // 2. Direct attribute keys
  const directKeys = [
    "collection",
    "Collection",
    "Collectionid",
    "sub_category",
    "SubCategory",
    "SubCategoryid",
    "subcategory",
    "brand",
    "Brand",
    "Brandid",
    "style",
    "Style",
    "Styleid",
    "product_type",
    "ProductType",
    "Producttypeid",
    "producttype",
    "occasion",
    "Occasion",
    "Ocassionid",
    "occasionid",
    "ocassionid",
    "make_type",
    "MakeType",
    "Maketypeid",
    "maketype",
    "category",
    "Category",
    "Categoryid",
    "gender",
    "Gender",
    "Genderid",
  ];

  for (const dKey of directKeys) {
    if (filters[dKey] != null && filters[dKey] !== "") {
      const colCfg = normalizeKey(dKey);
      if (colCfg) {
        const keyId = colCfg.nameCol;
        if (!collectedAttributes[keyId]) collectedAttributes[keyId] = { config: colCfg, values: [] };
        collectedAttributes[keyId].values.push(...extractValues(filters[dKey]));
      }
    }
  }

  const conditions = [];
  const params = [];

  // 3. Package Filtering Support
  const rawPkgId =
    filters.PackageId ??
    filters.packageId ??
    filters.PackageID ??
    filters.packageid ??
    null;
  const rawPkgName = filters.PackageName ?? filters.packageName ?? null;
  const pkgIdParam =
    rawPkgId != null && rawPkgId !== "" ? Number(rawPkgId) : null;
  const pkgNameParam =
    rawPkgName != null && rawPkgName !== "" ? String(rawPkgName).trim() : null;

  const ctePrefix = `
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
)
`;

  // Package condition
  conditions.push(`(
        NOT EXISTS (SELECT 1 FROM ResolvedPackages)
        OR PackageIdList IS NULL 
        OR TRIM(PackageIdList) = ''
        OR EXISTS (
            SELECT 1 FROM ResolvedPackages rp
            WHERE (',' || REPLACE(COALESCE(PackageIdList, ''), ' ', '') || ',') 
                  LIKE ('%,' || rp.package_id || ',%')
        )
    )`);

  // 4. Strict exact matching for attributes
  for (const { config, values } of Object.values(collectedAttributes)) {
    const uniqueValues = Array.from(new Set(values.filter(Boolean)));
    if (uniqueValues.length === 0) continue;

    const orClauses = [];
    for (const v of uniqueValues) {
      const cleanVal = String(v).trim();
      if (!cleanVal) continue;

      if (/^\d+$/.test(cleanVal)) {
        orClauses.push(`("${config.idCol}" = ? OR "${config.nameCol}" = ? COLLATE NOCASE)`);
        params.push(Number(cleanVal), cleanVal);
      } else {
        orClauses.push(`"${config.nameCol}" = ? COLLATE NOCASE`);
        params.push(cleanVal);
      }
    }

    if (orClauses.length === 1) {
      conditions.push(orClauses[0]);
    } else if (orClauses.length > 1) {
      conditions.push(`(${orClauses.join(" OR ")})`);
    }
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "1=1";
  const queryParams = [pkgIdParam, pkgNameParam, ...params];

  // Common CTE table alias
  const fromClause = `${ctePrefix} SELECT * FROM designs WHERE ${whereClause}`;

  // Helper to query distinct attribute options
  const fetchAttributeOptions = (idCol, nameCol) => {
    try {
      const sql = `
        WITH FilteredDesigns AS (${fromClause})
        SELECT 
          CAST("${idCol}" AS INTEGER) AS id,
          TRIM("${nameCol}") AS Name
        FROM FilteredDesigns
        WHERE "${idCol}" IS NOT NULL AND "${idCol}" != 0 AND "${nameCol}" IS NOT NULL AND TRIM("${nameCol}") != ''
        GROUP BY "${idCol}", TRIM("${nameCol}")
        ORDER BY TRIM("${nameCol}") ASC
      `;
      const rows = db.prepare(sql).all(...queryParams);
      return rows;
    } catch (_) {
      return [];
    }
  };

  // Helper to query min/max ranges
  const fetchRange = (column) => {
    try {
      const sql = `
        WITH FilteredDesigns AS (${fromClause})
        SELECT 
          COALESCE(MIN("${column}"), 0) AS Min,
          COALESCE(MAX("${column}"), 0) AS Max
        FROM FilteredDesigns
        WHERE "${column}" IS NOT NULL AND "${column}" > 0
      `;
      const row = db.prepare(sql).get(...queryParams);
      return row ? [{ Min: row.Min || 0, Max: row.Max || 0 }] : [{ Min: 0, Max: 0 }];
    } catch (_) {
      return [{ Min: 0, Max: 0 }];
    }
  };

  // Standard Price brackets
  const rawPriceBrackets = [
    { Minval: 0, Maxval: 5000 },
    { Minval: 5001, Maxval: 10000 },
    { Minval: 10001, Maxval: 15000 },
    { Minval: 15001, Maxval: 20000 },
    { Minval: 20001, Maxval: 30000 },
    { Minval: 30001, Maxval: 40000 },
    { Minval: 40001, Maxval: 50000 },
    { Minval: 50001, Maxval: 75000 },
    { Minval: 75001, Maxval: 100000 },
    { Minval: 100001, Maxval: 150000 },
    { Minval: 150001, Maxval: 200000 },
    { Minval: 200001, Maxval: 250000 },
    { Minval: 250001, Maxval: 0 },
  ];

  const METAL_COLOR_NAMES = {
    1: "Yellow Gold",
    2: "Yellow",
    7: "P-W",
    8: "RG",
    13: "P",
    14: "White Gold",
    15: "Yellow Gold",
    17: "White G",
    19: "Yellow Gold",
    23: "Rose Gold",
    24: "White Gold",
    26: "FYellow1",
    33: "YELLOW-PH",
    35: "silver",
    36: "Green Gold",
  };

  // Helper to query distinct metal colors
  const fetchMetalColors = () => {
    try {
      const sql = `
        WITH FilteredDesigns AS (${fromClause})
        SELECT DISTINCT CAST(MetalColorid AS INTEGER) AS id
        FROM FilteredDesigns
        WHERE MetalColorid IS NOT NULL AND MetalColorid > 0
        ORDER BY MetalColorid ASC
      `;
      const rows = db.prepare(sql).all(...queryParams);
      if (rows.length === 0) {
        return [
          { id: 14, Name: "White Gold" },
          { id: 15, Name: "Yellow Gold" },
          { id: 23, Name: "Rose Gold" },
        ];
      }
      return rows.map((r) => ({
        id: r.id,
        Name: METAL_COLOR_NAMES[r.id] || `Color ${r.id}`,
      }));
    } catch (_) {
      return [
        { id: 14, Name: "White Gold" },
        { id: 15, Name: "Yellow Gold" },
        { id: 23, Name: "Rose Gold" },
      ];
    }
  };

  // Build filter list definitions matching exact GETFILTERLIST and nxtjulian
  const filterDefinitions = [
    {
      id: "collection",
      Name: "Collection",
      Fil_DisName: "Collection",
      Fil_No: 15,
      FilDisNo: 1,
      fetch: () => fetchAttributeOptions("collectionid", "collection"),
    },
    {
      id: "category",
      Name: "Category",
      Fil_DisName: "Category",
      Fil_No: 1,
      FilDisNo: 2,
      fetch: () => fetchAttributeOptions("categoryid", "category"),
    },
    {
      id: "subcategory",
      Name: "SubCategory",
      Fil_DisName: "Subcategory",
      Fil_No: 10,
      FilDisNo: 3,
      fetch: () => fetchAttributeOptions("sub_categoryid", "sub_category"),
    },
    {
      id: "brand",
      Name: "Brand",
      Fil_DisName: "Brands",
      Fil_No: 7,
      FilDisNo: 4,
      fetch: () => fetchAttributeOptions("brandid", "brand"),
    },
    {
      id: "gender",
      Name: "Gender",
      Fil_DisName: "Gender",
      Fil_No: 8,
      FilDisNo: 5,
      fetch: () => fetchAttributeOptions("genderid", "gender"),
    },
    {
      id: "ocassion",
      Name: "Ocassion",
      Fil_DisName: "Occasion",
      Fil_No: 9,
      FilDisNo: 6,
      fetch: () => fetchAttributeOptions("occasionid", "occasion"),
    },
    {
      id: "theme",
      Name: "Theme",
      Fil_DisName: "Style",
      Fil_No: 3,
      FilDisNo: 7,
      fetch: () => fetchAttributeOptions("Styleid", "style"),
    },
    {
      id: "producttype",
      Name: "Producttype",
      Fil_DisName: "Product Type",
      Fil_No: 2,
      FilDisNo: 8,
      fetch: () => fetchAttributeOptions("product_typeid", "product_type"),
    },
    {
      id: "metalcolor",
      Name: "MetalColor",
      Fil_DisName: "Metal color",
      Fil_No: 6,
      FilDisNo: 9,
      fetch: () => fetchMetalColors(),
    },
    {
      id: "Price",
      Name: "Price",
      Fil_DisName: "Price",
      Fil_No: 12,
      FilDisNo: 10,
      fetch: () => rawPriceBrackets,
    },
    {
      id: "Gross_Weight_Range",
      Name: "Gross",
      Fil_DisName: "GrossWt",
      Fil_No: 21,
      FilDisNo: 11,
      fetch: () => fetchRange("Gwt"),
    },
    {
      id: "Net_Weight_Range",
      Name: "NetWt",
      Fil_DisName: "NetWt",
      Fil_No: 22,
      FilDisNo: 12,
      fetch: () => fetchRange("Nwt"),
    },
    {
      id: "Diamond_Weight_Range",
      Name: "Diamond",
      Fil_DisName: "DiamondWt",
      Fil_No: 23,
      FilDisNo: 13,
      fetch: () => fetchRange("Dwt"),
    },
    {
      id: "Colorstone_Weight_Range",
      Name: "Colorstone",
      Fil_DisName: "StoneWt",
      Fil_No: 24,
      FilDisNo: 14,
      fetch: () => fetchRange("CSwt"),
    },
  ];

  // Execute and format result matching GETFILTERLIST
  const result = [];

  for (const def of filterDefinitions) {
    const opts = def.fetch();
    if (!opts || !Array.isArray(opts) || opts.length === 0) continue;

    // For range filters, only include if there is a valid non-zero range
    if (def.id && def.id.includes("Range")) {
      const r = opts[0];
      if (!r || (Number(r.Min || 0) === 0 && Number(r.Max || 0) === 0)) {
        continue;
      }
    }

    result.push({
      id: def.id,
      Name: def.Name,
      Fil_DisName: def.Fil_DisName,
      Fil_No: def.Fil_No,
      FilDisNo: def.FilDisNo,
      options: JSON.stringify(opts),
    });
  }

  // Sort by FilDisNo matching SQL Server stored procedure
  result.sort((a, b) => a.FilDisNo - b.FilDisNo);

  return result;
}

export default getFilterList;
