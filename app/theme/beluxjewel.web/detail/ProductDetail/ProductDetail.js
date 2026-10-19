"use client";
import React from "react";
import "./ProductDetail.modul.scss";
import { Box, Grid } from "@mui/material";
import RelatedProduct from "./RelatedProduct/RelatedProduct";
import RecentlyViewed from "./RecentlyViewed/RecentlyViewed";
import NewStockitem from "./InstockProduct/NewStockitem";
import LeftSide from "./New/LeftSide";
import RightSide from "./New/RightSide";
import PreviewDialog from "./New/PreviewDialog";
import ExtraProductSections from "./New/ExtraProductSections";
import DetailPageSkeleton from "../DetailPageSkeleton";
import DetailBreadcrumb from "./New/DetailBreadcrumb";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useProductDetail } from "@/app/(core)/hooks/useProductDetail";

const ProductDetail = ({ storeinit, searchParams, params }) => {
  const pd = useProductDetail({ storeinit, searchParams, params });

  const {
    decodeUrl,
    storeInit,
    loginData,
    sizeData,
    singleProd,
    singleProd1,
    diaList,
    csList,
    SizeCombo,
    metalTypeCombo,
    metalType,
    metalColor,
    selectDiaQc,
    diaQcCombo,
    csQcCombo,
    selectCsQC,
    metalColorCombo,
    isPriceloading,
    filteredVideos,
    addToCardFlag,
    wishListFlag,
    isCartBtnLoading,
    isWishBtnLoading,
    isDataFound,
    pdLoadImage,
    derivedIsMediaReady,
    derivedMediaBuildDone,
    getImagesArr,
    rd1Data,
    rd2Data,
    customizationDetail,
    rd1CartMap,
    isImageDialogOpen,
    SelectedImageIndex,
    loadingdata,
    SimilarBrandArr,
    recentlyViewedArr,
    stockItemArr,
    cartArr,
    productSchema,
    defaultArticleId,
    handleCart,
    handleWishList,
    handleCustomChange,
    handleCustomizerConfirm,
    handleMetalWiseColorImg,
    handleMetalWiseColorImgWithFlag,
    HandleImageDialogOpen,
    HandleImageDialogClose,
    handleMoveToDetail,
    handleCartandWish,
    SizeSorting,
    storeCartArr,
    storeWishArr,
  } = pd;

  if (loadingdata && !(decodeUrl?.b || decodeUrl?.title || decodeUrl?.a || decodeUrl?.img)) {
    return <DetailPageSkeleton />;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {!isDataFound ? (
        <Box
          sx={{
            color: "#000",
            pb: 6,
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              pt: { xs: 2, md: 4 },
              px: { sm: 2, xs: 1, md: 8 },
              width: "100%",
            }}
          >
            <DetailBreadcrumb
              searchParams={searchParams}
              singleProd={singleProd}
              singleProd1={singleProd1}
              loadingdata={loadingdata}
            />
            <Grid container spacing={{ xs: 1, md: 1 }}>
              <LeftSide
                loading={loadingdata}
                media={
                  ([
                    ...getImagesArr?.map((item) => ({
                      type: "image",
                      src: item,
                    })),
                    ...filteredVideos?.map((item) => ({
                      type: "video",
                      src: item,
                    })),
                  ] || []).filter((item) => item.src && !item.src.includes("undefined"))
                }
                isMediaReady={derivedIsMediaReady}
                mediaBuildDone={derivedMediaBuildDone}
                HandleImageDialogOpen={HandleImageDialogOpen}
              />
              <RightSide
                TitleLine={
                  formatTitleLine(singleProd?.TitleLine) &&
                  singleProd?.TitleLine
                }
                DesignNo={singleProd?.designno}
                collection={(singleProd ?? singleProd1)?.collection}
                description={
                  singleProd1?.description ?? singleProd?.description
                }
                singleProd={singleProd}
                singleProd1={singleProd1}
                metalType={metalType}
                metalColor={metalColor}
                storeInit={storeInit}
                diaQcCombo={diaQcCombo}
                diaList={diaList}
                selectDiaQc={selectDiaQc}
                SizeSorting={SizeSorting(SizeCombo?.rd)}
                handleCustomChange={handleCustomChange}
                SizeCombo={SizeCombo}
                sizeData={sizeData}
                metalTypeCombo={metalTypeCombo}
                metalColorCombo={metalColorCombo}
                handleMetalWiseColorImg={handleMetalWiseColorImg}
                handleMetalWiseColorImgWithFlag={
                  handleMetalWiseColorImgWithFlag
                }
                selectCsQC={selectCsQC}
                csList={csList}
                csQcCombo={csQcCombo}
                loginData={loginData}
                loadingdata={loadingdata}
                isPriceloading={isPriceloading}
                pdLoadImage={pdLoadImage}
                handleCart={handleCart}
                addToCardFlag={addToCardFlag}
                isCartBtnLoading={isCartBtnLoading}
                handleWishList={handleWishList}
                wishListFlag={wishListFlag}
                isWishBtnLoading={isWishBtnLoading}
                stockItemArr={stockItemArr}
                rd1={rd1Data}
                rd2={rd2Data}
                defaultArticleId={defaultArticleId}
                customizationDetail={customizationDetail}
                rd1CartMap={rd1CartMap}
                storeCartArr={storeCartArr}
                storeWishArr={storeWishArr}
                onCustomizerConfirm={handleCustomizerConfirm}
              />
            </Grid>
            <ExtraProductSections
              imgSrc={getImagesArr?.[0] || getImagesArr?.[1]}
              singleProd={singleProd}
              singleProd1={singleProd1}
              stockItemArr={stockItemArr}
            />

            {stockItemArr?.length > 0 &&
              stockItemArr?.[0]?.stat_code != 1005 &&
              storeInit?.IsStockWebsite === 1 && (
                <NewStockitem
                  stockItemArr={stockItemArr}
                  storeInit={storeInit}
                  loginInfo={loginData}
                  cartArr={cartArr}
                  check={storeInit?.IsPriceShow === 1}
                  handleCartandWish={handleCartandWish}
                />
              )}

            {storeInit?.IsProductDetailSimilarDesign == 1 &&
              SimilarBrandArr?.length > 0 &&
              SimilarBrandArr?.[0]?.stat_code != 1005 && (
                <RelatedProduct
                  SimilarBrandArr={SimilarBrandArr}
                  handleMoveToDetail={handleMoveToDetail}
                  storeInit={storeInit}
                  loginInfo={loginData}
                />
              )}

            {/* Customer-Wise SQLite Recently Viewed Designs */}
            {recentlyViewedArr?.length > 0 && (
              <RecentlyViewed
                recentlyViewedArr={recentlyViewedArr}
                handleMoveToDetail={handleMoveToDetail}
                storeInit={storeInit}
                loginInfo={loginData}
              />
            )}
          </Box>
          <PreviewDialog
            media={[
              ...getImagesArr?.map((item) => ({
                type: "image",
                src: item,
              })),
              ...filteredVideos?.map((item) => ({
                type: "video",
                src: item,
              })),
            ]}
            onClose={HandleImageDialogClose}
            open={isImageDialogOpen}
            selectedIndex={SelectedImageIndex}
          />
        </Box>
      ) : (
        <div
          style={{
            height: "90vh",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
          className="elv_prodd_datanotfound"
        >
          Data not Found!!
        </div>
      )}
    </>
  );
};

export default ProductDetail;
