'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ProductDetail.modul.scss'
import Cookies from 'js-cookie'
import { Box, Grid, useMediaQuery, Accordion, AccordionDetails, AccordionSummary, Checkbox, Divider, FormControlLabel, Skeleton, Typography } from '@mui/material';
import Pako from 'pako';
import { SingleProdListAPI } from '@/app/(core)/utils/API/SingleProdListAPI/SingleProdListAPI';
import { getSizeData } from '@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI';
import { MetalTypeComboAPI } from '@/app/(core)/utils/API/Combo/MetalTypeComboAPI';
import { DiamondQualityColorComboAPI } from '@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI';
import { MetalColorCombo } from '@/app/(core)/utils/API/Combo/MetalColorCombo';
import { ColorStoneQualityColorComboAPI } from '@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI';
import { CartAndWishListAPI } from '@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI';
import { RemoveCartAndWishAPI } from '@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI';
import { formatRedirectTitleLine, formatTitleLine } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import RelatedProduct from './RelatedProduct/RelatedProduct';
import { StockItemApi } from '@/app/(core)/utils/API/StockItemAPI/StockItemApi';
import { DesignSetListAPI } from '@/app/(core)/utils/API/DesignSetListAPI/DesignSetListAPI';
import DesignSet from './DesignSet/DesignSet';
import NewStockitem from './InstockProduct/NewStockitem';
import { SaveLastViewDesign } from '@/app/(core)/utils/API/SaveLastViewDesign/SaveLastViewDesign';
import useGlobalPreventSave from '@/app/(core)/utils/Glob_Functions/useGlobalPreventSave';
import LeftSide from './New/LeftSide';
import RightSide from './New/RightSide';
import PreviewDialog from './New/PreviewDialog';
import ProductDetailsSection from './New/ProductDetailsSection';
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useSyncDataStore } from "@/app/(core)/hooks/useStore";
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useImageZoom } from '@/app/(core)/hooks/UseImageZoom';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { usePathname } from 'next/navigation';
import { ParseAndDecodeSearchParams } from '@/app/(core)/utils/GlobalFunctions/Parser';
import { getSession } from '@/app/(core)/utils/FetchSessionData';
import { decodeAndDecompress } from "@/app/(core)/utils/seo/seo-utils";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IoIosPlayCircle } from "react-icons/io";

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const imageNotFound = '/image-not-found.jpg';
const noImageFound = imageNotFound;

