"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Box, Skeleton } from "@mui/material";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import Cookies from "js-cookie";

function NewArrival({ storeinit, initialData = [] }) {
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

  /** Maps API new arrivals data with validated image URLs */
  const mapNewArrivalImages = useCallback((apiData) => {
    return (apiData || []).map((item) => ({
      ...item,
      validatedImageURL: getCardImageUrl(item),
    }));
  }, [getCardImageUrl]);

  const [NewArrivalsData, setNewArrivalsData] = useState(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      return mapNewArrivalImages(initialData);
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
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  const fetchAndSetNewArrivals = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch("/api/sqlite/home/newarrival", {
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
        setNewArrivalsData(mapNewArrivalImages(apiData));
      } else {
        // Fallback to legacy API if SQLite has no records
        const visiterID = Cookies.get("visiterId");
        const userId = loginUserDetail?.id;
        const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETNewArrival", finalID).catch(() => null);
        const legacyData = res?.Data?.rd || [];
        setNewArrivalsData(mapNewArrivalImages(legacyData));
      }
      setLoading(false);
    } catch (err) {
      console.error("[NewArrivals] Fetch error:", err);
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [storeinit, loginUserDetail, islogin, mapNewArrivalImages]);

  useEffect(() => {
    const currentUserSig = `${Boolean(islogin)}_${loginUserDetail?.id || loginUserDetail?.userid || 0}_${loginUserDetail?.pricemanagement_laboursetid || 0}`;

    // If initialData was provided on first mount and matches state, keep it
    if (lastUserRef.current === null && initialData && initialData.length > 0) {
      lastUserRef.current = currentUserSig;
      return;
    }

    if (lastUserRef.current !== currentUserSig || NewArrivalsData.length === 0) {
      lastUserRef.current = currentUserSig;
      fetchAndSetNewArrivals();
    }
  }, [islogin, loginUserDetail, initialData, fetchAndSetNewArrivals, NewArrivalsData.length]);

  if (!loading && NewArrivalsData?.length === 0) {
    return null;
  }

  return (
    <>
      <Headers title="New Arrivals" onViewMore={() => push(`/p/NewArrival/?N=${btoa("NewArrival")}`)} />
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
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
            <Box key={index} sx={{ minWidth: "200px", width: "200px" }}>
              <Skeleton variant="rectangular" width="200px" height={180} sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }} />
              <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="50%" />
            </Box>
          ))
          : NewArrivalsData?.map((product, index) => (
            <ProductCard
              key={`new_Arrivals_${product?.designno || index}`}
              product={product}
              minWidth="200px"
              maxWidth="200px"
              onClick={() => handleNavigation(product, index)}
              image={product?.validatedImageURL}
              title={[product?.designno, product?.TitleLine && formatTitleLine(product?.TitleLine)]?.filter(Boolean)?.join(" - ")}
              price={formatter(product?.UnitCostWithMarkUp)}
            />
          ))}
      </Box>
    </>
  );
}

export default NewArrival;

