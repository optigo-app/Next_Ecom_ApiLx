"use client";

import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { isStoreInitFlagEnabled } from "@/app/(core)/utils/storeFlags";

export function useLoginOption(searchParams = {}) {
  const { storeInit } = useStore();
  const showMobileLogin = !isStoreInitFlagEnabled(storeInit, "webMobileLoginOff");
  const loginRedirect =
    searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  let securityKey = searchParams?.SK || searchParams?.SecurityKey || "";

  if (!securityKey && loginRedirect) {
    try {
      const urlText = decodeURIComponent(loginRedirect);
      const keyMatch = urlText.match(/\/K=([^/?&#]+)/);
      if (keyMatch) {
        try {
          securityKey = atob(keyMatch[1]);
        } catch {}
      }
      if (!securityKey) securityKey = urlText.match(/[?&](SK|SecurityKey)=([^&]+)/)?.[2] || "";
    } catch {
      securityKey = "";
    }
  }

  const queryParamStr = `${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}` : securityKey ? `?SK=${encodeURIComponent(securityKey)}` : ""}`;

  return {
    showMobileLogin,
    redirectEmailUrl: `/ContinueWithEmail${queryParamStr}`,
    redirectMobileUrl: `/ContinueWithMobile${queryParamStr}`,
    redirectRegisterUrl: `/register${queryParamStr}`,
  };
}
