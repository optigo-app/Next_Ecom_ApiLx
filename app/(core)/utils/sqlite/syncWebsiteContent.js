import { getTenantDb } from "@/db/tenantManager.js";
import { saveWebsiteContent } from "@/db/procedures/saveWebsiteContent.js";
import { ensureWebsiteContentTable } from "@/db/schema/websiteContent.js";
import { ensureStoreInitColumns } from "@/db/schema/storeInit.js";
import { logger } from "@/db/logger.js";
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
      ensureStoreInitColumns(db);
      storeInit = db.prepare("SELECT * FROM storeinit LIMIT 1").get();
    } catch (_) { }
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
 * Synchronizes website content (branding, banners, etc.) from ERP (GetWebsiteContent) into SQLite.
 *
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {number|string} [options.WebsiteId] - WebsiteId override (defaults to storeinit.domainid or storeinit.WebsiteId)
 * @param {string} [options.appuserid] - Optional override for appuserid
 * @param {object} [options.storeInit] - Preloaded storeInit record
 * @returns {Promise<{ success: boolean, domain: string, totalReceived: number, savedCount: number, elapsedMs?: number, error?: string, Data?: object }>}
 */
export async function syncWebsiteContent(options = {}) {
  const targetDomain = await resolveDomain(options.domain);
  const db = getTenantDb(targetDomain);

  if (!db) {
    logger.warn("WEBSITE_CONTENT_SYNC", `Database connection unavailable for domain '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: `Database connection unavailable or domain '${targetDomain}' not authorized.`,
    };
  }

  ensureWebsiteContentTable(db);
  const storeInit = resolveStoreInit(db, options.storeInit);

  if (!storeInit) {
    logger.warn("WEBSITE_CONTENT_SYNC", `storeinit record not found for domain '${targetDomain}'`);
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
    logger.warn("WEBSITE_CONTENT_SYNC", `ApiUrl is missing in storeinit for domain '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      totalReceived: 0,
      savedCount: 0,
      error: "ApiUrl is missing in storeinit configuration.",
    };
  }

  const headers = buildErpHeaders(storeInit);
  const appuserid = options.appuserid || options.appUserId || "nimesh@ymail.in";

  // Resolve WebsiteId: explicit option -> storeinit.domainid -> storeinit.WebsiteId -> 0
  const websiteId = options.WebsiteId ?? options.websiteId ?? storeInit.domainid ?? storeInit.WebsiteId ?? 0;

  const parsedCon = {
    id: "",
    mode: "GetWebsiteContent",
    appuserid,
  };
  const parsedP = {
    WebsiteId: Number(websiteId),
  };

  const requestBody = {
    con: JSON.stringify(parsedCon),
    f: "onlogin (GetWebsiteContent)",
    p: JSON.stringify(parsedP),
  };

  logger.info("WEBSITE_CONTENT_SYNC", `Calling ERP GetWebsiteContent API for tenant '${targetDomain}'`, {
    domain: targetDomain,
    url: endpoint,
    method: "POST",
    headers,
    requestBody,
    parsedPayload: {
      con: parsedCon,
      f: requestBody.f,
      p: parsedP,
    },
    resolvedParams: {
      websiteId,
      appuserid,
      sourceWebsiteId: options.WebsiteId != null ? "request_option" : storeInit.domainid != null ? "storeinit.domainid" : "fallback_0",
      sourceAppUserId: options.appuserid != null ? "request_option" : "default_nimesh",
    },
    storeInitCredentials: {
      YearCode: storeInit.YearCode,
      version: storeInit.version,
      sv: storeInit.sv,
      domainid: storeInit.domainid,
      WebsiteId: storeInit.WebsiteId,
      token: storeInit.token ? `${String(storeInit.token).substring(0, 6)}...` : null,
    },
  });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const rawResponseText = await res.text().catch(() => "");
    let data;
    try {
      data = JSON.parse(rawResponseText);
    } catch (_) {
      data = null;
    }

    if (!res.ok) {
      logger.error("WEBSITE_CONTENT_SYNC", `ERP GetWebsiteContent HTTP ${res.status} error for '${targetDomain}'`, {
        domain: targetDomain,
        url: endpoint,
        httpStatus: res.status,
        httpStatusText: res.statusText,
        sentHeaders: headers,
        sentBody: requestBody,
        rawResponseBody: rawResponseText,
      });
      return {
        success: false,
        domain: targetDomain,
        totalReceived: 0,
        savedCount: 0,
        error: `ERP GetWebsiteContent HTTP ${res.status}: ${rawResponseText}`,
        details: {
          sentUrl: endpoint,
          sentHeaders: headers,
          sentBody: requestBody,
        },
      };
    }

    const rows = data?.Data?.rd || data?.rd || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      logger.warn("WEBSITE_CONTENT_SYNC", `ERP GetWebsiteContent returned 0 records for '${targetDomain}'`, {
        domain: targetDomain,
        url: endpoint,
        httpStatus: res.status,
        sentHeaders: headers,
        sentPayload: requestBody,
        sentWebsiteId: websiteId,
        sentAppUserId: appuserid,
        erpResponse: data || rawResponseText,
      });
      const emptySyncSave = options.replace === false
        ? null
        : saveWebsiteContent(db, [], { domain: targetDomain, WebsiteId: websiteId, replace: true });

      return {
        success: true,
        domain: targetDomain,
        totalReceived: 0,
        insertedCount: 0,
        updatedCount: 0,
        deletedCount: emptySyncSave?.deletedCount || 0,
        savedCount: 0,
        message: "ERP GetWebsiteContent returned 0 records.",
        sentParams: {
          endpoint,
          headers,
          requestBody,
        },
        erpResponse: data,
        Data: { rd: [] },
      };
    }

    logger.info("WEBSITE_CONTENT_SYNC", `ERP GetWebsiteContent returned ${rows.length} records for '${targetDomain}'`, {
      domain: targetDomain,
      httpStatus: res.status,
      recordsCount: rows.length,
      sampleFirstRecord: rows[0],
      erpResponseStatus: data?.Status,
      erpResponseMessage: data?.Message,
    });

    const saveResult = saveWebsiteContent(db, rows, {
      domain: targetDomain,
      WebsiteId: websiteId,
      replace: options.replace !== false,
    });

    logger.info("WEBSITE_CONTENT_SYNC", `Successfully synced and persisted ${saveResult.savedCount} website content items for '${targetDomain}' in ${saveResult.elapsedMs}ms`, {
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      insertedCount: saveResult.insertedCount,
      updatedCount: saveResult.updatedCount,
      deletedCount: saveResult.deletedCount,
      savedCount: saveResult.savedCount,
      elapsedMs: saveResult.elapsedMs,
    });

    return {
      success: true,
      domain: targetDomain,
      totalReceived: saveResult.totalReceived,
      insertedCount: saveResult.insertedCount,
      updatedCount: saveResult.updatedCount,
      deletedCount: saveResult.deletedCount,
      savedCount: saveResult.savedCount,
      elapsedMs: saveResult.elapsedMs,
    };
  } catch (err) {
    logger.error("WEBSITE_CONTENT_SYNC", `syncWebsiteContent exception for '${targetDomain}': ${err.message}`, {
      domain: targetDomain,
      url: endpoint,
      sentHeaders: headers,
      sentBody: requestBody,
      error: err.message,
      stack: err.stack,
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

export default syncWebsiteContent;
