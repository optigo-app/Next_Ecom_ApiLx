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
  StyledCard,
  CategoryImageWrapper,
  CategoryImage,
  SectionHeader,
  SectionTitle,
  NavButton,
  swiperConfig,
  useHandleNavigate,
} from "./Shared.jsx";

/* ---------- heading helpers (header / subHeader / description) ---------- */

const JUSTIFY = { left: "flex-start", center: "center", right: "flex-end" };

// Turns the saved settings of one block into MUI sx styles.
// Returns {} when the block has no settings, so old data keeps the default look.
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

const CollectionBlock = ({ initialData = null, initialCollectionConfig, initialCollections }) => {
  const handleNavigate = useHandleNavigate();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const websiteContent = useWebContentManagement({ initialData });
  const hasServerContent = Array.isArray(initialCollections);
  const collectionConfig = initialCollectionConfig ?? websiteContent.collectionConfig;
  const collections = initialCollections ?? websiteContent.collections ?? [];
  const loading = websiteContent.loading && !hasServerContent;
  const isError = websiteContent.isError && !hasServerContent;

  // Visibility switch from the admin panel (=== false so old records still show)
  if (collectionConfig?.visible === false) return null;

  // Same as original: hidden while loading. Errors are shown by CategoryBlock, so skip here.
  if (loading || isError || !collections.length) return null;

  // Header / sub header / description data
  const header = collectionConfig?.header;
  const subHeader = collectionConfig?.subHeader;
  const description = collectionConfig?.description;

  // Old records only have sectionTitle, so use it as the header text fallback
  const headerText = (header?.text ?? collectionConfig?.sectionTitle ?? "").trim();
  const subHeaderText = (subHeader?.text ?? "").trim();
  const descriptionText = (description?.text ?? "").trim();
  const hasHeading = !!(headerText || subHeaderText || descriptionText);

  return (
    <Box id="ShopeByCollection" sx={{ backgroundColor: "#ffffff", width: "100%", pb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#cca182",
          position: "relative",
          mt: 3,
          py: 4,
        }}
      >
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

        <NavButton ref={prevRef} sx={{ left: 14 }}>
          <ChevronLeft size={20} />
        </NavButton>
        <NavButton ref={nextRef} sx={{ right: 14 }}>
          <ChevronRight size={20} />
        </NavButton>

        <Swiper
          {...swiperConfig}
          className="product-card-group-grid"
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {collections.map((collection) => (
            <SwiperSlide key={collection.recordId || collection.masterId} style={{ height: "auto" }}>
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
                      bottom: -360,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                  
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
    </Box>
  );
};

export default CollectionBlock;