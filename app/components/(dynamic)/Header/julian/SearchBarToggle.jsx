import React, { useState } from "react";
import { Box, IconButton, InputBase, Paper, ClickAwayListener } from "@mui/material";
import { IoClose as Close, IoSearchOutline as Search } from "react-icons/io5";

const SearchBarToggle = ({ setSearchOpen, searchDataFucn }) => {
  const [value, setValue] = useState("");

  const handleToggle = () => setSearchOpen((prev) => !prev);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDataFucn) searchDataFucn(value);
    setSearchOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        bgcolor: "#fff",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 0.5,
            bgcolor: "background.paper",
            minWidth: { xs: 200, sm: 500, md: 700 },
            transition: "0.3s ease",
            boxShadow: "none",
            outline: "none",
            border: "1px solid #dadada",
          }}
        >
          <InputBase autoFocus placeholder={"Search Jewellery"} value={value} onChange={(e) => setValue(e.target.value)} sx={{ ml: 1, flex: 1 }} />
          <IconButton type="submit" sx={{
            color: "#000",
          }}>
            <Search />
          </IconButton>
          <IconButton onClick={handleToggle} color="default">
            <Close />
          </IconButton>
        </Paper>
      </ClickAwayListener>
    </Box>
  );
};

export default SearchBarToggle;
