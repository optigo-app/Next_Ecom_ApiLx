"use client";

import { useEffect, useRef, useState } from "react";
import "./ReviewTab.modul.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { fakeReviewsList } from "@/app/components/(static)/Constants/FakeReviewList";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { settings } from "@/app/components/(static)/Constants/SliderConfig";

const ReviewTab = () => {
  const slider = useRef(null);
  const [expandedReviewIndex, setExpandedReviewIndex] = useState(-1);

  const toggleExpand = (index) => {
    if (expandedReviewIndex === index) {
      setExpandedReviewIndex(-1);
    } else {
      setExpandedReviewIndex(index);
    }
  };
  return (
    <div className="hoq_main_ReviewTab" onContextMenu={(e) => e.preventDefault()}>
      <div className="header">
        <h1>1000+ Customers have trusted Lorem Ipusm</h1>
      </div>
      <div className="review_Slider">
        <div className="Slider_Custom_btn next">
          <button onClick={() => slider?.current?.slickPrev()}>
            <FiChevronLeft size={24} />
          </button>
          <button onClick={() => slider?.current?.slickNext()}>
            <FiChevronRight size={24} />
          </button>
        </div>
        <Slider {...settings} ref={slider} infinite={true}>
          {fakeReviewsList?.map((review, index) => {
            const {
              img,
              user,
              rating,
              time,
              review: reviewText,
              postedOn,
            } = review;
            const isExpanded = expandedReviewIndex === index;
            const isLongReview = reviewText?.trim().length > 50;

            return (
              <div key={index} className="review_card">
                <div className="r_card">
                  <div className="user_info_">
                    <img src={img} alt={`${user}'s profile`}
                      draggable={true}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <span>{user}</span>
                  </div>
                  <div className="star">
                    <span>
                      {Array.from({ length: rating }).map((_, starIndex) => (
                        <FaStar key={starIndex} color="#FFB400" size={22} />
                      ))}
                    </span>
                    <small>{time}</small>
                  </div>
                  <div className="line" />
                  <div className="description">
                    <p>
                      {isExpanded
                        ? reviewText.trim()
                        : `${reviewText.trim().slice(0, 60)}${isLongReview ? "..." : ""
                        }`}
                    </p>
                    {isLongReview && (
                      <small
                        onClick={() => toggleExpand(index)}
                        className="readmore_btn"
                      >
                        {isExpanded ? "Hide" : "Read More"}
                      </small>
                    )}
                  </div>
                  <div className="posted_on">
                    <FcGoogle size={24} />
                    <small>posted on</small>
                    <a
                      href="https://www.google.com/maps/place/Orail+Services+-+OptigoApps/@21.1806865,72.8169049,17z/data=!3m1!5s0x3be04e43afc9f70b:0x67cbd25f468c1b2!4m8!3m7!1s0x3be04e438cc948fb:0x5712a989b70ef3a2!8m2!3d21.1806815!4d72.8194798!9m1!1b1!16s%2Fg%2F1thx71nk?entry=ttu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {postedOn}
                    </a>
                    <hr />
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default ReviewTab;
