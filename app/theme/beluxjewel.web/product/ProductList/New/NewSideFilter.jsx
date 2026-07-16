import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    Button,
    Divider,
    FormControlLabel,
    styled,
    Skeleton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { TfiClose } from "react-icons/tfi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginRight: "20px",
    fontSize: "16px",
    color: "rgb(127, 125, 133)",
    paddingBlock: "5px",
    flexDirection: "row",
    paddingLeft: '20px',
}));

const MenuProps = {
    PaperProps: {
        elevation: 0,
        sx: {
            mt: 0.5,
            borderRadius: "8px",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            "& .MuiMenuItem-root": {
                fontSize: "14px",
                color: "#222",
                fontWeight: 400,
                py: 1,
                px: 2,
                borderRadius: "4px",
                "&:hover": {
                    backgroundColor: "#f4f7ff",
                    color: "#b26605",
                },
                "&.Mui-selected": {
                    backgroundColor: "#f1f4fb",
                    color: "#b26605",
                    fontWeight: 600,
                },
            },
        },
    },
    MenuListProps: {
        disablePadding: true,
    },
};



const FilterSidebar = ({
    open,
    onClose,
    filterCount,
    handelFilterClearAll,
    filterData,
    storeInit,
    loginCurrency,
    formatter,
    decodeEntities,
    filterChecked,
    handleCheckboxChange,
    setIsOnlyProdLoading,
    priceRangeValue,
    setPriceRangeValue,
    lowestPrice,
    highestPrice,
    setLowestPrice,
    setHighestPrice,
    setProductListData,
    setAfterFilterCount,
    selectedMetalId,
    selectedDiaId,
    selectedCsId,
    prodListType,
    cookie,
    isReset,
    setIsReset,
    sliderValue,
    setSliderValue,
    handleRangeFilterApi,
    show,
    setShow,
    appliedRange1,
    setAppliedRange1,
    sliderValue1,
    setSliderValue1,
    handleRangeFilterApi1,
    show1,
    setShow1,
    appliedRange2,
    setAppliedRange2,
    sliderValue2,
    setSliderValue2,
    handleRangeFilterApi2,
    show2,
    setShow2,
    appliedRange3,
    setAppliedRange3,
    PriceRangeInputs,
    RangeFilterView1,
    RangeFilterView2,
    RangeFilterView,
    CustomLabel,
    isFiltering,

    sortingSelect,
    handleSortby,
    handleChangeTrend,
    metalType,
    setSelectedMetalId,
    diamondType,
    setSelectedDiaId,
    isBelow768
}) => {
    return (
        <>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.5,
                    borderBottom: "1px solid #e5e5e5",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: "#7b7b7b",
                        "&:hover": { background: "transparent" },
                    }}
                >
                    <TfiClose fontSize={22} />
                </IconButton>

                <Typography
                    variant="subtitle1"
                    sx={{
                        flex: 1,
                        fontSize: "0.92rem",
                        fontWeight: 400,
                        letterSpacing: "0.5px",
                        color: "#111",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: 'column'
                    }}
                >
                    FILTER{" "}
                    <Typography
                        component="span"
                        sx={{
                            color: "#7b7b7b",
                            fontSize: "0.88rem",
                            fontWeight: 300,
                            display: "block",
                            mt: 0.5,
                            minHeight: "1rem",
                        }}
                    >
                        {!isFiltering ? (
                            `${filterCount} products`
                        ) : (
                            <Skeleton
                                variant="text"
                                width={80}
                                height={18}
                                sx={{
                                    bgcolor: "#e6e6e6",
                                    borderRadius: "2px",
                                    transform: "scale(1, 0.85)",
                                }}
                            />
                        )}
                    </Typography>
                </Typography>

                <IconButton sx={{ visibility: "hidden" }} />
            </Box>

            {/* FILTER SECTIONS */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pb: 3,
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: "3px" },
                    paddingTop: 3,
                    px: 2.5,
                }}
            >
                {filterData?.map((item, index) => {
                    // 💡 Category, color, etc.
                    if (!item?.id?.includes("Range") && !item?.id?.includes("Price")) {
                        return (
                            <Accordion key={index} disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
                                <AccordionSummary
                                    expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        "& .MuiAccordionSummary-content": { margin: 0 },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                        {item?.Fil_DisName}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails
                                    sx={{
                                        px: 0,
                                        py: 0.5,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.4,
                                        maxHeight: "340px",
                                        overflowY: "auto",
                                        "&::-webkit-scrollbar": { width: "5px" },
                                        "&::-webkit-scrollbar-thumb": {
                                            background: "#d9d9d9",
                                            borderRadius: "4px",
                                        },
                                    }}
                                >
                                    {(JSON.parse(item?.options) ?? []).map((opt) => (
                                        <CustomFormControlLabel
                                            key={opt?.id}
                                            sx={{
                                                py: 0.3,
                                                borderRadius: "4px",
                                                transition: "background 0.2s ease",
                                                "&:hover": {
                                                    backgroundColor: "#fafafa",
                                                },
                                            }}
                                            control={
                                                <Checkbox
                                                    name={`${item?.id}${opt?.id}`}
                                                    checked={!!filterChecked[`${item?.id}${opt?.id}`]?.checked}
                                                    onClick={(e) => {
                                                        handleCheckboxChange(e, item?.id, opt?.Name);
                                                        setIsOnlyProdLoading(true);
                                                    }}
                                                    size="small"
                                                    sx={{
                                                        color: "#bbb",
                                                        "&.Mui-checked": { color: "#111" },
                                                        p: 0.6,
                                                        mr: 1,
                                                    }}
                                                />
                                            }
                                            label={
                                                <CustomLabel
                                                    text={opt?.Name}
                                                    sx={{
                                                        fontSize: "16px",
                                                        color: "#333",
                                                        fontWeight: 400,
                                                        letterSpacing: "0.2px",
                                                    }}
                                                />
                                            }
                                        />
                                    ))}
                                </AccordionDetails>

                            </Accordion>
                        );
                    }

                    // 💰 Price filter
                    if (storeInit?.IsPriceShow == 1 && item?.id?.includes("Price")) {
                        return (
                            <Accordion key={index} disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
                                <AccordionSummary
                                    expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        "& .MuiAccordionSummary-content": { margin: 0 },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                        {item?.Fil_DisName}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        px: 0,
                                        py: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.6,
                                        maxHeight: "340px",
                                        overflowY: "auto",
                                        "&::-webkit-scrollbar": { width: "5px" },
                                        "&::-webkit-scrollbar-thumb": {
                                            background: "#d9d9d9",
                                            borderRadius: "4px",
                                        },
                                    }}
                                >
                                    {/* PRICE OPTIONS */}
                                    {(JSON.parse(item?.options) ?? []).map((opt, i) => (
                                        <CustomFormControlLabel
                                            key={i}
                                            sx={{
                                                m: 0,
                                                px: 1.5,
                                                py: 0.3,
                                                "&:hover": {
                                                    backgroundColor: "#fafafa",
                                                },
                                            }}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    name={`Price${i}${i}`}
                                                    checked={!!filterChecked[`Price${i}${i}`]?.checked}
                                                    onClick={(e) => {
                                                        handleCheckboxChange(e, item?.id, opt);
                                                        setIsOnlyProdLoading(true);
                                                    }}
                                                    sx={{
                                                        color: "#bbb",
                                                        "&.Mui-checked": { color: "#111" },
                                                        p: 0.6,
                                                        mr: 1,
                                                    }}
                                                />
                                            }
                                            label={
                                                <CustomLabel
                                                    text={
                                                        opt?.Minval == 0
                                                            ? `Under ${decodeEntities(
                                                                loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                            )} ${formatter(opt?.Maxval)}`
                                                            : opt?.Maxval == 0
                                                                ? `Over ${decodeEntities(
                                                                    loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                                )} ${formatter(opt?.Minval)}`
                                                                : `${decodeEntities(
                                                                    loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                                )} ${formatter(opt?.Minval)} - ${decodeEntities(
                                                                    loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                                )} ${formatter(opt?.Maxval)}`
                                                    }
                                                />
                                            }
                                        />
                                    ))}

                                    {/* Divider + OR text */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 1.5,
                                            my: 1.5,
                                        }}
                                    >
                                        <Divider sx={{ flex: 1, borderColor: "#e0e0e0" }} />
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                color: "#999",
                                                fontWeight: 400,
                                                letterSpacing: "0.4px",
                                            }}
                                        >
                                            OR
                                        </Typography>
                                        <Divider sx={{ flex: 1, borderColor: "#e0e0e0" }} />
                                    </Box>

                                    {/* PRICE RANGE INPUTS */}
                                    <Box
                                        sx={{
                                            px: 1.5,
                                            py: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1,
                                        }}
                                    >
                                        <PriceRangeInputs
                                            priceValue={priceRangeValue}
                                            setpriceValue={setPriceRangeValue}
                                            lowestPrice={lowestPrice}
                                            highestPrice={highestPrice}
                                            setLowestPrice={setLowestPrice}
                                            setHighestPrice={setHighestPrice}
                                            setProductListData={setProductListData}
                                            setAfterFilterCount={setAfterFilterCount}
                                            setPriceRangeValue={setPriceRangeValue}
                                            setIsOnlyProdLoading={setIsOnlyProdLoading}
                                            selectedMetalId={selectedMetalId}
                                            selectedDiaId={selectedDiaId}
                                            selectedCsId={selectedCsId}
                                            prodListType={prodListType}
                                            cookie={cookie}
                                            filterChecked={filterChecked}
                                            isReset={isReset}
                                            setIsReset={setIsReset}
                                        />
                                    </Box>
                                </AccordionDetails>

                            </Accordion>
                        );
                    }

                    // 💎 Range-type filters (Diamond, NetWt, Gross)
                    if (item?.Name?.includes("Diamond"))
                        return (
                            <Accordion key={index} disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
                                <AccordionSummary
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        "& .MuiAccordionSummary-content": { margin: 0 },
                                    }}
                                    expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111", }} />}>
                                    <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                        {item?.Fil_DisName}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                    <RangeFilterView
                                        ele={item}
                                        sliderValue={sliderValue}
                                        setSliderValue={setSliderValue}
                                        handleRangeFilterApi={handleRangeFilterApi}
                                        prodListType={prodListType}
                                        cookie={cookie}
                                        show={show}
                                        setShow={setShow}
                                        appliedRange1={appliedRange1}
                                        setAppliedRange1={setAppliedRange1}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        );

                    if (item?.Name?.includes("Gross"))
                        return (
                            <Accordion key={index} disableGutters elevation={0}>
                                <AccordionSummary
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        "& .MuiAccordionSummary-content": { margin: 0 },
                                    }}
                                    expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}>
                                    <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                        {item?.Fil_DisName}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                    <RangeFilterView2
                                        ele={item}
                                        sliderValue2={sliderValue2}
                                        setSliderValue2={setSliderValue2}
                                        handleRangeFilterApi2={handleRangeFilterApi2}
                                        prodListType={prodListType}
                                        cookie={cookie}
                                        show2={show2}
                                        setShow2={setShow2}
                                        appliedRange3={appliedRange3}
                                        setAppliedRange3={setAppliedRange3}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        );

                    if (item?.Name?.includes("NetWt"))
                        return (
                            <Accordion key={index} disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
                                <AccordionSummary
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        "& .MuiAccordionSummary-content": { margin: 0 },
                                    }}
                                    expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}>
                                    <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                        {item?.Fil_DisName}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                    <RangeFilterView1
                                        ele={item}
                                        sliderValue1={sliderValue1}
                                        setSliderValue1={setSliderValue1}
                                        handleRangeFilterApi1={handleRangeFilterApi1}
                                        prodListType={prodListType}
                                        cookie={cookie}
                                        show1={show1}
                                        setShow1={setShow1}
                                        appliedRange2={appliedRange2}
                                        setAppliedRange2={setAppliedRange2}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        );



                    return null;
                })}
                {isBelow768 && <Box>
                    <Accordion disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
                        <AccordionSummary
                            expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}
                            sx={{
                                px: 0,
                                py: 2,
                                "& .MuiAccordionSummary-content": { margin: 0 },
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                Sorting
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                px: 0,
                                py: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                            }}
                        >
                            <FormControl
                                variant="filled"
                                size="small"
                                sx={{
                                    "& .MuiFilledInput-root": {
                                        backgroundColor: "#f8f8f8",
                                        borderRadius: "8px",
                                        "&:before, &:after": { display: "none" },
                                        "&:hover": { backgroundColor: "#f2f2f2" },
                                        "&.Mui-focused": {
                                            backgroundColor: "#fff",
                                            border: "1px solid #e2e2e2",
                                            color: "#b26605",
                                        },
                                    },
                                }}
                            >
                                <InputLabel>Sorting</InputLabel>
                                <Select
                                    value={sortingSelect}
                                    onChange={(e) => {
                                        handleSortby(e);
                                        handleChangeTrend(e);
                                        setIsOnlyProdLoading(true);
                                    }}
                                    IconComponent={ExpandMoreIcon}
                                    disableUnderline
                                    MenuProps={MenuProps}
                                    sx={{ fontSize: "14px", color: "#111" }}
                                >
                                    <MenuItem value="Recommended">
                                        Recommended
                                    </MenuItem>
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Trending">Trending</MenuItem>
                                    <MenuItem value="Bestseller">Bestseller</MenuItem>
                                    {storeInit?.IsStockWebsite === 1 && (
                                        <MenuItem value="In Stock">In Stock</MenuItem>
                                    )}
                                    <MenuItem value="PRICE LOW TO HIGH">Price Low to High</MenuItem>
                                    <MenuItem value="PRICE HIGH TO LOW">Price High to Low</MenuItem>
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    {/* 💍 METAL CUSTOMIZATION */}
                    {storeInit?.IsMetalCustomization === 1 && (
                        <Accordion disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
                            <AccordionSummary
                                expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}
                                sx={{
                                    px: 0,
                                    py: 2,
                                    "& .MuiAccordionSummary-content": { margin: 0 },
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                    Metal
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    px: 0,
                                    py: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <FormControl
                                    variant="filled"
                                    size="small"
                                    sx={{
                                        "& .MuiFilledInput-root": {
                                            backgroundColor: "#f8f8f8",
                                            borderRadius: "8px",
                                            "&:before, &:after": { display: "none" },
                                            "&:hover": { backgroundColor: "#f2f2f2" },
                                            "&.Mui-focused": {
                                                backgroundColor: "#fff",
                                                border: "1px solid #e2e2e2",
                                                color: "#b26605",
                                            },
                                        },
                                    }}
                                >
                                    <InputLabel>Select Metal</InputLabel>
                                    <Select
                                        value={selectedMetalId}
                                        onChange={(e) => {
                                            setSelectedMetalId(e.target.value);
                                            setIsOnlyProdLoading(true);
                                        }}
                                        IconComponent={ExpandMoreIcon}
                                        disableUnderline
                                        MenuProps={MenuProps}
                                        sx={{ fontSize: "14px", color: "#111" }}
                                    >
                                        {metalType?.map((item, index) => (
                                            <MenuItem key={index} value={item?.Metalid}>
                                                {item?.metaltype}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {/* 💎 DIAMOND CUSTOMIZATION */}
                    {storeInit?.IsDiamondCustomization === 1 && (
                        <Accordion disableGutters elevation={0} >
                            <AccordionSummary
                                expandIcon={<AddRoundedIcon sx={{ fontSize: 20, color: "#111" }} />}
                                sx={{
                                    px: 0,
                                    py: 2,
                                    "& .MuiAccordionSummary-content": { margin: 0 },
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                                    Diamond
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    px: 0,
                                    py: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <FormControl
                                    variant="filled"
                                    size="small"
                                    sx={{
                                        "& .MuiFilledInput-root": {
                                            backgroundColor: "#f8f8f8",
                                            borderRadius: "8px",
                                            "&:before, &:after": { display: "none" },
                                            "&:hover": { backgroundColor: "#f2f2f2" },
                                            "&.Mui-focused": {
                                                backgroundColor: "#fff",
                                                border: "1px solid #e2e2e2",
                                                color: "#b26605",
                                            },
                                        },
                                    }}
                                >
                                    <InputLabel>Select Diamond</InputLabel>
                                    <Select
                                        value={selectedDiaId}
                                        onChange={(e) => {
                                            setSelectedDiaId(e.target.value);
                                            setIsOnlyProdLoading(true);
                                        }}
                                        IconComponent={ExpandMoreIcon}
                                        disableUnderline
                                        MenuProps={MenuProps}
                                        sx={{ fontSize: "14px", color: "#111" }}
                                    >
                                        {diamondType?.map((item, index) => (
                                            <MenuItem key={index} value={`${item?.QualityId},${item?.ColorId}`}>
                                                {`${item.Quality}#${item?.color}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Box>
                }
            </Box>

            {/* FOOTER */}
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2.5,
                    py: 2,
                    borderTop: "1px solid #eee",
                    bgcolor: "#fff",
                }}
            >
                <Button
                    fullWidth
                    sx={{
                        textTransform: "none",
                        fontSize: "18px",
                        fontWeight: 400,
                        color: "#121212d9",
                        textDecoration: "underline",
                        "&:hover": { textDecoration: "underline", background: "transparent" },
                    }}
                    onClick={() => {
                        handelFilterClearAll()
                        onClose()
                    }}
                >
                    Remove all
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        bgcolor: "transparent",
                        color: "#121212d9",
                        border: "1px solid #111",
                        borderRadius: 0,
                        fontSize: "0.875rem",
                        py: 1.5,
                        fontWeight: 500,
                        "&:hover": { bgcolor: "transparent" },
                    }}
                    onClick={() => onClose()}
                >
                    Apply
                </Button>
            </Box>
        </>
    );
};

export default FilterSidebar;
