"use client";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import cookies from "js-cookie";
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";


const Main = ({ storeData }) => {
  const { islogin, loginUserDetail } = useStore();
  const [albumData, setAlbumData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cacheList, setCacheList } = useMaster();
  const imageUrl = storeData?.AlbumImageFol;

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeData, islogin), [loginUserDetail, storeData, islogin]);

  const fetchAndSetAlbums = useCallback(async (finalID, precomputedKey) => {
    if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

    const apiALC = "";
    const keyALC = normalizeALC("");
    const eventName = "fg_album";

    const { key, meta } = buildAlbumCacheKey(eventName, storeData, pricingContext, finalID, keyALC);
    const effectiveKey = precomputedKey || key;

    isFetchingRef.current = true;
    setIsLoading(true);

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

      console.log("[AlbumSection] Cache check:", { key: effectiveKey, localCached: localCacheMeta?.cached, serverRebuild: serverCacheRebuildDate, localRebuild: localCacheRebuildDate });

      // Step 2: Use cache if valid
      if (localCacheMeta?.cached) {
        const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
        const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

        if (canValidate && datesMatch) {
          const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
          const cached = await cachedRes.json();
          if (cached.cached && Array.isArray(cached.data)) {
            console.log("[AlbumSection] Serving from cache");
            setAlbumData(cached.data);
            setIsLoading(false);
            isFetchingRef.current = false;
            return;
          }
        }
        fetch(`/api/v1/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
      }

      // Step 3: API Fallback
      console.log("[AlbumSection] Calling API...");
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETAlbum", finalID);
      const apiData = res?.Data?.rd || [];

      if (apiData.length > 0) {
        setAlbumData(apiData);
      }

      setIsLoading(false);
      isFetchingRef.current = false;

      // Step 4: Book cache + store local cache
      if (apiData.length > 0) {
        try {
          const bookCacheResult = await BookCache(finalID, eventName, pricingContext, apiALC);
          const newCacheRebuildDate = bookCacheResult?.CacheRebuildDate ?? null;

          if (newCacheRebuildDate) {
            const newEntry = {
              EventName: eventName,
              PackageId: pricingContext.PackageId,
              LabourSetId: pricingContext.Laboursetid,
              diamondpricelistname: pricingContext.diamondpricelistname,
              colorstonepricelistname: pricingContext.colorstonepricelistname,
              ALC: keyALC,
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
          console.error("[AlbumSection] Cache update failed:", cacheErr);
        }
      }
    } catch (err) {
      console.error("[AlbumSection] Error fetching albums:", err);
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [pricingContext, storeData, cacheList, setCacheList]);

  useEffect(() => {
    if (!pricingContext || !storeData || cacheList === null) return;

    const fetchData = async () => {
      const visitorId = cookies.get("visiterId") ?? "0";
      const IsB2BWebsite = storeData?.IsB2BWebsite ?? 0;
      const uid = loginUserDetail?.id || "0";
      const finalID = IsB2BWebsite == 0 ? (islogin === false ? visitorId : uid) : uid;

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("fg_album", storeData, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetAlbums(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeData, fetchAndSetAlbums, loginUserDetail?.id, cacheList]);

  const skeletons = Array.from({ length: 5 }).map((_, i) => (
    <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={i} mb={4}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Skeleton variant="rectangular" height={300} />
        <CardContent>
          <Skeleton width="80%" />
        </CardContent>
      </Card>
    </Grid>
  ));





  if (albumData.length === 0) return null;


  return (
    <Grid container spacing={3} justifyContent="center" alignContent="start" mt={2}>
      {isLoading
        ? skeletons
        : albumData.slice(0, 5).map((album, index) => (
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
            <Card
              sx={{
                overflow: "hidden",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
              }}
              component={Link}
              href={`/p/${album?.AlbumName}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`}
              prefetch={false}
            >
              <CardActionArea>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    bgcolor: "rgba(0,0,0,0.04)",
                  }}
                >
                  <CardMedia
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    component="img"
                    image={imageUrl + album?.AlbumImageFol + "/" + album?.AlbumImageName || "/image-not-found.jpg"}
                    alt={"album-image"}
                    onError={(e) => {
                      e.target.src = "/image-not-found.jpg";
                    }}
                    width={600}
                    height={800}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography variant="body1" noWrap fontWeight={600} color="text.primary">
                      {album?.AlbumName}
                    </Typography>
                  </CardContent>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default Main;
