"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useMediaQuery } from "@mui/material";
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
import { StockItemApi } from "@/app/(core)/utils/API/StockItemAPI/StockItemApi";
import { DesignSetListAPI } from "@/app/(core)/utils/API/DesignSetListAPI/DesignSetListAPI";
import { SaveLastViewDesign } from "@/app/(core)/utils/API/SaveLastViewDesign/SaveLastViewDesign";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
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

export function useProductDetail({ storeinit, searchParams, params }) {
  const { setCartCountNum, setWishCountNum, loginUserDetail } = useStore();

  const unwrappedSearchParams = (searchParams && typeof searchParams.then === "function")
    ? React.use(searchParams)
    : searchParams;

  const initialDecodeUrl = useMemo(() => {
    const rawP = unwrappedSearchParams?.p || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("p") : null);
    if (rawP) {
      const decompressed = decodeAndDecompress(rawP);
      if (decompressed) return decompressed;
    }
    const result = ParseAndDecodeSearchParams(unwrappedSearchParams);
    const navVal = result[0]?.split("=")[1];
    const decompressed = decodeAndDecompress(navVal);
    return decompressed;
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
      const loginInfo = getSession("loginUserDetail");
      const rawPrice = initialDecodeUrl?.price ?? initialDecodeUrl?.UnitCostWithMarkUp ?? initialDecodeUrl?.UnitCostWithmarkup ?? initialDecodeUrl?.p;
      const parsedPrice = rawPrice ? parseFloat(rawPrice) : 100;
      return {
        TitleLine: initialDecodeUrl.title || initialDecodeUrl.ArticleNo || initialDecodeUrl.b || "",
        Nwt: initialDecodeUrl.nwt ? parseFloat(initialDecodeUrl.nwt) : 0,
        NetWeight: initialDecodeUrl.nwt ? parseFloat(initialDecodeUrl.nwt) : 0,
        UnitCostWithMarkUp: parsedPrice,
        UnitCostWithmarkup: parsedPrice,
        TotalUnitCost: parsedPrice,
        ArticleNo: initialDecodeUrl.ArticleNo ?? "",
        designno: initialDecodeUrl.b ?? "",
        autocode: initialDecodeUrl.a ?? "",
        ImageExtension: "webp",
        ImageCount: 1,
        MetalColorid: initialDecodeUrl?.metalColorId ?? loginUserDetail?.MetalColorId ?? loginInfo?.MetalColorId,
        ImageVideoDetail: initialDecodeUrl.mediaDet ?? "0",
      };
    }
    return {};
  }, [initialDecodeUrl, hasPreHydratedData, loginUserDetail]);

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
  const [selectedMetalColor, setSelectedMetalColor] = useState(() => {
    if (initialDecodeUrl?.metalColorId) {
      const mtColorLocal = getSession("MetalColorCombo") || [];
      const matchedObj = mtColorLocal.find(
        (ele) => Number(ele.id) === Number(initialDecodeUrl.metalColorId)
      );
      return matchedObj?.colorcode || undefined;
    }
    return undefined;
  });
  const getBreadCrumData = getSession("breadcrumbData");
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaBuildDone, setMediaBuildDone] = useState(false);
  const [rd1Data, setRd1Data] = useState([]);
  const [rd2Data, setRd2Data] = useState([]);
  const [customizationDetail, setCustomizationDetail] = useState(null);
  const [rd1CartMap, setRd1CartMap] = useState({});
  const Navigate = useNextRouterLikeRR();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [SelectedImageIndex, setSelectedImageIndex] = useState(null);
  const { broadcast } = useBroadcaster();
  const lastSyncData = useSyncDataStore((s) => s.syncData);
  const [defaultArticleId, setDefaultArticleId] = useState(null);

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
        let sessionColorCode = null;
        if (initialDecodeUrl?.img && initialDecodeUrl.img.includes("~")) {
          const parts = initialDecodeUrl.img.split("~");
          if (parts.length >= 3) {
            const rawColor = parts[2].split(".")[0];
            if (rawColor) sessionColorCode = rawColor;
          }
        }
        if (!sessionColorCode && initialDecodeUrl?.m) {
          const mtColorLocal = getSession("MetalColorCombo") || [];
          const matchedObj = mtColorLocal.find(ele => Number(ele.id) === Number(initialDecodeUrl.m));
          if (matchedObj?.colorcode) sessionColorCode = matchedObj.colorcode;
        }
        if (!sessionColorCode && initialDecodeUrl?.metalColorId) {
          const mtColorLocal = getSession("MetalColorCombo") || [];
          const matchedObj = mtColorLocal.find(ele => Number(ele.id) === Number(initialDecodeUrl.metalColorId));
          if (matchedObj?.colorcode) sessionColorCode = matchedObj.colorcode;
        }

        const { b, l, count } = initialDecodeUrl;
        if (!initialDecodeUrl.mediaDet || initialDecodeUrl.mediaDet === "0") {
          if (b) {
            const cdnThumb = storeinit?.CDNDesignImageFolThumb || storeInit?.CDNDesignImageFolThumb;
            const cdnFol = storeinit?.CDNDesignImageFol || storeInit?.CDNDesignImageFol;
            if (cdnThumb) {
              const numCount = (count && Number(count) > 0) ? Number(count) : 1;
              const ext = l || "webp";
              const hasColorInImg = Boolean(
                initialDecodeUrl?.img &&
                sessionColorCode &&
                initialDecodeUrl.img.toLowerCase().includes(`~${sessionColorCode.toLowerCase()}.`)
              );
              const thumbPath = Array.from({ length: numCount }, (_, i) => {
                const suffix = (sessionColorCode && hasColorInImg)
                  ? `${b}~${i + 1}~${sessionColorCode}`
                  : `${b}~${i + 1}`;
                return {
                  thumbImageUrl: `${cdnThumb}${suffix}.jpg`,
                  originalImageExtension: ext,
                };
              });
              setPdThumbImg(thumbPath);
              setThumbImgIndex(0);

              const mainSuffix = (sessionColorCode && hasColorInImg)
                ? `${b}~1~${sessionColorCode}`
                : `${b}~1`;
              const mainUrl = initialDecodeUrl?.img || `${cdnFol}${mainSuffix}.${ext}`;
              if (!imageSrc) setImageSrc(mainUrl);
            }
          }
          return;
        }

        const mediaDet = initialDecodeUrl.mediaDet;
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

        const colorCode = sessionColorCode;

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
  }, [maxWidth1400px, maxWidth1000px]);

  const getDynamicImages = (designno, extension) => {
    const getDesignImageFol = storeInit?.CDNDesignImageFol;
    const url = `${getDesignImageFol}${designno}~1.${extension}`;
    return url;
  };

  const hasValidData = singleProd1 && Object.keys(singleProd1).length > 0;
  const product = hasValidData ? singleProd1 : singleProd;

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
    if (!pdVideoArr) return;

    const noColorVideos = pdVideoArr.filter((url) => {
      const parts = url.split("~");
      return parts.length === 2;
    });

    if (!selectedMetalColor) {
      setFilteredVideos(noColorVideos);
      return;
    }

    const colorMatched = pdVideoArr.filter((url) => {
      const parts = url.split("~");
      const colorPart = parts[2]?.split(".")[0];
      return colorPart?.toLowerCase().trim() === selectedMetalColor.toLowerCase().trim();
    });

    if (colorMatched.length > 0) {
      setFilteredVideos(colorMatched);
    } else {
      setFilteredVideos(noColorVideos);
    }
  }, [pdVideoArr, selectedMetalColor]);

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
  }, [location, unwrappedSearchParams]);

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
        mtTypeLocal?.find((ele) => Number(ele?.Metalid) === Number(decodeobj?.m))
          ?.Metalid ?? decodeobj?.m;
    } else {
      metalArr = decodeobj?.m;
    }

    if (diaQcLocal?.length) {
      diaArr =
        diaQcLocal?.find(
          (ele) =>
            ele?.QualityId == decodeobj?.d?.split(",")[0] &&
            ele?.ColorId == decodeobj?.d?.split(",")[1],
        ) ?? decodeobj?.d;
    } else {
      diaArr = decodeobj?.d;
    }

    if (csQcLocal?.length) {
      csArr =
        csQcLocal?.find((ele) => {
          return (
            ele?.QualityId == decodeobj?.c?.split(",")[0] &&
            ele?.ColorId == decodeobj?.c?.split(",")[1]
          );
        }) ?? decodeobj?.c;
    } else {
      csArr = decodeobj?.c;
    }

    if (!(decodeobj?.b || decodeobj?.title || decodeobj?.a || decodeobj?.img)) {
      setloadingdata(true);
    }
    const FetchProductData = async () => {
      const resolvedMetalId =
        metalArr ||
        decodeobj?.m ||
        logininfoInside?.MetalId ||
        storeinitInside?.MetalId ||
        storeinitInside?.cmboMetalTypeid ||
        storeinit?.MetalId ||
        storeinit?.cmboMetalTypeid;

      const resolvedDiaQc =
        (typeof diaArr === "string" ? diaArr : (diaArr ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}` : null)) ||
        decodeobj?.d ||
        logininfoInside?.cmboDiaQCid ||
        storeinitInside?.cmboDiaQCid ||
        storeinit?.cmboDiaQCid;

      const resolvedCsQc =
        (typeof csArr === "string" ? csArr : (csArr ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}` : null)) ||
        decodeobj?.c ||
        logininfoInside?.cmboCSQCid ||
        storeinitInside?.cmboCSQCid ||
        storeinit?.cmboCSQCid;

      let obj = {
        mt: resolvedMetalId,
        diaQc: resolvedDiaQc,
        csQc: resolvedCsQc,
      };

      if (decodeobj?.title) {
        const loginInfo = getSession("loginUserDetail");
        const initialProd = {
          TitleLine: decodeobj.title,
          Nwt: decodeobj.nwt ? parseFloat(decodeobj.nwt) : 0,
          UnitCostWithMarkUp: decodeobj.price ? parseFloat(decodeobj.price) : 0,
          ArticleNo: decodeobj.ArticleNo ?? "",
          designno: decodeobj.b ?? "",
          autocode: decodeobj.a ?? "",
          ImageExtension: "webp",
          ImageCount: 1,
          MetalColorid: decodeobj?.metalColorId ?? loginUserDetail?.MetalColorId ?? loginInfo?.MetalColorId,
          ImageVideoDetail: decodeobj.mediaDet ?? "0",
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
          setSingleProd1(prod);
          setnetWTData(prod);

          if (decodeobj?.metalColorId) {
            const mtColorLocal = getSession("MetalColorCombo") || [];
            const matchedColorObj = mtColorLocal.find(
              (ele) => Number(ele.id) === Number(decodeobj.metalColorId)
            );
            if (matchedColorObj?.colorcode) {
              handleMetalWiseColorImg(matchedColorObj.colorcode);
            }
          }

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
              const unitCost = r.UnitCostWithmarkup || r.UnitCostWithMarkUp || r.TotalUnitCost || r.UnitCost || r.UnitCostWithMarkUpAmount || prod?.UnitCostWithmarkup || prod?.UnitCostWithMarkUp || prod?.TotalUnitCost;
              return {
                ...r,
                ArticleId: r.ArticleId || r.id,
                MetalTypeId: metalId,
                Metalid: metalId,
                MetalColorId: metalColorId,
                MetalType: metalType,
                MetalColor: metalColor,
                NetWeight: netWeight,
                UnitCostWithmarkup: unitCost,
                UnitCostWithMarkUp: unitCost,
                TotalUnitCost: unitCost,
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
              ...prod,
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
              NetWeight: initialArticle.NetWeight || prod?.NetWeight || prod?.Nwt,
              UnitCostWithmarkup: prod?.UnitCostWithmarkup || prod?.UnitCostWithMarkUp || prod?.TotalUnitCost || initialArticle?.UnitCostWithmarkup || initialArticle?.UnitCostWithMarkUp || initialArticle?.TotalUnitCost || initialMockProd?.UnitCostWithMarkUp || 100,
              UnitCostWithMarkUp: prod?.UnitCostWithmarkup || prod?.UnitCostWithMarkUp || prod?.TotalUnitCost || initialArticle?.UnitCostWithmarkup || initialArticle?.UnitCostWithMarkUp || initialArticle?.TotalUnitCost || initialMockProd?.UnitCostWithMarkUp || 100,
              TotalUnitCost: prod?.TotalUnitCost || prod?.UnitCostWithMarkUp || prod?.UnitCostWithmarkup || initialArticle?.TotalUnitCost || initialArticle?.UnitCostWithMarkUp || initialMockProd?.UnitCostWithMarkUp || 100,
            });
          }

          if (prod) {
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

            if (storeinitInside?.IsStockWebsite === 1 && prod?.autocode) {
              StockItemApi(prod.autocode, "stockitem", cookie)
                .then((res) => setStockItemArr(res?.Data?.rd))
                .catch((err) => console.log("stockItemErr", err));
            }

            if (
              storeinitInside?.IsProductDetailSimilarDesign === 1 &&
              prod?.autocode
            ) {
              StockItemApi(prod.autocode, "similarbrand", obj, cookie)
                .then((res) => setSimilarBrandArr(res?.Data?.rd))
                .catch((err) => console.log("similarbrandErr", err));
            }

            if (prod?.autocode && prod?.designno) {
              SaveLastViewDesign(cookie, prod.autocode, prod.designno)
                .then((res) => {
                  setSaveLastView(res?.Data?.rd);
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

  const handleMetalWiseColorImgWithFlag = async (e) => {
    handleMetalWiseColorImg(e);
  };

  const ProdCardImageFunc = async () => {
    const storeInitObj = storeinit || storeInit;
    const pd = (singleProd1 && Object.keys(singleProd1).length > 0) ? singleProd1 : singleProd;
    const imageVideoDetail = pd?.ImageVideoDetail;

    if (!imageVideoDetail) return;

    let parsedData = [];
    try {
      parsedData = imageVideoDetail === "0" ? [] : (typeof imageVideoDetail === "string" ? JSON.parse(imageVideoDetail) : imageVideoDetail);
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    const normalImages = parsedData.filter(item => Number(item?.TI) === 1);
    const colorImages = parsedData.filter(item => Number(item?.TI) === 2 && item?.CN);
    const normalVideos = parsedData.filter(item => Number(item?.TI) === 3);
    const colorVideos = parsedData.filter(item => Number(item?.TI) === 4 && item?.CN);

    const mtColorLocal = getSession("MetalColorCombo") || [];
    const targetColorObj = mtColorLocal.find(ele => Number(ele.id) === Number(pd?.MetalColorid));
    const targetCN = selectedMetalColor || pd?.MetalColor || targetColorObj?.colorcode;

    let matchedColorImgs = [];
    if (colorImages.length > 0 && targetCN) {
      const targetLower = targetCN.toLowerCase().trim();
      matchedColorImgs = colorImages.filter(item => {
        const cnLower = (item.CN || "").toLowerCase().trim();
        return cnLower === targetLower || cnLower.includes(targetLower) || targetLower.includes(cnLower);
      });
    }

    let pdImgList = [];
    if (matchedColorImgs.length > 0) {
      matchedColorImgs.forEach(item => {
        pdImgList.push({
          imageUrl: `${storeInitObj?.CDNDesignImageFol}${pd.designno}~${item.Nm}~${item.CN}.${item.Ex || "webp"}`,
          extension: item.Ex || "webp",
          cn: item.CN
        });
      });
    } else if (normalImages.length > 0) {
      normalImages.forEach(item => {
        pdImgList.push({
          imageUrl: `${storeInitObj?.CDNDesignImageFol}${pd.designno}~${item.Nm}.${item.Ex || "webp"}`,
          extension: item.Ex || "webp",
          cn: ""
        });
      });
    }

    let finalprodListimg = {};
    if (pdImgList.length > 0) {
      finalprodListimg = pdImgList[0];
      setSelectedThumbImg({
        link: {
          imageUrl: finalprodListimg?.imageUrl,
          extension: finalprodListimg?.extension,
        },
        type: "img",
      });

      const thumbImagePath = pdImgList.map(item => ({
        thumbImageUrl: item.cn
          ? `${storeInitObj?.CDNDesignImageFolThumb}${pd.designno}~${item.imageUrl.split("~")[1]}~${item.cn}.jpg`
          : `${storeInitObj?.CDNDesignImageFolThumb}${pd.designno}~${item.imageUrl.split("~")[1]?.split(".")[0]}.jpg`,
        originalImageExtension: item.extension
      }));
      setPdThumbImg(thumbImagePath);
      setThumbImgIndex(0);
    } else {
      setThumbImgIndex();
    }

    const buildVideoURL = (video, isColor = false) => {
      const base = storeInitObj?.CDNVPath;
      return isColor
        ? `${base}${pd.designno}~${video.Nm}~${video.CN}.${video.Ex}`
        : `${base}${pd.designno}~${video.Nm}.${video.Ex}`;
    };

    const pdvideoList = [
      ...colorVideos.map((v) => buildVideoURL(v, true)),
      ...normalVideos.map((v) => buildVideoURL(v)),
    ];
    setPdVideoArr(pdvideoList.length ? pdvideoList : []);

    setPdLoadImage(false);
    setMediaBuildDone(true);
    return finalprodListimg;
  };

  useEffect(() => {
    setPdLoadImage(true);
    ProdCardImageFunc();
  }, [singleProd, location, unwrappedSearchParams]);

  const handleMetalWiseColorImg = async (colorInput) => {
    let selectedColor = "";
    if (typeof colorInput === "string") {
      selectedColor = colorInput;
    } else if (colorInput?.target?.value) {
      selectedColor = colorInput.target.value;
    }

    const prod = (singleProd1 && Object.keys(singleProd1).length > 0) ? singleProd1 : singleProd;
    const { designno } = prod || {};
    const baseCDN = storeInit?.CDNDesignImageFol || storeinit?.CDNDesignImageFol;
    const thumbCDN = storeInit?.CDNDesignImageFolThumb || storeinit?.CDNDesignImageFolThumb;

    if (selectedColor) {
      setSelectedMetalColor(selectedColor);
      setMetalColor(selectedColor);
    }

    let parsedData = [];
    try {
      parsedData =
        prod?.ImageVideoDetail && prod.ImageVideoDetail !== "0"
          ? (typeof prod.ImageVideoDetail === "string" ? JSON.parse(prod.ImageVideoDetail) : prod.ImageVideoDetail)
          : [];
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    const colorImages = parsedData.filter(item => Number(item?.TI) === 2 && item?.CN);
    const normalImages = parsedData.filter(item => Number(item?.TI) === 1);

    let matchedColorImgs = [];
    if (selectedColor && colorImages.length > 0) {
      const targetLower = selectedColor.toLowerCase().trim();
      matchedColorImgs = colorImages.filter(item => {
        const cnLower = (item.CN || "").toLowerCase().trim();
        return cnLower === targetLower || cnLower.includes(targetLower) || targetLower.includes(cnLower);
      });
    }

    let pdImgList = [];
    if (matchedColorImgs.length > 0) {
      matchedColorImgs.forEach(item => {
        pdImgList.push({
          imageUrl: `${baseCDN}${designno}~${item.Nm}~${item.CN}.${item.Ex || "webp"}`,
          extension: item.Ex || "webp",
          cn: item.CN
        });
      });
    } else if (normalImages.length > 0) {
      normalImages.forEach(item => {
        pdImgList.push({
          imageUrl: `${baseCDN}${designno}~${item.Nm}.${item.Ex || "webp"}`,
          extension: item.Ex || "webp",
          cn: ""
        });
      });
    }

    if (pdImgList.length > 0) {
      const thumbImagePath = pdImgList.map(item => ({
        thumbImageUrl: item.cn
          ? `${thumbCDN}${designno}~${item.imageUrl.split("~")[1]}~${item.cn}.jpg`
          : `${thumbCDN}${designno}~${item.imageUrl.split("~")[1]?.split(".")[0]}.jpg`,
        originalImageExtension: item.extension
      }));

      setPdThumbImg(thumbImagePath);

      const safeIndex = (thumbImgIndex && thumbImgIndex < pdImgList.length) ? thumbImgIndex : 0;
      const mainImg = pdImgList[safeIndex];
      setSelectedThumbImg({
        link: {
          imageUrl: mainImg?.imageUrl,
          extension: mainImg?.extension,
        },
        type: "img",
      });
      setThumbImgIndex(safeIndex);
      setMetalWiseColorImg(mainImg?.imageUrl);
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

  const handleCustomChange = async (e, type) => {
    let size = sizeData;
    let targetMetalType = metalType;
    let targetMetalColor = metalColor;
    let targetSize = sizeData;

    if (type === "all" && e) {
      targetMetalType = e.MetalType || e.metaltype || e.MetalPurity || metalType;
      targetMetalColor = e.MetalColor || e.metalcolorname || e.colorcode || metalColor;
      targetSize = e.Size || sizeData;
      if (targetMetalType) setMetalType(targetMetalType);
      if (targetMetalColor) setMetalColor(targetMetalColor);
      if (targetSize) {
        setSizeData(targetSize);
        size = targetSize;
      }
    } else {
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
    }

    const normalizedTargetSize =
      targetSize === "-" || targetSize === "" || !targetSize ? "" : targetSize;

    let matchedArticle = rd1Data?.find((r) => {
      const matchMetal =
        r.MetalType?.toUpperCase() === targetMetalType?.toUpperCase();
      const matchColor =
        r.MetalColor?.toUpperCase() === targetMetalColor?.toUpperCase();
      const rSize = r.Size === "-" || r.Size === "" || !r.Size ? "" : r.Size;
      return matchMetal && matchColor && rSize === normalizedTargetSize;
    });

    if (!matchedArticle) {
      matchedArticle = rd1Data?.find((r) => {
        const matchMetal =
          r.MetalType?.toUpperCase() === targetMetalType?.toUpperCase();
        const matchColor =
          r.MetalColor?.toUpperCase() === targetMetalColor?.toUpperCase();
        return matchMetal && matchColor;
      });
    }

    if (!matchedArticle) {
      matchedArticle =
        rd1Data?.find((r) => r.ArticleId === defaultArticleId) || rd1Data?.[0];
    }

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

    const currentPrice =
      customizationDetail?.UnitCostWithmarkup ||
      customizationDetail?.UnitCostWithMarkUp ||
      customizationDetail?.TotalUnitCost ||
      singleProd1?.UnitCostWithmarkup ||
      singleProd1?.UnitCostWithMarkUp ||
      singleProd?.UnitCostWithMarkUp;

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
      NetWeight: matchedArticle?.NetWeight || singleProd?.NetWeight || singleProd?.Nwt,
      UnitCostWithmarkup: currentPrice,
      UnitCostWithMarkUp: currentPrice,
      TotalUnitCost: currentPrice,
    });

    let prodObj = {
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
      prodObj,
      size ?? sizeData,
      obj,
      cookie,
    );
    if (res && res?.pdList?.[0]) {
      const updatedProd = res.pdList[0];
      const newPrice =
        updatedProd.UnitCostWithmarkup ||
        updatedProd.UnitCostWithMarkUp ||
        updatedProd.TotalUnitCost ||
        currentPrice;

      const syncedProd = {
        ...updatedProd,
        UnitCostWithmarkup: newPrice,
        UnitCostWithMarkUp: newPrice,
        TotalUnitCost: newPrice,
      };

      setSingleProd1(syncedProd);
      setSingleProd((prev) => ({ ...prev, ...syncedProd }));
      setnetWTData(syncedProd);
      setCustomizationDetail((prev) => ({
        ...prev,
        ...syncedProd,
      }));
    }

    const chosenColor = matchedArticle?.MetalColor || matchedArticle?.metalcolorname || matchedArticle?.MetalColorName || targetMetalColor;
    if (chosenColor) {
      handleMetalWiseColorImg(chosenColor);
    }

    if (res?.pdList?.length > 0) {
      setisPriceLoading(false);
    }
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

  const handleCustomizerConfirm = async (
    articleId,
    size,
    diaQcKey,
    metalCombo,
  ) => {
    let targetArticleId = articleId;
    let targetSize = size;
    let targetDiaQcKey = diaQcKey;
    let targetMetalCombo = metalCombo;

    if (typeof articleId === "object" && articleId !== null) {
      targetArticleId = articleId.ArticleId || articleId.id;
      targetSize = articleId.Size || size;
      targetDiaQcKey = articleId.DiaQCLabel || diaQcKey;
      targetMetalCombo = articleId;
    }

    const selectedArticleObj =
      rd1Data?.find((r) => r.ArticleId === targetArticleId) ||
      rd1Data?.find(
        (r) =>
          r.MetalTypeId === targetMetalCombo?.MetalTypeId &&
          r.MetalColorId === targetMetalCombo?.MetalColorId,
      ) ||
      rd1Data?.[0];

    const mType = targetMetalCombo?.MetalType || selectedArticleObj?.MetalType;
    const mColor = targetMetalCombo?.MetalColor || selectedArticleObj?.MetalColor;
    const mSize = targetSize || selectedArticleObj?.Size || sizeData;

    if (mType) setMetalType(mType);
    if (mColor) setMetalColor(mColor);
    if (mSize) setSizeData(mSize);
    if (targetArticleId) setDefaultArticleId(targetArticleId);

    const [dq, dc] = targetDiaQcKey ? targetDiaQcKey.split("-") : [null, null];
    const diaArr = diaQcCombo?.find(
      (ele) =>
        ele?.Quality?.toUpperCase() === dq?.toUpperCase() &&
        ele?.color?.toUpperCase() === dc?.toUpperCase(),
    );

    const diaQcVal = diaArr ? `${diaArr.QualityId ?? 0},${diaArr.ColorId ?? 0}` : "0,0";

    const targetAutocode =
      selectedArticleObj?.autocode ||
      rd1Data?.[0]?.autocode ||
      singleProd?.autocode ||
      singleProd1?.autocode ||
      decodeUrl?.a ||
      "";
    const targetDesignNo =
      selectedArticleObj?.designno ||
      rd1Data?.[0]?.designno ||
      singleProd?.designno ||
      singleProd1?.designno ||
      decodeUrl?.b ||
      "";
    const activeArticleNo =
      selectedArticleObj?.ArticleNo ||
      decodeUrl?.ArticleNo ||
      singleProd?.ArticleNo ||
      "";

    const articlePrice =
      selectedArticleObj?.UnitCostWithmarkup ||
      selectedArticleObj?.UnitCostWithMarkUp ||
      selectedArticleObj?.TotalUnitCost ||
      customizationDetail?.UnitCostWithmarkup ||
      singleProd1?.UnitCostWithmarkup ||
      singleProd?.UnitCostWithMarkUp;

    setCustomizationDetail({
      ...selectedArticleObj,
      ArticleId: selectedArticleObj?.ArticleId || targetArticleId,
      ArticleNo: activeArticleNo,
      autocode: targetAutocode,
      Metalid: selectedArticleObj?.MetalTypeId || targetMetalCombo?.MetalTypeId,
      MetalColorId: selectedArticleObj?.MetalColorId || targetMetalCombo?.MetalColorId,
      MetalType: mType,
      MetalColor: mColor,
      DiaQCid: diaQcVal,
      DiaQCLabel: targetDiaQcKey,
      Size: mSize,
      NetWeight: selectedArticleObj?.NetWeight || singleProd?.NetWeight || singleProd?.Nwt,
      UnitCostWithmarkup: articlePrice,
      UnitCostWithMarkUp: articlePrice,
      TotalUnitCost: articlePrice,
    });

    let prodObj = {
      a: targetAutocode,
      b: targetDesignNo,
      ArticleNo: activeArticleNo,
    };

    let obj = {
      mt:
        selectedArticleObj?.MetalTypeId ||
        targetMetalCombo?.MetalTypeId ||
        (loginUserDetail?.MetalId ?? storeinit?.MetalId),
      diaQc: diaQcVal,
      csQc: selectCsQC || "0,0",
    };

    setisPriceLoading(true);
    const res = await SingleArticleProdListAPI(
      prodObj,
      mSize ?? sizeData,
      obj,
      cookie,
    );
    if (res && res?.pdList?.[0]) {
      const updatedProd = res.pdList[0];
      const newPrice =
        updatedProd.UnitCostWithmarkup ||
        updatedProd.UnitCostWithMarkUp ||
        updatedProd.TotalUnitCost ||
        articlePrice;

      const syncedProd = {
        ...updatedProd,
        UnitCostWithmarkup: newPrice,
        UnitCostWithMarkUp: newPrice,
        TotalUnitCost: newPrice,
      };

      setSingleProd1(syncedProd);
      setSingleProd((prev) => ({ ...prev, ...syncedProd }));
      setnetWTData(syncedProd);
      setCustomizationDetail((prev) => ({
        ...prev,
        ...syncedProd,
      }));
    }

    const chosenColor = mColor || selectedArticleObj?.MetalColor || selectedArticleObj?.metalcolorname;
    if (chosenColor) {
      handleMetalWiseColorImg(chosenColor);
    }

    setisPriceLoading(false);
  };

  const activeArticle = customizationDetail || rd1Data?.[0] || null;

  const derivedIsMediaReady = mediaBuildDone || (pdThumbImg?.length > 0 && selectedThumbImg?.link?.imageUrl);
  const derivedMediaBuildDone = mediaBuildDone || (pdThumbImg?.length > 0 && selectedThumbImg?.link?.imageUrl);

  return {
    initialDecodeUrl,
    hasPreHydratedData,
    initialMockProd,
    maxWidth1400,
    maxWidth1000,
    decodeUrl,
    storeInit,
    loginData,
    sizeData,
    setSizeData,
    singleProd,
    singleProd1,
    product,
    diaList,
    csList,
    netWTData,
    SizeCombo,
    metalTypeCombo,
    metalType,
    setMetalType,
    metalColor,
    setMetalColor,
    selectDiaQc,
    setSelectDiaQc,
    showtDiaQc,
    diaQcCombo,
    csQcCombo,
    selectCsQC,
    setSelectCsQC,
    metalWiseColorImg,
    metalColorCombo,
    isPriceloading,
    selectedThumbImg,
    setSelectedThumbImg,
    pdThumbImg,
    thumbImgIndex,
    setThumbImgIndex,
    pdVideoArr,
    filteredVideos,
    addToCardFlag,
    wishListFlag,
    isDataFound,
    pdLoadImage,
    saveLastView,
    imageSrc,
    setImageSrc,
    showPlaceholder,
    imageRefs,
    handleMouseMove,
    handleMouseLeave,
    selectedMetalColor,
    setSelectedMetalColor,
    isMediaReady,
    mediaBuildDone,
    derivedIsMediaReady,
    derivedMediaBuildDone,
    rd1Data,
    rd2Data,
    customizationDetail,
    rd1CartMap,
    isImageDialogOpen,
    setIsImageDialogOpen,
    SelectedImageIndex,
    setSelectedImageIndex,
    loadingdata,
    SimilarBrandArr,
    designSetList,
    stockItemArr,
    cartArr,
    setCartArr,
    productSchema,
    isExpanded,
    toggleText,
    isClamped,
    descriptionRef,
    defaultArticleId,
    activeArticle,
    handleCart,
    handleWishList,
    handleCustomChange,
    handleCustomizerConfirm,
    handleMetalWiseColorImg,
    handleMetalWiseColorImgWithFlag,
    ProdCardImageFunc,
    cookie,
    Navigate,
  };
}

export default useProductDetail;
