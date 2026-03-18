"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { toast } from "react-toastify";
import { wesbiteDomainName } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { ContactUsAPI } from "@/app/(core)/utils/API/ContactUs/ContactUsAPI";
import { COLORS, getButtonStyle } from "@/app/(core)/constants/MobileAppTheme";

const ContactUs = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    FullName: "",
    InQuiryCompanyName: "",
    EmailId: "",
    mobileno: "",
    InQuirySubject: "",
    Be_In_Message: "",
    Themeno: "1",
    domainname: wesbiteDomainName,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.FullName) newErrors.FullName = "Full name is required";
    if (!formData.InQuiryCompanyName) newErrors.InQuiryCompanyName = "Company name is required";
    if (!formData.EmailId) {
      newErrors.EmailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) {
      newErrors.EmailId = "Invalid email format";
    }
    if (!formData.mobileno) {
      newErrors.mobileno = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.mobileno)) {
      newErrors.mobileno = "Enter a valid 10-digit number";
    }
    if (!formData.InQuirySubject) newErrors.InQuirySubject = "Subject is required";
    if (!formData.Be_In_Message) newErrors.Be_In_Message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await ContactUsAPI(formData);
      if (res?.stat_msg === "success") {
        toast.success("Message sent successfully!");
        setFormData({
          FullName: "",
          InQuiryCompanyName: "",
          EmailId: "",
          mobileno: "",
          InQuirySubject: "",
          Be_In_Message: "",
          Themeno: "1",
          domainname: wesbiteDomainName,
        });
        setTimeout(onClose, 2000);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          position: "relative"
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Floating Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            zIndex: 1000,
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "#f5f5f5" }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ flex: 1, overflowY: "auto", pb: 4 }}>
          {/* Filled Map Section */}
          <Box sx={{ width: "100%", height: 300, overflow: "hidden" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.2828242419437!2d72.8191344!3d21.1809209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e438cc948fb%3A0x5712a989b70ef3a2!2sOrail%20Services%20-%20OptigoApps!5e0!3m2!1sen!2sin!4v1734596370112!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>

          {/* Contact Details - Minimal Padding */}
          <Box sx={{ px: 2, mt: 3, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Get in Touch
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ bgcolor: "rgba(0,0,0,0.05)", p: 1, borderRadius: "50%", display: "flex" }}>
                  <LocationOnIcon fontSize="small" sx={{
                    color: COLORS.primary
                  }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  D-Block G20, ITC( International Trade Centre), Majura Gate, Ring Road
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12 }} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ bgcolor: "rgba(0,0,0,0.05)", p: 1, borderRadius: "50%", display: "flex" }}>
                  <PhoneIcon fontSize="small" sx={{
                    color: COLORS.primary
                  }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  +919099887762
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12 }} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ bgcolor: "rgba(0,0,0,0.05)", p: 1, borderRadius: "50%", display: "flex" }}>
                  <EmailIcon fontSize="small" sx={{
                    color: COLORS.primary
                  }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  hello@optigoapps.com
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Contact Form - No horizontal spacing issue */}
          <Box component="form" onSubmit={handleSubmit} sx={{ px: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
              Send us a Message
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="FullName"
                  value={formData.FullName}
                  onChange={handleChange}
                  error={!!errors.FullName}
                  helperText={errors.FullName}
                  size="small"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="InQuiryCompanyName"
                  value={formData.InQuiryCompanyName}
                  onChange={handleChange}
                  error={!!errors.InQuiryCompanyName}
                  helperText={errors.InQuiryCompanyName}
                  size="small"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="EmailId"
                  value={formData.EmailId}
                  onChange={handleChange}
                  error={!!errors.EmailId}
                  helperText={errors.EmailId}
                  size="small"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="mobileno"
                  maxLength={10}
                  value={formData.mobileno}
                  onChange={handleChange}
                  error={!!errors.mobileno}
                  helperText={errors.mobileno}
                  size="small"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="InQuirySubject"
                  value={formData.InQuirySubject}
                  onChange={handleChange}
                  error={!!errors.InQuirySubject}
                  helperText={errors.InQuirySubject}
                  size="small"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Message"
                  name="Be_In_Message"
                  multiline
                  rows={4}
                  value={formData.Be_In_Message}
                  onChange={handleChange}
                  error={!!errors.Be_In_Message}
                  helperText={errors.Be_In_Message}
                />
              </Grid>
              <Grid item size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  // sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                  sx={
                    getButtonStyle(true, {
                      py: 1.3, fontWeight: 700, borderRadius: 2
                    })
                  }
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "SUBMIT"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ContactUs;
