"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Box, Typography, Link } from '@mui/material';
import Cookies from "js-cookie";
import "./NewArrival.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import { formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";

const TabSection = ({ storeData }) => {
    const [newArrivalData, setNewArrivalData] = useState([]);
    const { loginUserDetail, islogin } = useStore();
    const [imageUrl, setImageUrl] = useState();
    const navigation = useNextRouterLikeRR().push;
    const productRefs = useRef({});
    const noimage = `./image-not-found.jpg`;

    const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeData, islogin), [loginUserDetail, storeData, islogin]);
    const isFetchingRef = useRef(false);
    const lastRequestKeyRef = useRef("");


    const fetchAndSetNewArrivals = useCallback(
        async (finalID, cacheKey) => {
            if (!pricingContext || !pricingContext.PackageId) return;

            // 1. Client Session Cache Check (0ms instant browser read)
            let cachedSessionData = getSession(cacheKey);
            if (cachedSessionData && Array.isArray(cachedSessionData) && cachedSessionData.length > 0) {
                const hasError = cachedSessionData.some(
                    (item) =>
                        item?.stat === 0 ||
                        (typeof item?.stat_msg === "string" &&
                            item.stat_msg.toLowerCase().includes("error")),
                );
                if (!hasError) {
                    setNewArrivalData(cachedSessionData);
                    return;
                }
            }

            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            // 2. Server Disk Cache Check (.next_cache)
            try {
                const cacheRes = await readCache(cacheKey);

                if (cacheRes?.cached && Array.isArray(cacheRes.data) && cacheRes.data.length > 0) {
                    const hasError = cacheRes.data.some(
                        (item) =>
                            item?.stat === 0 ||
                            (typeof item?.stat_msg === "string" &&
                                item.stat_msg.toLowerCase().includes("error")),
                    );
                    if (!hasError) {
                        console.log("[NewArrival] Serving from server cache");
                        setNewArrivalData(cacheRes.data);
                        setSession(cacheKey, cacheRes.data);
                        isFetchingRef.current = false;
                        return;
                    }
                }

                // 3. Live API Call
                console.log("[NewArrival] Cache miss, calling API...");
                const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETNewArrival", finalID);
                const apiData = response?.Data?.rd || [];
                const hasError = apiData.some(
                    (item) =>
                        item?.stat === 0 ||
                        (typeof item?.stat_msg === "string" &&
                            item.stat_msg.toLowerCase().includes("error")),
                );

                if (apiData.length > 0 && !hasError) {
                    setNewArrivalData(apiData);
                    setSession(cacheKey, apiData);
                    writeCache(cacheKey, apiData).catch(console.error);
                } else {
                    setNewArrivalData([]);
                }
                isFetchingRef.current = false;
            } catch (err) {
                console.error("[NewArrival] Error in fetch:", err);
                setNewArrivalData([]);
                isFetchingRef.current = false;
            }
        },
        [pricingContext, storeData]
    );

    useEffect(() => {
        if (!pricingContext || !storeData) return;

        setImageUrl(storeData?.CDNDesignImageFolThumb);

        const fetchData = async () => {
            const IsB2BWebsite = storeData?.IsB2BWebsite;
            const visiterID = Cookies.get("visiterId");
            const userId = loginUserDetail?.id;
            const finalID = IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

            const keyALC = normalizeALC("");
            const { key } = buildAlbumCacheKey("home_newarrivals", storeData, pricingContext, finalID, keyALC);

            if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
            lastRequestKeyRef.current = key;

            await fetchAndSetNewArrivals(finalID, key);
        };

        fetchData();
    }, [islogin, pricingContext, storeData, fetchAndSetNewArrivals, loginUserDetail?.id]);

    const ImageGenrate = (product) => {
        return product?.ImageCount >= 1
            ? `${imageUrl}${newArrivalData && product?.designno}~1.jpg`
            : "noImageFound";
    };

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);

            const compressed = Pako.deflate(uint8Array, { to: "string" });

            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error("Error compressing and encoding:", error);
            return null;
        }
    };
    const handleMoveToDetail = (productData, index) => {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        const imageVideoDetail = productData?.ImageVideoDetail;

        const parsed = imageVideoDetail
            ? JSON.parse(imageVideoDetail)
            : [];

        const uniqueNmList = [...new Set(parsed.map(item => item.Nm))];
        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: loginInfo?.MetalId,
            d: loginInfo?.cmboDiaQCid,
            c: loginInfo?.cmboCSQCid,
            f: {},
            i: productData?.MetalColorid,
            l: parsed[0]?.Ex || "",
            count: uniqueNmList.length,
        };

        let encodeObj = compressAndEncode(JSON.stringify(obj));
        sessionStorage.setItem('scrollToProduct2', `product-${index}`);

        navigation(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);
    };

    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (hasScrolledRef.current) return;  // prevent loop

        const scrollDataStr = sessionStorage.getItem("scrollToProduct2");
        if (!scrollDataStr) return;

        const el = productRefs.current[scrollDataStr];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            sessionStorage.removeItem("scrollToProduct2");
            hasScrolledRef.current = true; // mark as done
        }
    }, [newArrivalData]);
 

    if (newArrivalData?.length === 0) {
        return <div style={{ marginTop: "2rem" }}></div>;
    }

    const TRACK_ITEMS = [...newArrivalData, ...newArrivalData, ...newArrivalData];

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      };
      

    return (
        <div className="NewArrivalSection"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        >
            <Box >
                {/* Center Content */}
                <Box sx={{marginBottom:"50px"}}>

                    <Typography
                        sx={{

                            fontSize: { xs: 34, md: 42 },
                            fontWeight: 500,
                            mt: 1,
                            color: "#2C2C2C",
                            textAlign: "center",
                        }}
                    >
                        New & Exclusive
                    </Typography>

                    <Typography
                        sx={{

                            fontSize: { xs: 34, md: 18 },
                            fontWeight: 400,
                            color: "gray",
                            marginBottom:"50px",
                            mb: 0,
                            textAlign: "center",
                        }}
                    >
                        Be the first to explore our newest jewellery creations
                    </Typography>
                </Box>
            </Box>

           
            <Box sx={{ width: '100%', overflow: 'hidden' , }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                       
                        width: 'max-content',
                        animation: 'reviews-marquee 40s linear infinite',
                        // Pause the whole track cleanly on hover, same mechanism as the AutoMarquee reference
                        '&:hover': {
                            animationPlayState: 'paused',
                        },
                    }}
                >
                    {TRACK_ITEMS.map((product, index) => (
                        <Box
                            key={`${product.id}-${index}`}
                            onClick={() => handleMoveToDetail(product, index)}
                            cursor="pointer"
                            sx={{
                                flex: '0 0 auto',
                                width: { xs: '220px', sm: '260px', md: '300px' },
                                mx: { xs: 1.5, md: 2.5 },
                            }}
                        >
                            {/* Alternating scale between even and odd cards, same as original design */}
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    whiteSpace: 'normal',
                                    transform: index % 2 === 0 ? 'scale(0.80)' : 'scale(1.08)',
                                    transition: 'transform 0.3s ease',
                                    cursor:"pointer",
                                }}
                            >

                                {/* product Portrait Image */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '0.85',
                                        overflow: 'hidden',
                                        borderRadius: '0px',

                                        mb: 2.5,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={ImageGenrate(product)}
                                        alt={product?.id}
                                        id={`product-${index}`}
                                        draggable={false}
                                        onError={(e) => {
                                            e.target.src = noimage;
                                            e.target.alt = "Fallback image";
                                        }}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            cursor:"pointer",
                                        }}
                                    />
                                </Box>

                                {/* Quote Text */}
                                <Typography
                                    sx={{
                                
                                        fontSize: '14px',
                                        lineHeight: 1.5,
                                        color: '#1c1c1c',
                                        fontWeight: 300,
                                        mb: 1.5,
                                    }}
                                >
                                    {product?.TitleLine || " "}
                                </Typography>

                                {/* Author & Tagged Product Info Link */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', justifyContent: 'center', paddingBottom: '10px' }}>
                                    <Typography
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#1c1c1c',
                                            textDecoration: 'center',
                                        }}
                                    >
                                        {product.TitleLine}
                                    </Typography>
                                        {/* --- PRICE ROW: current price / struck-through original / discount % --- */}
                                            {storeData?.IsPriceShow == 1 && (
                                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                                                <Typography
                                                  sx={{
                                                    fontWeight: 600,
                                                    fontSize: { xs: "0.78rem", sm: "0.85rem", md: index % 2 === 0 ? "1.2rem" : "0.9rem" },
                                                    color: "#050505",
                                                  }}
                                                >
                                                  <span
                                                    dangerouslySetInnerHTML={{
                                                      __html: decodeEntities(loginUserDetail?.CurrencyCode ?? storeData?.CurrencyCode),
                                                    }}
                                                    style={{ paddingRight: "0.3rem" }}
                                                  />
                                                  {formatter(product?.UnitCostWithMarkUp)}
                                                </Typography>
                                    
                                               
                                                {product?.MRP ? (
                                                  <Typography
                                                    sx={{
                                                      fontWeight: 300,
                                                      fontSize: { xs: "0.7rem", sm: "0.78rem" },
                                                      color: "#8a8a8a",
                                                      textDecoration: "line-through",
                                                    }}
                                                  >
                                                    {formatter(product.UnitCostWithMarkUpIncTax)}
                                                  </Typography>
                                                ) : null}
                                    
                                                
                                              </Box>
                                            )}
                                </Box>

                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </div>
    );
};

export default TabSection;
