"use client";

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Collapse,
  Button,
  Badge,
  Tooltip
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  LocalMallOutlined as MallIcon,
  FavoriteBorder as WishlistIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Logout as LogoutIcon,
  Facebook,
  Instagram,
  YouTube
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// ── Dynamic data / auth wiring (ported from HarryWinstonHeader reference) ──
import Cookies from 'js-cookie';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { GetMenuAPI } from '@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { getPricingContext, buildMenuCacheKey } from '@/app/(core)/cache_utility/CacheBuilder';
import { readCache, writeCache } from '@/app/(core)/cache_utility/cacheActions';
import { getSession, clearSession } from '@/app/(core)/utils/FetchSessionData';
import LogOutModal from '@/app/components/ui/LogOut';

// Custom Minimal SVG Icon for X (Twitter)
const XIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom Minimal SVG Icon for Vimeo
const VimeoIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.396 7.415c-.105 2.252-1.68 5.334-4.722 9.243-3.13 4.027-5.787 6.04-7.973 6.04-1.353 0-2.495-1.247-3.424-3.742-.628-2.316-1.254-4.632-1.88-6.947-.692-2.545-1.428-3.817-2.21-3.817-.168 0-.756.353-1.761 1.056l-1.056-1.353c1.092-.96 2.184-1.92 3.28-2.885 1.512-1.323 2.646-2.003 3.402-2.04 1.785-.083 2.88 1.137 3.29 3.659.46 2.852.774 4.629.94 5.33.483 2.115.987 3.172 1.513 3.172.4 0 1.02-.614 1.86-1.843.837-1.23 1.282-2.164 1.334-2.802.093-1.092-.232-1.637-.974-1.637-.348 0-.776.08-1.284.24 1.066-3.493 3.11-5.187 6.136-5.082 2.23.074 3.296 1.545 3.197 4.41z" />
  </svg>
);

// --- Styled Components (unchanged) ---
const NavButton = styled(Box)({
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '1px',
  color: '#1c1c1c',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '24px 0',
  position: 'relative',
  '&:hover': {
    color: '#000',
  },
});

const MegaMenuContainer = styled(Box)({
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '100%',
  backgroundColor: '#fff',
  borderTop: '1px solid #f0f0f0',
  borderBottom: '1px solid #f0f0f0',
  zIndex: 1000,
  boxShadow: '0px 10px 30px rgba(0,0,0,0.03)',
  animation: 'fadeInSlide 0.2s ease-out forwards',
  height: '460px',
  overflowY: 'auto',
  '@keyframes fadeInSlide': {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
});

const DropdownContainer = styled(Box)({
  position: 'absolute',
  top: '100%',
  backgroundColor: '#fff',
  minWidth: '220px',
  border: '1px solid #f0f0f0',
  zIndex: 1000,
  boxShadow: '0px 8px 24px rgba(0,0,0,0.05)',
  padding: '16px 0',
  animation: 'fadeInSlide 0.2s ease-out forwards',
  '@keyframes fadeInSlide': {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
});

const MenuHeading = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#1c1c1c',
  marginBottom: '16px',
  textTransform: 'uppercase',
});

const MenuLink = styled(Typography)({
  fontSize: '14px',
  color: '#555',
  cursor: 'pointer',
  marginBottom: '12px',
  transition: 'color 0.2s',
  '&:hover': {
    color: '#000',
  },
});

const MobileNavItemButton = styled(ListItemButton)({
  padding: '14px 24px',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

const MobileNavText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1c1c1c',
    letterSpacing: '0.5px'
  }
});

const MobileSubNavItemButton = styled(ListItemButton)({
  padding: '10px 24px 10px 44px',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

const MobileSubNavText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    color: '#333',
  }
});

