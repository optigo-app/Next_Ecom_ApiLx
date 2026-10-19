"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
  Tooltip,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { logoutUser } from "@/app/(core)/utils/authLogout";
import ReusableConfirmModal from "../../../ui/Modal";

const ProCatNewHeader = ({ storeinit, logos }) => {
  const { islogin, setislogin, cartCountNum, wishCountNum } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const location = useNextRouterLikeRR();
  const navigate = location.push;

  const logoSrc = storeinit?.companylogo || logos?.logo || storeinit?.companyMlogo || "/logo.png";

  useEffect(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem("LoginUser"));
      if (typeof value === "boolean") {
        setislogin(value);
      }
    } catch (_) { }
    setIsMounted(true);
  }, [setislogin]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setOpenLogoutModal(false);
    logoutUser({
      setislogin,
      storeInit: storeinit,
      redirectUrl: "/",
    });
  };

  const navItemStyle = {
    fontSize: { xs: "12px", md: "13px" },
    fontWeight: 500,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#222222",
    cursor: "pointer",
    position: "relative",
    padding: "6px 2px",
    display: "inline-block",
    transition: "color 0.2s ease",
    "&:after": {
      content: '""',
      position: "absolute",
      width: 0,
      height: "2px",
      bottom: 0,
      left: 0,
      backgroundColor: "#111111",
      transition: "width 0.25s ease-in-out",
    },
    "&:hover": {
      color: "#000000",
      "&:after": {
        width: "100%",
      },
    },
  };

  return (
    <>
      <ReusableConfirmModal
        open={openLogoutModal}
        onConfirm={handleLogout}
        onClose={() => setOpenLogoutModal(false)}
        type="logout"
      />

      {/* FULL STICKY HEADER */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1200,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 60, sm: 66, md: 70 },
              minHeight: { xs: 60, sm: 66, md: 70 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 1.5, sm: 2.5, md: 3 },
            }}
          >
            {/* LEFT: LOGO */}
            <Box
              component="a"
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                userSelect: "none",
              }}
            >
              <Box
                component="img"
                src={logoSrc}
                alt={storeinit?.companyname || "PROCAT_LOGO"}
                sx={{
                  maxHeight: { xs: 38, sm: 46, md: 54 },
                  maxWidth: { xs: 160, sm: 200, md: 250 },
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            {/* RIGHT: DESKTOP NAVIGATION ITEMS */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: { md: 2.5, lg: 3.5 },
              }}
            >
              {isMounted && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { md: 2.5, lg: 3 },
                  }}
                >
                  {islogin && storeinit?.IsCustomOrder === 1 && (
                    <Typography
                      component="span"
                      sx={navItemStyle}
                      onClick={() => navigate("/custom-orders")}
                    >
                      Custom Order
                    </Typography>
                  )}

                  {islogin && (
                    <Typography
                      component="span"
                      sx={navItemStyle}
                      onClick={() => navigate("/account")}
                    >
                      Account
                    </Typography>
                  )}

                  {islogin ? (
                    <Typography
                      component="span"
                      sx={navItemStyle}
                      onClick={() => setOpenLogoutModal(true)}
                    >
                      Log Out
                    </Typography>
                  ) : (
                    <Typography
                      component="span"
                      sx={navItemStyle}
                      onClick={() => navigate("/LoginOption")}
                    >
                      Log In
                    </Typography>
                  )}
                </Box>
              )}

              {/* ACTION ICONS (WISHLIST + CART) */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: { md: 0.5, lg: 1 },
                }}
              >
                {/* WISHLIST ICON WITH BADGE */}
                <Tooltip title="Wishlist">
                  <IconButton
                    aria-label="wishlist"
                    onClick={() => navigate("/myWishList")}
                    sx={{
                      p: 0.8,
                      color: "#1a1a1a",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <Badge
                      badgeContent={isMounted ? wishCountNum : 0}
                      max={999}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 600,
                          minWidth: "18px",
                          height: "18px",
                          padding: "0 4px",
                        },
                      }}
                    >
                      <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* CART ICON WITH BADGE */}
                <Tooltip title="Cart">
                  <IconButton
                    aria-label="cart"
                    onClick={() => navigate("/cartPage")}
                    sx={{
                      p: 0.8,
                      color: "#1a1a1a",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <Badge
                      badgeContent={isMounted ? cartCountNum : 0}
                      max={999}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 600,
                          minWidth: "18px",
                          height: "18px",
                          padding: "0 4px",
                        },
                      }}
                    >
                      <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* RIGHT: MOBILE ACTIONS (WISHLIST + CART + HAMBURGER) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <IconButton
                aria-label="wishlist"
                onClick={() => navigate("/myWishList")}
                sx={{ color: "#1a1a1a" }}
              >
                <Badge
                  badgeContent={isMounted ? wishCountNum : 0}
                  max={999}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 600,
                    },
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                </Badge>
              </IconButton>

              <IconButton
                aria-label="cart"
                onClick={() => navigate("/cartPage")}
                sx={{ color: "#1a1a1a" }}
              >
                <Badge
                  badgeContent={isMounted ? cartCountNum : 0}
                  max={999}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 600,
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
                </Badge>
              </IconButton>

              <IconButton
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ color: "#1a1a1a" }}
              >
                <MenuIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE RESPONSIVE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "75%", sm: 320 },
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box
            component="img"
            src={logoSrc}
            alt="Logo"
            sx={{ maxHeight: 40, maxWidth: 150, objectFit: "contain" }}
          />
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#444" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        <List sx={{ pt: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setMobileOpen(false);
                navigate("/");
              }}
            >
              <ListItemText
                primary="Home"
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase" }}
              />
            </ListItemButton>
          </ListItem>

          {isMounted && islogin && storeinit?.IsCustomOrder === 1 && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/custom-orders");
                }}
              >
                <ListItemText
                  primary="Custom Order"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase" }}
                />
              </ListItemButton>
            </ListItem>
          )}

          {isMounted && islogin && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/account");
                }}
              >
                <ListItemText
                  primary="Account"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase" }}
                />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setMobileOpen(false);
                navigate("/myWishList");
              }}
            >
              <ListItemText
                primary={`Wishlist (${wishCountNum || 0})`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase" }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setMobileOpen(false);
                navigate("/cartPage");
              }}
            >
              <ListItemText
                primary={`Cart (${cartCountNum || 0})`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase" }}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 1 }} />

          {isMounted && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileOpen(false);
                  if (islogin) {
                    setOpenLogoutModal(true);
                  } else {
                    navigate("/LoginOption");
                  }
                }}
              >
                <ListItemText
                  primary={islogin ? "Log Out" : "Log In"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: islogin ? "#d32f2f" : "#1976d2",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default ProCatNewHeader;