"use client";
import React from "react";
import "./Lookbook.modul.scss";
import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Drawer, FormControlLabel, Modal, styled, Tooltip, tooltipClasses } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LookbookSkelton from "./lookbookSkelton";
import { IoClose } from "react-icons/io5";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterListIcon from "@mui/icons-material/FilterList";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import useLookBook from "@/app/(core)/hooks/useLookBook";
import PaginationBlock from "./new/PaginationBlock";
import DesignBlockView from "./new/DesignBlockView";

const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const CustomTooltipContent = ({ categories }) => (
  <div>
    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
      {categories.map((category, index) => (
        <li key={index}>{category}</li>
      ))}
    </ul>
  </div>
);

const Lookbook = ({ storeInit }) => {
  const {
    // Core states
    loginUserDetail,
    islogin,
    thumbsSwiper,
    setThumbsSwiper,
    imageUrl,
    imageUrlDesignSet,
    isMobileScreen,
    isEditablePage,
    designSetLstData,
    setDesignSetListData,
    dstCount,
    filterData,
    setFilterData,
    filterChecked,
    cartItems,
    setCartItems,
    isProdLoading,
    setIsProdLoading,
    isPgLoading,
    setIsPgLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    swiper,
    setSwiper,
    isShowfilter,
    setIsShowFilter,
    SwiperSlideRef,
    DynamicSize,
    setDynamicSize,
    currentPage,
    setCurrentPage,
    inputPage,
    setInputPage,
    itemsPerPage,
    setItemsPerPage,
    maxwidth464px,
    imageLoadError,
    imageNotFound,
    open,
    selectedCategories,
    filteredDesignSetLstData,
    imageSources,
    totalPages,
    dataKey,
    seyDataKey,
    selectedValue,

    // Handlers
    handleImageError,
    handleImageLoad,
    handelFilterClearAll,
    handleCheckboxChange,
    handleFilterShow,
    ProdCardImageFunc,
    getRandomBgColor,
    parseDesignDetails,
    handleAddToCart,
    handleRemoveCart,
    handleByCombo,
    handleOpen,
    handleClose,
    handleNavigation,
    handleCheckboxChangeNew,
    handleHoverImages,
    handleChange,
    handlePageInputChange,
    handelPageChange,

    // Utils
    calculateTotalUnitCostWithMarkUp,
    calculateTotalUnitCostWithMarkUpGWt,
    calculateTotalUnitCostWithMarkUpNwt,
    calculateTotalUnitCostWithMarkUpDwt,
    sortDesignDetailsBySrNo,
  } = useLookBook({ storeInit });

  return (
    <div className="smr_LookBookMain">
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        className="smr_filterDrawer"
      >
        {filterData?.length > 0 && (
          <div className="smr1_lookBookFilterSubDiv" style={{ padding: "20px" }}>
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
            <span className="smr_filter_text">
              <span>Filters</span>
              <span onClick={() => handelFilterClearAll()}>{Object.values(filterChecked).filter((ele) => ele.checked)?.length > 0 ? "Clear All" : ""}</span>
            </span>
            <div style={{ marginTop: "12px", width: "250px" }}>
              {filterData?.map((ele) => (
                <>
                  {!ele?.id?.includes("Range") && !ele?.id?.includes("Price") && (
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
                          color: "#7d7f85 !imporatnt",
                          borderRadius: 0,

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
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={`${ele?.id}${opt?.id}`}
                                  checked={filterChecked[`${ele?.id}${opt?.id}`]?.checked === undefined ? false : filterChecked[`${ele?.id}${opt?.id}`]?.checked}
                                  style={{
                                    color: "#7d7f85 !important",
                                    padding: 0,
                                    width: "10px",
                                  }}
                                  onClick={(e) => handleCheckboxChange(e, ele?.id, opt?.Name)}
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
                          color: "black !important",
                          borderRadius: 0,

                          "&.MuiAccordionSummary-root": {
                            padding: 0,
                          },
                        }}
                      >
                        {ele.Name}
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
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={`Price${i}${i}`}
                                  checked={filterChecked[`Price${i}${i}`]?.checked === undefined ? false : filterChecked[`Price${i}${i}`]?.checked}
                                  style={{
                                    color: "#7f7d85",
                                    padding: 0,
                                    width: "10px",
                                  }}
                                  onClick={(e) => handleCheckboxChange(e, ele?.id, opt)}
                                  size="small"
                                />
                              }
                              className="smr_mui_checkbox_label"
                              label={opt?.Minval == 0 ? `Under ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Maxval}` : opt?.Maxval == 0 ? `Over ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Minval}` : `${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Minval} - ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Maxval}`}
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
        )}
      </Drawer>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description" className="smrlookBookPopuMain">
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
          className="smr_lookBookCategoryPoupuBox"
        >
          <div onClick={handleClose} className="smr_lookSubCtSaveBtn">
            <IoClose style={{ height: "25px", width: "25px", color: "#000000ab" }} />
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
                          control={
                            <Checkbox
                              name={`${ele?.id}${opt?.id}`}
                              checked={selectedCategories.includes(opt?.Name)}
                              style={{
                                color: "#7f7d85",
                                padding: 0,
                                width: "10px",
                              }}
                              onClick={(e) => handleCheckboxChangeNew(e, opt?.Name)}
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
            </React.Fragment>
          ))}
        </Box>
      </Modal>

      {isProdLoading ? (
        // true ?
        <div style={{ marginInline: "6%", backgroundColor: "white" }}>
          {/* <ProductListSkeleton /> */}
          <LookbookSkelton param={1} />
        </div>
      ) : (
        <div className="smr1_LookBookSubMainDiv">
          <div className="smr_lookBookMobileTopLine">
            <div className="smr_lookBook_FilterIconeDiv" onClick={handleFilterShow} style={{ fontSize: "12px" }}>
              {isShowfilter ? "HIDE FILTER" : "SHOW FILTER"}
              <FilterListIcon style={{ color: "white" }} />
            </div>
            <div className="smr_filetr_right_menu">
              <FilterAltIcon fontSize="large" style={{ color: "#c0bbb1" }} className="smr_lookBookMobileFilter" onClick={() => setIsDrawerOpen(true)} />
              <HtmlTooltip title={<CustomTooltipContent categories={selectedCategories} />}>
                <button
                  onClick={handleOpen}
                  className="smr_lookBookSelectViewBtn"
                  style={{
                    background: selectedCategories.length !== 0 ? "#7d7f85" : "#ffff",
                    color: selectedCategories.length !== 0 ? "#fff" : "#7d7f85",
                    marginRight: "30px",
                  }}
                >
                  Set View
                </button>
              </HtmlTooltip>
              <div className="lb-switch-field">
                <input type="radio" id="lb-radio-three" name="switch-two" value={1} checked={selectedValue === 1} onChange={handleChange} />
                <label htmlFor="lb-radio-three">|</label>

                <input type="radio" id="lb-radio-four" name="switch-two" value={2} checked={selectedValue === 2} onChange={handleChange} />
                <label htmlFor="lb-radio-four">||</label>

                <input type="radio" id="lb-radio-five" name="switch-two" value={3} checked={selectedValue === 3} onChange={handleChange} />
                <label htmlFor="lb-radio-five">|||</label>
              </div>
            </div>
          </div>
          <div className="smr_SubDiv_LookBookSubMainDiv">
            <div className="smr_lookbookFilterMain" style={{ zIndex: 100, transition: "1s ease", backgroundColor: "white", width: `19%`, left: `${isShowfilter ? "0" : "-500%"}`, position: "absolute", top: "100px", display: isShowfilter ? "block" : "none" }}>
              {filterData?.length > 0 && (
                <div className="smr1_lookBookFilterSubDiv">
                  <span className="smr_filter_text">
                    <span>Filters</span>
                    <span onClick={() => handelFilterClearAll()}>{Object.values(filterChecked).filter((ele) => ele.checked)?.length > 0 ? "Clear All" : ""}</span>
                  </span>
                  <div style={{ marginTop: "12px" }}>
                    {filterData?.map((ele) => (
                      <React.Fragment key={ele?.id}>
                        {!ele?.id?.includes("Range") && !ele?.id?.includes("Price") && (
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
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                color: "#7d7f85 !important",
                                borderRadius: 0,

                                "&.MuiAccordionSummary-root": {
                                  padding: 0,
                                },
                              }}
                            >
                              {ele.Name}
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
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name={`${ele?.id}${opt?.id}`}
                                        checked={filterChecked[`${ele?.id}${opt?.id}`]?.checked === undefined ? false : filterChecked[`${ele?.id}${opt?.id}`]?.checked}
                                        style={{
                                          color: "#7f7d85",
                                          padding: 0,
                                          width: "10px",
                                        }}
                                        onClick={(e) => handleCheckboxChange(e, ele?.id, opt?.Name)}
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
                              "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
                                borderBottomLeftRadius: "0px",
                                borderBottomRightRadius: "0px",
                              },
                              "&.MuiPaper-root.MuiAccordion-root:before": {
                                background: "none",
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                color: "#7d7f85 !important",
                                borderRadius: 0,

                                "&.MuiAccordionSummary-root": {
                                  padding: 0,
                                },
                              }}
                            >
                              {ele.Name}
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
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name={`Price${i}${i}`}
                                        checked={filterChecked[`Price${i}${i}`]?.checked === undefined ? false : filterChecked[`Price${i}${i}`]?.checked}
                                        style={{
                                          color: "#7f7d85",
                                          padding: 0,
                                          width: "10px",
                                        }}
                                        onClick={(e) => handleCheckboxChange(e, ele?.id, opt)}
                                        size="small"
                                      />
                                    }
                                    className="smr_mui_checkbox_label"
                                    label={opt?.Minval == 0 ? `Under ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Maxval}` : opt?.Maxval == 0 ? `Over ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Minval}` : `${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Minval} - ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}${opt?.Maxval}`}
                                  />
                                </div>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="smr_Main_lookBookImgDiv" style={{ transition: "1s ease", width: "100%" }}>
              <DesignBlockView
                selectedValue={selectedValue}
                filteredDesignSetLstData={filteredDesignSetLstData}
                isPgLoading={isPgLoading}
                storeInit={storeInit}
                loginUserDetail={loginUserDetail}
                cartItems={cartItems}
                imageNotFound={imageNotFound}
                imageLoadError={imageLoadError}
                dataKey={dataKey}
                ProdCardImageFunc={ProdCardImageFunc}
                handleImageError={handleImageError}
                handleHoverImages={handleHoverImages}
                seyDataKey={seyDataKey}
                getRandomBgColor={getRandomBgColor}
                calculateTotalUnitCostWithMarkUp={calculateTotalUnitCostWithMarkUp}
                calculateTotalUnitCostWithMarkUpDwt={calculateTotalUnitCostWithMarkUpDwt}
                calculateTotalUnitCostWithMarkUpGWt={calculateTotalUnitCostWithMarkUpGWt}
                calculateTotalUnitCostWithMarkUpNwt={calculateTotalUnitCostWithMarkUpNwt}
                parseDesignDetails={parseDesignDetails}
                sortDesignDetailsBySrNo={sortDesignDetailsBySrNo}
                formatter={formatter}
                handleByCombo={handleByCombo}
                handleAddToCart={handleAddToCart}
                handleRemoveCart={handleRemoveCart}
                handleNavigation={handleNavigation}
                setSwiper={setSwiper}
                setThumbsSwiper={setThumbsSwiper}
                SwiperSlideRef={SwiperSlideRef}
                DynamicSize={DynamicSize}
                thumbsSwiper={thumbsSwiper}
                handleImageLoad={handleImageLoad}
                imageSources={imageSources}
                imageUrlDesignSet={imageUrlDesignSet}
              />
            </div>
          </div>
          <PaginationBlock isEditablePage={isEditablePage} storeInit={storeInit} dstCount={dstCount} itemsPerPage={itemsPerPage} handelPageChange={handelPageChange} inputPage={inputPage} setInputPage={setInputPage} handlePageInputChange={handlePageInputChange} maxwidth464px={maxwidth464px} totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
};

export default Lookbook;
