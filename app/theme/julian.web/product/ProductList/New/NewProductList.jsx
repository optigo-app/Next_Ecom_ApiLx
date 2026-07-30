"use client";
import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import ProductSkeleton from "./Skeleton";
import { useTheme } from "@emotion/react";
import "./index.scss";
import {
  formatter,
  formatTitleLine,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import CartToggleButton from "./CartToggleButton";
import WishToggleButton from "./WishToggleButton";
import MobileCartToggleButton from "./MobileCartButton";
import NoProductFound from "./NoProductFound";

const IsSetupFor = true;
const noImageFound = "/image-not-found.jpg";

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
  if (typeof document === "undefined") return html || "";
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const MotionCard = motion(Card);

const JewelryProductGrid = ({
  storeinit,
  loginUserDetail,
  productListData,
  isFiltering,
  handleMoveToDetail = () => {},
  showFilter,
  filter,
  filterData,
  handleCartandWish = () => {},
  cartArr,
  wishArr,
}) => {
  const theme = useTheme();
  const isMedium = useMediaQuery("(max-width:1000px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const getDesignVideoFol = storeinit?.CDNVPath;
  const getDesignImageFol = storeinit?.CDNDesignImageFol;

  const getDynamicImages = (designno, extension) => {
    return `${getDesignImageFol}${designno}~${1}.${extension}`;
  };
  const getDynamicRollImages = (designno, count, extension) => {
    if (count > 1) {
      return `${getDesignImageFol}${designno}~${2}.${extension}`;
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

  const showSkeletons = isFiltering || !productListData;
  const isNoProduct = !isFiltering && Array.isArray(productListData) && productListData.length === 0;

  if (isNoProduct) {
    return <NoProductFound />;
  }

  return (
    <Box
      sx={{
        py: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {(() => {
          if (showSkeletons) {
            return (
              <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
                {Array.from(new Array(12)).map((_, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 6,
                      sm: 6,
                      md: isMedium ? 6 : 3,
                    }}
                  >
                    <ProductSkeleton key={index} />
                  </Grid>
                ))}
              </Grid>
            );
          }

          return (
            <Grid container spacing={0}>
              {productListData.map((prod, index) => (
                <Grid
                  key={prod?.id || prod?.autocode || index}
                  size={{
                    xs: 6,
                    sm: 6,
                    md: isMedium ? 6 : 3,
                  }}
                >
                  <ProductCard
                    product={prod}
                    index={index}
                    StoreInit={storeinit}
                    productData={prod}
                    handleCartandWish={handleCartandWish}
                    cartArr={cartArr}
                    wishArr={wishArr}
                    loginCurrency={loginUserDetail}
                    imageUrl={getDynamicImages(
                      prod?.designno,
                      prod?.ImageExtension,
                    )}
                    videoUrl={getDynamicVideo(
                      prod?.designno,
                      prod?.VideoCount,
                      prod?.VideoExtension,
                    )}
                    RollImageUrl={getDynamicRollImages(
                      prod?.designno,
                      prod?.ImageCount,
                      prod?.ImageExtension,
                    )}
                    handleMoveToDetail={handleMoveToDetail}
                    ImageCount={prod?.ImageCount}
                    VideoCount={prod?.VideoCount}
                    showFilter={showFilter}
                    filter={filter}
                    filterData={filterData}
                    isMobile={isMobile}
                  />
                </Grid>
              ))}
            </Grid>
          );
        })()}
      </Box>
    </Box>
  );
};

export default JewelryProductGrid;

const ProductCard = ({
  product,
  index,
  productData,
  StoreInit,
  calcVal,
  videoUrl,
  handleCartandWish,
  cartArr,
  wishArr,
  RollImageUrl,
  imageUrl,
  handleMoveToDetail,
  loginCurrency,
  showFilter,
  filter,
  filterData,
  ImageCount,
  VideoCount,
  isMobile,
  columnsPerRow = 4,
}) => {
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
        duration: 0.25,
        delay: Math.min(index * 0.02, 0.15),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
  const isFirstInRow = index % columnsPerRow === 0;
  const isFirstRow = index < columnsPerRow;
  // const hasUpperTags = productData?.IsInReadyStock == 1 || productData?.IsBestSeller == 1 || productData?.IsTrending == 1 || productData?.IsNewArrival == 1;
  const hasUpperTags =
    productData?.IsInReadyStock == 1 ||
    productData?.IsBestSeller == 1 ||
    productData?.IsTrending == 1 ||
    productData?.IsNewArrival == 1;

  const Article = productData?.ArticleNo;
  const DesignNo = productData?.designno;

  return (
    <MotionCard
      id={`product-card-${Article}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      sx={{
        boxShadow: "none !important",
        outline: "none !important",
        borderRight: "1px solid #e5e5e5",
        borderBottom: "1px solid #e5e5e5",
        borderLeft: isFirstInRow ? "1px solid #e5e5e5" : "none",
        borderTop: isFirstRow ? "1px solid #e5e5e5" : "none",
        borderRadius: 0,
      }}
    >
      {/* --- PRODUCT IMAGE CONTAINER --- */}
      <Box
        className="product-container"
        onClick={() => handleMoveToDetail(productData, imageUrl)}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 0,
          overflow: "hidden",
          aspectRatio: {
            xs: "3 / 4",
            sm: "1 / 1.25",
            md: "1 / 1.2",
            lg: "1/1.18",
          },
          bgcolor: "#e9e9e91a",
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
            objectFit: "cover",
            borderRadius: 0,
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
                    objectFit: "cover !important",
                    borderRadius: 0,
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
                    bgcolor: "#e9e9e91a",
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
                      objectFit: "cover",
                      borderRadius: 0,
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
            <CartToggleButton
              productData={productData}
              cartArr={cartArr}
              handleCartandWish={handleCartandWish}
            />
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
          {!IsSetupFor &&
            !hasUpperTags &&
            productData?.MakeType &&
            ChipBar(productData.MakeType, "bottom")}
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
            {!IsSetupFor &&
              productData?.MakeType &&
              ChipBar(productData.MakeType, "bottom")}
          </Box>
        )}

        <WishToggleButton
          productData={productData}
          wishArr={wishArr}
          handleCartandWish={handleCartandWish}
        />
      </Box>

      {/* --- CARD CONTENT BELOW IMAGE --- */}
      <CardContent
        sx={{
          px: 2.4,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        {/* PRICE ROW */}
        {StoreInit?.IsPriceShow == 1 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.78rem", sm: "0.85rem", md: "0.9rem" },
                color: "#050505",
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: decodeEntities(
                    loginCurrency?.CurrencyCode ?? StoreInit?.CurrencyCode,
                  ),
                }}
                style={{ paddingRight: "0.3rem" }}
              />
              {formatter(productData?.UnitCostWithMarkUp)}
            </Typography>
          </Box>
        )}

        {/* ARTICLE NO (LEFT) AND NWT (RIGHT) ROW */}
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={0.8}>
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
                  {Article}
                </Typography>
              </Box>
            </Grid>

            <Grid item size={{ xs: 6 }}>
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
                  {productData?.Nwt ? productData?.Nwt?.toFixed(3) : "0.000"}
                </Typography>
              </Box>
            </Grid>

            {isMobile && (
              <Grid item size={{ xs: 12, sm: 12 }} position={"relative"}>
                <MobileCartToggleButton
                  productData={productData}
                  cartArr={cartArr}
                  handleCartandWish={handleCartandWish}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </MotionCard>
  );
};
