import { activeBrand } from "../../env.js";
import { AppConfig } from "../constants/AppConfig.js";
import { NEXT_APP_WEB } from "../utils/env.js";
import { ParseAndDecodeSearchParams } from "../utils/GlobalFunctions/Parser.js";
import { getValidUrl, decodeAndDecompress } from "./urlUtils.js";

export const ActiveMeta = AppConfig[activeBrand];
export const isOmJiyansh = activeBrand === "omjiyas";

/**
 * Resolves site title and canonical base URL from storeInit and request headers
 * @param {object} storeInit
 * @returns {Promise<{ siteName: string, siteUrl: string }>}
 */
export async function getSiteDetails(storeInit) {
  let host = "";
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    host = headersList.get("host") || "";
  } catch (_) { }

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
      !storeInit.BrowserTitle.toLowerCase().includes("online jewellery store") &&
      !storeInit.BrowserTitle.toLowerCase().includes("optigoapps")
    ) {
      siteName = storeInit.BrowserTitle;
    } else if (storeInit.ufcc) {
      siteName = storeInit.ufcc.charAt(0).toUpperCase() + storeInit.ufcc.slice(1);
    }
  }

  const siteUrl = storeInit?.domain
    ? `https://${storeInit.domain}`
    : host
      ? `https://${host}`
      : "https://elior.optigoapps.com";

  return { siteName, siteUrl };
}

/**
 * Standard Next.js Metadata generator for layout and pages
 * @param {object} pageData
 * @param {boolean} [isOmJiyanshFlag]
 * @returns {object}
 */
export async function generatePageMetadata(pageData, isOmJiyanshFlag = isOmJiyansh,metaData = {}) {
  if (!pageData) return {};

    
  const Title_Suffix = isOmJiyanshFlag ? pageData.websiteName : `${pageData.title} | ${pageData.websiteName}`;
  const resolvedSiteName = pageData.siteName || pageData.websiteName || "Jewelry Store";
  const resolvedSiteUrl = pageData.siteUrl || pageData.websiteName || "";

  return {
    title: pageData.title || metaData?.meta?.metaTitle || Title_Suffix,
    description: metaData?.meta?.metaDescription || pageData.description || "",
    keywords: metaData?.meta?.keywords || pageData.keywords || "",
    authors: metaData?.meta?.author || [{ name: pageData.ufcc }],
    alternates:  metaData?.meta?.canonicalUrl || { canonical: getValidUrl(resolvedSiteUrl) },
    metadataBase: metaData?.meta?.canonicalUrl || getValidUrl(resolvedSiteUrl),
    icons: {
      icon: pageData.icons?.icon || [
        { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
      ],
      apple: pageData.icons?.apple || "/favicon.ico",
      shortcut: pageData.icons?.shortcut || "/favicon.ico",
    },
    publisher: NEXT_APP_WEB,
    applicationName: resolvedSiteName,
    websiteName: getValidUrl(resolvedSiteUrl),
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: metaData?.og?.ogTitle || `${pageData.title} `,
      description: metaData?.og?.ogDescription || pageData.description || "",
      url: getValidUrl(resolvedSiteUrl),
      siteName: metaData?.og?.ogSiteName || resolvedSiteName,
      type: metaData?.og?.ogType || "website",
      locale: "en_IN",
      images: [
        {
          url: metaData?.og?.ogImage || pageData.ogImage || "/MetaShareImage.jpg",
          width: 1200,
          height: 630,
          alt: metaData?.og?.ogTitle || `${pageData.title} - ${pageData.websiteName}`,
        },
      ],
    },
    twitter: {
      card: metaData?.twitter?.cardType || "summary_large_image",
      title: metaData?.twitter?.twitterTitle || `${pageData.title} | ${pageData.websiteName}`,
      description: metaData?.twitter?.twitterDescription || pageData.description || "",
      images: metaData?.twitter?.twitterImage || [pageData.ogImage || "/MetaShareImage.jpg"],
      creator: NEXT_APP_WEB,
    },
    additionalScripts: [],
  };
}

