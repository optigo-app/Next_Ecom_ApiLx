"use client";

import React, { useState } from 'react';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import CartDetails from './CartDetails';
import CartList from './CartList';
import SelectedItemsModal from './SelectedModal';
import Button from '@mui/material/Button';
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


const CartPage = ({ storeinit, visiterId, islogin, setCartCountNum }) => {
console.log("TCL: CartPage -> setCartCountNum", setCartCountNum)

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
    <div className='smr_MainBGDiv'>
      <div className='cartMainPageDiv'>
        <div className="cartBtnGroupMainDiv">
          {isMobileScreen &&
            <div className="smr_cart-title">My Cart</div>
          }
          <div className='smr_cartmainRowDiv'>
            {!isloding && finalCartData?.length != 0 &&
              <div className='smr_cartButton-groups'>
                <Link
                  className='smr_ReomoveAllCartbtn'
                  variant="body2"
                  onClick={handleRemoveAllDialog}
                >
                  Clear All
                </Link>
              </div>
            }
            {!isMobileScreen &&
              <div className="smr_cart-title">My Cart</div>
            }
            {!isloding && finalCartData?.length != 0 &&
              <div className='smr_placeOrderMainbtnDivs'>
                {storeInit?.IsPLW === 1 &&
                  <Button variant="outlined" sx={{ border: '1px solid grey !important', color: '#7d7f85' }} startIcon={<PrintIcon />} onClick={handlePrint}>
                    Print
                  </Button>
                }
                <button className="smr_place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
              </div>
            }
          </div>
        </div>
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
            ) :
              <div className='smr_noCartlistData'>
                <p className='smr_title'>No Data Found!</p>
                <p className='smr_desc'>Please First Add Product in Cart</p>
                <button className='smr_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
              </div>
            }
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

        {/* <Footer /> */}
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
        <p
          className="backtotop_Smr"
        
        style={{ margin: '0px', fontWeight: 500, color: 'white', cursor: 'pointer' }} onClick={scrollToTop}>BACK TO TOP</p>
      </div> */}
    </div>
  );
};

export default CartPage;
