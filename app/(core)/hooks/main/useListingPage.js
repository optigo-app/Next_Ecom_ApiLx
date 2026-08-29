"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import _ from "lodash";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSyncStore } from "@/app/(core)/hooks/useStore";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";
import {
  compressAndEncode,
  getCardImageUrl,
  convertUrl,
  handleMoveToDetail,
  parseRangeData,
  decodeEntities,
  BreadCumsObj,
  handleBreadcums,
  DynamicListPageTitleLineFunc,
} from "@/app/(core)/utils/product/productListingHelpers";

export {
  compressAndEncode,
  getCardImageUrl,
  convertUrl,
  handleMoveToDetail,
  parseRangeData,
  decodeEntities,
  BreadCumsObj,
  handleBreadcums,
  DynamicListPageTitleLineFunc,
};

/**
 * Single Consolidated Master Hook for Product Listing Page (PLP)
 * Handles combos, cart/wishlist state maps, hover rollovers, checkbox filters,
 * range sliders, clear all, sorting, pagination, and API fetching.
 */
export function useListingPage({
  searchParams,
  params,
  selectedMetalId: initialMetalId,
  selectedDiaId: initialDiaId,
  selectedCsId: initialCsId,
  storeinit,
  loginUserDetail,
  finalId,
} = {}) {
  const { setCartCountNum, setWishCountNum, islogin } = useStore();
  const syncProductList = useSyncStore((state) => state.syncProductList);
  const location = usePathname();
  const cookie = Cookies.get("visiterId");

  // Selection Combos
  const [selectedMetalId, setSelectedMetalId] = useState(
    initialMetalId ?? loginUserDetail?.MetalId ?? storeinit?.MetalId
  );
  const [selectedDiaId, setSelectedDiaId] = useState(
    initialDiaId ?? loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid
  );
  const [selectedCsId, setSelectedCsId] = useState(
    initialCsId ?? loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid
  );

  // Sync with prop changes if passed
  useEffect(() => {
    if (initialMetalId !== undefined) setSelectedMetalId(initialMetalId);
  }, [initialMetalId]);
  useEffect(() => {
    if (initialDiaId !== undefined) setSelectedDiaId(initialDiaId);
  }, [initialDiaId]);
  useEffect(() => {
    if (initialCsId !== undefined) setSelectedCsId(initialCsId);
  }, [initialCsId]);

  // Product & Data States
  const [productListData, setProductListData] = useState([]);
  const [isProdLoading, setIsProdLoading] = useState(true);
  const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [afterFilterCount, setAfterFilterCount] = useState(0);
  const [afterCountStatus, setAfterCountStatus] = useState(false);

  // Combos
  const [metalTypeCombo, setMetalTypeCombo] = useState(getSession("metalTypeCombo") || []);
  const [diaQcCombo, setDiaQcCombo] = useState(getSession("diamondQualityColorCombo") || []);
  const [csQcCombo, setCsQcCombo] = useState(getSession("ColorStoneQualityColorCombo") || []);
  const [metalColorCombo, setMetalColorCombo] = useState(getSession("MetalColorCombo") || []);

  // Cart & Wishlist Map States
  const [cartArr, setCartArr] = useState({});
  const [wishArr, setWishArr] = useState({});

  // Hover Rollover Image Map
  const [rollOverImgPd, setRolloverImgPd] = useState({});

  // Filter & Pagination States
  const [filterChecked, setFilterChecked] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const [sortBySelect, setSortBySelect] = useState("Recommended");

  // Sliders & Range States
  const [sliderValue, setSliderValue] = useState([]);
  const [sliderValue1, setSliderValue1] = useState([]);
  const [sliderValue2, setSliderValue2] = useState([]);
  const [inputDia, setInputDia] = useState([]);
  const [inputNet, setInputNet] = useState([]);
  const [inputGross, setInputGross] = useState([]);
  const [appliedRange1, setAppliedRange1] = useState(["", ""]);
  const [appliedRange2, setAppliedRange2] = useState(["", ""]);
  const [appliedRange3, setAppliedRange3] = useState(["", ""]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isClearAllClicked, setIsClearAllClicked] = useState(false);

  // Price Range States
  const [priceRangeValue, setPriceRangeValue] = useState(["", ""]);
  const [inputPrice, setInputPrice] = useState(["", ""]);
  const [lowestPrice, setLowestPrice] = useState("");
  const [highestPrice, setHighestPrice] = useState("");
  const [trend, setTrend] = useState("Recommended");
  const [detailsMenu, setDetailsMenu] = useState(null);
  const [prodListType, setProdListType] = useState("");

  // Search decoding
  const result = useMemo(() => ParseAndDecodeSearchParams(searchParams), [searchParams]);

  // ----------------------------------------------------
  // 1. Combo Hydration with Session Cache Fallback
  // ----------------------------------------------------
  const callAllApi = useCallback(() => {
    let mtTypeLocal = getSession("metalTypeCombo");
    let diaQcLocal = getSession("diamondQualityColorCombo");
    let csQcLocal = getSession("ColorStoneQualityColorCombo");
    let mtColorLocal = getSession("MetalColorCombo");

    if (!mtTypeLocal || mtTypeLocal?.length === 0) {
      MetalTypeComboAPI(cookie)
        .then((res) => {
          if (res?.Data?.rd) {
            setSession("metalTypeCombo", res.Data.rd);
            setMetalTypeCombo(res.Data.rd);
          }
        })
        .catch(console.error);
    } else {
      setMetalTypeCombo(mtTypeLocal);
    }

    if (!diaQcLocal || diaQcLocal?.length === 0) {
      DiamondQualityColorComboAPI()
        .then((res) => {
          if (res?.Data?.rd) {
            setSession("diamondQualityColorCombo", res.Data.rd);
            setDiaQcCombo(res.Data.rd);
          }
        })
        .catch(console.error);
    } else {
      setDiaQcCombo(diaQcLocal);
    }

    if (!csQcLocal || csQcLocal?.length === 0) {
      ColorStoneQualityColorComboAPI()
        .then((res) => {
          if (res?.Data?.rd) {
            setSession("ColorStoneQualityColorCombo", res.Data.rd);
            setCsQcCombo(res.Data.rd);
          }
        })
        .catch(console.error);
    } else {
      setCsQcCombo(csQcLocal);
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      MetalColorCombo()
        .then((res) => {
          if (res?.Data?.rd) {
            setSession("MetalColorCombo", res.Data.rd);
            setMetalColorCombo(res.Data.rd);
          }
        })
        .catch(console.error);
    } else {
      setMetalColorCombo(mtColorLocal);
    }
  }, [cookie]);

  useEffect(() => {
    callAllApi();
  }, [callAllApi]);

  // ----------------------------------------------------
  // 2. Cart & Wishlist Toggle Handler
  // ----------------------------------------------------
  const handleCartandWish = useCallback(
    async (e, ele, type) => {
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();

      const prodObj = {
        autocode: ele?.autocode,
        Metalid: selectedMetalId ?? ele?.MetalPurityid,
        MetalColorId: ele?.MetalColorid,
        DiaQCid: selectedDiaId ?? loginUserDetail?.cmboDiaQCid,
        CsQCid: selectedCsId ?? loginUserDetail?.cmboCSQCid,
        Size: ele?.DefaultSize,
        Unitcost: ele?.UnitCost,
        markup: ele?.DesignMarkUp,
        UnitCostWithmarkup: ele?.UnitCostWithMarkUp,
        Remark: "",
        Metal_Cost: ele?.Metal_Cost,
        Labour_Cost: ele?.Labour_Cost,
        Diamond_Cost: ele?.Diamond_Cost,
        Diamond_SettingCost: ele?.Diamond_SettingCost,
        ColorStone_Cost: ele?.ColorStone_Cost,
        ColorStone_SettingCost: ele?.ColorStone_SettingCost,
        Misc_Cost: ele?.Misc_Cost,
        Misc_SettingCost: ele?.Misc_SettingCost,
        Other_Cost: ele?.Other_Cost,
        SolPrice: ele?.SolPrice,
        ArticleNo: ele?.ArticleNo,
      };

      const isChecked = e?.target?.checked !== undefined ? Boolean(e.target.checked) : true;
      const autocodeKey = ele?.autocode ? String(ele.autocode) : null;
      const articleKey = ele?.ArticleNo ? String(ele.ArticleNo) : null;
      const designKey = ele?.designno ? String(ele.designno) : null;
      const keys = [autocodeKey, articleKey, designKey].filter(Boolean);

      if (isChecked) {
        CartAndWishListAPI(type, prodObj, cookie)
          .then((res) => {
            let cartC = res?.Data?.rd[0]?.Cartlistcount;
            let wishC = res?.Data?.rd[0]?.Wishlistcount;
            if (wishC !== undefined) setWishCountNum(wishC);
            if (cartC !== undefined) setCartCountNum(cartC);
          })
          .catch(console.error);
      } else {
        RemoveCartAndWishAPI(type, ele?.autocode || ele?.ArticleNo, cookie)
          .then((res) => {
            let cartC = res?.Data?.rd[0]?.Cartlistcount;
            let wishC = res?.Data?.rd[0]?.Wishlistcount;
            if (wishC !== undefined) setWishCountNum(wishC);
            if (cartC !== undefined) setCartCountNum(cartC);
          })
          .catch(console.error);
      }

      keys.forEach((key) => {
        if (type === "Cart") {
          setCartArr((prev) => ({ ...prev, [key]: isChecked }));
        }
        if (type === "Wish") {
          setWishArr((prev) => ({ ...prev, [key]: isChecked }));
        }
      });
    },
    [selectedMetalId, selectedDiaId, selectedCsId, cookie, loginUserDetail, setCartCountNum, setWishCountNum]
  );

  // ----------------------------------------------------
  // 3. Hover Rollover Image Handlers
  // ----------------------------------------------------
  const handleImgRollover = useCallback((pd, rolloverUrl) => {
    if (pd?.autocode && rolloverUrl) {
      setRolloverImgPd((prev) => ({ ...prev, [pd.autocode]: rolloverUrl }));
    }
  }, []);

  const handleLeaveImgRolloverImg = useCallback((pd, defaultUrl) => {
    if (pd?.autocode) {
      setRolloverImgPd((prev) => ({ ...prev, [pd.autocode]: defaultUrl }));
    }
  }, []);

  // ----------------------------------------------------
  // 4. Checkbox Filter Actions
  // ----------------------------------------------------
  const handleCheckboxChange = useCallback((e, listname, val) => {
    const { name, checked } = e.target;
    setAfterCountStatus(true);

    setFilterChecked((prev) => ({
      ...prev,
      [name]: {
        checked,
        type: listname,
        id: name?.replace(/[a-zA-Z]/g, ""),
        value: val,
      },
    }));
  }, []);

  const FilterValueWithCheckedOnly = useCallback(() => {
    let onlyTrueFilterValue = Object.values(filterChecked).filter((ele) => ele.checked);

    const priceValues = onlyTrueFilterValue
      .filter((item) => item.type === "Price")
      .map((item) => item.value);

    const output = {};

    onlyTrueFilterValue.forEach((item) => {
      if (!output[item.type]) {
        output[item.type] = "";
      }

      if (item.type === "Price") {
        output["Price"] = priceValues;
        return;
      }

      output[item.type] += `${item.id}, `;
    });

    for (const key in output) {
      if (key !== "Price") {
        output[key] = output[key].slice(0, -2);
      }
    }

    setCurrPage(1);
    setInputPage(1);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("key", JSON.stringify(output));
    }

    return output;
  }, [filterChecked]);

  // ----------------------------------------------------
  // 5. Clear All Filters Handler
  // ----------------------------------------------------
  const handelFilterClearAll = useCallback(() => {
    const diafilter =
      filterData?.find((ele) => ele?.Name === "Diamond")?.options?.length > 0
        ? JSON.parse(filterData.find((ele) => ele?.Name === "Diamond")?.options)[0]
        : [];
    const diafilter1 =
      filterData?.find((ele) => ele?.Name === "NetWt")?.options?.length > 0
        ? JSON.parse(filterData.find((ele) => ele?.Name === "NetWt")?.options)[0]
        : [];
    const diafilter2 =
      filterData?.find((ele) => ele?.Name === "Gross")?.options?.length > 0
        ? JSON.parse(filterData.find((ele) => ele?.Name === "Gross")?.options)[0]
        : [];

    const isFilterChecked = Object.values(filterChecked).some((ele) => ele.checked);
    const isSliderChanged =
      JSON.stringify(sliderValue) !==
        JSON.stringify(
          diafilter?.Min != null || diafilter?.Max != null ? [diafilter?.Min, diafilter?.Max] : []
        ) ||
      JSON.stringify(sliderValue1) !==
        JSON.stringify(
          diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1?.Min, diafilter1?.Max] : []
        ) ||
      JSON.stringify(sliderValue2) !==
        JSON.stringify(
          diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2?.Min, diafilter2?.Max] : []
        );

    const isInputFields = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);

    if (isFilterChecked || isSliderChanged || isInputFields) {
      setSliderValue(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
      setSliderValue1(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1.Min, diafilter1.Max] : []);
      setSliderValue2(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2.Min, diafilter2.Max] : []);
      setPriceRangeValue(["", ""]);
      setInputPrice(["", ""]);
      setInputDia(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
      setInputNet(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1.Min, diafilter1.Max] : []);
      setInputGross(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2.Min, diafilter2.Max] : []);
      setAppliedRange1(["", ""]);
      setAppliedRange2(["", ""]);
      setAppliedRange3(["", ""]);
      setShow(false);
      setShow1(false);
      setShow2(false);
      setIsReset(false);
      setFilterChecked({});
      setIsClearAllClicked(true);
    }
  }, [filterData, filterChecked, sliderValue, sliderValue1, sliderValue2, priceRangeValue]);

  const anyFilterApplied = useMemo(() => {
    const isFilterChecked = Object.values(filterChecked).some((ele) => ele.checked);

    const diafilter = filterData?.find((ele) => ele?.Name === "Diamond")?.options;
    const netfilter = filterData?.find((ele) => ele?.Name === "NetWt")?.options;
    const grossfilter = filterData?.find((ele) => ele?.Name === "Gross")?.options;

    const diaOptions = diafilter ? JSON.parse(diafilter)[0] : null;
    const netOptions = netfilter ? JSON.parse(netfilter)[0] : null;
    const grossOptions = grossfilter ? JSON.parse(grossfilter)[0] : null;

    const isSliderChanged =
      (diaOptions && JSON.stringify(sliderValue) !== JSON.stringify(diaOptions.Min != null && diaOptions.Max != null ? [diaOptions.Min, diaOptions.Max] : [])) ||
      (netOptions && JSON.stringify(sliderValue1) !== JSON.stringify(netOptions.Min != null && netOptions.Max != null ? [netOptions.Min, netOptions.Max] : [])) ||
      (grossOptions && JSON.stringify(sliderValue2) !== JSON.stringify(grossOptions.Min != null && grossOptions.Max != null ? [grossOptions.Min, grossOptions.Max] : []));

    const isInputPriceApplied = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);

    return isFilterChecked || isSliderChanged || isInputPriceApplied;
  }, [filterChecked, sliderValue, sliderValue1, sliderValue2, priceRangeValue, filterData]);

  const showClearAllButton = anyFilterApplied;

  // ----------------------------------------------------
  // 6. Pagination & Page Change Handler
  // ----------------------------------------------------
  const handelPageChange = useCallback(
    async (event, value) => {
      let output = FilterValueWithCheckedOnly();
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
      setIsOnlyProdLoading(true);
      setCurrPage(value);
      setInputPage(value);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scroll({ top: 0, behavior: "smooth" });
        }
      }, 100);

      const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", sliderValue2, inputGross);
      const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

      const inputPriceField = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);
      if (inputPriceField) {
        output = { ...output, PriceMin: priceRangeValue[0], PriceMax: priceRangeValue[1] };
      }

      let cacheKey = null;
      const isDefaultState =
        Object.keys(filterChecked).length === 0 &&
        (!DiaRange || (DiaRange.DiaMin === "" && DiaRange.DiaMax === "")) &&
        (!netRange || (netRange.netMin === "" && netRange.netMax === "")) &&
        (!grossRange || (grossRange.grossMin === "" && grossRange.grossMax === ""));

      if (value === 1 && isDefaultState && finalId && searchParams && typeof searchParams === "object") {
        const queryParts = [];
        const sortedEntries = Object.entries(searchParams).sort((a, b) => a[0].localeCompare(b[0]));
        sortedEntries.forEach(([k, v]) => {
          if (v && typeof v === "string") {
            queryParts.push(`${k}_${v.replace(/[^a-zA-Z0-9_\-]/g, "_")}`);
          }
        });
        if (queryParts.length > 0) {
          cacheKey = `menu/pl_${finalId}_${queryParts.join("_")}`;
        }
      }

      let cachedRes = null;
      if (cacheKey) {
        try {
          const diskCached = await readCache(cacheKey);
          if (diskCached?.cached && diskCached.data?.pdList) {
            cachedRes = diskCached.data;
          }
        } catch (_) {}
      }

      if (cachedRes) {
        setProductListData(cachedRes?.pdList || []);
        if (cachedRes?.pdResp?.rd1?.[0]?.designcount) {
          setAfterFilterCount(cachedRes.pdResp.rd1[0].designcount);
        }
        setIsOnlyProdLoading(false);
      } else {
        ProductListApi(
          output,
          value,
          obj,
          prodListType,
          cookie,
          sortBySelect,
          DiaRange,
          netRange,
          grossRange
        )
          .then((res) => {
            if (res) {
              setProductListData(res?.pdList || []);
              if (res?.pdResp?.rd1?.[0]?.designcount) {
                setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
              }
              if (cacheKey) {
                writeCache(cacheKey, res).catch(() => {});
              }
            }
            return res;
          })
          .catch(console.error)
          .finally(() => {
            setTimeout(() => {
              setIsOnlyProdLoading(false);
            }, 100);
          });
      }
    },
    [
      FilterValueWithCheckedOnly,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      filterData,
      sliderValue,
      sliderValue1,
      sliderValue2,
      inputDia,
      inputNet,
      inputGross,
      priceRangeValue,
      prodListType,
      cookie,
      sortBySelect,
      filterChecked,
      finalId,
      searchParams,
    ]
  );

  // ----------------------------------------------------
  // 7. Range Filter API Handlers
  // ----------------------------------------------------
  const handleRangeFilterApi = useCallback(
    async (Rangeval) => {
      setIsOnlyProdLoading(true);
      let output = FilterValueWithCheckedOnly();
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      setCurrPage(1);
      setInputPage(1);

      const DiaRange = parseRangeData(filterData, "Dia", Rangeval, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", sliderValue2, inputGross);
      const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

      try {
        const res = await ProductListApi(
          output,
          1,
          obj,
          prodListType,
          cookie,
          sortBySelect,
          DiaRange,
          netRange,
          grossRange
        );
        if (res) {
          setProductListData(res?.pdList || []);
          setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount || 0);
        }
      } catch (err) {
        console.error("handleRangeFilterApi error:", err);
      } finally {
        setIsOnlyProdLoading(false);
      }
    },
    [
      FilterValueWithCheckedOnly,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      filterData,
      inputDia,
      sliderValue2,
      inputGross,
      sliderValue1,
      inputNet,
      prodListType,
      cookie,
      sortBySelect,
    ]
  );

  const handleRangeFilterApi1 = useCallback(
    async (Rangeval1) => {
      setIsOnlyProdLoading(true);
      let output = FilterValueWithCheckedOnly();
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", sliderValue2, inputGross);
      const netRange = parseRangeData(filterData, "net", Rangeval1, inputNet);

      setCurrPage(1);
      setInputPage(1);

      try {
        const res = await ProductListApi(
          output,
          1,
          obj,
          prodListType,
          cookie,
          sortBySelect,
          DiaRange,
          netRange,
          grossRange
        );
        if (res) {
          setProductListData(res?.pdList || []);
          setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount || 0);
        }
      } catch (err) {
        console.error("handleRangeFilterApi1 error:", err);
      } finally {
        setIsOnlyProdLoading(false);
      }
    },
    [
      FilterValueWithCheckedOnly,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      filterData,
      sliderValue,
      inputDia,
      sliderValue2,
      inputGross,
      inputNet,
      prodListType,
      cookie,
      sortBySelect,
    ]
  );

  const handleRangeFilterApi2 = useCallback(
    async (Rangeval2) => {
      setIsOnlyProdLoading(true);
      let output = FilterValueWithCheckedOnly();
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", Rangeval2, inputGross);
      const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

      setCurrPage(1);
      setInputPage(1);

      try {
        const res = await ProductListApi(
          output,
          1,
          obj,
          prodListType,
          cookie,
          sortBySelect,
          DiaRange,
          netRange,
          grossRange
        );
        if (res) {
          setProductListData(res?.pdList || []);
          setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount || 0);
        }
      } catch (err) {
        console.error("handleRangeFilterApi2 error:", err);
      } finally {
        setIsOnlyProdLoading(false);
      }
    },
    [
      FilterValueWithCheckedOnly,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      filterData,
      sliderValue,
      inputDia,
      sliderValue1,
      inputNet,
      prodListType,
      cookie,
      sortBySelect,
    ]
  );

  // ----------------------------------------------------
  // 8. Sorting Handler
  // ----------------------------------------------------
  const handleSortby = useCallback(
    async (e) => {
      const sortby = e?.target?.value ?? e;
      setSortBySelect(sortby);
      setTrend(sortby);
      setProductListData([]);
      setIsOnlyProdLoading(true);

      let output = FilterValueWithCheckedOnly();
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", sliderValue2, inputGross);
      const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

      const inputPriceField = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);
      if (inputPriceField) {
        output = { ...output, PriceMin: priceRangeValue[0], PriceMax: priceRangeValue[1] };
      }

      setCurrPage(1);
      setInputPage(1);

      try {
        const res = await ProductListApi(
          output,
          1,
          obj,
          prodListType,
          cookie,
          sortby,
          DiaRange,
          netRange,
          grossRange
        );
        if (res) {
          setProductListData(res?.pdList || []);
          setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount || 0);
        }
      } catch (err) {
        console.error("handleSortby error:", err);
      } finally {
        setIsOnlyProdLoading(false);
      }
    },
    [
      FilterValueWithCheckedOnly,
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      filterData,
      sliderValue,
      inputDia,
      sliderValue2,
      inputGross,
      sliderValue1,
      inputNet,
      priceRangeValue,
      prodListType,
      cookie,
    ]
  );

  // ----------------------------------------------------
  // 9. Master Orchestrator: Fetch Product List & Filter List
  // ----------------------------------------------------
  useEffect(() => {
    let UrlVal = Array.isArray(result) ? result : [];
    let MenuVal = "";
    let SearchVar = "";
    let productlisttype = "";
    let NewArrivalVar = "";
    let TrendingVar = "";
    let BestSellerVar = "";
    let AlbumVar = "";
    const hasCollection = result?.includes("collection");

    UrlVal.forEach((ele) => {
      if (typeof ele !== "string") return;
      let firstChar = ele.charAt(0);
      switch (firstChar) {
        case "M":
          MenuVal = ele;
          break;
        case "N":
          NewArrivalVar = ele;
          break;
        case "S":
          SearchVar = ele;
          break;
        case "T":
          TrendingVar = ele;
          break;
        case "B":
          BestSellerVar = ele;
          break;
        case "A":
          AlbumVar = ele;
          break;
        default:
          break;
      }
    });

    if (MenuVal.length > 0) {
      try {
        let menuDecode = atob(MenuVal?.split("=")[1]);
        let key = menuDecode?.split("/")[1]?.split(",");
        let val = menuDecode?.split("/")[0]?.split(",");
        productlisttype = [key, val];
        setDetailsMenu(productlisttype);
      } catch (_) {}
    } else if (SearchVar) {
      productlisttype = SearchVar;
      setDetailsMenu(productlisttype);
    } else if (NewArrivalVar) {
      productlisttype = NewArrivalVar.split("=")[1];
      setDetailsMenu(productlisttype);
    } else if (TrendingVar) {
      productlisttype = TrendingVar.split("=")[1];
      setDetailsMenu(productlisttype);
    } else if (BestSellerVar) {
      productlisttype = BestSellerVar.split("=")[1];
      setDetailsMenu(productlisttype);
    } else if (AlbumVar) {
      productlisttype = AlbumVar.split("=")[1];
      setDetailsMenu(productlisttype);
    }

    setProdListType(productlisttype);

    const effectiveSortBy = NewArrivalVar
      ? "New"
      : hasCollection
      ? "Design Set"
      : sortBySelect ?? "Recommended";

    setTrend(effectiveSortBy);

    const fetchData = async () => {
      try {
        setIsProdLoading(true);
        setIsOnlyProdLoading(true);

        const metalId = selectedMetalId ?? loginUserDetail?.MetalId ?? storeinit?.MetalId;
        const diaId = selectedDiaId ?? loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid;
        const csId = selectedCsId ?? loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid;
        const obj = { mt: metalId, dia: diaId, cs: csId };

        const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
        const grossRange = parseRangeData(filterData, "Gross", sliderValue2, inputGross);
        const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

        let cacheKey = null;
        const isDefaultState =
          Object.keys(filterChecked).length === 0 &&
          (!DiaRange || (DiaRange.DiaMin === "" && DiaRange.DiaMax === "")) &&
          (!netRange || (netRange.netMin === "" && netRange.netMax === "")) &&
          (!grossRange || (grossRange.grossMin === "" && grossRange.grossMax === ""));

        if (isDefaultState && finalId && searchParams && typeof searchParams === "object") {
          const queryParts = [];
          const sortedEntries = Object.entries(searchParams).sort((a, b) => a[0].localeCompare(b[0]));
          sortedEntries.forEach(([k, v]) => {
            if (v && typeof v === "string") {
              queryParts.push(`${k}_${v.replace(/[^a-zA-Z0-9_\-]/g, "_")}`);
            }
          });
          if (queryParts.length > 0) {
            cacheKey = `menu/pl_${finalId}_${queryParts.join("_")}`;
          }
        }

        let cachedRes = null;
        if (cacheKey) {
          try {
            const diskCached = await readCache(cacheKey);
            if (diskCached?.cached && diskCached.data?.pdList) {
              cachedRes = diskCached.data;
            }
          } catch (_) {}
        }

        if (cachedRes) {
          setProductListData(cachedRes?.pdList || []);
          setAfterFilterCount(cachedRes?.pdResp?.rd1?.[0]?.designcount || 0);
        } else {
          const res = await ProductListApi(
            {},
            1,
            obj,
            productlisttype,
            cookie,
            effectiveSortBy,
            DiaRange,
            netRange,
            grossRange
          );

          if (res) {
            setProductListData(res?.pdList || []);
            setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount || 0);
            if (cacheKey) {
              writeCache(cacheKey, res).catch(() => {});
            }
          }
        }

        // 2. Fetch Filter Sidebar Options AFTER ProductListApi with 500ms delay (Prevents SQL query collision)
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const res1 = await FilterListAPI(productlisttype, cookie);
          if (res1) {
            setFilterData(res1);
            let diafilter =
              res1?.filter((ele) => ele?.Name === "Diamond")[0]?.options?.length > 0
                ? JSON.parse(res1.filter((ele) => ele?.Name === "Diamond")[0].options)[0]
                : [];
            let diafilter1 =
              res1?.filter((ele) => ele?.Name === "NetWt")[0]?.options?.length > 0
                ? JSON.parse(res1.filter((ele) => ele?.Name === "NetWt")[0].options)[0]
                : [];
            let diafilter2 =
              res1?.filter((ele) => ele?.Name === "Gross")[0]?.options?.length > 0
                ? JSON.parse(res1.filter((ele) => ele?.Name === "Gross")[0].options)[0]
                : [];

            setSliderValue(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
            setInputDia(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
            setSliderValue1(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1.Min, diafilter1.Max] : []);
            setInputNet(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1.Min, diafilter1.Max] : []);
            setSliderValue2(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2.Min, diafilter2.Max] : []);
            setInputGross(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2.Min, diafilter2.Max] : []);
          }
        } catch (err) {
          console.error("FilterListAPI error:", err);
        }
      } catch (err) {
        console.error("useListingPage fetchData error:", err);
      } finally {
        setIsProdLoading(false);
        setIsOnlyProdLoading(false);
      }
    };

    fetchData();
    setCurrPage(1);
    setInputPage(1);
  }, [location, result, syncProductList?.ts]);

  // ----------------------------------------------------
  // 10. Filter Checkbox Change Effect (Debounced)
  // ----------------------------------------------------
  useEffect(() => {
    if (Object.keys(filterChecked).length === 0 && !isClearAllClicked) return;

    const timer = setTimeout(() => {
      let output = FilterValueWithCheckedOnly();
      const metalId = selectedMetalId ?? loginUserDetail?.MetalId ?? storeinit?.MetalId;
      const diaId = selectedDiaId ?? loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid;
      const csId = selectedCsId ?? loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid;
      const obj = { mt: metalId, dia: diaId, cs: csId };

      const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", sliderValue2, inputGross);
      const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

      const inputPriceField = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);
      if (inputPriceField && !output?.Price?.length) {
        output = { ...output, PriceMin: priceRangeValue[0], PriceMax: priceRangeValue[1] };
      }

      setCurrPage(1);
      setInputPage(1);
      setIsOnlyProdLoading(true);

      ProductListApi(
        output,
        1,
        obj,
        prodListType,
        cookie,
        sortBySelect,
        DiaRange,
        netRange,
        grossRange
      )
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList || []);
            setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount || 0);
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsOnlyProdLoading(false);
          setIsClearAllClicked(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [filterChecked]);

  return {
    // Products & Status
    productListData,
    setProductListData,
    isProdLoading,
    setIsProdLoading,
    isOnlyProdLoading,
    setIsOnlyProdLoading,
    afterFilterCount,
    setAfterFilterCount,
    filterData,
    setFilterData,
    afterCountStatus,
    setAfterCountStatus,

    // Combos & Selection
    selectedMetalId,
    setSelectedMetalId,
    selectedDiaId,
    setSelectedDiaId,
    selectedCsId,
    setSelectedCsId,
    metalTypeCombo,
    diaQcCombo,
    csQcCombo,
    metalColorCombo,

    // Cart & Wishlist Map States & Handlers
    cartArr,
    wishArr,
    handleCartandWish,

    // Hover Rollover Image Map & Handlers
    rollOverImgPd,
    handleImgRollover,
    handleLeaveImgRolloverImg,

    // Filters
    filterChecked,
    setFilterChecked,
    handleCheckboxChange,
    FilterValueWithCheckedOnly,
    handelFilterClearAll,
    showClearAllButton,
    anyFilterApplied,

    // Range Sliders & Handlers
    sliderValue,
    setSliderValue,
    sliderValue1,
    setSliderValue1,
    sliderValue2,
    setSliderValue2,
    inputDia,
    setInputDia,
    inputNet,
    setInputNet,
    inputGross,
    setInputGross,
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
    isClearAllClicked,
    setIsClearAllClicked,
    handleRangeFilterApi,
    handleRangeFilterApi1,
    handleRangeFilterApi2,

    // Price Range
    priceRangeValue,
    setPriceRangeValue,
    inputPrice,
    setInputPrice,
    lowestPrice,
    setLowestPrice,
    highestPrice,
    setHighestPrice,

    // Navigation & Category Info
    result,
    trend,
    setTrend,
    detailsMenu,
    setDetailsMenu,
    prodListType,
    setProdListType,

    // Pagination & Sorting
    currPage,
    setCurrPage,
    inputPage,
    setInputPage,
    sortBySelect,
    setSortBySelect,
    handelPageChange,
    handleSortby,
    cookie,
  };
}
