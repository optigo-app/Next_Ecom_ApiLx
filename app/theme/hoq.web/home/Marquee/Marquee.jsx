'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

const marqueeItems = [
  { id: 1, type: 'text', content: 'STACK YOUR WAY' },
  { id: 2, type: 'image', url: '/WebSiteStaticImage/Banner/julian/marquee1.jpg' },
  { id: 3, type: 'text', content: 'NEW ARRIVALS' },
  { id: 4, type: 'image', url: '/WebSiteStaticImage/Banner/julian/marquee2.webp' },
  { id: 5, type: 'text', content: 'TIMELESS PIECES' },
  { id: 6, type: 'image', url: '/WebSiteStaticImage/Banner/julian/marquee3.webp' },
];

export default function InfiniteMarquee() {
  // Duplicate array content to create a seamless pixel-perfect infinite loop tail
  const extendedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        py: { xs: 4, md: 8 },
        borderTop: '1px solid #f0f0f0',
        // borderBottom: '1px solid #f0f0f0',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        // Pauses the entire marquee animation timeline on hover safely
        '&:hover .marquee-track': {
          animationPlayState: 'paused',
        },
        // Injecting global luxury keyframes via theme rules
        '@keyframes continuousScroll': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-33.3333%)',
          },
        },
      }}
    >
      <Box
        className="marquee-track"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 4, md: 8 },
          whiteSpace: 'nowrap',
          width: 'max-content',
          willChange: 'transform',
          animation: 'continuousScroll 25s linear infinite',
        }}
      >
        {extendedItems.map((item, index) => (
          <Box
            key={`${item.id}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {item.type === 'text' ? (
              <Box 
                sx={{ 
                  position: 'relative', 
                  display: 'inline-block',
           
                  // Triggers the underline reveal on individual text hover
                  '&:hover .marquee-underline': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'bottom left',
                  }
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: '"Playfair Display", "Georgia", serif',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 600,
                    color: '#1a1a1a',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.content}
                </Typography>
                
                {/* Dynamic Animated Underline */}
                <Box 
                  className="marquee-underline"
                  sx={{ 
                    position: 'absolute', 
                    bottom: -2, 
                    left: 0, 
                    width: '100%', 
                    height: '2px', // Made slightly thicker for clearer premium visibility
                    backgroundColor: '#1a1a1a',
                    transform: 'scaleX(0)', // Hidden by default
                    transformOrigin: 'bottom right', // Retracts to the right on unhover
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)', // Smooth architectural ease
                    willChange: 'transform',
                  }} 
                />
              </Box>
            ) : (
              /* Stadium / Pill Shaped Image Crop Box */
              <Box
                sx={{
                  width: { xs: '110px', sm: '160px', md: '220px' },
                  height: { xs: '60px', sm: '90px', md: '108px' },
                  borderRadius: '200px', 
                  overflow: 'hidden',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: { xs: 1, md: 2 } // Clean margin spacing additions between images and texts
                }}
              >
                <Box
                  component="img"
                  src={item.url}
                  alt="Jewelry Showcase"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}