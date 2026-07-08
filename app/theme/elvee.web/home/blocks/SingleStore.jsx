
"use client";

import { Box, Typography, Grid, Container } from "@mui/material";
import MaxHeader from "./Header";
import { useEffect, useState } from "react";

const StoreLocator = () => {
    // Ensure this path function is working as expected in your project
    const Storeimage =  "/Singlestore.png";
    const [companyInfoData, setCompanuInfoData] = useState();
    useEffect(() => {
        let interval;
        const fetchData = () => {
            const companyInfoDataStr = sessionStorage?.getItem("CompanyInfoData");
            if (companyInfoDataStr) {
                const parsedCompanyInfo = JSON?.parse(companyInfoDataStr);
                setCompanuInfoData(parsedCompanyInfo);
            }
        }
        fetchData();
        interval = setInterval(fetchData, 1000);
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [])
    return (
        <Box
            sx={{
                width: "100%",
                py: 8,
                bgcolor: "#fff",
                display: "flex",
                justifyContent: "center",
                flexDirection: 'column'
            }}
        >
            <MaxHeader title="Physical Store " alignment="center" />

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={4} alignItems="center">
                    {/* Image Section */}
                    <Grid item size={{ xs: 12, md: 7 }}>
                        <Box
                            component="img"
                            src={Storeimage}
                            alt="Discover our store"
                            sx={{
                                width: "100%",
                                height: "100%",
                                // Adjusted aspect ratio to look more substantial like the reference
                                aspectRatio: { xs: "16/9", md: "16/10" },
                                objectFit: "cover",
                                borderRadius: "12px",
                                // Subtle shadow for depth
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                display: "block",
                            }}
                        />
                    </Grid>

                    {/* Address Card Section */}
                    <Grid item size={{ xs: 12, md: 5 }}>
                        <Box
                            sx={{
                                backgroundColor: "#FFF6F0", // Matches the peach/cream background
                                borderRadius: "12px",
                                p: { xs: 3, md: 5 }, // More padding for a premium look
                                boxShadow: "none", // The reference looks flat/clean without a heavy shadow here
                                height: "fit-content", // KEY FIX: Removes scrollbar
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}
                        >
                            {/* Main Title */}
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 600,
                                    color: "#2F2F2F", // Darker grey for better contrast
                                    fontFamily: 'serif', // Optional: if you have a serif font configured
                                    mb: 1
                                }}
                            >
                                Step Into Elegance
                            </Typography>

                            {/* Subtext */}
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#555",
                                    lineHeight: 1.6,
                                    fontSize: "0.95rem",
                                    mb: 3
                                }}
                            >
                                Discover jewelry that tells your story —<br />
                                refined, radiant, and designed for you.
                            </Typography>

                            {/* Contact Row */}
                            <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", mb: 1 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#4A4A4A", fontWeight: 500, mr: 1 }}
                                >
                                    Contact:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="a"
                                    href="tel:9811290235"
                                    sx={{
                                        color: "#0066CC", // Standard link blue
                                        fontWeight: 500,
                                        textDecoration: "none"
                                    }}
                                >
                                    9811290235
                                </Typography>
                            </Box>

                            {/* Address Text */}
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#555",
                                    lineHeight: 1.6,
                                    fontSize: "0.95rem",
                                    mb: 2
                                }}
                            >
                                2106, Desh Bandhu Gupta Rd, Block 47, Beadonpuaara, Karol Bagh, New Delhi, Delhi, 110005
                            </Typography>

                            {/* Details: Timings & Services */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: "#4A4A4A", fontSize: "0.9rem" }}>
                                    <Box component="span" sx={{ fontWeight: 700, color: "#000" }}>Timings:</Box> 11:00 am to 8:00 pm
                                </Typography>

                                {/* <Typography variant="body2" sx={{ color: "#4A4A4A", fontSize: "0.9rem" }}>
                                    <Box component="span" sx={{ fontWeight: 700, color: "#000" }}>Services:</Box> In-house stylist | Bridal Studio |
                                    Design Customization
                                </Typography> */}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
    return (
        <Box
            sx={{
                width: "100%",
                py: 8,
                bgcolor: "#fff",
                display: "flex",
                justifyContent: "center",
                flexDirection: 'column'
            }}
        >
            <MaxHeader title="Physical Store " alignment="center" />

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={4} alignItems="center">
                    {/* Image Section */}
                    <Grid item xs={12} md={7}>
                        <Box
                            component="img"
                            src={Storeimage}
                            alt="Discover our store"
                            sx={{
                                width: "100%",
                                height: "100%",
                                // Adjusted aspect ratio to look more substantial like the reference
                                aspectRatio: { xs: "16/9", md: "16/10" },
                                objectFit: "cover",
                                borderRadius: "12px",
                                // Subtle shadow for depth
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                display: "block",
                            }}
                        />
                    </Grid>

                    {/* Address Card Section */}
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                backgroundColor: "#FFF6F0", // Matches the peach/cream background
                                borderRadius: "12px",
                                p: { xs: 3, md: 5 }, // More padding for a premium look
                                boxShadow: "none", // The reference looks flat/clean without a heavy shadow here
                                height: "fit-content", // KEY FIX: Removes scrollbar
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}
                        >
                            {/* Small Label */}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#D46A2C",
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    fontSize: "0.85rem",
                                    mb: 0.5
                                }}
                            >
                                {companyInfoData?.FrontEndCity}
                            </Typography>

                            {/* Main Title */}
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 600,
                                    color: "#2F2F2F", // Darker grey for better contrast
                                    fontFamily: 'serif', // Optional: if you have a serif font configured
                                    mb: 2
                                }}
                            >
                                {companyInfoData?.FrontEndState}
                            </Typography>

                            {/* Contact Row */}
                            <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", mb: 1 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#4A4A4A", fontWeight: 500, mr: 1 }}
                                >
                                    Contact:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="a"
                                    href={`tel:${companyInfoData?.FrontEndContactno1}`}
                                    sx={{
                                        color: "#0066CC", // Standard link blue
                                        fontWeight: 500,
                                        textDecoration: "none"
                                    }}
                                >
                                    9632587412
                                </Typography>
                            </Box>

                            {/* Address Text */}
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#555",
                                    lineHeight: 1.6,
                                    fontSize: "0.95rem",
                                    mb: 2
                                }}
                            >
                                {companyInfoData?.FrontEndAddress},{" "}
                                {companyInfoData?.FrontEndCity},{" "}
                                {companyInfoData?.FrontEndState} -{" "}
                                {companyInfoData?.FrontEndZipCode}
                            </Typography>

                            {/* Details: Timings & Services */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: "#4A4A4A", fontSize: "0.9rem" }}>
                                    <Box component="span" sx={{ fontWeight: 700, color: "#000" }}>Timings:</Box> 11:00 am to 9:00 pm
                                </Typography>

                                <Typography variant="body2" sx={{ color: "#4A4A4A", fontSize: "0.9rem" }}>
                                    <Box component="span" sx={{ fontWeight: 700, color: "#000" }}>Services:</Box> In-house stylist | Bridal Studio |
                                    Design Customization
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default StoreLocator;