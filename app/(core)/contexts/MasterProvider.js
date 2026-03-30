"use client"

import React, { useEffect, createContext, useState, useContext } from "react";
import { CurrencyComboAPI } from "@/app/(core)/utils/API/Combo/CurrencyComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { CountryCodeListApi } from "@/app/(core)/utils/API/Auth/CountryCodeListApi";
import { MetalTypeComboAPI } from "@/app/(core)//utils/API/Combo/MetalTypeComboAPI";
import { fetchPayMaster } from "@/app/(core)/utils/API/OrderFlow/Paymaster";
import Cookies from 'js-cookie';


import { WebLoginWithMobileToken } from "../utils/API/Auth/WebLoginWithMobileToken";
import { useSearchParams } from "next/navigation";
import { useNextRouterLikeRR } from "../hooks/useLocationRd";
import { getSession, setSession } from "../utils/FetchSessionData";
import { GetCacheList } from "../utils/API/Cache/CacheApi";
import { fetchStoreInitData } from "../utils/fetchStoreInit";


const masterContext = createContext({
    cacheList: null,
    setCacheList: () => { },
    isMasterReady: false,
});

export const MasterProvider = ({ children, getCompanyInfoData, getStoreInit, getMyAccountFlags }) => {
    if (typeof window !== "undefined") {
        window.__STORE_INIT__ = getStoreInit;
        window.__LOGIN_USER__ = window.__LOGIN_USER__ ?? getSession("LoginUser") ?? false;
        window.__LOGIN_USER_DETAIL__ = window.__LOGIN_USER_DETAIL__ ?? getSession("loginUserDetail") ?? null;
    }
    const [cacheList, setCacheList] = useState(null);
    const [isMasterReady, setIsMasterReady] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useNextRouterLikeRR();


    const handleSubmit = async () => {
        WebLoginWithMobileToken(token)
            .then((response) => {
                console.log(response, "response")
                if (response.Data.rd[0].stat === 1) {
                    setSession("LoginUser", true);
                    setSession("loginUserDetail", response.Data.rd[0]);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        if (token) {
            setSession("token", token);
        }
        const isMobileApp = getStoreInit?.domain == "nxt14.optigoapps.com" || getStoreInit?.domain == "nxtmobileapp.web" || getStoreInit?.domain == "fgstore.mapp";
        if (isMobileApp) {
            const ExistingToken = token || getSession("token");
            console.log(ExistingToken, "ExistingToken")
            if (ExistingToken) {
                handleSubmit();
            } else {
                router.push("/");
            }
        }
    }, [token, getStoreInit?.domain])

    const fetchVisitorId = async () => {
        const storeInitData = getStoreInit;
        const CompanyinfoData = getCompanyInfoData;
        if (CompanyinfoData) {
            const visitorId = CompanyinfoData?.VisitorId;
            const cookieStore = Cookies
            const existingVisitorId = cookieStore.get("visiterId") ?? "";

            if (!existingVisitorId) {
                cookieStore.set("visiterId", visitorId, {
                    path: "/",
                    expires: 60 * 60 * 24 * 30,
                });
            } else {
                try {
                    const visitorIdCookie = existingVisitorId.startsWith('{') ? JSON.parse(existingVisitorId) : null;
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

    // Paymaster fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedPayMaster = getSession("payMaster");
                if (!storedPayMaster) {
                    const payMaster = await fetchPayMaster();
                    const res = payMaster?.Data?.rd;
                    if (res?.[0]?.stat != 0 && res?.[0]?.stat_msg != 'Sorry for invonvenient') {
                        setSession("payMaster", res);
                    } else {
                        console.log(
                            "%c❌ ERROR: Payment Master API returned nothing! \n%cSorry for inconvenience — please contact your administrator.",
                            "color: white; background: red; font-size: 18px; font-weight: bold; padding: 8px; border-radius: 4px;",
                            "color: red; font-size: 16px; font-weight: bold;"
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching or retrieving payMaster:", error);
            }
        };

        const timer = setTimeout(fetchData, 100); // Reduced from 2000 to 100
        return () => clearTimeout(timer);
    }, []);

    const callApiAndStore = (apiFunction, storageKey, finalID) => {
        const existingData = getSession(storageKey);
        if (existingData && existingData.length > 0) {
            if (storageKey === "GetCacheList") {
                setCacheList({ Data: { rd: existingData } });
            }
            return Promise.resolve({ Data: { rd: existingData } });
        }

        return apiFunction(finalID)
            .then((response) => {
                if (storageKey === "GetCacheList") {
                    setCacheList(response);
                }
                if (response?.Data?.rd) {
                    setSession(storageKey, response.Data.rd);
                }
                return response;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    };

    console.log(typeof window !== "undefined")
    const callAllApi = async () => {
        const storeInit = getStoreInit || window.__STORE_INIT__;
        const loginUserDetail = getSession("loginUserDetail");
        const LoginUser = getSession("LoginUser");
        const visiterID = Cookies.get("visiterId");

        if (typeof window !== "undefined") {
            if (!window.__LOGIN_USER_DETAIL__ && loginUserDetail) window.__LOGIN_USER_DETAIL__ = loginUserDetail;
            if (typeof window.__LOGIN_USER__ === "undefined" && typeof LoginUser !== "undefined") window.__LOGIN_USER__ = LoginUser;
        }

        const finalID = storeInit?.IsB2BWebsite === 0 ? (LoginUser === false ? visiterID : loginUserDetail?.id || "0") : loginUserDetail?.id || "0";

        // Prioritize the 5 important APIs mentioned by user, but keep country and cache list for completeness
        try {
            await Promise.all([
                callApiAndStore(MetalTypeComboAPI, "metalTypeCombo", finalID),
                callApiAndStore(DiamondQualityColorComboAPI, "diamondQualityColorCombo", finalID),
                callApiAndStore(MetalColorCombo, "MetalColorCombo", finalID),
                callApiAndStore(ColorStoneQualityColorComboAPI, "ColorStoneQualityColorCombo", finalID),
                callApiAndStore(CurrencyComboAPI, "CurrencyCombo", finalID),
                callApiAndStore(CountryCodeListApi, "CountryCodeListApi", finalID),
                callApiAndStore(GetCacheList, "GetCacheList", finalID)
            ]);
            console.log("All combo APIs completed");
            setIsMasterReady(true);
        } catch (error) {
            console.error("Error in API calls:", error);
            setIsMasterReady(true); // Still set to ready to avoid blocking UI forever
        }
    };

    const value = {
        cacheList,
        setCacheList,
        isMasterReady
    }

    return <masterContext.Provider value={value}>
        {children}
    </masterContext.Provider>
}


export const useMaster = () => {
    const context = useContext(masterContext);
    if (!context) {
        throw new Error("useMaster must be used within MasterProvider");
    }
    return context;
}