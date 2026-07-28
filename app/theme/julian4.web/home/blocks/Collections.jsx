"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';

// ── Dynamic data wiring (ported from CollectionPage.jsx reference, adapted to this app's conventions) ──
import Cookies from 'js-cookie';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { HomeCollectionPageApi } from "@/app/(core)/utils/API/Home/HomeCollectionPage/HomeCollectionPageApi";

// Soft, warm jewelry store aesthetic colors — used as a background fallback
// only if a collection item has no image (same idea as the reference).
const FALLBACK_COLORS = [
  '#F5E6E8',
  '#FDF5E6',
  '#F0F4F8',
  '#FAF0E6',
  '#E6E6FA',
  '#FFF5EE',
  '#F5F5DC',
];

export default function CollectionSection() {
  const { islogin, loginUserDetail, storeinit, finalId } = useStore();
  const { push } = useNextRouterLikeRR();
  const navigate = (url) => push(url);

  const [collectionList, setCollectionList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch collections ──
  const fetchCollection = async () => {
    try {
      setLoading(true);
      const visiterId = Cookies.get('visiterId');
      const { IsB2BWebsite } = storeinit || {};
      let finalID;

      if (IsB2BWebsite == 0) {
        finalID = islogin === false ? visiterId : loginUserDetail?.id || '0';
      } else {
        finalID = loginUserDetail?.id || '0';
      }

      const res = await HomeCollectionPageApi(finalID || finalId);
      const list = res?.Data?.rd;
      if (list) setCollectionList(list);
    } catch (error) {
      console.log('Fetchcollection error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigation logic (same pattern as reference's handelMenu) ──
  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (
      event?.ctrlKey ||
      event?.shiftKey ||
      event?.metaKey ||
      (event?.button && event?.button === 1)
    ) {
      return;
    }

    event?.preventDefault();

    let finalData = {
      menuname: param?.menuname ?? '',
      FilterKey: param?.key ?? '',
      FilterVal: param?.value ?? '',
      FilterKey1: isFilterKey2Ignore === 1 ? param2?.key ?? '' : param1?.key ?? '',
      FilterVal1: isFilterKey2Ignore === 1 ? param2?.value ?? '' : param1?.value ?? '',
      FilterKey2: isFilterKey2Ignore === 1 ? '' : param2?.key ?? '',
      FilterVal2: isFilterKey2Ignore === 1 ? '' : param2?.value ?? '',
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

    navigate(url);
  };

  const handleCollectionClick = (item, event) => {
    handelMenu(
      { menuname: 'Collection', key: 'Auto', value: '' },
      { key: 'collection', value: item?.CollectionName },
      {},
      event,
      0
    );
  };

  if (loading || collectionList?.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', pb: { xs: 6, md: 10 }, px: { xs: 2, md: 6 }, backgroundColor: '#fff' }}>

      {/* Title Header Block */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            marginTop: 10,
                       fontSize: { xs: '26px', sm: '32px', md: '36px' },
            color: '#1c1c1c',
            letterSpacing: '0.5px',
          }}
        >
          Explore our <i>new collections</i>
        </Typography>
      </Box>

 {/* Grid Collections Container */}
<Grid
  container
  sx={{
    maxWidth: '1400px',
    mx: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: { xs: '16px', md: '20px' }
  }}
>
  {collectionList.map((collection, index) => {
    const hasImage = collection?.imgsrc && collection.imgsrc.length > 0;
    const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];

    return (
      <Grid
        item
        key={collection?.CollectionId ?? index}
        sx={{
          // Flex-basis ensures all 5 items stretch evenly across the full width
          flex: { 
            xs: '1 1 100%', 
            sm: '1 1 calc(50% - 16px)', 
            md: '1 1 calc(20% - 20px)' 
          },
          minWidth: 0,
        }}
      >
        <Box
          onClick={(e) => handleCollectionClick(collection, e)}
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 2, md: 3 },
            backgroundColor: hasImage ? 'transparent' : bgColor,

            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: hasImage ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
              zIndex: 2,
              transition: 'background-color 0.4s ease',
            },

            '&:hover::before': {
              backgroundColor: hasImage ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
            },
            '&:hover .collection-bg': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {/* Background Image */}
          {hasImage && (
            <Box
              component="img"
              className="collection-bg"
              src={collection.imgsrc}
              alt={collection.CollectionName}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 1,
                transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          )}

          {/* Tag */}
          <Box sx={{ position: 'relative', zIndex: 3, width: '100%' }}>
            {collection?.tag && (
              <Typography
                sx={{
                  color: hasImage ? '#fff' : '#555',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {collection.tag}
              </Typography>
            )}
          </Box>

          {/* Title & Description */}
          <Box sx={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '100%' }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: { xs: '24px', sm: '28px', md: '36px' },
                color: hasImage ? '#fff' : '#555',
                mb: collection?.description ? 1 : 0,
                lineHeight: 1.2,
              }}
            >
              {collection.CollectionName}
            </Typography>

            {collection?.description && (
              <Typography
                sx={{
                  color: hasImage ? 'rgba(255, 255, 255, 0.85)' : '#888',
                  fontSize: '14px',
                  lineHeight: 1.4,
                  maxWidth: '260px',
                  mx: 'auto',
                  fontWeight: 500,
                }}
              >
                {collection.description}
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
    );
  })}
</Grid>

    </Box>
  );
}