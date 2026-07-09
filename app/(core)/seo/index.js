import { headers } from "next/headers";
import { activeBrand } from "@/app/env";
import { AppConfig } from "../constants/AppConfig";

export const DEFAULT_JEWELRY_DESCRIPTION =
  "Discover timeless jewelry crafted with precision and elegance. Explore gold, diamond, and silver collections designed for everyday wear and special occasions, with trusted quality and exceptional craftsmanship.";
export const DEFAULT_JEWELRY_KEYWORDS =
  "jewelry online, gold jewelry, diamond jewelry, silver jewelry, fine jewelry, bridal jewelry, earrings, rings, necklaces, bracelets, luxury jewelry, handcrafted jewelry";

export const ActiveFavicon = AppConfig[activeBrand].ico;

export const isOmJiyansh = activeBrand === "omjiyas";

export async function getSiteDetails(storeInit) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomain = host.split(".")[0] || "";
  const fallbackSiteName =
    subdomain && subdomain !== "localhost" && subdomain !== "www"
      ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1)
      : "Jewelry Store";

  let siteName = fallbackSiteName;
  if (storeInit) {
    if (
      storeInit.companyname &&
      !storeInit.companyname.toLowerCase().includes("orail designs") &&
      !storeInit.companyname.toLowerCase().includes("optigoapps")
    ) {
      siteName = storeInit.companyname;
    } else if (
      storeInit.BrowserTitle &&
      !storeInit.BrowserTitle.toLowerCase().includes(
        "online jewellery store",
      ) &&
      !storeInit.BrowserTitle.toLowerCase().includes("optigoapps")
    ) {
      siteName = storeInit.BrowserTitle;
    } else if (storeInit.ufcc) {
      siteName =
        storeInit.ufcc.charAt(0).toUpperCase() + storeInit.ufcc.slice(1);
    }
  }

  const siteUrl = storeInit?.domain
    ? `https://${storeInit.domain}`
    : host
      ? `https://${host}`
      : "https://elior.optigoapps.com";

  return { siteName, siteUrl };
}
