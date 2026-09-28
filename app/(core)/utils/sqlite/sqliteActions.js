"use server";
import { getTenantDb } from "@/db/tenantManager.js";
import { getDesigns } from "@/db/procedures/getDesignsByMenu.js";
import {
  getHomeBestsellers,
  getHomeNewArrivals,
  getHomeTrending,
} from "@/db/procedures/getHomeProducts.js";
import { getMenuFilters } from "@/db/procedures/getMenuFilters.js";
import { batchInsertDesigns } from "@/db/procedures/batchInsertDesigns.js";
import { saveMenuFilters } from "@/db/procedures/saveMenuFilters.js";
import { getStoreInit } from "@/db/procedures/getStoreInit.js";
import { saveStoreInit } from "@/db/procedures/saveStoreInit.js";
import { getMenus } from "@/db/procedures/getMenus.js";
import { saveMenus } from "@/db/procedures/saveMenus.js";
import { getAlbums } from "@/db/procedures/getAlbums.js";
import { getExclusiveAlbumsWithDesigns } from "@/db/procedures/getExclusiveAlbumsWithDesigns.js";
import { saveAlbums } from "@/db/procedures/saveAlbums.js";
import { deleteAlbums } from "@/db/procedures/deleteAlbums.js";
import { syncMenus, syncPackageMaster, syncMenusAndPackages } from "./syncMenusAndPackages.js";
import { syncAlbums } from "./syncAlbums.js";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo.js";
import { logger } from "@/db/logger.js";
import { cookies } from "next/headers";
import {
  getPricingPolicyParams,
  getDynamicDesignTableName,
  getDynamicArticleTableName,
} from "@/app/(core)/utils/product/pricingPolicy.js";
import { saveRecentlyViewed, getRecentlyViewed } from "@/db/procedures/recentlyViewed.js";
import { getArticlesByDesign } from "@/db/procedures/getArticlesByDesign.js";
import { getProductArticle } from "@/db/procedures/getProductArticle.js";
import { getHomeCategories } from "@/db/procedures/getHomeCategories.js";

function sanitizeDomain(domain, fallback = "") {
  if (!domain || typeof domain !== "string") return fallback;
  return domain.trim().split(":")[0] || fallback;
}

/**
 * Server Action to fetch products directly from SQLite with ultra-fast sub-millisecond execution.
 * Accepts full filter payloads, menu slugs, search params, and custom parameters.
 * Returns data in the exact convention expected by frontend themes (pdList, pdResp.rd, pdResp.rd1).
 * 
 * @param {object|string} filtersOrMenu - Filter parameters object, raw JSON payload, or menu identifier
 * @param {object|string} [filters={}] - Additional filters if first parameter was string
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, pdList: Array<object>, pdResp: object, rd: Array<object>, totalCount: number }>}
 */
