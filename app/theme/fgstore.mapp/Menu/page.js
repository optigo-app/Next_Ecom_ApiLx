'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Box, ButtonBase, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, LogIn } from 'lucide-react';
import Cookies from 'js-cookie';
import { GetMenuAPI } from '@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { getSession } from '@/app/(core)/utils/FetchSessionData';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { COLORS } from '@/app/(core)/constants/MobileAppTheme';
import { getPricingContext, buildMenuCacheKey } from '@/app/(core)/cache_utility/CacheBuilder';
import { readCache, writeCache } from '@/app/(core)/cache_utility/cacheActions';

const Menu = ({ storeInit }) => {
    const { islogin, loginUserDetail } = useStore();
    const navigation = useNextRouterLikeRR().push;

    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);
    const isFetchingRef = useRef(false);
    const lastRequestKeyRef = useRef("");

    // Reset the lastRequestKey lock whenever login-state changes so a fresh fetch can happen.
    useEffect(() => {
        lastRequestKeyRef.current = "";
        isFetchingRef.current = false;
    }, [islogin, loginUserDetail]);

    useEffect(() => {
        const isB2B = storeInit?.IsB2BWebsite === 1;
        const isUserLoggedIn = getSession("LoginUser") === true;
        console.log("isB2B", isB2B);
        console.log("isUserLoggedIn", isUserLoggedIn);

        // B2B Guard Condition
        // if (isB2B && !isUserLoggedIn) {
        //     setLoading(false);
        //     return;
        // }

        // Wait for dependencies to be ready
        if (!pricingContext || !storeInit) return;
        console.log("pricingContext", pricingContext);

        const visitorID = Cookies.get('visiterId');
        let finalID;
        if (storeInit?.IsB2BWebsite === 0) {
            finalID = islogin === false ? visitorID : (loginUserDetail?.id || '0');
        } else {
            finalID = loginUserDetail?.id || '0';
        }

        const eventName = "home_menu";
        const menuPricing = { PackageId: pricingContext.PackageId };
        const { key } = buildMenuCacheKey(eventName, storeInit, menuPricing, finalID);

        // Prevent duplicate calls with same key
        if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
        lastRequestKeyRef.current = key;

        const fetchMenu = async () => {
            isFetchingRef.current = true;
            setLoading(true);

            try {
                // Step 1: Check server-side disk cache (12h TTL)
                const cacheRes = await readCache(key);

                if (cacheRes?.cached && Array.isArray(cacheRes.data)) {
                    console.log("[Menu] Serving from cache");
                    setMenuData(cacheRes.data);
                    setLoading(false);
                    isFetchingRef.current = false;
                    return;
                }

                // Step 2: API Fallback
                console.log("[Menu] Calling GetMenuAPI...");
                const response = await GetMenuAPI(finalID);
                const apiData = response?.Data?.rd || [];

                if (apiData.length > 0) {
                    setMenuData(apiData);

                    // Step 3: Save to server cache (fire-and-forget, 12h TTL)
                    writeCache(key, apiData).catch(console.error);
                }

                setLoading(false);
                isFetchingRef.current = false;

            } catch (err) {
                console.error("[Menu] Error in fetchMenu:", err);
                setLoading(false);
                isFetchingRef.current = false;
            }
        };

        fetchMenu();
    }, [islogin, storeInit, loginUserDetail, pricingContext]);

    // ==========================================
    // 2. FORMAT MENU DATA FOR NEW UI
    // ==========================================
    const formattedMenu = useMemo(() => {
        if (!menuData.length) return [];

        const uniqueMenuIds = [...new Set(menuData.map(item => item.menuid))];

        return uniqueMenuIds.map(menuid => {
            const mainItem = menuData.find(d => d.menuid === menuid);
            const level1Items = menuData.filter(d => d.menuid === menuid);

            const param1Ids = [...new Set(level1Items.map(item => item.param1dataid))];

            const children = param1Ids.map(p1id => {
                const p1Item = level1Items.find(d => d.param1dataid === p1id);
                const p2Items = level1Items
                    .filter(d => d.param1dataid === p1id && d.param2dataid)
                    .map(d => ({
                        id: d.param2dataid,
                        name: d.param2dataname,
                        key: d.param2name // EXACT key mapping needed for old logic
                    }));

                return {
                    id: p1id,
                    name: p1Item.param1dataname,
                    key: p1Item.param1name, // EXACT key mapping needed for old logic
                    subChildren: p2Items
                };
            });

            return {
                menuid: mainItem.menuid,
                menuname: mainItem.menuname,
                param0name: mainItem.param0name,
                param0dataname: mainItem.param0dataname,
                children
            };
        });
    }, [menuData]);

    // ==========================================
    // 3. EXACT OLD ROUTING LOGIC (handelMenu)
    // ==========================================
    const handleNavigate = (m, p1 = null, p2 = null) => {
        let finalData = {
            "menuname": m?.menuname ?? "",
            "FilterKey": m?.param0name ?? "",
            "FilterVal": m?.param0dataname ?? "",
            "FilterKey1": p1?.key ?? "",
            "FilterVal1": p1?.name ?? "",
            "FilterKey2": p2?.key ?? "",
            "FilterVal2": p2?.name ?? ""
        };

        // Save exactly like old code
        sessionStorage.setItem("menuparams", JSON.stringify(finalData));

        const queryParameters1 = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join('/');

        const queryParameters = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join(',');

        const otherparamUrl = Object.entries({
            b: finalData?.FilterKey,
            g: finalData?.FilterKey1,
            c: finalData?.FilterKey2,
        })
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value)
            .filter(Boolean)
            .join(',');

        let menuEncoded = `${queryParameters}/${otherparamUrl}`;
        const url = `/p/${queryParameters1}/?M=${btoa(menuEncoded)}`;

        navigation(url);
    };

    // ==========================================
    // 4. EXACT OLD RANDOM MENU URL (handelMenu2)
    // ==========================================
    useEffect(() => {
        if (formattedMenu.length > 0) {
            const randomIndex = Math.floor(Math.random() * formattedMenu.length);
            const randomMenuItem = formattedMenu[randomIndex];

            let finalData = {
                "menuname": randomMenuItem.menuname ?? "",
                "FilterKey": randomMenuItem.param0name ?? "",
                "FilterVal": randomMenuItem.param0dataname ?? "",
                "FilterKey1": "",
                "FilterVal1": "",
                "FilterKey2": "",
                "FilterVal2": ""
            };

            const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`].filter(Boolean).join('/');
            const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`].filter(Boolean).join(',');

            const otherparamUrl = Object.entries({
                b: finalData?.FilterKey,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(',');

            const menuEncoded = `${queryParameters}/${otherparamUrl}`;
            sessionStorage.setItem("menuUrl", JSON.stringify(`/p/${queryParameters1}/?M=${btoa(menuEncoded)}`));
        }
    }, [formattedMenu]);

    const gradients = [
        "linear-gradient(135deg,#ffd1dc,#ffe0f0)",
        "linear-gradient(135deg,#c9e7ff,#e3f4ff)",
        "linear-gradient(135deg,#ffe9c6,#fff4dc)",
        "linear-gradient(135deg,#e6d6ff,#f3ebff)",
        "linear-gradient(135deg,#d4f5e9,#ecfff8)"
    ];



    // ==========================================
    // NEW UI RENDER
    // ==========================================
    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress sx={{ color: COLORS.primary }} />
        </Box>
    );

    // B2B Guard (Kept New Clean UI Style instead of raw HTML)
    if (storeInit?.IsB2BWebsite === 1 && !islogin) {
        return (
            <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, textAlign: 'center', bgcolor: '#f9f9f9' }}>
                <LogIn size={48} color="#D6B08B" style={{ marginBottom: '16px' }} />
                <Typography variant="h5" fontWeight={700}>Exclusive Access</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>Please sign in to view our exclusive B2B collection.</Typography>
                <ButtonBase
                    onClick={() => navigation('/signin')}
                    sx={{ bgcolor: COLORS.primary, color: 'white', px: 6, py: 1.5, borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 12px rgba(214,176,139,0.3)' }}
                >
                    Sign In
                </ButtonBase>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 60px)', bgcolor: '#fff', overflow: 'hidden' }}>
            <Box sx={{ width: '120px', bgcolor: '#fff', height: '100%', overflowY: 'auto', borderRight: '1px solid #e0e0e0' }}>
                {formattedMenu.map((item, idx) => (
                    <ButtonBase
                        key={item.menuid}
                        onClick={() => setActiveTab(idx)}
                        sx={{
                            width: '100%',
                            flexDirection: 'column',
                            py: 1.5,
                            px: 0.8,
                            position: 'relative',
                            transition: 'all 0.2s',
                            bgcolor: activeTab === idx ? COLORS.primary : 'transparent',
                            borderLeft: activeTab === idx ? `4px solid ${COLORS.primary}` : '4px solid transparent',
                        }}
                    >
                        <Typography sx={{
                            fontSize: '14px', fontWeight: activeTab === idx ? 700 : 500,
                            textAlign: 'center', color: activeTab === idx ? COLORS.white : '#666',
                            lineHeight: 1.2
                        }}>
                            {item.menuname}
                        </Typography>
                    </ButtonBase>
                ))}
            </Box>

            <Box sx={{ flex: 1, height: '100%', overflowY: 'auto', p: 2, bgcolor: '#fff' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#222' }}>
                                {formattedMenu[activeTab]?.menuname}
                            </Typography>
                            <ButtonBase
                                onClick={() => handleNavigate(formattedMenu[activeTab])}
                                sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '14px' }}
                            >
                                View All <ChevronRight size={16} />
                            </ButtonBase>
                        </Box>

                        {formattedMenu[activeTab]?.children.map((sub) => (
                            <Box key={sub.id} sx={{ mb: 4 }}>
                                <Typography
                                    onClick={() => handleNavigate(formattedMenu[activeTab], sub)}
                                    sx={{ fontWeight: 700, fontSize: '15px', mb: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    {sub.name} <ChevronRight size={14} style={{ marginLeft: 4, opacity: 0.5 }} />
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {sub.subChildren.map((child) => (
                                        <ButtonBase
                                            key={child.id}
                                            onClick={() => handleNavigate(formattedMenu[activeTab], sub, child)}
                                            sx={{
                                                px: 2,
                                                py: 1,
                                                borderRadius: '20px',
                                                border: '1px solid #eee',
                                                fontSize: '13px',
                                                bgcolor: '#fafafa',
                                                '&:active': { bgcolor: '#FDF7F0', borderColor: '#D6B08B' }
                                            }}
                                        >
                                            {child.name}
                                        </ButtonBase>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default Menu;



















































// 'use client';
// import React, { useEffect, useMemo, useState } from 'react';
// import { Box, ButtonBase, Typography, CircularProgress } from '@mui/material';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronRight, LogIn } from 'lucide-react';
// import Cookies from 'js-cookie';
// import { GetMenuAPI } from '@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI';
// import { useStore } from '@/app/(core)/contexts/StoreProvider';
// import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
// import { getSession } from '@/app/(core)/utils/FetchSessionData';
// import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
// import { COLORS } from '@/app/(core)/constants/MobileAppTheme';

// const Menu = ({ storeInit }) => {
//     const { islogin, loginUserDetail } = useStore();
//     const navigation = useNextRouterLikeRR().push;

//     const [menuData, setMenuData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState(0);

//     useEffect(() => {
//         const fetchMenu = async () => {
//             const isB2B = storeInit?.IsB2BWebsite === 1;
//             const isUserLoggedIn = getSession("LoginUser") === true;

//             // B2B Guard Condition
//             if (isB2B && !isUserLoggedIn) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const visitorID = Cookies.get('visiterId');
//                 let finalID;

//                 // Exact logic from old code
//                 if (storeInit?.IsB2BWebsite === 0) {
//                     finalID = islogin === false ? visitorID : (loginUserDetail?.id || '0');
//                 } else {
//                     finalID = loginUserDetail?.id || '0';
//                 }

//                 const response = await GetMenuAPI(finalID);
//                 if (response?.Data?.rd) {
//                     setMenuData(response.Data.rd);
//                 }
//             } catch (err) {
//                 console.error("Menu API Error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMenu();
//     }, [islogin, storeInit, loginUserDetail]);

//     // ==========================================
//     // 2. FORMAT MENU DATA FOR NEW UI
//     // ==========================================
//     const formattedMenu = useMemo(() => {
//         if (!menuData.length) return [];

//         const uniqueMenuIds = [...new Set(menuData.map(item => item.menuid))];

//         return uniqueMenuIds.map(menuid => {
//             const mainItem = menuData.find(d => d.menuid === menuid);
//             const level1Items = menuData.filter(d => d.menuid === menuid);

//             const param1Ids = [...new Set(level1Items.map(item => item.param1dataid))];

//             const children = param1Ids.map(p1id => {
//                 const p1Item = level1Items.find(d => d.param1dataid === p1id);
//                 const p2Items = level1Items
//                     .filter(d => d.param1dataid === p1id && d.param2dataid)
//                     .map(d => ({
//                         id: d.param2dataid,
//                         name: d.param2dataname,
//                         key: d.param2name // EXACT key mapping needed for old logic
//                     }));

//                 return {
//                     id: p1id,
//                     name: p1Item.param1dataname,
//                     key: p1Item.param1name, // EXACT key mapping needed for old logic
//                     subChildren: p2Items
//                 };
//             });

//             return {
//                 menuid: mainItem.menuid,
//                 menuname: mainItem.menuname,
//                 param0name: mainItem.param0name,
//                 param0dataname: mainItem.param0dataname,
//                 children
//             };
//         });
//     }, [menuData]);

//     // ==========================================
//     // 3. EXACT OLD ROUTING LOGIC (handelMenu)
//     // ==========================================
//     const handleNavigate = (m, p1 = null, p2 = null) => {
//         let finalData = {
//             "menuname": m?.menuname ?? "",
//             "FilterKey": m?.param0name ?? "",
//             "FilterVal": m?.param0dataname ?? "",
//             "FilterKey1": p1?.key ?? "",
//             "FilterVal1": p1?.name ?? "",
//             "FilterKey2": p2?.key ?? "",
//             "FilterVal2": p2?.name ?? ""
//         };

//         // Save exactly like old code
//         sessionStorage.setItem("menuparams", JSON.stringify(finalData));

//         const queryParameters1 = [
//             finalData?.FilterKey && `${finalData.FilterVal}`,
//             finalData?.FilterKey1 && `${finalData.FilterVal1}`,
//             finalData?.FilterKey2 && `${finalData.FilterVal2}`,
//         ].filter(Boolean).join('/');

//         const queryParameters = [
//             finalData?.FilterKey && `${finalData.FilterVal}`,
//             finalData?.FilterKey1 && `${finalData.FilterVal1}`,
//             finalData?.FilterKey2 && `${finalData.FilterVal2}`,
//         ].filter(Boolean).join(',');

//         const otherparamUrl = Object.entries({
//             b: finalData?.FilterKey,
//             g: finalData?.FilterKey1,
//             c: finalData?.FilterKey2,
//         })
//             .filter(([key, value]) => value !== undefined && value !== "")
//             .map(([key, value]) => value)
//             .filter(Boolean)
//             .join(',');

//         let menuEncoded = `${queryParameters}/${otherparamUrl}`;
//         const url = `/p/${queryParameters1}/?M=${btoa(menuEncoded)}`;

//         navigation(url);
//     };

//     // ==========================================
//     // 4. EXACT OLD RANDOM MENU URL (handelMenu2)
//     // ==========================================
//     useEffect(() => {
//         if (formattedMenu.length > 0) {
//             const randomIndex = Math.floor(Math.random() * formattedMenu.length);
//             const randomMenuItem = formattedMenu[randomIndex];

//             let finalData = {
//                 "menuname": randomMenuItem.menuname ?? "",
//                 "FilterKey": randomMenuItem.param0name ?? "",
//                 "FilterVal": randomMenuItem.param0dataname ?? "",
//                 "FilterKey1": "",
//                 "FilterVal1": "",
//                 "FilterKey2": "",
//                 "FilterVal2": ""
//             };

//             const queryParameters1 = [finalData?.FilterKey && `${finalData.FilterVal}`].filter(Boolean).join('/');
//             const queryParameters = [finalData?.FilterKey && `${finalData.FilterVal}`].filter(Boolean).join(',');

//             const otherparamUrl = Object.entries({
//                 b: finalData?.FilterKey,
//             })
//                 .filter(([key, value]) => value !== undefined && value !== "")
//                 .map(([key, value]) => value)
//                 .filter(Boolean)
//                 .join(',');

//             const menuEncoded = `${queryParameters}/${otherparamUrl}`;
//             sessionStorage.setItem("menuUrl", JSON.stringify(`/p/${queryParameters1}/?M=${btoa(menuEncoded)}`));
//         }
//     }, [formattedMenu]);

//     const gradients = [
//   "linear-gradient(135deg,#ffd1dc,#ffe0f0)",
//   "linear-gradient(135deg,#c9e7ff,#e3f4ff)",
//   "linear-gradient(135deg,#ffe9c6,#fff4dc)",
//   "linear-gradient(135deg,#e6d6ff,#f3ebff)",
//   "linear-gradient(135deg,#d4f5e9,#ecfff8)"
// ];



//     // ==========================================
//     // NEW UI RENDER
//     // ==========================================
//     if (loading) return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
//             <CircularProgress sx={{ color: COLORS.primary }} />
//         </Box>
//     );

//     // B2B Guard (Kept New Clean UI Style instead of raw HTML)
//     if (storeInit?.IsB2BWebsite === 1 && !islogin) {
//         return (
//             <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, textAlign: 'center', bgcolor: '#f9f9f9' }}>
//                 <LogIn size={48} color="#D6B08B" style={{ marginBottom: '16px' }} />
//                 <Typography variant="h5" fontWeight={700}>Exclusive Access</Typography>
//                 <Typography sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>Please sign in to view our exclusive B2B collection.</Typography>
//                 <ButtonBase
//                     onClick={() => navigation('/signin')}
//                     sx={{ bgcolor: COLORS.primary, color: 'white', px: 6, py: 1.5, borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 12px rgba(214,176,139,0.3)' }}
//                 >
//                     Sign In
//                 </ButtonBase>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ display: 'flex', height: 'calc(100vh - 60px)', bgcolor: '#fff', overflow: 'hidden' }}>
//             {/* LEFT SIDEBAR AREA */}
//             <Box sx={{ width: '120px', bgcolor: '#fff', height: '100%', overflowY: 'auto', borderRight: '1px solid #e0e0e0' }}>
//                 {formattedMenu.map((item, idx) => (
//                     <ButtonBase
//                         key={item.menuid}
//                         onClick={() => setActiveTab(idx)}
//                         sx={{
//                             width: '100%',
//                             flexDirection: 'column',
//                             py: 1.5,
//                             px: 0.8,
//                             position: 'relative',
//                             transition: 'all 0.2s',
//                             bgcolor: activeTab === idx ? COLORS.primary : 'transparent',
//                             borderLeft: activeTab === idx ? `4px solid ${COLORS.primary}` : '4px solid transparent' ,
//                         }}
//                     >
//                         {/* <Box sx={{
//                             width: 38, height: 38, 
//                             borderRadius: '18px', mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center'
//                         }}>
//                             <Box
//                             sx={{
//                                 width: 38,
//                                 height: 38,
//                                 borderRadius: "50%",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 background: gradients[idx % gradients.length],
//                             }}
//                             >
//                             </Box>

//                         </Box> */}
//                         <Typography sx={{
//                             fontSize: '14px', fontWeight: activeTab === idx ? 700 : 500,
//                             textAlign: 'center', color: activeTab === idx ? COLORS.white : '#666',
//                             lineHeight: 1.2
//                         }}>
//                             {item.menuname}
//                         </Typography>
//                     </ButtonBase>
//                 ))}
//             </Box>

//             {/* RIGHT CONTENT AREA */}
//             <Box sx={{ flex: 1, height: '100%', overflowY: 'auto', p: 2, bgcolor: '#fff' }}>
//                 <AnimatePresence mode="wait">
//                     <motion.div
//                         key={activeTab}
//                         initial={{ opacity: 0, x: 10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -10 }}
//                         transition={{ duration: 0.2 }}
//                     >
//                         {/* Header & View All */}
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                             <Typography variant="h6" fontWeight={800} sx={{ color: '#222' }}>
//                                 {formattedMenu[activeTab]?.menuname}
//                             </Typography>
//                             <ButtonBase
//                                 onClick={() => handleNavigate(formattedMenu[activeTab])}
//                                 sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '14px' }}
//                             >
//                                 View All <ChevronRight size={16} />
//                             </ButtonBase>
//                         </Box>

//                         {/* Level 1 Sections */}
//                         {formattedMenu[activeTab]?.children.map((sub) => (
//                             <Box key={sub.id} sx={{ mb: 4 }}>
//                                 <Typography
//                                     onClick={() => handleNavigate(formattedMenu[activeTab], sub)}
//                                     sx={{ fontWeight: 700, fontSize: '15px', mb: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
//                                 >
//                                     {sub.name} <ChevronRight size={14} style={{ marginLeft: 4, opacity: 0.5 }} />
//                                 </Typography>

//                                 {/* Level 2 Grid - Blinkit Style Bubble Links */}
//                                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                                     {sub.subChildren.map((child) => (
//                                         <ButtonBase
//                                             key={child.id}
//                                             onClick={() => handleNavigate(formattedMenu[activeTab], sub, child)}
//                                             sx={{
//                                                 px: 2,
//                                                 py: 1,
//                                                 borderRadius: '20px',
//                                                 border: '1px solid #eee',
//                                                 fontSize: '13px',
//                                                 bgcolor: '#fafafa',
//                                                 '&:active': { bgcolor: '#FDF7F0', borderColor: '#D6B08B' }
//                                             }}
//                                         >
//                                             {child.name}
//                                         </ButtonBase>
//                                     ))}
//                                 </Box>
//                             </Box>
//                         ))}
//                     </motion.div>
//                 </AnimatePresence>
//             </Box>
//         </Box>
//     );
// };

// export default Menu;























// // 'use client';
// // import React, { useEffect, useMemo, useState } from 'react';
// // import { Box, ButtonBase, Typography, CircularProgress } from '@mui/material';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { ChevronRight, LogIn } from 'lucide-react';
// // import Cookies from 'js-cookie';
// // import { GetMenuAPI } from '@/app/(core)/utils/API/GetMenuAPI/GetMenuAPI';
// // import { useStore } from '@/app/(core)/contexts/StoreProvider';
// // import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
// // import { getSession } from '@/app/(core)/utils/FetchSessionData';
// // import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

// // const Menu = ({ storeInit }) => {
// //     const { islogin, loginUserDetail } = useStore();
// //     const navigation = useNextRouterLikeRR().push;
    
// //     const [menuData, setMenuData] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [activeTab, setActiveTab] = useState(0);

// //     useEffect(() => {
// //         const fetchMenu = async () => {
// //             const isB2B = storeInit?.IsB2BWebsite === 1;
// //             const isUserLoggedIn = getSession("LoginUser") == true;

// //             if (isB2B && !isUserLoggedIn) {
// //                 setLoading(false);
// //                 return;
// //             }

// //             try {
// //                 const visitorID = Cookies.get('visiterId');
// //                 const finalID = (isB2B || islogin) ? (loginUserDetail?.id || '0') : (visitorID || '0');
                
// //                 const response = await GetMenuAPI(finalID);
// //                 if (response?.Data?.rd) {
// //                     setMenuData(response.Data.rd);
// //                 }
// //             } catch (err) {
// //                 console.error("Menu API Error:", err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchMenu();
// //     }, [islogin, storeInit, loginUserDetail]);

// //     const formattedMenu = useMemo(() => {
// //         if (!menuData.length) return [];

// //         const uniqueMenuIds = [...new Set(menuData.map(item => item.menuid))];
        
// //         return uniqueMenuIds.map(menuid => {
// //             const mainItem = menuData.find(d => d.menuid === menuid);
// //             const level1Items = menuData.filter(d => d.menuid === menuid);
            
// //             const param1Ids = [...new Set(level1Items.map(item => item.param1dataid))];
            
// //             const children = param1Ids.map(p1id => {
// //                 const p1Item = level1Items.find(d => d.param1dataid === p1id);
// //                 const p2Items = level1Items
// //                     .filter(d => d.param1dataid === p1id && d.param2dataid)
// //                     .map(d => ({
// //                         id: d.param2dataid,
// //                         name: d.param2dataname,
// //                         key: d.param2name
// //                     }));

// //                 return {
// //                     id: p1id,
// //                     name: p1Item.param1dataname,
// //                     key: p1Item.param1id,
// //                     subChildren: p2Items
// //                 };
// //             });

// //             return {
// //                 menuid: mainItem.menuid,
// //                 menuname: mainItem.menuname,
// //                 param0name: mainItem.param0name,
// //                 param0dataname: mainItem.param0dataname,
// //                 children
// //             };
// //         });
// //     }, [menuData]);

// //     const handleNavigate = (m, p1 = null, p2 = null) => {
// //         const filters = [
// //             { k: m.param0name, v: m.param0dataname },
// //             { k: p1?.key, v: p1?.name },
// //             { k: p2?.key, v: p2?.name }
// //         ].filter(f => f.v);

// //         const path = filters.map(f => f.v).join('/');
// //         const queryVal = filters.map(f => f.v).join(',');
// //         const queryKey = filters.map(f => f.k).join(',');
        
// //         const menuEncoded = btoa(`${queryVal}/${queryKey}`);
// //         navigation(`/p/${path}/?M=${menuEncoded}`);
// //     };

// //     if (loading) return (
// //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
// //             <CircularProgress sx={{ color: COLORS.primary }} />
// //         </Box>
// //     );

// //     // B2B Login Guard
// //     if (storeInit?.IsB2BWebsite === 1 && !islogin) {
// //         return (
// //             <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, textAlign: 'center', bgcolor: '#f9f9f9' }}>
// //                 <LogIn size={48} color="#D6B08B" style={{ marginBottom: '16px' }} />
// //                 <Typography variant="h5" fontWeight={700}>Exclusive Access</Typography>
// //                 <Typography sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>Please sign in to view our exclusive B2B collection.</Typography>
// //                 <ButtonBase 
// //                     onClick={() => navigation('/signin')}
// //                     sx={{ bgcolor: COLORS.primary, color: 'white', px: 6, py: 1.5, borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 12px rgba(214,176,139,0.3)' }}
// //                 >
// //                     Sign In
// //                 </ButtonBase>
// //             </Box>
// //         );
// //     }

// //     return (
// //         <Box sx={{ display: 'flex', height: 'calc(100vh - 60px)', bgcolor: '#fff', overflow: 'hidden' }}>
// //             <Box sx={{ width: '100px', bgcolor: '#fff', height: '100%', overflowY: 'auto', borderRight: '1px solid #e0e0e0' }}>
// //                 {formattedMenu.map((item, idx) => (
// //                     <ButtonBase
// //                         key={item.menuid}
// //                         onClick={() => setActiveTab(idx)}
// //                         sx={{
// //                             width: '100%',
// //                             flexDirection: 'column',
// //                             py: 1.5,
// //                             px: 0.5,
// //                             position: 'relative',
// //                             transition: 'all 0.2s',
// //                             bgcolor: activeTab === idx ? '#fff' : 'transparent',
// //                             borderLeft: activeTab === idx ? '4px solidCOLORS.primary : '4px solid transparent'
// //                         }}
// //                     >
// //                         <Box sx={{ 
// //                             width: 38, height: 38, bgcolor: activeTab === idx ? COLORS.primary : '#eee', 
// //                             borderRadius: '18px', mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' 
// //                         }}>
// //                             <DashboardRoundedIcon size={16} sx={{
// //                               color : activeTab === idx ? '#fff' : '#888'
// //                             }} />
// //                         </Box>
// //                         <Typography sx={{ 
// //                             fontSize: '11px', fontWeight: activeTab === idx ? 700 : 500, 
// //                             textAlign: 'center', color: activeTab === idx ? '#000' : '#666',
// //                             lineHeight: 1.2
// //                         }}>
// //                             {item.menuname}
// //                         </Typography>
// //                     </ButtonBase>
// //                 ))}
// //             </Box>

// //             {/* RIGHT CONTENT AREA */}
// //             <Box sx={{ flex: 1, height: '100%', overflowY: 'auto', p: 2, bgcolor: '#fff' }}>
// //                 <AnimatePresence mode="wait">
// //                     <motion.div
// //                         key={activeTab}
// //                         initial={{ opacity: 0, x: 10 }}
// //                         animate={{ opacity: 1, x: 0 }}
// //                         exit={{ opacity: 0, x: -10 }}
// //                         transition={{ duration: 0.2 }}
// //                     >
// //                         {/* Header & View All */}
// //                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
// //                             <Typography variant="h6" fontWeight={800} sx={{ color: '#222' }}>
// //                                 {formattedMenu[activeTab]?.menuname}
// //                             </Typography>
// //                             <ButtonBase 
// //                                 onClick={() => handleNavigate(formattedMenu[activeTab])}
// //                                 sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '14px' }}
// //                             >
// //                                 View All <ChevronRight size={16} />
// //                             </ButtonBase>
// //                         </Box>

// //                         {/* Level 1 Sections */}
// //                         {formattedMenu[activeTab]?.children.map((sub) => (
// //                             <Box key={sub.id} sx={{ mb: 4 }}>
// //                                 <Typography 
// //                                     onClick={() => handleNavigate(formattedMenu[activeTab], sub)}
// //                                     sx={{ fontWeight: 700, fontSize: '15px', mb: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
// //                                 >
// //                                     {sub.name} <ChevronRight size={14} style={{ marginLeft: 4, opacity: 0.5 }} />
// //                                 </Typography>

// //                                 {/* Level 2 Grid - Blinkit Style Bubble Links */}
// //                                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
// //                                     {sub.subChildren.map((child) => (
// //                                         <ButtonBase
// //                                             key={child.id}
// //                                             onClick={() => handleNavigate(formattedMenu[activeTab], sub, child)}
// //                                             sx={{
// //                                                 px: 2,
// //                                                 py: 1,
// //                                                 borderRadius: '20px',
// //                                                 border: '1px solid #eee',
// //                                                 fontSize: '13px',
// //                                                 bgcolor: '#fafafa',
// //                                                 '&:active': { bgcolor: '#FDF7F0', borderColor: '#D6B08B' }
// //                                             }}
// //                                         >
// //                                             {child.name}
// //                                         </ButtonBase>
// //                                     ))}
// //                                 </Box>
// //                             </Box>
// //                         ))}
// //                     </motion.div>
// //                 </AnimatePresence>
// //             </Box>
// //         </Box>
// //     );
// // };

// // export default Menu;