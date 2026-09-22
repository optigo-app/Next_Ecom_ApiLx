"use client";

import React, { useEffect, createContext, useState, useContext, useMemo } from "react";
import { CurrencyComboAPI } from "@/app/(core)/utils/API/Combo/CurrencyComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { CountryCodeListApi } from "@/app/(core)/utils/API/Auth/CountryCodeListApi";
import { RegisterMasterApi } from "@/app/(core)/utils/API/Auth/RegisterMasterApi";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { fetchPayMaster } from "@/app/(core)/utils/API/OrderFlow/Paymaster";
import Cookies from "js-cookie";

import { WebLoginWithMobileToken } from "../utils/API/Auth/WebLoginWithMobileToken";
import { useSearchParams } from "next/navigation";
import { useNextRouterLikeRR } from "../hooks/useLocationRd";
import { getSession, setSession } from "../utils/FetchSessionData";
// import { GetCacheList } from "../utils/API/Cache/CacheApi";
// import { fetchStoreInitData } from "../utils/fetchStoreInit";

const masterContext = createContext({
  cacheList: null,
  setCacheList: () => {},
  isMasterReady: false,
  clearAllCacheData: () => {},
});

export const MasterProvider = ({
  children,
  getCompanyInfoData,
  getStoreInit,
  getMyAccountFlags,
  theme,
}) => {
  console.log(theme , "theme")
  const isBelux = theme === "beluxjewel.web" || theme === "julian.web";
  if (typeof window !== "undefined") {
    window.__STORE_INIT__ = getStoreInit;
    window.__LOGIN_USER__ =
      window.__LOGIN_USER__ ?? getSession("LoginUser") ?? false;
    window.__LOGIN_USER_DETAIL__ =
      window.__LOGIN_USER_DETAIL__ ?? getSession("loginUserDetail") ?? null;
  }
  const [cacheList, setCacheList] = useState(null);
  const [isMasterReady, setIsMasterReady] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useNextRouterLikeRR();

  const handleSubmit = async () => {
    WebLoginWithMobileToken(token)
      .then((response) => {
        console.log(response, "response");
        if (response.Data.rd[0].stat === 1) {
          setSession("LoginUser", true);
          setSession("loginUserDetail", response.Data.rd[0]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (token) {
      setSession("token", token);
    }
    const isMobileApp =
      getStoreInit?.domain == "nxt14.optigoapps.com" ||
      getStoreInit?.domain == "nxtmobileapp.web" ||
      getStoreInit?.domain == "fgstore.mapp";
    if (isMobileApp) {
      const ExistingToken = token || getSession("token");
      console.log(ExistingToken, "ExistingToken");
      if (ExistingToken) {
        handleSubmit();
      } else {
        router.push("/");
      }
    }
  }, [token, getStoreInit?.domain]);

  const fetchVisitorId = async () => {
    const storeInitData = getStoreInit;
    const CompanyinfoData = getCompanyInfoData;
    if (CompanyinfoData) {
      const visitorId = CompanyinfoData?.VisitorId;
      const cookieStore = Cookies;
      const existingVisitorId = cookieStore.get("visiterId") ?? "";

      if (!existingVisitorId) {
        cookieStore.set("visiterId", visitorId, {
          path: "/",
          expires: 60 * 60 * 24 * 30,
        });
      } else {
        try {
          const visitorIdCookie = existingVisitorId.startsWith("{")
            ? JSON.parse(existingVisitorId)
            : null;
          if (visitorIdCookie) {
            const expirationDate =
              visitorIdCookie?.expires && new Date(visitorIdCookie.expires);

            if (expirationDate && expirationDate <= new Date()) {
              cookieStore.remove("visiterId");
            }
          }
        } catch (e) {
          console.error("Error parsing visiterId cookie:", e);
        }
      }
    }

    if (storeInitData) {
      callAllApi();
    }
  };

  useEffect(() => {
    if (getStoreInit) {
      setSession("storeInit", getStoreInit);
      setSession("myAccountFlags", getMyAccountFlags);
      fetchVisitorId();
    }
  }, [getStoreInit, getMyAccountFlags]);

  // Paymaster fetch — fetches and caches payment master in session storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPayMaster = getSession("payMaster");
        if (!storedPayMaster) {
          const payMaster = await fetchPayMaster();
          const res = payMaster?.Data?.rd;
          if (
            res?.[0]?.stat != 0 &&
            res?.[0]?.stat_msg != "Sorry for invonvenient"
          ) {
            setSession("payMaster", res);
          } else {
            console.log(
              "%c❌ ERROR: Payment Master API returned nothing! \n%cSorry for inconvenience — please contact your administrator.",
              "color: white; background: red; font-size: 18px; font-weight: bold; padding: 8px; border-radius: 4px;",
              "color: red; font-size: 16px; font-weight: bold;",
            );
          }
        }
      } catch (error) {
        console.error("Error fetching or retrieving payMaster:", error);
      }
    };

    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, []);

  const callAllApi = async () => {
    const storeInit = getStoreInit || window.__STORE_INIT__;
    const loginUserDetail = getSession("loginUserDetail");
    const LoginUser = getSession("LoginUser");
    const visiterID = Cookies.get("visiterId");

    if (typeof window !== "undefined") {
      if (!window.__LOGIN_USER_DETAIL__ && loginUserDetail)
        window.__LOGIN_USER_DETAIL__ = loginUserDetail;
      if (
        typeof window.__LOGIN_USER__ === "undefined" &&
        typeof LoginUser !== "undefined"
      )
        window.__LOGIN_USER__ = LoginUser;
    }

    const finalID =
      storeInit?.IsB2BWebsite === 0
        ? LoginUser === false
          ? visiterID
          : loginUserDetail?.id || "0"
        : loginUserDetail?.id || "0";

    try {
      if (isBelux) {
        const storedCountry = getSession("CountryCodeListApi");
        const storedB2BMaster = getSession("B2BRegisterMasterApi");

        const fetchPromises = [];

        if (!storedCountry || storedCountry.length === 0) {
          fetchPromises.push(
            CountryCodeListApi(finalID).then((res) => {
              if (res?.Data?.rd) setSession("CountryCodeListApi", res.Data.rd);
            })
          );
        }

        if (!storedB2BMaster) {
          fetchPromises.push(
            RegisterMasterApi(finalID).then((res) => {
              if (res?.Data?.rd) setSession("B2BRegisterMasterApi", res.Data.rd);
            })
          );
        }

        if (fetchPromises.length > 0) {
          await Promise.all(fetchPromises);
        }

        setIsMasterReady(true);
        return;
      }

      // For all other themes: Fetch ALL master combo APIs
      const requiredKeys = [
        "metalTypeCombo",
        "diamondQualityColorCombo",
        "MetalColorCombo",
        "ColorStoneQualityColorCombo",
        "CurrencyCombo",
        "CountryCodeListApi",
        "B2BRegisterMasterApi",
      ];

      const hasAllKeys = requiredKeys.every((key) => {
        const val = getSession(key);
        return val && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0);
      });

      if (hasAllKeys) {
        console.log(
          "[Cache] All combo lists found in session storage. Loading from session.",
        );
        setIsMasterReady(true);
        return;
      }

      console.log(
        "[Cache] Combo lists missing. Fetching fresh combo data from server.",
      );

      // 2. Fetch all individual APIs concurrently for other themes
      const [mt, dia, mc, cs, curr, country, b2bMaster] = await Promise.all([
        MetalTypeComboAPI(finalID),
        DiamondQualityColorComboAPI(finalID),
        MetalColorCombo(finalID),
        ColorStoneQualityColorComboAPI(finalID),
        CurrencyComboAPI(finalID),
        CountryCodeListApi(finalID),
        RegisterMasterApi(finalID),
      ]);

      // 3. Store the fresh combo data in session storage
      if (mt?.Data?.rd) setSession("metalTypeCombo", mt.Data.rd);
      if (dia?.Data?.rd) setSession("diamondQualityColorCombo", dia.Data.rd);
      if (mc?.Data?.rd) setSession("MetalColorCombo", mc.Data.rd);
      if (cs?.Data?.rd) setSession("ColorStoneQualityColorCombo", cs.Data.rd);
      if (curr?.Data?.rd) setSession("CurrencyCombo", curr.Data.rd);
      if (country?.Data?.rd) setSession("CountryCodeListApi", country.Data.rd);
      if (b2bMaster?.Data?.rd) setSession("B2BRegisterMasterApi", b2bMaster.Data.rd);

      console.log("All combo APIs completed and cache updated");
      setIsMasterReady(true);
    } catch (error) {
      console.error("Error in API calls:", error);
      setIsMasterReady(true); // Still set to ready to avoid blocking UI forever
    }
  };

  const clearAllCacheData = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      // Remove specific B2B cookies
      Cookies.remove("userLoginCookie");
      Cookies.remove("LoginUser");
      window.__LOGIN_USER__ = false;
      window.__LOGIN_USER_DETAIL__ = null;
    }
    setCacheList(null);
    setIsMasterReady(false);
  };

const value = useMemo(() => ({
  cacheList,
  setCacheList,
  isMasterReady,
  clearAllCacheData,
}), [cacheList, isMasterReady, clearAllCacheData]);


  return (
    <masterContext.Provider value={value}>{children}</masterContext.Provider>
  );
};

export const useMaster = () => {
  const context = useContext(masterContext);
  if (!context) {
    throw new Error("useMaster must be used within MasterProvider");
  }
  return context;
};
