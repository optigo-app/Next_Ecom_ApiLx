"use client";
import "./grid.css";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, CircularProgress, Drawer, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import { FormControlLabel } from "@mui/material";

import {
  useListingPage,
  getCardImageUrl,
  handleMoveToDetail as handleMoveToDetailHelper,
  decodeEntities,
  DynamicListPageTitleLineFunc,
} from "@/app/(core)/hooks/useListingPage";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import {
  RangeFilterView,
  RangeFilterView1,
  RangeFilterView2,
  PriceRangeInputs,
} from "@/app/(core)/components/product/RangeFilterViews";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";

import MobileHeader from "./MobileHeader";
import ActionIsland from "./FloatingIsland";
import ProductCard from "./ProductCard";
import FilterSidebar from "@/app/theme/beluxjewel.web/product/ProductList/New/NewSideFilter";

// matches belux's CustomLabel / CustomFormControlLabel for NewSideFilter
const CustomLabel = ({ text }) => (
  <Typography sx={{ fontFamily: "sans-serif", fontSize: "14px" }}>{text}</Typography>
);
const CustomFormControlLabel = styled(FormControlLabel)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginInline: "20px",
  fontSize: "16px",
  fontFamily: "sans-serif",
  color: "rgb(127, 125, 133)",
  paddingBlock: "5px",
  flexDirection: "row-reverse",
}));

