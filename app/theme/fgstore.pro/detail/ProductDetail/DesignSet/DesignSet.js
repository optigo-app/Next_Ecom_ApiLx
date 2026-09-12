import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  useTheme,
  useMediaQuery,
  Stack
} from "@mui/material";
import { formatter } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';

const DesignSet = ({
  storeInit,
  designSetList,
  imageNotFound,
  loginInfo,
  handleMoveToDetail,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!designSetList || designSetList.length === 0) return null;

  return (
    <Box
      sx={{
        mt: 8,
        width: { lg: "60%", md: "70%", sm: "100%", xs: "100%" },
        mx: "auto",
        mb: 8,

      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1a1a1a",
            letterSpacing: "-0.4px",
            fontSize: "22px",
          }}
        >
          Complete The Look
        </Typography>
      </Box>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={!isMobile}
        pagination={{ clickable: true }}
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
          paddingBottom: "40px"
        }}
      >
        {designSetList.map((set, index) => {
          const productDetail = set?.Designdetail ? JSON.parse(set.Designdetail) : [];

          return (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  borderRadius: 0.5,
                  overflow: "hidden",
                  height: { xs: "500px", md: "700px" },
                  border: "1px solid #efefef",
                }}
              >
                <img
                  src={
                    set?.DefaultImageName
                      ? `${storeInit?.DesignSetImageFol}${set?.designsetuniqueno}/${set?.DefaultImageName}`
                      : imageNotFound
                  }
                  // src={"https://cdn.carat  lane.com/media/static/images/V4/2026/04_April/Banner/TT/05/UB_Desktop.jpg"}

                  alt="Complete the look"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />

                {/* Products Container */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    px: { xs: 2, md: 6 },
                    zIndex: 2
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      overflowX: "auto",
                      pb: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {productDetail.map((ele, i) => {
                      const imgUrl = ele?.ImageCount > 0
                        ? `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`
                        : imageNotFound;

                      return (
                        <Card
                          key={i}
                          elevation={0}
                          sx={{
                            minWidth: { xs: "240px", md: "280px" },
                            maxWidth: { xs: "240px", md: "280px" },
                            borderRadius: 0.5,
                            bgcolor: "#f9f9f9",
                            backdropFilter: "blur(10px)",
                            flexShrink: 0,
                            border: "1px solid #f0f0f0"
                          }}
                        >
                          <CardActionArea
                            onClick={() => handleMoveToDetail(ele, imgUrl)}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box
                                sx={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: 0.6,
                                  overflow: "hidden",
                                  bgcolor: "#fff",
                                  flexShrink: 0,
                                }}
                              >
                                <img
                                  src={imgUrl}
                                  alt={ele?.designno}
                                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                  onError={(e) => { e.target.src = imageNotFound; }}
                                />
                              </Box>
                              <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  noWrap
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "0.8rem",
                                    color: "#333",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  {ele?.designno}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                  sx={{ display: 'block', mb: 0.5 }}
                                >
                                  {ele?.CategoryName}
                                </Typography>
                                {storeInit?.IsPriceShow === 1 && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#111", fontWeight: 600 }}
                                  >
                                    {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode} {formatter(ele?.UnitCostWithMarkUp)}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </CardActionArea>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default DesignSet;
