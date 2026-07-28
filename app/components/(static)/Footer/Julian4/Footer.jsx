"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// ── Dynamic data wiring (ported from PremiumFooter reference) ──
import { useStore } from '@/app/(core)/contexts/StoreProvider';

export default function Footer() {
  const { storeInit: storeInitContext } = useStore();
  const storeInit =
    storeInitContext ||
    (typeof window !== 'undefined'
      ? JSON?.parse(sessionStorage?.getItem('storeInit'))
      : null);

  const [email, setEmail] = useState('');
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const year = React.useMemo(() => new Date().getFullYear(), []);

  // ── Pull social links from CompanyInfoData (same polling pattern as reference) ──
  useEffect(() => {
    let interval;
    const fetchData = () => {
      try {
        const storeInitData = sessionStorage?.getItem('storeInit');
        if (storeInitData) {
          const companyInfoDataStr = sessionStorage?.getItem('CompanyInfoData');
          if (companyInfoDataStr) {
            const parsedCompanyInfo = JSON?.parse(companyInfoDataStr);
            const socialLinkStr = parsedCompanyInfo?.SocialLinkObj;
            if (socialLinkStr) {
              try {
                const parsedSocialMediaData = JSON?.parse(socialLinkStr);
                setSocialMediaData(parsedSocialMediaData);
              } catch (error) {
                console.error('Error parsing social media data:', error);
              }
            }
          }
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error parsing data from sessionStorage:', error);
        clearInterval(interval);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // ── Newsletter signup (ported from reference) ──
  const handleSubmitNewlater = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    if (email?.trim() === '') {
      setLoading(false);
      setResult('Email is required.');
      return;
    } else if (!isValidEmail(email)) {
      setLoading(false);
      setResult('Please enter a valid email address.');
      return;
    } else {
      setResult('');
    }

    const newslater = storeInit?.newslatter;
    if (newslater && email) {
      const newsletterUrl = `${newslater}${email}`;
      fetch(newsletterUrl, { method: 'GET', redirect: 'follow' })
        .then((response) => response.text())
        .then((res) => {
          setResult(res);
          setLoading(false);
          setTimeout(() => {
            setResult('');
            setEmail('');
          }, 3000);
        })
        .catch((error) => setResult(String(error)));
    } else {
      setLoading(false);
    }
  };

  const companyName = storeInit?.companyname || 'Zest Laura Store';

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#F2EFE9',
        color: '#121212',
        fontFamily: 'serif',
        pt: 8,
        pb: 4,
        px: 2
      }}
    >
      <Container maxWidth="xxl">
        {/* Main Footer Links & Newsletter */}
        <Grid container spacing={4} sx={{ mb: 6 }}>

          {/* Column 1: Presets */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, letterSpacing: '0.1em' }}>
              PRESETS
            </Typography>
            {['Flairy', 'Fleek', 'Gusto', 'Cosmo'].map((item) => (
              <Link href="#" key={item} sx={{ display: 'block', color: '#4a4a4a', textDecoration: 'none', mb: 1, fontSize: '0.9rem', '&:hover': { textDecoration: 'underline' } }}>
                {item}
              </Link>
            ))}
          </Grid>

          {/* Column 2: About */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, letterSpacing: '0.1em' }}>
              ABOUT
            </Typography>
            {['Contact', 'Blog', 'About', 'FAQs', 'Find a Store'].map((item) => (
              <Link href="#" key={item} sx={{ display: 'block', color: '#4a4a4a', textDecoration: 'none', mb: 1, fontSize: '0.9rem', '&:hover': { textDecoration: 'underline' } }}>
                {item}
              </Link>
            ))}
          </Grid>

          {/* Column 3: Shop */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, letterSpacing: '0.1em' }}>
              SHOP
            </Typography>
            {['Shop all', 'Earrings', 'Necklaces', 'On Sale'].map((item) => (
              <Link href="#" key={item} sx={{ display: 'block', color: '#4a4a4a', textDecoration: 'none', mb: 1, fontSize: '0.9rem', '&:hover': { textDecoration: 'underline' } }}>
                {item}
              </Link>
            ))}
          </Grid>

          {/* Column 4: Customer */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, letterSpacing: '0.1em' }}>
              CUSTOMER
            </Typography>
            {['Shipping', 'Exchanges', 'Care Guide', 'Materials', 'Size Chart'].map((item) => (
              <Link href="#" key={item} sx={{ display: 'block', color: '#4a4a4a', textDecoration: 'none', mb: 1, fontSize: '0.9rem', '&:hover': { textDecoration: 'underline' } }}>
                {item}
              </Link>
            ))}
          </Grid>

          {/* Column 5: Newsletter Sign up */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, letterSpacing: '0.1em' }}>
              JOIN THE LAURA CLUB
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a4a4a', mb: 2 }}>
              Subscribe for store updates and discounts.
            </Typography>

            <Box component="form" onSubmit={handleSubmitNewlater}>
              <TextField
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                sx={{
                  backgroundColor: '#ffffff',
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '& fieldset': { borderColor: '#cccccc' },
                    '&:hover fieldset': { borderColor: '#888888' },
                    '&.Mui-focused fieldset': { borderColor: '#121212', borderWidth: '1px' },
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" type="submit">
                        <ArrowForwardIcon sx={{ color: '#121212' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {loading ? (
              <Typography variant="caption" sx={{ color: '#666666', display: 'block', mb: 1 }}>
                Loading...
              </Typography>
            ) : (
              result && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 1,
                    color: result.startsWith('Thank You!') ? '#04AF70' : '#FF0000',
                  }}
                >
                  {result}
                </Typography>
              )
            )}

            <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
              By subscribing you agree to the <Link href="#" sx={{ color: '#666666', textDecoration: 'underline' }}>Terms of Use</Link> & <Link href="#" sx={{ color: '#666666', textDecoration: 'underline' }}>Privacy Policy</Link>.
            </Typography>
          </Grid>

        </Grid>

        {/* Sub-Footer: Socials, Copyright, Selectors, Payments */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>

          {/* Left: Socials & Copyright */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, color: '#121212', alignItems: 'center' }}>
              {socialMediaData?.map((social, index) => (
                <Link
                  key={index}
                  href={social?.SLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  aria-label={social?.SName}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Box
                    component="img"
                    src={social?.SImgPath}
                    alt={social?.SName}
                    sx={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                </Link>
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: '#666666' }}>
              © {year}, {companyName}. <Link href="#" sx={{ color: '#666666', textDecoration: 'underline' }}>Powered by Shopify</Link>
            </Typography>
          </Box>

          {/* Right: Selectors, Policies & Payments */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#4a4a4a' }}>
                English <KeyboardArrowDownIcon fontSize="small" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#4a4a4a' }}>
                🇺🇸 United States (USD $) <KeyboardArrowDownIcon fontSize="small" />
              </Box>

              <Link href="#" sx={{ color: '#4a4a4a', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Privacy Policy</Link>
              <Link href="#" sx={{ color: '#4a4a4a', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Terms of Service</Link>
            </Box>
 
          </Box>

        </Box>

        {/* Large Branding Header Accent at the bottom */}
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '4rem', sm: '8rem', md: '12rem', lg: '16rem' },
            fontWeight: 400,
            fontFamily: 'serif',
            pt: 6,
            color: '#121212',
            userSelect: 'none'
          }}
        >
          {companyName}
        </Typography>

      </Container>
    </Box>
  );
}