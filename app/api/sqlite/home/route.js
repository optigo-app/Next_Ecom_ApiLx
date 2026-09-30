import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { getDesigns } from "@/db/procedures/getDesignsByMenu";
import { getStoreInit } from "@/db/procedures/getStoreInit";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "@/app/api/sqlite/commonController";
import { getPricingPolicyParams, getDynamicDesignTableName } from "@/app/(core)/utils/product/pricingPolicy";
import { cookies } from "next/headers";
import { logger } from "@/db/logger";

/**
 * Clean & Ultra-Fast SQLite Home Sections API Route
 * Handles home sections: bestseller, trending, newarrival, album
 * 
 * Defaults to bestseller if no specific section type is requested.
 */
async function handleHomeSection(req) {
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
    const sectionType = String(
      body.type || body.section || searchParams.get("type") || searchParams.get("section") || "bestseller"
    ).toLowerCase();

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

    const tableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(targetTable);

    const activeTable = tableExists ? tableExists.name : "designs";

    // 3. Apply Section Filters
    const queryFilters = {
      ...body,
      tableName: activeTable,
    };

    if (sectionType.includes("bestseller") || sectionType === "bestseller" || sectionType === "best_seller") {
      queryFilters.isBestSeller = true;
      queryFilters.IsBestSeller = 1;
    } else if (sectionType.includes("trending")) {
      queryFilters.isTrending = true;
      queryFilters.IsTrending = 1;
    } else if (sectionType.includes("newarrival") || sectionType.includes("new_arrival")) {
      queryFilters.isNewArrival = true;
      queryFilters.IsNewArrival = 1;
    }

    const limit = Number(body.limit || searchParams.get("limit") || 20);
    queryFilters.limit = limit;

    const result = getDesigns(db, queryFilters);
    const rows = result.rd || [];
    const totalCount = result.totalCount || rows.length;

    logger.info("HOME_SECTION", `Fetched ${rows.length} '${sectionType}' items from '${activeTable}' for '${targetDomain}'`, {
      domain: targetDomain,
      type: sectionType,
      table: activeTable,
      count: rows.length,
    });

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      type: sectionType,
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
    console.error("❌ SQLite Home Section API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch home section from SQLite",
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
  return handleHomeSection(req);
}

export async function POST(req) {
  return handleHomeSection(req);
}
