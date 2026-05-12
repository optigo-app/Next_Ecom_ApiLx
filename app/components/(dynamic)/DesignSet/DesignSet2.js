"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./DesignSet2.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import gradientColors from "./color.json";
import {
  formatRedirectTitleLine,
  formatter,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import cookies from "js-cookie";
import SonaHeader from "@/app/theme/fgstore.web/home/Header";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";








const DesignSet2 = ({ data, storeInit }) => {
  const location = useNextRouterLikeRR();
  const { islogin, loginUserDetail } = useStore();
  const designSetRef = useRef(null);
  const navigate = location.push;
  const [imageUrl, setImageUrl] = useState();
  const [designSetList, setDesignSetList] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [imageUrlDesignSet, setImageUrlDesignSet] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const productRefs = useRef({});
  const scrollRetries = useRef(0);
  const maxRetries = 10;
  const imageNotFound = `/Assets/image-not-found.jpg`;
  const [mounted, setMounted] = useState(false);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");


  useEffect(() => {
    setImageUrl(storeInit?.CDNDesignImageFol);
    setImageUrlDesignSet(storeInit?.CDNDesignImageFolThumb);
    setMounted(true);
  }, [storeInit?.CDNDesignImageFol, storeInit?.CDNDesignImageFolThumb]);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);





  const fetchAndSetDesignSets = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        // Step 1: Check server-side disk cache (12h TTL)
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[DesignSet2] Serving from cache");
          setDesignSetList(cacheRes.data);
          setIsLoading(false);
          isFetchingRef.current = false;
          return;
        }

        // Step 2: Cache miss — call API
        console.log("[DesignSet2] Cache miss, calling API...");
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETDesignSet_List", finalID);
        const apiData = res?.Data?.rd || [];

        if (Array.isArray(apiData) && apiData.length > 0) {
          setDesignSetList(apiData);

          // Step 3: Save to server cache (fire-and-forget, 12h TTL)
          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setDesignSetList([]);
        }

        setIsLoading(false);
        isFetchingRef.current = false;
      } catch (error) {
        console.error("[DesignSet2] Error fetching design sets:", error);
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [pricingContext, storeInit]
  );

  useEffect(() => {
    if (!mounted || !pricingContext || !storeInit) return;

    const fetchData = async () => {
      const visitorId = cookies.get("visiterId") ?? "0";
      const IsB2BWebsite = storeInit?.IsB2BWebsite ?? 0;
      const uid = loginUserDetail?.id || "0";
      const finalID = IsB2BWebsite == 0 ? (islogin === false ? visitorId : uid) : uid;

      const { key } = buildAlbumCacheKey("fg_designset", storeInit, pricingContext, finalID, normalizeALC(""));

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetDesignSets(finalID, key);
    };

    fetchData();
  }, [mounted, islogin, pricingContext, storeInit, fetchAndSetDesignSets, loginUserDetail?.id]);

  const ProdCardImageFunc = (pd) => {
    let finalprodListimg;
    if (pd?.DefaultImageName) {
      finalprodListimg =
        imageUrl + pd?.designsetuniqueno + "/" + pd?.DefaultImageName;
    } else {
      finalprodListimg = imageNotFound;
    }
    return finalprodListimg;
  };

  const getRandomBgColor = (index) => {
    const colorsLength = gradientColors.length;
    return gradientColors[index % colorsLength];
  };

  const parseDesignDetails = (details) => {
    try {
      let finalArr = JSON.parse(details);
      return finalArr;
    } catch (error) {
      console.error("Error parsing design details:", error);
      return [];
    }
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
    sessionStorage.setItem('scrollToProduct4', `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigate(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`);
  };

  useEffect(() => {
    const scrollDataStr = sessionStorage.getItem("scrollToProduct4");
    if (!scrollDataStr) return;

    const scrollToElement = () => {
      const targetElement = document.querySelector(`[name='${scrollDataStr}']`);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;

        const topOffset = 142;

        window.scrollTo({
          top: offsetTop - topOffset,
          behavior: "smooth",
        });

        sessionStorage.removeItem("scrollToProduct4");
        scrollRetries.current = 0;

        // Optional: re-scroll on resize if the element layout shifts
        const resizeObserver = new ResizeObserver(() => {
          const newRect = targetElement.getBoundingClientRect();
          const newOffsetTop = window.pageYOffset + newRect.top;
          window.scrollTo({
            top: newOffsetTop - topOffset,
            // top: newOffsetTop,
            behavior: "smooth",
          });
        });

        resizeObserver.observe(targetElement);
        return () => resizeObserver.disconnect();
      } else if (scrollRetries.current < maxRetries) {
        scrollRetries.current++;
        setTimeout(scrollToElement, 300); // try again after 300ms
      } else {
        console.warn("Max scroll retries reached. Element not found.");
      }
    };

    // Delay initial call to allow component to mount fully
    setTimeout(scrollToElement, 300);
  }, [designSetList?.length > 0, location.pathname]);

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handlePrevious = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  const handleNavigate = (e) => {
    if (islogin) {
      if (e.button === 0 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        navigate("/Lookbook");
      }
    } else {
      navigate("/LoginOption");
    }
  };

  const ShowButton = () => {
    const results = designSetList?.slice(0, 1)?.map((slide, index) => {
      return parseDesignDetails(slide?.Designdetail);
    });
    return results[0]?.length > 1;
  };

  if (designSetList?.length === 0) return null;

  return (
    <>
      <div className="smr_DesignSet2MainDiv" ref={designSetRef} onContextMenu={(e) => { e.preventDefault() }}>
        {designSetList?.length !== 0 && (
          <>
            <SonaHeader
              title="Complete Your Look"
              isShowViewMore={false}
              viewAll={(e) => handleNavigate(e)}
            />
            {/* <div className="smr_DesignSetTitleDiv">
              <p className="smr1_desognSetTitle">
                COMPLETE YOUR LOOK
                {((storeInit?.IsB2BWebsite !== 1) || (storeInit?.IsB2BWebsite === 1 && islogin)) && (
                  <span onClick={(e) => handleNavigate(e)}>
                    <a href="/Lookbook" className="smr_designSetViewmoreBtn_2">
                      View More
                    </a>
                  </span>
                )}
            

              </p>
            </div> */}
            {/* <Swiper
              className="mySwiper"
              spaceBetween={5}
              slidesPerView={1}
              speed={1000}
              loop={false}
              navigation={true}
              modules={[Navigation]}
            > */}
            {designSetList?.slice(0, 1)?.map((slide, index) => (
              // <SwiperSlide key={`slide-${index}`}>
              <div
                key={index}
                style={{
                  position: "relative",
                }}
                className="maindiv"
              >
                {ProdCardImageFunc(slide) ? (
                  <img
                    // src={ProdCardImageFunc(slide)}
                    // src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/clothing-look-26.jpg?height=1366&v=1638651514&width=2048"
                    // src={`${storImagePath()}/images/HomePage/DesignSetBanner/BottomBannerDesignSet1.png`}
                    src={data?.image[0]}
                    alt="Design Set"
                    className="imgBG"
                    draggable={true}
                    onContextMenu={(e) => e.preventDefault()}
                    id={`product-${index}`}
                    ref={(el) => (productRefs.current[`product-${index}`] = el)}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      ...getRandomBgColor(index),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    className="imgBG"
                  >
                    <p
                      style={{
                        fontSize: "30px",
                        color: getRandomBgColor(index).color,
                      }}
                    >
                      {slide?.designsetno}
                    </p>
                  </div>
                )}
                {/* <p className="smr_lb3designList_title">{slide?.designsetno}</p> */}
                <div className="subimgpart">
                  <div className="card">
                    <Swiper
                      className="swiper_w"
                      spaceBetween={5}
                      slidesPerView={1}
                      speed={1000}
                      onSwiper={setSwiper}
                    >
                      {slide?.Designdetail && (
                        <>
                          {parseDesignDetails(slide?.Designdetail)?.map(
                            (detail, subIndex) => (
                              <SwiperSlide key={`detail-${subIndex}`}>
                                <div className="centerall">
                                  <div className="smr_ds2ImageDiv">
                                    <img
                                      loading="lazy"

                                      // src={`${imageUrlDesignSet}${detail?.designno}~1.${detail?.ImageExtension}`}
                                      src={`${imageUrlDesignSet}${detail?.designno}~1.jpg`}
                                      alt={`Sub image ${subIndex} for slide ${index}`}
                                      name={`product-${index}`}
                                      onClick={() =>
                                        handleNavigation(
                                          detail,
                                          index
                                        )
                                      }
                                      draggable={true}
                                      onContextMenu={(e) => e.preventDefault()}
                                      onError={(e) => {
                                        e.target.src = imageNotFound;
                                        e.target.alt = "no-image-found";
                                      }}
                                      className="cardimg"
                                    />
                                  </div>
                                </div>
                                <div className="fs1 centerall">
                                  {detail?.designno}{" "}
                                  {detail?.TitleLine && " - "}{" "}
                                  {detail?.TitleLine != "" && detail?.TitleLine}
                                </div>
                                {storeInit?.IsPriceShow == 1 && <div className="fs2 centerall">
                                  <p>
                                    <span
                                      className="smr_currencyFont"
                                      dangerouslySetInnerHTML={{
                                        __html: decodeEntities(
                                          islogin
                                            ? loginUserDetail?.CurrencyCode
                                            : storeInit?.CurrencyCode
                                        ),
                                      }}
                                    />{" "}
                                    {formatter(detail?.UnitCostWithMarkUp)}
                                  </p>
                                </div>}
                                {/* <div className="fs3 centerall"
                                onClick={() =>
                                  handleNavigation(
                                    detail?.designno,
                                    detail?.autocode,
                                    detail?.TitleLine ? detail?.TitleLine : ""
                                  )
                                }>View Details</div> */}
                              </SwiperSlide>
                            )
                          )}
                        </>
                      )}
                    </Swiper>
                  </div>
                  {ShowButton() && (
                    <div className="btnflex">
                      <button className="btncst" onClick={handlePrevious}>
                        &lt;
                      </button>
                      <button className="btncst" onClick={handleNext}>
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              </div>
              // </SwiperSlide>
            ))}
            {/* </Swiper> */}
          </>
        )}
      </div>
    </>
  );
};

export default DesignSet2;
