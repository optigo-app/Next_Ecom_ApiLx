"use client";

import React from "react";
import { Box, Typography, CircularProgress, Fade } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function OrderProcessingBackdrop({
  open = false,
  isSuccess = false,
  orderNumber = "",
}) {
  if (!open) return null;

  return (
    <Fade in={open} timeout={400}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 99999,
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          userSelect: "none",
        }}
      >
        <Box
          sx={{
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isSuccess ? (
            /* Success State */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                "@keyframes successPop": {
                  "0%": { opacity: 0, transform: "scale(0.8)" },
                  "100%": { opacity: 1, transform: "scale(1)" },
                },
              }}
            >
              {/* MUI Check Circle Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  border: "1px solid #dcfce7",
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: 54,
                    color: "#16a34a",
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  letterSpacing: "0.5px",
                  color: "#111827",
                  fontFamily: "inherit",
                  mb: 1,
                }}
              >
                Order Placed Successfully!
              </Typography>

              {orderNumber && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    mb: 1.5,
                  }}
                >
                  Order #{orderNumber}
                </Typography>
              )}

              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  letterSpacing: "0.2px",
                }}
              >
                Redirecting you to your confirmation details...
              </Typography>
            </Box>
          ) : (
            /* Processing State */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "fadeIn 0.3s ease-out forwards",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(8px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {/* Minimalist Circular Loader */}
              <Box sx={{ mb: 3.5, position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="indeterminate"
                  size={56}
                  thickness={2.5}
                  sx={{
                    color: "#111827",
                    animationDuration: "900ms",
                  }}
                />
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.15rem", sm: "1.35rem" },
                  letterSpacing: "0.4px",
                  color: "#111827",
                  fontFamily: "inherit",
                  mb: 1,
                }}
              >
                Processing Your Order
              </Typography>

              {/* Minimal Subtitle */}
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  maxWidth: 360,
                }}
              >
                Please do not close or refresh this window while we securely confirm your transaction.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );
}
