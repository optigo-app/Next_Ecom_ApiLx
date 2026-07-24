"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import "./NewArrival.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import { Box, Typography, Grid } from "@mui/material";
import Link from "next/link";

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

    return (
        <div className="hoq_main_TabSection"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        >

            <div className="header">
                
                <h1 style={{marginBottom: "10px",fontSize: "30px",marginTop:"4px"}}> <span style={{color: "#c20000",fontStyle: "italic"}}>New</span> Arrivals</h1>
                <button
                    onClick={() => navigation(`/p/NewArrival/?N=${btoa("NewArrival")}`)}
                >
                    View All
                </button>
            </div>
            {/* 330 w 500 h */}
            <div className="tab_card">
                {newArrivalData?.slice(0, 3)?.map((val, i) => {
                    return (
                        <div
                        key={i}
                        className="TabCard_main"
                        style={{ cursor: "pointer" }}
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
            </div>
        </div>
    );
};

export default TabSection;
