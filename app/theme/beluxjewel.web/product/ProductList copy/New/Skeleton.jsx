import { Box, Card, CardContent, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import DetailPageSkeleton from "@/app/theme/beluxjewel.web/detail/DetailPageSkeleton";
import "./index.scss";

const ProductSkeleton = () => (
  <Card
    sx={{
      transition: "all 0.3s ease",
      border: "none",
      boxShadow: "none",
      outline: "none",
    }}
  >
    <Box sx={{ position: "relative", paddingTop: "120%" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "#eeeeee80",
          borderRadius: 4,
          border: "none",
          boxShadow: "none",
          outline: "none",
        }}
      />
    </Box>
    <CardContent sx={{ px: 1, py: 1.5 }}>
      <Skeleton
        width="40%"
        height={20}
        animation="wave"
        sx={{ bgcolor: "#eeeeee80", mb: 1 }}
      />
      <Skeleton
        width="85%"
        height={20}
        animation="wave"
        sx={{ bgcolor: "#eeeeee80", mb: 1 }}
      />
      <Skeleton
        width="60%"
        height={20}
        animation="wave"
        sx={{ bgcolor: "#eeeeee80", mb: 1 }}
      />
      <Skeleton
        width="75%"
        height={20}
        animation="wave"
        sx={{ bgcolor: "#eeeeee80" }}
      />
    </CardContent>
  </Card>
);

export default ProductSkeleton;

export const DetailSkeleton = () => {
  return <DetailPageSkeleton />;
};
