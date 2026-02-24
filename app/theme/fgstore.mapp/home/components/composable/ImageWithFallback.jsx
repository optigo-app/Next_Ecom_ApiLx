
"use client";
import { useState } from "react";
import { Box } from "@mui/material";

const ImageWithFallback = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const fallbackUrl = "https://placehold.co/400x500/1e293b/ffffff?text=No+Image";

    return (
        <Box
            component="img"
            src={imgSrc}
            alt={alt}
            onError={() => setImgSrc(fallbackUrl)}
            sx={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
            }}
        />
    );
};

export default ImageWithFallback;