"use client";

import { Drawer, Box, Typography, Button ,IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BespokeInquiry from "./BespokeInquiry";
import { useState } from "react";


export default function BespokeTab({
  open,
  onClose,
  title = "Bespoke Jewellery",
}) {
    const [InquiryModal, setInquiryModal] = useState(false);
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
          position:'absolute' ,
          color:'#fff',
          zIndex:9,
          alignItems:'center'
        }}
        >
  <IconButton edge="start" size="small"
          onClick={onClose}
          sx={{
            background:'#fff',
            ':hover':{
            background:'#fff',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        </Box>
      <Box
        sx={{
          background: "#000",
          color: "#fff",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 380,
            width: "100%",
          }}
        >
          {/* Image */}
          <Box
            component="img"
            src="https://sonasons.optigoapps.com/WebSiteStaticImage/images/HomePage/bespoke/2.png"
            alt="Bespoke Jewellery"
            sx={{
              width: "100%",
              objectFit: "contain",
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
            }}
          >
            Crafting Timeless Bespoke Jewellery for Every Occasion
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              mb: 3,
            }}
          >
            Experience the art of bespoke jewellery, where every piece is
            designed exclusively for you. From personalized necklaces to custom
            rings, our artisans combine traditional craftsmanship with modern
            design.
          </Typography>

          {/* Button */}
          <Button
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              px: 3,
              py: 1.2,
              fontSize: 12.5,
              letterSpacing: 1,
              "&:hover": {
                borderColor: "#fff",
                background: "rgba(255,255,255,0.08)",
              },
            }}
            onClick={() => setInquiryModal(true)}
          >
            CREATE YOUR BESPOKE PIECE
          </Button>
        </Box>
      </Box>
      <BespokeInquiry
      open={InquiryModal}
      onClose={() => setInquiryModal(false)}
      />
    </Drawer>
  );
}
