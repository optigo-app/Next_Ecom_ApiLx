import { Box, Typography, Button, Stack } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function EmptyCollection() {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* Icon */}
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 40, color: "#999" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 500, letterSpacing: "0.08em" }}
        >
          NO COLLECTION AVAILABLE
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            maxWidth: 480,
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          We’re currently curating something special for you.  
          Please check back soon to explore our latest creations.
        </Typography>

        {/* CTA */}
        <Button
          variant="outlined"
          size="large"
          sx={{
            mt: 2,
            px: 4,
            borderColor: "#000",
            color: "#000",
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Explore New Arrivals
        </Button>
      </Stack>
    </Box>
  );
}
