import React from "react";
import ProductCard from "./ProductCard";
import ProductListSkeleton from "./ProductListSkeleton";
import { Box, Typography, Button, Grid } from "@mui/material";


const ProductView = ({
  data,
  imageMap,
  imageAvailability,
  getDynamicVideo,
  getDynamicImages,
  getDynamicRollImages,
  metalColorType,
  isshowDots,
  menuParams,
  handleCartandWish,
  cartArr,
  wishArr,
  handleImgRollover,
  setIsRollOverVideo,
  handleLeaveImgRolloverImg,
  storeInit,
  handleMoveToDetail,
  rollOverImgPd,
  isRollOverVideo,
  maxwidth590px,
  loginUserDetail,
  selectedMetalId,
  location,
  metalColorCombo,
  isProdLoading,
  filterProdListEmpty,
  ImageView
}) => {

  if (isProdLoading) {
    return <ProductListSkeleton />
  }

  else if (filterProdListEmpty) {
    return <NoResults />
  }

  return (
    <>
      <Grid container spacing={0} className="customGrid" sx={{ width: "100%", margin: 0 }}>
        {data?.map((productData, index) => {
          const images = imageMap[productData.designno] || {};
          const yellowImage = images?.yellowImage;
          const whiteImage = images?.whiteImage;
          const roseImage = images?.roseImage;
          const yellowRollImage = images?.yellowRollImage;
          const whiteRollImage = images?.whiteRollImage;
          const roseRollImage = images?.roseRollImage;
          const isLoading = productData?.loading;
          const isAvailable = imageAvailability[productData?.autocode];

          return (
            <Grid item size={{ xs: ImageView ? 12 : 6 }} key={index} className="gridItem">
              <ProductCard
                key={index}
                productData={productData}
                imageMap={imageMap}
                imageAvailability={imageAvailability}
                isshowDots={isshowDots}
                menuParams={menuParams}
                handleCartandWish={handleCartandWish}
                cartArr={cartArr}
                wishArr={wishArr}
                handleImgRollover={handleImgRollover}
                setIsRollOverVideo={setIsRollOverVideo}
                handleLeaveImgRolloverImg={handleLeaveImgRolloverImg}
                storeInit={storeInit}
                handleMoveToDetail={handleMoveToDetail}
                rollOverImgPd={rollOverImgPd}
                isRollOverVideo={isRollOverVideo}
                videoUrl={getDynamicVideo?.(
                  productData.designno,
                  productData.VideoCount,
                  productData.VideoExtension
                )}
                RollImageUrl={getDynamicRollImages?.(
                  productData.designno,
                  productData.ImageCount,
                  productData.ImageExtension
                )}
                imageUrl={getDynamicImages?.(
                  productData.designno,
                  productData.ImageExtension
                )}
                metalColorType={metalColorType}
                maxwidth590px={maxwidth590px}
                loginUserDetail={loginUserDetail}
                selectedMetalId={selectedMetalId}
                productIndex={index}
                yellowImage={yellowImage}
                whiteImage={whiteImage}
                roseImage={roseImage}
                yellowRollImage={yellowRollImage}
                whiteRollImage={whiteRollImage}
                roseRollImage={roseRollImage}
                location={location}
                metalColorCombo={metalColorCombo}
                isLoading={isLoading}
                isAvailable={isAvailable}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ProductView;


const NoResults = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        backgroundColor: "#fff",
      }}
    >
      <Box
        component="img"
        src="/Assets/search.svg"
        alt="No search results"
        sx={{
          width: 220,
          height: 220,
          mb: 3,
          opacity: 0.8,
        }}
      />

      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 1 }}
      >
        Product not found
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 260, mb: 3 }}
      >
        We couldn't find any products matching your search.
      </Typography>

      <Button
        variant="contained"
        size="medium"

        sx={{
          textTransform: "none",
          px: 4,
          boxShadow: 'none',
          bgcolor: '#1a6bff',
          fontWeight: 600,
          color: '#fff'
        }}
      >
        Explore
      </Button>
    </Box>
  );
};
