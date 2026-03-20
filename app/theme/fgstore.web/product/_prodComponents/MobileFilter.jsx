"use client";

import React, { useState } from 'react'

import { Drawer, Typography, Skeleton, Box } from "@mui/material";
import FilterSection from './FilterSection';
import CloseIcon from "@mui/icons-material/Close";

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
    return (
        <Drawer
            open={isDrawerOpen}
            onClose={() => {
                setIsDrawerOpen(false);
            }}
            className="smr_filterDrawer"
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    boxSizing: 'border-box',
                    px: 2,
                    py: 1
                }}
            >
                <div>
                </div>
                <CloseIcon
                    onClick={() => {
                        setIsDrawerOpen(false);
                    }}
                />
            </Box>
            <div
                style={{
                    marginLeft: "15px",
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
                        fontFamily: "TT Commons Medium",
                        marginTop: "12px",
                    }}
                >
                    Customization
                </Typography>
                {storeInit?.IsMetalCustComb === 1 && <div
                >
                    <Typography
                        className="label"
                        sx={{
                            color: "#7f7d85",
                            fontSize: "14px",
                            fontFamily: "TT Commons Regular",
                        }}
                    >
                        Metal:&nbsp;
                    </Typography>
                    <select
                        style={{
                            border: "1px solid #e1e1e1",
                            borderRadius: "8px",
                            minWidth: "270px",
                        }}
                        className="select"
                        value={selectedMetalId}
                        onChange={(e) => {
                            setSelectedMetalId(e.target.value);
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
                </div>}

                {storeInit?.IsDiamondCustComb === 1 && (
                    <div
                    >
                        <Typography
                            className="label"
                            sx={{
                                color: "#7f7d85",
                                fontSize: "14px",
                                fontFamily: "TT Commons Regular",
                            }}
                        >
                            Diamond:&nbsp;
                        </Typography>
                        <select
                            style={{
                                border: "1px solid #e1e1e1",
                                borderRadius: "8px",
                                minWidth: "270px",
                            }}
                            className="select"
                            value={selectedDiaId}
                            onChange={(e) => setSelectedDiaId(e.target.value)}
                        >
                            {diaQcCombo?.map((diaQc) => (
                                <option
                                    className="option"
                                    key={`${diaQc?.QualityId},${diaQc?.ColorId}`}
                                    value={`${diaQc?.QualityId},${diaQc?.ColorId}`}
                                >
                                    {" "}
                                    {`${diaQc.Quality},${diaQc.color}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {storeInit?.IsCsCustomization === 1 && (
                    <div
                    >
                        <Typography
                            className="label"
                            sx={{
                                color: "#7f7d85",
                                fontSize: "14px",
                                fontFamily: "TT Commons Regular",
                            }}
                        >
                            Color Stone:&nbsp;
                        </Typography>
                        <select
                            style={{
                                border: "1px solid #e1e1e1",
                                borderRadius: "8px",
                                minWidth: "270px",
                            }}
                            className="select"
                            value={selectedCsId}
                            onChange={(e) => setSelectedCsId(e.target.value)}
                        >
                            {csQcCombo?.map((csCombo) => (
                                <option
                                    className="option"
                                    key={`${csCombo?.QualityId},${csCombo?.ColorId}`}
                                    value={`${csCombo?.QualityId},${csCombo?.ColorId}`}
                                >
                                    {" "}
                                    {`${csCombo.Quality.toUpperCase()},${csCombo.color.toLowerCase()}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {storeInit?.IsMetalCustComb === 1 && (
                    <div
                    >
                        <div
                        >
                            <Typography
                                className="label"
                                sx={{
                                    color: "#7f7d85",
                                    fontSize: "14px",
                                    fontFamily: "TT Commons Regular",
                                }}
                            >
                                Sort By:&nbsp;
                            </Typography>
                            <select
                                style={{
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "8px",
                                    minWidth: "270px",
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
                                {storeInit?.IsStockWebsite == 1 &&
                                    <option className="option" value="In Stock">
                                        In stock
                                    </option>
                                }
                                <option className="option" value="PRICE HIGH TO LOW">
                                    Price High To Low
                                </option>
                                <option className="option" value="PRICE LOW TO HIGH">
                                    Price Low To High
                                </option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
            <div className="smr_mobile_filter_portion">
                {filterData?.length > 0 && (
                    <div className="smr_mobile_filter_portion_outter">
                        <span className="smr_filter_text">
                            <span className="filter_Span">
                                {
                                    !showClearAllButton()
                                        ? "Filters"
                                        :
                                        <>{afterCountStatus == true ? (
                                            <Skeleton
                                                variant="rounded"
                                                width={140}
                                                height={22}
                                                className="pSkelton"
                                            />
                                        ) :
                                            <span className="filter_Span">{`Product Found: ${afterFilterCount}`}</span>
                                        }
                                        </>
                                }
                            </span>
                            <span
                                onClick={() => handelFilterClearAll()}
                                className="filter_Span"
                            >
                                {
                                    showClearAllButton()
                                        ? "Clear All"
                                        : <>{afterCountStatus == true ? (
                                            <Skeleton
                                                variant="rounded"
                                                width={140}
                                                height={22}
                                                className="pSkelton"
                                            />
                                        ) :
                                            <span className="filter_Span">{`Total Products: ${afterFilterCount}`}</span>
                                        }
                                        </>
                                }
                            </span>
                        </span>
                        <FilterSection
                            filterData={filterData}
                            expandedAccordions={expandedAccordions}
                            handleAccordionChange={handleAccordionChange}
                            FilterValueWithCheckedOnly={FilterValueWithCheckedOnly}
                            handleCheckboxChange={handleCheckboxChange}
                            storeInit={storeInit}
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
                    </div>
                )}
            </div>
        </Drawer>
    )
}

export default MobileFilter
