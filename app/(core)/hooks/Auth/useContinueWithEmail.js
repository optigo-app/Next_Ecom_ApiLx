"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ContinueWithEmailAPI } from "@/app/(core)/utils/API/Auth/ContinueWithEmailAPI";
import { isStoreInitFlagEnabled } from "@/app/(core)/utils/storeFlags";
import { useAuthRedirects } from "./useAuthRedirects";
import { markAuthRegistrationPrefill } from "@/app/(core)/utils/authRegistrationPrefill";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function useContinueWithEmail({ searchParams, storeInit }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { withAuthQuery, cancelUrl } = useAuthRedirects(searchParams);

  const redirectEmailUrl = withAuthQuery("/LoginWithEmail", { email: email.trim() });
  const redirectSignUpUrl = withAuthQuery("/register", { email: email.trim() });

  useEffect(() => {
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("Countrycodestate");
  }, []);

  const handleEmailChange = (event) => {
    const value = event.target.value.trim();
    setEmail(value);
    if (!value) setEmailError("Email is required.");
    else if (!isValidEmail(value)) setEmailError("Please enter a valid email");
    else setEmailError("");
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return setEmailError("Email is required.");
    if (!isValidEmail(trimmedEmail)) return setEmailError("Please enter a valid email.");

    setIsLoading(true);
    try {
      const response = await ContinueWithEmailAPI(trimmedEmail);
      setIsLoading(false);
      const result = response?.Data?.rd?.[0];

      if (result?.stat == 1 && result?.islead == 1) {
        toast.error("You are not a customer, contact to admin");
      } else if (result?.stat == 1 && result?.islead == 0) {
        router.push(redirectEmailUrl);
        sessionStorage.setItem("registerEmail", trimmedEmail);
        sessionStorage.setItem("email", trimmedEmail);
        sessionStorage.removeItem("registerMobile");
      } else if (isStoreInitFlagEnabled(storeInit, "ecomOtpVerification")) {
        if (process.env.NODE_ENV === "development") {
          alert(Number(result?.OTP) ? result.OTP : 123456);
        }
        setIsOpen(true);
      } else {
        markAuthRegistrationPrefill();
        sessionStorage.setItem("registerEmail", trimmedEmail);
        sessionStorage.setItem("email", trimmedEmail);
        sessionStorage.removeItem("registerMobile");
        router.push(redirectSignUpUrl);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return {
    email,
    emailError,
    isLoading,
    isOpen,
    setIsOpen,
    cancelUrl,
    handleEmailChange,
    handleSubmit,
  };
}
