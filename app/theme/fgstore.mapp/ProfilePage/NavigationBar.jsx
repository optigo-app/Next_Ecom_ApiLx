import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function MobileNavbar({
  title ,
  onClose
}) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #eee",
        top: 0
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}
        <IconButton edge="start" size="small"
          onClick={onClose}
        >
          <ArrowBackIcon />
        </IconButton>
  {/* Center Logo */}
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          {title}
        </Typography>
        <Box>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}
