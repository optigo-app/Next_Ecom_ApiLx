"use client";

import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import ShoppingBagItem from "./ShoppingBagItem";
import { useRouter } from "next/navigation";
import { handelOpenMenu } from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu";

export default function ShoppingBagList({
  cartItems,
  isLoading,
  storeinit,
  currencyCode,
  formatter,
  editingItem,
  onStartEdit,
  onRemoveItem,
  onSaveProductRemark,
  handleMoveToDetail,
}) {
  const router = useRouter();

  const handleBrowse = async () => {
    try {
      const url = await handelOpenMenu();
      if (url && url !== "/") {
        router.push(url);
      } else {
        const firstUrl = typeof window !== "undefined" ? sessionStorage.getItem("firstAlbumUrl") : null;
        if (firstUrl) {
          router.push(firstUrl);
        } else {
          router.push("/");
        }
      }
    } catch (e) {
      console.error("Browse collection error:", e);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={25} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="30%" height={20} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
          bgcolor: "#fafafa",
          borderRadius: 2,
          border: "1px dashed #ddd",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
          Your shopping bag is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Explore our collection and add your favorite pieces to the cart.
        </Typography>
        <Button
          variant="contained"
          onClick={handleBrowse}
          className="testCheckout_primary_btn"
          sx={{
            bgcolor: "var(--checkout-primary, #cca182)",
            color: "var(--checkout-btn-color, #fff)",
            textTransform: "none",
            px: 4,
            py: 1,
            "&:hover": {
              bgcolor: "var(--checkout-primary-hover, #b88d6e)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          Browse Our Collection
        </Button>
      </Box>
    );
  }

  return (
    <Box className="testCheckout_bagList">
      {cartItems.map((item) => (
        <ShoppingBagItem
          key={item.id}
          item={item}
          storeinit={storeinit}
          currencyCode={currencyCode}
          formatter={formatter}
          isEditing={editingItem?.id === item.id}
          onStartEdit={onStartEdit}
          onRemoveItem={onRemoveItem}
          onSaveProductRemark={onSaveProductRemark}
          handleMoveToDetail={handleMoveToDetail}
        />
      ))}
    </Box>
  );
}
