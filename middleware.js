import { NextResponse } from "next/server";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";

const AUTH_ROUTE_MAP = {
  forgotpass: "/forgotpass",
  forgetpass: "/forgotpass",
  forgotpassword: "/forgotpass",
  forgetpassword: "/forgotpass",
  loginoption: "/LoginOption",
  continuewithemail: "/ContinueWithEmail",
  continuewithmobile: "/ContinueWithMobile",
  loginwithemail: "/LoginWithEmail",
  loginwithemailcode: "/LoginWithEmailCode",
  loginwithmobilecode: "/LoginWithMobileCode",
  register: "/register",
  signin: "/signin",
  logout: "/logout",
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  let rewrittenUrl = null;

  if (segments.length > 0) {
    const firstSegmentLower = segments[0].toLowerCase();
    const canonicalBase = AUTH_ROUTE_MAP[firstSegmentLower];
    if (canonicalBase) {
      const rest = segments.slice(1).join("/");
      const targetPath = rest ? `${canonicalBase}/${rest}` : canonicalBase;
      if (pathname !== targetPath) {
        rewrittenUrl = req.nextUrl.clone();
        rewrittenUrl.pathname = targetPath;
      }
    }
  }

  const isRsc = req.headers.get("rsc") === "1" || req.nextUrl.searchParams.has("_rsc") || req.headers.has("next-action");
  if (isRsc) {
    return rewrittenUrl ? NextResponse.rewrite(rewrittenUrl) : NextResponse.next();
  }

  const host = req.headers.get("host");

  const storeData = await getStoreInitData(host);

  const response = rewrittenUrl ? NextResponse.rewrite(rewrittenUrl) : NextResponse.next();

  // Ensure visiterId cookie is always valid (not missing, not "undefined", not "null")
  const currentVisitorId = req.cookies.get("visiterId")?.value;
  if (!currentVisitorId || currentVisitorId === "undefined" || currentVisitorId === "null" || currentVisitorId === "0") {
    const validId = String(storeData?.rd2?.[0]?.VisitorId || Math.floor(100000000 + Math.random() * 900000000));
    response.cookies.set("visiterId", validId, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|png|webp|svg|gif|ico|woff|woff2|ttf|mp4|webm)).*)",
  ],
  runtime: "nodejs",
};