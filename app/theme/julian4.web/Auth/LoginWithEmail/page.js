"use client";
import React, { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "./LoginWithEmail.modul.scss";
import { LoginWithEmailAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailAPI";
import { ForgotPasswordEmailAPI } from "@/app/(core)/utils/API/Auth/ForgotPasswordEmailAPI";
import Cookies from "js-cookie";
import { CurrencyComboAPI } from "@/app/(core)/utils/API/Combo/CurrencyComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

export default function LoginWithEmail({ params, searchParams, storeInit }) {
  const { islogin, setislogin, setCartCountNum, setWishCountNum } = useStore();
  const [email, setEmail] = useState("");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();

  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const redirectEmailUrl = search ? decodeURIComponent(search) : "/";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}`;

  useEffect(() => {
    const storedEmail = (() => {
      const raw = sessionStorage.getItem("registerEmail");
      if (!raw) return "";
      try {
        return raw.trim().startsWith("{") || raw.trim().startsWith("[") || raw.trim().startsWith('"')
          ? JSON.parse(raw)
          : raw;
      } catch {
        return raw;
      }
    })();
    if (storedEmail) setEmail(storedEmail);
  }, []);



  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);
    if (fieldName === "confirmPassword") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Password is required" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }
    }
  };
  const handleMouseDownConfirmPassword = (event) => {
    event?.preventDefault();
  };

  function hashPasswordSHA1(password) {
    const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }



  const handleSubmit = async () => {
    const visiterId = Cookies.get("visiterId");
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Password is required";
      return;
    }

    const hashedPassword = hashPasswordSHA1(confirmPassword);

    setIsLoading(true);
    LoginWithEmailAPI(email, "", hashedPassword, "", "", visiterId)
      .then((response) => {
        setIsLoading(false);
        if (response.Data.rd[0].stat === 1) {
          const visiterID = Cookies.get("visiterId");
          Cookies.set("userLoginCookie", response?.Data?.rd[0]?.Token);
          Cookies.set('LoginUser', true)
          sessionStorage.setItem("registerEmail", email);
          setislogin(true);
          sessionStorage.setItem("LoginUser", true);
          sessionStorage.setItem("loginUserDetail", JSON.stringify(response.Data.rd[0]));

          GetCountAPI(visiterID)
            .then((res) => {
              if (res) {
                setCartCountNum(res?.cartcount);
                setWishCountNum(res?.wishcount);
              }
            })
            .catch((err) => {
              if (err) {
                console.log("getCountApiErr", err);
              }
            });

          CurrencyComboAPI(response?.Data?.rd[0]?.id)
            .then((response) => {
              if (response?.Data?.rd) {
                let data = JSON.stringify(response?.Data?.rd);
                sessionStorage.setItem("CurrencyCombo", data);
              }
            })
            .catch((err) => console.log(err));

          MetalColorCombo(response?.Data?.rd[0]?.id)
            .then((response) => {
              if (response?.Data?.rd) {
                let data = JSON.stringify(response?.Data?.rd);
                sessionStorage.setItem("MetalColorCombo", data);
              }
            })
            .catch((err) => console.log(err));

          MetalTypeComboAPI(response?.Data?.rd[0]?.id)
            .then((response) => {
              if (response?.Data?.rd) {
                let data = JSON.stringify(response?.Data?.rd);
                sessionStorage.setItem("metalTypeCombo", data);
              }
            })
            .catch((err) => console.log(err));

          if (redirectEmailUrl) {
            window.location.replace(redirectEmailUrl);
          } else {
            window.location.replace("/");
          }


        } else {
          errors.confirmPassword = response.Data.rd[0].stat_msg;
        }
      })
      .catch((err) => console.log(err));

  };

  const handleTogglePasswordVisibility = (fieldName) => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNavigation = () => {
    sessionStorage.setItem("LoginCodeEmail", "true");
    navigation(`/LoginWithEmailCode?LoginRedirect=${search}`);
    sessionStorage.setItem('email', JSON.stringify(location.state?.email))
  };

  const handleForgotPassword = async () => {
    // let Domian = `${window?.location?.protocol}//${storeInit?.domain}`;
    let Domian = `https://nxt29.optigoapps.com`;
    setIsLoading(true);
    ForgotPasswordEmailAPI(Domian, email)
      .then((response) => {
        setIsLoading(false);
        if (response.Data.rd[0].stat === 1) {
          toast.success("Reset Link Send On Your Email");
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const HandleCancel = () => {
    navigation(`/LoginOption?LoginRedirect=${search}`)
  }

  return (
    <div className="elv_fg_smr_loginEmail">
      {isLoading && (
        <div className="loader-overlay">
          <CircularProgress className="loadingBarManage" />
        </div>
      )}
      <div>
        <div className="smr_loginEmailD">
          <p
            style={{
              textAlign: "center",
              fontSize: "40px",
              color: "#7d7f85",
            }}
            className="AuthScreenMainTitle"
          >
            Login With Password
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "15px",
              color: "#7d7f85",
            }}
            className="AuthScreenSubTitle"
          >
            using {email}
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <TextField
              autoFocus
              id="outlined-confirm-password-input"
              label="Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="current-password"
              className="smr_loginPasswordBox"
              style={{ margin: "15px" }}
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility("confirmPassword")} onMouseDown={handleMouseDownConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <button
              className="submitBtnForgot"
              style={{
                fontWeight: "600",
              }}
              onClick={handleSubmit}
            >
              Login
            </button>
            <Button style={{ marginTop: "10px", color: "gray" }} onClick={HandleCancel}>
              CANCEL
            </Button>

            <button type="submit" className="SmilingLoginCodeBtn" onClick={handleNavigation}>
              Login With a Code instead on email
            </button>
            <p className="go_pass_fg" style={{ textAlign: "center" }}>
              Go passwordless! we'll send you an email.
            </p>

            <p style={{ color: "blue", cursor: "pointer" }} onClick={handleForgotPassword}>
              Forgot Password ?
            </p>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
                <p 
          className="backtotop_Smr"
                
                style={{ margin: '0px', fontWeight: 500, width: '100px', color: 'white', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>BACK TO TOP</p>
            </div> */}
    </div>
  );
}
