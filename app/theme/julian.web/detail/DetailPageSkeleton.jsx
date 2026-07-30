"use client";
import React from "react";
import { Box, Skeleton, Stack, Typography, Button, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const decodeEntities = (html) => {
  if (typeof document === "undefined") return html || "";
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#999"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ margin: "0 2px" }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function DetailPageSkeleton({ imageUrl, title, price, CurrencyCode, ArticleNo, nwt, media }) {
  const [failedImages, setFailedImages] = React.useState({});

  const candidateImages = React.useMemo(() => {
    if (media && media.length > 1) {
      return media.map((item, idx) => ({
        src: item?.src,
        type: item?.type || "image",
        index: idx
      }));
    }

    if (!imageUrl || typeof imageUrl !== "string") return [];

    const list = [{
      src: imageUrl,
      type: "image",
      index: 1
    }];

    try {
      const lastSlashIdx = imageUrl.lastIndexOf("/");
      if (lastSlashIdx === -1) return list;

      const baseCdn = imageUrl.substring(0, lastSlashIdx + 1);
      const fileName = imageUrl.substring(lastSlashIdx + 1);
      if (!fileName) return list;

      const parts = fileName.split("~");
      const designNo = parts[0];
      if (!designNo) return list;

      let colorCode = null;
      let extension = "webp";

      if (parts.length > 2) {
        const lastPart = parts[2].split(".");
        colorCode = lastPart[0];
        extension = lastPart[1] || "webp";
      } else if (parts.length > 1) {
        const lastPart = parts[1].split(".");
        extension = lastPart[1] || "webp";
      }

      for (let i = 2; i <= 4; i++) {
        const src = colorCode
          ? `${baseCdn}${designNo}~${i}~${colorCode}.${extension}`
          : `${baseCdn}${designNo}~${i}.${extension}`;

        list.push({
          src,
          type: "image",
          index: i
        });
      }
    } catch (e) {
      console.error("Error parsing imageUrl in DetailPageSkeleton:", e);
    }
    return list;
  }, [media, imageUrl]);

  const handleImgError = (index) => {
    setFailedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const visibleImages = candidateImages.filter((item) => !failedImages[item.index]);
  const shouldRenderPlaceholder = visibleImages.length === 1;

  return (
    <Box
      sx={{
        pt: { xs: 2, md: 4 },
        px: { sm: 2, xs: 1, md: 8 },
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#fff",
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('error', function(e) {
              if (e.target && e.target.tagName === 'IMG') {
                var gridItem = e.target.closest('.skeleton-grid-item');
                if (gridItem) {
                  gridItem.style.display = 'none';
                }
              }
            }, true);
          `,
        }}
      />
      {/* Breadcrumb Placeholder */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          color: "#666",
          mb: 3.2,
          minHeight: "20px",
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#555",
            cursor: "pointer",
          }}
        >
          Home
        </Typography>
        <ChevronRightIcon />
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#0a1f47",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 350,
          }}
        >
          {title || ArticleNo || "Product Detail"}
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1, md: 1 }}>
        {/* LEFT COLUMN: Matching LeftSide.jsx (md: 7, spacing: 0.6) */}
        <Grid size={{ xs: 12, sm: 12, md: 7 }}>
          <Grid container spacing={0.6}>
            {visibleImages.map((item) => (
              <Grid
                item
                size={{ xs: 6 }}
                key={item.index}
                className="skeleton-grid-item"
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#e9e9e91a",
                    aspectRatio: { xs: "3/4", sm: "1/1.25", md: "1/1.3" },
                    border: "1px solid #f2f0ee33",
                  }}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt=""
                      onError={() => handleImgError(item.index)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        mixBlendMode: "multiply",
                      }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={item.src}
                      loop
                      muted
                      autoPlay
                      playsInline
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}

            {shouldRenderPlaceholder && (
              <Grid item size={{ xs: 6 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#e9e9e91a",
                    aspectRatio: { xs: "3/4", sm: "1/1.25", md: "1/1.3" },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* RIGHT COLUMN: Matching RightSide.jsx (md: 5, px: dynamic) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: "sticky",
              top: 150,
              height: "fit-content",
              width: "100%",
              px: {
                xs: 1, // mobile
                sm: 2, // small screens
                md: 4, // tablets
                lg: 5, // laptops
                xl: 6, // large desktops
              },
              boxSizing: "border-box",
            }}
          >
            {/* ArticleNo */}
            {ArticleNo ? (
              <Typography
                variant="body2"
                sx={{
                  color: "#424242",
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  mb: 0.5,
                }}
              >
                {ArticleNo}
              </Typography>
            ) : null}

            {/* Title Line */}
            {title ? (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "22px", md: "26px" },
                  color: "#1a1a1a",
                  lineHeight: 1.3,
                  mb: 1.5,
                }}
              >
                {title}
              </Typography>
            ) : ArticleNo ? null : (
              <Skeleton
                variant="text"
                width="40%"
                height={26}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80", mb: 1 }}
              />
            )}

            {/* Price */}
            {price ? (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: decodeEntities(CurrencyCode || "$"),
                  }}
                />
                <span>{formatter(price)}</span>
              </Typography>
            ) : (
              <Skeleton
                variant="text"
                width="50%"
                height={42}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80" }}
              />
            )}

            {/* Specification Grid (Metal Purity, Color, Diamond Quality, Net Wt) */}
            <Box sx={{ mb: 3, mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Grid
                container
                spacing={2}
                sx={{
                  borderBottom: "1px solid #f0f0f0",
                  pb: 2,
                }}
              >
              {/* Metal Purity */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Metal Purity
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    minHeight: "22px",
                  }}
                >
                  <Skeleton variant="text" width={60} />
                </Typography>
              </Grid>

              {/* Metal Color */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Metal Color
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600, minHeight: "22px" }}>
                  <Skeleton variant="text" width={60} />
                </Typography>
              </Grid>

              {/* Diamond Quality */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Diamond Quality
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600, minHeight: "22px" }}>
                  <Skeleton variant="text" width={80} />
                </Typography>
              </Grid>

              {/* Diamond Origin */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Diamond Origin
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600, minHeight: "22px" }}>
                  <Skeleton variant="text" width={80} />
                </Typography>
              </Grid>

              {/* Net Wt */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Net Wt
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600, minHeight: "22px" }}>
                  {nwt ? (
                    Number(nwt).toFixed(3)
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Customize Design Button */}
            <Button
              fullWidth
              variant="outlined"
              sx={{
                height: 48,
                borderRadius: "2px",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                borderColor: "#000000",
                color: "#000000",
                mb: 2,
                "&:hover": {
                  borderColor: "#000000",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              CUSTOMIZE DESIGN
            </Button>

            {/* Action Buttons Row (Add to Cart / Wishlist) */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  height: 48,
                  borderRadius: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  borderColor: "#000000",
                  color: "#000000",
                  "&:hover": {
                    borderColor: "#000000",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Add to cart
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  height: 48,
                  borderRadius: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
              >
                Add to wishlist
              </Button>
            </Stack>

            {/* Product Guarantees & Care List */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
                mb: 3.5,
                pl: 0.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <Typography sx={{ fontSize: "13px", color: "#222222", fontWeight: 500 }}>
                  Anti Tarnish
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                <Typography sx={{ fontSize: "13px", color: "#222222", fontWeight: 500 }}>
                  7 days Return / Exchange
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <Typography sx={{ fontSize: "13px", color: "#222222", fontWeight: 500 }}>
                  12 month warranty
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <Typography sx={{ fontSize: "13px", color: "#222222", fontWeight: 500 }}>
                  Hypoallergenic
                </Typography>
              </Box>
            </Box>

            {/* Tabbed Product Details Container */}
            <Box
              sx={{
                border: "1px solid #E5E5E5",
                borderRadius: "2px",
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  borderBottom: "1px solid #E5E5E5",
                  backgroundColor: "#F5F5F5",
                }}
              >
                <Button
                  disableRipple
                  sx={{
                    py: 1.2,
                    px: 1,
                    borderRadius: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                  }}
                >
                  PRODUCT DETAILS
                </Button>
                <Button
                  disableRipple
                  sx={{
                    py: 1.2,
                    px: 1,
                    borderRadius: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: "#000000",
                  }}
                >
                  PRODUCT CARE
                </Button>
                <Button
                  disableRipple
                  sx={{
                    py: 1.2,
                    px: 1,
                    borderRadius: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: "#000000",
                  }}
                >
                  PRICE BREAKUP
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
