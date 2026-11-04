"use client";
import React, { useMemo, useCallback } from "react";
import { Box, Grid, Typography, Button, Container } from "@mui/material";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const IMAGE_NOT_FOUND = "/image-not-found.jpg";

/**
 * Ultra-Fast SSR Category Grid with Album UI/UX
 * Styled directly after app/theme/fgstore.pro/home/Album/Album.js
 * Images resolved dynamically following Product Listing specifications.
 */
const CategoryAlbumGrid = ({ initialCategories = [], storeInit = {} }) => {
  const router = useNextRouterLikeRR();
  const navigate = router.push;

  // ── Image builder matching Product Listing & Best Seller pattern ──────────
  const resolveCategoryImage = useCallback(
    (cat) => {
      const cdnFol =
        storeInit?.CDNDesignImageFol || storeInit?.DesignImageFol || "";
      const p = cat?.firstProduct;
      if (!p || !cdnFol) return IMAGE_NOT_FOUND;

      const ext = p.ImageExtension || "jpg";

      // 1. Check ImageVideoDetail for primary image (TI === 1)
      if (p.ImageVideoDetail && p.ImageVideoDetail !== "0") {
        try {
          const parsed =
            typeof p.ImageVideoDetail === "string"
              ? JSON.parse(p.ImageVideoDetail)
              : p.ImageVideoDetail;
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalImg =
              parsed.find(
                (item) => Number(item?.TI) === 1 || item?.TI === "1",
              ) || parsed[0];
            if (normalImg && normalImg.Nm) {
              const imageEx = normalImg.Ex || ext;
              const designIdentifier = p.designno || p.autocode;
              return `${cdnFol}${designIdentifier}~${normalImg.Nm}.${imageEx}`;
            }
          }
        } catch (_) {}
      }

      // 2. Standard Product Listing slot: designno~1.ext
      if (p.designno) {
        return `${cdnFol}${p.designno}~1.${ext}`;
      }

      // 3. Fallback to autocode: autocode_1.ext
      if (p.autocode) {
        return `${cdnFol}${p.autocode}_1.${ext}`;
      }

      return IMAGE_NOT_FOUND;
    },
    [storeInit],
  );

  // Pre-compute category image URLs
  const categories = useMemo(() => {
    if (!Array.isArray(initialCategories)) return [];
    return initialCategories.map((cat) => ({
      ...cat,
      imageSrc: resolveCategoryImage(cat),
    }));
  }, [initialCategories, resolveCategoryImage]);

  const handleCategoryClick = (cat) => {
    const catName = cat?.CategoryName || cat?.categoryName || "";
    if (!catName) return;
    const filterKey = "Category";
    const filterVal = catName;
    const menuEncoded = `${filterVal}/${filterKey}`;
    const url = `/p/${encodeURIComponent(catName)}/?M=${btoa(menuEncoded)}`;
    navigate(url);
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        py: { xs: 4, sm: 5, md: 6 },
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1600,
          mx: "auto",
          px: { xs: 1.5, sm: 2.5, md: 3.5, lg: 4 },
        }}
      >
        {/* SECTION HEADER */}
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4, md: 5 } }}>
          <Typography
            component="span"
            sx={{
              fontSize: { xs: "0.72rem", sm: "0.82rem" },
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#888888",
              fontWeight: 600,
              display: "block",
              mb: 1,
            }}
          >
            Curated Collections
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.35rem" },
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 400,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#0F3D4C",
            }}
          >
            Categories
          </Typography>
          <Box
            sx={{
              width: "44px",
              height: "2px",
              backgroundColor: "#0F3D4C",
              mx: "auto",
              mt: 1.5,
            }}
          />
        </Box>

        {/* CATEGORY ALBUM GRID */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {categories.map((cat, index) => {
            const name = cat.CategoryName || cat.categoryName || "Category";
            const count = cat.designCount || 0;
            const imgSrc = cat.imageSrc;

            return (
              <Grid
                item
                size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
                key={cat.categoryId || cat.id || index}
                sx={{ display: "flex" }}
              >
                <Box
                  onClick={() => handleCategoryClick(cat)}
                  sx={{
                    borderRadius: { xs: "8px", sm: "12px" },
                    overflow: "hidden",
                    border: "1px solid rgba(226, 232, 240, 0.9)",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: { sm: "translateY(-4px)" },
                      boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.12)",
                      "& .album-category-img": {
                        transform: "scale(1.05)",
                      },
                      "& .album-explore-btn": {
                        backgroundColor: "#16586e",
                        boxShadow: "0 2px 8px rgba(15, 61, 76, 0.25)",
                      },
                    },
                  }}
                >
                  {/* IMAGE AREA (1:1 Aspect Ratio) */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      backgroundColor: "#FBFBFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={imgSrc}
                      alt={name}
                      loading="lazy"
                      className="album-category-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = IMAGE_NOT_FOUND;
                      }}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        mixBlendMode: "multiply",
                        display: "block",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  </Box>

                  {/* FOOTER AREA */}
                  <Box
                    sx={{
                      px: { xs: 1, sm: 2 },
                      pt: { xs: 1, sm: 1.5 },
                      pb: { xs: 1.2, sm: 2 },
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {/* CATEGORY TITLE */}
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 600,
                        fontSize: { xs: "0.82rem", sm: "0.95rem", md: "1.02rem" },
                        color: "#0F3D4C",
                        lineHeight: 1.3,
                        textAlign: "center",
                        mb: { xs: 1, sm: 1.5 },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </Typography>

                    {/* COUNT BADGE & EXPLORE BUTTON */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.6, sm: 1 },
                        mt: "auto",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          flex: "1 1 50%",
                          height: { xs: "28px", sm: "34px" },
                          borderRadius: "6px",
                          border: "1.5px solid rgba(15, 61, 76, 0.25)",
                          backgroundColor: "rgba(15, 61, 76, 0.03)",
                          color: "#0F3D4C",
                          fontWeight: 600,
                          fontSize: { xs: "0.62rem", sm: "0.72rem" },
                          letterSpacing: "0.03em",
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          boxSizing: "border-box",
                          px: 0.3,
                        }}
                      >
                        {count} {count === 1 ? "Design" : "Designs"}
                      </Box>

                      <Button
                        variant="contained"
                        className="album-explore-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(cat);
                        }}
                        sx={{
                          flex: "1 1 50%",
                          height: { xs: "28px", sm: "34px" },
                          borderRadius: "6px",
                          backgroundColor: "#0F3D4C",
                          color: "#ffffff",
                          fontWeight: 600,
                          fontSize: { xs: "0.62rem", sm: "0.72rem" },
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          px: 0.5,
                          whiteSpace: "nowrap",
                          boxShadow: "none",
                          border: "1px solid #0F3D4C",
                          transition: "all 0.2s ease",
                        }}
                      >
                        EXPLORE
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default CategoryAlbumGrid;
