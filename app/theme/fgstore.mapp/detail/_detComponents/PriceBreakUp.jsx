import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const getCost = (val) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

const PriceBreakup = ({
  storeInit,
  singleProd,
  singleProd1,
  loginInfo,
  Currency
}) => {
  const prod = (singleProd1 && Object.keys(singleProd1).length > 0)
    ? singleProd1
    : (singleProd && Object.keys(singleProd).length > 0 ? singleProd : {});

  const currencySymbol = Currency || storeInit?.CurrencyCode || loginInfo?.CurrencyCode || "INR";

  const metalCost = getCost(prod?.Metal_Cost ?? prod?.TotalMetalCost ?? prod?.totalmetalCost);
  const diamondCost = getCost(prod?.Diamond_Cost ?? prod?.TotalDiamondCost ?? prod?.totaldiamondCost);
  const stoneCost = getCost(prod?.ColorStone_Cost ?? prod?.TotalColorStoneCost ?? prod?.totalColorStoneCost);
  const miscCost = getCost(prod?.Misc_Cost ?? prod?.TotalMiscCost ?? prod?.totalMiscCost);
  const labourCost = getCost(prod?.Labour_Cost ?? prod?.TotalMakingCost ?? prod?.totalMakingCost ?? prod?.Making_Cost);
  const otherCost = getCost(prod?.Other_Cost ?? prod?.TotalOtherCost ?? prod?.totalOtherCost) +
    getCost(prod?.Size_MarkUp) +
    getCost(prod?.DesignMarkUpAmount) +
    getCost(prod?.ColorStone_SettingCost) +
    getCost(prod?.Diamond_SettingCost) +
    getCost(prod?.Misc_SettingCost);

  const priceBreakupItems = [
    { label: "Metal", cost: metalCost },
    { label: "Diamond", cost: diamondCost },
    { label: "Stone", cost: stoneCost },
    { label: "MISC", cost: miscCost },
    { label: "Labour", cost: labourCost },
    { label: "Other", cost: otherCost },
  ].filter(item => item.cost > 0);

  if (
    storeInit?.IsPriceShow === 0 ||
    storeInit?.IsPriceBreakUp === 0 ||
    prod?.IsMrpBase === 1 ||
    priceBreakupItems.length === 0
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        width: '100%',
        mt: 2,
      }}
    >
      <TableContainer
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#627d98",
                  fontSize: "11px",
                  py: 1,
                  px: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Component
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: "#627d98",
                  fontSize: "11px",
                  py: 1,
                  px: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {priceBreakupItems.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: "12.5px",
                    color: "#333333",
                    py: 1,
                    px: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {item.label}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#102a43",
                    py: 1,
                    px: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {currencySymbol} {formatter(item.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PriceBreakup;