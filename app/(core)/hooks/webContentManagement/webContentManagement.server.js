import { getGroupedWebsiteConfig } from "@/app/(core)/utils/sqlite/websiteContentConfig";
import { normalizeWebContent } from "./normalizeWebContent";

/**
 * Server-side helper function to fetch and normalize Website Content Management data.
 * Can be used in Next.js Server Components, Server Actions, Route Handlers, Layouts, and Metadata.
 *
 * NOTE: Robust error handling without silent fake fallbacks. If tenant DB or data is unavailable,
 * isError is set to true and the exact error is returned for proper error handling.
 *
 * @param {object} [options={}]
 * @param {string} [options.domain] - Optional tenant domain override
 * @param {boolean} [options.bypassCache=false] - Bypass memory and disk cache to query SQLite directly
 * @param {number} [options.ttlMs] - Cache expiration in milliseconds (default 1 hour)
 * @returns {Promise<{
 *   success: boolean,
 *   isError: boolean,
 *   error: string|null,
 *   domain: string,
 *   source: string,
 *   raw: object,
 *   categoryConfig: object|null,
 *   categories: Array,
 *   collectionConfig: object|null,
 *   collections: Array,
 *   branding: object|null,
 *   seo: object|null,
 *   banners: Array,
 *   bannersByType: object,
 *   bannerConfig: object|null,
 *   getBannersByType: (typeKey: string) => Array,
 *   themeSetting: object|null,
 *   pageTemplates: Array
 * }>}
 */
export async function getWebContentManagement(options = {}) {
  try {
    const result = await getGroupedWebsiteConfig(options);

    if (!result || !result.success) {
      const errorMessage = result?.error || "Failed to retrieve website content management configuration.";
      const emptyNormalized = normalizeWebContent({});
      return {
        success: false,
        isError: true,
        error: errorMessage,
        domain: result?.domain || options.domain || "default",
        source: result?.source || "error",
        ...emptyNormalized,
      };
    }

    const normalized = normalizeWebContent(result.data);

    return {
      success: true,
      isError: false,
      error: null,
      domain: result.domain,
      source: result.source,
      ...normalized,
    };
  } catch (err) {
    const emptyNormalized = normalizeWebContent({});
    return {
      success: false,
      isError: true,
      error: err?.message || "Unexpected error while fetching website content management data on server.",
      domain: options.domain || "default",
      source: "exception",
      ...emptyNormalized,
    };
  }
}
