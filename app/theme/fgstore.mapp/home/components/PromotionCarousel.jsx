'use client'
import React from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// --- MOCK DATA ---
const mockPromotions = [
  {
    id: 1,
    imageUrl:'/banner/2.jpg',
    color: "#FFD700", // Gold accent
  },
  {
    id: 2,
    imageUrl:'/banner/3.jpg',
    color: "#3F88C5", // Blue accent
  },
  {
    id: 3,
    imageUrl:'/banner/4.jpg',
    color: "#B03A2E", // Red accent
  },
  {
    id: 4,
    imageUrl:'/banner/5.jpg',
    color: "#B03A2E", // Red accent
  },
];

const PromotionCarousel = () => {
  const swiperStyles = {
    '& .swiper-pagination': { bottom: '4px !important' },
    '& .swiper-pagination-bullet': {
      bgcolor: 'rgba(255,255,255,0.4)',
      opacity: 1,
      width: 6,
      height: 6,
      transition: 'all 0.3s ease',
    },
    '& .swiper-pagination-bullet-active': {
      bgcolor: 'white',
      width: '24px',
      borderRadius: '8px'
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", pt: 0, px: 0 }}>
      <Box sx={swiperStyles}>
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          slidesPerView={1} // Shows 1.2 slides (a peek of the next one)
          centeredSlides={true} // Centers the current slide
          spaceBetween={16} // Gap between slides
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            600: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            1024: {
              // Desktop
              slidesPerView: 2.5,
              spaceBetween: 32,
            },
          }}
        >
          {mockPromotions.map((promo) => (
            <SwiperSlide key={promo.id}>
              <SlideContent promo={promo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

// Component for the individual slide content
const SlideContent = ({ promo }) => (
  <Box
    sx={{
      backgroundImage: `url(${promo.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: { xs: "200px", sm: "250px", md: "300px" }, // Responsive height
      borderRadius: 4,
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)", // Subtle shadow
      mx:1
    }}
  >
    {/* TEXT OVERLAY */}
    {promo.title && (
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          // Gradient for text contrast
          background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
          color: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ color: promo.color || "#fff", lineHeight: 1.2 }}>
          {promo.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {promo.subtitle}
        </Typography>
      </Box>
    )}
  </Box>
);

export default PromotionCarousel;





























//  {/* --- Hero Slider Section (Swiper) --- */}
//           <Box
//               sx={{
//                   // Customizing Swiper pagination dots to match the image
//                   '& .swiper-pagination': { bottom: '12px !important' },
//                   '& .swiper-pagination-bullet': {
//                       bgcolor: 'rgba(255,255,255,0.4)',
//                       opacity: 1,
//                       width: 6,
//                       height: 6,
//                       transition: 'all 0.3s ease'
//                   },
//                   '& .swiper-pagination-bullet-active': {
//                       bgcolor: 'white',
//                       width: '16px',
//                       borderRadius: '8px'
//                   },
//                   //   Custom Pagination Styling
//                       "& .swiper-pagination": {
//                         position: "relative", // Position above the carousel, not absolutely at the bottom
//                         mt: 2,
//                         mb: 0,
//                         bottom: "unset !important",
//                       },
//                       "& .swiper-pagination-bullet": {
//                         width: "8px",
//                         height: "8px",
//                         transition: "all 0.3s ease",
//                         opacity: 0.6,
//                         background: "rgba(0,0,0,0.5)", // Default dot color
//                         margin: "0 2px",
//                       },
//                       // Active dot style - longer and primary color
//                       "& .swiper-pagination-bullet-active": {
//                         width: "28px",
//                         borderRadius: "4px",
//                         opacity: 1,
//                         background: "linear-gradient(135deg, #3a3dff 0%, #5f71ff 40%, #2b1aff 100%)", // iOS Blue for premium feel
//                       },
//               }}
//           >
//               <Swiper
//                   modules={[Pagination]}
//                   pagination={{ clickable: true }}
//                   spaceBetween={16}
//                   slidesPerView={1}
//                   style={{
//                       marginRight:0
//                   }}
//               >
//                   {/* Slide 1 */}
//                   {Array.from({ length: 3 }, (_, i) => (
//                       <SwiperSlide key={i}>
//                           <Box
//                               sx={{
//                                   borderRadius: '20px',
//                                   p: 2,
//                                   display: 'flex',
//                                   position: 'relative',
//                                   overflow: 'hidden',
//                                   minHeight: '190px',
//                                   border: '0.2px solid #ddd',
//                                   background: `url(${ImageLits[i]}) no-repeat`,
//                                   backgroundSize: 'cover',
//                                   alignItems: 'center',
//                                   inset: 5
//                               }}
//                           >
//                               {/* Text Content */}
//                               <Box sx={{ zIndex: 2, maxWidth: '65%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                                   <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.5px' }}>
//                                       iPhone 16 Pro
//                                   </Typography>
//                                   <Typography sx={{ fontSize: '0.8rem', mb: 3, lineHeight: 1.4 }}>
//                                       Extraordinary Visual<br />& Exceptional Power
//                                   </Typography>
//                                   <Button
//                                       variant="contained"
//                                       disableElevation
//                                       sx={{
//                                           borderRadius: '50px',
//                                           textTransform: 'none',
//                                           fontWeight: 600,
//                                           fontSize: '0.8rem',
//                                           px: 2.5,
//                                           py: 0.8,
//                                       }}
//                                   >
//                                       Shop Now
//                                   </Button>
//                               </Box>
//                           </Box>
//                       </SwiperSlide>
//                   ))}
//               </Swiper>
//           </Box>