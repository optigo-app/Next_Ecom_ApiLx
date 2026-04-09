import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Checkbox, CircularProgress, FormControlLabel, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Accordion, AccordionDetails, AccordionSummary, useMediaQuery, Typography, Skeleton, Divider, ToggleButtonGroup, ToggleButton, Pagination, } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import "./quotation.scss";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import ListIcon from '@mui/icons-material/List';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { checkMonth, customComparator_Col, formatAmount, NumberWithCommas, sortByDate, sortByKeyDescendingJobno, stableSort } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import { getQuotationJobData } from '@/app/(core)/utils/API/AccountTabs/quotationJob';

import { headCells_Jobs as columns } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPageColumns";
import { formatter } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import ReactPaginate from 'react-paginate';

const CustomSortIcon = ({ order }) => {
  return (
    <>
      {order === 'asc' && <ArrowUpwardIcon className='sorticon_ma_SMR' />}
      {order === 'desc' && <ArrowDownwardIcon className='sorticon_ma_SMR' />}
    </>
  );
};

const QuotationJob = () => {

  const storedData = sessionStorage.getItem('loginUserDetail');
  const loginDetails = JSON.parse(storedData);
  const imageNotFound = "image-not-found.jpg";
  const [allChecked, setAllChecked] = useState(false);
  const [orderProm, setOrderProm] = useState('order');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [hoverImg, setHoverImg] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('');
  const [statusList, setStatusList] = useState([]);
  const [currPage, setCurrPage] = useState(1)
  const [categoryList, setCategoryList] = useState([

  ]);
  const [metalColorList, setmetalColorList] = useState([

  ]);
  const [metalPurityList, setMetalPurityList] = useState([

  ]);
  const [statuse, setStatus] = useState(statusList[0]?.value || "");
  const [category, setCategory] = useState(categoryList[0]?.value || "");
  const [MetalColor, setMetalColor] = useState(metalColorList[0]?.value || "");
  const [metalPurity, setMetalPurity] = useState(metalPurityList[0]?.value || "");

  const [isLoading, setIsLoading] = useState(false);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [PrintUrl, setPrintUrl] = useState('');

  const [view, setView] = useState(() => {
    return localStorage.getItem('lastView') || 'list';
  });

  const handleImageShow = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
      localStorage.setItem('lastView', nextView);
    }
  };

  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(40);
  const filteredDataPaginated = filterData.slice(offset, offset + perPage);

  const sortedFilteredData = stableSort(filterData, getComparator(order, orderBy === 'PO' ? 'lineid' : orderBy));
  const paginatedData = sortedFilteredData.slice(offset, offset + perPage);

  const handlePageClick = (data) => {
    setCurrPage(data);
    const selected = data;
    const offset = ((selected === 0 ? selected + 1 : selected) - 1) * perPage;
    setOffset(offset);
    scrollToTop();
  };

  const isSmallScreen = useMediaQuery('(max-width:500px)');

  moment.locale('en-gb');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleOrderProms = (event) => {
    setPage(0);
    setRowsPerPage(10);
    setCurrPage(1)
    setOffset(0);
    setOrderProm(event.target.value);
  };
  const handleStatus = (event) => {
    setPage(0);
    setRowsPerPage(10);
    setCurrPage(1)
    setOffset(0);
    setSelectedStatus(event.target.value);
    handleSearch(event, searchVal, fromDate, toDate, metalPurity, MetalColor, category, event.target.value, orderProm);
  };
  const handleCategory = (event) => {
    setPage(0);
    setRowsPerPage(10);
    setCurrPage(1)
    setOffset(0);
    setCategory(event.target.value);
    // handleSearch(event, searchVal, fromDate, toDate, metalPurity, MetalColor, event.target.value, statuse, orderProm);
    handleSearch(event, searchVal, fromDate, toDate, metalPurity, MetalColor, event.target.value, selectedStatus, orderProm);
  };
  const handleMetalColor = (event) => {
    setPage(0);
    setRowsPerPage(10);
    setCurrPage(1)
    setOffset(0);
    setMetalColor(event.target.value);
    // handleSearch(event, searchVal, fromDate, toDate, metalPurity, event.target.value, category, statuse, orderProm);
    handleSearch(event, searchVal, fromDate, toDate, metalPurity, event.target.value, category, selectedStatus, orderProm);
  };
  const handleMetalPurity = (event) => {
    setPage(0);
    setRowsPerPage(10);
    setCurrPage(1)
    setOffset(0);
    setMetalPurity(event.target.value);
    // handleSearch(event, searchVal, fromDate, toDate, event.target.value, MetalColor, category, statuse, orderProm);
    handleSearch(event, searchVal, fromDate, toDate, event.target.value, MetalColor, category, selectedStatus, orderProm);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setAllChecked(false);
    scrollToTop();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setCurrPage(1)
    setOffset(0);
    setAllChecked(false);
    scrollToTop();
  };

  const handleSearch = (eve, searchValue, fromDatess, todatess, metalPurities, MetalColors, categories, statuss, orderPromDate) => {
    let fromdates = `${fromDatess?.["$y"]}-${checkMonth(fromDatess?.["$M"])}-${fromDatess?.["$D"]}`
    let todates = `${todatess?.["$y"]}-${checkMonth(todatess?.["$M"])}-${todatess?.["$D"]}`
    let filteredData = [];
    setOffset(0);
    setCurrPage(1)
    let count = 0;
    data?.forEach((e, i) => {
      let flags = {
        dateFrom: false,
        dateTo: false,
        status: false,
        category: false,
        MetalColor: false,
        search: false,
        metalPurity: false,
      }
      if (searchValue !== "") {
        if (e?.["Sr#"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["Date"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["SKUNO"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          // e?.["PO"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["lineid"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["JobNo"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["DesignNo"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["Category"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["metal_color"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["metal_purity"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["PDate"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["FinalAmount"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["ProgressStatusName"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["Quantity"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase()) ||
          e?.["SuppliedQuantity"]?.toString()?.toLowerCase()?.includes(searchValue?.trim()?.toLowerCase())) {
          flags.search = true;
        }

      } else {
        flags.search = true;
      }
      //order date and promise date flag filter
      let cutDate = "";
      if (orderPromDate === "order") {
        cutDate = e?.["Date"]?.split("-");
      } else {
        cutDate = e?.["PDate"]?.split("-");
      }
      if (cutDate !== undefined) {



        cutDate = `${cutDate[2]}-${cutDate[1]}-${cutDate[0]}`;
        if (!fromdates?.includes(undefined) && !todates?.includes(undefined)) {
          let fromdat = moment(fromdates);
          let todat = moment(todates);
          let cutDat = moment(cutDate);
          if (moment(fromdat).isSameOrBefore(todat)) {
            const isBetween = cutDat.isBetween(fromdat, todat);
            if (isBetween || cutDat.isSame(fromdat) || cutDat.isSame(todat)) {
              flags.dateTo = true;
              flags.dateFrom = true;
            }
          } else {
            setTimeout(() => {
              resetAllFilters();
            }, 0)
          }
        } else if (fromdates?.includes(undefined) && !todates?.includes(undefined)) {

          flags.dateTo = true;
          count++;
          Swal.fire({
            title: "Error !",
            text: "Enter Valid Date From",
            icon: "error",
            confirmButtonText: "ok"
          });


        } else if (!fromdates?.includes(undefined) && todates?.includes(undefined)) {

          flags.dateFrom = true;
          count++;
          Swal.fire({
            title: "Error !",
            text: "Enter Valid Date To",
            icon: "error",
            confirmButtonText: "ok"
          });

        } else if (fromdates?.includes(undefined) && todates?.includes(undefined)) {
          flags.dateTo = true;
          flags.dateFrom = true;
        }

      }





      // if (e?.MetalType?.toString()?.toLowerCase()?.startsWith(metalPurities?.toLowerCase()) || metalPurities?.toLowerCase() === "all") {
      //   flags.metalPurity = true;
      // }
      if ((e?.MetalType?.toString()?.toLowerCase() === metalPurities?.toString()?.toLowerCase()) || metalPurities?.toLowerCase() === "all") {
        flags.metalPurity = true;
      }

      // if (e?.MetalColor?.toString()?.toLowerCase()?.startsWith(MetalColors?.toLowerCase()) || MetalColors?.toLowerCase() === "all") {
      //   flags.MetalColor = true;
      // }
      if ((e?.MetalColor?.toString()?.toLowerCase() === MetalColors?.toString()?.toLowerCase()) || MetalColors?.toLowerCase() === "all") {
        flags.MetalColor = true;
      }


      // if (e?.Category?.toString()?.toLowerCase()?.startsWith(categories?.toLowerCase()) || categories?.toLowerCase() === "all") {
      //   flags.category = true;
      // }
      if ((e?.Category?.toString()?.toLowerCase() === categories?.toLowerCase()) || categories?.toLowerCase() === "all") {
        flags.category = true;
      }






      if (!Array.isArray(statuss) || statuss?.length === 0) {
        flags.status = true; // Show all data
      } else {
        // Check if any selected status matches the ProgressStatusName
        if (Array.isArray(statuss)) {
          if (statuss.includes(e?.ProgressStatusName)) {
            flags.status = true;
          }
        } else {
          if (e?.ProgressStatusName === statuss || statuss === "all") {
            flags.status = true;
          }
        }
      }






      if (flags.dateFrom === true && flags.dateTo === true && flags.status === true &&
        flags.category === true && flags.MetalColor === true && flags.search === true &&
        flags.metalPurity === true) {
        filteredData.push(e);
      }

    });
    if (count === 0) {
      setFilterData(filteredData);
    } else {
      resetAllFilt();
      handleSearch(eve, "", null, null, metalPurityList[0]?.value, metalColorList[0]?.value, categoryList[0]?.value, statusList[0]?.value, "order");
    }
  }

  const resetAllFilters = (eve) => {
    setSelectedStatus([]);
    setOrderProm("order");
    setFromDate(null);
    setToDate(null);
    setStatus(statusList[0]?.value);
    setCategory(categoryList[0]?.value);
    setMetalColor(metalColorList[0]?.value);
    setMetalPurity(metalPurityList[0]?.value);
    setSearchVal("");
    handleSearch(eve, "", null, null, metalPurityList[0]?.value, metalColorList[0]?.value, categoryList[0]?.value, statusList[0]?.value, "order");
    setFilterData(data);
    setAllChecked(false);
    scrollToTop();
    setPage(0);
    setRowsPerPage(10);

  }

  const resetAllFilt = () => {
    setOrderProm("order");
    setFromDate(null);
    setToDate(null);
    setStatus(statusList[0]?.value);
    setCategory(categoryList[0]?.value);
    setMetalColor(metalColorList[0]?.value);
    setMetalPurity(metalPurityList[0]?.value);
    setSearchVal("");
  }

  let is_asc = '';
  const handleRequestSort = (property) => {
    if (property?.toLowerCase() === 'sr#') return null
    else {

      let isAsc = ((orderBy === property) && (order === 'asc'));
      if (isAsc) {
        setOrder('desc');
        is_asc = false;
      } else {
        setOrder('asc');
        is_asc = true;
      }

      setOrderBy(property);
      const sortedData = stableSort(data, getComparator(order, property));
      setData(sortedData); // Update the data array with sorted data

      // Update the filterData array with the sorted data
      const sortedFilterData = stableSort(filterData, getComparator(order, property));
      // setPage(0);
      setFilterData(sortedFilterData);

    }

  };

  function getComparator(order, orderBy) {

    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
  };

  function parseCustomDate(dateString) {
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const parts = dateString?.split(' ');
    if (parts?.length !== 3) {
      throw new Error('Invalid date format');
    }
    const day = parseInt(parts[0]);
    const month = months[parts[1].substring(0, 3)]; // Extract the first three characters of the month name
    const year = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Invalid date format');
    }
    return new Date(year, month, day);
  }
  function descendingComparator(a, b, orderBy) {
    if (!orderBy) return 0; // Add null check for orderBy

    if (orderBy === 'Date' || orderBy === 'PDate') {
      try {
        const dateA = parseCustomDate(a[orderBy]);
        const dateB = parseCustomDate(b[orderBy]);

        if (dateB < dateA) {
          return -1;
        }
        if (dateB > dateA) {
          return 1;
        }
        return 0;
      } catch (error) {
        console.error('Error parsing date:', error.message);
        return 0;
      }
    } else if (orderBy === 'FinalAmount' || orderBy === "JobNo") {

      const valueA = parseFloat(a[orderBy]) || 0;
      const valueB = parseFloat(b[orderBy]) || 0;

      if (valueB < valueA) {
        return -1;
      }
      if (valueB > valueA) {
        return 1;
      }

      return 0;

      // }else if ((orderBy === 'PO')  || (orderBy === 'SKUNO') || (orderBy === 'DesignNo' || orderBy?.toLowerCase() === 'lineid')) {
    } else if ((orderBy === 'PO') || (orderBy === 'SKUNO') || (orderBy === 'DesignNo')) {
      // Handle sorting for SKU# column
      return customComparator_Col(a[orderBy], b[orderBy]);

    } else if (orderBy?.toLowerCase() === 'lineid') {
      // Custom sorting for 'lineid' - prioritize numbers first, then strings
      const valueA = a[orderBy]?.toString() || '';
      const valueB = b[orderBy]?.toString() || '';

      const numA = parseFloat(valueA);  // Try to convert to number
      const numB = parseFloat(valueB);

      // Check if both are numbers
      if (!isNaN(numA) && !isNaN(numB)) {
        return is_asc ? numA - numB : numB - numA; // Sort numerically
      }

      // Check if one is a number and the other is a string
      if (!isNaN(numA) && isNaN(numB)) {
        return -1; // Numbers come before strings
      }
      if (isNaN(numA) && !isNaN(numB)) {
        return 1; // Numbers come before strings
      }

      // If both are strings, perform a standard lexicographical sort
      const lowerA = valueA.toLowerCase();
      const lowerB = valueB.toLowerCase();

      if (lowerA < lowerB) {
        return is_asc ? -1 : 1;
      }
      if (lowerA > lowerB) {
        return is_asc ? 1 : -1;
      }
      return 0;

    } else {
      const valueA = a[orderBy]?.toString()?.toLowerCase() || '';
      const valueB = b[orderBy]?.toString()?.toLowerCase() || '';

      if (valueB < valueA) {
        return -1;
      }
      if (valueB > valueA) {
        return 1;
      }
      return 0;
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const storedData = sessionStorage.getItem('loginUserDetail');
      const data = JSON.parse(storedData);
      const customerid = data?.id;

      const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
      const { FrontEnd_RegNo } = storeInit;

      let currencyRate = storeInit?.CurrencyRate;
      const response = await getQuotationJobData(currencyRate, FrontEnd_RegNo, customerid, data);

      setPrintUrl(response?.Data?.rd1[0]?.PrintUrl);

      if (response.Data?.rd) {

        let datass = [];
        let allStatus = [];
        let allCategory = [];
        let allMetalColor = [];
        let allMetalPurity = [];
        response?.Data?.rd?.forEach((e, i) => {
          let obj = { ...e };
          obj["checkbox"] = <Checkbox />;
          obj["Sr#"] = i + 1;
          obj["isJobSelected"] = false;
          datass?.push(obj);
          let findStatus = allStatus?.findIndex((ele, ind) => ele?.label === e?.ProgressStatusName);
          let findCategory = allCategory?.findIndex((ele, ind) => ele?.label === e?.Category);
          let findMetalColor = allMetalColor?.findIndex((ele, ind) => ele?.label === e?.MetalColor);
          let findMetalPurity = allMetalPurity?.findIndex((ele, ind) => ele?.label === e?.MetalType);
          if (findStatus === -1) {
            allStatus?.push({ id: allStatus?.length, label: e?.ProgressStatusName, value: e?.ProgressStatusName, });
          }
          if (findCategory === -1) {
            allCategory?.push({ id: allCategory?.length, label: e?.Category, value: e?.Category, });
          }
          if (findMetalColor === -1) {
            allMetalColor?.push({ id: allMetalColor?.length, label: e?.MetalColor, value: e?.MetalColor, });
          }
          if (findMetalPurity === -1) {
            allMetalPurity?.push({ id: allMetalPurity?.length, label: e?.MetalType, value: e?.MetalType, });
          }
        });
        // allStatus?.unshift({ id: allStatus?.length, label: "ALL", value: "ALL" });
        allCategory?.unshift({ id: allCategory?.length, label: "ALL", value: "ALL" });
        allMetalColor?.unshift({ id: allMetalColor?.length, label: "ALL", value: "ALL" });
        allMetalPurity?.unshift({ id: allMetalPurity?.length, label: "ALL", value: "ALL" });
        let allStatus2 = allStatus?.filter((e) => (e?.label !== '' && e?.value !== ''))
        setStatusList(allStatus2);
        setCategoryList(allCategory);
        setmetalColorList(allMetalColor);
        setMetalPurityList(allMetalPurity);
        setStatus(allStatus[0]?.value);
        setCategory(allCategory[0]?.value);
        setMetalColor(allMetalColor[0]?.value);
        setMetalPurity(allMetalPurity[0]?.value);
        const sortedRows = sortByKeyDescendingJobno(datass, 'JobNo');
        setData(sortedRows);
        setFilterData(sortedRows);
      } else {
        // alert('nodata')
        setData([]);
        setFilterData([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error:', error);
      setIsLoading(false);
      setData([]);
      setFilterData([]);
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


  const handlePrintJobs = async (filterdatas, mainData) => {
    let onlyTrueJobjs = filterdatas?.filter((e) => e?.isJobSelected === true);

    let allAreChecked = [];
    onlyTrueJobjs?.forEach((e) => {
      let obj = { ...e };
      obj.isJobSelected = true;
      allAreChecked.push(obj);
    });


    let jobStringArr = allAreChecked?.map((e) => e?.JobNo)?.toString();

    const storedData = sessionStorage.getItem('loginUserDetail');
    const data = JSON.parse(storedData);
    const customerid = data?.id;

    let fromdate = moment(fromDate)
    let enddate = moment(toDate)
    let daytextf = fromdate?._i?.$d;
    let daytextt = enddate?._i?.$d;

    const startDate = new Date(daytextf);
    const endDate = new Date(daytextt);

    const formattedStartDate = moment(startDate).format('DD MMM YYYY');
    const formattedEndDate = moment(endDate).format('DD MMM YYYY');


    const Farr = [
      {
        Customerid: `${customerid}`,
        DateFill: `${orderProm}`,
        fromdate: `${fromDate === null ? '' : formattedStartDate}`,
        todate: `${toDate === null ? '' : formattedEndDate}`,
        Search: `${searchVal}`,
        Catgeory: `${category?.toLowerCase() === 'all' ? '' : category}`,
        MetalPurity: `${metalPurity?.toLowerCase() === 'all' ? '' : metalPurity}`,
        MetalColor: `${MetalColor?.toLowerCase() === 'all' ? '' : MetalColor}`,
        JobList: `${jobStringArr}`,
        StatusF: `${selectedStatus}`,
        order: `${order === '' ? 'desc' : order}`,
        orderBy: `${orderBy === '' ? 'Date' : orderBy}`,

      }
    ]
    const jsonConvert = btoa((JSON.stringify(Farr)));

    const printMainUrl = `${PrintUrl}&Farr=${jsonConvert}`;

    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', `${PrintUrl}`);
    form.setAttribute('target', '_blank'); // Opens in a new tab

    const dataInput = document.createElement('input');
    dataInput.setAttribute('type', 'hidden');
    dataInput.setAttribute('name', 'Farr');
    dataInput.setAttribute('value', jsonConvert);
    form.appendChild(dataInput);

    document.body.appendChild(form);

    // Submit the form
    form.submit();



  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  // Desktop: fixed 250px width
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // Mobile: auto width (matches the Select width) + disableScrollLock to avoid
  // conflict with the global 'overflow: auto !important' on mobile body.
  const MenuPropsMobile = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
        width: 'auto',
      },
    },
  };

  // Inside handleMasterCheckboxChange function
  const handleMasterCheckboxChange = (event) => {
    const sortedData = stableSort(data, getComparator(order, orderBy));
    setData(sortedData); // Update the data array with sorted data
    const sortedFilterData = stableSort(filterData, getComparator(order, orderBy));

    setFilterData(sortedFilterData);

    const isCheckedd = event.target.getAttribute("data-checked");

    const isChecked = event.target.checked;
    setAllChecked(isChecked);

    // Update the isJobSelected property for all rows in the current page of sortedData array
    const newData = sortedFilterData?.map((row, index) => {
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return {
          ...row,
          isJobSelected: isChecked,
        };
      }
      return row;
    });
    setFilterData(newData);
  };

  // Inside handleCheckboxChange function
  const handleCheckboxChange = (event, rowIndex, row) => {
    if (event) event.stopPropagation();

    const isChecked = !row.isJobSelected;  // Toggle current selection state

    // Update the filterData state to reflect the new selection state
    const updatedData = filterData.map((rowData, index) => {
      if (index === rowIndex) {
        return {
          ...rowData,
          isJobSelected: isChecked, // Toggle isJobSelected for the clicked row
        };
      }
      return rowData;
    });

    // Update the filterData state
    setFilterData(updatedData);
  };


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // const handleImageView = () => setImageView(true);
  // const handleListView = () => setImageView(false);

  return (
    <div className='jobs_Account_smr' onContextMenu={(e) => e.preventDefault()}>
      <Box className='smilingSavedAddressMain quotationFiltersText' sx={{ padding: "20px", }}>
        {!isSmallScreen &&
          <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
            <Box sx={{ display: 'flex', alignItems: "center", flexWrap: "wrap", width: "90%" }}>
              <Button variant="contained" sx={{ marginBottom: "35px", background: "#7d7f85" }} className='muiSmilingRocksBtn QuotationJobAllBtn' onClick={eve => resetAllFilters(eve)} >All</Button>
              <Box sx={{ padding: "0 20px" }}>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={orderProm}

                  onChange={handleOrderProms}
                  sx={{ display: "flex", alignItems: "center", flexDirection: "unset" }}
                >
                  <FormControlLabel value="order" className='orderFrom QuotationJobAllBtnSecDate' control={<Radio />} label="Order Date" sx={{ padding: "0 20px 35px 0", marginRight: "0" }} />
                  <FormControlLabel value="prom" className='orderFrom QuotationJobAllBtnSecDate' control={<Radio />} label="Promise Date" sx={{ padding: "0 10px 35px 0", marginRight: "0" }} />
                </RadioGroup>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", width: "fit-content" }}>
                <Box sx={{ display: "flex", alignItems: "center", paddingRight: "15px", paddingBottom: "35px" }} className="QuotationJobAllBtnSec">

                  <Box>
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
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "35px", paddingRight: "15px" }} className="QuotationJobAllBtnSec">

                  <Box>
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
                </Box>
              </Box>
              <Box sx={{ padding: "0 15px 35px 0", }} className="QuotationJobAllBtnSec">
                {/* <Button variant='contained' className='muiSmilingRocksBtn' sx={{ padding: "7px 10px", minWidth: "max-content", background: "#7d7f85" }} onClick={(eve) => handleSearch(eve, searchVal, fromDate, toDate, metalPurity, MetalColor, category, statuse, orderProm)}><SearchIcon sx={{ color: "#fff !important" }} /></Button> */}
                <Button variant='contained' className='muiSmilingRocksBtn' sx={{ padding: "7px 10px", minWidth: "max-content", background: "#7d7f85" }} onClick={(eve) => handleSearch(eve, searchVal, fromDate, toDate, metalPurity, MetalColor, category, selectedStatus, orderProm)}><SearchIcon sx={{ color: "#fff !important" }} /></Button>
              </Box>
              <Box sx={{ position: "relative", padding: "0 15px 40px 0", display: "flex", flexWrap: "wrap", alignitems: "center", justifyContent: "center" }} className="QuotationJobAllBtnSec" >
                <label className='lh-1 selectLabel' style={{ marginTop: "-3px", position: "absolute", left: 0, top: "-8px", }}>Status</label>

                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedStatus} // Assuming selectedStatus is an array of selected values
                  onChange={handleStatus} // Assuming handleStatus function receives selected values
                  MenuProps={MenuProps}
                  input={<OutlinedInput />}
                  style={{ minHeight: '2.9375em' }}
                  className='statusSelect'
                  size='small'
                  label='ALL'
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em style={{ color: 'black' }}>Placeholder</em>;
                    }

                    return '';
                  }}
                  inputProps={{
                    placeholder: 'Placeholder', // Set placeholder directly on the inputProps
                  }}

                >

                  {statusList?.map((status) => (
                    <MenuItem key={status.id} value={status.value}>
                      <Checkbox checked={selectedStatus?.indexOf(status.value) > -1} />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>

              </Box>
              <Box sx={{ position: "relative", padding: "0 15px 35px 0", display: "flex", flexWrap: "wrap", alignitems: "center", justifyContent: "center" }} className="QuotationJobAllBtnSec" >
                <label className='lh-1 selectLabel' style={{ marginTop: "-3px", position: "absolute", left: 0, top: "-16px", }}>Category</label>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" className='categoryList' value={category} label="Status" onChange={handleCategory} >
                  {
                    categoryList?.map((e, i) => {
                      return <MenuItem value={e?.value} key={i}>{e?.label}</MenuItem>
                    })
                  }
                </Select>
              </Box>
              <Box sx={{ position: "relative", padding: "0 15px 35px 0", display: "flex", flexWrap: "wrap", alignitems: "center", justifyContent: "center" }} className="QuotationJobAllBtnSec" >
                <label className='lh-1 selectLabel' style={{ marginTop: "-3px", position: "absolute", left: 0, top: "-16px", }}>Metal Color</label>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={MetalColor}
                  label="Status"
                  className='MetalColorList'
                  onChange={handleMetalColor}
                >
                  {
                    metalColorList?.map((e, i) => {
                      return <MenuItem value={e?.value} key={i}>{e?.label}</MenuItem>
                    })
                  }
                </Select>
              </Box>
              <Box sx={{ position: "relative", padding: "0 15px 35px 0", display: "flex", flexWrap: "wrap", alignitems: "center", justifyContent: "center" }} className="QuotationJobAllBtnSec" >
                <label className='lh-1 selectLabel' style={{ marginTop: "-3px", position: "absolute", left: 0, top: "-16px", }}>Metal Purity</label>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={metalPurity}
                  label="Status"
                  className='MetalPurityList'
                  onChange={handleMetalPurity}
                >
                  {
                    metalPurityList?.map((e, i) => {
                      return <MenuItem value={e?.value} key={i}>{e?.label}</MenuItem>
                    })
                  }
                </Select>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", position: "relative", padding: "0 15px 35px 0", maxWidth: "max-content" }} className="searchbox QuotationJobAllBtnSec">
                <TextField id="standard-basic" label="Search" variant="outlined" value={searchVal} onChange={eve => {
                  setSearchVal(eve?.target?.value);
                  setPage(0);
                  // handleSearch(eve, eve?.target?.value, fromDate, toDate, metalPurity, MetalColor, category, statuse, orderProm);
                  handleSearch(eve, eve?.target?.value, fromDate, toDate, metalPurity, MetalColor, category, selectedStatus, orderProm);
                }} />
                <Button sx={{ padding: 0, maxWidth: "max-content", minWidth: "max-content", position: "absolute", right: "20px", color: "#757575" }}
                  // onClick={eve => handleSearch(eve, searchVal, fromDate, toDate, metalPurity, MetalColor, category, statuse, orderProm)}><SearchIcon /></Button>
                  onClick={eve => handleSearch(eve, searchVal, fromDate, toDate, metalPurity, MetalColor, category, selectedStatus, orderProm)}><SearchIcon /></Button>
              </Box>
              <Box sx={{ padding: "0 0px 40px 0", }} className="QuotationJobAllBtnSec">
                <Button variant='contained' className='muiSmilingRocksBtn' sx={{ padding: "7px 10px", minWidth: "max-content", background: "#7d7f85" }} onClick={(eve) => handlePrintJobs(filterData, data)}><PrintIcon sx={{ color: "#fff !important" }} /></Button>
              </Box>
              {/* new show all print options btn */}
              {view === "list" &&
                <Box sx={{ padding: "0 0px 40px 0" }} className="QuotationJobAllBtnSec">
                  <FormControlLabel
                    sx={{ border: "1px solid #7d7f85", padding: '0px 15px', borderRadius: '5px' }}
                    labelPlacement='start'
                    control={<Checkbox checked={allChecked}
                      onChange={handleMasterCheckboxChange} />} label="Select All" />
                  {/* <Checkbox
                        checked={allChecked}
                        onChange={handleMasterCheckboxChange}
                      >
              <SelectAllIcon sx={{ color: "#fff !important" }} />&nbsp;Print All
            </Checkbox> */}
                </Box>
              }
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '0',
                  // border: '1px solid #ccc !important',
                  marginBottom: '40px',
                  marginLeft: '20px',
                  width: 'fit-content',
                }}
                className="QuotationJobAllBtnSec"
              >
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleImageShow}
                  aria-label="view toggle"
                  size="large"
                  sx={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    border: '1px solid #ddd',
                  }}
                >
                  <ToggleButton
                    value="list"
                    aria-label="list view"
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: view === 'list' ? '#7d7f85' : '#fff', // selected bg
                      color: view === 'list' ? '#fff !important' : 'inherit',           // selected color
                      '&:hover': {
                        backgroundColor: view === 'list' ? '#7d7f85' : '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#7d7f85',
                        color: '#fff !important',
                        '&:hover': {
                          backgroundColor: '#7d7f85', // on hover while selected
                        },
                      },
                    }}
                  >
                    <ListIcon sx={{ color: view === 'list' ? "#fff !important" : "inherit" }} />
                  </ToggleButton>
                  <ToggleButton
                    value="grid"
                    aria-label="grid view"
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: view === 'grid' ? '#7d7f85' : '#fff',
                      color: view === 'grid' ? '#fff !important' : 'inherit',
                      '&:hover': {
                        backgroundColor: view === 'grid' ? '#7d7f85' : '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#7d7f85',
                        color: '#fff !important',
                        '&:hover': {
                          backgroundColor: '#7d7f85',
                        },
                      },
                    }}
                  >
                    <CollectionsIcon sx={{ color: view === 'grid' ? "#fff !important" : "inherit" }} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

            </Box>
            <Box sx={{ width: "135px", height: "135px", paddingBottom: "20px", overflow: "hidden" }} >
              <Box sx={{ border: view === 'list' && "1px solid #d6d6d6", height: "117px" }} >
                {(hoverImg !== "") && (
                  <img src={hoverImg}
                    draggable={true}
                    onContextMenu={(e) => e.preventDefault()}
                    alt="quotationJob" style={{ width: "100%", objectFit: "contain", minHeight: "114px", maxHeight: "114px", }} />
                )}
              </Box>
            </Box>
          </Box>
        }
        {isSmallScreen && <>
          <Accordion style={{ padding: '2px', paddingBottom: '10px', marginBottom: '40px', marginTop: '20px', boxShadow: 'none', border: '1px solid #e1e1e1' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
              <Typography sx={{ fontWeight: 'bold' }}>More Filters</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '15px 10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <Button variant="contained" sx={{ background: "#7d7f85", padding: '6px 20px' }} className='muiSmilingRocksBtn' onClick={eve => resetAllFilters(eve)} >All</Button>
                  <Button variant='contained' size='small' className='muiSmilingRocksBtn' sx={{ padding: "7px 10px", minWidth: "max-content", background: "#7d7f85" }} onClick={(eve) => handlePrintJobs(filterData, data)}><PrintIcon sx={{ color: "#fff !important" }} /></Button>
                  <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleImageShow}
                    aria-label="view toggle"
                    size="small"
                  >
                    <ToggleButton value="list">
                      <ListIcon sx={{ color: view === 'list' ? "#fff !important" : "inherit" }} />
                    </ToggleButton>
                    <ToggleButton value="grid">
                      <CollectionsIcon sx={{ color: view === 'grid' ? "#fff !important" : "inherit" }} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Date Type</Typography>
                  <RadioGroup
                    value={orderProm}
                    onChange={handleOrderProms}
                    sx={{ flexDirection: "row", gap: '20px' }}
                  >
                    <FormControlLabel value="order" control={<Radio />} label="Order Date" />
                    <FormControlLabel value="prom" control={<Radio />} label="Promise Date" />
                  </RadioGroup>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date From"
                      value={fromDate}
                      ref={fromDateRef}
                      format="DD MM YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          inputProps: { style: { fontSize: '16px' } },
                        },
                      }}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date To"
                      value={toDate}
                      ref={toDateRef}
                      format="DD MM YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          inputProps: { style: { fontSize: '16px' } },
                        },
                      }}
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
                  <Button variant='contained' className='muiSmilingRocksBtn' sx={{ padding: "10px", width: "100%", background: "#7d7f85" }} onClick={(eve) => handleSearch(eve, searchVal, fromDate, toDate, metalPurity, MetalColor, category, selectedStatus, orderProm)}>
                    <SearchIcon sx={{ color: "#fff !important", marginRight: '5px' }} /> Search
                  </Button>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Status</Typography>
                  <Select
                    multiple
                    value={selectedStatus}
                    onChange={handleStatus}
                    MenuProps={MenuPropsMobile}
                    input={<OutlinedInput />}
                    fullWidth
                    renderValue={(selected) => selected.length === 0 ? <em>All Status</em> : selected.join(', ')}
                    displayEmpty
                    inputProps={{ style: { fontSize: '16px' } }}
                    SelectDisplayProps={{ style: { fontSize: '16px' } }}
                  >
                    {statusList?.map((status) => (
                      <MenuItem key={status.id} value={status.value}>
                        <Checkbox checked={selectedStatus?.indexOf(status.value) > -1} />
                        <ListItemText primary={status.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Category</Typography>
                  <Select fullWidth value={category} onChange={handleCategory}
                    MenuProps={MenuPropsMobile}
                    inputProps={{ style: { fontSize: '16px' } }}
                    SelectDisplayProps={{ style: { fontSize: '16px' } }}
                  >
                    {categoryList?.map((e, i) => (
                      <MenuItem value={e?.value} key={i}>{e?.label}</MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Metal Color</Typography>
                  <Select fullWidth value={MetalColor} onChange={handleMetalColor}
                    MenuProps={MenuPropsMobile}
                    inputProps={{ style: { fontSize: '16px' } }}
                    SelectDisplayProps={{ style: { fontSize: '16px' } }}
                  >
                    {metalColorList?.map((e, i) => (
                      <MenuItem value={e?.value} key={i}>{e?.label}</MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 'bold', marginBottom: '5px' }}>Metal Purity</Typography>
                  <Select fullWidth value={metalPurity} onChange={handleMetalPurity}
                    MenuProps={MenuPropsMobile}
                    inputProps={{ style: { fontSize: '16px' } }}
                    SelectDisplayProps={{ style: { fontSize: '16px' } }}
                  >
                    {metalPurityList?.map((e, i) => (
                      <MenuItem value={e?.value} key={i}>{e?.label}</MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box sx={{ position: "relative", width: '100%' }}>
                  <TextField label="Search" variant="outlined" value={searchVal} fullWidth
                    inputProps={{ style: { fontSize: '16px' } }}
                    onChange={eve => {
                      setSearchVal(eve?.target?.value);
                      setPage(0);
                      handleSearch(eve, eve?.target?.value, fromDate, toDate, metalPurity, MetalColor, category, selectedStatus, orderProm);
                    }} />
                  <Button sx={{ padding: 0, maxWidth: "max-content", minWidth: "max-content", position: "absolute", right: "12px", top: '50%', transform: 'translateY(-50%)', color: "#757575" }}
                    onClick={eve => handleSearch(eve, searchVal, fromDate, toDate, metalPurity, MetalColor, category, selectedStatus, orderProm)}><SearchIcon /></Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
        }

        <Box sx={{ padding: "0 0 35px 0", marginTop: "-15px" }}>
          {isLoading ?
            <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "10px" }}><CircularProgress className='loadingBarManage' /></Box> :
            <>
              {
                <>
                  <Paper sx={{
                    width: '100%', overflow: 'hidden', paddingInline: {
                      xs: 0,       // <= 600px
                      sm: '12px',  // > 600px
                    },
                  }} className='QuoteJobtable'>
                    {view === 'list' ? (
                      <>
                        <TableContainer
                          className="quotationJobSec"
                          sx={{
                            maxHeight: 810,
                            overflowY: "auto", // ✅ needed for scrollTop to work
                            scrollbarColor: "transparent transparent",
                            "&::-webkit-scrollbar": {
                              display: "none",
                            },
                          }}
                        >
                          <Table stickyHeader aria-label="sticky table" className='quotaionFiltertable'>
                            <TableHead className='user-select-none'>
                              <TableRow style={{ zIndex: 1 }}>
                                {/* for hiding the checkboxes */}
                                {/* <TableCell style={{backgroundColor: "#ebebeb", color: "#6f6f6f"}}>
                      <Checkbox
                        checked={allChecked}
                        onChange={handleMasterCheckboxChange}
                      />
                    </TableCell>   */}
                                {columns?.slice(1)?.map((column) => {
                                  const ExcludeThisField = ['Total Qty', 'Supplied'];
                                  const isExcluded = ExcludeThisField?.includes(column?.label);
                                  if (isExcluded) {
                                    return null;
                                  }

                                  if (column?.id == 'checkbox') {
                                    return null;
                                  }

                                  return <TableCell
                                    key={column?.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, backgroundColor: "#ebebeb", color: "#6f6f6f" }}
                                    onClick={() => handleRequestSort((column?.id))}
                                  >
                                    {column.label === 'PO' ? 'LineId' : column.label}
                                    {/* {column.label} */}
                                    {orderBy === column.id ? (
                                      <span style={{ display: 'flex', alignItems: 'right' }} className='sorticon_ma_span_SMR'>
                                        {orderBy === column?.id && (<CustomSortIcon order={order} />)}
                                      </span>
                                    ) : null}
                                  </TableCell>
                                })}
                              </TableRow>
                            </TableHead>
                            <TableBody >
                              {filterData?.length > 0 ? stableSort(filterData, getComparator(order, orderBy === 'PO' ? 'lineid' : orderBy))
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row, rowIndex) => {
                                  let serialNumber = page * rowsPerPage + rowIndex + 1;
                                  return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}
                                      onClick={(event) => handleCheckboxChange(event, rowIndex, row)}
                                      sx={{
                                        bgcolor: row.isJobSelected ? "rgba(0, 0, 0, 0.1)" : "transparent", // Subtle gray on selection
                                      }}
                                      onMouseOver={(e) => setHoverImg(row?.imgsrc)}
                                      onMouseOut={() => setHoverImg("")}
                                    >
                                      {columns.map((column, index) => {
                                        // const value = row[column?.id];
                                        const ExcludeThisField = ['Total Qty', 'Supplied'];
                                        const isExcluded = ExcludeThisField?.includes(column?.label);
                                        if (isExcluded) {
                                          return null;
                                        }
                                        if (column?.id == 'checkbox') {
                                          return null;
                                        }

                                        const value = column?.id === 'PO' ? row?.lineid : row[column?.id];
                                        return (
                                          <TableCell key={column?.id} align={column?.align} >
                                            {column.id === 'Sr#' ? serialNumber :
                                              column?.id === 'checkbox' ?
                                                <Checkbox checked={row?.isJobSelected} onChange={(event) => handleCheckboxChange(event, rowIndex, row)} />
                                                :
                                                column?.format && typeof value === 'number'
                                                  ? column.format(value)
                                                  : column?.id === 'FinalAmount' ? <>  <span dangerouslySetInnerHTML={{ __html: row?.Currencycode }}></span> {formatAmount(value)}</> : value}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                }) : <TableCell colSpan={12} align='center' style={{ color: 'grey', fontWeight: 'bold' }}>Data Not Present</TableCell>}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[10, 25, 100]}
                          component="div"
                          count={filterData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : (
                      <>
                        {filterData?.length > 0 ? <Box sx={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", }} className="designWiseSalesProducts">
                          {paginatedData?.map((products, i) => {
                            return (
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
                                        alt="quotationJob"
                                        onContextMenu={(e) => e.preventDefault()}
                                        src={products?.imgsrc} onError={(e) => e.target.src = imageNotFound} style={{ objectFit: "contain", width: "100%", minheight: "271px", maxHeight: "271px" }} />
                                    ) : (
                                      <Skeleton variant="rectangular" width={"100%"} style={{ marginBottom: '76px', height: '310px' }} />
                                    )}
                                  </Box>
                                </Box>
                                <Box sx={{ padding: "10px 5px" }}>
                                  <Box sx={{ padding: "2px 5px", display: "flex", justifyContent: "space-between" }}>
                                    <Typography style={{ fontSize: "12px", textTransform: "uppercase", cursor: "pointer", fontWeight: "bold", textAlign: "start" }} >
                                      {products?.DesignNo}
                                    </Typography>
                                    <Typography style={{ fontSize: "12px", textTransform: "uppercase", cursor: "pointer", fontWeight: "bold", textAlign: "start" }} >
                                      {products?.Currencycode} {formatter(products?.FinalAmount)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ padding: "2px 5px", display: "flex", justifyContent: "space-between" }}>
                                    <Typography style={{ fontSize: "12px", textTransform: "uppercase", cursor: "pointer", textAlign: "start" }} >
                                      {products?.JobNo}
                                    </Typography>
                                    <Typography style={{ fontSize: "12px", textTransform: "uppercase", cursor: "pointer", textAlign: "start" }} >
                                      {products?.Date}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ padding: "2px 5px", display: "flex", justifyContent: "space-between" }}>
                                    <Typography style={{ fontSize: "11px", textAlign: "start", }}>
                                      {products?.lineid}
                                    </Typography>
                                    <Typography style={{ fontSize: "11px", textAlign: "start", }}>
                                      {products?.ProgressStatusName}
                                    </Typography>
                                  </Box>
                                </Box>

                              </div>
                            )
                          })}
                        </Box> : <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'grey', fontWeight: 'bold', marginTop: '3%' }}>Data Not Present</div>}

                        {/* {filterData?.length !== 0 && <ReactPaginate
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
                          className='reactPagination'
                        />} */}
                        {filterData?.length !== 0 && (
                          <Pagination
                            count={Math.ceil(filterData.length / perPage)}
                            page={currPage}
                            onChange={(event, value) => handlePageClick(value)}
                            variant="outlined"
                            shape="rounded"
                            color="primary"
                            size="medium"
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              mt: 3,
                              mb: 3,
                              '& .MuiPagination-ul': {
                                gap: '6px',
                                '@media (max-width: 400px)': {
                                  gap: '2px',
                                },
                              },
                              '& .MuiPaginationItem-root': {
                                borderRadius: '50%',
                                minWidth: 38,
                                height: 38,
                                fontSize: '16px !important',
                                fontWeight: 500,
                                border: '1px solid #ccc',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: '#f2f2f2',
                                },
                                '&.Mui-selected': {
                                  backgroundColor: '#929199',
                                  color: '#fff',
                                  borderColor: '#929199',
                                  '&:hover': {
                                    backgroundColor: '#fff',
                                    color: '#000',
                                  },
                                },
                                '@media (max-width: 400px)': {
                                  minWidth: 30,
                                  height: 30,
                                  fontSize: '12px !important',
                                },
                              },
                            }}
                          />
                        )}
                      </>
                    )}

                  </Paper>
                </>}
            </>
          }
        </Box>


      </Box >
    </div >
  )
}

export default QuotationJob
