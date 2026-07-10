"use client";
import { useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Marquee from "react-fast-marquee";

const BrandInfoMarquee = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Custom text array based on your layout image
  const items = useMemo(() => [
    "Monsoon SALE: UP TO 50% OFF SELECTED ITEMS",
    "Monsoon SALE: UP TO 50% OFF SELECTED ITEMS",
    "Monsoon SALE: UP TO 50% OFF SELECTED ITEMS",
    "Monsoon SALE: UP TO 50% OFF SELECTED ITEMS"
  ], []);

  // Multiplied items array for continuous scrolling behavior
  const marqueeData = useMemo(() => [...items, ...items, ...items], [items]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        bgcolor: "#1f3e09", // Dark aesthetic background
        height: "50px",      // Compact height ideal for an announcement bar
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
       

      <Marquee 
        gradient={false} 
        speed={isMobile ? 30 : 50} 
        pauseOnHover={true} // Pauses automatically on cursor hover
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 4, sm: 8 }, // Controlled spacing between marquee nodes
            px: { xs: 2, sm: 4 },
          }}
        >
          {marqueeData.map((text, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2, // Space between lightning bolt and text
              }}
            >
              {/* 🔥 Lightning Bolt Divider Graphic */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width={18} 
                  height={18} 
                  viewBox="0 0 24 24" 
                  fill="#00A8E8" // Bright cyan/blue bolt matches image
                >
                  <path d="M13 2v9h5L11 22v-9H6l7-11z"/>
                </svg>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  color: "#FFFFFF", // Clear crisp white text
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  fontFamily: "sans-serif"
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Marquee>
    </Box>
  );
};

export default BrandInfoMarquee;