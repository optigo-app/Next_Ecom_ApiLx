"use client";

import React from "react";
import { Box, CssBaseline, Typography } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import { Playfair } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-playfair), serif !important",
  },
});


export const clientThemeConfig = {
  goldLight: "#FAF0C5",
  goldMedium: "#9E7429",
  goldDark: "#9E7429",
  goldAccent: "#F3E5AB",

  // Gradient stops
  gradientStops: {
    stop0: "#000000ff",
    stop20: "#000000ff",
    stop50: "#000000ff",
    stop80: "#000000ff",
    stop100: "#000000ff",
  },

  // Ambient Glow Shadow
  glowShadow: "drop-shadow(0 3px 14px rgba(212, 178, 111, 0.35))",
};

const MainContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3, 2, 0, 2),
  margin: "0 auto",
}));

export default function JewelryHeader({
  text = "Catalogs & Lookbooks",
  subtitle = "",
  config = clientThemeConfig,
  sx,
}) {
  const mergedConfig = { ...clientThemeConfig, ...config };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <MainContainer sx={sx} className={`${playfair.variable} ${playfair.className}`}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            margin: "0 auto",
            py: 0.5,
          }}
        >
          {/* Header Title */}
          <Typography
            component="h2"
            className={playfair.className}
            sx={{
              fontFamily: `${playfair.style.fontFamily}, "Playfair Display", serif !important`,
              fontWeight: 800,
              fontSize: { xs: "1.15rem", sm: "1.55rem", md: "2.25rem" },
              letterSpacing: "0.10rem",
              textTransform: "capitalize",
              color: mergedConfig.goldMedium,
              backgroundImage: `linear-gradient(135deg, ${mergedConfig.gradientStops.stop0} 0%, ${mergedConfig.gradientStops.stop20} 25%, ${mergedConfig.gradientStops.stop50} 50%, ${mergedConfig.gradientStops.stop80} 75%, ${mergedConfig.gradientStops.stop100} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              lineHeight: 1.3,
              whiteSpace: { xs: "normal", sm: "nowrap" },
              my: 0.5,
            }}
          >
            {text}
          </Typography>

          {subtitle && (
            <Typography
              component="p"
              className={playfair.className}
              sx={{
                fontFamily: `${playfair.style.fontFamily}, "Playfair Display", serif !important`,
                fontWeight: 500,
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(212, 178, 111, 0.85)",
                marginTop: "4px",
                textAlign: "center",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </MainContainer>
    </ThemeProvider>
  );
}
