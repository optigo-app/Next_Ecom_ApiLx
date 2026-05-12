'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ProductDetail.modul.scss'
import Cookies from 'js-cookie'
import { Box, Grid, useMediaQuery } from '@mui/material';
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
            }

            if (!res?.pdList[0]) {
              setisPriceLoading(false);
              setIsDataFound(true);
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {!isDataFound ?
        <Box
          sx={{
            color: "#000",
            pb: 6,
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ pt: { xs: 2, md: 4 }, px: { sm: 2, xs: 1, md: 8 }, width: '100%' }}>
            <Grid container spacing={{ xs: 2, md: 4 }} >
              <LeftSide
                loading={loadingdata}
                media={[
                  ...getImagesArr?.map(item => ({ type: "image", src: item })),
                  ...pdVideoArr?.map(item => ({ type: "video", src: item }))
                ] || null}
                isMediaReady={isMediaReady}
                mediaBuildDone={mediaBuildDone}
                HandleImageDialogOpen={HandleImageDialogOpen}
              />
              <RightSide
                TitleLine={formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}
                DesignNo={singleProd?.designno}
                collection={(singleProd ?? singleProd1)?.collection}
                description={(singleProd1?.description ?? singleProd?.description)}
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
                handleMetalWiseColorImgWithFlag={handleMetalWiseColorImgWithFlag}
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
              />
            </Grid>
            <ProductDetailsSection diaList={diaList} csList={csList} />

            {stockItemArr?.length > 0 && stockItemArr?.[0]?.stat_code != 1005 && storeInit?.IsStockWebsite === 1 && (
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
              SimilarBrandArr?.length > 0 && SimilarBrandArr?.[0]?.stat_code != 1005 && (
                <RelatedProduct
                  SimilarBrandArr={SimilarBrandArr}
                  handleMoveToDetail={handleMoveToDetail}
                  storeInit={storeInit}
                  loginInfo={loginData}
                />
              )}

            {storeInit?.IsProductDetailDesignSet === 1 &&
              designSetList?.length > 0 &&
              designSetList?.[0]?.stat_code != 1005 && (
                <DesignSet
                  designSetList={designSetList}
                  handleMoveToDetail={handleMoveToDetail}
                  imageNotFound={imageNotFound}
                  loginInfo={loginData}
                  storeInit={storeInit}
                />
              )}
          </Box>
          <PreviewDialog media={[
            ...getImagesArr?.map((item) => ({
              type: "image",
              src: item,
            })),
            ...pdVideoArr?.map((item) => ({
              type: "video",
              src: item,
            }))
          ]}
            onClose={HandleImageDialogClose}
            open={isImageDialogOpen}
            selectedIndex={SelectedImageIndex}
          />
        </Box>
        :
        <>
          <div
            style={{
              height: "90vh",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              width: '100%'
            }}
            className="elv_prodd_datanotfound"
          >
            Data not Found!!
          </div>
        </>}
    </>
  )
}

export default ProductDetail
