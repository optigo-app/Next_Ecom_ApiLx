"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Lookbook.modul.scss";
import gradientColors from "./color.json";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  Modal,
  PaginationItem,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  tooltipClasses,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MuiPagination from '@mui/material/Pagination';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Cookies from "js-cookie";
import { LookBookAPI } from "@/app/(core)/utils/API/FilterAPI/LookBookAPI";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  FreeMode,
  Navigation,
  Thumbs,
  Scrollbar,
  Keyboard,
} from "swiper/modules";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import Pako from "pako";
import { IoClose } from "react-icons/io5";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LocalMallIcon from "@mui/icons-material/LocalMall";

import { formatRedirectTitleLine, formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LookbookSkeleton from "./lookbookSkelton";
import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const Lookbook = ({ storeInit }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [imageUrlDesignSet, setImageUrlDesignSet] = useState();

  const { islogin, loginUserDetail, setCartCountNum } = useStore();

  const noimage = "./image-not-found.jpg";
  const imageNotFound = "./image-not-found.jpg";

  const [imageSources, setImageSources] = React.useState({});
  const [designSetLstData, setDesignSetListData] = useState();
  const [filterData, setFilterData] = useState([]);
  const [filterChecked, setFilterChecked] = useState({});
  const setCartCountVal = setCartCountNum;
  const [cartItems, setCartItems] = useState([]);
  const [isProdLoading, setIsProdLoading] = useState(true);
  let navigate = useNextRouterLikeRR();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [isShowfilter, setIsShowFilter] = useState(false);
  const SwiperSlideRef = useRef();
  const [DynamicSize, setDynamicSize] = useState({ w: 0, h: 0 });
  const [dstCount, setDstCount] = useState();
  const [isPgLoading, setIsPgLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  let maxwidth464px = useMediaQuery('(max-width:464px)');
  const [imageLoadError, setImageLoadError] = useState({});
  const [inputPage, setInputPage] = useState(currentPage);

  console.log("kiokik", Math.ceil(dstCount / itemsPerPage) > 1)

  const handleImageError = (index, e) => {
    setImageLoadError((prev) => ({ ...prev, [index]: true }));
    e.target.src = noimage;
  };

  const isEditablePage = 1;

  useEffect(() => {
    setImageLoadError({})
  }, [currentPage, filterChecked])

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
    if (e.key === 'F12') {
      handleResize(); // Call handleResize function when F12 is pressed
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
    const loginUserDetail = JSON?.parse(sessionStorage.getItem("loginUserDetail"));

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

    const finalID = IsB2BWebsite === 0
      ? (islogin === false ? visiterID : loginUserDetail?.id || "0")
      : loginUserDetail?.id || "0";

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
      setThumbsSwiper(null)
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
    setIsShowFilter(!isShowfilter)
  }

  const FilterValueWithCheckedOnly = () => {
    let onlyTrueFilterValue = Object.values(filterChecked).filter(
      (ele) => ele.checked
    );

    const priceValues = onlyTrueFilterValue
      .filter((item) => item.type === "Price")
      .map((item) => item.value);

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

  // useEffect(() => {
  //   const loginUserDetail = JSON?.parse(sessionStorage.getItem("loginUserDetail"));
  //   const storeInit = JSON?.parse(sessionStorage.getItem("storeInit"));
  //   const { IsB2BWebsite } = storeInit;

  //   const visiterID = Cookies.get("visiterId");
  //   let finalID;
  //   if (IsB2BWebsite == 0) {
  //     finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
  //   } else {
  //     finalID = loginUserDetail?.id || "0";
  //   }

  //   let output = FilterValueWithCheckedOnly();
  //   if (Object.keys(filterChecked)?.length >= 0) {
  //     Get_Tren_BestS_NewAr_DesigSet_Album("GETDesignSet_List", finalID, output, currentPage, itemsPerPage)
  //       .then((response) => {
  //         if (response?.Data?.rd) {
  //           setDesignSetListData(response?.Data?.rd);
  //           setDstCount(response?.Data?.rd1[0]?.TotalCount)
  //           const initialCartItems = response?.Data?.rd.flatMap((slide) =>
  //             parseDesignDetails(slide?.Designdetail)
  //               .filter((detail) => detail?.IsInCart === 1)
  //               .map((detail) => detail.autocode)
  //           );
  //           setCartItems((prevCartItems) => [
  //             ...new Set([...prevCartItems, ...initialCartItems]),
  //           ]); // Use Set to avoid duplicates
  //           setIsProdLoading(false);
  //           setIsPgLoading(false);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [filterChecked, currentPage]);

  const ProdCardImageFunc = (pd) => {
    let finalprodListimg;
    if (pd?.DefaultImageName) {
      finalprodListimg =
        imageUrl + pd?.designsetuniqueno + "/" + pd?.DefaultImageName;
    } else {
      finalprodListimg = 'a.jpg';
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
        setCartCountVal(cartC);
      })
      .catch((err) => console.log("err", err));
  };

  const handleRemoveCart = async (ele) => {
    try {
      const res = await RemoveCartAndWishAPI("Cart", ele?.autocode, cookie);
      let cartC = res?.Data?.rd[0]?.Cartlistcount;
      setCartCountVal(cartC);

      // Use a callback to update the state
      setCartItems((prevCartItems) => {
        const updatedCartItems = prevCartItems.filter(
          (item) => item !== ele?.autocode
        );
        console.log(
          "Updated cartItems inside setState callback:",
          updatedCartItems
        );
        return updatedCartItems;
      });
    } catch (err) {
      console.log("Error removing from cart", err);
    }
  };

  // const handleCategoryChange = (e) => {
  //     setSelectedCategory(e.target.value);
  // };

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
    setCartItems((prevItems) => [
      ...prevItems,
      ...data.map((detail) => detail.autocode),
    ]);
    CartAndWishListAPI("Cart", prodObjs, cookie, "look")
      .then((res) => {
        let cartC = res?.Data?.rd[0]?.Cartlistcount;
        setCartCountVal(cartC);
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

  const handleNavigation = (designNo, autoCode, titleLine, productData) => {
    console.log("TCL: handleNavigation -> productData", productData)
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
    let encodeObj = compressAndEncode(JSON?.stringify(obj));

    navigate.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {

    const categoryOptions = JSON?.parse(
      filterData?.find((item) => item.id === "category")?.options ?? "[]"
    );
    const categoryNames = categoryOptions?.map((opt) => opt.Name);
    setSelectedCategories((prevSelected) => {
      return prevSelected.length > 0 ? prevSelected : categoryNames;
    });
  }, [filterData]);

  const handleCheckboxChangeNew = (e, categoryId) => {
    const isChecked = e.target.checked;

    setSelectedCategories((prevSelected) => {
      const updatedSelected = isChecked
        ? [...prevSelected, categoryId]
        : prevSelected.filter((id) => id !== categoryId);
      handelPageChange("", 1)

      return updatedSelected;
    });
  };

  const filterDesignSetsByCategory = (designSetLstData, selectedCategories) => {
    // Return the original data if no categories are selected
    if (selectedCategories.length === 0) return designSetLstData;

    return designSetLstData
      ?.map((set) => {
        const details = JSON?.parse(set?.Designdetail);
        // Filter details based on selected categories
        const filteredDetails = details.filter((detail) =>
          selectedCategories.includes(detail.CategoryName)
        );

        // Return the modified set only if there are filtered details
        return {
          ...set,
          Designdetail: JSON.stringify(filteredDetails), // Convert back to string
        };
      })
      ?.filter((set) => {
        // Keep sets that have non-empty Designdetail
        const details = JSON.parse(set.Designdetail);
        return details.length > 0;
      });
  };

  const filteredDesignSetLstData = filterDesignSetsByCategory(
    designSetLstData,
    selectedCategories
  );

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
  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedValue(newValue);
      setThumbsSwiper(null);
    }
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const CustomTooltipContent = ({ categories }) => (
    <div>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );


  function checkImageAvailability(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }

  const CustomLabel = ({ text }) => (
    <Typography
      sx={{
        fontFamily: "sans-serif",
        fontSize: {
          xs: "13.2px !important", // Mobile screens
          sm: "14.1px !important", // Tablets
          md: "15.2px !important", // Desktop screens
          lg: "15.6px !important", // Large desktops
          xl: "15.8px !important", // Extra large screens
        },
      }}
    >
      {text}
    </Typography>
  );

  const isCategoryPresent = filterData?.some(ele => ele?.Name === "Category" && ele?.id === "category");

  const handlePageInputChange = (event) => {
    if (event.key === 'Enter') {
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

    const finalID = IsB2BWebsite === 0
      ? (islogin === false ? visiterID : loginUserDetail?.id || "0")
      : loginUserDetail?.id || "0";

    const output = FilterValueWithCheckedOnly();

    if (Object.keys(filterChecked)?.length >= 0) {
      setIsProdLoading(true);
      setIsPgLoading(true);
      Get_Tren_BestS_NewAr_DesigSet_Album("GETDesignSet_List", finalID, output, value, itemsPerPage)
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
      behavior: 'smooth',
      top: 0
    })
  };

  useEffect(() => {
    if (filteredDesignSetLstData && Array.isArray(filteredDesignSetLstData)) {
      const imagePromises = filteredDesignSetLstData.flatMap((slide) =>
        parseDesignDetails(slide?.Designdetail).map(async (detail) => {
          // const designImageUrl = `${imageUrlDesignSet}${detail?.designno}_1.${detail?.ImageExtension}`;
          // const designImageUrl = `${imageUrlDesignSet}${detail?.designno}~1.${detail?.ImageExtension}`;
          const designImageUrl = `${imageUrlDesignSet}${detail?.designno}~1.jpg`;
          const isAvailable = await checkImageAvailability(designImageUrl);
          return {
            designno: detail?.designno,
            src: isAvailable ? designImageUrl : imageNotFound,
          };
        })
      );

      Promise.all(imagePromises).then((results) => {
        const newImageSources = results.reduce((acc, { designno, src }) => {
          acc[designno] = src;
          return acc;
        }, {});

        setImageSources((prevSources) => {
          const isDifferent = Object.keys(newImageSources).some(
            (key) => newImageSources[key] !== prevSources[key]
          );
          return isDifferent ? newImageSources : prevSources;
        });
      });
    }
  }, [filteredDesignSetLstData, imageUrlDesignSet]);

  return (
    <div className="hoq_LookBookMain">
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        className="hoq_filterDrawer"
        sx={{
          zIndex: 9999999,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        {filterData?.length > 0 && (
          <div
            className="hoq1_lookBookFilterSubDiv"
            style={{ padding: "20px" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <IoClose
                style={{
                  width: "30px",
                  height: "30px",
                  color: "rgba(143, 140, 139, 0.9019607843)",
                }}
                onClick={() => setIsDrawerOpen(false)}
              />
            </div>
            <div className="hoq_filter_text" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Typography sx={{
                color: "gray !important",
                borderRadius: 0,
                fontWeight: 500,
                fontSize: "18px",
                fontFamily: "Tenor Sans , sans-serif",
              }}>Filters</Typography>
              <span onClick={() => handelFilterClearAll()} style={{ cursor: "pointer" }}>
                {Object.values(filterChecked).filter((ele) => ele.checked)
                  ?.length > 0
                  ? "Clear All"
                  : ""}
              </span>
            </div>
            <div style={{ marginTop: "12px", width: "250px" }}>
              {filterData?.map((ele) => (
                <>
                  {!ele?.id?.includes("Range") &&
                    !ele?.id?.includes("Price") && (
                      <Accordion
                        elevation={0}
                        sx={{
                          borderBottom: "1px solid #c7c8c9",
                          borderRadius: 0,
                          "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
                            borderBottomLeftRadius: "0px",
                            borderBottomRightRadius: "0px",
                          },
                          "&.MuiPaper-root.MuiAccordion-root:before": {
                            background: "none",
                          },
                        }}
                      // expanded={accExpanded}
                      // defaultExpanded={}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                          sx={{
                            color: "gray !important",
                            borderRadius: 0,
                            fontWeight: 500,
                            fontFamily: "Tenor Sans , sans-serif",
                            "&.MuiAccordionSummary-root": {
                              padding: 0,
                            },
                          }}
                        // className="filtercategoryLable"
                        >
                          {/* <span> */}
                          {ele.Name}
                          {/* </span> */}
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            minHeight: "fit-content",
                            maxHeight: "300px",
                            overflow: "auto",
                          }}
                        >
                          {(JSON?.parse(ele?.options) ?? [])?.map((opt) => (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                              }}
                              key={opt?.id}
                            >
                              {/* <small
                                        style={{
                                          fontFamily: "TT Commons, sans-serif",
                                          color: "#7f7d85",
                                        }}
                                      >
                                        {opt.Name}
                                      </small> */}
                              <FormControlLabel
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  flexDirection: "row-reverse",
                                }}
                                control={
                                  <Checkbox
                                    name={`${ele?.id}${opt?.id}`}
                                    // checked={
                                    //   filterChecked[`checkbox${index + 1}${i + 1}`]
                                    //     ? filterChecked[`checkbox${index + 1}${i + 1}`]?.checked
                                    //     : false
                                    // }
                                    checked={
                                      filterChecked[`${ele?.id}${opt?.id}`]
                                        ?.checked === undefined
                                        ? false
                                        : filterChecked[`${ele?.id}${opt?.id}`]
                                          ?.checked
                                    }
                                    style={{
                                      color: "#7d7f85 !important",
                                      padding: 0,
                                      width: "10px",
                                    }}
                                    onClick={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        ele?.id,
                                        opt?.Name
                                      )
                                    }
                                    size="small"
                                  />
                                }
                                // sx={{
                                //   display: "flex",
                                //   justifyContent: "space-between", // Adjust spacing between checkbox and label
                                //   width: "100%",
                                //   flexDirection: "row-reverse", // Align items to the right
                                //   fontFamily:'TT Commons Regular'
                                // }}
                                className="hoq_mui_checkbox_label"
                                label={<CustomLabel text={opt?.Name} />}
                              />
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    )}
                  {ele?.id?.includes("Price") && (
                    <Accordion
                      elevation={0}
                      sx={{
                        borderBottom: "1px solid #c7c8c9",
                        borderRadius: 0,
                        "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
                          borderBottomLeftRadius: "0px",
                          borderBottomRightRadius: "0px",
                        },
                        "&.MuiPaper-root.MuiAccordion-root:before": {
                          background: "none",
                        },
                      }}
                    // expanded={accExpanded}
                    // defaultExpanded={}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          color: "gray !important",
                          borderRadius: 0,
                          fontWeight: 500,
                          fontFamily: "Tenor Sans , sans-serif",

                          "&.MuiAccordionSummary-root": {
                            padding: 0,
                          },
                        }}
                      // className="filtercategoryLable"
                      >
                        {/* <span> */}
                        {ele.Name}
                        {/* </span> */}
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          minHeight: "fit-content",
                          maxHeight: "300px",
                          overflow: "auto",
                        }}
                      >
                        {(JSON?.parse(ele?.options) ?? [])?.map((opt, i) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                            }}
                            key={i}
                          >
                            {/* <small
                                        style={{
                                          fontFamily: "TT Commons, sans-serif",
                                          color: "#7f7d85",
                                        }}
                                      >
                                        {opt.Name}
                                      </small> */}
                            <FormControlLabel
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                flexDirection: "row-reverse",
                              }}
                              control={
                                <Checkbox
                                  name={`Price${i}${i}`}
                                  // checked={
                                  //   filterChecked[`checkbox${index + 1}${i + 1}`]
                                  //     ? filterChecked[`checkbox${index + 1}${i + 1}`]?.checked
                                  //     : false
                                  // }
                                  checked={
                                    filterChecked[`Price${i}${i}`]?.checked ===
                                      undefined
                                      ? false
                                      : filterChecked[`Price${i}${i}`]?.checked
                                  }
                                  style={{
                                    padding: 0,
                                    width: "10px",
                                  }}
                                  onClick={(e) =>
                                    handleCheckboxChange(e, ele?.id, opt)
                                  }
                                  size="small"
                                />
                              }
                              // sx={{
                              //   display: "flex",
                              //   justifyContent: "space-between", // Adjust spacing between checkbox and label
                              //   width: "100%",
                              //   flexDirection: "row-reverse", // Align items to the right
                              //   fontFamily:'TT Commons Regular'
                              // }}
                              className="hoq_mui_checkbox_label"
                              // label={
                              //   opt?.Minval == 0
                              //     ? `Under ${decodeEntities(
                              //       storeInit?.Currencysymbol
                              //     )}${opt?.Maxval}`
                              //     : opt?.Maxval == 0
                              //       ? `Over ${decodeEntities(
                              //         storeInit?.Currencysymbol
                              //       )}${opt?.Minval}`
                              //       : `${decodeEntities(
                              //         storeInit?.Currencysymbol
                              //       )}${opt?.Minval} - ${decodeEntities(
                              //         storeInit?.Currencysymbol
                              //       )}${opt?.Maxval}`
                              // }
                              label={
                                <CustomLabel
                                  text={
                                    opt?.Minval == 0
                                      ? `Under ${loginUserDetail?.CurrencyCode ??
                                      storeInit?.CurrencyCode
                                      }${opt?.Maxval}`
                                      : opt?.Maxval == 0
                                        ? `Over ${loginUserDetail?.CurrencyCode ??
                                        storeInit?.CurrencyCode
                                        }${opt?.Minval}`
                                        : `${loginUserDetail?.CurrencyCode ??
                                        storeInit?.CurrencyCode
                                        }${opt?.Minval} - ${loginUserDetail?.CurrencyCode ??
                                        storeInit?.CurrencyCode
                                        }${opt?.Maxval}`
                                  }
                                />
                              }
                            />
                          </div>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  )}
                </>
              ))}
            </div>
          </div>
        )
        }
      </Drawer >
      <Modal
        open={open}
        sx={{
          zIndex: 8898
        }}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="hoqlookBookPopuMain"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
          className="hoq_lookBookCategoryPoupuBox"
        >
          <div onClick={handleClose} className="hoq_lookSubCtSaveBtn">
            <IoClose
              style={{ height: "25px", width: "25px", color: "#000000ab" }}
            />
          </div>

          {filterData?.map((ele) => (
            <React.Fragment key={ele.id}>
              {ele?.id === "category" && (
                <Accordion
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
                      borderBottomLeftRadius: "0px",
                      borderBottomRightRadius: "0px",
                    },
                    "&.MuiPaper-root.MuiAccordion-root:before": {
                      background: "none",
                    },
                  }}
                  expanded={true}
                >
                  <p
                    style={{
                      color: "#7f7d85",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    {ele.Name}
                  </p>
                  <AccordionDetails
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      minHeight: "fit-content",
                      maxHeight: "300px",
                      overflow: "auto",
                    }}
                  >
                    {(JSON?.parse(ele?.options) ?? [])?.map((opt) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                        key={opt?.id}
                      >
                        <FormControlLabel
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                          control={
                            <Checkbox
                              name={`${ele?.id}${opt?.id}`}
                              checked={selectedCategories.includes(opt?.Name)}
                              style={{
                                color: "#c20000",
                                padding: 0,
                                width: "10px",
                              }}
                              onClick={(e) =>
                                handleCheckboxChangeNew(e, opt?.Name)
                              }
                              size="small"
                            />
                          }
                          className="hoq_mui_checkbox_label"
                          label={<CustomLabel text={opt?.Name} />}
                        />
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Modal>

      {
        isProdLoading ? (
          // true ?
          <div style={{ marginInline: "6%", backgroundColor: "white" }}>
            {/* <ProductListSkeleton /> */}
            <LookbookSkeleton param={1} />
          </div>
        ) : (
          <div className="hoq1_LookBookSubMainDiv">
            <div
              className="hoq_lookBookMobileTopLine"
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0px 5px 25px 5px",
                gap: "20px",
              }}
            >
              {filterData?.length > 0 && <div
                className="hoq_lookBook_FilterIconeDiv"
                // onClick={handleFilterShow}
                style={{ fontSize: "12px" }}
                onClick={() => setIsDrawerOpen(true)}
              >
                {/* {isShowfilter ? "HIDE FILTER" : "SHOW FILTER"} */}
                {/* <FilterListIcon style={{ color: "white" }} /> */}
                <div className="12">
                  <FilterAltIcon
                    fontSize="large"
                    style={{ color: "#fff" }}
                    onClick={() => setIsDrawerOpen(true)}
                  />
                </div>
              </div>}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <div className="filter_hoq_icon">
                  <FilterAltIcon
                    fontSize="large"
                    style={{ color: "#c0bbb1" }}
                    className="hoq_lookBookMobileFilter"
                    onClick={() => setIsDrawerOpen(true)}
                  />
                </div>
                <div className="sec_hoq_right">
                  {isCategoryPresent &&
                    <button
                      onClick={() => handleOpen()}
                      className="hoq_lookBookSelectViewBtn"
                      style={{
                        background: "#c20000",
                        color: "#fff",
                        marginRight: "20px",
                      }}
                    >
                      Set View
                    </button>
                  }
                  <ToggleButtonGroup
                    size="medium"
                    value={selectedValue}
                    exclusive
                    onChange={handleChange}
                    aria-label="text alignment"
                    sx={{
                      height: "35px",
                      borderRadius: "0px",
                      ".Mui-selected": {
                        backgroundColor: "#7d7f856e",
                        color: "#fff",
                      },
                      ".MuiToggleButton-root": {
                        borderRadius: "0px",
                        "&:not(.Mui-selected)": {
                          backgroundColor: "transparent",
                          color: "#000",
                        },
                      },
                    }}
                  >
                    <ToggleButton value={1} aria-label="left aligned">
                      {/* <RxGrid /> */}|
                    </ToggleButton>
                    <ToggleButton value={2} aria-label="centered">
                      {/* <TfiLayoutGrid2 /> */}
                      ||
                    </ToggleButton>
                    <ToggleButton value={3} aria-label="right aligned">
                      {/* <TfiLayoutGrid3 /> */}
                      |||
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            </div>
            <div className="hoq_SubDiv_LookBookSubMainDiv">

              <div
                className="hoq_Main_lookBookImgDiv"
                style={{ transition: "1s ease", width: "100%" }}
              >
                {selectedValue == 2 && (
                  <>
                    {isPgLoading ? <LookbookSkeleton param={selectedValue} /> : (<><div className="hoq_lookBookImgDivMain">
                      {filteredDesignSetLstData?.length == 0 ? (
                        <div className="hoq_noProductFoundLookBookDiv">
                          <p>No Product Found!</p>
                        </div>
                      ) : (
                        filteredDesignSetLstData?.map((slide, index) => (
                          <div className="hoq_designSetDiv" key={index}>
                            <div
                              style={{
                                display: "flex",
                                height: dataKey == index && "100%",
                                position: "relative",
                              }}
                            >
                              {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                <img
                                  className="hoq_lookBookImg"
                                  loading="lazy"
                                  src={ProdCardImageFunc(slide)}
                                  alt={`Slide ${index}`}
                                  onMouseEnter={() => handleHoverImages(index)}
                                  onMouseLeave={() => seyDataKey(null)}
                                  onError={(e) => handleImageError(index, e)}
                                  style={{
                                    height: dataKey == index ? "100%" : "250px",
                                    cursor: "pointer",
                                    backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    height: dataKey == index ? "100%" : "250px",
                                    width: "100%",
                                    ...getRandomBgColor(index),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    backgroundColor: "rgb(191, 200, 255)",
                                  }}
                                >
                                  {/* <p
                                style={{
                                  fontSize: "30px",
                                  color: getRandomBgColor(index).color,
                                }}
                              >
                                {slide?.designsetno}
                              </p> */}
                                </div>
                              )}
                              <p className="hoq_lb2designList_title">
                                {slide?.designsetno}
                              </p>
                            </div>
                            <div
                              className="hoq_lookBookImgDeatil"
                              style={{
                                display: dataKey == index ? "none" : "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "5px",
                              }}
                            >
                              <p
                                className="hoq_lookBookDesc"
                                style={{ fontSize: "13px", margin: "2px" }}
                              >
                                {storeInit?.IsDiamondWeight == 1 && (
                                  <>
                                    DWT:{" "}
                                    {calculateTotalUnitCostWithMarkUpDwt(
                                      JSON?.parse(slide.Designdetail)
                                    ).toFixed(3)}{" "}
                                    |
                                  </>
                                )}
                                {storeInit?.IsGrossWeight == 1 && (
                                  <>
                                    GWT:{" "}
                                    {calculateTotalUnitCostWithMarkUpGWt(
                                      JSON?.parse(slide.Designdetail)
                                    ).toFixed(3)}{" "}
                                    |
                                  </>
                                )}
                                NWT:{" "}
                                {calculateTotalUnitCostWithMarkUpNwt(
                                  JSON?.parse(slide.Designdetail)
                                ).toFixed(3)}{" "}
                              </p>
                              <div
                                className="hoq_lookBookImgDeatilSub"
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                {storeInit?.IsPriceShow == 1 && (
                                  <>
                                    <p
                                      style={{
                                        margin: "0px 10px 0px 0px",
                                        fontSize: "15px",
                                        fontWeight: 600,
                                      }}
                                      className="hoq_lookBookPriceShow"
                                    >
                                      {" "}
                                      <span className="hoq_currencyFont">
                                        {loginUserDetail?.CurrencyCode ??
                                          storeInit?.CurrencyCode}
                                      </span>
                                      {/* <span
                              className="hoq_currencyFont"
                              dangerouslySetInnerHTML={{
                                __html: decodeEntities(
                                  storeInit?.Currencysymbol
                                ),
                              }}
                            /> */}
                                      &nbsp;
                                      {formatter(
                                        calculateTotalUnitCostWithMarkUp(
                                          JSON?.parse(slide.Designdetail)
                                        )
                                      )}
                                    </p>
                                  </>
                                )}
                                <button
                                  className="hoq_lookBookBuyBtn"
                                  onClick={() =>
                                    handleByCombo(
                                      parseDesignDetails(
                                        slide?.Designdetail,
                                        "Cart"
                                      )
                                    )
                                  }
                                >
                                  Buy Combo
                                </button>
                              </div>
                            </div>
                            <div
                              className="hoq_lookBookSubImgMain"
                              style={{ display: dataKey == index && "none" }}
                            >
                              <Swiper
                                slidesPerView={4}
                                spaceBetween={10}
                                navigation={true}
                                loop={false}
                                modules={[Pagination, Navigation]}
                                className="hoq_LookBookmySwiper"
                                breakpoints={{
                                  320: { slidesPerView: 1, spaceBetween: 10 },
                                  480: { slidesPerView: 2, spaceBetween: 20 },
                                  640: { slidesPerView: 3, spaceBetween: 30 },
                                }}
                              >
                                {sortDesignDetailsBySrNo(
                                  parseDesignDetails(slide?.Designdetail)
                                )?.map((detail, subIndex) => {
                                  const imageSrc =
                                    imageSources[detail?.designno] || imageNotFound;

                                  return (
                                    <div
                                      className="hoq_lookBookSubImageDiv"
                                      key={subIndex}
                                    >
                                      <SwiperSlide
                                        className="hoq_lookBookSliderSubDiv"
                                        style={{
                                          marginRight: "0px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {detail?.IsInReadyStock == 1 && (
                                          <span className="hoq_LookBookinstock">
                                            In Stock
                                          </span>
                                        )}
                                        <img
                                          className="hoq_lookBookSubImage"
                                          loading="lazy"
                                          src={imageSrc}
                                          alt={`Sub image ${subIndex} for slide ${index}`}
                                          onError={(e) => handleImageError(index, e)}

                                          onClick={() =>
                                            handleNavigation(
                                              detail?.designno,
                                              detail?.autocode,
                                              detail?.TitleLine
                                                ? detail?.TitleLine
                                                : "",
                                              detail
                                            )
                                          }
                                        />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginBottom: "5px",
                                          }}
                                        >
                                          {cartItems.includes(detail?.autocode) ? (
                                            <button
                                              className="hoq_lookBookINCartBtn"
                                              onClick={() =>
                                                handleRemoveCart(detail)
                                              }
                                            >
                                              REMOVE CART
                                            </button>
                                          ) : (
                                            <button
                                              className="hoq_lookBookAddtoCartBtn"
                                              onClick={() =>
                                                handleAddToCart(detail)
                                              }
                                            >
                                              ADD TO CART +
                                            </button>
                                          )}
                                        </div>
                                      </SwiperSlide>
                                    </div>
                                  );
                                })}
                              </Swiper>
                            </div>
                          </div>
                        ))
                      )}
                    </div></>)}
                  </>
                )}

                {selectedValue == 3 && (
                  <>
                    {isPgLoading ? <LookbookSkeleton param={selectedValue} /> : (
                      <div className="hoq_lookBookImgDivMain">
                        {filteredDesignSetLstData?.length == 0 ? (
                          <div className="hoq_noProductFoundLookBookDiv">
                            <p>No Product Found!</p>
                          </div>
                        ) : (
                          <>
                            {filteredDesignSetLstData?.map((slide, index) => (
                              <div className="hoq_designSetDiv2" key={index}>
                                <div
                                  style={{
                                    display: "flex",
                                    width: "30%",
                                    height: "300px",
                                    position: 'relative'
                                  }}
                                  className="hoq_designSetDiv2_sub1"
                                >
                                  {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                    <img
                                      className="hoq_lookBookImg"
                                      loading="lazy"
                                      src={ProdCardImageFunc(slide)}
                                      alt={`Slide ${index}`}
                                      onError={() => handleImageError(index)}
                                      // onMouseEnter={() => handleHoverImages(index)}
                                      // onMouseLeave={() => seyDataKey(null)}
                                      style={{
                                        height: "100%",
                                        cursor: "pointer",
                                        backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                      }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        ...getRandomBgColor(index),
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        backgroundColor: "rgb(191, 200, 255)",
                                      }}
                                    >
                                      {/* <p style={{ fontSize: "30px", color: getRandomBgColor(index).color }}>{slide?.designsetno}</p> */}
                                    </div>
                                  )}
                                  <p className="hoq_lb1designList_title">{slide?.designsetno}</p>
                                </div>

                                <div
                                  style={{
                                    display: dataKey == index && "none",
                                    display: "flex",
                                    width: "70%",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                  className="hoq_designSetDiv2_sub2"
                                >
                                  <div
                                    className="hoq_lookBookImgDeatil"
                                    style={{
                                      display: dataKey == index ? "none" : "flex",
                                      justifyContent: "space-between",
                                      alignItems: 'center',
                                      width: "100%",
                                      padding: "0px 15px",
                                      margin: "5px",
                                    }}
                                  >
                                    <p className="hoq_lookBookDesc" style={{ fontSize: "13px", margin: "2px" }}>
                                      DWT:{" "}
                                      {calculateTotalUnitCostWithMarkUpDwt(
                                        JSON?.parse(slide.Designdetail)
                                      ).toFixed(3)}{" "}
                                      | GWT:{" "}
                                      {calculateTotalUnitCostWithMarkUpGWt(
                                        JSON?.parse(slide.Designdetail)
                                      ).toFixed(3)}{" "}
                                      | NWT:{" "}
                                      {calculateTotalUnitCostWithMarkUpNwt(
                                        JSON?.parse(slide.Designdetail)
                                      ).toFixed(3)}{" "}
                                    </p>
                                    <div
                                      className="hoq_lookBookImgDeatilSub"
                                      style={{ display: "flex", alignItems: "center" }}
                                    >
                                      <p
                                        style={{
                                          margin: "0px 10px 0px 0px",
                                          fontSize: "15px",
                                          fontWeight: 600,
                                        }}
                                        className="hoq_lookBookPriceShow"
                                      >
                                        {" "}
                                        {/* <span
                                                className="hoq_currencyFont"
                                                dangerouslySetInnerHTML={{
                                                  __html: decodeEntities(
                                                    storeInit?.Currencysymbol
                                                  ),
                                                }}
                                              /> */}
                                        <span
                                          className="hoq_currencyFont"
                                        >
                                          {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                        &nbsp;
                                        {formatter(calculateTotalUnitCostWithMarkUp(
                                          JSON?.parse(slide.Designdetail)
                                        ))}
                                      </p>
                                      <button
                                        className="hoq_lookBookBuyBtn"
                                        onClick={() =>
                                          handleByCombo(
                                            parseDesignDetails(
                                              slide?.Designdetail,
                                              "Cart"
                                            )
                                          )
                                        }
                                      >
                                        Buy Combo
                                      </button>
                                    </div>
                                  </div>
                                  <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={true}
                                    loop={false}
                                    modules={[Pagination, Navigation]}
                                    className="hoq_LookBookmySwiper hoq_lookBookThirdViewWeb"
                                    breakpoints={{
                                      320: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                      },
                                      480: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                      },
                                      640: {
                                        slidesPerView: 3,
                                        spaceBetween: 30,
                                      },
                                    }}
                                  >
                                    {sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail))?.map((detail, subIndex) => {
                                      const imageSrc = imageSources[detail?.designno] || imageNotFound;
                                      return (
                                        <div
                                          className="hoq_lookBookSubImageDiv"
                                          key={subIndex}
                                        >
                                          <SwiperSlide
                                            className="hoq_lookBookSliderSubDiv"
                                            style={{
                                              marginRight: "0px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {detail?.IsInReadyStock == 1 && (
                                              <span className="hoq_LookBookinstock">
                                                In Stock
                                              </span>
                                            )}
                                            <img
                                              className="hoq_lookBookSubImage"
                                              loading="lazy"
                                              src={imageSrc}
                                              alt={`Sub image ${subIndex} for slide ${index}`}
                                              onClick={() =>
                                                handleNavigation(
                                                  detail?.designno,
                                                  detail?.autocode,
                                                  detail?.TitleLine
                                                    ? detail?.TitleLine
                                                    : "",
                                                  detail
                                                )
                                              }
                                            />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginBottom: "5px",
                                              }}
                                            >
                                              {cartItems.includes(detail?.autocode) ? (
                                                <button
                                                  className="hoq_lookBookINCartBtn"
                                                  onClick={() => handleRemoveCart(detail)}
                                                >
                                                  REMOVE CART
                                                </button>
                                              ) : (
                                                <button
                                                  className="hoq_lookBookAddtoCartBtn"
                                                  onClick={() => handleAddToCart(detail)}
                                                >
                                                  ADD TO CART +
                                                </button>
                                              )}
                                            </div>
                                          </SwiperSlide>
                                        </div>
                                      )
                                    })}
                                  </Swiper>


                                  <div className="hoq_LookBookMobileThridViewMain">
                                    <div className="card">
                                      <Swiper
                                        className="hoq_LookBookMobileThridViewMain_swiper_w"
                                        spaceBetween={5}
                                        slidesPerView={1}
                                        speed={1000}
                                        onSwiper={setSwiper}
                                        navigation
                                        pagination
                                      >
                                        {sortDesignDetailsBySrNo(parseDesignDetails(slide?.Designdetail))?.map((detail, subIndex) => {
                                          const imageSrc = imageSources[detail?.designno] || imageNotFound;
                                          return (
                                            <div
                                              className="hoq_lookBookSubImageDiv"
                                              key={subIndex}
                                            >
                                              <SwiperSlide
                                                key={`detail-${detail?.id}`}
                                                style={{
                                                  marginRight: "0px",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                {detail?.IsInReadyStock == 1 && (
                                                  <span className="hoq_LookBookinstock">
                                                    In Stock
                                                  </span>
                                                )}
                                                <img
                                                  className="hoq_lookBookSubImage"
                                                  loading="lazy"
                                                  src={imageSrc}
                                                  alt={`Sub image ${subIndex} for slide ${index}`}
                                                  onClick={() =>
                                                    handleNavigation(
                                                      detail?.designno,
                                                      detail?.autocode,
                                                      detail?.TitleLine
                                                        ? detail?.TitleLine
                                                        : "",
                                                      detail
                                                    )
                                                  }
                                                />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    marginBottom: "5px",
                                                  }}
                                                >
                                                  {cartItems.includes(detail?.autocode) ? (
                                                    <button
                                                      className="hoq_lookBookINCartBtn"
                                                      onClick={() => handleRemoveCart(detail)}
                                                    >
                                                      REMOVE CART
                                                    </button>
                                                  ) : (
                                                    <button
                                                      className="hoq_lookBookAddtoCartBtn"
                                                      onClick={() => handleAddToCart(detail)}
                                                    >
                                                      ADD TO CART +
                                                    </button>
                                                  )}
                                                </div>
                                              </SwiperSlide>
                                            </div>
                                          )
                                        })}
                                      </Swiper>
                                    </div>
                                    {/* <div className="btnflex">
                                            <button className="btncst" onClick={handlePrevious}>&lt;</button>
                                            <button className="btncst" onClick={handleNext}>&gt;</button>
                                          </div> */}
                                  </div>

                                  {/* } */}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}

                {selectedValue == 1 && (
                  <>
                    {isPgLoading ? <LookbookSkeleton param={selectedValue} /> : (<> <div className="hoq_lookbook3MainDiv">
                      {filteredDesignSetLstData?.length == 0 ? (
                        <div className="hoq_noProductFoundLookBookDiv">
                          <p>No Product Found!</p>
                        </div>
                      ) : (
                        <>
                          <Swiper
                            slidesPerView={1}
                            spaceBetween={10}
                            navigation={true}
                            loop={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[
                              Keyboard,
                              FreeMode,
                              Navigation,
                              Thumbs,
                              Scrollbar,
                            ]}
                            keyboard={{ enabled: true }}
                            mousewheel={true}
                            className="hoq_LookBookmySwiper mySwiper2"
                          >
                            {filteredDesignSetLstData?.map((slide, index) => (
                              <SwiperSlide key={index}>
                                <div>
                                  <div className="hoq1_lb3compeletethelook_cont">
                                    <div className="hoq1_lb3ctlImg_containe">
                                      {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                        <img
                                          src={ProdCardImageFunc(slide)}
                                          alt=""
                                          className="hoq_lb3ctl_img_new "
                                          onError={(e) => handleImageError(index, e)}
                                          style={{
                                            backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                          }}
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            height: "100%",
                                            width: "60%",
                                            ...getRandomBgColor(index),
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            backgroundColor: "rgb(191, 200, 255)",
                                          }}
                                          className="hoq_lb3ctl_img_new"
                                        >
                                          {/* <p style={{ fontSize: "30px", color: getRandomBgColor(index).color }}>{slide?.designsetno}</p> */}
                                        </div>
                                      )}
                                      {/* <div className="hoq_lb3BuyComboDiv" onClick={() =>
                                  handleByCombo(
                                    parseDesignDetails(
                                      slide?.Designdetail,
                                      "Cart"
                                    )
                                  )
                                }>
                                  <button>
                                    Buy Combo
                                  </button>
                                </div> */}
                                    </div>
                                    <div
                                      className={
                                        (slide?.Designdetail == undefined
                                          ? []
                                          : sortDesignDetailsBySrNo(
                                            parseDesignDetails(
                                              slide?.Designdetail
                                            )
                                          )
                                        )?.length > 3
                                          ? "hoq_lb3compeletethelook_prodt_for_3"
                                          : "hoq_lb3compeletethelook_prodt"
                                      }
                                    >
                                      <p className="hoq_lb3designList_title">
                                        {slide?.designsetno}
                                      </p>
                                      <div className="hoq_lb3_prodtDivs2">
                                        {sortDesignDetailsBySrNo(
                                          parseDesignDetails(slide?.Designdetail)
                                        )?.map((ele, subIndex) => (
                                          <div
                                            key={subIndex}
                                            className="hoq_lb3completethelook_outer"
                                            style={{
                                              borderTop:
                                                subIndex !== 0 ? "none" : "",
                                              width: "513px",
                                              padding: "5px",
                                              border: "1px solid #e1e1e1",
                                              backgroundColor: "#fff",
                                            }}
                                          >
                                            <div
                                              className="hoq_lookbookMainDivdata"
                                              style={{
                                                display: "flex",
                                                gap: "40px",
                                                justifyContent: "space-around",
                                              }}
                                            >
                                              <div
                                                className="hoq_lb3ImageDiv"
                                                style={{ marginLeft: "12px" }}
                                              >
                                                <img
                                                  src={
                                                    ele?.ImageCount > 0
                                                      // ? `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`
                                                      ? `${storeInit?.CDNDesignImageFolThumb}${ele?.designno}~1.jpg`
                                                      : imageNotFound
                                                  }
                                                  alt=""
                                                  className="hoq_lb3srthelook_img"
                                                  onClick={() =>
                                                    handleNavigation(
                                                      ele?.designno,
                                                      ele?.autocode,
                                                      ele?.TitleLine
                                                        ? ele?.TitleLine
                                                        : "",
                                                      ele
                                                    )
                                                  }
                                                  onError={(e) => {
                                                    e.target.src = imageNotFound;
                                                  }}
                                                />
                                              </div>
                                              <div
                                                className="hoq_lb3srthelook_prodinfo"
                                                onClick={() =>
                                                  handleNavigation(
                                                    ele?.designno,
                                                    ele?.autocode,
                                                    ele?.TitleLine
                                                      ? ele?.TitleLine
                                                      : "",
                                                    ele
                                                  )
                                                }
                                              >
                                                <div
                                                  style={{
                                                    fontSize: "14px",
                                                    color: "#7d7f85",
                                                    textTransform: "uppercase",
                                                  }}
                                                  className="hoq_lb3srthelook_prodinfo_inner"
                                                >
                                                  <p>
                                                    <span>
                                                      {ele?.designno} -{" "}
                                                      {ele?.CategoryName}
                                                    </span>
                                                    <br />

                                                    {storeInit?.IsGrossWeight ==
                                                      1 && (
                                                        <>
                                                          <span className="hoq_lb3detailDT">
                                                            GWT:{" "}
                                                          </span>
                                                          <span className="hoq_lb3detailDT">
                                                            {(ele?.Gwt || 0)?.toFixed(
                                                              3
                                                            )}
                                                          </span>
                                                        </>
                                                      )}

                                                    {Number(ele?.Nwt) !== 0 && (
                                                      <>
                                                        {storeInit?.IsGrossWeight ==
                                                          1 && (
                                                            <span className="hoq_lb3pipe">
                                                              {" "}
                                                              |{" "}
                                                            </span>
                                                          )}
                                                        <span className="hoq_lb3detailDT">
                                                          NWT :{" "}
                                                        </span>
                                                        <span className="hoq_lb3detailDT">
                                                          {(ele?.Nwt || 0)?.toFixed(
                                                            3
                                                          )}
                                                        </span>
                                                      </>
                                                    )}

                                                    {storeInit?.IsGrossWeight ==
                                                      1 && (
                                                        <>
                                                          {(ele?.Dwt != "0" ||
                                                            ele?.Dpcs != "0") && (
                                                              <>
                                                                <span className="hoq_lb3pipe">
                                                                  {" "}
                                                                  |{" "}
                                                                </span>
                                                                <span className="hoq_lb3detailDT">
                                                                  DWT:{" "}
                                                                </span>
                                                                <span className="hoq_lb3detailDT">
                                                                  {(
                                                                    ele?.Dwt || 0
                                                                  )?.toFixed(3)}{" "}
                                                                  / {ele?.Dpcs || 0}
                                                                </span>
                                                              </>
                                                            )}
                                                        </>
                                                      )}
                                                    {storeInit?.IsStoneWeight ==
                                                      1 && (
                                                        <>
                                                          {(ele?.CSwt != "0" ||
                                                            ele?.CSpcs != "0") && (
                                                              <>
                                                                <span className="hoq_lb3pipe">
                                                                  {" "}
                                                                  |{" "}
                                                                </span>
                                                                <span className="hoq_lb3detailDT">
                                                                  CWT:{" "}
                                                                </span>
                                                                <span className="hoq_lb3detailDT">
                                                                  {(
                                                                    ele?.CSwt || 0
                                                                  )?.toFixed(3)}{" "}
                                                                  /{ele?.CSpcs || 0}
                                                                </span>
                                                              </>
                                                            )}
                                                        </>
                                                      )}
                                                    <br />
                                                    {/* <span
                                              className="hoq_currencyFont"
                                              dangerouslySetInnerHTML={{
                                                __html: decodeEntities(
                                                  storeInit?.Currencysymbol
                                                ),
                                              }}
                                            /> */}
                                                    {storeInit?.IsPriceShow ==
                                                      1 && (
                                                        <>
                                                          <span className="hoq_currencyFont">
                                                            {loginUserDetail?.CurrencyCode ??
                                                              storeInit?.CurrencyCode}
                                                          </span>
                                                          &nbsp;
                                                          {formatter(
                                                            ele?.UnitCostWithMarkUp
                                                          )}
                                                        </>
                                                      )}
                                                  </p>
                                                </div>
                                              </div>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "end",
                                                  alignItems: "center",
                                                  marginBottom: "5px",
                                                }}
                                                className="hoq_lb3cartIconBtnDiv"
                                              >
                                                {cartItems.includes(
                                                  ele?.autocode
                                                ) ? (
                                                  <IconButton
                                                    onClick={() =>
                                                      handleRemoveCart(ele)
                                                    }
                                                  >
                                                    <LocalMallIcon className="hoq_lookBookINCartIconBtn" />
                                                  </IconButton>
                                                ) : (
                                                  <IconButton
                                                    onClick={() =>
                                                      handleAddToCart(ele)
                                                    }
                                                  >
                                                    <LocalMallOutlinedIcon className="hoq_lookBookAddtoCartIconBtn" />
                                                  </IconButton>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="hoq_lb3TotalBtnGroups">
                                        <div className="hoq_lb3TotalPrice">
                                          <span>
                                            <span className="hoq_currencyFont">
                                              {loginUserDetail?.CurrencyCode ??
                                                storeInit?.CurrencyCode}
                                            </span>
                                            &nbsp;
                                            {formatter(
                                              calculateTotalUnitCostWithMarkUp(
                                                JSON?.parse(slide.Designdetail)
                                              )
                                            )}
                                          </span>
                                        </div>
                                        <div
                                          className="hoq_lb3BuyComboDiv"
                                          onClick={() =>
                                            handleByCombo(
                                              parseDesignDetails(
                                                slide?.Designdetail,
                                                "Cart"
                                              )
                                            )
                                          }
                                        >
                                          <span>Buy Combo</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div className="hoq_lookbook3thumbMainDiv">
                            {filteredDesignSetLstData?.length != 0 && (
                              <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={20}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[Keyboard, FreeMode, Navigation, Thumbs]}
                                keyboard={{ enabled: true }}
                                mousewheel={true}
                                className="mySwiper"
                                breakpoints={{
                                  320: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                  },
                                  480: {
                                    slidesPerView: 3,
                                    spaceBetween: 10,
                                  },
                                  640: {
                                    slidesPerView: 4,
                                    spaceBetween: 10,
                                  },
                                  768: {
                                    slidesPerView: 5,
                                    spaceBetween: 10,
                                  },
                                  1024: {
                                    slidesPerView: 10,
                                    spaceBetween: 10,
                                  },
                                  1280: {
                                    slidesPerView: 20,
                                    spaceBetween: 10,
                                  },
                                }}
                              >
                                {filteredDesignSetLstData?.map((slide, index) => (
                                  <SwiperSlide key={index} ref={SwiperSlideRef}>
                                    {ProdCardImageFunc(slide) && !imageLoadError[index] ? (
                                      <>
                                        <img
                                          // ref={SwiperSlideRef}
                                          src={ProdCardImageFunc(slide)}
                                          onLoad={handleImageLoad}
                                          alt=""
                                          className="ctl_Paginationimg"
                                          onError={(e) => handleImageError(index, e)}
                                          style={{
                                            height: DynamicSize.h || "66.5px",
                                            width: DynamicSize.w || "66.5x",
                                            backgroundColor: ProdCardImageFunc(slide) === null ? "rgb(191, 200, 255)" : getRandomBgColor(index),
                                          }}
                                        />
                                      </>
                                    ) : (
                                      <div
                                        style={{
                                          height: DynamicSize.h || "66.5px",
                                          width: DynamicSize.w || "66.5x",
                                          ...getRandomBgColor(index),
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          cursor: "pointer",
                                          margin: 0,
                                          backgroundColor: "rgb(191, 200, 255)",
                                        }}
                                        className="hoq_lb3ctl_img_new"
                                      >
                                        {/* <p style={{ fontSize: "30px", color: getRandomBgColor(index).color }}>{slide?.designsetno}</p> */}
                                      </div>
                                    )}
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            )}
                          </div>
                        </>
                      )}
                    </div></>)}
                  </>
                )}
              </div>
            </div>
            {isEditablePage === 1 ? (
              <>
                {storeInit?.IsProductListPagination == 1 &&
                  Math.ceil(dstCount / itemsPerPage)
                  > 1 && (
                    <div className="lpDiv">
                      <EditablePagination
                        currentPage={currentPage}
                        totalItems={dstCount}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handelPageChange}
                        inputPage={inputPage}
                        setInputPage={setInputPage}
                        handlePageInputChange={handlePageInputChange}
                        maxwidth464px={maxwidth464px}
                        totalPages={totalPages}
                        currPage={currentPage}
                        isShowButton={false}
                      />
                    </div>
                  )}
              </>
            ) : (
              <>
                {storeInit?.IsProductListPagination == 1 &&
                  Math.ceil(dstCount / itemsPerPage)
                  > 1 && (
                    <div className="lpDiv">
                      <MuiPagination
                        count={Math.ceil(dstCount / itemsPerPage)}
                        size={maxwidth464px ? "small" : "large"}
                        shape="circular"
                        onChange={handelPageChange}
                        page={currentPage}
                        // showFirstButton
                        // showLastButton
                        renderItem={(item) => (
                          <PaginationItem
                            {...item}
                            sx={{
                              pointerEvents: item.page === currentPage ? 'none' : 'auto',
                            }}
                          />
                        )}
                      />
                    </div>
                  )}
              </>
            )}
          </div>
        )
      }

    </div >
  );
};

export default Lookbook;



