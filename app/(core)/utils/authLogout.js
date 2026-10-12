import Cookies from "js-cookie";
import { clearPolicyCookies } from "./product/pricingPolicy.js";

/**
 * Robustly removes a cookie across all possible paths and domain scopes.
 * Solves silent removal failures caused by mismatched path or domain attributes.
 */
export function removeCookieThoroughly(name) {
  if (typeof document === "undefined") return;

  // 1. js-cookie removals across default, root, and current path
  try {
    Cookies.remove(name, { path: "/" });
    Cookies.remove(name, { path: "" });
    Cookies.remove(name);
  } catch (_) {}

  // 2. Direct document.cookie expiration across possible paths and domains
  try {
    const hostname = window.location.hostname;
    const paths = ["/", window.location.pathname, ""];
    const domains = [undefined, hostname, `.${hostname}`];

    const parts = hostname.split(".");
    if (parts.length > 2) {
      const parentDomain = parts.slice(-2).join(".");
      domains.push(parentDomain, `.${parentDomain}`);
    }

    paths.forEach((p) => {
      domains.forEach((d) => {
        let cookieStr = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;
        if (p) cookieStr += `; path=${p}`;
        if (d) cookieStr += `; domain=${d}`;
        document.cookie = cookieStr;
      });
    });
  } catch (err) {
    console.warn("removeCookieThoroughly error:", err);
  }
}

export const AUTH_COOKIE_KEYS = [
  "userLoginCookie",
  "LoginUser",
  "userPackageId",
  "loginUserDetail",
  "isUserLoggedIn",
  "pricing_table_name",
  "policy_table",
  "token",
];

export const AUTH_LOCAL_STORAGE_KEYS = [
  "loginUserDetail",
  "LoginUser",
  "AuthToken",
  "token",
  "pricing_table_name",
  "policy_table",
  "userPackageId",
  "userLoginCookie",
];

/**
 * Unified, complete logout function for all themes and components.
 * Completely purges cookies, localStorage, sessionStorage, globals, and resets policy.
 */
export function logoutUser(options = {}) {
  const {
    redirectUrl = "/",
    setislogin,
    setLoginUserDetail,
    clearAllCacheData,
    storeInit = null,
  } = options;

  if (typeof window === "undefined") return;

  // 1. Reset React State immediately if setters provided
  if (typeof setislogin === "function") {
    try {
      setislogin(false);
    } catch (_) {}
  }
  if (typeof setLoginUserDetail === "function") {
    try {
      setLoginUserDetail(null);
    } catch (_) {}
  }
  if (typeof clearAllCacheData === "function") {
    try {
      clearAllCacheData();
    } catch (_) {}
  }

  // 2. Thoroughly purge all auth-related cookies
  AUTH_COOKIE_KEYS.forEach((cookieName) => {
    removeCookieThoroughly(cookieName);
  });

  // 3. Clear localStorage items
  AUTH_LOCAL_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  });

  // 4. Clear sessionStorage entirely
  try {
    sessionStorage.clear();
  } catch (_) {}

  // 5. Reset Window Globals
  window.__LOGIN_USER_DETAIL__ = null;
  window.__LOGIN_USER__ = false;

  // 6. Reset pricing policy table to guest defaults
  try {
    clearPolicyCookies(storeInit || window.__STORE_INIT__);
  } catch (_) {}

  // 7. Full page redirection to enforce fresh SSR and flush memory
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
}
