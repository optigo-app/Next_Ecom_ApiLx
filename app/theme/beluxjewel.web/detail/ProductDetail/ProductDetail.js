"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ProductDetail.modul.scss";
import Cookies from "js-cookie";
import {
  Box,
  Grid,
  useMediaQuery,
  CircularProgress,
  Typography,
} from "@mui/material";
import Pako from "pako";
import { SingleArticleProdListAPI } from "@/app/(core)/utils/API/ArticleSingleProdListAPI/ArticleSingleProdListAPI";
import { getSizeData } from "@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import {
  formatRedirectTitleLine,
  formatTitleLine,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import RelatedProduct from "./RelatedProduct/RelatedProduct";
import { StockItemApi } from "@/app/(core)/utils/API/StockItemAPI/StockItemApi";
import { DesignSetListAPI } from "@/app/(core)/utils/API/DesignSetListAPI/DesignSetListAPI";
import DesignSet from "./DesignSet/DesignSet";
import NewStockitem from "./InstockProduct/NewStockitem";
import { SaveLastViewDesign } from "@/app/(core)/utils/API/SaveLastViewDesign/SaveLastViewDesign";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import LeftSide from "./New/LeftSide";
import RightSide from "./New/RightSide";
import PreviewDialog from "./New/PreviewDialog";
import ProductDetailsSection from "./New/ProductDetailsSection";
import ExtraProductSections from "./New/ExtraProductSections";
import CustomerReviews from "./New/CustomerReviews";
import DetailPageSkeleton from "../DetailPageSkeleton";
import DetailBreadcrumb from "./New/DetailBreadcrumb";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useSyncDataStore } from "@/app/(core)/hooks/useStore";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useImageZoom } from "@/app/(core)/hooks/UseImageZoom";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { decodeAndDecompress } from "@/app/(core)/utils/seo/seo-utils";

const imageNotFound = "/image-not-found.jpg";
const noImageFound = imageNotFound;

