import { Box, Paper, Typography, Checkbox, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, alpha, useMediaQuery, useTheme } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";


const NewStockitems = ({ stockItemArr, storeInit, loginInfo, cartArr, handleCartandWish, check }) => {

  const WeightDisplay = ({ ele }) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
      {storeInit?.IsGrossWeight == 1 && Number(ele?.GrossWt) !== 0 && (
        <Chip
          label={`GWT: ${ele?.GrossWt?.toFixed(3)}`}
          size="small"
          variant="outlined"
          color="default"
          sx={{
            fontWeight: 500,
            fontSize: "0.60rem",
          }}
        />
      )}

      {Number(ele?.NetWt) !== 0 && (
        <Chip
          label={`NWT: ${ele?.NetWt?.toFixed(3)}`}
          size="small"
          variant="outlined"
          color="default"
          sx={{
            fontWeight: 500,
            fontSize: "0.60rem",
          }}
        />
      )}

      {storeInit?.IsDiamondWeight == 1 && Number(ele?.DiaWt) !== 0 && (
        <Chip
          label={`DWT: ${ele?.DiaWt?.toFixed(3)}${storeInit?.IsDiamondPcs === 1 ? `/${ele?.DiaPcs}` : ""}`}
          size="small"
          variant="outlined"
          color="default"
          sx={{
            fontWeight: 500,
            fontSize: "0.60rem",
          }}
        />
      )}

      {storeInit?.IsStoneWeight == 1 && Number(ele?.CsWt) !== 0 && (
        <Chip
          label={`CWT: ${ele?.CsWt?.toFixed(3)}${storeInit?.IsStonePcs === 1 ? `/${ele?.CsPcs}` : ""}`}
          size="small"
          variant="outlined"
          color="default"
          sx={{
            fontWeight: 500,
            fontSize: "0.60rem",
          }}
        />
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        mt: 8,
        width: {
          lg: "60%",
          md: "70%",
          sm: "100%",
          xs: "100%",
        },
        mx: "auto",
        BoxSizing: "border-box",
      }}
    >
      <Paper elevation={0}
      sx={{
        px: 2
      }}
      >
        <Box sx={{ mb: 2, textAlign: "center", width: "100%",
         }}>
          <Typography
            variant="h5"
            sx={{
            fontSize: "30px",
            letterSpacing: 1,
            mb: 1 ,
            px:1.5,
            mt:3 ,
            color: "rgb(125, 127, 133)",  
            textAlign :'center'
            }}
          >
            Stock Items
          </Typography>
          {/* <Divider sx={{ mt: 1.5, borderColor: "#e0e0e0" }} /> */}
        </Box>

        <TableContainer
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "auto",
            maxHeight: 420,
            scrollbarWidth: "thin",
            backgroundColor: "#fff",
          }}
        >
          <Table sx={{}}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha("#667eea", 0.05),
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    color: "#616161", fontSize: "0.75rem"
                  }}
                >
                  Sr No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    color: "#616161", fontSize: "0.75rem"
                  }}
                >
                  Design No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    color: "#616161", fontSize: "0.75rem"
                  }}
                >
                  Job No
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    color: "#616161", fontSize: "0.75rem"
                  }}
                >
                  Weights
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    color: "#616161", fontSize: "0.75rem"
                  }}
                >
                  Metal Color-Purity
                </TableCell>
                {check && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      color: "#616161", fontSize: "0.75rem"
                    }}
                  >
                    Price
                  </TableCell>
                )}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    color: "#616161", fontSize: "0.75rem"
                  }}
                >
                  Add To Cart
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockItemArr?.map((ele, i) => (
                <TableRow
                  key={i}
                  sx={{
                    height: 24,
                    "& th, & td": {
                      py: 1,
                    },
                    "&:hover": {
                      backgroundColor: alpha("#667eea", 0.03),
                    },
                    transition: "background-color 0.2s",
                    "& th": {
                      py: 1.2,
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #e5e7eb",
                    },
                  }}
                >
                  <TableCell sx={{ color: "#424242", height: 34, py: 1, fontSize: "0.875rem", fontWeight: 500 }}>{ele?.SrNo}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#424242", height: 34, py: 1, fontSize: "0.875rem" }}>{ele?.designno}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#424242", height: 34, py: 1, fontSize: "0.875rem" }}>{ele?.StockBarcode}</TableCell>
                  <TableCell>
                    <WeightDisplay ele={ele} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#424242", height: 34, py: 1, fontSize: "0.875rem" }}>
                    {ele?.MetalColorName}-{ele?.metaltypename}
                    {ele?.metalPurity}
                  </TableCell>
                  {check && (
                    <TableCell sx={{ fontWeight: 500, color: "#424242", height: 34, py: 1, fontSize: "0.875rem" }}>
                      <Typography variant="body1" fontWeight={700} color="gray">
                        {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode} {formatter(ele?.Amount)}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Checkbox
                      icon={<LocalMallOutlinedIcon sx={{ fontSize: 21, color: "text.secondary" }} />}
                      checkedIcon={<LocalMallIcon sx={{ fontSize: 21, color: "success.main" }} />}
                      onChange={(e) => handleCartandWish(e, ele, "Cart")}
                      checked={cartArr[ele?.StockId] ?? ele?.IsInCart === 1 ? true : false}
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#2e7d32", 0.08),
                        },
                      }}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default NewStockitems;
