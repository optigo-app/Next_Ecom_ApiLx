"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Using Grid v2 which utilizes the 'size' prop

export default function AfterSalesService() {
  const services = [
    {
      title: "Engraving Service",
      image: "/WebSiteStaticImage/Banner/vimalgolddiamond/CustomerService1.png", // Ring image placeholder
      description:
        "Crafting memories that last a lifetime with our precision engraving service. Personalize your moments with intricate details and heartfelt messages. Elevate your cherished possessions with a touch of uniqueness. Unleash the art of engraving – where every mark tells a story, Discover the difference of our dedicated approach to cleaning and services.",
    },
    {
      title: "Cleaning and Polishing",
      image: "/WebSiteStaticImage/Banner/vimalgolddiamond/CustomerService2.png", // Jewelry work placeholder
      description:
        "Elevate your surroundings with our exceptional cleaning and services. Impeccable cleanliness, efficient solutions, and a commitment to excellence define our work. Experience a space that radiates freshness and order, tailored just for you. Unleash the art of engraving – where every mark tells a story, discover the difference of our dedicated approach to cleaning and services.",
    },
    {
      title: "Repair Service",
      image: "/WebSiteStaticImage/Banner/vimalgolddiamond/CustomerService3.png", // Detailed jewelry benchwork placeholder
      description:
        "Your jewel is a precious creation and proper care in its use and handling will preserve its shine over time. If you see any signs of damage, you should refrain from wearing it until you have had it examined at our display office. We will take care of your jewel and broken parts may be repaired to restore the beauty of your jewel. You will receive a quotation once the type of service that needs to be carried out has been assessed. The service will be carried out as quickly as possible, upon your acceptance.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#ffffff", pb: 8 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "30vh", md: "40vh", lg: "50vh" },
          backgroundImage: `url(/WebSiteStaticImage/Banner/vimalgolddiamond/CustomerService.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
      <Container maxWidth="md">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6, px: 2 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            sx={{
              color: "#000000",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              mb: 2,
              mt: 8,
            }}
          >
            After Sales Service
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#555555",
              maxWidth: "650px",
              mx: "auto",
              lineHeight: 1.8,
              fontSize: "0.85rem",
            }}
          >
            Our commitment is to provide you with the highest level of jewelry
            care services. Our experts will be delighted to offer you advice and
            services to personalize your jewels, restore them, or simply
            preserve their beauty and longevity.
          </Typography>
        </Box>

        {/* Dynamic Service Grid Cards Row Layout */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                  background: "#ffffff",
                }}
              >
                {/* Visual Media banner inside card container */}
                <CardMedia
                  component="img"
                  height="260"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    objectFit: "cover",
                    filter: index > 0 ? "grayscale(100%)" : "none", // Matches the original picture's look for item 2 and 3
                  }}
                />

                {/* Text Context layout underneath the image */}
                <CardContent sx={{ textAlign: "center", p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="600"
                    sx={{ color: "#000000", mb: 2, fontSize: "1.05rem" }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555555",
                      lineHeight: 1.7,
                      fontSize: "0.82rem",
                      maxWidth: "820px",
                      mx: "auto",
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
