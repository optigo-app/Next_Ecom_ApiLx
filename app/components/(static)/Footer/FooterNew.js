"use client";


import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
    Stack,
    alpha,
} from '@mui/material';
import {
    Facebook,
    Instagram,
    YouTube,
    Twitter,
    Pinterest,
} from '@mui/icons-material';
import React, { memo, useEffect, useState } from 'react'
import { IoLocationOutline } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
// import { Form, Link } from 'react-router-dom';
import Link from "next/link";
import { IoMdMail } from "react-icons/io";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";






const PremiumFooter = ({ logos, storeData, companyInfoData: companyInfoDataProp }) => {
    const [email, setEmail] = useState('');
    const [companyInfoData, setCompanuInfoData] = useState(companyInfoDataProp);
    const [socialMediaData, setSocialMediaData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState();
    const Router = useNextRouterLikeRR().push;
    const navigation = url => Router(url);
    // const isLogin = useRecoilState(el_loginState)
    const { islogin, storeInit: storeInitContext } = useStore();
    const storeInit = storeData || storeInitContext || (typeof window !== "undefined" ? JSON?.parse(sessionStorage?.getItem("storeInit")) : null);
    const [selectedFooteVal, setSelectedVal] = useState(0);
    const year = React.useMemo(() => new Date().getFullYear(), []);

    const MoveToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        let interval;
        const fetchData = () => {
            try {
                const storeInitData = sessionStorage?.getItem("storeInit");
                if (storeInitData) {
                    const companyInfoDataStr = sessionStorage?.getItem("CompanyInfoData");
                    if (companyInfoDataStr) {
                        const parsedCompanyInfo = JSON?.parse(companyInfoDataStr);
                        setCompanuInfoData(parsedCompanyInfo);

                        const socialLinkStr = parsedCompanyInfo?.SocialLinkObj;
                        if (socialLinkStr) {
                            try {
                                const parsedSocialMediaData = JSON?.parse(socialLinkStr);
                                setSocialMediaData(parsedSocialMediaData);
                            } catch (error) {
                                console.error("Error parsing social media data:", error);
                            }
                        }
                    }

                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error parsing data from sessionStorage:", error);
                clearInterval(interval);
            }
        };

        fetchData();

        interval = setInterval(fetchData, 1000);

        // Cleanup function to clear interval on unmount
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    const handleSubmitNewlater = async (e) => {
        setLoading(true);

        const isValidEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        e.preventDefault();
        if (email?.trim() === "") {
            setLoading(false);
            setResult("Email is required.");
            return;
        } else if (!isValidEmail(email)) {
            setLoading(false);
            setResult("Please enter a valid email address.");
            return;
        } else {
            setResult("");
        }

        const newslater = storeInit?.newslatter;
        if (newslater && email) {
            const requestOptions = {
                method: "GET",
                redirect: "follow",
            };
            const newsletterUrl = `${newslater}${email}`;
            fetch(newsletterUrl)
                .then((response) => response.text())
                .then((result) => {
                    setResult(result); setLoading(false); setTimeout(() => {
                        setResult(""); // Clear the result after 3000 ms
                        setEmail('')

                    }, 3000);
                })
                .catch((error) => setResult(error));
        }
    };

    const alreadySubs = 'Already Subscribed.';

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNavigte = (navigateUrl, event) => {
        if (
            event?.ctrlKey ||     // Ctrl key
            event?.shiftKey ||    // Shift key
            event?.metaKey ||     // Meta key (Command key on macOS)
            (event?.button && event?.button === 1) // Middle mouse button
        ) {
            // Let the default behavior of the <a> tag handle the new tab opening
            return;
        }
        else {
            event.preventDefault();
            navigation(navigateUrl)
        }
    }


    const footerSections = [
        {
            title: 'OUR COMPANY',
            links: [
                { label: 'About Us', href: '/aboutUs' },
                { label: 'Blogs', href: '/blogs' },
                // { label: 'History', href: '/history' },
                { label: 'Contact Us', href: '/contactUs' },
                { label: 'Terms and Conditions', href: '/term&condition' },
            ],
        },
        {
            title: 'CUSTOMER CARE',
            links: [
                { label: 'Customer Services', href: '/customerServices' },
                { label: 'Book an Appoinment', href: '/appointment' },
                { label: 'Customize', href: '/customize' },
                { label: 'FAQ', href: '/faqs' },
            ],
        },
    ];


    return (
        <Box
            component="footer"
            sx={{
                pt: { xs: 4, md: 6, lg: 8 },
                pb: { xs: 4, md: 5 },
                px: { xs: 2, sm: 4 },
                position: 'relative',
                overflow: 'hidden',
                bgcolor: islogin ? '#f5f5f5b3' : '#fff',
                boxShadow: "0px -6px 18px rgba(0,0,0,0.08)",
            }}
        >

            <Box>
                <Grid container spacing={{ xs: 4, md: 6, lg: 8 }}>
                    {/* Brand Section */}
                    <Grid item size={{ xs: 12, lg: 2 }}>
                        <Box
                            sx={{
                                pr: { lg: 4 },
                                mb: { xs: 2, lg: 0 },
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 300,
                                    letterSpacing: '0.2em',
                                    mb: 3,
                                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                                }}
                                onClick={MoveToTop}
                            >
                                <Box
                                    component={Link}
                                    href="/"
                                    onClick={MoveToTop}
                                >
                                    <Box
                                        component="img"
                                        src={logos?.web}
                                        alt="elvee"
                                        sx={{
                                            width: "auto",
                                            cursor: "pointer",
                                        }}
                                        className="el_without_headerLogo_side"
                                    />
                                </Box>
                            </Typography>


                            {/* Social Links */}
                            <Stack direction="row" spacing={1}
                            >
                                {socialMediaData?.map((social, index) => {
                                    return <IconButton
                                        key={index}
                                        component="a"
                                        href={social.SLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.SName}
                                        sx={{
                                            width: 37,
                                            height: 37,
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            backgroundColor: "transparent",
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.3s ease",

                                            "&:hover": {
                                                transform: "translateY(-3px)",
                                                borderColor: "#000",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                                backgroundColor: "transparent",
                                            },

                                            "@media (max-width: 480px)": {
                                                width: 38,
                                                height: 38,
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={social.SImgPath}
                                            alt={social.SName}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                transition: "all 0.3s ease",

                                                "&:hover": {
                                                    transform: "scale(1.08)",
                                                }
                                            }}
                                        />
                                    </IconButton>
                                })}

                            </Stack>

                        </Box>
                    </Grid>

                    <Grid item   size={{ xs: 12,sm:4, lg: 2 }}>
                        <Box
                            sx={{
                                pr: { lg: 4 },
                                mb: { xs: 2, lg: 0 },
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    letterSpacing: '0.1em',
                                    mb: 1,
                                    display: 'block',
                                    fontSize: { xs: '0.85rem', md: '1rem' },
                                    color: '#656565',
                                    fontWeight: 400
                                }}
                            >
                                OFFICE
                            </Typography>
                            <Box
                                variant="body2"
                                sx={{
                                    lineHeight: 1.7,
                                    mb: 4,
                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                    color: "rgba(29, 50, 88, 0.85)",
                                    mt: 1
                                }}
                            >

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        {/* US Office Address */}
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                                            <IoLocationOutline
                                                style={{
                                                    width: 22,
                                                    height: 22,
                                                    marginTop: 2,
                                                }}
                                            />
                                            <Typography
                                                component="span"
                                                sx={{
                                                    lineHeight: 1.6,
                                                    color: '#656565bf',
                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                }}
                                            >
                                                D-Block G20, ITC( International Trade Centre), Majura Gate, Ring Road,
                                            </Typography>
                                        </Box>

                                        {/* Phone */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <IoMdCall
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                }}
                                            />
                                            <Typography
                                                component="span"
                                                sx={{ color: '#656565bf', fontSize: { xs: '0.875rem', md: '0.9375rem' }, }}
                                            >
                                                +919099887762
                                            </Typography>
                                        </Box>

                                        {/* Email */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <IoMdMail
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                }}
                                            />
                                            <Typography
                                                component="span"
                                                sx={{
                                                    color: '#656565bf',
                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                }}
                                            >
                                                hello@optigoapps.com
                                            </Typography>
                                        </Box>
                                    </Box>
                              
                            </Box>

                        </Box>
                    </Grid>

                    {/* Footer Links Sections */}
                    {footerSections.map((section) => (
                        <Grid item  size={{ xs: 12,sm:4, lg: 2 }} key={section.title}>
                            <Typography
                                variant="overline"
                                sx={{
                                    letterSpacing: '0.1em',
                                    mb: 2,
                                    display: 'block',
                                    fontSize: { xs: '0.85rem', md: '1rem' },
                                    color: '#656565',
                                    fontWeight: 400
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Stack spacing={{
                                xs: 1,
                                md: 1.5
                            }}>
                                {section.links.map((link) => (
                                    <Box
                                        key={link.label}
                                        component={Link}
                                        href={link.href}
                                        sx={{
                                            fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'inline-block',
                                            position: 'relative',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                            color: '#656565bf',
                                            fontWeight: 400,
                                        }}
                                    >
                                        {link.label}
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                    ))}

                    {/* Newsletter Section */}
                    <Grid item  size={{ xs: 12, lg: 3 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                letterSpacing: '0.1em',
                                mb: 1,
                                display: 'block',
                                fontSize: { xs: '0.85rem', md: '1rem' },
                                color: '#656565',
                                fontWeight: 400
                            }}
                        >
                            Sign up for our updates
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: 1.7,
                                mb: 3,
                                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                color: '#656565bf',
                                fontWeight: 400,
                            }}
                        >
                            Sign up for our updates Subscribe to our emails to get exclusive first access to new products, surveys, and events.
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmitNewlater}
                            sx={{
                                display: 'flex',
                                gap: 0,
                                position: 'relative',
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '0.9375rem',
                                        borderRadius: '0',
                                        color: '#656565',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '& fieldset': {
                                            border: 'none',
                                            borderBottom: '1px solid #000000',
                                            borderRadius: '0',
                                        },
                                        '&:hover': {
                                            backgroundColor: alpha('#ffffff', 0.05),
                                            '& fieldset': {
                                                borderColor: 'none',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: alpha('#ffffff', 0.05),
                                            '& fieldset': {
                                                borderColor: '#000000',
                                                borderWidth: '1px',
                                            },
                                        },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        py: 1.5,
                                        '&::placeholder': {
                                            opacity: 1,
                                        },
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#000000',
                                    borderRadius: '0 !important',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.9375rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                    },
                                    width: '120px'
                                }}
                            >
                                SIGN UP
                            </Button>
                        </Box>
                        {
                            loading ? <span className="elv_error_message">Loading...</span> : (
                                <>
                                    {result && (
                                        <span
                                            className="elv_error_message"
                                            style={{
                                                color: result.startsWith("Thank You!") ? "#04AF70" : "#FF0000",
                                                marginTop: "0px",
                                                display: "block",
                                            }}
                                        >
                                            {result}
                                        </span>
                                    )}
                                </>
                            )}
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider
                    sx={{
                        my: { xs: 4, md: 5 },
                        borderColor: alpha('#ffffff', 0.06),
                    }}
                />

                {/* Bottom Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: { xs: 3, md: 2 },
                    }}
                >
                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '0.8125rem', md: '0.875rem' },
                            textAlign: {
                                xs: 'center',
                                md: 'left'
                            }
                        }}
                    >
                        Copyright &#169; {year} {storeInit?.companyname}. All Rights Reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PremiumFooter;




