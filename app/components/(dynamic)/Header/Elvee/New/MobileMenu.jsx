import React from "react";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    alpha,
    Divider,
    Chip // Added for the tabs
} from "@mui/material";
import {
    ChevronRightRounded as ChevronRightIcon,
    ArrowBackRounded as ArrowBackIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";


const tabsData = [
    {
        id: 0,
        gradient: {
            bg: "linear-gradient(135deg, #FFF5F8 0%, #FDECF2 40%, #F8DDE7 100%)",
            color: "#7A3E55",
            border: "#f4c7d8",
            borderDark: "#C97A96", // rose dark accent
        },
    },
    {
        id: 1,
        gradient: {
            bg: "linear-gradient(135deg, #FFF4DA 0%, #F7E6BC 45%, #E8CF92 100%)",
            color: "#7A5A21",
            border: "#e8cf92",
            borderDark: "#B8933A", // warm gold dark accent
        },
    },
    {
        id: 2,
        gradient: {
            bg: "linear-gradient(135deg, #F1FFF7 0%, #E2F7ED 45%, #CFF2DF 100%)",
            color: "#2A6F56",
            border: "#b4e4cc",
            borderDark: "#4C9B7A", // soft emerald dark accent
        },
    },
];


const MobileMenu = ({
    activeMenu,
    menuItems,
    handleMobileMenuClick,
    handleMobileBack,
    handelMenu,
    islogin,
    storeinit,
    IsB2BWebsiteChek,
    // New Props
    DynamicMenu,
    selectedProductType,
    handleTabChange
}) => {

    if (activeMenu) {
        const currentMenuItem = menuItems.find(
            (item) => item?.menuname === activeMenu
        );

        if (!currentMenuItem) {
            return (
                <Box sx={{ p: 2 }}>
                    <Typography onClick={handleMobileBack}>Unknown Menu (Go Back)</Typography>
                </Box>
            );
        }

        if (currentMenuItem?.param1?.length) {
            return (
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: "1px solid #f1f1f1",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            bgcolor: "#fff"
                        }}
                    >
                        <IconButton
                            onClick={handleMobileBack}
                            sx={{
                                color: "#000",
                                p: 0.8,
                                mr: 0.5,
                                bgcolor: alpha("#000", 0.05),
                                "&:hover": { bgcolor: alpha("#000", 0.08) },
                            }}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>

                        <Typography
                            onClick={(e) => {
                                e.stopPropagation();
                                handelMenu(
                                    {
                                        menuname: currentMenuItem?.menuname,
                                        key: currentMenuItem?.param0name,
                                        value: currentMenuItem?.param0dataname,
                                    },
                                    {}, {}, e, currentMenuItem?.IsFilterKey1Ignore
                                );
                            }}
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#000",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            {activeMenu}
                        </Typography>
                    </Box>

                    <List sx={{ flex: 1, py: 1, bgcolor: "#fff", overflowY: "auto" }}>
                        {currentMenuItem.param1.map((section, sectionIndex) => (
                            <Box key={sectionIndex}>
                                <ListItem disablePadding sx={{ bgcolor: "#fff", px: 3, py: 0.8 }}>
                                    <Typography
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handelMenu(
                                                {
                                                    menuname: currentMenuItem?.menuname,
                                                    key: currentMenuItem?.param0name,
                                                    value: currentMenuItem?.param0dataname,
                                                },
                                                {
                                                    key: section?.param1name,
                                                    value: section?.param1dataname,
                                                },
                                                {}, e, section?.IsFilterKey1Ignore
                                            );
                                        }}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                            color: "#3C3C3C",
                                            textTransform: "capitalize",
                                            cursor: "pointer",
                                            "&:hover": { textDecoration: "underline" },
                                        }}
                                    >
                                        {section.param1dataname}
                                    </Typography>
                                </ListItem>
                                {section.param2?.length > 0 && (() => {
                                    const validParam2Items = section.param2.filter(
                                        (p) => p?.param2dataname && p.param2dataname.trim() !== ""
                                    );
                                    if (validParam2Items.length === 0) return null;
                                    return (
                                        <Box sx={{ pl: 1 }}>
                                            {validParam2Items.map((param2Item, param2Index) => (
                                                <ListItemButton
                                                    key={param2Index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handelMenu(
                                                            {
                                                                menuname: currentMenuItem?.menuname,
                                                                key: currentMenuItem?.param0name,
                                                                value: currentMenuItem?.param0dataname,
                                                            },
                                                            {
                                                                key: section?.param1name,
                                                                value: section?.param1dataname,
                                                            },
                                                            {
                                                                key: param2Item?.param2name,
                                                                value: param2Item?.param2dataname,
                                                            },
                                                            e, param2Item?.IsFilterKey2Ignore
                                                        );
                                                    }}
                                                    sx={{
                                                        py: 0, px: 2, transition: "all 0.2s ease",
                                                        "&:hover": { bgcolor: alpha("#000", 0.04) },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={param2Item?.param2dataname}
                                                        primaryTypographyProps={{ sx: { fontSize: "0.9rem", color: "#555" } }}
                                                    />
                                                </ListItemButton>
                                            ))}
                                        </Box>
                                    );
                                })()}
                                <Divider sx={{ my: 0.5 }} />
                            </Box>
                        ))}
                    </List>
                </Box>
            );
        }
    }

    // 2. MAIN MENU VIEW
    return (
        <List sx={{ pt: 0, bgcolor: "#fff" }}>

            {/* PRODUCT TYPE TABS (Diamond, Gold, etc) */}
            {DynamicMenu && DynamicMenu?.length > 0 && (
                <Box sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 0.5,
                    px: 2,
                    py: 2,
                    borderBottom: '1px solid #f0f0f0',
                    '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for cleaner look
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}>
                    {DynamicMenu?.slice(0, 3).map((item, i) => {
                        const isActive = selectedProductType === item.ProductTypeName;
                        return (
                            <>

                                <Box
                                    key={item.ProductTypeName}
                                    onClick={() => handleTabChange(item.ProductTypeName)}
                                    sx={{
                                        px: 1,
                                        py: 0.8,
                                        borderRadius: 8,
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "all 0.3s ease",
                                        boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
                                        position: "relative",
                                        borderRadius: 999,
                                    }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="productType-pill"
                                            transition={{
                                                type: "spring",
                                                stiffness: 420,
                                                damping: 30,
                                            }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                borderRadius: 999,
                                                background: tabsData[i]?.gradient.bg,
                                                color: tabsData[i]?.gradient.color,
                                                zIndex: 0,
                                            }}
                                        />
                                    )}
                                    <Typography
                                        sx={{
                                            position: "relative",
                                            zIndex: 1,
                                            fontSize: "0.72rem",
                                            fontWeight: isActive ? 700 : 500,
                                            letterSpacing: 1,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {item.ProductTypeName}
                                    </Typography>
                                </Box>
                            </>
                        );
                    })}
                </Box>
            )}

            {!islogin && (
                <ListItem disablePadding>
                    <ListItemButton
                        component="a"
                        href="/LoginOption"
                        sx={{
                            py: 1.5,
                            px: 3,
                            borderBottom: "1px solid #f3f3f3",
                            "&:hover": { bgcolor: alpha("#000", 0.04) },
                        }}
                    >
                        <ListItemText
                            primary="Login"
                            primaryTypographyProps={{
                                sx: { fontSize: "1rem", fontWeight: 500, letterSpacing: 0.4, color: "#3C3C3C" },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            )}

            {/* DYNAMIC MENU ITEMS (Rings, Earrings, etc.) */}
            {menuItems.map((item, index) => (
                <ListItem
                    key={index}
                    disablePadding
                    secondaryAction={
                        item.param1?.length ? (
                            <IconButton
                                edge="end"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMobileMenuClick(item.menuname, true);
                                }}
                                sx={{ color: "#000" }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        ) : null
                    }
                    sx={{ borderBottom: "1px solid #f3f3f3" }}
                >
                    <ListItemButton
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.param1?.length) {
                                // If it has submenu, go to submenu
                                handleMobileMenuClick(item.menuname, true);
                            } else {
                                // If direct link
                                handelMenu(
                                    {
                                        menuname: item?.menuname,
                                        key: item?.param0name,
                                        value: item?.param0dataname,
                                    },
                                    {}, {}, e, item?.IsFilterKey1Ignore
                                );
                            }
                        }}
                        sx={{ py: 1.5, px: 3, "&:hover": { bgcolor: alpha("#000", 0.04) } }}
                    >
                        <ListItemText
                            primary={item.menuname}
                            primaryTypographyProps={{
                                sx: { fontSize: "1rem", fontWeight: 500, letterSpacing: 0.4, color: "#3C3C3C" },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}

            {/* STATIC LINKS */}
            {islogin && (
                <ListItem disablePadding>
                    <ListItemButton
                        component="a"
                        href="/p/NewArrival/?N=TmV3QXJyaXZhbA=="
                        sx={{
                            py: 1.5, px: 3, borderBottom: "1px solid #f3f3f3",
                            "&:hover": { bgcolor: alpha("#000", 0.04) },
                        }}
                    >
                        <ListItemText
                            primary="New Arrivals"
                            primaryTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 500, letterSpacing: 0.4, color: "#3C3C3C" } }}
                        />
                    </ListItemButton>
                </ListItem>
            )}

            {/* Lookbook Logic */}
            {storeinit?.IsDesignSetInMenu == 1 && (
                <ListItem disablePadding>
                    <ListItemButton
                        component="a"
                        href="/Lookbook"
                        sx={{
                            py: 1.5, px: 3,
                            "&:hover": { bgcolor: alpha("#000", 0.04) },
                        }}
                    >
                        <ListItemText
                            primary={storeinit?.DesignSetInMenu || "LOOKBOOK"}
                            primaryTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 500, letterSpacing: 0.4, color: "#3C3C3C" } }}
                        />
                    </ListItemButton>
                </ListItem>
            )}

            {/* Account / Cart Logic */}
            {islogin && !storeinit?.IsPLW && (
                <ListItem disablePadding>
                    <ListItemButton
                        component="a"
                        href="/account"
                        sx={{
                            py: 1.5, px: 3, borderBottom: "1px solid #f3f3f3",
                            "&:hover": { bgcolor: alpha("#000", 0.04) },
                        }}
                    >
                        <ListItemText
                            primary="Account"
                            primaryTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 500, letterSpacing: 0.4, color: "#3C3C3C" } }}
                        />
                    </ListItemButton>
                </ListItem>
            )}

            {islogin && (
                <ListItem disablePadding>
                    <ListItemButton
                        component="a"
                        href="/cartPage"
                        sx={{
                            py: 1.5, px: 3, borderBottom: "1px solid #f3f3f3",
                            "&:hover": { bgcolor: alpha("#000", 0.04) },
                        }}
                    >
                        <ListItemText
                            primary="Cart"
                            primaryTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 500, letterSpacing: 0.4, color: "#3C3C3C" } }}
                        />
                    </ListItemButton>
                </ListItem>
            )}
        </List>
    );
};

