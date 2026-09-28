import { NextResponse } from "next/server";
import { getSqliteHomeCategory } from "@/app/(core)/utils/sqlite/sqliteActions";
import { extractDomain } from "@/app/api/sqlite/commonController";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { getTenantDb } from "@/db/tenantManager";
import { rebuildPolicyCategories } from "@/db/procedures/materializePolicyCategories";

/**
 * SQLite Home Categories API Route
 * GET /api/sqlite/home-category
 * POST /api/sqlite/home-category
 * Supports ?rebuild=true to force re-materialization of categories on demand
 */
async function handleHomeCategory(req) {
  try {
    let body = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch (_) {
        body = {};
      }
    }

    const { searchParams } = new URL(req.url);

    // Resolve domain
    let domain = extractDomain(req, body);
    if (!domain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      domain = domainInfo?.hostname || "default";
    }

    const isRebuildRequested =
      searchParams.get("rebuild") === "true" ||
      body?.rebuild === true ||
      body?.action === "rebuild";

    const targetTable = body?.tableName || searchParams.get("tableName") || "designs";

    if (isRebuildRequested) {
      const db = getTenantDb(domain);
      const rebuiltRows = rebuildPolicyCategories(db, targetTable, body);
      return NextResponse.json({
        success: true,
        Status: "200",
        Message: `Successfully rebuilt categories for table '${targetTable}'.`,
        domain,
        table: targetTable,
        Data: { rd: rebuiltRows, stat: 1, msg: "success" },
        data: rebuiltRows,
        rd: rebuiltRows,
        totalCount: rebuiltRows.length,
      });
    }

    const options = {
      ...body,
      limit: body.limit || searchParams.get("limit"),
      tableName: targetTable,
      domain,
    };

    const result = await getSqliteHomeCategory(options, domain);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        Status: "500",
        Message: err.message,
        Data: { rd: [] },
        rd: [],
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  return handleHomeCategory(req);
}

export async function POST(req) {
  return handleHomeCategory(req);
}
