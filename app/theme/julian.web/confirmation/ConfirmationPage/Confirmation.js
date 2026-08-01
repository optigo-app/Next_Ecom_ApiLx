"use client";

import React, { useEffect, useState } from "react";
import "./confirmation.scss";
import { FaPrint } from "react-icons/fa";
import { handelOpenMenu } from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

// MUI Components & Icons
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import LocalMallIcon from "@mui/icons-material/LocalMall";

// Pure CSS Confetti Component
const Confetti = () => {
  const colors = ["#f43f5e", "#0ea5e9", "#eab308", "#22c55e", "#a855f7", "#ec4899"];

  const particles = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: colors[i % colors.length],
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: `${6 + Math.random() * 6}px`,
  }));

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        "@keyframes confettiFall": {
          "0%": {
            transform: "translateY(-10px) rotate(0deg)",
            opacity: 1,
          },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: 0,
          },
        },
      }}
    >
      {particles.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            top: "-20px",
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            animation: `confettiFall ${p.duration} ease-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </Box>
  );
};

const Confirmation = ({ storeinit }) => {
  const location = useNextRouterLikeRR();
  const navigate = location.push;

  const { setCartCountNum } = useStore();

  const [orderNo, setOrderNo] = useState();
  const storeInit = storeinit;
  const setCartCountVal = setCartCountNum;

  // For cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartCount = await GetCountAPI();
        setCartCountVal(cartCount?.cartcount);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  const setCSSVariable = () => {
    const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
  };

  useEffect(() => {
    setCSSVariable();
    let orderNo = sessionStorage.getItem("orderNumber");
    setOrderNo(orderNo);
  }, []);

  const handleNavigate = async () => {
    const url = await handelOpenMenu();
    if (url) {
      navigate(url);
    } else {
      navigate("/");
    }
    sessionStorage.removeItem("TotalPriceData");
  };

  return (
    <Box
      className="julsmr_confirMaindiv"
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 3,
        overflow: "hidden",
      }}
    >
      {/* Celebration animation background */}
      <Confetti />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        {/* Main UI Card */}
        <Paper
          elevation={0}
          className="julsmr_confirSecondMaindiv"
          sx={{
            backgroundColor: "#f5f0eb",
            borderRadius: "16px",
            padding: { xs: 4, md: 6 },
            textAlign: "center",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          {/* Shopping Bag Icon */}
          <Box
            sx={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "green",
              color: "#ffffff",
              borderRadius: "8px",
              width: 44,
              height: 44,
              mb: 2.5,
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <LocalMallIcon sx={{ fontSize: 26 }} />
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#2a3b50",
              mb: 1,
              fontSize: { xs: "22px", md: "32px" },
            }}
          >
            Thank You For Your Order !
          </Typography>

          {/* Dynamic Order Number Subtitle */}
          <Typography
            className="julorderNumber"
            sx={{
              color: "#4b5563",
              fontSize: "15px",
              fontWeight: 600,
              mb: 2,
            }}
          >
            Your Order number is{" "}
            <Typography
              component="span"
              sx={{ fontWeight: 800, color: "#111827" }}
            >
              {orderNo}
            </Typography>
          </Typography>

         
         

          {/* Optional Print Action (Retained conditionally from logic) */}
          {storeInit?.IsPLW != 0 && (
            <Box
              className="julsmr_plwlPrintDiv"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                mb: 3,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<FaPrint />}
                className="julicon-button"
                sx={{
                  color: "#374151",
                  borderColor: "#9ca3af",
                  textTransform: "none",
                 
                }}
              >
                Print
              </Button>
              <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>
                Coming soon...
              </Typography>
            </Box>
          )}

          {/* Continue Shopping Button */}
          <Button
            disableElevation
            variant="contained"
            className="julsmr_continueShoppingBtns"
            onClick={handleNavigate}
            sx={{
              backgroundColor: "#0d1232",
              color: "#ffffff",
              borderRadius: "20px",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              "&:hover": {
                // backgroundColor: "green",
                boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Confirmation;