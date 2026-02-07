"use client";

import React, { memo, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RangeViewFilter from "./RangeViewFilter";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const FilterSection = memo(({
    filterData,
    expandedAccordions,
    handleAccordionChange,
    FilterValueWithCheckedOnly,
    handleCheckboxChange,
    storeInit,
    loginUserDetail,
    filterChecked,
    // Range filter props for Diamond
    sliderValue,
    setSliderValue,
    show,
    setShow,
    appliedRange1,
    setAppliedRange1,
    // Range filter props for NetWt
    sliderValue1,
    setSliderValue1,
    show1,
    setShow1,
    appliedRange2,
    setAppliedRange2,
    // Range filter props for Gross
    sliderValue2,
    setSliderValue2,
    show2,
    setShow2,
    appliedRange3,
    setAppliedRange3,
    // Common props
    handleRangeFilterApi,
    prodListType,
    cookie,
    resetRangeFilter,
    isMobile = false,
}) => {
    const [open, setOpen] = useState({});
    const containerStyle = isMobile
        ? { marginTop: "12px", maxHeight: "80vh", overflowY: "auto", overflowX: "hidden" }
        : { marginTop: "12px", maxHeight: "80vh", overflowY: "auto", overflowX: "hidden" };

    const boxWidth = isMobile ? 203 : 204;

    const handleToggle = (filterKey) => {
        setOpen({ ...open, [filterKey]: !open[filterKey] });
    }

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
        <div style={containerStyle}>
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
    );
});

FilterSection.displayName = "FilterSection";

export default FilterSection;