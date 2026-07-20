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
import { usePathname, useRouter } from "next/navigation";
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
    finalId,
  } = useStore();

  const { clearAllCacheData } = useMaster();

  const setSyncProductList = useSyncStore((state) => state.setSyncProductList);

  const IsSetupFor = true;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const is1400px = useMediaQuery(theme.breakpoints.down("1400"));
  const is768px = useMediaQuery("(max-width:428px)");
  const { broadcast } = useBroadcaster();
  const router = useRouter();
  const Router = useNextRouterLikeRR().push;
  const navigate = (url) => Router(url);
  const location = usePathname();

  const compnyLogo = logos?.web;
  const compnyLogoM = logos?.mobile;

  const [expandedMenu, setExpandedMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuStack, setMenuStack] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const handleMenuMouseEnter = (menuname) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredItem(menuname);
  };

  const handleMenuMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementGone, setAnnouncementGone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [DrawerSearchOpen, setDrawerSearchOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [menuItems, setMenuItems] = useState([]);

  const controls = useAnimation();
  const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;

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
      // borderBottom:
      //   isHovered || isScrolled
      //     ? "1px solid #e2e2e2c0"
      //     : "1px solid transparent",
      transition: {
        type: "spring",
        stiffness: 45,
        damping: 15,
        mass: 0.8,
        duration: 0.8,
      },
    });
  }, [isHovered, isScrolled, controls]);

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      const cacheKey = `beluxMenu_${finalId}`;
      let menuData = getSession(cacheKey);

      if (!menuData || menuData === "[]" || menuData === "null") {
        try {
          const res = await GetMenuAPI(finalId);
          const rawData = res?.Data?.rd || [];
          if (rawData.length > 0) {
            sessionStorage.setItem(cacheKey, JSON.stringify(rawData));
            menuData = rawData;
          }
        } catch (err) {
          console.warn("[Navbar] GetMenuAPI failed", err);
        }
      }

      if (isMounted && menuData?.length) {
        setMenuItems(buildMenuItems(menuData));
      }

      if (isMounted) setMenuLoading(false);
    };

    setMenuLoading(true);
    loadMenu();

    return () => {
      isMounted = false;
    };
    // Intentional: only re-run when the user identity changes (login/logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [islogin, loginUserDetail]);

  const currentMenuItems = useMemo(() => {
    return menuItems;
  }, [menuItems]);

  const getMenuUrl = (param, param1, param2, isFilterKey2Ignore) => {
    if (
      param?.menuname === "Collection" &&
      param?.key === "Auto" &&
      param?.value === "" &&
      Object.keys(param1 || {}).length === 0 &&
      Object.keys(param2 || {}).length === 0
    ) {
      return { url: "/collection", finalData: null };
    }

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
    ].join(",");

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(",");

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

    return { url, finalData };
  };

  const prefetchedUrlsRef = useRef(new Set());

  const handlePrefetch = (param, param1, param2, isFilterKey2Ignore) => {
    try {
      const { url } = getMenuUrl(param, param1, param2, isFilterKey2Ignore);
      if (url && url !== "#" && !prefetchedUrlsRef.current.has(url)) {
        prefetchedUrlsRef.current.add(url);
        router.prefetch(url);
      }
    } catch (err) {
      // ignore prefetch errors
    }
  };

  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredItem(null);
    setMobileOpen(false);
    setActiveMenu(null);

    if (
      event?.ctrlKey ||
      event?.shiftKey ||
      event?.metaKey ||
      (event?.button && event?.button === 1)
    ) {
      return;
    }
    event?.preventDefault();

    const { url, finalData } = getMenuUrl(
      param,
      param1,
      param2,
      isFilterKey2Ignore,
    );
    if (finalData) {
      sessionStorage.setItem("menuparams", JSON.stringify(finalData));
    }
    router.push(url);
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
                            currentMenuItems?.map((item, index) => {
                              const topUrl =
                                getMenuUrl(
                                  {
                                    menuname: item?.menuname,
                                    key: item?.param0name,
                                    value: item?.param0dataname,
                                  },
                                  {},
                                  {},
                                  item?.IsFilterKey1Ignore,
                                )?.url || "#";

                              return (
                                <Box
                                  key={index}
                                  onMouseEnter={() => {
                                    handleMenuMouseEnter(item?.menuname);
                                    handlePrefetch(
                                      {
                                        menuname: item?.menuname,
                                        key: item?.param0name,
                                        value: item?.param0dataname,
                                      },
                                      {},
                                      {},
                                      item?.IsFilterKey1Ignore,
                                    );
                                  }}
                                  onMouseLeave={handleMenuMouseLeave}
                                  sx={{ position: "relative" }}
                                >
                                  <Box
                                    component={Link}
                                    href={topUrl}
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
                                        isHovered || isScrolled
                                          ? "#000"
                                          : "#fff",
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
                                          activeTabStyle?.gradient
                                            ?.borderDark || "#000",
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
                                              top: announcementGone ? 75 : 110,
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
                                              height: "25px",
                                              bgcolor: "transparent",
                                              zIndex: 1301,
                                            }}
                                            onMouseEnter={() =>
                                              handleMenuMouseEnter(
                                                item?.menuname,
                                              )
                                            }
                                            onMouseLeave={handleMenuMouseLeave}
                                          />
                                          {/* Dropdown panel */}
                                          <Box
                                            onMouseEnter={() =>
                                              handleMenuMouseEnter(
                                                item?.menuname,
                                              )
                                            }
                                            onMouseLeave={handleMenuMouseLeave}
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
                                                  (section, sectionIndex) => {
                                                    const secUrl =
                                                      getMenuUrl(
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
                                                        section?.IsFilterKey1Ignore,
                                                      )?.url || "#";

                                                    return (
                                                      <Box
                                                        key={sectionIndex}
                                                        sx={{
                                                          breakInside: "avoid",
                                                          marginBottom: 2,
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        <Typography
                                                          component={Link}
                                                          href={secUrl}
                                                          onMouseEnter={() =>
                                                            handlePrefetch(
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
                                                              section?.IsFilterKey1Ignore,
                                                            )
                                                          }
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
                                                          }}
                                                          sx={{
                                                            position:
                                                              "relative",
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
                                                            wordWrap:
                                                              "break-word",
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
                                                          {
                                                            section?.param1dataname
                                                          }
                                                        </Typography>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                              "column",
                                                            gap: 0.8,
                                                            alignItems:
                                                              "center",
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
                                                              ) => {
                                                                const subUrl =
                                                                  getMenuUrl(
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
                                                                    param2Item?.IsFilterKey2Ignore,
                                                                  )?.url || "#";

                                                                return (
                                                                  <Box
                                                                    key={
                                                                      param2Index
                                                                    }
                                                                    href={
                                                                      subUrl
                                                                    }
                                                                    onMouseEnter={() =>
                                                                      handlePrefetch(
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
                                                                        param2Item?.IsFilterKey2Ignore,
                                                                      )
                                                                    }
                                                                    onClick={(
                                                                      e,
                                                                    ) => {
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
                                                                    }}
                                                                    component={
                                                                      Link
                                                                    }
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
                                                                      border:
                                                                        "none",
                                                                      cursor:
                                                                        "pointer",
                                                                      fontSize:
                                                                        "0.88rem",
                                                                      textDecoration:
                                                                        "none",
                                                                      borderRadius: 1,
                                                                      transition:
                                                                        "all 0.2s ease",
                                                                      "&:hover":
                                                                        {
                                                                          color:
                                                                            "#141414",
                                                                          textDecoration:
                                                                            "underline",
                                                                          textUnderlineOffset:
                                                                            "0.3rem",
                                                                        },
                                                                      outline:
                                                                        "none",
                                                                    }}
                                                                  >
                                                                    {
                                                                      param2Item?.param2dataname
                                                                    }
                                                                  </Box>
                                                                );
                                                              },
                                                            )}
                                                        </Box>
                                                      </Box>
                                                    );
                                                  },
                                                )}
                                              </Masonry>
                                            </Box>
                                          </Box>
                                        </>
                                      )}
                                  </AnimatePresence>
                                </Box>
                              );
                            })
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
                                    fontSize: "0.95rem",
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
                                    fontSize: "0.95rem",
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
                              {/* <Box sx={{ position: "relative" }}>
                                <Box
                                  component={Link}
                                  href="/offers"
                                  sx={{
                                    px: 2,
                                    py: 3,
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
                                    outline: "none",
                                    boxShadow: "none",
                                  }}
                                >
                                  Offers
                                </Box>
                              </Box> */}
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
          DynamicMenu={[]}
          selectedProductType={null}
          handleTabChange={() => {}}
          showProductTypeTabs={false}
        />
      </Drawer>
    </>
  );
};

export default BeluxNavbar;
