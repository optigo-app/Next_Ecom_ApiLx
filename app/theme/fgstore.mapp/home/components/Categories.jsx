"use client";
import React, { useState, useEffect } from "react";
import Headers from "./composable/Headers";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { HomeCategoryApi } from "@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const categoryImages = [
  {
    CategoryName: "Mangalsutra",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/Mangalsutra1.jpg",
  },
  {
    CategoryName: "Pendants",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/pendent.jpg",
  },
  {
    CategoryName: "Men's chain",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/Mens'chain.jpg",
  },
  {
    CategoryName: "Bangles",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/Bangals1.png",
  },
  {
    CategoryName: "Ring",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/rings.jpg",
  },
  {
    CategoryName: "EARING",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/Earings1.png",
  },
  {
    CategoryName: "NACKLACE",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/NECKLACE1.jpg",
  },
  {
    CategoryName: "Bracelet",
    ImageUrl: "http://max.orail.co.in/WebSiteStaticImage/Category/new-image/BRACELATE2.jpg",
  },
];

const Categories = () => {
  const { finalId } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await HomeCategoryApi(finalId);

      const apiData = res?.Data?.rd || [];

      if (apiData.length > 0) {
        const mappedData = apiData.map((item) => ({
          ...item,
          img: categoryImages.find(
            (cat) =>
              cat.CategoryName.toLowerCase() ===
              item.CategoryName?.toLowerCase()
          )?.ImageUrl,
        }));

        setCategories(mappedData);
      } else {
        // ✅ fallback to local data
        setCategories(categoryImages);
      }

    } catch (err) {
      console.log(err);

      // ✅ fallback on error
      setCategories(categoryImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!loading && categories?.length === 0) {
    return null;
  }

  return (
    <>
      <Headers title={"Categories"} />
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, px: 1.5, py: 1.5, "&::-webkit-scrollbar": { display: "none" } }}>
        {
          loading ? (
            Array.from(new Array(4)).map((_, index) => (
              <Box key={index} sx={{ minWidth: "80px", width: "80px" }}>
                <Skeleton
                  variant="rectangular"
                  width="70px"
                  height="70px"
                  sx={{ borderRadius: 50, bgcolor: "rgba(0,0,0,0.05)" }}
                />
              </Box>
            ))
          ) : (categories.map((cat, index) => (
            <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px" }}>
              <Avatar src={cat.img || cat.ImageUrl} sx={{ width: 70, height: 70, mb: 1, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }} />
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