const MobileNestedLinkButton = styled(ListItemButton)({
  padding: '8px 24px 8px 64px',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

// ── Static links shown when the user is NOT logged in (plain links, no mega menu) ──
const STATIC_NAV_LINKS = ['HOME', 'PRESETS', 'SHOP', 'COLLECTIONS', 'PAGES', 'BLOG', 'CONTACT'];

// ── Fallback product images per mega-menu column set (same idea as reference) ──
const FALLBACK_IMAGE_PAIRS = [
  [
    { label: 'Dare to Dream Earrings', price: '$950.00', src: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80' },
    { label: 'Brightside Earrings', price: '$75.00', src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
  ],
  [
    { label: 'Necklace Highlight', price: '$650.00', src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
    { label: 'Bracelet Highlight', price: '$420.00', src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80' },
  ],
];

export default function Header({ storeinit, logos }) {
  const [activeMenu, setActiveMenu] = useState(null); // top-level menuname currently hovered
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mobile accordion toggle state — generic, keyed by menuid / param1dataid (dynamic)
  const [openMobMenus, setOpenMobMenus] = useState({});
  const [openMobCols, setOpenMobCols] = useState({});

  const toggleMobMenu = (id) => setOpenMobMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleMobCol = (id) => setOpenMobCols((prev) => ({ ...prev, [id]: !prev[id] }));
  const companyLogo = logos?.web;
 
  const {
    islogin,
    setislogin,
    loginUserDetail,
    finalId,
    cartCountNum,
    wishCountNum,
  } = useStore();

  const [menuData, setMenuData] = useState([]);   // raw flat rows from API
  const [menuItems, setMenuItems] = useState([]);  // transformed menuid -> param1 -> param2 tree
  const [isMounted, setIsMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { push } = useNextRouterLikeRR();
  const navigate = (url) => push(url);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // ── Detect login state on mount ──
  useEffect(() => {
    const value = (typeof window !== 'undefined' && window.__LOGIN_USER__) || getSession('LoginUser');
    setislogin(value);
    setIsMounted(true);
  }, [setislogin]);

  // ── Fetch dynamic menu (cached) when logged in ──
  const getMenuApi = async () => {
    const pricingContext = getPricingContext(loginUserDetail, storeinit, islogin);
    let cacheKey = '';
    if (pricingContext) {
      const eventName = 'julian_header_menu';
      const { key } = buildMenuCacheKey(eventName, storeinit, pricingContext, finalId);
      cacheKey = key;
      try {
        const cacheRes = await readCache(key);
        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          setMenuData(cacheRes.data);
          return;
        }
      } catch (err) {
        console.error('Cache read error:', err);
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

  useEffect(() => {
    if (isMounted && islogin) {
      getMenuApi();
    } else {
      setMenuData([]);
      setMenuItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [islogin, isMounted]);

  // ── Transform flat menuData rows into menuid -> param1 -> param2 tree ──
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

  // ── Navigation logic (ported verbatim from reference's handelMenu) ──
  const handelMenu = (param, param1, param2, event, isFilterKey2Ignore) => {
    if (
      param?.menuname === 'Collection' &&
      param?.key === 'Auto' &&
      param?.value === '' &&
      Object.keys(param1 || {}).length === 0 &&
      Object.keys(param2 || {}).length === 0
    ) {
      navigate('/collection');
      return;
    }

    event?.preventDefault();

    let finalData = {
      menuname: param?.menuname ?? '',
      FilterKey: param?.key ?? '',
      FilterVal: param?.value ?? '',
      FilterKey1: isFilterKey2Ignore === 1 ? param2?.key ?? '' : param1?.key ?? '',
      FilterVal1: isFilterKey2Ignore === 1 ? param2?.value ?? '' : param1?.value ?? '',
      FilterKey2: isFilterKey2Ignore === 1 ? '' : param2?.key ?? '',
      FilterVal2: isFilterKey2Ignore === 1 ? '' : param2?.value ?? '',
    };
    sessionStorage.setItem('menuparams', JSON.stringify(finalData));

    const queryParameters1 = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join('/');

    const queryParameters = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ].join(',');

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([, value]) => value !== undefined)
      .map(([, value]) => value)
      .filter(Boolean)
      .join(',');

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

  let closeTimer;
  const handleMouseEnter = (label) => {
    clearTimeout(closeTimer);
    setActiveMenu(label);
  };
  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => setActiveMenu(null), 120);
  };
  const handleMenuMouseEnter = () => clearTimeout(closeTimer);
  const handleMenuMouseLeave = () => {
    closeTimer = setTimeout(() => setActiveMenu(null), 120);
  };

  // ── Login / logout (same pattern as reference) ──
  const handleLoginIconClick = () => {
    if (islogin) {
      setIsLogoutModalOpen(true);
    } else {
      navigate('/LoginOption');
    }
  };

  const handleLogout = () => {
    setislogin(false);
    Cookies.remove('userLoginCookie');
    Cookies.remove('LoginUser');
    sessionStorage.clear();
    clearSession();
    window.location.replace('/');
  };

  const activeIndex = menuItems.findIndex((n) => n.menuname === activeMenu);
  const activeItem = activeIndex >= 0 ? menuItems[activeIndex] : null;
  const activeImages =
    activeIndex >= 0 ? FALLBACK_IMAGE_PAIRS[activeIndex % FALLBACK_IMAGE_PAIRS.length] : [];

  return (
    <>
      <AppBar color="default" sx={{ backgroundColor: '#fff', boxShadow: 'none', borderBottom: '1px solid #f5f5f5' }}>
        <Container maxWidth="xxl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: '70px', position: 'relative' }}>

            {/* Mobile menu toggle */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, mr: 1 }}
            >
              <MenuIcon sx={{ color: '#1c1c1c', fontSize: '24px' }} />
            </IconButton>

            {/* Logo */}
            <Box
                           component="img"
                           src={companyLogo}
                           alt="Logo"
                           onClick={() => push('/')}
                           sx={{
                             height: { xs: '28px', md: '90px' },
                             width: 'auto',
                             padding: { xs: 0, md: 2 },
                             cursor: 'pointer',
                             userSelect: 'none',
                             display: 'block',
                           }}
                         />

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '32px', height: '100%', alignItems: 'center' }}>
              {isMounted && islogin ? (
                // ── LOGGED IN: dynamic menu items from API, mega menu on hover ──
                menuItems?.map((item, index) => {
                  const isActive = activeMenu === item.menuname;
                  const hasColumns = item?.param1?.length > 0;
                  return (
                    <Box
                      key={item.menuid ?? index}
                      onMouseEnter={() => hasColumns && handleMouseEnter(item.menuname)}
                      onMouseLeave={handleMouseLeave}
                      sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
                    >
                      <NavButton onClick={(e) => handleTopLevelClick(item, e)}>
                        {item.menuname}
                        {hasColumns && (
                          isActive
                            ? <ArrowUpIcon sx={{ fontSize: 16, ml: 0.5 }} />
                            : <ArrowDownIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        )}
                      </NavButton>

                      {hasColumns && isActive && (
                        <MegaMenuContainer
                          onMouseEnter={handleMenuMouseEnter}
                          onMouseLeave={handleMenuMouseLeave}
                          sx={{ width: '100%', left: 0, right: 0 }}
                        >
                          <Container maxWidth="xl" sx={{ py: 6, px: { xs: 4, md: 6 } }}>
                            <Grid container spacing={8} sx={{ justifyContent: 'space-between' }}>
                              {item.param1.map((col, ci) => {
                                const visibleLinks = (col.param2 || []).filter(
                                  (p2) => p2?.param2dataname && p2.param2dataname.trim() !== ''
                                );
                                return (
                                  <Grid
                                    item
                                    xs={2}
                                    key={col.param1dataid ?? ci}
                                    sx={ci > 0 ? { borderLeft: '1px solid #e5e5e5', pl: 6 } : {}}
                                  >
                                    <MenuHeading onClick={(e) => handleColumnClick(item, col, e)}>
                                      {col.param1dataname}
                                    </MenuHeading>
                                    <Box sx={{ display: 'flex', flexDirection: 'column'  }}>
                                      {visibleLinks.map((param2Item, li) => (
                                        <MenuLink
                                          key={param2Item.param2dataid ?? li}
                                          onClick={(e) => handleLeafLinkClick(item, col, param2Item, e)}
                                        >
                                          {param2Item.param2dataname}
                                        </MenuLink>
                                      ))}
                                    </Box>
                                  </Grid>
                                );
                              })}

                              {/* Product image cards (fallback visuals, same as reference) */}
                              <Grid item xs={3}>
                                <Box sx={{ width: '100%', backgroundColor: '#f9f6f4', pt: '110%', position: 'relative', overflow: 'hidden' }}>
                                  <img
                                    src={activeImages[0]?.src}
                                    alt={activeImages[0]?.label}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </Box>
                                <Typography sx={{ fontSize: '15px', fontFamily: '"Playfair Display", serif', fontWeight: 500, mt: 2, color: '#1c1c1c' }}>
                                  {activeImages[0]?.label}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#555', mt: 0.5 }}>
                                  {activeImages[0]?.price}
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Box sx={{ width: '100%', backgroundColor: '#f9f6f4', pt: '110%', position: 'relative', overflow: 'hidden' }}>
                                  <img
                                    src={activeImages[1]?.src}
                                    alt={activeImages[1]?.label}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </Box>
                                <Typography sx={{ fontSize: '15px', fontFamily: '"Playfair Display", serif', fontWeight: 500, mt: 2, color: '#1c1c1c' }}>
                                  {activeImages[1]?.label}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#555', mt: 0.5 }}>
                                  {activeImages[1]?.price}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Container>
                        </MegaMenuContainer>
                      )}
                    </Box>
                  );
                })
              ) : (
                // ── LOGGED OUT: static plain links, no mega menu ──
                STATIC_NAV_LINKS.map((label) => (
                  <NavButton key={label}>
                    {label}
                  </NavButton>
                ))
              )}
            </Box>

            {/* Action Utilities Right Side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isMounted && islogin ? (
                <>
                  {/* Wishlist */}
                  <Tooltip title="Wishlist">
                    <IconButton color="inherit" onClick={() => navigate('/myWishList')}>
                      <Badge badgeContent={wishCountNum} max={1000} overlap="rectangular" color="secondary">
                        <WishlistIcon sx={{ color: '#1c1c1c', fontSize: '22px' }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Cart */}
                  <Tooltip title="Cart">
                    <IconButton color="inherit" onClick={() => navigate('/cartPage')}>
                      <Badge badgeContent={cartCountNum} max={1000} overlap="rectangular" color="secondary">
                        <MallIcon sx={{ color: '#1c1c1c', fontSize: '22px' }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Profile */}
                  <Tooltip title="Account">
                    <IconButton
                      color="inherit"
                      onClick={() => navigate('/account')}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                      <PersonIcon sx={{ color: '#1c1c1c', fontSize: '22px' }} />
                    </IconButton>
                  </Tooltip>

                  {/* Logout */}
                  <Tooltip title="Log out">
                    <IconButton
                      color="inherit"
                      onClick={handleLoginIconClick}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                      <LogoutIcon sx={{ color: '#1c1c1c', fontSize: '22px' }} />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                // Logged out: only login icon
                <Tooltip title="Log in">
                  <IconButton
                    color="inherit"
                    onClick={handleLoginIconClick}
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    <PersonIcon sx={{ color: '#1c1c1c', fontSize: '22px' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* --- MOBILE DRAWER (unchanged visually; login-aware bottom button) --- */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '380px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '20px 24px', borderBottom: '1px solid #f9f9f9' }}>
                        <Box
                           component="img"
                           src={companyLogo}
                           alt="Logo"
                           onClick={() => push('/')}
                           sx={{
                             height: { xs: '28px', md: '90px' },
                             width: 'auto',
                             padding: { xs: 0, md: 2 },
                             cursor: 'pointer',
                             userSelect: 'none',
                             display: 'block',
                           }}
                         />
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#1c1c1c', p: 0 }}>
              <CloseIcon sx={{ fontSize: '22px' }} />
            </IconButton>
          </Box>

          <List disablePadding sx={{ mt: 1 }}>
            {isMounted && islogin ? (
              // ── LOGGED IN: dynamic menuItems accordion ──
              menuItems?.map((item) => {
                const hasColumns = item?.param1?.length > 0;
                return (
                  <ListItem
                    key={item.menuid}
                    disablePadding
                    sx={{ flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <MobileNavItemButton
                      onClick={(e) => {
                        if (hasColumns) {
                          toggleMobMenu(item.menuid);
                        } else {
                          handleTopLevelClick(item, e);
                          handleDrawerToggle();
                        }
                      }}
                    >
                      <MobileNavText primary={item.menuname} />
                      {hasColumns && (
                        openMobMenus[item.menuid]
                          ? <RemoveIcon sx={{ fontSize: 16, color: '#1c1c1c' }} />
                          : <AddIcon sx={{ fontSize: 16, color: '#1c1c1c' }} />
                      )}
                    </MobileNavItemButton>

                    {hasColumns && (
                      <Collapse in={!!openMobMenus[item.menuid]} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          {item.param1.map((col) => {
                            const visibleLinks = (col.param2 || []).filter(
                              (p2) => p2?.param2dataname && p2.param2dataname.trim() !== ''
                            );
                            return (
                              <ListItem
                                key={col.param1dataid}
                                disablePadding
                                sx={{ flexDirection: 'column', alignItems: 'stretch' }}
                              >
                                <MobileSubNavItemButton onClick={() => toggleMobCol(col.param1dataid)}>
                                  <MobileSubNavText primary={col.param1dataname} />
                                  {openMobCols[col.param1dataid]
                                    ? <RemoveIcon sx={{ fontSize: 14, color: '#555' }} />
                                    : <AddIcon sx={{ fontSize: 14, color: '#555' }} />}
                                </MobileSubNavItemButton>
                                <Collapse in={!!openMobCols[col.param1dataid]} timeout="auto" unmountOnExit>
                                  <List disablePadding>
                                    {visibleLinks.map((param2Item) => (
                                      <MobileNestedLinkButton
                                        key={param2Item.param2dataid}
                                        onClick={(e) => {
                                          handleLeafLinkClick(item, col, param2Item, e);
                                          handleDrawerToggle();
                                        }}
                                      >
                                        <ListItemText
                                          primary={param2Item.param2dataname}
                                          primaryTypographyProps={{ fontSize: '13px', color: '#666' }}
                                        />
                                      </MobileNestedLinkButton>
                                    ))}
                                  </List>
                                </Collapse>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </ListItem>
                );
              })
            ) : (
              // ── LOGGED OUT: static plain links, no accordion ──
              STATIC_NAV_LINKS.map((label) => (
                <ListItem disablePadding key={label}>
                  <MobileNavItemButton onClick={handleDrawerToggle}>
                    <MobileNavText primary={label} />
                  </MobileNavItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>

        <Box sx={{ p: '24px' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleDrawerToggle();
              handleLoginIconClick();
            }}
            sx={{
              backgroundColor: '#1c1c1c',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '1px',
              borderRadius: 0,
              py: 2,
              mb: 3,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#000',
                boxShadow: 'none'
              }
            }}
          >
            {islogin ? 'LOG OUT' : 'LOG IN'}
          </Button>

          <Box sx={{ display: 'flex', gap: '22px', alignItems: 'center', color: '#1c1c1c', px: 0.5 }}>
            <Box sx={{ cursor: 'pointer', display: 'flex', '&:hover': { color: '#666' } }}><XIcon /></Box>
            <Box sx={{ cursor: 'pointer', display: 'flex', '&:hover': { color: '#666' } }}><Facebook sx={{ fontSize: 20 }} /></Box>
            <Box sx={{ cursor: 'pointer', display: 'flex', '&:hover': { color: '#666' } }}><Instagram sx={{ fontSize: 20 }} /></Box>
            <Box sx={{ cursor: 'pointer', display: 'flex', '&:hover': { color: '#666' } }}><VimeoIcon /></Box>
            <Box sx={{ cursor: 'pointer', display: 'flex', '&:hover': { color: '#666' } }}><YouTube sx={{ fontSize: 20 }} /></Box>
          </Box>
        </Box>
      </Drawer>

      <LogOutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <Box sx={{ height: '70px' }} />
    </>
  );
}