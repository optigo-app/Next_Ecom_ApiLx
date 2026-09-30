import React, { Suspense } from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "./TopSection";
import CategoryAlbumGrid from "./CategoryAlbumGrid";
import ExclusiveAlbumOverlay from "./ExclusiveAlbumOverlay";
import { getSqliteHomeCategory } from "@/app/(core)/utils/sqlite/sqliteActions";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();

  const [categoryRes] = await Promise.all([
    getSqliteHomeCategory({}, storeData?.domain).catch(() => null),
  ]);

  const initialCategories = categoryRes?.rd || [];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        mt: 0,
      }}
    >
      <TopSection initialBanner={storeData?.ProCatLogbanner} />
      <CategoryAlbumGrid
        initialCategories={initialCategories}
        storeInit={storeData}
      />

      {/* Exclusive Album Overlay triggered when ?exclusive-album&customerid=... is detected */}
      <Suspense fallback={null}>
        <ExclusiveAlbumOverlay initialDomain={storeData?.domain || "beluxjewel.web"} />
      </Suspense>
    </Box>
  );
};

export default SonasonsHome;
