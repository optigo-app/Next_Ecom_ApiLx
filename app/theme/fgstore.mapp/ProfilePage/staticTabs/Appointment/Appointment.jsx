"use client";

import { Drawer, Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentInquiry from "./AppointmentInquiry";
import { getButtonStyle } from "@/app/(core)/constants/MobileAppTheme";

export default function AppointmentTab({
  open,
  onClose,
  title = "Book an Appointment",
  activeDrawer,
  openDrawer
}) {
  // Check if the current drawer in URL is the inquiry one
  const inquiryModalOpen = activeDrawer === "appointment-inquiry";

  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
        },
      }}
    >
      <Box
        sx={{
          minHeight: 56,
          px: 1,
          display: "flex",
          justifyContent: "space-between",
          position: 'absolute',
          color: '#000',
          zIndex: 9,
          alignItems: 'center'
        }}
      >
        <IconButton edge="start" size="small"
          onClick={onClose}
          sx={{
            background: '#fff',
            border: '1px solid #ccc',
            ':hover': {
              background: '#f5f5f5',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          background: "#fff",
          color: "#000",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "100%",
            width: "100%",
          }}
        >
          <Box
            component="img"
            src="/WebSiteStaticImage/Appointment/MainBanner.png"
            alt="Appointment"
            sx={{
              width: "100%",
              objectFit: "cover",
              mb: 3,
            }}
          />

          {/* Title */}
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.35,
              mb: 2,
              px: 2,
            }}
          >
            BOOK AN APPOINTMENT
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.6)",
              mb: 3,
              px: 2,
            }}
          >
            Welcome to Sonasons your premier destination for exquisite jewellery.
            Schedule an appointment today to experience the brilliance and beauty of our
            jewellery.
          </Typography>

          {/* Button */}
          <Button
            variant="contained"
            sx={getButtonStyle(true, {
              px: 3,
              py: 1.2,
              fontSize: 12.5,
              letterSpacing: 1,
              justifyContent: 'center',
              mx: 'auto'
            })}
            // Navigate to the inquiry sub-drawer
            onClick={() => openDrawer("appointment-inquiry")}
          >
            BOOK NOW
          </Button>
        </Box>
      </Box>

      <AppointmentInquiry
        open={inquiryModalOpen}
        // Triggers router.back() to pop "appointment-inquiry" and return to "appointment"
        onClose={onClose}
      />
    </Drawer>
  );
}
