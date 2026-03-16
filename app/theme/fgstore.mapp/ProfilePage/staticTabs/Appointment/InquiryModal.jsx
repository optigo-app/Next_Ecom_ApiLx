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
  Toolbar,
  ButtonBase,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const jewelryItems = [
  { id: 1, title: 'Engagement Ring', image: '/WebSiteStaticImage/Appointment/appointment-jewel-1.png' },
  { id: 2, title: 'Wedding Ring', image: '/WebSiteStaticImage/Appointment/appointment-jewel-2.png' },
  { id: 3, title: 'Diamonds', image: '/WebSiteStaticImage/Appointment/appointment-jewel-3.png' },
  { id: 4, title: 'Fine Jewelry', image: '/WebSiteStaticImage/Appointment/appointment-jewel-4.png' },
  { id: 5, title: 'High End Jewelry', image: '/WebSiteStaticImage/Appointment/appointment-jewel-5.png' },
  { id: 6, title: 'Letter Diamonds', image: '/WebSiteStaticImage/Appointment/appointment-jewel-6.png' }
];

const InquiryModal = ({
  open,
  onClose,
  step,
  setStep,
  formData,
  handleChange,
  handleSelectInterest,
  handleSubmit,
  errors,
  loading,
  minDateTime
}) => {
  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: 480,
        },
      }}
    >
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {step === 2 && (
              <IconButton onClick={() => setStep(1)} sx={{ color: "white", mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography fontSize={18} fontWeight={600}>
              {step === 1 ? "What are you interested in?" : step === 2 ? "Share Details" : "Success"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please select the kind of jewelry you are interested in viewing.
            </Typography>
            <Grid container spacing={2}>
              {jewelryItems.map((item) => (
                <Grid item size={{
                  xs: 6, sm: 6
                }} key={item.id}>
                  <ButtonBase
                    onClick={() => handleSelectInterest(item.title)}
                    sx={{
                      width: '100%',
                      textAlign: 'center',
                      display: 'block',
                      overflow: 'hidden',
                      border: formData.JewelleryType === item.title ? '2px solid primary.main' : '1px solid #eee',
                      transition: '0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <Box sx={{}}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{
                          width: '100%', height: "100%", objectFit: 'cover',
                          border: 'none',
                          outline: 'none'
                        }}
                      />
                      <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600, pb: 1 }}>
                        {item.title}
                      </Typography>
                    </Box>
                  </ButtonBase>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {step === 2 && (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Interested in: <strong>{formData.JewelleryType}</strong>
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="First Name*"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  error={Boolean(errors.firstname)}
                  helperText={errors.firstname}
                />
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name*"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  error={Boolean(errors.lastname)}
                  helperText={errors.lastname}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email*"
                  name="EmailId"
                  value={formData.EmailId}
                  onChange={handleChange}
                  error={Boolean(errors.EmailId)}
                  helperText={errors.EmailId}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone*"
                  name="mobileno"
                  value={formData.mobileno}
                  onChange={handleChange}
                  error={Boolean(errors.mobileno)}
                  helperText={errors.mobileno}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Appointment Date & Time*"
                  name="AppointmentDateTime"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: minDateTime }}
                  value={formData.AppointmentDateTime}
                  onChange={handleChange}
                  error={Boolean(errors.AppointmentDateTime)}
                  helperText={errors.AppointmentDateTime}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Message (Optional)"
                  name="AppointmentMessage"
                  value={formData.AppointmentMessage}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item size={{ sx: 12 }} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? "BOOKING..." : "BOOK APPOINTMENT"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )
        }

        {
          step === 3 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} mb={1}>
                Appointment Booked!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Thank you for choosing Forevery. We will contact you shortly to confirm your appointment.
              </Typography>
              <Button variant="outlined" onClick={onClose} sx={{ px: 4 }}>
                Close
              </Button>
            </Box>
          )
        }
      </Box >
    </Drawer >
  );
};

export default InquiryModal;
