"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    SwipeableDrawer,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

// Visual metal swatches
const METAL_SWATCH = {
    Yellow: "linear-gradient(135deg, #f5d060 0%, #e8a900 100%)",
    White: "linear-gradient(135deg, #f0f0f0 0%, #c8c8c8 100%)",
    Rose: "linear-gradient(135deg, #f2b8b8 0%, #c97878 100%)",
    "Rose Gold": "linear-gradient(135deg, #f2b8b8 0%, #c97878 100%)",
    Pink: "linear-gradient(135deg, #f2b8b8 0%, #e57373 100%)",
};

const SectionHeader = ({ title }) => (
    <Typography
        sx={{
            fontWeight: 700,
            fontSize: "11px",
            color: "#627d98",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            mb: 1.2,
            mt: 2,
            textAlign: "left",
        }}
    >
        {title}
    </Typography>
);

export default function MobileCustomizerDrawer({
    open,
    onClose,
    rd1 = [],
    rd2 = [],
    defaultArticleId,
    onConfirm,
    storeInit,
    currencySymbol = "INR",
}) {
    const [selectedMetal, setSelectedMetal] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedDiaQc, setSelectedDiaQc] = useState(null);
    const [selectedOrigin, setSelectedOrigin] = useState(null);

    // ── 1. Unique metal combos (MetalTypeId + MetalColorId) ───────────────────
    const metalCombos = useMemo(() => {
        const seen = new Set();
        const unique = rd1.filter((row) => {
            const metalId = row.MetalTypeId || row.metaltypeid || row.Metalid || row.id;
            const metalColorId = row.MetalColorId || row.metalcolorid;
            const key = `${metalId}-${metalColorId}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        return unique
            .sort((a, b) => {
                const getKarat = (str) => {
                    if (!str) return 0;
                    const match = String(str).match(/\d+/);
                    return match ? parseInt(match[0], 10) : 0;
                };
                const karatA = getKarat(a.MetalType || a.metal || a.metaltypename);
                const karatB = getKarat(b.MetalType || b.metal || b.metaltypename);
                return karatA - karatB;
            })
            .map((combo) => {
                const metalId = combo.MetalTypeId || combo.metaltypeid || combo.Metalid || combo.id;
                const metalColorId = combo.MetalColorId || combo.metalcolorid;
                const hasStock = rd1.some(
                    (r) =>
                        (r.MetalTypeId || r.metaltypeid || r.Metalid) === metalId &&
                        (r.MetalColorId || r.metalcolorid) === metalColorId &&
                        r.InStock === 1
                );
                return {
                    ...combo,
                    MetalTypeId: metalId,
                    MetalColorId: metalColorId,
                    MetalType: combo.MetalType || combo.metal || combo.metaltypename || combo.metalpurityname || "Gold",
                    MetalColor: combo.MetalColor || combo.metalcolorname || combo.colorname || "Yellow",
                    inStockLabel: hasStock ? "In Stock" : "Made to Order",
                };
            });
    }, [rd1]);

    // ── 2. Articles matching selected metal with diamond origin ────────────────
    const matchingArticlesWithOrigin = useMemo(() => {
        if (!rd1?.length) return [];
        const matching = selectedMetal
            ? rd1.filter(
                (r) =>
                    (r.MetalTypeId || r.metaltypeid || r.Metalid) === selectedMetal.MetalTypeId &&
                    (r.MetalColorId || r.metalcolorid) === selectedMetal.MetalColorId
            )
            : [];

        return matching.map((art) => {
            const diaStone = rd2.find(
                (stone) => stone.ArticleId === art.ArticleId && stone.StoneTypeid === 1
            );
            const rawOrigin = diaStone?.MaterialTypeName;
            const normalizedOrigin =
                rawOrigin && rawOrigin.trim() !== ""
                    ? rawOrigin
                    : diaStone
                        ? "Natural"
                        : null;
            return {
                ...art,
                MaterialTypeName: normalizedOrigin,
            };
        });
    }, [rd1, selectedMetal, rd2]);

    const availableOrigins = useMemo(() => {
        const origins = matchingArticlesWithOrigin
            .map((art) => art.MaterialTypeName)
            .filter((o) => o !== null && o !== undefined);
        const unique = Array.from(new Set(origins));
        return unique.length > 0 ? unique : ["Natural"];
    }, [matchingArticlesWithOrigin]);

    // ── 4. Initial defaults ───────────────────────────────────────────────────
    useEffect(() => {
        if (!open || !metalCombos.length) return;

        let targetMetal = metalCombos[0];
        let targetSize = null;
        let targetOrigin = availableOrigins.length > 0 ? availableOrigins[0] : null;

        if (defaultArticleId) {
            const defArt = rd1.find((r) => r.ArticleId == defaultArticleId);
            if (defArt) {
                const defMetalId = defArt.MetalTypeId || defArt.metaltypeid || defArt.Metalid;
                const defColorId = defArt.MetalColorId || defArt.metalcolorid;
                const found = metalCombos.find(
                    (m) => m.MetalTypeId === defMetalId && m.MetalColorId === defColorId
                );
                if (found) targetMetal = found;
                if (defArt.Size) targetSize = defArt.Size;

                const defStone = rd2.find(
                    (s) => s.ArticleId == defaultArticleId && s.StoneTypeid === 1
                );
                if (defStone?.MaterialTypeName && defStone.MaterialTypeName.trim() !== "") {
                    targetOrigin = defStone.MaterialTypeName;
                } else if (defStone) {
                    targetOrigin = "Natural";
                }
            }
        }

        setSelectedMetal(targetMetal);
        setSelectedSize(targetSize);
        setSelectedOrigin(targetOrigin);
    }, [open, metalCombos, defaultArticleId, rd1, rd2]);

    // ── 5. Available Sizes ────────────────────────────────────────────────────
    const availableSizes = useMemo(() => {
        const matchingOriginArticles = matchingArticlesWithOrigin.filter(
            (r) => r.MaterialTypeName === selectedOrigin
        );
        const sizeMap = new Map();
        matchingOriginArticles.forEach((art) => {
            if (!art.Size) return;
            const rd1Article = rd1.find((a) => a.ArticleId === art.ArticleId);
            const isInStock = rd1Article?.InStock === 1;
            if (!sizeMap.has(art.Size)) {
                sizeMap.set(art.Size, isInStock);
            } else if (isInStock) {
                sizeMap.set(art.Size, true);
            }
        });
        return Array.from(sizeMap.entries())
            .map(([size, inStock]) => ({
                size,
                inStockLabel: inStock ? "In Stock" : "Made to Order",
            }))
            .sort((a, b) => {
                const numA = parseFloat(a.size);
                const numB = parseFloat(b.size);
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return String(a.size).localeCompare(String(b.size));
            });
    }, [matchingArticlesWithOrigin, selectedOrigin, rd1]);

    useEffect(() => {
        if (!selectedMetal) return;
        if (availableSizes.length > 0) {
            setSelectedSize((prev) =>
                availableSizes.find((s) => s.size === prev) ? prev : availableSizes[0].size
            );
        } else {
            setSelectedSize(null);
        }
    }, [selectedMetal, selectedOrigin, availableSizes]);

    // ── 6. Active Article ─────────────────────────────────────────────────────
    const activeArticle = useMemo(() => {
        let found = matchingArticlesWithOrigin.find(
            (r) => r.Size === selectedSize && r.MaterialTypeName === selectedOrigin
        );
        if (!found) {
            found = matchingArticlesWithOrigin.find((r) => r.MaterialTypeName === selectedOrigin);
        }
        if (!found) {
            found = matchingArticlesWithOrigin.find((r) => r.Size === selectedSize);
        }
        return found || matchingArticlesWithOrigin[0] || null;
    }, [matchingArticlesWithOrigin, selectedSize, selectedOrigin]);

    // ── 7. Diamond Quality Options ───────────────────────────────────────────
    const stoneQualityCombos = useMemo(() => {
        const matchingIds = new Set(
            matchingArticlesWithOrigin
                .filter((r) => r.MaterialTypeName === selectedOrigin)
                .map((r) => r.ArticleId)
        );
        const seen = new Set();
        return rd2
            .filter((r) => {
                if (!matchingIds.has(r.ArticleId)) return false;
                if (r.StoneTypeid !== 1) return false;
                const key = `${r.Quality?.toUpperCase()}-${r.Color?.toUpperCase()}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .map((r) => {
                const articlesWithThisQuality = rd2
                    .filter(
                        (s) =>
                            s.StoneTypeid === 1 &&
                            s.Quality?.toUpperCase() === r.Quality?.toUpperCase() &&
                            s.Color?.toUpperCase() === r.Color?.toUpperCase() &&
                            matchingIds.has(s.ArticleId)
                    )
                    .map((s) => s.ArticleId);
                const hasStock = rd1.some(
                    (a) => articlesWithThisQuality.includes(a.ArticleId) && a.InStock === 1
                );
                return {
                    ...r,
                    Quality: r.Quality?.toUpperCase(),
                    Color: r.Color?.toUpperCase(),
                    inStockLabel: hasStock ? "In Stock" : "Made to Order",
                };
            });
    }, [rd2, rd1, matchingArticlesWithOrigin, selectedOrigin]);

    useEffect(() => {
        if (!stoneQualityCombos.length) {
            setSelectedDiaQc(null);
            return;
        }
        if (defaultArticleId && rd2.length) {
            const defStone = rd2.find(
                (r) => r.ArticleId == defaultArticleId && r.StoneTypeid === 1
            );
            if (defStone) {
                const key = `${defStone.Quality?.toUpperCase()}-${defStone.Color?.toUpperCase()}`;
                const exists = stoneQualityCombos.find((c) => `${c.Quality}-${c.Color}` === key);
                if (exists) {
                    setSelectedDiaQc(key);
                    return;
                }
            }
        }
        setSelectedDiaQc(`${stoneQualityCombos[0].Quality}-${stoneQualityCombos[0].Color}`);
    }, [stoneQualityCombos]);

    const handleConfirm = () => {
        onConfirm?.(
            activeArticle?.ArticleId,
            selectedSize,
            selectedDiaQc,
            selectedMetal
        );
        onClose();
    };

    const calculatedPrice = activeArticle?.UnitCostWithMarkUp
        ? formatter(activeArticle.UnitCostWithMarkUp)
        : null;

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={() => { }}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    maxHeight: "88vh",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Sheet Handle Bar */}
            <Box
                sx={{
                    width: 36,
                    height: 4,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 2,
                    mx: "auto",
                    mt: 1.2,
                    mb: 0.5,
                }}
            />

            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    <Typography sx={{ fontSize: "15px", fontWeight: 800, color: "#102a43", letterSpacing: "0.5px" }}>
                        CUSTOMIZE YOUR PIECE
                    </Typography>
                    {calculatedPrice && (
                        <Typography sx={{ fontSize: "16px", fontWeight: 800, color: "#0b2f83", mt: 0.2 }}>
                            {currencySymbol} {calculatedPrice}
                        </Typography>
                    )}
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon sx={{ fontSize: "20px", color: "#627d98" }} />
                </IconButton>
            </Box>

            {/* Drawer Body */}
            <Box sx={{ p: 2, overflowY: "auto", flex: 1, pb: 3 }}>

                {/* 0. Selected Config Header Bar (Belux Pattern) */}
                <Box sx={{ mb: 2, p: 1.2, backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#627d98", textTransform: "uppercase", letterSpacing: "0.8px", mb: 0.8, textAlign: "left" }}>
                        SELECTED CONFIG
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                        {selectedMetal && (
                            <Chip
                                size="small"
                                label={`${selectedMetal.MetalType || "Gold"} - ${selectedMetal.MetalColor || "Yellow"}`}
                                sx={{ fontWeight: 700, fontSize: "11px", backgroundColor: "#0b2f83", color: "#ffffff" }}
                            />
                        )}
                        {selectedDiaQc && (
                            <Chip
                                size="small"
                                label={selectedDiaQc}
                                sx={{ fontWeight: 700, fontSize: "11px", backgroundColor: "#e2e8f0", color: "#102a43" }}
                            />
                        )}
                        {selectedOrigin && (
                            <Chip
                                size="small"
                                label={selectedOrigin}
                                sx={{ fontWeight: 700, fontSize: "11px", backgroundColor: "#e2e8f0", color: "#102a43" }}
                            />
                        )}
                        {activeArticle?.ArticleNo && (
                            <Chip
                                size="small"
                                label={`Art# ${activeArticle.ArticleNo}`}
                                sx={{ fontWeight: 700, fontSize: "11px", backgroundColor: "#0b2f83", color: "#ffffff" }}
                            />
                        )}
                    </Box>
                </Box>

                {/* 1. Metal Options (2-Column Mobile Grid) */}
                {metalCombos.length > 0 && (
                    <>
                        <SectionHeader title="CHOICE OF METAL" />
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: 1,
                            }}
                        >
                            {metalCombos.map((combo) => {
                                const isSelected =
                                    selectedMetal?.MetalTypeId === combo.MetalTypeId &&
                                    selectedMetal?.MetalColorId === combo.MetalColorId;

                                const metalTypeName = combo.MetalType || combo.metal || combo.metaltypename || combo.metalpurityname || "Gold";
                                const metalColorName = combo.MetalColor || combo.metalcolorname || combo.colorname || "Yellow";
                                const swatch =
                                    METAL_SWATCH[metalColorName] || METAL_SWATCH[combo.MetalColor] || "linear-gradient(135deg,#f5d060,#e8a900)";

                                return (
                                    <Box
                                        key={`${combo.MetalTypeId}-${combo.MetalColorId}`}
                                        onClick={() => setSelectedMetal(combo)}
                                        sx={{
                                            cursor: "pointer",
                                            border: `1.5px solid ${isSelected ? "#0b2f83" : "#d9e2ec"}`,
                                            backgroundColor: isSelected ? "#f0f4fc" : "#ffffff",
                                            borderRadius: "10px",
                                            p: 1.2,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            position: "relative",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                background: swatch,
                                                border: "1.5px solid rgba(0,0,0,0.15)",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: "12px", color: isSelected ? "#0b2f83" : "#102a43", textTransform: "uppercase", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {metalTypeName} {metalColorName}
                                            </Typography>
                                            <Typography sx={{ fontSize: "10px", color: combo.inStockLabel === "In Stock" ? "#2e7d32" : "#878787", fontWeight: 600, lineHeight: 1.2, mt: 0.2 }}>
                                                {combo.inStockLabel}
                                            </Typography>
                                        </Box>
                                        {isSelected && (
                                            <CheckCircleIcon sx={{ fontSize: "16px", color: "#0b2f83", ml: "auto", flexShrink: 0 }} />
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                )}

                {/* 2. Diamond Origin */}
                {availableOrigins.length > 0 && (
                    <>
                        <SectionHeader title="DIAMOND ORIGIN" />
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {availableOrigins.map((origin) => {
                                const isSelected = selectedOrigin === origin || (!selectedOrigin && origin === "Natural");
                                return (
                                    <Box
                                        key={origin}
                                        onClick={() => setSelectedOrigin(origin)}
                                        sx={{
                                            cursor: "pointer",
                                            border: `1.5px solid ${isSelected ? "#0b2f83" : "#d9e2ec"}`,
                                            backgroundColor: isSelected ? "#f0f4fc" : "#ffffff",
                                            borderRadius: "8px",
                                            px: 2,
                                            py: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.8,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "#0b2f83" : "#102a43", textTransform: "uppercase" }}>
                                            {origin}
                                        </Typography>
                                        {isSelected && (
                                            <CheckCircleIcon sx={{ fontSize: "16px", color: "#0b2f83" }} />
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                )}

                {/* 3. Diamond Quality Badges */}
                {stoneQualityCombos.length > 0 && (
                    <>
                        <SectionHeader title="DIAMOND QUALITY" />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {stoneQualityCombos.map((qc) => {
                                const key = `${qc.Quality}-${qc.Color}`;
                                const isSelected = selectedDiaQc === key;
                                return (
                                    <Box
                                        key={key}
                                        onClick={() => setSelectedDiaQc(key)}
                                        sx={{
                                            cursor: "pointer",
                                            border: `1.5px solid ${isSelected ? "#0b2f83" : "#d9e2ec"}`,
                                            backgroundColor: isSelected ? "#f0f4fc" : "#ffffff",
                                            borderRadius: "8px",
                                            px: 1.6,
                                            py: 0.8,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "#0b2f83" : "#102a43" }}>
                                            {qc.Quality} / {qc.Color}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                )}

                {/* 4. Sizes */}
                {availableSizes.length > 0 && (
                    <>
                        <SectionHeader title="SELECT SIZE" />
                        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                            {availableSizes.map(({ size, inStockLabel }) => {
                                const isSelected = selectedSize === size;
                                const isInStock = inStockLabel === "In Stock";
                                return (
                                    <Box
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        sx={{
                                            cursor: "pointer",
                                            border: `1.5px solid ${isSelected ? "#0b2f83" : "#d9e2ec"}`,
                                            backgroundColor: isSelected ? "#f0f4fc" : "#ffffff",
                                            borderRadius: "8px",
                                            minWidth: "50px",
                                            px: 1.4,
                                            py: 0.8,
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#0b2f83" : "#102a43" }}>
                                            {size}
                                        </Typography>
                                        <Typography sx={{ fontSize: "9px", color: isInStock ? "#2e7d32" : "#627d98", fontWeight: 600 }}>
                                            {inStockLabel}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                )}
            </Box>

            {/* Sticky Action Footer */}
            <Box
                sx={{
                    sticky: "bottom",
                    backgroundColor: "#ffffff",
                    borderTop: "1px solid #f0f0f0",
                    p: 1.8,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
                    zIndex: 10,
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    <Typography sx={{ fontSize: "10px", color: "#627d98", textTransform: "uppercase", fontWeight: 700 }}>
                        Recalculated Price
                    </Typography>
                    {calculatedPrice && (
                        <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#102a43" }}>
                            {currencySymbol} {calculatedPrice}
                        </Typography>
                    )}
                </Box>

                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{
                        backgroundColor: "#0b2f83",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "13px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        px: 3,
                        py: 1.1,
                        borderRadius: "6px",
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "#082360",
                            boxShadow: "none",
                        },
                    }}
                >
                    CONFIRM CUSTOMISATION
                </Button>
            </Box>
        </SwipeableDrawer>
    );
}
