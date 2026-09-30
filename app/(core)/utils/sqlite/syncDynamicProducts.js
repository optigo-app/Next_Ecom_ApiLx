import { getTenantDb } from "../../../../db/tenantManager.js";
import { batchInsertDesigns } from "../../../../db/procedures/batchInsertDesigns.js";
import {
  getDynamicDesignTableName,
  recordDynamicTableSync,
  ensureDynamicDesignTable,
  DESIGN_TABLE_PREFIX,
} from "../../../../db/schema/dynamicDesigns.js";
import { syncTableViaTemp } from "../../../../db/procedures/tempTableSync.js";
import { rebuildPolicyCategories } from "../../../../db/procedures/materializePolicyCategories.js";
import { logger } from "../../../../db/logger.js";

/**
 * Synchronizes products from the remote ERP API (GETPRODUCTFULLLIST) into dynamic
 * SQLite tables partitioned by pricing policy configuration.
 * 
 * Credentials (Yearcode, Version, token, sv, ApiUrl, FrontEnd_RegNo) are resolved
 * directly from the storeinit table of the target tenant database.
 * 
 * @param {object} options
 * @param {string} [options.domain] - Tenant domain (e.g., "beluxjewel.web")
 * @param {Array<object>} options.Config - List of policy configurations
 * @param {object} [options.storeInit] - Optional pre-loaded storeinit record
 * @returns {Promise<{ success: boolean, domain: string, syncedTables: Array<object>, error?: string }>}
 */
