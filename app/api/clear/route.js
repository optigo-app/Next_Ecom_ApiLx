import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearAllCache as clearAllServerCache } from "@/app/(core)/cache_utility/serverCache";
import { clearAllCache as clearAllDynamicCache } from "@/app/(core)/cache_utility/dynamic_serverCache";
import { clearStoreInitCache } from "@/app/(core)/cache_utility/storeInitCache";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const redirectTo = searchParams.get("redirect") || "/";

    await Promise.allSettled([
      clearAllServerCache(),
      clearAllDynamicCache(),
      clearStoreInitCache(),
    ]);

    try {
      revalidatePath("/", "layout");
    } catch (_) {}

    return NextResponse.redirect(new URL(redirectTo, req.url));
  } catch (err) {
    console.error("❌ Cache clear error:", err);
    return NextResponse.json({ error: "Failed to clear cache", details: err.message }, { status: 500 });
  }
}
