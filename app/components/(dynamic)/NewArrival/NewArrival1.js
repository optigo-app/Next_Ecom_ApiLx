"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./NewArrival1.scss";
import { Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import Cookies from "js-cookie";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import cookies from "js-cookie";
import SonaHeader from "@/app/theme/fgstore.web/home/Header";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import Link from 'next/link';



const NewArrival = ({ data, storeInit }) => {
  const { islogin, loginUserDetail } = useStore();
  const { push } = useNextRouterLikeRR();
  const { cacheList, setCacheList } = useMaster();
  const newArrivalRef = useRef(null);
  const [newArrivalData, setNewArrivalData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const navigation = push;
  const [isLoading, setIsLoading] = useState(true);
  const [validatedData, setValidatedData] = useState([]);
  const productRefs = useRef({});
  const imageNotFound = `/image-not-found.jpg`;
  const [mounted, setMounted] = useState(false);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  useEffect(() => {
    setImageUrl(storeInit?.CDNDesignImageFolThumb);
    setMounted(true);
  }, [storeInit?.CDNDesignImageFolThumb]);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);

  const fetchAndSetNewArrivals = useCallback(async (finalID, precomputedKey) => {
    if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

    const apiALC = "";
    const keyALC = normalizeALC("");
    const eventName = "fg_newarrival";

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

      console.log("[NewArrival] Cache check:", { key: effectiveKey, localCached: localCacheMeta?.cached, serverRebuild: serverCacheRebuildDate, localRebuild: localCacheRebuildDate });

      // Step 2: Use cache if valid
      if (localCacheMeta?.cached) {
        const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
        const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

        if (canValidate && datesMatch) {
          const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
          const cached = await cachedRes.json();
          if (cached.cached && Array.isArray(cached.data)) {
            console.log("[NewArrival] Serving from cache");
            setNewArrivalData(cached.data);
            setIsLoading(false);
            isFetchingRef.current = false;
            return;
          }
        }
        fetch(`/api/v1/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
      }

      // Step 3: API Fallback
      console.log("[NewArrival] Calling API...");
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETNewArrival", finalID);
      const apiData = res?.Data?.rd || [];

      if (Array.isArray(apiData) && apiData.length > 0) {
        setNewArrivalData(apiData);
      } else {
        setNewArrivalData([]);
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
          console.error("[NewArrival] Cache update failed:", cacheErr);
        }
      }
    } catch (error) {
      console.error("[NewArrival] Error fetching new arrivals:", error);
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
      const { key } = buildAlbumCacheKey("fg_newarrival", storeInit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetNewArrivals(finalID, key);
    };

    fetchData();
  }, [mounted, islogin, pricingContext, storeInit, fetchAndSetNewArrivals, loginUserDetail?.id, cacheList]);

  const checkImageAvailability = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(imageNotFound);
      img.src = url;
    });
  };

  const validateImageURLs = async () => {
    if (!newArrivalData?.length) return;
    const validatedData = await Promise.all(
      newArrivalData.map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.jpg`;
        return { ...item, validatedImageURL: imageURL };
      })
    );
    setValidatedData(validatedData);
  };

  useEffect(() => {
    validateImageURLs();
  }, [newArrivalData]);

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
    sessionStorage.setItem("scrollToProduct2", `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`);
  };

  useEffect(() => {
    const scrollDataStr = sessionStorage.getItem("scrollToProduct2");
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
        sessionStorage.removeItem("scrollToProduct2");
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(tryScroll, 200); // retry until ref is ready
      }
    };

    tryScroll();
  }, [newArrivalData]);

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };


  if (newArrivalData.length === 0) return null;


  return (
    <div
      ref={newArrivalRef}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      style={{
        marginBottom: "2rem",
        marginTop: "2rem"
      }}
    >
      {validatedData?.length != 0 && (
        <div className="smr_newwArr1MainDiv">
          {/* <Typography variant="h5" className="smrN_NewArr1Title">
            NEW ARRIVAL
            <Link sx={{ marginLeft: "10px !important", fontSize: "18px", color: "gray" }} onClick={() => navigation(`/p/NewArrival/?N=${btoa("NewArrival")}`)}>
              View more
            </Link>
          </Typography> */}
          <SonaHeader title="New Arrival" isShowViewMore={false} viewAll={() => navigation(`/p/NewArrival/?N=${btoa("NewArrival")}`)} />

          <Grid container spacing={1} className="smr_NewArrival1product-list">
            {validatedData?.slice(0, 4)?.map((product, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }} key={index}>
                <Card className="smr_NewArrproduct-card" onClick={() => handleNavigation(product, index)}>
                  <div className="smr_newArr1Image">
                    <CardMedia
                      component="img"
                      className="smr_newArrImage"
                      // image="https://www.bringitonline.in/uploads/2/2/4/5/22456530/female-diamond-necklace-jewellery-photoshoot-jewellery-photography-jewellery-photographers-jewellery-model-shoot-jewellery-product-shoot-bringitonline_orig.jpeg"
                      image={
                        product?.ImageCount >= 1
                          ? product?.validatedImageURL
                          : // `${imageUrl}${newArrivalData && product?.designno}~1.${newArrivalData && product?.ImageExtension}`
                          imageNotFound
                      }
                      alt={product?.TitleLine}
                      id={`product-${index}`}
                      ref={(el) => (productRefs.current[`product-${index}`] = el)}
                      draggable={true}
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.target.src = imageNotFound;
                      }}
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="smr_newarrproduct-info">
                    <Typography className="smr_newArrTitle">
                      {product?.designno}
                      {formatTitleLine(product?.TitleLine) && " - "}
                      {formatTitleLine(product?.TitleLine) && product?.TitleLine}
                    </Typography>
                    <Typography variant="body2">
                      {storeInit?.IsGrossWeight == 1 && (
                        <>
                          <span className="smr_lb3detailDT">GWT: </span>
                          <span className="smr_lb3detailDT">{(product?.Gwt || 0)?.toFixed(3)}</span>
                        </>
                      )}
                      {Number(product?.Nwt) !== 0 && (
                        <>
                          <span className="smr_lb3pipe"> | </span>
                          <span className="smr_lb3detailDT">NWT : </span>
                          <span className="smr_lb3detailDT">{(product?.Nwt || 0)?.toFixed(3)}</span>
                        </>
                      )}
                      {storeInit?.IsDiamondWeight == 1 && (
                        <>
                          {(product?.Dwt != "0" || product?.Dpcs != "0") && (
                            <>
                              <span className="smr_lb3pipe"> | </span>
                              <span className="smr_lb3detailDT">DWT: </span>
                              <span className="smr_lb3detailDT">
                                {(product?.Dwt || 0)?.toFixed(3)} / {product?.Dpcs || 0}
                              </span>
                            </>
                          )}
                        </>
                      )}
                      {storeInit?.IsStoneWeight == 1 && (
                        <>
                          {(product?.CSwt != "0" || product?.CSpcs != "0") && (
                            <>
                              <span className="smr_lb3pipe"> | </span>
                              <span className="smr_lb3detailDT">CWT: </span>
                              <span className="smr_lb3detailDT">
                                {(product?.CSwt || 0)?.toFixed(3)} / {product?.CSpcs || 0}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </Typography>
                    {storeInit?.IsPriceShow == 1 && (
                      <p className="smr_newArrPrice">
                        <span
                          className="smr_currencyFont"
                          dangerouslySetInnerHTML={{
                            __html: decodeEntities(islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode),
                          }}
                        />{" "}
                        {formatter(product?.UnitCostWithMarkUp)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default NewArrival;
