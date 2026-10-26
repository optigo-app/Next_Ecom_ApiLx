"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useStore } from "../../contexts/StoreProvider";
import { LoginWithCustomerCodeAlbumAPI } from "../../utils/API/Auth/LoginWithCustomerCodeAlbum";
import { setSession } from "../../utils/FetchSessionData";
import { syncUserDetailToCookies } from "../../utils/product/pricingPolicy";

/** Logs the visitor into the customer associated with a shared ProCatalog album. */
export function useAlbumAuth(customerId, enabled = true) {
  const { setislogin, setLoginUserDetail } = useStore();
  const attemptedCustomerId = useRef("");

  useEffect(() => {
    const normalizedCustomerId = String(customerId || "").trim();
    if (!enabled || !normalizedCustomerId || attemptedCustomerId.current === normalizedCustomerId) return;
    attemptedCustomerId.current = normalizedCustomerId;

    LoginWithCustomerCodeAlbumAPI(normalizedCustomerId, Cookies.get("userLoginCookie") || "")
      .then((response) => {
        const userDetail = response?.Data?.rd?.[0];
        if (Number(userDetail?.stat) !== 1) return;

        const token = userDetail?.Token ?? userDetail?.token;
        if (token) Cookies.set("userLoginCookie", String(token), { path: "/", expires: 7 });
        Cookies.set("LoginUser", "true", { path: "/", expires: 7 });
        syncUserDetailToCookies(userDetail);
        setSession("LoginUser", true);
        setSession("loginUserDetail", userDetail);
        setislogin(true);
        setLoginUserDetail(userDetail);
      })
      .catch((error) => {
        console.error("Album customer login error:", error);
      });
  }, [customerId, enabled, setislogin, setLoginUserDetail]);
}
