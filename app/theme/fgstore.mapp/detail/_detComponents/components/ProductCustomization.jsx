import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ProductCustomization = ({
    storeInit,
    metalTypeCombo,
    selectMtType,
    singleProd,
    singleProd1,
    handleCustomChange,
    metalColorCombo,
    selectMtColor,
    handleMetalWiseColorImg,
    handleMetalWiseColorImgWithFlag,
    diaQcCombo,
    diaList,
    selectDiaQc,
    csQcCombo,
    selectCsQc,
    csList,
    SizeCombo,
    SizeSorting,
    sizeData,
    loginInfo,
    formatter,
    isPriceloading
}) => {
    if (storeInit?.IsProductWebCustomization !== 1) {
        return null;
    }

    return (
        <>
            <div className="smr_single_prod_customize">
                {metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
                    <div className="smr_single_prod_customize_metal">
                        <label className="menuItemTimeEleveDeatil">
                            METAL TYPE:
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                            <span className="menuitemSelectoreMain">
                                {singleProd?.MetalTypePurity}
                            </span>
                        ) : (
                            <select
                                className="menuitemSelectoreMain"
                                value={selectMtType}
                                onChange={(e) => handleCustomChange(e, "mt")}
                            >
                                {metalTypeCombo.map((ele, i) => (
                                    <option key={i} value={ele?.metaltype}>
                                        {ele?.metaltype}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
                    <div className="smr_single_prod_customize_outer">
                        <label className="menuItemTimeEleveDeatil">
                            METAL COLOR:
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                            <span className="menuitemSelectoreMain">
                                {metalColorCombo?.filter(
                                    (ele) => ele?.id == singleProd?.MetalColorid
                                )[0]?.metalcolorname}
                            </span>
                        ) : (
                            <select
                                className="menuitemSelectoreMain"
                                value={selectMtColor}
                                onChange={(e) =>
                                    storeInit?.IsColorWiseImages === 1
                                        ? handleMetalWiseColorImg(e)
                                        : handleMetalWiseColorImgWithFlag(e)
                                }
                            >
                                {metalColorCombo?.map((ele, i) => (
                                    <option key={i} value={ele?.colorcode}>
                                        {ele?.metalcolorname}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {storeInit?.IsDiamondCustomization == 1 &&
                    diaQcCombo?.length > 0 &&
                    diaList?.length ? (
                    <div className="smr_single_prod_customize_outer">
                        <label className="menuItemTimeEleveDeatil">
                            DIAMOND :
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                            <span className="menuitemSelectoreMain">
                                {singleProd?.DiaQuaCol}
                            </span>
                        ) : (
                            <select
                                className="menuitemSelectoreMain"
                                value={selectDiaQc}
                                onChange={(e) => handleCustomChange(e, "dia")}
                            >
                                {diaQcCombo.map((ele, i) => (
                                    <option
                                        key={i}
                                        value={`${ele?.Quality},${ele?.color}`}
                                    >{`${ele?.Quality},${ele?.color}`}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ) : null}

                {storeInit?.IsCsCustomization === 1 &&
                    selectCsQc?.length > 0 &&
                    csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
                    <div className="smr_single_prod_customize_outer">
                        <label className="menuItemTimeEleveDeatil">
                            COLOR STONE :
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                            <span className="menuitemSelectoreMain">
                                {singleProd?.CsQuaCol}
                            </span>
                        ) : (
                            <select
                                className="menuitemSelectoreMain"
                                value={selectCsQc}
                                onChange={(e) => handleCustomChange(e, "cs")}
                            >
                                {csQcCombo.map((ele, i) => (
                                    <option
                                        key={i}
                                        value={`${ele?.Quality},${ele?.color}`}
                                    >{`${ele?.Quality},${ele?.color}`}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ) : null}

                {SizeSorting(SizeCombo?.rd)?.length > 0 &&
                    singleProd?.DefaultSize !== "" && (
                    <div className="smr_single_prod_customize_outer">
                        <label className="menuItemTimeEleveDeatil">
                            SIZE:
                        </label>
                        {singleProd?.IsMrpBase == 1 ? (
                            <span className="menuitemSelectoreMain">
                                {singleProd?.DefaultSize}
                            </span>
                        ) : (
                            <select
                                className="menuitemSelectoreMain"
                                value={sizeData}
                                onChange={(e) => handleCustomChange(e, "sz")}
                            >
                                {SizeCombo?.rd?.map((ele, i) => (
                                    <option value={ele?.sizename} key={i}>
                                        {ele?.sizename}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}
            </div>

            {storeInit?.IsPriceShow === 1 &&
                storeInit?.IsPriceBreakUp == 1 &&
                singleProd1?.IsMrpBase !== 1 &&
                singleProd?.IsMrpBase !== 1 && (
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
                        width: "95.5%",
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
                        <Typography
                            sx={{
                                fontFamily: "TT Commons Regular",
                                fontSize: "18px",
                            }}
                        >
                            Price Breakup
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            padding: "0 0 16px 0",
                        }}
                    >
                        {(singleProd1?.Metal_Cost ? singleProd1?.Metal_Cost : singleProd?.Metal_Cost) !== 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    className="smr_Price_breakup_label"
                                    sx={{ fontFamily: "TT Commons Regular" }}
                                >
                                    Metal
                                </Typography>
                                <span style={{ display: "flex" }}>
                                    <Typography>
                                        <span
                                            className="smr_currencyFont"
                                            sx={{ fontFamily: "TT Commons Regular" }}
                                        >
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        sx={{ fontFamily: "TT Commons Regular" }}
                                        className="smr_PriceBreakup_Price"
                                    >
                                        {formatter.format(
                                            (singleProd1?.Metal_Cost ? singleProd1?.Metal_Cost : singleProd?.Metal_Cost)?.toFixed(2)
                                        )}
                                    </Typography>
                                </span>
                            </div>
                        ) : null}

                        {(singleProd1?.Diamond_Cost ? singleProd1?.Diamond_Cost : singleProd?.Diamond_Cost) !== 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    className="smr_Price_breakup_label"
                                    sx={{ fontFamily: "TT Commons Regular" }}
                                >
                                    Diamond{" "}
                                </Typography>
                                <span style={{ display: "flex" }}>
                                    <Typography>
                                        <span
                                            className="smr_currencyFont"
                                            sx={{ fontFamily: "TT Commons Regular" }}
                                        >
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        className="smr_PriceBreakup_Price"
                                        sx={{ fontFamily: "TT Commons Regular" }}
                                    >
                                        {formatter.format(
                                            (singleProd1?.Diamond_Cost ? singleProd1?.Diamond_Cost : singleProd?.Diamond_Cost)?.toFixed(2)
                                        )}
                                    </Typography>
                                </span>
                            </div>
                        ) : null}

                        {(singleProd1?.ColorStone_Cost ? singleProd1?.ColorStone_Cost : singleProd?.ColorStone_Cost) !== 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    className="smr_Price_breakup_label"
                                    sx={{ fontFamily: "TT Commons Regular" }}
                                >
                                    Stone{" "}
                                </Typography>
                                <span style={{ display: "flex" }}>
                                    <Typography>
                                        <span
                                            className="smr_currencyFont"
                                            sx={{ fontFamily: "TT Commons Regular" }}
                                        >
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        className="smr_PriceBreakup_Price"
                                        sx={{ fontFamily: "TT Commons Regular" }}
                                    >
                                        {formatter.format(
                                            (singleProd1?.ColorStone_Cost ? singleProd1?.ColorStone_Cost : singleProd?.ColorStone_Cost)?.toFixed(2)
                                        )}
                                    </Typography>
                                </span>
                            </div>
                        ) : null}

                        {(singleProd1?.Misc_Cost ? singleProd1?.Misc_Cost : singleProd?.Misc_Cost) !== 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    className="smr_Price_breakup_label"
                                    sx={{ fontFamily: "TT Commons Regular" }}
                                >
                                    MISC{" "}
                                </Typography>
                                <span style={{ display: "flex" }}>
                                    <Typography>
                                        <span
                                            className="smr_currencyFont"
                                            sx={{ fontFamily: "TT Commons Regular" }}
                                        >
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        className="smr_PriceBreakup_Price"
                                        sx={{ fontFamily: "TT Commons Regular" }}
                                    >
                                        {formatter.format(
                                            (singleProd1?.Misc_Cost ? singleProd1?.Misc_Cost : singleProd?.Misc_Cost)?.toFixed(2)
                                        )}
                                    </Typography>
                                </span>
                            </div>
                        ) : null}

                        {(singleProd1?.Labour_Cost ? singleProd1?.Labour_Cost : singleProd?.Labour_Cost) !== 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    className="smr_Price_breakup_label"
                                    sx={{ fontFamily: "TT Commons Regular" }}
                                >
                                    Making{" "}
                                </Typography>
                                <span style={{ display: "flex" }}>
                                    <Typography>
                                        <span
                                            className="smr_currencyFont"
                                            sx={{ fontFamily: "TT Commons Regular" }}
                                        >
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        className="smr_PriceBreakup_Price"
                                        sx={{ fontFamily: "TT Commons Regular" }}
                                    >
                                        {formatter.format(
                                            (singleProd1?.Labour_Cost ? singleProd1?.Labour_Cost : singleProd?.Labour_Cost)?.toFixed(2)
                                        )}
                                    </Typography>
                                </span>
                            </div>
                        ) : null}

                        {(singleProd1?.Other_Cost ? singleProd1?.Other_Cost : singleProd?.Other_Cost) +
                            (singleProd1?.Size_MarkUp ? singleProd1?.Size_MarkUp : singleProd?.Size_MarkUp) +
                            (singleProd1?.DesignMarkUpAmount ? singleProd1?.DesignMarkUpAmount : singleProd?.DesignMarkUpAmount) +
                            (singleProd1?.ColorStone_SettingCost ? singleProd1?.ColorStone_SettingCost : singleProd?.ColorStone_SettingCost) +
                            (singleProd1?.Diamond_SettingCost ? singleProd1?.Diamond_SettingCost : singleProd?.Diamond_SettingCost) +
                            (singleProd1?.Misc_SettingCost ? singleProd1?.Misc_SettingCost : singleProd?.Misc_SettingCost) !== 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    className="smr_Price_breakup_label"
                                    sx={{ fontFamily: "TT Commons Regular" }}
                                >
                                    Other{" "}
                                </Typography>
                                <span style={{ display: "flex" }}>
                                    <Typography>
                                        <span
                                            className="smr_currencyFont"
                                            sx={{ fontFamily: "TT Commons Regular" }}
                                        >
                                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        className="smr_PriceBreakup_Price"
                                        sx={{ fontFamily: "TT Commons Regular" }}
                                    >
                                        {formatter.format(
                                            (
                                                (singleProd1?.Other_Cost ? singleProd1?.Other_Cost : singleProd?.Other_Cost) +
                                                (singleProd1?.Size_MarkUp ? singleProd1?.Size_MarkUp : singleProd?.Size_MarkUp) +
                                                (singleProd1?.DesignMarkUpAmount ? singleProd1?.DesignMarkUpAmount : singleProd?.DesignMarkUpAmount) +
                                                (singleProd1?.ColorStone_SettingCost ? singleProd1?.ColorStone_SettingCost : singleProd?.ColorStone_SettingCost) +
                                                (singleProd1?.Diamond_SettingCost ? singleProd1?.Diamond_SettingCost : singleProd?.Diamond_SettingCost) +
                                                (singleProd1?.Misc_SettingCost ? singleProd1?.Misc_SettingCost : singleProd?.Misc_SettingCost)
                                            )?.toFixed(2)
                                        )}
                                    </Typography>
                                </span>
                            </div>
                        ) : null}
                    </AccordionDetails>
                </Accordion>
            )}
        </>
    );
};

export default ProductCustomization;