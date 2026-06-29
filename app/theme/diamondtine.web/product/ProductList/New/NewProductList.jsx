'use client'
import { useMemo, useState, useEffect } from "react";
import { Box, Grid, Card, CardMedia, CardContent, Typography, IconButton, Chip, useMediaQuery, Button } from "@mui/material";
import { motion } from "framer-motion";
import ProductSkeleton from "./Skeleton";
import { useTheme } from "@emotion/react";
import "./index.scss";
import { formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import CartToggleButton from "./CartToggleButton";
import WishToggleButton from "./WishToggleButton";
import MobileCartToggleButton from "./MobileCartButton";

const IsSetupFor = true;
const noImageFound = '/image-not-found.jpg';


const ChipBar = (title, bgcolor, position) => {
  return (
    <>
      <Chip
        label={title}
        sx={{
          bgcolor: "#FBF8F3",
          color: "#7A6A55",
          border: "1px solid #EFE6DA",
          fontWeight: 500,
          fontSize: {
            xs: "0.6rem", // phones
            sm: "0.65rem", // small tablets
            md: "0.7rem", // tablets
            lg: "0.75rem", // desktop
          },

          letterSpacing: "0.03em",
          height: {
            xs: 18,
            sm: 20,
            md: 22,
            lg: 24,
          },
          borderRadius: 1,
          px: {
            xs: 0.5,
            sm: 0.6,
            md: 0.7,
            lg: 0.8,
          },

          py: 0,
          textTransform: "uppercase",
          boxShadow: "none",

          "& .MuiChip-label": {
            px: {
              xs: 0.6,
              sm: 0.7,
              md: 0.8,
              lg: 1,
            },
            py: {
              xs: 0.15,
              sm: 0.18,
              md: 0.2,
            },
            lineHeight: 1.1,
          },
        }}
      />
    </>
  );
};

const decodeEntities = (html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const MotionCard = motion(Card);

const JewelryProductGrid = ({
  storeinit,
  loginUserDetail,
  productListData, isFiltering, handleMoveToDetail = () => { }, showFilter, filter, filterData, handleCartandWish = () => { }, cartArr, wishArr }) => {
  const theme = useTheme();
  const isMedium = useMediaQuery("(max-width:1000px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const getDesignVideoFol = storeinit?.CDNVPath;
  const getDesignImageFol = storeinit?.CDNDesignImageFol;
  // let getDesignImageFol = storeinit?.CDNDesignImageFolThumb;

  const getDynamicImages = (designno, extension) => {
    return `${getDesignImageFol}${designno}~${1}.${extension}`;
    // return `${getDesignImageFol}${designno}~${1}.jpg`;
  };
  const getDynamicRollImages = (designno, count, extension) => {
    if (count > 1) {
      return `${getDesignImageFol}${designno}~${2}.${extension}`;
      // return `${getDesignImageFol}${designno}~${2}.jpg`;
    }
    return;
  };

  const getDynamicVideo = (designno, count, extension) => {
    if (extension && count > 0) {
      const url = `${getDesignVideoFol}${designno}~${1}.${extension}`;
      return url;
    }
    return;
  };

  return (
    <Box
      sx={{
        py: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          {(isFiltering ? Array.from(new Array(12)) : productListData).map((item, index) => (
            <Grid item key={item?.id || index} size={{
              xs: 6,
              sm: 6,
              md: isMedium ? 6 : 3
            }}>
              {isFiltering ? <ProductSkeleton key={index} /> : <ProductCard product={item} index={index} key={index} StoreInit={storeinit} productData={item} handleCartandWish={handleCartandWish} cartArr={cartArr} wishArr={wishArr} loginCurrency={loginUserDetail} imageUrl={getDynamicImages(item?.designno, item?.ImageExtension)} videoUrl={getDynamicVideo(item?.designno, item?.VideoCount, item?.VideoExtension)} RollImageUrl={getDynamicRollImages(item?.designno, item?.ImageCount, item?.ImageExtension)} handleMoveToDetail={handleMoveToDetail} ImageCount={item?.ImageCount} VideoCount={item?.VideoCount} showFilter={showFilter} filter={filter} filterData={filterData} isMobile={isMobile} />}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default JewelryProductGrid;

const ProductCard = ({ product, index, productData, StoreInit, calcVal, videoUrl, handleCartandWish,
  cartArr, wishArr, RollImageUrl, imageUrl, handleMoveToDetail, loginCurrency, showFilter, filter, filterData, ImageCount, VideoCount, isMobile }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const hasUpperTags = productData?.IsInReadyStock == 1 || productData?.IsBestSeller == 1 || productData?.IsTrending == 1 || productData?.IsNewArrival == 1;

  return (
    <MotionCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      sx={{
        boxShadow: "none !important",
        outline: "none !important",
        border: "none !important",
      }}
    >
      <Box
        className="product-container"
        onClick={() => handleMoveToDetail(productData, imageUrl)}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 4,
          overflow: "hidden",
          aspectRatio: {
            xs: "3 / 4",
            sm: "1 / 1.25",
            md: "1 / 1.2",
            lg: "1/1.18"
          },
          bgcolor: "#fff9f266",
        }}
      >
        {/* Main Image */}
        <CardMedia
          component="img"
          src={imageUrl}
          alt={product.title}
          onError={(e) => {
            e.target.onerror = null;
            e.stopPropagation();
            e.target.src = noImageFound;
            e.onContextMenu = (e) => e.preventDefault();
          }}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="product-image"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 4,
            transition: "0s ease-in-out",
            mixBlendMode: "multiply",
          }}
          onClick={() => {
            handleMoveToDetail(productData);
          }}
        />
        {(() => {
          const validVideo = videoUrl !== undefined;
          const validImage = RollImageUrl !== undefined;

          if (validVideo) {
            return (
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="product-hover-image"
              >
                <CardMedia
                  component="video"
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={(e) => {
                    e.target.poster = noImageFound;
                    e.stopPropagation();
                    e.onContextMenu = (e) => e.preventDefault();
                  }}
                  onClick={() => {
                    handleMoveToDetail(productData, imageUrl);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  sx={{
                    objectFit: "contain !important",
                    borderRadius: 4,
                    transition: "opacity 0.4s ease",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            );
          }

          if (validImage) {
            return (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    bgcolor: "#fff9f266",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="product-hover-image"
                >
                  <CardMedia
                    component="img"
                    src={RollImageUrl}
                    alt="Roll Up Image"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onError={(e) => {
                      e.target.src = noImageFound;
                      e.stopPropagation();
                    }}
                    onClick={() => {
                      handleMoveToDetail(productData, RollImageUrl);
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 4,
                      transition: "opacity 0.4s ease",
                      mixBlendMode: "multiply",
                    }}
                  />
                </Box>
              </>
            );
          }
          return null;
        })()}

        {!isMobile && (
          <Box>
            <CartToggleButton productData={productData} cartArr={cartArr} handleCartandWish={handleCartandWish} />
          </Box>
        )}
        {/* --- UPPER BOX --- */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 12,
            zIndex: 22,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 0.8,
          }}
        >
          {productData?.IsInReadyStock == 1 && ChipBar("In Stock")}
          {productData?.IsBestSeller == 1 && ChipBar("Best Seller")}
          {productData?.IsTrending == 1 && ChipBar("Trending")}
          {productData?.IsNewArrival == 1 && ChipBar("New", "#163164")}
          {!IsSetupFor && !hasUpperTags && productData?.MakeType && ChipBar(productData.MakeType, "bottom")}
        </Box>

        {hasUpperTags && (
          <Box
            sx={{
              position: "absolute",
              top: 50,
              left: 12,
              zIndex: 22,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 0.8,
            }}
          >
            {!IsSetupFor && productData?.MakeType && ChipBar(productData.MakeType, "bottom")}
          </Box>
        )}

        <WishToggleButton productData={productData} wishArr={wishArr} handleCartandWish={handleCartandWish} />
      </Box>

      <CardContent
        sx={{
          px: 2.4,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        {/* Title */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.82rem", sm: "0.9rem", md: "0.94rem", lg: "1rem" },
            fontWeight: 300,
            lineHeight: 1.35,
            color: "#050505",
            mt: 0.3,
            mb: 0.3,
            textAlign: "center",

            /* ---- ELLIPSIS ---- */
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",

            /* Keeps the height stable even if hidden */
            minHeight: "1.35em",

            /* Your existing logic preserved */
            visibility: productData?.TitleLine ? "visible" : "hidden",
          }}
        >
          {productData?.TitleLine ? formatTitleLine(productData?.TitleLine) : " "}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Grid container spacing={0.8}>
            {/* DESIGN NO — LEFT CELL (ALWAYS VISIBLE) */}
            <Grid item size={{ xs: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                    color: "#000",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                  }}
                >
                  {productData?.designno}
                </Typography>
              </Box>
            </Grid>

            {/* DWT — RIGHT CELL */}
            <Grid item size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  justifyContent: "flex-end",
                }}
              >
                {StoreInit?.IsDiamondWeight == 1 && Number(productData?.Dwt) !== 0 ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 300,
                        fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                        color: "#000",
                        letterSpacing: "0.02em",
                      }}
                    >
                      DWT&nbsp;:
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 300,
                        fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                        color: "#000",
                      }}
                    >
                      {productData?.Dwt?.toFixed(3)}
                      {StoreInit?.IsDiamondPcs === 1 ? `/${productData?.Dpcs}` : null}
                    </Typography>
                  </>
                ) : (
                  <></> // EMPTY, BUT SLOT REMAINS SAME HEIGHT
                )}
              </Box>
            </Grid>

            {/* PRICE — LEFT CELL */}
            <Grid item size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {StoreInit?.IsPriceShow == 1 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                      color: "#000",
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: decodeEntities(loginCurrency?.CurrencyCode ?? StoreInit?.CurrencyCode)
                      }}
                      style={{ paddingRight: "0.4rem" }}
                    />
                    {formatter(productData?.UnitCostWithMarkUp)}
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>

            {/* GWT — RIGHT CELL */}
            <Grid item size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  justifyContent: "flex-end",
                }}
              >
                {/* {StoreInit?.IsGrossWeight == 1 && Number(productData?.Gwt) !== 0 ? (
                  <> */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                    color: "#000",
                    letterSpacing: "0.02em",
                  }}
                >
                  NWT&nbsp;:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
                    color: "#000",
                  }}
                >
                  {productData?.Nwt?.toFixed(3)}
                </Typography>
                {/* </>
                ) : (
                  <></>  // RIGHT CELL STAYS EMPTY BUT FIXED HEIGHT
                )} */}
              </Box>
            </Grid>

            {isMobile && (
              <Grid item size={{ xs: 12, sm: 12 }} position={"relative"}>
                <MobileCartToggleButton productData={productData} cartArr={cartArr} handleCartandWish={handleCartandWish} />
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Material View */}
      </CardContent>
    </MotionCard>
  );
};

