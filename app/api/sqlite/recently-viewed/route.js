import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { saveRecentlyViewed, getRecentlyViewed } from "@/db/procedures/recentlyViewed";
import { getStoreInit } from "@/db/procedures/getStoreInit";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "@/app/api/sqlite/commonController";
import { getPricingPolicyParams, getDynamicDesignTableName } from "@/app/(core)/utils/product/pricingPolicy";
import { cookies } from "next/headers";
import { logger } from "@/db/logger";

/**
 * SQLite Customer-Wise Recently Viewed Designs API
 * 
 * POST:
 *  - If payload contains { designno, customerId } and action !== 'fetch', saves the viewed design into SQLite.
 *  - If action === 'fetch' or GET, retrieves the customer's recently viewed designs with active pricing.
 * 
 * GET:
 *  - Retrieves the customer's recently viewed designs using query params:
 *    ?customerId=...&currentDesignno=...&limit=...
 */

async function resolveDomainAndDb(req, body = {}) {
  let targetDomain = extractDomain(req, body);
  if (!targetDomain) {
    const domainInfo = await getDomainInfo().catch(() => ({}));
    targetDomain = domainInfo?.hostname || "default";
  }
  const db = getTenantDb(targetDomain);
  return { targetDomain, db };
}

async function resolveCustomerId(req, body = {}) {
  const { searchParams } = new URL(req.url);
  let customerId =
    body.customerId ||
    body.Customerid ||
    body.customer_id ||
    searchParams.get("customerId") ||
    searchParams.get("customer_id");

  if (!customerId) {
    try {
      const cookieStore = await cookies().catch(() => null);
      const rawUser = cookieStore?.get("loginUserDetail")?.value;
      if (rawUser) {
        const parsed = JSON.parse(decodeURIComponent(rawUser));
        customerId = parsed?.id || parsed?.userid;
      }
      if (!customerId) {
        customerId = cookieStore?.get("visiterId")?.value;
      }
    } catch (_) {}
  }

  return customerId ? String(customerId) : null;
}

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const { targetDomain, db } = await resolveDomainAndDb(req, body);
    const customerId = await resolveCustomerId(req, body);

    // If saving a recently viewed design
    if (body.action === "save" || (body.designno && body.action !== "fetch")) {
      if (!customerId || !body.designno) {
        return NextResponse.json(
          { stat: 0, message: "customerId and designno are required to save" },
          { status: 400 }
        );
      }

      const saveResult = saveRecentlyViewed(db, {
        customerId,
        designno: body.designno,
        autocode: body.autocode,
      });

      return NextResponse.json({
        stat: saveResult.success ? 1 : 0,
        ...saveResult,
      });
    }

    // Otherwise, fetch recently viewed designs
    return handleFetch(req, body, db, targetDomain, customerId);
  } catch (err) {
    logger.error("[RecentlyViewed API] POST error:", err);
    return NextResponse.json(
      { stat: 0, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { targetDomain, db } = await resolveDomainAndDb(req);
    const customerId = await resolveCustomerId(req);
    return handleFetch(req, {}, db, targetDomain, customerId);
  } catch (err) {
    logger.error("[RecentlyViewed API] GET error:", err);
    return NextResponse.json(
      { stat: 0, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleFetch(req, body, db, targetDomain, customerId) {
  const { searchParams } = new URL(req.url);

  if (!customerId) {
    return NextResponse.json({
      stat: 1,
      Data: { rd: [] },
      rd: [],
    });
  }

  const currentDesignno =
    body.currentDesignno ||
    body.currentDesignNo ||
    searchParams.get("currentDesignno") ||
    searchParams.get("currentDesignNo") ||
    null;

  const limit = Number(body.limit || searchParams.get("limit") || 12);

  // Resolve Active Policy Table
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

  const items = getRecentlyViewed(db, {
    customerId,
    currentDesignno,
    limit,
    tableName: targetTable,
  });

  return NextResponse.json({
    stat: 1,
    Data: { rd: items },
    rd: items,
  });
}
