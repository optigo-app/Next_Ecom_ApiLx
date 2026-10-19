/**
 * ====================================================================================================
 * CENTRAL SEO MODULE (SINGLE SOURCE OF TRUTH FOR ALL SEO UTILITIES)
 * ====================================================================================================
 * Consolidated utilities for:
 * 1. URL validation, canonical URLs, and data decompression
 * 2. Structured Data / JSON-LD schemas (Product, Collection, Breadcrumb, WebSite)
 * 3. Page Metadata generation (OpenGraph, Twitter, Robots, Favicons)
 */

// 1. URL & Payload Utilities
export {
  getValidUrl,
  getCanonicalUrl,
  decodeAndDecompress,
} from "./urlUtils.js";

// 2. Structured Data / JSON-LD Schemas
export {
  generateCollectionJsonLd,
  generateWebSiteJsonLd,
  generateBreadcrumbJsonLd,
  generateProductJsonLd,
} from "./jsonLd.js";

// 3. Metadata Generators & Constants
export {
  ActiveMeta,
  isOmJiyansh,
  getSiteDetails,
  generatePageMetadata,
  getDynamicMetadata,
} from "./metadata.js";
