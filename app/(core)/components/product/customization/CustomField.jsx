import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

export const MenuItemSx = {
  borderRadius: "0",
  mx: "0px !important",
  my: "0px !important",
  py: "0px !important",
  px: "0px !important",
  py: 1.2,
  px: 1.6,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&.Mui-selected": {
    backgroundColor: "#eef1f5 !important",
  },
  "&:hover": {
    background: "#f3f4f6",
  },
  fontSize: "15px",
}

export const SelectSx = {
  sx: {
    height: 42,
    borderRadius: "1px !important",
    background: "#fff",
    fontSize: "15px",
    fontWeight: 500,
    px: 0,
    "& fieldset": {
      border: "1px solid #e4e6eb !important",
    },
    "&:hover fieldset": {
      border: "1px solid #000 !important",
    }
  },
  MenuProps: {
    PaperProps: {
      sx: {
        mx: "0px !important",
        my: "0px !important",
        borderRadius: "0 !important",
        boxShadow:
          "0px 12px 32px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.06)",
        px: "0px !important",
        py: "0px !important",
        pt: '0px !important',
        maxHeight: "240px",   // fixed height
        overflowY: "auto",    // scroll when many items
        mt: "5px !important",
      },
    },
  }
}

export const LableField = ({ label }) => {
  return <>
    <Box sx={{
      height: 42,
      borderRadius: "1px !important",
      background: "#fff",
      px: 0,
      border: "1px solid #e4e6eb !important",
      "&:hover": {
        border: "1px solid #000 !important",
      },
      display: "flex",
      alignItems: "center",
      px: 1.5
    }} >
      <Typography sx={{
        fontSize: "15px",
        fontWeight: 500
      }} >
        {label}
      </Typography>
    </Box>
  </>
}