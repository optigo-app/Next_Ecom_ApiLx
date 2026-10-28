"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ContimueWithMobileAPI } from "@/app/(core)/utils/API/Auth/ContimueWithMobileAPI";
import { isStoreInitFlagEnabled } from "@/app/(core)/utils/storeFlags";
import { useAuthRedirects } from "./useAuthRedirects";
import { markAuthRegistrationPrefill } from "@/app/(core)/utils/authRegistrationPrefill";

export function useContinueWithMobile({ searchParams, storeInit }) {
  const router = useRouter();
  const [mobileNo, setMobileNo] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [Countrycodestate, setCountrycodestate] = useState();
  const { withAuthQuery, cancelUrl, search } = useAuthRedirects(searchParams);
  const redirectMobileUrl = withAuthQuery("/LoginWithMobileCode");
  const redirectSignUpUrl = withAuthQuery("/register");

  useEffect(() => {
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("Countrycodestate");
  }, []);

  const handleInputChange = (event, setter) => {
    setter(event.target.value.trim().replace(/\s/g, ""));
  };

  const saveRegistrationDetails = (forRegistration = false) => {
    if (forRegistration) markAuthRegistrationPrefill();
    sessionStorage.setItem("Countrycodestate", Countrycodestate);
    sessionStorage.setItem("registerMobile", mobileNo);
    sessionStorage.removeItem("registerEmail");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!mobileNo.trim()) {
      setErrors({ mobileNo: "Mobile No. is required" });
      return;
    }

    let allCodes = [];
    try {
      allCodes = JSON.parse(sessionStorage.getItem("CountryCodeListApi") || "[]");
    } catch {
      allCodes = [];
    }
    const phoneCode = allCodes.find(
      (item) => item?.mobileprefix == Countrycodestate || item?.MobilePrefix == Countrycodestate,
    );
    const requiredLength = phoneCode?.PhoneLength || phoneCode?.phonelength || 10;
    if (!new RegExp(`^\\d{${requiredLength}}$`).test(mobileNo.trim())) {
      setErrors({ mobileNo: `Mobile number must be ${requiredLength} digits.` });
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const response = await ContimueWithMobileAPI(mobileNo, Countrycodestate);
      setIsLoading(false);
      const result = response?.Data?.rd?.[0];
      if (response?.Status == 400) {
        toast.error(response?.Message);
        setIsSubmitting(false);
      } else if (result?.stat === 1 && result?.islead === 1) {
        toast.error("You are not a customer, contact to admin");
        setIsSubmitting(false);
      } else if (result?.stat === 1 && result?.islead === 0) {
        toast.success("OTP send Successfully");
        router.push(redirectMobileUrl);
        saveRegistrationDetails();
        setIsSubmitting(false);
      } else if (
        Countrycodestate != "91" ||
        !isStoreInitFlagEnabled(storeInit, "ecomOtpVerification")
      ) {
        saveRegistrationDetails(true);
        router.push(redirectSignUpUrl);
      } else {
        saveRegistrationDetails();
        setIsOpen(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return {
    mobileNo,
    setMobileNo,
    errors,
    setErrors,
    isLoading,
    isSubmitting,
    isOpen,
    setIsOpen,
    Countrycodestate,
    setCountrycodestate,
    search,
    cancelUrl,
    handleInputChange,
    handleSubmit,
  };
}
