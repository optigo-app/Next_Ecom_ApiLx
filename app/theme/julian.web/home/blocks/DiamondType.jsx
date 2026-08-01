"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import "./Css/DiamondType.scss";

const banners = [
  {
    title: "Natural Diamond",
    image: "/WebSiteStaticImage/Banner/julian/diamondType1.jpg",
    description:"A natural diamond is formed deep within the Earth's mantle under intense heat and pressure over billions of years. Volcanic activity eventually brings these diamonds closer to the Earth's surface, where they are mined. Every natural diamond is unique. Its journey from deep within the Earth to becoming part of a beautifully crafted piece of jewellery makes it one of nature's rarest creations. For many buyers, this natural origin adds emotional and symbolic value that goes beyond appearance.",
    href: "/p",
    buttonText: "Shop Now",
    buttonBg: "#FAFAF7",
    buttonColor: "#fff",
  },
  {
    title: "Lab Grown Diamond",
    image: "/WebSiteStaticImage/Banner/julian/diamondType2.jpg",
    description:"A lab-grown diamond is created in a controlled laboratory using advanced technology that replicates the natural diamond-growing process. These diamonds have the same chemical composition, crystal structure, and physical properties as natural diamonds. They are not imitation stones like cubic zirconia or moissanite. Because they are produced in a laboratory rather than mined, they are generally available at a lower price.",
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
        {/* Shop by Diamond Type */}
        Natural vs Lab-Grown 
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
                  "rgb(41 35 35 / 29%)",
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                 
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
                    md: "4rem",
                  },
                  fontWeight: 400,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                {banner.title}
              </Typography>

              <Typography
                className="Discription"
                
                variant="contained"
                sx={{
                  fontSize: "1.2rem",
                  borderRadius: 0,
                  textTransform: "none",
                  boxShadow: "none",
                  color: "#fff",
                }}
              >
                {banner.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
