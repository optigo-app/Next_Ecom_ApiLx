"use client";
import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .backToTopBtn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #000;
          color: #fff;
          border: 1.5px solid #9E7429;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.25);
          transition: all 0.3s ease-in-out, opacity 0.3s ease, transform 0.3s ease;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.7);
        }
        .backToTopBtn.visible {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }
        .backToTopBtn:hover {
          background-color: #9E7429;
          color: #fff;
        }
        @media (max-width: 600px) {
          .backToTopBtn { bottom: 16px; right: 16px; }
        }
      `}</style>
      <button
        className={`backToTopBtn${visible ? " visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </>
  );
};

export default BackToTop;
