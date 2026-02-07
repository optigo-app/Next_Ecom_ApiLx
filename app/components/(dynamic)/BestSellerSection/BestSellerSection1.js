"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./BestSellerSection1.scss";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import cookies from "js-cookie";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";



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


const BestSellerSection1 = ({ data, storeData }) => {
  const { push } = useNextRouterLikeRR();
  const { islogin } = useStore();
  const bestSallerRef = useRef(null);
  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState("");
  const [storeInit, setStoreInit] = useState({});
  const [isLoding, setIsLoding] = useState(true);
  const navigation = push;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loadingHome, setLoadingHome] = useState(true);
  const [validatedData, setValidatedData] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loginUserDetail, setLoginUserDetail] = useState({});

  const productRefs = useRef({});
  const imageNotFound = "./Assets/image-not-found.jpg";

  useEffect(() => {
    setStoreInit(storeData);
  }, []);

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
    const IsB2BWebsite = storeData?.IsB2BWebsite ?? 0;
    const uid = loginUserDetail?.id || "0";
    if (IsB2BWebsite == 0) {
      return islogin === false ? visitorId : uid;
    }
    return uid;
  }, [mounted, loginUserDetail, islogin, storeData?.IsB2BWebsite]);

   const pricingContext = useMemo(() => {
    if (!mounted) return null;
    const loginInfo = loginUserDetail;
  
    return {
      PackageId: (loginInfo?.PackageId ?? storeData?.PackageId) ?? "",
      Laboursetid:
           !islogin 
          ? storeData?.pricemanagement_laboursetid
          : loginInfo?.pricemanagement_laboursetid ?? "",
      diamondpricelistname:
           !islogin 
          ? storeData?.diamondpricelistname
          : loginInfo?.diamondpricelistname ?? "",
      colorstonepricelistname:
           !islogin 
          ? storeData?.colorstonepricelistname
          : loginInfo?.colorstonepricelistname ?? "",
    };
  }, [mounted, loginUserDetail, storeData, islogin]);
  
  

  const callAllApi = async (id) => {
    console.log("🚀 ~ callAllApi ~ pricingContext:", pricingContext)
      const {key ,meta} = buildAlbumCacheKey("bestseller_" ,storeData, pricingContext, id);


    try {
      setLoadingHome(false);
      const cachedRes = await fetch(`/api/cache?key=${key}`);
      const cached = await cachedRes.json();
      if (cached.cached && Array.isArray(cached.data)) {
         setBestSellerData(cached?.data);
        return cached?.data;
      }
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETBestSeller", id);
      const rows = res?.Data?.rd || [];
      if (Array.isArray(rows) && rows.length > 0) {
        setBestSellerData(rows);
        fetch("/api/cache", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, data: rows ,meta }),
        }).catch(console.error);
      } else {
        setBestSellerData([]);
      }
    } catch (error) {
      console.log("🚀 ~ callAllApi ~ error:", error);
      setBestSellerData([]);
    } finally {
      setLoadingHome(false);
    }

  };

  useEffect(() => {
    if (!mounted) return;
    const storeInit = typeof window !== "undefined" ? sessionStorage.getItem("StoreInit") : null;
    if (!finalID) return;
    callAllApi(finalID);
  }, [finalID, mounted]);

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

  return (
    <div>
      <div>
        {bestSellerData?.length != 0 && (
          <div className="smr_mainBestSeler1Div">
            <div className="smr_bestseler1TitleDiv">
              <span className="smr_bestseler1Title">BEST SELLER</span>
            </div>
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
              <div className="smr_rightSideBestSeler">
                {/* <img src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/clothing-look-44.jpg?v=1638651514&width=4000" alt="modalimages" /> */}
                {/* <img src={`${storImagePath()}/images/HomePage/BestSeller/promoSetMainBanner.png`} alt="modalimages" /> */}
                <img src={data?.image[0]} alt="modalimages" draggable={true} onContextMenu={(e) => e.preventDefault()} />
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
