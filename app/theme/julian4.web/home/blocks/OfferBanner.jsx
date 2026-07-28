'use client';

import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

export default function SeasonalSavingsBanner() {
  return (
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: '95%', 
        mx: 'auto', 
        my: 4,
        bgcolor: '#DE6B42', // Terracotta orange color matching the image
        color: '#ffffff',
        p: { xs: 4, md: 6 },
        position: 'relative'
      }}
    >
      <Grid container spacing={{ xs: 4, md: 0 }} alignItems="center">
        
        {/* Left Side: Offer Details */}
        <Grid size={{ xs: 12, md: 5.5 }} sx={{ textAlign: 'center' }}>
          <Typography 
            variant="overline" 
            sx={{ 
              letterSpacing: 1.5, 
              fontWeight: 500, 
              fontSize: '0.75rem',
              opacity: 0.9,
              display: 'block',
              mb: 1
            }}
          >
            SPECIAL OFFER
          </Typography>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontFamily: 'Playfair Display, serif', 
              fontWeight: 400, 
              color: '#F4E371', // Light pale yellow accent color
              mb: 1.5
            }}
          >
            Sale 30% OFF
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.7rem', 
              opacity: 0.85,
              display: 'block'
            }}
          >
            *Ends April 12, 2025, 12:00 PST. T&C's Apply
          </Typography>
        </Grid>

        {/* Center Vertical Divider Line */}
        <Grid 
          size={{ xs: false, md: 1 }} 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center',
            alignSelf: 'stretch' 
          }}
        >
          <Box 
            sx={{ 
              width: '1px', 
              bgcolor: 'rgba(255, 255, 255, 0.25)', 
              height: '80%', 
              my: 'auto' 
            }} 
          />
        </Grid>

        {/* Right Side: Event Header & Button */}
        <Grid size={{ xs: 12, md: 5.5 }} sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h3" 
            sx={{ 
              fontFamily: 'Playfair Display, serif', 
              fontWeight: 400,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1
            }}
          >
            Seasonal <i>Savings</i> Event
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.85rem', 
              opacity: 0.9, 
              mb: 3,
              letterSpacing: 0.5
            }}
          >
            Up to 30% Off on Must-Have Styles !
          </Typography>
          
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#ffffff', 
              color: '#111111', 
              px: 4,
              py: 1.5, 
              borderRadius: 0,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              boxShadow: 'none',
              '&:hover': { 
                bgcolor: '#f4f4f4',
                boxShadow: 'none'
              }
            }}
          >
            Shop The Sale
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
}