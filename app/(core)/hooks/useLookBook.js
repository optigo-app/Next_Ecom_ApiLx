"use client";
import React, { useEffect, useRef, useState } from "react";
import gradientColors from "@/app/theme/fgstore.web/Lookbook/color.json";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { LookBookAPI } from "@/app/(core)/utils/API/FilterAPI/LookBookAPI";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { formatRedirectTitleLine, formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import Pako from "pako";

const useLookBook = ({ storeInit }) => {
  const { loginUserDetail, islogin, setCartCountNum } = useStore();
  const location = useNextRouterLikeRR();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [imageUrlDesignSet, setImageUrlDesignSet] = useState();
  const isMobileScreen = useMediaQuery("(max-width:800px)");
  const isEditablePage = 1;

  const [designSetLstData, setDesignSetListData] = useState();
  const [dstCount, setDstCount] = useState();
  const [filterData, setFilterData] = useState([]);
  const [filterChecked, setFilterChecked] = useState({});
  const [afterFilterCount, setAfterFilterCount] = useState();
  const [selectedMetalId, setSelectedMetalId] = useState(loginUserDetail?.MetalId ?? "");
  const [selectedDiaId, setSelectedDiaId] = useState(loginUserDetail?.cmboDiaQCid ?? "");
  const [selectedCsId, setSelectedCsId] = useState(loginUserDetail?.cmboCSQCid ?? "");
  const [productListData, setProductListData] = useState([]);
  const [locationKey, setLocationKey] = useState();
  const [cartItems, setCartItems] = useState([]);
  const [isProdLoading, setIsProdLoading] = useState(true);
  const [isPgLoading, setIsPgLoading] = useState(false);
  const navigate = location.push;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [isShowfilter, setIsShowFilter] = useState(false);
  const SwiperSlideRef = useRef();
  const [DynamicSize, setDynamicSize] = useState({ w: 0, h: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(currentPage);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  let maxwidth464px = useMediaQuery("(max-width:464px)");
  const [imageLoadError, setImageLoadError] = useState({});
  const imageNotFound = "/Assets/image-not-found.jpg";

  const handleImageError = (index) => {
    setImageLoadError((prev) => ({ ...prev, [index]: true }));
  };

  const updateSize = () => {
    if (SwiperSlideRef.current) {
      const { offsetWidth } = SwiperSlideRef.current;
      setDynamicSize({ w: `${offsetWidth}px`, h: `${offsetWidth}px` });
      console.log("Size updated:", offsetWidth, offsetWidth);
    }
  };
  const handleResize = () => {
    updateSize();
  };
  const handleKeyDown = (e) => {
    if (e.key === "F12") {
      handleResize();
    }
  };
  const handleImageLoad = () => {
    updateSize();
  };
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDynamicSize({ w: `${width}px`, h: `${height}px` });
        console.log("Resized:", width, height);
      }
    });

    if (SwiperSlideRef.current) {
      resizeObserver.observe(SwiperSlideRef.current);
      updateSize();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setImageLoadError({});
  }, [currentPage, filterChecked]);

  const handlePrevious = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  const prevFilterChecked = useRef();

  useEffect(() => {
    setImageLoadError({});

    // Store the previous filterChecked state
    const previousChecked = prevFilterChecked.current;
    prevFilterChecked.current = filterChecked;

    const isFilterChanged = JSON.stringify(previousChecked) !== JSON.stringify(filterChecked);

    // If the filter has changed (or its length is > 0), reset page to 1, otherwise keep the current page
    if (isFilterChanged) {
      setCurrentPage(1);
      setInputPage(1);
    }

    setImageUrl(storeInit?.DesignSetImageFol);
    // setImageUrlDesignSet(storeInit?.CDNDesignImageFol);
    setImageUrlDesignSet(storeInit?.CDNDesignImageFolThumb);

    const { IsB2BWebsite } = storeInit || {};
    const visiterID = Cookies.get("visiterId");

    const finalID = IsB2BWebsite === 0 ? (islogin === false ? visiterID : loginUserDetail?.id || "0") : loginUserDetail?.id || "0";

    const output = FilterValueWithCheckedOnly();

    if (Object?.keys(filterChecked)?.length >= 0) {
      setIsProdLoading(true);
      setIsPgLoading(true);
      Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETDesignSet_List", finalID, output, isFilterChanged ? 1 : currentPage, itemsPerPage)
        .then((response) => {
          if (response?.Data?.rd) {
            setDesignSetListData(response?.Data?.rd);
            setDstCount(response?.Data?.rd1[0]?.TotalCount);

            const initialCartItems = response?.Data?.rd.flatMap((slide) =>
              parseDesignDetails(slide?.Designdetail)
                .filter((detail) => detail?.IsInCart === 1)
                .map((detail) => detail.autocode)
            );
            setIsProdLoading(false);
            setCartItems((prevCartItems) => [
              ...new Set([...prevCartItems, ...initialCartItems]), // Use Set to avoid duplicates
            ]);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setIsProdLoading(false);
          setIsPgLoading(false);
        });
    }
  }, [filterChecked, islogin]);

  useEffect(() => {
    const loginUserDetail = JSON?.parse(sessionStorage.getItem("loginUserDetail"));
    const storeInit = JSON?.parse(sessionStorage.getItem("storeInit"));
    const { IsB2BWebsite } = storeInit;
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    let productlisttype = {
      FilterKey: "GETDesignSet_List",
      FilterVal: "GETDesignSet_List",
    };
    LookBookAPI(productlisttype, finalID)
      .then((res) => setFilterData(res))
      .catch((err) => console.log("err", err));
  }, []);

  const handelFilterClearAll = () => {
    if (Object?.values(filterChecked)?.filter((ele) => ele?.checked)?.length > 0) {
      setFilterChecked({});
      setThumbsSwiper(null);
    }
  };

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
    setThumbsSwiper(null);
  };

  const handleFilterShow = () => {
    setIsShowFilter(!isShowfilter);
  };

  const FilterValueWithCheckedOnly = () => {
    let onlyTrueFilterValue = Object.values(filterChecked).filter((ele) => ele.checked);

    const priceValues = onlyTrueFilterValue.filter((item) => item.type === "Price").map((item) => item.value);

    const output = {};

    onlyTrueFilterValue.forEach((item) => {
      if (!output[item.type]) {
        output[item.type] = "";
      }

      if (item.type == "Price") {
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

    // if

    return output;
  };

  const ProdCardImageFunc = (pd) => {
    let finalprodListimg;
    if (pd?.DefaultImageName) {
      finalprodListimg = imageUrl + pd?.designsetuniqueno + "/" + pd?.DefaultImageName;
    } else {
      finalprodListimg = "a.jpg";
    }
    return finalprodListimg;
  };

  const getRandomBgColor = (index) => {
    const colorsLength = gradientColors.length;
    return gradientColors[index % colorsLength];
  };

  const parseDesignDetails = (details) => {
    try {
      return JSON?.parse(details);
    } catch (error) {
      console.error("Error parsing design details:", error);
      return [];
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("Ring");
  let cookie = Cookies.get("visiterId");

  const handleAddToCart = (ele, type) => {
    let loginInfo = JSON?.parse(sessionStorage.getItem("loginUserDetail"));

    let prodObj = {
      autocode: ele?.autocode,
      Metalid: loginInfo?.MetalId,
      MetalColorId: ele?.MetalColorid,
      DiaQCid: loginInfo?.cmboDiaQCid,
      CsQCid: loginInfo?.cmboCSQCid,
      Size: ele?.DefaultSize,
      Unitcost: ele?.UnitCost,
      markup: ele?.DesignMarkUp,
      UnitCostWithmarkup: formatter(ele?.UnitCostWithMarkUp),
      Remark: "",
    };

    setCartItems((prevCartItems) => [...prevCartItems, ele?.autocode]);

    CartAndWishListAPI(type, prodObj, cookie)
      .then((res) => {
        let cartC = res?.Data?.rd[0]?.Cartlistcount;
        setCartCountNum(cartC);
      })
      .catch((err) => console.log("err", err));
  };

  const handleRemoveCart = async (ele) => {
    try {
      const res = await RemoveCartAndWishAPI("Cart", ele?.autocode, cookie);
      let cartC = res?.Data?.rd[0]?.Cartlistcount;
      setCartCountNum(cartC);

      // Use a callback to update the state
      setCartItems((prevCartItems) => {
        const updatedCartItems = prevCartItems.filter((item) => item !== ele?.autocode);
        return updatedCartItems;
      });
    } catch (err) {
      console.log("Error removing from cart", err);
    }
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const createProdObj = (ele, loginInfo) => {
    return {
      autocode: ele?.autocode,
      Metalid: loginInfo?.MetalId ?? "",
      MetalColorId: ele?.MetalColorid,
      DiaQCid: loginInfo?.cmboDiaQCid,
      CsQCid: loginInfo?.cmboCSQCid,
      Size: ele?.DefaultSize,
      Unitcost: ele?.UnitCost,
      markup: ele?.DesignMarkUp,
      UnitCostWithmarkup: formatter(ele?.UnitCostWithMarkUp),
      Remark: "",
    };
  };

  const handleByCombo = (data) => {
    let loginInfo = JSON?.parse(sessionStorage.getItem("loginUserDetail"));
    let prodObjs = data.map((detail) => createProdObj(detail, loginInfo));
    setCartItems((prevItems) => [...prevItems, ...data.map((detail) => detail.autocode)]);
    CartAndWishListAPI("Cart", prodObjs, cookie, "look")
      .then((res) => {
        let cartC = res?.Data?.rd[0]?.Cartlistcount;
        setCartCountNum(cartC);
      })
      .catch((err) => console.log("err", err));
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleNavigation = (designNo, autoCode, titleLine ,productData) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
      i: productData?.MetalColorid,
      l: productData?.ImageExtension,
      count: productData?.ImageCount,
    };
    };
    let encodeObj = compressAndEncode(JSON?.stringify(obj));
    navigate(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const categoryOptions = JSON?.parse(filterData?.find((item) => item.id === "category")?.options ?? "[]");
    const categoryNames = categoryOptions?.map((opt) => opt.Name);
    setSelectedCategories((prevSelected) => {
      return prevSelected.length > 0 ? prevSelected : categoryNames;
    });
  }, [filterData]);

  const handleCheckboxChangeNew = (e, categoryId) => {
    const isChecked = e.target.checked;

    setSelectedCategories((prevSelected) => {
      const updatedSelected = isChecked ? [...prevSelected, categoryId] : prevSelected.filter((id) => id !== categoryId);
      handelPageChange("", 1);

      return updatedSelected;
    });
  };

  const filterDesignSetsByCategory = (designSetLstData, selectedCategories) => {
    if (selectedCategories.length === 0) return designSetLstData;

    return designSetLstData
      ?.map((set) => ({
        ...set,
        Designdetail: JSON?.stringify(JSON?.parse(set.Designdetail)?.filter((detail) => selectedCategories?.includes(detail.CategoryName))),
      }))
      ?.filter((set) => JSON?.parse(set.Designdetail).length > 0);
  };

  const filteredDesignSetLstData = filterDesignSetsByCategory(designSetLstData, selectedCategories);

  const calculateTotalUnitCostWithMarkUp = (details) => {
    let total = 0;
    details.forEach((detail) => {
      total += detail.UnitCostWithMarkUp;
    });
    return total;
  };

  const calculateTotalUnitCostWithMarkUpGWt = (details) => {
    let total = 0;
    details.forEach((detail) => {
      total += detail.Gwt;
    });
    return total;
  };

  const calculateTotalUnitCostWithMarkUpNwt = (details) => {
    let total = 0;
    details.forEach((detail) => {
      total += detail.Nwt;
    });
    return total;
  };

  const calculateTotalUnitCostWithMarkUpDwt = (details) => {
    let total = 0;
    details.forEach((detail) => {
      total += detail.Dwt;
    });
    return total;
  };

  const sortDesignDetailsBySrNo = (details) => {
    return details.sort((a, b) => a.SrNo - b.SrNo);
  };

  const [dataKey, seyDataKey] = useState(null);

  const handleHoverImages = (data) => {
    seyDataKey(data);
  };

  const [selectedValue, setSelectedValue] = useState(1);

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue !== null) {
      setSelectedValue(newValue);
      setThumbsSwiper(null);
    }
  };

  function checkImageAvailability(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }

  const [imageSources, setImageSources] = React.useState({});

  useEffect(() => {
    if (filteredDesignSetLstData && Array.isArray(filteredDesignSetLstData)) {
      const imagePromises = filteredDesignSetLstData.flatMap((slide) =>
        parseDesignDetails(slide?.Designdetail).map(async (detail) => {
          const designImageUrl = `${imageUrlDesignSet}${detail?.designno}~1.jpg`;
          return {
            designno: detail?.designno,
            src: designImageUrl,
          };
        })
      );

      Promise.all(imagePromises).then((results) => {
        const newImageSources = results.reduce((acc, { designno, src }) => {
          acc[designno] = src;
          return acc;
        }, {});

        setImageSources((prevSources) => {
          const isDifferent = Object.keys(newImageSources).some((key) => newImageSources[key] !== prevSources[key]);
          return isDifferent ? newImageSources : prevSources;
        });
      });
    }
  }, [filteredDesignSetLstData, imageUrlDesignSet]);

  const handlePageInputChange = (event) => {
    if (event.key === "Enter") {
      let newPage = parseInt(inputPage, 10);
      if (newPage < 1) newPage = 1; // Ensure the page is at least 1
      if (newPage > totalPages) newPage = totalPages; // Ensure the page doesn't exceed total pages
      setCurrentPage(newPage);
      setInputPage(newPage);
      handelPageChange("", newPage);
    }
  };

  const totalPages = Math.ceil(dstCount / itemsPerPage);

  // pagination HandleChange Function for change page
  const handelPageChange = (event, value) => {
    setThumbsSwiper(null);
    setCurrentPage(value);
    setInputPage(value);
    const { IsB2BWebsite } = storeInit || {};
    const visiterID = Cookies.get("visiterId");

    const finalID = IsB2BWebsite === 0 ? (islogin === false ? visiterID : loginUserDetail?.id || "0") : loginUserDetail?.id || "0";

    const output = FilterValueWithCheckedOnly();

    if (Object.keys(filterChecked)?.length >= 0) {
      setIsProdLoading(true);
      setIsPgLoading(true);
      Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETDesignSet_List", finalID, output, value, itemsPerPage)
        .then((response) => {
          if (response?.Data?.rd) {
            setDesignSetListData(response?.Data?.rd);
            setDstCount(response?.Data?.rd1[0]?.TotalCount);

            const initialCartItems = response?.Data?.rd.flatMap((slide) =>
              parseDesignDetails(slide?.Designdetail)
                .filter((detail) => detail?.IsInCart === 1)
                .map((detail) => detail.autocode)
            );
            setIsProdLoading(false);
            setCartItems((prevCartItems) => [
              ...new Set([...prevCartItems, ...initialCartItems]), // Use Set to avoid duplicates
            ]);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setIsProdLoading(false);
          setIsPgLoading(false);
        });
    }
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  return {
    // Core states
    loginUserDetail ,
    islogin,
    
    thumbsSwiper,
    setThumbsSwiper,
    imageUrl,
    imageUrlDesignSet,
    isMobileScreen,
    isEditablePage,
    designSetLstData,
    setDesignSetListData,
    dstCount,
    filterData,
    setFilterData,
    filterChecked,
    setFilterChecked,
    afterFilterCount,
    selectedMetalId,
    setSelectedMetalId,
    selectedDiaId,
    setSelectedDiaId,
    selectedCsId,
    setSelectedCsId,
    productListData,
    setProductListData,
    locationKey,
    setLocationKey,
    cartItems,
    setCartItems,
    isProdLoading,
    setIsProdLoading,
    isPgLoading,
    setIsPgLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    swiper,
    setSwiper,
    isShowfilter,
    setIsShowFilter,
    SwiperSlideRef,
    DynamicSize,
    setDynamicSize,
    currentPage,
    setCurrentPage,
    inputPage,
    setInputPage,
    itemsPerPage,
    setItemsPerPage,
    maxwidth464px,
    imageLoadError,
    imageNotFound,
    selectedCategory,
    setSelectedCategory,
    open,
    setOpen,
    selectedCategories,
    setSelectedCategories,
    filteredDesignSetLstData,
    imageSources,
    setImageSources,
    totalPages,
    dataKey,
    seyDataKey,
    selectedValue,
    setSelectedValue,
  
    // Navigation + hooks
    navigate,
    location,
  
    // Handlers
    handleImageError,
    handleResize,
    handleKeyDown,
    handleImageLoad,
    handlePrevious,
    handleNext,
    handelFilterClearAll,
    handleCheckboxChange,
    handleFilterShow,
    ProdCardImageFunc,
    getRandomBgColor,
    parseDesignDetails,
    handleAddToCart,
    handleRemoveCart,
    handleByCombo,
    handleOpen,
    handleClose,
    handleNavigation,
    handleCheckboxChangeNew,
    handleHoverImages,
    handleChange,
    handlePageInputChange,
    handelPageChange,
  
    // Utils
    FilterValueWithCheckedOnly,
    decodeEntities,
    createProdObj,
    compressAndEncode,
    filterDesignSetsByCategory,
    calculateTotalUnitCostWithMarkUp,
    calculateTotalUnitCostWithMarkUpGWt,
    calculateTotalUnitCostWithMarkUpNwt,
    calculateTotalUnitCostWithMarkUpDwt,
    sortDesignDetailsBySrNo,
    checkImageAvailability,
  };
  
export default useLookBook;
