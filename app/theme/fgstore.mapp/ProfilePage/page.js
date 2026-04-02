"use client";
import React from "react";
import { Box, Typography, Avatar, Grid, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Importing Icons
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import LogOutModal from "@/app/components/ui/LogOut";
import BespokeTabScreen from "./staticTabs/Bespoke/Bespoke";
import AppointmentTabScreen from "./staticTabs/Appointment/Appointment";
import StaticPage from "./StaticPage";
import Newsletter from "./staticTabs/Newsletter/Newsletter";
import AboutUs from "./staticTabs/AboutUs/AboutUs";
import ContactUs from "./staticTabs/ContactUs/ContactUs";
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";
import Cookie from "js-cookie";

// -----------------------------------------------------------------
// Drawer keys (used in ?drawer=<KEY> URL query param)
// -----------------------------------------------------------------
const DRAWER = {
  LOGOUT: "logout",
  BESPOKE: "bespoke",
  APPOINTMENT: "appointment",
  NEWSLETTER: "newsletter",
  ABOUT_US: "about-us",
  CONTACT_US: "contact-us",
  FEEDBACK: "Feedback",
  PRIVACY: "Privacy Policy",
  COPYRIGHT: "Copyright",
  SUPPORT: "Support",
};

const ProfilePage = () => {
  const { loginUserDetail } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Current open drawer is read straight from the URL
  const activeDrawer = searchParams.get("drawer");

  // -----------------------------------------------------------------
  // Helpers: open a drawer by pushing ?drawer=<key> into history
  //          close by going back (back button pops the entry)
  // -----------------------------------------------------------------
  const openDrawer = (key) => {
    // Build a new URL preserving existing params
    const params = new URLSearchParams(searchParams.toString());
    params.set("drawer", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const closeDrawer = () => {
    router.back();
  };



  const HandleLogout = () => {
    Cookie.remove("isUserLoggedIn");
    Cookie.remove("visiterId");
    sessionStorage.removeItem('token');
    sessionStorage.setItem('LoginUser', JSON.stringify(false));
    sessionStorage.setItem('loginUserDetail', JSON.stringify({}));
    sessionStorage.removeItem('myAccountFlags');
    router.push("/logout");
  };

  const isUserAvailable = loginUserDetail && Object.keys(loginUserDetail).length > 0;
  const userName = loginUserDetail?.firstname
    ? `${loginUserDetail.firstname} ${loginUserDetail.lastname}`
    : null;

  // Static-page drawers (Feedback, Privacy Policy, Copyright, Support)
  const staticPageDrawers = [DRAWER.FEEDBACK, DRAWER.PRIVACY, DRAWER.COPYRIGHT, DRAWER.SUPPORT];
  const isStaticOpen = staticPageDrawers.includes(activeDrawer) ? activeDrawer : null;

  return (
    <>
      {/* --- URL-synced drawers --- */}
      <StaticPage
        open={isStaticOpen}
        onClose={closeDrawer}
        title={isStaticOpen}
      />

      <LogOutModal
        open={activeDrawer === DRAWER.LOGOUT}
        onClose={closeDrawer}
        onConfirm={HandleLogout}
      />

      <BespokeTabScreen
        open={activeDrawer === DRAWER.BESPOKE}
        onClose={closeDrawer}
      />

      <AppointmentTabScreen
        open={activeDrawer === DRAWER.APPOINTMENT}
        onClose={closeDrawer}
      />

      <Newsletter
        open={activeDrawer === DRAWER.NEWSLETTER}
        onClose={closeDrawer}
      />

      <AboutUs
        open={activeDrawer === DRAWER.ABOUT_US}
        onClose={closeDrawer}
      />

      <ContactUs
        open={activeDrawer === DRAWER.CONTACT_US}
        onClose={closeDrawer}
      />

      {/* --- Page Body --- */}
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f1f3f6", pb: 10 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: COLORS.primary,
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {userName && (
            <Avatar
              src="https://via.placeholder.com/150"
              sx={{ width: 40, height: 40, border: "2px solid white" }}
            />
          )}
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ ...(!userName && { fontSize: "18px" }) }}
            >
              {userName ? `Hey! ${userName}` : "Log in to get exclusive offers"}
            </Typography>
          </Box>
        </Box>

        {/* Quick-access cards */}
        {isUserAvailable && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid
                item
                size={{ xs: 6 }}
                component={Link}
                href={`/account?id=${btoa("1")}`}
                sx={{ textDecoration: "none", color: "#ccc" }}
              >
                <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                  <Inventory2OutlinedIcon sx={{ color: COLORS.primary }} />
                  <Typography variant="subtitle2" fontWeight="bold">Orders</Typography>
                </Paper>
              </Grid>

              <Grid
                item
                size={{ xs: 6 }}
                component={Link}
                href="/myWishList"
                sx={{ textDecoration: "none", color: "#ccc" }}
              >
                <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                  <FavoriteBorderOutlinedIcon sx={{ color: COLORS.primary }} />
                  <Typography variant="subtitle2" fontWeight="bold">Wishlist</Typography>
                </Paper>
              </Grid>

              <Grid
                item
                size={{ xs: 6 }}
                component={Link}
                href="/cartPage"
                sx={{ textDecoration: "none", color: "#ccc" }}
              >
                <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                  <CardGiftcardOutlinedIcon sx={{ color: COLORS.primary }} />
                  <Typography variant="subtitle2" fontWeight="bold">Cart</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Account links */}
        <Box sx={{ backgroundColor: "white" }}>
          <List disablePadding>
            {isUserAvailable && (
              <>
                <ListItem
                  disablePadding
                  component={Link}
                  href={`/account?id=${btoa("0")}`}
                  sx={{ textDecoration: "none", color: "currentcolor" }}
                >
                  <ListItemButton sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ color: COLORS.primary }}>
                      <PersonOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Account Settings" />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                </ListItem>
                <Divider />

                <ListItem
                  disablePadding
                  component={Link}
                  href={`/account?id=${btoa("2")}`}
                  sx={{ textDecoration: "none", color: "currentcolor" }}
                >
                  <ListItemButton sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ color: COLORS.primary }}>
                      <LocationOnOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Saved Addresses" />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            )}
          </List>
        </Box>

        {/* More options */}
        <Box sx={{ backgroundColor: "white" }}>
          <List disablePadding>
            <ListItem disablePadding onClick={() => openDrawer(DRAWER.ABOUT_US)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="About Us" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.CONTACT_US)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Contact Us" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.FEEDBACK)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Feedback & Information" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.PRIVACY)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Privacy Policy" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.COPYRIGHT)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Copyright" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.BESPOKE)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Bespoke Jewellery" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.APPOINTMENT)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Book an Appointment" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.NEWSLETTER)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Newsletter" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => openDrawer(DRAWER.SUPPORT)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Support" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            {isUserAvailable && (
              <ListItem disablePadding>
                <ListItemButton sx={{ py: 1.5 }} onClick={() => openDrawer(DRAWER.LOGOUT)}>
                  <ListItemIcon sx={{ color: "error.main" }}>
                    <PowerSettingsNewIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" sx={{ color: "error.main" }} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
