import React from "react";
import { Dialog, Slide, Box, Typography, Button } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { eventUIMap } from "@/app/(core)/constants/EventMessage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AdminStatusDialog({ open, type, message, onClose }) {
  const eventConfig = eventUIMap[type] || {
    type: "Error",
    title: "Something went wrong",
    color: "error",
    icon: PriorityHighRoundedIcon,
  };

  const statusColor = eventConfig.color || "error";

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: { xs: 2.5, sm: 3 },
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          bgcolor: "white",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${statusColor}.light`,
          }}
        >
          {eventConfig?.icon && (
            <eventConfig.icon sx={{ fontSize: 45, color: "white" }} />
          )}
        </Box>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: "text.primary",
          fontSize: "1.25rem",
        }}
      >
        {eventConfig?.title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 3,
          fontSize: "0.9rem",
          lineHeight: 1.5,
        }}
      >
        {message}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={onClose}
        sx={{
          py: 1.2,
          borderRadius: 2,
          fontSize: "1rem",
          fontWeight: 600,
          bgcolor: `${statusColor}.main`,
          "&:hover": {
            bgcolor: `${statusColor}.dark`,
          },
        }}
      >
        Okay
      </Button>
    </Dialog>
  );
}
