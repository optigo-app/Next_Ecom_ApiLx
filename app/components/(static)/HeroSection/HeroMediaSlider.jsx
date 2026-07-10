
"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";


export default  function HeroMediaSlider({mainbanner }) {

const images=[
    "WebSiteStaticImage/Banner/vimalgolddiamond/Slider1.jpg",
    "WebSiteStaticImage/Banner/vimalgolddiamond/Slider2.jpg",
    "WebSiteStaticImage/Banner/vimalgolddiamond/Slider3.jpg"
]
 
  
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "55vh", sm: "70vh", md: "104vh" },
        overflow: "hidden",
        bgcolor: "#000",
      }}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        loop
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        // pagination={{
        //   clickable: true,
        //   dynamicBullets: true,
        // }}
        effect="fade"
        style={{ width: "100%", height: "100%" }}
      >
        {images?.map((item, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {/* {item.type === "video" ? (
                <Box
                  component="video"
                  src={item.src}
                  muted
                  autoPlay
                  loop
                  playsInline
                  poster={item.poster || ""}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : ( */}
                <Box
                  component="img"
                  src={item}
                  
                  onError={(e) => {
                    e.target.src = "/fallback.jpg";
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 5s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
              {/* )} */}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

 
