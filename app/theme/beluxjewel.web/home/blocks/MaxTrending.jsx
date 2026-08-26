"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  styled,
  Card,
  CardMedia,
} from "@mui/material";
import {
  formatter,
  formatTitleLine,
  formatRedirectTitleLine,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import cookies from "js-cookie";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import {
  normalizeALC,
  buildAlbumCacheKey,
  findMatchingCacheEntry,
  getPricingContext,
} from "@/app/(core)/cache_utility/CacheBuilder";
import { HeaderV2 } from "./Header";
import SpireBox from "./Svg";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

// ─── Styled Components ───────────────────────────────────────────────────────

const BannerContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: "400px",
  borderRadius: "16px",
  overflow: "hidden",
  cursor: "pointer",
  backgroundColor: "#f5f5f5",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 1.2s ease",
  },
  "&:hover img": {
    transform: "scale(1.03)",
  },
}));

const BannerOverlay = styled(Box)({
  position: "absolute",
  bottom: "24px",
  left: "24px",
  zIndex: 2,
});

const ProductCardWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: "12px",
  overflow: "hidden",
  cursor: "pointer",
  backgroundColor: "transparent",
  transition: "all 0.4s ease",
  "&:hover .product-image": {
    transform: "scale(1.05)",
  },
  boxSizing: "border-box",
}));

const ImageBox = styled(Box)({
  position: "relative",
  width: "100%",
  paddingTop: "115%", // Slightly more compact
  overflow: "hidden",
  backgroundColor: "#F4F4F4",
  borderRadius: "12px",
  boxSizing: "border-box",
});

// ─── Main Component ───────────────────────────────────────────────────────────

