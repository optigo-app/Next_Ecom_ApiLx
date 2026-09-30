import { NextResponse } from "next/server";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { syncAllCatalogProducts } from "@/app/(core)/utils/sqlite/syncAllProducts";
import { syncMenusAndPackages } from "@/app/(core)/utils/sqlite/syncMenusAndPackages";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (_) {}

    const { searchParams } = new URL(request.url);
    const domainInfo = await getDomainInfo().catch(() => ({}));
    const storeInit = await getStoreInit().catch(() => ({}));
    const targetDomain = body?.domain || searchParams.get("domain") || storeInit?.domain || domainInfo?.hostname || "default";
    const force = body?.force === true || searchParams.get("force") === "true";

    const [productsResult, menuPkgResult] = await Promise.all([
      syncAllCatalogProducts(storeInit, targetDomain, force),
      syncMenusAndPackages({ domain: targetDomain, storeInit }),
    ]);

    const isSuccess = productsResult.success && menuPkgResult.success;

    return NextResponse.json(
      {
        success: isSuccess,
        domain: targetDomain,
        products: productsResult,
        packages: menuPkgResult.packages,
        menus: menuPkgResult.menus,
      },
      { status: isSuccess ? 200 : 207 }
    );
  } catch (error) {
    console.error("[API sync-all] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return POST(request);
}
