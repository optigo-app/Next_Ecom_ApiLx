"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

const ScrollTriggerTab = ({ assetBase }) => {
  const ScrollImageList = [
    {
      img: `${assetBase}/imageBanner/1.webp`,
      title: "Exquisite Craftsmanship",
      desc: "Discover our meticulously crafted jewelry pieces designed to elevate your everyday elegance. Each piece tells a story of unparalleled artistry and passion.",
      align: "right",
      btn_des: "READ MORE",
      top: "55px",
      isborder: true,
      link: "/why-quality-matters",
    },
    {
      head: "Custom Designs",
      title: "Tailored to Perfection",
      img: `${assetBase}/imageBanner/3.webp`,
      desc: "Create a piece that is uniquely yours. Work with our expert artisans to bring your vision to life with custom engravings and personalized styles.",
      align: "left",
      btn_des: "CUSTOMISE NOW",
      top: "15px",
      isborder: false,
      link: "/customization",
    },
    {
      title: "Timeless Elegance",
      subtitle: "",
      img: `${assetBase}/imageBanner/6.webp`,
      desc: "Explore our collection of timeless classics. Perfect for any occasion, these pieces are designed to be cherished for generations to come.",
      desc2: "Mon - Fri, 9:00 AM - 6:00 PM",
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
    
    // Initial check
    handleScrollAnimations();

    return () => {
      window.removeEventListener("scroll", handleScrollAnimations);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", gap: { xs: "0.8em", md: "3rem" }, mt: "2.2rem" }}>
      {ScrollImageList.slice(0, 3).map((val, i) => (
        <ScrollImageCard key={i} img={val?.img} details={val} index={i} />
      ))}
    </Box>
  );
};

export default ScrollTriggerTab;

const ScrollImageCard = ({ img, details, index }) => {
  const isRight = details?.align === "right";

  // Replicating original CSS nth-child behavior for specific .details_card offsets
  let cardOffset = {};
  if (index === 0) cardOffset = { left: { md: "auto" }, right: { md: "5%" } };
  if (index === 1) cardOffset = { right: { md: "auto" }, left: { md: "-3%" } };
  if (index === 2) cardOffset = { left: { md: "auto" }, right: { md: "5%" } };

  return (
    <Box
      className="ScrollImageCard"
      sx={{
        width: "100%",
        position: "relative",
        height: "450px", // Original was strictly 450px globally
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        padding: { xs: "10px", md: "10px 50px" },
        justifyContent: { xs: "flex-end", md: isRight ? "flex-end" : "flex-start" },
        alignItems: { xs: "flex-end", md: "flex-start" }, // Mobile: end
        "&.is-visible img": {
          animation: "scale-up 0.8s ease forwards",
          opacity: 0,
        },
        "@keyframes scale-up": {
          to: {
            transform: "scale(1.1)",
            opacity: 1,
          },
        },
      }}
    >
      <Box
        component="img"
        src={img}
        alt={details?.title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          right: 0,
          transition: "0.3s ease-out",
          animation: "scale-up 0.5s ease forwards",
          opacity: 0,
          zIndex: 0,
        }}
      />
      <Box
        className="details_card"
        sx={{
          width: { xs: "100%", md: "400px" },
          maxWidth: { xs: "750px", md: "none" },
          height: { xs: "auto", md: "320px" },
          backgroundColor: "white",
          position: { xs: "static", md: "relative" },
          zIndex: 15,
          padding: { xs: "5px", md: "15px" },
          mt: { xs: 0, md: details?.top || 0 }, // Restoring manual tops
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...cardOffset
        }}
      >
        <Box
          className="info"
          sx={{
            width: { xs: "100%", md: "88%" }, // Crucial 88% width for inner border margin emulation
            height: { xs: "auto", md: "83%" }, // Crucial 83% inner height 
            padding: { xs: "20px", md: "25px" },
            border: details?.isborder ? "2px solid black" : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            alignItems: { xs: "center", md: "flex-start" }
          }}
        >
          {details?.head && (
            <Typography
              variant="h1"
              sx={{
                fontFamily: "var(--font-tenor-sans), sans-serif",
                fontSize: { xs: "12px", sm: "14px", md: "15px" },
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "black",
                fontWeight: 400,
                mb: 1,
                lineHeight: 1.2
              }}
            >
              {details.head}
            </Typography>
          )}
          <Typography
            variant="h2"
            sx={{
              fontFamily: "var(--font-tenor-sans), sans-serif",
              fontSize: { xs: "20px", md: "22.75px" },
              fontWeight: 500,
              letterSpacing: "0.3px",
              color: "black",
              mb: 2,
              lineHeight: 1.3
            }}
          >
            {details?.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 450,
              mb: 3,
              p: 0,
              lineHeight: 1.5
            }}
          >
            {details?.desc}
            {details?.desc2 && (
              <>
                <br />
                <br />
                {details.desc2}
              </>
            )}
          </Typography>
          <Box sx={{ mt: { xs: "-10px", md: 0 } }}>
            <Link href={details?.link || "#"} passHref style={{ textDecoration: "none", color: "inherit", outline: "none" }}>
              <Button
                sx={{
                  padding: { xs: "7px 15px", md: "10px 25px" },
                  borderRadius: { xs: "3px", md: "2px" },
                  fontWeight: 200,
                  letterSpacing: "2.1px",
                  textTransform: "uppercase",
                  fontSize: "14px",
                  color: "white",
                  backgroundColor: "#c20000",
                  fontFamily: "var(--font-tenor-sans), sans-serif",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#c20000",
                    boxShadow: "none",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: "120%",
                    width: "100%",
                    height: "200%",
                    background: "rgba(255, 255, 255, 0.274)",
                    transform: "translateY(-100%)",
                    pointerEvents: "none",
                  },
                  "&:hover::after": {
                    animation: "ripple 0.4s ease-in forwards",
                  },
                  "@keyframes ripple": {
                    from: { left: "120%" },
                    to: { left: "-320%" },
                  },
                }}
              >
                {details?.btn_des}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

