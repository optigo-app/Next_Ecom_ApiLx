"use client";
import React from "react";
import "./ProductDetail.modul.scss";
import { Box, Grid } from "@mui/material";
import RelatedProduct from "./RelatedProduct/RelatedProduct";
import NewStockitem from "./InstockProduct/NewStockitem";
import LeftSide from "./New/LeftSide";
import RightSide from "./New/RightSide";
import PreviewDialog from "./New/PreviewDialog";
import ProductDetailsSection from "./New/ProductDetailsSection";
import ExtraProductSections from "./New/ExtraProductSections";
import DetailPageSkeleton from "../DetailPageSkeleton";
import DetailBreadcrumb from "./New/DetailBreadcrumb";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useProductDetail } from "@/app/(core)/hooks/useProductDetail";

const ProductDetail = ({ storeinit, searchParams, params }) => {
  const pd = useProductDetail({ storeinit, searchParams, params });

  const {
    initialDecodeUrl,
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
    selectedThumbImg,
    pdThumbImg,
    pdVideoArr,
    filteredVideos,
    addToCardFlag,
    wishListFlag,
    isDataFound,
    pdLoadImage,
    selectedMetalColor,
    isMediaReady,
    mediaBuildDone,
    rd1Data,
    rd2Data,
    customizationDetail,
    rd1CartMap,
    isImageDialogOpen,
    setIsImageDialogOpen,
    SelectedImageIndex,
    setSelectedImageIndex,
    loadingdata,
    SimilarBrandArr,
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
    cookie,
    Navigate,
  } = pd;

  const rawPassedImg = initialDecodeUrl?.img || decodeUrl?.img;

  const mtColorLocalForFallback = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("MetalColorCombo") || "[]") : [];
  const loginInfoForFallback = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("loginUserDetail") || "{}") : {};
  const urlMetalColorId = initialDecodeUrl?.metalColorId || decodeUrl?.metalColorId || initialDecodeUrl?.m || decodeUrl?.m;
  const fallbackColorId = singleProd?.MetalColorid || urlMetalColorId || loginData?.MetalColorId || loginInfoForFallback?.MetalColorId || mtColorLocalForFallback?.[0]?.id;
  const fallbackColorObj = mtColorLocalForFallback.find(ele => Number(ele.id) === Number(fallbackColorId));
  const activeColorCode = selectedMetalColor || fallbackColorObj?.colorcode;

  let validPassedImg = rawPassedImg;

  let resolvedImages = [];
  if (pdThumbImg?.length > 0) {
    resolvedImages = pdThumbImg.map((item) => {
      if (!item?.thumbImageUrl) return null;
      if (item.thumbImageUrl.includes("/Design_Thumb")) {
        const firstHalf = item.thumbImageUrl.split("/Design_Thumb")[0];
        const secondhalf = item.thumbImageUrl.split("/Design_Thumb")[1]?.split(".")[0];
        if (firstHalf && secondhalf) {
          return `${firstHalf}${secondhalf}.${item?.originalImageExtension || "webp"}`;
        }
      }
      return item.thumbImageUrl.replace(/\.[^/.]+$/, `.${item?.originalImageExtension || "webp"}`);
    }).filter(url => url && !url.includes("undefined") && !url.startsWith("undefined"));
  }

  if (resolvedImages.length === 0 && validPassedImg) {
    resolvedImages = [validPassedImg];
  }

  const dNo = singleProd?.designno || initialDecodeUrl?.b || decodeUrl?.b;
  const ext = singleProd?.ImageExtension || "webp";
  const baseFol = storeInit?.CDNDesignImageFol || storeinit?.CDNDesignImageFol;
  if (resolvedImages.length === 0 && dNo && baseFol) {
    const colorSuffix = activeColorCode ? `~${activeColorCode}` : "";
    resolvedImages = [`${baseFol}${dNo}~1${colorSuffix}.${ext}`];
  }

  const getImagesArr = resolvedImages;

  const derivedMediaBuildDone = mediaBuildDone || (validPassedImg ? true : false) || (resolvedImages.length > 0);
  const derivedIsMediaReady = isMediaReady || (validPassedImg ? true : false) || (resolvedImages.length > 0);

  const HandleImageDialogOpen = (index) => {
    setSelectedImageIndex(index);
    setIsImageDialogOpen(true);
  };

  const HandleImageDialogClose = () => {
    setSelectedImageIndex(null);
    setIsImageDialogOpen(false);
  };

  const SizeSorting = (SizeArr) => {
    let SizeSorted = SizeArr?.sort((a, b) => {
      let nameA = parseInt(a?.sizename?.toUpperCase());
      let nameB = parseInt(b?.sizename?.toUpperCase());
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      return 0;
    });
    return SizeSorted;
  };

  const handleCartandWish = (e, ele, type) => {
    console.log("handleCartandWish", e, ele, type);
  };

  const handleMoveToDetail = (item) => {
    let obj = {
      a: item?.autocode,
      b: item?.designno,
      m: loginData?.MetalId ?? storeInit?.MetalId,
      d: loginData?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginData?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };
    let encodeObj = btoa(JSON.stringify(obj));
    Navigate(`/d/${item?.TitleLine ? formatTitleLine(item?.TitleLine) : ""}${item?.designno}?p=${encodeObj}`);
  };

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
                  ] || []).filter(item => item.src && !item.src.includes("undefined"))
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
                handleMetalWiseColorImgWithFlag={handleMetalWiseColorImg}
                selectCsQC={selectCsQC}
                csList={csList}
                csQcCombo={csQcCombo}
                loginData={loginData}
                loadingdata={loadingdata}
                isPriceloading={isPriceloading}
                pdLoadImage={pdLoadImage}
                handleCart={handleCart}
                addToCardFlag={addToCardFlag}
                handleWishList={handleWishList}
                wishListFlag={wishListFlag}
                stockItemArr={stockItemArr}
                rd1={rd1Data}
                rd2={rd2Data}
                defaultArticleId={defaultArticleId}
                customizationDetail={customizationDetail}
                rd1CartMap={rd1CartMap}
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
        <>
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
        </>
      )}
    </>
  );
};

export default ProductDetail;
