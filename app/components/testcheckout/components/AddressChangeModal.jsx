"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AddressChangeModal({
  open,
  onClose,
  addressList,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
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
    if (!formData.mobileNo.trim() || formData.mobileNo.length !== 10)
      errs.mobileNo = "Valid 10-digit mobile number is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state.trim()) errs.state = "State is required";
    if (!formData.zipCode.trim()) errs.zipCode = "ZIP Code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveNewAddress = async () => {
    if (!validateForm()) return;
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
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          borderBottom: "1px solid #eee",
          pb: 1.5,
        }}
      >
        {isAddingNew ? "Add New Delivery Address" : "Select Delivery Address"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {!isAddingNew ? (
          <Box>
            <Grid container spacing={2}>
              {addressList?.map((addr) => {
                const isSelected = selectedAddress?.id === addr?.id;
                return (
                  <Grid item xs={12} sm={6} key={addr.id}>
                    <Paper
                      elevation={0}
                      onClick={() => onSelectAddress(addr)}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        border: isSelected ? "2px solid var(--checkout-primary, #cca182)" : "1px solid #e0e0e0",
                        bgcolor: isSelected ? "var(--checkout-primary-light, #faf4ee)" : "#fff",
                        position: "relative",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          borderColor: "var(--checkout-primary, #cca182)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        },
                      }}
                    >
                      {isSelected && (
                        <CheckCircleIcon
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            color: "var(--checkout-primary, #cca182)",
                            fontSize: 22,
                          }}
                        />
                      )}
                      <Typography variant="subtitle1" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                        {addr?.shippingfirstname} {addr?.shippinglastname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                        {addr?.street}
                        <br />
                        {addr?.city}, {addr?.state} - {addr?.zip}
                        <br />
                        {addr?.country}
                        <br />
                        Mobile: {addr?.shippingmobile}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsAddingNew(true)}
                sx={{
                  borderColor: "var(--checkout-primary, #cca182)",
                  color: "var(--checkout-primary-text, #9c6d48)",
                  "&:hover": { borderColor: "var(--checkout-primary-hover, #b88d6e)", bgcolor: "var(--checkout-primary-light, #faf4ee)" },
                }}
              >
                Add New Address
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  size="small"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  size="small"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Number (10 Digits)"
                  fullWidth
                  size="small"
                  value={formData.mobileNo}
                  onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                  error={Boolean(errors.mobileNo)}
                  helperText={errors.mobileNo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  fullWidth
                  size="small"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street Address / Flat / Building"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  fullWidth
                  size="small"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  fullWidth
                  size="small"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  error={Boolean(errors.state)}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="ZIP / Postal Code"
                  fullWidth
                  size="small"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  error={Boolean(errors.zipCode)}
                  helperText={errors.zipCode}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, borderTop: "1px solid #eee" }}>
        {isAddingNew ? (
          <>
            <Button onClick={() => setIsAddingNew(false)} sx={{ color: "#777" }}>
              Back to List
            </Button>
            <Button
              onClick={handleSaveNewAddress}
              variant="contained"
              className="testCheckout_primary_btn"
              sx={{
                bgcolor: "var(--checkout-primary, #cca182)",
                color: "var(--checkout-btn-color, #ffffff)",
                "&:hover": { bgcolor: "var(--checkout-primary-hover, #b88d6e)" },
              }}
            >
              Save Address
            </Button>
          </>
        ) : (
          <Button onClick={onClose} sx={{ color: "#777" }}>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
