import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { headers } from "next/headers";
import { resolveProductList } from "@/app/(core)/utils/ThemeRouteResolver";
import { getSqliteProducts } from "@/app/(core)/utils/sqlite/sqliteActions";
import {
  getDynamicMetadata,
  generateCollectionJsonLd,
  generateWebSiteJsonLd,
  getCanonicalUrl
} from "@/app/(core)/utils/seo/seo-utils";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";

export const dynamic = "force-dynamic";

/**
 * Extracts and normalizes filters from SSR params & searchParams
 */
function extractSsrFilters(slugArr = [], searchParams = {}) {
  const filters = {};

  // 1. Process searchParams using ParseAndDecodeSearchParams
  const decodedParams = ParseAndDecodeSearchParams(searchParams);
  console.log(decodedParams , "decodedParams")

  for (const item of decodedParams) {
    if (!item || typeof item !== "string" || item.endsWith("=null")) continue;

    const [prefix, rawVal] = item.split("=");
    if (!rawVal) continue;

    if (prefix === "M") {
      try {
        const decoded = Buffer.from(rawVal, "base64").toString("utf-8");
        if (decoded.includes("/")) {
          const [valPart, keyPart] = decoded.split("/");
          const keys = keyPart.split(",").map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, ""));
          const vals = valPart.split(",").map((s) => s.trim().replace(/%20/g, " "));
          keys.forEach((key, idx) => {
            const cleanVal = vals[idx] ? vals[idx].trim() : "";
            if (key && key.toLowerCase() !== "auto" && cleanVal) {
              filters[key] = cleanVal;
            }
          });
        }
      } catch (_) {}
    } else if (prefix === "S") {
      try {
        const decoded = JSON.parse(Buffer.from(rawVal, "base64").toString("utf-8"));
        filters.SearchKey = decoded?.b || decoded;
      } catch (_) {
        try {
          filters.SearchKey = Buffer.from(rawVal, "base64").toString("utf-8");
        } catch (_) {}
      }
    } else if (prefix === "N") {
      filters.isNewArrival = true;
    } else if (prefix === "T") {
      filters.isTrending = true;
    } else if (prefix === "B") {
      filters.isBestSeller = true;
    }
  }

  // Include direct searchParams keys if present
  for (const [k, v] of Object.entries(searchParams || {})) {
    if (k !== "M" && k !== "S" && k !== "N" && k !== "T" && k !== "B" && v && typeof v === "string") {
      filters[k] = v;
    }
  }

  // 2. Parse slugArr if direct parameters are missing
  if (slugArr.length > 0) {
    const decodedSlugs = slugArr
      .map((s) => decodeURIComponent(s).replace(/-/g, " ").trim())
      .filter(Boolean)
      .filter((s) => !/^L\d+$/i.test(s)); // Filter out menu levels like "L7", "L1"

    if (!filters.gender && !filters.category && !filters.collection && !filters.brand && !filters.sub_category) {
      if (decodedSlugs.length >= 2) {
        filters.collection = decodedSlugs[0];
        filters.category = decodedSlugs[1];
      } else if (decodedSlugs.length === 1) {
        filters.category = decodedSlugs[0];
      }
    }
  }
console.log(filters , "filtersfiltersfilters")
  return filters;
}

export async function generateMetadata({ params, searchParams }) {
  try {
    const [storeInit, headerList, awaitedParams, awaitedSearchParams] = await Promise.all([
      getStoreInit().catch(() => ({})),
      headers().catch(() => null),
      params,
      searchParams
    ]);

    const meta = await getDynamicMetadata({ 
      params: awaitedParams, 
      searchParams: awaitedSearchParams, 
      storeInit 
    });


    if (headerList) {
      const host = headerList.get("host");
      const protocol = headerList.get("x-forwarded-proto") || "https";
      const pathname = headerList.get("x-invoke-path") || headerList.get("next-url") || "";
      if (host) {
        const baseUrl = `${protocol}://${host}`;
        meta.alternates = {
          canonical: getCanonicalUrl(baseUrl, pathname),
        };
      }
    }

    return meta;
  } catch (error) {
    console.error("Error generating metadata in product page:", error);
    return {
      title: "Jewelry Products",
      description: "Browse our collection of jewelry products.",
    };
  } 
}

export default async function Page({ params, searchParams }) {
  try {
    const theme = await getActiveTheme().catch(() => "default");
    const themeData = themeMap[theme] || themeMap["default"];

    let Product;
    try {
      Product = await resolveProductList(themeData.page);
      
    } catch (e) {
      console.error("Failed to load theme-specific product page:", e);
      return <div style={{ padding: "50px", textAlign: "center" }}>Unable to load product list. Please try again later.</div>;
    }

    const [storeInit, awaitedParams, awaitedSearchParams, headerList] = await Promise.all([
      getStoreInit().catch(() => ({})),
      params || {},
      searchParams || {},
      headers().catch(() => null)
    ]);

    let baseUrl = "";
    if (headerList) {
      const host = headerList.get("host");
      const protocol = headerList.get("x-forwarded-proto") || "https";
      if (host) baseUrl = `${protocol}://${host}`;
    }

    const slugArr = awaitedParams?.slug || [];
    let finalTitle = "Jewelry Products";
    if (slugArr.length > 0) {
      try {
        finalTitle = slugArr.map(s => decodeURIComponent(s)).join(" ");
      } catch (_) { }
    }

    // Direct Server-Side SQLite Resolution for instant SSR
    const targetDomain = storeInit?.domain || (headerList ? headerList.get("host") : null) || "default";
    const ssrFilters = extractSsrFilters(slugArr, awaitedSearchParams);
    const menuIdent = slugArr.length > 0 ? slugArr.map(s => decodeURIComponent(s)).join("/") : "default";

    const pageNo = Number(awaitedSearchParams?.page || awaitedSearchParams?.PageNo || 1);
    const pageSize = Number(storeInit?.PageSize || 10);

    const sqliteRes = await getSqliteProducts(
      ssrFilters,
      { page: pageNo, pageSize: pageSize },
      targetDomain
    ).catch(() => null);

    const collectionJsonLd = generateCollectionJsonLd(finalTitle);
    const webSiteJsonLd = generateWebSiteJsonLd(baseUrl);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        />
        {webSiteJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
          />
        )}
        <Product
          params={awaitedParams}
          searchParams={awaitedSearchParams}
          initialData={sqliteRes?.success ? sqliteRes : null}
          initialFilterData={[]}
        />
      </>
    );
  } catch (err) {
    console.error("CRITICAL Page error:", err);
    return <div style={{ padding: "50px", textAlign: "center" }}>An unexpected error occurred.</div>;
  }
}
