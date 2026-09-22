"use client";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const BANNER_CACHE_KEY = "procat_top_banner";
const DEFAULT_IMAGE = "/banner/Banner.png";

/**
 * TopSection Banner component for Procatalog
 * Re-implemented with 100% pure Material UI (no SCSS dependency).
 * Supports SSR initialBanner, storeInit dynamic banner, session caching, and error fallbacks.
 */
const TopSection = ({ initialBanner }) => {
  const { storeInit } = useStore();

  const getInitialImage = () => {
    if (initialBanner) return initialBanner;
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(BANNER_CACHE_KEY);
        if (cached) return cached;
      } catch (_) {}
    }
    if (storeInit?.ProCatLogbanner) return storeInit.ProCatLogbanner;
    return DEFAULT_IMAGE;
  };

  const [imageSrc, setImageSrc] = useState(getInitialImage);

  useEffect(() => {
    const banner = initialBanner || storeInit?.ProCatLogbanner;
    if (banner) {
      setImageSrc(banner);
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(BANNER_CACHE_KEY, banner);
        } catch (_) {}
      }
    } else if (storeInit && Object.keys(storeInit).length > 0) {
      setImageSrc(DEFAULT_IMAGE);
    }
  }, [storeInit, initialBanner]);

  const handleImageError = () => {
    if (imageSrc !== DEFAULT_IMAGE) {
      setImageSrc(DEFAULT_IMAGE);
    }
  };

  if (!imageSrc) return null;

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        mb: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt="Top Banner"
        onError={handleImageError}
        loading="eager"
        fetchPriority="high"
        sx={{
          width: "100%",
          height: {
            xs: "180px",
            sm: "280px",
            md: "400px",
            lg: "500px",
            xl: "550px",
          },
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />
    </Box>
  );
};

export default TopSection;
