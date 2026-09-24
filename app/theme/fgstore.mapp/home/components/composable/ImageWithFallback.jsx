
"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

const IMAGE_NOT_FOUND = "/image-not-found.jpg";

const ImageWithFallback = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src || IMAGE_NOT_FOUND);

    useEffect(() => {
        setImgSrc(src || IMAGE_NOT_FOUND);
    }, [src]);

    return (
        <Box
            component="img"
            src={imgSrc || IMAGE_NOT_FOUND}
            alt={alt || "product-image"}
            onError={() => {
                if (imgSrc !== IMAGE_NOT_FOUND) {
                    setImgSrc(IMAGE_NOT_FOUND);
                }
            }}
            sx={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
            }}
        />
    );
};

export default ImageWithFallback;