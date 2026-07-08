import { Box, Typography } from '@mui/material';
import React from 'react'


const BrandsTitle = ({
    title,
    subtitle,
    Align = "left",
    my = {
        xs: 4, md: 6
    }
}) => {
    return (
        <Box
            sx={{
                textAlign: Align,
                my:my,
            }}
        >
            <Typography
                component="h1"
                sx={{
                    fontSize: {
                        xs: "19px",
                        sm: "21px",
                        md: "28px",
                    },
                    fontWeight: 600,
                    textTransform: "capitalize",
                    fontFamily: "inherit",
                    color: "rgba(29, 50, 88, 0.8)",
                }}
            >
                {title}
            </Typography>

            {subtitle && <Typography
                sx={{
                    fontSize: {
                        xs: "12px",
                        sm: "13px",
                        md: "15px",
                    },
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                    color: "rgba(29, 50, 88, 0.8)",
                    letterSpacing: "0.5px",
                }}
            >
                {subtitle}
            </Typography>}
        </Box>
    );
};


export default BrandsTitle