"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Register.modul.scss";
import CryptoJS from "crypto-js";
import { RegisterAPI } from "@/app/(core)/utils/API/Auth/RegisterAPI";
import Autocomplete from "@mui/material/Autocomplete";
import { CountryCode } from "@/app/(core)/utils/assets/Countrylist";
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { Box, Container, Typography, TextField, Button, Paper, Stack, CircularProgress, Backdrop, IconButton, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminStatusDialog from "./components/AdminStatusDialog";
import { currentActiveFlow } from "@/app/(core)/constants/data";

export default function B2CRegister({ searchParams }) {
    const { push } = useNextRouterLikeRR();
    const navigation = push;
    const location = useNextRouterLikeRR();
    const [isLoading, setIsLoading] = useState(false);

    const [adminStatusDialog, setAdminStatusDialog] = useState({ open: false, type: "Approved", message: "Your account request has been rejected. Please contact support for more details." });
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [taxId, setTaxId] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [city, setCity] = useState("");
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
    const taxIdRef = useRef(null);
    const businessTypeRef = useRef(null);
    const cityRef = useRef(null);
    const [open, setOpen] = useState(false); // Track dropdown open/close
    const [isOtpNewUi, setIsOtpNewUi] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
    const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}`;
    const singupRedirectUrl = `/LoginOption?LoginRedirect=${search}`;

    const handleKeyDown = (event, nextRef) => {
        if (event.key === "Enter") {
            event.preventDefault();
            nextRef.current.focus();
        }
    };

    const handleCountryChange = (event, value) => {
        if (value) {
            setCountrycodestate(value.phone); // Update country code
            setOpen(false); // Close the dropdown once a selection is made
        }
    };

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("registerEmail");
        const routeMobileNo = sessionStorage.getItem("registerMobile");
        const storedCountryCode = sessionStorage.getItem("Countrycodestate");

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
    }, [location.searchParams]);

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
            // Handle confirm password validation
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Confirm Password is required" }));
            } else if (value !== password) {
                setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Passwords do not match" }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
            }
        } else if (fieldName === "taxId") {
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, taxId: "Tax ID/GST is required" }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, taxId: "" }));
            }
        } else if (fieldName === "businessType") {
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, businessType: "Business Type is required" }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, businessType: "" }));
            }
        } else if (fieldName === "city") {
            if (!value.trim()) {
                setErrors((prevErrors) => ({ ...prevErrors, city: "City is required" }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, city: "" }));
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
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/;
        return passwordRegex.test(value);
    };

    const handlePasswordChange = (event) => {
        const { value } = event.target;
        setPassword(value);
        if (!value.trim()) {
            setPasswordError("Password is required");
        } else if (!validatePassword(value)) {
            setPasswordError("Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character!");
        } else if (value === confirmPassword) {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
            setPasswordError("");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentActiveFlow) {
            // Fun toggle for demonstration (Approved -> Rejected -> Pending)
            setAdminStatusDialog((prev) => {
                const types = ["approved", "rejected", "pending"];
                const nextIndex = (types.indexOf(prev.type?.toLowerCase()) + 1) % types.length;
                const nextType = types[nextIndex];

                const messages = {
                    approved: "Your account has been successfully approved by the admin. You can now login to your account.",
                    rejected: "Your account request has been rejected. Please contact support for more details.",
                    pending: "Your account request is still under review by the admin. Please wait for the confirmation.",
                };

                return {
                    open: true,
                    type: nextType,
                    message: messages[nextType],
                };
            });
        }
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

        if (!currentActiveFlow) {
            if (!taxId.trim()) {
                errors.taxId = "Tax ID/GST is required";
            }
            if (!businessType.trim()) {
                errors.businessType = "Business Type is required";
            }
            if (!city.trim()) {
                errors.city = "City is required";
            }
        }

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!currentActiveFlow) {
            if (!password.trim()) {
                setPasswordError("Password is required");
                errors.password = "Password is required";
            } else if (!validatePassword(password)) {
                errors.password = "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character!";
            }

            if (!confirmPassword.trim()) {
                errors.confirmPassword = "Confirm Password is required";
            } else if (confirmPassword !== password) {
                errors.confirmPassword = "Passwords do not match";
            }
        }

        if (Object.keys(errors).length === 0 && (currentActiveFlow || passwordError.length === 0)) {
            const hashedPassword = !currentActiveFlow ? hashPasswordSHA1(password) : "";

            setIsLoading(true);

            RegisterAPI(firstName, lastName, email, mobileNo, hashedPassword, Countrycodestate, countryShortName, taxId, businessType, city)
                .then((response) => {
                    setIsLoading(false);
                    if (response.Data.rd[0].stat === 1) {
                        navigation(singupRedirectUrl);

                    } else {
                        if (response.Data?.rd[0].ismobileexists === 1) {
                            errors.mobileNo = response.Data.rd[0].stat_msg;
                        }
                        if (response.Data?.rd[0].isemailexists === 1) {
                            errors.email = response.Data.rd[0].stat_msg;
                        }
                        setErrors(errors);
                    }
                })
                .catch((err) => console.log(err));

        } else {
            setErrors(errors);
        }
    };

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
