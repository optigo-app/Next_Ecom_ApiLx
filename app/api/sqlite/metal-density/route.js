import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { ensureMetalDensityTable } from "@/db/schema/metalDensity";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") || request.headers.get("x-domain");
  if (!domain) {
    return NextResponse.json({ success: false, error: "Domain is required.", data: [] }, { status: 400 });
  }

  const db = getTenantDb(domain);
  if (!db) {
    return NextResponse.json({ success: false, error: "Tenant database is unavailable.", data: [] }, { status: 404 });
  }

  ensureMetalDensityTable(db);
  const data = db.prepare("SELECT id, gold_type, density FROM metal_density ORDER BY id ASC").all();
  return NextResponse.json({ success: true, data }, { status: 200 });
}
