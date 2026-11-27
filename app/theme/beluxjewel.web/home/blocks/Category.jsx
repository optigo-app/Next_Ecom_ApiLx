"use client";
import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.client";
import SpireBox from "./Svg";
import {
  SkeletonGrid,
  StyledCard,
  CategoryImageWrapper,
  CategoryImage,
  CategoryLabel,
  SectionHeader,
  SectionTitle,
  NavButton,
  swiperConfig,
  useHandleNavigate,
} from "./Shared.jsx";
 

const JUSTIFY = { left: "flex-start", center: "center", right: "flex-end" };
 
const blockSx = (b) => {
  if (!b || typeof b !== "object") return {};
  const styles = Array.isArray(b.fontStyle) ? b.fontStyle : [];
  return {
    fontSize: b.fontSize ? `${b.fontSize}px` : undefined,
    fontFamily: b.fontFamily || undefined,
    color: b.color || undefined,
    fontWeight: styles.includes("bold") ? 700 : 400,
    fontStyle: styles.includes("italic") ? "italic" : "normal",
    textDecoration: styles.includes("underline") ? "underline" : "none",
    textAlign: b.align || "left",
  };
};

const CategoryBlock = ({ initialData = null, initialCategoryConfig, initialCategories }) => {
  const handleNavigate = useHandleNavigate();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const websiteContent = useWebContentManagement({ initialData });
  const hasServerContent = Array.isArray(initialCategories);
  const categoryConfig = initialCategoryConfig ?? websiteContent.categoryConfig;
  const categories = initialCategories ?? websiteContent.categories ?? [];
  const loading = websiteContent.loading && !hasServerContent;
  const error = websiteContent.error;
  const isError = websiteContent.isError && !hasServerContent;

  // Visibility switch from the admin panel (=== false so old records still show)
  if (categoryConfig?.visible === false) return null;

  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography sx={{ color: "error.main", fontSize: "0.875rem" }}>
          Unable to load category content: {error}
        </Typography>
      </Box>
    );
  }

  if (!loading && !categories.length) return null;

  // Header / sub header / description data
  const header = categoryConfig?.header;
  const subHeader = categoryConfig?.subHeader;
  const description = categoryConfig?.description;

  // Old records only have sectionTitle, so use it as the header text fallback
  const headerText = (header?.text ?? categoryConfig?.sectionTitle ?? "").trim();
  const subHeaderText = (subHeader?.text ?? "").trim();
  const descriptionText = (description?.text ?? "").trim();
  const hasHeading = !!(headerText || subHeaderText || descriptionText);

  console.log("HEADER DEBUG", categoryConfig?.header, categoryConfig?.subHeader, categoryConfig?.description);

  return (
    <Box id="ShopeByCategory" sx={{ backgroundColor: "#ffffff", width: "100%", pb: { xs: 4, md: 6 } }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 5, position: "relative" }}>
        {hasHeading && (
          <SectionHeader>
            {headerText && (
              <SectionTitle
                component="h2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  justifyContent: JUSTIFY[header?.align] || "flex-start",
                  ...blockSx(header),
                }}
              >
                <SpireBox />
                {headerText}
              </SectionTitle>
            )}

            {subHeaderText && (
              <Typography
                component="h3"
                sx={{ mt: 1, lineHeight: 1.4, whiteSpace: "pre-wrap", ...blockSx(subHeader) }}
              >
                {subHeaderText}
              </Typography>
            )}

            {descriptionText && (
              <Typography
                component="p"
                sx={{ mt: 1, lineHeight: 1.6, whiteSpace: "pre-wrap", ...blockSx(description) }}
              >
                {descriptionText}
              </Typography>
            )}
          </SectionHeader>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : (
          <>
            <NavButton ref={prevRef} sx={{ left: 14 }}>
              <ChevronLeft size={20} />
            </NavButton>
            <NavButton ref={nextRef} sx={{ right: 14 }}>
              <ChevronRight size={20} />
            </NavButton>

            <Swiper
              {...swiperConfig}
              className="product-card-group-grid"
              style={{ paddingBottom: "10px" }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category.recordId || category.masterId} style={{ height: "auto" }}>
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
    </Box>
  );
};

export default CategoryBlock;