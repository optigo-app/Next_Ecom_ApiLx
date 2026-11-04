import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Link from "next/link";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const DEFAULT_QUICK_LINKS = [
  { label: "About Us", href: "/aboutUs" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacyPolicy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

/**
 * High-Performance Pure Material UI SSR Footer for Procatalog Theme
 * Replicates the clean 3-column layout from demo.procatalog.in with zero SCSS dependency.
 */
export default function ProCatFooter({
  companyInfoData = {},
  socialMediaData = [],
  list = [],
}) {
  const currentYear = new Date().getFullYear();
  const companyName =
    companyInfoData?.companyname_menu ||
    companyInfoData?.companyname ||
    "DemoA";

  const quickLinks = list && list.length > 0 ? list : DEFAULT_QUICK_LINKS;

  // Format contact phone numbers safely
  const parseNumbers = (val) => {
    if (!val) return [];
    return String(val)
      .split(/[,/]/)
      .map((n) => n.trim().replace(/^\+\s*\+/, "+"))
      .filter(Boolean);
  };

  const contactNumbers = [
    ...parseNumbers(companyInfoData?.FrontEndContactno1),
    ...parseNumbers(companyInfoData?.FrontEndContactno2),
  ];

  const address = companyInfoData?.FrontEndAddress || "";
  const city = companyInfoData?.FrontEndCity || "";
  const zip = companyInfoData?.FrontEndZipCode || "";
  const email = companyInfoData?.FrontEndEmail1 || "";

  const headingStyle = {
    fontFamily: '"Poppins", sans-serif',
    fontSize: { xs: "1rem", sm: "1.08rem" },
    fontWeight: 600,
    color: "#222222",
    mb: 2.5,
    letterSpacing: "0.2px",
  };

  const textStyle = {
    fontSize: "0.875rem",
    color: "#7D7F85",
    lineHeight: 1.6,
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #EAEAEA",
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        color: "#7D7F85",
        fontFamily: '"Poppins", "Segoe UI", sans-serif',
      }}
    >
      <Grid container spacing={{ xs: 4, sm: 4, md: 6, lg: 8 }}>
        {/* COLUMN 1: CONTACT US */}
        <Grid item size={{ xs: 12, md: 4.2 }}>
          <Typography component="h4" sx={headingStyle}>
            Contact Us
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Address */}
            {(address || city) && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOnOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: "#0F3D4C",
                    mt: 0.25,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={textStyle}>
                  {address}
                  {address && (city || zip) && ", "}
                  <br />
                  {city} {zip && `- ${zip}`}
                </Typography>
              </Box>
            )}

            {/* Phone */}
            {contactNumbers.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneOutlinedIcon
                  sx={{
                    fontSize: 19,
                    color: "#0F3D4C",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {contactNumbers.map((num, idx) => (
                    <Box
                      component="a"
                      key={idx}
                      href={`tel:${num}`}
                      sx={{
                        ...textStyle,
                        textDecoration: "none",
                        "&:hover": { color: "#0F3D4C" },
                      }}
                    >
                      {num}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Email */}
            {email && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailOutlinedIcon
                  sx={{
                    fontSize: 19,
                    color: "#0F3D4C",
                    flexShrink: 0,
                  }}
                />
                <Box
                  component="a"
                  href={`mailto:${email}`}
                  sx={{
                    ...textStyle,
                    textDecoration: "none",
                    "&:hover": { color: "#0F3D4C" },
                  }}
                >
                  {email}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        {/* COLUMN 2: QUICK LINKS */}
        <Grid item size={{ xs: 12, md: 4.8 }}>
          <Typography component="h4" sx={headingStyle}>
            Quick Links
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1.5,
            }}
          >
            {quickLinks.map((item, idx) => (
              <Box
                component={Link}
                key={idx}
                href={item?.href || "#"}
                sx={{
                  ...textStyle,
                  textDecoration: "none",
                  display: "inline-block",
                  py: 0.25,
                  transition: "color 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    color: "#0F3D4C",
                    transform: "translateX(2px)",
                  },
                }}
              >
                {item?.label}
              </Box>
            ))}
          </Box>
        </Grid>

        {/* COLUMN 3: FOLLOW US */}
        <Grid item size={{ xs: 12, md: 3 }}>
          <Typography component="h4" sx={headingStyle}>
            Follow Us
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
            {socialMediaData && socialMediaData.length > 0 ? (
              socialMediaData.map((social, idx) => (
                <Box
                  key={idx}
                  component="a"
                  href={social?.SLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: "1px solid #DEDEDE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#555555",
                    backgroundColor: "#ffffff",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: "#0F3D4C",
                      color: "#0F3D4C",
                      transform: "translateY(-2px)",
                      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  {social?.SImgPath ? (
                    <Box
                      component="img"
                      src={social.SImgPath}
                      alt={social.SName || "social"}
                      sx={{ width: 18, height: 18, objectFit: "contain" }}
                    />
                  ) : (
                    getSocialIcon(social?.SName)
                  )}
                </Box>
              ))
            ) : (
              /* Standard fallback social buttons */
              <>
                <SocialLink href="https://instagram.com" label="Instagram">
                  <InstagramIcon sx={{ fontSize: 19 }} />
                </SocialLink>
                <SocialLink href="https://facebook.com" label="Facebook">
                  <FacebookIcon sx={{ fontSize: 19 }} />
                </SocialLink>
                <SocialLink href="https://pinterest.com" label="Pinterest">
                  <PinterestIcon sx={{ fontSize: 19 }} />
                </SocialLink>
                <SocialLink href="https://linkedin.com" label="LinkedIn">
                  <LinkedInIcon sx={{ fontSize: 19 }} />
                </SocialLink>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* FOOTER BOTTOM: COPYRIGHT */}
      <Box
        sx={{
          borderTop: "1px solid #F0F0F0",
          mt: { xs: 4, sm: 5, md: 6 },
          pt: 3,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.82rem",
            color: "#888888",
            letterSpacing: "0.2px",
          }}
        >
          © {currentYear} {companyName}. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      sx={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: "1px solid #E2E2E2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666666",
        backgroundColor: "#ffffff",
        textDecoration: "none",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "#0F3D4C",
          color: "#0F3D4C",
          transform: "translateY(-2px)",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {children}
    </Box>
  );
}

function getSocialIcon(name = "") {
  const lower = String(name).toLowerCase();
  if (lower.includes("instagram")) return <InstagramIcon sx={{ fontSize: 19 }} />;
  if (lower.includes("facebook")) return <FacebookIcon sx={{ fontSize: 19 }} />;
  if (lower.includes("pinterest")) return <PinterestIcon sx={{ fontSize: 19 }} />;
  if (lower.includes("linkedin")) return <LinkedInIcon sx={{ fontSize: 19 }} />;
  return <InstagramIcon sx={{ fontSize: 19 }} />;
}
