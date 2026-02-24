"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, InputBase, Paper, Avatar, Card, CardMedia, Stack, alpha, Chip, Grid, CardContent } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import { Button } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import PromotionCarousel from "./PromotionCarousel";
import { HomeIcon, ShopIcon, CartIcon, ProfileIcon, RingIcon, NecklaceIcon, EarringIcon, DiamondIcon, JewelleryIcon } from "../../../(core)/assets/Icons";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import WatchOutlinedIcon from "@mui/icons-material/WatchOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import { motion, AnimatePresence } from "framer-motion";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


const categories = [
    { name: "Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop" },
    { name: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f66126e28?w=200&h=200&fit=crop" },
    { name: "Watch", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&h=200&fit=crop" },
    { name: "Bracelet", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop" },
    { name: "Anklet", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
];

const icons = [<NecklaceIcon key="necklace" />, <EarringIcon key="earring" />, <DiamondIcon key="diamond" />, <JewelleryIcon key="jewellery" />];

const products = [
    {
        id: 1,
        brand: "ZALKARI",
        title: "Golden Royal Blue Pendant Necklace",
        currentPrice: "2,011",
        originalPrice: "5,749",
        discount: "65% OFF",
        // Using a placeholder that resembles the dark background in your image
        image: "https://cdn.eternz.com/thumbnails/products/ER02938_5_8b5743a7_thumbnail_1024.jpg",
    },
    {
        id: 2,
        brand: "ZALKARI",
        title: "Rose Gold Princess Classic Pendant",
        currentPrice: "1,661",
        originalPrice: "4,749",
        discount: "65% OFF",
        image: "https://cdn.eternz.com/thumbnails/products/ER02316_5_1_54704ae9_thumbnail_1024.jpg",
    },
    {
        id: 3,
        brand: "ZALKARI",
        title: "Silver Lord Ganesha Pendant",
        currentPrice: "2,011",
        originalPrice: "5,749",
        discount: "65% OFF",
        image: "https://cdn.eternz.com/thumbnails/products/ER03372_5_997a5c65_thumbnail_1024.jpg",
    },
    {
        id: 4,
        brand: "ZALKARI",
        title: "Elegant Diamond Cut Chain",
        currentPrice: "3,100",
        originalPrice: "6,200",
        discount: "50% OFF",
        image: "https://cdn.eternz.com/thumbnails/products/TLBR022_5_d14195e5_thumbnail_1024.jpg", // Tests the fallback
    },
];

const newArrivals = [
    {
        id: 1,
        name: "Stylish Sneakers",
        price: "$120",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Leather Jacket",
        price: "$250",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Classic Watch",
        price: "$180",
        image: "https://via.placeholder.com/150",
    },
];


const items = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
];


const categoriesList = [
    { label: "Fashion", icon: <CheckroomOutlinedIcon color="info" fontSize="small" /> },
    { label: "Silver", icon: <SpaOutlinedIcon color="warning" fontSize="small" /> },
    { label: "Watch", icon: <WatchOutlinedIcon color="success" fontSize="small" /> },
    { label: "Gold", icon: <DiamondOutlinedIcon color="secondary" fontSize="small" /> },
    { label: "Diamond", icon: <DiamondOutlinedIcon color="error" fontSize="small" /> },
];

function ProductTypeBar() {
    return (
        <Box sx={{ display: "flex", overflowX: "auto", gap: 1, mb: 2, "&::-webkit-scrollbar": { display: "none" } }}>
            {categoriesList.map((item, index) => (
                <Chip
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    clickable
                    sx={{
                        borderRadius: "999px",
                        px: 1.5,
                        height: 42,
                        fontWeight: 500,
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                />
            ))}
        </Box>
    );
}

const MotionBox = motion(Box);

export default function Home() {
    return (
        <Box
            sx={{
                paddingBottom: 15,
            }}
        >
            <MobileHomeUI />
            <Headers title={'Categories'} />
            <Box sx={{ display: "flex", overflowX: "auto", gap: 2, px: 1.5, py: 1.5, "&::-webkit-scrollbar": { display: "none" } }}>
                {categories.map((cat, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px" }}>
                        <Avatar src={cat.img} sx={{ width: 70, height: 70, mb: 1, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }} />
                        <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>{cat.name}</Typography>
                    </Box>
                ))}
            </Box>
            <MobileCarousel />
            <Box sx={{ display: "flex", overflowX: "auto", gap: 2, px: 1.5, py: 1.5, "&::-webkit-scrollbar": { display: "none" } }}>
                {categories.map((cat, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "150px" }}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#fce4ec", boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.1)" }}>
                            <CardMedia component="img" height="160" image="https://www.eternz.com/_next/image?url=https%3A%2F%2Fcdn.eternz.com%2Fbanner%2FVdayGiftsforher1767702350394.jpg&w=1920&q=75" alt="Gifts For Her" />
                        </Card>
                    </Box>
                ))}
            </Box>

            <ProductCollection title="BestSellers" />
            <TrendSection />
            <ProductCollection title="Trendings" />
            <PromoCard />
            <BottomNavigationClone />
            <NewArrivalsCard />
        </Box>
    );
}

function MobileHomeUI() {
    return (
        <>
            <Box
                sx={{
                    py: 1.2,
                    px: 1,
                }}
            >
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2, mt: 0.5 }}>
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "white",
                            borderRadius: "50px",
                            px: 2,
                            py: 0.8,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                            backgroundColor: (theme) => alpha(theme.palette.common.black, 0.05),
                        }}
                    >
                        <SearchRounded sx={{ color: "#9e9e9e", mr: 1, fontSize: 22 }} />
                        <InputBase
                            placeholder="Search necklaces, rings & more"
                            inputProps={{ "aria-label": "search" }}
                            sx={{
                                flex: 1,
                                fontSize: "15px",
                                color: "#333",
                            }}
                        />
                    </Box>
                </Box>
                <ProductTypeBar />
                <PromotionCarousel />
            </Box>
        </>
    );
}
const ImageWithFallback = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const fallbackUrl = "https://placehold.co/400x500/1e293b/ffffff?text=No+Image";

    return (
        <Box
            component="img"
            src={imgSrc}
            alt={alt}
            onError={() => setImgSrc(fallbackUrl)}
            sx={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
            }}
        />
    );
};
function ProductCollection({ title }) {
    return (
        <>
            <Headers title={title} />
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 1.5,
                    pb: 3, // Padding bottom gives room for the scrollbar/shadows
                    // Hide scrollbar for a cleaner mobile app look (optional but recommended)
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    px: 1.5,
                }}
            >
                {products.map((product) => (
                    <Card
                        key={product.id}
                        elevation={0}
                        sx={{
                            minWidth: "150px", // Prevents cards from shrinking on small screens
                            maxWidth: "150px",
                            flexShrink: 0,
                            backgroundColor: "transparent",
                            scrollSnapAlign: "start", // Aligns cards cleanly when scrolling stops
                        }}
                    >
                        {/* Product Image */}
                        <ImageWithFallback src={product.image} alt={product.title} />

                        {/* Product Details */}
                        <Box sx={{ mt: 1, px: 0.5 }}>
                            {/* Brand Name */}
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    color: "#000",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {product.brand}
                            </Typography>

                            {/* Product Title (Truncated with Ellipsis) */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#757575",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    mb: 0.5,
                                }}
                            >
                                {product.title}
                            </Typography>

                            {/* Pricing Row */}
                            <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
                                <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#000" }}>₹{product.currentPrice}</Typography>

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                        color: "#9e9e9e",
                                        textDecoration: "line-through",
                                    }}
                                >
                                    ₹{product.originalPrice}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "11px",
                                        color: "#2e7d32", // Standard MUI Success green
                                    }}
                                >
                                    {product.discount}
                                </Typography>
                            </Stack>
                        </Box>
                    </Card>
                ))}
            </Box>
        </>
    );
}
function PromoCard() {
    return (
        <>
            <Headers title="Most Loved Products" />
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 1.5,
                    pb: 2, // Padding bottom gives room for the scrollbar/shadows
                    // Hide scrollbar for a cleaner mobile app look (optional but recommended)
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    px: 1.5,
                }}
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <Box
                        key={index} // Added missing key prop
                        sx={{
                            minWidth: "320px", // Prevents cards from shrinking on small screens
                            maxWidth: "320px",
                            flexShrink: 0,
                            scrollSnapAlign: "start", // Aligns cards cleanly when scrolling stops
                            height: "420px",
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                            cursor: "pointer",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            backgroundImage: 'url("https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Dark Gradient Overlay for better text/logo visibility at the bottom */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "50%",
                                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Top Left Discount Badge */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 24,
                                left: 0,
                                backgroundColor: "#D13217",
                                color: "white",
                                padding: "6px 14px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow: "2px 4px 12px rgba(209, 50, 23, 0.3)",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    marginBottom: "2px",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                UPTO
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontSize: "1.15rem",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                }}
                            >
                                {Math.floor(Math.random() * 50) + 30}% OFF
                            </Typography>
                        </Box>

                        {/* Bottom Content Area (Logo & Button) */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 24,
                                left: 0,
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2.5,
                            }}
                        >
                            {/* Logo Recreation */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    color: "white",
                                }}
                            >
                                {/* Top Line */}
                                <Box sx={{ width: "100%", height: "2px", backgroundColor: "white", mb: "4px" }} />
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: "serif",
                                        fontWeight: 500,
                                        letterSpacing: "1px",
                                        textTransform: "lowercase",
                                        lineHeight: 1,
                                        px: 1,
                                    }}
                                >
                                    Sonasons
                                </Typography>
                                {/* Bottom Line */}
                                <Box sx={{ width: "100%", height: "2px", backgroundColor: "white", mt: "4px" }} />
                            </Box>

                            {/* Shop Now Button */}
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "white",
                                    color: "#A03C1D",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    padding: "8px 32px",
                                    borderRadius: "6px",
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                                    },
                                }}
                            >
                                Shop Now
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
}
function BottomNavigationClone() {
    const [activeTab, setActiveTab] = useState("home");

    const NavItem = ({ id, icon: Icon, label }) => {
        const isActive = activeTab === id;
        const activeColor = "#1a6bff";
        const inactiveColor = "#8a8a8a";

        return (
            <Box
                onClick={() => setActiveTab(id)}
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    height: "100%",
                    position: "relative",
                    transition: "all 0.3s ease",

                    background: isActive ? "linear-gradient(180deg, rgba(26,107,255,0.12) 0%, rgba(255,255,255,0.4) 100%)" : "transparent",

                    backdropFilter: isActive ? "blur(8px)" : "none",
                    WebkitBackdropFilter: isActive ? "blur(8px)" : "none",
                    textAlign: "center",
                    gap: "4px",
                }}
            >
                <Icon sx={{ color: isActive ? activeColor : inactiveColor, fontSize: 26, mb: 0.5 }} />
                <Typography
                    sx={{
                        color: isActive ? activeColor : inactiveColor,
                        fontSize: "11px",
                        fontWeight: isActive ? 600 : 500,
                    }}
                >
                    {label}
                </Typography>
            </Box>
        );
    };

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 68,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #f0f0f0",
                boxShadow: "0px -4px 20px rgba(0,0,0,0.05)",
                zIndex: 1000,
            }}
        >
            <NavItem id="home" icon={HomeIcon} label="Home" />
            <NavItem id="shop" icon={ShopIcon} label="Shop" />

            <AnimatedCenterTab active={activeTab === "now"} onClick={() => setActiveTab("now")} brandName="Sonasons" label="NOW" />

            <NavItem id="Cart" icon={CartIcon} label="Cart" />
            <NavItem id="Profile" icon={ProfileIcon} label="Profile" />
        </Paper>
    );
}
function TrendSection() {
    return (
        <Box sx={{ py: 2 }}>
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    height: 340,
                    backgroundImage: 'url("https://media.tiffany.com/is/image/tco/67459687_RG_SIO2X1?hei=1204&wid=1204&fmt=webp&op_usm=1%2C2%2C6")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Soft Luxury Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
                    }}
                />

                {/* Content */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 3,
                        color: "#fff",
                    }}
                >
                    {/* Top Tagline */}
                    <Typography
                        variant="caption"
                        sx={{
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            opacity: 0.9,
                        }}
                    >
                        New Collection 2026
                    </Typography>

                    {/* Main Message */}
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}
                        >
                            Crafted to Shine
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                opacity: 0.9,
                                maxWidth: 260,
                            }}
                        >
                            Discover timeless elegance designed for every occasion.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
