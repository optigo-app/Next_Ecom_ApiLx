
"use client";

import React, { useState } from 'react'
import './Styles.scss'
 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import SwiperCore from 'swiper/core';
import { Autoplay, Pagination } from 'swiper/modules';


SwiperCore.use([Pagination]);

const AffiliationData = ({ banner }) => {

    const sliderData = [
        {
            imageUrl: "/Affiliation/Affiliation1.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation2.png",
        },
       
        {
            imageUrl: "/Affiliation/Affiliation3.png",
        },
       
        {
            imageUrl: "/Affiliation/Affiliation4.png",
        },
       
        {
            imageUrl: "/Affiliation/Affiliation5.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation6.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation7.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation8.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation9.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation10.png",
        },
        {
            imageUrl: "/Affiliation/Affiliation11.png",
        },  
        {
            imageUrl: "/Affiliation/Affiliation12.png",
        },
       

       
    ];

    return (
        <div>
            <div className='elv_affi_div'>
                <h2 className='elv_AffiliationComponents'>Affiliation</h2>
                <span className='elv_affi_subtitle'>Partnering for Excellence and Trust.</span>
            </div>
            <div className='AffiliationClassComponents' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        425: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 5,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 50,
                        },
                    }}
                    modules={[Autoplay]}
                    className="affli_swiper"
                >
                    {sliderData?.map((slide, index) => (
                        <SwiperSlide key={index} className="affiliation-slide">
                            <img
                                src={slide?.imageUrl}
                                // src={storImagePath() + slide?.imageUrl}
                                alt={`Slide ${index}`}
                                className="affiliation-image"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default AffiliationData;