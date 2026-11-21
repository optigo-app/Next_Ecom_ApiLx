import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "@/app/(core)/seo";
import {
  getProductSitemapCount,
  PRODUCT_SITEMAP_PAGE_SIZE,
} from "@/app/(core)/utils/seo/productSitemap";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function xmlResponse(xml) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function GET() {
  const [storeInit, productCount] = await Promise.all([
    getStoreInit().catch(() => ({})),
    getProductSitemapCount(),
  ]);
  const { siteUrl } = await getSiteDetails(storeInit);
  const baseUrl = String(siteUrl || "").replace(/\/+$/, "");
  const pageCount = Math.max(1, Math.ceil(productCount / PRODUCT_SITEMAP_PAGE_SIZE));
  const sitemapUrls = [
    `${baseUrl}/sitemap.xml`,
    ...Array.from({ length: pageCount }, (_, page) =>
      `${baseUrl}/api/sitemap/products/${page}`,
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    sitemapUrls.map((url) => `<sitemap><loc>${escapeXml(url)}</loc></sitemap>`).join("") +
    `</sitemapindex>`;

  return xmlResponse(xml);
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}
