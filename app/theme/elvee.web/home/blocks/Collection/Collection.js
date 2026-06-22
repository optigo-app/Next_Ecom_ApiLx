// src/pages/CollectionPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { HomeCollectionPageApi } from "../../../../../../utils/API/Home/HomeCollectionPage/HomeCollectionPageApi";
import Cookies from "js-cookie";
import { useRecoilValue } from "recoil";
import { el_loginState, syncProductListAtom } from "../../../Recoil/atom";
import { useNavigate } from "react-router-dom";
import CollectionSkeleton from "./Loader";

// Soft, warm jewelry store aesthetic colors for items without images
const FALLBACK_COLORS = [
  "#F5E6E8", // Soft Rose
  "#FDF5E6", // Old Lace
  "#F0F4F8", // Alice Blue
  "#FAF0E6", // Linen
  "#E6E6FA", // Lavender
  "#FFF5EE", // Seashell
  "#F5F5DC", // Beige
];

const CollectionPage = () => {
  const islogin = useRecoilValue(el_loginState);
  const [CollectionList, setCollectionList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const syncProductList = useRecoilValue(syncProductListAtom);

  const title = "Collection";
  const description = "Radiant elegance, modern charm: Each creation embodies contemporary sophistication. Blending minimalism with luxury, every piece celebrates individuality and timeless style — a reflection of beauty, confidence, and grace.";

  const Fetchcolection = async () => {
    try {
      setLoading(true);
      const loginUserDetail = JSON?.parse(sessionStorage?.getItem("loginUserDetail"));
      const storeInit = JSON?.parse(sessionStorage?.getItem("storeInit"));
      const { IsB2BWebsite } = storeInit || {};
      const visiterID = Cookies.get("visiterId");
      let finalID;

      if (IsB2BWebsite == 0) {
        finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
      } else {
        finalID = loginUserDetail?.id || "0";
      }

      const res = await HomeCollectionPageApi(finalID);
      const list = res?.Data?.rd;
      if (list) setCollectionList(list);
    } catch (error) {
      console.log("🚀 ~ Fetchcolection ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Fetchcolection();
  }, [syncProductList.ts]);

  const getGridSize = (typeId) => {
    switch (typeId) {
      case 0:
        return 12;
      case 1:
        return 6;
      case 2:
        return 4;
      default:
        return 6;
    }
  };

  const sortedCollection = [...CollectionList].sort((a, b) => {
    const aHasImg = a.DisplayOrder && a.DisplayOrder.length > 0;
    const bHasImg = b.DisplayOrder && b.DisplayOrder.length > 0;

    if (aHasImg && !bHasImg) return -1;
    if (!aHasImg && bHasImg) return 1;
    return 0;
  });

  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (
      event?.ctrlKey || // Ctrl key
      event?.shiftKey || // Shift key
      event?.metaKey || // Meta key (Command key on macOS)
      (event?.button && event?.button === 1) // Middle mouse button
    ) {
      return;
    } else {
      event?.preventDefault();
      let finalData = {
        menuname: param?.menuname ?? "",
        FilterKey: param?.key ?? "",
        FilterVal: param?.value ?? "",
        FilterKey1: isFilterKey2Ignore === 1 ? param2?.key ?? "" : param1?.key ?? "",
        FilterVal1: isFilterKey2Ignore === 1 ? param2?.value ?? "" : param1?.value ?? "",
        FilterKey2: isFilterKey2Ignore === 1 ? "" : param2?.key ?? "",
        FilterVal2: isFilterKey2Ignore === 1 ? "" : param2?.value ?? "",
      };
      sessionStorage.setItem("menuparams", JSON.stringify(finalData));

      const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");

      const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].join(",");
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
      navigate(url);
    }
  };

  if (loading) {
    return <CollectionSkeleton />;
  }

  return (
    <Container maxWidth={false} sx={{ py: 8, px: { xs: 2, md: 8 }, backgroundColor: "#fff" }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontFamily: "'Playfair Display', serif",
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "800px",
            mx: "auto",
            color: "#777",
            lineHeight: 1.8,
            fontSize: "1rem",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Grid Section */}

      <Grid container spacing={3} alignItems="stretch">
        {sortedCollection?.map((item, index) => {
          const gridSize = getGridSize(item?.ImageTypeId);
          const hasImage = item?.imgsrc && item?.imgsrc.length > 0;
          const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
          return (
            <Grid item xs={12} md={gridSize} key={index}>
              <Box
                onClick={(e) => handelMenu({ menuname: "Collection", key: "Auto", value: "" }, { key: "collection", value: item.CollectionName }, {}, e, 0)}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  backgroundColor: hasImage ? "transparent" : bgColor,
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  },
                  borderRadius: 8,
                }}
              >
                {hasImage ? (
                  /* Image exists: No fixed height, let image dictate size */
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={item.imgsrc}
                      alt={item.CollectionName}
                      style={{
                        width: "100%",
                        height: "auto", // Natural height
                        display: "block", // Removes bottom whitespace
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {/* Overlay Title for Image */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        right: 16,

                        px: 2,
                        py: 1,

                        bgcolor: "#fff", // soft black
                        color: "rgba(0, 0, 0, 0.75)",

                        borderRadius: 5, // rounded card
                        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",

                        backdropFilter: "blur(6px)", // premium glass feel
                        width: "fit-content",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.05rem",
                          lineHeight: 1.2,
                          fontWeight: 600,
                        }}
                      >
                        {item.CollectionName}
                      </Typography>
                    </Box>

                  </Box>
                ) : (
                  /* No Image: Use Padding for height/volume */
                  <Box
                    sx={{
                      width: "100%",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 4, // Padding gives it volume
                      textAlign: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#555",
                        fontWeight: 400,
                        letterSpacing: "1px",
                      }}
                    >
                      {item.CollectionName}
                    </Typography>
                    <Typography
                      variant="button"
                      sx={{
                        mt: 2,
                        color: "#888",
                        borderBottom: "1px solid #999",
                        pb: 0.5,
                      }}
                    >
                      Explore
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default CollectionPage;
