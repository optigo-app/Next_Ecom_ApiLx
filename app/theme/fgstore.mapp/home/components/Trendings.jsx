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
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import Cookies from "js-cookie";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";

function Trendings({ storeinit }) {
  const { loginUserDetail, islogin } = useStore();
  const { cacheList, setCacheList } = useMaster();
  const [TrendingData, setTrendingData] = useState([]);
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
    async (finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) return;

      const apiALC = "";
      const keyALC = normalizeALC("");
      const eventName = "home_trending";

      const { key, meta } = buildAlbumCacheKey(eventName, storeinit, pricingContext, finalID, keyALC);
      const effectiveKey = precomputedKey || key;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        // Step 1: Check server cache + local cache in parallel
        const localCacheRes = await fetch(`/api/v1/cache?mode=meta&key=${effectiveKey}`)
          .then((res) => res.json())
          .catch(() => ({ cached: false }));

        const serverCacheEntries = cacheList?.Data?.rd ?? [];
        const matchingServerEntry = findMatchingCacheEntry(serverCacheEntries, pricingContext, eventName, apiALC);
        const serverCacheRebuildDate = matchingServerEntry?.CacheRebuildDate ?? null;

        const localCacheMeta = localCacheRes;
        const localCacheRebuildDate = localCacheMeta?.CacheRebuildDate ?? null;

        console.log("[Trendings] Cache meta checked: localCacheMeta.cached =", localCacheMeta?.cached, "server entries count =", serverCacheEntries?.length);

        // Step 2: Use cache if valid
        if (localCacheMeta?.cached) {
          const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
          const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

          if (canValidate && datesMatch) {
            const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
            const cached = await cachedRes.json();
            console.log("[Trendings] Using cache, skipping API");
            if (cached.cached && Array.isArray(cached.data)) {
              console.log("[Trendings] Setting trendings from cache");
              const mappedData = mapTrendingImages(cached.data);
              setTrendingData(mappedData);
              setLoading(false);
              isFetchingRef.current = false;
              return cached.data;
            }
          }
          fetch(`/api/v1/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
        }

        // Step 3: Guard for storeinit
        if (!storeinit) {
          setTimeout(() => {
            isFetchingRef.current = false;
            fetchAndSetTrendings(finalID, effectiveKey);
          }, 500);
          return;
        }

        // Step 4: API Call
        console.log("[Trendings] Making API call for finalID:", finalID);
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETTrending", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[Trendings] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapTrendingImages(apiData);
          setTrendingData(mappedData);
        } else {
          setTrendingData([]);
        }

        setLoading(false);
        isFetchingRef.current = false;

        // Step 5: Book cache + store local cache
        try {
          const bookCacheResult = await BookCache(finalID, eventName, pricingContext, apiALC);
          const newCacheRebuildDate = bookCacheResult?.CacheRebuildDate ?? null;

          if (newCacheRebuildDate) {
            // Update global cacheList in context
            const newEntry = {
              EventName: eventName,
              PackageId: pricingContext.PackageId,
              LabourSetId: pricingContext.Laboursetid,
              diamondpricelistname: pricingContext.diamondpricelistname,
              colorstonepricelistname: pricingContext.colorstonepricelistname,
              ALC: normalizeALC(apiALC),
              CacheRebuildDate: newCacheRebuildDate,
            };
            if (cacheList?.Data?.rd) {
              const updatedRd = [...cacheList.Data.rd];
              const idx = updatedRd.findIndex(e => e.EventName === eventName && e.PackageId == pricingContext.PackageId && e.LabourSetId == pricingContext.Laboursetid);
              if (idx > -1) updatedRd[idx] = newEntry; else updatedRd.push(newEntry);
              setCacheList({ ...cacheList, Data: { ...cacheList.Data, rd: updatedRd } });
            }
          }

          const updatedMeta = { ...meta, CacheRebuildDate: newCacheRebuildDate };
          fetch("/api/v1/cache", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: effectiveKey, data: apiData, meta: updatedMeta }),
          }).catch(console.error);
        } catch (cacheErr) {
          console.error("[Trendings] Cache update failed:", cacheErr);
        }
      } catch (err) {
        console.log("[Trendings] Error in fetch:", err);
        console.error(err);
        setTrendingData([]);
        isFetchingRef.current = false;
      } finally {
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapTrendingImages, cacheList, setCacheList],
  );

  useEffect(() => {
    if (!pricingContext || !storeinit || cacheList === null) return;

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
  }, [islogin, pricingContext, storeinit, fetchAndSetTrendings, loginUserDetail?.id, cacheList]);

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
                onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)}
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