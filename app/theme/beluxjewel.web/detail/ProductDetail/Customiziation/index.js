import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Link,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// British Jewel Navy Blue design system
const colors = {
  primary: "#0B2F83", // British Jewel Navy Blue
  accent: "#0B2F83", // Navy Blue Accent
  accentLight: "#F0F4FC", // Soft light blue background for selected items
  textDark: "#102A43", // Slate Dark Text
  textMuted: "#627D98", // Slate Muted Text
  alertText: "#D32F2F", // Alert red
  borderLight: "#D9E2EC", // Light border
  buttonHover: "#082360", // Darker Navy Hover
};

// Mock data based on the screenshot
const sizes = [
  { value: 5, mm: "44.8 mm", status: "Made to Order" },
  { value: 6, mm: "45.9 mm", status: "Made to Order" },
  { value: 7, mm: "47.1 mm", status: "Made to Order" },
  { value: 8, mm: "48.1 mm", status: "Only 1 left!" },
  { value: 9, mm: "49.0 mm", status: "Only 1 left!" },
  { value: 10, mm: "50.0 mm", status: "Only 1 left!" },
  { value: 11, mm: "50.9 mm", status: "Only 1 left!" },
  { value: 12, mm: "51.8 mm", status: "Only 1 left!" },
  { value: 13, mm: "52.8 mm", status: "Made to Order" },
  { value: 14, mm: "54.0 mm", status: "Made to Order" },
  { value: 15, mm: "55.0 mm", status: "Made to Order" },
  { value: 16, mm: "55.9 mm", status: "Made to Order" },
  { value: 17, mm: "56.9 mm", status: "Made to Order" },
  { value: 18, mm: "57.8 mm", status: "Made to Order" },
  { value: 19, mm: "59.1 mm", status: "Made to Order" },
  { value: 20, mm: "60.0 mm", status: "Made to Order" },
  { value: 21, mm: "60.9 mm", status: "Made to Order" },
  { value: 22, mm: "61.9 mm", status: "Made to Order" },
  { value: 23, mm: "62.8 mm", status: "Made to Order" },
  { value: 24, mm: "63.8 mm", status: "Only 1 left!" },
];

export default function CustomizerDrawer({ open, onClose }) {
  const [selectedMetal, setSelectedMetal] = useState("9 KT Yellow");
  const [selectedDiamond, setSelectedDiamond] = useState("FG-SI");
  const [selectedSize, setSelectedSize] = useState(12);

  // Selection Card component
  const CustomSelectionCard = ({ label, subtext, selected, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        border: `1.5px solid ${selected ? colors.accent : colors.borderLight}`,
        backgroundColor: selected ? colors.accentLight : "#FFFFFF",
        borderRadius: "10px",
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "125px",
        textAlign: "center",
        position: "relative",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: selected ? "0 0 12px rgba(11, 47, 131, 0.25)" : "none", // Elegant selection glow
        "&:hover": {
          borderColor: colors.accent,
          boxShadow: selected ? "0 0 12px rgba(11, 47, 131, 0.3)" : "0 4px 12px rgba(11, 47, 131, 0.08)",
        },
      }}
    >
      {selected && (
        <CheckCircleIcon
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            fontSize: "18px",
            color: colors.accent,
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
          }}
        />
      )}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "13px",
          color: selected ? colors.primary : colors.textDark, // High contrast text selection
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </Typography>
      {subtext && (
        <Typography
          sx={{
            fontSize: "10px",
            color: subtext.includes("1") ? colors.alertText : colors.textMuted,
            mt: 0.8,
            fontWeight: 600,
          }}
        >
          {subtext}
        </Typography>
      )}
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 99999, // Drawer Modal ka z-index
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "700px" },
          height: "100%",
          boxShadow: "-10px 0px 40px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#FAF9F6",
          zIndex: 99999,
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${colors.borderLight}`,
          bgcolor: "#FFFFFF",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              color: colors.textMuted,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Estimated Price
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mt: 0.5 }}
          >
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 700,
                color: colors.textDark,
                fontFamily: "Outfit, sans-serif",
              }}
            >
              ₹10,152
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: colors.textMuted,
                textDecoration: "line-through",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              ₹14,458
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: colors.textDark }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Scrollable Customization Content */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3.5, py: 3 }}>
        {/* Section 1: Choice of Metal */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "13px",
              color: colors.textDark,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 1.5,
            }}
          >
            Choice of Metal
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CustomSelectionCard
              label="9 KT Yellow"
              subtext="Only 1 left!"
              selected={selectedMetal === "9 KT Yellow"}
              onClick={() => setSelectedMetal("9 KT Yellow")}
            />
            <CustomSelectionCard
              label="14 KT Yellow"
              subtext="Made to Order"
              selected={selectedMetal === "14 KT Yellow"}
              onClick={() => setSelectedMetal("14 KT Yellow")}
            />
          </Box>
        </Box>

        {/* Section 2: Diamond Quality */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13px",
                color: colors.textDark,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Diamond Quality
            </Typography>
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: colors.accent,
                letterSpacing: "0.5px",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              DIAMOND GUIDE
            </Link>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CustomSelectionCard
              label="FG-SI"
              subtext="Only 1 left!"
              selected={selectedDiamond === "FG-SI"}
              onClick={() => setSelectedDiamond("FG-SI")}
            />
          </Box>
        </Box>

        {/* Section 3: Select Size Grid */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13px",
                color: colors.textDark,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Select Size
            </Typography>
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: colors.accent,
                letterSpacing: "0.5px",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              SIZE GUIDE
            </Link>
          </Box>

          <Grid container spacing={1}>
            {sizes.map((item) => {
              const isSelected = selectedSize === item.value;
              const isUrgent = item.status.includes("1");

              return (
                <Grid size={{ xs: 2.4, sm: 2.4 }} key={item.value}>
                  <Box
                    onClick={() => setSelectedSize(item.value)}
                    sx={{
                      cursor: "pointer",
                      border: `1.5px solid ${isSelected ? colors.accent : colors.borderLight}`,
                      backgroundColor: isSelected ? colors.accentLight : "#FFFFFF",
                      borderRadius: "8px",
                      padding: "10px 4px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: "72px",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 0 10px rgba(11, 47, 131, 0.2)" : "none", // Subtle selection glow
                      "&:hover": {
                        borderColor: colors.accent,
                        boxShadow: isSelected ? "0 0 10px rgba(11, 47, 131, 0.25)" : "0 3px 8px rgba(11, 47, 131, 0.05)",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: colors.textDark,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: colors.textMuted,
                        my: 0.3,
                        fontWeight: 500,
                      }}
                    >
                      {item.mm}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "9px",
                        fontWeight: 600,
                        color: isUrgent ? colors.alertText : colors.textMuted,
                        lineHeight: 1.1,
                      }}
                    >
                      {item.status}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      {/* Persistent Bottom Action Bar */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${colors.borderLight}`,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: colors.primary,
            color: "#FFFFFF",
            "&:hover": { backgroundColor: colors.buttonHover },
            borderRadius: "8px",
            paddingY: "14px",
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Confirm Customisation
        </Button>
      </Box>
    </Drawer>
  );
}
