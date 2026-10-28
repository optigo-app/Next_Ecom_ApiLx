"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { ResetPasswordAPI } from "@/app/(core)/utils/API/Auth/ResetPasswordAPI";

const isValidPassword = (value) =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);

export function useForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("userid");
    if (!idFromUrl) {
      router.push("/");
      return;
    }
    setUserId(idFromUrl);
    const storedEmail = sessionStorage.getItem("userEmailForPdList");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleInputChange = (event, setter, fieldName) => {
    const { value } = event.target;
    setter(value);
    if (fieldName === "confirmPassword") {
      setErrors((previous) => ({
        ...previous,
        confirmPassword: value.trim() ? "" : "Password is required",
      }));
    }
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(
      isValidPassword(value)
        ? ""
        : "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.",
    );
  };

  const handleTogglePasswordVisibility = (fieldName) => {
    if (fieldName === "password") setShowPassword((visible) => !visible);
    else if (fieldName === "confirmPassword") setShowConfirmPassword((visible) => !visible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!password.trim()) {
      setPasswordError("Password is required");
      nextErrors.password = "Password is required";
    }
    if (!confirmPassword.trim()) nextErrors.confirmPassword = "Confirm Password is required";
    else if (confirmPassword.trim() !== password.trim()) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length || passwordError) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const response = await ResetPasswordAPI(email, hashedPassword, userId);
      setIsLoading(false);
      const result = response?.Data?.rd?.[0];
      if (result?.stat === 1) {
        toast.success("Password reset successfully! Please login with your new password.");
        router.push("/LoginOption");
      } else {
        toast.error(result?.stat_msg || "Error resetting password");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return {
    password,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    email,
    errors,
    passwordError,
    isLoading,
    navigation: (path) => router.push(path),
    handleInputChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleSubmit,
  };
}
