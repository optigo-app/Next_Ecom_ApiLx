import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  BlockOutlined,
  StorefrontOutlined,
  MailOutlineRounded,
} from "@mui/icons-material";

const DeactivatedIllustration = () => (
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Locked album illustration"
    style={{ width: "100%", height: "auto", display: "block" }}
  >
    <defs>
      <clipPath id="albumImgClipDeact">
        <rect x="104" y="62" width="108" height="66" rx="8" />
      </clipPath>
    </defs>

    {/* soft ground shadow */}
    <ellipse cx="140" cy="178" rx="94" ry="11" fill="#EDF1F5" />

    {/* stacked albums behind */}
    <rect
      x="52"
      y="64"
      width="126"
      height="90"
      rx="14"
      fill="#E2E8F0"
      transform="rotate(-9 115 109)"
    />
    <rect
      x="70"
      y="56"
      width="128"
      height="94"
      rx="14"
      fill="#CBD5E1"
      opacity="0.55"
      transform="rotate(-4 134 103)"
    />

    {/* front album card */}
    <rect
      x="92"
      y="50"
      width="132"
      height="110"
      rx="14"
      fill="#FFFFFF"
      stroke="#E2E8F0"
      strokeWidth="2"
    />

    {/* photo area */}
    <g clipPath="url(#albumImgClipDeact)">
      <rect x="104" y="62" width="108" height="66" fill="#EDF1F5" />
      <circle cx="126" cy="80" r="9" fill="#B9C4D0" />
      <path d="M98 132 L136 82 L156 102 L172 84 L220 132 Z" fill="#CBD5E1" />
    </g>
    <rect
      x="104"
      y="62"
      width="108"
      height="66"
      rx="8"
      fill="none"
      stroke="#E2E8F0"
      strokeWidth="2"
    />

    {/* caption lines */}
    <rect x="104" y="138" width="72" height="7" rx="3.5" fill="#E8EDF2" />
    <rect x="104" y="149" width="46" height="7" rx="3.5" fill="#EFF3F7" />

    {/* lock badge */}
    <circle cx="218" cy="52" r="28" fill="#F8F9FA" />
    <circle cx="218" cy="52" r="24" fill="#1E293B" />
    <path
      d="M211 53 v-5 a7 7 0 0 1 14 0 v5"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="207" y="52" width="22" height="16" rx="3.5" fill="#FFFFFF" />
    <circle cx="218" cy="59" r="2.4" fill="#1E293B" />
    <rect x="216.8" y="59.5" width="2.4" height="5" rx="1.2" fill="#1E293B" />
  </svg>
);

const AlbumDeactivatedPage = ({
  onReturnHome = () => (window.location.href = "/"),
  onContactSupport,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F8F9FA",
        px: 2,
        py: 6,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        {/* Illustration */}
        <Box sx={{ maxWidth: 300, mx: "auto", mb: 4 }}>
          <DeactivatedIllustration />
        </Box>

        {/* Status Pill */}
        <Chip
          icon={<BlockOutlined sx={{ fontSize: "16px !important" }} />}
          label="Access Deactivated"
          size="small"
          sx={{
            mb: 2.5,
            px: 1,
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "0.02em",
            color: "#B91C1C",
            bgcolor: "#FEF2F2",
            border: "1px solid #FECACA",
            "& .MuiChip-icon": { color: "#DC2626" },
          }}
        />

        {/* Main Heading */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#111827",
            fontSize: { xs: "1.5rem", sm: "1.85rem" },
            letterSpacing: "-0.02em",
            mb: 1.5,
          }}
        >
          This album is currently unavailable.
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: "#4B5563",
            lineHeight: 1.7,
            maxWidth: 420,
            mx: "auto",
            mb: 3.5,
          }}
        >
          The album you are trying to access has been deactivated. You can no
          longer view its contents.
        </Typography>

        <Divider sx={{ maxWidth: 340, mx: "auto", my: 3, borderColor: "#EAECEF" }} />

        {/* Assistance Note */}
        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
            mb: 3.5,
            lineHeight: 1.6,
          }}
        >
          Please contact the person who shared this album with you for further
          assistance.
        </Typography>

        {/* E-Commerce Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="center"
        >
          <Button
            variant="contained"
            disableElevation
            startIcon={<StorefrontOutlined />}
            onClick={onReturnHome}
            sx={{
              py: 1.25,
              px: 3,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#111827",
              "&:hover": { bgcolor: "#1F2937" },
            }}
          >
            Back to Store
          </Button>

          {onContactSupport && (
            <Button
              variant="outlined"
              startIcon={<MailOutlineRounded />}
              onClick={onContactSupport}
              sx={{
                py: 1.25,
                px: 3,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                color: "#374151",
                borderColor: "#D1D5DB",
                "&:hover": {
                  borderColor: "#9CA3AF",
                  bgcolor: "#F9FAFB",
                },
              }}
            >
              Contact Support
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default AlbumDeactivatedPage;
