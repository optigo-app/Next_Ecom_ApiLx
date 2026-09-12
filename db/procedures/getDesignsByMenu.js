/**
 * Clean & Ultra-Fast SQLite Query Procedure for Jewelry Product Listing (PLP)
 * Strictly filters ONLY the core 9 catalog attributes:
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
 * Returns all columns (SELECT * FROM designs WHERE ...)
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
            const keys = keyPart.split(",").map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, ""));
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
                let rawB64 = filters.M.startsWith("M=") ? filters.M.slice(2) : filters.M;
                let decoded = Buffer.from(rawB64, "base64").toString("utf-8");
                if (decoded.includes("/")) {
                    const [valPart, keyPart] = decoded.split("/");
                    const keys = keyPart.split(",").map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, ""));
                    const vals = valPart.split(",").map((s) => s.trim().replace(/%20/g, " "));
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

    const conditions = [];
    const params = [];

    // Normalizer for the 9 core fields
    const normalizeColumn = (key) => {
        if (!key || typeof key !== "string") return null;
        const clean = key.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
        const columnMap = {
            collection: "collection",
            collectionid: "collection",
            subcategory: "sub_category",
            sub_category: "sub_category",
            subcategoryid: "sub_category",
            brand: "brand",
            brandid: "brand",
            style: "style",
            styleid: "style",
            producttype: "product_type",
            product_type: "product_type",
            producttypeid: "product_type",
            occasion: "occasion",
            ocassion: "occasion",
            occasionid: "occasion",
            ocassionid: "occasion",
            maketype: "make_type",
            make_type: "make_type",
            maketypeid: "make_type",
            category: "category",
            categoryid: "category",
            gender: "gender",
            genderid: "gender",
        };
        return columnMap[clean] || null;
    };

    // Helper: extract array/comma-separated strings
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

    // 1. Process FilterKey / FilterVal pairs (e.g. FilterKey/FilterVal, FilterKey1/FilterVal1, FilterKey2/FilterVal2, etc.)
    for (let i = 0; i <= 10; i++) {
        const kName = i === 0 ? "FilterKey" : `FilterKey${i}`;
        const vName = i === 0 ? "FilterVal" : `FilterVal${i}`;

        const rawKey = filters[kName];
        const rawVal = filters[vName];

        if (rawKey && rawVal && String(rawKey).toLowerCase() !== "auto") {
            const col = normalizeColumn(rawKey);
            if (col) {
                if (!collectedAttributes[col]) collectedAttributes[col] = [];
                collectedAttributes[col].push(...extractValues(rawVal));
            }
        }
    }

    // 2. Direct attribute keys
    const directKeys = [
        "collection", "Collection", "Collectionid",
        "sub_category", "SubCategory", "SubCategoryid", "subcategory",
        "brand", "Brand", "Brandid",
        "style", "Style", "Styleid",
        "product_type", "ProductType", "Producttypeid", "producttype",
        "occasion", "Occasion", "Ocassionid", "occasionid", "ocassionid",
        "make_type", "MakeType", "Maketypeid", "maketype",
        "category", "Category", "Categoryid",
        "gender", "Gender", "Genderid",
    ];

    for (const dKey of directKeys) {
        if (filters[dKey] != null && filters[dKey] !== "") {
            const col = normalizeColumn(dKey);
            if (col) {
                if (!collectedAttributes[col]) collectedAttributes[col] = [];
                collectedAttributes[col].push(...extractValues(filters[dKey]));
            }
        }
    }

    // 3. Build SQL WHERE clause for the 9 fields (strict exact matching)
    for (const [column, rawList] of Object.entries(collectedAttributes)) {
        const uniqueValues = Array.from(new Set(rawList.filter(Boolean)));
        if (uniqueValues.length === 0) continue;

        const orClauses = [];
        for (const v of uniqueValues) {
            const cleanVal = String(v).trim();
            if (!cleanVal) continue;

            if (column === "collection" && cleanVal.length <= 2) {
                // Prefix match for short collection abbreviations (e.g. "A" -> "Aquila", "Artifact")
                orClauses.push(`("${column}" = ? COLLATE NOCASE OR "${column}" LIKE ?)`);
                params.push(cleanVal, `${cleanVal}%`);
            } else {
                orClauses.push(`"${column}" = ? COLLATE NOCASE`);
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

    // Count query
    const countSql = `SELECT COUNT(*) AS total FROM designs WHERE ${whereClause}`;
    const countRow = db.prepare(countSql).get(...params);
    const totalCount = countRow ? countRow.total : 0;

    // Sorting (default to DisplayOrder)
    let orderClause = "DisplayOrder ASC, id ASC";
    const sort = String(filters.SortBy ?? filters.sortBy ?? filters.sortby ?? "").toLowerCase().trim();

    if (sort.includes("low_to_high") || sort.includes("price_asc") || sort === "1" || sort.includes("price low")) {
        orderClause = "UnitCostWithMarkUpIncTax ASC, DisplayOrder ASC";
    } else if (sort.includes("high_to_low") || sort.includes("price_desc") || sort === "2" || sort.includes("price high")) {
        orderClause = "UnitCostWithMarkUpIncTax DESC, DisplayOrder ASC";
    } else if (sort.includes("new") || sort.includes("latest") || sort === "3") {
        orderClause = "EntryDate DESC, id DESC";
    }

    // Pagination
    let limitClause = "";
    const limitParams = [];
    const pageNo = Number(filters.PageNo ?? filters.page ?? filters.pageNo) || 1;
    const pageSize = Number(filters.PageSize ?? filters.pageSize ?? filters.limit);

    if (pageSize && pageSize > 0 && pageSize < 1000000) {
        const offset = Number(filters.offset) || (pageNo - 1) * pageSize;
        limitClause = " LIMIT ? OFFSET ?";
        limitParams.push(pageSize, Math.max(0, offset));
    }

    const querySql = `
        SELECT * FROM designs 
        WHERE ${whereClause} 
        ORDER BY ${orderClause}
        ${limitClause}
    `;

    const rows = db.prepare(querySql).all(...params, ...limitParams);

    return {
        rd: rows,
        totalCount,
        stat: 1,
        msg: "success",
    };
}

export const getDesignsByMenu = getDesigns;
export default getDesigns;
