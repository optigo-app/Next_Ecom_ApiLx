"use client";

import React from "react";
import "./SocialTab.modul.scss";
import { FaInstagram } from "react-icons/fa";

const SocialTab = ({ assetBase }) => {

  const socialLink = [
    {
      img: `${assetBase}/social/1.webp`,
      icon: <FaInstagram size={24} />,
    },
    {
      img: `${assetBase}/social/22.webp`,
      icon: <FaInstagram size={24} />,
    },
    {
      img: `${assetBase}/social/3.webp`,
      icon: <FaInstagram size={24} />,
    },
    {
      img: `${assetBase}/social/4.webp`,
      icon: <FaInstagram size={24} />,
    },
  ];

  return (
    <div className="hoq_main_SocialTab">
      <div className="header">
        <h1>Follow Us : @Lorem ipsum dolor sit amet.</h1>
      </div>
      <div className="social_row">
        {socialLink?.slice(0, 4)?.map(({ img, icon }, i) => {
          return (
            <div key={i} className="social_card" style={{ filter: i % 2 ? "grayscale(50)" : "" }}>
              <img src={img} alt={img} />
              <div className="icon_overlayer">
                <a
                  target="_blank"
                  href={"https://www.instagram.com"}
                >
                  {icon}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialTab;
