import "./globals.css";
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

  return generatePageMetadata({
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    title: storeInit?.ufcc,
    description: DEFAULT_JEWELRY_DESCRIPTION,
    keywords: DEFAULT_JEWELRY_KEYWORDS,
    ogImage: storeInit?.ogImage,
    ufcc: storeInit?.ufcc,
    websiteName: storeInit?.BrowserTitle,
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

  return (
    <html lang="en">
      <EmotionRegistry>
        <body className={`${defaultFont.variable}`}>
          <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit} getMyAccountFlags={myAccountFlags}>
            <StoreProvider storeInit={storeInit}>
              <AuthProvider theme={themeData?.page} storeInit={storeInit}>
                <Layout>{children}</Layout>
                <JewelrySnackbar />
              </AuthProvider>
            </StoreProvider>
          </MasterProvider>
        </body>
      </EmotionRegistry>
    </html>
  );
}
