
"use client";


import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  FavoriteBorder,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import "swiper/css";
import "swiper/css/navigation";
import { styled } from "@mui/material/styles";
import { formatRedirectTitleLine, formatter,  formatTitleLine, } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Pako from "pako";

import ElveeTooltip from "./PremiumTooltip";
import MaxHeader from "./Header";

const imageNotFound ="/image-not-found.jpg"

const SectionHeader = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "26px",
  fontWeight: 400,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#2E2E2E",
}));

const MaxNewArrivalsSection = ({storeInit}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const swiperRef = useRef(null);
  const { finalId, loginUserDetail, islogin } = useStore();
 
  const [imageUrl, setImageUrl] = useState();
  const [newArrivalData, setNewArrivalData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const navigation = useNextRouterLikeRR();

  const callAPI = () => {
    // const loginUserDetail =  loginUserDetail || {}
    // const storeInit = storeInit || {}
    let finalID =finalId;
    
 
 

    let data = storeInit || {};
    setImageUrl(data?.CDNDesignImageFolThumb);
    Get_Tren_BestS_NewAr_DesigSet_Album("GETNewArrival", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setNewArrivalData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    callAPI();
  }, []);

  const validateImageURLs = async () => {
    if (!newArrivalData?.length) return;
    const validatedData = await Promise.all(
      newArrivalData.map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.jpg`;
        return { ...item, validatedImageURL: imageURL };
      }),
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
    // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
    navigation?.push(
      `/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`,
    );
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (validatedData?.length === 0) {
    return;
  }
  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "auto", sm: "auto", md: "1fr auto 1fr" },
          alignItems: "center",
          position: { xs: "relative", sm: "relative", md: "" }
        }}
      >
        {/* <SectionHeader>
          <SectionTitle variant="overline">New Arrivals</SectionTitle>
        </SectionHeader> */}
        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
          }}
        />
        <Box sx={{ justifySelf: "center", textAlign: "center" }}>
          <MaxHeader
            title="New In"
            subtitle={
              "Every debut tells a story of artistry, of elegance, of you"
            }
            alignment={{ xs: "left", sm: "center" }}
            noExtraMb={true}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifySelf: { xs: "center", sm: "center", md: "end" },
            marginBottom: { xs: "44px", sm: "44px", md: "0px" },
            position: { xs: "absolute", sm: "", md: "" },
            right: { xs: "0", sm: "0", md: "" },
            top: 0,
            marginTop: "44px",
          }}
        >
          <IconButton
            onClick={() => swiperRef.current?.slidePrev()}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              width: 40,
              height: 40,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#163164",
                borderColor: "#fff",
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => swiperRef.current?.slideNext()}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              width: 40,
              height: 40,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#163164",
                borderColor: "#fff",
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
              },
            }}
          >
            <ChevronRight />
          </IconButton>
          <Tooltip title="Show More">
            <IconButton
              onClick={() =>
                navigation?.push(`/p/NewArrival/?N=${btoa("NewArrival")}`)
              }
              sx={{
                ml: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                width: 40,
                height: 40,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#0a1f47",
                  borderColor: "#fff",
                  "& .MuiSvgIcon-root": {
                    color: "#fff",
                  },
                },
              }}
            >
              <ArrowForward sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ position: "relative" }}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 8,
            },
          }}
          style={{
            paddingBottom: "20px",
          }}
        >
          {validatedData?.map((product, index) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                onNavigation={() =>
                  handleNavigation(
                    product?.designno,
                    product?.autocode,
                    product?.TitleLine,
                    index,
                  )
                }
                image={
                  product?.ImageCount >= 1
                    ? product?.validatedImageURL
                    : imageNotFound
                }
                alt={product?.TitleLine}
                title={
                  formatTitleLine(product?.TitleLine)
                    ? formatTitleLine(product?.TitleLine)
                    : ""
                }
                product={product}
                price={
                  storeInit?.IsPriceShow == 1
                    ? `${formatter(product?.UnitCostWithMarkUp)} ${islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode}`
                    : ""
                }
                details={
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    {/* Weight Chips */}
                    {storeInit?.IsGrossWeight == 1 && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1,
                          py: 0.25,
                          borderRadius: "6px",
                          bgcolor: "#f7f7f7",
                          fontSize: "0.70rem",
                          color: "#555",
                        }}
                      >
                        <b style={{ color: "#222" }}>GWT:</b>&nbsp;
                        {(product?.Gwt || 0)?.toFixed(3)}
                      </Box>
                    )}

                    {Number(product?.Nwt) !== 0 && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1,
                          py: 0.25,
                          borderRadius: "6px",
                          bgcolor: "#f7f7f7",
                          fontSize: "0.70rem",
                          color: "#555",
                        }}
                      >
                        <b style={{ color: "#222" }}>NWT:</b>&nbsp;
                        {(product?.Nwt || 0)?.toFixed(3)}
                      </Box>
                    )}

                    {storeInit?.IsDiamondWeight == 1 &&
                      (product?.Dwt != "0" || product?.Dpcs != "0") && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1,
                            py: 0.25,
                            borderRadius: "6px",
                            bgcolor: "#f7f7f7",
                            fontSize: "0.70rem",
                            color: "#555",
                          }}
                        >
                          <b style={{ color: "#222" }}>DWT:</b>&nbsp;
                          {(product?.Dwt || 0)?.toFixed(3)} /{" "}
                          {product?.Dpcs || 0}
                        </Box>
                      )}

                    {storeInit?.IsStoneWeight == 1 &&
                      (product?.CSwt != "0" || product?.CSpcs != "0") && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1,
                            py: 0.25,
                            borderRadius: "6px",
                            bgcolor: "#f7f7f7",
                            fontSize: "0.70rem",
                            color: "#555",
                          }}
                        >
                          <b style={{ color: "#222" }}>CWT:</b>&nbsp;
                          {(product?.CSwt || 0)?.toFixed(3)} /{" "}
                          {product?.CSpcs || 0}
                        </Box>
                      )}
                  </Box>
                }
                designNo={product?.designno}
                Nwt={
                  Number(product?.Nwt) !== 0 && (product?.Nwt || 0)?.toFixed(3)
                }
                Gwt={
                  Number(product?.Gwt) !== 0 && (product?.Gwt || 0)?.toFixed(3)
                }
                Dwt={
                  Number(product?.Dwt) !== 0 && (product?.Dwt || 0)?.toFixed(3)
                }
                Dpcs={Number(product?.Dpcs) !== 0 && (product?.Dpcs || 0)}
                CSwt={
                  Number(product?.CSwt) !== 0 &&
                  (product?.CSwt || 0)?.toFixed(3)
                }
                CSpcs={Number(product?.CSpcs) !== 0 && (product?.CSpcs || 0)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default MaxNewArrivalsSection;

const ProductCard = ({
  onNavigation,
  image,
  alt,
  title,
  price,
  details,
  designNo,
  Nwt,
  Gwt,
  Dwt,
  Dpcs,
  CSwt,
  CSpcs,
}) => {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <ElveeTooltip title={" New Arrival"} arrow placement="top">
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 20, // Adjusts horizontal position
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 1. The "String" (The little teal line holding the tag) */}
          <Box
            sx={{
              height: "12px", // Length of the string
              width: "2px",
              backgroundColor: "#954b00", // The teal accent color from the image
            }}
          />

          {/* 2. The Tag Body */}
          <Box
            sx={{
              backgroundColor: "#000", // YOUR COLOR (Black)
              color: "#fff", // YOUR COLOR (White)
              writingMode: "vertical-rl", // Makes the text run vertically
              textOrientation: "mixed",
              transform: "rotate(180deg)", // Rotates it to read Bottom-to-Top
              padding: "8px 4px",
              borderRadius: "4px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.3)", // Adds depth
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* The Label */}
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.50rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "bold",
                whiteSpace: "nowrap", // Prevents text from breaking
              }}
            >
              New Arrival
            </Typography>

            {/* 3. The "Hole" (White dot at the top) */}
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#fff", // Hole color
                flexShrink: 0,
              }}
            />
          </Box>
        </Box>
      </ElveeTooltip>

      {/* Favorite Icon */}
      <IconButton
        className="favorite-icon"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.9)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          "&:hover": {
            backgroundColor: "#fff",
          },
        }}
      >
        <FavoriteBorder sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 4,
          overflow: "hidden",
          aspectRatio: {
            xs: "3 / 4", // mobile
            sm: "4 / 5", // small screens
            md: "5 / 6", // medium screens
            lg: "6 / 7", // large screens
          },
          bgcolor: "#d6d6d624",
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={alt}
          sx={{
            height: "100%",
            objectFit: "contain",
            borderRadius: 4,
            border: "1px solid #90909000",
            cursor: "pointer",
            mixBlendMode: "multiply",
            width: "100%",
          }}
          onClick={onNavigation}
        />
      </Box>
      {/* Content */}
      <CardContent sx={{ py: 2.5, px: 1 }}>
        {/* --- PRODUCT TITLE (always takes space) --- */}
        <ElveeTooltip title={title} arrow placement="top">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              lineHeight: 1.35,
              color: "#0a1f47",
              textAlign: "center",
              mb: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "1.3em",
              fontSize: {
                xs: "0.82rem",
                sm: "0.9rem",
                md: "0.94rem",
                lg: "1rem",
              },
            }}
          >
            {title || ""}
          </Typography>
        </ElveeTooltip>
        <ElveeTooltip title={designNo} arrow placement="top">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              lineHeight: 1,
              color: "#0a1f47",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "1em",
              mb: 1,
              fontSize: {
                xs: "0.82rem",
                sm: "0.9rem",
                md: "0.94rem",
                lg: "1rem",
              },
            }}
          >
            {designNo || ""}
          </Typography>
        </ElveeTooltip>
        <ElveeTooltip title={price} arrow placement="top">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              lineHeight: 1,
              color: "",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "1em",
              fontSize: {
                xs: "0.82rem",
                sm: "0.9rem",
                md: "0.94rem",
                lg: "1rem",
              },
            }}
          >
            from {price || "0"}
          </Typography>
        </ElveeTooltip>

        {/* --- DETAILS GRID (always keeps shape) --- */}
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // centers the row
              gap: 0.5,
            }}
          >
            {/* --- NWT --- */}
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                    color: Gwt ? "#000" : "transparent",
                    letterSpacing: "0.02em",
                  }}
                >
                  NWT&nbsp;:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
                    color: Nwt ? "#000" : "transparent",
                  }}
                >
                  {Nwt || "0"}
                </Typography>
              </Box>
            </Grid>
            {Dwt && (
              <Box
                sx={{
                  width: "1.15px",
                  height: "1.25rem",
                  bgcolor: "#ccc",
                }}
              />
            )}

            {/* --- DWT --- */}
            {Dwt && (
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                      color: Dwt ? "#000" : "transparent", // hidden but spacing preserved
                      letterSpacing: "0.02em",
                    }}
                  >
                    DWT&nbsp;:
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                      color: Dwt ? "#000" : "transparent",
                    }}
                  >
                    {Dwt ? `${Dwt}${Dpcs ? ` / ${Dpcs}` : ""}` : "0"}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
 