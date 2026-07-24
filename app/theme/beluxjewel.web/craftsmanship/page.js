"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import "./Craftsmanship.scss";

export default function CraftsmanshipBlock({ assetBase }) {
  return (
    <Box className="craftsmanshipContainer" sx={{ py: { xs: 8, md: 12 } }}>
      {/* Block Header Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 10 } }}>
        <Box className="craftsmanshipHero">
          <Typography
            variant="overline"
            className="craftsmanshipOverline"
            sx={{
              letterSpacing: "0.2em",
              fontWeight: 600,
              fontSize: "0.85rem",
              mb: 1.5,
              display: "block",
            }}
          >
            ARTISTRY & INNOVATION
          </Typography>
          <Typography
            variant="h3"
            className="craftsmanshipTitle"
            sx={{
              fontFamily: "Prata, Playfair Display, serif",
              fontWeight: 400,
              fontSize: { xs: "2rem", md: "2.8rem" },
              lineHeight: 1.3,
              mb: 2,
            }}
          >
            The Art of High Jewelry Craftsmanship
          </Typography>
          <Typography
            variant="body1"
            className="craftsmanshipBody"
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Every custom creation tells a story of unmatched expertise, ethical
            sourcing, and hand-finished precision. Witness the journey from a
            raw design sketch to a masterwork of brilliance.
          </Typography>
        </Box>
      </Container>

      {/* Main Content Grid Sections */}
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 8, md: 12 }}>
          {/* Section 1: The Design / CAD */}
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "320px", sm: "400px", md: "480px" },
                  overflow: "hidden",
                  borderRadius: "1px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                }}
              >
                <Box
                  component="img"
                  src="/WebSiteStaticImage/SimilingRock/static/2.png"
                  alt="Precision CAD Design Sketch"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 1.5s ease",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box sx={{ pl: { md: 4 } }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Box
                    className="craftsmanshipStepBadge"
                    sx={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    1
                  </Box>
                  <Typography
                    variant="overline"
                    className="craftsmanshipOverline"
                    sx={{ letterSpacing: "0.1em", fontWeight: 600 }}
                  >
                    THE CONCEPT & CAD
                  </Typography>
                </Stack>

                <Typography
                  variant="h4"
                  className="craftsmanshipTitle"
                  sx={{
                    fontFamily: "Prata, Playfair Display, serif",
                    fontWeight: 400,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    lineHeight: 1.3,
                    mb: 3,
                  }}
                >
                  Visualizing Dreams into Three Dimensions
                </Typography>
                <Typography
                  variant="body1"
                  className="craftsmanshipBody"
                  sx={{ fontSize: "0.95rem", lineHeight: 1.7, mb: 3 }}
                >
                  Our design process begins with a meticulous sketch detailing
                  dimensions and profiles. Once approved, specialized artisans
                  render the design in hyper-precise CAD (Computer-Aided Design)
                  files, simulating weight, stone fit, and reflections before
                  any precious metal is touched.
                </Typography>
                <Typography
                  variant="body2"
                  className="craftsmanshipBody"
                  sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                >
                  This guarantees absolute transparency and perfect proportion
                  alignment, allowing you to preview your bespoke creation.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Section 2: Wax Modeling & Casting */}
          <Grid
            container
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            direction={{ xs: "column-reverse", md: "row" }}
          >
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box sx={{ pr: { md: 4 } }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Box
                    className="craftsmanshipStepBadge"
                    sx={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    2
                  </Box>
                  <Typography
                    variant="overline"
                    className="craftsmanshipOverline"
                    sx={{ letterSpacing: "0.1em", fontWeight: 600 }}
                  >
                    THE MODEL & CASTING
                  </Typography>
                </Stack>

                <Typography
                  variant="h4"
                  className="craftsmanshipTitle"
                  sx={{
                    fontFamily: "Prata, Playfair Display, serif",
                    fontWeight: 400,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    lineHeight: 1.3,
                    mb: 3,
                  }}
                >
                  Bringing Structure to Precious Metals
                </Typography>
                <Typography
                  variant="body1"
                  className="craftsmanshipBody"
                  sx={{ fontSize: "0.95rem", lineHeight: 1.7, mb: 3 }}
                >
                  The virtual CAD model is materialized into a highly detailed
                  three-dimensional wax print. Our goldsmiths use lost-wax
                  casting methods to inject molten gold, platinum, or custom
                  alloys into the plaster molds, transforming soft waxes into
                  rigid luxury mountings.
                </Typography>
                <Typography
                  variant="body2"
                  className="craftsmanshipBody"
                  sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                >
                  Every setting undergoes rigorous hand-polishing and detailing
                  to ensure seamless structural integrity and smooth inner
                  comfort.
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "320px", sm: "400px", md: "480px" },
                  overflow: "hidden",
                  borderRadius: "1px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                }}
              >
                <Box
                  component="img"
                  src="/WebSiteStaticImage/SimilingRock/static/3.png"
                  alt="Precision Wax Casting & Goldsmithing"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 1.5s ease",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Section 3: Diamond Setting */}
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "320px", sm: "400px", md: "480px" },
                  overflow: "hidden",
                  borderRadius: "1px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                }}
              >
                <Box
                  component="img"
                  src="/WebSiteStaticImage/SimilingRock/static/4.png"
                  alt="Microscopic Diamond Setting"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 1.5s ease",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box sx={{ pl: { md: 4 } }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Box
                    className="craftsmanshipStepBadge"
                    sx={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    3
                  </Box>
                  <Typography
                    variant="overline"
                    className="craftsmanshipOverline"
                    sx={{ letterSpacing: "0.1em", fontWeight: 600 }}
                  >
                    STONE SETTING & FINISH
                  </Typography>
                </Stack>

                <Typography
                  variant="h4"
                  className="craftsmanshipTitle"
                  sx={{
                    fontFamily: "Prata, Playfair Display, serif",
                    fontWeight: 400,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    lineHeight: 1.3,
                    mb: 3,
                  }}
                >
                  Unlocking the Fire and Brilliance
                </Typography>
                <Typography
                  variant="body1"
                  className="craftsmanshipBody"
                  sx={{ fontSize: "0.95rem", lineHeight: 1.7, mb: 3 }}
                >
                  Under high-powered microscopes, master setters individually
                  position and secure diamonds and gems. Pratt-prongs, pavé
                  beads, and bezels are sculpted from gold with surgical
                  accuracy, locking in each stone while allowing optimal light
                  refraction.
                </Typography>
                <Typography
                  variant="body2"
                  className="craftsmanshipBody"
                  sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                >
                  A final multi-stage mirror polish, ultrasonic bath, and
                  structural inspection complete the journey of a true
                  masterpiece.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
