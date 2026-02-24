import React, { useEffect, useState } from 'react';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import CartDetails from './CartDetails';
import CartList from './CartList';
import SelectedItemsModal from './SelectedModal';
import './smr3_cartPage.scss';
import { Checkbox, FormControlLabel, Link, useMediaQuery } from '@mui/material';
import CartPageSkeleton from './CartSkelton';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import MobileCartDetails from "./MobileCartDetails"
import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const CartPage = ({ storeinit, visiterId }) => {

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
  } = useCart();

  const location = useNextRouterLikeRR();
  const navigate = location?.push;
  const { islogin, setCartCountNum } = useStore();

  const storeInit = storeinit;
  const [dialogOpen, setDialogOpen] = useState(false);
  const setCartCountVal = setCartCountNum;
  const isLargeScreen = useMediaQuery('(min-width:1000px)');
  const isMobileScreen = useMediaQuery('(max-width:768px)');

  const redirectUrl = `/loginOption/?LoginRedirect=/delivery`;
  const handlePlaceOrder = () => {
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
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [])


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

  return (
    <div className='smr3_MainBGDiv'>
      {isMobileScreen &&
        <div className="smr3_cart-title">Cart</div>
      }
      <div className='cartMainPageDiv'>
        <div className="cartBtnGroupMainDiv">
          {!isloding && finalCartData.length !== 0 &&
            <div className='smr3_cartButton-groups'>
              <Link
                className='smr3_ReomoveAllCartbtn'
                variant="body2"
                onClick={handleRemoveAllDialog}
              >
                Clear All
              </Link>
            </div>
          }{!isMobileScreen &&
            <div className="smr3_cart-title">My Cart</div>
          }
          {!isloding && finalCartData.length !== 0 &&
            <div className='smr3_placeOrderMainbtnDivs'>
              <button onClick={handlePlaceOrder}>Place Order</button>
            </div>
          }
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
            {!isloding && finalCartData.length != 0 ? (
              <div className="smr3_cartMainPage">
                <div className="smr3_cart-left-sides">
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
                    openHandleUpdateCartModal={handleOpenModal}
                    storeInit={storeInit}
                    visiterId={visiterId}
                  />
                </div>
                <div className="smr3_cart-right-side">
                  {isLargeScreen ? (
                    <div className='smr3_pc-cartDetail'>
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
                          storeInit={storeInit}
                          visiterId={visiterId}
                        />
                      )}
                    </div>
                  ) :
                    <div className='smr3_mobile-cartDetails'>
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
                        storeInit={storeInit}
                        visiterId={visiterId}
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
              <div className='smr3_noCartlistData'>
                <p className='smr3_title'>No Data Found!</p>
                <p className='smr3_desc'>Please First Add Product in Cart</p>
                <button className='smr3_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
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
