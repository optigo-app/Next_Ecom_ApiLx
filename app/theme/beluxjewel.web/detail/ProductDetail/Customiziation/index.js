"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DiamondIcon from "@mui/icons-material/Diamond";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

// ── Brand design tokens ─────────────────────────────────────────────────────
const colors = {
  primary: "#0B2F83",
  accentLight: "#F0F4FC",
  textDark: "#102A43",
  textMuted: "#627D98",
  alertRed: "#D32F2F",
  borderLight: "#D9E2EC",
  btnHover: "#082360",
};

// Metal color → visual swatch
const METAL_SWATCH = {
  Yellow: "linear-gradient(135deg, #f5d060 0%, #e8a900 100%)",
  White: "linear-gradient(135deg, #f0f0f0 0%, #c8c8c8 100%)",
  Rose: "linear-gradient(135deg, #f2b8b8 0%, #c97878 100%)",
  "Rose Gold": "linear-gradient(135deg, #f2b8b8 0%, #c97878 100%)",
  Pink: "linear-gradient(135deg, #f2b8b8 0%, #e57373 100%)",
};

// Quality badge colors
const QUALITY_COLOR_MAP = {
  PD: "#9c7b4e",
  IJ: "#1e5fa8",
  FG: "#2e7d32",
  EF: "#6a1b9a",
};

// ── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: "11px",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);

const MetalCard = ({ combo, isSelected, onClick }) => {
  const swatch =
    METAL_SWATCH[combo.MetalColor] || "linear-gradient(135deg,#ccc,#999)";
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        border: `2px solid ${isSelected ? colors.primary : colors.borderLight}`,
        backgroundColor: isSelected ? colors.accentLight : "#fff",
        borderRadius: "14px",
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        position: "relative",
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isSelected
          ? "0 0 0 3px rgba(11,47,131,0.14), 0 4px 18px rgba(11,47,131,0.1)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        "&:hover": {
          borderColor: colors.primary,
          boxShadow: "0 4px 18px rgba(11,47,131,0.12)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {isSelected && (
        <CheckCircleIcon
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            fontSize: "18px",
            color: colors.primary,
            bgcolor: "#fff",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
      )}
      {/* Metal swatch circle */}
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: swatch,
          border: "1.5px solid rgba(0,0,0,0.12)",
          flexShrink: 0,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "12.5px",
            color: isSelected ? colors.primary : colors.textDark,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          {combo.MetalType}
        </Typography>
        <Typography
          sx={{
            fontSize: "10px",
            color: colors.textMuted,
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {combo.MetalColor}
        </Typography>
      </Box>
    </Box>
  );
};

const SizePill = ({ size, isSelected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: "pointer",
      minWidth: 52,
      height: 52,
      px: 2, // Added horizontal padding to fit text like 'One Size'
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10px",
      border: `2px solid ${isSelected ? colors.primary : colors.borderLight}`,
      backgroundColor: isSelected ? colors.accentLight : "#fff",
      fontWeight: 700,
      fontSize: "14px",
      color: isSelected ? colors.primary : colors.textDark,
      transition: "all 0.15s ease",
      boxShadow: isSelected
        ? "0 0 0 3px rgba(11,47,131,0.12)"
        : "0 1px 4px rgba(0,0,0,0.05)",
      "&:hover": { borderColor: colors.primary, transform: "translateY(-1px)" },
    }}
  >
    {size}
  </Box>
);

const QualityCard = ({ combo, isSelected, onClick }) => {
  const key = `${combo.Quality}-${combo.Color}`;
  const badgeColor = QUALITY_COLOR_MAP[combo.Quality] || colors.textMuted;
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        border: `2px solid ${isSelected ? colors.primary : colors.borderLight}`,
        backgroundColor: isSelected ? colors.accentLight : "#fff",
        borderRadius: "14px",
        px: 2.5,
        py: 1.5,
        position: "relative",
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isSelected
          ? "0 0 0 3px rgba(11,47,131,0.14), 0 4px 18px rgba(11,47,131,0.1)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        "&:hover": {
          borderColor: colors.primary,
          boxShadow: "0 4px 18px rgba(11,47,131,0.12)",
          transform: "translateY(-1px)",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minWidth: 80,
      }}
    >
      {isSelected && (
        <CheckCircleIcon
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            fontSize: "18px",
            color: colors.primary,
            bgcolor: "#fff",
            borderRadius: "50%",
          }}
        />
      )}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "15px",
          color: isSelected ? colors.primary : badgeColor,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          lineHeight: 1.2,
        }}
      >
        {combo.Quality}
      </Typography>
      <Typography
        sx={{
          fontSize: "10px",
          color: colors.textMuted,
          fontWeight: 600,
          mt: 0.3,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {combo.Color}
      </Typography>
      {combo.StoneTypeName && (
        <Typography
          sx={{
            fontSize: "9px",
            color: colors.borderLight,
            mt: 0.2,
            fontWeight: 500,
          }}
        >
          {combo.StoneTypeName}
        </Typography>
      )}
    </Box>
  );
};

