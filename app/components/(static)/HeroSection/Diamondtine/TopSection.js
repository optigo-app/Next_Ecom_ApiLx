 "use client"

import React from 'react'
import './TopSection.modul.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
 
const SonasliderData = [
    {
        imageUrl: "/WebSiteStaticImage/Banner/diamondtine/Homepagemainbanner1.png",
    },
    {
        imageUrl: "/WebSiteStaticImage/Banner/diamondtine/Homepagemainbanner2.png",
    },
    {
        imageUrl: "/WebSiteStaticImage/Banner/diamondtine/Homepagemainbanner3.png",
    },
];

const middlebanner = "/WebSiteStaticImage/Banner/diamondtine/middlebanner1.png";
 

export default  function TopSection( ) {

    
    
 
     
    return (
        <div className='dt_topSectionMain' onContextMenu={(e) => {
            e.preventDefault();
        }}>
            <Swiper
                pagination={{ clickable: false }}
                className="mySwiper"
                loop={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
            >
                {SonasliderData.map((slide, index) => (
                    <SwiperSlide key={index}>
                       
                        <img src={slide.imageUrl} alt={`Slide ${index}`}
                            onContextMenu={(e) => {
                                e.preventDefault();
                            }}
                            draggable={true}
                            className='dt_topSectionImg' style={{ width: '100%', height: '100%', minHeight: '700px', maxHeight: "800px", objectFit: 'cover' }} loading='eager' />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="dt_imageContainer">
            
                <img src={middlebanner}
                    onContextMenu={(e) => {
                        e.preventDefault();
                    }}
                    draggable={true}
                    className="dt_centeredImg" alt="Diamondtine Banner" />
            </div>
        </div>
    )
}

 