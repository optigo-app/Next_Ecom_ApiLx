import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Select,
  MenuItem,
  Skeleton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";

import { LableField, MenuItemSx, SelectSx } from "../New/CustomField";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import CustomizerDrawer from "../Customiziation";
import ProductDetailsSection from "./ProductDetailsSection";
import { getDeliveryInfo } from "./deliveryUtils";

const MotionButton = motion(Button);
const MotionCheckbox = motion(Checkbox);

const RightSide = ({
  TitleLine,
  DesignNo,
  collection,
  description,
  singleProd,
  singleProd1,
  stockItemArr,
  metalType,
  metalColor,
  storeInit,
  diaQcCombo,
  diaList,
  selectDiaQc,
  SizeSorting,
  handleCustomChange,
  SizeCombo,
  sizeData,
  metalTypeCombo,
  metalColorCombo,
  handleMetalWiseColorImg,
  handleMetalWiseColorImgWithFlag,
  selectCsQC,
  csList,
  csQcCombo,
  loginData,
  loadingdata,
  isPriceloading,
  pdLoadImage,
  handleCart,
  addToCardFlag,
  handleWishList,
  wishListFlag,
  // Customizer drawer props
  rd1 = [],
  rd2 = [],
  defaultArticleId,
  customizationDetail,
  onCustomizerConfirm,
  rd1CartMap = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const toggleText = () => {
    setIsExpanded((prevState) => !prevState);
  };
  const getCost = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const defaultArticle =
    rd1?.find((r) => r.ArticleId === defaultArticleId) || rd1?.[0] || null;

  // Prioritize active combination details from customizationDetail state
  const activeArticle = customizationDetail || defaultArticle;

  const isLoading = isPriceloading || pdLoadImage || loadingdata;
  const isPriceLoadingState = (isPriceloading || pdLoadImage || loadingdata) && !activeArticle && !singleProd?.UnitCostWithmarkup && !singleProd?.UnitCostWithMarkUp;
  const isNetWeightLoadingState = isLoading && !activeArticle?.NetWeight && !singleProd?.NetWeight && !singleProd?.Nwt;

  // Derive default diamond quality from rd2 for the activeArticle ArticleId
  const defaultDiaStone =
    rd2?.find(
      (r) => r.ArticleId === activeArticle?.ArticleId && r.StoneTypeid === 1,
    ) || null;
  const defaultDiaQcLabel =
    activeArticle?.DiaQCLabel ||
    (defaultDiaStone
      ? `${defaultDiaStone.Quality?.toUpperCase()}-${defaultDiaStone.Color?.toUpperCase()}`
      : null);

  const decodeEntities = (html) => {
    if (typeof document === "undefined") return html || "";
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Per-article cart/wish status: check rd1CartMap first, then fall back to optimistic flags
  const activeArticleId = activeArticle?.ArticleId;
  const articleCartEntry = rd1CartMap[activeArticleId];

  // isAddedToCart: prefer rd1CartMap truth for active article, then optimistic addToCardFlag, then singleProd
  const isAddedToCart =
    articleCartEntry != null
      ? articleCartEntry.IsInCart === 1
      : addToCardFlag !== null
        ? addToCardFlag
        : singleProd?.IsInCart === 1;

  // wishlist checked: prefer rd1CartMap truth for active article, then optimistic wishListFlag, then singleProd
  const isInWishlist =
    articleCartEntry != null
      ? articleCartEntry.IsInWish === 1
      : wishListFlag !== null
        ? wishListFlag
        : singleProd?.IsInWish === 1;

  const CurrencyCode = loginData?.loginData ?? storeInit?.CurrencyCode;

  const priceBreakupItems = [
    {
      label: "Metal",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalMetalCost
          : singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost,
      ),
    },
    {
      label: "Diamond",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalDiamondCost
          : singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost,
      ),
    },
    {
      label: "Stone",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalColorStoneCost
          : singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost,
      ),
    },
    {
      label: "MISC",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalMiscCost
          : singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost,
      ),
    },
    {
      label: "Labour",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalMakingCost
          : singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost,
      ),
    },
    {
      label: "Other",
      cost: activeArticle
        ? getCost(activeArticle?.TotalOtherCost) +
          getCost(activeArticle?.TotalSettingCost) +
          getCost(activeArticle?.TotalDiamondhandlingCost) +
          getCost(activeArticle?.TotalCSSettingCost) +
          getCost(activeArticle?.TotalDiaSettingCost)
        : getCost(singleProd1?.Other_Cost ?? singleProd?.Other_Cost) +
          getCost(singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) +
          getCost(
            singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount,
          ) +
          getCost(
            singleProd1?.ColorStone_SettingCost ??
              singleProd?.ColorStone_SettingCost,
          ) +
          getCost(
            singleProd1?.Diamond_SettingCost ??
              singleProd?.Diamond_SettingCost,
          ) +
          getCost(
            singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost,
          ),
    },
  ].filter((item) => isLoading || item.cost !== 0);

  return (
    <>
      <Grid
        item
        size={{
          xs: 12,
          md: 5,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 20,
            height: "fit-content",
            width: "100%",
            px: {
              xs: 1, // mobile
              sm: 2, // small screens
              md: 4, // tablets
              lg: 5, // laptops
              xl: 6, // large desktops
            },
          }}
        >
          {/* <Typography
            variant="caption"
            sx={{
              color: "#757575",
              fontSize: "13px",
              letterSpacing: "0.5px",
              display: "block",
              mb: 0.5,
              fontWeight: 500,
            }}
          >
            Collection: {collection}
          </Typography> */}
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
            {activeArticle?.ArticleNo || DesignNo}
          </Typography>

          {/* Title and Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "22px", md: "26px" },
                color: "#1a1a1a",
                lineHeight: 1.3,
              }}
            >
              {TitleLine}
            </Typography>
          </Box>

          {/* Material Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#616161",
              fontSize: "13px",
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {description?.length > 0 && (
              <>
                <div
                  className={`elv_prod_description ${isExpanded ? "show-more" : ""}`}
                >
                  <p className="description-text">{description}</p>
                  <Typography
                    className="toggle-text"
                    onClick={toggleText}
                    variant="body2"
                    sx={{
                      color: "#1976d2 !important",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </Typography>
                </div>
              </>
            )}
          </Typography>

          {/* Price */}
          {storeInit?.IsPriceShow == 1 && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "28px",
                mb: 3,
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: decodeEntities(CurrencyCode),
                }}
              />

              {isPriceLoadingState ? (
                <Skeleton
                  variant="rounded"
                  width={140}
                  height={30}
                  sx={{ display: "inline-block" }}
                />
              ) : (
                <span>
                  {formatter(
                    activeArticle?.UnitCostWithmarkup ??
                      activeArticle?.TotalUnitCost ??
                      singleProd?.UnitCostWithmarkup ??
                      singleProd?.UnitCostWithMarkUp ??
                      0,
                  )}
                </span>
              )}
            </Typography>
          )}

          <Box sx={{ mb: 3, mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* Metal Purity */}
              <Grid
                item
                size={{
                  xs: 6,
                }}
              >
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Metal Purity
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {isLoading ? (
                    <Skeleton variant="text" width={60} />
                  ) : singleProd?.IsMrpBase === 1 ? (
                    singleProd?.MetalTypePurity || "-"
                  ) : (
                    activeArticle?.MetalType || "-"
                  )}
                </Typography>
              </Grid>

              {/* Metal Color */}
              {/* Metal Color */}
              <Grid
                item
                size={{
                  xs: 6,
                }}
              >
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Metal Color
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                  {isLoading ? (
                    <Skeleton variant="text" width={60} />
                  ) : (
                    activeArticle?.MetalColor || "-"
                  )}
                </Typography>
              </Grid>

              {/* Diamond QC — article based from rd2 */}
              {(isLoading || defaultDiaStone) && (
                <Grid
                  item
                  size={{
                    xs: 6,
                  }}
                >
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    Diamond Quality
                  </Typography>

                  <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                    {isLoading ? (
                      <Skeleton variant="text" width={80} />
                    ) : (
                      defaultDiaQcLabel || "-"
                    )}
                  </Typography>
                </Grid>
              )}

              {/* Diamond Origin */}
              {(isLoading || defaultDiaStone) && (
                <Grid
                  item
                  size={{
                    xs: 6,
                  }}
                >
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    Diamond Origin
                  </Typography>
                  <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                    {isLoading ? (
                      <Skeleton variant="text" width={80} />
                    ) : defaultDiaStone?.MaterialTypeName &&
                      defaultDiaStone.MaterialTypeName.trim() !== "" ? (
                      defaultDiaStone.MaterialTypeName
                    ) : (
                      "Natural"
                    )}
                  </Typography>
                </Grid>
              )}

              {/* Net Weight */}
              {storeInit?.IsMetalWeight === 1 && (
                <Grid
                  item
                  size={{
                    xs: 6,
                  }}
                >
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    Net Wt
                  </Typography>

                  <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                    {isNetWeightLoadingState ? (
                      <Skeleton variant="text" width={50} />
                    ) : activeArticle?.NetWeight != null ? (
                      Number(activeArticle.NetWeight).toFixed(3)
                    ) : singleProd1?.NetWeight != null ||
                      singleProd?.NetWeight != null ||
                      singleProd?.Nwt != null ? (
                      (
                        singleProd1?.NetWeight ??
                        singleProd?.NetWeight ??
                        singleProd?.Nwt
                      )?.toFixed(3)
                    ) : (
                      "-"
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
          {/* Size Selector */}
          {/* {SizeSorting?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#424242",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Size
                </Typography>
              </Box>

              {singleProd?.IsMrpBase === 1 ? (
                <Box
                  sx={{
                    px: 1,
                    py: 0.8,
                    borderRadius: "10px",
                    bgcolor: "#f3f3f3",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "inline-block",
                    textTransform: "uppercase",
                  }}
                >
                  {singleProd?.DefaultSize || "-"}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {SizeSorting?.map((ele) => (
                    <Box
                      key={ele?.id}
                      onClick={() =>
                        handleCustomChange(
                          { target: { value: ele?.sizename } },
                          "size",
                        )
                      }
                      sx={{
                        minWidth: 45,
                        px: 2,
                        py: 1,
                        borderRadius: 1.5,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "0.2s",
                        fontSize: "13px",
                        fontWeight: 600,

                        bgcolor: sizeData === ele?.sizename ? "#000" : "#fff",
                        color: sizeData === ele?.sizename ? "#fff" : "#000",
                        border:
                          sizeData === ele?.sizename
                            ? "2px solid #000"
                            : "1px solid #ccc",

                        "&:hover": {
                          border: "2px solid #000",
                        },
                      }}
                    >
                      {ele?.sizename || "-"}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )} */}

          {/* Material Customization */}
          {/* <Divider sx={{ mb: 2 }} /> */}
          {/* {storeInit?.IsProductWebCustomization == 1 && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Grid container spacing={2}> */}
          {/* ===================== METAL TYPE ===================== */}
          {/* {metalTypeCombo?.length > 0 &&
                  storeInit?.IsMetalCustomization === 1 && (
                    <Grid
                      item
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
                      >
                        Metal Type :
                      </Typography>

                      {singleProd?.IsMrpBase == 1 ? (
                        <LableField
                          label={
                            metalTypeCombo?.find(
                              (ele) =>
                                ele?.Metalid == singleProd?.MetalPurityid,
                            )?.metaltype
                          }
                        />
                      ) : (
                        <Select
                          fullWidth
                          value={metalType || ""}
                          onChange={(e) => handleCustomChange(e, "mt")}
                          displayEmpty
                          renderValue={(selected) =>
                            selected || metalTypeCombo?.[0]?.metaltype
                          }
                          {...SelectSx}
                        >
                          {metalTypeCombo.map((ele) => (
                            <MenuItem
                              key={ele.Metalid}
                              value={ele.metaltype}
                              sx={MenuItemSx}
                            >
                              {ele.metaltype}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Grid>
                  )} */}

          {/* ===================== METAL COLOR ===================== */}
          {/* {metalColorCombo?.length > 0 &&
                  storeInit?.IsMetalTypeWithColor === 1 && (
                    <Grid
                      item
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
                      >
                        Metal Color :
                      </Typography>

                      {singleProd?.IsMrpBase == 1 ? (
                        <LableField
                          label={
                            metalColorCombo?.find(
                              (ele) => ele?.id == singleProd?.MetalColorid,
                            )?.metalcolorname
                          }
                        />
                      ) : (
                        <Select
                          {...SelectSx}
                          fullWidth
                          value={metalColor || ""}
                          onChange={(e) =>
                            storeInit?.IsColorWiseImages === 1
                              ? handleMetalWiseColorImg(e)
                              : handleMetalWiseColorImgWithFlag(e)
                          }
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected)
                              return metalColorCombo?.[0]?.metalcolorname;
                            return (
                              metalColorCombo?.find(
                                (x) => x.colorcode === selected,
                              )?.metalcolorname || ""
                            );
                          }}
                        >
                          {metalColorCombo?.map((ele) => (
                            <MenuItem
                              sx={MenuItemSx}
                              key={ele.id}
                              value={ele.colorcode}
                            >
                              {ele.metalcolorname}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Grid>
                  )} */}

          {/* ===================== DIAMOND ===================== */}
          {/* {storeInit?.IsDiamondCustomization === 1 &&
                  diaQcCombo?.length > 0 &&
                  diaList?.length > 0 && (
                    <Grid
                      item
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
                      >
                        Diamond :
                      </Typography>

                      {singleProd?.IsMrpBase == 1 ? (
                        <LableField label={singleProd?.DiaQuaCol} />
                      ) : (
                        <Select
                          fullWidth
                          value={selectDiaQc || ""}
                          onChange={(e) => handleCustomChange(e, "dt")}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              const d = diaQcCombo?.[0];
                              return `${d?.Quality},${d?.color}`;
                            }
                            return selected;
                          }}
                          {...SelectSx}
                        >
                          {diaQcCombo?.map((ele) => (
                            <MenuItem
                              sx={MenuItemSx}
                              key={ele.QualityId}
                              value={`${ele.Quality},${ele.color}`}
                            >
                              {`${ele.Quality},${ele.color}`}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Grid>
                  )} */}

          {/* ===================== COLOR STONE ===================== */}
          {/* {storeInit?.IsCsCustomization === 1 &&
                  selectCsQC?.length > 0 &&
                  csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
                    <Grid
                      item
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
                      >
                        Color Stone :
                      </Typography>

                      {singleProd?.IsMrpBase == 1 ? (
                        <LableField label={singleProd?.CsQuaCol} />
                      ) : (
                        <Select
                          fullWidth
                          value={selectCsQC || ""}
                          onChange={(e) => handleCustomChange(e, "cs")}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              const cs = csQcCombo?.[0];
                              return `${cs?.Quality},${cs?.color}`;
                            }
                            return selected;
                          }}
                          {...SelectSx}
                        >
                          {csQcCombo?.map((ele) => (
                            <MenuItem
                              sx={MenuItemSx}
                              key={ele.QualityId}
                              value={`${ele.Quality},${ele.color}`}
                            >
                              {`${ele.Quality}#${ele.color}`}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Grid>
                  )} */}

          {/* ===================== SIZE =====================
                                {SizeSorting?.length > 0 && (
                                    <Grid item size={{
                                    xs={12} sm={6}}>
                                        <Typography sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}>
                                            Size :
                                        </Typography>

                                        {singleProd?.IsMrpBase == 1 ? (
                                            <LableField label={singleProd?.DefaultSize} />
                                        ) : (
                                            <Select
                                                fullWidth
                                                value={sizeData || ""}
                                                onChange={(e) => handleCustomChange(e, "size")}
                                                displayEmpty
                                                renderValue={(selected) => selected || SizeCombo?.rd?.[0]?.sizename}
                                                {...SelectSx}
                                            >
                                                {SizeCombo?.rd?.map(ele => (
                                                    <MenuItem sx={MenuItemSx} key={ele.id} value={ele.sizename}>
                                                        {ele.sizename}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </Grid>
                                )} */}
          {/* </Grid>
            </Box>
          )} */}
          {storeInit?.IsProductWebCustomization === 1 && (
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
                  letterSpacing: "0.5px",
                  textTransform: "none",
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

          <CustomizerDrawer
            open={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
            rd1={rd1}
            rd2={rd2}
            defaultArticleId={defaultArticleId}
            onConfirm={onCustomizerConfirm}
            storeInit={storeInit}
            loginData={loginData}
          />

          {/* Action Buttons & Product Info Section */}
          {loadingdata || isPriceloading ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                mb: 3,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="50%"
                height={50}
                sx={{
                  borderRadius: "2px",
                }}
              />
              <Skeleton
                variant="rectangular"
                width="50%"
                height={50}
                sx={{
                  borderRadius: "2px",
                }}
              />
            </Box>
          ) : (
            <Box sx={{ mt: 3, mb: 3 }}>
              {/* Action Buttons Row */}
              <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                {/* ADD / REMOVE TO CART */}
                <MotionButton
                  fullWidth
                  variant="outlined"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCart(!isAddedToCart)}
                  sx={{
                    height: 48,
                    borderRadius: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "none",
                    backgroundColor: isAddedToCart ? "#000000" : "#ffffff",
                    color: isAddedToCart ? "#ffffff" : "#000000",
                    border: "1px solid #000000",
                    boxShadow: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isAddedToCart ? "#222222" : "#f5f5f5",
                      borderColor: "#000000",
                    },
                  }}
                >
                  {isAddedToCart ? "Remove from cart" : "Add to cart"}
                </MotionButton>

                {/* ADD / REMOVE WISHLIST */}
                <MotionButton
                  fullWidth
                  variant="contained"
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    const fakeEvent = {
                      ...e,
                      target: {
                        ...(e?.target || {}),
                        checked: !isInWishlist,
                      },
                    };
                    handleWishList(fakeEvent, singleProd);
                  }}
                  startIcon={
                    isInWishlist ? (
                      <FavoriteIcon
                        sx={{
                          fontSize: "20px !important",
                          color: "#e11d48 !important",
                        }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{
                          fontSize: "20px !important",
                          color: "#ffffff !important",
                        }}
                      />
                    )
                  }
                  sx={{
                    height: 48,
                    borderRadius: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "none",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "1px solid #000000",
                    boxShadow: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#222222",
                      borderColor: "#222222",
                    },
                  }}
                >
                  {isInWishlist ? "In Wishlist" : "Add to wishlist"}
                </MotionButton>
              </Box>

              {/* Stock & Delivery Info Notice Box */}
              {(() => {
                const deliveryInfo = getDeliveryInfo(
                  singleProd,
                  singleProd1,
                  stockItemArr
                );
                return (
                  <Box
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "2px",
                      p: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#555555",
                        lineHeight: 1.65,
                      }}
                    >
                      {deliveryInfo.isInStock ? (
                        <>
                          This piece is in stock and will be delivered between{" "}
                          <strong style={{ color: "#111111", fontWeight: 700 }}>
                            {deliveryInfo.dateRangeStr}
                          </strong>
                          . Crafted in limited quantities to reduce waste and ensure
                          exceptional quality.
                        </>
                      ) : (
                        <>
                          This piece is made to order and will be delivered in 15 days (by{" "}
                          <strong style={{ color: "#111111", fontWeight: 700 }}>
                            {deliveryInfo.dateRangeStr}
                          </strong>
                          ). Crafted in limited quantities to reduce waste and ensure
                          exceptional quality.
                        </>
                      )}
                    </Typography>
                  </Box>
                );
              })()}

              {/* Trust Feature Badges List */}
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
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
                {/* Tab Header Bar */}
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
                    onClick={() => setActiveTab("details")}
                    sx={{
                      py: 1.2,
                      px: 1,
                      borderRadius: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      backgroundColor:
                        activeTab === "details" ? "#000000" : "transparent",
                      color: activeTab === "details" ? "#ffffff" : "#000000",
                      "&:hover": {
                        backgroundColor:
                          activeTab === "details" ? "#000000" : "#e0e0e0",
                      },
                    }}
                  >
                    PRODUCT DETAILS
                  </Button>
                  <Button
                    disableRipple
                    onClick={() => setActiveTab("care")}
                    sx={{
                      py: 1.2,
                      px: 1,
                      borderRadius: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      borderLeft: "1px solid #E5E5E5",
                      borderRight: "1px solid #E5E5E5",
                      backgroundColor:
                        activeTab === "care" ? "#000000" : "transparent",
                      color: activeTab === "care" ? "#ffffff" : "#000000",
                      "&:hover": {
                        backgroundColor:
                          activeTab === "care" ? "#000000" : "#e0e0e0",
                      },
                    }}
                  >
                    PRODUCT CARE
                  </Button>
                  <Button
                    disableRipple
                    onClick={() => setActiveTab("pricebreakup")}
                    sx={{
                      py: 1.2,
                      px: 1,
                      borderRadius: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      backgroundColor:
                        activeTab === "pricebreakup" || activeTab === "shipping"
                          ? "#000000"
                          : "transparent",
                      color:
                        activeTab === "pricebreakup" || activeTab === "shipping"
                          ? "#ffffff"
                          : "#000000",
                      "&:hover": {
                        backgroundColor:
                          activeTab === "pricebreakup" || activeTab === "shipping"
                            ? "#000000"
                            : "#e0e0e0",
                      },
                    }}
                  >
                    PRICE BREAKUP
                  </Button>
                </Box>

                {/* Tab Content Box */}
                <Box sx={{ p: 2.5, backgroundColor: "#ffffff" }}>
                  {activeTab === "details" && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1.5,
                          fontSize: "13px",
                          color: "#666666",
                        }}
                      >
                        <span>
                          SKU : {activeArticle?.ArticleNo || DesignNo || "-"}
                        </span>
                        <span style={{ color: "#CCCCCC" }}>|</span>
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 700,
                            textDecoration: "underline",
                            fontSize: "13px",
                            color: "#111111",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {TitleLine || activeArticle?.ArticleNo || "ROPE CHIC"}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555555",
                          fontSize: "13px",
                          lineHeight: 1.6,
                        }}
                      >
                        {description ||
                          "This charming pendant necklace features a gold heart with a delicately suspended silver heart at its center. The playful twist detail and infinity charm on the chain symbolise eternal love and connection. A heartfelt piece perfect for gifting or personal keepsake."}
                      </Typography>
                    </Box>
                  )}

                  {activeTab === "care" && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 3,
                        py: 2,
                        px: 1,
                      }}
                    >
                      {/* 1. Clean Using A Dry Soft Cloth */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 10l-4-4a2 2 0 0 0-2.83 0L4 13.17a2 2 0 0 0 0 2.83l2 2a2 2 0 0 0 2.83 0L16 11" />
                            <path d="M13 5l2-2" />
                            <path d="M19 11l2-2" />
                            <path d="M11 17l4 4" />
                            <path d="M14 3l1 1" />
                          </svg>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#555555",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          Clean Using A Dry Soft Cloth
                        </Typography>
                      </Box>

                      {/* 2. Remove Before Entering Water */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4v7a4 4 0 0 0 4 4h3v5" />
                            <path d="M11 11a3 3 0 0 1 6 0z" />
                            <line x1="12" y1="15" x2="11.5" y2="18" />
                            <line x1="14" y1="15" x2="14" y2="19" />
                            <line x1="16" y1="15" x2="16.5" y2="18" />
                          </svg>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#555555",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          Remove Before Entering Water
                        </Typography>
                      </Box>

                      {/* 3. Store In An Airtight Plastic Pouches */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="6" width="18" height="13" rx="2" />
                            <path d="M3 10h18" />
                            <circle cx="12" cy="13" r="1.5" />
                          </svg>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#555555",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          Store In An Airtight Plastic Pouches
                        </Typography>
                      </Box>

                      {/* 4. Avoid Contact With Perfumes & Chemicals */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="6" y="10" width="12" height="11" rx="2" />
                            <path d="M10 10V7h4v3" />
                            <path d="M12 7V4" />
                            <line x1="15" y1="3" x2="20" y2="1" />
                            <line x1="15" y1="5" x2="21" y2="5" />
                            <line x1="15" y1="7" x2="20" y2="9" />
                          </svg>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#555555",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          Avoid Contact With Perfumes & Chemicals
                        </Typography>
                      </Box>

                      {/* 5. Remove When Sleeping */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 4v16" />
                            <path d="M2 12h20v8" />
                            <path d="M22 10v10" />
                            <circle cx="7" cy="9" r="2" />
                            <path d="M15 3h4l-4 4h4" />
                            <path d="M12 7h2.5l-2.5 2.5h2.5" />
                          </svg>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#555555",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          Remove When Sleeping
                        </Typography>
                      </Box>

                      {/* 6. Wear Regularly */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M8 3a4 4 0 0 0 8 0" />
                            <path d="M6 3c0 6 3 11 6 11s6-5 6-11" />
                            <path d="M5 21h14" />
                            <path d="M9 18h6" />
                            <path d="M12 14v4" />
                            <circle cx="12" cy="8" r="1" />
                          </svg>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#555555",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          Wear Regularly
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {(activeTab === "shipping" || activeTab === "pricebreakup") && (
                    <Box>
                      {storeInit?.IsPriceShow == 1 &&
                        storeInit?.IsPriceBreakUp == 1 &&
                        (activeArticle
                          ? activeArticle?.IsMrpBase != 1
                          : (singleProd ?? singleProd1)?.IsMrpBase != 1) &&
                        priceBreakupItems.length > 0 && (
                          <TableContainer
                            sx={{
                              border: "1px solid #E5E5E5",
                              borderRadius: 0,
                              overflow: "hidden",
                              bgcolor: "#FFFFFF",
                            }}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                                  <TableCell
                                    sx={{
                                      fontWeight: 700,
                                      color: "#666666",
                                      fontSize: "11px",
                                      py: 1,
                                      px: 2,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Component
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#666666",
                                      fontSize: "11px",
                                      py: 1,
                                      px: 2,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Amount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {priceBreakupItems.map((item, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      "&:hover": { bgcolor: "#FAF9F6" },
                                      "&:last-child td": { borderBottom: 0 },
                                    }}
                                  >
                                    <TableCell
                                      sx={{
                                        color: "#333333",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        py: 1.2,
                                        px: 2,
                                      }}
                                    >
                                      {item.label}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        color: "#111111",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        py: 1.2,
                                        px: 2,
                                      }}
                                    >
                                      {isLoading ? (
                                        <Skeleton
                                          variant="rounded"
                                          width={80}
                                          height={18}
                                          sx={{ ml: "auto" }}
                                        />
                                      ) : (
                                        <>
                                          <span className="elv_currencyFont">
                                            {loginData?.CurrencyCode ??
                                              storeInit?.CurrencyCode}
                                          </span>{" "}
                                          {formatter(item.cost.toFixed(2))}
                                        </>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 4,
                }}
              >
                <ProductDetailsSection
                  diaList={diaList}
                  csList={csList}
                  rd1={rd1}
                  rd2={rd2}
                  defaultArticleId={defaultArticleId}
                  customizationDetail={customizationDetail}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default RightSide;

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Divider,
//   Select,
//   MenuItem,
//   Skeleton,
//   Checkbox,
// } from "@mui/material";

// import { LableField, MenuItemSx, SelectSx } from "../New/CustomField";
// import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { motion } from "framer-motion";
// import { getSession } from "@/app/(core)/utils/FetchSessionData";
// import CustomizerDrawer from "../Customiziation";

// const MotionButton = motion(Button);
// const MotionCheckbox = motion(Checkbox);

// const RightSide = ({
//   TitleLine,
//   DesignNo,
//   collection,
//   description,
//   singleProd,
//   singleProd1,
//   metalType,
//   metalColor,
//   storeInit,
//   diaQcCombo,
//   diaList,
//   selectDiaQc,
//   SizeSorting,
//   handleCustomChange,
//   SizeCombo,
//   sizeData,
//   metalTypeCombo,
//   metalColorCombo,
//   handleMetalWiseColorImg,
//   handleMetalWiseColorImgWithFlag,
//   selectCsQC,
//   csList,
//   csQcCombo,
//   loginData,
//   loadingdata,
//   isPriceloading,
//   pdLoadImage,
//   handleCart,
//   addToCardFlag,
//   handleWishList,
//   wishListFlag,
//   // Customizer drawer props
//   rd1 = [],
//   rd2 = [],
//   defaultArticleId,
//   customizationDetail,
//   onCustomizerConfirm,
//   rd1CartMap = {},
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

//   const toggleText = () => {
//     setIsExpanded((prevState) => !prevState);
//   };
//   const getCost = (val) => {
//     const num = parseFloat(val);
//     return isNaN(num) ? 0 : num;
//   };
//   const isLoading = isPriceloading || pdLoadImage || loadingdata;

//   // Derive article-specific metal info from rd1 using defaultArticleId
//   const defaultArticle =
//     rd1?.find((r) => r.ArticleId === defaultArticleId) || rd1?.[0] || null;

//   // Prioritize active combination details from customizationDetail state
//   const activeArticle = customizationDetail || defaultArticle;

//   // Derive default diamond quality from rd2 for the activeArticle ArticleId
//   const defaultDiaStone =
//     rd2?.find(
//       (r) => r.ArticleId === activeArticle?.ArticleId && r.StoneTypeid === 1,
//     ) || null;
//   const defaultDiaQcLabel =
//     activeArticle?.DiaQCLabel ||
//     (defaultDiaStone
//       ? `${defaultDiaStone.Quality?.toUpperCase()}-${defaultDiaStone.Color?.toUpperCase()}`
//       : null);

//   const decodeEntities = (html) => {
//     var txt = document.createElement("textarea");
//     txt.innerHTML = html;
//     return txt.value;
//   };

//   // Per-article cart/wish status: check rd1CartMap first, then fall back to optimistic flags
//   const activeArticleId = activeArticle?.ArticleId;
//   const articleCartEntry = rd1CartMap[activeArticleId];

//   // isAddedToCart: prefer rd1CartMap truth, then optimistic addToCardFlag, then singleProd initial state
//   const isAddedToCart =
//     addToCardFlag !== null
//       ? addToCardFlag
//       : articleCartEntry != null
//         ? articleCartEntry.IsInCart === 1
//         : singleProd?.IsInCart === 1;

//   // wishlist checked: prefer rd1CartMap truth, then optimistic wishListFlag, then singleProd
//   const isInWishlist =
//     wishListFlag !== null
//       ? wishListFlag
//       : articleCartEntry != null
//         ? articleCartEntry.IsInWish === 1
//         : singleProd?.IsInWish === 1;

//   const CurrencyCode = loginData?.loginData ?? storeInit?.CurrencyCode;

//   return (
//     <>
//       <Grid
//         item
//         size={{
//           xs: 12,
//           md: 5,
//         }}
//       >
//         <Box
//           sx={{
//             position: "sticky",
//             top: 150,
//             height: "fit-content",
//             width: "100%",
//             px: {
//               xs: 1, // mobile
//               sm: 2, // small screens
//               md: 4, // tablets
//               lg: 5, // laptops
//               xl: 6, // large desktops
//             },
//           }}
//         >
//           {/* <Typography
//             variant="caption"
//             sx={{
//               color: "#757575",
//               fontSize: "13px",
//               letterSpacing: "0.5px",
//               display: "block",
//               mb: 0.5,
//               fontWeight: 500,
//             }}
//           >
//             Collection: {collection}
//           </Typography> */}
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#424242",
//               fontSize: "16px",
//               fontWeight: 600,
//               letterSpacing: "1.5px",
//               mb: 0.5,
//             }}
//           >
//             {activeArticle?.ArticleNo || DesignNo}
//           </Typography>

//           {/* Title and Actions */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//               mb: 1,
//             }}
//           >
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 600,
//                 fontSize: { xs: "22px", md: "26px" },
//                 color: "#1a1a1a",
//                 lineHeight: 1.3,
//               }}
//             >
//               {TitleLine}
//             </Typography>
//           </Box>

//           {/* Material Description */}
//           <Typography
//             variant="body2"
//             sx={{
//               color: "#616161",
//               fontSize: "13px",
//               mb: 2,
//               lineHeight: 1.5,
//             }}
//           >
//             {description?.length > 0 && (
//               <>
//                 <div
//                   className={`elv_prod_description ${isExpanded ? "show-more" : ""}`}
//                 >
//                   <p className="description-text">{description}</p>
//                   <Typography
//                     className="toggle-text"
//                     onClick={toggleText}
//                     variant="body2"
//                     sx={{
//                       color: "#1976d2 !important",
//                       fontSize: "13px",
//                       cursor: "pointer",
//                       fontWeight: 500,
//                       "&:hover": {
//                         textDecoration: "underline",
//                       },
//                     }}
//                   >
//                     {isExpanded ? "Show Less" : "Show More"}
//                   </Typography>
//                 </div>
//               </>
//             )}
//           </Typography>

//           {/* Price */}
//           {storeInit?.IsPriceShow == 1 && (
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: 700,
//                 fontSize: "28px",
//                 mb: 3,
//                 color: "#1a1a1a",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//               }}
//             >
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: decodeEntities(CurrencyCode),
//                 }}
//               />

//               {isPriceloading || pdLoadImage || loadingdata ? (
//                 <Skeleton
//                   variant="rounded"
//                   width={140}
//                   height={30}
//                   sx={{ display: "inline-block" }}
//                 />
//               ) : (
//                 <span>
//                   {formatter(
//                     activeArticle?.UnitCostWithmarkup ??
//                       activeArticle?.TotalUnitCost ??
//                       0,
//                   )}
//                 </span>
//               )}
//             </Typography>
//           )}

//           <Box sx={{ mb: 3, mt: 2 }}>
//             <Divider sx={{ mb: 2 }} />
//             <Grid container spacing={2}>
//               {/* Metal Purity */}
//               <Grid
//                 item
//                 size={{
//                   xs: 6,
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px", color: "#666" }}>
//                   Metal Purity
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontSize: "15px",
//                     fontWeight: 600,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   {isLoading ? (
//                     <Skeleton variant="text" width={60} />
//                   ) : singleProd?.IsMrpBase === 1 ? (
//                     singleProd?.MetalTypePurity || "-"
//                   ) : (
//                     activeArticle?.MetalType || "-"
//                   )}
//                 </Typography>
//               </Grid>

//               {/* Metal Color */}
//               {/* Metal Color */}
//               <Grid
//                 item
//                 size={{
//                   xs: 6,
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px", color: "#666" }}>
//                   Metal Color
//                 </Typography>
//                 <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
//                   {isLoading ? (
//                     <Skeleton variant="text" width={60} />
//                   ) : (
//                     activeArticle?.MetalColor || "-"
//                   )}
//                 </Typography>
//               </Grid>

//               {/* Diamond QC — article based from rd2 */}
//               {(isLoading || defaultDiaStone) && (
//                 <Grid
//                   item
//                   size={{
//                     xs: 6,
//                   }}
//                 >
//                   <Typography sx={{ fontSize: "14px", color: "#666" }}>
//                     Diamond Quality
//                   </Typography>

//                   <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
//                     {isLoading ? (
//                       <Skeleton variant="text" width={80} />
//                     ) : (
//                       defaultDiaQcLabel || "-"
//                     )}
//                   </Typography>
//                 </Grid>
//               )}

//               {/* Diamond Origin */}
//               {(isLoading || defaultDiaStone) && (
//                 <Grid
//                   item
//                   size={{
//                     xs: 6,
//                   }}
//                 >
//                   <Typography sx={{ fontSize: "14px", color: "#666" }}>
//                     Diamond Origin
//                   </Typography>
//                   <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
//                     {isLoading ? (
//                       <Skeleton variant="text" width={80} />
//                     ) : defaultDiaStone?.MaterialTypeName &&
//                       defaultDiaStone.MaterialTypeName.trim() !== "" ? (
//                       defaultDiaStone.MaterialTypeName
//                     ) : (
//                       "Natural"
//                     )}
//                   </Typography>
//                 </Grid>
//               )}

//               {/* Net Weight */}
//               {storeInit?.IsMetalWeight === 1 && (
//                 <Grid
//                   item
//                   size={{
//                     xs: 6,
//                   }}
//                 >
//                   <Typography sx={{ fontSize: "14px", color: "#666" }}>
//                     Net Wt
//                   </Typography>

//                   <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
//                     {isLoading ? (
//                       <Skeleton variant="text" width={50} />
//                     ) : activeArticle?.NetWeight != null ? (
//                       Number(activeArticle.NetWeight).toFixed(3)
//                     ) : singleProd1?.NetWeight != null ||
//                       singleProd?.NetWeight != null ? (
//                       (
//                         singleProd1?.NetWeight ?? singleProd?.NetWeight
//                       )?.toFixed(3)
//                     ) : (
//                       "-"
//                     )}
//                   </Typography>
//                 </Grid>
//               )}
//             </Grid>
//           </Box>
//           {/* Size Selector */}
//           {/* {SizeSorting?.length > 0 && (
//             <Box sx={{ mb: 3 }}>
//               <Divider sx={{ mb: 2 }} />
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 1.5,
//                 }}
//               >
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "#424242",
//                     fontSize: "13px",
//                     fontWeight: 600,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Size
//                 </Typography>
//               </Box>

//               {singleProd?.IsMrpBase === 1 ? (
//                 <Box
//                   sx={{
//                     px: 1,
//                     py: 0.8,
//                     borderRadius: "10px",
//                     bgcolor: "#f3f3f3",
//                     fontSize: "14px",
//                     fontWeight: 600,
//                     display: "inline-block",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   {singleProd?.DefaultSize || "-"}
//                 </Box>
//               ) : (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: 1,
//                   }}
//                 >
//                   {SizeSorting?.map((ele) => (
//                     <Box
//                       key={ele?.id}
//                       onClick={() =>
//                         handleCustomChange(
//                           { target: { value: ele?.sizename } },
//                           "size",
//                         )
//                       }
//                       sx={{
//                         minWidth: 45,
//                         px: 2,
//                         py: 1,
//                         borderRadius: 1.5,
//                         textAlign: "center",
//                         cursor: "pointer",
//                         transition: "0.2s",
//                         fontSize: "13px",
//                         fontWeight: 600,

//                         bgcolor: sizeData === ele?.sizename ? "#000" : "#fff",
//                         color: sizeData === ele?.sizename ? "#fff" : "#000",
//                         border:
//                           sizeData === ele?.sizename
//                             ? "2px solid #000"
//                             : "1px solid #ccc",

//                         "&:hover": {
//                           border: "2px solid #000",
//                         },
//                       }}
//                     >
//                       {ele?.sizename || "-"}
//                     </Box>
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           )} */}

//           {/* Material Customization */}
//           {/* <Divider sx={{ mb: 2 }} /> */}
//           {/* {storeInit?.IsProductWebCustomization == 1 && (
//             <Box sx={{ width: "100%", mt: 2 }}>
//               <Grid container spacing={2}> */}
//           {/* ===================== METAL TYPE ===================== */}
//           {/* {metalTypeCombo?.length > 0 &&
//                   storeInit?.IsMetalCustomization === 1 && (
//                     <Grid
//                       item
//                       size={{
//                         xs: 12,
//                         sm: 6,
//                       }}
//                     >
//                       <Typography
//                         sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
//                       >
//                         Metal Type :
//                       </Typography>

//                       {singleProd?.IsMrpBase == 1 ? (
//                         <LableField
//                           label={
//                             metalTypeCombo?.find(
//                               (ele) =>
//                                 ele?.Metalid == singleProd?.MetalPurityid,
//                             )?.metaltype
//                           }
//                         />
//                       ) : (
//                         <Select
//                           fullWidth
//                           value={metalType || ""}
//                           onChange={(e) => handleCustomChange(e, "mt")}
//                           displayEmpty
//                           renderValue={(selected) =>
//                             selected || metalTypeCombo?.[0]?.metaltype
//                           }
//                           {...SelectSx}
//                         >
//                           {metalTypeCombo.map((ele) => (
//                             <MenuItem
//                               key={ele.Metalid}
//                               value={ele.metaltype}
//                               sx={MenuItemSx}
//                             >
//                               {ele.metaltype}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       )}
//                     </Grid>
//                   )} */}

//           {/* ===================== METAL COLOR ===================== */}
//           {/* {metalColorCombo?.length > 0 &&
//                   storeInit?.IsMetalTypeWithColor === 1 && (
//                     <Grid
//                       item
//                       size={{
//                         xs: 12,
//                         sm: 6,
//                       }}
//                     >
//                       <Typography
//                         sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
//                       >
//                         Metal Color :
//                       </Typography>

//                       {singleProd?.IsMrpBase == 1 ? (
//                         <LableField
//                           label={
//                             metalColorCombo?.find(
//                               (ele) => ele?.id == singleProd?.MetalColorid,
//                             )?.metalcolorname
//                           }
//                         />
//                       ) : (
//                         <Select
//                           {...SelectSx}
//                           fullWidth
//                           value={metalColor || ""}
//                           onChange={(e) =>
//                             storeInit?.IsColorWiseImages === 1
//                               ? handleMetalWiseColorImg(e)
//                               : handleMetalWiseColorImgWithFlag(e)
//                           }
//                           displayEmpty
//                           renderValue={(selected) => {
//                             if (!selected)
//                               return metalColorCombo?.[0]?.metalcolorname;
//                             return (
//                               metalColorCombo?.find(
//                                 (x) => x.colorcode === selected,
//                               )?.metalcolorname || ""
//                             );
//                           }}
//                         >
//                           {metalColorCombo?.map((ele) => (
//                             <MenuItem
//                               sx={MenuItemSx}
//                               key={ele.id}
//                               value={ele.colorcode}
//                             >
//                               {ele.metalcolorname}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       )}
//                     </Grid>
//                   )} */}

//           {/* ===================== DIAMOND ===================== */}
//           {/* {storeInit?.IsDiamondCustomization === 1 &&
//                   diaQcCombo?.length > 0 &&
//                   diaList?.length > 0 && (
//                     <Grid
//                       item
//                       size={{
//                         xs: 12,
//                         sm: 6,
//                       }}
//                     >
//                       <Typography
//                         sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
//                       >
//                         Diamond :
//                       </Typography>

//                       {singleProd?.IsMrpBase == 1 ? (
//                         <LableField label={singleProd?.DiaQuaCol} />
//                       ) : (
//                         <Select
//                           fullWidth
//                           value={selectDiaQc || ""}
//                           onChange={(e) => handleCustomChange(e, "dt")}
//                           displayEmpty
//                           renderValue={(selected) => {
//                             if (!selected) {
//                               const d = diaQcCombo?.[0];
//                               return `${d?.Quality},${d?.color}`;
//                             }
//                             return selected;
//                           }}
//                           {...SelectSx}
//                         >
//                           {diaQcCombo?.map((ele) => (
//                             <MenuItem
//                               sx={MenuItemSx}
//                               key={ele.QualityId}
//                               value={`${ele.Quality},${ele.color}`}
//                             >
//                               {`${ele.Quality},${ele.color}`}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       )}
//                     </Grid>
//                   )} */}

//           {/* ===================== COLOR STONE ===================== */}
//           {/* {storeInit?.IsCsCustomization === 1 &&
//                   selectCsQC?.length > 0 &&
//                   csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
//                     <Grid
//                       item
//                       size={{
//                         xs: 12,
//                         sm: 6,
//                       }}
//                     >
//                       <Typography
//                         sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}
//                       >
//                         Color Stone :
//                       </Typography>

//                       {singleProd?.IsMrpBase == 1 ? (
//                         <LableField label={singleProd?.CsQuaCol} />
//                       ) : (
//                         <Select
//                           fullWidth
//                           value={selectCsQC || ""}
//                           onChange={(e) => handleCustomChange(e, "cs")}
//                           displayEmpty
//                           renderValue={(selected) => {
//                             if (!selected) {
//                               const cs = csQcCombo?.[0];
//                               return `${cs?.Quality},${cs?.color}`;
//                             }
//                             return selected;
//                           }}
//                           {...SelectSx}
//                         >
//                           {csQcCombo?.map((ele) => (
//                             <MenuItem
//                               sx={MenuItemSx}
//                               key={ele.QualityId}
//                               value={`${ele.Quality},${ele.color}`}
//                             >
//                               {`${ele.Quality}#${ele.color}`}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       )}
//                     </Grid>
//                   )} */}

//           {/* ===================== SIZE =====================
//                                 {SizeSorting?.length > 0 && (
//                                     <Grid item size={{
//                                     xs={12} sm={6}}>
//                                         <Typography sx={{ fontSize: "14px", color: "#666", mb: 0.5 }}>
//                                             Size :
//                                         </Typography>

//                                         {singleProd?.IsMrpBase == 1 ? (
//                                             <LableField label={singleProd?.DefaultSize} />
//                                         ) : (
//                                             <Select
//                                                 fullWidth
//                                                 value={sizeData || ""}
//                                                 onChange={(e) => handleCustomChange(e, "size")}
//                                                 displayEmpty
//                                                 renderValue={(selected) => selected || SizeCombo?.rd?.[0]?.sizename}
//                                                 {...SelectSx}
//                                             >
//                                                 {SizeCombo?.rd?.map(ele => (
//                                                     <MenuItem sx={MenuItemSx} key={ele.id} value={ele.sizename}>
//                                                         {ele.sizename}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         )}
//                                     </Grid>
//                                 )} */}
//           {/* </Grid>
//             </Box>
//           )} */}
//           {storeInit?.IsProductWebCustomization === 1 && (
//             <Box sx={{ width: "100%", mt: 3, mb: 1 }}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => setIsCustomizerOpen(true)}
//                 sx={{
//                   height: 48,
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: 600,
//                   color: "#0B2F83",
//                   borderColor: "#0B2F83",
//                   borderWidth: "1.5px",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.05em",
//                   "&:hover": {
//                     borderColor: "#082360",
//                     backgroundColor: "#F0F4FC",
//                     borderWidth: "1.5px",
//                   },
//                 }}
//               >
//                 Customize Design
//               </Button>
//             </Box>
//           )}

//           <CustomizerDrawer
//             open={isCustomizerOpen}
//             onClose={() => setIsCustomizerOpen(false)}
//             rd1={rd1}
//             rd2={rd2}
//             defaultArticleId={defaultArticleId}
//             onConfirm={onCustomizerConfirm}
//             storeInit={storeInit}
//             loginData={loginData}
//           />

//           {/* Action Buttons */}
//           {loadingdata || isPriceloading ? (
//             // Render a Skeleton/Loader instead of the button
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 mt: 12,
//                 mb: 4,
//               }}
//             >
//               <Skeleton
//                 variant="rectangular"
//                 width="100%"
//                 height={50}
//                 sx={{
//                   borderRadius: 2,
//                 }}
//               />
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 mt: 12,
//                 mb: 4,
//               }}
//             >
//               {/* ADD / REMOVE CART */}
//               <MotionButton
//                 fullWidth
//                 variant="contained"
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => handleCart(!isAddedToCart)} // Pass the OPPOSITE of current state
//                 sx={{
//                   height: 52,
//                   borderRadius: 2,
//                   fontSize: "15px",
//                   fontWeight: 600,
//                   letterSpacing: "0.4px",
//                   textTransform: "none",
//                   // Use the helper variable
//                   backgroundColor: isAddedToCart ? "#000" : "#ffffff",
//                   color: isAddedToCart ? "#ffffff" : "#000",
//                   border: "1.5px solid #000",
//                   boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
//                   "&:hover": {
//                     backgroundColor: isAddedToCart ? "#000" : "#eef3fa",
//                   },
//                 }}
//               >
//                 {isAddedToCart ? "REMOVE FROM CART" : "ADD TO CART"}
//               </MotionButton>

//               {/* WISHLIST */}
//               <MotionCheckbox
//                 whileTap={{ scale: 0.85 }}
//                 disableRipple
//                 icon={
//                   <FavoriteBorderIcon
//                     sx={{ fontSize: 32, transition: "color 0.25s ease" }}
//                   />
//                 }
//                 checkedIcon={
//                   <FavoriteIcon
//                     sx={{
//                       fontSize: 32,
//                       color: "#927038 !important",
//                       transition: "color 0.25s ease",
//                     }}
//                   />
//                 }
//                 checked={isInWishlist}
//                 onChange={(e) => handleWishList(e, singleProd)}
//                 sx={{
//                   height: 54,
//                   width: 58,
//                   minWidth: "58px",
//                   borderRadius: 3,
//                   border: "1.5px solid #b6b6b6",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: isInWishlist ? "#fff" : "#fff",
//                   color: isInWishlist ? "#fff" : "#0A1F47",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                   transition: "0.25s ease",
//                   "&.Mui-checked": {
//                     color: "#fff",
//                     borderColor: "#927038",
//                   },

//                   // Force icon color inheritance
//                   "& .MuiSvgIcon-root": {
//                     color: isInWishlist ? "#fff" : "#0A1F47",
//                   },
//                 }}
//               />
//             </Box>
//           )}
//           <Divider sx={{ mb: 2, mt: 2 }} />
//           {storeInit?.IsPriceShow == 1 &&
//             storeInit?.IsPriceBreakUp == 1 &&
//             (singleProd ?? singleProd1)?.IsMrpBase != 1 &&
//             (isLoading ||
//               getCost(singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost) !==
//                 0 ||
//               getCost(singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost) !==
//                 0 ||
//               getCost(
//                 singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost,
//               ) !== 0 ||
//               getCost(singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost) !== 0 ||
//               getCost(singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost) !==
//                 0) && (
//               <Box>
//                 <Typography sx={{ fontSize: "14px", color: "#666", mb: 1 }}>
//                   Price Breakup :
//                 </Typography>
//                 <Box
//                   sx={{
//                     border: "1px solid #e0e0e0",
//                     borderRadius: 3,
//                     overflow: "hidden",
//                     bgcolor: "#fff",
//                     mb: 2,
//                   }}
//                 >
//                   {/* Metal */}
//                   {(isLoading ||
//                     getCost(
//                       singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost,
//                     ) !== 0) && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         borderBottom: "1px solid #e0e0e0",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: "120px",
//                           bgcolor: "#f5f5f5",
//                           p: 2,
//                           borderRight: "1px solid #e0e0e0",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: "#616161",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Metal
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, p: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: "#424242", fontSize: "13px" }}
//                         >
//                           {isLoading ? (
//                             <Skeleton
//                               variant="rounded"
//                               width={80}
//                               height={18}
//                             />
//                           ) : (
//                             <>
//                               <span className="elv_currencyFont">
//                                 {loginData?.CurrencyCode ??
//                                   storeInit?.CurrencyCode}
//                               </span>{" "}
//                               {formatter(
//                                 getCost(
//                                   singleProd1?.Metal_Cost ??
//                                     singleProd?.Metal_Cost,
//                                 ).toFixed(2),
//                               )}
//                             </>
//                           )}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}

//                   {/* Diamond */}
//                   {(isLoading ||
//                     getCost(
//                       singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost,
//                     ) !== 0) && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         borderBottom: "1px solid #e0e0e0",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: "120px",
//                           bgcolor: "#f5f5f5",
//                           p: 2,
//                           borderRight: "1px solid #e0e0e0",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: "#616161",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Diamond
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, p: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: "#424242", fontSize: "13px" }}
//                         >
//                           {isLoading ? (
//                             <Skeleton
//                               variant="rounded"
//                               width={80}
//                               height={18}
//                             />
//                           ) : (
//                             <>
//                               <span className="elv_currencyFont">
//                                 {loginData?.CurrencyCode ??
//                                   storeInit?.CurrencyCode}
//                               </span>{" "}
//                               {formatter(
//                                 getCost(
//                                   singleProd1?.Diamond_Cost ??
//                                     singleProd?.Diamond_Cost,
//                                 ).toFixed(2),
//                               )}
//                             </>
//                           )}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}

//                   {/* Stone */}
//                   {(isLoading ||
//                     getCost(
//                       singleProd1?.ColorStone_Cost ??
//                         singleProd?.ColorStone_Cost,
//                     ) !== 0) && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         borderBottom: "1px solid #e0e0e0",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: "120px",
//                           bgcolor: "#f5f5f5",
//                           p: 2,
//                           borderRight: "1px solid #e0e0e0",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: "#616161",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Stone
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, p: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: "#424242", fontSize: "13px" }}
//                         >
//                           {isLoading ? (
//                             <Skeleton
//                               variant="rounded"
//                               width={80}
//                               height={18}
//                             />
//                           ) : (
//                             <>
//                               <span className="elv_currencyFont">
//                                 {loginData?.CurrencyCode ??
//                                   storeInit?.CurrencyCode}
//                               </span>{" "}
//                               {formatter(
//                                 getCost(
//                                   singleProd1?.ColorStone_Cost ??
//                                     singleProd?.ColorStone_Cost,
//                                 ).toFixed(2),
//                               )}
//                             </>
//                           )}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}

//                   {/* MISC */}
//                   {(isLoading ||
//                     getCost(singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost) !==
//                       0) && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         borderBottom: "1px solid #e0e0e0",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: "120px",
//                           bgcolor: "#f5f5f5",
//                           p: 2,
//                           borderRight: "1px solid #e0e0e0",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: "#616161",
//                             fontSize: "13px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           MISC
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, p: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: "#424242", fontSize: "13px" }}
//                         >
//                           {isLoading ? (
//                             <Skeleton
//                               variant="rounded"
//                               width={80}
//                               height={18}
//                             />
//                           ) : (
//                             <>
//                               <span className="elv_currencyFont">
//                                 {loginData?.CurrencyCode ??
//                                   storeInit?.CurrencyCode}
//                               </span>{" "}
//                               {formatter(
//                                 getCost(
//                                   singleProd1?.Misc_Cost ??
//                                     singleProd?.Misc_Cost,
//                                 ).toFixed(2),
//                               )}
//                             </>
//                           )}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}

