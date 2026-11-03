import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { batchInsertStockList } from "@/db/procedures/batchInsertStockList";
import { getStockList } from "@/db/procedures/getStockList";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "../commonController";
import { syncDynamicStockList } from "@/app/(core)/utils/sqlite/syncDynamicStockList";
import { syncTableViaTemp } from "@/db/procedures/tempTableSync";
import {
  ensureDynamicStockListTable,
  getDynamicStockListTableName,
} from "@/db/schema/dynamicStockList";
import { logger } from "@/db/logger";
import { syncReadyStockFlags } from "@/db/procedures/syncReadyStockFlags";

/**
 * Detects whether an item is a policy pricing configuration.
 * @param {object} item
 * @returns {boolean}
 */
function isPolicyConfig(item) {
  if (!item || typeof item !== "object") return false;
  return Boolean(
    item.Laboursetid != null ||
    item.laboursetid != null ||
    item.pricemanagement_laboursetid != null ||
    item.diamondpricelistname != null ||
    item.diamondpricelistName != null ||
    item.Diamondpricelistname != null ||
    item.colorstonepricelistname != null ||
    item.colorstonepricelistName != null ||
    item.SettingPriceUniqueNo != null ||
    item.settingpriceuniqueno != null
  );
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const { searchParams } = new URL(req.url);
    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    logger.logApiRequest(req, { domain: targetDomain, category: "API_STOCK_LIST", body });

    // 1. Dynamic Policy-Based ERP Sync mode (when Config array is provided)
    if (body?.Config || body?.config || body?.policies || (Array.isArray(body) && body.length > 0 && isPolicyConfig(body[0]))) {
      const configArray = body?.Config || body?.config || body?.policies || body;
      const syncResult = await syncDynamicStockList({
        domain: targetDomain,
        Config: configArray,
      });

      return NextResponse.json(
        {
          success: syncResult.success,
          domain: targetDomain,
          syncedTables: syncResult.syncedTables,
          totalConfigsProcessed: syncResult.totalConfigsProcessed,
          message: `Processed ${syncResult.syncedTables?.length || 0} dynamic policy stock tables.`,
          error: syncResult.error,
        },
        { status: syncResult.success ? 200 : syncResult.syncedTables?.length ? 207 : 400 }
      );
    }

    const db = getTenantDb(targetDomain);
    if (!db) {
      return NextResponse.json(
        { success: false, error: `Tenant database not found for domain: ${targetDomain}` },
        { status: 404 }
      );
    }

    // Determine target table (policy-wise or custom tableName or default stock_list)
    let targetTable = body?.tableName || searchParams.get("tableName");
    if (!targetTable && isPolicyConfig(body)) {
      targetTable = getDynamicStockListTableName(body);
    }
    if (!targetTable) {
      targetTable = "stock_list";
    }

    // 2. Direct Batch Push Sync mode (replaces table using temp staging without duplicate checking)
    const rawStockList = Array.isArray(body)
      ? body
      : body.stockList || body.products || body.Data?.rd || body.rd;

    const slotSize = Number(body?.slotSize || body?.batchSize || searchParams.get("slotSize") || searchParams.get("batchSize") || 1000);

    if (Array.isArray(rawStockList)) {
      const result = syncTableViaTemp(db, {
        mainTable: targetTable,
        keyCols: ["StockBarcode"],
        deleteStale: true,
        ensureMainTable: (d, t) => ensureDynamicStockListTable(d, t),
        stage: (tmp) => batchInsertStockList(db, rawStockList, { flush: false, slotSize }, tmp),
      });
      const readyStockSync = syncReadyStockFlags(db, targetTable);

      return NextResponse.json({
        success: true,
        domain: targetDomain,
        table: targetTable,
        ...result,
        readyStockSync,
        message: `Processed ${result.totalReceived} stock items for ${targetTable} (Inserted: ${result.insertedCount}, Updated: ${result.updatedCount}, Deleted: ${result.deletedCount || 0}).`,
      });
    }

    // 3. Query / Filter mode
    const result = getStockList(db, { ...body, tableName: targetTable });
    const rows = result.rd || [];
    const totalCount = result.totalCount || 0;

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      table: targetTable,
      Data: {
        rd: rows,
        totalCount,
      },
      rd: rows,
      totalCount,
      stat: 1,
      msg: "success",
    });
  } catch (error) {
    console.error("❌ SQLite Stock List POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        rd: [],
        totalCount: 0,
        stat: 0,
        msg: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    let targetDomain = searchParams.get("domain");
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    logger.logApiRequest(req, { domain: targetDomain, category: "API_STOCK_LIST" });

    const filters = {};
    for (const [k, v] of searchParams.entries()) {
      filters[k] = v;
    }

    const db = getTenantDb(targetDomain);
    if (!db) {
      return NextResponse.json(
        { success: false, error: `Tenant database not found for domain: ${targetDomain}` },
        { status: 404 }
      );
    }

    const result = getStockList(db, filters);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          stat: 0,
          msg: result.error,
          rd: [],
          totalCount: 0,
        },
        { status: 400 }
      );
    }

    const rows = result.rd || [];
    const totalCount = result.totalCount || 0;

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      Data: {
        rd: rows,
        totalCount,
      },
      rd: rows,
      totalCount,
      stat: 1,
      msg: "success",
    });
  } catch (error) {
    console.error("❌ SQLite Stock List GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        rd: [],
        totalCount: 0,
        stat: 0,
        msg: error.message,
      },
      { status: 500 }
    );
  }
}
