'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Link as MuiLink,
  Badge,
  Tooltip,
  Skeleton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import "./Header.modul.scss";
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Link from 'next/link';
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import Cookies from "js-cookie";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { getPricingContext, buildMenuCacheKey } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";
import { getSession, setSession, clearSession } from "@/app/(core)/utils/FetchSessionData";
import LogOutModal from "@/app/components/ui/LogOut";
import CartDrawer from "@/app/theme/fgstore.web/cart/CartPageB2c/Cart";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchBarToggle from "./SearchBarToggle";
import DrawerSearchBar from "./DrawerSearchbar";


// Theme colors 
const NAVY = '#0d1232';
const GOLD = '#b8975a';
const WHITE = '#ffffff';
const OFF_WHITE = '#f5f0e8';
const TEXT_LIGHT = '#ccc8bb';

// Static links shown when the user is NOT logged in 
const STATIC_NAV_LINKS = [
  { label: 'Diamond Shape', href: '/#diamondShape' },
  { label: 'Featured Products', href: '/#featuredProducts' },
  { label: 'Trending Now', href: '/#Trendingnow' },
  { label: 'Services', href: '/#customerService' },
];

const FALLBACK_IMAGE_PAIRS = [
  [
    { label: 'DISCOVER OUR HISTORY', src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80' },
    { label: 'VISIT OUR SHOP', src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
  ],
  [
    { label: 'EXPLORE HIGH JEWELRY', src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
    { label: 'BOOK AN APPOINTMENT', src: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80' },
  ],
  [
    { label: 'EXPLORE THE SPRING GIFT GUIDE', src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80' },
    { label: 'EXPLORE SUNFLOWER', src: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80' },
  ],
  [
    { label: 'FIND YOUR RING', src: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80' },
    { label: 'BRIDAL GUIDE', src: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80' },
  ],
  [
    { label: 'DISCOVER TIMEPIECES', src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80' },
    { label: 'GOLD JEWELRY', src: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80' },
  ],
  [
    { label: 'SHOP ACCESSORIES', src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
    { label: 'GIFT IDEAS', src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80' },
  ],
  [
    { label: 'BOOK A CONSULTATION', src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80' },
    { label: 'CARE & REPAIR', src: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80' },
  ],
];


function HWMonogram() {
  return (
    <Box

      className="hwMonogram"
      sx={{
        width: 44,
        height: 52,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px 4px 50% 50% / 4px 4px 30% 30%',
        bgcolor: 'transparent',
        flexShrink: 0,
      }}
    >
      <Typography
        className='hwMonogramText'
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '13px',

          letterSpacing: '1px',
          lineHeight: 1,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        LJ
      </Typography>
    </Box>
  );
}

//   Mega Menu Panel  (desktop hover dropdown — unchanged)
function MegaMenu({ item, images, onColumnClick, onLinkClick }) {
  const columns = item?.param1 || [];

  return (
    <Box

      className="megaMenuPanel"
      sx={{
        bgcolor: WHITE,

        py: 5,
        px: { xs: 3, md: 8 },
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <Grid container spacing={4}>
        {/* Text columns — one per param1 entry */}
        {columns.map((col, ci) => {
          const visibleLinks = (col.param2 || []).filter(
            (p2) => p2?.param2dataname && p2.param2dataname.trim() !== ''
          );

          return (
            <Grid item xs={12} sm={3} key={col.param1dataid ?? ci}>
              <Typography
                onClick={(e) => onColumnClick(item, col, e)}
                className='megaMenuText'
                sx={{

                  fontSize: '11px',
                  letterSpacing: '2px',
                  color: '#222',
                  fontWeight: 600,
                  mb: 1.5,
                  pb: 1,

                  display: 'inline-block',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {col.param1dataname}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mt: 1.5 }}>
                {visibleLinks.map((param2Item, li) => (
                  <MuiLink
                    key={param2Item.param2dataid ?? li}
                    href="#"
                    underline="none"
                    onClick={(e) => {
                      e.preventDefault();
                      onLinkClick(item, col, param2Item, e);
                    }}
                    className='megaMenuTextLink'
                    sx={{

                      fontSize: '12px',
                      letterSpacing: '1.5px',
                      color: '#444',

                      transition: 'color 0.2s',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {param2Item.param2dataname}
                  </MuiLink>
                ))}
              </Box>
            </Grid>
          );
        })}


        <Grid
          item
          xs={12}
          sm={12 - columns.length * 3}
          sx={{ display: 'flex', gap: 2, ml: 'auto' }}
        >
          {images.map((img, ii) => (
            <Box
              key={ii}
              sx={{ flex: 1, minWidth: 180, maxWidth: 260, cursor: 'pointer', '&:hover .img-overlay': { opacity: 1 } }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden', mb: 1 }}>
                <Box
                  component="img"
                  src={img.src}
                  alt={img.label}
                  sx={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                    '&:hover': { transform: 'scale(1.04)' },
                  }}
                />
                <Box
                  className="img-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(13,18,50,0.15)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                />
              </Box>
              <Box
                className='megaMenuButton'
                sx={{
                  border: `1px solid #ccc`,
                  py: 1.2,
                  textAlign: 'center',

                  transition: 'border-color 0.2s',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    color: '#333',
                  }}
                >
                  {img.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}


export default function HarryWinstonHeader({ storeinit, logos }) {
  const {
    islogin,
    setislogin,
    loginUserDetail,
    finalId,
    cartCountNum,
    wishCountNum,
    setCartOpenStateB2C,
  } = useStore();
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ── FIX: two independent search states instead of one shared one ────────
  // Previously a single `DrawerSearchOpen` boolean controlled BOTH the
  // desktop inline search bar AND the mobile drawer search bar. Toggling
  // one via `setDrawerSearchOpen` made both render at the same time, so
  // clicking the search icon inside the drawer also popped open the
  // "outside" (desktop) search bar. Splitting them fixes that.
  const [SearchOpen, setSearchOpen] = useState(false);         // desktop inline search
  const [DrawerSearchOpen, setDrawerSearchOpen] = useState(false); // mobile drawer search

  const [isCartOpen, setIsCartOpen] = useState(false);
  const closeTimer = useRef(null);
  const { push } = useNextRouterLikeRR();
  const navigate = (url) => push(url);

  // ── Mobile drawer navigation (UI only — reuses existing handlers) ───────
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
    setActiveMobileMenu(null);
  };

  const handleMobileItemClick = (item, event) => {
    if (item?.param1?.length) {
      setActiveMobileMenu(item.menuname);
    } else {
      handleTopLevelClick(item, event);
      setMobileOpen(false);
    }
  };

  const handleMobileBack = () => setActiveMobileMenu(null);

  const companyLogo = logos?.web;
  const IsCartNo = storeinit?.CartNo;


  useEffect(() => {
    const value = (typeof window !== "undefined" && window.__LOGIN_USER__) || getSession("LoginUser");
    setislogin(value);
    setIsMounted(true);
  }, [setislogin]);

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


  const getMenuApi = async () => {
    const isB2B = storeinit?.IsB2BWebsite === 1;
    if (isB2B && !islogin) {
      setMenuLoading(false);
      return;
    }

    setMenuLoading(true);
    const cacheKey = `julianMenu_${finalId}`;

    // 1. Client Session Cache Check (Instant browser memory/session read)
    let cachedSessionData = getSession(cacheKey);
    if (cachedSessionData && Array.isArray(cachedSessionData) && cachedSessionData.length > 0) {
      const hasError = cachedSessionData.some(
        (item) =>
          item?.stat === 0 ||
          (typeof item?.stat_msg === "string" &&
            item.stat_msg.toLowerCase().includes("error")),
      );
      if (!hasError) {
        setMenuData(cachedSessionData);
        setMenuLoading(false);
        return;
      }
    }

    // 2. Server Disk Cache Check (Fast server file cache read)
    try {
      const cacheRes = await readCache(cacheKey);
      if (cacheRes?.cached && Array.isArray(cacheRes.data) && cacheRes.data.length > 0) {
        const hasError = cacheRes.data.some(
          (item) =>
            item?.stat === 0 ||
            (typeof item?.stat_msg === "string" &&
              item.stat_msg.toLowerCase().includes("error")),
        );
        if (!hasError) {
          setMenuData(cacheRes.data);
          setSession(cacheKey, cacheRes.data);
          setMenuLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("[julian Header] File cache read error:", err);
    }

    // 3. Cache Miss — Call Live GetMenuAPI
    try {
      const response = await GetMenuAPI(finalId);
      const apiData = response?.Data?.rd || [];
      const hasError = apiData.some(
        (item) =>
          item?.stat === 0 ||
          (typeof item?.stat_msg === "string" &&
            item.stat_msg.toLowerCase().includes("error")),
      );

      if (apiData.length > 0 && !hasError) {
        setMenuData(apiData);
        setSession(cacheKey, apiData);
        writeCache(cacheKey, apiData).catch(console.error);
      }
    } catch (err) {
      console.error("[julian Header] GetMenuAPI failed:", err);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) {
      getMenuApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [islogin, isMounted, loginUserDetail, finalId]);

  // ── Transform flat menuData rows into menuid → param1 → param2 tree ─────
  useEffect(() => {
    const uniqueMenuIds = [...new Set(menuData?.map((item) => item?.menuid))];
    const uniqueMenuItems = uniqueMenuIds.map((menuid) => {
      const item = menuData?.find((data) => data?.menuid === menuid);
      const param1DataIds = [
        ...new Set(
          menuData?.filter((data) => data?.menuid === menuid)?.map((it) => it?.param1dataid)
        ),
      ];

      const param1Items = param1DataIds.map((param1dataid) => {
        const param1Item = menuData?.find(
          (data) => data?.menuid === menuid && data?.param1dataid === param1dataid
        );
        const param2Items = menuData
          ?.filter((data) => data?.menuid === menuid && data?.param1dataid === param1dataid)
          ?.map((it) => ({
            param2dataid: it?.param2dataid,
            param2dataname: it?.param2dataname,
            param2id: it?.param2id,
            param2name: it?.param2name,
            IsFilterKey2Ignore: it?.IsFilterKey1Ignore,
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
        displayorder: item?.displayorder,
      };
    });

    const sortedMenuItems = uniqueMenuItems?.sort((a, b) => a?.displayorder - b?.displayorder);
    setMenuItems(sortedMenuItems);
  }, [menuData]);

  //   Navigation logic (ported verbatim from MaxNavbar's handelMenu) 
  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (
      param?.menuname === "Collection" &&
      param?.key === "Auto" &&
      param?.value === "" &&
      Object.keys(param1 || {}).length === 0 &&
      Object.keys(param2 || {}).length === 0
    ) {
      navigate('/collection');
      return;
    }

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
      .filter(([, value]) => value !== undefined)
      .map(([, value]) => value)
      .filter(Boolean)
      .join(",");

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

    navigate(url);
    setActiveMenu(null);
  };

  const handleTopLevelClick = (item, event) => {
    handelMenu(
      { menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname },
      {},
      {},
      event,
      item?.IsFilterKey1Ignore
    );
  };

  const handleColumnClick = (item, col, event) => {
    handelMenu(
      { menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname },
      { key: col?.param1name, value: col?.param1dataname },
      {},
      event,
      col?.IsFilterKey1Ignore
    );
  };

  const handleLeafLinkClick = (item, col, param2Item, event) => {
    handelMenu(
      { menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname },
      { key: col?.param1name, value: col?.param1dataname },
      { key: param2Item?.param2name, value: param2Item?.param2dataname },
      event,
      param2Item?.IsFilterKey2Ignore
    );
  };

  const handleMouseEnter = (e, label) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const handleMenuMouseEnter = () => clearTimeout(closeTimer.current);
  const handleMenuMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  //  Login / logout 
  const handleLoginIconClick = () => {
    if (islogin) {
      setIsLogoutModalOpen(true);
    } else {
      navigate("/LoginOption");
    }
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
    sessionStorage.clear();
    clearSession();
    window.location.replace("/");
  };

  //  Cart drawer (same pattern as old Header.jsx) 
  const toggleCartDrawer = () => {
    setIsCartOpen((prevState) => !prevState);
    const isCartDrawerOpen = JSON.parse(sessionStorage.getItem("isCartDrawer"));
    sessionStorage.setItem("isCartDrawer", !isCartDrawerOpen);
    setCartOpenStateB2C((prevState) => !prevState);
  };

  const activeIndex = menuItems.findIndex((n) => n.menuname === activeMenu);
  const activeItem = activeIndex >= 0 ? menuItems[activeIndex] : null;
  const activeImages =
    activeIndex >= 0 ? FALLBACK_IMAGE_PAIRS[activeIndex % FALLBACK_IMAGE_PAIRS.length] : [];

  // ── Mobile drawer data source (same source as desktop nav — no data change) ─
  const mobileTopLevelItems =
    isMounted && islogin && menuItems?.length > 0 ? menuItems : null;
  const activeMobileItem = mobileTopLevelItems?.find(
    (item) => item.menuname === activeMobileMenu
  );

  return (
    <>


      <Box component="header" data-header sx={{ position: 'relative', top: 0, zIndex: 1200 }}>
        {/* <Box component="header" data-header sx={{ position: 'sticky', top: 0, zIndex: 1200 }}> */}
        {/* Top navy bar */}
        <Box

          className="HeaderContainer"
          sx={{

            px: { xs: 2, md: 6 },
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
          }}
        >

          {/* Hamburger — mobile only */}
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="Open menu"
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              position: 'absolute',
              left: { xs: 8, sm: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              color: TEXT_LIGHT,
              '&:hover': { color: WHITE },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {/* <Typography
              sx={{
                 
                fontSize: { xs: '22px', md: '30px' },
                fontWeight: 400,
                color: WHITE,
                letterSpacing: { xs: '6px', md: '10px' },
                whiteSpace: 'nowrap',
                userSelect: 'none',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              onClick={() => push(`/`)}
            >
              Julian Vance
            </Typography> */}
            <Box
              component="img"
              src={companyLogo}
              alt="Logo"
              onClick={() => push('/')}
              sx={{
                height: { xs: '60px', md: '90px' },
                marginTop: { xs: 2, md: 0 },
                width: 'auto',
                padding: { xs: 0, md: 2 },
                cursor: 'pointer',
                userSelect: 'none',
                display: 'block',
              }}
            />
          </Box>

          {/* FIX: this is the DESKTOP inline search bar — now controlled by
              `SearchOpen`, completely independent from the drawer's search */}
          {SearchOpen && (
            <DrawerSearchBar
              setSearchOpen={setSearchOpen}
              searchDataFucn={searchDataFucn}
            />
          )}

          {/* Right-side icon cluster: wishlist + cart (logged-in only) + login/logout
              NOTE: Search + Wishlist are hidden here on mobile — they live inside
              the drawer header instead (see Drawer below). Cart / Account / Login
              stay visible on every screen size. */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isMounted && islogin && (
              <>

                <IconButton
                  onClick={() => setSearchOpen((prev) => !prev)}
                  sx={{
                    color: "#000",
                    display: { xs: 'none', md: 'inline-flex' },
                  }}
                >
                  <SearchIcon style={{ fontSize: "20px", color: "#ffffff" }} />
                </IconButton>
                {/* Wishlist */}
                <Tooltip title="WishList">
                  <IconButton
                    onClick={() => navigate("/myWishList")}
                    aria-label="Wishlist"
                    sx={{
                      color: TEXT_LIGHT,
                      p: 0.8,
                      '&:hover': { color: WHITE },
                      display: { xs: 'none', md: 'inline-flex' },
                    }}
                  >
                    <Badge badgeContent={wishCountNum} max={1000} overlap="rectangular" color="secondary">
                      <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Cart */}
                <Tooltip title="Cart">
                  {IsCartNo == 2 ? (
                    <IconButton
                      onClick={toggleCartDrawer}
                      aria-label="Cart"
                      sx={{ color: TEXT_LIGHT, p: 0.8, '&:hover': { color: WHITE } }}
                    >
                      <Badge badgeContent={cartCountNum} max={1000} overlap="rectangular" color="secondary">
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    </IconButton>
                  ) : (
                    <IconButton
                      component={Link}
                      href="/cartPage"
                      aria-label="Cart"
                      sx={{ color: TEXT_LIGHT, p: 0.8, '&:hover': { color: WHITE } }}
                    >
                      <Badge badgeContent={cartCountNum} max={1000} overlap="rectangular" color="secondary">
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    </IconButton>
                  )}
                </Tooltip>


                <Tooltip title="Account">
                  <IconButton
                    onClick={() => navigate("/account")} // or component={Link} href="/account" depending on your routing setup
                    aria-label="Account"
                    sx={{ color: TEXT_LIGHT, p: 0.8, '&:hover': { color: WHITE } }}
                  >
                    <PersonOutlineIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {/* Login / Logout — replaces the old location icon */}
            <Tooltip title={islogin ? "Log out" : "Log in"}>
              <IconButton
                onClick={handleLoginIconClick}
                aria-label={islogin ? "Log out" : "Log in"}
                sx={{ color: TEXT_LIGHT, p: 0.8, '&:hover': { color: WHITE } }}
              >
                {islogin ? <LogoutIcon sx={{ fontSize: 20 }} /> : <PersonOutlineIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Gold divider with monogram */}
        <Box
          className="monogram"
          sx={{

            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, md: 6 },
            pb: 1.5,
          }}
        >
          <Box className="hwMonogramDivider" sx={{ flex: 1, height: '0.5px', opacity: 0.7 }} />
          <Box sx={{ mx: 2 }}>
            <HWMonogram />
          </Box>
          <Box className="hwMonogramDivider" sx={{ flex: 1, height: '0.5px', opacity: 0.7 }} />
        </Box>

        {/* Navigation bar — DESKTOP ONLY now, mobile uses the drawer below
            Logged out  -> static links (Diamond Shape, Featured Products, Trending Now, Services)
            Logged in   -> dynamic API-driven menu with mega menu dropdown       */}
        <Box
          className="navBar"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            px: { xs: 2, md: 6 },
            pb: 2,
            minHeight: '36px',
            flexWrap: 'wrap',
          }}
        >
          {menuLoading ? (
            <Box sx={{ display: "flex", gap: { xs: 2, md: 4 }, justifyContent: "center", alignItems: "center", minHeight: "36px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={110}
                  height={18}
                  sx={{
                    borderRadius: 1,
                    bgcolor: "rgba(255, 255, 255, 0.22)",
                  }}
                />
              ))}
            </Box>
          ) : isMounted && islogin && menuItems?.length > 0 ? (
            menuItems?.map((item, index) => {
              const isActive = activeMenu === item.menuname;
              return (
                <Box
                  key={item.menuid ?? index}
                  onMouseEnter={(e) => handleMouseEnter(e, item.menuname)}
                  onMouseLeave={handleMouseLeave}
                  sx={{ position: 'relative' }}
                >
                  <Typography
                    component="span"
                    onClick={(e) => handleTopLevelClick(item, e)}
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: { xs: '14px', md: '16px' },
                      letterSpacing: '2px',
                      fontWeight: 500,
                      color: isActive ? GOLD : "white",
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s',
                      '&:hover': { color: GOLD },
                      pb: 0.5,
                      borderBottom: isActive ? `1px solid ${GOLD}` : '1px solid transparent',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.menuname}
                  </Typography>
                </Box>
              );
            })
          ) : (
            STATIC_NAV_LINKS.map((link) => (
              <Box key={link.label} sx={{ position: 'relative' }}>
                <Typography
                  component={Link}
                  href={link.href}
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: { xs: '14px', md: '16px' },
                    letterSpacing: '2px',
                    fontWeight: 500,
                    color: "white",
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                    '&:hover': { color: GOLD },
                    pb: 0.5,
                    borderBottom: '1px solid transparent',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Mega Menu Dropdown (logged-in users only, desktop hover)  */}
        {isMounted && islogin && activeItem && (
          <Box
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              overflowX: 'hidden',   // safety net
            }}
          >
            <MegaMenu
              item={activeItem}
              images={activeImages}
              onColumnClick={handleColumnClick}
              onLinkClick={handleLeafLinkClick}
            />
          </Box>
        )}
      </Box>

      {/* ── Mobile Drawer Navigation ─────────────────────────────────────── */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '85%', sm: 380 },
            maxWidth: '100%',
            bgcolor: WHITE,
          },
        }}
      >
        {/* Inline search bar — toggled via the search icon below.
            FIX: stays on its own `DrawerSearchOpen` state, so it never
            gets triggered by the desktop search icon anymore. */}
        {DrawerSearchOpen && (
          <DrawerSearchBar
            isFormobile={true}
            setSearchOpen={setDrawerSearchOpen}
            searchDataFucn={searchDataFucn}
          />
        )}

        {/* Drawer header: logo + search + wishlist + close
            Search & Wishlist live here (mobile-only) instead of the main header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: `1px solid ${alpha('#000', 0.08)}`,
          }}
        >
          <Box
            component="img"
            src={companyLogo}
            alt="Logo"
            sx={{ height: '32px', width: 'auto' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            {isMounted && islogin && (
              <>
                <IconButton
                  onClick={() => setDrawerSearchOpen((prev) => !prev)}
                  aria-label="Search"
                  sx={{ color: '#000' }}
                >
                  <SearchIcon style={{ fontSize: '20px', color: 'inherit' }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    navigate('/myWishList');
                    setMobileOpen(false);
                  }}
                  aria-label="Wishlist"
                  sx={{ color: '#000' }}
                >
                  <Badge badgeContent={wishCountNum} max={1000} overlap="rectangular" color="secondary">
                    <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>
              </>
            )}
            <IconButton onClick={handleDrawerToggle} aria-label="Close menu" sx={{ color: '#000' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Drill-down view: a top-level item's columns + leaf links */}
        {activeMobileItem ? (
          <Box sx={{ bgcolor: WHITE, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha('#000', 0.08)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                position: 'sticky',
                top: 0,
                bgcolor: WHITE,
                zIndex: 1,
              }}
            >
              <IconButton
                onClick={handleMobileBack}
                sx={{
                  color: '#000',
                  p: 0.8,
                  bgcolor: alpha('#000', 0.05),
                  '&:hover': { bgcolor: alpha('#000', 0.08) },
                }}
              >
                <ArrowBackRoundedIcon fontSize="small" />
              </IconButton>
              <Typography
                onClick={(e) => {
                  handleTopLevelClick(activeMobileItem, e);
                  setMobileOpen(false);
                }}
                sx={{
                  fontWeight: 600,
                  color: '#000',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {activeMobileItem.menuname}
              </Typography>
            </Box>

            <List sx={{ flex: 1, overflowY: 'auto', bgcolor: WHITE, py: 1 }}>
              {activeMobileItem.param1?.map((col, colIndex) => {
                const visibleLinks = (col.param2 || []).filter(
                  (p2) => p2?.param2dataname && p2.param2dataname.trim() !== ''
                );
                return (
                  <Box key={col.param1dataid ?? colIndex}>
                    <ListItem disablePadding sx={{ px: 3, py: 0.8 }}>
                      <Typography
                        onClick={(e) => {
                          handleColumnClick(activeMobileItem, col, e);
                          setMobileOpen(false);
                        }}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: '#222',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {col.param1dataname}
                      </Typography>
                    </ListItem>
                    {visibleLinks.length > 0 && (
                      <Box sx={{ pl: 1 }}>
                        {visibleLinks.map((param2Item, li) => (
                          <ListItemButton
                            key={param2Item.param2dataid ?? li}
                            onClick={(e) => {
                              handleLeafLinkClick(activeMobileItem, col, param2Item, e);
                              setMobileOpen(false);
                            }}
                            sx={{
                              py: 0.6,
                              px: 3,
                              '&:hover': { bgcolor: alpha('#000', 0.04) },
                            }}
                          >
                            <ListItemText
                              primary={param2Item.param2dataname}
                              primaryTypographyProps={{
                                sx: { fontSize: '0.85rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </Box>
                    )}
                    <Divider sx={{ my: 0.5 }} />
                  </Box>
                );
              })}
            </List>
          </Box>
        ) : (
          /* Main list: dynamic menu (logged in) or static links (logged out) */
          <List sx={{ pt: 0, bgcolor: WHITE }}>
            {!islogin && (
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/LoginOption"
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha('#000', 0.06)}`,
                    '&:hover': { bgcolor: alpha('#000', 0.04) },
                  }}
                >
                  <ListItemText
                    primary="Login"
                    primaryTypographyProps={{
                      sx: { fontSize: '1rem', fontWeight: 500, letterSpacing: 0.4, color: '#3C3C3C' },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {mobileTopLevelItems
              ? mobileTopLevelItems.map((item, index) => (
                  <ListItem
                    key={item.menuid ?? index}
                    disablePadding
                    secondaryAction={
                      item.param1?.length ? (
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMobileMenu(item.menuname);
                          }}
                          sx={{ color: '#000' }}
                        >
                          <ChevronRightRoundedIcon />
                        </IconButton>
                      ) : null
                    }
                    sx={{ borderBottom: `1px solid ${alpha('#000', 0.06)}` }}
                  >
                    <ListItemButton
                      onClick={(e) => handleMobileItemClick(item, e)}
                      sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: alpha('#000', 0.04) } }}
                    >
                      <ListItemText
                        primary={item.menuname}
                        primaryTypographyProps={{
                          sx: { fontSize: '1rem', fontWeight: 500, letterSpacing: 0.4, color: '#3C3C3C', textTransform: 'uppercase' },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              : STATIC_NAV_LINKS.map((link) => (
                  <ListItem key={link.label} disablePadding sx={{ borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>
                    <ListItemButton
                      component="a"
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: alpha('#000', 0.04) } }}
                    >
                      <ListItemText
                        primary={link.label}
                        primaryTypographyProps={{
                          sx: { fontSize: '1rem', fontWeight: 500, letterSpacing: 0.4, color: '#3C3C3C', textTransform: 'uppercase' },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}

            {isMounted && islogin && (
              <ListItem disablePadding sx={{ borderBottom: `1px solid ${alpha('#000', 0.06)}` }}>
                <ListItemButton
                  onClick={() => {
                    navigate('/account');
                    setMobileOpen(false);
                  }}
                  sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: alpha('#000', 0.04) } }}
                >
                  <ListItemText
                    primary="Account"
                    primaryTypographyProps={{ sx: { fontSize: '1rem', fontWeight: 500, letterSpacing: 0.4, color: '#3C3C3C' } }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        )}
      </Drawer>

      {IsCartNo == 2 && <CartDrawer open={isCartOpen} />}

      <LogOutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}