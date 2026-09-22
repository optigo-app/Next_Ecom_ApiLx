"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  ButtonBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import ReusableConfirmModal from "../../../ui/Modal";

const ProCatNewHeader = ({ storeinit, logos }) => {
  const { islogin, setislogin, cartCountNum } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const location = useNextRouterLikeRR();
  const navigate = location.push;

  const logoSrc =
    storeinit?.companylogo ||
    logos?.logo ||
    storeinit?.companyMlogo ||
    "/logo.png";

  useEffect(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem("LoginUser"));
      if (typeof value === "boolean") {
        setislogin(value);
      }
    } catch (_) {}
    setIsMounted(true);
  }, [setislogin]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setislogin(false);
    Cookies.remove("userLoginCookie");
    Cookies.remove("visitorId");
    Cookies.remove("visiterId");
    sessionStorage.setItem("LoginUser", "false");
    sessionStorage.removeItem("loginUserDetail");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("selectedAddressId");
    sessionStorage.removeItem("orderNumber");
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("UploadLogicalPath");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("allproductlist");
    sessionStorage.removeItem("AllFilter");
    sessionStorage.removeItem("ColorStoneQualityColorCombo");
    sessionStorage.removeItem("MetalColorCombo");
    sessionStorage.removeItem("metalTypeCombo");
    window.localStorage.removeItem("AuthToken");
    window.sessionStorage.clear();
    setOpenLogoutModal(false);
    window.location.href = "/";
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
              height: { xs: 65, sm: 75, md: 85 },
              minHeight: { xs: 65, sm: 75, md: 85 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 1, sm: 2, md: 3 },
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
                  maxHeight: { xs: 45, sm: 55, md: 68 },
                  maxWidth: { xs: 180, sm: 220, md: 280 },
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
                gap: { md: 3, lg: 4 },
              }}
            >
              {isMounted && (
                <>
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
                </>
              )}

              {/* CART ICON WITH BADGE */}
              <IconButton
                aria-label="cart"
                onClick={() => navigate("/cartPage")}
                sx={{
                  p: 1,
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
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 26 }} />
                </Badge>
              </IconButton>
            </Box>

            {/* RIGHT: MOBILE ACTIONS (CART + HAMBURGER) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
              }}
            >
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