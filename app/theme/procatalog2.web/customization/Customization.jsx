"use client";

import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Using Grid v2 which utilizes the 'size' prop

export default function Customize() {
  const services = [
    {
      title: "Create New Design",
      image: "/WebSiteStaticImage/Banner/vimalgolddiamond/customizeBanner2.png", // Ring image placeholder
      description: "If you're the creative type and have a design of your own or have seen a method that has inspired you, we will assist you to place your ideas into precious metals and gemstones. Our designers can run through logistics, feasibility, durability, and affordability with you. This is often a really rewarding process that leads to an ingenious piece of fine jewelry of your own design."
    },
    {
      title: "Modify Existing Design",
      image: "/WebSiteStaticImage/Banner/vimalgolddiamond/customizeBanner3.png", // Jewelry work placeholder
      description: "Custom designs are mostly derived from existing jewelry, preferred with a different shape, size, or color stone. Frequently, our customers desire a piece of jewelry that they like, a touch thinner, longer, taller, or favor a special texture or pattern. We often face a challenge in finding ways to make similar jewelry at a price point that meets your budget. No problem, we will make it for you the way that you want it! You may have even found the right design except for its finishes. Simply switching the stone type or employing a different value could also be only enough to satisfy your personal taste."
    },
  
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', pb: 8 }}>
      <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "30vh", md: "40vh", lg: "50vh" },
                backgroundImage: `url(/WebSiteStaticImage/Banner/vimalgolddiamond/customizeBanner1.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
            </Box>
      <Container maxWidth="md">
        
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6, px: 2 ,mt:5}}>
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight="600" 
            sx={{ 
              color: '#000000', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              mb: 2
            }}
          >
            BUILD YOUR OWN UNIQUE DESIGN
          </Typography>
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight="600" 
            sx={{ 
              color: '#000000', 
             
              
              fontSize: { xs: '0.5rem', sm: '0.5rem', md: '1rem' },
              mb: 2
            }}
          >
           TYPES OF DESIGNS
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#555555', 
              maxWidth: '650px', 
              mx: 'auto', 
              lineHeight: 1.8,
              fontSize: '0.85rem'
            }}
          >
           Our designers will work closely with you to help you confidently select the elements in jewelry that reflect your personal style. We take the time to understand your needs before executing your project, ensuring every custom piece is crafted to perfection.
          </Typography>
        </Box>

        {/* Dynamic Service Grid Cards Row Layout */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  background: '#ffffff'
                }}
              >
                {/* Visual Media banner inside card container */}
                <CardMedia
                  component="img"
                  height="260"
                  image={service.image}
                  alt={service.title}
                  sx={{ 
                    objectFit: 'cover',
                    filter: index > 0 ? 'grayscale(100%)' : 'none' // Matches the original picture's look for item 2 and 3
                  }}
                />
                
                {/* Text Context layout underneath the image */}
                <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 4 } }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="600"
                    sx={{ color: '#000000', mb: 2, fontSize: '1.05rem' }}
                  >
                    {service.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#555555', 
                      lineHeight: 1.7, 
                      fontSize: '0.82rem',
                      maxWidth: '820px',
                      mx: 'auto'
                    }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}