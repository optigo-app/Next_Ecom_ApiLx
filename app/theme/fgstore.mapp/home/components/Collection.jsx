"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import Headers from "./composable/Headers";
import { HomeCollectionApi } from "@/app/(core)/utils/API/Home/HomeCollectionApi/HomeCollectionApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import Cookies from "js-cookie";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";

const DummyCollections = [
    {
        title: "Duometrik",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Duometrik.jpg",
    },
    {
        title: "Inner Glow",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Inner Glow.jpg",
    },
    {
        title: "Kendall",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Kendall.jpg",
    },
    {
        title: "Moodust",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Moodust.webp",
    },
    {
        title: "Petalush",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Petalush.webp",
    },
    {
        title: "Petalyn",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Petalyn.webp",
    },
    {
        title: "Pristine",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Pristine.jpg",
    },
    {
        title: "Velar",
        image: "https://elvee.in/WebSiteStaticImage/images/Collection/Velar.webp",
    },
];

function Collection({ storeinit }) {
    const { loginUserDetail, islogin } = useStore();
    const { cacheList, setCacheList } = useMaster();
    const [CollectionData, setCollectionData] = useState([]);
    const { push } = useNextRouterLikeRR();
    const [loading, setLoading] = useState(true);

    const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

    const isFetchingRef = useRef(false);
    const lastRequestKeyRef = useRef("");

    const handleNavigate = (name) => {
        let finalData = {
            menuname: name,
            FilterKey: "Collection",
            FilterVal: name,
            FilterKey1: "",
            FilterVal1: "",
            FilterKey2: "",
            FilterVal2: "",
        };
        sessionStorage.setItem("menuparams", JSON.stringify(finalData));
        const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");
        const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].join(",");
        const otherparamUrl = Object.entries({
            b: finalData?.FilterKey,
            g: finalData?.FilterKey1,
            c: finalData?.FilterKey2,
        })
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value)
            .filter(Boolean)
            .join(",");
        let menuEncoded = `${queryParameters}/${otherparamUrl}`;
        const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
        push(url);
    };

    /** Maps API collection data with dummy images */
    const mapCollectionImages = useCallback((apiData) => {
        return apiData.map((item) => {
            const matchedImage = DummyCollections?.find((img) => img?.title?.toLowerCase() === item?.CollectionName?.toLowerCase());
            return {
                ...item,
                image: matchedImage ? encodeURI(matchedImage.image) : "/fallback.jpg",
            };
        });
    }, []);

    const fetchAndSetCollection = useCallback(
        async (finalID, precomputedKey) => {
            if (!pricingContext || isFetchingRef.current) return;

            const apiALC = "";
            const keyALC = normalizeALC("");
            const eventName = "home_collection";

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

                console.log("[Collection] Cache meta checked: localCacheMeta.cached =", localCacheMeta?.cached, "server entries count =", serverCacheEntries?.length);

                // Step 2: Use cache if valid
                if (localCacheMeta?.cached) {
                    const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
                    const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

                    if (canValidate && datesMatch) {
                        const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
                        const cached = await cachedRes.json();
                        console.log("[Collection] Using cache, skipping API");
                        if (cached.cached && Array.isArray(cached.data)) {
                            console.log("[Collection] Setting collections from cache");
                            const mappedData = mapCollectionImages(cached.data);
                            setCollectionData(mappedData);
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
                        fetchAndSetCollection(finalID, effectiveKey);
                    }, 500);
                    return;
                }

                // Step 4: API Call
                console.log("[Collection] Making API call for finalID:", finalID);
                const res = await HomeCollectionApi(storeinit, finalID);
                const apiData = res?.Data?.rd || [];
                console.log("[Collection] API response received, count:", apiData.length);

                if (apiData.length > 0) {
                    const mappedData = mapCollectionImages(apiData);
                    setCollectionData(mappedData);
                } else {
                    setCollectionData([]);
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
                    console.error("[Collection] Cache update failed:", cacheErr);
                }
            } catch (err) {
                console.log("[Collection] Error in fetch:", err);
                console.error(err);
                setCollectionData([]);
                isFetchingRef.current = false;
            } finally {
                setLoading(false);
            }
        },
        [pricingContext, storeinit, mapCollectionImages, cacheList, setCacheList],
    );

    useEffect(() => {
        if (!pricingContext || !storeinit || cacheList === null) return;

        const fetchData = async () => {
            const visiterID = Cookies.get("visiterId");
            const userId = loginUserDetail?.id;
            const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

            const keyALC = normalizeALC("");
            const { key } = buildAlbumCacheKey("home_collection", storeinit, pricingContext, finalID, keyALC);

            if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
            lastRequestKeyRef.current = key;

            await fetchAndSetCollection(finalID, key);
        };

        fetchData();
    }, [islogin, pricingContext, storeinit, fetchAndSetCollection, loginUserDetail?.id, cacheList]);

    if (!loading && CollectionData?.length == 0) {
        return null;
    }

    return (
        <>
            <Headers title="Most Loved Collections" onViewMore={() => push(`/collection?utf=home`)} />
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 1.5,
                    pb: 2,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    px: 1.5,
                }}
            >
                {
                    loading ? (
                        Array.from(new Array(8)).map((_, index) => (
                            <Box key={index} sx={{ minWidth: "320px", width: "100%" }}>
                                <Skeleton
                                    variant="rectangular"
                                    width="320px"
                                    height="420px"
                                    sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }}
                                />
                            </Box>
                        ))
                    ) : (
                        CollectionData?.map((item, index) => (
                            <Box
                                key={item?.CollectionName}
                                onClick={() => handleNavigate(item?.CollectionName)}
                                sx={{
                                    minWidth: "320px",
                                    maxWidth: "320px",
                                    flexShrink: 0,
                                    scrollSnapAlign: "start",
                                    height: "420px",
                                    position: "relative",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    backgroundImage: `url(${item?.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></Box>
                        ))
                    )}
            </Box>
        </>
    );
}
export default Collection;
