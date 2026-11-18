"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
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
  ArticleDrawer,
  articleDrawerProps = {},
}) => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const enabled = Number(storeInit?.IsProductWebCustomization) === 1;

  return (
    <>
      {enabled && isModeKnown && isDesignBase && (
        <DesignBaseCustomization storeInit={storeInit} {...designProps} />
      )}

      {enabled && isModeKnown && !isDesignBase && (
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

      {ArticleDrawer && (
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
