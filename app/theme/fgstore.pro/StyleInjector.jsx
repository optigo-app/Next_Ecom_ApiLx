"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const StyleInjector = ({ styleContent }) => {
  const [applied, setApplied] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [bodyBgColor, setBodyBgColor] = useState("transparent");
  const pathname = usePathname();
  const isCMSPage = pathname?.startsWith("/debug-internal-config-manager-v2");

  useEffect(() => {
    if (!styleContent) return;

    const animateBackground = () => {
      const element = document.querySelector(".setFullThemeBack");
      if (!element) return;
      element.classList.remove("animateThemeFill");
      void element.offsetWidth;
      element.classList.add("animateThemeFill");
    };
    const timeout = setTimeout(animateBackground, 50);

    const frameId = requestAnimationFrame(() => {
      if (typeof window !== "undefined") {
        const bg = window.getComputedStyle(document.body).backgroundColor;
        setBodyBgColor(bg || "transparent");
      }
      setApplied(true);
      setAnimationDone(false);
    });

    return () => {
      setApplied(false);
      setAnimationDone(false);
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [styleContent]);

  return (
    <AnimatePresence>
      {applied && !animationDone && !isCMSPage && (
        <motion.div
          key="bg-reveal"
          initial={{
            clipPath: "circle(150% at 0% 0%)",
            opacity: 1,
          }}
          animate={{
            clipPath: "circle(0% at 0% 0%)",
            opacity: 1,
          }}
          exit={{
            clipPath: "circle(150% at 0% 0%)",
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationComplete={() => setAnimationDone(true)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            backgroundColor: bodyBgColor,
            mixBlendMode: "normal",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default StyleInjector;
