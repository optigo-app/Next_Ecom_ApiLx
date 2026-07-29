"use client";
import { useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Marquee from "react-fast-marquee";

const BrandInfoMarquee = ({ assetBase }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const items = useMemo(() => ["100% Certified Jewellery", "Free Shipping Across India", "Easy 7 Days Return", "Trusted by 1L+ Customers", "Premium Quality Craftsmanship"], []);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        bgcolor: "#f8f6f4",
        height: "79px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxSizing:'border-box'
      }}
    >
      {/* 🔥 LEFT BLUR */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "80px",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(to right, #f8f6f4 40%, transparent)",
        }}
      />

      {/* 🔥 RIGHT BLUR */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "80px",
          zIndex: 2,
          pointerEvents: "none",
          background: "linear-gradient(to left, #f8f6f4 40%, transparent)",
        }}
      />

      <Marquee gradient={false} speed={isMobile ? 25 : 40} pauseOnHover>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 3, sm: 6 },
            px: { xs: 2, sm: 4 },
          }}
        >
          {[...items, ...items, ...items].map((text, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: "#222",
                  whiteSpace: "nowrap",
                }}
              >
                {text}
              </Typography>
              {/* 🔥 Logo Divider */}
              <Box
                sx={{
                  opacity: 0.8,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 16 16">
                  <g fill="none" stroke="#5b72ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                    <path d="m13.75 7.75h-12"></path>
                    <path d="m7.75 1.75v12"></path>
                    <path d="m4.25 11.25 7-7"></path>
                    <path d="m11.25 11.25-7-7"></path>
                  </g>
                </svg>
              </Box>
            </Box>
          ))}
        </Box>
      </Marquee>
    </Box>
  );
};

export default BrandInfoMarquee;
 