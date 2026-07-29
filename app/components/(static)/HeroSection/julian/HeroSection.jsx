"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useRouter } from "next/navigation";
import "./HeroSection.scss";

const BANNER_IMAGE_URL = "/WebSiteStaticImage/Banner/b2c_banner.webp";

export default function HeroSection() {
  const { push } = useNextRouterLikeRR();
  const router = useRouter();

  useEffect(() => {
    // 1. Preload Hero Banner Image into browser cache
    if (typeof window !== "undefined") {
      const img = new Image();
      img.src = BANNER_IMAGE_URL;
    }

    // 2. Prefetch Shop Now (/p) page route
    try {
      router.prefetch("/p");
    } catch (_) {}
  }, [router]);

  const handleShopNowClick = () => {
    push("/p");
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 10,
        height: {
          xs: "280px",
          sm: "380px",
          md: "630px",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <Box
        component="img"
        src={BANNER_IMAGE_URL}
        alt="Mother's Day Banner"
        fetchPriority="high"
        decoding="async"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* DARK OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.15))",
        }}
      />

      {/* CONTENT */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          right: {
            xs: "20px",
            md: "120px",
          },
          transform: "translateY(-50%)",
          color: "#fff",
          textAlign: "left",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "28px",
              sm: "42px",
              md: "56px",
            },
            fontWeight: 300,
            lineHeight: 1.1,
            fontFamily: "serif",
            mb: 1,
          }}
        >
          {/* Mother's Day Gifts */}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "15px",
            },
            opacity: 0.9,
            mb: 3,
            letterSpacing: "0.5px",
          }}
        >
          {/* For the one who does it all. */}
        </Typography>

        <Button
          variant="contained"
          className="shopNowBtn"
          onClick={handleShopNowClick}
          sx={{
            
            borderRadius: 0,
            px: 5,
            py: 1.4,
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              background: "#ffffff",
              color: "#0d1232",
              boxShadow: "none",
            },
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}