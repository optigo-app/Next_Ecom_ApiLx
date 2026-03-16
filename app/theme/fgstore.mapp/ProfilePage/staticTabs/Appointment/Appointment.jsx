"use client";

import { Drawer, Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentInquiry from "./AppointmentInquiry";
import { useState } from "react";

export default function AppointmentTab({
  open,
  onClose,
  title = "Book an Appointment",
}) {
  const [inquiryModal, setInquiryModal] = useState(false);

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
            sx={{
              px: 3,
              py: 1.2,
              fontSize: 12.5,
              letterSpacing: 1,
            }}
            onClick={() => setInquiryModal(true)}
          >
            BOOK NOW
          </Button>
        </Box>
      </Box>
      <AppointmentInquiry
        open={inquiryModal}
        onClose={() => setInquiryModal(false)}
      />
    </Drawer>
  );
}
