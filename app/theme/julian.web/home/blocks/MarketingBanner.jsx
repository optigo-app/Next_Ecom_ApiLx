'use client';

import { Box, Button, Typography } from '@mui/material';
 

export default function MarketingBanner() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 370, md: 350 },
        borderRadius: 0,
        overflow: 'hidden',

        backgroundImage:
          `url(/WebSiteStaticImage/Banner/quote.png)`,
          backgroundAttachment: 'fixed',

        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 40%, transparent 100%)',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          pl: { xs: 3, md: 8 },
          maxWidth: 450,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: 22, md: 34 },
              mb: 1,
            }}
          >
            {/* 9KT Fine Gold */}
          </Typography>

          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: 36, md: 60 },
              lineHeight: 1,
            }}
          >
            {/* FREE */}
          </Typography>

          <Typography
            sx={{
              color: '#fff',
              letterSpacing: 2,
              fontSize: { xs: 12, md: 16 },
              mb: 3,
            }}
          >
            {/* 22KT GOLD COIN */}
          </Typography>

          {/* <Button
            variant="contained"
            sx={{
              bgcolor: '#1E4A42',
              borderRadius: 0,
              px: 4,
              py: 1.2,
              textTransform: 'none',

              '&:hover': {
                bgcolor: '#285c53',
              },
            }}
          >
            Shop Now
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
}