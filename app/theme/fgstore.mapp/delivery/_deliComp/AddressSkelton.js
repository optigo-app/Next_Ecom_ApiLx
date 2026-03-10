import React from "react";
import { Box, Skeleton, Card, CardContent, Grid } from "@mui/material";

const SkeletonLoader = () => {
  const skeletonArray = new Array(6).fill(0);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Grid container spacing={2}>
        {skeletonArray.map((_, index) => (
          <Grid item size={{ sm: 12, xs: 12 }} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <CardContent>
                <Skeleton
                  variant="text"
                  width="40%"
                  height={30}
                  animation="wave"
                />

                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  animation="wave"
                />

                <Skeleton
                  variant="text"
                  width="70%"
                  height={20}
                  animation="wave"
                />

                <Skeleton
                  variant="text"
                  width="90%"
                  height={20}
                  animation="wave"
                />

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Skeleton
                    variant="rounded"
                    width={90}
                    height={36}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rounded"
                    width={90}
                    height={36}
                    animation="wave"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SkeletonLoader;
