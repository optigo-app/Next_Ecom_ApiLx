import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import "./BespokeBanner.scss";
import { storImagePath } from "../@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNavigate } from "react-router-dom";

const BespokeBanner = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-500px" });
  const naviagate = useNavigate();
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="hero-container" ref={sectionRef}>
      <div className="hero-content">
        <motion.div
          className="text-content"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={textVariants}
        >
          <motion.h1 className="title_bep" variants={textVariants}>
            Crafting Timeless Bespoke Jewelry for Every Occasion
          </motion.h1>
          <motion.p variants={textVariants}>
            Experience the art of bespoke jewelry, where every piece is designed
            exclusively for you. From personalized necklaces and bracelets to
            custom rings and earrings, our artisans combine traditional
            craftsmanship with modern design. Choose your gemstones, metals, and
            styles to create a piece that reflects your unique personality and
            style.
          </motion.p>
          <motion.button
            onClick={() => {
              naviagate("/bespoke-jewelry");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="shop-button"
            variants={buttonVariants}
          >
            CREATE YOUR BESPOKE PIECE
            <span className="arrow">→</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="image-content"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={imageVariants}
        >
          <img
            src={storImagePath() + `/images/HomePage/bespoke/2.png`}
            alt="Luxury Diamond Jewelry"
            className="hero-image"
          />
        </motion.div>
      </div>
      {/* 
      <motion.div
        className="collection-section"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2>Our new collection of jewelry & accessories</h2>
        <motion.button
          className="see-collections"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SEE FULL COLLECTIONS
          <span className="arrow">→</span>
        </motion.button>
      </motion.div> */}
    </div>
  );
};

export default BespokeBanner;
