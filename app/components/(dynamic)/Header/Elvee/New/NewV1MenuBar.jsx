import { useEffect, useRef, useState, useMemo } from "react";
import { AppBar, Toolbar, Box, IconButton, Container, Drawer, Typography, useMediaQuery, useTheme, alpha, Badge } from "@mui/material";
import { Close as CloseIcon, } from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from "recoil";
import { el_CartCount, el_companyLogo, el_companyLogoM, el_loginState, el_WishCount } from "../../../../Recoil/atom";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import MobileMenu from "./MobileMenu";
import RightSideMenu from "./RightSideMenu";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { GetCountAPI } from "../../../../../../../utils/API/GetCount/GetCountAPI";
import { GetMenuAPI } from "../../../../../../../utils/API/GetMenuAPI/GetMenuAPI";
import SearchBarToggle from "./SearchBarToggle";
import DrawerSearchBar from "./DrawerSearchbar";
import { Masonry } from "@mui/lab";
import { buildMenuItems } from './MenuBuilder';
import { Search as SearchIcon ,Menu as MenuIcon, Heart as FavoriteIcon, User as PersonIcon, ShoppingCart as ShoppingBagIcon, LogOut } from "lucide-react";

const PremiumNavbar = () => {
    const theme = useTheme();
    // Media Queries
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const is1400px = useMediaQuery(theme.breakpoints.down("1400"));
    const is768px = useMediaQuery("(max-width:428px)");

    // Navigation & Location
    const navigate = useNavigate();
    const navigation = useNavigate(); 
    const location = useLocation();

    // Recoil State
    const [islogin, setislogin] = useRecoilState(el_loginState);
    const [cartCount, setCartCount] = useRecoilState(el_CartCount);
    const [wishCount, setWishCount] = useRecoilState(el_WishCount);
    const compnyLogo = useRecoilValue(el_companyLogo);
    const compnyLogoM = useRecoilValue(el_companyLogoM);

    // Local State
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [menuStack, setMenuStack] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null); // Tracks the top navbar ProductType (e.g. Diamond)
    const [activeSubMenu, setActiveSubMenu] = useState(null); // Tracks the Sidebar item (e.g. Bangle)
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [storeinit, setStoreInit] = useState(null);
    const [DrawerSearchOpen, setDrawerSearchOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    
    // Data State
    const [multiMenuData, setMultiMenuData] = useState({}); 

    // Refs & Animations
    const controls = useAnimation();
    const isMounted = useRef(false);

    // 1. Get Dynamic Menu List (Product Types)
    const getDynamicMenu = () => {
        try {
            const raw = sessionStorage.getItem("DyamicMenuList");
            if (!raw) return null; 
            return JSON.parse(raw); 
        } catch (err) {
            console.warn("Invalid DyamicMenuList:", err);
            return null; 
        }
    };
    const DynamicMenu = getDynamicMenu();
    const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;

    // Initialize Store & Logo
    const GetCompanyLogo = async () => {
        try {
            const value = JSON?.parse(sessionStorage?.getItem("LoginUser"));
            setislogin(value);
            const storeData = JSON?.parse(sessionStorage?.getItem("storeInit"));
            setStoreInit(storeData);
            window.scroll({ behavior: "smooth", top: 0 });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const visiterID = Cookies.get("visiterId");
                const res = await GetCountAPI(visiterID);
                setCartCount(res?.cartcount);
                setWishCount(res?.wishcount);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        GetCompanyLogo();
    }, []);

    // Scroll Effect
    useEffect(() => {
        if (location.pathname === "/") {
            setIsScrolled(window.scrollY > 10);
            const handleScroll = () => setIsScrolled(window.scrollY > 10);
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        } else {
            setIsScrolled(true);
        }
        setIsScrolled(true);
    }, [location.pathname]);

    // Navbar Animation
    useEffect(() => {
        controls.start({
            backgroundColor: isHovered || isScrolled ? "#ffffff" : "rgba(255,255,255,0)",
            color: isHovered || isScrolled ? "#000000" : "#ffffff",
            boxShadow: isHovered || isScrolled ? "0 6px 30px rgba(0,0,0,0.08)" : "0 0px 0px rgba(0,0,0,0)",
            backdropFilter: isHovered || isScrolled ? "blur(8px)" : "blur(0px)",
            transition: {
                type: "spring", stiffness: 45, damping: 15, mass: 0.8, duration: 0.8,
            },
        });
    }, [isHovered, isScrolled, controls]);


    // =========================================================================
    //  CORE LOGIC: FETCH ALL 3 MENUS & STORE IN SESSION (Parallel)
    // =========================================================================
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const fetchAllMenus = async () => {
            let storeinitLocal = JSON.parse(sessionStorage.getItem("storeInit"));
            let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));
            const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
            const visiterID = Cookies.get("visiterId");

            const shouldFetch = storeinitLocal?.IsB2BWebsite === 0 || (storeinitLocal?.IsB2BWebsite === 1 && isUserLogin === true);

            if (shouldFetch && DynamicMenu && DynamicMenu.length > 0) {
                const topMenus = DynamicMenu.slice(0, 3);
                
                let finalId;
                if (storeinitLocal?.IsB2BWebsite === 0) {
                    finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
                } else {
                    finalId = loginUserDetail?.id || "0";
                }

                try {
                    const fetchPromises = topMenus.map(async (menuItem) => {
                        const menuName = menuItem.ProductTypeName;
                        const sessionKey = `cachedMenu_${menuName}`;
                        
                        const cachedRaw = sessionStorage.getItem(sessionKey);
                        if (cachedRaw) {
                            return { name: menuName, data: JSON.parse(cachedRaw) };
                        }

                        try {
                            const res = await GetMenuAPI(finalId, menuName);
                            const rawData = res?.Data?.rd || [];
                            sessionStorage.setItem(sessionKey, JSON.stringify(rawData));
                            return { name: menuName, data: rawData };
                        } catch (err) {
                            console.warn(`Failed to fetch ${menuName}`, err);
                            return { name: menuName, data: [] };
                        }
                    });

                    const results = await Promise.all(fetchPromises);

                    const processedData = {};
                    results.forEach(res => {
                        processedData[res.name] = buildMenuItems(res.data);
                    });

                    setMultiMenuData(processedData);

                } catch (error) {
                    console.error("Critical error in menu fetching:", error);
                }
            }
        };

        fetchAllMenus();
    }, [islogin]); 


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
            event?.ctrlKey || event?.shiftKey || event?.metaKey || (event?.button && event?.button === 1)
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
            
            const otherparamUrl = Object.entries({
                b: finalData?.FilterKey,
                g: finalData?.FilterKey1,
                c: finalData?.FilterKey2,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(",");

            let menuEncoded = `${queryParameters1}/${otherparamUrl}`;
            const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
            
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

    const handleLogout = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        sessionStorage.clear();
        localStorage.removeItem("userToken");
        if (window.handleAppReset) {
            window.handleAppReset();
        } else {
            window.location.reload();
        }
    };

    const searchDataFucn = (searchText) => {
        if (searchText) {
            let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
            let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
            let obj = {
                a: "",
                b: searchText,
                m: loginInfo?.MetalId ?? storeInit?.MetalId,
                d: loginInfo?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
                c: loginInfo?.cmboCSQCid ?? storeInit?.cmboCSQCid,
                f: {},
            };
            let encodeObj = btoa(JSON.stringify(obj));
            navigation(`/p/${searchText}?S=${encodeObj}`);
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

    // Helper to handle main hover
    const onMouseEnterProductType = (prodType) => {
        setHoveredItem(prodType);
        // Automatically select the first sidebar item when opening the mega menu
        const menus = multiMenuData[prodType];
        if (menus && menus.length > 0) {
            setActiveSubMenu(menus[0]);
        } else {
            setActiveSubMenu(null);
        }
    };

    return (
        <>
            <motion.div animate={controls} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} style={{ position: "sticky", top: 0, zIndex: 999 }}>
                <AppBar position="sticky" elevation={0} sx={{ bgcolor: "transparent !important", top: 0 }}>
                    <Container maxWidth={false} disableGutters sx={{ width: "100%", px: 0 }}>
                        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0, sm: 4 }, minHeight: { xs: 64, sm: 72 }, bgcolor: "transparent !important", color: isHovered || isScrolled ? "#000" : "#fff" }}>
                            
                            {searchOpen && <SearchBarToggle searchOpen={searchOpen} setSearchOpen={setSearchOpen} searchDataFucn={searchDataFucn} />}

                            {!isMobile && is1400px && (
                                <IconButton onClick={handleDrawerToggle} sx={{ "&:hover": { bgcolor: alpha("#000", 0.05) }, color: isHovered || isScrolled ? "#000" : "#fff", transition: "all 0.3s ease" }}>
                                    <MenuIcon />
                                </IconButton>
                            )}
                            
                            {/* Logo Area */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                {isMobile && (
                                    <IconButton onClick={handleDrawerToggle} sx={{ "&:hover": { bgcolor: alpha("#000", 0.05) }, color: isHovered || isScrolled ? "#000" : "#fff", transition: "all 0.3s ease" }}>
                                        <MenuIcon size={22} />
                                    </IconButton>
                                )}
                                <Box component={Link} href="/">
                                    <Box component="img" src={compnyLogo} alt="SHAYN" sx={{ width: "auto", cursor: "pointer" }} className="el_without_headerLogo_side" />
                                </Box>
                            </Box>

                            {/* Desktop Navigation - Loop Over Product Types (DynamicMenu) */}
                            {!isMobile && !is1400px && (
                                <>
                                    <Box sx={{ display: "flex", gap: 0.5, flex: 1, justifyContent: "center" }}>
                                        {/* Take first 3 Product Types from DynamicMenuList */}
                                        {DynamicMenu?.slice(0, 3).map((prodType, index) => {
                                            const menuItemsForType = multiMenuData[prodType.ProductTypeName] || [];

                                            return (
                                                <Box
                                                    key={index}
                                                    onMouseEnter={() => onMouseEnterProductType(prodType.ProductTypeName)}
                                                    onMouseLeave={() => {
                                                        setHoveredItem(null);
                                                        setActiveSubMenu(null);
                                                    }}
                                                    sx={{ position: "relative" }}
                                                >
                                                    {/* Top Level Link: The Product Type Name */}
                                                    <Box
                                                        // component={Link}
                                                        // to={`/p/${prodType.ProductTypeName}/?M=${btoa(prodType.ProductTypeName)}`}
                                                        sx={{
                                                            px: 2, py: 3, bgcolor: "transparent", border: "none", cursor: "pointer", fontSize: "0.84rem",
                                                            fontWeight: 500, letterSpacing: 0.8, textDecoration: "none", transition: "all 0.2s ease", position: "relative",
                                                            color: isHovered || isScrolled ? "#000" : "#fff",
                                                            "&::after": {
                                                                content: '""', position: "absolute", top: 45, left: "50%", transform: "translateX(-50%)",
                                                                width: hoveredItem === prodType.ProductTypeName ? "80%" : "0%", height: 2, bgcolor: "#d4d4d4", transition: "width 0.3s ease",
                                                            },
                                                            outline: "none", boxShadow: "none",
                                                        }}
                                                    >
                                                        {prodType.ProductTypeName}
                                                    </Box>

                                                    {/* Mega Menu Dropdown */}
                                                    <AnimatePresence>
                                                        {menuItemsForType.length > 0 && hoveredItem === prodType.ProductTypeName && (
                                                            <>
                                                                <Box
                                                                    sx={{ position: "fixed", top: "100%", left: "50%", transform: "translateX(-50%)", mt: 0, width: "100vw", height: "24px", bgcolor: "transparent" }}
                                                                    onMouseEnter={() => setHoveredItem(prodType.ProductTypeName)}
                                                                    onMouseLeave={() => setHoveredItem(null)}
                                                                />
                                                                <Box
                                                                    onMouseEnter={() => setHoveredItem(prodType.ProductTypeName)}
                                                                    onMouseLeave={() => setHoveredItem(null)}
                                                                    sx={{
                                                                        position: "fixed", top: "100%", left: "50%", transform: "translateX(-50%)",
                                                                        mt: 1, bgcolor: "#fff", borderRadius: 4,
                                                                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                                                                        width: { xs: "95vw", sm: "85vw", md: "75vw", lg: "70vw", xl: "1400px" },
                                                                        maxWidth: "1400px",
                                                                        height: "60vh", // Fixed height for sidebar layout
                                                                        maxHeight: "600px",
                                                                        overflow: "hidden",
                                                                        display: "flex",
                                                                        zIndex: 1300,
                                                                        animation: "fadeIn 0.25s ease",
                                                                    }}
                                                                >
                                                                    {/* LEFT SIDEBAR (The Main Menu Items) */}
                                                                    <Box sx={{ 
                                                                        width: "250px", 
                                                                        borderRight: "1px solid #e0e0e0", 
                                                                        overflowY: "auto",
                                                                        bgcolor: "#fcfcfc",
                                                                        py: 2
                                                                    }}>
                                                                        {menuItemsForType.map((menuItem, mIndex) => (
                                                                            <Box
                                                                                key={mIndex}
                                                                                onMouseEnter={() => setActiveSubMenu(menuItem)}
                                                                                onClick={(e) => {
                                                                                     handelMenu({ menuname: menuItem?.menuname, key: menuItem?.param0name, value: menuItem?.param0dataname }, {}, {}, e, menuItem?.IsFilterKey1Ignore);
                                                                                     setHoveredItem(null);
                                                                                }}
                                                                                sx={{
                                                                                    px: 4, py: 1.5,
                                                                                    cursor: "pointer",
                                                                                    color: activeSubMenu?.menuname === menuItem.menuname ? "#000" : "#666",
                                                                                    fontWeight: activeSubMenu?.menuname === menuItem.menuname ? 700 : 400,
                                                                                    bgcolor: activeSubMenu?.menuname === menuItem.menuname ? "#fff" : "transparent",
                                                                                    borderLeft: activeSubMenu?.menuname === menuItem.menuname ? "4px solid #000" : "4px solid transparent",
                                                                                    transition: "all 0.2s ease",
                                                                                    "&:hover": { color: "#000", bgcolor: "#fff" }
                                                                                }}
                                                                            >
                                                                                <Typography sx={{ fontSize: "0.95rem", fontFamily: "inherit" }}>
                                                                                    {menuItem.menuname}
                                                                                </Typography>
                                                                            </Box>
                                                                        ))}
                                                                    </Box>

                                                                    {/* RIGHT CONTENT AREA (The Sub Menus / Filters) */}
                                                                    <Box sx={{ 
                                                                        flex: 1, 
                                                                        p: 4, 
                                                                        overflowY: "auto",
                                                                        // Custom Scrollbar
                                                                        scrollbarWidth: "thin", scrollbarColor: "#bfbfbf transparent",
                                                                        "&::-webkit-scrollbar": { width: "6px" },
                                                                        "&::-webkit-scrollbar-thumb": { backgroundColor: "#bfbfbf", borderRadius: "10px" },
                                                                        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#a6a6a6" },
                                                                    }}>
                                                                        {activeSubMenu && (
                                                                            <Masonry columns={{ xs: 2, sm: 2, md: 3, lg: 5 }} spacing={4}>
                                                                                {activeSubMenu?.param1?.map((section, sIndex) => (
                                                                                    <Box key={sIndex} sx={{ breakInside: "avoid", mb: 2 }}>
                                                                                        <Typography
                                                                                            component={Link}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation()
                                                                                                handelMenu(
                                                                                                    { menuname: activeSubMenu?.menuname, key: activeSubMenu?.param0name, value: activeSubMenu?.param0dataname },
                                                                                                    { key: section?.param1name, value: section?.param1dataname },
                                                                                                    {}, e, section?.IsFilterKey1Ignore
                                                                                                )
                                                                                                setHoveredItem(null);
                                                                                            }}
                                                                                            sx={{
                                                                                                fontWeight: 700, 
                                                                                                color: "#000",
                                                                                                mb: 1.5,
                                                                                                fontSize: "0.9rem",
                                                                                                cursor: "pointer",
                                                                                                display: "block",
                                                                                                "&:hover": { textDecoration: "underline" }
                                                                                            }}
                                                                                        >
                                                                                            {section?.param1dataname}
                                                                                        </Typography>

                                                                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                                                                                            {section?.param2?.filter(p => p?.param2dataname && p?.param2dataname.trim() !== "").map((param2Item, p2Index) => (
                                                                                                <Typography
                                                                                                    key={p2Index}
                                                                                                    component={Link}
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        handelMenu(
                                                                                                            { menuname: activeSubMenu?.menuname, key: activeSubMenu?.param0name, value: activeSubMenu?.param0dataname },
                                                                                                            { key: section?.param1name, value: section?.param1dataname },
                                                                                                            { key: param2Item?.param2name, value: param2Item?.param2dataname },
                                                                                                            e, param2Item?.IsFilterKey2Ignore
                                                                                                        );
                                                                                                        setHoveredItem(null);
                                                                                                    }}
                                                                                                    sx={{
                                                                                                        fontSize: "0.85rem", 
                                                                                                        color: "#666", 
                                                                                                        cursor: "pointer",
                                                                                                        textDecoration: "none",
                                                                                                        "&:hover": { color: "#000", textDecoration: "underline" }
                                                                                                    }}
                                                                                                >
                                                                                                    {param2Item?.param2dataname}
                                                                                                </Typography>
                                                                                            ))}
                                                                                        </Box>
                                                                                    </Box>
                                                                                ))}
                                                                            </Masonry>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </Box>
                                            );
                                        })}
                                        
                                        {/* Static Links */}
                                        {islogin && (
                                            <>
                                                <Box sx={{ position: "relative" }}>
                                                    <Box component={Link} href="/p/NewArrival/?N=TmV3QXJyaXZhbA=="
                                                        sx={{ px: 2, py: 3, bgcolor: "transparent", border: "none", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: 0.8, textDecoration: "none", transition: "all 0.2s ease", position: "relative", color: isHovered || isScrolled ? "#000" : "#fff", outline: "none", boxShadow: "none" }}
                                                    >
                                                        New Arrivals
                                                    </Box>
                                                </Box>
                                                <Box sx={{ position: "relative" }}>
                                                    <Box component={Link} href="/offers"
                                                        sx={{ px: 2, py: 3, bgcolor: "transparent", border: "none", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: 0.8, textDecoration: "none", transition: "all 0.2s ease", position: "relative", color: isHovered || isScrolled ? "#000" : "#fff", outline: "none", boxShadow: "none" }}
                                                    >
                                                        Offers
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </>
                            )}

                            <RightSideMenu
                                setSearchOpen={setSearchOpen}
                                IsB2BWebsiteChek={IsB2BWebsiteChek}
                                storeinit={storeinit}
                                handleLogout={handleLogout}
                                islogin={islogin}
                                isMobile={isMobile}
                                cartCount={cartCount}
                                wishCount={wishCount}
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
                {DrawerSearchOpen && <DrawerSearchBar setSearchOpen={setDrawerSearchOpen} searchDataFucn={searchDataFucn} />}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: `1px solid ${alpha("#fff", 0.1)}` }}>
                    <Box component="img" src={compnyLogoM} alt="SHAYN" sx={{}} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        {islogin && <IconButton onClick={() => setDrawerSearchOpen((prev) => !prev)} sx={{ color: "#000" }}><SearchIcon style={{ fontSize: "18px", color: "inherit" }} /></IconButton>}
                        {islogin && <IconButton sx={{ color: "#000" }} onClick={() => navigateToMenu("/myWishList")}><Badge badgeContent={wishCount || 10} color="error"><FavoriteIcon style={{ fontSize: "18px", color: "inherit" }} /></Badge></IconButton>}
                        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
                    </Box>
                </Box>
                
                <MobileMenu
                    activeMenu={activeMenu}
                    menuItems={Object.values(multiMenuData).flat()} 
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

export default PremiumNavbar;
// import { useEffect,  useRef, useState } from "react";
// import { AppBar, Toolbar, Box, IconButton, Container, Drawer, Typography, useMediaQuery, useTheme, alpha, Badge } from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { Menu as MenuIcon } from "lucide-react";
// import { el_CartCount, el_companyLogo, el_companyLogoM, el_loginState, el_WishCount } from "../../../../Recoil/atom";
// import { AnimatePresence, motion, useAnimation } from "framer-motion";
// import ImageSide from "./ImageSide";
// import MobileMenu from "./MobileMenu";
// import RightSideMenu from "./RightSideMenu";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import { GetCountAPI } from "../../../../../../../utils/API/GetCount/GetCountAPI";
// import Pako from "pako";
// import { GetMenuAPI } from "../../../../../../../utils/API/GetMenuAPI/GetMenuAPI";
// import SearchBarToggle from "./SearchBarToggle";
// import DrawerSearchBar from "./DrawerSearchbar";
// import { Search as SearchIcon, Heart as FavoriteIcon, User as PersonIcon, ShoppingCart as ShoppingBagIcon, LogOut } from "lucide-react";
// import { Masonry } from "@mui/lab";
// import OfferBar from "./OfferBar";
// import {buildMenuItems} from './MenuBuilder'



// const PremiumNavbar = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
//     const is1400px = useMediaQuery(theme.breakpoints.down("1400"));
//     const is768px = useMediaQuery("(max-width:428px)");
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [activeMenu, setActiveMenu] = useState(null);
//     const [menuStack, setMenuStack] = useState([]);
//     const [hoveredItem, setHoveredItem] = useState(null);
//     const [isScrolled, setIsScrolled] = useState(false);
//     const controls = useAnimation();
//     const [isHovered, setIsHovered] = useState(false);
//     const navigation = useNavigate();
//     const [islogin, setislogin] = useRecoilState(el_loginState);
//     const [cartCount, setCartCount] = useRecoilState(el_CartCount);
//     const [wishCount, setWishCount] = useRecoilState(el_WishCount);
//     const [storeinit, setStoreInit] = useState();
//     const [burgerMenu, setBurgerMenu] = useState(false);
//     const [burgerMenu1, setBurgerMenu1] = useState(false);
//     const [mobilenav, setMobilenav] = useState(false);
//     const [DrawerSearchOpen, setDrawerSearchOpen] = useState(false);
//     const navigate = useNavigate();
//     const [searchOpen, setSearchOpen] = useState(false);
//     const [showBtn, setShowBtn] = useState(false);
//     const [inputValue, setInputValue] = useState("");
//     const inputRef = useRef(null);
//     const compnyLogo = useRecoilValue(el_companyLogo);
//     const compnyLogoM = useRecoilValue(el_companyLogoM);
//     const [menuData, setMenuData] = useState([]);
//     const [menuItems, setMenuItems] = useState([]);
//     const [hoveredIndex, setHoveredIndex] = useState(null);
//     const [expandedMenu, setExpandedMenu] = useState(null);
//     const [selectedData, setSelectedData] = useState([]);
//     const isMounted = useRef(false);
//     const [menuId, setMenuId] = useState("");
//     const location = useLocation();
//     const [menuHoverTimeout, setMenuHoverTimeout] = useState(null);
//     const menuRef = useRef(null);
//     const navItemRefs = useRef({});

//     const getDynamicMenu = () => {
//         try {
//             const raw = sessionStorage.getItem("DyamicMenuList");
//             if (!raw) return null; // not present
//             return JSON.parse(raw); // valid JSON
//         } catch (err) {
//             console.warn("Invalid DyamicMenuList in sessionStorage:", err);
//             return null; // return safe fallback
//         }
//     };
//     const DynamicMenu = getDynamicMenu();
//     console.log("🚀 ~ PremiumNavbar ~ DynamicMenu:", DynamicMenu)


//     const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;

//     const GetCompanyLogo = async () => {
//         try {
//             const value = JSON?.parse(sessionStorage?.getItem("LoginUser"));
//             setislogin(value);
//             const storeData = JSON?.parse(sessionStorage?.getItem("storeInit"));
//             setStoreInit(storeData);
//             window.scroll({ behavior: "smooth", top: 0 });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const visiterID = Cookies.get("visiterId");
//                 const res = await GetCountAPI(visiterID);
//                 setCartCount(res?.cartcount);
//                 setWishCount(res?.wishcount);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         GetCompanyLogo();
//     }, []);

//     useEffect(() => {
//         if (location.pathname === "/") {
//             setIsScrolled(window.scrollY > 10);
//             const handleScroll = () => setIsScrolled(window.scrollY > 10);
//             window.addEventListener("scroll", handleScroll);
//             return () => window.removeEventListener("scroll", handleScroll);
//         } else {
//             // All other pages → always scrolled style
//             setIsScrolled(true);
//         }
//         setIsScrolled(true);

//     }, [location.pathname]);


//     useEffect(() => {
//         controls.start({
//             backgroundColor: isHovered || isScrolled ? "#ffffff" : "rgba(255,255,255,0)",
//             color: isHovered || isScrolled ? "#000000" : "#ffffff",
//             boxShadow: isHovered || isScrolled ? "0 6px 30px rgba(0,0,0,0.08)" : "0 0px 0px rgba(0,0,0,0)",
//             backdropFilter: isHovered || isScrolled ? "blur(8px)" : "blur(0px)",
//             transition: {
//                 type: "spring",
//                 stiffness: 45,  // ↓ softer bounce
//                 damping: 15,    // ↓ smoother rebound
//                 mass: 0.8,      // ↓ lighter feel
//                 duration: 0.8,  // ensures fluid delay
//             },
//         });
//     }, [isHovered, isScrolled, controls]);

//     useEffect(() => {
//         if (!isMounted.current) {
//             isMounted.current = true;
//             return;
//         }

//         let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
//         let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));
//         if (storeinit?.IsB2BWebsite === 0 || (storeinit?.IsB2BWebsite === 1 && isUserLogin === true)) {
//             FetchMenuList(DynamicMenu?.[0]?.ProductTypeName);
//         }
//     }, [islogin]);

//     useEffect(() => {
//         setMenuItems(buildMenuItems(menuData));
//     }, [menuData]);

//     const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
//         if (
//             param?.menuname === "Collection" &&
//             param?.key === "Auto" &&
//             param?.value === "" &&
//             Object.keys(param1 || {}).length === 0 &&
//             Object.keys(param2 || {}).length === 0
//         ) {
//             navigate('/collection')
//             return;
//         }
//         if (
//             event?.ctrlKey || // Ctrl key
//             event?.shiftKey || // Shift key
//             event?.metaKey || // Meta key (Command key on macOS)
//             (event?.button && event?.button === 1) // Middle mouse button
//         ) {
//             return;
//         } else {
//             event?.preventDefault();
//             let finalData = {
//                 menuname: param?.menuname ?? "",
//                 FilterKey: param?.key ?? "",
//                 FilterVal: param?.value ?? "",
//                 FilterKey1: isFilterKey2Ignore === 1 ? param2?.key ?? "" : param1?.key ?? "",
//                 FilterVal1: isFilterKey2Ignore === 1 ? param2?.value ?? "" : param1?.value ?? "",
//                 FilterKey2: isFilterKey2Ignore === 1 ? "" : param2?.key ?? "",
//                 FilterVal2: isFilterKey2Ignore === 1 ? "" : param2?.value ?? "",
//             };
//             sessionStorage.setItem("menuparams", JSON.stringify(finalData));

//             const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");
//             console.log("🚀 ~ handelMenu ~ queryParameters1:", queryParameters1)

//             const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`]
//                 // .filter(Boolean)
//                 .join(",");
//             console.log("🚀 ~ handelMenu ~ queryParameters:", queryParameters)

//             const otherparamUrl = Object.entries({
//                 b: finalData?.FilterKey,
//                 g: finalData?.FilterKey1,
//                 c: finalData?.FilterKey2,
//             })
//                 .filter(([key, value]) => value !== undefined)
//                 .map(([key, value]) => value)
//                 .filter(Boolean)
//                 .join(",");
//             console.log("🚀 ~ handelMenu ~ otherparamUrl:", otherparamUrl)

//             const paginationParam = [`page=${finalData.page ?? 1}`, `size=${finalData.size ?? 50}`].join("&");

//             // console.log("otherparamsUrl--", otherparamUrl);

//             let menuEncoded = `${queryParameters}/${otherparamUrl}`;
//             // const url = `/productlist?V=${queryParameters}/K=${otherparamUrl}`;
//             const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
//             console.log("🚀 ~ handelMenu ~ url:", url)

//             // let d = new Date();
//             // let randomno = Math.floor(Math.random() * 1000 * d.getMilliseconds() * d.getSeconds() * d.getDate() * d.getHours() * d.getMinutes())
//             navigate(url);
//             setMobileOpen(false);
//             setActiveMenu(null);
//         }
//     };

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//         if (mobileOpen) {
//             setActiveMenu(null);
//             setMenuStack([]);
//         }
//     };

//     const handleMobileMenuClick = (label, hasSubMenu) => {
//         if (hasSubMenu) {
//             setMenuStack([...menuStack, activeMenu || "main"]);
//             setActiveMenu(label);
//         }
//     };

//     const handleMobileBack = () => {
//         const newStack = [...menuStack];
//         const previousMenu = newStack.pop();
//         setMenuStack(newStack);
//         setActiveMenu(previousMenu === "main" ? null : previousMenu || null);
//     };

//     const FetchMenuList = async (SelectedMenu) => {
//         const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
//         const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
//         const { IsB2BWebsite } = storeInit;
//         const visiterID = Cookies.get("visiterId");
//         let finalId;
//         if (IsB2BWebsite === 0) {
//             finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
//         } else {
//             finalId = loginUserDetail?.id || "0";
//         }

//         await GetMenuAPI(finalId, SelectedMenu)
//             .then((response) => {
//                 setMenuData(response?.Data?.rd);
//             })
//             .catch((err) => console.log(err));
//     };


//     const handleMouseEnter = (index, param) => {
//         setHoveredIndex(index);
//         setExpandedMenu(index);
//         setSelectedData(menuItems[index] || []);
//         document.body.style.overflow = "hidden";
//     };
//     const handleMouseLeave = (index) => {
//         setExpandedMenu(null);
//         // setHoveredIndex(null);
//         document.body.style.overflow = "auto";
//     };

//     // const handleLogout = () => {
//     //     setislogin(false);
//     //     sessionStorage.clear();
//     //     sessionStorage.setItem("LoginUser", false);
//     //     sessionStorage.removeItem("storeInit");
//     //     sessionStorage.removeItem("loginUserDetail");
//     //     sessionStorage.removeItem("remarks");
//     //     sessionStorage.removeItem("selectedAddressId");
//     //     sessionStorage.removeItem("orderNumber");
//     //     sessionStorage.removeItem("registerEmail");
//     //     sessionStorage.removeItem("UploadLogicalPath");
//     //     sessionStorage.removeItem("remarks");
//     //     sessionStorage.removeItem("registerMobile");
//     //     // navigation('/')
//     //     window.location.to = "/";
//     //     // window.location.reload();
//     // };


//     const handleLogout = async (e) => {
//         if (e && e.preventDefault) e.preventDefault();
//         console.log("🚪 Logging out...");
//         sessionStorage.clear();
//         localStorage.removeItem("userToken");
//         if (window.handleAppReset) {
//             window.handleAppReset();
//         } else {
//             console.warn("⚠️ AppLoader not found, forcing reload.");
//             window.location.reload();
//         }
//     };



//     useEffect(() => {
//         window.scroll({
//             top: 0,
//             behavior: "smooth",
//         });
//     }, []);



//     const searchDataFucn = (searchText) => {
//         if (searchText) {
//             let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
//             let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
//             let obj = {
//                 a: "",
//                 b: searchText,
//                 m: loginInfo?.MetalId ?? storeInit?.MetalId,
//                 d: loginInfo?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
//                 c: loginInfo?.cmboCSQCid ?? storeInit?.cmboCSQCid,
//                 f: {},
//             };

//             let encodeObj = btoa(JSON.stringify(obj));
//             navigation(`/p/${searchText}?S=${encodeObj}`);
//             setSearchOpen(false);
//             setDrawerSearchOpen(false);
//             setMobileOpen(false);
//         }
//     };

//     const navigateToMenu = (link) => {
//         navigate(link);
//         setMobileOpen(false);
//         setDrawerSearchOpen(false);
//         setMobileOpen(false);
//     }



//     return (
//         <>
//             {/* <OfferBar /> */}
//             <motion.div animate={controls} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} style={{ position: "sticky", top: 0, zIndex: 999 }}>
//                 <AppBar
//                     position="sticky"
//                     elevation={0}
//                     sx={{
//                         bgcolor: "transparent !important",
//                         top: 0,
//                     }}
//                 >
//                     <Container
//                         maxWidth={false}
//                         disableGutters
//                         sx={{
//                             width: "100%",
//                             px: 0,
//                         }}
//                     >
//                         <Toolbar
//                             sx={{
//                                 justifyContent: "space-between",
//                                 px: { xs: 0, sm: 4 },
//                                 minHeight: { xs: 64, sm: 72 },
//                                 bgcolor: "transparent !important",
//                                 color: isHovered || isScrolled ? "#000" : "#fff",
//                             }}
//                         >
//                             {searchOpen && <SearchBarToggle
//                                 searchOpen={searchOpen}
//                                 setSearchOpen={setSearchOpen}
//                                 searchDataFucn={searchDataFucn}
//                             />}

//                             {!isMobile && is1400px && (
//                                 <IconButton
//                                     onClick={handleDrawerToggle}
//                                     sx={{
//                                         "&:hover": {
//                                             bgcolor: alpha("#000", 0.05),
//                                         },
//                                         color: isHovered || isScrolled ? "#000" : "#fff",
//                                         transition: "all 0.3s ease",
//                                     }}
//                                 >
//                                     <MenuIcon />
//                                 </IconButton>
//                             )}
//                             {/* Left: Mobile Menu / Logo */}
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                                 {isMobile && (
//                                     <IconButton
//                                         onClick={handleDrawerToggle}
//                                         sx={{
//                                             "&:hover": {
//                                                 bgcolor: alpha("#000", 0.05),
//                                             },
//                                             color: isHovered || isScrolled ? "#000" : "#fff",
//                                             transition: "all 0.3s ease",
//                                         }}
//                                     >
//                                         <MenuIcon size={22} />
//                                     </IconButton>
//                                 )}
//                                 <Box
//                                     component={Link}
//                                     to="/"
//                                 >
//                                     <Box
//                                         component="img"
//                                         src={compnyLogo}

//                                         alt="SHAYN"
//                                         sx={{
//                                             width: "auto",
//                                             cursor: "pointer",
//                                             // filter: isHovered || isScrolled ? "invert(0) brightness(1)" : "invert(1) brightness(1.5)",
//                                         }}
//                                         className="el_without_headerLogo_side"
//                                     />
//                                 </Box>
//                             </Box>

//                             {/* Desktop Navigation */}
//                             {!isMobile && !is1400px && (
//                                 <>
//                                     <Box
//                                         sx={{
//                                             display: "flex",
//                                             gap: 0.5,
//                                             flex: 1,
//                                             justifyContent: "center",
//                                         }}
//                                     >
//                                         {menuItems?.map((item, index) => (
//                                             <Box
//                                                 key={index}
//                                                 label={item?.menuname}
//                                                 onMouseEnter={() => setHoveredItem(item?.menuname)}
//                                                 onMouseLeave={() => setHoveredItem(null)}
//                                                 onClick={(e) => {
//                                                     console.log("🚀 ~ onClick ~ e:", 1)
//                                                     handelMenu({ menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname }, {}, {}, e, item?.IsFilterKey1Ignore);
//                                                     handleMouseLeave();
//                                                     setHoveredItem(null);
//                                                 }}
//                                                 sx={{
//                                                     position: "relative",
//                                                 }}
//                                             >
//                                                 <Box
//                                                     component={Link}
//                                                     sx={{
//                                                         px: 2,
//                                                         py: 3,
//                                                         bgcolor: "transparent",
//                                                         border: "none",
//                                                         cursor: "pointer",
//                                                         fontSize: "0.84rem",
//                                                         fontWeight: 500,
//                                                         letterSpacing: 0.8,
//                                                         textDecoration: "none",
//                                                         transition: "all 0.2s ease",
//                                                         position: "relative",
//                                                         color: isHovered || isScrolled ? "#000" : "#fff",
//                                                         "&::after": {
//                                                             content: '""',
//                                                             position: "absolute",
//                                                             top: 45,
//                                                             left: "50%",
//                                                             transform: "translateX(-50%)",
//                                                             width: hoveredItem === item?.menuname ? "80%" : "0%",
//                                                             height: 2,
//                                                             bgcolor: "#d4d4d4",
//                                                             transition: "width 0.3s ease",
//                                                         },
//                                                         "&::before": {
//                                                             content: '""',
//                                                             position: "absolute",
//                                                             bottom: -20,
//                                                             left: "0%",
//                                                             right: "0%",
//                                                             height: 35,
//                                                             width: "100%",
//                                                             bgcolor: "transparent",
//                                                             transition: "width 0.3s ease",
//                                                         },
//                                                         outline: "none",
//                                                         boxShadow: "none",
//                                                     }}
//                                                 >
//                                                     {item?.menuname}
//                                                 </Box>
//                                                 <AnimatePresence>
//                                                     {item.param1 && hoveredItem === item?.menuname && (
//                                                         <>
//                                                             <Box
//                                                                 sx={{
//                                                                     position: "fixed",
//                                                                     top: "100%",
//                                                                     left: "50%",
//                                                                     transform: "translateX(-50%)",
//                                                                     mt: 0,
//                                                                     width: { xs: "95vw", sm: "85vw", md: "75vw", lg: "70vw", xl: "1400px" },
//                                                                     maxWidth: "1400px",
//                                                                     height: "24px",
//                                                                     boxShadow: "none",
//                                                                     bgcolor: "transparent",
//                                                                 }}
//                                                                 onMouseEnter={() => {
//                                                                     setHoveredItem(item?.menuname);
//                                                                 }}
//                                                                 onMouseLeave={() => {
//                                                                     setHoveredItem(null);
//                                                                 }}
//                                                             />
//                                                             <Box
//                                                                 onMouseEnter={() => {
//                                                                     setHoveredItem(item?.menuname);
//                                                                 }}
//                                                                 onMouseLeave={() => {
//                                                                     setHoveredItem(null);
//                                                                 }}
//                                                                 sx={{
//                                                                     position: "fixed",
//                                                                     top: "100%",
//                                                                     left: "50%",
//                                                                     transform: "translateX(-50%)",
//                                                                     mt: 1,
//                                                                     bgcolor: "#fff",
//                                                                     borderRadius: 8,
//                                                                     boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//                                                                     width: { xs: "95vw", sm: "85vw", md: "75vw", lg: "70vw", xl: "1400px" },
//                                                                     maxWidth: "1400px",
//                                                                     maxHeight: "80vh",
//                                                                     minHeight: "400px",
//                                                                     overflow: "hidden",
//                                                                     display: "flex",
//                                                                     zIndex: 1300,
//                                                                     animation: "fadeIn 0.25s ease",
//                                                                     "@keyframes fadeIn": {
//                                                                         from: { opacity: 0, transform: "translateX(-50%) translateY(-10px)" },
//                                                                         to: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <Box
//                                                                     sx={{
//                                                                         flex: "1 1 auto",
//                                                                         bgcolor: "#fff",
//                                                                         p: { xs: 2, sm: 3, md: 4 },
//                                                                         overflowY: "auto",
//                                                                         overflowX: "hidden",
//                                                                         width: "100%",
//                                                                         scrollbarWidth: "thin",
//                                                                         scrollbarColor: "#bfbfbf transparent",
//                                                                         "&::-webkit-scrollbar": {
//                                                                             width: "6px",
//                                                                         },
//                                                                         "&::-webkit-scrollbar-thumb": {
//                                                                             backgroundColor: "#bfbfbf",
//                                                                             borderRadius: "10px",
//                                                                         },
//                                                                         "&::-webkit-scrollbar-thumb:hover": {
//                                                                             backgroundColor: "#a6a6a6",
//                                                                         },
//                                                                         "&::-webkit-scrollbar-track": {
//                                                                             background: "transparent",
//                                                                         },
//                                                                         scrollBehavior: "smooth",
//                                                                     }}
//                                                                 >
//                                                                     <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 6 }} spacing={1}>
//                                                                         {item?.param1?.map((section, index) => {
//                                                                             return <>
//                                                                                 <Box
//                                                                                     key={index}
//                                                                                     sx={{
//                                                                                         breakInside: "avoid",
//                                                                                         marginBottom: 2,
//                                                                                     }}
//                                                                                 >
//                                                                                     <Typography
//                                                                                         component={Link}
//                                                                                         onClick={(e) => {
//                                                                                             e.stopPropagation()
//                                                                                             console.log("🚀 ~ onClick ~ e:", 2)
//                                                                                             handelMenu(
//                                                                                                 { menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname }
//                                                                                                 , { key: section?.param1name, value: section?.param1dataname }
//                                                                                                 , {}, e, section?.IsFilterKey1Ignore)
//                                                                                             setHoveredItem(null);
//                                                                                         }}
//                                                                                         sx={{
//                                                                                             position: "relative",
//                                                                                             color: section?.menuname == "Collection" ? "#535353" : "#141414",
//                                                                                             fontWeight: section?.menuname == "Collection" ? 400 : 700,
//                                                                                             textDecoration: section?.menuname == "Collection" ? "none" : "none",
//                                                                                             display: "block",
//                                                                                             letterSpacing: 0.5,
//                                                                                             textTransform: "capitalize",
//                                                                                             mb: section?.menuname == "Collection" ? 0 : 1,
//                                                                                             wordWrap: "break-word",
//                                                                                             cursor: "pointer",
//                                                                                             textUnderlineOffset: "0.3rem",
//                                                                                             "&:hover": {
//                                                                                                 textDecoration: "underline",
//                                                                                                 textUnderlineOffset: "0.3rem",
//                                                                                             },
//                                                                                             fontSize: "0.92rem",
//                                                                                         }}
//                                                                                     >
//                                                                                         {section?.param1dataname}
//                                                                                     </Typography>

//                                                                                     <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
//                                                                                         {section?.param2
//                                                                                             ?.filter(
//                                                                                                 (param2Item) =>
//                                                                                                     param2Item?.param2dataname && param2Item?.param2dataname.trim() !== ""
//                                                                                             )
//                                                                                             .map((param2Item, param2Index) => (
//                                                                                                 <Box
//                                                                                                     key={param2Index}
//                                                                                                     onClick={(e) => {
//                                                                                                         e.stopPropagation();
//                                                                                                         handelMenu(
//                                                                                                             {
//                                                                                                                 menuname: item?.menuname,
//                                                                                                                 key: item?.param0name,
//                                                                                                                 value: item?.param0dataname,
//                                                                                                             },
//                                                                                                             {
//                                                                                                                 key: section?.param1name,
//                                                                                                                 value: section?.param1dataname,
//                                                                                                             },
//                                                                                                             {
//                                                                                                                 key: param2Item?.param2name,
//                                                                                                                 value: param2Item?.param2dataname,
//                                                                                                             },
//                                                                                                             e,
//                                                                                                             param2Item?.IsFilterKey2Ignore
//                                                                                                         );
//                                                                                                         setHoveredItem(null);
//                                                                                                     }}
//                                                                                                     component={Link}
//                                                                                                     sx={{
//                                                                                                         position: "relative",
//                                                                                                         textAlign: "left",
//                                                                                                         px: 0,
//                                                                                                         color: "#535353",
//                                                                                                         bgcolor: "transparent",
//                                                                                                         border: "none",
//                                                                                                         cursor: "pointer",
//                                                                                                         fontSize: "0.88rem",
//                                                                                                         textDecoration: "none",
//                                                                                                         borderRadius: 1,
//                                                                                                         transition: "all 0.2s ease",
//                                                                                                         "&:hover": {
//                                                                                                             color: "#141414",
//                                                                                                             textDecoration: "underline",
//                                                                                                             textUnderlineOffset: "0.3rem",
//                                                                                                         },
//                                                                                                         outline: "none",
//                                                                                                     }}
//                                                                                                 >
//                                                                                                     {param2Item?.param2dataname}
//                                                                                                 </Box>
//                                                                                             ))}

//                                                                                     </Box>
//                                                                                 </Box>
//                                                                             </>
//                                                                         }
//                                                                         )}
//                                                                     </Masonry>
//                                                                 </Box>
//                                                             </Box>
//                                                         </>
//                                                     )}
//                                                 </AnimatePresence>


//                                             </Box>
//                                         ))}
//                                         {islogin && <Box
//                                             sx={{ position: "relative" }}>
//                                             <Box
//                                                 component={Link}
//                                                 to="/p/NewArrival/?N=TmV3QXJyaXZhbA=="
//                                                 sx={{
//                                                     px: 2,
//                                                     py: 3,
//                                                     bgcolor: "transparent",
//                                                     border: "none",
//                                                     cursor: "pointer",
//                                                     fontSize: "0.8125rem",
//                                                     fontWeight: 500,
//                                                     letterSpacing: 0.8,
//                                                     textDecoration: "none",
//                                                     transition: "all 0.2s ease",
//                                                     position: "relative",
//                                                     color: isHovered || isScrolled ? "#000" : "#fff",
//                                                     "&::after": {
//                                                         content: '""',
//                                                         position: "absolute",
//                                                         top: 45,
//                                                         left: "50%",
//                                                         transform: "translateX(-50%)",
//                                                         // width: hoveredItem === item?.menuname ? "80%" : "0%",
//                                                         height: 2,
//                                                         bgcolor: "#d4d4d4",
//                                                         transition: "width 0.3s ease",
//                                                     },
//                                                     outline: "none",
//                                                     boxShadow: "none",
//                                                 }}
//                                             >
//                                                 New Arrivals
//                                             </Box>
//                                         </Box>}
//                                         {islogin && <Box
//                                             sx={{ position: "relative" }}>
//                                             <Box
//                                                 component={Link}
//                                                 to="/offers"
//                                                 sx={{
//                                                     px: 2,
//                                                     py: 3,
//                                                     bgcolor: "transparent",
//                                                     border: "none",
//                                                     cursor: "pointer",
//                                                     fontSize: "0.8125rem",
//                                                     fontWeight: 500,
//                                                     letterSpacing: 0.8,
//                                                     textDecoration: "none",
//                                                     transition: "all 0.2s ease",
//                                                     position: "relative",
//                                                     color: isHovered || isScrolled ? "#000" : "#fff",
//                                                     "&::after": {
//                                                         content: '""',
//                                                         position: "absolute",
//                                                         top: 45,
//                                                         left: "50%",
//                                                         transform: "translateX(-50%)",
//                                                         // width: hoveredItem === item?.menuname ? "80%" : "0%",
//                                                         height: 2,
//                                                         bgcolor: "#d4d4d4",
//                                                         transition: "width 0.3s ease",
//                                                     },
//                                                     outline: "none",
//                                                     boxShadow: "none",
//                                                 }}
//                                             >
//                                                 Offers
//                                             </Box>
//                                         </Box>}

//                                     </Box>
//                                 </>
//                             )}

//                             <RightSideMenu
//                                 setSearchOpen={setSearchOpen}
//                                 IsB2BWebsiteChek={IsB2BWebsiteChek}
//                                 storeinit={storeinit}
//                                 handleLogout={handleLogout}
//                                 islogin={islogin}
//                                 isMobile={isMobile}
//                                 cartCount={cartCount}
//                                 wishCount={wishCount}
//                                 is768px={is768px}
//                                 navigate={navigate} isHovered={isHovered} isScrolled={isScrolled} />
//                         </Toolbar>
//                     </Container>
//                 </AppBar>
//             </motion.div>

//             <Drawer
//                 anchor="left"
//                 open={mobileOpen}
//                 onClose={handleDrawerToggle}
//                 sx={{
//                     "& .MuiDrawer-paper": {
//                         width: { xs: "85%", sm: 380 },
//                         maxWidth: "100%",
//                     },
//                 }}
//             >
//                 {DrawerSearchOpen && <DrawerSearchBar
//                     setSearchOpen={setDrawerSearchOpen}
//                     searchDataFucn={searchDataFucn}
//                 />}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         p: 2,
//                         borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
//                     }}
//                 >
//                     <Box component="img" src={compnyLogoM} alt="SHAYN" sx={{}} />

//                     <Box
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 0.6
//                         }}
//                     >
//                         {islogin && <IconButton
//                             onClick={() => setDrawerSearchOpen((prev) => !prev)}
//                             sx={{
//                                 color: "#000",
//                             }}
//                         >
//                             <SearchIcon style={{ fontSize: "18px", color: "inherit" }} />
//                         </IconButton>}
//                         {islogin && <IconButton
//                             sx={{
//                                 color: "#000",
//                             }}
//                             onClick={() => navigateToMenu("/myWishList")}
//                         >
//                             <Badge badgeContent={wishCount || 10} color="error">
//                                 <FavoriteIcon style={{ fontSize: "18px", color: "inherit" }} />
//                             </Badge>
//                         </IconButton>}
//                         <IconButton onClick={handleDrawerToggle}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                 </Box>
//                 <MobileMenu
//                     activeMenu={activeMenu}
//                     menuItems={menuItems}
//                     handleMobileMenuClick={handleMobileMenuClick}
//                     handleMobileBack={handleMobileBack}
//                     handelMenu={handelMenu}
//                     islogin={islogin}
//                     storeinit={storeinit}
//                     IsB2BWebsiteChek={IsB2BWebsiteChek}
//                 />
//             </Drawer>
//         </>
//     );
// };

// export default PremiumNavbar;
