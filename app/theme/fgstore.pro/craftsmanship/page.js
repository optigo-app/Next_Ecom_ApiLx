"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import "./Craftsmanship.scss";

const CRAFTSMANSHIP_STEPS = [
  {
    step: 1,
    overline: "THE CONCEPT & CAD",
    title: "Visualizing Dreams into Three Dimensions",
    body1:
      "Our design process begins with a meticulous sketch detailing dimensions and profiles. Once approved, specialized artisans render the design in hyper-precise CAD (Computer-Aided Design) files, simulating weight, stone fit, and reflections before any precious metal is touched.",
    body2:
      "This guarantees absolute transparency and perfect proportion alignment, allowing you to preview your bespoke creation.",
    image: "/WebSiteStaticImage/SimilingRock/static/2.png",
    alt: "Precision CAD Design Sketch",
  },
  {
    step: 2,
    overline: "THE MODEL & CASTING",
    title: "Bringing Structure to Precious Metals",
    body1:
      "The virtual CAD model is materialized into a highly detailed three-dimensional wax print. Our goldsmiths use lost-wax casting methods to inject molten gold, platinum, or custom alloys into the plaster molds, transforming soft waxes into rigid luxury mountings.",
    body2:
      "Every setting undergoes rigorous hand-polishing and detailing to ensure seamless structural integrity and smooth inner comfort.",
    image: "/WebSiteStaticImage/SimilingRock/static/3.png",
    alt: "Precision Wax Casting & Goldsmithing",
  },
  {
    step: 3,
    overline: "STONE SETTING & FINISH",
    title: "Unlocking the Fire and Brilliance",
    body1:
      "Under high-powered microscopes, master setters individually position and secure diamonds and gems. Pratt-prongs, pavé beads, and bezels are sculpted from gold with surgical accuracy, locking in each stone while allowing optimal light refraction.",
    body2:
      "A final multi-stage mirror polish, ultrasonic bath, and structural inspection complete the journey of a true masterpiece.",
    image: "/WebSiteStaticImage/SimilingRock/static/4.png",
    alt: "Microscopic Diamond Setting",
  },
];

export default function CraftsmanshipBlock({ assetBase }) {
  const [activeStep, setActiveStep] = useState(0);
  // continuous progress (0 -> 1) across the WHOLE section — drives the progress bar
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;
      if (totalScrollableHeight <= 0) return;

      let progress = 0;

      if (rect.top > 0) {
        progress = 0;
      } else if (rect.bottom < window.innerHeight) {
        progress = 1;
      } else {
        progress = Math.min(
          Math.max(Math.abs(rect.top) / totalScrollableHeight, 0),
          1
        );
      }

      setScrollProgress(progress);

      const stepFloat = progress * CRAFTSMANSHIP_STEPS.length;
      const idx = Math.min(
        Math.floor(stepFloat),
        CRAFTSMANSHIP_STEPS.length - 1
      );
      setActiveStep(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      ref={containerRef}
      className="craftsmanshipContainer"
      sx={{
        height: { xs: "auto", md: "250vh" },
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: { xs: "relative", md: "sticky" },
          top: 0,
          height: { xs: "auto", md: "100vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          py: { xs: 6, md: 0 },
        }}
      >
        {/* Fixed Header */}
        <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 5 } }}>
          <Box className="craftsmanshipHero" sx={{ textAlign: "center" }}>
            <Typography
              variant="overline"
              className="craftsmanshipOverline"
              sx={{
                letterSpacing: "0.2em",
                fontWeight: 600,
                fontSize: "0.85rem",
                mb: 1,
                display: "block",
              }}
            >
              ARTISTRY & INNOVATION
            </Typography>
            <Typography
              variant="h3"
              className="craftsmanshipTitle"
              sx={{
                fontFamily: "Prata, Playfair Display, serif",
                fontWeight: 400,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              The Art of High Jewelry Craftsmanship
            </Typography>
            <Typography
              variant="body1"
              className="craftsmanshipBody"
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.6,
                maxWidth: "750px",
                mx: "auto",
              }}
            >
              Every custom creation tells a story of unmatched expertise, ethical
              sourcing, and hand-finished precision.
            </Typography>
          </Box>
        </Container>

        {/* Dynamic Content */}
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* Left: Image Stack */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: "320px", sm: "380px", md: "440px" },
                  overflow: "hidden",
                  borderRadius: "2px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                {CRAFTSMANSHIP_STEPS.map((item, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={item.image}
                    alt={item.alt}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: activeStep === index ? 1 : 0,
                      transform:
                        activeStep === index ? "scale(1)" : "scale(1.08)",
                      transition:
                        "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 1.2s cubic-bezier(0.4,0,0.2,1)",
                      // keep behind ones from blocking interaction
                      pointerEvents: activeStep === index ? "auto" : "none",
                    }}
                  />
                ))}

                {/* Step badge overlay on the image — big visual confirmation */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "20px",
                    backgroundColor: "rgba(17,24,39,0.75)",
                    backdropFilter: "blur(4px)",
                    color: "#fff",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  STEP {activeStep + 1} / {CRAFTSMANSHIP_STEPS.length}
                </Box>
              </Box>
            </Grid>

            {/* Right: Text Stack */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: "auto", md: "320px" },
                  pl: { md: 4 },
                }}
              >
                {CRAFTSMANSHIP_STEPS.map((item, index) => {
                  const isActive = activeStep === index;
                  return (
                    <Box
                      key={index}
                      sx={{
                        position: { xs: "relative", md: "absolute" },
                        top: 0,
                        left: 0,
                        width: "100%",
                        // NOTE: no display:none — that's what was killing the transition
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(24px)",
                        transition:
                          "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Box
                          className="craftsmanshipStepBadge"
                          sx={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            backgroundColor: "#111827",
                            color: "#ffffff",
                          }}
                        >
                          {item.step}
                        </Box>
                        <Typography
                          variant="overline"
                          className="craftsmanshipOverline"
                          sx={{ letterSpacing: "0.1em", fontWeight: 600 }}
                        >
                          {item.overline}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="h4"
                        className="craftsmanshipTitle"
                        sx={{
                          fontFamily: "Prata, Playfair Display, serif",
                          fontWeight: 400,
                          fontSize: { xs: "1.5rem", md: "1.8rem" },
                          lineHeight: 1.3,
                          mb: 2,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        className="craftsmanshipBody"
                        sx={{ fontSize: "0.95rem", lineHeight: 1.7, mb: 2 }}
                      >
                        {item.body1}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="craftsmanshipBody"
                        sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                      >
                        {item.body2}
                      </Typography>
                    </Box>
                  );
                })}

                {/* ---- Progress indicator: dots + filling bar ---- */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    position: { xs: "relative", md: "absolute" },
                    bottom: { md: -56 },
                    left: 0,
                    mt: { xs: 4, md: 0 },
                  }}
                >
                  {CRAFTSMANSHIP_STEPS.map((_, index) => {
                    const isActive = activeStep === index;
                    const isDone = activeStep > index;
                    // how "filled" this specific dot's segment is (0-1)
                    const segProgress = Math.min(
                      Math.max(
                        scrollProgress * CRAFTSMANSHIP_STEPS.length - index,
                        0
                      ),
                      1
                    );
                    return (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: isActive ? 40 : 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(17,24,39,0.15)",
                          overflow: "hidden",
                          transition: "width 0.4s ease",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: `${
                              isDone ? 100 : isActive ? segProgress * 100 : 0
                            }%`,
                            backgroundColor: "#111827",
                            transition: "width 0.15s linear",
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}