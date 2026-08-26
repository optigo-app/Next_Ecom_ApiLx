"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import {
  normalizeALC,
  buildAlbumCacheKey,
  findMatchingCacheEntry,
  getPricingContext,
} from "@/app/(core)/cache_utility/CacheBuilder";

export default function Trending({ storeInit }) {
  const { push } = useNextRouterLikeRR();
  const { islogin, loginUserDetail } = useStore();
  const { cacheList } = useMaster();

  const [trandingViewData, setTrandingViewData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [mounted, setMounted] = useState(false);

  const imageNotFound = "/image-not-found.jpg";

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  useEffect(() => {
    setImageUrl(storeInit?.CDNDesignImageFolThumb);
    setMounted(true);
  }, [storeInit?.CDNDesignImageFolThumb]);

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeInit, islogin),
    [loginUserDetail, storeInit, islogin]
  );

  // ── Fetch + cache trending data ──────────────────────────────────────────
  const fetchAndSetTrending = useCallback(
    async (finalID, precomputedKey) => {
      if (!pricingContext || !pricingContext.PackageId) return;

      const keyALC = normalizeALC("");
      const eventName = "fg_trending";
      const { key } = buildAlbumCacheKey(eventName, storeInit, pricingContext, finalID, keyALC);
      const effectiveKey = precomputedKey || key;

      // 1. Client Session Cache Check (0ms instant browser read)
      let cachedSessionData = getSession(effectiveKey);
      if (cachedSessionData && Array.isArray(cachedSessionData) && cachedSessionData.length > 0) {
        const hasError = cachedSessionData.some(
          (item) =>
            item?.stat === 0 ||
            (typeof item?.stat_msg === "string" &&
              item.stat_msg.toLowerCase().includes("error")),
        );
        if (!hasError) {
          setTrandingViewData(cachedSessionData);
          return;
        }
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      // 2. Server Disk Cache Check (.next_cache)
      try {
        const cacheRes = await readCache(effectiveKey);
        if (cacheRes?.cached && Array.isArray(cacheRes.data) && cacheRes.data.length > 0) {
          const hasError = cacheRes.data.some(
            (item) =>
              item?.stat === 0 ||
              (typeof item?.stat_msg === "string" &&
                item.stat_msg.toLowerCase().includes("error")),
          );
          if (!hasError) {
            setTrandingViewData(cacheRes.data);
            setSession(effectiveKey, cacheRes.data);
            isFetchingRef.current = false;
            return;
          }
        }

        // 3. Live API Call
        const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETTrending", finalID);
        const records = response?.Data?.rd ?? [];
        const hasError = records.some(
          (item) =>
            item?.stat === 0 ||
            (typeof item?.stat_msg === "string" &&
              item.stat_msg.toLowerCase().includes("error")),
        );

        if (records.length > 0 && !hasError) {
          setTrandingViewData(records);
          setSession(effectiveKey, records);
          writeCache(effectiveKey, records).catch(console.error);
        } else {
          setTrandingViewData([]);
        }
        isFetchingRef.current = false;
      } catch (error) {
        console.error("[Trending] Error:", error);
        setTrandingViewData([]);
        isFetchingRef.current = false;
      }
    },
    [pricingContext, storeInit]
  );

  useEffect(() => {
    if (!mounted || !pricingContext || !storeInit || cacheList === null) return;
    const fetchData = async () => {
      const visitorId = cookies.get("visiterId") ?? "0";
      const finalID =
        storeInit?.IsB2BWebsite == 0
          ? islogin === false
            ? visitorId
            : loginUserDetail?.id || "0"
          : loginUserDetail?.id || "0";
      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("fg_trending", storeInit, pricingContext, finalID, keyALC);
      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;
      await fetchAndSetTrending(finalID, key);
    };
    fetchData();
  }, [mounted, islogin, pricingContext, storeInit, fetchAndSetTrending, loginUserDetail?.id, cacheList]);

  // ── Build image URLs (main + hover) once data & imageUrl are ready ──────
  useEffect(() => {
    if (!trandingViewData?.length) return;
    setValidatedData(
      trandingViewData.slice(0, 4).map((item) => ({
        ...item,
        mainImageURL:
          item.ImageCount >= 1 ? `${imageUrl}${item?.designno}~1.jpg` : imageNotFound,
        hoverImageURL:
          item.ImageCount >= 2 ? `${imageUrl}${item?.designno}~2.jpg` : `${imageUrl}${item?.designno}~1.jpg`,
      }))
    );
  }, [trandingViewData, imageUrl]);

  // ── Navigation to PDP ─────────────────────────────────────────────────────
  const handleNavigation = (item) => {
    const cdnFol = storeInit?.CDNDesignImageFol || "";
    const itemMetalColorId = item?.MetalColorid ?? item?.MetalColorId ?? item?.metalcolorid;
    let imgUrl = item?.src || (cdnFol && item?.designno ? `${cdnFol}${item?.designno}~1.${item?.ImageExtension || "webp"}` : "");
    if (item?.ImageVideoDetail && item.ImageVideoDetail !== "0") {
      try {
        const parsed = typeof item.ImageVideoDetail === "string" ? JSON.parse(item.ImageVideoDetail) : item.ImageVideoDetail;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mtColorLocal = getSession("MetalColorCombo") || [];
          const targetColorObj = mtColorLocal.find(ele => Number(ele.id) === Number(itemMetalColorId));
          const targetColorCode = targetColorObj?.colorcode || item?.MetalColor;

          let matchedColorImg = null;
          if (targetColorCode) {
            const targetLower = targetColorCode.toLowerCase().trim();
            matchedColorImg = parsed.find(i => {
              if (Number(i?.TI) !== 2 || !i?.CN) return false;
              const cnLower = i.CN.toLowerCase().trim();
              return cnLower === targetLower || cnLower.includes(targetLower) || targetLower.includes(cnLower);
            });
          }

          if (matchedColorImg) {
            imgUrl = `${cdnFol}${item?.designno}~${matchedColorImg.Nm}~${matchedColorImg.CN}.${matchedColorImg.Ex || item?.ImageExtension || "webp"}`;
          } else {
            const normalImg = parsed.find(i => Number(i?.TI) === 1);
            if (normalImg) {
              imgUrl = `${cdnFol}${item?.designno}~${normalImg.Nm}.${normalImg.Ex || item?.ImageExtension || "webp"}`;
            }
          }
        }
      } catch (e) {}
    }
    let obj = {
      a: item?.autocode,
      b: item?.designno,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
      g: {},
      img: imgUrl,
      ArticleNo: item?.ArticleNo ?? "",
      ArticleId: item?.ArticleId ?? null ?? "",
      title: item?.TitleLine ?? "",
      nwt: item?.Nwt ?? 0,
      price: item?.UnitCostWithMarkUp ?? 0,
      mediaDet: item?.ImageVideoDetail ?? "",
      metalColorId: itemMetalColorId ?? loginUserDetail?.MetalColorId ?? storeInit?.MetalColorId ?? null,
      l: item?.ImageExtension || "webp",
      count: item?.ImageCount || 1,
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`);
  };

  if (!mounted || validatedData.length === 0) return null;

  const totalItems = validatedData.length;

  // Same exact card markup as before — only extracted into a function
  // so it can be reused inside SwiperSlide without touching any UI/data.
  const renderCard = (item, index) => (
    <Box
      onClick={() => handleNavigation(item)}
      sx={{
        width: "100%",
        background: "#fff",
        border: "3px solid #000",
        overflow: "hidden",
        transition: ".4s",
        cursor: "pointer",

        "&:hover": {
          transform: "translateY(-6px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: {
            xs: 160,
            md: 320,
          },
          overflow: "hidden",

          "& .main-image": {
            transition: "all .6s ease",
          },

          "& .hover-image": {
            opacity: 0,
            transform: "scale(1.1)",
            transition: "all .6s ease",
          },

          "&:hover .main-image": {
            opacity: 0,
            transform: "scale(1.1)",
          },

          "&:hover .hover-image": {
            opacity: 1,
            transform: "scale(1)",
          },
        }}
      >
        <Box
          component="img"
          className="main-image"
          src={item.mainImageURL}
          alt={item?.TitleLine || "Trending Design"}
          onError={(e) => (e.target.src = imageNotFound)}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <Box
          component="img"
          className="hover-image"
          src={item.hoverImageURL}
          alt={`${item?.TitleLine || "Trending Design"} Hover`}
          onError={(e) => (e.target.src = item.mainImageURL)}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          borderTop: "2px solid #000",
          py: 0.7,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontFamily: "serif",
            color: "#111",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item?.TitleLine || "Exquisite Piece"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <div id="Trendingnow">
      <Box>
        {/* Center Content */}
        <Box>
          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: { xs: 34, md: 15 },
              fontWeight: 1000,
              color: "#0d1232",
              textAlign: "center",
            }}
          >
            IN THE SPOTLIGHT
          </Typography>
          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: { xs: 34, md: 42 },
              fontWeight: 700,
              mt: 1,
              color: "#2C2C2C",
              textAlign: "center",
            }}
          >
            Trending Now
          </Typography>

          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: { xs: 34, md: 18 },
              fontWeight: 400,
              color: "gray",
              mb: 0,
              textAlign: "center",
            }}
          >
            Explore the latest expressions of luxury and contemporary elegance.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              backgroundImage: `url(/WebSiteStaticImage/Banner/trending_banner.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              p: 5,
            }}
          >
            
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  allowTouchMove: true,
                },
                600: {
                  slidesPerView: 3,
                  allowTouchMove: true,
                },
                900: {
                  slidesPerView: 4,
                  allowTouchMove: false,
                },
              }}
              style={{ overflow: "hidden" }}
            >
              {validatedData.map((item, index) => (
                <SwiperSlide key={item?.designno || index}>
                  {renderCard(item, index)}
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              my: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "1px",
                bgcolor: "#d9d9d9",
              }}
            />

            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => push(`/p/Trending/?T=${btoa("Trending")}`)}
              sx={{
                mx: 3,
                px: 3,
                py: 1,
                color: "#0d1232",
                fontWeight: 600,
                letterSpacing: "1px",
                backgroundColor: "transparent",

                "& .MuiSvgIcon-root": {
                  transition: "transform 0.3s ease",
                },

                "&:hover .MuiSvgIcon-root": {
                  transform: "translateX(5px)",
                },
              }}
            >
              VIEW ALL
            </Button>

            <Box
              sx={{
                flex: 1,
                height: "1px",
                bgcolor: "#d9d9d9",
              }}
            />
          </Box>
        </Container>
      </Box>
    </div>
  );
}