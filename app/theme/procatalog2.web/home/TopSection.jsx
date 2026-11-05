"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const BANNER_CACHE_KEY = "procat_top_banner";
const DEFAULT_IMAGE = "/banner/Banner.png";

const withRetryParam = (url) => `${url}${url.includes("?") ? "&" : "?"}r=${Date.now()}`;

const bannerHeight = {
  xs: "180px",
  sm: "280px",
  md: "400px",
  lg: "500px",
  xl: "550px",
};

/**
 * TopSection Banner component for Procatalog
 * Fallback chain when the banner fails to load (including failures that happen before hydration):
 * original URL -> one cache-busted retry -> local default banner -> neutral placeholder (never a broken image).
 * A banner URL is cached in sessionStorage only after it has loaded successfully.
 */
const TopSection = ({ initialBanner }) => {
  const { storeInit } = useStore();
  const imgRef = useRef(null);
  const retriedRef = useRef(false);

  const getInitialImage = () => {
    if (initialBanner) return initialBanner;
    if (storeInit?.ProCatLogbanner) return storeInit.ProCatLogbanner;
    return DEFAULT_IMAGE;
  };

  const [imageSrc, setImageSrc] = useState(getInitialImage);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const banner = initialBanner || storeInit?.ProCatLogbanner;
    retriedRef.current = false;
    setFailed(false);
    if (banner) setImageSrc(banner);
    else if (storeInit && Object.keys(storeInit).length > 0) setImageSrc(DEFAULT_IMAGE);
  }, [storeInit, initialBanner]);

  const handleImageError = useCallback(() => {
    try {
      if (sessionStorage.getItem(BANNER_CACHE_KEY) === imageSrc) sessionStorage.removeItem(BANNER_CACHE_KEY);
    } catch (_) {}
    if (imageSrc === DEFAULT_IMAGE) {
      setFailed(true);
      return;
    }
    if (!retriedRef.current) {
      retriedRef.current = true;
      const base = imageSrc.split(/[?&]r=\d+/)[0];
      setImageSrc(withRetryParam(base));
      return;
    }
    retriedRef.current = false;
    setImageSrc(DEFAULT_IMAGE);
  }, [imageSrc]);

  const handleImageLoad = useCallback(() => {
    if (imageSrc === DEFAULT_IMAGE) return;
    try {
      sessionStorage.setItem(BANNER_CACHE_KEY, imageSrc.split(/[?&]r=\d+/)[0]);
    } catch (_) {}
  }, [imageSrc]);

  // Covers images that already failed before React attached onError (SSR / slow hydration).
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) handleImageError();
  }, [imageSrc, handleImageError]);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        mb: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {failed ? (
        <Box sx={{ width: "100%", height: bannerHeight, bgcolor: "#f3f1ee" }} />
      ) : (
        <Box
          component="img"
          ref={imgRef}
          key={imageSrc}
          src={imageSrc}
          alt=""
          aria-label="Top Banner"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="eager"
          fetchPriority="high"
          sx={{
            width: "100%",
            height: bannerHeight,
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            bgcolor: "#f3f1ee",
          }}
        />
      )}
    </Box>
  );
};

export default TopSection;
