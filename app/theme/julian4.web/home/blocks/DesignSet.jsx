'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  FormControl,
  Grid 
} from '@mui/material';

// --- Mock Data ---
const PRODUCTS = [
  {
    id: 1,
    name: "Let's Do It Earrings",
    price: 105.00,
    originalPrice: 120.00,
    options: ['Gold', 'Silver', 'Rose Gold'],
    initialValue: 'Gold',
    image: 'https://zest-laura.myshopify.com/cdn/shop/files/screw-it-lets-do-it-earrings-sp23-21-ea-ssrh-ns-577982.jpg?v=1711532925&width=100', // Replace with your asset path
    hotspot: { top: '21%', left: '31%' } 
  },
  {
    id: 2,
    name: "We'll Run Forever Ring",
    price: 1050.00,
    originalPrice: null,
    options: ['Diamond / 5', 'Diamond / 6', 'Diamond / 7'],
    initialValue: 'Diamond / 5',
    image: 'https://zest-laura.myshopify.com/cdn/shop/files/take-my-hand-well-run-forever-ring-sp23-13-rg-14kyg-di-s5-279639.jpg?v=1711532809&width=100', // Replace with your asset path
    hotspot: { top: '16%', left: '80%' }
  },
  {
    id: 3,
    name: "Won't Forget Necklace",
    price: 145.00,
    originalPrice: null,
    options: ['Gold', 'Silver'],
    initialValue: 'Gold',
    image: 'http://zest-laura.myshopify.com/cdn/shop/files/so-we-wont-forget-necklace-sp23-22-nc-ssyg-ns-262930.jpg?v=1711592473&width=100', // Replace with your asset path
    hotspot: { top: '88%', left: '53%' }
  }
];

export default function ValentineMatchingBundle() {
  const [activeId, setActiveId] = useState(null);
  const [selections, setSelections] = useState(
    PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p.initialValue }), {})
  );

  const handleSelectChange = (id, value) => {
    setSelections(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 4, bgcolor: '#ffffff',mt: 4, }}>
      <Grid container spacing={6} alignItems="center">
        
        {/* --- Left Column: Product Details --- */}
        <Grid size={{ xs: 12, md: 5.5 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, color: '#777', fontWeight: 500, fontSize: '0.75rem' }}>
            PRODUCT BUNDLE
          </Typography>
          <Typography variant="h3" component="h2" sx={{ fontFamily: 'Playfair Display, serif', mt: 0.5, mb: 4, fontWeight: 400, color: '#111' }}>
            Valentine <i>Matching</i>
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
            {PRODUCTS.map((product, index) => {
              const isHovered = activeId === product.id;
              return (
                <Box key={product.id}>
                  {/* Item Row Wrapper */}
                  <Box
                    onMouseEnter={() => setActiveId(product.id)}
                    onMouseLeave={() => setActiveId(null)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 3,
                      px: 1,
                      backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Small Left ID Counter */}
                    <Typography variant="caption" sx={{  height: 30, minWidth: 30,display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.75rem',bgcolor: '#f7f2ef', p: 1, borderRadius: "50%",mr: 2 }}>
                      {product.id}
                    </Typography>

                    {/* Product Image Thumbnail */}
                    <Box 
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ width: 70, height: 70, objectFit: 'cover', bgcolor: '#f4f4f4', mr: 3 }}
                    />

                    {/* Details: Title & Dropdown selector */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 400, color: isHovered ? '#000' : '#444', transition: 'color 0.2s' }}>
                        {product.name}
                      </Typography>
                      
                      <FormControl size="small" variant="standard" sx={{ mt: 0.5 }}>
                        <Select
                          value={selections[product.id]}
                          onChange={(e) => handleSelectChange(product.id, e.target.value)}
                          sx={{ 
                            fontSize: '0.8rem', 
                            color: '#777',
                            '&:before': { borderBottom: 'none' },
                            '&:after': { borderBottom: 'none' },
                            '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                          }}
                        >
                          {product.options.map((opt) => (
                            <MenuItem key={opt} value={opt} sx={{ fontSize: '0.8rem' }}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Pricing Display */}
                    <Box sx={{ textAlign: 'right', pl: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" sx={{ fontWeight: 400, color: isHovered ? '#000' : '#666' }}>
                          ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                        {product.originalPrice && (
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#aaa' }}>
                            ${product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Horizontal Border Separator between elements */}
                  {index < PRODUCTS.length - 1 && (
                    <Box sx={{ borderBottom: '1px solid #eee', mx: 1 }} />
                  )}
                </Box>
              );
            })}
          </Box>

          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              bgcolor: '#1c1c1c', 
              color: '#fff', 
              py: 2, 
              borderRadius: 0,
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              '&:hover': { bgcolor: '#333' }
            }}
          >
            Add All To Cart
          </Button>
        </Grid>

        {/* --- Right Column: Image with Hotspots --- */}
        <Grid size={{ xs: 12, md: 6.5 }}>
          <Box sx={{ position: 'relative', width: '100%', height: 'auto', display: 'block' }}>
            <Box 
              component="img"
              src="https://zest-laura.myshopify.com/cdn/shop/files/product-bundle.webp?v=1740972536&width=1500" 
              alt="Valentine Collection Model"
              sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: 0 }}
            />

            {/* Hotspot overlays */}
            {PRODUCTS.map((product) => {
              const isHovered = activeId === product.id;
              
              // In the reference image, point 1 is dark, points 2 and 3 are light.
              // They shift design layout configurations when highlighted.
              const isInitiallyDark = product.id === 0; 
              
              return (
                <Box
                  key={product.id}
                  onMouseEnter={() => setActiveId(product.id)}
                  onMouseLeave={() => setActiveId(null)}
                  sx={{
                    position: 'absolute',
                    top: product.hotspot.top,
                    left: product.hotspot.left,
                    transform: 'translate(-50%, -50%)',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    // Background toggles base layout dynamically
                    bgcolor: isHovered 
                      ? (isInitiallyDark ? '#fff' : '#111') 
                      : (isInitiallyDark ? '#111' : '#fff'),
                    color: isHovered 
                      ? (isInitiallyDark ? '#111' : '#fff') 
                      : (isInitiallyDark ? '#fff' : '#111'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    border: isHovered 
                      ? (isInitiallyDark ? '1px solid #111' : '1px solid #fff') 
                      : '1px solid transparent',
                  }}
                >
                  {product.id}
                </Box>
              );
            })}
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
}