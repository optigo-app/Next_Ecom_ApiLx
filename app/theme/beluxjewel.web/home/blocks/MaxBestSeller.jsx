"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Box, Typography, IconButton, useTheme, styled, Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatRedirectTitleLine,
  formatter,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { HeaderV2 } from "./Header";
import {
  normalizeALC,
  buildAlbumCacheKey,
  getPricingContext,
} from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import SpireBox from "./Svg";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

// ─── Styled Components (mirrors Category.jsx) ────────────────────────────────

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

const BestSellerSkeleton = () => (
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
    <Box sx={{ display: "flex", gap: 2, overflow: "hidden" }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} sx={{ flex: "1 1 20%", minWidth: 180 }}>
          <Skeleton
            variant="rectangular"
            height={260}
            sx={{ borderRadius: "8px", mb: 1.5 }}
          />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="50%" height={18} />
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const MaxBestSeller = ({ storeInit }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNextRouterLikeRR();
  const { finalId, loginUserDetail, islogin } = useStore();

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeInit, islogin),
    [loginUserDetail, storeInit, islogin],
  );
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  // ── API ──────────────────────────────────────────────────────────────────────
  const fetchAndSetBestSellers = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current)
        return;

      isFetchingRef.current = true;

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[MaxBestSeller] Serving from cache");
          setBestSellerData(cacheRes.data);
          isFetchingRef.current = false;
          setLoading(false);
          return;
        }

        console.log("[MaxBestSeller] Cache miss, calling API...");
        const response = await Get_Tren_BestS_NewAr_DesigSet_Album(
          storeInit,
          "GETBestSeller",
          finalID,
        );
        const apiData = response?.Data?.rd || [];

        if (apiData.length > 0) {
          setBestSellerData(apiData);
          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setBestSellerData([]);
        }
        isFetchingRef.current = false;
        setLoading(false);
      } catch (err) {
        console.log("[MaxBestSeller] Error in fetch:", err);
        setBestSellerData([]);
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [pricingContext, storeInit],
  );

  useEffect(() => {
    if (!pricingContext || !storeInit) return;

    setImageUrl(storeInit?.CDNDesignImageFol);

    const fetchData = async () => {
      const visitorId = finalId || "0";
      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey(
        "fg_bestseller",
        storeInit,
        pricingContext,
        visitorId,
        keyALC,
      );

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetBestSellers(visitorId, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeInit, fetchAndSetBestSellers, finalId]);

  // ── Image URL builder ────────────────────────────────────────────────────────
  const validateImageURLs = async () => {
    if (!bestSellerData?.length) return;
    const result = await Promise.all(
      bestSellerData.map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension || "webp"}`;
        return { ...item, validatedImageURL: imageURL };
      }),
    );
    setValidatedData(result);
  };

  useEffect(() => {
    validateImageURLs();
  }, [bestSellerData]);

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

    // Resolve color code for this product to build a color-matched img URL
    const mtColorLocal = getSession("MetalColorCombo") || [];
    const targetColorObj = mtColorLocal.find(ele => Number(ele.id) === Number(item?.MetalColorid));
    const colorCode = targetColorObj?.colorcode;
    const cdnFol = storeInit?.CDNDesignImageFol || "";
    const ext = item?.ImageExtension || "webp";
    let imgUrl = "";
    if (item?.ImageVideoDetail && item.ImageVideoDetail !== "0") {
      try {
        const parsed = typeof item.ImageVideoDetail === "string" ? JSON.parse(item.ImageVideoDetail) : item.ImageVideoDetail;
        if (Array.isArray(parsed) && colorCode) {
          const colorLower = colorCode.toLowerCase().trim();
          const colorImg = parsed.find(x => Number(x?.TI) === 2 && (x?.CN || "").toLowerCase().trim() === colorLower);
          if (colorImg) imgUrl = `${cdnFol}${designNo}~${colorImg.Nm}~${colorImg.CN}.${colorImg.Ex || ext}`;
        }
      } catch {}
    }
    if (!imgUrl) imgUrl = `${cdnFol}${designNo}~1.${ext}`;

    const obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
      metalColorId: item?.MetalColorid ?? null,
      mediaDet: item?.ImageVideoDetail ?? "",
      img: imgUrl,
      title: titleLine ?? "",
      price: item?.UnitCostWithMarkUp ?? 0,
      nwt: item?.Nwt ?? 0,
      l: item?.ImageExtension,
      count: item?.ImageCount,
    };
    sessionStorage.setItem("scrollToProduct1", `product-${index}`);
    const encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation.push(
      `/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`,
    );
  };

  // ── Early return ─────────────────────────────────────────────────────────────
  if (loading) {
    return <BestSellerSkeleton />;
  }

  if (!bestSellerData?.length) {
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
      {/* Section heading — same HeaderV2 as before */}
      <HeaderV2
        title="Best Seller"
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

      {/* Swiper wrapper with absolute nav buttons — mirrors Category.jsx */}
      <Box sx={{ position: "relative" }}>
        {/* Prev button */}
        <NavButton ref={prevRef} sx={{ left: -16 }}>
          <ChevronLeft size={20} />
        </NavButton>

        {/* Next button */}
        <NavButton ref={nextRef} sx={{ right: -16 }}>
          <ChevronRight size={20} />
        </NavButton>

        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          grabCursor
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 8 },
            768: { slidesPerView: 4, spaceBetween: 12 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
          style={{ paddingBottom: "20px", paddingTop: "10px" }}
          className="product-card-group-grid"
        >
          {validatedData?.map((item, index) => (
            <SwiperSlide key={item.id ?? index} style={{ height: "auto" }}>
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

// ─── Product Card (unchanged UI) ─────────────────────────────────────────────

const imageNotFound = `image-not-found.jpg`;

const ProductCard = ({ item, storeInit, loginUserDetail, onClick }) => (
  <Box
    className="product-card-group"
    sx={{
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
      cursor: "pointer",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      "&:hover .image-container": { transform: "translateY(-5px)" },
      "&:hover .product-image": { transform: "scale(1.08)" },
      "&:hover .info-overlay": { transform: "translateY(0)", opacity: 1 },
      borderRadius: 2,
      boxSizing: "border-box",
    }}
  >
    <Box
      className="image-container"
      sx={{
        position: "relative",
        width: "100%",
        paddingTop: "130%", // Improved aspect ratio
        overflow: "hidden",
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        backgroundColor: "#f5f5f560",
        borderRadius: 2,
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

export default MaxBestSeller;
