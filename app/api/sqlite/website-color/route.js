import { NextResponse } from "next/server";
import { extractDomain } from "../commonController";
import { getTenantDb } from "@/db/tenantManager";
import { saveWebsiteColor } from "@/db/procedures/saveWebsiteColor";
import { getWebsiteColor } from "@/db/procedures/getWebsiteColor";
import { syncWebsiteColor } from "@/app/(core)/utils/sqlite/syncWebsiteColor";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { 
  getWebsiteColorConfig,
  syncAndRefreshWebsiteColorCache 
} from "@/app/(core)/utils/sqlite/websiteColorConfig";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";
const NO_STORE_HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate" };

/**
 * POST /api/sqlite/website-color
 * 
 * Supports dual modes:
 * 1. Direct Push: Replaces/upserts tenant website theme/color configuration with submitted snapshot.
 * 2. Internal ERP Sync: Fetches GetWebsiteColor from ERP using storeinit credentials and saves to website_color table
 *    (when sync=true, empty body, or no color items in body).
 */
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const { searchParams } = new URL(req.url);
    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }
    targetDomain = String(targetDomain).trim().split(":")[0];

    logger.logApiRequest(req, { domain: targetDomain, category: "API_WEBSITE_COLOR", body });

    const isSyncTrigger =
      body?.sync === true ||
      searchParams.get("sync") === "true" ||
      body?.mode === "sync" ||
      searchParams.get("mode") === "sync";

    const rawList = Array.isArray(body)
      ? body
      : Array.isArray(body?.Data?.rd)
        ? body.Data.rd
        : Array.isArray(body?.rd)
          ? body.rd
          : (body?.store_id || body?.primary_theme_color || body?.id ? [body] : null);
    const hasDirectPayload = Array.isArray(body) || Array.isArray(body?.Data?.rd) || Array.isArray(body?.rd) || Boolean(body?.store_id || body?.primary_theme_color || body?.id);

    const explicitWebsiteId = searchParams.get("WebsiteId") || searchParams.get("websiteId") || searchParams.get("store_id") || body?.WebsiteId || body?.websiteId || body?.store_id || null;
    const explicitAppUserId = searchParams.get("appuserid") || body?.appuserid || null;

    logger.info("API_WEBSITE_COLOR", `POST /api/sqlite/website-color request received for '${targetDomain}'`, {
      domain: targetDomain,
      url: req.url,
      queryParams: Object.fromEntries(searchParams.entries()),
      mode: isSyncTrigger ? "erp_sync" : (Array.isArray(rawList) && rawList.length > 0 ? "direct_push" : "erp_sync_fallback"),
      totalInputRows: rawList?.length || 0,
      explicitWebsiteId,
      explicitAppUserId,
      hasBody: Boolean(body && Object.keys(body).length > 0),
    });

    const isReplace = body?.replace !== false && searchParams.get("replace") !== "false";

    // Mode 1: Direct payload push
    if (hasDirectPayload && !isSyncTrigger) {
      const db = getTenantDb(targetDomain);
      if (!db) {
        logger.warn("API_WEBSITE_COLOR", `Tenant database not found for domain '${targetDomain}'`);
        return NextResponse.json(
          { success: false, error: `Tenant database not found for domain '${targetDomain}'` },
          { status: 404 }
        );
      }

      const saveResult = saveWebsiteColor(db, rawList || [], { domain: targetDomain, replace: isReplace });

      // Automatically sync latest SQLite data into disk JSON snapshot
      await syncAndRefreshWebsiteColorCache(targetDomain);

      logger.info("API_WEBSITE_COLOR", `Direct push saved ${saveResult.savedCount} website color rows for '${targetDomain}' in ${saveResult.elapsedMs}ms`, {
        domain: targetDomain,
        totalReceived: saveResult.totalReceived,
        insertedCount: saveResult.insertedCount,
        updatedCount: saveResult.updatedCount,
        deletedCount: saveResult.deletedCount,
        savedCount: saveResult.savedCount,
        elapsedMs: saveResult.elapsedMs,
        sampleRow: rawList[0] || null,
      });

      return NextResponse.json(
        {
          success: true,
          message: `Website color configuration successfully saved into SQLite for '${targetDomain}' (${saveResult.insertedCount} inserted, ${saveResult.updatedCount} updated, ${saveResult.deletedCount} deleted).`,
          domain: targetDomain,
          totalReceived: saveResult.totalReceived,
          insertedCount: saveResult.insertedCount,
          updatedCount: saveResult.updatedCount,
          deletedCount: saveResult.deletedCount,
          savedCount: saveResult.savedCount,
          elapsedMs: saveResult.elapsedMs,
        },
        { status: 200 }
      );
    }

    // Mode 2: Internal ERP Sync using storeinit config and WebsiteId from SQLite
    logger.info("API_WEBSITE_COLOR", `Triggering internal ERP GetWebsiteColor sync for domain '${targetDomain}'`, {
      domain: targetDomain,
      explicitWebsiteId,
      explicitAppUserId,
      replace: isReplace,
      queryParams: Object.fromEntries(searchParams.entries()),
    });

    const syncResult = await syncWebsiteColor({
      domain: targetDomain,
      WebsiteId: explicitWebsiteId,
      appuserid: explicitAppUserId,
      replace: isReplace,
    });

    if (syncResult.success) {
      // Automatically sync latest SQLite data into disk JSON snapshot
      await syncAndRefreshWebsiteColorCache(targetDomain);
    }

    logger.info("API_WEBSITE_COLOR", `ERP GetWebsiteColor sync completed for domain '${targetDomain}' (success: ${syncResult.success})`, {
      domain: targetDomain,
      success: syncResult.success,
      totalReceived: syncResult.totalReceived,
      insertedCount: syncResult.insertedCount,
      updatedCount: syncResult.updatedCount,
      deletedCount: syncResult.deletedCount,
      savedCount: syncResult.savedCount,
      elapsedMs: syncResult.elapsedMs,
      error: syncResult.error || null,
    });

    return NextResponse.json(
      {
        success: syncResult.success,
        message: syncResult.error
          ? `ERP WebsiteColor sync failed: ${syncResult.error}`
          : `Synced ${syncResult.savedCount} website color items from ERP into SQLite for '${targetDomain}' (${syncResult.insertedCount} inserted, ${syncResult.updatedCount} updated, ${syncResult.deletedCount} deleted).`,
        domain: targetDomain,
        totalReceived: syncResult.totalReceived,
        insertedCount: syncResult.insertedCount,
        updatedCount: syncResult.updatedCount,
        deletedCount: syncResult.deletedCount,
        savedCount: syncResult.savedCount,
        elapsedMs: syncResult.elapsedMs,
        error: syncResult.error,
        Data: syncResult.Data,
      },
      { status: syncResult.success ? 200 : 400 }
    );
  } catch (error) {
    logger.error("API_WEBSITE_COLOR", `POST /api/sqlite/website-color error: ${error.message}`, {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process website-color request",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sqlite/website-color
 * Fast read of website color/theme configuration from SQLite.
 * Query parameters supported:
 * - ?domain=... (optional, auto-resolved from host header)
 * - ?store_id=...
 * - ?websiteId=...
 * - ?id=...
 */
export async function GET(req) {
  try {
    let targetDomain = extractDomain(req);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }
    targetDomain = String(targetDomain).trim().split(":")[0];

    logger.logApiRequest(req, { domain: targetDomain, category: "API_WEBSITE_COLOR" });

    const db = getTenantDb(targetDomain);
    if (!db) {
      logger.warn("API_WEBSITE_COLOR", `GET: Tenant database not found for '${targetDomain}'`);
      return NextResponse.json(
        {
          Status: "404",
          Message: `Tenant database not found for domain '${targetDomain}'.`,
          Data: { rd: [] },
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const isConfig = searchParams.get("config") === "true" || searchParams.get("grouped") === "true";
    const store_id = searchParams.get("store_id") || searchParams.get("storeId") || searchParams.get("websiteId") || searchParams.get("WebsiteId");
    const id = searchParams.get("id") || searchParams.get("Id");

    if (isConfig) {
      const configResult = await getWebsiteColorConfig({
        domain: targetDomain,
        store_id,
      });

      return NextResponse.json({
        Status: configResult.success ? "200" : "500",
        Message: configResult.success ? "Website color configuration retrieved successfully." : configResult.error,
        domain: targetDomain,
        source: configResult.source,
        Data: configResult.data,
      }, { status: configResult.success ? 200 : 500, headers: NO_STORE_HEADERS });
    }

    const result = getWebsiteColor(db, {
      domain: targetDomain,
      store_id,
      id,
    });

    logger.info("API_WEBSITE_COLOR", `GET /api/sqlite/website-color query served for '${targetDomain}'`, {
      domain: targetDomain,
      filters: { store_id, id },
      returnedCount: result?.Data?.rd?.length || 0,
    });

    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    logger.error("API_WEBSITE_COLOR", `GET /api/sqlite/website-color error: ${error.message}`, {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [] },
      },
      { status: 500 }
    );
  }
}