export async function getSqliteProducts(filtersOrMenu = {}, filters = {}, domain) {
  try {
    let targetDomain = domain;
    let queryFilters = {};

    // Check if domain was embedded in filtersOrMenu object
    if (filtersOrMenu && typeof filtersOrMenu === "object" && !Array.isArray(filtersOrMenu)) {
      if (filtersOrMenu.domain && !targetDomain) {
        targetDomain = filtersOrMenu.domain;
      }
    }

    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    if (Array.isArray(filtersOrMenu)) {
      // Array format from useListingPage: [ [keys...], [vals...] ]
      if (filtersOrMenu.length >= 2 && Array.isArray(filtersOrMenu[0]) && Array.isArray(filtersOrMenu[1])) {
        const keys = filtersOrMenu[0];
        const vals = filtersOrMenu[1];
        keys.forEach((k, idx) => {
          if (k && vals[idx] != null) {
            queryFilters[k] = vals[idx];
          }
        });
      }
      if (typeof filters === "object" && filters !== null) {
        queryFilters = { ...queryFilters, ...filters };
      }
    } else if (typeof filtersOrMenu === "object" && filtersOrMenu !== null) {
      queryFilters = { ...filtersOrMenu };
      if (typeof filters === "object" && filters !== null) {
        queryFilters = { ...queryFilters, ...filters };
      } else if (typeof filters === "string" && !targetDomain) {
        targetDomain = filters;
      }
    } else if (typeof filtersOrMenu === "string") {
      if (typeof filters === "object" && filters !== null) {
        queryFilters = { ...filters };
      }

      const rawStr = filtersOrMenu.trim();

      // Check if base64 encoded M= param
      if (rawStr.includes("M=") || rawStr.startsWith("QS") || rawStr.startsWith("ey")) {
        try {
          const b64 = rawStr.includes("M=") ? rawStr.split("M=")[1].split("&")[0] : rawStr;
          const decoded = Buffer.from(decodeURIComponent(b64), "base64").toString("utf-8");
          if (decoded.includes("/")) {
            const [valPart, keyPart] = decoded.split("/");
            const keys = keyPart.split(",").map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, ""));
            const vals = valPart.split(",").map((s) => s.trim().replace(/%20/g, " "));
            keys.forEach((key, idx) => {
              if (key && vals[idx]) queryFilters[key] = vals[idx];
            });
          }
        } catch (_) {}
      }

      // Check URL path (e.g. /p/L7/A/Ring, /p/Women/Ring)
      const cleanSlug = rawStr.replace(/^\/p\//, "").replace(/\/+$/, "");
      if (cleanSlug && cleanSlug !== "default" && !cleanSlug.includes("M=")) {
        const parts = cleanSlug
          .split("/")
          .map((p) => decodeURIComponent(p).trim())
          .filter(Boolean)
          .filter((p) => !/^L\d+$/i.test(p)); // Filter out menu levels like "L7", "L1"

        if (!queryFilters.category && !queryFilters.collection && !queryFilters.sub_category && !queryFilters.gender) {
          if (parts.length >= 2) {
            queryFilters.collection = parts[0];
            queryFilters.category = parts[1];
          } else if (parts.length === 1) {
            queryFilters.category = parts[0];
          }
        }
      }
    }

    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }

    if (!queryFilters.tableName) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const cookieTable = cookieStore?.get("pricing_table_name")?.value || cookieStore?.get("policy_table")?.value;
        if (cookieTable) {
          queryFilters.tableName = cookieTable;
        }
      } catch (_) {}
    }

    const hasLabour = queryFilters.Laboursetid || queryFilters.laboursetid || queryFilters.pricemanagement_laboursetid;
    const hasDia = queryFilters.diamondpricelistName || queryFilters.diamondpricelistname;

    logger.info("PRODUCT_QUERY", `Executing getSqliteProducts for tenant '${targetDomain}'`, {
      domain: targetDomain,
      tableName: queryFilters.tableName || null,
      policy: {
        Laboursetid: hasLabour || null,
        diamondpricelistName: hasDia || null,
        colorstonepricelistName: queryFilters.colorstonepricelistName || queryFilters.colorstonepricelistname || null,
        SettingPriceUniqueNo: queryFilters.SettingPriceUniqueNo || queryFilters.settingpriceuniqueno || null,
      },
      activeFilters: Object.fromEntries(
        Object.entries(queryFilters).filter(([k, v]) => v != null && v !== "" && !k.startsWith("FilterKey") && !k.startsWith("FilterVal"))
      ),
    });

    const db = getTenantDb(targetDomain);
    const result = getDesigns(db, queryFilters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || 0;

    logger.info("PRODUCT_QUERY", `[TABLE PICKED] Tenant '${targetDomain}' → Queried Table: '${result.targetTable}' (Candidate: '${result.candidateTable || "none"}') | Results: ${totalCount} total, ${rows.length} returned`, {
      domain: targetDomain,
      pickedTable: result.targetTable,
      candidateTable: result.candidateTable || "none",
      tableMatched: result.candidateTable ? result.targetTable === result.candidateTable : true,
      totalCount,
      returned: rows.length,
    });

    return {
      success: true,
      pdList: rows,
      pdResp: {
        rd: rows,
        rd1: [{ designcount: totalCount }],
        stat: 1,
        msg: "success",
      },
      rd: rows,
      targetTable: result.targetTable,
      candidateTable: result.candidateTable,
      totalCount,
    };
  } catch (err) {
    logger.error("PRODUCT_QUERY", `getSqliteProducts error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return {
      success: false,
      pdList: [],
      pdResp: {
        rd: [],
        rd1: [{ designcount: 0 }],
        stat: 0,
        msg: err.message,
      },
      rd: [],
      totalCount: 0,
    };
  }
}

import { getFilterList } from "@/db/procedures/getFilterList.js";

/**
 * Server Action to fetch dynamic filter options directly from SQLite matching GETFILTERLIST
 * @param {object|string} [filtersOrMenu={}]
 * @param {object} [extraFilters={}]
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, data: Array<object>, rd: Array<object> }>}
 */
export async function getSqliteFilters(filtersOrMenu = {}, extraFilters = {}, domain) {
  try {
    let targetDomain = domain;
    if (typeof extraFilters === "string" && !domain) {
      targetDomain = extraFilters;
      extraFilters = {};
    }

    if (filtersOrMenu && typeof filtersOrMenu === "object" && !Array.isArray(filtersOrMenu)) {
      if (filtersOrMenu.domain && !targetDomain) {
        targetDomain = filtersOrMenu.domain;
      }
    }

    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    let finalFilters = typeof filtersOrMenu === "object" && !Array.isArray(filtersOrMenu) ? { ...filtersOrMenu } : {};
    if (typeof extraFilters === "object" && extraFilters !== null) {
      finalFilters = { ...finalFilters, ...extraFilters };
    }

    if (!finalFilters.tableName && !finalFilters.targetTable) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const cookieTable = cookieStore?.get("pricing_table_name")?.value || cookieStore?.get("policy_table")?.value;
        if (cookieTable) {
          finalFilters.tableName = cookieTable;
        }
      } catch (_) {}
    }

    const db = getTenantDb(targetDomain);
    const filterList = getFilterList(db, finalFilters);

    logger.info("FILTERS_QUERY", `[FILTERS GENERATED] Tenant '${targetDomain}' → ${filterList?.length || 0} filter sections returned`, {
      domain: targetDomain,
      sectionsCount: filterList?.length || 0,
      sections: filterList?.map(f => f.Name) || [],
    });

    return {
      success: true,
      data: filterList || [],
      rd: filterList || [],
    };
  } catch (err) {
    logger.error("FILTERS_QUERY", `getSqliteFilters error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return { success: false, data: [], rd: [] };
  }
}

