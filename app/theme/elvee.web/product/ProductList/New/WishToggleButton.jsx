import React from "react";
import { Checkbox, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const WishToggleButton = ({ productData, wishArr, handleCartandWish }) => {
  const isInWish =
    wishArr?.[productData?.autocode] ?? productData?.IsInWish === 1
      ? true
      : false;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 5,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "50%",
        width: 42,
        height: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: "#fff",
          transform: "scale(1.1)",
        },
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isInWish ? "in-wish" : "not-in-wish"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Checkbox
            checked={isInWish}
            onChange={(e) => {
              e.stopPropagation();
              handleCartandWish(e, productData, "Wish");
            }}
            disableRipple
            icon={
              <FavoriteBorderIcon
                sx={{
                  fontSize: 25,
                  color: "#000",
                  opacity: 0.4,
                  transition: "opacity 0.25s ease",
                }}
              />
            }
            checkedIcon={
              <FavoriteIcon
                sx={{
                  fontSize: 25,
                  color: "#000",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                }}
              />
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

export default WishToggleButton;
