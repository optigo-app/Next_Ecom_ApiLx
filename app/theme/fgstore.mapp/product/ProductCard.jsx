"use client";
import React, { useEffect, useState } from 'react';
import { findMetalColor, formatter, formatTitleLine, findMetalType } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import {
    Card, CardContent, Checkbox, Typography, Box, Button
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMallRounded";
import VerifiedIcon from '@mui/icons-material/Verified';
import SwiperProductCard from './SwiperProductCard';

const ProductCard = ({
    productData,
    handleCartandWish,
    cartArr = {},
    wishArr = {},
    handleMoveToDetail,
    selectedMetalId,
    productIndex,
    yellowImage,
    whiteImage,
    roseImage,
    yellowRollImage,
    whiteRollImage,
    roseRollImage,
    imageUrl,
    videoUrl,
    RollImageUrl,
    location,
    metalColorCombo,
    storeInit,
    loginUserDetail,
    ImageView
}) => {
    const [selectedMetalColor, setSelectedMetalColor] = useState(null);
    const [metalColorTitle, setMetalColorTitle] = useState("");

    useEffect(() => {
        if (metalColorCombo?.length > 0) {
            const mtColor = metalColorCombo?.find(ele => ele.id === productData?.MetalColorid)?.colorcode;
            setMetalColorTitle(mtColor || "");
        }
    }, [productData, metalColorCombo]);

    const isWishlistChecked = wishArr[productData?.autocode] ?? (productData?.IsInWish === 1);
    const isCartChecked = cartArr[productData?.autocode] ?? (productData?.IsInCart === 1);

    const currencySymbol = loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode ?? "INR";
    const formattedPrice = formatter(productData?.UnitCostWithMarkUp);
    
    // MRP display (calculated 15% higher for strikethrough if applicable)
    const mrpValue = productData?.UnitCostWithMarkUp 
        ? formatter(Math.round(productData?.UnitCostWithMarkUp * 1.15))
        : null;

    const metalColorName = findMetalColor(productData?.MetalColorid)?.[0]?.metalcolorname?.toUpperCase() || "";
    const metalTypeStr = findMetalType(productData?.IsMrpBase == 1 ? productData?.MetalPurityid : (selectedMetalId ?? productData?.MetalPurityid))?.[0]?.metaltype || "";

    const headerText = [metalColorName, metalTypeStr].filter(Boolean).join(" - ") || productData?.category?.toUpperCase() || "";

    const articleNo = productData?.ArticleNo || productData?.articleno || productData?.designno || "";
    const titleLine = productData?.TitleLine || productData?.titleline || "";
    const titleText = [articleNo, titleLine].filter(Boolean).join(" - ") || productData?.category || "";

    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                border: "1px solid #ececec",
                backgroundColor: "#fff",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
        >
            {/* Top Badges (Left) */}
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                {(productData?.IsInReadyStock === 1 || productData?.IsBestSeller === 1) && (
                    <Box
                        sx={{
                            backgroundColor: "#385898",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 700,
                            px: 0.8,
                            py: 0.3,
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                        }}
                    >
                        <VerifiedIcon sx={{ fontSize: "11px" }} />
                        <span>Assured</span>
                    </Box>
                )}
                {productData?.IsTrending === 1 && (
                    <Box
                        sx={{
                            backgroundColor: "#ff9800",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 700,
                            px: 0.8,
                            py: 0.3,
                            borderRadius: "3px",
                        }}
                    >
                        Trending
                    </Box>
                )}
                {productData?.IsNewArrival === 1 && (
                    <Box
                        sx={{
                            backgroundColor: "#9c27b0",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 700,
                            px: 0.8,
                            py: 0.3,
                            borderRadius: "3px",
                        }}
                    >
                        New
                    </Box>
                )}
            </Box>

            {/* Wishlist Heart Icon (Top Right) */}
            <Box
                sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    zIndex: 3,
                }}
            >
                <Checkbox
                    icon={
                        <FavoriteBorderIcon
                            sx={{
                                fontSize: "20px",
                                color: "#b0b0b0",
                            }}
                        />
                    }
                    checkedIcon={
                        <FavoriteIcon
                            sx={{
                                fontSize: "20px",
                                color: "#ff4380",
                            }}
                        />
                    }
                    onChange={(e) => handleCartandWish(e, productData, "Wish")}
                    checked={isWishlistChecked}
                    sx={{ p: 0.6 }}
                />
            </Box>

            {/* Card Media / Image Area - Uniform Responsive Height */}
            <Box
                onClick={() => handleMoveToDetail(productData)}
                sx={{
                    width: "100%",
                    cursor: "pointer",
                    position: "relative",
                    backgroundColor: "#ffffff",
                    height: ImageView ? { xs: 260, sm: 320, md: 360 } : { xs: 160, sm: 200, md: 230 },
                    minHeight: ImageView ? { xs: 260, sm: 320, md: 360 } : { xs: 160, sm: 200, md: 230 },
                    maxHeight: ImageView ? { xs: 260, sm: 320, md: 360 } : { xs: 160, sm: 200, md: 230 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    p: 1,
                }}
            >
                <SwiperProductCard
                    imageUrl={imageUrl}
                    rollImageUrl={RollImageUrl}
                    yellowImage={yellowImage}
                    whiteImage={whiteImage}
                    roseImage={roseImage}
                    selectedMetalColor={selectedMetalColor}
                />
            </Box>

            {/* Card Details Area - Flex Grow for Equal Heights */}
            <CardContent
                sx={{
                    p: 1.2,
                    pt: 0.8,
                    pb: "10px !important",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.4,
                    backgroundColor: "#fff",
                    flexGrow: 1,
                }}
            >
                {/* Brand / Metal Type Header (e.g. YELLOW - GOLD 24k) */}
                <Typography
                    sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#878787",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        height: "15px",
                        lineHeight: "15px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {headerText}
                </Typography>

                {/* Title Line - Fixed Min Height for 2 Lines */}
                <Typography
                    onClick={() => handleMoveToDetail(productData)}
                    sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1a73e8",
                        lineHeight: 1.3,
                        cursor: "pointer",
                        minHeight: "34px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {titleText}
                </Typography>

                {/* Weights (NWT / GWT / DWT) */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "2px 6px",
                        fontSize: "11px",
                        color: "#555555",
                        minHeight: "30px",
                        py: 0.2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap", width: "100%" }}>
                        {storeInit?.IsGrossWeight == 1 && Number(productData?.Gwt) > 0 && (
                            <Typography sx={{ fontSize: "11px", color: "#555" }}>
                                <strong>GWT:</strong> {productData.Gwt.toFixed(3)}g
                            </Typography>
                        )}
                        {Number(productData?.Nwt) > 0 && (
                            <Typography sx={{ fontSize: "11px", color: "#333", fontWeight: 600 }}>
                                <strong>NWT:</strong> {productData.Nwt.toFixed(3)}g
                            </Typography>
                        )}
                        {storeInit?.IsDiamondWeight == 1 && Number(productData?.Dwt) > 0 && (
                            <Typography sx={{ fontSize: "11px", color: "#555" }}>
                                <strong>DWT:</strong> {productData.Dwt.toFixed(3)}ct
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Spacer to push Price Row to bottom */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Always-Visible Bottom Action Row */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 0.8,
                        mt: "auto",
                        borderTop: "1px solid #f0f0f0",
                        gap: 0.5,
                    }}
                >
                    {/* Price Block */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#111111", lineHeight: 1.1 }}>
                            {currencySymbol} {formattedPrice}
                        </Typography>
                    </Box>

                    {/* Add to Cart Button */}
                    <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => handleCartandWish({ target: { checked: !isCartChecked } }, productData, "Cart")}
                        sx={{
                            backgroundColor: isCartChecked ? "#2e7d32" : "#1a2b4c",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "none",
                            px: 1.4,
                            py: 0.5,
                            borderRadius: "4px",
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            "&:hover": {
                                backgroundColor: isCartChecked ? "#1b5e20" : "#0f1c34",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {isCartChecked ? "In cart" : "Add to cart"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
