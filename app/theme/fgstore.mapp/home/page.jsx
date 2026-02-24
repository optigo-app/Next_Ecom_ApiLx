import React from "react";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import HomeNew from "@/app/theme/fgstore.mapp/home/Home";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async ({ storeinit }) => {
  const { bestsellerBanner, newArrivalBanner, trendingBanner, lookbookBanner } = useHomeBannerImages({ host: assetBase });
  return <>
    <HomeNew storeinit={storeinit} />
  </>
};

export default SonasonsHome;
