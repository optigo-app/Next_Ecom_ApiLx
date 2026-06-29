import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { motion } from "framer-motion";

const MotionIconButton = motion(IconButton);

const QuantitySelector = ({ selectedItem, handleIncrement, handleDecrement }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={0.2}
      sx={{
        p: 0.5,
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.12)",
        backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.7)",
      }}
    >
      {/* Decrement */}
      <MotionIconButton
        whileTap={{ scale: 0.85 }}
        onClick={() => handleDecrement(selectedItem)}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: "rgba(0,0,0,0.05)",
          "&:hover": { background: "rgba(0,0,0,0.08)" }
        }}
      >
        <RemoveRoundedIcon fontSize="small" />
      </MotionIconButton>

      {/* Quantity Display */}
      <TextField
        value={selectedItem?.Quantity}
        inputProps={{
          readOnly: true,
          style: {
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 600,
            width: "50px",
          },
        }}
        variant="standard"
        sx={{
          "& .MuiInput-root:before, & .MuiInput-root:after": {
            display: "none",
          },
        }}
      />

      {/* Increment */}
      <MotionIconButton
        whileTap={{ scale: 0.85 }}
        onClick={() => handleIncrement(selectedItem)}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: "rgba(0,0,0,0.05)",
          "&:hover": { background: "rgba(0,0,0,0.08)" }
        }}
      >
        <AddRoundedIcon fontSize="small" />
      </MotionIconButton>
    </Box>
  );
};

export default QuantitySelector;

// import React, { useState } from 'react';
// import './elv_cartPage.scss';

// const QuantitySelector = ({ selectedItem, qtyCount, handleIncrement, handleDecrement, }) => {

//   return (
//     <div className="elv_cart-quantity">
//       <button className="elv_bttn elv_bttn-left" onClick={() => handleDecrement(selectedItem)}>
//         <span>-</span>
//       </button>
//       <input
//         type="number"
//         className="elv_input"
//         id="input"
//         defaultValue={selectedItem?.Quantity}
//         value={selectedItem?.Quantity}
//         readOnly
//       />
//       <button className="elv_bttn elv_bttn-right" onClick={() => handleIncrement(selectedItem)}>
//         <span>+</span>
//       </button>
//     </div>
//   );
// };

// export default QuantitySelector;
