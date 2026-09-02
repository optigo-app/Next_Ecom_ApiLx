import { useState, useEffect, useRef } from "react";
import { fetchCartDetails } from "@/app/(core)/utils/API/CartAPI/CartApi";
import { handleProductRemark } from "@/app/(core)/utils/API/CartAPI/ProductRemarkAPIData";
import { removeFromCartList } from "@/app/(core)/utils/API/RemoveCartAPI/RemoveCartAPI";
import { updateQuantity } from "@/app/(core)/utils/API/CartAPI/QuantityAPI";
import { getSizeData } from "@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI";
import { updateCartAPI } from "@/app/(core)/utils/API/CartAPI/UpdateCartAPI";
import pako from "pako";
import { useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import { fetchSingleProdDT } from "@/app/(core)/utils/API/CartAPI/SingleProdDtAPI";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { LocalSetup } from "@/app/env";
import { getSession } from "../../FetchSessionData";

const useCart = () => {
  const location = useNextRouterLikeRR();
  const navigate = location.push;
  const [isloding, setIsLoading] = useState(true);
  const [ispriceloding, setIsPriceLoding] = useState(false);
  const [countData, setCountData] = useState();
  const [storeInit, setStoreInit] = useState();
  const [cartData, setCartData] = useState([]);
  const [CurrencyData, setCurrencyData] = useState();
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productRemark, setProductRemark] = useState("");
  const [showRemark, setShowRemark] = useState(false);
  const [qtyCount, setQtyCount] = useState(1);
  const [diaIDData, setdiaID] = useState();
  const [metalID, setMetalID] = useState();
  const [metalCOLORID, setMetalCOLORID] = useState();
  const [colorStoneID, setColorStoneID] = useState();
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const [sizeCombo, setSizeCombo] = useState([]);
  const [sizeId, setSizeId] = useState();
  const [sizeChangeData, setSizeChangeData] = useState();
  const [markupData, setMarkUpData] = useState();
  const [mrpbasedPriceFlag, setmrpbasedPriceFlag] = useState(0);
  const [finalPrice, setFinalPrice] = useState();
  const [finalPriceWithMarkup, setFinalPriceWithMarkup] = useState();
  const [handleUpdate, setHandleUpdate] = useState();
  const [cartDrawer, setCartDrawer] = useState();
  const [mtType, setMtType] = useState();
  const [mtColor, setMtColor] = useState();
  const [diaColor, setDiaColor] = useState();
  const [diaQua, setDiaQua] = useState();
  const [csColor, setCsColor] = useState();
  const [csQua, setCsQua] = useState();
  const [cartStatus, setCartStatus] = useState(null);
  const { broadcast } = useBroadcaster(); // Get the broadcaster
  const [shouldRecalculate, setShouldRecalculate] = useState(true);

  const imageNotFound = "/image-not-found.jpg";

  const [finalCartData, setFinalCartData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const [visiterId, setVisiterId] = useState();

  const isLargeScreen = useMediaQuery("(min-width:1050px)");
  const isMaxWidth1050 = useMediaQuery("(max-width:1050px)");

  const validThemenos = [3, 4, 11, 12, 10, 7, 1, 9, 2, 6];

  useEffect(() => {
    const visiterIdVal = Cookies.get("visiterId");
    setVisiterId(visiterIdVal);
    const storeInit = getSession("storeInit");
    const storedData = getSession("loginUserDetail");
    setStoreInit(storeInit);
    if (storeInit?.IsB2BWebsite != 0) {
      setCurrencyData(storedData);
      const cartStatus = sessionStorage.getItem("isCartDrawer");
      setCartDrawer(cartStatus);
      setCartStatus(cartStatus);
    } else {
      setCurrencyData(storeInit);
    }
  }, []);

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

  const getCartData = async () => {
    setIsLoading(true);
    const visiterId = Cookies.get("visiterId");
    try {
      const response = await fetchCartDetails(visiterId);

      if (response?.Data?.rd[0]?.stat != 0) {
        setCartData(response?.Data?.rd);
        const initialProducts = response?.Data?.rd?.map((data) => ({
          ...data,
          images: [],
          loading: true,
        }));
        setFinalCartData(initialProducts);
        setLoadingIndex(0);

        if (response?.Data?.rd?.length > 0) {
          setSelectedItem(response?.Data?.rd[0]);
          let item = response?.Data?.rd[0];
          setQtyCount(item?.Quantity);
          handleCategorySize(item);
          setMetalID(response?.Data?.rd[0]?.metaltypeid);
          setMetalCOLORID(response?.Data?.rd[0]?.metalcolorid);
          setdiaID(
            response?.Data?.rd[0]?.diamondqualityid +
              "," +
              response?.Data?.rd[0]?.diamondcolorid,
          );
          setColorStoneID(
            response?.Data?.rd[0]?.colorstonequalityid +
              "," +
              response?.Data?.rd[0]?.colorstonecolorid,
          );
        }
      } else {
        setCartData([]);
        setFinalCartData([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // prevent second execution in StrictMode
    didRun.current = true;

    getCartData();
  }, []);

  // for multiselect
  const handleSelectItem = async (item) => {
    if (multiSelect) {
      setSelectedItems((prevItems) =>
        prevItems.includes(item)
          ? prevItems.filter((i) => i !== item)
          : [...prevItems, item],
      );
    } else {
      setSelectedItem(item);
      setMetalID(item?.metaltypeid);
      setdiaID(item?.diamondqualityid + "," + item?.diamondcolorid);
      setColorStoneID(
        item?.colorstonequalityid + "," + item?.colorstonecolorid,
      );
      setQtyCount(item?.Quantity);
      handleCategorySize(item);
      setOpenMobileModal(true);
    }
  };

  const handlecloseMobileModal = () => {
    setOpenMobileModal(false);
  };

  const handleMultiSelectToggle = () => {
    setMultiSelect(!multiSelect);
    setSelectedItems([]);
    if (!multiSelect && cartData.length > 0) {
      if (!isLargeScreen) {
        setSelectedItem(cartData[0]);
      }
    }
  };

  const isSelectedAll = () => {
    return cartData.length > 0 && selectedItems.length === cartData.length;
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems([...cartData]);
    } else {
      setSelectedItems([]);
    }
  };

  // for updation modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // remove
  const handleRemoveItem = async (item) => {
    let param = "Cart";
    let cartfilter;
    if (validThemenos?.includes(storeInit?.Themeno)) {
      cartfilter = finalCartData?.filter(
        (cartItem) => cartItem?.id !== item?.id,
      );
      setFinalCartData(cartfilter);
      // FIX: trigger summary recalculation after removal
      setShouldRecalculate(true);
    } else {
      cartfilter = cartData?.filter((cartItem) => cartItem?.id !== item?.id);
      setCartData(cartfilter);
      // FIX: trigger summary recalculation after removal
      setShouldRecalculate(true);
    }

    setTimeout(() => {
      if (cartfilter && isMaxWidth1050) {
        setSelectedItem(null);
      } else if (cartfilter) {
        setSelectedItem(cartfilter[0]);
      }
    }, 2);

    try {
      const response = await removeFromCartList(item, param, visiterId);
      let resStatus = response.Data.rd[0];
      if (resStatus?.msg === "success") {
        return resStatus;
      } else {
        console.log("Failed to remove product or product not found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // LocalSetup

  const handleRemoveAll = async () => {
    let param = "Cart";
    try {
      const response = await removeFromCartList(
        "IsDeleteAll",
        param,
        visiterId,
      );
      let resStatus = response.Data.rd[0];
      if (resStatus?.msg === "success") {
        // setCartCountVal(resStatus?.Cartlistcount)
        // setWishCountVal(resStatus?.Wishlistcount)
        setSelectedItem([]);
        getCartData();
        setCartData([]);
        setFinalCartData([]);
        broadcast("LOGOUT_ALL_TABS");
        return resStatus;
      } else {
        console.log("Failed to remove product or product not found");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  //get category Size

  const handleCategorySize = async (item) => {
    const visiterId = Cookies.get("visiterId");
    try {
      const response = await getSizeData(item, visiterId);
      if (response) {
        setSizeCombo(response?.Data);
        setSizeId(item?.Size);

        const sizeChangeData = response?.Data?.rd?.filter((size) => {
          return size.sizename === item?.Size;
        });

        setSizeChangeData(sizeChangeData);
      }
    } catch (error) {}
  };

  // const handleCategorySize = async (item) => {
  //   const visiterId = Cookies.get('visiterId');
  //   try {
  //     const response = await getSizeData(item, visiterId, islogin);
  //     if (response) {
  //       const sortedSizeData = response?.Data?.rd?.sort((a, b) => {
  //         const extractNumber = (sizeName) => parseFloat(sizeName?.replace(/[^0-9.]/g, ''));

  //         const numA = extractNumber(a?.sizename);
  //         const numB = extractNumber(b?.sizename);

  //         return numA - numB;
  //       });
  //       console.log('sortedSizeData', sortedSizeData);
  //       setSizeCombo(sortedSizeData);
  //       setSizeId(item?.Size);
  //       const sizeChangeData = sortedSizeData?.filter((size) => size?.sizename == item?.Size);
  //       setSizeChangeData(sizeChangeData);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch size data:', error);
  //   }
  // };

  // update cart
  const handleUpdateCart = async (updatedItems) => {
    setSelectedItems([]);
    setMultiSelect(false);
    setOpenModal(false);

    const objExtra = {
      Metal_Cost: updatedItems?.Metal_Cost,
      Labour_Cost: updatedItems?.Labour_Cost,
      Diamond_Cost: updatedItems?.Diamond_Cost,
      Diamond_SettingCost: updatedItems?.Diamond_SettingCost,
      ColorStone_Cost: updatedItems?.ColorStone_Cost,
      ColorStone_SettingCost: updatedItems?.ColorStone_SettingCost,
      Misc_Cost: updatedItems?.Misc_Cost,
      Misc_SettingCost: updatedItems?.Misc_SettingCost,
      Other_Cost: updatedItems?.Other_Cost,
      SolPrice: updatedItems?.SolPrice,
    };

    if (validThemenos?.includes(storeInit?.Themeno)) {
      const response1 = await updateQuantity(
        updatedItems.id,
        updatedItems?.Quantity,
        visiterId,
      );
      let resStatus1 = response1?.Data.rd[0];

      if (resStatus1?.stat_msg == "success") {
        try {
          const response = await updateCartAPI(
            updatedItems,
            metalID,
            metalCOLORID,
            diaIDData,
            colorStoneID,
            sizeId,
            markupData,
            finalPrice,
            finalPriceWithMarkup,
            objExtra,
          );
          let resStatus = response?.Data.rd[0];
          const mtcCode = metalColorCombo?.find(
            (option) => option?.id === metalCOLORID,
          );
          if (resStatus?.msg == "success") {
            setOpenMobileModal(false);
            setHandleUpdate(resStatus);
            // toast.success('Cart Updated Successfully')
            let updatedCartData;

            const Price = updatedItems?.UnitCostWithMarkUp * qtyCount;
            updatedCartData = finalCartData.map((cart) =>
              cart?.id === updatedItems?.id
                ? {
                    ...cart,
                    metaltypename: mtType ?? updatedItems?.metaltypename,
                    metalcolorname: mtColor ?? updatedItems?.metalcolorname,
                    diamondquality: diaQua ?? updatedItems?.diamondquality,
                    diamondcolor: diaColor ?? updatedItems?.diamondcolor,
                    colorstonecolor: csColor ?? updatedItems?.colorstonecolor,
                    // images: `${storeInit?.CDNDesignImageFol}${updatedItems?.designno}~1~${mtcCode?.colorcode}.${updatedItems?.ImageExtension}`,
                    images: `${storeInit?.CDNDesignImageFolThumb}${updatedItems?.designno}~1~${mtcCode?.colorcode}.jpg`,
                    loading: false,
                    colorstonequality: csQua ?? updatedItems?.colorstonequality,
                    FinalCost: Price ?? updatedItems?.FinalCost,
                    UnitCostWithMarkUp:
                      finalPrice?.UnitCostWithMarkUp ??
                      updatedItems?.UnitCostWithMarkUp,
                    Quantity: qtyCount,
                    Size: sizeId,
                  }
                : cart,
            );
            setFinalCartData(updatedCartData);
            setShouldRecalculate(true);
            return resStatus;
          } else {
            console.log("Failed to update product or product not found");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    } else {
      try {
        const response = await updateCartAPI(
          updatedItems,
          metalID,
          metalCOLORID,
          diaIDData,
          colorStoneID,
          sizeId,
          markupData,
          finalPrice,
          finalPriceWithMarkup,
        );
        let resStatus = response?.Data.rd[0];
        if (resStatus?.msg == "success") {
          setOpenMobileModal(false);
          setHandleUpdate(resStatus);
          // toast.success('Cart Updated Successfully')

          const Price = updatedItems?.UnitCostWithMarkUp * qtyCount;
          const updatedCartData = cartData.map((cart) =>
            cart?.id === updatedItems?.id
              ? {
                  ...cart,
                  metaltypename: mtType ?? updatedItems?.metaltypename,
                  metalcolorname: mtColor ?? updatedItems?.metalcolorname,
                  diamondquality: diaQua ?? updatedItems?.diamondquality,
                  diamondcolor: diaColor ?? updatedItems?.diamondcolor,
                  colorstonecolor: csColor ?? updatedItems?.colorstonecolor,
                  colorstonequality: csQua ?? updatedItems?.colorstonequality,
                  FinalCost: Price ?? updatedItems?.FinalCost,
                  UnitCostWithMarkUp:
                    finalPrice?.UnitCostWithMarkUp ??
                    updatedItems?.UnitCostWithMarkUp,
                  Quantity: qtyCount,
                  Size: sizeId,
                }
              : cart,
          );
          setCartData(updatedCartData);
          return resStatus;
        } else {
          console.log("Failed to update product or product not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleCancelUpdateCart = () => {
    setSelectedItems([]);
    setMultiSelect(false);
    setOpenModal(false);
  };

  // for remark
  const handleAddReamrk = () => {
    setShowRemark(true);
  };

  const handleRemarkChange = (event) => {
    const remarkChange = event.target.value;
    setProductRemark(remarkChange);
  };

  const handleSave = async (data) => {
    setShowRemark(false);
    try {
      const response = await handleProductRemark(
        data,
        productRemark,
        visiterId,
      );
      let resStatus = response?.Data?.rd[0];
      if (resStatus?.stat == 1) {
        let updatedCartData;
        if (validThemenos?.includes(storeInit?.Themeno)) {
          updatedCartData = finalCartData.map((cart) =>
            cart.id == data.id
              ? { ...cart, Remarks: resStatus?.design_remark }
              : cart,
          );
          setFinalCartData(updatedCartData);
        } else {
          updatedCartData = cartData.map((cart) =>
            cart.id == data.id
              ? { ...cart, Remarks: resStatus?.design_remark }
              : cart,
          );
          setCartData(updatedCartData);
        }
        // setProductRemark("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setShowRemark(false);
  };

  // for quantity
  const updateCartAndSelectedItem = (item, quantity, priceQty) => {
    let updatedCartData;

    if (validThemenos?.includes(storeInit?.Themeno)) {
      updatedCartData = finalCartData.map((cart) =>
        cart.id === item.id ? { ...cart, Quantity: quantity } : cart,
      );
      setFinalCartData(updatedCartData);
    } else {
      updatedCartData = cartData.map((cart) =>
        cart.id === item.id ? { ...cart, Quantity: quantity } : cart,
      );
      setCartData(updatedCartData);
    }

    const updatedSelectedItem =
      selectedItem.id === item.id
        ? { ...selectedItem, Quantity: quantity, FinalCost: priceQty }
        : selectedItem;
    setSelectedItem(updatedSelectedItem);
  };

  const handleIncrement = async (item) => {
    const newQuantity = (item?.Quantity || 0) + 1;
    const priceQty = item?.UnitCostWithMarkUp * newQuantity;

    updateCartAndSelectedItem(item, newQuantity, priceQty);
    setQtyCount((prevCount) => prevCount + 1);

    if (storeInit?.Themeno != 3) {
      try {
        const response = await updateQuantity(item.id, newQuantity, visiterId);
        // console.log("Quantity updated successfully:", response);
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    }
  };

  const handleDecrement = async (item) => {
    if (item?.Quantity > 1) {
      const newQuantity = item.Quantity - 1;
      const priceQty = item?.UnitCostWithMarkUp * newQuantity;

      updateCartAndSelectedItem(item, newQuantity, priceQty);
      setQtyCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));

      if (storeInit?.Themeno != 3) {
        try {
          const response = await updateQuantity(
            item.id,
            newQuantity,
            visiterId,
          );
          // console.log("Quantity updated successfully:", response);
        } catch (error) {
          console.error("Failed to update quantity:", error);
        }
      }
    }
  };

  // for dropdown changes
  const handleMetalTypeChange = async (event) => {
    const selectedTypeName = event.target.value;
    const selectedID = event.target.name;
    setMtType(selectedTypeName);
    setSelectedItem((prevItem) => ({
      ...prevItem,
      metaltypename: selectedTypeName,
    }));

    // const updatedMTData = cartData?.map(cart =>
    //   cart.id == selectedID ? { ...cart, metaltypename: selectedTypeName } : cart
    // );
    // setCartData(updatedMTData);

    const selectedMetal = metalTypeCombo?.find(
      (option) => option.metaltype === selectedTypeName,
    );
    if (selectedMetal) {
      const selectedMetalId = selectedMetal?.Metalid;
      setMetalID(selectedMetalId);
      handlePrice(selectedID, sizeId, diaIDData, colorStoneID, selectedMetalId);
    }
  };

  const handleMetalColorChange = (event, selectedId) => {
    const selectedTypeName = event.target.value;
    const fetchColorCode = metalColorCombo.find(
      (item) => item?.metalcolorname === event.target.value,
    );
    // const selectedID = event.target.name;
    setMtColor(selectedTypeName);
    if (validThemenos?.includes(storeInit?.Themeno)) {
      setSelectedItem((prevItem) => ({
        ...prevItem,
        metalcolorname: selectedTypeName,
        colorcode: fetchColorCode?.colorcode,
        // images: `${storeInit?.CDNDesignImageFol}${selectedItem?.designno}~1~${selectedTypeName}.${selectedItem?.ImageExtension}`,
        images: `${storeInit?.CDNDesignImageFolThumb}${selectedItem?.designno}~1~${fetchColorCode?.colorcode}.${selectedItem?.ImageExtension}`,
        loading: false,
      }));
    } else {
      setSelectedItem((prevItem) => ({
        ...prevItem,
        metalcolorname: selectedTypeName,
        colorcode: fetchColorCode?.colorcode,
      }));
    }

    const selectedMetal = metalColorCombo.find(
      (option) => option.metalcolorname === selectedTypeName,
    );
    if (selectedMetal) {
      const selectedMetalId = selectedMetal.id;
      setMetalCOLORID(selectedMetalId);
    }
  };

  const handleDiamondChange = (event) => {
    const value = event.target.value;
    const selectedID = event.target.name;
    const [quality, color] = value.split(",");

    setDiaColor(color);
    setDiaQua(quality);
    setSelectedItem((prevItem) => ({
      ...prevItem,
      diamondquality: quality,
      diamondcolor: color,
    }));

    // const updatedQtytData = cartData?.map(cart =>
    //   cart.id == selectedID ? {
    //     ...cart, diamondquality: quality,
    //     diamondcolor: color
    //   } : cart
    // );
    // setCartData(updatedQtytData);

    const selectedDia = diamondQualityColorCombo.find(
      (option) => option.Quality === quality && option.color === color,
    );
    if (selectedDia) {
      const selectedDiaQId = selectedDia.QualityId;
      const selectedDiaCId = selectedDia.ColorId;
      const diaId = `${selectedDiaQId},${selectedDiaCId}`;
      setdiaID(diaId);
      handlePrice(selectedID, sizeId, diaId, colorStoneID, metalID);
    }
  };

  const handleSizeChange = (event) => {
    const sizedata = event?.target?.value;
    const selectedID = event.target.name;
    setSelectedItem((prevItem) => ({ ...prevItem, Size: sizedata }));
    setSizeId(sizedata);

    // const updatedSizeData = cartData?.map(cart =>
    //   cart.id == selectedID ? { ...cart, Size: sizedata } : cart
    // );
    // setCartData(updatedSizeData);

    const sizeChangeData = sizeCombo?.rd?.filter(
      (size) => size.sizename === sizedata,
    );
    setSizeChangeData(sizeChangeData);
    handlePrice(selectedID, sizedata, diaIDData, colorStoneID, metalID);
  };

  const handleColorStoneChange = (event) => {
    const value = event.target.value;
    const selectedID = event.target.name;
    const [quality, color] = value.split(",");

    setCsColor(color);
    setCsQua(quality);

    setSelectedItem((prevItem) => ({
      ...prevItem,
      colorstonequality: quality,
      colorstonecolor: color,
    }));

    // const updatedQtytData = cartData?.map(cart =>
    //   cart.id == selectedID ? {
    //     ...cart, colorstonequality: quality,
    //     colorstonecolor: color
    //   } : cart
    // );
    // setCartData(updatedQtytData);

    const selectedCS = ColorStoneCombo.find(
      (option) => option.Quality === quality && option.color === color,
    );
    if (selectedCS) {
      const selectedCSQId = selectedCS.QualityId;
      const selectedCSCId = selectedCS.ColorId;
      const csQid = `${selectedCSQId},${selectedCSCId}`;
      setColorStoneID(csQid);
      handlePrice(selectedID, sizeId, diaIDData, csQid, metalID);
    }
  };

  // for price api

  const handlePrice = async (
    selectedID,
    sizedata,
    diaId,
    csQid,
    selectedMetalId,
  ) => {
    try {
      setIsPriceLoding(true);
      const response = await fetchSingleProdDT(
        selectedItem,
        sizedata,
        diaId,
        csQid,
        selectedMetalId,
        visiterId,
      );
      if (
        response?.Status === "200" ||
        response?.Status === 200 ||
        response?.Status == 200
      ) {
        const resData = response?.Data?.rd[0];
        const finalPrice = resData?.UnitCostWithMarkUp * qtyCount;
        setFinalPrice(resData);
        const objExtra = {
          Metal_Cost: resData?.Metal_Cost,
          Labour_Cost: resData?.Labour_Cost,
          Diamond_Cost: resData?.Diamond_Cost,
          Diamond_SettingCost: resData?.Diamond_SettingCost,
          ColorStone_Cost: resData?.ColorStone_Cost,
          ColorStone_SettingCost: resData?.ColorStone_SettingCost,
          Misc_Cost: resData?.Misc_Cost,
          Misc_SettingCost: resData?.Misc_SettingCost,
          Other_Cost: resData?.Other_Cost,
          SolPrice: resData?.SolPrice,
        };

        setSelectedItem((prevItem) => ({
          ...prevItem,
          FinalCost: finalPrice,
          UnitCostWithMarkUp: resData?.UnitCostWithMarkUp,
          Quantity: qtyCount,
          ...objExtra,
        }));

        // setCartData(prevCartData => prevCartData.map(cart =>
        //   cart.id === selectedID ? {
        //     ...cart,
        //     FinalCost: finalPrice,
        //     UnitCostWithMarkUp: resData?.UnitCostWithMarkUp,
        //     Quantity: qtyCount,
        //     Size: sizedata
        //   } : cart
        // ));
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsPriceLoding(false);
    }
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const CartCardImageFunc = (pd) => {
    if (validThemenos?.includes(storeInit?.Themeno)) {
      const mtcCode = metalColorCombo?.find(
        (option) => option?.metalcolorname === pd?.metalcolorname,
      );
      let primaryImage;

      if (pd?.ImageCount > 0) {
        // primaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1~${mtcCode?.colorcode}.${pd?.ImageExtension}`;
        primaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1~${mtcCode?.colorcode}.jpg`;
      } else {
        primaryImage = imageNotFound;
      }
      return primaryImage;
    } else {
      return new Promise((resolve) => {
        const loadImage = (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
          });
        };

        const mtcCode = metalColorCombo?.find(
          (option) => option?.metalcolorname === pd?.metalcolorname,
        );
        let primaryImage, secondaryImage;

        if (pd?.ImageCount > 0) {
          primaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1~${mtcCode?.colorcode}.jpg`;
          secondaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1.jpg`;
        } else {
          primaryImage = secondaryImage = imageNotFound;
        }
        loadImage(primaryImage)
          .then((imgSrc) => {
            resolve(imgSrc);
          })
          .catch(() => {
            loadImage(secondaryImage)
              .then((imgSrc) => {
                resolve(imgSrc);
              })
              .catch(() => {
                resolve(imageNotFound);
              });
          });
      });
    }
  };

  useEffect(() => {
    const initialProducts = cartData?.map((data) => ({
      ...data,
      images: [],
      loading: true,
    }));

    setFinalCartData(initialProducts);
    setLoadingIndex(0);
  }, [cartData, cartStatus]);

  useEffect(() => {
    if (!finalCartData || finalCartData.length === 0) return;
    if (loadingIndex >= finalCartData?.length) return;

    const loadNextProductImages = () => {
      setFinalCartData((prevData) => {
        if (!prevData || prevData.length === 0 || !prevData[loadingIndex]) {
          return prevData || [];
        }
        const newData = [...prevData];
        newData[loadingIndex] = {
          ...newData[loadingIndex],
          images: CartCardImageFunc(newData[loadingIndex]),
          loading: false,
        };
        return newData;
      });

      setLoadingIndex((prevIndex) => prevIndex + 1);
    };
    if (validThemenos?.includes(storeInit?.Themeno)) {
      const timer = setTimeout(loadNextProductImages, 130);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(loadNextProductImages, 20);
      return () => clearTimeout(timer);
    }
  }, [loadingIndex, finalCartData, CartCardImageFunc]);

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = pako.deflate(uint8Array);
      if (typeof compressed === "string") {
        return btoa(compressed);
      }
      let binary = "";
      const len = compressed.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(compressed[i]);
      }
      return btoa(binary);
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const getCardImageUrl = (data, storeInit) => {
    const cdnFol = storeInit?.CDNDesignImageFol || "";
    if (!cdnFol || !data?.designno) return "";
    const ext = data?.ImageExtension || "webp";

    if (data?.ImageVideoDetail && data.ImageVideoDetail !== "0") {
      try {
        const parsed = typeof data.ImageVideoDetail === "string" 
          ? JSON.parse(data.ImageVideoDetail) 
          : data.ImageVideoDetail;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const targetColorId = data?.metalcolorid || data?.MetalColorid;
          const mtColorLocal = getSession("MetalColorCombo") || metalColorCombo || [];
          const targetColorObj = mtColorLocal.find(ele => Number(ele.id) === Number(targetColorId));
          const targetColorCode = targetColorObj?.colorcode || data?.metalcolorname || data?.MetalColor;

          if (targetColorCode) {
            const targetLower = targetColorCode.toLowerCase().trim();
            const matchedColorImg = parsed.find(item => {
              if (Number(item?.TI) !== 2 || !item?.CN) return false;
              const cnLower = item.CN.toLowerCase().trim();
              return cnLower === targetLower || cnLower.includes(targetLower) || targetLower.includes(cnLower);
            });
            if (matchedColorImg) {
              return `${cdnFol}${data.designno}~${matchedColorImg.Nm}~${matchedColorImg.CN}.${matchedColorImg.Ex || ext}`;
            }
          }

          const normalImg = parsed.find(item => Number(item?.TI) === 1);
          if (normalImg) {
            return `${cdnFol}${data.designno}~${normalImg.Nm}.${normalImg.Ex || ext}`;
          }
        }
      } catch (e) {}
    }
    return `${cdnFol}${data.designno}~1.${ext}`;
  };

  const handleMoveToDetail = (cartData) => {
    const logindata = getSession("loginUserDetail");
    const storeInit = getSession("storeInit");
    const createAndNavigate = (obj) => {
      const encodedObj = compressAndEncode(JSON.stringify(obj));
      console.log("NAVIGATE FROM CART:", { cartData, obj, encodedObj });
      navigate(
        `/d/${formatRedirectTitleLine(cartData?.TitleLine)}${cartData?.designno}?p=${encodedObj}`,
      );
    };

    const itemDiaQc =
      (cartData?.diamondqualityid != null && cartData?.diamondcolorid != null && cartData?.diamondqualityid !== 0)
        ? `${cartData.diamondqualityid},${cartData.diamondcolorid}`
        : (cartData?.cmboDiaQCid || logindata?.cmboDiaQCid);

    const itemCsQc =
      (cartData?.colorstonequalityid != null && cartData?.colorstonecolorid != null && cartData?.colorstonequalityid !== 0)
        ? `${cartData.colorstonequalityid},${cartData.colorstonecolorid}`
        : (cartData?.cmboCSQCid || logindata?.cmboCSQCid);

    const targetColorId = cartData?.metalcolorid || cartData?.MetalColorid;
    const ext = cartData?.ImageExtension || "webp";
    const imgUrl = getCardImageUrl(cartData, storeInit);

    const commonObj = {
      a: cartData?.autocode,
      b: cartData?.designno,
      m: cartData?.metaltypeid || cartData?.MetalPurityid || cartData?.Metalid || logindata?.MetalId,
      d: itemDiaQc,
      c: itemCsQc,
      f: {},
      g: [
        ["", ""],
        ["", "", ""],
      ],
      metalColorId: targetColorId || null,
      l: ext,
      count: (cartData?.ImageCount && Number(cartData.ImageCount) > 0) ? Number(cartData.ImageCount) : 1,
      ArticleNo: cartData?.ArticleNo || cartData?.designno,
      ArticleId: cartData?.ArticleId || cartData?.id,
      Size: cartData?.Size,
      Purity: cartData?.Purity,
      metalpurityname: cartData?.metalpurityname,
      mediaDet: cartData?.ImageVideoDetail ?? "",
      img: imgUrl,
      title: cartData?.TitleLine || cartData?.ArticleNo || cartData?.designno || "",
      price: cartData?.UnitCostWithMarkUp || cartData?.CW_UCostWM || cartData?._UnitCost || 0,
      nwt: cartData?.Nwt || cartData?.CW_Nwt || cartData?.CW_Gwt || 0,
    };

    const stockNo = cartData?.StockNo || cartData?.stockno;
    if (stockNo && String(stockNo).trim() !== "") {
      createAndNavigate({
        ...commonObj,
        StockNo: stockNo,
      });
    } else {
      createAndNavigate(commonObj);
    }
  };

  // browse our collection
  const handelMenu = () => {
    let menudata = getSession("menuparams");
    // let redirectURL = sessionStorage.getItem('redirectURL');
    // if (redirectURL) {
    //   return navigate(redirectURL);
    // }
    if (menudata) {
      const queryParameters1 = [
        menudata?.FilterKey && `${menudata?.FilterVal}`,
        menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
        menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
      ]
        .filter(Boolean)
        .join("/");

      const queryParameters = [
        menudata?.FilterKey && `${menudata?.FilterVal}`,
        menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
        menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
      ]
        .filter(Boolean)
        .join(",");

      const otherparamUrl = Object.entries({
        b: menudata?.FilterKey,
        g: menudata?.FilterKey1,
        c: menudata?.FilterKey2,
      })
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => value)
        .filter(Boolean)
        .join(",");

      // const paginationParam = [
      //   `page=${menudata.page ?? 1}`,
      //   `size=${menudata.size ?? 50}`
      // ].join('&');

      let menuEncoded = `${queryParameters}/${otherparamUrl}`;
      const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(
        menuEncoded,
      )}`;
      navigate(url);
    } else {
      navigate("/");
    }
  };

  return {
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
    openMobileModal,
    finalCartData,
    isSelectedAll,
    handleSelectAll,
    handlecloseMobileModal,
    setmrpbasedPriceFlag,
    mrpbasedPriceFlag,
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
    shouldRecalculate,
    setShouldRecalculate,
  };
};

export default useCart;
