"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./ProductList.modul.scss";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Box, Drawer, FormControlLabel, useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import FilterSidebar from "./New/NewSideFilter";
import ShopHeader from "./New/ShopHeader";
import JewelryProductGrid from "./New/NewProductList";
import BreadCrumbBar from "./New/BreadCrumb";
import NewPagination from "./New/NewPagination";
import NoProductFound from "./New/NoProductFound";
import { generateBreadcrumbJsonLd } from "@/app/(core)/utils/seo/seo-utils";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import {
  useListingPage,
  handleMoveToDetail,
  decodeEntities,
  BreadCumsObj,
  handleBreadcums,
  DynamicListPageTitleLineFunc,
} from "@/app/(core)/hooks/useListingPage";
import {
  RangeFilterView,
  RangeFilterView1,
  RangeFilterView2,
  PriceRangeInputs,
} from "@/app/(core)/components/product/RangeFilterViews";

const CustomLabel = ({ text }) => (
  <Typography
    sx={{
      fontFamily: "sans-serif",
      fontSize: {
        xs: "14px !important",
        sm: "14px !important",
        md: "14px !important",
        lg: "13.6px !important",
        xl: "15px !important",
      },
    }}
  >
    {text}
  </Typography>
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

const ProductList = ({ storeinit, searchParams, params }) => {
  const { loginUserDetail, finalId } = useStore();
  const location = usePathname();
  const cookie = Cookies.get("visiterId");
  const navigate = useNextRouterLikeRR();
  const isBelow768 = useMediaQuery("(max-width:768px)");
  const maxwidth464px = useMediaQuery("(max-width:464px)");
  const searchParamsHook = useSearchParams();
  const [baseUrl, setBaseUrl] = useState("");

  // Drawer & Responsive Filter States
  const [openFilter, setOpenFilter] = useState(false);
  const filter = useMediaQuery("(max-width:1400px)");
  const showFilter = useMediaQuery("(max-width:1400px) and (min-width:1000px)");

  useGlobalPreventSave();

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const searchParamsStr = searchParamsHook?.toString();
  const fullUrl = useMemo(
    () =>
      `${baseUrl}${location}${searchParamsStr ? `?${searchParamsStr}` : ""}`,
    [baseUrl, location, searchParamsStr],
  );

  const breadcrumbData = useMemo(
    () => [
      { name: "Home", url: baseUrl },
      { name: "Product", url: fullUrl },
    ],
    [baseUrl, fullUrl],
  );

  const breadcrumbJsonLd = useMemo(
    () => JSON.stringify(generateBreadcrumbJsonLd(breadcrumbData)),
    [breadcrumbData],
  );

  useEffect(() => {
    if (typeof window !== "undefined" && baseUrl) {
      sessionStorage.setItem(
        "breadcrumbData",
        JSON.stringify(
          `${baseUrl}${window.location.pathname}${window.location.search}`,
        ),
      );
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, [baseUrl]);

  // Consolidated Master Hook for Listing Page
  const {
    productListData,
    setProductListData,
    isProdLoading,
    setIsProdLoading,
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
    sliderValue,
    setSliderValue,
    sliderValue1,
    setSliderValue1,
    sliderValue2,
    setSliderValue2,
    appliedRange1,
    setAppliedRange1,
    appliedRange2,
    setAppliedRange2,
    appliedRange3,
    setAppliedRange3,
    show,
    setShow,
    show1,
    setShow1,
    show2,
    setShow2,
    isReset,
    setIsReset,
    handleRangeFilterApi,
    handleRangeFilterApi1,
    handleRangeFilterApi2,
    priceRangeValue,
    setPriceRangeValue,
    lowestPrice,
    setLowestPrice,
    highestPrice,
    setHighestPrice,
    result,
    trend,
    setTrend,
    detailsMenu,
    prodListType,
    currPage,
    setCurrPage,
    inputPage,
    setInputPage,
    handelPageChange,
    handleSortby,
  } = useListingPage({
    searchParams,
    params,
    storeinit,
    loginUserDetail,
    finalId,
  });

  const handleMoveToDetailOnClick = useCallback(
    (productData, imageUrl) =>
      handleMoveToDetail({
        productData,
        imageUrl,
        storeinit,
        selectedMetalId,
        selectedDiaId,
        selectedCsId,
        detailsMenu,
        outputFilters: FilterValueWithCheckedOnly(),
        navigate,
      }),
    [
      storeinit,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      detailsMenu,
      FilterValueWithCheckedOnly,
      navigate,
    ],
  );

  const totalPages = useMemo(
    () => Math.ceil(afterFilterCount / (storeinit?.PageSize || 1)),
    [afterFilterCount, storeinit?.PageSize],
  );

  const handlePageInputChange = useCallback(
    (event) => {
      if (event.key === "Enter") {
        setProductListData([]);
        let newPage = parseInt(inputPage, 10);
        if (newPage < 1) newPage = 1;
        if (newPage > totalPages) newPage = totalPages;
        setCurrPage(newPage);
        setInputPage(newPage);
        handelPageChange("", newPage);
      }
    },
    [
      inputPage,
      totalPages,
      setProductListData,
      setCurrPage,
      setInputPage,
      handelPageChange,
    ],
  );

  const handleBreadcrumbClick = useCallback(
    (mparams, isCollectionMenu) => {
      handleBreadcums({ mparams, isCollectionMenu, navigate, location });
    },
    [navigate, location],
  );

  const getBreadCumsObj = useCallback(() => BreadCumsObj(location), [location]);
  const handleFilterOpen = useCallback(() => setOpenFilter(true), []);
  const handleFilterClose = useCallback(() => setOpenFilter(false), []);
  const handleFilterToggle = useCallback(
    () => setOpenFilter((prev) => !prev),
    [],
  );
  const handleChangeTrend = useCallback(
    (e) => setTrend(e.target.value),
    [setTrend],
  );

  return (
    <>
      <title>{DynamicListPageTitleLineFunc(location)}</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd,
        }}
      />
      <Box
        sx={{
          pt: 4,
          px: { xs: 1, sm: 2, md: 4 },
          background: "#fff",
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <BreadCrumbBar
          productListData={productListData}
          decodeURIComponent={decodeURIComponent}
          IsBreadCumShow={Boolean(result?.length)}
          BreadCumsObj={getBreadCumsObj}
          handleBreadcums={handleBreadcrumbClick}
          isFiltering={isOnlyProdLoading || isProdLoading}
        />

        <Drawer
          anchor="left"
          open={openFilter}
          onClose={handleFilterClose}
          transitionDuration={100}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "90%", sm: "454px" },
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
            /** Drawer Controls */
            open={openFilter}
            onClose={handleFilterClose}
            /** Summary Count */
            filterCount={afterFilterCount || 0}
            /** Core Filter Data */
            filterData={filterData}
            storeinit={storeinit}
            loginCurrency={loginUserDetail}
            formatter={formatter}
            decodeEntities={decodeEntities}
            filterChecked={filterChecked}
            /** Event Handlers */
            handleCheckboxChange={handleCheckboxChange}
            handelFilterClearAll={handelFilterClearAll}
            setIsOnlyProdLoading={setIsOnlyProdLoading}
            /** Price Range Related */
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
            /** Diamond Range Filter */
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
            handleRangeFilterApi={handleRangeFilterApi}
            show={show}
            setShow={setShow}
            appliedRange1={appliedRange1}
            setAppliedRange1={setAppliedRange1}
            /** Net Weight Range Filter */
            sliderValue1={sliderValue1}
            setSliderValue1={setSliderValue1}
            handleRangeFilterApi1={handleRangeFilterApi1}
            show1={show1}
            setShow1={setShow1}
            appliedRange2={appliedRange2}
            setAppliedRange2={setAppliedRange2}
            /** Gross Weight Range Filter */
            sliderValue2={sliderValue2}
            setSliderValue2={setSliderValue2}
            handleRangeFilterApi2={handleRangeFilterApi2}
            show2={show2}
            setShow2={setShow2}
            appliedRange3={appliedRange3}
            setAppliedRange3={setAppliedRange3}
            isFiltering={isOnlyProdLoading || isProdLoading}
            isBelow768={isBelow768}
            // Sorting
            sortingSelect={trend}
            handleSortby={handleSortby}
            handleChangeTrend={handleChangeTrend}
            // Metal
            metalType={metalType}
            setSelectedMetalId={setSelectedMetalId}
            // Diamond
            diamondType={diamondType}
            setSelectedDiaId={setSelectedDiaId}
          />
        </Drawer>

        <ShopHeader
          decodedSearchResult={result}
          isBelow768={isBelow768}
          // Sorting
          sortingSelect={trend}
          handleSortby={handleSortby}
          handleChangeTrend={handleChangeTrend}
          // Metal
          metalType={metalType}
          selectedMetalId={selectedMetalId}
          setSelectedMetalId={setSelectedMetalId}
          // Diamond
          diamondType={diamondType}
          selectedDiaId={selectedDiaId}
          setSelectedDiaId={setSelectedDiaId}
          setIsOnlyProdLoading={setIsOnlyProdLoading}
          onFilterToggle={handleFilterToggle}
          filterCount={afterFilterCount}
          storeinit={storeinit}
          isFiltering={isOnlyProdLoading || isProdLoading}
          // Clear All
          anyFilterApplied={anyFilterApplied}
          handelFilterClearAll={handelFilterClearAll}
        />

        {!isOnlyProdLoading && productListData.length === 0 ? (
          <NoProductFound />
        ) : (
          <JewelryProductGrid
            productListData={productListData}
            isFiltering={isOnlyProdLoading || isProdLoading}
            handleMoveToDetail={handleMoveToDetailOnClick}
            showFilter={showFilter}
            filter={filter}
            filterData={filterData}
            handleCartandWish={handleCartandWish}
            cartArr={cartArr}
            wishArr={wishArr}
            storeinit={storeinit}
            loginUserDetail={loginUserDetail}
          />
        )}

        {storeinit?.IsProductListPagination === 1 && totalPages > 1 && (
          <NewPagination
            currentPage={currPage}
            totalItems={afterFilterCount}
            itemsPerPage={storeinit.PageSize}
            onPageChange={handelPageChange}
            inputPage={inputPage}
            setInputPage={setInputPage}
            handlePageInputChange={handlePageInputChange}
            maxwidth464px={maxwidth464px}
            totalPages={totalPages}
            currPage={currPage}
            isShowButton={false}
          />
        )}
      </Box>
    </>
  );
};

export default React.memo(ProductList);
