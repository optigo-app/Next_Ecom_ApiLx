import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
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
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { currentActiveFlow } from "@/app/(core)/constants/data";
import { useAuthRedirects } from "@/app/(core)/hooks/Auth/useAuthRedirects";
import { consumeAuthRegistrationPrefill } from "@/app/(core)/utils/authRegistrationPrefill";

export function useB2CRegisterLogic({ searchParams }) {
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

  const { cancelUrl: cancelRedireactUrl } = useAuthRedirects(searchParams);
  const singupRedirectUrl = cancelRedireactUrl;

  const handleKeyDown = (event, nextRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (nextRef?.current) nextRef.current.focus();
    }
  };

  useEffect(() => {
    const {
      email: storedEmail,
      mobile: routeMobileNo,
      countryCode: storedCountryCode,
    } = consumeAuthRegistrationPrefill(searchParams);

    if (storedEmail) {
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

    setEmail(storedEmail);
    setMobileNo(String(routeMobileNo || ""));
    setIsMobileThrough(Boolean(routeMobileNo));
    if (mobileNoRef.current) mobileNoRef.current.disabled = Boolean(routeMobileNo);

    if (storedCountryCode) {
      setCountrycodestate(String(storedCountryCode));
    }

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

    if (!strEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strEmail)) {
      errors.email = "Please enter a valid email address";
    }
    if (!currentActiveFlow && strPassword.trim()) {
      if (!validatePassword(strPassword)) {
        setPasswordError("Password must be at least 6 characters long!");
        errors.password = "Invalid Password";
      } else if (confirmPassword !== strPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (!agreeTerms) {
      setTermsError("You must agree to the Terms & Conditions and Privacy Policy");
      errors.terms = "Terms agreement required";
    } else {
      setTermsError("");
    }

    if (Object.keys(errors).length === 0 && (!strPassword.trim() || passwordError.length === 0)) {
      const finalPassword = strPassword.trim() ? strPassword : "User@" + Math.floor(1000 + Math.random() * 9000).toString() + "A1!";
      const hashedPassword = hashPasswordSHA1(finalPassword);

      setIsLoading(true);

      RegisterAPI(strFirstName, strLastName, strEmail, strMobileNo, hashedPassword, String(Countrycodestate || ""), countryShortName, taxId, businessType, city)
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
            LoginWithEmailAPI(strEmail, '', hashedPassword, '', '', visiterId).then((loginResponse) => {
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

  
  return {
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
  };
}
