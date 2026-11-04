'use client';
import React from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const HeaderStepper = ({
  activeStep,
  handleStepClick,
  isStepComplete,
  isMobile,
  STEPS,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        mx: "auto",
        mt: { xs: 1, sm: 1.5 },
        mb: { xs: 2.5, sm: 3.5 },
        px: { xs: 0.5, sm: 1 },
      }}
    >
      {/* Horizontal Stepper Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {STEPS?.map((step, index) => {
          const isCurrent = activeStep === index;
          const isPastCompleted = index < activeStep || isStepComplete(index);
          const isClickable = index <= activeStep || isPastCompleted;

          return (
            <React.Fragment key={step.label}>
              {/* Step Item */}
              <Box
                onClick={() => isClickable && handleStepClick(index)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: isClickable ? "pointer" : "default",
                  position: "relative",
                  zIndex: 2,
                  flex: "0 0 auto",
                  textAlign: "center",
                  px: { xs: 0.5, sm: 1 },
                  "&:hover .step-num": {
                    transform: isClickable ? "scale(1.06)" : "none",
                  },
                }}
              >
                {/* Step Number Circle */}
                <Box
                  className="step-num"
                  sx={{
                    width: { xs: 26, sm: 28 },
                    height: { xs: 26, sm: 28 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    transition: "all 0.2s ease-in-out",
                    bgcolor: isCurrent || isPastCompleted ? "#0b291d" : "#ffffff",
                    color: isCurrent || isPastCompleted ? "#ffffff" : "#9ca3af",
                    border: isCurrent || isPastCompleted ? "2px solid #0b291d" : "1.5px solid #d1d5db",
                    boxShadow: isCurrent ? "0 0 0 3px rgba(11, 41, 29, 0.12)" : "none",
                    mb: { xs: 0.75, sm: 1 },
                  }}
                >
                  {isPastCompleted && !isCurrent ? (
                    <CheckIcon sx={{ fontSize: { xs: 15, sm: 16 }, color: "#ffffff" }} />
                  ) : (
                    index + 1
                  )}
                </Box>

                {/* Step Label (Desktop & Tablet - Always Single Line) */}
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: "none", sm: "inline-block" },
                    fontSize: "0.78rem",
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent ? "#0b291d" : isPastCompleted ? "#374151" : "#9ca3af",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    position: "relative",
                    pb: isCurrent ? 0.6 : 0,
                  }}
                >
                  {step.label}
                  {step.optional && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.7rem",
                        color: "#9ca3af",
                        fontWeight: 400,
                        ml: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      (Optional)
                    </Typography>
                  )}

                  {/* Active Indicator Underline */}
                  {isCurrent && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        bgcolor: "#0b291d",
                        borderRadius: "1px",
                      }}
                    />
                  )}
                </Typography>
              </Box>

              {/* Connecting Line */}
              {index < STEPS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    minWidth: "16px",
                    height: "1px",
                    bgcolor: index < activeStep ? "#0b291d" : "#e5e7eb",
                    mt: { xs: 1.6, sm: 1.7 },
                    mx: { xs: 0.5, sm: 1 },
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Active Step Subtitle for Mobile View */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          textAlign: "center",
          mt: 1.25,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#0b291d",
            whiteSpace: "nowrap",
          }}
        >
          Step {activeStep + 1} of {STEPS.length}: {STEPS[activeStep]?.label}
        </Typography>
      </Box>
    </Box>
  );
};

export default HeaderStepper;
