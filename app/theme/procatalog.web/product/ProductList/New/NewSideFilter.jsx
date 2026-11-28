import { isPriceHidden } from "@/app/(core)/utils/storeFlags";
import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
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
import { TfiClose } from "react-icons/tfi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCurrency } from "@/app/(core)/hooks/useCurrency";

const VISIBLE_FILTER_OPTIONS = 5;

const FilterCard = ({ title, children }) => (
    <Box
        sx={{
            bgcolor: "#fff",
            border: "1px solid #efefef",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            px: 1.5,
            py: 1.25,
            mb: 1.5,
        }}
    >
        <Typography
            sx={{
                fontWeight: 600,
                fontSize: "12.5px",
                color: "#111",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                mb: 0.75,
            }}
        >
            {title}
        </Typography>
        {children}
    </Box>
);

const ViewMoreToggle = ({ expanded, onToggle }) => (
    <Typography
        component="button"
        type="button"
        onClick={onToggle}
        sx={{
            background: "none",
            border: "none",
            p: 0,
            mt: 0.5,
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "#b26605",
            letterSpacing: "0.3px",
            fontFamily: "inherit",
            "&:hover": { textDecoration: "underline" },
        }}
    >
        {expanded ? "View Less" : "View More"}
    </Typography>
);


const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginRight: "0px",
    marginLeft: "0px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#222222",
    paddingBlock: "3px",
    flexDirection: "row",
    paddingLeft: "0px",
    width: "100%",
}));

