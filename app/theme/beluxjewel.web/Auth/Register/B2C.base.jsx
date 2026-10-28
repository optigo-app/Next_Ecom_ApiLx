"use client";
import React from "react";
import "./Register.modul.scss";
import Autocomplete from "@mui/material/Autocomplete";
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
import { Box, Container, Typography, TextField, Button, Paper, Stack, CircularProgress, Backdrop, IconButton, InputAdornment } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminStatusDialog from "./components/AdminStatusDialog";
import { useB2CLegacyRegisterLogic } from "@/app/(core)/hooks/Auth/useB2CLegacyRegisterLogic";

export default function B2CRegister({ searchParams }) {
  const {
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
    taxIdRef,
    businessTypeRef,
    cityRef,
    open,
    setOpen,
    isOtpNewUi,
    setIsOtpNewUi,
    theme,
    isMobile,
    cancelRedireactUrl,
    singupRedirectUrl,
    handleKeyDown,
    handleCountryChange,
    handleInputChange,
    handleTogglePasswordVisibility,
    hashPasswordSHA1,
    handleMouseDownPassword,
    handleMouseDownConfirmPassword,
    validatePassword,
    handlePasswordChange,
    handleSubmit,
  } = useB2CLegacyRegisterLogic({ searchParams });

return (
        <>
            {/* Admin Status Dialog */}
            <AdminStatusDialog open={adminStatusDialog.open} type={adminStatusDialog.type} message={adminStatusDialog.message} onClose={() => setAdminStatusDialog({ ...adminStatusDialog, open: false })} />

            <Box
                sx={{
                    minHeight: "110vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "white",
                    p: 0,
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
                    <CircularProgress size={50} thickness={4} color="primary" />
                </Backdrop>

                <Container maxWidth="sm"
                    sx={{
                        paddingBlock: '50px'
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 4 },
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Back Button */}
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigation(cancelRedireactUrl)}
                            sx={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                color: "text.secondary",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                    bgcolor: "grey.100",
                                    color: "text.primary",
                                },
                            }}
                        >
                            Back
                        </Button>

                        <Stack spacing={3} alignItems="center" sx={{ pt: 4 }}>
                            {/* Icon */}
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    bgcolor: "success.light",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 1,
                                }}
                                className="btnColorProCat"
                            >
                                <PersonAddOutlinedIcon
                                    sx={{
                                        fontSize: 32,
                                    }}
                                />
                            </Box>

                            {/* Title */}
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 400,
                                    color: "text.primary",
                                    mb: 1,
                                    fontSize: { xs: "1.75rem", sm: "2.25rem" },
                                    textAlign: "center",
                                }}
                            >
                                Create Account
                            </Typography>

                            {/* Form */}
                            <Stack spacing={2.5} width="100%" component="form" noValidate onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
                                <TextField autoFocus name="user-firstName" id="firstName" label="First Name" variant="outlined" fullWidth value={firstName} inputRef={firstNameRef} onKeyDown={(e) => handleKeyDown(e, lastNameRef)} onChange={(e) => handleInputChange(e, setFirstName, "firstName")} error={!!Errors.firstName} helperText={Errors.firstName} disabled={isLoading} />

                                <TextField name="user-lastName" id="lastName" label="Last Name" variant="outlined" fullWidth value={lastName} inputRef={lastNameRef} onKeyDown={(e) => handleKeyDown(e, !currentActiveFlow ? taxIdRef : isOtpNewUi ? mobileNoRef : emailRef)} onChange={(e) => handleInputChange(e, setLastName, "lastName")} error={!!Errors.lastName} helperText={Errors.lastName} disabled={isLoading} />

                                {isOtpNewUi ? (
                                    <CountryDropDown Errors={Errors} handleInputChange={handleInputChange} handleKeyDown={handleKeyDown} Countrycodestate={Countrycodestate} setCountrycodestate={setCountrycodestate} setCountryShortName={setCountryShortName} IsMobileThrough={isMobileThrough} emailRef={emailRef} mobileNo={mobileNo} mobileNoRef={mobileNoRef} setMobileNo={setMobileNo} setErrors={setErrors} />
                                ) : (
                                    <TextField
                                        id="mobileNo"
                                        label="Mobile No."
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
                                            sx: { borderRadius: 2 },
                                        }}
                                    />
                                )}

                                <TextField name="user-email" id="email" label="Email" type="email" autoComplete="email" variant="outlined" fullWidth value={email} inputRef={emailRef} onKeyDown={(e) => handleKeyDown(e, passwordRef)} onChange={(e) => handleInputChange(e, setEmail, "email")} error={!!Errors.email} helperText={Errors.email} disabled={isLoading} />

                                {!currentActiveFlow && (
                                    <>
                                        <TextField
                                            name="user-password"
                                            id="password"
                                            label="Password"
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
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility("password")} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: "text.secondary" }}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                sx: { borderRadius: 2 },
                                            }}
                                        />

                                        <TextField
                                            name="user-confirmPassword"
                                            id="confirmPassword"
                                            label="Confirm Password"
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
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility("confirmPassword")} onMouseDown={handleMouseDownConfirmPassword} edge="end" sx={{ color: "text.secondary" }}>
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                sx: { borderRadius: 2 },
                                            }}
                                        />
                                    </>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="success"
                                    disabled={isLoading}
                                    className="btnColorProCat"
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        boxShadow: "none",
                                        transition: "all 0.2s ease-in-out",
                                        "&:disabled": {
                                            bgcolor: "grey.300",
                                            color: "grey.500",
                                        },
                                    }}
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </Button>

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="text"
                                    onClick={() => navigation(cancelRedireactUrl)}
                                    disabled={isLoading}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        py: 1.5,
                                        textTransform: "none",
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
                                        color: "text.secondary",
                                        "&:hover": {
                                            bgcolor: "grey.100",
                                            color: "text.primary",
                                        },
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Stack>

                            {/* Terms Note */}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    textAlign: "center",
                                    maxWidth: 350,
                                    mt: 2,
                                    display: "block",
                                }}
                            >
                                By creating an account, you agree to our Terms of Use and Privacy Policy
                            </Typography>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}
