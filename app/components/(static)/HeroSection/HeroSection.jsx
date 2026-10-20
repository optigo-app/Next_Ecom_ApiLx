import { Box, Typography } from "@mui/material";
import getHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getGroupedWebsiteConfig } from "@/app/(core)/utils/sqlite/websiteContentConfig";
import HomepageSlider from "./HomepageSlider";



export default async function TopSection() {
  
const configRes = await getGroupedWebsiteConfig();
const content = configRes?.data?.banner || {};


 

if (BELUX_JEWEL) {
  // HomepageSlider banners from dynamic data
  const sliderBanners = (
    content?.byType?.HomepageSlider ||
    (content?.banners || []).filter((b) => b.TypeKey === "HomepageSlider")
  )
    .filter((b) => b?.IsActive)
    .sort((a, b) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0));
    

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
        <HomepageSlider banners={sliderBanners} />
      </>
    );
  }

}

return null;
}
