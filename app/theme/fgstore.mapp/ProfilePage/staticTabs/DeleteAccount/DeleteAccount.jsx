"use client";

import { Box, Typography, IconButton, Drawer, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import { activeBrand } from "@/app/env";
import { AppConfig } from "@/app/(core)/constants/AppConfig";

export default function DeleteAccountTabScreen({ open, onClose, onConfirm }) {
    const config = AppConfig[activeBrand]?.compliance_content?.account_delete;
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleClose = () => {
        setConfirmOpen(false);
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
            <Box sx={{ height: "100svh", display: "flex", flexDirection: "column", bgcolor: "#fafafa" }}>
                {/* Header / Close Button */}
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fff", borderBottom: "1px solid #f0f0f0" }}>
                    <Typography variant="h6" fontWeight="bold">Delete Account</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
                    {!config ? (
                        <Typography>Content not available for this brand.</Typography>
                    ) : (
                        <Box sx={{ maxWidth: 720, margin: "0 auto", backgroundColor: "#ffffff", borderRadius: 3, padding: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                            <Typography variant="h5" fontWeight={800} mb={2} sx={{ borderBottom: "2px solid #f0f0f0", pb: 2, lineHeight: 1.2 }}>
                                {config.title}
                            </Typography>
                            <Typography fontSize={15} color="text.secondary" mb={2} sx={{ lineHeight: 1.8 }}>
                                {config.intro}
                            </Typography>
                            <Typography fontSize={15} color="text.secondary" mb={3} sx={{ lineHeight: 1.8 }}>
                                {config.steps_intro}
                            </Typography>

                            {/* iOS / Android */}
                            {config.ios && (
                                <Box mb={3}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={1}>{config.ios.title}</Typography>
                                    <Typography fontSize={14} color="text.disabled" mb={1}>{config.ios.subtext}</Typography>
                                    <Box component="ol" sx={{ pl: 2, m: 0 }}>
                                        {config.ios.steps.map((step, idx) => (
                                            <Typography component="li" key={idx} fontSize={14} color="text.secondary" mb={0.5} sx={{ lineHeight: 1.8 }}>
                                                {step}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Website */}
                            {config.web && (
                                <Box mb={3}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={1}>{config.web.title}</Typography>
                                    <Typography fontSize={14} color="text.disabled" mb={1}>{config.web.subtext}</Typography>
                                    <Box component="ol" sx={{ pl: 2, m: 0 }}>
                                        {config.web.steps.map((step, idx) => (
                                            <Typography component="li" key={idx} fontSize={14} color="text.secondary" mb={0.5} sx={{ lineHeight: 1.8 }}>
                                                {step}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Things to Note */}
                            {config.note && (
                                <Box sx={{ backgroundColor: "#fffdf0", border: "1px solid #ffecb3", borderRadius: 2, p: 2, mt: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={700} color="#bf360c" mb={1}>{config.note.title}</Typography>
                                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                        {config.note.points.map((point, idx) => (
                                            <Typography component="li" key={idx} fontSize={14} color="#444" mb={0.5} sx={{ lineHeight: 1.8 }}>
                                                {point}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Bottom Action Area */}
                <Box sx={{ p: 3, bgcolor: "#fff", borderTop: "1px solid #f0f0f0", pb: "32px" }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={() => setConfirmOpen(true)}
                        sx={{ py: 1.8, borderRadius: "12px", fontWeight: 700, fontSize: 15, textTransform: "none" }}
                    >
                        Delete My Account
                    </Button>
                </Box>
            </Box>

            {/* Confirmation Modal */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}>
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DeleteForeverIcon color="error" />
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
                    <Button onClick={() => { setConfirmOpen(false); onConfirm(); }} variant="contained" color="error" sx={{ textTransform: "none" }}>Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        </Drawer>
    );
}
