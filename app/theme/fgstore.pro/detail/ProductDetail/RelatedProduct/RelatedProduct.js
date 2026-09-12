import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  styled,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const imageNotFound = "/image-not-found.jpg";

// ---- Clean Card ----
const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 4,
  background: "#ffffff",
  boxShadow: "0 0 0 rgba(0,0,0,0)", // No shadow
  border: "1px solid #efefef",
  overflow: "hidden",
}));

// ---- Stable image height (premium look) ----
const Image = styled("img")(({ theme }) => ({
  width: "100%",
  aspectRatio: "1 / 1.15",        // Consistent height
  objectFit: "cover",
  backgroundColor: "#fafafa",
  borderBottom: "1px solid #eee",
}));

export default function RelatedProduct({
  SimilarBrandArr,
  loginInfo,
  storeInit,
  handleMoveToDetail,
}) {
  const formatter = new Intl.NumberFormat("en-IN");
  const shouldUseSwiper = SimilarBrandArr?.length > 4;

  const renderProductCard = (elv, i) => (
    <ProductCard key={i} onClick={() => {
      const imgUrl = elv?.ImageCount > 0 ? storeInit?.CDNDesignImageFol + elv?.designno + "~1." + elv?.ImageExtension : imageNotFound;
      handleMoveToDetail(elv, imgUrl);
    }}>
      <CardActionArea disableRipple>
        <Image
          src={
            elv?.ImageCount > 0
              ? storeInit?.CDNDesignImageFol +
              elv?.designno +
              "~1." +
              elv?.ImageExtension
              : imageNotFound
          }
          onError={(e) => (e.target.src = imageNotFound)}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />

        <CardContent sx={{ textAlign: "center", pt: 2, pb: 2 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ fontSize: "15px", color: "#222" }}
          >
            {elv.designno}
          </Typography>

          {storeInit?.IsPriceShow === 1 && (
            <Typography
              variant="body2"
              sx={{ mt: 0.6, fontSize: "14px", color: "#555" }}
            >
              {(loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode) + " "}
              {formatter.format(elv.UnitCostWithMarkUp)}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </ProductCard>
  );

  return (
    <Box
      sx={{
        mt: 8,
        width: { lg: "60%", md: "70%", sm: "100%", xs: "100%" },
        mx: "auto",
      }}
    >
      {/* -------- Header -------- */}
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
          Similar Designs
        </Typography>
      </Box>

      {/* -------- GRID MODE -------- */}
      {!shouldUseSwiper && (
        <Grid container spacing={3}>
          {SimilarBrandArr?.slice(0, 4).map((elv, i) => (
            <Grid item size={{
              xs: 6,
              sm: 4,
              md: 3
            }} key={i}>
              {renderProductCard(elv, i)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* -------- SWIPER MODE -------- */}
      {shouldUseSwiper && (
        <Swiper
          spaceBetween={18}
          slidesPerView={1.3}
          loop
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1100: { slidesPerView: 4 },
          }}
        >
          {SimilarBrandArr?.map((elv, i) => (
            <SwiperSlide key={i}>{renderProductCard(elv, i)}</SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
}


// import React from "react";
// import "./related.modul.scss";
// import imageNotFound from '../../../../Assets/image-not-found.jpg';
// import { Link } from "react-router-dom";
// import { Box, Paper, Typography } from "@mui/material";

// const RelatedProduct = ({
//   SimilarBrandArr,
//   loginInfo,
//   storeInit,
//   handleMoveToDetail,
// }) => {
//   const formatter = new Intl.NumberFormat("en-IN");

//   return (
//     <Box
//       sx={{
//         mt: 8,
//         width: {
//           lg: "60%",
//           md: "70%",
//           sm: "100%",
//           xs: "100%",
//         },
//         mx: "auto",
//       }}
//     >
//       <Paper elevation={0}>
//           <Box sx={{ mb: 3, textAlign: "center", width: "100%" }}>
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 600,
//               color: "#1a1a1a",
//               letterSpacing: "-0.5px",
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//               textAlign: "center",
//             }}
//           >
//             Similar Designs
//           </Typography>
//           {/* <Divider sx={{ mt: 1.5, borderColor: "#e0e0e0" }} /> */}
//         </Box>

//           <div className="elv_main_RelatedProduct">
//             <div className="tab_card">
//               {SimilarBrandArr?.slice(0, 4)?.map((elv, i) => {
//                 return (
//                   <div
//                     className="TabCard_main"
//                     onClick={() => handleMoveToDetail(elv)}
//                   >
//                     {/* <div className="new">
//                 <p>new</p>
//               </div> */}
//                     <div className="cardhover">
//                       <img
//                         src={
//                           elv?.ImageCount > 0
//                             ?
//                             // storeInit?.DesignImageFol +
//                             //   elv?.designno +
//                             //   "_" +
//                             //   "1" +
//                             //   "." +
//                             //   elv?.ImageExtension

//                             storeInit?.CDNDesignImageFol + elv?.designno + "~" + "1" + "." + elv?.ImageExtension
//                             : imageNotFound
//                         }
//                         draggable={false}
//                         onContextMenu={(e) => e.preventDefault()}
//                         alt={elv?.id}
//                         onError={(e) => {
//                           e.target.src = imageNotFound;
//                         }}
//                       />
//                       {/* <div className="overlay_img">
//                     <img src={elv?.BackerImg} alt={elv?.id} />
//                   </div> */}
//                     </div>
//                     <div className="tab_hover_Details">
//                       <h3>{elv?.designno}</h3>
//                       {storeInit?.IsPriceShow == 1 && <small>
//                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode} &nbsp;
//                         {formatter.format(elv?.UnitCostWithMarkUp)}
//                       </small>}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//       </Paper>
//     </Box>
//   );
// };

// export default RelatedProduct;
