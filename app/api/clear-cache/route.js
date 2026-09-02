import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearAllCache as clearAllServerCache } from "@/app/(core)/cache_utility/serverCache";
import { clearAllCache as clearAllDynamicCache, getAllCachedItems } from "@/app/(core)/cache_utility/dynamic_serverCache";
import { clearStoreInitCache } from "@/app/(core)/cache_utility/storeInitCache";

async function handleClearAllCache() {
  const [serverRes, dynamicRes, storeInitRes] = await Promise.allSettled([
    clearAllServerCache(),
    clearAllDynamicCache(),
    clearStoreInitCache(),
  ]);

  try {
    revalidatePath("/", "layout");
  } catch (_) {}

  return {
    server: serverRes.status === "fulfilled",
    dynamic: dynamicRes.status === "fulfilled",
    storeInit: storeInitRes.status === "fulfilled",
    clearedAt: new Date().toISOString(),
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const redirectTo = searchParams.get("redirect");
    const mode = searchParams.get("mode");

    if (mode === "status") {
      const items = await getAllCachedItems();
      return NextResponse.json({
        success: true,
        count: items.length,
        items,
        timestamp: new Date().toISOString(),
      });
    }

    const result = await handleClearAllCache();

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.json({
      success: true,
      message: "Successfully cleared all server, dynamic, menu, and storeInit caches recursively",
      details: result,
    });
  } catch (err) {
    console.error("❌ API clear-cache GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clear cache", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const result = await handleClearAllCache();
    return NextResponse.json({
      success: true,
      message: "Successfully cleared all server, dynamic, menu, and storeInit caches recursively",
      details: result,
    });
  } catch (err) {
    console.error("❌ API clear-cache POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clear cache", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const result = await handleClearAllCache();
    return NextResponse.json({
      success: true,
      message: "Successfully deleted all cache entries",
      details: result,
    });
  } catch (err) {
    console.error("❌ API clear-cache DELETE error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete cache", details: err.message },
      { status: 500 }
    );
  }
}
