"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Register.modul.scss";
import CryptoJS from "crypto-js";
import { RegisterAPI } from "@/app/(core)/utils/API/Auth/RegisterAPI";
import { getEventMessage } from '@/app/(core)/constants/EventMessage';
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import Cookies from 'js-cookie';
import { CurrencyComboAPI } from '@/app/(core)/utils/API/Combo/CurrencyComboAPI';
import { MetalColorCombo } from '@/app/(core)/utils/API/Combo/MetalColorCombo';
import { MetalTypeComboAPI } from '@/app/(core)/utils/API/Combo/MetalTypeComboAPI';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { generateToken } from '@/app/(core)/utils/Glob_Functions/Tokenizer';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Backdrop,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdminStatusDialog from "./components/AdminStatusDialog";
import { currentActiveFlow } from "@/app/(core)/constants/data";

export default function B2CRegister({ searchParams }) {
  const { setislogin, setCartCountNum, setWishCountNum } = useStore();
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();
  const [isLoading, setIsLoading] = useState(false);

  const [adminStatusDialog, setAdminStatusDialog] = useState({
    open: false,
    type: "Approved",
    message: "Your account request has been rejected. Please contact support for more details."
  });
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [taxId, setTaxId] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [termsError, setTermsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Errors, setErrors] = useState({});
  const [Countrycodestate, setCountrycodestate] = useState("");
  const [countryShortName, setCountryShortName] = useState("IND");
  const [isMobileThrough, setIsMobileThrough] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const mobileNoRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const isOtpNewUi = true;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}`;
  const singupRedirectUrl = `/LoginOption?LoginRedirect=${search}`;

  const handleKeyDown = (event, nextRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (nextRef?.current) nextRef.current.focus();
    }
  };

  useEffect(() => {
    const queryEmail = searchParams?.email ? decodeURIComponent(searchParams.email) : "";
    const storedEmail = queryEmail || getSession("email") || getSession("registerEmail");
    const routeMobileNo = getSession("registerMobile");
    const storedCountryCode = getSession("Countrycodestate");

    if (storedEmail) {
      setSession("email", storedEmail);
      const savedReviewEmail = getSession("b2b_registered_email") || (typeof localStorage !== "undefined" ? localStorage.getItem("b2b_registered_email") : null);
      if (savedReviewEmail && savedReviewEmail !== storedEmail) {
        sessionStorage.removeItem("b2b_registered_email");
        sessionStorage.removeItem("b2b_registered_password");
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("b2b_registered_email");
          localStorage.removeItem("b2b_registered_password");
        }
      }
    }

    if (routeMobileNo) {
      setMobileNo(routeMobileNo);
      setIsMobileThrough(true);
      if (mobileNoRef.current) mobileNoRef.current.disabled = true;
    } else {
      setIsMobileThrough(false);
      if (mobileNoRef.current) mobileNoRef.current.disabled = false;
    }

    if (storedCountryCode) {
      setCountrycodestate(storedCountryCode);
    }

    if (storedEmail) {
      setEmail(storedEmail);
      if (emailRef.current) emailRef.current.disabled = true;
    } else {
      if (emailRef.current) emailRef.current.disabled = false;
    }
  }, [location.searchParams, searchParams?.email]);

  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);

    if (fieldName === "firstName") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "First Name is required" }));
      } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "Invalid First Name" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
      }
    } else if (fieldName === "lastName") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "Last Name is required" }));
      } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "Invalid Last Name" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
      }
    } else if (fieldName === "mobileNo") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, mobileNo: "Mobile No. is required" }));
      }
    } else if (fieldName === "email") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Please enter a valid email address" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    } else if (fieldName === "confirmPassword") {
      if (password.trim() && !value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Confirm Password is required" }));
      } else if (password.trim() && value !== password) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }
    }
  };

  const handleTogglePasswordVisibility = (fieldName) => {
    if (fieldName === "password") {
      setShowPassword(!showPassword);
    } else if (fieldName === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  function hashPasswordSHA1(password) {
    const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (value) => {
    return value.length >= 6;
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    if (!value.trim()) {
      setPasswordError("");
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
    } else if (!validatePassword(value)) {
      setPasswordError("Password must be at least 6 characters long!");
    } else if (value === confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      setPasswordError("");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errors = {};
    if (!firstName.trim()) {
      errors.firstName = "First Name is required";
    } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(firstName)) {
      errors.firstName = "First Name should not start with a numeric, special character, or space";
    }
    if (!lastName.trim()) {
      errors.lastName = "Last Name is required";
    } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(lastName)) {
      errors.lastName = "Last Name should not start with a numeric, special character, or space";
    }
    if (!mobileNo.trim()) {
      errors.mobileNo = "Mobile No. is required";
    } else if (Errors.mobileNo) {
      errors.mobileNo = Errors.mobileNo;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!currentActiveFlow && password.trim()) {
      if (!validatePassword(password)) {
        setPasswordError("Password must be at least 6 characters long!");
        errors.password = "Invalid Password";
      } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (!agreeTerms) {
      setTermsError("You must agree to the Terms & Conditions and Privacy Policy");
      errors.terms = "Terms agreement required";
    } else {
      setTermsError("");
    }

    if (Object.keys(errors).length === 0 && (!password.trim() || passwordError.length === 0)) {
      const finalPassword = password.trim() ? password : "User@" + Math.floor(1000 + Math.random() * 9000).toString() + "A1!";
      const hashedPassword = hashPasswordSHA1(finalPassword);

      setIsLoading(true);

      RegisterAPI(firstName, lastName, email, mobileNo, hashedPassword, Countrycodestate, countryShortName, taxId, businessType, city)
        .then((response) => {
          const result = getEventMessage(response);
          if (result?.eventName && result?.status) {
            setIsLoading(false);
            setAdminStatusDialog({
              open: true,
              type: result?.eventName,
              message: result?.message
            });
            return;
          }

          if (response.Data.rd[0].stat === 1) {
            const visiterId = Cookies.get('visiterId');
            LoginWithEmailAPI(email, '', hashedPassword, '', '', visiterId).then((loginResponse) => {
              if (loginResponse.Data.rd[0].stat === 1) {
                sessionStorage.removeItem("b2b_registered_email");
                sessionStorage.removeItem("b2b_registered_password");
                localStorage.removeItem("b2b_registered_email");
                localStorage.removeItem("b2b_registered_password");
                const visiterID = Cookies.get('visiterId');
                const userDetail = loginResponse?.Data?.rd[0];
                const pkgId = userDetail?.PackageId ?? userDetail?.packageId ?? userDetail?.PackageID;

                Cookies.set('userLoginCookie', userDetail?.Token, { path: '/', expires: 7 });
                Cookies.set('LoginUser', 'true', { path: '/', expires: 7 });
                if (pkgId != null && pkgId !== '' && String(pkgId) !== 'undefined' && String(pkgId) !== 'null') {
                  Cookies.set('userPackageId', String(pkgId), { path: '/', expires: 7 });
                }

                const Token = generateToken(userDetail?.Token, 0);
                setSession('AuthToken', Token);
                setSession('registerEmail', email);
                setislogin(true);
                setSession('LoginUser', true);
                setSession('loginUserDetail', userDetail);

                GetCountAPI(visiterID).then((res) => {
                  if (res) { setCartCountNum(res?.cartcount); setWishCountNum(res?.wishcount); }
                }).catch((err) => console.log(err));

                CurrencyComboAPI(loginResponse?.Data?.rd[0]?.id).then((resp) => {
                  if (resp?.Data?.rd) setSession('CurrencyCombo', resp?.Data?.rd);
                }).catch((err) => console.log(err));

                MetalColorCombo(loginResponse?.Data?.rd[0]?.id).then((resp) => {
                  if (resp?.Data?.rd) setSession('MetalColorCombo', resp?.Data?.rd);
                }).catch((err) => console.log(err));

                MetalTypeComboAPI(loginResponse?.Data?.rd[0]?.id).then((resp) => {
                  if (resp?.Data?.rd) setSession('metalTypeCombo', resp?.Data?.rd);
                }).catch((err) => console.log(err));

                window.location.href = "/";
              } else {
                setIsLoading(false);
                window.location.href = singupRedirectUrl;
              }
            }).catch((err) => {
              setIsLoading(false);
              window.location.href = singupRedirectUrl;
            });
          } else {
            setIsLoading(false);
            if (response.Data?.rd[0].ismobileexists === 1) {
              errors.mobileNo = response.Data.rd[0].stat_msg;
            }
            if (response.Data?.rd[0].isemailexists === 1) {
              errors.email = response.Data.rd[0].stat_msg;
            }
            setErrors({ ...errors });
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });

    } else {
      setErrors(errors);
    }
  };

  return (
    <>
      {/* Admin Status Dialog */}
      <AdminStatusDialog
        open={adminStatusDialog.open}
        type={adminStatusDialog.type}
        message={adminStatusDialog.message}
        onClose={() => setAdminStatusDialog({ ...adminStatusDialog, open: false })}
      />

      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fbfbfc",
          py: { xs: 2.5, sm: 4, md: 6 },
          px: { xs: 1.5, sm: 2, md: 3 },
          position: "relative",
        }}
      >
        {/* Loading Overlay */}
        <Backdrop
          open={isLoading}
          sx={{
            zIndex: theme.zIndex.modal + 1,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.3)",
          }}
        >
          <CircularProgress size={45} thickness={4} sx={{ color: "#111827" }} />
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
            {/* Left Column - Fashion Visual Showcase (Large, Unrounded, Sharp) */}
            <Box
              sx={{
                flex: { xs: "none", md: "0 0 460px", lg: "0 0 490px" },
                width: { xs: "100%", sm: "400px", md: "460px", lg: "490px" },
                height: { xs: "280px", sm: "380px", md: "640px", lg: "680px" },
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
                    "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  p: { xs: 2, sm: 3, md: 3.5 },
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
                    mb: 0.5,
                  }}
                >
                  Exclusive Fine Jewelry
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", sm: "1.15rem", md: "1.25rem" },
                    lineHeight: 1.3,
                    textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}
                >
                  Elegance & Precision in Every Creation
                </Typography>
              </Box>
            </Box>

            {/* Right Column - Registration Form Card */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", sm: "460px", md: "500px" },
                width: "100%",
                height: { md: "640px", lg: "680px" },
                minHeight: { md: "640px", lg: "680px" },
                bgcolor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: { xs: 3, sm: 4, md: 4.5 },
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              {/* Top Right "Already have an account? Sign In" */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mb: { xs: 1, sm: 1.5 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", fontSize: "0.85rem" }}
                >
                  Already have an account?{" "}
                  <Box
                    component={Link}
                    href={cancelRedireactUrl}
                    sx={{
                      color: "#111827",
                      fontWeight: 700,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign In
                  </Box>
                </Typography>
              </Box>

              <Stack
                spacing={{ xs: 2.5, sm: 3 }}
                sx={{ maxWidth: "460px", mx: "auto", width: "100%" }}
              >
                {/* Header Section */}
                <Box textAlign="center" sx={{ mb: { xs: 2, sm: 2.5 } }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 600,
                      color: "#111827",
                      fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
                      letterSpacing: "-0.01em",
                      lineHeight: 1.25,
                      mb: 0.75,
                    }}
                  >
                    Create Your Account
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontSize: { xs: "0.85rem", sm: "0.92rem" },
                      lineHeight: 1.45,
                    }}
                  >
                    Join us and be a part of our exclusive fine jewelry family.
                  </Typography>
                </Box>

                {/* Form Inputs */}
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  <Stack spacing={2.5}>
                    {/* First Name & Last Name in unified full-width row */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <TextField
                        autoFocus
                        name="user-firstName"
                        id="firstName"
                        label="First Name"
                        placeholder="Enter your first name"
                        variant="outlined"
                        fullWidth
                        value={firstName}
                        inputRef={firstNameRef}
                        onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                        onChange={(e) => handleInputChange(e, setFirstName, "firstName")}
                        error={!!Errors.firstName}
                        helperText={Errors.firstName}
                        disabled={isLoading}
                        sx={{ flex: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ fontSize: 19, color: "#9ca3af" }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: "4px",
                            bgcolor: "#ffffff",
                            fontSize: "0.92rem",
                            "& fieldset": { borderColor: "#d1d5db" },
                            "&:hover fieldset": { borderColor: "#9ca3af" },
                            "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "1.5px" },
                          },
                        }}
                        FormHelperTextProps={{ sx: { ml: 0, fontSize: "0.78rem" } }}
                      />

                      <TextField
                        name="user-lastName"
                        id="lastName"
                        label="Last Name"
                        placeholder="Enter your last name"
                        variant="outlined"
                        fullWidth
                        value={lastName}
                        inputRef={lastNameRef}
                        onKeyDown={(e) => handleKeyDown(e, isOtpNewUi ? mobileNoRef : emailRef)}
                        onChange={(e) => handleInputChange(e, setLastName, "lastName")}
                        error={!!Errors.lastName}
                        helperText={Errors.lastName}
                        disabled={isLoading}
                        sx={{ flex: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ fontSize: 19, color: "#9ca3af" }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: "4px",
                            bgcolor: "#ffffff",
                            fontSize: "0.92rem",
                            "& fieldset": { borderColor: "#d1d5db" },
                            "&:hover fieldset": { borderColor: "#9ca3af" },
                            "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "1.5px" },
                          },
                        }}
                        FormHelperTextProps={{ sx: { ml: 0, fontSize: "0.78rem" } }}
                      />
                    </Box>

                    {/* Mobile Number Dropdown & Input */}
                    {isOtpNewUi ? (
                      <CountryDropDown
                        Errors={Errors}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        Countrycodestate={Countrycodestate}
                        setCountrycodestate={setCountrycodestate}
                        setCountryShortName={setCountryShortName}
                        IsMobileThrough={isMobileThrough}
                        emailRef={emailRef}
                        mobileNo={mobileNo}
                        mobileNoRef={mobileNoRef}
                        setMobileNo={setMobileNo}
                        setErrors={setErrors}
                      />
                    ) : (
                      <TextField
                        id="mobileNo"
                        label="Mobile Number"
                        name="Mobile No."
                        autoComplete="tel"
                        variant="outlined"
                        fullWidth
                        value={mobileNo}
                        inputRef={mobileNoRef}
                        onKeyDown={(e) => handleKeyDown(e, emailRef)}
                        onChange={(e) => handleInputChange(e, setMobileNo, "mobileNo")}
                        error={!!Errors.mobileNo}
                        helperText={Errors.mobileNo}
                        disabled={isLoading}
                        InputProps={{
                          sx: {
                            borderRadius: "4px",
                            bgcolor: "#ffffff",
                            "& fieldset": { borderColor: "#d1d5db" },
                            "&:hover fieldset": { borderColor: "#9ca3af" },
                            "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "1.5px" },
                          },
                        }}
                      />
                    )}

                    {/* Email Input */}
                    <TextField
                      name="user-email"
                      id="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      type="email"
                      autoComplete="email"
                      variant="outlined"
                      fullWidth
                      value={email}
                      inputRef={emailRef}
                      onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                      onChange={(e) => handleInputChange(e, setEmail, "email")}
                      error={!!Errors.email}
                      helperText={Errors.email}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ fontSize: 19, color: "#9ca3af" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "4px",
                          bgcolor: "#ffffff",
                          fontSize: "0.92rem",
                          "& fieldset": { borderColor: "#d1d5db" },
                          "&:hover fieldset": { borderColor: "#9ca3af" },
                          "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "1.5px" },
                        },
                      }}
                      FormHelperTextProps={{ sx: { ml: 0, fontSize: "0.78rem" } }}
                    />

                    {/* Password Input */}
                    <TextField
                      name="user-password"
                      id="password"
                      label="Password"
                      placeholder="Create a strong password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      variant="outlined"
                      fullWidth
                      value={password}
                      onChange={handlePasswordChange}
                      error={!!passwordError}
                      helperText={passwordError}
                      inputRef={passwordRef}
                      onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ fontSize: 19, color: "#9ca3af" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handleTogglePasswordVisibility("password")}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ color: "#6b7280" }}
                            >
                              {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "4px",
                          bgcolor: "#ffffff",
                          fontSize: "0.92rem",
                          "& fieldset": { borderColor: "#d1d5db" },
                          "&:hover fieldset": { borderColor: "#9ca3af" },
                          "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "1.5px" },
                        },
                      }}
                      FormHelperTextProps={{ sx: { ml: 0, fontSize: "0.78rem" } }}
                    />

                    {/* Confirm Password Input */}
                    <TextField
                      name="user-confirmPassword"
                      id="confirmPassword"
                      label="Confirm Password"
                      placeholder="Confirm password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      variant="outlined"
                      fullWidth
                      value={confirmPassword}
                      inputRef={confirmPasswordRef}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                      onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
                      error={!!Errors.confirmPassword}
                      helperText={Errors.confirmPassword}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ fontSize: 19, color: "#9ca3af" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handleTogglePasswordVisibility("confirmPassword")}
                              onMouseDown={handleMouseDownConfirmPassword}
                              edge="end"
                              sx={{ color: "#6b7280" }}
                            >
                              {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "4px",
                          bgcolor: "#ffffff",
                          fontSize: "0.92rem",
                          "& fieldset": { borderColor: "#d1d5db" },
                          "&:hover fieldset": { borderColor: "#9ca3af" },
                          "&.Mui-focused fieldset": { borderColor: "#111827", borderWidth: "1.5px" },
                        },
                      }}
                      FormHelperTextProps={{ sx: { ml: 0, fontSize: "0.78rem" } }}
                    />

                    {/* Terms and Conditions Checkbox */}
                    <Box sx={{ mt: 1, mb: 0.5 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            size="small"
                            sx={{
                              color: "#9ca3af",
                              "&.Mui-checked": { color: "#111827" },
                              p: 0.75,
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" }, color: "#4b5563" }}>
                            I agree to the{" "}
                            <Box
                              component={Link}
                              href="/terms-and-conditions"
                              sx={{
                                color: "#b45309",
                                textDecoration: "none",
                                fontWeight: 600,
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              Terms & Conditions
                            </Box>{" "}
                            and{" "}
                            <Box
                              component={Link}
                              href="/privacyPolicy"
                              sx={{
                                color: "#b45309",
                                textDecoration: "none",
                                fontWeight: 600,
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              Privacy Policy
                            </Box>
                          </Typography>
                        }
                        sx={{ m: 0, alignItems: "center" }}
                      />
                      {termsError && (
                        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5, fontSize: "0.78rem" }}>
                          {termsError}
                        </Typography>
                      )}
                    </Box>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      disabled={isLoading}
                      sx={{
                        mt: 1.5,
                        py: { xs: 1.4, sm: 1.6 },
                        px: { xs: 2, sm: 2.5 },
                        bgcolor: "#0b1a13",
                        color: "#ffffff",
                        borderRadius: "4px",
                        textTransform: "none",
                        fontSize: { xs: "0.92rem", sm: "0.98rem" },
                        fontWeight: 600,
                        boxShadow: "none",
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          bgcolor: "#142c21",
                          boxShadow: "none",
                        },
                        "&.Mui-disabled": {
                          bgcolor: "#e5e7eb",
                          color: "#9ca3af",
                        },
                      }}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
}
