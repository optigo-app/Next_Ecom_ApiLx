"use client";

import React from "react";
import { Box, Checkbox } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";

const MobileCartToggleButton = ({ productData, cartArr, handleCartandWish }) => {
  const autocodeKey = productData?.autocode ? String(productData.autocode) : null;
  const articleKey = productData?.ArticleNo ? String(productData.ArticleNo) : null;
  const designKey = productData?.designno ? String(productData.designno) : null;

  const isInCart = Boolean(
    (autocodeKey && cartArr?.[autocodeKey] !== undefined ? cartArr[autocodeKey] : undefined) ??
    (articleKey && cartArr?.[articleKey] !== undefined ? cartArr[articleKey] : undefined) ??
    (designKey && cartArr?.[designKey] !== undefined ? cartArr[designKey] : undefined) ??
    (productData?.IsInCart === 1)
  );

  return (
    <Box onClick={(e) => e.stopPropagation()} sx={{ display: "flex", justifyContent: "flex-end" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isInCart ? "in-cart" : "not-in-cart"}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
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
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(6px)",
                  color: "#0d1232",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#0d1232",
                    color: "#ffffff",
                    borderColor: "#0d1232",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <LocalMallOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
            }
            checkedIcon={
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "#0d1232",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "1px solid #0d1232",
                  boxShadow: "0 2px 8px rgba(13, 18, 50, 0.25)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#1c2559",
                    borderColor: "#1c2559",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <LocalMallIcon sx={{ fontSize: 18 }} />
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

export default MobileCartToggleButton;
