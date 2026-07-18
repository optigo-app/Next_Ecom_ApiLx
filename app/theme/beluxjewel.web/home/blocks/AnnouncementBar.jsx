"use client";

import { useRef } from "react";
import "./AnnouncementBar.scss";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";

const items = [
  "NATURAL AND LAB-GROWN DIAMOND JEWELRY",
  "FREE SHIPPING ON ALL ORDERS ABOVE $500",
  "CUSTOM JEWELRY MANUFACTURING AVAILABLE",
  "BOOK YOUR VIRTUAL APPOINTMENT TODAY",
];

export default function AnnouncementBar() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <Box
      className="bar"
      sx={{
        height: 36,
        display: "flex",
        alignItems: "center",
        px: 2,
        width: "100%",
        marginBottom: "-1px",
      }}
    >
      <IconButton
        ref={prevRef}
        size="small"
        sx={{ color: "white", p: 0, width: 28, height: 28, flexShrink: 0 }}
      >
        <ChevronLeftRoundedIcon fontSize="small" />
      </IconButton>

      <Box sx={{ flex: 1, minWidth: 0, mx: 2 }}>
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          loop={items.length > 1}
          speed={600}
          allowTouchMove={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          style={{ width: "100%" }}
        >
          {items.map((item) => (
            <SwiperSlide key={item}>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  lineHeight: "36px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item}
              </Typography>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <IconButton
        ref={nextRef}
        size="small"
        sx={{ color: "white", p: 0, width: 28, height: 28, flexShrink: 0 }}
      >
        <ChevronRightRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
