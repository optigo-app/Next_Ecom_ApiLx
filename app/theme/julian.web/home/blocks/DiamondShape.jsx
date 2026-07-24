 
'use client';

import { Box, Container, Typography } from '@mui/material';
const shapes = [
    { name: 'Oval', image: '/WebSiteStaticImage/DiamondShape/oval.webp' },
    { name: 'Round', image: '/WebSiteStaticImage/DiamondShape/round.webp' },
    { name: 'Emerald', image: '/WebSiteStaticImage/DiamondShape/emerald.webp' },
    { name: 'Marquise', image: '/WebSiteStaticImage/DiamondShape/marquise.webp' },
    { name: 'Radiant', image: '/WebSiteStaticImage/DiamondShape/radient.webp' },
    { name: 'Pear', image: '/WebSiteStaticImage/DiamondShape/pear.webp' },
    { name: 'Elongated Cushion', image: '/WebSiteStaticImage/DiamondShape/Elongated_Cushion.webp' },
    { name: 'Cushion', image: '/WebSiteStaticImage/DiamondShape/Cushion.webp' },
    { name: 'Princess', image: '/WebSiteStaticImage/DiamondShape/Princess.webp' },
    { name: 'Asscher', image: '/WebSiteStaticImage/DiamondShape/Asscher.webp' },
  ];

export default function ShopByShape() {
  return (
   <div  id="diamondShape">

<Container maxWidth="xl" sx={{ py: { xs: 3, md: 8 } }}>
                      
                     
            
                   <Typography
                               sx={{
                                 fontFamily: '"EB Garamond", serif',
                                 fontSize: { xs: 34, md: 42 },
                                 fontWeight: 400,
                                 mt :2,
                                 color: '#2C2C2C',
                                
                                 textAlign: 'center',
                               }}
                             >
                           Shop by Diamond Shape
                             </Typography>
         
                             <Typography
                               sx={{
                                 fontFamily: '"EB Garamond", serif',
                                 fontSize: { xs: 34, md: 18 },
                                 fontWeight: 400,
                         
                                 color: 'gray',
                                 mb: 3,
                                 textAlign: 'center',
                               }}
                             >
                           From classic rounds to contemporary silhouettes, find the shape that reflects your style.
                             </Typography>
      <Box
        sx={{
          maxWidth: 1444,
          mx: 'auto',
          bgcolor: '#F9F9F9',
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 6 },
        }}
      >
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            gap: { xs: 4, lg: 8 },
          }}
        >
          {/* Left Side
          <Box
            sx={{
              width: { xs: '100%', lg: 385 },
              minWidth: { lg: 385 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
           

            <Box
              component="img"
              src={main?.src}
              alt="Oval Diamond Ring"
              sx={{
                width: '100%',
                maxWidth: 320,
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box> */}

          {/* Right Side */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2,1fr)',
                  sm: 'repeat(3,1fr)',
                  md: 'repeat(5,1fr)',
                },
                rowGap: 5,
                columnGap: 3,
              }}
            >
              {shapes.map((shape) => (
                <Box
                  key={shape.name}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    pb: 1,
                    borderBottom: '2px solid transparent',
                    transition: 'all .3s ease',
                    '&:hover': {
                      borderBottomColor: '#2C2C2C',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={shape.image}
                    alt={shape.name}
                    sx={{
                      width: 72,
                      height: 72,
                      objectFit: 'contain',
                      mixBlendMode: 'multiply',
                      transition: '.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 16,
                      color: '#2C2C2C',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {shape.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
   </div>
  );
}