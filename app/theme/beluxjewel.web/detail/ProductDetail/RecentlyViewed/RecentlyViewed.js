"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  styled,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const imageNotFound = "/image-not-found.jpg";

// ─── Luxury Styled Components ────────────────────────────────────────────────

const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "45%",
  transform: "translateY(-50%)",
  zIndex: 10,
  width: 40,
  height: 40,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
  backdropFilter: "blur(6px)",
  color: "#1c1c1c",
  transition: "all 0.25s ease",
  "&:hover": {
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-50%) scale(1.05)",
  },
  "&.swiper-button-disabled": {
    opacity: 0,
    pointerEvents: "none",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const ProductCard = styled(Card)(() => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: "2px",
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
  cursor: "pointer",
  transition: "all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 28px -6px rgba(0, 0, 0, 0.1)",
    borderColor: "#dedede",
  },
  "&:hover .product-img": {
    transform: "scale(1.08)",
  },
  "&:hover .hover-overlay": {
    opacity: 1,
  },
}));

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  aspectRatio: "3 / 3.5",
  backgroundColor: "#f8f8f8",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderBottom: "1px solid #f4f4f4",
}));

const ProductImage = styled("img")(() => ({
  width: "86%",
  height: "86%",
  objectFit: "contain",
  mixBlendMode: "multiply",
  transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  userSelect: "none",
  pointerEvents: "none",
}));

// Luxury star icon matching BeluxJewel identity
const LuxuryStarIcon = () => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#114D6E",
      mr: 1.2,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 16 16"
      style={{ display: "block" }}
    >
      <g
        fill="none"
        stroke="#114D6E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="m13.75 7.75h-12" />
        <path d="m7.75 1.75v12" />
        <path d="m4.25 11.25 7-7" />
        <path d="m11.25 11.25-7-7" />
      </g>
    </svg>
  </Box>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RecentlyViewed({
  recentlyViewedArr = [],
  loginInfo,
  storeInit,
  handleMoveToDetail,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const formatter = new Intl.NumberFormat("en-IN");

  if (!recentlyViewedArr || recentlyViewedArr.length === 0) {
    return null;
  }

  const currencySymbol =
    loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode ?? "INR";
  const shouldUseSwiper = recentlyViewedArr.length > 4;

  const renderCard = (item, index) => {
    const ext = item?.ImageExtension || "webp";
    const imgUrl =
      item?.ImageCount > 0
        ? `${storeInit?.CDNDesignImageFol || ""}${item?.designno}~1.${ext}`
        : imageNotFound;

    const titleText =
      item?.TitleLine && item?.TitleLine.trim() !== ""
        ? item.TitleLine
        : item?.designno;

    return (
      <ProductCard
        key={item?.id || item?.designno || index}
        onClick={() => {
          if (handleMoveToDetail) {
            handleMoveToDetail(item, imgUrl);
          }
        }}
      >
        <ImageContainer>
          <ProductImage
            className="product-img"
            src={imgUrl}
            alt={titleText}
            loading="lazy"
            onError={(e) => {
              e.target.src = imageNotFound;
            }}
          />

          {/* Subtle hover quick label */}
          <Box
            className="hover-overlay"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              py: 0.8,
              backgroundColor: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(6px)",
              textAlign: "center",
              opacity: 0,
              transition: "opacity 0.25s ease",
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#114D6E",
              }}
            >
              View Design
            </Typography>
          </Box>
        </ImageContainer>

        {/* Details Block */}
        <Box sx={{ p: 2, textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            {item?.designno && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#888",
                  mb: 0.4,
                }}
              >
                {item.designno}
              </Typography>
            )}

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                lineHeight: 1.35,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
              title={titleText}
            >
              {titleText}
            </Typography>
          </Box>

          {storeInit?.IsPriceShow === 1 && item?.UnitCostWithMarkUp != null && (
            <Typography
              sx={{
                mt: 1,
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                letterSpacing: "0.2px",
              }}
            >
              {currencySymbol}&nbsp;{formatter.format(item.UnitCostWithMarkUp)}
            </Typography>
          )}
        </Box>
      </ProductCard>
    );
  };

  return (
    <Box
      sx={{
        mt: { xs: 8, md: 10 },
        mb: { xs: 6, md: 8 },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ── Section Masthead ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: { xs: 3, md: 4 },
          borderBottom: "1px solid #f0f0f0",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LuxuryStarIcon />
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "22px", md: "24px" },
              fontWeight: 400,
              letterSpacing: "2.2px",
              textTransform: "uppercase",
              color: "#2E2E2E",
              fontFamily: "inherit",
            }}
          >
            Recently Viewed Designs
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "#777777",
            fontSize: "13px",
            mt: 0.6,
            letterSpacing: "0.2px",
            pl: { xs: 0, sm: "32px" },
          }}
        >
          Curated pieces explored during your current browsing session
        </Typography>
      </Box>

      {/* ── Cards Display ── */}
      {!shouldUseSwiper ? (
        /* Flex Grid for 1-4 items: Maintains exact luxury card proportions */
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 2.5, md: 3 },
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          {recentlyViewedArr.map((item, index) => (
            <Box
              key={item?.id || item?.designno || index}
              sx={{
                width: {
                  xs: "calc(50% - 8px)",
                  sm: "210px",
                  md: "240px",
                  lg: "260px",
                },
                flexShrink: 0,
              }}
            >
              {renderCard(item, index)}
            </Box>
          ))}
        </Box>
      ) : (
        /* Swiper Carousel for 5+ items */
        <Box sx={{ position: "relative", px: { xs: 0, md: 2 } }}>
          <NavButton
            ref={prevRef}
            sx={{ left: { xs: 0, md: -20 } }}
            aria-label="Previous Recently Viewed"
          >
            <ChevronLeft size={20} />
          </NavButton>

          <NavButton
            ref={nextRef}
            sx={{ right: { xs: 0, md: -20 } }}
            aria-label="Next Recently Viewed"
          >
            <ChevronRight size={20} />
          </NavButton>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.3}
            grabCursor
            observer
            observeParents
            watchSlidesProgress
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 24 },
            }}
            style={{ paddingBottom: "12px", paddingTop: "4px" }}
          >
            {recentlyViewedArr.map((item, index) => (
              <SwiperSlide
                key={item?.id || item?.designno || index}
                style={{ height: "auto" }}
              >
                {renderCard(item, index)}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
}
