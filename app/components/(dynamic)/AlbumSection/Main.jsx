"use client";
import React, { useEffect, useMemo, useState } from "react";
import cookies from "js-cookie";
import useSWR, { mutate } from "swr";
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";

const buildAlbumCacheKey = (type, storeData, pricing, id) => {
  const meta = {
  type,
  PackageId: pricing?.PackageId ?? "",
  Laboursetid: pricing?.Laboursetid ?? "",
  diamondpricelistname: pricing?.diamondpricelistname ?? "",
  colorstonepricelistname: pricing?.colorstonepricelistname ?? "",
};

const key = [
    type,
    pricing?.PackageId,
    pricing?.Laboursetid,
    pricing?.diamondpricelistname,
    pricing?.colorstonepricelistname,
  ].join("_");

  return {
    key,
    meta,
  }
};



const fetchAlbum = async ([storeData, pricing, id]) => {
  const {key ,meta} = buildAlbumCacheKey("album",storeData, pricing, id);
  const cachedRes = await fetch(`/api/cache?key=${key}`);
  const cached = await cachedRes.json();

  if (cached.cached && Array.isArray(cached.data)) {
    console.log("🔥 Using cached data", cached.data);
    return cached.data; 
  }

  const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETAlbum", id);
  const data = res?.Data?.rd || [];

  fetch("/api/cache", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, meta, data }),
  }).catch(console.error);

  return data;
};

const Main = ({ storeData }) => {
  const { islogin } = useStore();
  const [loginUserDetail, setLoginUserDetail] = useState(null);
  const [mounted, setMounted] = useState(false);
  const imageUrl = storeData?.AlbumImageFol;

  // Load user detail from sessionStorage
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("loginUserDetail");
        setLoginUserDetail(stored ? JSON.parse(stored) : null);
      } catch {
        setLoginUserDetail(null);
      }
    }
  }, []);

  // Compute final ID
  const finalID = useMemo(() => {
    if (!mounted) return null;
    const visitorId = cookies.get("visitorId") ?? "0";
    const IsB2BWebsite = storeData?.IsB2BWebsite ?? 0;
    const uid = loginUserDetail?.id || "0";
    if (IsB2BWebsite == 0) {
      return islogin === false ? visitorId : uid;
    }
    return uid;
  }, [mounted, loginUserDetail, islogin, storeData?.IsB2BWebsite]);

  const pricingContext = useMemo(() => {
  if (!mounted) return null;

  const loginInfo = loginUserDetail;

 return {
      PackageId: (loginInfo?.PackageId ?? storeData?.PackageId) ?? "",
      Laboursetid:
          !islogin 
          ? storeData?.pricemanagement_laboursetid
          : loginInfo?.pricemanagement_laboursetid ?? "",
      diamondpricelistname:
          !islogin 
          ? storeData?.diamondpricelistname
          : loginInfo?.diamondpricelistname ?? "",
      colorstonepricelistname:
          !islogin 
          ? storeData?.colorstonepricelistname
          : loginInfo?.colorstonepricelistname ?? "",
    };
}, [mounted, loginUserDetail, storeData, islogin]);



const { data: albumData = [], isLoading } = useSWR(
  finalID && pricingContext
    ? [storeData, pricingContext, finalID]
    : null,
  fetchAlbum
);

  const skeletons = Array.from({ length: 5 }).map((_, i) => (
    <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={i} mb={4}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Skeleton variant="rectangular" height={300} />
        <CardContent>
          <Skeleton width="80%" />
        </CardContent>
      </Card>
    </Grid>
  ));

  return (
    <Grid container spacing={3} justifyContent="center" alignContent="start" mt={2}>
      {isLoading
        ? skeletons
        : albumData.slice(0, 5).map((album, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
              <Card
                sx={{
                  overflow: "hidden",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
                }}
                component={Link}
                href={`/p/${album?.AlbumName}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`}
                prefetch={false}
              >
                <CardActionArea>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3 / 4",
                      overflow: "hidden",
                      bgcolor: "rgba(0,0,0,0.04)",
                    }}
                  >
                    <CardMedia
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      component="img"
                      image={imageUrl + album?.AlbumImageFol + "/" + album?.AlbumImageName || "/image-not-found.jpg"}
                      alt={"album-image"}
                      onError={(e) => {
                        e.target.src = "/image-not-found.jpg";
                      }}
                      width={600}
                      height={800}
                      loading="lazy"
                    />
                    <CardContent>
                      <Typography variant="body1" noWrap fontWeight={600} color="text.primary">
                        {album?.AlbumName}
                      </Typography>
                    </CardContent>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
    </Grid>
  );
};

export default Main;
