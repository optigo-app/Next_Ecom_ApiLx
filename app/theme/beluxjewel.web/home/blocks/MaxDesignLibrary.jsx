"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
} from "@mui/material";
import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import "./DesignLibrary.scss";

export default function MaxDesignLibrary() {
  const { islogin } = useStore();

  return (
    <Box className="designLibContainer" sx={{ py: { xs: 8, md: 12 }, overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          
          {/* Left Column: Promotion Banner Details */}
          <Grid
            item
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box sx={{ pr: { md: 4 } }}>
              <Typography
                variant="overline"
                className="designLibOverline"
                sx={{
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  mb: 2,
                  display: "block",
                }}
              >
                EXCLUSIVE DESIGN LIBRARY
              </Typography>

              <Typography
                variant="h3"
                className="designLibTitle"
                sx={{
                  fontFamily: "Prata, Playfair Display, serif",
                  fontWeight: 400,
                  fontSize: { xs: "2.2rem", md: "2.8rem" },
                  lineHeight: 1.25,
                  mb: 3,
                }}
              >
                Access 10,000+ Exclusive Jewelry Designs
              </Typography>

              <Typography
                variant="body1"
                className="designLibBody"
                sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                {islogin ? (
                  "Welcome to your professional designer space. You now have unrestricted access to search, preview, and download thousands of production-ready print CAD files, high-res marketing images, and custom catalog templates."
                ) : (
                  "Our private design catalog and asset management library is reserved exclusively for registered retail partners. Log in to search, filter, and inspect detailed parameters of our massive B2B design catalogue."
                )}
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                <WorkspacePremiumOutlinedIcon sx={{ color: "#cca182" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                  {islogin
                    ? "✓ Full catalog access unlocked"
                    : "🔒 Log in required for high-res assets & CAD downloads"}
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                component={Link}
                href="/asset-management"
                className="designLibLockButton"
                sx={{
                  py: 1.8,
                  px: 5,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  borderRadius: "0px",
                  transition: "all 0.3s ease",
                  border: "1px solid #1a1a1a",
                  width: { xs: "100%", sm: "auto" },
                  // color:"#cca182"
                }}
              >
                {islogin ? "Explore Catalog" : "Log In to Access"}
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Dynamic Stacked Picture Frame Block */}
          <Grid
            item
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "360px", sm: "450px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Radial Blur Glow */}
              <Box
                sx={{
                  position: "absolute",
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(17,77,110,0.12) 0%, rgba(255,255,255,0) 70%)",
                  filter: "blur(30px)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />

              {/* Card 1: Back Left (Earrings) */}
              <Box
                className="stackedCard backCardLeft"
                sx={{
                  position: "absolute",
                  width: { xs: "160px", sm: "190px" },
                  height: { xs: "220px", sm: "260px" },
                  bgcolor: "#ffffff",
                  border: "1px solid #eaeaea",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                  transform: "rotate(-12deg) translate(-45px, -15px)",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                  filter: !islogin ? "blur(4px)" : "none",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "#fcfcfc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src="/WebSiteStaticImage/category/diamond-style-stud-earrings-for-women.webp"
                    alt="Stud Earrings"
                    sx={{ width: "80%", height: "80%", objectFit: "contain", mixBlendMode: "multiply" }}
                  />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: "#888", textAlign: "center" }}>
                  BJ-E-2051
                </Typography>
              </Box>

              {/* Card 2: Back Right (Bangle) */}
              <Box
                className="stackedCard backCardRight"
                sx={{
                  position: "absolute",
                  width: { xs: "160px", sm: "190px" },
                  height: { xs: "220px", sm: "260px" },
                  bgcolor: "#ffffff",
                  border: "1px solid #eaeaea",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                  transform: "rotate(10deg) translate(45px, 15px)",
                  zIndex: 3,
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                  filter: !islogin ? "blur(4px)" : "none",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "#fcfcfc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src="/WebSiteStaticImage/category/Bangal.webp"
                    alt="Rose Gold Bangle"
                    sx={{ width: "80%", height: "80%", objectFit: "contain", mixBlendMode: "multiply" }}
                  />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: "#888", textAlign: "center" }}>
                  BJ-B-4081
                </Typography>
              </Box>

              {/* Card 3: Center Front (Solitaire Ring) */}
              <Box
                className="stackedCard frontCard"
                sx={{
                  position: "absolute",
                  width: { xs: "180px", sm: "210px" },
                  height: { xs: "240px", sm: "280px" },
                  bgcolor: "#ffffff",
                  boxShadow: "0 15px 45px rgba(0,0,0,0.12)",
                  transform: "rotate(-2deg)",
                  zIndex: 4,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  filter: !islogin ? "blur(3px)" : "none",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "#f9fbfd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src="/WebSiteStaticImage/category/ring.webp"
                    alt="Solitaire Ring"
                    sx={{ width: "85%", height: "85%", objectFit: "contain", mixBlendMode: "multiply" }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: 1.5,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    textAlign: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  10,000+ Master CADs
                </Typography>
              </Box>

              {/* Overlay Lock Banner (only when NOT logged in) */}
              {!islogin && (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 5,
                    bgcolor: "rgba(17, 77, 110, 0.95)",
                    backdropFilter: "blur(2px)",
                    color: "#ffffff",
                    px: 3,
                    py: 1.5,
                    borderRadius: "4px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    transform: "rotate(-5deg)",
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: "1.1rem" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    Access Restricted
                  </Typography>
                </Box>
              )}

              {/* Floating Badges */}
              {/* Badge 1: Design volume */}
              <Box
                sx={{
                  position: "absolute",
                  top: "20px",
                  left: { xs: "10px", sm: "30px" },
                  zIndex: 5,
                  bgcolor: "#cca182",
                  color: "#ffffff",
                  px: 2,
                  py: 0.8,
                  borderRadius: "50px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  transform: "rotate(-6deg)",
                  pointerEvents: "none",
                }}
              >
                ✨ 10,000+ DESIGNS
              </Box>

              {/* Badge 2: Premium features */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "30px",
                  right: { xs: "10px", sm: "30px" },
                  zIndex: 5,
                  bgcolor: "#ffffff",
                  color: "#1a1a1a",
                  border: "1px solid #1a1a1a",
                  px: 2,
                  py: 0.8,
                  borderRadius: "50px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  transform: "rotate(6deg)",
                  pointerEvents: "none",
                }}
              >
                💎 PRINT-READY CAD
              </Box>

              {/* Sparkle SVG 1 */}
              <Box
                className="sparkleFloat"
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: { xs: "20px", sm: "60px" },
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" fill="#cca182" />
                </svg>
              </Box>

              {/* Sparkle SVG 2 */}
              <Box
                className="sparkleFloatSlow"
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: { xs: "20px", sm: "60px" },
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" fill="#B8933A" />
                </svg>
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
