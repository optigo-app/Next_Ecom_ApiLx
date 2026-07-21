import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

const domainMap = {
  localhost: NEXT_APP_WEB,
};

export default async function middleware(req) {
  try {
    const { cookies, nextUrl } = req;
    const host = req.headers.get("host");

    const storeName = domainMap[host] || NEXT_APP_WEB;
    let storeData = {};
    try {
      storeData = await fetchStoreInitData(storeName);
    } catch {
      storeData = { rd: [{}], rd1: [], rd2: [{}] };
    }

    const response = NextResponse.next();
    response.cookies.set(
      "x-store-data",
      JSON.stringify(storeData?.rd?.[0] || {}),
      { httpOnly: false, path: "/" },
    );
    response.cookies.set(
      "x-myAccountFlags-data",
      JSON.stringify(storeData?.rd1 || []),
      { httpOnly: false, path: "/" },
    );
    response.cookies.set(
      "x-CompanyInfoData-data",
      JSON.stringify(storeData?.rd2?.[0] || {}),
      { httpOnly: false, path: "/" },
    );
    return response;
  } catch (err) {
    console.error("Middleware fatal error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
  runtime: "nodejs",
};
