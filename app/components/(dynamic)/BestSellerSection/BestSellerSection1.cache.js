"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./BestSellerSection1.scss";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import cookies from "js-cookie";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import SonaHeader from "@/app/theme/fgstore.web/home/Header";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";





const BestSellerSection1 = ({ data, storeData }) => {
  const { push } = useNextRouterLikeRR();
  const { islogin, loginUserDetail } = useStore();
  const { cacheList, setCacheList } = useMaster();
  const bestSallerRef = useRef(null);
  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = push;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [validatedData, setValidatedData] = useState([]);
  const [mounted, setMounted] = useState(false);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const productRefs = useRef({});
  const imageNotFound = "./Assets/image-not-found.jpg";


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  useEffect(() => {
    setMounted(true);
    setImageUrl(storeData?.CDNDesignImageFolThumb);
  }, [storeData?.CDNDesignImageFolThumb]);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeData, islogin), [loginUserDetail, storeData, islogin]);


  const fetchAndSetBestSellers = useCallback(async (finalID, precomputedKey) => {
    if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

    const apiALC = "";
    const keyALC = normalizeALC("");
    const eventName = "fg_bestseller";

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

      console.log("[BestSellerSection1] Cache check:", { key: effectiveKey, localCached: localCacheMeta?.cached, serverRebuild: serverCacheRebuildDate, localRebuild: localCacheRebuildDate });

      // Step 2: Use cache if valid
      if (localCacheMeta?.cached) {
        const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
        const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

        if (canValidate && datesMatch) {
          const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
          const cached = await cachedRes.json();
          if (cached.cached && Array.isArray(cached.data)) {
            console.log("[BestSellerSection1] Serving from cache");
            setBestSellerData(cached.data);
            setIsLoading(false);
            isFetchingRef.current = false;
            return;
          }
        }
        fetch(`/api/v1/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
      }

      // Step 3: API Fallback
      console.log("[BestSellerSection1] Calling API...");
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETBestSeller", finalID);
      const apiData = res?.Data?.rd || [];

      if (Array.isArray(apiData) && apiData.length > 0) {
        setBestSellerData(apiData);
      } else {
        setBestSellerData([]);
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
          console.error("[BestSellerSection1] Cache update failed:", cacheErr);
        }
      }
    } catch (error) {
      console.error("[BestSellerSection1] Error fetching best sellers:", error);
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [pricingContext, storeData, cacheList, setCacheList]);

  useEffect(() => {
    if (!mounted || !pricingContext || !storeData || cacheList === null) return;

    const fetchData = async () => {
      const visitorId = cookies.get("visiterId") ?? "0";
      const IsB2BWebsite = storeData?.IsB2BWebsite ?? 0;
      const uid = loginUserDetail?.id || "0";
      const finalID = IsB2BWebsite == 0 ? (islogin === false ? visitorId : uid) : uid;

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("fg_bestseller", storeData, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetBestSellers(finalID, key);
    };

    fetchData();
  }, [mounted, islogin, pricingContext, storeData, fetchAndSetBestSellers, loginUserDetail?.id, cacheList]);

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

  const checkImageAvailability = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(imageNotFound);
      img.src = url;
    });
  };

  const validateImageURLs = async () => {
    if (!bestSellerData?.length) return;
    const validatedData = await Promise.all(
      bestSellerData.map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.jpg`;
        // const imageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension}`;
        // const validatedURL = await checkImageAvailability(imageURL);
        return { ...item, validatedImageURL: imageURL };
      })
    );
    setValidatedData(validatedData);
  };

  useEffect(() => {
    validateImageURLs();
  }, [bestSellerData]);

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem("scrollToProduct1", `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`);
    navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  useEffect(() => {
    const scrollDataStr = sessionStorage.getItem("scrollToProduct1");
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
        sessionStorage.removeItem("scrollToProduct1");
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(tryScroll, 200); // retry until ref is ready
      }
    };

    tryScroll();
  }, [bestSellerData]);

  const handleMouseEnterRing1 = (data) => {
    if (data?.ImageCount > 1) {
      setHoveredItem(data.SrNo);
    }
  };
  const handleMouseLeaveRing1 = () => {
    setHoveredItem(null);
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const chunkedData = [];
  for (let i = 0; i < bestSellerData?.length; i += 3) {
    chunkedData.push(bestSellerData?.slice(i, i + 3));
  }


  if (bestSellerData.length === 0) return null;


  return (
    <div>
      <div>
        {bestSellerData?.length != 0 && (
          <div className="fg_smr_mainBestSeler1Div">
            {/* <div className="smr_bestseler1TitleDiv">
              <span className="smr_bestseler1Title">BEST SELLER</span>
            </div> */}
            <SonaHeader title="Best Seller" isShowViewMore={true} />

            <div className="product-grid">
              <div className="smr_leftSideBestSeler">
                {validatedData?.slice(0, 4).map((data, index) => (
                  <div key={index} className="product-card">
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
                        alt={`product-${index}`}
                        draggable={true}
                        onContextMenu={(e) => e.preventDefault()}
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}

                        loading="lazy"
                      />
                    </div>
                    <div className="product-info">
                      <h3>
                        {data?.designno !== "" && data?.designno} {formatTitleLine(data?.TitleLine) && " - " + data?.TitleLine}
                      </h3>
                      {storeData?.IsGrossWeight == 1 && (
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
                      {storeData?.IsDiamondWeight == 1 && (
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
                      {storeData?.IsStoneWeight == 1 && (
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
                      {storeData?.IsPriceShow == 1 && (
                        <p>
                          <span className="smr_currencyFont">{islogin ? loginUserDetail?.CurrencyCode : storeData?.CurrencyCode}</span>&nbsp;
                          <span>{formatter(data?.UnitCostWithMarkUp)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="smr_rightSideBestSeler">
                {/* <img src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/clothing-look-44.jpg?v=1638651514&width=4000" alt="modalimages" /> */}
                {/* <img src={`${storImagePath()}/images/HomePage/BestSeller/promoSetMainBanner.png`} alt="modalimages" /> */}
                <img
                  src={data?.image[0]}
                  alt="Best Seller Collection Banner"
                  draggable={true}
                  onContextMenu={(e) => e.preventDefault()}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1000}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div className="smr_lookbookImageRightDT">
                  {/*    not need for maiora  */}
                  {/* <p>SHORESIDE COLLECTION</p>
                                    <h2>FOR LOVE OF SUN & SEA</h2> */}
                  <button onClick={() => navigation(`/p/BestSeller/?B=${btoa("BestSeller")}`)}>SHOP COLLECTION</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellerSection1;
