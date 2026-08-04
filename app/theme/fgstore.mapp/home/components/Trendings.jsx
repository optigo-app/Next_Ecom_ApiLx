'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { Box, Skeleton } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import Cookies from "js-cookie";

function Trendings({ storeinit }) {
  const { loginUserDetail, islogin } = useStore();
  const [TrendingData, setTrendingData] = useState([]);
  const { push } = useNextRouterLikeRR();
  const [loading, setLoading] = useState(true);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

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

  /** Maps API trending data with validated image URLs */
  const mapTrendingImages = useCallback((apiData) => {
    return apiData.map((item) => {
      const imageURL = `${storeinit?.CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
      return { ...item, validatedImageURL: imageURL };
    });
  }, [storeinit?.CDNDesignImageFolThumb]);

  const fetchAndSetTrendings = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[Trendings] Serving from cache");
          const mappedData = mapTrendingImages(cacheRes.data);
          setTrendingData(mappedData);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        console.log("[Trendings] Cache miss, calling API...");
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETTrending", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[Trendings] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapTrendingImages(apiData);
          setTrendingData(mappedData);

          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setTrendingData([]);
        }

        setLoading(false);
        isFetchingRef.current = false;
      } catch (err) {
        console.log("[Trendings] Error in fetch:", err);
        console.error(err);
        setTrendingData([]);
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapTrendingImages]
  );

  useEffect(() => {
    if (!pricingContext || !storeinit) return;

    const fetchData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("home_trending", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetTrendings(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeinit, fetchAndSetTrendings, loginUserDetail?.id]);

  if (!loading && TrendingData?.length == 0) {
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
            Array.from(new Array(8)).map((_, index) => (
              <Box key={index} sx={{ minWidth: 160, width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  width="150px"
                  height="180px"
                  sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }}
                />
              </Box>
            ))
          ) : (
            TrendingData?.map((product, index) => (
              <ProductCard
                key={`trending_${index}`}
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