'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './Css/ShopBanner.modul.scss';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
import { FiChevronRight } from "react-icons/fi";
import MaxHeader, { HeaderV2 } from './Header';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from '@/app/(core)/cache_utility/CacheBuilder';
import { readCache, writeCache } from '@/app/(core)/cache_utility/cacheActions';

const noimagefound = "/image-not-found.jpg";

const MaxAlbum = ({ storeInit }) => {
  const { finalId, islogin, loginUserDetail } = useStore();
  const [imageUrl, setImageUrl] = useState();
  const [albumList, setAlbumList] = useState([]);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const fetchAndSetAlbums = useCallback(
    async (visitorId, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

      isFetchingRef.current = true;

      try {
        const cacheRes = await readCache(cacheKey);

        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[MaxAlbum] Serving from cache");
          setAlbumList(cacheRes.data);
          isFetchingRef.current = false;
          return;
        }

        console.log("[MaxAlbum] Cache miss, calling API...");
        const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETAlbum", visitorId);
        const apiData = res?.Data?.rd || [];

        if (apiData.length > 0) {
          setAlbumList(apiData);
          writeCache(cacheKey, apiData).catch(console.error);
        } else {
          setAlbumList([]);
        }
        isFetchingRef.current = false;
      } catch (err) {
        console.error("[MaxAlbum] Error in fetch:", err);
        setAlbumList([]);
        isFetchingRef.current = false;
      }
    },
    [pricingContext, storeInit]
  );

  useEffect(() => {
    if (!pricingContext || !storeInit) return;

    setImageUrl(storeInit?.AlbumImageFol);

    const fetchData = async () => {
      const visitorId = finalId || "0";
      const keyALC = normalizeALC("");
      const { key } = buildAlbumCacheKey("fg_album", storeInit, pricingContext, visitorId, keyALC);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetAlbums(visitorId, key);
    };

    fetchData();
  }, [islogin, pricingContext, storeInit, fetchAndSetAlbums, finalId]);

  if (albumList?.length === 0) {
    return null;
  }

  return (
    <CategoryGrid
      data={albumList}
      imageUrl={imageUrl}
      title="Album"
    />
  );
};
export default MaxAlbum;



export const CategoryGrid = ({
  AlbumShowMore,
  More,
  Toglefun,
  title = "Find Your Forever Ring",
  data,
  imageUrl,
}) => {
  const navigation = useNextRouterLikeRR();

  const GenrateImage = (data) => {
    let Image;
    Image = imageUrl + data?.AlbumImageFol + "/" + data?.AlbumImageName;
    return Image;
  };

  const handleNavigate = (name) => {
    navigation.push(`/p/${name}/?A=${btoa(`AlbumName=${name}`)}`);
  };




  const CountTotalProducts = (alb) => {
    if (alb) {
      const res = alb && JSON?.parse(alb?.Designdetail);
      const totalresults = res?.length;
      return totalresults;
    } else {
      return 0;
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          px: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          position: "relative",
          boxSizing: 'border-box'
        }}
      >
        <HeaderV2 title="Album" />
        <Swiper
          loop
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            600: {
              slidesPerView: 2,
            },
            900: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
          }} style={{ display: "flex", justifyContent: "center" }}>
          {data?.slice(0, AlbumShowMore)?.map((val, i) => {
            return (
              <SwiperSlide style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
                <div key={i} className="elvee_card-grid">
                  <div className="details_elvee_overlay" onClick={() => handleNavigate(val?.AlbumName)}>
                    <div className="total_Album_elvee">
                      <h2>{CountTotalProducts(val)} Products</h2>
                    </div>

                    <div className="view_colllec_elvee">
                      <span>
                        View The Album <FiChevronRight />
                      </span>
                    </div>
                  </div>
                  <div className="title" onClick={() => handleNavigate(val?.AlbumName)}>
                    <h1>{val?.AlbumName}</h1>
                  </div>
                  <img
                    src={GenrateImage(val)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = noimagefound;
                      e.target.alt = "no-image-found";
                    }}
                    loading="lazy"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </>
  );
};
