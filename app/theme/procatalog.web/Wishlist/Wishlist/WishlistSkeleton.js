import React from "react";
import { Box, Grid, Card, Skeleton } from "@mui/material";

const SkeletonLoader = () => {
  const skeletonArray = new Array(4).fill(0);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>

      {/* ---------------- HEADER SKELETON ---------------- */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width="180px"
          height={32}
          sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: 1 }}
        />

        {/* Buttons Skeleton (Move All / Clear Wishlist) */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={140}
            height={36}
            sx={{ bgcolor: "rgba(0,0,0,0.06)", borderRadius: 2 }}
          />
          <Skeleton
            variant="rounded"
            width={140}
            height={36}
            sx={{ bgcolor: "rgba(0,0,0,0.06)", borderRadius: 2 }}
          />
        </Box>
      </Box>

      {/* ---------------- CARD GRID SKELETON ---------------- */}
      <Grid
        container
        spacing={2}
        sx={{ px: { xs: 1, sm: 2, md: 4 } }}
      >
        {skeletonArray.map((_, index) => (
          <Grid item size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3
          }}
            key={index}>
            <Card
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                p: 1.5,
                boxShadow: 'none !important',
                border: 'none !important',
                outline: 'none !important'
              }}
            >
              {/* Card Image Skeleton */}
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  aspectRatio: {
                    xs: "3 / 3",
                    sm: "1 / 1",
                    md: "1 / 0.9",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ bgcolor: "rgba(0,0,0,0.06)" }}
                />
              </Box>

              {/* Product Footer (GWT / Price) */}
              <Skeleton
                variant="text"
                height={20}
                width="40%"
                sx={{ bgcolor: "rgba(0,0,0,0.06)" }}
              />

              <Skeleton
                variant="text"
                height={20}
                width="30%"
                sx={{ bgcolor: "rgba(0,0,0,0.06)", mt: 1 }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SkeletonLoader;
