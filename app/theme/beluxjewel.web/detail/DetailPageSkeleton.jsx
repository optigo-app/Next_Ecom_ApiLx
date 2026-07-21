"use client";
import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function DetailPageSkeleton() {
  return (
    <Box
      sx={{
        pt: { xs: 2, md: 4 },
        px: { sm: 2, xs: 1, md: 8 },
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#fff",
      }}
    >
      <Grid container spacing={{ xs: 1, md: 1 }}>
        {/* LEFT COLUMN: Matching LeftSide.jsx (md: 7, spacing: 0.6) */}
        <Grid size={{ xs: 12, sm: 12, md: 7 }}>
          <Grid container spacing={0.6}>
            {Array.from(new Array(2)).map((_, index) => (
              <Grid key={index} size={{ xs: 6 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#eeeeee80",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      width: "100%",
                      height: "100%",
                      aspectRatio: { xs: "3/4", sm: "1/1.25", md: "1/1.3" },
                      bgcolor: "#eeeeee80",
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* RIGHT COLUMN: Matching RightSide.jsx (md: 5, px: { xs: 1, sm: 2, md: 4 }) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: "sticky",
              top: 150,
              height: "fit-content",
              width: "100%",
              px: {
                xs: 1,
                sm: 2,
                md: 4,
              },
              boxSizing: "border-box",
            }}
          >
            {/* Title Line Skeleton */}
            <Skeleton
              variant="text"
              width="40%"
              height={26}
              animation="wave"
              sx={{ bgcolor: "#eeeeee80", mb: 1 }}
            />

            {/* Price Skeleton */}
            <Skeleton
              variant="text"
              width="50%"
              height={42}
              animation="wave"
              sx={{ bgcolor: "#eeeeee80", mb: 3 }}
            />

            {/* Specification Grid (Metal Purity, Color, Diamond Quality, Net Wt) */}
            <Grid
              container
              spacing={2}
              sx={{
                mb: 3,
                py: 2,
                borderTop: "1px solid #f0f0f0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {Array.from(new Array(4)).map((_, i) => (
                <Grid key={i} size={{ xs: 6 }}>
                  <Skeleton
                    variant="text"
                    width="45%"
                    height={16}
                    sx={{ bgcolor: "#eeeeee80", mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={22}
                    sx={{ bgcolor: "#eeeeee80" }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Customize Design Button Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={48}
              animation="wave"
              sx={{ bgcolor: "#eeeeee80", borderRadius: 1, mb: 2 }}
            />

            {/* Action Buttons Row (Add to Cart / Wishlist) */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Skeleton
                variant="rectangular"
                width="50%"
                height={48}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80", borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width="50%"
                height={48}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80", borderRadius: 1 }}
              />
            </Stack>

            {/* Product Guarantees & Care List Skeleton */}
            <Stack spacing={1.5} sx={{ mb: 4, pl: 1 }}>
              {Array.from(new Array(4)).map((_, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ bgcolor: "#eeeeee80" }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={18}
                    sx={{ bgcolor: "#eeeeee80" }}
                  />
                </Stack>
              ))}
            </Stack>

            {/* Product Detail Tabs Header Skeleton */}
            <Stack
              direction="row"
              spacing={4}
              sx={{ borderTop: "1px solid #f0f0f0", pt: 2 }}
            >
              <Skeleton
                variant="text"
                width={110}
                height={24}
                sx={{ bgcolor: "#eeeeee80" }}
              />
              <Skeleton
                variant="text"
                width={110}
                height={24}
                sx={{ bgcolor: "#eeeeee80" }}
              />
              <Skeleton
                variant="text"
                width={110}
                height={24}
                sx={{ bgcolor: "#eeeeee80" }}
              />
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
