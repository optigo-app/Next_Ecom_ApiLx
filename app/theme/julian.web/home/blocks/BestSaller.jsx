"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Pako from "pako";
import { formatRedirectTitleLine, formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";

const imageNotFound = "image-not-found.jpg";

export default function JewelryGallery({ noHeading = false, storeInit }) {
  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);

  const navigation = useNextRouterLikeRR();
  const { finalId, loginUserDetail, islogin } = useStore();

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeInit, islogin),
    [loginUserDetail, storeInit, islogin]
  );

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  // ── API ──────────────────────────────────────────────────────────────────
  const fetchAndSetBestSellers = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[JewelryGallery] Serving from cache");
          setBestSellerData(cacheRes.data);
          isFetchingRef.current = false;
          return;
        }

        console.log("[JewelryGallery] Cache miss, calling API...");
        const response = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETBestSeller", finalID);
        const apiData = response?.Data?.rd || [];

        if (apiData.length > 0) {
          setBestSellerData(apiData);
          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setBestSellerData([]);
        }
        isFetchingRef.current = false;
      } catch (err) {
        console.log("[JewelryGallery] Error in fetch:", err);
        setBestSellerData([]);
        isFetchingRef.current = false;
      }
    },
    [pricingContext, storeInit]
  );

  useEffect(() => {
    if (!pricingContext || !storeInit) return;

    setImageUrl(storeInit?.CDNDesignImageFol);

    const fetchData = async () => {
      const visitorId = finalId || "0";
      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("fg_bestseller", storeInit, pricingContext, visitorId, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetBestSellers(visitorId, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeInit, fetchAndSetBestSellers, finalId]);

  // ── Image URL builder ───────────────────────────────────────────────────
  const validateImageURLs = async () => {
    if (!bestSellerData?.length) return;
    const result = await Promise.all(
      bestSellerData.slice(0, 6).map(async (item) => {
        const imageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension || "webp"}`;
        return { ...item, validatedImageURL: imageURL };
      })
    );
    setValidatedData(result);
  };

  useEffect(() => {
    validateImageURLs();
  }, [bestSellerData]);

  // ── Navigation helper ───────────────────────────────────────────────────
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
    const obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem("scrollToProduct1", `product-${index}`);
    const encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  // ── Early return ────────────────────────────────────────────────────────
  if (!bestSellerData?.length) return null;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          position: "relative",
          display: noHeading ? "none" : "block",
          mb: 4,
        }}
      >
        {/* Center Content */}
        <Box>
          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: { xs: 15, md: 15 },
              fontWeight: 1000,
              mt: 7,
              color: "#0d1232",
              textAlign: "center",
            }}
          >
            MOST LOVED DESIGNS
          </Typography>

          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: { xs: 34, md: 42 },
              fontWeight: 400,
              mt: 1,
              color: "#2C2C2C",
              textAlign: "center",
            }}
          >
            CUSTOMER FAVORITES
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(6, 1fr)",
          },
          gap: "10px",
        }}
      >
        {validatedData.map((item, index) => (
          <Box
            key={item?.designno ?? index}
            className="gallery-card"
            onClick={() => handleNavigation(item?.designno, item?.autocode, item?.TitleLine, index)}
            sx={{
              position: "relative",
              height: {
                xs: 220,
                md: 320,
              },
              overflow: "hidden",
              cursor: "pointer",
              backgroundColor: "#f5f5f560",

              "&:hover img": {
                transform: "scale(1.08)",
              },

              "&:hover .product-overlay": {
                transform: "translateY(0)",
              },
            }}
          >
            <Box
              component="img"
              src={item.validatedImageURL}
              alt={item?.TitleLine || item?.designno}
              onError={(e) => {
                e.target.src = imageNotFound;
                e.target.alt = "no-image-found";
              }}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform .6s ease",
              }}
            />

            {/* Product Name + Price */}
            <Box
              className="product-overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                background: "#fff",
                py: 1,
                px: 2,
                textAlign: "center",
                transform: "translateY(100%)",
                transition: "transform .4s ease",
                zIndex: 2,
                boxSizing: "border-box",
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#2C2C2C",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item?.TitleLine || item?.designno}
                <br />
                {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}&nbsp;
                {formatter(item?.UnitCostWithMarkUp)}
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,.15), transparent)",
                opacity: 0,
                transition: ".3s",
              }}
            />
          </Box>
        ))}
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
          onClick={() => navigation.push(`/p/BestSeller/?T=${btoa("BestSeller")}`)}
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
  );
}