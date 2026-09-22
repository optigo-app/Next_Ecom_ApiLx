import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import "./elv_cartPage.scss";
import { Button, Divider, Skeleton, Grid, Typography, MenuItem, Select, Box } from "@mui/material";
import QuantitySelector from "./QuantitySelector";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { toast } from "react-toastify";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { SelectSx, LableField as LabelField, MenuItemSx } from "./New/CustomComponent";
import React, { useEffect, useState } from "react";

const Customization = ({ ispriceloding, selectedItem, qtyCount, handleIncrement, handleDecrement, sizeCombo, CurrencyData, mrpbasedPriceFlag, handleMetalTypeChange, handleMetalColorChange, handleDiamondChange, handleColorStoneChange, handleSizeChange, decodeEntities, onUpdateCart }) => {
  const { storeInit, loginUserDetail } = useStore();
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);

  useEffect(() => {
    const metalTypeData = getSession("metalTypeCombo");
    const metalColorData = getSession("MetalColorCombo");
    const diamondQtyColorData = getSession("diamondQualityColorCombo");
    const CSQtyColorData = getSession("ColorStoneQualityColorCombo");
    setMetalTypeCombo(metalTypeData);
    setMetalColorCombo(metalColorData);
    setDiamondQualityColorCombo(diamondQtyColorData);
    setColorStoneCombo(CSQtyColorData);
  }, []);

  const SizeSorting = (SizeArr) => {
    let SizeSorted = SizeArr?.sort((a, b) => {
      const nameA = parseInt(a?.sizename?.toUpperCase()?.slice(0, -2), 10);
      const nameB = parseInt(b?.sizename?.toUpperCase()?.slice(0, -2), 10);

      return nameA - nameB;
    });

    return SizeSorted;
  };

  const loginInfo = loginUserDetail;

  const handleUpdateCart = async (selectedItem) => {
    const resUpdate = await onUpdateCart(selectedItem);
    if (resUpdate?.msg == "success") {
      toast.success("Cart Updated Successfully", {
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      {selectedItem?.StockId == 0 && selectedItem?.IsMrpBase == 0 ? (
        <div className="elv_Cart_R-details">
          {/* <p className='elv_cart-Titleline'>{selectedItem?.TitleLine}</p> */}
          {storeInit?.IsProductWebCustomization == 1 && (
            <div className="elv_Cart-options">
              {storeInit?.IsMetalCustomization == 1 && (
                <div className="elv_option">
                  <label htmlFor="metal-type">Metal Type:</label>
                  <select id="metal-type" name={selectedItem?.id} value={selectedItem?.metaltypename} onChange={handleMetalTypeChange}>
                    {selectedItem?.StockId != 0 ? (
                      <option value={selectedItem?.metaltypename}>{selectedItem?.metaltypename}</option>
                    ) : (
                      <>
                        {metalTypeCombo?.map((option) => (
                          <option key={option.Metalid} value={option.metaltypename}>
                            {option.metaltype}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              )}
              {storeInit?.IsMetalCustomization == 1 && (
                <div className="elv_option">
                  <label htmlFor="metal-color">Metal Color:</label>
                  <select id="metal-color" name={selectedItem?.id} value={selectedItem?.metalcolorname} onChange={handleMetalColorChange}>
                    {selectedItem?.StockId != 0 ? (
                      <option value={selectedItem?.metalcolorname}>{selectedItem?.metalcolorname}</option>
                    ) : (
                      <>
                        {metalColorCombo?.map((option) => (
                          <option key={option.id} value={option.colorname}>
                            {" "}
                            {option.colorname}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              )}
              {storeInit?.IsDiamondCustomization == 1 && (
                <>
                  {(selectedItem?.Dwt != "0" || selectedItem?.Dpcs != "0") && (
                    <div className="elv_option">
                      <label htmlFor="diamond">Diamond:</label>
                      <select id="diamond" name={selectedItem?.id} value={selectedItem?.diamondquality + "," + selectedItem?.diamondcolor} onChange={handleDiamondChange}>
                        {selectedItem?.StockId != 0 ? (
                          <option value={selectedItem?.diamondquality + "," + selectedItem?.diamondcolor}>{selectedItem?.diamondquality?.replace(/,/g, " - ") + "," + selectedItem?.diamondcolor}</option>
                        ) : (
                          <>
                            {diamondQualityColorCombo?.map((option) => (
                              <option key={option?.ColorId + "," + option?.QualityId} value={option?.Quality + "," + option?.color}>
                                {" "}
                                {option?.Quality + "," + option?.color}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </>
              )}

              {storeInit?.IsCsCustomization == 1 && (
                <>
                  {(selectedItem?.CSwt != "0" || selectedItem?.CSpcs != "0") && (
                    <div className="elv_option">
                      <label htmlFor="diamond">Color Stone:</label>
                      <select id="diamond" name={selectedItem?.id} value={selectedItem?.colorstonequality + "," + selectedItem?.colorstonecolor} onChange={handleColorStoneChange}>
                        {selectedItem?.StockId != 0 ? (
                          <option value={selectedItem?.colorstonequality + "," + selectedItem?.colorstonecolor}>{selectedItem?.colorstonequality + "," + selectedItem?.colorstonecolor}</option>
                        ) : (
                          <>
                            {ColorStoneCombo?.map((option) => (
                              <option key={option?.ColorId + "," + option?.QualityId} value={option?.Quality + "," + option?.color}>
                                {option?.Quality + "," + option?.color}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </>
              )}

              {sizeCombo?.rd?.length !== 0 && (
                <div className="elv_option">
                  <label htmlFor="size">Size:</label>
                  <select id="size" name={selectedItem?.id} defaultValue={selectedItem?.Size} value={selectedItem?.Size} onChange={handleSizeChange}>
                    {selectedItem?.StockId != 0 ? (
                      <option value={selectedItem?.size}>{selectedItem?.size}</option>
                    ) : (
                      <>
                        {sizeCombo?.rd?.map((option) => (
                          <option key={option?.id} value={option?.sizename}>
                            {option?.sizename}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="elv_cartQtyPricemainDev">
            <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
            {storeInit?.IsPriceShow == 1 && (
              <div className="elv_product-price">
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <span
                    className="elv_currencyFont"
                    dangerouslySetInnerHTML={{
                      __html: decodeEntities(loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode),
                    }}
                  />
                  {ispriceloding ? <Skeleton className="elv_CartSkelton" variant="text" width="80%" animation="wave" /> : formatter(selectedItem?.FinalCost)}
                </span>
              </div>
            )}
          </div>
          <div className="elv_UpdateCartBtn">
            <Button
              variant="contained"
              onClick={() => handleUpdateCart(selectedItem)}
              sx={{
                px: 4,
                fontSize: "0.95rem",
                fontWeight: 600,
                borderRadius: "12px",
                background: "#fff",
                backdropFilter: "blur(8px)",
                color: "#111",
                textTransform: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                },
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="elv_Cart_R-details_1">
            {/* The main container for the product details */}

            <Box sx={{ width: "100%", padding: 0 }}>
              {/* ======================================= */}
              {/* SECTION 1: DETAILS GRID (2x2 Layout)    */}
              {/* ======================================= */}
              <Grid container spacing={2}>
                {/* 1. Metal Type */}
                {selectedItem?.metaltypename !== "" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: "bold", mb: 0.5, display: "block", textTransform: "uppercase", color: "#7d7d7d" }}>
                      Metal Type:
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        backgroundColor: "#fff",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedItem?.metaltypename}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* 2. Metal Color */}
                {selectedItem?.metaltypename !== "" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: "bold", mb: 0.5, display: "block", textTransform: "uppercase", color: "#7d7d7d" }}>
                      Metal Color:
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        backgroundColor: "#fff",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedItem?.metalcolorname}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* 3. Diamond */}
                {(selectedItem?.Dwt != "0" || selectedItem?.Dpcs != "0") && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: "bold", mb: 0.5, display: "block", textTransform: "uppercase", color: "#7d7d7d" }}>
                      Diamond:
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        backgroundColor: "#fff",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedItem?.diamondqualityname?.replace(/,/g, " - ") + "," + selectedItem?.diamondcolorname}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* 4. Color Stone */}
                {(selectedItem?.CSwt != "0" || selectedItem?.CSpcs != "0") && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: "bold", mb: 0.5, display: "block", textTransform: "uppercase", color: "#7d7d7d" }}>
                      Color Stone:
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        backgroundColor: "#fff",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedItem?.colorstonequality + "," + selectedItem?.colorstonecolor}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* 5. Size (If available) */}
                {selectedItem?.Size !== "" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: "bold", mb: 0.5, display: "block", textTransform: "uppercase", color: "#7d7d7d" }}>
                      Size:
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        backgroundColor: "#fff",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedItem?.Size}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* ======================================= */}
              {/* SECTION 2: QTY, PRICE & ACTIONS         */}
              {/* ======================================= */}
              <Grid container spacing={2} alignItems="center">
                {/* Quantity */}
                <Grid item xs={6} sm={4}>
                  {selectedItem?.IsMrpBase === 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Qty:
                      </Typography>
                      <Typography variant="body1">{selectedItem?.Quantity}</Typography>
                    </Box>
                  ) : (
                    <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
                  )}
                </Grid>

                {/* Price */}
                {storeInit?.IsPriceShow === 1 && (
                  <Grid item xs={6} sm={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <span
                        className="elv_currencyFont"
                        style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                        dangerouslySetInnerHTML={{
                          __html: decodeEntities(loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode),
                        }}
                      />
                      {ispriceloding ? (
                        <Skeleton variant="rounded" width={100} height={30} sx={{ ml: 1 }} />
                      ) : (
                        <Typography variant="h6" sx={{ fontWeight: "bold", ml: 0.5 }}>
                          {formatter(selectedItem?.FinalCost)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}

                {/* Apply Button */}
                {selectedItem?.IsMrpBase === 1 && (
                  <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateCart(selectedItem)}
                      sx={{
                        borderRadius: "20px",
                        padding: "6px 30px",
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "none",
                        backgroundColor: "#000", // Change to your brand color
                        "&:hover": { backgroundColor: "#333" },
                      }}
                    >
                      Apply
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </div>
        </>
      )}
    </>
  );
};

export default Customization;

//           {storeInitData?.IsProductWebCustomization == 1 && (
//   <Grid container spacing={2} sx={{ mt: 1 }}>

//     {/* METAL TYPE */}
//     {storeInitData?.IsMetalCustomization == 1 && (
//       <Grid item xs={12} sm={6}>
//         {selectedItem?.StockId != 0 ? (
//           <LabelField
//             label="Metal Type"
//             value={selectedItem?.metaltypename}
//           />
//         ) : (
//           <>
//             <Typography sx={{ fontSize: 14, color: "#666", mb: 0.5 }}>
//               Metal Type :
//             </Typography>

//             <Select
//               fullWidth
//               value={selectedItem?.metaltypename || ""}
//               onChange={handleMetalTypeChange}
//               {...SelectSx}
//             >
//               {metalTypeCombo?.map(option => (
//                 <MenuItem key={option.Metalid} value={option.metaltypename} sx={MenuItemSx}>
//                   {option.metaltypename}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         )}
//       </Grid>
//     )}

//     {/* METAL COLOR */}
//     {storeInitData?.IsMetalCustomization == 1 && (
//       <Grid item xs={12} sm={6}>
//         {selectedItem?.StockId != 0 ? (
//           <LabelField
//             label="Metal Color"
//             value={selectedItem?.metalcolorname}
//           />
//         ) : (
//           <>
//             <Typography sx={{ fontSize: 14, color: "#666", mb: 0.5 }}>
//               Metal Color :
//             </Typography>

//             <Select
//               fullWidth
//               value={selectedItem?.metalcolorname || ""}
//               onChange={handleMetalColorChange}
//               {...SelectSx}
//             >
//               {metalColorCombo?.map(option => (
//                 <MenuItem key={option.id} value={option.colorname} sx={MenuItemSx}>
//                   {option.colorname}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         )}
//       </Grid>
//     )}

//     {/* DIAMOND */}
//     {storeInitData?.IsDiamondCustomization == 1 &&
//       (selectedItem?.Dwt !== "0" || selectedItem?.Dpcs !== "0") && (
//         <Grid item xs={12} sm={6}>
//           {selectedItem?.StockId != 0 ? (
//             <LabelField
//               label="Diamond"
//               value={
//                 selectedItem?.diamondquality.replace(/,/g, " - ") +
//                 " , " +
//                 selectedItem?.diamondcolor
//               }
//             />
//           ) : (
//             <>
//               <Typography sx={{ fontSize: 14, color: "#666", mb: 0.5 }}>
//                 Diamond :
//               </Typography>

//               <Select
//                 fullWidth
//                 value={`${selectedItem?.diamondquality || ""},${selectedItem?.diamondcolor || ""}`}
//                 onChange={handleDiamondChange}
//                 {...SelectSx}
//               >
//                 {diamondQualityColorCombo?.map(option => (
//                   <MenuItem
//                     key={`${option.ColorId}-${option.QualityId}`}
//                     value={`${option.Quality},${option.color}`}
//                     sx={MenuItemSx}
//                   >
//                     {option.Quality + " , " + option.color}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </>
//           )}
//         </Grid>
//       )}

//     {/* COLOR STONE */}
//     {storeInitData?.IsCsCustomization == 1 &&
//       (selectedItem?.CSwt !== "0" || selectedItem?.CSpcs !== "0") && (
//         <Grid item xs={12} sm={6}>
//           {selectedItem?.StockId != 0 ? (
//             <LabelField
//               label="Color Stone"
//               value={`${selectedItem?.colorstonequality},${selectedItem?.colorstonecolor}`}
//             />
//           ) : (
//             <>
//               <Typography sx={{ fontSize: 14, color: "#666", mb: 0.5 }}>
//                 Color Stone :
//               </Typography>

//               <Select
//                 fullWidth
//                 value={`${selectedItem?.colorstonequality || ""},${selectedItem?.colorstonecolor || ""}`}
//                 onChange={handleColorStoneChange}
//                 {...SelectSx}
//               >
//                 {ColorStoneCombo?.map(option => (
//                   <MenuItem
//                     key={`${option.ColorId}-${option.QualityId}`}
//                     value={`${option.Quality},${option.color}`}
//                     sx={MenuItemSx}
//                   >
//                     {option.Quality + " , " + option.color}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </>
//           )}
//         </Grid>
//       )}

//     {/* SIZE */}
//     {sizeCombo?.rd?.length > 0 && (
//       <Grid item xs={12} sm={6}>
//         {selectedItem?.StockId != 0 ? (
//           <LabelField label="Size" value={selectedItem?.Size} />
//         ) : (
//           <>
//             <Typography sx={{ fontSize: 14, color: "#666", mb: 0.5 }}>
//               Size :
//             </Typography>

//             <Select
//               fullWidth
//               value={selectedItem?.Size || ""}
//               onChange={handleSizeChange}
//               {...SelectSx}
//             >
//               {sizeCombo?.rd?.map(option => (
//                 <MenuItem key={option.id} value={option.sizename} sx={MenuItemSx}>
//                   {option.sizename}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         )}
//       </Grid>
//     )}

//   </Grid>
// )}

//  <!-- <div className="elv_Cart_R-details_1">
//             {/* <p className='elv_cart-Titleline'>{selectedItem?.TitleLine}</p>
//             <Divider /> */}
//             <div className="elv_StockCart-options">
//               <div className='elv_stock_1'>
//                 {selectedItem?.metaltypename != "" &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="metal-type">Metal Type:&nbsp;</label>
//                     <span>{selectedItem?.metaltypename}</span>
//                   </div>
//                 }
//                 {selectedItem?.metaltypename != "" &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="metal-color">Metal Color:&nbsp;</label>
//                     <span>{selectedItem?.metalcolorname}</span>
//                   </div>
//                 }
//                 {(selectedItem?.Dwt != "0" || selectedItem?.Dpcs != "0") &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="diamond">Diamond:&nbsp;</label>
//                     <span>{(selectedItem?.diamondqualityname)?.replace(/,/g, ' - ') + ',' + selectedItem?.diamondcolorname}</span>
//                   </div>
//                 }
//                 {(selectedItem?.CSwt != "0" || selectedItem?.CSpcs != "0") &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="diamond">Color Stone:&nbsp;</label>
//                     <span>{selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor}</span>
//                   </div>
//                 }
//                 {selectedItem?.Size != "" &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="size">Size:&nbsp;</label>
//                     <span>{selectedItem?.Size}</span>
//                   </div>
//                 }
//                 <div className='elv_stock_2'>
//                 </div>
//               </div>
//               <div className='elv_stock_3'>
//                 {selectedItem?.IsMrpBase == 0 ? (
//                   <div className="elv_qty">
//                     <label htmlFor="qty">Qty:</label>
//                     <span>{selectedItem?.Quantity}</span>
//                   </div>
//                 ) :
//                   <div>
//                     <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
//                   </div>
//                 }
//                 <div className="elv_cartQtyPricemainDev_1">
//                   {storeInitData?.IsPriceShow == 1 &&
//                     <div className="elv_product-price_1">
//                       <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                         <span
//                           className="elv_currencyFont"
//                           dangerouslySetInnerHTML={{
//                             __html: decodeEntities(
//                               loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode
//                             ),
//                           }}
//                         />
//                         {ispriceloding ? (
//                           <Skeleton variant="rounded" width={140} height={30} style={{ marginInline: "0.3rem" }} />
//                         ) : (
//                           formatter(selectedItem?.FinalCost)
//                         )}
//                       </span>
//                     </div>
//                   }
//                 </div>
//               </div>
//               {selectedItem?.IsMrpBase == 1 && (
//                 <div className='elv_UpdateCartBtn'>
//                   <button className="elv_cartUpdate-button" onClick={() => handleUpdateCart(selectedItem)}>Apply</button>
//                 </div>
//               )}
//             </div>
//           </div> -->

//  <div className="elv_Cart_R-details_1">
//             {/* <p className='elv_cart-Titleline'>{selectedItem?.TitleLine}</p>
//             <Divider /> */}
//             <div className="elv_StockCart-options">
//               <div className='elv_stock_1'>
//                 {selectedItem?.metaltypename != "" &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="metal-type">Metal Type:&nbsp;</label>
//                     <span>{selectedItem?.metaltypename}</span>
//                   </div>
//                 }
//                 {selectedItem?.metaltypename != "" &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="metal-color">Metal Color:&nbsp;</label>
//                     <span>{selectedItem?.metalcolorname}</span>
//                   </div>
//                 }
//                 {(selectedItem?.Dwt != "0" || selectedItem?.Dpcs != "0") &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="diamond">Diamond:&nbsp;</label>
//                     <span>{(selectedItem?.diamondqualityname)?.replace(/,/g, ' - ') + ',' + selectedItem?.diamondcolorname}</span>
//                   </div>
//                 }
//                 {(selectedItem?.CSwt != "0" || selectedItem?.CSpcs != "0") &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="diamond">Color Stone:&nbsp;</label>
//                     <span>{selectedItem?.colorstonequality + ',' + selectedItem?.colorstonecolor}</span>
//                   </div>
//                 }
//                 {selectedItem?.Size != "" &&
//                   <div className="elv_option_mrp">
//                     <label htmlFor="size">Size:&nbsp;</label>
//                     <span>{selectedItem?.Size}</span>
//                   </div>
//                 }
//                 <div className='elv_stock_2'>
//                 </div>
//               </div>
//               <div className='elv_stock_3'>
//                 {selectedItem?.IsMrpBase == 0 ? (
//                   <div className="elv_qty">
//                     <label htmlFor="qty">Qty:</label>
//                     <span>{selectedItem?.Quantity}</span>
//                   </div>
//                 ) :
//                   <div>
//                     <QuantitySelector selectedItem={selectedItem} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} />
//                   </div>
//                 }
//                 <div className="elv_cartQtyPricemainDev_1">
//                   {storeInitData?.IsPriceShow == 1 &&
//                     <div className="elv_product-price_1">
//                       <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                         <span
//                           className="elv_currencyFont"
//                           dangerouslySetInnerHTML={{
//                             __html: decodeEntities(
//                               loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode
//                             ),
//                           }}
//                         />
//                         {ispriceloding ? (
//                           <Skeleton variant="rounded" width={140} height={30} style={{ marginInline: "0.3rem" }} />
//                         ) : (
//                           formatter(selectedItem?.FinalCost)
//                         )}
//                       </span>
//                     </div>
//                   }
//                 </div>
//               </div>
//               {selectedItem?.IsMrpBase == 1 && (
//                 <div className='elv_UpdateCartBtn'>
//                   <button className="elv_cartUpdate-button" onClick={() => handleUpdateCart(selectedItem)}>Apply</button>
//                 </div>
//               )}
//             </div>
//           </div>
