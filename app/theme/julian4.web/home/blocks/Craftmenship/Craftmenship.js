
"use client";


import { Swiper, SwiperSlide } from 'swiper/react';
import './Craftmenship.modul.scss'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
 


const sliderData = [
    {
        imageUrl: "/banner/elvee/craftmanship2.png",
    },
    {
        imageUrl: "/banner/elvee/craftmanship1.png",
    },
    // {
    //     imageUrl: "/banner/elvee/promo3.jpg",
    // },
];

export default function Craftmenship() {
    return (
        <div className='el_craftmenshipId_main' name='craftmenshipId' id="craftmenshipId">
            <div className='elv_craftman_div'>
                <h2 className='craftmenship'>Our Craftmenship</h2>
                <span className='elv_craft_subtitle'>Crafting Timeless Elegance with Precision</span>
            </div>
            <Swiper
                navigation={true}
                modules={[Pagination, Navigation]}
                className="craft_mySwiper"
            >
                {sliderData?.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img loading="lazy" src={slide?.imageUrl} alt={`Slide ${index}`} style={{ width: '100%', height: '70vh', objectFit: 'cover' }} />
 
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}