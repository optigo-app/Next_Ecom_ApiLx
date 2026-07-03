import React, { useEffect, useState } from 'react';
import "./dt_wishPageB2c.scss"
 
import { useSyncStore } from '@/app/(core)/hooks/useStore';
import Cookies from "js-cookie";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { CardMedia, Skeleton } from '@mui/material';

const WishItem = ({
    item,
    itemInCart,
    updateCount,
    countDataUpdted,
    itemsLength,
    currency,
    decodeEntities,
    WishCardImageFunc,
    handleRemoveItem,
    handleWishlistToCart,
    handleMoveToDetail
}) => {
    const [loding, setloding] = useState(false);
    const [imageSrc, setImageSrc] = useState();
    const [storeInitData, setStoreInitData] = useState();
    const {
      setCartCount,
      setWishlistCount,
      setSyncData,
      resetAll
  } = useSyncStore();
    const visiterId = Cookies.get('visiterId');
    const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

    useEffect(() => {
        const storeinitData = JSON.parse(sessionStorage.getItem('storeInit'));
        setStoreInitData(storeinitData)
    }, [])

    const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;
    const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;

    const isLoading = item?.loading;

    const handleWishlistToCartFun = async (item) => {
        setloding(true);
        const returnValue = await handleWishlistToCart(item);
        if (returnValue?.msg == "success") {
            GetCountAPI(visiterId).then((res) => {
                toast.success("Wishlist item added in cart")
                setCartCount(res?.cartcount);
                setloding(false);
            });
        }
    };

    const handleRemoveitem = async (item) => {
        const returnValue = await handleRemoveItem(item);
        if (returnValue?.msg == "success") {
            GetCountAPI(visiterId).then((res) => {
                setWishlistCount(res?.wishcount);
            })
        }
    };

 

    return (
        <tr>
            <td className="product" onClick={() => handleMoveToDetail(item)}>

                {isLoading === true ? (
                    <CardMedia
                        style={{ width: "100%" }}
                        className="roop_WlListImage"
                    >
                        <Skeleton
                            animation="wave"
                            variant="rect"
                            width="60%"
                            height={150}
                            sx={{
                                backgroundColor: "#e8e8e86e",
                            }}
                        />
                    </CardMedia>
                ) : (
                    <img
                        src={item?.images}
                        alt=" "
                        style={{
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            '&:focus': { outline: 'none' },
                            '&:active': { outline: 'none' },
                        }}
                        onError={(e) => {
                            if (item?.ImageCount > 0) {
                                e.target.src = fullImagePath ? fullImagePath : "/image-not-found.jpg"
                            } else {
                                e.target.src = "/image-not-found.jpg";
                            }
                        }}
                    />
                )}
                <div className="product-details">
                    <p>{formatTitleLine(item?.TitleLine) && item?.TitleLine}</p>
                </div>
            </td>
            <td className="price">
                {storeInitData?.IsPriceShow == 1 &&
                    <span>
                        <span
                            className="smr_currencyFont"
                        >
                            {loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}
                        </span>
                        {" "}{formatter(item?.UnitCostWithMarkUp)}
                    </span>
                }
            </td>
            <td className="total">
                <div className='dt_Wl-CartbtnDiv'>
                    <button disabled={loding == true} className='dt_Wl-Cartbtn' onClick={() => handleWishlistToCartFun(item)}>
                        {(item?.IsInCart != 1 ? "Add to cart +" : "In cart")}
                    </button>

                </div>
            </td>
            <td className="remove">
                <IconButton onClick={() => handleRemoveitem(item)}>
                    <CloseIcon />
                </IconButton>
            </td>
        </tr>
    );
};

export default WishItem;
