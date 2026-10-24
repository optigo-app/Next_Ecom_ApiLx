"use client";
import React from "react";
import Headers from "./composable/Headers";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.client";

const IMAGE_NOT_FOUND = "/image-not-found.jpg";

const Categories = () => {
  const navigate = useNextRouterLikeRR().push;

 
  const { categories, loading, isError } = useWebContentManagement();

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

  if (isError) return null;

  if (!loading && categories.length === 0) {
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
              const name = cat?.name || "";
              return (
                <Box
                  key={cat?.recordId || cat?.masterId || index}
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
                    src={cat?.imageUrl || IMAGE_NOT_FOUND}
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
                    {cat?.catLabel || name}
                  </Typography>
                </Box>
              );
            })}
      </Box>
    </>
  );
};

export default Categories;