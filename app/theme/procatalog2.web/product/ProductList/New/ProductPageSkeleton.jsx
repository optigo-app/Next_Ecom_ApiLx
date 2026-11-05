"use client";
import React from "react";
import { Box } from "@mui/material";
import BreadCrumbBar from "./BreadCrumb";
import ShopHeader from "./ShopHeader";
import JewelryProductGrid from "./NewProductList";

export default function ProductPageSkeleton() {
  return (
    <Box
      sx={{
        pt: 4,
        px: { xs: 1, sm: 2, md: 4 },
        background: "#fff",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <BreadCrumbBar isFiltering={true} />
      <ShopHeader isFiltering={true} filterCount={0} />
      <JewelryProductGrid productListData={[]} isFiltering={true} />
    </Box>
  );
}
