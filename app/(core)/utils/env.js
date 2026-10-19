import { ACTIVE_THEME, THEMES } from "../../../config/theme.config.js";

export const WEBSITE_URL = "https://test.procatalog.in";
export const IsProcatalogDemo = false;

/**
 * ==========================================================================================
 * CENTRAL CONFIG RE-EXPORTS (FOR 100% BACKWARD COMPATIBILITY)
 * All values are automatically derived from config/theme.config.js.
 * To change the local theme, edit config/theme.config.js.
 * ==========================================================================================
 */
export { ACTIVE_THEME, THEMES as THEME_PRESETS };

export const NEXT_APP_WEB = ACTIVE_THEME?.domain;
export const WEBSITE_NAME = ACTIVE_THEME?.websiteName;
export const NEXT_PUBLIC_SITE_URL = NEXT_APP_WEB;

/**
 * Preserved domain directory mappings
 */
export const WEBSITE_DOMAINS = {
  FGSTORE: "nxtsonasons.web",
  HOQ: "nxthoq.web",
  FGSTOREMAPP: "nxtmobileapp.web",
  NXT10: "nxt10.optigoapps.com",
  ELVEEWEB: "nxtelvee.web",
  DIAMONDINEWEB: "nxtdiamondtine.web",
  MALAKANJWEWLSWEB: "nxtmalakanJwewls.web",
  JULIANWEB: "nxtjulian.web",
  JULIAN4WEB: "nxtjulian4.web",
  BELUXJEWELWEB: "beluxjewel.web",
  PROCATALOG: "procatalog.web",
};
