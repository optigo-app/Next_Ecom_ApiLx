"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import "./Css/DiamondType.scss";

const banners = [
  {
    title: "Natural Diamond",
    image: "/WebSiteStaticImage/Banner/julian/diamondType1.jpg",
    href: "/p",
    buttonText: "Shop Now",
    buttonBg: "#FAFAF7",
    buttonColor: "#fff",
  },
  {
    title: "Lab Grown Diamond",
    image: "/WebSiteStaticImage/Banner/julian/diamondType2.jpg",
    href: "/p",
    buttonText: "Shop Now",
    buttonBg: "#FAFAF7",
    buttonColor: "#fff",
  },
];

export default function BannerGrid() {
  return (
    <Container maxWidth="xxl" sx={{}}>
      <Typography
        sx={{
          fontFamily: '"EB Garamond", serif',
          fontSize: { xs: 34, md: 42 },
          fontWeight: 400,
          mt: 5,
          color: "#2C2C2C",

          textAlign: "center",
        }}
      >
        Shop by Diamond Type
      </Typography>

      <Typography
        sx={{
          fontFamily: '"EB Garamond", serif',
          fontSize: { xs: 34, md: 18 },
          fontWeight: 400,

          color: "gray",
          mb: 3,
          textAlign: "center",
        }}
      >
        Every diamond tells a story. Every creation becomes a cherished memory.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          width: "100%",
        }}
      >
        {banners.map((banner) => (
          <Box
            key={banner.title}
            sx={{
              position: "relative",
              width: { xs: "100%", lg: "50%" },
              aspectRatio: { xs: "6 / 5", lg: "auto" },
              minHeight: { lg: "500px" },
              overflow: "hidden",
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={banner.image}
              alt={banner.title}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Dark Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.35), rgba(0,0,0,.05))",
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                px: { xs: 3, md: 6 },
                py: { xs: 3, md: 6 },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: '"EB Garamond", serif',
                  fontSize: {
                    xs: "2rem",
                    md: "3rem",
                  },
                  fontWeight: 400,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                {banner.title}
              </Typography>

              <Button
                className="shopNowBtn"
                component={Link}
                href={banner.href}
                variant="contained"
                sx={{
                  minWidth: 180,
                  height: 46,
                  borderRadius: 0,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                {banner.buttonText}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