const MobileProductListing = ({
  params,
  searchParams,
  storeinit,
  initialData,
  initialFilterData,
}) => {
  const { loginUserDetail, finalId } = useStore();
  const navigate = useNextRouterLikeRR();
  const cookie = Cookies.get("visiterId");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ImageView, setImageView] = useState(false);

  // ── useListingPage: same master engine as beluxjewel ────────────────────
  const {
    productListData,
    setProductListData,
    isProdLoading,
    isOnlyProdLoading,
    setIsOnlyProdLoading,
    afterFilterCount,
    setAfterFilterCount,
    filterData,
    metalTypeCombo: metalType,
    diaQcCombo: diamondType,
    selectedMetalId,
    setSelectedMetalId,
    selectedDiaId,
    setSelectedDiaId,
    selectedCsId,
    setSelectedCsId,
    cartArr,
    wishArr,
    handleCartandWish,
    filterChecked,
    handleCheckboxChange,
    FilterValueWithCheckedOnly,
    handelFilterClearAll,
    anyFilterApplied,
    sliderValue, setSliderValue,
    sliderValue1, setSliderValue1,
    sliderValue2, setSliderValue2,
    appliedRange1, setAppliedRange1,
    appliedRange2, setAppliedRange2,
    appliedRange3, setAppliedRange3,
    show, setShow,
    show1, setShow1,
    show2, setShow2,
    isReset, setIsReset,
    handleRangeFilterApi,
    handleRangeFilterApi1,
    handleRangeFilterApi2,
    priceRangeValue, setPriceRangeValue,
    lowestPrice, setLowestPrice,
    highestPrice, setHighestPrice,
    result,
    trend,
    detailsMenu,
    prodListType,
    currPage,
    handelPageChange,
    loadMoreProducts,
    handleSortby,
  } = useListingPage({
    searchParams,
    params,
    storeinit,
    loginUserDetail,
    finalId,
    initialData,
    initialFilterData,
  });

  const handleMoveToDetail = useCallback(
    (productData) => {
      const imageUrl = getCardImageUrl(productData, storeinit);
      handleMoveToDetailHelper({
        productData,
        imageUrl,
        storeinit,
        selectedMetalId,
        selectedDiaId,
        selectedCsId,
        detailsMenu,
        outputFilters: FilterValueWithCheckedOnly(),
        navigate,
      });
    },
    [storeinit, selectedMetalId, selectedDiaId, selectedCsId, detailsMenu, navigate, FilterValueWithCheckedOnly]
  );

  const isLoading = isProdLoading || isOnlyProdLoading;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const loadingMoreRef = useRef(false);

  const pageSize = Number(storeinit?.PageSize || 10);
  const totalPages = Math.ceil((afterFilterCount || 0) / pageSize);

  const loadNextPage = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      isLoading ||
      !productListData?.length ||
      !currPage ||
      currPage >= totalPages
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      await loadMoreProducts(currPage + 1);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [currPage, isLoading, loadMoreProducts, productListData?.length, totalPages]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadNextPage();
      },
      { rootMargin: "500px 0px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage]);

  const handleChangeTrend = (e) => {
    const val = e?.target?.value;
    if (val) handleSortby(val);
  };

  return (
    <>
      <title>{DynamicListPageTitleLineFunc()}</title>

      {/* Mobile Header */}
      <MobileHeader
        result={result}
        afterFilterCount={afterFilterCount || 0}
        showClearAllButton={() => anyFilterApplied}
        afterCountStatus={isLoading}
        IsBreadCumShow={productListData?.length > 0}
        menuDecode={result}
      />

      {/* Filter Drawer — belux NewSideFilter inside MUI Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transitionDuration={100}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "88%", sm: "380px" },
            border: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            borderRadius: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <FilterSidebar
          CustomLabel={CustomLabel}
          CustomFormControlLabel={CustomFormControlLabel}
          PriceRangeInputs={PriceRangeInputs}
          RangeFilterView1={RangeFilterView1}
          RangeFilterView2={RangeFilterView2}
          RangeFilterView={RangeFilterView}
          /* Drawer Controls */
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          /* Count */
          filterCount={afterFilterCount || 0}
          /* Core Filter Data */
          filterData={filterData}
          storeInit={storeinit}
          loginCurrency={loginUserDetail}
          formatter={formatter}
          decodeEntities={decodeEntities}
          filterChecked={filterChecked}
          /* Event Handlers */
          handleCheckboxChange={handleCheckboxChange}
          handelFilterClearAll={handelFilterClearAll}
          setIsOnlyProdLoading={setIsOnlyProdLoading}
          /* Price Range */
          priceRangeValue={priceRangeValue}
          setPriceRangeValue={setPriceRangeValue}
          lowestPrice={lowestPrice}
          highestPrice={highestPrice}
          setLowestPrice={setLowestPrice}
          setHighestPrice={setHighestPrice}
          setProductListData={setProductListData}
          setAfterFilterCount={setAfterFilterCount}
          selectedMetalId={selectedMetalId}
          selectedDiaId={selectedDiaId}
          selectedCsId={selectedCsId}
          prodListType={prodListType}
          cookie={cookie}
          isReset={isReset}
          setIsReset={setIsReset}
          /* Diamond Range */
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          handleRangeFilterApi={handleRangeFilterApi}
          show={show}
          setShow={setShow}
          appliedRange1={appliedRange1}
          setAppliedRange1={setAppliedRange1}
          /* Net Weight Range */
          sliderValue1={sliderValue1}
          setSliderValue1={setSliderValue1}
          handleRangeFilterApi1={handleRangeFilterApi1}
          show1={show1}
          setShow1={setShow1}
          appliedRange2={appliedRange2}
          setAppliedRange2={setAppliedRange2}
          /* Gross Weight Range */
          sliderValue2={sliderValue2}
          setSliderValue2={setSliderValue2}
          handleRangeFilterApi2={handleRangeFilterApi2}
          show2={show2}
          setShow2={setShow2}
          appliedRange3={appliedRange3}
          setAppliedRange3={setAppliedRange3}
          isFiltering={isLoading}
          isBelow768={true}
          /* Sorting */
          sortingSelect={trend}
          handleSortby={handleSortby}
          handleChangeTrend={handleChangeTrend}
          /* Metal */
          metalType={metalType}
          setSelectedMetalId={setSelectedMetalId}
          /* Diamond */
          diamondType={diamondType}
          setSelectedDiaId={setSelectedDiaId}
        />
      </Drawer>

      {/* Product Grid — 2-col default, 1-col when ImageView */}
      <Box
        sx={{
          pb: 10,
          px: 1,
          pt: 0.5,
          backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "45vh" }}>
            <CircularProgress size={30} />
          </Box>
        ) : productListData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, color: "#999" }}>
            <Typography>No products found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={1}>
            {productListData.map((product, idx) => {
              const imageUrl = getCardImageUrl(product, storeinit);
              return (
                <Grid
                  item
                  size={{
                     xs: ImageView === 1 ? 12 : 6
                  }}
                  key={product?.autocode || product?.ArticleNo || idx}
                >
                  <ProductCard
                    productData={product}
                    handleCartandWish={handleCartandWish}
                    cartArr={cartArr}
                    wishArr={wishArr}
                    handleMoveToDetail={handleMoveToDetail}
                    selectedMetalId={selectedMetalId}
                    productIndex={idx}
                    imageUrl={imageUrl}
                    storeInit={storeinit}
                    loginUserDetail={loginUserDetail}
                    ImageView={ImageView}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box ref={loadMoreRef} sx={{ minHeight: 1, width: "100%" }} aria-hidden="true" />
        {isLoadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Floating Filter / View Toggle */}
      <ActionIsland
        ImageView={ImageView}
        ChangeView={() => setImageView((v) => !v)}
        OpenFilter={() => setIsDrawerOpen(true)}
        FilterDrawerOpen={isDrawerOpen}
      />
    </>
  );
};

export default MobileProductListing;
