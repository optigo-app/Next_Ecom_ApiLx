"use client";

import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';

export default function ImageComparisonSection() {
  // Slider position state percentage (0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  // Core handler logic managing the dragging calculation
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    // Only drag if left mouse button is pressed, or handle unconditionally if checking moves
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 6, md: 6 }, px: { xs: 2, sm: 4, md: 8 }, backgroundColor: '#fff' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 4, md: 8 },
        }}
      >

        {/* LEFT COLUMN: COMPARISON SLIDER & UNDERLINE DATA */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Box
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={(e) => handleMove(e.clientX)}
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1.24',
              backgroundColor: '#f4f1eb',
              overflow: 'hidden',
              userSelect: 'none',
              cursor: 'ew-resize'
            }}
          >
            {/* "BEFORE" IMAGE: GOLD */}
            <Box
              component="img"
              src="/WebSiteStaticImage/Banner/julian4/productPom1.webp"
              alt="Gold Jewelry Frame"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
            <Typography sx={{ position: 'absolute', top: 16, left: 16, fontSize: '12px', color: '#1c1c1c', zIndex: 3, fontWeight: 500 }}>
              Gold
            </Typography>

            {/* "AFTER" IMAGE LAYER: SILVER (Clipped via Dynamic State) */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                zIndex: 2,
                pointerEvents: 'none'
              }}
            >
              <Box
                component="img"
              src="/WebSiteStaticImage/Banner/julian4/productPom2.webp"
                alt="Silver Jewelry Frame"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <Typography sx={{ position: 'absolute', top: 16, right: 16, fontSize: '12px', color: '#1c1c1c', zIndex: 3, fontWeight: 500 }}>
              Silver
            </Typography>

            {/* SLIDER SEPARATOR LINE */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPosition}%`,
                width: '1px',
                backgroundColor: '#fff',
                zIndex: 4,
                pointerEvents: 'none',
              }}
            />

            {/* CENTER CONTROL DRAG BUTTON */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: `${sliderPosition}%`,
                transform: 'translate(-50%, -50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 1V13" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6 1V13" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 1V13" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Box>
          </Box>

          {/* BASELINE SUB-PRODUCT FOOTER */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Link
              href="/products/rules-were-meant-to-be-broken-ring"
              underline="always"
              sx={{
                color: '#1c1c1c',
                fontSize: '14px',
                fontFamily: '"Playfair Display", serif',
                textDecorationColor: '#1c1c1c',
                flexGrow: 1
              }}
            >
              Meant To Be Broken Ring
            </Link>
            <Typography sx={{ color: '#1c1c1c', fontSize: '14px', fontWeight: 500 }}>
              $280.00
            </Typography>
          </Box>
        </Box>

        {/* RIGHT COLUMN: TEXT FRAME CONTENT EDITORIAL */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Box sx={{ maxWidth: '680px' }} >
            <Typography
              variant="overline"
              sx={{
                fontSize: '11px',
                letterSpacing: '2px',
                fontWeight: 600,
                color: '#1c1c1c',
                display: 'block',
                mb: 2
              }}
            >
              COMPARE
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                fontSize: { xs: '28px', sm: '36px', md: '44px' },
                lineHeight: 1.2,
                color: '#1c1c1c',
                mb: 3
              }}
            >
              Sterling silver or 18K gold vermeil earrings with peridot
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#555',
                mb: 4,
                fontWeight: 300
              }}
            >
              The brand is named after the town her grandma lived. Now based in Bristol, UK, Audrey splits her time between the two countries working directly with over 150 artisans in Kenya
              The brand is named after the town her grandma lived. Now based in Bristol, UK, Audrey splits her time between the two countries working directly with over 150 artisans in Kenya
            </Typography>

            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                color: '#1c1c1c',
                textTransform: 'uppercase',
                borderBottom: '1px solid #1c1c1c',
                pb: 0.5,
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              Discover More
            </Link>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}