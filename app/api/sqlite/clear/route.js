import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { truncateAllData } from "@/db/schema/index";
import { deleteDesigns } from "@/db/procedures/deleteDesigns";
import { deleteMenus } from "@/db/procedures/deleteMenus";
import { deleteMenuFilters } from "@/db/procedures/deleteMenuFilters";
import { deleteStoreInit } from "@/db/procedures/deleteStoreInit";
import { deletePackageMaster } from "@/db/procedures/deletePackageMaster";
import { deleteAlbums } from "@/db/procedures/deleteAlbums";
import { extractDomain } from "../commonController";

export const dynamic = "force-dynamic";

/**
 * Endpoint to clear/truncate specific or all SQLite tables for a tenant.
 * POST/DELETE /api/sqlite/clear?domain=beluxjewel.web&table=designs
 * Query params or body:
 * - domain: required
 * - table: "designs" | "products" | "menus" | "filters" | "storeinit" | "package-master" | "all"
 */
async function handleClear(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {}

    const targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      return NextResponse.json(
        { success: false, error: "Domain is required. Pass ?domain=xyz.com, header, or body." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const table = (searchParams.get("table") || body.table || "all").toLowerCase();

    const db = getTenantDb(targetDomain);
    let result;

    switch (table) {
      case "designs":
      case "products":
        result = deleteDesigns(db, { all: true });
        break;
      case "menus":
        result = deleteMenus(db);
        break;
      case "filters":
      case "menu_filters":
        result = deleteMenuFilters(db);
        break;
      case "storeinit":
      case "store-init":
        result = deleteStoreInit(db);
        break;
      case "packagemaster":
      case "package-master":
        result = deletePackageMaster(db);
        break;
      case "albums":
        result = deleteAlbums(db, { all: true });
        break;
      case "all":
      default:
        truncateAllData(db);
        result = {
          success: true,
          message: "All tables (designs, menus, filters, storeinit, account, companyinfo, packagemaster, albums) cleared.",
        };
        break;
    }

    // Force flush
    try {
      db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      table,
      ...result,
    });
  } catch (error) {
    console.error("❌ SQLite Clear error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  return handleClear(req);
}

// export async function DELETE(req) {
//   return handleClear(req);
// }

export async function GET(req) {
  return handleClear(req);
}
