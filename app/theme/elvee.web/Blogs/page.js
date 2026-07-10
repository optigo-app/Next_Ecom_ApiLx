"use client";

import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

const JewelryBlogPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
 
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontFamily: "serif", 
            fontWeight: 700, 
            color: "#1c1c1c",
            mb: 2 
          }}
        >
          The Art of Modern Elegance: Choosing Timeless Jewelry
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: "italic" }}>
          Published on July 10, 2026 • By Luxury Edit
        </Typography>
      </Box>

      {/* 2. Left Side Image, Right Side Text */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
            alt="Fine Diamond Rings"
            sx={{
              width: "100%",
              height: 350,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ fontFamily: "serif", mb: 2, fontWeight: 600 }}>
            Crafting the Perfect Sparkle
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Every diamond tells a story, captured beautifully in the precision of its cut. 
            Modern jewelry design balances classical geometry with contemporary flare, 
            ensuring that piece transitions seamlessly from daily wear to high-end evening events. 
            Investing in brilliant craftsmanship means owning a piece of history that stays radiant for generations.
          </Typography>
        </Grid>
      </Grid>

      {/* 3. Left Side Text, Right Side Image */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Typography variant="h5" sx={{ fontFamily: "serif", mb: 2, fontWeight: 600 }}>
            Sustainable Luxury & Gold Standard
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            True luxury goes beyond aesthetics—it incorporates ethical responsibility. 
            Today's fine jewelry standards focus heavily on sustainably sourced precious metals and conflict-free gemstones. 
            Choosing responsibly crafted 18k gold accents not only elevates your personal style statement but preserves global ecosystem heritage.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
            alt="Gold Luxury Necklaces"
            sx={{
              width: "100%",
              height: 350,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>

      {/* 4. Mini Paragraph (Conclusion / Sign-off) */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          bgcolor: "#f9f6f0", 
          borderRadius: 2, 
          textAlign: "center" 
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "serif", 
            fontStyle: "italic", 
            color: "#4a4a4a",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          "Jewelry is not just an accessory; it's an extension of your personality and a reflection of monumental life moments. Choose pieces that speak directly to your soul."
        </Typography>
      </Paper>
    </Container>
  );
};

export default JewelryBlogPage;