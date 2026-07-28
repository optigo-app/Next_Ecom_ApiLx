"use client";

import React, { useState } from 'react';
import { Box, Typography, Grid, Collapse } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ACCORDION_DATA = [
  {
    id: '01',
    title: 'Make it Forever',
    description: 'Timeless and radiant, our diamond jewelry captures brilliance and elegance, perfect for celebrating life\'s precious moments.',
    img: '/WebSiteStaticImage/Banner/julian4/TopCollection1.webp'
  },
  {
    id: '02',
    title: 'Better Basics Collection',
    description: 'Elevate your look with our exquisite earrings, designed to add sparks, elegance, and timeless beauty to every occasion.',
    img: '/WebSiteStaticImage/Banner/julian4/TopCollection2.webp'
  },
  {
    id: '03',
    title: 'Curated Products',
    description: 'Grace your neckline with our stunning necklaces, crafted to add elegance, sparks, and timeless charm to every moment.',
    img: '/WebSiteStaticImage/Banner/julian4/TopCollection3.webp'
  }
];

export default function AccordionShowcaseSection() {
  // Keeps track of which item is currently hovered/active (defaults to the first item)
  const [activeId, setActiveId] = useState('01');

  return (
    <Box sx={{ width: '100%', py: { xs: 6, md: 12 }, px: { xs: 2, sm: 4, md: 8 }, backgroundColor: '#e2ecd8' }}>
       <Grid 
  container 
  spacing={{ xs: 4, md: 8 }} 
  alignItems="center" 
  sx={{ 
    maxWidth: '1400px', 
    mx: 'auto',
    // Swaps row mode to column stack mode on mobile to enable full item reordering
    flexDirection: { xs: 'column', md: 'row' } 
  }}
>
      
  {/* LEFT COLUMN: TEXT & HOVER ACCORDIONS */}
  <Grid 
    size={{ xs: 12, md: 6 }}
    sx={{
      // On mobile, this grid wraps the inner components which are re-arranged below
      order: { xs: 1, md: 1 }
    }}
  >
    <Box 
      sx={{ 
        maxWidth: '520px',
        // Changes layout box to flex direction on mobile to place image between header and accordions
        display: { xs: 'flex', md: 'block' },
        flexDirection: 'column'
      }}
    >
      {/* HEADER SECTION CONTAINER */}
      <Box sx={{ order: { xs: 1, md: 'unset' } }}>
        <Typography 
          variant="overline" 
          sx={{ 
            fontSize: '13px', 
            letterSpacing: '2px', 
            fontWeight: 600, 
            color: '#1c1c1c', 
            display: 'block', 
            mb: 1 
          }}
        >
          TOP COLLECTIONS
        </Typography>
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontFamily: '"Playfair Display", serif', 
            fontWeight: 400, 
            fontSize: { xs: '32px', sm: '40px', md: '48px' }, 
            lineHeight: 1.2, 
            color: '#1c1c1c', 
            mb: { xs: 0, md: 6 } // Removed margin on mobile since the image will position here
          }}
        >
          Revitalize your skin, <i>refresh your confidence</i>
        </Typography>
      </Box>

      {/* ACCORDION BLOCK LIST CONTAINER */}
      <Box sx={{ order: { xs: 3, md: 'unset' }, mt: { xs: 4, md: 0 } }}>
        {ACCORDION_DATA.map((item) => {
          const isOpen = activeId === item.id;
          
          return (
            <Box
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)} // Touch backup option for mobile devices
              sx={{
                borderTop: '1px solid rgba(28, 28, 28, 0.15)',
                '&:last-of-type': {
                  borderBottom: '1px solid rgba(28, 28, 28, 0.15)',
                },
                py: 2.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Header Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography 
                    sx={{ 
                      fontSize: '13px', 
                      color: '#1c1c1c', 
                      opacity: 0.6, 
                      fontFamily: '"Playfair Display", serif' 
                    }}
                  >
                    {item.id}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Playfair Display", serif', 
                      fontSize: { xs: '18px', md: '21px' }, 
                      fontWeight: 400,
                      color: '#1c1c1c' 
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>

                {/* Icon Circle */}
                <Box
                  sx={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(28, 28, 28, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isOpen ? '#1c1c1c' : 'transparent',
                    color: isOpen ? '#fff' : '#1c1c1c',
                    transition: 'all 0.3s ease',
                    transform: isOpen ? 'rotate(-45deg)' : 'none'
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                </Box>
              </Box>

              {/* Smooth Collapsible Content Body */}
              <Collapse in={isOpen} timeout={400}>
                <Box sx={{ pl: 6, pr: 4, pt: 1.5 }}>
                  <Typography 
                    sx={{ 
                      fontSize: '14px', 
                      lineHeight: 1.6, 
                      color: '#4a5343',
                      fontWeight: 300 
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  </Grid>

  {/* RIGHT COLUMN: DYNAMIC PRELOADED IMAGES */}
  <Grid 
    size={{ xs: 12, md: 6 }}
    sx={{
      // Dynamically slots into position 2 on mobile column structures, moves cleanly back right on desktop views
      order: { xs: 2, md: 2 },
      mt: { xs: 4, md: 0 }
    }}
  >
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        aspectRatio: '1', 
        overflow: 'hidden',
        borderRadius: '2px'
      }}
    >
      {ACCORDION_DATA.map((item) => (
        <Box
          key={item.id}
          component="img"
          src={item.img}
          alt={item.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: activeId === item.id ? 1 : 0,
            visibility: activeId === item.id ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
            transform: activeId === item.id ? 'scale(1)' : 'scale(1.02)'
          }}
        />
      ))}
    </Box>
  </Grid>

</Grid>
    </Box>
  );
}