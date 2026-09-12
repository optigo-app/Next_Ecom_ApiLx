"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Skeleton, useTheme, useMediaQuery } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const breadcrumbLinkStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#555",
  cursor: "pointer",
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": {
    color: "#0a1f47",
    textDecoration: "underline",
  },
};

const breadcrumbActiveStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#0a1f47",
};

const DetailBreadcrumb = ({
  searchParams,
  singleProd,
  singleProd1,
  loadingdata = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNextRouterLikeRR();
  const pathname = usePathname();
  const [windowSearch, setWindowSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSearch(window.location.search);
    }
  }, [pathname]);

  const product = singleProd1 && Object.keys(singleProd1).length > 0 ? singleProd1 : singleProd;
  const designNo = product?.designno || "";
  const titleLine = product?.TitleLine || "";
  const productLabel = designNo || (formatTitleLine(titleLine) ? titleLine : "Product Detail");

  // Parse menu decode parameters if present in searchParams / window.location.search
  const decodedMenuData = useMemo(() => {
    try {
      const decodedArray = ParseAndDecodeSearchParams(searchParams) || [];
      const menuEntry = decodedArray.find((item) => item.startsWith("M="));
      if (!menuEntry) return null;

      const navVal = menuEntry.split("=")[1];
      if (!navVal) return null;

      const rawDecoded = atob(navVal.replace(/ /g, "+"));
      if (!rawDecoded || !rawDecoded.includes("/")) return null;

      const parts = rawDecoded.split("/");
      const valArr = parts[0]?.split(",") || [];
      const keyArr = parts[1]?.split(",") || [];

      // Extract menu name from current pathname or first key/val
      let menuname = "product";
      if (pathname && pathname.startsWith("/p/")) {
        menuname = decodeURIComponent(pathname.split("/")[2] || "product");
      }

      return {
        menuname,
        valArr,
        keyArr,
        rawDecoded,
      };
    } catch (err) {
      return null;
    }
  }, [searchParams, pathname]);

  // Handle navigate back to filter list
  const handleBreadcrumbClick = (filterIndex, menuname) => {
    if (!decodedMenuData) return;
    const { keyArr, valArr } = decodedMenuData;

    let KeyObj = {};
    let ValObj = {};

    for (let i = 0; i <= filterIndex; i++) {
      if (keyArr[i] && valArr[i]) {
        let keyName = `FilterKey${i === 0 ? "" : i}`;
        let valName = `FilterVal${i === 0 ? "" : i}`;
        KeyObj[keyName] = keyArr[i];
        ValObj[valName] = valArr[i];
      }
    }

    let finalData = { ...KeyObj, ...ValObj };

    const queryParameters1 = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join("/");

    const queryParameters = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join(",");

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => value)
      .filter(Boolean)
      .join(",");

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const targetMenu = menuname || decodedMenuData.menuname || "product";
    const url = `/p/${targetMenu}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

    navigate.push(url);
  };

  if (loadingdata) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1.5 }}>
        <Skeleton variant="text" width={50} height={20} />
        <ChevronRightIcon sx={{ fontSize: 16, color: "#ccc" }} />
        <Skeleton variant="text" width={80} height={20} />
        <ChevronRightIcon sx={{ fontSize: 16, color: "#ccc" }} />
        <Skeleton variant="text" width={100} height={20} />
      </Box>
    );
  }

  // Check special search parameters
  const firstChar = windowSearch?.charAt(1) || "";
  const categoryFallback = product?.Categoryname || product?.category || product?.collection || "";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.5,
        mt: 1,
        mb: 2,
        px: { xs: 0, sm: 0 },
      }}
    >
      {/* Home Link */}
      <Typography
        component="span"
        sx={breadcrumbLinkStyle}
        onClick={() => navigate.push("/")}
      >
        Home
      </Typography>

      <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />

      {/* Dynamic decoded menu parameters */}
      {decodedMenuData ? (
        <>
          {decodedMenuData.menuname && (
            <>
              <Typography
                component="span"
                sx={breadcrumbLinkStyle}
                onClick={() => handleBreadcrumbClick(0, decodedMenuData.menuname)}
              >
                {decodedMenuData.menuname}
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
            </>
          )}

          {decodedMenuData.valArr?.map((val, idx) => {
            if (!val || idx === 0) return null;
            return (
              <React.Fragment key={idx}>
                <Typography
                  component="span"
                  sx={breadcrumbLinkStyle}
                  onClick={() => handleBreadcrumbClick(idx, decodedMenuData.menuname)}
                >
                  {val}
                </Typography>
                <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
              </React.Fragment>
            );
          })}
        </>
      ) : (
        /* Special Search / Type filter or Fallback Category */
        <>
          {firstChar === "N" && (
            <>
              <Typography
                component="span"
                sx={breadcrumbLinkStyle}
                onClick={() => navigate.push("/p/NewArrival/?N=1")}
              >
                New Arrival
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
            </>
          )}

          {firstChar === "T" && (
            <>
              <Typography
                component="span"
                sx={breadcrumbLinkStyle}
                onClick={() => navigate.push("/p/Trending/?T=1")}
              >
                Trending
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
            </>
          )}

          {firstChar === "B" && (
            <>
              <Typography
                component="span"
                sx={breadcrumbLinkStyle}
                onClick={() => navigate.push("/p/BestSeller/?B=1")}
              >
                Best Seller
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
            </>
          )}

          {categoryFallback && !["N", "T", "B"].includes(firstChar) && (
            <>
              <Typography
                component="span"
                sx={breadcrumbLinkStyle}
                onClick={() => navigate.push(`/p/${encodeURIComponent(categoryFallback)}/`)}
              >
                {categoryFallback}
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
            </>
          )}
        </>
      )}

      {/* Active Product Name / SKU */}
      <Typography
        component="span"
        sx={{
          ...breadcrumbActiveStyle,
          maxWidth: isMobile ? 180 : 350,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={productLabel}
      >
        {productLabel}
      </Typography>
    </Box>
  );
};

export default DetailBreadcrumb;
