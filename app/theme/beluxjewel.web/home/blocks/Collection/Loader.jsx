import React from "react";
import { Box, Container, Grid, Skeleton } from "@mui/material";

const CollectionSkeleton = () => {
  const layoutPattern = [12, 12, 6, 6, 12, 12, 6, 6];

  return (
    <Container maxWidth={false} sx={{ py: 8, px: { xs: 2, md: 8 } }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mx: "auto", bgcolor: "rgba(0,0,0,0.05)" }} />
        <Skeleton variant="text" width={600} height={30} sx={{ mx: "auto", mt: 1, bgcolor: "rgba(0,0,0,0.04)" }} />
        <Skeleton variant="text" width={400} height={30} sx={{ mx: "auto", bgcolor: "rgba(0,0,0,0.04)" }} />
      </Box>

      <Grid container spacing={3}>
        {layoutPattern.map((size, index) => {
          const height = size === 12 ? 500 : 400;

          return (
            <Grid item xs={12} md={size} key={index}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  borderRadius: 8,
                }}
              >
                {/* The Big Block Loader */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={height}
                  animation="wave"
                  sx={{
                    bgcolor: "#f4f4f4", 
                    transform: "scale(1, 1)", 
                    borderRadius: 8,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Skeleton width={120} height={30} sx={{ bgcolor: "rgba(0,0,0,0.1)", borderRadius: 8 }} />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default CollectionSkeleton;
