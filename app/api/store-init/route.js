/**
 * /api/store-init
 * ───────────────
 * GET  → returns storeInit (memory → disk → remote, fastest path).
 * Used as a client-side fallback when the cookie is missing or truncated.
 */

import { NextResponse } from "next/server";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";

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
