"use client";
import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  Fade,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
  VerifiedUser as VerifiedIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
  LocationOn as LocationOnIcon,
  BookmarkBorder as BookmarkIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import FileUploadField from "./B2bRegister/FileUpload";
import SectionHeader from "./B2bRegister/SectionHeader";
import HeaderStepper from "./B2bRegister/HeaderStepper";
import RegistrationSuccess from "./B2bRegister/SuccessCard";
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
import Link from "next/link";
import { useB2BRegisterLogic } from "@/app/(core)/hooks/Auth/useB2BRegisterLogic";

const STEPS = [
  { label: "Business Information", icon: BusinessIcon, optional: false },
  { label: "Personal Information", icon: PersonIcon, optional: false },
  { label: "Business Documents", icon: DocumentIcon, optional: true },
  { label: "Declarations & Consent", icon: VerifiedIcon, optional: false },
];

const B2bRegister = ({ searchParams }) => {
  const {
    push,
    navigation,
    location,
    activeStep,
    setActiveStep,
    completedSteps,
    setCompletedSteps,
    isFirstTimeSuccess,
    setIsFirstTimeSuccess,
    checkLoading,
    setCheckLoading,
    statusMessage,
    setStatusMessage,
    mobileNoRef,
    theme,
    isMobile,
    masterData,
    setMasterData,
    MasterData,
    CompanyType,
    DocumentType,
    TypeofEntityOptions,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    IsMobileThrough,
    setIsMobileThrough,
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    setLoading,
    submitSuccess,
    setSubmitSuccess,
    search,
    cancelRedireactUrl,
    handleCheckStatus,
    handleRegisterNew,
    canNavigateToStep,
    isStepFieldsComplete,
    validateStep,
    areAllStepsComplete,
    isStepComplete,
    handleDocRemove,
    handleDocNumberChange,
    handleDocFileChange,
    handleInputChange,
    handleSelectChange,
    handleNext,
    handleBack,
    handleStepClick,
    handleSubmit,
    isGstValid,
    inputFieldSx,
  } = useB2BRegisterLogic({ searchParams, steps: STEPS });

if (submitSuccess) {
  return (
    <Fade in={submitSuccess} timeout={500}>
      <Box>
        <RegistrationSuccess
          onHome={() => navigation("/")}
          onLogin={() => navigation("/LoginOption")}
          isFirstTime={isFirstTimeSuccess}
          onCheckStatus={handleCheckStatus}
          checkLoading={checkLoading}
          statusMessage={statusMessage}
          onRegisterNew={handleRegisterNew}
        />
      </Box>
    </Fade>
  );
}

return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 8,
        pt: { xs: 4, sm: 6 },
        width: "100%",
        bgcolor: "#fbfbfc",
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Bar Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 2,
            px: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", fontSize: "0.9rem" }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              href={cancelRedireactUrl}
              sx={{
                color: "#b45309",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign In
            </Box>
          </Typography>
        </Box>

        {/* Top Horizontal Stepper */}
        <HeaderStepper
          activeStep={activeStep}
          handleStepClick={handleStepClick}
          isStepComplete={isStepComplete}
          isMobile={isMobile}
          STEPS={STEPS}
        />

        {/* Main Content Card */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
            p: { xs: 2.5, sm: 4, md: 5 },
            maxWidth: "960px",
            mx: "auto",
          }}
        >
          {/* Headline & Subtitle */}
          <Box sx={{ mb: 3.5, textAlign: "left" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 600,
                color: "#0b291d",
                fontSize: { xs: "1.35rem", sm: "1.65rem" },
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
                mb: 0.5,
              }}
            >
              Create Your B2B Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontSize: "0.88rem",
              }}
            >
              Register your business to access our exclusive B2B jewellery
              platform
            </Typography>
          </Box>

          {errors.step && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: "4px" }}>
              {errors.step}
            </Alert>
          )}

          {/* STEP 0: Business Information */}
          {activeStep === 0 && (
            <Fade in={activeStep === 0}>
              <Box>
                {/* 1. Business Details */}
                <SectionHeader
                  icon={BusinessIcon}
                  title="Business Details"
                  subtitle="Tell us about your business"
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.2fr 1fr 1fr" },
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Company / Firm Name"
                    placeholder="Enter company or firm name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    error={!!errors.company_name}
                    helperText={errors.company_name}
                    sx={inputFieldSx}
                  />

                  <FormControl
                    fullWidth
                    required
                    error={!!errors.entity_type}
                    sx={inputFieldSx}
                  >
                    <InputLabel>Type of Entity</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 240 } },
                      }}
                      name="entity_type"
                      value={formData.entity_type}
                      onChange={handleSelectChange}
                      label="Type of Entity"
                    >
                      {TypeofEntityOptions?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option?.TypeOfEntityName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    required
                    error={!!errors.industry_category}
                    sx={inputFieldSx}
                  >
                    <InputLabel>Industry Category</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 240 } },
                      }}
                      name="industry_category"
                      value={formData.industry_category}
                      onChange={handleSelectChange}
                      label="Industry Category"
                    >
                      {CompanyType?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option?.CompnayTypeName ||
                            option?.CompanyTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={{ my: 3.5, borderColor: "#f3f4f6" }} />

                {/* 2. Tax & Registration */}
                <SectionHeader
                  icon={SecurityIcon}
                  title="Tax & Registration"
                  subtitle="Provide your tax and registration details"
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <Tooltip
                    title="15 characters: 2 state digits + 10 PAN + 1 entity + 1 Z + 1 check digit"
                    arrow
                    placement="top-start"
                  >
                    <TextField
                      fullWidth
                      required
                      error={!!errors.gst_number}
                      helperText={
                        errors.gst_number ||
                        (isGstValid ? (
                          <span style={{ color: "#059669", fontWeight: 600 }}>
                            ✓ Valid GSTIN format
                          </span>
                        ) : (
                          ""
                        ))
                      }
                      label="GST Number"
                      placeholder="24ABCDE1234F1Z5"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleInputChange}
                      sx={inputFieldSx}
                    />
                  </Tooltip>

                  <Tooltip
                    title="PAN format: 5 letters + 4 digits + 1 letter"
                    arrow
                    placement="top-start"
                  >
                    <TextField
                      fullWidth
                      required
                      error={!!errors.pan_number}
                      helperText={errors.pan_number}
                      label="PAN Number"
                      placeholder="ABCDE1234F"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      sx={inputFieldSx}
                    />
                  </Tooltip>

                  <TextField
                    fullWidth
                    label="IEC Code (Optional)"
                    placeholder="Enter IEC code"
                    name="iec_code"
                    value={formData.iec_code}
                    onChange={handleInputChange}
                    sx={inputFieldSx}
                  />

                  <TextField
                    fullWidth
                    label="Import Export Code (Optional)"
                    placeholder="Enter code"
                    name="iec_code_alt"
                    value={formData.iec_code}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        iec_code: e.target.value,
                      }))
                    }
                    sx={inputFieldSx}
                  />
                </Box>

                <Divider sx={{ my: 3.5, borderColor: "#f3f4f6" }} />

                {/* 3. Registered Business Address */}
                <SectionHeader
                  icon={LocationOnIcon}
                  title="Registered Business Address"
                  subtitle="Enter your registered business address"
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <TextField
                    required
                    error={!!errors.address_line}
                    helperText={errors.address_line}
                    fullWidth
                    multiline
                    rows={2}
                    label="Address"
                    placeholder="Enter complete registered address"
                    name="address_line"
                    value={formData.address_line}
                    onChange={handleInputChange}
                    sx={inputFieldSx}
                  />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      required
                      error={!!errors.city}
                      helperText={errors.city}
                      fullWidth
                      label="City"
                      placeholder="Enter city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      sx={inputFieldSx}
                    />
                    <TextField
                      required
                      error={!!errors.state}
                      helperText={errors.state}
                      fullWidth
                      label="State"
                      placeholder="Enter state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      sx={inputFieldSx}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      required
                      error={!!errors.country}
                      helperText={errors.country}
                      fullWidth
                      label="Country"
                      placeholder="Enter country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      sx={inputFieldSx}
                    />
                    <TextField
                      required
                      error={!!errors.pincode}
                      helperText={errors.pincode}
                      fullWidth
                      label="Pincode"
                      placeholder="Enter 6 digit pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      sx={inputFieldSx}
                    />
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}

          {/* STEP 1: Personal Information */}
          {activeStep === 1 && (
            <Fade in={activeStep === 1}>
              <Box>
                <SectionHeader
                  icon={PersonIcon}
                  title="Personal Information"
                  subtitle="Enter authorized representative details"
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2.5,
                  }}
                >
                  <TextField
                    required
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    fullWidth
                    label="First Name"
                    placeholder="Enter first name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    sx={inputFieldSx}
                  />

                  <TextField
                    required
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    fullWidth
                    label="Last Name"
                    placeholder="Enter last name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    sx={inputFieldSx}
                  />

                  <CountryDropDown
                    emailRef={null}
                    Errors={errors}
                    setErrors={setErrors}
                    mobileNo={formData.mobileNo}
                    setMobileNo={(val) =>
                      setFormData((prev) => ({ ...prev, mobileNo: val }))
                    }
                    mobileNoRef={mobileNoRef}
                    IsMobileThrough={IsMobileThrough}
                    handleKeyDown={() => { }}
                    handleInputChange={handleInputChange}
                    Countrycodestate={formData.mobileCountry}
                    setCountrycodestate={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobileCountry: val,
                      }))
                    }
                    isElvee={true}
                    activeStep={activeStep}
                  />

                  <TextField
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    label="Email Address"
                    placeholder="Enter email address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    sx={inputFieldSx}
                  />

                  <TextField
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "#6b7280" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    label="Password"
                    placeholder="Create a strong password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type={showPassword ? "text" : "password"}
                    sx={inputFieldSx}
                  />

                  <TextField
                    error={!!errors.confirm_password}
                    helperText={errors.confirm_password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{ color: "#6b7280" }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    required
                    label="Confirm Password"
                    placeholder="Confirm password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    type={showConfirmPassword ? "text" : "password"}
                    sx={inputFieldSx}
                  />
                </Box>
              </Box>
            </Fade>
          )}

          {/* STEP 2: Documents Upload */}
          {activeStep === 2 && (
            <Fade in={activeStep === 2}>
              <Box>
                <SectionHeader
                  icon={DocumentIcon}
                  title="Business Documents Upload"
                  subtitle="Upload required verification documents for your business"
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  {DocumentType?.map((doc) => {
                    const isMandatory = doc.IsMandatory === 1;
                    return (
                      <Box key={doc.id}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "#374151",
                          }}
                        >
                          {doc?.DocumentTypeName} Number{" "}
                          {isMandatory ? "*" : "(Optional)"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <TextField
                            error={!!errors[`doc_${doc.id}_number`]}
                            helperText={errors[`doc_${doc.id}_number`]}
                            fullWidth
                            placeholder={`Enter ${doc?.DocumentTypeName} number`}
                            value={
                              formData.documents?.[doc.id]?.number || ""
                            }
                            onChange={(e) =>
                              handleDocNumberChange(
                                doc.id,
                                e.target.value,
                                doc?.DocumentTypeName,
                              )
                            }
                            sx={inputFieldSx}
                          />
                          <FileUploadField
                            error={!!errors[`doc_${doc.id}_file`]}
                            handleDocRemove={() => handleDocRemove(doc?.id)}
                            handleFileChange={(e) =>
                              handleDocFileChange(
                                doc.id,
                                e.target.files?.[0] || null,
                                doc?.DocumentTypeName,
                              )
                            }
                            label="Upload"
                            name={`doc_${doc.id}`}
                            file={formData.documents?.[doc.id]?.file || null}
                            compact
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Fade>
          )}

          {/* STEP 3: Declarations & Consent */}
          {activeStep === 3 && (
            <Fade in={activeStep === 3}>
              <Box>
                <SectionHeader
                  icon={VerifiedIcon}
                  title="Declarations & Consent"
                  subtitle="Review our terms and submit your application"
                />

                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    bgcolor: "#fafafa",
                    borderRadius: "6px",
                    border: "1px solid #f3f4f6",
                    mb: 3,
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="declaration"
                          checked={formData.declaration}
                          onChange={handleInputChange}
                          sx={{
                            color: "#9ca3af",
                            "&.Mui-checked": { color: "#0b291d" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: "0.92rem",
                            lineHeight: 1.5,
                            color: "#374151",
                          }}
                        >
                          I/We hereby declare that the information and documents
                          provided are true and correct. *
                        </Typography>
                      }
                    />
                    {errors.declaration && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", ml: 4 }}
                      >
                        {errors.declaration}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="consent"
                          checked={formData.consent}
                          onChange={handleInputChange}
                          sx={{
                            color: "#9ca3af",
                            "&.Mui-checked": { color: "#0b291d" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: "0.92rem",
                            lineHeight: 1.5,
                            color: "#374151",
                          }}
                        >
                          I/We consent to the use of my/our data in accordance
                          with the Privacy Policy & Terms & Conditions. *
                        </Typography>
                      }
                    />
                    {errors.consent && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", ml: 4 }}
                      >
                        {errors.consent}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: "rgba(251, 191, 36, 0.08)",
                    border: "1px solid rgba(251, 191, 36, 0.25)",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#92400e",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Important:</strong> By submitting this form, you
                    acknowledge that all information provided is accurate and
                    complete. False information may result in application
                    rejection.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          )}

          {/* Action Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              pt: 2.5,
              borderTop: "1px solid #f3f4f6",
              flexDirection: { xs: "column-reverse", sm: "row" },
              gap: 1.5,
            }}
          >
            <Button
              startIcon={<BookmarkIcon sx={{ fontSize: 18 }} />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                px: 2.5,
                py: { xs: 1.25, sm: 1.1 },
                fontSize: "0.88rem",
                fontWeight: 600,
                textTransform: "none",
                border: "1px solid #d1d5db",
                color: "#0b291d",
                borderRadius: "4px",
                "&:hover": {
                  bgcolor: "#f9fafb",
                  borderColor: "#9ca3af",
                },
              }}
            >
              Save & Continue Later
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
                flexDirection: { xs: "row", sm: "row" },
              }}
            >
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: { xs: 1, sm: "none" },
                    px: 2,
                    py: { xs: 1.25, sm: 1.1 },
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#6b7280",
                    border: { xs: "1px solid #e5e7eb", sm: "none" },
                    borderRadius: "4px",
                    "&:hover": {
                      color: "#111827",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Back
                </Button>
              )}

              {activeStep === STEPS.length - 1 ? (
                <Button
                  variant="contained"
                  disabled={!areAllStepsComplete() || loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : (
                      <CheckIcon />
                    )
                  }
                  sx={{
                    flex: { xs: activeStep > 0 ? 2 : 1, sm: "none" },
                    px: 3.5,
                    py: { xs: 1.25, sm: 1.25 },
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "4px",
                    bgcolor: "#0b291d",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#144230",
                    },
                    "&:disabled": {
                      bgcolor: "#e5e7eb",
                      color: "#9ca3af",
                    },
                  }}
                  type="submit"
                  onClick={handleSubmit}
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: { xs: activeStep > 0 ? 2 : 1, sm: "none" },
                    px: 3.5,
                    py: { xs: 1.25, sm: 1.25 },
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "4px",
                    bgcolor: "#0b291d",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#144230",
                    },
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Bottom Trust & Security Banner */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2.5,
            px: 2,
            py: 1.25,
            bgcolor: "#f0fdf4",
            border: "1px solid #dcfce7",
            borderRadius: "6px",
            maxWidth: "960px",
            mx: "auto",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckIcon sx={{ fontSize: 18, color: "#16a34a" }} />
            <Typography sx={{ fontSize: "0.82rem", color: "#166534", fontWeight: 500 }}>
              Your information is secured with 256-bit SSL encryption
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <LockIcon sx={{ fontSize: 16, color: "#16a34a" }} />
            <Typography sx={{ fontSize: "0.82rem", color: "#166534" }}>
              We respect your privacy.{" "}
              <Box
                component={Link}
                href="/privacyPolicy"
                sx={{
                  color: "#166534",
                  fontWeight: 600,
                  textDecoration: "underline",
                  "&:hover": { color: "#14532d" },
                }}
              >
                Privacy Policy
              </Box>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default B2bRegister;