export async function syncDynamicPolicyProducts({ domain, Config, storeInit: inputStoreInit }) {
  try {
    let targetDomain = domain;
    if (!targetDomain) {
      try {
        const { getDomainInfo } = await import("../getDomainInfo.js");
        const domainInfo = await getDomainInfo().catch(() => ({}));
        targetDomain = domainInfo?.hostname || "default";
      } catch (_) {
        targetDomain = "default";
      }
    }
    targetDomain = String(targetDomain).trim().split(":")[0];

    const db = getTenantDb(targetDomain);

    // 1. Fetch storeinit from tenant DB if not fully provided
    let storeInit = inputStoreInit;
    if (!storeInit || !storeInit.token || !storeInit.YearCode) {
      try {
        storeInit = db.prepare("SELECT * FROM storeinit LIMIT 1").get();
      } catch (_) {}
    }

    if (!storeInit) {
      return {
        success: false,
        domain: targetDomain,
        syncedTables: [],
        error: "storeinit configuration not found in tenant database. Please initialize store first.",
      };
    }

    // 2. Resolve credentials & remote endpoint directly from storeinit
    const rawApiUrl = storeInit.ApiUrl;
    if (!rawApiUrl) {
      return {
        success: false,
        domain: targetDomain,
        syncedTables: [],
        error: "ApiUrl is missing in storeinit configuration.",
      };
    }
    const endpoint = rawApiUrl.endsWith("/api/report")
      ? rawApiUrl
      : rawApiUrl.replace(/\/+$/, "") + "/api/report";

    const token = storeInit.token;
    const yearCode = storeInit.YearCode;
    const version = storeInit.version;
    const sp = "54"; // Fixed constant for Optigo ERP API
    const sv = storeInit.sv ?? storeInit.Sv;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(yearCode ? { Yearcode: yearCode } : {}),
      ...(version ? { Version: version } : {}),
      sp,
      ...(sv != null ? { sv: String(sv) } : {}),
    };

    const configList = Array.isArray(Config) ? Config : Config ? [Config] : [];
    if (configList.length === 0) {
      return {
        success: false,
        domain: targetDomain,
        syncedTables: [],
        error: "Config array is empty. Please provide at least one pricing policy configuration.",
      };
    }

    const syncedTables = [];

    // 3. Loop through every configuration in Config
    for (const item of configList) {
      const laboursetId =
        item.Laboursetid ??
        item.laboursetid ??
        item.pricemanagement_laboursetid ??
        storeInit.pricemanagement_laboursetid;

      const diamondPriceListName =
        item.diamondpricelistName ??
        item.diamondpricelistname ??
        item.Diamondpricelistname ??
        storeInit.diamondpricelistname;

      const colorStonePriceListName =
        item.colorstonepricelistName ??
        item.colorstonepricelistname ??
        item.Colorstonepricelistname ??
        storeInit.colorstonepricelistname;

      const settingPriceUniqueNo =
        item.SettingPriceUniqueNo ??
        item.settingpriceuniqueno ??
        storeInit.SettingPriceUniqueNo;

      const frontEndRegNo =
        item.FrontEnd_RegNo ??
        item.frontEnd_RegNo ??
        storeInit.FrontEnd_RegNo;

      const domainForNo =
        item.DomainForNo ??
        item.domainforno ??
        storeInit.DomainForNo;

      const resolvedConfig = {
        FrontEnd_RegNo: frontEndRegNo != null ? String(frontEndRegNo) : "",
        Laboursetid: laboursetId != null ? Number(laboursetId) : 0,
        diamondpricelistName: diamondPriceListName != null ? String(diamondPriceListName) : "",
        colorstonepricelistName: colorStonePriceListName != null ? String(colorStonePriceListName) : "",
        SettingPriceUniqueNo: settingPriceUniqueNo != null ? Number(settingPriceUniqueNo) : 0,
        DomainForNo: domainForNo != null ? Number(domainForNo) : 0,
      };

      // 4. Generate dynamic table name with central prefix
      const tableName = getDynamicDesignTableName(resolvedConfig, DESIGN_TABLE_PREFIX);

      // 5. Build request body for ERP API
      const pPayload = {
        FrontEnd_RegNo: resolvedConfig.FrontEnd_RegNo,
        Laboursetid: resolvedConfig.Laboursetid,
        diamondpricelistName: resolvedConfig.diamondpricelistName,
        diamondpricelistname: resolvedConfig.diamondpricelistName,
        colorstonepricelistName: resolvedConfig.colorstonepricelistName,
        colorstonepricelistname: resolvedConfig.colorstonepricelistName,
        SettingPriceUniqueNo: resolvedConfig.SettingPriceUniqueNo,
        DomainForNo: resolvedConfig.DomainForNo,
      };

      const requestBody = {
        con: JSON.stringify({
          id: "",
          mode: "GETPRODUCTFULLLIST",
          appuserid: storeInit.companyorderemail || storeInit.companysupportemail || "",
          IPAddress: "",
        }),
        f: "onlogin (GETPRODUCTFULLLIST)",
        p: JSON.stringify(pPayload),
      };

      logger.info("DYNAMIC_SYNC", `Calling ERP API for policy table: ${tableName}`, {
        domain: targetDomain,
        table: tableName,
        endpoint,
        config: resolvedConfig,
      });
      let responseData = null;

      try {
        const fetchRes = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        if (!fetchRes.ok) {
          const errText = await fetchRes.text().catch(() => "");
          throw new Error(`HTTP ${fetchRes.status}: ${errText || fetchRes.statusText}`);
        }

        responseData = await fetchRes.json();
      } catch (fetchErr) {
        logger.error("DYNAMIC_SYNC", `ERP API fetch failed for table ${tableName}: ${fetchErr.message}`, {
          domain: targetDomain,
          table: tableName,
          endpoint,
          error: fetchErr.message,
        });
        syncedTables.push({
          table: tableName,
          success: false,
          error: fetchErr.message,
          totalReceived: 0,
          insertedCount: 0,
          updatedCount: 0,
        });
        continue;
      }

      const products =
        responseData?.Data?.rd ||
        responseData?.rd ||
        responseData?.Data ||
        [];

      if (!Array.isArray(products) || products.length === 0) {
        logger.warn("DYNAMIC_SYNC", `No products returned from ERP API for table: ${tableName}`, {
          domain: targetDomain,
          table: tableName,
          apiMessage: responseData?.Message || "empty response",
        });
        syncedTables.push({
          table: tableName,
          success: false,
          error: responseData?.Message || "No products returned from ERP API",
          totalReceived: 0,
          insertedCount: 0,
          updatedCount: 0,
        });
        continue;
      }

      // 6. Batch upsert into the dynamic SQLite table
      const insertResult = syncTableViaTemp(db, {
        mainTable: tableName,
        keyCols: ["ArticleNo"],
        deleteStale: true,
        ensureMainTable: (d, t) => ensureDynamicDesignTable(d, t),
        stage: (tmp) => batchInsertDesigns(db, products, "DYNAMIC_POLICY_SYNC", { flush: false }, tmp),
      });

      // 7. Record in dynamic_tables_registry
      recordDynamicTableSync(db, {
        table_name: tableName,
        domain: targetDomain,
        laboursetid: resolvedConfig.Laboursetid,
        diamondpricelistname: resolvedConfig.diamondpricelistname,
        colorstonepricelistname: resolvedConfig.colorstonepricelistname,
        settingpriceuniqueno: resolvedConfig.SettingPriceUniqueNo,
        config_json: pPayload,
        total_products: insertResult.totalInDatabase || products.length,
      });

      // 8. Pre-compute and materialize categories for this policy table
      try {
        rebuildPolicyCategories(db, tableName);
      } catch (catErr) {
        logger.warn("DYNAMIC_SYNC", `Failed to pre-compute categories for ${tableName}: ${catErr.message}`);
      }

      logger.info("DYNAMIC_SYNC", `Synced ${products.length} products → ${tableName} (Inserted: ${insertResult.insertedCount}, Updated: ${insertResult.updatedCount})`, {
        domain: targetDomain,
        table: tableName,
        totalReceived: products.length,
        insertedCount: insertResult.insertedCount,
        updatedCount: insertResult.updatedCount,
        totalInDatabase: insertResult.totalInDatabase,
      });

      syncedTables.push({
        table: tableName,
        success: true,
        totalReceived: products.length,
        insertedCount: insertResult.insertedCount,
        updatedCount: insertResult.updatedCount,
        totalInDatabase: insertResult.totalInDatabase,
        config: resolvedConfig,
      });
    }

    return {
      success: syncedTables.some((t) => t.success),
      domain: targetDomain,
      syncedTables,
      totalConfigsProcessed: configList.length,
    };
  } catch (error) {
    logger.error("DYNAMIC_SYNC", `Unhandled error during policy product sync: ${error.message}`, {
      domain: domain || "default",
      error: error.stack || error.message,
    });
    return {
      success: false,
      domain: domain || "default",
      syncedTables: [],
      error: error.message,
    };
  }
}
