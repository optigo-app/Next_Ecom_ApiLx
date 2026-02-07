"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, CircularProgress, Typography, Box } from '@mui/material';
import { HourglassEmpty, Payment } from '@mui/icons-material';

export default function EnhancedPaymentDialog({ open, close, mode }) {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Payment Initiated");
    const [statusIcon, setStatusIcon] = useState(<Payment />);

    useEffect(() => {
        if (mode === 1) {
            setMessage("Payment Initiated");
            setStatusIcon(<Payment sx={{ fontSize: '3.5rem' }} />);
            setLoading(true);
        } else if (mode === 2) {
            setMessage("Payment in Process");
            setStatusIcon(<HourglassEmpty sx={{ fontSize: '3.5rem' }} />);
            setLoading(true);
        } else if (mode === 3) {
            setMessage("Payment Verify in Progress");
            setStatusIcon(<HourglassEmpty sx={{ fontSize: '3.5rem' }} />);
            setLoading(true);
        }
    }, [mode]);

    return (
        <div>
            <Dialog
                open={open}
                disableBackdropClick
                onClose={close}
                disableEscapeKeyDown
                maxWidth="xs"
                fullWidth
                sx={{
                    zIndex: 2000000,   // ⬅️ Increase Dialog z-index here
                    '& .MuiDialog-paper': {
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: 24,
                        height: '270px',
                    },
                }}
            >
                <DialogContent
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                    }}
                >
                    <Box sx={{ marginBottom: '10px', color: '#1976d2' }}>
                        {statusIcon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        {message}
                    </Typography>

                    {loading && (
                        <CircularProgress size={50} sx={{ color: '7d7f85', marginTop: '20px' }} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
