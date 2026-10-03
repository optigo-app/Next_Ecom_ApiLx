import { NextResponse } from "next/server";
import { createGetHandler, extractDomain } from "../commonController";
import { getTenantDb } from "@/db/tenantManager";
import { saveMenus } from "@/db/procedures/saveMenus";
import { getMenus } from "@/db/procedures/getMenus";
import { syncMenus } from "@/app/(core)/utils/sqlite/syncMenusAndPackages";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/sqlite/menus
 * 
 * Supports dual modes:
 * 1. Direct Push: Ingests and saves menu hierarchy payload into SQLite (when Data.rd or array provided).
 * 2. Internal ERP Sync: Fetches GETFullMENU from ERP using storeinit credentials from SQLite and saves to menus table
 *    (when sync=true, empty body, or no menu items in body).
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

    const isSyncTrigger =
      body?.sync === true ||
      searchParams.get("sync") === "true" ||
      body?.mode === "sync" ||
      searchParams.get("mode") === "sync";

    const rawMenuList = Array.isArray(body)
      ? body
      : body?.Data?.rd || body?.rd || body?.menus || null;

    // Mode 1: Direct payload push
    if (Array.isArray(rawMenuList) && rawMenuList.length > 0 && !isSyncTrigger) {
      const db = getTenantDb(targetDomain);
      const saveResult = saveMenus(db, rawMenuList);

      logger.info("API_MENUS", `Saved ${saveResult.savedCount} menus (deleted ${saveResult.deletedCount} old) for '${targetDomain}' in ${saveResult.elapsedMs}ms`);

      return NextResponse.json(
        {
          success: true,
          message: `Saved ${saveResult.savedCount} menus into SQLite for '${targetDomain}' (${saveResult.deletedCount} previous rows deleted).`,
          domain: targetDomain,
          totalReceived: saveResult.totalReceived,
          deletedCount: saveResult.deletedCount,
          savedCount: saveResult.savedCount,
          elapsedMs: saveResult.elapsedMs,
        },
        { status: 200 }
      );
    }

    // Mode 2: Internal ERP Sync using storeinit config from SQLite
    logger.info("API_MENUS", `Triggering internal ERP GETFullMENU sync for domain '${targetDomain}'`);
    const customerId = body?.customerId || body?.CustomerId || searchParams.get("customerId") || searchParams.get("CustomerId") || "10";
    const appuserid = body?.appuserid || searchParams.get("appuserid");

    const syncResult = await syncMenus({
      domain: targetDomain,
      customerId,
      appuserid,
    });

    return NextResponse.json(
      {
        success: syncResult.success,
        message: syncResult.error
          ? `ERP Menu sync failed: ${syncResult.error}`
          : `Synced ${syncResult.savedCount} menus from ERP into SQLite for '${targetDomain}' (${syncResult.deletedCount ?? 0} previous rows deleted).`,
        domain: targetDomain,
        totalReceived: syncResult.totalReceived,
        deletedCount: syncResult.deletedCount ?? 0,
        savedCount: syncResult.savedCount,
        elapsedMs: syncResult.elapsedMs,
        error: syncResult.error,
      },
      { status: syncResult.success ? 200 : 400 }
    );
  } catch (error) {
    logger.error("API_MENUS", `POST /api/sqlite/menus error: ${error.message}`, { error: error.stack });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process menus request",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sqlite/menus
 * Fast query of header navigation menus from SQLite filtered by PackageId.
 * Query parameters supported:
 * - ?domain=... (required)
 * - ?packageId=10 (optional - overrides storeInit PackageId)
 */
export const GET = createGetHandler({
  entityName: "Menus",
  getFn: (db, options) => getMenus(db, options),
  parseParamsFn: (searchParams) => ({
    packageId: searchParams.get("packageId") || searchParams.get("PackageId"),
  }),
});
