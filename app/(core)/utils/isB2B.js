import { isStoreInitFlagEnabled } from "@/app/(core)/utils/storeFlags";

/**
 * Resolve the site's B2B mode from StoreInit.
 * This pure helper is safe to import in both Server and Client Components.
 */
export function isB2BWebsite(storeInit) {
  return isStoreInitFlagEnabled(storeInit, "b2bWebsite");
}
