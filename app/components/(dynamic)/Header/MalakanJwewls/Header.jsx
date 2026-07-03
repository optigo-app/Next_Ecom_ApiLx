"use client";


import React, { useEffect, useRef, useState } from "react";
import "./Header.modul.scss";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
 import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  Badge,
  ButtonBase,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import Cookies from "js-cookie";
import pako from "pako";
// import CartDrawer from "../../Cart/CartPageB2c/Cart";
 
 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useGlobalPreventSave from "@/app/(core)/utils/Glob_Functions/useGlobalPreventSave";
import { getSessionValue } from "@/app/(core)/hooks/useSession";


const Header = (hidden, storeinit, logos) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
//   const setCartOpenState = useSetRecoilState(mala_cartB2CDrawer);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isHeaderFixedDropShow, setIsHeaderFixedDropShow] = useState(false);
        const Router = useNextRouterLikeRR().push;
          const navigation = url => Router(url);
  const compnyLogo =  logos?.web;
  const compnyLogoM = logos?.mobile;
 
  const [menuData, setMenuData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const { islogin, loginUserDetail, setislogin, cartCountNum, wishCountNum } = useStore();
 

  const [searchText, setSearchText] = useState("");

  const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;
  const IsCartNo = storeinit?.CartNo;
  let cookie = Cookies.get("visiterId");

  const [serachsShowOverlay, setSerachShowOverlay] = useState(false);
  

  useGlobalPreventSave();

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

  // console.log("showtimejhjdhsjhjf", showTimer, countdown);

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

  useEffect(() => {
    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    if (
      storeinit?.IsB2BWebsite === 0 ||
      (storeinit?.IsB2BWebsite === 1 && isUserLogin === true)) {
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

  const getMenuApi = async () => {
    const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const { IsB2BWebsite } = storeInit;
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    await GetMenuAPI(finalID)
      .then((response) => {
        setMenuData(response?.Data?.rd);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    navigation("/");
    setislogin(false);
    Cookies.remove("userLoginCookie");
    Cookies.remove("visiterId");
    window.location.reload();
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
    // setSerachShowOverlay(!serachsShowOverlay);
    setSerachShowOverlay(prev => !prev);
  };

  const [drawerShowOverlay, setDrawerShowOverlay] = useState(false);
  const toggleDrawerOverlay = () => {
    setDrawerShowOverlay(!drawerShowOverlay);
  };

  const handelMenu = (param, param1, param2, event) => {


    if (
      event?.ctrlKey ||     // Ctrl key
      event?.shiftKey ||    // Shift key
      event?.metaKey ||     // Meta key (Command key on macOS)
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
        .filter(Boolean)
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
      const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(
        menuEncoded
      )}`;

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
    navigation(`/productpage`, {
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

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = pako.deflate(uint8Array, { to: "string" });

      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const searchDataFucn = (e) => {
    if (e.key === "Enter") {
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
        setDrawerShowOverlay(false);
        navigation(`/p/${searchText}?S=${encodeObj}`);
        setSearchText("");
        setSerachShowOverlay(false);
      }
    }
  };

  const clickSearch = () => {
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
      setDrawerShowOverlay(false);
      navigation(`/p/${searchText}?S=${encodeObj}`);
      setSearchText("");
      setSerachShowOverlay(false);
    }
  }

  // for cart drawer

//   const toggleCartDrawer = () => {
//     setIsCartOpen((prevState) => !prevState);
//     const isCartDrawerOpen = JSON.parse(sessionStorage.getItem("isCartDrawer"));
//     sessionStorage.setItem("isCartDrawer", !isCartDrawerOpen);
//     setCartOpenState((prevState) => !prevState);
//   };

  const handleContextMenu = (e) => { };

  const handleMouseDown = (e) => {
    // console.log("rrrrrrrrrrrrrrrrrrr", e);
    if (e.button === 1) {
    }
  };


  const hanldeStaticPageNavigation = (event, path) => {
    if (
      event?.ctrlKey ||
      event?.shiftKey ||
      event?.metaKey ||
      (event?.button && event?.button === 1)
    ) {
      return;
    } else {
      event?.preventDefault();
      navigation(path);
      window.scrollTo(0, 0);
    }
  }
  return (
    <div className="mala_headerMain_div" draggable={false} onContextMenu={(e) => e.preventDefault()}>
      {serachsShowOverlay && (
        <>
          <div className="mala_smlingSearchoverlay">
            <div className="mala_smlingTopSerachOver">
              <IoSearchOutline
                style={{ height: "25px", width: "25px", marginRight: "10px" }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                autoFocus
                onChange={(e) => setSearchText(e.target.value)}
                className="mala_serachinputBoxOverly"
                onKeyDown={searchDataFucn}
              />
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

          <div
            className={`mala_smlingSearchoverlayNew ${isHeaderFixedDropShow ? "fixed" : ""
              }`}
          >
            <div className="mala_smlingTopSerachOver-Fixed">
              <IoSearchOutline
                style={{ height: "15px", width: "15px", marginRight: "10px" }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                autoFocus
                onChange={(e) => setSearchText(e.target.value)}
                className="mala_serachinputBoxOverly"
                onKeyDown={searchDataFucn}
              />
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
                margin: "20px 10px 20px 7px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="mala_mobileHeader_top_div1"

              >
                <IoClose
                  size={38}
                  className="mala_close_icon"
                  style={{ marginLeft: "8px" }}
                  cursor={'pointer'}
                  onClick={toggleDrawerOverlay}
                />
              </div>
              {/* <div className="mala_mobileHeader_top_div2_web">
                <a href="/">
                  <img
                    src={compnyLogo}
                    loading="lazy"
                    className="mala_logo_header"
                  />
                </a>
              </div> */}

              {/* <div className="mala_mobileHeader_top_div2_mobile">
                <a href="/">
                  <img
                    src={compnyLogoM}
                    loading="lazy"
                    className="mala_logo_header"
                  />
                </a>
              </div> */}

              <div className="mala_mobileHeader_top_div3">
                {islogin && (
                  <>
                    <Badge
                      badgeContent={wishCountNum}
                      max={1000}
                      overlap={"rectangular"}
                      color="secondary"
                      className="badgeColorFix mala_mobileHideIcone"
                      style={{ marginInline: "15px" }}
                    >
                      <Tooltip title="WishList">
                        <li
                          className="nav_li_smining_Icone"
                          onClick={() => navigation("/myWishList")}
                        >
                          <FavoriteBorderIcon
                            style={{
                              height: "20px",
                              cursor: "pointer",
                              width: "20px",
                            }}
                          />
                        </li>
                      </Tooltip>
                    </Badge>
                    {/* <li
                      className="nav_li_smining_Icone mala_mobileHideIcone"
                      onClick={toggleOverlay}
                      style={{}}
                    >
                      <IoSearchOutline
                        style={{
                          height: "20px",
                          cursor: "pointer",
                          width: "20px",
                        }}
                      />
                    </li> */}
                    <Badge
                      badgeContent={cartCountNum}
                      max={1000}
                      overlap={"rectangular"}
                      color="secondary"
                      className="badgeColorFix"
                      style={{ marginInline: "15px" }}
                    >
                      <Tooltip title="Cart">
                        <li
                          onClick={IsCartNo == 3 ? toggleCartDrawer : () => { navigate("/cartPage"); setDrawerShowOverlay(false); }}
                          className="nav_li_smining_Icone"
                        >
                          <ShoppingCartOutlinedIcon
                            sx={{ height: "30px", width: "30px" }}
                          />
                        </li>
                      </Tooltip>
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <div className="mala_mobileMenuSubDivMain">
              {islogin && (
                <div
                  className="mlakna_mob_search"
                >
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="mobileSideBarSearch"
                    onKeyDown={searchDataFucn}
                  />
                  <IoSearchOutline
                    onClick={() => clickSearch()}
                    className="mala_mobile_search"
                  />
                </div>
              )}
              <List
                className="mala_ListMenuSiderMobile"
                sx={{ paddingTop: "0", marginBottom: "0px", marginTop: "15px" }}
              >
                {menuItems.map((menuItem, i) => (
                  <div key={menuItem.menuid || `menuItem.menuid-${i}`}>
                    <ButtonBase
                      component="div"
                      className="muilistMenutext"
                      onClick={() =>
                        handleLoginMenuClick(
                          menuItem.menuname,
                          null,
                          "iconclicked"
                        )
                      }
                      style={{ width: "100%" }}
                    >
                      <ListItem
                        className="mala_mobile_list_bar"
                      >
                        <p className="mala_menuStaicMobile">
                          {menuItem.menuname}
                        </p>
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
                            <button className="mala_mobile_viewAllBtn">
                              View All
                            </button>
                          </div>
                        </ButtonBase>
                        <List className="mala_mobileMenuScroll">
                          {menuItem.param1.map((subMenuItem, i) => (
                            <div key={`subMenuItem.param1dataid-${i}`}>
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
                                    }
                                  )
                                }
                                style={{ width: "100%" }}
                              >
                                <p
                                  className="malkan_sec_menu"
                                  style={{
                                    margin: "0px 0px 0px 15px",
                                    width: "100%",
                                    // color: "white",
                                  }}
                                >
                                  {subMenuItem.param1dataname}
                                </p>
                              </ButtonBase>
                              {/* {selectedSubMenu === subMenuItem.param1dataname && ( */}
                              {selectedMenu === menuItem.menuname && (
                                <>
                                  {/* <div style={{ paddingLeft: '10px' }}>
                                    <button class="underline-button" onClick={() => handleSubMenuClick(menuItem, subMenuItem.param1dataname, subMenuItem)}>View All</button>
                                  </div> */}
                                  <List
                                    style={{
                                      paddingTop: "0px",
                                      paddingBottom: "0px",
                                    }}
                                  >
                                    {subMenuItem.param2.map(
                                      (subSubMenuItem, i) => (
                                        <ButtonBase
                                          key={`subSubMenuItem.param2dataid-${i}`}
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
                                                value:
                                                  subMenuItem.param1dataname,
                                              },
                                              {
                                                key: subSubMenuItem.param2name,
                                                value:
                                                  subSubMenuItem.param2dataname,
                                              }
                                            )
                                          }
                                          style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "start",
                                          }}
                                        >
                                          <p className="mala_mobile_subMenu">
                                            {subSubMenuItem.param2dataname}
                                          </p>
                                        </ButtonBase>
                                      )
                                    )}
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
            {/* <div>
              <p className="mala_menuStaicMobilePage">About us</p>
            </div> */}

            {IsB2BWebsiteChek === 0 ? (
              <>
                {!islogin && (
                  <div>
                    <p
                      className="mala_menuStaicMobilePageLink"
                      style={{ cursor: "pointer" }}
                      onClick={() => { navigation("/LoginOption"); setDrawerShowOverlay(false); }}
                    >
                      LOG IN
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {!islogin && (
                  <div>
                    <p
                      className="mala_menuStaicMobilePageLink"
                      style={{ cursor: "pointer" }}
                      onClick={() => { navigation("/LoginOption"); setDrawerShowOverlay(false); }}
                    >
                      LOG IN
                    </p>
                  </div>
                )}
              </>
            )}

            {/* {IsB2BWebsiteChek === 1 ? (
              islogin === true ? (
                <div>
                  <p
                    className="mala_menuStaicMobilePageLink"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      setDrawerShowOverlay(false);
                      navigation("/myWishList");
                    }}
                  >
                    WishList
                  </p>
                </div>
              ) : (
                ""
              )
            ) : (
              <div>
                <p
                  className="mala_menuStaicMobilePageLink"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    setDrawerShowOverlay(false);
                    navigation("/myWishList");
                  }}
                >
                  WishList
                </p>
              </div>
            )} */}

            {IsB2BWebsiteChek === 1 ? (
              islogin === true ? (
                <>
                  {storeinit?.IsDesignSetInMenu == 1 &&
                    <p
                      className="mala_menuStaicMobilePageLink"
                      style={{ marginTop: "10px" }}
                      onClick={() => {
                        setDrawerShowOverlay(false);
                        navigation("/Lookbook");
                      }}
                    >
                      {storeinit?.DesignSetInMenu}
                    </p>
                  }
                </>
              ) : (
                ""
              )
            ) : (
              <>
                {storeinit?.IsDesignSetInMenu == 1 &&
                  <p
                    className="mala_menuStaicMobilePageLink"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      setDrawerShowOverlay(false);
                      navigation("/Lookbook");
                    }}
                  >
                    {storeinit?.DesignSetInMenu}
                  </p>
                }
              </>
            )}

            {
              islogin && <div>
                <p
                  className="mala_menuStaicMobilePageLink"
                  onClick={() => {
                    setDrawerShowOverlay(false);
                    navigation("/account");
                  }}
                >
                  Account
                </p>
              </div>
            }

            {/* <div>
              <p
                className="mala_menuStaicMobilePageLink"
                onClick={() => {
                  setDrawerShowOverlay(false);
                  handleLogout();
                }}
              >
                Log Out
              </p>
            </div> */}

            {islogin && (
              <>
                <div>
                  <p
                    className="mala_menuStaicMobilePageLink"
                    onClick={() => {
                      setDrawerShowOverlay(false);
                      handleLogout();
                    }}
                  >
                    Log Out
                  </p>
                </div>
              </>
            )}


          </div>
        </>
      )}

      <div className="mala_Top_header">

        <div className="mala_Top_header_sub">
          <div className="mala_Top_header_logo_div">

            {/* Privaa don't need this */}
            {/* {location?.pathname !== '/' && ( */}
            <>
              <a href="/" className="mala_logo_header_webLogo"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={compnyLogo}
                  loading="lazy"
                  className="mala_logo_header"
                  alt="compnyLogo-DESKTOP"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </a>

              <a href="/" className="mala_logo_header_Mobile"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={compnyLogoM}
                  loading="lazy"
                  className="mala_logo_header"
                  alt="compnyLogo-MOBILE"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </a>
            </>
            {/* )} */}

            <span className="nav_ul_shop_menu_Mobile">
              <MenuIcon
                style={{ fontSize: "45px" }}
                className="muIconeMobileHeader"
                onClick={toggleDrawerOverlay}
              />
            </span>
          </div>
          <div className="mala_Top_header_menu_main">
            <div className="mala_Top_header_menu_main">
              {/* <ul className="nav_ul_shop">
                <li
                  className="nav_li_smining nav_li_smining_Mobile"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => hanldeStaticPageNavigation(event, "/ExpertAdvice")}
                >
                  <a href="/ExpertAdvice" className="stam_A_link">
                    EXPERT ADVICE
                  </a>
                </li>
                <li
                  className="nav_li_smining nav_li_smining_Mobile"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => hanldeStaticPageNavigation(event, "/FunFact")}
                >
                  <a href="/FunFact" className="stam_A_link">
                    FUN FACT
                  </a>
                </li>
              </ul> */}

              <ul className="nav_ul_shop">


                <li
                  className="nav_li_smining nav_li_smining_Mobile"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => hanldeStaticPageNavigation(event, "/")}
                >
                  <a href="/" className="stam_A_link">
                    HOME
                  </a>
                </li>

                {IsB2BWebsiteChek == 1 ? (
                  islogin == true ? (
                    <li
                      className="nav_li_smining_shop"
                      onMouseEnter={handleDropdownOpen}
                      onMouseLeave={handleDropdownClose}
                    >
                      <span
                        className="nav_li_smining_shop"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          // For privaa
                          // color: location?.pathname !== "/" ? "#6a6969" : "#fff"
                        }}
                      >
                        SHOP
                        <RiArrowDropDownLine
                          style={{ width: "20px", height: "20px" }}
                        />
                      </span>
                    </li>
                  ) : (
                    ""
                  )
                ) : (
                  <li
                    className="nav_li_smining"
                    onMouseEnter={handleDropdownOpen}
                    onMouseLeave={handleDropdownClose}
                  >
                    <span
                      className="nav_li_smining"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        // For privaa
                        // color: location?.pathname !== "/" ? "#6a6969" : "inherit"
                      }}
                    >
                      SHOP
                      <RiArrowDropDownLine
                        style={{ width: "20px", height: "20px" }}
                      />
                    </span>
                  </li>
                )}

                {/* <li
                  className="nav_li_smining nav_li_smining_Mobile"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => hanldeStaticPageNavigation(event, "/servicePolicy")}
                >
                  <a href="/servicePolicy" className="stam_A_link">
                    SERVICE POLICY
                  </a>
                </li> */}

                {/* <li
                  className="nav_li_smining nav_li_smining_Mobile"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => hanldeStaticPageNavigation(event, "/aboutUs")}
                >
                  <a href="/aboutUs" className="stam_A_link">
                    ABOUT US
                  </a>
                </li> */}

                {IsB2BWebsiteChek === 1 ? (
                  islogin === true ? (
                    <>
                      {storeinit?.IsDesignSetInMenu == 1 &&
                        <li
                          className="nav_li_smining nav_li_smining_Mobile"
                          style={{ cursor: "pointer", textTransform: "uppercase" }}
                          onClick={(event) => hanldeStaticPageNavigation(event, "/Lookbook")}
                        >
                          {storeinit?.DesignSetInMenu}
                        </li>
                      }
                    </>
                  ) : (
                    ""
                  )
                ) : (
                  <>
                    {storeinit?.IsDesignSetInMenu == 1 &&
                      <li
                        className="nav_li_smining nav_li_smining_Mobile"
                        style={{ cursor: "pointer", textTransform: "uppercase" }}
                        onClick={(event) => hanldeStaticPageNavigation(event, "/Lookbook")}
                      >
                        {storeinit?.DesignSetInMenu}
                      </li>
                    }
                  </>
                )}

                {islogin && <li
                  className="nav_li_smining nav_li_smining_Mobile"
                  // For privaa
                  // style={{ cursor: "pointer", color: location?.pathname !== "/" ? "#6a6969" : "#fff" }}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigation("/account")}
                >
                  {/* <a href="/account" className="stam_A_link"> */}
                  ACCOUNT
                  {/* </a> */}
                </li>
                }

                {!islogin && (
                  <li
                    className="nav_li_smining"
                    // For privaa
                    // style={{ cursor: "pointer", color: location?.pathname !== "/" ? "#6a6969" : "#fff" }}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigation("/LoginOption")}
                  >
                    LOG IN
                  </li>
                )}
                {islogin && (
                  <li
                    className="nav_li_smining"
                    // For privaa
                    // style={{ cursor: "pointer", color: location?.pathname !== "/" ? "#6a6969" : "#fff" }}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLogout()}
                  >
                    LOG OUT
                  </li>
                )}

                {IsB2BWebsiteChek == 0 ? (
                  <>

                    <li
                      className="nav_li_smining_Icone mala_mobileHideIcone"
                      onClick={toggleOverlay}
                    >
                      <IoSearchOutline
                        style={{
                          height: "20px",
                          cursor: "pointer",
                          width: "20px",
                        }}
                        className="malkan_logo_nav"
                      />
                    </li>
                    <Badge
                      badgeContent={wishCountNum}
                      max={1000}
                      overlap={"rectangular"}
                      color="secondary"
                      className="badgeColorFix mala_mobileHideIcone"
                    >
                      <Tooltip title="WishList">
                        <li
                          className="nav_li_smining_Icone"
                          onClick={() => navigation("/myWishList")}
                        >
                          <FavoriteBorderIcon
                            style={{
                              height: "20px",
                              cursor: "pointer",
                              width: "20px",
                            }}
                            className="malkan_logo_nav"
                          />
                        </li>
                      </Tooltip>
                    </Badge>
                    <Badge
                      badgeContent={cartCountNum}
                      max={1000}
                      overlap={"rectangular"}
                      color="secondary"
                      className="badgeColorFix"
                    >
                      <Tooltip title="Cart">
                        <li
                          onClick={IsCartNo == 3 ? toggleCartDrawer : () => { navigate("/cartPage"); setDrawerShowOverlay(false); }}
                          className="nav_li_smining_Icone"
                        >
                          <ShoppingCartOutlinedIcon
                            sx={{ height: "20px", width: "20px" }}
                            className="malkan_logo_nav"
                          />
                        </li>
                      </Tooltip>
                    </Badge>
                  </>
                ) : (
                  islogin && (
                    <>
                      <li
                        className="nav_li_smining_Icone mala_mobileHideIcone"
                        onClick={toggleOverlay}
                      >
                        <IoSearchOutline
                          className="malkan_logo_nav"
                          style={{
                            height: "20px",
                            cursor: "pointer",
                            width: "20px",
                          }}
                        />
                      </li>
                      <Badge
                        badgeContent={wishCountNum}
                        max={1000}
                        overlap={"rectangular"}
                        color="secondary"
                        className="badgeColorFix mala_mobileHideIcone"
                      >
                        <Tooltip title="WishList">
                          <li
                            className="nav_li_smining_Icone"
                            onClick={() => navigation("/myWishList")}
                          >
                            <FavoriteBorderIcon
                              className="malkan_logo_nav"
                              style={{
                                height: "20px",
                                cursor: "pointer",
                                width: "20px",
                              }}
                            />
                          </li>
                        </Tooltip>
                      </Badge>

                      <Badge
                        badgeContent={cartCountNum}
                        max={1000}
                        overlap={"rectangular"}
                        color="secondary"
                        className="badgeColorFix"
                      >
                        <Tooltip title="Cart">
                          <li
                            onClick={IsCartNo == 3 ? toggleCartDrawer : () => { navigate("/cartPage"); setDrawerShowOverlay(false); }}
                            className="nav_li_smining_Icone"
                          >
                            <ShoppingCartOutlinedIcon
                              sx={{ height: "22px", width: "22px" }}
                              className="malkan_logo_nav"
                            />
                          </li>
                        </Tooltip>
                      </Badge>
                    </>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        <div
          onMouseEnter={handleDropdownOpen}
          onMouseLeave={handleDropdownClose}
          className={`shop-dropdown ${isDropdownOpen ? "open" : ""}`}
          style={{ backgroundColor: isHeaderFixed && "transparent" }}
        >
          <div
            ref={divRef}
            style={{
              display: "flex",
              padding: "25px",
              gap: "50px",
              justifyContent: "space-between",
            }}
            className="mala_showDropOptionMainDiv"
            onMouseEnter={handleDropdownOpen}
            onMouseLeave={handleDropdownClose}
          >
            <div style={{ display: "flex" }}>
              {menuItems.map((menuItem, i) => (
                <div
                  key={`menuItems-col-1-${i}`}
                  className="mala_headerOptionSingleDiv"
                >
                  <ButtonBase
                    component="div"
                    onClick={(e) =>
                      handelMenu({
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
                    <a
                      href={`/p/${menuItem?.menuname}/?M=${btoa(
                        `${menuItem?.param0dataname}/${menuItem?.param0name}`
                      )}`}
                      className="mala_menuSubTitle"
                    // onClick={() =>
                    //   handelMenu({
                    //     menuname: menuItem?.menuname,
                    //     key: menuItem?.param0name,
                    //     value: menuItem?.param0dataname,
                    //   })
                    // }
                    >
                      <p className="muilistMenutext">{menuItem.menuname}</p>
                    </a>
                  </ButtonBase>
                  <>
                    {/* <ButtonBase
                      component="div"
                      style={{ display: 'flex', justifyContent: 'start' }}
                    >
                      <div style={{ paddingLeft: '10px', fontSize: '15px', marginTop: '5px' }}>
                        <button className="mala_underline_button" onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname })}>view all</button>
                      </div>
                    </ButtonBase> */}
                    <List className="mala_listMain">
                      {menuItem.param1.map((subMenuItem, i) => (
                        <div key={`menuItems-${i}`}>
                          <ButtonBase
                            component="div"
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "start",
                              height: "25px",
                            }}
                            onClick={(e) => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname }, {}, e)}
                          >
                            {/* <a href='#' className='mala_menuSubTitle'> */}
                            <a
                              href={`/p/${menuItem?.menuname}/${menuItem?.param0dataname}/${subMenuItem.param1dataname
                                }/?M=${btoa(
                                  `${menuItem?.param0dataname},${subMenuItem.param1dataname}/${menuItem?.param0name},${subMenuItem.param1name}`
                                )}`}
                              className="mala_menuSubTitle"

                            // onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname })}
                            >
                              <p
                                style={{
                                  margin: "0px 0px 0px 6px",
                                  fontWeight: 500,
                                  textDecoration: 'underline',
                                }}
                              >
                                {subMenuItem.param1dataname}
                              </p>
                            </a>
                          </ButtonBase>
                          <List
                            style={{
                              paddingTop: "0px",
                              paddingBottom: "0px",
                            }}
                          >
                            {subMenuItem.param2.map((subSubMenuItem, i) => (
                              <div
                                key={`SubSubMenuItem-list-${i}`}
                                component="div"
                                style={{ width: "100%" }}
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
                                <a
                                  href={`/p/${menuItem?.menuname}/${menuItem?.param0dataname}/${subMenuItem.param1dataname
                                    }/${subSubMenuItem.param2dataname
                                    }/?M=${btoa(
                                      `${menuItem?.param0dataname},${subMenuItem.param1dataname},${subSubMenuItem.param2dataname}/${menuItem?.param0name},${subMenuItem.param1name},${subSubMenuItem.param2name}`
                                    )}`}
                                  className="mala_menuSubTitle"
                                // onClick={() =>
                                //   handelMenu(
                                //     {
                                //       menuname: menuItem?.menuname,
                                //       key: menuItem?.param0name,
                                //       value: menuItem?.param0dataname,
                                //     },
                                //     {
                                //       key: subMenuItem.param1name,
                                //       value: subMenuItem.param1dataname,
                                //     },
                                //     {
                                //       key: subSubMenuItem.param2name,
                                //       value: subSubMenuItem.param2dataname,
                                //     }
                                //   )
                                // }
                                >
                                  {/* <ListItem key={subSubMenuItem.param2dataid} style={{ paddingLeft: '0px', paddingTop: '0px', paddingBottom: '0px' }}> */}
                                  <p className="muilist2ndSubMenutext">
                                    {subSubMenuItem.param2dataname}
                                  </p>
                                  {/* </ListItem> */}
                                </a>
                              </div>
                            ))}
                          </List>
                        </div>
                      ))}
                      <p
                        className="mala_underline_button"
                        onClick={() =>
                          handelMenu({
                            menuname: menuItem?.menuname,
                            key: menuItem?.param0name,
                            value: menuItem?.param0dataname,
                          })
                        }
                      >
                        view all
                      </p>
                    </List>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {IsCartNo == 3 &&
        <CartDrawer open={isCartOpen} />
      }
    </div>
  );
};

export default Header;
