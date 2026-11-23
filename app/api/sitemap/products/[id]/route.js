import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "@/app/(core)/seo";
import {
  encodeProductDetailParam,
  formatProductDetailSlug,
  getProductSitemapRows,
} from "@/app/(core)/utils/seo/productSitemap";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}

export async function GET(_request, { params }) {
  const { id } = await params;
  const pageIndex = Number(id);
  if (!Number.isInteger(pageIndex) || pageIndex < 0) {
    return new Response("Invalid sitemap page", { status: 400 });
  }

  const [storeInit, products] = await Promise.all([
    getStoreInit().catch(() => ({})),
    getProductSitemapRows(pageIndex),
  ]);
  const { siteUrl } = await getSiteDetails(storeInit);
  const baseUrl = String(siteUrl || "").replace(/\/+$/, "");
  const entries = products
    .filter((product) => product?.designno)
    .map((product) => {
      const url = `${baseUrl}/d/${encodeURIComponent(formatProductDetailSlug(product))}?p=${encodeURIComponent(encodeProductDetailParam(product))}`;
      const date = product.lastModified ? new Date(product.lastModified) : null;
      const lastModified = date && !Number.isNaN(date.getTime())
        ? `<lastmod>${date.toISOString()}</lastmod>`
        : "";
      return `<url><loc>${escapeXml(url)}</loc>${lastModified}<changefreq>weekly</changefreq><priority>0.7</priority></url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
