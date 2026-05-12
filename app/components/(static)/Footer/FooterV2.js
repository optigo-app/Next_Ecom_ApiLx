import { Box, Container, Grid, Typography, IconButton, Divider, Stack, alpha } from "@mui/material";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { IoMdMail } from "react-icons/io";
import Link from "next/link";

const PremiumFooter = ({ companyInfoData, storeData, extraFlag, logos }) => {
    const parsedSocialLinks = (() => {
        try {
            return companyInfoData?.SocialLinkObj ? JSON.parse(companyInfoData.SocialLinkObj) : [];
        } catch (error) {
            console.error("Error parsing SocialLinkObj:", error);
            return [];
        }
    })();
    const year = new Date().getFullYear();
    const selectedFooteVal = 0;

    const MoveToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    const footerSections = [
        {
            title: "OUR COMPANY",
            links: [
                { label: "About Us", href: "/aboutUs" },
                // { label: "Careers", href: "/careers" },
                // { label: 'History', href: '/history' },
                { label: "Contact Us", href: "/contactUs" },
                { label: "Terms and Conditions", href: "/terms-and-conditions" },
            ],
        },
        // {
        //     title: "CUSTOMER CARE",
        //     links: [
        //         { label: "Customer Services", href: "/customerServices" },
        //         { label: "Book an Appoinment", href: "/appointment" },
        //         { label: "Customize", href: "/customize" },
        //         { label: "FAQ", href: "/faqs" },
        //     ],
        // },
    ];

    return (
        <Box
            component="footer"
            sx={{
                pt: { xs: 4, md: 6, lg: 8 },
                pb: { xs: 4, md: 5 },
                px: { xs: 2, sm: 4 },
                position: "relative",
                overflow: "hidden",
                bgcolor: "#fff",
                // boxShadow: "0px -6px 18px rgba(0,0,0,0.08)",
            }}
        >
            <Box>
                <Grid container spacing={{ xs: 4, md: 6, lg: 8 }}>
                    {/* Brand Section */}
                    <Grid
                        item
                        size={{
                            xs: 12,
                            lg: 3,
                        }}
                    >
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
                                    letterSpacing: "0.2em",
                                    mb: 3,
                                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                                }}
                            >
                                <Box component={Link} href="/">
                                    <Box
                                        component="img"
                                        src={logos?.web}
                                        sx={{
                                            width: "auto",
                                            cursor: "pointer",
                                            width: "220px",
                                        }}
                                        className="el_without_headerLogo_side"
                                    />
                                </Box>
                            </Typography>


                        </Box>
                    </Grid>

                    <Grid
                        item
                        size={{
                            xs: 12,
                            lg: 3,
                        }}
                    >
                        <Box
                            sx={{
                                pr: { lg: 4 },
                                mb: { xs: 2, lg: 0 },
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    letterSpacing: "0.1em",
                                    mb: 1,
                                    display: "block",
                                    fontSize: { xs: "0.85rem", md: "1rem" },
                                    color: "#656565",
                                    fontWeight: 400,
                                }}
                            >
                                OFFICE
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    lineHeight: 1.7,
                                    mb: 4,
                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                    color: "rgba(29, 50, 88, 0.85)",
                                    mt: 1,
                                }}
                            >
                                {selectedFooteVal === 0 ? (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        {/* Address */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 1.2,
                                            }}
                                        >
                                            <IoLocationOutline
                                                style={{
                                                    minWidth: 22,
                                                    minHeight: 22,
                                                    marginTop: 2,
                                                    color: "#656565bf",
                                                }}
                                            />
                                            <Typography
                                                component="span"
                                                sx={{
                                                    lineHeight: 1.6,
                                                    color: "#656565bf",
                                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                                }}
                                            >
                                                {companyInfoData?.FrontEndAddress}, {companyInfoData?.FrontEndCity}, {companyInfoData?.FrontEndState} - {companyInfoData?.FrontEndZipCode}
                                            </Typography>
                                        </Box>

                                        {/* Phone */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <IoMdCall
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    color: "#656565bf",
                                                }}
                                            />
                                            <Typography
                                                component="a"
                                                href={`tel:${companyInfoData?.FrontEndContactno1}`}
                                                sx={{
                                                    textDecoration: "none",
                                                    "&:hover": { textDecoration: "underline" },
                                                    color: "#656565bf",
                                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                                }}
                                            >
                                                {companyInfoData?.FrontEndContactno1}
                                            </Typography>
                                        </Box>

                                        {/* Email */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <IoMdMail
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    color: "#656565bf",
                                                }}
                                            />
                                            <Typography
                                                component="a"
                                                href={`mailto:${companyInfoData?.FrontEndEmail1}`}
                                                sx={{
                                                    textDecoration: "none",
                                                    "&:hover": { textDecoration: "underline" },
                                                    color: "#656565bf",
                                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                                }}
                                            >
                                                {companyInfoData?.FrontEndEmail1}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
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
                                                    color: "#656565bf",
                                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                                }}
                                            >
                                                1177 6th Avenue, Suite 5099, New York, NY 10036
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
                                            <Typography component="span" sx={{ color: "#656565bf", fontSize: { xs: "0.875rem", md: "0.9375rem" } }}>
                                                (646) 284-4466
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
                                                    color: "#656565bf",
                                                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                                }}
                                            >
                                                Contact.usa@elveepromise.com
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Footer Links Sections */}
                    {footerSections.map((section) => (
                        <Grid
                            item
                            size={{
                                xs: 12,
                                sm: 4,
                                lg: 2,
                            }}
                            key={section.title}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    letterSpacing: "0.1em",
                                    mb: 2,
                                    display: "block",
                                    fontSize: { xs: "0.85rem", md: "1rem" },
                                    color: "#656565",
                                    fontWeight: 400,
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Stack
                                spacing={{
                                    xs: 1,
                                    md: 1.5,
                                }}
                            >
                                {section.links.map((link) => (
                                    <Box
                                        key={link.label}
                                        component={Link}
                                        href={link.href}
                                        sx={{
                                            fontSize: { xs: "0.875rem", md: "0.9375rem" },
                                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                            display: "inline-block",
                                            position: "relative",
                                            textDecoration: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                            },
                                            color: "#656565bf",
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
                    <Grid
                        item
                        size={{
                            xs: 12,
                            lg: 4,
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                letterSpacing: "0.1em",
                                mb: 2,
                                display: "block",
                                fontSize: { xs: "0.85rem", md: "1rem" },
                                color: "#656565",
                                fontWeight: 400,
                            }}
                        >
                            Social Links
                        </Typography>
                        {/* Social Links */}
                        <Stack direction="row" spacing={1} flexWrap={"wrap"} gap={1}>
                            {parsedSocialLinks?.map((social, index) => {
                                return (
                                    <IconButton
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
                                            objectFit: 'cover',

                                            "&:hover": {
                                                transform: "translateY(-3px)",
                                                borderColor: "#000",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                                backgroundColor: "transparent",
                                            },

                                            "@media (max-width: 480px)": {
                                                width: 38,
                                                height: 38,
                                            },
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
                                                },
                                            }}
                                        />
                                    </IconButton>
                                );
                            })}
                        </Stack>

                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider
                    sx={{
                        my: { xs: 4, md: 5 },
                        borderColor: alpha("#ffffff", 0.06),
                    }}
                />

                {/* Bottom Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "center",
                        alignItems: { xs: "center", md: "center" },
                        gap: { xs: 3, md: 2 },
                    }}
                >
                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: "0.8125rem", md: "0.875rem" },
                            textAlign: {
                                xs: "center",
                                md: "left",
                            },
                        }}
                    >
                        Copyright &#169; {year} {storeData?.companyname}. All Rights Reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PremiumFooter;
