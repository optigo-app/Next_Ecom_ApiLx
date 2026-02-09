"use client"
import React, { useEffect, useState } from 'react'
import { RiArrowDropDownLine } from "react-icons/ri";
import { Badge, ButtonBase, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import { GetMenuAPI } from '@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI';
import { PiStarThin } from "react-icons/pi";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import './Header2.modul.scss';
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useRouter } from "next/navigation";


const Header2 = ({ storeinit, logos }) => {
    console.log("🚀 ~ Header2 ~ logos:", logos)
    const { islogin, setislogin, cartCountNum, setCartCountNum, wishCountNum, setWishCountNum, setCartOpenStateB2C } = useStore();
    const [isHeaderFixed, setIsHeaderFixed] = useState(false);
    const [isHeaderFixedDropShow, setIsHeaderFixedDropShow] = useState(false);

    const compnyLogo = storeinit?.companylogo;
    const compnyLogoM = storeinit?.companyMlogo;

    const [menuData, setMenuData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    let navigate = useNextRouterLikeRR();

    const [serachsShowOverlay, setSerachShowOverlay] = useState(false);
    const navigation = useNextRouterLikeRR();

    const getMenuApi = async () => {
        await GetMenuAPI().then((response) => {
            setMenuData(response?.Data?.rd)
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        const uniqueMenuIds = [...new Set(menuData?.map(item => item?.menuid))];

        const uniqueMenuItems = uniqueMenuIds.map(menuid => {
            const item = menuData?.find(data => data?.menuid === menuid);
            const param1DataIds = [...new Set(menuData?.filter(data => data?.menuid === menuid)?.map(item => item?.param1dataid))];

            const param1Items = param1DataIds.map(param1dataid => {
                const param1Item = menuData?.find(data => data?.menuid === menuid && data?.param1dataid === param1dataid);
                const param2Items = menuData?.filter(data => data?.menuid === menuid && data?.param1dataid === param1dataid)?.map(item => ({
                    param2dataid: item?.param2dataid,
                    param2dataname: item?.param2dataname,
                    param2id: item?.param2id,
                    param2name: item?.param2name
                }));
                return {
                    menuname: param1Item?.menuname,
                    param1dataid: param1Item?.param1dataid,
                    param1dataname: param1Item?.param1dataname,
                    param1id: param1Item?.param1id,
                    param1name: param1Item?.param1name,
                    param2: param2Items
                };
            });

            return {
                menuid: item?.menuid,
                menuname: item?.menuname,
                param0dataid: item?.param0dataid,
                param0dataname: item?.param0dataname,
                param0id: item?.param0id,
                param0name: item?.param0name,
                param1: param1Items
            };
        });

        setMenuItems(uniqueMenuItems);
    }, [menuData]);

    const fetchData = () => {
        const value = JSON.parse(sessionStorage.getItem('LoginUser'));
        setislogin(value);
    };


    useEffect(() => {
        let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
        let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));

        console.log("callll");

        if (storeinit?.IsB2BWebsite === 0) {
            getMenuApi();
            return;
        } else if (storeinit?.IsB2BWebsite === 1 && isUserLogin === true) {
            getMenuApi();
            return;
        } else {
            return;
        }

    }, [islogin]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsHeaderFixed(scrollPosition > 100);
            setIsHeaderFixedDropShow(scrollPosition > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    const handleLogout = () => {
        setislogin(false);
        sessionStorage.setItem('LoginUser', false);
        sessionStorage.removeItem('storeInit');
        sessionStorage.removeItem('loginUserDetail');
        sessionStorage.removeItem('remarks');
        sessionStorage.removeItem('selectedAddressId');
        sessionStorage.removeItem('orderNumber');
        sessionStorage.removeItem('registerEmail');
        sessionStorage.removeItem('UploadLogicalPath');
        sessionStorage.removeItem('remarks');
        sessionStorage.removeItem('registerMobile');
        sessionStorage.removeItem('allproductlist');
        window.location.href = "/";
    }


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownOpen = () => {
        setIsDropdownOpen(true);
    };


    const handleDropdownClose = () => {
        setIsDropdownOpen(false);
    };

    const toggleOverlay = () => {
        // setSearchText('');
        setSerachShowOverlay(!serachsShowOverlay);
    };

    const [drawerShowOverlay, setDrawerShowOverlay] = useState(false);
    const toggleDrawerOverlay = () => {
        setDrawerShowOverlay(!drawerShowOverlay);
    };

    const handelMenu = (param, param1, param2) => {

        let finalData = {
            "menuname": param?.menuname ?? "",
            "FilterKey": param?.key ?? "",
            "FilterVal": param?.value ?? "",
            "FilterKey1": param1?.key ?? "",
            "FilterVal1": param1?.value ?? "",
            "FilterKey2": param2?.key ?? "",
            "FilterVal2": param2?.value ?? ""
        }

        sessionStorage.setItem("menuparams", JSON.stringify(finalData))

        const queryParameters = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join('/');

        const otherparamUrl = Object.entries({
            b: finalData?.FilterKey,
            g: finalData?.FilterKey1,
            c: finalData?.FilterKey2,
        })
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value)
            .filter(Boolean)
            .join('&');

        const paginationParam = [
            `page=${finalData.page ?? 1}`,
            `size=${finalData.size ?? 50}`
        ].join('&');
        const url = `/p/${queryParameters}/${otherparamUrl}/${paginationParam}`;
        handleDropdownClose()
        navigate(url)
    }

    //mobileMenu.................
    const [selectedMenu, setSelectedMenu] = useState(null);

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
        let finalData = {
            menuname: menuDataObj?.menuname ?? "",
            FilterKey: menuDataObj.param0name ?? "",
            FilterVal: menuDataObj.param0dataname ?? "",
            FilterKey1: menuDataObj?.param1name ?? "",
            FilterVal1: menuDataObj?.param1dataname ?? "",
            FilterKey2: menuDataObj?.param2name ?? "",
            FilterVal2: menuDataObj?.param2dataname ?? ""
        }

        navigation(`/productpage`, { state: { menuFlag: finalData?.menuname, filtervalue: finalData } })
        // if (finalData) {
        //   let resData;
        //   await productListApiCall(finalData).then((res) => {
        //     if (res) {
        //       resData = res;
        //       setMenutransData(res)
        //       sessionStorage.setItem("allproductlist", JSON.stringify(res))
        //       sessionStorage.setItem("finalAllData", JSON.stringify(res))
        //     }
        //     return res
        //   }).then(async (res) => {
        //     if (res) {
        //       let autoCodeList = JSON.parse(sessionStorage.getItem("autoCodeList"))
        //       await getDesignPriceList(finalData, 1, {}, {}, autoCodeList).then((res) => {
        //         if (res) {
        //           sessionStorage.setItem("getPriceData", JSON.stringify(res))
        //         }

        //       })
        //     }
        //   }).catch((err) => {
        //     if (err) {
        //       toast.error("Something Went Wrong!!");
        //     }
        //   })
        //   await FilterListAPI(finalData)

        // }
        sessionStorage.setItem('menuparams', JSON.stringify(finalData));
    };
    useEffect(() => {
        GetCountAPI().then((res) => {
            if (res) {
                setCartCountNum(res?.cartcount)
                setWishCountNum(res?.wishcount)
            }
        }).catch((err) => {
            if (err) {
                console.log("getCountApiErr", err);
            }
        })
    }, [])


    return (
        <div className='smr_header2_mainDiv'>

            {serachsShowOverlay && (
                <>
                    <div className="smr_smlingSearchoverlay">
                        <div className="smr_smlingTopSerachOver">
                            <IoSearchOutline style={{ height: "15px", width: "15px", marginRight: "10px" }} />
                            <input
                                type="text"
                                placeholder="Enter Design Number End Click Enter"
                                // value={searchText}
                                autoFocus
                                // onChange={(e) => setSearchText(e.target.value)}
                                className="smr_serachinputBoxOverly"
                            // onKeyDown={searchDataFucn}
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

                    <div className={`smr_smlingSearchoverlayNew ${isHeaderFixedDropShow ? "fixed" : ""}`}>
                        <div className="smr_smlingTopSerachOver-Fixed">
                            <IoSearchOutline style={{ height: "15px", width: "15px", marginRight: "10px" }} />
                            <input
                                type="text"
                                placeholder="Enter Design Number End Click Enter"
                                // value={searchText}
                                autoFocus
                                // onChange={(e) => setSearchText(e.target.value)}
                                className="smr_serachinputBoxOverly"
                            // onKeyDown={searchDataFucn}
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
                        <div style={{ margin: '10px 20px' }}>
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
                        <div>
                            <List className='smr_ListMenuSiderMobile' sx={{ paddingTop: '0', marginBottom: '0px', marginTop: '15px' }}>
                                {menuItems.map(menuItem => (
                                    <div key={menuItem.menuid}>
                                        <ButtonBase
                                            component="div"
                                            className="muilistMenutext"
                                            style={{ width: '100%' }}
                                        >
                                            <ListItem style={{ padding: '5px', borderBottom: '1px solid white' }}>
                                                <p className='smr_menuStaicMobile'>{menuItem.menuname}</p>
                                            </ListItem>
                                        </ButtonBase>
                                        {selectedMenu === menuItem.menuname && (
                                            <>
                                                <ButtonBase
                                                    component="div"
                                                    onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname })}
                                                    style={{ width: '100%', display: 'flex', justifyContent: 'start' }}
                                                >
                                                    <div style={{ paddingLeft: '10px', fontSize: '15px', marginTop: '5px' }}>
                                                        <button className="underline-button">view all</button>
                                                    </div>
                                                </ButtonBase>
                                                <List>
                                                    {menuItem.param1.map(subMenuItem => (
                                                        <div key={subMenuItem.param1dataid}>
                                                            <ButtonBase
                                                                component="div"
                                                                onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname })}
                                                                style={{ width: '100%' }}
                                                            >
                                                                <p style={{ margin: '0px 0px 0px 15px', width: '100%' }}>{subMenuItem.param1dataname}</p>
                                                            </ButtonBase>
                                                            {/* {selectedSubMenu === subMenuItem.param1dataname && ( */}
                                                            {selectedMenu === menuItem.menuname && (
                                                                <>
                                                                    {/* <div style={{ paddingLeft: '10px' }}>
                                    <button class="underline-button" onClick={() => handleSubMenuClick(menuItem, subMenuItem.param1dataname, subMenuItem)}>View All</button>
                                  </div> */}
                                                                    <List style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                                                        {subMenuItem.param2.map(subSubMenuItem => (
                                                                            <ButtonBase
                                                                                component="div"
                                                                                onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname }, { "key": subSubMenuItem.param2name, "value": subSubMenuItem.param2dataname })}
                                                                                style={{ width: '100%' }}
                                                                            >
                                                                                <ListItem key={subSubMenuItem.param2dataid} style={{ paddingLeft: '30px', paddingTop: '0px', paddingBottom: '0px' }}>
                                                                                    <ListItemText primary={subSubMenuItem.param2dataname} className="muilist2ndSubMenutext" />
                                                                                </ListItem>
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
                            <p className='smr_menuStaicMobilePage'>About us</p>
                        </div>

                        <div>
                            <p className='smr_menuStaicMobilePageLink' style={{ marginTop: '10px' }}>WishList</p>
                        </div>

                        <div>
                            <p className='smr_menuStaicMobilePageLink'>Account</p>
                        </div>
                    </div>
                </>
            )}

            <div className='smiling_Top_header'>
                <div className='smiling_Top_header_sub'>
                    <div className='smiling_Top_header_div2'>
                        <a href="/">
                            <img src={compnyLogo} loading='lazy' className='smr_logo_header' />
                        </a>
                    </div>
                    <div className='smiling_Top_header_div1'>
                        <ul className="nav_ul_shop">

                            <li
                                className="nav_li_smining nav_li_smining_shop"
                                onMouseEnter={handleDropdownOpen}
                                onMouseLeave={handleDropdownClose}
                            >
                                <span
                                    className="nav_li_smining"
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    SHOP
                                    <RiArrowDropDownLine
                                        style={{ width: "20px", height: "20px" }}
                                    />
                                </span>
                            </li>

                            <li
                                className="nav_li_smining nav_li_smining_Mobile"
                                style={{ cursor: "pointer" }}
                                onClick={() => { navigation('/servicePolicy'); window.scrollTo(0, 0); }}
                            >
                                {/* IMPACT */}
                                SERVICE POLICY
                            </li>

                            <li
                                className="nav_li_smining nav_li_smining_Mobile"
                                style={{ cursor: "pointer" }}
                                onClick={() => { navigation('/ExpertAdvice'); window.scrollTo(0, 0); }}
                            >
                                EXPERT ADVICE
                            </li>

                            <li
                                className="nav_li_smining nav_li_smining_Mobile"
                                style={{ cursor: "pointer" }}
                                onClick={() => { navigation('/FunFact'); window.scrollTo(0, 0); }}
                            >
                                FUN FACT
                            </li>

                            <li
                                className="nav_li_smining nav_li_smining_Mobile"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigation("/aboutUs")}
                            >
                                ABOUT US
                            </li>
                        </ul>
                        <ul className="nav_ul_shop_menu_Mobile">
                            <MenuIcon
                                style={{ fontSize: "35px", color: "white" }}
                                className="muIconeMobileHeader"
                                onClick={toggleDrawerOverlay}
                            />
                        </ul>
                    </div>

                    <div className='smiling_Top_header_div3'>
                        <ul className="nav_ul_shop">


                            {islogin ? (
                                <>
                                    <li
                                        className="nav_li_smining nav_li_smining_Mobile"
                                        style={{ cursor: "pointer" }}
                                    >
                                        ACCOUNT
                                    </li>

                                    <li
                                        className="nav_li_smining nav_li_smining_Mobile"
                                        style={{ cursor: "pointer" }}
                                        onClick={handleLogout}
                                    >
                                        LOG OUT
                                    </li>
                                </>

                            ) : (
                                <li
                                    className="nav_li_smining"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigation("/LoginOption")}
                                >
                                    LOG IN
                                </li>
                            )}

                            {islogin &&
                                <>
                                    <Badge
                                        badgeContent={wishCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        className='badgeColorFix'

                                    >
                                        <Tooltip title="WishList">
                                            <li
                                                className="nav_li_smining_Icone"
                                                onClick={() => navigation("/myWishList")}>
                                                <PiStarThin
                                                    style={{
                                                        height: "20px",
                                                        cursor: "pointer",
                                                        width: "20px",
                                                    }}
                                                />
                                            </li>
                                        </Tooltip>
                                    </Badge>
                                    <li
                                        className="nav_li_smining_Icone"
                                        onClick={toggleOverlay} style={{}}>
                                        <IoSearchOutline
                                            style={{ height: "20px", cursor: "pointer", width: "20px" }}
                                        />
                                    </li>
                                    <Badge
                                        badgeContent={cartCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        className='badgeColorFix'
                                    >
                                        <Tooltip title="Cart">
                                            <li
                                                onClick={() => { navigate('/cartPage') }}
                                                className="nav_li_smining_Icone"
                                            >
                                                <ShoppingCartOutlinedIcon
                                                    sx={{ height: '30px', width: '30px' }}
                                                />
                                            </li>
                                        </Tooltip>
                                    </Badge>
                                </>
                            }


                        </ul>
                    </div>
                </div>

                <div
                    className={`Smining-Top-Header-fixed-main ${isHeaderFixed ? "fixed" : ""}  ${serachsShowOverlay ? "searchoverly" : ""}`}
                >
                    <div className='smiling_Top_header_sub' style={{ width: '100%' }}>
                        <div className='smiling_Top_header_div2'>
                            <a href="/">
                                <img src={compnyLogo} loading='lazy' className='smr_logo_header_Fixed' />
                            </a>
                        </div>
                        <div className='smiling_Top_header_div1'>
                            <ul className="nav_ul_shop">
                                {/* {islogin && */}
                                <li
                                    className="nav_li_smining_Fixed nav_li_smining_shop"
                                    onMouseEnter={handleDropdownOpen}
                                    onMouseLeave={handleDropdownClose}
                                >
                                    <span
                                        className="nav-li-smining"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        SHOP
                                        <RiArrowDropDownLine
                                            style={{ width: "20px", height: "20px" }}
                                        />
                                    </span>
                                </li>

                                <li
                                    className="nav_li_smining_Fixed nav_li_smining_Mobile"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => { navigation('/servicePolicy'); window.scrollTo(0, 0); }}
                                >
                                    SERVICE POLICY
                                </li>

                                <li
                                    className="nav_li_smining_Fixed nav_li_smining_Mobile"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => { navigation('/ExpertAdvice'); window.scrollTo(0, 0); }}
                                >
                                    EXPERT ADVICE
                                </li>

                                <li
                                    className="nav_li_smining_Fixed nav_li_smining_Mobile"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => { navigation('/FunFact'); window.scrollTo(0, 0); }}
                                >
                                    FUN FACT
                                </li>

                                <li
                                    className="nav_li_smining_Fixed nav_li_smining_Mobile"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigation("/aboutUs")}
                                >
                                    ABOUT US
                                </li>

                                <ul className="nav_ul_shop_menu_Mobile">
                                    <MenuIcon
                                        style={{ fontSize: "35px", color: "#7d7f85" }}
                                        className="muIconeMobileHeader"
                                        onClick={toggleDrawerOverlay}
                                    />
                                </ul>
                                {/* } */}
                            </ul>
                        </div>

                        <div className='smiling_Top_header_div3'>
                            <ul className="nav_ul_shop">

                                {islogin ? (
                                    <>
                                        <li
                                            className="nav_li_smining_Fixed nav_li_smining_Mobile"
                                            style={{ cursor: "pointer" }}
                                        // onClick={() => navigation("/LoginOption")}
                                        >
                                            ACCOUNT
                                        </li>

                                        <li
                                            className="nav_li_smining_Fixed nav_li_smining_Mobile"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleLogout}
                                        >
                                            LOG OUT
                                        </li>
                                    </>

                                ) : (
                                    <li
                                        className="nav_li_smining_Fixed"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigation("/LoginOption")}
                                    >
                                        LOG IN
                                    </li>
                                )}


                                {islogin &&
                                    <>
                                        <Badge
                                            badgeContent={wishCountNum}
                                            max={1000}
                                            overlap={"rectangular"}
                                            color="secondary"
                                            className='badgeColor'
                                        >
                                            <Tooltip title="WishList">
                                                <li
                                                    className="nav_li_smining_Fixed_Icone"
                                                    onClick={() => navigation("/myWishList")}>
                                                    <PiStarThin
                                                        style={{
                                                            height: "20px",
                                                            cursor: "pointer",
                                                            width: "20px",
                                                        }}
                                                    />
                                                </li>
                                            </Tooltip>
                                        </Badge>
                                        <li
                                            className="nav_li_smining_Fixed_Icone"
                                            onClick={toggleOverlay} style={{}}>
                                            <IoSearchOutline
                                                style={{ height: "20px", cursor: "pointer", width: "20px" }}
                                            />
                                        </li>
                                        <Badge
                                            badgeContent={cartCountNum}
                                            max={1000}
                                            overlap={"rectangular"}
                                            color="secondary"
                                            className='badgeColor'
                                        >
                                            <Tooltip title="Cart">
                                                <li
                                                    onClick={() => { navigate('/cartPage') }}
                                                    className="nav_li_smining_Fixed_Icone"
                                                >
                                                    <ShoppingCartOutlinedIcon
                                                        sx={{ height: '30px', width: '30px' }}
                                                    />
                                                </li>
                                            </Tooltip>
                                        </Badge>
                                    </>
                                }

                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    onMouseEnter={handleDropdownOpen}
                    onMouseLeave={handleDropdownClose}
                    className={`shop-dropdown ${isDropdownOpen ? "open" : ""} ${isHeaderFixed ? "fixed" : ""}`}
                    style={{ backgroundColor: isHeaderFixed && 'transparent' }}
                >
                    <div
                        style={{
                            display: "flex",
                            padding: "25px",
                            color: "#7d7f85",
                            backgroundColor: "white",
                            gap: "50px",
                            justifyContent: 'space-between',
                            marginTop: isHeaderFixed && '55px'
                        }}
                        onMouseEnter={handleDropdownOpen}
                        onMouseLeave={handleDropdownClose}
                    >
                        <div style={{ display: 'flex' }}>
                            {menuItems.map(menuItem => (
                                <div key={menuItem.menuid} style={{ minWidth: '150px', borderRight: '1px solid lightgray', paddingLeft: '25px' }}>
                                    <ButtonBase
                                        component="div"
                                    >
                                        <ListItem style={{ padding: '0px 5px 0px 5px' }}>
                                            <p className="muilistMenutext">{menuItem.menuname}</p>
                                        </ListItem>
                                    </ButtonBase>
                                    <>
                                        <List className='smr_listMain'>
                                            {menuItem.param1.map(subMenuItem => (
                                                <div key={subMenuItem.param1dataid}>
                                                    <ButtonBase
                                                        component="div"
                                                        style={{ width: '100%', display: 'flex', justifyContent: 'start', height: '25px' }}
                                                        onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname })}
                                                    >
                                                        {/* <a href='#' className='smr_menuSubTitle'> */}
                                                        {/* <a href='/productlist' onContextMenu={handleContextMenu}> */}
                                                        <p className='smr_menuSubTitle' style={{ margin: '0px 0px 0px 6px', fontWeight: 500 }}>{subMenuItem.param1dataname}</p>
                                                        {/* </a> */}
                                                        {/* </a> */}
                                                    </ButtonBase>
                                                    <>
                                                        <List style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                                            {subMenuItem.param2.map(subSubMenuItem => (
                                                                <div
                                                                    component="div"
                                                                    style={{ width: '100%' }}
                                                                    onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname }, { "key": subSubMenuItem.param2name, "value": subSubMenuItem.param2dataname })}

                                                                >
                                                                    <ListItem key={subSubMenuItem.param2dataid} style={{ paddingLeft: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                                                                        <p className="muilist2ndSubMenutext">{subSubMenuItem.param2dataname}</p>
                                                                    </ListItem>
                                                                </div>
                                                            ))}
                                                        </List>
                                                    </>
                                                </div>
                                            ))}
                                            <button className="smr_underline_button" onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname })}>view all</button>
                                        </List>


                                    </>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Header2;