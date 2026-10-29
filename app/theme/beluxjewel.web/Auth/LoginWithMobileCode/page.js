'use client';
import React from 'react';
import OTP from './OTP';
import './LoginWithMobileCode.modul.scss';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOtpLogin } from '@/app/(core)/hooks/Auth/useOtpLogin';

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LoginWithMobileCode({ params, searchParams }) {
  const router = useRouter();
  const navigation = (path) => router.push(path);
  const {
    mobileNo,
    otp: enterOTP,
    setOtp: setEnterOTP,
    errors,
    isLoading,
    resendTimer,
    cancelUrl: cancelRedireactUrl,
    handleSubmit,
    handleResendCode,
  } = useOtpLogin({ method: 'mobile', searchParams });

  return (
    <Box
      className="fg_smr_loginmobileCodeMain"
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fbfbfc",
        py: { xs: 2, sm: 4, md: 6 },
        px: { xs: 1.5, sm: 2, md: 3 },
        position: "relative",
      }}
    >
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: 1301,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.3)",
        }}
      >
        <CircularProgress size={45} thickness={4} sx={{ color: "#fff" }} />
      </Backdrop>

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
              minHeight: { md: "560px", lg: "600px" },
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

          {/* Right Column - Enter OTP Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", sm: "440px", md: "460px" },
              width: "100%",
              height: "auto",
              minHeight: { md: "560px", lg: "600px" },
              bgcolor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 2.5, sm: 3.5, md: 4 },
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: "18px" }} />}
              onClick={() => navigation(cancelRedireactUrl)}
              sx={{
                alignSelf: "flex-start",
                mb: { xs: 1, sm: 2 },
                color: "#6b7280",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.88rem",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#111827",
                },
              }}
            >
              Back to options
            </Button>

            <Stack
              spacing={{ xs: 2.5, sm: 3 }}
              sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: { xs: "1.35rem", sm: "1.65rem", md: "1.85rem" },
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    mb: 0.75,
                  }}
                >
                  Enter Verification Code
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    lineHeight: 1.45,
                  }}
                >
                  We sent a code to <strong style={{ color: "#111827" }}>{mobileNo}</strong>
                </Typography>
              </Box>

              <Box sx={{ width: "100%" }}>
                <Stack spacing={2.5}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <OTP
                      separator={<span> </span>}
                      value={enterOTP}
                      onChange={setEnterOTP}
                      length={6}
                      onSubmit={handleSubmit}
                    />
                  </Box>

                  {errors.otp && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", textAlign: "center", display: "block" }}
                    >
                      {errors.otp}
                    </Typography>
                  )}

                  {/* Resend Timer */}
                  <Box textAlign="center">
                    {resendTimer > 0 ? (
                      <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.88rem" }}>
                        Resend code in <strong style={{ color: "#111827" }}>{resendTimer}s</strong>
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        onClick={handleResendCode}
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "0.88rem",
                        }}
                      >
                        Resend Code
                      </Typography>
                    )}
                  </Box>

                  <Button
                    onClick={handleSubmit}
                    fullWidth
                    size="large"
                    className="submitBtnForgot"
                    disabled={isLoading || !enterOTP.trim()}
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>

                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    onClick={() => navigation(cancelRedireactUrl)}
                    disabled={isLoading}
                    sx={{
                      py: 1,
                      textTransform: "none",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      color: "#6b7280",
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "#f3f4f6",
                        color: "#111827",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: { xs: "11px", sm: "11.5px" },
                  lineHeight: 1.5,
                  display: "block",
                  mt: 1,
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
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
