/**
 * /api/store-init
 * ───────────────
 * GET  → returns storeInit (memory → disk → remote, fastest path).
 * Used as a client-side fallback when the cookie is missing or truncated.
 */

import { NextResponse } from "next/server";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";
import { getTenantDb } from "@/db/tenantManager";
import { saveStoreInit } from "@/db/procedures/saveStoreInit";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export async function GET(req) {
  try {
    const host  = req.headers.get("host") || "";
    const data  = await getStoreInitData(host);
    const store = data?.rd?.[0] || {};

    return NextResponse.json(store, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch storeInit" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Empty or invalid storeInit payload" },
        { status: 400 }
      );
    }

    let targetDomain = body.domain || body.Domain || body?.Data?.rd?.[0]?.domain || body?.rd?.[0]?.domain;
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const db = getTenantDb(targetDomain);
    const result = saveStoreInit(db, body);

    return NextResponse.json(
      {
        success: true,
        message: "StoreInit data pushed and saved into SQLite successfully.",
        domain: targetDomain,
        counts: result.count,
        elapsedMs: result.elapsedMs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ /api/store-init POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

