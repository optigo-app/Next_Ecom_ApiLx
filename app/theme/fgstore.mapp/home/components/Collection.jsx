"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import Headers from "./composable/Headers";
import { HomeCollectionApi } from "@/app/(core)/utils/API/Home/HomeCollectionApi/HomeCollectionApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import Cookies from "js-cookie";

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
        async (finalID, cacheKey) => {
            if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

            isFetchingRef.current = true;
            setLoading(true);

            try {
                const cacheRes = await readCache(cacheKey);

                if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
                    console.log("[Collection] Serving from cache");
                    const mappedData = mapCollectionImages(cacheRes.data);
                    setCollectionData(mappedData);
                    setLoading(false);
                    isFetchingRef.current = false;
                    return;
                }

                console.log("[Collection] Cache miss, calling API...");
                const res = await HomeCollectionApi(storeinit, finalID);
                const apiData = res?.Data?.rd || [];
                console.log("[Collection] API response received, count:", apiData.length);

                if (apiData.length > 0) {
                    const mappedData = mapCollectionImages(apiData);
                    setCollectionData(mappedData);

                    writeCache(cacheKey, apiData).catch(console.error);
                } else {
                    setCollectionData([]);
                }

                setLoading(false);
                isFetchingRef.current = false;
            } catch (err) {
                console.log("[Collection] Error in fetch:", err);
                console.error(err);
                setCollectionData([]);
                isFetchingRef.current = false;
                setLoading(false);
            }
        },
        [pricingContext, storeinit, mapCollectionImages]
    );

    useEffect(() => {
        if (!pricingContext || !storeinit) return;

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
    }, [islogin, pricingContext, storeinit, fetchAndSetCollection, loginUserDetail?.id]);

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