export default MobileMenu;
// import React from "react";
// import {
//     Box,
//     IconButton,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemText,
//     Typography,
//     alpha,
//     Divider,
//     islogin,
//     storeinit,
//     IsB2BWebsiteChek,
//     ListItemIcon,
// } from "@mui/material";
// import {
//     ChevronRightRounded as ChevronRightIcon,
//     ArrowBackRounded as ArrowBackIcon,
// } from "@mui/icons-material";
// import { SquareUser } from "lucide-react";

// const MobileMenu = ({
//     activeMenu,
//     menuItems,
//     handleMobileMenuClick,
//     handleMobileBack,
//     handelMenu,
//     islogin,
//     storeinit,
//     IsB2BWebsiteChek,
// }) => {
//     if (activeMenu) {
//         const currentMenuItem = menuItems.find(
//             (item) => item?.menuname === activeMenu
//         );

//         if (currentMenuItem?.param1?.length) {
//             return (
//                 <Box
//                     sx={{
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         bgcolor: "#fff",
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             p: 2,
//                             borderBottom: "1px solid #f1f1f1",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1,
//                             pos: "sticky",
//                             top: 0,
//                             zIndex: 1,
//                         }}
//                     >
//                         <IconButton
//                             onClick={handleMobileBack}
//                             sx={{
//                                 color: "#000",
//                                 p: 0.8,
//                                 mr: 0.5,
//                                 bgcolor: alpha("#000", 0.05),
//                                 "&:hover": { bgcolor: alpha("#000", 0.08) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" />
//                         </IconButton>