/**
 * Dynamic metadata generator for product listing and detail routes
 * @param {object} options
 * @param {object} options.params
 * @param {object} options.searchParams
 * @param {object} options.storeInit
 * @param {string} [options.defaultTitle="Jewelry Products"]
 * @returns {Promise<object>}
 */
export async function getDynamicMetadata({ params, searchParams, storeInit, defaultTitle = "Jewelry Products" }) {
  try {
    const p = await (params || {});
    const sp = await (searchParams || {});

    const ActiveFavicon = AppConfig[p?.brand || activeBrand]?.ico || "/favicon.ico";

    const slugArr = p?.slug || [];
    let dynamicTitle = "";
    if (slugArr.length > 0) {
      try {
        dynamicTitle = slugArr.map((s) => decodeURIComponent(s)).join(" ");
      } catch (e) {
        console.error("SEO metadata: Slug decode error:", e);
      }
    }

    const decodedResult = ParseAndDecodeSearchParams(sp) || [];
    const mEntry = decodedResult.find((s) => typeof s === "string" && s.startsWith("M="));
    const nEntry = decodedResult.find((s) => typeof s === "string" && s.startsWith("N="));
    const cEntry = decodedResult.find((s) => typeof s === "string" && s.startsWith("C="));

    // Process M= (Menu/Categories)
    if (mEntry) {
      try {
        const encodedPart = mEntry.split("=")[1];
        if (encodedPart) {
          const decodedVal = atob(encodedPart);
          const mainPart = decodedVal.split("/")[0];
          const categories = mainPart.split(",").filter((c) => c && c.toLowerCase() !== "null");
          if (categories.length > 0 && dynamicTitle.length < 5) {
            dynamicTitle = categories.join(" ");
          }
        }
      } catch (e) {
        console.error("SEO metadata: M Metadata decode error:", e);
      }
    }

    // Process N= (New Arrivals)
    if (nEntry) {
      try {
        const encodedPart = nEntry.split("=")[1];
        if (encodedPart) {
          const decodedVal = atob(encodedPart);
          if (decodedVal && dynamicTitle.length < 5) {
            dynamicTitle = decodedVal.replace(/([A-Z])/g, " $1").trim();
          }
        }
      } catch (e) {
        console.error("SEO metadata: N Metadata decode error:", e);
      }
    }

    // Process C= (Collections)
    if (cEntry) {
      try {
        const encodedPart = cEntry.split("=")[1];
        if (encodedPart) {
          const decodedVal = atob(encodedPart);
          if (decodedVal && dynamicTitle.length < 5) {
            dynamicTitle = decodedVal.replace(/([A-Z])/g, " $1").trim();
          }
        }
      } catch (e) {
        console.error("SEO metadata: C Metadata decode error:", e);
      }
    }

    const finalTitle = dynamicTitle || defaultTitle;

    // Extract image from p param if available
    let ogImage = storeInit?.ogImage || "";
    if (sp?.p) {
      const decoded = decodeAndDecompress(sp.p);
      if (decoded?.img) {
        ogImage = decoded.img;
      }
    }

    return generatePageMetadata({
      title: finalTitle,
      websiteName: storeInit?.BrowserTitle || "Jewelry Store",
      description: `Explore our collection of ${finalTitle}. High-quality jewelry including rings, earrings, and more at the best prices.`,
      keywords: `${finalTitle}, jewelry, online store, diamond rings, gold jewelry`,
      ufcc: storeInit?.ufcc || "",
      ogImage: ogImage,
      icons: {
        icon: ActiveFavicon,
        shortcut: ActiveFavicon,
        apple: ActiveFavicon,
      },
    });
  } catch (err) {
    console.error("SEO metadata: getDynamicMetadata error:", err);
    return { title: `${defaultTitle} | Jewelry Store` };
  }
}
