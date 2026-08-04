import { Box, Button } from "@mui/material";
import { FaHeart, FaRegHeart, FaShoppingCart, FaCheck } from "react-icons/fa";

const ButtonBlock = ({ addToCartFlag, wishListFlag, handleCart, handleWishList }) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1.5,
                mt: 2,
                mb: 2,
                boxSizing: 'border-box',
                width: '100%',
            }}
        >
            {/* Cart Button */}
            <Button
                fullWidth
                onClick={() => handleCart(!addToCartFlag)}
                sx={{
                    py: 1.2,
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textTransform: "none",
                    border: "1.5px solid #0b2f83 !important",
                    color: addToCartFlag ? "#ffffff !important" : "#0b2f83 !important",
                    backgroundColor: addToCartFlag ? "#0b2f83 !important" : "#ffffff !important",
                    boxShadow: "none !important",
                    "&:hover": {
                        backgroundColor: addToCartFlag ? "#082360 !important" : "#f0f4fc !important",
                        boxShadow: "none !important",
                    },
                }}
            >
                {addToCartFlag ? <FaCheck style={{ marginRight: 6 }} /> : <FaShoppingCart style={{ marginRight: 6 }} />}
                {!addToCartFlag ? "Add to Cart" : "In Cart"}
            </Button>

            {/* Wishlist Button */}
            <Button
                fullWidth
                onClick={() => handleWishList(!wishListFlag)}
                sx={{
                    py: 1.2,
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    border: "1.5px solid #d32f2f !important",
                    color: wishListFlag ? "#ffffff !important" : "#d32f2f !important",
                    backgroundColor: wishListFlag ? "#d32f2f !important" : "#ffffff !important",
                    boxShadow: "none !important",
                    "&:hover": {
                        backgroundColor: wishListFlag ? "#b71c1c !important" : "#fdf2f2 !important",
                        boxShadow: "none !important",
                    },
                }}
            >
                {wishListFlag ? <FaHeart style={{ fontSize: "15px", color: "#ffffff" }} /> : <FaRegHeart style={{ fontSize: "15px", color: "#d32f2f" }} />}
                {!wishListFlag ? "Wishlist" : "Saved"}
            </Button>
        </Box>
    );
};

export default ButtonBlock;