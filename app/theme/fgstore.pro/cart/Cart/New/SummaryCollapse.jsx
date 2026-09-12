import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  IconButton,
  Collapse,
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

export default function ProductWeightPanel() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 92,
        ml: "auto",
        zIndex: 10,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Collapse Content */}
        <Collapse orientation="horizontal" in={open} collapsedSize={0}>
          <Box sx={{ width: 260, p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1.5 }}
            >
              Product Weights
            </Typography>

            <Stack spacing={1.5}>
              <WeightRow label="Gross Weight" value="29.064 g" />
              <Divider />
              <WeightRow label="Net Weight" value="28.364 g" />
              <Divider />
              <WeightRow label="Diamond Weight" value="3.500 / 7" />
            </Stack>
          </Box>
        </Collapse>

        {/* Toggle Handle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderLeft: "1px solid",
            borderColor: "divider",
            px: 0.5,
            bgcolor: "background.paper",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              width: 32,
              height: 32,
            }}
          >
            {open ? (
              <ChevronRightRoundedIcon />
            ) : (
              <ChevronLeftRoundedIcon />
            )}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

/* --- Row --- */

function WeightRow({
  label,
  value,
}) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 500 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