/**
 * Server Action to batch sync and persist product records into SQLite
 * @param {Array<object>} products
 * @param {string} [menuIdentifier="GLOBAL"]
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, insertedCount: number, updatedCount: number, totalReceived: number }>}
 */
export async function saveSqliteProducts(products = [], menuIdentifier = "GLOBAL", domain) {
  try {
    if (!Array.isArray(products) || products.length === 0) {
      return { success: true, insertedCount: 0, updatedCount: 0, totalReceived: 0 };
    }
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);
    const result = batchInsertDesigns(db, products, menuIdentifier);
    return {
      success: true,
      ...result,
    };
  } catch (err) {
    console.error("[sqliteActions] saveSqliteProducts error:", err.message);
    return { success: false, error: err.message, insertedCount: 0, updatedCount: 0, totalReceived: 0 };
  }
}

/**
 * Server Action to sync and persist filter options into SQLite
 * @param {string} menuIdentifier
 * @param {Array<object>} filterList
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, count: number }>}
 */
export async function saveSqliteFilters(menuIdentifier = "GLOBAL", filterList = [], domain) {
  try {
    if (!Array.isArray(filterList) || filterList.length === 0) {
      return { success: true, count: 0 };
    }
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);
    const result = saveMenuFilters(db, menuIdentifier, filterList);
    return {
      success: true,
      ...result,
    };
  } catch (err) {
    console.error("[sqliteActions] saveSqliteFilters error:", err.message);
    return { success: false, error: err.message, count: 0 };
  }
}

/**
 * Server Action to fetch storeInit configuration directly from SQLite
 * @param {string} [domain]
 * @returns {Promise<{ Status: string, Message: string, Data: object, rd: Array<object>, rd1: Array<object>, rd2: Array<object>, isMissing?: boolean }>}
 */
export async function getSqliteStoreInit(domain) {
  try {
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "";
    }
    targetDomain = sanitizeDomain(targetDomain);

    if (!targetDomain) {
      logger.warn("STORE_INIT", "StoreInit requested with missing domain parameter", { domain });
      return {
        Status: "400",
        Message: "Domain parameter is required and could not be resolved. Please pass a valid domain.",
        Data: { rd: [{}], rd1: [], rd2: [{}] },
        rd: [{}],
        rd1: [],
        rd2: [{}],
        isMissing: true
      };
    }

    logger.info("STORE_INIT", `Fetching StoreInit configuration for tenant: '${targetDomain}'`, { domain: targetDomain });

    const db = getTenantDb(targetDomain);
    const storeInitResp = getStoreInit(db, { domain: targetDomain });

    const hasData = storeInitResp?.Data?.rd && storeInitResp.Data.rd.length > 0;

    if (!hasData) {
      logger.warn(
        "STORE_INIT",
        `No StoreInit data found in SQLite for domain: '${targetDomain}'. Please push StoreInit data first via POST /api/sqlite/store-init?domain=${targetDomain}`,
        { domain: targetDomain }
      );
      return {
        Status: "404",
        Message: `StoreInit data not found for '${targetDomain}'. Please push StoreInit data first via POST /api/sqlite/store-init?domain=${targetDomain}`,
        Data: { rd: [{}], rd1: [], rd2: [{}] },
        rd: [{}],
        rd1: [],
        rd2: [{}],
        isMissing: true
      };
    }

    logger.info("STORE_INIT", `Successfully retrieved StoreInit for '${targetDomain}'`, {
      domain: targetDomain,
      rd: storeInitResp.Data.rd.length,
      rd1: storeInitResp.Data.rd1.length,
      rd2: storeInitResp.Data.rd2.length,
    });

    return {
      Status: "200",
      Message: "Request processed successfully.",
      Data: storeInitResp.Data,
      rd: storeInitResp.Data.rd,
      rd1: storeInitResp.Data.rd1,
      rd2: storeInitResp.Data.rd2
    };
  } catch (err) {
    logger.error("STORE_INIT", `Error reading StoreInit for '${domain}': ${err.message}`, { domain, error: err.stack });
    return {
      Status: "500",
      Message: err.message,
      Data: { rd: [{}], rd1: [], rd2: [{}] },
      rd: [{}],
      rd1: [],
      rd2: [{}]
    };
  }
}