// ── Main Drawer Component ─────────────────────────────────────────────────────
export default function CustomizerDrawer({
  open,
  onClose,
  rd1 = [],
  rd2 = [],
  defaultArticleId,
  onConfirm,
  storeInit,
  loginData,
}) {
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDiaQc, setSelectedDiaQc] = useState(null);

  // ── 1. Unique metal combos (MetalTypeId + MetalColorId as key) ─────────────
  const metalCombos = useMemo(() => {
    const seen = new Set();
    return rd1.filter((row) => {
      const key = `${row.MetalTypeId}-${row.MetalColorId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rd1]);

  // ── 2. Set defaults from defaultArticleId or first combo when drawer opens ──
  useEffect(() => {
    if (!open || !metalCombos.length) return;

    let targetMetal = metalCombos[0];
    let targetSize = null;

    if (defaultArticleId) {
      const defArt = rd1.find((r) => r.ArticleId === defaultArticleId);
      if (defArt) {
        const found = metalCombos.find(
          (m) =>
            m.MetalTypeId === defArt.MetalTypeId &&
            m.MetalColorId === defArt.MetalColorId,
        );
        if (found) targetMetal = found;
        if (defArt.Size) targetSize = defArt.Size;
      }
    }

    setSelectedMetal(targetMetal);
    setSelectedSize(targetSize);
  }, [open, metalCombos, defaultArticleId, rd1]);

  // ── 3. Articles matching selected metal ────────────────────────────────────
  const matchingArticles = useMemo(() => {
    if (!selectedMetal) return [];
    return rd1.filter(
      (r) =>
        r.MetalTypeId === selectedMetal.MetalTypeId &&
        r.MetalColorId === selectedMetal.MetalColorId,
    );
  }, [rd1, selectedMetal]);

  // ── 4. Available sizes for selected metal (Unique & Sorted) ────────────────
  const availableSizes = useMemo(() => {
    const sizes = Array.from(
      new Set(matchingArticles.map((r) => r.Size).filter(Boolean)),
    );
    return sizes.sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a).localeCompare(String(b));
    });
  }, [matchingArticles]);

  // ── 5. Reset / set size when metal changes ─────────────────────────────────
  useEffect(() => {
    if (!selectedMetal) return;
    if (availableSizes.length > 0) {
      setSelectedSize((prev) =>
        availableSizes.includes(prev) ? prev : availableSizes[0],
      );
    } else {
      setSelectedSize(null);
    }
  }, [selectedMetal]); // intentionally only dep on selectedMetal

  // ── 6. Active article (metal + size) ──────────────────────────────────────
  const activeArticle = useMemo(() => {
    if (selectedSize) {
      return (
        matchingArticles.find((r) => r.Size === selectedSize) ||
        matchingArticles[0]
      );
    }
    return matchingArticles[0] || null;
  }, [matchingArticles, selectedSize]);

  const stoneQualityCombos = useMemo(() => {
    const matchingIds = new Set(matchingArticles.map((r) => r.ArticleId));
    const seen = new Set();
    return rd2
      .filter((r) => {
        if (!matchingIds.has(r.ArticleId)) return false;
        if (r.StoneTypeid !== 1) return false;
        // normalize key to uppercase to dedupe casing variants
        const key = `${r.Quality?.toUpperCase()}-${r.Color?.toUpperCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((r) => ({
        ...r,
        // Expose normalized keys so QualityCard / key comparisons are consistent
        Quality: r.Quality?.toUpperCase(),
        Color: r.Color?.toUpperCase(),
      }));
  }, [rd2, matchingArticles]);

  // ── 8. Set default dia quality from defaultArticleId, else first combo ─────
  useEffect(() => {
    if (!stoneQualityCombos.length) {
      setSelectedDiaQc(null);
      return;
    }
    // If we have a defaultArticleId, find its first qualifying stone entry
    if (defaultArticleId && rd2.length) {
      const defStone = rd2.find(
        (r) => r.ArticleId === defaultArticleId && r.StoneTypeid === 1,
      );
      if (defStone) {
        // Key must be uppercase to match stoneQualityCombos entries
        const key = `${defStone.Quality?.toUpperCase()}-${defStone.Color?.toUpperCase()}`;
        const exists = stoneQualityCombos.find(
          (c) => `${c.Quality}-${c.Color}` === key,
        );
        if (exists) {
          setSelectedDiaQc(key);
          return;
        }
      }
    }
    // Fallback: first combo
    setSelectedDiaQc(
      `${stoneQualityCombos[0].Quality}-${stoneQualityCombos[0].Color}`,
    );
  }, [stoneQualityCombos]); // intentional — reset when combos change

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleMetalSelect = (combo) => setSelectedMetal(combo);

  const handleConfirm = () => {
    onConfirm?.(
      activeArticle?.ArticleId,
      selectedSize,
      selectedDiaQc,
      selectedMetal,
    );
    onClose();
  };

  // ── Derived display ───────────────────────────────────────────────────────
  const price =
    activeArticle?.UnitCostWithmarkup ?? activeArticle?.TotalUnitCost ?? 0;
  const CurrencyCode = loginData?.CurrencyCode ?? storeInit?.CurrencyCode ?? "";
  const hasData = metalCombos.length > 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 99999,
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "600px" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#F8F7F4",
          zIndex: 99999,
          boxShadow: "-12px 0 48px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${colors.borderLight}`,
          bgcolor: "#fff",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "10px",
                color: colors.textMuted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Customize Your Piece
            </Typography>
            {price > 0 && storeInit?.IsPriceShow == 1 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 1,
                  mt: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: colors.textDark,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {CurrencyCode} {formatter(price)}
                </Typography>
              </Box>
            )}
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.textDark,
              bgcolor: "#f5f5f5",
              "&:hover": { bgcolor: "#ececec" },
              width: 36,
              height: 36,
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* ── Selection Summary ─────────────────────────────────────── */}
        {activeArticle && (
          <Box>
            <Typography
              sx={{
                fontSize: "9px",
                color: colors.textMuted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 1,
              }}
            >
              Selected Config
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              <Chip
                label={`${activeArticle.MetalType} · ${activeArticle.MetalColor}`}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: colors.textDark,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: "6px",
                  height: "24px",
                }}
              />
              {selectedSize && (
                <Chip
                  label={`Size ${selectedSize}`}
                  size="small"
                  sx={{
                    bgcolor: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: colors.textDark,
                    border: `1px solid ${colors.borderLight}`,
                    borderRadius: "6px",
                    height: "24px",
                  }}
                />
              )}
              {selectedDiaQc && (
                <Chip
                  label={selectedDiaQc.replace("-", " · ")}
                  size="small"
                  sx={{
                    bgcolor: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: colors.textDark,
                    border: `1px solid ${colors.borderLight}`,
                    borderRadius: "6px",
                    height: "24px",
                  }}
                />
              )}
              <Chip
                label={`Art# ${activeArticle.ArticleId}`}
                size="small"
                sx={{
                  bgcolor: colors.primary,
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  height: "24px",
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Scrollable Content ────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3.5, py: 3 }}>
        {!hasData ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60%",
              gap: 2,
              opacity: 0.5,
            }}
          >
            <DiamondIcon sx={{ fontSize: 48, color: colors.borderLight }} />
            <Typography sx={{ fontSize: "13px", color: colors.textMuted }}>
              Loading customization options…
            </Typography>
          </Box>
        ) : (
          <>
            {/* ── Section 1: Choice of Metal ────────────────────────────── */}
            <Box sx={{ mb: 4 }}>
              <SectionLabel>Choice of Metal</SectionLabel>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {metalCombos.map((combo) => {
                  const isSelected =
                    selectedMetal?.MetalTypeId === combo.MetalTypeId &&
                    selectedMetal?.MetalColorId === combo.MetalColorId;
                  return (
                    <MetalCard
                      key={`${combo.MetalTypeId}-${combo.MetalColorId}`}
                      combo={combo}
                      isSelected={isSelected}
                      onClick={() => handleMetalSelect(combo)}
                    />
                  );
                })}
              </Box>
            </Box>

            <Divider sx={{ mb: 3.5, borderColor: colors.borderLight }} />

            {/* ── Section 2: Size ───────────────────────────────────────── */}
            {availableSizes.length > 0 ? (
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <SectionLabel>Select Size</SectionLabel>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: colors.primary,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Size Guide
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {availableSizes.map((size) => (
                    <SizePill
                      key={size}
                      size={size}
                      isSelected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 4 }}>
                <SectionLabel>Size</SectionLabel>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: colors.textMuted,
                    fontWeight: 500,
                  }}
                >
                  Size not available
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 3.5, borderColor: colors.borderLight }} />

            {/* ── Section 3: Diamond Quality ────────────────────────────── */}
            {stoneQualityCombos.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <SectionLabel>Diamond Quality</SectionLabel>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: colors.primary,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Diamond Guide
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {stoneQualityCombos.map((combo) => {
                    const key = `${combo.Quality}-${combo.Color}`;
                    return (
                      <QualityCard
                        key={key}
                        combo={combo}
                        isSelected={selectedDiaQc === key}
                        onClick={() => setSelectedDiaQc(key)}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}
            {/* End of content */}
          </>
        )}
      </Box>

      {/* ── Sticky Bottom Action Bar ─────────────────────────────────────── */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${colors.borderLight}`,
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          disabled={!activeArticle}
          sx={{
            backgroundColor: colors.primary,
            color: "#fff",
            "&:hover": { backgroundColor: colors.btnHover },
            "&:disabled": {
              backgroundColor: colors.borderLight,
              color: colors.textMuted,
            },
            borderRadius: "10px",
            py: 1.8,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            boxShadow: "0 4px 18px rgba(11,47,131,0.25)",
            transition: "all 0.2s ease",
          }}
        >
          Confirm Customisation
        </Button>
      </Box>
    </Drawer>
  );
}
