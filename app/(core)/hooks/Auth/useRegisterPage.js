"use client";

import { useEffect, useState } from "react";
import { isStoreInitFlagEnabled } from "@/app/(core)/utils/storeFlags";

export function useRegisterPage(propStoreInit) {
  const [storeInit, setStoreInit] = useState(propStoreInit);

  useEffect(() => {
    if (storeInit) return;
    try {
      const cachedStoreInit = sessionStorage.getItem("storeInit");
      if (cachedStoreInit) setStoreInit(JSON.parse(cachedStoreInit));
    } catch (error) {
      console.error(error);
    }
  }, [storeInit]);

  return {
    storeInit,
    isB2B: isStoreInitFlagEnabled(storeInit, "signUpWithCompanyInfo"),
  };
}
