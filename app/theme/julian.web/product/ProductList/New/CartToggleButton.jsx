import React from "react";
import { Box, Checkbox } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";

const CartToggleButton = ({ productData, cartArr, handleCartandWish }) => {
  const isInCart =
    cartArr?.[productData?.autocode] ?? productData?.IsInCart === 1
      ? true
      : false;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 14,
        right: 16,
        zIndex: 25,
      }}
      className="product-button-cart-elee"
      data-is-in-cart={isInCart ? "in-cart" : "not-in-cart"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isInCart ? "in-cart" : "not-in-cart"}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Checkbox
            checked={isInCart}
            onChange={(e) => {
              e.stopPropagation();
              handleCartandWish(e, productData, "Cart");
            }}
            disableRipple
            icon={
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "#111",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                <LocalMallOutlinedIcon sx={{ fontSize: 16 }} />
              </Box>
            }
            checkedIcon={
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "#111",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                <LocalMallIcon sx={{ fontSize: 16 }} />
              </Box>
            }
            sx={{
              p: 0,
              "&:hover": { backgroundColor: "transparent" },
            }}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default CartToggleButton;