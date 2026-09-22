import React from "react";
import { Box, Typography } from "@mui/material";

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.75,
      mb: 2.5,
      mt: 1,
    }}
  >
    {Icon && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 42,
          height: 42,
          borderRadius: "50%",
          bgcolor: "#e8f5e9",
          color: "#0b291d",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 22, color: "#0b291d" }} />
      </Box>
    )}
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "1.05rem",
          color: "#111827",
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            fontSize: "0.85rem",
            mt: 0.25,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

export default SectionHeader;