import { getTenantDb } from "../../../../db/tenantManager.js";
import { saveMenus } from "../../../../db/procedures/saveMenus.js";
import { savePackageMaster } from "../../../../db/procedures/savePackageMaster.js";
import { logger } from "../../../../db/logger.js";
import { getDomainInfo } from "../getDomainInfo.js";

/**
 * Resolves the target tenant domain name.
 */
async function resolveDomain(domain) {
  let targetDomain = domain;
  if (!targetDomain) {
    try {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    } catch (_) {
      targetDomain = "default";
    }
  }
  return String(targetDomain).trim().split(":")[0];
}

/**
 * Resolves storeInit record from tenant database or input parameter.
 */
function resolveStoreInit(db, inputStoreInit) {
  let storeInit = inputStoreInit;
  if (!storeInit || !storeInit.token || !storeInit.YearCode) {
    try {
      storeInit = db.prepare("SELECT * FROM storeinit LIMIT 1").get();
    } catch (_) {}
  }
  return storeInit;
}

/**
 * Builds the standard ERP API headers from storeInit credentials.
 */
function buildErpHeaders(storeInit) {
  const token = storeInit.token;
  const yearCode = storeInit.YearCode;
  const version = storeInit.version;
  const sp = "54"; // Fixed constant for Optigo ERP API
  const sv = storeInit.sv ?? storeInit.Sv;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(yearCode ? { Yearcode: yearCode } : {}),
    ...(version ? { Version: version } : {}),
    sp,
    ...(sv != null ? { sv: String(sv) } : {}),
  };
}

/**
 * Formats API report endpoint URL from storeInit.ApiUrl.
 */
function buildErpEndpoint(storeInit) {
  const rawApiUrl = storeInit.ApiUrl;
  if (!rawApiUrl) return null;
  return rawApiUrl.endsWith("/api/report")
    ? rawApiUrl
    : rawApiUrl.replace(/\/+$/, "") + "/api/report";
}

/**
 * Synchronizes Package Master definitions from ERP (PackageMst) into SQLite packagemaster table.
 * 
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {object} [options.storeInit] - Preloaded storeInit record
 * @param {string} [options.appuserid] - Optional override for appuserid
 * @returns {Promise<{ success: boolean, domain: string, totalReceived: number, savedCount: number, error?: string }>}
 */
export async function syncPackageMaster(options = {}) {
  const targetDomain = await resolveDomain(options.domain);
  const db = getTenantDb(targetDomain);
  const storeInit = resolveStoreInit(db, options.storeInit);

  if (!storeInit) {
    logger.warn("PACKAGE_SYNC", `storeinit record not found for domain '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: "storeinit configuration not found in tenant database. Please initialize store first.",
    };
  }

  const endpoint = buildErpEndpoint(storeInit);
  if (!endpoint) {
    logger.warn("PACKAGE_SYNC", `ApiUrl is missing in storeinit for domain '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: "ApiUrl is missing in storeinit configuration.",
    };
  }

  const headers = buildErpHeaders(storeInit);
  const appuserid = options.appuserid || storeInit.companyorderemail || storeInit.companysupportemail || "nimesh@ymail.in";

  const requestBody = {
    con: JSON.stringify({
      id: "",
      mode: "PackageMst",
      appuserid,
    }),
    f: "onlogin (PackageMst)",
    p: JSON.stringify({
      PackageId: 0,
    }),
  };

  logger.info("PACKAGE_SYNC", `Calling ERP PackageMst for tenant '${targetDomain}'`, {
    domain: targetDomain,
    endpoint,
    appuserid,
    headers
  });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      logger.error("PACKAGE_SYNC", `ERP PackageMst HTTP ${res.status}: ${errorText}`, { domain: targetDomain });
      return {
        success: false,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        error: `ERP PackageMst HTTP ${res.status}: ${errorText}`,
    headers

      };
    }

    const data = await res.json();
    const rows = data?.Data?.rd || data?.rd || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      logger.warn("PACKAGE_SYNC", `ERP PackageMst returned 0 records for '${targetDomain}'`, { domain: targetDomain });
      return {
        success: true,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        message: "ERP PackageMst returned 0 records.",
    headers

      };
    }

    const saveResult = savePackageMaster(db, rows);

    logger.info("PACKAGE_SYNC", `Synced ${saveResult.savedCount} package master items for '${targetDomain}' in ${saveResult.elapsedMs}ms`, {
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      savedCount: saveResult.savedCount,
    headers

    });

    return {
      success: true,
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      savedCount: saveResult.savedCount,
      elapsedMs: saveResult.elapsedMs,
    };
  } catch (err) {
    logger.error("PACKAGE_SYNC", `Error syncing Package Master for '${targetDomain}': ${err.message}`, {
      domain: targetDomain,
      error: err.stack,
    });
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: err.message,
    };
  }
}

