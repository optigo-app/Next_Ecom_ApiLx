'use client'
import React from 'react';
import { Snackbar, Paper, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Gives a nice sparkle/jewelry vibe
import { useSnackbarStore } from '@/app/(core)/hooks/useSnackbar';


export default function JewelrySnackbar() {
    const { open, message, closeSnackbar } = useSnackbarStore();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        closeSnackbar();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: '320px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAEAEA',
                    borderRadius: '4px',
                    boxShadow: '0px 12px 35px rgba(0, 0, 0, 0.08)',
                    padding: '12px 16px 12px 20px',
                }}
            >
                {/* Champagne/Gold Sparkle Icon */}
                <AutoAwesomeIcon sx={{ color: '#C5A059', fontSize: '2.5rem', mr: 2 }} />

                {/* Minimalist Message */}
                <Typography
                    sx={{
                        flexGrow: 1,
                        color: '#111111',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        letterSpacing: '0.5px' // Adds an elegant, high-end feel
                    }}
                >
                    {message}
                </Typography>

                {/* Minimalist Close Button */}
                <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{
                        color: '#CCCCCC',
                        '&:hover': { color: '#111111', backgroundColor: 'transparent' }
                    }}
                >
                    <CloseIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
            </Paper>
        </Snackbar>
    );
}