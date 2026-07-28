import { Card, Box, Typography, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AddNewAddressCard({ handleAddNew }) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        onClick={handleAddNew}
        sx={{
          height: "100%",
          minHeight: "240px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "22px",
          border: "2px dashed #bca16a",
          background: "#fff",
          cursor: "pointer",
          boxShadow: "0px 12px 32px rgba(0,0,0,0.06)",
          transition: "all .25s ease",
          "&:hover": {
            background: "#fcf7ef",
          },
        }}
      >
        <Box
          sx={{
            background: "#bca16a",
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            boxShadow: "0 4px 12px rgba(188, 161, 106, 0.35)",
          }}
        >
          <AddIcon sx={{ fontSize: "32px", color: "#fff" }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            color: "#6d5b37",
            mb: 1,
          }}
        >
          Add New Address
        </Typography>

        <Typography
          sx={{
            fontSize: "13px",
            color: "#8c7a58",
            textAlign: "center",
            px: 2,
          }}
        >
          Save your shipping details for faster checkout
        </Typography>
      </Card>
    </Grid>
  );
}
