"use client";

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

// Swap these for your real Instagram post images
const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: "/WebSiteStaticImage/Banner/julian4/Social1.webp",
    alt: "Layered gold bracelet styled with fresh flowers",
    href: "https://www.instagram.com/",
  },
  {
    id: 2,
    image: "/WebSiteStaticImage/Banner/julian4/Social2.webp",
    alt: "Model wearing gold rings and earrings",
    href: "https://www.instagram.com/",
  },
  {
    id: 3,
    image: "/WebSiteStaticImage/Banner/julian4/Social3.webp",
    alt: "Sculptural gold ring on a plain backdrop",
    href: "https://www.instagram.com/",
  },
  {
    id: 4,
    image: "/WebSiteStaticImage/Banner/julian4/Social4.webp",
    alt: "Model wearing gold earrings, smiling",
    href: "https://www.instagram.com/",
  },
];

export default function InstagramShowcase() {
  return (
    <Box sx={{ width: '100%', py: 8, backgroundColor: '#fff' }}>

      {/* SECTION HEADER AREA */}
      <Box sx={{ textAlign: 'center', mb: 5, px: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: { xs: '26px', sm: '32px', md: '38px' },
            lineHeight: 1.3,
            color: '#1c1c1c',
            mb: 1.5,
          }}
        >
          Shine on Instagram. Where timeless <br />
          <i>beauty and luxury</i> come alive.
        </Typography>

        <Link
          href="#"
          underline="always"
          sx={{
            fontSize: '12px',
            letterSpacing: '1px',
            fontWeight: 600,
            color: '#1c1c1c',
            textDecorationColor: 'rgba(28, 28, 28, 0.5)',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.7,
            },
          }}
        >
          @LAURA_STORE
        </Link>
      </Box>

      {/* FULL-BLEED IMAGE GRID */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: "10px",
        }}
      >
        {INSTAGRAM_POSTS.map((post) => (
          <Box
            key={post.id}
            component="a"
            href={post.href}
            sx={{
              position: 'relative',
              display: 'block',
              width: '100%',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              backgroundColor: '#f4f1ea',
              gap:"10px",
              '&:hover .ig-overlay': {
                opacity: 1,
              },
              '&:hover img': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Box
              component="img"
              src={post.image}
              alt={post.alt}
              draggable={false}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.5s ease',
              }}
            />

            {/* Subtle hover overlay with the Instagram glyph */}
            <Box
              className="ig-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(28, 28, 28, 0.25)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 26, height: 26, fill: '#fff' }}
              >
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.35 2.62 6.78 6.98 6.98C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

    </Box>
  );
}