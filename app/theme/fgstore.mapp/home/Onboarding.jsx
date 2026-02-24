"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function OnboardingView() {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#e9eef2",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          backgroundImage:
            "url('/onboard.webp')", // place image in public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Glass Overlay */}
        <Box
          sx={{
            position: "absolute",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 20%, rgba(0,0,0,0.05) 70%)",
          }}
        />

        {/* Content */}
        <Grid
          container
          sx={{
            height: "100%",
            position: "relative",
            zIndex: 2,
            px: 3,
            pb: 3,
          }}
        >
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Box width="100%">
              {/* Glass Card */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "24px",
                  backdropFilter: "blur(14px)",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    mb: 1,
                  }}
                >
                  Jewelry as unique as your story
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  Find your perfect gems and elevate your look effortlessly.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: "#fff",
                      color: "#111",
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                      "&:hover": {
                        bgcolor: "#f2f2f2",
                      },
                    }}
                  >
                    Get Started
                  </Button>

                  <IconButton
                    sx={{
                      bgcolor: "#fff",
                      width: 44,
                      height: 44,
                      "&:hover": {
                        bgcolor: "#f2f2f2",
                      },
                    }}
                  >
                    <ArrowForwardIcon sx={{ color: "#111" }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}