//                         {/* Title is clickable */}
//                         <Typography
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handelMenu(
//                                     {
//                                         menuname: currentMenuItem?.menuname,
//                                         key: currentMenuItem?.param0name,
//                                         value: currentMenuItem?.param0dataname,
//                                     },
//                                     {},
//                                     {},
//                                     e,
//                                     currentMenuItem?.IsFilterKey1Ignore
//                                 );
//                             }}
//                             variant="h6"
//                             sx={{
//                                 fontWeight: 600,
//                                 color: "#000",
//                                 cursor: "pointer",
//                                 "&:hover": { textDecoration: "underline" },
//                             }}
//                         >
//                             {activeMenu}
//                         </Typography>
//                     </Box>

//                     {/* List of sections */}
//                     <List
//                         sx={{
//                             flex: 1,
//                             py: 1,
//                             bgcolor: "#fff",
//                         }}
//                     >
//                         {currentMenuItem.param1.map((section, sectionIndex) => (
//                             <Box key={sectionIndex}>
//                                 <ListItem
//                                     disablePadding
//                                     sx={{
//                                         bgcolor: "#fff",
//                                         px: 3,
//                                         py: 0.8,
//                                     }}
//                                 >
//                                     <Typography
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handelMenu(
//                                                 {
//                                                     menuname: currentMenuItem?.menuname,
//                                                     key: currentMenuItem?.param0name,
//                                                     value: currentMenuItem?.param0dataname,
//                                                 },
//                                                 {
//                                                     key: section?.param1name,
//                                                     value: section?.param1dataname,
//                                                 },
//                                                 {},
//                                                 e,
//                                                 section?.IsFilterKey1Ignore
//                                             );
//                                         }}
//                                         sx={{
//                                             fontWeight: 600,
//                                             fontSize: "0.9rem",
//                                             color: "#3C3C3C",
//                                             textTransform: "capitalize",
//                                             cursor: "pointer",
//                                             "&:hover": {
//                                                 textDecoration: "underline",
//                                             },
//                                         }}
//                                     >
//                                         {section.param1dataname}
//                                     </Typography>
//                                 </ListItem>
//                                 {section.param2?.length > 0 && (() => {
//                                     const validParam2Items = section.param2.filter(
//                                         (p) => p?.param2dataname && p.param2dataname.trim() !== ""
//                                     );
//                                     if (validParam2Items.length === 0) return null;
//                                     return (
//                                         <Box sx={{ pl: 1 }}>
//                                             {validParam2Items.map((param2Item, param2Index) => (
//                                                 <ListItemButton
//                                                     key={param2Index}
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         handelMenu(
//                                                             {
//                                                                 menuname: currentMenuItem?.menuname,
//                                                                 key: currentMenuItem?.param0name,
//                                                                 value: currentMenuItem?.param0dataname,
//                                                             },
//                                                             {
//                                                                 key: section?.param1name,
//                                                                 value: section?.param1dataname,
//                                                             },
//                                                             {
//                                                                 key: param2Item?.param2name,
//                                                                 value: param2Item?.param2dataname,
//                                                             },
//                                                             e,
//                                                             param2Item?.IsFilterKey2Ignore
//                                                         );
//                                                     }}
//                                                     sx={{
//                                                         py: 0,
//                                                         px: 2,
//                                                         transition: "all 0.2s ease",
//                                                         "&:hover": {
//                                                             bgcolor: alpha("#000", 0.04),
//                                                         },
//                                                     }}
//                                                 >
//                                                     <ListItemText
//                                                         primary={param2Item?.param2dataname}
//                                                         primaryTypographyProps={{
//                                                             sx: {
//                                                                 fontSize: "0.9rem",
//                                                                 color: "#555",
//                                                             },
//                                                         }}
//                                                     />
//                                                 </ListItemButton>
//                                             ))}
//                                         </Box>
//                                     );
//                                 })()}

//                                 <Divider sx={{ my: 0.5 }} />
//                             </Box>
//                         ))}
//                     </List>
//                 </Box>
//             );
//         }
//     }
//     return (
//         <List
//             sx={{
//                 pt: 0,
//                 bgcolor: "#fff",
//             }}
//         >
//             {!islogin && (
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         component="a"
//                         href="/LoginOption"
//                         sx={{
//                             py: 1,
//                             px: 3,
//                             borderBottom: "1px solid #f3f3f3",
//                             "&:hover": { bgcolor: alpha("#000", 0.04) },
//                         }}
//                     >
//                         <ListItemText
//                             primary="Login"
//                             primaryTypographyProps={{
//                                 sx: {
//                                     fontSize: "1rem",
//                                     fontWeight: 500,
//                                     letterSpacing: 0.4,
//                                     color: "#3C3C3C",
//                                 },
//                             }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//             )}
//             {menuItems.map((item, index) => (
//                 <ListItem
//                     key={index}
//                     disablePadding
//                     secondaryAction={
//                         item.param1?.length ? (
//                             <IconButton
//                                 edge="end"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleMobileMenuClick(item.menuname, true);
//                                 }}
//                                 sx={{ color: "#000" }}
//                             >
//                                 <ChevronRightIcon />
//                             </IconButton>
//                         ) : null
//                     }
//                     sx={{
//                         borderBottom: "1px solid #f3f3f3",
//                     }}
//                 >
//                     <ListItemButton
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handelMenu(
//                                 {
//                                     menuname: item?.menuname,
//                                     key: item?.param0name,
//                                     value: item?.param0dataname,
//                                 },
//                                 {},
//                                 {},
//                                 e,
//                                 item?.IsFilterKey1Ignore
//                             );
//                         }}
//                         sx={{
//                             py: 1,
//                             px: 3,
//                             "&:hover": {
//                                 bgcolor: alpha("#000", 0.04),
//                             },
//                         }}
//                     >
//                         <ListItemText
//                             primary={item.menuname}
//                             primaryTypographyProps={{
//                                 sx: {
//                                     fontSize: "1rem",
//                                     fontWeight: 500,
//                                     letterSpacing: 0.4,
//                                     color: "#3C3C3C",
//                                 },
//                             }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//             ))}
//             {/* NEW ARRIVALS (if logged in) */}
//             {islogin && (
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         component="a"
//                         href="/p/NewArrival/?N=TmV3QXJyaXZhbA=="
//                         sx={{
//                             py: 1,
//                             px: 3,
//                             borderBottom: "1px solid #f3f3f3",
//                             "&:hover": { bgcolor: alpha("#000", 0.04) },
//                         }}
//                     >
//                         <ListItemText
//                             primary="New Arrivals"
//                             primaryTypographyProps={{
//                                 sx: {
//                                     fontSize: "1rem",
//                                     fontWeight: 500,
//                                     letterSpacing: 0.4,
//                                     color: "#3C3C3C",
//                                 },
//                             }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//             )}
//             {storeinit?.IsDesignSetInMenu == 1 && (
//                 <>
//                     {IsB2BWebsiteChek == 1 ? (
//                         islogin && (
//                             <ListItem disablePadding>
//                                 <ListItemButton
//                                     component="a"
//                                     href="/Lookbook"
//                                     sx={{
//                                         py: 1,
//                                         px: 3,
//                                         borderBottom: "1px solid #f3f3f3",
//                                         "&:hover": { bgcolor: alpha("#000", 0.04) },
//                                     }}
//                                 >
//                                     <ListItemText
//                                         primary={storeinit?.DesignSetInMenu || "LOOKBOOK"}
//                                         primaryTypographyProps={{
//                                             sx: {
//                                                 fontSize: "1rem",
//                                                 fontWeight: 500,
//                                                 letterSpacing: 0.4,
//                                                 color: "#3C3C3C",
//                                             },
//                                         }}
//                                     />
//                                 </ListItemButton>
//                             </ListItem>
//                         )
//                     ) : (
//                         <ListItem disablePadding>
//                             <ListItemButton
//                                 component="a"
//                                 href="/Lookbook"
//                                 sx={{
//                                     py: 1,
//                                     px: 3,
//                                     "&:hover": { bgcolor: alpha("#000", 0.04) },
//                                 }}
//                             >
//                                 <ListItemText
//                                     primary={storeinit?.DesignSetInMenu || "LOOKBOOK"}
//                                     primaryTypographyProps={{
//                                         sx: {
//                                             fontSize: "1rem",
//                                             fontWeight: 500,
//                                             letterSpacing: 0.4,
//                                             color: "#3C3C3C",
//                                         },
//                                     }}
//                                 />
//                             </ListItemButton>
//                         </ListItem>
//                     )}
//                 </>
//             )}
//             {IsB2BWebsiteChek == 0 ? (
//                 storeinit?.IsPLW ? (
//                     ""
//                 ) : (
//                     <>
//                         {islogin && (
//                             <ListItem disablePadding>
//                                 <ListItemButton
//                                     component="a"
//                                     href="/account"
//                                     sx={{
//                                         py: 1,
//                                         px: 3,
//                                         borderBottom: "1px solid #f3f3f3",
//                                         "&:hover": { bgcolor: alpha("#000", 0.04) },
//                                     }}

//                                 >
//                                     <ListItemText

//                                         primary="Account"
//                                         primaryTypographyProps={{
//                                             sx: {
//                                                 fontSize: "1rem",
//                                                 fontWeight: 500,
//                                                 letterSpacing: 0.4,
//                                                 color: "#3C3C3C",
//                                             },
//                                         }}
//                                     />
//                                 </ListItemButton>
//                             </ListItem>
//                         )}
//                     </>
//                 )
//             ) : islogin && storeinit?.IsPLW ? (
//                 ""
//             ) : (
//                 <>
//                     {islogin === true && (
//                         <ListItem disablePadding>
//                             <ListItemButton
//                                 component="a"
//                                 href="/account"
//                                 sx={{
//                                     py: 1,
//                                     px: 3,
//                                     borderBottom: "1px solid #f3f3f3",
//                                     "&:hover": { bgcolor: alpha("#000", 0.04) },
//                                 }}

//                             >
//                                 <ListItemText

//                                     primary="Account"
//                                     primaryTypographyProps={{
//                                         sx: {
//                                             fontSize: "1rem",
//                                             fontWeight: 500,
//                                             letterSpacing: 0.4,
//                                             color: "#3C3C3C",
//                                         },
//                                     }}
//                                 />
//                             </ListItemButton>
//                         </ListItem>
//                     )}
//                 </>
//             )}
//             {islogin && (
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         component="a"
//                         href="/cartPage"
//                         sx={{
//                             py: 1,
//                             px: 3,
//                             borderBottom: "1px solid #f3f3f3",
//                             "&:hover": { bgcolor: alpha("#000", 0.04) },
//                         }}
//                     >
//                         <ListItemText
//                             primary="Cart"
//                             primaryTypographyProps={{
//                                 sx: {
//                                     fontSize: "1rem",
//                                     fontWeight: 500,
//                                     letterSpacing: 0.4,
//                                     color: "#3C3C3C",
//                                 },
//                             }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//             )}
//         </List>
//     );
// };

// export default MobileMenu;
