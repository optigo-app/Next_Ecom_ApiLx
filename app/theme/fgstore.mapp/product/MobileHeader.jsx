import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, TextField, InputAdornment } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import BreadCrumbs from "./MobileBreadCrumb";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { Search as SearchIcon } from "lucide-react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";

const MobileHeader = ({ result, afterFilterCount, showClearAllButton, afterCountStatus, IsBreadCumShow, menuDecode }) => {
  const GoBack = useNextRouterLikeRR().back;
  const router = useNextRouterLikeRR();
  const [searchOpen, setSearchOpen] = useState(false);
  const { loginUserDetail, storeInit } = useStore();
  const searchInputRef = useRef(null);

  const searchDataFucn = (searchValue) => {
    const value = searchValue?.trim();
    if (!value) return;

    const obj = {
      a: "",
      b: value,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };
    const encodeObj = btoa(JSON.stringify(obj));
    router.push(`/p/${encodeURIComponent(value)}?S=${encodeObj}`);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchDataFucn(searchInputRef.current.value);
    }
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [searchOpen]);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e9e9e9e3",
        px: 1,
        py: 1.2,
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "40px", display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "calc(100% - 50px)",
            opacity: searchOpen ? 0 : 1,
            visibility: searchOpen ? "hidden" : "visible",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
            zIndex: 1,
          }}
        >
          <IconButton size="small" onClick={GoBack} sx={{ color: "#333" }}>
            <ArrowBackIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
            <BreadCrumbs
              showClearAllButton={showClearAllButton} afterCountStatus={afterCountStatus} count={afterFilterCount} result={result} IsBreadCumShow={IsBreadCumShow} menuDecode={menuDecode} />
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: searchOpen ? "100%" : "36px",
            height: "36px",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setSearchOpen(true)}
            sx={{
              position: "absolute",
              right: 0,
              width: "36px",
              height: "36px",
              backgroundColor: "#cecece",
              color: "#fff",
              opacity: searchOpen ? 0 : 1,
              visibility: searchOpen ? "hidden" : "visible",
              transition: "opacity 0.2s ease, visibility 0.2s ease",
              "&:hover": {
                backgroundColor: "#b5b5b5",
              },
            }}
          >
            <SearchIcon fontSize="14" />
          </IconButton>

          <TextField
            inputRef={searchInputRef}
            fullWidth
            onKeyDown={handleSearch}
            size="small"
            placeholder="Search products..."
            sx={{
              opacity: searchOpen ? 1 : 0,
              visibility: searchOpen ? "visible" : "hidden",
              transition: "opacity 0.3s ease 0.1s",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                height: "38px",
                pr: 0.5,
                "& fieldset": {
                  borderColor: COLORS.border,
                },

                // 🔥 hover border (optional light)
                "&:hover fieldset": {
                  borderColor: COLORS.border,
                },

                // ❌ REMOVE BLUE FOCUS BORDER
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.border,
                  borderWidth: "1px",
                },
              },

              // ❌ remove browser outline
              "& input": {
                outline: "none",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchOpen(false)} sx={{ color: "text.secondary" }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileHeader;
