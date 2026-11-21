"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { Box, Button, CircularProgress, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FolderHeart, Globe2, LockKeyhole, ArrowUpRight } from "lucide-react";

const imageNotFound = "/image-not-found.jpg";

function buildAlbumCoverUrl(album, albumImageBase) {
    const base = String(albumImageBase || "")
        .trim()
        .replace(/\/+$/, "")
        .replace(/(^|\/)AlbumImages$/i, "$1ProAlbumImages");
    const folder = String(album?.AlbumImageFol || "").trim().replace(/^\/+|\/+$/g, "");
    const imageName = String(album?.AlbumImageName || "").trim();

    if (!base || !/\/ProAlbumImages$/i.test(base) || !folder || !imageName) return "";

    const encodedName = encodeURIComponent(imageName).replace(/%25([0-9a-f]{2})/gi, "%$1");
    return `${base}/${folder}/${encodedName}`;
}

function getDesignImageUrl(design, storeInit) {
    const base = storeInit?.CDNDesignImageFol || storeInit?.DesignImageFol || "";
    const designNo = design?.designno || design?.autocode;
    if (!base || !designNo) return imageNotFound;

    const ext = design?.ImageExtension || "webp";
    return `${base}${designNo}~1.${ext}`;
}

function AlbumArtwork({ album, storeInit }) {
    const coverUrl = buildAlbumCoverUrl(album, storeInit?.AlbumImageFol);
    const [coverFailed, setCoverFailed] = useState(false);
    const designs = Array.isArray(album?.designs) ? album.designs.slice(0, 3) : [];

    useEffect(() => setCoverFailed(false), [coverUrl]);

    if (coverUrl && !coverFailed) {
        return (
            <Box sx={{ width: "100%", height: "100%", overflow: "hidden", bgcolor: "#F4F4F5" }}>
                <Box
                    component="img"
                    src={coverUrl}
                    alt={album?.albumName || "Album cover"}
                    loading="lazy"
                    onError={() => setCoverFailed(true)}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            </Box>
        );
    }

    if (designs.length === 0) {
        return (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center", bgcolor: "#F4F4F5", color: "#A1A1AA" }}>
                <FolderHeart size={34} strokeWidth={1.25} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: designs.length > 1 ? "1.15fr 0.85fr" : "1fr",
                gridTemplateRows: designs.length > 1 ? "1fr 1fr" : "1fr",
                gap: "3px",
                overflow: "hidden",
                bgcolor: "#fff",
            }}
        >
            {designs.map((design, index) => (
                <Box
                    key={design.id || design.autocode || index}
                    component="img"
                    src={getDesignImageUrl(design, storeInit)}
                    alt={design.TitleLine || `${album?.albumName || "Album"} design ${index + 1}`}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = imageNotFound;
                    }}
                    sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: 0,
                        objectFit: "cover",
                        gridColumn: index === 0 && designs.length > 1 ? "1" : "2",
                        gridRow: index === 0 && designs.length > 1 ? "1 / span 2" : index === 1 ? "1" : "2",
                        bgcolor: "#F4F4F5",
                    }}
                />
            ))}
        </Box>
    );
}

