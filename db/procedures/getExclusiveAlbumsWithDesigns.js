import { resolveHomeTable } from "./getHomeProducts.js";

/**
 * Retrieves customer-exclusive albums joined with their respective design products from SQLite.
 * Uses default storeinit pricing policy / resolved productlist table.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {number|string} options.customerId - Target Customer ID
 * @param {number|string} [options.id] - Optional filter for specific album ID
 * @param {string} [options.albumcode] - Optional filter for album code
 * @param {string} [options.RandomNo] - Optional filter for RandomNo
 * @param {boolean} [options.includeDesigns=true] - Whether to fetch and attach designs
 * @returns {object} Standard response { Status: "200", Message: "...", Data: { rd: [...], storeConfig: {...} } }
 */
export function getExclusiveAlbumsWithDesigns(db, options = {}) {
  const startTime = performance.now();
  const customerId = options.customerId || options.CustomerId;

  if (!customerId && !options.RandomNo) {
    return {
      Status: "400",
      Message: "customerId or RandomNo is required to fetch exclusive albums.",
      Data: { rd: [] },
    };
  }

  // 1. Fetch store config for image paths & currency
  let storeConfig = {
    CDNDesignImageFol: "",
    DesignImageFol: "",
    Currencysymbol: "₹",
  };
  try {
    const s = db.prepare("SELECT CDNDesignImageFol, DesignImageFol, Currencysymbol, CurrencySymbol FROM storeinit LIMIT 1").get();
    if (s) {
      storeConfig = {
        CDNDesignImageFol: s.CDNDesignImageFol || s.DesignImageFol || "",
        DesignImageFol: s.DesignImageFol || s.CDNDesignImageFol || "",
        Currencysymbol: s.Currencysymbol || s.CurrencySymbol || "₹",
      };
    }
  } catch (_) {}

  // 2. Fetch albums for this customer
  let sql = `
    SELECT 
      id,
      albumName,
      AutocodeList,
      ExpiryDate,
      albumcode,
      CustomerId,
      RandomNo,
      EntryDate
    FROM albums
    WHERE 1=1
  `;
  const params = {};

  if (customerId) {
    sql += " AND CustomerId = @customerId";
    params.customerId = Number(customerId);
  }

  if (options.id !== undefined && options.id !== null && options.id !== "") {
    sql += " AND id = @id";
    params.id = Number(options.id);
  }
  if (options.albumcode) {
    sql += " AND LOWER(albumcode) = LOWER(@albumcode)";
    params.albumcode = String(options.albumcode).trim();
  }
  if (options.RandomNo) {
    sql += " AND RandomNo = @RandomNo";
    params.RandomNo = String(options.RandomNo).trim();
  }

  sql += " ORDER BY id ASC, EntryDate DESC";

  const albums = db.prepare(sql).all(params);

  if (!albums || albums.length === 0) {
    return {
      Status: "200",
      Message: "No exclusive albums found for this customer.",
      Data: {
        customerId: Number(customerId),
        totalAlbums: 0,
        storeConfig,
        rd: [],
      },
    };
  }

  // 3. Process autocodes
  const allCodesMap = new Map(); // normalized integer string -> Set of raw codes
  for (const a of albums) {
    const rawList = a.AutocodeList ? a.AutocodeList.split(",").map((s) => s.trim()).filter(Boolean) : [];
    a.autocodeListParsed = rawList;
    a.totalAutocodes = rawList.length;
    a.designs = [];
    a.designCount = 0;

    for (const c of rawList) {
      const num = parseInt(c, 10);
      if (!isNaN(num)) {
        const numStr = String(num);
        if (!allCodesMap.has(numStr)) {
          allCodesMap.set(numStr, new Set());
        }
        allCodesMap.get(numStr).add(c);
      }
    }
  }

  // 4. If designs requested, query from resolved productlist table
  const includeDesigns = options.includeDesigns !== false;
  const intCodes = Array.from(allCodesMap.keys());
  let tableName = "";

  if (includeDesigns && intCodes.length > 0) {
    tableName = resolveHomeTable(db, options);

    if (tableName) {
      const intNums = intCodes.map(Number);
      const placeholders = intNums.map(() => "?").join(",");

      try {
        const designs = db.prepare(`
          SELECT 
            id,
            designno,
            autocode,
            TitleLine,
            description,
            UnitCost,
            UnitCostWithMarkUp,
            UnitCostWithMarkUpIncTax,
            Metal_Cost,
            Labour_Cost,
            Diamond_Cost,
            ColorStone_Cost,
            Nwt,
            Gwt,
            Dwt,
            Dpcs,
            CSwt,
            CSpcs,
            ImageCount,
            ImageExtension,
            ImageVideoDetail,
            MetalTypePurity,
            category,
            collection,
            sub_category,
            style
          FROM "${tableName}"
          WHERE CAST(autocode AS INTEGER) IN (${placeholders})
        `).all(...intNums);

        // Build lookup map by both normalized integer and raw autocode
        const designMap = new Map();
        for (const d of designs) {
          const numStr = String(parseInt(d.autocode, 10));
          designMap.set(numStr, d);
          if (d.autocode) {
            designMap.set(String(d.autocode).trim(), d);
          }
        }

        // Attach designs to each album
        for (const a of albums) {
          const matched = [];
          const seen = new Set();
          for (const code of a.autocodeListParsed) {
            const numStr = String(parseInt(code, 10));
            const found = designMap.get(numStr) || designMap.get(code);
            if (found && !seen.has(found.id || found.autocode)) {
              seen.add(found.id || found.autocode);
              matched.push(found);
            }
          }
          a.designs = matched;
          a.designCount = matched.length;
        }
      } catch (err) {
        console.warn("[getExclusiveAlbumsWithDesigns] Error querying design table:", err.message);
      }
    }
  }

  const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    Status: "200",
    Message: "Request processed successfully.",
    Data: {
      customerId: Number(customerId),
      totalAlbums: albums.length,
      tableName,
      storeConfig,
      elapsedMs,
      rd: albums,
    },
  };
}

export default getExclusiveAlbumsWithDesigns;
