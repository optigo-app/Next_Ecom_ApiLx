import React from 'react'
import { Box } from '@mui/material'

const ImageSide = () => {
    return (
        <>
            <Box
                sx={{
                    flex: "0 0 30%",
                    display: { xs: "none", md: "block" },
                    position: "relative",
                    height: "100%",
                    overflow: "hidden",
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                }}
            >
                <Box
                    component="img"
                    src="https://shayn.in/cdn/shop/files/pendant_menu.webp?v=1757751980&width=1500"
                    alt="Category Preview"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        "&:hover": {
                            transform: "scale(1.03)",
                        },
                    }}
                />
            </Box>
        </>
    )
}

export default ImageSide