import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import TopSection from "./TopVideo/TopSection";
import JewelryHeader from './Header'
import Album from "./Album/Album";
import { Box } from "@mui/material";

export const metadata = generatePageMetadata(pages["/"], "Sonasons");

const SonasonsHome = async () => {
  const storeData = await getStoreInit();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
      }}
    >
     <TopSection  initialBanner={storeData.ProCatLogbanner}/>
     <JewelryHeader/>
     <Album/>
    </Box>
  );
};

export default SonasonsHome;
