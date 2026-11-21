import { getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "./(core)/seo";

export const dynamic = "force-dynamic";

export default async function robots() {
  let siteUrl = "https://beluxjewel.web";
  try {
    const storeInit = await getStoreInit();
    const details = await getSiteDetails(storeInit);
    if (details?.siteUrl) siteUrl = details.siteUrl;
  } catch { }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cartPage/",
        "/account/",
        "/profile/",
        "/payment/",
        "/confirmation/",
        "/delivery/",
        "/push"
      ],
    },
    sitemap: [`${siteUrl.replace(/\/+$/, "")}/api/sitemap`],
  };
}
