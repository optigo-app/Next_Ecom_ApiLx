import React from "react";
import { Box, Grid, Card, Skeleton ,CardMedia} from "@mui/material";

const SkeletonLoader = () => {
  const skeletonArray = new Array(4).fill(0);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>

      {/* ---------------- HEADER SKELETON ---------------- */}
      <CardMedia
                        style={{ width: "100%" }}
                        className="roop_WlListImage"
                    >
                        <Skeleton
                            animation="wave"
                            variant="rect"
                            width="100%"
                            height={400}
                            sx={{
                                backgroundColor: "#e8e8e86e",
                                '@media (max-width: 500px)': {
                                    height: '300px !important',
                                },
                                '@media (max-width: 400px)': {
                                    height: '200px !important',
                                }
                            }}
                        />
                    </CardMedia>
    </Box>
  );
};

export default SkeletonLoader;
