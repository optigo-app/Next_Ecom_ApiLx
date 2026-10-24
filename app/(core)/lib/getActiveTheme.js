import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { headers } from "next/headers";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";

/**
 * Resolves active theme name/domain.
 * - Explicit localhost / dev loopback: returns NEXT_APP_WEB (from config/theme.config.js).
 * - Live production requests: returns storeInit domain or the live cleanHost itself.
 *   NEVER falls back to local NEXT_APP_WEB for live requests.
 */
export async function getActiveTheme() {
  let cleanHost = "";
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    cleanHost = host ? host.split(":")[0].trim().toLowerCase() : "";

    // 1. Explicit localhost / local dev check
    const isLocalhost =
      !cleanHost ||
      cleanHost === "localhost" ||
      cleanHost === "127.0.0.1" ||
      cleanHost.endsWith(".localhost") ||
      cleanHost.endsWith(".ngrok-free.app") ||
      cleanHost.endsWith(".ngrok.io");

    if (isLocalhost) {
      return NEXT_APP_WEB;
    }

    // 2. LIVE domain resolution:
    // Query storeInit by live host to get tenant's domain
    const storeData = await getStoreInitData(host);
    const domain = storeData?.rd?.[0]?.domain;

    // Use live storeInit domain if present, otherwise use the live cleanHost itself
    // Explicitly isolated: LIVE never falls back to local NEXT_APP_WEB
    return domain || cleanHost;
  } catch (e) {
    // If error occurs, only use NEXT_APP_WEB if there was no live host
    return cleanHost || NEXT_APP_WEB;
  }
}
