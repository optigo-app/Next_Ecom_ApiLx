import { NextResponse } from "next/server";
import { extractDomain } from "../commonController";
import { getTenantDb } from "@/db/tenantManager";
import { saveWebsiteContent } from "@/db/procedures/saveWebsiteContent";
import { getWebsiteContent } from "@/db/procedures/getWebsiteContent";
import { syncWebsiteContent } from "@/app/(core)/utils/sqlite/syncWebsiteContent";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { 
  getGroupedWebsiteConfig,
  syncAndRefreshWebsiteContentCache 
} from "@/app/(core)/utils/sqlite/websiteContentConfig";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";
const NO_STORE_HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate" };

/**
 * POST /api/sqlite/website-content
 * 
 * Supports dual modes:
 * 1. Direct Push: Replaces the tenant's website content with the submitted snapshot (when Data.rd or array or content object provided).
 * 2. Internal ERP Sync: Fetches GetWebsiteContent from ERP using storeinit credentials and WebsiteId/domainid from SQLite and saves to website_content table
 *    (when sync=true, empty body, or no content items in body).
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

    logger.logApiRequest(req, { domain: targetDomain, category: "API_WEBSITE_CONTENT", body });

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
          : (body?.ContentType || body?.ContentJson || body?.Id ? [body] : null);
    const hasDirectPayload = Array.isArray(body) || Array.isArray(body?.Data?.rd) || Array.isArray(body?.rd) || Boolean(body?.ContentType || body?.ContentJson || body?.Id);

    const explicitWebsiteId = searchParams.get("WebsiteId") || searchParams.get("websiteId") || body?.WebsiteId || body?.websiteId || null;
    const explicitAppUserId = searchParams.get("appuserid") || body?.appuserid || null;

    logger.info("API_WEBSITE_CONTENT", `POST /api/sqlite/website-content request received for '${targetDomain}'`, {
      domain: targetDomain,
      url: req.url,
      queryParams: Object.fromEntries(searchParams.entries()),
      mode: isSyncTrigger ? "erp_sync" : (Array.isArray(rawList) && rawList.length > 0 ? "direct_push" : "erp_sync_fallback"),
      totalInputRows: rawList?.length || 0,
      explicitWebsiteId,
      explicitAppUserId,
      hasBody: Boolean(body && Object.keys(body).length > 0),
    });

    // Content pushes are complete snapshots by default. An explicit `replace: false`
    // remains available for callers that intentionally need upsert-only behavior.
    const isReplace = body?.replace !== false && searchParams.get("replace") !== "false";

    // Mode 1: Direct payload push
    if (hasDirectPayload && !isSyncTrigger) {
      const db = getTenantDb(targetDomain);
      if (!db) {
        logger.warn("API_WEBSITE_CONTENT", `Tenant database not found for domain '${targetDomain}'`);
        return NextResponse.json(
          { success: false, error: `Tenant database not found for domain '${targetDomain}'` },
          { status: 404 }
        );
      }

      const saveResult = saveWebsiteContent(db, rawList || [], { domain: targetDomain, replace: isReplace });

      // Automatically update SQLite data and rebuild the disk JSON cache file
      await syncAndRefreshWebsiteContentCache(targetDomain);

      logger.info("API_WEBSITE_CONTENT", `Direct push saved ${saveResult.savedCount} website content rows for '${targetDomain}' in ${saveResult.elapsedMs}ms`, {
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
          message: `Website content successfully saved into SQLite for '${targetDomain}' (${saveResult.insertedCount} inserted, ${saveResult.updatedCount} updated, ${saveResult.deletedCount} deleted).`,
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
    logger.info("API_WEBSITE_CONTENT", `Triggering internal ERP GetWebsiteContent sync for domain '${targetDomain}'`, {
      domain: targetDomain,
      explicitWebsiteId,
      explicitAppUserId,
      replace: isReplace,
      queryParams: Object.fromEntries(searchParams.entries()),
    });

    const syncResult = await syncWebsiteContent({
      domain: targetDomain,
      WebsiteId: explicitWebsiteId,
      appuserid: explicitAppUserId,
      replace: isReplace,
    });

    if (syncResult.success) {
      // Automatically update SQLite data and rebuild the disk JSON cache file
      await syncAndRefreshWebsiteContentCache(targetDomain);
    }

    logger.info("API_WEBSITE_CONTENT", `ERP GetWebsiteContent sync completed for domain '${targetDomain}' (success: ${syncResult.success})`, {
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
          ? `ERP WebsiteContent sync failed: ${syncResult.error}`
          : `Synced ${syncResult.savedCount} website content items from ERP into SQLite for '${targetDomain}' (${syncResult.insertedCount} inserted, ${syncResult.updatedCount} updated, ${syncResult.deletedCount} deleted).`,
        domain: targetDomain,
        totalReceived: syncResult.totalReceived,
        insertedCount: syncResult.insertedCount,
        updatedCount: syncResult.updatedCount,
        deletedCount: syncResult.deletedCount,
        savedCount: syncResult.savedCount,
        elapsedMs: syncResult.elapsedMs,
        error: syncResult.error,
      },
      { status: syncResult.success ? 200 : 400 }
    );
  } catch (error) {
    logger.error("API_WEBSITE_CONTENT", `POST /api/sqlite/website-content error: ${error.message}`, {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process website-content request",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sqlite/website-content
 * Fast read of website content from SQLite.
 * Query parameters supported:
 * - ?domain=... (required)
 * - ?contentType=branding (or ?type=branding)
 * - ?pageKey=...
 * - ?websiteId=...
 * - ?id=...
 * - ?isActive=true
 */
