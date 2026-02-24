import { useState, useEffect } from "react";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Cookies from "js-cookie";

export const useCartWishlist = (singleProd, singleProd1, metalTypeCombo, diaQcCombo, csQcCombo, metalColorCombo, selectMtType, selectDiaQc, selectCsQc, selectMtColor, sizeData) => {
    const { setCartCountNum, setWishCountNum } = useStore();
    const [addToCartFlag, setAddToCartFlag] = useState(null);
    const [wishListFlag, setWishListFlag] = useState(null);
    const [cartArr, setCartArr] = useState({});
    
    const cookie = Cookies.get("visiterId");

    // Update cart flag when product changes
    useEffect(() => {
        let isincart = singleProd?.IsInCart == 0 ? false : true;
        setAddToCartFlag(isincart);
    }, [singleProd]);

    // Create product object for cart/wishlist operations
    const createProductObject = () => {
        let storeinitInside = JSON.parse(sessionStorage.getItem("storeInit"));
        let logininfoInside = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let metal = metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType);
        let dia = diaQcCombo?.filter(
            (ele) =>
                ele?.Quality == selectDiaQc?.split(",")[0] &&
                ele?.color == selectDiaQc?.split(",")[1]
        );
        let cs = csQcCombo?.filter(
            (ele) =>
                ele?.Quality == selectCsQc?.split(",")[0] &&
                ele?.color == selectCsQc?.split(",")[1]
        );

        let mcArr = metalColorCombo?.filter((ele) => {
            if (selectMtColor) {
                return ele?.colorcode == selectMtColor;
            } else {
                return ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid);
            }
        })[0];

        return {
            autocode: singleProd?.autocode,
            Metalid: metal?.length
                ? metal[0]?.Metalid
                : logininfoInside?.MetalId ?? storeinitInside?.MetalId,
            MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
            DiaQCid: dia?.length
                ? `${dia[0]?.QualityId},${dia[0]?.ColorId}`
                : logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid,
            CsQCid: cs?.length
                ? `${cs[0]?.QualityId},${cs[0]?.ColorId}`
                : logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid,
            Size: sizeData ?? singleProd?.DefaultSize,
            Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
            markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
            UnitCostWithmarkup: singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
            Remark: "",
        };
    };

    // Handle cart operations
    const handleCart = (cartflag) => {
        const prodObj = createProductObject();

        if (cartflag) {
            CartAndWishListAPI("Cart", prodObj, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setAddToCartFlag(cartflag);
                });
        } else {
            RemoveCartAndWishAPI("Cart", singleProd?.autocode, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setAddToCartFlag(cartflag);
                });
        }
    };

    // Handle wishlist operations
    const handleWishList = (e, ele) => {
        setWishListFlag(e?.target?.checked);
        const prodObj = createProductObject();

        if (e?.target?.checked == true) {
            CartAndWishListAPI("Wish", prodObj, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err));
        } else {
            RemoveCartAndWishAPI("Wish", singleProd?.autocode, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err));
        }
    };

    // Handle cart/wishlist for stock items
    const handleCartandWish = (e, ele, type) => {
        let prodObj = {
            StockId: ele?.StockId,
            Unitcost: ele?.Amount,
        };

        if (e.target.checked == true) {
            CartAndWishListAPI(type, prodObj, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err));
        } else {
            RemoveCartAndWishAPI(type, ele?.StockId, cookie, true)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err));
        }

        if (type === "Cart") {
            setCartArr((prev) => ({
                ...prev,
                [ele?.StockId]: e.target.checked,
            }));
        }
    };

    return {
        addToCartFlag,
        wishListFlag,
        cartArr,
        handleCart,
        handleWishList,
        handleCartandWish,
        setWishListFlag
    };
};