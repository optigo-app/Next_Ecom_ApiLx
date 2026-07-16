
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
 
import Pako from "pako";
import Cookies from "js-cookie";
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import '../blocks/Css/DesignSet.module.scss'
import { formatter, formatTitleLine, formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { usePathname } from 'next/navigation';

const imageNotFound = "/image-not-found.jpg";
// MUI Imports
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  Fade
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BrandsTitle from "./BrandsTitle";
import MaxHeader from "./Header";

const gradientColors = [
  { "background": "linear-gradient(135deg, #4ca1af → #c4e0e5)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #ffafbd, #ffdde1)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #eacda3 , #494150)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #d66d75, #e29587)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #dd5e89, #f7bb97)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #eecda3, #ef629f)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #eacda3, #d6ae7b)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #ddd6f3, #faaca8)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #ba5370, #f4e2d8)", "color": "#FFFFFF" },
  { "background": "linear-gradient(135deg, #ffd89b, #19547b)", "color": "#FFFFFF" }
]

const MaxDesignSet = ({ data }) => {
  const designSetRef = useRef(null);
  const navigate = useNextRouterLikeRR();
  const pathname = usePathname();
  const [imageUrl, setImageUrl] = useState();
  const [designSetList, setDesignSetList] = useState([]);
  const [storeInit, setStoreInit] = useState({});
  const { finalId, islogin, loginUserDetail } = useStore();
  const [swiper, setSwiper] = useState(null);
  const [imageUrlDesignSet, setImageUrlDesignSet] = useState();
  const productRefs = useRef({});
  const scrollRetries = useRef(0);
  const maxRetries = 10;

  // shopthelook.jpg
  //  { slug: "Ring", image: `${storImagePath()}/Category/new-image/rings.jpg` },
  // "\\nzen\allpublish\Webstore\elvee.web\WebSiteStaticImage\Banner\shopthelook.jpg"


  const BgImg = `/WebSiteStaticImage/Banner/shopthelook.jpg`;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const callAPI = () => {
    const loginUserDetail = JSON.parse(
      sessionStorage.getItem("loginUserDetail")
    );
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (storeInit?.IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    setStoreInit(storeinit);

    let data = JSON.parse(sessionStorage.getItem("storeInit"));
    setImageUrl(data?.CDNDesignImageFol);
    setImageUrlDesignSet(data?.CDNDesignImageFolThumb);

    Get_Tren_BestS_NewAr_DesigSet_Album("GETDesignSet_List", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setDesignSetList(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    callAPI();
  }, [])

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

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem('scrollToProduct4', `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigate(
      `/d/${titleLine?.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""
      }${designNo}?p=${encodeObj}`
    );
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
        window.scrollTo({ top: offsetTop - topOffset, behavior: "smooth" });
        sessionStorage.removeItem("scrollToProduct4");
        scrollRetries.current = 0;
        const resizeObserver = new ResizeObserver(() => {
          const newRect = targetElement.getBoundingClientRect();
          const newOffsetTop = window.pageYOffset + newRect.top;
          window.scrollTo({ top: newOffsetTop - topOffset, behavior: "smooth" });
        });
        resizeObserver.observe(targetElement);
        return () => resizeObserver.disconnect();
      } else if (scrollRetries.current < maxRetries) {
        scrollRetries.current++;
        setTimeout(scrollToElement, 300);
      } else {
        console.warn("Max scroll retries reached. Element not found.");
      }
    };
    setTimeout(scrollToElement, 300);
  }, [designSetList?.length > 0, pathname ]);

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
    if (storeInit?.IsB2BWebsite != 0) {
      if (islogin) {
        if (e.button === 0 && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          navigate("/Lookbook");
        }
      } else {
        navigate("/LoginOption");
      }
    } else {
      if (e.button === 0 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        navigate("/Lookbook");
      }
    }
  };

  const ShowButton = () => {
    const results = designSetList?.slice(0, 1)?.map((slide, index) => {
      return parseDesignDetails(slide?.Designdetail);
    });
    return results[0]?.length > 1;
  };

  if(designSetList?.length !== 0 ){
    return null;
  }
  
  
   

  return (
    <Box
      ref={designSetRef}
      onContextMenu={(e) => { e.preventDefault() }}
      sx={{
        width: '95%',
        margin: '0 auto',
        padding: designSetList?.length !== 0 ? { xs: '20px 0', md: '60px 0' } : { xs: '0px 0', md: '0px 0' },
        boxSizing: 'border-box'
      }}
    >
      {designSetList?.length !== 0 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "auto", sm: "auto 1fr", md: "1fr auto 1fr" },
              alignItems: "center",
            }}
          >
            <Box sx={{
              display: { xs: "none", sm: "none", md: "block" }
            }} />
            {/* <BrandsTitle title={"Complete Your Look"} my={0} /> */}
            <Box sx={{ justifySelf: "center", textAlign: "center" }}>
              <MaxHeader title={"Complete Your Look"} alignment="center" noExtraMb={true} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifySelf: { xs: "center", sm: "end", md: "end" }, marginTop: { sm: "27px", md: "0px" }, marginBottom: { xs: "25px", sm: "0px", md: "0px" } }}>
              {((storeInit?.IsB2BWebsite !== 1) || (storeInit?.IsB2BWebsite === 1 && islogin)) && (
                <Button
                  variant="outlined"
                  onClick={(e) => handleNavigate(e)}
                  href="/Lookbook"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#333',
                      color: '#fff'
                    }
                  }}
                >
                  View More
                </Button>
              )}
            </Box>
          </Box>

          {designSetList?.slice(0, 1)?.map((slide, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: '100%',
                // Decreased height for mobile as requested
                height: { xs: '450px', sm: '600px', md: '800px' },
                borderRadius: { xs: '20px', md: '32px' },
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              {ProdCardImageFunc(slide) ? (
                <Box
                  component="img"
                  // src="https://pipeline-theme-fashion.myshopify.com/cdn/shop/files/clothing-look-26.jpg?height=1366&v=1638651514&width=2048"
                  src={BgImg}
                  alt="Design Set"
                  id={`product-${index}`}
                  ref={(el) => (productRefs.current[`product-${index}`] = el)}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={true}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    ...getRandomBgColor(index),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography variant="h2" sx={{ color: getRandomBgColor(index).color }}>
                    {slide?.designsetno}
                  </Typography>
                </Box>
              )}

              <Fade in={true} timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    zIndex: 2,

                    // --- RESPONSIVE POSITIONS ---
                    // Mobile: Anchored to Bottom, Full Width
                    bottom: { xs: 0, md: 'auto' },
                    left: { xs: 0, md: 'auto' },
                    right: { xs: 0, md: '60px' },
                    top: { xs: 'auto', md: '50%' },

                    transform: { xs: 'none', md: 'translateY(-50%)' },

                    // Sizing
                    width: { xs: '100%', md: '350px' },
                    maxWidth: { xs: '100%', md: '350px' },

                    // Styles
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    // backdropFilter: 'blur(12px)',
                    // Rounded top only on mobile
                    borderRadius: { xs: '0px 0px 20px 20px', md: '20px' },
                    padding: { xs: '15px', md: 3 },
                    border: '0px solid rgba(255,255,255,0.5)'
                  }}
                >
                  <Swiper
                    spaceBetween={15}
                    slidesPerView={1}
                    speed={800}
                    onSwiper={setSwiper}
                    style={{ width: '100%' }}
                  >
                    {slide?.Designdetail && (
                      <>
                        {parseDesignDetails(slide?.Designdetail)?.map(
                          (detail, subIndex) => (
                            <SwiperSlide key={`detail-${detail?.id}`}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  // --- KEY CHANGE: Row on Mobile, Column on Desktop ---
                                  flexDirection: { xs: 'row', md: 'column' },
                                  alignItems: 'center',
                                  justifyContent: { xs: 'flex-start', md: 'center' },
                                  gap: { xs: 2, md: 0 },
                                  cursor: 'pointer',
                                }}
                                onClick={() =>
                                  handleNavigation(
                                    detail?.designno,
                                    detail?.autocode,
                                    detail?.TitleLine ? detail?.TitleLine : "",
                                    index
                                  )
                                }
                              >
                                {/* Image Wrapper */}
                                <Box sx={{
                                  // Fixed smaller width on mobile
                                  width: { xs: '100px', sm: '120px', md: '100%' },
                                  height: { xs: '100px', sm: '120px', md: 'auto' },
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  mb: { xs: 0, md: 2 },
                                  backgroundColor: '#fff',
                                  flexShrink: 0 // Prevent shrinking
                                }}>
                                  <img
                                    loading="lazy"
                                    src={`${imageUrlDesignSet}${detail?.designno}~1.jpg`}
                                    alt={`Sub image ${subIndex}`}
                                    name={`product-${index}`}
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                    onError={(e) => {
                                      e.target.src = imageNotFound;
                                      e.target.alt = "no-image-found";
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      display: 'block'
                                    }}
                                  />
                                </Box>

                                {/* Text Wrapper for Left Alignment on Mobile */}
                                <Box sx={{
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: { xs: 'flex-start', md: 'center' },
                                  textAlign: { xs: 'left', md: 'center' }
                                }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      color: '#2a2a2a',
                                      fontSize: '1rem',
                                      mb: 0.5,
                                      lineHeight: 1.2
                                    }}
                                  >
                                    {detail?.designno}
                                  </Typography>

                                  {detail?.TitleLine && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: '#666',
                                        mb: 0.5,
                                        fontSize: '0.8rem'
                                      }}
                                    >
                                      {detail?.TitleLine}
                                    </Typography>
                                  )}

                                  {storeInit?.IsPriceShow == 1 && (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 700,
                                        color: '#000',
                                        mt: 0.5
                                      }}
                                    >
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
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </SwiperSlide>
                          )
                        )}
                      </>
                    )}
                  </Swiper>

                  {ShowButton() && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,

                        // --- Floating Buttons on Mobile ---
                        position: { xs: 'absolute', md: 'static' },
                        // Slightly overlapping the top edge on mobile
                        top: { xs: '-20px', md: 'auto' },
                        right: { xs: '15px', md: 'auto' },
                        marginTop: { xs: 0, md: 2 }
                      }}
                    >
                      <IconButton
                        onClick={handlePrevious}
                        size="small"
                        sx={{
                          border: '1px solid #ccc',
                          bgcolor: '#fff',
                          color: '#333',
                          boxShadow: { xs: '0 4px 8px rgba(0,0,0,0.15)', md: 'none' },
                          '&:hover': { bgcolor: '#000', color: '#fff', borderColor: '#000' }
                        }}
                      >
                        <ChevronLeftIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        onClick={handleNext}
                        size="small"
                        sx={{
                          border: '1px solid #ccc',
                          bgcolor: '#fff',
                          color: '#333',
                          boxShadow: { xs: '0 4px 8px rgba(0,0,0,0.15)', md: 'none' },
                          '&:hover': { bgcolor: '#000', color: '#fff', borderColor: '#000' }
                        }}
                      >
                        <ChevronRightIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              </Fade>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default MaxDesignSet;
