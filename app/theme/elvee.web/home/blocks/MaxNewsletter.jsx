'use client'
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    ThemeProvider,
    createTheme,
    Link
} from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// 1. Ultra-Minimalist Fashion Theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // Pure black
        },
        background: {
            default: '#FFFFFF', // Pure white
        },
        text: {
            primary: '#000000',
            secondary: '#757575',
        },
    },
    typography: {
        // Zara uses very stark, clean sans-serif fonts combined with elegant light weights
        fontFamily: '"Helvetica Neue", "Arial", sans-serif',
        h1: {
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textTransform: 'uppercase',
        },
        subtitle1: {
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#4A4A4A',
            letterSpacing: '0.02em',
        },
        button: {
            fontWeight: 500,
            letterSpacing: '0.1em',
        }
    },
    shape: {
        borderRadius: 0, // CRITICAL: Sharp edges only for that high-fashion look
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#E0E0E0', // Light grey underline
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#000000', // Black on hover
                        borderBottomWidth: '1px',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#000000', // Black when focused
                    },
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#E0E0E0',
                    '&.Mui-checked': {
                        color: '#000000',
                    },
                }
            }
        }
    }
});

export default function MaxNewsletter({ storeData }) {
    const [email, setEmail] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            setResult("Please agree to the Privacy Policy.");
            setTimeout(() => setResult(null), 3000);
            return;
        }

        setLoading(true);

        const isValidEmail = (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

        if (!email.trim()) {
            setResult("Email is required.");
            setLoading(false);
            return;
        }
        if (!isValidEmail(email)) {
            setResult("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            const newslatter = storeData?.newslatter;
            if (newslatter && email) {
                const newsletterUrl = `${newslatter}${email}`;
                const res = await fetch(newsletterUrl);
                const text = await res.text();
                setResult(text);
                setEmail("");
                setAgreed(false);

                setTimeout(() => setResult(null), 5000);
            } else {
                setResult("Newsletter service is not configured.");
                setTimeout(() => setResult(null), 3000);
            }
        } catch (err) {
            setResult("Something went wrong. Please try again later.");
            setTimeout(() => setResult(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '70vh' }}>
                <Grid container sx={{ minHeight: '70vh' }}>

                    {/* LEFT SIDE: Full Bleed Editorial Image */}
                    <Grid
                        item
                        size={{
                            xs: 12,
                            md: 6
                        }}
                        sx={{
                            // On mobile, image takes top 45vh. On desktop, full 100vh.
                            height: { xs: '45vh', md: '70vh' },
                            position: 'relative'
                        }}
                    >
                        <Box
                            component="img"
                            src="WebSiteStaticImage/Banner/newsletter.webp"
                            alt="Model wearing premium jewelry"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center 20%', // Adjust focus of the image
                            }}
                        />
                    </Grid>

                    {/* RIGHT SIDE: The Form / Copy */}
                    <Grid
                        item
                        size={{
                            xs: 12,
                            md: 6
                        }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: { xs: 4, sm: 8, md: 10, lg: 14 }, // Generous breathing room
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: '480px' }}>
                            <Typography variant="subtitle1" sx={{ mb: 6 }}>
                                Join our private list. Receive early access to new collections, exclusive bespoke services, and curated editorial pieces.
                            </Typography>

                            {/* The Form */}
                            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    id="email-input"
                                    label="EMAIL ADDRESS"
                                    variant="standard" // standard = underline only (No box)
                                    placeholder="Type Your Email"
                                    aria-label="Email address for newsletter"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputLabelProps={{
                                        sx: { fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 500, color: '#000' }
                                    }}
                                    InputProps={{
                                        sx: { pb: 1, fontSize: '1.1rem' }
                                    }}
                                    sx={{ mb: 4 }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            disableRipple
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                        />
                                    }

                                    label={
                                        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4, display: 'block' }}>
                                            I agree to the <Link href="#" color="primary" underline="always">Privacy Policy</Link> and consent to receive marketing communications.
                                        </Typography>
                                    }
                                    sx={{ mb: 3, alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0 } }}
                                />

                                {result && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mb: 3,
                                            display: 'block',
                                            color: result.includes("Thank") ? "#04AF70" : "#D32F2F",
                                            fontWeight: 500,
                                            letterSpacing: '0.02em'
                                        }}
                                    >
                                        {result}
                                    </Typography>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    endIcon={<ArrowRightAltIcon />}
                                    sx={{
                                        py: 2,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s ease',
                                        bgcolor: '#000000',
                                        '&:hover': {
                                            bgcolor: '#2C2C2C', // Slightly lighter black on hover
                                        }
                                    }}
                                    disabled={loading}
                                    type='submit'
                                >
                                    {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
                                </Button>
                            </Box>

                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </ThemeProvider>
    );
}