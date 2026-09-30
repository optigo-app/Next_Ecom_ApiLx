import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { extractDomain } from "../commonController";

export const dynamic = "force-dynamic";

/**
 * Flush WAL to disk for immediate synchronization
 * POST/GET/DELETE /api/sqlite/flush?domain=beluxjewel.web
 */
async function handleFlush(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {}

    const targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      return NextResponse.json(
        { success: false, error: "Domain is required. Pass ?domain=xyz.com or in header/body." },
        { status: 400 }
      );
    }

    const db = getTenantDb(targetDomain);
    const checkpoint = db.pragma("wal_checkpoint(TRUNCATE)");

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      message: "SQLite WAL successfully flushed to disk (database.db is fully synchronized).",
      checkpoint,
    });
  } catch (error) {
    console.error("❌ SQLite Flush error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  return handleFlush(req);
}

export async function GET(req) {
  return handleFlush(req);
}

// export async function DELETE(req) {
//   return handleFlush(req);
// }
