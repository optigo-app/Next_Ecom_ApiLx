"use client";

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AboutUs = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          height: "100svh",
          bgcolor: "#fff",
        },
      }}
    >
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#000", fontWeight: 700 }}>
            About Us
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#000" }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ overflowY: "auto", pb: 6 }}>
        {/* Banner */}
        <Box
          component="img"
          src="/WebSiteStaticImage/images/HomePage/Aboutus/Banner.jpg"
          alt="About Sonasons"
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            mb: 4,
          }}
        />

        <Container maxWidth="sm">
          {/* Our Milieu Section */}
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#1a1a1a" }}>
            Our Milieu
          </Typography>
          <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}>
            We implement a No-Compromise approach on Quality & Excellence, Style | Sparkle | Immortal | Versatile
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#444" }}>
            Incorporated in 2018, today Sonasons is India's prominent diamond merchant operating out of Hong Kong. We are an independent business entity specializing in diamonds and diamond jewellery and are delighted to bring out fine jewellery designs. We implement fair trade with ethical sourcing of diamonds and gemstones. Our connections could be associated with the legacy of "Khodal Gems", established in 1990 under the aegis of Mr. Raghabhai Kaladiya.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#444" }}>
            Starting out in the industry as a rough importer, diamond manufacturer and diamond exporter, subsequently the business flourished as a successful family venture. The company made steady progress with branch offices in Mumbai & Ahmedabad within the decade.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: "#444" }}>
            International operations started with diamond trading activities with full-fledged offices in Bangkok & Hong Kong in the new millennium. It was a perfect time for the millennials to join Mr. Dhaval Kaladiya who has taken up the fresh mantle of Sonasons to provide a young perspective to the heritage bequeathed upon him.
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8, color: "#444" }}>
            Mr. Dhaval Kaladiya is an enterprising individual possessing a sound academic background with a B.Tech degree in Electronics and Communication. Empowered by a MBA from the I.T.M., he has acquired industry experience followed by a special set course from Gemological Institute of America (GIA), Mumbai. After going through the grinds of the trade on the home turf he has started this brand new venture since December 2018.
          </Typography>

          {/* Brand Statement Section */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#1a1a1a" }}>
            Brand Statement
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "#444" }}>
            Maintain highest standards to always remain at the top of the game.
          </Typography>

          {/* Vision Section */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#1a1a1a" }}>
            Vision
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.6, color: "#444" }}>
            We envisage to create a strong foothold in the South East Asian region in the near future by exploring unique and rare gems that serve as innovative, tangible and high-value assets to our customers.
          </Typography>

          {/* Mission Section */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#1a1a1a" }}>
            Mission
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6, color: "#444" }}>
            Maintain a consistent approach in developing value appreciation in terms of service and value and remain persistent with top values of honesty, integrity and customer care.
          </Typography>
        </Container>
      </Box>
    </Drawer>
  );
};

export default AboutUs;
