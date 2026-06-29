"use client";

import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, ButtonBase, Drawer, IconButton, List, ListItem, ListItemText, Tooltip, useMediaQuery } from '@mui/material';
import "./Header.scss";
import { IoCallOutline } from 'react-icons/io5'
import { VscSearch } from "react-icons/vsc";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
 import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { GoHeart } from "react-icons/go";
import { FaAngleUp, FaChevronDown, FaChevronUp, FaFacebookF, FaPowerOff } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { GetMenuAPI } from "@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI";
import Cookies from "js-cookie";
import Pako from 'pako';

const Header = ({ hidden, storeinit, logos }) => {

    const [searchText, setSearchText] = useState('')
    const titleImg = logos?.web;
    const titleImgM = logos?.mobile;

 
     
    // const [islogin, setislogin] = useRecoilState(dt_loginState);
    const { islogin, loginUserDetail, setislogin, cartCountNum, wishCountNum } = useStore();
    const [menuItems, setMenuItems] = useState([]);
    const [menuData, setMenuData] = useState([]);
    // const navigation = useNavigate();
    const Router = useNextRouterLikeRR().push;
      const navigate = url => Router(url);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedData, setSelectedData] = useState([]);
    const [isHeaderFixed, setIsHeaderFixed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [leval1menu, setLeval1menu] = useState();
   
    const IsB2BWebsiteChek = storeinit?.IsB2BWebsite;
    const [socialMediaData, setSocialMediaData] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [dropdownVisible, setDropdownVisible] = useState(false);

 
    const fetchData = () => {
        const value = JSON.parse(sessionStorage.getItem('LoginUser'));
        setislogin(value);
    };

    useEffect(() => {
        const visiterID = Cookies.get("visiterId");
        let companyInfoData;

        if (sessionStorage.getItem("CompanyInfoData")) {
            if (companyInfoData?.SocialLinkObj != "" && companyInfoData?.SocialLinkObj != null && companyInfoData?.SocialLinkObj != undefined) {
                companyInfoData = JSON?.parse(sessionStorage.getItem("CompanyInfoData")) ?? "";
                const parsedSocilaMediaUrlData = JSON?.parse(companyInfoData?.SocialLinkObj) ?? [];
                if (parsedSocilaMediaUrlData) {
                    setSocialMediaData(parsedSocilaMediaUrlData)
                }
            }
        }

      
    }, []);



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
        await GetMenuAPI(finalID).then((response) => {
            setMenuData(response?.Data?.rd)
        }).catch((err) => console.log(err))

    }

    useEffect(() => {
        let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
        let isUserLogin = JSON.parse(sessionStorage.getItem("LoginUser"));
        if (
            storeinit?.IsB2BWebsite === 0 ||
            (storeinit?.IsB2BWebsite === 1 && isUserLogin === true)) {
            getMenuApi();
        }
    }, [islogin]);


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsHeaderFixed(scrollPosition > 100);
            //   setIsHeaderFixedDropShow(scrollPosition > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


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
                param1: param1Items,
                displayorder: item?.displayorder
            };
        });

        const sortedMenuItems = uniqueMenuItems.sort((a, b) => a.displayorder - b.displayorder);
        setMenuItems(sortedMenuItems);
    }, [menuData]);


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
        // navigation("/productpage", { state: { menuFlag: true, filtervalue: finalData } })
        sessionStorage.setItem('menuparams', JSON.stringify(finalData));
    };

    const [menuHover, setMenuHover] = useState(false);
    const [dropdownHover, setDropdownHover] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        fetchData();

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
            setIsFixed(scrollY > 100);
            if (expandedMenu !== null) {
                // Adjust dropdown position based on header height
                setDropdownPosition((prevPosition) => ({
                    ...prevPosition,
                    top: prevPosition.top + (headerHeight - (scrollY > 200 ? headerHeight : 0))
                }));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [fetchData, expandedMenu, isFixed]);

    useEffect(() => {
        if (!menuHover && !dropdownHover) {
            const timer = setTimeout(() => {
                setDropdownVisible(false);
                setExpandedMenu(null);
                setHoveredIndex(null);
            }, 200); // Delay before closing to handle quick mouse movements

            return () => clearTimeout(timer);
        }
    }, [menuHover, dropdownHover]);

    const handleMouseEnterMenu = (index, event) => {
        if (event && event.target) {
            const target = event.target;
            const { top, left, height } = target.getBoundingClientRect();
            const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
            setDropdownPosition({
                top: top + height + window.scrollY - headerHeight / 20, // Adjust position below the menu item
                left: left + window.scrollX, // Adjust horizontal position
            });
            setDropdownVisible(true);
            setHoveredIndex(index);
            setExpandedMenu(index);
            setSelectedData(menuItems[index] || []);
            setMenuHover(true);
        }
    };

    const handleMouseLeaveMenu = () => {
        setMenuHover(false);
    };

    const handleMouseEnterDropdown = () => {
        setDropdownHover(true);
    };

    const handleMouseLeaveDropdown = () => {
        setDropdownHover(false);
    };


    const handleLogout = () => {
        navigation("/");
        setislogin(false);
        Cookies.remove("userLoginCookie");
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
    }



    const [selectedMenu, setSelectedMenu] = useState(null);
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
    const isDesktop = useMediaQuery('(min-width: 1025px) and (max-width: 1440px)');
    const isMaxDesktop = useMediaQuery('(min-width: 1440px) and (max-width: 2550px)');


    const handelMenu = (param, param1, param2) => {
        setDropdownVisible(false);
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

        const url = `/p/${finalData?.menuname}/${queryParameters1}/?M=${btoa(
            menuEncoded
        )}`;

        setDrawerOpen(false);
        navigate(url);

    };

    const handleLoginMenuClick = (menuName, menuItem, iconclicked) => {
        if (iconclicked == 'iconclicked') {
            setSelectedMenu(prevMenu => (prevMenu === menuName ? null : menuName));
            return;
        }
        const { param1, ...menuItemWithoutParam1 } = menuItem;
        handleMenuClick(menuItemWithoutParam1)
    };

    useEffect(() => {
        if (isMaxDesktop) {
            setDrawerOpen(false);
        }
    }, [isMaxDesktop]);

    let drawerWidth = '100%';
    if (isTablet) {
        drawerWidth = '50%';
    } else if (isDesktop) {
        drawerWidth = '25%';
    }


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
            e.preventDefault();
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

                // let encodeObj = compressAndEncode(JSON.stringify(obj));
                let encodeObj = btoa(JSON.stringify(obj))

                setSearchText("");
                setDrawerOpen(false);
                navigate(`/p/${searchText}?S=${encodeObj}`);
                // navigate(`/d/${productData?.TitleLine.replace(/\s+/g, `_`)}${productData?.TitleLine?.length > 0 ? "_" : ""}${searchText}?p=${encodeObj}`)
                // }
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
            setDrawerOpen(false);
            navigate(`/p/${searchText}?S=${encodeObj}`);
            setSearchText("");
        }
    }


    return (
        <div className='dai_headerMain' draggable={false} onContextMenu={(e) => e.preventDefault()}>
            <div className="dai_headerMainTop">
                <div className="div_contact_info first-dt">
                    <IoCallOutline style={{ height: "20px", width: "40px" }} />
                    <a href={`tel:${'9099887762'}`} className="Dt_FontFamilySet" style={{ fontSize: "12px", color: 'white', cursor: 'pointer', textDecoration: 'none', fontWeight: 500 }}>
                        Call: +91-9099887762
                    </a>
                </div>
                <p className='Dt_FontFamilySet two-dt' style={{ margin: '0px', color: 'white', fontWeight: 500 }}>100% Natural Diamonds</p>
                <div className="dai_login_link three-dt">
                    {socialMediaData?.map((social, index) => (
                        <a key={index} href={`https://${social.SLink}`} target="_blank" rel="noopener noreferrer">
                            <img src={social.SImgPath} alt={social.SName} style={{ width: '18px', height: '18px', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }} />
                        </a>
                    ))}
                    {!islogin &&
                        <p className='Dt_FontFamilySet' style={{ margin: '0px 20px', cursor: 'pointer', color: 'white', fontWeight: 500 }} onClick={() => navigate('/LoginOption')}>
                            Login
                        </p>
                    }
                </div>
            </div>

            <div className="dt_headermainDiv">
                <div className="dt_headermainDiv1">
                    <VscSearch fontSize='20px' style={{ height: "20px", width: "20px", marginRight: "10px" }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="serachinputBoxOverly"
                        onKeyDown={searchDataFucn}
                    />
                </div>
                <div className="dt_headermainDiv2"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <a href='/'
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <img
                            alt=""
                            src={titleImg}
                            className="dt_header_logo"
                            onClick={() => navigation("/")}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </a>
                </div>
                <div className="dt_headermainDiv3">
                    <ul className="dt_nav_ul_shop">
                        {IsB2BWebsiteChek == 1 ?
                            islogin == true ?
                                <>
                                    <Badge
                                        badgeContent={wishCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                            },
                                        }}
                                    >
                                        <Tooltip title="WishList">
                                            <li
                                                className="dt_nav_li_smining"
                                                style={{ cursor: "pointer", textDecoration: 'none', marginTop: '0' }} onClick={() => navigation("/myWishList")}>
                                                <GoHeart color="#7D7F85" fontSize='25px' />
                                            </li>
                                        </Tooltip>
                                    </Badge>

                                    <Badge
                                        badgeContent={cartCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                            },
                                        }}
                                    >
                                        <Tooltip title="Cart">
                                            <li
                                                className="dt_nav_li_smining"
                                                onClick={() => navigation('/CartPage')}
                                                style={{
                                                    cursor: "pointer",
                                                    marginTop: "0px",
                                                }}
                                            >
                                                <HiOutlineShoppingBag color="#7D7F85" fontSize='25px' />
                                            </li>
                                        </Tooltip>
                                    </Badge>
                                </>

                                :
                                ''
                            :
                            <>
                                <Badge
                                    badgeContent={wishCountNum}
                                    max={1000}
                                    overlap={"rectangular"}
                                    color="secondary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#a8807c',
                                        },
                                    }}
                                >
                                    <Tooltip title="WishList">
                                        <li
                                            className="dt_nav_li_smining"
                                            style={{ cursor: "pointer", textDecoration: 'none', marginTop: '0' }} onClick={() => navigation("/myWishList")}>
                                            <GoHeart color="#7D7F85" fontSize='25px' />
                                        </li>
                                    </Tooltip>
                                </Badge>

                                <Badge
                                    badgeContent={cartCountNum}
                                    max={1000}
                                    overlap={"rectangular"}
                                    color="secondary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#a8807c',
                                        },
                                    }}
                                >
                                    <Tooltip title="Cart">
                                        <li
                                            className="dt_nav_li_smining"
                                            onClick={() => navigation('/CartPage')}
                                            style={{
                                                cursor: "pointer",
                                                marginTop: "0px",
                                            }}
                                        >
                                            <HiOutlineShoppingBag color="#7D7F85" fontSize='25px' />
                                        </li>
                                    </Tooltip>
                                </Badge>
                            </>
                        }
                        {
                            islogin == true &&
                            <Tooltip title="Account">
                                <li
                                    className="dt_nav_li_smining"
                                    style={{ cursor: "pointer", textDecoration: 'none', marginTop: "0" }}
                                    onClick={() => { storeInit?.IsB2BWebsite == 0 && !islogin ? navigation("/LoginOption") : navigation("/account") }}
                                >
                                    <IoPersonOutline color="#7D7F85" fontSize='25px' />
                                </li>
                            </Tooltip>
                        }
                        {islogin &&
                            <li
                                className="dt_nav_li_smining"
                                style={{ cursor: "pointer", marginTop: "0" }}
                                onClick={handleLogout}
                            >
                                <FaPowerOff color="#7D7F85" style={{ fontSize: '25px' }} />
                            </li>
                        }
                    </ul>
                </div>
            </div>

            <div className={`dt_TopFixed_Header ${isFixed ? 'fixed' : ''}`} ref={headerRef}>
                <>
                    <ul className="dt_ul_main">
                        <li
                            className="dt_menu_li"
                            style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: "pointer", textTransform: 'uppercase' }}
                            onClick={() => { navigation('/'); window.scrollTo(0, 0); }}
                        >
                            <span className="nav-li-sminingSpan_Home">
                                Home
                            </span>
                        </li>
                        {menuItems.map((item, index) => (
                            <li
                                className="dt_menu_li"
                                style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: "pointer", textTransform: 'uppercase' }}
                                key={index}
                                label={item.menuname}
                                onMouseEnter={(event) => handleMouseEnterMenu(index, event)}
                                onMouseLeave={handleMouseLeaveMenu}
                                onClick={() =>
                                    handelMenu({
                                        menuname: item?.menuname,
                                        key: item?.param0name,
                                        value: item?.param0dataname,
                                    })}

                            >
                                <span className="nav_li_sminingSpan_Menu" style={{ textDecoration: hoveredIndex == index && 'underline' }}>
                                    {item.menuname}
                                </span>
                            </li>
                        )

                        )

                        }
                        {/* <li
                            className="dt_menu_li"
                            style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: "pointer" }}
                            onClick={() => navigation('/faq')}
                        >
                            <span className="nav-li-sminingSpan">
                                FAQS
                            </span>
                        </li> */}
                        {IsB2BWebsiteChek == 1 ? (
                            islogin === true ? (
                                <>
                                    {storeinit?.IsDesignSetInMenu == 1 &&
                                        <li
                                            className="dt_menu_li"
                                            style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: "pointer", textTransform: 'uppercase', position: 'relative' }}
                                            onClick={() => navigation('/Lookbook')}
                                        >
                                            <span className='dt_lookBookNew_header'>New</span>
                                            <span className="nav-li-sminingSpan">
                                                {storeinit?.DesignSetInMenu}
                                            </span>
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
                                        className="dt_menu_li"
                                        style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: "pointer", textTransform: 'uppercase', position: 'relative', justifyContent: 'center' }}
                                        onClick={() => navigation('/Lookbook')}
                                    >
                                        <span className='dt_lookBookNew_header'>New</span>
                                        <span className="nav-li-sminingSpan">
                                            {storeinit?.DesignSetInMenu}
                                        </span>
                                    </li>
                                }
                            </>
                        )}
                    </ul>
                </>
            </div>

            {/* header menu dropdown */}
            {dropdownVisible && (
                <div
                    id='shopdropdown'
                    className={`dt_shop_dropdown ${expandedMenu !== null ? "open" : ""} ${isFixed ? "fixed" : ""}`}
                    onMouseEnter={handleMouseEnterDropdown}
                    onMouseLeave={handleMouseLeaveDropdown}
                    style={{
                        left: selectedData?.param1?.some(param1Item =>
                            param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length == 0)) ? dropdownPosition.left :
                            (menuItems?.length > 4 && Object?.keys(selectedData?.param1)?.length < 4) ? dropdownPosition.left : '0px',
                        position: isFixed ? 'fixed' : 'absolute',
                        zIndex: 99,
                        display: selectedData?.param1?.some(param1Item =>
                            param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length == 0)) ? 'block' :
                            (menuItems?.length > 4 && Object?.keys(selectedData?.param1)?.length < 4) ? 'block' : 'flex',
                        width: selectedData?.param1?.some(param1Item =>
                            param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length != 0)) &&
                            (menuItems?.length > 4 && Object?.keys(selectedData?.param1)?.length < 4) ? 'fit-content' : '100%',
                        justifyContent: selectedData?.param1?.some(param1Item =>
                            param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length != 0)) && 'center',

                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            padding: "30px",
                            color: "#7d7f85",
                            gap: "50px",
                            marginTop: isFixed && '60px',
                            justifyContent: 'space-between',
                            width: 'fit-content',
                            backgroundColor: selectedData?.param1?.length > 0 && selectedData?.param1[0]?.param1dataname ? 'white' : '',
                            boxShadow: selectedData?.param1?.length > 0 && selectedData?.param1[0]?.param1dataname ? '5px 10px 16px rgba(51, 51, 51, 0.05), -5px 10px 16px rgba(51, 51, 51, 0.05)' : '',
                            height: selectedData?.param1?.some(param1Item =>
                                param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length != 0)) && 'fit-content'
                        }}
                        className="menuDropdownData"
                    >
                        <div style={{
                            width: '100%', gap: selectedData?.param1?.some(param1Item =>
                                param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length == 0)) ? '0px' : '60px', textTransform: 'uppercase', display: 'flex', flexDirection: selectedData?.param1?.some(param1Item =>
                                    param1Item?.param2?.some(param2Item => Object?.keys(param2Item?.param2name).length == 0)) ? 'column' : 'row'
                        }}>
                            {selectedData?.param1?.map((param1Item, param1Index) => (
                                <div key={param1Index}>
                                    <span onClick={() => handelMenu({ "menuname": leval1menu?.menuname, "key": leval1menu?.param0name, "value": leval1menu?.param0dataname }, { "key": param1Item.param1name, "value": param1Item.param1dataname })} className="level1MenuData" key={param1Index} style={{ fontSize: '15px', marginBottom: '10px', fontFamily: '"Poppins", sans-serif', textAlign: 'start', letterSpacing: 1, fontWeight: 600, cursor: 'pointer' }} > {param1Item?.param1dataname}</span>
                                    <div style={{ height: 'auto', display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                        {param1Item?.param2?.map((param2Item, param2Index) => (
                                            <p className="level2menuData" key={param2Index} onClick={() => handelMenu({
                                                menuname: leval1menu?.menuname,
                                                key: leval1menu?.param0name,
                                                value: leval1menu?.param0dataname,
                                            },
                                                {
                                                    key: param1Item.param1name,
                                                    value: param1Item.param1dataname,
                                                },
                                                {
                                                    key: param2Item.param2name,
                                                    value: param2Item.param2dataname,
                                                })} style={{ fontSize: '13.5px', margin: '6px 15px 6px 0px', fontFamily: '"Poppins", sans-serif', letterSpacing: 0.4, textAlign: 'start', cursor: 'pointer', textTransform: 'capitalize', paddingRight: '15px' }}>
                                                {param2Item?.param2dataname}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}


            {/* mobileHeader................. */}
            <div className="dt_mobileViewHeaderMain" style={{ backgroundColor: drawerOpen ? 'white' : '#e1e1e1 ' }}>
                <div className="dt_mobileView_div1">
                    {
                        (drawerOpen ?
                            <IconButton onClick={() => setDrawerOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                            :
                            <IconButton
                                style={{ color: "#7D7F85" }}
                                onClick={() => setDrawerOpen(true)}
                                aria-label="open menu"
                                autoFocus={false}
                            >
                                <MenuIcon style={{ fontSize: "35px" }} className="mobileViewSmilingTop4Icone" />
                            </IconButton>)
                    }
                </div>
                <div className="dt_mobileView_div2"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <a href="/"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {titleImg && <img src={titleImg} className="dt_mobileView_div2_logo"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                        />}
                    </a>
                </div>
                <div className="dt_mobileView_div2_mobile"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <a href="/"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {titleImgM && <img src={titleImgM} className="dt_mobileView_div2_logo"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                        />}
                    </a>
                </div>
                <div className="dt_mobileView_div3">
                    {/* {((storeInit?.IsB2BWebsite != 0) || (storeInit?.IsB2BWebsite == 1 && islogin)) ? (
                        <li className="nav-li-smining" onClick={() => navigation('/LoginOption')}>
                            Log in
                        </li>
                    ) : */}
                    <ul className='dt_mobile_div3_ulMain'>

                        {drawerOpen ?
                            <>
                                {IsB2BWebsiteChek == 1 ?
                                    islogin &&
                                    <Badge
                                        badgeContent={wishCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                                marginInline: '10px'
                                            },
                                        }}
                                        className='dt_mobile_div3_li1'
                                    >
                                        <li style={{ listStyle: 'none', cursor: 'pointer', marginInline: '10px' }} onClick={() => { navigation("/myWishList"); setDrawerOpen(false); }}>
                                            <GoHeart color="#7D7F85" fontSize='30px' />
                                        </li>
                                    </Badge>
                                    :
                                    <Badge
                                        badgeContent={wishCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                                marginInline: '10px'
                                            },
                                        }}
                                        className='dt_mobile_div3_li1'
                                    >
                                        <li style={{ listStyle: 'none', cursor: 'pointer', marginInline: '10px' }} onClick={() => { navigation("/myWishList"); setDrawerOpen(false); }}>
                                            <GoHeart color="#7D7F85" fontSize='30px' />
                                        </li>
                                    </Badge>
                                }
                            </>

                            :
                            <>
                                {IsB2BWebsiteChek == 1 ?
                                    islogin &&
                                    <Badge
                                        badgeContent={cartCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                                marginInline: '10px'
                                            },
                                        }}
                                    >
                                        <li style={{ marginInline: '10px' }} onClick={() => { setDrawerOpen(false); navigation('/CartPage') }}>
                                            <HiOutlineShoppingBag color="#7D7F85" fontSize='30px' />
                                        </li>
                                    </Badge>
                                    :
                                    <Badge
                                        badgeContent={cartCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                                marginInline: '10px'
                                            },
                                        }}
                                    >
                                        <li style={{ marginInline: '10px' }} onClick={() => { setDrawerOpen(false); navigation('/CartPage') }}>
                                            <HiOutlineShoppingBag color="#7D7F85" fontSize='30px' />
                                        </li>
                                    </Badge>
                                }
                            </>
                        }
                        {drawerOpen &&
                            (
                                islogin &&
                                <li
                                    className='dt_mobile_div3_li1'
                                    style={{ marginInline: '10px' }} onClick={() => { navigation("/account"); setDrawerOpen(false); }}>
                                    <IoPersonOutline color="#7D7F85" fontSize='30px' />
                                </li>
                            )

                        }
                        {!drawerOpen &&
                            (islogin ? (
                                <li className='dt_mobile_div3_li3' style={{ marginInline: '10px' }} onClick={handleLogout}>
                                    <FaPowerOff fontSize='30px' color="#7D7F85" />
                                </li>
                            ) :
                                <li
                                    className='dt_mobile_div3_li3'
                                    style={{ marginInline: '10px' }} onClick={() => navigation("/LoginOption")}>
                                    <IoPersonOutline color="#7D7F85" fontSize='30px' />
                                </li>

                                // <li className='dt_mobile_login_text' style={{ marginInline: '10px' }} onClick={() => { navigation('/LoginOption'); setDrawerOpen(false); }}>
                                //     <span style={{ display: 'block', width: '50px' }}>Log In</span>
                                // </li>
                            )
                        }
                    </ul>
                    {/* } */}
                </div>
            </div>

            {/* open mobileview drawer...................... */}
            {drawerOpen && (
                <>
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        PaperProps={{ style: { width: drawerWidth } }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '33.33%', display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={() => { setSearchText(''); setDrawerOpen(false); }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            <div style={{ width: '33.33%' }}>
                                <a href="/">
                                    {titleImg && <img src={titleImg} style={{ maxWidth: '150px' }} />}
                                </a>
                            </div>
                            <ul style={{ display: 'flex', listStyle: 'none', width: '33.33%', margin: '0px', padding: '0px', justifyContent: 'flex-end', alignItems: 'center' }}>

                                {islogin == true &&
                                    <Badge
                                        badgeContent={wishCountNum}
                                        max={1000}
                                        overlap={"rectangular"}
                                        color="secondary"
                                        style={{ marginInline: '15px' }}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#a8807c',
                                            },
                                        }}
                                    >
                                        <li
                                            onClick={() => { setDrawerOpen(false); navigation('/myWishList') }}
                                            style={{
                                                marginLeft: "-10px",
                                                cursor: "pointer",
                                                listStyle: 'none',
                                                marginTop: "5px",
                                            }}
                                            sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 20, minWidth: 20, width: 20 } }}
                                        >
                                            <GoHeart color="#7D7F85" fontSize='20px' />
                                        </li>
                                    </Badge>
                                }
                                <Badge
                                    badgeContent={cartCountNum}
                                    max={1000}
                                    overlap={"rectangular"}
                                    color="secondary"
                                    style={{ marginInline: '15px' }}
                                    sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 20, minWidth: 20, width: 20, backgroundColor: '#a8807c' } }}
                                >
                                    <li
                                        onClick={() => { setDrawerOpen(false); navigation('/CartPage') }}
                                        style={{
                                            marginLeft: "-10px",
                                            cursor: "pointer",
                                            listStyle: 'none',
                                            marginTop: "0px",
                                        }}
                                    >
                                        <HiOutlineShoppingBag fontSize='20px' />
                                    </li>
                                </Badge>
                                <li
                                    className="nav-li-smining"
                                    style={{ cursor: "pointer", marginTop: "0" }}
                                    onClick={handleLogout}
                                >
                                    <FaPowerOff style={{ fontSize: '20px' }} />
                                </li>
                            </ul>
                        </div>

                        <div style={{ padding: '0px 0px 5px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0px 0px 0px', fontWeight: '500', borderBottom: '1px solid lightgray', width: '100%' }}>
                            <div className="dt_headermainDiv1">
                                <VscSearch onClick={() => clickSearch()} fontSize='20px' style={{ height: "20px", width: "20px", marginRight: "10px" }} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ border: '0px', outline: '0px' }}
                                    className="serachinputBoxOverly"
                                    onKeyDown={searchDataFucn}
                                />
                            </div>
                        </div>

                        <List sx={{ paddingTop: '0', marginBottom: '20px' }}>

                            {IsB2BWebsiteChek == 1 ? (
                                islogin === true ?
                                    (
                                        <>
                                            {storeinit?.IsDesignSetInMenu == 1 &&
                                                <ButtonBase
                                                    component="div"
                                                    style={{ width: '100%' }}
                                                    onClick={() => { navigation('/Lookbook'); setDrawerOpen(false); }}
                                                >
                                                    <p style={{ padding: '0px 0px 10px 15px', display: 'flex', position: 'relative', alignItems: 'center', margin: '10px 0px 0px 0px', fontWeight: '500', borderBottom: '1px solid lightgray', width: '100%' }}>
                                                        <span style={{
                                                            position: 'absolute',
                                                            left: '100px',
                                                            top: '-11px',
                                                            color: 'white',
                                                            backgroundColor: 'saddlebrown',
                                                            width: 'fitContent',
                                                            paddingInline: '5px',
                                                            height: '16px',
                                                            fontSize: '10px',
                                                            borderRadius: '5px'
                                                        }}
                                                        >New</span>
                                                        <span className="nav-li-sminingSpan">
                                                            {storeinit?.DesignSetInMenu}
                                                        </span>
                                                    </p>
                                                </ButtonBase>
                                            }
                                        </>
                                    )
                                    :
                                    '')
                                :
                                <>
                                    {storeinit?.IsDesignSetInMenu == 1 &&
                                        <ButtonBase
                                            component="div"
                                            style={{ width: '100%' }}
                                            onClick={() => { navigation('/Lookbook'); setDrawerOpen(false); }}
                                        >
                                            <p style={{ padding: '0px 0px 10px 15px', display: 'flex', position: 'relative', alignItems: 'center', margin: '10px 0px 0px 0px', fontWeight: '500', borderBottom: '1px solid lightgray', width: '100%' }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '100px',
                                                    top: '-11px',
                                                    color: 'white',
                                                    backgroundColor: 'saddlebrown',
                                                    width: 'fitContent',
                                                    paddingInline: '5px',
                                                    height: '16px',
                                                    fontSize: '10px',
                                                    borderRadius: '5px'
                                                }}>New</span>
                                                <span className="nav-li-sminingSpan">
                                                    {storeinit?.DesignSetInMenu}
                                                </span>
                                            </p>
                                        </ButtonBase>
                                    }
                                </>
                            }

                            {menuItems.map(menuItem => (
                                <div key={menuItem.menuid}>
                                    <ButtonBase
                                        component="div"
                                        onClick={() => handleLoginMenuClick(menuItem.menuname, null, "iconclicked")}
                                        style={{ width: '100%' }}
                                    >
                                        <p style={{ padding: '0px 0px 10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0px 0px 0px', fontWeight: '500', borderBottom: '1px solid lightgray', width: '100%' }}>{menuItem.menuname}
                                            {selectedMenu === menuItem.menuname ?
                                                <FaChevronUp style={{ marginRight: '15px', color: '#9b978f' }} />
                                                :
                                                <FaChevronDown style={{ marginRight: '15px', color: '#9b978f' }} />
                                            }
                                        </p>
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
                                                    })}
                                                style={{ width: '100%', display: 'flex', justifyContent: 'start' }}
                                            >
                                                <p style={{ margin: '5px 0px 0px 15px', textDecoration: 'underline', }}>View All</p>
                                            </ButtonBase>
                                            <List>
                                                {menuItem.param1.map(subMenuItem => (
                                                    <div key={subMenuItem.param1dataid}>
                                                        <ButtonBase
                                                            component="div"
                                                            onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname })}
                                                            style={{ width: '100%', display: 'flex', justifyContent: 'start' }}
                                                        >
                                                            <p style={{ margin: '5px 0px 5px 15px', fontWeight: 500 }}>{subMenuItem.param1dataname}</p>
                                                        </ButtonBase>
                                                        {selectedMenu === menuItem.menuname && (
                                                            <>
                                                                <List style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                                                    {subMenuItem.param2.map(subSubMenuItem => (
                                                                        <ButtonBase
                                                                            component="div"
                                                                            onClick={() => handelMenu({ "menuname": menuItem?.menuname, "key": menuItem?.param0name, "value": menuItem?.param0dataname }, { "key": subMenuItem.param1name, "value": subMenuItem.param1dataname }, { "key": subSubMenuItem.param2name, "value": subSubMenuItem.param2dataname })}
                                                                            style={{ width: '100%', display: 'flex', justifyContent: 'start' }}
                                                                        >
                                                                            <p style={{ margin: '5px 0px 5px 25px', }}>{subSubMenuItem.param2dataname}</p>
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
                    </Drawer>
                </>
            )}
        </div>
    )
}

export default Header