/**
 * Server Action to save/upsert storeInit payload into SQLite
 * @param {string} domain
 * @param {object} payload - { rd, rd1, rd2 } or { Data: { rd, rd1, rd2 } }
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function saveSqliteStoreInitAction(domain, payload) {
  try {
    const targetDomain = sanitizeDomain(domain);
    if (!targetDomain) {
      logger.error("STORE_INIT", "Failed to save StoreInit: Domain is required", { domain });
      return { success: false, message: "Domain is required to save StoreInit data." };
    }
    const db = getTenantDb(targetDomain);
    const result = saveStoreInit(db, payload, { domain: targetDomain });
    logger.info("STORE_INIT", `Saved StoreInit payload into SQLite for domain '${targetDomain}' in ${result.elapsedMs}ms`, {
      domain: targetDomain,
      count: result.count,
      elapsedMs: result.elapsedMs,
    });
    return result;
  } catch (err) {
    logger.error("STORE_INIT", `Failed to save StoreInit for '${domain}': ${err.message}`, { domain, error: err.stack });
    return { success: false, message: err.message };
  }
}

/**
 * Server Action to fetch header navigation menus directly from SQLite with Package & Subpackage filtering.
 * 
 * @param {object} [options={}] - { packageId, packageName, customerId, levelid, menuid }
 * @param {string} [domain]
 * @returns {Promise<{ Status: string, Message: string, Data: { rd: Array<object> } }>}
 */
export async function getSqliteMenus(options = {}, domain) {
  try {
    let targetDomain = domain || options.domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    if (!targetDomain) {
      logger.warn("MENUS", "Menus requested with missing domain parameter", { domain });
      return {
        Status: "400",
        Message: "Domain parameter is required and could not be resolved.",
        Data: { rd: [] },
      };
    }

    const db = getTenantDb(targetDomain);
    const menuResp = getMenus(db, options);

    return menuResp;
  } catch (err) {
    logger.error("MENUS", `Error reading Menus for '${domain}': ${err.message}`, { domain, error: err.stack });
    return {
      Status: "500",
      Message: err.message,
      Data: { rd: [] },
    };
  }
}

/**
 * Server Action to save/upsert menus payload into SQLite
 * @param {string} domain
 * @param {object|Array} payload - { rd } or { Data: { rd } } or array
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function saveSqliteMenusAction(domain, payload) {
  try {
    const targetDomain = sanitizeDomain(domain);
    if (!targetDomain) {
      logger.error("MENUS", "Failed to save Menus: Domain is required", { domain });
      return { success: false, message: "Domain is required to save Menus data." };
    }
    const db = getTenantDb(targetDomain);
    const result = saveMenus(db, payload);
    logger.info("MENUS", `Saved Menus payload into SQLite for domain '${targetDomain}' in ${result.elapsedMs}ms`, {
      domain: targetDomain,
      count: result.savedCount,
      elapsedMs: result.elapsedMs,
    });
    return result;
  } catch (err) {
    logger.error("MENUS", `Failed to save Menus for '${domain}': ${err.message}`, { domain, error: err.stack });
    return { success: false, message: err.message };
  }
}

/**
 * Server Action to trigger ERP sync for Menus (GETFullMENU)
 * @param {string} domain
 * @param {object} [options={}]
 */
