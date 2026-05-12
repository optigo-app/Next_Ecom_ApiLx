import React, { useRef } from "react";
import { Box, Typography, Divider, Button, Stack, Grid, useMediaQuery } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";

export default function CartHeader({
  summary,
  count = 0,
  totalPrice,
  CurrencyCode,
  IsPriceShow,
  handleMoveToOrder,
  OrderMessage,
  handleOpen1,
  handleClose1,
  openClearAllModal,
  closeClearAllModal,
}) {
  const IsSetupFor = false;
  const summaryRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const istablet = useMediaQuery("(max-width:968px)");

  const isSummaryInView = useInView(summaryRef, { margin: "0px 0px -100px 0px" });
  const showSticky = !isSummaryInView && count > 0 && summary;

  //  summary?.MetalCost,
  //  summary?.DiamondCost,
  //  summary?.LabourCost,
  //  summary?.OtherCost ,
  //  summary?.ColorStoneCost

  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 5, position: "relative" }}>
      <AnimatePresence>
        {showSticky && (
          <>
            <motion.div
              initial={{ y: -100, opacity: 0, scale: 0.8 }}
              animate={{ y: isMobile ? 80 : 100, opacity: 1, scale: 1 }} // Floats 20px from top
              exit={{ y: -100, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                margin: "0 auto",
                width: "fit-content",
                zIndex: 1100, // High z-index to sit on top of products
                maxWidth: "95%",
              }}
            >
              <Box
                sx={{
                  background: "rgba(10, 31, 71, 0.95)", // Dark Blue Glassmorphism
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  borderRadius: "50px", // Pill shape
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  padding: "10px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Compact Summary Data */}
                <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />}>

                  <Box textAlign="center">
                    <Typography fontSize={10} color="#b0b8c4" fontWeight={500}>G. Wt</Typography>
                    <Typography fontSize={14} fontWeight={700}>{summary.totalGwt?.toFixed(3)}</Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography fontSize={10} color="#b0b8c4" fontWeight={500}>N. Wt</Typography>
                    <Typography fontSize={14} fontWeight={700}>{summary.totalNwt?.toFixed(3)}</Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography fontSize={10} color="#b0b8c4" fontWeight={500}>Dia Wt</Typography>
                    <Typography fontSize={14} fontWeight={700}>{summary.totalDwt?.toFixed(3)} / {summary?.totalDpcs}</Typography>
                  </Box>

                  {/* Optional: Add Price or Count here if needed */}
                  {
                    !isMobile &&
                    (
                      IsPriceShow && (
                        <Box textAlign="center">
                          <Typography fontSize={10} color="#b0b8c4" fontWeight={500}>Total</Typography>
                          <Tooltip
                            title={IsSetupFor ? "Cart Summary" : <PriceTooltipContent summary={summary} />}
                            arrow
                            placement="top"
                          >

                            <Typography fontSize={14} fontWeight={700}>
                              {CurrencyCode} {totalPrice?.toLocaleString("en-IN")}
                            </Typography>
                          </Tooltip>
                        </Box>
                      ))}
                </Stack>

                {/* Mini Action Button (Optional - acts as a quick "Go to Order") */}
                {!istablet && <Button
                  variant="contained"
                  size="small"
                  onClick={handleMoveToOrder}
                  sx={{
                    minWidth: "40px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    p: 0,
                    ml: 1,
                    background: "#fff",
                    color: "#0a1f47",
                    ":hover": { background: "#f0f0f0" }
                  }}
                >
                  <ShoppingBagIcon fontSize="small" />
                </Button>}
              </Box>
            </motion.div>
            {isMobile && <motion.div
              initial={{ y: -100, opacity: 0, scale: 0.8 }}
              animate={{ y: isMobile ? 150 : 170, opacity: 1, scale: 1 }} // Floats 20px from top
              exit={{ y: -100, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                margin: "0 auto",
                width: "fit-content",
                zIndex: 1100, // High z-index to sit on top of products
                maxWidth: "95%",
              }}
            >
              {IsPriceShow && (
                <Box
                  sx={{
                    background: "rgba(10, 31, 71, 0.95)", // Dark Blue Glassmorphism
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    borderRadius: "50px", // Pill shape
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    padding: "10px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >

                  <Box sx={{
                    display: 'flex', alignItems: 'center',
                    gap: 2
                  }}>
                    <Typography fontSize={14} fontWeight={700} color="#b0b8c4" >Total</Typography>
                    <Typography fontSize={14} fontWeight={700}>
                      {CurrencyCode} {totalPrice?.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Box>
              )}

            </motion.div>}
          </>
        )}
      </AnimatePresence>

      {/* ================================================================================== */}
      {/*                               NORMAL HEADER CONTENT                                */}
      {/* ================================================================================== */}

      {/* ---- Title Section (Centered) ---- */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: "28px", md: "36px" },
            fontWeight: 800,
            color: "#0a1f47",
            letterSpacing: "-0.5px",
            mb: 0.5
          }}
        >
          My Cart
        </Typography>

        {IsPriceShow && count > 0 && (
          <Tooltip
            title={IsSetupFor ? "Cart Summary" : <PriceTooltipContent summary={summary} />}
            arrow
            placement="top"
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#64748b",
              }}
            >
              {count} Items • {CurrencyCode} {totalPrice?.toLocaleString("en-IN")}
            </Typography>
          </Tooltip>
        )}
      </Box>

      {/* ---- Original Summary Box (Tracked by Ref) ---- */}
      <div ref={summaryRef}>
        {count > 0 && summary && (
          <Box
            sx={{
              mt: 4,
              mb: 4,
              px: 3,
              py: 2.8,
              borderRadius: 2,
              background: "#ffffff",
              border: "1px solid #dfe3eb",
              maxWidth: 650,
              mx: "auto",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              transition: "opacity 0.3s ease", // Fade out original if needed
              opacity: showSticky ? 0.5 : 1 // Optional: dim original when scrolling back up
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              {/* Gross Weight */}
              <Grid item size={{
                xs: 4, sm: 3
              }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: 'uppercase', mb: 0.5 }}>
                  Gross Wt
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                  {summary.totalGwt?.toFixed(3)}
                </Typography>
              </Grid>

              {/* Net Weight */}
              <Grid item size={{
                xs: 4, sm: 3
              }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: 'uppercase', mb: 0.5 }}>
                  Net Wt
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                  {summary.totalNwt?.toFixed(3)}
                </Typography>
              </Grid>

              {/* Diamond Weight */}
              <Grid item size={{
                xs: 4, sm: 3
              }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: 'uppercase', mb: 0.5 }}>
                  Diamond Wt
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                  {summary.totalDwt?.toFixed(3)}
                  <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>
                    {" "} / {summary?.totalDpcs}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Box >
        )
        }
      </div >

      {/* Divider */}
      < Divider sx={{ mt: 3, mb: 2 }} />

      {/* ---- Buttons Row ---- */}
      {
        count > 0 && (
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              mx: "auto",
              px: 1,
              flexWrap: "wrap",
              "@media (max-width: 968px)": {
                justifyContent: "center",
                gap: 2,
              },
            }}
          >
            {/* LEFT SIDE spacer */}
            <Box sx={{ flex: 1 }} />

            {/* CENTER BUTTONS */}
            <Stack direction="row" spacing={2} sx={{ flexShrink: 0, justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  background: "#163164",
                  color: "#fff",
                  fontSize: { xs: "13px", sm: "15px" },
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  ":hover": { background: "#163164" },
                }}
                onClick={count > 0 ? handleOpen1 : handleClose1}
              >
                {OrderMessage}
              </Button>

              <Button
                variant="outlined"
                sx={{
                  color: "#1a1a1a",
                  borderColor: "#ccc",
                  fontSize: { xs: "13px", sm: "15px" },
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  ":hover": { borderColor: "#999", background: "#fafafa" },
                }}
                onClick={count > 0 ? openClearAllModal : closeClearAllModal}
              >
                Clear Cart
              </Button>
            </Stack>

            {/* RIGHT SIDE — Place Order Button */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                endIcon={<ShoppingBagIcon />}
                sx={{
                  background: "#163164",
                  color: "#fff",
                  fontSize: "14px",
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  py: 0.9,
                  whiteSpace: "nowrap",
                  ":hover": { background: "#163164" },
                  "@media (max-width: 968px)": {
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: "100%",
                    borderRadius: 0,
                    px: 0,
                    py: 2,
                    zIndex: 2000,
                  },
                }}
                onClick={handleMoveToOrder}
              >
                Place Order
              </Button>
            </Box>
          </Stack>
        )
      }
    </Box >
  );
}



