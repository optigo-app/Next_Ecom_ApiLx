"use client";

import React from 'react';
import { Box, Typography, Button, Grid, Link } from '@mui/material';
const handleShopNowClick = () => {
    push("/p");
}

const GALLERY_ITEMS = [
  {
    subHeading: "Find Your Best",
    heading: "Shine Bright",
    link: "#",
    image: "/WebSiteStaticImage/Banner/julian4/productBanner1.webp"
  },
  {
    subHeading: "Evry Day Basics",
    heading: "Bestselling Designs",
    link: "#",
    image: "/WebSiteStaticImage/Banner/julian4/productBanner2.webp"
  }
];

export default function GalleryGrid() {
  return (
    <Box
      component="section"
      id="shopify-section-template--17238290104455__gallery_grid_MpwGUQ"
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        pt: '56px',
        pb: '56px',
        px: { xs: 2, md: 4 },
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <Grid container spacing={{ xs: 2, lg: 4 }}>
        {GALLERY_ITEMS.map((item, index) => (
          <Grid   size={{ xs: 12, md: 6 }} key={index}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                // Fix: Replaces vertical padding collapse with native box aspect-ratio matching
                aspectRatio: '1 / 1', 
                overflow: 'hidden',
                borderRadius: '6px', 
                backgroundColor: '#f5f5f5',
                // Scopes layout selection targeting cleanly
                '&:hover .gallery-bg-img': {
                  transform: 'scale(1.03)',
                }
              }}
            >
              {/* Card Image Asset Layer */}
              <Box
                className="gallery-bg-img"
                component="img"
                src={item.image}
                alt={item.heading}
                loading="lazy"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  zIndex: 1
                }}
              />

              {/* Linear Media Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 90%)',
                  zIndex: 2
                }}
              />

              {/* Absolute Overlay Click Target */}
              <Link 
                href={item.link} 
                aria-label={item.heading}
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 3,
                 
                }}
              />

              {/* Card Text & Action Interaction Wrapper Box */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  textAlign: 'left',
                  p: { xs: 4, sm: 6, md: 7 },
                  color: '#ffffff',
                  zIndex: 4,
                  pointerEvents: 'none' 
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: { xs: '11px', md: '13px' },
                    fontWeight: 500,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    mb: 1,
                    opacity: 0.95
                  }}
                >
                  {item.subHeading}
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'serif',
                    fontSize: { xs: '24px', sm: '32px', md: '42px' },
                    fontWeight: 400,
                    lineHeight: 1.2,
                    mb: 3,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {item.heading}
                </Typography>

                <Button
                  variant="contained"
                  href={item.link}
                  aria-label={`Shop now for ${item.heading}`}
                  onClick={handleShopNowClick}
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    borderRadius: 0,
                    fontWeight: 600,
                    fontSize: '12px',
                    letterSpacing: '2px',
                    px: 4,
                    py: 1.5,
                    boxShadow: 'none',
                    pointerEvents: 'auto', 
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Shop now
                </Button>
              </Box>

            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}