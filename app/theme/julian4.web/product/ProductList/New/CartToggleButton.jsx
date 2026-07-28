import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";
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
                  backgroundColor: "#fff",
                  color: "#111",
                  borderRadius: "9999px",
                  px: 2.5,
                  py: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#111",
                    color: "#fff",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <LocalMallOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Add to cart
                </Typography>
              </Box>
            }
            checkedIcon={
              <Box
                sx={{
                  backgroundColor: "#111",
                  color: "#fff",
                  borderRadius: "9999px",
                  px: 2.5,
                  py: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#000",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <LocalMallIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Added
                </Typography>
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
