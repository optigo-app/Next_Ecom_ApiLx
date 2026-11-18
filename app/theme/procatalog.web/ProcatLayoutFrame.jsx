"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@mui/material";

export default function ProcatLayoutFrame({
  children,
  header,
  footer,
  backToTop,
  chatMenu,
}) {
  const searchParams = useSearchParams();
  const isExclusiveAlbum =
    searchParams.has("exclusive-album") ||
    searchParams.has("randomNo") ||
    searchParams.has("RandomNo");

  if (isExclusiveAlbum) {
    return (
      <Box
        className="procat-layout-frame"
        sx={{ minHeight: "100vh", width: "100%", backgroundColor: "#fff" }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      className="procat-layout-frame"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        overflowX: "clip",
        position: "relative",
        backgroundImage:
          "url('/Assets/soft-grey-organic-leaves-background-with-text-space__1017-60373.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box className="procat-layout-chrome" sx={{ display: "contents" }}>
        {header}
      </Box>
      <Box
        className="procat-layout-page"
        sx={{
          flex: 1,
          backgroundColor: "#ffffff",
          marginInline: "6%",
          "@media screen and (max-width: 1400px)": { marginInline: "3%" },
          "@media screen and (max-width: 1200px)": { marginInline: "1.5%" },
          "@media screen and (max-width: 768px)": {
            marginInline: "0px",
            borderRadius: "0px",
            my: 0,
          },
          borderRadius: "4px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          my: { xs: 0, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
        <Box className="procat-layout-chrome" sx={{ display: "contents" }}>
          {footer}
        </Box>
      </Box>
      <Box className="procat-layout-chrome" sx={{ display: "contents" }}>
        {backToTop}
        {chatMenu}
      </Box>
    </Box>
  );
}
