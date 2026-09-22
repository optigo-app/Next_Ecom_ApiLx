import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  alpha,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseRounded";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import Cookies from "js-cookie";
import { ApplyGiftCoupon } from "@/app/(core)/utils/API/CartAPI/ApplyGiftCoupon";
import {
  StyledModal,
  Bar,
  ModalContainer,
  ModalHeader,
  ModalBody,
  Button2,
  CouponInputField,
  CouponCard,
  CouponHeader,
  CouponCode,
  ApplyButton,
  KnowMoreLink,
  SavingsText,
  DescriptionText,
  SectionTitle,
  AppliedBanner,
} from "./styles";
import { useConfetti } from "./Canfetti";
import { toast } from "react-toastify";

export default function DiscountPopUp({
  open,
  onClose,
  CouponList,
  totalPrice,
  CurrencyCode,
  itemCount,
  handleMoveToOrder,
}) {
  const visiterId = Cookies.get("visiterId");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedCoupon, setVerifiedCoupon] = useState(999);
  const { triggerConfetti } = useConfetti();
  const invalidTimerRef = useRef(null);


  useEffect(() => {
    if (!open) return;
    setCouponInput("");
    setVerifiedCoupon(null);
    setAppliedCoupon(null);
  }, [open]);

  useEffect(() => {
    setVerifiedCoupon(null);
  }, [couponInput]);

  const verifyCoupon = useCallback(async (code, offer = null) => {
    if (!code) return;
    try {
      setIsLoading(true);
      const response = await ApplyGiftCoupon(visiterId, code);
      console.log(response, "v")

      if (response?.Status === "200") {
        const rd = response?.Data?.rd;
        if (rd && rd.length > 0) {
          if (rd[0]?.IsAlreadyUse === 1) {
            setVerifiedCoupon("already_used");
            setAppliedCoupon(null);
            invalidTimerRef.current = setTimeout(() => setVerifiedCoupon(null), 2000);
            return false;
          } else if (rd[0]?.stat_msg === "Sorry for invonvenient" || rd[0]?.stat_code === 1005 || rd[0]?.stat === 0) {
            toast.error('Something Went Wrong', {
              hideProgressBar: true
            });
            return
          }
          const discountValue = rd[0]?.TotalCouponDiscount || 0;
          setVerifiedCoupon(discountValue);
          setAppliedCoupon(offer || { DiscountCode: code });
          triggerConfetti();

          if (invalidTimerRef.current) {
            clearTimeout(invalidTimerRef.current);
            invalidTimerRef.current = null;
          }

          return true;
        } else {
          setVerifiedCoupon("invalid");
          setAppliedCoupon(null);
          invalidTimerRef.current = setTimeout(() => setVerifiedCoupon(null), 2000);
          return false;
        }
      } else {
        setVerifiedCoupon("invalid");
        setAppliedCoupon(null);
        invalidTimerRef.current = setTimeout(() => setVerifiedCoupon(null), 2000);
        return false;
      }
    } catch (error) {
      console.error("Coupon verification failed:", error);
      setVerifiedCoupon("invalid");
      setAppliedCoupon(null);
      invalidTimerRef.current = setTimeout(() => setVerifiedCoupon(null), 2000);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [visiterId, triggerConfetti]);

  const handleManualApply = useCallback(() => {
    if (couponInput) {
      verifyCoupon(couponInput);
    }
  }, [couponInput, verifyCoupon]);

  const handleApplyFromList = useCallback(
    (offer) => {
      setCouponInput(offer?.DiscountCode); // sync field visually
      verifyCoupon(offer?.DiscountCode, offer);
    },
    [verifyCoupon]
  );

  const handleRemove = useCallback(() => {
    setAppliedCoupon(null);
    setCouponInput("");
    setVerifiedCoupon(null);
  }, []);

  useEffect(() => {
    return () => {
      if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current);
    };
  }, []);


  const handleContinue = useCallback(() => {
    if (appliedCoupon && typeof verifiedCoupon === "number" && verifiedCoupon > 0) {
      sessionStorage.setItem("AppliedCoupon", appliedCoupon.DiscountCode || couponInput);
    } else {
      sessionStorage.removeItem("AppliedCoupon");
    }
    handleMoveToOrder();
    onClose();
  }, [verifiedCoupon, couponInput, handleMoveToOrder, onClose]);

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContainer>
        {/* Header */}
        <ModalHeader>
          <Box display="flex" alignItems="center" gap={1.5}>
            <LocalOfferIcon sx={{ fontSize: 22, color: "text.secondary" }} />
            <Typography variant="h6" fontWeight={600} fontSize={17}>
              Coupons & Offers
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": { backgroundColor: alpha("#000", 0.05) },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ModalHeader>

        {/* Banner */}
        {typeof verifiedCoupon === "number" && verifiedCoupon > 0 && (
          <Bar>
            <Typography variant="body2" fontWeight={500}>
              You saved {CurrencyCode} {verifiedCoupon} (
              {appliedCoupon?.DiamondDiscount || appliedCoupon?.LabourDiscount || 0}%)
            </Typography>
          </Bar>
        )}
        {verifiedCoupon === "already_used" && (
          <Bar color="error">
            <Typography variant="body2" fontWeight={500}>
              This coupon can only be used once per user.
            </Typography>
          </Bar>
        )}

        {verifiedCoupon === "invalid" && (
          <Bar color="error">
            <Typography variant="body2" fontWeight={500}>
              Invalid Coupon
            </Typography>
          </Bar>
        )}

        {/* Body */}
        <ModalBody>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            <CartSummary
              totalPrice={totalPrice}
              CurrencyCode={CurrencyCode}
              itemCount={itemCount}
            />

            {/* Input */}
            <CouponInputField
              sx={{ mt: 1 }}
              fullWidth
              size="small"
              placeholder="Enter coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : verifiedCoupon === "invalid" ? (
                      <CloseIcon sx={{ fontSize: 20, color: "error.main" }} />
                    ) : typeof verifiedCoupon === "number" &&
                      verifiedCoupon > 0 ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: "success.main" }} />
                    ) : (
                      <Button2 size="small" onClick={handleManualApply}>
                        Apply
                      </Button2>
                    )}
                  </InputAdornment>
                ),
              }}
            />

            {/* Applied Banner */}
            {appliedCoupon && (
              <AppliedBanner sx={{ mt: 2.5 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircleIcon sx={{ fontSize: 20, color: "#10b981" }} />
                  <Box>
                    <Typography fontSize={13} fontWeight={600} color="#10b981">
                      You saved {appliedCoupon?.DiamondDiscount || appliedCoupon?.LabourDiscount || "on this order"}%
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      "{appliedCoupon?.DiscountCode}" applied
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  onClick={handleRemove}
                  sx={{
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "text.primary",
                    minWidth: "auto",
                  }}
                >
                  Remove
                </Button>
              </AppliedBanner>
            )}
          </Box>

          {/* Offers List */}
          <SectionTitle sx={{ mt: appliedCoupon ? 1 : 3 }}>
            {appliedCoupon ? "Other Offers" : "Active Coupons"}
          </SectionTitle>
          <CouponListComponent
            CouponList={CouponList}
            handleApply={handleApplyFromList}
          />
        </ModalBody>

        {/* Footer */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
            background: "#fff",
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "90%", py: 1.5, fontWeight: 600 }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </ModalContainer>
    </StyledModal>
  );
}

