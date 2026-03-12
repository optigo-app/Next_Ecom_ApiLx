"use client";
import React from "react";
import { Box, Typography, Avatar, Grid, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import Link from 'next/link'

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

const ProfilePage = () => {
    const { loginUserDetail } = useStore();
    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f1f3f6", pb: 10 }}>
            <Box
                sx={{
                    backgroundColor: "#2874f0",
                    color: "white",
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Avatar src="https://via.placeholder.com/150" sx={{ width: 40, height: 40, border: "2px solid white" }} />
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        Hey! {loginUserDetail?.firstname} {loginUserDetail?.lastname}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 6 }}
                        component={Link}
                        href={'/account'}
                        sx={{
                            textDecoration: 'none',
                            color: '#ccc'
                        }}

                    >
                        <Paper
                            elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                            <Inventory2OutlinedIcon color="primary" />
                            <Typography variant="subtitle2" fontWeight="bold">
                                Orders
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item size={{ xs: 6 }}
                        component={Link}
                        href={'/account'}
                        sx={{
                            textDecoration: 'none',
                            color: '#ccc'
                        }}
                    >
                        <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                            <FavoriteBorderOutlinedIcon color="primary" />
                            <Typography variant="subtitle2" fontWeight="bold">
                                Wishlist
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item size={{ xs: 6 }}
                        component={Link}
                        href={'/account'}
                        sx={{
                            textDecoration: 'none',
                            color: '#ccc'
                        }}
                    >
                        <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                            <CardGiftcardOutlinedIcon color="primary" />
                            <Typography variant="subtitle2" fontWeight="bold">
                                Coupons
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item size={{ xs: 6 }}
                        component={Link}
                        href={'/account'}
                        sx={{
                            textDecoration: 'none',
                            color: '#ccc'
                        }}
                    >
                        <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderRadius: 2, cursor: "pointer" }}>
                            <HeadsetMicOutlinedIcon color="primary" />
                            <Typography variant="subtitle2" fontWeight="bold">
                                Help Center
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 1, backgroundColor: "white" }}>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ color: "#2874f0" }}>
                                <PersonOutlineOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Account Settings" />
                            <ChevronRightIcon color="action" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />

                    <ListItem disablePadding>
                        <ListItemButton sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ color: "#2874f0" }}>
                                <LocationOnOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Saved Addresses" />
                            <ChevronRightIcon color="action" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />

                    <ListItem disablePadding>
                        <ListItemButton sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ color: "#2874f0" }}>
                                <AccountBalanceWalletOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Saved Cards & Wallets" />
                            <ChevronRightIcon color="action" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />

                    <ListItem disablePadding>
                        <ListItemButton sx={{ py: 1.5 }}>
                            <ListItemIcon sx={{ color: "error.main" }}>
                                <PowerSettingsNewIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{ color: "error.main" }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default ProfilePage;
