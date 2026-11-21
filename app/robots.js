import { getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "./(core)/seo";
import { getProductSitemapCount, PRODUCT_SITEMAP_PAGE_SIZE } from "./(core)/utils/seo/productSitemap";

export const dynamic = "force-dynamic";

export default async function robots() {
  let siteUrl = "https://beluxjewel.web";
  try {
    const storeInit = await getStoreInit();
    const details = await getSiteDetails(storeInit);
    if (details?.siteUrl) siteUrl = details.siteUrl;
  } catch { }

  const productSitemapCount = await getProductSitemapCount().catch(() => 0);
  const productSitemapUrls = Array.from(
    { length: Math.ceil(productSitemapCount / PRODUCT_SITEMAP_PAGE_SIZE) },
    (_, id) => `${siteUrl.replace(/\/+$/, "")}/products/sitemap/${id}.xml`,
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cartPage/",
        "/account/",
        "/profile/",
        "/payment/",
        "/confirmation/",
        "/delivery/",
        "/push"
      ],
    },
    sitemap: [`${siteUrl.replace(/\/+$/, "")}/sitemap.xml`, ...productSitemapUrls],
  };
}
