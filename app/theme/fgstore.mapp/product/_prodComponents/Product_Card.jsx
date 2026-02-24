import React, { useEffect, useState } from 'react'
// Image from public folder
import { findMetalColor, formatter, formatTitleLine, findMetalType, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import {
    Card, CardMedia, Checkbox, Skeleton
} from "@mui/material";
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

const Product_Card = ({
    productData,
    isshowDots,
    menuParams,
    handleCartandWish,
    cartArr,
    wishArr,
    metalColorType,
    maxwidth590px,
    loginUserDetail,
    handleMoveToDetail,
    selectedMetalId,
    productIndex,
    yellowImage,
    whiteImage,
    roseImage,
    yellowRollImage,
    whiteRollImage,
    roseRollImage,
    imageUrl,
    videoUrl,
    RollImageUrl,
    location,
    metalColorCombo,
    storeInit
}) => {
    const [imageColor, setImageColor] = useState("");
    const getSessImgColor = JSON.parse(sessionStorage.getItem('imgColorCode'));
    const [selectedMetalColor, setSelectedMetalColor] = useState(null);
    const [metalColorTitle, setMetalColorTitle] = useState();
    const getSessCartWishImgColor = JSON?.parse(sessionStorage.getItem('cartWishImgColor')) ?? undefined;

    const activeColorCode = getSessImgColor || getSessCartWishImgColor;

    useEffect(() => {
        if (metalColorCombo?.length > 0) {
            const mtColor = metalColorCombo?.find(ele => ele.id === productData?.MetalColorid)?.colorcode;
            setMetalColorTitle(mtColor);
        }
    }, [productData])

    useEffect(() => {
        if ((activeColorCode !== "" && activeColorCode !== undefined && activeColorCode !== null)) {
            setImageColor("");
            sessionStorage.removeItem("imgColorCode");
            sessionStorage.removeItem("cartWishImgColor");
            setSelectedMetalColor(null);
        }
    }, [location?.search])

    useEffect(() => {
        if (selectedMetalColor !== null) {
            setImageColor(selectedMetalColor);
            sessionStorage.setItem("imgColorCode", JSON.stringify(selectedMetalColor));
        } else {
            sessionStorage.removeItem("imgColorCode");
            setImageColor("");
        }
    }, [selectedMetalColor])

    const handleClick = (id) => {
        setSelectedMetalColor(selectedMetalColor === id ? null : id);
    };

    const titleLine = `${productData?.MetalTypePurity?.split(" ")[1]} ${metalColorTitle} ${productData?.MetalTypePurity?.split(" ")[0]} ${productData?.ShapeName} Diamond ${productData?.category} with ${productData?.style} style`;

    const [isLoading, setIsLoading] = useState(true);
    const [isHover, setIsHover] = useState(false);
    const hasNoData = productData?.IsInReadyStock !== 1 && productData?.IsBestSeller !== 1 && productData?.IsTrending !== 1 && productData?.IsNewArrival !== 1;

    useEffect(() => {
        const delay = (productIndex + 1) * 100;

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [productIndex]);

    return (
        <>
            {!isshowDots &&
                productIndex === 6 && (
                    <>
                        {menuParams?.menuname === "Glossy" && (
                            <div className="smr_productCard_banner">
                                <img src={`${storImagePath()}/images/HomePage/ProductListing/5.png`} loading="lazy" alt=""
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        )}
                        {menuParams?.menuname === "Amber" && (
                            <div className="smr_productCard_banner">
                                <video
                                    src={`${storImagePath()}/images/HomePage/ProductListing/staticv1.mp4`}
                                    autoPlay
                                    muted
                                    controls={false}
                                    loop
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                </video>
                            </div>
                        )}
                        {menuParams?.menuname === "Ruby" && (
                            <div className="smr_productCard_banner">
                                <video
                                    src={`${storImagePath()}/images/HomePage/ProductListing/staticv2(1).mp4`}
                                    autoPlay
                                    muted
                                    controls={false}
                                    loop
                                    draggable={true}
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                </video>
                            </div>
                        )}
                    </>
                )
            }
            {!isshowDots && productIndex === 14 && (
                <>
                    {menuParams?.menuname === "Glossy" && (
                        <div className="smr_productCard_banner">
                            <img
                                src={`${storImagePath()}/images/HomePage/ProductListing/static4.jpg`}
                                alt="Banner 2"
                                loading="lazy"
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    )}
                    {menuParams?.menuname === "Amber" && (
                        <div className="smr_productCard_banner">
                            <video
                                src={`${storImagePath()}/images/HomePage/ProductListing/staticv1(1).mp4`}
                                autoPlay
                                muted
                                controls={false}
                                loop
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    )}
                    {menuParams?.menuname === "Ruby" && (
                        <div className="smr_productCard_banner">
                            <video
                                src={`${storImagePath()}/images/HomePage/ProductListing/staticv2.mp4`}
                                autoPlay
                                muted
                                controls={false}
                                loop
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    )}
                </>
            )}
            <div className="smr_productCard">
                <div className="cart_and_wishlist_icon">
                    <Checkbox
                        icon={
                            <LocalMallOutlinedIcon
                                sx={{
                                    fontSize: "22px",
                                    color: "#7d7f85",
                                    opacity: ".7",
                                }}
                            />
                        }
                        checkedIcon={
                            <LocalMallIcon
                                sx={{
                                    fontSize: "22px",
                                    color: "#009500",
                                }}
                            />
                        }
                        disableRipple={false}
                        sx={{ padding: "10px" }}
                        onChange={(e) =>
                            handleCartandWish(e, productData, "Cart")
                        }
                        checked={
                            cartArr[productData?.autocode] ??
                                productData?.IsInCart === 1
                                ? true
                                : false
                        }
                    />
                    <Checkbox
                        icon={
                            <StarBorderIcon
                                sx={{
                                    fontSize: "22px",
                                    color: "#7d7f85",
                                    opacity: ".7",
                                }}
                            />
                        }
                        checkedIcon={
                            <StarIcon
                                sx={{
                                    fontSize: "22px",
                                    color: "#ffd200",
                                }}
                            />
                        }
                        disableRipple={false}
                        sx={{ padding: "10px" }}
                        onChange={(e) =>
                            handleCartandWish(e, productData, "Wish")
                        }
                        checked={
                            wishArr[productData?.autocode] ??
                                productData?.IsInWish === 1
                                ? true
                                : false
                        }
                    />
                </div>
                <div className="smrWeb_app_product_label">
                    {productData?.IsInReadyStock == 1 && <span className="smrWeb_app_instock">In Stock</span>}
                    {productData?.IsBestSeller == 1 && <span className="smrWeb_app_bestSeller">Best Seller</span>}
                    {productData?.IsTrending == 1 && <span className="smrWeb_app_intrending">Trending</span>}
                    {productData?.IsNewArrival == 1 && <span className="smrWeb_app_newarrival">New</span>}
                </div>

                <div
                    onMouseMove={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    className="smr_ImgandVideoContainer"
                    onClick={() => handleMoveToDetail(productData)}
                >
                    {isLoading === true ?
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <CardMedia
                                sx={{
                                    flex: 1,
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <Skeleton
                                    animation="wave"
                                    variant="rectangular"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#e7e7e7',
                                    }}
                                />
                            </CardMedia>
                        </Card>
                        :
                        <>

                            <div style={{ display: isHover ? "block" : "none" }}>
                                {videoUrl !== undefined ? (
                                    <video
                                        className="smr_productCard_video"
                                        src={videoUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        onError={(e) => {
                                            e.target.poster = '/image-not-found.jpg';
                                        }}
                                    />
                                ) : (videoUrl === undefined && RollImageUrl !== undefined) ? (
                                    <img
                                        className="smr_productListCard_Image"
                                        src={
                                            selectedMetalColor === 1
                                                ? yellowRollImage
                                                : selectedMetalColor === 2
                                                    ? whiteRollImage
                                                    : selectedMetalColor === 3
                                                        ? roseRollImage
                                                        : RollImageUrl
                                        }
                                        onError={(e) => {
                                            if (productData?.ImageCount > 0) {
                                                e.target.src = RollImageUrl;
                                            }
                                            e.target.src = '/image-not-found.jpg';
                                        }}
                                        draggable={true}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                ) : null}
                            </div>
                            <img
                                className="smr_productListCard_Image"
                                src={selectedMetalColor === 1 ? yellowImage : selectedMetalColor === 2 ? whiteImage : selectedMetalColor === 3 ? roseImage : imageUrl}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.stopPropagation();
                                    e.target.src = '/image-not-found.jpg';
                                }}
                                draggable={true}
                                onContextMenu={(e) => e.preventDefault()}
                                style={{
                                    opacity: isHover && (RollImageUrl || videoUrl) ? "0" : "1",
                                    transition: '0s ease-in-out',
                                }}
                            />
                        </>
                    }
                </div>
                <div className="smr_prod_card_info" style={{ height: !isshowDots ? "106px" : "90px" }}>
                    <div className="smr_prodCard_1"
                    >
                        {!isshowDots &&
                            <div className="smr_productList_metaltype_Maindiv">
                                <div className="smr_productList_metaltype_div"
                                >
                                    {metalColorType?.map((item) => (
                                        <button
                                            className={selectedMetalColor === item?.id ? `smr_metaltype_${item?.metal}_clicked` : `smr_metaltype_${item?.metal}`}
                                            key={item?.id}
                                            type="button"
                                            disabled={yellowImage === undefined}
                                            onClick={() => handleClick(item?.id)}
                                        >
                                            {""}
                                        </button>
                                    ))}
                                </div>
                            </div>}
                        <div className="smr_prod_Title">
                            <span
                                className={
                                    (productData?.TitleLine?.length > 30)
                                        ?
                                        "smr1_prod_title_with_width"
                                        :
                                        "smr1_prod_title_with_no_width"
                                }
                            >
                                <strong style={{ color: "black" }}>{productData?.designno !== "" && productData?.designno}</strong>
                                {formatTitleLine(productData?.TitleLine) && " - " + productData?.TitleLine}
                            </span>
                        </div>
                        <div className="smr_prod_Allwt">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    lineHeight: "12px",
                                    gap: "2px",
                                    alignItems: "center",
                                    letterSpacing: maxwidth590px
                                        ? "0px"
                                        : "1px",
                                    flexWrap: "wrap",
                                }}
                            >
                                {storeInit?.IsGrossWeight == 1 &&
                                    Number(productData?.Gwt) !== 0 && (
                                        <span className="smr_prod_wt">
                                            <span className="smr_main_keys">
                                                GWT:
                                            </span>
                                            <span className="smr_main_val">
                                                {(productData?.Gwt)?.toFixed(3)}
                                            </span>
                                        </span>
                                    )}
                                {Number(productData?.Nwt) !== 0 && (
                                    <>
                                        <span style={{ fontSize: '13px' }}>|</span>
                                        <span className="smr_prod_wt">
                                            <span className="smr_main_keys">NWT:</span>
                                            <span className="smr_main_val">
                                                {(productData?.Nwt)?.toFixed(3)}
                                            </span>
                                        </span>
                                    </>
                                )}
                                {storeInit?.IsDiamondWeight == 1 &&
                                    Number(productData?.Dwt) !== 0 && (
                                        <>
                                            <span style={{ fontSize: '13px' }}>|</span>
                                            <span className="smr_prod_wt">
                                                <span className="smr_main_keys">
                                                    DWT:
                                                </span>
                                                <span className="smr_main_val">
                                                    {(productData?.Dwt)?.toFixed(3)}
                                                    {storeInit?.IsDiamondPcs === 1
                                                        ? `/${productData?.Dpcs}`
                                                        : null}
                                                </span>
                                            </span>
                                        </>
                                    )}
                                {storeInit?.IsStoneWeight == 1 &&
                                    Number(productData?.CSwt) !== 0 && (
                                        <>
                                            <span style={{ fontSize: '13px' }}>|</span>
                                            <span className="smr_prod_wt">
                                                <span className="smr_main_keys">
                                                    CWT:
                                                </span>
                                                <span className="smr_main_val">
                                                    {(productData?.CSwt)?.toFixed(3)}
                                                    {storeInit?.IsStonePcs === 1
                                                        ? `/${productData?.CSpcs}`
                                                        : null}
                                                </span>
                                            </span>
                                        </>
                                    )}
                            </div>
                        </div>
                        <div className="smr_prod_mtcolr_price">
                            <span className="smr_prod_metal_col">
                                {findMetalColor(
                                    productData?.MetalColorid
                                )?.[0]?.metalcolorname.toUpperCase()}
                                -
                                {
                                    findMetalType(
                                        productData?.IsMrpBase == 1 ? productData?.MetalPurityid : (selectedMetalId ?? productData?.MetalPurityid)
                                    )[0]?.metaltype
                                }
                            </span>
                            {storeInit?.IsPriceShow == 1 && <>
                                <span>/</span>
                                <span className="smr_price">
                                    <span className="smr_currencyFont">
                                        {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}
                                    </span>
                                    <span className="smr_pricePort">
                                        {formatter(
                                            productData?.UnitCostWithMarkUp
                                        )}
                                    </span>
                                </span></>}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Product_Card;

