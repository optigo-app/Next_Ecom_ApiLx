"use client";
import React from "react";
import { Box, Typography, Card, Skeleton, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Navigation } from "swiper/modules";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

/* ---------- shared styled components ---------- */

export const SkeletonCard = () => (
  <Box sx={{ width: "100%" }}>
    <Skeleton
      variant="rectangular"
      sx={{ width: "100%", height: { xs: 160, sm: 200, md: 260 }, borderRadius: "8px" }}
    />
    <Skeleton variant="text" sx={{ mt: 2, mx: "auto", width: "60%", height: 24 }} />
  </Box>
);

export const SkeletonGrid = () => (
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

export const StyledCard = styled(Card)(() => ({
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

export const CategoryImageWrapper = styled(Box)(() => ({
  width: "100%",
  height: "auto",
  aspectRatio: "3 / 3.5",
  position: "relative",
  display: "block",
  flex: "none",
  borderRadius: "1px",
  overflow: "hidden",
}));

export const CategoryImage = styled("img")({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 1,
  transition: "transform 0.4s ease",
});

export const CategoryLabel = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(2),
  fontSize: "0.875rem",
  fontWeight: 500,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "#1a1a1a",
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(() => ({
  fontSize: "26px",
  fontWeight: 400,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#2E2E2E",
}));

export const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  zIndex: 10,
  backgroundColor: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(0,0,0,0.1)",
  backdropFilter: "blur(6px)",
  "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

/* ---------- shared swiper config ---------- */

export const swiperConfig = {
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

/* ---------- shared navigation hook ---------- */

export const useHandleNavigate = () => {
  const navigate = useNextRouterLikeRR();

  return (name, type) => {
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
};