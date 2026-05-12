'use client'
import React, { useEffect, useState } from "react";
import "./elv_cartPage.scss";
import useCart from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart";
import CartDetails from "./CartDetails";
import CartList from "./CartList";
import Modal from "@mui/material/Modal";
import SelectedItemsModal from "./SelectedModal";
import SellIcon from "@mui/icons-material/Sell";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import { Box, Breadcrumbs, CircularProgress, FormControl, Grid, Typography, useMediaQuery } from "@mui/material";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import RemarkDialog from "./OrderRemarkDialog";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { handleOrderRemark } from "@/app/(core)/utils/API/OrderRemarkAPI/OrderRemarkAPI";
import MobileCartDetails from "./MobileCartDetails";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import DiscountPopUp from "./DiscountPopUp";
import { DiscountMasterAPI } from "@/app/(core)/utils/API/DiscountMaster/DiscountMaster";
import { IoBagCheckOutline } from "react-icons/io5";
import CartHeader from "./New/CartHeader";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNavigate } from "@/app/(core)/hooks/useLocationRd";
import { getSession } from "@/app/(core)/utils/FetchSessionData";


const IsSetupFor = false;

const calculateOtherCost = (item) => {
  const src = item?.singleProd1 ?? item?.singleProd ?? item;

  return (
    (Number(src?.Other_Cost) || 0) +
    (Number(src?.Size_MarkUp) || 0) +
    (Number(src?.DesignMarkUpAmount) || 0) +
    (Number(src?.ColorStone_SettingCost) || 0) +
    (Number(src?.Diamond_SettingCost) || 0) +
    (Number(src?.Misc_SettingCost) || 0)
  );
};



const calcCartMasterSummary = (items) => {
  let finalCartAmt = 0;
  let totalGwt = 0;
  let totalNwt = 0;

  let totalDwt = 0;
  let totalDpcs = 0;

  let totalCSwt = 0;
  let totalCSpcs = 0;

  let MetalCost = 0;
  let DiamondCost = 0;
  let MiscCost = 0;
  let LabourCost = 0;
  let ColorStoneCost = 0;
  let OtherCost = 0;

  items.forEach((item) => {
    const qty = Number(item?.Quantity) || 1;

    totalGwt += (Number(item?.Gwt) || 0) * qty;
    totalNwt += (Number(item?.CW_Nwt) || 0) * qty;

    totalDwt += (Number(item?.Dwt) || 0) * qty;
    totalDpcs += (Number(item?.Dpcs) || 0) * qty;

    totalCSwt += (Number(item?.CSwt) || 0) * qty;
    totalCSpcs += (Number(item?.CSpcs) || 0) * qty;

    MetalCost += (Number(item?.Metal_Cost) || 0) * qty;
    MiscCost += (Number(item?.Misc_Cost) || 0) * qty;
    DiamondCost += (Number(item?.Diamond_Cost) || 0) * qty;
    LabourCost += (Number(item?.Labour_Cost) || 0) * qty;
    ColorStoneCost += (Number(item?.ColorStone_Cost) || 0) * qty;
    OtherCost += calculateOtherCost(item) * qty;

  });


  // FIX: finalCartAmt must be calculated — it was commented out and always 0
  finalCartAmt = items.reduce((total, item) => {
    const qty = Number(item?.Quantity) || 1;
    const cost = Number(item?.FinalCost) || 0;
    return total + cost * qty;
  }, 0);


  const dwtPerPiece = totalDpcs > 0 ? totalDwt / totalDpcs : 0;
  const cswtPerPiece = totalCSpcs > 0 ? totalCSwt / totalCSpcs : 0;


  const summary = {
    totalGwt,
    totalNwt,
    totalDwt,
    totalDpcs,
    dwtPerPiece,
    totalCSwt,
    totalCSpcs,
    cswtPerPiece,
    finalCartAmt,
    MetalCost,
    DiamondCost,
    LabourCost,
    OtherCost,
    ColorStoneCost,
    MiscCost
  };

  sessionStorage.setItem("CartSummary", JSON.stringify(summary));

  return summary;
};

