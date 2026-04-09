"use client";

import React from "react";
import "./Delivery.scss";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";
import { useAddress } from "@/app/(core)/utils/Glob_Functions/OrderFlow/useAddress";
import { Grid, Box, Button, Paper } from "@mui/material";
import SkeletonLoader from "./AddressSkelton";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import AddIcon from "@mui/icons-material/Add";
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";

const AddressManagement = () => {
  const { addressData, open, openDelete, formData, errors, isEditMode, isLoading, handleOpen, handleClose, handleCancel, handleInputChange, handleSubmit, handleDelete, handleDeleteClick, handleDeleteClose, handleDefaultSelection, proceedToOrder } = useAddress();

  const location = useNextRouterLikeRR();
  // Use replace so Delivery → Payment doesn't stack in back-history.
  // Pressing Back from Payment returns to Cart, not a mid-checkout page.
  const navigate = location.replace;

  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 2,
          paddingBottom: "150px",
        }}
      >
        {!isLoading ? (
          <Grid container spacing={1}>
            {addressData?.map((data, index) => (
              <React.Fragment key={data.id}>
                <AddressCard key={data.id} name={data.name} address={data} index={index} handleOpen={handleOpen} handleDeleteClick={handleDeleteClick} handleDefaultSelection={handleDefaultSelection} />
              </React.Fragment>
            ))}
          </Grid>
        ) : (
          <SkeletonLoader />
        )}
        <AddressForm open={open} handleClose={handleClose} handleCancel={handleCancel} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} errors={errors} isEditMode={isEditMode} />
        <ConfirmationDialog open={openDelete} onClose={handleDeleteClose} onConfirm={handleDelete} title="Confirm" content="Are you sure you want to remove this address?" />
        <Box className="smr_AddressBtnGroup" sx={{ mb: 2, mt: 2 }}>
          <Button
            onClick={() => handleOpen(null)}
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 2,
              py: 1,
              borderStyle: "dashed",
              fontSize: "14px",
              borderColor: COLORS.border,
              color: COLORS.primary
            }}
          >
            Add New Address
          </Button>
        </Box>
      </Box>
      <BottomFloatingButton onContinue={() => proceedToOrder(navigate)} />
    </>
  );
};

export default AddressManagement;

function BottomFloatingButton({ onContinue }) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 1.5,
        zIndex: 9999,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        backdropFilter: "blur(6px)",
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={onContinue}
          sx={{
            borderRadius: 3,
            py: 1.6,
            fontSize: "15px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
            bgcolor: COLORS.primary,
            ':hover': {
              bgcolor: COLORS.hover,
            }
          }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Paper>
  );
}
