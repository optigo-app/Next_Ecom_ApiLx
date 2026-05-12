import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { headers } from "next/headers";
import {
  getDynamicMetadata,
  generateCollectionJsonLd,
  generateWebSiteJsonLd,
  getCanonicalUrl
} from "@/app/(core)/utils/seo/seo-utils";

export const dynamic = "force-dynamic";

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
      Product = (await import(`@/app/theme/${themeData.page}/product/page.jsx`)).default;
    } catch (e) {
      console.error("Failed to load theme-specific product page:", e);
      return <div style={{ padding: "50px", textAlign: "center" }}>Unable to load product list. Please try again later.</div>;
    }

    const [awaitedParams, awaitedSearchParams, headerList] = await Promise.all([
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
        <Product params={awaitedParams} searchParams={awaitedSearchParams} />
      </>
    );
  } catch (err) {
    console.error("CRITICAL Page error:", err);
    return <div style={{ padding: "50px", textAlign: "center" }}>An unexpected error occurred.</div>;
  }
}
