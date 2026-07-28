"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';

// Content structure from your reference image
const MARQUEE_ITEMS = [
  { text: 'Fast Delivery', italic: false },
  { text: 'Secure Payment', italic: true },
  { text: 'Free shipping', italic: false },
  { text: '7 Days Free Returns', italic: true },
];

export default function AutoMarquee() {
  // We duplicate the items to ensure a seamless infinite looping gapless bridge
  const doubleItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: '#fff', // Change color if needed to match theme base
        py: 3,
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}
    >
      {/* Global CSS Injector Rule for Infinite Horizontal Scrolling */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.333%, 0, 0); }
          }
        `}
      </style>

      {/* Track Wrapper */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          animation: 'marquee 25s linear infinite',
          cursor: 'pointer',
          // Pauses the entire frame cleanly on mouse hover interactions
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {doubleItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 4, // Horizontal separation distance between elements
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '20px', md: '40px' },
                color: '#000',
                fontWeight: 500,
                fontStyle: item.italic ? 'italic' : 'normal',
                letterSpacing: '0.5px',
              }}
            >
              {item.text}
            </Typography>

            {/* Separator dash string match */}
            <Typography
              sx={{
                color: '#1c1c1c',
                opacity: 0.4,
                ml: 8, // Controls spacing right before the next item starts
                fontSize: { xs: '18px', md: '22px' },
                fontWeight: 300,
              }}
            >
              —
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}