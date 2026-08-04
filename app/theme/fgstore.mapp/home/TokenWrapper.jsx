"use client";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { WebLoginWithMobileToken } from "@/app/(core)/utils/API/Auth/WebLoginWithMobileToken";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

// ---------------------------------------------------------------------------
// TokenReader — isolated component that calls useSearchParams().
// Wrapped in <Suspense> so that when Next.js suspends this component waiting
// for search params, ONLY this tiny component goes blank (it renders null),
// while ALL children (home content) remain visible at all times.
// Without this split, the entire TokenWrapper subtree — including every home
// section — would blank out while search params resolve on the client.
// ---------------------------------------------------------------------------
const TokenReader = () => {
    const { setislogin, setLoginUserDetail } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const ExistingToken = token || getSession("token");

    useEffect(() => {
        if (token) {
            setSession("token", token);
        }

        const existingLoginUser = sessionStorage.getItem("LoginUser");
        const Logindetails = getSession("loginUserDetail");
        console.log(existingLoginUser, "existingLoginUser");

        // Already authenticated in this session — restore state and stop.
        if (existingLoginUser == "true") {
            setislogin(true);
            setLoginUserDetail(Logindetails);
            return;
        }

        // First load with a stored token — validate it with the server.
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
                    // Only navigate when ?token= is visible in the URL — to strip it
                    // from the address bar. Navigating unconditionally caused the home
                    // page to unmount → blank → remount on every load.
                    if (token) {
                        router.replace("/");
                    }
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => console.log("done"));
    }, []);

    return null; // This component is purely for side-effects
};

// ---------------------------------------------------------------------------
// TokenWrapper — always renders children immediately.
// TokenReader is isolated inside Suspense so only it can suspend; children
// are never affected.
// ---------------------------------------------------------------------------
const TokenWrapper = ({ children }) => {
    return (
        <>
            <Suspense fallback={null}>
                <TokenReader />
            </Suspense>
            {children}
        </>
    );
};

export default TokenWrapper;
