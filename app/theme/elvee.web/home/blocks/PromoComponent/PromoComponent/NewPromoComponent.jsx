'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';

// Change this single value to control section height everywhere
const SECTION_HEIGHT_VH = 80; // was 100 — reduce this to make section shorter

const lookbookSlides = [
  {
    subtitle: 'CONTEMPORARY DESIGNS FOR THE MODERN GENERATION',
    title: <> <span>Nuera</span> <br />   <em style={{fontSize: '28px'}}>Contemporary Elegance, Redefined</em> </>,
    description: 'Nuera embodies modern sophistication through sleek designs, refined craftsmanship, and contemporary aesthetics. Created for those who appreciate understated luxury, the collection features versatile pieces that seamlessly transition from everyday wear to special occasions..',
    imageUrl: '/Collections/collectionbanner1.png',
  },
  {
    subtitle: 'JEWELRY THAT CELEBRATES MEANINGFUL MOMENTS',
    title: <> <span>Promise</span>  <br /> <em style={{fontSize: '28px'}}>Celebrating Love, Commitment, and Meaningful Connections</em></>,
    description: 'Promise is a collection inspired by life s most cherished connections and milestones. Designed with timeless beauty and emotional significance, each piece symbolizes love, commitment, trust, and lasting memories, making it perfect for gifting and celebrating special occasions.',
    imageUrl: '/Collections/collectionbanner2.png',
  },
  {
    subtitle: 'EVERYDAY STYLE WITH EXTRAORDINARY DETAIL',
    title: <> <span>Beyond Basics</span>  <br /> <em style={{fontSize: '28px'}}>Elevated Essentials for Everyday Elegance</em></>,
    description: 'Beyond Basics transforms everyday jewelry into statement-worthy essentials. Featuring modern silhouettes, effortless designs, and exceptional craftsmanship, this collection is created for individuals who seek elegance in their daily style without compromising on comfort or versatility.',
    imageUrl: '/Collections/collectionbanner3.png',
  }
];

export default function SplitStickyShowcase() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const stickyHeight = window.innerHeight * (SECTION_HEIGHT_VH / 100);

      const scrolledIntoSection = -rect.top;
      const totalScrollableDistance = rect.height - stickyHeight;

      if (totalScrollableDistance > 0) {
        const progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollableDistance));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine which slide's text should be visible based on current scroll progress
  const activeIndex = Math.min(
    Math.floor(scrollProgress * lookbookSlides.length),
    lookbookSlides.length - 1
  );

  // The right side images translate up, scaled to SECTION_HEIGHT_VH instead of a hardcoded 100vh/200vh
  const imageTranslationY = scrollProgress * (SECTION_HEIGHT_VH * (lookbookSlides.length - 1));

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        // total scroll room = section height * number of slides
        height: `${SECTION_HEIGHT_VH * lookbookSlides.length}vh`,
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          height: `${SECTION_HEIGHT_VH}vh`,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left Column: Fixed Text Panel with Crossfading Content */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '45%', md: '100%' },
            backgroundColor: '#f7f6f2',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {lookbookSlides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  px: { xs: 4, sm: 8, md: 10, lg: 14 },
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translate3d(0, 0, 0)' : 'translate3d(0, 25px, 0)',
                  visibility: isActive ? 'visible' : 'hidden',
                  transition: 'opacity 0.6s cubic-bezier(0.215, 0.610, 0.355, 1), transform 0.6s cubic-bezier(0.215, 0.610, 0.355, 1)',
                  willChange: 'opacity, transform',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '2.5px',
                    color: '#8a857c',
                    mb: 2,
                  }}
                >
                  {slide.subtitle}
                </Typography>

                <Typography
                  component="h2"
                  sx={{
                    fontFamily: '"Playfair Display", "Georgia", serif',
                    fontSize: { xs: '1.6rem', sm: '2.2rem', lg: '2.6rem' },
                    fontWeight: 700,
                    color: '#1a1a1a',
                    lineHeight: 1.25,
                    mb: 3,
                    '& em': {
                      fontStyle: 'italic',
                    },
                  }}
                >
                  {slide.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    color: '#555555',
                    lineHeight: 1.7,
                    maxWidth: '460px',
                    mb: 4,
                  }}
                >
                  {slide.description}
                </Typography>
 
              </Box>
            );
          })}
        </Box>

        {/* Right Column: Moving Image Track Showcase */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '55%', md: '100%' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: `${SECTION_HEIGHT_VH * lookbookSlides.length}vh`,
              transform: `translate3d(0, -${imageTranslationY}vh, 0)`,
              transition: 'transform 0.4s cubic-bezier(0.1, 0.76, 0.55, 0.94)',
              willChange: 'transform',
            }}
          >
            {lookbookSlides.map((slide, index) => (
              <Box
                key={index}
                sx={{
                  height: `${SECTION_HEIGHT_VH}vh`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={slide.imageUrl}
                  alt="Collection Showcase Asset"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}