import React from 'react'
import { Box, Card, CardMedia } from '@mui/material'

const GiftBlock = () => {
  return (
    <>
     <Box sx={{ display: "flex", overflowX: "auto", gap: 2, px: 1.5, py: 1.5, mt: 4, "&::-webkit-scrollbar": { display: "none" } }}>
                {Array.from({length:5}).map((cat, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "150px" }}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#fce4ec", boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.1)" }}>
                            <CardMedia component="img" height="160" image="https://www.eternz.com/_next/image?url=https%3A%2F%2Fcdn.eternz.com%2Fbanner%2FVdayGiftsforher1767702350394.jpg&w=1920&q=75" alt="Gifts For Her" />
                        </Card>
                    </Box>
                ))}
            </Box>
    
    </>
  )
}

export default GiftBlock