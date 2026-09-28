import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { batchInsertDesigns } from "@/db/procedures/batchInsertDesigns";
import { getDesigns } from "@/db/procedures/getDesignsByMenu";
import { deleteDesigns } from "@/db/procedures/deleteDesigns";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "../commonController";
import { syncDynamicPolicyProducts } from "@/app/(core)/utils/sqlite/syncDynamicProducts";
import { syncTableViaTemp } from "@/db/procedures/tempTableSync";
import { ensureDynamicDesignTable } from "@/db/schema/dynamicDesigns";
import { rebuildPolicyCategories } from "@/db/procedures/materializePolicyCategories";

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

    // 1. Dynamic Policy-Based Sync mode (when Config array is provided)
    if (body?.Config || body?.config) {
      const configArray = body.Config || body.config;
      const syncResult = await syncDynamicPolicyProducts({
        domain: targetDomain,
        Config: configArray,
      });

      return NextResponse.json(
        {
          success: syncResult.success,
          domain: targetDomain,
          syncedTables: syncResult.syncedTables,
          totalConfigsProcessed: syncResult.totalConfigsProcessed,
          message: `Processed ${syncResult.syncedTables?.length || 0} dynamic policy table configurations.`,
          error: syncResult.error,
        },
        { status: syncResult.success ? 200 : syncResult.syncedTables?.length ? 207 : 400 }
      );
    }

    const shouldTruncate =
      searchParams.get("truncate") === "true" ||
      searchParams.get("clear") === "true" ||
      searchParams.get("flush") === "true" ||
      body?.truncate === true ||
      body?.clearBeforeSync === true ||
      body?.flush === true;

    const db = getTenantDb(targetDomain);
    const targetTable = body?.tableName || searchParams.get("tableName") || "designs";

    // 2. Batch Insertion / Sync mode with direct products array
    const rawProducts = Array.isArray(body)
      ? body
      : body.products || body.Data?.rd || body.rd;
      

    if (Array.isArray(rawProducts)) {
      const result = syncTableViaTemp(db, {
        mainTable: targetTable,
        keyCols: ["ArticleNo"],
        deleteStale: true,
        ensureMainTable: (d, t) => { if (t !== "designs") ensureDynamicDesignTable(d, t); },
        stage: (tmp) => batchInsertDesigns(db, rawProducts, body.menuIdentifier || "GLOBAL", { flush: false }, tmp),
      });

      try {
        rebuildPolicyCategories(db, targetTable);
      } catch (_) {}
      return NextResponse.json({
        success: true,
        domain: targetDomain,
        table: targetTable,
        ...result,
        message: shouldTruncate
          ? `Cleared table ${targetTable} and inserted ${result.insertedCount} products fresh.`
          : `Processed ${result.totalReceived} products for ${targetTable} (Inserted: ${result.insertedCount}, Updated: ${result.updatedCount}, Deleted: ${result.deletedCount || 0}).`,
      });
    }

    // 3. Query / Product Listing Filter mode
    const result = getDesigns(db, body);
    const rows = result.rd || [];
    const totalCount = result.totalCount || 0;

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      pdList: rows,
      pdResp: {
        rd: rows,
        rd1: [{ designcount: totalCount }],
        stat: 1,
        msg: "success",
      },
      data: rows,
      totalCount,
    });
  } catch (error) {
    console.error("❌ SQLite Products POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        pdList: [],
        pdResp: { rd: [], rd1: [{ designcount: 0 }], stat: 0, msg: error.message },
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

    const filters = {};
    for (const [k, v] of searchParams.entries()) {
      filters[k] = v;
    }

    const db = getTenantDb(targetDomain);
    const result = getDesigns(db, filters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || 0;

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      pdList: rows,
      pdResp: {
        rd: rows,
        rd1: [{ designcount: totalCount }],
        stat: 1,
        msg: "success",
      },
      data: rows,
      totalCount,
    });
  } catch (error) {
    console.error("❌ SQLite Products GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        pdList: [],
        pdResp: { rd: [], rd1: [{ designcount: 0 }], stat: 0, msg: error.message },
      },
      { status: 500 }
    );
  }
}

/*
export async function DELETE(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {}

    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const { searchParams } = new URL(req.url);
    const options = {
      articleNo: searchParams.get("articleNo") || searchParams.get("ArticleNo") || body.articleNo || body.ArticleNo,
      id: searchParams.get("id") || searchParams.get("DesignId") || body.id || body.DesignId,
      all: searchParams.get("all") === "true" || body.all === true || (!searchParams.get("articleNo") && !searchParams.get("id")),
    };

    const db = getTenantDb(targetDomain);
    const result = deleteDesigns(db, options);

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      ...result,
    });
  } catch (error) {
    console.error("❌ SQLite Products DELETE error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
*/
