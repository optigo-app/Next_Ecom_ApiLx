"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { HomeIcon, ShopIcon, CartIcon, ProfileIcon, NecklaceIcon, EarringIcon, DiamondIcon, JewelleryIcon } from './../../../../(core)/assets/Icons'
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";


const icons = [<NecklaceIcon key="necklace" />, <EarringIcon key="earring" />, <DiamondIcon key="diamond" />, <JewelleryIcon key="jewellery" />];

const MotionBox = motion(Box);


const BottomNavigation = () => {
    const [activeTab, setActiveTab] = useState("home");
    const pathname = usePathname();

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        if (pathname === "/") setActiveTab("home");
        else if (pathname.startsWith("/menu")) setActiveTab("shop");
        else if (pathname.startsWith("/cartPage")) setActiveTab("Cart");
        else if (pathname.startsWith("/profile") || pathname.startsWith("/account")) setActiveTab("Profile");
    }, [pathname]);

    useEffect(() => {
        // Fallback for older browsers without visualViewport
        if (!window.visualViewport) {
            const handleFocusIn = (e) => {
                const tagName = e.target.tagName?.toLowerCase();
                if (tagName === "input" || tagName === "textarea") {
                    setKeyboardVisible(true);
                }
            };
            const handleFocusOut = () => {
                setKeyboardVisible(false);
            };
            window.addEventListener("focusin", handleFocusIn);
            window.addEventListener("focusout", handleFocusOut);
            return () => {
                window.removeEventListener("focusin", handleFocusIn);
                window.removeEventListener("focusout", handleFocusOut);
            };
        }

        // Modern, robust approach (iOS and Android Webviews)
        let baseHeight = window.visualViewport.height;

        const handleResize = () => {
            // Update base height if window gets larger (e.g. rotation)
            if (window.visualViewport.height > baseHeight) {
                baseHeight = window.visualViewport.height;
            }

            // If the current physical viewport shrinks by more than 150px, keyboard is 100% physically up.
            if (window.visualViewport.height < baseHeight - 150) {
                setKeyboardVisible(true);
            } else {
                setKeyboardVisible(false);
            }
        };

        window.visualViewport.addEventListener("resize", handleResize);
        return () => window.visualViewport.removeEventListener("resize", handleResize);

    }, []);

    const hideNavbar =
        pathname.startsWith("/d/") ||
        pathname.startsWith("/p") ||
        pathname.startsWith("/delivery") ||
        pathname.startsWith("/payment") ||
        pathname.startsWith("/confirmation") ||
        isKeyboardVisible;

    if (hideNavbar) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 65,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #f0f0f0",
                boxShadow: "0px -4px 20px rgba(0,0,0,0.05)",
                zIndex: 1000,
            }}
        >
            <NavItem NavigateLink="/" activeTab={activeTab} setActiveTab={setActiveTab} id="home" icon={HomeIcon} label="Home" />
            <NavItem NavigateLink="/menu" activeTab={activeTab} setActiveTab={setActiveTab} id="shop" icon={ShopIcon} label="Shop" />

            {/* <AnimatedCenterTab active={activeTab === "now"} onClick={() => setActiveTab("now")} brandName="Sonasons" label="NOW" /> */}

            <NavItem NavigateLink="/cartPage" activeTab={activeTab} setActiveTab={setActiveTab} id="Cart" icon={CartIcon} label="Cart" />
            <NavItem NavigateLink="/profile" activeTab={activeTab} setActiveTab={setActiveTab} id="Profile" icon={ProfileIcon} label="Profile" />
        </Paper>
    );
}

export default BottomNavigation;

const NavItem = ({ activeTab, setActiveTab, id, icon: Icon, label, NavigateLink }) => {
    const isActive = activeTab === id;
    const activeColor = "#000";     // black
    const inactiveColor = "#9a9a9a"; // light gray

    return (
        <Box
            component={Link}
            href={NavigateLink}
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
                // background: isActive ? "linear-gradient(180deg, rgba(26,107,255,0.12) 0%, rgba(255,255,255,0.4) 100%)" : "transparent",
                background: isActive ? "#ffffff" : "#ffffff",
                backdropFilter: isActive ? "blur(8px)" : "none",
                WebkitBackdropFilter: isActive ? "blur(8px)" : "none",
                textAlign: "center",
                gap: "4px",
                textDecoration: "none",
            }}
        >
            <Icon color={isActive ? activeColor : inactiveColor} sx={{ color: isActive ? activeColor : inactiveColor, fontSize: 24, mb: 0.5 }} />
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