const ProductDetail = ({ storeinit, searchParams, params }) => {
  const { setCartCountNum, setWishCountNum, loginUserDetail } = useStore();

  const unwrappedSearchParams = (searchParams && typeof searchParams.then === "function")
    ? React.use(searchParams)
    : searchParams;

  const initialDecodeUrl = useMemo(() => {
    const result = ParseAndDecodeSearchParams(unwrappedSearchParams);
    const navVal = result[0]?.split("=")[1];
    return decodeAndDecompress(navVal);
  }, [unwrappedSearchParams]);

  const hasPreHydratedData = Boolean(
    initialDecodeUrl?.b ||
    initialDecodeUrl?.title ||
    initialDecodeUrl?.a ||
    initialDecodeUrl?.img ||
    initialDecodeUrl?.ArticleNo
  );

  const initialMockProd = useMemo(() => {
    if (hasPreHydratedData) {
      return {
        TitleLine: initialDecodeUrl.title || initialDecodeUrl.ArticleNo || initialDecodeUrl.b || "",
        Nwt: initialDecodeUrl.nwt ? parseFloat(initialDecodeUrl.nwt) : 0,
        NetWeight: initialDecodeUrl.nwt ? parseFloat(initialDecodeUrl.nwt) : 0,
        UnitCostWithMarkUp: initialDecodeUrl.price ? parseFloat(initialDecodeUrl.price) : 0,
        UnitCostWithmarkup: initialDecodeUrl.price ? parseFloat(initialDecodeUrl.price) : 0,
        TotalUnitCost: initialDecodeUrl.price ? parseFloat(initialDecodeUrl.price) : 0,
        ArticleNo: initialDecodeUrl.ArticleNo ?? "",
        designno: initialDecodeUrl.b ?? "",
        autocode: initialDecodeUrl.a ?? "",
        ImageExtension: "webp",
        ImageCount: 1,
      };
    }
    return {};
  }, [initialDecodeUrl, hasPreHydratedData]);

  const [maxWidth1400, setMaxWidth1400] = useState(false);
  const [maxWidth1000, setMaxWidth1000] = useState(false);
  const [decodeUrl, setDecodeUrl] = useState(initialDecodeUrl || {});
  const [storeInit, setStoreInit] = useState(storeinit || {});
  const [loginData, setLoginData] = useState({});
  const [sizeData, setSizeData] = useState();
  const [singleProd, setSingleProd] = useState(initialMockProd);
  const [singleProd1, setSingleProd1] = useState(initialMockProd);
  const [diaList, setDiaList] = useState([]);
  const [csList, setCsList] = useState([]);
  const [netWTData, setnetWTData] = useState([]);
  const [SizeCombo, setSizeCombo] = useState([]);
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalType, setMetalType] = useState();
  const [isImageload, setIsImageLoad] = useState(true);
  const [IIIisImageload, setIIIIsImageLoad] = useState(false);
  const [metalColor, setMetalColor] = useState();
  const [selectDiaQc, setSelectDiaQc] = useState();
  const [showtDiaQc, setShowDiaQc] = useState();
  const [diaQcCombo, setDiaQcCombo] = useState([]);
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [selectCsQC, setSelectCsQC] = useState();
  const [metalWiseColorImg, setMetalWiseColorImg] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [isPriceloading, setisPriceLoading] = useState(hasPreHydratedData ? false : true);
  const [selectedThumbImg, setSelectedThumbImg] = useState({});
  const [pdThumbImg, setPdThumbImg] = useState([]);
  const [thumbImgIndex, setThumbImgIndex] = useState();
  const [pdVideoArr, setPdVideoArr] = useState([]);
  const [addToCardFlag, setAddToCartFlag] = useState(null);
  const [wishListFlag, setWishListFlag] = useState(null);
  const [isDataFound, setIsDataFound] = useState(false);
  const [pdLoadImage, setPdLoadImage] = useState(false);
  const location = usePathname();
  const [saveLastView, setSaveLastView] = useState();
  const [imageSrc, setImageSrc] = useState(initialDecodeUrl?.img || "");
  const [filterData, setFilterData] = useState([]);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const { imageRefs, handleMouseMove, handleMouseLeave } = useImageZoom(2.2);
  const [selectedMetalColor, setSelectedMetalColor] = useState();
  const getBreadCrumData = getSession("breadcrumbData");
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaBuildDone, setMediaBuildDone] = useState(false);
  // Article-level combination data (all articles for this design)
  const [rd1Data, setRd1Data] = useState([]);
  const [rd2Data, setRd2Data] = useState([]);
  const [customizationDetail, setCustomizationDetail] = useState(null);
  // Per-article cart/wishlist status map: { [ArticleId]: { IsInCart, IsInWish, CartId } }
  const [rd1CartMap, setRd1CartMap] = useState({});
  const Navigate = useNextRouterLikeRR();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [SelectedImageIndex, setSelectedImageIndex] = useState(null);
  const { broadcast } = useBroadcaster(); // Get the broadcaster
  const lastSyncData = useSyncDataStore((s) => s.syncData);

  useGlobalPreventSave();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlaceholder(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialDecodeUrl && Object.keys(initialDecodeUrl).length > 0) {
      try {
        const mediaDet = initialDecodeUrl.mediaDet;
        if (!mediaDet || mediaDet === "0") return;
        const parsed = typeof mediaDet === "string" ? JSON.parse(mediaDet) : mediaDet;
        if (!Array.isArray(parsed) || parsed.length === 0) return;

        const baseImageCDN = storeinit?.CDNDesignImageFol || storeInit?.CDNDesignImageFol;
        const baseThumbCDN = storeinit?.CDNDesignImageFolThumb || storeInit?.CDNDesignImageFolThumb;
        const baseVideoCDN = storeinit?.CDNVPath || storeInit?.CDNVPath;
        if (!baseImageCDN) return;

        const normalImages = parsed.filter((item) => Number(item?.TI) === 1);
        const colorImages = parsed.filter((item) => Number(item?.TI) === 2);
        const normalVideos = parsed.filter((item) => Number(item?.TI) === 3);
        const colorVideos = parsed.filter((item) => Number(item?.TI) === 4);

        let colorCode = null;
        if (initialDecodeUrl.img) {
          const fileName = initialDecodeUrl.img.split("/").pop() || "";
          const parts = fileName.split("~");
          if (parts.length > 2) {
            colorCode = parts[2].split(".")[0]?.toUpperCase() || null;
          }
        }

        if (!colorCode && typeof window !== "undefined") {
          try {
            const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo") || "[]");
            const loginInfo = getSession("loginUserDetail");
            const defaultColorObj = mtColorLocal.find(ele => ele.id === loginInfo?.MetalColorId);
            colorCode = defaultColorObj?.colorcode || colorImages[0]?.CN || null;
          } catch (err) {}
        }

        const resolvedImages = [];

        if (colorImages.length > 0 && colorCode) {
          colorImages.forEach((img) => {
            if (img.CN === colorCode) {
              const thumbUrl = `${baseThumbCDN}${initialDecodeUrl.b}~${img.Nm}~${colorCode}.jpg`;
              resolvedImages.push({
                thumbImageUrl: thumbUrl,
                originalImageExtension: img.Ex || "webp",
              });
            }
          });
        }

        if (resolvedImages.length === 0 && normalImages.length > 0) {
          normalImages.forEach((img) => {
            const thumbUrl = `${baseThumbCDN}${initialDecodeUrl.b}~${img.Nm}.jpg`;
            resolvedImages.push({
              thumbImageUrl: thumbUrl,
              originalImageExtension: img.Ex || "webp",
            });
          });
        }

        if (resolvedImages.length > 0) {
          setPdThumbImg(resolvedImages);
          setThumbImgIndex(0);
        }

        const resolvedVideos = [];
        if (colorVideos.length > 0 && colorCode && baseVideoCDN) {
          colorVideos.forEach((vid) => {
            if (vid.CN === colorCode) {
              resolvedVideos.push(
                `${baseVideoCDN}${initialDecodeUrl.b}~${vid.Nm}~${colorCode}.${vid.Ex || "mp4"}`
              );
            }
          });
        }

        normalVideos.forEach((vid) => {
          if (baseVideoCDN) {
            resolvedVideos.push(
              `${baseVideoCDN}${initialDecodeUrl.b}~${vid.Nm}.${vid.Ex || "mp4"}`
            );
          }
        });

        if (resolvedVideos.length > 0) {
          setPdVideoArr(resolvedVideos);
        }
      } catch (e) {
        console.error("Error pre-populating media:", e);
      }
    }
  }, [initialDecodeUrl, storeinit, storeInit]);

  let cookie = Cookies.get("visiterId");

  const [loadingdata, setloadingdata] = useState(hasPreHydratedData ? false : true);
  const [SimilarBrandArr, setSimilarBrandArr] = useState([]);
  const [designSetList, setDesignSetList] = useState();
  const [stockItemArr, setStockItemArr] = useState([]);
  const [cartArr, setCartArr] = useState({});

  let maxWidth1400pxAndMinWidth1000px = useMediaQuery(
    "(max-width: 1400px) and (min-width: 1000px)",
  );
  let maxWidth1400px = useMediaQuery("(max-width:1400px)");
  let maxWidth1000px = useMediaQuery("(max-width:1000px)");
  useEffect(() => {
    const handleMax1400px = () => {
      if (maxWidth1400pxAndMinWidth1000px) {
        setMaxWidth1400(true);
      } else {
        setMaxWidth1400(false);
      }
    };

    const handleMax1000px = () => {
      if (maxWidth1000px) {
        setMaxWidth1000(true);
        setMaxWidth1400(false);
      } else {
        setMaxWidth1000(false);
      }
    };

    handleMax1400px();
    handleMax1000px();

    // const getDiamonddata = sessionStorage.getItem
  }, [maxWidth1400px, maxWidth1000px]);

  const getDynamicImages = (designno, extension) => {
    const getDesignImageFol = storeInit?.CDNDesignImageFol;
    const url = `${getDesignImageFol}${designno}~1.${extension}`;
    return url;
  };

  const hasValidData = singleProd1 && Object.keys(singleProd1).length > 0;
  const product = hasValidData ? singleProd1 : singleProd;

  // Dynamic Product Schema for Rich Results (Price, Availability, etc.)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product?.TitleLine || product?.designno,
    image: pdThumbImg?.map((img) => img.thumbImageUrl) || [],
    description: product?.description || "High-quality jewelry",
    sku: product?.designno,
    brand: {
      "@type": "Brand",
      name: storeInit?.BrowserTitle || "Jewelry Store",
    },
    offers: {
      "@type": "Offer",
      url: typeof window !== "undefined" ? window.location.href : "",
      priceCurrency:
        loginData?.CurrencyCode || storeInit?.CurrencyCode || "USD",
      price: product?.UnitCostWithMarkUp || 0,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    if (!pdVideoArr || !selectedMetalColor) return;

    const colorMatched = pdVideoArr.filter((url) => {
      const parts = url.split("~");
      const colorPart = parts[2]?.split(".")[0];
      return colorPart === selectedMetalColor;
    });

    if (colorMatched.length > 0) {
      setFilteredVideos(colorMatched);
    } else {
      // Fallback: videos without any color in the filename
      const noColorVideos = pdVideoArr.filter((url) => {
        const parts = url.split("~");
        return parts.length === 2; // means format is like MCJ66~1.mp4
      });
      setFilteredVideos(noColorVideos);
    }
  }, [pdVideoArr, selectedMetalColor]);

  // API Integration

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const [isClamped, setIsClamped] = useState(false);

  const descriptionRef = useRef(null);
  const descriptionText = singleProd1?.description ?? singleProd?.description;

  useEffect(() => {
    setIsClamped(false);
    setIsExpanded(false);

    const checkTextOverflow = () => {
      const descriptionElement = descriptionRef.current;
      if (descriptionElement) {
        const isOverflowing =
          descriptionElement.scrollHeight > descriptionElement.clientHeight;
        setIsClamped(isOverflowing);
      }
    };

    checkTextOverflow();

    window.addEventListener("resize", checkTextOverflow);
    return () => {
      window.removeEventListener("resize", checkTextOverflow);
    };
  }, [descriptionText, descriptionRef]);

  useEffect(() => {
    setIsClamped(false);
    setIsExpanded(false);
  }, [location, searchParams]);

  const mTypeLocal = getSession("metalTypeCombo");
  const diaQcLocal = getSession("diamondQualityColorCombo");
  const csQcLocal = getSession("ColorStoneQualityColorCombo");
  const mtColorLocal = getSession("MetalColorCombo");

  useEffect(() => {
    if (metalTypeCombo.length) {
      const mtType = metalTypeCombo.find(
        (ele) => ele.Metalid === singleProd?.MetalPurityid,
      )?.metaltype;
      setMetalType(mtType);
    }
    if (metalColorCombo.length) {
      const getCurrentMetalColor = mtColorLocal.find(
        (ele) => ele?.id === singleProd?.MetalColorid,
      )?.colorcode;
      setMetalColor(getCurrentMetalColor);
    }
  }, [singleProd, metalTypeCombo, metalColorCombo]);

  // useEffect(() => {
  //   const isInCart = singleProd?.IsInCart === 0 ? false : true;
  //   setAddToCartFlag(isInCart);
  // }, [singleProd])

  useEffect(() => {
    const activeProd =
      singleProd1 && Object.keys(singleProd1).length > 0
        ? singleProd1
        : singleProd;

    if (activeProd && activeProd.autocode) {
      setAddToCartFlag(activeProd.IsInCart === 1);
    } else {
      setAddToCartFlag(null);
    }
  }, [singleProd, singleProd1]);

  // Reset optimistic flags when the active article changes so rd1CartMap is consulted
  useEffect(() => {
    setAddToCartFlag(null);
    setWishListFlag(null);
  }, [customizationDetail?.ArticleId]);

  const handleCart = async (cartFlag) => {
    const metal =
      metalTypeCombo?.find((ele) => {
        return ele?.metaltype == metalType;
      }) ?? metalTypeCombo;

    const dia =
      diaQcCombo?.find((ele) => {
        return (
          ele?.Quality == selectDiaQc.split(",")[0] &&
          ele?.color == selectDiaQc.split(",")[1]
        );
      }) ?? diaQcCombo;

    const cs =
      csQcCombo?.find((ele) => {
        return (
          ele?.Quality == selectCsQC.split(",")[0] &&
          ele?.color == selectCsQC.split(",")[1]
        );
      }) ?? csQcCombo;

    const mcArr =
      metalColorCombo?.find((ele) => {
        return ele?.metalcolorname == metalColor;
      }) ?? metalColorCombo;

    const prodObj = {
      autocode:
        customizationDetail?.autocode ||
        singleProd1?.autocode ||
        singleProd?.autocode,
      Metalid: customizationDetail?.MetalTypeId || metal?.Metalid,
      MetalColorId:
        customizationDetail?.MetalColorId ||
        mcArr?.id ||
        singleProd?.MetalColorid,
      DiaQCid:
        customizationDetail?.DiaQCid ||
        `${dia?.QualityId ?? 0},${dia?.ColorId ?? 0}`,
      CsQCid:
        customizationDetail?.CsQCid ||
        `${cs?.QualityId ?? 0},${cs?.ColorId ?? 0}`,
      Size: sizeData ?? customizationDetail?.Size ?? singleProd?.DefaultSize,
      Unitcost:
        customizationDetail?.TotalUnitCost ||
        singleProd1?.UnitCost ||
        singleProd?.UnitCost,
      markup:
        customizationDetail?.MarkUp ||
        singleProd1?.DesignMarkUp ||
        singleProd?.DesignMarkUp,
      UnitCostWithmarkup:
        customizationDetail?.UnitCostWithmarkup ||
        customizationDetail?.TotalUnitCost ||
        singleProd1?.UnitCostWithMarkUp ||
        singleProd?.UnitCostWithMarkUp,
      Remark: "",
      Metal_Cost:
        customizationDetail?.TotalMetalCost ||
        singleProd?.Metal_Cost ||
        singleProd1?.Metal_Cost,
      Labour_Cost:
        customizationDetail?.TotalMakingCost ||
        singleProd?.Labour_Cost ||
        singleProd1?.Labour_Cost,
      Diamond_Cost:
        customizationDetail?.TotalDiamondCost ||
        singleProd?.Diamond_Cost ||
        singleProd1?.Diamond_Cost,
      Diamond_SettingCost:
        customizationDetail?.TotalDiaSettingCost ||
        singleProd?.Diamond_SettingCost ||
        singleProd1?.Diamond_SettingCost,
      ColorStone_Cost:
        customizationDetail?.TotalColorStoneCost ||
        singleProd?.ColorStone_Cost ||
        singleProd1?.ColorStone_Cost,
      ColorStone_SettingCost:
        customizationDetail?.TotalCSSettingCost ||
        singleProd?.ColorStone_SettingCost ||
        singleProd1?.ColorStone_SettingCost,
      Misc_Cost:
        customizationDetail?.TotalMiscCost ||
        singleProd?.Misc_Cost ||
        singleProd1?.Misc_Cost,
      Misc_SettingCost:
        customizationDetail?.TotalSettingCost ||
        singleProd?.Misc_SettingCost ||
        singleProd1?.Misc_SettingCost,
      Other_Cost:
        customizationDetail?.TotalOtherCost ||
        singleProd?.Other_Cost ||
        singleProd1?.Other_Cost,
      SolPrice:
        customizationDetail?.SolPrice ||
        singleProd?.SolPric ||
        singleProd1?.SolPrice,
      ArticleNo: customizationDetail?.ArticleNo || singleProd?.ArticleNo || "",
      ArticleId:
        customizationDetail?.ArticleId ||
        singleProd1?.ArticleId ||
        singleProd?.ArticleId ||
        0,
    };

    const activeArticleId =
      customizationDetail?.ArticleId ||
      singleProd1?.ArticleId ||
      singleProd?.ArticleId;

    if (cartFlag) {
      let res = await CartAndWishListAPI("Cart", prodObj, cookie);
      if (res) {
        try {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          const newCartId = res?.Data?.rd[0]?.CartId;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          // Update per-article cart map
          if (activeArticleId) {
            setRd1CartMap((prev) => ({
              ...prev,
              [activeArticleId]: {
                ...prev[activeArticleId],
                IsInCart: 1,
                CartId: newCartId ?? prev[activeArticleId]?.CartId ?? 0,
              },
            }));
          }
          broadcast(
            "UPDATE_CART_COUNT",
            cartC,
            prodObj?.autocode,
            "cart",
            true,
          );
        } catch (error) {
          console.log("err", error);
        }
        setAddToCartFlag(cartFlag);
      }
    } else {
      const cartEntry = rd1CartMap[activeArticleId];
      const cartIdToRemove = cartEntry?.CartId;
      let res1 = await RemoveCartAndWishAPI(
        "Cart",
        customizationDetail?.autocode || singleProd?.autocode,
        cookie,
        false,
        "",
        customizationDetail?.ArticleNo || singleProd?.ArticleNo || "",
        cartIdToRemove,
      );
      if (res1) {
        try {
          let cartC = res1?.Data?.rd[0]?.Cartlistcount;
          let wishC = res1?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          // Clear per-article cart entry
          if (activeArticleId) {
            setRd1CartMap((prev) => ({
              ...prev,
              [activeArticleId]: {
                ...prev[activeArticleId],
                IsInCart: 0,
                CartId: 0,
              },
            }));
          }
          broadcast(
            "UPDATE_CART_COUNT",
            cartC,
            prodObj?.autocode,
            "cart",
            false,
          );
        } catch (error) {
          console.log("err", error);
        }
        setAddToCartFlag(cartFlag);
      }
    }
  };

  const handleWishList = async (e, elv) => {
    setWishListFlag(e?.target?.checked);

    let storeinitInside = storeinit;
    let logininfoInside = loginUserDetail;

    let metal = metalTypeCombo?.filter((ele) => ele?.metaltype == metalType);

    let dia = diaQcCombo?.filter(
      (ele) =>
        ele?.Quality == selectDiaQc.split(",")[0] &&
        ele?.color == selectDiaQc.split(",")[1],
    );

    let cs = csQcCombo?.filter(
      (ele) =>
        ele?.Quality == selectCsQC.split(",")[0] &&
        ele?.color == selectCsQC.split(",")[1],
    );

    let mcArr = metalColorCombo?.filter((ele) => {
      if (metalColor) {
        return ele?.colorcode == metalColor;
      } else {
        return (
          ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid)
        );
      }
    })[0];

    let prodObj = {
      autocode:
        customizationDetail?.autocode ||
        singleProd1?.autocode ||
        singleProd?.autocode,
      Metalid:
        customizationDetail?.MetalTypeId ||
        (metal?.length
          ? metal[0]?.Metalid
          : (logininfoInside?.MetalId ?? storeinitInside?.MetalId)),
      MetalColorId:
        customizationDetail?.MetalColorId ||
        mcArr?.id ||
        singleProd?.MetalColorid,
      DiaQCid:
        customizationDetail?.DiaQCid ||
        (dia?.length
          ? `${dia[0]?.QualityId},${dia[0]?.ColorId}`
          : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid)),
      CsQCid:
        customizationDetail?.CsQCid ||
        (cs?.length
          ? `${cs[0]?.QualityId},${cs[0]?.ColorId}`
          : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid)),
      Size:
        sizeData ??
        customizationDetail?.Size ??
        singleProd1?.DefaultSize ??
        singleProd?.DefaultSize,
      Unitcost:
        customizationDetail?.TotalUnitCost ||
        singleProd1?.UnitCost ||
        singleProd?.UnitCost,
      markup:
        customizationDetail?.MarkUp ||
        singleProd1?.DesignMarkUp ||
        singleProd?.DesignMarkUp,
      UnitCostWithmarkup:
        customizationDetail?.UnitCostWithmarkup ||
        customizationDetail?.TotalUnitCost ||
        singleProd1?.UnitCostWithMarkUp ||
        singleProd?.UnitCostWithMarkUp,
      Remark: "",
      Metal_Cost:
        customizationDetail?.TotalMetalCost ||
        singleProd?.Metal_Cost ||
        singleProd1?.Metal_Cost,
      Labour_Cost:
        customizationDetail?.TotalMakingCost ||
        singleProd?.Labour_Cost ||
        singleProd1?.Labour_Cost,
      Diamond_Cost:
        customizationDetail?.TotalDiamondCost ||
        singleProd?.Diamond_Cost ||
        singleProd1?.Diamond_Cost,
      Diamond_SettingCost:
        customizationDetail?.TotalDiaSettingCost ||
        singleProd?.Diamond_SettingCost ||
        singleProd1?.Diamond_SettingCost,
      ColorStone_Cost:
        customizationDetail?.TotalColorStoneCost ||
        singleProd?.ColorStone_Cost ||
        singleProd1?.ColorStone_Cost,
      ColorStone_SettingCost:
        customizationDetail?.TotalCSSettingCost ||
        singleProd?.ColorStone_SettingCost ||
        singleProd1?.ColorStone_SettingCost,
      Misc_Cost:
        customizationDetail?.TotalMiscCost ||
        singleProd?.Misc_Cost ||
        singleProd1?.Misc_Cost,
      Misc_SettingCost:
        customizationDetail?.TotalSettingCost ||
        singleProd?.Misc_SettingCost ||
        singleProd1?.Misc_SettingCost,
      Other_Cost:
        customizationDetail?.TotalOtherCost ||
        singleProd?.Other_Cost ||
        singleProd1?.Other_Cost,
      SolPrice:
        customizationDetail?.SolPrice ||
        singleProd?.SolPric ||
        singleProd1?.SolPrice,
      ArticleNo: customizationDetail?.ArticleNo || singleProd?.ArticleNo || "",
      ArticleId:
        customizationDetail?.ArticleId ||
        singleProd1?.ArticleId ||
        singleProd?.ArticleId ||
        0,
    };

    const activeArticleId =
      customizationDetail?.ArticleId ||
      singleProd1?.ArticleId ||
      singleProd?.ArticleId;

    if (e.target.checked === true) {
      let res = await CartAndWishListAPI("Wish", prodObj, cookie);
      if (res) {
        try {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          // Update per-article wish map
          if (activeArticleId) {
            setRd1CartMap((prev) => ({
              ...prev,
              [activeArticleId]: {
                ...prev[activeArticleId],
                IsInWish: 1,
              },
            }));
          }
          broadcast(
            "UPDATE_WISH_COUNT",
            wishC,
            prodObj?.autocode,
            "wish",
            true,
          );
        } catch (error) {
          console.log("err", error);
        }
      }
    } else {
      let res1 = await RemoveCartAndWishAPI(
        "Wish",
        customizationDetail?.autocode || singleProd?.autocode,
        cookie,
        false,
        "",
        customizationDetail?.ArticleNo || singleProd?.ArticleNo || "",
      );
      if (res1) {
        try {
          let cartC = res1?.Data?.rd[0]?.Cartlistcount;
          let wishC = res1?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          // Clear per-article wish entry
          if (activeArticleId) {
            setRd1CartMap((prev) => ({
              ...prev,
              [activeArticleId]: {
                ...prev[activeArticleId],
                IsInWish: 0,
              },
            }));
          }
          broadcast(
            "UPDATE_WISH_COUNT",
            wishC,
            prodObj?.autocode,
            "wish",
            false,
          );
        } catch (error) {
          console.log("err", error);
        }
      }
    }
  };

  useEffect(() => {
    let decodeobj = initialDecodeUrl;

    let mtTypeLocal = getSession("metalTypeCombo");

    let diaQcLocal = getSession("diamondQualityColorCombo");

    let csQcLocal = getSession("ColorStoneQualityColorCombo");

    setTimeout(() => {
      if (decodeUrl) {
        let metalArr;
        let diaArr;
        let csArr;

        let storeinitInside = storeinit;
        let logininfoInside = loginUserDetail;

        if (mtTypeLocal?.length) {
          metalArr = mtTypeLocal?.filter(
            (ele) =>
              ele?.Metalid ==
              (decodeobj?.m
                ? decodeobj?.m
                : (logininfoInside?.MetalId ?? storeinitInside?.MetalId)),
          )[0];
        }

        if (diaQcLocal?.length) {
          diaArr = diaQcLocal?.filter(
            (ele) =>
              ele?.QualityId ==
                (decodeobj?.d
                  ? decodeobj?.d?.split(",")[0]
                  : (
                      logininfoInside?.cmboDiaQCid ??
                      storeinitInside?.cmboDiaQCid
                    ).split(",")[0]) &&
              ele?.ColorId ==
                (decodeobj?.d
                  ? decodeobj?.d?.split(",")[1]
                  : (
                      logininfoInside?.cmboDiaQCid ??
                      storeinitInside?.cmboDiaQCid
                    ).split(",")[1]),
          )[0];
        }

        if (csQcLocal?.length) {
          csArr = csQcLocal?.filter(
            (ele) =>
              ele?.QualityId ==
                (decodeobj?.c
                  ? decodeobj?.c?.split(",")[0]
                  : (
                      logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid
                    ).split(",")[0]) &&
              ele?.ColorId ==
                (decodeobj?.c
                  ? decodeobj?.c?.split(",")[1]
                  : (
                      logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid
                    ).split(",")[1]),
          )[0];
        }

        setMetalType(metalArr?.metaltype);

        setSelectDiaQc(`${diaArr?.Quality},${diaArr?.color}`);

        setSelectCsQC(`${csArr?.Quality},${csArr?.color}`);
      }
    }, 500);
  }, [singleProd]);

  useEffect(() => {
    try {
      if (selectedThumbImg == undefined) return;

      if (selectedThumbImg) {
        setImageSrc(selectedThumbImg?.link?.imageUrl);
      } else {
        // Set a default image if no thumbnail is selected
        setImageSrc(pdVideoArr?.length > 0 ? noImageFound : "p.png");
      }
    } catch (error) {
      console.log("Error in fetching image", error);
    }
  }, [selectedThumbImg, pdVideoArr]);

  const fallbackImg = `${storeInit?.CDNDesignImageFol}${singleProd?.designno}~1.${singleProd?.ImageExtension}`;

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = noImageFound;
  };

  const handleVideoError = (e) => {
    e.target.onerror = null;
    e.target.poster = noImageFound;
  };

  useEffect(() => {
    let storeinitInside = storeinit;
    let logininfoInside = loginUserDetail;
    let getDecode = initialDecodeUrl;
    let decodeobj = { ...getDecode };

    if (!decodeobj?.g) {
      decodeobj.g = {
        g: [
          ["", ""],
          ["", "", ""],
        ],
      };
    }
    setDecodeUrl(decodeobj);

    let mtTypeLocal = getSession("metalTypeCombo");

    let diaQcLocal = getSession("diamondQualityColorCombo");

    let csQcLocal = getSession("ColorStoneQualityColorCombo");

    let metalArr;
    let diaArr;
    let csArr;

    if (mtTypeLocal?.length) {
      metalArr =
        mtTypeLocal?.filter((ele) => ele?.Metalid == decodeobj?.m)[0]
          ?.Metalid ?? decodeobj?.m;
    }

    if (diaQcLocal) {
      diaArr =
        diaQcLocal?.filter(
          (ele) =>
            ele?.QualityId == decodeobj?.d?.split(",")[0] &&
            ele?.ColorId == decodeobj?.d?.split(",")[1],
        )[0] ?? `${decodeobj?.d?.split(",")[0]},${decodeobj?.d?.split(",")[1]}`;
    }

    if (csQcLocal) {
      csArr =
        csQcLocal?.filter((ele) => {
          return (
            ele?.QualityId == decodeobj?.c?.split(",")[0] &&
            ele?.ColorId == decodeobj?.c?.split(",")[1]
          );
        })[0] ??
        `${decodeobj?.c?.split(",")[0]},${decodeobj?.c?.split(",")[1]}`;
    }

    if (!(decodeobj?.b || decodeobj?.title || decodeobj?.a || decodeobj?.img)) {
      setloadingdata(true);
    }
    const FetchProductData = async () => {
      let obj1 = {
        mt: logininfoInside?.MetalId ?? storeinitInside?.MetalId,
        diaQc: diaArr
          ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`
          : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid),
        csQc: csArr
          ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`
          : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid),
      };

      let obj = {
        mt: metalArr
          ? metalArr
          : (logininfoInside?.MetalId ?? storeinitInside?.MetalId),
        diaQc: diaArr
          ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`
          : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid),
        csQc: csArr
          ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`
          : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid),
      };

    if (decodeobj?.title) {
      const initialProd = {
        TitleLine: decodeobj.title,
        Nwt: decodeobj.nwt ? parseFloat(decodeobj.nwt) : 0,
        UnitCostWithMarkUp: decodeobj.price ? parseFloat(decodeobj.price) : 0,
        ArticleNo: decodeobj.ArticleNo ?? "",
        designno: decodeobj.b ?? "",
        autocode: decodeobj.a ?? "",
        ImageExtension: "webp",
        ImageCount: 1,
      };
      setSingleProd(initialProd);
      setSingleProd1(initialProd);
      if (decodeobj.img) {
        setImageSrc(decodeobj.img);
      }
      setisPriceLoading(false);
    } else {
      setisPriceLoading(true);
      setSingleProd1({});
      setSingleProd({});
    }

      try {
        const res = await SingleArticleProdListAPI(
          decodeobj,
          sizeData,
          obj,
          cookie,
        );
        if (res && res?.pdList) {
          const prod = res?.pdList[0];
          setSingleProd(prod);

          if (res?.pdList?.length > 0) {
            setisPriceLoading(false);
            setloadingdata(false);
            setIsDataFound(false);
          } else {
            setisPriceLoading(false);
            setloadingdata(false);
            setIsDataFound(true);
            return;
          }

          setDiaList(res?.pdResp?.rd3);
          setCsList(res?.pdResp?.rd4);

          let mappedRd1 = [];
          if (res?.pdResp?.rd1?.length) {
            mappedRd1 = res.pdResp.rd1.map(r => {
              const metalId = r.metaltypeid || r.MetalTypeId || r.Metalid;
              const metalColorId = r.metalcolorid || r.MetalColorId;
              const metalType = r.metal || r.metaltypename || r.MetalType || r.metalpurityname;
              const metalColor = r.metalcolorname || r.MetalColor;
              const netWeight = r.Nwt || r.NetWeight;
              return {
                ...r,
                ArticleId: r.ArticleId || r.id,
                MetalTypeId: metalId,
                Metalid: metalId,
                MetalColorId: metalColorId,
                MetalType: metalType,
                MetalColor: metalColor,
                NetWeight: netWeight,
              };
            });
            setRd1Data(mappedRd1);
            const initMap = {};
            mappedRd1.forEach((r) => {
              initMap[r.ArticleId] = {
                IsInCart: r.IsInCart ?? 0,
                IsInWish: r.IsInWish ?? 0,
                CartId: r.CartId ?? 0,
              };
            });
            setRd1CartMap(initMap);
          }
          if (res?.pdResp?.rd2?.length) {
            const mappedRd2 = res.pdResp.rd2.map(r => ({
              ...r,
              ArticleId: r.ArticleId || r.id,
            }));
            setRd2Data(mappedRd2);
          }

          const initialArticleId = decodeobj?.ArticleId
            ? parseInt(decodeobj?.ArticleId, 10)
            : null;
          const initialArticle =
            (initialArticleId != null &&
              mappedRd1.find(
                (r) =>
                  r.ArticleId === initialArticleId ||
                  r.ArticleId == decodeobj?.ArticleId,
              )) ||
            (decodeobj?.ArticleNo &&
              mappedRd1.find(
                (r) =>
                  r.ArticleNo === decodeobj.ArticleNo ||
                  r.ArticleNo?.toLowerCase() ===
                    String(decodeobj.ArticleNo).toLowerCase(),
              )) ||
            (decodeobj?.a &&
              mappedRd1.find(
                (r) => r.autocode === decodeobj.a || r.autocode == decodeobj.a,
              )) ||
            mappedRd1[0];
          if (initialArticle) {
            setDefaultArticleId(initialArticle.ArticleId);
            const diaStone = res?.pdResp?.rd2?.find(
              (r) =>
                r.ArticleId === initialArticle.ArticleId && r.StoneTypeid === 1,
            );
            const csStone = res?.pdResp?.rd2?.find(
              (r) =>
                r.ArticleId === initialArticle.ArticleId && r.StoneTypeid === 2,
            );
            setCustomizationDetail({
              ...initialArticle,
              ArticleId: initialArticle.ArticleId,
              ArticleNo: initialArticle.ArticleNo,
              autocode: initialArticle.autocode || prod?.autocode || "",
              Metalid: initialArticle.MetalTypeId,
              MetalColorId: initialArticle.MetalColorId,
              MetalType: initialArticle.MetalType,
              MetalColor: initialArticle.MetalColor,
              DiaQCid: diaStone
                ? `${diaStone.QualityId},${diaStone.ColorId}`
                : "0,0",
              DiaQCLabel: diaStone
                ? `${diaStone.Quality}-${diaStone.Color}`
                : null,
              CsQCid: csStone
                ? `${csStone.QualityId},${csStone.ColorId}`
                : "0,0",
              Size: initialArticle.Size,
              NetWeight: initialArticle.NetWeight,
            });
          }

          // ---------- Progressive Non-Blocking Parallel Secondary API Calls ----------
          if (prod) {
            // 1. Size Data
            getSizeData(prod, cookie)
              .then((sizeRes) => {
                setSizeCombo(sizeRes?.Data);
                const passedSize =
                  decodeobj?.Size ||
                  decodeobj?.g?.[0]?.[1] ||
                  initialArticle?.Size;

                const matchedSize = sizeRes?.Data?.rd?.find(
                  (size) =>
                    String(size.sizename).toLowerCase() ===
                    String(passedSize).toLowerCase(),
                )?.sizename;

                let initialsize =
                  matchedSize ||
                  (prod && prod.DefaultSize !== ""
                    ? prod.DefaultSize
                    : sizeRes?.Data?.rd?.find(
                          (size) => size.IsDefaultSize === 1,
                        )?.sizename === undefined
                      ? sizeRes?.Data?.rd?.[0]?.sizename
                      : sizeRes?.Data?.rd?.find(
                          (size) => size.IsDefaultSize === 1,
                        )?.sizename);
                setSizeData(initialsize);
              })
              .catch((err) => console.log("SizeErr", err));

            // 2. Stock Items
            if (storeinitInside?.IsStockWebsite === 1 && prod?.autocode) {
              StockItemApi(prod.autocode, "stockitem", cookie)
                .then((res) => setStockItemArr(res?.Data?.rd))
                .catch((err) => console.log("stockItemErr", err));
            }

            // 3. Similar Products
            if (
              storeinitInside?.IsProductDetailSimilarDesign === 1 &&
              prod?.autocode
            ) {
              StockItemApi(prod.autocode, "similarbrand", obj, cookie)
                .then((res) => setSimilarBrandArr(res?.Data?.rd))
                .catch((err) => console.log("similarbrandErr", err));
            }

            // 4. Design Set List
            // if (
            //   storeinitInside?.IsProductDetailDesignSet === 1 &&
            //   prod?.designno
            // ) {
            //   DesignSetListAPI(obj1, prod.designno, cookie)
            //     .then((res) => setDesignSetList(res?.Data?.rd))
            //     .catch((err) => console.log("designsetErr", err));
            // }

            // 5. Save Last View Design (Background)
            if (prod?.autocode && prod?.designno) {
              SaveLastViewDesign(cookie, prod.autocode, prod.designno)
                .then((res) => {
                  console.log(res,"res")
                  setSaveLastView(res?.Data?.rd)
                })
                .catch((err) => console.log("saveLastView", err));
            }
          }
        }
      } catch (err) {
        console.log("err", err);
        setisPriceLoading(false);
        setloadingdata(false);
      }
    };

    FetchProductData();

    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [location, unwrappedSearchParams]);

  const callAllApi = async () => {
    let mtTypeLocal = getSession("metalTypeCombo");
    let diaQcLocal = getSession("diamondQualityColorCombo");
    let csQcLocal = getSession("ColorStoneQualityColorCombo");
    let mtColorLocal = getSession("MetalColorCombo");

    const comboTasks = [];

    if (!mtTypeLocal || mtTypeLocal?.length === 0) {
      comboTasks.push(
        MetalTypeComboAPI(cookie)
          .then((res) => {
            if (res?.Data?.rd) {
              sessionStorage.setItem(
                "metalTypeCombo",
                JSON.stringify(res.Data.rd),
              );
              setMetalTypeCombo(res.Data.rd);
            }
          })
          .catch((err) => console.log("metalTypeCombo err", err)),
      );
    } else {
      setMetalTypeCombo(mtTypeLocal);
    }

    if (!diaQcLocal || diaQcLocal?.length === 0) {
      comboTasks.push(
        DiamondQualityColorComboAPI()
          .then((res) => {
            if (res?.Data?.rd) {
              sessionStorage.setItem(
                "diamondQualityColorCombo",
                JSON.stringify(res.Data.rd),
              );
              setDiaQcCombo(res.Data.rd);
            }
          })
          .catch((err) => console.log("diaQcCombo err", err)),
      );
    } else {
      setDiaQcCombo(diaQcLocal);
    }

    if (!csQcLocal || csQcLocal?.length === 0) {
      comboTasks.push(
        ColorStoneQualityColorComboAPI()
          .then((res) => {
            if (res?.Data?.rd) {
              sessionStorage.setItem(
                "ColorStoneQualityColorCombo",
                JSON.stringify(res.Data.rd),
              );
              setCsQcCombo(res.Data.rd);
            }
          })
          .catch((err) => console.log("csQcCombo err", err)),
      );
    } else {
      setCsQcCombo(csQcLocal);
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      comboTasks.push(
        MetalColorCombo(cookie)
          .then((res) => {
            if (res?.Data?.rd) {
              sessionStorage.setItem(
                "MetalColorCombo",
                JSON.stringify(res.Data.rd),
              );
              setMetalColorCombo(res.Data.rd);
            }
          })
          .catch((err) => console.log("metalColorCombo err", err)),
      );
    } else {
      setMetalColorCombo(mtColorLocal);
    }

    if (comboTasks.length > 0) {
      await Promise.allSettled(comboTasks);
    }
  };

  useEffect(() => {
    if (storeinit) setStoreInit(storeinit);
    if (loginUserDetail) setLoginData(loginUserDetail);
  }, [storeinit, loginUserDetail]);

  useEffect(() => {
    callAllApi();
  }, [storeInit]);

  function checkImageAvailability(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }

  const handleMetalWiseColorImgWithFlag = async (e) => {
    let mtColorLocal = getSession("MetalColorCombo");
    let mcArr;

    if (mtColorLocal?.length) {
      mcArr = mtColorLocal?.filter(
        (ele) => ele?.colorcode == e.target.value,
      )[0];
    }

    setMetalColor(e.target.value);
  };

  const ProdCardImageFunc = async () => {
    const storeInit = storeinit;
    const mtColorLocal = getSession("MetalColorCombo") || [];
    const imageVideoDetail = singleProd?.ImageVideoDetail;
    const pd = singleProd;

    if (!imageVideoDetail) {
      return;
    }

    let parsedData = [];
    try {
      parsedData =
        imageVideoDetail === "0" ? [] : JSON.parse(imageVideoDetail || "[]");
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    // Filter categorized media
    const normalImages = [],
      colorImages = [],
      normalVideos = [],
      colorVideos = [];
    parsedData.forEach((item) => {
      if (item?.TI === 1 && !item?.CN) normalImages.push(item);
      else if (item?.TI === 2 && item?.CN) colorImages.push(item);
      else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
      else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
    });

    const getMaxCountByColor = (list) => {
      return list.reduce((acc, curr) => {
        const color = curr.CN;
        acc[color] = (acc[color] || 0) + 1;
        return acc;
      }, {});
    };

    const maxColorCount = Math.max(
      ...Object.values(getMaxCountByColor(colorImages)),
      0,
    );
    const normalImageCount = normalImages.length
      ? Math.max(...normalImages.map((i) => i.Nm))
      : 0;

    // Get metal color code
    const mcArr = mtColorLocal.find(
      (ele) => ele.id === singleProd?.MetalColorid,
    );
    setSelectedMetalColor(mcArr?.colorcode);

    const buildImageURL = (i, isColor = false) => {
      const base = storeInit?.CDNDesignImageFol;
      const extension = isColor
        ? colorImages[i - 1]?.Ex
        : normalImages[i - 1]?.Ex;

      const imageUrl = isColor
        ? `${base}${pd.designno}~${i}~${mcArr?.colorcode}.${colorImages[i - 1]?.Ex}`
        : `${base}${pd.designno}~${i}.${normalImages[i - 1]?.Ex}`;

      return { imageUrl, extension };
    };

    const pdImgList = [];

    if (maxColorCount > 0) {
      // Asynchronously populate pdImgList with color images
      for (let i = 1; i <= maxColorCount; i++) {
        const colorImageUrl = buildImageURL(i, true);
        const isColorImageAvailable = await checkImageAvailability(
          colorImageUrl?.imageUrl,
        );

        // Only push the image if it is available
        if (isColorImageAvailable) {
          pdImgList.push(colorImageUrl);
        }
      }
    }

    // If no color image was added, push normal images
    if (pdImgList.length === 0 && normalImageCount > 0) {
      for (let i = 1; i <= normalImageCount; i++) {
        pdImgList.push(buildImageURL(i));
      }
    }

    // Now check if pdImgList is populated and set finalprodListimg after that
    let finalprodListimg = {};
    if (pdImgList.length > 0) {
      finalprodListimg = pdImgList[0];

      // Set the selected thumbnail image if we have a valid image
      if (Object.keys(finalprodListimg).length > 0) {
        setSelectedThumbImg({
          link: {
            imageUrl: finalprodListimg?.imageUrl,
            extension: finalprodListimg?.extension,
          },
          type: "img",
        });
      }
    } else {
      console.log("No images found, pdImgList is empty.");
    }

    if (pdImgList.length) {
      const thumbImagePath = pdImgList.map((url) => {
        const fileName = url?.imageUrl?.split("Design_Image/")[1];
        const thumbImageUrl = `${storeInit?.CDNDesignImageFolThumb}${fileName?.split(".")[0]}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });
      setPdThumbImg(thumbImagePath);
      setThumbImgIndex(0);
    } else {
      setThumbImgIndex();
    }

    // Video processing
    const buildVideoURL = (video, isColor = false) => {
      const base = storeInit?.CDNVPath;
      return isColor
        ? `${base}${pd.designno}~${video.Nm}~${video.CN}.${video.Ex}`
        : `${base}${pd.designno}~${video.Nm}.${video.Ex}`;
    };

    const pdvideoList = [
      ...colorVideos.map((v) => buildVideoURL(v, true)),
      ...normalVideos.map((v) => buildVideoURL(v)),
    ];

    setPdVideoArr(pdvideoList.length ? pdvideoList : []);

    if (
      finalprodListimg?.extension !== undefined &&
      finalprodListimg?.imageUrl !== imageNotFound
    ) {
      setPdLoadImage(false);
    } else if (Object.keys(finalprodListimg)?.length === 0) {
      setPdLoadImage(false);
    } else {
      setPdLoadImage(true);
    }
    setTimeout(() => {
      setMediaBuildDone(true);
    }, 1000);
    return finalprodListimg;
  };

  useEffect(() => {
    setPdLoadImage(true);
    ProdCardImageFunc();
  }, [singleProd, location, searchParams]);

  const handleMetalWiseColorImg = async (e) => {
    const selectedColorCode = e.target.value;
    const mtColorLocal = getSession("MetalColorCombo");
    const mcArr = mtColorLocal.find(
      (ele) => ele?.colorcode === selectedColorCode,
    );

    const prod = singleProd ?? singleProd1;
    const { designno, ImageExtension } = prod || {};
    const baseCDN = storeInit?.CDNDesignImageFol;
    const thumbCDN = storeInit?.CDNDesignImageFolThumb;

    setSelectedMetalColor(mcArr?.colorcode);
    setMetalColor(selectedColorCode);

    // Parse image/video data
    let parsedData = [];
    try {
      parsedData =
        prod?.ImageVideoDetail && prod.ImageVideoDetail !== "0"
          ? JSON.parse(prod.ImageVideoDetail)
          : [];
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    // Filter categorized media
    const normalImages = [],
      colorImages = [],
      normalVideos = [],
      colorVideos = [];
    parsedData.forEach((item) => {
      if (item?.TI === 1 && !item?.CN) normalImages.push(item);
      else if (item?.TI === 2 && item?.CN) colorImages.push(item);
      else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
      else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
    });

    // Filter color and normal images
    const colorImgs = parsedData.filter((ele) => ele?.CN && ele?.TI === 2);
    const normalImgs = parsedData.filter((ele) => !ele?.CN && ele?.TI === 1);

    const maxColorImgCount = Math.max(
      0,
      ...Object.values(
        colorImgs.reduce((acc, { CN }) => {
          acc[CN] = (acc[CN] || 0) + 1;
          return acc;
        }, {}),
      ),
    );

    const normalImageCount =
      normalImgs.length > 0
        ? Math.max(...normalImgs.map((item) => item.Nm))
        : 0;

    // Build image URLs
    const buildColorImageList = () =>
      Array.from({ length: maxColorImgCount }, (_, i) => {
        const extension = colorImages[i]?.Ex;
        const imageUrl = `${baseCDN}${designno}~${i + 1}~${mcArr?.colorcode}.${colorImages[i]?.Ex}`;
        return { imageUrl, extension };
      });

    const buildNormalImageList = () =>
      Array.from({ length: normalImageCount }, (_, i) => {
        const extension = normalImages[i]?.Ex;
        const imageUrl = `${baseCDN}${designno}~${i + 1}.${normalImages[i]?.Ex}`;

        return { imageUrl, extension };
      });

    let pdImgListCol = [];
    let pdImgList = [];
    let colorImagesAvailable = false;

    // Check color image availability dynamically
    if (colorImgs.length > 0) {
      const tempColorList = buildColorImageList().filter(Boolean);

      const checkImages =
        tempColorList.length > 3
          ? tempColorList.slice(0, 3) // Optional cap for performance
          : tempColorList;

      const availabilityChecks = await Promise.all(
        checkImages.map((url) => checkImageAvailability(url?.imageUrl)),
      );

      colorImagesAvailable = availabilityChecks.some(Boolean);
      if (colorImagesAvailable) {
        pdImgListCol = tempColorList;
      }
    }

    // Fallback to normal images if no color images are available
    if (!colorImagesAvailable && normalImgs.length > 0) {
      pdImgList = buildNormalImageList();
    }

    // Set images to UI
    if (colorImagesAvailable && pdImgListCol.length > 0) {
      const thumbImagePath = pdImgListCol.map((url) => {
        const fileName = url?.imageUrl.split("Design_Image/")[1]?.split(".")[0];
        const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });

      setPdThumbImg(thumbImagePath);

      const safeIndex =
        thumbImgIndex < pdImgListCol.length
          ? thumbImgIndex
          : pdImgListCol.length - 1;
      const mainImg = pdImgListCol[safeIndex];
      // setSelectedThumbImg({ link: mainImg, type: 'img' });
      setSelectedThumbImg({
        link: {
          imageUrl: mainImg?.imageUrl,
          extension: mainImg?.originalImageExtension,
        },
        type: "img",
      });
      setThumbImgIndex(safeIndex);

      const defaultMainImg = `${baseCDN}${designno}~${safeIndex + 1}~${mcArr?.colorcode}.${ImageExtension}`;
      setMetalWiseColorImg(defaultMainImg);
    } else if (pdImgList.length > 0) {
      const thumbImagePath = pdImgList.map((url) => {
        const fileName = url?.imageUrl
          ?.split("Design_Image/")[1]
          ?.split(".")[0];
        const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });

      setPdThumbImg(thumbImagePath);

      const safeIndex =
        thumbImgIndex < pdImgList.length
          ? thumbImgIndex
          : pdImgListCol.length - 1;
      const fallbackImg = pdImgList[safeIndex];
      setSelectedThumbImg({
        link: {
          imageUrl: fallbackImg?.imageUrl,
          extension: fallbackImg?.originalImageExtension,
        },
        type: "img",
      });
      setThumbImgIndex(safeIndex);
    }
  };

  useEffect(() => {
    let mtColorLocal = getSession("MetalColorCombo");
    let mcArr;

    if (mtColorLocal?.length) {
      mcArr = mtColorLocal?.filter(
        (ele) =>
          ele?.id == (singleProd?.MetalColorid ?? singleProd1?.MetalColorid),
      )[0];
    }

    setMetalColor(mcArr?.colorcode);
  }, [singleProd]);

  const getDynamicVideo = (designno, count, extension) => {
    const getDesignVideoFol =
      (storeInit?.DesignImageFol).slice(0, -13) + "video/";
    const url = `${getDesignVideoFol}${designno}_${count > 0 ? count : 1}.${extension}`;
    return url;
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleCustomChange = async (e, type) => {
    let size = sizeData;

    let targetMetalType = metalType;
    let targetMetalColor = metalColor;
    let targetSize = sizeData;

    if (type === "mt") {
      targetMetalType = e.target.value;
      setMetalType(e.target.value);
    }
    if (type === "mc") {
      targetMetalColor = e.target.value;
      setMetalColor(e.target.value);
    }
    if (type === "size") {
      targetSize = e.target.value;
      setSizeData(e.target.value);
      size = e.target.value;
    }

    // Normalize targetSize: treat empty / dash as empty string
    const normalizedTargetSize =
      targetSize === "-" || targetSize === "" || !targetSize ? "" : targetSize;

    // Find the matching article in rd1Data based on target customizations
    let matchedArticle = rd1Data?.find((r) => {
      const matchMetal =
        r.MetalType?.toUpperCase() === targetMetalType?.toUpperCase();
      const matchColor =
        r.MetalColor?.toUpperCase() === targetMetalColor?.toUpperCase();
      const rSize = r.Size === "-" || r.Size === "" || !r.Size ? "" : r.Size;
      return matchMetal && matchColor && rSize === normalizedTargetSize;
    });

    // Fallback 1: match metal and color only, grab first available size
    if (!matchedArticle) {
      matchedArticle = rd1Data?.find((r) => {
        const matchMetal =
          r.MetalType?.toUpperCase() === targetMetalType?.toUpperCase();
        const matchColor =
          r.MetalColor?.toUpperCase() === targetMetalColor?.toUpperCase();
        return matchMetal && matchColor;
      });
    }

    // Fallback 2: fallback to default / first article
    if (!matchedArticle) {
      matchedArticle =
        rd1Data?.find((r) => r.ArticleId === defaultArticleId) || rd1Data?.[0];
    }

    // Resolve stones for the matched article from rd2Data
    let diaQcVal = "0,0";
    let diaQcLabel = null;
    let csQcVal = "0,0";

    if (matchedArticle && rd2Data?.length) {
      const diaStone = rd2Data.find(
        (r) => r.ArticleId === matchedArticle.ArticleId && r.StoneTypeid === 1,
      );
      if (diaStone) {
        diaQcVal = `${diaStone.QualityId ?? 0},${diaStone.ColorId ?? 0}`;
        diaQcLabel = `${diaStone.Quality}-${diaStone.Color}`;
      }

      const csStone = rd2Data.find(
        (r) => r.ArticleId === matchedArticle.ArticleId && r.StoneTypeid === 2,
      );
      if (csStone) {
        csQcVal = `${csStone.QualityId ?? 0},${csStone.ColorId ?? 0}`;
      }
    }

    // Update defaultArticleId state to matched article's ID
    if (matchedArticle?.ArticleId) {
      setDefaultArticleId(matchedArticle.ArticleId);
    }

    const targetAutocode =
      matchedArticle?.autocode ||
      rd1Data?.[0]?.autocode ||
      singleProd?.autocode ||
      singleProd1?.autocode ||
      decodeUrl?.a ||
      "";
    const targetDesignNo =
      matchedArticle?.designno ||
      rd1Data?.[0]?.designno ||
      singleProd?.designno ||
      singleProd1?.designno ||
      decodeUrl?.b ||
      "";
    const activeArticleNo =
      matchedArticle?.ArticleNo ||
      decodeUrl?.ArticleNo ||
      singleProd?.ArticleNo ||
      "";

    setCustomizationDetail({
      ...matchedArticle,
      ArticleId: matchedArticle?.ArticleId,
      ArticleNo: activeArticleNo,
      autocode: targetAutocode,
      Metalid: matchedArticle?.MetalTypeId,
      MetalColorId: matchedArticle?.MetalColorId,
      MetalType: matchedArticle?.MetalType,
      MetalColor: matchedArticle?.MetalColor,
      DiaQCid: diaQcVal,
      DiaQCLabel: diaQcLabel,
      CsQCid: csQcVal,
      Size: matchedArticle?.Size,
      NetWeight: matchedArticle?.NetWeight,
    });

    let prod = {
      a: targetAutocode,
      b: targetDesignNo,
      ArticleNo: activeArticleNo,
    };

    let obj = {
      mt:
        matchedArticle?.MetalTypeId ||
        (loginUserDetail?.MetalId ?? storeinit?.MetalId),
      diaQc: diaQcVal,
      csQc: csQcVal,
    };

    setisPriceLoading(true);
    const res = await SingleArticleProdListAPI(
      prod,
      size ?? sizeData,
      obj,
      cookie,
    );
    if (res) {
      setSingleProd1(res?.pdList[0]);
    }

    if (res?.pdList?.length > 0) {
      setisPriceLoading(false);
    }
    setnetWTData(res?.pdList[0]);
    setDiaList(res?.pdResp?.rd3);
    setCsList(res?.pdResp?.rd4);
    if (res?.pdResp?.rd1?.length) {
      const mappedRd1 = res.pdResp.rd1.map(r => {
        const metalId = r.metaltypeid || r.MetalTypeId || r.Metalid;
        const metalColorId = r.metalcolorid || r.MetalColorId;
        const metalType = r.metal || r.metaltypename || r.MetalType || r.metalpurityname;
        const metalColor = r.metalcolorname || r.MetalColor;
        const netWeight = r.Nwt || r.NetWeight;
        return {
          ...r,
          ArticleId: r.ArticleId || r.id,
          MetalTypeId: metalId,
          Metalid: metalId,
          MetalColorId: metalColorId,
          MetalType: metalType,
          MetalColor: metalColor,
          NetWeight: netWeight,
        };
      });
      setRd1Data(mappedRd1);
    }
    if (res?.pdResp?.rd2?.length) {
      const mappedRd2 = res.pdResp.rd2.map(r => ({
        ...r,
        ArticleId: r.ArticleId || r.id,
      }));
      setRd2Data(mappedRd2);
    }
  };

  const SizeSorting = (SizeArr) => {
    let SizeSorted = SizeArr?.sort((a, b) => {
      const nameA = parseInt(a?.sizename?.slice(0, -2), 10);
      const nameB = parseInt(b?.sizename?.slice(0, -2), 10);

      return nameA - nameB;
    });

    return SizeSorted;
  };

  // Default ArticleId passed from product listing page via URL param
  const [defaultArticleId, setDefaultArticleId] = useState(() => {
    const id = initialDecodeUrl?.ArticleId;
    return id ? parseInt(id, 10) : null;
  });

  // Keep state sync if searchParams/url changes
  useEffect(() => {
    const id = initialDecodeUrl?.ArticleId;
    if (id) {
      setDefaultArticleId(parseInt(id, 10));
    }
  }, [initialDecodeUrl]);

  // Handler called when user confirms selection in the customizer drawer
  const handleCustomizerConfirm = async (
    articleId,
    size,
    diaQcKey,
    metalCombo,
  ) => {
    const mTypeLocal = getSession("metalTypeCombo") || [];
    const diaQcLocal = getSession("diamondQualityColorCombo") || [];
    const csQcLocal = getSession("ColorStoneQualityColorCombo") || [];

    // Find metal by MetalType name (mapped from combo)
    const metalArr = mTypeLocal.find(
      (ele) => ele?.metaltype === metalCombo?.MetalType,
    );

    // Resolve current dia/cs or keep existing selection
    const [dq, dc] = diaQcKey ? diaQcKey.split("-") : [null, null];
    const diaArr = diaQcLocal.find(
      (ele) =>
        ele?.Quality?.toUpperCase() === dq?.toUpperCase() &&
        ele?.color?.toUpperCase() === dc?.toUpperCase(),
    );

    const csArr = csQcLocal.find(
      (ele) =>
        ele?.Quality === selectCsQC?.split(",")[0] &&
        ele?.color === selectCsQC?.split(",")[1],
    );

    const newSize = size ?? sizeData;
    if (metalCombo?.MetalType) setMetalType(metalCombo.MetalType);
    if (size) setSizeData(size);

    // Update the defaultArticleId state so main page info fields update
    if (articleId) setDefaultArticleId(articleId);

    // Find selected article object from rd1Data to pass correct ArticleNo
    const selectedArticleObj =
      rd1Data?.find((r) => r.ArticleId === articleId) || rd1Data?.[0];
    const targetArticleNo =
      selectedArticleObj?.ArticleNo || singleProd?.ArticleNo || "";
    const targetAutocode =
      selectedArticleObj?.autocode ||
      rd1Data?.[0]?.autocode ||
      singleProd?.autocode ||
      "";

    setCustomizationDetail({
      ...selectedArticleObj,
      ArticleId: selectedArticleObj?.ArticleId,
      ArticleNo: targetArticleNo,
      autocode: targetAutocode,
      Metalid: selectedArticleObj?.MetalTypeId,
      MetalColorId: selectedArticleObj?.MetalColorId,
      MetalType: selectedArticleObj?.MetalType,
      MetalColor: selectedArticleObj?.MetalColor,
      DiaQCid: `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`,
      DiaQCLabel: diaArr ? `${diaArr.Quality}-${diaArr.color}` : null,
      CsQCid: `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`,
      Size: selectedArticleObj?.Size,
      NetWeight: selectedArticleObj?.NetWeight,
    });

    // No API call on customizer confirm — just update UI state with the selected combination
  };

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = Pako.deflate(uint8Array, { to: "string" });

      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const handleMoveToDetail = (productData, imageUrl) => {
    let loginInfo = loginUserDetail;

    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: loginInfo?.MetalId,
      d: loginInfo?.cmboDiaQCid,
      c: loginInfo?.cmboCSQCid,
      f: {},
      g: decodeUrl?.g,
      img:
        imageUrl ??
        `${storeinit?.CDNDesignImageFol}${productData?.designno}~1.${productData?.ImageExtension}`,
      mediaDet: productData?.ImageVideoDetail ?? "",
    };

    let encodeObj = compressAndEncode(JSON.stringify(obj));

    // Navigate(
    //   `/d/${productData?.TitleLine?.replace(/\s+/g, `_`)}${productData?.TitleLine?.length > 0 ? "_" : ""
    //   }${productData?.designno}?p=${encodeObj}`
    // );
    Navigate.push(
      `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`,
    );
    // step 1
    setSingleProd1({});
    setSingleProd({});
    setIsImageLoad(true);
    setWishListFlag(null);
  };

  const handleCartandWish = (e, ele, type) => {
    // console.log("event", e.target.checked, ele, type);
    let loginInfo = loginUserDetail;

    let prodObj = {
      StockId: ele?.StockId,
      // "autocode": ele?.autocode,
      // "Metalid": ele?.MetalPurityid,
      // "MetalColorId": ele?.MetalColorid,
      // "DiaQCid": loginInfo?.cmboDiaQCid,
      // "CsQCid": loginInfo?.cmboCSQCid,
      // "Size": ele?.Size,
      Unitcost: ele?.Amount,
      // "UnitCostWithmarkup": ele?.Amount,
      // "Remark": ""
    };

    if (e.target.checked == true) {
      CartAndWishListAPI(type, prodObj, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          if (type === "Cart") {
            broadcast(
              "UPDATE_CART_COUNT",
              cartC,
              prodObj?.autocode,
              "cart",
              true,
            );
          } else {
            broadcast(
              "UPDATE_WISH_COUNT",
              wishC,
              prodObj?.autocode,
              "wish",
              true,
            );
          }
        })
        .catch((err) => console.log("err", err));
    } else {
      RemoveCartAndWishAPI(type, ele?.StockId, cookie, true)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          if (type === "Cart") {
            broadcast(
              "UPDATE_CART_COUNT",
              cartC,
              prodObj?.autocode,
              "cart",
              false,
            );
          } else {
            broadcast(
              "UPDATE_WISH_COUNT",
              wishC,
              prodObj?.autocode,
              "wish",
              false,
            );
          }
        })
        .catch((err) => console.log("err", err));
    }

    if (type === "Cart") {
      setCartArr((prev) => ({
        ...prev,
        [ele?.StockId]: e.target.checked,
      }));
    }
  };

  const getCollectionId = singleProd?.Collectionid ?? singleProd1?.Collectionid;

  const getCollName = filterData
    ?.filter((item) => item?.Name === "Collection")
    ?.map((item) => {
      const options = JSON.parse(item?.options || "[]");
      const matchedOption = options.find(
        (option) => option.id === getCollectionId,
      );
      return matchedOption?.Name || null;
    })[0];

  const getImagesArr = pdThumbImg?.length > 0
    ? pdThumbImg?.map((item) => {
        const firstHalf = item?.thumbImageUrl?.split("/Design_Thumb")[0];
        const secondhalf = item?.thumbImageUrl
          ?.split("/Design_Thumb")[1]
          ?.split(".")[0];
        return `${firstHalf}${secondhalf}.${item?.originalImageExtension}`;
      })
    : (decodeUrl?.img ? [decodeUrl.img] : []);

  const derivedMediaBuildDone = mediaBuildDone || (decodeUrl?.img ? true : false);
  const derivedIsMediaReady = isMediaReady || (decodeUrl?.img ? true : false);

  useEffect(() => {
    if (!mediaBuildDone) return;
    const essentialDataReady =
      singleProd && Object.keys(singleProd).length > 0 && storeInit;

    if (!essentialDataReady) return;
    setIsMediaReady(true);
  }, [mediaBuildDone, singleProd, storeInit]);

  const HandleImageDialogOpen = (index) => {
    setSelectedImageIndex(index);
    setIsImageDialogOpen(true);
  };

  const HandleImageDialogClose = () => {
    setSelectedImageIndex(null);
    setIsImageDialogOpen(false);
  };

  useEffect(() => {
    if (lastSyncData && lastSyncData.autocode) {
      const { autocode, type, status } = lastSyncData;
      if (type === "cart") {
        setAddToCartFlag(status);
      } else if (type === "wish") {
        setWishListFlag(status);
      }
    }
  }, [lastSyncData]);

  if (loadingdata && !(decodeUrl?.b || decodeUrl?.title || decodeUrl?.a || decodeUrl?.img)) {
    return <DetailPageSkeleton />;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {!isDataFound ? (
        <Box
          sx={{
            color: "#000",
            pb: 6,
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              pt: { xs: 2, md: 4 },
              px: { sm: 2, xs: 1, md: 8 },
              width: "100%",
            }}
          >
            <DetailBreadcrumb
              searchParams={searchParams}
              singleProd={singleProd}
              singleProd1={singleProd1}
              loadingdata={loadingdata}
            />
            <Grid container spacing={{ xs: 1, md: 1 }}>
              <LeftSide
                loading={loadingdata}
                media={
                  [
                    ...getImagesArr?.map((item) => ({
                      type: "image",
                      src: item,
                    })),
                    ...pdVideoArr?.map((item) => ({
                      type: "video",
                      src: item,
                    })),
                  ] || null
                }
                isMediaReady={derivedIsMediaReady}
                mediaBuildDone={derivedMediaBuildDone}
                HandleImageDialogOpen={HandleImageDialogOpen}
              />
              <RightSide
                TitleLine={
                  formatTitleLine(singleProd?.TitleLine) &&
                  singleProd?.TitleLine
                }
                DesignNo={singleProd?.designno}
                collection={(singleProd ?? singleProd1)?.collection}
                description={
                  singleProd1?.description ?? singleProd?.description
                }
                singleProd={singleProd}
                singleProd1={singleProd1}
                metalType={metalType}
                metalColor={metalColor}
                storeInit={storeInit}
                diaQcCombo={diaQcCombo}
                diaList={diaList}
                selectDiaQc={selectDiaQc}
                SizeSorting={SizeSorting(SizeCombo?.rd)}
                handleCustomChange={handleCustomChange}
                SizeCombo={SizeCombo}
                sizeData={sizeData}
                metalTypeCombo={metalTypeCombo}
                metalColorCombo={metalColorCombo}
                handleMetalWiseColorImg={handleMetalWiseColorImg}
                handleMetalWiseColorImgWithFlag={
                  handleMetalWiseColorImgWithFlag
                }
                selectCsQC={selectCsQC}
                csList={csList}
                csQcCombo={csQcCombo}
                loginData={loginData}
                loadingdata={loadingdata}
                isPriceloading={isPriceloading}
                pdLoadImage={pdLoadImage}
                handleCart={handleCart}
                addToCardFlag={addToCardFlag}
                handleWishList={handleWishList}
                wishListFlag={wishListFlag}
                stockItemArr={stockItemArr}
                rd1={rd1Data}
                rd2={rd2Data}
                defaultArticleId={defaultArticleId}
                customizationDetail={customizationDetail}
                rd1CartMap={rd1CartMap}
                onCustomizerConfirm={handleCustomizerConfirm}
              />
            </Grid>
            <ExtraProductSections
              imgSrc={getImagesArr?.[0] || getImagesArr?.[1]}
              singleProd={singleProd}
              singleProd1={singleProd1}
              stockItemArr={stockItemArr}
            />

            {stockItemArr?.length > 0 &&
              stockItemArr?.[0]?.stat_code != 1005 &&
              storeInit?.IsStockWebsite === 1 && (
                <NewStockitem
                  stockItemArr={stockItemArr}
                  storeInit={storeInit}
                  loginInfo={loginData}
                  cartArr={cartArr}
                  check={storeInit?.IsPriceShow === 1}
                  handleCartandWish={handleCartandWish}
                />
              )}

            {storeInit?.IsProductDetailSimilarDesign == 1 &&
              SimilarBrandArr?.length > 0 &&
              SimilarBrandArr?.[0]?.stat_code != 1005 && (
                <RelatedProduct
                  SimilarBrandArr={SimilarBrandArr}
                  handleMoveToDetail={handleMoveToDetail}
                  storeInit={storeInit}
                  loginInfo={loginData}
                />
              )}

            {/* {storeInit?.IsProductDetailDesignSet === 1 &&
              designSetList?.length > 0 &&
              designSetList?.[0]?.stat_code != 1005 && (
                <DesignSet
                  designSetList={designSetList}
                  handleMoveToDetail={handleMoveToDetail}
                  imageNotFound={imageNotFound}
                  loginInfo={loginData}
                  storeInit={storeInit}
                />
              )} */}
          </Box>
          <PreviewDialog
            media={[
              ...getImagesArr?.map((item) => ({
                type: "image",
                src: item,
              })),
              ...pdVideoArr?.map((item) => ({
                type: "video",
                src: item,
              })),
            ]}
            onClose={HandleImageDialogClose}
            open={isImageDialogOpen}
            selectedIndex={SelectedImageIndex}
          />
        </Box>
      ) : (
        <>
          <div
            style={{
              height: "90vh",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
            className="elv_prodd_datanotfound"
          >
            Data not Found!!
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetail;
