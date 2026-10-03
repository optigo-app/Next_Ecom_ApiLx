import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { saveStoreInit } from "@/db/procedures/saveStoreInit";
import { getStoreInit } from "@/db/procedures/getStoreInit";
import { deleteStoreInit } from "@/db/procedures/deleteStoreInit";
import { syncStoreInit } from "@/app/(core)/utils/sqlite/syncStoreInit";
import { clearStoreInitCache, setStoreInitCache } from "@/app/(core)/cache_utility/storeInitCache";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";

/**
 * Extracts the target domain directly from query param or body
 */
function extractDomain(req, body = {}) {
  // 1. Read from query param: ?domain=...
  try {
    const { searchParams } = new URL(req.url);
    const qDomain = searchParams.get("domain") || searchParams.get("Domain");
    if (qDomain && qDomain.trim()) return qDomain.trim();
  } catch (_) { }

  // 2. Read from body (for POST requests)
  if (body?.domain || body?.Domain) {
    return String(body.domain || body.Domain).trim();
  }

  const rd = body?.Data?.rd?.[0] || body?.rd?.[0];
  if (rd?.domain) {
    return String(rd.domain).trim();
  }

  return null;
}

/**
 * POST /api/sqlite/store-init
 * Push and save storeInit configuration (rd, rd1, rd2) directly into SQLite.
 */
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseErr) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          details: parseErr.message,
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Empty or invalid storeInit payload" },
        { status: 400 }
      );
    }

    const targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      logger.warn("API_STORE_INIT", "POST /api/sqlite/store-init called without domain", { headers: Object.fromEntries(req.headers.entries()) });
      return NextResponse.json(
        {
          success: false,
          error: "Domain is required. Please provide a domain in body ('domain': 'xyz.com'), query param (?domain=xyz.com), or header ('x-domain: xyz.com').",
        },
        { status: 400 }
      );
    }

    // Check if client is requesting an internal sync fetch instead of providing the raw payload
    if (body.apiurl && body.version) {
      logger.info("API_STORE_INIT", `POST /api/sqlite/store-init: Detected apiurl. Initiating sync for '${targetDomain}'`);
      const syncResult = await syncStoreInit({
        apiurl: body.apiurl,
        domain: targetDomain,
        version: body.version,
        sv: body.sv !== undefined ? body.sv : 0,
      });

      if (!syncResult.success) {
        return NextResponse.json(syncResult, { status: 400 });
      }

      // Instantly seed the server cache with the new data so next page load
      // gets fresh storeInit without a cold-start round-trip.
      const db = getTenantDb(targetDomain);
      const savedRow = db.prepare("SELECT FileCreateDate FROM storeinit ORDER BY id ASC LIMIT 1").get();
      const savedFileCreateDate = savedRow?.FileCreateDate ?? null;
      const verified = Boolean(savedFileCreateDate);

      if (!verified) {
        logger.warn("API_STORE_INIT", `Sync completed but FileCreateDate not found in SQLite for '${targetDomain}'`);
      } else {
        logger.info("API_STORE_INIT", `Sync verified — FileCreateDate in SQLite: '${savedFileCreateDate}'`);
      }

      // Read fresh data from SQLite and seed the cache directly
      const freshData = getStoreInit(db, { domain: targetDomain });
      await clearStoreInitCache();
      if (freshData?.Data?.rd?.length > 0) {
        await setStoreInitCache(targetDomain, freshData);
      }

      return NextResponse.json({
        success: true,
        message: "StoreInit data successfully synced and saved from external API.",
        verified,
        savedFileCreateDate,
        ...syncResult
      }, { status: 200 });
    }

    logger.info("API_STORE_INIT", `POST /api/sqlite/store-init: Pushing StoreInit for domain '${targetDomain}'`, { domain: targetDomain });

    // Extract the FileCreateDate from incoming payload for post-write verification
    const dataContainer = body?.Data || body;
    const sentFileCreateDate =
      dataContainer?.rd?.[0]?.FileCreateDate ??
      dataContainer?.rd?.FileCreateDate ??
      null;

    const db = getTenantDb(targetDomain);
    const result = saveStoreInit(db, body);

    // ── Verify write: read back FileCreateDate from SQLite ─────────────────
    const savedRow = db.prepare("SELECT FileCreateDate FROM storeinit ORDER BY id ASC LIMIT 1").get();
    const savedFileCreateDate = savedRow?.FileCreateDate ?? null;
    const verified = sentFileCreateDate
      ? sentFileCreateDate === savedFileCreateDate
      : Boolean(savedFileCreateDate);

    if (!verified && sentFileCreateDate) {
      logger.warn("API_STORE_INIT", `FileCreateDate MISMATCH for '${targetDomain}' — sent: '${sentFileCreateDate}', saved: '${savedFileCreateDate}'. SQLite write may have failed.`, {
        domain: targetDomain,
        sentFileCreateDate,
        savedFileCreateDate,
      });
    } else {
      logger.info("API_STORE_INIT", `Successfully persisted StoreInit for '${targetDomain}' in ${result.elapsedMs}ms — FileCreateDate verified: '${savedFileCreateDate}'`, {
        domain: targetDomain,
        counts: result.count,
        elapsedMs: result.elapsedMs,
        verified,
      });
    }

    // Read fresh data from SQLite and seed the cache directly — zero stale window
    const freshData = getStoreInit(db, { domain: targetDomain });
    await clearStoreInitCache();
    if (freshData?.Data?.rd?.length > 0) {
      await setStoreInitCache(targetDomain, freshData);
    }

    return NextResponse.json(
      {
        success: true,
        verified,
        message: verified
          ? "StoreInit data successfully pushed and saved into SQLite."
          : `StoreInit saved but FileCreateDate mismatch — sent: '${sentFileCreateDate}', saved in SQLite: '${savedFileCreateDate}'. Check saveStoreInit upsert logic.`,
        domain: targetDomain,
        sentFileCreateDate,
        savedFileCreateDate,
        counts: result.count,
        elapsedMs: result.elapsedMs,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("API_STORE_INIT", `POST /api/sqlite/store-init error: ${error.message}`, { error: error.stack });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to push storeInit data into SQLite",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sqlite/store-init
 * Fast read of storeInit (rd, rd1, rd2) from SQLite.
 */
export async function GET(req) {
  try {
    const targetDomain = extractDomain(req);

    // Require domain explicitly
    if (!targetDomain) {
      logger.warn("API_STORE_INIT", "GET /api/sqlite/store-init called without domain");
      return NextResponse.json(
        {
          Status: "400",
          Message: "Domain parameter is required to access storeInit data. Please pass ?domain=yourdomain.com or Header 'x-domain: yourdomain.com'.",
          Data: { rd: [], rd1: [], rd2: [] },
        },
        { status: 400 }
      );
    }

    logger.info("API_STORE_INIT", `GET /api/sqlite/store-init reading for domain '${targetDomain}'`, { domain: targetDomain });

    const db = getTenantDb(targetDomain);
    const data = getStoreInit(db, { domain: targetDomain });

    // If tenant database has no storeinit data
    if (!data?.Data?.rd || data.Data.rd.length === 0) {
      logger.warn("API_STORE_INIT", `No storeInit data found in SQLite for domain '${targetDomain}'`, { domain: targetDomain });
      return NextResponse.json(
        {
          Status: "404",
          Message: `No storeInit data found for domain '${targetDomain}'.`,
          Data: { rd: [], rd1: [], rd2: [] },
        },
        { status: 404 }
      );
    }

    logger.info("API_STORE_INIT", `Successfully served StoreInit for '${targetDomain}'`, {
      domain: targetDomain,
      rd: data.Data.rd.length,
      rd1: data.Data.rd1.length,
      rd2: data.Data.rd2.length,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    logger.error("API_STORE_INIT", `GET /api/sqlite/store-init error: ${error.message}`, { error: error.stack });
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [], rd1: [], rd2: [] },
      },
      { status: 500 }
    );
  }
}

/*
export async function DELETE(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {}

    const targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      return NextResponse.json(
        {
          success: false,
          error: "Domain is required. Pass ?domain=xyz.com, header, or body.",
        },
        { status: 400 }
      );
    }

    const db = getTenantDb(targetDomain);
    const result = deleteStoreInit(db);

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      ...result,
    });
  } catch (error) {
    logger.error("API_STORE_INIT", `DELETE /api/sqlite/store-init error: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
*/
