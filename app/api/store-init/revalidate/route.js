/**
 * /api/store-init/revalidate
 * ──────────────────────────
 * POST  → force-refresh storeInit from CDN and update disk + memory cache.
 * GET   → returns current cached storeInit data (memory → disk, no remote hit).
 *
 * Protect with REVALIDATE_SECRET env var in production:
 *   REVALIDATE_SECRET=my-secret-key
 *
 * Usage (from admin / CDN webhook):
 *   POST /api/store-init/revalidate
 *   Headers: x-revalidate-secret: <REVALIDATE_SECRET>
 *
 * Usage (read current cache):
 *   GET /api/store-init/revalidate
 */

import { NextResponse } from "next/server";
import {
  revalidateStoreInit,
  getStoreInitData,
} from "@/app/(core)/cache_utility/storeInitCache";

const SECRET = process.env.REVALIDATE_SECRET;

function isAuthorized(req) {
  if (!SECRET) return true; // No secret configured → open (dev only)
  const header = req.headers.get("x-revalidate-secret");
  const query  = new URL(req.url).searchParams.get("secret");
  return header === SECRET || query === SECRET;
}

// ── POST — force revalidation ────────────────────────────────────────────────
export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const host = req.headers.get("host") || "";
    const fresh = await revalidateStoreInit(host);
    const version = fresh?.rd?.[0]?.FileCreateDate ?? null;

    return NextResponse.json({
      ok: true,
      message: "StoreInit revalidated",
      version,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Revalidation failed", detail: err.message },
      { status: 500 }
    );
  }
}

// ── GET — read current cache without hitting remote ──────────────────────────
export async function GET(req) {
  try {
    const host  = req.headers.get("host") || "";
    const data  = await getStoreInitData(host);
    const store = data?.rd?.[0] || {};

    return NextResponse.json({
      ok: true,
      storeInit: store,
      version: store?.FileCreateDate ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to read storeInit" },
      { status: 500 }
    );
  }
}
