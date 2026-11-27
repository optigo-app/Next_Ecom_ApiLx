"use client";
import React from "react";
import { Box, Grid, Select, MenuItem, Typography } from "@mui/material";
import { LableField, MenuItemSx, SelectSx } from "./CustomField";

/**
 * Shared design-based customization dropdowns (IsDesignBaseWeb = 1).
 * Used by every theme's product detail page so the behaviour lives in one place.
 *
 * onChange(e, type) receives type: "mt" | "dt" | "cs" | "size"; metal colour uses the
 * handleMetalWiseColorImg* callbacks.
 */
const DesignBaseCustomization = ({
  storeInit,
  singleProd,
  metalType,
  metalColor,
  metalColorName = "",
  isCartRestore = false,
  metalTypeCombo,
  metalColorCombo,
  diaQcCombo,
  selectDiaQc,
  csQcCombo,
  selectCsQC,
  SizeSorting,
  SizeCombo,
  sizeData,
  onChange: onDesignChange,
  handleMetalWiseColorImg,
  handleMetalWiseColorImgWithFlag,
  showColorStoneCustomization = true,
  stacked = false,
}) => {
  const fieldSize = stacked ? { xs: 12, sm: 12 } : { xs: 12, sm: 6 };
  const fieldSx = stacked
    ? {
      minWidth: 0,
      p: 1.5,
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      bgcolor: "#fff",
    }
    : undefined;
  const labelSx = stacked
    ? { fontSize: "13px", fontWeight: 600, color: "#475569", mb: 1 }
    : { fontSize: "14px", color: "#666", mb: 0.5 };

  return (
    <Box
      sx={{
        width: "100%",
        mt: stacked ? 0 : 2,
      }}
    >
      <Grid container spacing={2}>
        {metalTypeCombo?.length > 0 &&
          Number(storeInit?.IsMetalCustomization) === 1 && (
            <Grid
              item
              size={fieldSize}
              sx={fieldSx}
            >
              <Typography
                sx={labelSx}
              >
                Metal Type :
              </Typography>

              {Number(singleProd?.IsMrpBase) === 1 && !isCartRestore ? (
                <LableField
                  label={
                    metalTypeCombo?.find(
                      (ele) =>
                        ele?.Metalid == singleProd?.MetalPurityid,
                    )?.metaltype
                  }
                />
              ) : (
                <Select
                  fullWidth
                  value={metalType || ""}
                  onChange={(e) => onDesignChange(e, "mt")}
                  displayEmpty
                  renderValue={(selected) =>
                    selected || metalTypeCombo?.[0]?.metaltype
                  }
                  {...SelectSx}
                >
                  {metalTypeCombo.map((ele) => (
                    <MenuItem
                      key={ele.Metalid}
                      value={ele.metaltype}
                      sx={MenuItemSx}
                    >
                      {ele.metaltype}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
          )}
        {(metalColorCombo?.length > 0 ||
          (isCartRestore && (metalColorName || metalColor))) && (
            <Grid
              item
              size={fieldSize}
              sx={fieldSx}
            >
              <Typography
                sx={labelSx}
              >
                Metal Color :
              </Typography>

              {isCartRestore && !metalColorCombo?.length ? (
                <LableField label={metalColorName || metalColor || "-"} />
              ) : Number(singleProd?.IsMrpBase) === 1 && !isCartRestore ? (
                <LableField
                  label={
                    metalColorCombo?.find(
                      (ele) => ele?.id == singleProd?.MetalColorid,
                    )?.metalcolorname
                  }
                />
              ) : (
                <Select
                  {...SelectSx}
                  fullWidth
                  value={metalColor || ""}
                  onChange={(e) =>
                    Number(storeInit?.IsColorWiseImages) === 1
                      ? handleMetalWiseColorImg(e)
                      : handleMetalWiseColorImgWithFlag(e)
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected)
                      return metalColorCombo?.[0]?.metalcolorname;
                    return (
                      metalColorCombo?.find(
                        (x) => x.colorcode === selected,
                      )?.metalcolorname || ""
                    );
                  }}
                >
                  {metalColorCombo?.map((ele) => (
                    <MenuItem
                      sx={MenuItemSx}
                      key={ele.id}
                      value={ele.colorcode}
                    >
                      {ele.metalcolorname}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
          )}
        {Number(storeInit?.IsDiamondCustomization) === 1 &&
          diaQcCombo?.length > 0 && (
            <Grid
              item
              size={fieldSize}
              sx={fieldSx}
            >
              <Typography
                sx={labelSx}
              >
                Diamond :
              </Typography>

              {Number(singleProd?.IsMrpBase) === 1 ? (
                <LableField label={singleProd?.DiaQuaCol} />
              ) : (
                <Select
                  fullWidth
                  value={selectDiaQc || ""}
                  onChange={(e) => onDesignChange(e, "dt")}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      const d = diaQcCombo?.[0];
                      return `${d?.Quality},${d?.color}`;
                    }
                    return selected;
                  }}
                  {...SelectSx}
                >
                  {diaQcCombo?.map((ele) => (
                    <MenuItem
                      sx={MenuItemSx}
                      key={ele.QualityId}
                      value={`${ele.Quality},${ele.color}`}
                    >
                      {`${ele.Quality},${ele.color}`}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
          )}
        {showColorStoneCustomization &&
          Number(storeInit?.IsCsCustomization) === 1 &&
          csQcCombo?.length > 0 && (
            <Grid
              item
              size={fieldSize}
              sx={fieldSx}
            >
              <Typography
                sx={labelSx}
              >
                Color Stone :
              </Typography>

              {Number(singleProd?.IsMrpBase) === 1 ? (
                <LableField label={singleProd?.CsQuaCol} />
              ) : (
                <Select
                  fullWidth
                  value={selectCsQC || ""}
                  onChange={(e) => onDesignChange(e, "cs")}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      const cs = csQcCombo?.[0];
                      return `${cs?.Quality},${cs?.color}`;
                    }
                    return selected;
                  }}
                  {...SelectSx}
                >
                  {csQcCombo?.map((ele) => (
                    <MenuItem
                      sx={MenuItemSx}
                      key={ele.QualityId}
                      value={`${ele.Quality},${ele.color}`}
                    >
                      {`${ele.Quality}#${ele.color}`}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>
          )}
        {SizeSorting?.length > 0 && (
          <Grid
            item
            size={fieldSize}
            sx={fieldSx}
          >
            <Typography sx={labelSx}>
              Size :
            </Typography>

            {Number(singleProd?.IsMrpBase) === 1 ? (
              <LableField label={singleProd?.DefaultSize} />
            ) : (
              <Select
                fullWidth
                value={sizeData || ""}
                onChange={(e) => onDesignChange(e, "size")}
                displayEmpty
                renderValue={(selected) => selected || SizeCombo?.rd?.[0]?.sizename}
                {...SelectSx}
              >
                {SizeCombo?.rd?.map(ele => (
                  <MenuItem sx={MenuItemSx} key={ele.id} value={ele.sizename}>
                    {ele.sizename}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DesignBaseCustomization;
