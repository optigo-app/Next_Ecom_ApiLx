"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Box, Typography, IconButton, styled, Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatRedirectTitleLine,
  formatter,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { HeaderV2 } from "./Header";
import SpireBox from "./Svg";
import { saveRecentlyViewedDesign } from "@/app/(core)/utils/sqlite/recentlyViewedActions";

// ─── Styled Components (mirrors MaxBestSeller.jsx) ───────────────────────────

const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  backgroundColor: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(0,0,0,0.1)",
  backdropFilter: "blur(6px)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const imageNotFound = "/image-not-found.jpg";

const TrendingSkeleton = () => (
  <Box
    sx={{
      bgcolor: "#FFFFFF",
      px: { xs: 2, sm: 3, md: 4 },
      py: 4,
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="text" width={160} height={32} />
    </Box>
    <Box sx={{ display: "flex", gap: 3, overflow: "hidden" }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} sx={{ flex: "1 1 20%", minWidth: 180 }}>
          <Skeleton
            variant="rectangular"
            sx={{ width: "100%", aspectRatio: "3/3.5", borderRadius: "1px", mb: 1.5 }}
          />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="50%" height={18} />
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const MaxTrending = ({ storeInit, initialData = [] }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(storeInit?.CDNDesignImageFol || "");
  const [trendingData, setTrendingData] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);

  const navigation = useNextRouterLikeRR();
  const { loginUserDetail, islogin } = useStore();

  const isFetchingRef = useRef(false);
  const lastUserRef = useRef(null);

  // ── Card Image URL builder (old default image without color code conflicts) ──
  const getCardImageUrl = useCallback((productData) => {
    const cdnFol = storeInit?.CDNDesignImageFol || imageUrl || "";
    if (!cdnFol || !productData?.designno) return "";
    const ext = productData?.ImageExtension || "webp";

    if (productData?.ImageVideoDetail && productData.ImageVideoDetail !== "0") {
      try {
        const parsed =
          typeof productData.ImageVideoDetail === "string"
            ? JSON.parse(productData.ImageVideoDetail)
            : productData.ImageVideoDetail;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalImg = parsed.find((item) => Number(item?.TI) === 1);
          if (normalImg) {
            return `${cdnFol}${productData.designno}~${normalImg.Nm}.${normalImg.Ex || ext}`;
          }
        }
      } catch (e) {}
    }
    return `${cdnFol}${productData.designno}~1.${ext}`;
  }, [storeInit, imageUrl]);

  // ── Synchronously computed validatedData for instant SSR & first paint ────
  const validatedData = useMemo(() => {
    if (!trendingData || !trendingData.length) return [];
    const cdnFol = storeInit?.CDNDesignImageFol || imageUrl || "";
    return trendingData.map((item) => {
      const hasImage = item?.ImageExtension || (item?.ImageVideoDetail && item?.ImageVideoDetail !== "0");
      const imageURL = hasImage
        ? (getCardImageUrl(item) || `${cdnFol}${item?.designno}~1.${item?.ImageExtension || "webp"}`)
        : imageNotFound;
      return { ...item, validatedImageURL: imageURL };
    });
  }, [trendingData, getCardImageUrl, storeInit, imageUrl]);

  // ── API ──────────────────────────────────────────────────────────────────────
  const fetchAndSetTrending = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch("/api/sqlite/home/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeInit,
          loginUserDetail,
        }),
      });
      const result = await response.json();
      const apiData = result?.Data?.rd || result?.rd || [];

      if (apiData.length > 0) {
        setTrendingData(apiData);
      } else {
        setTrendingData([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("[MaxTrending] Error fetching trending items:", err);
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [storeInit, loginUserDetail]);

  useEffect(() => {
    if (storeInit?.CDNDesignImageFol) {
      setImageUrl(storeInit.CDNDesignImageFol);
    }

    const currentUserSig = `${Boolean(islogin)}_${loginUserDetail?.id || loginUserDetail?.userid || 0}_${loginUserDetail?.pricemanagement_laboursetid || 0}`;

    // If initialData was provided on first mount and matches state, keep it
    if (lastUserRef.current === null && initialData && initialData.length > 0) {
      lastUserRef.current = currentUserSig;
      return;
    }

    if (lastUserRef.current !== currentUserSig || trendingData.length === 0) {
      lastUserRef.current = currentUserSig;
      fetchAndSetTrending();
    }
  }, [islogin, loginUserDetail, storeInit, initialData, fetchAndSetTrending, trendingData.length]);

  // ── Navigation helper ────────────────────────────────────────────────────────
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
    const designNo = item?.designno;
    const autoCode = item?.autocode;
    const titleLine = item?.TitleLine;

    const obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
      g: {},
      img: getCardImageUrl(item),
      ArticleNo: item?.ArticleNo ?? "",
      ArticleId: item?.ArticleId ?? null ?? "",
      title: titleLine ?? "",
      nwt: item?.Nwt ?? 0,
      price: item?.UnitCostWithMarkUp ?? 0,
      mediaDet: item?.ImageVideoDetail ?? "",
      metalColorId: loginUserDetail?.MetalColorId ?? storeInit?.MetalColorId ?? null,
      l: item?.ImageExtension,
      count: item?.ImageCount,
    };
    if (index !== undefined) {
      sessionStorage.setItem("scrollToProduct1", `product-${index}`);
    }

    // Save to SQLite recently viewed designs
    if (designNo) {
      saveRecentlyViewedDesign({
        designno: designNo,
        autocode: autoCode,
        loginUserDetail,
      }).catch(() => {});
    }

    const encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation.push(
      `/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`
    );
  };

  // ── Early return ─────────────────────────────────────────────────────────────
  if (loading) {
    return <TrendingSkeleton />;
  }

  if (!trendingData?.length) {
    return null;
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        px: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Section heading */}
      <HeaderV2
        title="Trending"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        icon={
          <>
            <SpireBox />
          </>
        }
      />

      {/* Swiper wrapper with absolute nav buttons */}
      <Box sx={{ position: "relative" }}>
        {/* Prev button — visible when slides exceed viewport */}
        {validatedData.length > 5 && (
          <NavButton ref={prevRef} sx={{ left: -16 }}>
            <ChevronLeft size={20} />
          </NavButton>
        )}

        {/* Next button — visible when slides exceed viewport */}
        {validatedData.length > 5 && (
          <NavButton ref={nextRef} sx={{ right: -16 }}>
            <ChevronRight size={20} />
          </NavButton>
        )}

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          grabCursor
          observer={true}
          observeParents={true}
          watchSlidesProgress={true}
          navigation={
            validatedData.length > 5
              ? {
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }
              : false
          }
          onBeforeInit={(swiper) => {
            if (validatedData.length > 5) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          style={{ paddingBottom: "20px", paddingTop: "10px" }}
          className="product-card-group-grid"
        >
          {validatedData?.map((item, index) => (
            <SwiperSlide key={item.id ?? item.designno ?? index} style={{ height: "auto" }}>
              <ProductCard
                onClick={() =>
                  handleNavigation(
                    item,
                    index,
                  )
                }
                item={item}
                storeInit={storeInit}
                loginUserDetail={loginUserDetail}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

// ─── Product Card (matches Category dimensions) ───────────────────────────────

const ProductCard = ({ item, storeInit, loginUserDetail, onClick }) => (
  <Box
    className="product-card-group"
    sx={{
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
      cursor: "pointer",
      height: "100%",
      width: "100%",
      mx: "auto",
      display: "flex",
      flexDirection: "column",
      "&:hover .image-container": { transform: "translateY(-5px)" },
      "&:hover .product-image": { transform: "scale(1.08)" },
      "&:hover .info-overlay": { transform: "translateY(0)", opacity: 1 },
      borderRadius: "1px",
      boxSizing: "border-box",
    }}
  >
    <Box
      className="image-container"
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/3.5",
        overflow: "hidden",
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        backgroundColor: "#f5f5f560",
        borderRadius: "1px",
      }}
      onClick={onClick}
    >
      {/* Product image */}
      <Box
        className="product-image"
        component="img"
        src={item.validatedImageURL}
        alt={item.name}
        onError={(e) => {
          e.target.src = imageNotFound;
          e.target.alt = "no-image-found";
        }}
        sx={{
          position: "absolute",
          top: "5%",
          left: "5%",
          width: "90%",
          height: "90%",
          objectFit: "contain",
          transition: "transform 0.6s ease",
          mixBlendMode: "multiply",
        }}
      />

      {/* Price overlay */}
      <Box
        className="info-overlay"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "auto",
          minHeight: "18%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 1.5,
          px: 2,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.5)",
          transform: "translateY(100%)",
          opacity: 0,
          zIndex: 10,
          transition: "all 0.3s ease-in-out",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: "#1a1a1a",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}&nbsp;
          {formatter(item?.UnitCostWithMarkUp)}
        </Typography>
      </Box>
    </Box>

    {/* Design info below image */}
    <Box sx={{ mt: 1.5, px: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#727272",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 500,
          fontSize: "0.7rem",
          display: "block",
          mb: 0.3,
        }}
      >
        {item?.designno}
      </Typography>
      {!!item?.TitleLine && (
        <Typography
          sx={{
            fontWeight: 500,
            color: "#1a1a1a",
            fontSize: "0.95rem",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            px: 1,
          }}
        >
          {item?.TitleLine}
        </Typography>
      )}
    </Box>
  </Box>
);

export default MaxTrending;
