import Cookies from "js-cookie";

/**
 * Validates whether a given visitor ID is valid (non-empty, not "undefined", not "null", not "0").
 */
export function isValidVisitorId(val) {
  if (val == null) return false;
  const s = String(val).trim();
  return s !== "" && s !== "undefined" && s !== "null" && s !== "0";
}

/**
 * Returns a valid visitor ID string.
 * If a valid cookie exists, returns it.
 * Otherwise, uses a valid hint (e.g. from storeInit rd2 VisitorId) or generates a new 9-digit ID,
 * stores it in cookies, and returns it.
 * Also removes any corrupted "undefined" or "null" cookies immediately.
 */
export function getOrCreateVisitorId(existingHint = null) {
  if (typeof window === "undefined") {
    if (isValidVisitorId(existingHint)) {
      return String(existingHint);
    }
    return "";
  }

  let cookieVal = Cookies.get("visiterId");

  // Clean up corrupted cookie if present
  if (cookieVal === "undefined" || cookieVal === "null" || cookieVal === "") {
    try {
      Cookies.remove("visiterId", { path: "/" });
    } catch { }
    cookieVal = null;
  }

  if (isValidVisitorId(cookieVal)) {
    return String(cookieVal);
  }

  // Use hint if valid
  if (isValidVisitorId(existingHint)) {
    const hintStr = String(existingHint);
    try {
      Cookies.set("visiterId", hintStr, { path: "/", expires: 30 });
    } catch { }
    return hintStr;
  }

  // Check sessionStorage CompanyInfoData (matching ecomm_web_performance ThemeRoutes.js)
  try {
    const sessionData = sessionStorage.getItem("CompanyInfoData");
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      if (isValidVisitorId(parsed?.VisitorId)) {
        const vid = String(parsed.VisitorId);
        Cookies.set("visiterId", vid, { path: "/", expires: 30 });
        return vid;
      }
    }
  } catch { }

  // Fallback if storeInit rd2 is in window or session
  try {
    const storeInitStr = sessionStorage.getItem("storeInit");
    if (storeInitStr) {
      const parsedInit = JSON.parse(storeInitStr);
      if (isValidVisitorId(parsedInit?.VisitorId)) {
        const vid = String(parsedInit.VisitorId);
        Cookies.set("visiterId", vid, { path: "/", expires: 30 });
        return vid;
      }
    }
  } catch { }

  // Generate a fresh 9-digit numeric visitor ID (100000000 - 999999999) only as last resort
  const newId = String(Math.floor(100000000 + Math.random() * 900000000));
  try {
    Cookies.set("visiterId", newId, { path: "/", expires: 30 });
  } catch { }
  return newId;
}