const MaxTrending = ({ data, storeInit }) => {
  const { islogin, loginUserDetail } = useStore();
  const { push } = useNextRouterLikeRR();
  const { cacheList, setCacheList } = useMaster();
  const [trandingViewData, setTrandingViewData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [validatedData, setValidatedData] = useState([]);
  const [mounted, setMounted] = useState(false);
  const imageNotFound = "/image-not-found.jpg";

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const isOdd = (num) => num % 2 !== 0;

  useEffect(() => {
    setImageUrl(storeInit?.CDNDesignImageFolThumb);
    setMounted(true);
  }, [storeInit?.CDNDesignImageFolThumb]);

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeInit, islogin),
    [loginUserDetail, storeInit, islogin],
  );

  // ── Logic: Data Fetching & Caching ───────────────────────────────────────────
  const fetchAndSetTrending = useCallback(
    async (finalID, precomputedKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current)
        return;

      const apiALC = "";
      const keyALC = normalizeALC("");
      const eventName = "fg_trending";
      const { key, meta } = buildAlbumCacheKey(
        eventName,
        storeInit,
        pricingContext,
        finalID,
        keyALC,
      );
      const effectiveKey = precomputedKey || key;

      isFetchingRef.current = true;

      try {
        const localCacheRes = await fetch(
          `/api/v1/cache?mode=meta&key=${effectiveKey}`,
        )
          .then((res) => res.json())
          .catch(() => ({ cached: false }));
        const matchingServerEntry = findMatchingCacheEntry(
          cacheList?.Data?.rd ?? [],
          pricingContext,
          eventName,
          apiALC,
        );
        const serverRebuildDate = matchingServerEntry?.CacheRebuildDate ?? null;

        if (
          localCacheRes?.cached &&
          localCacheRes?.CacheRebuildDate === serverRebuildDate
        ) {
          const cachedRes = await fetch(
            `/api/v1/cache?key=${effectiveKey}`,
          ).then((res) => res.json());
          if (cachedRes.cached && Array.isArray(cachedRes.data)) {
            setTrandingViewData(cachedRes.data);
            isFetchingRef.current = false;
            return;
          }
        }

        const response = await Get_Tren_BestS_NewAr_DesigSet_Album(
          storeInit,
          "GETTrending",
          finalID,
        );
        const records = response?.Data?.rd ?? [];
        setTrandingViewData(records);
        isFetchingRef.current = false;

        if (records.length > 0) {
          const bookResult = await BookCache(
            finalID,
            eventName,
            pricingContext,
            apiALC,
          );
          if (bookResult?.CacheRebuildDate) {
            fetch("/api/v1/cache", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                key: effectiveKey,
                data: records,
                meta: {
                  ...meta,
                  CacheRebuildDate: bookResult.CacheRebuildDate,
                },
              }),
            });
          }
        }
      } catch (error) {
        console.error("[Trending] Error:", error);
        isFetchingRef.current = false;
      }
    },
    [pricingContext, storeInit, cacheList],
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
      const { key } = buildAlbumCacheKey(
        "fg_trending",
        storeInit,
        pricingContext,
        finalID,
        keyALC,
      );
      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;
      await fetchAndSetTrending(finalID, key);
    };
    fetchData();
  }, [
    mounted,
    islogin,
    pricingContext,
    storeInit,
    fetchAndSetTrending,
    loginUserDetail?.id,
    cacheList,
  ]);

  useEffect(() => {
    if (!trandingViewData?.length) return;
    setValidatedData(
      trandingViewData.map((item) => ({
        ...item,
        validatedImageURL: `${imageUrl}${item?.designno}~1.jpg`,
      })),
    );
  }, [trandingViewData, imageUrl]);

  const handleNavigation = (item) => {
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
          if (colorImg) imgUrl = `${cdnFol}${item.designno}~${colorImg.Nm}~${colorImg.CN}.${colorImg.Ex || ext}`;
        }
      } catch {}
    }
    if (!imgUrl) imgUrl = `${cdnFol}${item?.designno}~1.${ext}`;

    let obj = {
      a: item?.autocode,
      b: item?.designno,
      // fallback to storeInit so guest users (not logged in) still get valid pricing params
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
      l: item?.ImageExtension,
      count: item?.ImageCount,
      metalColorId: item?.MetalColorid ?? null,
      mediaDet: item?.ImageVideoDetail ?? "",
      img: imgUrl,
      title: item?.TitleLine ?? "",
      price: item?.UnitCostWithMarkUp ?? 0,
      nwt: item?.Nwt ?? 0,
      ArticleNo: item?.ArticleNo ?? item?.designno ?? "",
      ArticleId: item?.ArticleId ?? item?.id ?? null,
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(
      `/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`,
    );
  };


  if (validatedData.length === 0) return null;

  return (
    <Box sx={{ bgcolor: "#fff", py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
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

      <Grid container spacing={1.5} sx={{ mt: 1 }}>
        {/* Left: Large Banner */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <BannerContainer
            onClick={() => push(`/p/Trending/?T=${btoa("Trending")}`)}
          >
            <img
              src="WebSiteStaticImage/Banner/trendingbanner2.webp"
              alt="Trending Banner"
              loading="lazy"
            />
            <BannerOverlay>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "50px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  "&:hover": {
                    bgcolor: "#f8f8f8",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                SHOP COLLECTION
              </Button>
            </BannerOverlay>
          </BannerContainer>
        </Grid>

        {/* Right: 4 Small Product Cards */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            {validatedData.slice(0, 4).map((item, index) => (
              <Grid item size={{ xs: 6 }} key={index}>
                <ProductCardWrapper onClick={() => handleNavigation(item)}>
                  <ImageBox>
                    <Box
                      className="product-image"
                      component="img"
                      src={
                        item.ImageCount >= 1
                          ? item.validatedImageURL
                          : imageNotFound
                      }
                      onError={(e) => (e.target.src = imageNotFound)}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        p: 1.5,
                        transition: "transform 0.8s ease",
                        boxSizing: "border-box",
                        mixBlendMode: "multiply",
                      }}
                    />
                  </ImageBox>

                  <Box sx={{ py: 1.2, px: 0.5, textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: "0.6rem",
                        color: "#A0A0A0",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                        fontWeight: 500,
                        mb: 0.3,
                      }}
                    >
                      {item?.designno}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.85rem",
                        color: "#1a1a1a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mb: 0.3,
                      }}
                    >
                      {item?.TitleLine || "Exquisite Piece"}
                    </Typography>

                    {storeInit?.IsPriceShow == 1 && (
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "#333",
                        }}
                      >
                        {islogin
                          ? loginUserDetail?.CurrencyCode
                          : storeInit?.CurrencyCode}{" "}
                        {formatter(item?.UnitCostWithMarkUp)}
                      </Typography>
                    )}
                  </Box>
                </ProductCardWrapper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaxTrending;
