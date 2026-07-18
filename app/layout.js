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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata() {
  const storeInit = await getStoreInit();
  const { siteName, siteUrl } = await getSiteDetails(storeInit);

  return generatePageMetadata(
    {
      metadataBase: new URL(siteUrl),
      title: ActiveMeta?.metaData?.title || storeInit?.ufcc,
      description: ActiveMeta?.metaData?.description,
      keywords: ActiveMeta?.metaData?.keywords,
      ogImage: ActiveMeta?.metaData?.ogImage || storeInit?.ogImage,
      ufcc: storeInit?.ufcc,
      websiteName: storeInit?.BrowserTitle,
      siteName: siteName,
      siteUrl: siteUrl,
      icons: {
        icon: ActiveMeta.ico,
        shortcut: ActiveMeta.ico,
        apple: ActiveMeta.ico,
      },
    },
    isOmJiyansh,
  );
}

export default async function RootLayout({ children }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Layout = (await import(`@/app/theme/${themeData.page}/layout.jsx`))
    .default;
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
      <BroadcasterProvider>
        <EmotionRegistry>
          <body className={`${defaultFont.variable}`} style={{ '--font-default': `var(${defaultFontVariable})` }}>
            <MasterProvider
              getCompanyInfoData={companyInfo}
              getStoreInit={storeInit}
              getMyAccountFlags={myAccountFlags}
            >
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
