import { getSqliteWebsiteColorConfig } from "./sqlite/sqliteActions.js";
import { getDomainInfo } from "./getDomainInfo.js";
import { NEXT_APP_WEB } from "./env.js";
import { normalizeWebThemeColor } from "../hooks/webThemeColor/normalizeWebThemeColor.js";

/**
 * Ultra-fast local Website Color data loader from SQLite & disk JSON cache.
 * Uses Next.js Server Action getSqliteWebsiteColorConfig to safely bridge server & client.
 *
 * @param {string} [customDomain=""] - Optional explicit domain override
 * @returns {Promise<{
 *   success: boolean,
 *   domain: string,
 *   data: object|null,
 *   normalized: object,
 *   error?: string
 * }>}
 */
export async function fetchWebsiteColorData(customDomain = "") {
  try {
    let hostname = customDomain;

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
        success: false,
        domain: "default",
        data: null,
        normalized: normalizeWebThemeColor({}),
        error: "Domain is required and could not be determined.",
      };
    }

    const resp = await getSqliteWebsiteColorConfig({ domain: targetDomain });

    return {
      success: resp?.success || false,
      domain: targetDomain,
      data: resp?.data || null,
      normalized: normalizeWebThemeColor(resp?.data || {}),
      error: resp?.error,
    };
  } catch (err) {
    return {
      success: false,
      domain: customDomain || "unknown",
      data: null,
      normalized: normalizeWebThemeColor({}),
      error: err.message,
    };
  }
}

export default fetchWebsiteColorData;
