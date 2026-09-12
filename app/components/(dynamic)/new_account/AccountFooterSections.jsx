'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { getSession } from '@/app/(core)/utils/FetchSessionData';

export default function AccountFooterSections() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const storeData = getSession('storeInit');
      const newslater = storeData?.newslatter;
      if (newslater) {
        const newsletterUrl = `${newslater}${encodeURIComponent(email)}`;
        const res = await fetch(newsletterUrl);
        const text = await res.text();
        if (text?.toLowerCase().includes('already') || text?.startsWith('Thank')) {
          toast.success(text || 'Thank you for subscribing!');
        } else {
          toast.success('Thank you for subscribing to our newsletter!');
        }
      } else {
        toast.success('Thank you for subscribing to our newsletter!');
      }
      setEmail('');
    } catch {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'Free Shipping',
      description: 'Free shipping for order above $180',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="#edf5f1" />
          <path d="M24 13L35 19.5V32.5L24 39L13 32.5V19.5L24 13Z" stroke="#0b291d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 19.5L24 26L35 19.5" stroke="#0b291d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 26V39" stroke="#0b291d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 16.25L29.5 22.75" stroke="#1b4d3a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Flexible Payment',
      description: 'Multiple secure payment options',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="#edf5f1" />
          <path d="M14 18C14 16.3431 15.3431 15 17 15H33C34.6569 15 36 16.3431 36 18V30C36 31.6569 34.6569 33 33 33H17C15.3431 33 14 31.6569 14 30V18Z" stroke="#0b291d" strokeWidth="2" />
          <path d="M14 20H36" stroke="#0b291d" strokeWidth="2" />
          <path d="M29 26H32" stroke="#1b4d3a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: '24x7 Support',
      description: 'We support online all days.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="#edf5f1" />
          <path d="M15 25V23C15 18.0294 19.0294 14 24 14C28.9706 14 33 18.0294 33 23V25" stroke="#0b291d" strokeWidth="2" strokeLinecap="round" />
          <rect x="13" y="24" width="4" height="8" rx="2" fill="#0b291d" />
          <rect x="31" y="24" width="4" height="8" rx="2" fill="#0b291d" />
          <path d="M33 30V32C33 33.1046 32.1046 34 31 34H26" stroke="#0b291d" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: { xs: 3, md: 4 } }}>
      {/* 1. Value Proposition Features Card */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
          p: { xs: 2.5, sm: 3, md: 3.5 },
          mb: { xs: 2.5, md: 3.5 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: { xs: 2.5, md: 3 },
            alignItems: 'center',
          }}
        >
          {features.map((feat, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{feat.icon}</Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: '0.94rem',
                    lineHeight: 1.25,
                    mb: 0.3,
                  }}
                >
                  {feat.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.82rem',
                    lineHeight: 1.3,
                  }}
                >
                  {feat.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 2. Newsletter Section Card */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          bgcolor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
          py: { xs: 5, sm: 6, md: 7 },
          px: { xs: 2, sm: 4 },
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Left Decorative Botanical Leaves */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: '-40px', sm: '0px', md: '3%' },
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.15,
            pointerEvents: 'none',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <svg width="180" height="220" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 230C90 150 110 80 140 20" stroke="#0b291d" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M90 200C60 170 40 130 50 80C70 100 85 140 90 200Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
            <path d="M100 160C130 140 150 110 140 60C120 80 105 110 100 160Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
            <path d="M110 110C80 90 70 60 75 30C90 45 105 70 110 110Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
            <path d="M125 70C150 55 160 35 155 15C140 25 130 45 125 70Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
          </svg>
        </Box>

        {/* Right Decorative Botanical Leaves */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: '-40px', sm: '0px', md: '3%' },
            top: '50%',
            transform: 'translateY(-50%) scaleX(-1)',
            opacity: 0.15,
            pointerEvents: 'none',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <svg width="180" height="220" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 230C90 150 110 80 140 20" stroke="#0b291d" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M90 200C60 170 40 130 50 80C70 100 85 140 90 200Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
            <path d="M100 160C130 140 150 110 140 60C120 80 105 110 100 160Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
            <path d="M110 110C80 90 70 60 75 30C90 45 105 70 110 110Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
            <path d="M125 70C150 55 160 35 155 15C140 25 130 45 125 70Z" fill="none" stroke="#0b291d" strokeWidth="1.2" />
          </svg>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '680px', mx: 'auto' }}>
          {/* Kicker */}
          <Typography
            sx={{
              color: '#0b291d',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            OUR NEWSLETTER
          </Typography>

          {/* Headline */}
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              color: '#111827',
              fontSize: { xs: '1.45rem', sm: '1.85rem', md: '2.15rem' },
              lineHeight: 1.3,
              mb: 1.5,
            }}
          >
            Subscribe to Our Newsletter to Get Updates to Our Latest Collection
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: { xs: '0.86rem', sm: '0.94rem' },
              maxWidth: '540px',
              mx: 'auto',
              mb: 3.5,
            }}
          >
            Get 20% off on your first order just by subscribing to our newsletter
          </Typography>

          {/* Newsletter Input Form */}
          <Paper
            component="form"
            onSubmit={handleSubscribe}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '480px',
              mx: 'auto',
              p: '4px',
              bgcolor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              transition: 'all 0.15s ease-in-out',
              '&:focus-within': {
                borderColor: '#0b291d',
                boxShadow: '0 0 0 2px rgba(11, 41, 29, 0.1)',
              },
            }}
          >
            <InputBase
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                ml: 2,
                flex: 1,
                fontSize: '0.9rem',
                color: '#111827',
                '& input::placeholder': {
                  color: '#9ca3af',
                  opacity: 1,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#0b291d',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                px: { xs: 2.5, sm: 3.5 },
                py: 1.1,
                borderRadius: '3px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#144230',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Subscribe'}
            </Button>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
