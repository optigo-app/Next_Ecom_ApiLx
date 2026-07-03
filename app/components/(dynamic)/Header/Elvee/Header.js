'use client'
import React, { memo, useEffect, useState, useRef, useLayoutEffect } from "react";
import "./Header.modul.scss";
import Link from "next/link";
import Cookies from "js-cookie";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import { IoPersonOutline } from "react-icons/io5";
import { Badge, Tooltip, useMediaQuery } from "@mui/material";
import { GoHeart } from "react-icons/go";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { GoSearch } from "react-icons/go";
import { FaPowerOff } from "react-icons/fa";
import { storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import Menubar from "@/app/components/(dynamic)/Header/Elvee/MenuBar/Menubar";
import { RxCross1 } from "react-icons/rx";
import Pako from "pako";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";
import { clearSession } from "@/app/(core)/utils/FetchSessionData";
import { getPricingContext, buildMenuCacheKey } from "@/app/(core)/cache_utility/CacheBuilder";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";



const ElveeBaseHeader = ({ hidden, storeInit, logos }) => {
  const { islogin, loginUserDetail, setislogin, cartCountNum, wishCountNum, authChecked } = useStore();
  const Router = useNextRouterLikeRR().push;
  const navigate = url => Router(url);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [burgerMenu1, setBurgerMenu1] = useState(false);
  const [mobilenav, setMobilenav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const isTabletResponsive = useMediaQuery("(max-width:1000px)");
  const isDesktopResp = useMediaQuery("(max-width:1650px)");
  const isMobile = useMediaQuery("(max-width:500px)");
  const IsB2BWebsiteChek = storeInit?.IsB2BWebsite;
  const compnyLogo = logos?.web;
  const compnyLogoM = logos?.mobile;
  const location = usePathname();
  const [Menu, setMenuId] = useState("");

  const handleIconClick = () => {
    setSearchOpen(true);
  };

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (searchOpen) {
      if (value.length > 0) {
        setShowBtn(true);
      } else {
        setShowBtn(false);
      }
    }
  };

  const handleClose = () => {
    setSearchOpen(false);
    setShowBtn(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchDataFucn();
    }
  };

  const searchDataFucn = () => {
    if (inputValue) {
      let obj = {
        a: "",
        b: inputValue,
        m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
        d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
        c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
        f: {},
      };

      let encodeObj = btoa(JSON.stringify(obj));

      navigate(`/p/${inputValue}?S=${encodeObj}`);
      setInputValue("");
      setShowBtn(false);
      setSearchOpen(false);

    }
  };


  //After Login Header...........
  const [menuData, setMenuData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const isMounted = useRef(false);


  const hasFetched = useRef(false);

  // Fetch menu once on mount for B2C, or once when user logs in for B2B.
  // We do NOT put storeInit in the dependency array — it is a server-side object
  // whose reference changes on every render, which would cause an infinite loop.
  // Instead we guard with a ref so the fetch only fires once per login state change.
  useEffect(() => {
    if (!storeInit) return;
    const isB2C = storeInit?.IsB2BWebsite === 0;
    const isB2B = storeInit?.IsB2BWebsite === 1;
    const isUserLogin = islogin || (typeof window !== "undefined" && Cookies.get("userLoginCookie"));

    if (isB2C && !hasFetched.current) {
      hasFetched.current = true;
      getMenuApi();
    } else if (isB2B && isUserLogin && !hasFetched.current) {
      hasFetched.current = true;
      getMenuApi();
    } else if (isB2B && !isUserLogin) {
      // Reset so menu re-fetches after login
      hasFetched.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setMenuItems(uniqueMenuItems);
  }, [menuData]);

  const handelMenu = (param, param1, param2, event) => {
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
      const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
      navigate(url);
    }
  };

  const getMenuApi = async () => {
    if (!storeInit) return;
    const { IsB2BWebsite } = storeInit;
    const visiterID = Cookies.get("visiterId");
    let finalId;
    if (IsB2BWebsite === 0) {
      finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalId = loginUserDetail?.id || "0";
    }

  

    const pricingContext = getPricingContext(loginUserDetail, storeInit, islogin);
    let cacheKey = "";
    if (pricingContext) {
      const eventName = "elvee_baseheader_menu";
      const { key } = buildMenuCacheKey(eventName, storeInit, pricingContext, finalId);
      cacheKey = key;
      try {
        const cacheRes = await readCache(key);
        if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
          console.log("[Elvee BaseHeader Menu] Serving from cache");
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

  const handleMenuClick = async (menuItem, param1Item = null, param2Item = null) => {
    const { param1, param2, ...cleanedMenuItem } = menuItem;

    let menuDataObj = { ...cleanedMenuItem };

    if (param1Item) {
      const { param1, param2, ...cleanedParam1Item } = param1Item;
      menuDataObj = { ...menuDataObj, ...cleanedParam1Item };

      if (param2Item) {
        menuDataObj = { ...menuDataObj, ...param2Item };
      }
    } else {
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
    setHoveredIndex(null);
    document.body.style.overflow = "auto";
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
    window.location.replace("/");
    clearSession();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1400) {
        setBurgerMenu(true);
      } else {
        setBurgerMenu(false);
      }
    };

    handleResize(); // Initial check on component mount

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 1400 && width >= 767) {
      setBurgerMenu1(true);
    } else {
      setBurgerMenu1(false);
    }

    if (width <= 766 && width >= 0) {
      setMobilenav(true);
    } else {
      setMobilenav(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);


  const HandleMoveToMenu = (MenuId) => {
    console.log("click");
    setMenuId(MenuId);
  };

  const scrollToElement = () => {
    const targetElement = document.querySelector(`[name='${Menu}']`);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top;
      console.log(rect,offsetTop,"tt")
      let top = 135;
      if (Menu === "elveeGiftMainId") {
        top = 70;
      }

      window.scrollTo({
        top: offsetTop - top,
        behavior: "smooth",
      });
      setMenuId("");
    }
  };

  useEffect(() => {
    if (!Menu) return;
  
    const timeoutId = setTimeout(() => {
      const targetElement = document.querySelector(
        `[name='${Menu}']`
      );
  
      if (!targetElement) return;
  
      const offset =
        Menu === "elveeGiftMainId"
          ? 70
          : 135;
  
      const y =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        offset;
  
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
  
      setMenuId("");
    }, 80);
  
    return () => clearTimeout(timeoutId);
  }, [Menu]);

  
  if (hidden) return null;
  
 

  return (
    <>
      <div
        className="el_header_main"
        draggable={false}
        onContextMenu={(e) => {
          if (location?.startsWith("/p") || location?.startsWith("/d") || location?.startsWith("/myWishList") || location?.startsWith("/cartPage")) {
            e.preventDefault();
          }
        }}
      >
        {!islogin ? (
          isTabletResponsive ? (
            <>
              <div className="el_withoutL_Header_Main ">
                <div className="el_withoutL_ul_Main_side">
                  <Menubar storeInit={storeInit} logos={logos} />
                  <div className="el_whioutL_headerDiv2_side" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                    <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                      {compnyLogo && <img src={isMobile ? compnyLogoM : compnyLogo} alt="Title" className="el_without_headerLogo_side" draggable={false} onContextMenu={(e) => e.preventDefault()} />}
                    </Link>
                  </div>
                  <div className="el_whioutL_headerDiv3_side">
                    <div className="el_whioutL_headerDiv3_sub2">
                      <p className="elv_withoutL_login" onClick={() => navigate("/LoginOption")}>
                        Log In
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="el_withoutL_Header_Main ">
                <div className="el_withoutL_ul_Main">
                  <div className="el_whioutL_headerDiv1">
                    <h4
                      className="el_whioutL_li"
                      style={{ cursor: "pointer" }}
                      // onClick={() => ScrollToView("brandsComponentID")}
                      onClick={() => HandleMoveToMenu("brandsComponentID")}
                    >
                      Our Brands
                    </h4>
                    <h4
                      className="el_whioutL_li"
                      style={{ cursor: "pointer" }}
                      // onClick={() => ScrollToView("elveeGiftMainId")}
                      onClick={() => HandleMoveToMenu("elveeGiftMainId")}
                    >
                      Product
                    </h4>
                    <h4
                      className="el_whioutL_li"
                      style={{ cursor: "pointer" }}
                      // onClick={() => ScrollToView("craftmenshipId")}
                      onClick={() => HandleMoveToMenu("craftmenshipId")}
                    >
                      Our Craftsmanship
                    </h4>
                  </div>
                  <div className="el_whioutL_headerDiv2" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                    <Link href="/" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                      {compnyLogo && <img src={isMobile ? compnyLogoM : compnyLogo} alt="Title" className="el_without_headerLogo" draggable={false} onContextMenu={(e) => e.preventDefault()} />}
                    </Link>
                  </div>
                  <div className="el_whioutL_headerDiv3">
                    <div className="el_whioutL_headerDiv3_sub1">
                      <h4
                        className="el_whioutL_li"
                        style={{ cursor: "pointer" }}
                        // onClick={() => ScrollToView("mainGalleryConatinerID")}
                        onClick={() => HandleMoveToMenu("mainGalleryConatinerID123")}
                      >
                        Gallery
                      </h4>
                      <h4
                        className="el_whioutL_li"
                        style={{ cursor: "pointer" }}
                        // onClick={() => ScrollToView("mainSocialMediaConatinerID")}
                        onClick={() => HandleMoveToMenu("mainSocialMediaConatinerID")}
                      >
                        Social Media
                      </h4>
                      <h4 className="el_whioutL_li" style={{ cursor: "pointer" }} onClick={() => navigate("/contactUs")}>
                        Contact
                      </h4>
                    </div>
                    <div className="el_whioutL_headerDiv3_sub2">
                      <p className="elv_withoutL_login" onClick={() => navigate("/LoginOption")}>
                        Log In
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          <div className={`${burgerMenu ? "elv_login_header_main_bg_active" : "el_login_header_main"}`}>
            {!burgerMenu ? (
              <>
                <div className="el_login_header_main_div1" draggable={false} onContextMenu={(e) => e.preventDefault()}>
                  <Link
                    href="/"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {compnyLogo && <img src={isMobile ? compnyLogoM : compnyLogo} alt="Title" className="el_login_header_main_div1_logo" draggable={false} onContextMenu={(e) => e.preventDefault()} />}
                  </Link>
                  <ul className="el_login_header_main_div1_ul">
                    {/* {IsB2BWebsiteChek == 1 && (
                      <> */}
                    {menuItems.map((item, index) => {
                      return (
                        <li
                          className="el_Login_header_li"
                          style={{
                            textDecoration: hoveredIndex === index ? "underline" : "none",
                          }}
                          key={index}
                          label={item.menuname}
                          onMouseEnter={() => {
                            handleMouseEnter(index, item);
                          }}
                          onMouseLeave={() => {
                            handleMouseLeave();
                          }}
                          onClick={(e) => {
                            handelMenu({ menuname: item?.menuname, key: item?.param0name, value: item?.param0dataname }, {}, {}, e);
                            handleMouseLeave();
                          }}
                        >
                          <Link href={`/p/${item?.menuname}/?M=${btoa(`${item?.param0dataname}/${item?.param0name}`)}`} style={{ color: "black", textDecoration: "none" }}>
                            {item.menuname}
                          </Link>
                        </li>
                      );
                    })}
                    {/* </>
                    )} */}
                    {/* {IsB2BWebsiteChek == 1 && (
                      <> */}
                    {storeInit?.IsDesignSetInMenu == 1 && (
                      <Link
                        href={"/Lookbook"}
                        className="el_Login_header_li go-lookbook"
                        style={{
                          marginLeft: " 22px",
                          cursor: "pointer",
                          textDecoration: "none",
                          position: "relative",
                          color: "inherit",
                        }}
                      >
                        <small
                          style={{
                            backgroundColor: "#9C27B0",
                            position: "absolute",
                            marginTop: "-30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "15px",
                            borderRadius: "",
                            padding: "0 5px",
                            fontSize: "10px",
                            borderRadius: " 3px",
                            marginLeft: "-10px",
                            color: "white",
                          }}
                        >
                          New
                        </small>
                        {storeInit?.DesignSetInMenu}
                      </Link>
                      //   )}
                      // </>
                    )}

                    {
                      <Link
                        className="el_Login_header_li go-lookbook"
                        href="/offers"
                        style={{
                          marginLeft: " 22px",
                          cursor: "pointer",
                          textDecoration: "none",
                          position: "relative",
                          color: "inherit",
                        }}
                      >
                        Offers
                      </Link>
                    }
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Menubar />
                </div>
              </>
            )}
            {burgerMenu && (
              <Link
                href="/"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              >
                {compnyLogo && <img src={isMobile ? compnyLogoM : compnyLogo} alt="Title" className="el_login_header_main_div1_logo" draggable={false} onContextMenu={(e) => e.preventDefault()} />}
              </Link>
            )}

            <ul className="el_login_header_main_div2">
              <>
                {!burgerMenu && (
                  <>
                    {/* <Tooltip title="Search"> */}
                    <li
                      className="el_login_header_main_div2_li"
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        marginBottom: "0px",
                      }}
                    // onClick={() => navigate("/account")}
                    >
                      <div className={`elv_search_area ${searchOpen ? "open" : ""}`}>
                        <div onClick={handleIconClick}>
                          <GoSearch className="elv_search_icon" color="#7D7F85" fontSize="25px" />
                        </div>
                        {searchOpen && (
                          <>
                            <div className="elv_search_design">
                              <input className="elv_search_inp" placeholder="Search..." type="text" value={inputValue} onChange={handleInputChange} ref={inputRef} onKeyDown={handleKeyDown} />
                            </div>
                            <div className="elv_search_btn">
                              {/* {!showBtn ? (
                            <button
                              type='button'
                              className='elv_cancel_bar'
                              onClick={handleClose}
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              type='button'
                              className='elv_search_bar'
                              onClick={handleButtonClick}
                            >
                              Search
                            </button>
                          )} */}
                              <RxCross1 onClick={handleClose} />
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                    {/* </Tooltip> */}
                    {/* {IsB2BWebsiteChek == 1 && islogin ? (
                      <> */}
                    <Badge badgeContent={wishCountNum} max={1000} overlap={"rectangular"} color="secondary" className="el_login_header_main_div2_li">
                      <Tooltip title="WishList">
                        <li
                          style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            marginTop: "0",
                          }}
                          onClick={() => navigate("/myWishList")}
                        >
                          <GoHeart className="elv_heart_icon" color="#7D7F85" fontSize="25px" />
                        </li>
                      </Tooltip>
                    </Badge>
                    <Badge badgeContent={cartCountNum} max={1000} overlap={"rectangular"} color="secondary" className="el_login_header_main_div2_li">
                      <Tooltip title="Cart">
                        <li
                          onClick={() => navigate("/cartPage")}
                          style={{
                            cursor: "pointer",
                            marginTop: "0px",
                          }}
                        >
                          <HiOutlineShoppingBag className="elv_shopping_icon" color="#7D7F85" fontSize="25px" />
                        </li>
                      </Tooltip>
                    </Badge>
                    {/* </>
                    ) : null} */}
                  </>
                )}
              </>
              {burgerMenu1 && (
                <li
                  className="el_login_header_main_div2_li_respo"
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    marginTop: "6px",
                  }}
                // onClick={() => navigate("/account")}
                >
                  <div className={`elv_search_area_respo ${searchOpen ? "open" : ""}`}>
                    <div onClick={handleIconClick}>
                      <GoSearch className="elv_search_icon_respo" />
                    </div>
                    {searchOpen && (
                      <>
                        <div className="elv_search_design_respo">
                          <input className="elv_search_inp" placeholder="Search..." type="text" value={inputValue} onChange={handleInputChange} ref={inputRef} onKeyDown={handleKeyDown} />
                        </div>
                        <div className="elv_search_btn_respo">
                          {/* {!showBtn ? (
                        <button
                          type='button'
                          className='elv_cancel_bar_respo'
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          type='button'
                          className='elv_search_bar_respo'
                          onClick={handleButtonClick}
                        >
                          Search
                        </button>
                      )} */}
                          <RxCross1 onClick={handleClose} />
                        </div>
                      </>
                    )}
                  </div>
                </li>
              )}
              {mobilenav && (
                <li
                  className={mobilenav ? "el_login_header_main_div2_li_respo_1" : "el_login_header_main_div2_li_respo_1_hidden"}
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    marginTop: "6px",
                  }}
                // onClick={() => navigate("/account")}
                >
                  <div onClick={handleIconClick}>
                    <GoSearch className="elv_search_icon_respo_1" />
                  </div>
                  {searchOpen && (
                    <>
                      <div className={`elv_search_area_respo_1 ${searchOpen ? "open" : ""}`}>
                        <div className="elv_search_design_respo_1">
                          <input className="elv_search_inp" placeholder="Search..." type="text" value={inputValue} onChange={handleInputChange} ref={inputRef} onKeyDown={handleKeyDown} />
                        </div>
                        <div className="elv_search_btn_respo_1">
                          {/* {!showBtn ? (
                        <button
                          type='button'
                          className='elv_cancel_bar_respo_1'
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          type='button'
                          className='elv_search_bar_respo_1'
                          onClick={handleButtonClick}
                        >
                          Search
                        </button>
                      )} */}
                          <RxCross1 onClick={handleClose} />
                        </div>
                      </div>
                    </>
                  )}
                </li>
              )}
              {/* {storeInit?.IsPLW == 0 && (IsB2BWebsiteChek == 1 && islogin) ? (
                <> */}
              <Tooltip title="Account">
                <li
                  className="el_login_header_main_div2_li"
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    marginTop: "0",
                  }}
                  onClick={() => navigate("/account")}
                >
                  <IoPersonOutline className="elv_person_icon" color="#7D7F85" fontSize="25px" />
                </li>
              </Tooltip>
              {/* </>
              ) : null} */}

              <li className="el_login_header_main_div2_li" style={{ cursor: "pointer", marginTop: "0" }} onClick={handleLogout}>
                <FaPowerOff className="elv_power_icon" />
              </li>
            </ul>
          </div>
        )}

        <div className={`el_shop_dropdown ${expandedMenu !== null ? "open" : ""}`} onMouseEnter={() => handleMouseEnter(hoveredIndex)} onMouseLeave={handleMouseLeave} onClick={() => handleMouseLeave()}>
          <div className={`el_shop_dropdown_1 ${expandedMenu !== null ? "open" : ""}`} draggable={false} onContextMenu={(e) => e.preventDefault()}>
            <img src={`${storImagePath()}/images/Menu/Menu1.jpg`} alt="Image 1" className="dropdown-image-1" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            <img src={`${storImagePath()}/images/Menu/Menu2.jpg`} alt="Image 2" className="dropdown-image-2" draggable={false} onContextMenu={(e) => e.preventDefault()} />
          </div>
          <div
            style={{
              display: "flex",
              padding: "50px",
              color: "#7d7f85",
              // backgroundColor: "rgba(255, 255, 255, 0.8)",
              // flexDirection: "column",
              gap: "50px",
              justifyContent: "space-between",
            }}
            className="menuDropdownData"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "60px",
                textTransform: "uppercase",
                maxWidth: "70rem",
                overflowX: "auto",
                scrollbarWidth: "thin",
                msOverflowStyle: "none",
              }}
            >
              {selectedData?.param1?.map((param1Item, param1Index) => {
                return (
                  <div key={param1Index}>
                    <span
                      className="level1MenuData"
                      key={param1Index}
                      style={{
                        fontSize: "14px",
                        textDecoration: "underline",
                        marginBottom: "10px",
                        // fontFamily: '"PT Sans", sans-serif',
                        color: "black",
                        textAlign: "start",
                        letterSpacing: 1,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={(e) => handelMenu({ menuname: selectedData?.menuname, key: selectedData?.param0name, value: selectedData?.param0dataname }, { key: param1Item.param1name, value: param1Item.param1dataname }, {}, e)}
                    >
                      <Link href={`/p/${selectedData?.param0dataname}/${param1Item.param1dataname}/?M=${btoa(`${selectedData?.param0dataname},${param1Item?.param1dataname}/${selectedData?.param0name},${param1Item?.param1name}`)}`} style={{ color: "black", textDecoration: "none" }}>
                        {param1Item?.param1dataname}
                      </Link>
                    </span>
                    <div
                      style={{
                        height: "300px",
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        marginLeft: "15px",
                      }}
                    >
                      {param1Item?.param2?.map((param2Item, param2Index) => {
                        return (
                          <p
                            className="level2menuData"
                            key={param2Index}
                            onClick={(e) =>
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
                              )
                            }
                            style={{
                              fontSize: "14px",
                              margin: "3px 15px 3px 0px",
                              // fontFamily: '"PT Sans", sans-serif',
                              letterSpacing: 0.4,
                              textAlign: "start",
                              cursor: "pointer",
                              textTransform: "capitalize",
                              paddingRight: "15px",
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
        </div>
      </div>
    </>
  );
};

export default ElveeBaseHeader
