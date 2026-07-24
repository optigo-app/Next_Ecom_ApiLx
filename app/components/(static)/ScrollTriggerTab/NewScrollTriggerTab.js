"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ScrollTriggerTab({ assetBase }) {
    const ScrollImageList = [
        {
            img: `${assetBase}/imageBanner/1.png`,
            head: "",
            title: "Crafted to Celebrate Your Moments",
            desc: "Every piece at Sonasons Jewellery is thoughtfully designed and handcrafted to reflect timeless elegance, purity, and precision. From everyday wear to wedding heirlooms, we create jewellery that lasts generations.",
            align: "right",
            btn_des: "READ MORE",
            isborder: true,
            link: "/why-quality-matters",
            bgColor: "#f4f1ec",
        },
        {
            head: "",
            title: "Design Your Own Jewellery",
            img: `${assetBase}/imageBanner/3.png`,
            desc: "Create jewellery that is truly your own. Choose your preferred design, materials, and details to craft a piece that reflects your personal style. Bring your vision to life with a design made just for you.",
            align: "left",
            btn_des: "CUSTOMISE NOW",
            isborder: true,
            link: "/customization",
            bgColor: "#f4f1ec",
        },
        {
            head: "",
            title: "Meet Our Experts",
            img: `${assetBase}/imageBanner/6.png`,
            desc: "Explore our collection of timeless classics. Perfect for any occasion, these pieces are designed to be cherished for generations to come.",
            desc2: "Mon - Fri, 9:00 AM - 6:00 PM",
            align: "right",
            btn_des: "CALL US",
            isborder: true,
            link: "tel:+464641313131",
            bgColor: "#f4f1ec",
        },
    ];

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                overflow: "hidden",
                "& .swiper": { width: "100%", height: { xs: "auto", md: "650px" } },

                "& .swiper-slide .slide-image": {
                    transform: "translateX(100%)",
                    transition: "transform 900ms cubic-bezier(0.25, 1, 0.5, 1)",
                },
                "& .swiper-slide-active .slide-image": {
                    transform: "translateX(0%)",
                },
                "& .swiper-slide-prev .slide-image": {
                    transform: "translateX(-100%)",
                },

                "& .swiper-slide .slide-text-wrapper": {
                    opacity: 0,
                    transition: "opacity 800ms ease-in-out",
                },
                "& .swiper-slide-active .slide-text-wrapper": {
                    opacity: 1,
                },

                "& .swiper-pagination": {
                    position: "static !important",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                },
                "& .swiper-pagination-bullet": {
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#1c1c1c",
                    opacity: 0.2,
                    margin: "0 !important",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                },
                "& .swiper-pagination-bullet-active": {
                    opacity: 1,
                    transform: "scale(1.3)",
                    backgroundColor: "#1c1c1c",
                },
            }}
        >
            <Swiper
                modules={[EffectFade, Navigation, Pagination, Autoplay]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={900}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                navigation={{
                    prevEl: ".unique-banner-prev",
                    nextEl: ".unique-banner-next",
                }}
                pagination={{
                    el: ".unique-banner-pagination",
                    clickable: true,
                }}
            >
                {ScrollImageList.slice(0, 3).map((slide, i) => {
                    // "left" align = image on left, text on right (column-reverse on desktop)
                    const imageFirst = slide.align === "left";

                    return (
                        <SwiperSlide key={i}>
                            <Grid
                                container
                                sx={{
                                    height: "100%",
                                    minHeight: { xs: "550px", md: "100%" },
                                    flexDirection: imageFirst
                                        ? { xs: "column-reverse", md: "row-reverse" }
                                        : { xs: "column-reverse", md: "row" },
                                }}
                            >
                                {/* Text Column */}
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        backgroundColor: slide.bgColor || "#f4f1ec",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        px: { xs: 4, sm: 8, md: 10 },
                                        py: { xs: 6, md: 4 },
                                    }}
                                >
                                    <Box
                                        className="slide-text-wrapper"
                                        sx={{ maxWidth: "480px", mx: "auto", width: "100%" }}
                                    >
                                        {slide.head && (
                                            <Typography
                                                sx={{
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    letterSpacing: "2px",
                                                    color: "#1c1c1c",
                                                    mb: 2,
                                                    textAlign: "center",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                {slide.head}
                                            </Typography>
                                        )}

                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontFamily: '"Playfair Display", serif',
                                                fontWeight: 400,
                                                fontSize: { xs: "28px", sm: "38px", md: "48px" },
                                                lineHeight: 1.2,
                                                color: "#1c1c1c",
                                                whiteSpace: "pre-line",
                                                mb: 2,
                                                textAlign: "center",
                                            }}
                                        >
                                            {slide.title}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: "14px",
                                                color: "#555",
                                                lineHeight: 1.6,
                                                fontStyle: "italic",
                                                fontFamily: '"Playfair Display", serif',
                                                mb: 3,
                                                textAlign: "center",
                                            }}
                                        >
                                            {slide.desc}
                                            {slide.desc2 && (
                                                <>
                                                    <br />
                                                    <br />
                                                    {slide.desc2}
                                                </>
                                            )}
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 4, md: 0 } }}>
                                            <Link
                                                href={slide.link || "#"}
                                                passHref
                                                style={{ textDecoration: "none", color: "inherit", outline: "none" }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "#c20000",
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        letterSpacing: "1px",
                                                        borderRadius: "4px",
                                                        px: 4,
                                                        py: 1.5,
                                                        boxShadow: "none",
                                                         
                                                        "&:hover": {
                                                            backgroundColor: "#000",
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    {slide.btn_des}
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Image Column */}
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        height: { xs: "300px", sm: "400px", md: "100%" },
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        className="slide-image"
                                        src={slide.img}
                                        alt={slide.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/noimage.png"; // replace with your fallback path
                                        }}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* STATIC NAVIGATION CONTROLS */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    zIndex: 99,
                    "& .swiper-pagination-bullet": {
                        mx: "6px",
                    },
                }}
            >
                <IconButton
                    className="unique-banner-prev"
                    sx={{ p: 0, color: "#1c1c1c", opacity: 0.6, "&:hover": { opacity: 1 } }}
                >
                    <ChevronLeft sx={{ fontSize: 20 }} />
                </IconButton>

                <Box className="unique-banner-pagination" />

                <IconButton
                    className="unique-banner-next"
                    sx={{ p: 0, color: "#1c1c1c", opacity: 0.6, "&:hover": { opacity: 1 } }}
                >
                    <ChevronRight sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        </Box>
    );
}

// Grid helper — same as your new banner
function Grid({ container, item, xs, md, children, sx }) {
    return (
        <Box
            sx={{
                display: container ? "flex" : "block",
                flexWrap: "wrap",
                width: "100%",
                ...(item && { width: md ? { xs: "100%", md: `${(md / 12) * 100}%` } : "100%" }),
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}