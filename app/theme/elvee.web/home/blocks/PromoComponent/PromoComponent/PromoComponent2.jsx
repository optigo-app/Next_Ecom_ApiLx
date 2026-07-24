

"use client";

import React from 'react'
import './Styles.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';

var BrandsContent = [
    {
        "image": "/Collections/collectionbanner1.png",
        "subtitle": "CONTEMPORARY DESIGNS FOR THE MODERN GENERATION",
        "title": "Neura  Contemporary Elegance, Redefined",
        "description": "Neura embodies modern sophistication through sleek designs, refined craftsmanship, and contemporary aesthetics. Created for those who appreciate understated luxury, the collection features versatile pieces that seamlessly transition from everyday wear to special occasions."
    },
    {
        "image": "/Collections/collectionbanner2.png",
        "subtitle": "JEWELRY THAT CELEBRATES MEANINGFUL MOMENTS",
        "title": "Promise Celebrating Love, Commitment, and Meaningful Connections",
        "description": "Promise is a collection inspired by life's most cherished connections and milestones. Designed with timeless beauty and emotional significance, each piece symbolizes love, commitment, trust, and lasting memories, making it perfect for gifting and celebrating special occasions."
    },
    {
        "image": "/Collections/collectionbanner3.png",
        "subtitle": "EVERYDAY STYLE WITH EXTRAORDINARY DETAIL",
        "title": "Beyond Basics Elevated Essentials for Everyday Elegance",
        "description": "Beyond Basics transforms everyday jewelry into statement-worthy essentials. Featuring modern silhouettes, effortless designs, and exceptional craftsmanship, this collection is created for individuals who seek elegance in their daily style without compromising on comfort or versatility."
    },
    
];




const PromoComponent2 = ({ banner }) => {
    const updatedBrandsContent = BrandsContent.map((item, index) => ({
        ...item,
        image: banner?.image?.[index] || item.image,
    }));
    return (
        <div className='elv_promo_div' style={{ paddingTop: "100px",px: 0,paddingBottom:"30px" }}>
            {/* <Swiper
                
                className="mySwiper"
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
            >
                {updatedBrandsContent.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className='promo-daimondBoxMain'>
                            <div className='promo-daimondBox1'>
                                <h2 className='promo_dia_title_1'>{item?.title}</h2>
                                <p className='promo_dia_title_desc_1'>{item.description}</p>
                            </div>
                            <div className='promo-daimondBox2'>
                                <img loading="lazy" src={item?.image} className='promo-daimondBox2-image' alt={`Item ${index + 1}`} />
                                
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper> */}
        </div>
    )
}

export default PromoComponent2