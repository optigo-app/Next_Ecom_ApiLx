

'use client';

import {
    Box,
    Container,
    Grid,
    Typography,
} from '@mui/material';

import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';

const features = [
    {
        icon: <LocalShippingOutlinedIcon />,
        title: 'FREE SHIPPING & RETURNS',
    },
    {
        icon: <VerifiedUserOutlinedIcon />,
        title: 'FREE LIFETIME WARRANTY',
    },
    {
        icon: <SupportAgentOutlinedIcon />,
        title: '24/7 CUSTOMER SUPPORT',
    },
    {
        icon: <DiamondOutlinedIcon />,
        title: 'LIFETIME DIAMOND UPGRADE',
    },
    {
        icon: <StraightenOutlinedIcon />,
        title: 'FREE 1-YEAR RESIZING',
    },
];

export default function TrustSection() {
    return (
        <Box
            sx={{
                background: '#0d1232',
                py: {
                    xs: 6,
                    md: 6,
                },
            }}
            id="customerService"
        >
            <Container maxWidth="xl">
                <Typography
                    sx={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: {
                            xs: '28px',
                            md: '40px',
                        },
                        fontWeight: 400,
                        fontFamily: '"Cormorant Garamond", serif',
                        mb: 5,
                    }}
                >
                    We've Got You Covered
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {features.map((item, index) => (
                        <Grid
                            key={index}
                            size={{
                                xs: 6,
                                sm: 4,
                                md: 2.4,
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    cursor: 'pointer',

                                    '&:hover .icon-circle': {
                                        transform: 'translateY(-8px)',
                                        borderColor: '#d4af37',
                                        boxShadow:
                                            '0 12px 30px rgba(212,175,55,0.25)',
                                    },

                                    '&:hover .icon': {
                                        color: '#d4af37',
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <Box
                                    className="icon-circle"
                                    sx={{
                                        width: 84,
                                        height: 84,
                                        mx: 'auto',
                                        mb: 2.5,
                                        borderRadius: '50%',
                                        background:
                                            'rgba(255,255,255,0.08)',
                                        border:
                                            '1px solid rgba(255,255,255,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: '.35s ease',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <Box
                                        className="icon"
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',

                                            background: '#3d5960',

                                            boxShadow: `
      8px 8px 16px rgba(0,0,0,0.35),
      -4px -4px 10px rgba(255,255,255,0.08),
      inset 0 1px 2px rgba(255,255,255,0.08)
    `,

                                            transition: '.35s ease',

                                            '& svg': {
                                                fontSize: 34,
                                                color: '#d4af37',
                                                filter: 'drop-shadow(0 2px 4px rgba(212,175,55,0.35))',
                                            },
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                </Box>

                                <Typography
                                    sx={{
                                        color: 'rgba(255,255,255,.85)',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}