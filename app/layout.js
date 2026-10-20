import "./globals.css";
import { activeBrand } from "@/app/env";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import {
  getCompanyInfoData,
  getMyAccountFlags,
  getStoreInit,
  GetUserLoginCookie,
  GetVistitorId,
} from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getActiveTheme } from "./(core)/lib/getActiveTheme";
import { StoreProvider } from "./(core)/contexts/StoreProvider";
import { themeMap } from "./(core)/utils/ThemeMap";
import { AuthProvider } from "./(core)/contexts/AuthProvider";
import { EmotionRegistry } from "./(core)/contexts/EmotionRegistry";
import { defaultFont, defaultFontVariable } from "./(core)/assets/FontSetup";
import { BroadcasterProvider } from "@/app/(core)/contexts/BoardCastContext";
import { isOmJiyansh, ActiveMeta, getSiteDetails } from "./(core)/seo";
import { resolveLayout } from "./(core)/utils/ThemeRouteResolver";
import { getGroupedWebsiteConfig } from "@/app/(core)/utils/sqlite/websiteContentConfig";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata() {
  const storeInit = await getStoreInit();
  const { siteName, siteUrl } = await getSiteDetails(storeInit);
  const configRes = await getGroupedWebsiteConfig();
  const content = configRes?.data?.branding[0]?.ContentJson || {};
  const metaData =configRes?.data?.seo[0]?.ContentJson || {};


  return generatePageMetadata(
    {
      metadataBase: new URL(siteUrl),
      title: (content?.identity?.brandName && content?.identity?.brandTagline)
      ? `${content.identity.brandName} | ${content.identity.brandTagline}`
      : ActiveMeta?.metaData?.title || storeInit?.ufcc || '',
      description: ActiveMeta?.metaData?.description,
      keywords: ActiveMeta?.metaData?.keywords,
      ogImage: ActiveMeta?.metaData?.ogImage || storeInit?.ogImage,
      ufcc: storeInit?.ufcc,
      websiteName: storeInit?.BrowserTitle,
      siteName: siteName,
      siteUrl: siteUrl,
      icons: {
        icon: content?.logo?.faviconUrl || ActiveMeta.ico,
        shortcut: content?.logo?.faviconUrl || ActiveMeta.ico,
        apple: content?.logo?.faviconUrl || ActiveMeta.ico,
      },
    },
    isOmJiyansh,
    metaData,
  );
}

export default async function RootLayout({ children }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Layout = await resolveLayout(themeData?.page);
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getStoreInit();
  const myAccountFlags = await getMyAccountFlags();
  const VistitorId = await GetVistitorId();
  const UserLoginCookie = await GetUserLoginCookie();

  const { siteName, siteUrl } = await getSiteDetails(storeInit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };


  return (
    <html lang="en" data-brand={activeBrand}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <EmotionRegistry>
        <body className={`${defaultFont.variable}`} style={{ '--font-default': `var(${defaultFontVariable})` }}>
          <MasterProvider
            getCompanyInfoData={companyInfo}
            getStoreInit={storeInit}
            getMyAccountFlags={myAccountFlags}
            theme={themeData?.page}
          >
            <StoreProvider storeInit={storeInit}>
              <BroadcasterProvider>
                <AuthProvider theme={themeData?.page} storeInit={storeInit}>
                  <Layout>{children}</Layout>
                  {/* <JewelrySnackbar /> */}
                </AuthProvider>
              </BroadcasterProvider>
            </StoreProvider>
          </MasterProvider>
        </body>
      </EmotionRegistry>
    </html>
  );
}
