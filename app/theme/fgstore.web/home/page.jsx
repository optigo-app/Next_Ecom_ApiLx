import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/HeroSection";
import TheDifference from "@/app/components/(static)/DiffBlock";
import BespokeBanner from "@/app/components/(static)/BespokeBanner";
import AlbumSection from "@/app/components/(dynamic)/AlbumSection";
import BestSellerSection1 from "@/app/components/(dynamic)/BestSellerSection/BestSellerSection1";
import BestSellerSection2 from "@/app/components/(dynamic)/BestSellerSection/BestSellerSection";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import NewArrival from "@/app/components/(dynamic)/NewArrival/NewArrival";
import NewArrival2 from "@/app/components/(dynamic)/NewArrival/NewArrival1";
import TrendingView2 from "@/app/components/(dynamic)/TrandingView/TrendingView1";
import TrendingView from "@/app/components/(dynamic)/TrandingView/TrendingView";
import AppointmentBanner from "@/app/components/(static)/AppointmentBanner/AppointmentBanner";
import DesignSet2 from "@/app/components/(dynamic)/DesignSet/DesignSet2";
import DesignSet1 from "@/app/components/(dynamic)/DesignSet/DesignSet1";
import DesignSet from "@/app/components/(dynamic)/DesignSet/DesignSet";
import BrandsComponent from "@/app/components/(static)/BrandComponent/BrandComponents";
import NewsletterSignup from "@/app/components/(static)/SubscribeNewsLater/NewsletterSignup";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  const { bestsellerBanner, newArrivalBanner, trendingBanner, lookbookBanner } = useHomeBannerImages({ host: assetBase });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      {storeData?.Blockno === 1 && (
        <>
          <TopSection />
          <TheDifference />
          <BespokeBanner />
          {storeData?.IsHomeAlbum === 1 && <AlbumSection storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <BestSellerSection2 data={bestsellerBanner} storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <NewArrival data={newArrivalBanner} storeData={storeData} />}
          {storeData?.IsHomeTrending === 1 && <TrendingView data={trendingBanner} storeInit={storeData} />}
          <AppointmentBanner />
          {storeData?.IsHomeDesignSet === 1 && <DesignSet data={lookbookBanner} storeInit={storeData} />}
          <BrandsComponent/>
          <NewsletterSignup storeData={storeData} />
        </>
      )}
      {storeData?.Blockno === 2 && (
        <>
          <TopSection />
          <TheDifference />
          <BespokeBanner />
          {storeData?.IsHomeAlbum === 1 && <AlbumSection storeData={storeData} />}
          {storeData?.IsHomeBestSeller === 1 && <BestSellerSection1 data={bestsellerBanner} storeData={storeData} />}
          {storeData?.IsHomeNewArrival === 1 && <NewArrival2 data={newArrivalBanner} storeInit={storeData} />}
          {storeData?.IsHomeTrending === 1 && <TrendingView2 data={trendingBanner} storeInit={storeData} />}
          <AppointmentBanner />
          {storeData?.IsHomeDesignSet === 1 && <DesignSet2 data={lookbookBanner} storeInit={storeData} />}
          <BrandsComponent/>
          <NewsletterSignup storeData={storeData} />
        </>
      )}
    </Box>
  );
};

export default SonasonsHome;
