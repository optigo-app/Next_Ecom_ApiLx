"use client";

import { Box, InputBase } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import { useState } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const Searchbar = ({ storeinit }) => {
  const { loginUserDetail } = useStore();
  const router = useNextRouterLikeRR();
  const [searchText, setSearchText] = useState("");

  const searchDataFucn = (searchValue) => {
    const value = searchValue?.trim();
    if (!value) return;

    const obj = {
      a: "",
      b: value,
      m: loginUserDetail?.MetalId ?? storeinit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid,
      f: {},
    };
    const encodeObj = btoa(JSON.stringify(obj));
    router.push(`/p/${encodeURIComponent(value)}?S=${encodeObj}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchDataFucn(searchText);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2, mt: 0.5,px:1 }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          bgcolor: "white",
          borderRadius: "3px",
          px: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
             display: "flex",
          alignItems: "center",
          height: 42,
          bgcolor: "#fff",
          border: "1px solid #E5E7EB",
          transition: "all .25s ease",
          "&:hover": {
            borderColor: "#CFCFCF",
          },
          "&:focus-within": {
            borderColor: "#0000003b",
            boxShadow: "0 0 0 3px rgba(32, 31, 29, 0.12)",
          },
        }}
      >
        <SearchRounded
          sx={{ color: "#9e9e9e", mr: 1, fontSize: 22, cursor: "pointer" }}
          onClick={handleSearch}
        />
        <InputBase
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
