"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Grid, styled } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// ─── Styled Components ───────────────────────────────────────────────────────

const LogoSlot = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "140px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  borderRight: "1px solid #f5f5f5",
  borderBottom: "1px solid #f5f5f5",
  backgroundColor: "#fff",
  overflow: "hidden",
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    height: "110px",
    padding: theme.spacing(2),
  },
  "&:hover": {
    backgroundColor: "#fafafa",
    mixBlendMode: "multiply",
  },
  boxSizing: "border-box",
}));

const BrandLogoImg = styled("img")(({ theme }) => ({
  maxWidth: "100%",
  height: "70px",
  objectFit: "contain",
  transition: "transform 0.4s ease",
  [theme.breakpoints.down("sm")]: {
    height: "50px",
  },
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

// ─── Main Component ───────────────────────────────────────────────────────────

const MaxBrandMarquee = ({ assetBase }) => {
  // ─── Data & Helpers ─────────────────────────────────────────────────────────

  const LOGO_DATA = {
    kayra: [
      "logo1.png",
      "logo2.png",
      "logo3.png",
      "logo4.png",
      "logo5.png",
      "logo6.png",
    ],
    omjiyansh: ["logo1.png", "logo2.png", "logo3.png", "logo4.png"],
    mayora: ["logo1.png", "logo2.jpg", "logo3.png", "logo4.png"],
    sonasons: ["logo2.png", "logo3.png", "logo4.png", "logo6.png"],
  };

  const ALL_LOGOS = [
    ...LOGO_DATA.kayra.map(
      (l) => `${assetBase}/images/HomePage/BrandLogo/kayra/${l}`,
    ),
    ...LOGO_DATA.omjiyansh.map(
      (l) => `${assetBase}/images/HomePage/BrandLogo/omjiyansh/${l}`,
    ),
    ...LOGO_DATA.mayora.map(
      (l) => `${assetBase}/images/HomePage/BrandLogo/mayora/${l}`,
    ),
    ...LOGO_DATA.sonasons.map(
      (l) => `${assetBase}/images/HomePage/BrandLogo/sonasons/${l}`,
    ),
  ];

  const UNIQUE_LOGOS = Array.from(new Set(ALL_LOGOS));

  // Select 8 unique logos for the initial grid
  const [visibleLogos, setVisibleLogos] = useState(UNIQUE_LOGOS.slice(0, 8));

  const handleHover = useCallback(
    (index) => {
      const pool = UNIQUE_LOGOS.filter((logo) => !visibleLogos.includes(logo));
      if (pool.length === 0) return;
      const newLogo = pool[Math.floor(Math.random() * pool.length)];
      setVisibleLogos((prev) => {
        const next = [...prev];
        next[index] = newLogo;
        return next;
      });
    },
    [visibleLogos, UNIQUE_LOGOS],
  );

  const rotateLogo = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * 8); // Pick a random cell
    handleHover(randomIndex);
  }, [handleHover]);

  useEffect(() => {
    const interval = setInterval(rotateLogo, 4000); // Flip one every 4 seconds
    return () => clearInterval(interval);
  }, [rotateLogo]);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
        bgcolor: "#fff",
        textAlign: "center",
        pb: 15,
        pt: 8,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: { xs: 4, md: 6 },
          fontWeight: 400,
          textTransform: "uppercase",
          fontSize: { xs: "0.8rem", md: "1rem" },
          color: "#888",
        }}
      >
        Participation In Exhibitions
      </Typography>

      <Box
        sx={{
          mx: "auto",
          maxWidth: "1400px",
          borderTop: "1px solid #f5f5f5",
          borderLeft: "1px solid #f5f5f5",
        }}
      >
        <Grid container>
          {visibleLogos.map((logo, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
              <LogoSlot onMouseEnter={() => handleHover(index)}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={logo}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <BrandLogoImg src={logo} alt="Partner" loading="lazy" />
                  </motion.div>
                </AnimatePresence>
              </LogoSlot>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MaxBrandMarquee;
