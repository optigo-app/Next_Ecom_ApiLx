"use client";
import React from "react";
import { Box, Typography, Button, Link, Container } from "@mui/material";
import Grid from "@mui/material/Grid"; // Using MUI v7 Grid
import { styled } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";

// Main Footer Container
const FooterRoot = styled("footer")(({ theme }) => ({
  backgroundColor: "var(--hm-surface, #ffffff)",
  borderTop: "1px solid var(--hm-border, #eaeaea)",
  paddingTop: "64px",
  paddingBottom: "32px",
  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
}));

// Logo Styles
const LogoText = styled(Typography)({
  fontSize: "28px",
  fontWeight: 700,
  color: "var(--hm-text, #000000)",
  lineHeight: 1,
  letterSpacing: "-0.5px",
});

const LogoSubtitle = styled(Typography)({
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "2.5px",
  color: "var(--hm-text-body, #222222)",
  marginTop: "4px",
  textTransform: "uppercase",
});

// Office Info Row Styles
const InfoRow = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "16px",
});

const InfoText = styled(Typography)({
  fontSize: "13px",
  color: "var(--hm-text-muted, #666666)",
  lineHeight: "1.6",
});

// Column Title
const ColumnTitle = styled(Typography)({
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "1px",
  color: "var(--hm-text-muted, #444444)",
  textTransform: "uppercase",
  marginBottom: "24px",
});

// Footer Links
const FooterLink = styled(Link)({
  display: "block",
  fontSize: "13px",
  color: "var(--hm-text-muted, #666666)",
  textDecoration: "none",
  marginBottom: "12px",
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: "var(--hm-text, #000000)",
  },
});

// Form and Input Styling
const SubscriptionText = styled(Typography)({
  fontSize: "13px",
  color: "var(--hm-text-muted, #666666)",
  lineHeight: "1.6",
  marginBottom: "20px",
});

const InputContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid var(--hm-border-strong, #cccccc)",
  marginTop: "16px",
});

const CustomInput = styled("input")({
  border: "none",
  outline: "none",
  width: "100%",
  padding: "12px 0",
  fontSize: "13px",
  fontFamily: "inherit",
  color: "var(--hm-text-body, #222222)",
  "&::placeholder": {
    color: "var(--hm-text-light, #999999)",
  },
});

const SignUpButton = styled(Button)({
  backgroundColor: "var(--hm-text, #000000)",
  color: "var(--hm-surface, #ffffff)",
  borderRadius: 0,
  padding: "10px 28px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "1px",
  height: "100%",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "var(--hm-text-body, #222222)",
    boxShadow: "none",
  },
});

export default function Footer() {
  return (
    <FooterRoot>
      <Container maxWidth="lg">
        {/* Main Grid Content */}
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Column 1: Logo & Office Details */}
          <Grid size={{ xs: 12, md: 3.5 }}>
            <Box mb={4}>
              <LogoText variant="h6">sonasons.</LogoText>
              <LogoSubtitle>LUXURY JEWELRY</LogoSubtitle>
            </Box>

            <Box sx={{ mt: 2 }}>
              <InfoRow>
                <LocationOnIcon
                  sx={{ fontSize: 18, color: "var(--hm-text-muted, #555555)", mt: "3px" }}
                />
                <InfoText>
                  D-Block G20, ITC(
                  <br />
                  International Trade Centre),
                  <br />
                  Majura Gate, Ring Road,
                </InfoText>
              </InfoRow>

              <InfoRow>
                <PhoneIcon sx={{ fontSize: 18, color: "var(--hm-text-muted, #555555)" }} />
                <InfoText>+919099887762</InfoText>
              </InfoRow>

              <InfoRow>
                <MailIcon sx={{ fontSize: 18, color: "var(--hm-text-muted, #555555)" }} />
                <InfoText>hello@optigoapps.com</InfoText>
              </InfoRow>
            </Box>
          </Grid>

          {/* Column 2: Our Company */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <ColumnTitle>OUR COMPANY</ColumnTitle>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Blogs</FooterLink>
            <FooterLink href="#">Contact Us</FooterLink>
            <FooterLink href="#">Terms and Conditions</FooterLink>
          </Grid>

          {/* Column 3: Customer Care */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <ColumnTitle>CUSTOMER CARE</ColumnTitle>
            <FooterLink href="#">Customer Services</FooterLink>
            <FooterLink href="#">Book an Appointment</FooterLink>
            <FooterLink href="#">Customize</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
          </Grid>

          {/* Column 4: Newsletter Sign up */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ColumnTitle>SIGN UP FOR OUR UPDATES</ColumnTitle>
            <SubscriptionText>
              Sign up for our updates Subscribe to our emails to get exclusive
              first access to new products, surveys, and events.
            </SubscriptionText>

            <InputContainer>
              <CustomInput
                type="email"
                placeholder="Enter Your Email"
                aria-label="Enter Your Email"
              />
              <SignUpButton variant="contained" disableElevation>
                SIGN UP
              </SignUpButton>
            </InputContainer>
          </Grid>
        </Grid>

        {/* Bottom Copyright Section */}
        <Box
          sx={{
            borderTop: "1px solid var(--hm-surface-subtle, #f4f4f4)",
            marginTop: "56px",
            paddingTop: "24px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "12px",
              color: "var(--hm-text-faint, #777777)",
              fontFamily: "inherit",
            }}
          >
            Copyright © 2026 sparrowinfo. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </FooterRoot>
  );
}
