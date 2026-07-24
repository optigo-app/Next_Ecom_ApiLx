import React from "react";
import { Box, Container, Skeleton } from "@mui/material";

const CollectionSkeleton = () => {
  const totalItems = 5;

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
      {/* Flex container enforcing a single row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 1.5,
          width: "100%",
        }}
      >
        {Array.from({ length: totalItems }).map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: 1, // Equally distributes available space among all 5 items
              height: 480,
              position: "relative",
              overflow: "hidden",
              clipPath: getClipPath(index, totalItems),
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