'use client'
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Container, Paper, Typography, TextField, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, FormGroup, Button, Box, Stack, Grid, Chip, Snackbar, Alert, Divider, FormHelperText } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

import { generateCustomerConfirmationEmail, generateOrderEmail } from "./OrderTemplate";
import { sendEmail } from '@/app/(core)/utils/API/SendEmail';

// --- CONSTANTS & CONFIGURATION ---
const CONTACT_NUMBERS = []; // Will be populated from storeInit or left empty if not provided

const COLORS = {
  bg: "#f0f2f5",
  cardBg: "#ffffff",
  whatsApp: "#1ebc57",
  gold: "#c5a059",
  black: "#000000",
  textGray: "#666666",
  error: "#d32f2f",
};

const OPTIONS = {
  colors: ["Yellow", "Rose", "White"],
  karats: ["10KT", "14KT", "18KT", "Platinum", "Silver", "9KT"],
  rhodium: ["No Rhodium", "Diamond Part White", "Full White", "Other"],
  stamping: ["No Stamping", "KT Stamping", "Diamond Weight + KT Stamp", "Other"],
};

const INITIAL_STATE = {
  name: "",
  email: "",
  mobile: "",
  designNumber: "",
  productSize: "",
  color: "",
  karats: "",
  deliveryDate: null,
  deliveryTime: null,
  rhodium: "",
  stamping: "",
  instructions: "",
  otherRhodium: "",
  otherStamping: "",
  company: "Om Jiyansh Jewels",
};

const INITIAL_DIAMONDS = {
  diamond: false,
  colorStone: false,
  byParty: false,
  other: false,
};

const OrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginuser, storeInit } = useMemo(() => {
    try {
      const loginuser = JSON.parse(sessionStorage.getItem("loginUserDetail")) || {};
      const storeInit = JSON.parse(sessionStorage.getItem("storeInit")) || {};
      return { loginuser, storeInit };
    } catch {
      return { loginuser: null, storeInit: null };
    }
  }, []);

  let companyLogo = storeInit?.logo || '';
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [diamondOptions, setDiamondOptions] = useState(INITIAL_DIAMONDS);
  const [file, setFile] = useState(null); // Stores file name
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setDiamondOptions(INITIAL_DIAMONDS);
    setErrors({});
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData((prev) => ({
      ...prev,
      name: `${loginuser?.firstname || ""} ${loginuser?.lastname || ""}`,
      email: loginuser?.FirstVerifyEmail || "",
      mobile: loginuser?.mobileno || "",
    }));
  };

  useEffect(() => {
    if (loginuser) {
      setFormData((prev) => ({
        ...prev,
        name: `${loginuser?.firstname || ""} ${loginuser?.lastname || ""}`,
        email: loginuser?.FirstVerifyEmail || "",
        mobile: loginuser?.mobileno || "",
      }));
    }
  }, [loginuser]);

  // Ref for file input to programmatically clear it
  const fileInputRef = useRef(null);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (name, newValue) => {
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setDiamondOptions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "File size must be under 5MB",
        severity: "error",
      });
      return;
    }

    setFile(selectedFile); // ✅ store File
    setErrors((prev) => ({ ...prev, file: null }));
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- VALIDATION & SUBMISSION ---

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.designNumber.trim()) newErrors.designNumber = "Design number is required";
    if (!formData.productSize.trim()) newErrors.productSize = "Product Size is required";
    if (!formData.color) newErrors.color = "Select product color";
    if (!formData.karats) newErrors.karats = "Select karats";
    if (!file) newErrors.file = "Product image is required";

    // Conditional Validation for 'Other'
    if (!formData.rhodium) newErrors.rhodium = "Required";
    if (formData.rhodium === "Other" && !formData.otherRhodium.trim()) newErrors.rhodium = "Specify details";

    if (!formData.stamping) newErrors.stamping = "Required";
    if (formData.stamping === "Other" && !formData.otherStamping.trim()) newErrors.stamping = "Specify details";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSnackbar({ open: true, message: "Please fill in all required fields", severity: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const OrderMail = generateOrderEmail(formData, diamondOptions);
      const CustomerConfirmationEmail = generateCustomerConfirmationEmail(formData, diamondOptions);
      // const data = 
      await sendEmail({
        subject: `New Customize Order Request received - ${formData?.name}`,
        cust_subject: `Customize Order Request Has Been placed - ${storeInit?.CompanyTitle || 'Om Jiyansh Jewels'}`,
        attachments: file ? [file] : [],
        replyto: formData.email,
        Mails: storeInit?.Website_Email,
        CustomerMail: formData?.email,
        htmlTemplate: OrderMail,
        cust_htmlTemplate: CustomerConfirmationEmail,
      });
      // if (data?.success == false || data?.message != "Emails sent successfully") {
      //   setSnackbar({
      //     open: true,
      //     message: "Something went wrong. Please try again.",
      //     severity: "error",
      //   });
      //   return;
      // }
      setSnackbar({
        open: true,
        message: "Order submitted successfully!",
        severity: "success",
      });

      resetForm();
    } catch (error) {
      console.error("Submit error:", error);

      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (snackbar.open && snackbar.severity === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [snackbar]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ backgroundColor: COLORS.bg, minHeight: "100vh", pt: { xs: 4, md: 8 }, pb: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{
            backgroundColor: COLORS.black,
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            color: '#fff'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, mb: 1 }}>
              Custom Order Form
            </Typography>
            <Typography variant="body1" sx={{ color: '#ccc', mt: 1, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
              Place your unique Jewelry request here. Our artisans will bring your vision to life.
              If this order was placed by mistake, please contact us immediately.
            </Typography>
            <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5} sx={{ mt: 3 }}>
              {storeInit?.CompanyContactNo && (
                <Chip
                  label={storeInit?.CompanyContactNo}
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(197, 160, 89, 0.5)',
                    color: COLORS.gold,
                    '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.1)' }
                  }}
                />
              )}
              {storeInit?.CompanyEmail && (
                <Chip
                  label={storeInit?.CompanyEmail}
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(197, 160, 89, 0.5)',
                    color: COLORS.gold,
                    '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.1)' }
                  }}
                />
              )}
            </Stack>
          </Box>

          <Paper elevation={3} sx={{
            overflow: "hidden",
            p: { xs: 3, sm: 5 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            {/* --- FORM BODY --- */}
            <Box>
              <Stack spacing={4}>
                {/* Section 1: Basic Info */}
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12 }} >
                    <TextField label="Your Name" name="name" value={formData.name} onChange={handleInputChange} error={!!errors.name} helperText={errors.name} required fullWidth InputLabelProps={{ shrink: true }} placeholder="Enter your full name" />
                  </Grid>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} required fullWidth InputLabelProps={{ shrink: true }} placeholder="Enter your Email" />
                  </Grid>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} error={!!errors.mobile} helperText={errors.mobile} required fullWidth InputLabelProps={{ shrink: true }} placeholder="Enter your Mobile" />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }}>
                  <Chip label="DESIGN DETAILS" size="small" variant="outlined" />
                </Divider>

                <Box>
                  <FormControl fullWidth required error={!!errors.file}>
                    <FormLabel sx={{ mb: 1.5, fontWeight: 600, color: COLORS.black }}>Reference Image of Product</FormLabel>
                    {file ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: '100%' }}>
                        <Chip
                          icon={<AttachFileIcon />}
                          label={file.name}
                          onDelete={clearFile}
                          deleteIcon={<CloseIcon />}
                          variant="outlined"
                          sx={{ borderRadius: 1.5, height: 56, px: 2, bgcolor: "#fcfcfc", width: '100%', justifyContent: 'space-between' }}
                        />
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AttachFileIcon />}
                        sx={{
                          height: 80,
                          borderStyle: "dashed",
                          borderWidth: 2,
                          color: COLORS.textGray,
                          borderColor: '#ddd',
                          borderRadius: 2,
                          '&:hover': { borderColor: COLORS.gold, bgcolor: 'rgba(197, 160, 89, 0.02)' }
                        }}
                      >
                        Click to Upload Reference Design
                        <input ref={fileInputRef} hidden accept="image/*" type="file" onChange={handleFileChange} />
                      </Button>
                    )}
                    {errors.file && <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1.5 }}>{errors.file}</Typography>}
                  </FormControl>
                </Box>

                <Grid container spacing={3}>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TextField label="Design Number" name="designNumber" value={formData.designNumber} onChange={handleInputChange} error={!!errors.designNumber} helperText={errors.designNumber} required fullWidth InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TextField label="Product Size" name="productSize" value={formData.productSize} onChange={handleInputChange} error={!!errors.productSize} helperText={errors.productSize} required fullWidth InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item size={{
                    xs: 12
                  }}>
                    <FormHelperText sx={{ mt: -2, mb: 2 }}>Note : Specify Ring Size, Bracelet Size or Chain length here</FormHelperText>
                  </Grid>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TextField select label="Color of Product" name="color" value={formData.color} onChange={handleInputChange} error={!!errors.color} helperText={errors.color} required fullWidth InputLabelProps={{ shrink: true }}>
                      {OPTIONS?.colors.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TextField select label="Karats of Product" name="karats" value={formData.karats} onChange={handleInputChange} error={!!errors.karats} helperText={errors.karats} required fullWidth InputLabelProps={{ shrink: true }}>
                      {OPTIONS.karats.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }}>
                  <Chip label="PREFERENCES" size="small" variant="outlined" />
                </Divider>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormControl required error={!!errors.rhodium} fullWidth>
                      <FormLabel sx={{ fontWeight: 600, mb: 1, color: COLORS.black }}>Rhodium Preference</FormLabel>
                      <RadioGroup name="rhodium" value={formData.rhodium} onChange={handleInputChange}>
                        <Grid container>
                          {OPTIONS.rhodium.map((opt) => (
                            <Grid item xs={6} key={opt}>
                              <FormControlLabel value={opt} control={<Radio color="primary" />} label={opt} />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                      {formData.rhodium === "Other" && <TextField size="small" placeholder="Please specify" name="otherRhodium" value={formData.otherRhodium} onChange={handleInputChange} error={!!errors.rhodium && !formData.otherRhodium} sx={{ mt: 1, maxWidth: 300 }} />}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl required error={!!errors.stamping} fullWidth>
                      <FormLabel sx={{ fontWeight: 600, mb: 1, color: COLORS.black }}>Stamping Preference</FormLabel>
                      <RadioGroup name="stamping" value={formData.stamping} onChange={handleInputChange}>
                        <Grid container>
                          {OPTIONS.stamping.map((opt) => (
                            <Grid item xs={6} key={opt}>
                              <FormControlLabel value={opt} control={<Radio color="primary" />} label={opt} />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                      {formData.stamping === "Other" && <TextField size="small" placeholder="Please specify" name="otherStamping" value={formData.otherStamping} onChange={handleInputChange} error={!!errors.stamping && !formData.otherStamping} sx={{ mt: 1, maxWidth: 300 }} />}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: COLORS.black }}>Diamonds or Colorstones Source</FormLabel>
                    <FormGroup row>
                      <FormControlLabel control={<Checkbox name="diamond" checked={diamondOptions.diamond} onChange={handleCheckboxChange} color="primary" />} label="Diamond" />
                      <FormControlLabel control={<Checkbox name="colorStone" checked={diamondOptions.colorStone} onChange={handleCheckboxChange} color="primary" />} label="Color Stone" />
                      <FormControlLabel control={<Checkbox name="byParty" checked={diamondOptions.byParty} onChange={handleCheckboxChange} color="primary" />} label="By Party (Customer Provided)" />
                      <FormControlLabel control={<Checkbox name="other" checked={diamondOptions.other} onChange={handleCheckboxChange} color="primary" />} label="Other" />
                    </FormGroup>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      * Select only if stones should be sourced by us.
                    </Typography>
                  </FormControl>
                </Box>

                <Grid container spacing={3}>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <DatePicker label="Preferred Delivery Date" value={formData.deliveryDate} onChange={(val) => handleDateChange("deliveryDate", val)} slotProps={{ textField: { fullWidth: true } }} />
                  </Grid>
                  <Grid item size={{
                    xs: 12, sm: 6
                  }}>
                    <TimePicker label="Preferred Delivery Time" value={formData.deliveryTime} onChange={(val) => handleDateChange("deliveryTime", val)} slotProps={{ textField: { fullWidth: true } }} />
                  </Grid>
                </Grid>

                <TextField label="Additional Production Instructions" multiline rows={4} fullWidth name="instructions" value={formData.instructions} onChange={handleInputChange} InputLabelProps={{ shrink: true }} placeholder="Mention any specific details or customizations here..." />

                <Box sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                      py: 2,
                      backgroundColor: COLORS.black,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: "1rem",
                      letterSpacing: 2,
                      borderRadius: 2,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                      '&:hover': { backgroundColor: '#333', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
                      '&:disabled': { backgroundColor: '#ccc' }
                    }}
                  >
                    {isSubmitting ? "PROCESSING..." : "SUBMIT CUSTOM ORDER"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Container >

        {/* --- FEEDBACK --- */}
        < Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar >
      </Box >
    </LocalizationProvider >
  );
};

export default OrderForm;
