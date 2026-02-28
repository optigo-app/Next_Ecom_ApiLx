"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Box, Card, CardMedia, Skeleton, Typography } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Link from "next/link";
import Headers from "./composable/Headers";

const GiftBlock = ({ storeinit }) => {
  const [albumData, setAlbumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { finalId } = useStore();

  const fallbackImage = "/fallback.jpg";
  const imageBaseUrl = useMemo(() => {
    return storeinit?.AlbumImageFol || "";
  }, [storeinit?.AlbumImageFol]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETAlbum", finalId);

      if (res?.Data?.rd) {
        const validatedData = res.Data.rd.map((item) => {
          const imageURL = item?.AlbumImageFol && item?.AlbumImageName
            ? `${imageBaseUrl}${item.AlbumImageFol}/${item.AlbumImageName}`
            : fallbackImage;

          return { ...item, validatedImageURL: imageURL };
        });
        setAlbumData(validatedData);
      }
    } catch (err) {
      console.error("Error fetching GiftBlock data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (!loading && albumData.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Headers title="Gifts For You" />

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
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Box key={index} sx={{ minWidth: 160, width: "100%" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={160}
                sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.05)" }}
              />
            </Box>
          ))
        ) : (
          albumData.map((album, index) => (
            <Box
              key={album?.AlbumId || index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                  borderRadius: 3,
                  bgcolor: "#fce(4ec", // Kept the subtle pinkish background if it was intentional, but softened it
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  width: "100%",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  }
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
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default GiftBlock;
