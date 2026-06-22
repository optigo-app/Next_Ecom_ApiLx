"use client"
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  useTheme,
  Skeleton,
  IconButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react"; // using lucide icons
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { HomeCategoryApi } from "@/app/(core)/utils/API/Home/HomeCategoryApi/HomeCategoryApi";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { HomeCollectionApi } from "@/app/(core)/utils/API/Home/HomeCollectionApi/HomeCollectionApi";
import { normalizeALC, buildAlbumCacheKey, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";

const SkeletonCard = () => (
  <Box sx={{ width: "100%" }}>
    <Skeleton
      variant="rectangular"
      sx={{
        width: "100%",
        height: { xs: 160, sm: 200, md: 260 },
        borderRadius: "8px",
      }}
    />
    <Skeleton
      variant="text"
      sx={{
        mt: 2,
        mx: "auto",
        width: "60%",
        height: 24
      }}
    />
  </Box>
);

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: "8px",
  backgroundColor: "transparent",
  boxShadow: "none",
  cursor: "pointer",
  boxSizing: "border-box",

  "&:hover .overlay": {
    opacity: 1,
  },

  "&:hover img": {
    transform: "scale(1.05)",
  },
}));

const CategoryImageWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  aspectRatio: "3/3.5", // 🔥 BEST FIX (auto responsive)
  borderRadius: "8px",
  overflow: "hidden",
}));

const CategoryImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover", // 🔥 keeps layout clean  
  borderRadius: 4,
  transition: "transform 0.4s ease",
});

const CategoryLabel = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(2),
  fontSize: "0.875rem",
  fontWeight: 500,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "#1a1a1a",
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "26px",
  fontWeight: 400,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#2E2E2E",
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  zIndex: 10,
  backgroundColor: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(0,0,0,0.1)",
  backdropFilter: "blur(6px)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none", // hide on mobile
  },
}));


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

