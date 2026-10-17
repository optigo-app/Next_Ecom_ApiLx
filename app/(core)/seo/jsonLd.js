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
export function generateProductJsonLd({ product, storeInit, baseUrl }) {
  if (!product) return null;

  const imageUrl = product.ImageP_Path || product.MediumImagePath || "";
  const currency = storeInit?.CurrencyCode || "USD";
  const price = product.UnitCostWithMarkUp || product.UnitCost || 0;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.TitleLine || product.DesignNo,
    image: [imageUrl],
    description: product.Description || product.TitleLine || "High-quality jewelry",
    sku: product.DesignNo,
    brand: {
      "@type": "Brand",
      name: storeInit?.BrowserTitle || "Jewelry Store",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/d/${product.TitleLine?.replace(/\s+/g, "-")}/${product.autocode}`,
      priceCurrency: currency,
      price: price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
