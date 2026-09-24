'use client'
import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";


export default function MobileNavbar() {
  const navigate = useNextRouterLikeRR();
  const { cartCountNum, wishCountNum } = useStore();

  const GoBack = () => {
    navigate.back();
  };

  const GoToCart = () => {
    navigate.push('/cartPage');
  }

  const GoToWishlist = () => {
    navigate.push('/myWishList');
  }


  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #eee",
        top: 0,
        width: "100%",
        zIndex: 1201,
        isolation: "isolate",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: 1,
          display: "flex",
          width: "100%",
          boxSizing: "border-box",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}
        <IconButton edge="start" size="small"
          onClick={GoBack}
          sx={{ flex: "0 0 auto" }}
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
          My Shopping Bag
        </Typography>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flex: "0 0 auto", ml: "auto" }}>

          <IconButton size="small"
            onClick={GoToWishlist}
          >

            <Badge
              badgeContent={wishCountNum}
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.65rem",
                  height: "18px",
                  minWidth: "18px",
                  borderRadius: "50%",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  padding: 0,            // ❌ remove paddingBottom
                  lineHeight: 1,         // 🔥 important

                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                },
              }}
            >
              <FavoriteBorderIcon />
            </Badge>

          </IconButton>

          <IconButton size="small" onClick={GoToCart}>
            <Badge
              badgeContent={cartCountNum}
              color="primary"
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.65rem",
                  height: "18px",
                  minWidth: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  lineHeight: 1,
                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                },
              }}
            >
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
