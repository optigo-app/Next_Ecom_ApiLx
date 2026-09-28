import { getTenantDb } from "../../../../db/tenantManager.js";
import { batchInsertArticles, repairArticleMetalFields } from "../../../../db/procedures/batchInsertArticles.js";
import { batchInsertArticleMaterials } from "../../../../db/procedures/batchInsertArticleMaterials.js";
import {
  getDynamicArticleTableName,
  getDynamicArticleMaterialTableName,
  ensureDynamicArticleTable,
  ensureDynamicArticleMaterialTable,
  ARTICLE_INFO_PREFIX,
  ARTICLE_MATERIAL_PREFIX,
  ARTICLE_TABLE_PREFIX,
} from "../../../../db/schema/dynamicArticles.js";
import { recordDynamicTableSync } from "../../../../db/schema/dynamicDesigns.js";
import { mergeTempIntoMain, dropTempTable, getTempTableName } from "../../../../db/procedures/tempTableSync.js";
import { logger } from "../../../../db/logger.js";

// In-flight active table sync tracking to prevent concurrent double-hit corruption
const activeTableSyncs = new Set();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Records fetched per paginated API call.
 * ERP pagination param: PageNo (1-indexed), PageSize.
 * ⚠️  10 for local testing — set to 10000 for production.
 */
const ARTICLE_BATCH_SIZE = 25000;

// ---------------------------------------------------------------------------
// Temp progress table helpers
// ---------------------------------------------------------------------------

/**
 * Creates a lightweight temp progress tracking table in the tenant DB.
 * Dropped after the entire sync completes.
 * @param {import('better-sqlite3').Database} db
 * @param {string} sessionId
 * @returns {string} progressTable name
 */
function createSyncProgressTable(db, sessionId) {
  const tableName = `_sync_progress_${sessionId}`;
  try {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_key  TEXT NOT NULL,
        table_name  TEXT,
        page        INTEGER DEFAULT 0,
        total_pages INTEGER DEFAULT 0,
        status      TEXT DEFAULT 'pending',
        rows_stored INTEGER DEFAULT 0,
        error       TEXT,
        updated_at  TEXT DEFAULT (datetime('now'))
      )
    `).run();
  } catch (_) {}
  return tableName;
}

/**
 * Upserts a progress row for a policy+page combo.
 */
function upsertProgress(db, progressTable, { policyKey, tableName, page, totalPages, status, rowsStored = 0, error = null }) {
  try {
    db.prepare(`
      INSERT INTO "${progressTable}" (policy_key, table_name, page, total_pages, status, rows_stored, error, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(policyKey, tableName, page, totalPages, status, rowsStored, error);
  } catch (_) {}
}

/**
 * Drops the temp progress table after sync is complete.
 */
function dropSyncProgressTable(db, progressTable) {
  try {
    db.prepare(`DROP TABLE IF EXISTS "${progressTable}"`).run();
  } catch (_) {}
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

/**
 * Calls GETPRODUCTFULLARTICLE_Count to get total record count for a policy.
 * Returns { totalCount, totalPages, error } — never throws.
 *
 * @param {string} endpoint
 * @param {object} headers
 * @param {object} baseRequestBody  - The base GETPRODUCTFULLARTICLE request body (con, f, p)
 * @param {number} batchSize
 * @returns {Promise<{ totalCount: number, totalPages: number, error: string|null, _requestBody?: object }>}
 */
async function fetchArticleCount(endpoint, headers, baseRequestBody, batchSize) {
  const pPayload = JSON.parse(baseRequestBody.p);
  // Remove PageSize/CurrentPage for count call
  const { PageSize: _ps, CurrentPage: _cp, ...countPPayload } = pPayload;

  const countCon = JSON.parse(baseRequestBody.con);
  countCon.mode = "GETPRODUCTFULLARTICLE_Count";

  const countRequestBody = {
    con: JSON.stringify(countCon),
    f: "onlogin (GETPRODUCTFULLARTICLE_Count)",
    p: JSON.stringify(countPPayload),
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(countRequestBody),
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
    }

    const data = await res.json();

    // ERP response: { Data: { rd: [{ TotalArticles: 1032, PageSize: 10000 }] } }
    const rd = data?.Data?.rd || data?.rd || [];
    const firstRow = Array.isArray(rd) ? rd[0] : rd;

    const totalCount =
      Number(
        firstRow?.TotalArticles ??  // ← confirmed ERP field name
        firstRow?.totalArticles ??
        firstRow?.TotalCount ??
        firstRow?.totalCount ??
        firstRow?.RecordCount ??
        firstRow?.TotalRecord ??
        firstRow?.TotalRecords ??
        firstRow?.Count ??
        firstRow?.Total ??
        0
      ) || 0;

    // ERP also tells us its own preferred page size — use it if larger than our batch
    const erpPageSize = Number(firstRow?.PageSize) || 0;

    const totalPages = totalCount > 0 ? Math.ceil(totalCount / batchSize) : 0;
    return { totalCount, totalPages, erpPageSize, error: null };
  } catch (err) {
    return {
      totalCount: 0,
      totalPages: 0,
      erpPageSize: 0,
      error: err.message,
      _requestBody: countRequestBody,
    };
  }
}

