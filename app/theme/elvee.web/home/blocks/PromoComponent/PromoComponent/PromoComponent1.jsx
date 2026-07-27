
"use client";

import React from "react";
import "./Styles.scss";

import { Box, Typography, useMediaQuery, useTheme,IconButton } from "@mui/material";
 
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 50%" },
            width: "50%",
            position: "relative",
            "& .swiper": { width: "100%", pb: "40px" },
            "& .swiper-pagination": {
              bottom: "0px !important",
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            },
            "& .swiper-pagination-bullet": {
              backgroundColor: "#1d3258",
              opacity: 0.25,
            },
            "& .swiper-pagination-bullet-active": {
              opacity: 1,
            },
          }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            speed={700}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            navigation={{
              prevEl: ".promo-text-prev",
              nextEl: ".promo-text-next",
            }}
            pagination={{
              el: ".promo-text-pagination",
              clickable: true,
            }}
          >
            {/* SLIDE 1 - Who We Are */}
            <SwiperSlide>
              <Box
                className="promo-diamondBox_1"
                sx={{
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
                    textAlign:"justify"
                  }}
                >
                  Sonasons is a leading jewelry manufacturer specializing in the creation of premium Diamond, Gold, and Silver jewelry for retailers, wholesalers, and private-label brands across India and international markets.

                   
                  With a passion for craftsmanship and a commitment to excellence, we transform precious metals and gemstones into jewelry that reflects beauty, precision, and enduring value. Every stage of production-from design development and sourcing to manufacturing, setting, polishing, and quality assurance-is managed in-house, ensuring exceptional consistency and quality

                 
                  Our skilled artisans combine traditional jewelry-making techniques with modern manufacturing technology to create collections that meet evolving market trends while preserving timeless elegance.

              
                     </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    lineHeight: 1.7,
                    fontWeight: 700,
                    mt: 1,
                    fontFamily: "PT Sans, sans-serif",
                  }}
                >
                  Why Choose Sonasons?
                </Typography>

                <Box
                  component="ul"
                  className="promo-diamondBox_1_ul"
                  sx={{
                    pl: { xs: 2, md: 3 },
                    mt: 1.5,
                    color: "#333",
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    lineHeight: 1.7,
                    fontFamily: "PT Sans, sans-serif",
                  }}
                >
                  <li>End-to-end in-house manufacturing</li>
                  <li>Expert craftsmanship and quality control</li>
                  <li>Diamond, Gold, and Silver jewelry expertise</li>
                  <li>Private label and OEM manufacturing</li>
                  <li>Timely delivery and scalable production</li>
                  <li>Trusted by retailers and wholesalers globally</li>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "#1d3258",
                    fontFamily: "Avenir, sans-serif",
                  }}
                >
                  Crafting Excellence. Delivering Trust. Inspiring Elegance.
                </Typography>
              </Box>
            </SwiperSlide>

            {/* SLIDE 2 - Our Jewelry Collections */}
            <SwiperSlide>
              <Box
                className="promo-diamondBox_1"
                sx={{
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
                  Our Jewelry Collections
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
                  Explore our exquisite range of Diamond, Gold, and Silver jewelry—crafted with precision, inspired by elegance, and designed to leave a lasting impression.
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "1px",
                    color: "#1d3258",
                    fontFamily: "Avenir, sans-serif",
                    fontSize: { xs: "1.2rem", md: "1.4rem" },
                  }}
                >
                  Diamond Jewellery
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
                  Precision-crafted diamond jewelry designed to maximize brilliance and sophistication. Our collection features contemporary and timeless designs created with meticulous attention to every detail.
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "1px",
                    color: "#1d3258",
                    fontFamily: "Avenir, sans-serif",
                    fontSize: { xs: "1.2rem", md: "1.4rem" },
                  }}
                >
                  Gold Jewellery
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
                  Manufactured in 14K and 18K gold, our gold jewelry blends traditional artistry with modern design trends. From everyday elegance to statement pieces, every creation reflects superior craftsmanship.
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "1px",
                    color: "#1d3258",
                    fontFamily: "Avenir, sans-serif",
                    fontSize: { xs: "1.2rem", md: "1.4rem" },
                  }}
                >
                  Silver Jewellery
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
                  Stylish, affordable, and versatile silver jewelry designed for modern lifestyles. Our silver collections combine contemporary aesthetics with exceptional quality and finish.
                </Typography>

                

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "#1d3258",
                    fontFamily: "Avenir, sans-serif",
                  }}
                >
                  Whether it's Diamond, Gold, or Silver, every Sonasons creation is crafted with precision, passion, and an unwavering commitment to quality.
                </Typography>
              </Box>
            </SwiperSlide>
          </Swiper>

          {/* Custom nav + pagination row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: "12px",
              mt: 2,
            }}
          >
            <IconButton
              className="promo-text-prev"
              sx={{ p: 0, color: "#1d3258", opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
              <ChevronLeft sx={{ fontSize: 22 }} />
            </IconButton>

            <Box style={{width :"35px",display:"flex"}}  className="promo-text-pagination" />

            <IconButton
              className="promo-text-next"
              sx={{ p: 0, color: "#1d3258", opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
              <ChevronRight sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
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
