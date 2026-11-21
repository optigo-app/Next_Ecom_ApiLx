import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "@/app/(core)/seo";
import {
  formatProductDetailSlug,
  getProductSitemapCount,
  getProductSitemapRows,
  PRODUCT_SITEMAP_PAGE_SIZE,
} from "@/app/(core)/utils/seo/productSitemap";

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
  const totalProducts = await getProductSitemapCount();
  const sitemapCount = Math.max(1, Math.ceil(totalProducts / PRODUCT_SITEMAP_PAGE_SIZE));
  return Array.from({ length: sitemapCount }, (_, id) => ({ id }));
}

export default async function productSitemap({ id }) {
  const pageIndex = Number(await id);
  if (!Number.isInteger(pageIndex) || pageIndex < 0) return [];

  const [storeInit, rows] = await Promise.all([
    getStoreInit().catch(() => ({})),
    getProductSitemapRows(pageIndex),
  ]);
  const { siteUrl } = await getSiteDetails(storeInit);
  const baseUrl = String(siteUrl || "").replace(/\/+$/, "");

  return rows
    .filter((product) => product?.designno)
    .map((product) => {
      const slug = formatProductDetailSlug(product);
      const parsedLastModified = product.lastModified
        ? new Date(product.lastModified)
        : null;

      return {
        url: `${baseUrl}/d/${encodeURIComponent(slug)}`,
        ...(parsedLastModified && !Number.isNaN(parsedLastModified.getTime())
          ? { lastModified: parsedLastModified }
          : {}),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
}
