import { Box, Typography, Divider, Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function DeliveryHeader({
  addressCount = 0,
  handleBack,
  handleContinue
}) {
  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 5 }}>

      {/* ---- Title Section (Centered) ---- */}
      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#0a1f47",
            letterSpacing: "-0.5px",
          }}
        >
          Delivery
        </Typography>

        {/* Address Count */}
        {addressCount > 0 && (
          <Typography
            sx={{
              mt: 1,
              fontSize: "18px",
              fontWeight: 600,
              color: "#152c55",
            }}
          >
            {addressCount} {addressCount === 1 ? "Address" : "Addresses"}
          </Typography>
        )}
      </Box>

      {/* Divider */}
      <Divider sx={{ mt: 3, mb: 2 }} />

      {/* ---- Buttons Row ---- */}
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mx: "auto",
          px: 1,
          flexWrap: "wrap",

          // Center middle content on responsive
          "@media (max-width: 968px)": {
            justifyContent: "center",
            gap: 2,
          }
        }}
      >

        {/* LEFT — Back Button */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#1a1a1a",
              borderColor: "#ccc",
              fontSize: { xs: "13px", sm: "15px" },
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              ":hover": { borderColor: "#999", background: "#fafafa" },

              "@media (max-width: 968px)": {
                px: 2,
              }
            }}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>

        {/* CENTER — Optional Additional Info */}
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#0a1f47",
            }}
          >
            Select a delivery address
          </Typography>
        </Box>

        {/* RIGHT — Continue Button */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              background: "#163164",
              color: "#fff",
              fontSize: "14px",
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 0.9,
              whiteSpace: "nowrap",
              ":hover": { background: "#163164" },

              // Fixed bottom CTA for mobile screens
              "@media (max-width: 968px)": {
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                width: "100%",
                borderRadius: 0,
                px: 0,
                py: 2,
                zIndex: 2000
              }
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>

      </Stack>
    </Box>
  );
}
