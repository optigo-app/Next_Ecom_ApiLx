'use client';

import React, { useState } from 'react';
import { Box, Typography, Link,   Grid } from '@mui/material';

// --- Interactive Data Source ---
const COLLECTION_TABS = [
  {
    id: 0,
    title: "Earring Gifts",
    image: "/WebSiteStaticImage/Banner/julian4/NewCol1.webp",
    heading: "Reveal your singular shine",
    description: "Surprise someone special with dazzling earrings, beautifully crafted to add timeless beauty, elegance, charm, and sparkle to every cherished moment."
  },
  {
    id: 1,
    title: "Shine Bright",
    image: "/WebSiteStaticImage/Banner/julian4/NewCol2.webp",
    heading: "Jewelry that truly sparkles & glows",
    description: "Radiate confidence with our stunning jewelry, designed to capture light, brilliance, and elegance, making every moment shine even brighter with grace."
  },
  {
    id: 2,
    title: "Classic",
    image: "/WebSiteStaticImage/Banner/julian4/NewCol3.webp",
    heading: "Timeless jewelry design classics",
    description: "From delicate details to bold elegance, our classic jewelry is designed to capture tradition, sophistication, artistry, and everlasting beauty with every piece."
  },
  {
    id: 3,
    title: "Move Rings",
    image: "/WebSiteStaticImage/Banner/julian4/NewCol4.webp",
    heading: "Enduring beauty, charm & grace",
    description: "Experience the beauty of dynamic jewelry with our Move Rings, featuring fluid designs that symbolize love, freedom, passion, creativity, and everlasting elegance."
  }
];

export default function InteractiveCollectionShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const currentContent = COLLECTION_TABS[activeTab];

  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: '#EAE5F3', 
        py: { xs: 6, md: 10 }, 
        px: { xs: 3, md: 6 },
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          
          {/* --- Left Column: Interactive Hover Titles --- */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                letterSpacing: 1.5, 
                color: '#000', 
                fontWeight: 700, 
                fontSize: '1rem',
                display: 'block',
                mb: 5
              }}
            >
              NEW COLLECTIONS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {COLLECTION_TABS.map((tab, i) => {
                const isActive = activeTab === tab.id;
                return (
                    <Typography
                    key={tab.id}
                    onMouseEnter={() => setActiveTab(tab.id)}
                    variant="h3"
                    component="div"
                    sx={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 400,
                      fontSize: { xs: '2.2rem', md: '3rem' },
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'inline-block', // Keeps the underline bounds matching the text width exactly
                      width: 'fit-content',
                      
                      // Smooth color change and subtle transform spacing adjustment
                      color: isActive ? '#111111' : '#111111',
                      transform: isActive ? 'skewX(-8deg)' : 'skewX(0deg)', // Emulates a super smooth italic transition
                      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      
                      '&:hover': {
                        color: '#111111'
                      },
                  
                      // Ultra-smooth custom sliding underline animation
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: '-4px', // Adjust space below text (acts like textUnderlineOffset)
                        width: '100%',
                        height: '1px', // Line thickness
                        backgroundColor: '#111111',
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left center',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }
                    }}
                  >
                    <span>{i + 1}.</span> {tab.title}
                  </Typography>
                );
              })}
            </Box>
          </Grid>

          {/* --- Center Column: Dynamic Display Image --- */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box 
              sx={{ 
                width: '100%', 
                height: { xs: 350, md: 450 }, 
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Image Stack Layering to cross-fade between active tabs smoothly */}
              {COLLECTION_TABS.map((tab) => (
                <Box
                  component="img"
                  key={tab.id}
                  src={tab.image}
                  alt={tab.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    // Smooth structural crossfade opacity 
                    opacity: activeTab === tab.id ? 1 : 0,
                    transform: activeTab === tab.id ? 'scale(1)' : 'scale(1.03)',
                    transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    pointerEvents: activeTab === tab.id ? 'auto' : 'none',
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* --- Right Column: Text Information & Shop Link --- */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ pl: { md: 4 } }}>
            <Box sx={{ position: 'relative', width: '100%', minHeight: 220 }}>
              {COLLECTION_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Box 
                    key={tab.id}
                    sx={{ 
                      position: isActive ? 'relative' : 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                      transition: 'opacity 0.5s ease-in-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      pointerEvents: isActive ? 'auto' : 'none',
                      visibility: isActive ? 'visible' : 'hidden'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      component="h3" 
                      sx={{ 
                        fontFamily: 'Playfair Display, serif', 
                        fontWeight: 400, 
                        color: '#111111',
                        mb: 2,
                        lineHeight: 1.2
                      }}
                    >
                      {tab.heading}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#444444', 
                        fontSize: '0.95rem', 
                        lineHeight: 1.7,
                        mb: 4 
                      }}
                    >
                      {tab.description}
                    </Typography>

                    <Link
                      href="#"
                      underline="always"
                      sx={{
                        color: '#111111',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        textUnderlineOffset: '4px',
                        '&:hover': {
                          color: '#444444'
                        }
                      }}
                    >
                      Shop All Items
                    </Link>
                  </Box>
                );
              })}
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}