'use client';
import { useEffect, useRef, useState } from "react";
import { AppBar, Toolbar, Box, IconButton, Container, Drawer, Typography, useMediaQuery, useTheme, alpha, Badge } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Menu as MenuIcon } from "lucide-react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import ImageSide from "./ImageSide";
import MobileMenu from "./MobileMenu";
import RightSideMenu from "./RightSideMenu";
import Link from "next/link";
import Cookies from "js-cookie";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import Pako from "pako";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import SearchBarToggle from "./SearchBarToggle";
import DrawerSearchBar from "./DrawerSearchbar";
import { Search as SearchIcon, Heart as FavoriteIcon, User as PersonIcon, ShoppingCart as ShoppingBagIcon, LogOut } from "lucide-react";
import { Masonry } from "@mui/lab";
// import OfferBar from "./OfferBar";
// import WioNav from "./WioNav";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";
import { clearSession } from "@/app/(core)/utils/FetchSessionData";
import { getPricingContext, buildMenuCacheKey } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";



const MaxNavbar = ({ storeinit, logos }) => {
    const { islogin, setislogin, cartCountNum, setCartCountNum, wishCountNum, setWishCountNum, setCartOpenStateB2C,
        loginUserDetail
    } = useStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const is1400px = useMediaQuery(theme.breakpoints.down("1400"));
    const is768px = useMediaQuery("(max-width:428px)");
    const IsSetupFor = true;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [menuStack, setMenuStack] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const controls = useAnimation();
    const [isHovered, setIsHovered] = useState(false);
    const [burgerMenu, setBurgerMenu] = useState(false);
    const [burgerMenu1, setBurgerMenu1] = useState(false);
    const [mobilenav, setMobilenav] = useState(false);
    const [DrawerSearchOpen, setDrawerSearchOpen] = useState(false);
    const Router = useNextRouterLikeRR().push;
    const navigate = url => Router(url);
    const location = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const [showBtn, setShowBtn] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);
    const [menuData, setMenuData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [selectedData, setSelectedData] = useState([]);
    const isMounted = useRef(false);
    const [menuId, setMenuId] = useState("");
    const [menuHoverTimeout, setMenuHoverTimeout] = useState(null);
    const menuRef = useRef(null);
    const navItemRefs = useRef({});

    const compnyLogo = logos?.web;
    const compnyLogoM = logos?.mobile;


    const MoveToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;
    // B2C = IsB2BWebsite === 0 (guests can browse without login)
    const IsB2CWebsiteChek = storeinit?.IsB2BWebsite == 0;

    const GetCompanyLogo = async () => {
        try {
            const value = JSON?.parse(sessionStorage?.getItem("LoginUser"));
            setislogin(value);
            const storeData = JSON?.parse(sessionStorage?.getItem("storeInit"));
            window.scroll({ behavior: "smooth", top: 0 });
        } catch (error) {
            console.log(error);
        }
    };



    // 2026-04-21: For B2C sites, fetch menu on initial mount so guests see the menu without logging in.
    useEffect(() => {
        const storeData = JSON.parse(sessionStorage.getItem("storeInit"));
        if (storeData?.IsB2BWebsite === 0) {
            getMenuApi();
        }
    }, []);

    useEffect(() => {
        if (location === "/") {

            setIsScrolled(true);
        } else {
            // All other pages → always scrolled style
            setIsScrolled(true);
        }
        setIsScrolled(true);

    }, [location]);


    useEffect(() => {
        controls.start({
            backgroundColor: isHovered || isScrolled ? "#ffffff" : "rgba(255,255,255,0)",
            color: isHovered || isScrolled ? "#000000" : "#ffffff",
            boxShadow: isHovered || isScrolled ? "0 6px 30px rgba(0,0,0,0.08)" : "0 0px 0px rgba(0,0,0,0)",
            backdropFilter: isHovered || isScrolled ? "blur(8px)" : "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 45,  // ↓ softer bounce
                damping: 15,    // ↓ smoother rebound
                mass: 0.8,      // ↓ lighter feel
                duration: 0.8,  // ensures fluid delay
            },
        });
    }, [isHovered, isScrolled, controls]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
        let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));
        if (storeinit?.IsB2BWebsite == 0 || (storeinit?.IsB2BWebsite == 1 && isUserLogin === true)) {
            getMenuApi();
        } else {
            getMenuApi();
        }
    }, [islogin]);

    useEffect(() => {
        const uniqueMenuIds = [...new Set(menuData?.map((item) => item?.menuid))];
        const uniqueMenuItems = uniqueMenuIds.map((menuid) => {
            const item = menuData?.find((data) => data?.menuid === menuid);
            const param1DataIds = [...new Set(menuData?.filter((data) => data?.menuid === menuid)?.map((item) => item?.param1dataid))];

            const param1Items = param1DataIds.map((param1dataid) => {
                const param1Item = menuData?.find((data) => data?.menuid === menuid && data?.param1dataid === param1dataid);
                const param2Items = menuData
                    ?.filter((data) => data?.menuid === menuid && data?.param1dataid === param1dataid)
                    ?.map((item) => ({
                        param2dataid: item?.param2dataid,
                        param2dataname: item?.param2dataname,
                        param2id: item?.param2id,
                        param2name: item?.param2name,
                        IsFilterKey2Ignore: item?.IsFilterKey1Ignore,
                    }));
                return {
                    menuname: param1Item?.menuname,
                    param1dataid: param1Item?.param1dataid,
                    param1dataname: param1Item?.param1dataname,
                    param1id: param1Item?.param1id,
                    param1name: param1Item?.param1name,
                    param2: param2Items,
                    IsFilterKey1Ignore: param1Item?.IsFilterKey1Ignore,
                };
            });

            return {
                menuid: item?.menuid,
                menuname: item?.menuname,
                param0dataid: item?.param0dataid,
                param0dataname: item?.param0dataname,
                param0id: item?.param0id,
                param0name: item?.param0name,
                param1: param1Items,
                IsFilterKey1Ignore: item?.IsFilterKey1Ignore,
                displayorder: item?.displayorder
            };
        });
        const sortedMenuItems = uniqueMenuItems?.sort((a, b) => a?.displayorder - b?.displayorder);
        setMenuItems(sortedMenuItems);
        // setMenuItems(uniqueMenuItems);
    }, [menuData]);

    const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
        if (
            param?.menuname === "Collection" &&
            param?.key === "Auto" &&
            param?.value === "" &&
            Object.keys(param1 || {}).length === 0 &&
            Object.keys(param2 || {}).length === 0
        ) {
            navigate('/collection')
            return;
        }
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
            console.log("🚀 ~ handelMenu ~ queryParameters1:", queryParameters1)

            const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`]
                // .filter(Boolean)
                .join(",");
            console.log("🚀 ~ handelMenu ~ queryParameters:", queryParameters)

            const otherparamUrl = Object.entries({
                b: finalData?.FilterKey,
                g: finalData?.FilterKey1,
                c: finalData?.FilterKey2,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(",");
            console.log("🚀 ~ handelMenu ~ otherparamUrl:", otherparamUrl)

            const paginationParam = [`page=${finalData.page ?? 1}`, `size=${finalData.size ?? 50}`].join("&");

            // console.log("otherparamsUrl--", otherparamUrl);

            let menuEncoded = `${queryParameters}/${otherparamUrl}`;
            // const url = `/productlist?V=${queryParameters}/K=${otherparamUrl}`;
            const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
            console.log("🚀 ~ handelMenu ~ url:", url)

            // let d = new Date();
            // let randomno = Math.floor(Math.random() * 1000 * d.getMilliseconds() * d.getSeconds() * d.getDate() * d.getHours() * d.getMinutes())
            navigate(url);
            setMobileOpen(false);
            setActiveMenu(null);
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        if (mobileOpen) {
            setActiveMenu(null);
            setMenuStack([]);
        }
    };

    const handleMobileMenuClick = (label, hasSubMenu) => {
        if (hasSubMenu) {
            setMenuStack([...menuStack, activeMenu || "main"]);
            setActiveMenu(label);
        }
    };

    const handleMobileBack = () => {
        const newStack = [...menuStack];
        const previousMenu = newStack.pop();
        setMenuStack(newStack);
        setActiveMenu(previousMenu === "main" ? null : previousMenu || null);
    };

    const getMenuApi = async () => {
        const { IsB2BWebsite } = storeinit || {};
        const visiterID = Cookies.get("visiterId");
        let finalId;
        if (IsB2BWebsite === 0) {
            finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
        } else {
            finalId = loginUserDetail?.id || "0";
        }

        const pricingContext = getPricingContext(loginUserDetail, storeinit, islogin);
        let cacheKey = "";
        if (pricingContext) {
            const eventName = "elvee_maxmenu_menu";
            const { key } = buildMenuCacheKey(eventName, storeinit, pricingContext, finalId);
            cacheKey = key;
            try {
                const cacheRes = await readCache(key);
                if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
                    console.log("[Elvee MaxMenu Menu] Serving from cache");
                    setMenuData(cacheRes.data);
                    return;
                }
            } catch (err) {
                console.error("Cache read error:", err);
            }
        }

        try {
            const response = await GetMenuAPI(finalId);
            const apiData = response?.Data?.rd || [];
            setMenuData(apiData);
            if (apiData.length > 0 && cacheKey) {
                writeCache(cacheKey, apiData).catch(console.error);
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleMouseEnter = (index, param) => {
        setHoveredIndex(index);
        setExpandedMenu(index);
        setSelectedData(menuItems[index] || []);
        document.body.style.overflow = "hidden";
    };
    const handleMouseLeave = (index) => {
        setExpandedMenu(null);
        // setHoveredIndex(null);
        document.body.style.overflow = "auto";
    };

    // const handleLogout = () => {
    //     setislogin(false);
    //     sessionStorage.clear();
    //     sessionStorage.setItem("LoginUser", false);
    //     sessionStorage.removeItem("storeInit");
    //     sessionStorage.removeItem("loginUserDetail");
    //     sessionStorage.removeItem("remarks");
    //     sessionStorage.removeItem("selectedAddressId");
    //     sessionStorage.removeItem("orderNumber");
    //     sessionStorage.removeItem("registerEmail");
    //     sessionStorage.removeItem("UploadLogicalPath");
    //     sessionStorage.removeItem("remarks");
    //     sessionStorage.removeItem("registerMobile");
    //     // navigate('/')
    //     window.location.to = "/";
    //     // window.location.reload();
    // };


    const handleLogout = () => {
        setislogin(false);
        Cookies.remove("userLoginCookie");
        Cookies.remove("LoginUser");
        sessionStorage.setItem("LoginUser", false);
        sessionStorage.removeItem("storeInit");
        sessionStorage.removeItem("loginUserDetail");
        sessionStorage.removeItem("remarks");
        sessionStorage.removeItem("selectedAddressId");
        sessionStorage.removeItem("orderNumber");
        sessionStorage.removeItem("registerEmail");
        sessionStorage.removeItem("UploadLogicalPath");
        sessionStorage.removeItem("registerMobile");
        sessionStorage.removeItem("allproductlist");
        sessionStorage.clear();
        window.location.replace("/");
        clearSession();
    };



    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "smooth",
        });
    }, []);



    const searchDataFucn = (searchText) => {
        if (searchText) {

            let obj = {
                a: "",
                b: searchText,
                m: loginUserDetail?.MetalId ?? storeinit?.MetalId,
                d: loginUserDetail?.cmboDiaQCid ?? storeinit?.cmboDiaQCid,
                c: loginUserDetail?.cmboCSQCid ?? storeinit?.cmboCSQCid,
                f: {},
            };

            let encodeObj = btoa(JSON.stringify(obj));
            navigate(`/p/${searchText}?S=${encodeObj}`);
            setSearchOpen(false);
            setDrawerSearchOpen(false);
            setMobileOpen(false);
        }
    };

    const navigateToMenu = (link) => {
        navigate(link);
        setMobileOpen(false);
        setDrawerSearchOpen(false);
        setMobileOpen(false);
    }



    return (
        <>
            {/* <OfferBar /> */}
            <motion.div animate={controls} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} style={{ position: "sticky", top: 0, zIndex: 999 }}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: "transparent !important",
                        top: 0,
                    }}
                >
                    <Container
                        maxWidth={false}
                        disableGutters
                        sx={{
                            width: "100%",
                            px: 0,
                        }}
                    >
                        <Toolbar
                            sx={{
                                justifyContent: "space-between",
                                px: { xs: 0, sm: 2 },
                                minHeight: { xs: 52, sm: 62 },
                                bgcolor: "transparent !important",
                                color: isHovered || isScrolled ? "#000" : "#fff",
                            }}
                        >



                            {searchOpen && <SearchBarToggle
                                searchOpen={searchOpen}
                                setSearchOpen={setSearchOpen}
                                searchDataFucn={searchDataFucn}
                            />}

                            {!isMobile && is1400px && (
                                <IconButton
                                    disableRipple disableFocusRipple disableTouchRipple
                                    onClick={handleDrawerToggle}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: alpha("#000", 0.05),
                                        },
                                        color: isHovered || isScrolled ? "#000" : "#fff",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                            {/* Left: Mobile Menu / Logo */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: (!isMobile && is1400px) ? 2 : 0, flex: 0, justifyContent: (!isMobile && is1400px) ? 'center' : 'flex-start' }}>
                                {isMobile && (
                                    <IconButton
                                        disableRipple disableFocusRipple disableTouchRipple
                                        onClick={handleDrawerToggle}
                                        sx={{
                                            "&:hover": {
                                                bgcolor: alpha("#000", 0.05),
                                            },
                                            color: isHovered || isScrolled ? "#000" : "#fff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <MenuIcon size={22} />
                                    </IconButton>
                                )}
                                <Box component={Link} href="/"
                                    onClick={MoveToTop}
                                >
                                    <Box component="img" src={compnyLogo} alt="SHAYN" sx={{ width: IsSetupFor ? "150px" : "110px", cursor: "pointer" }} className="el_without_headerLogo_side" />
                                </Box>
                            </Box>

                            {/* Desktop Navigation: visible when logged in (B2B) OR always for B2C */}
                            {(islogin || IsB2CWebsiteChek) && (<Box>
                                <Box>
                                    {!isMobile && !is1400px && (
                                        <>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 0.5,
                                                    flex: 1,
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {menuItems?.map((item, index) => (
                                                    <Box
                                                        key={index}
                                                        label={item?.menuname}
                                                        onMouseEnter={() => setHoveredItem(item?.menuname)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                        onClick={(e) => {
                                                            handelMenu({ menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname }, {}, {}, e, item?.IsFilterKey1Ignore);
                                                            setHoveredItem(null);
                                                        }}
                                                        sx={{
                                                            position: "relative",

                                                        }}
                                                    >
                                                        <Box
                                                            component={Link}
                                                            href={"#"}
                                                            sx={{
                                                                px: 2,
                                                                py: 3,
                                                                bgcolor: "transparent",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                fontSize: "0.84rem",
                                                                fontWeight: 500,
                                                                letterSpacing: 0.8,
                                                                textDecoration: "none",
                                                                transition: "all 0.2s ease",
                                                                position: "relative",
                                                                color: isHovered || isScrolled ? "#000" : "#fff",
                                                                "&::after": {
                                                                    content: '""',
                                                                    position: "absolute",
                                                                    top: 45,
                                                                    left: "50%",
                                                                    transform: "translateX(-50%)",
                                                                    width: hoveredItem === item?.menuname ? "80%" : "0%",
                                                                    height: 2,
                                                                    bgcolor: "#d4d4d4",
                                                                    transition: "width 0.3s ease",
                                                                },
                                                                "&::before": {
                                                                    content: '""',
                                                                    position: "absolute",
                                                                    bottom: -20,
                                                                    left: "0%",
                                                                    right: "0%",
                                                                    // height: 35,
                                                                    width: "100%",
                                                                    bgcolor: "transparent",
                                                                    transition: "width 0.3s ease",
                                                                },
                                                                outline: "none",
                                                                boxShadow: "none",
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            {item?.menuname}
                                                        </Box>
                                                        <AnimatePresence>
                                                            {item.param1 && hoveredItem === item?.menuname && (
                                                                <>
                                                                    <Box
                                                                        sx={{
                                                                            position: "fixed", left: 0,
                                                                            right: 0,
                                                                            width: "100%",
                                                                            mt: 0, height: "24px", boxShadow: "none", bgcolor: "transparent"
                                                                        }}
                                                                        onMouseEnter={() => {
                                                                            setHoveredItem(item?.menuname);
                                                                        }}
                                                                        onMouseLeave={() => {
                                                                            setHoveredItem(null);
                                                                        }}
                                                                    />
                                                                    <Box
                                                                        onMouseEnter={() => {
                                                                            setHoveredItem(item?.menuname);
                                                                        }}
                                                                        onMouseLeave={() => {
                                                                            setHoveredItem(null);
                                                                        }}
                                                                        sx={{
                                                                            position: "fixed",
                                                                            top: { xs: 52, sm: 62 }, // The exact height of your Navbar
                                                                            left: 0,
                                                                            right: 0,
                                                                            mt: 0,
                                                                            bgcolor: "red",
                                                                            borderRadius: 0,
                                                                            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                                                                            width: "100%",
                                                                            maxHeight: "80vh",
                                                                            minHeight: "400px",
                                                                            overflow: "hidden",
                                                                            display: "flex",
                                                                            zIndex: 1300,
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                flex: "1 1 auto",
                                                                                bgcolor: "#fff",
                                                                                p: { xs: 2, sm: 3, md: 4 },
                                                                                overflowY: "auto",
                                                                                overflowX: "hidden",
                                                                                width: "100%",
                                                                                scrollbarWidth: "thin",
                                                                                scrollbarColor: "#bfbfbf transparent",
                                                                                "&::-webkit-scrollbar": {
                                                                                    width: "6px",
                                                                                },
                                                                                "&::-webkit-scrollbar-thumb": {
                                                                                    backgroundColor: "#bfbfbf",
                                                                                    borderRadius: "10px",
                                                                                },
                                                                                "&::-webkit-scrollbar-thumb:hover": {
                                                                                    backgroundColor: "#a6a6a6",
                                                                                },
                                                                                "&::-webkit-scrollbar-track": {
                                                                                    background: "transparent",
                                                                                },
                                                                                scrollBehavior: "smooth",
                                                                            }}
                                                                        >
                                                                            <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 7 }} spacing={0}>
                                                                                {item?.param1?.map((section, index) => {
                                                                                    return <>
                                                                                        <Box
                                                                                            key={index}
                                                                                            sx={{
                                                                                                breakInside: "avoid",
                                                                                                marginBottom: 2,
                                                                                            }}
                                                                                        >
                                                                                            <Typography
                                                                                                component={Link}
                                                                                                href={"#"}
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation()
                                                                                                    handelMenu(
                                                                                                        { menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname }
                                                                                                        , { key: section?.param1name, value: section?.param1dataname }
                                                                                                        , {}, e, section?.IsFilterKey1Ignore)
                                                                                                    setHoveredItem(null);
                                                                                                }}
                                                                                                sx={{
                                                                                                    position: "relative",
                                                                                                    color: section?.menuname == "Collection" ? "#535353" : "#141414",
                                                                                                    fontWeight: section?.menuname == "Collection" ? 400 : 700,
                                                                                                    textDecoration: section?.menuname == "Collection" ? "none" : "none",
                                                                                                    display: "block",
                                                                                                    letterSpacing: 0.5,
                                                                                                    textTransform: "capitalize",
                                                                                                    mb: section?.menuname == "Collection" ? 0 : 1,
                                                                                                    wordWrap: "break-word",
                                                                                                    cursor: "pointer",
                                                                                                    textUnderlineOffset: "0.3rem",
                                                                                                    "&:hover": {
                                                                                                        textDecoration: "underline",
                                                                                                        textUnderlineOffset: "0.3rem",
                                                                                                    },
                                                                                                    fontSize: "0.92rem",
                                                                                                }}
                                                                                            >
                                                                                                {section?.param1dataname}
                                                                                            </Typography>

                                                                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                                                                                                {section?.param2
                                                                                                    ?.filter(
                                                                                                        (param2Item) =>
                                                                                                            param2Item?.param2dataname && param2Item?.param2dataname.trim() !== ""
                                                                                                    )
                                                                                                    .map((param2Item, param2Index) => (
                                                                                                        <Box
                                                                                                            key={param2Index}
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation();
                                                                                                                handelMenu(
                                                                                                                    {
                                                                                                                        menuname: item?.menuname,
                                                                                                                        key: item?.param0name,
                                                                                                                        value: item?.param0dataname,
                                                                                                                    },
                                                                                                                    {
                                                                                                                        key: section?.param1name,
                                                                                                                        value: section?.param1dataname,
                                                                                                                    },
                                                                                                                    {
                                                                                                                        key: param2Item?.param2name,
                                                                                                                        value: param2Item?.param2dataname,
                                                                                                                    },
                                                                                                                    e,
                                                                                                                    param2Item?.IsFilterKey2Ignore
                                                                                                                );
                                                                                                                setHoveredItem(null);
                                                                                                            }}
                                                                                                            component={Link}
                                                                                                            href={"#"}
                                                                                                            sx={{
                                                                                                                position: "relative",
                                                                                                                textAlign: "left",
                                                                                                                px: 0,
                                                                                                                color: "#535353",
                                                                                                                bgcolor: "transparent",
                                                                                                                border: "none",
                                                                                                                cursor: "pointer",
                                                                                                                fontSize: "0.88rem",
                                                                                                                textDecoration: "none",
                                                                                                                borderRadius: 1,
                                                                                                                transition: "all 0.2s ease",
                                                                                                                "&:hover": {
                                                                                                                    color: "#141414",
                                                                                                                    textDecoration: "underline",
                                                                                                                    textUnderlineOffset: "0.3rem",
                                                                                                                },
                                                                                                                outline: "none",
                                                                                                            }}
                                                                                                        >
                                                                                                            {param2Item?.param2dataname}
                                                                                                        </Box>
                                                                                                    ))}

                                                                                            </Box>
                                                                                        </Box>
                                                                                    </>
                                                                                }
                                                                                )}
                                                                            </Masonry>
                                                                        </Box>
                                                                    </Box>
                                                                </>
                                                            )}
                                                        </AnimatePresence>


                                                    </Box>
                                                ))}

                                                {(IsB2CWebsiteChek || islogin) && <Box
                                                    sx={{ position: "relative" }}>
                                                    <Box
                                                        component={Link}
                                                        href="/p/NewArrival/?N=TmV3QXJyaXZhbA=="
                                                        sx={{
                                                            px: 2,
                                                            py: 3,
                                                            bgcolor: "transparent",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            fontSize: "0.8125rem",
                                                            fontWeight: 500,
                                                            letterSpacing: 0.8,
                                                            textDecoration: "none",
                                                            transition: "all 0.2s ease",
                                                            position: "relative",
                                                            color: isHovered || isScrolled ? "#000" : "#fff",
                                                            "&::after": {
                                                                content: '""',
                                                                position: "absolute",
                                                                top: 45,
                                                                left: "50%",
                                                                transform: "translateX(-50%)",
                                                                // width: hoveredItem === item?.menuname ? "80%" : "0%",
                                                                height: 2,
                                                                bgcolor: "#d4d4d4",
                                                                transition: "width 0.3s ease",
                                                            },
                                                            outline: "none",
                                                            boxShadow: "none",
                                                        }}
                                                    >
                                                        New Arrivals
                                                    </Box>
                                                </Box>}
                                                {/* {storeinit && (
                                            <>
                                                {IsB2BWebsiteChek == 1 ? (
                                                    islogin ? (
                                                        <>
                                                            {storeinit?.IsDesignSetInMenu == 1 && (
                                                                <Box sx={{ position: "relative" }}>
                                                                    <Box
                                                                        component={Link}
                                                                        href="/Lookbook"
                                                                        sx={{
                                                                            px: 2,
                                                                            py: 3,
                                                                            bgcolor: "transparent",
                                                                            border: "none",
                                                                            cursor: "pointer",
                                                                            fontSize: "0.8125rem",
                                                                            fontWeight: 500,
                                                                            letterSpacing: 0.8,
                                                                            fontFamily: "inherit",
                                                                            textDecoration: "none",
                                                                            transition: "all 0.2s ease",
                                                                            position: "relative",
                                                                            color: isHovered || isScrolled ? "#000" : "#fff",
                                                                            "&::after": {
                                                                                content: '""',
                                                                                position: "absolute",
                                                                                top: 45,
                                                                                left: "50%",
                                                                                transform: "translateX(-50%)",
                                                                                // width: hoveredItem === item?.menuname ? "80%" : "0%",
                                                                                height: 2,
                                                                                bgcolor: "#d4d4d4",
                                                                                transition: "width 0.3s ease",
                                                                            },
                                                                            outline: "none",
                                                                            boxShadow: "none",
                                                                            textTransform: "capitalize !important"
                                                                        }}
                                                                    >
                                                                        {storeinit?.DesignSetInMenu || "LOOKBOOK"}
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </>
                                                    ) : null
                                                ) : (
                                                    <>
                                                        {storeinit?.IsDesignSetInMenu == 1 && (
                                                            <Box sx={{ position: "relative" }}>
                                                                <Box
                                                                    component={Link}
                                                                    href="/Lookbook"
                                                                    sx={{
                                                                        px: 2,
                                                                        py: 3,
                                                                        bgcolor: "transparent",
                                                                        border: "none",
                                                                        cursor: "pointer",
                                                                        fontSize: "0.8125rem",
                                                                        fontWeight: 500,
                                                                        letterSpacing: 0.8,
                                                                        fontFamily: "inherit",
                                                                        textDecoration: "none",
                                                                        transition: "all 0.2s ease",
                                                                        position: "relative",
                                                                        color: isHovered || isScrolled ? "#000" : "#fff",
                                                                        "&::after": {
                                                                            content: '""',
                                                                            position: "absolute",
                                                                            top: 45,
                                                                            left: "50%",
                                                                            transform: "translateX(-50%)",
                                                                            // width: hoveredItem === item?.menuname ? "80%" : "0%",
                                                                            height: 2,
                                                                            bgcolor: "#d4d4d4",
                                                                            transition: "width 0.3s ease",
                                                                        },
                                                                        outline: "none",
                                                                        boxShadow: "none",
                                                                    }}
                                                                >
                                                                    {storeinit?.DesignSetInMenu || "LOOKBOOK"}
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )} */}
                                                {islogin && <Box
                                                    sx={{ position: "relative" }}>
                                                    <Box
                                                        component={Link}
                                                        href="/offers"
                                                        sx={{
                                                            px: 2,
                                                            py: 3,
                                                            bgcolor: "transparent",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            fontSize: "0.8125rem",
                                                            fontWeight: 500,
                                                            letterSpacing: 0.8,
                                                            textDecoration: "none",
                                                            transition: "all 0.2s ease",
                                                            position: "relative",
                                                            color: isHovered || isScrolled ? "#000" : "#fff",
                                                            "&::after": {
                                                                content: '""',
                                                                position: "absolute",
                                                                top: 45,
                                                                left: "50%",
                                                                transform: "translateX(-50%)",
                                                                // width: hoveredItem === item?.menuname ? "80%" : "0%",
                                                                height: 2,
                                                                bgcolor: "#d4d4d4",
                                                                transition: "width 0.3s ease",
                                                            },
                                                            outline: "none",
                                                            boxShadow: "none",
                                                        }}
                                                    >
                                                        Offers
                                                    </Box>
                                                </Box>}

                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>)}

                            <RightSideMenu
                                setSearchOpen={setSearchOpen}
                                IsB2BWebsiteChek={IsB2BWebsiteChek}
                                storeinit={storeinit}
                                handleLogout={handleLogout}
                                islogin={islogin}
                                isMobile={isMobile}
                                cartCount={cartCountNum}
                                wishCount={wishCountNum}
                                is768px={is768px}
                                navigate={navigate} isHovered={isHovered} isScrolled={isScrolled} />
                        </Toolbar>
                    </Container>
                </AppBar>
            </motion.div>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: { xs: "85%", sm: 380 },
                        maxWidth: "100%",
                    },
                }}
            >
                {DrawerSearchOpen && <DrawerSearchBar
                    setSearchOpen={setDrawerSearchOpen}
                    searchDataFucn={searchDataFucn}
                />}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
                    }}
                >
                    <Box
                        onClick={MoveToTop}
                        component="img" src={compnyLogoM} alt="SHAYN" sx={{}} />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.6
                        }}
                    >
                        {islogin && <IconButton
                            onClick={() => setDrawerSearchOpen((prev) => !prev)}
                            sx={{
                                color: "#000",
                            }}
                        >
                            <SearchIcon style={{ fontSize: "18px", color: "inherit" }} />
                        </IconButton>}
                        {islogin && <IconButton
                            sx={{
                                color: "#000",
                            }}
                            onClick={() => navigateToMenu("/myWishList")}
                        >
                            <Badge badgeContent={wishCountNum || 0} color="error">
                                <FavoriteIcon style={{ fontSize: "18px", color: "inherit" }} />
                            </Badge>
                        </IconButton>}
                        <IconButton onClick={handleDrawerToggle}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <MobileMenu
                    activeMenu={activeMenu}
                    menuItems={menuItems}
                    handleMobileMenuClick={handleMobileMenuClick}
                    handleMobileBack={handleMobileBack}
                    handelMenu={handelMenu}
                    islogin={islogin}
                    storeinit={storeinit}
                    IsB2BWebsiteChek={IsB2BWebsiteChek}
                />
            </Drawer>
        </>
    );
};

export default MaxNavbar;
