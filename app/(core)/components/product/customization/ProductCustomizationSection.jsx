"use client";
import React, { useState } from "react";
import { Box, Button, Chip, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DesignBaseCustomization from "./DesignBaseCustomization";

/**
 * Single customization section for the product detail page of every theme.
 *
 *   IsDesignBaseWeb = 1 -> inline design-based dropdowns (values are only stored; they go to the API
 *                          when the item is added to cart / wishlist)
 *   otherwise           -> article-based "Customize Design" button + the theme's article drawer
 *
 * Nothing is rendered until the mode is known (article rows loaded) so the two modes never flicker.
 * The article drawer differs per theme (stock labels etc.), so the theme passes it in as ArticleDrawer.
 */
const ProductCustomizationSection = ({
  storeInit,
  isDesignBase,
  isModeKnown,
  designProps = {},
  designBaseInDrawer = false,
  ArticleDrawer,
  articleDrawerProps = {},
}) => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const enabled = Number(storeInit?.IsProductWebCustomization) === 1;
  const metalColorLabel = designProps.metalColorCombo?.find(
    (option) =>
      String(option?.colorcode ?? "").toLowerCase() ===
        String(designProps.metalColor ?? "").toLowerCase() ||
      String(option?.metalcolorname ?? "").toLowerCase() ===
        String(designProps.metalColor ?? "").toLowerCase(),
  )?.metalcolorname;
  const selectedConfig = [
    {
      value: [
        designProps.metalType || (designProps.isCartRestore && designProps.metalTypeName),
        metalColorLabel || designProps.metalColor ||
          (designProps.isCartRestore && designProps.metalColorName),
      ]
        .filter(Boolean)
        .join(" · "),
    },
    { value: designProps.selectDiaQc?.replace(",", " / ") },
    {
      value:
        designProps.articleIdentity?.DiamondOrigin ||
        designProps.articleIdentity?.DiamondOriginName ||
        designProps.articleIdentity?.DiaOrigin,
    },
    {
      value:
        designProps.articleIdentity?.ArticleNo ||
        designProps.singleProd?.ArticleNo ||
        designProps.articleIdentity?.ArticleId,
      prefix: "Art# ",
    },
  ].filter((item) => item.value);

  return (
    <>
      {enabled && isModeKnown && isDesignBase && !designBaseInDrawer && (
        <DesignBaseCustomization storeInit={storeInit} {...designProps} />
      )}

      {enabled && isModeKnown && (!isDesignBase || designBaseInDrawer) && (
        <Box sx={{ width: "100%", mt: 3, mb: 0 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setIsCustomizerOpen(true)}
            sx={{
              height: 48,
              borderRadius: "2px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#0B2F83",
              borderColor: "#0B2F83",
              borderWidth: "1.5px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              "&:hover": {
                borderColor: "#082360",
                backgroundColor: "#F0F4FC",
                borderWidth: "1.5px",
              },
            }}
          >
            Customize Design
          </Button>
        </Box>
      )}

      {enabled && isModeKnown && isDesignBase && designBaseInDrawer && (
        <Drawer
          anchor="right"
          open={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "100%", sm: 560 },
              maxWidth: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #e5e7eb", bgcolor: "#fff" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#0b2f83", textTransform: "uppercase" }}>
                Customize your piece
              </Typography>
              <IconButton
                aria-label="Close customization"
                onClick={() => setIsCustomizerOpen(false)}
                sx={{ bgcolor: "#f1f5f9", width: 38, height: 38 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#64748b", textTransform: "uppercase", mb: 1 }}>
              Selected configuration
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {selectedConfig.map(({ value, prefix = "" }, index) => (
                <Chip
                  key={`${index}-${value}`}
                  label={`${prefix}${value}`}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    bgcolor: prefix ? "#0b2f83" : "#fff",
                    color: prefix ? "#fff" : "#173b75",
                    border: prefix ? "none" : "1px solid #d8e1ef",
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f8fafc", flex: 1, overflowY: "auto" }}>
            <DesignBaseCustomization
              storeInit={storeInit}
              stacked
              {...designProps}
            />
          </Box>
          <Box sx={{ p: 2.5, borderTop: "1px solid #e2e8f0", bgcolor: "#fff", flexShrink: 0 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setIsCustomizerOpen(false)}
              sx={{
                minHeight: 54,
                borderRadius: 2,
                bgcolor: "#0b2f83",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                boxShadow: "0 4px 16px rgba(11,47,131,0.2)",
                "&:hover": { bgcolor: "#082360" },
              }}
            >
              Confirm customisation
            </Button>
          </Box>
        </Drawer>
      )}

      {ArticleDrawer && !isDesignBase && (
        <ArticleDrawer
          open={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          storeInit={storeInit}
          {...articleDrawerProps}
        />
      )}
    </>
  );
};

export default ProductCustomizationSection;
