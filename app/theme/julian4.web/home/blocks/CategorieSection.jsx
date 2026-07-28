"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ── Dynamic data wiring (ported from CategoryBlock reference) ──
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { HomeCategoryApi } from '@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi';
import {
  normalizeALC,
  buildAlbumCacheKey,
  getPricingContext,
} from '@/app/(core)/cache_utility/CacheBuilder';
import { readCache, writeCache } from '@/app/(core)/cache_utility/cacheActions';

// ── Fallback image mapping per category name (same idea as reference's ImagesDemo) ──
const buildNormalizedMap = (obj) => {
  const map = {};
  Object.entries(obj).forEach(([key, value]) => {
    map[key?.toString().trim().toLowerCase()] = value;
  });
  return map;
};
const normalizeKey = (key) => key?.toString().trim().toLowerCase();

export default function CategoryShowcase({ assetBase, storeInit }) {
  const { finalId, islogin, loginUserDetail } = useStore();
  const navigate = useNextRouterLikeRR();

  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);

  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef('');

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeInit, islogin),
    [loginUserDetail, storeInit, islogin]
  );

  const categoryImages = useMemo(
    () =>
      buildNormalizedMap({
        Necklace: `${assetBase}/images/Category/Necklace.webp`,
        Pendant: `${assetBase}/images/Category/pendent.webp`,
        Earring: `${assetBase}/images/Category/Earring.webp`,
        Bracelet: `${assetBase}/images/Category/Bracelet.webp`,
        Ring: `${assetBase}/images/Category/Ring.webp`,
        Cufflink: `${assetBase}/images/Category/Cufflink.webp`,
        Mangalsutra: `${assetBase}/images/Category/earing1.webp`,
        'Mangalsutra Set': `${assetBase}/images/Category/MangalsutraSet.webp`,
        'Pendant Set': `${assetBase}/images/Category/pendentset.webp`,
        Bangle: `${assetBase}/images/Category/Bangle.webp`,
        'Necklace Set': `${assetBase}/images/Category/NecklaceSet.webp`,
      }),
    [assetBase]
  );

  const getImage = (name) => categoryImages[normalizeKey(name)] || '/fallback.jpg';

  // ── Fetch categories (cached, same pattern as reference) ──
  const fetchAndSetCategories = useCallback(
    async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const cacheRes = await readCache(cacheKey);
        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          setCategoryList(cacheRes.data);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        const categoryRes = await HomeCategoryApi(finalID);
        const apiData = categoryRes?.Data?.rd || [];
        setCategoryList(apiData);

        if (apiData.length > 0) {
          writeCache(cacheKey, apiData).catch(console.error);
        }
        setLoading(false);
        isFetchingRef.current = false;
      } catch (error) {
        console.error('[CategoryShowcase] Error fetching categories:', error);
        setCategoryList([]);
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [pricingContext]
  );

  useEffect(() => {
    if (!pricingContext || !storeInit) return;

    const fetchData = async () => {
      const visitorId = finalId || '0';
      const keyALC = normalizeALC('');
      const { key } = buildAlbumCacheKey(
        'fg_category_showcase',
        storeInit,
        pricingContext,
        visitorId,
        keyALC
      );

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetCategories(visitorId, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeInit, fetchAndSetCategories, finalId]);

  // ── Navigation (ported from reference's handleNavigate) ──
  const handleNavigate = (name) => {
    let finalData = {
      menuname: name,
      FilterKey: 'Category',
      FilterVal: name,
      FilterKey1: '',
      FilterVal1: '',
      FilterKey2: '',
      FilterVal2: '',
    };
    sessionStorage.setItem('menuparams', JSON.stringify(finalData));

    const queryParameters1 = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join('/');

    const queryParameters = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ].join(',');

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([, value]) => value !== undefined)
      .map(([, value]) => value)
      .filter(Boolean)
      .join(',');

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
    navigate.push(url);
  };

  if (!loading && categoryList?.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', py: { xs: 6, md: 12 }, px: { xs: 2, md: 4 }, backgroundColor: '#fff' }}>

      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 5, px: 2 }}>
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
          Shop by Categories
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: { xs: '26px', sm: '36px', md: '42px' },
            color: '#1c1c1c',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          Weave tales of magic. Discover the <i>extraordinary in every detail.</i>
        </Typography>
      </Box>

      {/* Asymmetric 5-Column Grid Layout */}
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: '1450px',
          mx: 'auto',
          alignItems: 'flex-start'
        }}
      >
        {categoryList?.slice(0,5)?.map((category, index) => {
          const isLong = index % 2 === 1; // same alternating tall/square pattern as the static version
          const title = category?.CategoryName;

          return (
            <Grid
              key={category?.CategoryId ?? index}
              size={{ xs: 12, sm: 6, md: 2.4 }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover .zoom-img': {
                    transform: 'scale(1.06)'
                  },
                  '&:hover .category-link': {
                    opacity: 0.7
                  }
                }}
              >
                {/* Responsive Image Frame Aspect Ratio */}
                <Box
                  onClick={() => handleNavigate(title)}
                  sx={{
                    width: '100%',
                    aspectRatio: {
                      xs: '1 / 1',
                      md: isLong ? '4 / 5.6' : '1 / 1'
                    },
                    backgroundColor: '#f9f6f3',
                    overflow: 'hidden',
                    position: 'relative',
                    mb: 2,
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    component="img"
                    className="zoom-img"
                    src={getImage(title)}
                    alt={title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                      willChange: 'transform',
                    }}
                  />
                </Box>

                {/* Title Link Section */}
                <Link
                  className="category-link"
                  href="#"
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(title);
                  }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#1c1c1c',
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    width: 'fit-content',
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  {title}
                  <ArrowForwardIcon sx={{ fontSize: '15px', mt: '2px' }} />
                </Link>

              </Box>
            </Grid>
          );
        })}
      </Grid>

    </Box>
  );
}