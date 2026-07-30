import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MenuProps = {
  PaperProps: {
    elevation: 0,
    sx: {
      mt: 0.5,
      borderRadius: "8px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
      "& .MuiMenuItem-root": {
        fontSize: "14px",
        color: "#222",
        fontWeight: 400,
        py: 1,
        px: 2,
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: "#fff",
          color: "#000",
        },
        "&.Mui-selected": {
          backgroundColor: "#fff",
          color: "#000",
          fontWeight: 600,
        },
      },
    },
  },
  MenuListProps: {
    disablePadding: true,
  },
};

const ShopHeader = ({
  decodedSearchResult,
  isBelow768,
  isFiltering,
  filterCount = 0,
  onFilterToggle,
  storeinit,
  sortingSelect,
  handleSortby,
  handleChangeTrend,
  setIsOnlyProdLoading,
  metalType,
  selectedMetalId,
  setSelectedMetalId,
  diamondType,
  selectedDiaId,
  setSelectedDiaId,
  anyFilterApplied,
  handelFilterClearAll,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const decodedStr = Array.isArray(decodedSearchResult)
    ? decodedSearchResult.join(",").toLowerCase()
    : typeof decodedSearchResult === "string"
      ? decodedSearchResult.toLowerCase()
      : "";

  const hasCollection = decodedStr.includes("collection");
  const hasNewArrival = decodedStr.includes("newarrival");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "#000000",
            }}
          >
            SHOP
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.2px",
              color: "#000000",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {isFiltering ? (
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
            ) : (
              `[ ${filterCount} products ]`
            )}
          </Typography>
        </Box>

        {/* RIGHT SECTION */}
        {!isBelow768 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isFiltering ? (
              <Skeleton
                variant="rectangular"
                width={120}
                height={36}
                sx={{ bgcolor: "#e6e6e6", borderRadius: "4px" }}
              />
            ) : (
              <FormControl
                variant="filled"
                size="small"
                sx={{
                  minWidth: 120,
                  "& .MuiFilledInput-root": {
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    "&:before, &:after": { display: "none" },
                    "&:hover": { backgroundColor: "transparent" },
                    "&.Mui-focused": {
                      backgroundColor: "transparent",
                      border: "1px solid transparent",
                      color: "#000",
                    },
                  },
                }}
              >
                <Select
                  value={sortingSelect}
                  onChange={(e) => {
                    handleSortby(e);
                    handleChangeTrend(e);
                    setIsOnlyProdLoading(true);
                  }}
                  IconComponent={ExpandMoreIcon}
                  disableUnderline
                  sx={{
                    fontSize: "14px",
                    color: "#111",
                    "& .MuiSelect-icon": {
                      fontSize: "20px",
                      right: 8,
                      color: "#111",
                      top: 19,
                    },
                  }}
                  MenuProps={MenuProps}
                >
                  {hasCollection && (
                    <MenuItem value="design set">Design Set</MenuItem>
                  )}
                  <MenuItem value="Recommended">Recommended</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Trending">Trending</MenuItem>
                  <MenuItem value="Bestseller">Bestseller</MenuItem>
                  {hasNewArrival && (
                    <MenuItem value="design set">Design Set</MenuItem>
                  )}
                  {storeinit?.IsStockWebsite === 1 && (
                    <MenuItem value="In Stock">In Stock</MenuItem>
                  )}
                  <MenuItem value="PRICE LOW TO HIGH">
                    Price Low to High
                  </MenuItem>
                  <MenuItem value="PRICE HIGH TO LOW">
                    Price High to Low
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          mt: 1,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={onFilterToggle}
        >
          <svg
            className="icon icon-filter"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.8219 4.00098C13.8771 4.00098 13.9219 4.04575 13.9219 4.10098V5.90098C13.9219 5.95621 13.9667 6.00098 14.0219 6.00098H17.8219C17.8771 6.00098 17.9219 6.04575 17.9219 6.10098V6.90098C17.9219 6.95621 17.8771 7.00098 17.8219 7.00098H14.0219C13.9667 7.00098 13.9219 7.04575 13.9219 7.10098V8.90098C13.9219 8.9562 13.8771 9.00098 13.8219 9.00098H13.0219C12.9667 9.00098 12.9219 8.95621 12.9219 8.90098V4.10098C12.9219 4.04575 12.9667 4.00098 13.0219 4.00098H13.8219ZM10.9219 6.10098C10.9219 6.04575 10.8771 6.00098 10.8219 6.00098H3.02187C2.96664 6.00098 2.92188 6.04575 2.92188 6.10098V6.90098C2.92188 6.95621 2.96664 7.00098 3.02187 7.00098H10.8219C10.8771 7.00098 10.9219 6.95621 10.9219 6.90098V6.10098ZM17.8219 12.501C17.8771 12.501 17.9219 12.5457 17.9219 12.601V13.401C17.9219 13.4562 17.8771 13.501 17.8219 13.501H10.0219C9.96665 13.501 9.92188 13.4562 9.92188 13.401V12.601C9.92188 12.5457 9.96665 12.501 10.0219 12.501H17.8219ZM7.82188 16.001C7.87711 16.001 7.92188 15.9562 7.92188 15.901V10.101C7.92188 10.0457 7.87711 10.001 7.82188 10.001H7.02187C6.96664 10.001 6.92188 10.0457 6.92188 10.101V12.401C6.92188 12.4562 6.8771 12.501 6.82188 12.501H3.02187C2.96664 12.501 2.92188 12.5457 2.92188 12.601V13.401C2.92188 13.4562 2.96664 13.501 3.02187 13.501H6.82188C6.8771 13.501 6.92188 13.5457 6.92188 13.601V15.901C6.92188 15.9562 6.96664 16.001 7.02187 16.001H7.82188Z"
              fill="#1D1C1C"
            ></path>
          </svg>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 400,
              color: "#121212",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
                textDecorationColor: "#d1d1d1",
                textDecorationThickness: "1px",
                textUnderlineOffset: "3px",
              },
            }}
          >
            Filter
          </Typography>
        </Typography>

        {anyFilterApplied && (
          <Box
            onClick={handelFilterClearAll}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              ml: 2,
              cursor: "pointer",
              color: "#777",
              "&:hover": { color: "#000" },
              transition: "color 0.2s ease",
            }}
          >
            <Box
              sx={{ width: "1px", height: "14px", bgcolor: "#ddd", mr: 1.5 }}
            />
            <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
              Remove all
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ShopHeader;
