"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Container,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  Badge,
  Skeleton,
} from "@mui/material";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import RightSideMenu from "./RightSideMenu";
import Cookies from "js-cookie";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import { GETProductType } from "@/app/(core)/utils/API/GETProductType/GETProductType";
import SearchBarToggle from "./SearchBarToggle";
import DrawerSearchBar from "./DrawerSearchbar";
import { Masonry } from "@mui/lab";
import { buildMenuItems } from "./MenuBuilder";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Search as SearchIcon,
  Heart as FavoriteIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSyncStore } from "@/app/(core)/hooks/useStore";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { usePathname } from "next/navigation";
import { clearSession, getSession } from "@/app/(core)/utils/FetchSessionData";

const BeluxNavbar = ({ storeInit: storeinit, logos }) => {
  const {
    islogin,
    setislogin,
    cartCountNum,
    setCartCountNum,
    wishCountNum,
    setWishCountNum,
    setCartOpenStateB2C,
    loginUserDetail,
  } = useStore();

  const { clearAllCacheData } = useMaster();

  const setSyncProductList = useSyncStore((state) => state.setSyncProductList);

  const IsSetupFor = true;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const is1400px = useMediaQuery(theme.breakpoints.down("1400"));
  const is768px = useMediaQuery("(max-width:428px)");
  const { broadcast } = useBroadcaster();
  const Router = useNextRouterLikeRR().push;
  const navigate = (url) => Router(url);
  const location = usePathname();

  const compnyLogo = logos?.web;
  const compnyLogoM = logos?.mobile;

  // UI State
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuStack, setMenuStack] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  // tracks if announcement bar (36px) has scrolled out of view
  const [announcementGone, setAnnouncementGone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [DrawerSearchOpen, setDrawerSearchOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Data State
  const [multiMenuData, setMultiMenuData] = useState({});

  // 1. Dynamic Menu State (Product Types: Diamond, Gold)
  const [DynamicMenu, setDynamicMenu] = useState(() => {
    try {
      const raw = getSession("DyamicMenuList");
      return raw ? raw : [];
    } catch (e) {
      return [];
    }
  });

  // 2. Selected Tab State
  const [selectedProductType, setSelectedProductType] = useState(() => {
    return getSession("selectedTabPersistence") || null;
  });

  const controls = useAnimation();
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;

  // --- Initial Setup (Logo, Counts, Scroll) ---

  useEffect(() => {
    if (location === "/") {
      setIsScrolled(window.scrollY > 10);
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location]);

  // Track when announcement bar (36px) has scrolled away
  useEffect(() => {
    const onScroll = () => setAnnouncementGone(window.scrollY > 36);
    onScroll(); // run once on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    controls.start({
      backgroundColor:
        isHovered || isScrolled ? "#ffffff" : "rgba(255,255,255,0)",
      color: isHovered || isScrolled ? "#000000" : "#ffffff",
      borderBottom:
        isHovered || isScrolled
          ? "1px solid #e2e2e2c0"
          : "1px solid transparent",
      transition: {
        type: "spring",
        stiffness: 45,
        damping: 15,
        mass: 0.8,
        duration: 0.8,
      },
    });
  }, [isHovered, isScrolled, controls]);

  // =========================================================================
  //  STEP 1: FETCH PRODUCT TYPES (Diamond, Gold, etc.)
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    const fetchProductTypes = async () => {
      const visiterID = Cookies.get("visiterId");
      let finalId;
      if (storeinit?.IsB2BWebsite === 0) {
        finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
      } else {
        finalId = loginUserDetail?.id || "0";
      }

      // B. Fetch or Get from Session
      const sessionMenu = getSession("DyamicMenuList");
      if (sessionMenu && sessionMenu !== "[]" && sessionMenu !== "null") {
        if (isMounted) setDynamicMenu(sessionMenu);
      } else {
        try {
          const res = await GETProductType(finalId);
          if (res?.Data?.rd) {
            sessionStorage.setItem(
              "DyamicMenuList",
              JSON.stringify(res.Data.rd),
            );
            if (isMounted) setDynamicMenu(res.Data.rd);
          }
        } catch (err) {
          console.warn("Error fetching Product Types", err);
        }
      }
    };

    fetchProductTypes();

    return () => {
      isMounted = false;
    };
  }, [islogin]);

  // =========================================================================
  //  STEP 2: FETCH SPECIFIC MENUS (Only after DynamicMenu exists)
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    // If no product types, we can't fetch menus.
    if (!DynamicMenu || DynamicMenu.length === 0) {
      setMenuLoading(false);
      return;
    }

    const fetchSpecificMenus = async () => {
      setMenuLoading(true);

      // A. Handle Default Selection IMMEDIATELY
      const savedType = getSession("selectedTabPersistence");
      const isValidSaved =
        savedType &&
        DynamicMenu.some((item) => item.ProductTypeName === savedType);

      let typeToUse = isValidSaved
        ? savedType
        : DynamicMenu[0]?.ProductTypeName;

      if (!selectedProductType || selectedProductType !== typeToUse) {
        if (isMounted) setSelectedProductType(typeToUse);
        sessionStorage.setItem("selectedTabPersistence", typeToUse);
      }

      const visiterID = Cookies.get("visiterId");

      let finalId;
      if (storeinit?.IsB2BWebsite === 0) {
        finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
      } else {
        finalId = loginUserDetail?.id || "0";
      }

      // C. Fetch Menu for the first item only
      const topMenus = DynamicMenu.slice(0, 1);

      const fetchWithRetry = async (menuName, id, retries = 3) => {
        const uniqueCacheKey = `cachedMenu_${menuName}_${id}`;
        const cachedRaw = getSession(uniqueCacheKey);
        if (cachedRaw) return cachedRaw;

        try {
          const res = await GetMenuAPI(id, menuName);
          const rawData = res?.Data?.rd || [];
          if (rawData.length > 0) {
            sessionStorage.setItem(uniqueCacheKey, JSON.stringify(rawData));
            return rawData;
          }
          throw new Error("Empty data");
        } catch (err) {
          if (retries > 0 && isMounted) {
            await wait(1000);
            return fetchWithRetry(menuName, id, retries - 1);
          }
          return [];
        }
      };

      try {
        const results = await Promise.all(
          topMenus.map(async (menuItem) => {
            const data = await fetchWithRetry(
              menuItem.ProductTypeName,
              finalId,
            );
            return { name: menuItem.ProductTypeName, data: data };
          }),
        );

        if (isMounted) {
          const processedData = {};
          results.forEach((res) => {
            processedData[res.name] = buildMenuItems(res.data);
          });
          setMultiMenuData(processedData);
        }
      } catch (error) {
        console.error("Critical error in menu fetching:", error);
      } finally {
        if (isMounted) setMenuLoading(false);
      }
    };

    fetchSpecificMenus();

    return () => {
      isMounted = false;
    };
  }, [DynamicMenu, islogin]); // DEPENDENCY: Runs when DynamicMenu populates

  const currentMenuItems = useMemo(() => {
    const key = selectedProductType || DynamicMenu?.[0]?.ProductTypeName;
    if (!key) return [];
    const items = multiMenuData[key] || [];
    console.log("Navbar Debug - Selected Product Type:", key);
    console.log("Navbar Debug - Menu Items:", items);
    return items;
  }, [selectedProductType, multiMenuData, DynamicMenu]);

  // const handleTabChange = (typeName) => {
  //     setSelectedProductType(typeName);
  //     sessionStorage.setItem("selectedTabPersistence", typeName);
  //     setSyncProductList({
  //       ProductType: typeName,
  //       Source: "navbar",
  //       ts: Date.now(),
  //     });
  // };
  const handleTabChange = (typeName) => {
    if (selectedProductType === typeName) return;

    setSelectedProductType(typeName);
    sessionStorage.setItem("selectedTabPersistence", typeName);

    setSyncProductList({
      ProductType: typeName,
      Source: "navbar",
      ts: Date.now(), // event trigger
    });
  };

  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (
      param?.menuname === "Collection" &&
      param?.key === "Auto" &&
      param?.value === "" &&
      Object.keys(param1 || {}).length === 0 &&
      Object.keys(param2 || {}).length === 0
    ) {
      event?.preventDefault();
      navigate("/collection");
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
        FilterKey1:
          isFilterKey2Ignore === 1 ? (param2?.key ?? "") : (param1?.key ?? ""),
        FilterVal1:
          isFilterKey2Ignore === 1
            ? (param2?.value ?? "")
            : (param1?.value ?? ""),
        FilterKey2: isFilterKey2Ignore === 1 ? "" : (param2?.key ?? ""),
        FilterVal2: isFilterKey2Ignore === 1 ? "" : (param2?.value ?? ""),
      };
      sessionStorage.setItem("menuparams", JSON.stringify(finalData));

      const queryParameters1 = [
        finalData?.FilterKey && `${finalData.FilterVal}`,
        finalData?.FilterKey1 && `${finalData.FilterVal1}`,
        finalData?.FilterKey2 && `${finalData.FilterVal2}`,
      ]
        .filter(Boolean)
        .join("/");

      const queryParameters = [
        finalData?.FilterKey && `${finalData.FilterVal}`,
        finalData?.FilterKey1 && `${finalData.FilterVal1}`,
        finalData?.FilterKey2 && `${finalData.FilterVal2}`,
      ]
        // .filter(Boolean)
        .join(",");

      const otherparamUrl = Object.entries({
        b: finalData?.FilterKey,
        g: finalData?.FilterKey1,
        c: finalData?.FilterKey2,
      })
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => value)
        .filter(Boolean)
        .join(",");

      const paginationParam = [
        `page=${finalData.page ?? 1}`,
        `size=${finalData.size ?? 50}`,
      ].join("&");

      // console.log("otherparamsUrl--", otherparamUrl);

      let menuEncoded = `${queryParameters}/${otherparamUrl}`;
      // const url = `/productlist?V=${queryParameters}/K=${otherparamUrl}`;
      const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

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

    if (clearAllCacheData) {
      clearAllCacheData();
    }

    sessionStorage.clear();
    window.location.replace("/");
    clearSession();
  };

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
  };

  const handleMouseLeave = (index) => {
    setExpandedMenu(null);
    document.body.style.overflow = "auto";
  };

  const tabsData = [
    {
      id: 0,
      gradient: {
        bg: "linear-gradient(135deg, #114D6E 0%, #114D6E 40%, #114D6E 100%)",
        color: "#114D6E",
        border: "#114D6E",
        borderDark: "#114D6E",
      },
    },
    // {
    //   id: 1,
    //   gradient: {
    //     bg: "linear-gradient(135deg, #FFF4DA 0%, #F7E6BC 45%, #E8CF92 100%)",
    //     color: "#7A5A21",
    //     border: "#e8cf92",
    //     borderDark: "#B8933A",
    //   },
    // },
    // {
    //   id: 2,
    //   gradient: {
    //     bg: "linear-gradient(135deg, #F1FFF7 0%, #E2F7ED 45%, #CFF2DF 100%)",
    //     color: "#2A6F56",
    //     border: "#b4e4cc",
    //     borderDark: "#4C9B7A",
    //   },
    // },
  ];

  const activeTabIndex = 0;

  const activeTabStyle = tabsData[activeTabIndex] || {};

  return (
    <>
      <motion.div
        animate={controls}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ position: "sticky", top: 0, zIndex: 999 }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: "transparent !important", top: 0 }}
        >
          <Container
            maxWidth={false}
            disableGutters
            sx={{ width: "100%", px: 0 }}
          >
            <Toolbar
              sx={{
                justifyContent: "space-between",
                px: { xs: 0, sm: 4 },
                minHeight: { xs: 64, sm: 84 },
                bgcolor: "transparent !important",
                color: isHovered || isScrolled ? "#000" : "#fff",
              }}
            >
              {searchOpen && (
                <SearchBarToggle
                  searchOpen={searchOpen}
                  setSearchOpen={setSearchOpen}
                  searchDataFucn={searchDataFucn}
                />
              )}

              {!isMobile && is1400px && (
                <IconButton
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  onClick={handleDrawerToggle}
                  sx={{
                    "&:active": { backgroundColor: "transparent" },
                    "&:hover": {
                      bgcolor: alpha("#000", 0.05),
                      backgroundColor: "transparent",
                    },
                    color: isHovered || isScrolled ? "#000" : "#fff",
                    transition: "all 0.3s ease",
                    flex: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flex: 1,
                  justifyContent:
                    !isMobile && is1400px ? "center" : "flex-start",
                }}
              >
                {isMobile && (
                  <IconButton
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    onClick={handleDrawerToggle}
                    sx={{
                      "&:active": { backgroundColor: "transparent" },
                      "&:hover": {
                        bgcolor: alpha("#000", 0.05),
                        backgroundColor: "transparent",
                      },
                      color: isHovered || isScrolled ? "#000" : "#fff",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <MenuIcon size={22} />
                  </IconButton>
                )}
                <Box component={Link} href="/">
                  <Box
                    component="img"
                    src={compnyLogo}
                    alt="Logo"
                    sx={{
                      width: IsSetupFor ? "150px" : "110px",
                      cursor: "pointer",
                    }}
                    className="el_without_headerLogo_side"
                  />
                </Box>
              </Box>

              {islogin && (
                <Box>
                  <Box>
                    {!isMobile && !is1400px && (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          {menuLoading ? (
                            <Box sx={{ display: "flex", gap: 2 }}>
                              {[1, 2, 3, 4, 5].map((item) => (
                                <Skeleton
                                  key={item}
                                  variant="rectangular"
                                  width={100}
                                  height={30}
                                  sx={{
                                    borderRadius: 6,
                                    bgcolor: "rgba(182, 182, 182, 0.62)",
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            currentMenuItems?.map((item, index) => (
                              <Box
                                key={index}
                                onMouseEnter={() =>
                                  setHoveredItem(item?.menuname)
                                }
                                onMouseLeave={() => setHoveredItem(null)}
                                sx={{ position: "relative" }}
                              >
                                <Box
                                  component={Link}
                                  href="#"
                                  onClick={(e) => {
                                    handelMenu(
                                      {
                                        menuname: item?.menuname,
                                        key: item?.param0name,
                                        value: item?.param0dataname,
                                      },
                                      {},
                                      {},
                                      e,
                                      item?.IsFilterKey1Ignore,
                                    );
                                    handleMouseLeave();
                                    setHoveredItem(null);
                                  }}
                                  sx={{
                                    px: 2,
                                    py: 2.5,
                                    bgcolor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    letterSpacing: 0.8,
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                    position: "relative",
                                    color:
                                      isHovered || isScrolled ? "#000" : "#fff",
                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      top: 40,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      width:
                                        hoveredItem === item?.menuname
                                          ? "80%"
                                          : "0%",
                                      height: 2,
                                      background:
                                        activeTabStyle?.gradient?.borderDark ||
                                        "#000",
                                      transition: "width 0.3s ease",
                                    },
                                    outline: "none",
                                    boxShadow: "none",
                                    "&:hover": {
                                      color:
                                        isHovered || isScrolled
                                          ? "#000"
                                          : "#fff",
                                    },
                                  }}
                                >
                                  {item?.menuname}
                                </Box>

                                <AnimatePresence>
                                  {item.param1 &&
                                    hoveredItem === item?.menuname && (
                                      <>
                                        {/* Invisible bridge — keeps hover alive as mouse moves to dropdown */}
                                        <Box
                                          sx={{
                                            position: "fixed",
                                            top: announcementGone ? 84 : 120,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: {
                                              xs: "95vw",
                                              sm: "85vw",
                                              md: "75vw",
                                              lg: "70vw",
                                              xl: "1400px",
                                            },
                                            maxWidth: "1400px",
                                            height: "8px",
                                            bgcolor: "transparent",
                                          }}
                                          onMouseEnter={() =>
                                            setHoveredItem(item?.menuname)
                                          }
                                          onMouseLeave={() =>
                                            setHoveredItem(null)
                                          }
                                        />
                                        {/* Dropdown panel */}
                                        <Box
                                          onMouseEnter={() =>
                                            setHoveredItem(item?.menuname)
                                          }
                                          onMouseLeave={() =>
                                            setHoveredItem(null)
                                          }
                                          sx={{
                                            position: "fixed",
                                            top: announcementGone ? 92 : 128,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            mt: 0,
                                            bgcolor: "#fff",
                                            border: "none",
                                            borderBottom: `3px solid ${activeTabStyle?.gradient?.borderDark || "#C97A96"}`,
                                            borderRadius: "0 0 8px 8px",
                                            boxShadow:
                                              "0 20px 60px rgba(0,0,0,0.15)",
                                            width: {
                                              xs: "95vw",
                                              sm: "85vw",
                                              md: "75vw",
                                              lg: "70vw",
                                              xl: "1400px",
                                            },
                                            maxWidth: "1400px",
                                            maxHeight: "80vh",
                                            minHeight: "400px",
                                            overflowY: "auto",
                                            display: "flex",
                                            zIndex: 1300,
                                            animation: "fadeIn 0.25s ease",
                                            scrollbarWidth: "thin",
                                            scrollbarColor:
                                              "#bfbfbf transparent",
                                            "&::-webkit-scrollbar": {
                                              width: "6px",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                              backgroundColor: "#bfbfbf",
                                              borderRadius: "10px",
                                            },
                                            "&::before": {
                                              content: '""',
                                              position: "absolute",
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              height: "20px",
                                              background: `radial-gradient( ellipse at top, ${activeTabStyle?.gradient?.color}90, transparent )`,
                                              filter: "blur(55px)",
                                              pointerEvents: "none",
                                            },
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              flex: "1 1 auto",
                                              bgcolor: "#fff",
                                              p: { xs: 2, sm: 3, md: 4 },
                                              width: "100%",
                                            }}
                                          >
                                            <Masonry
                                              columns={{
                                                xs: 2,
                                                sm: 3,
                                                md: 4,
                                                lg: 6,
                                              }}
                                              spacing={1}
                                              sx={{
                                                alignContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              {item?.param1?.map(
                                                (section, index) => (
                                                  <Box
                                                    key={index}
                                                    sx={{
                                                      breakInside: "avoid",
                                                      marginBottom: 2,
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    <Typography
                                                      component={Link}
                                                      href="#"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handelMenu(
                                                          {
                                                            menuname:
                                                              item?.menuname,
                                                            key: item?.param0name,
                                                            value:
                                                              item?.param0dataname,
                                                          },
                                                          {
                                                            key: section?.param1name,
                                                            value:
                                                              section?.param1dataname,
                                                          },
                                                          {},
                                                          e,
                                                          section?.IsFilterKey1Ignore,
                                                        );
                                                        setHoveredItem(null);
                                                      }}
                                                      sx={{
                                                        position: "relative",
                                                        color:
                                                          section?.menuname ===
                                                          "Collection"
                                                            ? "#535353"
                                                            : "#141414",
                                                        fontWeight:
                                                          section?.menuname ===
                                                          "Collection"
                                                            ? 400
                                                            : 700,
                                                        display: "block",
                                                        letterSpacing: 0.5,
                                                        textTransform:
                                                          "capitalize",
                                                        mb:
                                                          section?.menuname ===
                                                          "Collection"
                                                            ? 0
                                                            : 1,
                                                        wordWrap: "break-word",
                                                        cursor: "pointer",
                                                        textUnderlineOffset:
                                                          "0.3rem",
                                                        "&:hover": {
                                                          textDecoration:
                                                            "underline",
                                                          textUnderlineOffset:
                                                            "0.3rem",
                                                        },
                                                        fontSize: "0.92rem",
                                                      }}
                                                    >
                                                      {section?.param1dataname}
                                                    </Typography>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 0.8,
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      {section?.param2
                                                        ?.filter(
                                                          (p) =>
                                                            p?.param2dataname &&
                                                            p?.param2dataname.trim() !==
                                                              "",
                                                        )
                                                        .map(
                                                          (
                                                            param2Item,
                                                            param2Index,
                                                          ) => (
                                                            <Box
                                                              key={param2Index}
                                                              href="#"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handelMenu(
                                                                  {
                                                                    menuname:
                                                                      item?.menuname,
                                                                    key: item?.param0name,
                                                                    value:
                                                                      item?.param0dataname,
                                                                  },
                                                                  {
                                                                    key: section?.param1name,
                                                                    value:
                                                                      section?.param1dataname,
                                                                  },
                                                                  {
                                                                    key: param2Item?.param2name,
                                                                    value:
                                                                      param2Item?.param2dataname,
                                                                  },
                                                                  e,
                                                                  param2Item?.IsFilterKey2Ignore,
                                                                );
                                                                setHoveredItem(
                                                                  null,
                                                                );
                                                              }}
                                                              component={Link}
                                                              sx={{
                                                                position:
                                                                  "relative",
                                                                textAlign:
                                                                  "left",
                                                                px: 0,
                                                                color:
                                                                  "#535353",
                                                                bgcolor:
                                                                  "transparent",
                                                                border: "none",
                                                                cursor:
                                                                  "pointer",
                                                                fontSize:
                                                                  "0.88rem",
                                                                textDecoration:
                                                                  "none",
                                                                borderRadius: 1,
                                                                transition:
                                                                  "all 0.2s ease",
                                                                "&:hover": {
                                                                  color:
                                                                    "#141414",
                                                                  textDecoration:
                                                                    "underline",
                                                                  textUnderlineOffset:
                                                                    "0.3rem",
                                                                },
                                                                outline: "none",
                                                              }}
                                                            >
                                                              {
                                                                param2Item?.param2dataname
                                                              }
                                                            </Box>
                                                          ),
                                                        )}
                                                    </Box>
                                                  </Box>
                                                ),
                                              )}
                                            </Masonry>
                                          </Box>
                                        </Box>
                                      </>
                                    )}
                                </AnimatePresence>
                              </Box>
                            ))
                          )}

                          {!menuLoading && islogin && (
                            <>
                              <Box sx={{ position: "relative" }}>
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
                                    color:
                                      isHovered || isScrolled ? "#000" : "#fff",
                                    outline: "none",
                                    boxShadow: "none",
                                  }}
                                >
                                  New Arrivals
                                </Box>
                              </Box>
                              <Box sx={{ position: "relative" }}>
                                <Box
                                  component={Link}
                                  href="/collection"
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
                                    color:
                                      isHovered || isScrolled ? "#000" : "#fff",
                                    outline: "none",
                                    boxShadow: "none",
                                  }}
                                >
                                  Collection
                                </Box>
                              </Box>
                              <Box sx={{ position: "relative" }}>
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
                                    color:
                                      isHovered || isScrolled ? "#000" : "#fff",
                                    outline: "none",
                                    boxShadow: "none",
                                  }}
                                >
                                  Offers
                                </Box>
                              </Box>
                            </>
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              )}

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
                navigate={navigate}
                isHovered={isHovered}
                isScrolled={isScrolled}
              />
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
            width: { xs: "90%", sm: 380 },
            maxWidth: "100%",
          },
        }}
      >
        {DrawerSearchOpen && (
          <DrawerSearchBar
            setSearchOpen={setDrawerSearchOpen}
            searchDataFucn={searchDataFucn}
          />
        )}
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
            component="img"
            src={compnyLogoM}
            alt="logo"
            sx={{
              width: IsSetupFor ? "110px" : "auto",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            {islogin && (
              <IconButton
                onClick={() => setDrawerSearchOpen((prev) => !prev)}
                sx={{ color: "#000" }}
              >
                <SearchIcon style={{ fontSize: "18px", color: "inherit" }} />
              </IconButton>
            )}
            {islogin && (
              <IconButton
                sx={{ color: "#000" }}
                onClick={() => navigateToMenu("/myWishList")}
              >
                <Badge badgeContent={wishCountNum || 10} color="error">
                  <FavoriteIcon
                    style={{ fontSize: "18px", color: "inherit" }}
                  />
                </Badge>
              </IconButton>
            )}
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <MobileMenu
          activeMenu={activeMenu}
          menuItems={currentMenuItems.length > 0 ? currentMenuItems : []}
          handleMobileMenuClick={handleMobileMenuClick}
          handleMobileBack={handleMobileBack}
          handelMenu={handelMenu}
          islogin={islogin}
          storeinit={storeinit}
          IsB2BWebsiteChek={IsB2BWebsiteChek}
          DynamicMenu={DynamicMenu}
          selectedProductType={selectedProductType}
          handleTabChange={handleTabChange}
          showProductTypeTabs={true}
        />
      </Drawer>
    </>
  );
};

export default BeluxNavbar;
