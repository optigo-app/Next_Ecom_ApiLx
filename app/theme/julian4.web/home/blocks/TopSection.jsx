"use client";

import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const handleShopNowClick = () => {
    push("/p");
}


const SLIDE_DATA = [
  {
    id: 1,
    subtitle: 'ETERNAL SPARKLE',
    title: 'Mark Your Milestones\nWith Brilliance',
    description: 'Jewelry is a symbol of love, success, and self-expression, making every occasion more special.',
    bgColor: '#d8e3c9',
    img: '/WebSiteStaticImage/Banner/julian4/banner1.webp',
  },
  {
    id: 2,
    subtitle: 'ENCHANTING ELEGANCE',
    title: 'Create Memories\nThat Sparkle',
    description: 'We believe in the power of jewelry, to tell a story, celebrate a moment, create or continue a tradition.',
    bgColor: '#f8effc',
    img: '/WebSiteStaticImage/Banner/julian4/banner2.webp',
  },
  {
    id: 3,
    subtitle: 'TIMELESS BRILLIANCE',
    title: 'Celebrate Love That\nShines Bright',
    description: "Jewelry is more than adornment, it's a keepsake of cherished times, love, and meaningful connections.",
    bgColor: '#e3ede9',
    img: '/WebSiteStaticImage/Banner/julian4/banner3.webp',
  }
];

export default function HeroBanner() {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        '& .swiper': { width: '100%', height: { xs: 'auto', md: '650px' } },

        // --- Custom Image Sliding Logic ---
        '& .swiper-slide .slide-image': {
          transform: 'translateX(100%)',
          transition: 'transform 900ms cubic-bezier(0.25, 1, 0.5, 1)'
        },
        '& .swiper-slide-active .slide-image': {
          transform: 'translateX(0%)'
        },
        '& .swiper-slide-prev .slide-image': {
          transform: 'translateX(-100%)'
        },

        // --- Custom Text Fading Logic ---
        '& .swiper-slide .slide-text-wrapper': {
          opacity: 0,
          transition: 'opacity 800ms ease-in-out'
        },
        '& .swiper-slide-active .slide-text-wrapper': {
          opacity: 1
        },

        // --- Pagination Styling ---
        '& .swiper-pagination': {
          position: 'static !important',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        '& .swiper-pagination-bullet': {
          width: '6px',
          height: '6px',
          backgroundColor: '#1c1c1c',
          opacity: 0.2,
          margin: '0 !important',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        },
        '& .swiper-pagination-bullet-active': {
          opacity: 1,
          transform: 'scale(1.3)',
          backgroundColor: '#1c1c1c',
        }
      }}
    >
      <Swiper
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          prevEl: '.unique-banner-prev',
          nextEl: '.unique-banner-next',
        }}
        pagination={{
          el: '.unique-banner-pagination',
          clickable: true,
        }}
      >
        {SLIDE_DATA.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Grid container sx={{ height: '100%', minHeight: { xs: '550px', md: '100%' } }}>

              {/* Left Column: Text Content */}
              <Grid item xs={12} md={6} sx={{
                backgroundColor: slide.bgColor,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                px: { xs: 4, sm: 8, md: 10 },
                py: { xs: 6, md: 4 } // Adjusted padding for tighter mobile rendering
              }}>
                <Box className="slide-text-wrapper" sx={{ maxWidth: '480px', mx: 'auto', width: '100%' }}>
                  <Typography sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    color: '#1c1c1c',
                    mb: 2,
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}>
                    {slide.subtitle}
                  </Typography>

                  <Typography variant="h2" sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 400,
                    fontSize: { xs: '28px', sm: '38px', md: '48px' }, // Slightly smaller font sizes on mobile for balance
                    lineHeight: 1.2,
                    color: '#1c1c1c',
                    whiteSpace: 'pre-line',
                    mb: 2,
                    textAlign: 'center'
                  }}>
                    {slide.title}
                  </Typography>

                  <Typography sx={{
                    fontSize: '14px',
                    color: '#555',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    fontFamily: '"Playfair Display", serif',
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    {slide.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 0 } }}>
                    <Button
                      variant="contained"
                      onClick={handleShopNowClick}
                      sx={{
                        backgroundColor: '#1c1c1c',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        borderRadius: 0,
                        px: 4,
                        py: 1.5,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#000',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      SHOP NOW
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column: Image Frame */}
              <Grid item xs={12} md={6} sx={{
                height: { xs: '300px', sm: '400px', md: '100%' }, // Responsive height presets for mobile viewports
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box
                  component="img"
                  className="slide-image"
                  src={slide.img}
                  alt={slide.subtitle}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Grid>

            </Grid>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* STATIC NAVIGATION CONTROLS */}
      <Box sx={{
        position: 'absolute',
        bottom: '24px', // Shifted up slightly to fit nicely below buttons on small mobile views
        left: { xs: '50%', md: 'calc(25% - 240px)' },
        transform: 'translateX(-50%)',
        ...({ md: { transform: 'none' } }),
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 99,
        "& .swiper-pagination-bullet": {
          mx: "6px",
        },
      }}>
        <IconButton className="unique-banner-prev" sx={{ p: 0, color: '#1c1c1c', opacity: 0.6, '&:hover': { opacity: 1 } }}>
          <ChevronLeft sx={{ fontSize: 20 }} />
        </IconButton>

        <Box className="unique-banner-pagination" />

        <IconButton className="unique-banner-next" sx={{ p: 0, color: '#1c1c1c', opacity: 0.6, '&:hover': { opacity: 1 } }}>
          <ChevronRight sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

// Updated Grid helper component to handle mobile stacking inversion
function Grid({ container, item, xs, md, children, sx }) {
  return (
    <Box sx={{
      display: container ? 'flex' : 'block',
      flexWrap: 'wrap',
      width: '100%',
      flexDirection: container ? { xs: 'column-reverse', md: 'row' } : 'unset', // 'column-reverse' flips layout DOM order on mobile
      ...(item && { width: md ? { xs: '100%', md: `${(md / 12) * 100}%` } : '100%' }),
      ...sx
    }}>
      {children}
    </Box>
  );
}