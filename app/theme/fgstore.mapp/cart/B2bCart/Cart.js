"use client";

import React, { useState } from 'react';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import CartDetails from './CartDetails';
import CartList from './CartList';
import SelectedItemsModal from './SelectedModal';
import { Button, Box, IconButton, Typography } from '@mui/material';
import './smr_cartPage.scss';
import { Checkbox, FormControlLabel, Link, useMediaQuery } from '@mui/material';
import CartPageSkeleton from './CartSkelton';
import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import MobileCartDetails from "./MobileCartDetails"
import { handlePaymentAPI } from '@/app/(core)/utils/API/OrderFlow/PlaceOrderAPI';
import { toast } from 'react-toastify';
import PrintIcon from '@mui/icons-material/Print';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import MobileNavbar from './NavigationBar';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import { getButtonStyle } from '@/app/(core)/constants/MobileAppTheme';


const CartPage = ({ storeinit, visiterId, islogin, setCartCountNum }) => {

  const {
    isloding,
    ispriceloding,
    selectedItem,
    selectedItems,
    multiSelect,
    openModal,
    showRemark,
    productRemark,
    qtyCount,
    sizeCombo,
    CurrencyData,
    mrpbasedPriceFlag,
    openMobileModal,
    finalCartData,
    isSelectedAll,
    handleSelectAll,
    handlecloseMobileModal,
    CartCardImageFunc,
    handleSelectItem,
    handleIncrement,
    handleDecrement,
    handleOpenModal,
    handleCloseModal,
    handleRemarkChange,
    handleSave,
    handleCancel,
    handleAddReamrk,
    handleRemoveItem,
    handleRemoveAll,
    handleUpdateCart,
    handleCancelUpdateCart,
    handleMetalTypeChange,
    handleMetalColorChange,
    handleDiamondChange,
    handleColorStoneChange,
    handleSizeChange,
    decodeEntities,
    handleMoveToDetail,
    handelMenu
  } = useCart()

  const location = useNextRouterLikeRR();
  const navigate = location.push;

  const storeInit = storeinit;
  const [dialogOpen, setDialogOpen] = useState(false);
  const setCartCountVal = setCartCountNum;
  const isLargeScreen = useMediaQuery('(min-width:1000px)');
  const isMobileScreen = useMediaQuery('(max-width:768px)');

  const redirectUrl = `/LoginOption/?LoginRedirect=/delivery`;

  const handlePlaceOrder = () => {
    if (storeInit?.IsPLW == 0) {
      let priceData = finalCartData?.reduce(
        (total, item) => total + item?.FinalCost,
        0
      );
      sessionStorage.setItem("TotalPriceData", priceData);
      if (storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null) {
        navigate(redirectUrl);
      } else {
        navigate("/delivery", { replace: true });
      }
    } else {
      handlePay();
    }
    window.scrollTo(0, 0);
  }

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };


  const handleConfirmRemoveAll = async () => {
    setDialogOpen(false);
    const returnValue = await handleRemoveAll();
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setCartCountVal(res?.cartcount);
      })
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handlePay = async () => {
    const paymentResponse = await handlePaymentAPI(visiterId, islogin);
    if (paymentResponse?.Data?.rd[0]?.stat == 1) {
      let num = paymentResponse.Data?.rd[0]?.orderno
      sessionStorage.setItem('orderNumber', num);
      navigate('/confirmation');
      GetCountAPI().then((res) => {
        setCartCountVal(res?.cartcount)
      })
    } else {
      toast.error('Something went wrong!')
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <MobileNavbar />
      {!isloding && finalCartData?.length != 0 && (
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            background: "#fff"
          }}
        >
          <Button
            variant="text"
            onClick={handleRemoveAllDialog}
            sx={{
              fontSize: "0.8rem",
              textTransform: "none",
              color: "#777"
            }}
          >
            CLEAR ALL
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Button
              variant="contained"
              onClick={handlePlaceOrder}
              sx={getButtonStyle(true, {
                py: 0.8,
                borderRadius: "8px"
              })}
            >
              Place Order
            </Button>
            {storeInit?.IsPLW === 1 && <IconButton size="small" variant="outlined" sx={{ border: '1px solid grey !important', color: '#7d7f85' }} onClick={handlePrint}>
              <LocalPrintshopRoundedIcon fontSize="small" />
            </IconButton>}
          </Box>
        </Box>
      )}
      <div className='smr_MainBGDiv'

      >
        <div className='cartMainPageDiv'>
          {!isloding ? (
            <>
              <div style={{ marginLeft: '35px' }}>
                {multiSelect &&
                  <FormControlLabel
                    control={<Checkbox
                      sx={{
                        color: "rgba(125, 127, 133, 0.4) !important",
                      }}
                    />}
                    label="Select All"
                    checked={isSelectedAll()}
                    onChange={handleSelectAll}
                    sx={{
                      color: "rgba(125, 127, 133, 0.4)",
                    }}
                  />
                }
              </div>
              {finalCartData.length !== 0 ? (
                <div className="smr_cartMainPage">
                  <div className="smr_cart-left-sides">
                    <CartList
                      items={finalCartData}
                      CartCardImageFunc={CartCardImageFunc}
                      showRemark={showRemark}
                      productRemark={productRemark}
                      CurrencyData={CurrencyData}
                      decodeEntities={decodeEntities}
                      onSelect={handleSelectItem}
                      selectedItem={selectedItem}
                      selectedItems={selectedItems}
                      multiSelect={multiSelect}
                      onRemove={handleRemoveItem}
                      handleAddReamrk={handleAddReamrk}
                      handleRemarkChange={handleRemarkChange}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                      visiterId={visiterId}
                      storeinit={storeinit}
                      openHandleUpdateCartModal={handleOpenModal}
                    />
                  </div>
                  <div className="smr_cart-right-side">
                    {isLargeScreen ? (
                      <div className='smr_pc-cartDetail'>
                        {selectedItem && (
                          <CartDetails
                            ispriceloding={ispriceloding}
                            selectedItem={selectedItem}
                            CartCardImageFunc={CartCardImageFunc}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                            qtyCount={qtyCount}
                            multiSelect={multiSelect}
                            sizeCombo={sizeCombo}
                            storeinit={storeinit}
                            CurrencyData={CurrencyData}
                            mrpbasedPriceFlag={mrpbasedPriceFlag}
                            handleMetalTypeChange={handleMetalTypeChange}
                            handleMetalColorChange={handleMetalColorChange}
                            handleDiamondChange={handleDiamondChange}
                            handleColorStoneChange={handleColorStoneChange}
                            handleSizeChange={handleSizeChange}
                            decodeEntities={decodeEntities}
                            onUpdateCart={handleUpdateCart}
                            handleMoveToDetail={handleMoveToDetail}
                          />
                        )}
                      </div>
                    ) :
                      <div className='smr_mobile-cartDetails'>
                        <MobileCartDetails
                          open={openMobileModal}
                          handleClose={handlecloseMobileModal}
                          ispriceloding={ispriceloding}
                          selectedItem={selectedItem}
                          CartCardImageFunc={CartCardImageFunc}
                          handleIncrement={handleIncrement}
                          handleDecrement={handleDecrement}
                          qtyCount={qtyCount}
                          multiSelect={multiSelect}
                          sizeCombo={sizeCombo}
                          storeinit={storeinit}
                          CurrencyData={CurrencyData}
                          mrpbasedPriceFlag={mrpbasedPriceFlag}
                          handleMetalTypeChange={handleMetalTypeChange}
                          handleMetalColorChange={handleMetalColorChange}
                          handleDiamondChange={handleDiamondChange}
                          handleColorStoneChange={handleColorStoneChange}
                          handleSizeChange={handleSizeChange}
                          decodeEntities={decodeEntities}
                          onUpdateCart={handleUpdateCart}
                          handleMoveToDetail={handleMoveToDetail}
                        />
                      </div>
                    }
                  </div>
                  <SelectedItemsModal
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedItems={selectedItems}
                    onRemove={handleRemoveItem}
                    onUpdateCart={handleUpdateCart}
                    onCancelCart={handleCancelUpdateCart}
                  />
                </div>
              ) : (
                <NoResults
                  onClick={handelMenu}
                />
              )}
            </>
          ) :
            <CartPageSkeleton />
          }

          <ConfirmationDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            onConfirm={handleConfirmRemoveAll}
            title="Confirm"
            content="Are you sure you want to remove all Items?"
          />
        </div>

      </div>
    </>
  );
};

export default CartPage;




const NoResults = ({ onClick }) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        backgroundColor: "#fff",
      }}
    >
      <Box
        component="img"
        src="/Assets/mepty_cart.svg"
        alt="No search results"
        sx={{
          width: 180,
          height: 180,
          mb: 3,
          opacity: 0.8,
        }}
      />

      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 1 }}
      >
        No Data Found!
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 260, mb: 3 }}
      >
        Please First Add Product in Cart
      </Typography>

      <Button
        variant="contained"
        size="medium"

        sx={{
          textTransform: "none",
          px: 4,
          boxShadow: 'none',
          bgcolor: '#1a6bff',
          fontWeight: 600,
          color: '#fff'
        }}
        onClick={onClick}
      >
        Browse our collection
      </Button>
    </Box>
  );
};
