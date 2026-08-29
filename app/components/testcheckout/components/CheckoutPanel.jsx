"use client";

import React, { useState, useEffect } from "react";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  Skeleton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { BsPaypal, BsCreditCard, BsCreditCard2Front } from "react-icons/bs";
import { FaStripeS } from "react-icons/fa";
import { SiPaytm, SiPhonepe, SiRazorpay } from "react-icons/si";
import { LocalShipping } from "@mui/icons-material";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import AddressDrawer from "./AddressDrawer";
import OrderRemarkModal from "./OrderRemarkModal";

const PAYMENT_METHODS_INFO = {
  1: { icon: <BsPaypal />, description: "Pay securely with PayPal", color: "#003087" },
  2: { icon: <BsCreditCard2Front />, description: "Pay with EBS", color: "#0051BA" },
  3: { icon: <LocalShipping />, description: "Pay when you receive", color: "#FFD700" },
  4: { icon: <SiPaytm />, description: "Pay using Paytm wallet", color: "#02b3ea" },
  5: { icon: <PaymentsIcon />, description: "Pay with Eazypay", color: "#5C6BC0" },
  6: { icon: <CreditCardIcon />, description: "Pay using PayUMoney", color: "#2196F3" },
  7: { icon: <BsCreditCard />, description: "Pay with Payeezy", color: "#FF4081" },
  8: { icon: <FaStripeS />, description: "International payments via Stripe", color: "#6058f7" },
  9: { icon: <SiPhonepe />, description: "Pay with PhonePe", color: "#5c249a" },
  10: { icon: <SiRazorpay />, description: "Pay with Razorpay", color: "#3395ff" },
};

