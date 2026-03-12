"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginWithEmailAPI } from "../utils/API/Auth/LoginWithEmailAPI";
import { useStore } from "./StoreProvider";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { WebLoginWithMobileToken } from "../utils/API/Auth/WebLoginWithMobileToken";


const restrictedPaths = [
  "/LoginOption",
  "/ContinueWithEmail",
  "/ContinueWithMobile",
  "/LoginWithEmailCode",
  "/LoginWithMobileCode",
  "/forgotPass",
  "/ForgotPass",
  "/LoginWithEmail",
  "/register",
];

const publicPages = [
  "/",
  "/LoginOption",
  "/forgotPass",
  "/privacyPolicy",
  "/aboutUs",
  "/contactUs",
  "/appointment",
  "/bespoke-jewelry",
  "/refund-policy",
  "/shipping-policy",
  "/terms-and-conditions",
  "/debug-internal-config-manager-v2",
  "contactus", "aboutus", "privacypolicy", "servicepolicy", "expertadvice", "bespoke-jewelry", "appointment", "terms-and-conditions", "searchbystock", "funfact", "termspolicy", "natural-diamond"
];

const protectedPages = [
  "/account",
  "/delivery",
  "/payment",
  "/confirmation",
  "/accountdwsr",
  "account", "delivery", "payment", "confirmation"
];

const B2B_LoginRedirects = ["cartpage", "mywishlist", "custom-orders", "lookbook", "p/", "d/", "/menu"];


const AuthContext = createContext(null);

export function AuthProvider({ children, storeInit }) {
  const { islogin, setislogin } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const loginRedirect = searchParams.get("LoginRedirect") || searchParams.get("loginRedirect") || searchParams.get("search");
  const redirectEmailUrl =
    typeof loginRedirect === "string" && loginRedirect !== "null"
      ? decodeURIComponent(loginRedirect)
      : null;
  const [localData, setLocalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // WebLoginWithMobileToken
  useEffect(() => {
    const cookieValue = Cookies.get("userLoginCookie");
    if (storeInit?.domain !== "nxtmobileapp.web") {
      if (cookieValue && islogin === false) {
        LoginWithEmailAPI("", "", "", "", cookieValue)
          .then((response) => {
            if (response?.Data?.rd[0]?.stat === 1) {
              Cookies.set("userLoginCookie", response?.Data?.rd[0]?.Token);
              setislogin(true);
              sessionStorage.setItem("LoginUser", true);
              sessionStorage.setItem("loginUserDetail", JSON.stringify(response.Data.rd[0]));
              if (redirectEmailUrl) {
                router.push(redirectEmailUrl);

              } else if (pathname.startsWith("/accountdwsr")) {
                router.push("/accountdwsr");
              } else if (pathname === sessionStorage.getItem("previousUrl")) {
                router.push(sessionStorage.getItem("previousUrl"));
              }

              else {

              }
            }
          })
          .catch((err) => console.log(err));
      }
    }
    setLocalData(storeInit);
  }, [islogin, redirectEmailUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [islogin]);


  useEffect(() => {
    if (isLoading) return;

    const currentSearch = searchParams.toString();
    const fullPath = `${pathname}${currentSearch ? `?${currentSearch}` : ""}`;

    const pathSegments = pathname?.split("/") || [];
    const kSegment = pathSegments.find(s => s.includes("K="));
    const pathKey = kSegment?.split("?")[0]?.split("K=")[1];
    let albumSecurityId = null;
    let decodeError = false;

    try {
      if (pathKey) {
        albumSecurityId = atob(decodeURIComponent(pathKey));
      } else if (searchParams.get("SK")) {
        albumSecurityId = searchParams.get("SK");
      } else if (searchParams.get("SecurityKey")) {
        albumSecurityId = searchParams.get("SecurityKey");
      }
    } catch (e) {
      console.warn("Invalid base64 securityKey:", e);
      decodeError = true;
    }

    if (pathname === "/p" || pathname.startsWith("/p/")) {
      if (islogin !== true) {
        if (decodeError || (albumSecurityId !== null && albumSecurityId > 0)) {
          const redirectUrl = `/LoginOption?LoginRedirect=${encodeURIComponent(fullPath)}`;
          router.replace(redirectUrl);
          return;
        }
      }
    }



    if (islogin === false) {
      const isProtectedPage = protectedPages.some(page => pathname === page || pathname.startsWith(page + "/"));
      if (isProtectedPage) {
        const redirectUrl = `/LoginOption?LoginRedirect=${encodeURIComponent(fullPath)}`;
        router.replace(redirectUrl);
        return;
      }
    }


    if (storeInit?.IsB2BWebsite === 1) {
      if (islogin === false) {
        const isShopPage =
          pathname === "/p" ||
          pathname.startsWith("/p/") ||
          pathname === "/d" ||
          pathname.startsWith("/d/") ||
          pathname === "/cartPage" ||
          pathname.startsWith("/cartPage/");
        const isPublicPage = publicPages.some((page) => pathname === page || pathname.startsWith(page + "/"));
        if (isShopPage) {
          const redirectUrl = `/LoginOption?LoginRedirect=${encodeURIComponent(fullPath)}`;
          router.replace(redirectUrl);
          return;
        } else if (!isPublicPage) {
          router.replace("/");
          return;
        }
      }
    }
  }, [isLoading, islogin, pathname, searchParams, storeInit, router]);


  useEffect(() => {
    // Prevent access to login/register pages in mobile app domain
    const isMobileApp = storeInit?.domain === "nxtmobileapp.web";
    if (isMobileApp) {
      if (restrictedPaths?.some((path) => pathname.startsWith(path))) {
        router.replace("/");
        return;
      }
    }

    if (islogin === true && !isLoading) {
      if (restrictedPaths?.some((path) => pathname.startsWith(path))) {
        if (redirectEmailUrl) {
          router.push(redirectEmailUrl);
        } else {
          router.push("/");
        }
      }
    }
  }, [islogin, isLoading, pathname, redirectEmailUrl, router, storeInit?.domain]);


  if (isLoading) {
    return <div></div>;
  }

  if (islogin !== true) {
    const pathSegments = pathname?.split("/") || [];
    const kSegment = pathSegments.find(s => s.includes("K="));
    const pathKey = kSegment?.split("?")[0]?.split("K=")[1];
    let albumSecurityId = null;
    let decodeError = false;
    try {
      if (pathKey) {
        albumSecurityId = atob(decodeURIComponent(pathKey));
      } else if (searchParams.get("SK")) {
        albumSecurityId = searchParams.get("SK");
      } else if (searchParams.get("SecurityKey")) {
        albumSecurityId = searchParams.get("SecurityKey");
      }
    } catch (e) {
      decodeError = true;
    }

    if (pathname === "/p" || pathname.startsWith("/p/")) {
      if (decodeError || (albumSecurityId !== null && albumSecurityId > 0)) {
        return <div></div>;
      }
    }

    if (storeInit?.IsB2BWebsite === 1) {
      if (pathname === "/p" || pathname.startsWith("/p/") ||
        pathname === "/d" || pathname.startsWith("/d/") ||
        pathname === "/cartPage" || pathname.startsWith("/cartPage/")) {
        return <div></div>;
      }
    }
  }

  // if (islogin === true) {
  //   if (restrictedPaths?.some((path) => pathname.startsWith(path))) {
  //     router.push("/");
  //     return <div></div>;
  //   }
  // }

  const value = {
    localData,
    setLocalData
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
