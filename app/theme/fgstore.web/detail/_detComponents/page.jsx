"use client"

import React, { useEffect } from "react";
import '@/app/theme/fgstore.web/detail/page.scss'

// Import custom hooks
import { useProductDetail } from './hooks/useProductDetail';
import { useCartWishlist } from './hooks/useCartWishlist';
import { useImageHandler } from './hooks/useImageHandler';
import { useProductCustomization } from './hooks/useProductCustomization';
import { useNavigation } from './hooks/useNavigation';

// Import components
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductSections from './components/ProductSections';

const ProductDetail = ({ params, searchParams, storeInit }) => {
    const productData = useProductDetail(searchParams, storeInit);
    const {
        singleProd,
        setSingleProd,
        singleProd1,
        setSingleProd1,
        prodLoading,
        isPriceloading,
        isDataFound,
        metalTypeCombo,
        diaQcCombo,
        csQcCombo,
        metalColorCombo,
        selectMtType,
        selectDiaQc,
        selectCsQc,
        selectMtColor,
        setSelectMtColor,
        sizeData,
        setSizeData,
        SizeCombo,
        diaList,
        csList,
        stockItemArr,
        SimilarBrandArr,
        designSetList,
        loginInfo,
        handleCustomChange
    } = productData;

    const cartWishlistData = useCartWishlist(
        singleProd,
        singleProd1,
        metalTypeCombo,
        diaQcCombo,
        csQcCombo,
        metalColorCombo,
        selectMtType,
        selectDiaQc,
        selectCsQc,
        selectMtColor,
        sizeData
    );

    const {
        addToCartFlag,
        wishListFlag,
        cartArr,
        handleCart,
        handleWishList,
        handleCartandWish,
        setWishListFlag
    } = cartWishlistData;

    const imageData = useImageHandler(
        singleProd,
        singleProd1,
        selectMtColor,
        storeInit,
        prodLoading
    );

    const {
        pdThumbImg,
        selectedThumbImg,
        thumbImgIndex,
        vison360,
        selectedMetalColor,
        filteredVideos,
        ImagePromise,
        isVisionShow,
        setSelectedThumbImg,
        setThumbImgIndex,
        setVision360,
        setImagePromise,
        setIsVisionShow,
        handleMetalWiseColorImg
    } = imageData;

    const customizationData = useProductCustomization(singleProd, singleProd1, storeInit);
    const {
        isExpanded,
        isClamped,
        setIsClamped,
        toggleText,
        SizeSorting,
        handleMetalWiseColorImgWithFlag,
        formatter,
        checkTextOverflow
    } = customizationData;

    const navigationData = useNavigation(
        setSingleProd,
        setSingleProd1,
        setImagePromise,
        setWishListFlag
    );
    const { handleMoveToDetail } = navigationData;

    // Initialize effects
    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "auto",
        });
    }, []);

    return (
        <>
            <div className="smr_prodDetail_bodyContain">
                <div className="smr_prodDetail_outerContain">
                    <div className="smr_prodDetail_whiteInnerContain">
                        {isDataFound ? (
                            <div
                                style={{
                                    height: "90vh",
                                    justifyContent: "center",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                className="smr_prodd_datanotfound"
                            >
                                Data not Found!!
                            </div>
                        ) : (
                            <>
                                <div className="smr_prod_detail_main">
                                    <div className="smr_prod_image_shortInfo">
                                        <ProductImageGallery
                                            ImagePromise={ImagePromise}
                                            isVisionShow={isVisionShow}
                                            selectedThumbImg={selectedThumbImg}
                                            vison360={vison360}
                                            pdThumbImg={pdThumbImg}
                                            filteredVideos={filteredVideos}
                                            storeInit={storeInit}
                                            setSelectedThumbImg={setSelectedThumbImg}
                                            setIsVisionShow={setIsVisionShow}
                                            setThumbImgIndex={setThumbImgIndex}
                                        />

                                        <div className="smr_prod_shortInfo">
                                            <ProductInfo
                                                prodLoading={prodLoading}
                                                singleProd={singleProd}
                                                singleProd1={singleProd1}
                                                selectMtType={selectMtType}
                                                selectMtColor={selectMtColor}
                                                selectDiaQc={selectDiaQc}
                                                sizeData={sizeData}
                                                storeInit={storeInit}
                                                diaQcCombo={diaQcCombo}
                                                diaList={diaList}
                                                loginInfo={loginInfo}
                                                isPriceloading={isPriceloading}
                                                formatter={formatter}
                                                addToCartFlag={addToCartFlag}
                                                wishListFlag={wishListFlag}
                                                handleCart={handleCart}
                                                handleWishList={handleWishList}
                                                isExpanded={isExpanded}
                                                isClamped={isClamped}
                                                setIsClamped={setIsClamped}
                                                toggleText={toggleText}
                                                checkTextOverflow={checkTextOverflow}
                                                metalTypeCombo={metalTypeCombo}
                                                handleCustomChange={handleCustomChange}
                                                metalColorCombo={metalColorCombo}
                                                handleMetalWiseColorImg={handleMetalWiseColorImg}
                                                handleMetalWiseColorImgWithFlag={(e) => handleMetalWiseColorImgWithFlag(e, setSelectMtColor)}
                                                csQcCombo={csQcCombo}
                                                selectCsQc={selectCsQc}
                                                csList={csList}
                                                SizeCombo={SizeCombo}
                                                SizeSorting={SizeSorting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <ProductSections
                                    diaList={diaList}
                                    csList={csList}
                                    stockItemArr={stockItemArr}
                                    SimilarBrandArr={SimilarBrandArr}
                                    designSetList={designSetList}
                                    storeInit={storeInit}
                                    loginInfo={loginInfo}
                                    formatter={formatter}
                                    handleCartandWish={handleCartandWish}
                                    cartArr={cartArr}
                                    handleMoveToDetail={handleMoveToDetail}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;