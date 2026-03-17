import React from 'react'
import "./accountledger.scss"
import { useState } from 'react';
import { useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, CircularProgress } from '@mui/material';
import { checkMonth, formatAmount, sortByDate } from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { getAccountLedgerData } from '@/app/(core)/utils/API/AccountTabs/accountLedger';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import AccountLedgerExcel from './AccountLedgerExcel';
import { downloadExcelLedgerData } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import excelExport from "@/app/(core)/utils/assets/Image/excel.png";
import { loginUserDetailWiseAccountLedgerData } from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountLedger';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const AccountLedger2 = () => {

    const [resultArray, setResultArray] = useState([]);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [currencyCode, setCurrencyCode] = useState('');
    const [currencyRate, setCurrencyRate] = useState(1);
    const [filterArray, setFilterArray] = useState([]);
    const [loaderAC, setLoaderAC] = useState(false);
    const [userName, setUserName] = useState('');
    const [selectedDays, setSelectedDays] = useState(null);
    const [resultTotal, setResultTotal] = useState(null);

    const [debit_dia_diff, setDebit_dia_diff] = useState(0);
    const [debit_mg_diff, setDebit_mg_diff] = useState(0);
    const [debit_amt_diff, setDebit_amt_diff] = useState(0);
    const [debit_curr_diff, setDebit_curr_diff] = useState(0);
    const [credit_dia_diff, setCredit_dia_diff] = useState(0);
    const [credit_mg_diff, setCredit_mg_diff] = useState(0);
    const [credit_amt_diff, setCredit_amt_diff] = useState(0);
    const [credit_curr_diff, setCredit_curr_diff] = useState(0);

    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [showStartDate, setShowStartDate] = useState();
    const [showEndDate, setShowEndDate] = useState();
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);


    useEffect(() => {


        const userName = JSON.parse(sessionStorage.getItem('loginUserDetail'));
        setUserName(userName?.customercode)

        getLedgerData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLedgerData = async () => {
        setLoaderAC(true)

        let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        const UserEmail = sessionStorage.getItem("userEmail");
        try {

            const response = await getAccountLedgerData(storeinit, loginInfo, UserEmail);

            // setCurrencySymbol(response?.CurrencySymbol);
            // setCurrencyRate(response?.CurrencyRate);
            setCurrencySymbol(loginInfo?.CurrencyCode);
            setCurrencyRate(loginInfo?.CurrencyRate);
            setCurrencyCode(loginInfo?.CurrencyCode);

            if (response?.response2?.Status === '200') {

                if (response?.response2?.Data?.rd?.length > 0) {

                    const mainData = response?.response2?.Data?.rd;

                    const formatLedgerData = loginUserDetailWiseAccountLedgerData(mainData, '', loginInfo);


                    formatLedgerData?.sort((a, b) => {
                        const dateA = new Date(a?.EntryDate);
                        const dateB = new Date(b?.EntryDate);
                        return dateA - dateB;
                    })
                    setResultArray(formatLedgerData)
                    getFormatedArrayData(formatLedgerData)
                    setFilterArray(formatLedgerData)
                    setLoaderAC(false)
                } else {
                    setResultArray(['Data Not Present'])
                    setFilterArray(['Data Not Present'])
                    setLoaderAC(false)
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getFormatedArrayData = (data) => {

        let credit_debit = {
            credit_metalgold: 0,
            credit_diamondwt: 0,
            credit_totalamount: 0,
            credit_totalcurrency: 0,
            debit_metalgold: 0,
            debit_diamondwt: 0,
            debit_totalamount: 0,
            debit_totalcurrency: 0
        }

        data?.forEach((e) => {
            if (e?.IsDebit === 1) {
                credit_debit.debit_metalgold += e?.metalctw;
                credit_debit.debit_diamondwt += e?.diamondctw;
                credit_debit.debit_totalamount += e?.Amount;
                credit_debit.debit_totalcurrency += e?.Currency;
            } else {
                credit_debit.credit_metalgold += e?.metalctw;
                credit_debit.credit_diamondwt += e?.diamondctw;
                credit_debit.credit_totalamount += e?.Amount;
                credit_debit.credit_totalcurrency += e?.Currency;
            }
        })

        setResultTotal(credit_debit)
    }

    const backToInitial2 = () => {
        const firstDayOfMonth = dayjs().startOf('month');
        const lastDayOfMonth = dayjs().endOf('month');
        setFromDate(null);
        setToDate(null);
        setSelectedDays(null)


        const buttons = document.querySelectorAll('.daybtn');
        buttons.forEach(button => {
            const buttonDays = parseInt(button?.textContent);
            if (buttonDays === null) {
                button.classList.remove('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    const backToInitial3 = () => {
        setSelectedDays(null);
        setFilterArray(resultArray);
        setDebit_amt_diff(0);
        setDebit_dia_diff(0);
        setDebit_mg_diff(0);
        setCredit_amt_diff(0);
        setCredit_dia_diff(0);
        setCredit_mg_diff(0);
        setCredit_curr_diff(0);
        setDebit_curr_diff(0);
        getLedgerData();
        setFromDate(null);
        setToDate(null);

    }

    const handleDays = (days) => {
        setSelectedDays(days)
        let newStartDate = null;
        let newEndDate = null;

        const currentMonthStart = dayjs().startOf('month');
        const currentMonthEnd = dayjs().endOf('month');

        if (days === 30) {
            newStartDate = currentMonthStart;
            newEndDate = currentMonthEnd;
        } else if (days === 60) {
            const prevMonthStart = currentMonthStart.subtract(1, 'month');
            newStartDate = prevMonthStart;
            newEndDate = currentMonthEnd;
        } else if (days === 90) {
            const twoMonthsAgoStart = currentMonthStart.subtract(2, 'month');
            newStartDate = twoMonthsAgoStart;
            newEndDate = currentMonthEnd;
        }



        // Update the start and end dates in the state
        setFromDate(newStartDate);
        setToDate(newEndDate);
        handleSearchBtn('', newStartDate, newEndDate, days)

        const buttons = document.querySelectorAll('.daybtn');
        buttons.forEach(button => {
            const buttonDays = parseInt(button.textContent);
            if (buttonDays === days) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

    }

    const handlePreviousDays = () => {
        // Get the selected number of days
        const days = selectedDays;
        let newStartDate = null;
        let newEndDate = null;
        let fromDateCopy = fromDate; // Create a copy of fromDate to avoid modifying the state directly

        if (days === 30) {
            // Subtract 1 month from the current start date to get the new start date
            newStartDate = fromDate.subtract(1, 'month').startOf('month');
            // Set the end date as the last day of the previous month
            newEndDate = fromDate.subtract(1, 'month').endOf('month');
            fromDateCopy = fromDateCopy.subtract(1, 'month');
        } else if (days === 60) {
            // Subtract 2 months from the current start date to get the new start date
            newStartDate = fromDate.subtract(2, 'month').startOf('month');
            // Set the end date as the last day of the previous month
            newEndDate = fromDate.subtract(1, 'month').endOf('month');
            fromDateCopy = fromDateCopy.subtract(2, 'month');
        } else if (days === 90) {
            // Subtract 3 months from the current start date to get the new start date
            newStartDate = fromDate.subtract(3, 'month').startOf('month');
            // Set the end date as the last day of the previous month
            newEndDate = fromDate.subtract(1, 'month').endOf('month');
            fromDateCopy = fromDateCopy.subtract(3, 'month');
        }

        // Update the state with the new start and end dates
        setFromDate(newStartDate);
        // setShowStartDate(newStartDate);
        setToDate(newEndDate);
        // setShowEndDate(newEndDate)

        // Update the fromDate state
        setFromDate(fromDateCopy);
        handleSearchBtn('', newStartDate, newEndDate, days)

    }

    const handleNextDays = () => {
        const days = selectedDays;
        let newStartDate = null;
        let newEndDate = null;
        let toDateCopy = toDate; // Create a copy of toDate to avoid modifying the state directly

        if (days === 30) {
            newStartDate = fromDate.add(1, 'month').startOf('month');
            newEndDate = fromDate.add(1, 'month').endOf('month');
            toDateCopy = toDateCopy.add(1, 'month').endOf('month'); // Adjust to end of month
        } else if (days === 60) {
            newStartDate = fromDate.add(2, 'month').startOf('month');
            newEndDate = fromDate.add(2, 'month').endOf('month');
            toDateCopy = toDateCopy.add(2, 'month').endOf('month'); // Adjust to end of month
        } else if (days === 90) {
            newStartDate = fromDate.add(3, 'month').startOf('month');
            newEndDate = fromDate.add(3, 'month').endOf('month');
            toDateCopy = toDateCopy.add(3, 'month').endOf('month'); // Adjust to end of month
        }

        setFromDate(newStartDate);
        setToDate(newEndDate);

        setToDate(toDateCopy);
        handleSearchBtn('', newStartDate, newEndDate, days)
    }

    const CalculateOpeningBalance = (data) => {
        let credit_debit = {
            credit_metalgold: 0,
            credit_diamondwt: 0,
            credit_totalamount: 0,
            credit_totalcurrency: 0,
            debit_metalgold: 0,
            debit_diamondwt: 0,
            debit_totalamount: 0,
            debit_totalcurrency: 0
        }

        data?.forEach((e) => {
            if (e?.IsDebit === 1) {
                credit_debit.debit_metalgold += e?.metalctw;
                credit_debit.debit_diamondwt += e?.diamondctw;
                credit_debit.debit_totalamount += e?.Amount;
                credit_debit.debit_totalcurrency += e?.Currency;
            } else {
                credit_debit.credit_metalgold += e?.metalctw;
                credit_debit.credit_diamondwt += e?.diamondctw;
                credit_debit.credit_totalamount += e?.Amount;
                credit_debit.credit_totalcurrency += e?.Currency;
            }
        })


        //metal
        let cre_result_mg = 0;
        if (credit_debit.credit_metalgold - credit_debit.debit_metalgold > 0) {
            cre_result_mg = credit_debit.credit_metalgold - credit_debit.debit_metalgold;
        }
        setCredit_mg_diff(cre_result_mg);
        let deb_result_mg = 0;
        if (credit_debit.credit_metalgold - credit_debit.credit_metalgold < 0) {
            deb_result_mg = credit_debit.credit_metalgold - credit_debit.debit_metalgold;
        }
        setDebit_mg_diff(deb_result_mg);

        //diamond
        let cre_result_dia = 0;
        if (credit_debit.credit_diamondwt - credit_debit.debit_diamondwt > 0) {
            cre_result_dia = credit_debit.credit_diamondwt - credit_debit.debit_diamondwt;
        }
        setCredit_dia_diff(cre_result_dia);
        let deb_result_dia = 0;
        if (credit_debit.credit_diamondwt - credit_debit.debit_diamondwt < 0) {
            deb_result_dia = credit_debit.credit_diamondwt - credit_debit.debit_diamondwt;
        }
        setDebit_dia_diff(deb_result_dia);

        //amount difference
        let cre_result_amt = 0;
        if (credit_debit.credit_totalamount - credit_debit.debit_totalamount > 0) {
            cre_result_amt = credit_debit.credit_totalamount - credit_debit.debit_totalamount;
        }
        setCredit_amt_diff(cre_result_amt);
        let deb_result_amt = 0;
        if (credit_debit.credit_totalamount - credit_debit.debit_totalamount < 0) {
            deb_result_amt = credit_debit.credit_totalamount - credit_debit.debit_totalamount;
        }
        setDebit_amt_diff(deb_result_amt);

        //currency amount difference
        let cre_result_curr_amt = 0;
        if (credit_debit.credit_totalcurrency - credit_debit.debit_totalcurrency > 0) {
            cre_result_curr_amt = credit_debit.credit_totalcurrency - credit_debit.debit_totalcurrency;
        }
        setCredit_curr_diff(cre_result_curr_amt);
        let deb_result_curr_amt = 0;
        if (credit_debit.credit_totalcurrency - credit_debit.debit_totalcurrency < 0) {
            deb_result_curr_amt = credit_debit.credit_totalcurrency - credit_debit.debit_totalcurrency;
        }
        setDebit_curr_diff(deb_result_curr_amt);


    }

    const handleSearchBtn = (eve, fromDatess, todatess, days) => {
        let fromdates = `${fromDatess?.["$y"]}-${checkMonth(fromDatess?.["$M"])}-${fromDatess?.["$D"]}`;
        let todates = `${todatess?.["$y"]}-${checkMonth(todatess?.["$M"])}-${todatess?.["$D"]}`;

        let filteredData = [];
        let count = 0;
        resultArray?.forEach((e, i) => {
            let cutDate = "";
            cutDate = e?.["EntryDate"]?.split("-");
            let compareDate = `${cutDate[0]}-${cutDate[1]}-${cutDate[2]}`
            cutDate = `${cutDate[2]}-${cutDate[1]}-${cutDate[0]}`;
            let flags = {
                dateFrom: false,
                dateTo: false,
            }

            if (cutDate !== undefined) {
                if (!fromdates?.includes(undefined) && !todates?.includes(undefined)) {
                    let fromdat = moment(fromdates);
                    let todat = moment(todates);
                    let cutDat = moment(cutDate);
                    if (moment(fromdates).isSameOrBefore(todates)) {
                        const isBetween = cutDat.isBetween(fromdat, todat, null, '[]');
                        if (isBetween || cutDat.isSame(fromdat) || cutDat.isSame(todat)) {
                            flags.dateTo = true;
                            flags.dateFrom = true;
                        }
                    }
                    else {
                        setTimeout(() => {
                            setSelectedDays(null);
                            setFilterArray(resultArray);
                            setDebit_amt_diff(0);
                            setDebit_dia_diff(0);
                            setDebit_mg_diff(0);
                            setCredit_amt_diff(0);
                            setCredit_dia_diff(0);
                            setCredit_mg_diff(0);
                            setCredit_curr_diff(0);
                            setDebit_curr_diff(0);
                            setFromDate(null);
                            setToDate(null);
                            getLedgerData();
                            const buttons = document.querySelectorAll('.daybtn');
                            buttons.forEach(button => {
                                const buttonDays = parseInt(button.textContent);
                                if (buttonDays === days) {
                                    button.classList.remove('selected');
                                } else {
                                    button.classList.remove('selected');
                                }
                            });
                        }, 0);

                    }

                } else if (fromdates?.includes(undefined) && !todates?.includes(undefined)) {

                    count = count + 1
                    flags.dateFrom = true;
                    Swal.fire({
                        title: "Error !",
                        text: "Enter Valid Date From",
                        icon: "error",
                        confirmButtonText: "ok"
                    });
                    reseltFil();
                } else if (!fromdates?.includes(undefined) && todates?.includes(undefined)) {

                    count = count + 1
                    flags.dateTo = true;
                    Swal.fire({
                        title: "Error !",
                        text: "Enter Valid Date To",
                        icon: "error",
                        confirmButtonText: "ok"
                    });
                    reseltFil();

                } else if (fromdates?.includes(undefined) && todates?.includes(undefined)) {
                    flags.dateTo = true;
                    flags.dateFrom = true;
                }
            }

            if (flags.dateFrom === true && flags.dateTo === true) {
                filteredData.push(e);
            }

        });
        if (count === 0) {
            setFilterArray(filteredData)

            const oneDayBeforeStartDate = new Date(fromdates);
            oneDayBeforeStartDate.setDate(oneDayBeforeStartDate.getDate() - 1);
            const recordsBeforeStartDate = resultArray.filter(entry => {
                const entryDate = new Date(entry.EntryDate);
                return entryDate <= oneDayBeforeStartDate;
            });
            setFilterArray(filteredData);
            getFormatedArrayData(filteredData);
            CalculateOpeningBalance(recordsBeforeStartDate);
        }
        else {
            setFilterArray(resultArray)

            const oneDayBeforeStartDate = new Date(fromdates);
            oneDayBeforeStartDate.setDate(oneDayBeforeStartDate.getDate() - 1);
            const recordsBeforeStartDate = resultArray.filter(entry => {
                const entryDate = new Date(entry.EntryDate);
                return entryDate <= oneDayBeforeStartDate;
            });
            getFormatedArrayData(filteredData);
            CalculateOpeningBalance(recordsBeforeStartDate);
        }
    }

    const reseltFil = () => {
        setFromDate(null);
        setToDate(null);

    }

    useEffect(() => {

        let fromdate = moment(fromDate)
        let enddate = moment(toDate)
        let daytextf = fromdate?._i?.$d;
        let daytextt = enddate?._i?.$d;

        const startDate = new Date(daytextf);
        const endDate = new Date(daytextt);

        const formattedStartDate = moment(startDate).format('DD MMM YYYY');
        const formattedEndDate = moment(endDate).format('DD MMM YYYY');

        setShowStartDate(formattedStartDate)
        setShowEndDate(formattedEndDate);

    }, [fromDate, toDate])


    return (
        <div className='ledger_Account_RPJ' id='ledger_Account_RPJ'>
            <div>
                <div className='border_Acc'>
                    {moment(showStartDate).format('DD MMM YYYY') !== 'Invalid date' && <div className='p_2_acc ps_4_acc border_bottom_acc fs_Al_mq' style={{ letterSpacing: '1px' }}>
                        Account Detail for &nbsp; <b className='fs_Al_mq'>{userName}</b>
                        &nbsp; Period of &nbsp;<b className='fs_Al_mq'>{moment(showStartDate).format('DD MMM YYYY') === 'Invalid date' ? '' : moment(showStartDate).format('DD MMM YYYY')}</b>&nbsp; to
                        &nbsp;<b className='fs_Al_mq'>{moment(showEndDate).format('DD MMM YYYY') === 'Invalid date' ? '' : moment(showEndDate).format('DD MMM YYYY')}</b>&nbsp;
                    </div>}


                    {
                        (filterArray?.length === 1 && filterArray[0] === 'Data Not Present') ? '' : <div className='flex_col_Al' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            {
                                <div className='fs_al2' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0px', width: '100%', padding: '8px' }}>
                                    <div className='mb_acc'>
                                        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }} className="">
                                            <Box sx={{ display: "flex", alignItems: "center", paddingRight: "15px", paddingBottom: "35px" }} className="QuotePadSec date_margin_acc">
                                                <p className=' w_30_acc pad_right_Acc' style={{ paddingRight: "8px", fontSize: '14px', marginBottom: '0px', fontFamily: "Spectral-Regular" }}>Date : </p>
                                                <Box className="w_70_acc">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Date From"
                                                            value={fromDate}
                                                            ref={fromDateRef}

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
                                                                        backToInitial2();
                                                                    }

                                                                }
                                                            }}
                                                            format="DD MM YYYY"
                                                            placeholder="DD MM YYYY"
                                                            className='quotationFilterDates w_all_acc'
                                                            name="date"
                                                            id="startdate"
                                                        />
                                                    </LocalizationProvider>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "35px", paddingRight: "15px" }} className="QuotePadSec date_margin_acc">
                                                <p className=' w_30_acc pad_right_Acc' style={{ paddingRight: "8px", fontSize: '14px', marginBottom: '0px', fontFamily: "Spectral-Regular" }}>To : </p>
                                                <Box className="w_70_acc">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Date To"
                                                            value={toDate}
                                                            ref={toDateRef}

                                                            onChange={(newValue) => {
                                                                if (newValue === null) {
                                                                    setToDate(null)
                                                                } else {
                                                                    if (((newValue["$y"] <= 2099 && newValue["$y"] >= 1900) || newValue["$y"] < 1000) || isNaN(newValue["$y"])) {
                                                                        setToDate(newValue)
                                                                        setShowEndDate(newValue)
                                                                    }
                                                                    else {
                                                                        Swal.fire({
                                                                            title: "Error !",
                                                                            text: "Enter Valid Date To",
                                                                            icon: "error",
                                                                            confirmButtonText: "ok"
                                                                        });

                                                                        backToInitial2();
                                                                    }
                                                                }
                                                            }}
                                                            format="DD MM YYYY"
                                                            placeholder="DD MM YYYY"
                                                            className='quotationFilterDates w_all_acc'
                                                            name="date"
                                                            id="enddate"
                                                        />
                                                    </LocalizationProvider>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </div>
                                    <div>

                                        <Box sx={{ paddingBottom: "35px", paddingRight: "15px" }}>

                                            <Button variant='contained' className='muiSmilingRocksBtn' title='search here'
                                                sx={{ padding: "7px 10px", minWidth: "max-content", background: "#7d7f85", }}
                                                onClick={(e) => handleSearchBtn(e, fromDate, toDate, selectedDays)}
                                            >
                                                <SearchIcon sx={{ color: "#fff !important", cursor: 'pointer' }} /></Button>
                                        </Box>
                                    </div>
                                    <Box sx={{ paddingBottom: "35px", paddingRight: "15px" }}>
                                        <Button variant="contained" className="muiSmilingRocksBtn" sx={{ background: "#7d7f85", fontFamily: "Spectral-Regular", display: "flex", alignItems: "center", marginBottom: 0, padding: "6px 0", }}
                                            onClick={() => backToInitial3()}>
                                            All
                                        </Button>
                                    </Box>
                                    <Box sx={{ paddingBottom: "35px", paddingRight: "15px" }} className="pad_r_acc center_acc w_all_acc">

                                        <div className='d_flex_Acc' style={{ paddingTop: '8px' }}>
                                            <button className=' btn_acc border_Acc daybtn'
                                                style={{
                                                    marginLeft: '8px', marginLeft: '0.25rem', marginRight: '0.25rem', padding: '8px',
                                                    paddingTop: '0px', paddingBottom: '0px', marginBottom: '8px'
                                                }}
                                                title='previous' onClick={() => handlePreviousDays()}>&lt;</button>
                                            {[30, 60, 90]?.map((days) => (
                                                <button key={days}
                                                    className={`mx_1_acc btn_acc  p_2_acc py_0_acc daybtn mb_2_acc btnHover`}
                                                    title={`${days} days`}
                                                    style={{ border: `1px solid ${selectedDays === days ? '#989898' : '#e8e8e8'}` }}
                                                    onClick={() => handleDays(days)}>{days}</button>
                                            ))}
                                            <button className='ms_2_Acc mx_1_acc btn_acc border_Acc p_2_acc py_0_acc daybtn me_3 mb_2_acc' title='next'
                                                onClick={() => handleNextDays()}
                                            >&gt;</button>
                                        </div>
                                    </Box>

                                    <div className='mx_1_acc ms_4_acc mb_2_acc'>
                                    </div>
                                    <div style={{ paddingBottom: '35px' }}>{filterArray?.length > 0 && <img src={excelExport} onClick={() => downloadExcelLedgerData()} style={{ height: '40px', width: '40px', objectFit: 'contain', cursor: 'pointer' }} alt='#excelExport' title='Download Excel' />}</div>
                                </div>
                            }
                        </div>
                    }

                    <div className='text_secondary_acc fs_al d_flex_Acc justify_content_between align_items_start p_2_acc my_3_acc mt_0_acc balance_none'>
                        <div className='custom_flex_class'>
                            <div className='custom_px_4 px_2_al d_flex_Acc align_items_center mb_2_acc ps-0 w_all_acc'>
                                <span className='w_40_acc' style={{ fontFamily: "Spectral-Regular" }}>Balance Gold :&nbsp;</span>
                                <span className='bal_Amt_ac  w_60_acc end_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                    {((((resultTotal?.debit_metalgold + Math.abs(debit_mg_diff)) -
                                        (resultTotal?.credit_metalgold + Math.abs(credit_mg_diff)))?.toFixed(3)) === 'NaN' ? '0.00' :
                                        (((resultTotal?.debit_metalgold + Math.abs(debit_mg_diff)) - (resultTotal?.credit_metalgold + Math.abs(credit_mg_diff)))?.toFixed(3)))
                                    }
                                    {((resultTotal?.debit_metalgold + Math.abs(debit_mg_diff)) - (resultTotal?.credit_metalgold + Math.abs(credit_mg_diff))) > 0 ? 'Dr' : ' Cr'}
                                </span>
                            </div>
                            <div className='custom_px_4 px_2_al d_flex_Acc align_items_center mb_2_acc w_all_acc'>
                                <span className='w_40_acc' style={{ fontFamily: "Spectral-Regular" }}>Balance Diam. :&nbsp;</span>
                                <span className='bal_Amt_ac w_60_acc end_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                    {((((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt) - (Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3)) === 'NaN' ? '0.00'
                                        : (((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt) - (Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3)))}
                                    {((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt) - (Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt)) > 0 ? ' Dr' : ' Cr'}
                                </span>
                            </div>
                            <div className='custom_px_4 px_2_al d_flex_Acc align_items_center mb_2_acc w_all_acc'>
                                <span className='w_40_acc' style={{ fontFamily: "Spectral-Regular" }}>Balance Amount :&nbsp;</span>
                                <span className='bal_Amt_ac w_60_acc end_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                    <span dangerouslySetInnerHTML={{ __html: currencySymbol }}></span>&nbsp;
                                    {((formatAmount(
                                        (Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency) - (Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency))
                                    ) === 'NaN' ? '0.00' : (formatAmount(
                                        (Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency) - (Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency))
                                    ))
                                    }&nbsp;

                                    {(((Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency) - (Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency)) ? 'Dr' : ' Cr')}</span></div>
                        </div>
                    </div>
                    <div className='text_secondary_acc fs_al d_flex_Acc justify_content_between align_items_start p_2_acc my_3_acc mt_0_acc balance_not_none'>
                        <div className='custom_flex_class'>
                            <div className='custom_px_4 px_2_al d_flex_Acc flex_column align_items_center mb_2_acc p_1_acc w_100_acc'>
                                <div className='w_100_acc' style={{ fontFamily: "Spectral-Regular" }}>Balance Gold :&nbsp;</div> <div className='bal_Amt_ac  w_100_acc end_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                    {((((resultTotal?.debit_metalgold + Math.abs(debit_mg_diff)) - (resultTotal?.credit_metalgold + Math.abs(credit_mg_diff)))?.toFixed(3)) === 'NaN' ? '0.00' : (((resultTotal?.debit_metalgold + Math.abs(debit_mg_diff)) - (resultTotal?.credit_metalgold + Math.abs(credit_mg_diff)))?.toFixed(3)))}
                                    {((resultTotal?.debit_metalgold + Math.abs(debit_mg_diff)) - (resultTotal?.credit_metalgold + Math.abs(credit_mg_diff))) > 0 ? 'Dr' : ' Cr'}</div>
                            </div>
                            <div className='custom_px_4 px_2_al d_flex_Acc flex_column align_items_center mb_2_acc w_100_acc'>
                                <div className='w_100_acc' style={{ fontFamily: "Spectral-Regular" }}>Balance Diam. :&nbsp;</div>
                                <div className='bal_Amt_ac w_100_acc end_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                    {((((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt) - (Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3)) === 'NaN' ? '0.00' : (((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt) - (Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3)))}
                                    {((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt) - (Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt)) > 0 ? ' Dr' : ' Cr'}
                                </div>
                            </div>
                            <div className='custom_px_4 px_2_al d_flex_Acc flex_column align_items_center mb_2_acc w_100_acc'>
                                <div className='w_100_acc' style={{ fontFamily: "Spectral-Regular" }}>Balance Amount :&nbsp;</div>
                                <div className='bal_Amt_ac w_100_acc end_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                    <span dangerouslySetInnerHTML={{ __html: currencySymbol }}></span>&nbsp;
                                    {((formatAmount(
                                        (Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency) - (Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency))
                                    ) === 'NaN' ? '0.00' : (formatAmount(
                                        (Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency) - (Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency))
                                    ))
                                    }&nbsp;

                                    {(((Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency) - (Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency)) ? ' Dr' : ' Cr')}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        loaderAC ?
                            <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "30px" }}><CircularProgress className='loadingBarManage' /></Box>
                            : <div style={{ margin: '8px', overflow: 'auto' }}>
                                <div>
                                    <AccountLedgerExcel

                                        filterArray={filterArray}

                                        credit_curr_diff={credit_curr_diff}
                                        credit_amt_diff={credit_amt_diff}
                                        credit_mg_diff={credit_mg_diff}
                                        credit_dia_diff={credit_dia_diff}

                                        debit_curr_diff={debit_curr_diff}
                                        debit_amt_diff={debit_amt_diff}
                                        debit_mg_diff={debit_mg_diff}
                                        debit_dia_diff={debit_dia_diff}

                                        resultTotal={resultTotal}

                                        currencySymbol={currencySymbol}
                                        currencyRate={currencyRate}

                                    />
                                </div>
                                <table className='w_100_acc'>
                                    <thead className='w_100_acc border_Acc'>
                                        <tr className='w_100_acc border_bottom_acc fs_td' style={{ width: '100%', fontFamily: "Spectral-Regular" }}>
                                            <td className='fw_bold_acc text_center_acc border_end_acc' colSpan={7} >DEBIT</td>
                                            <td className='fw_bold_acc text_center_acc' colSpan={11}>CREDIT</td>
                                        </tr>
                                        <tr className='w_100_acc border_bottom_acc fw_bold_acc fs_td' style={{ fontFamily: "Spectral-Regular" }}>
                                            <td className='border_end_acc p_1_acc text_center_acc '>DATE</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>PARTICULAR</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>VOUCHER</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>METAL</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>DIAM.</td>

                                            <td className='border_end_acc p_1_acc text_center_acc '>CURRENCY</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>VERIFIED</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>DATE</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>PARTICULAR</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>VOUCHER</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>METAL</td>
                                            <td className='border_end_acc p_1_acc text_center_acc '>DIAM.</td>

                                            <td className='border_end_acc p_1_acc text_center_acc '>CURRENCY</td>
                                            <td className='p_1_acc text_center_acc'>VERIFIED</td>
                                        </tr>
                                    </thead>
                                    <tbody className='fs_td'>
                                        {
                                            ((Math.abs(debit_amt_diff) === 0) &&
                                                (Math.abs(debit_curr_diff) === 0) &&
                                                (Math.abs(debit_dia_diff) === 0) &&
                                                (Math.abs(debit_mg_diff) === 0) &&
                                                (Math.abs(credit_amt_diff) === 0) &&
                                                (Math.abs(credit_curr_diff) === 0) &&
                                                (Math.abs(credit_mg_diff) === 0) &&
                                                (Math.abs(credit_dia_diff) === 0)) ? '' : <tr className='border_Acc fw_bold_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                                <td className='border_end_acc p_1_acc text_center_acc'></td>
                                                <td className='border_end_acc p_1_acc  ps_1_acc' align='center'>Opening</td>
                                                <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'></td>
                                                <td className='border_end_acc p_1_acc text_end_acc ps_1_acc'>{(Math.abs(debit_mg_diff))?.toFixed(3) === '0.000 ' ? '' : (Math.abs(debit_mg_diff))?.toFixed(3)}</td>
                                                <td className='border_end_acc p_1_acc text_end_acc ps_1_acc'>{(Math.abs(debit_dia_diff))?.toFixed(3) === '0.000 ' ? '' : (Math.abs(debit_dia_diff))?.toFixed(3)}</td>

                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc' style={{ minWidth: '100px' }} >{Math.abs(debit_curr_diff) === 0.00 ? '' : <><span dangerouslySetInnerHTML={{ __html: currencyCode }}></span>&nbsp;{formatAmount(Math.abs(debit_curr_diff))}</>}</td>
                                                <td className='border_end_acc p_1_acc text_center_acc'></td>
                                                <td className='border_end_acc p_1_acc text_center_acc'></td>
                                                <td className='border_end_acc p_1_acc text_start_acc ps_1_acc' align='center'>Opening</td>
                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'></td>
                                                <td className='border_end_acc p_1_acc text_end_acc ps_1_acc'>{(Math.abs(credit_mg_diff))?.toFixed(3) === '0.000 ' ? '' : (Math.abs(credit_mg_diff))?.toFixed(3)}</td>
                                                <td className='border_end_acc p_1_acc text_end_acc ps_1_acc'>{(Math.abs(credit_dia_diff))?.toFixed(3) === '0.000 ' ? '' : (Math.abs(credit_dia_diff))?.toFixed(3)}</td>

                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc' style={{ minWidth: '100px' }}>{Math.abs(credit_curr_diff) === 0.00 ? '' : <><span dangerouslySetInnerHTML={{ __html: currencyCode }}></span>&nbsp;{formatAmount(Math.abs(credit_curr_diff))}</>}</td>
                                                <td className=' p_1_acc text_center_acc'></td>
                                            </tr>
                                        }
                                        {
                                            filterArray?.length > 0 ? filterArray?.map((e) => {

                                                //     let doneIcon = null;
                                                //     let closeIcon = null;

                                                // if (e.IsVerified === 0) {
                                                //     doneIcon = <DoneIcon sx={{ color: 'green' }} />;
                                                // } else if (e.IsVerified === 1) {
                                                //     closeIcon = <CloseIcon sx={{ color: 'red' }} />;
                                                // }
                                                let icon = null;
                                                // let closeIcon = null;
                                                // let d_doneIcon = null;
                                                // let d_closeIcon = null;

                                                if (e?.IsDebit === 1 && e.IsDVerified === 0) {
                                                    icon = '';
                                                } else if (e?.IsDebit === 1 && e.IsDVerified === 1) {
                                                    icon = <DoneIcon sx={{ color: 'green' }} />;
                                                } else if (e?.IsDebit === 1 && e.IsDVerified === 2) {
                                                    icon = <CloseIcon sx={{ color: 'red' }} />;
                                                }
                                                if (e?.IsDebit === 0 && e.IsDVerified === 0) {
                                                    icon = '';
                                                } else if (e?.IsDebit === 0 && e.IsDVerified === 1) {
                                                    icon = <DoneIcon sx={{ color: 'green' }} />;
                                                } else if (e?.IsDebit === 0 && e.IsDVerified === 2) {
                                                    icon = <CloseIcon sx={{ color: 'red' }} />;
                                                }
                                                //     let doneIcon = null;
                                                //     let closeIcon = null;
                                                //     let d_doneIcon = null;
                                                //     let d_closeIcon = null;

                                                // if (e.IsVerified === 0) {
                                                //     doneIcon = '';
                                                // } else if (e.IsVerified === 1) {
                                                //     closeIcon = <DoneIcon sx={{ color: 'green' }} />;
                                                // } else if (e.IsVerified === 2) {
                                                //     closeIcon = <CloseIcon sx={{ color: 'red' }} />;
                                                // } 
                                                // if (e.IsDVerified === 0) {
                                                //     d_doneIcon = '';
                                                // } else if (e.IsDVerified === 1) {
                                                //     d_closeIcon = <DoneIcon sx={{ color: 'green' }} />;
                                                // } else if (e.IsDVerified === 2) {
                                                //     d_closeIcon = <CloseIcon sx={{ color: 'red' }} />;
                                                // }

                                                return (
                                                    <>
                                                        {
                                                            e === 'Data Not Present' ? <tr style={{ fontFamily: "Spectral-Regular" }}><td colSpan={14} align='center'>Data Not Present</td></tr> : <tr className='border_Acc' key={e?.id} style={{ fontFamily: "Spectral-Regular" }}>
                                                                <td className='border_end_acc p_1_acc text_center_acc'>{e?.IsDebit === 0 ? '' : e?.EntryDate}</td>
                                                                <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'>{e?.IsDebit === 0 ? '' : e?.particular}</td>
                                                                <td className={`border_end_acc p_1_acc text_start_acc ps_1_acc ${e?.PrintUrl === '' ? '' : 'text-primary text-decoration-underline'}  `} style={{ cursor: 'pointer' }} onClick={() => e?.PrintUrl === '' ? '' : (e?.IsDebit === 1 && window.open(atob(e?.PrintUrl)))}>{e?.IsDebit === 0 ? '' : e?.referenceno === '' ? e?.voucherno : e?.referenceno}</td>
                                                                {/* <td className='border_end_acc p_1_acc text_start_acc ps_1_acc' style={{ cursor: 'pointer' }} >{e?.IsDebit === 0 ? '' : e?.referenceno === '' ? e?.voucherno : e?.referenceno}</td> */}
                                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{e?.IsDebit === 0 ? '' : (e?.metalctw === 0 ? '' : e?.metalctw)}</td>
                                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{e?.IsDebit === 0 ? '' : (e?.diamondctw === 0 ? '' : e?.diamondctw)}</td>
                                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc' style={{ minWidth: '100px' }}> {e?.IsDebit !== 0 && <span dangerouslySetInnerHTML={{ __html: currencyCode }}></span>} {e?.IsDebit === 0 ? '' : ` ${formatAmount(e?.Currency) === 'NaN' ? '' : formatAmount(e?.Currency)} `}</td>
                                                                {/* <td className='border_end_acc p_1_acc text_center_acc'>{d_doneIcon}{d_closeIcon}</td> */}
                                                                <td className='border_end_acc p_1_acc text_center_acc'>{e?.IsDebit === 1 && icon}</td>
                                                                <td className='border_end_acc p_1_acc text_center_acc'>{e?.IsDebit === 0 ? e?.EntryDate : ''}</td>
                                                                <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'>{e?.IsDebit === 0 ? e?.particular : ''}</td>
                                                                <td className={`border_end_acc p_1_acc text_start_acc ps_1_acc ${e?.PrintUrl === '' ? '' : 'text-primary text-decoration-underline'}`} onClick={() => e?.PrintUrl === '' ? '' : (e?.IsDebit === 0 && window.open(atob(e?.PrintUrl)))} style={{ cursor: 'pointer' }}>{e?.IsDebit === 0 ? e?.referenceno === '' ? e?.voucherno : e?.referenceno : ''}</td>
                                                                {/* <td className='border_end_acc p_1_acc text_start_acc ps_1_acc ' style={{ cursor: 'pointer' }}>{e?.IsDebit === 0 ? e?.referenceno === '' ? e?.voucherno : e?.referenceno : ''}</td> */}
                                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{e?.IsDebit === 0 ? (e?.metalctw === 0 ? '' : e?.metalctw) : ''}</td>
                                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{e?.IsDebit === 0 ? (e?.diamondctw === 0 ? '' : e?.diamondctw) : ''}</td>
                                                                <td className='border_end_acc p_1_acc text_end_acc pe_1_acc' style={{ minWidth: '100px' }}> {e?.IsDebit === 0 && <span dangerouslySetInnerHTML={{ __html: currencyCode }}></span>} {e?.IsDebit === 0 ? ` ${e?.Currency === 0 ? ' 0.00' : formatAmount(e?.Currency)}` : ''}</td>

                                                                <td className=' p_1_acc text_center_acc'>{e?.IsDebit === 0 && icon}</td>
                                                            </tr>
                                                        }
                                                    </>
                                                )
                                            }) : <tr style={{ fontFamily: "Spectral-Regular" }}><td align='center' colSpan={18} style={{ color: 'grey', fontWeight: 'bold' }}> Data No Present</td></tr>
                                        }
                                        <tr className='border_Acc fw_bold_acc' style={{ fontFamily: "Spectral-Regular" }}>
                                            <td className='border_end_acc p_1_acc text_center_acc'></td>
                                            <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'></td>
                                            <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'></td>
                                            <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{((Math.abs(debit_mg_diff) + resultTotal?.debit_metalgold))?.toFixed(3) === '0.000' ? '' : (((Math.abs(debit_mg_diff) + resultTotal?.debit_metalgold))?.toFixed(3) === 'NaN' ? '0.00' : ((Math.abs(debit_mg_diff) + resultTotal?.debit_metalgold))?.toFixed(3))}</td>
                                            <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt))?.toFixed(3) === '0.000' ? '' : (((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt))?.toFixed(3) === 'NaN' ? '0.00' : ((Math.abs(debit_dia_diff) + resultTotal?.debit_diamondwt))?.toFixed(3))}</td>

                                            <td className='border_end_acc p_1_acc text_end_acc pe_1_acc' style={{ minWidth: '100px' }}>
                                                {formatAmount((Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency)) === '0.00' ? '' : <span dangerouslySetInnerHTML={{ __html: currencyCode }}></span>}&nbsp;{formatAmount((Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency)) === '0.00' ? '' : (formatAmount((Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency)) === 'NaN' ? '0.00' : formatAmount((Math.abs(debit_curr_diff) + resultTotal?.debit_totalcurrency)))}
                                            </td>
                                            <td className='border_end_acc p_1_acc text_center_acc'></td>
                                            <td className='border_end_acc p_1_acc text_center_acc'></td>
                                            <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'></td>
                                            <td className='border_end_acc p_1_acc text_start_acc ps_1_acc'></td>
                                            <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{((Math.abs(credit_mg_diff) + resultTotal?.credit_metalgold))?.toFixed(3) === '0.000' ? '' : (((Math.abs(credit_mg_diff) + resultTotal?.credit_metalgold))?.toFixed(3) === 'NaN' ? '0.00' : ((Math.abs(credit_mg_diff) + resultTotal?.credit_metalgold))?.toFixed(3))}</td>
                                            <td className='border_end_acc p_1_acc text_end_acc pe_1_acc'>{((Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3) === '0.000' ? '' : (((Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3) === 'NaN' ? '0.00' : ((Math.abs(credit_dia_diff) + resultTotal?.credit_diamondwt))?.toFixed(3))}</td>

                                            <td className='border_end_acc p_1_acc text_end_acc pe_1_acc' style={{ minWidth: '100px' }}>
                                                {formatAmount((Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency)) === '0.00' ? '' : <span dangerouslySetInnerHTML={{ __html: currencyCode }}></span>}
                                                &nbsp;
                                                {formatAmount((Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency)) === '0.00' ? '' : ((formatAmount((Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency)) === 'NaN' ? '0.00' : formatAmount((Math.abs(credit_curr_diff) + resultTotal?.credit_totalcurrency))))}</td>
                                            <td className=' p_1_acc text_center_acc'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default AccountLedger2