import { Box } from "@mui/material";
import getHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export default async function TopSection() {
  const banners = await getHomeBannerImages({ host: assetBase });
  const videoUrl = banners?.mainBanner?.video?.[0] ? banners.mainBanner.video[0].replace(".mp4", ".webm") : null;

  
  console.log("TCL: TopSection -> videoUrl", videoUrl)

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        minHeight: "550px",
        overflow: "hidden",
        "@media (max-width:1200px)": {
          minHeight: "auto",
        },
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        preload="auto"
        priority="high"
        poster={`/${assetBase}/Banner/homepageVideoPoster5.png`}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        {videoUrl && <source src={`/${assetBase}/Banner/homepageVideoPoster5.mp4`} type="video/webm" />}
        {banners?.mainBanner?.video?.[0] && (
          // <source src={banners.mainBanner.video[0]} type="video/mp4" />
          <source src={`/${assetBase}/Banner/homepageVideoPoster5.mp4`} type="video/mp4" />

        )}
      </Box>
    </Box>
  );
}
