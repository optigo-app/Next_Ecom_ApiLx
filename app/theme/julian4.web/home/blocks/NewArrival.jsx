"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

 
import Pako from 'pako';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
import { formatRedirectTitleLine, formatter, formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';

const imageNotFound = '/image-not-found.jpg';

export default function ProductSlider({ storeInit }) {
  const { finalId, loginUserDetail, islogin } = useStore();
  const navigation = useNextRouterLikeRR();

  const [imageUrl, setImageUrl] = useState();
  const [newArrivalData, setNewArrivalData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);

  // ── Fetch new arrivals ──
  const callAPI = () => {
    let finalID = finalId;
    let data = storeInit || {};
    setImageUrl(data?.CDNDesignImageFolThumb);

    Get_Tren_BestS_NewAr_DesigSet_Album('GETNewArrival', finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setNewArrivalData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    callAPI();
    
  }, []);

  // ── Build primary/secondary image URLs per product
  const validateImageURLs = async () => {
    if (!newArrivalData?.length) return;
    const built = await Promise.all(
      newArrivalData.map(async (item) => {
        const img1 =
          item?.ImageCount >= 1 ? `${imageUrl}${item?.designno}~1.jpg` : imageNotFound;
        const img2 =
          item?.ImageCount >= 2 ? `${imageUrl}${item?.designno}~2.jpg` : img1;
        return { ...item, validatedImg1: img1, validatedImg2: img2 };
      })
    );
    setValidatedData(built);
  };

  useEffect(() => {
    validateImageURLs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newArrivalData]);

  // ── Encoded product navigation (verbatim from reference) ──
  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: 'string' });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error('Error compressing and encoding:', error);
      return null;
    }
  };

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem('scrollToProduct2', `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigation?.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  const decodeEntities = (html) => {
    if (typeof document === 'undefined') return html;
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  if (validatedData?.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', py: 15, px: { xs: 2, md: 6 }, backgroundColor: '#fff' }}>

      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6, px: 2 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#1c1c1c',
            textTransform: 'uppercase',
            mb: 2
          }}
        >
          Our Latest Arrivals
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: { xs: '26px', sm: '36px', md: '40px' },
            lineHeight: 1.3,
            color: '#1c1c1c',
            maxWidth: '700px',
            mx: 'auto'
          }}
        >
          Wear a necklace, ring, bracelet or earring that is well aligned to <i>your energy.</i>
        </Typography>
      </Box>

      {/* Main Container Wrapper with Arrow Visibility States on Hover */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          mx: 'auto',
          '&:hover .prod-nav-btn': {
            opacity: 1,
            visibility: 'visible'
          }
        }}
      >
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          slidesPerGroup={1}
          speed={700}
          grabCursor={true}
          navigation={{
            prevEl: '.prod-slider-prev',
            nextEl: '.prod-slider-next',
          }}
          breakpoints={{
            480: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 24 }
          }}
          style={{ paddingBottom: '16px' }}
        >
          {validatedData.map((product, index) => {
            const title = formatTitleLine(product?.TitleLine)
              ? decodeEntities(formatTitleLine(product?.TitleLine))
              : product?.designno || '';
            const price =
              storeInit?.IsPriceShow == 1
                ? `${formatter(product?.UnitCostWithMarkUp)} ${islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode}`
                : '';

            return (
              <SwiperSlide key={product?.DesignId ?? index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    position: 'relative',
                    '&:hover .primary-img': { opacity: 0 },
                    '&:hover .secondary-img': { opacity: 1, transform: 'scale(1.02)' },
                    '&:hover .choose-options-btn': { transform: 'translateY(0)', opacity: 1 }
                  }}
                >

                  {/* Image Frame Area Wrapper */}
                  <Box
                    onClick={() =>
                      handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)
                    }
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      backgroundColor: '#f9f6f3',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      cursor: 'pointer'
                    }}
                  >
                    {/* Primary Front Image */}
                    <Box
                      component="img"
                      className="primary-img"
                      src={product?.validatedImg1 || imageNotFound}
                      alt={title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        transition: 'opacity 0.5s ease-in-out'
                      }}
                    />

                    {/* Secondary Back Image (Reveals on Hover) */}
                    <Box
                      component="img"
                      className="secondary-img"
                      src={product?.validatedImg2 || imageNotFound}
                      alt={`${title} Alternate`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        zIndex: 2,
                        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
                      }}
                    />

                    {/* Slide-Up Overlay Option Bar */}
                    <Button
                      className="choose-options-btn"
                      variant="contained"
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index);
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#1c1c1c',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: 0,
                        py: 1.5,
                        zIndex: 3,
                        transform: 'translateY(100%)',
                        opacity: 0,
                        transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#1c1c1c',
                          color: '#fff',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      CHOOSE OPTIONS
                    </Button>
                  </Box>

                  {/* Details Section */}
                  <Typography
                    onClick={() =>
                      handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)
                    }
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '15px',
                      color: '#1c1c1c',
                      fontWeight: 400,
                      lineHeight: 1.4,
                      mb: 0.5,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1c1c1c' }}>
                      {price}
                    </Typography>
                  </Box>

                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* NAVIGATION CONTROLS (Fades in/out on master area hover) */}
        <IconButton
          className="prod-slider-prev prod-nav-btn"
          sx={{
            position: 'absolute',
            top: '40%',
            left: '-20px',
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: '#fff',
            color: '#1c1c1c',
            width: '42px',
            height: '42px',
            opacity: 0,
            visibility: 'hidden',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
            transition: 'opacity 0.3s ease, visibility 0.3s ease, background-color 0.2s ease',
            display: { xs: 'none', md: 'flex' },
            '&:hover': { backgroundColor: '#f5f5f5' },
            '&.swiper-button-disabled': { opacity: '0 !important', visibility: 'hidden !important' }
          }}
        >
          <ChevronLeft sx={{ fontSize: 24 }} />
        </IconButton>

        <IconButton
          className="prod-slider-next prod-nav-btn"
          sx={{
            position: 'absolute',
            top: '40%',
            right: '-20px',
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: '#fff',
            color: '#1c1c1c',
            width: '42px',
            height: '42px',
            opacity: 0,
            visibility: 'hidden',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
            transition: 'opacity 0.3s ease, visibility 0.3s ease, background-color 0.2s ease',
            display: { xs: 'none', md: 'flex' },
            '&:hover': { backgroundColor: '#f5f5f5' },
            '&.swiper-button-disabled': { opacity: '0 !important', visibility: 'hidden !important' }
          }}
        >
          <ChevronRight sx={{ fontSize: 24 }} />
        </IconButton>

      </Box>
    </Box>
  );
}