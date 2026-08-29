"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { handelOpenMenu } from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu";

import { useTestCheckout } from "@/app/components/testcheckout/hooks/useTestCheckout";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import ShoppingBagList from "@/app/components/testcheckout/components/ShoppingBagList";
import CheckoutPanel from "@/app/components/testcheckout/components/CheckoutPanel";
import ItemCustomizationPanel from "@/app/components/testcheckout/components/ItemCustomizationPanel";
import OrderProcessingBackdrop from "@/app/components/testcheckout/components/OrderProcessingBackdrop";
import "../styles/testCheckout.scss";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { CheckoutThemeProvider } from "@/app/components/testcheckout/theme/checkoutTheme";

export default function TestCheckoutMain({ theme: customTheme }) {
  const router = useRouter();
  const { storeInit } = useStore();
  const checkout = useTestCheckout(storeInit);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  const {
    cartItems,
    isLoadingCart,
    isPriceLoading,
    // Order Summary & Tax
    subtotal,
    estimatedTax,
    totalAmount,
    isLoadingTax,
    currencyCode,
    formatter,

    // Edit Mode
    editingItem,
    customizingItem,
    editQty,
    sizeCombo,
    metalTypeCombo,
    metalColorCombo,
    diamondQualityColorCombo,
    colorStoneCombo,
    handleStartEdit,
    handleCancelEdit,
    handleCustomizationChange,
    handleEditQtyChange,
    handleApplyCustomization,

    // Cart Actions
    handleRemoveItem,
    handleRemoveAll,
    handleSaveProductRemark,
    handleMoveToDetail,

    // Address
    addressList,
    selectedAddress,
    isLoadingAddress,
    handleSelectAddress,
    handleAddNewAddress,

    // Order Remarks
    orderRemark,
    handleSaveOrderRemark,

    // Payment & Checkout
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isPlacingOrder,
    isOrderSuccess,
    orderNumber,
    handleCheckout,
  } = checkout;

  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const isEmptyCart = !isLoadingCart && (!cartItems || cartItems.length === 0);

  const handleBrowseCollection = async () => {
    try {
      const url = await handelOpenMenu();
      if (url && url !== "/") {
        router.push(url);
      } else {
        const firstUrl =
          typeof window !== "undefined"
            ? sessionStorage.getItem("firstAlbumUrl")
            : null;
        if (firstUrl) {
          router.push(firstUrl);
        } else {
          router.push("/");
        }
      }
    } catch (e) {
      console.error("Browse collection error:", e);
      router.push("/");
    }
  };

  return (
    <CheckoutThemeProvider
      theme={customTheme}
      fallbackBrand={storeInit?.domain}
    >
      <div className="testCheckout_wrapper">
        <Container
          maxWidth="false"
          className="testCheckout_wrapper_Container"
          sx={{
            pb: { xs: 8, sm: 10, md: 14 },
          }}
        >
          {/* Header Navigation */}
          <Box
            sx={{
              py: { xs: 2, md: 3 },
              px: { xs: "48px", sm: "60px", md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              mb: { xs: 2, md: 3 },
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {/* Back to Home / Collection Button on Left */}
            <IconButton
              onClick={handleBrowseCollection}
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#333",
                border: "1px solid #eee",
                borderRadius: "1%",
                width: { xs: 34, sm: 38 },
                height: { xs: 34, sm: 38 },
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "#ccc",
                },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            {/* Centered Modern Header Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 400,
                fontSize: { xs: "1.15rem", sm: "1.6rem", md: "1.9rem" },
                letterSpacing: { xs: "0.5px", sm: "1.2px" },
                color: "#111",
                fontFamily: "inherit",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              My Shopping Bag
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#777",
                mt: 0.3,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                fontWeight: 600,
                letterSpacing: "0.3px",
              }}
            >
              {cartItems?.length || 0} items in your bag
            </Typography>

            {/* Clear All Button on Right */}
            {!isEmptyCart && (
              <Button
                size="small"
                onClick={() => setIsClearAllDialogOpen(true)}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#777",
                  fontSize: { xs: "0.72rem", sm: "0.84rem" },
                  fontWeight: 600,
                  textTransform: "none",
                  textDecoration: "underline",
                  letterSpacing: "0.3px",
                  p: { xs: 0.5, sm: 1 },
                  "&:hover": {
                    color: "#d32f2f",
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Clear All
              </Button>
            )}
          </Box>

          {/* When Bag is Empty: Full-width Clean Centered Empty State (Hides checkout panel) */}
          {isEmptyCart ? (
            <Box
              sx={{
                py: { xs: 8, sm: 10, md: 12 },
                px: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "45vh",
              }}
            >
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  bgcolor: "#f9fafb",
                  border: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{ fontSize: 38, color: "#9ca3af" }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  letterSpacing: "0.3px",
                  color: "#111827",
                  fontFamily: "inherit",
                  mb: 1,
                }}
              >
                Your shopping bag is empty
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#6b7280",
                  fontSize: { xs: "0.88rem", sm: "0.95rem" },
                  maxWidth: 420,
                  mb: 3.5,
                  lineHeight: 1.6,
                }}
              >
                Explore our collection and add your favorite pieces to the cart.
              </Typography>

              <Button
                variant="contained"
                onClick={handleBrowseCollection}
                className="testCheckout_primary_btn"
                sx={{
                  bgcolor: "var(--checkout-primary, #cca182)",
                  color: "var(--checkout-btn-color, #fff)",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  letterSpacing: "0.3px",
                  px: 4.5,
                  py: 1.25,
                  borderRadius: "6px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "var(--checkout-primary-hover, #b88d6e)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                Browse Our Collection
              </Button>
            </Box>
          ) : (
            /* Main Content Layout with Cart & Checkout Panels */
            <Grid
              container
              spacing={{ xs: 3, md: 4, lg: 5 }}
              alignItems="flex-start"
            >
              {/* Left Column: Cart Items List */}
              <Grid
                size={{
                  xs: 12,
                  lg: 7,
                  xl: 7.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  <ShoppingBagList
                    cartItems={cartItems}
                    isLoading={isLoadingCart}
                    storeinit={storeInit}
                    currencyCode={currencyCode}
                    formatter={formatter}
                    editingItem={editingItem}
                    onStartEdit={handleStartEdit}
                    onRemoveItem={handleRemoveItem}
                    onSaveProductRemark={handleSaveProductRemark}
                    handleMoveToDetail={handleMoveToDetail}
                  />
                </Box>
              </Grid>

              {/* Right Column: Checkout Panel OR Customization Panel - Sticky */}
              <Grid
                size={{
                  xs: 12,
                  lg: 5,
                  xl: 4.5,
                }}
                sx={{
                  position: { lg: "sticky" },
                  top: { lg: "80px" },
                  alignSelf: "flex-start",
                  zIndex: 10,
                }}
              >
                <Box>
                  {/* On Desktop: Show Customization inline when editing, else CheckoutPanel */}
                  {!isMobileOrTablet && editingItem ? (
                    <ItemCustomizationPanel
                      isDrawer={false}
                      customizingItem={customizingItem}
                      storeinit={storeInit}
                      currencyCode={currencyCode}
                      formatter={formatter}
                      isPriceLoading={isPriceLoading}
                      metalTypeCombo={metalTypeCombo}
                      metalColorCombo={metalColorCombo}
                      diamondQualityColorCombo={diamondQualityColorCombo}
                      colorStoneCombo={colorStoneCombo}
                      sizeCombo={sizeCombo}
                      editQty={editQty}
                      onCustomizationChange={handleCustomizationChange}
                      onEditQtyChange={handleEditQtyChange}
                      onApply={handleApplyCustomization}
                      onCancel={handleCancelEdit}
                      handleMoveToDetail={handleMoveToDetail}
                    />
                  ) : (
                    <CheckoutPanel
                      storeinit={storeInit}
                      currencyCode={currencyCode}
                      formatter={formatter}
                      subtotal={subtotal}
                      estimatedTax={estimatedTax}
                      totalAmount={totalAmount}
                      isLoadingCart={isLoadingCart}
                      isLoadingTax={isLoadingTax || isLoadingCart}
                      addressList={addressList}
                      selectedAddress={selectedAddress}
                      isLoadingAddress={isLoadingAddress || isLoadingCart}
                      onSelectAddress={handleSelectAddress}
                      onAddNewAddress={handleAddNewAddress}
                      orderRemark={orderRemark}
                      onSaveOrderRemark={handleSaveOrderRemark}
                      paymentMethods={paymentMethods}
                      selectedPaymentMethod={selectedPaymentMethod}
                      onSelectPaymentMethod={setSelectedPaymentMethod}
                      isPlacingOrder={isPlacingOrder}
                      onCheckout={handleCheckout}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Mobile Slide-Over Drawer for Customization */}
          {isMobileOrTablet && editingItem && (
            <ItemCustomizationPanel
              isDrawer={true}
              open={Boolean(editingItem)}
              customizingItem={customizingItem}
              storeinit={storeInit}
              currencyCode={currencyCode}
              formatter={formatter}
              isPriceLoading={isPriceLoading}
              metalTypeCombo={metalTypeCombo}
              metalColorCombo={metalColorCombo}
              diamondQualityColorCombo={diamondQualityColorCombo}
              colorStoneCombo={colorStoneCombo}
              sizeCombo={sizeCombo}
              editQty={editQty}
              onCustomizationChange={handleCustomizationChange}
              onEditQtyChange={handleEditQtyChange}
              onApply={handleApplyCustomization}
              onCancel={handleCancelEdit}
              handleMoveToDetail={handleMoveToDetail}
            />
          )}
          {/* Full-Screen Order Processing & Success Backdrop Overlay */}
          <OrderProcessingBackdrop
            open={isPlacingOrder || isOrderSuccess}
            isSuccess={isOrderSuccess}
            orderNumber={orderNumber}
          />

          {/* Confirmation Dialog for Clear All */}
          <ConfirmationDialog
            open={isClearAllDialogOpen}
            onClose={() => setIsClearAllDialogOpen(false)}
            onConfirm={async () => {
              setIsClearAllDialogOpen(false);
              await handleRemoveAll();
            }}
            title="Clear Shopping Bag"
            content="Are you sure you want to remove all items from your shopping bag?"
          />
        </Container>
      </div>
    </CheckoutThemeProvider>
  );
}
