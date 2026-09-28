import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { getHomeNewArrivals } from "@/db/procedures/getHomeProducts";
import { getStoreInit } from "@/db/procedures/getStoreInit";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "@/app/api/sqlite/commonController";
import { getPricingPolicyParams, getDynamicDesignTableName } from "@/app/(core)/utils/product/pricingPolicy";
import { cookies } from "next/headers";
import { logger } from "@/db/logger";

/**
 * Clean & Ultra-Fast SQLite Home New Arrival API Route
 * Resolves active pricing policy (storeInit vs loginUserDetail / cookies)
 * Filters: IsNewArrival = 1 AND (FrontEnd1_newArrivalsto IS NULL OR DATE(FrontEnd1_newArrivalsto) >= DATE('now', 'localtime'))
 * 
 * Supports both GET and POST requests.
 */
async function handleNewArrival(req) {
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

    // 1. Resolve domain
    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const db = getTenantDb(targetDomain);

    // 2. Resolve Active Policy Table
    let targetTable = body.tableName || searchParams.get("tableName");

    if (!targetTable) {
      try {
        const cookieStore = await cookies().catch(() => null);
        targetTable =
          cookieStore?.get("pricing_table_name")?.value ||
          cookieStore?.get("policy_table")?.value;
      } catch (_) {}
    }

    // If not in cookies, resolve from loginUserDetail / storeInit in payload, cookies, or DB
    if (!targetTable) {
      let loginUser = body.loginUserDetail || null;
      let storeInit = body.storeInit || body.storeinit || null;

      if (!loginUser) {
        try {
          const cookieStore = await cookies().catch(() => null);
          const raw = cookieStore?.get("loginUserDetail")?.value;
          if (raw) loginUser = JSON.parse(decodeURIComponent(raw));
        } catch (_) {}
      }

      if (!storeInit) {
        try {
          const sInitRes = getStoreInit(db, { domain: targetDomain });
          storeInit = sInitRes?.Data?.rd?.[0] || null;
        } catch (_) {}
      }

      const policyParams = getPricingPolicyParams({
        storeinit: storeInit,
        loginUserDetail: loginUser,
        islogin: Boolean(loginUser && (loginUser.id || loginUser.userid)),
      });

      targetTable = getDynamicDesignTableName(policyParams);
    }

    // Verify table exists in sqlite_master
    const tableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(targetTable);

    const activeTable = tableExists ? tableExists.name : "designs";

    // 3. Query New Arrivals (IsNewArrival = 1 AND FrontEnd1_newArrivalsto >= today) - Direct ultra-fast query
    const limit = Number(body.limit || searchParams.get("limit") || 20);
    const result = getHomeNewArrivals(db, {
      ...body,
      tableName: activeTable,
      limit,
    });

    const rows = result.rd || [];
    const totalCount = result.totalCount || rows.length;

    logger.info("HOME_NEWARRIVAL", `Fetched ${rows.length} new arrivals from '${activeTable}' for '${targetDomain}'`, {
      domain: targetDomain,
      table: activeTable,
      count: rows.length,
    });

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      table: activeTable,
      Data: {
        rd: rows,
        stat: 1,
        msg: "success",
      },
      data: rows,
      rd: rows,
      totalCount,
    });
  } catch (error) {
    console.error("❌ SQLite Home New Arrival API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch new arrivals from SQLite",
        Data: { rd: [], stat: 0, msg: error.message },
        data: [],
        rd: [],
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  return handleNewArrival(req);
}

export async function POST(req) {
  return handleNewArrival(req);
}
