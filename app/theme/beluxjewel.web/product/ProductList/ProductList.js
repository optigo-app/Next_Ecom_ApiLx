"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ProductList.modul.scss";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  PaginationItem,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import debounce from "lodash.debounce";
import _ from "lodash";
import { Accordion, Box, FormControlLabel, Input, Slider } from "@mui/material";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import ProductListSkeleton from "./productlist_skeleton/ProductListSkeleton";
import Pako from "pako";
import ProductFilterSkeleton from "./productlist_skeleton/ProductFilterSkeleton";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import {
  formatRedirectTitleLine,
  formatter,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import FilterSidebar from "./New/NewSideFilter";
import ShopHeader from "./New/ShopHeader";
import JewelryProductGrid from "./New/NewProductList";
import BreadCrumbBar from "./New/BreadCrumb";
import NewPagination from "./New/NewPagination";
import NoProductFound from "./New/NoProductFound";
import { generateBreadcrumbJsonLd } from "@/app/(core)/utils/seo/seo-utils";

import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useSyncDataStore, useSyncStore } from "@/app/(core)/hooks/useStore";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import { usePathname, useSearchParams } from "next/navigation";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";

const ProductList = ({ storeinit, searchParams, params }) => {
  const { setCartCountNum, setWishCountNum, loginUserDetail, finalId } = useStore();
  const location = usePathname();
  let cookie = Cookies.get("visiterId");
  const navigate = useNextRouterLikeRR();
  const getBreadCrumData = getSession("breadcrumbData");
  const syncProductList = useSyncStore((state) => state.syncProductList);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isBelow768 = useMediaQuery("(max-width:768px)");
  const searchParamsHook = useSearchParams();
  const [baseUrl, setBaseUrl] = useState("");

  let drawerWidth;

  if (isSmallScreen) {
    drawerWidth = "15rem";
  } else {
    drawerWidth = "20rem";
  }

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const fullUrl = `${baseUrl}${location}${searchParamsHook.toString() ? `?${searchParamsHook.toString()}` : ""}`;

  const breadcrumbData = [
    { name: "Home", url: baseUrl },
    { name: "Product", url: fullUrl },  
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "breadcrumbData",
        JSON.stringify(
          `${baseUrl}${window.location.pathname}${window.location.search}`,
        ),
      );
    }
  }, []);

  const generateBreadcrumbJsonLd = (breadcrumbs) => { 
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    };
  };

  useGlobalPreventSave();

  const jsonLd = generateBreadcrumbJsonLd(breadcrumbData);

  // Designing States
  const [showFilter, setShowFilter] = useState(false);
  const [showFilterTemp, setShowFilterTemp] = useState(false);
  const [trend, setTrend] = useState("Recommended");
  const [carat, setCarat] = useState("");
  const [clarity, setClarity] = useState("VS#GH");
  const [filter, setFilter] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openGridModal, setOpenGridModal] = useState(false);
  const [gridToggle, setGridToggle] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIcon, setActiveIcon] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  // API's States
  const [menuParams, setMenuParams] = useState({});
  const [IsBreadCumShow, setIsBreadcumShow] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const [metalType, setMetaltype] = useState([]);
  const [diamondType, setDiamondType] = useState([]);
  const [allFilter, setAllFilter] = useState([]);
  const [filterChecked, setFilterChecked] = useState({});
  const [prodListType, setprodListType] = useState();
  const [isProdLoading, setIsProdLoading] = useState(true);
  const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
  const [locationKey, setLocationKey] = useState();
  const [sortBySelect, setSortBySelect] = useState("Recommended");
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [isHover, setIsHover] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [rollOverImgPd, setRolloverImgPd] = useState({});
  const [filterPriceSlider, setFilterPriceSlider] = useState([]);
  const [filterGrossSlider, setFilterGrossSlider] = useState([]);
  const [filterNetWtSlider, setFilterNetWTSlider] = useState([]);
  const [sliderValue, setSliderValue] = useState([]);
  const [sliderValue1, setSliderValue1] = useState([]);
  const [sliderValue2, setSliderValue2] = useState([]);
  const [afterFilterCount, setAfterFilterCount] = useState();
  const [filterDiamondSlider, setFilterDiamondSlider] = useState([]);
  const [detailsMenu, setDetailsMenu] = useState();
  const [selectedMetalId, setSelectedMetalId] = useState(
    loginUserDetail?.MetalId,
  );
  const [selectedDiaId, setSelectedDiaId] = useState(
    loginUserDetail?.cmboDiaQCid,
  );

  const [isClearAllClicked, setIsClearAllClicked] = useState(false);
  const [selectedCsId, setSelectedCsId] = useState(loginUserDetail?.cmboCSQCid);
  const [close, setClose] = useState(false);
  const [cartArr, setCartArr] = useState({});
  const [wishArr, setWishArr] = useState({});
  const [visibleIndices, setVisibleIndices] = useState([]);
  const [inputPage, setInputPage] = useState(currPage);
  const [priceRangeValue, setPriceRangeValue] = useState(["", ""]);
  const [highestPrice, setHighestPrice] = useState();
  const [lowestPrice, setLowestPrice] = useState();
  const [inputPrice, setInputPrice] = useState(["", ""]);
  const [inputGross, setInputGross] = useState([]);
  const [inputNet, setInputNet] = useState([]);
  const [inputDia, setInputDia] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [appliedRange1, setAppliedRange1] = useState(null);
  const [appliedRange2, setAppliedRange2] = useState(null);
  const [appliedRange3, setAppliedRange3] = useState(null);
  const { broadcast } = useBroadcaster();
  const lastSyncData = useSyncDataStore((s) => s.syncData);
  const isFirstComboRun = useRef(true);
  const lastFetchedComboRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const anyFilterApplied = useMemo(() => {
    const isFilterChecked = Object.values(filterChecked).some(
      (ele) => ele.checked,
    );

    const diafilter = filterData?.find(
      (ele) => ele?.Name === "Diamond",
    )?.options;
    const netfilter = filterData?.find((ele) => ele?.Name === "NetWt")?.options;
    const grossfilter = filterData?.find(
      (ele) => ele?.Name === "Gross",
    )?.options;

    const diaOptions = diafilter ? JSON.parse(diafilter)[0] : null;
    const netOptions = netfilter ? JSON.parse(netfilter)[0] : null;
    const grossOptions = grossfilter ? JSON.parse(grossfilter)[0] : null;

    const isSliderChanged =
      (diaOptions &&
        JSON.stringify(sliderValue) !==
          JSON.stringify(
            diaOptions.Min != null && diaOptions.Max != null
              ? [diaOptions.Min, diaOptions.Max]
              : [],
          )) ||
      (netOptions &&
        JSON.stringify(sliderValue1) !==
          JSON.stringify(
            netOptions.Min != null && netOptions.Max != null
              ? [netOptions.Min, netOptions.Max]
              : [],
          )) ||
      (grossOptions &&
        JSON.stringify(sliderValue2) !==
          JSON.stringify(
            grossOptions.Min != null && grossOptions.Max != null
              ? [grossOptions.Min, grossOptions.Max]
              : [],
          ));

    const isInputPriceApplied =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    return isFilterChecked || isSliderChanged || isInputPriceApplied;
  }, [
    filterChecked,
    sliderValue,
    sliderValue1,
    sliderValue2,
    inputPrice,
    filterData,
  ]);

  let maxwidth464px = useMediaQuery("(max-width:464px)");

  useEffect(() => {
    let icon = "view_grid"; // default

    if (openGridModal) {
      icon = "double_view";
    } else if (showFilterTemp) {
      icon = "apps";
    } else if (showFilter) {
      icon = "view_grid";
    }

    setActiveIcon(icon);
  }, [openGridModal, filter, showFilter, showFilterTemp]);

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = Pako.deflate(uint8Array, { to: "string" });

      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const getCardImageUrl = (productData) => {
    const cdnFol = storeinit?.CDNDesignImageFol || storeInit?.CDNDesignImageFol || "";
    if (!cdnFol || !productData?.designno) return "";
    const ext = productData?.ImageExtension || "webp";
    
    if (productData?.ImageVideoDetail && productData.ImageVideoDetail !== "0") {
      try {
        const parsed = typeof productData.ImageVideoDetail === "string" 
          ? JSON.parse(productData.ImageVideoDetail) 
          : productData.ImageVideoDetail;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mtColorLocal = getSession("MetalColorCombo") || [];
          const targetColorObj = mtColorLocal.find(ele => Number(ele.id) === Number(productData?.MetalColorid));
          const targetColorCode = targetColorObj?.colorcode || productData?.MetalColor;

          if (targetColorCode) {
            const targetLower = targetColorCode.toLowerCase().trim();
            const matchedColorImg = parsed.find(item => {
              if (Number(item?.TI) !== 2 || !item?.CN) return false;
              const cnLower = item.CN.toLowerCase().trim();
              return cnLower === targetLower || cnLower.includes(targetLower) || targetLower.includes(cnLower);
            });
            if (matchedColorImg) {
              return `${cdnFol}${productData.designno}~${matchedColorImg.Nm}~${matchedColorImg.CN}.${matchedColorImg.Ex || ext}`;
            }
          }

          const normalImg = parsed.find(item => Number(item?.TI) === 1);
          if (normalImg) {
            return `${cdnFol}${productData.designno}~${normalImg.Nm}.${normalImg.Ex || ext}`;
          }
        }
      } catch (e) {}
    }
    return `${cdnFol}${productData.designno}~1.${ext}`;
  };

  const convertUrl = (productData) => {
    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: selectedMetalId,
      d: selectedDiaId,
      c: selectedCsId,
      g: detailsMenu,
      img: getCardImageUrl(productData),
      ArticleNo: productData?.ArticleNo,
    };

    let encodeObj = compressAndEncode(JSON.stringify(obj));
    return encodeObj;
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: productListData.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${window.location.origin}/d/${formatRedirectTitleLine(product?.TitleLine)}${product?.designno}?p=${convertUrl(product)}`,
    })),
  };

  // let getDesignImageFol = storeinit?.CDNDesignImageFol;
  let getDesignImageFol = storeinit?.CDNDesignImageFolThumb;

  const handleCheckboxChange = (e, listname, val) => {
    const { name, checked } = e.target;

    setFilterChecked((prev) => ({
      ...prev,
      [name]: {
        checked,
        type: listname,
        id: name?.replace(/[a-zA-Z]/g, ""),
        value: val,
      },
    }));
    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  function parseRangeData(filterData, name, sliderValue, inputValue) {
    const target = filterData?.find(
      (ele) =>
        ele?.Name ===
        (name == "Dia" ? "Diamond" : name == "net" ? "NetWt" : name),
    );
    const options =
      target?.options?.length > 0 ? JSON.parse(target.options)[0] : {};

    const isChanged =
      JSON.stringify(sliderValue) !==
      JSON.stringify([options?.Min, options?.Max]);

    return {
      [`${name != "Dia" ? name.toLowerCase() : name}Min`]: isChanged
        ? sliderValue[0] !== inputValue[0]
          ? sliderValue[0]
          : inputValue[0]
        : "",
      [`${name != "Dia" ? name.toLowerCase() : name}Max`]: isChanged
        ? sliderValue[1] !== inputValue[1]
          ? sliderValue[1]
          : inputValue[1]
        : "",
    };
  }

  const FilterValueWithCheckedOnly = () => {
    const onlyTrueFilterValue = Object.values(filterChecked).filter(
      (ele) => ele.checked,
    );

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

    if (
      priceValues.length > 0 &&
      inputPrice[0] !== "" &&
      inputPrice[1] !== ""
    ) {
      setPriceRangeValue(["", ""]);
      setInputPrice(["", ""]);
      setIsReset(false);
    }

    for (const key in output) {
      if (key !== "Price") {
        output[key] = output[key]?.slice(0, -2); //
      }
    }

    return output;
  };
  useEffect(() => {
    const metalId = loginUserDetail?.MetalId ?? storeinit?.MetalId;
    const diaId = loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid;

    if (
      metalId &&
      (selectedMetalId === undefined || selectedMetalId === null)
    ) {
      setSelectedMetalId(metalId);
    }
    if (diaId && (selectedDiaId === undefined || selectedDiaId === null)) {
      setSelectedDiaId(diaId);
    }

    let NewArrivalVar = "";
    const UrlVal = Array.isArray(result) ? result : [];

    const mEntry = UrlVal.find(
      (s) => typeof s === "string" && s.startsWith("M="),
    );
    let hasCollection = false;
    if (mEntry) {
      try {
        const decoded = atob(mEntry.split("=")[1] ?? "").toLowerCase();
        hasCollection = decoded.includes("collection");
        if (decoded.includes("newarrival") || decoded.includes("new arrival")) {
          NewArrivalVar = "New";
        }
      } catch (_) {}
    }

    UrlVal.forEach((ele) => {
      const firstChar = typeof ele === "string" ? ele.charAt(0) : "";
      if (firstChar === "N") {
        NewArrivalVar = "New";
      }
    });

    if (NewArrivalVar === "New") {
      setSortBySelect("New");
      setTrend("New");
    } else if (hasCollection) {
      setSortBySelect("design set");
      setTrend("design set");
    } else {
      setSortBySelect("Recommended");
      setTrend("Recommended");
    }
  }, [location, loginUserDetail, storeinit]); // location is the pathname string — changes on navigation

  useEffect(() => {
    if (
      location === locationKey &&
      (Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true)
    ) {
      setIsOnlyProdLoading(true);
    }

    // Avoid multiple calls by debouncing
    const debounceFilter = _.debounce(() => {
      let output = FilterValueWithCheckedOnly();
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      if (
        location === locationKey &&
        (Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true)
      ) {
        const DiaRange = parseRangeData(
          filterData,
          "Dia",
          sliderValue,
          inputDia,
        );
        const grossRange = parseRangeData(
          filterData,
          "Gross",
          sliderValue2,
          inputGross,
        );
        const netRange = parseRangeData(
          filterData,
          "net",
          sliderValue1,
          inputNet,
        );

        const inputPriceField =
          JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

        if (inputPriceField) {
          const pricerange = {
            PriceMin: inputPrice[0],
            PriceMax: inputPrice[1],
          };
          if (!output?.Price?.length) {
            output = { ...output, ...pricerange };
          }
        }

        setCurrPage(1);
        setInputPage(1);

        ProductListApi(
          output,
          1,
          obj,
          prodListType,
          cookie,
          sortBySelect,
          DiaRange,
          netRange,
          grossRange,
        )
          .then((res) => {
            if (res) {
              setProductListData(res?.pdList);
              setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
            }
          })
          .catch((err) => console.log("err", err))
          .finally(() => {
            setIsOnlyProdLoading(false);
            setIsClearAllClicked(false);
          });
      }
    }, 300); // 300ms debounce

    debounceFilter();

    return () => {
      debounceFilter.cancel();
    };
  }, [filterChecked]);

  const handleGridToggles = (event) => {
    setAnchorEl(event.currentTarget); // Open the popover
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Close the popover
  };

  const handleChangeTrend = (event) => {
    setTrend(event.target.value);
  };
  const handleChangeCarat = (event) => {
    setCarat(event.target.value);
  };
  const handleChangeClarity = (event) => {
    setClarity(event.target.value);
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleActiveIcons = (icons) => {
    setActiveIcon(icons);
    handleClosePopover();
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleGridToggle = () => {
    setGridToggle(!gridToggle);
  };

  const open = Boolean(anchorEl);
  const id = open ? "icon-popover" : undefined;

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 1400) {
      setFilter(true);
    } else {
      setFilter(false);
      setOpenDrawer(false);
    }

    // if (width <= 1400 && width >= 701) {
    //   setShowFilter(true);
    // } else {
    //   setShowFilter(false);
    // }

    // Temporary purpose
    if (width <= 1400 && width >= 1000) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }

    // Temporary
    if (width <= 1001 && width >= 699) {
      setShowFilterTemp(true);
    } else {
      setShowFilterTemp(false);
    }

    if (width <= 700 && width >= 0) {
      setOpenGridModal(true);
    } else {
      setOpenGridModal(false);
    }
  };

  // cleared
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize1 = () => {
    const width = window.innerWidth;

    if (width <= 700) {
      setVisibleIndices([3, 4]);
    } else if (width <= 1400) {
      setVisibleIndices([0, 1]);
    } else {
      setVisibleIndices([0, 1, 2, 3, 4]);
    }

    // Your existing logic for setting other states
    setFilter(width <= 1400);
    setShowFilter(width <= 1400 && width >= 701);
    setOpenGridModal(width <= 700);
  };

  useEffect(() => {
    handleResize1();
    window.addEventListener("resize", handleResize1);
    return () => window.removeEventListener("resize", handleResize1);
  }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 1400) {
  //       setFilter(true);
  //       setShowFilter(true);
  //     } else {
  //       setFilter(false);
  //       setShowFilter(false);
  //     }
  //   };

  //   handleResize();

  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 700) {
  //       setOpenGridModal(true);
  //     } else {
  //       setOpenGridModal(false);
  //     }
  //   };

  //   handleResize();

  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // Working With API's

  const activeIconsBtns = [
    {
      name: "window",
      class1: "elv_filtered_prodlists_1",
      class2: "elv_filtered_image_1",
      class3: "elv_filtered_image_1_filter_click",
      calcWidth: "calc(100% / 2)",
    },
    {
      name: "apps",
      class1: "elv_filtered_prodlists_2",
      class2: "elv_filtered_image_2",
      class3: "elv_filtered_image_2_filter_click",
      calcWidth: "calc(100% / 3)",
    },
    {
      name: "view_grid",
      class1: "elv_filtered_prodlists_3",
      class2: "elv_filtered_image_3",
      class3: "elv_filtered_image_3_filter_click",
      calcWidth: "calc(100% / 4)",
    },
    {
      name: "single_view",
      class1: "elv_filtered_prodlists_4",
      class2: "elv_filtered_image_4",
      calcWidth: "calc(100% / 1)",
    },
    {
      name: "double_view",
      class1: "elv_filtered_prodlists_5",
      class2: "elv_filtered_image_5",
      calcWidth: "calc(100% / 2)",
    },
  ];

  useEffect(() => {
    let mtid = loginUserDetail?.MetalId ?? storeinit?.MetalId;
    if (mtid) setSelectedMetalId(mtid);

    let diaid = loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid;
    if (diaid) setSelectedDiaId(diaid);

    let csid = loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid;
    if (csid) setSelectedCsId(csid);
  }, [loginUserDetail, storeinit]);

  useEffect(() => {
    let params = getSession("menuparams");
    setMenuParams(params);

    let metalTypeDrpdown = getSession("metalTypeCombo");
    if (metalTypeDrpdown) {
      setMetaltype(metalTypeDrpdown);
      if (!selectedMetalId) {
        setCarat(metalTypeDrpdown?.[1]?.Metalid);
      }
    }

    let diamondTypeDrpdown = getSession("diamondQualityColorCombo");
    if (diamondTypeDrpdown) {
      setDiamondType(diamondTypeDrpdown);
      setClarity(
        diamondTypeDrpdown?.[0]?.Quality + "#" + diamondTypeDrpdown?.[0]?.color,
      );

      // If selectedDiaId is just a number and not the combined string format,
      // try to find a default or set to first item to ensure it's visible in the dropdown
      if (
        selectedDiaId &&
        !String(selectedDiaId).includes(",") &&
        diamondTypeDrpdown.length > 0
      ) {
        const firstCombo = `${diamondTypeDrpdown[0].QualityId},${diamondTypeDrpdown[0].ColorId}`;
        setSelectedDiaId(firstCombo);
      }
    }

    let CsQcCombo = getSession("ColorStoneQualityColorCombo");
    if (CsQcCombo) {
      setCsQcCombo(CsQcCombo);
    }
  }, [selectedDiaId]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !isOnlyProdLoading &&
      !isProdLoading &&
      productListData?.length > 0
    ) {
      const scrollToDesign = sessionStorage.getItem("scroll_to_product");
      if (scrollToDesign) {
        const timer = setTimeout(() => {
          const element = document.getElementById(
            `product-card-${scrollToDesign}`,
          );
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });
            sessionStorage.removeItem("scroll_to_product");
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [productListData, isOnlyProdLoading, isProdLoading]);

  let result = ParseAndDecodeSearchParams(searchParams);

  useEffect(() => {
    const fetchData = async () => {
      isInitialLoadRef.current = true;
      setIsOnlyProdLoading(true);
      setIsProdLoading(true);
      setProductListData([]);
      try {
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
        lastFetchedComboRef.current = obj;
        let UrlVal = result;
        let MenuVal = "";
        let SearchVar = "";
        let productlisttype;
        let NewArrivalVar = "";
        let TrendingVar = "";
        let BestSellerVar = "";
        let AlbumVar = "";
        const hasCollection = result?.includes("collection");
        UrlVal.forEach((ele) => {
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
              return "";
          }
        });

        if (MenuVal.length > 0) {
          let menuDecode = atob(MenuVal?.split("=")[1]);
          let key = menuDecode?.split("/")[1].split(",");
          let val = menuDecode?.split("/")[0].split(",");
          setIsBreadcumShow(true);
          productlisttype = [key, val];
          setDetailsMenu(productlisttype);
        }

        if (SearchVar) {
          productlisttype = SearchVar;
        }
        if (NewArrivalVar) {
          productlisttype = NewArrivalVar.split("=")[1];
        }
        if (TrendingVar) {
          productlisttype = TrendingVar.split("=")[1];
        }
        if (BestSellerVar) {
          productlisttype = BestSellerVar.split("=")[1];
        }

        if (AlbumVar) {
          productlisttype = AlbumVar.split("=")[1];
        }

        setprodListType(productlisttype);
        setDetailsMenu(productlisttype);
        setIsProdLoading(true);

        const effectiveSortBy = NewArrivalVar
          ? "New"
          : hasCollection
            ? "Design Set"
            : (sortBySelect ?? "Recommended");

        const DiaRange = parseRangeData(
          filterData,
          "Dia",
          sliderValue,
          inputDia,
        );
        const grossRange = parseRangeData(
          filterData,
          "Gross",
          sliderValue2,
          inputGross,
        );
        const netRange = parseRangeData(
          filterData,
          "net",
          sliderValue1,
          inputNet,
        );

        // 1. Check server cache first for instant render
        try {
          let cacheKey = null;
          const defaultMetal = loginUserDetail?.MetalId ?? storeinit?.MetalId;
          const defaultDia = loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid;
          const defaultCs = loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid;
          const defaultSort = NewArrivalVar ? "New" : (hasCollection ? "Design Set" : "Recommended");

          const isDefaultState = 
            (!obj?.mt || obj.mt === defaultMetal) &&
            (!obj?.dia || obj.dia === defaultDia) &&
            (!obj?.cs || obj.cs === defaultCs) &&
            (!effectiveSortBy || effectiveSortBy === defaultSort) &&
            (!DiaRange || (DiaRange.Minval === undefined && DiaRange.Maxval === undefined)) &&
            (!netRange || (netRange.Minval === undefined && netRange.Maxval === undefined)) &&
            (!grossRange || (grossRange.Minval === undefined && grossRange.Maxval === undefined));

          if (isDefaultState && searchParams && typeof searchParams === "object") {
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
            setProductListData(cachedRes?.pdList);
            setAfterFilterCount(cachedRes?.pdResp?.rd1?.[0]?.designcount);
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
              grossRange,
            );
            if (res) {
              setProductListData(res?.pdList);
              setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount);
              if (cacheKey) {
                writeCache(cacheKey, res).catch(() => {});
              }
            }
          }
        } catch (err) {
          console.error("ProductListApi error:", err);
        } finally {
          setIsProdLoading(false);
          setIsOnlyProdLoading(false);
        }

        // 2. Fetch Filter Sidebar Options AFTER ProductListApi completes with a 500ms delay (Prevents SQL query collision)
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const res1 = await FilterListAPI(productlisttype, cookie);
          if (res1) {
            setFilterData(res1);
            let priceFilter = JSON.parse(
              res1?.filter((ele) => ele.Name == "Price")[0]?.options,
            )[0];
            setFilterPriceSlider(priceFilter);
            let diafilter =
              res1?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    res1?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
                  )[0]
                : [];

            let diafilter1 =
              res1?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length >
              0
                ? JSON.parse(
                    res1?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
                  )[0]
                : [];

            let diafilter2 =
              res1?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length >
              0
                ? JSON.parse(
                    res1?.filter((ele) => ele?.Name == "Gross")[0]?.options,
                  )[0]
                : [];

            setSliderValue(
              diafilter?.Min != null || diafilter?.Max != null
                ? [diafilter.Min, diafilter.Max]
                : [],
            );
            setInputDia(
              diafilter?.Min != null || diafilter?.Max != null
                ? [diafilter.Min, diafilter.Max]
                : [],
            );
            setSliderValue1(
              diafilter1?.Min != null || diafilter1?.Max != null
                ? [diafilter1?.Min, diafilter1?.Max]
                : [],
            );
            setInputNet(
              diafilter1?.Min != null || diafilter1?.Max != null
                ? [diafilter1?.Min, diafilter1?.Max]
                : [],
            );
            setSliderValue2(
              diafilter2?.Min != null || diafilter2?.Max != null
                ? [diafilter2?.Min, diafilter2?.Max]
                : [],
            );
            setInputGross(
              diafilter2?.Min != null || diafilter2?.Max != null
                ? [diafilter2?.Min, diafilter2?.Max]
                : [],
            );
          }
        } catch (err) {
          console.error("FilterListAPI error:", err);
        }
      } catch (error) {
        console.error("Error fetching product list:", error);
        setIsProdLoading(false);
        setIsOnlyProdLoading(false);
      }
      isInitialLoadRef.current = false;
    };

    fetchData();

    if (location) {
      setLocationKey(location);
    }
    setCurrPage(1);
    setInputPage(1);

    const scrollToDesign = sessionStorage.getItem("scroll_to_product");
    if (!scrollToDesign) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location, searchParamsHook, syncProductList.ts, finalId]);

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handelPageChange = async (event, value) => {
    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    setProductListData([]);
    setIsOnlyProdLoading(true);
    setCurrPage(value);
    setInputPage(value);
    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
    const inputPriceField =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    if (inputPriceField) {
      const pricerange = { PriceMin: inputPrice[0], PriceMax: inputPrice[1] };
      output = { ...output, ...pricerange };
    }

    const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
    const grossRange = parseRangeData(
      filterData,
      "Gross",
      sliderValue2,
      inputGross,
    );
    const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

    let cacheKey = null;
    const defaultMetal = loginUserDetail?.MetalId ?? storeinit?.MetalId;
    const defaultDia = loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid;
    const defaultCs = loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid;
    const hasCollection = result?.includes("collection");
    const NewArrivalVar = result?.find((ele) => ele.charAt(0) === "N") || "";
    const defaultSort = NewArrivalVar ? "New" : (hasCollection ? "Design Set" : "Recommended");

    const isDefaultState = 
      value === 1 &&
      (!obj?.mt || obj.mt === defaultMetal) &&
      (!obj?.dia || obj.dia === defaultDia) &&
      (!obj?.cs || obj.cs === defaultCs) &&
      (!sortBySelect || sortBySelect === defaultSort) &&
      (!DiaRange || (DiaRange.Minval === undefined && DiaRange.Maxval === undefined)) &&
      (!netRange || (netRange.Minval === undefined && netRange.Maxval === undefined)) &&
      (!grossRange || (grossRange.Minval === undefined && grossRange.Maxval === undefined)) &&
      (!output || Object.keys(output).length === 0);

    if (isDefaultState && searchParams && typeof searchParams === "object") {
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
      setProductListData(cachedRes?.pdList);
      setAfterFilterCount(cachedRes?.pdResp?.rd1?.[0]?.designcount);
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
        grossRange,
      )
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount);
            if (cacheKey) {
              writeCache(cacheKey, res).catch(() => {});
            }
          }
          return res;
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setTimeout(() => {
            setIsOnlyProdLoading(false);
          }, 100);
        });
    }
  };

  const totalPages = Math.ceil(afterFilterCount / storeinit.PageSize);

  // Handle page change using the editable input
  const handlePageInputChange = (event) => {
    if (event.key === "Enter") {
      setProductListData([]);
      let newPage = parseInt(inputPage, 10);
      if (newPage < 1) newPage = 1; // Ensure the page is at least 1
      if (newPage > totalPages) newPage = totalPages; // Ensure the page doesn't exceed total pages
      setCurrPage(newPage);
      setInputPage(newPage);
      handelPageChange("", newPage);
    }
  };

  // Article-based architecture: callAllApi & MetalColorCombo disabled for performance
  // const callAllApi = async () => {
  //   let mtTypeLocal = getSession("metalTypeCombo");
  //   let diaQcLocal = getSession("diamondQualityColorCombo");
  //   let csQcLocal = getSession("ColorStoneQualityColorCombo");
  //   let mtColorLocal = getSession("MetalColorCombo");
  //
  //   const comboTasks = [];
  //
  //   if (!mtTypeLocal || mtTypeLocal?.length === 0) {
  //     comboTasks.push(
  //       MetalTypeComboAPI(cookie)
  //         .then((response) => {
  //           if (response?.Data?.rd) {
  //             let data = response?.Data?.rd;
  //             sessionStorage.setItem("metalTypeCombo", JSON.stringify(data));
  //             setMetaltype(data);
  //           }
  //         })
  //         .catch((err) => console.log("metalTypeCombo err", err)),
  //     );
  //   } else {
  //     setMetaltype(mtTypeLocal);
  //   }
  //
  //   if (!diaQcLocal || diaQcLocal?.length === 0) {
  //     comboTasks.push(
  //       DiamondQualityColorComboAPI()
  //         .then((response) => {
  //           if (response?.Data?.rd) {
  //             let data = response?.Data?.rd;
  //             sessionStorage.setItem(
  //               "diamondQualityColorCombo",
  //               JSON.stringify(data),
  //             );
  //             setDiamondType(data);
  //           }
  //         })
  //         .catch((err) => console.log("diaQcCombo err", err)),
  //     );
  //   } else {
  //     setDiamondType(diaQcLocal);
  //   }
  //
  //   if (!csQcLocal || csQcLocal?.length === 0) {
  //     comboTasks.push(
  //       ColorStoneQualityColorComboAPI()
  //         .then((response) => {
  //           if (response?.Data?.rd) {
  //             let data = response?.Data?.rd;
  //             sessionStorage.setItem(
  //               "ColorStoneQualityColorCombo",
  //               JSON.stringify(data),
  //             );
  //             setCsQcCombo(data);
  //           }
  //         })
  //         .catch((err) => console.log("csQcCombo err", err)),
  //     );
  //   } else {
  //     setCsQcCombo(csQcLocal);
  //   }
  //
  //   if (!mtColorLocal || mtColorLocal?.length === 0) {
  //     comboTasks.push(
  //       MetalColorCombo()
  //         .then((response) => {
  //           if (response?.Data?.rd) {
  //             let data = response?.Data?.rd;
  //             sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
  //             setMetalColorCombo(data);
  //           }
  //         })
  //         .catch((err) => console.log("metalColorCombo err", err)),
  //     );
  //   } else {
  //     setMetalColorCombo(mtColorLocal);
  //   }
  //
  //   if (comboTasks.length > 0) {
  //     await Promise.allSettled(comboTasks);
  //   }
  // };

  // useEffect(() => {
  //   callAllApi();
  // }, [loginUserDetail]);

  const handleSortby = async (e) => {
    setSortBySelect(e.target?.value);
    setProductListData([]);
    setIsOnlyProdLoading(true);

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
    const grossRange = parseRangeData(
      filterData,
      "Gross",
      sliderValue2,
      inputGross,
    );
    const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

    const inputPriceField =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    if (inputPriceField) {
      const pricerange = { PriceMin: inputPrice[0], PriceMax: inputPrice[1] };
      output = { ...output, ...pricerange };
    }

    setCurrPage(1);
    setInputPage(1);

    setIsOnlyProdLoading(true);
    let sortby = e.target?.value;

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortby,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
      });
  };

  const handelCustomCombo = (obj) => {
    lastFetchedComboRef.current = obj;
    let output = FilterValueWithCheckedOnly();
    setProductListData([]);
    if (location?.state?.SearchVal === undefined) {
      const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
      const grossRange = parseRangeData(
        filterData,
        "Gross",
        sliderValue2,
        inputGross,
      );
      const netRange = parseRangeData(
        filterData,
        "net",
        sliderValue1,
        inputNet,
      );

      const inputPriceField =
        JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

      if (inputPriceField) {
        const pricerange = { PriceMin: inputPrice[0], PriceMax: inputPrice[1] };
        output = { ...output, ...pricerange };
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
        grossRange,
      )
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          }
          return res;
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setTimeout(() => {
            sessionStorage.setItem("short_cutCombo_val", JSON?.stringify(obj));
            setIsOnlyProdLoading(false);
          }, 100);
        });
    }
  };

  useEffect(() => {
    if (isFirstComboRun.current) {
      isFirstComboRun.current = false;
      return;
    }
    if (isInitialLoadRef.current) {
      return;
    }
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    if (
      lastFetchedComboRef.current &&
      String(lastFetchedComboRef.current.mt) === String(selectedMetalId) &&
      String(lastFetchedComboRef.current.dia) === String(selectedDiaId) &&
      String(lastFetchedComboRef.current.cs) === String(selectedCsId)
    ) {
      return;
    }

    lastFetchedComboRef.current = obj;
    sessionStorage.setItem("short_cutCombo_val", JSON.stringify(obj));

    if (loginUserDetail && Object.keys(loginUserDetail).length > 0) {
      if (
        selectedMetalId != undefined ||
        selectedDiaId != undefined ||
        selectedCsId != undefined
      ) {
        if (
          String(loginUserDetail.MetalId) !== String(selectedMetalId) ||
          String(loginUserDetail.cmboDiaQCid) !== String(selectedDiaId) ||
          String(loginUserDetail.cmboCSQCid) !== String(selectedCsId)
        ) {
          obj;
        }
      }
    } else {
      if (storeinit && Object.keys(storeinit).length > 0) {
        if (
          selectedMetalId != undefined ||
          selectedDiaId != undefined ||
          selectedCsId != undefined
        ) {
          if (
            String(storeinit?.MetalId) !== String(selectedMetalId) ||
            String(storeinit?.cmboDiaQCid) !== String(selectedDiaId) ||
            String(storeinit?.cmboCSQCid) !== String(selectedCsId)
          ) {
            handelCustomCombo(obj);
          }
        }
      }
    }
  }, [selectedMetalId, selectedDiaId, selectedCsId]);

  // const handelFilterClearAll = () => {
  //   if (Object.values(filterChecked).filter((ele) => ele.checked)?.length > 0) {
  //     setFilterChecked({});
  //   }
  // };

  const handelFilterClearAll = () => {
    // setAfterCountStatus(true);
    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isFilterChecked = Object.values(filterChecked).some(
      (ele) => ele.checked,
    );
    const isSliderChanged =
      JSON.stringify(sliderValue) !==
        JSON.stringify(
          diafilter?.Min != null || diafilter?.Max != null
            ? [diafilter?.Min, diafilter?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue1) !==
        JSON.stringify(
          diafilter1?.Min != null || diafilter1?.Max != null
            ? [diafilter1?.Min, diafilter1?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue2) !==
        JSON.stringify(
          diafilter2?.Min != null || diafilter2?.Max != null
            ? [diafilter2?.Min, diafilter2?.Max]
            : [],
        );

    const isInputFields =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    // if (Object.values(filterChecked).filter((ele) => ele.checked)?.length > 0) {
    if (isFilterChecked || isSliderChanged || isInputFields) {
      let diafilter =
        filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
          ?.length > 0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
            )[0]
          : [];
      let diafilter1 =
        filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length >
        0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
            )[0]
          : [];
      let diafilter2 =
        filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length >
        0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
            )[0]
          : [];
      setSliderValue(
        diafilter?.Min != null || diafilter?.Max != null
          ? [diafilter.Min, diafilter.Max]
          : [],
      );
      setSliderValue1(
        diafilter1?.Min != null || diafilter1?.Max != null
          ? [diafilter1?.Min, diafilter1?.Max]
          : [],
      );
      setSliderValue2(
        diafilter2?.Min != null || diafilter2?.Max != null
          ? [diafilter2?.Min, diafilter2?.Max]
          : [],
      );
      setPriceRangeValue(["", ""]);
      setInputPrice(["", ""]);
      setInputDia(
        diafilter?.Min != null || diafilter?.Max != null
          ? [diafilter.Min, diafilter.Max]
          : [],
      );
      setInputNet(
        diafilter1?.Min != null || diafilter1?.Max != null
          ? [diafilter1?.Min, diafilter1?.Max]
          : [],
      );
      setInputGross(
        diafilter2?.Min != null || diafilter2?.Max != null
          ? [diafilter2?.Min, diafilter2?.Max]
          : [],
      );
      setAppliedRange1(["", ""]);
      setAppliedRange2(["", ""]);
      setAppliedRange3(["", ""]);
      setShow(false);
      setShow1(false);
      setShow2(false);
      setIsReset(false);
      setFilterChecked({});
      if (
        Object.keys(filterChecked).length > 0 ||
        isSliderChanged ||
        isInputFields
      ) {
        setIsClearAllClicked(true);
      }
    }
  };

  useEffect(() => {
    handelFilterClearAll();
  }, [location]); // location (pathname) changes on navigation — safe replacement for location.key

  const handleCartandWish = async (e, ele, type) => {
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

    if (type === "Wish") {
      setWishArr((prev) => ({
        ...prev,
        [ele?.autocode]: e.target.checked,
      }));
    }
    if (type === "Cart") {
      setCartArr((prev) => ({
        ...prev,
        [ele?.autocode]: e.target.checked,
      }));
    }

    if (e.target.checked) {
      await CartAndWishListAPI(type, prodObj, cookie)
        .then((res) => {
          if (res) {
            let cartC = res?.Data?.rd[0]?.Cartlistcount;
            let wishC = res?.Data?.rd[0]?.Wishlistcount;
            setWishCountNum(wishC);
            setCartCountNum(cartC);
            if (type === "Cart") {
              broadcast(
                "UPDATE_CART_COUNT",
                cartC,
                prodObj?.autocode,
                "cart",
                true,
              );
            } else {
              broadcast(
                "UPDATE_WISH_COUNT",
                wishC,
                prodObj?.autocode,
                "wish",
                true,
              );
            }
          }
        })
        .catch((err) => console.log("addtocartwishErr", err));
    } else {
      await RemoveCartAndWishAPI(
        type,
        ele?.autocode,
        cookie,
        false,
        "",
        ele?.ArticleNo,
      )
        .then((res1) => {
          if (res1) {
            let cartC = res1?.Data?.rd[0]?.Cartlistcount;
            let wishC = res1?.Data?.rd[0]?.Wishlistcount;
            setWishCountNum(wishC);
            setCartCountNum(cartC);
            if (type === "Cart") {
              broadcast(
                "UPDATE_CART_COUNT",
                cartC,
                prodObj?.autocode,
                "cart",
                false,
              );
            } else {
              broadcast(
                "UPDATE_WISH_COUNT",
                wishC,
                prodObj?.autocode,
                "wish",
                false,
              );
            }
          }
        })
        .catch((err) => console.log("removecartwishErr", err));
    }
  };

  const getDesignVideoFol = storeinit?.CDNVPath;

  const getDynamicImages = (designno, extension) => {
    // return `${getDesignImageFol}${designno}~${1}.${extension}`;
    return `${getDesignImageFol}${designno}~${1}.jpg`;
  };
  const getDynamicRollImages = (designno, count, extension) => {
    if (count > 1) {
      // return `${getDesignImageFol}${designno}~${2}.${extension}`;
      return `${getDesignImageFol}${designno}~${2}.jpg`;
    }
    return;
  };

  const getDynamicVideo = (designno, count, extension) => {
    if (extension && count > 0) {
      const url = `${getDesignVideoFol}${designno}~${1}.${extension}`;
      return url;
    }
    return;
  };
  const handleRangeFilterApi = async (Rangeval) => {
    setIsOnlyProdLoading(true);

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    setCurrPage(1);
    setInputPage(1);

    const inputPriceField =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    if (inputPriceField) {
      const pricerange = { PriceMin: inputPrice[0], PriceMax: inputPrice[1] };
      output = { ...output, ...pricerange };
    }

    const DiaRange = parseRangeData(filterData, "Dia", Rangeval, inputDia);
    const grossRange = parseRangeData(
      filterData,
      "Gross",
      sliderValue2,
      inputGross,
    );
    const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setIsOnlyProdLoading(false);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
      });

    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleRangeFilterApi1 = async (Rangeval1) => {
    setIsOnlyProdLoading(true);

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    const inputPriceField =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    if (inputPriceField) {
      const pricerange = { PriceMin: inputPrice[0], PriceMax: inputPrice[1] };
      output = { ...output, ...pricerange };
    }

    const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
    const grossRange = parseRangeData(
      filterData,
      "Gross",
      sliderValue2,
      inputGross,
    );
    const netRange = parseRangeData(filterData, "net", Rangeval1, inputNet);

    setCurrPage(1);
    setInputPage(1);

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setIsOnlyProdLoading(false);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
      });

    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleRangeFilterApi2 = async (Rangeval2) => {
    setIsOnlyProdLoading(true);
    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    const inputPriceField =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    if (inputPriceField) {
      const pricerange = { PriceMin: inputPrice[0], PriceMax: inputPrice[1] };
      output = { ...output, ...pricerange };
    }

    const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
    const grossRange = parseRangeData(
      filterData,
      "Gross",
      Rangeval2,
      inputGross,
    );
    const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

    setCurrPage(1);
    setInputPage(1);

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setIsOnlyProdLoading(false);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
      });

    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(() => {
    if (lastSyncData && lastSyncData.autocode) {
      const { autocode, type, status } = lastSyncData;
      if (type === "cart") {
        setCartArr((prev) => ({
          ...prev,
          [autocode]: status,
        }));
      } else if (type === "wish") {
        setWishArr((prev) => ({
          ...prev,
          [autocode]: status,
        }));
      }
    }
  }, [lastSyncData]);

  const debouncedRangeFilterApi = useMemo(
    () => debounce((value) => handleRangeFilterApi(value), 500),
    [],
  );

  const debouncedRangeFilterApi1 = useMemo(
    () => debounce((value) => handleRangeFilterApi1(value), 500),
    [],
  );

  const debouncedRangeFilterApi2 = useMemo(
    () => debounce((value) => handleRangeFilterApi2(value), 500),
    [],
  );

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    debouncedRangeFilterApi(newValue);
  };
  const handleSliderChange1 = (event, newValue) => {
    setSliderValue1(newValue);
    debouncedRangeFilterApi1(newValue);
  };
  const handleSliderChange2 = (event, newValue) => {
    setSliderValue2(newValue);
    debouncedRangeFilterApi2(newValue);
  };

  const debounceTimeout = useRef(null);

  const handleInputChange = (index) => (event) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    const newSliderValue = [...sliderValue];
    newSliderValue[index] = newValue;
    setSliderValue(newSliderValue);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleRangeFilterApi(newSliderValue);
    }, 1000);
  };

  const handleInputChange1 = (index) => (event) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    const newSliderValue = [...sliderValue1];
    newSliderValue[index] = newValue;
    setSliderValue1(newSliderValue);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleRangeFilterApi(newSliderValue);
    }, 1000);
  };

  const handleInputChange2 = (index) => (event) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    const updatedSlider = [...sliderValue2];
    updatedSlider[index] = newValue;
    setSliderValue2(updatedSlider);

    // Debounce API call
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleRangeFilterApi2(updatedSlider);
    }, 1000); // adjust delay if needed
  };

  const resetRangeFilter = async ({
    filterName,
    setSliderValue,
    setTempSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    setIsShowBtn,
    show,
    setShow,
    setAppliedRange,
  }) => {
    try {
      const res1 = await FilterListAPI(prodListType, cookie);
      const optionsRaw = res1?.find((f) => f?.Name === filterName)?.options;

      if (optionsRaw) {
        const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
        const resetValue = [Min, Max];
        setSliderValue(resetValue);
        setTempSliderValue(resetValue);
        handleRangeFilterApi("");
        setAppliedRange(["", ""]);
        // handleRangeFilterApi(resetValue);
        setIsShowBtn?.(false);
        if (show) setShow(false);
      }
    } catch (error) {
      console.error(`Failed to reset filter "${filterName}":`, error);
    }
  };

  const RangeFilterView = ({
    ele,
    sliderValue,
    setSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    setShow,
    show,
    setAppliedRange1,
    appliedRange1,
  }) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = Number(parsedOptions.Min || 0); // Ensure min is a number
    const max = Number(parsedOptions.Max || 100);
    const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current = tempSliderValue.map(
        (_, i) => inputRefs.current[i] ?? React.createRef(),
      );
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
      if (e.key === "Enter") {
        if (index < tempSliderValue.length - 1) {
          inputRefs.current[index + 1]?.current?.focus();
        } else {
          handleSave(); // last input triggers apply
        }
      }
    };

    useEffect(() => {
      if (Array.isArray(sliderValue) && sliderValue.length === 2) {
        setTempSliderValue(sliderValue);
      }
    }, [sliderValue]);

    const handleInputChange = (index) => (event) => {
      const value = event.target.value === "" ? "" : Number(event.target.value);
      const updated = [...tempSliderValue];
      updated[index] = value;
      setTempSliderValue(updated);
      setIsShowBtn(
        updated[0] !== sliderValue[0] || updated[1] !== sliderValue[1],
      );
    };

    const handleSliderChange = (_, newValue) => {
      setTempSliderValue(newValue);
      setIsShowBtn(
        newValue[0] !== sliderValue[0] || newValue[1] !== sliderValue[1],
      );
    };

    const handleSave = () => {
      const [minDiaWt, maxDiaWt] = tempSliderValue;

      // Empty or undefined
      if (
        minDiaWt == null ||
        maxDiaWt == null ||
        minDiaWt === "" ||
        maxDiaWt === ""
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Not a number
      if (isNaN(minDiaWt) || isNaN(maxDiaWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Negative values
      if (minDiaWt < 0 || maxDiaWt < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Equal values
      if (Number(minDiaWt) === Number(maxDiaWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Min > Max
      if (Number(minDiaWt) > Number(maxDiaWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Below actual min
      if (minDiaWt < min) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Above actual max
      if (maxDiaWt > max) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      setSliderValue(tempSliderValue);
      setTempSliderValue(tempSliderValue);
      handleRangeFilterApi(tempSliderValue);
      setIsShowBtn(false);
      setAppliedRange1([min, max]);
      setShow(true);
    };

    return (
      <div style={{ position: "relative" }}>
        {appliedRange1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              position: "absolute",
              top: "-12px",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange1[0] !== "" ? `Min: ${appliedRange1[0]}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange1[1] !== "" ? `Max: ${appliedRange1[1]}` : ""}
            </Typography>
          </div>
        )}

        <Slider
          value={tempSliderValue}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={0.001}
          disableSwap
          valueLabelDisplay="off"
          sx={{ marginTop: 1, transition: "all 0.2s ease-out" }}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-around",
          }}
        >
          {tempSliderValue.map((val, index) => (
            <Input
              key={index}
              value={val}
              inputRef={inputRefs.current[index]}
              onKeyDown={handleKeyDown(index)}
              onChange={handleInputChange(index)}
              inputProps={{ step: 0.001, min, max, type: "number" }}
              sx={{
                textAlign: "center",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#111",
                border: "1px solid #d3d3d3", // light gray border
                borderRadius: 0,
                padding: "6px 10px",
                transition: "border-color 0.2s ease",

                "&:hover": {
                  borderColor: "#c0c0c0",
                },
                "&.Mui-focused": {
                  borderColor: "#000", // black when focused
                },
                "& input": {
                  textAlign: "center",
                },
              }}
            />
          ))}
        </div>

        <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
          {show && (
            <Button
              variant="outlined"
              sx={{ paddingBottom: "0" }}
              onClick={() =>
                resetRangeFilter({
                  filterName: "Diamond",
                  setSliderValue: setSliderValue,
                  setTempSliderValue,
                  handleRangeFilterApi: handleRangeFilterApi,
                  prodListType,
                  cookie,
                  setIsShowBtn,
                  show: show,
                  setShow: setShow,
                  setAppliedRange: setAppliedRange1,
                })
              }
              color="error"
            >
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button
              variant="outlined"
              sx={{ paddingBottom: "0" }}
              onClick={handleSave}
              color="success"
            >
              Apply
            </Button>
          )}
        </Stack>
      </div>
    );
  };

  const RangeFilterView1 = ({
    ele,
    sliderValue1,
    setSliderValue1,
    handleRangeFilterApi1,
    prodListType,
    cookie,
    show1,
    setShow1,
    setAppliedRange2,
    appliedRange2,
  }) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = parsedOptions.Min || "";
    const max = parsedOptions.Max || "";
    const [tempSliderValue, setTempSliderValue] = useState(sliderValue1);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current = tempSliderValue.map(
        (_, i) => inputRefs.current[i] ?? React.createRef(),
      );
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
      if (e.key === "Enter") {
        if (index < tempSliderValue.length - 1) {
          inputRefs.current[index + 1]?.current?.focus();
        } else {
          handleSave(); // last input triggers apply
        }
      }
    };

    useEffect(() => {
      if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
        setTempSliderValue(sliderValue1);
      }
    }, [sliderValue1]);

    useEffect(() => {
      if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
        setTempSliderValue(sliderValue1);
      }
    }, [sliderValue1]);

    const handleInputChange = (index) => (event) => {
      const newValue =
        event.target.value === "" ? "" : Number(event.target.value);
      const updated = [...tempSliderValue];
      updated[index] = newValue;
      setTempSliderValue(updated);
      setIsShowBtn(
        updated[0] !== sliderValue1[0] || updated[1] !== sliderValue1[1],
      );
    };

    const handleSliderChange = (_, newValue) => {
      setTempSliderValue(newValue);
      setIsShowBtn(
        newValue[0] !== sliderValue1[0] || newValue[1] !== sliderValue1[1],
      );
    };

    const handleSave = () => {
      const [minNetWt, maxNetWt] = tempSliderValue;

      if (
        minNetWt == null ||
        maxNetWt == null ||
        minNetWt === "" ||
        maxNetWt === ""
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (isNaN(minNetWt) || isNaN(maxNetWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (minNetWt < 0 || maxNetWt < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // 👇 New specific validation
      if (Number(minNetWt) === Number(maxNetWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (Number(minNetWt) > Number(maxNetWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (minNetWt < min) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (maxNetWt > max) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      setSliderValue1(tempSliderValue);
      setTempSliderValue(tempSliderValue);
      handleRangeFilterApi1(tempSliderValue);
      setAppliedRange2([min, max]);

      setIsShowBtn(false);
      setShow1(true);
    };

    return (
      <div style={{ position: "relative" }}>
        {appliedRange2 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              position: "absolute",
              top: "-12px",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange2[0] !== "" ? `Min: ${appliedRange2[0]}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange2[1] !== "" ? `Max: ${appliedRange2[1]}` : ""}
            </Typography>
          </div>
        )}

        <Slider
          value={tempSliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          min={min}
          max={max}
          step={0.001}
          disableSwap
          sx={{
            marginTop: "5px",
            transition: "all 0.2s ease-out",
            "& .MuiSlider-valueLabel": { display: "none" },
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-around",
          }}
        >
          {tempSliderValue.map((val, index) => (
            <Input
              key={index}
              inputRef={inputRefs.current[index]}
              onKeyDown={handleKeyDown(index)}
              value={val}
              onChange={handleInputChange(index)}
              inputProps={{ step: 0.001, min, max, type: "number" }}
              sx={{
                textAlign: "center",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#111",
                border: "1px solid #d3d3d3", // light gray border
                borderRadius: 0,
                padding: "6px 10px",
                transition: "border-color 0.2s ease",

                "&:hover": {
                  borderColor: "#c0c0c0",
                },
                "&.Mui-focused": {
                  borderColor: "#000", // black when focused
                },
                "& input": {
                  textAlign: "center",
                },
              }}
            />
          ))}
        </div>
        <Stack flexDirection="row" justifyContent="flex-end" gap={1} mt={1}>
          {show1 && (
            <Button
              variant="outlined"
              sx={{ paddingBottom: "0" }}
              onClick={() =>
                resetRangeFilter({
                  filterName: "NetWt",
                  setSliderValue: setSliderValue1,
                  setTempSliderValue,
                  handleRangeFilterApi: handleRangeFilterApi1,
                  prodListType,
                  cookie,
                  setIsShowBtn,
                  show: show1,
                  setShow: setShow1,
                  setAppliedRange: setAppliedRange2,
                })
              }
              color="error"
            >
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button
              variant="outlined"
              sx={{ paddingBottom: "0" }}
              onClick={handleSave}
              color="success"
            >
              Apply
            </Button>
          )}
        </Stack>
      </div>
    );
  };

  const RangeFilterView2 = ({
    ele,
    sliderValue2,
    setSliderValue2,
    handleRangeFilterApi2,
    prodListType,
    cookie,
    show2,
    setShow2,
    setAppliedRange3,
    appliedRange3,
  }) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = parsedOptions.Min ?? "";
    const max = parsedOptions.Max ?? "";
    const [tempSliderValue, setTempSliderValue] = useState(sliderValue2);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current = tempSliderValue.map(
        (_, i) => inputRefs.current[i] ?? React.createRef(),
      );
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
      if (e.key === "Enter") {
        if (index < tempSliderValue.length - 1) {
          inputRefs.current[index + 1]?.current?.focus();
        } else {
          handleSave(); // last input triggers apply
        }
      }
    };

    useEffect(() => {
      if (Array.isArray(sliderValue2) && sliderValue2.length === 2) {
        setTempSliderValue(sliderValue2);
      }
    }, [sliderValue2]);

    const handleInputChange = (index) => (event) => {
      const newValue =
        event.target.value === "" ? "" : Number(event.target.value);
      const updated = [...tempSliderValue];
      updated[index] = newValue;
      setTempSliderValue(updated);
      setIsShowBtn(
        updated[0] !== sliderValue2[0] || updated[1] !== sliderValue2[1],
      );
    };

    const handleSliderChange = (_, newValue) => {
      setTempSliderValue(newValue);
      setIsShowBtn(
        newValue[0] !== sliderValue2[0] || newValue[1] !== sliderValue2[1],
      );
    };

    const handleSave = () => {
      const [minWeight, maxWeight] = tempSliderValue;

      // Validation: Empty or undefined
      if (
        minWeight == null ||
        maxWeight == null ||
        minWeight === "" ||
        maxWeight === ""
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Not a number
      if (isNaN(minWeight) || isNaN(maxWeight)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Negative values
      if (minWeight < 0 || maxWeight < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // 👇 New specific validation
      if (Number(minWeight) === Number(maxWeight)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Min > Max
      if (Number(minWeight) > Number(maxWeight)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Range must stay within allowed min and max
      if (minWeight < min) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (maxWeight > max) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // If validation passes, update the parent state and handle the API call
      setSliderValue2(tempSliderValue);
      setTempSliderValue(tempSliderValue);
      handleRangeFilterApi2(tempSliderValue);
      setAppliedRange3([min, max]);
      setIsShowBtn(false);
      setShow2(true);
    };

    return (
      <div style={{ position: "relative" }}>
        {appliedRange3 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              position: "absolute",
              top: "-12px",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange3[0] !== "" ? `Min: ${appliedRange3[0]}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange3[1] !== "" ? `Max: ${appliedRange3[1]}` : ""}
            </Typography>
          </div>
        )}

        <Slider
          value={tempSliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          min={min}
          max={max}
          step={0.001}
          disableSwap
          sx={{
            marginTop: "5px",
            transition: "all 0.2s ease-out",
            "& .MuiSlider-valueLabel": { display: "none" },
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-around",
          }}
        >
          {tempSliderValue.map((val, index) => (
            <Input
              key={index}
              inputRef={inputRefs.current[index]}
              value={val}
              onKeyDown={handleKeyDown(index)}
              onChange={handleInputChange(index)}
              inputProps={{ step: 0.001, type: "number" }}
              sx={{
                textAlign: "center",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#111",
                border: "1px solid #d3d3d3", // light gray border
                borderRadius: 0,
                padding: "6px 10px",
                transition: "border-color 0.2s ease",

                "&:hover": {
                  borderColor: "#c0c0c0",
                },
                "&.Mui-focused": {
                  borderColor: "#000", // black when focused
                },
                "& input": {
                  textAlign: "center",
                },
              }}
            />
          ))}
        </div>

        <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
          {show2 && (
            <Button
              variant="outlined"
              sx={{ paddingBottom: "0" }}
              onClick={() =>
                resetRangeFilter({
                  filterName: "Gross",
                  setSliderValue: setSliderValue2,
                  setTempSliderValue,
                  handleRangeFilterApi: handleRangeFilterApi2,
                  prodListType,
                  cookie,
                  setIsShowBtn,
                  show: show2,
                  setShow: setShow2,
                  setAppliedRange: setAppliedRange3,
                })
              }
              color="error"
            >
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button
              variant="outlined"
              sx={{ paddingBottom: "0" }}
              onClick={handleSave}
              color="success"
            >
              Apply
            </Button>
          )}
        </Stack>
      </div>
    );
  };

  const handleMoveToDetail = (productData, imageUrl) => {
    let output = FilterValueWithCheckedOnly();
    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: selectedMetalId,
      d: selectedDiaId,
      c: selectedCsId,
      f: output,
      g: detailsMenu,
      img: getCardImageUrl(productData), // always use color-smart resolver; plain imageUrl from listing card has no color suffix
      ArticleNo: productData?.ArticleNo,
      ArticleId: productData?.ArticleId ?? null, // pass clicked article id for default customizer selection
      title: productData?.TitleLine ?? "",
      nwt: productData?.Nwt ?? 0,
      price: productData?.UnitCostWithMarkUp ?? 0,
      mediaDet: productData?.ImageVideoDetail ?? "",
    };
    // compressAndEncode(JSON.stringify(obj))

    // decodeAndDecompress()

    let encodeObj = compressAndEncode(JSON.stringify(obj));

    // Save target designno in sessionStorage to restore scroll position later
    if (typeof window !== "undefined") {
      sessionStorage.setItem("scroll_to_product", productData?.ArticleNo);
    }

    const url = `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`;

    navigate.push(url);
  };

  const handleBreadcums = (mparams, isCollectionMenu) => {
    if (isCollectionMenu) {
      navigate.push("/collection");
      return;
    }
    let key = Object?.keys(mparams);
    let val = Object?.values(mparams);

    let KeyObj = {};
    let ValObj = {};

    key.forEach((value, index) => {
      let keyName = `FilterKey${index === 0 ? "" : index}`;
      KeyObj[keyName] = value;
    });

    val.forEach((value, index) => {
      let keyName = `FilterVal${index === 0 ? "" : index}`;
      ValObj[keyName] = value;
    });

    let finalData = { ...KeyObj, ...ValObj };

    const queryParameters1 = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join("/");

    const queryParameters = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join(",");

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(",");

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;

    const url = `/p/${BreadCumsObj()?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
    // const url = `/p?V=${queryParameters}/K=${otherparamUrl}`;

    navigate.push(url);

    // console.log("mparams", KeyObj, ValObj)
  };

  const DynamicListPageTitleLineFunc = () => {
    // FIX 2026-04-29: location is plain pathname string from usePathname().
    // Use window.location.search to get the query string safely.
    const searchStr =
      typeof window !== "undefined" ? window.location.search : "";
    if (searchStr.charAt(1) === "S") {
      return (
        decodeURIComponent(location?.split("/")[2]) || "ELvee Jewels Pvt. Ltd."
      );
    } else {
      const menuName = BreadCumsObj()?.menuname;
      return menuName ? menuName : "ELvee Jewels Pvt. Ltd.";
    }
  };

  const BreadCumsObj = () => {
    // FIX 2026-04-29: location is a plain pathname string like "/p/MenuName/Rings/..."
    // window.location.search holds "?M=encodedBase64"
    const searchStr =
      typeof window !== "undefined" ? window.location.search : "";
    let BreadCum;
    try {
      BreadCum = decodeURI(atob(searchStr.slice(3)))?.split("/");
    } catch (_) {
      BreadCum = ["", ""];
    }

    const values = BreadCum[0]?.split(",");
    const labels = BreadCum[1]?.split(",");

    const updatedBreadCum = labels?.reduce((acc, label, index) => {
      acc[label] = values[index] || "";
      return acc;
    }, {});

    let result =
      updatedBreadCum &&
      Object.entries(updatedBreadCum)?.reduce((acc, [key, value], index) => {
        acc[`FilterKey${index === 0 ? "" : index}`] =
          key.charAt(0).toUpperCase() + key.slice(1);
        acc[`FilterVal${index === 0 ? "" : index}`] = value;
        return acc;
      }, {});

    result = result || {};
    result.menuname = decodeURI(location)
      ?.slice(3)
      ?.slice(0, -1)
      ?.split("/")[0];

    return result;
  };

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const CustomLabel = ({ text }) => (
    <Typography
      sx={{
        fontFamily: "inherit",
        color: "#111",
        fontWeight: 500,
        fontSize: {
          xs: "14px !important",
          sm: "14px !important",
          md: "14px !important",
          lg: "13.6px !important",
          xl: "14px !important",
        },
      }}
    >
      {text}
    </Typography>
  );

  const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginInline: "0px",
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: 500,
    color: "#111111",
    paddingBlock: "3px",
    flexDirection: "row",
    width: "100%",
  }));

  const showClearAllButton = () => {
    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isFilterChecked = Object.values(filterChecked).some(
      (ele) => ele.checked,
    );
    const isSliderChanged =
      JSON.stringify(sliderValue) !==
        JSON.stringify(
          diafilter?.Min != null || diafilter?.Max != null
            ? [diafilter?.Min, diafilter?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue1) !==
        JSON.stringify(
          diafilter1?.Min != null || diafilter1?.Max != null
            ? [diafilter1?.Min, diafilter1?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue2) !==
        JSON.stringify(
          diafilter2?.Min != null || diafilter2?.Max != null
            ? [diafilter2?.Min, diafilter2?.Max]
            : [],
        );

    const isInputFields =
      JSON.stringify(inputPrice) !== JSON.stringify(["", ""]);

    return isFilterChecked || isSliderChanged || isInputFields;
  };

  const PriceRangeInputs = ({
    priceValue,
    setpriceValue,
    lowestPrice,
    highestPrice,
    setLowestPrice,
    setHighestPrice,
    setProductListData,
    setAfterFilterCount,
    setPriceRangeValue,
    setIsOnlyProdLoading,
    selectedMetalId,
    selectedDiaId,
    selectedCsId,
    prodListType,
    cookie,
    filterChecked,
    isReset,
    setIsReset,
  }) => {
    const [initialPriceValue] = useState(priceValue); // store initial price range only once
    const [tempPriceRange, setTempPriceRange] = useState(priceValue);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const secondInputRef = useRef(null);

    const handleFirstKeyDown = (e) => {
      if (e.key === "Enter") {
        secondInputRef.current?.focus();
      }
    };

    const handleSecondKeyDown = (e) => {
      if (e.key === "Enter") {
        handleApply();
      }
    };

    useEffect(() => {
      const hasPriceChecked = Object.values(filterChecked).some(
        (item) => item.type === "Price" && item.checked,
      );

      if (hasPriceChecked) {
        setTempPriceRange(priceValue);
      }
    }, [filterChecked]);

    const handlePriceRangeChange = (index) => (event) => {
      const value = event.target.value === "" ? "" : Number(event.target.value);
      const updatedRange = [...tempPriceRange];
      updatedRange[index] = value;
      setTempPriceRange(updatedRange);

      // Show apply/reset button only if values are changed from initial
      setIsShowBtn(
        updatedRange[0] !== initialPriceValue[0] ||
          updatedRange[1] !== initialPriceValue[1],
      );
    };

    const DiaRange = parseRangeData(filterData, "Dia", sliderValue, inputDia);
    const grossRange = parseRangeData(
      filterData,
      "Gross",
      sliderValue2,
      inputGross,
    );
    const netRange = parseRangeData(filterData, "net", sliderValue1, inputNet);

    const handleApply = async () => {
      const [min, max] = tempPriceRange;

      if (
        min == null ||
        max == null ||
        min === "" ||
        max === "" ||
        min === undefined ||
        max === undefined
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Not a number
      if (isNaN(min) || isNaN(max)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Negative values
      if (min < 0 || max < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Min > Max
      if (Number(min) > Number(max)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Min == Max
      if (Number(min) === Number(max)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // setLowestPrice(min);
      // setHighestPrice(max);
      setPriceRangeValue(tempPriceRange);
      setInputPrice(tempPriceRange);
      setIsShowBtn(false);
      setIsOnlyProdLoading(true);
      setIsReset(true);

      let output = FilterValueWithCheckedOnly();

      const inputPriceField =
        JSON.stringify(tempPriceRange) !== JSON.stringify(["", ""]);

      if (inputPriceField) {
        const pricerange = { PriceMin: min, PriceMax: max };
        output = { ...output, ...pricerange };
      }

      const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      Object.keys(filterChecked).forEach((key) => {
        if (filterChecked[key].type === "Price") {
          filterChecked[key] = {
            ...filterChecked[key],
            checked: false,
            value: {},
          };
        }
      });

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
          grossRange,
        );

        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
      } catch (error) {
        console.error("Price range apply failed:", error);
      } finally {
        setIsOnlyProdLoading(false);
      }

      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    };

    const handleReset = async () => {
      setIsShowBtn(false);
      setIsOnlyProdLoading(true);
      setIsReset(false);
      const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

      let output = FilterValueWithCheckedOnly();

      const inputPriceField =
        JSON.stringify(tempPriceRange) !== JSON.stringify(["", ""]);

      if (inputPriceField) {
        const pricerange = {};
        output = { ...output, ...pricerange };
      }

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
          grossRange,
        );
        if (res) {
          const productList = res?.pdList || [];
          setProductListData(productList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);

          const high = productList.reduce(
            (max, item) => Math.max(max, item.UnitCostWithMarkUpIncTax),
            0,
          );
          const low = productList.reduce((min, item) => {
            const value = item.UnitCostWithMarkUpIncTax;
            return value > 0 ? Math.min(min, value) : min;
          }, Infinity);

          setLowestPrice(low);
          setHighestPrice(high);

          const resetRange = [low, high];
          setTempPriceRange(["", ""]);
          setPriceRangeValue(["", ""]);
          setInputPrice(["", ""]);
        }
      } catch (error) {
        console.error("Price range reset failed:", error);
      } finally {
        setIsOnlyProdLoading(false);
      }

      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    };

    return (
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          padding: 2,
          width: "100%",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Price Range
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" mb={0.5}>
              Min Price
            </Typography>
            <Input
              fullWidth
              value={tempPriceRange[0]}
              onWheel={(e) => e.target.blur()}
              onChange={handlePriceRangeChange(0)}
              onKeyDown={handleFirstKeyDown}
              inputProps={{
                type: "number",
                style: {
                  MozAppearance: "textfield",
                },
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" mb={0.5}>
              Max Price
            </Typography>
            <Input
              fullWidth
              inputRef={secondInputRef}
              value={tempPriceRange[1]}
              onWheel={(e) => e.target.blur()}
              onChange={handlePriceRangeChange(1)}
              onKeyDown={handleSecondKeyDown}
              inputProps={{
                type: "number",
                style: {
                  MozAppearance: "textfield",
                },
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" mt={1} spacing={1}>
          {isReset && (
            <Button variant="outlined" onClick={handleReset} color="error">
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button variant="outlined" onClick={handleApply} color="success">
              Apply
            </Button>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <title>{DynamicListPageTitleLineFunc()}</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbData)),
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
          IsBreadCumShow={IsBreadCumShow}
          BreadCumsObj={BreadCumsObj}
          handleBreadcums={handleBreadcums}
          isFiltering={isOnlyProdLoading || isProdLoading}
        />

        <Drawer
          anchor="left"
          open={openFilter}
          onClose={() => setOpenFilter(false)}
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
            onClose={() => setOpenFilter(false)}
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
          onFilterToggle={() => setOpenFilter(!openFilter)}
          filterCount={afterFilterCount}
          storeinit={storeinit}
          isFiltering={isOnlyProdLoading || isProdLoading}
          // Clear All
          anyFilterApplied={anyFilterApplied}
          handelFilterClearAll={handelFilterClearAll}
        />

        <JewelryProductGrid
          productListData={productListData}
          isFiltering={isOnlyProdLoading || isProdLoading}
          handleMoveToDetail={handleMoveToDetail}
          showFilter={showFilter}
          filter={filter}
          filterData={filterData}
          handleCartandWish={handleCartandWish}
          cartArr={cartArr}
          wishArr={wishArr}
          storeinit={storeinit}
          loginUserDetail={loginUserDetail}
        />

        {storeinit?.IsProductListPagination == 1 &&
          Math.ceil(afterFilterCount / storeinit.PageSize) > 1 && (
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

export default ProductList;