/**
 * Fetches a single page of GETPRODUCTFULLARTICLE data from ERP.
 * Returns { articles, materials, error } — never throws.
 * Each page response contains both rd (articles) and rd1 (materials auto-calculated by ERP).
 *
 * @param {string} endpoint
 * @param {object} headers
 * @param {object} baseRequestBody  - The base con/f/p request body
 * @param {number} page             - 1-indexed page number
 * @param {number} batchSize        - Records per page
 * @returns {Promise<{ articles: Array, materials: Array, error: string|null, _requestBody: object }>}
 */
async function fetchArticlePage(endpoint, headers, baseRequestBody, page, batchSize) {
  const pPayload = JSON.parse(baseRequestBody.p);
  const pageRequestBody = {
    ...baseRequestBody,
    p: JSON.stringify({
      ...pPayload,
      PageSize: String(batchSize),
      PageNo: String(page),   // ← ERP uses PageNo, not CurrentPage
    }),
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(pageRequestBody),
      signal: AbortSignal.timeout(120_000), // 2 min per page
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
    }

    const data = await res.json();
    const articles = data?.Data?.rd ?? data?.rd ?? data?.Data ?? [];
    const materials = data?.Data?.rd1 ?? data?.rd1 ?? [];

    return {
      articles: Array.isArray(articles) ? articles : [],
      materials: Array.isArray(materials) ? materials : [],
      error: null,
      _requestBody: pageRequestBody,
    };
  } catch (err) {
    return {
      articles: [],
      materials: [],
      error: err.message,
      _requestBody: pageRequestBody,
    };
  }
}

/**
 * Synchronizes articles and material details from the remote ERP API (GETPRODUCTFULLARTICLE) into paired dynamic
 * SQLite tables partitioned by pricing policy configuration.
 *
 * Uses a paginated fetch strategy:
 *   1. Calls GETPRODUCTFULLARTICLE_Count per policy to determine total pages.
 *   2. Loops through pages of ARTICLE_BATCH_SIZE (25,000) records per page.
 *   3. Each page response contains both rd (articles) and rd1 (materials, auto-calculated by ERP).
 *   4. Both rd and rd1 are stored in their respective tables. Truncate on page 1 only; upsert on pages 2+.
 *   5. A temp progress table tracks page-level status and is dropped after sync completes.
 *   6. If Count API fails → falls back to single-page fetch (original behavior, safe).
 *
 * Target Table Formats:
 * - Articles:  ArticleManagement_DesignInfo_Web_{Laboursetid}_{diamondpricelistname}_{colorstonepricelistname}_{SettingPriceUniqueNo}
 * - Materials: ArticleManagement_DesignMaterialDetail_Web_{Laboursetid}_{diamondpricelistname}_{colorstonepricelistname}_{SettingPriceUniqueNo}
 *
 * @param {object} options
 * @param {string} [options.domain]              - Tenant domain (e.g., "beluxjewel.web")
/**
 * @param {object} options
 * @param {string} [options.domain]              - Tenant domain (e.g., "beluxjewel.web")
 * @param {Array<object>|object} options.Config  - List of policy configurations
 * @param {object} [options.storeInit]           - Optional pre-loaded storeinit record
 * @param {number} [options.batchSize]           - Records per page (default: 25,000)
 * @param {boolean} [options.force]              - If true, skip the "already-has-data" check and always re-sync
 * @returns {Promise<{ success: boolean, domain: string, syncedTables: Array<object>, totalConfigsProcessed: number, error?: string }>}
 */
