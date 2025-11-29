import React, { useEffect, useState } from 'react'
// Image from public folder
import { findMetalColor, formatTitleLine, findMetalType } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import {
    Checkbox, Skeleton
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const Product_Card = ({
    img,
    index,
    title,
    videoUrl,
    rollUpImage,
    designo,
    productData,
    storeInit,
    decodeEntities,
    selectedMetalId,
    handleMoveToDetail,
    handleCartandWish,
    cartArr,
    productIndex,
    wishArr,
    CurrencyCode,
    CurrencyCode2,
    StoryLineProductList
}) => {
    const [isHover, setisHover] = useState(false);
    const [isPlusClicked, SetisPlusClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [resetKey, setResetKey] = useState(0); // A key to reset the story component
    const selectedProduct = StoryLineProductList && StoryLineProductList?.find(product => product?.designo == designo);

    const handleMouseEnter = () => {
        setResetKey(prevKey => prevKey + 1);
    };

    // Add staggered loading effect
    useEffect(() => {
        const delay = (productIndex + 1) * 150;

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [productIndex]);
    return (
        <div className="C_Card" onMouseLeave={() => SetisPlusClicked(false)}>
            {isLoading ? (
                <Skeleton
                    sx={{
                        width: '100%',
                        height: {
                            xs: '200px !important',
                            sm: '300px !important',
                            md: '500px !important',
                        },
                        display: 'block',
                    }}
                    key={productIndex}
                    variant="rectangular"
                    width={"100%"}
                    height={"100%"}
                    className="hoq_CartSkelton_1"
                />
            ) : (
                <>
                    <div className="hoq_product_label">
                        {productData?.IsInReadyStock == 1 && (
                            <span className="hoq_instock">In Stock</span>
                        )}
                        {productData?.IsBestSeller == 1 && (
                            <span className="hoq_bestSeller">Best Seller</span>
                        )}
                        {productData?.IsTrending == 1 && (
                            <span className="hoq_intrending">Trending</span>
                        )}
                        {productData?.IsNewArrival == 1 && (
                            <span className="hoq_newarrival">New</span>
                        )}
                    </div>
                    <div className="hoq_plus">
                        <Checkbox
                            icon={
                                <LocalMallOutlinedIcon
                                    sx={{
                                        fontSize: "26px",
                                        color: "#7d7f85",
                                        opacity: ".7",
                                    }}
                                />
                            }
                            checkedIcon={
                                <LocalMallIcon
                                    sx={{
                                        fontSize: "26px",
                                        color: "#009500",
                                    }}
                                />
                            }
                            disableRipple={false}
                            sx={{ padding: "10px" }}
                            onChange={(e) => handleCartandWish(e, productData, "Cart")}
                            checked={
                                cartArr[productData?.autocode] ?? productData?.IsInCart === 1
                                    ? true
                                    : false
                            }
                        />
                        <Checkbox
                            icon={
                                <FavoriteBorderIcon
                                    sx={{
                                        fontSize: "26px",
                                        color: "#7d7f85",
                                        opacity: ".7",
                                    }}
                                />
                            }
                            checkedIcon={
                                <FavoriteIcon
                                    sx={{
                                        fontSize: "26px",
                                        color: "#e31b23",
                                    }}
                                />
                            }
                            disableRipple={false}
                            sx={{ padding: "10px" }}
                            onChange={(e) => handleCartandWish(e, productData, "Wish")}
                            // checked={productData?.IsInWish}
                            checked={
                                wishArr[productData?.autocode] ?? productData?.IsInWish === 1
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div
                        onClick={() => handleMoveToDetail(productData)}
                        className="image"
                        style={{ border: "none" }}
                        onMouseOver={() => setisHover(true)}
                        onMouseOut={() => setisHover(false)}
                        onMouseEnter={handleMouseEnter}
                    >
                        {selectedProduct && <StoryLine storeInit={storeInit} resetKey={resetKey} selectedProduct={selectedProduct} />}
                        {/* {isHover && (videoUrl || rollUpImage) ? (
            <>
              {videoUrl ? (
                <div className="rollup_video">
                  <video
                    src={videoUrl}
                    autoPlay
                    muted
                    loop
                    onError={(e) => (e.target.poster = "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg")}
                  />
                </div>
              ) : null}

              {!videoUrl && rollUpImage ? (
                <div className="rollup_img">
                  <img
                    src={rollUpImage}
                    alt="Roll Up Image"
                    onError={(e) => (e.target.src = "https://www.defindia.org/wp-content/themes/dt-the7/images/noimage.jpg")}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <img
              src={img}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imagnotfound;
              }}
            />
          )} */}
                        <img
                            src={img}
                            alt=""
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = imagnotfound;
                            }}
                            loading="lazy"
                        />
                    </div>

                    <div className="det">
                        <h2 className="">
                            {/* {!title?.length > 0 ? designo : designo + "-" + title} */}
                            {designo !== "" && designo}
                            {formatTitleLine(title) && " - " + title}
                        </h2>
                        <small className="jewel_parameter">
                            {storeInit?.IsGrossWeight == 1 && Number(productData?.Gwt) !== 0 && (
                                <>
                                    <span className="smr_prod_wt">
                                        <span className="smr_keys">GWT:</span>
                                        <span className="smr_val">{productData?.Gwt?.toFixed(3)}</span>
                                    </span>
                                </>
                            )}
                            {storeInit?.IsMetalWeight == 1 && Number(productData?.Nwt) !== 0 && (
                                <>
                                    {storeInit?.IsGrossWeight == 1 && Number(productData?.Gwt) !== 0 && <span>|</span>}
                                    <span className="smr_prod_wt">
                                        <span className="smr_keys">NWT:</span>
                                        <span className="smr_val">{productData?.Nwt?.toFixed(3)} </span>
                                    </span>
                                </>
                            )}

                            {/* </span> */}
                            {/* <span className="smr_por"> */}
                            {storeInit?.IsDiamondWeight == 1 &&
                                Number(productData?.Dwt) !== 0 && (
                                    <>
                                        {storeInit?.IsMetalWeight == 1 && Number(productData?.Nwt) !== 0 && <span>|</span>}
                                        <span className="smr_prod_wt">
                                            <span className="smr_keys">DWT:</span>
                                            <span className="smr_val">
                                                {productData?.Dwt?.toFixed(3)}
                                                {storeInit?.IsDiamondPcs === 1
                                                    ? `/${productData?.Dpcs?.toFixed(0)}`
                                                    : null}
                                            </span>
                                        </span>
                                    </>
                                )}
                            {storeInit?.IsStoneWeight == 1 && Number(productData?.CSwt) !== 0 && (
                                <>
                                    {storeInit?.IsDiamondWeight == 1 &&
                                        Number(productData?.Dwt) !== 0 && <span>|</span>}
                                    <span className="smr_prod_wt">
                                        <span className="smr_keys">CWT:</span>
                                        <span className="smr_val">
                                            {productData?.CSwt?.toFixed(3)}
                                            {storeInit?.IsStonePcs === 1
                                                ? `/${productData?.CSpcs?.toFixed(0)}`
                                                : null}
                                        </span>
                                    </span>
                                </>
                            )}
                            {/* </span> */}
                        </small>
                        <div className="hoq_prod_mtcolr_price">
                            {
                                <span className="hoq_prod_metal_col">
                                    {findMetalColor(
                                        productData?.MetalColorid
                                    )?.[0]?.metalcolorname?.toUpperCase()}
                                    {findMetalColor(
                                        productData?.MetalColorid
                                    )?.[0]?.metalcolorname && "-"}
                                    {
                                        findMetalType(
                                            productData?.IsMrpBase == 1
                                                ? productData?.MetalPurityid
                                                : selectedMetalId ?? productData?.MetalPurityid
                                        )[0]?.metaltype
                                    }
                                </span>
                            }
                            {storeInit?.IsPriceShow === 1 && (
                                <>
                                    <span> / </span>
                                    <span className="hoq_price">
                                        <span
                                            className="hoq_currencyFont"
                                            style={{ paddingRight: "0.1rem" }}
                                            dangerouslySetInnerHTML={{
                                                __html: decodeEntities(CurrencyCode ?? CurrencyCode2),
                                            }}
                                        />
                                        <span className="hoq_pricePort">
                                            {productData?.UnitCostWithMarkUp?.toLocaleString("en-IN")}
                                        </span>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Product_Card;

