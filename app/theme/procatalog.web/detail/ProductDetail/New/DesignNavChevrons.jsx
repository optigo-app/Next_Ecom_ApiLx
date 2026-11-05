"use client";
import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import useDesignNavigation, { STORAGE_KEY_PROCAT_LIST } from "./useDesignNavigation";

export { STORAGE_KEY_PROCAT_LIST };

const DesignNavChevrons = ({
  currentDesignNo,
  currentAutocode,
  storeInit,
}) => {
  const { designList, currentIndex, hasPrev, hasNext, handlePrev, handleNext } =
    useDesignNavigation({ currentDesignNo, currentAutocode, storeInit });

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
