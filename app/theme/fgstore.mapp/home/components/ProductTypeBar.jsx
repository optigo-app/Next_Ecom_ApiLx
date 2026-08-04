"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Chip } from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import { GETProductType } from "@/app/(core)/utils/API/GETProductType/GETProductType";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Cookies from "js-cookie";
import { Skeleton } from "@mui/material";
// import { GetCacheList, BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
// import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext, processAlbumImages } from "@/app/(core)/cache_utility/CacheBuilder";
// import { getSession } from "@/app/(core)/utils/FetchSessionData";

const getProductTypeCached = async (finalID) => {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem("productTypes");

  if (stored) {
    return JSON.parse(stored);
  }

  const res = await GETProductType(finalID);
  const data = res?.Data?.rd || [];

  sessionStorage.setItem("productTypes", JSON.stringify(data));

  return data;
};

function ProductTypeBar({ storeinit }) {
  const { loginUserDetail, islogin } = useStore();
  const [types, setTypes] = useState([]);
  const visiterID = Cookies.get("visiterId");

  useEffect(() => {
    const loadData = async () => {
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin === false ? visiterID : loginUserDetail?.id || "0") : loginUserDetail?.id || "0";
      const data = await getProductTypeCached(finalID);
      setTypes(data || []);
    };
    loadData();
  }, []);


  // const chipColors = {
  //   "Diamond Jewellery": "linear-gradient(135deg,#e3f2fd,#bbdefb)",
  //   Bridal: "linear-gradient(135deg,#fff0f6,#ffd6e7)",
  //   Jewellery: "linear-gradient(135deg,#fff8e1,#ffe0b2)",
  //   "BRACELET Jewellery": "linear-gradient(135deg,#f3e5f5,#e1bee7)",
  //   Men: "linear-gradient(135deg,#eceff1,#cfd8dc)",
  //   Women: "linear-gradient(135deg,#fff3e0,#ffccbc)",
  //   Diamond: "linear-gradient(135deg,#e1f5fe,#b3e5fc)",
  //   "Gold Jewellery": "linear-gradient(135deg,#fff8e1,#ffd54f)",
  // };
  const chipColors = {
  "Diamond Jewellery": "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
  Bridal: "linear-gradient(135deg, #FCFCFC 0%, #F2F2F2 100%)",
  Jewellery: "linear-gradient(135deg, #FAFAFA 0%, #EEEEEE 100%)",
  "BRACELET Jewellery": "linear-gradient(135deg, #FFFFFF 0%, #ECECEC 100%)",
  Men: "linear-gradient(135deg, #F3F3F3 0%, #DEDEDE 100%)",
  Women: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
  Diamond: "linear-gradient(135deg, #FAFAFA 0%, #EAEAEA 100%)",
  "Gold Jewellery": "linear-gradient(135deg, #FFFFFF 0%, #E8E8E8 100%)",
};

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 1.2,
        mb: 2,
        px: 1,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {!types
        ? Array.from(new Array(6)).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={110}
            height={42}
            sx={{
              borderRadius: "999px",
              flexShrink: 0,
            }}
          />
        ))
        : types?.map((item) => (
          <Chip
            key={item.ProductTypeId}
            label={item.ProductTypeName}
            clickable
            icon={<DiamondOutlinedIcon fontSize="small" />}
            sx={{
              borderRadius: "3px",
              px: 1.6,
              height: 42,
              fontWeight: 600,
              color: "#5a4636",
              background: chipColors[item.ProductTypeName] ,
              transition: "all .25s ease",
            }}
          />
        ))}
    </Box>
  );
}
export default ProductTypeBar;
