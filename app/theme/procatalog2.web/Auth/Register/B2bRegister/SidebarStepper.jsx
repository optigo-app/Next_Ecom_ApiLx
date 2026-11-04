import React, { useState, useRef } from "react";
import { Box, Button, Grid, Typography, Divider } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";

const SidebarStepper = ({ activeStep, handleStepClick, isStepComplete, isMobile, STEPS }) => {
  return (
    <Grid
      size={{
        xs: 12,
        md: 3.5
      }}
      sx={{
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        borderBottom: { xs: "1px solid rgba(255, 255, 255, 0.06)", md: "none" },
        p: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 1,
          letterSpacing: "-0.02em",
        }}
      >
        Customer Registration
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mb: 4,
          fontSize: "0.875rem",
          color: "#9ca3af",
        }}
      >
        Complete all steps to register your business
      </Typography>

      <Divider sx={{ mb: isMobile ? 0 : 3, bgcolor: "rgba(255, 255, 255, 0.06)" }} />

      <Box sx={{ display: isMobile ? "none" : "flex", flexDirection: "column", gap: 0.5 }}>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === index;
          const isComplete = isStepComplete(index);

          return (
            <Button
              key={index}
              onClick={() => handleStepClick(index)}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                py: 1.75,
                px: 2.5,
                borderRadius: 0.2,
                textTransform: "none",
                bgcolor: isActive ? "rgba(16, 38, 78, 0.1)" : isComplete ? "rgba(16, 185, 129, 0.05)" : "transparent",
                color: isComplete
                  ? "#10b981"
                  : isActive
                    ? "#10264E" // theme color active
                    : "gray",
                fontWeight: isActive ? 600 : isComplete ? 500 : 400,
                fontSize: "0.938rem",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isActive
                    ? "rgba(16, 38, 78, 0.15)" // slightly darker hover for active
                    : isComplete
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(156, 163, 175, 0.1)", // subtle gray hover
                  color: isActive ? "#10264E" : isComplete ? "#10b981" : "#374151",
                },
              }}
              startIcon={isComplete ? <CheckIcon sx={{ fontSize: 20, color: "inherit" }} /> : <Icon sx={{ fontSize: 20, color: "inherit" }} />}
            >
              {step.label}
            </Button>
          );
        })}
      </Box>
    </Grid>

  )
}

export default SidebarStepper