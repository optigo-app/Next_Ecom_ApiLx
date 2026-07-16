"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
  Divider,
  Stack,
  styled,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const StoreImageWrapper = styled(Box)(({ theme }) => ({
  width: "75%",
  height: "650px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  borderRadius: "12px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "450px",
    borderRadius: "0px",
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "-8%",
  right: "0",
  width: "42%",
  backgroundColor: "#FFFFFF",
  padding: theme.spacing(6),
  zIndex: 2,
  boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
  boxSizing: "border-box",
  border: "1px solid #eaeaea",
  borderRadius: "12px",
  [theme.breakpoints.down("md")]: {
    position: "relative",
    width: "92%",
    margin: "-80px auto 0",
    bottom: "auto",
    right: "auto",
    padding: theme.spacing(4, 3),
    borderRadius: "12px",
    boxShadow: "0 -10px 30px rgba(0,0,0,0.05)",
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DetailItem = ({ Icon, text }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
    <Icon sx={{ color: "#555555", fontSize: "1.2rem", mt: 0.5 }} />
    <Typography variant="body2">{text}</Typography>
  </Stack>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MaxPhysicalStore() {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 6, md: 10 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Content Stack */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            mt: 4,
          }}
        >
          <StoreImageWrapper>
            <Box
              component="img"
              src="/store.png"
              alt="Luxury Boutique Interior"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 2s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            />
          </StoreImageWrapper>

          <InfoCard>
            <Typography variant="overline" display="block" sx={{ mb: 1.5 }}>
              SURAT, INDIA
            </Typography>
            <Typography variant="h2" sx={{ mb: 3.5 }}>
              Gujarat High Jewelry Studio
            </Typography>

            <Divider sx={{ mb: 4, opacity: 0.6 }} />

            <DetailItem
              Icon={LocationOnOutlinedIcon}
              text="Plot No. A-14 to A-18,
Sunrise Business Park,
Canal Road,
Cocoa, Surat,
Gujarat 395009,
India"
            />

            <DetailItem
              Icon={AccessTimeOutlinedIcon}
              text="Mon - Sun : 11:00 AM to 9:00 PM"
            />

            <DetailItem
              Icon={PhoneOutlinedIcon}
              text={
                <span style={{ fontWeight: 600, color: "#1A1A1A" }}>
                  +91 12346567891
                </span>
              }
            />

            <Box sx={{ mt: 5 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1A1A1A",
                  color: "#FFF",
                  py: 1.8,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#000000",
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                  },
                }}
              >
                PLAN YOUR VISIT
              </Button>
            </Box>
          </InfoCard>
        </Box>
      </Container>
    </Box>
  );
}