/* Sub-components */
function CartSummary({ totalPrice, CurrencyCode, itemCount }) {
  return (
    <Box display="flex" flexDirection="column" sx={{ pt: 1 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {itemCount} Items
        </Typography>
        <Typography variant="h6" fontWeight={600} fontSize={16}>
          {CurrencyCode} {totalPrice}
        </Typography>
      </Box>
    </Box>
  );
}

function CouponListComponent({ CouponList, handleApply }) {
  return (
    <>
      {CouponList?.map((offer) => {
        const Discount = offer?.DiamondDiscount || offer?.LabourDiscount;
        return (
          <CouponCard key={offer?.id}>
            <CouponHeader>
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  {Discount && <SavingsText>Save {Discount}% with</SavingsText>}
                  <CouponCode label={offer?.DiscountCode} size="small" />
                </Box>
                <DescriptionText>{offer?.Description}</DescriptionText>
                {/* <KnowMoreLink>Know more</KnowMoreLink> */}
              </Box>
              <ApplyButton variant="outlined" onClick={() => handleApply(offer)}>
                Apply
              </ApplyButton>
            </CouponHeader>
          </CouponCard>
        );
      })}
    </>
  );
}

// import React, { useCallback, useEffect, useState } from "react";
// import { Box, Typography, Button, IconButton, InputAdornment, alpha } from "@mui/material";
// import CloseIcon from "@mui/icons-material/CloseRounded";
// import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
// import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
// import { StyledModal, Bar, ModalContainer, ModalHeader, Button2, ModalBody, CouponInputField, CouponCard, CouponHeader, CouponCode, ApplyButton, KnowMoreLink, SavingsText, DescriptionText, SectionTitle, AppliedBanner } from "./styles";
// import { ApplyGiftCoupon } from "@/app/(core)/utils/API/CartAPI/ApplyGiftCoupon";
// import Cookies from "js-cookie";
// import CircularProgress from "@mui/material/CircularProgress";

// export default function DiscountPopUp({ open, onClose, CouponList, totalPrice, CurrencyCode, itemCount, handleMoveToOrder }) {
//   const visiterId = Cookies.get("visiterId");
//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [VerifedCoupon, setVerifedCoupon] = useState(null);

//   useEffect(() => {
//     if (!open) return;
//     setCouponInput("");
//     setVerifedCoupon(null);
//     setAppliedCoupon(null);
//   }, [open]);

//   useEffect(() => {
//     setVerifedCoupon(null);
//   }, [couponInput]);

//   const handleContinue = useCallback(() => {
//     let codeToSave = null;
//     if (typeof VerifedCoupon === "number" && VerifedCoupon > 0) {
//       codeToSave = couponInput; // only save validated coupon
//     }
//     if (codeToSave) {
//       sessionStorage.setItem("AppliedCoupon", codeToSave);
//     } else {
//       sessionStorage.removeItem("AppliedCoupon");
//     }
//     handleMoveToOrder();
//     onClose();
//   }, [VerifedCoupon, couponInput, handleMoveToOrder, onClose]);

//   const VerifyCoupon = useCallback(async () => {
//     if (!couponInput) return;

//     try {
//       setIsLoading(true);
//       const response = await ApplyGiftCoupon(visiterId, couponInput);
//       if (response?.Status === "200") {
//         const rd = response?.Data?.rd;
//         if (rd && rd.length > 0) {
//           setVerifedCoupon(rd[0]?.TotalCouponDiscount || 0);
//         } else {
//           setVerifedCoupon("invalid");
//           setTimeout(() => {
//             setVerifedCoupon(null);
//           }, 2000);
//         }
//       } else {
//         setVerifedCoupon(null);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error(error);
//       setIsLoading(false);
//     }
//   }, [couponInput, visiterId]);

//   const handleApply = useCallback((offer) => {
//     setAppliedCoupon(offer);
//     setCouponInput(offer?.DiscountCode);
//   }, []);

//   const handleRemove = useCallback(() => {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     setVerifedCoupon(null);
//   }, []);

//   return (
//     <StyledModal open={open} onClose={onClose}>
//       <ModalContainer>
//         <ModalHeader>
//           <Box display="flex" alignItems="center" gap={1.5}>
//             <LocalOfferIcon sx={{ fontSize: 22, color: "text.secondary" }} />
//             <Typography variant="h6" fontWeight={600} fontSize={17}>
//               Coupons & Offers
//             </Typography>
//           </Box>
//           <IconButton
//             size="small"
//             onClick={onClose}
//             sx={{
//               color: "text.secondary",
//               "&:hover": { backgroundColor: alpha("#000", 0.05) },
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </ModalHeader>
//         {typeof VerifedCoupon === "number" && VerifedCoupon > 0 && (
//           <Bar sx={{ display: VerifedCoupon !== "invalid" ? "flex" : "none" }}>
//             <Typography variant="body2" color="text.secondary" fontWeight={500}>
//               You saved {CurrencyCode} {VerifedCoupon} ({appliedCoupon?.DiamondDiscount || 0}%)
//             </Typography>
//           </Bar>
//         )}
//         {VerifedCoupon === "invalid" && (
//           <Bar color={"error"} sx={{ display: "flex" }}>
//             <Typography variant="body2" fontWeight={500}>
//               Invalid Coupon
//             </Typography>
//           </Bar>
//         )}
//         <ModalBody>
//           <Box
//             sx={{
//               position: "sticky",
//               top: 0,
//               zIndex: 1,
//               backgroundColor: "white",
//             }}
//           >
//             <CartSummary totalPrice={totalPrice} CurrencyCode={CurrencyCode} itemCount={itemCount} />
//             <CouponInputField
//               sx={{
//                 mt: 1,
//               }}
//               fullWidth
//               size="small"
//               placeholder="Enter coupon code"
//               value={couponInput}
//               onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     {isLoading ? (
//                       <CircularProgress size={20} />
//                     ) : VerifedCoupon === "invalid" ? (
//                       <CheckCircleIcon sx={{ fontSize: 20, color: "error.main" }} />
//                     ) : typeof VerifedCoupon === "number" && VerifedCoupon > 0 ? (
//                       <CheckCircleIcon sx={{ fontSize: 20, color: "success.main" }} />
//                     ) : (
//                       <Button2 size="small" onClick={VerifyCoupon}>
//                         Apply
//                       </Button2>
//                     )}
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Applied Coupon Banner */}
//             {appliedCoupon && (
//               <AppliedBanner sx={{ mt: 2.5 }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <CheckCircleIcon sx={{ fontSize: 20, color: "#10b981" }} />
//                   <Box>
//                     <Typography fontSize={13} fontWeight={600} color="#10b981">
//                       You saved {appliedCoupon?.DiamondDiscount || "on this order"}%
//                     </Typography>
//                     <Typography fontSize={12} color="text.secondary">
//                       "{appliedCoupon?.DiscountCode}" applied
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Button
//                   size="small"
//                   onClick={handleRemove}
//                   sx={{
//                     textTransform: "none",
//                     fontSize: 13,
//                     fontWeight: 600,
//                     color: "text.primary",
//                     minWidth: "auto",
//                   }}
//                 >
//                   Remove
//                 </Button>
//               </AppliedBanner>
//             )}
//           </Box>
//           <SectionTitle sx={{ mt: appliedCoupon ? 1 : 3 }}>{appliedCoupon ? "Other Offers" : "Active Coupons"}</SectionTitle>
//           <CouponListComponent CouponList={CouponList} handleApply={handleApply} />
//         </ModalBody>
//         <Box
//           sx={{
//             position: "sticky",
//             bottom: 0,
//             left: 0,
//             width: "100%",
//             p: 2,
//             background: "#fff",
//             borderTop: "1px solid",
//             borderColor: "divider",
//             display: "flex",
//             justifyContent: "center",
//             zIndex: 10,
//           }}
//         >
//           <Button variant="contained" color="primary" sx={{ width: "90%", py: 1.5, fontWeight: 600 }} onClick={handleContinue}>
//             Continue
//           </Button>
//         </Box>
//       </ModalContainer>
//     </StyledModal>
//   );
// }

// function CartSummary({ totalPrice, CurrencyCode, itemCount }) {
//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       sx={{
//         position: "sticky",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 1,
//         backgroundColor: "white",
//         pt: 1,
//       }}
//     >
//       <Box display="flex" alignItems="center" justifyContent="space-between">
//         <Box display="flex" alignItems="center" gap={1.2}>
//           <Typography variant="body2" color="text.secondary" fontWeight={500}>
//             {itemCount} Items
//           </Typography>
//         </Box>

//         <Box display="flex" alignItems="baseline" gap={0.5}>
//           <Typography variant="h6" fontWeight={600} fontSize={16}>
//             {CurrencyCode} {totalPrice}
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function CouponListComponent({ CouponList, handleApply }) {
//   return (
//     <>
//       {CouponList?.map((offer) => {
//         const Discount = offer?.DiamondDiscount || offer?.LabourDiscount;
//         return (
//           <CouponCard key={offer?.id}>
//             <CouponHeader>
//               <Box flex={1}>
//                 <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
//                   {Discount && <SavingsText>Save {Discount}% with</SavingsText>}
//                   <CouponCode label={offer?.DiscountCode} size="small" />
//                 </Box>
//                 <DescriptionText>{offer?.Description}</DescriptionText>
//                 <KnowMoreLink>Know more</KnowMoreLink>
//               </Box>
//               <ApplyButton variant="outlined" onClick={() => handleApply(offer)}>
//                 Apply
//               </ApplyButton>
//             </CouponHeader>
//           </CouponCard>
//         );
//       })}
//     </>
//   );
// }
