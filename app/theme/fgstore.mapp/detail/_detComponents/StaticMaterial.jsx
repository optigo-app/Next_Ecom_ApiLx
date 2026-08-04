import React from "react";
import { Card, Box, Typography, Stack, Divider } from "@mui/material";

const StaticMaterial = ({
  singleProd,
  singleProd1,
  selectMtType,
  selectMtColor,
  selectDiaQc,
  storeInit,
  diaQcCombo,
  diaList
}) => {
  const prod = Object.keys(singleProd1).length > 0 ? singleProd1 : singleProd;

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        width: '100%',
        mt: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: "4px",
          border: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          p: 2,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: 0.8,
            color: "#102a43",
            textTransform: "uppercase",
            mb: 1,
            textAlign: "left",
          }}
        >
          Material Details
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {/* Details */}
        <Stack spacing={1}>
          {singleProd?.designno && (
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>
                Design No
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>
                {singleProd?.designno}
              </Typography>
            </Stack>
          )}

          {selectMtType && (
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>
                Metal Purity
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>
                {selectMtType}
              </Typography>
            </Stack>
          )}

          {selectMtColor && (
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>
                Metal Color
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>
                {selectMtColor}
              </Typography>
            </Stack>
          )}

          {storeInit?.IsDiamondCustomization === 1 &&
            diaQcCombo?.length > 0 &&
            diaList?.length > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>
                  Diamond Quality
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>
                  {selectDiaQc}
                </Typography>
              </Stack>
            )}

          {storeInit?.IsMetalWeight === 1 && prod?.Nwt && (
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#627d98", fontSize: "13px", fontWeight: 500 }}>
                Net Wt
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#102a43" }}>
                {prod?.Nwt?.toFixed(3)} g
              </Typography>
            </Stack>
          )}
        </Stack>
      </Card>
    </Box>
  );
};

export default StaticMaterial;
