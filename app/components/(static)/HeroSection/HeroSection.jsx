
import { Typography } from "@mui/material";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import HomepageSlider from "./HomepageSlider";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function TopSection() {
  const { getBannersByType, isError, error } = await getWebContentManagement();
  const storeData = await getStoreInit();
  const apiBase = String(storeData?.ApiUrl || "").replace(/\/+$/, "");
  const fileBase = apiBase && storeData?.ukey
    ? `${apiBase}/files/${encodeURIComponent(String(storeData.ukey))}/`
    : "";
 
 
  if (isError) {
    console.error("[TopSection] Error loading banners:", error);
  }

  if (BELUX_JEWEL) {
    const sliderBanners = getBannersByType("HomepageSlider")
      .filter((b) => b?.IsActive)
      .sort((a, b) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0))
      
      console.log("TCL: TopSection ->sliderBanners ",sliderBanners )

      
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
        <HomepageSlider banners={sliderBanners} url={fileBase} />
      </>
    );
  }

}

return null;
}
