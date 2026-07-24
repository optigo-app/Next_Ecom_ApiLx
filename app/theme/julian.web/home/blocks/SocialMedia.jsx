 



'use client';

import { Box, Container, Typography } from '@mui/material';
import Link from "next/link";
 
import { useRef } from 'react';


const categories = [
    {
        title: 'Instagram',
        video:  '/social_media/Instagram.mp4',
        platform:"https://www.instagram.com/"
    },
    {
        title: 'YouTube',
        video: '/social_media/Youtube.mp4',
        platform:"https://www.youtube.com/"
    },
    {
        title: 'Pinterest',
        video:  '/social_media/Pinterest.mp4',
        platform:"https://www.pinterest.com/"
    },
    {
        title: 'Facebook',
        video:  '/social_media/Facebook.mp4',
        platform:"https://www.facebook.com/"
    },
    
];



function VideoCard({ item }) {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        videoRef.current?.play();
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (

        <Link href={item.platform} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                height: {
                    xs: 320,
                    md: 520,
                },

                '&:hover .video': {
                    transform: 'scale(1.08)',
                },

                '&:hover .overlay': {
                    opacity: 1,
                },

                '&:hover .content': {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
            }}
        >
            {/* Video */}
            <Box
                component="video"
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                className="video"
                src={item.video}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform .8s cubic-bezier(.22,.61,.36,1)',
                }}
            />

            {/* Overlay */}
            <Box
                className="overlay"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    // background:
                    //     'linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.15))',
                    opacity: 0,
                    transition: '.5s ease',
                }}
            />

            {/* Hover Content */}
        <Box
                className="content"
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 24,
                    color: '#fff',
                    zIndex: 2,
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: '.45s ease',
                }}
            >
                <Typography
                    sx={{
                        fontSize: 22,
                        fontWeight: 500,
                        mb: 1,
                    }}
                >
                    {/* {item.title} */}
                    Explore
                </Typography>

                 
            </Box> 

            {/* Bottom Label */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    bgcolor: '#fff',
                    py: 1.5,
                    px: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: '#444',
                    }}
                >
                    {item.title}
                </Typography>
            </Box>
        </Box>
        </Link>
    );
}
export default function CategoryShowcase() {
    return (
        <Container maxWidth="xl" sx={{pt:2, pb: 4}}>

            <Typography
                sx={{
                    fontFamily: '"EB Garamond", serif',
                    fontSize: { xs: 34, md: 42 },
                    fontWeight: 400,
                    mt: 5,
                    color: '#2C2C2C',
                    mb: 3,
                    textAlign: 'center',
                }}
            >
                Watch & Buy
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2,1fr)',
                        md: 'repeat(4,1fr)',
                    },
                    gap: 1.5,
                }}
            >
                {categories.map((item, index) => (
                     
                    <VideoCard key={index} item={item} />
                   
                ))}
            </Box>
        </Container>
    );
}