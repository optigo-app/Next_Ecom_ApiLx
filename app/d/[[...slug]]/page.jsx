import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { headers } from "next/headers";
import { resolveProductDetail } from "@/app/(core)/utils/ThemeRouteResolver";
import {
  encodeProductDetailParam,
  formatProductDetailSlug,
  getProductByDetailSlug,
} from "@/app/(core)/utils/seo/productSitemap";
import {
  getDynamicMetadata,
  generateProductJsonLd,
  generateWebSiteJsonLd,
  getCanonicalUrl,
  generateBreadcrumbJsonLd
} from "@/app/(core)/utils/seo/seo-utils";

function getProductSlug(params) {
  return (params?.slug || []).map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  }).join("/");
}

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

    const slug = getProductSlug(awaitedParams);
    const product = !awaitedSearchParams?.p
      ? await getProductByDetailSlug(slug).catch(() => null)
      : null;
    if (product) {
      meta.title = product.TitleLine || product.designno || meta.title;
      meta.description = product.description || `Explore ${product.TitleLine || product.designno}.`;
    }

    if (headerList) {
      const host = headerList.get("host");
      const protocol = headerList.get("x-forwarded-proto") || "https";
      const pathname = headerList.get("x-invoke-path") || headerList.get("next-url") || "";
      if (host) {
        const baseUrl = `${protocol}://${host}`;
        const canonicalPath = product
          ? `/d/${encodeURIComponent(formatProductDetailSlug(product))}`
          : pathname;
        meta.alternates = { canonical: getCanonicalUrl(baseUrl, canonicalPath) };
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

    const DetailPage = await resolveProductDetail(themeData.page);

    const [awaitedParams, incomingSearchParams, headerList] = await Promise.all([
      params || {},
      searchParams || {},
      headers().catch(() => null)
    ]);
    let awaitedSearchParams = incomingSearchParams;

    // Sitemap and shared product URLs are clean paths. Build the compact data
    // payload internally so the same detail page can render without `?p=`.
    if (!incomingSearchParams?.p) {
      const slug = getProductSlug(awaitedParams);
      const product = await getProductByDetailSlug(slug).catch(() => null);
      if (product) {
        awaitedSearchParams = {
          ...incomingSearchParams,
          p: encodeProductDetailParam(product),
        };
      }
    }

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

    let productJsonLd = null;
    try {
      const jsonLdProduct = await getProductByDetailSlug(getProductSlug(awaitedParams));
      if (jsonLdProduct) {
        const storeInit = await getStoreInit().catch(() => ({}));
        productJsonLd = generateProductJsonLd({
          product: jsonLdProduct,
          storeInit,
          baseUrl,
          url: `${baseUrl}/d/${encodeURIComponent(formatProductDetailSlug(jsonLdProduct))}`,
        });
      }
    } catch (_) { }

    return (
      <>
        {productJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
        )}
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
