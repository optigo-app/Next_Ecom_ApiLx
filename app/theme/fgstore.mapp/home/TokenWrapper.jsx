"use client";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { WebLoginWithMobileToken } from "@/app/(core)/utils/API/Auth/WebLoginWithMobileToken";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const TokenWrapper = ({ children }) => {
    const { setislogin, setLoginUserDetail } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const ExistingToken =  token || getSession("token");
    useEffect(() => {
        if (token) {
            setSession("token", token);
        }
        const existingLoginUser = sessionStorage.getItem("LoginUser");
        const Logindetails = getSession("loginUserDetail");
        console.log(existingLoginUser, "existingLoginUser");
        if (existingLoginUser == "true") {
            setislogin(true);
            setLoginUserDetail(Logindetails);
            return;
        }

        WebLoginWithMobileToken(ExistingToken)
            .then((response) => {
                if (token) {
                    setSession("token", token);
                }
                if (response.Data.rd[0].stat === 1) {
                    sessionStorage.setItem("LoginUser", true);
                    setSession("loginUserDetail", response.Data.rd[0]);
                    setislogin(true);
                    setLoginUserDetail(response.Data.rd[0]);
                    router.push("/");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => console.log("done"));
    }, []);

    return children;
};

export default TokenWrapper;
