"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Album.modul.scss";
import { Get_Procatalog } from "@/app/(core)/utils/API/Home/Get_Procatalog/Get_Procatalog";
import Cookies from "js-cookie";
import { Box, CardMedia, Modal, Skeleton } from "@mui/material";
import AlbumSkeleton from "./AlbumSkeleton/AlbumSkeleton";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSearchParams } from "next/navigation";
import { GetCacheList, BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext, processAlbumImages } from "./CacheBuilder";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

const Album = () => {
  const { islogin, loginUserDetail, storeinit } = useStore();
  const [albumData, setAlbumData] = useState([]);
  const [fallbackImages, setFallbackImages] = useState({});
  const [designSubData, setDesignSubData] = useState([]);
  const [openAlbumName, setOpenAlbumName] = useState("");
  const [imagesReady, setImagesReady] = useState(false);
  const imageNotFound = "/Assets/image-not-found.jpg";
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const ALCVAL = searchParams.get("ALC") || "";

  const navigation = useNextRouterLikeRR();

  const navigate = (link) => {
    navigation.push(link);
  };

  const [securityKey, setSecurityKey] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const fetchAndSetAlbumData = useCallback(
    async (value, finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) return;

      const apiALC = value;
      const keyALC = normalizeALC(value);
      console.log("Starting fetch for ALC:", apiALC);

      const { key, meta } = buildAlbumCacheKey("procatalog_album", storeinit, pricingContext, finalID, keyALC);
      const effectiveKey = precomputedKey || key;
      const eventName = "procatalog_album";

      isFetchingRef.current = true;
      setIsFetching(true);

      try {
        const [serverRes, localCacheRes] = await Promise.all([
          GetCacheList(finalID).catch(() => null),
          fetch(`/api/cache?mode=meta&key=${effectiveKey}`)
            .then((res) => res.json())
            .catch(() => ({ cached: false })),
        ]);

        const serverCacheEntries = serverRes?.Data?.rd ?? [];
        const matchingServerEntry = findMatchingCacheEntry(serverCacheEntries, pricingContext, eventName, apiALC);
        const serverCacheRebuildDate = matchingServerEntry?.CacheRebuildDate ?? null;

        const localCacheMeta = localCacheRes;
        const localCacheRebuildDate = localCacheMeta?.CacheRebuildDate ?? null;

        console.log("Cache meta checked: localCacheMeta.cached =", localCacheMeta?.cached, "server entries count =", serverCacheEntries?.length);

        if (localCacheMeta?.cached) {
          const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
          const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

          if (canValidate && datesMatch) {
            const cachedRes = await fetch(`/api/cache?key=${effectiveKey}`);
            const cached = await cachedRes.json();
            console.log("Using cache, skipping API");
            if (cached.cached && Array.isArray(cached.data)) {
              console.log("Setting album data from cache");
              setAlbumData(cached.data);
              setFallbackImages(processAlbumImages(cached.data, storeinit));
              setImagesReady(true);
              setIsFetching(false);
              isFetchingRef.current = false;
              return cached.data;
            }
          }
          fetch(`/api/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
        }

        if (!storeinit) {
          setTimeout(() => {
            isFetchingRef.current = false;
            setIsFetching(false);
            fetchAndSetAlbumData(value, finalID, effectiveKey);
          }, 500);
          return;
        }
        console.log("Making API call for finalID:", finalID, "apiALC:", apiALC);
        const response = await Get_Procatalog("GET_Procatalog", finalID, apiALC);
        console.log("API response received:", response);
        if (response?.Data?.rd) {
          const albums = response.Data.rd;
          console.log("Setting album data from API, albums length:", albums.length);
          setAlbumData(albums);

          const fallbacks = processAlbumImages(albums, storeinit);
          setFallbackImages(fallbacks);
          setImagesReady(true);
          setIsFetching(false);
          isFetchingRef.current = false;
          try {
            const bookCacheResult = await BookCache(finalID, eventName, pricingContext, apiALC);
            const newCacheRebuildDate = bookCacheResult?.CacheRebuildDate ?? null;

            const updatedMeta = { ...meta, CacheRebuildDate: newCacheRebuildDate };
            fetch("/api/cache", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: effectiveKey, data: albums, meta: updatedMeta }),
            }).catch(console.error);
          } catch (cacheErr) {
            console.error("Cache update failed:", cacheErr);
          }
        } else {
          console.log("No Data.rd in response");
        }
      } catch (err) {
        console.log("Error in fetch:", err);
        console.error(err);
        setIsFetching(false);
        isFetchingRef.current = false;
      } finally {
        setImagesReady(true);
      }
    },
    [pricingContext, storeinit],
  );

  useEffect(() => {
    console.log("useEffect triggered with pricingContext:", !!pricingContext, "storeinit:", !!storeinit, "ALCVAL:", ALCVAL);
    if (!pricingContext || !storeinit) {
      console.log("Guards not met, skipping fetch");
      return;
    }

    const fetchAlbumData = async () => {
      console.log("fetchAlbumData called");
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const rawALC = ALCVAL ? ALCVAL : (getSession("ALCVALUE") ?? "");
      const keyALC = normalizeALC(rawALC);
      sessionStorage.setItem("ALCVALUE", String(rawALC));

      const { key } = buildAlbumCacheKey("procatalog_album", storeinit, pricingContext, finalID, keyALC);

      console.log("Checking fetch conditions: isFetching =", isFetchingRef.current, "lastKey =", lastRequestKeyRef.current, "current key =", key);
      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      console.log("Calling fetchAndSetAlbumData");
      await fetchAndSetAlbumData(rawALC, finalID, key);
    };

    fetchAlbumData();

    console.log("mounted:", mounted);
    console.log("pricingContext:", pricingContext);
    console.log("storeinit:", storeinit);
    console.log("isFetchingRef:", isFetchingRef.current);
    console.log("lastKey:", lastRequestKeyRef.current);

  }, [islogin,  pricingContext, storeinit, ALCVAL, fetchAndSetAlbumData, loginUserDetail?.id]);


  return (
    <div className="proCat_alubmMainDiv">
  
    </div>
  );
};

export default Album;
