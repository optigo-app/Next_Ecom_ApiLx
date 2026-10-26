import { Box, Typography } from "@mui/material";
import getHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import HomepageSlider from "./HomepageSlider";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function TopSection() {
  const { getBannersByType, isError, error } = await getWebContentManagement();
  const storeData = await getStoreInit();
  const url=storeData?.ApiUrl+"/files/"+storeData?.ukey+"/" || "";
 
 
  if (isError) {
    console.error("[TopSection] Error loading banners:", error);
  }

  if (BELUX_JEWEL) {
    const sliderBanners = getBannersByType("HomepageSlider")
      .filter((b) => b?.IsActive)
      .sort((a, b) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0))

      
      console.log("TCL: TopSection -> sliderBanners", sliderBanners)
      
    

  if (sliderBanners.length > 0) {
    return (
      <>
        <Typography
          component="h1"
          sx={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Exclusive Handcrafted Fine Jewelry Collections
        </Typography>
        <HomepageSlider banners={sliderBanners} url={url} />
      </>
    );
  }

}

return null;
}
