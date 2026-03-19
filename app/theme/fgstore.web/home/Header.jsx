'use client'
import { Box, Typography } from '@mui/material'
import React from 'react'

const SonaHeader = ({ title, isShowViewMore = true, viewAll = () => { } }) => {
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    pt: 4,
                    pb: 2
                }}
            >
                <Typography sx={{
                    textAlign: 'center',
                    fontSize: '27px',
                    fontWeight: '600 !important',
                }}>
                    {title}
                </Typography>
                {!isShowViewMore && <Typography onClick={viewAll} sx={{
                    textAlign: 'center',
                    fontWeight: '500 !important',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                }}>
                    View All
                </Typography>}
            </Box>
        </>
    )
}

export default SonaHeader