function AlbumCard({ album, access, storeInit, onClick, onLoginRequired, showLoginLock, index }) {
    const designCount = Number(album?.designCount || album?.totalAutocodes || album?.designs?.length || 0);
    const isPrivate = access === "private";

    return (
        <Box
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick();
                }
            }}
            sx={{
                height: "100%",
                cursor: "pointer",
                borderRadius: { xs: "14px", sm: "18px" },
                overflow: "hidden",
                bgcolor: "#fff",
                boxShadow: "0 8px 28px rgba(35, 29, 24, 0.07)",
                transition: "transform 220ms ease, box-shadow 220ms ease",
                animation: "album-enter 420ms ease both",
                animationDelay: `${index * 45}ms`,
                "@keyframes album-enter": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 14px 34px rgba(35, 29, 24, 0.12)", "& .album-open-icon": { opacity: 1, transform: "translate(0, 0)" } },
                "&:focus-visible": { outline: "2px solid #0F3D4C", outlineOffset: 3 },
            }}
        >
            <Box sx={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden" }}>
                <AlbumArtwork album={album} storeInit={storeInit} />
                <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 0.6, px: 1.15, py: 0.6, borderRadius: "20px", bgcolor: "rgba(255,255,255,0.9)", color: "#334155", backdropFilter: "blur(8px)" }}>
                    {isPrivate ? <LockKeyhole size={13} strokeWidth={1.7} /> : <Globe2 size={13} strokeWidth={1.7} />}
                    <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.03em" }}>{isPrivate ? "PRIVATE" : "PUBLIC"}</Typography>
                </Box>
                <Box className="album-open-icon" sx={{ position: "absolute", right: 12, bottom: 12, width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.92)", color: "#0F3D4C", opacity: { xs: 1, sm: 0 }, transform: { sm: "translate(4px, 4px)" }, transition: "all 180ms ease" }}>
                    <ArrowUpRight size={17} strokeWidth={1.7} />
                </Box>
                {showLoginLock && (
                    <Box
                        component="button"
                        type="button"
                        aria-label={`Log in to access ${album?.albumName || "this album"}`}
                        onClick={(event) => {
                            event.stopPropagation();
                            onLoginRequired();
                        }}
                        onKeyDown={(event) => event.stopPropagation()}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            zIndex: 2,
                            display: "grid",
                            placeItems: "center",
                            width: 64,
                            height: 64,
                            p: 0,
                            border: 0,
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "transparent",
                            cursor: "pointer",
                            "&:focus-visible": { outline: "2px solid #0F3D4C", outlineOffset: -4 },
                            "&:hover .album-login-lock": { transform: "scale(1.08)", bgcolor: "#fff" },
                        }}
                    >
                        <Box className="album-login-lock" sx={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.94)", color: "#0F3D4C", boxShadow: "0 4px 18px rgba(15,61,76,0.18)", transition: "transform 180ms ease, background-color 180ms ease" }}>
                            <LockKeyhole size={21} strokeWidth={1.8} />
                        </Box>
                    </Box>
                )}
            </Box>

            <Box sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 1.8 } }}>
                <Typography noWrap sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: "1rem", sm: "1.12rem" }, color: "#27272A" }}>
                    {album?.albumName || album?.albumcode || "Jewellery Album"}
                </Typography>
                <Typography sx={{ mt: 0.45, fontSize: "0.76rem", color: "#85818A" }}>
                    {designCount} {designCount === 1 ? "Design" : "Designs"}
                </Typography>
            </Box>
        </Box>
    );
}

