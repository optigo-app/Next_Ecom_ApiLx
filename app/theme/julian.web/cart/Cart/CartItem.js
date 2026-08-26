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
import { RiDeleteBinLine } from "react-icons/ri";
import { formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Cookies from "js-cookie";

const CartItem = ({ item, index, CartCardImageFunc, onSelect, handleMoveToDetail, CurrencyData, showRemark1, decodeEntities, isSelected, selectedItem, selectedItemsLength, isActive, border, handleBorder, multiSelect, onRemove, itemLength, showRemark, productRemark, handleAddRemark, handleRemarkChange, handleSave, handleCancel, openHandleUpdateCartModal }) => {
  const [remark, setRemark] = useState(item.Remarks || "");
  const noImageFound = "/image-not-found.jpg";
  const { setCartCountNum, loginUserDetail, storeInit } = useStore();
  const [open1, setOpen1] = useState(false);
  const visiterId = Cookies.get("visiterId");
  const [open, setOpen] = useState(false);
  const { broadcast } = useBroadcaster();
  // const [countstatus, setCountStatus] = useState();

  const handleItemClick = () => {
    if (typeof handleMoveToDetail === "function") {
      handleMoveToDetail(item);
    } else if (typeof onSelect === "function") {
      onSelect(item);
    }
  };
  
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

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 3,
        border: "1px solid #e5e5e5",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: !multiSelect && !isMobileScreen && selectedItem?.id == item?.id && "#0d1232 1px 1px 1px 0px, #0d1232 0px 0px 0px 1px !important",
        boxSizing: 'border-box'
      }}
    >
      {/* Delete Icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          bgcolor: "#dbdbdb38",
          backdropFilter: "blur(4px)",
          "&:hover": { background: "rgba(255,255,255,0.9)" },
        }}
        onClick={handleOpen}
      >
        <RiDeleteBinLine />
      </IconButton>

      {/* Image Wrapper */}
      <Box
        onClick={handleItemClick}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          aspectRatio: {
            xs: "3 / 3",
            sm: "1 / 1",
            md: "1 / 1",
          },
          bgcolor: "#fff9f266",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {isLoading === true ? (
          <Skeleton variant="rectangular" sx={{ width: "100%", height: "100%", bgcolor: "#fafafa" }} />
        ) : (
          <CardMedia
            component="img"
            image={imgSrc}
            alt=""
            loading='eager'
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onClick={handleItemClick}
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

      <Box sx={{ width: "100%", px: 2, py: 1, display: "flex", flexDirection: "column", gap: 1, boxSizing: 'border-box' }}>
        <Typography
          variant="body1"
          onClick={handleItemClick}
          sx={{
            fontWeight: 600,
            lineHeight: 1.35,
            color: "#0a1f47",
            textAlign: "center",
            mb: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "1.3em",
            fontSize: { xs: "0.82rem", sm: "0.9rem", md: "0.94rem", lg: "1rem" },
            cursor: "pointer",
          }}
        >
          {formatTitleLine(item?.TitleLine)}
        </Typography>
        {item?.StockNo && (
          <Typography
            component="span"
            sx={{
              fontSize: { xs: 10, sm: 13, md: 14 },
              lineHeight: 1.4,
              ml: 0.3,
              fontWeight: 500,
              fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
              letterSpacing: "0.02em",
            }}
          >
            ({item.StockNo})
          </Typography>
        )}
        {/* ===========================
   NEW ARRIVAL GRID FEELING
   3 ROWS — ALWAYS SAME HEIGHT
=========================== */}
        <Grid container spacing={0.8}>
          {/* DWT (SLOT 1) */}
          <Grid item size={{
            xs: 6
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                  color: item?.designno ? "#000" : "transparent",
                  letterSpacing: "0.02em",
                }}
              >
                {item?.designno}
              </Typography>
            </Box>
          </Grid>
          <Grid item size={{
            xs: 6
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                  color: item?.Dwt ? "#000" : "transparent",
                  letterSpacing: "0.02em",
                }}
              >
                DWT&nbsp;:
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                  color: item?.Dwt ? "#000" : "transparent",
                }}
              >
                {storeInit?.IsDiamondWeight == 1
                  ? item?.Dwt !== "0" || item?.Dpcs !== "0"
                    ? `${(item?.Dwt || 0).toFixed(3)} / ${item?.Dpcs || 0}`
                    : "" // EMPTY BUT SPACE PRESERVED
                  : ""}
              </Typography>
            </Box>
          </Grid>
          <Grid item size={{
            xs: 6
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {storeInit?.IsPriceShow == 1 ? (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
                    color: item?.FinalCost ? "#000" : "transparent",
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        decodeEntities(
                          loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode
                        ) + " ",
                    }}
                  />
                  {formatter(item?.FinalCost)}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
                    color: "#000",
                  }}
                >
                  --
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item size={{
            xs: 6
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.62rem", sm: "0.8rem", md: "0.85rem" },
                  color: item?.Nwt ? "#000" : "transparent",
                  letterSpacing: "0.02em",
                }}
              >
                NWT&nbsp;:
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
                  color: item?.Nwt ? "#000" : "transparent",
                }}
              >
                {item?.Nwt?.toFixed(3) || "0"}
              </Typography>
            </Box>
          </Grid>

        </Grid>

        {/* ================================
       REMARK — KEEP SPACING STABLE
     ================================ */}
        <Box sx={{ minHeight: 22, display: "flex", alignItems: "center" }}>
          {item?.Remarks ? (
            <Typography fontSize={14}>
              <strong>Remark: </strong>
              {truncateText(item?.Remarks || productRemark, 40)}
            </Typography>
          ) : (
            <Typography fontSize={14} color="transparent" sx={{ userSelect: "none" }}>
              empty
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            onClick={handleOpen1}
            sx={{
              fontSize: 14,
              color: "#1a73e8",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {item?.Remarks ? "Edit Remark" : "Add Remark"}
          </Typography>

          <Box
            sx={{
              px: 2,
              py: 0.6,
              bgcolor: "#f3f3f3",
              borderRadius: 20,
              fontSize: 13,
              minWidth: "88px",
              textAlign: "center",
            }}
          >
            In Cart
          </Box>
        </Box>
      </Box>

      {/* Modals */}
      <ItemRemarkDialog handleClose1={handleClose1} open1={open1} remark={remark} onRemarkChange={handleRemarkChangeInternal} onSave={handleSaveInternal} />

      <ConfirmationDialog open={open} onClose={handleClose} onConfirm={handleConfirm} title={"Confirm"} content={"Are You Sure to Delete this items?"} />
    </Card>
  );
};

export default CartItem;
