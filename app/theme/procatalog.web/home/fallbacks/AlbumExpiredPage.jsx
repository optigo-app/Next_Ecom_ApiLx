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
  EventBusyOutlined,
  StorefrontOutlined,
  MailOutlineRounded,
} from "@mui/icons-material";

const formatExpiry = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ExpiredIllustration = () => (
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Expired calendar illustration"
    style={{ width: "100%", height: "auto", display: "block" }}
  >
    <defs>
      <clipPath id="calClipExp">
        <rect x="74" y="52" width="124" height="104" rx="14" />
      </clipPath>
    </defs>

    {/* soft ground shadow */}
    <ellipse cx="140" cy="178" rx="94" ry="11" fill="var(--hm-accent-soft, #edf1f5)" />

    {/* rear card, tilted */}
    <rect
      x="66"
      y="62"
      width="122"
      height="94"
      rx="14"
      fill="var(--hm-border, #e2e8f0)"
      transform="rotate(-7 127 109)"
    />

    {/* front calendar */}
    <rect
      x="74"
      y="52"
      width="124"
      height="104"
      rx="14"
      fill="var(--hm-surface, #ffffff)"
      stroke="var(--hm-border, #e2e8f0)"
      strokeWidth="2"
    />

    {/* header band */}
    <g clipPath="url(#calClipExp)">
      <rect x="74" y="52" width="124" height="30" fill="#E8EDF2" />
    </g>

    {/* binder rings */}
    <rect x="98" y="42" width="9" height="22" rx="4.5" fill="var(--hm-text-light, #94a3b8)" />
    <rect x="165" y="42" width="9" height="22" rx="4.5" fill="var(--hm-text-light, #94a3b8)" />

    {/* date grid row 1 */}
    <rect x="95" y="94" width="22" height="17" rx="4" fill="var(--hm-accent-soft, #edf1f5)" />
    <rect x="125" y="94" width="22" height="17" rx="4" fill="var(--hm-accent-soft, #edf1f5)" />
    <rect x="155" y="94" width="22" height="17" rx="4" fill="var(--hm-accent-soft, #edf1f5)" />

    {/* date grid row 2 — middle square is the expired date, crossed out */}
    <rect x="95" y="120" width="22" height="17" rx="4" fill="var(--hm-accent-soft, #edf1f5)" />
    <rect x="125" y="120" width="22" height="17" rx="4" fill="#FDE68A" />
    <path
      d="M129 124.5 L143 132.5 M143 124.5 L129 132.5"
      stroke="var(--hm-gold, #d97706)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <rect x="155" y="120" width="22" height="17" rx="4" fill="var(--hm-accent-soft, #edf1f5)" />

    {/* clock badge overlapping bottom-right */}
    <circle cx="208" cy="150" r="28" fill="var(--hm-surface-muted, #f8f9fa)" />
    <circle cx="208" cy="150" r="24" fill="var(--hm-text-secondary, #1e293b)" />
    <circle cx="208" cy="150" r="15" fill="var(--hm-surface, #ffffff)" />
    <path
      d="M208 137 v3 M208 160 v3 M221 150 h-3 M195 150 h3"
      stroke="var(--hm-text-light, #94a3b8)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M208 141 v9 l6.5 4"
      stroke="var(--hm-gold, #d97706)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="208" cy="150" r="2.2" fill="var(--hm-gold, #d97706)" />
  </svg>
);

const AlbumExpiredPage = ({
  onReturnHome = () => (window.location.href = "/"),
  onRequestNewLink,
  albumName,
  expiresAt,
}) => {
  const expiryLabel = formatExpiry(expiresAt);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "var(--hm-surface-muted, #f8f9fa)",
        px: 2,
        py: 6,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        {/* Illustration */}
        <Box sx={{ maxWidth: 300, mx: "auto", mb: 4 }}>
          <ExpiredIllustration />
        </Box>

        {/* Status Pill */}
        <Chip
          icon={<EventBusyOutlined sx={{ fontSize: "16px !important" }} />}
          label="Link Expired"
          size="small"
          sx={{
            mb: 2.5,
            px: 1,
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "0.02em",
            color: "#B45309",
            bgcolor: "#FFFBEB",
            border: "1px solid #FDE68A",
            "& .MuiChip-icon": { color: "var(--hm-gold, #d97706)" },
          }}
        />

        {/* Main Heading */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "var(--hm-text-body, #111827)",
            fontSize: { xs: "1.5rem", sm: "1.85rem" },
            letterSpacing: "-0.02em",
            mb: 1.5,
          }}
        >
          This album link has expired.
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: "#4B5563",
            lineHeight: 1.7,
            maxWidth: 420,
            mx: "auto",
            mb: albumName || expiryLabel ? 2.5 : 3.5,
          }}
        >
          Sorry! This album is no longer available because its validity period
          has ended.
        </Typography>

        {(albumName || expiryLabel) && (
          <Typography
            variant="body2"
            sx={{ color: "var(--hm-text-disabled, #9ca3af)", mb: 3, fontWeight: 500 }}
          >
            {albumName}
            {albumName && expiryLabel ? " • " : ""}
            {expiryLabel ? `Expired on ${expiryLabel}` : ""}
          </Typography>
        )}

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
          Please contact the album owner to get a new access link.
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
              bgcolor: "var(--hm-text-body, #111827)",
              "&:hover": { bgcolor: "#1F2937" },
            }}
          >
            Back to Store
          </Button>

          {onRequestNewLink && (
            <Button
              variant="outlined"
              startIcon={<MailOutlineRounded />}
              onClick={onRequestNewLink}
              sx={{
                py: 1.25,
                px: 3,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                color: "#374151",
                borderColor: "#D1D5DB",
                "&:hover": {
                  borderColor: "var(--hm-text-disabled, #9ca3af)",
                  bgcolor: "#F9FAFB",
                },
              }}
            >
              Request New Link
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default AlbumExpiredPage;
