import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";

export async function GET(req) {
  try {
    const cookieValue = req.cookies.get("x-store-data")?.value;
    let storeInit = null;

    if (cookieValue) {
      try {
        storeInit = JSON.parse(cookieValue);
      } catch {
        storeInit = null;
      }
    }

    if (!storeInit || Object.keys(storeInit).length === 0) {
      const data = await fetchStoreInitData();
      storeInit = data?.rd?.[0] || {};
    }

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
