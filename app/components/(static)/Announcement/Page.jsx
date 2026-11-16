"use client";

import { useMemo, useRef } from "react";
import "./AnnouncementBar.scss";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";

 
 

export default function AnnouncementBar({ announcementData }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { backgroundColor, textColor, items } = useMemo(() => {
    const content = announcementData || {};

    const list = Array.isArray(content.items)
      ? content.items.filter((item) => item?.text?.trim())
      : [];

    return {
      backgroundColor: content.backgroundColor || "#fff8f0",
      textColor: content.textColor || "#1f1a17",
      items: list,
    };
  }, [announcementData]);

  // Nothing to show
  if (!items.length) return null;

  const hasMultiple = items.length > 1;

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
        backgroundColor: `${backgroundColor} !important`,
      }}
    >
      <IconButton
        ref={prevRef}
        aria-label="Previous announcement"
        size="small"
        sx={{
          color: textColor,
          p: 0,
          width: 28,
          height: 28,
          flexShrink: 0,
          visibility: hasMultiple ? "visible" : "hidden",
        }}
      >
        <ChevronLeftRoundedIcon fontSize="small" />
      </IconButton>

      <Box sx={{ flex: 1, minWidth: 0, mx: 2 }}>
        <Swiper
          // re-init Swiper if the number of items changes
          key={items.map((i) => i.id ?? i.text).join("|")}
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          loop={hasMultiple}
          speed={600}
          allowTouchMove={hasMultiple}
          autoplay={
            hasMultiple
              ? {
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
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
          {items.map((item, index) => (
            <SwiperSlide key={item.id ?? `${item.text}-${index}`}>
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
                  color: textColor,
                }}
              >
                {item.text}
              </Typography>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <IconButton
        ref={nextRef}
        aria-label="Next announcement"
        size="small"
        sx={{
          color: textColor,
          p: 0,
          width: 28,
          height: 28,
          flexShrink: 0,
          visibility: hasMultiple ? "visible" : "hidden",
        }}
      >
        <ChevronRightRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}