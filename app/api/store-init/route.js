// app/api/store-init/route.ts

import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

export async function GET(req) {
  try {
    const host = req.headers.get("host") || "";
    const storeName = NEXT_APP_WEB; // or map using host if needed
    const data = await fetchStoreInitData(storeName);
    const storeInit = data?.rd?.[0] || {};
    return NextResponse.json(storeInit, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch storeInit" },
      { status: 500 },
    );
  }
}
