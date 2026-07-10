import { headers } from "next/headers";
import { activeBrand } from "@/app/env";
import { AppConfig } from "../constants/AppConfig";

 
export const ActiveMeta = AppConfig[activeBrand];

// export const ActiveDescription = AppConfig[activeBrand]?.metaData?.description;

// export const ActiveKeywords = AppConfig[activeBrand]?.metaData?.keywords;

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
