import React from "react";
import { Box, Container, Skeleton } from "@mui/material";

const CollectionSkeleton = () => {
  const totalItems = 5;

  // Dynamic clipPath based on position in the CURRENT view
  const getClipPath = (index, total) => {
    if (total <= 1) return "none";
    if (index === 0) {
      return "polygon(0% 0%, 100% 0%, 93% 100%, 0% 100%)";
    }
    if (index === total - 1) {
      return "polygon(7% 0, 100% 0, 100% 100%, 0 100%)";
    }
    return "polygon(7% 0%, 100% 0%, 92% 100%, 0% 100%)";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 1, // matches Swiper spaceBetween={8} (8px)
          width: "100%",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: totalItems }).map((_, index) => (
          <Box
            key={index}
            sx={{
              height: 480,
              position: "relative",
              overflow: "hidden",
              clipPath: getClipPath(index, totalItems),
              // Match Swiper breakpoints:
              // 0px - 599px: Show 1 item (100% width)
              width: "100%",
              flex: "0 0 100%",

              // 600px - 1199px: Show 3 items (~33.33% width each)
              "@media (min-width: 600px)": {
                width: "calc((100% - 16px) / 3)",
                flex: "0 0 calc((100% - 16px) / 3)",
                // Hide items beyond 3rd on tablet to mimic Swiper view
                display: index >= 3 ? "none" : "block",
              },

              // 1200px+: Show 5 items (20% width each)
              "@media (min-width: 1200px)": {
                width: "calc((100% - 32px) / 5)",
                flex: "0 0 calc((100% - 32px) / 5)",
                display: "block",
              },

              // Hide items beyond 1st on mobile
              "@media (max-width: 599px)": {
                display: index >= 1 ? "none" : "block",
              },
            }}
          >
            {/* Background Card Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                bgcolor: "#e0e0e0",
                transform: "none",
              }}
            />

            {/* Bottom Text Overlays */}
            <Box
              sx={{
                position: "absolute",
                bottom: 30,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Skeleton
                variant="text"
                width="50%"
                height={24}
                animation="wave"
                sx={{ bgcolor: "rgba(0, 0, 0, 0.12)" }}
              />
              <Skeleton
                variant="text"
                width="30%"
                height={16}
                animation="wave"
                sx={{ bgcolor: "rgba(0, 0, 0, 0.08)" }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default CollectionSkeleton;