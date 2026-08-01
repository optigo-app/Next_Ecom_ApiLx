import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { IoClose as Close, IoSearchOutline as Search } from "react-icons/io5";

const DrawerSearchBar = ({ setSearchOpen, searchDataFucn, isFormobile = false }) => {
  const [value, setValue] = useState("");

  const handleClose = () => setSearchOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDataFucn) searchDataFucn(value);
    setSearchOpen(false);
  };

  return (
    <Box
      sx={{
        width: isFormobile ? "99%" : "20%",
        bgcolor: "#fff",
        padding: isFormobile ? "10px" : "0px",
       
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: isFormobile ? 10 : 0,
        zIndex: 10,
      }}
    >
      <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
          
            bgcolor: "#fafafa",
            width: "100%",
            transition: "0.3s ease",
            boxShadow: "none",
            border: "1px solid #ddd",
          }}
        >
          <IconButton
            sx={{
              color: "#555",
              mr: 1,
              "&:hover": { color: "#000" },
            }}
          >
            <Search />
          </IconButton>

          <InputBase
            autoFocus
            placeholder="Search jewellery..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
              flex: 1,
              fontSize: "0.95rem",
              color: "#333",
            }}
          />

          <IconButton
            onClick={handleClose}
            sx={{
              color: "#555",
              "&:hover": { color: "#000" },
            }}
          >
            <Close />
          </IconButton>
        </Paper>
      </ClickAwayListener>
    </Box>
  );
};

export default DrawerSearchBar;
