import React from "react";
import { Box, Container, Skeleton } from "@mui/material";

const FeaturedProductsSkeleton = () => {
  return (
    <Container maxWidth="xxl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
      {/* 1. Header Block (Title & Subtitle) */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Skeleton
          variant="text"
          width={320}
          height={50}
          animation="wave"
          sx={{ mx: "auto", mb: 1, bgcolor: "#e0e0e0" }}
        />
        <Skeleton
          variant="text"
          width={480}
          height={24}
          animation="wave"
          sx={{ mx: "auto", bgcolor: "#eeeeee" }}
        />
      </Box>

      {/* 2. Tab Links Block */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mb: 5,
        }}
      >
        <Skeleton variant="text" width={45} height={30} animation="wave" />
        <Skeleton variant="text" width={55} height={30} animation="wave" />
        <Skeleton variant="text" width={85} height={30} animation="wave" />
        <Skeleton variant="text" width={75} height={30} animation="wave" />
      </Box>

      {/* 3. Carousel Area with Side Navigation Buttons and 4 Product Cards */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Left Arrow Button Skeleton */}
        <Skeleton
          variant="rectangular"
          width={36}
          height={36}
          animation="wave"
          sx={{ borderRadius: 1, flexShrink: 0, display: { xs: "none", sm: "block" } }}
        />

        {/* 4 Product Cards Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                bgcolor: "#f8f8f8",
                p: 1.5,
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                minHeight: 440, // Ensures the parent card container has a layout height
              }}
            >
              {/* Wishlist Heart Icon Placeholder */}
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                animation="wave"
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  zIndex: 2,
                }}
              />

              {/* Product Image Area with explicit minHeight */}
              <Skeleton
                variant="rectangular"
                width="100%"
                animation="wave"
                sx={{
                  bgcolor: "#ececec",
                  borderRadius: 0.5,
                  mb: 2,
                  minHeight: 280, 
                  transform: "none",
                }}
              />

              {/* Product Title */}
              <Skeleton
                variant="text"
                width="60%"
                height={22}
                animation="wave"
                sx={{ mb: 0.5 }}
              />

              {/* Product Subtitle / Category */}
              <Skeleton
                variant="text"
                width="40%"
                height={16}
                animation="wave"
                sx={{ mb: 0.5 }}
              />

              {/* Product Price */}
              <Skeleton
                variant="text"
                width="30%"
                height={18}
                animation="wave"
                sx={{ mb: 2 }}
              />

              {/* Add To Cart Button Placeholder */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={38}
                animation="wave"
                sx={{ bgcolor: "#e2e2e2", borderRadius: 0.5, mt: "auto", transform: "none" }}
              />
            </Box>
          ))}
        </Box>

        {/* Right Arrow Button Skeleton */}
        <Skeleton
          variant="rectangular"
          width={36}
          height={36}
          animation="wave"
          sx={{ borderRadius: 1, flexShrink: 0, display: { xs: "none", sm: "block" } }}
        />
      </Box>
    </Container>
  );
};

export default FeaturedProductsSkeleton;