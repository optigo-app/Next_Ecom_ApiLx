"use client";

import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MobileNavbar from "./NavigationBar";

export default function StaticPage({ open, onClose, title = "Page" }) {
  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "100%",
        },
      }}
    >
      <MobileNavbar 
       title={title}
       onClose={onClose}
      />
      <Box
        sx={{
          p: 2,
        }}
      >
        {/* Content */}
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.8,
            color: "text.secondary",
            mb: 2,
          }}
        >
          This is a dummy static page for mobile view. Here you can place
          information such as privacy policy, support details, copyright
          information, or feedback instructions.
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.8,
            color: "text.secondary",
            mb: 2,
          }}
        >
          Our platform values user privacy and ensures that personal
          information is handled securely.
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.8,
            color: "text.secondary",
          }}
        >
          For support or feedback please contact our team through the support
          section available in the profile page.
        </Typography>
      </Box>
    </Drawer>
  );
}
