import { getTenantDb } from "@/db/tenantManager";
import { saveStoreInit } from "@/db/procedures/saveStoreInit";
import { logger } from "@/db/logger";

/**
 * Fetches store_init configuration from an external API and saves it directly to SQLite.
 */
export async function syncStoreInit({ apiurl, domain, version, sv }) {
  const startTime = Date.now();
  try {
    if (!apiurl || !domain || !version || sv === undefined || sv === null) {
      return { 
        success: false, 
        error: "Missing required parameters: apiurl, domain, version, or sv." 
      };
    }

    // Prepare exact headers requested
    const headers = {
      "Content-Type": "application/json",
      "domain": domain,
      "version": version,
      "sp": "54", // Fixed value
      "sv": String(sv), // 0 for dev, 1 for prod
    };

    // Fixed lightweight request body
    const requestBody = {
      con: '{"id":"","mode":"store_init"}',
      p: "",
      dp: '{"id":"","mode":"store_init"}',
      f: "formname (init)",
    };

    logger.info("STORE_INIT_SYNC", `Starting StoreInit sync for domain '${domain}' from '${apiurl}'`);

    const response = await fetch(apiurl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`External API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Standard API response validation
    if (!data || (data.Status !== "200" && !data.Data)) {
      throw new Error(`Invalid response format from external API: ${JSON.stringify(data).substring(0, 100)}`);
    }

    // Persist to SQLite
    const db = getTenantDb(domain);
    const result = saveStoreInit(db, data);

    const elapsedMs = Date.now() - startTime;
    logger.info("STORE_INIT_SYNC", `Successfully synced StoreInit for '${domain}' in ${elapsedMs}ms`, { counts: result.count });

    return {
      success: true,
      domain,
      counts: result.count,
      elapsedMs,
    };
  } catch (error) {
    logger.error("STORE_INIT_SYNC", `Sync failed for domain '${domain}': ${error.message}`, { error: error.stack });
    return {
      success: false,
      error: error.message,
    };
  }
}
