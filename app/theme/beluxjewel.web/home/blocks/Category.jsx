"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Box, Typography, Card, Skeleton, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.client";
import SpireBox from "./Svg";

/* ---------- styled components (unchanged) ---------- */

const SkeletonCard = () => (
  <Box sx={{ width: "100%" }}>
    <Skeleton
      variant="rectangular"
      sx={{ width: "100%", height: { xs: 160, sm: 200, md: 260 }, borderRadius: "8px" }}
    />
    <Skeleton variant="text" sx={{ mt: 2, mx: "auto", width: "60%", height: 24 }} />
  </Box>
);

const StyledCard = styled(Card)(() => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: "1px",
  backgroundColor: "transparent",
  boxShadow: "none",
  cursor: "pointer",
  boxSizing: "border-box",
  "&:hover .overlay": { opacity: 1 },
  "&:hover img": { transform: "scale(1.1)" },
}));

const CategoryImageWrapper = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  aspectRatio: "3/3.5",
  borderRadius: "1px",
  overflow: "hidden",
}));

const CategoryImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 1,
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

const SectionTitle = styled(Typography)(() => ({
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
  "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

/* ---------- helpers ---------- */

const sortByOrder = (list) =>
  [...(Array.isArray(list) ? list : [])].sort(
    (a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)
  );

/* ---------- component ---------- */

const CategoryBlock = () => {
  const navigate = useNextRouterLikeRR();

  const categoryPrevRef = useRef(null);
  const categoryNextRef = useRef(null);
  const collectionPrevRef = useRef(null);
  const collectionNextRef = useRef(null);

  const {
    categoryConfig,
    categories,
    collectionConfig,
    collections,
    loading,
    error,
    isError,
  } = useWebContentManagement();

  const handleNavigate = (name, type) => {
    const finalData = {
      menuname: name,
      FilterKey: type === "ct" ? "Category" : "Collection",
      FilterVal: name,
      FilterKey1: "",
      FilterVal1: "",
      FilterKey2: "",
      FilterVal2: "",
    };
    sessionStorage.setItem("menuparams", JSON.stringify(finalData));

    const queryParameters1 = [
      finalData.FilterKey && `${finalData.FilterVal}`,
      finalData.FilterKey1 && `${finalData.FilterVal1}`,
      finalData.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join("/");

    const queryParameters = [
      finalData.FilterKey && `${finalData.FilterVal}`,
      finalData.FilterKey1 && `${finalData.FilterVal1}`,
      finalData.FilterKey2 && `${finalData.FilterVal2}`,
    ].join(",");

    const otherparamUrl = [finalData.FilterKey, finalData.FilterKey1, finalData.FilterKey2]
      .filter(Boolean)
      .join(",");

    const menuEncoded = `${queryParameters}/${otherparamUrl}`;
    navigate.push(`/p/${finalData.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`);
  };

  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 24,
    slidesPerView: 1,
    grabCursor: true,
    breakpoints: {
      480: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
      1280: { slidesPerView: 5, spaceBetween: 24 },
    },
  };

  const skeletonGrid = (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
        gap: 3,
        mb: 4,
      }}
    >
      {[...Array(5)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </Box>
  );

  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography sx={{ color: "error.main", fontSize: "0.875rem" }}>
          Unable to load category content: {error}
        </Typography>
      </Box>
    );
  }

  if (!loading && !categories.length && !collections.length) return null;

  return (
    <Box id="ShopeByCategory" sx={{ backgroundColor: "#ffffff", width: "100%", pb: { xs: 4, md: 6 } }}>
      {/* ---------- Category ---------- */}
      {(loading || categories.length > 0) && (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 5, position: "relative" }}>
          {categoryConfig?.sectionTitle && (
            <SectionHeader>
              <SectionTitle sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <SpireBox />
                {categoryConfig.sectionTitle}
              </SectionTitle>
            </SectionHeader>
          )}

          {loading ? (
            skeletonGrid
          ) : (
            <>
              <NavButton ref={categoryPrevRef} sx={{ left: 14 }}>
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton ref={categoryNextRef} sx={{ right: 14 }}>
                <ChevronRight size={20} />
              </NavButton>

              <Swiper
                {...swiperConfig}
                style={{ paddingBottom: "10px" }}
                navigation={{
                  prevEl: categoryPrevRef.current,
                  nextEl: categoryNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = categoryPrevRef.current;
                  swiper.params.navigation.nextEl = categoryNextRef.current;
                }}
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.recordId || category.masterId}>
                    <StyledCard onClick={() => handleNavigate(category?.name, "ct")}>
                      <CategoryImageWrapper>
                        {category?.imageUrl && (
                          <CategoryImage
                            src={category.imageUrl}
                            alt={category?.catLabel || category?.name}
                          />
                        )}
                      </CategoryImageWrapper>
                      <CategoryLabel>{category?.catLabel || category?.name}</CategoryLabel>
                    </StyledCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </Box>
      )}

      {/* ---------- Collection ---------- */}
      {!loading && collections.length > 0 && (
        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            bgcolor: "#cca182",
            position: "relative",
            mt: 8,
            py: 4,
          }}
        >
          {collectionConfig?.sectionTitle && (
            <SectionHeader>
              <SectionTitle sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <SpireBox />
                {collectionConfig.sectionTitle}
              </SectionTitle>
            </SectionHeader>
          )}

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
            {collections.map((collection) => (
              <SwiperSlide key={collection.recordId || collection.masterId}>
                <StyledCard onClick={() => handleNavigate(collection?.name, "c")}>
                  <CategoryImageWrapper>
                    {collection?.imageUrl && (
                      <CategoryImage
                        sx={{ borderRadius: 0 }}
                        src={collection.imageUrl}
                        alt={collection?.catLabel || collection?.name}
                      />
                    )}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                        {collection?.catLabel || collection?.name}
                      </Typography>
                    </Box>
                  </CategoryImageWrapper>
                </StyledCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
};

export default CategoryBlock;