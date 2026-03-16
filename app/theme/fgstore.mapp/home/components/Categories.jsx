"use client";
import React, { useState, useEffect } from "react";
import Headers from "./composable/Headers";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { HomeCategoryApi } from "@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

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
            <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "90px" }}>
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
