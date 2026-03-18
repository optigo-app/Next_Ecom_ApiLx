"use client";

import { Box, Typography, TextField, Button, IconButton, Drawer, Fade, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { toast } from "react-toastify";
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";

export default function Newsletter({ open, onClose }) {
    const { storeInit } = useStore();
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

        if (!email.trim()) {
            toast.error("Email is required.");
            setLoading(false);
            return;
        }
        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            const newslater = storeInit?.newslatter;
            if (newslater && email) {
                const newsletterUrl = `${newslater}${email}`;
                const res = await fetch(newsletterUrl);
                const text = await res.text();

                if (text.toLowerCase().includes("success") || text.toLowerCase().includes("added") || text.toLowerCase().includes("thank")) {
                    setIsSuccess(true);
                    setResult(text);
                    setEmail("");
                } else {
                    setResult(text);
                    toast.info(text);
                }
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setResult(null);
        setEmail("");
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={Boolean(open)}
            onClose={handleClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "100%",
                    height: "100svh",
                },
            }}
        >
            <Box
                sx={{
                    height: "100svh",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fff",
                    position: "relative"
                }}
            >
                {/* Close Button */}
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        zIndex: 10,
                        bgcolor: "rgba(0,0,0,0.05)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.1)" }
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                {!isSuccess ? (
                    <>
                        {/* Main Content */}
                        <Box
                            sx={{
                                flex: 1,
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            {/* Illustration Container */}
                            <Box
                                sx={{
                                    width: 240,
                                    height: 240,
                                    borderRadius: "50%",
                                    bgcolor: "rgba(var(--primary-rgb, 0, 0, 0), 0.04)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 4,
                                    overflow: "hidden"
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/newletter.png"
                                    alt="newsletter"
                                    sx={{
                                        width: "80%",
                                        height: "auto",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight={800}
                                letterSpacing="-0.02em"
                                mb={1.5}
                                sx={{ color: "#1a1a1a" }}
                            >
                                Deals are delivered to your Inbox.
                            </Typography>

                            <Typography
                                fontSize={15}
                                color="text.secondary"
                                px={2}
                                sx={{ lineHeight: 1.6 }}
                            >
                                Subscribe to our newsletter and stay updated with exclusive offers and jewelry trends.
                            </Typography>
                        </Box>

                        {/* Bottom Form Section */}
                        <Box
                            sx={{
                                p: 3,
                                borderTop: "1px solid #f0f0f0",
                                bgcolor: "#fafafa"
                            }}
                        >
                            <Box component={"form"} onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    placeholder="yourname@email.com"
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        mb: 2,
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "#fff",
                                            borderRadius: "12px",
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        bgcolor: COLORS.primary,
                                        color: COLORS.white,
                                        fontSize: 15,
                                        textTransform: "none",
                                        boxShadow: "0 4px 12px rgba(var(--primary-rgb, 0, 0, 0), 0.2)",
                                        "&:hover": {
                                            boxShadow: "0 6px 16px rgba(var(--primary-rgb, 0, 0, 0), 0.3)",
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Subscribe Now"}
                                </Button>
                            </Box>
                        </Box>
                    </>
                ) : (
                    /* Success State */
                    <Fade in={isSuccess}>
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                p: 4
                            }}
                        >
                            <CheckCircleOutlineIcon
                                sx={{ fontSize: 80, color: "success.main", mb: 3 }}
                            />

                            <Typography variant="h5" fontWeight={800} mb={2}>
                                You're on the list!
                            </Typography>

                            <Typography color="text.secondary" mb={5}>
                                {result || "Thank you for subscribing to our newsletter."}
                            </Typography>

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleClose}
                                sx={{
                                    borderRadius: "12px",
                                    px: 6,
                                    py: 1.2,
                                    textTransform: "none"
                                }}
                            >
                                Back to Profile
                            </Button>
                        </Box>
                    </Fade>
                )}
            </Box>
        </Drawer>
    );
}
