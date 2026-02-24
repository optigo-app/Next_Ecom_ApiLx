import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

const domainMap = {
  localhost: NEXT_APP_WEB,
};

const authPages = ["loginoption", "continuewithemail", "loginwithemail", "register", "continuewithmobile", "loginwithemailcode", "loginwithmobilecode", "forgotPass"];

const B2B_LoginRedirects = ["cartpage", "mywishlist", "custom-orders", "lookbook", "p/", "d/"];

const B2B_HomeRedirects = ["account", "delivery", "payment", "confirmation"];

const WhiteList = ["contactus", "aboutus", "privacypolicy", "servicepolicy", "expertadvice", "bespoke-jewelry", "appointment", "terms-and-conditions", "searchbystock", "funfact", "termspolicy", "natural-diamond"];

export default async function middleware(req) {
  try {
    const { cookies, nextUrl } = req;
    const host = req.headers.get("host");

    const loginUser = cookies.get("LoginUser")?.value;
    const userLoginCookie = cookies.get("userLoginCookie")?.value;

    const Next_URL = new URL(req.url);
    const pathname = nextUrl.pathname.replace(/^\/+/, "").toLowerCase();

    // 1. Fetch Store Data (with caching)
    const storeName = domainMap[host] || NEXT_APP_WEB;
    let storeData = {};

    try {
      storeData = await fetchStoreInitData(storeName);
    } catch {
      storeData = { rd: [{}], rd1: [], rd2: [{}] };
    }

    const IsB2BWebsite = storeData?.rd?.[0]?.IsB2BWebsite;

    const isAuthenticated = !!loginUser && !!userLoginCookie;

    // 2. Prepare Response with Cookies (Always set these as before)
    const response = NextResponse.next();
    response.cookies.set("x-store-data", JSON.stringify(storeData?.rd?.[0] || {}), { httpOnly: false, path: "/" });
    response.cookies.set("x-myAccountFlags-data", JSON.stringify(storeData?.rd1 || []), { httpOnly: false, path: "/" });
    response.cookies.set("x-CompanyInfoData-data", JSON.stringify(storeData?.rd2?.[0] || {}), { httpOnly: false, path: "/" });
    response.headers.set("Cache-Control", "public, max-age=0, immutable");

    // 3. Routing Logic
    if (pathname === "" || WhiteList.some((page) => pathname === page.toLowerCase())) {
      return response;
    }

    // B. Check Auth Pages
    const isAuthPage = authPages.some((page) => pathname === page.toLowerCase());
    if (isAuthPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return response;
    }

    // C. B2B vs B2C Logic
    if (IsB2BWebsite !== 0) {
      // B2B Flow
      const shouldLoginRedirect = B2B_LoginRedirects.some((page) => {
        if (page.endsWith("/")) return pathname.startsWith(page);
        return pathname === page;
      });

      const shouldHomeRedirect = B2B_HomeRedirects.some((page) => pathname === page);

      if (!isAuthenticated) {
        if (shouldLoginRedirect) {
          return NextResponse.redirect(new URL(`/LoginOption?LoginRedirect=${encodeURIComponent(Next_URL.pathname + Next_URL.search)}`, req.url));
        }
        if (shouldHomeRedirect) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } else {
      // B2C Flow
      const isRestrictedB2C = B2B_HomeRedirects.some((page) => pathname === page);
      if (!isAuthenticated && isRestrictedB2C) {
        return NextResponse.redirect(new URL(`/LoginOption?LoginRedirect=${encodeURIComponent(Next_URL.pathname + Next_URL.search)}`, req.url));
      }
    }

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
