"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Headers from "./composable/Headers";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { HomeCategoryApi } from "@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import Cookies from "js-cookie";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";


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
    ImageUrl: "/category/PendantSet.webp",
  },
  {
    "CategoryName": "Mangalsutra",
    ImageUrl: "/category/Mangalsutra1.jpg",
  },
  {
    "CategoryName": "Mangalsutra Set",
    ImageUrl: "/category/MangalsutraSet.webp",
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
  const { cacheList, setCacheList } = useMaster();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNextRouterLikeRR().push;
  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const fetchAndSetCategories = useCallback(
    async (finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) return;

      const apiALC = "";
      const keyALC = normalizeALC("");
      const eventName = "home_category";

      const { key, meta } = buildAlbumCacheKey(eventName, storeinit, pricingContext, finalID, keyALC);
      const effectiveKey = precomputedKey || key;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        // Step 1: Check server cache + local cache in parallel
        const localCacheRes = await fetch(`/api/v1/cache?mode=meta&key=${effectiveKey}`)
          .then((res) => res.json())
          .catch(() => ({ cached: false }));

        const serverCacheEntries = cacheList?.Data?.rd ?? [];
        const matchingServerEntry = findMatchingCacheEntry(serverCacheEntries, pricingContext, eventName, apiALC);
        const serverCacheRebuildDate = matchingServerEntry?.CacheRebuildDate ?? null;

        const localCacheMeta = localCacheRes;
        const localCacheRebuildDate = localCacheMeta?.CacheRebuildDate ?? null;

        console.log("[Categories] Cache meta checked: localCacheMeta.cached =", localCacheMeta?.cached, "server entries count =", serverCacheEntries?.length);

        if (localCacheMeta?.cached) {
          const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
          const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

          if (canValidate && datesMatch) {
            const cachedRes = await fetch(`/api/v1/cache?key=${effectiveKey}`);
            const cached = await cachedRes.json();
            console.log("[Categories] Using cache, skipping API");
            if (cached.cached && Array.isArray(cached.data)) {
              console.log("[Categories] Setting categories from cache");
              const mappedData = mapCategoryImages(cached.data);
              setCategories(mappedData.length > 0 ? mappedData : categoryImages);
              setLoading(false);
              isFetchingRef.current = false;
              return cached.data;
            }
          }
          fetch(`/api/v1/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
        }

        if (!storeinit) {
          setTimeout(() => {
            isFetchingRef.current = false;
            fetchAndSetCategories(finalID, effectiveKey);
          }, 500);
          return;
        }

        console.log("[Categories] Making API call for finalID:", finalID);
        const response = await HomeCategoryApi(finalID);
        const apiData = response?.Data?.rd || [];
        console.log("[Categories] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapCategoryImages(apiData);
          setCategories(mappedData);
        } else {
          setCategories(categoryImages);
        }

        setLoading(false);
        isFetchingRef.current = false;

        // Step 5: Book cache + store to local cache
        try {
          const bookCacheResult = await BookCache(finalID, eventName, pricingContext, apiALC);
          const newCacheRebuildDate = bookCacheResult?.CacheRebuildDate ?? null;

          if (newCacheRebuildDate) {
            // Update global cacheList in context
            const newEntry = {
              EventName: eventName,
              PackageId: pricingContext.PackageId,
              LabourSetId: pricingContext.Laboursetid,
              diamondpricelistname: pricingContext.diamondpricelistname,
              colorstonepricelistname: pricingContext.colorstonepricelistname,
              ALC: normalizeALC(apiALC),
              CacheRebuildDate: newCacheRebuildDate,
            };
            if (cacheList?.Data?.rd) {
              const updatedRd = [...cacheList.Data.rd];
              const idx = updatedRd.findIndex(e => e.EventName === eventName && e.PackageId == pricingContext.PackageId && e.LabourSetId == pricingContext.Laboursetid);
              if (idx > -1) updatedRd[idx] = newEntry; else updatedRd.push(newEntry);
              setCacheList({ ...cacheList, Data: { ...cacheList.Data, rd: updatedRd } });
            }
          }

          const updatedMeta = { ...meta, CacheRebuildDate: newCacheRebuildDate };
          fetch("/api/v1/cache", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: effectiveKey, data: apiData, meta: updatedMeta }),
          }).catch(console.error);
        } catch (cacheErr) {
          console.error("[Categories] Cache update failed:", cacheErr);
        }
      } catch (err) {
        console.log("[Categories] Error in fetch:", err);
        console.error(err);
        // ✅ fallback on error
        setCategories(categoryImages);
        isFetchingRef.current = false;
      } finally {
        setLoading(false);
      }
    },
    [pricingContext, storeinit, cacheList, setCacheList],
  );

  useEffect(() => {
    if (!pricingContext || !storeinit || cacheList === null) return;

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
  }, [islogin, pricingContext, storeinit, fetchAndSetCategories, loginUserDetail?.id, cacheList]);


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
