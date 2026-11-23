import { getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "./(core)/seo";
import { getActiveTheme } from "./(core)/lib/getActiveTheme";
import { themeMap } from "./(core)/utils/ThemeMap";
import { getStaticSitemapEntries, getListingSitemapEntries } from "./(core)/utils/seo/siteSitemap";
import { encodeProductDetailParam, formatProductDetailSlug, getProductSitemapRows } from "./(core)/utils/seo/productSitemap";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  let siteUrl = "https://beluxjewel.web";
  let storeInit = {};
  try {
    storeInit = (await getStoreInit()) || {};
    const details = await getSiteDetails(storeInit);
    if (details?.siteUrl) siteUrl = details.siteUrl;
  } catch { }

  siteUrl = siteUrl.replace(/\/+$/, "");

  const theme = await getActiveTheme().catch(() => null);
  const themePage = (themeMap[theme] || themeMap.default)?.page;

  const [staticEntries, listingEntries, products] = await Promise.all([
    getStaticSitemapEntries(siteUrl, themePage),
    getListingSitemapEntries(siteUrl, storeInit?.PackageId),
    getProductSitemapRows(0).catch(() => []),
  ]);

  const productEntries = products
    .filter((product) => product?.designno)
    .map((product) => {
      const date = product.lastModified ? new Date(product.lastModified) : null;
      return {
        url: `${siteUrl}/d/${encodeURIComponent(formatProductDetailSlug(product))}?p=${encodeURIComponent(encodeProductDetailParam(product))}`,
        lastModified: date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

  return [...staticEntries, ...listingEntries, ...productEntries];
}