const ProductDetail = ({ storeinit,
  searchParams,
  params
}) => {

  const { setCartCountNum, setWishCountNum, loginUserDetail } = useStore();
  const [maxWidth1400, setMaxWidth1400] = useState(false);
  const [maxWidth1000, setMaxWidth1000] = useState(false);
  const [decodeUrl, setDecodeUrl] = useState({})
  const [storeInit, setStoreInit] = useState({});
  const [loginData, setLoginData] = useState({});
  const [sizeData, setSizeData] = useState();
  const [singleProd, setSingleProd] = useState({});
  const [singleProd1, setSingleProd1] = useState({});
  const [diaList, setDiaList] = useState([]);
  const [csList, setCsList] = useState([]);
  const [netWTData, setnetWTData] = useState([])
  const [SizeCombo, setSizeCombo] = useState([]);
  const [metalTypeCombo, setMetalTypeCombo] = useState([])
  const [metalType, setMetalType] = useState();
  const [isImageload, setIsImageLoad] = useState(true);
  const [IIIisImageload, setIIIIsImageLoad] = useState(false);
  const [metalColor, setMetalColor] = useState();
  const [selectDiaQc, setSelectDiaQc] = useState();
  const [showtDiaQc, setShowDiaQc] = useState();
  const [diaQcCombo, setDiaQcCombo] = useState([])
  const [csQcCombo, setCsQcCombo] = useState([])
  const [selectCsQC, setSelectCsQC] = useState();
  const [metalWiseColorImg, setMetalWiseColorImg] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [isPriceloading, setisPriceLoading] = useState(false);
  const [selectedThumbImg, setSelectedThumbImg] = useState({})
  const [pdThumbImg, setPdThumbImg] = useState([]);
  const [thumbImgIndex, setThumbImgIndex] = useState()
  const [pdVideoArr, setPdVideoArr] = useState([]);
  const [addToCardFlag, setAddToCartFlag] = useState(null);
  const [wishListFlag, setWishListFlag] = useState(null);
  const [isDataFound, setIsDataFound] = useState(false)
  const [pdLoadImage, setPdLoadImage] = useState(false);
  const location = usePathname();
  const [saveLastView, setSaveLastView] = useState();
  const [imageSrc, setImageSrc] = useState();
  const [filterData, setFilterData] = useState([]);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const { imageRefs, handleMouseMove, handleMouseLeave } = useImageZoom(2.2);
  const [selectedMetalColor, setSelectedMetalColor] = useState();
  const getBreadCrumData = getSession("breadcrumbData");
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaBuildDone, setMediaBuildDone] = useState(false);
  const Navigate = useNextRouterLikeRR();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [SelectedImageIndex, setSelectedImageIndex] = useState(null)
  const { broadcast } = useBroadcaster(); // Get the broadcaster
  const lastSyncData = useSyncDataStore((s) => s.syncData);
  const [prodLoading, setProdLoading] = useState(false);
  const [selectMtType, setSelectMtType] = useState();
  const [loginInfo, setLoginInfo] = useState();
  const formatter = new Intl.NumberFormat("en-IN");
  const imgRef = useRef(null);
  const initialDecodeUrl = useMemo(() => {
    const result = ParseAndDecodeSearchParams(searchParams);
    const navVal = result[0]?.split("=")[1];
    return decodeAndDecompress(navVal);
  }, [searchParams]);

  useGlobalPreventSave();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlaceholder(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsImageLoad(false);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Adjust the threshold as needed
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  let cookie = Cookies.get('visiterId')

  const [loadingdata, setloadingdata] = useState(true);
  const [SimilarBrandArr, setSimilarBrandArr] = useState([]);
  const [designSetList, setDesignSetList] = useState();
  const [stockItemArr, setStockItemArr] = useState([]);
  const [cartArr, setCartArr] = useState({});

  let maxWidth1400pxAndMinWidth1000px = useMediaQuery('(max-width: 1400px) and (min-width: 1000px)');
  let maxWidth1400px = useMediaQuery('(max-width:1400px)')
  let maxWidth1000px = useMediaQuery('(max-width:1000px)')
  useEffect(() => {
    const handleMax1400px = () => {
      if (maxWidth1400pxAndMinWidth1000px) {
        setMaxWidth1400(true)
      }
      else {
        setMaxWidth1400(false)
      }
    }

    const handleMax1000px = () => {
      if (maxWidth1000px) {
        setMaxWidth1000(true)
        setMaxWidth1400(false)
      }
      else {
        setMaxWidth1000(false)
      }
    }

    handleMax1400px();
    handleMax1000px();

    // const getDiamonddata = sessionStorage.getItem

  }, [maxWidth1400px, maxWidth1000px])

  const getDynamicImages = (designno, extension) => {
    const getDesignImageFol = storeInit?.CDNDesignImageFol;
    const url = `${getDesignImageFol}${designno}~1.${extension}`;
    return url;
  }

  const hasValidData = singleProd1 && Object.keys(singleProd1).length > 0;
  const product = hasValidData ? singleProd1 : singleProd;

  // Dynamic Product Schema for Rich Results (Price, Availability, etc.)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product?.TitleLine || product?.designno,
    "image": pdThumbImg?.map(img => img.thumbImageUrl) || [],
    "description": product?.description || "High-quality jewelry",
    "sku": product?.designno,
    "brand": {
      "@type": "Brand",
      "name": storeInit?.BrowserTitle || "Jewelry Store"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": loginData?.CurrencyCode || storeInit?.CurrencyCode || "USD",
      "price": product?.UnitCostWithMarkUp || 0,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
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
    setIsExpanded(prevState => !prevState);
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

    window.addEventListener('resize', checkTextOverflow);
    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [descriptionText, descriptionRef])

  useEffect(() => {
    setIsClamped(false);
    setIsExpanded(false);
  }, [location?.key])

  const mTypeLocal = getSession("metalTypeCombo");
  const diaQcLocal = getSession("diamondQualityColorCombo");
  const csQcLocal = getSession("ColorStoneQualityColorCombo");
  const mtColorLocal = getSession("MetalColorCombo");

  useEffect(() => {
    if (metalTypeCombo.length) {
      const mtType = metalTypeCombo.find(ele => ele.Metalid === singleProd?.MetalPurityid)?.metaltype;
      setMetalType(mtType);
    }
    if (metalColorCombo.length) {
      const getCurrentMetalColor = mtColorLocal.find((ele) => ele?.id === singleProd?.MetalColorid)?.colorcode;
      setMetalColor(getCurrentMetalColor);

    }
  }, [singleProd])

  // useEffect(() => {
  //   const isInCart = singleProd?.IsInCart === 0 ? false : true;
  //   setAddToCartFlag(isInCart);
  // }, [singleProd])

  useEffect(() => {
    const activeProd = (singleProd1 && Object.keys(singleProd1).length > 0)
      ? singleProd1
      : singleProd;

    if (activeProd && activeProd.autocode) {
      setAddToCartFlag(activeProd.IsInCart === 1);

    } else {
      setAddToCartFlag(null);
    }
  }, [singleProd, singleProd1]);

  const handleCart = async (cartFlag) => {
    const metal =
      metalTypeCombo?.find((ele) => {
        return ele?.metaltype == metalType
      }) ?? metalTypeCombo;

    const dia =
      diaQcCombo?.find((ele) => {
        return ele?.Quality == selectDiaQc.split(",")[0] &&
          ele?.color == selectDiaQc.split(",")[1]
      }) ?? diaQcCombo;

    const cs =
      csQcCombo?.find((ele) => {
        return ele?.Quality == selectCsQC.split(",")[0] &&
          ele?.color == selectCsQC.split(",")[1]
      }) ?? csQcCombo;

    const mcArr =
      metalColorCombo?.find((ele) => {
        return ele?.metalcolorname == metalColor
      }) ?? metalColorCombo;

    const prodObj = {
      autocode: singleProd?.autocode,
      Metalid: metal?.Metalid,
      MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
      DiaQCid: `${dia?.QualityId ?? 0},${dia?.ColorId ?? 0}`,
      CsQCid: `${cs?.QualityId ?? 0},${cs?.ColorId ?? 0}`,
      Size: sizeData ?? singleProd?.DefaultSize,
      Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
      markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
      UnitCostWithmarkup: singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
      Remark: "",
      Metal_Cost: singleProd?.Metal_Cost ?? singleProd1?.Metal_Cost,
      Labour_Cost: singleProd?.Labour_Cost ?? singleProd1?.Labour_Cost,
      Diamond_Cost: singleProd?.Diamond_Cost ?? singleProd1?.Diamond_Cost,
      Diamond_SettingCost: singleProd?.Diamond_SettingCost ?? singleProd1?.Diamond_SettingCost,
      ColorStone_Cost: singleProd?.ColorStone_Cost ?? singleProd1?.ColorStone_Cost,
      ColorStone_SettingCost: singleProd?.ColorStone_SettingCost ?? singleProd1?.ColorStone_SettingCost,
      Misc_Cost: singleProd?.Misc_Cost ?? singleProd1?.Misc_Cost,
      Misc_SettingCost: singleProd?.Misc_SettingCost ?? singleProd1?.Misc_SettingCost,
      Other_Cost: singleProd?.Other_Cost ?? singleProd1?.Other_Cost,
      SolPrice: singleProd?.SolPric ?? singleProd1?.SolPrice
    }

    if (cartFlag) {
      let res = await CartAndWishListAPI("Cart", prodObj, cookie);
      if (res) {
        try {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          broadcast('UPDATE_CART_COUNT', cartC, prodObj?.autocode, "cart", true);
          // broadcast('UPDATE_WISH_COUNT', wishC, prodObj?.autocode ,"wish", true);
        } catch (error) {
          console.log("err", error)
        }
        setAddToCartFlag(cartFlag);
      }
    }
    else {
      let res1 = await RemoveCartAndWishAPI("Cart", singleProd?.autocode, cookie);
      if (res1) {
        try {
          let cartC = res1?.Data?.rd[0]?.Cartlistcount;
          let wishC = res1?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          broadcast('UPDATE_CART_COUNT', cartC, prodObj?.autocode, "cart", false);
          // broadcast('UPDATE_WISH_COUNT', wishC, prodObj?.autocode ,"wish", false);
        } catch (error) {
          console.log("err", error);
        }
        setAddToCartFlag(cartFlag);
      }
    }
  }

  const handleWishList = async (e, elv) => {
    setWishListFlag(e?.target?.checked);

    let storeinitInside = storeinit;
    let logininfoInside = loginUserDetail;
    setLoginInfo(logininfoInside);

    let metal = metalTypeCombo?.filter((ele) => ele?.metaltype == metalType);

    let dia = diaQcCombo?.filter(
      (ele) =>
        ele?.Quality == selectDiaQc.split(",")[0] &&
        ele?.color == selectDiaQc.split(",")[1]
    );

    let cs = csQcCombo?.filter(
      (ele) =>
        ele?.Quality == selectCsQC.split(",")[0] &&
        ele?.color == selectCsQC.split(",")[1]
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
      autocode: singleProd?.autocode,
      Metalid: metal?.length
        ? metal[0]?.Metalid
        : logininfoInside?.MetalId ?? storeinitInside?.MetalId,
      MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
      DiaQCid: dia?.length
        ? `${dia[0]?.QualityId},${dia[0]?.ColorId}`
        : logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid,
      CsQCid: cs?.length
        ? `${cs[0]?.QualityId},${cs[0]?.ColorId}`
        : logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid,
      Size: sizeData ?? singleProd1?.DefaultSize ?? singleProd?.DefaultSize,
      Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
      markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
      UnitCostWithmarkup:
        singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
      Remark: "",
      Metal_Cost: singleProd?.Metal_Cost ?? singleProd1?.Metal_Cost,
      Labour_Cost: singleProd?.Labour_Cost ?? singleProd1?.Labour_Cost,
      Diamond_Cost: singleProd?.Diamond_Cost ?? singleProd1?.Diamond_Cost,
      Diamond_SettingCost: singleProd?.Diamond_SettingCost ?? singleProd1?.Diamond_SettingCost,
      ColorStone_Cost: singleProd?.ColorStone_Cost ?? singleProd1?.ColorStone_Cost,
      ColorStone_SettingCost: singleProd?.ColorStone_SettingCost ?? singleProd1?.ColorStone_SettingCost,
      Misc_Cost: singleProd?.Misc_Cost ?? singleProd1?.Misc_Cost,
      Misc_SettingCost: singleProd?.Misc_SettingCost ?? singleProd1?.Misc_SettingCost,
      Other_Cost: singleProd?.Other_Cost ?? singleProd1?.Other_Cost,
      SolPrice: singleProd?.SolPric ?? singleProd1?.SolPrice

    };

    if (e.target.checked === true) {
      let res = await CartAndWishListAPI("Wish", prodObj, cookie);
      if (res) {
        try {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          //  broadcast('UPDATE_CART_COUNT', cartC , prodObj?.autocode ,"cart", true );
          broadcast('UPDATE_WISH_COUNT', wishC, prodObj?.autocode, "wish", true);
        } catch (error) {
          console.log("err", error)
        }
      }
    }
    else {
      let res1 = await RemoveCartAndWishAPI("Wish", singleProd?.autocode, cookie);
      if (res1) {
        try {
          let cartC = res1?.Data?.rd[0]?.Cartlistcount;
          let wishC = res1?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          //  broadcast('UPDATE_CART_COUNT', cartC , prodObj?.autocode ,"cart", false );
          broadcast('UPDATE_WISH_COUNT', wishC, prodObj?.autocode, "wish", false);
        } catch (error) {
          console.log("err", error);
        }
      }
    }
  }



  useEffect(() => {
    let decodeobj = initialDecodeUrl;

    let mtTypeLocal = getSession("metalTypeCombo");

    let diaQcLocal = getSession("diamondQualityColorCombo");

    let csQcLocal = getSession("ColorStoneQualityColorCombo");


    setTimeout(() => {
      if (decodeUrl) {
        let metalArr
        let diaArr
        let csArr

        let storeinitInside = storeinit;
        let logininfoInside = loginUserDetail;


        if (mtTypeLocal?.length) {
          metalArr =
            mtTypeLocal?.filter((ele) => ele?.Metalid == (decodeobj?.m ? decodeobj?.m : (logininfoInside?.MetalId ?? storeinitInside?.MetalId)))[0]
        }

        if (diaQcLocal?.length) {
          diaArr =
            diaQcLocal?.filter(
              (ele) =>
                ele?.QualityId == (decodeobj?.d ? decodeobj?.d?.split(",")[0] : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid).split(",")[0]) &&
                ele?.ColorId == (decodeobj?.d ? decodeobj?.d?.split(",")[1] : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid).split(",")[1])
            )[0]
        }

        if (csQcLocal?.length) {
          csArr =
            csQcLocal?.filter(
              (ele) =>
                ele?.QualityId == (decodeobj?.c ? decodeobj?.c?.split(",")[0] : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid).split(",")[0]) &&
                ele?.ColorId == (decodeobj?.c ? decodeobj?.c?.split(",")[1] : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid).split(",")[1])
            )[0]
        }

        setMetalType(metalArr?.metaltype);
        setSelectMtType(metalArr?.metaltype)

        setSelectDiaQc(`${diaArr?.Quality},${diaArr?.color}`);

        setSelectCsQC(`${csArr?.Quality},${csArr?.color}`);

      }
    }, 500)
  }, [singleProd])

  useEffect(() => {
    try {
      if (selectedThumbImg == undefined) return;

      if (selectedThumbImg) {
        setImageSrc(selectedThumbImg?.link?.imageUrl);
      } else {
        // Set a default image if no thumbnail is selected
        setImageSrc(pdVideoArr?.length > 0 ? noImageFound : 'p.png');
      }
    } catch (error) {
      console.log("Error in fetching image", error)
    }

  }, [selectedThumbImg, pdVideoArr]);

  const fallbackImg = `${storeInit?.CDNDesignImageFol}${singleProd?.designno}~1.${singleProd?.ImageExtension}`

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
      decodeobj.g = { g: [["", ""], ["", "", ""]] };
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
        mtTypeLocal?.filter(
          (ele) => ele?.Metalid == decodeobj?.m
        )[0]?.Metalid ?? decodeobj?.m;
    }

    if (diaQcLocal) {
      diaArr =
        diaQcLocal?.filter(
          (ele) =>
            ele?.QualityId == decodeobj?.d?.split(",")[0] &&
            ele?.ColorId == decodeobj?.d?.split(",")[1]
        )[0] ?? `${decodeobj?.d?.split(",")[0]},${decodeobj?.d?.split(",")[1]}`;
    }

    if (csQcLocal) {
      csArr =
        csQcLocal?.filter(
          (ele) => {
            return ele?.QualityId == decodeobj?.c?.split(",")[0] &&
              ele?.ColorId == decodeobj?.c?.split(",")[1];
          }
        )[0] ?? `${decodeobj?.c?.split(",")[0]},${decodeobj?.c?.split(",")[1]}`;
    }

    setloadingdata(true);
    const FetchProductData = async () => {

      let obj1 = {
        mt: logininfoInside?.MetalId ?? storeinitInside?.MetalId,
        diaQc: diaArr
          ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`
          : logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid,
        csQc: csArr
          ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`
          : logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid,
      };

      let obj = {
        mt: metalArr
          ? metalArr
          : logininfoInside?.MetalId ?? storeinitInside?.MetalId,
        diaQc: diaArr
          ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`
          : logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid,
        csQc: csArr
          ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`
          : logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid,
      };


      setisPriceLoading(true);
      setProdLoading(true)

      // step 4 
      setSingleProd1({})
      setSingleProd({})
      await SingleProdListAPI(decodeobj, sizeData, obj, cookie)
        .then(async (res) => {
          if (res) {
            setSingleProd(res?.pdList[0]);

            if (res?.pdList?.length > 0) {
              setisPriceLoading(false);
              setloadingdata(false);
              setProdLoading(false);
            }

            if (!res?.pdList[0]) {
              setisPriceLoading(false);
              setIsDataFound(true);
              setProdLoading(false)
            }
            else {
              setIsDataFound(false)
            }

            setDiaList(res?.pdResp?.rd3);
            setCsList(res?.pdResp?.rd4);

            let prod = res?.pdList[0];

            let resp = res;
            if (resp) {
              await getSizeData(resp?.pdList[0], cookie)
                .then((sizeRes) => {
                  setSizeCombo(sizeRes?.Data);

                  let initialsize = (
                    (prod && prod.DefaultSize !== "")
                      ? prod.DefaultSize
                      : (
                        (sizeRes?.Data?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename === undefined)
                          ? sizeRes?.Data?.rd?.[0]?.sizename
                          : sizeRes?.Data?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename
                      )
                  );
                  setSizeData(initialsize);
                })
                .catch((err) => console.log("SizeErr", err));

              if (storeinitInside?.IsStockWebsite === 1) {
                await StockItemApi(resp?.pdList[0]?.autocode, "stockitem", cookie).then((res) => {
                  setStockItemArr(res?.Data?.rd)
                }).catch((err) => console.log("stockItemErr", err))
              }

              if (storeinitInside?.IsProductDetailSimilarDesign === 1) {
                await StockItemApi(resp?.pdList[0]?.autocode, "similarbrand", obj, cookie).then((res) => {
                  setSimilarBrandArr(res?.Data?.rd)
                }).catch((err) => console.log("similarbrandErr", err))
              }

              if (storeinitInside?.IsProductDetailDesignSet === 1) {
                await DesignSetListAPI(obj1, resp?.pdList[0]?.designno, cookie).then((res) => {
                  setDesignSetList(res?.Data?.rd)
                }).catch((err) => console.log("designsetErr", err))
              }

              await SaveLastViewDesign(cookie, resp?.pdList[0]?.autocode, resp?.pdList[0]?.designno).then((res) => {
                setSaveLastView(res?.Data?.rd)
              }).catch((err) => console.log("saveLastView", err))

            }

          }

          return res;
        })
        .catch((err) => console.log("err", err));
    };

    FetchProductData();

    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [location?.key]);

  const callAllApi = async () => {
    if (!mTypeLocal || mTypeLocal?.length === 0) {
      const res = await MetalTypeComboAPI(cookie);
      if (res) {
        let data = res?.Data?.rd;
        sessionStorage.setItem("metalTypeCombo", JSON.stringify(data));
        setMetalTypeCombo(data);
      }
      else {
        console.log("error")
      }
    } else {
      setMetalTypeCombo(mTypeLocal);
    }

    if (!diaQcLocal || diaQcLocal?.length === 0) {
      const res = await DiamondQualityColorComboAPI();
      if (res) {
        let data = res?.Data?.rd;
        sessionStorage.setItem("diamondQualityColorCombo", JSON.stringify(data));
        setDiaQcCombo(data);
      }
      else {
        console.log("error")
      }
    } else {
      setDiaQcCombo(diaQcLocal)
    }

    if (!csQcLocal || csQcLocal?.length === 0) {
      const res = await ColorStoneQualityColorComboAPI();
      if (res) {
        let data = res?.Data?.rd;
        sessionStorage.setItem("ColorStoneQualityColorCombo", JSON.stringify(data));
        setCsQcCombo(data);
      }
      else {
        console.log("error")
      }
    } else {
      setCsQcCombo(csQcLocal)
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      const res = await MetalColorCombo(cookie);
      if (res) {
        let data = res?.Data?.rd;
        sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
        setMetalColorCombo(data);
      }
      else {
        console.log("error")
      }
    } else {
      setMetalColorCombo(mtColorLocal)
    }
  }

  useEffect(() => {
    if (storeinit) setStoreInit(storeinit);
    if (loginUserDetail) setLoginData(loginUserDetail);
    setLoginInfo(loginUserDetail);
  }, [storeinit, loginUserDetail]);

  useEffect(() => {
    callAllApi();
  }, [storeInit])

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
      mcArr =
        mtColorLocal?.filter(
          (ele) => ele?.colorcode == e.target.value
        )[0]
    }

    setMetalColor(e.target.value)

  }

  const ProdCardImageFunc = async () => {
    const storeInit = storeinit;
    const mtColorLocal = getSession("MetalColorCombo") || [];
    const imageVideoDetail = singleProd?.ImageVideoDetail;
    const pd = singleProd;

    let parsedData = [];
    try {
      parsedData = imageVideoDetail === "0" ? [] : JSON.parse(imageVideoDetail || "[]");
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    // Filter categorized media
    const normalImages = [], colorImages = [], normalVideos = [], colorVideos = [];
    parsedData.forEach(item => {
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

    const maxColorCount = Math.max(...Object.values(getMaxCountByColor(colorImages)), 0);
    const normalImageCount = normalImages.length ? Math.max(...normalImages.map(i => i.Nm)) : 0;

    // Get metal color code
    const mcArr = mtColorLocal.find(ele => ele.id === singleProd?.MetalColorid);
    setSelectedMetalColor(mcArr?.colorcode);

    const buildImageURL = (i, isColor = false) => {
      const base = storeInit?.CDNDesignImageFol;
      const extension = isColor ?
        colorImages[i - 1]?.Ex :
        normalImages[i - 1]?.Ex;

      const imageUrl = isColor ?
        `${base}${pd.designno}~${i}~${mcArr?.colorcode}.${colorImages[i - 1]?.Ex}`
        : `${base}${pd.designno}~${i}.${normalImages[i - 1]?.Ex}`;

      return { imageUrl, extension }
    };

    const pdImgList = [];

    if (maxColorCount > 0) {
      // Asynchronously populate pdImgList with color images
      for (let i = 1; i <= maxColorCount; i++) {
        const colorImageUrl = buildImageURL(i, true);
        const isColorImageAvailable = await checkImageAvailability(colorImageUrl?.imageUrl);

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
            extension: finalprodListimg?.extension
          },
          type: 'img'
        });
      }
    } else {
      console.log("No images found, pdImgList is empty.");
    }

    if (pdImgList.length) {
      const thumbImagePath = pdImgList.map(url => {
        const fileName = url?.imageUrl?.split("Design_Image/")[1];
        const thumbImageUrl = `${storeInit?.CDNDesignImageFolThumb}${fileName?.split('.')[0]}.jpg`;
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
      ...colorVideos.map(v => buildVideoURL(v, true)),
      ...normalVideos.map(v => buildVideoURL(v))
    ];

    setPdVideoArr(pdvideoList.length ? pdvideoList : []);


    if (finalprodListimg?.extension !== undefined && finalprodListimg?.imageUrl !== imageNotFound) {
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
    setPdLoadImage(true)
    ProdCardImageFunc()
  }, [singleProd, location?.key]);

  const handleMetalWiseColorImg = async (e) => {
    const selectedColorCode = e.target.value;
    const mtColorLocal = getSession("MetalColorCombo");
    const mcArr = mtColorLocal.find(ele => ele?.colorcode === selectedColorCode);

    const prod = singleProd ?? singleProd1;
    const { designno, ImageExtension } = prod || {};
    const baseCDN = storeInit?.CDNDesignImageFol;
    const thumbCDN = storeInit?.CDNDesignImageFolThumb;

    setSelectedMetalColor(mcArr?.colorcode);
    setMetalColor(selectedColorCode);

    // Parse image/video data
    let parsedData = [];
    try {
      parsedData = prod?.ImageVideoDetail && prod.ImageVideoDetail !== "0"
        ? JSON.parse(prod.ImageVideoDetail)
        : [];
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    // Filter categorized media
    const normalImages = [], colorImages = [], normalVideos = [], colorVideos = [];
    parsedData.forEach(item => {
      if (item?.TI === 1 && !item?.CN) normalImages.push(item);
      else if (item?.TI === 2 && item?.CN) colorImages.push(item);
      else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
      else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
    });

    // Filter color and normal images
    const colorImgs = parsedData.filter(ele => ele?.CN && ele?.TI === 2);
    const normalImgs = parsedData.filter(ele => !ele?.CN && ele?.TI === 1);

    const maxColorImgCount = Math.max(
      0,
      ...Object.values(
        colorImgs.reduce((acc, { CN }) => {
          acc[CN] = (acc[CN] || 0) + 1;
          return acc;
        }, {})
      )
    );

    const normalImageCount = normalImgs.length > 0
      ? Math.max(...normalImgs.map(item => item.Nm))
      : 0;

    // Build image URLs
    const buildColorImageList = () => Array.from({ length: maxColorImgCount }, (_, i) => {
      const extension = colorImages[i]?.Ex;
      const imageUrl = `${baseCDN}${designno}~${i + 1}~${mcArr?.colorcode}.${colorImages[i]?.Ex}`;
      return { imageUrl, extension }
    }
    );

    const buildNormalImageList = () => Array.from({ length: normalImageCount }, (_, i) => {
      const extension = normalImages[i]?.Ex;
      const imageUrl = `${baseCDN}${designno}~${i + 1}.${normalImages[i]?.Ex}`;

      return { imageUrl, extension }
    }
    );

    let pdImgListCol = [];
    let pdImgList = [];
    let colorImagesAvailable = false;

    // Check color image availability dynamically
    if (colorImgs.length > 0) {
      const tempColorList = buildColorImageList().filter(Boolean);

      const checkImages = tempColorList.length > 3
        ? tempColorList.slice(0, 3) // Optional cap for performance
        : tempColorList;

      const availabilityChecks = await Promise.all(
        checkImages.map(url => checkImageAvailability(url?.imageUrl))
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
      const thumbImagePath = pdImgListCol.map(url => {
        const fileName = url?.imageUrl.split('Design_Image/')[1]?.split('.')[0];
        const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });

      setPdThumbImg(thumbImagePath);

      const safeIndex = thumbImgIndex < pdImgListCol.length ? thumbImgIndex : pdImgListCol.length - 1;
      const mainImg = pdImgListCol[safeIndex];
      // setSelectedThumbImg({ link: mainImg, type: 'img' });
      setSelectedThumbImg({
        link: {
          imageUrl: mainImg?.imageUrl,
          extension: mainImg?.originalImageExtension
        },
        type: 'img'
      });
      setThumbImgIndex(safeIndex);

      const defaultMainImg = `${baseCDN}${designno}~${safeIndex + 1}~${mcArr?.colorcode}.${ImageExtension}`;
      setMetalWiseColorImg(defaultMainImg);

    } else if (pdImgList.length > 0) {
      const thumbImagePath = pdImgList.map(url => {
        const fileName = url?.imageUrl?.split('Design_Image/')[1]?.split('.')[0];
        const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });

      setPdThumbImg(thumbImagePath);

      const safeIndex = thumbImgIndex < pdImgList.length ? thumbImgIndex : pdImgListCol.length - 1;
      const fallbackImg = pdImgList[safeIndex];
      setSelectedThumbImg({
        link: {
          imageUrl: fallbackImg?.imageUrl,
          extension: fallbackImg?.originalImageExtension
        },
        type: 'img'
      });
      setThumbImgIndex(safeIndex);
    }
  };


  useEffect(() => {
    let mtColorLocal = getSession("MetalColorCombo");
    let mcArr;

    if (mtColorLocal?.length) {
      mcArr =
        mtColorLocal?.filter(
          (ele) => ele?.id == (singleProd?.MetalColorid ?? singleProd1?.MetalColorid)
        )[0]
    }

    setMetalColor(mcArr?.colorcode);

  }, [singleProd])

  const getDynamicVideo = (designno, count, extension) => {
    const getDesignVideoFol = (storeInit?.DesignImageFol).slice(0, -13) + "video/";
    const url = `${getDesignVideoFol}${designno}_${count > 0 ? count : 1}.${extension}`;
    return url;
  }

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleCustomChange = async (e, type) => {
    let metalArr;
    let diaArr;
    let csArr;
    let size;

    const mTypeLocal = getSession('metalTypeCombo') || [];
    const diaQcLocal = getSession('diamondQualityColorCombo') || [];
    const csQcLocal = getSession('ColorStoneQualityColorCombo') || [];

    if (type === 'mt') {
      metalArr = mTypeLocal?.find((ele) => {
        return ele?.metaltype === e.target.value
      })?.Metalid;
      setMetalType(e.target.value)
    }
    if (type === 'mc') {
      setMetalColor(e.target.value)
    }
    if (type === 'dt') {
      diaArr = diaQcLocal?.find((ele) => {
        return ele?.Quality === e.target.value?.split(',')[0] &&
          ele?.color === e.target.value?.split(",")[1]
      })
      setSelectDiaQc(e.target.value)
    }
    if (type === 'cs') {
      setSelectCsQC(e.target.value)
      csArr =
        csQcLocal?.filter(
          (ele) =>
            ele?.Quality == e.target.value?.split(",")[0] &&
            ele?.color == e.target.value?.split(",")[1]
        )[0]
    }
    if (type === "size") {
      setSizeData(e.target.value)
      size = e.target.value
    }

    if (metalArr == undefined) {
      metalArr =
        mTypeLocal?.filter(
          (ele) => ele?.metaltype == metalType
        )[0]?.Metalid
    }

    if (diaArr == undefined) {
      diaArr =
        diaQcLocal?.filter(
          (ele) =>
            ele?.Quality == selectDiaQc?.split(",")[0] &&
            ele?.color == selectDiaQc?.split(",")[1]
        )[0]
    }

    if (csArr == undefined) {
      csArr =
        csQcLocal?.filter(
          (ele) =>
            ele?.Quality == selectCsQC?.split(",")[0] &&
            ele?.color == selectCsQC?.split(",")[1]
        )[0]
    }

    let obj = {
      mt: metalArr ?? 0,
      diaQc: `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`,
      csQc: `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`
    }


    let prod = {
      a: singleProd?.autocode,
      b: singleProd?.designno
    }

    setisPriceLoading(true)
    const res = await SingleProdListAPI(prod, (size ?? sizeData), obj, cookie)
    if (res) {
      setSingleProd1(res?.pdList[0])
    }

    if (res?.pdList?.length > 0) {
      setisPriceLoading(false)
    }
    setnetWTData(res?.pdList[0])
    setDiaList(res?.pdResp?.rd3)
    setCsList(res?.pdResp?.rd4)
  }

  const SizeSorting = (SizeArr) => {

    let SizeSorted = SizeArr?.sort((a, b) => {
      const nameA = parseInt(a?.sizename?.slice(0, -2), 10);
      const nameB = parseInt(b?.sizename?.slice(0, -2), 10);

      return nameA - nameB;
    })

    return SizeSorted

  }

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
      img: imageUrl ?? `${storeinit?.CDNDesignImageFol}${productData?.designno}~1.${productData?.ImageExtension}`
    };

    let encodeObj = compressAndEncode(JSON.stringify(obj));

    // Navigate(
    //   `/d/${productData?.TitleLine?.replace(/\s+/g, `_`)}${productData?.TitleLine?.length > 0 ? "_" : ""
    //   }${productData?.designno}?p=${encodeObj}`
    // );
    Navigate.push(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);
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
            broadcast('UPDATE_CART_COUNT', cartC, prodObj?.autocode, "cart", true);
          } else {
            broadcast('UPDATE_WISH_COUNT', wishC, prodObj?.autocode, "wish", true)
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
            broadcast('UPDATE_CART_COUNT', cartC, prodObj?.autocode, "cart", false);
          } else {
            broadcast('UPDATE_WISH_COUNT', wishC, prodObj?.autocode, "wish", false)
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

  const getCollectionId = (singleProd?.Collectionid ?? singleProd1?.Collectionid);

  const getCollName = filterData
    ?.filter((item) => item?.Name === "Collection")
    ?.map((item) => {
      const options = JSON.parse(item?.options || "[]");
      const matchedOption = options.find((option) => option.id === getCollectionId);
      return matchedOption?.Name || null;
    })[0];

  const getImagesArr = pdThumbImg?.map((item) => {
    const firstHalf = item?.thumbImageUrl?.split("/Design_Thumb")[0];
    const secondhalf = item?.thumbImageUrl?.split("/Design_Thumb")[1]?.split('.')[0];
    return `${firstHalf}${secondhalf}.${item?.originalImageExtension}`
  })

  useEffect(() => {
    if (!mediaBuildDone) return;
    const essentialDataReady =
      singleProd &&
      Object.keys(singleProd).length > 0 &&
      storeInit;

    if (!essentialDataReady) return;
    setIsMediaReady(true);

  }, [
    mediaBuildDone,
    singleProd,
    storeInit
  ]);


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
        setAddToCartFlag(status)
      } else if (type === "wish") {
        setWishListFlag(status)
      }
    }
  }, [lastSyncData]);





  return (
    <>
      {isDataFound ?
        (<div
          style={{
            height: "70vh",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
          className="smr_prodd_datanotfound_ss"
        >
          Data not Found!!
        </div>)
        :
        (<div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "15px",
              visibility: "hidden"
            }}
          >
            <div className="breadCrumb_menu">
              <span style={{ textTransform: "uppercase" }}>
                {formatTitleLine(singleProd?.TitleLine) ? `${singleProd?.TitleLine} (${singleProd?.designno})` : singleProd?.designno}
              </span>
            </div>
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
            className="productDetail-container-flex"
          >

            <div className="dt_product-detail-container">
            <div
  className="srprodetail1"
  style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
>
  {isImageload && (
    <Skeleton
      sx={{ width: "95%", height: "550px", margin: "20px 0 0 0", position: 'absolute', zIndex: 1 }}
      className="dt_skeleton_main"
      variant="rounded"
    />
  )}

  {/* always mounted now — not gated behind isImageload */}
  <div
    className="dt_main_prod_img"
    style={{ opacity: isImageload ? 0 : 1, visibility: isImageload ? 'hidden' : 'visible' }}
  >
    {selectedThumbImg?.type == "img" ? (
      <img
        ref={imgRef}
        src={selectedThumbImg?.link?.imageUrl}
        alt={""}
        onLoad={() => setIsImageLoad(false)}
        onError={(e) => {
          e.target.src = imageNotFound;
          setIsImageLoad(false); // don't get stuck forever if the image 404s
        }}
        className="dt_prod_img"
      />
    ) : (
      <div className="dt_prod_video">
        <video
          src={selectedThumbImg?.link?.imageUrl}
          loop
          autoPlay
          style={{ width: "100%", objectFit: "cover", borderRadius: "4px" }}
          onLoadedData={() => setIsImageLoad(false)}  // videos never fired this before either
          onError={(e) => {
            e.target.poster = imageNotFound;
            setIsImageLoad(false);
          }}
        />
      </div>
    )}

    <div className="dt_thumb_prod_img">
      {(pdThumbImg?.length > 1 || pdVideoArr?.length > 0) &&
        pdThumbImg?.map((ele, i) => {
          const firstHalf = ele?.thumbImageUrl?.split("/Design_Thumb")[0];
          const secondhalf = ele?.thumbImageUrl?.split("/Design_Thumb")[1]?.split('.')[0];
          return (
            <img
              key={i}
              src={ele?.thumbImageUrl}
              alt={""}
              className="dt_prod_thumb_img"
              onClick={() => {
                setSelectedThumbImg({
                  link: {
                    imageUrl: `${firstHalf}${secondhalf}.${ele?.originalImageExtension}`,
                    extension: `${ele?.originalImageExtension}`,
                  },
                  type: "img",
                });
                setThumbImgIndex(i);
              }}
              onError={(e) => { e.target.src = imageNotFound }}
              // no onLoad here anymore — see note below
            />
          );
        })}
      {filteredVideos?.map((data, i) => (
        <div
          key={i}
          style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}
          onClick={() => setSelectedThumbImg({ link: { imageUrl: data, extension: "mp4" }, type: "vid" })}
        >
          <video
            src={data}
            autoPlay
            loop
            className="dt_prod_thumb_img"
            onError={(e) => { e.target.poster = imageNotFound }}
          />
          <IoIosPlayCircle className="Dt_palyCircle" />
        </div>
      ))}
    </div>
  </div>
</div>
              <div className="srprodetail2">
                <div className="srprodetail2-cont">
                  <p className="smilingProdutDetltTitle">{formatTitleLine(singleProd?.TitleLine) ? `${singleProd?.TitleLine ?? ""}` : ''}</p>

                  {storeInit?.IsPriceShow === 1 &&
                    (isPriceloading ? (
                      <Skeleton variant="rounded" width={240} height={30} />
                    ) : (
                      <div>
                        <p
                          style={{
                            color: "#7d7f85",
                            fontSize: "12px",
                            display: "flex",
                          }}
                        >
                          <span className="mainpriceDeatilPage">
                            {/* <text>From:</text>&nbsp; */}
                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                            &nbsp;
                            {formatter.format(
                              singleProd1?.UnitCostWithMarkUp ??
                              singleProd?.UnitCostWithMarkUp
                            )}
                          </span>
                        </p>
                      </div>
                    ))}

                  {/* {singleProd?.description &&
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p
                        style={{
                          color: "#7d7f85",
                          fontSize: "14px",
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          // whiteSpace: 'nowrap',
                          display: isExpanded ? 'block' : '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: isExpanded ? 'none' : 3,
                          height: isExpanded ? 'auto' : '4.5em',
                          margin: '0px'
                        }}
                      >
                        {singleProd?.description}
                      </p>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpand();
                        }}
                        style={{
                          color: 'black',
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </a>
                    </div>
                  } */}
                  {descriptionText?.length > 0 && (
                    <div className={`diam_prod_description ${isExpanded ? 'diam_show-more' : ''}`}>
                      <p className="diam_description-text" ref={descriptionRef}>
                        {descriptionText}
                      </p>

                      {(isClamped && !isExpanded) && ( // Show "Show More" only if text is clamped and not expanded
                        <span className="diam_toggle-text" onClick={toggleText}>
                          Show More
                        </span>
                      )}

                      {isExpanded && ( // Show "Show Less" when the description is expanded
                        <span className="diam_toggle-text" onClick={toggleText}>
                          Show Less
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      width: "100%",
                      marginTop: "12px",
                    }}
                    className="CustomiZationDeatilPageWeb"
                  >
                    {storeInit?.IsProductWebCustomization == 1 && (
                      <>
                        {metalTypeCombo?.length > 0 &&
                          storeInit?.IsMetalCustomization === 1 ? (
                          <div
                            style={{
                              display: "flex",
                              width: "95%",
                              marginBottom: "15px",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <label className="dt_menuItemTimeEleveDeatil">
                              METAL TYPE:
                            </label>
                            {singleProd?.IsMrpBase == 1 ? (
                              <span
                                style={{ fontSize: "13px", color: "rgb(66, 66, 66)" }}
                              >
                                {singleProd?.MetalTypePurity}
                              </span>
                            ) : (
                              <select
                                className="dt_menuitemSelectoreMain"
                                value={selectMtType}
                                onChange={(e) => handleCustomChange(e, "mt")}
                                style={{ marginLeft: "54px" }}
                              >
                                {metalTypeCombo.map((ele) => (
                                  <option key={ele?.Metalid} value={ele?.metaltype}>
                                    {ele?.metaltype}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : null}

                        {storeInit?.IsDiamondCustomization === 1 &&
                          diaQcCombo?.length > 0 &&
                          diaList?.length ? (
                          <div
                            style={{
                              display: "flex",
                              width: "95%",
                              marginBottom: "15px",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <label className="dt_menuItemTimeEleveDeatil">
                              DIAMOND :
                            </label>
                            {singleProd?.IsMrpBase == 1 ? (
                              <span
                                style={{ fontSize: "13px", color: "rgb(66, 66, 66)" }}
                              >
                                {singleProd?.DiaQuaCol}
                              </span>
                            ) : (
                              <select
                                className="dt_menuitemSelectoreMain"
                                value={selectDiaQc}
                                onChange={(e) => handleCustomChange(e, "dia")}
                                style={{ marginLeft: "64px" }}
                              >
                                {diaQcCombo.map((ele) => (
                                  <option
                                    key={ele?.QualityId}
                                    value={`${ele?.Quality},${ele?.color}`}
                                  >{`${ele?.Quality}, ${ele?.color}`}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : null}

                        {storeInit?.IsCsCustomization === 1 &&
                          selectCsQC?.length > 0 &&
                          csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              width: "95%",
                              marginBottom: "15px",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <label className="dt_menuItemTimeEleveDeatil">
                              COLOR STONE :
                            </label>
                            {singleProd?.IsMrpBase == 1 ? (
                              <span
                                style={{ fontSize: "13px", color: "rgb(66, 66, 66)" }}
                              >
                                {singleProd?.CsQuaCol}
                              </span>
                            ) : (
                              <select
                                className="dt_menuitemSelectoreMain"
                                value={selectCsQC}
                                onChange={(e) => handleCustomChange(e, "cs")}
                                style={{ marginLeft: "35px" }}
                              >
                                {csQcCombo.map((ele, i) => (
                                  <option
                                    key={i}
                                    value={`${ele?.Quality},${ele?.color}`}
                                  >{`${ele?.Quality},${ele?.color}`}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : null}

                        {metalColorCombo?.length > 0 &&
                          storeInit?.IsMetalTypeWithColor === 1 ? (
                          <div
                            style={{
                              display: "flex",
                              width: "95%",
                              marginBottom: "15px",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <label className="dt_menuItemTimeEleveDeatil">
                              METAL COLOR:
                            </label>
                            {singleProd?.IsMrpBase == 1 ? (
                              <span
                                style={{ fontSize: "13px", color: "rgb(66, 66, 66)" }}
                              >
                                {
                                  metalColorCombo?.filter(
                                    (ele) => ele?.id == singleProd?.MetalColorid
                                  )[0]?.metalcolorname
                                }
                              </span>
                            ) : (
                              <select
                                className="dt_menuitemSelectoreMain"
                                value={metalColor}
                                onChange={(e) => handleMetalWiseColorImg(e)}
                                style={{ marginLeft: "40px" }}
                              >
                                {metalColorCombo?.map((ele) => (
                                  <option key={ele?.id} value={ele?.colorcode}>
                                    {ele?.metalcolorname}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : null}

                        {(SizeCombo?.rd?.length > 0 && singleProd?.DefaultSize !== "") ? (
                          <div
                            style={{
                              display: "flex",
                              width: "95%",
                              marginBottom: "15px",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <label className="dt_menuItemTimeEleveDeatil">SIZE:</label>
                            {singleProd?.IsMrpBase == 1 ? (
                              <span
                                style={{ fontSize: "13px", color: "rgb(66, 66, 66)", marginBottom: '3px' }}
                              >
                                {singleProd?.DefaultSize}
                              </span>
                            ) : (
                              <select
                                className="dt_menuitemSelectoreMain"
                                value={sizeData}
                                onChange={(e) => handleCustomChange(e, "sz")}
                                style={{ marginLeft: "109px" }}
                              >
                                {SizeCombo?.rd?.map((ele) => (
                                  <option value={ele?.sizename} key={ele?.id}>
                                    {ele?.sizename}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : null}
                      </>
                    )}
                    {/* <Divider sx={{
                      marginTop: '20px', background: '#a9a7a7',
                      marginTop: '20px'
                }} /> */}
                  </div>
                  <div
                    className="part-container"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      paddingBottom: "12px",
                    }}
                  >
                    <div
                      className="part1"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                      }}
                    >
                      {(singleProd?.MetalTypePurity !== "" && selectMtType && singleProd?.IsMrpBase !== 1) ? <span className="part1_key">
                        Metal Purity:{" "}
                        <span className="part1_value">{singleProd?.IsMrpBase === 1 ? singleProd?.MetalTypePurity : selectMtType}</span>
                      </span> : null}
                      {(singleProd?.IsMrpBase !== 1) ? <span className="part1_key">
                        Metal Color:{" "}
                        <span className="part1_value">{mtColorLocal?.filter(
                          (ele) => ele?.colorcode == metalColor
                        )[0]?.metalcolorname}</span>
                      </span> : null}

                      {(storeInit?.IsDiamondCustomization === 1 &&
                        diaQcCombo?.length > 0 && diaList?.length && singleProd?.DiaQuaCol !== "" && selectDiaQc && singleProd?.IsMrpBase !== 1) ? <span className="part1_key">
                        Diamond Quality Color:{" "}
                        <span className="part1_value">{`${selectDiaQc}`}</span>
                      </span> : null}

                      {storeInit?.IsB2BWebsite == 0 ? <span className="part1_key">
                        Gross Wt:{" "}
                        <span className="part1_value">
                          {(singleProd1?.Gwt ?? singleProd?.Gwt)?.toFixed(3)}
                        </span>
                      </span> : null}

                      <span className="part1_key">
                        Net Wt:{" "}
                        <span className="part1_value">
                          {(singleProd1?.Nwt ?? singleProd?.Nwt)?.toFixed(3)}
                        </span>
                      </span>


                    </div>
                  </div>

                  {storeInit?.IsPriceShow == 1 && storeInit?.IsPriceBreakUp == 1 && singleProd1?.IsMrpBase !== 1 && singleProd?.IsMrpBase !== 1 && (
                    <Accordion
                      elevation={0}
                      sx={{
                        borderBottom: "1px solid #c7c8c9",
                        borderRadius: 0,
                        "&.MuiPaper-root.MuiAccordion-root:last-of-type":
                        {
                          borderBottomLeftRadius: "0px",
                          borderBottomRightRadius: "0px",
                        },
                        "&.MuiPaper-root.MuiAccordion-root:before":
                        {
                          background: "none",
                        },
                      }}
                      className="dt_price_breakup"
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ width: "20px" }} />
                        }
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          color: "#7d7f85 !important",
                          borderRadius: 0,

                          "&.MuiAccordionSummary-root": {
                            padding: 0,
                          },
                        }}
                      // className="filtercategoryLable"

                      >
                        <Typography sx={{ fontFamily: "TT Commons Regular", fontSize: '18px' }}>Price Breakup</Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          padding: '0 0 16px 0',

                        }}
                      >

                        {(singleProd1?.Metal_Cost ? singleProd1?.Metal_Cost : singleProd?.Metal_Cost) !== 0 ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography className="smr_Price_breakup_label" sx={{ fontFamily: "TT Commons Regular" }}>Metal</Typography>
                          <span style={{ display: 'flex' }}>
                            <Typography>
                              {
                                <span className="smr_currencyFont" sx={{ fontFamily: "TT Commons Regular" }}>
                                  {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                </span>
                              }
                            </Typography>
                            &nbsp;
                            <Typography sx={{ fontFamily: "TT Commons Regular" }} className="smr_PriceBreakup_Price">{formatter.format((singleProd1?.Metal_Cost ? singleProd1?.Metal_Cost : singleProd?.Metal_Cost)?.toFixed(2))}</Typography>
                          </span>
                        </div> : null}

                        {(singleProd1?.Diamond_Cost ? singleProd1?.Diamond_Cost : singleProd?.Diamond_Cost) !== 0 ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography className="smr_Price_breakup_label" sx={{ fontFamily: "TT Commons Regular" }}>Diamond </Typography>

                          <span style={{ display: 'flex' }}>
                            <Typography>{
                              <span className="smr_currencyFont" sx={{ fontFamily: "TT Commons Regular" }}>
                                {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                              </span>
                            }</Typography>
                            &nbsp;
                            <Typography className="smr_PriceBreakup_Price" sx={{ fontFamily: "TT Commons Regular" }}>{formatter.format((singleProd1?.Diamond_Cost ? singleProd1?.Diamond_Cost : singleProd?.Diamond_Cost)?.toFixed(2))}</Typography>
                          </span>
                        </div> : null}

                        {(singleProd1?.ColorStone_Cost ? singleProd1?.ColorStone_Cost : singleProd?.ColorStone_Cost) !== 0 ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography className="smr_Price_breakup_label" sx={{ fontFamily: "TT Commons Regular" }}>Stone </Typography>

                          <span style={{ display: 'flex' }}>
                            <Typography>{
                              <span className="smr_currencyFont" sx={{ fontFamily: "TT Commons Regular" }}>
                                {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                              </span>
                            }</Typography>
                            &nbsp;
                            <Typography className="smr_PriceBreakup_Price" sx={{ fontFamily: "TT Commons Regular" }}>{formatter.format((singleProd1?.ColorStone_Cost ? singleProd1?.ColorStone_Cost : singleProd?.ColorStone_Cost)?.toFixed(2))}</Typography>
                          </span>
                        </div> : null}

                        {(singleProd1?.Misc_Cost ? singleProd1?.Misc_Cost : singleProd?.Misc_Cost) !== 0 ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography className="smr_Price_breakup_label" sx={{ fontFamily: "TT Commons Regular" }}>MISC </Typography>

                          <span style={{ display: 'flex' }}>
                            <Typography>{
                              <span className="smr_currencyFont" sx={{ fontFamily: "TT Commons Regular" }}>
                                {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                              </span>
                            }</Typography>
                            &nbsp;
                            <Typography className="smr_PriceBreakup_Price" sx={{ fontFamily: "TT Commons Regular" }}>{formatter.format((singleProd1?.Misc_Cost ? singleProd1?.Misc_Cost : singleProd?.Misc_Cost)?.toFixed(2))}</Typography>
                          </span>
                        </div> : null}

                        {formatter.format((singleProd1?.Labour_Cost ? singleProd1?.Labour_Cost : singleProd?.Labour_Cost)?.toFixed(2)) !== 0 ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography className="smr_Price_breakup_label" sx={{ fontFamily: "TT Commons Regular" }}>Labour </Typography>

                          <span style={{ display: 'flex' }}>
                            <Typography>{
                              <span className="smr_currencyFont" sx={{ fontFamily: "TT Commons Regular" }}>
                                {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                              </span>
                            }</Typography>
                            &nbsp;
                            <Typography className="smr_PriceBreakup_Price" sx={{ fontFamily: "TT Commons Regular" }}>{formatter.format((singleProd1?.Labour_Cost ? singleProd1?.Labour_Cost : singleProd?.Labour_Cost)?.toFixed(2))}</Typography>
                          </span>
                        </div> : null}

                        {
                          (

                            (singleProd1?.Other_Cost ? singleProd1?.Other_Cost : singleProd?.Other_Cost) +
                            (singleProd1?.Size_MarkUp ? singleProd1?.Size_MarkUp : singleProd?.Size_MarkUp) +
                            (singleProd1?.DesignMarkUpAmount ? singleProd1?.DesignMarkUpAmount : singleProd?.DesignMarkUpAmount) +
                            (singleProd1?.ColorStone_SettingCost ? singleProd1?.ColorStone_SettingCost : singleProd?.ColorStone_SettingCost) +
                            (singleProd1?.Diamond_SettingCost ? singleProd1?.Diamond_SettingCost : singleProd?.Diamond_SettingCost) +
                            (singleProd1?.Misc_SettingCost ? singleProd1?.Misc_SettingCost : singleProd?.Misc_SettingCost)

                          ) !== 0 ?

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography className="smr_Price_breakup_label" sx={{ fontFamily: "TT Commons Regular" }}>Other </Typography>

                              <span style={{ display: 'flex' }}>
                                <Typography>{
                                  <span className="smr_currencyFont" sx={{ fontFamily: "TT Commons Regular" }}>
                                    {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                  </span>
                                }</Typography>
                                &nbsp;
                                <Typography className="smr_PriceBreakup_Price" sx={{ fontFamily: "TT Commons Regular" }}>{
                                  formatter.format((

                                    (singleProd1?.Other_Cost ? singleProd1?.Other_Cost : singleProd?.Other_Cost) +
                                    (singleProd1?.Size_MarkUp ? singleProd1?.Size_MarkUp : singleProd?.Size_MarkUp) +
                                    (singleProd1?.DesignMarkUpAmount ? singleProd1?.DesignMarkUpAmount : singleProd?.DesignMarkUpAmount) +
                                    (singleProd1?.ColorStone_SettingCost ? singleProd1?.ColorStone_SettingCost : singleProd?.ColorStone_SettingCost) +
                                    (singleProd1?.Diamond_SettingCost ? singleProd1?.Diamond_SettingCost : singleProd?.Diamond_SettingCost) +
                                    (singleProd1?.Misc_SettingCost ? singleProd1?.Misc_SettingCost : singleProd?.Misc_SettingCost)

                                  )?.toFixed(2))
                                }</Typography>
                              </span>
                            </div>
                            :
                            null
                        }

                      </AccordionDetails>
                    </Accordion>
                  )}
                  <p className="smilingProdutDetltTitle">{singleProd?.designno}</p>
                  {/* {storeInit?.IsPriceShow === 1 &&
                    (isPriceloading ? (
                      <Skeleton variant="rounded" width={240} height={30} sx={{ marginTop: '5px' }} />
                    ) : (
                      <div>
                        <p
                          style={{
                            color: "#7d7f85",
                            fontSize: "12px",
                            display: "flex",
                            marginTop: '5px'
                          }}
                        >
                          <span className="mainpriceDeatilPage">
                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                            &nbsp;
                            {formatter.format(
                              singleProd1?.UnitCostWithMarkUp ??
                              singleProd?.UnitCostWithMarkUp
                            )}
                          </span>
                        </p>
                      </div>
                    ))} */}

                  {!prodLoading ? (<div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="addtocartcont"
                        onClick={() => handleCart(!handleCart)}
                      >
                        <span className="addtocarttxt">
                          {handleCart ? "REMOVE FROM CART" : "ADD TO CART"}
                        </span>
                      </div>
                      {
                        <div className="wishlistcont">
                          <FormControlLabel
                            label={
                              <span
                                className="wishlist_label"
                                style={{
                                  fontFamily: "Poppins, sans-serif",
                                  color: "#999",
                                  fontSize: "16px",
                                }}
                              >
                                ADD TO WISHLIST
                              </span>
                            }
                            control={
                              <Checkbox
                                icon={
                                  <FavoriteBorderIcon
                                    sx={{ fontSize: "25px", color: "pink" }}
                                  />
                                }
                                checkedIcon={
                                  <FavoriteIcon
                                    sx={{ fontSize: "25px", color: "pink" }}
                                  />
                                }
                                disableRipple={true}
                                checked={
                                  wishListFlag ?? singleProd?.IsInWish == 1
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleWishList(e, singleProd)}
                              />
                            }
                          />

                          {/* <label>Browse wishlist</label> */}
                        </div>
                      }
                    </div>
                    {singleProd?.InStockDays !== 0 && <p style={{ margin: '20px 0px 0px 0px', fontWeight: 500, fontSize: '18px', fontFamily: 'TT Commons Regular', color: '#7d7f85' }}>Express Shipping in Stock {singleProd?.InStockDays} Days Delivery</p>}
                    {singleProd?.MakeOrderDays != 0 && <p style={{ margin: '0px', fontWeight: 500, fontSize: '18px', fontFamily: 'TT Commons Regular', color: '#7d7f85' }}>Make To Order {singleProd?.MakeOrderDays} Days Delivery</p>}
                  </div>) : null}
                </div>
              </div>
            </div>


          </div>
          <div className="dia_material_details_portion" style={{ marginBottom: '50px' }}>
            {(diaList?.length > 0 || csList?.filter((ele) => ele?.D === "MISC")?.length > 0 || csList?.filter((ele) => ele?.D !== "MISC")?.length > 0) && (
              <p className="dt_details_title"> Product Details</p>
            )}
            {diaList?.length > 0 && (
              <div className="dt_material_details_portion_inner">
                <ul style={{ margin: "0px 0px 3px 0px" }}>
                  <li
                    style={{ fontWeight: 600 }}
                  >{`Diamond Detail(${diaList
                    ?.reduce(
                      (accumulator, data) => accumulator + data?.N,
                      0
                    )
                    .toFixed(3)}ct)`}</li>
                </ul>
                <ul className="dt_mt_detail_title_ul">
                  <li className="dt_deatil_proDeatilList">Shape</li>
                  <li className="dt_deatil_proDeatilList">Quality</li>
                  <li className="dt_deatil_proDeatilList">Color</li>
                  <li className="dt_deatil_proDeatilList">Pcs / Wt</li>
                </ul>
                {diaList?.map((data,i) => (
                  <ul className="dt_mt_detail_title_ul" key={i}>
                    <li className="dt_deatil_proDeatilList1">{data?.F}</li>
                    <li className="dt_deatil_proDeatilList1">{data?.H}</li>
                    <li className="dt_deatil_proDeatilList1">{data?.J}</li>
                    <li className="dt_deatil_proDeatilList1">
                      {data?.M} / {(data?.N)?.toFixed(3)}
                    </li>
                  </ul>
                ))}
              </div>
            )}
            {csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
              <div className="dt_material_details_portion_inner">
                <ul style={{ margin: "10px 0px 3px 0px" }}>
                  <li
                    style={{ fontWeight: 600 }}
                  >{`ColorStone Detail(${csList?.filter((ele) => ele?.D !== "MISC")
                    ?.reduce(
                      (accumulator, data) => accumulator + data?.N,
                      0
                    )
                    .toFixed(3)}ct)`}</li>
                </ul>
                <ul className="dt_mt_detail_title_ul">
                  <li className="dt_deatil_proDeatilList">Shape</li>
                  <li className="dt_deatil_proDeatilList">Quality</li>
                  <li className="dt_deatil_proDeatilList">Color</li>
                  <li className="dt_deatil_proDeatilList">Wt</li>
                </ul>
                {csList?.filter((ele) => ele?.D !== "MISC")?.map((data) => (
                  <ul className="dt_mt_detail_title_ul">
                    <li className="dt_deatil_proDeatilList1">{data?.F}</li>
                    <li className="dt_deatil_proDeatilList1">{data?.H}</li>
                    <li className="dt_deatil_proDeatilList1">{data?.J}</li>
                    <li className="dt_deatil_proDeatilList1">
                      {(data?.N)?.toFixed(3)}
                    </li>
                  </ul>
                ))}
              </div>
            )}

            {csList?.filter((ele) => ele?.D === "MISC")?.length > 0 && (
              <div className="dt_material_details_portion_inner">
                <ul style={{ margin: "10px 0px 3px 0px" }}>
                  <li
                    style={{ fontWeight: 600 }}
                  >{`MISC Detail(${csList?.filter((ele) => ele?.D === "MISC")
                    ?.reduce(
                      (accumulator, data) => accumulator + data?.N,
                      0
                    )
                    .toFixed(3)}ct)`}</li>
                </ul>
                <ul className="dt_mt_detail_title_ul">
                  <li className="dt_deatil_proDeatilList">Shape</li>
                  <li className="dt_deatil_proDeatilList">Quality</li>
                  <li className="dt_deatil_proDeatilList">Color</li>
                  <li className="dt_deatil_proDeatilList">Wt</li>
                </ul>
                {csList?.filter((ele) => ele?.D === "MISC")?.map((data) => (
                  <ul className="dt_mt_detail_title_ul">
                    <li className="dt_deatil_proDeatilList1">{data?.F}</li>
                    <li className="dt_deatil_proDeatilList1">{data?.H}</li>
                    <li className="dt_deatil_proDeatilList1">{data?.J}</li>
                    <li className="dt_deatil_proDeatilList1">
                      {(data?.N)?.toFixed(3)}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>

          {(stockItemArr?.length > 0 && storeInit?.IsStockWebsite === 1) && (
            <div className="smr_stockItem_div" style={{ marginBottom: "50px" }}>
              <p className="dt_details_title"> Stock Items </p>
              <div className="dt_stockitem_container" >
                {/* <div className="smr_stock_item_card">
                  {stockItemArr?.map((ele) => (
                    <div className="smr_stockItemCard">
                      <div className="cart_and_wishlist_icon">
                        <Checkbox
                          icon={
                            <LocalMallOutlinedIcon
                              sx={{
                                fontSize: "22px",
                                color: "#7d7f85",
                                opacity: ".7",
                              }}
                            />
                          }
                          checkedIcon={
                            <LocalMallIcon
                              sx={{
                                fontSize: "22px",
                                color: "#009500",
                              }}
                            />
                          }
                          disableRipple={false}
                          sx={{ padding: "10px" }}

                          onChange={(e) => handleCartandWish(e, ele, "Cart")}
                          checked={cartArr[ele?.StockId] ?? ele?.IsInCart === 1 ? true : false}
                        />

                      </div>
                      <img
                        className="smr_productCard_Image"
                        src={
                          storeInit?.DesignImageFol +
                          ele?.designno +
                          "_" +
                          "1" +
                          "." +
                          ele?.ImageExtension
                        }
                        alt={""}
                      />
                      <div className="smr_stockutem_shortinfo" style={{display:'flex',flexDirection:'column',gap:'5px',paddingBottom:'5px'}}>
                      <span className="smr_prod_designno">
                        {ele?.designno}
                      </span>
                      <div className="smr_prod_Allwt">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            letterSpacing: "1px",
                            gap: "3px",
                          }}
                        >
                          <span className="smr_prod_wt">
                            <span className="smr_d_keys">NWT:</span>
                            <span className="smr_d_val">{ele?.NetWt}</span>
                          </span>

                          {storeInit?.IsGrossWeight == 1 &&
                            Number(ele?.GrossWt) !== 0 && (
                              <>
                                <span>|</span>
                                <span className="smr_prod_wt">
                                  <span className="smr_d_keys">GWT:</span>
                                  <span className="smr_d_val">
                                    {ele?.GrossWt}
                                  </span>
                                </span>
                              </>
                            )}
                          {storeInit?.IsDiamondWeight == 1 &&
                            Number(ele?.DiaWt) !== 0 && (
                              <>
                                <span>|</span>
                                <span className="smr_prod_wt">
                                  <span className="smr_d_keys">DWT:</span>
                                  <span className="smr_d_val">
                                    {ele?.DiaWt}
                                    {storeInit?.IsDiamondPcs === 1
                                      ? `/${ele?.DiaPcs}`
                                      : null}
                                  </span>
                                </span>
                              </>
                            )}

                          {storeInit?.IsStoneWeight == 1 &&
                            Number(ele?.CsWt) !== 0 && (
                              <>
                                <span >|</span>
                                <span className="smr_prod_wt">
                                  <span className="smr_d_keys">CWT:</span>
                                  <span className="smr_d_val">
                                    {ele?.CsWt}
                                    {storeInit?.IsStonePcs === 1
                                      ? `/${ele?.CsPcs}`
                                      : null}
                                  </span>
                                </span>
                              </>
                            )}
                        </div>
                      </div>

                      <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}} className="smr_stockItem_price_type_mt">
                          <span>
                            {ele?.MetalColorName}-{ele?.metaltypename}{ele?.metalPurity} 
                            {" "}/{" "}
                            <span
                                className="smr_currencyFont"
                                dangerouslySetInnerHTML={{
                                  __html: decodeEntities(
                                    storeInit?.Currencysymbol
                                  ),
                                }}
                              />
                             </span>
                             <span>{" "}{ele?.Amount}</span>
                      </div>
                      </div>
                    </div>
                  ))}
                </div> */}
                <table className="dt_stockItem_table">
                  <tr className="dt_stockItem_table_tr">
                    <th className="dt_stockItem_table_td">SrNo</th>
                    <th className="dt_stockItem_table_td">Design No</th>
                    {/* <th className="dt_stockItem_table_td" >StockBarcode</th> */}
                    <th className="dt_stockItem_table_td">Job No</th>
                    <th
                      className="dt_stockItem_table_td"
                      style={{ textAlign: "center" }}
                    >
                      Gross Wt/Net Wt/Dia Wt/CS Wt
                    </th>
                    <th className="dt_stockItem_table_td">
                      Metal Color-Purity
                    </th>
                    {storeInit?.IsPriceShow == 1 && <th className="dt_stockItem_table_td">Price</th>}
                    <th className="dt_stockItem_table_td">
                      Add To Cart
                    </th>
                  </tr>
                  {stockItemArr?.map((ele, i) => (
                    <tr className="dt_stockItem_table_tr">
                      <td className="dt_stockItem_table_td">
                        <span className="smr_prod_designno">
                          {ele?.SrNo}
                        </span>
                      </td>
                      <td className="dt_stockItem_table_td">
                        <span className="smr_prod_designno">
                          {ele?.designno}
                        </span>
                      </td>
                      <td className="dt_stockItem_table_td">
                        <span className="smr_prod_designno">
                          {ele?.StockBarcode}
                        </span>
                      </td>
                      {/* <td className="dt_stockItem_table_td">
                        <span className="smr_prod_designno">
                        {ele?.JobNo}
                        </span>
                      </td> */}
                      <td className="dt_stockItem_table_td">
                        <div className="smr_prod_Allwt">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              letterSpacing: "1px",
                              gap: "3px",
                            }}
                          >
                            {storeInit?.IsGrossWeight == 1 &&
                              Number(ele?.GrossWt) !== 0 && (
                                <>
                                  <span className="smr_prod_wt">
                                    <span className="dt_d_keys">
                                      GWT:
                                    </span>
                                    <span className="dt_d_val">
                                      {ele?.GrossWt.toFixed(3)}
                                    </span>
                                  </span>
                                </>
                              )}

                            {Number(ele?.NetWt) !== 0 && (
                              <>
                                <span>|</span>
                                <span className="smr_prod_wt">
                                  <span className="dt_d_keys">NWT:</span>
                                  <span className="dt_d_val">
                                    {ele?.NetWt.toFixed(3)}
                                  </span>
                                </span>
                              </>
                            )}

                            {/* {storeInit?.IsGrossWeight == 1 &&
                              Number(ele?.GrossWt) !== 0 && (
                                <>
                                  <span>|</span>
                                  <span className="smr_prod_wt">
                                    <span className="dt_d_keys">GWT:</span>
                                    <span className="smr_d_val">
                                      {ele?.GrossWt}
                                    </span>
                                  </span>
                                </>
                              )} */}
                            {storeInit?.IsDiamondWeight == 1 &&
                              Number(ele?.DiaWt) !== 0 && (
                                <>
                                  <span>|</span>
                                  <span className="smr_prod_wt">
                                    <span className="dt_d_keys">
                                      DWT:
                                    </span>
                                    <span className="dt_d_val">
                                      {ele?.DiaWt.toFixed(3)}
                                      {storeInit?.IsDiamondPcs === 1
                                        ? `/${ele?.DiaPcs}`
                                        : null}
                                    </span>
                                  </span>
                                </>
                              )}

                            {storeInit?.IsStoneWeight == 1 &&
                              Number(ele?.CsWt) !== 0 && (
                                <>
                                  <span>|</span>
                                  <span className="smr_prod_wt">
                                    <span className="dt_d_keys">
                                      CWT:
                                    </span>
                                    <span className="dt_d_val">
                                      {ele?.CsWt.toFixed(3)}
                                      {storeInit?.IsStonePcs === 1
                                        ? `/${ele?.CsPcs}`
                                        : null}
                                    </span>
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      </td>
                      <td className="dt_stockItem_table_td">
                        {/* <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}} className="smr_stockItem_price_type_mt"> */}
                        <span className="dt_table_mtcol">
                          {ele?.MetalColorName}-{ele?.metaltypename}
                          {ele?.metalPurity}
                          {/* {" "}/{" "} */}
                        </span>
                        {/* </div> */}
                      </td>
                      {storeInit?.IsPriceShow == 1 && <td className="dt_stockItem_table_td">
                        <span className="dt_table_Price">
                          <span className="smr_currencyFont">
                            {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                          </span>
                          &nbsp;
                          <span> {
                            // formatter.format(
                            ele?.Amount
                            // )
                          }</span>
                        </span>
                      </td>}
                      <td
                        className="dt_stockItem_table_td"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          border: 'none'
                        }}
                      >
                        <Checkbox
                          icon={
                            <LocalMallOutlinedIcon
                              sx={{
                                fontSize: "22px",
                                color: "#7d7f85",
                                opacity: ".7",
                              }}
                            />
                          }
                          checkedIcon={
                            <LocalMallIcon
                              sx={{
                                fontSize: "22px",
                                color: "#009500",
                              }}
                            />
                          }
                          disableRipple={false}
                          sx={{ padding: "10px" }}
                          onChange={(e) =>
                            handleCartandWish(e, ele, "Cart")
                          }
                          checked={
                            cartArr[ele?.StockId] ?? ele?.IsInCart === 1
                              ? true
                              : false
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          )}

          {storeInit?.IsProductDetailSimilarDesign == 1 &&
            SimilarBrandArr?.length > 0 && (
              <div className="dt_stockItem_div" style={{ marginBottom: "50px" }}>
                <p className="dt_details_title"> Similar Designs</p>
                <div className="dt_stockitem_container">
                  <div className="dt_stock_item_card">
                    {SimilarBrandArr?.map((ele) => (
                      <div
                        className="dt_stockItemCard"
                        onClick={() =>
                          // setTimeout(() => 
                          handleMoveToDetail(ele)
                          // , 500)
                        }
                      >
                        <img
                          className="dt_productCard_Image"
                          src={
                            ele?.ImageCount > 0
                              ? storeInit?.CDNDesignImageFol + ele?.designno + "~" + "1" + "." + ele?.ImageExtension
                              : imageNotFound
                          }
                          alt={""}
                          onError={(e) => {
                            e.target.src = imageNotFound
                          }}
                        />
                        <div
                          className="dt_stockutem_shortinfo"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            paddingBottom: "5px",
                          }}
                        >
                          <span
                            className="dt_prod_designno"
                            style={{ fontSize: "14px" }}
                          >
                            {ele?.designno}
                          </span>

                          {storeInit?.IsPriceShow == 1 && <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              fontSize: "16px",
                            }}
                            className="dt_stockItem_price_type_mt"
                          >
                            <spam>
                              <span className="dt_currencyFont">
                                {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                              </span>
                              &nbsp;
                            </spam>
                            <span>{
                              // formatter.format(
                              ele?.UnitCostWithMarkUp
                              // )
                            }</span>
                          </div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {storeInit?.IsProductDetailDesignSet === 1 &&
            <div className="dt_DesignSet_main">
              {designSetList?.length > 0 && <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "FreightDisp Pro Medium",
                    color: "#7d7f85",
                    fontSize: "30px",
                    // display:'none'
                  }}
                >
                  Complete The Look
                </p>
              </div>}

              <div className="dt_Swiper_designSet" >
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar]}
                  // spaceBetween={50}
                  // slidesPerView={3}
                  navigation
                  pagination={{ clickable: true }}
                // scrollbar={{ draggable: true }}
                >
                  {designSetList?.map((designSetList) => (
                    <SwiperSlide>
                      <div className="dt_compeletethelook_cont">
                        <div className="dt_ctlImg_containe">
                          <img
                            // src={
                            //   "https://cdn.accentuate.io/3245609615460/4121939443812/99-v1581576944425.jpg?2048x1950"
                            // }
                            src={
                              designSetList?.DefaultImageName ? storeInit?.DesignSetImageFol +
                                designSetList?.designsetuniqueno +
                                "/" +
                                designSetList?.DefaultImageName
                                :
                                imageNotFound
                            }
                            onError={(e) => {
                              e.target.src = imageNotFound
                            }}
                            alt={""}
                            className="dt_ctl_img"
                          />
                        </div>

                        <div
                          className={
                            (designSetList?.Designdetail == undefined
                              ? []
                              : JSON.parse(designSetList?.Designdetail)
                            )?.length > 3
                              ? "dt_compeletethelook_prodt_for_3"
                              : "dt_compeletethelook_prodt"
                          }
                        >
                          <p
                            style={{
                              fontFamily: "FreightDisp Pro Medium",
                              color: "#7d7f85",
                              fontSize: "30px",
                              display: "none",
                            }}
                          >
                            Complete The Look
                          </p>

                          {(designSetList?.Designdetail == undefined
                            ? []
                            : JSON.parse(designSetList?.Designdetail)
                          )?.map((ele, i) => (
                            <div
                              className="dt_completethelook_outer"
                              onClick={() => handleMoveToDetail(ele)}
                              style={{ borderTop: i !== 0 ? "none" : "" }}
                            >
                              <div style={{ display: "flex", gap: "60px" }}>
                                <div style={{ marginLeft: "12px" }}>
                                  <img
                                    src={
                                      ele?.ImageCount > 0
                                        ? storeInit?.CDNDesignImageFol + ele?.designno + "~" + "1" + "." + ele?.ImageExtension
                                        : imageNotFound
                                    }
                                    alt={""}
                                    // src={
                                    //   "https://smilingrocks.com/cdn/shop/products/Lab-grown-diamond-white-gold-earrings-sre00362wht_medium.jpg?v=1590473229"
                                    // }
                                    className="dt_srthelook_img"
                                    onError={(e) => {
                                      e.target.src = imageNotFound
                                    }}
                                  />
                                </div>
                                <div className="dt_srthelook_prodinfo">
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#7d7f85",
                                      textTransform: "uppercase",
                                    }}
                                    className="dtthelook_prodinfo_inner"
                                  >
                                    <p>
                                      {ele?.designno} - {ele?.CategoryName}
                                      <br />
                                      {storeInit?.IsPriceShow == 1 &&
                                        <span className="dt_currencyFont">
                                          {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
                                        </span>
                                      }
                                      &nbsp;
                                      {storeInit?.IsPriceShow == 1 &&
                                        formatter.format(
                                          ele?.UnitCostWithMarkUp
                                        )
                                      }
                                    </p>
                                  </div>
                                  {/* <div>
                          <span style={{ fontSize: "30px", color: "#7d7f85",padding:'5px'}} className=''>
                            &#8250;
                          </span>
                        </div> */}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>}

        </div>)
      }
    </>
  )
}

export default ProductDetail