const formatFilterTitle = (str) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

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
    storeInit: storeInitProp,
    storeinit: storeinitProp,
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
    sliderValue3,
    setSliderValue3,
    handleRangeFilterApi3,
    show3,
    setShow3,
    appliedRange4,
    setAppliedRange4,
    show2,
    setShow2,
    appliedRange3,
    setAppliedRange3,
    PriceRangeInputs,
    RangeFilterView1,
    RangeFilterView2,
    RangeFilterView3,
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
    isBelow768,
    isInline = false,
}) => {
  const { format: formatCurrency, symbol: currencySymbol } = useCurrency();
    const storeInit = storeInitProp || storeinitProp;
    const [expandedFilters, setExpandedFilters] = React.useState({});
    const toggleFilter = (key) =>
        setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    return (
        <>
        <Box sx={isInline ? { display: "flex", flexDirection: "column", height: "100%" } : {}}>
            {!isInline && (
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
            )}

            {/* FILTER SECTIONS */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    pb: 3,
                    "&::-webkit-scrollbar": { width: "4px" },
                    "&::-webkit-scrollbar-thumb": { background: "#d5d5d5", borderRadius: "4px" },
                    paddingTop: 1.5,
                    pl: 1.25,
                    pr: 0.75,
                    bgcolor: "#f7f7f7",
                }}
            >
                {filterData?.map((item, index) => {
                    // 💡 Category, collection, brand, etc.
                    if (!item?.id?.includes("Range") && !item?.id?.includes("Price")) {
                        let parsedOpts = [];
                        try {
                            parsedOpts = JSON.parse(item?.options) ?? [];
                        } catch (_) {}
                        if (!Array.isArray(parsedOpts) || parsedOpts.length === 0) {
                            return null;
                        }

                        const isExpanded = !!expandedFilters[item?.id];
                        const visibleOpts = isExpanded ? parsedOpts : parsedOpts.slice(0, VISIBLE_FILTER_OPTIONS);

                        return (
                            <FilterCard key={index} title={formatFilterTitle(item?.Fil_DisName)}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.4,
                                        maxHeight: isExpanded ? "340px" : "none",
                                        overflowY: isExpanded ? "auto" : "visible",
                                        "&::-webkit-scrollbar": { width: "5px" },
                                        "&::-webkit-scrollbar-thumb": {
                                            background: "#d9d9d9",
                                            borderRadius: "4px",
                                        },
                                    }}
                                >
                                    {visibleOpts.map((opt) => (
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
                                </Box>
                                {parsedOpts.length > VISIBLE_FILTER_OPTIONS && (
                                    <ViewMoreToggle
                                        expanded={isExpanded}
                                        onToggle={() => toggleFilter(item?.id)}
                                    />
                                )}
                            </FilterCard>
                        );
                    }

                    // 💰 Price filter
                    if (!isPriceHidden(storeInit) && (item?.id?.includes("Price") || item?.id?.toLowerCase() === "price" || item?.Name === "Price")) {
                        return (
                            <FilterCard key={index} title={formatFilterTitle(item?.Fil_DisName)}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.6,
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
                                                                currencySymbol ?? loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                            )} ${formatCurrency(opt?.Maxval)}`
                                                            : opt?.Maxval == 0
                                                                ? `Over ${decodeEntities(
                                                                    currencySymbol ?? loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                                )} ${formatCurrency(opt?.Minval)}`
                                                                : `${decodeEntities(
                                                                    currencySymbol ?? loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                                )} ${formatCurrency(opt?.Minval)} - ${decodeEntities(
                                                                    currencySymbol ?? loginCurrency?.CurrencyCode ?? storeInit?.CurrencyCode
                                                                )} ${formatCurrency(opt?.Maxval)}`
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
                                </Box>
                            </FilterCard>
                        );
                    }

                    // 💎 Range-type filters (Diamond, NetWt, Gross)
                    if (item?.Name?.includes("Diamond"))
                        return (
                            <FilterCard key={index} title={formatFilterTitle(item?.Fil_DisName)}>
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
                            </FilterCard>
                        );

                    if (item?.Name?.includes("Wastage"))
                        return (
                            <FilterCard key={index} title={formatFilterTitle(item?.Fil_DisName)}>
                                <RangeFilterView3
                                    ele={item}
                                    sliderValue3={sliderValue3}
                                    setSliderValue3={setSliderValue3}
                                    handleRangeFilterApi3={handleRangeFilterApi3}
                                    prodListType={prodListType}
                                    cookie={cookie}
                                    show3={show3}
                                    setShow3={setShow3}
                                    appliedRange4={appliedRange4}
                                    setAppliedRange4={setAppliedRange4}
                                />
                            </FilterCard>
                        );

                    if (item?.Name?.includes("Gross"))
                        return (
                            <FilterCard key={index} title={formatFilterTitle(item?.Fil_DisName)}>
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
                            </FilterCard>
                        );

                    if (item?.Name?.includes("NetWt"))
                        return (
                            <FilterCard key={index} title={formatFilterTitle(item?.Fil_DisName)}>
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
                            </FilterCard>
                        );



                    return null;
                })}
                {isBelow768 && <Box>
                    <FilterCard title="Sorting">
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
                    </FilterCard>

                    {/* 💍 METAL CUSTOMIZATION */}
                    {storeInit?.IsMetalCustomization === 1 && (
                        <FilterCard title="Metal">
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
                        </FilterCard>
                    )}

                    {/* 💎 DIAMOND CUSTOMIZATION */}
                    {storeInit?.IsDiamondCustomization === 1 && (
                        <FilterCard title="Diamond">
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
                        </FilterCard>
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
                    gap: 1.5,
                    px: 2.5,
                    py: 2,
                    borderTop: "1px solid #eee",
                    bgcolor: "#fff",
                }}
            >
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#333",
                        borderColor: "#e0e0e0",
                        borderRadius: 0,
                        py: 1.2,
                        "&:hover": { borderColor: "#bbb", bgcolor: "#fafafa" },
                    }}
                    onClick={() => {
                        handelFilterClearAll();
                        onClose();
                    }}
                >
                    Remove all
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        textTransform: "none",
                        bgcolor: "#fff",
                        color: "#111",
                        border: "1px solid #111",
                        borderRadius: 0,
                        fontSize: "14px",
                        py: 1.2,
                        fontWeight: 500,
                        "&:hover": { bgcolor: "#111", color: "#fff", border: "1px solid #111" },
                    }}
                    onClick={() => onClose()}
                >
                    Apply
                </Button>
            </Box>
        </Box>
        </>
    );
};

export default FilterSidebar;
