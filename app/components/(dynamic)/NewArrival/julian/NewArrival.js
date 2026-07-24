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
            if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

            isFetchingRef.current = true;

            try {
                const cacheRes = await readCache(cacheKey);

                if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
                    console.log("[NewArrival] Serving from cache");
                    setNewArrivalData(cacheRes.data);
                    isFetchingRef.current = false;
                    return;
                }

                console.log("[NewArrival] Cache miss, calling API...");
                const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETNewArrival", finalID);
                const apiData = response?.Data?.rd || [];

                if (apiData.length > 0) {
                    setNewArrivalData(apiData);
                    writeCache(cacheKey, apiData).catch(console.error);
                } else {
                    setNewArrivalData([]);
                }
                isFetchingRef.current = false;
            } catch (err) {
                console.log("[NewArrival] Error in fetch:", err);
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

    const formatter = new Intl.NumberFormat("en-IN");

    if (newArrivalData?.length === 0) {
        return <div style={{ marginTop: "2rem" }}></div>;
    }

    const TRACK_ITEMS = [...newArrivalData, ...newArrivalData, ...newArrivalData];

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

            {/* <div className="tab_card">
                {newArrivalData?.map((val, i) => {
                    return (
                        <div
                            key={i}
                            className="TabCard_main"
                            style={{ backgroundColor: " #b8b4b823", cursor: "pointer" }}
                            onClick={() => handleMoveToDetail(val, i)}
                        >
                            <div className="cardhover">
                                <img
                                    src={ImageGenrate(val)}
                                    alt={val?.id}
                                    id={`product-${i}`}
                                    ref={(el) => (productRefs.current[`product-${i}`] = el)}
                                    style={{ mixBlendMode: "multiply", objectFit: "contain" }}
                                    onError={(e) => {
                                        e.target.src = noimage;
                                        e.target.alt = "Fallback image";
                                    }}
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                    loading="lazy"
                                />
                            </div>
                            <div className="tab_hover_Details">
                                <h3 style={{ fontSize: "20px" }}>{val?.designno}</h3>
                                {storeData?.IsPriceShow === 1 && (
                                    <small>
                                        {loginUserDetail?.CurrencyCode ?? storeData?.CurrencyCode}{" "}
                                        &nbsp;
                                        {formatter.format(val?.UnitCostWithMarkUp)}
                                    </small>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div> */}

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
                    {TRACK_ITEMS.map((review, index) => (
                        <Box
                            key={`${review.id}-${index}`}
                            onClick={() => handleMoveToDetail(review, index)}
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

                                {/* Review Portrait Image */}
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
                                        src={ImageGenrate(review)}
                                        alt={review?.id}
                                        id={`product-${index}`}
                                        draggable={false}
                                        onError={(e) => {
                                            e.target.src = noimage;
                                            e.target.alt = "Fallback image";
                                        }}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            cursor:"pointer",
                                        }}
                                    />
                                </Box>

                                {/* Quote Text */}
                                <Typography
                                    sx={{
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '14px',
                                        lineHeight: 1.5,
                                        color: '#1c1c1c',
                                        fontWeight: 300,
                                        mb: 1.5,
                                    }}
                                >
                                    {review?.TitleLine || " "}
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
                                        {review.TitleLine}
                                    </Typography>
                                    <Typography


                                        sx={{
                                            fontSize: '13px',
                                            color: '#1c1c1c',
                                            textAlign: 'center',
                                            opacity: 0.7,
                                            textDecorationColor: 'rgba(28, 28, 28, 0.4)',
                                            transition: 'opacity 0.2s',
                                            '&:hover': {
                                                opacity: 1,
                                                textDecorationColor: '#1c1c1c',
                                            },
                                        }}
                                    >
                                        {review.UnitCostWithMarkUp}
                                    </Typography>
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
