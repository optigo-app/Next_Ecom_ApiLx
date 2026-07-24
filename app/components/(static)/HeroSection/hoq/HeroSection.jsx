"use client";

import React from "react";
import "./HeroSection.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const TopSlider = ({ data }) => {
    return (
        <div className="hoq_main_slider" draggable={true}
            onContextMenu={(e) => e.preventDefault()}>
            <Swiper
                modules={[Pagination, EffectFade]}
                slidesPerView={1}
                slidesPerGroup={1}
                speed={500}
                loop={true}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                allowTouchMove={true}
                pagination={{ clickable: true }}
                style={{ "--swiper-wrapper-transition-timing-function": "linear" }}
            >
                {data?.image?.slice(0, 3)?.map((val, i) => (
                    <SwiperSlide key={i}>
                        <div className="slide">
                            <img
                                src={val || ""}
                                alt={val + i}
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TopSlider;
