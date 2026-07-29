

import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "./blocks/TopSection";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import MaxTrendingView from "./blocks/MaxTrending";
import SocialMediaVideoSection from "./blocks/SocialMedia";;
import { cookies } from "next/headers";


 

import NewArrival from "./blocks/NewArrival"
import Collections from "./blocks/Collections"
import CompareProduct from "./blocks/CompareProduct"
import TopCollection from "./blocks/TopCollection"
import CategorySection from "./blocks/CategorieSection"
import Marquee from "./blocks/Marquee"
import ProductBanner from "./blocks/ProductBanner"
import NewCollection from "./blocks/NewCollection"
import DesignSet from "./blocks/DesignSet"
import OfferBanner from "./blocks/OfferBanner"
import Quote from "./blocks/Quote"




export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  const islogin = cookies().get("LoginUser");
  const { bestsellerBanner, newArrivalBanner, trendingBanner, lookbookBanner, mainBanner } = useHomeBannerImages({ host: assetBase });


  // 2. Return block for Standard branding (based on login status)
  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: "100vh", mt: { xs: "-64px", sm: "-84px" } }}>
      <TopSection />
      <NewArrival storeInit={storeData} />
      <Collections storeInit={storeData} />
      <CompareProduct />
      <TopCollection />
      <CategorySection assetBase={assetBase} storeInit={storeData} />
      <Marquee />
      <ProductBanner />
      <MaxTrendingView data={trendingBanner} storeInit={storeData} />
      <NewCollection />
      <DesignSet />
      <OfferBanner />
      <Quote />
      <SocialMediaVideoSection />

    </Box>
  );
};

export default SonasonsHome;
