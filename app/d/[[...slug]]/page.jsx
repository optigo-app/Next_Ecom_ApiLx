import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { headers } from "next/headers";
import {
  getDynamicMetadata,
  generateWebSiteJsonLd,
  getCanonicalUrl,
  generateBreadcrumbJsonLd
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
      storeInit,
      defaultTitle: "Jewelry Detail"
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
    console.error("Error generating metadata in detail page:", error);
    return {
      title: "Jewelry Detail",
      description: "View product details.",
    };
  }
}

export default async function Page({ params, searchParams }) {
  try {
    const theme = await getActiveTheme().catch(() => "default");
    const themeData = themeMap[theme] || themeMap["default"];

    const DetailPage = (await import(`@/app/theme/${themeData.page}/detail/page.jsx`)).default;

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
    let pageTitle = "Product Detail";
    if (slugArr.length > 0) {
      try {
        pageTitle = slugArr.map(s => decodeURIComponent(s)).join(" ").replace(/-/g, ' ');
      } catch (_) { }
    }

    const breadcrumbs = [
      { name: "Home", url: baseUrl },
      { name: "Products", url: `${baseUrl}/p` },
      { name: pageTitle, url: `${baseUrl}/d/${slugArr.join("/")}` }
    ];

    const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
    const webSiteJsonLd = generateWebSiteJsonLd(baseUrl);

    return (
      <>
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
        )}
        {webSiteJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
          />
        )}
        <DetailPage params={awaitedParams} searchParams={awaitedSearchParams} />
      </>
    );
  } catch (err) {
    console.error("CRITICAL Detail Page error:", err);
    return <div style={{ padding: "50px", textAlign: "center" }}>An unexpected error occurred.</div>;
  }
}
