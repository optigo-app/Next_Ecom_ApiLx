"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import "./Craftsmanship.scss";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
const resolveContent = (data) => {
  const parsed = parseIfString(data) || {};
  return parseIfString(parsed?.ContentJson ?? parsed) || {};
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CraftsmanshipBlock({ craftsmanship }) {
  const [activeStep, setActiveStep] = useState(0);
  // continuous progress (0 -> 1) across the WHOLE section — drives the progress bar
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  const content = useMemo(() => resolveContent(craftsmanship), [craftsmanship]);

  const { visible = true, header, steps: rawSteps } = content;
  const { eyebrow, heading, subheading } = header || {};

  // Normalize steps into the shape the UI uses
  const steps = useMemo(() => {
    if (!Array.isArray(rawSteps)) return [];

    return rawSteps
      .filter((s) => s && (s.title || s.imageUrl || s.tag))
      .map((s, index) => {
        const paragraphs = Array.isArray(s.paragraphs)
          ? s.paragraphs.filter((p) => typeof p === "string" && p.trim())
          : [];

        return {
          key: s.id ?? `step-${index}`,
          step: index + 1,
          overline: s.tag,
          title: s.title,
          body1: paragraphs[0],
          body2: paragraphs.slice(1),
          image: s.imageUrl,
          alt: s.title || s.tag || `Step ${index + 1}`,
        };
      });
  }, [rawSteps]);

  const stepsCount = steps.length;
  const shouldRender = visible && stepsCount > 0;

  useEffect(() => {
    if (!shouldRender) return undefined;

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

      const stepFloat = progress * stepsCount;
      const idx = Math.min(Math.floor(stepFloat), stepsCount - 1);
      setActiveStep(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldRender, stepsCount]);

  if (!shouldRender) return null;

  // Safety clamp in case the number of steps shrinks
  const currentStep = Math.min(activeStep, stepsCount - 1);

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
        {(eyebrow || heading || subheading) && (
          <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 5 } }}>
            <Box className="craftsmanshipHero" sx={{ textAlign: "center" }}>
              {eyebrow && (
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
                  {eyebrow}
                </Typography>
              )}
              {heading && (
                <Typography
                  variant="h3"
                  component="h2"
                  className="craftsmanshipTitle"
                  sx={{
                    fontFamily: "Prata, Playfair Display, serif",
                    fontWeight: 400,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    lineHeight: 1.2,
                    mb: 1.5,
                  }}
                >
                  {heading}
                </Typography>
              )}
              {subheading && (
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
                  {subheading}
                </Typography>
              )}
            </Box>
          </Container>
        )}

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
                {steps.map((item, index) => (
                  <Box
                    key={item.key}
                    component="img"
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.alt}
                    width="1200"
                    height="800"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: currentStep === index ? 1 : 0,
                      transform:
                        currentStep === index ? "scale(1)" : "scale(1.08)",
                      transition:
                        "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 1.2s cubic-bezier(0.4,0,0.2,1)",
                      // keep behind ones from blocking interaction
                      pointerEvents: currentStep === index ? "auto" : "none",
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
                  STEP {currentStep + 1} / {stepsCount}
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
                {steps.map((item, index) => {
                  const isActive = currentStep === index;
                  return (
                    <Box
                      key={item.key}
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
                        {item.overline && (
                          <Typography
                            variant="overline"
                            className="craftsmanshipOverline"
                            sx={{ letterSpacing: "0.1em", fontWeight: 600 }}
                          >
                            {item.overline}
                          </Typography>
                        )}
                      </Stack>

                      {item.title && (
                        <Typography
                          variant="h4"
                          component="h3"
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
                      )}
                      {item.body1 && (
                        <Typography
                          variant="body1"
                          className="craftsmanshipBody"
                          sx={{ fontSize: "0.95rem", lineHeight: 1.7, mb: 2 }}
                        >
                          {item.body1}
                        </Typography>
                      )}
                      {item.body2.map((text, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          className="craftsmanshipBody"
                          sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                        >
                          {text}
                        </Typography>
                      ))}
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
                  {steps.map((item, index) => {
                    const isActive = currentStep === index;
                    const isDone = currentStep > index;
                    // how "filled" this specific dot's segment is (0-1)
                    const segProgress = Math.min(
                      Math.max(scrollProgress * stepsCount - index, 0),
                      1
                    );
                    return (
                      <Box
                        key={item.key}
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