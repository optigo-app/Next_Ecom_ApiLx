import { NextResponse } from "next/server";
import { createGetHandler, extractDomain } from "../commonController";
import { getTenantDb } from "@/db/tenantManager";
import { savePackageMaster } from "@/db/procedures/savePackageMaster";
import { getPackageMaster } from "@/db/procedures/getPackageMaster";
import { syncPackageMaster } from "@/app/(core)/utils/sqlite/syncMenusAndPackages";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/sqlite/package-master
 * 
 * Supports dual modes:
 * 1. Direct Push: Ingests and saves package master data into SQLite (when Data.rd or array provided).
 * 2. Internal ERP Sync: Fetches PackageMst from ERP using storeinit credentials from SQLite and saves to packagemaster table
 *    (when sync=true, empty body, or no package rows in body).
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

    const rawPackageList = Array.isArray(body)
      ? body
      : body?.Data?.rd || body?.rd || body?.packages || null;

    // Mode 1: Direct payload push
    if (Array.isArray(rawPackageList) && rawPackageList.length > 0 && !isSyncTrigger) {
      const db = getTenantDb(targetDomain);
      const saveResult = savePackageMaster(db, rawPackageList);

      logger.info("API_PACKAGE_MASTER", `Saved ${saveResult.savedCount} packages (deleted ${saveResult.deletedCount} old) for '${targetDomain}' in ${saveResult.elapsedMs}ms`);

      return NextResponse.json(
        {
          success: true,
          message: `Saved ${saveResult.savedCount} package master items into SQLite for '${targetDomain}' (${saveResult.deletedCount} previous rows deleted).`,
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
    logger.info("API_PACKAGE_MASTER", `Triggering internal ERP PackageMst sync for domain '${targetDomain}'`);
    const appuserid = body?.appuserid || searchParams.get("appuserid");

    const syncResult = await syncPackageMaster({
      domain: targetDomain,
      appuserid,
    });

    return NextResponse.json(
      {
        success: syncResult.success,
        message: syncResult.error
          ? `ERP Package Master sync failed: ${syncResult.error}`
          : `Synced ${syncResult.savedCount} package master items from ERP into SQLite for '${targetDomain}' (${syncResult.deletedCount ?? 0} previous rows deleted).`,
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
    logger.error("API_PACKAGE_MASTER", `POST /api/sqlite/package-master error: ${error.message}`, { error: error.stack });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process package-master request",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sqlite/package-master
 * Fast query of package master definitions from SQLite with optional filtering.
 * Query parameters supported:
 * - ?domain=... (required)
 * - ?id=10 (optional filter)
 * - ?asPackageName=western (optional filter)
 */
export const GET = createGetHandler({
  entityName: "PackageMaster",
  getFn: (db, options) => getPackageMaster(db, options),
  parseParamsFn: (searchParams) => ({
    id: searchParams.get("id"),
    asPackageName: searchParams.get("asPackageName"),
  }),
});
