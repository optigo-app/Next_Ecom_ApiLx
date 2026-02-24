import React, { useRef, useEffect } from "react";
import { Skeleton, Checkbox } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import ProductCustomization from "./ProductCustomization";

const ProductInfo = ({
    prodLoading,
    singleProd,
    singleProd1,
    selectMtType,
    selectMtColor,
    selectDiaQc,
    sizeData,
    storeInit,
    diaQcCombo,
    diaList,
    loginInfo,
    isPriceloading,
    formatter,
    addToCartFlag,
    wishListFlag,
    handleCart,
    handleWishList,
    isExpanded,
    isClamped,
    setIsClamped,
    toggleText,
    checkTextOverflow,
    metalTypeCombo,
    handleCustomChange,
    metalColorCombo,
    handleMetalWiseColorImg,
    handleMetalWiseColorImgWithFlag,
    csQcCombo,
    selectCsQc,
    csList,
    SizeCombo,
    SizeSorting,
}) => {
    const descriptionRef = useRef(null);
    const descriptionText = singleProd1?.description ?? singleProd?.description;

    useEffect(() => {
        setIsClamped(false);

        const checkOverflow = () => {
            checkTextOverflow(descriptionRef);
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [descriptionText, descriptionRef, checkTextOverflow]);

    if (prodLoading) {
        return (
            <Skeleton
                variant="rounded"
                width={"100%"}
                height={"97%"}
                sx={{ marginInline: "16%", marginTop: "3%" }}
                className="pSkelton"
            />
        );
    }

    return (
        <div className="smr_prod_shortInfo_inner">
            <p className="smr_prod_titleLine">
                {formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}
            </p>

            <div className="smr_prod_summury_info">
                <div className="smr_prod_summury_info_inner">
                    <span className="smr_single_prod_designno">
                        {singleProd?.designno}
                    </span>

                    {singleProd?.MetalTypePurity !== "" && selectMtType ? (
                        <span className="smr_prod_short_key">
                            Metal Purity :{" "}
                            <span className="smr_prod_short_val">
                                {singleProd?.IsMrpBase === 1
                                    ? singleProd?.MetalTypePurity
                                    : selectMtType}
                            </span>
                        </span>
                    ) : null}

                    <span className="smr_prod_short_key">
                        Metal Color :{" "}
                        <span className="smr_prod_short_val">
                            {JSON.parse(sessionStorage.getItem("MetalColorCombo"))
                                ?.filter((ele) => ele?.colorcode == selectMtColor)[0]
                                ?.metalcolorname}
                        </span>
                    </span>

                    {storeInit?.IsDiamondCustomization == 1 &&
                        diaQcCombo?.length > 0 &&
                        diaList?.length &&
                        singleProd?.DiaQuaCol !== "" &&
                        selectDiaQc ? (
                        <span className="smr_prod_short_key">
                            Diamond Quality Color :{" "}
                            <span className="smr_prod_short_val">
                                {singleProd?.IsMrpBase === 1
                                    ? singleProd?.DiaQuaCol
                                    : `${selectDiaQc}`}
                            </span>
                        </span>
                    ) : null}

                    {(singleProd1?.Dwt ?? singleProd?.Dwt) !== 0 ? (
                        <span className="smr_prod_short_key">
                            Dia. wt :{" "}
                            <span className="smr_prod_short_val">
                                {(singleProd1?.Dwt ?? singleProd?.Dwt)?.toFixed(3)}
                            </span>
                        </span>
                    ) : null}

                    {storeInit?.IsMetalWeight === 1 && (
                        <span className="smr_prod_short_key">
                            Net. wt :{" "}
                            <span className="smr_prod_short_val">
                                {(singleProd1?.Nwt ?? singleProd?.Nwt)?.toFixed(3)}
                            </span>
                        </span>
                    )}

                    {descriptionText?.length > 0 && (
                        <div className={`smrt_prod_description ${isExpanded ? 'smrt_show-more' : ''}`}>
                            <p className="smrt_description-text" ref={descriptionRef}>
                                {descriptionText}
                            </p>

                            {(isClamped && !isExpanded) && (
                                <span className="smrt_toggle-text" onClick={toggleText}>
                                    Show More
                                </span>
                            )}

                            {isExpanded && (
                                <span className="smrt_toggle-text" onClick={toggleText}>
                                    Show Less
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ProductCustomization
                storeInit={storeInit}
                metalTypeCombo={metalTypeCombo}
                selectMtType={selectMtType}
                singleProd={singleProd}
                singleProd1={singleProd1}
                handleCustomChange={handleCustomChange}
                metalColorCombo={metalColorCombo}
                selectMtColor={selectMtColor}
                handleMetalWiseColorImg={handleMetalWiseColorImg}
                handleMetalWiseColorImgWithFlag={handleMetalWiseColorImgWithFlag}
                diaQcCombo={diaQcCombo}
                diaList={diaList}
                selectDiaQc={selectDiaQc}
                csQcCombo={csQcCombo}
                selectCsQc={selectCsQc}
                csList={csList}
                SizeCombo={SizeCombo}
                SizeSorting={SizeSorting}
                sizeData={sizeData}
                loginInfo={loginInfo}
                formatter={formatter}
                isPriceloading={isPriceloading}
            />

            {storeInit?.IsPriceShow === 1 && (
                <div className="smr_price_portion">
                    {isPriceloading ? (
                        ""
                    ) : (
                        <span className="smr_currencyFont">
                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                        </span>
                    )}
                    &nbsp;
                    {isPriceloading ? (
                        <Skeleton
                            variant="rounded"
                            width={140}
                            height={30}
                            className="pSkelton"
                        />
                    ) : (
                        formatter.format(
                            singleProd1?.UnitCostWithMarkUp ??
                            singleProd?.UnitCostWithMarkUp
                        )
                    )}
                </div>
            )}

            {!prodLoading && (
                <div>
                    <div className="Smr_CartAndWish_portion">
                        <button
                            className={
                                !addToCartFlag
                                    ? "smr_AddToCart_btn"
                                    : "smr_AddToCart_btn_afterCart"
                            }
                            onClick={() => handleCart(!addToCartFlag)}
                        >
                            <span
                                className="smr_addtocart_btn_txt"
                                style={{
                                    color: !addToCartFlag ? "white" : "white",
                                }}
                            >
                                {!addToCartFlag
                                    ? "ADD TO CART"
                                    : "REMOVE FROM CART"}
                            </span>
                        </button>
                        <div className="Smr_wishlistcont">
                            <Checkbox
                                icon={
                                    <StarBorderIcon
                                        sx={{
                                            fontSize: "25px",
                                            color: "#fff",
                                        }}
                                    />
                                }
                                checkedIcon={
                                    <StarIcon
                                        sx={{
                                            fontSize: "25px",
                                            color: "#fff",
                                        }}
                                    />
                                }
                                disableRipple={true}
                                checked={
                                    wishListFlag ?? singleProd?.IsInWish == 1
                                        ? true
                                        : false
                                }
                                onChange={(e) => handleWishList(e, singleProd)}
                            />
                        </div>
                    </div>

                    {singleProd?.InStockDays !== 0 && (
                        <p
                            style={{
                                margin: "20px 0px 0px 0px",
                                fontWeight: 500,
                                fontSize: "18px",
                                fontFamily: "TT Commons Regular",
                                color: "#7d7f85",
                            }}
                        >
                            Express Shipping in Stock{" "}
                            {singleProd?.InStockDays} Days Delivery
                        </p>
                    )}

                    {singleProd?.MakeOrderDays != 0 && (
                        <p
                            style={{
                                margin: "0px",
                                fontWeight: 500,
                                fontSize: "18px",
                                fontFamily: "TT Commons Regular",
                                color: "#7d7f85",
                            }}
                        >
                            Make To Order {singleProd?.MakeOrderDays} Days
                            Delivery
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductInfo;