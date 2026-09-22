import React, { useEffect, useState } from "react";
import "./Wishlist.modul.scss";
import Cookies from "js-cookie";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  formatter,
  formatTitleLine,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { RiDeleteBinLine } from "react-icons/ri";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSnackbarStore } from "@/app/(core)/hooks/useSnackbar";

const WishlistItems = ({
  isloding,
  item,
  itemInCart,
  updateCount,
  countDataUpdted,
  itemsLength,
  currency,
  decodeEntities,
  WishCardImageFunc,
  handleRemoveItem,
  handleWishlistToCart,
  handleMoveToDetail,
}) => {
  const { setCartCountNum, setWishCountNum, storeInit, finalId } = useStore();
  const noImageFound = "image-not-found.jpg";
  const [imageSrc, setImageSrc] = useState();
  const { broadcast } = useBroadcaster();
  const CDNDesignImageFolThumb = storeInit?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const isLoading = item?.loading;

  const visiterId = Cookies.get("visiterId");

  const handleWishlistToCartFun = async (item) => {
    const returnValue = await handleWishlistToCart(item);
    if (returnValue?.msg == "success") {
      showSnackbar("Wishlist items added in cart");
      GetCountAPI(finalId).then((res) => {
        setCartCountNum(res?.cartcount);
        broadcast("UPDATE_CART_COUNT", res?.cartcount);
      });
    }
  };

  const handleRemoveItemFun = async (item) => {
    const returnValue = await handleRemoveItem(item);
    if (returnValue?.msg == "success") {
      showSnackbar("Wishlist item removed successfully");
      GetCountAPI(finalId).then((res) => {
        setWishCountNum(res?.wishcount);
        broadcast("UPDATE_WISH_COUNT", res?.wishcount);
      });
    }
  };

  const loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <>
        <Grid
          item
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Card
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              background: "#fff",
              border: "1px solid #eee",
              boxShadow: "none",
              outline: "none",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                aspectRatio: {
                  xs: "3 / 3",
                  sm: "1 / 1",
                  md: "1 / 1",
                },
                bgcolor: "#fff9f266",
              }}
            >
              {/* ----- IMAGE / SKELETON ----- */}
              {isLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  height="100%"
                  width="100%"
                  sx={{
                    bgcolor: "#fafafa",
                  }}
                />
              ) : (
                <CardMedia
                  component="img"
                  image={item?.images}
                  alt={item?.TitleLine}
                  onError={(e) => {
                    const current = e.target.src;
                    if (
                      !current.includes(fullImagePath) &&
                      item?.ImageCount > 0
                    ) {
                      e.target.src = fullImagePath;
                      return;
                    }
                    if (!current.includes("image-not-found.jpg")) {
                      e.target.src = noImageFound;
                    }
                  }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  sx={{
                    width: "100%",
                    height: "100%",
                    mixBlendMode: "multiply",
                  }}
                  loading="lazy"
                  onClick={() => handleMoveToDetail(item)}
                />
              )}

              {/* ===== DELETE BUTTON (Top-Right) ===== */}
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 10,
                  bgcolor: "#dbdbdb38",
                  backdropFilter: "blur(4px)",
                  "&:hover": { background: "rgba(255,255,255,0.9)" },
                }}
                onClick={(e) => handleRemoveItemFun(item)}
              >
                <RiDeleteBinLine />
              </IconButton>

              {/* ===== ADD TO CART BUTTON (Bottom-Right inside image) ===== */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 10,
                }}
              >
                <Box
                  onClick={() => handleWishlistToCartFun(item)}
                  sx={{
                    px: 2.4,
                    py: 0.9,
                    borderRadius: "999px", // ✨ fully rounded
                    fontSize: "13px",
                    fontWeight: 600,
                    color: item?.IsInCart === 1 ? "#444" : "#fff",
                    background:
                      item?.IsInCart === 1
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(0,0,0,0.85)", // ✨ visible on white
                    cursor: item?.IsInCart === 1 ? "default" : "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // ✨ makes it visible on white background
                    transition: "0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      background:
                        item?.IsInCart === 1
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(0,0,0,1)", // subtle enhancement
                      transform:
                        item?.IsInCart === 1 ? "none" : "translateY(-1px)",
                    },
                  }}
                >
                  {item?.IsInCart !== 1 ? "Add to Cart +" : "In Cart"}
                </Box>
              </Box>
            </Box>

            {/* ===== CARD CONTENT ===== */}
            <CardContent sx={{ py: 2.5, px: 1 }}>
              {/* --- TITLE (center, single-line, trimmed like main layout) --- */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: "#0a1f47",
                  textAlign: "center",
                  mb: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: "1.3em",
                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                    md: "0.94rem",
                    lg: "1rem",
                  },
                }}
              >
                {formatTitleLine(item?.TitleLine)}
              </Typography>

              {/* --- GRID EXACT COPY OF MAIN COMPONENT --- */}
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={0.8}>
                  {/* --- DESIGN NO (left) --- */}
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: {
                            xs: "0.62rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          color: item?.ArticleNo ? "#000" : "transparent",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item?.ArticleNo}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* --- DWT (right) --- */}
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: {
                            xs: "0.62rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          color: item?.Dwt ? "#000" : "transparent",
                          letterSpacing: "0.02em",
                        }}
                      >
                        DWT&nbsp;:
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: {
                            xs: "0.62rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          color: item?.Dwt ? "#000" : "transparent",
                        }}
                      >
                        {item?.Dwt
                          ? `${item?.Dwt} ${item?.Dpcs ? `/ ${item?.Dpcs}` : ""}`
                          : "0"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* --- PRICE (left) --- */}
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {storeInit?.IsPriceShow == 1 ? (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.85rem",
                            },
                            color: item?.FinalCost ? "#000" : "transparent",
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                decodeEntities(
                                  loginInfo?.CurrencyCode ??
                                    storeInit?.CurrencyCode,
                                ) + " ",
                            }}
                          />
                          {formatter(item?.FinalCost)}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.85rem",
                            },
                            color: "#000",
                          }}
                        >
                          --
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* --- GWT (right) --- */}
                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: {
                            xs: "0.62rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          color: item?.Nwt ? "#000" : "transparent",
                          letterSpacing: "0.02em",
                        }}
                      >
                        NWT&nbsp;:
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          color: item?.Nwt ? "#000" : "transparent",
                        }}
                      >
                        {item?.Nwt?.toFixed(3) || "0"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </>
    </>
  );
};

export default WishlistItems;
