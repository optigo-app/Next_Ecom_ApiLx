import React from 'react'
import ImageWithFallback from './ImageWithFallback';
import { Card, Box, Typography, Stack } from '@mui/material';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const ProductCard = ({ onClick, product, minWidth, maxWidth, image, title, designno, price }) => {
    const { id } = product;
    const {storeInit ,    loginUserDetail} = useStore();
    const CurrencyCode = loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode;
    return (
        <Card
            onClick={onClick}
            key={id}
            elevation={0}
            sx={{
                minWidth: minWidth || "150px",
                maxWidth: maxWidth || "150px",
                flexShrink: 0,
                backgroundColor: "transparent",
                scrollSnapAlign: "start",

            }}
        >
            <ImageWithFallback src={image} alt={title} />
            <Box sx={{ mt: 1, px: 0.5 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#000",
                        letterSpacing: "0.5px",
                    }}
                >
                    {designno}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#757575",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={0} flexWrap="wrap">
                    <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#000" }}>{CurrencyCode} {price}</Typography>
                </Stack>
            </Box>
        </Card>
    )
}

export default ProductCard;