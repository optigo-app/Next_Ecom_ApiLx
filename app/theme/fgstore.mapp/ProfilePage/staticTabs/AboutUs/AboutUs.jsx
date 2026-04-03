"use client";

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppConfig } from "@/app/(core)/constants/AppConfig";
import { activeBrand } from "@/app/env";

const AboutUs = ({ open, onClose }) => {
  const config = AppConfig[activeBrand] || AppConfig.SonasonsApp;
  const aboutUs = config?.about_us;

  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          height: "100svh",
          bgcolor: "#fff",
        },
      }}
    >
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#000", fontWeight: 700 }}>
            About Us
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#000" }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ overflowY: "auto", pb: 6 }}>
        {/* Banner */}
        {aboutUs?.banner && (
          <Box
            component="img"
            src={aboutUs.banner}
            alt={`About ${activeBrand}`}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              mb: 4,
            }}
          />
        )}

        <Container maxWidth="sm" sx={{ mt: 2 }}>
          {aboutUs?.sections?.map((section, index) => (
            <Box key={index} sx={{ mb: index === aboutUs.sections.length - 1 ? 0 : 4 }}>
              {/* Title - First section gets h5, others get h6 to match original design */}
              {section.title && (
                <Typography
                  variant={index === 0 ? "h5" : "h6"}
                  sx={{ fontWeight: 800, mb: 2, color: "#1a1a1a" }}
                >
                  {section.title}
                </Typography>
              )}

              {/* Subtitle / Bold Intro */}
              {section.subtitle && (
                <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}>
                  {section.subtitle}
                </Typography>
              )}

              {/* Paragraphs */}
              {section.paragraphs?.map((paragraph, pIndex) => (
                <Typography
                  key={pIndex}
                  variant="body2"
                  sx={{
                    mb: pIndex === section.paragraphs.length - 1 ? 0 : 2,
                    lineHeight: 1.8,
                    color: "#444"
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          ))}
        </Container>
      </Box>
    </Drawer>
  );
};

export default AboutUs;
