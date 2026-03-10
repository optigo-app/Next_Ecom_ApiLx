"use client";
import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

export default function MobileNavbar() {
  const { cartCountNum, wishCountNum } = useStore();
  const navigate = useNextRouterLikeRR();

  const GoBack = () => {
    navigate.back();
  };

  const GoToCart = () => {
    navigate.push("/cartPage");
  };

  const GoToWishlist = () => {
    navigate.push("/myWishList");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #eee",
        top: 0,
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
        <IconButton edge="start" size="small" onClick={GoBack}>
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
          WishList
        </Typography>
        {/* Right Icons */}
        <Box>
 <IconButton size="small"
            onClick={GoToCart}
          >

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
                  paddingBottom: "5px",
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
