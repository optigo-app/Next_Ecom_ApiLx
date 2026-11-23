/**
 * Generates ItemList (Collection) JSON-LD schema for category/listing pages
 * @param {string} title
 * @param {string} [description=""]
 * @returns {object}
 */
export function generateCollectionJsonLd(title, description = "") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: description || `Browse our exclusive collection of ${title}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [],
    },
  };
}

/**
 * Generates WebSite SearchBox JSON-LD schema
 * @param {string} baseUrl
 * @returns {object|null}
 */
export function generateWebSiteJsonLd(baseUrl) {
  if (!baseUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/p?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates BreadcrumbList JSON-LD schema
 * @param {Array<{name: string, url: string}>} breadcrumbs
 * @returns {object|null}
 */
export function generateBreadcrumbJsonLd(breadcrumbs) {
  if (!Array.isArray(breadcrumbs)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

/**
 * Generates Product JSON-LD schema for rich search results (Price, Currency, Availability)
 * @param {object} options
 * @param {object} options.product
 * @param {object} options.storeInit
 * @param {string} options.baseUrl
 * @returns {object|null}
 */
export function generateProductJsonLd({ product, storeInit, baseUrl, url }) {
  if (!product?.designno) return null;

  const cdn = String(storeInit?.CDNDesignImageFol || "");
  const isPublicCdn = cdn.startsWith("https://") || (cdn.startsWith("http://") && !/^http:\/\/(nzen|localhost|127\.)/i.test(cdn));
  const image = isPublicCdn ? `${cdn}${product.designno}~1.${product.ImageExtension || "webp"}` : "";
  const title = product.TitleLine && String(product.TitleLine).toLowerCase() !== "null" ? product.TitleLine : "";
  const name = title || String(product.designno);
  const currency = storeInit?.CurrencyCode;
  const price = Number(product.UnitCostWithMarkUp) || 0;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description: product.description || product.Description || name,
    sku: String(product.designno),
    brand: {
      "@type": "Brand",
      name: storeInit?.BrowserTitle || storeInit?.companyname || "Jewelry Store",
    },
  };
  if (image) schema.image = [image];
  if (currency && price > 0) {
    schema.offers = {
      "@type": "Offer",
      url: url || baseUrl,
      priceCurrency: currency,
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  }
  return schema;
}
