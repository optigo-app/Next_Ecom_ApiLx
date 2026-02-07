"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { formatRedirectTitleLine, getDomainName } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import ProductListSkeleton from "@/app/components/productlist_skeleton/ProductListSkeleton";
import {
    Badge,
    Checkbox, Pagination, PaginationItem, Skeleton, useMediaQuery
} from "@mui/material";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import pako from "pako";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Cookies from 'js-cookie'
import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { FilterListAPI } from '@/app/(core)/utils/API/FilterAPI/FilterListAPI';
import { useDynamicImage } from './useProductHook';
import { useProductFilter } from './useProdFilterHook';
import FilterSection from './FilterSection';
// import MobileFilter from './MobileFilter';

import BreadCrumbs from './BreadCrums';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md';
import Product_Card from './Product_Card';

const MobileFilter = dynamic(() => import('./MobileFilter'), { ssr: false });

const Product = ({ params, searchParams, storeinit }) => {

    let loginUserDetail;
    const storeInit = storeinit;

    useEffect(() => {
        loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let mtCombo = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        setMetalTypeCombo(mtCombo)

        let diaQcCombo = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
        setDiaQcCombo(diaQcCombo)

        let CsQcCombo = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
        setCsQcCombo(CsQcCombo)
    }, [])


    let navigate = useNextRouterLikeRR();
    let minwidth1201px = useMediaQuery('(min-width:1201px)')
    let maxwidth590px = useMediaQuery('(max-width:590px)')
    let maxwidth464px = useMediaQuery('(max-width:464px)')

    const { islogin, setCartCountNum, setWishCountNum } = useStore();

    const [productListData, setProductListData] = useState([]);
    const [isProductListData, setIsProductListData] = useState(false);
    const [ShowMore, SetShowMore] = useState(false);
    const [isProdLoading, setIsProdLoading] = useState(true);
    const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
    const [isshowDots, setisshowDots] = useState(false);
    const [filterData, setFilterData] = useState([])
    const [afterFilterCount, setAfterFilterCount] = useState();
    const [expandedAccordions, setExpandedAccordions] = useState({});
    const [cartArr, setCartArr] = useState({})
    const [wishArr, setWishArr] = useState({})
    const [menuParams, setMenuParams] = useState({})
    const [filterProdListEmpty, setFilterProdListEmpty] = useState(false)
    const [metalTypeCombo, setMetalTypeCombo] = useState([]);
    const [diaQcCombo, setDiaQcCombo] = useState([]);
    const [csQcCombo, setCsQcCombo] = useState([]);
    const [selectedMetalId, setSelectedMetalId] = useState();
    const [selectedDiaId, setSelectedDiaId] = useState();
    const [selectedCsId, setSelectedCsId] = useState();
    const [IsBreadCumShow, setIsBreadcumShow] = useState(false);
    const [loginInfo, setLoginInfo] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [rollOverImgPd, setRolloverImgPd] = useState({})
    const [prodListType, setprodListType] = useState();
    const [sortBySelect, setSortBySelect] = useState();
    const [isRollOverVideo, setIsRollOverVideo] = useState({});
    let cookie = Cookies.get('visiterId')
    const [menuDecode, setMenuDecode] = useState('');

    const isEditablePage = 1;

    const setCSSVariable = () => {
        const storeInit = storeinit;
        const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
        document.documentElement.style.setProperty(
            "--background-color",
            backgroundColor
        );
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

        let mtid = loginUserDetailInside?.MetalId ?? storeInitInside?.MetalId
        setSelectedMetalId(mtid)

        let diaid = loginUserDetailInside?.cmboDiaQCid ?? storeInitInside?.cmboDiaQCid
        setSelectedDiaId(diaid)

    }, [])

    useEffect(() => {
        setSelectedMetalId(loginUserDetail?.MetalId ?? storeInit?.MetalId);
        setSelectedDiaId(loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid);
        setSortBySelect('Recommended')
    }, [params])

    const [imageColor, setImageColor] = useState("");

    const metalColorType = [
        {
            id: 1,
            metal: 'gold'
        },
        {
            id: 2,
            metal: 'white'
        },
        {
            id: 3,
            metal: 'rose'
        },
    ]

    const {
        imageMap,
        finalProductListData,
        StoryLineProductList,
        getDynamicRollImages,
        getDynamicImages,
        getDynamicVideo,
        selectedMetalColor,
        handleImgRollover,
        handleLeaveImgRolloverImg,
    } = useDynamicImage(storeInit, productListData);

    const {
        filterChecked,
        afterCountStatus,
        setAfterCountStatus,
        currPage,
        setCurrPage,
        inputPage,
        setInputPage,
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
        handleCheckboxChange,
        FilterValueWithCheckedOnly,
        handelFilterClearAll,
        showClearAllButton,
        handleRangeFilterApi,
    } = useProductFilter(filterData, {
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
        }
        else {
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
        }
        else {
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
        }
        else {
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
        })
    }, [])

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    useEffect(() => {
        let param = JSON?.parse(sessionStorage.getItem("menuparams"))
        if (location?.state?.SearchVal === undefined) {
            setMenuParams(param)
        }
    }, [params, productListData, filterChecked])

    let result = [];

    const lastSearchParamsRef = useRef(null);
    const isApiCallInProgressRef = useRef(false);

    try {
        if (searchParams?.value) {
            const parsed = JSON.parse(searchParams.value);

            if (parsed && typeof parsed === "object") {
                result = Object.entries(parsed).map(([key, value]) => {
                    const decoded = atob(value);       // decode base64
                    const reEncoded = btoa(decoded);   // re-encode
                    return `${key}=${reEncoded}`;
                });
            }
        }
    } catch (err) {
        console.error("Invalid searchParams.value:", searchParams?.value, err);
    }

    useEffect(() => {
        // Create a unique key for current searchParams to avoid duplicate calls
        const currentSearchKey = JSON.stringify(searchParams);

        // Skip if same searchParams or API call already in progress
        if (lastSearchParamsRef.current === currentSearchKey || isApiCallInProgressRef.current) {
            return;
        }

        lastSearchParamsRef.current = currentSearchKey;
        isApiCallInProgressRef.current = true;

        const fetchData = async () => {
            let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
            // let UrlVal = location?.search?.slice(1).split("/")
            let UrlVal = result;
            let MenuVal = '';
            let MenuKey = '';
            let SearchVar = '';
            let TrendingVar = '';
            let NewArrivalVar = '';
            let BestSellerVar = '';
            let AlbumVar = '';

            let productlisttype;

            UrlVal?.forEach((ele) => {
                let firstChar = ele.charAt(0);

                switch (firstChar) {
                    case 'M':
                        MenuVal = ele;
                        break;
                    case 'S':
                        SearchVar = ele;
                        break;
                    case 'T':
                        TrendingVar = ele;
                        break;
                    case 'N':
                        NewArrivalVar = ele;
                        break;
                    case 'B':
                        BestSellerVar = ele;
                        break;
                    case 'A':
                        AlbumVar = ele;
                        break;
                    default:
                        return '';
                }
            })

            if (MenuVal?.length > 0) {
                let menuDecode = atob(MenuVal?.split("=")[1])
                let key = menuDecode?.split("/")[1].split(',')
                let val = menuDecode?.split("/")[0].split(',')

                setIsBreadcumShow(true)
                // setMenuDecode(menuDecode?.split("/"));
                setMenuDecode(menuDecode);

                productlisttype = [key, val]
            }

            if (SearchVar) {
                productlisttype = SearchVar
            }

            if (TrendingVar) {
                productlisttype = TrendingVar.split("=")[1]
            }
            if (NewArrivalVar) {
                productlisttype = NewArrivalVar.split("=")[1]
            }

            if (BestSellerVar) {
                productlisttype = BestSellerVar.split("=")[1]
            }

            if (AlbumVar) {
                productlisttype = AlbumVar.split("=")[1]
            }

            setIsProdLoading(true)
            setprodListType(productlisttype)
            let diafilter =
                filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    )[0]
                    : [];
            let diafilter1 =
                filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    )[0]
                    : [];
            let diafilter2 =
                filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    )[0]
                    : [];
            const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
            const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
            const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

            let DiaRange = {
                DiaMin: isDia ? sliderValue[0] ?? "" : "",
                DiaMax: isDia ? sliderValue[1] ?? "" : ""
            };

            let netRange = {
                netMin: isNet ? sliderValue1[0] ?? "" : "",
                netMax: isNet ? sliderValue1[1] ?? "" : ""
            };

            let grossRange = {
                grossMin: isGross ? sliderValue2[0] ?? "" : "",
                grossMax: isGross ? sliderValue2[1] ?? "" : ""
            };

            await ProductListApi({}, 1, obj, productlisttype, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        // console.log("productList", res);

                        setProductListData(res?.pdList?.sort((a, b) => {
                            return a?.autocode.localeCompare(b?.autocode);
                        }));
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                    }

                    if (res?.pdList) {
                        setIsProductListData(true)
                    }
                    return res;
                })

                .then(async (res) => {
                    let forWardResp1;
                    if (res) {
                        await FilterListAPI(productlisttype, cookie).then((res) => {
                            setFilterData(res)
                            let diafilter = res?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0] : [];
                            let diafilter1 = res?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0] : [];

                            let diafilter2 = res?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0 ? JSON.parse(res?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0] : [];

                            setSliderValue(diafilter?.Min != null || diafilter?.Max != null ? [diafilter.Min, diafilter.Max] : []);
                            setSliderValue1(diafilter1?.Min != null || diafilter1?.Max != null ? [diafilter1?.Min, diafilter1?.Max] : []);
                            setSliderValue2(diafilter2?.Min != null || diafilter2?.Max != null ? [diafilter2?.Min, diafilter2?.Max] : []);
                            forWardResp1 = res
                        }).catch((err) => console.log("err", err))
                    }
                    return forWardResp1
                }).finally(() => {
                    setIsProdLoading(false)
                    setIsOnlyProdLoading(false)
                    isApiCallInProgressRef.current = false; // Reset the flag when API call completes


                })
                .catch((err) => {
                    console.log("err", err);
                    isApiCallInProgressRef.current = false; // Reset the flag on error too
                })

            // }

        }

        fetchData();
    }, [searchParams])

    const prevFilterChecked = useRef();

    useEffect(() => {
        setAfterCountStatus(true);

        const previousChecked = prevFilterChecked.current;
        prevFilterChecked.current = filterChecked;

        if (Object.keys(filterChecked).length > 0 || (previousChecked && JSON.stringify(previousChecked) !== JSON.stringify(filterChecked))) {
            setCurrPage(1);
            setInputPage(1);
        }

        let output = FilterValueWithCheckedOnly()
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        if ((Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true)) {
            setIsOnlyProdLoading(true)
            setIsProdLoading(true)
            let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
            let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
            let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

            ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        setProductListData(res?.pdList);
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                        setAfterCountStatus(false);
                    }
                    return res;
                })

                .catch((err) => console.log("err", err)).finally(() => { setTimeout(() => { setIsOnlyProdLoading(false); setIsProdLoading(false) }, 1000) })
        }

    }, [filterChecked])

    useEffect(() => {
        handelFilterClearAll()
    }, [params])

    useEffect(() => {
        setSortBySelect("Recommended")
    }, [params])

    const totalPages = Math.ceil(
        afterFilterCount / storeInit.PageSize
    );

    const handlePageInputChange = (event) => {
        if (event.key === 'Enter') {
            let newPage = parseInt(inputPage, 10);
            if (newPage < 1) newPage = 1;
            if (newPage > totalPages) newPage = totalPages;
            setCurrPage(newPage);
            setInputPage(newPage);
            handelPageChange("", newPage);
        }
    };

    const handelPageChange = (event, value) => {

        let output = FilterValueWithCheckedOnly()
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }
        setIsOnlyProdLoading(true)
        setIsProdLoading(true)
        setCurrPage(value)
        setInputPage(value);
        setTimeout(() => {
            window.scroll({
                top: 0,
                behavior: 'smooth'
            })
        }, 100)

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
        let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
        let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

        ProductListApi(output, value, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
                    setIsProdLoading(false)
                }
                return res;
            })
            .catch((err) => console.log("err", err)).finally(() => {
                setTimeout(() => {
                    setIsOnlyProdLoading(false)
                }, 100);
                setIsProdLoading(false)
            })
    }

    const handleCartandWish = (e, ele, type) => {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let prodObj = {
            "autocode": ele?.autocode,
            "Metalid": (selectedMetalId ?? ele?.MetalPurityid),
            "MetalColorId": ele?.MetalColorid,
            "DiaQCid": (selectedDiaId ?? islogin == true ? loginInfo?.cmboDiaQCid : storeInit?.cmboDiaQCid),
            "CsQCid": (selectedCsId ?? islogin == true ? loginInfo?.cmboCSQCid : storeInit?.cmboCSQCid),
            "Size": ele?.DefaultSize,
            "Unitcost": ele?.UnitCost,
            "markup": ele?.DesignMarkUp,
            "UnitCostWithmarkup": ele?.UnitCostWithMarkUp,
            "Remark": ""
        }

        if (e.target.checked == true) {
            CartAndWishListAPI(type, prodObj, cookie).then((res) => {
                let cartC = res?.Data?.rd[0]?.Cartlistcount
                let wishC = res?.Data?.rd[0]?.Wishlistcount
                setWishCountNum(wishC)
                setCartCountNum(cartC);
            }).catch((err) => console.log("err", err))
        } else {
            RemoveCartAndWishAPI(type, ele?.autocode, cookie).then((res) => {
                let cartC = res?.Data?.rd[0]?.Cartlistcount
                let wishC = res?.Data?.rd[0]?.Wishlistcount
                setWishCountNum(wishC)
                setCartCountNum(cartC);
            }).catch((err) => console.log("err", err))
        }

        if (type === "Cart") {
            setCartArr((prev) => ({
                ...prev,
                [ele?.autocode]: e.target.checked
            }))
        }

        if (type === "Wish") {
            setWishArr((prev) => ({
                ...prev,
                [ele?.autocode]: e.target.checked
            }))
        }

    }

    useEffect(() => {
        if (productListData?.length === 0 || !productListData) {
            setFilterProdListEmpty(true)
        } else {
            setFilterProdListEmpty(false)
            setAfterCountStatus(false);
        }
    }, [productListData])

    const handelCustomCombo = (obj) => {

        let output = FilterValueWithCheckedOnly()

        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];
        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        if (location?.state?.SearchVal === undefined) {
            setIsOnlyProdLoading(true)
            setIsProdLoading(true)
            let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
            let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
            let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

            ProductListApi(output, 1, obj, prodListType, cookie, sortBySelect, DiaRange, netRange, grossRange)
                .then((res) => {
                    if (res) {
                        setProductListData(res?.pdList);
                        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                    }
                    return res;
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setTimeout(() => {
                        sessionStorage.setItem("short_cutCombo_val", JSON?.stringify(obj))
                        setIsOnlyProdLoading(false)
                        setIsProdLoading(false)
                    }, 100);
                })
        }
    }

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
                    if (
                        storeInit?.MetalId !== selectedMetalId ||
                        storeInit?.cmboDiaQCid !== selectedDiaId
                    ) {
                        handelCustomCombo(obj);
                    }
                }
            }
        }
    }, [selectedMetalId, selectedDiaId, selectedCsId]);

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);

            const compressed = pako.deflate(uint8Array, { to: 'string' });


            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
            return null;
        }
    };

    const decodeAndDecompress = (encodedString) => {
        try {
            if (!encodedString) return null;

            const base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');

            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

            const binaryString = atob(padded);

            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            const decompressed = pako.inflate(uint8Array, { to: 'string' });

            const jsonObject = JSON.parse(decompressed);

            return jsonObject;
        } catch (error) {
            console.error('Error decoding and decompressing:', error);
            return null;
        }
    };

    const handleMoveToDetail = (productData) => {
        let output = FilterValueWithCheckedOnly()
        const uniqueNmList = [...new Set(JSON.parse(productData?.ImageVideoDetail).map(item => item.Nm))];

        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: selectedMetalId,
            d: selectedDiaId,
            c: selectedCsId,
            f: output,
            i: productData?.MetalColorid,
            l: JSON.parse(productData?.ImageVideoDetail)[0]?.Ex,
            count: uniqueNmList.length,
        }

        decodeAndDecompress()

        let encodeObj = compressAndEncode(JSON.stringify(obj))

        navigate.push(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeURIComponent(encodeObj)}`);
    }

    const handleSortby = async (e) => {
        setSortBySelect(e.target?.value)

        let output = FilterValueWithCheckedOnly()
        let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId }

        setIsOnlyProdLoading(true)
        setIsProdLoading(true)

        let sortby = e.target?.value;
        let diafilter =
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                )[0]
                : [];
        let diafilter1 =
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                )[0]
                : [];
        let diafilter2 =
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                ?.length > 0
                ? JSON.parse(
                    filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
                )[0]
                : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify([diafilter?.Min, diafilter?.Max]);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

        let DiaRange = { DiaMin: isDia ? sliderValue[0] : "", DiaMax: isDia ? sliderValue[1] : "" }
        let grossRange = { grossMin: isGross ? sliderValue2[0] : "", grossMax: isGross ? sliderValue2[1] : "" }
        let netRange = { netMin: isNet ? sliderValue1[0] : "", netMax: isNet ? sliderValue1[1] : "" }

        await ProductListApi(output, 1, obj, prodListType, cookie, sortby, DiaRange, netRange, grossRange)
            .then((res) => {
                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount)
                }
                return res;
            })
            .catch((err) => console.log("err", err))
            .finally(() => {
                setIsOnlyProdLoading(false)
                setIsProdLoading(false)
            })
    }

    const resetRangeFilter = async ({
        filterName,
        setSliderValue,
        setTempSliderValue,
        handleRangeFilterApi,
        prodListType,
        cookie,
        setIsShowBtn,
        show, setShow,
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

                setAppliedRange(["", ""])
                setIsShowBtn?.(false);
                if (show) setShow(false)
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
                const hasImage = !!(item?.images?.[0]); // Check if image exists
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

    useEffect(() => {
        (async () => {
            try {
                const res = await getDomainName();
                setisshowDots(res === 'demo' ? true : false)
            } catch (error) {
                return error;
            }
        })();
    }, [])

    return (
        <div className="hoq_dynamic_Collections">
            <MobileFilter
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                filterData={filterData}
                storeInit={storeInit}
                selectedMetalId={selectedMetalId}
                metalTypeCombo={metalTypeCombo}
                selectedDiaId={selectedDiaId}
                setSelectedDiaId={setSelectedDiaId}
                setSelectedMetalId={setSelectedMetalId}
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
            <Banner />
            {/* Image Below */}
            <div className="collection_info">
                <div className="para">
                    <p>
                        Symmetry is boring, imperfections make you perfect. But you know
                        that because you dare to be different, you dare to be you.
                    </p>
                    {ShowMore && (
                        <>
                            <p>
                                This collection symbolises just that. Spanning over the three
                                shapes of diamond cuts, Emerald, Oval and Pear, these pieces
                                bring out the various shades of your personality. Unique, edgy
                                and unconventional yet unfailingly in vogue. A cut above the
                                rest, these stones are intertwined with light weight white
                                gold, that lets the diamonds do the talking.
                            </p>
                        </>
                    )}
                    <span onClick={() => SetShowMore(!ShowMore)}>
                        {ShowMore ? "Read Less" : "Read More"}
                    </span>
                </div>
            </div>
            <div className="bread_crumb_section">
                <BreadCrumbs
                    result={result}
                    IsBreadCumShow={IsBreadCumShow}
                    menuDecode={menuDecode}
                />
            </div>
            <div className="filter_btn_mobile">
                <FilterButton
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    filterData={filterData}
                    sliderValue={sliderValue}
                    sliderValue1={sliderValue1}
                    sliderValue2={sliderValue2}
                    FilterValueWithCheckedOnly={FilterValueWithCheckedOnly}
                />
            </div>
            {/* Filter on Below on iamge Banner */}
            <div className="filter_section">
                {/* productlist cards */}
                <div className="cc_list">

                    {isProdLoading ? (
                        <div className="collections_list">
                            <LoadingSkeleton />
                        </div>
                    ) : finalProductListData && finalProductListData.length > 0 ? (
                        <div className="collections_list">
                            {finalProductListData.map((val, i) => (
                                <Product_Card
                                    key={i}
                                    index={i}
                                    img={getDynamicImages(val?.designno)}
                                    videoUrl={getDynamicVideo(val?.designno, 1, val?.VideoExtension)}
                                    rollUpImage={getDynamicRollImages(
                                        val?.designno,
                                        val?.ImageCount,
                                    )}
                                    title={val?.TitleLine}
                                    designo={val?.designno}
                                    decodeEntities={decodeEntities}
                                    productData={val}
                                    handleMoveToDetail={handleMoveToDetail}
                                    storeInit={storeInit}
                                    selectedMetalId={selectedMetalId}
                                    handleCartandWish={handleCartandWish}
                                    cartArr={cartArr}
                                    productIndex={i}
                                    wishArr={wishArr}
                                    CurrencyCode={loginUserDetail?.CurrencyCode}
                                    CurrencyCode2={storeInit?.CurrencyCode}
                                    StoryLineProductList={StoryLineProductList}
                                />
                            ))}
                        </div>
                    ) : (
                        // <NoProductFound />
                        <NoSearchRes location={location} />
                    )}
                    {storeInit?.IsProductListPagination == 1 &&
                        Math.ceil(afterFilterCount / storeInit.PageSize) > 1 && (
                            <div className="pagination_sec">
                                {isEditablePage === 1 ? (
                                    <div className="pagination-bar">
                                        <EditablePagination
                                            currentPage={currPage}
                                            totalItems={afterFilterCount}
                                            itemsPerPage={storeInit.PageSize}
                                            onPageChange={handelPageChange}
                                            inputPage={inputPage}
                                            setInputPage={setInputPage}
                                            handlePageInputChange={handlePageInputChange}
                                            maxwidth464px={maxwidth464px}
                                            totalPages={totalPages}
                                            currPage={currPage}
                                            isShowButton={false}
                                        />
                                    </div>
                                ) : (
                                    <div className="pagination-bar">
                                        <Pagination
                                            count={totalPages}
                                            page={currPage}
                                            onChange={handelPageChange}
                                            shape="rounded"
                                            className="pagination-btn"
                                            size={maxwidth464px ? "small" : "large"}
                                            showFirstButton
                                            showLastButton
                                            renderItem={(item) => (
                                                <PaginationItem
                                                    {...item}
                                                    sx={{
                                                        pointerEvents: item.page === currPage ? 'none' : 'auto',
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default memo(Product);

const Banner = () => {
    const path = "/WebSiteStaticImage/imageBanner/2.webp"
    return (
        <div
            className="Banner"
            style={{
                backgroundImage: `url(${path})`,
            }}
        >
            <h1>Imperfectly Perfect. </h1>
        </div>
    );
};

const NoSearchRes = ({ location }) => {
    return <div className="NoProductFound">
        <div className="">
            <p style={{ textTransform: 'capitalize' }}>We couldn't find any matches for</p>
            <p style={{ fontWeight: 'bold' }}>{`"${decodeURIComponent(location?.pathname?.split("/")[2])}".`}</p>
        </div>
        <br />
        <p className="search_notfound2">Please try another search.</p>
    </div>
}

const FilterButton = ({
    isDrawerOpen,
    setIsDrawerOpen,
    FilterValueWithCheckedOnly = () => { },
    sliderValue,
    sliderValue1,
    sliderValue2,
    filterData
}) => {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [totalSelected, setTotalSelected] = useState(0);

    const calculateTotalFilters = (selectedFilters) => {
        if (!filterData) return 0;

        let diafilter = filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length > 0
            ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options)[0]
            : [];
        let diafilter1 = filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
            ? JSON.parse(filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options)[0]
            : [];
        let diafilter2 = filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
            ? JSON.parse(filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options)[0]
            : [];

        const isDia = JSON.stringify(sliderValue) !== JSON.stringify((diafilter?.Min != null || diafilter?.Max != null) ? [diafilter?.Min, diafilter?.Max] : []);
        const isNet = JSON.stringify(sliderValue1) !== JSON.stringify((diafilter1?.Min != null || diafilter1?.Max != null) ? [diafilter1?.Min, diafilter1?.Max] : []);
        const isGross = JSON.stringify(sliderValue2) !== JSON.stringify((diafilter2?.Min != null || diafilter2?.Max != null) ? [diafilter2?.Min, diafilter2?.Max] : []);

        let totalCount = 0;

        for (const key in selectedFilters) {
            const value = selectedFilters[key];

            if (value.includes(",")) {
                const options = value.split(",").map((item) => item.trim());
                totalCount += options.length;
            } else {
                totalCount += 1;
            }
        }

        if (isDia) totalCount += 1;
        if (isNet) totalCount += 1;
        if (isGross) totalCount += 1;

        return totalCount;
    };

    useEffect(() => {
        if (isFirstLoad) {
            const timeoutId = setTimeout(() => {
                setIsFirstLoad(false);
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [isFirstLoad]);

    useEffect(() => {
        if (!isFirstLoad && filterData) {
            const values = FilterValueWithCheckedOnly();
            const total = calculateTotalFilters(values);
            setTotalSelected(total);
        }
    }, [isFirstLoad, filterData, sliderValue, sliderValue1, sliderValue2, FilterValueWithCheckedOnly]);

    return (
        <>
            <div className="fb_btn">
                <Badge
                    sx={{
                        "& .MuiBadge-badge": {
                            bgcolor: "#C20000",
                        },
                    }}
                    badgeContent={totalSelected} color="primary" className="badge_hoq_filter_Count">
                    <Checkbox
                        icon={<MdOutlineFilterList size={32} />}
                        checkedIcon={<MdOutlineFilterListOff size={32} style={{ color: "#666666" }} />}
                        checked={isDrawerOpen}
                        onChange={(e) => setIsDrawerOpen(e.target.value)}
                    />
                </Badge>
            </div>
        </>
    );
};



const LoadingSkeleton = () => {
    return Array.from({ length: 8 }).map((_, i) => (
        <div className="C_Card" key={`skeleton-${i}`}>
            <div className="image">
                <Skeleton
                    sx={{
                        width: '100%',
                        height: {
                            xs: '200px !important',
                            sm: '300px !important',
                            md: '500px !important',
                        },
                        display: 'block',
                    }}
                    variant="rectangular"
                    width={"100%"}
                    height={"100%"}
                    className="hoq_CartSkelton"
                />
            </div>
            <div
                className="det"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                }}
            >
                <Skeleton
                    className="hoq_CartSkelton"
                    width={"100%"}
                    height={"22px"}
                    key={`skeleton-desc-${i}-1`}
                />
                <Skeleton
                    className="hoq_CartSkelton"
                    width={"100%"}
                    height={"22px"}
                    key={`skeleton-desc-${i}-2`}
                />
                <Skeleton
                    className="hoq_CartSkelton"
                    width={"100%"}
                    height={"22px"}
                    key={`skeleton-desc-${i}-3`}
                />
            </div>
        </div>
    ));
};
