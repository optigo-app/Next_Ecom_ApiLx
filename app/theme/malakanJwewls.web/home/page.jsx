import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { isOldElvee } from "@/app/(core)/constants/ElveeFlag";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/MalakanJwewls/TopSection";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import BrandInfoMarquee from "./blocks/Marquee";
import CategoryBlock from "./blocks/Category";
import MaxBestSeller from "./blocks/MaxBestSeller";
import MaxAlbum from "./blocks/MaxAlbum";
import MaxTrendingView from "./blocks/MaxTrending";
import MaxDesignSet from "./blocks/MaxDesignSet";
import MaxBrandMarquee from "./blocks/MaxBrandMarquee";
import MaxPhysicalStore from "./blocks/MaxPhysicalStore";
import MaxNewsletter from "./blocks/MaxNewsletter";
import SocialMediaVideoSection from "./blocks/SocialMedia/SocialMedia";
import ShopBanner from "./blocks/ShopBanner/ShopBanner";

 

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  
  const { bestsellerBanner, newArrivalBanner, trendingBanner, lookbookBanner } = useHomeBannerImages({ host: assetBase });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        mt: { xs: "-64px", sm: "-84px" }
      }}
    >
      <TopSection />
      <ShopBanner storeData={storeData} />
      {/* <BestSellerSection1  data={bestsellerBanner} storeData={storeData} /> */}
      {/* <NewArrival storeData={storeData} /> */}
      {/* <TrendingView1 data={trendingBanner} storeData={storeData} /> */}
      {/* <DesignSet /> */}




 
    {/* <SocialMediaVideoSection /> */}
    </Box>
  );
};

export default SonasonsHome;