export async function syncDynamicPolicyArticles({ domain, Config, storeInit: inputStoreInit, batchSize, force = false }) {
  const effectiveBatchSize = Number(batchSize) > 0 ? Number(batchSize) : ARTICLE_BATCH_SIZE;

  try {
    // ------------------------------------------------------------------
    // 1. Resolve tenant domain
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // 2. Fetch storeinit from tenant DB if not fully provided
    // ------------------------------------------------------------------
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
        totalConfigsProcessed: 0,
        error: "storeinit configuration not found in tenant database. Please initialize store first.",
      };
    }

    // ------------------------------------------------------------------
    // 3. Resolve ERP endpoint and auth headers
    // ------------------------------------------------------------------
    const rawApiUrl = storeInit.ApiUrl;
    if (!rawApiUrl) {
      return {
        success: false,
        domain: targetDomain,
        syncedTables: [],
        totalConfigsProcessed: 0,
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

    // ------------------------------------------------------------------
    // 4. Validate config list
    // ------------------------------------------------------------------
    const configList = Array.isArray(Config) ? Config : Config ? [Config] : [];
    if (configList.length === 0) {
      return {
        success: false,
        domain: targetDomain,
        syncedTables: [],
        totalConfigsProcessed: 0,
        error: "Config array is empty. Please provide at least one pricing policy configuration.",
      };
    }

    // ------------------------------------------------------------------
    // 5. Create temp progress table for this sync session
    // ------------------------------------------------------------------
    const sessionId = Date.now().toString(36);
    const progressTable = createSyncProgressTable(db, sessionId);

    const syncedTables = [];

    // ------------------------------------------------------------------
    // 6. Loop through every policy configuration
    // ------------------------------------------------------------------
    for (const item of configList) {
      const laboursetId =
        item.Laboursetid ??
        item.laboursetid ??
        item.pricemanagement_laboursetid ??
        storeInit.pricemanagement_laboursetid;

      const diamondPriceListName =
        item.diamondpricelistname ??
        item.diamondpricelistName ??
        item.Diamondpricelistname ??
        storeInit.diamondpricelistname;

      const colorStonePriceListName =
        item.colorstonepricelistname ??
        item.colorstonepricelistName ??
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

      // Human-readable policy key used for logging and progress tracking
      const policyKey = `L${resolvedConfig.Laboursetid}_D${resolvedConfig.diamondpricelistName}_C${resolvedConfig.colorstonepricelistName}_S${resolvedConfig.SettingPriceUniqueNo}`;

      // Resolve dynamic table names
      const tableName = getDynamicArticleTableName(resolvedConfig, ARTICLE_INFO_PREFIX);
      const matTableName = getDynamicArticleMaterialTableName(resolvedConfig, ARTICLE_MATERIAL_PREFIX);

      // Base request body shared across count API and all page calls
      const baseRequestBody = {
        con: JSON.stringify({
          id: "",
          mode: "GETPRODUCTFULLARTICLE",
          appuserid: storeInit.companyorderemail || storeInit.companysupportemail || "neha@gmail.com",
          IPAddress: "",
        }),
        f: "onlogin (GETPRODUCTFULLARTICLE)",
        p: JSON.stringify({
          FrontEnd_RegNo: resolvedConfig.FrontEnd_RegNo,
          CurrencyRate: "1",
          Laboursetid: String(resolvedConfig.Laboursetid),
          diamondpricelistname: resolvedConfig.diamondpricelistName,
          colorstonepricelistname: resolvedConfig.colorstonepricelistName,
          SettingPriceUniqueNo: String(resolvedConfig.SettingPriceUniqueNo),
          DomainForNo: String(resolvedConfig.DomainForNo),
        }),
      };

      logger.info("DYNAMIC_ARTICLE_SYNC", `[${policyKey}] Starting sync → article table: ${tableName}`, {
        domain: targetDomain,
        table: tableName,
        materialTable: matTableName,
        endpoint,
        config: resolvedConfig,
      });

      // ----------------------------------------------------------------
      // 6a. Ensure both tables exist before inserting anything
      // ----------------------------------------------------------------
      try {
        ensureDynamicArticleTable(db, tableName);
        ensureDynamicArticleMaterialTable(db, matTableName);
      } catch (schemaErr) {
        logger.error("DYNAMIC_ARTICLE_SYNC", `[${policyKey}] Schema error: ${schemaErr.message}`, {
          domain: targetDomain,
          table: tableName,
          error: schemaErr.message,
        });
        syncedTables.push({
          table: tableName,
          materialTable: matTableName,
          success: false,
          error: `Schema error: ${schemaErr.message}`,
          totalReceived: 0,
          insertedCount: 0,
          updatedCount: 0,
        });
        continue;
      }

      // ----------------------------------------------------------------
      // 6b. Concurrent Double-Hit Lock: if this table is currently syncing, return 409
      // ----------------------------------------------------------------
      const syncLockKey = `${targetDomain}:${tableName}`;
      if (activeTableSyncs.has(syncLockKey)) {
        console.warn(`[ARTICLE_SYNC] [${policyKey}] ⏸ Sync already in progress for table: ${tableName}`);
        logger.warn(
          "DYNAMIC_ARTICLE_SYNC",
          `[${policyKey}] Sync already in progress for table ${tableName} (concurrent hit detected).`,
          { domain: targetDomain, table: tableName }
        );
        syncedTables.push({
          table: tableName,
          materialTable: matTableName,
          success: false,
          inProgress: true,
          error: `Sync is already in progress for table ${tableName}. Please wait for it to complete.`,
          totalReceived: 0,
          insertedCount: 0,
          updatedCount: 0,
          deletedCount: 0,
        });
        continue;
      }

      activeTableSyncs.add(syncLockKey);

      const artTempTable = getTempTableName(tableName);
      const matTempTable = getTempTableName(matTableName);

      try {
        // ----------------------------------------------------------------
        // 6c. Call Count API → determine total pages
        // ----------------------------------------------------------------
        const countT0 = Date.now();
        console.log(`\n[ARTICLE_SYNC] ═══════════════════════════════════════════════════`);
        console.log(`[ARTICLE_SYNC] Policy: ${policyKey}`);
        console.log(`[ARTICLE_SYNC] Table:  ${tableName}`);
        console.log(`[ARTICLE_SYNC] Calling GETPRODUCTFULLARTICLE_Count ...`);

        const countResult = await fetchArticleCount(endpoint, headers, baseRequestBody, effectiveBatchSize);
        const countMs = Date.now() - countT0;

        let totalCount = countResult.totalCount;
        // Prioritize configured batchSize (effectiveBatchSize). Fall back to ERP's PageSize only if not provided.
        const fetchBatchSize = effectiveBatchSize > 0 ? effectiveBatchSize : (countResult.erpPageSize > 0 ? countResult.erpPageSize : 10000);
        let totalPages = totalCount > 0 ? Math.ceil(totalCount / fetchBatchSize) : countResult.totalPages;
        let useSingleFetch = false;

        if (countResult.error || totalCount === 0) {
          console.warn(`[ARTICLE_SYNC] ⚠ Count API failed (${countMs}ms) — falling back to single-page fetch`);
          console.warn(`[ARTICLE_SYNC]   Reason: ${countResult.error || "totalCount = 0"}`);
          logger.warn(
            "DYNAMIC_ARTICLE_SYNC",
            `[${policyKey}] Count API failed or returned 0 — falling back to single-page fetch. Reason: ${countResult.error || "totalCount = 0"}`,
            {
              domain: targetDomain,
              table: tableName,
              endpoint,
              requestBody: countResult._requestBody,
              error: countResult.error,
              durationMs: countMs,
            }
          );
          // Fallback: treat as 1 page with large PageSize (original behavior)
          totalPages = 1;
          useSingleFetch = true;
        } else {
          console.log(`[ARTICLE_SYNC] ✔ Count API OK (${countMs}ms)`);
          console.log(`[ARTICLE_SYNC]   totalCount  = ${totalCount}`);
          console.log(`[ARTICLE_SYNC]   erpPageSize = ${countResult.erpPageSize || "not specified"}`);
          console.log(`[ARTICLE_SYNC]   fetchBatch  = ${fetchBatchSize} records/page`);
          console.log(`[ARTICLE_SYNC]   totalPages  = ${totalPages}`);
          logger.info(
            "DYNAMIC_ARTICLE_SYNC",
            `[${policyKey}] Count → totalCount=${totalCount}, batchSize=${fetchBatchSize}, totalPages=${totalPages} (${countMs}ms)`,
            { domain: targetDomain, table: tableName, totalCount, totalPages, batchSize: fetchBatchSize, durationMs: countMs }
          );
        }

        // ----------------------------------------------------------------
        // 6d. Paginated fetch + insert loop into temporary staging tables
        // ----------------------------------------------------------------
        let policyTotalArticles = 0;
        let policyTotalMaterials = 0;
        let policyInserted = 0;
        let policyUpdated = 0;
        let policyMatInserted = 0;
        let policyFailed = false;
        let policyError = null;
        const policyT0 = Date.now();

        console.log(`[ARTICLE_SYNC] ───────────────────────────────────────────────────`);
        console.log(`[ARTICLE_SYNC] Starting pagination loop: ${totalPages} page(s) × ${fetchBatchSize} records/page`);
        console.log(`[ARTICLE_SYNC] Mode: ${useSingleFetch ? "SINGLE-FETCH (fallback)" : "PAGINATED"}`);

        // Stage every page into temp tables — the live tables stay fully
        // intact during the fetch; a single merge applies everything at the end.
        dropTempTable(db, artTempTable);
        dropTempTable(db, matTempTable);

        for (let page = 1; page <= totalPages; page++) {
          const isFirstPage = page === 1;
          const pageLabel = useSingleFetch ? "[single-fetch]" : `[Page ${page}/${totalPages}]`;
          const pageT0 = Date.now();

          console.log(`[ARTICLE_SYNC] ${pageLabel} ▶ Fetching from ERP API ...`);

          // ---- Fetch page ----
          const pageResult = useSingleFetch
            ? await fetchArticlePage(endpoint, headers, baseRequestBody, 1, 50000)
            : await fetchArticlePage(endpoint, headers, baseRequestBody, page, fetchBatchSize);

          const fetchMs = Date.now() - pageT0;

          if (pageResult.error) {
            console.error(`[ARTICLE_SYNC] ${pageLabel} ✖ Fetch FAILED (${fetchMs}ms): ${pageResult.error}`);
            logger.error(
              "DYNAMIC_ARTICLE_SYNC",
              `[${policyKey}] ${pageLabel} ERP fetch failed (${fetchMs}ms): ${pageResult.error}`,
              {
                domain: targetDomain,
                table: tableName,
                page,
                totalPages,
                endpoint,
                requestBody: pageResult._requestBody,
                error: pageResult.error,
                durationMs: fetchMs,
              }
            );
            upsertProgress(db, progressTable, {
              policyKey, tableName, page, totalPages, status: "fetch_error", rowsStored: 0, error: pageResult.error,
            });
            if (isFirstPage) {
              policyFailed = true;
              policyError = pageResult.error;
              break;
            }
            // Mid-sync page failure: partial data is better than nothing — continue
            continue;
          }

          const { articles, materials } = pageResult;

          if (isFirstPage && articles.length === 0) {
            console.warn(`[ARTICLE_SYNC] ${pageLabel} ⚠ No articles returned from ERP (${fetchMs}ms)`);
            logger.warn(
              "DYNAMIC_ARTICLE_SYNC",
              `[${policyKey}] ${pageLabel} No articles returned from ERP API (${fetchMs}ms)`,
              {
                domain: targetDomain,
                table: tableName,
                requestBody: pageResult._requestBody,
                durationMs: fetchMs,
              }
            );
            policyFailed = true;
            policyError = "No articles returned from ERP API on page 1";
            break;
          }

          console.log(`[ARTICLE_SYNC] ${pageLabel} ✔ Fetch OK (${fetchMs}ms) — articles: ${articles.length}, materials: ${materials.length}`);
          logger.info(
            "DYNAMIC_ARTICLE_SYNC",
            `[${policyKey}] ${pageLabel} Fetched ${articles.length} articles + ${materials.length} materials (${fetchMs}ms)`,
            { domain: targetDomain, table: tableName, page, articlesCount: articles.length, materialsCount: materials.length, durationMs: fetchMs }
          );

          // ---- Insert articles (rd) into temporary table ----
          const insertT0 = Date.now();
          try {
            const insertResult = batchInsertArticles(
              db,
              articles,
              {
                // Stage into temp table — live table is never touched mid-sync
                tableName: artTempTable,
              },
              artTempTable
            );
            const insertMs = Date.now() - insertT0;
            policyTotalArticles += insertResult.totalReceived;
            policyInserted += insertResult.insertedCount;
            policyUpdated += insertResult.updatedCount;
            console.log(`[ARTICLE_SYNC] ${pageLabel}   articles staged to temp: ${insertResult.insertedCount} inserted, ${insertResult.updatedCount} updated (${insertMs}ms)`);
          } catch (insertErr) {
            const insertMs = Date.now() - insertT0;
            console.error(`[ARTICLE_SYNC] ${pageLabel}   articles insert FAILED (${insertMs}ms): ${insertErr.message}`);
            logger.error(
              "DYNAMIC_ARTICLE_SYNC",
              `[${policyKey}] ${pageLabel} Article insert failed (${insertMs}ms): ${insertErr.message}`,
              {
                domain: targetDomain,
                table: tableName,
                page,
                rowCount: articles.length,
                requestBody: pageResult._requestBody,
                error: insertErr.message,
                durationMs: insertMs,
              }
            );
            upsertProgress(db, progressTable, {
              policyKey, tableName, page, totalPages, status: "insert_error", rowsStored: 0, error: insertErr.message,
            });
            if (isFirstPage) {
              policyFailed = true;
              policyError = `Article insert failed on page 1: ${insertErr.message}`;
              break;
            }
            continue;
          }

          // ---- Insert materials (rd1) into temporary table ----
          if (Array.isArray(materials) && materials.length > 0) {
            const matInsertT0 = Date.now();
            try {
              const matInsertResult = batchInsertArticleMaterials(
                db,
                materials,
                {
                  tableName: matTempTable,
                },
                matTempTable
              );
              const matInsertMs = Date.now() - matInsertT0;
              policyTotalMaterials += matInsertResult.totalReceived;
              policyMatInserted += matInsertResult.insertedCount;
              console.log(`[ARTICLE_SYNC] ${pageLabel}   materials staged to temp: ${matInsertResult.insertedCount} inserted (${matInsertMs}ms)`);
            } catch (matErr) {
              const matInsertMs = Date.now() - matInsertT0;
              console.warn(`[ARTICLE_SYNC] ${pageLabel}   materials insert FAILED (non-fatal, ${matInsertMs}ms): ${matErr.message}`);
              logger.error(
                "DYNAMIC_ARTICLE_SYNC",
                `[${policyKey}] ${pageLabel} Material insert failed (non-fatal, ${matInsertMs}ms): ${matErr.message}`,
                {
                  domain: targetDomain,
                  table: matTableName,
                  page,
                  rowCount: materials.length,
                  requestBody: pageResult._requestBody,
                  error: matErr.message,
                  durationMs: matInsertMs,
                }
              );
              // Material insert failure is non-fatal — articles are already stored, continue
            }
          } else {
            console.log(`[ARTICLE_SYNC] ${pageLabel}   materials: none returned on this page`);
          }

          const pageMs = Date.now() - pageT0;
          console.log(`[ARTICLE_SYNC] ${pageLabel} ✓ Page done — total this page: ${articles.length} articles, ${materials.length} materials (page time: ${pageMs}ms, running total: ${policyTotalArticles} articles)`);

          upsertProgress(db, progressTable, {
            policyKey, tableName, page, totalPages, status: "done", rowsStored: articles.length, error: null,
          });
        } // end page loop

        // ----------------------------------------------------------------
        // 6e. Merge staged temp tables into live tables:
        //     - UPDATE matching records with new values
        //     - INSERT new records
        //     - DELETE records in old table not existing in new data
        // ----------------------------------------------------------------
        let policyDeleted = 0;
        let policyMatDeleted = 0;
        if (!policyFailed) {
          try {
            const artMerge = mergeTempIntoMain(db, tableName, artTempTable, { keyCols: ["ArticleNo"], deleteStale: true });
            policyInserted = artMerge.insertedCount;
            policyUpdated = artMerge.updatedCount;
            policyDeleted = artMerge.deletedCount;
            console.log(`[ARTICLE_SYNC] merge articles -> inserted: ${artMerge.insertedCount}, updated: ${artMerge.updatedCount}, deleted: ${artMerge.deletedCount}`);
          } catch (mergeErr) {
            policyFailed = true;
            policyError = `Article merge failed: ${mergeErr.message}`;
            logger.error("DYNAMIC_ARTICLE_SYNC", `[${policyKey}] Article merge failed: ${mergeErr.message}`, { domain: targetDomain, table: tableName, error: mergeErr.message });
          }

          if (!policyFailed && policyTotalMaterials > 0) {
            try {
              const matMerge = mergeTempIntoMain(db, matTableName, matTempTable, { keyCols: ["id"], deleteStale: true });
              policyMatInserted = matMerge.insertedCount;
              policyMatDeleted = matMerge.deletedCount;
              console.log(`[ARTICLE_SYNC] merge materials -> inserted: ${matMerge.insertedCount}, updated: ${matMerge.updatedCount}, deleted: ${matMerge.deletedCount}`);
            } catch (matMergeErr) {
              console.warn(`[ARTICLE_SYNC] material merge failed (non-fatal): ${matMergeErr.message}`);
              logger.error("DYNAMIC_ARTICLE_SYNC", `[${policyKey}] Material merge failed (non-fatal): ${matMergeErr.message}`, { domain: targetDomain, table: matTableName, error: matMergeErr.message });
            }
          }

          // ---- Repair metal fields: ERP rd sometimes carries the article's first
          //      material (diamond/colorstone) in MetalType/MetalColor. Rewrite them
          //      from the METAL (StoneTypeid=4) material row, keyed on ArticleNo. ----
          if (!policyFailed) {
            try {
              const repair = repairArticleMetalFields(db, tableName, matTableName);
              console.log(`[ARTICLE_SYNC] metal repair -> articles fixed: ${repair.articlesRepaired}, material ArticleIds backfilled: ${repair.materialIdsBackfilled}`);
            } catch (repairErr) {
              console.warn(`[ARTICLE_SYNC] metal repair failed (non-fatal): ${repairErr.message}`);
              logger.warn("DYNAMIC_ARTICLE_SYNC", `[${policyKey}] Metal field repair failed (non-fatal): ${repairErr.message}`, { domain: targetDomain, table: tableName, error: repairErr.message });
            }
          }
        }

        const policyMs = Date.now() - policyT0;
        console.log(`[ARTICLE_SYNC] ───────────────────────────────────────────────────`);
        console.log(`[ARTICLE_SYNC] Policy ${policyKey} pagination loop DONE`);
        console.log(`[ARTICLE_SYNC]   Pages processed : ${totalPages}`);
        console.log(`[ARTICLE_SYNC]   Articles fetched: ${policyTotalArticles} (inserted: ${policyInserted}, updated: ${policyUpdated}, deleted: ${policyDeleted})`);
        console.log(`[ARTICLE_SYNC]   Materials stored: ${policyTotalMaterials}`);
        console.log(`[ARTICLE_SYNC]   Total time      : ${policyMs}ms`);
        console.log(`[ARTICLE_SYNC]   Status          : ${policyFailed ? "FAILED ❌" : "SUCCESS ✅"}`);
        console.log(`[ARTICLE_SYNC] ═══════════════════════════════════════════════════\n`);

        // ----------------------------------------------------------------
        // 6f. Record sync in registry and push result
        // ----------------------------------------------------------------
        if (!policyFailed) {
          const finalArticleCount = (() => {
            try { return db.prepare(`SELECT COUNT(*) as c FROM "${tableName}"`).get()?.c || 0; } catch (_) { return policyTotalArticles; }
          })();
          const finalMatCount = (() => {
            try { return db.prepare(`SELECT COUNT(*) as c FROM "${matTableName}"`).get()?.c || 0; } catch (_) { return policyTotalMaterials; }
          })();

          try {
            recordDynamicTableSync(db, {
              table_name: tableName,
              domain: targetDomain,
              laboursetid: String(resolvedConfig.Laboursetid),
              diamondpricelistname: resolvedConfig.diamondpricelistName,
              colorstonepricelistname: resolvedConfig.colorstonepricelistName,
              settingpriceuniqueno: String(resolvedConfig.SettingPriceUniqueNo),
              config_json: resolvedConfig,
              total_products: finalArticleCount,
            });
          } catch (_) {}

          try {
            recordDynamicTableSync(db, {
              table_name: matTableName,
              domain: targetDomain,
              laboursetid: String(resolvedConfig.Laboursetid),
              diamondpricelistname: resolvedConfig.diamondpricelistName,
              colorstonepricelistname: resolvedConfig.colorstonepricelistName,
              settingpriceuniqueno: String(resolvedConfig.SettingPriceUniqueNo),
              config_json: resolvedConfig,
              total_products: finalMatCount,
            });
          } catch (_) {}

          logger.info(
            "DYNAMIC_ARTICLE_SYNC",
            `[${policyKey}] ✅ Sync complete — ${policyTotalArticles} articles (${totalPages} page(s)), ${policyTotalMaterials} materials → ${tableName}`,
            { domain: targetDomain, table: tableName, materialTable: matTableName }
          );

          syncedTables.push({
            table: tableName,
            materialTable: matTableName,
            success: true,
            totalPages,
            totalReceived: policyTotalArticles,
            insertedCount: policyInserted,
            updatedCount: policyUpdated,
            deletedCount: policyDeleted,
            totalInDatabase: finalArticleCount,
            materialsReceived: policyTotalMaterials,
            materialsInserted: policyMatInserted,
            materialsDeleted: policyMatDeleted,
            totalMaterialsInDatabase: finalMatCount,
          });
        } else {
          logger.error(
            "DYNAMIC_ARTICLE_SYNC",
            `[${policyKey}] ❌ Sync failed — ${policyError}`,
            { domain: targetDomain, table: tableName }
          );
          syncedTables.push({
            table: tableName,
            materialTable: matTableName,
            success: false,
            error: policyError,
            totalPages,
            totalReceived: 0,
            insertedCount: 0,
            updatedCount: 0,
            deletedCount: 0,
          });
        }
      } finally {
        activeTableSyncs.delete(syncLockKey);
        dropTempTable(db, artTempTable);
        dropTempTable(db, matTempTable);
        try {
          db.pragma("wal_checkpoint(TRUNCATE)");
        } catch (_) {}
      }
    } // end config loop

    // ------------------------------------------------------------------
    // 7. Drop temp progress table — sync session complete
    // ------------------------------------------------------------------
    dropSyncProgressTable(db, progressTable);

    const hasAnySuccess = syncedTables.some((t) => t.success);
    const hasAnyInProgress = syncedTables.some((t) => t.inProgress);
    const inProgressError = syncedTables.find((t) => t.inProgress)?.error;

    return {
      success: hasAnySuccess,
      inProgress: hasAnyInProgress && !hasAnySuccess,
      domain: targetDomain,
      syncedTables,
      totalConfigsProcessed: configList.length,
      error: hasAnySuccess ? undefined : (inProgressError || syncedTables[0]?.error),
    };
  } catch (error) {
    logger.error("DYNAMIC_ARTICLE_SYNC", `syncDynamicPolicyArticles global error: ${error.message}`, {
      error: error.stack,
    });
    return {
      success: false,
      domain: domain || "default",
      syncedTables: [],
      totalConfigsProcessed: 0,
      error: error.message,
    };
  }
}

export default syncDynamicPolicyArticles;



