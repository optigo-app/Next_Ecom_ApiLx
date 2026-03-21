"use client";

import React, { useEffect, useState } from "react";
import "./ContinueWithEmail.scss";
import { Button, CircularProgress, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { ContinueWithEmailAPI } from "@/app/(core)/utils/API/Auth/ContinueWithEmailAPI";
import OTPContainer from '@/app/(core)/utils/Glob_Functions/Otpflow/App';
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useRouter } from 'next/navigation';

export default function ContinueWithEmail({ params, searchParams, storeInit }) {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const navigation = useRouter();
    const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
    const redirectEmailUrl = `/LoginWithEmail${search ? `?LoginRedirect=${encodeURIComponent(search)}` : ""}`;
    const redirectSignUpUrl = `/register${search ? `?LoginRedirect=${encodeURIComponent(search)}` : ""}`;
    const cancelRedireactUrl = `/LoginOption${search ? `?LoginRedirect=${encodeURIComponent(search)}` : ""}`;


    useEffect(() => {
        // Clearing stale email/mobile on mount to ensure a fresh login flow
        sessionStorage.removeItem("registerEmail");
        sessionStorage.removeItem("registerMobile");
        setCSSVariable();
    }, [])
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (event) => {
        const { value } = event.target;
        const trimmedValue = value.trim();
        setEmail(trimmedValue);
        if (!trimmedValue) {
            setEmailError('Email is required.');
        } else if (!validateEmail(trimmedValue)) {
            setEmailError('Please enter a valid email');
        } else {
            setEmailError('');
        }
    };

    const setCSSVariable = () => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty(
            "--background-color",
            backgroundColor
        );
    };



    const handleSubmit = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setEmailError('Email is required.');
            return;
        }
        if (!validateEmail(trimmedEmail)) {
            setEmailError('Please enter a valid email.');
            return;
        }
        setIsLoading(true);
        ContinueWithEmailAPI(trimmedEmail).then((response) => {
            setIsLoading(false);
            console.log(response, "email")

            if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 1) {
                toast.error('You are not a customer, contact to admin')
            } else if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 0) {
                navigation.push(redirectEmailUrl);
                if (trimmedEmail) {
                    sessionStorage?.setItem("registerEmail", trimmedEmail);
                }
            } else {
                // setIsOpen(true)
                // WebSignUpOTPVerify(email).then((res) => {
                //     console.log(res, "res")
                //     setIsLoading(false);
                // })
                navigation.push(redirectSignUpUrl);
                if (trimmedEmail) {
                    sessionStorage?.setItem("registerEmail", trimmedEmail);
                }
            }
        }).catch((err) => console.log(err))
    };

    return (
        <div className="Hoq_continuemail">
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className="loadingBarManage" />
                </div>
            )}
            <div >
                <OTPContainer btncolor="#c20000" bgcolor="#fff" iconcolor="#c20000" iconbgcolor={"#f2f2f2"} />
                <form onSubmit={(e) => { handleSubmit(); e.preventDefault() }} className="smling-forgot-main">
                    <p
                        style={{
                            textAlign: "center",
                            paddingBlock: "60px",
                            marginTop: "0px",
                            fontSize: "40px",
                            color: "#7d7f85",
                        }}
                        className="AuthScreenMainTitle"
                    >
                        Continue With Email
                    </p>
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "-60px",
                            fontSize: "15px",
                            color: "#7d7f85",
                        }}
                        className="AuthScreenSubTitle"
                    >
                        We'll check if you have an account, and help create one if you
                        don't.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            autoFocus
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            className="smr_continuEmailBox"
                            style={{ margin: "15px" }}
                            value={email}
                            // onKeyDown={(event) => {
                            //   if (event.key === "Enter") {
                            //     handleSubmit();
                            //   }
                            // }}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                        />

                        {/* <button
                            className={`submitBtnForgot ${buttonFocused ? 'focused' : ''}`}
                            onClick={handleSubmit}
                            onFocus={() => setButtonFocused(true)}
                            onBlur={() => setButtonFocused(false)}
                            style={{borderColor: 'red'}}
                        >

                        </button> */}

                        <button
                            type="submit"
                            className="hoq_submitBtnForgot"
                        // onClick={handleSubmit}
                        >
                            SUBMIT
                        </button>
                        <Button
                            // type="submit"
                            className="hoq_cancleForgot"
                            style={{ marginTop: "10px", color: "gray", width: "auto" }}
                            onClick={() => navigation.push(cancelRedireactUrl)}
                            sx={{
                                '&:before': {
                                    backgroundColor: 'transparent !important',
                                },
                                '&:before:hover': {
                                    backgroundColor: 'transparent !important',
                                },
                            }}
                        >
                            CANCEL
                        </Button>
                    </div>
                </form>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingBlock: "30px",
                }}
            >
                <p
                    style={{
                        margin: "0px",
                        fontWeight: 500,
                        width: "100px",
                        color: "white",
                        cursor: "pointer",
                    }}
                    onClick={() => window.scrollTo(0, 0)}
                >
                    BACK TO TOP
                </p>
            </div>
        </div>
    );
}
