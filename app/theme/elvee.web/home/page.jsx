

import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { isOldElvee,isVimalDiamond } from "@/app/(core)/constants/ElveeFlag";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/HeroSection";
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
import SocialMediaVideoSection from "./blocks/SocialMedia";
import SingleStore from "./blocks/SingleStore";
import { cookies } from "next/headers";


import PromoComponent1 from "./blocks/PromoComponent/PromoComponent/PromoComponent1"  
import BrandsComponent from "./blocks/PromoComponent/BrandsComponent/BrandsComponent"
import PromoComponent2 from "./blocks/PromoComponent/PromoComponent/PromoComponent2"
import OldCollection from "./blocks/Collection/OldCollection"
import Craftmenship from "./blocks/Craftmenship/Craftmenship"
import GaleryView from "./blocks/GaleryView/GaleryView"
import CompanyData from "./blocks/ComapnayData/CompanyData"
import AffiliationData from "./blocks/PromoComponent/BrandsComponent/AffiliationData"
import MaxCategories from "./blocks/MaxCategories"
 import ProductTypeSlider from "./blocks/ProductTypeSlider"

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  const  islogin  = cookies().get("LoginUser");
  const { bestsellerBanner, newArrivalBanner, trendingBanner, lookbookBanner } = useHomeBannerImages({ host: assetBase });

console.log("TCL: SonasonsHome -> islogin",islogin )
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
      { !islogin && 
      <>
      
       <BrandInfoMarquee assetBase={assetBase} />
       {isVimalDiamond && <MaxCategories assetBase={assetBase} storeInit={storeData} /> }
       {isVimalDiamond && <ProductTypeSlider assetBase={assetBase} storeInit={storeData} />}
       <PromoComponent1  />
       <BrandsComponent />
       <PromoComponent2 />
       {isVimalDiamond && <MaxDesignSet />}
       {isVimalDiamond && <SingleStore />}
       <Craftmenship />
       <GaleryView />
       <CompanyData />
       <AffiliationData />
      </>
      }
        





      { islogin && 
      <>
      
       {isVimalDiamond ? <MaxCategories assetBase={assetBase} storeInit={storeData} /> : <CategoryBlock assetBase={assetBase} storeInit={storeData} />}
       {isVimalDiamond  && <ProductTypeSlider assetBase={assetBase} storeInit={storeData} />}
       <ProductTypeSlider assetBase={assetBase} storeInit={storeData} />
      <MaxBestSeller storeInit={storeData} />
      <MaxAlbum storeInit={storeData} />
      <MaxTrendingView data={trendingBanner} storeInit={storeData} />
      <MaxDesignSet data={lookbookBanner} storeInit={storeData} />
      <MaxPhysicalStore />
      <MaxBrandMarquee assetBase={assetBase} />
      <MaxNewsletter storeData={storeData} />
      </>
      
    }
    <SocialMediaVideoSection />
    </Box>
  );
};

export default SonasonsHome;