export default function AlbumSection() {
    const router = useRouter();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
    const { islogin, loginUserDetail, storeInit } = useStore();
    const domain = storeInit?.domain || "procatalog.web";
    const customerId = loginUserDetail?.id || loginUserDetail?.CustomerId || loginUserDetail?.customerid;
    const [activeTab, setActiveTab] = useState("public");
    const [albums, setAlbums] = useState({ public: [], private: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadAlbums() {
            setLoading(true);
            setError(false);
            try {
                const requests = [
                    fetch(`/api/sqlite/exclusive-albums?domain=${encodeURIComponent(domain)}&customerId=0`, { signal: controller.signal }),
                ];
                if (islogin && customerId) {
                    requests.push(fetch(`/api/sqlite/exclusive-albums?domain=${encodeURIComponent(domain)}&customerId=${encodeURIComponent(customerId)}`, { signal: controller.signal }));
                }

                const responses = await Promise.all(requests);
                const payloads = await Promise.all(responses.map((response) => response.ok ? response.json() : null));
                setAlbums({
                    public: Array.isArray(payloads[0]?.Data?.rd) ? payloads[0].Data.rd : [],
                    private: Array.isArray(payloads[1]?.Data?.rd) ? payloads[1].Data.rd : [],
                });
            } catch (fetchError) {
                if (fetchError?.name !== "AbortError") {
                    setError(true);
                    setAlbums({ public: [], private: [] });
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadAlbums();
        return () => controller.abort();
    }, [domain, islogin, customerId]);

    const tabs = useMemo(() => [
        { key: "public", label: "Albums", Icon: Globe2 },
        { key: "private", label: "My Albums", Icon: LockKeyhole },
    ], []);
    const visibleAlbums = albums[activeTab] || [];
    const maxVisibleAlbums = isLargeScreen ? 8 : isMediumScreen ? 6 : 4;
    const displayedAlbums = useMemo(() => visibleAlbums.slice(0, maxVisibleAlbums), [visibleAlbums, maxVisibleAlbums]);
    const loginLockIndexes = useMemo(() => {
        if (islogin || displayedAlbums.length === 0) return new Set();
        const lockCount = Math.min(displayedAlbums.length, Math.random() < 0.5 ? 1 : 2);
        const indexes = new Set();
        while (indexes.size < lockCount) indexes.add(Math.floor(Math.random() * displayedAlbums.length));
        return indexes;
    }, [displayedAlbums, islogin]);

    useEffect(() => {
        if (!islogin || typeof window === "undefined") return;
        if (window.sessionStorage.getItem("procatalog_album_tab_after_login") === "private") {
            window.sessionStorage.removeItem("procatalog_album_tab_after_login");
            setActiveTab("private");
        }
    }, [islogin]);

    const selectAlbumTab = (tabKey) => {
        if (tabKey === "private" && !islogin) {
            if (typeof window !== "undefined") {
                window.sessionStorage.setItem("procatalog_album_tab_after_login", "private");
            }
            const returnUrl = "/?albumTab=private";
            router.push(`/LoginOption?LoginRedirect=${encodeURIComponent(returnUrl)}`);
            return;
        }
        setActiveTab(tabKey);
    };

    const openAlbum = (album) => {
        const params = new URLSearchParams({ "exclusive-album": "1" });
        if (album?.RandomNo) params.set("randomNo", String(album.RandomNo));
        else if (album?.CustomerId !== undefined && album?.CustomerId !== null) params.set("customerid", String(album.CustomerId));
        else return;
        router.push(`/?${params.toString()}`);
    };

    const redirectToLoginForAlbum = (album) => {
        const params = new URLSearchParams({ "exclusive-album": "1" });
        if (album?.RandomNo) params.set("randomNo", String(album.RandomNo));
        else if (album?.CustomerId !== undefined && album?.CustomerId !== null) params.set("customerid", String(album.CustomerId));
        const returnUrl = params.size > 1 ? `/?${params.toString()}` : "/";
        router.push(`/LoginOption?LoginRedirect=${encodeURIComponent(returnUrl)}`);
    };

    const openAllAlbums = () => {
        const params = new URLSearchParams({ "exclusive-album": "1" });
        const targetCustomerId = activeTab === "private" ? customerId : 0;
        if (targetCustomerId !== undefined && targetCustomerId !== null) {
            params.set("customerid", String(targetCustomerId));
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <Box component="section" sx={{ bgcolor: "#FBF9F7", py: { xs: 5, md: 8 } }}>
            <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto", px: { xs: 2, sm: 3, md: 5 } }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", gap: 2, mb: { xs: 2.5, md: 3.5 } }}>
                    <Box>
                        <Typography component="span" sx={{ display: "block", mb: 0.6, color: "#8A7A70", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                            Curated collections
                        </Typography>
                        <Typography component="h2" sx={{ fontSize: { xs: "1.6rem", sm: "2rem", md: "2.35rem" }, fontFamily: '"Poppins", sans-serif', fontWeight: 400, letterSpacing: "1.5px", textTransform: "uppercase", color: "#0F3D4C" }}>
                            Albums
                        </Typography>
                    </Box>

                    <Box role="tablist" aria-label="Album visibility" sx={{ display: "flex", gap: 0.75, p: 0.6, borderRadius: "14px", bgcolor: "#EEEAE6" }}>
                        {tabs.map(({ key, label, Icon }) => {
                            const selected = activeTab === key;
                            return (
                                <Box
                                    key={key}
                                    component="button"
                                    type="button"
                                    id={`album-tab-${key}`}
                                    role="tab"
                                    aria-controls={`album-panel-${key}`}
                                    aria-selected={selected}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => selectAlbumTab(key)}
                                    onKeyDown={(event) => {
                                        const currentIndex = tabs.findIndex((tab) => tab.key === key);
                                        let nextIndex = currentIndex;
                                        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
                                        else if (event.key === "ArrowLeft") nextIndex = (currentIndex + tabs.length - 1) % tabs.length;
                                        else if (event.key === "Home") nextIndex = 0;
                                        else if (event.key === "End") nextIndex = tabs.length - 1;
                                        else return;

                                        event.preventDefault();
                                        const nextTab = tabs[nextIndex];
                                        selectAlbumTab(nextTab.key);
                                        event.currentTarget.parentElement?.querySelector(`#album-tab-${nextTab.key}`)?.focus();
                                    }}
                                    sx={{ appearance: "none", border: 0, font: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 0.8, minWidth: { xs: 126, sm: 142 }, px: { xs: 1.25, sm: 1.8 }, py: 1, borderRadius: "10px", cursor: "pointer", color: selected ? "#173F4D" : "#77716C", bgcolor: selected ? "#fff" : "transparent", boxShadow: selected ? "0 2px 8px rgba(0,0,0,0.07)" : "none", transition: "all 180ms ease", "&:focus-visible": { outline: "2px solid #0F3D4C" } }}
                                >
                                    <Icon size={16} strokeWidth={1.6} />
                                    <Typography sx={{ fontSize: { xs: "0.76rem", sm: "0.84rem" }, fontWeight: selected ? 600 : 500, whiteSpace: "nowrap" }}>{label}</Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <Box role="tabpanel" id={`album-panel-${activeTab}`} aria-labelledby={`album-tab-${activeTab}`} tabIndex={0} sx={{ outline: "none" }}>
                    {loading ? (
                        <Box sx={{ minHeight: 210, display: "grid", placeItems: "center" }}><CircularProgress size={28} sx={{ color: "#0F3D4C" }} /></Box>
                    ) : error ? (
                        <Typography sx={{ py: 5, textAlign: "center", color: "#77716C" }}>Albums could not be loaded right now.</Typography>
                    ) : visibleAlbums.length === 0 ? (
                        <Box sx={{ py: { xs: 4, md: 6 }, px: 2, textAlign: "center", border: "1px dashed #D8D2CC", borderRadius: "16px", color: "#77716C" }}>
                            <Typography sx={{ fontSize: "0.95rem" }}>{activeTab === "private" && !islogin ? "Log in to see your private albums." : `No ${activeTab} albums are available right now.`}</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={{ xs: 1.5, sm: 2.25, md: 3 }}>
                            {displayedAlbums.map((album, index) => (
                                <Grid item key={`${album.id}-${album.albumcode || ""}-${album.RandomNo || index}`} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
                                    <AlbumCard album={album} access={activeTab} storeInit={storeInit} index={index} showLoginLock={loginLockIndexes.has(index)} onLoginRequired={() => redirectToLoginForAlbum(album)} onClick={() => openAlbum(album)} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    {!loading && !error && visibleAlbums.length > maxVisibleAlbums && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 2.5, md: 3.5 } }}>
                            <Button
                                type="button"
                                onClick={openAllAlbums}
                                variant="outlined"
                                sx={{
                                    px: 3.5,
                                    py: 1.1,
                                    borderColor: "#0F3D4C",
                                    borderRadius: "10px",
                                    color: "#0F3D4C",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": { borderColor: "#0F3D4C", bgcolor: "rgba(15,61,76,0.05)" },
                                }}
                            >
                                View all {activeTab === "private" ? "my " : ""}albums ({visibleAlbums.length})
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}




// 'use client'
// import React, { useState } from "react";
// import {
//     Box,
//     Card,
//     CardContent,
//     Container,
//     Grid, // Note: If on MUI v6, use: import Grid from '@mui/material/Grid2';
//     IconButton,
//     Typography,
//     keyframes,
// } from "@mui/material";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";

// // Smooth buttery entrance animation when switching tabs
// const fadeSlideUp = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(14px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// // Sample Data matching your screenshot (8 items for a clean 4x2 grid)
// const PRODUCTS = {
//     latest: [
//         {
//             id: 1,
//             price: "₹29,98,049",
//             specs: "18 KT • GH-SI",
//             delivery: "12th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
//             isWhiteBg: true,
//         },
//         {
//             id: 2,
//             badge: "Trending",
//             price: "₹1,61,605",
//             specs: "14 KT • FG-SI",
//             delivery: "26th Nov",
//             image:
//                 "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 3,
//             badge: "Trending",
//             price: "₹75,068",
//             specs: "14 KT • FG-SI",
//             delivery: "26th Nov",
//             image:
//                 "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 4,
//             badge: "Trending",
//             price: "₹95,866",
//             specs: "14 KT • FG-SI",
//             delivery: "26th Nov",
//             image:
//                 "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 5,
//             badge: "Latest",
//             price: "₹1,87,945",
//             originalPrice: "₹2,03,627",
//             specs: "14 KT • FG-SI",
//             offer: "Flat 10% off on Diamond Prices",
//             delivery: "12th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 6,
//             badge: "Latest",
//             price: "₹1,15,663",
//             specs: "14 KT • FG-SI",
//             delivery: "12th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 7,
//             badge: "Latest",
//             price: "₹64,290",
//             originalPrice: "₹71,400",
//             specs: "14 KT • IJ-SI",
//             offer: "Flat 10% off on Diamond Prices",
//             delivery: "14th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 8,
//             badge: "Trending",
//             price: "₹1,42,800",
//             specs: "18 KT • GH-SI",
//             delivery: "15th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80",
//         },
//     ],
//     bestsellers: [
//         {
//             id: 101,
//             badge: "Bestseller",
//             price: "₹84,500",
//             originalPrice: "₹92,000",
//             specs: "14 KT • FG-SI",
//             offer: "Flat 10% off on Diamond Prices",
//             delivery: "28th Nov",
//             image:
//                 "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 102,
//             badge: "Bestseller",
//             price: "₹2,14,900",
//             specs: "18 KT • GH-SI",
//             delivery: "10th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 103,
//             badge: "Trending",
//             price: "₹52,300",
//             specs: "14 KT • IJ-SI",
//             delivery: "26th Nov",
//             image:
//                 "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
//         },
//         {
//             id: 104,
//             badge: "Bestseller",
//             price: "₹1,29,450",
//             specs: "14 KT • FG-SI",
//             delivery: "12th Dec",
//             image:
//                 "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
//         },
//     ],
// };

// // Reusable Product Card
// function ProductCard({ product, index }) {
//     const [liked, setLiked] = useState(false);

//     return (
//         <Card
//             elevation={0}
//             sx={{
//                 border: "1px solid rgba(226, 232, 240, 0.9)",
//                 backgroundColor: "#ffffff",
//                 display: "flex",
//                 flexDirection: "column",
//                 width: "100%",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
//                 transition: "transform 0.25s ease, box-shadow 0.25s ease",
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 borderRadius: { xs: "8px", sm: "12px" },
//                 overflow: "hidden",
//                 cursor: "pointer",
//                 animation: `${fadeSlideUp} 0.45s cubic-bezier(0.22, 1, 0.36, 1) both`,
//                 animationDelay: `${index * 45}ms`,
//                 transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",
//                 "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: "0 12px 28px rgba(79, 50, 103, 0.09)",
//                     "& .product-img": {
//                         transform: "scale(1.05)",
//                     },
//                 },
//             }}
//         >
//             {/* Image Container */}
//             <Box
//                 sx={{
//                     position: "relative",
//                     width: "100%",
//                     aspectRatio: "1 / 1.05",
//                     bgcolor: product.isWhiteBg ? "#FFFFFF" : "#F3EFEA",
//                     overflow: "hidden",
//                 }}
//             >
//                 <Box
//                     component="img"
//                     className="product-img"
//                     src={product.image}
//                     alt={product.specs}
//                     sx={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
//                     }}
//                 />

//                 {/* Top-Left Pill Badge (Trending / Latest / Bestseller) */}
//                 {product.badge && (
//                     <Box
//                         sx={{
//                             position: "absolute",
//                             top: 12,
//                             left: 12,
//                             px: 1.5,
//                             py: 0.4,
//                             borderRadius: "20px",
//                             background:
//                                 "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.68) 100%)",
//                             backdropFilter: "blur(6px)",
//                         }}
//                     >
//                         <Typography
//                             sx={{
//                                 fontSize: "0.75rem",
//                                 fontWeight: 600,
//                                 color: "#4F3267",
//                                 letterSpacing: "0.01em",
//                             }}
//                         >
//                             {product.badge}
//                         </Typography>
//                     </Box>
//                 )}

//                 {/* Top-Right Wishlist Button */}
//                 <IconButton
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         setLiked((prev) => !prev);
//                     }}
//                     size="small"
//                     aria-label="add to wishlist"
//                     sx={{
//                         position: "absolute",
//                         top: 10,
//                         right: 10,
//                         bgcolor: "rgba(218, 218, 218, 0.65)",
//                         backdropFilter: "blur(4px)",
//                         color: liked ? "#D81B60" : "#FFFFFF",
//                         transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                         "&:hover": {
//                             bgcolor: "rgba(255, 255, 255, 0.9)",
//                             color: "#D81B60",
//                             transform: "scale(1.1)",
//                         },
//                     }}
//                 >
//                     {liked ? (
//                         <FavoriteIcon sx={{ fontSize: 18 }} />
//                     ) : (
//                         <FavoriteBorderIcon sx={{ fontSize: 18 }} />
//                     )}
//                 </IconButton>
//             </Box>

//             {/* Card Details */}
//             <CardContent
//                 sx={{
//                     flexGrow: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     p: 2,
//                     "&:last-child": { pb: 2 },
//                 }}
//             >
//                 <Box>
//                     {/* Price Row */}
//                     <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
//                         <Typography
//                             sx={{
//                                 fontSize: "1.05rem",
//                                 fontWeight: 700,
//                                 color: "#222222",
//                             }}
//                         >
//                             {product.price}
//                         </Typography>
//                         {product.originalPrice && (
//                             <Typography
//                                 sx={{
//                                     fontSize: "0.82rem",
//                                     color: "#8A8A8A",
//                                     textDecoration: "line-through",
//                                 }}
//                             >
//                                 {product.originalPrice}
//                             </Typography>
//                         )}
//                     </Box>

//                     {/* Karat & Clarity Specs */}
//                     <Typography
//                         sx={{
//                             fontSize: "0.75rem",
//                             fontWeight: 500,
//                             color: "#555555",
//                             mt: 0.4,
//                         }}
//                     >
//                         {product.specs}
//                     </Typography>
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// }

// // Main Showcase Component
// export default function AlbumSection() {
//     const [activeTab, setActiveTab] = useState("latest");
//     const tabs = [
//         { key: "latest", label: "Latest" },
//         { key: "bestsellers", label: "Bestsellers" },
//     ];

//     const activeIndex = tabs.findIndex((t) => t.key === activeTab);

//     return (
//         <Box
//             sx={{
//                 minHeight: "100vh",
//                 bgcolor: "#FBF9F7", // Warm off-white background from screenshot
//                 py: 15,
//             }}
//         >
//             <Box
//                 sx={{
//                     width: "100%",
//                     maxWidth: 1600,
//                     mx: "auto",
//                     px: { xs: 1.5, sm: 2.5, md: 3.5, lg: 4 },
//                 }}
//             >
//                 {/* Buttery Smooth Sliding Pill Tabs */}
//                 <Box sx={{ mb: 4 }}>
//                     <Box
//                         role="tablist"
//                         sx={{
//                             position: "relative",
//                             display: "inline-grid",
//                             gridTemplateColumns: "1fr 1fr",
//                             width: { xs: "100%", sm: 340 },
//                             p: "4px",
//                             borderRadius: "14px",
//                             bgcolor: "#E6E4E1",
//                             userSelect: "none",
//                         }}
//                     >
//                         {/* Sliding Active Pill Background */}
//                         <Box
//                             sx={{
//                                 position: "absolute",
//                                 top: 4,
//                                 bottom: 4,
//                                 left: 4,
//                                 width: "calc(50% - 4px)",
//                                 borderRadius: "10px",
//                                 bgcolor: "#FFFFFF",
//                                 border: "1px solid #4A4A4A",
//                                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                                 transform: `translateX(${activeIndex * 100}%)`,
//                                 // Silky smooth spring-like transition
//                                 transition: "transform 0.38s cubic-bezier(0.32, 1.15, 0.52, 1)",
//                                 pointerEvents: "none",
//                             }}
//                         />

//                         {tabs.map((tab) => {
//                             const isActive = activeTab === tab.key;
//                             return (
//                                 <Box
//                                     key={tab.key}
//                                     role="tab"
//                                     aria-selected={isActive}
//                                     onClick={() => setActiveTab(tab.key)}
//                                     sx={{
//                                         position: "relative",
//                                         zIndex: 1,
//                                         py: 1.1,
//                                         textAlign: "center",
//                                         cursor: "pointer",
//                                         borderRadius: "10px",
//                                         WebkitTapHighlightColor: "transparent",
//                                     }}
//                                 >
//                                     <Typography
//                                         sx={{
//                                             fontSize: "0.9rem",
//                                             fontWeight: isActive ? 700 : 500,
//                                             color: isActive ? "#1F1F1F" : "#444444",
//                                             transition: "color 0.25s ease",
//                                         }}
//                                     >
//                                         {tab.label}
//                                     </Typography>
//                                 </Box>
//                             );
//                         })}
//                     </Box>
//                 </Box>
//                 <Grid key={activeTab} container spacing={2.5}>
//                     {PRODUCTS[activeTab].map((product, index) => (
//                         <Grid
//                             key={product.id}
//                             size={{ xs: 12, sm: 6, md: 3 }}
//                         >
//                             <ProductCard product={product} index={index} />
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Box>
//         </Box>
//     );
// }
