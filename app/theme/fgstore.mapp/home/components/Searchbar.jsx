"use client";

import { Box, InputBase } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";

const Searchbar = () => {
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2, mt: 0.5 }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          bgcolor: "white",
          borderRadius: "50px",
          px: 2,
          py: 0.8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        }}
      >
        <SearchRounded sx={{ color: "#9e9e9e", mr: 1, fontSize: 22 }} />
        <InputBase
          placeholder="Search necklaces, rings & more"
          inputProps={{ "aria-label": "search" }}
          sx={{
            flex: 1,
            fontSize: "15px",
            color: "#333",
          }}
        />
      </Box>
    </Box>
  );
};

export default Searchbar;
