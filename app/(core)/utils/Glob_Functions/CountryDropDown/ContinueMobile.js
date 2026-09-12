"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Alert,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { CountryCodeListApi } from "../../API/Auth/CountryCodeListApi";

// Custom Paper to ensure the dropdown menu is also square
const SquarePaper = (props) => (
  <Paper {...props} sx={{ borderRadius: 0, boxShadow: 6, border: "1px solid #ccc" }} />
);

const CountryDropDown = ({
  setMobileNo,
  mobileNo,
  handleInputChange,
  Errors,
  setErrors,
  Countrycodestate,
  setCountrycodestate,
  onSubmit,
}) => {
  const visiterID = Cookies.get("visiterId");
  const [CountryDefault, setCountryDefault] = useState(10);
  const [Countrycode, setCountrycode] = useState([]);
  const [isIndiaSelected, setIsIndiaSelected] = useState(true);

  // Style Object for Modern Square Look
  const squareFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      "& fieldset": { borderColor: "#e0e0e0" },
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#000", borderWidth: "1px" },
    },
    "& .MuiInputLabel-root": { color: "#757575" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#000" },
  };

  useEffect(() => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const LoginUser = JSON.parse(sessionStorage.getItem("LoginUser"));
    const finalID =
      storeInit?.IsB2BWebsite === 0
        ? LoginUser === false
          ? visiterID
          : loginUserDetail?.id || "0"
        : loginUserDetail?.id || "0";

    CountryCodeListApi(finalID)
      .then((res) => {
        const data = res?.Data?.rd || [];
        const phonecode = data.filter((val) => val?.IsDefault == 1 || val?.isdefault == 1);
        const defaultPrefix = phonecode[0]?.mobileprefix || "91";
        const defaultLength = phonecode[0]?.PhoneLength || phonecode[0]?.phonelength || 10;

        setCountrycodestate(defaultPrefix);
        setCountryDefault(defaultLength);
        setIsIndiaSelected(defaultPrefix === "91");
        setCountrycode(data);
        sessionStorage.setItem("CountryCodeListApi", JSON.stringify(data));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCountryChange = (event, value) => {
    setErrors({ ...Errors, mobileNo: "" });
    if (value) {
      const prefix = value.mobileprefix;
      const length = value.PhoneLength || value.phonelength || 10;
      setCountrycodestate(prefix);
      setCountryDefault(length);
      setIsIndiaSelected(prefix === "91");
      setMobileNo(""); // Clear mobile number when country changes
    }
  };

  const handleMobileInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    if (value.length > CountryDefault) return;

    // Clear mobile error when user starts typing
    if (Errors?.mobileNo) {
      setErrors((prev) => ({ ...prev, mobileNo: "" }));
    }

    // Re-construct event for the parent handler
    const fakeEvent = { ...e, target: { ...e.target, value: value, name: "mobileNo" } };
    handleInputChange(fakeEvent, setMobileNo, "mobileNo");
  };

  const handleKeyChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Stack spacing={2.5} sx={{ width: "100%", mt: 1 }}>
      {/* 1. Country Selector - Full Width */}
      <Autocomplete
        fullWidth
        options={Countrycode}
        getOptionLabel={(option) => `${option.countryname} (+${option.mobileprefix})`}
        value={Countrycode.find((c) => c.mobileprefix === Countrycodestate) || null}
        onChange={handleCountryChange}
        disableClearable
        PaperComponent={SquarePaper}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Country"
            variant="outlined"
            placeholder="Search country or code..."
            sx={squareFieldStyle}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key || `${option.mobileprefix}-${option.countryname}`} {...otherProps} sx={{ fontSize: "14px", borderRadius: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                +{option.mobileprefix}
              </Typography>
              <Typography variant="body2">{option.countryname}</Typography>
            </Box>
          );
        }}
      />

      {/* 2. Mobile Number Input - Full Width */}
      <TextField
        fullWidth
        label="Mobile Number"
        variant="outlined"
        placeholder={`Enter ${CountryDefault} digits`}
        value={mobileNo}
        onChange={handleMobileInputChange}
        onKeyDown={handleKeyChange}
        error={!!Errors?.mobileNo}
        helperText={Errors?.mobileNo}
        autoFocus
        inputProps={{
          maxLength: CountryDefault,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        sx={squareFieldStyle}
      />

      {/* International Restriction Alert */}
      {!isIndiaSelected && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            borderRadius: 0,
            border: "1px solid orange",
            fontSize: "13px",
            backgroundColor: "#fff9f0",
            color: "#855d00",
          }}
        >
          OTP verification is restricted to Indian numbers (+91).{" "}
          <Link
            href="/ContinueWithEmail"
            style={{ fontWeight: "bold", textDecoration: "underline", color: "inherit" }}
          >
            Use Email instead.
          </Link>
        </Alert>
      )}

      {/* WhatsApp Message */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#666",
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          ⊡ Verify via <span style={{ color: "#25D366", fontWeight: "bold" }}>WhatsApp</span> only! Check your messages for OTP.
        </Typography>
      </Box>
    </Stack>
  );
};

export default CountryDropDown;
