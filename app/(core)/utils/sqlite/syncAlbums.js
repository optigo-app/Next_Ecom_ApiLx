import { getTenantDb } from "../../../../db/tenantManager.js";
import { saveAlbums } from "../../../../db/procedures/saveAlbums.js";
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
 * Builds standard ERP API headers from storeInit credentials.
 */
function buildErpHeaders(storeInit) {
  const token = storeInit.token;
  const yearCode = storeInit.YearCode;
  const version = storeInit.version;
  const sp = "54";
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
 * Synchronizes Album definitions from ERP (GetAlbums) into SQLite albums table.
 * Always performs a full replace (DELETE all + INSERT fresh) to guarantee no stale rows.
 *
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {object} [options.storeInit] - Preloaded storeInit record
 * @param {string} [options.appuserid] - Optional override for appuserid
 * @param {number} [options.packageId=0] - Optional package ID (default 0)
 * @returns {Promise<{ success: boolean, domain: string, totalReceived: number, savedCount: number, deletedCount: number, elapsedMs?: number, error?: string }>}
 */
export async function syncAlbums(options = {}) {
  const targetDomain = await resolveDomain(options.domain);
  const db = getTenantDb(targetDomain);
  const storeInit = resolveStoreInit(db, options.storeInit);

  if (!storeInit) {
    logger.warn("ALBUMS_SYNC", `storeinit record not found for domain '${targetDomain}'`);
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
    logger.warn("ALBUMS_SYNC", `ApiUrl is missing in storeinit for domain '${targetDomain}'`);
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
  const packageId = options.packageId ?? 0;

  const requestBody = {
    con: JSON.stringify({
      id: "",
      mode: "GetAlbums",
      appuserid,
    }),
    f: "onlogin (GetAlbums)",
    p: JSON.stringify({
      PackageId: packageId,
    }),
  };

  logger.info("ALBUMS_SYNC", `Calling ERP GetAlbums for tenant '${targetDomain}'`, {
    domain: targetDomain,
    endpoint,
    appuserid,
  });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      logger.error("ALBUMS_SYNC", `ERP GetAlbums HTTP ${res.status}: ${errorText}`, { domain: targetDomain });
      return {
        success: false,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        error: `ERP GetAlbums HTTP ${res.status}: ${errorText}`,
      };
    }

    const data = await res.json();
    const rows = data?.Data?.rd || data?.rd || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      logger.warn("ALBUMS_SYNC", `ERP GetAlbums returned 0 records for '${targetDomain}'`, { domain: targetDomain });
      return {
        success: true,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        message: "ERP GetAlbums returned 0 records.",
      };
    }

    const saveResult = saveAlbums(db, rows);

    logger.info("ALBUMS_SYNC", `Synced ${saveResult.savedCount} albums (deleted ${saveResult.deletedCount} old) for '${targetDomain}' in ${saveResult.elapsedMs}ms`, {
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      savedCount: saveResult.savedCount,
      deletedCount: saveResult.deletedCount,
    });

    return {
      success: true,
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      savedCount: saveResult.savedCount,
      deletedCount: saveResult.deletedCount,
      elapsedMs: saveResult.elapsedMs,
    };
  } catch (err) {
    logger.error("ALBUMS_SYNC", `Error syncing Albums for '${targetDomain}': ${err.message}`, {
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

export default syncAlbums;
