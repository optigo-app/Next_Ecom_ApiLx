'use client';

import React from 'react';
import { Box, Typography,   Grid } from '@mui/material';

// --- Mock Data for Testimonials/Quotes ---
const TESTIMONIALS = [
  {
    id: 1,
    logoUrl: 'https://cdn.shopify.com/s/files/1/0574/7743/1460/files/parker_co.png?v=1710000000', // Placeholder logo url
    logoText: 'Parker &Co.', 
    quote: '“Delivery were very fast. It fits really well and the quality is really good. I’m absolutely delighted with the shirt!”'
  },
  {
    id: 2,
    logoUrl: 'https://cdn.shopify.com/s/files/1/0574/7743/1460/files/the_hayden.png?v=1710000000', 
    logoText: 'THE HAYDEN',
    subText: 'PURPOSE FUELS PASSION',
    quote: '“Arrived faster than expected! The necklace is stunning, and the quality is exceptional. I’m so in love with it!”'
  },
  {
    id: 3,
    logoUrl: 'https://cdn.shopify.com/s/files/1/0574/7743/1460/files/good_mood.png?v=1710000000',
    logoText: 'GOOD MOOD',
    subText: 'COLLECTION',
    quote: '“Fast delivery! The earrings are gorgeous, lightweight, and feel premium. I’m thrilled with how they look!”'
  }
];

export default function QuoteOfTheWeek() {
  return (
    <Box sx={{ width: '100%',   mx: 'auto', pt: 2, pb: 4, px: 3, bgcolor: '#ffffff' }}>
      
      {/* Section Title */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          fontFamily: 'Playfair Display, serif', 
          fontWeight: 400, 
          textAlign: 'center', 
          mb: 6,
          color: '#111111'
        }}
      >
        Quote of the week
      </Typography>

      {/* Grid Container for Quotes */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        {TESTIMONIALS.map((item) => (
          <Grid 
            key={item.id} 
            size={{ xs: 12, md: 4 }} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              px: { xs: 2, md: 3 }
            }}
          >
            {/* Logo Wrapper Container */}
            <Box 
              sx={{ 
                height: 60, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 3 
              }}
            >
            
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: item.id === 2 ? 'sans-serif' : 'serif', 
                  fontWeight: 'bold', 
                  letterSpacing: item.id === 2 ? 2 : 0,
                  lineHeight: 1.1,
                  fontSize: '1.25rem',
                  color: '#111111'
                }}
              >
                {item.logoText}
              </Typography>
              {item.subText && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.55rem', 
                    letterSpacing: 1, 
                    color: '#666', 
                    mt: 0.5,
                    fontWeight: 500
                  }}
                >
                  {item.subText}
                </Typography>
              )}
            </Box>

            {/* Quote Body Text */}
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'sans-serif',
                fontSize: '0.875rem', 
                color: '#333333', 
                lineHeight: 1.6,
                maxWidth: 320
              }}
            >
              {item.quote}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Underline Separator line across the bottom */}
      <Box sx={{ width: '100%', borderBottom: '1px solid #eaeaea', mt: 4 }} />
      
    </Box>
  );
}