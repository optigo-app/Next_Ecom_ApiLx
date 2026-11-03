import { getTenantDb } from "../../../../db/tenantManager.js";
import { batchInsertStockList } from "../../../../db/procedures/batchInsertStockList.js";
import {
  getDynamicStockListTableName,
  ensureDynamicStockListTable,
  STOCK_LIST_PREFIX,
} from "../../../../db/schema/dynamicStockList.js";
import { syncTableViaTemp } from "../../../../db/procedures/tempTableSync.js";
import { logger } from "../../../../db/logger.js";
import { syncReadyStockFlags } from "../../../../db/procedures/syncReadyStockFlags.js";

/**
 * Synchronizes stock memo list from remote ERP API (GETStockMemoLIST) into dynamic
 * SQLite tables partitioned by pricing policy configuration.
 * Uses temp-table replacement (syncTableViaTemp) without duplicate-check overhead.
 * 
 * @param {object} options
 * @param {string} [options.domain] - Tenant domain (e.g. "beluxjewel.web")
 * @param {Array<object>} options.Config - List of policy configurations
 * @param {object} [options.storeInit] - Optional pre-loaded storeinit record
 * @returns {Promise<{ success: boolean, domain: string, syncedTables: Array<object>, error?: string }>}
 */
export async function syncDynamicStockList(options = {}) {
  const { domain, Config, storeInit: inputStoreInit, slotSize = 1000 } = options || {};
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
    if (!db) {
      return {
        success: false,
        domain: targetDomain,
        syncedTables: [],
        error: `Database connection could not be opened for domain: ${targetDomain}`,
      };
    }

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

    // 2. Resolve credentials & remote endpoint
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
    const sp = "54";
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

    // 3. Process each policy configuration
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

      const customerId =
        item.Customerid ??
        item.customerid ??
        item.CustomerId ??
        "0";

      const autocode =
        item.autocode ??
        item.AutoCode ??
        "";

      const resolvedConfig = {
        FrontEnd_RegNo: frontEndRegNo != null ? String(frontEndRegNo) : "",
        autocode: String(autocode),
        Customerid: String(customerId),
        Laboursetid: laboursetId != null ? Number(laboursetId) : 0,
        diamondpricelistname: diamondPriceListName != null ? String(diamondPriceListName) : "",
        colorstonepricelistname: colorStonePriceListName != null ? String(colorStonePriceListName) : "",
        SettingPriceUniqueNo: settingPriceUniqueNo != null ? Number(settingPriceUniqueNo) : 0,
      };

      const tableName = getDynamicStockListTableName(resolvedConfig, STOCK_LIST_PREFIX);

      const pPayload = {
        FrontEnd_RegNo: resolvedConfig.FrontEnd_RegNo,
        autocode: resolvedConfig.autocode,
        Customerid: resolvedConfig.Customerid,
        Laboursetid: resolvedConfig.Laboursetid,
        diamondpricelistname: resolvedConfig.diamondpricelistname,
        colorstonepricelistname: resolvedConfig.colorstonepricelistname,
        SettingPriceUniqueNo: resolvedConfig.SettingPriceUniqueNo,
      };

      const requestBody = {
        con: JSON.stringify({
          id: "",
          mode: "GETStockMemoLIST",
          appuserid: storeInit.companyorderemail || storeInit.companysupportemail || "",
          IPAddress: "",
        }),
        f: "GETStockMemoLIST",
        p: JSON.stringify(pPayload),
      };

      logger.info("STOCK_SYNC", `Calling ERP GETStockMemoLIST for table: ${tableName}`, {
        domain: targetDomain,
        table: tableName,
        endpoint,
      });

      let responseData = null;

      try {
        const fetchRes = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(60_000),
        });

        if (!fetchRes.ok) {
          const errText = await fetchRes.text().catch(() => "");
          throw new Error(`HTTP ${fetchRes.status}: ${errText || fetchRes.statusText}`);
        }

        responseData = await fetchRes.json();
      } catch (fetchErr) {
        logger.error("STOCK_SYNC", `ERP API fetch failed for table ${tableName}: ${fetchErr.message}`, {
          domain: targetDomain,
          table: tableName,
          endpoint,
          error: fetchErr.message,
        });

        syncedTables.push({
          table: tableName,
          success: false,
          error: fetchErr.message,
        });
        continue;
      }

      const rawStockList = responseData?.Data?.rd || responseData?.rd || [];
      if (!Array.isArray(rawStockList)) {
        syncedTables.push({
          table: tableName,
          success: false,
          error: "Invalid ERP response: Data.rd is not an array.",
        });
        continue;
      }

      // Stage into temp table and replace live table cleanly without duplicate checking overhead
      const syncResult = syncTableViaTemp(db, {
        mainTable: tableName,
        keyCols: ["StockBarcode"],
        deleteStale: true,
        ensureMainTable: (d, t) => ensureDynamicStockListTable(d, t),
        stage: (tmpTable) => batchInsertStockList(db, rawStockList, { flush: false, slotSize: options?.slotSize || 1000 }, tmpTable),
      });
      const readyStockSync = syncReadyStockFlags(db, tableName);

      syncedTables.push({
        table: tableName,
        success: true,
        totalReceived: rawStockList.length,
        insertedCount: syncResult.insertedCount,
        updatedCount: syncResult.updatedCount,
        deletedCount: syncResult.deletedCount,
        totalInDatabase: syncResult.totalInDatabase,
        readyStockSync,
      });
    }

    const allSucceeded = syncedTables.every((t) => t.success);

    return {
      success: allSucceeded,
      domain: targetDomain,
      syncedTables,
      totalConfigsProcessed: configList.length,
    };
  } catch (error) {
    logger.error("STOCK_SYNC", `syncDynamicStockList unhandled error: ${error.message}`, {
      domain,
      error: error.message,
    });
    return {
      success: false,
      domain: domain || "unknown",
      syncedTables: [],
      error: error.message,
    };
  }
}
