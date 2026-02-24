import { Box, Typography,  Card, CardMedia, Stack } from "@mui/material";
import ImageWithFallback from "./composable/ImageWithFallback";

const products = [
  {
    id: 1,
    brand: "ZALKARI",
    title: "Golden Royal Blue Pendant Necklace",
    currentPrice: "2,011",
    originalPrice: "5,749",
    discount: "65% OFF",
    // Using a placeholder that resembles the dark background in your image
    image: "https://cdn.eternz.com/thumbnails/products/ER02938_5_8b5743a7_thumbnail_1024.jpg",
  },
  {
    id: 2,
    brand: "ZALKARI",
    title: "Rose Gold Princess Classic Pendant",
    currentPrice: "1,661",
    originalPrice: "4,749",
    discount: "65% OFF",
    image: "https://cdn.eternz.com/thumbnails/products/ER02316_5_1_54704ae9_thumbnail_1024.jpg",
  },
  {
    id: 3,
    brand: "ZALKARI",
    title: "Silver Lord Ganesha Pendant",
    currentPrice: "2,011",
    originalPrice: "5,749",
    discount: "65% OFF",
    image: "https://cdn.eternz.com/thumbnails/products/ER03372_5_997a5c65_thumbnail_1024.jpg",
  },
  {
    id: 4,
    brand: "ZALKARI",
    title: "Elegant Diamond Cut Chain",
    currentPrice: "3,100",
    originalPrice: "6,200",
    discount: "50% OFF",
    image: "https://cdn.eternz.com/thumbnails/products/TLBR022_5_d14195e5_thumbnail_1024.jpg", // Tests the fallback
  },
];

 function AlbumSection() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 0,
        py: 1,
        mt: 4,
      }}
    >
      <Card
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 240,
          height: "100%",
          overflow: "hidden",
          zIndex: 1,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          borderTopRightRadius: "22px",
          borderBottomRightRadius: "22px",
        }}
      >
        <CardMedia
          component="img"
          image="https://sonasons.optigoapps.com/WebSiteStaticImage/Banner/trendingbanner1.png"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Card>

      {/* SCROLL AREA */}
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pl: 23, py: 2.5, "&::-webkit-scrollbar": { display: "none" } }}>
        {products.map((product) => (
          <Card
            key={product.id}
            elevation={0}
            sx={{
              minWidth: "150px",
              maxWidth: "150px",
              flexShrink: 0,
              backgroundColor: "transparent",
              scrollSnapAlign: "start",
              zIndex: 3,
              bgcolor: "#fff",
              p: 1,
              borderRadius: 3,
            }}
          >
            <ImageWithFallback src={product.image} alt={product.title} />
            <Box sx={{ mt: 0.8, px: 0.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#757575",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 0.4,
                }}
              >
                {product.title}
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={0.5} flexWrap="wrap">
                <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#000" }}>₹{product.currentPrice}</Typography>

                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#9e9e9e",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{product.originalPrice}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "11px",
                    color: "#2e7d32",
                  }}
                >
                  {product.discount}
                </Typography>
              </Stack>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
export default AlbumSection;