const CategoryBlock = ({ assetBase, storeInit }) => {
  const { finalId, islogin, loginUserDetail } = useStore();
  const theme = useTheme();
  const navigate = useNextRouterLikeRR();
  const swiperRef = useRef(null);
  const categoryPrevRef = useRef(null);
  const categoryNextRef = useRef(null);
  const collectionPrevRef = useRef(null);
  const collectionNextRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [SectionData, setSectionData] = useState({
    category: [],
    collection: [],
  });

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  const fetchAndSetCategories = useCallback(async (finalID, cacheKey) => {
    if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const cacheRes = await readCache(cacheKey);

      if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
        console.log("[CategoryBlock] Serving from cache");
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

  const handleNavigate = (name, type) => {
    let finalData = {
      menuname: name,
      FilterKey: type === "ct" ? "Category" : "Collection",
      FilterVal: name,
      FilterKey1: "",
      FilterVal1: "",
      FilterKey2: "",
      FilterVal2: "",
    };
    sessionStorage.setItem("menuparams", JSON.stringify(finalData));
    const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");
    const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`]
      .join(",");
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
    return map[normalized] || `/fallback.jpg`;
  };


  const images = {
    collectionImages: buildNormalizedMap({
      Duometrik: `${assetBase}/images/Collection/Duometrik.jpg`,
      "Inner Glow": `${assetBase}/images/Collection/Inner Glow.jpg`,
      Kalon: `${assetBase}/images/Collection/Kalon.jpg`,
      Kendall: `${assetBase}/images/Collection/Kendall.jpg`,
      Pristine: `${assetBase}/images/Collection/Pristine.jpg`,
      Jewelrush: `${assetBase}/images/Collection/Jewelrush.webp`,
      Moodust: `${assetBase}/images/Collection/Moodust.webp`,
      Petalush: `${assetBase}/images/Collection/Petalush.webp`,
      Petalyn: `${assetBase}/images/Collection/Petalyn.webp`,
      Velar: `${assetBase}/images/Collection/Velar.webp`,
    }),

    categoryImages: buildNormalizedMap({
      Necklace: `${assetBase}/images/Category/Necklace.jpg`,
      Pendant: `${assetBase}/images/Category/Pendant.jpg`,
      Earring: `${assetBase}/images/Category/Earring.jpg`,
      Bracelet: `${assetBase}/images/Category/Bracelet.jpg`,
      Ring: `${assetBase}/images/Category/Ring.jpg`,
      Cufflink: `${assetBase}/images/Category/Cufflink.webp`,
      Mangalsutra: `${assetBase}/images/Category/Mangalsutra.webp`,
      "Mangalsutra Set": `${assetBase}/images/Category/MangalsutraSet.webp`,
      "Pendant set": `${assetBase}/images/Category/PendantSet.webp`,
      "Pendant Set": `${assetBase}/images/Category/PendantSet.webp`,
      "Pendant set": `${assetBase}/images/Category/PendantSet.webp`,
      Bangle: `${assetBase}/images/Category/Bangle.webp`,
      "Necklace Set": `${assetBase}/images/Category/NecklaceSet.webp`,
    }),
  };

  const ImagesDemo = {
    collectionImages: buildNormalizedMap({
      Glossy: `${assetBase}/images/Collection/Glossy.webp`,
      arista: `${assetBase}/images/Collection/arista.webp`,
      Artifact: `${assetBase}/images/Collection/Artifact.webp`,
      Bellucci: `${assetBase}/images/Collection/Bellucci.webp`,
      Claire: `${assetBase}/images/Collection/Claire.webp`,
      Euclid: `${assetBase}/images/Collection/Euclid.webp`,
    }),
    categoryImages: buildNormalizedMap({
      Ring: `${assetBase}/images/Category/Ring.webp`,
      Bracelet: `${assetBase}/images/Category/Bracelet.webp`,
      Earring: `${assetBase}/images/Category/Earring.webp`,
      Necklace: `${assetBase}/images/Category/Necklace.webp`,
      Mangalsutra: `${assetBase}/images/Category/Mangalsutra.webp`,
      Pendant: `${assetBase}/images/Category/Pendant.webp`,
    }),
  }

  const ImgesPick = true ? ImagesDemo : images;




  // Swiper config shared for both
  const swiperConfig = {
    onSwiper: (swiper) => (swiperRef.current = swiper),
    modules: [Navigation],
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: true,
    grabCursor: true,
    breakpoints: {
      480: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
      1280: { slidesPerView: 5, spaceBetween: 24 },
    },
    navigation: true,
    style: { paddingBottom: "30px", paddingTop: "10px" },
  };

  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh", width: "100%", pb: 8 }}>
      {/* Category Section */}
      {SectionData?.category?.length > 0 && <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 8, position: "relative" }}>
        <SectionHeader>
          <SectionTitle>Shop by Category</SectionTitle>
        </SectionHeader>

        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)'
              },
              gap: 3,
              mb: 4
            }}
          >
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </Box>
        ) : (
          SectionData?.category?.length > 0 && (
            <>
              <NavButton ref={categoryPrevRef} sx={{ left: 14 }}>
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton ref={categoryNextRef} sx={{ right: 14 }}>
                <ChevronRight size={20} />
              </NavButton>

              <Swiper
                {...swiperConfig}
                style={{ paddingBottom: '10px' }}
                navigation={{
                  prevEl: categoryPrevRef.current,
                  nextEl: categoryNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = categoryPrevRef.current;
                  swiper.params.navigation.nextEl = categoryNextRef.current;
                }}
              >
                {SectionData.category.map((category) => (
                  <SwiperSlide key={category.id}>
                    <StyledCard
                      onClick={() => handleNavigate(category?.CategoryName, "ct")}
                    >
                      <CategoryImageWrapper>
                        <CategoryImage
                          src={getImage(ImgesPick.categoryImages, category?.CategoryName)}
                          alt={category?.CategoryName}
                        />
                      </CategoryImageWrapper>
                      <CategoryLabel>{category?.CategoryName}</CategoryLabel>
                    </StyledCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )
        )}
      </Box>}

      {/* Collection Section */}
      {SectionData?.collection?.length > 0 && <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#e4e4e445",
          position: "relative",
          mt: 8,
          py: 4
        }}
      >
        <SectionHeader>
          <SectionTitle>Collections</SectionTitle>
        </SectionHeader>

        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)'
              },
              gap: 3,
              mb: 4
            }}
          >
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </Box>
        ) : (
          SectionData?.collection?.length > 0 && (
            <>
              <NavButton ref={collectionPrevRef} sx={{ left: 14 }}>
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton ref={collectionNextRef} sx={{ right: 14 }}>
                <ChevronRight size={20} />
              </NavButton>

              <Swiper
                {...swiperConfig}
                navigation={{
                  prevEl: collectionPrevRef.current,
                  nextEl: collectionNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = collectionPrevRef.current;
                  swiper.params.navigation.nextEl = collectionNextRef.current;
                }}
              >
                {SectionData.collection.map((collection) => (
                  <SwiperSlide key={collection?.CollectionName}>
                    <StyledCard
                      onClick={() =>
                        handleNavigate(collection?.CollectionName, "c")
                      }
                    >
                      <CategoryImageWrapper>
                        <CategoryImage
                          sx={{ borderRadius: 0 }}
                          src={getImage(ImgesPick.collectionImages, collection?.CollectionName)}
                          alt={collection?.CollectionName}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(2px)",
                            opacity: 0,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              fontSize: "1rem",
                              fontWeight: 600,
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                            }}
                          >
                            {collection?.CollectionName}
                          </Typography>
                        </Box>
                      </CategoryImageWrapper>
                    </StyledCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )
        )}
      </Box>}
    </Box>
  );
};

export default CategoryBlock;
