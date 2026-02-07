
export const dynamic = "force-static";
export const revalidate = 43200; // 12 hours = 12 * 60 * 60

import React from "react";
import { cache } from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/hoq/HeroSection";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import NewArrival from "@/app/components/(dynamic)/NewArrival/hoq/NewArrival";
import Collection from "@/app/components/(dynamic)/DesignSet/hoq/Collection";
import FeaturedBrand from "@/app/components/(static)/FeaturedBrand/FeaturedBrand";
import ReviewTab from "@/app/components/(static)/ReviewTab/ReviewTab";
import CategoryTab from "@/app/components/(dynamic)/CategoryTab/CategoryTab";
import BestSellerSection from "@/app/components/(dynamic)/BestSellerSection/hoq/BestSellerSection";
import ImageBannerTab from "@/app/components/(static)/ImageBannerTab/ImageBannerTab";
import ScrollTriggerTab from "@/app/components/(static)/ScrollTriggerTab/ScrollTriggerTab";
import SocialTab from "@/app/components/(static)/SocialTab/SocialTab";
import InfoSection from "@/app/components/(static)/InfoSection/InfoSection";
import FaqSection from "@/app/components/(static)/FaQSection/FaqSection";

export const metadata = generatePageMetadata(pages["/"], "Hoq");

const HoqHome = cache(async () => {
  const storeData = await getStoreInit();
  const { mainBanner, bestsellerBanner, newArrivalBanner, lookbookBanner } = useHomeBannerImages({ host: assetBase });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      {storeData?.Blockno === 1 && (
        <>
          <TopSection data={mainBanner} />
          {storeData?.IsHomeNewArrival === 1 && <NewArrival data={newArrivalBanner} storeData={storeData} />}
          {storeData?.IsHomeDesignSet === 1 && <Collection data={lookbookBanner} storeInit={storeData} />}
          <FeaturedBrand assetBase={assetBase} />
          <ReviewTab />
          {storeData?.IsHomeAlbum === 1 && <CategoryTab storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <BestSellerSection data={bestsellerBanner} storeData={storeData} />}
          <ImageBannerTab assetsBase={assetBase} />
          <ScrollTriggerTab assetBase={assetBase} />
          <SocialTab assetBase={assetBase} />
          <InfoSection />
          <FaqSection />
        </>
      )}
      {storeData?.Blockno === 2 && (
        <>
          <TopSection data={mainBanner} />
          {storeData?.IsHomeNewArrival === 1 && <NewArrival data={newArrivalBanner} storeData={storeData} />}
          {storeData?.IsHomeDesignSet === 1 && <Collection data={lookbookBanner} storeInit={storeData} />}
          <FeaturedBrand assetBase={assetBase} />
          <ReviewTab />
          {storeData?.IsHomeAlbum === 1 && <CategoryTab storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <BestSellerSection data={bestsellerBanner} storeData={storeData} />}
          <ImageBannerTab assetsBase={assetBase} />
          <ScrollTriggerTab assetBase={assetBase} />
          <SocialTab assetBase={assetBase} />
          <InfoSection />
          <FaqSection />
        </>
      )}
    </Box>
  );
});

export default HoqHome;
