"use client";

import React, { useEffect } from "react";
import "./ScrollTriggerTab.scss";
import Link from "next/link";

const ScrollTriggerTab = ({ assetBase }) => {

  const ScrollImageList = [
    {
      img: `${assetBase}/imageBanner/1.webp`,
      title: "Lorem ipsum dolor ?",
      desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam dicta beatae praesentium temporibus ex odit? Lorem ipsum dolor sit amet consectetur adipisicing elit?`,
      align: "right",
      btn_des: "READ MORE",
      top: "55px",
      isborder: true,
      link: "/why-quality-matters",
    },
    {
      head: "Lorem ipsum dolor?",
      title: "Lorem ipsum dolor sit?.",
      img: `${assetBase}/imageBanner/3.webp`,
      desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam dicta beatae praesentium temporibus ex odit?`,
      align: "left",
      btn_des: "CUSTOMISE NOW",
      top: "15px",
      isborder: false,
      link: "/customization",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur?",
      subtitle: "",
      img: `${assetBase}/imageBanner/6.webp`,
      desc: `Lorem ipsum dolor sit amet dicta beatae praesentium temporibus ex odit? `,
      desc2: "Mon - Fri, lorem ipsum",
      align: "right",
      btn_des: "CALL US",
      top: "55px",
      isborder: true,
      link: "tel:+464641313131",
    },
  ];

  useEffect(() => {
    const handleScrollAnimations = () => {
      const cards = document.querySelectorAll(".ScrollImageCard");

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top;
        const cardBottom = rect.bottom;
        if (cardTop < window.innerHeight && cardBottom >= 0) {
          card.classList.add("is-visible");
        } else {
          card.classList.remove("is-visible");
        }
      });
    };
    window.addEventListener("scroll", handleScrollAnimations);
    return () => {
      window.removeEventListener("scroll", handleScrollAnimations);
    };
  }, []);

  return (
    <>
      <div className="hoq_main_ScrollTriggerTab">
        {ScrollImageList.slice(0, 3).map((val, i) => {
          return <ScrollImageCard key={i} img={val?.img} details={val} />;
        })}
      </div>
    </>
  );
};

export default ScrollTriggerTab;

const ScrollImageCard = ({ img, details }) => {
  return (
    <div
      className="ScrollImageCard"
      style={{
        justifyContent: details?.align === "right" && "flex-end",
      }}
    >
      <img src={img} alt={details?.title} />
      <div
        className="details_card"
        style={{
          marginTop: details?.top,
        }}
      >
        <div
          className="info"
          style={{
            border: details?.isborder && "2px solid black",
          }}
        >
          {details?.head && <h1>{details?.head}</h1>}
          <h2>{details?.title}</h2>
          <p>
            {details?.desc} <br /> <br />
            {details?.desc2 && details?.desc2}
          </p>
          <Link
            href={details?.link}
            style={{
              textDecoration: "none",
              color: "inherit",
              outline: "none",
            }}
          >
            <button>{details?.btn_des}</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
