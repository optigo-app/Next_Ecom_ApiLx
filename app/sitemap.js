import { getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "./(core)/seo";

export default async function sitemap() {
  let siteUrl = "https://beluxjewel.web";
  try {
    const storeInit = await getStoreInit();
    const details = await getSiteDetails(storeInit);
    if (details?.siteUrl) siteUrl = details.siteUrl;
  } catch { }

  const now = new Date().toISOString();

  const staticRoutes = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/collection`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/Lookbook`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/offers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  return staticRoutes;
}
