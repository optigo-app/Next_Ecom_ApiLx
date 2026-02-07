"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Header.modul.scss";
import { Badge, ButtonBase, List, ListItem, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import CartDrawer from "@/app/theme/fgstore.web/cart/CartPageB2c/Cart";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";


const buildAlbumCacheKey = ( type ,storeData, pricing, id) => {
  const meta = {
  type,
  PackageId: pricing?.PackageId ?? "",
  Laboursetid: pricing?.Laboursetid ?? "",
  diamondpricelistname: pricing?.diamondpricelistname ?? "",
  colorstonepricelistname: pricing?.colorstonepricelistname ?? "",
};

const key = [
    type,
    pricing?.PackageId,
    pricing?.Laboursetid,
    pricing?.diamondpricelistname,
    pricing?.colorstonepricelistname,
  ].join("_");

  return {
    key,
    meta,
  }
};

const Header = ({ storeinit, logos }) => {
  const { islogin, setislogin, cartCountNum, setCartCountNum, wishCountNum, setWishCountNum, setCartOpenStateB2C } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isHeaderFixedDropShow, setIsHeaderFixedDropShow] = useState(false);
  const compnyLogo = logos?.web;
  const compnyLogoM = logos?.mobile;
  const [menuData, setMenuData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const setCartOpenState = setCartOpenStateB2C;
  const [searchText, setSearchText] = useState("");
  const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;
  const IsCartNo = storeinit?.CartNo;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loginUserDetail, setLoginUserDetail] = useState({});


    useEffect(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        try {
          const stored = sessionStorage.getItem("loginUserDetail");
          setLoginUserDetail(stored ? JSON.parse(stored) : null);
        } catch (err) {
          console.error("Failed to parse loginUserDetail:", err);
          setLoginUserDetail(null);
        }
      }
    }, []);

  // const IsCartNo = 2;
  const [serachsShowOverlay, setSerachShowOverlay] = useState(false);

  const navigation = useNextRouterLikeRR();

  const navigate = (link) => {
    navigation.push(link);
  };

  
    useEffect(() => {
    const value = JSON.parse(sessionStorage.getItem('LoginUser'));
    setislogin(value);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const visiterID = Cookies.get("visiterId");
    GetCountAPI(visiterID)
      .then((res) => {
        if (res) {
          setCartCountNum(res?.cartcount);
          setWishCountNum(res?.wishcount);
        }
      })
      .catch((err) => {
        if (err) {
          console.log("getCountApiErr", err);
        }
      });
  }, []);

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
          }));
        return {
          menuname: param1Item?.menuname,
          param1dataid: param1Item?.param1dataid,
          param1dataname: param1Item?.param1dataname,
          param1id: param1Item?.param1id,
          param1name: param1Item?.param1name,
          param2: param2Items,
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
      };
    });

    // setMenuItems(uniqueMenuItems);

    // Add "Search by Stock" as a separate menu
    const searchByStockMenu = {
      menuid: "search-by-stock",
      menuname: "Search by Stock",
      param0dataid: null,
      param0dataname: null,
      param0id: null,
      param0name: null,
      param1: [
        {
          param1dataid: null,
          param1dataname: null,
          param1id: null,
          param1name: null,
          menuname: "Search by Stock",
          param2: [],
        },
      ],
    };
    // Append static menu to dynamic ones
    const finalMenuItems = [...uniqueMenuItems, searchByStockMenu];

    setMenuItems(finalMenuItems);
  }, [menuData]);

  useEffect(() => {
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    if (storeinit?.IsB2BWebsite === 0 || (storeinit?.IsB2BWebsite === 1 && isUserLogin === true)) {
      getMenuApi();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderFixed(scrollPosition > 100);
      setIsHeaderFixedDropShow(scrollPosition > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchData = () => {
    const value = JSON.parse(sessionStorage.getItem("LoginUser"));
    setislogin(value);
  };

     const pricingContext = useMemo(() => {
      if (!isMounted) return null;
      const loginInfo = loginUserDetail;
      return {
      PackageId: (loginInfo?.PackageId ?? storeinit?.PackageId) ?? "",
      Laboursetid:
           !islogin 
          ? storeinit?.pricemanagement_laboursetid
          : loginInfo?.pricemanagement_laboursetid ?? "",
      diamondpricelistname:
           !islogin 
          ? storeinit?.diamondpricelistname
          : loginInfo?.diamondpricelistname ?? "",
      colorstonepricelistname:
           !islogin 
          ? storeinit?.colorstonepricelistname
          : loginInfo?.colorstonepricelistname ?? "",
    };
    }, [isMounted, loginUserDetail, storeinit, islogin]);
     console.log("🚀 ~ Header ~ pricingContext:", pricingContext)
    
    

  const getMenuApi = async () => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const { IsB2BWebsite } = storeInit;
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }
    const id = finalID;
    const {key ,meta} = buildAlbumCacheKey("header_menu_" ,storeinit, pricingContext, id);
    const cachedRes = await fetch(`/api/cache?key=${key}`);
      const cached = await cachedRes.json();
      if (cached.cached && Array.isArray(cached.data)) {
           setMenuData(cached?.data);
        return cached?.data;
      }
    await GetMenuAPI(finalID)
      .then((response) => {
         fetch("/api/cache", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, data: response?.Data?.rd ,meta }),
        }).catch(console.error);
        setMenuData(response?.Data?.rd);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    setislogin(false);
    Cookies.remove("userLoginCookie");
    Cookies.remove("userLoginCookie");
    Cookies.remove('LoginUser')
    window.location.reload();
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
    window.location.href = "/"
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const divRef = useRef(null);

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    if (divRef.current) {
      divRef.current.scrollTo(0, 0);
    }
  };

  const toggleOverlay = () => {
    // setSearchText('');
    setSerachShowOverlay(!serachsShowOverlay);
  };

  const [drawerShowOverlay, setDrawerShowOverlay] = useState(false);
  const toggleDrawerOverlay = () => {
    setDrawerShowOverlay(!drawerShowOverlay);
  };

  const handelMenu = (param, param1, param2, event) => {
    if (
      event?.ctrlKey || // Ctrl key
      event?.shiftKey || // Shift key
      event?.metaKey || // Meta key (Command key on macOS)
      (event?.button && event?.button === 1) // Middle mouse button
    ) {
      // Let the default behavior of the <a> tag handle the new tab opening
      return;
    } else {
      event?.preventDefault();
      setDrawerShowOverlay(false);
      let finalData = {
        menuname: param?.menuname ?? "",
        FilterKey: param?.key ?? "",
        FilterVal: param?.value ?? "",
        FilterKey1: param1?.key ?? "",
        FilterVal1: param1?.value ?? "",
        FilterKey2: param2?.key ?? "",
        FilterVal2: param2?.value ?? "",
      };
      sessionStorage.setItem("menuparams", JSON.stringify(finalData));

      const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`].filter(Boolean).join("/");

      const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`, finalData?.FilterKey1 && `${finalData.FilterVal1}`, finalData?.FilterKey2 && `${finalData.FilterVal2}`]
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

      const paginationParam = [`page=${finalData.page ?? 1}`, `size=${finalData.size ?? 50}`].join("&");

      let menuEncoded = `${queryParameters}/${otherparamUrl}`;
      // const url = `/productlist?V=${queryParameters}/K=${otherparamUrl}`;
      const url = param?.menuname === "Search by Stock" ? "/searchbystock" : `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

      // let d = new Date();
      // let randomno = Math.floor(Math.random() * 1000 * d.getMilliseconds() * d.getSeconds() * d.getDate() * d.getHours() * d.getMinutes())
      handleDropdownClose();
      navigate(url);
    }
  };

  //mobileMenu.................
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = async (
    menuItem,
    param1Item = null,
    param2Item = null
  ) => {
    const { param1, param2, ...cleanedMenuItem } = menuItem;
    let menuDataObj = { ...cleanedMenuItem };

    if (param1Item) {
      const { param1, param2, ...cleanedParam1Item } = param1Item;
      menuDataObj = { ...menuDataObj, ...cleanedParam1Item };
      if (param2Item) {
        menuDataObj = { ...menuDataObj, ...param2Item };
      }
    } else {
      // console.log("Menu Item:", cleanedMenuItem);
    }
    let finalData = {
      menuname: menuDataObj?.menuname ?? "",
      FilterKey: menuDataObj.param0name ?? "",
      FilterVal: menuDataObj.param0dataname ?? "",
      FilterKey1: menuDataObj?.param1name ?? "",
      FilterVal1: menuDataObj?.param1dataname ?? "",
      FilterKey2: menuDataObj?.param2name ?? "",
      FilterVal2: menuDataObj?.param2dataname ?? "",
    };
    navigate(`/productpage`, {
      state: { menuFlag: finalData?.menuname, filtervalue: finalData },
    });
    sessionStorage.setItem("menuparams", JSON.stringify(finalData));
  };

  const handleLoginMenuClick = (menuName, menuItem, iconclicked) => {
    if (iconclicked == "iconclicked") {
      setSelectedMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
      return;
    }
    const { param1, ...menuItemWithoutParam1 } = menuItem;
    handleMenuClick(menuItemWithoutParam1);
  };

  const searchDataFucn = (e) => {
    if (e.key === "Enter") {
      if (searchText) {
        let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
        let storeInit = storeinit;
        let obj = {
          a: "",
          b: searchText,
          m: loginInfo?.MetalId ?? storeInit?.MetalId,
          d: loginInfo?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
          c: loginInfo?.cmboCSQCid ?? storeInit?.cmboCSQCid,
          f: {},
        };

        let encodeObj = btoa(JSON.stringify(obj));
        router.push(`/p/${searchText}?S=${encodeObj}`);
        toggleOverlay();
        setSearchText("");
        setSerachShowOverlay(false);
        setDrawerShowOverlay(false);
      }
    }
  };

  const clickSearch = () => {
    if (searchText) {
      let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
      let storeInit = storeinit;
      let obj = {
        a: "",
        b: searchText,
        m: loginInfo?.MetalId ?? storeInit?.MetalId,
        d: loginInfo?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
        c: loginInfo?.cmboCSQCid ?? storeInit?.cmboCSQCid,
        f: {},
      };

      let encodeObj = btoa(JSON.stringify(obj));
      setDrawerShowOverlay(false);
      router.push(`/p/${searchText}?S=${encodeObj}`);
      setSearchText("");
      setSerachShowOverlay(false);
    }
  };

  const toggleCartDrawer = () => {
    setIsCartOpen((prevState) => !prevState);
    const isCartDrawerOpen = JSON.parse(sessionStorage.getItem("isCartDrawer"));
    sessionStorage.setItem("isCartDrawer", !isCartDrawerOpen);
    setCartOpenState((prevState) => !prevState);
  };


  return (
    <>
      <div
        className="smr_headerMain_div"
      >
        {serachsShowOverlay && (
          <>
            <div className="smr_smlingSearchoverlay">
              <div className="smr_smlingTopSerachOver">
                <Search onClick={() => clickSearch()} style={{ height: "15px", width: "15px", marginRight: "10px" }} />
                <input type="text" placeholder="Search..." value={searchText} autoFocus onChange={(e) => setSearchText(e.target.value)} className="smr_serachinputBoxOverly" onKeyDown={searchDataFucn} />
                <IoClose
                  style={{
                    height: "30px",
                    width: "30px",
                    color: "#7d7f85",
                    cursor: "pointer",
                  }}
                  onClick={toggleOverlay}
                />
              </div>
            </div>

            <div className={`smr_smlingSearchoverlayNew ${isHeaderFixedDropShow ? "fixed" : ""}`}>
              <div className="smr_smlingTopSerachOver-Fixed">
                <Search style={{ height: "15px", width: "15px", marginRight: "10px" }} />
                <input type="text" placeholder="Search..." value={searchText} autoFocus onChange={(e) => setSearchText(e.target.value)} className="smr_serachinputBoxOverly" onKeyDown={searchDataFucn} />
                <IoClose
                  style={{
                    height: "30px",
                    width: "30px",
                    color: "#7d7f85",
                    cursor: "pointer",
                  }}
                  onClick={toggleOverlay}
                />
              </div>
            </div>
          </>
        )}

        {drawerShowOverlay && (
          <>
            <div className="srm_MobileSiderBarMain">
              <div
                style={{
                  margin: "20px 10px 0px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="smr_mobileHeader_top_div1">
                  <IoClose
                    style={{
                      height: "30px",
                      width: "30px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={toggleDrawerOverlay}
                  />
                </div>
                <div className="smr_mobileHeader_top_div2_web" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                  <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                    <img src={compnyLogo} loading="lazy" alt="Company Logo" className="smr_logo_header" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                  </Link>
                </div>

                <div className="smr_mobileHeader_top_div2_mobile" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                  <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                    <img src={compnyLogoM} loading="lazy" alt="Company Logo" className="smr_logo_header" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                  </Link>
                </div>

                <div className="smr_mobileHeader_top_div3">
                  {islogin && (
                    <>
                      <Badge badgeContent={cartCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColorFix" style={{ marginInline: "15px" }}>
                        <Tooltip title="Cart">
                          {IsCartNo == 2 ? (
                            <div className="nav_li_smining_Icone" onClick={toggleCartDrawer} style={{ cursor: "pointer" }}>
                              <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                            </div>
                          ) : (
                            <Link href="/cartPage" className="nav_li_smining_Icone">
                              <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                            </Link>
                          )}
                        </Tooltip>
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="smr_mobileMenuSubDivMain">
                {isMounted && islogin && (
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid white",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchText}
                      style={{
                        width: "100%",
                        borderBottom: "1px solid white",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                        fontWeight: 500,
                        color: "white",
                        fontSize: "17px",
                        padding: "8px",
                      }}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="mobileSideBarSearch"
                      onKeyDown={searchDataFucn}
                    />
                    <Search
                      onClick={() => clickSearch()}
                      style={{
                        color: "white",
                        height: "25px",
                        cursor: "pointer",
                        width: "25px",
                        marginInline: "5px",
                        marginBottom: "4px",
                      }}
                    />
                  </div>
                )}
                <List className="smr_ListMenuSiderMobile" sx={{ paddingTop: "0", marginBottom: "0px", marginTop: "15px" }}>
                  {menuItems.map((menuItem) => (
                    <div key={menuItem.menuid}>
                      <ButtonBase component="div" className="muilistMenutext" onClick={() => handleLoginMenuClick(menuItem.menuname, null, "iconclicked")} style={{ width: "100%" }}>
                        <ListItem
                          style={{
                            padding: "5px",
                            borderBottom: "1px solid white",
                          }}
                        >
                          <p className="smr_menuStaicMobile">{menuItem.menuname}</p>
                        </ListItem>
                      </ButtonBase>
                      {selectedMenu === menuItem.menuname && (
                        <>
                          <ButtonBase
                            component="div"
                            onClick={() =>
                              handelMenu({
                                menuname: menuItem?.menuname,
                                key: menuItem?.param0name,
                                value: menuItem?.param0dataname,
                              })
                            }
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "start",
                            }}
                          >
                            <div
                              style={{
                                paddingLeft: "10px",
                                fontSize: "15px",
                                marginTop: "5px",
                              }}
                            >
                              <button className="smr_mobile_viewAllBtn">View All</button>
                            </div>
                          </ButtonBase>
                          <List className="smr_mobileMenuScroll">
                            {menuItem.param1.map((subMenuItem) => (
                              <div key={subMenuItem.param1dataid}>
                                <ButtonBase
                                  component="div"
                                  onClick={() =>
                                    handelMenu(
                                      {
                                        menuname: menuItem?.menuname,
                                        key: menuItem?.param0name,
                                        value: menuItem?.param0dataname,
                                      },
                                      {
                                        key: subMenuItem.param1name,
                                        value: subMenuItem?.param1dataname,
                                      }
                                    )
                                  }
                                  style={{ width: "100%" }}
                                >
                                  <p
                                    style={{
                                      margin: "0px 0px 0px 15px",
                                      width: "100%",
                                      fontWeight: "600",
                                      color: "white",
                                    }}
                                  >
                                    {subMenuItem?.param1dataname}
                                  </p>
                                </ButtonBase>
                                {selectedMenu === menuItem.menuname && (
                                  <>
                                    <List
                                      style={{
                                        paddingTop: "0px",
                                        paddingBottom: "0px",
                                      }}
                                    >
                                      {subMenuItem.param2.map((subSubMenuItem) => (
                                        <ButtonBase
                                          component="div"
                                          onClick={() =>
                                            handelMenu(
                                              {
                                                menuname: menuItem?.menuname,
                                                key: menuItem?.param0name,
                                                value: menuItem?.param0dataname,
                                              },
                                              {
                                                key: subMenuItem.param1name,
                                                value: subMenuItem.param1dataname,
                                              },
                                              {
                                                key: subSubMenuItem.param2name,
                                                value: subSubMenuItem.param2dataname,
                                              }
                                            )
                                          }
                                          style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "start",
                                          }}
                                        >
                                          <p className="smr_mobile_subMenu">{subSubMenuItem.param2dataname}</p>
                                        </ButtonBase>
                                      ))}
                                    </List>
                                  </>
                                )}
                              </div>
                            ))}
                          </List>
                        </>
                      )}
                    </div>
                  ))}
                </List>
              </div>
              <div>
                <Link
                  href="/aboutUs"
                  className="smr_menuStaicMobilePage"
                  onClick={() => {
                    setDrawerShowOverlay(false);
                    navigate("/aboutUs");
                  }}
                >
                  About us
                </Link>
              </div>
              {islogin && (
                <div>
                  <Link
                    href="/myWishList"
                    className="smr_menuStaicMobilePageLink"
                    onClick={() => {
                      setDrawerShowOverlay(false);
                      navigate("/myWishList");
                    }}
                  >
                    WishList
                  </Link>
                </div>
              )}

              {IsB2BWebsiteChek == 1 ? (
                islogin ? (
                  <>
                    {storeinit?.IsDesignSetInMenu == 1 && (
                      <Link
                        href="/Lookbook"
                        className="smr_menuStaicMobilePageLink"
                        onClick={() => {
                          setDrawerShowOverlay(false);
                          navigate("/Lookbook");
                        }}
                      >
                        {storeinit?.DesignSetInMenu}
                        {/* LOOKBOOK */}
                      </Link>
                    )}
                  </>
                ) : (
                  ""
                )
              ) : (
                <>
                  {storeinit?.IsDesignSetInMenu == 1 && (
                    <Link
                      href="/Lookbook"
                      className="smr_menuStaicMobilePageLink"
                      onClick={() => {
                        setDrawerShowOverlay(false);
                        navigate("/Lookbook");
                      }}
                    >
                      {storeinit?.DesignSetInMenu}
                      {/* LOOKBOOK */}
                    </Link>
                  )}
                </>
              )}

              {isMounted && islogin && (
                <div>
                  <Link
                    href="/account"
                    className="smr_menuStaicMobilePageLink"
                    onClick={() => {
                      setDrawerShowOverlay(false);
                      navigate("/account");
                    }}
                  >
                    Account
                  </Link>
                </div>
              )}

              {isMounted && islogin && (
                <div>
                  <Link href="/" className="smr_menuStaicMobilePageLink" style={{ cursor: "pointer" }}>
                    <span onClick={() => {
                      setDrawerShowOverlay(false);
                      handleLogout();
                    }}
                    >
                      LOG OUT
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        <div className="smiling_Top_header">
          <div className="smiling_Top_header_sub">
            <div className="smiling_Top_header_div1">
              {/* Here is Navbar Shop Menu  */}
              <ul className="nav_ul_shop">
                {IsB2BWebsiteChek === 1 ? (
                  islogin === true ? (
                    <>
                      {storeinit?.IsDesignSetInMenu == 1 && (
                        <li>
                          <Link href="/Lookbook" className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }}
                          >
                            {storeinit?.DesignSetInMenu}
                          </Link>
                        </li>
                      )}
                    </>
                  ) : (
                    ""
                  )
                ) : (
                  <>
                    {storeinit?.IsDesignSetInMenu == 1 && (
                      <li>
                        <Link href="/Lookbook" className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }} >
                          {storeinit?.DesignSetInMenu}
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
              <ul className="nav_ul_shop_menu_Mobile">
                <li>
                  <MenuIcon style={{ fontSize: "35px" }} className="muIconeMobileHeader" onClick={toggleDrawerOverlay} />
                </li>
              </ul>
            </div>
            <div className="smiling_Top_header_div2_web" draggable={false} onContextMenu={(e) => e.preventDefault()}>
              <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                <img src={compnyLogo} loading="lazy" alt="Company Logo" className="smr_logo_header" draggable={false} onContextMenu={(e) => e.preventDefault()} />
              </Link>
            </div>
            <div className="smiling_Top_header_div2_Mobile" draggable={false} onContextMenu={(e) => e.preventDefault()}>
              <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                <img src={compnyLogoM} loading="lazy" alt="Company Logo" className="smr_logo_header" draggable={false} onContextMenu={(e) => e.preventDefault()} />
              </Link>
            </div>
            <div className="smiling_Top_header_div3">
              <ul className="nav_ul_shop">
                <li>
                  <Link href="/aboutUs" className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }} >
                    ABOUT US
                  </Link>
                </li>
                {IsB2BWebsiteChek == 0 ? (
                  storeinit?.IsPLW ? (
                    ""
                  ) : (
                    <>
                      {isMounted && islogin && (
                        <li>
                          <Link href="/account" className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }} >
                            ACCOUNT
                          </Link>
                        </li>
                      )}
                    </>
                  )
                ) : islogin && storeinit?.IsPLW ? (
                  ""
                ) : (
                  <>
                    {isMounted && islogin === true && (
                      <li>
                        <Link href={"/account"} className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }}>
                          ACCOUNT
                        </Link>
                      </li>
                    )}
                  </>
                )}
                {isMounted && islogin ? (
                  <li>
                    <Link href="/" className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }}>
                      <span onClick={handleLogout}>
                        LOG OUT
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href={"/LoginOption"} className="nav_li_smining" style={{ cursor: "pointer" }} >
                      <span onClick={() => navigate("/LoginOption")}>
                        LOG IN
                      </span>
                    </Link>
                  </li>
                )}

                {IsB2BWebsiteChek == 0 ? (
                  <>
                    <li>
                      <Badge badgeContent={wishCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColorFix smr_mobileHideIcone">
                        <Tooltip title="WishList">
                          <Link href="/myWishList" className="nav_li_smining_Icone">
                            <StarBorderRoundedIcon
                              style={{
                                height: "20px",
                                cursor: "pointer",
                                width: "20px",
                              }}
                            />
                          </Link>
                        </Tooltip>
                      </Badge>
                    </li>
                    <li className="nav_li_smining_Icone smr_mobileHideIcone" onClick={toggleOverlay} >
                    <Search 
                        style={{
                          height: "20px",
                          cursor: "pointer",
                          width: "20px",
                        }}
                      />
                    </li>
                    <li>
                      <Badge badgeContent={cartCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColorFix">
                        <Tooltip title="Cart">
                          {IsCartNo == 2 ? (
                            <div className="nav_li_smining_Icone" onClick={toggleCartDrawer} style={{ cursor: "pointer" }}>
                              <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                            </div>
                          ) : (
                            <Link href="/cartPage" className="nav_li_smining_Icone">
                              <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                            </Link>
                          )}
                        </Tooltip>
                      </Badge>
                    </li>
                  </>
                ) : (
                  isMounted && islogin && (
                    <>
                      <li>
                        <Badge badgeContent={wishCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColorFix smr_mobileHideIcone">
                          <Tooltip title="WishList">
                            <li className="nav_li_smining_Icone" onClick={() => navigate("/myWishList")}>
                              <StarBorderRoundedIcon
                                style={{
                                  height: "20px",
                                  cursor: "pointer",
                                  width: "20px",
                                }}
                              />
                            </li>
                          </Tooltip>
                        </Badge>
                      </li>
                      <li className="nav_li_smining_Icone smr_mobileHideIcone" onClick={toggleOverlay} >
                        <Search
                          style={{
                            height: "20px",
                            cursor: "pointer",
                            width: "20px",
                          }}
                        />
                      </li>
                      <li>
                        <Badge badgeContent={cartCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColorFix">
                          <Tooltip title="Cart">
                            {IsCartNo == 2 ? (
                              <div className="nav_li_smining_Icone" onClick={toggleCartDrawer} style={{ cursor: "pointer" }}>
                                <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                              </div>
                            ) : (
                              <Link href="/cartPage" className="nav_li_smining_Icone">
                                <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                              </Link>
                            )}
                          </Tooltip>
                        </Badge>
                      </li>
                    </>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className={`Smining-Top-Header-fixed-main ${isHeaderFixed ? "fixed" : ""}  ${serachsShowOverlay ? "searchoverly" : ""}`}>
            <div className="smiling_Top_header_sub" style={{ width: "100%" }}>
              <div className="smiling_Top_header_div1">
                <ul className="nav_ul_shop">
                  {IsB2BWebsiteChek === 1 ? (
                    isMounted && islogin === true ? (
                      <>
                        {storeinit?.IsDesignSetInMenu == 1 && (
                          <li className="nav_li_smining_Fixed nav_li_smining_Mobile" style={{ cursor: "pointer" }}>
                            <Link href="/Lookbook" className="smr_A_linkFixed">
                              {storeinit?.DesignSetInMenu}
                              {/* LOOKBOOK */}
                            </Link>
                          </li>
                        )}
                      </>
                    ) : (
                      ""
                    )
                  ) : (
                    <>
                      {storeinit?.IsDesignSetInMenu == 1 && (
                        <li className="nav_li_smining_Fixed nav_li_smining_Mobile" style={{ cursor: "pointer" }} >
                          <Link href="/Lookbook" className="smr_A_linkFixed">
                            {storeinit?.DesignSetInMenu}
                            {/* LOOKBOOK */}
                          </Link>
                        </li>
                      )}
                    </>
                  )}

                  <ul className="nav_ul_shop_menu_Mobile">
                    <MenuIcon style={{ fontSize: "35px" }} className="muIconeMobileHeader" onClick={toggleDrawerOverlay} />
                  </ul>
                  {/* } */}
                </ul>
              </div>
              <div className="smiling_Top_header_div2_web" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                  <img src={compnyLogo} loading="lazy" alt="Company Logo" className="smr_logo_header_Fixed" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                </Link>
              </div>

              <div className="smiling_Top_header_div2_Mobile" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                  <img src={compnyLogoM} loading="lazy" alt="Company Logo" className="smr_logo_header_Fixed" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                </Link>
              </div>
              <div className="smiling_Top_header_div3">
                <ul className="nav_ul_shop">
                  <li className="nav_li_smining_Fixed nav_li_smining_Mobile" style={{ cursor: "pointer" }}>
                    <Link href="/aboutUs" className="smr_A_linkFixed">
                      ABOUT US
                    </Link>
                  </li>

                  {storeinit?.IsPLW == 0 && IsB2BWebsiteChek == 0 ? (
                    <>
                      {isMounted && islogin === true && (
                        <li>
                          <Link
                            href="/account"
                            className="nav_li_smining_Fixed nav_li_smining_Mobile"
                            style={{ cursor: "pointer" }}
                            // onClick={() => navigate("/LoginOption")}
                            onClick={() => navigate("/account")}
                          >
                            {/* <a href="/account" className="smr_A_linkFixed"> */}
                            ACCOUNT
                            {/* </a> */}
                          </Link>
                        </li>
                      )}
                    </>
                  ) : (
                    isMounted && islogin && (
                      <li>
                        <Link
                          href="/account"
                          className="nav_li_smining_Fixed nav_li_smining_Mobile"
                          style={{ cursor: "pointer" }}
                          // onClick={() => navigate("/LoginOption")}
                          onClick={() => navigate("/account")}
                        >
                          {/* <a href="/account" className="smr_A_linkFixed"> */}
                          ACCOUNT
                          {/* </a> */}
                        </Link>
                      </li>
                    )
                  )}

                  {isMounted && islogin ? (
                    <li>
                      <Link href="/" className="nav_li_smining nav_li_smining_Mobile" style={{ cursor: "pointer" }}>
                        <span onClick={handleLogout}>LOG OUT</span>
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link href={"/LoginOption"} className="nav_li_smining_Fixed" style={{ cursor: "pointer" }} onClick={() => navigate("/LoginOption")}>
                        LOG IN
                      </Link>
                    </li>
                  )}

                  {IsB2BWebsiteChek == 0 ? (
                    <>
                      <li>
                        <Badge badgeContent={wishCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColor smr_mobileHideIcone">
                          <Tooltip title="WishList">
                            <li>
                              <Link href="/myWishList" className="nav_li_smining_Fixed_Icone smr_mobileHideIcone">
                                <Star
                                  style={{
                                    height: "20px",
                                    cursor: "pointer",
                                    width: "20px",
                                  }}
                                />
                              </Link>
                            </li>
                          </Tooltip>
                        </Badge>
                      </li>
                      <li className="nav_li_smining_Fixed_Icone smr_mobileHideIcone" onClick={toggleOverlay} >
                        <Search
                          style={{
                            height: "20px",
                            cursor: "pointer",
                            width: "20px",
                          }}
                        />
                      </li>
                      <li>
                        <Badge badgeContent={cartCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColor">
                          <Tooltip title="Cart">
                            {IsCartNo == 2 ? (
                              <div className="nav_li_smining_Icone" onClick={toggleCartDrawer} style={{ cursor: "pointer" }}>
                                <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                              </div>
                            ) : (
                              <Link href="/cartPage" className="nav_li_smining_Icone">
                                <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                              </Link>
                            )}
                          </Tooltip>
                        </Badge>
                      </li>
                    </>
                  ) : (
                    isMounted && islogin && (
                      <>
                        <li>
                          <Badge badgeContent={wishCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColor smr_mobileHideIcone">
                            <Tooltip title="WishList">
                              <Link href="/myWishList" className="nav_li_smining_Fixed_Icone smr_mobileHideIcone">
                                <StarBorderRoundedIcon
                                  style={{
                                    height: "20px",
                                    cursor: "pointer",
                                    width: "20px",
                                  }}
                                />
                              </Link>
                            </Tooltip>
                          </Badge>
                        </li>
                        <li className="nav_li_smining_Fixed_Icone smr_mobileHideIcone" onClick={toggleOverlay} >
                          <SearchRoundedIcon
                            style={{
                              height: "20px",
                              cursor: "pointer",
                              width: "20px",
                            }}
                          />
                        </li>
                        <li>
                          <Badge badgeContent={cartCountNum} max={1000} overlap={"rectangular"} color="secondary" className="badgeColor">
                            <Tooltip title="Cart">
                              {IsCartNo == 2 ? (
                                <div className="nav_li_smining_Icone" onClick={toggleCartDrawer} style={{ cursor: "pointer" }}>
                                  <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                                </div>
                              ) : (
                                <Link href="/cartPage" className="nav_li_smining_Icone">
                                  <ShoppingCartOutlinedIcon sx={{ height: "20px", width: "20px" }} />
                                </Link>
                              )}
                            </Tooltip>
                          </Badge>
                        </li>
                      </>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div onMouseEnter={handleDropdownOpen} onMouseLeave={handleDropdownClose} className={`shop-dropdown ${isDropdownOpen ? "open" : ""} ${isHeaderFixed ? "fixed" : ""}`} style={{ backgroundColor: isHeaderFixed && "transparent" }}>
            <div
              ref={divRef}
              style={{
                display: "flex",
                padding: "25px",
                color: "#7d7f85",
                backgroundColor: "white",
                gap: "50px",
                justifyContent: "space-between",
                marginTop: isHeaderFixed && "20px",
              }}
              className="smr_showDropOptionMainDiv"
              onMouseEnter={handleDropdownOpen}
              onMouseLeave={handleDropdownClose}
            ></div>
          </div>
        </div>
        <TopNavBar key={menuItems?.length} menuItems={menuItems} handelMenu={handelMenu} />
        {IsCartNo == 2 && <CartDrawer open={isCartOpen} />}
      </div >
    </>
  );
};

export default Header;

const TopNavBar = ({ menuItems = [], handelMenu = () => { } }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null); // To hold the timeout reference

  if (menuItems?.length == 0) {
    return;
  }

  const handleMouseEnter = (index, param) => {
    setHoveredIndex(index);
    setExpandedMenu(index);
    setSelectedData(menuItems[index] || []);
    document.body.style.overflow = "hidden";
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setExpandedMenu(null);
      setSelectedData([]);
      document.body.style.overflow = "auto";
    }, 100);
  };

  const handleMouseLeaveWithDelay = (e) => {
    e.stopPropagation();
    setExpandedMenu(null);
    setSelectedData([]);
    document.body.style.overflow = "auto";
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <>
      <div
        className="TopNavBar"
        onMouseLeave={handleMouseLeaveWithDelay} // Handle mouse leave from the parent container
      >
        <div className="smr_flat_view_menu">
          <HoverMenu key={expandedMenu} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} expandedMenu={expandedMenu} hoveredIndex={hoveredIndex} selectedData={selectedData} handelMenu={handelMenu} />
          {menuItems?.map((menuItem, index) => (
            <div
              key={menuItem.menuid}
              className="menu_list_Smr"
              onMouseEnter={() => {
                handleMouseEnter(index, menuItem);
              }}
              onClick={() => handleMouseLeave()}
            // onMouseLeave={() => {
            //   handleMouseLeave();
            // }}
            >
              <div
                // component="div"
                onClick={(e) =>
                  handelMenu(
                    {
                      menuname: menuItem?.menuname,
                      key: menuItem?.param0name,
                      value: menuItem?.param0dataname,
                    },
                    {},
                    {},
                    e
                  )
                }
              >
                <Link className="menu_list_Smr_0_title" href={`/p/${menuItem?.menuname}/?M=${btoa(`${menuItem?.param0dataname}/${menuItem?.param0name}`)}`}>
                  {menuItem.menuname}
                </Link>
              </div>
              {/* {menuItem?.param1[0].param1dataname !== "" && (
                <div className="child_menu_hover" hidden>
                  <div className="smr_menu_menu">
                    {menuItem.param1.map((subMenuItem) => {
                      if (menuItem?.param1 && menuItem?.param1?.length > 0 && menuItem?.param1[0].param1name === "") {
                        return;
                      }
                      return (
                        <div key={subMenuItem.param1dataid}>
                          <div
                            className="l"
                            onClick={(e) =>
                              handelMenu(
                                {
                                  menuname: menuItem?.menuname,
                                  key: menuItem?.param0name,
                                  value: menuItem?.param0dataname,
                                },
                                {
                                  key: subMenuItem.param1name,
                                  value: subMenuItem.param1dataname,
                                },
                                {},
                                e
                              )
                            }
                          >
                            <a className="smr_menu_title_1" href={`/p/${menuItem?.menuname}/${menuItem?.param0dataname}/${subMenuItem.param1dataname}/?M=${btoa(`${menuItem?.param0dataname},${subMenuItem.param1dataname}/${menuItem?.param0name},${subMenuItem.param1name}`)}`}>
                              {subMenuItem?.param1dataname}
                            </a>
                          </div>
                          <>
                            <div className="smr_menu_level1">
                              {subMenuItem.param2.map((subSubMenuItem, index) => {
                                if (subMenuItem?.param2 && subMenuItem?.param2?.length > 0 && subMenuItem?.param2[0].param2name === "") {
                                  return;
                                }
                                return (
                                  <div
                                    key={index}
                                    component="div"
                                    onClick={(e) =>
                                      handelMenu(
                                        {
                                          menuname: menuItem?.menuname,
                                          key: menuItem?.param0name,
                                          value: menuItem?.param0dataname,
                                        },
                                        {
                                          key: subMenuItem.param1name,
                                          value: subMenuItem.param1dataname,
                                        },
                                        {
                                          key: subSubMenuItem.param2name,
                                          value: subSubMenuItem.param2dataname,
                                        },
                                        e
                                      )
                                    }
                                  >
                                    <Link className="smr_menu_title_2" href={`/p/${menuItem?.menuname}/${menuItem?.param0dataname}/${subMenuItem.param1dataname}/${subSubMenuItem.param2dataname}/?M=${btoa(`${menuItem?.param0dataname},${subMenuItem.param1dataname},${subSubMenuItem.param2dataname}/${menuItem?.param0name},${subMenuItem.param1name},${subSubMenuItem.param2name}`)}`}>
                                      {subSubMenuItem.param2dataname}
                                    </Link>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        </div>
                      );
                    })}
                    {menuItem?.param1[0].param1dataname !== "" && (
                      <button
                        className="smr_view_more_button"
                        onClick={() =>
                          handelMenu({
                            menuname: menuItem?.menuname,
                            key: menuItem?.param0name,
                            value: menuItem?.param0dataname,
                          })
                        }
                      >
                        view all
                      </button>
                    )}
                  </div>
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const HoverMenu = ({ selectedData, handelMenu, expandedMenu, hoveredIndex, handleMouseEnter, handleMouseLeave }) => {
  const SliderbannerImages = [`/WebSiteStaticImage/1.png`, `/WebSiteStaticImage/2.png`];

  if (expandedMenu === null || expandedMenu === undefined || selectedData?.param1[0].param1dataname === "") {
    return;
  }

  return (
    <>
      <div className="new_hover_banner" onMouseEnter={() => handleMouseEnter(hoveredIndex)} onMouseLeave={handleMouseLeave} onClick={() => handleMouseLeave()}>
        <div className="smr_left_list">
          <div className="smr_menu_level_list">
            {selectedData?.param1?.map((param1Item, param1Index) => {
              return (
                <div key={param1Index}>
                  <span
                    className="level1MenuData"
                    key={param1Index}
                    onClick={(e) => {
                      handelMenu(
                        {
                          menuname: selectedData?.menuname,
                          key: selectedData?.param0name,
                          value: selectedData?.param0dataname,
                        },
                        {
                          key: param1Item.param1name,
                          value: param1Item.param1dataname,
                        },
                        {},
                        e
                      );
                      handleMouseLeave();
                    }}
                  >
                    <Link href={`/p/${selectedData?.param0dataname}/${param1Item.param1dataname}/?M=${btoa(`${selectedData?.param0dataname},${param1Item?.param1dataname}/${selectedData?.param0name},${param1Item?.param1name}`)}`} style={{ color: "black", textDecoration: "none" }}>
                      {param1Item?.param1dataname}
                    </Link>
                  </span>
                  <div
                    className="level2menudata"
                    style={{
                      height: "28.2vh",
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "column",
                      marginLeft: "0",
                    }}
                  >
                    {param1Item?.param2?.map((param2Item, param2Index) => {
                      return (
                        <p
                          className="level2menuData"
                          key={param2Index}
                          onClick={(e) => {
                            handelMenu(
                              {
                                menuname: selectedData?.menuname,
                                key: selectedData?.param0name,
                                value: selectedData?.param0dataname,
                              },
                              {
                                key: param1Item?.param1name,
                                value: param1Item?.param1dataname,
                              },
                              {
                                key: param2Item?.param2name,
                                value: param2Item?.param2dataname,
                              },
                              e
                            );
                            handleMouseLeave();
                          }}
                          style={{
                            fontSize: "14px",
                            margin: "3px 15px 0px 0px",
                            // fontFamily: '"PT Sans", sans-serif',
                            letterSpacing: 0.4,
                            textAlign: "start",
                            cursor: "pointer",
                            textTransform: "capitalize",
                            paddingRight: "15px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Link href={`/p/${selectedData?.param0dataname}/${param1Item.param1dataname}/${param2Item.param2dataname}/?M=${btoa(`${selectedData?.param0dataname},${param1Item.param1dataname},${param2Item.param2dataname}/${selectedData?.param0name},${param1Item.param1name},${param2Item.param2name}`)}`} style={{ color: "black", textDecoration: "none" }}>
                            {param2Item?.param2dataname}
                          </Link>
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="smr_right_side_banner">
          {SliderbannerImages?.map((image, index) => {
            return (
              <div className="image_box_s" key={index}>
                <img src={image} alt="image" className="image_s" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
