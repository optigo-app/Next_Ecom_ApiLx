"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { LoginWithEmailCodeAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailCodeAPI";
import { ContimueWithMobileAPI } from "@/app/(core)/utils/API/Auth/ContimueWithMobileAPI";
import { LoginWithEmailAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailAPI";
import { setSession } from "@/app/(core)/utils/FetchSessionData";
import { useAuthRedirects } from "./useAuthRedirects";
import { useOtpCountdown } from "./useOtpCountdown";

export function useOtpLogin({ method, searchParams }) {
  const isEmail = method === "email";
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { seconds: resendTimer, restart: restartResendTimer } = useOtpCountdown();
  const { returnUrl, cancelUrl } = useAuthRedirects(searchParams);

  useEffect(() => {
    if (isEmail) {
      const storedEmail = sessionStorage.getItem("registerEmail") || "";
      if (storedEmail) {
        setEmail(storedEmail);
        if (sessionStorage.getItem("LoginCodeEmail") === "true") {
          sessionStorage.setItem("LoginCodeEmail", "false");
          LoginWithEmailCodeAPI(storedEmail)
            .then((response) => {
              if (response?.Data?.rd?.[0]?.stat == 1) toast.success("OTP sent successfully");
              else toast.error("OTP send error");
            })
            .catch((error) => console.log(error));
        }
      }
    } else {
      const storedMobile = sessionStorage.getItem("registerMobile") || "";
      if (storedMobile) setMobileNo(storedMobile);
    }
  }, [isEmail]);

  const handleSubmit = async () => {
    if (isEmail ? otp.length < 5 : !otp.trim()) {
      setErrors({ otp: isEmail ? "Please complete the code." : "Code is required" });
      return;
    }

    setIsLoading(true);
    try {
      const visitorId = Cookies.get("visiterId");
      const response = await LoginWithEmailAPI(
        isEmail ? email : "",
        isEmail ? "" : mobileNo,
        otp,
        isEmail ? "otp_email_login" : "otp_mobile_login",
        "",
        visitorId,
      );
      setIsLoading(false);
      const userDetail = response?.Data?.rd?.[0];
      if (userDetail?.stat == 1) {
        const packageId = userDetail?.PackageId ?? userDetail?.packageId ?? userDetail?.PackageID;
        if (userDetail?.Token) Cookies.set("userLoginCookie", userDetail.Token, { path: "/", expires: 7 });
        Cookies.set("LoginUser", "true", { path: "/", expires: 7 });
        if (packageId != null && packageId !== "" && String(packageId) !== "undefined" && String(packageId) !== "null") {
          Cookies.set("userPackageId", String(packageId), { path: "/", expires: 7 });
        }
        if (!isEmail) sessionStorage.setItem("registerMobile", mobileNo);
        setSession("LoginUser", true);
        setSession("loginUserDetail", userDetail);
        window.location.href = returnUrl || "/";
      } else {
        setErrors({
          otp: isEmail
            ? "The code you entered is invalid."
            : userDetail?.stat_msg || "Invalid verification code",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setErrors({
        otp: isEmail
          ? "An error occurred while logging in. Please try again."
          : "An error occurred. Please try again.",
      });
    }
  };

  const handleResendCode = async () => {
    restartResendTimer();
    if (isEmail) {
      try {
        const response = await LoginWithEmailCodeAPI(email);
        if (response?.Data?.rd?.[0]?.stat == 1) {
          sessionStorage.setItem("LoginCodeEmail", "false");
          toast.success("OTP sent successfully");
        } else toast.error("OTP send error");
      } catch (error) {
        console.log(error);
      }
      return;
    }

    setIsLoading(true);
    try {
      const countryCode = sessionStorage.getItem("Countrycodestate") || "";
      const response = await ContimueWithMobileAPI(mobileNo, countryCode);
      setIsLoading(false);
      if (response?.Data?.rd?.[0]?.stat == 1) toast.success("OTP sent successfully");
      else toast.error("Error sending OTP");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return {
    email,
    mobileNo,
    otp,
    setOtp,
    errors,
    isLoading,
    resendTimer,
    cancelUrl,
    handleSubmit,
    handleResendCode,
  };
}
