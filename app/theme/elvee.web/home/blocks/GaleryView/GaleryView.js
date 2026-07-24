"use client";

import React from 'react'
import './GaleryView.modul.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const sliderData = [
  {
    imageUrl: "/galery/photogallery2.webp",
  },
  {
    imageUrl: "/galery/photogallery3.webp",
  },
  {
    imageUrl: "/galery/photogallery4.jpg",
  },
  {
    imageUrl: "/galery/photogallery5.avif",
  },
];

export default function GaleryView() {
  return (
    <div className='el_mainGalleryConatinerID' id='mainGalleryConatinerID' name='mainGalleryConatinerID123'>
      <div className='elv_gallery_div'>
        <h2 className='galeryComponents'>Gallery</h2>
        <span className='elv_gallery_subtitle'>Where Every Piece Tells a Story.</span>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1240: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {sliderData?.map((slide, index) => (
          <SwiperSlide
            key={index}
            style={{
              marginRight: '0px',
              padding: '10px',
              height: '430px', // increased from 430px
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                loading="lazy"
                src={slide.imageUrl}
                alt={`Slide ${index}`}
                style={{
                  objectFit: 'cover', // fills the box uniformly, crops instead of shrinking
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}