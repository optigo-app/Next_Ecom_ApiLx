import { NextResponse } from "next/server";
import { clearAllCache as clearAllServerCache } from "@/app/(core)/cache_utility/serverCache";
import { clearAllCache as clearAllDynamicCache } from "@/app/(core)/cache_utility/dynamic_serverCache";

async function handleClearCache() {
  // Clear both server cache and dynamic server cache (they both resolve to .next_cache)
  await clearAllServerCache();
  await clearAllDynamicCache();
}

export async function GET(req) {
  try {
    await handleClearCache();
    return NextResponse.json({
      success: true,
      message: "Successfully cleared all .next_cache files and subdirectories recursively",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ API Cache clear GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clear cache recursively", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await handleClearCache();
    return NextResponse.json({
      success: true,
      message: "Successfully cleared all .next_cache files and subdirectories recursively",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ API Cache clear POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clear cache recursively", details: err.message },
      { status: 500 }
    );
  }
}
