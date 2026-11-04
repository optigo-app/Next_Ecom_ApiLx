'use client';
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "./LoginWithEmail.modul.scss";
import { LoginWithEmailAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailAPI";
import { ForgotPasswordEmailAPI } from "@/app/(core)/utils/API/Auth/ForgotPasswordEmailAPI";
import Cookies from "js-cookie";
import { setSession } from "@/app/(core)/utils/FetchSessionData";
import { CurrencyComboAPI } from "@/app/(core)/utils/API/Combo/CurrencyComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Backdrop,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LoginWithEmail({ params, searchParams, storeInit }) {
  const { islogin, setislogin, setCartCountNum, setWishCountNum } = useStore();
  const [email, setEmail] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const navigation = (path) => router.push(path);

  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";
  const redirectEmailUrl = search ? decodeURIComponent(search) : "/";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;

  useEffect(() => {
    const storedEmail = (() => {
      if (searchParams?.email) {
        try {
          const decoded = decodeURIComponent(searchParams.email);
          sessionStorage.setItem("registerEmail", decoded);
          return decoded;
        } catch (e) {
          console.error("Failed to decode email from searchParams", e);
        }
      }
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
  }, [searchParams?.email]);

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
    return CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
  }

  const handleSubmit = async () => {
    const visiterId = Cookies.get("visiterId");
    if (!confirmPassword.trim()) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Password is required" }));
      return;
    }

    const hashedPassword = hashPasswordSHA1(confirmPassword);
    setIsLoading(true);

    LoginWithEmailAPI(email, "", hashedPassword, "", "", visiterId)
      .then((response) => {
        setIsLoading(false);
        if (response.Data.rd[0].stat === 1) {
          const visiterID = Cookies.get("visiterId");
          const userDetail = response?.Data?.rd[0];
          const pkgId = userDetail?.PackageId ?? userDetail?.packageId ?? userDetail?.PackageID;

          Cookies.set("userLoginCookie", userDetail?.Token, { path: "/", expires: 7 });
          Cookies.set("LoginUser", "true", { path: "/", expires: 7 });
          if (pkgId != null && pkgId !== "" && String(pkgId) !== "undefined" && String(pkgId) !== "null") {
            Cookies.set("userPackageId", String(pkgId), { path: "/", expires: 7 });
          }

          sessionStorage.setItem("registerEmail", email);
          setislogin(true);
          setSession("LoginUser", true);
          setSession("loginUserDetail", userDetail);

          GetCountAPI(visiterID)
            .then((res) => {
              if (res) {
                setCartCountNum(res?.cartcount);
                setWishCountNum(res?.wishcount);
              }
            })
            .catch((err) => console.log("getCountApiErr", err));

          CurrencyComboAPI(response?.Data?.rd[0]?.id)
            .then((res) => {
              if (res?.Data?.rd) {
                sessionStorage.setItem("CurrencyCombo", JSON.stringify(res?.Data?.rd));
              }
            })
            .catch((err) => console.log(err));

          MetalColorCombo(response?.Data?.rd[0]?.id)
            .then((res) => {
              if (res?.Data?.rd) {
                sessionStorage.setItem("MetalColorCombo", JSON.stringify(res?.Data?.rd));
              }
            })
            .catch((err) => console.log(err));

          MetalTypeComboAPI(response?.Data?.rd[0]?.id)
            .then((res) => {
              if (res?.Data?.rd) {
                sessionStorage.setItem("metalTypeCombo", JSON.stringify(res?.Data?.rd));
              }
            })
            .catch((err) => console.log(err));

          if (redirectEmailUrl) {
            window.location.replace(redirectEmailUrl);
          } else {
            window.location.replace("/");
          }
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: response.Data.rd[0].stat_msg || "Invalid credentials" }));
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleForgotPassword = async () => {
    let Domain = window?.location?.origin || `https://nxt29.optigoapps.com`;
    setIsLoading(true);
    ForgotPasswordEmailAPI(Domain, email)
      .then((response) => {
        setIsLoading(false);
        if (response.Data.rd[0].stat === 1) {
          toast.success("Reset link sent to your email");
        } else {
          toast.error(response?.Data?.rd[0]?.stat_msg || "Error sending reset link");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <Box
      className="fg_smr_loginEmail_bl"
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fbfbfc",
        py: { xs: 2, sm: 4, md: 6 },
        px: { xs: 1.5, sm: 2, md: 3 },
        position: "relative",
      }}
    >
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: 1301,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.3)",
        }}
      >
        <CircularProgress size={45} thickness={4} sx={{ color: "#fff" }} />
      </Backdrop>

      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "stretch" },
            justifyContent: "center",
            gap: { xs: 3, md: 4, lg: 5 },
            width: "100%",
            maxWidth: "1040px",
            mx: "auto",
          }}
        >
          {/* Left Column - Fashion Editorial Visual Showcase */}
          <Box
            sx={{
              flex: { xs: "none", md: "0 0 460px", lg: "0 0 490px" },
              width: { xs: "100%", sm: "400px", md: "460px", lg: "490px" },
              height: { xs: "260px", sm: "360px", md: "auto" },
              minHeight: { md: "560px", lg: "600px" },
              borderRadius: "0px",
              overflow: "hidden",
              position: "relative",
              bgcolor: "#f1ede7",
              backgroundImage: "url('/Assets/auth_fashion_model.jpg')",
              backgroundSize: "cover",
              backgroundPosition: { xs: "center 20%", md: "center 15%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                p: { xs: 2, sm: 2.5, md: 3 },
                color: "#ffffff",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  opacity: 0.9,
                  fontSize: { xs: "10px", sm: "11px" },
                  display: "block",
                  mb: 0.25,
                }}
              >
                Exclusive Fine Jewelry
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.25,
                  textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                Elegance & Precision in Every Creation
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Login with Password Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", sm: "440px", md: "460px" },
              width: "100%",
              height: "auto",
              minHeight: { md: "560px", lg: "600px" },
              bgcolor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 2.5, sm: 3.5, md: 4 },
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: "18px" }} />}
              onClick={() => navigation(cancelRedireactUrl)}
              sx={{
                alignSelf: "flex-start",
                mb: { xs: 1, sm: 2 },
                color: "#6b7280",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.88rem",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#111827",
                },
              }}
            >
              Back to options
            </Button>

            <Stack
              spacing={{ xs: 2.5, sm: 3 }}
              sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}
            >
              {/* Title & Subtitle */}
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: { xs: "1.35rem", sm: "1.65rem", md: "1.85rem" },
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    mb: 0.75,
                  }}
                >
                  Login with Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    lineHeight: 1.45,
                  }}
                >
                  Using <strong style={{ color: "#111827" }}>{email}</strong>
                </Typography>
              </Box>

              {/* Form Input & Submission */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                sx={{ width: "100%" }}
              >
                <Stack spacing={2}>
                  <TextField
                    autoFocus
                    fullWidth
                    id="outlined-confirm-password-input"
                    label="Password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="current-password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={isLoading}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            onMouseDown={handleMouseDownConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        bgcolor: "#ffffff",
                        "& fieldset": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover fieldset": {
                          borderColor: "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111827",
                          borderWidth: "1.5px",
                        },
                      },
                    }}
                  />

                  {/* Forgot Password Link */}
                  <Box display="flex" justifyContent="flex-end">
                    <Typography
                      variant="caption"
                      onClick={handleForgotPassword}
                      sx={{
                        color: "#6b7280",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        "&:hover": {
                          color: "#111827",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    className="submitBtnForgot"
                    disabled={isLoading || !confirmPassword.trim()}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    onClick={() => navigation(cancelRedireactUrl)}
                    disabled={isLoading}
                    sx={{
                      py: 1,
                      textTransform: "none",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      color: "#6b7280",
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "#f3f4f6",
                        color: "#111827",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>

              {/* Legal Footer */}
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: { xs: "11px", sm: "11.5px" },
                  lineHeight: 1.5,
                  display: "block",
                  mt: 1,
                }}
              >
                By continuing, you agree to our{" "}
                <Box
                  component={Link}
                  href="/terms-and-conditions"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    textDecoration: "underline",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Terms of Use
                </Box>{" "}
                and{" "}
                <Box
                  component={Link}
                  href="/privacyPolicy"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    textDecoration: "underline",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Privacy Policy
                </Box>
                .
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
