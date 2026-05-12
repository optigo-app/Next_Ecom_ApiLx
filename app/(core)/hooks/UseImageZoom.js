import { useState, useRef, useEffect } from "react";

export const useImageZoom = (zoomLevel = 1.5) => {
  const imageRefs = useRef([]);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, index) => {
    const imageRef = imageRefs?.current[index];
    if (!imageRef) return;

    const imageContainer = imageRef?.parentElement;
    if (!imageContainer) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const transformOriginX = x * 100;
    const transformOriginY = y * 100;
    setOrigin({ x: transformOriginX, y: transformOriginY });

    imageRef.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;
    imageRef.style.transform = `scale(${zoomLevel})`;
  };

  const handleMouseLeave = (index) => {
    const imageRef = imageRefs?.current[index];
    if (!imageRef) return;

    imageRef.style.transform = 'scale(1)';
    imageRef.style.transformOrigin = 'center center'; 
    setOrigin({ x: 0, y: 0 });
  };

  useEffect(() => {
    return () => {
      imageRefs.current.forEach((ref) => {
        if (ref) {
          ref.style.transform = 'scale(1)';
          ref.style.transformOrigin = 'center center';
        }
      });
    };
  }, []);

  return { imageRefs, handleMouseMove, handleMouseLeave, origin };
};
