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


const masterContext = createContext({
    cacheList: null,
    setCacheList: () => { },
});

export const MasterProvider = ({ children, getCompanyInfoData, getStoreInit, getMyAccountFlags }) => {
    if (typeof window !== "undefined") {
        window.__STORE_INIT__ = getStoreInit;
    }
    const [cacheList, setCacheList] = useState(null);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useNextRouterLikeRR();


    const handleSubmit = async () => {
        WebLoginWithMobileToken(token)
            .then((response) => {
                console.log(response, "response")
                if (response.Data.rd[0].stat === 1) {
                    sessionStorage.setItem("LoginUser", true);
                    sessionStorage.setItem("loginUserDetail", JSON.stringify(response.Data.rd[0]));
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
        const isMobileApp = getStoreInit?.domain === "nxt14.optigoapps.com" || getStoreInit?.domain === "nxtmobileapp.web" || getStoreInit?.domain === "fgstore.mapp";
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
                    // parse stored cookie (if it's JSON)
                    const visitorIdCookie = existingVisitorId.startsWith('{') ? JSON.parse(existingVisitorId) : null;
                    if (visitorIdCookie) {
                        const expirationDate =
                            visitorIdCookie?.expires && new Date(visitorIdCookie.expires);

                        if (expirationDate && expirationDate <= new Date()) {
                            // remove expired cookie
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
        sessionStorage.setItem("storeInit", JSON.stringify(getStoreInit));
        sessionStorage.setItem("myAccountFlags", JSON.stringify(getMyAccountFlags));
        fetchVisitorId();
    }, [])

    // Paymaster fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedPayMaster = sessionStorage.getItem("payMaster");
                if (!storedPayMaster) {
                    const payMaster = await fetchPayMaster();
                    const res = payMaster?.Data?.rd;
                    if (res?.[0]?.stat != 0 && res?.[0]?.stat_msg != 'Sorry for invonvenient') {
                        sessionStorage.setItem("payMaster", JSON.stringify(res));
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

        const timer = setTimeout(fetchData, 2000); // Reduced delay
        return () => clearTimeout(timer);
    }, []);

    const callApiAndStore = (apiFunction, storageKey, finalID) => {
        apiFunction(finalID)
            .then((response) => {
                if (storageKey === "GetCacheList") {
                    setCacheList(response);
                }
                if (response?.Data?.rd) {
                    sessionStorage.setItem(storageKey, JSON.stringify(response.Data.rd));
                }
            })
            .catch((err) => console.log(err));
    };

    const callAllApi = async () => {
        const storeInit = getStoreInit;
        const loginUserDetail = JSON?.parse(sessionStorage.getItem("loginUserDetail"));
        const LoginUser = JSON?.parse(sessionStorage.getItem("LoginUser"));
        const visiterID = Cookies.get("visiterId");

        const finalID = storeInit?.IsB2BWebsite === 0 ? (LoginUser === false ? visiterID : loginUserDetail?.id || "0") : loginUserDetail?.id || "0";

        // Call all APIs in parallel
        Promise.all([
            callApiAndStore(MetalTypeComboAPI, "metalTypeCombo", finalID),
            callApiAndStore(DiamondQualityColorComboAPI, "diamondQualityColorCombo", finalID),
            callApiAndStore(MetalColorCombo, "MetalColorCombo", finalID),
            callApiAndStore(ColorStoneQualityColorComboAPI, "ColorStoneQualityColorCombo", finalID),
            callApiAndStore(CurrencyComboAPI, "CurrencyCombo", finalID),
            callApiAndStore(CountryCodeListApi, "CountryCodeListApi", finalID),
            callApiAndStore(GetCacheList, "GetCacheList", finalID)
        ]).then(() => {
            console.log("All combo APIs completed");
        }).catch((error) => {
            console.error("Error in API calls:", error);
        });
    };

    const value = {
        cacheList,
        setCacheList
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