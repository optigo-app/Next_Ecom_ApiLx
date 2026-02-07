"use client"

import "./Navbar.modul.scss";
import { CiSearch, CiHeart } from "react-icons/ci";
import {
  PiBagSimpleThin,
} from "react-icons/pi";
import { HiMenuAlt1 } from "react-icons/hi";

import { GoSearch } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoChevronDown, IoClose } from "react-icons/io5";
import CartDrawer from "../../../../theme/hoq.web/cart/CartPageB2c/Cart";
import { IoSearchOutline } from "react-icons/io5";
import { TfiClose } from "react-icons/tfi";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
// import {
//   Hoq_CartCount,
//   Hoq_MobilecompanyLogo,
//   Hoq_WishCount,
//   Hoq_cartB2CDrawer,
//   Hoq_companyLogo,
//   Hoq_loginState,
// } from "../../../Recoil/atom";
import MuiLink from '@mui/material/Link';
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge, Tooltip, useMediaQuery } from "@mui/material";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import Pako from "pako";
import DummyNav from "./DummyNav";
import TemporaryDrawer from "./MobileNavbar";
import { HiOutlineUserCircle } from "react-icons/hi2";
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import Link from "next/link";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const Navbar = ({ storeinit, logos }) => {

  const { islogin, setislogin, cartCountNum, setCartCountNum, wishCountNum, setWishCountNum, setCartOpenStateB2C } = useStore();

  const DeskTopLogo = logos?.web;
  const MobileLogoNew = logos?.mobile;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenu, setisMobileMenu] = useState(false);
  const [isNavbarSticky, setisNavbarSticky] = useState(false);
  const [showSearchBar, setshowSearchBar] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const setCartOpenState = setCartOpenStateB2C;
  const prevScrollY = useRef(0);
  const HaveItem = [1, 2];
  const navigate = useNextRouterLikeRR().push;
  //After Login Header...........
  const [menuData, setMenuData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [LoggedUserDetails, setLoggedUserDetails] = useState();

  const [searchText, setSearchText] = useState("");
  // const [titleImg, setCompanyTitleLogo] = useRecoilState(Hoq_companyLogo);
  // const [MobileLogo, setCompanyMobileLogo] = useRecoilState(
  //   Hoq_MobilecompanyLogo
  // );

  const compnyLogo = storeinit?.companylogo;
  const compnyLogoM = storeinit?.companyMlogo;

  const is320px = useMediaQuery("(max-width:320px)");
  const is500px = useMediaQuery("(max-width:500px)");
  const [loading, setLoading] = useState(true);
  const [IsCartNo, setIsCartNo] = useState();

  useEffect(() => {
    setisMobileMenu(false);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("isCart_hOQ", cartCountNum);
  }, [cartCountNum]);

  useGlobalPreventSave();

  // useEffect(()=>{
  //  (async function () {
  //   try {
  //     const {data} = await axios
  //   } catch (error) {

  //   }
  //   })()
  // },[])

  useEffect(() => {
    let interval;
    const checkStoreInit = () => {
      try {
        const storeInit = sessionStorage.getItem("storeInit");
        if (storeInit) {
          const parsedData = JSON.parse(storeInit);
          // setCompanyTitleLogo(parsedData?.companylogo);
          // setCompanyMobileLogo(parsedData?.companyMlogo);
          window.scroll({ behavior: "smooth", top: 0 });
          setLoading(false);
          if (interval) {
            clearInterval(interval);
          }
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.error("Error parsing storeInit:", error);
        setLoading(false);

        if (interval) {
          clearInterval(interval);
        }
      }
    };

    checkStoreInit();
    interval = setInterval(checkStoreInit, 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    const value = JSON.parse(sessionStorage.getItem("LoginUser"));
    setislogin(value);
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    setIsCartNo(storeInit?.CartNo)
    window.scroll({ behavior: "smooth", top: 0 });
  }, []);

  const HandleAccountRoute = () => {
    navigate("/account");
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const currentScrollY = window.scrollY;
    if (window.innerWidth < 768) {
      if (currentScrollY > prevScrollY.current) {
        setisNavbarSticky(false);
      } else {
        setisNavbarSticky(true);
      }
      prevScrollY.current = currentScrollY;
    }
    if (scrollTop > 200) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  // const handleScroll = debounce(() => {
  //   const currentScrollY = window.scrollY;

  //   // Handle sticky navbar logic
  //   if (window.innerWidth <= 768) {
  //     if (currentScrollY > prevScrollY.current) {
  //       setisNavbarSticky(false);
  //     } else {
  //       setisNavbarSticky(true);
  //     }
  //     prevScrollY.current = currentScrollY;
  //   }

  //   // Handle scrolled state logic
  //   setIsScrolled(currentScrollY >= 220);
  // }, 50); // Debounce delay of 50ms

  const fetchData = () => {
    const value = JSON.parse(sessionStorage?.getItem("LoginUser"));
    setislogin(value);
  };

  const handleLogout = () => {
    navigate("/");
    setislogin(false);
    Cookies.remove("userLoginCookie");
    sessionStorage.setItem("LoginUser", false);
    sessionStorage.removeItem("storeInit");
    sessionStorage.removeItem("loginUserDetail");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("selectedAddressId");
    sessionStorage.removeItem("orderNumber");
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("UploadLogicalPath");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("allproductlist");
    sessionStorage.clear();
  };

  useEffect(() => {
    fetchData();
  }, [islogin]);

  const toggleCartDrawer = () => {
    setIsCartOpen((prevState) => !prevState);
    const isCartDrawerOpen = JSON.parse(sessionStorage.getItem("isCartDrawer"));
    sessionStorage.setItem("isCartDrawer", !isCartDrawerOpen);
    setCartOpenState((prevState) => !prevState);
  };


  useEffect(() => {
    const uniqueMenuIds = [...new Set(menuData?.map((item) => item?.menuid))];
    const uniqueMenuItems = uniqueMenuIds.map((menuid) => {
      const item = menuData?.find((data) => data?.menuid === menuid);
      const param1DataIds = [
        ...new Set(
          menuData
            ?.filter((data) => data?.menuid === menuid)
            ?.map((item) => item?.param1dataid)
        ),
      ];

      const param1Items = param1DataIds.map((param1dataid) => {
        const param1Item = menuData?.find(
          (data) =>
            data?.menuid === menuid && data?.param1dataid === param1dataid
        );
        const param2Items = menuData
          ?.filter(
            (data) =>
              data?.menuid === menuid && data?.param1dataid === param1dataid
          )
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

  const getMenuApi = async () => {
    const loginUserDetail = JSON.parse(
      sessionStorage?.getItem("loginUserDetail")
    );
    const storeInit = JSON.parse(sessionStorage?.getItem("storeInit"));
    const IsB2BWebsite = storeInit?.IsB2BWebsite;
    const visiterID = Cookies.get("visiterId");
    setLoggedUserDetails(loginUserDetail);
    let finalId;

    if (IsB2BWebsite === 0) {
      finalId = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalId = loginUserDetail?.id || "0";
    }

    await GetMenuAPI(finalId)
      .then((response) => {
        setMenuData(response?.Data?.rd);
      })
      .catch((err) => console.log(err));
  };

  const handleMenu = (param, param1, param2) => {
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

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    // const url = `/productlist?V=${queryParameters}/K=${otherparamUrl}`;
    const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(
      menuEncoded
    )}`;
    // let d = new Date();
    // let randomno = Math.floor(Math.random() * 1000 * d.getMilliseconds() * d.getSeconds() * d.getDate() * d.getHours() * d.getMinutes())
    navigate(url);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const visiterID = Cookies?.get("visiterId");
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

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = Pako.deflate(uint8Array, { to: "string" });

      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const searchDataFucn = (e) => {
    if (e.key === "Enter") {
      if (searchText) {
        // navigation(`/p/${searchText}/?S=${btoa(JSON.stringify(searchText))}`)

        // const handleMoveToDetail = () => {

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

        navigate(`/p/${searchText}?S=${encodeObj}`);
        // toggleOverlay();
        setSearchText("");
        setshowSearchBar(!showSearchBar);
        // navigate(`/d/${productData?.TitleLine.replace(/\s+/g, `_`)}${productData?.TitleLine?.length > 0 ? "_" : ""}${searchText}?p=${encodeObj}`)

        // }
      }
    }
  };

  // useEffect(() => {
  //   let storeinit = JSON.parse(sessionStorage?.getItem("storeInit"));
  //   let isUserLogin = JSON.parse(sessionStorage?.getItem("LoginUser"));

  //   if (storeinit?.IsB2BWebsite === 0) {
  //     getMenuApi();
  //     return;
  //   } else if (storeinit?.IsB2BWebsite === 1 && isUserLogin === true) {
  //     getMenuApi();
  //     return;
  //   } else {
  //     return;
  //   }
  // }, [islogin]);

  useEffect(() => {
    const storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    const isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));

    if (
      storeinit?.IsB2BWebsite === 0 ||
      (storeinit?.IsB2BWebsite === 1 && isUserLogin === true)
    ) {
      getMenuApi();
    }
  }, [islogin]);

  return (
    <>
      <div
        className={`hoq_main_navbar ${isScrolled ? "sticky animate" : "s"}  ${!isMobileMenu ? "hide" : ""
          }
      ${!isNavbarSticky ? "isScrollTop" : ""}
      `}
        draggable={true}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* <div className="nav_top_head">
          <span className="contact_icon">
            <a href="/contacts">
              <IoIosCall color="red" size={19} />
              Contact
            </a>
          </span>
          <span className="contact_icon">
           <ul>
           {menuItems?.map((menuItem, i) => {
              const { menuname, param1 } = menuItem;
              return (
                <React.Fragment key={i}>
                  <Link>
                    <span>{menuname}</span>
                  </Link>
                </React.Fragment>
              );
            })}
           </ul>
          </span>
          <span className="contact_icon"></span>
        </div> */}
        {/* <nav className="navbar">
          <NavbarleftSlide
            isMobileMenu={isMobileMenu}
            setisMobileMenu={setisMobileMenu}
            setshowSearchBar={setshowSearchBar}
            showSearchBar={showSearchBar}
            searchText={searchText}
            setSearchText={setSearchText}
            searchDataFucn={searchDataFucn}
          />
          <NavbarCenter
            MainLogo={MainLogo}
            isMobileMenu={isMobileMenu}
            navbarMenu={navbarMenu}
            setisMobileMenu={setisMobileMenu}
            menuItems={menuItems}
            handleMenu={handleMenu}
            logo={MobileLogo}
            islogin={islogin}
            selectedData={selectedData}
            navigation={navigate}
          />
          {is320px ? (
            <NavbarRightSide2
              HaveItem={HaveItem}
              setshowDrawer={setshowDrawer}
              showDrawer={showDrawer}
              open={() => setshowSearchBar(!showSearchBar)}
              islogin={islogin}
              handleLogout={handleLogout}
              user={LoggedUserDetails?.firstname}
              wishCountNum={wishCountNum}
              cartCountNum={cartCountNum}
              HandleAccountRoute={HandleAccountRoute}
            />
          ) : (
            <NavbarRightSide
              HaveItem={HaveItem}
              setshowDrawer={setshowDrawer}
              showDrawer={showDrawer}
              open={() => setshowSearchBar(!showSearchBar)}
              islogin={islogin}
              handleLogout={handleLogout}
              user={LoggedUserDetails?.firstname}
              wishCountNum={wishCountNum}
              cartCountNum={cartCountNum}
              HandleAccountRoute={HandleAccountRoute}
            />
          )}
          {islogin && (
            <div className="mobile_only_cart">
              <Badge
                style={{ size: "2px" }}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "10px",
                    padding: "7px",
                    borderRadius: "4px",
                    marginRight: "7px",
                    marginTop: "-2px",
                    bgcolor: "#C20000",
                    width: 0,
                    height: 0,
                  },
                }}
                badgeContent={cartCountNum}
                color="primary"
              >
                <Tooltip title="Cart">
                  <Link to={"/cartPage"}>
                    <PiBagSimpleThin
                      className="Cart_icon icons "
                      // onClick={() => setshowDrawer(!showDrawer)}   b2c drawer
                    />
                  </Link>
                </Tooltip>
              </Badge>
            </div>
          )}
        </nav> */}
        <div className="new_bar">
          {showSearchBar && (
            <SearchBar
              size={28}
              color="grey"
              closeSearch={() => setshowSearchBar(!showSearchBar)}
              showSearchBar={showSearchBar}
              searchText={searchText}
              setSearchText={setSearchText}
              searchDataFucn={searchDataFucn}
            />
          )}
          <div className="first_bar_sec_hoq">
            <div className="nav_left2">
              <div className="navbar_search_hoq_m">
                <Tooltip title="Search">
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <CiSearch
                      size={28}
                      color="grey"
                      className="search_icon icons desktop-search"
                      onClick={() => setshowSearchBar(!showSearchBar)}
                    />
                  </button>
                </Tooltip>
              </div>
              <div className="hamburger_hoq_m">
                <Tooltip title="Search">
                  <div>
                    <HiMenuAlt1
                      className="search_icon_hoq"
                      onClick={() => setisMobileMenu(!isMobileMenu)}
                      color="#9c9c9cea"
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="logo"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Link href={"/"}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={is500px ? MobileLogoNew : DeskTopLogo}
                  alt=""
                  onClick={() =>
                    window.scrollTo({ behavior: "smooth", top: 0, left: 0 })
                  }
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </Link>
            </div>
            <div className="nav_right2">
              <div className="desk_hoq_a1">
                {islogin && (
                  <>
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={HandleAccountRoute}
                    >
                      Hey ,
                      <span
                        style={{
                          color: "#C20000",
                          fontWeight: "600",
                        }}
                      >
                        {LoggedUserDetails?.firstname}
                      </span>
                    </span>
                  </>
                )}
                {islogin && (
                  <>
                    <Link href={"/myWishList"} className="wishlist_hoq_hide">
                      <Tooltip title="Wishlist">
                        <Badge
                          style={{ size: "2px" }}
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "10px",
                              padding: "7px",
                              borderRadius: "4px",
                              marginRight: "7px",
                              marginTop: "-2px",
                              bgcolor: "#C20000",
                              width: 0,
                              height: 0,
                            },
                          }}
                          badgeContent={wishCountNum}
                          color="primary"
                        >
                          <CiHeart
                            color="grey"
                            className="wishlist_icon icons"
                            size={28}
                          />
                        </Badge>
                      </Tooltip>
                    </Link>

                    {/* <Tooltip title="Search">
                    <CiSearch
                    size={28}
                      className="search_icon icons mobile-search"
                      // onClick={open}
                    />
                  </Tooltip> */}
                    <MuiLink
                      sx={{
                        cursor: "pointer",
                        padding: "0",
                        margin: "0"
                      }}
                      // to={"/cartPage"}
                      style={{
                        marginRight: "5px",
                      }}
                      onClick={
                        IsCartNo == 2
                          ? toggleCartDrawer
                          : () => navigate("/cartPage")
                      }
                    >
                      <Badge
                        style={{ size: "2px" }}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "10px",
                            padding: "7px",
                            borderRadius: "4px",
                            marginRight: "7px",
                            marginTop: "-2px",
                            bgcolor: "#C20000",
                            width: 0,
                            height: 0,
                          },
                        }}
                        badgeContent={cartCountNum}
                        color="primary"
                      >
                        <Tooltip title="Cart">
                          <PiBagSimpleThin
                            size={27}
                            color="grey"
                          // onClick={() => setshowDrawer(!showDrawer)}   b2c drawer
                          />
                        </Tooltip>
                      </Badge>
                    </MuiLink>
                  </>
                )}
                {/* {showDrawer && (
                  <CartDrawer
                    width={showDrawer}
                    close={() => setshowDrawer(!showDrawer)}
                  />
                )} */}
                {islogin ? (
                  <Tooltip title="Logout" className="tooltip-logout">
                    <button
                      onClick={handleLogout}
                      className="logout_btn_hoq icons"
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      <IoIosLogOut color="grey" size={27} />
                    </button>
                  </Tooltip>
                ) : (
                  <Link href={"/LoginOption"}>
                    <small style={{ fontSize: "1rem", fontWeight: "500" }}>
                      <HiOutlineUserCircle color="grey" size={36} />
                    </small>
                  </Link>
                )}
              </div>
              {islogin ? (
                <>
                  <div className="mob_hoq_a1">
                    <Tooltip title="Search">
                      <button
                        style={{
                          border: "none",
                          outline: "none",
                          backgroundColor: "transparent",
                        }}
                      >
                        <CiSearch
                          size={28}
                          color="grey"
                          className="search_icon icons desktop-search"
                          onClick={() => setshowSearchBar(!showSearchBar)}
                        />
                      </button>
                    </Tooltip>
                    <Link
                      href={"/cartPage"}
                      style={{
                        marginRight: "5px",
                      }}
                    >
                      <Badge
                        style={{ size: "2px" }}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "10px",
                            padding: "7px",
                            borderRadius: "4px",
                            marginRight: "7px",
                            marginTop: "-2px",
                            bgcolor: "#C20000",
                            width: 0,
                            height: 0,
                          },
                        }}
                        badgeContent={cartCountNum}
                        color="primary"
                      >
                        <Tooltip title="Cart">
                          <PiBagSimpleThin
                            size={27}
                            color="grey"
                          // onClick={() => setshowDrawer(!showDrawer)}   b2c drawer
                          />
                        </Tooltip>
                      </Badge>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link href={"/LoginOption"} className="hoq_login_a1">
                    <small style={{ fontSize: "1rem", fontWeight: "500" }}>
                      <HiOutlineUserCircle color="grey" size={36} />
                    </small>
                  </Link>
                </>
              )}
            </div>
          </div>
          {islogin && (
            <div className="menu_bar_Sec_hoq">
              <div className="navbar_menus">
                <div className="mobile-close">
                  <IoClose
                    size={32}
                    onClick={() => setisMobileMenu(!isMobileMenu)}
                  />
                  {/* <Link>
                    <CiHeart className="wishlist_icon_mobile icons" />
                  </Link> */}
                </div>
                {islogin && (
                  <>
                    <ul className="lg_navbar_item">
                      {menuItems?.map((menuItem, i) => {
                        const { menuname, param1 } = menuItem;

                        return (
                          <React.Fragment key={i}>
                            <li>
                              <span
                                onClick={() => {
                                  handleMenu({
                                    menuname: menuname,
                                    key: menuItem?.param0name,
                                    value: menuItem?.param0dataname,
                                  });
                                  window.scrollTo({
                                    behavior: "smooth",
                                    top: 0,
                                    left: 0,
                                  });
                                }}
                              >
                                {menuname}
                              </span>
                              {param1 && (
                                <IoChevronDown className="chevron-downn-mobile" />
                              )}
                              {param1 &&
                                param1?.length > 0 &&
                                param1[0].param1name !== "" && (
                                  <ul className="submenu">
                                    {param1[0].param1name === ""
                                      ? "no"
                                      : param1?.map(
                                        (
                                          { param1dataname, param1name },
                                          j
                                        ) => (
                                          <li>
                                            <span
                                              onClick={() => {
                                                handleMenu(
                                                  {
                                                    menuname: menuname,
                                                    key: menuItem?.param0name,
                                                    value:
                                                      menuItem?.param0dataname,
                                                  },
                                                  {
                                                    key: param1name,
                                                    value: param1dataname,
                                                  }
                                                );
                                                window.scrollTo({
                                                  behavior: "smooth",
                                                  top: 0,
                                                  left: 0,
                                                });
                                              }}
                                            >
                                              {param1dataname}
                                            </span>
                                            {/* {param2 && (
                                <ul className="sub_submenu">
                                  {param2?.map(
                                    ({ param2dataname, param2name }, j) => (
                                      <li>
                                        <span
                                          onClick={() =>
                                            handleMenu(
                                              {
                                                menuname: menuname,
                                                key: menuItem?.param0name,
                                                value: menuItem?.param0dataname,
                                              },
                                              {
                                                key: param1name,
                                                value: param1dataname,
                                              },
                                              {
                                                key: param2name,
                                                value: param2dataname,
                                              }
                                            )
                                          }
                                        >
                                          {param2dataname}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )} */}
                                          </li>
                                        )
                                      )}
                                  </ul>
                                )}
                            </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
          {isMobileMenu && (
            <TemporaryDrawer
              menuItems={menuItems}
              handleMenu={handleMenu}
              setisMobileMenu={setisMobileMenu}
              isMobileMenu={isMobileMenu}
            />
          )}
        </div>
        <div className="nav_bottom_head">
          <span>
            <Link href={"/Lookbook"}>Explore Our Artful Jewellery Lookbook</Link>
          </span>
        </div>
      </div>
      {isScrolled && <DummyNav />}
      {IsCartNo == 2 && <CartDrawer storeinit={storeinit} open={isCartOpen} />}
    </>
  );
};

export default Navbar;

const NavbarleftSlide = ({
  setisMobileMenu,
  isMobileMenu,
  setshowSearchBar,
  showSearchBar,
  searchText,
  setSearchText,
  searchDataFucn,
}) => {
  return (
    <>
      <div className="nav_left">
        <Tooltip title="Search">
          <button
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            }}
          >
            {" "}
            <CiSearch
              className="search_icon icons desktop-search"
              onClick={() => setshowSearchBar(!showSearchBar)}
            />
          </button>
        </Tooltip>
        {showSearchBar && (
          <SearchBar
            closeSearch={() => setshowSearchBar(!showSearchBar)}
            showSearchBar={showSearchBar}
            searchText={searchText}
            setSearchText={setSearchText}
            searchDataFucn={searchDataFucn}
          />
        )}
        <Tooltip title="Search">
          <CiMenuFries
            className="search_icon icons mobile-Ham"
            onClick={() => setisMobileMenu(!isMobileMenu)}
            size={28}
          />
        </Tooltip>
      </div>
    </>
  );
};

const NavbarRightSide = ({
  showDrawer,
  islogin,
  setshowDrawer,
  HaveItem,
  open,
  handleLogout,
  user,
  wishCountNum,
  cartCountNum,
  HandleAccountRoute,
}) => {
  return (
    <>
      <div className="nav_right">
        {islogin && (
          <>
            <span className="loggedUser" onClick={HandleAccountRoute}>
              Hey ,
            </span>
            <small className="loggesUserName" onClick={HandleAccountRoute}>
              {user}
            </small>{" "}
          </>
        )}
        {islogin && (
          <>
            <Link href={"/myWishList"} className="wishlist_hoq_hide">
              <Tooltip title="Wishlist">
                <Badge
                  style={{ size: "2px" }}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "10px",
                      padding: "7px",
                      borderRadius: "4px",
                      marginRight: "7px",
                      marginTop: "-2px",
                      bgcolor: "#C20000",
                      width: 0,
                      height: 0,
                    },
                  }}
                  badgeContent={wishCountNum}
                  color="primary"
                >
                  <CiHeart className="wishlist_icon icons" />
                </Badge>
              </Tooltip>
            </Link>

            <Tooltip title="Search">
              <CiSearch
                className="search_icon icons mobile-search"
                onClick={open}
              />
            </Tooltip>
            <Badge
              style={{ size: "2px" }}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  padding: "7px",
                  borderRadius: "4px",
                  marginRight: "7px",
                  marginTop: "-2px",
                  bgcolor: "#C20000",
                  width: 0,
                  height: 0,
                },
              }}
              badgeContent={cartCountNum}
              color="primary"
            >
              <Tooltip title="Cart">
                <Link href={"/cartPage"}>
                  <PiBagSimpleThin
                    className="Cart_icon icons "
                  // onClick={() => setshowDrawer(!showDrawer)}   b2c drawer
                  />
                </Link>
              </Tooltip>
            </Badge>
          </>
        )}
        {/* {HaveItem.length !== 0 && <span className="have_item"></span>} */}
        {showDrawer && (
          <CartDrawer
            width={showDrawer}
            close={() => setshowDrawer(!showDrawer)}
          />
        )}
        {islogin ? (
          <Tooltip title="Logout" className="tooltip-logout">
            <button
              onClick={handleLogout}
              className="logout_btn_hoq icons"
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              <LogoutIcon className="logoout_h" />
            </button>
          </Tooltip>
        ) : (
          <Link href={"/LoginOption"}>
            <small style={{ fontSize: "1rem", fontWeight: "500" }}>
              <HiOutlineUserCircle size={32} />
            </small>
          </Link>
        )}
      </div>
    </>
  );
};
const NavbarRightSide2 = ({
  showDrawer,
  islogin,
  setshowDrawer,
  HaveItem,
  open,
  handleLogout,
  user,
  wishCountNum,
  cartCountNum,
  HandleAccountRoute,
}) => {
  return (
    <>
      <div className="nav_right">
        {!islogin && (
          <>
            <span className="loggedUser" onClick={HandleAccountRoute}>
              Hey ,
            </span>
            <small className="loggesUserName" onClick={HandleAccountRoute}>
              {user}
            </small>{" "}
          </>
        )}

        {islogin ? (
          <>
            {/* <Link to={"/myWishList"}>
              <Tooltip title="Wishlist">
                <Badge
                  style={{ size: "2px" }}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "10px",
                      padding: "7px",
                      borderRadius: "4px",
                      marginRight: "7px",
                      marginTop: "-2px",
                      bgcolor: "#C20000",
                      width: 0,
                      height: 0,
                    },
                  }}
                  badgeContent={wishCountNum}
                  color="primary"
                >
                  <CiHeart className="wishlist_icon icons" />
                </Badge>
              </Tooltip>
            </Link> */}

            <Tooltip title="Search">
              <CiSearch
                className="search_icon icons mobile-search"
                onClick={open}
              />
            </Tooltip>
          </>
        ) : (
          <Link
            href={"/LoginOption"}
            style={{
              fontWeight: "500",
            }}
          >
            Login
          </Link>
        )}

        {/* {HaveItem.length !== 0 && <span className="have_item"></span>} */}
      </div>
    </>
  );
};
const NavbarCenter = ({
  MainLogo,
  setisMobileMenu,
  isMobileMenu,
  navbarMenu,
  menuItems,
  handleMenu,
  logo,
  islogin,
  is500px,
  MobileLogo,
}) => {
  const isOpen = true;
  return (
    <>
      <div className="nav_center">
        <div
          className="logo"
          style={{
            //   marginTop: islogin ? "10px" : "30px",
            marginBottom: islogin ? "" : "-10px",
          }}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Link href={"/"}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={logo}
              alt=""
              onClick={() =>
                window.scrollTo({ behavior: "smooth", top: 0, left: 0 })
              }
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </Link>
        </div>
        <div className="navbar_menus">
          <div className="mobile-close">
            <IoClose size={32} onClick={() => setisMobileMenu(!isMobileMenu)} />
            <Link href="/myWishList">
              <CiHeart className="wishlist_icon_mobile icons" />
            </Link>
          </div>
          {islogin && (
            <>
              <ul className="lg_navbar_item">
                {menuItems?.map((menuItem, i) => {
                  const { menuname, param1 } = menuItem;

                  return (
                    <React.Fragment key={i}>
                      <li>
                        <span
                          onClick={() => {
                            handleMenu({
                              menuname: menuname,
                              key: menuItem?.param0name,
                              value: menuItem?.param0dataname,
                            });
                            window.scrollTo({
                              behavior: "smooth",
                              top: 0,
                              left: 0,
                            });
                          }}
                        >
                          {menuname}
                        </span>
                        {param1 && (
                          <IoChevronDown className="chevron-downn-mobile" />
                        )}
                        {param1 &&
                          param1?.length > 0 &&
                          param1[0].param1name !== "" && (
                            <ul className="submenu">
                              {param1[0].param1name === ""
                                ? "no"
                                : param1?.map(
                                  ({ param1dataname, param1name }, j) => (
                                    <li>
                                      <span
                                        onClick={() => {
                                          handleMenu(
                                            {
                                              menuname: menuname,
                                              key: menuItem?.param0name,
                                              value: menuItem?.param0dataname,
                                            },
                                            {
                                              key: param1name,
                                              value: param1dataname,
                                            }
                                          );
                                          window.scrollTo({
                                            behavior: "smooth",
                                            top: 0,
                                            left: 0,
                                          });
                                        }}
                                      >
                                        {param1dataname}
                                      </span>
                                      {/* {param2 && (
                                <ul className="sub_submenu">
                                  {param2?.map(
                                    ({ param2dataname, param2name }, j) => (
                                      <li>
                                        <span
                                          onClick={() =>
                                            handleMenu(
                                              {
                                                menuname: menuname,
                                                key: menuItem?.param0name,
                                                value: menuItem?.param0dataname,
                                              },
                                              {
                                                key: param1name,
                                                value: param1dataname,
                                              },
                                              {
                                                key: param2name,
                                                value: param2dataname,
                                              }
                                            )
                                          }
                                        >
                                          {param2dataname}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )} */}
                                    </li>
                                  )
                                )}
                            </ul>
                          )}
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            </>
          )}
          {isMobileMenu && (
            <TemporaryDrawer
              menuItems={menuItems}
              handleMenu={handleMenu}
              setisMobileMenu={setisMobileMenu}
              isMobileMenu={isMobileMenu}
            />
          )}
        </div>
      </div>
    </>
  );
};
const SearchBar = ({
  closeSearch,
  showSearchBar,
  searchText,
  setSearchText,
  searchDataFucn,
}) => {
  const searchInputRef = useRef(null);
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchText("");
    }
  }, [showSearchBar]);
  return (
    <>
      <div className="SearchBar-hoq">
        <IoSearchOutline size={28} color="grey" />
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search..."
          value={searchText}
          autoFocus
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={searchDataFucn}
        />
        <button className="cls_btn_search" onClick={closeSearch}>
          <TfiClose size={20} color="grey" />
        </button>
      </div>
      <div className="bg_search_overlay"></div>
    </>
  );
};
