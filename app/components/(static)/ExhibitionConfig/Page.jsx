"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MAX_VISIBLE = 8;
const ROTATE_INTERVAL_MS = 4000;
const DEFAULT_TITLE = "Participation In Exhibitions";

const parseIfString = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

// Accepts the data object itself, an object wrapping it in ContentJson,
// or a JSON string of either.
const resolveContent = (config) => {
  const parsed = parseIfString(config) || {};
  return parseIfString(parsed?.ContentJson ?? parsed) || {};
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MaxBrandMarquee = ({ ExhibitionConfig }) => {
  const content = useMemo(
    () => resolveContent(ExhibitionConfig),
    [ExhibitionConfig],
  );

  const { visible = true, sectionTitle, exhibitions } = content;

  // Sorted, filtered, de-duplicated list of { src, alt }
  const logos = useMemo(() => {
    if (!Array.isArray(exhibitions)) return [];

    const seen = new Set();

    return [...exhibitions]
      .filter((item) => item?.imageUrl)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .filter((item) => {
        if (seen.has(item.imageUrl)) return false;
        seen.add(item.imageUrl);
        return true;
      })
      .map((item) => ({
        src: item.imageUrl,
        alt: item.name?.trim() || sectionTitle || "Exhibition",
      }));
  }, [exhibitions, sectionTitle]);

  const logosKey = useMemo(() => logos.map((l) => l.src).join("|"), [logos]);

  // Only rotate when there are more logos than grid slots
  const canRotate = logos.length > MAX_VISIBLE;

  const [visibleLogos, setVisibleLogos] = useState(() =>
    logos.slice(0, MAX_VISIBLE),
  );

  // Reset the grid if the data changes
  useEffect(() => {
    setVisibleLogos(logos.slice(0, MAX_VISIBLE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logosKey]);

  // Swap the logo in one cell with a random logo that isn't currently shown
  const swapLogoAt = useCallback(
    (index) => {
      if (!canRotate) return;

      setVisibleLogos((prev) => {
        if (index < 0 || index >= prev.length) return prev;

        const shown = new Set(prev.map((l) => l.src));
        const pool = logos.filter((l) => !shown.has(l.src));
        if (pool.length === 0) return prev;

        const next = [...prev];
        next[index] = pool[Math.floor(Math.random() * pool.length)];
        return next;
      });
    },
    [logos, canRotate],
  );

  useEffect(() => {
    if (!canRotate) return undefined;

    const interval = setInterval(() => {
      swapLogoAt(Math.floor(Math.random() * MAX_VISIBLE));
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [canRotate, swapLogoAt]);

  if (!visible || logos.length === 0) return null;

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
        bgcolor: "#fff",
        textAlign: "center",
        pt: 8,
      }}
    >
      <Typography
        variant="h6"
        component="p"
        sx={{
          mb: { xs: 4, md: 6 },
          fontWeight: 400,
          textTransform: "uppercase",
          fontSize: { xs: "0.8rem", md: "1rem" },
          color: "#888",
        }}
      >
        {sectionTitle || DEFAULT_TITLE}
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
              <LogoSlot onMouseEnter={() => swapLogoAt(index)}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={logo.src}
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
                    <BrandLogoImg
                      src={logo.src}
                      alt={logo.alt}
                      loading="lazy"
                      decoding="async"
                      width="160"
                      height="70"
                    />
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