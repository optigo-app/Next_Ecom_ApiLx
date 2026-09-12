"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import "./TopSection.modul.scss";

const BANNER_CACHE_KEY = "procat_top_banner";

const TopSection = ({  initialBanner }) => {
  const { storeInit } = useStore();
  const defaultImage = "/banner/1.jpg";

  const getInitialImage = () => {
    if (initialBanner) return initialBanner;
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(BANNER_CACHE_KEY);
      if (cached) return cached;
    }
    if (storeInit?.ProCatLogbanner) return storeInit.ProCatLogbanner;
    return defaultImage;
  };

  const [imageSrc, setImageSrc] = useState(getInitialImage);

  useEffect(() => {
    const banner = initialBanner || storeInit?.ProCatLogbanner;
    if (banner) {
      setImageSrc(banner);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(BANNER_CACHE_KEY, banner);
      }
    } else if (storeInit && Object.keys(storeInit).length > 0) {
      setImageSrc(defaultImage);
    }
  }, [storeInit, initialBanner, defaultImage]);

  const handleImageError = () => {
    if (imageSrc !== defaultImage) {
      setImageSrc(defaultImage);
    }
  };

  return (
    <div>
      {imageSrc && (
        <img
          src={imageSrc}
          className="proCatTopBannerImg"
          alt="Top Banner"
          onError={handleImageError}
          loading="eager"
          fetchPriority="high"
        />
      )}
    </div>
  );
};

export default TopSection;
