'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./ProductList.modul.scss";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Checkbox,
  Drawer,
  FormControlLabel,
  Input,
  Pagination,
  PaginationItem,
  Skeleton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Cookies from "js-cookie";
import Pako from "pako";
import _ from "lodash";
import debounce from "lodash.debounce";

import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import ProductListSkeleton from "./productlist_skeleton/ProductListSkeleton";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { formatRedirectTitleLine, formatTitleLine, formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useSyncDataStore, useSyncStore } from "@/app/(core)/hooks/useStore";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { usePathname, useSearchParams } from "next/navigation";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";

// ─────────────────────────────────────────────────────────────────────────────
// ProductList
// ─────────────────────────────────────────────────────────────────────────────
const ProductList = ({ storeinit, searchParams, params }) => {
  const { setCartCountNum, setWishCountNum, loginUserDetail } = useStore();
  const location = usePathname();
  let cookie = Cookies.get("visiterId");
  const navigate = useNextRouterLikeRR();
  const syncProductList = useSyncStore((state) => state.syncProductList);
  const searchParamsHook = useSearchParams();
  const { broadcast } = useBroadcaster();
  const lastSyncData = useSyncDataStore((s) => s.syncData);

  useGlobalPreventSave();

  // ── layout flags (mirrors maxwidth1483 from old project) ─────────────────
  let maxwidth1483 = useMediaQuery("(max-width:1483px)");
  let maxwidth464px = useMediaQuery("(max-width:464px)");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ── combo state ───────────────────────────────────────────────────────────
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [diaQcCombo, setDiaQcCombo] = useState([]);
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [selectedMetalId, setSelectedMetalId] = useState(loginUserDetail?.MetalId);
  const [selectedDiaId, setSelectedDiaId] = useState(loginUserDetail?.cmboDiaQCid);
  const [selectedCsId, setSelectedCsId] = useState(loginUserDetail?.cmboCSQCid);
  const [customFlag, setCustomFlag] = useState(false);

  // ── product / filter state ────────────────────────────────────────────────
  const [IsBreadCumShow, setIsBreadcumShow] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const [finalProductListData, setFinalProductListData] = useState([]);
  const [filterChecked, setFilterChecked] = useState({});
  const [prodListType, setprodListType] = useState();
  const [isProdLoading, setIsProdLoading] = useState(true);
  const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
  const [locationKey, setLocationKey] = useState();
  const [sortBySelect, setSortBySelect] = useState("Recommended");
  const [filterData, setFilterData] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [afterFilterCount, setAfterFilterCount] = useState();
  const [afterCountStatus, setAfterCountStatus] = useState(false);
  const [filterProdListEmpty, setFilterProdListEmpty] = useState(false);
  const [cartArr, setCartArr] = useState({});
  const [wishArr, setWishArr] = useState({});
  const [inputPage, setInputPage] = useState(1);
  const [menuData, setMenuData] = useState();
  const [isReset, setIsReset] = useState(false);

  // ── slider / price range state ────────────────────────────────────────────
  const [sliderValue, setSliderValue] = useState([]);
  const [sliderValue1, setSliderValue1] = useState([]);
  const [sliderValue2, setSliderValue2] = useState([]);
  const [inputDia, setInputDia] = useState([]);
  const [inputNet, setInputNet] = useState([]);
  const [inputGross, setInputGross] = useState([]);
  const [priceRangeValue, setPriceRangeValue] = useState(["", ""]);
  const [inputPrice, setInputPrice] = useState(["", ""]);
  const [highestPrice, setHighestPrice] = useState();
  const [lowestPrice, setLowestPrice] = useState();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [appliedRange1, setAppliedRange1] = useState(null);
  const [appliedRange2, setAppliedRange2] = useState(null);
  const [appliedRange3, setAppliedRange3] = useState(null);

  // ── image helpers ─────────────────────────────────────────────────────────
  const getDesignImageFol = storeinit?.CDNDesignImageFolThumb;
  const getDesignVideoFol = storeinit?.CDNVPath;

  const getDynamicImages = (designno) =>
    `${getDesignImageFol}${designno}~1.jpg`;

  const getDynamicRollImages = (designno, count) =>
    count > 1 ? `${getDesignImageFol}${designno}~2.jpg` : undefined;

  const getDynamicVideo = (designno, count, extension) =>
    extension && count > 0
      ? `${getDesignVideoFol}${designno}~1.${extension}`
      : undefined;

  const generateImageList = useCallback(
    (product) => {
      const pdImgList = [];
      if (product?.ImageCount > 0) {
        for (let i = 1; i <= product.ImageCount; i++) {
          pdImgList.push(
            `${storeinit?.CDNDesignImageFolThumb}${product.designno}~${i}.jpg`
          );
        }
      } else {
        pdImgList.push("/image-not-found.jpg");
      }
      return pdImgList;
    },
    [storeinit]
  );

  // ── sync finalProductListData with images ─────────────────────────────────
  useEffect(() => {
    const initial = productListData?.map((p) => ({ ...p, images: [], loading: true }));
    setFinalProductListData(initial);
    const timer = setTimeout(() => {
      setFinalProductListData(
        productListData?.map((p) => ({ ...p, images: generateImageList(p), loading: false }))
      );
    }, 1);
    return () => clearTimeout(timer);
  }, [productListData, generateImageList]);

  // ── empty-state flag ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!productListData?.length) {
      setFilterProdListEmpty(true);
    } else {
      setFilterProdListEmpty(false);
      setAfterCountStatus(false);
    }
  }, [productListData]);

  // ── helpers ───────────────────────────────────────────────────────────────
  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (e) {
      console.error("compressAndEncode error:", e);
      return null;
    }
  };

  // ── parse URL search params ───────────────────────────────────────────────
  let result = ParseAndDecodeSearchParams(searchParams);

  // ── init selected IDs ─────────────────────────────────────────────────────
  useEffect(() => {
    if (loginUserDetail && Object.keys(loginUserDetail ?? {}).length > 0) {
      setSelectedMetalId(loginUserDetail?.MetalId);
      setSelectedDiaId(loginUserDetail?.cmboDiaQCid);
      setSelectedCsId(loginUserDetail?.cmboCSQCid);
    } else {
      setSelectedMetalId(storeinit?.MetalId);
      setSelectedDiaId(storeinit?.cmboDiaQCid);
      setSelectedCsId(storeinit?.cmboCSQCid);
    }
  }, []);

  // ── combo APIs (session cache) ────────────────────────────────────────────
  const callAllApi = () => {
    const mtLocal = getSession("metalTypeCombo");
    if (!mtLocal || mtLocal.length === 0) {
      MetalTypeComboAPI(cookie)
        .then((res) => {
          if (res?.Data?.rd) {
            sessionStorage.setItem("metalTypeCombo", JSON.stringify(res.Data.rd));
            setMetalTypeCombo(res.Data.rd);
          }
        })
        .catch(console.log);
    } else {
      setMetalTypeCombo(mtLocal);
    }

    const diaLocal = getSession("diamondQualityColorCombo");
    if (!diaLocal || diaLocal.length === 0) {
      DiamondQualityColorComboAPI()
        .then((res) => {
          if (res?.Data?.rd) {
            sessionStorage.setItem("diamondQualityColorCombo", JSON.stringify(res.Data.rd));
            setDiaQcCombo(res.Data.rd);
          }
        })
        .catch(console.log);
    } else {
      setDiaQcCombo(diaLocal);
    }

    const csLocal = getSession("ColorStoneQualityColorCombo");
    if (!csLocal || csLocal.length === 0) {
      ColorStoneQualityColorComboAPI()
        .then((res) => {
          if (res?.Data?.rd) {
            sessionStorage.setItem("ColorStoneQualityColorCombo", JSON.stringify(res.Data.rd));
            setCsQcCombo(res.Data.rd);
          }
        })
        .catch(console.log);
    } else {
      setCsQcCombo(csLocal);
    }

    const mtColorLocal = getSession("MetalColorCombo");
    if (!mtColorLocal || mtColorLocal.length === 0) {
      MetalColorCombo()
        .then((res) => {
          if (res?.Data?.rd) {
            sessionStorage.setItem("MetalColorCombo", JSON.stringify(res.Data.rd));
          }
        })
        .catch(console.log);
    }
  };

  useEffect(() => { callAllApi(); }, [loginUserDetail]);

  // ── filter helpers ────────────────────────────────────────────────────────
  const getFilterOpts = (name) => {
    const raw = filterData?.filter((e) => e?.Name === name)[0]?.options;
    return raw?.length > 0 ? JSON.parse(raw)[0] : [];
  };

  const buildRanges = () => {
    const diafilter = getFilterOpts("Diamond");
    const diafilter1 = getFilterOpts("NetWt");
    const diafilter2 = getFilterOpts("Gross");
    const isDia   = JSON.stringify(sliderValue)  !== JSON.stringify([diafilter?.Min,  diafilter?.Max]);
    const isNet   = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);
    return {
      DiaRange:   { DiaMin:   isDia   ? sliderValue[0]  ?? "" : "", DiaMax:   isDia   ? sliderValue[1]  ?? "" : "" },
      netRange:   { netMin:   isNet   ? sliderValue1[0] ?? "" : "", netMax:   isNet   ? sliderValue1[1] ?? "" : "" },
      grossRange: { grossMin: isGross ? sliderValue2[0] ?? "" : "", grossMax: isGross ? sliderValue2[1] ?? "" : "" },
    };
  };

  const FilterValueWithCheckedOnly = () => {
    const onlyTrue = Object.values(filterChecked).filter((e) => e.checked);
    const priceValues = onlyTrue.filter((i) => i.type === "Price").map((i) => i.value);
    const output = {};
    onlyTrue.forEach((item) => {
      if (!output[item.type]) output[item.type] = "";
      if (item.type === "Price") { output["Price"] = priceValues; return; }
      output[item.type] += `${item.id}, `;
    });
    for (const key in output) {
      if (key !== "Price") output[key] = output[key].slice(0, -2);
    }
    setCurrPage(1);
    setInputPage(1);
    return output;
  };

  const showClearAllButton = () => {
    const d = getFilterOpts("Diamond"), n = getFilterOpts("NetWt"), g = getFilterOpts("Gross");
    const isFilterChecked = Object.values(filterChecked).some((e) => e.checked);
    const isSliderChanged =
      JSON.stringify(sliderValue)  !== JSON.stringify([d?.Min, d?.Max]) ||
      JSON.stringify(sliderValue1) !== JSON.stringify([n?.Min, n?.Max]) ||
      JSON.stringify(sliderValue2) !== JSON.stringify([g?.Min, g?.Max]);
    return isFilterChecked || isSliderChanged;
  };

  // ── menu label ────────────────────────────────────────────────────────────
  let menuList = getSession("menuparams");

  const handleLabelMenuName = () => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    switch (search.charAt(1)) {
      case "A": return "ALBUM";
      case "T": return "TRENDING";
      case "B": return "BEST SELLER";
      case "N": return "NEW ARRIVAL";
      default:  return menuList?.menuname;
    }
  };

  // ── main fetchData ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
      const UrlVal = Array.isArray(result) ? result : [];
      let MenuVal = "", SearchVar = "", TrendingVar = "", NewArrivalVar = "", BestSellerVar = "", AlbumVar = "";
      let productlisttype;

      UrlVal.forEach((ele) => {
        switch (ele?.charAt(0)) {
          case "M": MenuVal       = ele; break;
          case "S": SearchVar     = ele; break;
          case "T": TrendingVar   = ele; break;
          case "N": NewArrivalVar = ele; break;
          case "B": BestSellerVar = ele; break;
          case "A": AlbumVar      = ele; break;
        }
      });

      if (MenuVal?.length > 0) {
        const menuDecode = atob(MenuVal.split("=")[1]);
        const key = menuDecode.split("/")[1].split(",");
        const val = menuDecode.split("/")[0].split(",");
        setIsBreadcumShow(true);
        productlisttype = [key, val];
      }
      if (SearchVar)     productlisttype = SearchVar;
      if (TrendingVar)   productlisttype = TrendingVar.split("=")[1];
      if (NewArrivalVar) productlisttype = NewArrivalVar.split("=")[1];
      if (BestSellerVar) productlisttype = BestSellerVar.split("=")[1];
      if (AlbumVar)      productlisttype = AlbumVar.split("=")[1];

      setIsProdLoading(true);
      setprodListType(productlisttype);

      const { DiaRange, netRange, grossRange } = buildRanges();

      await ProductListApi({}, 1, obj, productlisttype, cookie, sortBySelect, DiaRange, netRange, grossRange)
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          }
          return res;
        })
        .then(async (res) => {
          if (res) {
            await FilterListAPI(productlisttype, cookie)
              .then((res1) => {
                setFilterData(res1);
                const df  = res1?.filter((e) => e?.Name === "Diamond")[0]?.options?.length > 0 ? JSON.parse(res1.filter((e) => e?.Name === "Diamond")[0].options)[0] : [];
                const df1 = res1?.filter((e) => e?.Name === "NetWt")[0]?.options?.length  > 0 ? JSON.parse(res1.filter((e) => e?.Name === "NetWt")[0].options)[0]   : [];
                const df2 = res1?.filter((e) => e?.Name === "Gross")[0]?.options?.length  > 0 ? JSON.parse(res1.filter((e) => e?.Name === "Gross")[0].options)[0]   : [];
                setSliderValue([df?.Min,  df?.Max]);
                setSliderValue1([df1?.Min, df1?.Max]);
                setSliderValue2([df2?.Min, df2?.Max]);
              })
              .catch(console.log);
          }
        })
        .finally(() => {
          setIsProdLoading(false);
          setIsOnlyProdLoading(false);
        })
        .catch(console.log);
    };

    fetchData();
    if (location) setLocationKey(location);
    setCurrPage(1);
    setInputPage(1);
  }, [location]);

  // ── filter checkbox effect ────────────────────────────────────────────────
  useEffect(() => {
    setAfterCountStatus(true);
    const output = FilterValueWithCheckedOnly();
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    const { DiaRange, netRange, grossRange } = buildRanges();

    if (location === locationKey) {
      setIsOnlyProdLoading(true);
      ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
            setAfterCountStatus(false);
          }
        })
        .catch(console.log)
        .finally(() => {
          setIsOnlyProdLoading(false);
          window.scroll({ top: 0, behavior: "smooth" });
        });
    }
  }, [filterChecked]);

  // ── sync cart/wish from broadcast ─────────────────────────────────────────
  useEffect(() => {
    if (lastSyncData?.autocode) {
      const { autocode, type, status } = lastSyncData;
      if (type === "cart") setCartArr((p) => ({ ...p, [autocode]: status }));
      else if (type === "wish") setWishArr((p) => ({ ...p, [autocode]: status }));
    }
  }, [lastSyncData]);

  // ── clear all on navigation ───────────────────────────────────────────────
  useEffect(() => { handelFilterClearAll(); }, [location]);
  useEffect(() => { setSortBySelect("Recommended"); }, [location]);

  // ── range filter API calls ────────────────────────────────────────────────
  const handleRangeFilterApi = async (Rangeval) => {
    setIsOnlyProdLoading(true);
    setAfterCountStatus(true);
    const output = FilterValueWithCheckedOnly();
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    const diafilter  = getFilterOpts("Diamond");
    const diafilter1 = getFilterOpts("NetWt");
    const diafilter2 = getFilterOpts("Gross");
    const isDia   = JSON.stringify(Rangeval)     !== JSON.stringify([diafilter?.Min,  diafilter?.Max]);
    const isNet   = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    const DiaRange   = { DiaMin:   isDia   ? Rangeval[0]     ?? "" : "", DiaMax:   isDia   ? Rangeval[1]     ?? "" : "" };
    const netRange   = { netMin:   isNet   ? sliderValue1[0] ?? "" : "", netMax:   isNet   ? sliderValue1[1] ?? "" : "" };
    const grossRange = { grossMin: isGross ? sliderValue2[0] ?? "" : "", grossMax: isGross ? sliderValue2[1] ?? "" : "" };

    await ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setAfterCountStatus(false);
        }
      })
      .catch(console.log)
      .finally(() => { setIsOnlyProdLoading(false); setAfterCountStatus(false); });
  };

  const handleRangeFilterApi1 = async (Rangeval1) => {
    setIsOnlyProdLoading(true);
    setAfterCountStatus(true);
    const output = FilterValueWithCheckedOnly();
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    const diafilter  = getFilterOpts("Diamond");
    const diafilter1 = getFilterOpts("NetWt");
    const diafilter2 = getFilterOpts("Gross");
    const isDia   = JSON.stringify(sliderValue)  !== JSON.stringify([diafilter?.Min,  diafilter?.Max]);
    const isNet   = JSON.stringify(Rangeval1)    !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    const DiaRange   = { DiaMin:   isDia   ? sliderValue[0]  ?? "" : "", DiaMax:   isDia   ? sliderValue[1]  ?? "" : "" };
    const netRange   = { netMin:   isNet   ? Rangeval1[0]    ?? "" : "", netMax:   isNet   ? Rangeval1[1]    ?? "" : "" };
    const grossRange = { grossMin: isGross ? sliderValue2[0] ?? "" : "", grossMax: isGross ? sliderValue2[1] ?? "" : "" };

    await ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setAfterCountStatus(false);
        }
      })
      .catch(console.log)
      .finally(() => { setIsOnlyProdLoading(false); setAfterCountStatus(false); });
  };

  const handleRangeFilterApi2 = async (Rangeval2) => {
    setIsOnlyProdLoading(true);
    setAfterCountStatus(true);
    const output = FilterValueWithCheckedOnly();
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    const diafilter  = getFilterOpts("Diamond");
    const diafilter1 = getFilterOpts("NetWt");
    const diafilter2 = getFilterOpts("Gross");
    const isDia   = JSON.stringify(sliderValue)  !== JSON.stringify([diafilter?.Min,  diafilter?.Max]);
    const isNet   = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross = JSON.stringify(Rangeval2)    !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    const DiaRange   = { DiaMin:   isDia   ? sliderValue[0]  ?? "" : "", DiaMax:   isDia   ? sliderValue[1]  ?? "" : "" };
    const netRange   = { netMin:   isNet   ? sliderValue1[0] ?? "" : "", netMax:   isNet   ? sliderValue1[1] ?? "" : "" };
    const grossRange = { grossMin: isGross ? Rangeval2[0]    ?? "" : "", grossMax: isGross ? Rangeval2[1]    ?? "" : "" };

    await ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setAfterCountStatus(false);
        }
      })
      .catch(console.log)
      .finally(() => { setIsOnlyProdLoading(false); setAfterCountStatus(false); });
  };

  const handleSliderChange  = (_, v) => { setSliderValue(v);  handleRangeFilterApi(v);  };
  const handleSliderChange1 = (_, v) => { setSliderValue1(v); handleRangeFilterApi1(v); };
  const handleSliderChange2 = (_, v) => { setSliderValue2(v); handleRangeFilterApi2(v); };

  const handleInputChange = (index) => (e) => {
    const next = [...sliderValue];
    next[index] = e.target.value === "" ? "" : Number(e.target.value);
    setSliderValue(next);
    handleRangeFilterApi(next);
  };
  const handleInputChange1 = (index) => (e) => {
    const next = [...sliderValue1];
    next[index] = e.target.value === "" ? "" : Number(e.target.value);
    setSliderValue1(next);
    handleRangeFilterApi1(next);
  };
  const handleInputChange2 = (index) => (e) => {
    const next = [...sliderValue2];
    next[index] = e.target.value === "" ? "" : Number(e.target.value);
    setSliderValue2(next);
    handleRangeFilterApi2(next);
  };

  // ── RangeFilterView inline components (same as old project) ──────────────
  const RangeFilterView = ({ ele }) => {
    const opts = JSON.parse(ele?.options || "[]")?.[0] || {};
    return (
      <>
        <div>
          <Slider
            value={sliderValue}
            onChange={(_, v) => setSliderValue(v)}
            onChangeCommitted={handleSliderChange}
            valueLabelDisplay="auto"
            min={opts?.Min}
            max={opts?.Max}
            step={0.001}
            sx={{ marginTop: "25px", transition: "all 0.2s ease-out" }}
            disableSwap
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            value={sliderValue[0]?.toFixed(3)}
            margin="dense"
            onChange={handleInputChange(0)}
            inputProps={{ step: 0.001, min: opts?.Min, max: opts?.Max, type: "number", readOnly: true }}
            readOnly
            sx={{ cursor: "not-allowed", textAlign: "center" }}
          />
          <Input
            value={sliderValue[1]?.toFixed(3)}
            margin="dense"
            onChange={handleInputChange(1)}
            inputProps={{ step: 0.001, min: opts?.Min, max: opts?.Max, type: "number", readOnly: true }}
            readOnly
            sx={{ cursor: "not-allowed", textAlign: "center" }}
          />
        </div>
      </>
    );
  };

  const RangeFilterView1 = ({ ele }) => {
    const opts = JSON.parse(ele?.options || "[]")?.[0] || {};
    return (
      <>
        <div>
          <Slider
            value={sliderValue1}
            onChange={() => (_, v) => setSliderValue1(v)}
            onChangeCommitted={handleSliderChange1}
            valueLabelDisplay="auto"
            min={opts?.Min}
            max={opts?.Max}
            step={0.001}
            sx={{ marginTop: "25px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            value={sliderValue1[0]?.toFixed(3)}
            margin="dense"
            onChange={handleInputChange1(0)}
            inputProps={{ step: 0.001, min: opts?.Min, max: opts?.Max, type: "number", readOnly: true }}
            readOnly
            sx={{ cursor: "not-allowed", textAlign: "center" }}
          />
          <Input
            value={sliderValue1[1]?.toFixed(3)}
            margin="dense"
            onChange={handleInputChange1(1)}
            inputProps={{ step: 0.001, min: opts?.Min, max: opts?.Max, type: "number", readOnly: true }}
            readOnly
            sx={{ cursor: "not-allowed", textAlign: "center" }}
          />
        </div>
      </>
    );
  };

  const RangeFilterView2 = ({ ele }) => {
    const opts = JSON.parse(ele?.options || "[]")?.[0] || {};
    return (
      <>
        <div>
          <Slider
            value={sliderValue2}
            onChange={(_, v) => setSliderValue2(v)}
            onChangeCommitted={handleSliderChange2}
            valueLabelDisplay="auto"
            min={opts?.Min}
            max={opts?.Max}
            step={0.001}
            sx={{ marginTop: "25px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            value={sliderValue2[0]?.toFixed(3)}
            margin="dense"
            onChange={handleInputChange2(0)}
            inputProps={{ step: 0.001, min: opts?.Min, max: opts?.Max, type: "number", readOnly: true }}
            readOnly
            sx={{ cursor: "not-allowed", textAlign: "center" }}
          />
          <Input
            value={sliderValue2[1]?.toFixed(3)}
            margin="dense"
            onChange={handleInputChange2(1)}
            inputProps={{ step: 0.001, min: opts?.Min, max: opts?.Max, type: "number", readOnly: true }}
            readOnly
            sx={{ cursor: "not-allowed", textAlign: "center" }}
          />
        </div>
      </>
    );
  };

  // ── sort / page / combo handlers ──────────────────────────────────────────
  const handleSortby = async (e) => {
    setSortBySelect(e.target?.value);
    const output = FilterValueWithCheckedOnly();
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    const { DiaRange, netRange, grossRange } = buildRanges();
    await ProductListApi(output, 1, obj, prodListType, cookie, e.target?.value, DiaRange, netRange, grossRange)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
      })
      .catch(console.log);
  };

  const handelCustomCombo = (obj) => {
    const output = FilterValueWithCheckedOnly();
    const { DiaRange, netRange, grossRange } = buildRanges();
    setIsOnlyProdLoading(true);
    ProductListApi(output, currPage, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
      })
      .catch(console.log)
      .finally(() => {
        setTimeout(() => {
          sessionStorage.setItem("short_cutCombo_val", JSON.stringify(obj));
          setIsOnlyProdLoading(false);
        }, 100);
      });
  };

  useEffect(() => {
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    sessionStorage.setItem("short_cutCombo_val", JSON.stringify(obj));
    const loginInfo = typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginUserDetail"))
      : null;
    if (
      customFlag ||
      loginInfo?.MetalId !== selectedMetalId ||
      loginInfo?.cmboDiaQCid !== selectedDiaId ||
      loginInfo?.cmboCSQCid !== selectedCsId
    ) {
      if (selectedMetalId !== "" || selectedDiaId !== "" || selectedCsId !== "") {
        handelCustomCombo(obj);
      }
    }
  }, [selectedMetalId, selectedDiaId, selectedCsId]);

  const totalPages = Math.ceil(afterFilterCount / storeinit?.PageSize);

  const handelPageChange = (event, value) => {
    const output = FilterValueWithCheckedOnly();
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    setCurrPage(value);
    setTimeout(() => window.scroll({ top: 0, behavior: "smooth" }), 100);
    const { DiaRange, netRange, grossRange } = buildRanges();
    ProductListApi(output, value, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
      })
      .catch(console.log);
  };

  const handlePageInputChange = (event) => {
    if (event.key === "Enter") {
      let p = parseInt(inputPage, 10);
      if (p < 1) p = 1;
      if (p > totalPages) p = totalPages;
      setCurrPage(p);
      setInputPage(p);
      handelPageChange("", p);
    }
  };

  // ── clear all ─────────────────────────────────────────────────────────────
  const handelFilterClearAll = () => {
    const d = getFilterOpts("Diamond"), n = getFilterOpts("NetWt"), g = getFilterOpts("Gross");
    const isFilterChecked = Object.values(filterChecked).some((e) => e.checked);
    const isSliderChanged =
      JSON.stringify(sliderValue)  !== JSON.stringify([d?.Min, d?.Max]) ||
      JSON.stringify(sliderValue1) !== JSON.stringify([n?.Min, n?.Max]) ||
      JSON.stringify(sliderValue2) !== JSON.stringify([g?.Min, g?.Max]);

    if (isFilterChecked || isSliderChanged) {
      setSliderValue([d?.Min,  d?.Max]);
      setSliderValue1([n?.Min, n?.Max]);
      setSliderValue2([g?.Min, g?.Max]);
      setInputDia([d?.Min, d?.Max]);
      setInputNet([n?.Min, n?.Max]);
      setInputGross([g?.Min, g?.Max]);
      setFilterChecked({});
      setShow(false); setShow1(false); setShow2(false);
    }
  };

  const handleCheckboxChange = (e, listname, val) => {
    const { name, checked } = e.target;
    setAfterCountStatus(true);
    setFilterChecked((prev) => ({
      ...prev,
      [name]: { checked, type: listname, id: name?.replace(/[a-zA-Z]/g, ""), value: val },
    }));
  };

  // ── cart / wish ───────────────────────────────────────────────────────────
  const handleCartandWish = (e, ele, type) => {
    const prodObj = {
      autocode: ele?.autocode,
      Metalid: selectedMetalId ?? ele?.MetalPurityid,
      MetalColorId: ele?.MetalColorid,
      DiaQCid: selectedDiaId ?? loginUserDetail?.cmboDiaQCid,
      CsQCid: selectedCsId  ?? loginUserDetail?.cmboCSQCid,
      Size: ele?.DefaultSize,
      Unitcost: ele?.UnitCost,
      markup: ele?.DesignMarkUp,
      UnitCostWithmarkup: ele?.UnitCostWithMarkUp,
      Remark: "",
    };

    if (e.target.checked) {
      CartAndWishListAPI(type, prodObj, cookie)
        .then((res) => {
          const cartC = res?.Data?.rd[0]?.Cartlistcount;
          const wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
        })
        .catch(console.log);
    } else {
      RemoveCartAndWishAPI(type, ele?.autocode, cookie)
        .then((res) => {
          const cartC = res?.Data?.rd[0]?.Cartlistcount;
          const wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
        })
        .catch(console.log);
    }

    if (type === "Cart") setCartArr((p) => ({ ...p, [ele?.autocode]: e.target.checked }));
    if (type === "Wish") setWishArr((p) => ({ ...p, [ele?.autocode]: e.target.checked }));
  };

  // ── navigate to detail ────────────────────────────────────────────────────
  const handleMoveToDetail = (productData) => {
    const output = FilterValueWithCheckedOnly();
    const obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: selectedMetalId,
      d: selectedDiaId,
      c: selectedCsId,
      f: output,
    };
    const encodeObj = compressAndEncode(JSON.stringify(obj));
    navigate.push(
      `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`
    );
  };

  // ── breadcrumb helpers ────────────────────────────────────────────────────
  const BreadCumsObj = () => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    let BreadCum;
    try { BreadCum = decodeURI(atob(search.slice(3))).split("/"); }
    catch (_) { BreadCum = ["", ""]; }
    const values = BreadCum[0]?.split(",");
    const labels = BreadCum[1]?.split(",");
    const updatedBreadCum = labels?.reduce((acc, label, i) => { acc[label] = values[i] || ""; return acc; }, {});
    let res = updatedBreadCum
      ? Object.entries(updatedBreadCum).reduce((acc, [key, value], i) => {
          acc[`FilterKey${i === 0 ? "" : i}`] = key.charAt(0).toUpperCase() + key.slice(1);
          acc[`FilterVal${i === 0 ? "" : i}`] = value;
          return acc;
        }, {})
      : {};

    const search1 = typeof window !== "undefined" ? window.location.search : "";
    const ch = search1.charAt(1);
    if (ch !== "A" && ch !== "N" && ch !== "B" && ch !== "T") {
      res.menuname = decodeURI(location)?.slice(3)?.slice(0, -1)?.split("/")[0];
    }
    return res;
  };

  const handleBreadcums = (mparams) => {
    const key = Object.keys(mparams), val = Object.values(mparams);
    const KeyObj = {}, ValObj = {};
    key.forEach((v, i) => { KeyObj[`FilterKey${i === 0 ? "" : i}`] = v; });
    val.forEach((v, i) => { ValObj[`FilterVal${i === 0 ? "" : i}`] = v; });
    const fd = { ...KeyObj, ...ValObj };
    const qp1  = [fd?.FilterKey && fd.FilterVal, fd?.FilterKey1 && fd.FilterVal1, fd?.FilterKey2 && fd.FilterVal2].filter(Boolean).join("/");
    const qp   = [fd?.FilterKey && fd.FilterVal, fd?.FilterKey1 && fd.FilterVal1, fd?.FilterKey2 && fd.FilterVal2].filter(Boolean).join(",");
    const other = Object.entries({ b: fd?.FilterKey, g: fd?.FilterKey1, c: fd?.FilterKey2 })
      .filter(([, v]) => v !== undefined).map(([, v]) => v).filter(Boolean).join(",");
    navigate.push(`/p/${BreadCumsObj()?.menuname}/${qp1}/?M=${btoa(`${qp}/${other}`)}`);
  };

  // ── inline filter panel (shared between drawer and desktop sidebar) ───────
  const FilterPanel = () => (
    <div className="smr_mobile_filter_portion">
      {filterData?.length > 0 && (
        <div className="smr_mobile_filter_portion_outter">
          {/* filter header row */}
          <span className="smr_filter_text">
            <span>
              {!showClearAllButton() ? (
                "Filters"
              ) : afterCountStatus ? (
                <Skeleton variant="rounded" width={140} height={22} className="pSkelton" />
              ) : (
                <span>{`Product Found:: ${afterFilterCount}`}</span>
              )}
            </span>
            <span onClick={() => { if (showClearAllButton()) handelFilterClearAll(); }}>
              {showClearAllButton() ? (
                "Clear All"
              ) : afterCountStatus ? (
                <Skeleton variant="rounded" width={140} height={22} className="pSkelton" />
              ) : (
                <span>{`Total Products: ${afterFilterCount}`}</span>
              )}
            </span>
          </span>

          {/* filter accordions */}
          <div style={{ marginTop: "12px" }}>
            {filterData?.map((ele) => (
              <React.Fragment key={ele?.id}>
                {/* category / colour etc. */}
                {!ele?.id?.includes("Range") && !ele?.id?.includes("Price") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderBottom: "1px solid #c7c8c9",
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                      sx={{ color: "#7d7f85", borderRadius: 0, "&.MuiAccordionSummary-root": { padding: 0 } }}
                    >
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "300px", overflow: "auto" }}>
                      {(JSON.parse(ele?.options) ?? []).map((opt) => (
                        <div key={opt?.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={`${ele?.id}${opt?.id}`}
                                checked={filterChecked[`${ele?.id}${opt?.id}`]?.checked === undefined ? false : filterChecked[`${ele?.id}${opt?.id}`]?.checked}
                                style={{ color: "#7f7d85", padding: 0, width: "10px" }}
                                onClick={(e) => handleCheckboxChange(e, ele?.id, opt?.Name)}
                                size="small"
                              />
                            }
                            className="smr_mui_checkbox_label"
                            label={opt.Name}
                          />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* price */}
                {storeinit?.IsPriceShow == 1 && ele?.id?.includes("Price") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderBottom: "1px solid #c7c8c9",
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                      sx={{ color: "#7d7f85", borderRadius: 0, "&.MuiAccordionSummary-root": { padding: 0 } }}
                    >
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "300px", overflow: "auto" }}>
                      {(JSON.parse(ele?.options) ?? []).map((opt, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={`Price${i}${i}`}
                                checked={filterChecked[`Price${i}${i}`]?.checked === undefined ? false : filterChecked[`Price${i}${i}`]?.checked}
                                style={{ color: "#7f7d85", padding: 0, width: "10px" }}
                                onClick={(e) => handleCheckboxChange(e, ele?.id, opt)}
                                size="small"
                              />
                            }
                            className="smr_mui_checkbox_label"
                            label={
                              opt?.Minval == 0
                                ? `Under ${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Maxval}`
                                : opt?.Maxval == 0
                                ? `Over ${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Minval}`
                                : `${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Minval} - ${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Maxval}`
                            }
                          />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* diamond range */}
                {ele?.Name?.includes("Diamond") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderBottom: "1px solid #c7c8c9",
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />} sx={{ color: "#7d7f85", borderRadius: 0, "&.MuiAccordionSummary-root": { padding: 0 } }}>
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "300px", overflow: "auto" }}>
                      <Box sx={{ width: "94%", height: 88 }}>
                        <RangeFilterView ele={ele} />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* netwt range */}
                {ele?.Name?.includes("NetWt") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderBottom: "1px solid #c7c8c9",
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />} sx={{ color: "#7d7f85", borderRadius: 0, "&.MuiAccordionSummary-root": { padding: 0 } }}>
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "300px", overflow: "auto" }}>
                      <Box sx={{ width: "94%", height: 88 }}>
                        <RangeFilterView1 ele={ele} />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* gross range */}
                {ele?.Name?.includes("Gross") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderBottom: "1px solid #c7c8c9",
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />} sx={{ color: "#7d7f85", borderRadius: 0, "&.MuiAccordionSummary-root": { padding: 0 } }}>
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "300px", overflow: "auto" }}>
                      <Box sx={{ width: "94%", height: 88 }}>
                        <RangeFilterView2 ele={ele} />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );

 
  const DesktopFilterPanel = () => (
    <div className="dt_mobile_filter_portion">
      {filterData?.length > 0 && (
        <>
          <span className="dt_filter_text_">
            <span>
              {!showClearAllButton() ? (
                "Filters"
              ) : afterCountStatus ? (
                <Skeleton variant="rounded" width={140} height={22} className="pSkelton" />
              ) : (
                <span>{`Product Found: ${afterFilterCount}`}</span>
              )}
            </span>
            <span onClick={() => { if (showClearAllButton()) handelFilterClearAll(); }}>
              {showClearAllButton() ? (
                <span style={{ color: "#c96" }}>Clear All</span>
              ) : afterCountStatus ? (
                <Skeleton variant="rounded" width={140} height={22} className="pSkelton" />
              ) : (
                <span>{`Total Products: ${afterFilterCount}`}</span>
              )}
            </span>
          </span>

          <div style={{ marginTop: "12px", borderTop: "1px solid #e1e1e1" }}>
            {filterData?.map((ele) => (
              <React.Fragment key={ele?.id}>
                {!ele?.id?.includes("Range") && !ele?.id?.includes("Price") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                      sx={{ color: "#666", borderRadius: 0, fontSize: "14px", filter: "contrast(10.4)", "&.MuiAccordionSummary-root": { padding: 0 } }}
                    >
                      {ele?.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "225px", overflow: "auto" }}>
                      {(JSON.parse(ele?.options) ?? []).map((opt) => (
                        <div key={opt?.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={`${ele?.id}${opt?.id}`}
                                checked={filterChecked[`${ele?.id}${opt?.id}`]?.checked === undefined ? false : filterChecked[`${ele?.id}${opt?.id}`]?.checked}
                                style={{ color: "#7f7d85", padding: 0, width: "10px" }}
                                onClick={(e) => handleCheckboxChange(e, ele?.id, opt?.Name)}
                                size="small"
                              />
                            }
                            className="dt_mui_checkbox_label"
                            label={opt?.Name}
                          />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

                {storeinit?.IsPriceShow == 1 && ele?.id?.includes("Price") && (
                  <Accordion
                    elevation={0}
                    sx={{
                      borderRadius: 0,
                      "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                      "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                      sx={{ color: "#666", borderRadius: 0, fontSize: "14px", filter: "contrast(10.4)", "&.MuiAccordionSummary-root": { padding: 0 } }}
                    >
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "225px", overflow: "auto" }}>
                      {(JSON.parse(ele?.options) ?? []).map((opt, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={`Price${i}${i}`}
                                checked={filterChecked[`Price${i}${i}`]?.checked === undefined ? false : filterChecked[`Price${i}${i}`]?.checked}
                                style={{ color: "#7f7d85", padding: 0, width: "10px" }}
                                onClick={(e) => handleCheckboxChange(e, ele?.id, opt)}
                                size="small"
                              />
                            }
                            style={{ fontSize: "10px !important" }}
                            className="smr_mui_checkbox_label"
                            label={
                              opt?.Minval == 0
                                ? `Under ${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Maxval}`
                                : opt?.Maxval == 0
                                ? `Over ${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Minval}`
                                : `${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Minval} - ${loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode} ${opt?.Maxval}`
                            }
                          />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

                {ele?.Name?.includes("Diamond") && (
                  <Accordion elevation={0} sx={{ borderRadius: 0, "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />} sx={{ color: "#666", borderRadius: 0, fontSize: "14px", filter: "contrast(10.4)", "&.MuiAccordionSummary-root": { padding: 0 } }}>
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "225px", overflow: "auto" }}>
                      <Box sx={{ width: "94%", height: 88 }}><RangeFilterView ele={ele} /></Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {ele?.Name?.includes("NetWt") && (
                  <Accordion elevation={0} sx={{ borderRadius: 0, "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />} sx={{ color: "#666", borderRadius: 0, fontSize: "14px", filter: "contrast(10.4)", "&.MuiAccordionSummary-root": { padding: 0 } }}>
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "225px", overflow: "auto" }}>
                      <Box sx={{ width: "94%", height: 88 }}><RangeFilterView1 ele={ele} /></Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {ele?.Name?.includes("Gross") && (
                  <Accordion elevation={0} sx={{ borderRadius: 0, "&.MuiPaper-root.MuiAccordion-root:last-of-type": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />} sx={{ color: "#666", borderRadius: 0, fontSize: "14px", filter: "contrast(10.4)", "&.MuiAccordionSummary-root": { padding: 0 } }}>
                      {ele.Fil_DisName}
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "fit-content", maxHeight: "225px", overflow: "auto" }}>
                      <Box sx={{ width: "94%", height: 88 }}><RangeFilterView2 ele={ele} /></Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );

 
  useEffect(() => { window.scroll({ top: 0, behavior: "smooth" }); }, []);

 
  return (
    <div>
      {isProdLoading ? (
        <ProductListSkeleton className="pSkelton" />
      ) : (
        <>
          {/* ── mobile drawer ── */}
          <Drawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            className="smr_filterDrawer"
          >
            <div
              style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "end", padding: "8px 8px 0px 0px" }}
              className="dt_prodtList_drawer_close"
            >
              <CloseIcon onClick={() => setIsDrawerOpen(false)} />
            </div>

            {/* customization options inside drawer */}
            <div style={{ marginLeft: "15px", marginBottom: "20px", display: "flex", gap: "5px", flexDirection: "column" }}>
              <Typography sx={{ color: "#7f7d85", fontSize: "16px", fontFamily: "TT Commons Medium", marginTop: "12px" }}>
                Customization
              </Typography>

              {storeinit?.IsMetalCustComb === 1 && (
                <div>
                  <Typography className="label" sx={{ color: "#7f7d85", fontSize: "14px", fontFamily: "TT Commons Regular" }}>Metal:&nbsp;</Typography>
                  <select
                    style={{ border: "1px solid #e1e1e1", borderRadius: "8px", minWidth: "270px" }}
                    className="select"
                    value={selectedMetalId}
                    onChange={(e) => setSelectedMetalId(e.target.value)}
                  >
                    {metalTypeCombo?.map((m) => (
                      <option key={m?.Metalid} value={m?.Metalid}>{m?.metaltype.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              )}

              {storeinit?.IsDiamondCustComb === 1 && (
                <div>
                  <Typography className="label" sx={{ color: "#7f7d85", fontSize: "14px", fontFamily: "TT Commons Regular" }}>Diamond:&nbsp;</Typography>
                  <select
                    style={{ border: "1px solid #e1e1e1", borderRadius: "8px", minWidth: "270px" }}
                    className="select"
                    value={selectedDiaId}
                    onChange={(e) => setSelectedDiaId(e.target.value)}
                  >
                    {diaQcCombo?.map((d) => (
                      <option key={d?.QualityId} value={`${d?.QualityId},${d?.ColorId}`}>
                        {`${d.Quality.toUpperCase()}, ${d.color.toLowerCase()}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {storeinit?.IsCsCustomization === 1 && (
                <div>
                  <Typography className="label" sx={{ color: "#7f7d85", fontSize: "14px", fontFamily: "TT Commons Regular" }}>Color Stone:&nbsp;</Typography>
                  <select
                    style={{ border: "1px solid #e1e1e1", borderRadius: "8px", minWidth: "270px" }}
                    className="select"
                    value={selectedCsId}
                    onChange={(e) => setSelectedCsId(e.target.value)}
                  >
                    {csQcCombo?.map((cs) => (
                      <option key={cs?.QualityId} value={`${cs?.QualityId},${cs?.ColorId}`}>
                        {`${cs.Quality.toUpperCase()},${cs.color.toLowerCase()}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <div>
                  <Typography className="label" sx={{ color: "#7f7d85", fontSize: "14px", fontFamily: "TT Commons Regular" }}>Sort By:&nbsp;</Typography>
                  <select
                    style={{ border: "1px solid #e1e1e1", borderRadius: "8px", minWidth: "270px" }}
                    className="select"
                    value={sortBySelect}
                    onChange={(e) => handleSortby(e)}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="New">New</option>
                    <option value="Bestseller">BestSeller</option>
                    <option value="Trending">Trending</option>
                    <option value="In Stock">In stock</option>
                    <option value="PRICE HIGH TO LOW">Price High To Low</option>
                    <option value="PRICE LOW TO HIGH">Price Low To High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* filter panel inside drawer */}
            <FilterPanel />
          </Drawer>

          {/* ── banner ── */}
          <div className="bg-image">
            <div className="overlay" />
            <div className="text-container">
              <div className="textContainerData">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className="designCounttext">{handleLabelMenuName()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── breadcrumb / sort bar ── */}
          <div className="main_breadCrumb_menu_List">
            <div className="breadCrumb_menu_List">
              <span style={{ textTransform: "uppercase", display: "flex", width: maxwidth1483 ? "100%" : "20%" }}>
                <span
                  className="smr_breadcums_port_app"
                  onClick={() => navigate.push("/")}
                >
                  {"Home/"}
                </span>

                {typeof window !== "undefined" && window.location.search.charAt(1) === "A" && (
                  <div className="smr_breadcums_port_app" style={{ marginLeft: "3px" }}>
                    <span>{location?.split("/")[2]?.replaceAll("%20", "")}</span>
                  </div>
                )}
                {typeof window !== "undefined" && window.location.search.charAt(1) === "T" && (
                  <div className="smr_breadcums_port_app" style={{ marginLeft: "3px" }}><span>Trending</span></div>
                )}
                {typeof window !== "undefined" && window.location.search.charAt(1) === "B" && (
                  <div className="smr_breadcums_port_app" style={{ marginLeft: "3px" }}><span>Best Seller</span></div>
                )}
                {typeof window !== "undefined" && window.location.search.charAt(1) === "N" && (
                  <div className="smr_breadcums_port_app" style={{ marginLeft: "3px" }}><span>New Arrival</span></div>
                )}
                {typeof window !== "undefined" && window.location.search.charAt(1) === "S" && (
                  <div className="smr_breadcums_port_app">
                    <span>{location?.split("/")[2]}</span>
                  </div>
                )}

                {IsBreadCumShow && (
                  <div className="smr_breadcums_port_app">
                    {BreadCumsObj()?.menuname && (
                      <span onClick={() => handleBreadcums({ [BreadCumsObj()?.FilterKey]: BreadCumsObj()?.FilterVal })}>
                        {BreadCumsObj()?.menuname}
                      </span>
                    )}
                    {BreadCumsObj()?.FilterVal1 && (
                      <span onClick={() => handleBreadcums({ [BreadCumsObj()?.FilterKey]: BreadCumsObj()?.FilterVal, [BreadCumsObj()?.FilterKey1]: BreadCumsObj()?.FilterVal1 })}>
                        {`/${BreadCumsObj()?.FilterVal1}`}
                      </span>
                    )}
                    {BreadCumsObj()?.FilterVal2 && (
                      <span onClick={() => handleBreadcums({ [BreadCumsObj()?.FilterKey]: BreadCumsObj()?.FilterVal, [BreadCumsObj()?.FilterKey1]: BreadCumsObj()?.FilterVal1, [BreadCumsObj()?.FilterKey2]: BreadCumsObj()?.FilterVal2 })}>
                        {`/${BreadCumsObj()?.FilterVal2}`}
                      </span>
                    )}
                  </div>
                )}
              </span>

              {/* mobile: filter icon toggle */}
              {maxwidth1483 ? (
                <div className="smr_mobile_prodSorting" style={{ width: maxwidth1483 && "auto" }}>
                  <Checkbox
                    sx={{ padding: "0px 9px 0px 9px" }}
                    icon={<FilterAltIcon fontSize="large" />}
                    checkedIcon={<FilterAltOffIcon fontSize="large" style={{ color: "#666666" }} />}
                    disableRipple
                    checked={isDrawerOpen}
                    onChange={(e) => setIsDrawerOpen(e.target.checked)}
                  />
                </div>
              ) : (
                /* desktop: inline combos + sort */
                <div className="productheader" style={{ display: "block" }}>
                  <div className="productheader part">
                    {storeinit?.IsMetalCustComb === 1 && (
                      <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                        <label style={{ marginTop: "5px", color: "#333333", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>Metal :</label>
                        <select className="sortMenuSelection" value={selectedMetalId} onChange={(e) => { setSelectedMetalId(e.target.value); setCustomFlag(true); }}>
                          {metalTypeCombo?.map((m) => (
                            <option key={m?.Metalid} value={m?.Metalid}>{m?.metaltype.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {storeinit?.IsDiamondCustComb === 1 && (
                      <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                        <label style={{ marginTop: "5px", color: "#333333", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>Diamond :</label>
                        <select className="sortMenuSelection" value={selectedDiaId} onChange={(e) => { setSelectedDiaId(e.target.value); setCustomFlag(true); }}>
                          {diaQcCombo?.map((d) => (
                            <option key={d?.QualityId} value={`${d?.QualityId},${d?.ColorId}`}>
                              {`${d.Quality.toUpperCase()}, ${d.color.toLowerCase()}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {storeinit?.IsCsCustomization === 1 && (
                      <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                        <label style={{ marginTop: "5px", color: "#333333", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>Color Stone :</label>
                        <select className="sortMenuSelection" value={selectedCsId} onChange={(e) => { setSelectedCsId(e.target.value); setCustomFlag(true); }}>
                          {csQcCombo?.map((cs) => (
                            <option key={cs?.QualityId} value={`${cs?.QualityId},${cs?.ColorId}`}>
                              {`${cs.Quality.toUpperCase()},${cs.color.toLowerCase()}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                      <label style={{ marginTop: "5px", color: "#333333", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>Sort by :</label>
                      <select className="sortMenuSelection" value={sortBySelect} onChange={(e) => handleSortby(e)}>
                        <option value="Recommended">Recommended</option>
                        <option value="Bestseller">BestSeller</option>
                        <option value="New">New</option>
                        <option value="Trending">Trending</option>
                        <option value="In Stock">In stock</option>
                        <option value="PRICE HIGH TO LOW">Price High To Low</option>
                        <option value="PRICE LOW TO HIGH">Price Low To High</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── main content ── */}
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10px", marginInline: "8%" }}
            className="paddingTopMobileSet mainProduct"
          >
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <div className="smilingProductMain" id="smilingProductMain">
                <div
                  className="smilingProductSubMain"
                  style={{ width: "100%", display: "flex", position: "relative", gap: "14px" }}
                >
                  {/* ── desktop filter sidebar ── */}
                  {!maxwidth1483 && <DesktopFilterPanel />}

                  {/* ── product grid ── */}
                  <div
                    style={{ width: "100%", display: "flex", flexDirection: "column", transition: "1s ease" }}
                    className="smilingProductImageMain"
                    id="smilingProductImageMain"
                  >
                    {isOnlyProdLoading ? (
                      <ProductListSkeleton fromPage="Prodlist" className="pSkelton" />
                    ) : (
                      <>
                        {!filterProdListEmpty ? (
                          <div className="smilingAllProductDataMainMobile">
                            {finalProductListData?.map((productData, i) => (
                              <Product_Card
                                key={productData?.autocode ?? i}
                                productData={productData}
                                productIndex={i}
                                handleMoveToDetail={handleMoveToDetail}
                                videoUrl={getDynamicVideo(productData.designno, productData.VideoCount, productData.VideoExtension)}
                                RollImageUrl={getDynamicRollImages(productData.designno, productData.ImageCount)}
                                imageUrl={getDynamicImages(productData.designno)}
                                handleCartandWish={handleCartandWish}
                                cartArr={cartArr}
                                wishArr={wishArr}
                                storeinit={storeinit}
                                loginUserDetail={loginUserDetail}
                                formatter={formatter}
                              />
                            ))}

                            {/* pagination */}
                            {storeinit?.IsProductListPagination == 1 &&
                              Math.ceil(afterFilterCount / storeinit.PageSize) > 1 && (
                                <div
                                  style={{ display: "flex", justifyContent: "center", marginTop: "5%", width: "100%" }}
                                  className="smr_pagination_portion"
                                >
                                  <Pagination
                                    count={Math.ceil(afterFilterCount / storeinit.PageSize)}
                                    size={maxwidth464px ? "small" : "large"}
                                    shape="circular"
                                    onChange={handelPageChange}
                                    page={currPage}
                                    showFirstButton
                                    showLastButton
                                    renderItem={(item) => (
                                      <PaginationItem
                                        {...item}
                                        sx={{ pointerEvents: item.page === currPage ? "none" : "auto" }}
                                      />
                                    )}
                                  />
                                </div>
                              )}
                          </div>
                        ) : (
                          <div style={{ margin: "50px 0px 50px 0px" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <img src="https://i.gifer.com/7jM3.gif" alt="No Products Found" style={{ maxWidth: "10%", height: "auto" }} />
                            </div>
                            <Typography sx={{ color: "#a2a2a2" }} variant="h4" align="center">No Products Found</Typography>
                            <Typography sx={{ color: "#a2a2a2" }} variant="body2" align="center">
                              Your search did not match any products. <br /> Please try again.
                            </Typography>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;

 
const Product_Card = ({
  productData,
  productIndex,
  handleMoveToDetail,
  storeinit,
  videoUrl,
  RollImageUrl,
  imageUrl,
  handleCartandWish,
  cartArr,
  wishArr,
  loginUserDetail,
  formatter,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), (productIndex + 1) * 100);
    return () => clearTimeout(timer);
  }, [productIndex]);

  return (
    <div className="main-ProdcutListConatiner" >
      <div className="listing-card">
        <div className="listing-image">
          <div>
            {isLoading ? (
              <CardMedia style={{ width: "100%" }} className="cardMainSkeleton">
                <Skeleton animation="wave" variant="rect" width="100%" height="280px" style={{ backgroundColor: "#e8e8e86e" }} />
              </CardMedia>
            ) : (
              <div
                onClick={() => handleMoveToDetail(productData)}
                onMouseMove={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className="dt_ImgandVideoContainer"
              >
                <div>
                  {isLoading ? (
                    <CardMedia style={{ width: "100%", height: "100%" }} className="dt_productCard_cardMainSkeleton">
                      <Skeleton animation="wave" variant="rect" width="100%" height="100%" style={{ backgroundColor: "#e8e8e86e" }} />
                    </CardMedia>
                  ) : (
                    <>
                      <div style={{ display: isHover ? "block" : "none" }}>
                        {videoUrl !== undefined ? (
                          <video
                            className="dt_productCard_video"
                            src={videoUrl}
                            autoPlay muted loop playsInline
                            onError={(e) => { e.target.poster = "/image-not-found.jpg"; }}
                          />
                        ) : (videoUrl === undefined && RollImageUrl !== undefined) ? (
                          <img
                            className="dt_productListCard_Image"
                            src={RollImageUrl}
                            onError={(e) => { e.target.src = "/image-not-found.jpg"; }}
                          />
                        ) : null}
                      </div>
                      <img
                        className="dt_productListCard_Image"
                        src={imageUrl}
                        onError={(e) => { e.target.onerror = null; e.stopPropagation(); e.target.src = "/image-not-found.jpg"; }}
                        style={{ opacity: isHover && (RollImageUrl || videoUrl) ? "0" : "1", transition: "0s ease-in-out" }}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* product labels */}
            <div className="dt_product_label">
              {productData?.IsInReadyStock == 1 ? (
                <span className="dt_instock">In Stock</span>
              ) : (
                <span className="dt_instock">Make To Order</span>
              )}
              {productData?.IsBestSeller  == 1 && <span className="dt_bestSeller">Best Seller</span>}
              {productData?.IsTrending    == 1 && <span className="dt_intrending">Trending</span>}
              {productData?.IsNewArrival  == 1 && <span className="dt_newarrival">New Arrival</span>}
            </div>

            {/* cart (hidden) */}
            <Button className="cart-icon" style={{ display: "none" }}>
              <Checkbox
                icon={<LocalMallOutlinedIcon sx={{ fontSize: "22px", color: "#7d7f85", opacity: ".7" }} />}
                checkedIcon={<LocalMallIcon sx={{ fontSize: "22px", color: "#009500" }} />}
                disableRipple
                sx={{ padding: "5px" }}
                onChange={(e) => handleCartandWish(e, productData, "Cart")}
                checked={cartArr[productData?.autocode] ?? productData?.IsInCart === 1 ? true : false}
              />
            </Button>

            {/* wishlist */}
            <Button className="wishlist-icon">
              <Checkbox
                icon={<FavoriteBorderIcon sx={{ fontSize: "22px", color: "#7d7f85", opacity: ".7" }} />}
                checkedIcon={<FavoriteIcon sx={{ fontSize: "22px", color: "#e31b23" }} />}
                disableRipple
                sx={{ padding: "5px" }}
                onChange={(e) => handleCartandWish(e, productData, "Wish")}
                checked={wishArr[productData?.autocode] ?? productData?.IsInWish === 1 ? true : false}
              />
            </Button>
          </div>
        </div>

        {/* title */}
        {productData?.TitleLine?.length !== 0 ? (
          <div className="listing-details">
            <p className="prodTitle" title={`${productData?.TitleLine}`}>
              {formatTitleLine(productData?.TitleLine) && productData?.TitleLine}
            </p>
          </div>
        ) : (
          <div className="listing-details" />
        )}

        {/* price */}
        {storeinit?.IsPriceShow == 1 && (
          <div style={{ margin: "0px", fontSize: "15px", display: "flex", justifyContent: "center", width: "100%", gap: "5px" }}>
            <div className="currencyFont" style={{ fontSize: "16px", color: "#8d8d8d" }}>
              {loginUserDetail?.CurrencyCode ?? storeinit?.CurrencyCode}
            </div>
            <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px", color: "#8d8d8d" }}>
              {formatter(productData?.UnitCostWithMarkUp)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};