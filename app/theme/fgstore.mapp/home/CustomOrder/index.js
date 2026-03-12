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
const CONTACT_NUMBERS = ["+918866937682", "+91886665579"];

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
  company: "Elior Jewels",
};

const INITIAL_DIAMONDS = {
  diamond: false,
  colorStone: false,
  byParty: false,
  other: false,
};

const OrderForm = () => {
  let companyLogo = 'https://b2b.eliorjewel.com/WebSiteStaticImage/logoIcon/webLogo.png';
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
        cust_subject: `Customize Order Request Has Been placed - Elior Jewels`,
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
      <Box sx={{ backgroundColor: COLORS.bg, minHeight: "100vh", pt: { xs:1 } ,paddingBottom:20 ,px:1 }}>
       
        <Box sx={{ 
                      backgroundColor: COLORS.black, borderRadius: { xs: 3, sm: 4 }, p: { xs: 2, sm: 2 },py:1, 
                      mb: 1, textAlign: "center", boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
                    }}>
                      {companyLogo ? (
                        <Box component="img" src={companyLogo} alt="Elior Jewel" sx={{ maxHeight:120, objectFit: "contain", mb: 0 }} />
                      ) : (
                        <Typography variant="h4" sx={{ color: COLORS.gold, fontWeight: 'bold', mb: 2 }}>Elior Jewel</Typography>
                      )}
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                        Elior Jewel Order Form
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa', mt: 1, maxWidth: 500, mx: 'auto' }}>
                        After you fill out this order request, your order will be placed. If this order was placed by mistake, please let us know immediately.
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1} sx={{ mt: 2 }}>
                        {CONTACT_NUMBERS.map((num, i) => (
                          <Chip key={i} label={num} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: COLORS.gold, border: `1px solid ${COLORS.gold}` }} />
                        ))}
                      </Stack>  
                    </Box>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden",
             p: { xs: 2, sm: 2 }
           }}>
            {/* --- FORM BODY --- */}
            <Box sx={{ p: 0 }}>
              <Stack spacing={2.5}>
                {/* Section 1: Basic Info */}
                <Box>
                  <TextField label="Your Name" name="name" value={formData.name} onChange={handleInputChange} error={!!errors.name} helperText={errors.name} required fullWidth InputLabelProps={{ shrink: true }} placeholder="Enter your full name" />
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} required fullWidth InputLabelProps={{ shrink: true }} placeholder="Enter your Email" />
                  <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} error={!!errors.mobile} helperText={errors.mobile} required fullWidth InputLabelProps={{ shrink: true }} placeholder="Enter your Mobile" />
                </Box>

                <Box>
                  <FormControl fullWidth required error={!!errors.file}>
                    <FormLabel sx={{ mb: 1 }}>Please Upload Final Image of Product</FormLabel>
                    {file ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 ,width:'100%' }}>
                        <Chip icon={<AttachFileIcon />} label={file.name} onDelete={clearFile} deleteIcon={<CloseIcon />} variant="outlined" sx={{ borderRadius: 1, height: 45, px: 1, bgcolor: "#f9f9f9" ,width:'100%' }} />
                      </Box>
                    ) : (
                      <Button variant="outlined" component="label" startIcon={<AttachFileIcon />} sx={{ height: 50, borderStyle: "dashed", color: COLORS.textGray, borderColor: COLORS.textGray }}>
                        Select Image File
                        <input ref={fileInputRef} hidden accept="image/*" type="file" onChange={handleFileChange} />
                      </Button>
                    )}
                    {errors.file && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.file}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                <Box>
                  <TextField label="Design Number" name="designNumber" value={formData.designNumber} onChange={handleInputChange} error={!!errors.designNumber} helperText={errors.designNumber} required fullWidth InputLabelProps={{ shrink: true }} />
                </Box>
                <Box>
                  <TextField multiline minRows={1} maxRows={5} label="Product Size" name="productSize" value={formData.productSize} onChange={handleInputChange} error={!!errors.productSize} helperText={errors.productSize} required fullWidth InputLabelProps={{ shrink: true }} />
                  <FormHelperText sx={{ mt: 1 }}>Note : Any Ring Size, Bracelet Size Or Chain Details Please Mention Here</FormHelperText>
                </Box>
                <Box>
                  <TextField select label="Color of Product" name="color" value={formData.color} onChange={handleInputChange} error={!!errors.color} helperText={errors.color} required fullWidth InputLabelProps={{ shrink: true }}>
                    {OPTIONS?.colors.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box>
                  <TextField select label="Karats of Product" name="karats" value={formData.karats} onChange={handleInputChange} error={!!errors.karats} helperText={errors.karats} required fullWidth InputLabelProps={{ shrink: true }}>
                    {OPTIONS.karats.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Divider />

                {/* Section 2: Date & Time */}
                <FormControl component="fieldset">
                  <FormLabel sx={{ mb: 2 }}>Delivery Preference</FormLabel>
                  <Grid container spacing={2}>
                    <Grid item size={{
                      xs :12 ,sm :12
                    }}>
                      <DatePicker label="Delivery Date" value={formData.deliveryDate} onChange={(val) => handleDateChange("deliveryDate", val)} slotProps={{ textField: { fullWidth: true } }} />
                    </Grid>
                    <Grid item size={{
                      xs :12 ,sm :12
                    }}>
                      <TimePicker label="Delivery Time" value={formData.deliveryTime} onChange={(val) => handleDateChange("deliveryTime", val)} slotProps={{ textField: { fullWidth: true } }} />
                    </Grid>
                  </Grid>
                </FormControl>

                {/* Section 3: Radios */}
                <FormControl required error={!!errors.rhodium}>
                  <FormLabel>Rhodium</FormLabel>
                  <RadioGroup name="rhodium" value={formData.rhodium} onChange={handleInputChange}>
                    {OPTIONS.rhodium.map((opt) => (
                      <FormControlLabel key={opt} value={opt} control={<Radio color="success" />} label={opt} />
                    ))}
                  </RadioGroup>
                  {formData.rhodium === "Other" && <TextField size="small" placeholder="Please specify rhodium details" name="otherRhodium" value={formData.otherRhodium} onChange={handleInputChange} error={!!errors.rhodium && !formData.otherRhodium} sx={{ mt: 1, ml: 4, maxWidth: 300 }} />}
                </FormControl>

                <FormControl required error={!!errors.stamping}>
                  <FormLabel>Stamping</FormLabel>
                  <RadioGroup name="stamping" value={formData.stamping} onChange={handleInputChange}>
                    {OPTIONS.stamping.map((opt) => (
                      <FormControlLabel key={opt} value={opt} control={<Radio color="success" />} label={opt} />
                    ))}
                  </RadioGroup>
                  {formData.stamping === "Other" && <TextField size="small" placeholder="Please specify stamping details" name="otherStamping" value={formData.otherStamping} onChange={handleInputChange} error={!!errors.stamping && !formData.otherStamping} sx={{ mt: 1, ml: 4, maxWidth: 300 }} />}
                </FormControl>

                {/* Section 4: Checkboxes */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">Diamonds or Colorstone By Elior</FormLabel>
                  <FormGroup row>
                    <FormControlLabel control={<Checkbox name="diamond" checked={diamondOptions.diamond} onChange={handleCheckboxChange} color="success" />} label="Diamond" />
                    <FormControlLabel control={<Checkbox name="colorStone" checked={diamondOptions.colorStone} onChange={handleCheckboxChange} color="success" />} label="Color Stone" />
                    <FormControlLabel control={<Checkbox name="byParty" checked={diamondOptions.byParty} onChange={handleCheckboxChange} color="success" />} label="By Party" />
                  </FormGroup>
                  <FormControlLabel control={<Checkbox name="other" checked={diamondOptions.other} onChange={handleCheckboxChange} color="success" />} label="Other" />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                    * Tick box only if Diamonds/Stones need to be sourced by Elior Jewel.
                  </Typography>
                </FormControl>

                <TextField label="Customer Production Instruction" multiline rows={4} fullWidth name="instructions" value={formData.instructions} onChange={handleInputChange} InputLabelProps={{ shrink: true }} placeholder="Any specific requests..." />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    backgroundColor: COLORS.whatsApp,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    opacity: isSubmitting ? 0.7 : 1,
                    "&:hover": { backgroundColor: "#1ebc57" },
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </Button>
              </Stack>
            </Box>
          </Paper>

        {/* --- FEEDBACK --- */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default OrderForm;
