"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Headers from "./composable/Headers";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { HomeCategoryApi } from "@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import Cookies from "js-cookie";

const IMAGE_NOT_FOUND = "/image-not-found.jpg";

const resolveCategoryImage = (cat, storeInit) => {
  const cdnFol =
    storeInit?.CDNDesignImageFolThumb ||
    storeInit?.CDNDesignImageFol ||
    storeInit?.DesignImageFol ||
    "";
  const p = cat?.firstProduct;
  if (!p?.designno || p?.ImageCount === 0 || !cdnFol) {
    return IMAGE_NOT_FOUND;
  }
  return `${cdnFol}${p.designno}~1.jpg`;
};

/** Maps API category data with dynamic product image */
const mapCategoryImages = (apiData, storeInit) => {
  return (apiData || []).map((item) => {
    const catName = item.CategoryName || item.categoryName || "";
    return {
      ...item,
      CategoryName: catName,
      img: resolveCategoryImage(item, storeInit),
    };
  });
};

const Categories = ({ storeinit, initialCategories = [] }) => {
  const { loginUserDetail, islogin, finalId, storeInit: storeInitCtx } = useStore();
  const currentStore = storeinit || storeInitCtx;

  const [categories, setCategories] = useState(() => {
    if (Array.isArray(initialCategories) && initialCategories.length > 0) {
      return mapCategoryImages(initialCategories, currentStore);
    }
    return [];
  });
  const [loading, setLoading] = useState(
    !initialCategories || initialCategories.length === 0,
  );
  const navigate = useNextRouterLikeRR().push;

  const isFetchingRef = useRef(false);
  const lastUserRef = useRef(null);

  const fetchAndSetCategories = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch("/api/sqlite/home-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeInit: storeinit,
          loginUserDetail,
        }),
      });
      const result = await response.json();
      const apiData = result?.Data?.rd || result?.rd || [];

      if (Array.isArray(apiData) && apiData.length > 0) {
        setCategories(mapCategoryImages(apiData, currentStore));
      } else {
        const visitorId = finalId || Cookies.get("visiterId") || "";
        const legacyRes = await HomeCategoryApi(visitorId).catch(() => null);
        const legacyData = legacyRes?.Data?.rd || [];
        setCategories(mapCategoryImages(legacyData, currentStore));
      }
      setLoading(false);
    } catch (err) {
      console.error("[Categories] Error in fetch:", err);
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [currentStore, loginUserDetail, finalId]);

  useEffect(() => {
    const currentUserSig = `${Boolean(islogin)}_${loginUserDetail?.id || loginUserDetail?.userid || 0}_${loginUserDetail?.pricemanagement_laboursetid || 0}`;

    // If initialCategories was provided on first mount and matches state, keep it
    if (
      lastUserRef.current === null &&
      initialCategories &&
      initialCategories.length > 0
    ) {
      lastUserRef.current = currentUserSig;
      return;
    }

    if (lastUserRef.current !== currentUserSig || categories.length === 0) {
      lastUserRef.current = currentUserSig;
      fetchAndSetCategories();
    }
  }, [
    islogin,
    loginUserDetail,
    initialCategories,
    fetchAndSetCategories,
    categories.length,
  ]);

  const handleNavigate = (name) => {
    let finalData = {
      menuname: name,
      FilterKey: "Category",
      FilterVal: name,
      FilterKey1: "",
      FilterVal1: "",
      FilterKey2: "",
      FilterVal2: "",
    };
    sessionStorage.setItem("menuparams", JSON.stringify(finalData));
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
    ].join(",");
    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(",");
    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
    navigate(url);
  };

  if (!loading && categories?.length === 0) {
    return null;
  }

  return (
    <>
      <Headers title={"Categories"} showViewMoreBtn={false} />
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 1.5,
          py: 1.5,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Box key={index} sx={{ minWidth: "80px", width: "80px" }}>
                <Skeleton
                  variant="circular"
                  width={80}
                  height={80}
                  sx={{ mb: 1, bgcolor: "rgba(0,0,0,0.06)" }}
                />
                <Skeleton variant="text" width={60} sx={{ mx: "auto" }} />
              </Box>
            ))
          : categories.map((cat, index) => {
              const name = cat.CategoryName || cat.categoryName;
              return (
                <Box
                  key={cat.categoryId || cat.id || index}
                  onClick={() => handleNavigate(name)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: "80px",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    src={cat.img}
                    alt={name}
                    imgProps={{
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = IMAGE_NOT_FOUND;
                      },
                    }}
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 1,
                      backgroundColor: "#f5f5f5",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(0,0,0,0.04)",
                      "& img": {
                        objectFit: "contain",
                        width: "85%",
                        height: "85%",
                        mixBlendMode: "multiply",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "85px",
                      textAlign: "center",
                    }}
                  >
                    {name}
                  </Typography>
                </Box>
              );
            })}
      </Box>
    </>
  );
};

export default Categories;