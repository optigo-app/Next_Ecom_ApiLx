"use client";

import "../page.scss";
import { Product } from "@/app/components/(static)/Constants/DynamicValue";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zoom, Navigation, Pagination } from "swiper/modules";
import { IoMdArrowBack } from "react-icons/io";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FaWhatsapp } from "react-icons/fa";
import {
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa6";
import { IoIosPlayCircle, IoMdClose } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Skeleton, Typography } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import RelatedProduct from "./RelatedProduct/RelatedProduct";
import { responsiveConfig } from "@/app/components/Config/ProductSliderConfig";
import { getSizeData } from "@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI";
import { StockItemApi } from "@/app/(core)/utils/API/StockItemAPI/StockItemApi";
import { DesignSetListAPI } from "@/app/(core)/utils/API/DesignSetListAPI/DesignSetListAPI";
import { SingleProdListAPI } from "@/app/(core)/utils/API/SingleProdListAPI/SingleProdListAPI";
import Pako from "pako";
import Cookies from "js-cookie";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import Stockitems from "./InstockProduct/Stockitems";
import DesignSet from "./DesignSet/DesignSet";
import { formatRedirectTitleLine, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { SaveLastViewDesign } from "@/app/(core)/utils/API/SaveLastViewDesign/SaveLastViewDesign";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const ProductPage = ({ params, searchParams, storeInit }) => {
    const navigate = useNextRouterLikeRR();

    const { setCartCountNum: setCartCountVal, setWishCountNum: setWishCountVal, loginUserDetail } = useStore();

    const [pdVideoArr, setPdVideoArr] = useState([]);
    const [metalTypeCombo, setMetalTypeCombo] = useState([]);
    const [diaQcCombo, setDiaQcCombo] = useState([]); useNextRouterLikeRR
    const [csQcCombo, setCsQcCombo] = useState([]);
    const [metalColorCombo, setMetalColorCombo] = useState([]);
    const [singleProd, setSingleProd] = useState({});
    const [singleProd1, setSingleProd1] = useState({});
    const [addToCartFlag, setAddToCartFlag] = useState(null);
    const [wishListFlag, setWishListFlag] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const location = useNextRouterLikeRR();
    const previousPath = "Previous Page";
    const [ShowMangifier, setShowMangifier] = useState(false);
    const [PdImageLoader, setPdImageLoader] = useState(false);
    // const [PdImageLoader, setPdImageLoader] = useState(false);
    const sliderRef = useRef(null);
    const [decodeUrl, setDecodeUrl] = useState({});
    const [loginInfo, setLoginInfo] = useState();
    const [SizeCombo, setSizeCombo] = useState();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [sizeData, setSizeData] = useState();
    const [isPriceloading, setisPriceLoading] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [metalWiseColorImg, setMetalWiseColorImg] = useState();
    const [stockItemArr, setStockItemArr] = useState([]);
    const [SimilarBrandArr, setSimilarBrandArr] = useState([]);
    const [diaList, setDiaList] = useState([]);
    const [csList, setCsList] = useState([]);
    const [designSetList, setDesignSetList] = useState();
    const [selectMtType, setSelectMtType] = useState();
    const [selectDiaQc, setSelectDiaQc] = useState();
    const [selectCsQc, setSelectCsQc] = useState();
    const [selectMtColor, setSelectMtColor] = useState();
    const [pdThumbImg, setPdThumbImg] = useState([]);
    const [isImageload, setIsImageLoad] = useState(true);
    const [selectedThumbImg, setSelectedThumbImg] = useState({});
    const [thumbImgIndex, setThumbImgIndex] = useState();
    let cookie = Cookies.get("visiterId");
    const [PdImageArr, setPdImageArr] = useState([]);
    const [loadingdata, setloadingdata] = useState(false);
    const [cartArr, setCartArr] = useState({});
    const [videoArr, SETvideoArr] = useState([]);
    const videoRef = useRef(null);
    const [ShowMdesc, setShowMdesc] = useState(false);
    const [saveLastView, setSaveLastView] = useState();
    const [selectedMetalColor, setSelectedMetalColor] = useState();
    const [defaultImage, setDefaultImage] = useState("");
    const [defaultExtension, setDefaultExtension] = useState("");
    const [proThumImgCount, setProThumImgCount] = useState("");
    const [imageLoaded, setIsImageLoaded] = useState(true);

    const noimage = "./image-not-found.jpg";
    const imageNotFound = "./image-not-found.jpg";

    useEffect(() => {
        if (singleProd?.IsInWish == 1) {
            setWishListFlag(true);
        } else {
            setWishListFlag(false);
        }
    }, [singleProd]);

    useEffect(() => {
        const isInCart = singleProd?.IsInCart === 0 ? false : true;
        setAddToCartFlag(isInCart);
    }, [singleProd]);

    const settings = {
        dots: false,
        arrows: false,
        infinite: false,
        loop: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        // initialSlide: 2,
        autoplaySpeed: 2000,
        beforeChange: (current, next) => setCurrentSlide(next),
        afterChange: (current) => setCurrentSlide(current),
        responsive: responsiveConfig,
    };

    const callAllApi = () => {
        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
        let diaQcLocal = JSON.parse(
            sessionStorage.getItem("diamondQualityColorCombo")
        );
        let csQcLocal = JSON.parse(
            sessionStorage.getItem("ColorStoneQualityColorCombo")
        );
        let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));

        if (!mtTypeLocal || mtTypeLocal?.length === 0) {
            MetalTypeComboAPI(cookie)
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("metalTypeCombo", JSON.stringify(data));
                        setMetalTypeCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setMetalTypeCombo(mtTypeLocal);
        }

        if (!diaQcLocal || diaQcLocal?.length === 0) {
            DiamondQualityColorComboAPI()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem(
                            "diamondQualityColorCombo",
                            JSON.stringify(data)
                        );
                        setDiaQcCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setDiaQcCombo(diaQcLocal);
        }

        if (!csQcLocal || csQcLocal?.length === 0) {
            ColorStoneQualityColorComboAPI()
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem(
                            "ColorStoneQualityColorCombo",
                            JSON.stringify(data)
                        );
                        setCsQcCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setCsQcCombo(csQcLocal);
        }

        if (!mtColorLocal || mtColorLocal?.length === 0) {
            MetalColorCombo(cookie)
                .then((response) => {
                    if (response?.Data?.rd) {
                        let data = response?.Data?.rd;
                        sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
                        setMetalColorCombo(data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setMetalColorCombo(mtColorLocal);
        }
    };

    useEffect(() => {
        const logininfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        setLoginInfo(logininfo);
    }, []);

    useEffect(() => {
        callAllApi();
    }, [storeInit]);

    const [filteredVideos, setFilteredVideos] = useState([]);

    useEffect(() => {
        if (!pdVideoArr || !selectedMetalColor) return;

        const colorMatched = pdVideoArr.filter((url) => {
            const parts = url.split("~");
            const colorPart = parts[2]?.split(".")[0];
            return colorPart === selectedMetalColor;
        });

        if (colorMatched.length > 0) {
            setFilteredVideos(colorMatched.map((v) => ({ src: v, type: "video" })));
        } else {
            // Fallback: videos without any color in the filename
            const noColorVideos = pdVideoArr.filter((url) => {
                const parts = url.split("~");
                return parts.length === 2; // means format is like MCJ66~1.mp4
            });
            setFilteredVideos(noColorVideos.map((v) => ({ src: v, type: "video" })));
        }
    }, [pdVideoArr, selectedMetalColor]);

    // URL decode and decompress function
    const decodeAndDecompress = (encodedString) => {
        try {
            if (!encodedString) return null;

            const base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');

            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

            const binaryString = atob(padded);

            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            const decompressed = Pako.inflate(uint8Array, { to: 'string' });

            const jsonObject = JSON.parse(decompressed);

            return jsonObject;
        } catch (error) {
            console.error('Error decoding and decompressing:', error);
            return null;
        }
    };

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);

            const compressed = Pako.deflate(uint8Array, { to: 'string' });


            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
            return null;
        }
    };

    const handleThumbnailClick = (index) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
    };

    const decodeEntities = (html) => {
        if (!html || typeof html !== "string") return html;
        if (typeof window === "undefined") return html;

        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    function checkImageAvailability(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
        });
    }

    // Parse search params
    const parseSearchParams = () => {
        let result = [];

        try {
            if (!searchParams?.value) return result;

            let parsed;

            // Step 1: Parse JSON
            try {
                parsed = JSON.parse(searchParams.value);
            } catch (jsonError) {
                console.error("❌ Invalid JSON in searchParams.value:", searchParams.value, jsonError);
                return result;
            }

            // Must be object
            if (!parsed || typeof parsed !== "object") return result;

            result = Object.entries(parsed).map(([key, rawValue]) => {
                try {
                    // ------ SAFE DECODE PIPELINE ------

                    // Step A: Fix Next.js converting "+" → space
                    let fixed = rawValue.replace(/ /g, "+");

                    // Step B: Decode URI component (%xx)
                    fixed = decodeURIComponent(fixed);

                    // Step C: Convert Base64URL → Normal Base64
                    fixed = fixed.replace(/-/g, "+").replace(/_/g, "/");

                    // Step D: Restore padding if missing
                    const paddingNeeded = fixed.length % 4;
                    if (paddingNeeded !== 0) {
                        fixed = fixed.padEnd(fixed.length + (4 - paddingNeeded), "=");
                    }

                    // Step E: Base64 decode
                    const decoded = atob(fixed);

                    // Step F: Re-encode to proper Base64 (optional for your code)
                    const reEncoded = btoa(decoded);

                    return `${key}=${reEncoded}`;

                } catch (err) {
                    console.error(`❌ Error decoding key "${key}" with value "${rawValue}":`, err);
                    return `${key}=null`;
                }
            });

        } catch (err) {
            console.error("❌ parseSearchParams failed:", err);
        }

        return result;
    };

    // Generate thumbnail URLs
    const generateThumbnails = (designNo, count, extension) => {
        const thumbBase = storeInit?.CDNDesignImageFolThumb || "";
        return Array.from({ length: count }, (_, i) => {
            const index = i + 1;
            const fileName = `${designNo}~${index}`;
            return {
                src: `${thumbBase}${fileName}.jpg`,
                type: "img",
                extension: extension
            };
        });
    };

    // Run only once on component mount to generate initial thumbnails
    useEffect(() => {
        const result = parseSearchParams();
        let navVal = result[0]?.split("=")[1];
        let decodeobj = decodeAndDecompress(navVal);

        const { b, l, count } = decodeobj;
        const imageUrl = storeInit?.CDNDesignImageFol;
        const urlPath = `${imageUrl}${b}~1.${l}`;

        if (decodeobj) {
            setDecodeUrl(decodeobj);

            if (count > 0) {
                const thumbs = generateThumbnails(b, count, l);
                setPdImageArr(thumbs);
            }
        }
        setIsImageLoaded(false);

    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        const result = parseSearchParams();
        let navVal = result[0]?.split("=")[1];
        let decodeobj = decodeAndDecompress(navVal);

        if (decodeobj) {
            setDecodeUrl(decodeobj);
        }

        let storeinitInside = JSON.parse(sessionStorage.getItem("storeInit"));
        const logininfoInside = JSON.parse(sessionStorage.getItem("loginUserDetail"));

        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));

        let diaQcLocal = JSON.parse(
            sessionStorage.getItem("diamondQualityColorCombo")
        );

        let csQcLocal = JSON.parse(
            sessionStorage.getItem("ColorStoneQualityColorCombo")
        );

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
                        ele?.ColorId == decodeobj?.d?.split(",")[1]
                )[0] ?? `${decodeobj?.d?.split(",")[0]},${decodeobj?.d?.split(",")[1]}`;
        }

        if (csQcLocal) {
            csArr =
                csQcLocal?.filter(
                    (ele) =>
                        ele?.QualityId == decodeobj?.c?.split(",")[0] &&
                        ele?.ColorId == decodeobj?.c?.split(",")[1]
                )[0] ?? `${decodeobj?.c?.split(",")[0]},${decodeobj?.c?.split(",")[1]}`;
        }

        setloadingdata(true);

        const FetchProductData = async () => {
            // let obj = {
            //   mt: metalArr,
            //   diaQc: `${diaArr?.QualityId},${diaArr?.ColorId}`,
            //   csQc: `${csArr?.QualityId},${csArr?.ColorId}`,
            // };

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
                            // setloadingdata(false);
                        }

                        if (!res?.pdList[0]) {
                            setisPriceLoading(false);
                            setIsDataFound(true);
                        }

                        setDiaList(res?.pdResp?.rd3);
                        setCsList(res?.pdResp?.rd4);

                        let prod = res?.pdList[0];

                        let initialsize =
                            prod && prod.DefaultSize !== ""
                                ? prod?.DefaultSize
                                : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)
                                    ?.sizename === undefined
                                    ? SizeCombo?.rd[0]?.sizename
                                    : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)
                                        ?.sizename;

                        setSizeData(initialsize);

                        // await SingleFullProdPriceAPI(decodeobj).then((res) => {
                        //   setSingleProdPrice(res);
                        //   console.log("singlePrice", res);
                        // });
                    }
                    return res;
                })
                .then(async (resp) => {
                    if (resp) {
                        await getSizeData(resp?.pdList[0], cookie)
                            .then((res) => {
                                setSizeCombo(res?.Data);
                            })
                            .catch((err) => console.log("SizeErr", err));

                        await StockItemApi(resp?.pdList[0]?.autocode, "stockitem", cookie)
                            .then((res) => {
                                setStockItemArr(res?.Data?.rd);
                            })
                            .catch((err) => console.log("stockItemErr", err));

                        await StockItemApi(
                            resp?.pdList[0]?.autocode,
                            "similarbrand",
                            obj,
                            cookie
                        )
                            .then((res) => {
                                setSimilarBrandArr(res?.Data?.rd);
                            })
                            .catch((err) => console.log("similarbrandErr", err));

                        await DesignSetListAPI(obj1, resp?.pdList[0]?.designno, cookie)
                            .then((res) => {
                                setDesignSetList(res?.Data?.rd);
                            })
                            .catch((err) => console.log("designsetErr", err));

                        await SaveLastViewDesign(cookie, resp?.pdList[0]?.autocode, resp?.pdList[0]?.designno).then((res) => {
                            setSaveLastView(res?.Data?.rd)
                        }).catch((err) => console.log("saveLastView", err))
                    }
                })
                .catch((err) => console.log("err", err))
                .finally(() => setloadingdata(false));
        };

        FetchProductData();

        window.scroll({
            top: 0,
            behavior: "smooth",
        });
    }, [location?.key]);

    const handleCart = (cartflag) => {
        let metal =
            metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType)[0] ??
            metalTypeCombo[0];
        let dia =
            diaQcCombo?.filter(
                (ele) =>
                    ele?.Quality == selectDiaQc.split(",")[0] &&
                    ele?.color == selectDiaQc.split(",")[1]
            )[0] ?? diaQcCombo[0];
        // let cs =
        //   csQcCombo?.filter(
        //     (ele) =>
        //       ele?.Quality == selectCsQc.split(",")[0] &&
        //       ele?.color == selectCsQc.split(",")[1]
        //   )[0] ?? csQcCombo[0];

        const cs =
            csQcCombo?.find((ele) => {
                return (
                    ele?.Quality == selectCsQc.split(",")[0] &&
                    ele?.color == selectCsQc.split(",")[1]
                );
            }) ?? csQcCombo;

        let mcArr = metalColorCombo?.filter((ele) => {
            if (selectMtColor) {
                return ele?.colorname == selectMtColor;
            } else {
                return (
                    ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid)
                );
            }
        })[0];

        let prodObj = {
            autocode: singleProd?.autocode,
            Metalid: metal?.Metalid,
            MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
            DiaQCid: `${dia?.QualityId},${dia?.ColorId}`,
            CsQCid: `${cs?.QualityId ?? 0},${cs?.ColorId ?? 0}`,
            Size: sizeData ?? singleProd?.DefaultSize,
            Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
            markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
            UnitCostWithmarkup:
                singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
            Remark: "",
        };

        if (cartflag) {
            CartAndWishListAPI("Cart", prodObj, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountVal(wishC);
                    setCartCountVal(cartC);
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setAddToCartFlag(cartflag);
                });
        } else {
            RemoveCartAndWishAPI("Cart", singleProd?.autocode, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountVal(wishC);
                    setCartCountVal(cartC);
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setAddToCartFlag(cartflag);
                });
        }
    };

    const handleWishList = (wishFlag) => {
        setWishListFlag(wishFlag);

        let metal =
            metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType)[0] ??
            metalTypeCombo[0];
        let dia =
            diaQcCombo?.filter(
                (ele) =>
                    ele?.Quality == selectDiaQc.split(",")[0] &&
                    ele?.color == selectDiaQc.split(",")[1]
            )[0] ?? diaQcCombo[0];

        // let cs =
        //   csQcCombo?.filter(
        //     (ele) =>
        //       ele?.Quality == selectCsQc.split(",")[0] &&
        //       ele?.color == selectCsQc.split(",")[1]
        //   )[0] ?? csQcCombo[0];

        const cs =
            csQcCombo?.find((ele) => {
                return (
                    ele?.Quality == selectCsQc.split(",")[0] &&
                    ele?.color == selectCsQc.split(",")[1]
                );
            }) ?? csQcCombo;

        let mcArr = metalColorCombo?.filter((ele) => {
            if (selectMtColor) {
                return ele?.colorname == selectMtColor;
            } else {
                return (
                    ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid)
                );
            }
        })[0];

        let prodObj = {
            autocode: singleProd?.autocode,
            Metalid: metal?.Metalid,
            MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
            DiaQCid: `${dia?.QualityId},${dia?.ColorId}`,
            CsQCid: `${cs?.QualityId ?? 0},${cs?.ColorId ?? 0}`,
            Size: sizeData ?? singleProd?.DefaultSize,
            Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
            markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
            UnitCostWithmarkup:
                singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
            Remark: "",
        };

        if (!wishListFlag) {
            CartAndWishListAPI("Wish", prodObj, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountVal(wishC);
                    setCartCountVal(cartC);
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setWishListFlag(wishFlag);
                });
        } else {
            RemoveCartAndWishAPI("Wish", singleProd?.autocode, cookie)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountVal(wishC);
                    setCartCountVal(cartC);
                })
                .catch((err) => console.log("err", err))
                .finally(() => {
                    setWishListFlag(wishFlag);
                });
        }
    };

    useEffect(() => {
        const result = parseSearchParams();
        let navVal = result[0]?.split("=")[1];
        let decodeobj = decodeAndDecompress(navVal);

        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));

        let diaQcLocal = JSON.parse(
            sessionStorage.getItem("diamondQualityColorCombo")
        );

        let csQcLocal = JSON.parse(
            sessionStorage.getItem("ColorStoneQualityColorCombo")
        );

        setTimeout(() => {
            if (decodeUrl) {
                let metalArr;
                let diaArr;
                let csArr;

                let storeinitInside = JSON.parse(sessionStorage.getItem("storeInit"));
                let logininfoInside = JSON.parse(
                    sessionStorage.getItem("loginUserDetail")
                );

                if (mtTypeLocal?.length) {
                    metalArr = mtTypeLocal?.filter(
                        (ele) =>
                            ele?.Metalid ==
                            (decodeobj?.m
                                ? decodeobj?.m
                                : logininfoInside?.MetalId ?? storeinitInside?.MetalId)
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
                                ).split(",")[1])
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
                                ).split(",")[1])
                    )[0];
                }

                setSelectMtType(metalArr?.metaltype);

                setSelectDiaQc(`${diaArr?.Quality},${diaArr?.color}`);

                setSelectCsQc(`${csArr?.Quality},${csArr?.color}`);

                // let InitialSize = (singleProd && singleProd.DefaultSize !== "")
                //                       ? singleProd?.DefaultSize
                //                       : (SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename === undefined ? SizeCombo?.rd[0]?.sizename : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename)
                // if(InitialSize){
                //   setSizeData(InitialSize)
                // }

                // if(metalArr || diaArr || csArr || InitialSize){
                //   setCustomObj({metalArr, diaArr, csArr ,InitialSize})
                // }

                // console.log("default", { metalArr, diaArr, csArr }, decodeobj);
            }
        }, 500);
    }, [singleProd]);

    useEffect(() => {
        let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));
        let mcArr;

        if (mtColorLocal?.length) {
            mcArr = mtColorLocal?.filter(
                (ele) =>
                    ele?.id == (singleProd?.MetalColorid ?? singleProd1?.MetalColorid)
            )[0];
        }

        setSelectMtColor(mcArr?.colorname);
    }, [singleProd]);

    const ProdCardImageFunc = async () => {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo")) || [];
        const pd = singleProd;

        const imageVideoDetail = pd?.ImageVideoDetail;
        let parsedData = [];

        try {
            parsedData = imageVideoDetail === "0" ? [] : JSON.parse(imageVideoDetail || "[]");
        } catch (err) {
            console.error("Invalid JSON in ImageVideoDetail:", err);
            return;
        }

        // Categorize media
        const normalImages = [], colorImages = [], normalVideos = [], colorVideos = [];

        parsedData.forEach(item => {
            if (item?.TI === 1 && !item?.CN) normalImages.push(item);
            else if (item?.TI === 2 && item?.CN) colorImages.push(item);
            else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
            else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
        });

        // Get max color count by CN
        const getMaxCountByColor = (list) => {
            return list.reduce((acc, curr) => {
                const color = curr.CN;
                acc[color] = (acc[color] || 0) + 1;
                return acc;
            }, {});
        };

        const maxColorCount = Math.max(...Object.values(getMaxCountByColor(colorImages)), 0);
        const normalImageCount = normalImages.length ? Math.max(...normalImages.map(i => i.Nm)) : 0;

        const mcArr = mtColorLocal.find(ele => ele.id === pd?.MetalColorid);
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

        // Prepare image list
        const pdImgList = [];

        // Color images
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

        // Fallback to normal images if no color
        if (pdImgList.length === 0 && normalImageCount > 0) {
            for (let i = 1; i <= normalImageCount; i++) {
                pdImgList.push(buildImageURL(i));
            }
        }

        // Prepare thumbnails and set state
        if (pdImgList.length > 0) {
            const thumbImagePath = pdImgList.map(url => {
                const fileName = url?.imageUrl?.split("Design_Image/")[1];
                const thumbImageUrl = `${storeInit?.CDNDesignImageFolThumb}${fileName?.split('.')[0]}.jpg`;
                return {
                    thumbImageUrl,
                    originalImageExtension: url.extension
                };
            });

            const defaultImg = pdImgList[0];

            if (Object.keys(defaultImg).length > 0) {
                setSelectedThumbImg({
                    link: {
                        imageUrl: defaultImg?.imageUrl,
                        extension: defaultImg?.extension
                    },
                    type: 'img'
                });
            }

            setPdThumbImg(thumbImagePath);
            setThumbImgIndex(0);

            // Also update full img list for image viewer
            const imageMap = thumbImagePath.map(img => ({
                src: img.thumbImageUrl,
                type: "img",
                extension: img.originalImageExtension
            }));
            setPdImageArr(imageMap);
        } else {
            setSelectedThumbImg({ link: { "imageUrl": imageNotFound, "extension": "" }, type: "img" });
            setPdThumbImg();
            setThumbImgIndex();
            setPdImageArr([{ src: imageNotFound, type: "img", extension: "" }]);
        }

        // Handle videos
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

        setPdVideoArr(pdvideoList.length > 0 ? pdvideoList : []);
        setPdImageLoader(false);

        return pdImgList[0] || imageNotFound;
    };


    // Run ProdCardImageFunc only when singleProd is available
    useEffect(() => {
        if (Object.keys(singleProd).length > 0) {
            setPdImageLoader(true);
            ProdCardImageFunc();
        }
    }, [singleProd]);

    const handleCustomChange = async (e, type) => {
        let metalArr;
        let diaArr;
        let csArr;
        let size;

        let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));

        let diaQcLocal = JSON.parse(
            sessionStorage.getItem("diamondQualityColorCombo")
        );

        let csQcLocal = JSON.parse(
            sessionStorage.getItem("ColorStoneQualityColorCombo")
        );

        if (type === "mt") {
            metalArr = mtTypeLocal?.filter(
                (ele) => ele?.metaltype == e.target.value
            )[0]?.Metalid;
            setSelectMtType(e.target.value);
        }
        if (type === "dia") {
            setSelectDiaQc(e.target.value);
            diaArr = diaQcLocal?.filter(
                (ele) =>
                    ele?.Quality == e.target.value?.split(",")[0] &&
                    ele?.color == e.target.value?.split(",")[1]
            )[0];
        }
        if (type === "cs") {
            setSelectCsQc(e.target.value);
            csArr = csQcLocal?.filter(
                (ele) =>
                    ele?.Quality == e.target.value?.split(",")[0] &&
                    ele?.color == e.target.value?.split(",")[1]
            )[0];
        }
        if (type === "sz") {
            setSizeData(e.target.value);
            size = e.target.value;
        }

        if (metalArr == undefined) {
            metalArr = mtTypeLocal?.filter((ele) => ele?.metaltype == selectMtType)[0]
                ?.Metalid;
        }

        if (diaArr == undefined) {
            diaArr = diaQcLocal?.filter(
                (ele) =>
                    ele?.Quality == selectDiaQc?.split(",")[0] &&
                    ele?.color == selectDiaQc?.split(",")[1]
            )[0];
        }

        if (csArr == undefined) {
            csArr = csQcLocal?.filter(
                (ele) =>
                    ele?.Quality == selectCsQc?.split(",")[0] &&
                    ele?.color == selectCsQc?.split(",")[1]
            )[0];
        }

        let obj = {
            mt: metalArr,
            diaQc: `${diaArr?.QualityId},${diaArr?.ColorId}`,
            csQc: `${csArr?.QualityId},${csArr?.ColorId}`,
        };

        let prod = {
            a: singleProd?.autocode,
            b: singleProd?.designno,
        };

        // console.log("eeee", obj);
        setisPriceLoading(true);
        await SingleProdListAPI(prod, size, obj, cookie)
            .then((res) => {
                setSingleProd1(res?.pdList[0]);

                if (res?.pdList?.length > 0) {
                    setisPriceLoading(false);
                }
                setDiaList(res?.pdResp?.rd3);
                setCsList(res?.pdResp?.rd4);
                // console.log("res123", res);
            })
            .catch((err) => {
                console.log("customProdDetailErr", err);
            });
    };

    const handleMetalWiseColorImg = async (e) => {
        const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo")) || [];
        const pd = singleProd ?? singleProd1;
        const selectedMetalColorName = e.target.value;
        const { designno, ImageExtension } = pd || {};
        const baseCDN = storeInit?.CDNDesignImageFol;
        const thumbCDN = storeInit?.CDNDesignImageFolThumb;
        setIsImageLoaded(true);

        const imageVideoDetail = pd?.ImageVideoDetail;
        let parsedData = [];

        try {
            parsedData = imageVideoDetail === "0" ? [] : JSON.parse(imageVideoDetail || "[]");
        } catch (err) {
            console.error("Invalid JSON in ImageVideoDetail:", err);
            return;
        }

        // Categorize media by type & color presence
        const normalImages = [], colorImages = [], normalVideos = [], colorVideos = [];
        parsedData.forEach(item => {
            if (item?.TI === 1 && !item?.CN) normalImages.push(item);
            else if (item?.TI === 2 && item?.CN) colorImages.push(item);
            else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
            else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
        });

        // Count max images for color groups
        const countByColor = colorImages.reduce((acc, curr) => {
            const color = curr.CN;
            acc[color] = (acc[color] || 0) + 1;
            return acc;
        }, {});
        const maxColorCount = Math.max(...Object.values(countByColor), 0);

        // Get normal images max count
        const normalImageCount = normalImages.length > 0
            ? Math.max(...normalImages.map(img => img.Nm))
            : 0;

        // Find matching metal color info
        const mcArr = mtColorLocal.find(ele => ele?.metalcolorname === selectedMetalColorName);

        if (!mcArr) {
            console.warn("Selected metal color not found in MetalColorCombo");
            return;
        }

        setSelectedMetalColor(mcArr.colorcode);
        setSelectMtColor(selectedMetalColorName);

        // Build image URLs
        const buildColorImageList = () => Array.from({ length: maxColorCount }, (_, i) => {
            const extension = colorImages[i]?.Ex;
            const imageUrl = `${baseCDN}${designno}~${i + 1}~${mcArr?.colorcode}.${colorImages[i]?.Ex}`;
            return { imageUrl, extension }
        });

        const buildNormalImageList = () => Array.from({ length: normalImageCount }, (_, i) => {
            const extension = normalImages[i]?.Ex;
            const imageUrl = `${baseCDN}${designno}~${i + 1}.${normalImages[i]?.Ex}`;
            return { imageUrl, extension }
        });

        // Image List Construction
        const pdImgListCol = [];
        if (maxColorCount > 0) {
            for (let i = 1; i <= maxColorCount; i++) {
                const img = buildColorImageList()[i - 1];
                console.log("TCL: ProdCardImageFunc -> img", img)
                const isAvailable = await checkImageAvailability(img.imageUrl);
                if (isAvailable) pdImgListCol.push(img);
            }
        }

        const pdImgList = [];
        if (pdImgListCol.length === 0 && normalImageCount > 0) {
            for (let i = 1; i <= normalImageCount; i++) {
                const img = buildNormalImageList()[i - 1];
                const isAvailable = await checkImageAvailability(img.imageUrl);
                if (isAvailable) pdImgList.push(img);
            }
        }

        // Final Image List Decision
        const finalImgList = pdImgListCol.length > 0 ? pdImgListCol : pdImgList;

        if (finalImgList.length > 0) {
            // Prepare thumbnail URLs
            const thumbImagePath = finalImgList.map(({ imageUrl, extension }) => {
                const fileName = imageUrl.split("Design_Image/")[1];
                const thumbUrl = `${thumbCDN}${fileName?.split('.')[0]}.jpg`;
                return { thumbImageUrl: thumbUrl, originalImageExtension: extension };
            });

            // Set selected thumb to current index or fallback to 0
            const selectedIndex = thumbImgIndex < finalImgList.length ? thumbImgIndex : pdImgListCol.length - 1;
            const mainImg = finalImgList[selectedIndex];
            setSelectedThumbImg({
                link: {
                    imageUrl: mainImg?.imageUrl,
                    extension: mainImg?.originalImageExtension
                }, type: "img"
            });
            setPdThumbImg(thumbImagePath);
            setThumbImgIndex(selectedIndex);

            // Set images for slider
            const imageMap = thumbImagePath.map(img => ({
                src: img.thumbImageUrl,
                type: "img",
                extension: img.originalImageExtension,
            }));
            console.log("TCL: ProdCardImageFunc -> imageMap", imageMap)
            setPdImageArr(imageMap);

        } else {
            // No images found fallback
            setSelectedThumbImg({ link: { "imageUrl": noimage, "extension": "" }, type: "img" });
            setPdThumbImg([]);
            setThumbImgIndex(0);
            setPdImageArr([{ src: noimage, type: "img", extension: "" }]);

        }

        // Build video URLs similarly (optional)
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
        setPdVideoArr(pdvideoList.length > 0 ? pdvideoList : []);

        setIsImageLoaded(false);
        setPdImageLoader(false);
    };


    const handleMoveToDetail = (productData) => {
        console.log("TCL: handleMoveToDetail -> productData", productData)
        let loginInfo = loginUserDetail;
        console.log("TCL: handleMoveToDetail -> loginInfo", loginInfo)

        let obj = {
            a: productData?.autocode,
            b: productData?.designno,
            m: loginInfo?.MetalId,
            d: loginInfo?.cmboDiaQCid,
            c: loginInfo?.cmboCSQCid,
            f: {},
            i: productData?.MetalColorid,
            l: productData?.ImageExtension,
            count: productData?.ImageCount,
        };

        decodeAndDecompress()

        let encodeObj = compressAndEncode(JSON.stringify(obj));

        navigate.push(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);

        setSingleProd1({});
        setSingleProd({});
        setIsImageLoad(true);
    };

    const handleCartandWish = (e, ele, type) => {
        // console.log("event", e.target.checked, ele, type);
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

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
                    setWishCountVal(wishC);
                    setCartCountVal(cartC);
                })
                .catch((err) => console.log("err", err));
        } else {
            RemoveCartAndWishAPI(type, ele?.StockId, cookie, true)
                .then((res) => {
                    let cartC = res?.Data?.rd[0]?.Cartlistcount;
                    let wishC = res?.Data?.rd[0]?.Wishlistcount;
                    setWishCountVal(wishC);
                    setCartCountVal(cartC);
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
    const handleChange = (index) => (event, isExpanded) => {
        setExpandedIndex(isExpanded ? index : null);
    };
    const SizeSorting = (SizeArr) => {
        let SizeSorted = SizeArr?.sort((a, b) => {
            const nameA = parseInt(a?.sizename?.toUpperCase()?.slice(0, -2), 10);
            const nameB = parseInt(b?.sizename?.toUpperCase()?.slice(0, -2), 10);

            return nameA - nameB;
        });

        return SizeSorted;
    };

    useEffect(() => {
        const videoElement = videoRef.current;

        if (!videoElement) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoElement.play();
                    } else {
                        videoElement.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(videoElement);
        return () => {
            observer.disconnect();
        };
    }, []);

    if (!singleProd) {
        return <NotFoundProduct navigate={navigate} />;
    }

    return (
        <>
            <title>
                {formatTitleLine(singleProd?.TitleLine)
                    ? `${singleProd.TitleLine} - ${singleProd?.designno ?? ''}`
                    : ((singleProd?.TitleLine || singleProd?.designno) ? `${singleProd?.designno ?? ''}` : "loading...")}
            </title>
            <div className="hoq_main_Product" style={{ marginBottom: "25px" }}>
                {ShowMangifier && (
                    <MagnifierSlider
                        product={Product}
                        close={() => setShowMangifier(!ShowMangifier)}
                        list={PdImageArr}
                        currentIndex={currentSlide}
                    />
                )}
                <main>
                    <div className="images_slider">
                        {/* {PdImageLoader || loadingdata ? ( */}
                        {imageLoaded ? (
                            <>
                                <div className="slider">
                                    {Array.from({ length: 3 })?.map((val, i) => {
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleThumbnailClick(i)}
                                                className="box"
                                                style={{
                                                    backgroundColor: "transparent",
                                                    marginTop: "-5px",
                                                }}
                                            >
                                                <Skeleton
                                                    width={100}
                                                    height={250}
                                                    sx={{
                                                        backgroundColor: "#f0ededb4 !important;",
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div
                                    className="main_image"
                                    style={{
                                        height: "80vh",
                                        width: "100%",
                                        marginTop: "3rem",
                                        marginLeft: "1rem",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <Skeleton
                                        width={"100%"}
                                        sx={{
                                            padding: "0",
                                            marginTop: "-16rem",
                                            marginLeft: "-8px",
                                            height: "100vh",
                                            backgroundColor: "#f0ededb4 !important;",
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="slider" >
                                    {[...PdImageArr, ...filteredVideos]?.map((val, i) => {
                                        const isImage = val?.type === "img";
                                        const firstHalf = isImage ? val?.src?.split("/Design_Thumb")[0] : "";
                                        const secondHalf = isImage ? val?.src?.split("/Design_Thumb")[1]?.split('.')[0] : "";

                                        return (
                                            <div
                                                key={i}
                                                className={`box ${i === currentSlide ? "active" : ""}`}
                                                onClick={() => {
                                                    handleThumbnailClick(i);
                                                    if (isImage) {
                                                        setSelectedThumbImg({
                                                            link: {
                                                                imageUrl: `${firstHalf}${secondHalf}.${val?.originalImageExtension}`,
                                                                extension: val?.originalImageExtension
                                                            },
                                                            type: "img",
                                                        });
                                                    } else {
                                                        setSelectedThumbImg({
                                                            link: {
                                                                "imageUrl": val?.src,
                                                                "extension": "mp4"
                                                            },
                                                            type: "video",
                                                        });
                                                    }
                                                    setThumbImgIndex(i);
                                                }}
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={val?.src}
                                                        alt=""
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = noimage;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="video_box" style={{ position: "relative" }}>
                                                        <video
                                                            src={val?.src}
                                                            className="hoq_prod_thumb_img"
                                                            autoPlay
                                                            muted
                                                            loop
                                                        />
                                                        <IoIosPlayCircle className="play_io_icon" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="main_image"
                                    onClick={() => setShowMangifier(!ShowMangifier)}
                                >
                                    {[...PdImageArr, ...filteredVideos]?.length > 1 ? (
                                        <>
                                            <Slider
                                                {...settings}
                                                ref={sliderRef}
                                                lazyLoad="progressive"
                                            >
                                                {[...PdImageArr, ...filteredVideos]?.length > 0 ? (
                                                    [...PdImageArr, ...filteredVideos]?.map((val, i) => {
                                                        const firstHalf = val?.src?.split("/Design_Thumb")[0];
                                                        const secondHalf = val?.src?.split("/Design_Thumb")[1]?.split('.')[0];
                                                        return (
                                                            <div className="slider_card" >
                                                                <div className="image">
                                                                    {val?.type === "img" ? (
                                                                        <img
                                                                            loading="lazy"
                                                                            src={`${firstHalf}${secondHalf}.${val?.extension}`}
                                                                            alt={""}
                                                                            onLoad={() => setIsImageLoad(false)}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                // e.target.src = noimage;
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                height: "80vh",
                                                                            }}
                                                                        >
                                                                            <video
                                                                                src={val?.src}
                                                                                ref={videoRef}
                                                                                loop={true}
                                                                                autoPlay={true}
                                                                                muted
                                                                                style={{
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    objectFit: "scale-down",
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="main_image">
                                                        <img
                                                            src={noimage}
                                                            alt={""}
                                                            style={{
                                                                width: "100%",
                                                                height: "90%",
                                                                objectFit: "contain",
                                                                border: "1px solid #312f2f21",
                                                                marginTop: "45px",
                                                            }}
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = noimage;
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Slider>
                                        </>
                                    ) : PdImageArr?.length === 1 ? (
                                        <div className="slider_card">
                                            <div className="image">
                                                {/* <img
                                                    src={PdImageArr[0]?.src || noimage}
                                                    alt=""
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = noimage;
                                                    }}
                                                    loading="lazy"
                                                /> */}
                                                {(() => {
                                                    const val = PdImageArr[0];

                                                    // normalize src in case it is an object (Next image import)
                                                    const srcStr =
                                                        typeof val?.src === "string"
                                                            ? val.src
                                                            : typeof val?.src?.src === "string"
                                                                ? val.src.src
                                                                : "";

                                                    const firstHalf = srcStr
                                                        ? srcStr.split("/Design_Thumb")[0]
                                                        : "";
                                                    const secondHalf =
                                                        srcStr && srcStr.includes("/Design_Thumb")
                                                            ? srcStr.split("/Design_Thumb")[1]?.split(".")[0]
                                                            : "";

                                                    const finalSrc =
                                                        val?.type === "img" && firstHalf && secondHalf
                                                            ? `${firstHalf}${secondHalf}.${val?.extension}`
                                                            : srcStr || noimage;

                                                    return (
                                                        <img
                                                            src={finalSrc}
                                                            alt=""
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = noimage;
                                                            }}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="slider_card">
                                            <div className="image">
                                                <img
                                                    src={noimage}
                                                    alt=""
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = noimage;
                                                    }}
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="product_details">
                        <div className="product_info">
                            {formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}
                            <span
                                className="hoq_single_prod_designno"
                                style={{ marginTop: "5px", fontSize: "1.1rem" }}
                            >
                                {singleProd?.designno}
                            </span>
                            {storeInit?.IsPriceShow === 1 && (
                                <div className="pricecharge">
                                    {
                                        <div className="hoq_price_portion">
                                            {isPriceloading ? (
                                                ""
                                            ) : (
                                                <span
                                                    style={{ paddingRight: "0.4rem" }}
                                                    className="hoq_currencyFont"
                                                    dangerouslySetInnerHTML={{
                                                        __html: decodeEntities(
                                                            loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode
                                                        ),
                                                    }}
                                                />
                                            )}
                                            {isPriceloading ? (
                                                <Skeleton variant="rounded" width={140} height={30} />
                                            ) : (
                                                <>
                                                    {singleProd1?.UnitCostWithMarkUp ??
                                                        singleProd?.UnitCostWithMarkUp?.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                </>
                                            )}
                                        </div>
                                    }
                                </div>
                            )}
                            {singleProd?.description && (
                                <div className="desc-p-details">
                                    <p className={`${!ShowMdesc ? "showless" : "showmore"}`}>
                                        {singleProd?.description}
                                    </p>
                                    <div className="btn_sec_pd">
                                        <button onClick={() => setShowMdesc(!ShowMdesc)}>
                                            {ShowMdesc ? "...Show Less" : "...Show More"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="product_main_Details">
                            {storeInit?.IsProductWebCustomization == 1 &&
                                metalTypeCombo?.length > 0 &&
                                storeInit?.IsMetalCustomization === 1 && (
                                    <div className="hoq_single_prod_customize_main">
                                        <div className="first_row_hoq_new">
                                            {
                                                <div className="hoq_single_prod_customize">
                                                    <label className="hoqmenuItemTimeEleveDeatil">
                                                        METAL TYPE:
                                                    </label>
                                                    {singleProd?.IsMrpBase == 1 ? (
                                                        <span
                                                            className="hoq_menuitemSelectoreMain"
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                marginLeft: "4px",
                                                            }}
                                                        >
                                                            {
                                                                metalTypeCombo?.filter(
                                                                    (ele) =>
                                                                        ele?.Metalid == singleProd?.MetalPurityid
                                                                )[0]?.metaltype
                                                            }
                                                        </span>
                                                    ) : (
                                                        <select
                                                            className="hoq_menuitemSelectoreMain"
                                                            value={selectMtType}
                                                            onChange={(e) => handleCustomChange(e, "mt")}
                                                            // onChange={(e) => setSelectMtType(e.target.value)}
                                                            style={{ fontSize: "1rem" }}
                                                        >
                                                            {metalTypeCombo.map((ele) => (
                                                                <option
                                                                    key={ele?.Metalid}
                                                                    value={ele?.metaltype}
                                                                >
                                                                    {ele?.metaltype}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            }
                                            {metalColorCombo?.length > 0 &&
                                                storeInit?.IsMetalTypeWithColor === 1 && (
                                                    <div className="hoq_single_prod_customize">
                                                        <label
                                                            className="hoqmenuItemTimeEleveDeatil"
                                                            htmlFor="metal_c_hoq"
                                                        >
                                                            METAL COLOR:
                                                        </label>
                                                        {singleProd?.IsMrpBase == 1 ? (
                                                            <span
                                                                className="hoq_menuitemSelectoreMain"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    marginLeft: "4px",
                                                                }}
                                                            >
                                                                {
                                                                    metalColorCombo?.filter(
                                                                        (ele) => ele?.id == singleProd?.MetalColorid
                                                                    )[0]?.metalcolorname
                                                                }
                                                            </span>
                                                        ) : (
                                                            <select
                                                                className="hoq_menuitemSelectoreMain"
                                                                id="metal_c_hoq"
                                                                value={selectMtColor}
                                                                onChange={(e) => handleMetalWiseColorImg(e)}
                                                                style={{ fontSize: "1rem" }}
                                                            >
                                                                {metalColorCombo?.map((ele) => (
                                                                    <option
                                                                        key={ele?.id}
                                                                        value={ele?.metalcolorname}
                                                                    >
                                                                        {ele?.metalcolorname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                        <div className="first_row_hoq_new">
                                            {storeInit?.IsDiamondCustomization === 1 &&
                                                diaQcCombo?.length > 0 &&
                                                diaList?.length ? (
                                                <div className="hoq_single_prod_customize">
                                                    <label className="hoqmenuItemTimeEleveDeatil">
                                                        DIAMOND :
                                                    </label>
                                                    {
                                                        <select
                                                            className="hoq_menuitemSelectoreMain"
                                                            value={selectDiaQc}
                                                            // onChange={(e) => setSelectDiaQc(e.target.value)}
                                                            onChange={(e) => handleCustomChange(e, "dia")}
                                                            style={{ fontSize: "1rem" }}
                                                        >
                                                            {diaQcCombo.map((ele) => (
                                                                <option
                                                                    key={ele?.QualityId}
                                                                    value={`${ele?.Quality},${ele?.color}`}
                                                                >{`${ele?.Quality},${ele?.color}`}</option>
                                                            ))}
                                                        </select>
                                                    }
                                                </div>
                                            ) : null}
                                            {storeInit?.IsCsCustomization === 1 &&
                                                selectCsQc?.length > 0 &&
                                                csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
                                                <div className="hoq_single_prod_customize">
                                                    <label className="hoqmenuItemTimeEleveDeatil">
                                                        COLOR STONE :
                                                    </label>
                                                    <select
                                                        className="hoq_menuitemSelectoreMain"
                                                        value={selectCsQc}
                                                        // onChange={(e) => setSelectCsQc(e.target.value)}
                                                        onChange={(e) => handleCustomChange(e, "cs")}
                                                        style={{ fontSize: "1rem" }}
                                                    >
                                                        {csQcCombo.map((ele) => (
                                                            <option
                                                                key={ele?.QualityId}
                                                                value={`${ele?.Quality},${ele?.color}`}
                                                            >{`${ele?.Quality},${ele?.color}`}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                SizeSorting(SizeCombo?.rd)?.length > 0 &&
                                                singleProd?.DefaultSize !== "" && (
                                                    <div
                                                        className="hoq_single_prod_customize"
                                                        style={{
                                                            width: "50%",
                                                        }}
                                                    >
                                                        <label className="hoqmenuItemTimeEleveDeatil">
                                                            SIZE:
                                                        </label>
                                                        {singleProd?.IsMrpBase == 1 ? (
                                                            <span
                                                                className="hoq_menuitemSelectoreMain"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    marginLeft: "4px",
                                                                }}
                                                            >
                                                                {singleProd?.DefaultSize}
                                                            </span>
                                                        ) : (
                                                            <select
                                                                className="hoq_menuitemSelectoreMain"
                                                                value={sizeData}
                                                                // onChange={(e) => {
                                                                //   setSizeData(e.target.value);
                                                                // }}
                                                                onChange={(e) => handleCustomChange(e, "sz")}
                                                                style={{ fontSize: "1rem" }}
                                                            >
                                                                {SizeSorting(SizeCombo?.rd)?.map((ele) => (
                                                                    <option
                                                                        value={ele?.sizename}
                                                                        // selected={
                                                                        //   singleProd && singleProd.DefaultSize === ele.sizename
                                                                        // }
                                                                        key={ele?.id}
                                                                    >
                                                                        {ele?.sizename}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        {storeInit?.IsCsCustomization === 1 &&
                                            selectCsQc?.length > 0 &&
                                            csList?.filter((ele) => ele?.D !== "MISC")?.length > 0
                                            ? SizeSorting(SizeCombo?.rd)?.length > 0 &&
                                            singleProd?.DefaultSize !== "" && (
                                                <div
                                                    className="hoq_single_prod_customize"
                                                    style={{
                                                        width: "50%",
                                                    }}
                                                >
                                                    <label className="hoqmenuItemTimeEleveDeatil">
                                                        SIZE:
                                                    </label>
                                                    {singleProd?.IsMrpBase == 1 ? (
                                                        <span
                                                            className="hoq_menuitemSelectoreMain"
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                marginLeft: "4px",
                                                            }}
                                                        >
                                                            {singleProd?.DefaultSize}
                                                        </span>
                                                    ) : (
                                                        <select
                                                            className="hoq_menuitemSelectoreMain"
                                                            value={sizeData}
                                                            // onChange={(e) => {
                                                            //   setSizeData(e.target.value);
                                                            // }}
                                                            onChange={(e) => handleCustomChange(e, "sz")}
                                                            style={{ fontSize: "1rem" }}
                                                        >
                                                            {SizeSorting(SizeCombo?.rd)?.map((ele) => (
                                                                <option
                                                                    value={ele?.sizename}
                                                                    // selected={
                                                                    //   singleProd && singleProd.DefaultSize === ele.sizename
                                                                    // }
                                                                    key={ele?.id}
                                                                >
                                                                    {ele?.sizename}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            )
                                            : null}
                                    </div>
                                )}

                            <Accordion
                                className="accordian"
                                sx={{
                                    border: "none",
                                    boxShadow: "none",
                                    "&:before": {
                                        display: "none",
                                    },
                                }}
                                key={1}
                                expanded={expandedIndex === 1}
                                onChange={handleChange(1)}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        expandedIndex === 1 ? (
                                            <RemoveIcon
                                                style={{ fontSize: "1.2rem", color: "black" }}
                                            />
                                        ) : (
                                            <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />
                                        )
                                    }
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    className="summary"
                                    sx={{
                                        padding: "0 5px",
                                    }}
                                >
                                    <Typography
                                        className="title"
                                        sx={{
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                        style={{
                                            fontSize: "0.9rem",
                                            textTransform: "uppercase",
                                            marginLeft: "3.4px",
                                        }}
                                    >
                                        MATERIAL DETAILS
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div
                                        className="smr_prod_summury_info"
                                        style={{ border: "none" }}
                                    >
                                        <div className="smr_prod_summury_info_inner" style={{ display: "flex", flexDirection: "column" }}>
                                            <span className="smr_single_prod_designno">
                                                {singleProd?.designno}
                                            </span>
                                            <span className="smr_prod_short_key">
                                                Metal Purity :{" "}
                                                <span className="smr_prod_short_val">
                                                    {selectMtType}
                                                </span>
                                            </span>
                                            <span className="smr_prod_short_key">
                                                Metal Color :{" "}
                                                <span className="smr_prod_short_val">
                                                    {selectMtColor}
                                                </span>
                                            </span>
                                            {storeInit?.IsDiamondCustomization === 1 &&
                                                diaQcCombo?.length > 0 &&
                                                diaList?.length ? (
                                                <span className="smr_prod_short_key">
                                                    Diamond Quality Color :{" "}
                                                    <span className="smr_prod_short_val">
                                                        {`${selectDiaQc}`}
                                                    </span>
                                                </span>
                                            ) : null}
                                            {storeInit?.IsMetalWeight === 1 && (
                                                <span className="smr_prod_short_key">
                                                    Net Wt :
                                                    <span className="smr_prod_short_val">
                                                        {singleProd1?.Nwt ?? singleProd?.Nwt?.toFixed(3)}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            {(diaList?.length > 0 ||
                                csList?.filter((ele) => ele?.D !== "MISC")?.length > 0) && (
                                    <Accordion
                                        className="accordian"
                                        sx={{
                                            border: "none", // Remove default border
                                            boxShadow: "none", // Remove default shadow
                                            "&:before": {
                                                // Remove the border-top pseudo-element
                                                display: "none",
                                            },
                                        }}
                                        key={2}
                                        expanded={expandedIndex === 2}
                                        onChange={handleChange(2)}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                expandedIndex === 2 ? (
                                                    <RemoveIcon
                                                        style={{ fontSize: "1.2rem", color: "black" }}
                                                    />
                                                ) : (
                                                    <AddIcon
                                                        style={{ fontSize: "1.2rem", color: "black" }}
                                                    />
                                                )
                                            }
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            className="summary"
                                            sx={{
                                                padding: "0 5px",
                                            }}
                                        >
                                            <Typography
                                                className="title"
                                                sx={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                }}
                                                style={{
                                                    fontSize: "0.9rem",
                                                    textTransform: "uppercase",
                                                    marginLeft: "3.4px",
                                                }}
                                            >
                                                PRODUCT DETAILS
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="details_d_C">
                                                <div className="hoq_material_details_portion">
                                                    {/* {diaList?.length > 0 && (
                      <p className="hoq_details_title"> Product Details</p>
                    )} */}
                                                    {/* {diaList?.length > 0 && (
                      <div className="hoq_material_details_portion_inner">
                        <ul
                          style={{
                            margin: "0px 0px 3px 0px",
                            listStyle: "none",
                          }}
                        >
                          <li
                            className="dia-title"
                            style={{ fontWeight: 600 }}
                          >{`Diamond Detail(${diaList?.reduce(
                            (accumulator, data) => accumulator + data.M,
                            0
                          )}   ${diaList
                            ?.reduce(
                              (accumulator, data) => accumulator + data?.N,
                              0
                            )
                            .toFixed(3)}ct)`}</li>
                        </ul>
                        <ul className="hoq_mt_detail_title_ul">
                          <li className="hoq_proDeatilList">Shape</li>
                          <li className="hoq_proDeatilList">Clarity</li>
                          <li className="hoq_proDeatilList">Color</li>
                          <li className="hoq_proDeatilList">Pcs &nbsp; Wt</li>
                        </ul>
                        {diaList?.map((data) => (
                          <ul className="hoq_mt_detail_title_ul">
                            <li className="hoq_proDeatilList1">{data?.F}</li>
                            <li className="hoq_proDeatilList1">{data?.H}</li>
                            <li className="hoq_proDeatilList1">{data?.J}</li>
                            <li className="hoq_proDeatilList1">
                              {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                            </li>
                          </ul>
                        ))}
                      </div>
                    )}

                    {csList?.length > 0 && (
                      <div className="hoq_material_details_portion_inner">
                        <ul style={{ margin: "10px 0px 3px 0px" }}>
                          <li
                            style={{ fontWeight: 600 }}
                          >{`ColorStone Detail(${csList?.reduce(
                            (accumulator, data) => accumulator + data.M,
                            0
                          )}/${csList
                            ?.reduce(
                              (accumulator, data) => accumulator + data?.N,
                              0
                            )
                            .toFixed(2)}ct)`}</li>
                        </ul>
                        <ul className="hoq_mt_detail_title_ul">
                          <li className="hoq_proDeatilList">Shape</li>
                          <li className="hoq_proDeatilList">Clarity</li>
                          <li className="hoq_proDeatilList">Color</li>
                          <li className="hoq_proDeatilList">Pcs/Wt</li>
                        </ul>
                        {csList?.map((data) => (
                          <ul className="hoq_mt_detail_title_ul">
                            <li className="hoq_proDeatilList1">{data?.F}</li>
                            <li className="hoq_proDeatilList1">{data?.H}</li>
                            <li className="hoq_proDeatilList1">{data?.J}</li>
                            <li className="hoq_proDeatilList1">
                              {data.M}/{data?.N?.toFixed(3)}
                            </li>
                          </ul>
                        ))}
                      </div>
                    )} */}
                                                    {diaList?.length > 0 && (
                                                        <div className="hoq_material_details_portion_inner">
                                                            <ul style={{ margin: "0px 0px 3px 0px" }}>
                                                                <li
                                                                    style={{ fontWeight: 600 }}
                                                                >{`Diamond Detail (${diaList?.reduce(
                                                                    (accumulator, data) => accumulator + data.M,
                                                                    0
                                                                )}   ${diaList
                                                                    ?.reduce(
                                                                        (accumulator, data) => accumulator + data?.N,
                                                                        0
                                                                    )
                                                                    .toFixed(3)}ct)`}</li>
                                                            </ul>
                                                            <ul className="hoq_mt_detail_title_ul">
                                                                <li className="hoq_proDeatilList">Shape</li>
                                                                <li className="hoq_proDeatilList">Clarity</li>
                                                                <li className="hoq_proDeatilList">Color</li>
                                                                <li className="hoq_proDeatilList">
                                                                    Pcs&nbsp;&nbsp;Wt
                                                                </li>
                                                            </ul>
                                                            {diaList?.map((data) => (
                                                                <ul className="hoq_mt_detail_title_ul">
                                                                    <li className="hoq_proDeatilList1">
                                                                        {data?.F}
                                                                    </li>
                                                                    <li className="hoq_proDeatilList1">
                                                                        {data?.H}
                                                                    </li>
                                                                    <li className="hoq_proDeatilList1">
                                                                        {data?.J}
                                                                    </li>
                                                                    <li className="hoq_proDeatilList1">
                                                                        {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                                                                    </li>
                                                                </ul>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* {console.log("csListcsList",csList?.filter((ele)=>ele?.D === "MISC"))} */}
                                                    {csList?.filter((ele) => ele?.D !== "MISC")?.length >
                                                        0 && (
                                                            <div className="hoq_material_details_portion_inner">
                                                                <ul style={{ margin: "10px 0px 3px 0px" }}>
                                                                    <li
                                                                        style={{ fontWeight: 600 }}
                                                                    >{`ColorStone Detail (${csList
                                                                        ?.filter((ele) => ele?.D !== "MISC")
                                                                        ?.reduce(
                                                                            (accumulator, data) => accumulator + data.M,
                                                                            0
                                                                        )} ${csList
                                                                            ?.filter((ele) => ele?.D !== "MISC")
                                                                            ?.reduce(
                                                                                (accumulator, data) => accumulator + data?.N,
                                                                                0
                                                                            )
                                                                            .toFixed(3)}ct)`}</li>
                                                                </ul>
                                                                <ul className="hoq_mt_detail_title_ul">
                                                                    <li className="hoq_proDeatilList">Shape</li>
                                                                    <li className="hoq_proDeatilList">Clarity</li>
                                                                    <li className="hoq_proDeatilList">Color</li>
                                                                    <li className="hoq_proDeatilList">
                                                                        Pcs&nbsp;&nbsp;Wt
                                                                    </li>
                                                                </ul>
                                                                {csList
                                                                    ?.filter((ele) => ele?.D !== "MISC")
                                                                    ?.map((data) => (
                                                                        <ul className="hoq_mt_detail_title_ul">
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data?.F}
                                                                            </li>
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data?.H}
                                                                            </li>
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data?.J}
                                                                            </li>
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                                                                            </li>
                                                                        </ul>
                                                                    ))}
                                                            </div>
                                                        )}

                                                    {csList?.filter((ele) => ele?.D === "MISC")?.length >
                                                        0 && (
                                                            <div className="hoq_material_details_portion_inner">
                                                                <ul style={{ margin: "10px 0px 3px 0px" }}>
                                                                    <li
                                                                        style={{ fontWeight: 600 }}
                                                                    >{`MISC Detail(${csList
                                                                        ?.filter((ele) => ele?.D === "MISC")
                                                                        ?.reduce(
                                                                            (accumulator, data) => accumulator + data.M,
                                                                            0
                                                                        )}  ${csList
                                                                            ?.filter((ele) => ele?.D === "MISC")
                                                                            ?.reduce(
                                                                                (accumulator, data) => accumulator + data?.N,
                                                                                0
                                                                            )
                                                                            .toFixed(3)}gm)`}</li>
                                                                </ul>
                                                                <ul className="hoq_mt_detail_title_ul">
                                                                    <li className="hoq_proDeatilList">Shape</li>
                                                                    <li className="hoq_proDeatilList">Clarity</li>
                                                                    <li className="hoq_proDeatilList">Color</li>
                                                                    <li className="hoq_proDeatilList">
                                                                        Pcs&nbsp;&nbsp;Wt
                                                                    </li>
                                                                </ul>
                                                                {csList
                                                                    ?.filter((ele) => ele?.D === "MISC")
                                                                    ?.map((data) => (
                                                                        <ul className="hoq_mt_detail_title_ul">
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data?.F}
                                                                            </li>
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data?.H}
                                                                            </li>
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data?.J}
                                                                            </li>
                                                                            <li className="hoq_proDeatilList1">
                                                                                {data.M}&nbsp;&nbsp;{data?.N?.toFixed(3)}
                                                                            </li>
                                                                        </ul>
                                                                    ))}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                )}

                            {storeInit?.IsPriceShow === 1 &&
                                storeInit?.IsPriceBreakUp == 1 &&
                                (singleProd1 ?? singleProd)?.IsMrpBase !== 1 && (
                                    <Accordion
                                        className="accordian"
                                        key={3}
                                        sx={{
                                            border: "none", // Remove default border
                                            boxShadow: "none", // Remove default shadow
                                            "&:before": {
                                                // Remove the border-top pseudo-element
                                                display: "none",
                                            },
                                        }}
                                        expanded={expandedIndex === 3}
                                        onChange={handleChange(3)}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                expandedIndex === 3 ? (
                                                    <RemoveIcon
                                                        style={{ fontSize: "1.2rem", color: "black" }}
                                                    />
                                                ) : (
                                                    <AddIcon
                                                        style={{ fontSize: "1.2rem", color: "black" }}
                                                    />
                                                )
                                                // <AddIcon
                                                //   style={{ fontSize: "1.2rem", color: "black" }}
                                                // />
                                            }
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            className="summary-hoq"
                                            sx={{
                                                padding: "0 5px",
                                            }}
                                        >
                                            <Typography
                                                className="title"
                                                sx={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                }}
                                                style={{
                                                    fontSize: "0.9rem",
                                                    textTransform: "uppercase",
                                                    marginLeft: "3.4px",
                                                }}
                                            >
                                                Price Breakup
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {(singleProd1?.Metal_Cost
                                                ? singleProd1?.Metal_Cost
                                                : singleProd?.Metal_Cost) !== 0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography className="smr_Price_breakup_label">
                                                        Metal
                                                    </Typography>
                                                    <span style={{ display: "flex" }}>
                                                        <Typography>
                                                            {
                                                                <span
                                                                    style={{ paddingRight: "0.4rem" }}
                                                                    className="smr_currencyFont"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: decodeEntities(
                                                                            loginInfo?.CurrencyCode
                                                                        ),
                                                                    }}
                                                                />
                                                            }
                                                        </Typography>
                                                        <Typography>
                                                            {(singleProd1?.Metal_Cost
                                                                ? singleProd1?.Metal_Cost
                                                                : singleProd?.Metal_Cost
                                                            )?.toFixed(2)}
                                                        </Typography>
                                                    </span>
                                                </div>
                                            ) : null}
                                            {(singleProd1?.Diamond_Cost
                                                ? singleProd1?.Diamond_Cost
                                                : singleProd?.Diamond_Cost) !== 0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography className="smr_Price_breakup_label">
                                                        Diamond{" "}
                                                    </Typography>

                                                    <span style={{ display: "flex" }}>
                                                        <Typography>
                                                            {
                                                                <span
                                                                    style={{ paddingRight: "0.4rem" }}
                                                                    className="smr_currencyFont"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: decodeEntities(
                                                                            loginInfo?.CurrencyCode
                                                                        ),
                                                                    }}
                                                                />
                                                            }
                                                        </Typography>
                                                        <Typography>
                                                            {(singleProd1?.Diamond_Cost
                                                                ? singleProd1?.Diamond_Cost
                                                                : singleProd?.Diamond_Cost
                                                            )?.toFixed(2)}
                                                        </Typography>
                                                    </span>
                                                </div>
                                            ) : null}

                                            {(singleProd1?.ColorStone_Cost
                                                ? singleProd1?.ColorStone_Cost
                                                : singleProd?.ColorStone_Cost) !== 0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography className="smr_Price_breakup_label">
                                                        Stone{" "}
                                                    </Typography>

                                                    <span style={{ display: "flex" }}>
                                                        <Typography>
                                                            {
                                                                <span
                                                                    style={{ paddingRight: "0.4rem" }}
                                                                    className="smr_currencyFont"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: decodeEntities(
                                                                            loginInfo?.CurrencyCode
                                                                        ),
                                                                    }}
                                                                />
                                                            }
                                                        </Typography>
                                                        <Typography>
                                                            {(singleProd1?.ColorStone_Cost
                                                                ? singleProd1?.ColorStone_Cost
                                                                : singleProd?.ColorStone_Cost
                                                            )?.toFixed(2)}
                                                        </Typography>
                                                    </span>
                                                </div>
                                            ) : null}

                                            {(singleProd1?.Misc_Cost
                                                ? singleProd1?.Misc_Cost
                                                : singleProd?.Misc_Cost) !== 0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography className="smr_Price_breakup_label">
                                                        MISC{" "}
                                                    </Typography>

                                                    <span style={{ display: "flex" }}>
                                                        <Typography>
                                                            {
                                                                <span
                                                                    style={{ paddingRight: "0.4rem" }}
                                                                    className="smr_currencyFont"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: decodeEntities(
                                                                            loginInfo?.CurrencyCode
                                                                        ),
                                                                    }}
                                                                />
                                                            }
                                                        </Typography>
                                                        <Typography>
                                                            {(singleProd1?.Misc_Cost
                                                                ? singleProd1?.Misc_Cost
                                                                : singleProd?.Misc_Cost
                                                            )?.toFixed(2)}
                                                        </Typography>
                                                    </span>
                                                </div>
                                            ) : null}

                                            {(singleProd1?.Labour_Cost
                                                ? singleProd1?.Labour_Cost
                                                : singleProd?.Labour_Cost) !== 0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography className="smr_Price_breakup_label">
                                                        Labour{" "}
                                                    </Typography>

                                                    <span style={{ display: "flex" }}>
                                                        <Typography>
                                                            {
                                                                <span
                                                                    style={{ paddingRight: "0.4rem" }}
                                                                    className="smr_currencyFont"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: decodeEntities(
                                                                            loginInfo?.CurrencyCode
                                                                        ),
                                                                    }}
                                                                />
                                                            }
                                                        </Typography>
                                                        <Typography>
                                                            {(singleProd1?.Labour_Cost
                                                                ? singleProd1?.Labour_Cost
                                                                : singleProd?.Labour_Cost
                                                            )?.toFixed(2)}
                                                        </Typography>
                                                    </span>
                                                </div>
                                            ) : null}

                                            {(singleProd1?.Other_Cost
                                                ? singleProd1?.Other_Cost
                                                : singleProd?.Other_Cost) +
                                                (singleProd1?.Size_MarkUp
                                                    ? singleProd1?.Size_MarkUp
                                                    : singleProd?.Size_MarkUp) +
                                                (singleProd1?.DesignMarkUpAmount
                                                    ? singleProd1?.DesignMarkUpAmount
                                                    : singleProd?.DesignMarkUpAmount) +
                                                (singleProd1?.ColorStone_SettingCost
                                                    ? singleProd1?.ColorStone_SettingCost
                                                    : singleProd?.ColorStone_SettingCost) +
                                                (singleProd1?.Diamond_SettingCost
                                                    ? singleProd1?.Diamond_SettingCost
                                                    : singleProd?.Diamond_SettingCost) +
                                                (singleProd1?.Misc_SettingCost
                                                    ? singleProd1?.Misc_SettingCost
                                                    : singleProd?.Misc_SettingCost) !==
                                                0 ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography className="smr_Price_breakup_label">
                                                        Other{" "}
                                                    </Typography>

                                                    <span style={{ display: "flex" }}>
                                                        <Typography>
                                                            {
                                                                <span
                                                                    style={{ paddingRight: "0.4rem" }}
                                                                    className="smr_currencyFont"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: decodeEntities(
                                                                            loginInfo?.CurrencyCode
                                                                        ),
                                                                    }}
                                                                />
                                                            }
                                                        </Typography>
                                                        <Typography>
                                                            {(
                                                                (singleProd1?.Other_Cost
                                                                    ? singleProd1?.Other_Cost
                                                                    : singleProd?.Other_Cost) +
                                                                (singleProd1?.Size_MarkUp
                                                                    ? singleProd1?.Size_MarkUp
                                                                    : singleProd?.Size_MarkUp) +
                                                                (singleProd1?.DesignMarkUpAmount
                                                                    ? singleProd1?.DesignMarkUpAmount
                                                                    : singleProd?.DesignMarkUpAmount) +
                                                                (singleProd1?.ColorStone_SettingCost
                                                                    ? singleProd1?.ColorStone_SettingCost
                                                                    : singleProd?.ColorStone_SettingCost) +
                                                                (singleProd1?.Diamond_SettingCost
                                                                    ? singleProd1?.Diamond_SettingCost
                                                                    : singleProd?.Diamond_SettingCost) +
                                                                (singleProd1?.Misc_SettingCost
                                                                    ? singleProd1?.Misc_SettingCost
                                                                    : singleProd?.Misc_SettingCost)
                                                            )?.toFixed(2)}
                                                        </Typography>
                                                    </span>
                                                </div>
                                            ) : null}
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            <div className="btn_Section">
                                <button
                                    className={
                                        !addToCartFlag
                                            ? "hoq_AddToCart_btn"
                                            : "hoq_AddToCart_btn_afterCart"
                                    }
                                    onClick={() => handleCart(!addToCartFlag)}
                                >
                                    <span
                                        className="hoq_addtocart_btn_txt"
                                        style={{
                                            color: !addToCartFlag ? "" : "white",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}
                                    </span>
                                </button>
                                <button onClick={() => handleWishList(!wishListFlag)}>
                                    <span className="hoq_addtocart_btn_txt">
                                        {!wishListFlag ? "ADD TO Wislist" : "Remove from wishlist"}
                                    </span>
                                    <FaHeart />
                                </button>
                                <div className="delivery_hoq">
                                    {singleProd?.InStockDays !== 0 && (
                                        <span>
                                            <CiDeliveryTruck size={24} /> Express Shipping in Stock{" "}
                                            {singleProd?.InStockDays} Days Delivery
                                        </span>
                                    )}
                                    {singleProd?.MakeOrderDays != 0 && (
                                        <span>
                                            Make To Order {singleProd?.MakeOrderDays} Days Delivery
                                        </span>
                                    )}
                                </div>
                                {/* <div className="product_ins_banner">
                <img
                  src="https://houseofquadri.com/cdn/shop/files/IGI_Certified_1_1024x.png?v=1712319485"
                  alt=""
                />
              </div> */}
                                <WhatsAppButton message="Hello, Talk to a Jewellery expert now!" />
                            </div>
                        </div>
                    </div>
                </main>
                {stockItemArr?.length > 0 &&
                    storeInit?.IsStockWebsite === 1 && stockItemArr?.[0]?.stat_code != 1005 && (
                        <Stockitems
                            stockItemArr={stockItemArr}
                            storeInit={storeInit}
                            loginInfo={loginInfo}
                            cartArr={cartArr}
                            handleCartandWish={handleCartandWish}
                            check={storeInit?.IsPriceShow === 1}
                        />
                    )}
                {storeInit?.IsProductDetailSimilarDesign == 1 &&
                    SimilarBrandArr?.length > 0 && SimilarBrandArr?.[0]?.stat_code != 1005 && (
                        <RelatedProduct
                            SimilarBrandArr={SimilarBrandArr}
                            handleMoveToDetail={handleMoveToDetail}
                            storeInit={storeInit}
                            loginInfo={loginInfo}
                            check={storeInit?.IsPriceShow === 1}
                        />
                    )}
                {storeInit?.IsProductDetailDesignSet === 1 &&
                    designSetList?.length > 0 && designSetList?.[0]?.stat_code != 1005 && (
                        <DesignSet
                            designSetList={designSetList}
                            handleMoveToDetail={handleMoveToDetail}
                            imageNotFound={imageNotFound}
                            loginInfo={loginInfo}
                            storeInit={storeInit}
                            check={storeInit?.IsPriceShow === 1}
                        />
                    )}

                {/* <RecentlyViewd /> hold on */}
            </div>
        </>
    );
};

export default ProductPage;

const NotFoundProduct = ({ navigate }) => {
    return (
        <div className="not-found-product">
            <h2>Product Not Found</h2>
            <p>We couldn't find the product you're looking for.</p>
            <button onClick={() => navigate.push(-1)}>
                <IoMdArrowBack size={18} /> Go Back To Previous Page
            </button>
        </div>
    );
};

const MagnifierSlider = ({ product, close, list, currentIndex }) => {
    const swiperRef = useRef(null);

    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    return (
        <>
            <div className="MagnifierSlider">
                <Swiper
                    ref={swiperRef}
                    zoom={true}
                    navigation={false}
                    pagination={false}
                    spaceBetween={30}
                    loop={true}
                    modules={[Zoom, Navigation, Pagination]}
                    className="mySwiper"
                    effect="fade"
                >
                    {list?.map((val, i) => {
                        if (val?.type === "video") {
                            return null;
                        }
                        return (
                            <SwiperSlide>
                                <div className="swiper-zoom-container">
                                    <img src={val?.src} loading="lazy" onError={(e) => e.target.src = imageNotFound} />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    <div className="controller">
                        <button onClick={goPrev}>
                            <FaChevronLeft />
                        </button>
                        <button onClick={close}>
                            <IoMdClose size={27} />
                        </button>
                        <button onClick={goNext}>
                            <FaChevronRight />
                        </button>
                    </div>
                </Swiper>
            </div>
        </>
    );
};

const WhatsAppButton = ({
    message = "Hello, Talk to a Jewellery expert now!",
}) => {
    const whatsappUrl = `https://web.whatsapp.com/send?phone=9099889962&text=${encodeURIComponent(
        message
    )}`;
    const whatsappMobileUrl = `https://api.whatsapp.com/send?phone=9099889962&text=${encodeURIComponent(
        message
    )}`;

    function detectOS() {
        const userAgent = window.navigator.userAgent;

        if (/android/i.test(userAgent)) {
            return "Android";
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        } else if (/macintosh|mac os x/i.test(userAgent)) {
            return "macOS";
        } else if (/windows nt/i.test(userAgent)) {
            return "Windows";
        } else if (/linux/i.test(userAgent)) {
            return "Linux";
        } else {
            return "Unknown OS";
        }
    }

    const HandleWhatsApp = () => {
        const os = detectOS();
        const whatsappLink =
            os === "macOS" || os === "iOS" ? whatsappMobileUrl : whatsappUrl;
        window.location.href = whatsappLink;
    };
    return (
        <div className="whatsapp_btn">
            <div className="wa" onClick={() => HandleWhatsApp()}>
                <div className="left">
                    <FaWhatsapp size={50} color="white" className="wa-hoq" />
                </div>
                <div className="con">
                    <h4>
                        Optigo Apps <span>Online</span>
                    </h4>
                    <h3>Need Help ? Chat With Us</h3>
                </div>
            </div>
        </div>
    );
};
