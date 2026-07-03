
"use client";

import React from "react";
import "./Styles.scss";
 
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
 

// Set to 0 to show Sonasons, 1 to show Elvee Jewels
const promoMode = 0;

const PromoComponent1 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  
 

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 3 },
        py: { xs: 4, sm: 6, md: 8 },
        
        bgcolor: "#f9f9f9",
      }}
    >
      <Box
        className="promo-diamondBoxMain"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 4, md: 8 },
        }}
      >
        {/* Left Image */}
        <Box
          className="promo-diamondBox2"
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 50%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <picture>
            
            <img
              src="/banner/Promo2.png"
              alt={promoMode === 0 ? "Who We Are - Sonasons" : "Who We Are - Elvee Jewels"}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                objectFit: "cover",
              }}
            />
          </picture>
        </Box>

        {/* Right Text Section */}
        {promoMode === 0 ?
          <>
            <Box
              className="promo-diamondBox_1"
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 50%" },
                textAlign: { xs: "center", md: "left" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "#1d3258",
                  mb: 1,
                  fontFamily: "Avenir, sans-serif",
                }}
              >
                Who We Are
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#444",
                  lineHeight: 1.8,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                From the first sketch to the final polish, every step of the journey
                takes place within the walls of our atelier, where master artisans
                breathe life into raw materials, transforming them into timeless
                works of art. Each piece is meticulously crafted with a blend of
                traditional techniques and contemporary innovation — reflecting a
                harmonious balance between heritage and modernity.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  lineHeight: 1.7,
                  mt: 1,
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                At <b>Sonasons</b>, we turn imagination into timeless elegance.
                As one of India’s trusted jewelry houses, we specialize in crafting{" "}
                <b>Diamond</b>, <b>Gold</b>, and <b>Silver</b> jewelry that celebrates
                beauty, precision, and craftsmanship.
              </Typography>

              <Box
                component="ul"
                sx={{
                  pl: { xs: 2, md: 3 },
                  mt: 1.5,
                  color: "#333",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  lineHeight: 1.7,
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                <li>
                  <b>Diamond Jewellery</b> – intricately designed and precision-set to
                  perfection.
                </li>
                <li>
                  <b>Gold Jewellery</b> – crafted in 14K and 18K purity, reflecting both
                  tradition and trend.
                </li>
                <li>
                  <b>Silver Jewellery</b> – modern, affordable, and elegantly styled
                  for everyday wear.
                </li>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  mt: 1,
                  lineHeight: 1.7,
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                We cater to <b>retailers, wholesalers,</b> and{" "}
                <b>private labels</b> across India and global markets through outright
                sales and <b>job-work models</b>. Each creation undergoes rigorous
                quality checks to ensure unmatched purity, finishing, and design
                integrity.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1d3258",
                  fontFamily: "Avenir, sans-serif",
                }}
              >
                Sonasons — Where Design Meets Precision, and Craftsmanship Meets Trust.
              </Typography>
            </Box>

          </>
          :
          <>
            <Box
              className="promo-diamondBox_1"
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 50%" },
                textAlign: { xs: "center", md: "left" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "#1d3258",
                  mb: 1,
                  fontFamily: "Avenir, sans-serif",
                }}
              >
                Who We Are
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#444",
                  lineHeight: 1.8,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                From the first sketch to the final polish, every step of the journey
                takes place within the walls of our atelier, where master artisans
                breathe life into raw materials, transforming them into timeless
                works of art. Each piece is meticulously crafted with a blend of
                traditional techniques and contemporary innovation — reflecting a
                harmonious balance between heritage and modernity.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  lineHeight: 1.7,
                  mt: 1,
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                At <b>Elvee Jewels Private Limited</b>, we turn imagination into
                timeless elegance. As one of India’s leading jewelry manufacturing
                houses, we specialize in crafting <b>Diamond</b>, <b>Gold</b>, and{" "}
                <b>Silver</b> jewelry that celebrates beauty, precision, and
                craftsmanship.
              </Typography>

              <Box
                component="ul"
                sx={{
                  pl: { xs: 2, md: 3 },
                  mt: 1.5,
                  color: "#333",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  lineHeight: 1.7,
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                <li>
                  <b>Diamond Jewellery</b> – intricately designed and
                  precision-set to perfection.
                </li>
                <li>
                  <b>Gold Jewellery</b> – crafted in 14K and 18K purity, reflecting
                  both tradition and trend.
                </li>
                <li>
                  <b>Silver Jewellery</b> – modern, affordable, and elegantly styled
                  for everyday wear.
                </li>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  mt: 1,
                  lineHeight: 1.7,
                  fontFamily: "PT Sans, sans-serif",
                }}
              >
                We cater to <b>retailers, wholesalers,</b> and{" "}
                <b>private labels</b> across India and global markets through
                outright sale and <b>job-work models</b>. Each creation undergoes
                rigorous quality checks to ensure unmatched purity, finishing, and
                design integrity.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1d3258",
                  fontFamily: "Avenir, sans-serif",
                }}
              >
                Elvee Jewels — Where Design Meets Precision, and Craftsmanship Meets
                Trust.
              </Typography>
            </Box>
          </>
        }
      </Box>
    </Box>
  );
};

export default PromoComponent1;
