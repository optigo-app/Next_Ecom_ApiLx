"use client";

import React, { useMemo } from "react";
import { Box, Chip, useTheme, useMediaQuery, Skeleton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname, useSearchParams } from "next/navigation";
import { BreadCumsObj, handleBreadcums } from "@/app/(core)/utils/product/productListingHelpers";

const chipBaseStyles = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#444",
  backgroundColor: "#fafafa",
  borderRadius: 15,
  border: "1px solid #e5e5e5",
  px: 1,
  height: 26,
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 0 0 0 rgba(0,0,0,0)",
};

const chipPrimaryStyles = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#fff",
  backgroundColor: "#0a1f47",
  borderRadius: 15,
  px: 1.2,
  height: 26,
  border: "1px solid #0a1f47",
  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#0a1f47",
    borderColor: "#0a1f47",
  },
};

const BreadCrumbBar = ({
  isFiltering,
  productListData,
  IsBreadCumShow = true,
  BreadCumsObj: customBreadCumsObj,
  handleBreadcums: customHandleBreadcums,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = usePathname();
  const searchParams = useSearchParams();
  const navigate = useNextRouterLikeRR();

  const searchStr = searchParams?.toString()
    ? `?${searchParams.toString()}`
    : typeof window !== "undefined"
    ? window.location.search
    : "";

  const searchFirstChar = searchStr.startsWith("?") ? searchStr.charAt(1) : "";

  const breadcrumb = useMemo(() => {
    if (typeof customBreadCumsObj === "function") {
      try {
        const obj = customBreadCumsObj(location);
        if (obj && (obj.menuname || obj.FilterVal)) return obj;
      } catch (_) {}
    }
    return BreadCumsObj(location);
  }, [customBreadCumsObj, location, searchStr]);

  const onBreadcrumbClick = customHandleBreadcums || ((mparams, isCol) =>
    handleBreadcums({ mparams, isCollectionMenu: isCol, navigate, location })
  );

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
        {Array.from(new Array(3)).map((_, i) => (
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
      {/* Home Chip */}
      <Chip
        label="Home"
        onClick={() => navigate.push("/")}
        size={isMobile ? "small" : "medium"}
        clickable
        sx={chipBaseStyles}
      />

      {/* Special Query Views */}
      {searchFirstChar === "N" && (
        <>
          <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
          <Chip
            label="New Arrival"
            size={isMobile ? "small" : "medium"}
            sx={chipPrimaryStyles}
          />
        </>
      )}

      {searchFirstChar === "A" && (
        <>
          <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
          <Chip
            label={decodeURIComponent(location?.split("/")[2] || "").replaceAll("%20", " ")}
            size={isMobile ? "small" : "medium"}
            sx={chipPrimaryStyles}
          />
        </>
      )}

      {searchFirstChar === "S" && (
        <>
          <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
          <Chip
            label={decodeURIComponent(location?.split("/")[2] || "")}
            size={isMobile ? "small" : "medium"}
            sx={chipBaseStyles}
          />
        </>
      )}

      {searchFirstChar === "T" && (
        <>
          <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
          <Chip
            label="Trending"
            size={isMobile ? "small" : "medium"}
            sx={chipPrimaryStyles}
          />
        </>
      )}

      {searchFirstChar === "B" && (
        <>
          <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
          <Chip
            label="Best Seller"
            size={isMobile ? "small" : "medium"}
            sx={chipPrimaryStyles}
          />
        </>
      )}

      {/* Category / Menu Hierarchy Navigation */}
      {searchFirstChar !== "N" &&
        searchFirstChar !== "A" &&
        searchFirstChar !== "S" &&
        searchFirstChar !== "T" &&
        searchFirstChar !== "B" &&
        breadcrumb?.menuname && (
          <>
            <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
            <Chip
              label={breadcrumb.menuname}
              onClick={() =>
                onBreadcrumbClick(
                  {
                    [breadcrumb.FilterKey || "Category"]: breadcrumb.FilterVal || breadcrumb.menuname,
                  },
                  breadcrumb.menuname?.toLowerCase() === "collection"
                )
              }
              size={isMobile ? "small" : "medium"}
              clickable
              sx={chipPrimaryStyles}
            />

            {breadcrumb.FilterVal1 && (
              <>
                <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
                <Chip
                  label={breadcrumb.FilterVal1}
                  onClick={() =>
                    onBreadcrumbClick({
                      [breadcrumb.FilterKey || "Category"]: breadcrumb.FilterVal || breadcrumb.menuname,
                      [breadcrumb.FilterKey1 || "SubCategory"]: breadcrumb.FilterVal1,
                    })
                  }
                  size={isMobile ? "small" : "medium"}
                  clickable
                  sx={chipPrimaryStyles}
                />
              </>
            )}

            {breadcrumb.FilterVal2 && (
              <>
                <ChevronRightIcon sx={{ fontSize: 18, color: "#bdbdbd" }} />
                <Chip
                  label={breadcrumb.FilterVal2}
                  onClick={() =>
                    onBreadcrumbClick({
                      [breadcrumb.FilterKey || "Category"]: breadcrumb.FilterVal || breadcrumb.menuname,
                      [breadcrumb.FilterKey1 || "SubCategory"]: breadcrumb.FilterVal1,
                      [breadcrumb.FilterKey2 || "Collection"]: breadcrumb.FilterVal2,
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
    </Box>
  );
};

export default BreadCrumbBar;
