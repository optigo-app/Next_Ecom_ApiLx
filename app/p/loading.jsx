"use client";
import React, { useEffect, useState } from "react";
import ProductPageSkeleton from "@/app/theme/beluxjewel.web/product/ProductList/New/ProductPageSkeleton";

export default function Loading() {
  const [isMobileTheme, setIsMobileTheme] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname || "";
      const isMappTheme = 
        host.includes("mapp") || 
        host.includes("nxtmobileapp") || 
        window.innerWidth < 768 || 
        process.env.NEXT_PUBLIC_THEME === "fgstore.mapp";

      setIsMobileTheme(Boolean(isMappTheme));
    }
  }, []);

  // For fgstore.mapp / mobile app domain, return null to enable instant disk-cache rendering
  if (isMobileTheme) {
    return null;
  }

  // For desktop web themes (beluxjewel.web, etc.), return standard desktop page skeleton
  return <ProductPageSkeleton />;
}