/**
 * Synchronizes Menu Master definitions from ERP (GETFullMENU) into SQLite menus table.
 * 
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {object} [options.storeInit] - Preloaded storeInit record
 * @param {string|number} [options.customerId] - Customerid param (defaults to '10')
 * @param {string} [options.appuserid] - Optional override for appuserid
 * @returns {Promise<{ success: boolean, domain: string, totalReceived: number, savedCount: number, error?: string }>}
 */
export async function syncMenus(options = {}) {
  const targetDomain = await resolveDomain(options.domain);
  const db = getTenantDb(targetDomain);
  const storeInit = resolveStoreInit(db, options.storeInit);

  if (!storeInit) {
    logger.warn("MENUS_SYNC", `storeinit record not found for domain '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: "storeinit configuration not found in tenant database. Please initialize store first.",
    };
  }

  const endpoint = buildErpEndpoint(storeInit);
  if (!endpoint) {
    logger.warn("MENUS_SYNC", `ApiUrl is missing in storeinit for domain '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: "ApiUrl is missing in storeinit configuration.",
    };
  }

  const headers = buildErpHeaders(storeInit);
  const appuserid = options.appuserid || storeInit.companyorderemail || storeInit.companysupportemail || "neha@gmail.com";
  const customerId = String(options.customerId ?? options.CustomerId ?? "10");

  const requestBody = {
    con: JSON.stringify({
      id: "",
      mode: "GETFullMENU",
      appuserid,
      IPAddress: "103.206.139.196",
    }),
    f: "onload (GETMENU)",
    p: JSON.stringify({
      FrontEnd_RegNo: storeInit.FrontEnd_RegNo || "",
      Customerid: customerId,
    }),
  };

  logger.info("MENUS_SYNC", `Calling ERP GETFullMENU for tenant '${targetDomain}'`, {
    domain: targetDomain,
    endpoint,
    appuserid,
    customerId,
  });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      logger.error("MENUS_SYNC", `ERP GETFullMENU HTTP ${res.status}: ${errorText}`, { domain: targetDomain });
      return {
        success: false,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        error: `ERP GETFullMENU HTTP ${res.status}: ${errorText}`,
      };
    }

    const data = await res.json();
    const rows = data?.Data?.rd || data?.rd || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      logger.warn("MENUS_SYNC", `ERP GETFullMENU returned 0 records for '${targetDomain}'`, { domain: targetDomain });
      return {
        success: true,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        message: "ERP GETFullMENU returned 0 records.",
      };
    }

    const saveResult = saveMenus(db, rows);

    logger.info("MENUS_SYNC", `Synced ${saveResult.savedCount} menu items for '${targetDomain}' in ${saveResult.elapsedMs}ms`, {
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      savedCount: saveResult.savedCount,
    });

    return {
      success: true,
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      savedCount: saveResult.savedCount,
      elapsedMs: saveResult.elapsedMs,
    };
  } catch (err) {
    logger.error("MENUS_SYNC", `Error syncing Menus for '${targetDomain}': ${err.message}`, {
      domain: targetDomain,
      error: err.stack,
    });
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: err.message,
    };
  }
}

/**
 * Synchronizes both Package Master and Menus concurrently.
 * 
 * @param {object} [options={}]
 * @param {string} [options.domain]
 * @param {object} [options.storeInit]
 * @param {string|number} [options.customerId]
 * @returns {Promise<{ success: boolean, domain: string, packages: object, menus: object }>}
 */
export async function syncMenusAndPackages(options = {}) {
  const [packagesResult, menusResult] = await Promise.all([
    syncPackageMaster(options),
    syncMenus(options),
  ]);

  return {
    success: packagesResult.success && menusResult.success,
    domain: packagesResult.domain,
    packages: packagesResult,
    menus: menusResult,
  };
}
