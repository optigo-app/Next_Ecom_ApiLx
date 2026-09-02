import { useState, useEffect } from 'react';
import { fetchWishlistDetails } from '../../API/WishlistAPI/WishlistAPI';
import { removeFromCartList } from '../../API/RemoveCartAPI/RemoveCartAPI';
import { handleWishlistToCartAPI } from '../../API/WishList_Cart/WishlistToCart';
import { GetCountAPI } from '../../API/GetCount/GetCountAPI';
import pako from 'pako';
import Cookies from "js-cookie";
import { DiamondListData } from '../../API/DiamondStore/DiamondList';
import { formatRedirectTitleLine } from '../GlobalFunction';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { getSession } from '../../FetchSessionData';
import { useSnackbarStore } from '@/app/(core)/hooks/useSnackbar';

const Usewishlist = () => {
  const navigate = useNextRouterLikeRR().push;
  const [isWLLoading, setIsWlLoading] = useState(true);
  const [updateCount, setUpdateCount] = useState();
  const [itemInCart, setItemInCart] = useState();
  const [storeInit, setStoreInit] = useState();
  const [countData, setCountData] = useState();
  const [CurrencyData, setCurrencyData] = useState();
  const [wishlistData, setWishlistData] = useState([]);
  const [diamondWishData, setDiamondWishData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [countDataUpdted, setCountDataUpdated] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  // const matchDataSet = useRecoilValue(for_MatchDiamonds)
  // const filterDia = useRecoilValue(for_filterDiamond)
  const [matchDataSet, setMatchDataSet] = useState([])
  const [filterDia, setFilterDia] = useState([])
  const [finalWishData, setFinalWishData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(0)
  const imageNotFound = '/Assets/image-not-found.jpg'
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const validThemenos = [3, 4, 11, 12, 10, 7, 1, 2];

  useEffect(() => {
    const storeInit = getSession("storeInit");
    const storedData = getSession("loginUserDetail");
    setStoreInit(storeInit)
    if (storeInit?.IsB2BWebsite != 0) {
      setCurrencyData(storedData?.CurrencyCode)
    } else {
      setCurrencyData(storeInit?.CurrencyCode)
    }
  }, [])

  useEffect(() => {
    // const metalTypeData = getSession('metalTypeCombo');
    const metalColorData = getSession('MetalColorCombo');
    // const diamondQtyColorData = getSession('diamondQualityColorCombo');
    // const CSQtyColorData = getSession('ColorStoneQualityColorCombo');
    // setMetalTypeCombo(metalTypeData);
    setMetalColorCombo(metalColorData);
    // setDiamondQualityColorCombo(diamondQtyColorData);
    // setColorStoneCombo(CSQtyColorData);
  }, [])


  const getWishlistData = async () => {
    const visiterId = Cookies.get('visiterId');
    setIsWlLoading(true);
    try {
      const response = await fetchWishlistDetails(visiterId);
      if (response?.Data?.rd[0]?.stat != 0) {
        let diamondData = response?.Data?.rd1;
        setWishlistData(response?.Data?.rd);
        const initialProducts = response?.Data?.rd?.map(data => ({
          ...data,
          images: [],
          loading: true
        }));
        setFinalWishData(initialProducts);
        setLoadingIndex(0);

        if (diamondData?.length != 0) {
          const solStockNos = diamondData?.map(item => item?.Sol_StockNo);
          const commaSeparatedString = solStockNos?.join(',');
          if (commaSeparatedString != null || commaSeparatedString != undefined) {
            getDiamondData(commaSeparatedString)
          }
        }
      } else {
        setIsWlLoading(false);
        setWishlistData([]);
        setFinalWishData([]);
        setDiamondWishData([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsWlLoading(false);
    }
  };

  const getDiamondData = async (commaSeparatedString) => {
    setIsWlLoading(true);
    try {
      const response = await DiamondListData(1, "", commaSeparatedString);
      if (response && response.Data) {
        let resData = response.Data?.rd
        setDiamondWishData(resData)
        setIsWlLoading(false)
      } else {
        console.warn("No data found in the response");
        setIsWlLoading(false)
      }
    } catch (error) {
      console.error("Error fetching diamond data:", error);
      setIsWlLoading(false);
    }
  };

  useEffect(() => {
    getWishlistData();
  }, []);


  // remove
  const handleRemoveItem = async (item, isdiamond) => {
    console.log('isdiamond: ', isdiamond);
    const visiterId = Cookies.get('visiterId');
    let param = "wish";
    if (validThemenos.includes(storeInit?.Themeno)) {
      setFinalWishData(finalWishData.filter(cartItem => cartItem.id !== item.id));
    } else {
      setWishlistData(wishlistData.filter(cartItem => cartItem.id !== item.id));
    }
    setDiamondWishData(diamondWishData?.filter(diaItem =>
      !matchDataSet.some((diamond) => diamond?.stockno === diaItem?.stockno)
    ))
    if (isdiamond !== "") {
      setDiamondWishData(diamondWishData?.filter(diaItem =>
        !filterDia.some((diamond) => diamond?.stockno === diaItem?.stockno)
      ))
    }
    try {
      const response = await removeFromCartList(item, param, visiterId, isdiamond);
      let resStatus = response.Data.rd[0];
      if (resStatus?.msg == "success") {
        return resStatus;
      } else {
        console.log('Failed to remove product or product not found');
      }
    } catch (error) {
      console.error("Error:", error);
      setUpdateCount(false);
    }
  };

  const handleRemoveAll = async () => {
    const visiterId = Cookies.get('visiterId');
    let param = "wish";
    try {
      setWishlistData([]);
      setFinalWishData([]);
      setDiamondWishData([]);
      setLoadingIndex(0);
      const response = await removeFromCartList('IsDeleteAll', param, visiterId);
      let resStatus = response?.Data?.rd?.[0];
      return resStatus || { msg: "success" };
    } catch (error) {
      console.error("Error:", error);
      return { msg: "error" };
    }
  };

  // add to cart
  const handleWishlistToCart = async (item) => {
    const visiterId = Cookies.get('visiterId');
    let param = "";
    if (item?.IsInCart !== 1) {
      try {
        const response = await handleWishlistToCartAPI(param, item, visiterId);
        let resStatus = response?.Data?.rd[0];

        if (resStatus?.msg === "success") {
          if (validThemenos.includes(storeInit?.Themeno)) {
            const updatedWishlistData = finalWishData.map(wish =>
              wish.id === item.id ? { ...wish, IsInCart: 1 } : wish
            );
            setFinalWishData(updatedWishlistData);
          } else {
            const updatedWishlistData = wishlistData.map(wish =>
              wish.id === item.id ? { ...wish, IsInCart: 1 } : wish
            );
            setWishlistData(updatedWishlistData);
          }
        }
        return resStatus;
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      showSnackbar('Already in Cart.')
    }
  };
  // Already in cart


  // add to cart all
  const handleAddtoCartAll = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const visiterId = Cookies.get('visiterId');
    let param = "isSelectAll";
    let resStatus;

    try {
      const allItemsInCart = wishlistData.every(item => item.IsInCart === 1);
      if (!allItemsInCart) {
        try {
          const response = await handleWishlistToCartAPI(param, {}, visiterId);
          resStatus = response?.Data?.rd[0];
          if (resStatus?.msg === "success") {
            getWishlistData();
          }
        } catch (error) {
          console.error("Error:", error);
          return { success: false };
        }
      } else {
        console.log('Already in cart');
      }

      return resStatus;
    } catch (error) {
      setUpdateCount(false);
      console.error("Error:", error);
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };



  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // const WishCardImageFunc = (pd) => {
  //   return new Promise((resolve) => {
  //     let finalprodListimg;
  //     const mtcCode = metalColorCombo?.find(option => option?.metalcolorname === pd?.metalcolorname);
  //     if (pd?.ImageCount > 0) {
  //       finalprodListimg = `${storeInit?.DesignImageFol}${pd?.designno}_1_${mtcCode?.colorcode}.${pd?.ImageExtension}`;
  //       const img = new Image();
  //       img.src = finalprodListimg;

  //       img.onload = () => {
  //         resolve(finalprodListimg);
  //       };
  //       img.onerror = () => {
  //         finalprodListimg = `${storeInit?.DesignImageFol}${pd?.designno}_1.${pd?.ImageExtension}`;
  //         resolve(finalprodListimg);
  //       };
  //     } else {
  //       finalprodListimg = imageNotFound;
  //       resolve(finalprodListimg);
  //     }
  //   });
  // };

  const WishCardImageFunc = (pd) => {
    if (validThemenos.includes(storeInit?.Themeno)) {
      const mtcCode = metalColorCombo?.find(option => option?.metalcolorname === pd?.metalcolorname);
      let primaryImage;

      if (pd?.ImageCount > 0) {
        // primaryImage = `${storeInit?.CDNDesignImageFol}${pd?.designno}~1~${mtcCode?.colorcode}.${pd?.ImageExtension}`;
        primaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1~${mtcCode?.colorcode}.jpg`;
      } else {
        primaryImage = imageNotFound;
      }
      return primaryImage;
    } else {
      return new Promise((resolve) => {
        const loadImage = (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
          });
        };

        const mtcCode = metalColorCombo?.find(option => option?.metalcolorname === pd?.metalcolorname);
        let primaryImage, secondaryImage;

        if (pd?.ImageCount > 0) {
          primaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1~${mtcCode?.colorcode}.jpg`;
          secondaryImage = `${storeInit?.CDNDesignImageFolThumb}${pd?.designno}~1.jpg`;
          // primaryImage = `${storeInit?.CDNDesignImageFol}${pd?.designno}~1~${mtcCode?.colorcode}.${pd?.ImageExtension}`;
          // secondaryImage = `${storeInit?.CDNDesignImageFol}${pd?.designno}~1.${pd?.ImageExtension}`;
        } else {
          primaryImage = secondaryImage = imageNotFound;
        }
        // if (pd?.ImageCount > 0) {
        //   primaryImage = `${storeInit?.DesignImageFol}${pd?.designno}_1_${mtcCode?.colorcode}.${pd?.ImageExtension}`;
        //   secondaryImage = `${storeInit?.DesignImageFol}${pd?.designno}_1.${pd?.ImageExtension}`;
        // } else {
        //   primaryImage = secondaryImage = imageNotFound;
        // }

        loadImage(primaryImage)
          .then((imgSrc) => {
            resolve(imgSrc);
          })
          .catch(() => {
            loadImage(secondaryImage)
              .then((imgSrc) => {
                resolve(imgSrc);
              })
              .catch(() => {
                resolve(imageNotFound);
              });
          });
      });
    }
  };

  // useEffect(() => {
  //   if (!wishlistData) return;

  //   // Initialize finalWishData if it's not already populated (default values)
  //   if (finalWishData.length === 0) {
  //     const initialProducts = wishlistData.map(data => ({
  //       ...data,
  //       images: [],
  //       loading: true
  //     }));
  //     setFinalWishData(initialProducts);
  //     setLoadingIndex(0); // Start with the first item
  //   }

  //   if (loadingIndex >= finalWishData?.length) return;

  //   // Step 2: Load images sequentially for each product
  //   const loadNextProductImages = () => {
  //     setFinalWishData(prevData => {
  //       const newData = [...prevData];
  //       newData[loadingIndex] = {
  //         ...newData[loadingIndex],
  //         images: WishCardImageFunc(newData[loadingIndex]),
  //         loading: false
  //       };
  //       return newData;
  //     });

  //     setLoadingIndex(prevIndex => prevIndex + 1);
  //   };

  //   if (storeInit?.Themeno === 3) {
  //     const timer = setTimeout(loadNextProductImages, 130)
  //     return () => clearTimeout(timer)
  //   }
  //   if (storeInit?.Themeno === 1) {
  //     loadNextProductImages();
  //   }
  //   if (storeInit?.Themeno === 11 || storeInit?.Themeno === 12 || storeInit?.Themeno === 10 || storeInit?.Themeno === 7) {
  //     const timer = setTimeout(loadNextProductImages, 150)
  //     return () => clearTimeout(timer)
  //   }
  //   else {
  //     const timer = setTimeout(loadNextProductImages, 20)
  //     return () => clearTimeout(timer)
  //   }

  // }, [wishlistData, loadingIndex, finalWishData, WishCardImageFunc]);


  // Initialize finalWishData once when wishlistData changes
  useEffect(() => {
    if (!wishlistData || wishlistData.length === 0) {
      setFinalWishData([]);
      setLoadingIndex(0);
      return;
    }

    const initialProducts = wishlistData.map(data => ({
      ...data,
      images: [],
      loading: true
    }));

    setFinalWishData(initialProducts);
    setLoadingIndex(0);
  }, [wishlistData]);

  // Load images sequentially after finalWishData is set
  useEffect(() => {
    if (!finalWishData || finalWishData.length === 0) return;
    if (loadingIndex >= finalWishData.length) return;

    const loadNextProductImages = () => {
      setFinalWishData(prevData => {
        if (!prevData || prevData.length === 0 || !prevData[loadingIndex]) {
          return prevData || [];
        }
        const newData = [...prevData];
        newData[loadingIndex] = {
          ...newData[loadingIndex],
          images: WishCardImageFunc(newData[loadingIndex]),
          loading: false
        };
        return newData;
      });

      setLoadingIndex(prev => prev + 1);
    };

    let delay = 20; // default
    if (storeInit?.Themeno === 3) delay = 130;
    if (storeInit?.Themeno === 1) delay = 0;
    if ([10, 11, 12, 7, 2].includes(storeInit?.Themeno)) delay = 150;

    const timer = setTimeout(loadNextProductImages, delay);
    return () => clearTimeout(timer);
  }, [loadingIndex, finalWishData.length, storeInit, WishCardImageFunc]);


  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = pako.deflate(uint8Array);
      if (typeof compressed === "string") {
        return btoa(compressed);
      }
      let binary = "";
      const len = compressed.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(compressed[i]);
      }
      return btoa(binary);
    } catch (error) {
      console.error('Error compressing and encoding:', error);
      return null;
    }
  };

  const getCardImageUrl = (data, storeInit) => {
    const cdnFol = storeInit?.CDNDesignImageFol || "";
    if (!cdnFol || !data?.designno) return "";
    const ext = data?.ImageExtension || "webp";

    if (data?.ImageVideoDetail && data.ImageVideoDetail !== "0") {
      try {
        const parsed = typeof data.ImageVideoDetail === "string" 
          ? JSON.parse(data.ImageVideoDetail) 
          : data.ImageVideoDetail;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const targetColorId = data?.metalcolorid || data?.MetalColorid;
          const mtColorLocal = getSession("MetalColorCombo") || metalColorCombo || [];
          const targetColorObj = mtColorLocal.find(ele => Number(ele.id) === Number(targetColorId));
          const targetColorCode = targetColorObj?.colorcode || data?.metalcolorname || data?.MetalColor;

          if (targetColorCode) {
            const targetLower = targetColorCode.toLowerCase().trim();
            const matchedColorImg = parsed.find(item => {
              if (Number(item?.TI) !== 2 || !item?.CN) return false;
              const cnLower = item.CN.toLowerCase().trim();
              return cnLower === targetLower || cnLower.includes(targetLower) || targetLower.includes(cnLower);
            });
            if (matchedColorImg) {
              return `${cdnFol}${data.designno}~${matchedColorImg.Nm}~${matchedColorImg.CN}.${matchedColorImg.Ex || ext}`;
            }
          }

          const normalImg = parsed.find(item => Number(item?.TI) === 1);
          if (normalImg) {
            return `${cdnFol}${data.designno}~${normalImg.Nm}.${normalImg.Ex || ext}`;
          }
        }
      } catch (e) {}
    }
    return `${cdnFol}${data.designno}~1.${ext}`;
  };

  const handleMoveToDetail = (wishtData) => {
    if (wishtData?.stockno) {
      const obj = {
        a: wishtData?.stockno,
        b: wishtData?.shapename,
        ArticleNo: wishtData?.ArticleNo,
        ArticleId: wishtData?.ArticleId || wishtData?.id,
      };

      let encodeObj = compressAndEncode(JSON.stringify(obj));

      let navigateUrl = `/d/${wishtData?.stockno}/det345/?p=${encodeURIComponent(encodeObj)}`;
      navigate(navigateUrl);
    } else {
      const targetColorId = wishtData?.MetalColorid || wishtData?.metalcolorid;
      const ext = wishtData?.ImageExtension || "webp";
      const imgUrl = getCardImageUrl(wishtData, storeInit);

      let obj = {
        a: wishtData?.autocode,
        b: wishtData?.designno,
        m: wishtData?.metaltypeid || wishtData?.Metalid,
        d: `${wishtData?.diamondqualityid}${","}${wishtData?.diamondcolorid}`,
        c: `${wishtData?.colorstonequalityid}${","}${wishtData?.colorstonecolorid}`,
        f: {},
        g: [["", ""], ["", "", ""]],
        metalColorId: targetColorId || null,
        l: ext,
        count: (wishtData?.ImageCount && Number(wishtData.ImageCount) > 0) ? Number(wishtData.ImageCount) : 1,
        ArticleNo: wishtData?.ArticleNo || wishtData?.designno,
        ArticleId: wishtData?.ArticleId || wishtData?.id,
        mediaDet: wishtData?.ImageVideoDetail ?? "",
        img: imgUrl,
        title: wishtData?.TitleLine || wishtData?.ArticleNo || wishtData?.designno || "",
        price: wishtData?.UnitCostWithMarkUp || wishtData?.CW_UCostWM || wishtData?._UnitCost || 0,
        nwt: wishtData?.Nwt || wishtData?.CW_Nwt || wishtData?.CW_Gwt || 0,
      };
      let encodeObj = compressAndEncode(JSON.stringify(obj));
      console.log("NAVIGATE FROM WISHLIST:", { wishtData, obj, encodeObj });
      navigate(`/d/${formatRedirectTitleLine(wishtData?.TitleLine)}${wishtData?.designno}?p=${encodeURIComponent(encodeObj)}`);
    }
  };

  //browse our collection

  const handelMenu = () => {
    let menudata = getSession('menuparams');
    if (menudata) {
      const queryParameters1 = [
        menudata?.FilterKey && `${menudata?.FilterVal}`,
        menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
        menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
      ].filter(Boolean).join('/');

      const queryParameters = [
        menudata?.FilterKey && `${menudata?.FilterVal}`,
        menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
        menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
      ].filter(Boolean).join(',');

      const otherparamUrl = Object.entries({
        b: menudata?.FilterKey,
        g: menudata?.FilterKey1,
        c: menudata?.FilterKey2,
      })
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => value)
        .filter(Boolean)
        .join(',');

      // const paginationParam = [
      //   `page=${menudata.page ?? 1}`,
      //   `size=${menudata.size ?? 50}`
      // ].join('&');

      let menuEncoded = `${queryParameters}/${otherparamUrl}`;
      const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(
        menuEncoded
      )}`;
      navigate(url)
    } else {
      navigate("/")
    }
  }

  return {
    isWLLoading,
    wishlistData,
    diamondWishData,
    CurrencyData,
    updateCount,
    itemInCart,
    updateCount,
    countDataUpdted,
    finalWishData,
    decodeEntities,
    WishCardImageFunc,
    handleRemoveItem,
    handleRemoveAll,
    handleWishlistToCart,
    handleAddtoCartAll,
    handleMoveToDetail,
    handelMenu
  };
};

export default Usewishlist;

