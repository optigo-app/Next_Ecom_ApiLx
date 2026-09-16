import { getSession } from "../FetchSessionData.js";

import Cookies from "js-cookie";

export const DESIGN_TABLE_PREFIX = "design_Productlist_";

/**
 * Generates the standardized dynamic table name from policy configuration parameters.
 */
export function getDynamicDesignTableName(config = {}, prefix = DESIGN_TABLE_PREFIX) {
  const labour = String(config.Laboursetid ?? config.laboursetid ?? config.pricemanagement_laboursetid ?? "0").trim().replace(/[^a-zA-Z0-9_]/g, "_") || "0";
  const dia = String(config.diamondpricelistName ?? config.diamondpricelistname ?? config.Diamondpricelistname ?? "default").trim().replace(/[^a-zA-Z0-9_]/g, "_") || "default";
  const cs = String(config.colorstonepricelistName ?? config.colorstonepricelistname ?? config.Colorstonepricelistname ?? "default").trim().replace(/[^a-zA-Z0-9_]/g, "_") || "default";
  const setting = String(config.SettingPriceUniqueNo ?? config.settingpriceuniqueno ?? "0").trim().replace(/[^a-zA-Z0-9_]/g, "_") || "0";

  return `${prefix}${labour}_${dia}_${cs}_${setting}`;
}

/**
 * Cookie keys for direct zero-latency access
 */
export const POLICY_TABLE_COOKIE = "pricing_table_name";
export const POLICY_TABLE_ALIAS = "policy_table";
export const LOGIN_USER_COOKIE = "loginUserDetail";

/**
 * Cleanly removes all authentication and policy table cookies upon logout.
 * If storeInit is provided, immediately resets pricing_table_name to the guest table.
 */
export function clearPolicyCookies(storeInit = null) {
  if (typeof window === "undefined") return;
  try {
    Cookies.remove(LOGIN_USER_COOKIE, { path: "/" });
    Cookies.remove("LoginUser", { path: "/" });
    Cookies.remove("userLoginCookie", { path: "/" });
    Cookies.remove("userPackageId", { path: "/" });

    try {
      localStorage.removeItem(LOGIN_USER_COOKIE);
      localStorage.removeItem("LoginUser");
    } catch (_) {}

    const guestInit = storeInit || getSession("storeInit");
    if (guestInit && typeof guestInit === "object") {
      const guestTable = getDynamicDesignTableName(guestInit);
      Cookies.set(POLICY_TABLE_COOKIE, guestTable, { path: "/", expires: 7 });
      Cookies.set(POLICY_TABLE_ALIAS, guestTable, { path: "/", expires: 7 });
      try {
        localStorage.setItem(POLICY_TABLE_COOKIE, guestTable);
      } catch (_) {}
    } else {
      Cookies.remove(POLICY_TABLE_COOKIE, { path: "/" });
      Cookies.remove(POLICY_TABLE_ALIAS, { path: "/" });
      try {
        localStorage.removeItem(POLICY_TABLE_COOKIE);
      } catch (_) {}
    }
  } catch (err) {
    console.warn("clearPolicyCookies error:", err);
  }
}

/**
 * Syncs the active policy table name and loginUserDetail directly into cookies
 * so Server-Side Rendering (SSR) and Server Actions resolve in <0.1ms with zero latency.
 */
export function syncUserDetailToCookies(userDetail, storeInit = null) {
  if (typeof window === "undefined") return;

  if (!userDetail || typeof userDetail !== "object") {
    clearPolicyCookies(storeInit);
    return;
  }

  const compact = {
    id: userDetail.id || userDetail.userid || 0,
    pricemanagement_laboursetid: userDetail.pricemanagement_laboursetid || userDetail.Laboursetid || 0,
    diamondpricelistname: userDetail.diamondpricelistname || userDetail.diamondpricelistName || "",
    colorstonepricelistname: userDetail.colorstonepricelistname || userDetail.colorstonepricelistName || "",
    SettingPriceUniqueNo: userDetail.SettingPriceUniqueNo || userDetail.settingpriceuniqueno || 0,
    PackageId: userDetail.PackageId || userDetail.packageId || null,
    MetalId: userDetail.MetalId || null,
    cmboDiaQCid: userDetail.cmboDiaQCid || "",
    cmboCSQCid: userDetail.cmboCSQCid || "",
  };

  try {
    // 1. Direct Table Name in Cookie for instant server-side lookup
    const tableName = getDynamicDesignTableName(compact);
    Cookies.set(POLICY_TABLE_COOKIE, tableName, { path: "/", expires: 7 });
    Cookies.set(POLICY_TABLE_ALIAS, tableName, { path: "/", expires: 7 });

    // 2. Compact User Detail in Cookie
    Cookies.set(LOGIN_USER_COOKIE, encodeURIComponent(JSON.stringify(compact)), { path: "/", expires: 7 });
    Cookies.set("LoginUser", "true", { path: "/", expires: 7 });

    if (compact.PackageId) {
      Cookies.set("userPackageId", String(compact.PackageId), { path: "/", expires: 7 });
    }

    // 3. LocalStorage backups for multi-tab sync
    localStorage.setItem(POLICY_TABLE_COOKIE, tableName);
    localStorage.setItem(LOGIN_USER_COOKIE, JSON.stringify(userDetail));
    localStorage.setItem("LoginUser", "true");
  } catch (err) {
    console.warn("syncUserDetailToCookies error:", err);
  }
}

