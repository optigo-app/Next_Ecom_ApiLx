import React, { Suspense } from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/HeroSection";
// import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import BrandInfoMarquee from "./blocks/Marquee";
import CategoryBlock from "./blocks/Category";
import MaxBestSeller from "./blocks/MaxBestSeller";
import MaxNewArrival from "./blocks/MaxNewArrival";
// import MaxAlbum from "./blocks/MaxAlbum";
import MaxTrendingView from "./blocks/MaxTrending";
// import MaxDesignSet from "./blocks/MaxDesignSet";
import MaxBrandMarquee from "./blocks/MaxBrandMarquee";
import MaxPhysicalStore from "./blocks/MaxPhysicalStore";
// import MaxNewsletter from "./blocks/MaxNewsletter";
import SocialMediaVideoSection from "./blocks/SocialMedia";
import CraftsmanshipPage from "../craftsmanship/page";
import MaxDesignLibrary from "./blocks/MaxDesignLibrary";
import { getSqliteHomeBestseller, getSqliteHomeNewArrival, getSqliteHomeTrending } from "@/app/(core)/utils/sqlite/sqliteActions";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import SocialMedia from "@/app/components/(static)/SocialMedia/SocialMedia"; 

export const metadata = generatePageMetadata(pages["/"], "Belux Jewel");

const BeluxJewelHome = async () => {
  const storeData = await getStoreInit();



  const [bestsellerRes, newArrivalRes, trendingRes] = await Promise.all([
    getSqliteHomeBestseller({}, storeData?.domain).catch(() => null),
    getSqliteHomeNewArrival({}, storeData?.domain).catch(() => null),
    getSqliteHomeTrending({}, storeData?.domain).catch(() => null),
  ]);

  const initialBestSellers = bestsellerRes?.rd || [];
  const initialNewArrivals = newArrivalRes?.rd || [];
  const initialTrending = trendingRes?.rd || [];

  const { pageTemplates, isError, error } = await getWebContentManagement();

  const socialMediaTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "social-media"
  );


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        mt: { xs: "-64px", sm: "-84px" },
      }}
    >
      <TopSection />
      <BrandInfoMarquee assetBase={assetBase} />
      <CategoryBlock assetBase={assetBase} storeInit={storeData} />
      <MaxBestSeller storeInit={storeData} initialData={initialBestSellers} />
      <MaxNewArrival storeInit={storeData} initialData={initialNewArrivals} />
      <MaxPhysicalStore />
      <MaxTrendingView storeInit={storeData} initialData={initialTrending} />
      <MaxBrandMarquee assetBase={assetBase} />
      <CraftsmanshipPage assetBase={assetBase} />
      <MaxDesignLibrary />
      {/* <SocialMediaVideoSection /> */}
      <SocialMedia templates={socialMediaTemplates} />
    </Box>
  );
};

export default BeluxJewelHome;
