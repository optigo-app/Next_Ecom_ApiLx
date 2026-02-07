"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TrendingView1.scss";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import pako from "pako";
import Cookies from "js-cookie";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import cookies from "js-cookie";



const buildAlbumCacheKey = (type, storeData, pricing, id) => {
    const meta = {
        type,
        PackageId: pricing?.PackageId ?? "",
        Laboursetid: pricing?.Laboursetid ?? "",
        diamondpricelistname: pricing?.diamondpricelistname ?? "",
        colorstonepricelistname: pricing?.colorstonepricelistname ?? "",
    };

    const key = [
        type,
        pricing?.PackageId,
        pricing?.Laboursetid,
        pricing?.diamondpricelistname,
        pricing?.colorstonepricelistname,
    ].join("_");

    return {
        key,
        meta,
    }
};



const TrendingView1 = ({ data, storeInit }) => {
    const { islogin } = useStore();
    const { push } = useNextRouterLikeRR();
    const trendingRef = useRef(null);
    const [trandingViewData, setTrandingViewData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const navigation = push;
    const imageNotFound = "/image-not-found.jpg";

    const [oddNumberObjects, setOddNumberObjects] = useState([]);
    const [evenNumberObjects, setEvenNumberObjects] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [loadingHome, setLoadingHome] = useState(false);
    const [validatedData, setValidatedData] = useState([]);
    const productRefs = useRef({});
    const [loginUserDetail, setLoginUserDetail] = useState({});
    const [mounted, setMounted] = useState(false);

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
        if (typeof window !== "undefined") {
            try {
                const stored = sessionStorage.getItem("loginUserDetail");
                setLoginUserDetail(stored ? JSON.parse(stored) : null);
            } catch (err) {
                console.error("Failed to parse loginUserDetail:", err);
                setLoginUserDetail(null);
            }
        }
    }, []);

    const finalID = useMemo(() => {
        if (!mounted) return null;
        const visitorId = cookies.get("visitorId") ?? "0";
        const IsB2BWebsite = storeInit?.IsB2BWebsite ?? 0;
        const uid = loginUserDetail?.id || "0";
        if (IsB2BWebsite == 0) {
            return islogin === false ? visitorId : uid;
        }
        return uid;
    }, [mounted, loginUserDetail, islogin, storeInit?.IsB2BWebsite]);

    const pricingContext = useMemo(() => {
        if (!mounted) return null;

        const loginInfo = loginUserDetail;

        return {
            PackageId: (loginInfo?.PackageId ?? storeInit?.PackageId) ?? "",
            Laboursetid:
                !islogin
                    ? storeInit?.pricemanagement_laboursetid
                    : loginInfo?.pricemanagement_laboursetid ?? "",
            diamondpricelistname:
                !islogin
                    ? storeInit?.diamondpricelistname
                    : loginInfo?.diamondpricelistname ?? "",
            colorstonepricelistname:
                !islogin
                    ? storeInit?.colorstonepricelistname
                    : loginInfo?.colorstonepricelistname ?? "",
        };
    }, [mounted, loginUserDetail, storeInit, islogin]);



    useEffect(() => {
        if (!mounted) return;
        const storeInit = typeof window !== "undefined" ? sessionStorage.getItem("StoreInit") : null;
        if (!finalID) return;
        callAPI(finalID);
    }, [mounted, finalID]);


    const callAPI = async (id) => {
        const { key, meta } = buildAlbumCacheKey("trending_", storeInit, pricingContext, id);
        setLoadingHome(true);

        try {
            const cachedRes = await fetch(`/api/cache?key=${key}`);
            const cached = await cachedRes.json();

            if (cached?.cached && Array.isArray(cached.data) && cached.data.length > 0) {
                console.log("🔥 Using cached data", cached.data.length);
                const records = cached.data;
                const oddNumbers = records.filter((obj) => isOdd(obj.SrNo));
                const evenNumbers = records.filter((obj) => !isOdd(obj.SrNo));

                setTrandingViewData(records);
                setOddNumberObjects(oddNumbers);
                setEvenNumberObjects(evenNumbers);
                return; // ✅ stop here, no API call needed
            }

            console.log("🌐 No cache — fetching trending data from API");
            const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETTrending", id);

            const records = response?.Data?.rd ?? [];
            const oddNumbers = records.filter((obj) => isOdd(obj.SrNo));
            const evenNumbers = records.filter((obj) => !isOdd(obj.SrNo));

            setTrandingViewData(records);
            setOddNumberObjects(oddNumbers);
            setEvenNumberObjects(evenNumbers);

            // 3️⃣ Write to cache (fire-and-forget)
            if (records.length > 0) {
                fetch("/api/cache", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key, data: records, meta }),
                }).catch((err) => console.warn("⚠️ Cache write failed:", err));
            }
        } catch (error) {
            console.error("❌ callAPI error:", error);
            setTrandingViewData([]);
            setOddNumberObjects([]);
            setEvenNumberObjects([]);
        } finally {
            setLoadingHome(false);
        }
    };



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

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = pako.deflate(uint8Array, { to: "string" });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error("Error compressing and encoding:", error);
            return null;
        }
    };
    const handleNavigation = (designNo, autoCode, titleLine, index) => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit")) ?? "";
        const { IsB2BWebsite } = storeInit;

        let obj = {
            a: autoCode,
            b: designNo,
            m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid,
            f: {},
        };
        sessionStorage.setItem("scrollToProduct3", `product-${index}`);
        let encodeObj = compressAndEncode(JSON.stringify(obj));
        // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
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
                                    <div className="smr_btimageDiv" onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine, index)}>
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
