import React, { useEffect, useState, useRef } from "react";
import "./elv_cartPage.scss";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Box, Checkbox, IconButton, Skeleton, useMediaQuery } from "@mui/material";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import RemarkDialog from "./OrderRemarkDialog";
import ItemRemarkDialog from "./ItemRemarkDialog";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import { RiDeleteBinLine, RiCloseLine } from "react-icons/ri";
import { formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Cookies from "js-cookie";

// Shared column widths so each row lines up under the header row
const COLUMN_WIDTHS = {
  image: 180,
  price: 130,
  totalPrice: 130,
  delete: 40,
};

const CartItem = ({ item, index, CartCardImageFunc, onSelect, CurrencyData, showRemark1, decodeEntities, isSelected, selectedItem, selectedItemsLength, isActive, border, handleBorder, multiSelect, onRemove, itemLength, showRemark, productRemark, handleAddRemark, handleRemarkChange, handleSave, handleCancel, openHandleUpdateCartModal }) => {
  const [remark, setRemark] = useState(item.Remarks || "");
  const noImageFound = "/image-not-found.jpg";
  const { setCartCountNum, loginUserDetail, storeInit } = useStore();
  const [open1, setOpen1] = useState(false);
  const visiterId = Cookies.get("visiterId");
  const [open, setOpen] = useState(false);
  const { broadcast } = useBroadcaster();
  // const [countstatus, setCountStatus] = useState();

  const isLoading = item?.loading;

  const CDNDesignImageFolThumb = storeInit?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
  const defaultUrl = item?.images && typeof item?.images === 'string'
    ? item.images.replace("/Design_Thumb", "")
    : "";
  const firstPart = defaultUrl?.split(".")[0];
  const secondPart = item?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    let imageURL = item?.images
      ? finalSelectedUrl
      : item?.ImageCount > 1
        ? `${CDNDesignImageFolThumb}${item?.designno}~1~${item?.metalcolorname}.jpg`
        : `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.onerror = () => {
      if (item?.ImageCount > 0) {
        setImgSrc(fullImagePath || noImageFound);
      } else {
        setImgSrc(noImageFound);
      }
    };
    img.src = imageURL;
  }, [item, CDNDesignImageFolThumb, finalSelectedUrl]);

  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isMobileScreen = useMediaQuery("(min-width: 320px) and (max-width: 1037px)");

  // ---- Container-based (not viewport-based) responsiveness ----
  // This card can be rendered inside narrow grid columns even on a wide
  // screen, so MUI's viewport breakpoints (xs/sm) are unreliable here.
  // We measure the card's own width and switch layout based on that.
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const STACK_BREAKPOINT = 460; // below this width, stack everything vertically
  const COMPACT_BREAKPOINT = 600; // below this, use a tighter row layout
  const isStacked = containerWidth > 0 && containerWidth < STACK_BREAKPOINT;
  const isCompact = containerWidth > 0 && containerWidth < COMPACT_BREAKPOINT;

  // useEffect(() => {
  //   const isCartUpdateStatus = sessionStorage.getItem("cartUpdation");
  //   setCountStatus(isCartUpdateStatus);
  // }, [onRemove]);

  const handleRemarkChangeInternal = (e) => {
    setRemark(e.target.value);
    handleRemarkChange(e);
  };

  const handleSaveInternal = () => {
    handleSave(item);
    handleClose1();
  };

  const handleRemoveItem = async (item) => {
    const returnValue = await onRemove(item);
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setCartCountNum(res?.cartcount);
        broadcast('UPDATE_CART_COUNT', res?.cartcount, item?.autocode, "cart", false);
      });
    }
  };

  const handleConfirm = () => {
    handleRemoveItem(item, index);
    handleClose();
  };

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text?.substring(0, maxLength) + "...";
  }

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // ---- Derived display values (built only from fields already on `item`) ----
  const weightParts = [];
  if (item?.Gwt) weightParts.push(`Gwt: ${Number(item.Gwt).toFixed(3)}`);
  if (item?.Nwt) weightParts.push(`Nwt: ${Number(item.Nwt).toFixed(3)}`);
  if (storeInit?.IsDiamondWeight == 1 && (item?.Dwt !== "0" || item?.Dpcs !== "0")) {
    weightParts.push(`Dwt: ${(item?.Dwt || 0).toFixed(3)} / ${item?.Dpcs || 0}`);
  }

  const quantity = item?.Quantity || 1;
  // Falls back to FinalCost x Quantity if a dedicated total field doesn't exist on item
  const totalPrice = item?.TotalCost ?? (item?.FinalCost ? item.FinalCost * quantity : item?.FinalCost);

  const currencySymbol = decodeEntities(loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode) + " ";

  return (
  <>

    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: isStacked ? "column" : "row",
        alignItems: isStacked ? "stretch" : "center",
        flexWrap: isCompact && !isStacked ? "wrap" : "nowrap",
        gap: isStacked ? 1.5 : isCompact ? 1.5 : 3,
        border: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id
          ? "1px solid #000000"
          : "1px solid #e8e8e8",
        borderRadius: 1.5,
        bgcolor: "#fff",
        p: isStacked ? 1.5 : 2,
        boxSizing: "border-box",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
      
      }}
      onClick={() => onSelect(item)}
    >
      {/* Image */}
      <Box
        sx={{
          width: isStacked ? "100%" : COLUMN_WIDTHS.image,
          height: isStacked ? 160 : COLUMN_WIDTHS.image,
          flexShrink: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#fff9f266",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading === true ? (
          <Skeleton variant="rectangular" sx={{ width: "100%", height: "100%", bgcolor: "#fafafa" }} />
        ) : (
          <CardMedia
            component="img"
            image={imgSrc}
            alt=""
            loading="eager"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              mixBlendMode: "multiply",
              cursor: "pointer",
              '&:focus': { outline: 'none' },
              '&:active': { outline: 'none' },
            }}
            onError={(e) => {
              const imgEl = e.target;
              if (!imgEl.dataset.triedFullImage && fullImagePath) {
                imgEl.src = fullImagePath;
                imgEl.dataset.triedFullImage = "true";
              } else if (!imgEl.dataset.triedNoImage) {
                imgEl.src = noImageFound;
                imgEl.dataset.triedNoImage = "true";
              }
            }}
          />
        )}
      </Box>

      {/* Product Details */}
      
      <Box sx={{ flex: 0.5, minWidth: isStacked ? "auto" : 100, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          sx={{
            fontWeight: 600,
            lineHeight: 1.35,
            color: "black",
            fontSize: isCompact ? "0.82rem" : "1.3rem",
            wordBreak: "break-word",
          }}
        >
          {item?.designno}
          {item?.StockNo ? ` (${item.StockNo})` : ""}
          {item?.designno || item?.StockNo ? " - " : ""}
          {formatTitleLine(item?.TitleLine)}
        </Typography>

        {weightParts.length > 0 && (
          <Typography sx={{ fontSize: isCompact ? "0.68rem" : "0.78rem", color: "black", display: "flex", flexWrap: "wrap", columnGap: "6px" }}>
            {weightParts.map((part, i) => (
              <Box component="span" key={i} sx={{ whiteSpace: "nowrap" }}>
                {part}{i < weightParts.length - 1 ? " |" : ""}
              </Box>
            ))}
          </Typography>
        )}

        {(item?.Quantity || item?.Size) && (
          <Typography sx={{ fontSize: isCompact ? "0.68rem" : "0.78rem", color: "black" }}>
            {item?.Quantity ? <>Quantity: <Box component="span" sx={{ color: "black", fontWeight: 600 }}>{item.Quantity}</Box></> : null}
            {item?.Quantity && item?.Size ? "   " : ""}
            {item?.Size ? <>Size: {item.Size}</> : null}
          </Typography>
        )}

       
      </Box>

      {/* Price */}
      <Box
        sx={{
          flex: 0.5,
          width: isStacked ? "100%" : "auto",
          minWidth: isCompact ? 80 : COLUMN_WIDTHS.price,
          flexShrink: 0,
          textAlign: isStacked ? "left" : "center",
        }}
      >
        {storeInit?.IsPriceShow == 1 ? (
          <>
            <Typography sx={{ fontWeight: 700, fontSize: isCompact ? "0.78rem" : "1.3rem", color: "black", whiteSpace: "nowrap" }}>
              <span dangerouslySetInnerHTML={{ __html: currencySymbol }} />
              {formatter(item?.FinalCost)}
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "black" }}>(Excl. VAT)</Typography>
          </>
        ) : (
          <Typography sx={{ fontWeight: 700, color: "black" }}>--</Typography>
        )}
      </Box>

      {/* Total Price */}
      <Box
        sx={{
          width: isStacked ? "100%" : "auto",
          minWidth: isCompact ? 80 : COLUMN_WIDTHS.totalPrice,
          flexShrink: 0,
          textAlign: isStacked ? "left" : "center",
        }}
      >
        {storeInit?.IsPriceShow == 1 ? (
          <>
            <Typography sx={{ fontWeight: 700, fontSize: isCompact ? "0.78rem" : "1.3rem", color: "black", whiteSpace: "nowrap" }}>
              <span dangerouslySetInnerHTML={{ __html: currencySymbol }} />
              {formatter(totalPrice)}
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "black" }}>(Excl. VAT)</Typography>
          </>
        ) : (
          <Typography sx={{ fontWeight: 700, color: "black" }}>--</Typography>
        )}
      </Box>

      {/* Delete Icon - sits in its own column at the far right, matching header layout */}
      <Box
        sx={{
          width: isStacked ? "100%" : COLUMN_WIDTHS.delete,
          flexShrink: 0,
          display: "flex",
          justifyContent: isStacked ? "flex-end" : "center",
        }}
      >
        <IconButton
          size="small"
          sx={{
            width: 30,
            height: 30,
            bgcolor: "#9b9b9b",
            color: "#fff",
            "&:hover": { bgcolor: "#7a7a7a" },
          }}
          onClick={handleOpen}
        >
          <RiCloseLine size={18} />
        </IconButton>
      </Box>

      {/* Modals */}
      <ItemRemarkDialog handleClose1={handleClose1} open1={open1} remark={remark} onRemarkChange={handleRemarkChangeInternal} onSave={handleSaveInternal} />

      <ConfirmationDialog open={open} onClose={handleClose} onConfirm={handleConfirm} title={"Confirm"} content={"Are You Sure to Delete this items?"} />
    </Box>
  
  </>
  );
};

export default CartItem;