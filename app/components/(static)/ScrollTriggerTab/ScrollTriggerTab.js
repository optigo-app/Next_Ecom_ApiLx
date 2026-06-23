"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

const ScrollTriggerTab = ({ assetBase }) => {
  const ScrollImageList = [
    {
      img: `${assetBase}/imageBanner/1.png`,
      title: "Crafted to Celebrate Your Moments",
      desc: "Every piece at Sonasons Jewellery is thoughtfully designed and handcrafted to reflect timeless elegance, purity, and precision. From everyday wear to wedding heirlooms, we create jewellery that lasts generations.",
      align: "right",
      btn_des: "READ MORE",
      isborder: true,
      link: "/why-quality-matters",
    },
    {
      head: "",
      title: "Design Your Own Jewellery",
      img: `${assetBase}/imageBanner/3.png`,
      desc: "Create jewellery that is truly your own. Choose your preferred design, materials, and details to craft a piece that reflects your personal style. Bring your vision to life with a design made just for you.",
      align: "left",
      btn_des: "CUSTOMISE NOW",
      isborder: true,
      link: "/customization",
    },
    {
      title: "Meet Our Experts",
      subtitle: "",
      img: `${assetBase}/imageBanner/6.png`,
      desc: "Explore our collection of timeless classics. Perfect for any occasion, these pieces are designed to be cherished for generations to come.",
      desc2: "Mon - Fri, 9:00 AM - 6:00 PM",
      align: "right",
      btn_des: "CALL US",
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
    <Box sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", gap: { xs: "1.5rem", md: "3.5rem" }, mt: { xs: "1.5rem", md: "3.5rem" } }}>
      {ScrollImageList.slice(0, 3).map((val, i) => (
        <ScrollImageCard key={i} img={val?.img} details={val} index={i} />
      ))}
    </Box>
  );
};

export default ScrollTriggerTab;

const ScrollImageCard = ({ img, details, index }) => {
  const isRight = details?.align === "right";

  const cardOffset = isRight
    ? { mr: { md: "5%" }, ml: { md: "auto" } }
    : { ml: { md: "5%" }, mr: { md: "auto" } };

  return (
    <Box
      className="ScrollImageCard"
      sx={{
        width: "100%",
        position: "relative",
        height: { xs: "360px", sm: "400px", md: "450px" },
        overflow: "hidden",
        display: "flex",
        padding: { xs: "16px", md: "0 60px" },
        justifyContent: { xs: "center", md: isRight ? "flex-end" : "flex-start" },
        alignItems: "center",
        "&.is-visible img": {
          animation: "fade-scale-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        },
        "@keyframes fade-scale-in": {
          from: {
            opacity: 0,
            transform: "scale(1.08)",
          },
          to: {
            opacity: 1,
            transform: "scale(1)",
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
          left: 0,
          opacity: 0,
          transform: "scale(1.08)",
          zIndex: 0,
        }}
      />
      <Box
        className="details_card"
        sx={{
          width: { xs: "100%", md: "530px" },
          height: { xs: "auto", md: "310px" },
          backgroundColor: "white",
          position: "relative",
          zIndex: 15,
          padding: { xs: "12px", md: "16px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
          },
          ...cardOffset
        }}
      >
        <Box
          className="info"
          sx={{
            width: "100%",
            height: { xs: "auto", md: "100%" },
            padding: { xs: "20px 16px", md: "24px 28px" },
            border: details?.isborder ? "1.5px solid #111111" : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            alignItems: { xs: "center", md: "flex-start" },
            boxSizing: "border-box",
          }}
        >
          {details?.head && (
            <Typography
              variant="h1"
              sx={{
                fontFamily: "var(--font-tenor-sans), sans-serif",
                fontSize: { xs: "11px", sm: "12px", md: "13px" },
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#666666",
                fontWeight: 500,
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
              fontSize: { xs: "18px", md: "21px" },
              fontWeight: 500,
              letterSpacing: "0.5px",
              color: "#111111",
              mb: 1.5,
              lineHeight: 1.35,
            }}
          >
            {details?.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 400,
              color: "#444444",
              mb: 2,
              p: 0,
              lineHeight: 1.5,
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
          <Box>
            <Link href={details?.link || "#"} passHref style={{ textDecoration: "none", color: "inherit", outline: "none" }}>
              <Button
                sx={{
                  padding: { xs: "6px 16px", md: "8px 22px" },
                  borderRadius: 0,
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  fontSize: { xs: "12px", md: "13px" },
                  color: "white",
                  backgroundColor: "#c20000",
                  fontFamily: "var(--font-tenor-sans), sans-serif",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#9e0000",
                    boxShadow: "0 4px 12px rgba(194, 0, 0, 0.15)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: "120%",
                    width: "100%",
                    height: "200%",
                    background: "rgba(255, 255, 255, 0.25)",
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

