import "./globals.css";
import { headers } from "next/headers";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import { getCompanyInfoData, getMyAccountFlags, getStoreInit, GetUserLoginCookie, GetVistitorId } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getActiveTheme } from "./(core)/lib/getActiveTheme";
import { StoreProvider } from "./(core)/contexts/StoreProvider";
import { themeMap } from "./(core)/utils/ThemeMap";
import { AuthProvider } from "./(core)/contexts/AuthProvider";
import { EmotionRegistry } from "./(core)/contexts/EmotionRegistry";
import { defaultFont } from "./(core)/assets/FontSetup";
import { AppConfig } from "./(core)/constants/AppConfig";
import { activeBrand } from "./env";
import JewelrySnackbar from "./components/ui/Snackbar";
import { BroadcasterProvider } from "@/app/(core)/contexts/BoardCastContext";


const DEFAULT_JEWELRY_DESCRIPTION = "Discover timeless jewelry crafted with precision and elegance. Explore gold, diamond, and silver collections designed for everyday wear and special occasions, with trusted quality and exceptional craftsmanship.";
const DEFAULT_JEWELRY_KEYWORDS = "jewelry online, gold jewelry, diamond jewelry, silver jewelry, fine jewelry, bridal jewelry, earrings, rings, necklaces, bracelets, luxury jewelry, handcrafted jewelry";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


const ActiveFavicon = AppConfig[activeBrand].ico;

const isOmJiyansh = activeBrand === 'omjiyas';


export async function generateMetadata() {
  const storeInit = await getStoreInit();
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomain = host.split(".")[0] || "";
  const fallbackSiteName = subdomain && subdomain !== "localhost" && subdomain !== "www"
    ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1)
    : "Jewelry Store";

  let siteName = fallbackSiteName;
  if (storeInit) {
    if (storeInit.companyname && !storeInit.companyname.toLowerCase().includes("orail designs") && !storeInit.companyname.toLowerCase().includes("optigoapps")) {
      siteName = storeInit.companyname;
    } else if (storeInit.BrowserTitle && !storeInit.BrowserTitle.toLowerCase().includes("online jewellery store") && !storeInit.BrowserTitle.toLowerCase().includes("optigoapps")) {
      siteName = storeInit.BrowserTitle;
    } else if (storeInit.ufcc) {
      siteName = storeInit.ufcc.charAt(0).toUpperCase() + storeInit.ufcc.slice(1);
    }
  }

  const siteUrl = storeInit?.domain ? `https://${storeInit.domain}` : (host ? `https://${host}` : "https://elior.optigoapps.com");

  return generatePageMetadata({
    metadataBase: new URL(siteUrl),
    title: storeInit?.ufcc,
    description: DEFAULT_JEWELRY_DESCRIPTION,
    keywords: DEFAULT_JEWELRY_KEYWORDS,
    ogImage: storeInit?.ogImage,
    ufcc: storeInit?.ufcc,
    websiteName: storeInit?.BrowserTitle,
    siteName: siteName,
    siteUrl: siteUrl,
    icons: {
      icon: ActiveFavicon,
      shortcut: ActiveFavicon,
      apple: ActiveFavicon,
    },
  }, isOmJiyansh);
}

export default async function RootLayout({ children }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Layout = (await import(`@/app/theme/${themeData.page}/layout.jsx`)).default;
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getStoreInit();
  const myAccountFlags = await getMyAccountFlags();
  const VistitorId = await GetVistitorId();
  const UserLoginCookie = await GetUserLoginCookie();

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomain = host.split(".")[0] || "";
  const fallbackSiteName = subdomain && subdomain !== "localhost" && subdomain !== "www"
    ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1)
    : "Jewelry Store";

  let siteName = fallbackSiteName;
  if (storeInit) {
    if (storeInit.companyname && !storeInit.companyname.toLowerCase().includes("orail designs") && !storeInit.companyname.toLowerCase().includes("optigoapps")) {
      siteName = storeInit.companyname;
    } else if (storeInit.BrowserTitle && !storeInit.BrowserTitle.toLowerCase().includes("online jewellery store") && !storeInit.BrowserTitle.toLowerCase().includes("optigoapps")) {
      siteName = storeInit.BrowserTitle;
    } else if (storeInit.ufcc) {
      siteName = storeInit.ufcc.charAt(0).toUpperCase() + storeInit.ufcc.slice(1);
    }
  }

  const siteUrl = storeInit?.domain ? `https://${storeInit.domain}` : (host ? `https://${host}` : "https://elior.optigoapps.com");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <BroadcasterProvider>
        <EmotionRegistry>
          <body className={`${defaultFont.variable}`}>
            <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit} getMyAccountFlags={myAccountFlags}>
              <StoreProvider storeInit={storeInit}>
                <AuthProvider theme={themeData?.page} storeInit={storeInit}>
                  <Layout>{children}</Layout>
                  {/* <JewelrySnackbar /> */}
                </AuthProvider>
              </StoreProvider>
            </MasterProvider>
          </body>
        </EmotionRegistry>
      </BroadcasterProvider>
    </html>
  );
}
