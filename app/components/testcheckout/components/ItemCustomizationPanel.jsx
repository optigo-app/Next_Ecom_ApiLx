"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Skeleton,
  CircularProgress,
  Grid,
  FormControl,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const noImageFound = "/image-not-found.jpg";

export default function ItemCustomizationPanel({
  open = true,
  isDrawer = false,
  customizingItem,
  storeinit,
  currencyCode,
  formatter,
  isPriceLoading,
  metalTypeCombo = [],
  metalColorCombo = [],
  diamondQualityColorCombo = [],
  colorStoneCombo = [],
  sizeCombo = [],
  editQty = 1,
  onCustomizationChange,
  onEditQtyChange,
  onApply,
  onCancel,
  handleMoveToDetail,
}) {
  const [imgSrc, setImgSrc] = useState("");

  const CDNDesignImageFol = storeinit?.CDNDesignImageFol;
  const CDNDesignImageFolThumb = storeinit?.CDNDesignImageFolThumb;

  const mtcCode = metalColorCombo?.find(
    (option) =>
      option?.metalcolorname === customizingItem?.metalcolorname ||
      option?.colorname === customizingItem?.metalcolorname,
  );
  const colorCode = mtcCode?.colorcode ? `~${mtcCode.colorcode}` : "";

  const fullImagePath = `${CDNDesignImageFolThumb}${customizingItem?.designno}~1.jpg`;
  const fullImagePathHd = `${CDNDesignImageFol}${customizingItem?.designno}~1.${customizingItem?.ImageExtension || "jpg"}`;

  const defaultUrl =
    typeof customizingItem?.images === "string"
      ? customizingItem?.images?.replace("/Design_Thumb", "")
      : "";
  const lastDotIndex = defaultUrl?.lastIndexOf(".");
  const firstPart =
    lastDotIndex !== -1 ? defaultUrl?.substring(0, lastDotIndex) : defaultUrl;
  const secondPart = customizingItem?.ImageExtension || "jpg";
  const finalSelectedUrl = firstPart ? `${firstPart}.${secondPart}` : "";

  useEffect(() => {
    if (!customizingItem) return;

    let imageURL =
      typeof customizingItem?.images === "string" && customizingItem?.images !== ""
        ? finalSelectedUrl
        : customizingItem?.ImageCount > 1
          ? `${CDNDesignImageFol}${customizingItem?.designno}~1${colorCode}.${customizingItem?.ImageExtension || "jpg"}`
          : `${CDNDesignImageFol}${customizingItem?.designno}~1.${customizingItem?.ImageExtension || "jpg"}`;

    if (!imageURL || imageURL.includes("undefined")) {
      imageURL = `${CDNDesignImageFolThumb}${customizingItem?.designno}~1${colorCode}.jpg`;
    }

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.onerror = () => {
      // Try thumbnail with color
      const thumbColor = `${CDNDesignImageFolThumb}${customizingItem?.designno}~1${colorCode}.jpg`;
      const img2 = new Image();
      img2.onload = () => setImgSrc(thumbColor);
      img2.onerror = () => {
        // Try thumbnail without color
        const thumbDefault = `${CDNDesignImageFolThumb}${customizingItem?.designno}~1.jpg`;
        const img3 = new Image();
        img3.onload = () => setImgSrc(thumbDefault);
        img3.onerror = () => {
          // Try HD without color
          const hdDefault = `${CDNDesignImageFol}${customizingItem?.designno}~1.${customizingItem?.ImageExtension || "jpg"}`;
          const img4 = new Image();
          img4.onload = () => setImgSrc(hdDefault);
          img4.onerror = () => {
            setImgSrc(noImageFound);
          };
          img4.src = hdDefault;
        };
        img3.src = thumbDefault;
      };
      img2.src = thumbColor;
    };
    img.src = imageURL;
  }, [
    customizingItem,
    CDNDesignImageFol,
    CDNDesignImageFolThumb,
    finalSelectedUrl,
    colorCode,
  ]);

  if (!customizingItem) return null;

  const currentPrice =
    customizingItem?.FinalCost ||
    (customizingItem?.UnitCostWithMarkUp || 0) * editQty;

  const hasDiamonds =
    storeinit?.IsDiamondCustomization == 1 &&
    (Number(customizingItem?.Dwt) > 0 || Number(customizingItem?.Dpcs) > 0);

  const hasColorStones =
    storeinit?.IsCsCustomization == 1 &&
    (Number(customizingItem?.CSwt) > 0 || Number(customizingItem?.CSpcs) > 0);

  const hasSize = sizeCombo?.rd?.length > 0 && customizingItem?.IsSize !== 0;

  // Accurately resolve selected values with case-insensitivity and ID matching
  const selectedMetalVal = (() => {
    if (!customizingItem) return "";
    const match = metalTypeCombo?.find(
      (m) =>
        (customizingItem.metaltypeid && m.Metalid === customizingItem.metaltypeid) ||
        m.metaltypename?.trim().toLowerCase() === customizingItem.metaltypename?.trim().toLowerCase() ||
        m.metaltype?.trim().toLowerCase() === customizingItem.metaltypename?.trim().toLowerCase()
    );
    return match ? match.metaltypename : customizingItem?.metaltypename || "";
  })();

  const selectedMetalColorVal = (() => {
    if (!customizingItem) return "";
    const match = metalColorCombo?.find(
      (c) =>
        (customizingItem.metalcolorid && c.id === customizingItem.metalcolorid) ||
        c.colorname?.trim().toLowerCase() === customizingItem.metalcolorname?.trim().toLowerCase() ||
        c.metalcolorname?.trim().toLowerCase() === customizingItem.metalcolorname?.trim().toLowerCase()
    );
    return match ? (match.colorname || match.metalcolorname) : customizingItem?.metalcolorname || "";
  })();

  const selectedDiaVal = (() => {
    if (!customizingItem) return "";
    const match = diamondQualityColorCombo?.find(
      (opt) =>
        (customizingItem.diamondqualityid && opt.QualityId === customizingItem.diamondqualityid && customizingItem.diamondcolorid && opt.ColorId === customizingItem.diamondcolorid) ||
        (opt.Quality?.trim().toLowerCase() === customizingItem.diamondquality?.trim().toLowerCase() &&
         opt.color?.trim().toLowerCase() === customizingItem.diamondcolor?.trim().toLowerCase())
    );
    return match
      ? `${match.Quality},${match.color}`
      : `${customizingItem?.diamondquality || ""},${customizingItem?.diamondcolor || ""}`;
  })();

  const selectedCsVal = (() => {
    if (!customizingItem) return "";
    const match = colorStoneCombo?.find(
      (opt) =>
        (customizingItem.colorstonequalityid && opt.QualityId === customizingItem.colorstonequalityid && customizingItem.colorstonecolorid && opt.ColorId === customizingItem.colorstonecolorid) ||
        (opt.Quality?.trim().toLowerCase() === customizingItem.colorstonequality?.trim().toLowerCase() &&
         opt.color?.trim().toLowerCase() === customizingItem.colorstonecolor?.trim().toLowerCase())
    );
    return match
      ? `${match.Quality},${match.color}`
      : `${customizingItem?.colorstonequality || ""},${customizingItem?.colorstonecolor || ""}`;
  })();

  // Inner Content Element
  const panelContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isDrawer ? "100%" : "auto",
        bgcolor: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.95rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          Customize Item
        </Typography>
        <IconButton
          size="small"
          onClick={onCancel}
          sx={{ color: "#777", "&:hover": { color: "#111", bgcolor: "#f5f5f5" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body Content */}
      <Box
        sx={{
          flex: isDrawer ? 1 : "initial",
          overflowY: isDrawer ? "auto" : "visible",
          overflowX: "hidden",
          p: { xs: 2.5, sm: 3 },
          display: "flex",
          flexDirection: "column",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {/* Main Image Preview - Clickable to Detail */}
        <Box
          onClick={() => handleMoveToDetail && handleMoveToDetail(customizingItem)}
          sx={{
            width: "100%",
            height: { xs: 250, sm: 290, md: 320 },
            bgcolor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            mb: 2.5,
            cursor: "pointer",
          }}
        >
          <img
            src={
              imgSrc ||
              (typeof customizingItem?.images === "string" && customizingItem.images) ||
              fullImagePath ||
              noImageFound
            }
            alt={customizingItem?.designno}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => {
              const imgEl = e.target;
              if (!imgEl.dataset.triedThumb && fullImagePath) {
                imgEl.src = fullImagePath;
                imgEl.dataset.triedThumb = "true";
              } else if (!imgEl.dataset.triedNoImg) {
                imgEl.src = noImageFound;
                imgEl.dataset.triedNoImg = "true";
              }
            }}
            loading="lazy"
          />
        </Box>

        {/* Title / Description */}
        <Typography
          variant="subtitle1"
          onClick={() => handleMoveToDetail && handleMoveToDetail(customizingItem)}
          sx={{
            fontWeight: 600,
            color: "#222",
            mb: 0.3,
            fontSize: "1rem",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {customizingItem?.designno}{" "}
          {customizingItem?.StockNo ? `(${customizingItem?.StockNo})` : ""}
        </Typography>
        {customizingItem?.TitleLine && (
          <Typography
            variant="body2"
            sx={{ mb: 2.5, color: "#777", fontSize: "0.82rem" }}
          >
            {formatTitleLine(customizingItem?.TitleLine)}
          </Typography>
        )}

        {/* Customization Options - 2x2 Clean FormLabel Grid */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            {/* 1. Metal Type */}
            {storeinit?.IsMetalCustomization == 1 && metalTypeCombo?.length > 0 && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#333",
                      mb: 0.6,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" },
                    }}
                  >
                    Metal Type
                  </FormLabel>
                  <select
                    value={selectedMetalVal}
                    onChange={(e) =>
                      onCustomizationChange("metalType", e.target.value)
                    }
                    className="testCheckout_select"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdcdc",
                      fontSize: "0.88rem",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#222",
                    }}
                  >
                    {metalTypeCombo.map((opt) => (
                      <option key={opt.Metalid} value={opt.metaltypename}>
                        {opt.metaltype || opt.metaltypename}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
            )}

            {/* 2. Metal Color */}
            {storeinit?.IsMetalCustomization == 1 && metalColorCombo?.length > 0 && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#333",
                      mb: 0.6,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" },
                    }}
                  >
                    Metal Color
                  </FormLabel>
                  <select
                    value={selectedMetalColorVal}
                    onChange={(e) =>
                      onCustomizationChange("metalColor", e.target.value)
                    }
                    className="testCheckout_select"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdcdc",
                      fontSize: "0.88rem",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#222",
                    }}
                  >
                    {metalColorCombo.map((opt) => (
                      <option key={opt.id} value={opt.colorname || opt.metalcolorname}>
                        {opt.colorname || opt.metalcolorname}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
            )}

            {/* 3. Diamond Quality / Color */}
            {diamondQualityColorCombo?.length > 0 && hasDiamonds && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#333",
                      mb: 0.6,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" },
                    }}
                  >
                    Diamond Quality
                  </FormLabel>
                  <select
                    value={selectedDiaVal}
                    onChange={(e) =>
                      onCustomizationChange("diamond", e.target.value)
                    }
                    className="testCheckout_select"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdcdc",
                      fontSize: "0.88rem",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#222",
                    }}
                  >
                    {diamondQualityColorCombo.map((opt) => (
                      <option
                        key={`${opt.QualityId},${opt.ColorId}`}
                        value={`${opt.Quality},${opt.color}`}
                      >
                        {opt.Quality},{opt.color}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
            )}

            {/* 4. Color Stone Quality / Color */}
            {colorStoneCombo?.length > 0 && hasColorStones && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#333",
                      mb: 0.6,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" },
                    }}
                  >
                    Color Stone
                  </FormLabel>
                  <select
                    value={selectedCsVal}
                    onChange={(e) =>
                      onCustomizationChange("colorstone", e.target.value)
                    }
                    className="testCheckout_select"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdcdc",
                      fontSize: "0.88rem",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#222",
                    }}
                  >
                    {colorStoneCombo.map((opt) => (
                      <option
                        key={`${opt.QualityId},${opt.ColorId}`}
                        value={`${opt.Quality},${opt.color}`}
                      >
                        {opt.Quality},{opt.color}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
            )}

            {/* 5. Size */}
            {hasSize && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#333",
                      mb: 0.6,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" },
                    }}
                  >
                    Size
                  </FormLabel>
                  <select
                    value={customizingItem?.Size || ""}
                    onChange={(e) => onCustomizationChange("size", e.target.value)}
                    className="testCheckout_select"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdcdc",
                      fontSize: "0.88rem",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#222",
                    }}
                  >
                    {sizeCombo.rd.map((opt) => (
                      <option key={opt.id} value={opt.sizename}>
                        {opt.sizename}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
            )}

            {/* 6. Quantity Selector */}
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <FormLabel
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#333",
                    mb: 0.6,
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                  }}
                >
                  Quantity
                </FormLabel>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #dcdcdc",
                    borderRadius: "4px",
                    bgcolor: "#fff",
                    height: 38,
                    px: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => onEditQtyChange(-1)}
                    disabled={Number(editQty) <= 1}
                    sx={{ color: "#555", p: 0.8 }}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <input
                    type="number"
                    min="1"
                    value={editQty}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        onEditQtyChange("", true);
                      } else {
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed)) {
                          onEditQtyChange(parsed, true);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (!editQty || Number(editQty) < 1) {
                        onEditQtyChange(1, true);
                      }
                    }}
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#222",
                      textAlign: "center",
                      width: "60px",
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      MozAppearance: "textfield",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onEditQtyChange(1)}
                    sx={{ color: "#555", p: 0.8 }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Sticky / Fixed Footer Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { xs: 2, sm: 2.5 },
          px: { xs: 2.5, sm: 3 },
          borderTop: "1px solid #f0f0f0",
          bgcolor: "#fafafa",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#888",
              display: "block",
              fontSize: "0.72rem",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            Calculated Price
          </Typography>
          {isPriceLoading ? (
            <Skeleton width={100} height={26} />
          ) : (
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: "var(--checkout-primary-text, #9c6d48)", fontSize: "1.05rem" }}
            >
              {currencyCode} {formatter(currentPrice)}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1.2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: "#555",
              borderColor: "#dcdcdc",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.5px",
              px: 2,
              py: 0.8,
              borderRadius: "2px",
              "&:hover": { borderColor: "#999", bgcolor: "#f9f9f9" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onApply}
            disabled={isPriceLoading}
            className="btnColorProCatProduct testCheckout_primary_btn"
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.5px",
              px: 3,
              py: 0.8,
              borderRadius: "2px",
              textTransform: "uppercase",
              bgcolor: "var(--checkout-primary, #cca182)",
              color: "var(--checkout-btn-color, #ffffff)",
              "&:hover": { bgcolor: "var(--checkout-primary-hover, #b88d6e)" },
            }}
          >
            {isPriceLoading ? (
              <CircularProgress size={18} sx={{ color: "var(--checkout-btn-color, #fff)" }} />
            ) : (
              "Apply"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // If mobile drawer mode is requested:
  if (isDrawer) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onCancel}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 460, md: 480 },
            maxWidth: "100%",
            bgcolor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {panelContent}
      </Drawer>
    );
  }

  // Desktop inline mode
  return (
    <Box
      className="testCheckout_editPanel"
      sx={{
        bgcolor: "#fff",
        border: "1px solid #eee",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
        position: "relative",
      }}
    >
      {panelContent}
    </Box>
  );
}