function AnimatedCenterTab({ active, onClick, brandName = "Sonasons", label = "NOW" }) {
    const [iconIndex, setIconIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIconIndex((prev) => (prev + 1) % icons.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            onClick={onClick}
            sx={{
                flex: 1.2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                cursor: "pointer",
                height: "100%",
                position: "relative",
                pb: 1.6,
            }}
        >
            <MotionBox
                whileTap={{ scale: 0.9 }}
                animate={{
                    scale: active ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                sx={{
                    position: "absolute",
                    top: -22,
                    width: 62,
                    height: 62,
                    background: active ? "linear-gradient(135deg,#1a6bff,#0052cc)" : "#1a6bff",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: active ? "0 6px 20px rgba(26,107,255,0.45)" : "0 4px 12px rgba(26,107,255,0.3)",
                    zIndex: 2,
                    overflow: "hidden",
                }}
            >
                <AnimatePresence mode="wait">
                    <MotionBox key={iconIndex} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.8 }} transition={{ duration: 0.3 }} sx={{ color: "#fff", fontSize: 28 }}>
                        {icons[iconIndex]}
                    </MotionBox>
                </AnimatePresence>
            </MotionBox>

            {/* Text */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "8px",
                        fontWeight: 800,
                        color: active ? "#1a6bff" : "#777",
                        letterSpacing: "0.6px",
                    }}
                >
                    {brandName}
                </Typography>

                <Typography
                    sx={{
                        fontSize: "15px",
                        fontWeight: 900,
                        color: active ? "#1a6bff" : "#777",
                        lineHeight: 0.9,
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Box>
    );
}
function NewArrivalsCard({ }) {
    return (
        <>
            <Headers title="New Arrivals" />
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 1.5,
                    pb: 3,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    px: 1.5,
                }}
            >
                {products.map((product) => (
                    <Card
                        key={product.id}
                        elevation={0}
                        sx={{
                            minWidth: "200px",
                            maxWidth: "200px",
                            flexShrink: 0,
                            backgroundColor: "transparent",
                            scrollSnapAlign: "start",
                        }}
                    >
                        <ImageWithFallback src={product.image} alt={product.title} />
                        <Box sx={{ mt: 1, px: 0.5 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    color: "#000",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {product.brand}
                            </Typography>

                            {/* Product Title (Truncated with Ellipsis) */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#757575",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    mb: 0.5,
                                }}
                            >
                                {product.title}
                            </Typography>

                            {/* Pricing Row */}
                            <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
                                <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#000" }}>₹{product.currentPrice}</Typography>

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                        color: "#9e9e9e",
                                        textDecoration: "line-through",
                                    }}
                                >
                                    ₹{product.originalPrice}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "11px",
                                        color: "#2e7d32", // Standard MUI Success green
                                    }}
                                >
                                    {product.discount}
                                </Typography>
                            </Stack>
                        </Box>
                    </Card>
                ))}
            </Box>
        </>
    );
}
const Headers = ({ title = "Untitled" }) => {
    return (
        <Box sx={{
            pr: 1,
        }}>
            <Box
                sx={{
                    width: "100%",
                    py: 1,
                    px: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#1a1a1a",
                        fontSize: "1.2rem",
                        letterSpacing: "-0.3px",
                    }}
                >
                    {title}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "#1976d2",
                        fontWeight: 500,
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    <Typography variant="body2" sx={{
                        mr: 0.5,
                        display: "flex",
                        alignItems: "center"
                    }}>
                        View More
                        <ChevronRightIcon fontSize="small" />
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
function MobileCarousel() {
    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 0,
                py: 1
            }}
        >
            <Card
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 240,
                    height: "100%",
                    overflow: "hidden",
                    zIndex: 1,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    borderTopRightRadius: "22px",
                    borderBottomRightRadius: "22px"
                }}
            >
                <CardMedia
                    component="img"
                    image="https://sonasons.optigoapps.com/WebSiteStaticImage/Banner/trendingbanner1.png"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            </Card>

            {/* SCROLL AREA */}
            <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pl: 23, py: 2.5, "&::-webkit-scrollbar": { display: "none" } }}>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        elevation={0}
                        sx={{
                            minWidth: "150px",
                            maxWidth: "150px",
                            flexShrink: 0,
                            backgroundColor: "transparent",
                            scrollSnapAlign: "start",
                            zIndex: 3,
                            bgcolor: '#fff',
                            p: 1,
                            borderRadius: 3
                        }}
                    >
                        <ImageWithFallback src={product.image} alt={product.title} />
                        <Box sx={{ mt: 0.8, px: 0.5 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#757575",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    mb: 0.4,
                                }}
                            >
                                {product.title}
                            </Typography>
                            <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
                                <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#000" }}>₹{product.currentPrice}</Typography>

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                        color: "#9e9e9e",
                                        textDecoration: "line-through",
                                    }}
                                >
                                    ₹{product.originalPrice}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "11px",
                                        color: "#2e7d32",
                                    }}
                                >
                                    {product.discount}
                                </Typography>
                            </Stack>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}