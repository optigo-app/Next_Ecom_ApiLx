import { NextResponse } from "next/server";
import { getCache, setCache, getAllCachedItems, clearCache, clearAllCache } from "@/app/(core)/cache_utility/serverCache";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const mode = searchParams.get("mode"); // 'list' to get all

    // 1. Dashboard Mode: Get All Keys
    if (mode === "list") {
      const allItems = await getAllCachedItems();
      return NextResponse.json({ success: true, data: allItems });
    }

    // 2. Normal Mode: Get Single Key
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const cachedData = await getCache(key);
    if (!cachedData) {
      return NextResponse.json({ cached: false, data: null });
    }

    return NextResponse.json({ cached: true, data: cachedData });
  } catch (err) {
    console.error("❌ Cache GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { key, data, meta } = await req.json();

    if (!key || !data) {
      return NextResponse.json({ error: "Missing key or data" }, { status: 400 });
    }

    await setCache(key, data, meta);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Cache POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const mode = searchParams.get("mode"); // 'all'

    if (mode === "all") {
      await clearAllCache();
      return NextResponse.json({ success: true, message: "All cache cleared" });
    }

    if (!key) {
      return NextResponse.json({ error: "Missing key to delete" }, { status: 400 });
    }

    await clearCache(key);
    return NextResponse.json({ success: true, message: `Key ${key} cleared` });
  } catch (err) {
    console.error("❌ Cache DELETE error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { getCache, setCache } from "@/app/(core)/cache_utility/serverCache";

// export async function POST(req) {
//   try {
//     const { key, data ,meta } = await req.json();

//     if (!key || !data) {
//       return NextResponse.json({ error: "Missing key or data" }, { status: 400 });
//     }

//     await setCache(key, data ,meta);
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("❌ Album POST error:", err);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const key = searchParams.get("key");

//     if (!key) {
//       return NextResponse.json({ error: "Missing key" }, { status: 400 });
//     }

//     const cachedData = await getCache(key);
//     if (!cachedData) {
//       return NextResponse.json({ cached: false, data: null });
//     }

//     return NextResponse.json({ cached: true, data: cachedData });
//   } catch (err) {
//     console.error("❌ Album GET error:", err);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }
