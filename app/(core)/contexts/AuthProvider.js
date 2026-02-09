"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginWithEmailAPI } from "../utils/API/Auth/LoginWithEmailAPI";
import { useStore } from "./StoreProvider";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children, storeInit }) {
  const { islogin, setislogin } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginRedirect = searchParams.get("LoginRedirect");
  const redirectEmailUrl = loginRedirect ? decodeURIComponent(loginRedirect) : "/";
  const [localData, setLocalData] = useState(null);


  useEffect(() => {
    const cookieValue = Cookies.get("userLoginCookie");
    if (cookieValue && islogin === false) {
      LoginWithEmailAPI("", "", "", "", cookieValue)
        .then((response) => {
          if (response?.Data?.rd[0]?.stat === 1) {
            Cookies.set("userLoginCookie", response?.Data?.rd[0]?.Token);
            setislogin(true);
            sessionStorage.setItem("LoginUser", true);
            sessionStorage.setItem("loginUserDetail", JSON.stringify(response.Data.rd[0]));
            if (redirectEmailUrl) {
              router.push(redirectEmailUrl);
            } else if (location.pathname.startsWith("/accountdwsr")) {
              router.push("/accountdwsr");
            } else {
              // router.push("/");
            }
          }
        })
        .catch((err) => console.log(err));
    }
    let localD = storeInit
    setLocalData(localD);
  }, [islogin, redirectEmailUrl]);

  const value = {
    localData,
    setLocalData
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
