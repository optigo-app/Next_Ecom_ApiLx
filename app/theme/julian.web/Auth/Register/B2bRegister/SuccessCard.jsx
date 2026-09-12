import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/material/styles";

const GlassContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 480,
  margin: "100px auto",
  padding: theme.spacing(6),
  borderRadius: 24,
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.6)", // glass
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow:
    "0 4px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.4) inset",
}));

const IconWrapper = styled("div")(({ theme, ownerState }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  "& svg": {
    fontSize: 72,
    color: ownerState?.isFirstTime ? theme.palette.success.main : "#ff9800",
    filter: ownerState?.isFirstTime
      ? "drop-shadow(0 4px 12px rgba(76, 175, 80, 0.4))"
      : "drop-shadow(0 4px 12px rgba(255, 152, 0, 0.4))",
  },
}));

export default function RegistrationSuccess({
  onHome,
  onLogin,
  isFirstTime = true,
  onCheckStatus,
  checkLoading = false,
  statusMessage = "",
  onRegisterNew,
}) {
  return (
    <GlassContainer elevation={0}>
      <IconWrapper ownerState={{ isFirstTime }}>
        <CheckCircleRoundedIcon />
      </IconWrapper>

      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ mb: 1, color: "rgba(0,0,0,0.85)" }}
      >
        {isFirstTime ? "Thanks for registering!" : "Registration Under Review"}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          lineHeight: 1.6,
          color: "rgba(0,0,0,0.65)",
          fontSize: "0.95rem",
        }}
      >
        {statusMessage ||
          (isFirstTime ? (
            <>
              Your request is under review. <br />
              You’ll get a confirmation on Email/WhatsApp once approved.
            </>
          ) : (
            <>
              Your account details have been submitted and are pending
              administrator approval. <br />
              Please click "Check Status" below to refresh the approval status.
            </>
          ))}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        <Box display="flex" gap={2} justifyContent="center" width="100%">
          <Button
            variant="contained"
            color="warning"
            disabled={checkLoading}
            onClick={onCheckStatus}
            startIcon={
              checkLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <RefreshIcon />
              )
            }
            sx={{
              borderRadius: 3,
              px: 3.5,
              py: 1.2,
              fontWeight: 500,
              textTransform: "none",
              bgcolor: "#ff9800",
              boxShadow: "0 4px 14px rgba(255, 152, 0, 0.3)",
              "&:hover": {
                bgcolor: "#e65100",
              },
            }}
          >
            {checkLoading ? "Checking..." : "Check Status"}
          </Button>
          <Button
            variant={isFirstTime ? "contained" : "outlined"}
            color="primary"
            onClick={onHome}
            sx={{
              borderRadius: 3,
              px: 3.5,
              py: 1.2,
              fontWeight: 500,
              textTransform: "none",
              boxShadow: isFirstTime ? "0 4px 14px rgba(0,0,0,0.1)" : "none",
              borderColor: "rgba(0,0,0,0.2)",
              "&:hover": {
                borderColor: (theme) => theme.palette.primary.main,
                background: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Go to Home
          </Button>
          {/* <Button
            variant="outlined"
            color="primary"
            onClick={onLogin}
            sx={{
              borderRadius: 3,
              px: 3.5,
              py: 1.2,
              fontWeight: 500,
              textTransform: "none",
              borderColor: "rgba(0,0,0,0.2)",
              "&:hover": {
                borderColor: (theme) => theme.palette.primary.main,
                background: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Login
          </Button> */}
        </Box>

        {!isFirstTime && (
          <Button
            variant="text"
            color="secondary"
            onClick={onRegisterNew}
            sx={{
              textTransform: "none",
              fontWeight: 400,
              fontSize: "0.85rem",
              color: "rgba(0,0,0,0.5)",
              "&:hover": {
                color: "rgba(0,0,0,0.8)",
                background: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Need to register a different account? Click here
          </Button>
        )}
      </Box>
    </GlassContainer>
  );
}