const PriceTooltipContent = ({ summary }) => (
  <Box sx={{ p: 1 }}>
    <Typography variant="subtitle2" fontWeight="bold">
      Price Breakup
    </Typography>
    <Typography variant="body2">
      Metal Cost: ₹{summary?.MetalCost?.toLocaleString()}
    </Typography>
    <Typography variant="body2">
      Diamond Cost: ₹{summary?.DiamondCost?.toLocaleString()}
    </Typography>
    <Typography variant="body2">
      Color Stone Cost: ₹{summary?.ColorStoneCost?.toLocaleString()}
    </Typography>
    <Typography variant="body2">
      Misc Cost: ₹{summary?.MiscCost?.toLocaleString()}
    </Typography>
    <Typography variant="body2">
      Labour Cost: ₹{summary?.LabourCost?.toLocaleString()}
    </Typography>
    <Typography variant="body2">
      Other Cost: ₹{summary?.OtherCost?.toLocaleString()}
    </Typography>
  </Box>
);



// import { Box, Typography, Divider, Button, Stack, Grid } from "@mui/material";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

// export default function CartHeader({ summary, count = 0, totalPrice, CurrencyCode, IsPriceShow, handleMoveToOrder, OrderMessage, handleOpen1, handleClose1, openClearAllModal, closeClearAllModal }) {
//   return (
//     <Box sx={{ width: "100%", mx: "auto", mt: 5 }}>
//       {/* ---- Title Section (Centered) ---- */}
//       <Box sx={{ textAlign: "center" }}>
//         <Typography
//           sx={{
//             fontSize: "32px",
//             fontWeight: 700,
//             color: "#0a1f47",
//             letterSpacing: "-0.5px",
//           }}
//         >
//           My Cart
//         </Typography>

