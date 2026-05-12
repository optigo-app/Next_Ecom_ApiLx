"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Headers from "./composable/Headers";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { HomeCategoryApi } from "@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import Cookies from "js-cookie";


const categoryImages = [
  {
    CategoryName: "Mangalsutra",
    ImageUrl: "/category/Mangalsutra1.jpg",
  },
  {
    CategoryName: "Pendants",
    ImageUrl: "/category/pendent.jpg",
  },
  {
    CategoryName: "Bangles",
    ImageUrl: "/category/Bangals1.png",
  },
  {
    CategoryName: "Ring",
    ImageUrl: "/category/rings.jpg",
  },
  {
    CategoryName: "EARING",
    ImageUrl: "/category/Earings1.png",
  },
  {
    CategoryName: "NACKLACE",
    ImageUrl: "/category/NECKLACE1.jpg",
  },
  {
    CategoryName: "Bracelet",
    ImageUrl: "/category/BRACELATE2.jpg",
  },
  {
    "CategoryName": "Pendant",
    ImageUrl: "/category/pendent.jpg",
  },
  {
    "CategoryName": "Bangle",
    ImageUrl: "/category/Bangals1.png",
  },
  {
    "CategoryName": "Necklace",
    ImageUrl: "/category/NECKLACE1.jpg",
  },
  {
    "CategoryName": "Ring",
    ImageUrl: "/category/rings.jpg",
  },
  {
    "CategoryName": "Bracelet",
    ImageUrl: "/category/BRACELATE2.jpg",
  },
  {
    "CategoryName": "Earring",
    ImageUrl: "/category/Earings1.png",
  },
  {
    "CategoryName": "Pendant set",
    ImageUrl: "/category/pendent_set.jpg",
  },
  {
    "CategoryName": "Mangalsutra",
    ImageUrl: "/category/Mangalsutra1.jpg",
  },
  {
    "CategoryName": "Mangalsutra Set",
    ImageUrl: "/category/MangalsutraSet.webp",
  },
  {
    "CategoryName": "Necklace Set",
    ImageUrl: "/category/Necklace_set.jpg",
  }
];

/** Maps API category data with local fallback images */
const mapCategoryImages = (apiData) => {
  return apiData.map((item) => ({
    ...item,
    img: categoryImages.find(
      (cat) =>
        cat.CategoryName.toLowerCase() ===
        item.CategoryName?.toLowerCase()
    )?.ImageUrl,
  }));
};

const Categories = ({ storeinit }) => {
  const { loginUserDetail, islogin } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNextRouterLikeRR().push;
  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const fetchAndSetCategories = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[Categories] Serving from cache");
          const mappedData = mapCategoryImages(cacheRes.data);
          setCategories(mappedData.length > 0 ? mappedData : categoryImages);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        console.log("[Categories] Cache miss, calling API...");
        const response = await HomeCategoryApi(finalID);
        const apiData = response?.Data?.rd || [];
        console.log("[Categories] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapCategoryImages(apiData);
          setCategories(mappedData);

          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setCategories(categoryImages);
        }

        setLoading(false);
        isFetchingRef.current = false;
      } catch (err) {
        console.log("[Categories] Error in fetch:", err);
        console.error(err);
        // ✅ fallback on error
        setCategories(categoryImages);
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [pricingContext, storeinit]
  );

  useEffect(() => {
    if (!pricingContext || !storeinit) return;

    const fetchData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("home_category", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetCategories(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeinit, fetchAndSetCategories, loginUserDetail?.id]);


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
    const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");
    const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].join(",");
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
      <Headers title={"Categories"}
        showViewMoreBtn={false}
      />
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, px: 1.5, py: 1.5, "&::-webkit-scrollbar": { display: "none" } }}>
        {
          loading ? (
            Array.from(new Array(8)).map((_, index) => (
              <Box key={index} sx={{ minWidth: "80px", width: "80px" }}>
                <Skeleton
                  variant="rectangular"
                  width="90px"
                  height="90px"
                  sx={{ borderRadius: 50, bgcolor: "rgba(0,0,0,0.06)" }}
                />
              </Box>
            ))
          ) : (categories.map((cat, index) => (
            <Box key={index}
              onClick={() => handleNavigate(cat.CategoryName)}
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "90px" }}>
              <Avatar src={cat.img || cat.ImageUrl} sx={{ width: 90, height: 90, mb: 1, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }} />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {cat.CategoryName}
              </Typography>{" "}
            </Box>
          ))
          )}
      </Box>
    </>
  );
};

export default Categories;