//                   {/* Labour */}
//                   {(isLoading ||
//                     getCost(
//                       singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost,
//                     ) !== 0) && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         borderBottom: "1px solid #e0e0e0",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: "120px",
//                           bgcolor: "#f5f5f5",
//                           p: 2,
//                           borderRight: "1px solid #e0e0e0",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             fontSize: "13px",
//                             color: "#616161",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Labour
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, p: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: "#424242", fontSize: "13px" }}
//                         >
//                           {isLoading ? (
//                             <Skeleton
//                               variant="rounded"
//                               width={80}
//                               height={18}
//                             />
//                           ) : (
//                             <>
//                               <span>
//                                 {loginData?.CurrencyCode ??
//                                   storeInit?.CurrencyCode}
//                               </span>{" "}
//                               {formatter(
//                                 getCost(
//                                   singleProd1?.Labour_Cost ??
//                                     singleProd?.Labour_Cost,
//                                 ).toFixed(2),
//                               )}
//                             </>
//                           )}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}

//                   {/* Other */}
//                   {(isLoading ||
//                     getCost(singleProd1?.Other_Cost ?? singleProd?.Other_Cost) +
//                       getCost(
//                         singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp,
//                       ) +
//                       getCost(
//                         singleProd1?.DesignMarkUpAmount ??
//                           singleProd?.DesignMarkUpAmount,
//                       ) +
//                       getCost(
//                         singleProd1?.ColorStone_SettingCost ??
//                           singleProd?.ColorStone_SettingCost,
//                       ) +
//                       getCost(
//                         singleProd1?.Diamond_SettingCost ??
//                           singleProd?.Diamond_SettingCost,
//                       ) +
//                       getCost(
//                         singleProd1?.Misc_SettingCost ??
//                           singleProd?.Misc_SettingCost,
//                       ) !==
//                       0) && (
//                     <Box sx={{ display: "flex" }}>
//                       <Box
//                         sx={{
//                           width: "120px",
//                           bgcolor: "#f5f5f5",
//                           p: 2,
//                           borderRight: "1px solid #e0e0e0",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             fontSize: "13px",
//                             color: "#616161",
//                             fontWeight: 600,
//                           }}
//                         >
//                           Other
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, p: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ color: "#424242", fontSize: "13px" }}
//                         >
//                           {isLoading ? (
//                             <Skeleton
//                               variant="rounded"
//                               width={80}
//                               height={18}
//                             />
//                           ) : (
//                             <>
//                               <span className="elv_currencyFont">
//                                 {loginData?.CurrencyCode ??
//                                   storeInit?.CurrencyCode}
//                               </span>{" "}
//                               {formatter(
//                                 (
//                                   getCost(
//                                     singleProd1?.Other_Cost ??
//                                       singleProd?.Other_Cost,
//                                   ) +
//                                   getCost(
//                                     singleProd1?.Size_MarkUp ??
//                                       singleProd?.Size_MarkUp,
//                                   ) +
//                                   getCost(
//                                     singleProd1?.DesignMarkUpAmount ??
//                                       singleProd?.DesignMarkUpAmount,
//                                   ) +
//                                   getCost(
//                                     singleProd1?.ColorStone_SettingCost ??
//                                       singleProd?.ColorStone_SettingCost,
//                                   ) +
//                                   getCost(
//                                     singleProd1?.Diamond_SettingCost ??
//                                       singleProd?.Diamond_SettingCost,
//                                   ) +
//                                   getCost(
//                                     singleProd1?.Misc_SettingCost ??
//                                       singleProd?.Misc_SettingCost,
//                                   )
//                                 ).toFixed(2),
//                               )}
//                             </>
//                           )}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             )}
//         </Box>
//       </Grid>
//     </>
//   );
// };

// export default RightSide;
