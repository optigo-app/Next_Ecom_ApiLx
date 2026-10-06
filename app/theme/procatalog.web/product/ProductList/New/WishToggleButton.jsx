import React from "react";
import { Checkbox, Box, Skeleton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { isItemInMap } from "@/app/(core)/utils/API/GetCount/GetCountAPI";

const WishToggleButton = ({ productData, wishArr, handleCartandWish }) => {
  const isReady = Boolean(wishArr?.__hydrated);
  const isInWish = isItemInMap(wishArr, productData, productData?.IsInWish === 1);

  if (!isReady) {
    return (
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 25,
        }}
      >
        <Skeleton variant="circular" width={34} height={34} />
      </Box>
    );
  }

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 25,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
        borderRadius: "50%",
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: "#ffffff",
          transform: "scale(1.08)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.14)",
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
                  fontSize: 20,
                  color: "#222",
                  opacity: 0.65,
                  transition: "opacity 0.25s ease",
                }}
              />
            }
            checkedIcon={
              <FavoriteIcon
                sx={{
                  fontSize: 20,
                  color: "#e11d48",
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
