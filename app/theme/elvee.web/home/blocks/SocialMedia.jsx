'use client'
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import { Box, IconButton, Typography, styled } from "@mui/material";
import { HeaderV2 } from "./Header";
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


const VideoCard = styled(Box)(({ theme }) => ({
    position: "relative",
    borderRadius: 1,
    overflow: "hidden",
    background: theme.palette.background.paper,
    cursor: "pointer",
    transition: "transform 0.25s ease",

    "&:hover": {
        transform: "translateY(-2px)",
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: theme.spacing(1.5),
    left: theme.spacing(1.5),
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    borderRadius: "50%",
    padding: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 2,
}));

/* ---------- Main Component ---------- */

export default function SocialMediaVideoSection({ }) {

    const videoData = [
        {
            id: 1,
            link: "/video/1.mp4",
            icon: <InstagramIcon />
        },
        {
            id: 2,
            link: "/video/2.mp4",
            icon: <FacebookIcon />
        },
        {
            id: 3,
            link: "/video/3.mp4",
            icon: <LinkedInIcon />
        },
        {
            id: 4,
            link: "/video/4.mp4",
            icon: <YouTubeIcon />
        },

    ]
    const videoRefs = useRef([]);

    const handleMouseEnter = (index) => {
        const video = videoRefs.current[index];
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => { });
        }
    };

    const handleMouseLeave = (index) => {
        const video = videoRefs.current[index];
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    return (
        <Box name="mainSocialMediaConatinerID" sx={{
            width: "100%", px: { xs: 2, sm: 3, md: 4 }, mb: 5,
            boxSizing: 'border-box',
            py: 8
        }}>

            <HeaderV2
                title="Curated moments"
                alignment="center"
            />

            <Swiper
                loop
                spaceBetween={16}
                modules={[Pagination]}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 1.3 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 4 },
                }}
            >
                {videoData?.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Link href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <VideoCard onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    src={item.link}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "block",
                                        objectFit: "cover",
                                    }}
                                />

                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        bottom: 16,
                                        left: 16,
                                        background: "rgba(255,255,255,0.95)",
                                        backdropFilter: "blur(12px)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.25s ease",
                                        zIndex: 2,
                                        color: "#000",
                                        "&:hover": {
                                            background: "#fff",
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            </VideoCard>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}
