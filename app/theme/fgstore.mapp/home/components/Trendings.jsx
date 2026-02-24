
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { Box } from "@mui/material";

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

function Trendings() {
  return (
    <>
      <Headers title="Trendings" />
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1.5,
          pb: 3,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          px: 1.5,
        }}
      >
        {products.map((product) => (
         <ProductCard key={product.id} product={product} minWidth="150px" maxWidth="150px" /> 
        ))}
      </Box>
    </>
  );
}

export default Trendings ;