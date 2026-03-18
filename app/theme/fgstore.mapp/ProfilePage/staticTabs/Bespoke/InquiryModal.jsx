"use client";

import React from "react";
import {
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Drawer,
  AppBar,
  Toolbar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS, getButtonStyle } from "@/app/(core)/constants/MobileAppTheme";

const InquiryModal = ({
  open,
  onClose,
  handleSubmit,
  formData,
  handleChange,
  handleFileChange,
  error,
  loading
}) => {
  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          // maxWidth: 480,
        },
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: COLORS.primary }}
      >
        <Toolbar
          sx={{
            alignItems: "flex-start",
            py: 2
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              fontSize={16}
              fontWeight={600}
              lineHeight={1.4}
            >
              Please fill the details below and we will respond within 48 hours
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{ ml: 1, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <Box
        sx={{
          p: 2.5,
          pb: 4
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="FullName"
                value={formData?.FullName || ""}
                onChange={handleChange}
                error={Boolean(error?.FullName)}
                helperText={error?.FullName}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                name="EmailId"
                type="email"
                value={formData?.EmailId || ""}
                onChange={handleChange}
                error={Boolean(error?.EmailId)}
                helperText={error?.EmailId}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone"
                name="mobileno"
                inputProps={{ maxLength: 10 }}
                value={formData?.mobileno || ""}
                onChange={handleChange}
                error={Boolean(error?.mobileno)}
                helperText={error?.mobileno}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Website URL (Optional)"
                name="WebSite"
                placeholder="www.sonasons.one"
                value={formData?.WebSite || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Information"
                name="Be_In_Message"
                value={formData?.Be_In_Message || ""}
                onChange={handleChange}
                error={Boolean(error?.Be_In_Message)}
                helperText={error?.Be_In_Message}
              />
            </Grid>

            {/* File Upload */}
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="outlined"
                component="label"
                sx={getButtonStyle(true, {
                  py: 1.2,
                  backgroundColor: 'transparent',
                  color: 'black',
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    boxShadow: 'none',
                    color: 'black',
                  },
                })}
              >
                ATTACH FILE
                <input
                  hidden
                  type="file"
                  accept=".jpg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </Button>

              <Typography
                fontSize={11}
                color="text.secondary"
                mt={1}
              >
                Max File Size: 10MB • PNG, JPG, PDF
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                // sx={{ py: 1.6 }}
                sx={getButtonStyle(true, {
                  py: 1.2
                })}
              >
                {loading ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </Grid>

          </Grid>
        </Box>

        <Typography
          fontSize={11}
          color="text.secondary"
          mt={3}
          textAlign="center"
        >
          By submitting this form you agree to our Terms & Conditions and Privacy Policy.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default InquiryModal;
