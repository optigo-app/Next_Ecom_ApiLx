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
import { GetCountAPI, buildCartAndWishMaps, getCartWishKey, isItemInMap } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSyncStore } from "@/app/(core)/hooks/useStore";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { getSqliteProducts, getSqliteFilters } from "@/app/(core)/utils/sqlite/sqliteActions";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";
import { getPricingPolicyParams, getDynamicDesignTableName } from "@/app/(core)/utils/product/pricingPolicy";

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
  initialData,
  initialFilterData,
  initialTotalCount,
} = {}) {
  const storeCtx = useStore();
  const {
    setCartCountNum,
    setWishCountNum,
    islogin,
    cartArr: storeCartArr,
    setCartArr: setStoreCartArr,
    wishArr: storeWishArr,
    setWishArr: setStoreWishArr,
    cartAndWishListRd1: storeCartAndWishListRd1,
    setCartAndWishListRd1: setStoreCartAndWishListRd1,
    fetchGetCountData: storeFetchGetCountData,
    finalId: storeFinalId,
  } = storeCtx;


  const broadcaster = useBroadcaster();
  const broadcast = broadcaster?.broadcast;
  const syncProductList = useSyncStore((state) => state.syncProductList);
  const syncData = useSyncStore((state) => state.syncData);
  const location = usePathname();
  const cookie = Cookies.get("visiterId");

  // Initial SSR Data check
  const initialProducts = initialData?.pdList ?? initialData?.rd ?? [];
  const hasInitialData = Array.isArray(initialProducts) && initialProducts.length > 0;

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
  const isInitialMount = useRef(true);
  const lastLoadedSignatureRef = useRef("");
  const [productListData, setProductListData] = useState(initialProducts);
  const [isProdLoading, setIsProdLoading] = useState(!hasInitialData);
  const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(!hasInitialData);


  // Helper to sanitize and filter out empty filter sections (e.g. empty collections, 0-ranges)
  const sanitizeFilterList = useCallback((list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((item) => {
      if (!item) return false;
      let parsed = [];
      try {
        parsed = typeof item.options === "string" ? JSON.parse(item.options) : item.options;
      } catch (_) {
        parsed = [];
      }
      if (!Array.isArray(parsed) || parsed.length === 0) return false;
      if (item?.id?.includes("Range") || item?.Name?.includes("Range")) {
        const r = parsed[0];
        if (!r || (Number(r.Min || 0) === 0 && Number(r.Max || 0) === 0)) return false;
      }
      return true;
    });
  }, []);

  const [filterData, setFilterData] = useState(() => sanitizeFilterList(initialFilterData || []));
  const [afterFilterCount, setAfterFilterCount] = useState(
    initialTotalCount ?? initialData?.totalCount ?? initialProducts.length
  );
  const [afterCountStatus, setAfterCountStatus] = useState(false);

  // Helper to sync slider ranges from filter definitions
  const updateSlidersFromFilterData = useCallback((data) => {
    if (!Array.isArray(data) || data.length === 0) return;
    try {
      const diaSec = data.find((ele) => ele?.Name === "Diamond" || ele?.id === "Diamond_Weight_Range");
      const diaOpts = diaSec?.options ? JSON.parse(diaSec.options)[0] : null;

      const netSec = data.find((ele) => ele?.Name === "NetWt" || ele?.id === "Net_Weight_Range");
      const netOpts = netSec?.options ? JSON.parse(netSec.options)[0] : null;

      const grossSec = data.find((ele) => ele?.Name === "Gross" || ele?.id === "Gross_Weight_Range");
      const grossOpts = grossSec?.options ? JSON.parse(grossSec.options)[0] : null;

      if (diaOpts?.Min != null || diaOpts?.Max != null) {
        setSliderValue([diaOpts.Min ?? 0, diaOpts.Max ?? 0]);
        setInputDia([diaOpts.Min ?? 0, diaOpts.Max ?? 0]);
      }
      if (netOpts?.Min != null || netOpts?.Max != null) {
        setSliderValue1([netOpts.Min ?? 0, netOpts.Max ?? 0]);
        setInputNet([netOpts.Min ?? 0, netOpts.Max ?? 0]);
      }
      if (grossOpts?.Min != null || grossOpts?.Max != null) {
        setSliderValue2([grossOpts.Min ?? 0, grossOpts.Max ?? 0]);
        setInputGross([grossOpts.Min ?? 0, grossOpts.Max ?? 0]);
      }
    } catch (e) {
      console.warn("Error updating sliders from filterData:", e);
    }
  }, []);

  // Sync filterData with initialFilterData if passed
  useEffect(() => {
    if (Array.isArray(initialFilterData) && initialFilterData.length > 0) {
      const clean = sanitizeFilterList(initialFilterData);
      setFilterData(clean);
      updateSlidersFromFilterData(clean);
    } else if (filterData.length === 0) {
      // Instant SQLite fallback if SSR passed no filters
      const activeTable = Cookies.get("pricing_table_name") || Cookies.get("policy_table");
      const filterParams = activeTable ? { tableName: activeTable } : {};
      getSqliteFilters(filterParams)
        .then((res) => {
          if (res?.success && Array.isArray(res?.rd) && res.rd.length > 0) {
            const clean = sanitizeFilterList(res.rd);
            setFilterData(clean);
            updateSlidersFromFilterData(clean);
          }
        })
        .catch(() => {});
    }
  }, [initialFilterData, filterData.length, sanitizeFilterList, updateSlidersFromFilterData]);

  // Combos
  const [metalTypeCombo, setMetalTypeCombo] = useState(getSession("metalTypeCombo") || []);
  const [diaQcCombo, setDiaQcCombo] = useState(getSession("diamondQualityColorCombo") || []);
  const [csQcCombo, setCsQcCombo] = useState(getSession("ColorStoneQualityColorCombo") || []);
  const [metalColorCombo, setMetalColorCombo] = useState(getSession("MetalColorCombo") || []);

  // Cart & Wishlist Map States (connected to StoreProvider with local fallback)
  const [localCartArr, setLocalCartArr] = useState({});
  const [localWishArr, setLocalWishArr] = useState({});

  const cartArr = storeCartArr !== undefined ? storeCartArr : localCartArr;
  const setCartArr = setStoreCartArr || setLocalCartArr;

  const wishArr = storeWishArr !== undefined ? storeWishArr : localWishArr;
  const setWishArr = setStoreWishArr || setLocalWishArr;

  const effectiveFinalId =
    finalId ||
    storeFinalId ||
    (storeinit?.IsB2BWebsite == 0 && !islogin ? cookie : loginUserDetail?.id) ||
    cookie ||
    "0";

  const syncCartAndWishStates = useCallback(
    (rd1Array = []) => {
      const { newCartObj, newWishObj } = buildCartAndWishMaps(rd1Array);
      setCartArr(newCartObj);
      setWishArr(newWishObj);
      if (setStoreCartAndWishListRd1) {
        setStoreCartAndWishListRd1(rd1Array);
      }
    },
    [setCartArr, setWishArr, setStoreCartAndWishListRd1]
  );

  const fetchGetCountData = useCallback(async () => {
    if (storeFetchGetCountData && effectiveFinalId) {
      return await storeFetchGetCountData(effectiveFinalId);
    }
    if (!effectiveFinalId) return;
    try {
      const res = await GetCountAPI(effectiveFinalId);
      if (res) {
        if (res?.cartcount !== undefined) setCartCountNum(res.cartcount);
        if (res?.wishcount !== undefined) setWishCountNum(res.wishcount);
        if (Array.isArray(res?.rd1)) {
          syncCartAndWishStates(res.rd1);
        }
      }
      return res;
    } catch (err) {
      console.error("fetchGetCountErr in useListingPage:", err);
    }
  }, [storeFetchGetCountData, effectiveFinalId, setCartCountNum, setWishCountNum, syncCartAndWishStates]);

  useEffect(() => {
    if (effectiveFinalId) {
      fetchGetCountData();
    }
  }, [effectiveFinalId, fetchGetCountData]);

  // Sync with broadcast updates from other tabs or components
  useEffect(() => {
    if (syncData?.autocode) {
      const { autocode, ArticleNo, type, status } = syncData;
      const key = String(autocode);
      const unpadded = !isNaN(autocode) ? String(Number(autocode)) : null;
      const preciseKey = ArticleNo ? getCartWishKey({ autocode, ArticleNo }) : null;
      if (type === "cart" || type === "Cart") {
        setCartArr((prev) => {
          const next = { ...prev, [key]: status };
          if (unpadded) next[unpadded] = status;
          if (preciseKey) next[preciseKey] = status;
          return next;
        });
      } else if (type === "wish" || type === "Wish") {
        setWishArr((prev) => {
          const next = { ...prev, [key]: status };
          if (unpadded) next[unpadded] = status;
          if (preciseKey) next[preciseKey] = status;
          return next;
        });
      }
    }
  }, [syncData, setCartArr, setWishArr]);

  // Hover Rollover Image Map
  const [rollOverImgPd, setRolloverImgPd] = useState({});

  // Filter & Pagination States
  const initialPageNo = Number(searchParams?.page || searchParams?.PageNo || 1);
  const [filterChecked, setFilterChecked] = useState({});
  const [currPage, setCurrPage] = useState(initialPageNo);
  const [inputPage, setInputPage] = useState(initialPageNo);
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
        Metalid: selectedMetalId ?? ele?.MetalPurityid ?? ele?.MetalId,
        MetalColorId: ele?.MetalColorid ?? ele?.MetalColorId,
        DiaQCid: selectedDiaId ?? loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid,
        CsQCid: selectedCsId ?? loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid,
        Size: ele?.DefaultSize ?? "",
        Unitcost: ele?.UnitCost,
        markup: ele?.DesignMarkUp,
        UnitCostWithmarkup: ele?.UnitCostWithMarkUp ?? ele?.UnitCostWithmarkup,
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

      const currentInState =
        type === "Cart"
          ? isItemInMap(cartArr, ele, ele?.IsInCart === 1)
          : isItemInMap(wishArr, ele, ele?.IsInWish === 1);

      const isChecked =
        e?.target?.checked !== undefined ? Boolean(e.target.checked) : !currentInState;

      // Precise variant-exact key (autocode|ArticleNo) is the source of truth;
      // it never collides across variants sharing the same autocode.
      const preciseKey = getCartWishKey(ele);
      const keys = [preciseKey].filter(Boolean);

      // Optimistic state update
      keys.forEach((key) => {
        if (type === "Cart") {
          setCartArr((prev) => ({ ...prev, [key]: isChecked }));
        }
        if (type === "Wish") {
          setWishArr((prev) => ({ ...prev, [key]: isChecked }));
        }
      });

      const activeCookie = cookie || Cookies.get("visiterId");

      if (isChecked) {
        CartAndWishListAPI(type, prodObj, activeCookie)
          .then((res) => {
            if (res) {
              const cartC =
                res?.Data?.rd[0]?.Cartlistcount ??
                res?.Data?.rd[0]?.Cartcount ??
                res?.Data?.rd[0]?.cartcount;
              const wishC =
                res?.Data?.rd[0]?.Wishlistcount ??
                res?.Data?.rd[0]?.Wishcount ??
                res?.Data?.rd[0]?.wishcount;
              if (wishC !== undefined) setWishCountNum(wishC);
              if (cartC !== undefined) setCartCountNum(cartC);
              if (broadcast) {
                if (type === "Cart") {
                  broadcast("UPDATE_CART_COUNT", cartC, prodObj?.autocode, "cart", true, prodObj?.ArticleNo);
                } else {
                  broadcast("UPDATE_WISH_COUNT", wishC, prodObj?.autocode, "wish", true, prodObj?.ArticleNo);
                }
              }
              fetchGetCountData();
            }
          })
          .catch((err) => {
            console.error("addtocartwishErr", err);
            // Revert on failure
            keys.forEach((key) => {
              if (type === "Cart") setCartArr((prev) => ({ ...prev, [key]: !isChecked }));
              if (type === "Wish") setWishArr((prev) => ({ ...prev, [key]: !isChecked }));
            });
          });
      } else {
        RemoveCartAndWishAPI(
          type,
          ele?.autocode || "",
          activeCookie,
          false,
          "",
          ele?.ArticleNo || ""
        )
          .then((res1) => {
            if (res1) {
              const cartC =
                res1?.Data?.rd[0]?.Cartlistcount ??
                res1?.Data?.rd[0]?.Cartcount ??
                res1?.Data?.rd[0]?.cartcount;
              const wishC =
                res1?.Data?.rd[0]?.Wishlistcount ??
                res1?.Data?.rd[0]?.Wishcount ??
                res1?.Data?.rd[0]?.wishcount;
              if (wishC !== undefined) setWishCountNum(wishC);
              if (cartC !== undefined) setCartCountNum(cartC);
              if (broadcast) {
                if (type === "Cart") {
                  broadcast("UPDATE_CART_COUNT", cartC, prodObj?.autocode, "cart", false, prodObj?.ArticleNo);
                } else {
                  broadcast("UPDATE_WISH_COUNT", wishC, prodObj?.autocode, "wish", false, prodObj?.ArticleNo);
                }
              }
              fetchGetCountData();
            }
          })
          .catch((err) => {
            console.error("removecartwishErr", err);
            // Revert on failure
            keys.forEach((key) => {
              if (type === "Cart") setCartArr((prev) => ({ ...prev, [key]: !isChecked }));
              if (type === "Wish") setWishArr((prev) => ({ ...prev, [key]: !isChecked }));
            });
          });
      }
    },
    [
      selectedMetalId,
      selectedDiaId,
      selectedCsId,
      cookie,
      loginUserDetail,
      storeinit,
      cartArr,
      wishArr,
      setCartCountNum,
      setWishCountNum,
      setCartArr,
      setWishArr,
      broadcast,
      fetchGetCountData,
    ]
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

  const getPageFromUrlOrProps = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get("page") || urlParams.get("PageNo");
        if (p && !isNaN(Number(p))) return Number(p);
      } catch (_) {}
    }
    return Number(searchParams?.page || searchParams?.PageNo || 1);
  }, [searchParams]);

  const resetUrlPage = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("page") || url.searchParams.has("PageNo")) {
          url.searchParams.delete("page");
          url.searchParams.delete("PageNo");
          window.history.replaceState({}, "", url.toString());
        }
      } catch (_) {}
    }
  }, []);

  const getOnlyCheckedFilters = useCallback(() => {
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

    return output;
  }, [filterChecked]);

  const FilterValueWithCheckedOnly = useCallback(() => {
    const output = getOnlyCheckedFilters();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("key", JSON.stringify(output));
    }
    return output;
  }, [getOnlyCheckedFilters]);

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
      resetUrlPage();
    }
  }, [filterData, filterChecked, sliderValue, sliderValue1, sliderValue2, priceRangeValue, resetUrlPage]);

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
  // 6. Direct SQLite Filter Query Engine
  // ----------------------------------------------------
  // 6. Direct SQLite Filter Query Engine
  // ----------------------------------------------------
  const fetchProductsFromSqlite = useCallback(
    async ({
      targetPage = 1,
      outputFilters = getOnlyCheckedFilters(),
      diaVal = sliderValue,
      grossVal = sliderValue2,
      netVal = sliderValue1,
      sortVal = sortBySelect,
      priceVal = priceRangeValue,
    } = {}) => {
      setIsOnlyProdLoading(true);

      const DiaRange = parseRangeData(filterData, "Dia", diaVal, inputDia);
      const grossRange = parseRangeData(filterData, "Gross", grossVal, inputGross);
      const netRange = parseRangeData(filterData, "net", netVal, inputNet);

      const menuIdent =
        (typeof window !== "undefined" && window.location?.pathname?.replace(/^\/p\//, "").replace(/\/+$/, "")) ||
        "default";

      const savedMenu = getSession("menuparams");
      const targetQuery = (savedMenu && (savedMenu.FilterKey || savedMenu.FilterKey1 || savedMenu.FilterKey2))
        ? savedMenu
        : (prodListType || searchParams || menuIdent);

      const policyParams = getPricingPolicyParams({
        storeinit,
        loginUserDetail,
        islogin,
      });

      const queryPayload = {
        ...policyParams,
        ...(typeof targetQuery === "object" && !Array.isArray(targetQuery) ? targetQuery : {}),
        ...(typeof outputFilters === "object" ? outputFilters : {}),
        Collectionid: outputFilters?.collection,
        Categoryid: outputFilters?.category,
        SubCategoryid: outputFilters?.subcategory,
        Brandid: outputFilters?.brand,
        Genderid: outputFilters?.gender,
        Ocassionid: outputFilters?.ocassion,
        Themeid: outputFilters?.theme,
        Producttypeid: outputFilters?.producttype,
        MetalColorid: outputFilters?.metalcolor,
        FilPrice: outputFilters?.Price,
        priceMin: priceVal?.[0] || outputFilters?.PriceMin || undefined,
        priceMax: priceVal?.[1] || outputFilters?.PriceMax || undefined,
        grossMin: grossRange?.grossMin || undefined,
        grossMax: grossRange?.grossMax || undefined,
        netMin: netRange?.netMin || undefined,
        netMax: netRange?.netMax || undefined,
        diaMin: DiaRange?.DiaMin || undefined,
        diaMax: DiaRange?.DiaMax || undefined,
        sortBy: sortVal || undefined,
        // Pagination — always last so nothing overwrites these
        page: targetPage,
        PageNo: targetPage,
        pageSize: storeinit?.PageSize || 10,
        PageSize: storeinit?.PageSize || 10,
      };

      if (Array.isArray(targetQuery) && targetQuery.length >= 2) {
        targetQuery[0].forEach((k, idx) => {
          if (k && targetQuery[1]?.[idx]) queryPayload[k] = targetQuery[1][idx];
        });
      } else if (typeof targetQuery === "string" && targetQuery) {
        queryPayload.M = targetQuery;
      }

      const activeTable = Cookies.get("pricing_table_name") || Cookies.get("policy_table");
      if (activeTable) {
        queryPayload.tableName = activeTable;
      }

      try {
        const sqliteRes = await getSqliteProducts(
          typeof targetQuery === "string" ? targetQuery : queryPayload,
          queryPayload,
          undefined
        );
        if (sqliteRes?.success) {
          setProductListData(sqliteRes.rd || []);
          setAfterFilterCount(sqliteRes.totalCount || 0);
          setCurrPage(targetPage);
          setInputPage(targetPage);
          return sqliteRes;
        }
      } catch (sqlErr) {
        console.warn("[SQLite] Filter query failed:", sqlErr);
      } finally {
        setIsOnlyProdLoading(false);
        setIsProdLoading(false);
        setIsClearAllClicked(false);
      }
      return null;
    },
    [
      getOnlyCheckedFilters,
      filterData,
      inputDia,
      inputGross,
      inputNet,
      prodListType,
      searchParams,
      sliderValue,
      sliderValue1,
      sliderValue2,
      sortBySelect,
      priceRangeValue,
      storeinit,
      loginUserDetail,
      islogin,
    ]
  );

  // ----------------------------------------------------
  // 6. Pagination & Page Change Handler
  // ----------------------------------------------------
  const handelPageChange = useCallback(
    async (event, value) => {
      const targetPage = Number(value) || 1;
      let output = getOnlyCheckedFilters();
      setIsOnlyProdLoading(true);
      setCurrPage(targetPage);
      setInputPage(targetPage);

      // 1. Sync URL so ?page=X persists and survives browser refresh
      if (typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          if (targetPage > 1) {
            url.searchParams.set("page", targetPage);
          } else {
            url.searchParams.delete("page");
            url.searchParams.delete("PageNo");
          }
          window.history.replaceState({ page: targetPage }, "", url.toString());
        } catch (urlErr) {
          console.error("URL update error:", urlErr);
        }
      }

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scroll({ top: 0, behavior: "smooth" });
        }
      }, 100);

      const inputPriceField = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);
      if (inputPriceField) {
        output = { ...output, PriceMin: priceRangeValue[0], PriceMax: priceRangeValue[1] };
      }

      await fetchProductsFromSqlite({ targetPage, outputFilters: output });

      /* Commented out ProductListApi as requested
      ProductListApi(
        output,
        targetPage,
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
          }
          return res;
        })
        .catch(console.error)
        .finally(() => {
          setIsOnlyProdLoading(false);
        });
      */
    },
    [
      getOnlyCheckedFilters,
      fetchProductsFromSqlite,
      priceRangeValue,
    ]
  );

  // ----------------------------------------------------
  // 7. Range Filter API Handlers
  // ----------------------------------------------------
  const handleRangeFilterApi = useCallback(
    async (Rangeval) => {
      let output = FilterValueWithCheckedOnly();
      setCurrPage(1);
      setInputPage(1);
      resetUrlPage();

      await fetchProductsFromSqlite({ targetPage: 1, outputFilters: output, diaVal: Rangeval });

      /* Commented out ProductListApi as requested
      ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange);
      */
    },
    [
      FilterValueWithCheckedOnly,
      fetchProductsFromSqlite,
      resetUrlPage,
    ]
  );

  const handleRangeFilterApi1 = useCallback(
    async (Rangeval1) => {
      let output = FilterValueWithCheckedOnly();
      setCurrPage(1);
      setInputPage(1);
      resetUrlPage();

      await fetchProductsFromSqlite({ targetPage: 1, outputFilters: output, netVal: Rangeval1 });

      /* Commented out ProductListApi as requested
      ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange);
      */
    },
    [
      FilterValueWithCheckedOnly,
      fetchProductsFromSqlite,
      resetUrlPage,
    ]
  );

  const handleRangeFilterApi2 = useCallback(
    async (Rangeval2) => {
      let output = FilterValueWithCheckedOnly();
      setCurrPage(1);
      setInputPage(1);
      resetUrlPage();

      await fetchProductsFromSqlite({ targetPage: 1, outputFilters: output, grossVal: Rangeval2 });

      /* Commented out ProductListApi as requested
      ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange);
      */
    },
    [
      FilterValueWithCheckedOnly,
      fetchProductsFromSqlite,
      resetUrlPage,
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
      setCurrPage(1);
      setInputPage(1);
      resetUrlPage();

      let output = FilterValueWithCheckedOnly();

      const inputPriceField = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);
      if (inputPriceField) {
        output = { ...output, PriceMin: priceRangeValue[0], PriceMax: priceRangeValue[1] };
      }

      await fetchProductsFromSqlite({ targetPage: 1, outputFilters: output, sortVal: sortby });

      /* Commented out ProductListApi as requested
      ProductListApi(output, 1, obj, prodListType, cookie, sortby, DiaRange, netRange, grossRange);
      */
    },
    [
      FilterValueWithCheckedOnly,
      fetchProductsFromSqlite,
      priceRangeValue,
      resetUrlPage,
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

    const hasCollection = UrlVal.some((ele) => ele.toLowerCase().includes("collection"));
    const NewArrivalVar = UrlVal.find((ele) => ele.split("=")[0] === "N");
    const TrendingVar = UrlVal.find((ele) => ele.split("=")[0] === "T");
    const BestSellerVar = UrlVal.find((ele) => ele.split("=")[0] === "B");
    const AlbumVar = UrlVal.find((ele) => ele.split("=")[0] === "A");

    if (hasCollection) {
      productlisttype = "collection";
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
    } else {
      UrlVal.forEach((ele) => {
        if (typeof ele !== "string") return;
        let firstChar = ele.charAt(0);
        switch (firstChar) {
          case "M":
            MenuVal = ele;
            break;
          case "S":
            SearchVar = ele;
            break;
          default:
            break;
        }
      });
      if (MenuVal.length > 0) {
        try {
          const rawB64 = MenuVal.split("=")[1];
          const menuDecode = atob(decodeURIComponent(rawB64));
          if (menuDecode.includes("/")) {
            const [valPart, keyPart] = menuDecode.split("/");
            const key = keyPart.split(",").map((s) => s.trim().replace(/[^a-zA-Z0-9_]/g, "")).filter(Boolean);
            const val = valPart.split(",").map((s) => s.trim().replace(/%20/g, " ")).filter(Boolean);
            productlisttype = [key, val];
            setDetailsMenu(productlisttype);
          }
        } catch (_) {}
      } else if (SearchVar) {
        productlisttype = SearchVar;
        setDetailsMenu(productlisttype);
      }
    }

    setProdListType(productlisttype);

    const effectiveSortBy = NewArrivalVar
      ? "New"
      : hasCollection
      ? "Design Set"
      : sortBySelect ?? "Recommended";

    setTrend(effectiveSortBy);

    const policyParams = getPricingPolicyParams({
      storeinit,
      loginUserDetail,
      islogin,
    });
    const candidateTable = getDynamicDesignTableName(policyParams);
    const initialPage = getPageFromUrlOrProps();
    const currentQuerySig = JSON.stringify({
      table: candidateTable,
      page: initialPage,
      sort: effectiveSortBy,
      loc: location,
      menu: productlisttype,
    });

    if (isInitialMount.current) {
      isInitialMount.current = false;
      const initialTable = initialData?.targetTable || "";
      const isInitialMatch = hasInitialData && (
        !initialTable ||
        initialTable.toLowerCase() === candidateTable.toLowerCase() ||
        (!policyParams.isLoggedIn && initialTable.toLowerCase().includes(String(policyParams.Laboursetid)))
      );

      if (isInitialMatch) {
        lastLoadedSignatureRef.current = currentQuerySig;
        setIsProdLoading(false);
        setIsOnlyProdLoading(false);
        return;
      }
    } else if (lastLoadedSignatureRef.current === currentQuerySig && productListData?.length > 0) {
      // Data with identical parameters already loaded, avoid redundant Server Action
      setIsProdLoading(false);
      setIsOnlyProdLoading(false);
      return;
    }

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

        // --- Read/Write Cache commented out in favor of SQLite ---
        // let cachedRes = null;
        // if (cacheKey) {
        //   try {
        //     const diskCached = await readCache(cacheKey);
        //     if (diskCached?.cached && diskCached.data?.pdList) {
        //       cachedRes = diskCached.data;
        //     }
        //   } catch (_) {}
        // }

        // 1. Fetch directly from SQLite on our server with pagination
        const menuIdent =
          (typeof window !== "undefined" && window.location?.pathname?.replace(/^\/p\//, "").replace(/\/+$/, "")) ||
          "default";

        const initialPage = getPageFromUrlOrProps();

        const savedMenu = getSession("menuparams");
        const targetQuery = (savedMenu && (savedMenu.FilterKey || savedMenu.FilterKey1 || savedMenu.FilterKey2))
          ? savedMenu
          : (productlisttype || searchParams || menuIdent);

        const policyParams = getPricingPolicyParams({
          storeinit,
          loginUserDetail,
          islogin,
        });

        const queryPayload = {
          ...policyParams,
          ...(typeof targetQuery === "object" && !Array.isArray(targetQuery) ? targetQuery : {}),
          sortBy: effectiveSortBy,
          page: initialPage,
          pageSize: storeinit?.PageSize || 10,
        };

        if (Array.isArray(targetQuery) && targetQuery.length >= 2) {
          targetQuery[0].forEach((k, idx) => {
            if (k && targetQuery[1]?.[idx]) queryPayload[k] = targetQuery[1][idx];
          });
        } else if (typeof targetQuery === "string" && targetQuery) {
          queryPayload.M = targetQuery;
        }

        const activeTable = Cookies.get("pricing_table_name") || Cookies.get("policy_table");
        if (activeTable) {
          queryPayload.tableName = activeTable;
        }

        let sqliteLoaded = false;
        try {
          const sqliteRes = await getSqliteProducts(
            typeof targetQuery === "string" ? targetQuery : queryPayload,
            queryPayload,
            undefined
          );
          if (sqliteRes?.success) {
            setProductListData(sqliteRes.rd || []);
            setAfterFilterCount(sqliteRes.totalCount || 0);
            setCurrPage(initialPage);
            setInputPage(initialPage);
            setIsProdLoading(false);
            setIsOnlyProdLoading(false);
            sqliteLoaded = true;
            lastLoadedSignatureRef.current = currentQuerySig;
          }
        } catch (sqlErr) {
          console.warn("[SQLite] Fetch failed:", sqlErr);
        }

        // 2. Fetch Filter Sidebar Options (ensure full filters from SQLite)
        if (!filterData || filterData.length <= 2) {
          try {
            const cachedFilters = getSession("AllFilter");
            if (Array.isArray(cachedFilters) && cachedFilters.length > 2) {
              const cleanFilters = sanitizeFilterList(cachedFilters);
              setFilterData(cleanFilters);
              updateSlidersFromFilterData(cleanFilters);
            } else {
              const sqliteFilterRes = await getSqliteFilters(queryPayload, {}, undefined);
              if (sqliteFilterRes?.success && Array.isArray(sqliteFilterRes.rd) && sqliteFilterRes.rd.length > 0) {
                const cleanFilters = sanitizeFilterList(sqliteFilterRes.rd);
                setFilterData(cleanFilters);
                updateSlidersFromFilterData(cleanFilters);
                setSession("AllFilter", sqliteFilterRes.rd);
              } else {
                const resFilters = await FilterListAPI(productlisttype || searchParams, cookie);
                if (Array.isArray(resFilters) && resFilters.length > 0) {
                  const cleanFilters = sanitizeFilterList(resFilters);
                  setFilterData(cleanFilters);
                  updateSlidersFromFilterData(cleanFilters);
                }
              }
            }
          } catch (filterErr) {
            console.error("FilterList fetching error in useListingPage:", filterErr);
          }
        }
      } catch (err) {
        console.error("useListingPage fetchData error:", err);
      } finally {
        setIsProdLoading(false);
        setIsOnlyProdLoading(false);
      }
    };

    fetchData();
  }, [
    location,
    JSON.stringify(result),
    syncProductList?.ts,
    loginUserDetail?.pricemanagement_laboursetid,
    loginUserDetail?.diamondpricelistname,
    islogin,
  ]);

  // ----------------------------------------------------
  // 10. Filter Checkbox Change Effect (Debounced)
  // ----------------------------------------------------
  const isFilterMount = useRef(true);
  useEffect(() => {
    if (isFilterMount.current) {
      isFilterMount.current = false;
      return;
    }
    if (Object.keys(filterChecked).length === 0 && !isClearAllClicked) return;

    const timer = setTimeout(async () => {
      let output = getOnlyCheckedFilters();

      const inputPriceField = JSON.stringify(priceRangeValue) !== JSON.stringify(["", ""]);
      if (inputPriceField && !output?.Price?.length) {
        output = { ...output, PriceMin: priceRangeValue[0], PriceMax: priceRangeValue[1] };
      }

      setCurrPage(1);
      setInputPage(1);
      resetUrlPage();

      await fetchProductsFromSqlite({ targetPage: 1, outputFilters: output });

      /* Commented out ProductListApi as requested
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
      */
    }, 300);

    return () => clearTimeout(timer);
  }, [filterChecked, isClearAllClicked, priceRangeValue]);

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
    cartAndWishListRd1: storeCartAndWishListRd1,
    fetchGetCountData,
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