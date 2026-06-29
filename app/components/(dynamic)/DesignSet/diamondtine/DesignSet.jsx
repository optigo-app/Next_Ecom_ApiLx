"use client";
import React, { useEffect, useRef, useState } from "react";
import "./DesignSet2.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Pako from 'pako';
import Cookies from 'js-cookie';
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
 import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const DesignSet2 = ({ data }) => {
  const designSetRef = useRef(null);
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const [imageUrl, setImageUrl] = useState();
  const [designSetList, setDesignSetList] = useState([]);
  const [storeInit, setStoreInit] = useState({});
    const { islogin, loginUserDetail } = useStore();
  const [swiper, setSwiper] = useState(null);
  const [imageUrlDesignSet, setImageUrlDesignSet] = useState();
 
  const productRefs = useRef({});

  const gradientColors = [
    {
      "background": "linear-gradient(135deg, #4ca1af → #c4e0e5)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #ffafbd, #ffdde1)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #eacda3 , #494150)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #d66d75, #e29587)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #dd5e89, #f7bb97)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #eecda3, #ef629f)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #eacda3, #d6ae7b)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #ddd6f3, #faaca8)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #ba5370, #f4e2d8)",
      "color": "#FFFFFF"
    },
    {
      "background": "linear-gradient(135deg, #ffd89b, #19547b)",
      "color": "#FFFFFF"
    }
  ]

     useEffect(() => {
  
          const visiterID = Cookies.get('visiterId');
          let finalID;
          if (storeInit?.IsB2BWebsite == 0) {
              finalID = islogin === false ? visiterID : (loginUserDetail?.id || '0');
          } else {
              finalID = loginUserDetail?.id || '0';
          }
  
          setImageUrl(storeInit?.DesignSetImageFol);
  
          Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, 'GETDesignSet', finalID)
              .then((response) => {
                  if (response?.Data?.rd) {
                      setDesignSetList(response?.Data?.rd);
                  }
              })
              .catch((err) => console.log(err));
      }, []);

  

  const ProdCardImageFunc = (pd) => {
    let finalprodListimg;
    if (pd?.DefaultImageName) {
      finalprodListimg = imageUrl + pd?.designsetuniqueno + '/' + pd?.DefaultImageName;
    } else {
      finalprodListimg = "/image-not-found.jpg";
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
      const compressed = Pako.deflate(uint8Array, { to: 'string' });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error('Error compressing and encoding:', error);
      return null;
    }
  };

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    GoogleAnalytics.event({
      action: "Navigate to Product Detail",
      category: `Product Interaction Through Design Set Section`,
      label: designNo || titleLine,
      value: loginUserDetail?.firstname ?? 'User Not Login',
    });
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem('scrollToProduct5', `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    // navigate(`/d/${titleLine?.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? '_' : ''}${designNo}?p=${encodeObj}`);
    navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  useEffect(() => {
    const scrollDataStr = sessionStorage.getItem('scrollToProduct5');
    if (!scrollDataStr) return;

    const maxRetries = 10;
    let retries = 0;

    const tryScroll = () => {
      const el = productRefs.current[scrollDataStr];
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        sessionStorage.removeItem('scrollToProduct5');
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(tryScroll, 200); // retry until ref is ready
      }
    };

    tryScroll();

  }, [designSetList]);

  const decodeEntities = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const redirectUrl = `/loginOption/?LoginRedirect=/Lookbook`;
  const handleNavigate = () => {
    if (storeInit?.IsB2BWebsite == 1) {
      if (islogin == true) {
        navigation("/Lookbook");
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
        navigation(redirectUrl);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    } else {
        navigation("/Lookbook");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

  }



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

  const ShowButton = () => {
    const results = designSetList?.slice(0, 1)?.map((slide, index) => {
      return parseDesignDetails(slide?.Designdetail);
    });
    return results[0]?.length > 1;
  };
  return (
    <>
      <div className="dt_DesignSet2MainDiv" ref={designSetRef} onContextMenu={(e) => e.preventDefault()}>
        {designSetList?.length !== 0 && (
          <>
            <div className='smr_DesignSetTitleDiv'>
              <p className='dt_desognSetTitle'>Complete Your Look
                <p className='dt_designSetViewmoreBtn' onClick={handleNavigate}>
                  View more
                </p>
              </p>
            </div>
            
            {designSetList?.slice(0, 1)?.map((slide, index) => (
              // <SwiperSlide key={`slide-${index}`}>
              <div
                style={{
                  position: 'relative',
                }}
                className="maindiv"
              >
                {ProdCardImageFunc(slide) ? (
                  <img
                    // src={ProdCardImageFunc(slide)}
                    // src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/clothing-look-26.jpg?height=1366&v=1638651514&width=2048"
                    // src={`${storImagePath()}/images/HomePage/DesignSet/BottomBannerDesignSet1.webp`}
                    src={"WebSiteStaticImage/Banner/smr_bestseler1Title.png"}
                    alt=""
                    className="imgBG"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
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
                    <p style={{ fontSize: "30px", color: getRandomBgColor(index).color }}>{slide?.designsetno}</p>
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
                          {parseDesignDetails(slide?.Designdetail)?.map((detail, subIndex) => (
                            <SwiperSlide key={`detail-${detail?.id}`}>
                              <div className="centerall">
                                <div className="smr_ds2ImageDiv">
                                  <img
                                    loading="lazy"
                                    // src={`${imageUrlDesignSet}${detail?.designno}~1.${detail?.ImageExtension}`}
                                    src={`${imageUrlDesignSet}${detail?.designno}~1.jpg`}
                                    alt={`Sub image ${subIndex} for slide ${index}`}
                                    onClick={() =>
                                      handleNavigation(
                                        detail?.designno,
                                        detail?.autocode,
                                        detail?.TitleLine ? detail?.TitleLine : "",
                                        subIndex
                                      )
                                    }
                                    id={`product-${subIndex}`}
                                    ref={(el) => (productRefs.current[`product-${subIndex}`] = el)}
                                    onError={(e) => {
                                      e.target.src = "/image-not-found.jpg";
                                    }}
                                    className="cardimg"

                                  />
                                </div>
                              </div>
                              <div className="fs1 centerall">{formatTitleLine(detail?.TitleLine) ? `${detail.TitleLine}` : ''}</div>
                              {storeInit?.IsPriceShow == 1 && <div className="fs2 centerall">
                                <p>
                                  <span
                                    className="smr_currencyFont"
                                    dangerouslySetInnerHTML={{
                                      __html: decodeEntities(
                                        islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode
                                      ),
                                    }}
                                  /> {formatter(detail?.UnitCostWithMarkUp)}
                                </p>
                              </div>}
                              {/* <div className="fs3 centerall">View Details</div> */}
                            </SwiperSlide>
                          ))}
                        </>
                      )}
                    </Swiper>
                  </div>
                  {ShowButton() && (
                    <div className="btnflex">
                      <button className="btncst" onClick={handlePrevious}>&lt;</button>
                      <button className="btncst" onClick={handleNext}>&gt;</button>
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
