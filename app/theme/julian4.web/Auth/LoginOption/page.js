'use client';
import React from "react";
import "./LoginOption.modul.scss";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LoginOption = ({ params, searchParams }) => {
  const {
    LoginRedirect = "",
    loginRedirect: loginRedirLow = "",
    search = "",
  } = searchParams || {};
  const loginRedirect = LoginRedirect || loginRedirLow || search || "";

  const getSecurityKeyFromUrl = () => {
    if (searchParams?.SK) return searchParams.SK;
    if (searchParams?.SecurityKey) return searchParams.SecurityKey;

    if (loginRedirect) {
      const urlText = decodeURIComponent(loginRedirect);
      const kMatch = urlText.match(/\/K=([^/?&#]+)/);
      if (kMatch) {
        try {
          return atob(kMatch[1]);
        } catch (e) {}
      }

      const skMatch = urlText.match(/[?&](SK|SecurityKey)=([^&]+)/);
      if (skMatch) return skMatch[2];
    }
    return "";
  };

  const securityKey = getSecurityKeyFromUrl();
  const queryParamStr = `${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}` : securityKey ? `?SK=${encodeURIComponent(securityKey)}` : ""}`;

  const redirectEmailUrl = `/ContinueWithEmail${queryParamStr}`;
  const redirectMobileUrl = `/ContinueWithMobile${queryParamStr}`;
  const redirectRegisterUrl = `/register${queryParamStr}`;

  return (
    <Box
      className="smr_Loginoption_bl"
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fbfbfc",
        py: { xs: 2, sm: 4, md: 6 },
        px: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "stretch" },
            justifyContent: "center",
            gap: { xs: 3, md: 4, lg: 5 },
            width: "100%",
            maxWidth: "1040px",
            mx: "auto",
          }}
        >
          {/* Left Column - Fashion Editorial Visual Showcase */}
          <Box
            sx={{
              flex: { xs: "none", md: "0 0 460px", lg: "0 0 490px" },
              width: { xs: "100%", sm: "400px", md: "460px", lg: "490px" },
              height: { xs: "260px", sm: "360px", md: "auto" },
              minHeight: { md: "540px", lg: "580px" },
              borderRadius: "0px",
              overflow: "hidden",
              position: "relative",
              bgcolor: "#f1ede7",
              backgroundImage: "url('/Assets/auth_fashion_model.jpg')",
              backgroundSize: "cover",
              backgroundPosition: { xs: "center 20%", md: "center 15%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Ambient Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                p: { xs: 2, sm: 2.5, md: 3 },
                color: "#ffffff",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  opacity: 0.9,
                  fontSize: { xs: "10px", sm: "11px" },
                  display: "block",
                  mb: 0.25,
                }}
              >
                Exclusive Fine Jewelry
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.25,
                  textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                Elegance & Precision in Every Creation
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Login Options Form Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", sm: "440px", md: "460px" },
              width: "100%",
              height: "auto",
              minHeight: { md: "540px", lg: "580px" },
              bgcolor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 3, sm: 4, md: 5 },
              boxSizing: "border-box",
            }}
          >
            {/* Main Interactive Form Block */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                gap: { xs: 2.5, sm: 3 },
                maxWidth: "400px",
                mx: "auto",
                width: "100%",
              }}
            >
              {/* Header */}
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: { xs: "1.4rem", sm: "1.7rem", md: "1.9rem" },
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25,
                    mb: 0.75,
                  }}
                >
                  Login to your account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    lineHeight: 1.5,
                  }}
                >
                  Welcome back! Choose how you would like to sign in to your
                  account.
                </Typography>
              </Box>

              {/* Login Method Buttons with theme classes applied */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.75,
                  width: "100%",
                }}
              >
                <Button
                  component={Link}
                  href={redirectEmailUrl}
                  fullWidth
                  size="large"
                  className="loginMail"
                  startIcon={<EmailOutlinedIcon sx={{ fontSize: { xs: "19px", sm: "21px" } }} />}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: "16px", sm: "18px" }, opacity: 0.8 }} />}
                  sx={{
                    "& .MuiButton-startIcon": {
                      marginRight: "12px",
                    },
                  }}
                >
                  <span style={{ flex: 1, textAlign: "left" }}>
                    Continue with Email
                  </span>
                </Button>

                <Button
                  component={Link}
                  href={redirectMobileUrl}
                  fullWidth
                  size="large"
                  className="loginMobile"
                  startIcon={<SmartphoneOutlinedIcon sx={{ fontSize: { xs: "19px", sm: "21px" } }} />}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: "16px", sm: "18px" }, opacity: 0.7 }} />}
                  sx={{
                    "& .MuiButton-startIcon": {
                      marginRight: "12px",
                    },
                  }}
                >
                  <span style={{ flex: 1, textAlign: "left" }}>
                    Log in with Mobile Number
                  </span>
                </Button>
              </Box>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", my: 0.5 }}>
                <Divider sx={{ flex: 1, borderColor: "#e5e7eb" }} />
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    color: "#9ca3af",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                  }}
                >
                  or
                </Typography>
                <Divider sx={{ flex: 1, borderColor: "#e5e7eb" }} />
              </Box>

              {/* Sign up prompt */}
              <Box textAlign="center">
                <Typography
                  variant="body2"
                  sx={{ color: "#4b5563", fontSize: { xs: "0.88rem", sm: "0.92rem" } }}
                >
                  Don&apos;t have an account?{" "}
                  <Box
                    component={Link}
                    href={redirectRegisterUrl}
                    sx={{
                      color: "#111827",
                      fontWeight: 700,
                      textDecoration: "none",
                      borderBottom: "1.5px solid #111827",
                      pb: "1px",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        color: "#000",
                        borderColor: "#000",
                        opacity: 0.8,
                      },
                    }}
                  >
                    Sign up now
                  </Box>
                </Typography>
              </Box>
            </Box>

            {/* Legal Footer Anchored at Bottom */}
            <Box sx={{ pt: 2.5, mt: "auto", borderTop: "1px solid #f3f4f6", maxWidth: "400px", mx: "auto", width: "100%" }}>
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: { xs: "11px", sm: "11.5px" },
                  lineHeight: 1.5,
                  display: "block",
                }}
              >
                By continuing, you agree to our{" "}
                <Box
                  component={Link}
                  href="/terms-and-conditions"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    textDecoration: "underline",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Terms of Use
                </Box>{" "}
                and{" "}
                <Box
                  component={Link}
                  href="/privacyPolicy"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    textDecoration: "underline",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Privacy Policy
                </Box>
                .
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginOption;
