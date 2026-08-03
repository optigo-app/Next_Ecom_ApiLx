"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

// ─── Static-shell link groups (hrefs wired the same way as PremiumFooter) ────

const footerSections = [
  {
    title: "Help",
    links: [
      { label: "About Us", href: "/aboutUs" },
      { label: "In Store Services", href: "/customer-service" },
      { label: "Terms of Service", href: "/terms-and-conditions" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { label: "Contact Us", href: "/contactUs" },
      { label: 'Customer Services', href: '/customer-service' },
      { label: 'Book an Appoinment', href: '/appointment' },
      { label: 'Customize', href: '/customization' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

export default function LuxuryFooter({ img, logos, storeData, companyInfoData: companyInfoDataProp }) {
  const [email, setEmail] = useState("");
  const [companyInfoData, setCompanyInfoData] = useState(companyInfoDataProp);
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const whiteLogo = logos?.web || logos?.white_logo;
  const blackLogo = logos?.black_logo || logos?.blackLogo || logos?.web;

  const Router = useNextRouterLikeRR().push;
  const navigation = (url) => Router(url);
  const { storeInit: storeInitContext } = useStore();
  const storeInit =
    storeData ||
    storeInitContext ||
    (typeof window !== "undefined" ? JSON?.parse(sessionStorage?.getItem("storeInit")) : null);

  const year = React.useMemo(() => new Date().getFullYear(), []);

  const MoveToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // ── Pull company info / social links (same polling pattern as PremiumFooter) ──
  useEffect(() => {
    let interval;
    const fetchData = () => {
      try {
        const storeInitData = sessionStorage?.getItem("storeInit");
        if (storeInitData) {
          const companyInfoDataStr = sessionStorage?.getItem("CompanyInfoData");
          if (companyInfoDataStr) {
            const parsedCompanyInfo = JSON?.parse(companyInfoDataStr);
            setCompanyInfoData(parsedCompanyInfo);

            const socialLinkStr = parsedCompanyInfo?.SocialLinkObj;
            if (socialLinkStr) {
              try {
                const parsedSocialMediaData = JSON?.parse(socialLinkStr);
                setSocialMediaData(parsedSocialMediaData);
              } catch (error) {
                console.error("Error parsing social media data:", error);
              }
            }
          }
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error parsing data from sessionStorage:", error);
        clearInterval(interval);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // ── Newsletter submit (identical logic to PremiumFooter) ──────────────────
  const handleSubmitNewlater = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    if (email?.trim() === "") {
      setLoading(false);
      setResult("Email is required.");
      return;
    } else if (!isValidEmail(email)) {
      setLoading(false);
      setResult("Please enter a valid email address.");
      return;
    } else {
      setResult("");
    }

    const newslater = storeInit?.newslatter;
    if (newslater && email) {
      const requestOptions = { method: "GET", redirect: "follow" };
      const newsletterUrl = `${newslater}${email}`;
      fetch(newsletterUrl, requestOptions)
        .then((response) => response.text())
        .then((res) => {
          setResult(res);
          setLoading(false);
          setTimeout(() => {
            setResult("");
            setEmail("");
          }, 3000);
        })
        .catch((error) => {
          setResult(String(error));
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  // ── Link click handler (supports ctrl/shift/meta/middle-click for new tab) ─
  const handleNavigte = (navigateUrl, event) => {
    if (
      event?.ctrlKey ||
      event?.shiftKey ||
      event?.metaKey ||
      (event?.button && event?.button === 1)
    ) {
      return;
    } else {
      event.preventDefault();
      navigation(navigateUrl);
    }
  };

  const brandName = storeInit?.companyname || companyInfoData?.CompanyName;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f5f0eb",
        borderTop: "1px solid #e5ddd5",
      }}
    >
      <Grid container>
        {/* LEFT SECTION */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            p: { xs: 4, md: 6 },
            borderRight: {
              md: "1px solid #ddd",
            },
          }}
        >
          <Grid container spacing={4}>
            {footerSections.map((section) => (
              <Grid size={{ xs: 6 }} key={section.title}>
                <Typography
                  sx={{
                    fontSize: 14,
                    mb: 3,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontWeight: 600,
                  }}
                >
                  {section.title}
                </Typography>

                {section.links.map((link) => (
                  <Box
                    key={link.label}
                    component={Link}
                    href={link.href}
                    onClick={(e) => handleNavigte(link.href, e)}
                    sx={{
                      mb: 1.5,
                      color: "#666",
                      cursor: "pointer",
                      display: "block",
                      textDecoration: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        color: "#000",
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                ))}
              </Grid>
            ))}
          </Grid>

          {/* QR BLOCK */}
          {/* <Box
            sx={{
              mt: 5,
              p: 2,
              bgcolor: "#0d1232",
              width: 240,
              display: "flex",
              gap: 2,
              alignItems: "center",
              color: "#fff",
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {storeInit?.QRCodeImage && (
                <Box
                  component="img"
                  src={storeInit?.QRCodeImage}
                  alt="QR Code"
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )}
            </Box>

            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                DOWNLOAD OUR APP
              </Typography>
              <Typography sx={{ fontSize: 11 }}>
                Scan to shop on mobile
              </Typography>
            </Box>
          </Box> */}

          {/* EMAIL */}
          <Typography
            sx={{
              mt: 6,
              color: "#666",
              fontSize: 14,
            }}
          >
            {companyInfoData?.Email || storeInit?.email}
            {/* {email} */}
          </Typography>

          {/* LOGO */}
          <Box
            component={Link}
            href="/"
            onClick={(e) => {
              handleNavigte("/", e);
              MoveToTop();
            }}
            sx={{
              mt: 6,
              width: 300,
              height: 300,

              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              overflow: "hidden",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {blackLogo ? (
              <Box
                component="img"
                src={blackLogo}
                alt={brandName || "logo"}
                sx={{ width: "70%", height: "70%", objectFit: "contain" }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: 12,
                  textAlign: "center",
                  letterSpacing: 1,
                  color: "#000",
                }}
              >
                {brandName || "YOUR BRAND"}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* RIGHT SECTION */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            position: "relative",
            minHeight: 650,
          }}
        >
          <Image
            src="/WebSiteStaticImage/Banner/footer.jpg"
            alt=""
            fill
            style={{
              objectFit: "cover",
            }}
          />

          {/* DARK OVERLAY HERE */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              // Option A: Uniform dark overlay with a subtle bottom gradient
              backgroundColor: "rgba(0, 0, 0, 0.4)",
             
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 70,
              left: 40,
              right: 40,
              color: "#fff",
              maxWidth: 550,
              zIndex: 1, // Ensures text & inputs stay above the overlay
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 28,
                  md: 42,
                },
                fontFamily: "Cormorant Garamond, serif",
                mb: 3,
              }}
            >
              Sign up to our newsletter for 10% off your first order
            </Typography>

            <Box component="form" onSubmit={handleSubmitNewlater}>
              <TextField
                placeholder="Enter Email Address"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  maxWidth: 380,

                  "& .MuiOutlinedInput-root": {
                    color: "#fff",

                    
                    "& fieldset": {
                      borderColor: "#fff",
                    },

                   
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },

                  
                    "&.Mui-focused fieldset": {
                      borderColor: "#d1d5db", 
                    },

                    "& input::placeholder": {
                      color: "#fff",
                      opacity: 1,
                    },
                  },
                }}
              />
              <button type="submit" style={{ display: "none" }} />
            </Box>

            {loading ? (
              <Typography sx={{ mt: 1, fontSize: 13, color: "#fff" }}>Loading...</Typography>
            ) : (
              result && (
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 13,
                    color: result.startsWith("Thank You!") ? "#7CF7B0" : "#FF8A8A",
                  }}
                >
                  {result}
                </Typography>
              )
            )}

            <Box sx={{ mt: 3 }}>
              {socialMediaData?.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.SLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.SName}
                  sx={{
                    color: "#fff",
                    width: 37,
                    height: 37,
                    borderRadius: "50%",
                    overflow: "hidden",
                    padding: 0,
                    mr: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={social.SImgPath}
                    alt={social.SName}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* BOTTOM BAR */}
      <Box
        sx={{
          borderTop: "1px solid #ddd",
          px: 4,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          bgcolor: "#f5f0eb",
        }}
      >
        <Typography variant="body2">
          {storeInit?.CurrencyCode} / {storeInit?.CountryName || storeInit?.CountryCode}
        </Typography>

        <Typography variant="body2">
          © {year} {brandName || "Your Brand"}
        </Typography>
      </Box>
    </Box>
  );
}