"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { formatter, formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

// APIs
import { fetchCartDetails } from "@/app/(core)/utils/API/CartAPI/CartApi";
import { removeFromCartList } from "@/app/(core)/utils/API/RemoveCartAPI/RemoveCartAPI";
import { updateCartAPI } from "@/app/(core)/utils/API/CartAPI/UpdateCartAPI";
import { updateQuantity } from "@/app/(core)/utils/API/CartAPI/QuantityAPI";
import { handleProductRemark } from "@/app/(core)/utils/API/CartAPI/ProductRemarkAPIData";
import { fetchSingleProdDT } from "@/app/(core)/utils/API/CartAPI/SingleProdDtAPI";
import { getSizeData } from "@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI";
import {
  fetchAddresses,
  setDefaultAddress,
  addAddress,
} from "@/app/(core)/utils/API/OrderFlow/DeliveryAPI";
import { fetchEstimateTax } from "@/app/(core)/utils/API/OrderFlow/GetTax";
import { handleOrderRemark } from "@/app/(core)/utils/API/OrderRemarkAPI/OrderRemarkAPI";
import { handlePaymentAPI } from "@/app/(core)/utils/API/OrderFlow/PlaceOrderAPI";
import { fetchRazorPayData } from "@/app/(core)/utils/API/OrderFlow/RazorPayAPI";
import { handleVerifySignature } from "@/app/(core)/utils/API/OrderFlow/RazorPayVerificationAPI";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";

// Payment icons
import { BsPaypal, BsCreditCard, BsCreditCard2Front } from "react-icons/bs";
import { FaStripeS } from "react-icons/fa";
import { SiPaytm, SiPhonepe, SiRazorpay } from "react-icons/si";
import { LocalShipping } from "@mui/icons-material";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";

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

