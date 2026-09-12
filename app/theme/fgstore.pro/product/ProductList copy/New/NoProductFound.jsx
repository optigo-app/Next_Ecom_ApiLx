import { Box, Typography, Stack } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const NoProductFound = () => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={1}
        alignItems="center"
        sx={{
          textAlign: "center",
          maxWidth: 420,
          opacity: 0.9,
        }}
      >
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SearchOffIcon sx={{ fontSize: 48, opacity: 0.7 }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          No Products Found
        </Typography>
      </Stack>
    </Box>
  );
};

export default NoProductFound;
