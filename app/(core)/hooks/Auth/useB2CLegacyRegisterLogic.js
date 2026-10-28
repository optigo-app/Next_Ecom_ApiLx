import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { RegisterAPI } from "@/app/(core)/utils/API/Auth/RegisterAPI";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useTheme, useMediaQuery } from "@mui/material";
import { currentActiveFlow } from "@/app/(core)/constants/data";
import { useAuthRedirects } from "@/app/(core)/hooks/Auth/useAuthRedirects";
import { consumeAuthRegistrationPrefill } from "@/app/(core)/utils/authRegistrationPrefill";

export function useB2CLegacyRegisterLogic({ searchParams }) {
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

    const { cancelUrl: cancelRedireactUrl } = useAuthRedirects(searchParams);
    const singupRedirectUrl = cancelRedireactUrl;

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
        const {
            email: storedEmail,
            mobile: routeMobileNo,
            countryCode: storedCountryCode,
        } = consumeAuthRegistrationPrefill(searchParams);

        setMobileNo(String(routeMobileNo || ""));
        setIsMobileThrough(Boolean(routeMobileNo));
        if (mobileNoRef.current) mobileNoRef.current.disabled = Boolean(routeMobileNo);

        if (storedCountryCode) {
            setCountrycodestate(String(storedCountryCode));
        }

        setEmail(storedEmail);
        if (emailRef.current) emailRef.current.disabled = Boolean(storedEmail);
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
        const strFirstName = String(firstName || "");
        const strLastName = String(lastName || "");
        const strMobileNo = String(mobileNo || "");
        const strEmail = String(email || "");
        const strPassword = String(password || "");

        const errors = {};
        if (!strFirstName.trim()) {
            errors.firstName = "First Name is required";
        } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(strFirstName)) {
            errors.firstName = "First Name should not start with a numeric, special character, or space";
        }
        if (!strLastName.trim()) {
            errors.lastName = "Last Name is required";
        } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(strLastName)) {
            errors.lastName = "Last Name should not start with a numeric, special character, or space";
        }
        if (!strMobileNo.trim()) {
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
                        const resData = response.Data?.rd?.[0] || {};
                        const isMobileExists =
                            resData.ismobileexists === 1 ||
                            (resData.stat_msg && /mobile/i.test(resData.stat_msg));
                        const isEmailExists =
                            resData.isemailexists === 1 ||
                            (resData.stat_msg && /email/i.test(resData.stat_msg));

                        if (isMobileExists) {
                            errors.mobileNo = resData.stat_msg || "Mobile number already exists";
                            setIsMobileThrough(false);
                            if (mobileNoRef.current) {
                                mobileNoRef.current.disabled = false;
                                setTimeout(() => mobileNoRef.current?.focus(), 50);
                            }
                            if (typeof window !== "undefined") {
                                sessionStorage.removeItem("registerMobile");
                            }
                        }
                        if (isEmailExists) {
                            errors.email = resData.stat_msg || "Email already exists";
                            if (emailRef.current) {
                                emailRef.current.disabled = false;
                            }
                            if (typeof window !== "undefined") {
                                sessionStorage.removeItem("registerEmail");
                                sessionStorage.removeItem("email");
                            }
                        }
                        setErrors(errors);
                    }
                })
                .catch((err) => console.log(err));

        } else {
            setErrors(errors);
        }
    };

    
  return {
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
  };
}
