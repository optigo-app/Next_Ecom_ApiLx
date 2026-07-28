"use client";

import React, { useEffect } from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";


// Set to 0 to show Sonasons, 1 to show Vimal Gold & Diamond
const aboutMode = 1;

const AboutUs = () => {
 

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Premium Theme Constants
  const goldAccent = "#B89569";
  const darkText = "#1A1A1A";
  const mutedText = "#555555";
  const cardBg = "#FDFCFB";

  return (
    <Box sx={{ width: "100%", bgcolor: "#FFFFFF", overflowX: "hidden" }}>
      {/* Hero Banner Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "30vh", md: "40vh", lg: "50vh" },
          backgroundImage: `url(/WebSiteStaticImage/Banner/vimalgolddiamond/aboutusBanner1.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="overline"
            sx={{
              color: goldAccent,
              letterSpacing: 4,
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "uppercase",
            }}
          >
            Discover Our Legacy
          </Typography>
          <Typography
            variant="h2"
            sx={{
              mt: 2,
              fontFamily: "'Playfair Display', serif",
              color: darkText,
              fontWeight: 400,
              letterSpacing: 1,
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}
          >
            About Us
          </Typography>
          <Box sx={{ width: "60px", height: "2px", bgcolor: goldAccent, mx: "auto", mt: 4 }} />
        </Box>

        
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 8, md: 14 } }}>

            {/* Our Story (Editorial Block) */}
            <Grid container spacing={6} alignItems="center">
              <Grid item size={ { xs: 12, md: 5 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 500,
                    color: darkText,
                    mb: 3,
                  }}
                >
                  Our Story
                </Typography>
                <Box sx={{ width: "40px", height: "2px", bgcolor: goldAccent, mb: 4 }} />
              </Grid>
              <Grid item size={ { xs: 12, md: 7 }}>
                <Typography variant="body1" sx={{ color: mutedText, lineHeight: 1.9, fontSize: "1.1rem", mb: 3 }}>
                  For over 26 years, {aboutMode === 0 ? "Sonasons" : "Vimal Gold & Diamond"} has been a name synonymous with trust,
                  craftsmanship, and timeless elegance. What began as a passion for fine jewellery has
                  grown into a legacy of creating exquisite pieces that celebrate life’s most meaningful
                  moments.
                </Typography>
                <Typography variant="body1" sx={{ color: mutedText, lineHeight: 1.9, fontSize: "1.1rem" }}>
                  Rooted in tradition yet inspired by modern design, our journey has always been guided
                  by one simple belief — <i>jewellery is not just an ornament, but an emotion</i>. Every piece
                  we create carries a story of heritage, artistry, and dedication, crafted to be
                  cherished for generations.
                </Typography>
              </Grid>
            </Grid>

            {/* What Makes Us Special (Cards Grid) */}
            <Box>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h3"
                  sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: darkText, mb: 2 }}
                >
                  What Makes Us Special
                </Typography>
                <Typography variant="body1" sx={{ color: mutedText, fontSize: "1.1rem" }}>
                  At {aboutMode === 0 ? "Sonasons" : "Vimal Gold & Diamond"}, we go beyond jewellery — we create experiences.
                </Typography>
              </Box>

              <Grid container spacing={4} justifyContent="center">
                {[
                  { title: "Unmatched Craftsmanship", desc: "Every design is carefully handcrafted with attention to the finest details." },
                  { title: "Premium Materials", desc: "We use ethically sourced diamonds and high-quality gold to ensure brilliance." },
                  { title: "Exclusive Designs", desc: "From timeless classics to contemporary styles, each piece uniquely designed." },
                  { title: "Customer-Centric", desc: "We believe in building lifelong relationships, offering personalized service." },
                  { title: "Luxury with Trust", desc: "Transparency, authenticity, and quality are at the heart of everything we do." },
                ].map((item, idx) => (
                  <Grid item size={ { xs: 12, sm: 6, md: 4 }} key={idx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: "100%",
                        bgcolor: cardBg,
                        borderTop: `3px solid ${goldAccent}`,
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: darkText, mb: 2, fontFamily: "'Playfair Display', serif" }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: mutedText, lineHeight: 1.8, fontSize: "0.95rem" }}>
                        {item.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Our Collections (List Style) */}
            <Box sx={{ bgcolor: "#F9F9F9", p: { xs: 4, md: 8 }, borderRadius: 2 }}>
              <Grid container spacing={6} alignItems="center">
                <Grid item size={ { xs: 12, md: 4 }}>
                  <Typography variant="overline" sx={{ color: goldAccent, letterSpacing: 2, fontWeight: 600 }}>DISCOVER</Typography>
                  <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: darkText, mt: 1, mb: 3 }}>
                    Our Collections
                  </Typography>
                  <Typography variant="body1" sx={{ color: mutedText, lineHeight: 1.8 }}>
                    We offer a wide range of jewellery crafted to suit every occasion and style. Find the perfect statement piece for your next unforgettable moment.
                  </Typography>
                </Grid>
                <Grid item size={ { xs: 12, md: 8 }}>
                  <Grid container spacing={4}>
                    {[
                      { title: "Bridal Jewellery", desc: "Statement pieces designed to make your special day unforgettable." },
                      { title: "Daily Wear Jewellery", desc: "Elegant and lightweight designs perfect for everyday sophistication." },
                      { title: "Polki Jewellery", desc: "Traditional artistry with a royal touch, inspired by heritage designs." },
                      { title: "Diamond Jewellery", desc: "Modern brilliance with timeless appeal." },
                      { title: "Gold Jewellery", desc: "Classic and contemporary designs crafted in pure gold." },
                    ].map((item, idx) => (
                      <Grid item size={ { xs: 12, sm: 6 }} key={idx}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ width: "24px", height: "24px", border: `1px solid ${goldAccent}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.5 }}>
                            <Box sx={{ width: "8px", height: "8px", bgcolor: goldAccent, borderRadius: "50%" }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText, fontSize: "1.1rem", mb: 0.5 }}>{item.title}</Typography>
                            <Typography variant="body2" sx={{ color: mutedText, lineHeight: 1.6 }}>{item.desc}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            {/* Mission & Vision (Side by Side) */}
            <Grid container spacing={4}>
              <Grid item size={ { xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ height: '100%', p: { xs: 4, md: 6 }, bgcolor: cardBg, border: "1px solid #EAEAEA" }}>
                  <Typography variant="overline" sx={{ color: goldAccent, letterSpacing: 2, fontWeight: 600 }}>PURPOSE</Typography>
                  <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: darkText, mt: 1, mb: 3 }}>
                    Our Mission
                  </Typography>
                  <Typography variant="body1" sx={{ color: mutedText, lineHeight: 1.9, fontSize: "1.05rem" }}>
                    To craft exceptional jewellery that celebrates individuality, enhances beauty,
                    and creates lasting emotional value for our customers.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item size={ { xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ height: '100%', p: { xs: 4, md: 6 }, bgcolor: darkText, color: "#fff" }}>
                  <Typography variant="overline" sx={{ color: goldAccent, letterSpacing: 2, fontWeight: 600 }}>FUTURE</Typography>
                  <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#fff", mt: 1, mb: 3 }}>
                    Our Vision
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#E0E0E0", lineHeight: 1.9, fontSize: "1.05rem" }}>
                    To be a trusted and leading name in fine jewellery, known for innovation, quality, and timeless design —
                    while preserving the artistry and heritage of jewellery making.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Legacy & Certifications */}
            <Box>
              <Grid container spacing={6}>
                <Grid item size={ { xs: 12, md: 6 }}>
                  <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: darkText, mb: 3 }}>
                    Our Legacy & Experience
                  </Typography>
                  <Typography variant="body1" sx={{ color: mutedText, lineHeight: 1.9, fontSize: "1.05rem" }}>
                    With over 26 years of experience, we have built a strong foundation of trust and
                    excellence. Our expertise allows us to consistently deliver jewellery that meets
                    the highest standards of quality and design.
                  </Typography>
                </Grid>
                <Grid item size={ { xs: 12, md: 6 }}>
                  <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: darkText, mb: 3 }}>
                    Certifications & Assurance
                  </Typography>
                  <Typography variant="body1" sx={{ color: mutedText, lineHeight: 1.9, mb: 3, fontSize: "1.05rem" }}>
                    We are committed to authenticity and quality:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      "IDT Certified Jewellery",
                      "Strict quality checks at every stage of production",
                      "Assurance of genuine materials and craftsmanship"
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: '12px', height: '1px', bgcolor: goldAccent }} />
                        <Typography variant="body1" sx={{ color: darkText, fontSize: "1.05rem", fontWeight: 500 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Promise Statement */}
            <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 500,
                  color: darkText,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  mb: 4
                }}
              >
                A Promise You Can Wear
              </Typography>
              <Typography variant="body1" sx={{ color: mutedText, lineHeight: 2, maxWidth: "700px", mx: "auto", fontSize: "1.15rem" }}>
                At {aboutMode === 0 ? "Sonasons" : "Vimal Gold & Diamond"}, every piece is more than jewellery — it is a promise of quality,
                elegance, and trust. A promise that stays with you, forever.
              </Typography>
            </Box>

          </Box>
         
      </Container>
    </Box>
  );
};

export default AboutUs;




 