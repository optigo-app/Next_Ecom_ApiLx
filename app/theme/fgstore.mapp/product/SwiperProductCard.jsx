import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const SwiperProductCard = ({
  imageUrl,
  rollImageUrl,
  yellowImage,
  whiteImage,
  roseImage,
  selectedMetalColor,
}) => {

  const isMobile = window.innerWidth <= 768;

  const mainImage = useMemo(() => {
    if (selectedMetalColor === 1) return yellowImage;
    if (selectedMetalColor === 2) return whiteImage;
    if (selectedMetalColor === 3) return roseImage;
    return imageUrl;
  }, [selectedMetalColor, yellowImage, whiteImage, roseImage, imageUrl]);

  const imageArray = useMemo(() => {
    const images = [];
    if (mainImage) images.push(mainImage);
    if (rollImageUrl && rollImageUrl !== mainImage) images.push(rollImageUrl);
    return images;
  }, [mainImage, rollImageUrl]);

  if (!isMobile) return null;

  if (imageArray.length === 0) {
    return (
      <img
        src="/image-not-found.jpg"
        alt="fallback"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Swiper
        modules={[Pagination]}
        pagination={
          imageArray.length > 1
            ? {
                clickable: true,
                bulletClass: "custom-bullet",
                bulletActiveClass: "custom-bullet-active",
              }
            : false
        }
        style={{ width: "100%", height: "100%" }}
      >
        {imageArray.map((img, index) => (
          <SwiperSlide key={index}
          style={{
              width: "100%",
                height: "100%",
          }}
          >
            <img
              src={img}
              alt={`product-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image-not-found.jpg";
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperProductCard;
