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
  return (
<>
    <Box
    sx={{
        boxSizing:'border-box',
        width:'100%',
    }}
    >

    <Card
      sx={{
        mt: 3,
        borderRadius: 2,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        p:1
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: 1,
          mb: 1
        }}
      >
        MATERIAL DETAILS
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      {/* Details */}
      <Stack spacing={0.8}>

        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "#666", fontSize: "13px" }}>
            Design No
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
            {singleProd?.designno}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "#666", fontSize: "13px" }}>
            Metal Purity
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
            {selectMtType}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "#666", fontSize: "13px" }}>
            Metal Color
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
            {selectMtColor}
          </Typography>
        </Stack>

        {storeInit?.IsDiamondCustomization === 1 &&
          diaQcCombo?.length > 0 &&
          diaList?.length && (
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#666", fontSize: "13px" }}>
                Diamond Quality
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
                {selectDiaQc}
              </Typography>
            </Stack>
          )}

        {storeInit?.IsMetalWeight === 1 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: "#666", fontSize: "13px" }}>
              Net Wt
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
              {singleProd1?.Nwt ?? singleProd?.Nwt?.toFixed(3)}
            </Typography>
          </Stack>
        )}

      </Stack>
    </Card>
    </Box>

</>
  );
};

export default StaticMaterial;