export async function syncSqliteMenusAction(domain, options = {}) {
  try {
    const targetDomain = sanitizeDomain(domain || options.domain);
    return await syncMenus({ domain: targetDomain, ...options });
  } catch (err) {
    logger.error("MENUS", `syncSqliteMenusAction error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to trigger ERP sync for Package Master (PackageMst)
 * @param {string} domain
 * @param {object} [options={}]
 */
export async function syncSqlitePackageMasterAction(domain, options = {}) {
  try {
    const targetDomain = sanitizeDomain(domain || options.domain);
    return await syncPackageMaster({ domain: targetDomain, ...options });
  } catch (err) {
    logger.error("PACKAGE_SYNC", `syncSqlitePackageMasterAction error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to trigger ERP sync for both Package Master and Menus
 * @param {string} domain
 * @param {object} [options={}]
 */
export async function syncSqliteMenusAndPackagesAction(domain, options = {}) {
  try {
    const targetDomain = sanitizeDomain(domain || options.domain);
    return await syncMenusAndPackages({ domain: targetDomain, ...options });
  } catch (err) {
    logger.error("SYNC_ALL", `syncSqliteMenusAndPackagesAction error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to fetch albums directly from SQLite with optional filtering.
 * 
 * @param {object} [options={}] - { id, CustomerId, albumcode, RandomNo, albumName, search, validOnly, limit, offset, includePublic }
 * @param {string} [domain]
 * @returns {Promise<{ Status: string, Message: string, Data: { rd: Array<object> } }>}
 */
export async function getSqliteAlbums(options = {}, domain) {
  try {
    let targetDomain = domain || options.domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    if (!targetDomain) {
      logger.warn("ALBUMS", "Albums requested with missing domain parameter", { domain });
      return {
        Status: "400",
        Message: "Domain parameter is required and could not be resolved.",
        Data: { rd: [] },
      };
    }

    const db = getTenantDb(targetDomain);
    return getAlbums(db, options);
  } catch (err) {
    logger.error("ALBUMS", `Error reading Albums for '${domain}': ${err.message}`, { domain, error: err.stack });
    return {
      Status: "500",
      Message: err.message,
      Data: { rd: [] },
    };
  }
}

/**
 * Server Action to fetch exclusive albums and their joined design products from SQLite.
 * 
 * @param {object} options - { customerId, id, albumcode, RandomNo, includeDesigns }
 * @param {string} [domain]
 * @returns {Promise<{ Status: string, Message: string, Data: { rd: Array<object>, storeConfig: object } }>}
 */
export async function getSqliteExclusiveAlbums(options = {}, domain) {
  try {
    let targetDomain = domain || options.domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    if (!targetDomain) {
      return {
        Status: "400",
        Message: "Domain parameter is required and could not be resolved.",
        Data: { rd: [] },
      };
    }

    const db = getTenantDb(targetDomain);
    return getExclusiveAlbumsWithDesigns(db, options);
  } catch (err) {
    logger.error("ALBUMS", `Error reading Exclusive Albums for '${domain}': ${err.message}`, { domain, error: err.stack });
    return {
      Status: "500",
      Message: err.message,
      Data: { rd: [] },
    };
  }
}

/**
 * Server Action to save/upsert albums payload into SQLite
 * @param {string} domain
 * @param {object|Array} payload - { rd } or { Data: { rd } } or array
 * @param {object} [options={}]
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function saveSqliteAlbumsAction(domain, payload, options = {}) {
  try {
    const targetDomain = sanitizeDomain(domain);
    if (!targetDomain) {
      logger.error("ALBUMS", "Failed to save Albums: Domain is required", { domain });
      return { success: false, message: "Domain is required to save Albums data." };
    }
    const db = getTenantDb(targetDomain);
    const result = saveAlbums(db, payload, options);
    logger.info("ALBUMS", `Saved Albums payload into SQLite for domain '${targetDomain}' in ${result.elapsedMs}ms`, {
      domain: targetDomain,
      count: result.savedCount,
      elapsedMs: result.elapsedMs,
    });
    return result;
  } catch (err) {
    logger.error("ALBUMS", `Failed to save Albums for '${domain}': ${err.message}`, { domain, error: err.stack });
    return { success: false, message: err.message };
  }
}

/**
 * Server Action to trigger ERP sync for Albums (GetAlbums)
 * @param {string} domain
 * @param {object} [options={}]
 */
export async function syncSqliteAlbumsAction(domain, options = {}) {
  try {
    const targetDomain = sanitizeDomain(domain || options.domain);
    return await syncAlbums({ domain: targetDomain, ...options });
  } catch (err) {
    logger.error("ALBUMS_SYNC", `syncSqliteAlbumsAction error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to delete albums from SQLite
 * @param {string} domain
 * @param {object} [options={}]
 */
export async function deleteSqliteAlbumsAction(domain, options = {}) {
  try {
    const targetDomain = sanitizeDomain(domain || options.domain);
    const db = getTenantDb(targetDomain);
    return deleteAlbums(db, options);
  } catch (err) {
    logger.error("ALBUMS", `deleteSqliteAlbumsAction error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

import { deleteDesigns } from "@/db/procedures/deleteDesigns.js";
import { truncateAllData } from "@/db/schema/index.js";

/**
 * Server Action to delete products from SQLite
 * @param {object} [options={}]
 * @param {string} [domain]
 */
export async function deleteSqliteProducts(options = {}, domain) {
  try {
    let targetDomain = domain || options.domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);
    const result = deleteDesigns(db, options);
    return { success: true, domain: targetDomain, ...result };
  } catch (err) {
    console.error("[sqliteActions] deleteSqliteProducts error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to flush SQLite WAL to disk
 * @param {string} [domain]
 */
export async function flushSqliteDatabase(domain) {
  try {
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);
    const checkpoint = db.pragma("wal_checkpoint(TRUNCATE)");
    return { success: true, domain: targetDomain, checkpoint };
  } catch (err) {
    console.error("[sqliteActions] flushSqliteDatabase error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to clear tables in SQLite
 * @param {string} [table="all"]
 * @param {string} [domain]
 */
export async function clearSqliteTable(table = "all", domain) {
  try {
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);
    if (table === "designs" || table === "products") {
      deleteDesigns(db, { all: true });
    } else {
      truncateAllData(db);
    }
    db.pragma("wal_checkpoint(TRUNCATE)");
    return { success: true, domain: targetDomain, table };
  } catch (err) {
    console.error("[sqliteActions] clearSqliteTable error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action to fetch Bestseller products (IsBestSeller = 1) directly from SQLite.
 * Automatically resolves the active policy table from cookies or options.
 * 
 * @param {object} [options={}]
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, Data: { rd: Array<object>, stat: number, msg: string }, data: Array<object>, rd: Array<object>, totalCount: number }>}
 */
export async function getSqliteHomeBestseller(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (options && typeof options === "object") {
      if (options.domain && !targetDomain) targetDomain = options.domain;
    }
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    const db = getTenantDb(targetDomain);
    let queryFilters = { ...options, isBestSeller: true, IsBestSeller: 1 };

    if (!queryFilters.tableName) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const cookieTable = cookieStore?.get("pricing_table_name")?.value || cookieStore?.get("policy_table")?.value;
        if (cookieTable) {
          queryFilters.tableName = cookieTable;
        }
      } catch (_) {}
    }

    if (!queryFilters.tableName) {
      let loginUser = options.loginUserDetail || null;
      let storeInit = options.storeInit || options.storeinit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      const candidate = getDynamicDesignTableName(policyParams);
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidate);
      queryFilters.tableName = exists ? exists.name : "designs";
    }

    const result = getHomeBestsellers(db, queryFilters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || rows.length;

    logger.info("HOME_BESTSELLER", `[BESTSELLER ACTION] Tenant '${targetDomain}' → ${rows.length} items from table '${result.targetTable}'`, {
      domain: targetDomain,
      table: result.targetTable,
      count: rows.length,
    });

    return {
      success: true,
      domain: targetDomain,
      table: result.targetTable,
      Data: {
        rd: rows,
        stat: 1,
        msg: "success",
      },
      data: rows,
      rd: rows,
      totalCount,
    };
  } catch (err) {
    logger.error("HOME_BESTSELLER", `getSqliteHomeBestseller error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return {
      success: false,
      Data: { rd: [], stat: 0, msg: err.message },
      data: [],
      rd: [],
      totalCount: 0,
    };
  }
}

/**
 * Server Action to fetch New Arrival products directly from SQLite.
 * Automatically resolves the active policy table from cookies or options.
 * Filters: IsNewArrival = 1 AND (FrontEnd1_newArrivalsto IS NULL OR DATE(FrontEnd1_newArrivalsto) >= DATE('now', 'localtime'))
 * 
 * @param {object} [options={}]
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, Data: { rd: Array<object>, stat: number, msg: string }, data: Array<object>, rd: Array<object>, totalCount: number }>}
 */
export async function getSqliteHomeNewArrival(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (options && typeof options === "object") {
      if (options.domain && !targetDomain) targetDomain = options.domain;
    }
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    const db = getTenantDb(targetDomain);
    let queryFilters = { ...options, isNewArrival: true, IsNewArrival: 1 };

    if (!queryFilters.tableName) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const cookieTable = cookieStore?.get("pricing_table_name")?.value || cookieStore?.get("policy_table")?.value;
        if (cookieTable) {
          queryFilters.tableName = cookieTable;
        }
      } catch (_) {}
    }

    if (!queryFilters.tableName) {
      let loginUser = options.loginUserDetail || null;
      let storeInit = options.storeInit || options.storeinit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      const candidate = getDynamicDesignTableName(policyParams);
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidate);
      queryFilters.tableName = exists ? exists.name : "designs";
    }

    const result = getHomeNewArrivals(db, queryFilters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || rows.length;

    logger.info("HOME_NEWARRIVAL", `[NEW ARRIVAL ACTION] Tenant '${targetDomain}' → ${rows.length} items from table '${result.targetTable}'`, {
      domain: targetDomain,
      table: result.targetTable,
      count: rows.length,
    });

    return {
      success: true,
      domain: targetDomain,
      table: result.targetTable,
      Data: {
        rd: rows,
        stat: 1,
        msg: "success",
      },
      data: rows,
      rd: rows,
      totalCount,
    };
  } catch (err) {
    logger.error("HOME_NEWARRIVAL", `getSqliteHomeNewArrival error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return {
      success: false,
      Data: { rd: [], stat: 0, msg: err.message },
      data: [],
      rd: [],
      totalCount: 0,
    };
  }
}

/**
 * Server Action to fetch Trending products directly from SQLite.
 * Automatically resolves the active policy table from cookies or options.
 * Filters: IsTrending = 1
 * 
 * @param {object} [options={}]
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, Data: { rd: Array<object>, stat: number, msg: string }, data: Array<object>, rd: Array<object>, totalCount: number }>}
 */
export async function getSqliteHomeTrending(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (options && typeof options === "object") {
      if (options.domain && !targetDomain) targetDomain = options.domain;
    }
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    const db = getTenantDb(targetDomain);
    let queryFilters = { ...options, isTrending: true, IsTrending: 1 };

    if (!queryFilters.tableName) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const cookieTable = cookieStore?.get("pricing_table_name")?.value || cookieStore?.get("policy_table")?.value;
        if (cookieTable) {
          queryFilters.tableName = cookieTable;
        }
      } catch (_) {}
    }

    if (!queryFilters.tableName) {
      let loginUser = options.loginUserDetail || null;
      let storeInit = options.storeInit || options.storeinit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      const candidate = getDynamicDesignTableName(policyParams);
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidate);
      queryFilters.tableName = exists ? exists.name : "designs";
    }

    const result = getHomeTrending(db, queryFilters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || rows.length;

    logger.info("HOME_TRENDING", `[TRENDING ACTION] Tenant '${targetDomain}' → ${rows.length} items from table '${result.targetTable}'`, {
      domain: targetDomain,
      table: result.targetTable,
      count: rows.length,
    });

    return {
      success: true,
      domain: targetDomain,
      table: result.targetTable,
      Data: {
        rd: rows,
        stat: 1,
        msg: "success",
      },
      data: rows,
      rd: rows,
      totalCount,
    };
  } catch (err) {
    logger.error("HOME_TRENDING", `getSqliteHomeTrending error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return {
      success: false,
      Data: { rd: [], stat: 0, msg: err.message },
      data: [],
      rd: [],
      totalCount: 0,
    };
  }
}

/**
 * Server Action to fetch unique Home Categories with design count and preview product directly from SQLite.
 * Automatically resolves the active policy table from cookies or options.
 * 
 * @param {object} [options={}]
 * @param {string} [domain]
 * @returns {Promise<{ success: boolean, Status: string, Message: string, Data: { rd: Array<object>, stat: number, msg: string }, data: Array<object>, rd: Array<object>, totalCount: number, domain: string, table: string }>}
 */
export async function getSqliteHomeCategory(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (options && typeof options === "object") {
      if (options.domain && !targetDomain) targetDomain = options.domain;
    }
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);

    const db = getTenantDb(targetDomain);
    let queryFilters = { ...options };

    if (!queryFilters.tableName) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const cookieTable = cookieStore?.get("pricing_table_name")?.value || cookieStore?.get("policy_table")?.value;
        if (cookieTable) {
          queryFilters.tableName = cookieTable;
        }
      } catch (_) {}
    }

    if (!queryFilters.tableName) {
      let loginUser = options.loginUserDetail || null;
      let storeInit = options.storeInit || options.storeinit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      const candidate = getDynamicDesignTableName(policyParams);
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidate);
      queryFilters.tableName = exists ? exists.name : "designs";
    }

    const result = getHomeCategories(db, queryFilters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || rows.length;

    logger.info("HOME_CATEGORY", `[CATEGORY ACTION] Tenant '${targetDomain}' → ${rows.length} categories from table '${result.targetTable}'`, {
      domain: targetDomain,
      table: result.targetTable,
      count: rows.length,
    });

    return {
      success: true,
      Status: "200",
      Message: "Request processed successfully.",
      domain: targetDomain,
      table: result.targetTable,
      Data: {
        rd: rows,
        stat: 1,
        msg: "success",
      },
      data: rows,
      rd: rows,
      totalCount,
    };
  } catch (err) {
    logger.error("HOME_CATEGORY", `getSqliteHomeCategory error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return {
      success: false,
      Status: "500",
      Message: err.message,
      Data: { rd: [], stat: 0, msg: err.message },
      data: [],
      rd: [],
      totalCount: 0,
    };
  }
}

/**
 * Server Action: Saves a design to SQLite recently viewed designs (customer-wise).
 * Note: designno is NOT unique so multiple customers can view/click the same design.
 */
export async function saveSqliteRecentlyViewed(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);

    let customerId = options.customerId || options.Customerid || options.customer_id;
    if (!customerId) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const raw = cookieStore?.get("loginUserDetail")?.value;
        if (raw) {
          const parsed = JSON.parse(decodeURIComponent(raw));
          customerId = parsed?.id || parsed?.userid;
        }
        if (!customerId) {
          customerId = cookieStore?.get("visiterId")?.value;
        }
      } catch (_) {}
    }

    if (!customerId || !options.designno) {
      return { success: false, message: "customerId and designno are required" };
    }

    const result = saveRecentlyViewed(db, {
      customerId,
      designno: options.designno,
      autocode: options.autocode,
    });

    return { success: result.success, ...result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Retrieves customer-wise recently viewed designs with dynamic pricing from SQLite.
 */
export async function getSqliteRecentlyViewed(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);

    let customerId = options.customerId || options.Customerid || options.customer_id;
    if (!customerId) {
      try {
        const cookieStore = await cookies().catch(() => null);
        const raw = cookieStore?.get("loginUserDetail")?.value;
        if (raw) {
          const parsed = JSON.parse(decodeURIComponent(raw));
          customerId = parsed?.id || parsed?.userid;
        }
        if (!customerId) {
          customerId = cookieStore?.get("visiterId")?.value;
        }
      } catch (_) {}
    }

    if (!customerId) {
      return { success: true, Data: { rd: [] }, rd: [] };
    }

    // Resolve target table for active pricing
    let targetTable = options.tableName;
    if (!targetTable) {
      let loginUser = options.loginUserDetail || null;
      let storeInit = options.storeInit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      const candidate = getDynamicDesignTableName(policyParams);
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidate);
      targetTable = exists ? exists.name : "designs";
    }

    const items = getRecentlyViewed(db, {
      customerId,
      currentDesignno: options.currentDesignno || options.designno,
      limit: options.limit || 12,
      tableName: targetTable,
    });

    return {
      success: true,
      Data: { rd: items },
      rd: items,
    };
  } catch (err) {
    return { success: false, error: err.message, Data: { rd: [] }, rd: [] };
  }
}

/**
 * Server Action to fetch article variants from dynamic policy-based article tables in SQLite.
 * Provides instant sub-millisecond variant lookup for Product Detail Pages (PDP) without external API calls.
 * 
 * @param {object} [options={}] - Query options (designno, autocode, ArticleNo, MetalTypeId, MetalColorId, Size, tableName, Config, etc.)
 * @param {string} [domain] - Tenant domain
 * @returns {Promise<{ success: boolean, articles: Array<object>, rd: Array<object>, Data: { rd: Array<object> }, count: number, tableName?: string, error?: string }>}
 */
export async function getSqliteArticles(options = {}, domain) {
  try {
    let targetDomain = domain;
    if (options && typeof options === "object" && options.domain && !targetDomain) {
      targetDomain = options.domain;
    }
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);

    let targetTable = options.tableName;
    if (!targetTable) {
      let loginUser = options.loginUserDetail || null;
      let storeInit = options.storeInit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      const mergedParams = { ...policyParams, ...options };
      targetTable = getDynamicArticleTableName(mergedParams);
    }

    const result = getArticlesByDesign(db, { ...options, tableName: targetTable });
    const rows = result?.Data?.rd || [];
    return {
      Status: result?.Status || "200",
      Message: result?.Message || "Request processed successfully.",
      Data: { rd: rows },
      rd: rows,
    };
  } catch (err) {
    logger.error(`[getSqliteArticles] Error: ${err.message}`);
    return {
      Status: "500",
      Message: err.message,
      Data: { rd: [] },
      rd: [],
    };
  }
}

/**
 * Server Action to fetch product detail (GETPRODUCTARTICLE) directly from SQLite.
 * Pure SQLite raw execution without caching, sub-millisecond response.
 * Returns { Status, Message, Data: { rd, rd1, rd2 } }.
 * 
 * @param {object} [options={}]
 * @param {string} [domain]
 * @returns {Promise<{ Status: string, Message: string, Data: { rd: Array<object>, rd1: Array<object>, rd2: Array<object> } }>}
 */
export async function getSqliteProductArticle(options = {}, domain) {
  try {
    let targetDomain = domain || options.domain || options.Domain;
    if (!targetDomain) {
      const info = await getDomainInfo().catch(() => ({}));
      targetDomain = info?.hostname || "default";
    }
    targetDomain = sanitizeDomain(targetDomain);
    const db = getTenantDb(targetDomain);

    const result = getProductArticle(db, options);
    return result;
  } catch (err) {
    logger.error("PRODUCT_DETAIL_ACTION", `getSqliteProductArticle error for '${domain}': ${err.message}`, {
      domain,
      error: err.message,
    });
    return {
      Status: "500",
      Message: err.message,
      Data: { rd: [], rd1: [], rd2: [] },
    };
  }
}

