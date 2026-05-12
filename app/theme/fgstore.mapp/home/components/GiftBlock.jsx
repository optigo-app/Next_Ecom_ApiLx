"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Box, Card, CardMedia, Skeleton, Typography } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Link from "next/link";
import Headers from "./composable/Headers";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import Cookies from "js-cookie";

const GiftBlock = ({ storeinit }) => {
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginUserDetail, islogin } = useStore();

  const fallbackImage = "/fallback.jpg";
  const imageBaseUrl = useMemo(() => {
    return storeinit?.AlbumImageFol || "";
  }, [storeinit?.AlbumImageFol]);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  /** Maps API album data with validated image URLs */
  const mapAlbumImages = useCallback((apiData) => {
    return apiData.map((item) => {
      const imageURL = item?.AlbumImageFol && item?.AlbumImageName
        ? `${imageBaseUrl}${item.AlbumImageFol}/${item.AlbumImageName}`
        : fallbackImage;
      return { ...item, validatedImageURL: imageURL };
    });
  }, [imageBaseUrl, fallbackImage]);

  const fetchAndSetAlbums = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[GiftBlock] Serving from cache");
          const mappedData = mapAlbumImages(cacheRes.data);
          setAlbumData(mappedData);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        console.log("[GiftBlock] Cache miss, calling API...");
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETAlbum", finalID);
        const apiData = res?.Data?.rd || [];
        console.log("[GiftBlock] API response received, count:", apiData.length);

        if (apiData.length > 0) {
          const mappedData = mapAlbumImages(apiData);
          setAlbumData(mappedData);

          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setAlbumData([]);
        }

        setLoading(false);
        isFetchingRef.current = false;
      } catch (err) {
        console.log("[GiftBlock] Error in fetch:", err);
        console.error(err);
        setAlbumData([]);
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [pricingContext, storeinit, mapAlbumImages]
  );

  useEffect(() => {
    if (!pricingContext || !storeinit) return;

    const fetchData = async () => {
      const visiterID = Cookies.get("visiterId"); // Consistent with Categories.jsx
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("home_album", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetAlbums(finalID, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeinit, fetchAndSetAlbums, loginUserDetail?.id]);

  if (!loading && albumData.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 0 }}>
      <Headers title="Latest Albums" showViewMoreBtn={false} />

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 1.5,
          py: 1,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ minWidth: 160, width: "100%" }}>
              <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }} />
            </Box>
          ))
          : albumData.map((album, index) => (
            <Box
              key={album?.AlbumId || index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                minWidth: "160px",
                width: "100%",
              }}
            >
              <Card
                component={Link}
                href={`/p/${encodeURIComponent(album?.AlbumName)}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`}
                prefetch={false}
                elevation={0}
                sx={{
                  minWidth: "160px",
                  borderRadius: 3,
                  bgcolor: "#fce(4ec",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  width: "100%",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  textDecoration: "none",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={album?.validatedImageURL}
                  alt={album?.AlbumName || "Gift Collection"}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
              </Card>
              <Typography
                variant="body2"
                sx={{
                  color: "#757575",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 0.5,
                  textDecoration: "none",
                  mt: 1,
                  px: 1,
                }}
              >
                {album?.AlbumName}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default GiftBlock;
