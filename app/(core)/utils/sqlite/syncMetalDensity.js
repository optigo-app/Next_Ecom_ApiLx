import { getTenantDb } from "@/db/tenantManager.js";
import { saveMetalDensity } from "@/db/procedures/saveMetalDensity.js";
import { logger } from "@/db/logger.js";

export async function syncMetalDensity(domain, storeInit) {
  const db = getTenantDb(domain);
  if (!db || !storeInit?.ApiUrl) {
    return { success: false, error: !db ? "Tenant database is unavailable." : "ApiUrl is missing from storeInit." };
  }

  const apiUrl = storeInit.ApiUrl;
  const endpoint = apiUrl.endsWith("/api/report")
    ? apiUrl
    : `${apiUrl.replace(/\/+$/, "")}/api/report`;
  const headers = {
    "Content-Type": "application/json",
    ...(storeInit.token ? { Authorization: `Bearer ${storeInit.token}` } : {}),
    ...(storeInit.YearCode ? { Yearcode: storeInit.YearCode } : {}),
    ...(storeInit.version ? { Version: storeInit.version } : {}),
    sp: "54",
    ...((storeInit.sv ?? storeInit.Sv) != null ? { sv: String(storeInit.sv ?? storeInit.Sv) } : {}),
  };
  const requestBody = {
    con: JSON.stringify({ id: "", mode: "METALDENSITY", appuserid: "" }),
    f: "METALDENSITY (UpdateQuantity)",
    p: "",
  };

  try {
    const response = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(requestBody) });
    const payload = await response.json();
    if (!response.ok || (payload?.Status && payload.Status !== "200")) {
      throw new Error(payload?.Message || `ERP returned HTTP ${response.status}`);
    }
    const result = saveMetalDensity(db, payload);
    logger.info("METAL_DENSITY_SYNC", `Saved ${result.savedCount} metal density rows for '${domain}'`);
    return { success: true, ...result };
  } catch (error) {
    logger.error("METAL_DENSITY_SYNC", `Metal density sync failed for '${domain}': ${error.message}`);
    return { success: false, error: error.message };
  }
}
