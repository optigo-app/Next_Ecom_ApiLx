"use client";
import React, { useState } from "react";
import { Box, Typography, Divider, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CustomerReviews from "./CustomerReviews";

const faqData = [
  {
    question: "Can this ring be resized?",
    answer:
      "Yes, we offer one complimentary resizing for standard ring sizes within 60 days of purchase.",
  },
  {
    question: "What style is this design?",
    answer:
      "This design features intricate craftsmanship paired with brilliant accent diamonds for a timeless, elegant look.",
  },
  {
    question: "What metal options are available for this piece?",
    answer:
      "Available in 14K & 18K Yellow Gold, White Gold, Rose Gold, and Platinum.",
  },
  {
    question: "What engagement rings pair well with this band?",
    answer:
      "This band pairs beautifully with solitaire, halo, and vintage-style engagement rings.",
  },
  {
    question: "Is this piece suitable for everyday wear?",
    answer:
      "Absolutely. Crafted with premium solid metals and expert setting techniques, it is built for lifelong everyday wear.",
  },
];

const ExtraProductSections = ({ imgSrc }) => {
  const [isIncludesOpen, setIsIncludesOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const fallbackImg =
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop";
  const displayImg = imgSrc || fallbackImg;

  const toggleFaq = (index) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  return (
    <Box sx={{ width: "90%", mx: "auto", my: 6 }}>
      {/* ==================== 1. ORDER DETAILS SECTION ==================== */}
      <Box
        sx={{
          backgroundColor: "#F7F7F8",
          borderRadius: "24px",
          p: { xs: 3, md: 5 },
          mb: 8,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          {/* Left Details */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: { xs: "24px", md: "30px" },
                color: "#111111",
                mb: 3,
                fontWeight: 400,
              }}
            >
              Order Details
            </Typography>

            {/* Accordion Item 1: Your Order Includes */}
            <Box sx={{ mb: 2.5 }}>
              <Box
                onClick={() => setIsIncludesOpen(!isIncludesOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  py: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#111111",
                  }}
                >
                  Your Order Includes
                </Typography>
                <IconButton size="small" sx={{ color: "#111111" }}>
                  {isIncludesOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </Box>

              <Collapse in={isIncludesOpen}>
                <Box sx={{ pl: 1, pt: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "13.5px",
                      color: "#444444",
                      lineHeight: 1.8,
                    }}
                  >
                    • Professional Appraisal
                    <br />• Free Lifetime Warranty
                  </Typography>
                </Box>
              </Collapse>
            </Box>

            {/* Accordion Item 2: Estimated Shipping */}
            <Box>
              <Box
                onClick={() => setIsShippingOpen(!isShippingOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  py: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#444444",
                  }}
                >
                  Estimated Shipping By:{" "}
                  <strong style={{ color: "#111111" }}>Mon, Aug 3</strong>
                </Typography>
                <IconButton size="small" sx={{ color: "#111111" }}>
                  {isShippingOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </Box>

              <Collapse in={isShippingOpen}>
                <Box sx={{ pl: 1, pt: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#666666",
                      lineHeight: 1.6,
                    }}
                  >
                    Standard insured shipping via Express Delivery. Signature is
                    required upon delivery for safety.
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          </Box>

          {/* Right Wooden Ring Box / Product Image */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "240px", md: "320px" },
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <Box
              component="img"
              src={displayImg}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImg;
              }}
              alt="Order Includes Presentation"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ==================== 2. THE BELUX JEWEL DIFFERENCE ==================== */}
      <Box sx={{ mb: 9 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: { xs: "24px", md: "30px" },
            color: "#111111",
            mb: 4,
            fontWeight: 400,
          }}
        >
          The Belux Jewel Difference
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {/* Card 1 */}
          <Box
            sx={{
              height: 320,
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              backgroundImage: `linear-gradient(to top, rgba(11, 30, 22, 0.95) 0%, rgba(11, 30, 22, 0.4) 60%, transparent 100%), url('https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              p: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13px",
                color: "#FFFFFF",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              AWARD-WINNING ARTISTRY
            </Typography>
          </Box>

          {/* Card 2 */}
          <Box
            sx={{
              height: 320,
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              backgroundImage: `linear-gradient(to top, rgba(11, 30, 22, 0.95) 0%, rgba(11, 30, 22, 0.4) 60%, transparent 100%), url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13px",
                color: "#FFFFFF",
                letterSpacing: "1px",
                textTransform: "uppercase",
                mb: 0.8,
              }}
            >
              UNMATCHED MATERIALS & CRAFTSMANSHIP
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#E0E0E0",
                lineHeight: 1.5,
              }}
            >
              Our dedication to quality craftsmanship begins with our
              responsibly sourced precious metals.
            </Typography>
          </Box>

          {/* Card 3 */}
          <Box
            sx={{
              height: 320,
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              backgroundImage: `linear-gradient(to top, rgba(11, 30, 22, 0.95) 0%, rgba(11, 30, 22, 0.4) 60%, transparent 100%), url('https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              p: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13px",
                color: "#FFFFFF",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              INDUSTRY-LEADING STANDARDS
            </Typography>
          </Box>
        </Box>
      </Box>

      <CustomerReviews />

      {/* ==================== 3. FAQ SECTION ==================== */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: { xs: "28px", md: "34px" },
            color: "#111111",
            textAlign: "center",
            mb: 4,
            fontWeight: 400,
          }}
        >
          FAQ
        </Typography>

        <Box sx={{ maxWidth: "900px", mx: "auto" }}>
          {faqData.map((item, index) => {
            const isOpen = expandedFaq === index;
            return (
              <Box key={index} sx={{ borderBottom: "1px solid #E5E5E5" }}>
                <Box
                  onClick={() => toggleFaq(index)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2.5,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#000000",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14.5px",
                      color: "#111111",
                      fontWeight: 500,
                    }}
                  >
                    {item.question}
                  </Typography>
                  <IconButton size="small" sx={{ color: "#111111" }}>
                    {isOpen ? (
                      <ExpandLessIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Box>

                <Collapse in={isOpen}>
                  <Box sx={{ pb: 2.5, pt: 0, pr: 4 }}>
                    <Typography
                      sx={{
                        fontSize: "13.5px",
                        color: "#555555",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ExtraProductSections;
