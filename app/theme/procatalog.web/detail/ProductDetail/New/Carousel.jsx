import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const sample = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
  },
  {
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
  },
];

export default function JewelryCarousel({
  carouselItems,
  HandleImageDialogOpen = () => {},
  onSwipeNextDesign,
  onSwipePrevDesign,
}) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);

  const onTouchStart = (e) => {
    const t = e.touches?.[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    const t = e.changedTouches?.[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) onSwipeNextDesign?.();
    else onSwipePrevDesign?.();
  };

  const multiple = carouselItems.length > 1;

  return (
    <Box
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      sx={{
        width: "100%",
        position: "relative",
        mx: "auto",
        border: "1px solid #edededa1",
        borderRadius: 2,
        aspectRatio: "3/4",
        overflow: "hidden",
      }}
    >
      <Swiper
        key={carouselItems.map((c) => c.src).join("|")}
        onSwiper={(sw) => {
          setSwiperRef(sw);
          setActive(0);
        }}
        direction="vertical"
        slidesPerView={1}
        touchReleaseOnEdges
        onSlideChange={(swiper) => !swiper.destroyed && setActive(swiper.activeIndex)}
        style={{ width: "100%", height: "100%" }}
      >
        {carouselItems.map((item, i) => (
          <SwiperSlide key={i}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              {item.type === "image" && (
                <img
                  src={item.src}
                  onClick={() => HandleImageDialogOpen(i)}
                  style={{ width: "100%", height: "100%", maxWidth: 700, objectFit: "contain" }}
                />
              )}
              {item.type === "video" && (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  style={{ width: "100%", height: "100%", maxWidth: 700, objectFit: "contain" }}
                />
              )}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {multiple && <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          position: "absolute",
          right: 10,
          top: 0,
          bottom: 0,
          my: "auto",
          height: "fit-content",
          zIndex: 100,
        }}
      >
        {carouselItems.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              if (swiperRef && !swiperRef.destroyed) swiperRef.slideTo(index);
            }}
            sx={{
              width: 6,
              height: active === index ? 22 : 8,
              borderRadius: 10,
              backgroundColor: active === index ? "#000" : "#d0d0d0",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>}
    </Box>
  );
}
