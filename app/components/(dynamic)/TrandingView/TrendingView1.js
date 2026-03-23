"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./TrendingView1.scss";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import pako from "pako";
import Cookies from "js-cookie";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import cookies from "js-cookie";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";






const TrendingView1 = ({ data, storeInit }) => {
    const { islogin, loginUserDetail } = useStore();
    const { push } = useNextRouterLikeRR();
    const { cacheList, setCacheList } = useMaster();
    const trendingRef = useRef(null);
    const [trandingViewData, setTrandingViewData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const navigation = push;
    const imageNotFound = "/image-not-found.jpg";

    const [oddNumberObjects, setOddNumberObjects] = useState([]);
    const [evenNumberObjects, setEvenNumberObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [validatedData, setValidatedData] = useState([]);
    const productRefs = useRef({});
    const [mounted, setMounted] = useState(false);

    const isFetchingRef = useRef(false);
    const lastRequestKeyRef = useRef("");

    const isOdd = (num) => num % 2 !== 0;



    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        // prevArrow: false,
        // nextArrow: false,
    };


    useEffect(() => {
        setImageUrl(storeInit?.CDNDesignImageFolThumb);
        setMounted(true);
    }, [storeInit?.CDNDesignImageFolThumb]);

    const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);

    const fetchAndSetTrending = useCallback(async (finalID, precomputedKey) => {
        if (!pricingContext || isFetchingRef.current) return;

        const apiALC = "";
        const keyALC = normalizeALC("");
        const eventName = "fg_trending";

        const { key, meta } = buildAlbumCacheKey(eventName, storeInit, pricingContext, finalID, keyALC);
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

            console.log("[TrendingView1] Cache check:", { key: effectiveKey, localCached: localCacheMeta?.cached, serverRebuild: serverCacheRebuildDate, localRebuild: localCacheRebuildDate });

            // Step 2: Use cache if valid
            if (localCacheMeta?.cached) {
                const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
                const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

                if (canValidate && datesMatch) {
                    const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
                    const cached = await cachedRes.json();
                    if (cached.cached && Array.isArray(cached.data)) {
                        console.log("[TrendingView1] Serving from cache");
                        const records = cached.data;
                        const oddNumbers = records.filter((obj) => isOdd(obj.SrNo));
                        const evenNumbers = records.filter((obj) => !isOdd(obj.SrNo));
                        setTrandingViewData(records);
                        setOddNumberObjects(oddNumbers);
                        setEvenNumberObjects(evenNumbers);
                        setIsLoading(false);
                        isFetchingRef.current = false;
                        return;
                    }
                }
                fetch(`/api/v1/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
            }

            // Step 3: API Fallback
            console.log("[TrendingView1] Calling API...");
            const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETTrending", finalID);
            const records = response?.Data?.rd ?? [];

            const oddNumbers = records.filter((obj) => isOdd(obj.SrNo));
            const evenNumbers = records.filter((obj) => !isOdd(obj.SrNo));

            setTrandingViewData(records);
            setOddNumberObjects(oddNumbers);
            setEvenNumberObjects(evenNumbers);

            setIsLoading(false);
            isFetchingRef.current = false;

            // Step 4: Book cache + store local cache
            if (records.length > 0) {
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
                        body: JSON.stringify({ key: effectiveKey, data: records, meta: updatedMeta }),
                    }).catch(console.error);
                } catch (cacheErr) {
                    console.error("[TrendingView1] Cache update failed:", cacheErr);
                }
            }
        } catch (error) {
            console.error("[TrendingView1] Error fetching trending:", error);
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, [pricingContext, storeInit, cacheList, setCacheList]);

    useEffect(() => {
        if (!mounted || !pricingContext || !storeInit || cacheList === null) return;

        const fetchData = async () => {
            const visitorId = cookies.get("visiterId") ?? "0";
            const IsB2BWebsite = storeInit?.IsB2BWebsite ?? 0;
            const uid = loginUserDetail?.id || "0";
            const finalID = IsB2BWebsite == 0 ? (islogin === false ? visitorId : uid) : uid;

            const keyALC = normalizeALC("");
            const { key } = buildAlbumCacheKey("fg_trending", storeInit, pricingContext, finalID, keyALC);

            if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
            lastRequestKeyRef.current = key;

            await fetchAndSetTrending(finalID, key);
        };

        fetchData();
    }, [mounted, islogin, pricingContext, storeInit, fetchAndSetTrending, loginUserDetail?.id, cacheList]);



    const ProdCardImageFunc = (pd) => {
        let finalprodListimg;
        if (pd?.ImageCount > 0) {
            finalprodListimg = imageUrl + pd?.designno + "~" + 1 + "." + pd?.ImageExtension;
        } else {
            finalprodListimg = imageNotFound;
        }
        return finalprodListimg;
    };

    const checkImageAvailability = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(imageNotFound);
            img.src = url;
        });
    };

    const validateImageURLs = async () => {
        if (!trandingViewData?.length) return;
        const validatedData = await Promise.all(
            trandingViewData.map(async (item) => {
                const imageURL = `${imageUrl}${item?.designno}~1.jpg`;
                // const imageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension}`;
                // const validatedURL = await checkImageAvailability(imageURL);
                // return { ...item, validatedImageURL: validatedURL };
                return { ...item, validatedImageURL: imageURL };
            })
        );
        setValidatedData(validatedData);
    };

    useEffect(() => {
        validateImageURLs();
    }, [trandingViewData]);

    const handleNavigation = (item, index) => {
        let obj = {
            a: item?.autocode,
            b: item?.designno,
            m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid,
            f: {},
            l: item?.ImageExtension,
            count: item?.ImageCount,
        };
        sessionStorage.setItem("scrollToProduct3", `product-${index}`);
        let encodeObj = compressAndEncode(JSON.stringify(obj));
        navigation(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`);
    };

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem("scrollToProduct3");
        if (!scrollDataStr) return;

        const maxRetries = 10;
        let retries = 0;

        const tryScroll = () => {
            const el = productRefs.current[scrollDataStr];
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                sessionStorage.removeItem("scrollToProduct3");
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();
    }, [trandingViewData]);

    const chunkedData = [];
    for (let i = 0; i < validatedData?.length; i += 3) {
        chunkedData.push(validatedData?.slice(i, i + 3));
    }
    return (
        <div
            ref={trendingRef}
            onContextMenu={(e) => {
                e.preventDefault();
            }}
        >
            {validatedData?.length != 0 && (
                <div className="smr_mainTrending1Div">
                    <div className="smr1_trending1TitleDiv">
                        <span className="smr_trending1Title">TRENDING</span>
                    </div>
                    <div className="smr_trendingProduct-grid">
                        <div className="smr_leftSideBestTR">
                            {/* <img src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/web-210128-BW-PF21_S219259.jpg?v=1646112530&width=2000" alt="modalimages" /> */}
                            {/* <img src={`${storImagePath()}/images/HomePage/TrendingViewBanner/TrendingViewImgHom2.png`} alt="modalimages" /> */}
                            <img src={data?.image[0]} alt="modalimages" loading="lazy" draggable={true} onContextMenu={(e) => e.preventDefault()} />

                            <div className="smr_lookbookImageRightDT">
                                {/* <p>SHORESIDE COLLECTION</p>
                                <h2>FOR LOVE OF SUN & SEA</h2> */}
                                <button onClick={() => navigation(`/p/Trending/?T=${btoa("Trending")}`)}>SHOP COLLECTION</button>
                            </div>
                        </div>
                        <div className="smr_rightSideTR">
                            {validatedData?.slice(0, 4).map((data, index) => (
                                <div
                                    key={index}
                                    className="product-card"
                                >
                                    <div className="smr_btimageDiv" onClick={() => handleNavigation(data, index)}>
                                        <img
                                            src={
                                                data?.ImageCount >= 1
                                                    ? data?.validatedImageURL
                                                    : // `${imageUrl}${data.designno === undefined ? '' : data?.designno}~1.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                                                    imageNotFound
                                            }
                                            id={`product-${index}`}
                                            ref={(el) => (productRefs.current[`product-${index}`] = el)}
                                            onError={(e) => {
                                                e.target.src = imageNotFound;
                                            }}
                                            draggable={true}
                                            onContextMenu={(e) => e.preventDefault()}
                                            loading="lazy"

                                            alt={`product-${index}`}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h3>
                                            {data?.designno !== "" && data?.designno} {formatTitleLine(data?.TitleLine) && " - " + data?.TitleLine}
                                        </h3>
                                        {storeInit?.IsGrossWeight == 1 && (
                                            <>
                                                <span className="smr_btdetailDT">GWT: </span>
                                                <span className="smr_btdetailDT">{(data?.Gwt || 0)?.toFixed(3)}</span>
                                            </>
                                        )}
                                        {Number(data?.Nwt) !== 0 && (
                                            <>
                                                <span className="smr_btpipe">|</span>
                                                <span className="smr_btdetailDT">NWT : </span>
                                                <span className="smr_btdetailDT">{(data?.Nwt || 0)?.toFixed(3)}</span>
                                            </>
                                        )}
                                        {storeInit?.IsDiamondWeight == 1 && (
                                            <>
                                                {(data?.Dwt != "0" || data?.Dpcs != "0") && (
                                                    <>
                                                        <span className="smr_btpipe">|</span>
                                                        <span className="smr_btdetailDT">DWT: </span>
                                                        <span className="smr_btdetailDT">
                                                            {(data?.Dwt || 0)?.toFixed(3)}/{data?.Dpcs || 0}
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {storeInit?.IsStoneWeight == 1 && (
                                            <>
                                                {(data?.CSwt != "0" || data?.CSpcs != "0") && (
                                                    <>
                                                        <span className="smr_btpipe">|</span>
                                                        <span className="smr_btdetailDT">CWT: </span>
                                                        <span className="smr_btdetailDT">
                                                            {(data?.CSwt || 0)?.toFixed(3)}/{data?.CSpcs || 0}
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {storeInit?.IsPriceShow == 1 && (
                                            <p>
                                                <span className="smr_currencyFont">{islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode}</span>&nbsp;
                                                <span>{formatter(data?.UnitCostWithMarkUp)}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendingView1;