//         {IsPriceShow && count > 0 && (
//           <Typography
//             sx={{
//               mt: 1,
//               fontSize: "18px",
//               fontWeight: 600,
//               color: "#152c55",
//             }}
//           >
//             {count} Items • {CurrencyCode} {totalPrice?.toLocaleString("en-IN")}
//           </Typography>
//         )}
//       </Box>
//       {count > 0 && summary && (
//         <Box
//           sx={{
//             mt: 4,
//             mb: 4,
//             px: 3,
//             py: 2.8,
//             borderRadius: 2,
//             background: "#ffffff",
//             border: "1px solid #dfe3eb",
//             maxWidth: 650,
//             mx: "auto",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
//           }}
//         >
//           <Grid
//             container
//             spacing={2}
//             justifyContent="center"
//             alignItems="center"
//             textAlign="center"
//           >
//             {/* Gross Weight */}
//             <Grid item xs={6} sm={3}>
//               <Typography
//                 sx={{
//                   fontSize: 13,
//                   fontWeight: 600,
//                   color: "#7a869a",
//                   mb: 0.5,
//                 }}
//               >
//                 Gross Wt
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: 18,
//                   fontWeight: 700,
//                   color: "#0a1f47",
//                 }}
//               >
//                 {summary.totalGwt?.toFixed(3)}
//               </Typography>
//             </Grid>

//             {/* Net Weight */}
//             <Grid item xs={6} sm={3}>
//               <Typography
//                 sx={{
//                   fontSize: 13,
//                   fontWeight: 600,
//                   color: "#7a869a",
//                   mb: 0.5,
//                 }}
//               >
//                 Net Wt
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: 18,
//                   fontWeight: 700,
//                   color: "#0a1f47",
//                 }}
//               >
//                 {summary.totalNwt?.toFixed(3)}
//               </Typography>
//             </Grid>

