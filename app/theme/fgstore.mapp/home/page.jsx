import React from "react";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import HomeNew from "@/app/theme/fgstore.mapp/home/Home";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import {
  getSqliteHomeBestseller,
  getSqliteHomeNewArrival,
  getSqliteHomeTrending,
  getSqliteHomeCategory,
} from "@/app/(core)/utils/sqlite/sqliteActions";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async ({ storeinit }) => {
  const storeData = storeinit || (await getStoreInit().catch(() => null));

  const [bestsellerRes, newArrivalRes, trendingRes, categoryRes] = await Promise.all([
    getSqliteHomeBestseller({}, storeData?.domain).catch(() => null),
    getSqliteHomeNewArrival({}, storeData?.domain).catch(() => null),
    getSqliteHomeTrending({}, storeData?.domain).catch(() => null),
    getSqliteHomeCategory({}, storeData?.domain).catch(() => null),
  ]);

  const initialBestSellers = bestsellerRes?.rd || [];
  const initialNewArrivals = newArrivalRes?.rd || [];
  const initialTrending = trendingRes?.rd || [];
  const initialCategories = categoryRes?.rd || [];

  return (
    <>
      <HomeNew
        storeinit={storeData}
        initialBestSellers={initialBestSellers}
        initialNewArrivals={initialNewArrivals}
        initialTrending={initialTrending}
        initialCategories={initialCategories}
      />
    </>
  );
};

export default SonasonsHome;

