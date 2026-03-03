import React from "react";
import { Grid, Skeleton } from "@mui/material";

const ProductListSkeleton = ({ count = 6 }) => {
  return (
    <Grid container spacing={0}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item size={{ xs: 6 }} key={index}>
          <div style={{ padding: "8px" }}>

            <Skeleton
              variant="rectangular"
              width="100%"
              height={220}
              animation="wave"
              sx={{ borderRadius: "12px" }}
            />

            {/* Title Skeleton */}
            <Skeleton
              variant="text"
              width="90%"
              height={24}
              animation="wave"
              sx={{ mt: 1 }}
            />

            <Skeleton
              variant="text"
              width="70%"
              height={20}
              animation="wave"
            />

            {/* Small details */}
            <Skeleton
              variant="text"
              width="50%"
              height={18}
              animation="wave"
            />

            {/* Price */}
            <Skeleton
              variant="text"
              width="40%"
              height={28}
              animation="wave"
              sx={{ mt: 1 }}
            />

          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductListSkeleton;
