import React, { useState } from "react";
import { Button, Card, CardContent, Grid, Typography, Box, Chip, IconButton } from "@mui/material";
import { MdDelete, MdModeEditOutline } from "react-icons/md";

const AddressCard = ({ address, index, handleOpen, handleDeleteClick, handleDefaultSelection }) => {
  const { shippingfirstname, shippinglastname, street, city, state, country, zip, shippingmobile, isdefault } = address;

  const [showButtons, setShowButtons] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "22px",
          padding: "22px",
          boxShadow: "0px 12px 32px rgba(0,0,0,0.08)",
          border: isdefault == 1 ? "2px solid #000" : "1px solid #e6e6e6",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        {/* Top Section */}
        <Box onClick={() => handleDefaultSelection(address)} sx={{ flex: "1 0 auto", display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
              {shippingfirstname} {shippinglastname}
            </Typography>

            {isdefault == 1 && (
              <Chip
                label="Default"
                size="small"
                sx={{
                  background: "#000",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: "15px",
                  px: 1,
                }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            {street}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {city} - {zip}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {state}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {country}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Mobile: {shippingmobile}
          </Typography>
        </Box>

        {/* Bottom Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            mt: 2,
          }}
        >
          {/* EDIT BUTTON – smaller, rounded pill, smooth hover */}
          <Button
            onClick={() => handleOpen(address?.id)}
            startIcon={<MdModeEditOutline size={18} />}
            sx={{
              flex: 1,
              background: "#000",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              py: 0.8,
              borderRadius: "30px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "all .25s ease",
              "&:hover": {
                background: "#222",
              },
            }}
          >
            Edit
          </Button>

          {/* DELETE BUTTON – full rounded, smoother, aesthetic */}
          {isdefault != 1 && (
            <Button
              onClick={() => handleDeleteClick(address?.id)}
              startIcon={<MdDelete size={18} />}
              sx={{
                flex: 1,
                background: "#927038",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                py: 0.8,
                borderRadius: "30px",
                transition: "all .25s ease",
                "&:hover": {
                  background: "#665229",
                },
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      </Card>
    </Grid>
  );
};

export default AddressCard;

// import React, { useState } from 'react'
// import './Delivery.modul.scss';
// import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
// import { MdDelete, MdModeEditOutline } from 'react-icons/md';

// const AddressCard = ({ address, index, handleOpen, handleDeleteClick, handleDefaultSelection }) => {
//     const {
//         shippingfirstname,
//         shippinglastname,
//         street,
//         city,
//         state,
//         country,
//         zip,
//         shippingmobile,
//         isdefault
//     } = address;

//     const [showButtons, setShowButtons] = useState(false);

//     const handleMouseEnter = () => {
//         setShowButtons(true);
//     };

//     const handleMouseLeave = () => {
//         setShowButtons(false);
//     };

//     return (
//         <>
//             <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginBottom: '20px', minHeight: '19rem' }}>
//                 <Card
//                     onMouseEnter={handleMouseEnter}
//                     onMouseLeave={handleMouseLeave}
//                     className={isdefault == 1 ? 'elv_ActiveAddrCard' : 'elv_AddrCard'}
//                     style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
//                 >
//                     <CardContent onClick={() => handleDefaultSelection(address)} style={{ flex: '1 0 auto', marginTop: '1rem' }}>
//                         <Typography className='elv_addrTypoTitle' variant="body1">{shippingfirstname} {shippinglastname}</Typography>
//                         <Typography variant="body2" className='elv_addrTypo'>{street}</Typography>
//                         <Typography variant="body2" className='elv_addrTypo'>{city}-{zip}</Typography>
//                         <Typography variant="body2" className='elv_addrTypo'>{state}</Typography>
//                         <Typography variant="body2" className='elv_addrTypo'>{country}</Typography>
//                         <Typography variant="body2" className='elv_addrTypo'>
//                             Mobile No: {shippingmobile}
//                         </Typography>
//                         <button type='button' className={isdefault == 1 ? 'elv_defualt_addrSelected' : 'elv_defualt_addrSelectedHide'}>Selected</button>
//                     </CardContent>
//                     <div className='elv_editDeleteBtngroup' >
//                         <Button type='button' color='primary' onClick={() => handleOpen(address?.id)}>
//                             <Typography className='elv_editIcon'>update</Typography>
//                         </Button>
//                         {!isdefault == 1 && (
//                             <Button type='button' color='secondary' onClick={() => handleDeleteClick(address?.id)}>
//                                 <MdDelete className='elv_DeleteIcon' />
//                             </Button>
//                         )}
//                     </div>
//                 </Card>
//             </Grid>
//         </>
//     )
// }

// export default AddressCard