export default function CheckoutPanel({
  storeinit,
  currencyCode,
  formatter,
  subtotal,
  estimatedTax,
  totalAmount,
  isLoadingCart = false,
  isLoadingTax = false,
  addressList,
  selectedAddress,
  isLoadingAddress = false,
  onSelectAddress,
  onAddNewAddress,
  orderRemark,
  onSaveOrderRemark,
  paymentMethods,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  isPlacingOrder,
  onCheckout,
}) {
  const router = useRouter();
  const { islogin: storeIsLogin } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderRemarkModalOpen, setIsOrderRemarkModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const islogin = mounted
    ? Boolean(storeIsLogin || getSession("LoginUser") || getSession("loginUserDetail") || Cookies.get("LoginUser"))
    : Boolean(storeIsLogin);

  const isInitialLoading = !mounted || isLoadingCart;
  const isSummaryLoading = isInitialLoading || isLoadingTax;
  const isAddrLoading = isInitialLoading || isLoadingAddress;
  const isPayLoading = isInitialLoading || !paymentMethods || paymentMethods.length === 0;

  const hasAddress = Boolean(
    selectedAddress &&
      (selectedAddress?.shippingfirstname || selectedAddress?.street),
  );

  return (
    <Box
      className="testCheckout_panel"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* 1. Order Summary Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "8px",
          border: "1px solid #eee",
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ color: "#222", mb: 0.5, fontSize: "20px", fontWeight: 800, letterSpacing: "0.2px" }}>
          Order Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "#888", fontSize: "0.85rem", fontWeight: 600, mb: 2 }}>
          Review your order details
        </Typography>

        <Stack spacing={1.3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
            <Typography sx={{ color: "#666", fontSize: "0.9rem", fontWeight: 600 }}>Subtotal</Typography>
            {isSummaryLoading ? (
              <Skeleton width={90} height={22} />
            ) : (
              <Typography fontWeight={600} color="#222">
                {currencyCode} {formatter(subtotal)}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
            <Typography sx={{ color: "#666", fontSize: "0.9rem", fontWeight: 600 }}>Estimated Tax</Typography>
            {isSummaryLoading ? (
              <Skeleton width={80} height={22} />
            ) : (
              <Typography fontWeight={600} color="#222">
                {currencyCode} {formatter(estimatedTax)}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 0.8, borderColor: "#f0f0f0" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight={700} color="#222" sx={{ fontSize: "1rem" }}>
              Total Amount
            </Typography>
            {isSummaryLoading ? (
              <Skeleton width={110} height={30} />
            ) : (
              <Typography variant="h6" fontWeight={700} sx={{ color: "var(--checkout-primary-text, #9c6d48)", fontSize: "1.2rem" }}>
                {currencyCode} {formatter(totalAmount)}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* 2. Shipping Address Card (Only shown when logged in) */}
      {islogin && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: "12px",
            border: "1px solid #E8E8EC",
            bgcolor: "#FFFFFF",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Card Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography sx={{ color: "#111", fontSize: "20px", fontWeight: 800, letterSpacing: "0.2px" }}>
                Shipping Address
              </Typography>
              <Typography variant="body2" sx={{ color: "#777", fontSize: "0.85rem", fontWeight: 600, mt: 0.2 }}>
                Where should we deliver?
              </Typography>
            </Box>

            {!isAddrLoading && hasAddress && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsAddressModalOpen(true)}
                startIcon={<EditOutlinedIcon sx={{ fontSize: "15px !important" }} />}
                sx={{
                  fontSize: "0.78rem",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "20px",
                  borderColor: "#DCDCE0",
                  color: "#222",
                  bgcolor: "#FAFAFA",
                  px: 1.8,
                  py: 0.5,
                  boxShadow: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#111",
                    bgcolor: "#111",
                    color: "#FFF",
                  },
                }}
              >
                Change Address
              </Button>
            )}
          </Box>

          {isAddrLoading ? (
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "10px" }} />
          ) : hasAddress ? (
            /* Logged In with address display */
            <Box
              sx={{
                p: 2.2,
                bgcolor: "var(--checkout-primary-light, #faf4ee)",
                borderRadius: "8px",
                border: "1px solid var(--checkout-primary-light-border, #edd8c7)",
                mb: 1.5,
                position: "relative",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "var(--checkout-primary, #cca182)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      bgcolor: "var(--checkout-badge-bg, #f5e8dd)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--checkout-primary-text, #9c6d48)",
                    }}
                  >
                    <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: "capitalize", color: "#111", fontSize: "0.95rem" }}>
                    {selectedAddress?.shippingfirstname} {selectedAddress?.shippinglastname}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "var(--checkout-badge-bg, #f5e8dd)",
                    color: "var(--checkout-badge-text, #8d613e)",
                    fontSize: "11px",
                    fontWeight: 700,
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "12px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Deliver Here
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1.2, pl: 4.2 }}>
                <Typography variant="body2" sx={{ color: "#444", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  {[
                    selectedAddress?.street,
                    selectedAddress?.address1,
                    selectedAddress?.address2,
                    selectedAddress?.city,
                    selectedAddress?.state,
                    selectedAddress?.country,
                    selectedAddress?.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </Box>

              {selectedAddress?.shippingmobile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8, pl: 4.2 }}>
                  <PhoneOutlinedIcon sx={{ fontSize: 16, color: "#666", flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: "#555", fontSize: "0.85rem", fontWeight: 600 }}>
                    {selectedAddress?.shippingmobile}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            /* Logged In but No Address Saved yet */
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "#FAFAFA",
                borderRadius: "10px",
                border: "1px dashed #DDD",
              }}
            >
              <Typography variant="body2" color="#666" sx={{ mb: 1.5 }}>
                No delivery address selected yet.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsAddressModalOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "6px",
                  borderColor: "var(--checkout-primary, #cca182)",
                  color: "var(--checkout-primary, #cca182)",
                  "&:hover": {
                    borderColor: "var(--checkout-primary-hover, #b88d6e)",
                    bgcolor: "var(--checkout-primary-light, #faf4ee)",
                  },
                }}
              >
                + Add / Select Address
              </Button>
            </Box>
          )}

          {/* Special Order Instructions / Remark Strip */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px dashed #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <NotesOutlinedIcon sx={{ fontSize: 18, color: "#888" }} />
              <Typography variant="body2" sx={{ color: "#666", fontSize: "0.85rem", fontWeight: 500 }}>
                {orderRemark ? "Special Instruction added" : "Add Order Instructions / Note"}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => setIsOrderRemarkModalOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--checkout-primary-text, #9c6d48)",
                p: 0,
                minWidth: "auto",
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              {orderRemark ? "Edit Note" : "+ Add Note"}
            </Button>
          </Box>

          {orderRemark && (
            <Box sx={{ mt: 1, p: 1.2, bgcolor: "#f9f9f9", borderRadius: "6px", border: "1px solid #f0f0f0" }}>
              <Typography variant="caption" sx={{ color: "#888", display: "block", fontWeight: 600 }}>
                Note for seller:
              </Typography>
              <Typography variant="body2" sx={{ color: "#333", fontSize: "0.85rem", mt: 0.2 }}>
                {orderRemark}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* 3. Payment Method Card (Shown when logged in or during initial loading) */}
      {(isInitialLoading || islogin) && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: "8px",
            border: "1px solid #eee",
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
            <Typography sx={{ color: "#222", fontSize: "20px", fontWeight: 800, letterSpacing: "0.2px" }}>
              Payment Method
            </Typography>
            <Typography variant="caption" sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Secure Checkout
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#888", fontSize: "0.85rem", fontWeight: 600, mb: 2 }}>
            Select your preferred payment gateway
          </Typography>

          {isPayLoading ? (
            <Skeleton variant="rounded" height={60} sx={{ borderRadius: "8px" }} />
          ) : (
            <FormControl fullWidth size="medium">
              <Select
                value={String(selectedPaymentMethod || "")}
                onChange={(e) => onSelectPaymentMethod(String(e.target.value))}
                displayEmpty
                input={
                  <OutlinedInput
                    sx={{
                      borderRadius: "8px",
                      bgcolor: "#FAFAFA",
                      "& fieldset": { borderColor: "#E5E5E5" },
                      "&:hover fieldset": { borderColor: "#BBB" },
                      "&.Mui-focused fieldset": { borderColor: "#000000" },
                    }}
                  />
                }
                renderValue={(val) => {
                  const method = paymentMethods.find((m) => String(m.id) === String(val));
                  if (!method) {
                    return <Typography sx={{ color: "#999" }}>Choose payment method</Typography>;
                  }
                  const info = PAYMENT_METHODS_INFO[method.id] || { icon: <CreditCardIcon />, color: "#555" };
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.2 }}>
                      <Box sx={{ color: info.color, fontSize: "1.2rem", display: "flex", alignItems: "center" }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#111", fontSize: "0.92rem", lineHeight: 1.2 }}>
                          {method.GatewayName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#777", fontSize: "0.75rem" }}>
                          {method.id === 3 ? "Pay on delivery" : "Online Payment"}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              >
                {paymentMethods.map((method) => {
                  const isSelected = String(selectedPaymentMethod) === String(method.id);
                  const info = PAYMENT_METHODS_INFO[method.id] || { icon: <CreditCardIcon />, color: "#555" };
                  return (
                    <MenuItem
                      key={method.id}
                      value={String(method.id)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: isSelected ? "var(--checkout-primary-light, #faf4ee) !important" : "transparent",
                        "&:hover": {
                          bgcolor: "var(--checkout-primary-light, #faf4ee)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        <Box sx={{ color: info.color, fontSize: "1.3rem", display: "flex", alignItems: "center" }}>
                          {info.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: isSelected ? "var(--checkout-primary-text, #9c6d48)" : "#222", fontSize: "0.92rem" }}>
                            {method.GatewayName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#777", fontSize: "0.75rem", display: "block" }}>
                            {method.id === 3 ? "Pay on delivery" : "Online Payment"}
                          </Typography>
                        </Box>
                        {isSelected && (
                          <CheckCircleIcon sx={{ fontSize: 18, color: "var(--checkout-primary, #cca182)" }} />
                        )}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </Paper>
      )}

      {/* 4. Action Button: SKELETON (while loading) | LOG IN CTA (if guest) | CHECKOUT (if logged in) */}
      {isInitialLoading ? (
        <Skeleton
          variant="rectangular"
          height={54}
          sx={{ borderRadius: "4px" }}
        />
      ) : !islogin ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push(`/LoginOption?LoginRedirect=${encodeURIComponent("/cartPage")}`)}
            className="btnColorProCatProduct testCheckout_primary_btn"
            sx={{
              py: 1.8,
              fontSize: "1.05rem",
              fontWeight: 700,
              letterSpacing: "1px",
              borderRadius: "4px",
              textTransform: "uppercase",
              bgcolor: "var(--checkout-primary, #cca182)",
              color: "var(--checkout-btn-color, #ffffff)",
              "&:hover": {
                bgcolor: "var(--checkout-primary-hover, #b88d6e)",
              },
            }}
          >
            LOG IN TO PROCEED
          </Button>
          <Typography
            variant="caption"
            sx={{ color: "#888888", textAlign: "center", fontSize: "0.8rem", mt: 0.3 }}
          >
            Please log in to set your delivery address and complete your purchase.
          </Typography>
        </Box>
      ) : (
        <Button
          variant="contained"
          fullWidth
          disabled={isPlacingOrder}
          onClick={onCheckout}
          className="btnColorProCatProduct testCheckout_primary_btn"
          sx={{
            py: 1.8,
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "1px",
            borderRadius: "4px",
            textTransform: "uppercase",
            bgcolor: "var(--checkout-primary, #cca182)",
            color: "var(--checkout-btn-color, #ffffff)",
            "&:hover": {
              bgcolor: "var(--checkout-primary-hover, #b88d6e)",
            },
          }}
        >
          {isPlacingOrder ? (
            <CircularProgress size={24} sx={{ color: "var(--checkout-btn-color, #fff)" }} />
          ) : (
            "CHECKOUT"
          )}
        </Button>
      )}

      {/* 5. Need Help Support Strip */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="#111" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.82rem" }}>
          Contact us: {storeinit?.companysupportemail}
        </Typography>
      </Box>

      {/* Address Selection & Add Drawer */}
      <AddressDrawer
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addressList={addressList}
        selectedAddress={selectedAddress}
        onSelectAddress={onSelectAddress}
        onAddNewAddress={onAddNewAddress}
      />

      {/* Order Remark Modal */}
      <OrderRemarkModal
        open={isOrderRemarkModalOpen}
        onClose={() => setIsOrderRemarkModalOpen(false)}
        initialRemark={orderRemark}
        onSave={onSaveOrderRemark}
      />
    </Box>
  );
}
