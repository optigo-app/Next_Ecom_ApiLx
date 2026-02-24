import React from 'react'
import Headers from './composable/Headers'
import { Avatar, Box, Typography } from '@mui/material';


const categories = [
    { name: "Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop" },
    { name: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f66126e28?w=200&h=200&fit=crop" },
    { name: "Watch", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&h=200&fit=crop" },
    { name: "Bracelet", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop" },
    { name: "Anklet", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
];


const Categories = () => {
  return (
    <>
     <Headers title={'Categories'} />
            <Box sx={{ display: "flex", overflowX: "auto", gap: 2, px: 1.5, py: 1.5, "&::-webkit-scrollbar": { display: "none" } }}>
                {categories.map((cat, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px" }}>
                        <Avatar src={cat.img} sx={{ width: 70, height: 70, mb: 1, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }} />
                        <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>{cat.name}</Typography>
                    </Box>
                ))}
            </Box>
    
    </>
  )
}

export default Categories