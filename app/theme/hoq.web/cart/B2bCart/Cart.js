import React, { useEffect, useState } from "react";
import useCart from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart";
import CartDetails from "./CartDetails";
import CartList from "./CartList";
import SelectedItemsModal from "./SelectedModal";
import "./hoq_cartPage.scss";
import {
  Checkbox,
  FormControlLabel,
  Link,
  useMediaQuery,
} from "@mui/material";
import CartPageSkeleton from "./CartSkelton";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import MobileCartDetails from "./MobileCartDetails";
import { handlePaymentAPI } from "@/app/(core)/utils/API/OrderFlow/PlaceOrderAPI";
import { toast } from "react-toastify";
import { useAddress } from "@/app/(core)/utils/Glob_Functions/OrderFlow/useAddress";
import Cookies from "js-cookie";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const CartPage = ({ storeinit, visiterId }) => {
  const addressData = useAddress();

  const {
    isloding,
    ispriceloding,
    cartData,
    selectedItem,
    selectedItems,
    multiSelect,
    openModal,
    showRemark,
    productRemark,
    qtyCount,
    sizeCombo,
    CurrencyData,
    countData,
    mrpbasedPriceFlag,
    openMobileModal,
    setOpenMobileModal,
    finalCartData,
    isSelectedAll,
    handleSelectAll,
    handlecloseMobileModal,
    CartCardImageFunc,
    handleSelectItem,
    handleIncrement,
    handleDecrement,
    handleMultiSelectToggle,
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
    handelMenu,
  } = useCart();

  const location = useNextRouterLikeRR();
  const navigate = location.push;
  const { islogin, setCartCountNum } = useStore();

  const storeInit = storeinit;
  const [defaultAddr, setDefaultAddr] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [countstatus, setCountStatus] = useState();
  const setCartCountVal = setCartCountNum;
  const isLargeScreen = useMediaQuery("(min-width:1000px)");
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  const handlePlaceOrder = () => {
    if (storeInit?.IsPLW == 0) {
      let priceData = finalCartData.reduce(
        (total, item) => total + item?.FinalCost,
        0
      );
      sessionStorage.setItem("TotalPriceData", priceData);
      navigate("/delivery", { replace: true });
    } else {
      handlePay();
    }
    window.scrollTo(0, 0);
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const iswishUpdateStatus = sessionStorage.getItem("cartUpdation");
    setCountStatus(iswishUpdateStatus);
  }, [handleRemoveItem, handleRemoveAll]);

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirmRemoveAll = async () => {
    setDialogOpen(false);
    const returnValue = await handleRemoveAll();
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setCartCountVal(res?.cartcount);
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (storeInit?.IsPLW == 1) {
      if (addressData && addressData.addressData) {
        const defaultAddress = addressData.addressData.find(
          (addr) => addr?.isdefault === 1
        );

        if (defaultAddress) {
          setDefaultAddr(defaultAddress);
        } else {
          console.log("No default address found.");
        }
      }
    }
  }, []);

  const handlePay = async () => {
    const visiterId = Cookies.get("visiterId");
    const paymentResponse = await handlePaymentAPI(visiterId, islogin);

    if (paymentResponse?.Data?.rd[0]?.stat == 1) {
      let num = paymentResponse.Data?.rd[0]?.orderno;
      sessionStorage.setItem("orderNumber", num);
      navigate("/Confirmation");
      GetCountAPI().then((res) => {
        console.log("responseCount", res);
        setCartCountVal(res?.cartcount);
      });
    } else {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="hoq_MainBGDiv" style={{ backgroundColor: "white" }}>
      <div className="cartMainPageDiv">
        <div className="cartBtnGroupMainDiv">
          {isMobileScreen && <div className="hoq_cart-title">My Cart</div>}
          <div className="hoq_cartmainRowDiv">
            {!isloding && finalCartData.length != 0 && (
              <div className="hoq_cartButton-groups">
                <Link
                  className="hoq_ReomoveAllCartbtn"
                  variant="body2"
                  onClick={handleRemoveAllDialog}
                >
                  Clear All
                </Link>
              </div>
            )}
            {!isMobileScreen && <div className="hoq_cart-title">My Cart</div>}
            {!isloding && finalCartData.length != 0 && (
              <div className="hoq_placeOrderMainbtnDivs">
                <button
                  className="hoq_place-order-btn"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            )}
          </div>

          {/* {!isloding && cartData.length != 0 &&
            <>
              <div className="hoq_cartButton-group">
                <button className="hoq_cartBtn hoq_cartActivebtn">List View</button>
                <button className='hoq_cartBtn'>Image View</button>
                <button className='hoq_cartBtn' onClick={handleRemoveAll}>Clear All</button>
                <div>
                  <Link
                    className='hoq_ReomoveAllCartbtn'
                    variant="body2"
                    onClick={handleRemoveAllDialog}
                  >
                    Clear All
                  </Link>
                  <Link
                    className='hoq_ReomoveAllCartbtn hoq_SelectAllCartbtn'
                    variant="body2"
                    onClick={handleMultiSelectToggle}
                  >
                    {multiSelect ? 'Disable MultiSelect' : 'Enable MultiSelect'}
                  </Link>
                </div>

                <button className='hoq_cartBtn'>Show ProductList</button>

                <button className='hoq_cartBtn' onClick={handleMultiSelectToggle}>{multiSelect ? 'Disable MultiSelect' : 'Select All'}</button>
                {multiSelect && selectedItems.length != 0 &&
                  <button className='hoq_cartBtn' onClick={handleOpenModal} >Show Selected Items</button>
                }
                <div className='hoq_placeOrderMobileMainbtnDiv'>
                  <button className="hoq_place-order-btnMobile" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </div>
              <div className='hoq_placeOrderMainbtnDiv'>
                <button className="hoq_place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
              </div>
            </>
          } */}
        </div>
        {!isloding ? (
          <>
            <div style={{ marginLeft: "35px" }}>
              {multiSelect && (
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "rgba(125, 127, 133, 0.4) !important",
                      }}
                    />
                  }
                  label="Select All"
                  checked={isSelectedAll()}
                  onChange={handleSelectAll}
                  sx={{
                    color: "rgba(125, 127, 133, 0.4)",
                  }}
                />
              )}
            </div>
            {finalCartData.length !== 0 ? (
              <div className="hoq_cartMainPage">
                <div className="hoq_cart-left-sides">
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
                  />
                </div>
                <div className="hoq_cart-right-side">
                  {isLargeScreen ? (
                    <div className="hoq_pc-cartDetail">
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
                        />
                      )}
                    </div>
                  ) : (
                    <div className="hoq_mobile-cartDetails">
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
                      />
                    </div>
                  )}
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
              <div className="hoq_noCartlistData">
                <p className="hoq_title">No Data Found!</p>
                <p className="hoq_desc">Please First Add Product in Cart</p>
                <button
                  className="hoq_browseOurCollectionbtn"
                  style={{ backgroundColor: "#c20000" }}
                  onClick={handelMenu}
                >
                  Browse our collection
                </button>
              </div>
            )}
          </>
        ) : (
          <CartPageSkeleton />
        )}

        <ConfirmationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemoveAll}
          title="Confirm"
          content="Are you sure you want to remove all Items?"
        />
      </div>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBlock: "30px",
        }}
      >
        <p
          style={{
            margin: "0px",
            fontWeight: 500,
            color: "white",
            cursor: "pointer",
          }}
          onClick={scrollToTop}
        >
          BACK TO TOP
        </p>
      </div> */}
    </div>
  );
};

export default CartPage;
