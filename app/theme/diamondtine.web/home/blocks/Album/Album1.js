"use client";

import React, { useCallback, useEffect, useRef, useState ,useMemo} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Album1.scss';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
 
import { useRouter } from 'next/navigation';
 
import cookies from "js-cookie";
import Pako from 'pako';
import { Box, Link, Tab, Tabs, tabsClasses, useMediaQuery } from '@mui/material';
 
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import GoogleAnalytics from 'react-ga4';

const Album1 = ({storeData}) => {
    const albumRef = useRef(null);
    const [selectedAlbum, setSelectedAlbum] = useState();
    const [albumData, setAlbumData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const [imageStatus, setImageStatus] = useState({});
    const router = useRouter();
    const { islogin, loginUserDetail } = useStore();
 
    const isMobileScreen = useMediaQuery('(max-width:768px)');
   const [isLoading, setIsLoading] = useState(true);

     const isFetchingRef = useRef(false);
     const lastRequestKeyRef = useRef("");
   
    const productRefs = useRef({});

      const pricingContext = useMemo(
        () => getPricingContext(loginUserDetail, storeData, islogin),
        [loginUserDetail, storeData, islogin]
      );

    const fetchAndSetAlbums = useCallback(
        async (finalID, cacheKey) => {
          if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;
    
          isFetchingRef.current = true;
          setIsLoading(true);
    
          try {
            const cacheRes = await readCache(cacheKey);
    
            // if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
            //   console.log("[AlbumSection] Serving from cache");
              
            //   console.log("TCL:cacheRes.data ", cacheRes.data)
            //   setAlbumData(cacheRes.data);
            //   setIsLoading(false);
            //   isFetchingRef.current = false;
            //   return;
            // }
    
            // Step 2: Cache miss — call API
            console.log("[AlbumSection] Cache miss, calling API...");
            const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETAlbum", finalID);
            const apiData = res?.Data?.rd || [];
                
              
            if (apiData.length > 0) {
                setAlbumData(apiData);
    
              // Step 3: Save to server cache (fire-and-forget, 12h TTL)
              writeCache(cacheKey, apiData).catch(console.error);
            }
    
            setIsLoading(false);
            isFetchingRef.current = false;
          } catch (err) {
            console.error("[AlbumSection] Error fetching albums:", err);
            isFetchingRef.current = false;
            setIsLoading(false);
          }
        },
        [pricingContext, storeData]
      );

        useEffect(() => {
          if (!pricingContext || !storeData) return;
      
          const fetchData = async () => {
            const visitorId = cookies.get("visiterId") ?? "0";
            const IsB2BWebsite = storeData?.IsB2BWebsite ?? 0;
            const uid = loginUserDetail?.id || "0";
            const finalID = IsB2BWebsite == 0 ? (islogin === false ? visitorId : uid) : uid;
      
            const { key } = buildAlbumCacheKey("fg_album", storeData, pricingContext, finalID, normalizeALC(""));
      
            if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
            lastRequestKeyRef.current = key;
      
            await fetchAndSetAlbums(finalID, key);
          };
      
          fetchData();
        }, [islogin, pricingContext, storeData, fetchAndSetAlbums, loginUserDetail?.id]);


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

    const handleNavigation = (album) => {
        router.push(`/p/${album?.AlbumName}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`)
    }

    // const handleNavigation = (designNo, autoCode, titleLine, index) => {
    //     GoogleAnalytics.event({
    //         action: "Navigate to Product Detail",
    //         category: `Product Interaction Through Album Section`,
    //         label: designNo || titleLine,
    //         value: loginUserDetail?.firstname ?? 'User Not Login',
    //     });
    //     let obj = {
    //         a: autoCode,
    //         b: designNo,
    //         m: loginUserDetail?.MetalId,
    //         d: loginUserDetail?.cmboDiaQCid,
    //         c: loginUserDetail?.cmboCSQCid,
    //         f: {}
    //     }
    //     sessionStorage.setItem('scrollToProduct1', `product-${index}`);
    //     let encodeObj = compressAndEncode(JSON.stringify(obj))
    //     // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
    //     // router.push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
    //     router.push(`/p/${album?.AlbumName}/?A=${btoa(`AlbumName=${album?.AlbumName}`)}`);
         
    // }

    useEffect(() => {
        const scrollDataStr = sessionStorage.getItem('scrollToProduct1');
        if (!scrollDataStr) return;

        const maxRetries = 10;
        let retries = 0;

        const tryScroll = () => {
            const el = productRefs.current[scrollDataStr];
            if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                sessionStorage.removeItem('scrollToProduct1');
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(tryScroll, 200); // retry until ref is ready
            }
        };

        tryScroll();

    }, [albumData]);

    const handleChangeTab = (event, newValue) => {
        setTimeout(() => {
            setSelectedAlbum(newValue);
        }, 300);
    };

    const decodeEntities = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

     


    useEffect(() => {
        if (albumData && albumData.length > 0) {
            setSelectedAlbum(prev => prev ?? albumData[0]?.AlbumName); // only set if not already set
            
            const newImageStatus = {};
            albumData.forEach(album => {
                const designs = JSON?.parse(album?.Designdetail) || [];
                designs.forEach((design) => {
                    const imageSrc = `${storeData?.CDNDesignImageFolThumb}${design?.designno}~1.jpg`;
                    newImageStatus[imageSrc] = true;
                });
            });
            setImageStatus(newImageStatus);
        }
    }, [albumData]);


    const HandleAlbumMore = (data) => {
        const url = `/p/${encodeURIComponent(selectedAlbum)}/?A=${btoa(`AlbumName=${selectedAlbum}`)}`;
        const redirectUrl = `/loginOption/?LoginRedirect=${encodeURIComponent(url)}`;
        sessionStorage.setItem('redirectURL', url)
        router.push(islogin !== 0 ? url : redirectUrl);
    };

    const [slideHeight, setSlideHeight] = useState(null);
    const swiperSlideRef = useRef(null);

    const GenerateWidthBaseOnContent = useCallback(() => {
        const selectedAlbumDetails = albumData?.find((album) => album?.AlbumName === selectedAlbum);
        const parsedDesignDetails = selectedAlbumDetails?.Designdetail
            ? JSON.parse(selectedAlbumDetails.Designdetail)
            : null;
        const totalDesignDetails = Array.isArray(parsedDesignDetails) ? parsedDesignDetails.length : 0;
        const length = totalDesignDetails;
        let w;
        if (length === 1) {
            w = '100%';
        } else if (length === 2) {
            w = '100%';
        } else if (length === 3) {
            w = '100%';
        } else if (length > 3) {
            w = '100%';
        }
        return { width: w, length: length }
    }, [selectedAlbum])

    useEffect(() => {
        if (swiperSlideRef.current) {
            setSlideHeight(swiperSlideRef.current.offsetHeight);
        }
    }, [selectedAlbum, albumData]);

    return (
        <div ref={albumRef} draggable={false} onContextMenu={(e) => e.preventDefault()}>
            {albumData?.length != 0 &&
                <div className="dt_album_container" style={{marginTop:"50px"}}>
                    <div className='smr_ablbumtitleDiv'>
                        <span className='smr_albumtitle' >Album</span>
                    </div>
                    <Box className="tabs"
                        sx={{
                            flexGrow: 1,
                            maxWidth: "100%",
                        }}>
                        <Tabs
                            value={selectedAlbum}
                            onChange={handleChangeTab}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                            TabIndicatorProps={{
                                style: { display: 'none' }
                            }}
                        >
                            {albumData?.map((album, index) => (
                                
                                <Tab
                               
                                    key={index}
                                    label={album?.AlbumName}
                                    value={album?.AlbumName}
                                    className={selectedAlbum === album?.AlbumName ? 'active' : ''}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <div className="Dt_swiper_container"
                        style={{
                            width: GenerateWidthBaseOnContent().width,
                        }}
                    >
                        {albumData && albumData?.map((album, index) =>
                            album?.AlbumName === selectedAlbum ? (
                                <Swiper
                                    style={{
                                        width: "100%"
                                    }}
                                    key={index}
                                    spaceBetween={10}
                                    // lazy={true}
                                    navigation={true}
                                    breakpoints={{
                                        1024: {
                                            slidesPerView: 4,
                                        },
                                        768: {
                                            slidesPerView: 2,
                                        },
                                        0: {
                                            slidesPerView: 2,
                                        }
                                    }}
                                    modules={[Keyboard, FreeMode, Navigation]}
                                    keyboard={{ enabled: true }}
                                    pagination={false}
                                    className='dt_album_swiper_SubDiv'
                                >
                                    {album?.Designdetail && JSON?.parse(album?.Designdetail)?.map((design, index) => {
                                        // const imageSrc = `${storeInit?.DesignImageFol}${design?.designno}_1.${design?.ImageExtension}`;
                                        // const imageSrc = `${storeInit?.CDNDesignImageFol}${design?.designno}~1.${design?.ImageExtension}`;
                                        const imageSrc = `${storeData?.CDNDesignImageFolThumb}${design?.designno}~1.jpg`;
                                        const isImageAvailable = imageStatus[imageSrc] !== false;
                                        return (
                                            <SwiperSlide  key={index} className="swiper-slide-custom">
                                                <div className="design-slide" onClick={() => handleNavigation(design?.designno, design?.autocode, design?.TitleLine, index)}>
                                                    <img
                                                        src={isImageAvailable ? imageSrc : "/image-not-found.jpg"}
                                                        alt={design?.TitleLine}
                                                        id={`product-${index}`}
                                                        ref={(el) => (productRefs.current[`product-${index}`] = el)}
                                                        // loading="lazy"
                                                        onError={(e) => {
                                                            e.target.src = "/image-not-found.jpg";
                                                        }}
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        draggable={false}
                                                    />
                                                </div>
                                                <div className="design-info">
                                                    <p className='smr_album1price'>
                                                        {design?.designno}
                                                    </p>
                                                    {storeData?.IsPriceShow == 1 && <p className='smr_album1price'>
                                                        <span
                                                            className="smr_currencyFont"
                                                            dangerouslySetInnerHTML={{
                                                                __html: decodeEntities(
                                                                    islogin ? loginUserDetail?.CurrencyCode : storeData?.CurrencyCode
                                                                ),
                                                            }}
                                                        /> {(design?.UnitCostWithMarkUp)}
                                                    </p>}
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                    {selectedAlbum?.length > 8 && <SwiperSlide key="slide-1" className="swiper-slide-custom" style={{
                                        width: "25%",
                                        height: "auto",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <div className="data_album">
                                            <button style={{
                                                border: "none",
                                                backgroundColor: "transparent",
                                                fontWeight: "500",
                                                textDecoration: "underline",
                                                color: "grey"
                                            }} className='btn_more_A' onClick={() => HandleAlbumMore()}>View More</button>
                                        </div>
                                    </SwiperSlide>}
                                </Swiper>
                            ) : null
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default Album1;
