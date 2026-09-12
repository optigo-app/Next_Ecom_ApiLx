'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ContimueWithMobileAPI } from '@/app/(core)/utils/API/Auth/ContimueWithMobileAPI';
import './ContimueWithMobile.modul.scss';
import OTPContainer from '@/app/(core)/utils/Glob_Functions/Otpflow/App';
import ContinueMobile from '@/app/(core)/utils/Glob_Functions/CountryDropDown/ContinueMobile';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function ContinueWithMobile({ params, searchParams, storeInit }) {
  const router = useRouter();
  const [mobileNo, setMobileNo] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = (path) => router.push(path);
  const [isOpen, setIsOpen] = useState(false);
  const [Countrycodestate, setCountrycodestate] = useState();

  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";

  const updatedSearch = search?.replace('?LoginRedirect=', '');
  const redirectMobileUrl = `/LoginWithMobileCode?${updatedSearch}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;
  const redirectSignUpUrl = `/register?${updatedSearch}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;
  const cancelRedireactUrl = `/LoginOption?${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;

  useEffect(() => {
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("Countrycodestate");
  }, []);

  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    const trimmedValue = value.trim();
    const formattedValue = trimmedValue.replace(/\s/g, '');
    setter(formattedValue);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!mobileNo.trim()) {
      setErrors({ mobileNo: 'Mobile No. is required' });
      return;
    }
    const { AllCode } = (() => {
      try {
        const countryList = sessionStorage.getItem("CountryCodeListApi");
        return {
          AllCode: countryList ? JSON.parse(countryList) : []
        };
      } catch {
        return { AllCode: [] };
      }
    })();

    const phonecode = AllCode?.find((val) => (val?.mobileprefix == Countrycodestate || val?.MobilePrefix == Countrycodestate));
    const requiredLength = phonecode?.PhoneLength || phonecode?.phonelength || 10;
    const isValid = new RegExp(`^\\d{${requiredLength}}$`).test(mobileNo.trim());
    if (!isValid) {
      setErrors({ mobileNo: `Mobile number must be ${requiredLength} digits.` });
      setIsSubmitting(false);
      setIsLoading(false);
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
    ContimueWithMobileAPI(mobileNo, Countrycodestate).then((response) => {
      setIsLoading(false);
      if (response?.Status == 400) {
        toast.error(response?.Message);
        setIsSubmitting(false);
        return;
      }
      if (response?.Data?.rd[0]?.stat === 1 && response?.Data?.rd[0]?.islead === 1) {
        toast.error('You are not a customer, contact to admin');
        setIsSubmitting(false);
      } else if (response?.Data?.rd[0]?.stat === 1 && response?.Data?.rd[0]?.islead === 0) {
        toast.success('OTP send Successfully');
        navigation(redirectMobileUrl);
        sessionStorage.setItem('registerMobile', mobileNo);
        sessionStorage.setItem('Countrycodestate', Countrycodestate);
        sessionStorage.removeItem("registerEmail");
        setIsSubmitting(false);
      } else {
        if (Countrycodestate != "91") {
          navigation(redirectSignUpUrl);
          sessionStorage.setItem('Countrycodestate', Countrycodestate);
          sessionStorage.setItem('registerMobile', mobileNo);
          sessionStorage.removeItem("registerEmail");
        } else if (Countrycodestate == "91" && storeInit?.IsEcomOtpVerification == 0) {
          navigation(redirectSignUpUrl);
          sessionStorage.setItem('Countrycodestate', Countrycodestate);
          sessionStorage.setItem('registerMobile', mobileNo);
          sessionStorage.removeItem("registerEmail");
        } else {
          sessionStorage.setItem('Countrycodestate', Countrycodestate);
          sessionStorage.setItem('registerMobile', mobileNo);
          sessionStorage.removeItem("registerEmail");
          setIsOpen(true);
          setIsSubmitting(false);
        }
      }
    }).catch((err) => {
      console.log(err);
      setIsSubmitting(false);
      setIsLoading(false);
    });
  };

  return (
    <Box
      className="fg_smr_continuMobile_bl"
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
      {/* Loading Overlay */}
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

      {/* OTP Modal Container */}
      {Boolean(storeInit?.IsEcomOtpVerification === 1 && Countrycodestate == "91") && (
        <OTPContainer
          mobileNo={mobileNo?.trim()}
          isOpen={isOpen}
          type='mobile'
          setIsOpen={() => setIsOpen(!isOpen)}
          onClose={() => setIsOpen(false)}
          navigation={navigation}
          location={search}
          onResend={handleSubmit}
          isLoading={isLoading}
          searchParams={searchParams}
        />
      )}

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
              minHeight: { md: "580px", lg: "620px" },
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

          {/* Right Column - Continue with Mobile Form Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", sm: "440px", md: "460px" },
              width: "100%",
              height: "auto",
              minHeight: { md: "580px", lg: "620px" },
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
              {/* Title & Subtitle */}
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
                  Continue with Mobile
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    lineHeight: 1.45,
                  }}
                >
                  We&apos;ll check if you have an account, and help create one if you don&apos;t.
                </Typography>
              </Box>

              {/* Form Input & Submission */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                sx={{ width: "100%" }}
              >
                <ContinueMobile
                  setMobileNo={setMobileNo}
                  mobileNo={mobileNo}
                  handleInputChange={handleInputChange}
                  Errors={errors}
                  setErrors={setErrors}
                  Countrycodestate={Countrycodestate}
                  setCountrycodestate={setCountrycodestate}
                  onSubmit={handleSubmit}
                />

                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    className="submitBtnForgot"
                    disabled={isLoading || isSubmitting || !mobileNo.trim()}
                  >
                    {isLoading || isSubmitting ? "Processing..." : "Continue"}
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

              {/* Legal Footer */}
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
