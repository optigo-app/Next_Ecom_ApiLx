
"use client";

import React, { useRef, useState ,useMemo,useCallback,useEffect} from "react";
import { Box, Typography, IconButton, Container, useTheme, useMediaQuery, Fade, Skeleton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import MaxHeader from "./Header";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
 
const fallbackCollection = {
  "Status": "200",
  "Message": "Success",
  "Data": {
    "rd": [
      {
        "CollectionName": "Glossy"
      },
      {
        "CollectionName": "arista"
      },
      {
        "CollectionName": "Artifact"
      },
      {
        "CollectionName": "Bellucci"
      },
      {
        "CollectionName": "Claire"
      },
      {
        "CollectionName": "Euclid"
      }
    ]
  }
}


const CategorySlider = ({  assetBase, storeInit, IsLoading }) => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const navigate = useNextRouterLikeRR();
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { finalId, islogin, loginUserDetail } = useStore();

    const [SectionData, setSectionData] = useState({
      category: [],
      collection: [],
    });

     const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);
       const isFetchingRef = useRef(false);
       const lastRequestKeyRef = useRef("");

  const handleNavigate = (name) => {
    let finalData = {
      menuname: name,
      FilterKey: "Category",
      FilterVal: name,
      FilterKey1: "",
      FilterVal1: "",
      FilterKey2: "",
      FilterVal2: "",
    };
    sessionStorage.setItem("menuparams", JSON.stringify(finalData));
    const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");
    const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].join(",");
    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(",");
    const paginationParam = [`page=${finalData.page ?? 1}`, `size=${finalData.size ?? 50}`].join("&");
    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
    navigate.push(url);
  };

    const fetchAndSetCategories = useCallback(async (finalID, cacheKey) => {
      if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;
  
      isFetchingRef.current = true;
      setLoading(true);
  
      try {
        const cacheRes = await readCache(cacheKey);
  
        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
         
        
          setSectionData({
            collection: fallbackCollection.Data.rd,
            category: cacheRes.data,
          });
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }
  
        console.log("[CategoryBlock] Cache miss, calling API...");
        const categoryList = await HomeCategoryApi(finalID);
        const apiData = categoryList?.Data?.rd || [];
      
 
        setSectionData({
          collection: fallbackCollection.Data.rd,
          category: apiData,
        });
  
        if (apiData.length > 0) {
          writeCache(cacheKey, apiData).catch(console.error);
        }
        setLoading(false);
        isFetchingRef.current = false;
      } catch (error) {
        console.error("[CategoryBlock] Error fetching category:", error);
        setSectionData({
          collection: fallbackCollection.Data.rd,
          category: [],
        });
        setLoading(false);
        isFetchingRef.current = false;
      }
    }, [pricingContext, storeInit]);
  
    useEffect(() => {
      if (!pricingContext || !storeInit) return;
  
      const fetchData = async () => {
        const visitorId = finalId || "0";
        const keyALC = normalizeALC("");
        const { key } = buildAlbumCacheKey("fg_category", storeInit, pricingContext, visitorId, keyALC);
  
        if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
        lastRequestKeyRef.current = key;
  
        await fetchAndSetCategories(visitorId, key);
      };
  
      fetchData();
    }, [islogin, pricingContext, storeInit, fetchAndSetCategories, finalId]);

  const buildNormalizedMap = (obj) => {
    const map = {};
    Object.entries(obj).forEach(([key, value]) => {
      map[normalizeKey(key)] = value;
    });
    return map;
  };
  const normalizeKey = (key) => key?.toString().trim().toLowerCase();

  const getImage = (map, key) => {
    const normalized = normalizeKey(key);
    return map[normalized] || `/fallback-image.jpg`;
  };

  const ImagesDemo = {
    categoryImages: buildNormalizedMap({
      Ring: `${assetBase}/images/Category/Bracelet.webp`,
      Bracelet: `${assetBase}/images/Category/Ring.webp`,
      Earring: `${assetBase}/images/Category/Earring.webp`,
      Necklace: `${assetBase}/images/Category/Necklace.webp`,
      Mangalsutra: `${assetBase}/images/Category/earing1.webp`,
      Pendant: `${assetBase}/images/Category/pendent.webp`,
      Bangle: `${assetBase}/images/Category/Bangle.webp`,
      Pendant_Set: `${assetBase}/images/Category/pendentset.webp`,
    }),
  };

  
 

  // const FilterData = SectionData?.category;

  const FilterData = SectionData?.category?.filter((cat) => ImagesDemo?.categoryImages[normalizeKey(cat?.CategoryName)]) || [];


  if (IsLoading) {
    return <CategorySkeleton isMobile={isMobile} />;
  }

  if (FilterData?.length === 0) {
    return;
  }

  return (
    <Box
      component="section"
      sx={{
        width: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: "90%",
          xl: "80%",
        },
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        pb: 2,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          padding: "0 !important",
        }}
      >
        <MaxHeader title={"Essence of Style"} alignment="center" />

        <Box sx={{ position: "relative", px: { xs: 0, sm: 0, md: 4 } }}>
          <NavButton direction="left" ref={setPrevEl} />
          <NavButton direction="right" ref={setNextEl} />
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{ prevEl, nextEl }}
            loop={true}
            speed={600}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            freeMode={true}
            breakpoints={{
              0: { slidesPerView: 2.2, spaceBetween: 15 },
              480: { slidesPerView: 3.2, spaceBetween: 40 },
              768: { slidesPerView: 4.2, spaceBetween: 30, freeMode: false },
              1024: { slidesPerView: 6, spaceBetween: 60, freeMode: false },
            }}
            style={{
              paddingTop: "10px",
              paddingBottom: "40px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {FilterData?.map((cat, i) => (
              <SwiperSlide key={i} onClick={() => handleNavigate(cat.CategoryName)} style={{ height: "auto" }}>
                <CategoryCard CategoryName={cat.CategoryName} imgsrc={getImage(ImagesDemo.categoryImages, cat?.CategoryName)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
};

const CategoryCard = ({ CategoryName, imgsrc }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        group: "true",
      }}
    >
      <Box
        className="img-container"
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          overflow: "hidden",
          mb: 2,
          border: "2px solid transparent",
          transition: "all 0.4s ease",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          position: "relative",
          bgcolor: "#f5f5f5",
        }}
      >
        <img
          src={imgsrc}
          alt={CategoryName}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
          }}
        />
      </Box>

      <Typography
        className="cat-label"
        variant="body2"
        sx={{
          fontSize: { xs: "0.8rem", md: "0.9rem" },
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#000000ff",
          fontWeight: 400,
          transition: "color 0.3s ease",
          textAlign: "center",
        }}
      >
        {CategoryName}
      </Typography>
    </Box>
  );
};

