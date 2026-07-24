

import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { isOldElvee,isVimalDiamond } from "@/app/(core)/constants/ElveeFlag";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/julian/HeroSection";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import BrandInfoMarquee from "./blocks/Marquee";
import NewArrival from "@/app/components/(dynamic)/NewArrival/julian/NewArrival";
import SocialMediaVideoSection from "./blocks/SocialMedia";
 
import { cookies } from "next/headers";

 
 import TrendingNow from "./blocks/TrendingNow"
 import FeatureProducts from "./blocks/Featureproducts/FeatureProducts"
 import BestSaller from "./blocks/BestSaller"
 import Collection from "./blocks/Collection/Collection"
 import DiamondType from "./blocks/DiamondType"
 import DiamondShape from "./blocks/DiamondShape"
 import MarketingBanner from "./blocks/MarketingBanner"
 import Services from "./blocks/Services"

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  const  islogin  = cookies().get("LoginUser");
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
      <BrandInfoMarquee assetBase={assetBase} />
      <Collection />
      <DiamondType />
      <DiamondShape />
      <MarketingBanner />
      <FeatureProducts  storeInit={storeData} />
      <NewArrival data={newArrivalBanner} storeData={storeData} />
      <TrendingNow  storeInit={storeData} />
      <BestSaller  storeInit={storeData} />
      <Services />
 
    <SocialMediaVideoSection />
    </Box>
  );
};

export default SonasonsHome;
