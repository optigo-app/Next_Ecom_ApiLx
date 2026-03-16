"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, Grid, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import Link from "next/link";

// Importing Icons
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import LogOutModal from "@/app/components/ui/LogOut";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import BespokeTabScreen from "./staticTabs/Bespoke/Bespoke";
import AppointmentTabScreen from "./staticTabs/Appointment/Appointment";
import StaticPage from "./StaticPage";
import Newsletter from "./staticTabs/Newsletter/Newsletter";
import AboutUs from "./staticTabs/AboutUs/AboutUs";
import ContactUs from "./staticTabs/ContactUs/ContactUs";

const ProfilePage = () => {
  const { loginUserDetail } = useStore();
  const router = useNextRouterLikeRR();
  const [LogoutModal, setLogoutModal] = useState(false);
  const [BespokeTab, setBespokeTab] = useState(false);
  const [AppointmentTab, setAppointmentTab] = useState(false);
  const [openPage, setOpenPage] = useState(null);
  const [NewsletterModal, setNewsletterModal] = useState(false);
  const [AboutUsModal, setAboutUsModal] = useState(false);
  const [ContactUsModal, setContactUsModal] = useState(false);

  const isUserAvailable = loginUserDetail && Object.keys(loginUserDetail).length > 0;

  const HandleLogout = () => {
    router.push("/logout");
  };

  const userName = loginUserDetail?.firstname ? `${loginUserDetail.firstname} ${loginUserDetail.lastname}` : null;
  return (
    <>
      <StaticPage open={openPage} onClose={() => setOpenPage(null)} title={openPage} />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f1f3f6", pb: 10 }}>
        <Box
          sx={{
            backgroundColor: "rgb(154, 154, 154)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {userName && <Avatar src="https://via.placeholder.com/150" sx={{ width: 40, height: 40, border: "2px solid white" }} />}
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                ...(!userName && {
                  fontSize: "18px",
                }),
              }}
            >
              {userName ? `Hey! ${userName}` : "Log in to get exclusive offers"}
            </Typography>
          </Box>
        </Box>

        {isUserAvailable && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid
                item
                size={{ xs: 6 }}
                component={Link}
                href={`/account?id=${btoa("1")}`}
                sx={{
                  textDecoration: "none",
                  color: "#ccc",
                }}
              >
                <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                  <Inventory2OutlinedIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Orders
                  </Typography>
                </Paper>
              </Grid>

              <Grid
                item
                size={{ xs: 6 }}
                component={Link}
                href={`/myWishList`}
                sx={{
                  textDecoration: "none",
                  color: "#ccc",
                }}
              >
                <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                  <FavoriteBorderOutlinedIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Wishlist
                  </Typography>
                </Paper>
              </Grid>

              <Grid
                item
                size={{ xs: 6 }}
                component={Link}
                href={`/cartPage`}
                sx={{
                  textDecoration: "none",
                  color: "#ccc",
                }}
              >
                <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                  <CardGiftcardOutlinedIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Cart
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ backgroundColor: "white" }}>
          <List disablePadding>
            {isUserAvailable && (
              <ListItem
                disablePadding
                component={Link}
                href={`/account?id=${btoa("0")}`}
                sx={{
                  textDecoration: "none",
                  color: "currentcolor",
                }}
              >
                <ListItemButton sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ color: "#2874f0" }}>
                    <PersonOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Settings" />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              </ListItem>
            )}
            {isUserAvailable && <Divider />}

            {isUserAvailable && (
              <ListItem
                disablePadding
                component={Link}
                href={`/account?id=${btoa("2")}`}
                sx={{
                  textDecoration: "none",
                  color: "currentcolor",
                }}
              >
                <ListItemButton sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ color: "#2874f0" }}>
                    <LocationOnOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Saved Addresses" />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              </ListItem>
            )}
            {isUserAvailable && <Divider />}
          </List>
        </Box>
        <Box sx={{ backgroundColor: "white" }}>
          <List disablePadding>
            <ListItem disablePadding onClick={() => setAboutUsModal(true)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="About Us" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => setContactUsModal(true)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Contact Us" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => setOpenPage("Feedback")} href="/feedback">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Feedback & Information" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => setOpenPage("Privacy Policy")} href="/privacy-policy">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Privacy Policy" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => setOpenPage("Copyright")} href="/copyright">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Copyright" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding onClick={() => setBespokeTab(true)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Bespoke Jewelry" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding onClick={() => setAppointmentTab(true)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Book an Appointment" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding onClick={() => setNewsletterModal(true)}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Newsletter" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding onClick={() => setOpenPage("Support")} href="/support">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText primary="Support" />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </ListItem>
            <Divider />
            {isUserAvailable && (
              <ListItem disablePadding onClick={() => { }}>
                <ListItemButton sx={{ py: 1.5 }} onClick={() => setLogoutModal(true)}>
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
      <LogOutModal open={LogoutModal} onClose={() => setLogoutModal(false)} onConfirm={HandleLogout} />
      <BespokeTabScreen open={BespokeTab} onClose={() => setBespokeTab(false)} />
      <AppointmentTabScreen open={AppointmentTab} onClose={() => setAppointmentTab(false)} />
      <Newsletter open={NewsletterModal} onClose={() => setNewsletterModal(false)} />
      <AboutUs open={AboutUsModal} onClose={() => setAboutUsModal(false)} />
      <ContactUs open={ContactUsModal} onClose={() => setContactUsModal(false)} />
    </>
  );
};

export default ProfilePage;