const NavButton = React.forwardRef(({ direction }, ref) => {
  const isLeft = direction === "left";
  return (
    <IconButton
      ref={ref}
      disableRipple
      sx={{
        position: "absolute",
        top: "40%",
        [isLeft ? "left" : "right"]: { xs: 0, md: 20, lg: 20 },
        transform: "translateY(-50%)",
        zIndex: 20,
        bgcolor: "rgba(255, 255, 255, 0.8)", // Glassmorphism
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: { xs: 28, md: 44 },
        height: { xs: 28, md: 44 },
        color: "#111",
        transition: "all 0.3s ease",
        display: { xs: "none", md: "flex" },
        "&.swiper-button-disabled": {
          opacity: 0,
          cursor: "default",
        },
      }}
    >
      {isLeft ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
    </IconButton>
  );
});

export default CategorySlider;

const CategorySkeleton = ({ isMobile }) => {
  const CARD_SIZE = isMobile ? 100 : 160;
  const slides = isMobile ? 4 : 6;

  return (
    <Box
      sx={{
        width: "100%",
        pb: 2,
        py: 4,
        mx: "auto",
      }}
    >
      {/* Header Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Skeleton variant="text" width={isMobile ? "50%" : "30%"} height={50} animation="wave" />
      </Box>

      {/* Carousel Skeleton */}
      <Box sx={{ display: "flex", gap: 3, px: 2, overflowX: "auto", alignItems: "center", justifyContent: "center" }}>
        {[...Array(slides)].map((_, i) => (
          <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Skeleton variant="circular" width={CARD_SIZE} height={CARD_SIZE} animation="wave" sx={{ mb: 1 }} />
            <Skeleton variant="text" width={CARD_SIZE * 0.6} height={16} animation="wave" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
