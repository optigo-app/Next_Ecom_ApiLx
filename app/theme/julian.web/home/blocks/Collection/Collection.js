'use client';

import React, { useEffect, useState } from "react";
import { Box, Typography, Container } from '@mui/material';
import { HomeCollectionPageApi } from "@/app/(core)/utils/API/Home/HomeCollectionPage/HomeCollectionPageApi";
import CollectionSkeleton from "./Loader"; // Assumed path based on your old code
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useSyncStore } from "@/app/(core)/hooks/useStore";
import { getSession, setSession } from "@/app/(core)/utils/FetchSessionData";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";

const FALLBACK_COLORS = [
  "#F5E6E8", // Soft Rose
  "#FDF5E6", // Old Lace
  "#F0F4F8", // Alice Blue
  "#FAF0E6", // Linen
  "#E6E6FA", // Lavender
  "#FFF5EE", // Seashell
  "#F5F5DC", // Beige
];

export default function LuxuryAngledGrid() {
  const { finalId } = useStore();
  const [CollectionList, setCollectionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const syncProductList = useSyncStore((state) => state.syncProductList);
  
  const { push } = useNextRouterLikeRR();
  const Router = useNextRouterLikeRR().push;
  const navigate = url => Router(url);

 
  const Fetchcolection = async () => {
    const cacheKey = `julian_home_collection_${finalId}`;

    // 1. Client Session Cache Check (0ms instant browser read)
    let cachedSessionData = getSession(cacheKey);
    if (cachedSessionData && Array.isArray(cachedSessionData) && cachedSessionData.length > 0) {
      const hasError = cachedSessionData.some(
        (item) =>
          item?.stat === 0 ||
          (typeof item?.stat_msg === "string" &&
            item.stat_msg.toLowerCase().includes("error")),
      );
      if (!hasError) {
        setCollectionList(cachedSessionData);
        setLoading(false);
        return;
      }
    }

    // 2. Server Disk Cache Check (Fast read from .next_cache)
    try {
      const cacheRes = await readCache(cacheKey);
      if (cacheRes?.cached && Array.isArray(cacheRes.data) && cacheRes.data.length > 0) {
        const hasError = cacheRes.data.some(
          (item) =>
            item?.stat === 0 ||
            (typeof item?.stat_msg === "string" &&
              item.stat_msg.toLowerCase().includes("error")),
        );
        if (!hasError) {
          setCollectionList(cacheRes.data);
          setSession(cacheKey, cacheRes.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("[Collection] File cache read error:", err);
    }

    // 3. Live API Call (HomeCollectionPageApi)
    try {
      setLoading(true);
      const res = await HomeCollectionPageApi(finalId);
      const list = res?.Data?.rd || [];
      const hasError = list.some(
        (item) =>
          item?.stat === 0 ||
          (typeof item?.stat_msg === "string" &&
            item.stat_msg.toLowerCase().includes("error")),
      );

      if (list.length > 0 && !hasError) {
        setCollectionList(list);
        setSession(cacheKey, list);
        writeCache(cacheKey, list).catch(console.error);
      }
    } catch (error) {
      console.error("🚀 ~ Fetchcolection ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Fetchcolection();
  }, [syncProductList.ts, finalId]);

  const sortedCollection = [...CollectionList].sort((a, b) => {
    const aHasImg = a.DisplayOrder && a.DisplayOrder.length > 0;
    const bHasImg = b.DisplayOrder && b.DisplayOrder.length > 0;

    if (aHasImg && !bHasImg) return -1;
    if (!aHasImg && bHasImg) return 1;
    return 0;
  });

  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (
      event?.ctrlKey || 
      event?.shiftKey || 
      event?.metaKey || 
      (event?.button && event?.button === 1)
    ) {
      return;
    } else {
      event?.preventDefault();
      let finalData = {
        menuname: param?.menuname ?? "",
        FilterKey: param?.key ?? "",
        FilterVal: param?.value ?? "",
        FilterKey1: isFilterKey2Ignore === 1 ? param2?.key ?? "" : param1?.key ?? "",
        FilterVal1: isFilterKey2Ignore === 1 ? param2?.value ?? "" : param1?.value ?? "",
        FilterKey2: isFilterKey2Ignore === 1 ? "" : param2?.key ?? "",
        FilterVal2: isFilterKey2Ignore === 1 ? "" : param2?.value ?? "",
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
    }
  };

  const getClipPath = (index, totalItems) => {
    if (totalItems <= 1) return 'none';
    // First element
    if (index === 0) {
      return 'polygon(0% 0%, 100% 0%, 93% 100%, 0% 100%)';
    }
    // Last element
    if (index === totalItems - 1) {
      return 'polygon(7% 0, 100% 0, 100% 100%, 0 100%)';
    }
    // Middle elements
    return 'polygon(7% 0%, 100% 0%, 92% 100%, 0% 100%)';
  };

  if (loading) {
    return <CollectionSkeleton />;
  }

  if (!sortedCollection?.length) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      

      {/* Dynamic Angled Row Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on mobile, row on desktop
          gap: '8px', 
          overflow: 'hidden',
        }}
      >
        {sortedCollection?.map((item, index) => {
          const hasImage = item?.imgsrc && item?.imgsrc.length > 0;
          const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
          const totalItems = sortedCollection.length;

          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: 420,
                position: 'relative',
                // Applies angled layout logic on desktop screens only
                clipPath: { xs: 'none', md: getClipPath(index, totalItems) },
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: hasImage ? "transparent" : bgColor,
              }}
              onClick={(e) => 
                handelMenu(
                  { menuname: "Collection", key: "Auto", value: "" }, 
                  { key: "collection", value: item.CollectionName }, 
                  {}, 
                  e, 
                  0
                )
              }
            >
              {hasImage ? (
                /* Background Image rendering safely */
                <Box
                  component="img"
                  src={item.imgsrc}
                  alt={item.CollectionName}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: '0.5s',
                    '&:hover': {
                      transform: 'scale(1.08)',
                    },
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                /* Text fallback visual block when no image exists */
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                />
              )}

              {/* Gradient Overlay for modern high-contrast readability */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                }}
              />

              {/* Title Content */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 30,
                  left: { xs: 16, md: 24 },
                  right: { xs: 16, md: 24 },
                  textAlign: 'center',
                  color: '#fff',
                  zIndex: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    letterSpacing: "0.5px",
                    mb: 0.5,
                  }}
                >
                  {item.CollectionName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Explore
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}