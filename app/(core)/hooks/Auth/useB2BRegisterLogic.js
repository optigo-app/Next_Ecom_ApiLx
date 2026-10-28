import React, { useState, useRef, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import CryptoJS from "crypto-js";
import { WEBSignUpWithCompanyInfoAPI } from "@/app/(core)/utils/API/Auth/WEBSignUpWithCompanyInfoAPI";
import { LoginWithEmailAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailAPI";
import { RegisterMasterApi } from "@/app/(core)/utils/API/Auth/RegisterMasterApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { useAuthRedirects } from "@/app/(core)/hooks/Auth/useAuthRedirects";
import getMasterOptions from "@/app/theme/beluxjewel.web/Auth/Register/B2bRegister/MasterParser";
import { consumeAuthRegistrationPrefill } from "@/app/(core)/utils/authRegistrationPrefill";

export function useB2BRegisterLogic({ searchParams, steps }) {
  const STEPS = steps;
  function hashPasswordSHA1(password) {
    return CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
  }

  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFirstTimeSuccess, setIsFirstTimeSuccess] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const mobileNoRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [masterData, setMasterData] = useState(() => getMasterOptions());

  useEffect(() => {
    const current = getMasterOptions();
    if (current && Object.keys(current).length > 0) {
      setMasterData(current);
      return;
    }

    const storeInit = getSession("storeInit", {});
    const loginUserDetail = getSession("loginUserDetail", {});
    const LoginUser = getSession("LoginUser", false);
    const visiterID = Cookies.get("visiterId");
    const finalID =
      storeInit?.IsB2BWebsite === 0
        ? LoginUser === false
          ? visiterID
          : loginUserDetail?.id || "0"
        : loginUserDetail?.id || "0";

    RegisterMasterApi(finalID)
      .then((res) => {
        if (res?.Data?.rd) {
          setSession("B2BRegisterMasterApi", res.Data.rd);
          setMasterData(getMasterOptions());
        }
      })
      .catch((err) => {
        console.error("RegisterMasterApi fetch error:", err);
      });
  }, []);

  const MasterData = masterData;
  const CompanyType = MasterData?.CompanyType?.options || [];
  const DocumentType = MasterData?.DocumentType?.options || [];
  const TypeofEntityOptions = MasterData?.TypeOfEntity?.options || [];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [IsMobileThrough, setIsMobileThrough] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    entity_type: "",
    industry_category: "",
    gst_number: "",
    pan_number: "",
    iec_code: "",
    address_line: "",
    city: "",
    state: "",
    country: "India",
    password: "",
    confirm_password: "",
    pincode: "",
    first_name: "",
    last_name: "",
    mobileNo: "",
    mobileCountry: "91",
    email: "",
    documents: {},
    declaration: false,
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { search, cancelUrl: cancelRedireactUrl } = useAuthRedirects(searchParams);

  useEffect(() => {
    const {
      email: storedEmail,
      mobile: routeMobileNo,
      countryCode: storedCountryCode,
    } = consumeAuthRegistrationPrefill(searchParams);

    if (storedEmail) {
      const savedReviewEmail =
        sessionStorage.getItem("b2b_registered_email") ||
        localStorage.getItem("b2b_registered_email");
      if (savedReviewEmail && savedReviewEmail !== storedEmail) {
        sessionStorage.removeItem("b2b_registered_email");
        sessionStorage.removeItem("b2b_registered_password");
        localStorage.removeItem("b2b_registered_email");
        localStorage.removeItem("b2b_registered_password");
        setSubmitSuccess(false);
        setIsFirstTimeSuccess(true);
        setStatusMessage("");
      }
    }

    setFormData((prev) => {
      let updated = false;
      const nextState = { ...prev };

      const mobileNo = String(routeMobileNo || "");
      if (
        prev.mobileNo !== mobileNo ||
        (storedCountryCode && prev.mobileCountry !== String(storedCountryCode))
      ) {
        nextState.mobileNo = mobileNo;
        updated = true;
      }
      if (storedCountryCode && prev.mobileCountry !== String(storedCountryCode)) {
        const strStoredCountryCode = String(storedCountryCode);
        nextState.mobileCountry = strStoredCountryCode;
        updated = true;
      }

      if (prev.email !== storedEmail) {
        nextState.email = storedEmail;
        updated = true;
      }

      return updated ? nextState : prev;
    });

    if (routeMobileNo && storedCountryCode) {
      setIsMobileThrough((prev) => (prev !== true ? true : prev));
      if (mobileNoRef.current) {
        mobileNoRef.current.disabled = true;
      }
    } else {
      setIsMobileThrough((prev) => (prev !== false ? false : prev));
      if (mobileNoRef.current) {
        mobileNoRef.current.disabled = false;
      }
    }
  }, [location.searchParams, searchParams?.email]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail =
        sessionStorage.getItem("b2b_registered_email") ||
        localStorage.getItem("b2b_registered_email");
      const savedPassword =
        sessionStorage.getItem("b2b_registered_password") ||
        localStorage.getItem("b2b_registered_password");
      if (savedEmail && savedPassword) {
        setSubmitSuccess(true);
        setIsFirstTimeSuccess(false);
      }
    }
  }, []);

  const handleCheckStatus = async () => {
    if (typeof window === "undefined") return;
    const savedEmail =
      sessionStorage.getItem("b2b_registered_email") ||
      localStorage.getItem("b2b_registered_email");
    const savedPassword =
      sessionStorage.getItem("b2b_registered_password") ||
      localStorage.getItem("b2b_registered_password");
    if (!savedEmail || !savedPassword) {
      toast.error("No registered credentials found.");
      return;
    }

    setCheckLoading(true);
    try {
      const visiterId = Cookies.get("visiterId");
      const response = await LoginWithEmailAPI(
        savedEmail,
        "",
        savedPassword,
        "",
        "",
        visiterId,
      );

      if (
        response &&
        response.Data &&
        response.Data.rd &&
        response.Data.rd[0]
      ) {
        const userStatus = response.Data.rd[0];
        if (userStatus.stat === 1) {
          toast.success("Account approved successfully! Redirecting...");
          sessionStorage.removeItem("b2b_registered_email");
          sessionStorage.removeItem("b2b_registered_password");
          localStorage.removeItem("b2b_registered_email");
          localStorage.removeItem("b2b_registered_password");
          sessionStorage.setItem("registerEmail", savedEmail);
          navigation(
            `/LoginWithEmail?email=${encodeURIComponent(savedEmail)}&LoginRedirect=${encodeURIComponent(search)}`,
          );
        } else {
          setIsFirstTimeSuccess(false);
          const msg =
            userStatus.stat_msg ||
            "Your request is still under review. Please contact the admin.";
          setStatusMessage(msg);
          toast.info(msg);
        }
      } else {
        toast.error("Failed to check status. Please try again.");
      }
    } catch (err) {
      console.error("Check status error:", err);
      toast.error("An error occurred while checking status.");
    } finally {
      setCheckLoading(false);
    }
  };

  const handleRegisterNew = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("b2b_registered_email");
      sessionStorage.removeItem("b2b_registered_password");
      localStorage.removeItem("b2b_registered_email");
      localStorage.removeItem("b2b_registered_password");
    }
    setSubmitSuccess(false);
    setIsFirstTimeSuccess(true);
    setStatusMessage("");
    setFormData({
      company_name: "",
      entity_type: "",
      industry_category: "",
      gst_number: "",
      pan_number: "",
      iec_code: "",
      address_line: "",
      city: "",
      state: "",
      country: "India",
      password: "",
      confirm_password: "",
      pincode: "",
      first_name: "",
      last_name: "",
      mobileNo: "",
      mobileCountry: "91",
      email: "",
      documents: {},
      declaration: false,
      consent: false,
    });
    setActiveStep(0);
    setCompletedSteps(new Set());
  };

  const canNavigateToStep = (targetStep) => {
    if (targetStep <= activeStep) return true;
    return [...completedSteps].includes(targetStep - 1);
  };

  const isStepFieldsComplete = (step) => {
    switch (step) {
      case 0:
        return (
          formData.company_name.trim() !== "" &&
          formData.entity_type &&
          formData.industry_category &&
          formData.gst_number.trim() !== "" &&
          formData.pan_number.trim() !== "" &&
          formData.address_line.trim() !== "" &&
          formData.city.trim() !== "" &&
          formData.state.trim() !== "" &&
          formData.country.trim() !== "" &&
          formData.pincode.trim() !== ""
        );

      case 1:
        return (
          String(formData.first_name || "").trim() !== "" &&
          String(formData.last_name || "").trim() !== "" &&
          String(formData.mobileNo || "").trim() !== "" &&
          String(formData.email || "").trim() !== "" &&
          formData.password !== "" &&
          formData.confirm_password !== "" &&
          formData.password === formData.confirm_password &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );

      case 2:
        const docs = formData.documents || {};
        return DocumentType.every((doc) => {
          const docValue = docs[doc.id] || {};
          const number = docValue.number?.trim();
          const file = docValue.file;
          if (doc.IsMandatory === 1) {
            return number && number !== "" && file;
          }
          return true;
        });

      case 3:
        return formData.declaration === true && formData.consent === true;

      default:
        return false;
    }
  };

  const validateStep = (step) => {
    let newErrors = {};

    switch (step) {
      case 0:
        if (!formData.company_name.trim())
          newErrors.company_name = "Company name is required";
        if (!formData.entity_type)
          newErrors.entity_type = "Select type of entity";
        if (!formData.industry_category)
          newErrors.industry_category = "Select industry category";
        if (!formData.gst_number?.trim())
          newErrors.gst_number = "GST number is required";
        else if (
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            formData.gst_number,
          )
        )
          newErrors.gst_number = "Invalid GST number";
        if (!formData.pan_number?.trim())
          newErrors.pan_number = "PAN is required";
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number))
          newErrors.pan_number = "Invalid PAN number";
        if (!formData.address_line.trim())
          newErrors.address_line = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        break;

      case 1:
        if (!String(formData.first_name || "").trim())
          newErrors.first_name = "First name is required";
        if (!String(formData.last_name || "").trim())
          newErrors.last_name = "Last name is required";
        if (!String(formData.mobileNo || "").trim())
          newErrors.mobileNo = "Mobile number is required";
        if (!String(formData.email || "").trim()) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirm_password)
          newErrors.confirm_password = "Confirm password is required";
        if (
          formData.password &&
          formData.confirm_password &&
          formData.password !== formData.confirm_password
        )
          newErrors.confirm_password = "Passwords do not match";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          newErrors.email = "Invalid email";
        break;
      case 2:
        DocumentType.forEach((doc) => {
          const docValue = formData.documents[doc.id] || {};
          const number = docValue.number?.trim() || "";
          const file = docValue.file || null;
          const isMandatory = doc.IsMandatory === 1;

          if (isMandatory && !number) {
            newErrors[`doc_${doc.id}_number`] =
              `${doc.DocumentTypeName} number is required`;
          }

          if (isMandatory && !file) {
            newErrors[`doc_${doc.id}_file`] =
              `${doc.DocumentTypeName} file is required`;
          }
        });
        break;

      case 3:
        if (!formData.declaration)
          newErrors.declaration = "You must accept the declaration";
        if (!formData.consent) newErrors.consent = "You must provide consent";
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.step = "Please complete all required fields before proceeding.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const areAllStepsComplete = () => {
    for (let step = 0; step < STEPS.length; step++) {
      if (!isStepFieldsComplete(step)) return false;
    }
    return true;
  };

  const isStepComplete = (step) => {
    return completedSteps.has(step);
  };

  const handleDocRemove = (id) => {
    setFormData((prev) => {
      const updatedDocs = { ...prev.documents };
      delete updatedDocs[id];
      return { ...prev, documents: updatedDocs };
    });
  };

  const handleDocNumberChange = (id, value, type) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: { ...(prev.documents[id] || {}), number: value, type },
      },
    }));
  };

  const handleDocFileChange = (id, file, type) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error("Only image files and PDFs are allowed.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: { ...(prev.documents[id] || {}), file, type },
      },
    }));
  };

  const handleInputChange = (e, setter, field) => {
    const { name, value, type, checked } = e.target;

    if (setter && field) {
      setter(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors.step) setErrors((prev) => ({ ...prev, step: "" }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "password") {
        if (!value) {
          newErrors.password = "Password cannot be empty";
        } else {
          newErrors.password = "";
        }

        if (formData.confirm_password && value !== formData.confirm_password) {
          newErrors.confirm_password = "Passwords do not match";
        } else {
          newErrors.confirm_password = "";
        }
      }

      if (name === "confirm_password") {
        if (!value) {
          newErrors.confirm_password = "Confirm Password cannot be empty";
        } else if (value !== formData.password) {
          newErrors.confirm_password = "Passwords do not match";
        } else {
          newErrors.confirm_password = "";
        }
      }

      return newErrors;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors.step) setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleNext = () => {
    const isValid = validateStep(activeStep);
    if (!isValid) {
      return;
    }
    setCompletedSteps((prev) => {
      const updated = new Set(prev);
      updated.add(activeStep);
      return updated;
    });
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
    setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
    setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleStepClick = (step) => {
    if (!canNavigateToStep(step)) return;
    setActiveStep(step);
    setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let allValid = true;
    for (let step = 0; step < STEPS.length; step++) {
      const valid = validateStep(step);
      if (!valid) allValid = false;
    }
    if (!allValid) return;

    setLoading(true);
    try {
      const hashedPassword = hashPasswordSHA1(formData?.password);
      const response = await WEBSignUpWithCompanyInfoAPI({
        ...formData,
        password: hashedPassword,
      });
      if (response.stat === 1) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("b2b_registered_email", formData.email);
          sessionStorage.setItem("b2b_registered_password", hashedPassword);
        }
        setIsFirstTimeSuccess(true);
        setSubmitSuccess(true);
        setCompletedSteps(new Set([0, 1, 2, 3]));
      } else {
        const newErrors = {};
        const isMobileExists =
          response.ismobileexists === 1 ||
          (response.stat_msg && /mobile/i.test(response.stat_msg));
        const isEmailExists =
          response.isemailexists === 1 ||
          (response.stat_msg && /email/i.test(response.stat_msg));

        if (isMobileExists) {
          newErrors.mobileNo = response.stat_msg || "Mobile number already exists";
          toast.error(response.stat_msg || "Mobile number already exists");
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
          newErrors.email = response.stat_msg || "Email already exists";
          toast.error(response.stat_msg || "Email already exists");
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("registerEmail");
            sessionStorage.removeItem("email");
          }
        }
        setErrors((prev) => ({ ...prev, ...newErrors }));
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Registration failed. Please try again." });
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const isGstValid =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      formData.gst_number || "",
    );

  const inputFieldSx = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      bgcolor: "#ffffff",
      fontSize: "0.92rem",
      "& fieldset": { borderColor: "#d1d5db" },
      "&:hover fieldset": { borderColor: "#9ca3af" },
      "&.Mui-focused fieldset": {
        borderColor: "#0b291d",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.9rem",
      color: "#6b7280",
      "&.Mui-focused": { color: "#0b291d" },
    },
  };

  return {
    push,
    navigation,
    location,
    activeStep,
    setActiveStep,
    completedSteps,
    setCompletedSteps,
    isFirstTimeSuccess,
    setIsFirstTimeSuccess,
    checkLoading,
    setCheckLoading,
    statusMessage,
    setStatusMessage,
    mobileNoRef,
    theme,
    isMobile,
    masterData,
    setMasterData,
    MasterData,
    CompanyType,
    DocumentType,
    TypeofEntityOptions,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    IsMobileThrough,
    setIsMobileThrough,
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    setLoading,
    submitSuccess,
    setSubmitSuccess,
    search,
    cancelRedireactUrl,
    handleCheckStatus,
    handleRegisterNew,
    canNavigateToStep,
    isStepFieldsComplete,
    validateStep,
    areAllStepsComplete,
    isStepComplete,
    handleDocRemove,
    handleDocNumberChange,
    handleDocFileChange,
    handleInputChange,
    handleSelectChange,
    handleNext,
    handleBack,
    handleStepClick,
    handleSubmit,
    isGstValid,
    inputFieldSx,
  };
}
