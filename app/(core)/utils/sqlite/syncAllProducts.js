import { getTenantDb } from "@/db/tenantManager.js";
import { batchInsertDesigns } from "@/db/procedures/batchInsertDesigns.js";
import { rebuildPolicyCategories } from "@/db/procedures/materializePolicyCategories.js";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI.js";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo.js";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache.js";

/**
 * Fetches the entire product catalog from the remote API via GETPRODUCTFULLLIST
 * and persists/upserts all design records into the tenant's SQLite database.
 * 
 * @param {object} [initData] - Store initialization metadata
 * @param {string} [domain] - Tenant domain name
 * @returns {Promise<{ success: boolean, totalReceived: number, insertedCount: number, updatedCount: number, error?: string }>}
 */
const lastSyncMap = new Map();
const SYNC_THROTTLE_MS = 30 * 60 * 1000; // 30 minutes

export async function syncAllCatalogProducts(initData, domain, force = false) {
  try {
    let storeInit = initData;
    if (!storeInit || !storeInit.FrontEnd_RegNo || !storeInit.token) {
      const diskData = await getStoreInitData().catch(() => null);
      storeInit = diskData?.rd?.[0] || diskData || initData || {};
    }

    if (!storeInit || !storeInit.FrontEnd_RegNo || !storeInit.token) {
      return {
        success: false,
        totalReceived: 0,
        insertedCount: 0,
        updatedCount: 0,
        error: "Missing store credentials for sync",
      };
    }

    let targetDomain = domain || storeInit?.domain;
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }
    if (targetDomain && typeof targetDomain === "string") {
      targetDomain = targetDomain.trim().split(":")[0];
    }

    if (!force) {
      const lastSync = lastSyncMap.get(targetDomain) || 0;
      if (Date.now() - lastSync < SYNC_THROTTLE_MS) {
        return {
          success: true,
          throttled: true,
          totalReceived: 0,
          insertedCount: 0,
          updatedCount: 0,
        };
      }
    }

    const payload = {
      PackageId: storeInit?.PackageId ?? "",
      autocode: "",
      FrontEnd_RegNo: storeInit?.FrontEnd_RegNo ?? "",
      Customerid: 0,
      designno: "",
      Shape: "",
      FilterKey: "",
      FilterVal: "",
      FilterKey1: "",
      FilterVal1: "",
      FilterKey2: "",
      FilterVal2: "",
      SearchKey: "",
      PageNo: 1,
      PageSize: 1000000,
      Metalid: storeInit?.MetalId ?? "",
      DiaQCid: storeInit?.cmboDiaQCid ?? "",
      CsQCid: storeInit?.cmboCSQCid ?? "0,0",
      Collectionid: "",
      Categoryid: "",
      SubCategoryid: "",
      Brandid: "",
      Genderid: "",
      Ocassionid: "",
      Themeid: "",
      Producttypeid: "",
      Min_DiaWeight: "",
      Max_DiaWeight: "",
      Min_GrossWeight: "",
      Max_GrossWeight: "",
      Min_NetWt: "",
      Max_NetWt: "",
      FilPrice: "",
      CurrencyRate: storeInit?.CurrencyRate ?? 1,
      SortBy: "Recommended",
      Laboursetid: storeInit?.pricemanagement_laboursetid ?? "",
      diamondpricelistname: storeInit?.diamondpricelistname ?? "",
      colorstonepricelistname: storeInit?.colorstonepricelistname ?? "",
      SettingPriceUniqueNo: storeInit?.SettingPriceUniqueNo ?? "",
      IsStockWebsite: storeInit?.IsStockWebsite ?? "",
      Size: "",
      IsFromDesDet: "",
      IsPLW: storeInit?.IsPLW ?? 0,
      DomainForNo: storeInit?.DomainForNo ?? 0,
      AlbumName: "",
      TaxId: 0,
      WebDiscount: 0,
      IsZeroPriceProductShow: storeInit?.IsZeroPriceProductShow ?? 0,
      IsSolitaireWebsite: storeInit?.IsSolitaireWebsite ?? 0,
    };

    const body = {
      con: JSON.stringify({ id: "", mode: "GETPRODUCTFULLLIST", appuserid: "" }),
      f: "onlogin (GETPRODUCTLIST)",
      p: JSON.stringify(payload),
    };

    const response = await CommonAPI(body);
    const designs = response?.Data?.rd || [];

    if (!Array.isArray(designs) || designs.length === 0) {
      return {
        success: false,
        totalReceived: 0,
        insertedCount: 0,
        updatedCount: 0,
        error: "No products returned from API",
      };
    }

    const db = getTenantDb(targetDomain);
    const syncResult = batchInsertDesigns(db, designs, "GLOBAL_CATALOG_SYNC");
    lastSyncMap.set(targetDomain, Date.now());

    // Materialize categories right after products are inserted
    try {
      rebuildPolicyCategories(db, "designs");
    } catch (catErr) {
      console.warn("[SQLite Sync] Failed to materialize categories:", catErr.message);
    }

    console.log(
      `[SQLite Sync] Successfully synced ${designs.length} products to ${targetDomain} (Inserted: ${syncResult.insertedCount}, Updated: ${syncResult.updatedCount})`
    );

    return {
      success: true,
      totalReceived: designs.length,
      insertedCount: syncResult.insertedCount,
      updatedCount: syncResult.updatedCount,
      totalInDatabase: syncResult.totalInDatabase,
      duplicatesInPayload: syncResult.duplicatesInPayload,
      duplicateCount: syncResult.duplicateCount,
      duplicateArticleNos: syncResult.duplicateArticleNos,
      duplicateArticles: syncResult.duplicateArticles,
    };
  } catch (err) {
    console.error("[SQLite Sync] Error syncing all catalog products:", err);
    return {
      success: false,
      totalReceived: 0,
      insertedCount: 0,
      updatedCount: 0,
      totalInDatabase: 0,
      duplicatesInPayload: 0,
      duplicateCount: 0,
      duplicateArticleNos: [],
      duplicateArticles: [],
      error: err.message,
    };
  }
}
