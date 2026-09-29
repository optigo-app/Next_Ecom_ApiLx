import { Box, Typography } from "@mui/material";
import getHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { BELUX_JEWEL } from "@/app/(core)/constants/ElveeFlag";


export default async function TopSection() {
  if (BELUX_JEWEL) {
    return (
      <Box
        component="section"
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/7",
          minHeight: "550px",
          overflow: "hidden",
          backgroundColor: "#cca182",
          background: "linear-gradient(135deg, #cca182 0%, #dfc3a7 35%, #cca182 70%, #b98e6d 100%)",
          "@media (max-width:1200px)": {
            minHeight: "auto",
          },
        }}
      >
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
        <img
          src="/banner/Banner.webp"
          alt="Exclusive Handcrafted Fine Jewelry Collections"
          width="1920"
          height="840"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>
    );
  }
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
          preload="auto"
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
            <source src={`/${assetBase}/Banner/homepageVideoPoster5.mp4`} type="video/mp4" />
          )}
        </Box>
      </Box>
    );
}

