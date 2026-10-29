export const STORE_INIT_FLAGS = Object.freeze({
  ecomOtpVerification: "IsEcomOtpVerification",
  webMobileLoginOff: "IsWebMobileLoginOff",
  solitaireWebsite: "IsSolitaireWebsite",
  signUpWithCompanyInfo: "IsSignUpWithCompanyInfo",
  staticMenu: "IsStaticMenu",
  multiVariantCart: "IsMultiVariantCart",
  remarkOnProductDetail: "IsRemarkOnProductDetail",
  customOrder: "IsCustomOrder",
  priceShow: "IsPriceShow",
  b2bWebsite: "IsB2BWebsite",
  homeBestSeller: "IsHomeBestSeller",
  homeNewArrival: "IsHomeNewArrival",
  homeTrending: "IsHomeTrending",
});

/**
 * Read numeric StoreInit flags consistently in Server and Client Components.
 * Store APIs may return the enabled value as either 1 or "1".
 */
export function isStoreInitFlagEnabled(storeInit, flagName) {
  const storeInitProperty = STORE_INIT_FLAGS[flagName] || flagName;
  return Number(storeInit?.[storeInitProperty]) === 1;
}

/** The site's IsPriceShow flag is configured to suppress prices when set to 1. */
export function isPriceHidden(storeInitOrFlag) {
  if (storeInitOrFlag && typeof storeInitOrFlag === "object") {
    return isStoreInitFlagEnabled(storeInitOrFlag, "priceShow");
  }

  return Number(storeInitOrFlag) === 1;
}

const HOME_SECTION_FLAGS = {
  bestSeller: "homeBestSeller",
  newArrival: "homeNewArrival",
  trending: "homeTrending",
};

/** Check whether a homepage section is enabled by StoreInit. */
export function isHomeSectionEnabled(storeInit, section) {
  const flagName = HOME_SECTION_FLAGS[section];
  return flagName ? isStoreInitFlagEnabled(storeInit, flagName) : false;
}

/** Read the StoreInit product page size with a safe positive fallback. */
export function getStorePageSize(storeInit, fallback = 10) {
  const pageSize = Number(storeInit?.PageSize);
  return Number.isFinite(pageSize) && pageSize > 0
    ? Math.max(1, Math.floor(pageSize))
    : fallback;
}
