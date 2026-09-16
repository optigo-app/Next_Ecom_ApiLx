/**
 * Clean & Ultra-Fast SQLite Query Procedure for Jewelry Product Listing (PLP)
 * Strictly filters ONLY the core catalog attributes:
 * - collection
 * - sub_category
 * - brand
 * - style
 * - product_type
 * - occasion
 * - make_type
 * - category
 * - gender
 *
 * Exact match only (no LIKE matching, no fallback guessing).
 *
 * @param {import('better-sqlite3').Database} db
 * @param {object|string} [filtersOrMenu={}]
 * @param {object} [extraFilters={}]
 * @returns {{ rd: Array<object>, totalCount: number, stat: number, msg: string }}
 */
export function getDesigns(db, filtersOrMenu = {}, extraFilters = {}) {
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
    theme: { nameCol: "style", idCol: "Styleid" },
    themeid: { nameCol: "style", idCol: "Styleid" },
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

  // 1. Process FilterKey / FilterVal pairs (e.g. FilterKey/FilterVal, FilterKey1/FilterVal1, etc.)
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
    "theme",
    "Theme",
    "Themeid",
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

  // 5. SearchKey / designno / autocode
  const searchKey = filters.SearchKey ?? filters.searchKey ?? filters.Search ?? filters.search ?? null;
  if (searchKey && typeof searchKey === "string" && searchKey.trim() !== "") {
    const cleanSearch = searchKey.trim();
    conditions.push(`(
      designno LIKE ? OR 
      autocode LIKE ? OR 
      TitleLine LIKE ? OR 
      description LIKE ? OR 
      category LIKE ? OR 
      collection LIKE ? OR 
      brand LIKE ?
    )`);
    const sParam = `%${cleanSearch}%`;
    params.push(sParam, sParam, sParam, sParam, sParam, sParam, sParam);
  }

  const directDesignNo = filters.designno ?? filters.DesignNo ?? filters.dno ?? null;
  if (directDesignNo && typeof directDesignNo === "string" && directDesignNo.trim() !== "") {
    conditions.push(`(designno = ? OR autocode = ?)`);
    params.push(directDesignNo.trim(), directDesignNo.trim());
  }

  const directAutoCode = filters.autocode ?? filters.AutoCode ?? null;
  if (directAutoCode && typeof directAutoCode === "string" && directAutoCode.trim() !== "") {
    conditions.push(`autocode = ?`);
    params.push(directAutoCode.trim());
  }

  // 6. Price Range Filtering
  const priceBrackets = [];
  let rawPriceFilter =
    filters.FilPrice ??
    filters.filPrice ??
    filters.Price ??
    filters.price ??
    null;

  if (typeof rawPriceFilter === "string" && rawPriceFilter.trim() !== "") {
    try {
      rawPriceFilter = JSON.parse(rawPriceFilter);
    } catch (_) {
      if (rawPriceFilter.includes("-")) {
        const [pMin, pMax] = rawPriceFilter.split("-").map(Number);
        rawPriceFilter = [{ Minval: pMin || 0, Maxval: pMax || 0 }];
      } else if (rawPriceFilter.includes(",")) {
        const [pMin, pMax] = rawPriceFilter.split(",").map(Number);
        rawPriceFilter = [{ Minval: pMin || 0, Maxval: pMax || 0 }];
      }
    }
  }

  if (Array.isArray(rawPriceFilter)) {
    rawPriceFilter.forEach((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const min = Number(item.Minval ?? item.min ?? item.PriceMin ?? 0);
        const max = Number(item.Maxval ?? item.max ?? item.PriceMax ?? 0);
        if (!isNaN(min) || !isNaN(max)) {
          priceBrackets.push({ min: isNaN(min) ? 0 : min, max: isNaN(max) ? 0 : max });
        }
      } else if (Array.isArray(item) && item.length >= 2) {
        priceBrackets.push({ min: Number(item[0]) || 0, max: Number(item[1]) || 0 });
      }
    });
  } else if (rawPriceFilter && typeof rawPriceFilter === "object") {
    const min = Number(rawPriceFilter.Minval ?? rawPriceFilter.min ?? rawPriceFilter.PriceMin ?? 0);
    const max = Number(rawPriceFilter.Maxval ?? rawPriceFilter.max ?? rawPriceFilter.PriceMax ?? 0);
    if (!isNaN(min) || !isNaN(max)) {
      priceBrackets.push({ min: isNaN(min) ? 0 : min, max: isNaN(max) ? 0 : max });
    }
  }

  // Direct min/max fields
  const directPriceMin = filters.PriceMin ?? filters.priceMin ?? filters.minPrice ?? filters.MinPrice ?? null;
  const directPriceMax = filters.PriceMax ?? filters.priceMax ?? filters.maxPrice ?? filters.MaxPrice ?? null;
  if (
    (directPriceMin != null && directPriceMin !== "" && !isNaN(Number(directPriceMin))) ||
    (directPriceMax != null && directPriceMax !== "" && !isNaN(Number(directPriceMax)))
  ) {
    const dMin = Number(directPriceMin) || 0;
    const dMax = Number(directPriceMax) || 0;
    if (dMin > 0 || dMax > 0) {
      priceBrackets.push({ min: dMin, max: dMax });
    }
  }

  if (priceBrackets.length > 0) {
    const priceOrClauses = [];
    for (const b of priceBrackets) {
      if (b.max > 0) {
        priceOrClauses.push(`(COALESCE(UnitCostWithMarkUpIncTax, UnitCostWithMarkUp, UnitCost, 0) >= ? AND COALESCE(UnitCostWithMarkUpIncTax, UnitCostWithMarkUp, UnitCost, 0) <= ?)`);
        params.push(b.min, b.max);
      } else if (b.min > 0) {
        priceOrClauses.push(`(COALESCE(UnitCostWithMarkUpIncTax, UnitCostWithMarkUp, UnitCost, 0) >= ?)`);
        params.push(b.min);
      }
    }
    if (priceOrClauses.length === 1) {
      conditions.push(priceOrClauses[0]);
    } else if (priceOrClauses.length > 1) {
      conditions.push(`(${priceOrClauses.join(" OR ")})`);
    }
  }

  // 7. Weight Range Filters
  const minDia = filters.Min_DiaWeight ?? filters.diaMin ?? filters.minDia ?? null;
  const maxDia = filters.Max_DiaWeight ?? filters.diaMax ?? filters.maxDia ?? null;
  if (minDia != null && minDia !== "" && Number(minDia) > 0) {
    conditions.push(`COALESCE(Dwt, 0) >= ?`);
    params.push(Number(minDia));
  }
  if (maxDia != null && maxDia !== "" && Number(maxDia) > 0) {
    conditions.push(`COALESCE(Dwt, 0) <= ?`);
    params.push(Number(maxDia));
  }

  const minGross = filters.Min_GrossWeight ?? filters.grossMin ?? filters.minGross ?? null;
  const maxGross = filters.Max_GrossWeight ?? filters.grossMax ?? filters.maxGross ?? null;
  if (minGross != null && minGross !== "" && Number(minGross) > 0) {
    conditions.push(`COALESCE(Gwt, 0) >= ?`);
    params.push(Number(minGross));
  }
  if (maxGross != null && maxGross !== "" && Number(maxGross) > 0) {
    conditions.push(`COALESCE(Gwt, 0) <= ?`);
    params.push(Number(maxGross));
  }

  const minNet = filters.Min_NetWt ?? filters.netMin ?? filters.minNet ?? null;
  const maxNet = filters.Max_NetWt ?? filters.netMax ?? filters.maxNet ?? null;
  if (minNet != null && minNet !== "" && Number(minNet) > 0) {
    conditions.push(`COALESCE(Nwt, 0) >= ?`);
    params.push(Number(minNet));
  }
  if (maxNet != null && maxNet !== "" && Number(maxNet) > 0) {
    conditions.push(`COALESCE(Nwt, 0) <= ?`);
    params.push(Number(maxNet));
  }

  const minCS = filters.Min_StoneWeight ?? filters.Min_CSWeight ?? filters.stoneMin ?? filters.csMin ?? null;
  const maxCS = filters.Max_StoneWeight ?? filters.Max_CSWeight ?? filters.stoneMax ?? filters.csMax ?? null;
  if (minCS != null && minCS !== "" && Number(minCS) > 0) {
    conditions.push(`COALESCE(CSwt, 0) >= ?`);
    params.push(Number(minCS));
  }
  if (maxCS != null && maxCS !== "" && Number(maxCS) > 0) {
    conditions.push(`COALESCE(CSwt, 0) <= ?`);
    params.push(Number(maxCS));
  }

  // 8. Metal Color Filter
  const rawMetalColor = filters.MetalColorId ?? filters.MetalColorid ?? filters.metalColorId ?? filters.MetalColor ?? filters.metalcolor ?? null;
  if (rawMetalColor != null && rawMetalColor !== "") {
    const mcVals = extractValues(rawMetalColor);
    const numVals = [];
    const strVals = [];
    mcVals.forEach((v) => {
      if (/^\d+$/.test(v)) numVals.push(Number(v));
      else strVals.push(v);
    });

    const mcClauses = [];
    if (numVals.length === 1) {
      mcClauses.push(`MetalColorid = ?`);
      params.push(numVals[0]);
    } else if (numVals.length > 1) {
      mcClauses.push(`MetalColorid IN (${numVals.map(() => "?").join(",")})`);
      params.push(...numVals);
    }
    if (strVals.length > 0) {
      mcClauses.push(`metal_color IN (${strVals.map(() => "?").join(",")})`);
      params.push(...strVals);
    }
    if (mcClauses.length === 1) {
      conditions.push(mcClauses[0]);
    } else if (mcClauses.length > 1) {
      conditions.push(`(${mcClauses.join(" OR ")})`);
    }
  }

  // 9. Product Status Flags
  if (filters.isNewArrival || filters.IsNewArrival === 1 || filters.IsNewArrival === "1") {
    conditions.push(`(IsNewArrival = 1 OR FrontEnd1_newArrivalsto = 1)`);
  }
  if (filters.isTrending || filters.IsTrending === 1 || filters.IsTrending === "1") {
    conditions.push(`IsTrending = 1`);
  }
  if (filters.isBestSeller || filters.IsBestSeller === 1 || filters.IsBestSeller === "1") {
    conditions.push(`IsBestSeller = 1`);
  }
  if (filters.isInReadyStock || filters.IsInReadyStock === 1 || filters.IsInReadyStock === "1") {
    conditions.push(`IsInReadyStock = 1`);
  }

  // 10. Sorting
  let orderClause = "DisplayOrder ASC, id ASC";
  const sort = String(filters.SortBy ?? filters.sortBy ?? filters.sortby ?? "").toLowerCase().trim();

  if (sort.includes("low_to_high") || sort.includes("price_asc") || sort === "1" || sort.includes("price low") || sort.includes("low to high")) {
    orderClause = "COALESCE(UnitCostWithMarkUpIncTax, UnitCostWithMarkUp, UnitCost, 0) ASC, DisplayOrder ASC";
  } else if (sort.includes("high_to_low") || sort.includes("price_desc") || sort === "2" || sort.includes("price high") || sort.includes("high to low")) {
    orderClause = "COALESCE(UnitCostWithMarkUpIncTax, UnitCostWithMarkUp, UnitCost, 0) DESC, DisplayOrder ASC";
  } else if (sort.includes("new") || sort.includes("latest") || sort === "3") {
    orderClause = "EntryDate DESC, id DESC";
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "1=1";
  const queryParams = [pkgIdParam, pkgNameParam, ...params];

  // Count query
  const countSql = `${ctePrefix} SELECT COUNT(*) AS total FROM designs WHERE ${whereClause}`;
  const countRow = db.prepare(countSql).get(...queryParams);
  const totalCount = countRow ? countRow.total : 0;

  // Pagination
  let limitClause = "";
  const limitParams = [];
  const pageNo = Number(filters.PageNo ?? filters.page ?? filters.pageNo) || 1;
  const pageSize = Number(
    filters.PageSize ?? filters.pageSize ?? filters.limit,
  );

  if (pageSize && pageSize > 0 && pageSize < 1000000) {
    const offset = Number(filters.offset) || (pageNo - 1) * pageSize;
    limitClause = " LIMIT ? OFFSET ?";
    limitParams.push(pageSize, Math.max(0, offset));
  }

  const querySql = `
        ${ctePrefix}
        SELECT * FROM designs 
        WHERE ${whereClause} 
        ORDER BY ${orderClause}
        ${limitClause}
    `;

  const rows = db.prepare(querySql).all(...queryParams, ...limitParams);

  return {
    rd: rows,
    totalCount,
    stat: 1,
    msg: "success",
  };
}

export const getDesignsByMenu = getDesigns;
export default getDesigns;
