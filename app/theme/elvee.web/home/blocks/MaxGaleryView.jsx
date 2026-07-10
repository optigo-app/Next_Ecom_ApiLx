
"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { formatRedirectTitleLine, formatter,formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import Cookies from "js-cookie";
import pako from "pako";
import MaxHeader from "./Header";

const MaxGalleryView = ({ banner,storeinit }) => {
  const [trandingViewData, setTrandingViewData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const navigation = useNextRouterLikeRR();
  const [storeInit, setStoreInit] = useState({});
    const { finalId, loginUserDetail, islogin } = useStore();

  
  const [validatedData, setValidatedData] = useState([]);

  const imageNotFound ="/image-not-found.jpg"

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = () => {
     
    setStoreInit(storeinit);

    let data = storeinit;
    setImageUrl(data?.CDNDesignImageFolThumb);
    // const loginUserDetail = loginUserDetail;

    let finalID = finalId;
    Get_Tren_BestS_NewAr_DesigSet_Album("GETTrending", finalID)
      .then((response) => {
        
        if (response?.Data?.rd) {
          setTrandingViewData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  };

  const validateImageURLs = async () => {
    if (!trandingViewData?.length) return;
    const validatedData = await Promise.all(
      trandingViewData.map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.jpg`;
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
    navigation?.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  if (validatedData.length === 0) {
    return;
  }

  return (
    <Box
      id="mainGalleryConatinerID"
      name="mainGalleryConatinerID123"
      sx={{
        width: "100%",
        bgcolor: "#fff",
        px: { xs: 2, sm: 3, md: 4 },
        overflow: "hidden",
      }}
    >
      {/* <Box sx={{ mb: 3 }}> */}
      {/* <Typography
          sx={{
            color: "#2E2E2E",
            fontSize: { xs: 23, sm: 26, md: 28 },
            fontWeight: 400,
            mb: 1,
          }}
        >
          TRENDING
        </Typography> */}
      <MaxHeader
        title="Trending Masterpieces"
        alignment="center"
      />
      {/* </Box> */}

      {/* Gallery Slider */}
      <Swiper
        loop
        spaceBetween={16}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 2,
          },
          900: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 5, // ✅ EXACT requirement
          },
        }}
      >
        {validatedData?.map((data, index) => (
          <SwiperSlide key={index}>
            <Box
              onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine, index)}
              sx={{
                position: "relative", // ✅ REQUIRED
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#d6d6d624",
                cursor: "pointer",
                transition: "transform 0.35s ease",

                "& img": {
                  transition: "transform 0.5s ease",
                },

                "&:hover img": {
                  transform: "scale(1.06)",
                },

                "&:hover": {
                  transform: "translateY(-4px)",
                },

                "&:hover .info-overlay": {
                  transform: "translateY(0)",
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={data?.validatedImageURL}
                id={`product-${index}`}
                onError={(e) => {
                  e.target.src = imageNotFound;
                }}
                alt={`Gallery ${index + 1}`}
                loading="lazy"
                sx={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  objectFit: "contain", // use "contain" if you don't want cropping
                  display: "block",
                  mixBlendMode: "multiply",
                }}
              />
              {/* Hover Overlay */}
              <Box
                className="info-overlay"
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  px: 2,
                  textAlign: "center",

                  background: "#ffffff",

                  transform: "translateY(100%)", // 👈 START hidden below
                  opacity: 0,

                  transition: "transform 0.4s ease, opacity 0.3s ease",
                  // --- THE APPLE GLASS EFFECT ---
                  background: "rgba(255, 255, 255, 0.65)", // Semi-transparent white
                  backdropFilter: "blur(20px) saturate(180%)", // The "Liquid" Blur magic
                  WebkitBackdropFilter: "blur(20px) saturate(180%)", // Safari/Apple support
                  borderTop: "1px solid rgba(255, 255, 255, 0.4)", // Subtle frost edge
                  boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow lifting it up

                  // Transitions & Visibility
                  transform: "translateY(100%)", // Hidden down initially
                  opacity: 0,
                  zIndex: 10,
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                {/* Design No */}
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#777",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  {data?.designno}
                </Typography>

                {/* Title */}
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                    mb: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {formatTitleLine(data?.TitleLine)}
                </Typography>

                {/* Price */}
                {storeInit?.IsPriceShow == 1 && (
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {islogin
                      ? loginUserDetail?.CurrencyCode
                      : storeInit?.CurrencyCode}
                    &nbsp;
                    {formatter(data?.UnitCostWithMarkUp)}
                  </Typography>
                )}
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination polish */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: #b0b7c3;
            opacity: 0;
          }
          .swiper-pagination-bullet-active {
            background: #1d3258;
          }
        `}
      </style>
    </Box>
  );
};

export default MaxGalleryView;
