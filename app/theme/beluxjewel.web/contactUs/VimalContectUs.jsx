"use client";

import React, { useEffect, useState } from "react";
import { getBrandConfig } from "@/app/(core)/constants/BrandConfig";
import { toast } from "react-toastify";
import { ContactUsAPI } from "@/app/(core)/utils/API/ContactUs/ContactUsAPI";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const contactMode = 1;
const IsSetupFor = true;

export default function ContactPage() {
  const brand = getBrandConfig();
  const [loading, setLoading] = useState(false);
  const [names, setName] = useState({
    firstName: "",
    lastName: "",
  });

  const [formData, setFormData] = useState({
    FullName: "",
    EmailId: "",
    mobileno: "",
    Be_In_Message: "",
    Themeno: "3",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleDiffChange = (e) => {
    const { name, value } = e.target;
    setName({
      ...names,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!names?.firstName) {
      errors.firstName = "Please enter your first name";
    }
    if (!names?.lastName) {
      errors.lastName = "Please enter your last name";
    }
    if (!formData.EmailId) {
      errors.EmailId = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(formData.EmailId)) {
      errors.EmailId = "Please enter a valid email address";
    }
    if (!formData.mobileno) {
      errors.mobileno = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.mobileno)) {
      errors.mobileno = "Phone must be a 10-digit number";
    }
    if (!formData.Be_In_Message) {
      errors.Be_In_Message = "Please enter your message";
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const formattedData = {
        ...formData,
        FullName: `${names?.firstName} ${names?.lastName}`,
      };
      await ContactUsAPI(formattedData).then((res) => {
        if (res?.stat_msg === "success") {
          toast.success(
            "Success! Thank you for contacting us. We’ve received your message and will get back to you shortly.",
          );
          setLoading(false);
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        } else {
          toast.error("Something went wrong");
          setLoading(false);
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        }
      });
      setFormData({
        FullName: "",
        EmailId: "",
        mobileno: "",
        Be_In_Message: "",
        Themeno: "3",
      });
      setName({
        firstName: "",
        lastName: "",
      });
    } else {
      setErrors(errors);
    }
  };

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", pb: 8 }}>
      {/* Banner Image */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "25vh", md: "40vh" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/WebSiteStaticImage/Banner/vimalgolddiamond/ContactUs.png"
          alt="Contact Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: "#111",
            letterSpacing: "0.05em",
            mb: 6,
          }}
        >
          CONTACT US
        </Typography>

        <Grid container spacing={5}>
          {/* Left Column: Contact Cards */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Phone */}
              <Card
                variant="outlined"
                sx={{ borderRadius: "8px", borderColor: "#eaeaea" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    p: 3,
                  }}
                >
                  <PhoneInTalkOutlinedIcon
                    sx={{ color: "#00185a", fontSize: "1.75rem", mt: 0.5 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ mb: 0.5, color: "#111" }}
                    >
                      Phone
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {contactMode === 0 ? "+91 99999 88888" : brand.phone}
                    </Typography>
                    {!IsSetupFor && (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        Mon-Sat: 9:00am to 6:30pm (IST)
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Email */}
              <Card
                variant="outlined"
                sx={{ borderRadius: "8px", borderColor: "#eaeaea" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    p: 3,
                  }}
                >
                  <MailOutlineIcon
                    sx={{ color: "#00185a", fontSize: "1.75rem", mt: 0.5 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ mb: 0.5, color: "#111" }}
                    >
                      Email Address
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {contactMode === 0 ? "galaxy@sonasons.com" : brand.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Office Address */}
              <Card
                variant="outlined"
                sx={{ borderRadius: "8px", borderColor: "#eaeaea" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    p: 3,
                  }}
                >
                  <LocationOnOutlinedIcon
                    sx={{ color: "#00185a", fontSize: "1.75rem", mt: 0.5 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ mb: 0.5, color: "#111" }}
                    >
                      Office Address
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ mb: 1, color: "#222" }}
                    >
                      {contactMode === 0
                        ? "Sonasons Galactic Headquarters"
                        : brand.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {contactMode === 0
                        ? "Plot 42, Nebula Boulevard, Sector 9, Stardust City, Kepler-186f, Mars, 99999"
                        : brand.address}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column: Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              variant="outlined"
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "8px",
                borderColor: "#eaeaea",
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                Our Customer service team is waiting to assist you. Please fill
                out all fields.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={names.firstName}
                      onChange={handleDiffChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={names.lastName}
                      onChange={handleDiffChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Phone"
                      name="mobileno"
                      value={formData.mobileno}
                      onChange={handleChange}
                      error={!!errors.mobileno}
                      helperText={errors.mobileno}
                      fullWidth
                      variant="outlined"
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email ID"
                      name="EmailId"
                      type="email"
                      value={formData.EmailId}
                      onChange={handleChange}
                      error={!!errors.EmailId}
                      helperText={errors.EmailId}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Message"
                      name="Be_In_Message"
                      value={formData.Be_In_Message}
                      onChange={handleChange}
                      error={!!errors.Be_In_Message}
                      helperText={errors.Be_In_Message}
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                      sx={{
                        bgcolor: "#00185a",
                        color: "#FFF",
                        py: 1.5,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        borderRadius: "4px",
                        boxShadow: "none",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#001140",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#FFF" }} />
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>

        {/* Map Section */}
        {IsSetupFor && (
          <Box
            sx={{
              mt: 6,
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #eaeaea",
            }}
          >
            <iframe
              src={
                contactMode === 0
                  ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.2828242419437!2d72.8191344!3d21.1809209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1sen!2sin!4v1734596370112"
                  : brand.mapEmbed
              }
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
