import { NextResponse } from "next/server";
import { extractDomain } from "../commonController";
import { getTenantDb } from "@/db/tenantManager";
import { getExclusiveAlbumsWithDesigns } from "@/db/procedures/getExclusiveAlbumsWithDesigns";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/sqlite/exclusive-albums
 * 
 * Fetches exclusive customer albums joined with design products directly from SQLite.
 * Query parameters:
 * - ?domain=... (optional, auto-resolved from request if omitted)
 * - ?customerId=2275 (or ?customerid=2275, required)
 * - ?id=... (optional filter for specific album)
 * - ?albumcode=... (optional filter for album code)
 * - ?includeDesigns=true (default true)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    let targetDomain = extractDomain(req);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }
    targetDomain = String(targetDomain).trim().split(":")[0];

    logger.logApiRequest(req, { domain: targetDomain, category: "API_EXCLUSIVE_ALBUMS" });

    const customerId =
      searchParams.get("customerId") ||
      searchParams.get("customerid") ||
      searchParams.get("CustomerId");

    const randomNo = searchParams.get("RandomNo") || searchParams.get("randomNo");

    if (!customerId && !randomNo) {
      return NextResponse.json(
        {
          Status: "400",
          Message: "customerId or RandomNo query parameter is required",
          Data: { rd: [] },
        },
        { status: 400 }
      );
    }

    const options = {
      customerId,
      id: searchParams.get("id"),
      albumcode: searchParams.get("albumcode") || searchParams.get("albumCode"),
      RandomNo: searchParams.get("RandomNo") || searchParams.get("randomNo"),
      includeDesigns: searchParams.get("includeDesigns") !== "false",
    };

    logger.info("API_EXCLUSIVE_ALBUMS", `Reading exclusive albums for customer ${customerId} on domain '${targetDomain}'`);

    const db = getTenantDb(targetDomain);
    let result = getExclusiveAlbumsWithDesigns(db, options);

    // If querying by RandomNo or customerId and no albums found in targetDomain, check fallback domains
    if ((!result?.Data?.rd || result.Data.rd.length === 0) && (options.RandomNo || customerId)) {
      const fallbackDomains = ["beluxjewel.web", "demostore", "procatalog.web"].filter(
        (d) => d.toLowerCase() !== targetDomain.toLowerCase()
      );
      for (const fallbackDomain of fallbackDomains) {
        try {
          const fallbackDb = getTenantDb(fallbackDomain);
          const fallbackRes = getExclusiveAlbumsWithDesigns(fallbackDb, options);
          if (fallbackRes?.Data?.rd && fallbackRes.Data.rd.length > 0) {
            result = fallbackRes;
            logger.info(
              "API_EXCLUSIVE_ALBUMS",
              `Found exclusive albums in fallback domain '${fallbackDomain}' for query: ${JSON.stringify(options)}`
            );
            break;
          }
        } catch (_) {}
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("API_EXCLUSIVE_ALBUMS", `GET /api/sqlite/exclusive-albums error: ${error.message}`, { error: error.stack });
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [] },
      },
      { status: 500 }
    );
  }
}
