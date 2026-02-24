import React from 'react'
import { Box, Typography } from '@mui/material'

const ShowCaseBlock = () => {
  return (
    <>
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          height: 340,
          backgroundImage: 'url("https://media.tiffany.com/is/image/tco/67459687_RG_SIO2X1?hei=1204&wid=1204&fmt=webp&op_usm=1%2C2%2C6")',
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