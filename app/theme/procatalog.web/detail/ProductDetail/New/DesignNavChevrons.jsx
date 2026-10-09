"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import {
  compressAndEncode,
  getCardImageUrl,
} from "@/app/(core)/utils/product/productListingHelpers";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

export const STORAGE_KEY_PROCAT_LIST = "procatalog_design_list";

const DesignNavChevrons = ({
  currentDesignNo,
  currentAutocode,
  storeInit,
}) => {
  const navigate = useNextRouterLikeRR();
  const [designList, setDesignList] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_PROCAT_LIST);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDesignList(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const currentIndex = useMemo(() => {
    if (!Array.isArray(designList) || designList.length === 0) return -1;
    const targetDesign = String(currentDesignNo || "").trim().toLowerCase();
    const targetAuto = String(currentAutocode || "").trim().toLowerCase();

    return designList.findIndex((item) => {
      const itemDesign = String(item?.designno || "").trim().toLowerCase();
      const itemAuto = String(item?.autocode || "").trim().toLowerCase();
      return (
        (targetDesign && itemDesign === targetDesign) ||
        (targetAuto && itemAuto === targetAuto)
      );
    });
  }, [designList, currentDesignNo, currentAutocode]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < designList.length - 1;

  const navigateToProduct = useCallback(
    (productData) => {
      if (!productData) return;
      try {
        const cleanImg =
          productData?.img ||
          getCardImageUrl(productData, storeInit) ||
          "";

        const obj = {
          a: productData?.autocode,
          b: productData?.designno,
          m: productData?.MetalColorid || productData?.MetalTypeId || null,
          d: productData?.DiamondQualityId || null,
          c: productData?.ColorStoneQualityId || null,
          f: {},
          g: "",
          img: cleanImg,
          ArticleNo: productData?.ArticleNo || productData?.designno || "",
          ArticleId: productData?.ArticleId ?? null,
          title: productData?.TitleLine ?? "",
          nwt: productData?.Nwt ?? 0,
          price: productData?.UnitCostWithMarkUp ?? 0,
          mediaDet: productData?.ImageVideoDetail ?? "",
          l: productData?.ImageExtension || "webp",
          count: productData?.ImageCount || 0,
        };

        const encodeObj = compressAndEncode(JSON.stringify(obj));
        const url = `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`;
        if (navigate?.push) {
          navigate.push(url);
        }
      } catch (err) {
        console.error("[DesignNavChevrons] Navigation failed:", err);
      }
    },
    [navigate, storeInit]
  );

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      navigateToProduct(designList[currentIndex - 1]);
    }
  }, [hasPrev, designList, currentIndex, navigateToProduct]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      navigateToProduct(designList[currentIndex + 1]);
    }
  }, [hasNext, designList, currentIndex, navigateToProduct]);

  // Gracefully hide if no design list or only a single design
  if (currentIndex === -1 || designList.length <= 1) {
    return null;
  }

  const prevProduct = hasPrev ? designList[currentIndex - 1] : null;
  const nextProduct = hasNext ? designList[currentIndex + 1] : null;

  const prevTitle = prevProduct
    ? `Previous: ${prevProduct?.ArticleNo || prevProduct?.designno || "Design"}`
    : "No previous design";
  const nextTitle = nextProduct
    ? `Next: ${nextProduct?.ArticleNo || nextProduct?.designno || "Design"}`
    : "No next design";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.3,
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: "20px",
        px: 0.6,
        py: 0.25,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#d1d5db",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Tooltip title={prevTitle} arrow placement="top">
        <span>
          <IconButton
            size="small"
            disabled={!hasPrev}
            onClick={handlePrev}
            aria-label="Previous Design"
            sx={{
              p: 0.35,
              color: "#222222",
              transition: "transform 0.15s ease",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                transform: hasPrev ? "translateX(-1px)" : "none",
              },
              "&.Mui-disabled": {
                color: "#d1d5db",
              },
            }}
          >
            <ChevronLeftRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </Tooltip>

      <Typography
        variant="caption"
        sx={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#888888",
          userSelect: "none",
          px: 0.3,
        }}
      >
        {currentIndex + 1}/{designList.length}
      </Typography>

      <Tooltip title={nextTitle} arrow placement="top">
        <span>
          <IconButton
            size="small"
            disabled={!hasNext}
            onClick={handleNext}
            aria-label="Next Design"
            sx={{
              p: 0.35,
              color: "#222222",
              transition: "transform 0.15s ease",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                transform: hasNext ? "translateX(1px)" : "none",
              },
              "&.Mui-disabled": {
                color: "#d1d5db",
              },
            }}
          >
            <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default React.memo(DesignNavChevrons);
