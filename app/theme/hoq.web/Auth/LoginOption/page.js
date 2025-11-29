"use client"

import React, { useEffect } from "react";
import "./LoginOption.modul.scss";
import { useRouter } from "next/navigation";  // Updated import
import { useSearchParams } from "next/navigation"; // Add this import for searchParams

import { FaMobileAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Link from "next/link";

const LoginOption = ({ searchParams }) => {
  const navigation = useRouter();
  const { LoginRedirect = "", search = "" } = searchParams || {};
  const loginRedirect = LoginRedirect || search || "";
  const redirectEmailUrl = `/ContinueWithEmail${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}` : ""}`;
  const redirectMobileUrl = `/ContinueWithMobile${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}` : ""}`;

  const LoginMail = () => {
    try {
      navigation.push(redirectEmailUrl);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const LoginMobile = () => {
    try {
      navigation.push(redirectMobileUrl);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  useEffect(() => {
    console.log("redirectEmailUrl or redirectMobileUrl changed");
  }, [redirectEmailUrl, redirectMobileUrl]);

  return (
    <div className="Hoq_Loginoption">
      <div className="loginDailog">
        <div>
          <p className="loginDiTile">Log in or sign up in seconds</p>
          <p
            style={{
              textAlign: "center",
              color: "#7d7f85",
              margin: "20px 0px",
            }}
          >
            Use your email or mobile no to continue with the organization.
          </p>
          <div className="smilingLoginOptionMain">
            <div className="loginMail" onClick={LoginMail}>
              <IoMdMail style={{ height: "25px", width: "25px" }} />
              <p
                style={{
                  margin: "0px",
                  fontSize: "20px",
                  fontWeight: 500,
                  paddingLeft: "25px",
                }}
              >
                Continue with email
              </p>
            </div>
            <div className="loginMobile" onClick={LoginMobile}>
              <FaMobileAlt
                style={{ height: "25px", width: "25px", marginRight: "10px" }}
              />
              <p
                style={{
                  margin: "0px",
                  fontSize: "20px",
                  fontWeight: 500,
                  paddingLeft: "25px",
                }}
              >
                Log in with mobile
              </p>
            </div>
          </div>
          <p
            className="hoq_agree"
            style={{
              marginTop: "40px",
              fontSize: "14px",
              color: "#7d7f85",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link href={"/register"}>
              Don’t have an account? <span>Register</span>
            </Link>
            <br />
            <Link href={"/privacyPolicy"}>
              By continuing, you agree to our Terms of Use. Read our Privacy
              Policy.
            </Link>
          </p>
        </div>
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
};

export default LoginOption;
