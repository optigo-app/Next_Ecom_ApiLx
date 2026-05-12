'use client'
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    ThemeProvider,
    createTheme,
    Divider,
    Stack,
    styled
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

// ─── Theme ──────────────────────────────────────────────────────────────────

const theme = createTheme({
    palette: {
        primary: { main: '#B78752' },
        background: {
            default: '#FAFAF7',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        h1: {
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            fontWeight: 500,
            color: '#1A1A1A',
            fontStyle: 'italic',
            lineHeight: 1.2,
        },
        h2: {
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        overline: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: '#B78752',
            fontSize: '0.7rem',
        },
        body2: {
            lineHeight: 1.8,
            color: '#666666',
            fontWeight: 300,
            fontSize: '0.95rem',
        }
    },
});

// ─── Styled Components ───────────────────────────────────────────────────────

const StoreImageWrapper = styled(Box)(({ theme }) => ({
    width: '75%',
    height: '650px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('md')]: {
        width: '100%',
        height: '450px',
        borderRadius: '0px', // Edge-to-edge on mobile
    },
}));

const InfoCard = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '-8%',
    right: '0',
    width: '42%',
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(6),
    zIndex: 2,
    boxShadow: '0 30px 70px rgba(0,0,0,0.12)',
    boxSizing: 'border-box',
    border: '1px solid #f0f0f0',
    [theme.breakpoints.down('md')]: {
        position: 'relative',
        width: '92%',
        margin: '-80px auto 0', // Aggressive pull-up overlap
        bottom: 'auto',
        right: 'auto',
        padding: theme.spacing(4, 3),
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.06)',
    },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DetailItem = ({ Icon, text }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
        <Icon sx={{ color: 'primary.main', fontSize: '1.2rem', mt: 0.5 }} />
        <Typography variant="body2">{text}</Typography>
    </Stack>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MaxPhysicalStore() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 12 }, overflow: 'hidden' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 3, md: 4 } }}>
                    
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 }, px: 2 }}>
                        <Typography variant="overline" display="block" sx={{ mb: 2 }}>
                            EXPERIENCE OUR CRAFT
                        </Typography>
                        <Typography variant="h1">
                            The Flagship Boutique
                        </Typography>
                    </Box>

                    {/* Content Stack */}
                    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        
                        <StoreImageWrapper>
                            <Box
                                component="img"
                                src="http://max.orail.co.in/WebSiteStaticImage/images/storeImage/store.png"
                                alt="Luxury Boutique Interior"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 2s ease',
                                    '&:hover': { transform: 'scale(1.05)' }
                                }}
                            />
                        </StoreImageWrapper>

                        <InfoCard>
                            <Typography variant="overline" display="block" sx={{ mb: 1.5 }}>
                                SURAT, INDIA
                            </Typography>
                            <Typography variant="h2" sx={{ mb: 3.5 }}>
                                Gujarat High Jewelry Studio
                            </Typography>

                            <Divider sx={{ mb: 4, opacity: 0.6 }} />

                            <DetailItem
                                Icon={LocationOnOutlinedIcon}
                                text="Plot No. M1 To M6, Gujarat Hira Bourse Gem & Jewellery Park, Pal-Hazira Road, Ichchhapore, Surat - 394510"
                            />

                            <DetailItem
                                Icon={AccessTimeOutlinedIcon}
                                text="Mon - Sun : 11:00 AM to 9:00 PM"
                            />

                            <DetailItem
                                Icon={PhoneOutlinedIcon}
                                text={<span style={{ fontWeight: 600, color: '#1A1A1A' }}>+91 9632587412</span>}
                            />

                            <Box sx={{ mt: 5 }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    sx={{ 
                                        bgcolor: '#1A1A1A', 
                                        color: '#FFF',
                                        py: 2,
                                        borderRadius: '4px',
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    PLAN YOUR VISIT
                                </Button>
                            </Box>
                        </InfoCard>

                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}