export function useTestCheckout(initialStoreInit) {
  const router = useRouter();
  const { islogin, loginUserDetail, setCartCountNum, storeinit: contextStoreInit } = useStore();
  const storeinit = initialStoreInit || contextStoreInit || getSession("storeInit");

  // Cart States
  const [cartItems, setCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  // Edit / Customization States
  const [editingItem, setEditingItem] = useState(null); // When non-null, right side switches to Edit mode
  const [customizingItem, setCustomizingItem] = useState(null); // Local working copy during edit
  const [editQty, setEditQty] = useState(1);
  const [sizeCombo, setSizeCombo] = useState([]);
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const [colorStoneCombo, setColorStoneCombo] = useState([]);

  // Selected IDs for active customization
  const [activeMetalId, setActiveMetalId] = useState(null);
  const [activeMetalColorId, setActiveMetalColorId] = useState(null);
  const [activeDiaQcId, setActiveDiaQcId] = useState(null);
  const [activeCsQcId, setActiveCsQcId] = useState(null);
  const [activeSize, setActiveSize] = useState("");

  // Address States
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Order Summary & Tax States
  const [taxData, setTaxData] = useState(null);
  const [isLoadingTax, setIsLoadingTax] = useState(true);
  const [orderRemark, setOrderRemark] = useState("");

  // Payment States
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("3"); // Default to Cash on Delivery (id: 3)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const currencyCode =
    loginUserDetail?.CurrencyCode || storeinit?.CurrencyCode || "INR";

  // 1. Fetch Combos from sessionStorage
  useEffect(() => {
    try {
      const mt = JSON.parse(sessionStorage.getItem("metalTypeCombo")) || [];
      const mc = JSON.parse(sessionStorage.getItem("MetalColorCombo")) || [];
      const dq = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo")) || [];
      const cq = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo")) || [];
      setMetalTypeCombo(mt);
      setMetalColorCombo(mc);
      setDiamondQualityColorCombo(dq);
      setColorStoneCombo(cq);
    } catch (e) {
      console.error("Error reading combo data:", e);
    }
  }, []);

  // 2. Load Cart Data
  const loadCartData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoadingCart(true);
    const visiterId = Cookies.get("visiterId");
    try {
      const response = await fetchCartDetails(visiterId);
      if (response?.Data?.rd && response?.Data?.rd[0]?.stat !== 0) {
        setCartItems(response.Data.rd);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to load cart items:", err);
      setCartItems([]);
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  // 3. Load Addresses
  const loadAddresses = useCallback(async () => {
    setIsLoadingAddress(true);
    try {
      const addresses = await fetchAddresses();
      if (Array.isArray(addresses)) {
        setAddressList(addresses);
        // Find default or first address
        const def = addresses.find((a) => a.isdefault === 1) || addresses[0] || null;
        setSelectedAddress(def);
        if (def) {
          sessionStorage.setItem("selectedAddressId", JSON.stringify(def));
        }
      } else {
        setAddressList([]);
        setSelectedAddress(null);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
      setAddressList([]);
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // 4. Load Estimate Tax & Order Remarks
  const loadTaxData = useCallback(async () => {
    setIsLoadingTax(true);
    try {
      const tax = await fetchEstimateTax();
      if (tax && tax[0]) {
        setTaxData(tax[0]);
      }
    } catch (err) {
      console.error("Error fetching tax:", err);
    } finally {
      setIsLoadingTax(false);
    }
  }, []);

  useEffect(() => {
    loadTaxData();
    const storedRemark = sessionStorage.getItem("orderRemark") || "";
    setOrderRemark(storedRemark);
  }, [cartItems, selectedAddress, loadTaxData]);

  // 5. Load Payment Methods
  useEffect(() => {
    try {
      const rawPayMaster = sessionStorage.getItem("payMaster");
      if (rawPayMaster) {
        const parsed = JSON.parse(rawPayMaster);
        const activeMethods = parsed
          .filter((m) => m.isactive === 1)
          .map((m) => {
            const info = PAYMENT_METHODS_INFO[m.id];
            return {
              ...m,
              icon: info?.icon || <CreditCardIcon />,
              color: info?.color || "#555",
              description: info?.description || "Payment Option",
            };
          });
        setPaymentMethods(activeMethods);
        if (activeMethods.length > 0) {
          // Default to COD (id 3) if available, else first active
          const hasCod = activeMethods.find((m) => m.id === 3 || m.id === "3");
          setSelectedPaymentMethod(hasCod ? String(hasCod.id) : String(activeMethods[0].id));
        }
      } else {
        // Fallback default COD method
        setPaymentMethods([
          {
            id: 3,
            GatewayName: "Cash On Delivery",
            description: "Pay when you receive",
            color: "#FFD700",
            icon: <LocalShipping />,
          },
        ]);
      }
    } catch (err) {
      console.error("Error parsing payment master:", err);
    }
  }, []);

  // 6. Handle Item Removal
  const handleRemoveItem = async (item) => {
    const visiterId = Cookies.get("visiterId");
    try {
      const res = await removeFromCartList(item, "Cart", visiterId);
      const resStatus = res?.Data?.rd?.[0] || res;
      if (
        resStatus?.msg === "success" ||
        resStatus?.stat === 1 ||
        res?.msg === "success"
      ) {
        toast.success("Item removed from cart");
        await loadCartData(true);
        const countRes = await GetCountAPI(visiterId);
        if (countRes?.cartcount !== undefined) {
          setCartCountNum(countRes.cartcount);
        }
        // If the removed item was currently being edited, close the editor
        if (editingItem?.id === item.id) {
          setEditingItem(null);
          setCustomizingItem(null);
        }
      } else {
        toast.error(resStatus?.msg || "Failed to remove item");
      }
    } catch (err) {
      console.error("Remove item error:", err);
      toast.error("Failed to remove item");
    }
  };

  // 6b. Handle Clear All Items
  const handleRemoveAll = async () => {
    const visiterId = Cookies.get("visiterId");
    try {
      const res = await removeFromCartList("IsDeleteAll", "Cart", visiterId);
      const resStatus = res?.Data?.rd?.[0] || res;
      if (
        resStatus?.msg === "success" ||
        resStatus?.stat === 1 ||
        res?.msg === "success"
      ) {
        toast.success("All items removed from bag");
        setCartItems([]);
        setEditingItem(null);
        setCustomizingItem(null);
        const countRes = await GetCountAPI(visiterId);
        if (countRes?.cartcount !== undefined) {
          setCartCountNum(countRes.cartcount);
        } else {
          setCartCountNum(0);
        }
        await loadCartData(true);
      } else {
        toast.error(resStatus?.msg || "Failed to clear bag");
      }
    } catch (err) {
      console.error("Clear all items error:", err);
      toast.error("Failed to clear bag");
    }
  };

  // 7. Open Item Edit Mode
  const handleStartEdit = async (item) => {
    if (item?.IsMrpBase === 1) {
      return; // MRP products are not editable
    }

    // Resolve matching metal
    const foundMetal = metalTypeCombo.find(
      (m) =>
        (item?.metaltypeid && m.Metalid === item.metaltypeid) ||
        m.metaltypename?.trim().toLowerCase() === item?.metaltypename?.trim().toLowerCase() ||
        m.metaltype?.trim().toLowerCase() === item?.metaltypename?.trim().toLowerCase()
    );
    const mId = foundMetal ? foundMetal.Metalid : item?.metaltypeid;

    // Resolve matching color
    const foundColor = metalColorCombo.find(
      (c) =>
        (item?.metalcolorid && c.id === item.metalcolorid) ||
        c.colorname?.trim().toLowerCase() === item?.metalcolorname?.trim().toLowerCase() ||
        c.metalcolorname?.trim().toLowerCase() === item?.metalcolorname?.trim().toLowerCase()
    );
    const mcId = foundColor ? foundColor.id : item?.metalcolorid;

    // Resolve matching diamond
    const foundDia = diamondQualityColorCombo.find(
      (d) =>
        (item?.diamondqualityid && d.QualityId === item.diamondqualityid && item?.diamondcolorid && d.ColorId === item.diamondcolorid) ||
        (d.Quality?.trim().toLowerCase() === item?.diamondquality?.trim().toLowerCase() &&
         d.color?.trim().toLowerCase() === item?.diamondcolor?.trim().toLowerCase())
    );
    const diaQcId = foundDia
      ? `${foundDia.QualityId},${foundDia.ColorId}`
      : `${item?.diamondqualityid || 0},${item?.diamondcolorid || 0}`;

    // Resolve matching color stone
    const foundCs = colorStoneCombo.find(
      (c) =>
        (item?.colorstonequalityid && c.QualityId === item.colorstonequalityid && item?.colorstonecolorid && c.ColorId === item.colorstonecolorid) ||
        (c.Quality?.trim().toLowerCase() === item?.colorstonequality?.trim().toLowerCase() &&
         c.color?.trim().toLowerCase() === item?.colorstonecolor?.trim().toLowerCase())
    );
    const csQcId = foundCs
      ? `${foundCs.QualityId},${foundCs.ColorId}`
      : `${item?.colorstonequalityid || 0},${item?.colorstonecolorid || 0}`;

    const workingItem = {
      ...item,
      metaltypename: foundMetal ? foundMetal.metaltypename : item?.metaltypename,
      metalcolorname: foundColor ? (foundColor.colorname || foundColor.metalcolorname) : item?.metalcolorname,
      diamondquality: foundDia ? foundDia.Quality : item?.diamondquality,
      diamondcolor: foundDia ? foundDia.color : item?.diamondcolor,
      diamondqualityid: foundDia ? foundDia.QualityId : item?.diamondqualityid,
      diamondcolorid: foundDia ? foundDia.ColorId : item?.diamondcolorid,
      colorstonequality: foundCs ? foundCs.Quality : item?.colorstonequality,
      colorstonecolor: foundCs ? foundCs.color : item?.colorstonecolor,
      colorstonequalityid: foundCs ? foundCs.QualityId : item?.colorstonequalityid,
      colorstonecolorid: foundCs ? foundCs.ColorId : item?.colorstonecolorid,
    };

    setEditingItem(item);
    setCustomizingItem(workingItem);
    setEditQty(item?.Quantity || 1);

    setActiveMetalId(mId);
    setActiveMetalColorId(mcId);
    setActiveDiaQcId(diaQcId);
    setActiveCsQcId(csQcId);
    setActiveSize(item?.Size || "");

    // Fetch size combo if category exists
    try {
      const sizeRes = await getSizeData(item, Cookies.get("visiterId"));
      if (sizeRes?.Data?.rd) {
        setSizeCombo(sizeRes.Data);
      } else {
        setSizeCombo([]);
      }
    } catch (e) {
      console.error("Error fetching sizes:", e);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setCustomizingItem(null);
  };

  // 8. Customization change handlers
  const handleCustomizationChange = async (type, val) => {
    if (!customizingItem) return;

    let newMetalId = activeMetalId;
    let newMetalColorId = activeMetalColorId;
    let newDiaQc = activeDiaQcId;
    let newCsQc = activeCsQcId;
    let newSize = activeSize;

    const updated = { ...customizingItem };

    if (type === "metalType") {
      const found = metalTypeCombo.find(
        (m) =>
          m.metaltypename?.trim().toLowerCase() === val?.trim().toLowerCase() ||
          m.metaltype?.trim().toLowerCase() === val?.trim().toLowerCase()
      );
      if (found) {
        newMetalId = found.Metalid;
        updated.metaltypeid = found.Metalid;
        updated.metaltypename = found.metaltypename;
        setActiveMetalId(found.Metalid);
      }
    } else if (type === "metalColor") {
      const found = metalColorCombo.find(
        (c) =>
          c.colorname?.trim().toLowerCase() === val?.trim().toLowerCase() ||
          c.metalcolorname?.trim().toLowerCase() === val?.trim().toLowerCase()
      );
      if (found) {
        newMetalColorId = found.id;
        updated.metalcolorid = found.id;
        updated.metalcolorname = found.colorname || found.metalcolorname;
        setActiveMetalColorId(found.id);
        const cCode = found.colorcode ? `~${found.colorcode}` : "";
        updated.images = `${storeinit?.CDNDesignImageFolThumb}${customizingItem?.designno}~1${cCode}.jpg`;
      }
    } else if (type === "diamond") {
      const [quality, color] = val.split(",");
      const found = diamondQualityColorCombo.find(
        (d) =>
          d.Quality?.trim().toLowerCase() === quality?.trim().toLowerCase() &&
          d.color?.trim().toLowerCase() === color?.trim().toLowerCase()
      );
      if (found) {
        newDiaQc = `${found.QualityId},${found.ColorId}`;
        updated.diamondquality = found.Quality;
        updated.diamondcolor = found.color;
        updated.diamondqualityid = found.QualityId;
        updated.diamondcolorid = found.ColorId;
        setActiveDiaQcId(newDiaQc);
      }
    } else if (type === "colorstone") {
      const [quality, color] = val.split(",");
      const found = colorStoneCombo.find(
        (c) =>
          c.Quality?.trim().toLowerCase() === quality?.trim().toLowerCase() &&
          c.color?.trim().toLowerCase() === color?.trim().toLowerCase()
      );
      if (found) {
        newCsQc = `${found.QualityId},${found.ColorId}`;
        updated.colorstonequality = found.Quality;
        updated.colorstonecolor = found.color;
        updated.colorstonequalityid = found.QualityId;
        updated.colorstonecolorid = found.ColorId;
        setActiveCsQcId(newCsQc);
      }
    } else if (type === "size") {
      newSize = val;
      updated.Size = val;
      setActiveSize(val);
    }

    setCustomizingItem(updated);

    // Recalculate price live
    try {
      setIsPriceLoading(true);
      const visiterId = Cookies.get("visiterId");
      const priceRes = await fetchSingleProdDT(
        updated,
        newSize,
        newDiaQc,
        newCsQc,
        newMetalId,
        visiterId
      );

      if (priceRes?.Data?.rd && priceRes.Data.rd[0]) {
        const pData = priceRes.Data.rd[0];
        const singleUnitCost = pData?.UnitCostWithMarkUp || updated.UnitCostWithMarkUp;
        updated.UnitCostWithMarkUp = singleUnitCost;
        updated.FinalCost = singleUnitCost * editQty;
        setCustomizingItem({ ...updated });
      }
    } catch (e) {
      console.error("Price recalculation failed:", e);
    } finally {
      setIsPriceLoading(false);
    }
  };

  const handleEditQtyChange = (valOrDelta, isDirect = false) => {
    if (isDirect) {
      if (valOrDelta === "") {
        setEditQty("");
        return;
      }
      const parsed = parseInt(valOrDelta, 10);
      const newQty = isNaN(parsed) || parsed < 1 ? 1 : parsed;
      setEditQty(newQty);
      if (customizingItem) {
        setCustomizingItem((prev) => ({
          ...prev,
          Quantity: newQty,
          FinalCost: (prev?.UnitCostWithMarkUp || 0) * newQty,
        }));
      }
    } else {
      const current = typeof editQty === "number" ? editQty : parseInt(editQty, 10) || 1;
      const newQty = Math.max(1, current + valOrDelta);
      setEditQty(newQty);
      if (customizingItem) {
        setCustomizingItem((prev) => ({
          ...prev,
          Quantity: newQty,
          FinalCost: (prev?.UnitCostWithMarkUp || 0) * newQty,
        }));
      }
    }
  };

  // 9. Apply Customization
  const handleApplyCustomization = async () => {
    if (!customizingItem) return;
    const visiterId = Cookies.get("visiterId");

    try {
      setIsPriceLoading(true);
      // 1. Update customizations
      await updateCartAPI(
        customizingItem,
        activeMetalId,
        activeMetalColorId,
        activeDiaQcId,
        activeCsQcId,
        activeSize,
        customizingItem?.SizeMarkUp,
        customizingItem?.FinalCost,
        customizingItem?.UnitCostWithMarkUp,
        visiterId
      );

      // 2. Update quantity if changed
      if (editQty !== editingItem?.Quantity) {
        await updateQuantity(customizingItem?.id, editQty, visiterId);
      }

      toast.success("Cart updated successfully");
      await loadCartData(true);
      setEditingItem(null);
      setCustomizingItem(null);
    } catch (err) {
      console.error("Failed to apply customization:", err);
      toast.error("Failed to update cart");
    } finally {
      setIsPriceLoading(false);
    }
  };

  // 10. Save Product Remark
  const handleSaveProductRemark = async (item, remarkText) => {
    try {
      const res = await handleProductRemark(item, remarkText);
      if (res?.Data?.rd[0]?.stat === 1) {
        toast.success("Remark updated");
        await loadCartData(true);
      }
    } catch (e) {
      console.error("Save product remark failed:", e);
    }
  };

  // 11. Save Order Remark
  const handleSaveOrderRemark = async (remarkText) => {
    try {
      const res = await handleOrderRemark(remarkText);
      if (res?.Data?.rd[0]?.stat === 1) {
        setOrderRemark(remarkText);
        sessionStorage.setItem("orderRemark", remarkText);
        toast.success("Order remark saved");
      }
    } catch (e) {
      console.error("Save order remark failed:", e);
    }
  };

  // 12. Move to Product Detail Page (Navigation)
  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const handleMoveToDetail = (item) => {
    if (!item) return;
    const logindata = JSON.parse(sessionStorage.getItem("loginUserDetail")) || {};
    const storeInitData = JSON.parse(sessionStorage.getItem("storeInit")) || storeinit || {};

    const createAndNavigate = (obj) => {
      const encodedObj = compressAndEncode(JSON.stringify(obj));
      router.push(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodedObj}`);
    };

    const metalId =
      item?.metaltypeid ||
      item?.Metalid ||
      logindata?.MetalId ||
      storeInitData?.MetalId;

    const metalColorId =
      item?.metalcolorid ||
      item?.MetalColorId ||
      item?.MetalColorid ||
      "";

    let diaQc = "";
    if (item?.diamondqualityid && item?.diamondcolorid) {
      diaQc = `${item.diamondqualityid},${item.diamondcolorid}`;
    } else if (item?.diamondqualityid) {
      diaQc = `${item.diamondqualityid}`;
    } else {
      diaQc = logindata?.cmboDiaQCid || storeInitData?.cmboDiaQCid || "0,0";
    }

    let csQc = "";
    if (item?.colorstonequalityid && item?.colorstonecolorid) {
      csQc = `${item.colorstonequalityid},${item.colorstonecolorid}`;
    } else if (item?.colorstonequalityid) {
      csQc = `${item.colorstonequalityid}`;
    } else {
      csQc = logindata?.cmboCSQCid || storeInitData?.cmboCSQCid || "0,0";
    }

    if (storeinit?.IsMultiVariantCart === 1) {
      const obj = {
        a: item?.autocode,
        b: item?.designno,
        m: metalId,
        d: diaQc,
        c: csQc,
        f: {},
        g: [["", ""], ["", "", ""]],
        i: metalColorId,
        l: item?.ImageExtension || "",
        count: item?.ImageCount || 0,
        s: item?.Size || "",
        type: "IsMultiVariant",
      };
      createAndNavigate(obj);
      return;
    }

    if (item?.StockNo && String(item.StockNo).trim() !== "") {
      const obj = {
        a: item?.autocode,
        b: item?.designno,
        m: logindata?.MetalId || metalId,
        d: logindata?.cmboDiaQCid || diaQc,
        c: logindata?.cmboCSQCid || csQc,
        f: {},
        g: [["", ""], ["", "", ""]],
        i: metalColorId,
        l: item?.ImageExtension || "",
        count: item?.ImageCount || 0,
        s: item?.Size || "",
      };
      createAndNavigate(obj);
    } else {
      const obj = {
        a: item?.autocode,
        b: item?.designno,
        m: metalId,
        d: diaQc,
        c: csQc,
        f: {},
        g: [["", ""], ["", "", ""]],
        i: metalColorId,
        l: item?.ImageExtension || "",
        count: item?.ImageCount || 0,
        s: item?.Size || "",
      };
      createAndNavigate(obj);
    }
  };

  // 13. Address Selection & Management
  const handleSelectAddress = async (addr) => {
    try {
      await setDefaultAddress(addr, addressList);
      setSelectedAddress(addr);
      sessionStorage.setItem("selectedAddressId", JSON.stringify(addr));
      setIsAddressModalOpen(false);
      await loadAddresses();
    } catch (e) {
      console.error("Select address failed:", e);
    }
  };

  const handleAddNewAddress = async (formData) => {
    try {
      const res = await addAddress(formData);
      if (res) {
        toast.success("Address added successfully");
        await loadAddresses();
        return true;
      }
    } catch (e) {
      console.error("Add address error:", e);
      toast.error("Failed to add address");
    }
    return false;
  };

  // 14. Place Order / Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!islogin) {
      router.push(`/LoginOption?LoginRedirect=${encodeURIComponent("/cartPage")}`);
      return;
    }

    if (!selectedAddress) {
      toast.error("Please set a delivery address first");
      setIsAddressModalOpen(true);
      return;
    }

    const visiterId = Cookies.get("visiterId");
    setIsPlacingOrder(true);

    try {
      if (selectedPaymentMethod === "3") {
        // Cash on Delivery
        const res = await handlePaymentAPI(visiterId, islogin, "Cash on Delivery");
        if (res?.Data?.rd?.[0]?.stat === 1) {
          const orderNum = res.Data.rd[0]?.orderno;
          sessionStorage.setItem("orderNumber", orderNum);
          sessionStorage.removeItem("orderRemark");
          setOrderNumber(orderNum);
          setIsOrderSuccess(true);
          const countRes = await GetCountAPI(visiterId);
          if (countRes?.cartcount !== undefined) {
            setCartCountNum(countRes.cartcount);
          }
          setTimeout(() => {
            router.push("/confirmation");
          }, 2000);
        } else {
          setIsPlacingOrder(false);
          toast.error(res?.Data?.rd?.[0]?.stat_msg || "Payment failed. Please try again.");
        }
      } else if (selectedPaymentMethod === "10") {
        // Razorpay
        const razorPayData = {
          description: orderRemark,
          price: Math.round(parseFloat(taxData?.TotalAmountWithTax || 0) * 100),
          addressData: selectedAddress,
        };
        const orderRes = await fetchRazorPayData(razorPayData);
        const orderId = orderRes?.Attributes?.id;

        if (orderId && window.Razorpay) {
          const options = {
            key: loginUserDetail?.razorpay_key || "",
            amount: Math.round(parseFloat(taxData?.TotalAmountWithTax || 0) * 100),
            currency: currencyCode,
            name: storeinit?.companyname || "Jewelry Store",
            image: storeinit?.favicon,
            order_id: orderId,
            prefill: {
              name: `${selectedAddress?.shippingfirstname || ""} ${selectedAddress?.shippinglastname || ""}`,
              email: loginUserDetail?.userId || "",
              contact: loginUserDetail?.mobileno || selectedAddress?.shippingmobile || "",
            },
            handler: async function (paymentResponse) {
              const verifyRes = await handleVerifySignature({
                razorpay_payment_id: paymentResponse?.razorpay_payment_id,
                razorpay_order_id: paymentResponse?.razorpay_order_id,
                razorpay_signature: paymentResponse?.razorpay_signature,
              });
              if (verifyRes?.Data?.signature?.[0]?.state === 1) {
                const payRes = await handlePaymentAPI(visiterId, islogin, "pay with Razorpay");
                if (payRes?.Data?.rd?.[0]?.stat === 1) {
                  const orderNum = payRes.Data.rd[0]?.orderno;
                  sessionStorage.setItem("orderNumber", orderNum);
                  sessionStorage.removeItem("orderRemark");
                  setOrderNumber(orderNum);
                  setIsOrderSuccess(true);
                  setTimeout(() => {
                    router.push("/confirmation");
                  }, 2000);
                } else {
                  setIsPlacingOrder(false);
                  toast.error(payRes?.Data?.rd?.[0]?.stat_msg || "Order placement failed");
                }
              } else {
                setIsPlacingOrder(false);
                toast.error("Payment signature verification failed");
              }
            },
            modal: {
              ondismiss: function () {
                setIsPlacingOrder(false);
              },
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          setIsPlacingOrder(false);
          toast.error("Razorpay initiation failed");
        }
      } else {
        setIsPlacingOrder(false);
        toast.info("Selected payment method is coming soon!");
      }
    } catch (e) {
      console.error("Checkout failed:", e);
      setIsPlacingOrder(false);
      toast.error("Checkout failed. Please try again.");
    }
  };

  // Totals calculations fallback
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item?.FinalCost) || Number(item?.UnitCostWithMarkUp) || 0),
    0
  );
  const estimatedTax = taxData?.TaxAmount !== undefined ? Number(taxData?.TaxAmount) : 0;
  const totalAmount =
    taxData?.TotalAmountWithTax !== undefined
      ? Number(taxData?.TotalAmountWithTax)
      : subtotal + estimatedTax;

  return {
    storeinit,
    cartItems,
    isLoadingCart,
    isPriceLoading,
    isLoadingTax,
    subtotal,
    estimatedTax,
    totalAmount,
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

    // Cart actions
    handleRemoveItem,
    handleRemoveAll,
    handleSaveProductRemark,
    handleMoveToDetail,

    // Address
    addressList,
    selectedAddress,
    isLoadingAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    handleSelectAddress,
    handleAddNewAddress,
    loadAddresses,

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
  };
}
