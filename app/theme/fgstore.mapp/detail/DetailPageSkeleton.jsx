"use client";
import React, { useState, useMemo } from "react";
import { Box, Skeleton, Typography, Button, Card, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import MobileNavbar from "./_detComponents/NavigationBar";

export default function DetailPageSkeleton({ imageUrl, title, price, CurrencyCode, ArticleNo, nwt, media, decodedData }) {
  const [failedImages, setFailedImages] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);

  // Belux candidate image parsing logic
  const candidateImages = useMemo(() => {
    if (media && media.length > 1) {
      return media.map((item, idx) => ({
        src: item?.src,
        type: item?.type || "image",
        index: idx,
      }));
    }

    if (!imageUrl || typeof imageUrl !== "string") return [];

    const list = [{
      src: imageUrl,
      type: "image",
      index: 1,
    }];

    try {
      const lastSlashIdx = imageUrl.lastIndexOf("/");
      if (lastSlashIdx === -1) return list;

      const baseCdn = imageUrl.substring(0, lastSlashIdx + 1);
      const fileName = imageUrl.substring(lastSlashIdx + 1);
      if (!fileName) return list;

      const parts = fileName.split("~");
      const designNo = parts[0];
      if (!designNo) return list;

      let colorCode = null;
      let extension = "webp";

      if (parts.length > 2) {
        const lastPart = parts[2].split(".");
        colorCode = lastPart[0];
        extension = lastPart[1] || "webp";
      } else if (parts.length > 1) {
        const lastPart = parts[1].split(".");
        extension = lastPart[1] || "webp";
      }

      for (let i = 2; i <= 4; i++) {
        const src = colorCode
          ? `${baseCdn}${designNo}~${i}~${colorCode}.${extension}`
          : `${baseCdn}${designNo}~${i}.${extension}`;

        list.push({
          src,
          type: "image",
          index: i,
        });
      }
    } catch (e) {
      console.error("Error parsing imageUrl in DetailPageSkeleton:", e);
    }
    return list;
  }, [media, imageUrl]);

  const handleImgError = (index) => {
    setFailedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const visibleImages = candidateImages.filter((item) => !failedImages[item.index]);
  const activeImageSrc = visibleImages[activeSlide]?.src || imageUrl;

  const displayTitle = ArticleNo || title || decodedData?.b || "Product Detail";
  const designNo = decodedData?.b || (ArticleNo ? ArticleNo.split("-")[0] : "");
  const currencySymbol = CurrencyCode || "INR";
  const formattedPrice = price ? formatter(price) : null;

  // Dynamic attribute extraction from decodedData / image filename (No hardcoded fake defaults)
  const metalColorVal = useMemo(() => {
    if (imageUrl) {
      const fileName = imageUrl.split("/").pop() || "";
      const parts = fileName.split("~");
      if (parts.length > 2) {
        const code = parts[2].split(".")[0]?.toUpperCase();
        if (code === "YELLOW") return "Yellow";
        if (code === "WHITE") return "White";
        if (code === "ROSE" || code === "PINK") return "Rose";
      }
    }
    return null;
  }, [imageUrl]);

  const metalTypeVal = useMemo(() => {
    if (decodedData?.g?.[0]?.[0]) return String(decodedData.g[0][0]);
    return null;
  }, [decodedData]);

  const diaVal = useMemo(() => {
    if (decodedData?.d && typeof decodedData.d === "string" && !/^\d+,\d+$/.test(decodedData.d)) {
      return String(decodedData.d);
    }
    return null;
  }, [decodedData]);

  const isTitleLoading = !ArticleNo && !title && !decodedData?.b;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        pb: 6,
        boxSizing: "border-box",
      }}
    >
      {/* 1. Mobile Header Bar (Matches MobileNavbar 1:1) */}
      <MobileNavbar />

      {/* 2. Hero Image Container */}
      <Box
        sx={{
          width: "100%",
          height: "42vh",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {activeImageSrc ? (
          <img
            src={activeImageSrc}
            alt={displayTitle}
            onError={() => handleImgError(visibleImages[activeSlide]?.index || 1)}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: "0px" }} />
        )}
      </Box>

      {/* 3. Product Info Block */}
      <Box sx={{ width: "100%", px: 2, mt: 2, textAlign: "left" }}>
        {/* Title + Pagination Dots Row */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
          {isTitleLoading ? (
            <Skeleton variant="text" width={180} height={30} />
          ) : (
            <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#102a43" }}>
              {displayTitle}
            </Typography>
          )}

          {visibleImages.length > 1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              {visibleImages.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: idx === activeSlide ? "#333333" : "#cccccc",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>

        {/* Design No Subtitle */}
        {designNo ? (
          <Typography sx={{ fontSize: "12px", color: "#627d98", fontWeight: 600, mb: 1 }}>
            Design No: {designNo}
          </Typography>
        ) : (
          <Skeleton variant="text" width={100} height={18} sx={{ mb: 1 }} />
        )}

        {/* Price Line */}
        {formattedPrice ? (
          <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "#0b2f83", mb: 1.5 }}>
            {currencySymbol} {formattedPrice}
          </Typography>
        ) : (
          <Skeleton variant="text" width={140} height={32} sx={{ mb: 1.5 }} />
        )}

        {/* 4. Attribute Grid Cards */}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item size={{ xs: 6, sm: 6 }}>
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "4px", p: "8px 12px", backgroundColor: "#fff" }}>
              <Typography sx={{ fontSize: "0.65rem", color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                METAL TYPE:
              </Typography>
              {metalTypeVal ? (
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                  {metalTypeVal}
                </Typography>
              ) : (
                <Skeleton variant="text" width={70} height={20} />
              )}
            </Box>
          </Grid>
          <Grid item size={{ xs: 6, sm: 6 }}>
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "4px", p: "8px 12px", backgroundColor: "#fff" }}>
              <Typography sx={{ fontSize: "0.65rem", color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                METAL COLOR:
              </Typography>
              {metalColorVal ? (
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                  {metalColorVal}
                </Typography>
              ) : (
                <Skeleton variant="text" width={60} height={20} />
              )}
            </Box>
          </Grid>
          <Grid item size={{ xs: 6, sm: 6 }}>
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "4px", p: "8px 12px", backgroundColor: "#fff" }}>
              <Typography sx={{ fontSize: "0.65rem", color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                DIAMOND:
              </Typography>
              {diaVal ? (
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                  {diaVal}
                </Typography>
              ) : (
                <Skeleton variant="text" width={65} height={20} />
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Customize Design Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mt: 1.5,
            py: 1,
            borderRadius: "4px",
            borderColor: "#333333",
            color: "#333333",
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "none",
          }}
        >
          Customize Design (Metal, Diamond & Size)
        </Button>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 2, mb: 2, width: "100%", boxSizing: "border-box" }}>
          <Button
            fullWidth
            sx={{
              py: 1.2,
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "14px",
              textTransform: "none",
              border: "1.5px solid #0b2f83 !important",
              color: "#0b2f83 !important",
              backgroundColor: "#ffffff !important",
            }}
          >
            Add to Cart
          </Button>
          <Button
            fullWidth
            sx={{
              py: 1.2,
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "14px",
              textTransform: "none",
              border: "1.5px solid #d32f2f !important",
              color: "#d32f2f !important",
              backgroundColor: "#ffffff !important",
            }}
          >
            Wishlist
          </Button>
        </Box>

        {/* Material Details Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            p: 2,
            mt: 2,
          }}
        >
          <Typography sx={{ fontSize: "13px", fontWeight: 700, letterSpacing: 0.8, color: "#102a43", textTransform: "uppercase", mb: 1 }}>
            Material Details
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>Design No</Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>{designNo || ArticleNo || "..."}</Typography>
            </Stack>
            {nwt && (
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>Net Wt</Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>{nwt} g</Typography>
              </Stack>
            )}
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
