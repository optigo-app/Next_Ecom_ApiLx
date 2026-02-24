"use client";

import React, { memo, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RangeViewFilter from "./RangeViewFilter";

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

    return (
        <div style={containerStyle}>
            {filterData?.map((ele, index) => (
                <React.Fragment key={index}>
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
                                // expanded={!!expandedAccordions[index]}
                                // onChange={handleAccordionChange(index)}
                                onClick={() => handleToggle(ele?.id)}
                                expanded={!!open[ele?.id]}

                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    sx={{
                                        color: "#7d7f85",
                                        borderRadius: 0,

                                        "&.MuiAccordionSummary-root": {
                                            padding: 0,
                                        },
                                    }}
                                >
                                    {ele.Fil_DisName}
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
                                    {(JSON?.parse(ele?.options) ?? []).map((opt) => (
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
                                                control={
                                                    <Checkbox
                                                        name={`${ele?.id}${opt?.id}`}
                                                        checked={
                                                            filterChecked[`${ele?.id}${opt?.id}`]
                                                                ?.checked === undefined
                                                                ? false
                                                                : filterChecked[`${ele?.id}${opt?.id}`]
                                                                    ?.checked
                                                        }
                                                        sx={{
                                                            color: "#7f7d85 !important",
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
                                                className="smr_mui_checkbox_label"
                                                label={opt.Name}
                                            />
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        )}
                    {storeInit?.IsPriceShow == 1 && ele?.id?.includes("Price") && (
                        <Accordion
                            elevation={0}
                            sx={{
                                borderBottom: "1px solid #c7c8c9",
                                borderRadius: 0,
                                "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                                {
                                    borderBottomLeftRadius: "0px",
                                    borderBottomRightRadius: "0px",
                                },
                                "&.MuiPaper-root.MuiAccordion-root:before":
                                {
                                    background: "none",
                                },
                            }}
                            // expanded={!!expandedAccordions[index]}
                            // onChange={handleAccordionChange(index)}
                            onClick={() => handleToggle(ele?.id)}
                            expanded={!!open[ele?.id]}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon sx={{ width: "20px" }} />
                                }
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    color: "#7f7d85",
                                    borderRadius: 0,

                                    "&.MuiAccordionSummary-root": {
                                        padding: 0,
                                    },
                                }}
                            >
                                {ele.Fil_DisName}
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
                                {(JSON.parse(ele?.options) ?? []).map(
                                    (opt, i) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: "12px",
                                            }}
                                            key={i}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name={`Price${i}${i}`}
                                                        checked={
                                                            filterChecked[`Price${i}${i}`]
                                                                ?.checked === undefined
                                                                ? false
                                                                : filterChecked[
                                                                    `Price${i}${i}`
                                                                ]?.checked
                                                        }
                                                        style={{
                                                            color: "#7f7d85",
                                                            padding: 0,
                                                            width: "10px",
                                                        }}
                                                        onClick={(e) =>
                                                            handleCheckboxChange(
                                                                e,
                                                                ele?.id,
                                                                opt
                                                            )
                                                        }
                                                        size="small"
                                                    />
                                                }
                                                className="smr_mui_checkbox_label"
                                                label={
                                                    opt?.Minval == 0
                                                        ? `Under ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Maxval}`
                                                        : opt?.Maxval == 0
                                                            ? `Over ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Minval}`
                                                            : `${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Minval} 
                                                   - ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${opt?.Maxval}`
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {/* Diamond Range Filter */}
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
                            expanded={!!expandedAccordions[index]}
                            onChange={handleAccordionChange(index)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    color: "#7f7d85",
                                    borderRadius: 0,
                                    "&.MuiAccordionSummary-root": {
                                        padding: 0,
                                    },
                                }}
                            >
                                {ele.Fil_DisName}
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
                                <Box sx={{ width: boxWidth, height: 88 }}>
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

                    {/* NetWt Range Filter */}
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
                            expanded={!!expandedAccordions[index]}
                            onChange={handleAccordionChange(index)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    color: "#7f7d85",
                                    borderRadius: 0,
                                    "&.MuiAccordionSummary-root": {
                                        padding: 0,
                                    },
                                }}
                            >
                                {ele.Fil_DisName}
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
                                <Box sx={{ width: boxWidth, height: 88 }}>
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

                    {/* Gross Range Filter */}
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
                            expanded={!!expandedAccordions[index]}
                            onChange={handleAccordionChange(index)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    color: "#7f7d85",
                                    borderRadius: 0,
                                    "&.MuiAccordionSummary-root": {
                                        padding: 0,
                                    },
                                }}
                            >
                                {ele.Fil_DisName}
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
                                <Box sx={{ width: boxWidth, height: 88 }}>
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
                </React.Fragment>
            ))}
        </div>
    );
});

FilterSection.displayName = "FilterSection";

export default FilterSection;