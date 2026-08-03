import React from 'react'
import { Box, Typography } from '@mui/material';
import { AppConfig } from '@/app/(core)/constants/AppConfig';
import { activeBrand } from '@/app/env';

// AppConfig.shreediamond.static_block.block1

const ShowCaseBlock = () => {

  const brandConfig = AppConfig[activeBrand] || AppConfig.SonasonsApp;
  const block1 = brandConfig?.static_block?.block1 || "";


  if (activeBrand === "shreediamond") {
    return <>
      <Box sx={{ py: 2 }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: 340,
            backgroundImage: `url(${block1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Soft Luxury Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
            }}
          />

          {/* Content */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
              color: "#fff",
            }}
          >
            {/* Top Tagline */}
            <Typography
              variant="caption"
              sx={{
                letterSpacing: 2,
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              New Collection 2026
            </Typography>

            {/* Main Message */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Crafted to Shine
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  opacity: 0.9,
                  maxWidth: 260,
                }}
              >
                Discover timeless elegance designed for every occasion.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  }

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: 340,
            backgroundImage: `url(${block1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Soft Luxury Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
            }}
          />

          {/* Content */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
              color: "#fff",
            }}
          >
            {/* Top Tagline */}
            <Typography
              variant="caption"
              sx={{
                letterSpacing: 2,
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              New Collection 2026
            </Typography>

            {/* Main Message */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Crafted to Shine
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  opacity: 0.9,
                  maxWidth: 260,
                }}
              >
                Discover timeless elegance designed for every occasion.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ShowCaseBlock