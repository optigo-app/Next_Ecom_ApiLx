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
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import Cookies from "js-cookie";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";

function NewArrival({ storeinit }) {
  const { loginUserDetail, islogin } = useStore();
  const { cacheList, setCacheList } = useMaster();
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
    async (finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) return;

      const apiALC = "";
      const keyALC = normalizeALC("");
      const eventName = "home_newarrivals";

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

        console.log("[NewArrivals] Cache meta checked: localCacheMeta.cached =", localCacheMeta?.cached, "server entries count =", serverCacheEntries?.length);

        // Step 2: Use cache if valid
        if (localCacheMeta?.cached) {
          const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
          const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

          if (canValidate && datesMatch) {
            const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
            const cached = await cachedRes.json();
            console.log("[NewArrivals] Using cache, skipping API");
            if (cached.cached && Array.isArray(cached.data)) {
              console.log("[NewArrivals] Setting new arrivals from cache");
              const mappedData = mapNewArrivalImages(cached.data);
              setNewArrivalsData(mappedData);
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
            fetchAndSetNewArrivals(finalID, effectiveKey);
          }, 500);
          return;
        }

        // Step 4: API Call
        console.log("[NewArrivals] Making API call for finalID:", finalID);
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETNewArrival", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[NewArrivals] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapNewArrivalImages(apiData);
          setNewArrivalsData(mappedData);
        } else {
          setNewArrivalsData([]);
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
          console.error("[NewArrivals] Cache update failed:", cacheErr);
        }
      } catch (err) {
        console.log("[NewArrivals] Error in fetch:", err);
        console.error(err);
        setNewArrivalsData([]);
        isFetchingRef.current = false;
      } finally {
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapNewArrivalImages, cacheList, setCacheList],
  );

  useEffect(() => {
    if (!pricingContext || !storeinit || cacheList === null) return;

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
  }, [islogin, pricingContext, storeinit, fetchAndSetNewArrivals, loginUserDetail?.id, cacheList]);

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
