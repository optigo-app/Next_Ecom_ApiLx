import React from "react";
import "./Delivery.scss";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Divider,
  Grid,
} from "@mui/material";

export default function AddressForm({
  open,
  handleClose,
  handleCancel,
  handleInputChange,
  handleSubmit,
  formData,
  errors,
  isEditMode,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "1px", p: 1 } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            textAlign: "center",
            pb: 2,
          }}
        >
          {isEditMode ? "Edit Shipping Address" : "Add Shipping Address"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Mobile No."
                value={formData.mobileNo}
                onChange={(e) => handleInputChange(e, "mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors.mobileNo}
                fullWidth
                type="number"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange(e, "address")}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange(e, "country")}
                error={!!errors.country}
                helperText={errors.country}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange(e, "state")}
                error={!!errors.state}
                helperText={errors.state}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange(e, "city")}
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange(e, "zipCode")}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                fullWidth
                type="number"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "1px" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ px: 3, pb: 3, justifyContent: "flex-end", gap: 1.5 }}
        >
          <Button
            type="button"
            onClick={handleCancel}
            sx={{
              height: 42,
              px: 3,
              color: "#000",
              background: "#fff",
              border: "1px solid #000",
              borderRadius: "1px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              "&:hover": {
                background: "#f5f5f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{
              height: 42,
              px: 3,
              color: "#fff",
              background: "#000",
              border: "1px solid #000",
              borderRadius: "1px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              "&:hover": {
                background: "#333",
              },
            }}
          >
            {isEditMode ? "Save Changes" : "Add Address"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
