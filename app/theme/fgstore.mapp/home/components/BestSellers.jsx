"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { Box } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import Cookies from "js-cookie";

function BestSellers({ storeinit }) {
  const { loginUserDetail, islogin } = useStore();
  const [bestSellerData, setBestSellerData] = useState([]);
  const { push } = useNextRouterLikeRR();
  const [loading, setLoading] = useState(true);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const handleNavigation = (designNo, autoCode, titleLine) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  /** Maps API bestseller data with validated image URLs */
  const mapBestSellerImages = useCallback((apiData) => {
    return apiData.map((item) => {
      const imageURL = `${storeinit?.CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
      return { ...item, validatedImageURL: imageURL };
    });
  }, [storeinit?.CDNDesignImageFolThumb]);

  const fetchAndSetBestSellers = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[BestSellers] Serving from cache");
          const mappedData = mapBestSellerImages(cacheRes.data);
          setBestSellerData(mappedData);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        console.log("[BestSellers] Cache miss, calling API...");
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETBestSeller", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[BestSellers] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapBestSellerImages(apiData);
          setBestSellerData(mappedData);

          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setBestSellerData([]);
        }

        setLoading(false);
        isFetchingRef.current = false;
      } catch (err) {
        console.log("[BestSellers] Error in fetch:", err);
        console.error(err);
        setBestSellerData([]);
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapBestSellerImages]
  );

  useEffect(() => {
    if (!pricingContext || !storeinit) return;

    const fetchData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("home_bestseller", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetBestSellers(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeinit, fetchAndSetBestSellers, loginUserDetail?.id]);

  if (!loading && bestSellerData?.length == 0) {
    return null;
  }

  return (
    <>
      <Headers title="BestSellers" onViewMore={() => push(`/p/BestSeller/?B=${btoa("BestSeller")}`)} />
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
        {bestSellerData?.map((product, index) => (
          <ProductCard
            key={`best_sellers_${index}`}
            product={product}
            minWidth="150px"
            maxWidth="150px"
            onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine)}
            image={product?.validatedImageURL}
            title={[product?.designno, product?.TitleLine && formatTitleLine(product?.TitleLine)]?.filter(Boolean)?.join(" - ")}
            price={formatter(product?.UnitCostWithMarkUp)}
          />
        ))}
      </Box>
    </>
  );
}

export default BestSellers;
