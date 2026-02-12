import { WEBSITE_NAME, WEBSITE_URL, NEXT_APP_WEB } from "@/app/(core)/utils/env";


export function getValidUrl(website) {
    if (!website) return undefined;
    try {
        return new URL(website);
    } catch {
        try {
            return new URL(`https://${website}`);
        } catch {
            return undefined;
        }
    }
}


export function generatePageMetadata(pageData) {
    if (!pageData) return {};
    const baseMetadata = {
        title: `${pageData.title} | ${pageData.websiteName}`,
        description: pageData.description || "",
        keywords: pageData.keywords || "",
        authors: [{ name: pageData.ufcc }],
        alternates: { canonical: getValidUrl(pageData?.websiteName) },
        metadataBase: getValidUrl(pageData?.websiteName),
        icons: {
            icon: pageData.icons?.icon || [
                { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
            ],
            apple: pageData.icons?.apple || "/favicon.ico",
            shortcut: pageData.icons?.shortcut || "/favicon.ico",
        },
        publisher: NEXT_APP_WEB,
        websiteName: getValidUrl(pageData.websiteName),
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
            title: `${pageData.title} | ${pageData.websiteName}`,
            description: pageData.description || "",
            url: getValidUrl(pageData.websiteName),
            siteName: pageData.websiteName,
            type: "website",
            locale: "en_IN",
            images:
                [
                    {
                        url: '/MetaShareImage.jpg',
                        width: 1200,
                        height: 630,
                        alt: `${pageData.title} - ${pageData.websiteName}`,
                    },
                ]
        },
        twitter: {
            card: "summary_large_image",
            title: `${pageData.title} | ${pageData.websiteName}`,
            description: pageData.description || "",
            images: '/MetaShareImage.jpg' ? ['/MetaShareImage.jpg'] : [],
            creator: NEXT_APP_WEB,
        },
        additionalScripts: [],
    };

    return baseMetadata;
}
