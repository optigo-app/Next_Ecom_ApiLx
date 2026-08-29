"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ProductRemarkModal from "./ProductRemarkModal";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";

const noImageFound = "/image-not-found.jpg";

export default function ShoppingBagItem({
  item,
  storeinit,
  currencyCode,
  formatter,
  isEditing,
  onStartEdit,
  onRemoveItem,
  onSaveProductRemark,
  handleMoveToDetail,
}) {
  const router = useRouter();
  const { islogin } = useStore();
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const CDNDesignImageFolThumb = storeinit?.CDNDesignImageFolThumb;
  const CDNDesignImageFol = storeinit?.CDNDesignImageFol;
  const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
  const fullImagePathHd = `${CDNDesignImageFol}${item?.designno}~1.${item?.ImageExtension || "jpg"}`;

  const isInStock =
    (item?.StockId !== 0 && item?.StockId !== undefined && item?.StockId !== null) ||
    item?.IsInReadyStock === 1 ||
    item?.IsInReadyStock === "1" ||
    item?.IsInStock === 1 ||
    item?.IsInStock === "1" ||
    item?.IsMrpBase === 1 ||
    item?.isMrpBase === 1;

  const isMrpProduct =
    item?.IsMrpBase === 1 || item?.isMrpBase === 1 || (item?.StockId !== 0 && item?.StockId !== undefined && item?.StockId !== null);

  const itemPrice = item?.FinalCost || item?.UnitCostWithMarkUp || 0;

  return (
    <Box
      className={`testCheckout_itemCard ${isEditing ? "testCheckout_itemCard--editing" : ""}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 2, sm: 3 },
        borderBottom: "1px solid #f2f2f2",
        position: "relative",
        transition: "background-color 0.2s ease",
        "&:hover": {
          bgcolor: "#fafafa",
        },
      }}
    >
      {/* Product Image - Full edge-to-edge box with click-to-detail */}
      <Box
        className="testCheckout_itemImageWrapper"
        onClick={() => handleMoveToDetail && handleMoveToDetail(item)}
        sx={{
          width: { xs: 110, sm: 150, md: 250 },
          minHeight: { xs: 110, sm: 150, md: "100%" },
          aspectRatio: "1 / 1",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {/* In Stock Badge */}
        {isInStock && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 8 },
              left: { xs: 6, sm: 8 },
              bgcolor: "#2e7d32",
              color: "#fff",
              fontSize: { xs: "0.6rem", sm: "0.68rem" },
              fontWeight: 700,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              px: { xs: 0.7, sm: 1 },
              py: 0.2,
              borderRadius: "3px",
              zIndex: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}
          >
            In Stock
          </Box>
        )}

        <img
          src={item?.images || fullImagePath}
          alt={item?.TitleLine || item?.designno}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
          loading="lazy"
        />
      </Box>

      {/* Product Details - Clean Light Aesthetic */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          pr: { xs: 4, sm: 4 },
          p: { xs: 1.2, sm: 2, md: 2.5 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3, flexWrap: "wrap" }}>
          <Typography
            variant="subtitle1"
            onClick={() => handleMoveToDetail && handleMoveToDetail(item)}
            sx={{
              fontWeight: 600,
              fontSize: { xs: "0.88rem", sm: "1.05rem" },
              color: "#222",
              letterSpacing: "0.2px",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {item?.designno} {item?.StockNo ? `(${item?.StockNo})` : ""}
          </Typography>

          {isInStock && (
            <Box
              component="span"
              sx={{
                display: { xs: "inline-block", sm: "none" },
                bgcolor: "#e8f5e9",
                color: "#2e7d32",
                border: "1px solid #c8e6c9",
                fontSize: "0.68rem",
                fontWeight: 600,
                px: 0.8,
                py: 0.15,
                borderRadius: "3px",
              }}
            >
              In Stock
            </Box>
          )}
        </Box>
        {/* Weights Specs */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 12px",
            fontSize: "0.8rem",
            color: "#777",
            fontWeight: 600,
            mb: 0.6,
          }}
        >
          {storeinit?.IsGrossWeight == 1 && Number(item?.Gwt) > 0 && (
            <span>GWT: {Number(item?.Gwt || 0).toFixed(3)}</span>
          )}
          {storeinit?.IsMetalWeight == 1 && Number(item?.Nwt) > 0 && (
            <span>NWT: {Number(item?.Nwt || 0).toFixed(3)}</span>
          )}
          {storeinit?.IsDiamondWeight == 1 &&
            (Number(item?.Dwt) > 0 || Number(item?.Dpcs) > 0) && (
              <span>
                DWT: {Number(item?.Dwt || 0).toFixed(3)} / {item?.Dpcs || 0}
              </span>
            )}
          {storeinit?.IsStoneWeight == 1 &&
            (Number(item?.CSwt) > 0 || Number(item?.CSpcs) > 0) && (
              <span>
                CWT: {Number(item?.CSwt || 0).toFixed(3)} / {item?.CSpcs || 0}
              </span>
            )}
        </Box>

        {/* Customization Specs */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            fontSize: "0.8rem",
            color: "#555",
            fontWeight: 600,
            mb: 0.8,
          }}
        >
          {storeinit?.IsMetalCustomization == 1 && item?.metaltypename && (
            <span>
              {item?.metaltypename} {item?.metalcolorname ? `(${item?.metalcolorname})` : ""}
            </span>
          )}
          {storeinit?.IsDiamondCustomization == 1 && item?.diamondquality && (
            <span>
              {storeinit?.IsMetalCustomization == 1 && item?.metaltypename ? " | " : ""}
              {item?.diamondquality}
            </span>
          )}
          {storeinit?.IsCsCustomization == 1 && item?.colorstonequality && (
            <span>
              {storeinit?.IsDiamondCustomization == 1 && item?.diamondquality ? ", " : " | "}
              {item?.colorstonequality}
            </span>
          )}
          {item?.Size && <span> | Size: {item?.Size}</span>}
          <span> | Qty: {item?.Quantity || 1}</span>
        </Box>

        {/* Price */}
        {storeinit?.IsPriceShow == 1 && (
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "#1a1a1a",
              mt: 0.3,
              mb: 0.8,
            }}
          >
            {currencyCode} {formatter(itemPrice)}
          </Typography>
        )}

        {/* Remarks display if present */}
        {item?.Remarks && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              color: "#777",
              fontWeight: 600,
              fontStyle: "italic",
              mb: 1,
            }}
          >
            Remark: {item.Remarks}
          </Typography>
        )}

        {/* Action Buttons: EDIT (Hidden for MRP) & Add/Update Remark */}
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.2, mt: 1 }}>
          {!isMrpProduct && (
            <Button
              size="small"
              startIcon={<ModeEditOutlineOutlinedIcon sx={{ fontSize: "14px !important" }} />}
              onClick={() => onStartEdit(item)}
              sx={{
                px: 1.5,
                py: 0.35,
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                borderRadius: "4px",
                border: "1px solid var(--checkout-primary, #cca182)",
                bgcolor: isEditing ? "var(--checkout-primary, #cca182)" : "var(--checkout-primary-light, #faf4ee)",
                color: isEditing ? "var(--checkout-btn-color, #fff)" : "var(--checkout-primary-text, #9c6d48)",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "var(--checkout-primary, #cca182)",
                  color: "var(--checkout-btn-color, #fff)",
                },
              }}
            >
              Edit
            </Button>
          )}

          <Button
            size="small"
            startIcon={<RateReviewOutlinedIcon sx={{ fontSize: "14px !important" }} />}
            onClick={() => {
              if (!islogin) {
                router.push(`/LoginOption?LoginRedirect=${encodeURIComponent("/cartPage")}`);
              } else {
                setIsRemarkOpen(true);
              }
            }}
            sx={{
              px: 1.4,
              py: 0.35,
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.2px",
              textTransform: "none",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              color: "#555",
              bgcolor: "#fff",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: "#999",
                color: "#111",
                bgcolor: "#f7f7f7",
              },
            }}
          >
            {item?.Remarks ? "Edit Note" : "Add Note"}
          </Button>
        </Box>
      </Box>

      {/* Remove [X] Button */}
      <IconButton
        aria-label="remove item"
        size="small"
        onClick={() => setIsDeleteModalOpen(true)}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "#999",
          border: "1px solid #eee",
          borderRadius: "4px",
          width: 28,
          height: 28,
          p: 0,
          "&:hover": {
            color: "#e53935",
            borderColor: "#e53935",
            bgcolor: "#fff5f5",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Product Remark Modal */}
      <ProductRemarkModal
        open={isRemarkOpen}
        onClose={() => setIsRemarkOpen(false)}
        initialRemark={item?.Remarks}
        onSave={(remarkText) => onSaveProductRemark(item, remarkText)}
      />

      {/* Confirmation Dialog before Removal */}
      <ConfirmationDialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onRemoveItem(item);
        }}
        title="Remove Item"
        content="Are you sure you want to remove this item from your bag?"
      />
    </Box>
  );
}
