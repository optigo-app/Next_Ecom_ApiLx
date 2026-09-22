import { NextResponse } from "next/server";
import { getSqliteHomeCategory } from "@/app/(core)/utils/sqlite/sqliteActions";
import { extractDomain } from "@/app/api/sqlite/commonController";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

/**
 * Clean & Fast API Route for Home Categories
 * GET /api/home_category
 * POST /api/home_category
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

    const options = {
      ...body,
      limit: body.limit || searchParams.get("limit"),
      tableName: body.tableName || searchParams.get("tableName"),
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
