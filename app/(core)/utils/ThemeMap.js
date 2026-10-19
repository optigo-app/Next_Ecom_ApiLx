import { LocalSetup } from "@/app/env";

/**
 * ==========================================================================================
 * DOMAIN TO THEME LAYOUT ROUTE MAP
 * - Live domains route automatically to their designated theme layouts.
 * - Localhost and 127.0.0.1 dynamically route to LocalSetup (from config/theme.config.js).
 * ==========================================================================================
 */
export const themeMap = {
  // Live Domain Mappings
  "beluxjewel.web": { page: "beluxjewel.web" },
  "nxtsonasons.web": { page: "fgstore.web" },
  "nxtmobileapp.web": { page: "fgstore.mapp" },
  "procatalog.web": { page: "procatalog.web" },
  "nxtelvee.web": { page: "elvee.web" },
  "nxthoq.web": { page: "hoq.web" },
  "nxtdiamondtine.web": { page: "diamondtine.web" },
  "nxtjulian.web": { page: "julian.web" },
  "nxtjulian4.web": { page: "julian4.web" },
  "nxtmalakanJwewls.web": { page: "elvee.web" },
  "omjiyanshjewels.com": { page: "fgstore.web" },
  "shreediamond.optigoapps.com": { page: "fgstore.mapp" },
  "elior.optigoapps.com": { page: "fgstore.mapp" },
  "sonasons.procatalog.in": { page: "beluxjewel.web" },

  // Optigo Subdomain Mappings
  "nxt04.optigoapps.com": { page: "hoq.web" },
  "nxt08.optigoapps.com": { page: "procatalog.web" },
  "nxt09.optigoapps.com": { page: "fgstore.mapp" },
  "nxt10.optigoapps.com": { page: "beluxjewel.web" },
  "nxt11.optigoapps.com": { page: "beluxjewel.web" },
  "nxt14.optigoapps.com": { page: "fgstore.mapp" },
  "nxt29.optigoapps.com": { page: "fgstore.web" },
  "sonasons.optigoapps.com": { page: "beluxjewel.web" },
  "appsonasons.optigoapps.com": { page: "fgstore.mapp" },
  "1sonasons.optigoapps.com": { page: "hoq.web" },
  "1sonasonslite.optigoapps.com": { page: "julian.web" },
  "2sonasons.optigoapps.com": { page: "elvee.web" },

  // Local Development Defaults (Automated from config/theme.config.js)
  localhost: { page: LocalSetup || "beluxjewel.web" },
  "127.0.0.1": { page: LocalSetup || "beluxjewel.web" },
  default: { page: LocalSetup || "beluxjewel.web" },
};
