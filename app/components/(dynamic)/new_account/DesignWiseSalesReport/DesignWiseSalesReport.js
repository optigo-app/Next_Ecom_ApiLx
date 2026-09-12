import React, { useEffect, useRef, useState } from 'react';
import "./DesignWiseSalesReport.scss";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import jsonData from "../json/AccountDesignWiseSales.json";
import SearchIcon from '@mui/icons-material/Search';
import { NumberWithCommas, checkMonth } from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { CommonAPI } from '@/app/(core)/utils/API/CommonAPI/CommonAPI';
import Skeleton from '@mui/material/Skeleton';
import Swal from 'sweetalert2';
import { getDesignWiseSalesReport } from '@/app/(core)/utils/API/AccountTabs/designWiseSalesReport';
import { Box, Button, MenuItem, Select, Slider, TextField, Typography, Accordion, AccordionDetails, AccordionSummary, Checkbox, RadioGroup, FormControlLabel, Radio, CircularProgress, Stack, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import DWSRprintComp from '../DWSRprintComp/DWSRprintComp';


const DesignWiseSalesReport = () => {
    const isSmallScreen = useMediaQuery('(max-width:500px)');
    const imageNotFound = 'Assets/image-not-found.jpg';

    const [headerDetailsDWSR, setHeaderDetailsDWSER] = useState('');

    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [dataRd2, setDataRd2] = useState([]);
    const [filterData, setFilterData] = useState(jsonData);
    const filteredDataPaginated = filterData.slice(offset, offset + perPage);
    const [isLoading, setIsLoading] = useState(false);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [netWtLimit, setNetWtLimit] = useState({
        min: 0,
        max: 0,
    });
    const [grossWtLimit, setGrossWtLimit] = useState({
        min: 0,
        max: 0,
    });
    const [netWtSlider, setNetWtSlider] = useState([netWtLimit?.min, netWtLimit?.max]);
    const [grossWtSlider, setGrossWtSlider] = useState([grossWtLimit?.min, grossWtLimit?.max]);
    const [minDistanceNetWt, setMinDistanceNetWt] = useState(0);
    const [minDistanceGrossWt, setMinDistanceGrossWt] = useState(0);

    const [purchaseCountList, setPurchaseCountList] = useState([
        { id: 0, label: "ALL", value: "ALL" },
        { id: 1, label: "0-5", value: "0-5" },
        { id: 2, label: "5-10", value: "5-10" },
        { id: 3, label: "10-15", value: "10-15" },
        { id: 4, label: "15-20", value: "15-20" },
        { id: 5, label: "20-25", value: "20-25" },
        { id: 6, label: "25 Above", value: "25 Above" }
    ]);
    const [purchaseCount, setPurchaseCount] = useState(purchaseCountList?.length > 0 ? purchaseCountList[0]?.value : null);
    const [metalList, setMetalList] = useState([]);
    const [metal, setMetal] = useState(metalList?.length > 0 ? metalList[0]?.value : null);

    const [productTypeList, setProductTypeList] = useState([]);
    const [productType, setProductType] = useState(productTypeList?.length > 0 ? productTypeList[0]?.value : null);

    const [metalColorList, setMetalColorList] = useState([]);
    const [metalColor, setMetalColor] = useState(metalColorList?.length > 0 ? metalColorList[0]?.value : null);

    const [categorylist, setCategorylist] = useState([]);
    const [category, setCategory] = useState(categorylist?.length > 0 ? categorylist[0]?.value : null);

    const [subCategoryList, setSubCategoryList] = useState([]);
    const [subCategory, setSubCategory] = useState(subCategoryList?.length > 0 ? subCategoryList[0]?.value : null);

    const [designNo, setDesignNo] = useState("");
    const [orderProm, setOrderProm] = useState('order');
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    const handleChangePurchaseCount = (event) => {
        setPurchaseCount(event?.target?.value);
        handleSearch(event, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], event?.target?.value, designNo, metal, productType, metalColor, category, subCategory, orderProm)
    };

    const valuetext = (value) => {
        return `${value}°C`;
    }

    const handleNetWtSlider = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (newValue[1] - newValue[0] < minDistanceNetWt) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], netWtLimit?.max - minDistanceNetWt);
                handleSearch(event, fromDate, toDate, clamped, clamped + minDistanceNetWt, grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm);
                setNetWtSlider([clamped, clamped + minDistanceNetWt]);
            } else {
                const clamped = Math.max(newValue[1], minDistanceNetWt);
                handleSearch(event, fromDate, toDate, clamped - minDistanceNetWt, clamped, grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm);
                setNetWtSlider([clamped - minDistanceNetWt, clamped]);
            }
        } else {
            setNetWtSlider(newValue);
            handleSearch(event, fromDate, toDate, newValue[0], newValue[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm);
        }
    };

    const handleNetWtSliderCustom = (val) => (event) => {

        let vals = (event.target.value);
        let min = 0;
        let max = 0;
        const newValue = [...netWtSlider];
        newValue[val] = vals === '' ? '' : Number(event.target.value);
        handleSearch(event, fromDate, toDate, newValue[0], newValue[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm);
        setNetWtSlider(newValue);
    }

    const resetAllFilters = () => {
        setFromDate(null);
        setToDate(null);
        setOrderProm('order');
        setDesignNo("");
        setNetWtSlider([netWtLimit?.min, netWtLimit?.max]);
        setGrossWtSlider([grossWtLimit?.min, grossWtLimit?.max]);
        setPurchaseCount(purchaseCountList?.length > 0 ? purchaseCountList[0]?.value : null);
        setMetal(metalList?.length > 0 ? metalList[0]?.value : null);
        setProductType(productTypeList?.length > 0 ? productTypeList[0]?.value : null);
        setMetalColor(metalColorList?.length > 0 ? metalColorList[0]?.value : null);
        setCategory(categorylist?.length > 0 ? categorylist[0]?.value : null);
        setSubCategory(subCategoryList?.length > 0 ? subCategoryList[0]?.value : null);
        setFilterData(data);
    }

    const handleBlurNetWt = (index) => (event) => {
        if (netWtSlider[index] < netWtLimit?.min) {
            setNetWtSlider([0, netWtSlider[1]]);
        } else if (netWtSlider[index] > netWtLimit?.max) {
            setNetWtSlider([netWtSlider[0], netWtLimit?.max]);
        }
    };

    const handleGrossWtSlider = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (newValue[1] - newValue[0] < minDistanceGrossWt) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], netWtLimit?.max - minDistanceGrossWt);
                setGrossWtSlider([clamped, clamped + minDistanceGrossWt]);
                handleSearch(event, fromDate, toDate, netWtSlider[0], netWtSlider[1], clamped, clamped + minDistanceGrossWt, purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm)
            } else {
                const clamped = Math.max(newValue[1], minDistanceGrossWt);
                setGrossWtSlider([clamped - minDistanceGrossWt, clamped]);
                handleSearch(event, fromDate, toDate, netWtSlider[0], netWtSlider[1], clamped - minDistanceGrossWt, clamped, purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm)
            }
        } else {
            setGrossWtSlider(newValue);
            handleSearch(event, fromDate, toDate, netWtSlider[0], netWtSlider[1], newValue[0], newValue[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm);
        }
    }

    const handleGrossWtSliderCustom = (val) => (event) => {
        let vals = event.target.value;
        let min = 0;
        let max = 0;
        const newValue = [...grossWtSlider];
        newValue[val] = vals === '' ? '' : Number(event.target.value);
        setGrossWtSlider(newValue);
        handleSearch(event, fromDate, toDate, netWtSlider[0], netWtSlider[1], newValue[0], newValue[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm);
    }

    const handleBlurGrossWt = (index) => (event) => {
        if (grossWtSlider[index] < grossWtLimit?.min) {
            setGrossWtSlider([0, grossWtSlider[1]]);
        } else if (grossWtSlider[index] > grossWtLimit?.max) {
            setGrossWtSlider([grossWtSlider[0], grossWtLimit?.max]);
        }
    }

    const handleChangeProductType = (eve) => {
        setProductType(eve?.target?.value);
        handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, eve?.target?.value, metalColor, category, subCategory, orderProm)
    }

    const handleMetalChange = (eve) => {
        setMetal(eve?.target?.value);
        handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, eve?.target?.value, productType, metalColor, category, subCategory, orderProm)
    }

    const handleChangeMetalColor = (eve) => {
        setMetalColor(eve?.target?.value);
        handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, eve?.target?.value, category, subCategory, orderProm);
    }

    const handleChangeCategory = (eve) => {
        setCategory(eve?.target?.value);
        handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, eve?.target?.value, subCategory, orderProm);
    }

    const handleChangeSubCategory = (eve) => {
        setSubCategory(eve?.target?.value);
        handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, eve?.target?.value, orderProm);
    }

    const handleSearch = (eve, date_From, date_To, netWt1, netWt2, grossWt1, grossWt2, purchase_Count, design_No, Metal_Name, product_Type, metal_Color, category_name, sub_category, orderPromDate) => {
        setOffset(0);
        setPerPage(10);
        let fromdates = `${date_From?.["$y"]}-${checkMonth(date_From?.["$M"])}-${date_From?.["$D"]}`
        let todates = `${date_To?.["$y"]}-${checkMonth(date_To?.["$M"])}-${date_To?.["$D"]}`
        let datas = [];
        let datass = [];
        let count = 0
        data?.forEach((e, i) => {
            let fromdat = moment(fromdates);
            let todat = moment(todates);
            if (!fromdates?.includes(undefined) && !todates?.includes(undefined)) {


                let salescount = dataRd2?.reduce((acc, cObj) => {
                    let cutDate = cObj?.["Date"]?.split(" ");
                    cutDate = `${cutDate[2]}-${cutDate[1]}-${cutDate[0]}`;
                    let cutDat = moment(cutDate);
                    if (moment(fromdat).isSameOrBefore(todat)) {
                        const isBetween = cutDat.isBetween(fromdat, todat, null, '[]');
                        if (e?.designno === cObj?.designno && (isBetween || cutDat.isSame(fromdat) || cutDat.isSame(todat))) {
                            return acc + cObj?.salescount;
                        } else {
                            return acc;
                        }
                    } else {
                        setTimeout(() => {
                            resetAllFilters();
                        }, 0);
                    }
                }, 0);
                if (salescount !== 0) {
                    let obj = { ...e };
                    obj.salescount = salescount;
                    datass?.push(obj);
                }


            } else if (fromdates?.includes(undefined) && !todates?.includes(undefined)) {
                let salescount = dataRd2?.reduce((acc, cObj) => {

                    return acc + cObj?.salescount;

                }, 0);
                Swal.fire({
                    title: "Error !",
                    text: "Enter Valid Date From",
                    icon: "error",
                    confirmButtonText: "ok"
                });
                count = count + 1;


                if (salescount !== 0) {
                    let obj = { ...e };
                    obj.salescount = salescount;
                    datass?.push(obj);
                }

            } else if (!fromdates?.includes(undefined) && todates?.includes(undefined)) {
                let salescount = dataRd2?.reduce((acc, cObj) => {

                    return acc + cObj?.salescount;

                }, 0);
                Swal.fire({
                    title: "Error !",
                    text: "Enter Valid Date To",
                    icon: "error",
                    confirmButtonText: "ok"
                });
                count = count + 1;
                if (salescount !== 0) {
                    let obj = { ...e };
                    obj.salescount = salescount;
                    datass?.push(obj);
                }

            } else if (fromdates?.includes(undefined) && todates?.includes(undefined)) {
                let salescount = dataRd2?.reduce((acc, cObj) => (e?.designno === cObj?.designno) ? (acc + cObj?.salescount) : acc, 0);
                if (salescount !== 0) {
                    let obj = { ...e };
                    obj.salescount = salescount;
                    datass?.push(obj);
                }
            }
            //   } 
        });
        datass?.forEach((e, i) => {
            let flags = {
                netWt: false,
                grossWt: false,
                purchaseCount: false,
                designNo: false,
                metal: false,
                productType: false,
                metalColor: false,
                category: false,
                subCategory: false,
            };

            if (netWt1 === netWtLimit?.min || netWt2 === netWtLimit?.max || netWt1 < netWtLimit?.min || netWt2 > netWtLimit?.max) {
                if ((e?.DesignNetWt <= netWt2 && e?.DesignNetWt >= netWt1)) {
                    flags.netWt = true;
                }
            }
            if (grossWt1 === grossWtLimit?.min || grossWt2 === grossWtLimit?.max || grossWt1 < netWtLimit?.min || grossWt2 > netWtLimit?.max) {
                if ((e?.["GrossWt"] <= grossWt2 && e?.["GrossWt"] >= grossWt1)) {
                    flags.grossWt = true;
                }
            }
            if (e?.designno?.toLowerCase()?.includes(design_No?.toLowerCase())) {
                flags.designNo = true;
            }

            switch (purchase_Count?.toLowerCase()) {
                case "all":
                    flags.purchaseCount = true;
                    break;
                case "0-5":
                    if (0 <= e?.salescount && e?.salescount <= 5) {
                        flags.purchaseCount = true;
                    }
                    break;
                case "5-10":
                    if (5 <= e?.salescount && e?.salescount <= 10) {
                        flags.purchaseCount = true;
                    }
                    break;
                case "10-15":
                    if (10 <= e?.salescount && e?.salescount <= 15) {
                        flags.purchaseCount = true;
                    }
                    break;
                case "15-20":
                    if (15 <= e?.salescount && e?.salescount <= 20) {
                        flags.purchaseCount = true;
                    }
                    break;
                case "20-25":
                    if (20 <= e?.salescount && e?.salescount <= 25) {
                        flags.purchaseCount = true;
                    }
                    break;
                case "25 above":
                    if (25 <= e?.salescount) {
                        flags.purchaseCount = true;
                    }
                    break;
                default:
                    break;
            }
            // }
            if (e?.MetalType?.startsWith(Metal_Name) || Metal_Name?.toLowerCase() === "all") {
                flags.metal = true;
            }
            if (e?.ProductType?.startsWith(product_Type) || product_Type?.toLowerCase() === "all") {
                flags.productType = true;
            }
            if (e?.MetalColor?.startsWith(metal_Color) || metal_Color?.toLowerCase() === "all") {
                flags.metalColor = true;
            }
            if (e?.Categoryname?.startsWith(category_name) || category_name?.toLowerCase() === "all") {
                flags.category = true;
            }
            if (e?.SubCategoryname?.startsWith(sub_category) || sub_category?.toLowerCase() === "all") {
                flags.subCategory = true;
            }
            if ((flags.netWt && flags.grossWt && flags.purchaseCount && flags.designNo && flags.metal && flags.productType && flags.metalColor && flags.category && flags.subCategory) === true) {
                datas.push(e);
            }
        });
        if (count === 0) {
            setFilterData(datas);
        } else {
            resetAllFilters();
        }

    }

    const handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * perPage);
        setOffset(offset);
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const storedData = sessionStorage.getItem('loginUserDetail');
            const data = JSON.parse(storedData);
            const customerid = data.id;

            const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
            const { FrontEnd_RegNo } = storeInit;
            let currencyRate = storeInit?.CurrencyRate;

            const response = await getDesignWiseSalesReport(currencyRate, FrontEnd_RegNo, customerid, data);
            if (response?.Data?.rd2?.length > 0) {
                setHeaderDetailsDWSER(response?.Data?.rd2[0])
            }
            if (response?.Data?.rd) {
                resetAllFilters();
                let datass = [];
                let minNetWt = 0;
                let maxNetWt = 0;
                let minGrossWt = 0;
                let maxGrossWt = 0;
                let purchaseCountArr = [];
                let metalLists = [];
                let productTypeLists = [];
                let metalColorLists = [];
                let categoryLists = [];
                let subCategoryLists = [];
                response?.Data?.rd?.forEach((e, i) => {
                    let obj = { ...e };
                    obj["Sr#"] = i + 1;
                    let salescount = response?.Data?.rd1?.reduce((acc, cobj) => {
                        if (cobj?.designno === e?.designno) {
                            return acc + cobj?.salescount
                        } else {
                            return acc
                        }
                    }, 0);

                    if (minNetWt === 0 || minNetWt > e?.DesignNetWt) {
                        minNetWt = ((e?.DesignNetWt + 0.000));
                    }
                    if (maxNetWt === 0 || maxNetWt < e?.DesignNetWt) {
                        maxNetWt = (e?.DesignNetWt + 0.000);
                    }

                    if (minGrossWt === 0 || minGrossWt > e?.["GrossWt"]) {
                        minGrossWt = e?.["GrossWt"];
                    }

                    if (maxGrossWt === 0 || maxGrossWt < e?.["GrossWt"]) {
                        maxGrossWt = e?.["GrossWt"];
                    }

                    let findPurCouArr = purchaseCountArr?.findIndex((ele, index) => ele?.label === e?.salescount);
                    if (findPurCouArr === -1) {
                        if (String(e?.salescount) !== "") {
                            purchaseCountArr.push({ id: purchaseCountArr?.length, label: e?.salescount, value: e?.salescount });
                        }
                    }
                    let findMetal = metalLists?.findIndex((ele, ind) => ele?.label === e?.MetalType);
                    if (findMetal === -1) {
                        if (e?.MetalType?.trim() !== "") {
                            metalLists.push({ id: metalLists?.length, label: e?.MetalType, value: e?.MetalType });
                        }
                    }

                    let findProductType = productTypeLists?.findIndex((ele, ind) => ele?.label === e?.ProductType);
                    if (findProductType === -1) {
                        if (e?.ProductType?.trim() !== "") {
                            productTypeLists.push({ id: productTypeLists?.length, label: e?.ProductType, value: e?.ProductType });
                        }
                    }

                    let findMetalColor = metalColorLists?.findIndex((ele, ind) => ele?.label === e?.MetalColor);
                    if (findMetalColor === -1) {
                        if (e?.MetalColor?.trim() !== "") {
                            metalColorLists.push({ id: metalColorLists?.length, label: e?.MetalColor, value: e?.MetalColor });
                        }
                    }

                    let findCategory = categoryLists?.findIndex((ele, ind) => ele?.label === e?.Categoryname);
                    if (findCategory === -1) {
                        if (e?.Categoryname?.trim() !== "") {
                            categoryLists.push({ id: categoryLists?.length, label: e?.Categoryname, value: e?.Categoryname });
                        }
                    }

                    let findSubCategory = subCategoryLists?.findIndex((ele, ind) => ele?.label === e?.SubCategoryname);
                    if (findSubCategory === -1) {
                        if (e?.SubCategoryname?.trim() !== "") {
                            subCategoryLists.push({ id: subCategoryLists?.length, label: e?.SubCategoryname, value: e?.SubCategoryname });
                        }
                    }
                    obj.salescount = salescount;
                    datass?.push(obj);

                });
                setNetWtLimit({ ...netWtLimit, min: minNetWt, max: maxNetWt });
                setNetWtSlider([minNetWt, maxNetWt]);
                setMinDistanceNetWt((maxNetWt - (maxNetWt - minNetWt)) / 100);
                setGrossWtLimit({ ...grossWtLimit, min: minGrossWt, max: maxGrossWt });
                setGrossWtSlider([minGrossWt, maxGrossWt]);
                setMinDistanceGrossWt((maxNetWt - (maxNetWt - minNetWt)) / 100);
                metalLists?.unshift({ id: metalLists?.length, label: "ALL", value: "ALL" });
                setMetalList(metalLists);
                metalLists?.length > 0 && setMetal(metalLists[0]?.value);
                setProductTypeList(productTypeLists);
                productTypeLists?.unshift({ id: productTypeLists?.length, label: "ALL", value: "ALL" });
                productTypeLists?.length > 0 && setProductType(productTypeLists[0]?.value);
                metalColorLists?.unshift({ id: metalColorLists?.length, label: "ALL", value: "ALL" });
                setMetalColorList(metalColorLists);
                metalColorLists?.length > 0 && setMetalColor(metalColorLists[0]?.value);
                categoryLists?.unshift({ id: categoryLists?.length, label: "ALL", value: "ALL" });
                setCategorylist(categoryLists);
                categoryLists?.length > 0 && setCategory(categoryLists[0]?.value);
                subCategoryLists?.unshift({ id: subCategoryLists?.length, label: "ALL", value: "ALL" });
                setSubCategoryList(subCategoryLists);
                subCategoryLists?.length > 0 && setSubCategory(subCategoryLists[0]?.value);

                setData(datass);
                setFilterData(datass);

            } else {
                // alert('nodata')
                setData([]);
                setFilterData([]);
                setIsLoading(false);
            }
            if (response?.Data?.rd1) {
                setDataRd2(response?.Data?.rd1)
            }
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        let inputFrom = fromDateRef?.current?.querySelector(".MuiInputBase-root input");
        if (inputFrom) {
            inputFrom.placeholder = 'Date From';
        }
        let inputTo = toDateRef?.current?.querySelector(".MuiInputBase-root input");
        if (inputTo) {
            inputTo.placeholder = 'Date To';
        }
    }, []);


    const handleDWSRprint = (data) => {
        // navigate("/accountdwsr");
        // navigate('/accountdwsr', { state: { bigData: data } });
        let dataObj = {
            data: data,
            headerData: headerDetailsDWSR
        }

        sessionStorage.setItem('dwsrdata', JSON.stringify(dataObj));
        // Open the route in a new tab
        window.open('/accountdwsr', '_blank');
    }

    return (
        <div className='designWiseSaleReport_Account_SMR'>
            <Box className="designWiseSalesReport">

                {!isSmallScreen && <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Button variant="contained" sx={{ background: "#7d7f85" }} className='muiSmilingRocksBtn' onClick={eve => resetAllFilters(eve)}>All</Button>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date From"
                                value={fromDate}
                                ref={fromDateRef}
                                format="DD MM YYYY"
                                className='quotationFilterDates'
                                onChange={(newValue) => {
                                    if (newValue === null) {
                                        setFromDate(null)
                                    } else {
                                        if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                                            setFromDate(newValue)
                                        } else {
                                            Swal.fire({
                                                title: "Error !",
                                                text: "Enter Valid Date From",
                                                icon: "error",
                                                confirmButtonText: "ok"
                                            });
                                            resetAllFilters();
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ paddingRight: "25px", paddingBottom: "10px", }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date To"
                                value={toDate}
                                ref={toDateRef}
                                format="DD MM YYYY"
                                className='quotationFilterDates'
                                onChange={(newValue) => {
                                    if (newValue === null) {
                                        setToDate(null)
                                    } else {
                                        if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                                            setToDate(newValue)
                                        } else {
                                            Swal.fire({
                                                title: "Error !",
                                                text: "Enter Valid Date To",
                                                icon: "error",
                                                confirmButtonText: "ok"
                                            });
                                            resetAllFilters();
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{ paddingRight: "25px", paddingBottom: "10px", }} className="searchDesignWiseSalesReport">
                        <Button variant='contained' className='muiSmilingRocksBtn'
                            sx={{ padding: "7px 10px", minWidth: "max-content", background: "#7d7f85" }}
                            onClick={(eve) => handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm)}>
                            <SearchIcon sx={{ color: "#fff !important" }} /></Button>
                    </Box>

                    <Box sx={{ marginRight: "45px", paddingBottom: "10px", width: 190 }}>
                        <Typography sx={{ textAlign: "center" }}>NetWt(gm)</Typography>
                        <Slider
                            className='netWtSecSlider'
                            getAriaLabel={() => 'NetWt(gm)'}
                            value={netWtSlider}
                            onChange={handleNetWtSlider}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            disableSwap
                            min={(netWtLimit?.min)}
                            max={(netWtLimit?.max)}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }} className="netWtSliderSec">
                            <Typography sx={{ maxWidth: "50px" }}>
                                <TextField type="number" value={(netWtSlider[0])} sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                    onChange={handleNetWtSliderCustom(0)}
                                    onBlur={handleBlurNetWt(0)}
                                    inputProps={{ min: netWtLimit?.min, max: netWtSlider[1], type: 'number', step: 1 }}
                                />
                            </Typography>
                            <Typography sx={{ maxWidth: "50px" }}>
                                <TextField type="number" value={(netWtSlider[1])}
                                    sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                    inputProps={{ min: netWtSlider[0], max: netWtLimit?.max, type: 'number', step: 1 }}
                                    onChange={handleNetWtSliderCustom(1)}
                                    onBlur={handleBlurNetWt(1)}
                                />
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ marginRight: "45px", paddingBottom: "10px", width: 190 }}>
                        <Typography sx={{ textAlign: "center" }}>GrossWt</Typography>
                        <Slider
                            className='netWtSecSlider'
                            getAriaLabel={() => 'GrossWt'}
                            value={grossWtSlider}
                            onChange={handleGrossWtSlider}
                            valueLabelDisplay="auto"
                            disableSwap
                            min={grossWtLimit?.min}
                            max={grossWtLimit?.max}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }} className="netWtSliderSec">
                            <Typography sx={{ maxWidth: "50px" }}>
                                <TextField type="number" value={grossWtSlider[0]} sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                    onChange={handleGrossWtSliderCustom(0)}
                                    onBlur={handleBlurGrossWt(0)}
                                    inputProps={{ min: grossWtLimit?.min, max: grossWtSlider[1], type: 'number', step: 1 }}
                                />
                            </Typography>
                            <Typography sx={{ maxWidth: "50px" }}>
                                <TextField type="number" value={grossWtSlider[1]}
                                    sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                    inputProps={{ min: grossWtSlider[0], max: grossWtLimit?.max, type: 'number', step: 1 }}
                                    onChange={handleGrossWtSliderCustom(1)}
                                    onBlur={handleBlurGrossWt(1)}
                                />
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography sx={{ paddingBottom: "3px" }}>Purchase Count</Typography>
                        <Box
                        >
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={purchaseCount}
                                label="Age"
                                onChange={handleChangePurchaseCount}
                                sx={{ width: "80px" }}
                            >
                                {purchaseCountList?.map((ele, ind) => {
                                    return <MenuItem value={ele?.value}>{ele?.label}</MenuItem>
                                })}
                            </Select>
                        </Box>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography>DesignNo</Typography>
                        <TextField type='text' value={designNo} onChange={eve => {
                            setDesignNo(eve?.target?.value);
                            handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, eve?.target?.value, metal, productType, metalColor, category, subCategory, orderProm);
                        }} className='design_No' placeholder='#DesignNo' />
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography sx={{ paddingBottom: "5px" }}>Metal</Typography>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={metal}
                            label="Age"
                            onChange={handleMetalChange}
                            sx={{ width: "200px" }}
                        >
                            {metalList?.map((ele, ind) => {
                                return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                            })}
                        </Select>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography sx={{ paddingBottom: "5px" }}>Product Type</Typography>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={productType}
                            label="Product Type"
                            onChange={handleChangeProductType}
                            sx={{ width: "200px" }}
                        >
                            {productTypeList?.map((ele, ind) => {
                                return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                            })}
                        </Select>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography sx={{ paddingBottom: "5px" }}>Metal Color</Typography>
                        <Select
                            labelId="metalColor"
                            id="demo-simple-select"
                            value={metalColor}
                            label="Product Type"
                            onChange={handleChangeMetalColor}
                            sx={{ width: "200px" }}
                        >
                            {metalColorList?.map((ele, ind) => {
                                return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                            })}
                        </Select>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography sx={{ paddingBottom: "5px" }}>Category</Typography>
                        <Select
                            labelId="metalColor"
                            id="demo-simple-select"
                            value={category}
                            label="Product Type"
                            onChange={handleChangeCategory}
                            sx={{ width: "200px" }}
                        >
                            {categorylist?.map((ele, ind) => {
                                return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                            })}
                        </Select>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "10px", }}>
                        <Typography sx={{ paddingBottom: "5px" }}>SubCategory</Typography>
                        <Select
                            labelId="SubCategory"
                            id="demo-simple-select"
                            value={subCategory}
                            label="Product Type"
                            onChange={handleChangeSubCategory}
                            sx={{ width: "200px" }}
                        >
                            {subCategoryList?.map((ele, ind) => {
                                return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                            })}
                        </Select>
                    </Box>

                    <Box sx={{ paddingRight: "15px", paddingBottom: "0px" }}>
                        <Button variant="contained" sx={{ background: "#7d7f85" }} className='muiSmilingRocksBtn' onClick={() => handleDWSRprint(filterData)}><PrintIcon titleAccess='click here for print' /></Button>
                    </Box>

                </Box>}

                {isSmallScreen &&
                    <>
                        <Accordion style={{ padding: '2px', paddingBottom: '10px', marginBottom: '40px', marginTop: '20px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>More Filters</AccordionSummary>
                            <AccordionDetails style={{ margin: '0px', padding: '0px' }}>
                                <Box sx={{ paddingRight: "15px", paddingBottom: "20px", marginLeft: '2px' }}>
                                    <Button variant="contained" size='small' sx={{ background: "#7d7f85" }} className='muiSmilingRocksBtn' onClick={eve => resetAllFilters(eve)}>All</Button>
                                </Box>
                                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                                    <Box style={{ minWidth: '35%', maxWidth: '35%', width: '100%', boxSizing: 'border-box' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Date From"
                                                value={fromDate}
                                                ref={fromDateRef}
                                                format="DD MM YYYY"
                                                className='quotationFilterDates'
                                                onChange={(newValue) => {
                                                    if (newValue === null) {
                                                        setFromDate(null)
                                                    } else {
                                                        if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                                                            setFromDate(newValue)
                                                        } else {
                                                            Swal.fire({
                                                                title: "Error !",
                                                                text: "Enter Valid Date From",
                                                                icon: "error",
                                                                confirmButtonText: "ok"
                                                            });
                                                            resetAllFilters();
                                                        }
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box style={{ minWidth: '35%', maxWidth: '35%', width: '100%', boxSizing: 'border-box' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Date To"
                                                value={toDate}
                                                ref={toDateRef}
                                                format="DD MM YYYY"
                                                className='quotationFilterDates'
                                                onChange={(newValue) => {
                                                    if (newValue === null) {
                                                        setToDate(null)
                                                    } else {
                                                        if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                                                            setToDate(newValue)
                                                        } else {
                                                            Swal.fire({
                                                                title: "Error !",
                                                                text: "Enter Valid Date To",
                                                                icon: "error",
                                                                confirmButtonText: "ok"
                                                            });
                                                            resetAllFilters();
                                                        }
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box className="searchDesignWiseSalesReport">
                                        <Button variant='contained' size='small' className='muiSmilingRocksBtn'
                                            sx={{ padding: "7px 7px", minWidth: "max-content", background: "#7d7f85" }}
                                            onClick={(eve) => handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, designNo, metal, productType, metalColor, category, subCategory, orderProm)}>
                                            <SearchIcon sx={{ color: "#fff !important" }} /></Button>
                                    </Box>
                                </Box>
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ paddingBottom: "10px", width: 250 }}>
                                        <Typography sx={{ textAlign: "center" }}>NetWt(gm)</Typography>
                                        <Slider
                                            className='netWtSecSlider'
                                            getAriaLabel={() => 'NetWt(gm)'}
                                            value={netWtSlider}
                                            onChange={handleNetWtSlider}
                                            valueLabelDisplay="auto"
                                            getAriaValueText={valuetext}
                                            disableSwap
                                            min={(netWtLimit?.min)}
                                            max={(netWtLimit?.max)}
                                        />
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }} className="netWtSliderSec">
                                            <Typography sx={{ maxWidth: "50px" }}>
                                                <TextField type="number" value={(netWtSlider[0])} sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                                    onChange={handleNetWtSliderCustom(0)}
                                                    onBlur={handleBlurNetWt(0)}
                                                    inputProps={{ min: netWtLimit?.min, max: netWtSlider[1], type: 'number', step: 1 }}
                                                />
                                            </Typography>
                                            <Typography sx={{ maxWidth: "50px" }}>
                                                <TextField type="number" value={(netWtSlider[1])}
                                                    sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                                    inputProps={{ min: netWtSlider[0], max: netWtLimit?.max, type: 'number', step: 1 }}
                                                    onChange={handleNetWtSliderCustom(1)}
                                                    onBlur={handleBlurNetWt(1)}
                                                />
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ paddingBottom: "10px", width: 250 }}>
                                        <Typography sx={{ textAlign: "center" }}>GrossWt</Typography>
                                        <Slider
                                            className='netWtSecSlider'
                                            getAriaLabel={() => 'GrossWt'}
                                            value={grossWtSlider}
                                            onChange={handleGrossWtSlider}
                                            valueLabelDisplay="auto"
                                            disableSwap
                                            min={grossWtLimit?.min}
                                            max={grossWtLimit?.max}
                                        />
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }} className="netWtSliderSec">
                                            <Typography sx={{ maxWidth: "50px" }}>
                                                <TextField type="number" value={grossWtSlider[0]} sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                                    onChange={handleGrossWtSliderCustom(0)}
                                                    onBlur={handleBlurGrossWt(0)}
                                                    inputProps={{ min: grossWtLimit?.min, max: grossWtSlider[1], type: 'number', step: 1 }}
                                                />
                                            </Typography>
                                            <Typography sx={{ maxWidth: "50px" }}>
                                                <TextField type="number" value={grossWtSlider[1]}
                                                    sx={{ maxWidth: "50px", width: "50px", minWidth: "65px" }}
                                                    inputProps={{ min: grossWtSlider[0], max: grossWtLimit?.max, type: 'number', step: 1 }}
                                                    onChange={handleGrossWtSliderCustom(1)}
                                                    onBlur={handleBlurGrossWt(1)}
                                                />
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ paddingBottom: "10px" }}>
                                    <Typography>DesignNo</Typography>
                                    <TextField type='text' value={designNo} style={{ width: '100%' }} onChange={eve => {
                                        setDesignNo(eve?.target?.value);
                                        handleSearch(eve, fromDate, toDate, netWtSlider[0], netWtSlider[1], grossWtSlider[0], grossWtSlider[1], purchaseCount, eve?.target?.value, metal, productType, metalColor, category, subCategory, orderProm);
                                    }} className='design_No' placeholder='#DesignNo' />
                                </Box>
                                <Box sx={{ paddingBottom: "10px", minWidth: '100%', maxWidth: '100%', width: '100%' }}>
                                    <Typography sx={{ paddingBottom: "3px" }}>Purchase Count</Typography>
                                    <Box style={{ width: '100%' }}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={purchaseCount}
                                            label="Age"
                                            onChange={handleChangePurchaseCount}
                                            sx={{ width: "100%" }}
                                        >
                                            {purchaseCountList?.map((ele, ind) => {
                                                return <MenuItem value={ele?.value}>{ele?.label}</MenuItem>
                                            })}
                                        </Select>
                                    </Box>
                                </Box>
                                <Box sx={{ paddingBottom: "10px", }}>
                                    <Typography sx={{ paddingBottom: "5px" }}>Metal</Typography>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={metal}
                                        label="Age"
                                        onChange={handleMetalChange}
                                        sx={{ width: "100%" }}
                                    >
                                        {metalList?.map((ele, ind) => {
                                            return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                                        })}
                                    </Select>
                                </Box>

                                <Box sx={{ paddingBottom: "10px", }}>
                                    <Typography sx={{ paddingBottom: "5px" }}>Product Type</Typography>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={productType}
                                        label="Product Type"
                                        onChange={handleChangeProductType}
                                        sx={{ width: "100%" }}
                                    >
                                        {productTypeList?.map((ele, ind) => {
                                            return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                                        })}
                                    </Select>
                                </Box>

                                <Box sx={{ paddingBottom: "10px", }}>
                                    <Typography sx={{ paddingBottom: "5px" }}>Metal Color</Typography>
                                    <Select
                                        labelId="metalColor"
                                        id="demo-simple-select"
                                        value={metalColor}
                                        label="Product Type"
                                        onChange={handleChangeMetalColor}
                                        sx={{ width: "100%" }}
                                    >
                                        {metalColorList?.map((ele, ind) => {
                                            return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                                        })}
                                    </Select>
                                </Box>

                                <Box sx={{ paddingBottom: "10px", }}>
                                    <Typography sx={{ paddingBottom: "5px" }}>Category</Typography>
                                    <Select
                                        labelId="metalColor"
                                        id="demo-simple-select"
                                        value={category}
                                        label="Product Type"
                                        onChange={handleChangeCategory}
                                        sx={{ width: "100%" }}
                                    >
                                        {categorylist?.map((ele, ind) => {
                                            return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                                        })}
                                    </Select>
                                </Box>

                                <Box sx={{ paddingBottom: "10px", }}>
                                    <Typography sx={{ paddingBottom: "5px" }}>SubCategory</Typography>
                                    <Select
                                        labelId="SubCategory"
                                        id="demo-simple-select"
                                        value={subCategory}
                                        label="Product Type"
                                        onChange={handleChangeSubCategory}
                                        sx={{ width: "100%" }}
                                    >
                                        {subCategoryList?.map((ele, ind) => {
                                            return <MenuItem value={ele?.value} sx={{ textTransform: 'uppercase' }}>{ele?.label}</MenuItem>
                                        })}
                                    </Select>
                                </Box>

                            </AccordionDetails>
                        </Accordion>
                    </>
                }


                {isLoading ?
                    <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "10px", margin: "0 auto" }}><CircularProgress className='loadingBarManage' /></Box> :
                    <>
                        {filterData?.length > 0 ? <Box sx={{ display: "grid", gap: "15px", paddingTop: "10px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", }} className="designWiseSalesProducts">
                            {filteredDataPaginated?.map((products, i) => (
                                <div
                                    style={{
                                        minWidth: "100%",
                                        border: "1px solid #e1e1e1",
                                        textAlign: "center",
                                        color: "#7d7f85",
                                        position: "relative",
                                        zIndex: 0,
                                        background: "#c0bbb133",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                    className="smilingProductImageBox designWiseSalesReportProduct"
                                >
                                    <Box sx={{ paddingBottom: "10px" }}>
                                        <Box sx={{ minheight: "271px" }}>
                                            {isLoading === false ? (
                                                <img className="prod_img"
                                                    draggable={true}
                                                    alt="modalimages"
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    src={products?.imgsrc} onError={(e) => e.target.src = imageNotFound} style={{ objectFit: "contain", height: "100%", minheight: "271px", maxHeight: "271px" }} />
                                            ) : (
                                                <Skeleton variant="rectangular" width={"100%"} style={{ marginBottom: '76px', height: '310px' }} />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box sx={{ padding: "0 5px", display: "flex", justifyContent: "space-between" }}>
                                            <Typography style={{ fontSize: "13px", textTransform: "uppercase", cursor: "pointer", fontWeight: "bold", textAlign: "start" }} >
                                                {products?.designno}
                                            </Typography>
                                            <Typography style={{ fontSize: "13px", textTransform: "uppercase", cursor: "pointer", fontWeight: "bold", textAlign: "start" }} >
                                                NetWt: {products?.DesignNetWt?.toFixed(3)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ padding: "0 5px", display: "flex", justifyContent: "space-between" }}>
                                            <Typography style={{ fontSize: "12px", textAlign: "start", }}>
                                                Dia Pcs/Wt: {NumberWithCommas(products?.diamondpcs, 0)} / {NumberWithCommas(products?.diamondwt, 3)}
                                            </Typography>
                                            <Typography style={{ fontSize: "12px", textAlign: "start", }}>
                                                Cs Pcs/Wt: {NumberWithCommas(products?.colorstonepcs, 0)} / {NumberWithCommas(products?.colorstonewt, 0)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ padding: "0 5px 5px", display: "flex", justifyContent: "space-between" }}>
                                            <Typography style={{ fontSize: "12px", textAlign: "start", }}>
                                                Purchase Count: {NumberWithCommas(products?.salescount, 0)}
                                            </Typography>

                                        </Box>
                                    </Box>

                                </div>
                            ))}
                        </Box> : <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'grey', fontWeight: 'bold', marginTop: '3%' }}>Data Not Present</div>}
                    </>

                }

                {filterData?.length !== 0 && <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(filterData.length / perPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    className='reactPaginationDesignWise'
                />}
            </Box>
        </div>
    )
}

export default DesignWiseSalesReport
