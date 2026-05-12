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
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import Cookies from "js-cookie";

function NewArrival({ storeinit }) {
  const { loginUserDetail, islogin } = useStore();
  const [NewArrivalsData, setNewArrivalsData] = useState([]);
  const { push } = useNextRouterLikeRR();
  const [loading, setLoading] = useState(true);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  /** Maps API new arrivals data with validated image URLs */
  const mapNewArrivalImages = useCallback((apiData) => {
    return apiData.map((item) => {
      const imageURL = `${storeinit?.CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
      return { ...item, validatedImageURL: imageURL };
    });
  }, [storeinit?.CDNDesignImageFolThumb]);

  const fetchAndSetNewArrivals = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[NewArrivals] Serving from cache");
          const mappedData = mapNewArrivalImages(cacheRes.data);
          setNewArrivalsData(mappedData);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        console.log("[NewArrivals] Cache miss, calling API...");
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETNewArrival", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[NewArrivals] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapNewArrivalImages(apiData);
          setNewArrivalsData(mappedData);

          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setNewArrivalsData([]);
        }

        setLoading(false);
        isFetchingRef.current = false;
      } catch (err) {
        console.log("[NewArrivals] Error in fetch:", err);
        console.error(err);
        setNewArrivalsData([]);
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapNewArrivalImages]
  );

  useEffect(() => {
    if (!pricingContext || !storeinit) return;

    const fetchData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("home_newarrivals", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetNewArrivals(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeinit, fetchAndSetNewArrivals, loginUserDetail?.id]);

  if (!loading && NewArrivalsData?.length == 0) {
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
          ? Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ minWidth: "240px", width: "100%" }}>
              <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }} />
            </Box>
          ))
          : NewArrivalsData?.map((product, index) => (
            <ProductCard
              key={`new_Arrivals_${index}`}
              product={product}
              minWidth="200px"
              maxWidth="200px"
              onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)}
              image={product?.validatedImageURL}
              title={[product?.designno, product?.TitleLine && formatTitleLine(product?.TitleLine)]?.filter(Boolean)?.join(" - ")}
              // designno={product?.designno}
              price={formatter(product?.UnitCostWithMarkUp)}
            />
          ))}
      </Box>
    </>
  );
}

export default NewArrival;
