"use client";

import React from "react";
import "./Delivery.scss";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Divider, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";

export default function AddressForm({ open, handleClose, handleCancel, handleInputChange, handleSubmit, formData, errors, isEditMode }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      sx={{
        zIndex: 9999999999,
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? "Edit Shipping Address" : "Add Shipping Address"}</DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="First Name" size="small" value={formData.firstName} onChange={(e) => handleInputChange(e, "firstName")} error={!!errors.firstName} helperText={errors.firstName} fullWidth />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="Last Name" size="small" value={formData.lastName} onChange={(e) => handleInputChange(e, "lastName")} error={!!errors.lastName} helperText={errors.lastName} fullWidth />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="Mobile Number" size="small" value={formData.mobileNo} onChange={(e) => handleInputChange(e, "mobileNo")} error={!!errors.mobileNo} helperText={errors.mobileNo} fullWidth type="tel" />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="Address" size="small" multiline rows={5} value={formData.address} onChange={(e) => handleInputChange(e, "address")} error={!!errors.address} helperText={errors.address} fullWidth />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="City" size="small" value={formData.city} onChange={(e) => handleInputChange(e, "city")} error={!!errors.city} helperText={errors.city} fullWidth />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="ZIP Code" size="small" value={formData.zipCode} onChange={(e) => handleInputChange(e, "zipCode")} error={!!errors.zipCode} helperText={errors.zipCode} fullWidth type="number" />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="State" size="small" value={formData.state} onChange={(e) => handleInputChange(e, "state")} error={!!errors.state} helperText={errors.state} fullWidth />
            </Grid>

            <Grid
              item
              size={{
                xs: 12,
              }}
            >
              <TextField label="Country" size="small" value={formData.country} onChange={(e) => handleInputChange(e, "country")} error={!!errors.country} helperText={errors.country} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            gap: 1,
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid rgba(0,0,0,0.12)",
            p: 2,
            zIndex: 2,
          }}
        >
          <Button variant="outlined" fullWidth onClick={handleCancel} sx={{ textTransform: "none", borderColor: COLORS.border, color: COLORS.primary }}>
            Cancel
          </Button>

          <Button variant="contained" fullWidth type="submit" sx={{
            textTransform: "none", bgcolor: COLORS.primary, ':hover': {
              bgcolor: COLORS.hover,
            }
          }}>
            {isEditMode ? "Save Changes" : "Add Address"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// import React from 'react';
// import './Delivery.scss'
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Divider } from '@mui/material';

// export default function AddressForm({ open, handleClose, handleCancel, handleInputChange, handleSubmit, formData, errors, isEditMode }) {
//     return (
//         <Dialog open={open} onClose={handleClose}>
//             <form onSubmit={handleSubmit}>
//                 <DialogTitle className='smr_dialogTitle'>{isEditMode ? 'Edit Shipping Address' : 'Add Shipping Address'}</DialogTitle>
//                 <Divider/>
//                 <DialogContent>
//                     <TextField
//                         label="First Name"
//                         value={formData.firstName}
//                         onChange={(e) => handleInputChange(e, 'firstName')}
//                         error={!!errors.firstName}
//                         helperText={errors.firstName}
//                         fullWidth
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="Last Name"
//                         value={formData.lastName}
//                         onChange={(e) => handleInputChange(e, 'lastName')}
//                         error={!!errors.lastName}
//                         helperText={errors.lastName}
//                         fullWidth
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="Mobile No."
//                         value={formData.mobileNo}
//                         onChange={(e) => handleInputChange(e, 'mobileNo')}
//                         error={!!errors.mobileNo}
//                         helperText={errors.mobileNo}
//                         fullWidth
//                         type='number'
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="Address"
//                         value={formData.address}
//                         onChange={(e) => handleInputChange(e, 'address')}
//                         error={!!errors.address}
//                         helperText={errors.address}
//                         fullWidth
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="Country"
//                         value={formData.country}
//                         onChange={(e) => handleInputChange(e, 'country')}
//                         error={!!errors.country}
//                         helperText={errors.country}
//                         fullWidth
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="State"
//                         value={formData.state}
//                         onChange={(e) => handleInputChange(e, 'state')}
//                         error={!!errors.state}
//                         helperText={errors.state}
//                         fullWidth
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="City"
//                         value={formData.city}
//                         onChange={(e) => handleInputChange(e, 'city')}
//                         error={!!errors.city}
//                         helperText={errors.city}
//                         fullWidth
//                         className='smr_addressTextFields'
//                     />
//                     <TextField
//                         label="ZIP Code"
//                         value={formData.zipCode}
//                         onChange={(e) => handleInputChange(e, 'zipCode')}
//                         error={!!errors.zipCode}
//                         helperText={errors.zipCode}
//                         fullWidth
//                         type='number'
//                         className='smr_addressTextFields'
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <div className='smr_AddressBtnGroup'>
//                     <button type='submit' className='smr_AddNewAddrModalbtn'>{isEditMode ? 'Save Changes' : 'Add Address'}</button>
//                     <button type='button' className='smr_Cancelbtn' onClick={handleCancel}>Cancel</button>
//                     </div>
//                 </DialogActions>
//             </form>
//         </Dialog>
//     );
// }
