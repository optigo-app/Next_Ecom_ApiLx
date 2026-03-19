"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Box, Card, CardMedia, Skeleton, Typography } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Link from "next/link";
import Headers from "./composable/Headers";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import Cookies from "js-cookie";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";

const GiftBlock = ({ storeinit }) => {
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginUserDetail, islogin } = useStore();
  const { cacheList, setCacheList } = useMaster();

  const fallbackImage = "/fallback.jpg";
  const imageBaseUrl = useMemo(() => {
    return storeinit?.AlbumImageFol || "";
  }, [storeinit?.AlbumImageFol]);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  /** Maps API album data with validated image URLs */
  const mapAlbumImages = useCallback((apiData) => {
    return apiData.map((item) => {
      const imageURL = item?.AlbumImageFol && item?.AlbumImageName
        ? `${imageBaseUrl}${item.AlbumImageFol}/${item.AlbumImageName}`
        : fallbackImage;
      return { ...item, validatedImageURL: imageURL };
    });
  }, [imageBaseUrl, fallbackImage]);

  const fetchAndSetAlbums = useCallback(
    async (finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) return;

      const apiALC = "";
      const keyALC = normalizeALC("");
      const eventName = "home_album";

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

        console.log("[GiftBlock] Cache meta checked: localCacheMeta.cached =", localCacheMeta?.cached, "server entries count =", serverCacheEntries?.length);

        // Step 2: Use cache if valid
        if (localCacheMeta?.cached) {
          const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
          const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

          if (canValidate && datesMatch) {
            const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
            const cached = await cachedRes.json();
            console.log("[GiftBlock] Using cache, skipping API");
            if (cached.cached && Array.isArray(cached.data)) {
              console.log("[GiftBlock] Setting albums from cache");
              const mappedData = mapAlbumImages(cached.data);
              setAlbumData(mappedData);
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
            fetchAndSetAlbums(finalID, effectiveKey);
          }, 500);
          return;
        }

        // Step 4: API Call
        console.log("[GiftBlock] Making API call for finalID:", finalID);
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETAlbum", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[GiftBlock] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapAlbumImages(apiData);
          setAlbumData(mappedData);
        } else {
          setAlbumData([]);
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
          console.error("[GiftBlock] Cache update failed:", cacheErr);
        }
      } catch (err) {
        console.log("[GiftBlock] Error in fetch:", err);
        console.error(err);
        setAlbumData([]);
        isFetchingRef.current = false;
      } finally {
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapAlbumImages, cacheList, setCacheList],
  );

  useEffect(() => {
    if (!pricingContext || !storeinit || cacheList === null) return;

    const fetchData = async () => {
      const visiterID = Cookies.get("visiterId"); // Consistent with Categories.jsx
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("home_album", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetAlbums(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeinit, fetchAndSetAlbums, loginUserDetail?.id, cacheList]);

  if (!loading && albumData.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 0 }}>
      <Headers title="Latest Albums" showViewMoreBtn={false} />

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 1.5,
          py: 1,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ minWidth: 160, width: "100%" }}>
              <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }} />
            </Box>
          ))
          : albumData.map((album, index) => (
            <Box
              key={album?.AlbumId || index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                minWidth: "160px",
                width: "100%",
              }}
            >
              <Card
                component={Link}
                href={`/p/${encodeURIComponent(album?.AlbumName)}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`}
                prefetch={false}
                elevation={0}
                sx={{
                  minWidth: "160px",
                  borderRadius: 3,
                  bgcolor: "#fce(4ec",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  width: "100%",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  textDecoration: "none",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={album?.validatedImageURL}
                  alt={album?.AlbumName || "Gift Collection"}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
              </Card>
              <Typography
                variant="body2"
                sx={{
                  color: "#757575",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 0.5,
                  textDecoration: "none",
                  mt: 1,
                  px: 1,
                }}
              >
                {album?.AlbumName}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default GiftBlock;
