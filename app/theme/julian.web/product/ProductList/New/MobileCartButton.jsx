import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";

const MobileCartToggleButton = ({ productData, cartArr, handleCartandWish }) => {
    const isInCart =
        cartArr?.[productData?.autocode] ?? productData?.IsInCart === 1
            ? true
            : false;

    return (
        <Box>
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
                                    backgroundColor: "#fafafa",            // light grey instead of pure white
                                    color: "#111",
                                    borderRadius: "16px",
                                    px: 1,
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
                                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",  // soft visible shadow
                                    "&:hover": {
                                        backgroundColor: "#111",
                                        color: "#fff",
                                        transform: "scale(1.05)",
                                    },
                                    width: '100%'
                                }}
                            >
                                <LocalMallOutlinedIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 , fontSize : '0.75rem' }}>
                                    Add to cart
                                </Typography>
                            </Box>
                        }
                        checkedIcon={
                            <Box
                                sx={{
                                    backgroundColor: "#111",
                                    color: "#fff",
                                    borderRadius: "16px",
                                    px: 1,
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
                                    width: '100%'
                                }}
                            >
                                <LocalMallIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 , fontSize : '0.75rem' }}>
                                    Added
                                </Typography>
                            </Box>
                        }
                        sx={{
                            width: '100%',
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
