"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { Box, Skeleton } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Cookies from "js-cookie";

function Trendings({ storeinit, initialData = [] }) {
  const { loginUserDetail, islogin, storeInit: storeInitCtx } = useStore();
  const currentStore = storeinit || storeInitCtx;
  const { push } = useNextRouterLikeRR();

  const isFetchingRef = useRef(false);
  const lastUserRef = useRef(null);

  /** Build card image URL - always .jpg for CDN thumbnails */
  const getCardImageUrl = useCallback((item) => {
    const cdnFol = currentStore?.CDNDesignImageFolThumb || currentStore?.CDNDesignImageFol || "";
    if (!item?.designno || item?.ImageCount === 0 || !cdnFol) {
      return "/image-not-found.jpg";
    }
    return `${cdnFol}${item.designno}~1.jpg`;
  }, [currentStore]);

  /** Maps API trending data with validated image URLs */
  const mapTrendingImages = useCallback((apiData) => {
    return (apiData || []).map((item) => ({
      ...item,
      validatedImageURL: getCardImageUrl(item),
    }));
  }, [getCardImageUrl]);

  const [TrendingData, setTrendingData] = useState(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      return mapTrendingImages(initialData);
    }
    return [];
  });
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);

  const handleNavigation = (product, index) => {
    const designNo = product?.designno;
    const autoCode = product?.autocode;
    const titleLine = product?.TitleLine;

    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
      img: product?.validatedImageURL || `${storeinit?.CDNDesignImageFolThumb}${designNo}~1.jpg`,
      ArticleNo: product?.ArticleNo || product?.articleno || "",
      ArticleId: product?.ArticleId ?? null,
      title: titleLine ?? "",
      nwt: product?.Nwt ?? 0,
      price: product?.UnitCostWithMarkUp ?? 0,
      mediaDet: product?.ImageVideoDetail ?? "",
      metalColorId: product?.MetalColorid ?? null,
    };
    sessionStorage.setItem("scrollToProduct3", `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  const fetchAndSetTrendings = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch("/api/sqlite/home/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeInit: storeinit,
          loginUserDetail,
        }),
      });
      const result = await response.json();
      const apiData = result?.Data?.rd || result?.rd || [];

      if (Array.isArray(apiData) && apiData.length > 0) {
        setTrendingData(mapTrendingImages(apiData));
      } else {
        // Fallback to legacy API if SQLite has no records
        const visiterID = Cookies.get("visiterId");
        const userId = loginUserDetail?.id;
        const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETTrending", finalID).catch(() => null);
        const legacyData = res?.Data?.rd || [];
        setTrendingData(mapTrendingImages(legacyData));
      }
      setLoading(false);
    } catch (err) {
      console.error("[Trendings] Fetch error:", err);
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [storeinit, loginUserDetail, islogin, mapTrendingImages]);

  useEffect(() => {
    const currentUserSig = `${Boolean(islogin)}_${loginUserDetail?.id || loginUserDetail?.userid || 0}_${loginUserDetail?.pricemanagement_laboursetid || 0}`;

    // If initialData was provided on first mount and matches state, keep it
    if (lastUserRef.current === null && initialData && initialData.length > 0) {
      lastUserRef.current = currentUserSig;
      return;
    }

    if (lastUserRef.current !== currentUserSig || TrendingData.length === 0) {
      lastUserRef.current = currentUserSig;
      fetchAndSetTrendings();
    }
  }, [islogin, loginUserDetail, initialData, fetchAndSetTrendings, TrendingData.length]);

  if (!loading && TrendingData?.length === 0) {
    return null;
  }

  return (
    <>
      <Headers title="Trending"
        onViewMore={() => push(`/p/Trending/?T=${btoa("Trending")}`)}
      />
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1.5,
          pb: 3,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          px: 1.5,
        }}
      >
        {
          loading ? (
            Array.from(new Array(6)).map((_, index) => (
              <Box key={index} sx={{ minWidth: 150, width: 150 }}>
                <Skeleton
                  variant="rectangular"
                  width="150px"
                  height="180px"
                  sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }}
                />
                <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="50%" />
              </Box>
            ))
          ) : (
            TrendingData?.map((product, index) => (
              <ProductCard
                key={`trending_${product?.designno || index}`}
                product={product}
                minWidth="150px"
                maxWidth="150px"
                image={product?.validatedImageURL}
                onClick={() => handleNavigation(product, index)}
                price={formatter(product?.UnitCostWithMarkUp)}
                title={[
                  product?.designno,
                  product?.TitleLine && formatTitleLine(product?.TitleLine),
                ]
                  ?.filter(Boolean)
                  ?.join(" - ")
                }
              />
            ))
          )}
      </Box>
    </>
  );
}

export default Trendings;