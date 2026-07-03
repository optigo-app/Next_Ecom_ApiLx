
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./TopSection.modul.scss";

const TopSection = ({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = "/WebSiteStaticImage/Banner/malakanjwewls/Homepagemainbanner1.png ";

  const style = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const fadeFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (!imageUrl) return;

    setIsLoaded(false); // Reset state if data/image changes
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsLoaded(true); // Direct state update
  }, [imageUrl]);

  return (
    <div className="mala_topVideoMain" style={style}>
      {/* Conditionally rendering ensures the initial animation lifecycle triggers perfectly */}
      {isLoaded && (
        <motion.div
          className="details_text"
          initial="hidden"
          animate="visible"
          variants={fadeFromLeft}
        >
          <h1>Shine</h1>
          <h1>With</h1>
          <h1>Elegance</h1>
        </motion.div>
      )}
    </div>
  );
};

export default TopSection;