import { Box, Chip, useTheme, useMediaQuery, Skeleton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const chipBaseStyles = {
  fontSize: "15px",
  fontWeight: 500,
  color: "#444",
  backgroundColor: "#fafafa",
  borderRadius: 0,
  border: "1px solid #e5e5e5",
  px: 1,
  height: 26, // 👈 reduced height (premium feel)
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 0 0 0 rgba(0,0,0,0)",
};

const chipPrimaryStyles = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#fff",
  backgroundColor: "#cca182",
  borderRadius: 0,
  px: 1.2,
  height: 26,
  border: "1px solid #cca182",
  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#cca182",
    borderColor: "#cca182",
  },
};

// #0a1f47

const BreadCrumbBar = ({
  isFiltering,
  decodeURIComponent,
  productListData,
  IsBreadCumShow,
  BreadCumsObj,
  handleBreadcums,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // FIX 2026-04-29: usePathname() returns a plain string — it has NO .search or .pathname properties.
  // location.search on a string returns String.prototype.search (a function, truthy) → .charAt() crashes.
  // Use window.location.search for the query string and location (pathname) for path segments.
  const location = usePathname(); // plain pathname string, e.g. "/p/Rings/Gold/"
  const [windowSearch, setWindowSearch] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSearch(window.location.search); // e.g. "?M=abc123"
    }
  }, [location]); // refresh when pathname changes
  const navigate = useNextRouterLikeRR();
  // First char of query string after "?" — e.g. "?N=..." → 'N'
  const searchFirstChar = windowSearch.charAt(1);

  if (isFiltering) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          mt: 1,
          mb: 1,
        }}
      >
        {Array?.from(new Array(3)).map((_, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="rounded"
              width={isMobile ? 70 : 100}
              height={isMobile ? 24 : 28}
              sx={{
                borderRadius: 10,
                bgcolor: "#f2f2f2",
                animation: "wave",
              }}
            />
            {i < 2 && (
              <ChevronRightIcon
                sx={{
                  fontSize: 18,
                  color: "#c5c5c5",
                  mx: 0.3,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  }

  if (!productListData?.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.6,
        mt: 1,
        mb: 2,
      }}
    >
      <Chip
        label="Home"
        onClick={() => navigate.push("/")}
        size={isMobile ? "small" : "medium"}
        clickable
        sx={chipBaseStyles}
      />

      {/* Chevron */}
      <ChevronRightIcon
        sx={{
          fontSize: 18,
          color: "#bdbdbd",
        }}
      />

      {/* 🆕 New Arrival or S Path or Breadcrumbs Object */}
      {searchFirstChar === "N" && (
        <Chip
          label="New Arrival"
          size={isMobile ? "small" : "medium"}
          sx={chipPrimaryStyles}
        />
      )}
      {searchFirstChar === "A" && (
        <Chip
          label={location?.split("/")[2]?.replaceAll("%20", "")}
          size={isMobile ? "small" : "medium"}
          sx={chipPrimaryStyles}
        />
      )}
      {searchFirstChar === "S" && (
        <Chip
          label={decodeURIComponent(location?.split("/")[2])}
          size={isMobile ? "small" : "medium"}
          sx={chipBaseStyles}
        />
      )}
      {searchFirstChar === "T" && (
        <Chip
          label={"Trending"}
          size={isMobile ? "small" : "medium"}
          sx={chipBaseStyles}
        />
      )}
      {searchFirstChar === "B" && (
        <Chip
          label={"Best Seller"}
          size={isMobile ? "small" : "medium"}
          sx={chipBaseStyles}
        />
      )}

      {IsBreadCumShow && (
        <>
          {BreadCumsObj()?.menuname && (
            <>
              <Chip
                label={BreadCumsObj()?.menuname}
                onClick={() =>
                  handleBreadcums(
                    {
                      [BreadCumsObj()?.FilterKey]: BreadCumsObj()?.FilterVal,
                    },
                    BreadCumsObj()?.menuname?.toLowerCase() === "collection",
                  )
                }
                size={isMobile ? "small" : "medium"}
                clickable
                sx={chipPrimaryStyles}
              />

              {BreadCumsObj()?.FilterVal1 && (
                <>
                  <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
                  <Chip
                    label={BreadCumsObj()?.FilterVal1}
                    onClick={() =>
                      handleBreadcums({
                        [BreadCumsObj()?.FilterKey]: BreadCumsObj()?.FilterVal,
                        [BreadCumsObj()?.FilterKey1]:
                          BreadCumsObj()?.FilterVal1,
                      })
                    }
                    size={isMobile ? "small" : "medium"}
                    clickable
                    sx={chipPrimaryStyles}
                  />
                </>
              )}

              {BreadCumsObj()?.FilterVal2 && (
                <>
                  <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
                  <Chip
                    label={BreadCumsObj()?.FilterVal2}
                    onClick={() =>
                      handleBreadcums({
                        [BreadCumsObj()?.FilterKey]: BreadCumsObj()?.FilterVal,
                        [BreadCumsObj()?.FilterKey1]:
                          BreadCumsObj()?.FilterVal1,
                        [BreadCumsObj()?.FilterKey2]:
                          BreadCumsObj()?.FilterVal2,
                      })
                    }
                    size={isMobile ? "small" : "medium"}
                    clickable
                    sx={chipPrimaryStyles}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default BreadCrumbBar;
