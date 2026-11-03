import { getWebsiteColorConfig } from "../../utils/sqlite/websiteColorConfig.js";
import { normalizeWebThemeColor } from "./normalizeWebThemeColor.js";

/**
 * Server-side helper function to fetch and normalize Website Theme & Color configuration.
 * Can be used in Next.js Server Components, Server Actions, Route Handlers, Root Layouts, and Metadata.
 *
 * @param {object} [options={}]
 * @param {string} [options.domain] - Optional tenant domain override
 * @param {number|string} [options.store_id] - Optional store_id filter
 * @returns {Promise<{
 *   success: boolean,
 *   isError: boolean,
 *   error: string|null,
 *   domain: string,
 *   source: string,
 *   raw: object,
 *   primaryThemeColor: string|null,
 *   primaryThemeBg: string|null,
 *   stickyHeaderBg: string|null,
 *   btnMainBg: string|null,
 *   btnMainText: string|null,
 *   btnMainBorder: string|null,
 *   btnProductBg: string|null,
 *   btnProductText: string|null,
 *   btnProductBorder: string|null,
 *   btnProductBorderRadius: string|null,
 *   btnRemoveCartBg: string|null,
 *   btnRemoveCartText: string|null,
 *   btnRemoveCartBorder: string|null,
 *   btnRemoveCartBorderRadius: string|null,
 *   iconColor: string|null,
 *   iconRemoveColor: string|null,
 *   cssVariables: Record<string, string>
 * }>}
 */
export async function getWebThemeColor(options = {}) {
  try {
    const result = await getWebsiteColorConfig(options);

    if (!result || !result.success) {
      const errorMessage = result?.error || "Failed to retrieve website color configuration.";
      const emptyNormalized = normalizeWebThemeColor({});
      return {
        success: false,
        isError: true,
        error: errorMessage,
        domain: result?.domain || options.domain || "default",
        source: result?.source || "error",
        ...emptyNormalized,
      };
    }

    const normalized = normalizeWebThemeColor(result.data);

    return {
      success: true,
      isError: false,
      error: null,
      domain: result.domain,
      source: result.source,
      ...normalized,
    };
  } catch (err) {
    const emptyNormalized = normalizeWebThemeColor({});
    return {
      success: false,
      isError: true,
      error: err?.message || "Unexpected error while fetching website color data on server.",
      domain: options.domain || "default",
      source: "exception",
      ...emptyNormalized,
    };
  }
}

export default getWebThemeColor;
