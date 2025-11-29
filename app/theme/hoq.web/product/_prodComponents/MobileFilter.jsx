"use client";

import React, { useState } from 'react'

import { Drawer, Typography, Skeleton, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterSection from './FilterSection';
import CloseIcon from "@mui/icons-material/Close";
import { formatter } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import RangeViewFilter from './RangeViewFilter';

const MobileFilter = ({
    isDrawerOpen,
    setIsDrawerOpen,
    filterData,
    storeInit,
    selectedMetalId,
    setSelectedMetalId,
    metalTypeCombo,
    selectedDiaId,
    setSelectedDiaId,
    selectedCsId,
    setSelectedCsId,
    csQcCombo,
    diaQcCombo,
    sortBySelect,
    handleSortby,
    afterFilterCount,
    showClearAllButton,
    afterCountStatus,
    handelFilterClearAll,
    expandedAccordions,
    handleAccordionChange,
    FilterValueWithCheckedOnly,
    handleCheckboxChange,
    loginUserDetail,
    filterChecked,
    sliderValue,
    setSliderValue,
    show,
    setShow,
    appliedRange1,
    setAppliedRange1,
    sliderValue1,
    setSliderValue1,
    show1,
    setShow1,
    appliedRange2,
    setAppliedRange2,
    sliderValue2,
    setSliderValue2,
    show2,
    setShow2,
    appliedRange3,
    setAppliedRange3,
    handleRangeFilterApi,
    prodListType,
    cookie,
    resetRangeFilter,
    isMobile,
}) => {

    const CustomLabel = ({ text }) => (
        <Typography
            sx={{
                fontFamily: "Tenor Sans , sans-serif !important",
                fontSize: {
                    xs: "13.2px !important", // Mobile screens
                    sm: "13.5px !important", // Tablets
                    md: "13.6px !important", // Desktop screens
                    lg: "13.7px !important", // Large desktops
                    xl: "14.3px !important", // Extra large screens
                },
            }}
        >
            {text}
        </Typography>
    );

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <Drawer
            open={isDrawerOpen}
            onClose={() => {
                setIsDrawerOpen(false);
            }}
            className="hoq_filterDrawer"
            style={{ zIndex: "99999999" }}
            sx={{
                zIndex: 9999999,
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                },
            }}
        >
            <div
                style={{
                    padding: "10px"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "end",
                        padding: "8px 8px 0px 0px",
                    }}
                >
                    <CloseIcon
                        onClick={() => {
                            setIsDrawerOpen(false);
                        }}
                    />
                </div>
                <div
                    style={{
                        marginBottom: "20px",
                        display: "flex",
                        gap: "5px",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#7f7d85",
                            fontSize: "16px",
                            fontFamily: "Tenor Sans , sans-serif",
                            marginTop: "12px",
                            padding: "4px 0"

                        }}
                    >
                        Customization
                    </Typography>
                    {storeInit?.IsMetalCustComb == 1 && (
                        <div
                        // className="smr_metal_custom"
                        >
                            <Typography
                                className="label"
                                sx={{
                                    color: "#7f7d85",
                                    fontSize: "14px",
                                    fontFamily: "Tenor Sans , sans-serif",
                                    padding: "4px 0"

                                }}
                            >
                                Metal:&nbsp;
                            </Typography>
                            <select
                                style={{
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "2px",
                                    minWidth: "270px",
                                    textTransform: "uppercase",
                                }}
                                className="select"
                                value={selectedMetalId}
                                onChange={(e) => {
                                    setSelectedMetalId(e.target.value)
                                }}
                            >
                                {metalTypeCombo?.map((metalele) => (
                                    <option
                                        className="option"
                                        key={metalele?.Metalid}
                                        value={metalele?.Metalid}
                                    >
                                        {metalele?.metaltype.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {storeInit?.IsDiamondCustComb === 1 && (
                        <div
                        // className="smr_dia_custom"
                        >
                            <Typography
                                className="label"
                                sx={{
                                    color: "#7f7d85",
                                    fontSize: "14px",
                                    fontFamily: "Tenor Sans , sans-serif",
                                    padding: "4px 0"
                                }}
                            >
                                Diamond:&nbsp;
                            </Typography>
                            <select
                                style={{
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "2px",
                                    minWidth: "270px",
                                    textTransform: "uppercase",
                                    fontWeight: "500",
                                }}
                                className="select"
                                value={selectedDiaId}
                                onChange={(e) => { setSelectedDiaId(e.target.value) }}
                            >
                                {diaQcCombo?.map((diaQc) => (
                                    <option
                                        className="option"
                                        key={diaQc?.QualityId}
                                        value={`${diaQc?.QualityId},${diaQc?.ColorId}`}
                                        style={{
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {" "}
                                        {`${diaQc.Quality.toUpperCase()},${diaQc.color.toLowerCase()}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {storeInit?.IsCsCustomization === 1 && (
                        <div
                        // className="smr_cs_custom"
                        >
                            <Typography
                                className="label"
                                sx={{
                                    color: "#7f7d85",
                                    fontSize: "14px",
                                    fontFamily: "Tenor Sans , sans-serif",
                                    padding: "4px 0"

                                }}
                            >
                                color stone:&nbsp;
                            </Typography>
                            <select
                                style={{
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "2px",
                                    minWidth: "270px",
                                    fontFamily: "Tenor Sans , sans-serif",
                                    textTransform: "uppercase",
                                }}
                                className="select"
                                value={selectedCsId}
                                onChange={(e) => setSelectedCsId(e.target.value)}
                            >
                                {ColorStoneQualityColorCombo?.map((csCombo) => (
                                    <option
                                        className="option"
                                        key={csCombo?.QualityId}
                                        value={`${csCombo?.QualityId},${csCombo?.ColorId}`}
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: "500"
                                        }}
                                    >
                                        {" "}
                                        {`${csCombo.Quality.toUpperCase()},${csCombo.color.toLowerCase()}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {/* sort */}
                    <div
                    // className="smr_sorting_custom"
                    >
                        <div
                        // className="container"
                        >
                            <Typography
                                className="label"
                                sx={{
                                    color: "#7f7d85",
                                    fontSize: "14px",
                                    fontFamily: "Tenor Sans , sans-serif",
                                    padding: "4px 0"

                                }}
                            >
                                Sort By:&nbsp;
                            </Typography>
                            <select
                                style={{
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "2px",
                                    minWidth: "270px",
                                    fontFamily: "Tenor Sans , sans-serif ",
                                }}
                                className="select"
                                value={sortBySelect}
                                onChange={(e) => handleSortby(e)}
                            >
                                <option className="option" value="Recommended">
                                    Recommended
                                </option>
                                <option className="option" value="New">
                                    New
                                </option>
                                <option className="option" value="Trending">
                                    Trending
                                </option>
                                <option className="option" value="Bestseller">
                                    Bestseller
                                </option>
                                <option className="option" value="In Stock">
                                    In stock
                                </option>
                                <option className="option" value="PRICE HIGH TO LOW">
                                    Price High To Low
                                </option>
                                <option className="option" value="PRICE LOW TO HIGH">
                                    Price Low To High
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div
                    className="smr_mobile_filter_portion"
                    style={{
                        fontFamily: "Tenor Sans , sans-serif !Important",
                    }}
                >
                    {filterData?.length > 0 && (
                        <div className="smr_mobile_filter_portion_outter">
                            <span className="smr_filter_text"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%"
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: "500",
                                        fontFamily: "Tenor Sans , sans-serif",
                                    }}
                                >
                                    {
                                        // Object.values(filterChecked).filter((ele) => ele.checked)
                                        //   ?.length === 0 
                                        !showClearAllButton()
                                            ? (
                                                // ? <span><span>{"Filters"}</span> <span>{"Product"}</span></span>
                                                "Filters"
                                            ) : (
                                                <>
                                                    {afterCountStatus == true ? (
                                                        <Skeleton
                                                            variant="rounded"
                                                            width={140}
                                                            height={22}
                                                            className="pSkelton"
                                                        />
                                                    ) : (
                                                        <span>{`Product Found : ${afterFilterCount}`}</span>
                                                    )}
                                                </>
                                            )}
                                </span>
                                <span
                                    onClick={() => handelFilterClearAll()}
                                    style={{
                                        fontWeight: "600",
                                        fontFamily: "Tenor Sans , sans-serif",

                                    }}
                                >
                                    {
                                        // Object.values(filterChecked).filter((ele) => ele.checked)
                                        //   ?.length > 0 
                                        showClearAllButton()
                                            ? (
                                                "Clear All"
                                            ) : (
                                                <>
                                                    {afterCountStatus == true ? (
                                                        <Skeleton
                                                            variant="rounded"
                                                            width={140}
                                                            height={22}
                                                            className="pSkelton"
                                                        />
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontWeight: "500",
                                                                fontFamily: "Tenor Sans , sans-serif",
                                                            }}
                                                        >{`Total Products: ${afterFilterCount}`}</span>
                                                    )}
                                                </>
                                            )}
                                </span>
                            </span>
                            <div style={{ marginTop: "12px" }}>
                                {filterData?.map((ele) => (
                                    <>
                                        {!ele?.id?.includes("Range") &&
                                            !ele?.id?.includes("Price") && (
                                                <Accordion
                                                    elevation={0}
                                                    sx={{
                                                        borderBottom: "1px solid #c7c8c9",
                                                        borderRadius: 0,
                                                        fontFamily: "Tenor Sans , sans-serif ",
                                                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                                        {
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
                                                        expandIcon={
                                                            <ExpandMoreIcon sx={{ width: "20px" }} />
                                                        }
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                        sx={{
                                                            color: "gray",
                                                            borderRadius: 0,
                                                            fontFamily: "Tenor Sans , sans-serif",
                                                            fontWeight: "500 !important",
                                                            "&.MuiAccordionSummary-root": {
                                                                padding: 0,
                                                            },

                                                        }}
                                                        className="filtercategoryLable"
                                                    >
                                                        {/* <span> */}
                                                        <Typography sx={{
                                                            color: "gray",
                                                            borderRadius: 0,
                                                            fontFamily: "Tenor Sans , sans-serif",
                                                            fontWeight: "500 !important",
                                                        }}>  {ele.Fil_DisName}</Typography>
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
                                                            fontFamily: "Tenor Sans , sans-serif",
                                                            bgcolor: "white"
                                                        }}
                                                    >
                                                        {(JSON.parse(ele?.options) ?? []).map((opt) => (
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    gap: "12px",
                                                                    fontFamily:
                                                                        "Tenor Sans , sans-serif !important",
                                                                }}
                                                                key={opt?.id}
                                                            >
                                                                <FormControlLabel
                                                                    sx={{
                                                                        "& .MuiFormControlLabel-label": {
                                                                            fontFamily:
                                                                                "Tenor Sans, sans-serif !important",
                                                                        },
                                                                        width: "100%",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        flexDirection: "row-reverse"
                                                                    }}
                                                                    control={
                                                                        <Checkbox
                                                                            disableRipple={true}
                                                                            name={`${ele?.id}${opt?.id}`}
                                                                            checked={
                                                                                filterChecked[`${ele?.id}${opt?.id}`]
                                                                                    ?.checked === undefined
                                                                                    ? false
                                                                                    : filterChecked[
                                                                                        `${ele?.id}${opt?.id}`
                                                                                    ]?.checked
                                                                            }
                                                                            sx={{
                                                                                fontFamily:
                                                                                    "Tenor Sans , sans-serif !important",
                                                                                width: "100%",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "space-between",
                                                                                flexDirection: "row-reverse"
                                                                            }}
                                                                            style={{
                                                                                color: "#7f7d85",
                                                                                padding: 0,

                                                                                fontFamily:
                                                                                    "Tenor Sans , sans-serif  !important",
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
                                                                    className="smr_mui_checkbox_label"
                                                                    label={<CustomLabel text={opt.Name} />}
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
                                                    fontFamily: "Tenor Sans , sans-serif",
                                                    gap: "12px",
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
                                                    expandIcon={
                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                    }
                                                    aria-controls="panel1-content"
                                                    id="panel1-header"
                                                    sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                        "&.MuiAccordionSummary-root": {
                                                            padding: 0,
                                                        },
                                                    }}
                                                    className="filtercategoryLable"
                                                   
                                                >
                                                    {/* <span> */}
                                                    <Typography sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                        fontWeight: "500 !important",
                                                    }}>  {ele.Fil_DisName}</Typography>
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
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                    }}
                                                >
                                                    {(JSON.parse(ele?.options) ?? []).map((opt, i) => (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                gap: "12px",
                                                                fontFamily: "Tenor Sans , sans-serif",
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
                                                                style={{
                                                                    fontFamily: "Tenor Sans , sans-serif",
                                                                }}
                                                                sx={{
                                                                    width: "100%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    flexDirection: "row-reverse"
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
                                                                            filterChecked[`Price${i}${i}`]
                                                                                ?.checked === undefined
                                                                                ? false
                                                                                : filterChecked[`Price${i}${i}`]
                                                                                    ?.checked
                                                                        }
                                                                        style={{
                                                                            color: "#7f7d85",
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
                                                                className="smr_mui_checkbox_label"
                                                                label={
                                                                    <CustomLabel
                                                                        text={
                                                                            opt?.Minval == 0
                                                                                ? `Under  ${decodeEntities(
                                                                                    loginUserDetail?.CurrencyCode ??
                                                                                    storeInit?.CurrencyCode
                                                                                )} ${formatter(opt?.Maxval)}`
                                                                                : opt?.Maxval == 0
                                                                                    ? `Over  ${decodeEntities(
                                                                                        loginUserDetail?.CurrencyCode ??
                                                                                        storeInit?.CurrencyCode
                                                                                    )} ${formatter(opt?.Minval)}`
                                                                                    : `${decodeEntities(
                                                                                        loginUserDetail?.CurrencyCode ??
                                                                                        storeInit?.CurrencyCode
                                                                                    )}  ${formatter(
                                                                                        opt?.Minval
                                                                                    )} - ${decodeEntities(
                                                                                        loginUserDetail?.CurrencyCode ??
                                                                                        storeInit?.CurrencyCode
                                                                                    )}  ${formatter(opt?.Maxval)}`
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    ))}
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                        {ele?.Name?.includes("Diamond") && (
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
                                                style={{
                                                    fontFamily: "Tenor Sans , sans-serif",
                                                }}
                                            // expanded={accExpanded}
                                            // defaultExpanded={}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                    }
                                                    aria-controls="panel1-content"
                                                    id="panel1-header"
                                                    sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontSize: "14px",

                                                        "&.MuiAccordionSummary-root": {
                                                            padding: 0,
                                                        },
                                                    }}
                                                    // className="filtercategoryLable"
                                                   
                                                >
                                                    {/* <span> */}
                                                    <Typography sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                        fontWeight: "500 !important",
                                                    }}>  {ele.Fil_DisName}</Typography>
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
                                                    {/* {console.log("RangeEle",JSON?.parse(ele?.options)[0])} */}
                                                    <Box sx={{ width: 203, height: 88 }}>
                                                        {/* {RangeFilterView(ele)} */}
                                                        <RangeViewFilter
                                                            ele={ele}
                                                            sliderValue={sliderValue}
                                                            setSliderValue={setSliderValue}
                                                            handleRangeFilterApi={handleRangeFilterApi}
                                                            prodListType={prodListType}
                                                            cookie={cookie}
                                                            show={show}
                                                            setShow={setShow}
                                                            appliedRange={appliedRange1}
                                                            setAppliedRange={setAppliedRange1}
                                                            filterKey="Diamond"
                                                            apiPosition={0}
                                                            resetRangeFilter={resetRangeFilter}
                                                        />
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                        {ele?.Name?.includes("NetWt") && (
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
                                                    expandIcon={
                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                    }
                                                    aria-controls="panel1-content"
                                                    id="panel1-header"
                                                    sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontSize: "14px",

                                                        "&.MuiAccordionSummary-root": {
                                                            padding: 0,
                                                        },
                                                    }}
                                                    style={{
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                    }}
                                                    // className="filtercategoryLable"
                                                   
                                                >
                                                    {/* <span> */}
                                                    <Typography sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                        fontWeight: "500 !important",
                                                    }}>  {ele.Fil_DisName}</Typography>
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
                                                    {/* {console.log("RangeEle",JSON?.parse(ele?.options)[0])} */}
                                                    <Box sx={{ width: 204, height: 88 }}>
                                                        <RangeViewFilter
                                                            ele={ele}
                                                            sliderValue={sliderValue1}
                                                            setSliderValue={setSliderValue1}
                                                            handleRangeFilterApi={handleRangeFilterApi}
                                                            prodListType={prodListType}
                                                            cookie={cookie}
                                                            show={show1}
                                                            setShow={setShow1}
                                                            appliedRange={appliedRange2}
                                                            setAppliedRange={setAppliedRange2}
                                                            filterKey="NetWt"
                                                            apiPosition={1}
                                                            resetRangeFilter={resetRangeFilter}
                                                        />
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                        {ele?.Name?.includes("Gross") && (
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
                                                    expandIcon={
                                                        <ExpandMoreIcon sx={{ width: "20px" }} />
                                                    }
                                                    aria-controls="panel1-content"
                                                    id="panel1-header"
                                                    sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontSize: "14px",

                                                        "&.MuiAccordionSummary-root": {
                                                            padding: 0,
                                                        },
                                                    }}
                                                    style={{
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                    }}
                                                    // className="filtercategoryLable"
                                                   
                                                >
                                                    {/* <span> */}
                                                    <Typography sx={{
                                                        color: "gray",
                                                        borderRadius: 0,
                                                        fontFamily: "Tenor Sans , sans-serif",
                                                        fontWeight: "500 !important",
                                                    }}>  {ele.Fil_DisName}</Typography>
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
                                                    <Box sx={{ width: 204, height: 88 }}>
                                                        <RangeViewFilter
                                                            ele={ele}
                                                            sliderValue={sliderValue2}
                                                            setSliderValue={setSliderValue2}
                                                            handleRangeFilterApi={handleRangeFilterApi}
                                                            prodListType={prodListType}
                                                            cookie={cookie}
                                                            show={show2}
                                                            setShow={setShow2}
                                                            appliedRange={appliedRange3}
                                                            setAppliedRange={setAppliedRange3}
                                                            filterKey="Gross"
                                                            apiPosition={2}
                                                            resetRangeFilter={resetRangeFilter}
                                                        />
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    )
}

export default MobileFilter