export async function GET(req) {
  try {
    let targetDomain = extractDomain(req);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }
    targetDomain = String(targetDomain).trim().split(":")[0];

    logger.logApiRequest(req, { domain: targetDomain, category: "API_WEBSITE_CONTENT" });

    const db = getTenantDb(targetDomain);
    if (!db) {
      logger.warn("API_WEBSITE_CONTENT", `GET: Tenant database not found for '${targetDomain}'`);
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
    const isGrouped = searchParams.get("grouped") === "true";
    const bypassCache = searchParams.get("bypassCache") === "true" || searchParams.get("refresh") === "true";

    if (isGrouped) {
      const groupedResult = await getGroupedWebsiteConfig({
        domain: targetDomain,
        bypassCache,
      });

      return NextResponse.json({
        Status: groupedResult.success ? "200" : "500",
        Message: groupedResult.success ? "Grouped website config retrieved successfully." : groupedResult.error,
        domain: targetDomain,
        source: groupedResult.source,
        Data: groupedResult.data,
      }, { status: groupedResult.success ? 200 : 500, headers: NO_STORE_HEADERS });
    }

    const contentType = searchParams.get("contentType") || searchParams.get("ContentType") || searchParams.get("type");
    const pageKey = searchParams.get("pageKey") || searchParams.get("PageKey");
    const websiteId = searchParams.get("websiteId") || searchParams.get("WebsiteId");
    const id = searchParams.get("id") || searchParams.get("Id");
    const isActive = searchParams.get("isActive") || searchParams.get("IsActive");

    const result = getWebsiteContent(db, {
      domain: targetDomain,
      contentType,
      pageKey,
      websiteId,
      id,
      isActive,
    });

    logger.info("API_WEBSITE_CONTENT", `GET /api/sqlite/website-content query served for '${targetDomain}'`, {
      domain: targetDomain,
      filters: { contentType, pageKey, websiteId, id, isActive },
      returnedCount: result?.Data?.rd?.length || 0,
    });

    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    logger.error("API_WEBSITE_CONTENT", `GET /api/sqlite/website-content error: ${error.message}`, {
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
