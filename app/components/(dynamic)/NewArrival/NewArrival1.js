"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./NewArrival1.scss";
import { Grid, Typography, Card, CardContent, CardMedia, Link } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import Cookies from "js-cookie";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import cookies from "js-cookie";

const buildAlbumCacheKey = ( type ,storeData, pricing, id) => {
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


const NewArrival = ({ data, storeInit }) => {
  const { islogin } = useStore();
  const { push } = useNextRouterLikeRR();
  const newArrivalRef = useRef(null);
  const [newArrivalData, setNewArrivalData] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const navigation = push;
  const [ring1ImageChange, setRing1ImageChange] = useState(false);
  const [ring2ImageChange, setRing2ImageChange] = useState(false);
  const [loadingHome, setLoadingHome] = useState(true);
  const [validatedData, setValidatedData] = useState([]);
  const productRefs = useRef({});
  const imageNotFound = `./image-not-found.jpg`;
  const [loginUserDetail, setLoginUserDetail] = useState({});
  const [mounted, setMounted] = useState(false);

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
         (!islogin
          ? storeInit?.pricemanagement_laboursetid
          : loginInfo?.pricemanagement_laboursetid ) ?? "",
      diamondpricelistname:
         (!islogin
          ? storeInit?.diamondpricelistname
          : loginInfo?.diamondpricelistname) ?? "",
      colorstonepricelistname:
         (!islogin
          ? storeInit?.colorstonepricelistname
          : loginInfo?.colorstonepricelistname) ?? "",
    };
    }, [mounted, loginUserDetail, storeInit, islogin]);
    

const callAPI = async (id) => {
  try {
    const { key, meta } = buildAlbumCacheKey(
      "newArrival_",
      storeInit,
      pricingContext,
      id
    );

    // 1️⃣ Check cache
    const cachedRes = await fetch(
      `/api/cache?key=${encodeURIComponent(key)}`
    );
    const cached = await cachedRes.json();

    if (cached.cached && Array.isArray(cached.data)) {
      console.log("🔥 Using cached data", cached.data);
      setNewArrivalData(cached.data);
      setLoadingHome(false);
      return;
    }

    // 2️⃣ Fetch fresh
    const res = await Get_Tren_BestS_NewAr_DesigSet_Album(
      storeInit,
      "GETNewArrival",
      id
    );

    const rows = res?.Data?.rd || [];

    fetch("/api/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data: rows, meta }),
    }).catch(console.error);

    // 4️⃣ Update UI
    setNewArrivalData(rows);
    setLoadingHome(false);
  } catch (error) {
    console.error("❌ NewArrival error:", error);
    setNewArrivalData([]);
    setLoadingHome(false);
  }
};

  // const callAPI = async (id) => {
    
  //      const {key ,meta} = buildAlbumCacheKey("newArrival_" ,storeInit, pricingContext, id);
  //   try {
  //     let rows = [];
  //      const cachedRes = await fetch(`/api/cache?key=${key}`);
  //     const cached = await cachedRes.json();
  //     if (cached.cached && Array.isArray(cached.data)) {
  //       console.log("🔥 Using cached data", cached.data);
  //       return cached.data;
  //     }else{
  //     const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETNewArrival", id);
  //     fetch("/api/cache", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ key, data: rows ,meta }),
  //       }).catch(console.error);
  //     rows = res?.Data?.rd || [];
  //     }
  //     if (Array.isArray(rows) && rows.length > 0) {
  //       setNewArrivalData(rows);
  //       setLoadingHome(false);
  //     } else {
  //       setNewArrivalData([]);
  //       setLoadingHome(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoadingHome(false);
  //   }
  // };

  useEffect(() => {
    if (!mounted) return;
    const storeInit = typeof window !== "undefined" ? sessionStorage.getItem("StoreInit") : null;
    if (!finalID) return;
    callAPI(finalID);
  }, [mounted, finalID]);

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

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem("scrollToProduct2", `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
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

  const handleMouseEnterRing1 = (data) => {
    if (data?.ImageCount > 1) {
      setRing1ImageChange(true);
    }
  };
  const handleMouseLeaveRing1 = () => {
    setRing1ImageChange(false);
  };

  const handleMouseEnterRing2 = (data) => {
    if (data?.ImageCount > 1) {
      setRing2ImageChange(true);
    }
  };
  const handleMouseLeaveRing2 = () => {
    setRing2ImageChange(false);
  };

  return (
    <div
      ref={newArrivalRef}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {validatedData?.length != 0 && (
        <div className="smr_newwArr1MainDiv">
          <Typography variant="h5" className="smrN_NewArr1Title">
            NEW ARRIVAL
            <Link sx={{ marginLeft: "10px !important", fontSize: "18px", color: "gray" }} onClick={() => navigation(`/p/NewArrival/?N=${btoa("NewArrival")}`)}>
              View more
            </Link>
          </Typography>
          <Grid container spacing={1} className="smr_NewArrival1product-list">
            {validatedData?.slice(0, 4)?.map((product, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }} key={index}>
                <Card className="smr_NewArrproduct-card" onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)}>
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
