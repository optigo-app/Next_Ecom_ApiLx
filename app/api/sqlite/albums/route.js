import { NextResponse } from "next/server";
import { createGetHandler, extractDomain } from "../commonController";
import { getTenantDb } from "@/db/tenantManager";
import { saveAlbums } from "@/db/procedures/saveAlbums";
import { getAlbums } from "@/db/procedures/getAlbums";
import { syncAlbums } from "@/app/(core)/utils/sqlite/syncAlbums";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/sqlite/albums
 * 
 * Supports dual modes:
 * 1. Direct Push: Ingests and saves album data into SQLite (when Data.rd, rd, or array provided).
 * 2. Internal ERP Sync: Fetches GetAlbums from ERP using storeinit credentials from SQLite and saves to albums table
 *    (when sync=true, empty body, or no album rows in body).
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

    const rawAlbumList = Array.isArray(body)
      ? body
      : body?.Data?.rd || body?.rd || body?.albums || null;

    // Mode 1: Direct payload push
    if (Array.isArray(rawAlbumList) && rawAlbumList.length > 0 && !isSyncTrigger) {
      const db = getTenantDb(targetDomain);
      const saveResult = saveAlbums(db, rawAlbumList);

      logger.info("API_ALBUMS", `Saved ${saveResult.savedCount} albums (deleted ${saveResult.deletedCount} old) for '${targetDomain}' in ${saveResult.elapsedMs}ms`);

      return NextResponse.json(
        {
          success: true,
          message: `Saved ${saveResult.savedCount} albums into SQLite for '${targetDomain}' (${saveResult.deletedCount} previous rows deleted).`,
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
    logger.info("API_ALBUMS", `Triggering internal ERP GetAlbums sync for domain '${targetDomain}'`);
    const appuserid = body?.appuserid || searchParams.get("appuserid");
    const packageId = body?.packageId || body?.PackageId || searchParams.get("packageId") || searchParams.get("PackageId");

    const syncResult = await syncAlbums({
      domain: targetDomain,
      appuserid,
      packageId: packageId != null ? Number(packageId) : 0,
    });

    return NextResponse.json(
      {
        success: syncResult.success,
        message: syncResult.error
          ? `ERP Albums sync failed: ${syncResult.error}`
          : `Synced ${syncResult.savedCount} albums from ERP into SQLite for '${targetDomain}' (${syncResult.deletedCount ?? 0} previous rows deleted).`,
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
    logger.error("API_ALBUMS", `POST /api/sqlite/albums error: ${error.message}`, { error: error.stack });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process albums request",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sqlite/albums
 * Fast query of albums from SQLite with optional filtering.
 * Query parameters supported:
 * - ?domain=... (required)
 * - ?id=3 (optional filter by album ID)
 * - ?CustomerId=25 (optional filter by customer ID)
 * - ?albumcode=A26 (optional filter by albumcode)
 * - ?RandomNo=... (optional filter by RandomNo)
 * - ?search=Anemone (optional partial search by albumName/code)
 * - ?validOnly=true (optional filter to unexpired albums)
 * - ?limit=50 (optional pagination limit)
 * - ?offset=0 (optional pagination offset)
 */
export const GET = createGetHandler({
  entityName: "Albums",
  getFn: (db, options) => getAlbums(db, options),
  parseParamsFn: (searchParams) => ({
    id: searchParams.get("id"),
    CustomerId: searchParams.get("CustomerId") || searchParams.get("customerId"),
    albumcode: searchParams.get("albumcode") || searchParams.get("albumCode"),
    RandomNo: searchParams.get("RandomNo") || searchParams.get("randomNo"),
    albumName: searchParams.get("albumName"),
    search: searchParams.get("search") || searchParams.get("q"),
    validOnly: searchParams.get("validOnly") === "true",
    limit: searchParams.get("limit"),
    offset: searchParams.get("offset"),
    includePublic: searchParams.get("includePublic") === "true",
  }),
});