const ElveeCartPage = ({ storeinit, visiterId }) => {
  const noImageFound = `image-not-found.jpg`
  const { isloding,
    shouldRecalculate, setShouldRecalculate,
    ispriceloding, cartData, finalCartData, selectedItem, selectedItems, multiSelect, openModal, showRemark, productRemark, qtyCount, sizeCombo, CurrencyData, countData, mrpbasedPriceFlag, openMobileModal, setOpenMobileModal, isSelectedAll, handleSelectAll, handlecloseMobileModal, CartCardImageFunc, handleSelectItem, handleIncrement, handleDecrement, handleMultiSelectToggle, handleOpenModal, handleCloseModal, handleRemarkChange, handleSave, handleCancel, handleAddReamrk, handleRemoveItem, handleRemoveAll, handleUpdateCart, handleCancelUpdateCart, handleMetalTypeChange, handleMetalColorChange, handleDiamondChange, handleColorStoneChange, handleSizeChange, decodeEntities, handleMoveToDetail, handelMenu } =
    useCart();
  const { finalId, cartCountNum, setCartCountNum,
    islogin,
    loginUserDetail
  } = useStore();
  const navigate = useNavigate();
  const isTabletResponsive = useMediaQuery("(max-width:1000px)");
  const isMobileResp1 = useMediaQuery("(max-width:800px)");
  const isMobileResp2 = useMediaQuery("(max-width:600px)");
  const isMobileResp3 = useMediaQuery("(max-width:425px)");
  useGlobalPreventSave();


  // FIX: Always derive totalPrice from finalCartData.
  // cartData is the raw API response and does NOT update when items are removed
  // (handleRemoveItem only updates finalCartData). Using cartData here caused
  // the price to never drop after removal.
  const getTotalPrice = [];
  let totalPrice;
  if (storeinit?.Themeno === 3) {
    totalPrice = finalCartData?.reduce((total, item) => total + (Number(item?.FinalCost) || 0), 0);
  } else {
    totalPrice = finalCartData?.reduce((total, item) => total + (Number(item?.FinalCost) || 0), 0);
  }
  getTotalPrice.push({ total: totalPrice });

  useEffect(() => {
    sessionStorage.setItem("totalProdPrice", JSON.stringify(getTotalPrice[0]));
  }, [getTotalPrice]);

  const [border, setBorder] = useState(false);
  const [open, setOpen] = useState(false);
  const [showRemark1, setShowRemark1] = useState(false);
  const [countStatus, setCountStatus] = useState();
  const [orderRemark, setOrderRemark] = useState();
  const [randomNumber, setRandomNumber] = useState("");
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const { broadcast } = useBroadcaster(); // Get the broadcaster
  const [summary, setSummary] = useState(null);


  const fetchCouponData = async (finalID) => {
    const response = await DiscountMasterAPI(finalID);
    if (response?.Data?.rd) {
      // const data = [...response?.Data?.rd , ...response?.Data?.rd ,...response?.Data?.rd ,...response?.Data?.rd,...response?.Data?.rd]
      setCouponData(response?.Data?.rd);
    } else {
      setCouponData([]);
    }
  };

  useEffect(() => {
    const GetOrderRemark = getSession("orderRemark");
    if (GetOrderRemark) {
      setOrderRemark(GetOrderRemark);
    }
    fetchCouponData(finalId);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => setShowRemark1(true);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => {
    setShowRemark1(false);
  };
  const handleOpenPriceModal = () => setOpenPriceModal(true);
  const handleClosePriceModal = () => setOpenPriceModal(false);

  useEffect(() => {
    const iswishUpdateStatus = sessionStorage.getItem("cartUpdation");
    setCountStatus(iswishUpdateStatus);
  }, [handleRemoveItem, handleRemoveAll]);

  const handleBorder = () => {
    setBorder(!border);
  };

  const handleRemarkChangeInternal = (e) => {
    setOrderRemark(e.target.value);
  };

  const handleSaveInternal = () => {
    handleOrderRemarkFun(orderRemark);
    setShowRemark1(false);
  };

  const handleConfirmRemoveAll = async () => {
    const returnValue = await handleRemoveAll();
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setCartCountNum(res?.cartcount);
        broadcast('UPDATE_CART_COUNT', res?.cartcount, "", "cart", "removeall");
      });
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
    width: 400,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 3,
  };

  const handleCloseRemove = () => {
    handleConfirmRemoveAll();
    handleClose();
  };

  const generateRandomNumber = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  useEffect(() => {
    setRandomNumber(generateRandomNumber(10));
  }, []);

  const handleMoveToOrder = () => {
    navigate("/Delivery", { replace: true });
    sessionStorage.setItem("iscartData", randomNumber);
  };

  const handleDiscountModalOpen = () => {
    if (IsSetupFor) {
      handleMoveToOrder();
      return;
    }
    setOpenDiscountModal(true);
  };

  const handleDiscountModalClose = () => {
    setOpenDiscountModal(false);
  };

  const handleOrderRemarkFun = async (remark) => {
    // setOrderRemark(remark);
    try {
      const response = await handleOrderRemark(remark);
      let resStatus = response?.Data?.rd[0];
      if (resStatus?.stat == 1) {
        // const updatedCartData = cartData.map(cart =>
        //     cart.id == data.id ? { ...cart, Remarks: resStatus?.design_remark } : cart
        // );
        sessionStorage.setItem("orderRemark", resStatus?.orderremarks);
        setOrderRemark(resStatus?.orderremarks);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // const summary = React.useMemo(() => {
  //   return calcCartMasterSummary(finalCartData || []);
  // }, [finalCartData]);
  // Modified useEffect to calculate only on load or explicit update

  useEffect(() => {
    console.log(shouldRecalculate, "shouldRecalculate")
    // Check if data exists AND if we are allowed to recalculate
    if (finalCartData?.length && shouldRecalculate) {
      const result = calcCartMasterSummary(finalCartData || []);
      console.log(result, "result")
      setSummary(result);

      // Turn off recalculation until an update happens
      setShouldRecalculate(false);
    }
  }, [finalCartData, shouldRecalculate]);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const hasItems = React.useMemo(() => (storeinit?.Themeno === 3 ? finalCartData.length : cartData.length) > 0, [finalCartData.length, cartData.length, storeinit?.Themeno]);

  if (!storeinit) {
    return null;
  }

  if (isloding) {
    return <div
      style={{
        width: " 100%",
        height: "100vh",
        zIndex: "100",
        background: "#83838333",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress sx={{ color: "#2e2d2d" }} />
      </Box>
    </div>
  }

  return (
    <>
      {openDiscountModal && <DiscountPopUp itemCount={finalCartData?.length} totalPrice={formatter(getTotalPrice[0]?.total)} CurrencyCode={loginUserDetail?.CurrencyCode ?? CurrencyData?.CurrencyCode} CouponList={couponData} open={openDiscountModal} onClose={handleDiscountModalClose} handleMoveToOrder={handleMoveToOrder} />}
      <Box
        sx={{
          boxSizing: 'border-box',
          px: { xs: 1, sm: 2, md: 4 },
          width: "100%",
        }}
      >
        {hasItems && <CartHeader count={finalCartData.length} AddOrderRemark={handleOrderRemarkFun} handleRemoveAll={handleConfirmRemoveAll} totalPrice={getTotalPrice[0]?.total} CurrencyCode={loginUserDetail?.CurrencyCode ?? CurrencyData?.CurrencyCode} IsPriceShow={storeinit?.IsPriceShow == 1} handleMoveToOrder={handleDiscountModalOpen} handleOpen1={handleOpen1} handleClose1={handleClose1} orderRemark={orderRemark} OrderMessage={orderRemark ? "View & Edit Order Remark" : "Add Order Remark"} openClearAllModal={handleOpen} closeClearAllModal={handleClose} summary={summary} />}

        <div className="elv_Productlists_Main_div">
          <div className="elv_Productlists_lists_div">
            <div className="elv_Productlists_lists_header">
              {hasItems ? (
                <div className="elv_cartDetailsData_div">
                  <div className="elv_CartProducts_div">
                    <Grid container spacing={1.5}
                      sx={{
                        width: '100%'
                      }}
                    >
                      <CartList items={finalCartData} CartCardImageFunc={CartCardImageFunc} showRemark={showRemark} productRemark={productRemark} CurrencyData={CurrencyData} decodeEntities={decodeEntities} onSelect={handleSelectItem} selectedItem={selectedItem} selectedItems={selectedItems} multiSelect={multiSelect} border={border} handleBorder={handleBorder} onRemove={handleRemoveItem} handleAddReamrk={handleAddReamrk} handleRemarkChange={handleRemarkChange} handleSave={handleSave} handleCancel={handleCancel} openHandleUpdateCartModal={handleOpenModal} showRemark1={showRemark1} handleClose1={handleClose1} />
                    </Grid>
                  </div>
                  <div className="elv_CartSingleProducts_div">
                    {!isTabletResponsive ? (
                      selectedItem && <CartDetails
                        count={finalCartData.length}
                        summary={summary}
                        ispriceloding={ispriceloding} selectedItem={selectedItem} CartCardImageFunc={CartCardImageFunc} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} multiSelect={multiSelect} sizeCombo={sizeCombo} CurrencyData={CurrencyData} mrpbasedPriceFlag={mrpbasedPriceFlag} handleMetalTypeChange={handleMetalTypeChange} handleMetalColorChange={handleMetalColorChange} handleDiamondChange={handleDiamondChange} handleColorStoneChange={handleColorStoneChange} handleSizeChange={handleSizeChange} decodeEntities={decodeEntities} onUpdateCart={handleUpdateCart} handleMoveToDetail={handleMoveToDetail} />
                    ) : (
                      <div className="elv_mobile-cartDetails">
                        <MobileCartDetails open={openMobileModal} handleClose={handlecloseMobileModal} ispriceloding={ispriceloding} selectedItem={selectedItem} CartCardImageFunc={CartCardImageFunc} handleIncrement={handleIncrement} handleDecrement={handleDecrement} qtyCount={qtyCount} multiSelect={multiSelect} sizeCombo={sizeCombo} CurrencyData={CurrencyData} mrpbasedPriceFlag={mrpbasedPriceFlag} handleMetalTypeChange={handleMetalTypeChange} handleMetalColorChange={handleMetalColorChange} handleDiamondChange={handleDiamondChange} handleColorStoneChange={handleColorStoneChange} handleSizeChange={handleSizeChange} decodeEntities={decodeEntities} onUpdateCart={handleUpdateCart} handleMoveToDetail={handleMoveToDetail} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyCartUI handelMenu={handelMenu} />
              )}
            </div>
          </div>
        </div>
      </Box>

      <RemarkDialog open1={showRemark1} onClose1={handleClose1} remark1={orderRemark} onRemarkChange1={handleRemarkChangeInternal} onSave1={handleOrderRemarkFun} />
      <ConfirmationDialog open={open} onClose={handleClose} onConfirm={handleCloseRemove} title={"Confirm"} content={"Are You Sure to Delete All these items?"} />
    </>
  );
};

export default ElveeCartPage;

const EmptyCartUI = React.memo(({ handelMenu }) => (
  <div className="elv_noCartlistData" style={{ paddingTop: "8rem" }}>
    <p className="elv_title">No Data Found!</p>
    <p className="elv_desc">Please First Add Product in Cart</p>
    <button className="elv_browseOurCollectionbtn" onClick={handelMenu}>
      Browse our collection
    </button>
  </div>
));