/**
 * Extracts a non-empty string or number value from an object checking candidate keys in order.
 *
 * @param {object} obj
 * @param  {...string} keys
 * @returns {any}
 */
function getFirstVal(obj, ...keys) {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    const val = obj[k];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return val;
    }
  }
  return undefined;
}

/**
 * Resolves the active pricing policy parameters based on user login state.
 *
 * Rules:
 * - Not logged in (Guest):
 *   Uses values from storeinit (with session fallback `getSession("storeInit")`):
 *     - Laboursetid: storeinit.pricemanagement_laboursetid (or Laboursetid)
 *     - diamondpricelistName: storeinit.diamondpricelistname (or diamondpricelistName)
 *     - colorstonepricelistName: storeinit.colorstonepricelistname (or colorstonepricelistName)
 *     - SettingPriceUniqueNo: storeinit.SettingPriceUniqueNo (or settingpriceuniqueno)
 *     - FrontEnd_RegNo: storeinit.FrontEnd_RegNo
 *
 * - Logged in:
 *   Uses values from loginUserDetail (with session fallback `getSession("loginUserDetail")`):
 *     - Laboursetid: loginUserDetail.pricemanagement_laboursetid (or Laboursetid)
 *     - diamondpricelistName: loginUserDetail.diamondpricelistname (or diamondpricelistName)
 *     - colorstonepricelistName: loginUserDetail.colorstonepricelistname (or colorstonepricelistName)
 *     - SettingPriceUniqueNo: loginUserDetail.SettingPriceUniqueNo (or settingpriceuniqueno)
 *     - FrontEnd_RegNo: storeinit.FrontEnd_RegNo
 *
 * If any individual parameter is absent in loginUserDetail, it gracefully falls back to storeinit.
 *
 * @param {object} [options={}]
 * @param {object} [options.storeinit]
 * @param {object} [options.loginUserDetail]
 * @param {boolean} [options.islogin]
 * @returns {object} Policy parameters object containing both standard and alias keys
 */
export function getPricingPolicyParams({ storeinit, loginUserDetail, islogin } = {}) {
  const isClient = typeof window !== "undefined";

  const activeStoreInit = storeinit || (isClient ? getSession("storeInit") : null) || {};
  const activeLoginUser = loginUserDetail || (isClient ? getSession("loginUserDetail") : null) || {};

  const sessionLogin = isClient ? (getSession("LoginUser") ?? false) : false;
  const userIsLoggedIn = Boolean(
    islogin === true ||
    sessionLogin === true ||
    sessionLogin === "true" ||
    (activeLoginUser && (activeLoginUser.id || activeLoginUser.userid || activeLoginUser.pricemanagement_laboursetid))
  );

  let labour;
  let dia;
  let cs;
  let setting;

  if (userIsLoggedIn) {
    labour =
      getFirstVal(activeLoginUser, "pricemanagement_laboursetid", "Laboursetid", "laboursetid") ??
      getFirstVal(activeStoreInit, "pricemanagement_laboursetid", "Laboursetid", "laboursetid") ??
      "";

    dia =
      getFirstVal(activeLoginUser, "diamondpricelistname", "diamondpricelistName", "Diamondpricelistname") ??
      getFirstVal(activeStoreInit, "diamondpricelistname", "diamondpricelistName", "Diamondpricelistname") ??
      "";

    cs =
      getFirstVal(activeLoginUser, "colorstonepricelistname", "colorstonepricelistName", "Colorstonepricelistname") ??
      getFirstVal(activeStoreInit, "colorstonepricelistname", "colorstonepricelistName", "Colorstonepricelistname") ??
      "";

    setting =
      getFirstVal(activeLoginUser, "SettingPriceUniqueNo", "settingpriceuniqueno", "SettingPriceUniqueNo") ??
      getFirstVal(activeStoreInit, "SettingPriceUniqueNo", "settingpriceuniqueno", "SettingPriceUniqueNo") ??
      "";
  } else {
    labour = getFirstVal(activeStoreInit, "pricemanagement_laboursetid", "Laboursetid", "laboursetid") ?? "";
    dia = getFirstVal(activeStoreInit, "diamondpricelistname", "diamondpricelistName", "Diamondpricelistname") ?? "";
    cs = getFirstVal(activeStoreInit, "colorstonepricelistname", "colorstonepricelistName", "Colorstonepricelistname") ?? "";
    setting = getFirstVal(activeStoreInit, "SettingPriceUniqueNo", "settingpriceuniqueno", "SettingPriceUniqueNo") ?? "";
  }

  const frontEndRegNo = getFirstVal(activeStoreInit, "FrontEnd_RegNo", "FrontEndRegNo", "frontend_regno") ?? "";

  const pkgId =
    getFirstVal(activeLoginUser, "PackageId", "packageId", "PackageID", "packageid") ??
    getFirstVal(activeStoreInit, "PackageId", "packageId", "PackageID", "packageid") ??
    undefined;

  return {
    isLoggedIn: userIsLoggedIn,
    Laboursetid: labour,
    laboursetid: labour,
    pricemanagement_laboursetid: labour,
    diamondpricelistName: dia,
    diamondpricelistname: dia,
    Diamondpricelistname: dia,
    colorstonepricelistName: cs,
    colorstonepricelistname: cs,
    Colorstonepricelistname: cs,
    SettingPriceUniqueNo: setting,
    settingpriceuniqueno: setting,
    FrontEnd_RegNo: frontEndRegNo,
    ...(pkgId != null ? { PackageId: pkgId, packageId: pkgId } : {}),
  };
}
