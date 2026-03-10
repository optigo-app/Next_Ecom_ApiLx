import { Box, Button } from "@mui/material";
import { FaHeart } from "react-icons/fa";

const ButtonBlock = ({ addToCartFlag, wishListFlag, handleCart, handleWishList }) => {
    return <>

        <Box
            sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                boxSizing: 'border-box',
                width: '100%',
            }}
        >

            {/* Cart Button */}
            <Button
                fullWidth
                variant={!addToCartFlag ? "outlined" : "contained"}
                onClick={() => handleCart(!addToCartFlag)}
                sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontSize: "0.8rem" ,
                         display:'flex',
                    alignItem:'center',
                    gap:1
                }}
            >
                {!addToCartFlag ? "Add to Cart" : "Remove from Cart"}
            </Button>

            {/* Wishlist Button */}
            <Button
                fullWidth
                variant={!wishListFlag ? "outlined" : "contained"}
                onClick={() => handleWishList(!wishListFlag)}
                sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontSize: "0.8rem",
                    display:'flex',
                    alignItem:'center',
                    gap:1
                }}
            >
              <FaHeart /> 
               {!wishListFlag ? "Add To Wislist" : "Remove from Wishlist"}
            </Button>

        </Box>


    </>
}

export default ButtonBlock;


//    <div className="btn_Section">
//                                 <button className={!addToCartFlag ? "fgstore_mapp_AddToCart_btn" : "fgstore_mapp_AddToCart_btn_afterCart"} onClick={() => handleCart(!addToCartFlag)}>
//                                     <span
//                                         className="fgstore_mapp_addtocart_btn_txt"
//                                         style={{
//                                             color: !addToCartFlag ? "" : "white",
//                                             fontSize: "1rem",
//                                         }}
//                                     >
//                                         {!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}
//                                     </span>
//                                 </button>
//                                 <button onClick={() => handleWishList(!wishListFlag)}>
//                                     <span className="fgstore_mapp_addtocart_btn_txt">{!wishListFlag ? "ADD TO Wislist" : "Remove from wishlist"}</span>
//                                     <FaHeart />
//                                 </button>

//    <div className="btn_Section">
//                                 <button className={!addToCartFlag ? "fgstore_mapp_AddToCart_btn" : "fgstore_mapp_AddToCart_btn_afterCart"} onClick={() => handleCart(!addToCartFlag)}>
//                                     <span
//                                         className="fgstore_mapp_addtocart_btn_txt"
//                                         style={{
//                                             color: !addToCartFlag ? "" : "white",
//                                             fontSize: "1rem",
//                                         }}
//                                     >
//                                         {!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}
//                                     </span>
//                                 </button>
//                                 <button onClick={() => handleWishList(!wishListFlag)}>
//                                     <span className="fgstore_mapp_addtocart_btn_txt">{!wishListFlag ? "ADD TO Wislist" : "Remove from wishlist"}</span>
//                                     <FaHeart />
//                                 </button>