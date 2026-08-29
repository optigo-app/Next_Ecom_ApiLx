"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

export default function AddressDrawer({
  open,
  onClose,
  addressList = [],
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  isLoading = false,
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.mobileNo.trim() || formData.mobileNo.length < 10)
      errs.mobileNo = "Valid 10-digit mobile number is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state.trim()) errs.state = "State is required";
    if (!formData.zipCode.trim()) errs.zipCode = "ZIP Code is required";
    if (!formData.country.trim()) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveNewAddress = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const success = await onAddNewAddress(formData);
      if (success) {
        setIsAddingNew(false);
        setFormData({
          firstName: "",
          lastName: "",
          mobileNo: "",
          address: "",
          country: "India",
          state: "",
          city: "",
          zipCode: "",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrawerClose = () => {
    setIsAddingNew(false);
    setErrors({});
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 460, md: 480 },
          maxWidth: "100%",
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Header - Minimal Zara Style */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isAddingNew && (
            <IconButton
              size="small"
              onClick={() => setIsAddingNew(false)}
              sx={{ color: "#333", p: 0.5 }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "1rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#111",
              fontFamily: "inherit",
            }}
          >
            {isAddingNew ? "Add New Address" : "Delivery Address"}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={handleDrawerClose}
          sx={{
            color: "#666",
            "&:hover": { color: "#111", bgcolor: "#f5f5f5" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Drawer Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 2.5, sm: 3.5 },
        }}
      >
        {isAddingNew ? (
          /* Add New Address Form with Clean FormLabel & OutlinedInput */
          <Box component="form" noValidate>
            <Typography
              variant="body2"
              sx={{ color: "#777", fontSize: "0.83rem", mb: 3, letterSpacing: "0.2px" }}
            >
              Please enter your shipping address details below.
            </Typography>

            <Grid container spacing={2}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={Boolean(errors.firstName)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    FIRST NAME <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.firstName && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.firstName}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={Boolean(errors.lastName)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    LAST NAME <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.lastName && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.lastName}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Mobile Number */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth error={Boolean(errors.mobileNo)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    MOBILE NUMBER <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="10-digit mobile number"
                    value={formData.mobileNo}
                    onChange={(e) => handleInputChange("mobileNo", e.target.value.replace(/\D/g, ""))}
                    inputProps={{ maxLength: 10 }}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.mobileNo && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.mobileNo}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Street Address */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth error={Boolean(errors.address)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    STREET ADDRESS / HOUSE NO <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    multiline
                    rows={2}
                    placeholder="Enter street, flat/house number, building, locality"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.address && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.address}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={Boolean(errors.city)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    CITY <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.city && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.city}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={Boolean(errors.state)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    STATE <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.state && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.state}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* PIN / Zip Code */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={Boolean(errors.zipCode)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    PIN / ZIP CODE <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="PIN / Zip Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.zipCode && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.zipCode}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Country */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={Boolean(errors.country)}>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#333", mb: 0.6, letterSpacing: "0.3px", "&.Mui-focused": { color: "var(--checkout-primary, #cca182)" } }}>
                    COUNTRY <span style={{ color: "#d32f2f" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    sx={{
                      borderRadius: "4px",
                      fontSize: "0.88rem",
                      bgcolor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdcdc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--checkout-primary, #cca182)" },
                    }}
                  />
                  {errors.country && (
                    <FormHelperText sx={{ mx: 0, mt: 0.4 }}>{errors.country}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                onClick={handleSaveNewAddress}
                className="btnColorProCatProduct testCheckout_primary_btn"
                sx={{
                  py: 1.5,
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  bgcolor: "var(--checkout-primary, #cca182)",
                  color: "var(--checkout-btn-color, #ffffff)",
                  "&:hover": { bgcolor: "var(--checkout-primary-hover, #b88d6e)" },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={22} sx={{ color: "var(--checkout-btn-color, #fff)" }} />
                ) : (
                  "Save Address"
                )}
              </Button>

              <Button
                variant="text"
                fullWidth
                disabled={isSubmitting}
                onClick={() => setIsAddingNew(false)}
                sx={{
                  color: "#666",
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  "&:hover": { color: "#111", bgcolor: "transparent" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          /* Address List View */
          <Box>
            {/* Add New Address Button */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => setIsAddingNew(true)}
              sx={{
                mb: 3,
                py: 1.4,
                borderColor: "#222",
                color: "#111",
                borderRadius: "4px",
                fontSize: "0.82rem",
                fontWeight: 500,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                "&:hover": {
                  borderColor: "#000",
                  bgcolor: "#f9f9f9",
                },
              }}
            >
              Add New Address
            </Button>

            {addressList.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#888", fontSize: "0.9rem" }}>
                  No saved addresses found.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {addressList.map((addr) => {
                  const isSelected = String(selectedAddress?.id) === String(addr?.id);
                  return (
                    <Box
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        onClose();
                      }}
                      sx={{
                        p: 2.5,
                        borderRadius: "6px",
                        cursor: "pointer",
                        border: isSelected ? "1.5px solid var(--checkout-primary, #cca182)" : "1px solid #e8e8e8",
                        bgcolor: isSelected ? "var(--checkout-primary-light, #faf4ee)" : "#fff",
                        position: "relative",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: isSelected ? "var(--checkout-primary, #cca182)" : "#bbb",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "#111",
                            fontSize: "0.92rem",
                            textTransform: "capitalize",
                            mb: 0.5,
                          }}
                        >
                          {addr?.shippingfirstname} {addr?.shippinglastname}
                        </Typography>
                        {isSelected && (
                          <CheckCircleIcon sx={{ color: "var(--checkout-primary, #cca182)", fontSize: 18 }} />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontSize: "0.82rem", lineHeight: 1.6 }}
                      >
                        {addr?.street}
                        <br />
                        {addr?.city}, {addr?.state} - {addr?.zip}
                        <br />
                        {addr?.country}
                        <br />
                        Mobile: {addr?.shippingmobile}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Footer / Done Button */}
      {!isAddingNew && addressList.length > 0 && (
        <Box sx={{ p: 2.5, px: 3.5, borderTop: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleDrawerClose}
            className="btnColorProCatProduct testCheckout_primary_btn"
            sx={{
              py: 1.4,
              fontSize: "0.88rem",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "4px",
              bgcolor: "var(--checkout-primary, #cca182)",
              color: "var(--checkout-btn-color, #ffffff)",
              "&:hover": { bgcolor: "var(--checkout-primary-hover, #b88d6e)" },
            }}
          >
            Done
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
