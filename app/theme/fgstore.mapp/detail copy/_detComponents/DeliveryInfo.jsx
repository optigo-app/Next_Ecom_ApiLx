import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CiDeliveryTruck } from "react-icons/ci";

const DeliveryInfo = ({ singleProd }) => {
  if(singleProd?.InStockDays === 0 || singleProd?.MakeOrderDays === 0){
    return ;
  }
  return (
    <Box
      sx={{
        mt: 2,
        p: 1.5,
        borderRadius: "12px",
        background: "#fafafa" ,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <Stack spacing={1}>
        
        {singleProd?.InStockDays !== 0 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CiDeliveryTruck size={20} />
            <Typography sx={{ fontSize: "0.85rem" }}>
              Express Shipping — Delivery in {singleProd?.InStockDays} days
            </Typography>
          </Stack>
        )}

        {singleProd?.MakeOrderDays !== 0 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CiDeliveryTruck size={20} />
            <Typography sx={{ fontSize: "0.85rem" }}>
              Made to Order — Delivery in {singleProd?.MakeOrderDays} days
            </Typography>
          </Stack>
        )}

      </Stack>
    </Box>
  );
};

export default DeliveryInfo;
