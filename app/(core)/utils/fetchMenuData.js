import { getSqliteMenus } from "./sqlite/sqliteActions.js";
import { getDomainInfo } from "./getDomainInfo.js";
import { getSession } from "./FetchSessionData.js";
import { NEXT_APP_WEB } from "./env.js";

/**
 * Ultra-fast local Menu data loader from SQLite with Package & Subpackage filtering.
 * Uses Next.js Server Actions to safely bridge server & client with sub-millisecond execution.
 * 
 * Auto-detects:
 * 1. Logged-in user package & ID (from session 'loginUserDetail')
 * 2. Store-level package (from session 'storeInit' or SQLite storeinit)
 * 3. Subpackage hierarchy from packagemaster (e.g. western -> 10 + 2, 1)
 * 
 * @param {object} [options={}] - { customDomain, levelid, menuid, packageId, packageName, customerId }
 * @returns {Promise<object>} Complete menu payload { Status, Message, Data: { rd: [...] } }
 */
export async function fetchMenuData(options = {}) {
  try {
    let hostname = options.customDomain || options.domain;

    if (!hostname) {
      try {
        const domainInfo = await getDomainInfo();
        hostname = domainInfo?.hostname || "";
      } catch {
        hostname = "";
      }
    }

    if ((!hostname || hostname === "") && typeof window !== "undefined") {
      const { hostname: winHost } = window.location;
      hostname = winHost.replace(/^www\./, "");
    }

    const cleanHost = hostname ? hostname.split(":")[0].trim() : "";
    const isLocalhost =
      !cleanHost ||
      cleanHost === "localhost" ||
      cleanHost === "127.0.0.1" ||
      cleanHost.endsWith(".localhost") ||
      cleanHost.endsWith(".ngrok-free.app") ||
      cleanHost.endsWith(".ngrok.io");

    const targetDomain = isLocalhost ? (NEXT_APP_WEB || "") : cleanHost;

    if (!targetDomain) {
      return {
        Status: "400",
        Message: "Domain is required and could not be determined.",
        Data: { rd: [] },
      };
    }

    // 1. Resolve Package ID & Name
    let packageId = options.packageId ?? options.PackageId;
    let packageName = options.packageName ?? options.PackageName;
    let customerId = options.customerId ?? options.CustomerId;

    if (typeof window !== "undefined") {
      const isLogin = getSession("LoginUser") ?? false;
      const userDetail = getSession("loginUserDetail");
      const storeInit = getSession("storeInit") || window.__STORE_INIT__;

      if (isLogin && userDetail) {
        packageId = userDetail.PackageId ?? userDetail.packageId ?? packageId;
        packageName = userDetail.PackageName ?? userDetail.packageName ?? packageName;
        customerId = userDetail.id ?? userDetail.CustomerId ?? customerId;
      } else if (storeInit) {
        packageId = packageId ?? storeInit.PackageId;
        packageName = packageName ?? storeInit.PackageName;
      }
    }

    // 2. Fetch from SQLite via Server Action
    const menuResp = await getSqliteMenus(
      {
        packageId,
        packageName,
        customerId,
        levelid: options.levelid,
        menuid: options.menuid,
      },
      targetDomain
    );

    return menuResp;
  } catch (error) {
    console.error("[fetchMenuData] Error:", error);
    return {
      Status: "500",
      Message: error.message,
      Data: { rd: [] },
    };
  }
}

export default fetchMenuData;
