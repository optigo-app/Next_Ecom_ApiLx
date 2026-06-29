

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
        "title": "Beyond Basic ",
        "description": "The brand that champions ethical luxury and eco-conscious elegance. It all begins with cutting-edge technology that replicates the natural diamond-growing process, creating exquisite gems with the same chemical composition, physical properties, and captivating sparkle as their mined counterparts."
    },
    {
        "image": "/Collections/collectionbanner2.png",
        "title": "Storyst",
        "description": "In the enchanting world of love and matrimony, where dreams are spun from whispers and promises, there exists a realm where beauty knows no bounds. This is the story of 'Ethereal Elegance,' a prestigious bridal jewelry brand that weaves tales of romance and timeless sophistication."
    },
    {
        "image": "/Collections/collectionbanner3.png",
        "title": "Nuera",
        "description": "This is the story of Minimal & Shiny Gold Jewelry, a brand born from the desire to celebrate the beauty of simplicity and the allure of gold. Each piece tells a unique story, a tale of grace and sophistication, designed for those who find joy in the subtle, the refined, and the timeless."
    },
    {
        "image": "/Collections/collectionbanner4.png",
        "title": "Promise",
        "description": "This is the world of Modern Diamond Jewelry, a brand that embodies the perfect fusion of cutting-edge design and the everlasting brilliance of diamonds. minimalist diamond-studded jewelleries that symbolize everlasting love, to avant-garde statement pieces that capture the essence of bold individuality, the collection is a celebration of the diversity and versatility of modern aesthetics"
    },
    {
        "image": "/Collections/collectionbanner5.png",
        "title": "Diament",
        "description": "In the world of hip-hop, where trends come and go like the beat of a drum, 'Bling Dynasty' remains an immutable force, a testament to the enduring power of self-expression. As long as there are dreams to chase and stories to tell, the legacy of 'Bling Dynasty' will shine on, a symbol of resilience, creativity, and the unbreakable bond between music and culture."
    },
    {
        "image": "/Collections/collectionbanner6.png",
        "title": "Lovent",
        "description": "In the dazzling world of high fashion, where style is the ultimate form of self-expression and luxury is a way of life, there exists a realm of unparalleled opulence and exquisite glamour. This is the domain of High Fashion Diamond Jewelry, a brand that epitomizes the union of haute couture and the eternal allure of diamonds."
    }
];




const PromoComponent2 = ({ banner }) => {
    const updatedBrandsContent = BrandsContent.map((item, index) => ({
        ...item,
        image: banner?.image?.[index] || item.image,
    }));
    return (
        <div className='elv_promo_div' style={{ paddingTop: "100px",px: 0,paddingBottom:"30px" }}>
            <Swiper
                // pagination={{ clickable: true }}
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
                                {/* <img loading="lazy" src={storImagePath() + item.image} className='promo-daimondBox2-image' alt={`Item ${index + 1}`} /> */}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default PromoComponent2