"use client";

import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { LoginWithEmailAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailAPI";
import { ForgotPasswordEmailAPI } from "@/app/(core)/utils/API/Auth/ForgotPasswordEmailAPI";
import { CurrencyComboAPI } from "@/app/(core)/utils/API/Combo/CurrencyComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { setSession } from "@/app/(core)/utils/FetchSessionData";
import { useAuthRedirects } from "./useAuthRedirects";

export function usePasswordLogin({ searchParams }) {
  const { setislogin, setCartCountNum, setWishCountNum } = useStore();
  const [email, setEmail] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { returnUrl, cancelUrl, withAuthQuery } = useAuthRedirects(searchParams);

  useEffect(() => {
    let storedEmail = "";
    if (searchParams?.email) {
      try {
        storedEmail = decodeURIComponent(searchParams.email);
        sessionStorage.setItem("registerEmail", storedEmail);
      } catch (error) {
        console.error("Failed to decode email from searchParams", error);
      }
    }
    if (!storedEmail) {
      const raw = sessionStorage.getItem("registerEmail");
      if (raw) {
        try {
          storedEmail = raw.trim().startsWith("{") || raw.trim().startsWith("[") || raw.trim().startsWith('"')
            ? JSON.parse(raw)
            : raw;
        } catch {
          storedEmail = raw;
        }
      }
    }
    if (storedEmail) setEmail(storedEmail);
  }, [searchParams?.email]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors((previous) => ({
      ...previous,
      confirmPassword: value.trim() ? "" : "Password is required",
    }));
  };

  const handleSubmit = async () => {
    const visitorId = Cookies.get("visiterId");
    if (!confirmPassword.trim()) {
      setErrors((previous) => ({ ...previous, confirmPassword: "Password is required" }));
      return;
    }

    const hashedPassword = CryptoJS.SHA1(confirmPassword).toString(CryptoJS.enc.Hex);
    setIsLoading(true);
    try {
      const response = await LoginWithEmailAPI(email, "", hashedPassword, "", "", visitorId);
      setIsLoading(false);
      const userDetail = response?.Data?.rd?.[0];
      if (userDetail?.stat === 1) {
        const pkgId = userDetail?.PackageId ?? userDetail?.packageId ?? userDetail?.PackageID;
        Cookies.set("userLoginCookie", userDetail?.Token, { path: "/", expires: 7 });
        Cookies.set("LoginUser", "true", { path: "/", expires: 7 });
        if (pkgId != null && pkgId !== "" && String(pkgId) !== "undefined" && String(pkgId) !== "null") {
          Cookies.set("userPackageId", String(pkgId), { path: "/", expires: 7 });
        }

        sessionStorage.setItem("registerEmail", email);
        setislogin(true);
        setSession("LoginUser", true);
        setSession("loginUserDetail", userDetail);

        GetCountAPI(visitorId)
          .then((result) => {
            if (result) {
              setCartCountNum(result?.cartcount);
              setWishCountNum(result?.wishcount);
            }
          })
          .catch((error) => console.log("getCountApiErr", error));

        CurrencyComboAPI(userDetail?.id)
          .then((result) => {
            if (result?.Data?.rd) sessionStorage.setItem("CurrencyCombo", JSON.stringify(result.Data.rd));
          })
          .catch((error) => console.log(error));

        MetalColorCombo(userDetail?.id)
          .then((result) => {
            if (result?.Data?.rd) sessionStorage.setItem("MetalColorCombo", JSON.stringify(result.Data.rd));
          })
          .catch((error) => console.log(error));

        MetalTypeComboAPI(userDetail?.id)
          .then((result) => {
            if (result?.Data?.rd) sessionStorage.setItem("metalTypeCombo", JSON.stringify(result.Data.rd));
          })
          .catch((error) => console.log(error));

        window.location.replace(returnUrl || "/");
      } else {
        setErrors((previous) => ({
          ...previous,
          confirmPassword: userDetail?.stat_msg || "Invalid credentials",
        }));
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => setShowConfirmPassword((visible) => !visible);

  const handleNavigation = () => {
    sessionStorage.setItem("LoginCodeEmail", "true");
    sessionStorage.setItem("registerEmail", email);
    sessionStorage.setItem("email", email);
    router.push(withAuthQuery("/LoginWithEmailCode"));
  };

  const handleForgotPassword = async () => {
    const domain = window?.location?.origin || "https://nxt29.optigoapps.com";
    setIsLoading(true);
    try {
      const response = await ForgotPasswordEmailAPI(domain, email);
      setIsLoading(false);
      if (response?.Data?.rd?.[0]?.stat === 1) toast.success("Reset link sent to your email");
      else toast.error(response?.Data?.rd?.[0]?.stat_msg || "Error sending reset link");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return {
    email,
    confirmPassword,
    showConfirmPassword,
    errors,
    isLoading,
    cancelUrl,
    handleInputChange,
    handleSubmit,
    handleTogglePasswordVisibility,
    handleNavigation,
    handleForgotPassword,
  };
}
