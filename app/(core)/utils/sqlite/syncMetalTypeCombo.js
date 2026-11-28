import { getTenantDb } from "@/db/tenantManager.js";
import { saveMetalTypeMaster } from "@/db/procedures/saveMetalTypeMaster.js";
import { logger } from "@/db/logger.js";

/**
 * Fetches the METALTYPECOMBO master from the ERP and stores it in SQLite.
 * Called right after the metal density sync so both masters are saved together.
 * Never throws: failures are returned so the caller's own result is unaffected.
 */
export async function syncMetalTypeCombo(domain, storeInit) {
  const db = getTenantDb(domain);
  if (!db || !storeInit?.ApiUrl) {
    return { success: false, error: !db ? "Tenant database is unavailable." : "ApiUrl is missing from storeInit." };
  }

  const apiUrl = storeInit.ApiUrl;
  const endpoint = apiUrl.endsWith("/api/report") ? apiUrl : `${apiUrl.replace(/\/+$/, "")}/api/report`;
  const headers = {
    "Content-Type": "application/json",
    ...(storeInit.token ? { Authorization: `Bearer ${storeInit.token}` } : {}),
    ...(storeInit.YearCode ? { Yearcode: storeInit.YearCode } : {}),
    ...(storeInit.version ? { Version: storeInit.version } : {}),
    sp: "54",
    ...((storeInit.sv ?? storeInit.Sv) != null ? { sv: String(storeInit.sv ?? storeInit.Sv) } : {}),
  };
  const combinedValue = JSON.stringify({ FrontEnd_RegNo: `${storeInit.FrontEnd_RegNo ?? ""}`, Customerid: "0" });
  const requestBody = {
    con: JSON.stringify({ id: "", mode: "METALTYPECOMBO", appuserid: "" }),
    f: "Account (changePassword)",
    p: combinedValue,
  };

  try {
    const response = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(requestBody) });
    const payload = await response.json();
    if (!response.ok || (payload?.Status && payload.Status !== "200")) {
      throw new Error(payload?.Message || `ERP returned HTTP ${response.status}`);
    }
    const result = saveMetalTypeMaster(db, payload);
    logger.info("METAL_TYPE_COMBO_SYNC", `Saved ${result.savedCount} metal type master rows for '${domain}'`);
    return { success: true, ...result };
  } catch (error) {
    logger.error("METAL_TYPE_COMBO_SYNC", `Metal type combo sync failed for '${domain}': ${error.message}`);
    return { success: false, error: error.message };
  }
}
