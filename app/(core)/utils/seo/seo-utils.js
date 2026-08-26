import { ParseAndDecodeSearchParams } from "../GlobalFunctions/Parser";
import { generatePageMetadata } from "../HeadMeta";
import { AppConfig } from "../../constants/AppConfig";
import { activeBrand } from "@/app/env";
import pako from 'pako';

/**
 * Generates dynamic SEO metadata based on URL params and search parameters.
 * Designed to be "bulletproof" with internal try-catch blocks.
 */

// export const decodeAndDecompress = (encodedString) => {
//     try {
//         if (!encodedString) return null;
        
        
//         const base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
//         const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        
//         console.log("TCL: decodeAndDecompress -> padded", padded)
//         const binaryString = atob(padded);
//         const uint8Array = new Uint8Array(binaryString.length);
//         for (let i = 0; i < binaryString.length; i++) {
//             uint8Array[i] = binaryString.charCodeAt(i);
//         }
//         const decompressed = Pako.inflate(uint8Array, { to: 'string' });
//         return JSON.parse(decompressed);
//     } catch (error) {
//         console.error("SEO Utils: Decompression error:", error);
//         return null;
//     }
// };
export const decodeAndDecompress = (encodedString) => {
    try {
        if (!encodedString) return null;

        let str = encodedString;
        if (typeof str === "string" && str.includes("%")) {
            try {
                str = decodeURIComponent(str);
            } catch (e) {}
        }
        
        // 1. Sanitize common URL transmission corruptions
        // Replaces spaces back to '+' (in case URL decoding converted them)
        let sanitized = str.replace(/ /g, '+');
        
        // Convert URL-safe characters to standard Base64 characters
        sanitized = sanitized.replace(/-/g, '+').replace(/_/g, '/');
        
        // 2. Decode to a binary buffer
        const buffer = Buffer.from(sanitized, 'base64');
        
        // 3. Decompress the binary data
        const decompressedUint8 = pako.inflate(buffer);
        
        // 4. Convert back to string and parse JSON
        const decompressedString = new TextDecoder().decode(decompressedUint8);
        return JSON.parse(decompressedString);
    } catch (error) {
        console.error("SEO Utils: Decompression error:", error.message || error);
        return null;
    }
};



export async function getDynamicMetadata({ params, searchParams, storeInit, defaultTitle = "Jewelry Products" }) {
    try {
        const p = await (params || {});
        const sp = await (searchParams || {});

        const ActiveFavicon = AppConfig[p?.brand || activeBrand]?.ico || "/favicon.ico";

        const slugArr = p?.slug || [];
        let dynamicTitle = "";
        if (slugArr.length > 0) {
            try {
                dynamicTitle = slugArr.map(s => decodeURIComponent(s)).join(" ");
            } catch (e) {
                console.error("SEO Utils: Slug decode error:", e);
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
                    const categories = mainPart.split(",").filter(c => c && c.toLowerCase() !== "null");
                    if (categories.length > 0 && dynamicTitle.length < 5) {
                        dynamicTitle = categories.join(" ");
                    }
                }
            } catch (e) {
                console.error("SEO Utils: M Metadata decode error:", e);
            }
        }

        // Process N= (New Arrivals)
        if (nEntry) {
            try {
                const encodedPart = nEntry.split("=")[1];
                if (encodedPart) {
                    const decodedVal = atob(encodedPart);
                    if (decodedVal && dynamicTitle.length < 5) {
                        // Insert space before capital letters for better readability (e.g., NewArrival -> New Arrival)
                        dynamicTitle = decodedVal.replace(/([A-Z])/g, ' $1').trim();
                    }
                }
            } catch (e) {
                console.error("SEO Utils: N Metadata decode error:", e);
            }
        }

        // Process C= (Collections)
        if (cEntry) {
            try {
                const encodedPart = cEntry.split("=")[1];
                if (encodedPart) {
                    const decodedVal = atob(encodedPart);
                    if (decodedVal && dynamicTitle.length < 5) {
                        dynamicTitle = decodedVal.replace(/([A-Z])/g, ' $1').trim();
                    }
                }
            } catch (e) {
                console.error("SEO Utils: C Metadata decode error:", e);
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
        console.error("SEO Utils: getDynamicMetadata error:", err);
        return { title: `${defaultTitle} | Jewelry Store` };
    }
}

/**
 * Generates ItemList (Collection) JSON-LD schema
 */
export function generateCollectionJsonLd(title, description = "") {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description || `Browse our exclusive collection of ${title}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": []
        }
    };
}

/**
 * Generates WebSite SearchBox JSON-LD schema
 */
export function generateWebSiteJsonLd(baseUrl) {
    if (!baseUrl) return null;
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": baseUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/p?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}

/**
 * Generates BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbJsonLd(breadcrumbs) {
    if (!Array.isArray(breadcrumbs)) return null;
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": breadcrumb.name,
            "item": breadcrumb.url,
        })),
    };
}

/**
 * Generates Product JSON-LD schema for rich search results (Price, Rating, Availability)
 */
export function generateProductJsonLd({ product, storeInit, baseUrl }) {
    if (!product) return null;

    const imageUrl = product.ImageP_Path || product.MediumImagePath || "";
    const currency = storeInit?.CurrencyCode || "USD";
    const price = product.UnitCostWithMarkUp || product.UnitCost || 0;

    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.TitleLine || product.DesignNo,
        "image": [imageUrl],
        "description": product.Description || product.TitleLine || "High-quality jewelry",
        "sku": product.DesignNo,
        "brand": {
            "@type": "Brand",
            "name": storeInit?.BrowserTitle || "Jewelry Store"
        },
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/d/${product.TitleLine?.replace(/\s+/g, "-")}/${product.autocode}`,
            "priceCurrency": currency,
            "price": price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };
}

/**
 * Generates a clean Canonical URL by stripping query parameters
 */
export function getCanonicalUrl(baseUrl, pathname) {
    if (!baseUrl || !pathname) return null;
    // Remove trailing slash and query params for a clean canonical
    const cleanPath = pathname.split('?')[0].replace(/\/$/, "");
    return `${baseUrl}${cleanPath}`;
}
