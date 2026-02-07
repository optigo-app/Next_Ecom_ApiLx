import { Box } from "@mui/material";
import getHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export default async function TopSection() {
  const banners = await getHomeBannerImages({ host: assetBase });
  const videoUrl = banners?.mainBanner?.video?.[0] ? banners.mainBanner.video[0].replace(".mp4", ".webm") : null;

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
        poster={`/${assetBase}/Banner/homepageVideoPoster.webp`}
        fetchPriority="high"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        {videoUrl && <source src={videoUrl} type="video/webm" />}
      </Box>
    </Box>
  );
}
