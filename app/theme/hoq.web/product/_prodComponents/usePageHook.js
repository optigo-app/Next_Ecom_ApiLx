import { useState, useEffect, useCallback, useMemo } from "react";

export const usePageHook = (
  afterFilterCount,
  storeInit,
  filterData,
  sliderValue,
  sliderValue1,
  sliderValue2,
  selectedMetalId,
  selectedDiaId,
  selectedCsId,
  ProductListApi,
  prodListType,
  cookie,
  sortBySelect,
  FilterValueWithCheckedOnly,
  setProductListData,
  setAfterFilterCount,
  setIsOnlyProdLoading,
  setIsProdLoading
) => {


  const [currPage, setCurrPage] = useState(1);
  const [inputPage, setInputPage] = useState(currPage);

  // Calculate total pages with proper null/undefined handling
  const totalPages = useMemo(() => {
    const pageSize = storeInit?.PageSize || 60;
    const count = Number(afterFilterCount) || 1;

    if (pageSize <= 0) return 1;

    const calculated = Math.ceil(count / pageSize);
    const result = Math.max(calculated, 1); // Ensure at least 1 page

    // // Debug logging - remove this in production
    // console.log('Pagination Debug:', {
    //   afterFilterCount,
    //   pageSize,
    //   calculated,
    //   result
    // });

    return result;
  }, [afterFilterCount, storeInit?.PageSize]);

  // Handle input change on pressing Enter
  const handlePageInputChange = useCallback(
    (event) => {
      if (event.key === "Enter") {
        const inputValue = parseInt(inputPage, 10);

        // Validate input
        if (isNaN(inputValue)) {
          setInputPage(currPage); // Reset to current page if invalid
          return;
        }

        let newPage = inputValue;
        if (newPage < 1) newPage = 1;
        if (newPage > totalPages) newPage = totalPages;

        setCurrPage(newPage);
        setInputPage(newPage);
        handlePageChange(newPage);
      }
    },
    [inputPage, totalPages, currPage, setCurrPage, setInputPage]
  );

  // Main page change handler
  const handlePageChange = useCallback(
    async (value) => {
      setIsOnlyProdLoading(true);
      setCurrPage(value);
      setInputPage(value);

      // Scroll to top
      setTimeout(() => {
        window.scroll({ top: 0, behavior: "smooth" });
      }, 100);

      const output = FilterValueWithCheckedOnly();
      const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      // Get filter defaults
      const getFilterOption = (name) => {
        const options = filterData?.find((ele) => ele?.Name === name)?.options;
        return options?.length > 0 ? JSON.parse(options)[0] : [];
      };

      const diafilter = getFilterOption("Diamond");
      const diafilter1 = getFilterOption("NetWt");
      const diafilter2 = getFilterOption("Gross");

      const isDia =
        JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
      const isNet =
        JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
      const isGross =
        JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

      const DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" };
      const netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" };
      const grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" };

      try {
        const res = await ProductListApi(
          output,
          value,
          obj,
          prodListType,
          cookie,
          sortBySelect,
          DiaRange,
          netRange,
          grossRange
        );

        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setTimeout(() => setIsOnlyProdLoading(false), 100);
      }
    },
    [
      FilterValueWithCheckedOnly,
      filterData,
      sliderValue,
      sliderValue1,
      sliderValue2,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      ProductListApi,
      prodListType,
      cookie,
      sortBySelect,
      setProductListData,
      setAfterFilterCount,
      setIsOnlyProdLoading
    ]
  );

  return {
    totalPages,
    handlePageInputChange,
    handlePageChange
  };
};
