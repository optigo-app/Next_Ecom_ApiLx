"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';

// ── Dynamic data wiring ──
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
import { formatter, formatTitleLine, formatRedirectTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { compressAndEncode } from '@/app/(core)/utils/Encoder&Decoder';

const imageNotFound = '/image-not-found.jpg';

export default function TrendingMarquee({ storeInit }) {
  const { finalId, islogin, loginUserDetail } = useStore();
  const { push } = useNextRouterLikeRR();

  const [trendingData, setTrendingData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [validatedData, setValidatedData] = useState([]);

  // ── Fetch trending products ──
  useEffect(() => {
    setImageUrl(storeInit?.CDNDesignImageFolThumb);

    Get_Tren_BestS_NewAr_DesigSet_Album('GETTrending', finalId)
      .then((response) => {
        if (response?.Data?.rd) {
          setTrendingData(response.Data.rd);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalId, storeInit?.CDNDesignImageFolThumb]);

  // ── Build image URLs per product ──
  useEffect(() => {
    if (!trendingData?.length) return;
    setValidatedData(
      trendingData.map((item) => ({
        ...item,
        validatedImageURL:
          item?.ImageCount >= 1 ? `${imageUrl}${item?.designno}~1.jpg` : imageNotFound,
      }))
    );
  }, [trendingData, imageUrl]);

  // ── Navigation to product detail ──
  const handleNavigation = (item) => {
    let obj = {
      a: item?.autocode,
      b: item?.designno,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
      l: item?.ImageExtension,
      count: item?.ImageCount,
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`);
  };

  if (validatedData.length === 0) return null;


  const TRACK_ITEMS = [...validatedData, ...validatedData, ...validatedData];

  return (
    <Box sx={{ width: '100%', py: 8, backgroundColor: '#fff', overflow: 'hidden' }}>

      {/* SECTION HEADER AREA */}
      <Box sx={{ textAlign: 'center', mb: 6, px: 2 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: '12px',
            letterSpacing: '2px',
            fontWeight: 600,
            color: '#1c1c1c',
            display: 'block',
            mb: 1
          }}
        >
          TRENDING NOW
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: { xs: '32px', md: '44px' },
            lineHeight: 1.2,
            color: '#1c1c1c',
          }}
        >
          Loved by 100,000 customers <br />
          unleash your <i>graceful aura!</i>
        </Typography>
      </Box>

      {/* Keyframes for the continuous marquee scroll */}
      <style>
        {`
          @keyframes reviews-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.333%, 0, 0); }
          }
        `}
      </style>

      {/* CONTINUOUS MARQUEE WRAPPER (pure CSS, no Swiper) */}
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            width: 'max-content',
            animation: 'reviews-marquee 40s linear infinite',
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        >
          {TRACK_ITEMS.map((item, index) => {
            const title = formatTitleLine(item?.TitleLine) || item?.designno || '';
            const price =
              storeInit?.IsPriceShow == 1
                ? `${formatter(item?.UnitCostWithMarkUp)} ${islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode}`
                : '';

            return (
              <Box
                key={`${item?.DesignId}-${index}`}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: '220px', sm: '260px', md: '300px' },
                  mx: { xs: 1.5, md: 2.5 },
                }}
              >
                {/* Alternating scale between even and odd cards, same as original design */}
                <Box
                  onClick={() => handleNavigation(item)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    whiteSpace: 'normal',
                    transform: index % 2 === 0 ? 'scale(0.80)' : 'scale(1.08)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                  }}
                >

                  {/* Product Image */}
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '0.85',
                      overflow: 'hidden',
                      borderRadius: '0px',
                      backgroundColor: '#f9f9f9',
                      mb: 2.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.validatedImageURL || imageNotFound}
                      alt={title}
                      draggable={false}
                      onError={(e) => (e.target.src = imageNotFound)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: '#1c1c1c',
                      fontWeight: 300,
                      mb: 1.5,
                    }}
                  >
                    {title}
                  </Typography>

                  {/* Design No & Price */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#1c1c1c',
                      }}
                    >
                      {item?.designno}
                    </Typography>
                    {price && (
                      <Link
                        href="#"
                        underline="always"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item);
                        }}
                        sx={{
                          fontSize: '13px',
                          color: '#1c1c1c',
                          opacity: 0.7,
                          textDecorationColor: 'rgba(28, 28, 28, 0.4)',
                          transition: 'opacity 0.2s',
                          '&:hover': {
                            opacity: 1,
                            textDecorationColor: '#1c1c1c',
                          },
                        }}
                      >
                        {price}
                      </Link>
                    )}
                  </Box>

                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

    </Box>
  );
}