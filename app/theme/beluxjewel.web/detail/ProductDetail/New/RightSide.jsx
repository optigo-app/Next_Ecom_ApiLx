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
} from "@mui/material";

import { LableField, MenuItemSx, SelectSx } from "../New/CustomField";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import CustomizerDrawer from "../Customiziation";

const MotionButton = motion(Button);
const MotionCheckbox = motion(Checkbox);

const RightSide = ({
  TitleLine,
  DesignNo,
  collection,
  description,
  singleProd,
  singleProd1,
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const toggleText = () => {
    setIsExpanded((prevState) => !prevState);
  };
  const getCost = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };
  const isLoading = isPriceloading || pdLoadImage || loadingdata;

  // Derive article-specific metal info from rd1 using defaultArticleId
  const defaultArticle =
    rd1?.find((r) => r.ArticleId === defaultArticleId) || rd1?.[0] || null;

  // Prioritize active combination details from customizationDetail state
  const activeArticle = customizationDetail || defaultArticle;

  // Derive default diamond quality from rd2 for the activeArticle ArticleId
  const defaultDiaStone =
    rd2?.find(
      (r) =>
        r.ArticleId === activeArticle?.ArticleId &&
        r.StoneTypeid !== 4 &&
        r.StoneTypeid !== 5,
    ) || null;
  const defaultDiaQcLabel =
    activeArticle?.DiaQCLabel ||
    (defaultDiaStone
      ? `${defaultDiaStone.Quality?.toUpperCase()}-${defaultDiaStone.Color?.toUpperCase()}`
      : null);

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const isAddedToCart =
    addToCardFlag !== null ? addToCardFlag : singleProd?.IsInCart === 1;
  const CurrencyCode = loginData?.loginData ?? storeInit?.CurrencyCode;

  return (
    <>
      <Grid
        item
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 100,
            height: "fit-content",
            width: "100%",
            px: {
              xs: 1, // mobile
              sm: 2, // small screens
              md: 4, // tablets
              lg: 8, // laptops
              xl: 15, // large desktops
            },
          }}
        >
          <Typography
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
          </Typography>
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

              {isPriceloading || pdLoadImage || loadingdata ? (
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
              {(isLoading || defaultDiaQcLabel) && (
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
                    {isLoading ? (
                      <Skeleton variant="text" width={50} />
                    ) : activeArticle?.NetWeight != null ? (
                      Number(activeArticle.NetWeight).toFixed(3)
                    ) : singleProd1?.NetWeight != null ||
                      singleProd?.NetWeight != null ? (
                      (
                        singleProd1?.NetWeight ?? singleProd?.NetWeight
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
          {SizeSorting?.length > 0 && (
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

              {/* Size Pills */}
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

                        // SELECTED STYLE (BLACK BUTTON + WHITE TEXT)
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
          )}

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
            <Box sx={{ width: "100%", mt: 3, mb: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsCustomizerOpen(true)}
                sx={{
                  height: 48,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
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

          {/* Action Buttons */}
          {loadingdata || isPriceloading ? (
            // Render a Skeleton/Loader instead of the button
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 12,
                mb: 4,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={50}
                sx={{
                  borderRadius: 2,
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 12,
                mb: 4,
              }}
            >
              {/* ADD / REMOVE CART */}
              <MotionButton
                fullWidth
                variant="contained"
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCart(!isAddedToCart)} // Pass the OPPOSITE of current state
                sx={{
                  height: 52,
                  borderRadius: 2,
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "0.4px",
                  textTransform: "none",
                  // Use the helper variable
                  backgroundColor: isAddedToCart ? "#000" : "#ffffff",
                  color: isAddedToCart ? "#ffffff" : "#000",
                  border: "1.5px solid #000",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                  "&:hover": {
                    backgroundColor: isAddedToCart ? "#000" : "#eef3fa",
                  },
                }}
              >
                {isAddedToCart ? "REMOVE FROM CART" : "ADD TO CART"}
              </MotionButton>

              {/* WISHLIST */}
              <MotionCheckbox
                whileTap={{ scale: 0.85 }}
                disableRipple
                icon={
                  <FavoriteBorderIcon
                    sx={{ fontSize: 32, transition: "color 0.25s ease" }}
                  />
                }
                checkedIcon={
                  <FavoriteIcon
                    sx={{
                      fontSize: 32,
                      color: "#927038 !important",
                      transition: "color 0.25s ease",
                    }}
                  />
                }
                checked={wishListFlag ?? singleProd?.IsInWish == 1}
                onChange={(e) => handleWishList(e, singleProd)}
                sx={{
                  height: 54,
                  width: 58,
                  minWidth: "58px",
                  borderRadius: 3,
                  border: "1.5px solid #b6b6b6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    (wishListFlag ?? singleProd?.IsInWish == 1)
                      ? "#fff"
                      : "#fff",
                  color:
                    (wishListFlag ?? singleProd?.IsInWish == 1)
                      ? "#fff"
                      : "#0A1F47",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "0.25s ease",
                  "&.Mui-checked": {
                    // backgroundColor: "#b3905c",
                    color: "#fff",
                    borderColor: "#927038",
                  },

                  // Force icon color inheritance
                  "& .MuiSvgIcon-root": {
                    color:
                      (wishListFlag ?? singleProd?.IsInWish == 1)
                        ? "#fff"
                        : "#0A1F47",
                  },
                }}
              />
            </Box>
          )}
          <Divider sx={{ mb: 2, mt: 2 }} />
          {storeInit?.IsPriceShow == 1 &&
            storeInit?.IsPriceBreakUp == 1 &&
            (singleProd ?? singleProd1)?.IsMrpBase != 1 &&
            (isLoading ||
              getCost(singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost) !==
                0 ||
              getCost(singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost) !==
                0 ||
              getCost(
                singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost,
              ) !== 0 ||
              getCost(singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost) !== 0 ||
              getCost(singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost) !==
                0) && (
              <Box>
                <Typography sx={{ fontSize: "14px", color: "#666", mb: 1 }}>
                  Price Breakup :
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    mb: 2,
                  }}
                >
                  {/* Metal */}
                  {(isLoading ||
                    getCost(
                      singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost,
                    ) !== 0) && (
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          bgcolor: "#f5f5f5",
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#616161",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Metal
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontSize: "13px" }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={18}
                            />
                          ) : (
                            <>
                              <span className="elv_currencyFont">
                                {loginData?.CurrencyCode ??
                                  storeInit?.CurrencyCode}
                              </span>{" "}
                              {formatter(
                                getCost(
                                  singleProd1?.Metal_Cost ??
                                    singleProd?.Metal_Cost,
                                ).toFixed(2),
                              )}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Diamond */}
                  {(isLoading ||
                    getCost(
                      singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost,
                    ) !== 0) && (
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          bgcolor: "#f5f5f5",
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#616161",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Diamond
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontSize: "13px" }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={18}
                            />
                          ) : (
                            <>
                              <span className="elv_currencyFont">
                                {loginData?.CurrencyCode ??
                                  storeInit?.CurrencyCode}
                              </span>{" "}
                              {formatter(
                                getCost(
                                  singleProd1?.Diamond_Cost ??
                                    singleProd?.Diamond_Cost,
                                ).toFixed(2),
                              )}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Stone */}
                  {(isLoading ||
                    getCost(
                      singleProd1?.ColorStone_Cost ??
                        singleProd?.ColorStone_Cost,
                    ) !== 0) && (
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          bgcolor: "#f5f5f5",
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#616161",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Stone
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontSize: "13px" }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={18}
                            />
                          ) : (
                            <>
                              <span className="elv_currencyFont">
                                {loginData?.CurrencyCode ??
                                  storeInit?.CurrencyCode}
                              </span>{" "}
                              {formatter(
                                getCost(
                                  singleProd1?.ColorStone_Cost ??
                                    singleProd?.ColorStone_Cost,
                                ).toFixed(2),
                              )}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* MISC */}
                  {(isLoading ||
                    getCost(singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost) !==
                      0) && (
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          bgcolor: "#f5f5f5",
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#616161",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          MISC
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontSize: "13px" }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={18}
                            />
                          ) : (
                            <>
                              <span className="elv_currencyFont">
                                {loginData?.CurrencyCode ??
                                  storeInit?.CurrencyCode}
                              </span>{" "}
                              {formatter(
                                getCost(
                                  singleProd1?.Misc_Cost ??
                                    singleProd?.Misc_Cost,
                                ).toFixed(2),
                              )}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Labour */}
                  {(isLoading ||
                    getCost(
                      singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost,
                    ) !== 0) && (
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          bgcolor: "#f5f5f5",
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            color: "#616161",
                            fontWeight: 600,
                          }}
                        >
                          Labour
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontSize: "13px" }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={18}
                            />
                          ) : (
                            <>
                              <span>
                                {loginData?.CurrencyCode ??
                                  storeInit?.CurrencyCode}
                              </span>{" "}
                              {formatter(
                                getCost(
                                  singleProd1?.Labour_Cost ??
                                    singleProd?.Labour_Cost,
                                ).toFixed(2),
                              )}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Other */}
                  {(isLoading ||
                    getCost(singleProd1?.Other_Cost ?? singleProd?.Other_Cost) +
                      getCost(
                        singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp,
                      ) +
                      getCost(
                        singleProd1?.DesignMarkUpAmount ??
                          singleProd?.DesignMarkUpAmount,
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
                        singleProd1?.Misc_SettingCost ??
                          singleProd?.Misc_SettingCost,
                      ) !==
                      0) && (
                    <Box sx={{ display: "flex" }}>
                      <Box
                        sx={{
                          width: "120px",
                          bgcolor: "#f5f5f5",
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            color: "#616161",
                            fontWeight: 600,
                          }}
                        >
                          Other
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#424242", fontSize: "13px" }}
                        >
                          {isLoading ? (
                            <Skeleton
                              variant="rounded"
                              width={80}
                              height={18}
                            />
                          ) : (
                            <>
                              <span className="elv_currencyFont">
                                {loginData?.CurrencyCode ??
                                  storeInit?.CurrencyCode}
                              </span>{" "}
                              {formatter(
                                (
                                  getCost(
                                    singleProd1?.Other_Cost ??
                                      singleProd?.Other_Cost,
                                  ) +
                                  getCost(
                                    singleProd1?.Size_MarkUp ??
                                      singleProd?.Size_MarkUp,
                                  ) +
                                  getCost(
                                    singleProd1?.DesignMarkUpAmount ??
                                      singleProd?.DesignMarkUpAmount,
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
                                    singleProd1?.Misc_SettingCost ??
                                      singleProd?.Misc_SettingCost,
                                  )
                                ).toFixed(2),
                              )}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
        </Box>
      </Grid>
    </>
  );
};

export default RightSide;
