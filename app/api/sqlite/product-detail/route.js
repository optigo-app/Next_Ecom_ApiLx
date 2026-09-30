import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { getProductArticle } from "@/db/procedures/getProductArticle";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "../commonController";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const db = getTenantDb(targetDomain);
    const result = getProductArticle(db, body);

    return NextResponse.json(result, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("❌ SQLite Product Detail POST error:", error);
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [], rd1: [], rd2: [] },
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    let targetDomain = searchParams.get("domain") || searchParams.get("Domain");
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const options = {};
    for (const [k, v] of searchParams.entries()) {
      options[k] = v;
    }

    const db = getTenantDb(targetDomain);
    const result = getProductArticle(db, options);

    return NextResponse.json(result, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("❌ SQLite Product Detail GET error:", error);
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [], rd1: [], rd2: [] },
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
