"use client";

import React from "react";
import { Grid, Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const AddressCard = ({ address, handleOpen, handleDeleteClick, handleDefaultSelection }) => {
  const {
    shippingfirstname,
    shippinglastname,
    street,
    city,
    state,
    country,
    zip,
    shippingmobile,
    isdefault
  } = address;

  return (
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} >
      <Card
        onClick={() => handleDefaultSelection(address)}
        sx={{
          borderRadius: 2,
          cursor: "pointer",
          border: isdefault ? "2px solid #635bff" : "1px solid #e5e5e5",
          transition: "all .2s ease",
          "&:hover": {
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          
          {/* Top Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1
            }}
          >
            {/* Left Selection + Address */}
            <Box sx={{ display: "flex", gap: 1.2 }}>
              
              {/* Radio */}
              <Box sx={{ mt: "3px" }}>
                {isdefault ? (
                  <CheckCircleIcon sx={{ color: "#635bff", fontSize: 20 }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: "#aaa" }} />
                )}
              </Box>

              {/* Address Content */}
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    lineHeight: 1.3,
                    wordBreak: "break-word"
                  }}
                >
                  {shippingfirstname} {shippinglastname}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#666",
                    lineHeight: 1.4,
                    wordBreak: "break-word"
                  }}
                >
                  {street}
                </Typography>

                <Typography sx={{ fontSize: 13, color: "#666" }}>
                  {city} {zip}
                </Typography>

                <Typography sx={{ fontSize: 13, color: "#666" }}>
                  {state}, {country}
                </Typography>

                <Typography sx={{ fontSize: 13, mt: 0.5 }}>
                  {shippingmobile}
                </Typography>
              </Box>
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(address?.id);
                }}
              >
                <MdModeEditOutline />
              </IconButton>

              {isdefault !== 1 && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(address?.id);
                  }}
                >
                  <MdDelete />
                </IconButton>
              )}
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Grid>
  );
};

export default AddressCard;

// "use client";

// import React, { useState } from 'react';
// import { Grid, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
// import { MdModeEditOutline } from "react-icons/md";
// import { MdDelete } from "react-icons/md";

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


//     // const [showButtons, setShowButtons] = useState(false);

//     // const handleMouseEnter = () => {
//     //     setShowButtons(true);
//     // };

//     // const handleMouseLeave = () => {
//     //     setShowButtons(false);
//     // };

//     return (
//         <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} style={{ marginBottom: '20px' }}>
//             <Card
//                 // onMouseEnter={handleMouseEnter}
//                 // onMouseLeave={handleMouseLeave}
//                 className={isdefault == 1 ? 'smr_ActiveAddrCard' : 'smr_AddrCard'}
//                 style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

//                 <CardContent onClick={() => handleDefaultSelection(address)} style={{ flex: '1 0 auto' }}>
//                     <Typography className='smr_addrTypoTitle' variant="h5" component="h2">
//                         {shippingfirstname} {shippinglastname}
//                     </Typography>
//                     <Typography className='smr_addrTypo'>{street}</Typography>
//                     <Typography className='smr_addrTypo'>{city}-{zip}</Typography>
//                     <Typography className='smr_addrTypo'>{state}</Typography>
//                     <Typography className='smr_addrTypo'>{country}</Typography>
//                     <Typography className='smr_addrTypo'>
//                         Mobile No: {shippingmobile}
//                     </Typography>
//                     <button type='button' className={isdefault == 1 ? 'smr_defualt_addrSelected' : 'smr_defualt_addrSelectedHide'}>Selected</button>
//                 </CardContent>

//                 {/* {showButtons && ( */}
//                 <div className='smr_editDeleteBtngroup' >
//                     <Button type='button' color='primary' onClick={() => handleOpen(address?.id)}>
//                         <MdModeEditOutline className='smr_editIcon' />
//                     </Button>
//                     {isdefault != 1 &&
//                         <Button type='button' color='secondary' onClick={() => handleDeleteClick(address?.id)}>
//                             <MdDelete className='smr_DeleteIcon' />
//                         </Button>
//                     }
//                 </div>
//                 {/* )} */}
//             </Card>
//         </Grid>
//     );
// };

// export default AddressCard;

