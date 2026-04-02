"use client";
import "./grid.css";
import MobileHeader from "./MobileHeader";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "@/app/theme/fgstore.web/product/page.scss";
import { formatRedirectTitleLine, getDomainName } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import ProductListSkeleton from "@/app/components/productlist_skeleton/ProductListSkeleton";
import { Box, Grid, Paper, Typography, IconButton, Checkbox, Pagination, PaginationItem, Skeleton, useMediaQuery } from "@mui/material";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Product_Card from "@/app/theme/fgstore.web/product/_prodComponents/Product_Card";
import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import { useDynamicImage } from "./_prodComponents/useProductHook";
import { useProductFilter } from "./_prodComponents/useProdFilterHook";
import FilterSection from "./_prodComponents/FilterSection";
import Cookies from "js-cookie";
import pako from "pako";

import MobileBreadCrumb from "./MobileBreadCrumb";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";
import ProductView from "./ProductView";
import ActionIsland from "./FloatingIsland";
import FilterDrawerApp from "./FilterDrawer";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

const MobileFilter = dynamic(() => import("./_prodComponents/MobileFilter"), { ssr: false });

const Layout = ({ params, searchParams, storeinit }) => {
    let loginUserDetail;
    const storeInit = storeinit;

    useEffect(() => {
        loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let mtCombo = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        setMetalTypeCombo(mtCombo);

        let diaQcCombo = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
        setDiaQcCombo(diaQcCombo);

        let CsQcCombo = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
        setCsQcCombo(CsQcCombo);
    }, []);

    let navigate = useNextRouterLikeRR();
    let minwidth1201px = useMediaQuery("(min-width:1201px)");
    let maxwidth590px = useMediaQuery("(max-width:590px)");
    let maxwidth464px = useMediaQuery("(max-width:464px)");

    const { islogin, setCartCountNum, setWishCountNum } = useStore();

    const [productListData, setProductListData] = useState([]);
    const [isProductListData, setIsProductListData] = useState(false);
    const [isProdLoading, setIsProdLoading] = useState(true);
    const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
    const [isshowDots, setisshowDots] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [afterFilterCount, setAfterFilterCount] = useState();
    const [expandedAccordions, setExpandedAccordions] = useState({});
    const [cartArr, setCartArr] = useState({});
    const [wishArr, setWishArr] = useState({});
    const [menuParams, setMenuParams] = useState({});
    const [filterProdListEmpty, setFilterProdListEmpty] = useState(false);
    const [metalTypeCombo, setMetalTypeCombo] = useState([]);
    const [diaQcCombo, setDiaQcCombo] = useState([]);
    const [csQcCombo, setCsQcCombo] = useState([]);
    const [selectedMetalId, setSelectedMetalId] = useState();
    const [selectedDiaId, setSelectedDiaId] = useState();
    const [selectedCsId, setSelectedCsId] = useState();
    const [IsBreadCumShow, setIsBreadcumShow] = useState(false);
    const [loginInfo, setLoginInfo] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rollOverImgPd, setRolloverImgPd] = useState({});
    const [prodListType, setprodListType] = useState();
    const [sortBySelect, setSortBySelect] = useState();
    const [isRollOverVideo, setIsRollOverVideo] = useState({});
    let cookie = Cookies.get("visiterId");
    const [menuDecode, setMenuDecode] = useState("");
    const [ImageView, setImageView] = useState(false);
    const location = useNextRouterLikeRR();


    const isEditablePage = 1;

    const setCSSVariable = () => {
        const storeInit = storeinit;
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty("--background-color", backgroundColor);
    };

    const handleAccordionChange = (index) => (event, isExpanded) => {
        setExpandedAccordions((prev) => ({
            ...prev,
            [index]: isExpanded,
        }));
    };

    useEffect(() => {
        setCSSVariable();
        const storeInitInside = storeinit;
        const loginUserDetailInside = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let mtid = loginUserDetailInside?.MetalId ?? storeInitInside?.MetalId;
        setSelectedMetalId(mtid);

        let diaid = loginUserDetailInside?.cmboDiaQCid ?? storeInitInside?.cmboDiaQCid;
        setSelectedDiaId(diaid);
    }, []);

    useEffect(() => {
        setSelectedMetalId(loginUserDetail?.MetalId ?? storeInit?.MetalId);
        setSelectedDiaId(loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid);
        setSortBySelect("Recommended");
    }, [params]);

    const [imageColor, setImageColor] = useState("");

    const metalColorType = [
        {
            id: 1,
            metal: "gold",
        },
        {
            id: 2,
            metal: "white",
        },
        {
            id: 3,
            metal: "rose",
        },
    ];

    const { imageMap, finalProductListData, getDynamicRollImages, getDynamicImages, getDynamicVideo, selectedMetalColor, handleImgRollover, handleLeaveImgRolloverImg } = useDynamicImage(storeInit, productListData);

    const { filterChecked, afterCountStatus, setAfterCountStatus, currPage, setCurrPage, inputPage, setInputPage, sliderValue, setSliderValue, sliderValue1, setSliderValue1, sliderValue2, setSliderValue2, inputDia, setInputDia, inputNet, setInputNet, inputGross, setInputGross, appliedRange1, setAppliedRange1, appliedRange2, setAppliedRange2, appliedRange3, setAppliedRange3, show, setShow, show1, setShow1, show2, setShow2, isReset, setIsReset, isClearAllClicked, setIsClearAllClicked, handleCheckboxChange, FilterValueWithCheckedOnly, handelFilterClearAll, showClearAllButton, handleRangeFilterApi } = useProductFilter(filterData, {
        ProductListApi,
        setProductListData,
        setAfterFilterCount,
        setIsOnlyProdLoading,
        selectedMetalId,
        selectedDiaId,
        selectedCsId,
        prodListType,
        cookie,
        sortBySelect,
    });

    const callAllApi = () => {
        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
        let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
        let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));

        if (!mtTypeLocal || mtTypeLocal?.length === 0) {
            MetalTypeComboAPI(cookie)
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("metalTypeCombo", JSON.stringify(data));
                        setMetalTypeCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setMetalTypeCombo(mtTypeLocal);
        }

        if (!diaQcLocal || diaQcLocal?.length === 0) {
            DiamondQualityColorComboAPI()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("diamondQualityColorCombo", JSON.stringify(data));
                        setDiaQcCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setDiaQcCombo(diaQcLocal);
        }

        if (!csQcLocal || csQcLocal?.length === 0) {
            ColorStoneQualityColorComboAPI()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("ColorStoneQualityColorCombo", JSON.stringify(data));
                        setCsQcCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setCsQcCombo(csQcLocal);
        }

        if (!mtColorLocal || mtColorLocal?.length === 0) {
            MetalColorCombo()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        const logininfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        setLoginInfo(logininfo);
    }, []);

    useEffect(() => {
        callAllApi();
    }, [loginInfo]);

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    useEffect(() => {
        let param = JSON?.parse(sessionStorage.getItem("menuparams"));
        if (location?.state?.SearchVal === undefined) {
            setMenuParams(param);
        }
    }, [params, productListData, filterChecked]);

    let result = ParseAndDecodeSearchParams(searchParams);

    const lastSearchParamsRef = useRef(null);
    const isApiCallInProgressRef = useRef(false);

    useEffect(() => {
        const currentSearchKey = JSON.stringify(searchParams);
        if (lastSearchParamsRef.current === currentSearchKey || isApiCallInProgressRef.current) {
            return;
        }
        lastSearchParamsRef.current = currentSearchKey;
        isApiCallInProgressRef.current = true;

        const fetchData = async () => {
            let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
            // let UrlVal = location?.search?.slice(1).split("/")
            let UrlVal = result;
            let MenuVal = "";
            let MenuKey = "";
            let SearchVar = "";
            let TrendingVar = "";
            let NewArrivalVar = "";
            let BestSellerVar = "";
            let AlbumVar = "";

            let productlisttype;

            UrlVal?.forEach((ele) => {
                console.log("🚀 ~ fetchData ~ ele:", ele);
                let firstChar = ele.charAt(0);

                switch (firstChar) {
                    case "M":
                        MenuVal = ele;
                        break;
                    case "S":
                        SearchVar = ele;
                        break;
                    case "T":
                        TrendingVar = ele;
                        break;
                    case "N":
                        NewArrivalVar = ele;
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

            if (MenuVal?.length > 0) {
                let menuDecode = atob(MenuVal?.split("=")[1]);
                let key = menuDecode?.split("/")[1].split(",");
                let val = menuDecode?.split("/")[0].split(",");

                setIsBreadcumShow(true);
                setMenuDecode(menuDecode?.split("/"));

                productlisttype = [key, val];
            }

            if (SearchVar) {
                productlisttype = SearchVar;
            }

            if (TrendingVar) {
                productlisttype = TrendingVar.split("=")[1];
            }
            if (NewArrivalVar) {
                productlisttype = NewArrivalVar.split("=")[1];
            }

            if (BestSellerVar) {
                productlisttype = BestSellerVar.split("=")[1];
            }

            if (AlbumVar) {
                productlisttype = AlbumVar.split("=")[1];
            }

            setIsProdLoading(true);
            setprodListType(productlisttype);
            let diafilter = filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
            let diafilter1 = filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];
            let diafilter2 = filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];
            const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
            const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
            const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

            let DiaRange = {
                DiaMin: isDia ? (sliderValue[0] ?? "") : "",
                DiaMax: isDia ? (sliderValue[1] ?? "") : "",
            };

            let netRange = {
                netMin: isNet ? (sliderValue1[0] ?? "") : "",
                netMax: isNet ? (sliderValue1[1] ?? "") : "",
            };

            let grossRange = {
                grossMin: isGross ? (sliderValue2[0] ?? "") : "",
                grossMax: isGross ? (sliderValue2[1] ?? "") : "",
            };

            await ProductListApi({}, 1, obj, productlisttype, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        // console.log("productList", res);

                        setProductListData(
                            res?.pdList?.sort((a, b) => {
                                return a?.autocode.localeCompare(b?.autocode);
                            }),
                        );
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
                    }

                    if (res?.pdList) {
                        setIsProductListData(true);
                    }
                    return res;
                })

                .then(async (res) => {
                    let forWardResp1;
                    if (res) {
                        await FilterListAPI(productlisttype, cookie)
                            .then((res) => {
                                setFilterData(res);
                                let diafilter = res?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
                                let diafilter1 = res?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];

                                let diafilter2 = res?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];

                                setSliderValue(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
                                setSliderValue1(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1?.Min, diafilter1?.Max] : []);
                                setSliderValue2(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2?.Min, diafilter2?.Max] : []);
                                forWardResp1 = res;
                            })
                            .catch((err) => console.log("err", err));
                    }
                    return forWardResp1;
                })
                .finally(() => {
                    setIsProdLoading(false);
                    setIsOnlyProdLoading(false);
                    isApiCallInProgressRef.current = false; // Reset the flag when API call completes
                })
                .catch((err) => {
                    console.log("err", err);
                    isApiCallInProgressRef.current = false; // Reset the flag on error too
                });

            // }
        };

        fetchData();
    }, [searchParams]);

    const prevFilterChecked = useRef();

    useEffect(() => {
        setAfterCountStatus(true);

        const previousChecked = prevFilterChecked.current;
        prevFilterChecked.current = filterChecked;

        if (Object.keys(filterChecked).length > 0 || (previousChecked && JSON.stringify(previousChecked) !== JSON.stringify(filterChecked))) {
            setCurrPage(1);
            setInputPage(1);
        }

        let output = FilterValueWithCheckedOnly();
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

        let diafilter = filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
        let diafilter1 = filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];
        let diafilter2 = filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        if (Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true) {
            setIsOnlyProdLoading(true);
            let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" };
            let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" };
            let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" };

            ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        setProductListData(res?.pdList);
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
                        setAfterCountStatus(false);
                    }
                    return res;
                })

                .catch((err) => console.log("err", err))
                .finally(() => {
                    setTimeout(() => setIsOnlyProdLoading(false), 1000);
                });
        }
    }, [filterChecked]);

    useEffect(() => {
        handelFilterClearAll();
    }, [params]);

    useEffect(() => {
        setSortBySelect("Recommended");
    }, [params]);

    const totalPages = Math.ceil(afterFilterCount / storeInit.PageSize);

    const handlePageInputChange = (event) => {
        if (event.key === "Enter") {
            let newPage = parseInt(inputPage, 10);
            if (newPage < 1) newPage = 1;
            if (newPage > totalPages) newPage = totalPages;
            setCurrPage(newPage);
            setInputPage(newPage);
            handelPageChange("", newPage);
        }
    };

    const handelPageChange = (event, value) => {
        let output = FilterValueWithCheckedOnly();
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
        setIsOnlyProdLoading(true);
        setCurrPage(value);
        setInputPage(value);
        setTimeout(() => {
            window.scroll({
                top: 0,
                behavior: "smooth",
            });
        }, 100);

        let diafilter = filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
        let diafilter1 = filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];
        let diafilter2 = filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" };
        let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" };
        let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" };

        ProductListApi(output, value, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
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
                    setIsOnlyProdLoading(false);
                }, 100);
            });
    };

    const handleCartandWish = (e, ele, type) => {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let prodObj = {
            autocode: ele?.autocode,
            Metalid: selectedMetalId ?? ele?.MetalPurityid,
            MetalColorId: ele?.MetalColorid,
            DiaQCid: (selectedDiaId ?? islogin == true) ? loginInfo?.cmboDiaQCid : storeInit?.cmboDiaQCid,
            CsQCid: (selectedCsId ?? islogin == true) ? loginInfo?.cmboCSQCid : storeInit?.cmboCSQCid,
            Size: ele?.DefaultSize,
            Unitcost: ele?.UnitCost,
            markup: ele?.DesignMarkUp,
            UnitCostWithmarkup: ele?.UnitCostWithMarkUp,
            Remark: "",
        };

        if (e.target.checked == true) {
            CartAndWishListAPI(type, prodObj, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err));
        } else {
            RemoveCartAndWishAPI(type, ele?.autocode, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountNum(wishC);
                    setCartCountNum(cartC);
                })
                .catch((err) => console.log("err", err));
        }

        if (type === "Cart") {
            setCartArr((prev) => ({
                ...prev,
                [ele?.autocode]: e.target.checked,
            }));
        }

        if (type === "Wish") {
            setWishArr((prev) => ({
                ...prev,
                [ele?.autocode]: e.target.checked,
            }));
        }
    };

    useEffect(() => {
        if (productListData?.length === 0 || !productListData) {
            setFilterProdListEmpty(true);
        } else {
            setFilterProdListEmpty(false);
            setAfterCountStatus(false);
        }
    }, [productListData]);

    const handelCustomCombo = (obj) => {
        let output = FilterValueWithCheckedOnly();

        let diafilter = filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
        let diafilter1 = filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];
        let diafilter2 = filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        if (location?.state?.SearchVal === undefined) {
            setIsOnlyProdLoading(true);
            let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" };
            let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" };
            let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" };

            ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
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
        const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
        const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        sessionStorage.setItem("short_cutCombo_val", JSON.stringify(obj));

        if (loginInfo && Object.keys(loginInfo).length > 0) {
            if (selectedMetalId != undefined || selectedDiaId != undefined || selectedCsId != undefined) {
                if (loginInfo.MetalId !== selectedMetalId || loginInfo.cmboDiaQCid !== selectedDiaId) {
                    handelCustomCombo(obj);
                }
            }
        } else {
            if (storeInit && Object.keys(storeInit).length > 0) {
                if (selectedMetalId != undefined || selectedDiaId != undefined || selectedCsId != undefined) {
                    if (storeInit?.MetalId !== selectedMetalId || storeInit?.cmboDiaQCid !== selectedDiaId) {
                        handelCustomCombo(obj);
                    }
                }
            }
        }
    }, [selectedMetalId, selectedDiaId, selectedCsId]);

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);

            const compressed = pako.deflate(uint8Array, { to: "string" });

            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error("Error compressing and encoding:", error);
            return null;
        }
    };

    const decodeAndDecompress = (encodedString) => {
        try {
            if (!encodedString) return null;

            const base64 = encodedString.replace(/-/g, "+").replace(/_/g, "/");

            const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

            const binaryString = atob(padded);

            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            const decompressed = pako.inflate(uint8Array, { to: "string" });

            const jsonObject = JSON.parse(decompressed);

            return jsonObject;
        } catch (error) {
            console.error("Error decoding and decompressing:", error);
            return null;
        }
    };

    const handleMoveToDetail = (productData) => {
        let output = FilterValueWithCheckedOnly();
        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: selectedMetalId,
            d: selectedDiaId,
            c: selectedCsId,
            f: output,
        };

        decodeAndDecompress();

        let encodeObj = compressAndEncode(JSON.stringify(obj));

        navigate.push(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeURIComponent(encodeObj)}`);
    };

    const handleSortby = async (e) => {
        setSortBySelect(e.target?.value);

        let output = FilterValueWithCheckedOnly();
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

        setIsOnlyProdLoading(true);

        let sortby = e.target?.value;
        let diafilter = filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
        let diafilter1 = filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];
        let diafilter2 = filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" };
        let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" };
        let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" };

        await ProductListApi(output, 1, obj, prodListType, cookie, sortby, DiaRange, netRange, grossRange)
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
        apiPosition = 0, // Add apiPosition parameter to know which range to reset
    }) => {
        try {
            const res1 = await FilterListAPI(prodListType, cookie);
            const optionsRaw = res1?.find((f) => f?.Name === filterName)?.options;

            if (optionsRaw) {
                const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
                const resetValue = [Min, Max];
                setSliderValue(resetValue);
                setTempSliderValue(resetValue);

                // Call handleRangeFilterApi with proper null values based on apiPosition
                const args = [null, null, null];
                args[apiPosition] = resetValue;
                handleRangeFilterApi(...args);

                setAppliedRange(["", ""]);
                setIsShowBtn?.(false);
                if (show) setShow(false);
            }
        } catch (error) {
            console.error(`Failed to reset filter "${filterName}":`, error);
        }
    };

    const [imageAvailability, setImageAvailability] = useState({});

    useEffect(() => {
        const loadImagesSequentially = async () => {
            const availability = {};

            for (const item of finalProductListData) {
                const hasImage = !!item?.images?.[0]; // Check if image exists
                const autocode = item?.autocode;

                availability[autocode] = hasImage;

                // Progressive update
                setImageAvailability((prev) => ({
                    ...prev,
                    [autocode]: hasImage,
                }));
            }
        };

        if (finalProductListData?.length > 0) {
            loadImagesSequentially();
        }
    }, [finalProductListData]);


    const handelMenu = () => {
        let menudata = getSession('menuparams');
        if (menudata) {
            const queryParameters1 = [
                menudata?.FilterKey && `${menudata?.FilterVal}`,
                menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
                menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
            ].filter(Boolean).join('/');

            const queryParameters = [
                menudata?.FilterKey && `${menudata?.FilterVal}`,
                menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
                menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
            ].filter(Boolean).join(',');

            const otherparamUrl = Object.entries({
                b: menudata?.FilterKey,
                g: menudata?.FilterKey1,
                c: menudata?.FilterKey2,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(',');

            // const paginationParam = [
            //   `page=${menudata.page ?? 1}`,
            //   `size=${menudata.size ?? 50}`
            // ].join('&');

            let menuEncoded = `${queryParameters}/${otherparamUrl}`;
            const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(
                menuEncoded
            )}`;
            navigate.push(url)
        } else {
            navigate.push("/")
        }
    }


    useEffect(() => {
        (async () => {
            try {
                const res = await getDomainName();
                setisshowDots(res !== "demo" ? true : false);
            } catch (error) {
                return error;
            }
        })();
    }, []);


    return (
        <Box
            sx={{
                height: "100svh",
                overflowY: "auto",
                backgroundColor: "#fff",
                paddingBottom: '150px'
            }}
        >
            <MobileHeader
                result={result}
                IsBreadCumShow={IsBreadCumShow}
                menuDecode={menuDecode}
                afterFilterCount={afterFilterCount}
                showClearAllButton={showClearAllButton}
                afterCountStatus={isProdLoading}
            />
            <FilterDrawerApp
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                filterData={filterData}
                storeInit={storeInit}
                selectedMetalId={selectedMetalId}
                setSelectedMetalId={setSelectedMetalId}
                metalTypeCombo={metalTypeCombo}
                selectedDiaId={selectedDiaId}
                setSelectedDiaId={setSelectedDiaId}
                selectedCsId={selectedCsId}
                setSelectedCsId={setSelectedCsId}
                csQcCombo={csQcCombo}
                diaQcCombo={diaQcCombo}
                sortBySelect={sortBySelect}
                handleSortby={handleSortby}
                afterFilterCount={afterFilterCount}
                showClearAllButton={showClearAllButton}
                afterCountStatus={afterCountStatus}
                handelFilterClearAll={handelFilterClearAll}
                expandedAccordions={expandedAccordions}
                handleAccordionChange={handleAccordionChange}
                FilterValueWithCheckedOnly={FilterValueWithCheckedOnly}
                handleCheckboxChange={handleCheckboxChange}
                loginUserDetail={loginUserDetail}
                filterChecked={filterChecked}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                show={show}
                setShow={setShow}
                appliedRange1={appliedRange1}
                setAppliedRange1={setAppliedRange1}
                sliderValue1={sliderValue1}
                setSliderValue1={setSliderValue1}
                show1={show1}
                setShow1={setShow1}
                appliedRange2={appliedRange2}
                setAppliedRange2={setAppliedRange2}
                sliderValue2={sliderValue2}
                setSliderValue2={setSliderValue2}
                show2={show2}
                setShow2={setShow2}
                appliedRange3={appliedRange3}
                setAppliedRange3={setAppliedRange3}
                handleRangeFilterApi={handleRangeFilterApi}
                prodListType={prodListType}
                cookie={cookie}
                resetRangeFilter={resetRangeFilter}
                isMobile={true}
            />
            <ProductView
                handelMenu={handelMenu}
                ImageView={ImageView}
                filterProdListEmpty={filterProdListEmpty}
                data={finalProductListData}
                imageAvailability={imageAvailability}
                imageMap={imageMap}
                getDynamicVideo={getDynamicVideo}
                getDynamicImages={getDynamicImages}
                getDynamicRollImages={getDynamicRollImages}
                metalColorType={metalColorType}
                isshowDots={isshowDots}
                menuParams={menuParams}
                handleCartandWish={handleCartandWish}
                cartArr={cartArr}
                wishArr={wishArr}
                handleImgRollover={handleImgRollover}
                setIsRollOverVideo={setIsRollOverVideo}
                handleLeaveImgRolloverImg={handleLeaveImgRolloverImg}
                storeInit={storeInit}
                handleMoveToDetail={handleMoveToDetail}
                rollOverImgPd={rollOverImgPd}
                isRollOverVideo={isRollOverVideo}
                maxwidth590px={maxwidth590px}
                loginUserDetail={loginUserDetail}
                selectedMetalId={selectedMetalId}
                location={location}
                isProdLoading={isProdLoading}
                metalColorCombo={getSession("MetalColorCombo")}
            />
            <ActionIsland
                ImageView={ImageView}
                ChangeView={() => setImageView(!ImageView)}
                OpenFilter={() => setIsDrawerOpen(true)}
                FilterDrawerOpen={isDrawerOpen}
            />
        </Box>
    );
};

export default Layout;