//             {/* Diamond Weight */}
//             <Grid item xs={6} sm={3}>
//               <Typography
//                 sx={{
//                   fontSize: 13,
//                   fontWeight: 600,
//                   color: "#7a869a",
//                   mb: 0.5,
//                 }}
//               >
//                 Diamond Wt
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: 18,
//                   fontWeight: 700,
//                   color: "#0a1f47",
//                 }}
//               >
//                 {summary.totalDwt?.toFixed(3)}
//                 <span style={{ color: "#64748b", fontSize: 14 }}>
//                   {" "} / {summary?.totalDpcs}
//                 </span>
//               </Typography>
//             </Grid>

//             {/* CS Weight */}
//             {/* <Grid item xs={6} sm={3}>
//         <Typography
//           sx={{
//             fontSize: 13,
//             fontWeight: 600,
//             color: "#7a869a",
//             mb: 0.5,
//           }}
//         >
//           CS Wt
//         </Typography>
//         <Typography
//           sx={{
//             fontSize: 18,
//             fontWeight: 700,
//             color: "#0a1f47",
//           }}
//         >
//           {summary.totalCSwt?.toFixed(3)}
//           <span style={{ color: "#64748b", fontSize: 14 }}>
//             {" "} / {summary.cswtPerPiece?.toFixed(3)}
//           </span>
//         </Typography>
//       </Grid> */}
//           </Grid>
//         </Box>
//       )}


//       {/* Divider */}
//       <Divider sx={{ mt: 3, mb: 2 }} />

//       {/* ---- Buttons Row ---- */}
//       {count > 0 && (
//         <Stack
//           spacing={2}
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{
//             mx: "auto",
//             px: 1,
//             flexWrap: "wrap",

//             // Center the middle buttons on small screens
//             "@media (max-width: 968px)": {
//               justifyContent: "center",
//               gap: 2,
//             }
//           }}
//         >

//           {/* LEFT SIDE = empty flexible space for spacing */}
//           <Box sx={{ flex: 1 }} />

//           {/* CENTER BUTTONS */}
//           <Stack
//             direction="row"
//             spacing={2}
//             sx={{
//               flexShrink: 0,
//               justifyContent: "center",
//             }}
//           >
//             <Button
//               variant="contained"
//               sx={{
//                 background: "#163164",
//                 color: "#fff",
//                 fontSize: { xs: "13px", sm: "15px" },
//                 textTransform: "none",
//                 borderRadius: "10px",
//                 px: 3,
//                 ":hover": { background: "#163164" },
//               }}
//               onClick={count > 0 ? handleOpen1 : handleClose1}
//             >
//               {OrderMessage}
//             </Button>

//             <Button
//               variant="outlined"
//               sx={{
//                 color: "#1a1a1a",
//                 borderColor: "#ccc",
//                 fontSize: { xs: "13px", sm: "15px" },
//                 textTransform: "none",
//                 borderRadius: "10px",
//                 px: 3,
//                 ":hover": { borderColor: "#999", background: "#fafafa" },
//               }}
//               onClick={count > 0 ? openClearAllModal : closeClearAllModal}
//             >
//               Clear Cart
//             </Button>
//           </Stack>

//           {/* RIGHT SIDE — Place Order Button */}
//           <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
//             <Button
//               variant="contained"
//               endIcon={<ShoppingBagIcon />}
//               sx={{
//                 background: "#163164",
//                 color: "#fff",
//                 fontSize: "14px",
//                 textTransform: "none",
//                 borderRadius: "10px",
//                 px: 3,
//                 py: 0.9,
//                 whiteSpace: "nowrap",
//                 ":hover": { background: "#163164" },

//                 // FIXED BOTTOM on small screens
//                 "@media (max-width: 968px)": {
//                   position: "fixed",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   width: "100%",
//                   borderRadius: 0,
//                   px: 0,
//                   py: 2,
//                   zIndex: 2000
//                 }
//               }}
//               onClick={handleMoveToOrder}
//             >
//               Place Order
//             </Button>

//           </Box>
//         </Stack>
//       )}
//     </Box>
//   );
// }


