"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import "./PhysicalStore.scss";

export default function MaxPhysicalStore() {
  const router = useNextRouterLikeRR();
  return (
    <Box
      className="physicalStoreContainer"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Box>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* Left Column: Image */}
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
                height: { xs: "350px", sm: "450px", md: "720px" },
                overflow: "hidden",
                borderRadius: "1px", // Minimalist sharp edges like Brilliant Earth
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              }}
            >
              <Box
                component="img"
                src="/store.png"
                alt="Luxury Boutique Interior"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1.5s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Box>
          </Grid>

          {/* Right Column: Content */}
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
                className="physicalStoreOverline"
                sx={{
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  mb: 1.5,
                  display: "block",
                }}
              >
                OUR SHOWROOM
              </Typography>

              <Typography
                variant="h3"
                className="physicalStoreTitle"
                sx={{
                  fontFamily: "Prata, Playfair Display, serif",
                  fontWeight: 400,
                  fontSize: { xs: "2rem", md: "2.4rem" },
                  lineHeight: 1.3,
                  mb: 2,
                }}
              >
                We're Here for You, In Person and Online
              </Typography>

              <Typography
                variant="body1"
                className="physicalStoreBody"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Whether it's at a store near you or online, we curate your
                appointment just for you.
              </Typography>

              <Divider className="physicalStoreDivider" sx={{ mb: 4 }} />

              {/* Showroom Details */}
              <Stack spacing={2.5} sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationOnOutlinedIcon
                    className="physicalStoreIcon"
                    sx={{ fontSize: "1.3rem", mt: "2px" }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="physicalStoreDetailText"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      Gujarat High Jewelry Studio
                    </Typography>
                    <Typography
                      variant="body2"
                      className="physicalStoreDetailSubtext"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Plot No. A-14 to A-18, Sunrise Business Park, Canal Road,
                      Cocoa, Surat, Gujarat 395009, India
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <AccessTimeOutlinedIcon
                    className="physicalStoreIcon"
                    sx={{ fontSize: "1.3rem", mt: "2px" }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      className="physicalStoreDetailSubtext"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Mon - Sun : 11:00 AM to 9:00 PM
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <PhoneOutlinedIcon
                    className="physicalStoreIcon"
                    sx={{ fontSize: "1.3rem", mt: "2px" }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      className="physicalStoreDetailText"
                      sx={{ fontWeight: 600 }}
                    >
                      +91 12346567891
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Actions */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  className="physicalStoreButton"
                  onClick={() => router.push("/contactUs")}
                  sx={{
                    borderRadius: "0px",
                    py: 1.6,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                  }}
                >
                  Visit Showroom
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  className="physicalStoreButton"
                  onClick={() => router.push("/appointment")}
                  sx={{
                    borderRadius: "0px",
                    py: 1.6,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                  }}
                >
                  Book Appointment
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

