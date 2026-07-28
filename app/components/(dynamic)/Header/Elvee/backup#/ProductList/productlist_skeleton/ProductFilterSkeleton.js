import React from "react";
import {
  Grid,
  CardContent,
  Skeleton,
  useMediaQuery,
} from "@mui/material";

const ProductFilterSkeleton = () => {
  const cardsArray = Array.from({ length: 8 }, (_, index) => index + 1);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMobile600 = useMediaQuery("(max-width: 600px)");

  return (
    <div
      style={{
        display: "flex",
        flex: "1 1 80%",
        height: "auto",
        position: "relative",
      }}
    >
      <Grid container spacing={2} sx={{ height: "auto" }}>
        {cardsArray.map((item) => (
          <Grid
            item
            key={item}
            xs={6}   // 2 per row on extra small
            sm={6}    // 2 per row on small (≥600px)
            md={4}    // 3 per row on medium (≥900px / ~1000px)
            lg={3}    // 4 per row on large (≥1200px)
            sx={{ height: "fit-content" }}
          >
            <Skeleton
              animation="wave"
              variant="rect"
              width={"100%"}
              height="30vh"
            />
            <CardContent>
              <Skeleton
                animation="wave"
                variant="text"
                width={"80%"}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width={"60%"}
                height={20}
              />
            </CardContent>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductFilterSkeleton;
