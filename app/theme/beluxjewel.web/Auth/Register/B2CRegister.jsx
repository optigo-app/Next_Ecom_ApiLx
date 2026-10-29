"use client";
import React from "react";
import "./Register.modul.scss";
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
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
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdminStatusDialog from "./components/AdminStatusDialog";
import { useB2CRegisterLogic } from "@/app/(core)/hooks/Auth/useB2CRegisterLogic";

export default function B2CRegister({ searchParams }) {
  const {
    setislogin,
    setCartCountNum,
    setWishCountNum,
    push,
    navigation,
    location,
    isLoading,
    setIsLoading,
    adminStatusDialog,
    setAdminStatusDialog,
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    mobileNo,
    setMobileNo,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    taxId,
    setTaxId,
    businessType,
    setBusinessType,
    city,
    setCity,
    agreeTerms,
    setAgreeTerms,
    termsError,
    setTermsError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    Errors,
    setErrors,
    Countrycodestate,
    setCountrycodestate,
    countryShortName,
    setCountryShortName,
    isMobileThrough,
    setIsMobileThrough,
    passwordError,
    setPasswordError,
    firstNameRef,
    lastNameRef,
    mobileNoRef,
    emailRef,
    passwordRef,
    confirmPasswordRef,
    isOtpNewUi,
    theme,
    isMobile,
    cancelRedireactUrl,
    singupRedirectUrl,
    handleKeyDown,
    handleInputChange,
    handleTogglePasswordVisibility,
    hashPasswordSHA1,
    handleMouseDownPassword,
    handleMouseDownConfirmPassword,
    validatePassword,
    handlePasswordChange,
    handleSubmit,
  } = useB2CRegisterLogic({ searchParams });

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
