
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    Skeleton,
    Dialog,
    Fade,
} from "@mui/material";
import {
    X,
    Search,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    Calendar,
    Gem,
    Eye,
    SlidersHorizontal,
} from "lucide-react";
import { handleMoveToDetail } from "@/app/(core)/utils/product/productListingHelpers";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";

/**
 * Editorial Album Collection & Showcase Overlay
 * Matching Roon / Apple Music luxury album architecture:
 * - Level 1: "Exclusive Albums" showcase grid of square album covers with titles and design counts
 * - Level 2: Seamless in-place drill-down into selected album's designs with clean "← Back to Albums"
 * - Styling: Squared 2px border radius, high-fashion serif masthead, max-width centered container
 * - Strict non-technical copy: Pure luxury client catalog language
 * http://localhost:5010/?exclusive-album&customerid=2275
 */

const imageNotFound = "/image-not-found.jpg";

function decodeCurrencySymbol(str) {
    if (!str) return "₹";
    if (str === "&#8377;" || str.includes("8377")) return "₹";
    if (str.startsWith("&#") && typeof document !== "undefined") {
        try {
            const txt = document.createElement("textarea");
            txt.innerHTML = str;
            return txt.value;
        } catch (_) { }
    }
    return str;
}

/**
 * AlbumCoverCollage (Matches Wireframe)
 * - Left 50%: 1 Large Hero Image box
 * - Right 50%: 2x2 grid of 4 smaller square boxes:
 *     - Slot 0 (top-left): design 2
 *     - Slot 1 (top-right): design 3
 *     - Slot 2 (bottom-left): design 4
 *     - Slot 3 (bottom-right): design 5 with frosted "+N" (or +99) badge overlay
 * - If album has fewer than 5 designs, placeholder slots remain visible to preserve structure
 */
function AlbumCoverCollage({ album, getProductImageUrl }) {
    const designs = Array.isArray(album?.designs) ? album.designs : [];
    const totalCount = Math.max(
        album?.designCount || 0,
        album?.totalAutocodes || 0,
        designs.length
    );

    // Fallback if no designs available
    if (designs.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#F4F4F5",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.25,
                }}
            >
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        backgroundColor: "#E4E4E7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Gem size={22} color="#71717A" strokeWidth={1.5} />
                </Box>
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        color: "#A1A1AA",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}
                >
                    Curated Album
                </Typography>
            </Box>
        );
    }

    const heroDesign = designs[0] || null;
    // Extra count beyond the 4 items shown before the badge (1 hero + 3 small = 4)
    const remainingCount = totalCount > 4 ? totalCount - 4 : 0;

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "2px",
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
            }}
        >
            {/* Left 50%: 1 Large Hero Image */}
            <Box
                sx={{
                    width: "50%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#F4F4F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {heroDesign ? (
                    <img
                        src={getProductImageUrl(heroDesign)}
                        alt={heroDesign?.TitleLine || album?.albumName || "Hero image"}
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = imageNotFound;
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    <img
                        src={imageNotFound}
                        alt="No image"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.45,
                        }}
                    />
                )}
            </Box>

            {/* Right 50%: 2x2 Grid (4 smaller square boxes) */}
            <Box
                sx={{
                    width: "50%",
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gap: "2px",
                    backgroundColor: "#FFFFFF",
                    flexShrink: 0,
                }}
            >
                {[0, 1, 2, 3].map((cellIdx) => {
                    const designIndex = cellIdx + 1; // designs[1], designs[2], designs[3], designs[4]
                    const d = designs[designIndex] || null;
                    const isLastCell = cellIdx === 3;
                    // Show badge on bottom-right slot when there are additional designs
                    const showBadge = isLastCell && (totalCount > 4 || designs.length > 4);

                    return (
                        <Box
                            key={cellIdx}
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                backgroundColor: "#F4F4F5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {d ? (
                                <img
                                    src={getProductImageUrl(d)}
                                    alt={d?.TitleLine || `Preview ${designIndex + 1}`}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = imageNotFound;
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "#F4F4F5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={imageNotFound}
                                        alt="No image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            opacity: 0.4,
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Bottom-right "+99" overlay badge */}
                            {showBadge && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundColor: "rgba(24, 24, 27, 0.65)",
                                        backdropFilter: "blur(3px)",
                                        WebkitBackdropFilter: "blur(3px)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#FFFFFF",
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 700,
                                            fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.45rem" },
                                            letterSpacing: "-0.01em",
                                            lineHeight: 1,
                                            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                                        }}
                                    >
                                        +{remainingCount > 999 ? "999+" : remainingCount}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default function ExclusiveAlbumOverlay({
    initialDomain = "beluxjewel.web",
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const hasExclusiveInitial = useMemo(() => {
        if (
            searchParams.has("exclusive-album") ||
            searchParams.get("exclusive-album") !== null
        )
            return true;
        if (typeof window !== "undefined") {
            return (window.location.search || "")
                .toLowerCase()
                .includes("exclusive-album");
        }
        return false;
    }, [searchParams]);

    const isAnnouncementActive = useMemo(() => {
        const isVal = searchParams.get("is");
        if (isVal === "2") return true;
        if (typeof window !== "undefined") {
            const qs = window.location.search || "";
            return qs.includes("is=2");
        }
        return false;
    }, [searchParams]);

    const [isOpen, setIsOpen] = useState(hasExclusiveInitial);
    const [loading, setLoading] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null); // null = Album Grid view; object = Album Detail view
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name"); // "name" | "count" | "date"
    const [storeConfig, setStoreConfig] = useState({
        CDNDesignImageFol: "",
        Currencysymbol: "₹",
    });
    const [initialRandomNo, setInitialRandomNo] = useState("");
    const scrollContainerRef = useRef(null);

    // Automatically scroll main content area to top whenever selected album changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
        const timer = setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            }
        }, 60);
        return () => clearTimeout(timer);
    }, [selectedAlbum]);

    // Check URL query param for ?exclusive-album
    const checkUrlParams = useCallback(() => {
        let hasExclusive =
            searchParams.has("exclusive-album") ||
            searchParams.get("exclusive-album") !== null;

        let custId =
            searchParams.get("customerid") ||
            searchParams.get("customerId") ||
            searchParams.get("CustomerId") ||
            "";

        if (typeof window !== "undefined") {
            const qs = window.location.search || "";
            if (qs.toLowerCase().includes("exclusive-album")) {
                hasExclusive = true;
            }
            if (!custId) {
                const urlParams = new URLSearchParams(qs);
                custId =
                    urlParams.get("customerid") ||
                    urlParams.get("customerId") ||
                    urlParams.get("CustomerId") ||
                    "";
            }
        }

        let randomNo = searchParams.get("randomNo") || searchParams.get("RandomNo") || "";
        if (!randomNo && typeof window !== "undefined") {
            const qs = window.location.search || "";
            const urlParams = new URLSearchParams(qs);
            randomNo = urlParams.get("randomNo") || urlParams.get("RandomNo") || "";
        }

        return { hasExclusive, custId: custId || "", randomNo };
    }, [searchParams]);

    useEffect(() => {
        const { hasExclusive, custId, randomNo } = checkUrlParams();
        setInitialRandomNo(randomNo || "");

        if (!hasExclusive) {
            setIsOpen(false);
            return;
        }

        setIsOpen(true);
        const targetDomain = initialDomain || "beluxjewel.web";

        async function fetchExclusiveAlbums() {
            setLoading(true);
            try {
                let activeCustId = custId;
                const baseApiUrl = `/api/sqlite/exclusive-albums?domain=${targetDomain}`;

                // If we have randomNo but no customerId, resolve the real customerId first!
                if (randomNo && !activeCustId) {
                    const resolveRes = await fetch(`${baseApiUrl}&RandomNo=${randomNo}`);
                    const resolveData = await resolveRes.json();
                    if (resolveData?.Status === "200" && resolveData?.Data?.rd?.[0]?.CustomerId) {
                        activeCustId = resolveData.Data.rd[0].CustomerId;
                    }
                }

                // Fallback if no customerId provided and randomNo didn't resolve
                if (!activeCustId) activeCustId = "2275";

                // Fetch ALL albums for this customer so the grid is populated when they click "Back"
                const res = await fetch(`${baseApiUrl}&customerId=${activeCustId}`);
                const data = await res.json();

                if (data?.Status === "200" && Array.isArray(data?.Data?.rd)) {
                    const fetchedAlbums = data.Data.rd;
                    setAlbums(fetchedAlbums);
                    if (data.Data.storeConfig) {
                        setStoreConfig(data.Data.storeConfig);
                    }
                    // Auto-select single album if randomNo is present
                    if (randomNo) {
                        const albumToSelect = fetchedAlbums.find(a => a.RandomNo === randomNo || a.RandomNo == randomNo);
                        if (albumToSelect) {
                            setSelectedAlbum(albumToSelect);
                        }
                    }
                } else {
                    setAlbums([]);
                }
            } catch (err) {
                console.error("[ExclusiveAlbumOverlay] Failed to fetch albums:", err);
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        }

        fetchExclusiveAlbums();
    }, [checkUrlParams, initialDomain]);

    // Handle closing overlay and cleaning up query params
    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSelectedAlbum(null);
        try {
            const nextParams = new URLSearchParams(searchParams.toString());
            nextParams.delete("exclusive-album");
            nextParams.delete("customerid");
            nextParams.delete("customerId");
            nextParams.delete("CustomerId");
            nextParams.delete("randomNo");
            nextParams.delete("RandomNo");
            nextParams.delete("is");
            const cleanUrl = nextParams.toString()
                ? `${pathname}?${nextParams.toString()}`
                : pathname;
            router.replace(cleanUrl, { scroll: false });
        } catch (_) { }
    }, [searchParams, pathname]);

    const currencySymbol = useMemo(
        () => decodeCurrencySymbol(storeConfig?.Currencysymbol),
        [storeConfig],
    );

    const formatPrice = (val) => {
        if (val == null || val === "" || isNaN(val)) return null;
        return `${currencySymbol} ${Math.round(Number(val)).toLocaleString("en-IN")}`;
    };

    const getProductImageUrl = (design) => {
        if (!design || !design.designno) return imageNotFound;
        const cdn =
            storeConfig.CDNDesignImageFol || storeConfig.DesignImageFol || "";
        const ext = design.ImageExtension || "webp";
        return `${cdn}${design.designno}~1.${ext}`;
    };

    // Navigate user directly to product detail page matching procatalog flow
    const handleMoveToProductDetail = (design) => {
        if (!design) return;
        try {
            const imgUrl = getProductImageUrl(design);
            handleMoveToDetail({
                productData: design,
                imageUrl: imgUrl,
                storeinit: storeConfig,
                selectedMetalId: design?.MetalPurityid || design?.MetalTypeId || null,
                selectedDiaId: design?.DiamondQualityId || null,
                selectedCsId: design?.ColorStoneQualityId || null,
                detailsMenu: "",
                outputFilters: {},
                navigate: router,
            });
        } catch (err) {
            console.error("[ExclusiveAlbumOverlay] handleMoveToDetail error:", err);
            // Fallback manual navigation
            try {
                const imgUrl = getProductImageUrl(design);
                const obj = {
                    a: design?.autocode,
                    b: design?.designno,
                    m: design?.MetalPurityid || design?.MetalTypeId || null,
                    d: design?.DiamondQualityId || null,
                    c: design?.ColorStoneQualityId || null,
                    f: {},
                    g: "",
                    img: imgUrl,
                    ArticleNo: design?.ArticleNo || design?.designno || "",
                    ArticleId: design?.ArticleId ?? null,
                    title: design?.TitleLine ?? "",
                    nwt: design?.Nwt ?? 0,
                    price: design?.UnitCostWithMarkUp ?? design?.UnitCost ?? 0,
                    mediaDet: design?.ImageVideoDetail ?? "",
                    l: design?.ImageExtension || "webp",
                    count: design?.ImageCount || 0,
                };
                const encodeObj = compressAndEncode(JSON.stringify(obj));
                const titleSlug = formatRedirectTitleLine
                    ? formatRedirectTitleLine(design?.TitleLine)
                    : "";
                const targetUrl = `/d/${titleSlug}${design?.designno}?p=${encodeObj}`;
                router.push(targetUrl);
            } catch (innerErr) {
                console.error(
                    "[ExclusiveAlbumOverlay] Fallback redirect error:",
                    innerErr,
                );
                if (design?.designno) {
                    router.push(`/d/${design.designno}`);
                }
            }
        }
    };

    const handleAlbumSelect = async (album) => {
        try {
            setSelectedAlbum(album);
            setSearchQuery("");
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            }
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch (error) {
            console.log(error, "errror")
        }



    }

    // Get cover image for an album (uses first design's image or placeholder)
    const getAlbumCoverImage = (album) => {
        if (album && Array.isArray(album.designs) && album.designs.length > 0) {
            return getProductImageUrl(album.designs[0]);
        }
        return imageNotFound;
    };

    // Filtered & Sorted Albums
    const displayedAlbums = useMemo(() => {
        if (!albums || albums.length === 0) return [];
        let list = [...albums];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (a) =>
                    (a.albumName && a.albumName.toLowerCase().includes(q)) ||
                    (a.albumcode && a.albumcode.toLowerCase().includes(q)),
            );
        }

        if (sortBy === "count") {
            list.sort((a, b) => (b.designCount || 0) - (a.designCount || 0));
        } else if (sortBy === "date") {
            list.sort(
                (a, b) => new Date(b.EntryDate || 0) - new Date(a.EntryDate || 0),
            );
        } else {
            list.sort((a, b) => (a.albumName || "").localeCompare(b.albumName || ""));
        }

        return list;
    }, [albums, searchQuery, sortBy]);

    // Filtered designs for currently selected album
    const currentAlbumDesigns = useMemo(() => {
        if (!selectedAlbum || !Array.isArray(selectedAlbum.designs)) return [];
        if (!searchQuery.trim()) return selectedAlbum.designs;
        const q = searchQuery.toLowerCase().trim();
        return selectedAlbum.designs.filter(
            (d) =>
                (d.designno && d.designno.toLowerCase().includes(q)) ||
                (d.TitleLine && d.TitleLine.toLowerCase().includes(q)) ||
                (d.category && d.category.toLowerCase().includes(q)) ||
                (d.MetalTypePurity && d.MetalTypePurity.toLowerCase().includes(q)),
        );
    }, [selectedAlbum, searchQuery]);

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullScreen
            TransitionComponent={Fade}
            transitionDuration={200}
            PaperProps={{
                sx: {
                    backgroundColor: "#FAF9F6", // elegant off-white
                    color: "#27272A",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                },
            }}
        >
            {/* ── Top Announcement Bar (Enabled when ?is=2) ────── */}
            {isAnnouncementActive && (
                <Box
                    component="a"
                    href="https://optigoapps.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: "100%",
                        background: "linear-gradient(135deg, #b434ff 0%, #6900c6 40%, #9e00ff 70%, rgba(242, 0, 255, 0.56)  100%)",
                        color: "#FFFFFF",
                        py: { xs: 0.9, sm: 1.1 },
                        px: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        textDecoration: "none",
                        cursor: "pointer",
                        flexShrink: 0,
                        zIndex: 35,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                            backgroundColor: "#0052CC",
                            "& .announcement-arrow": {
                                transform: "translateX(4px)",
                            },
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "'Inter', -apple-system, sans-serif",
                            fontSize: { xs: "0.78rem", sm: "0.86rem" },
                            fontWeight: 500,
                            letterSpacing: "0.01em",
                            textAlign: "center",
                            lineHeight: 1.3,
                        }}
                    >
                        Announcing Exclusive Albums Collection • Powered by Optigo
                    </Typography>
                    <Box
                        component="span"
                        className="announcement-arrow"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            transition: "transform 0.2s ease",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                        }}
                    >
                        →
                    </Box>
                </Box>
            )}

            {/* ── Top Navigation Bar (Responsive Full-Width Search) ─────── */}
            <Box
                sx={{
                    backgroundColor: "transparent",
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                    px: { xs: 2, sm: 3, md: 6 },
                    py: { xs: 1.5, md: 2 },
                }}
            >
                <Box
                    sx={{
                        maxWidth: "1440px",
                        mx: "auto",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "stretch", md: "center" },
                        justifyContent: "space-between",
                        gap: { xs: 1.25, md: 2 },
                    }}
                >
                    {/* Top Row on mobile: Nav buttons on left, Close button on right */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: { xs: "100%", md: "auto" },
                        }}
                    >
                        {/* Back/Forward Browser Controls */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    if (selectedAlbum) setSelectedAlbum(null);
                                }}
                                disabled={!selectedAlbum}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "25px",
                                    border: "1px solid #E2E8F0",
                                    opacity: selectedAlbum ? 1 : 0.4,
                                }}
                            >
                                <ChevronLeft size={18} />
                            </IconButton>
                            <IconButton
                                size="small"
                                disabled
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "25px",
                                    border: "1px solid #E2E8F0",
                                    opacity: 0.3,
                                }}
                            >
                                <ChevronRight size={18} />
                            </IconButton>

                            {selectedAlbum && (
                                <Button
                                    size="small"
                                    onClick={() => setSelectedAlbum(null)}
                                    startIcon={<ArrowLeft size={15} />}
                                    sx={{
                                        borderRadius: "2px",
                                        color: "#0F172A",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        letterSpacing: "0.04em",
                                        textTransform: "none",
                                        ml: 1,
                                        px: 1.5,
                                        backgroundColor: "#F8FAFC",
                                        border: "1px solid #E2E8F0",
                                        "&:hover": {
                                            backgroundColor: "#0F172A",
                                            color: "#FFFFFF",
                                        },
                                    }}
                                >
                                    Exclusive Albums
                                </Button>
                            )}
                        </Box>

                        {/* Mobile Close Button (visible only on mobile) */}
                        <IconButton
                            onClick={handleClose}
                            aria-label="Close exclusive albums"
                            sx={{
                                display: { xs: "inline-flex", md: "none" },
                                width: 34,
                                height: 34,
                                borderRadius: "25px",
                                border: "1px solid #E2E8F0",
                                color: "#0F172A",
                                "&:hover": {
                                    backgroundColor: "#0F172A",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            <X size={18} />
                        </IconButton>
                    </Box>

                    {/* Action Row: Full width searchbar on mobile, inline on desktop */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            width: { xs: "100%", md: "auto" },
                            flex: { xs: "1 1 100%", md: "0 0 auto" },
                        }}
                    >
                        {/* Search Input (Full Width on mobile) */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#F8FAFC",
                                borderRadius: "15px",
                                border: "1px solid #E2E8F0",
                                px: 1.75,
                                py: 0.85,
                                width: { xs: "100%", md: 320 },
                                flex: { xs: 1, md: "none" },
                                transition: "all 0.15s ease",
                                "&:focus-within": {
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "#0F172A",
                                },
                            }}
                        >
                            <Search
                                size={16}
                                color="#64748B"
                                style={{ marginRight: 8, flexShrink: 0 }}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    selectedAlbum ? "Search in this album..." : "Search albums..."
                                }
                                style={{
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "transparent",
                                    width: "100%",
                                    fontSize: "0.95rem",
                                    color: "#0F172A",
                                }}
                            />
                            {searchQuery && (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchQuery("")}
                                    sx={{ p: "2px", borderRadius: "15px", flexShrink: 0 }}
                                >
                                    <X size={12} />
                                </IconButton>
                            )}
                        </Box>

                        {/* Desktop Close Button (hidden on mobile, visible on desktop) */}
                        <IconButton
                            onClick={handleClose}
                            aria-label="Close exclusive albums"
                            sx={{
                                display: { xs: "none", md: "inline-flex" },
                                width: 34,
                                height: 34,
                                borderRadius: "25px",
                                border: "1px solid #E2E8F0",
                                color: "#0F172A",
                                "&:hover": {
                                    backgroundColor: "#0F172A",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            <X size={18} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* ── Main Content Area (Max-Width Centered) ─────────────────────── */}
            <Box
                ref={scrollContainerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: { xs: 2, sm: 4, md: 6 },
                    py: { xs: 3, sm: 4, md: 5 },
                }}
            >
                <Box
                    sx={{
                        maxWidth: "1440px",
                        mx: "auto",
                        width: "100%",
                    }}
                >
                    {/* ============================================================= */}
                    {/* INITIAL LOADING STATE FOR SINGLE ALBUM                        */}
                    {/* ============================================================= */}
                    {!selectedAlbum && loading && initialRandomNo && (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3.5, mb: 4, pb: 3.5, borderBottom: "1px solid #EEEEEE" }}>
                                <Skeleton variant="rectangular" width={180} height={180} sx={{ borderRadius: "20px", flexShrink: 0 }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1, width: { xs: '100%', sm: '50%' } }}>
                                    <Skeleton width="25%" height={20} sx={{ mb: 1, borderRadius: "6px" }} />
                                    <Skeleton width="60%" height={48} sx={{ mb: 2, borderRadius: "8px" }} />
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Skeleton width={80} height={30} sx={{ borderRadius: "12px" }} />
                                        <Skeleton width={110} height={30} sx={{ borderRadius: "12px" }} />
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(2, 1fr)",
                                    sm: "repeat(auto-fill, minmax(260px, 1fr))",
                                    md: "repeat(auto-fill, minmax(280px, 1fr))",
                                },
                                gap: { xs: 2.5, sm: 3, md: 4 },
                            }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <Box
                                        key={i}
                                        sx={{
                                            borderRadius: "20px",
                                            backgroundColor: "#FFFFFF",
                                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: "1/1", transform: "none" }} />
                                        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                            <Skeleton width="75%" height={22} sx={{ borderRadius: "6px" }} />
                                            <Skeleton width="45%" height={18} sx={{ borderRadius: "6px" }} />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                                <Skeleton width="40%" height={24} sx={{ borderRadius: "6px" }} />
                                                <Skeleton width={50} height={24} sx={{ borderRadius: "6px" }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* ============================================================= */}
                    {/* LEVEL 1: ALL ALBUMS GRID VIEW (Matches Attached Reference)     */}
                    {/* ============================================================= */}
                    {!selectedAlbum && (!loading || !initialRandomNo) && (
                        <>
                            {/* Masthead */}
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: { xs: "2.5rem", sm: "3.2rem", md: "3.8rem" },
                                        fontWeight: 400,
                                        letterSpacing: "-0.01em",
                                        color: "#27272A",
                                        lineHeight: 1.1,
                                        mb: 1,
                                    }}
                                >
                                    My Albums
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.95rem",
                                        color: "#71717A",
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 300,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    A collection of elegantly curated items
                                </Typography>
                            </Box>

                            {/* Sub-bar: Sort Filter */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            fontSize: "0.85rem",
                                            color: "#71717A",
                                        }}
                                    >
                                        <span>Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                backgroundColor: "transparent",
                                                fontWeight: 500,
                                                fontSize: "0.85rem",
                                                color: "#27272A",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="name">Name</option>
                                            <option value="count">Item count</option>
                                            <option value="date">Date added</option>
                                        </select>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Loading Skeletons matching Real Album Cards */}
                            {loading ? (
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "repeat(2, 1fr)",
                                            md: "repeat(2, 1fr)",
                                        },
                                        columnGap: { xs: 3, sm: 3.5, md: 4 },
                                        rowGap: { xs: 3.5, sm: 4, md: 5 },
                                    }}
                                >
                                    {[1, 2, 3, 4].map((i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                backgroundColor: "#FFFFFF",
                                                borderRadius: "20px",
                                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {/* 2:1 Image Loader with Left 50% + Right 2x2 grid matching real wireframe */}
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    aspectRatio: "2 / 1",
                                                    position: "relative",
                                                    backgroundColor: "#FFFFFF",
                                                    overflow: "hidden",
                                                    display: "flex",
                                                    gap: "2px",
                                                }}
                                            >
                                                {/* Left Hero Skeleton (50%) */}
                                                <Box sx={{ width: "50%", height: "100%" }}>
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation="wave"
                                                        sx={{
                                                            width: "100%",
                                                            height: "100% !important",
                                                            transform: "none",
                                                        }}
                                                    />
                                                </Box>

                                                {/* Right 2x2 Grid Skeleton (50%) */}
                                                <Box
                                                    sx={{
                                                        width: "50%",
                                                        height: "100%",
                                                        display: "grid",
                                                        gridTemplateColumns: "1fr 1fr",
                                                        gridTemplateRows: "1fr 1fr",
                                                        gap: "2px",
                                                    }}
                                                >
                                                    {[0, 1, 2, 3].map((cell) => (
                                                        <Skeleton
                                                            key={cell}
                                                            variant="rectangular"
                                                            animation="wave"
                                                            sx={{
                                                                width: "100%",
                                                                height: "100% !important",
                                                                transform: "none",
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>

                                            {/* Content Section: Title & Pills */}
                                            <Box
                                                sx={{
                                                    p: 2.25,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1.25,
                                                }}
                                            >
                                                <Skeleton
                                                    variant="text"
                                                    animation="wave"
                                                    sx={{
                                                        width: "65%",
                                                        height: 28,
                                                        borderRadius: "6px",
                                                    }}
                                                />

                                                {/* Pills Skeletons */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.25,
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation="wave"
                                                        sx={{ width: 55, height: 24, borderRadius: "10px" }}
                                                    />
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation="wave"
                                                        sx={{ width: 85, height: 24, borderRadius: "10px" }}
                                                    />
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation="wave"
                                                        sx={{ width: 65, height: 24, borderRadius: "10px" }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ) : displayedAlbums.length === 0 ? (
                                <Box sx={{ py: 8, textAlign: "center" }}>
                                    <Typography sx={{ fontSize: "1rem", color: "#64748B" }}>
                                        No albums found matching "{searchQuery}".
                                    </Typography>
                                </Box>
                            ) : (
                                /* 2-by-2 Grid of Album Cards (Matches Attached Wireframe) */
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "repeat(2, 1fr)",
                                            md: "repeat(2, 1fr)",
                                        },
                                        columnGap: { xs: 3, sm: 3.5, md: 4 },
                                        rowGap: { xs: 3.5, sm: 4, md: 5 },
                                    }}
                                >
                                    {displayedAlbums.map((album, idx) => {
                                        const count = album.designCount || 0;
                                        const totalCodes = album.totalAutocodes || 0;

                                        return (
                                            <Box
                                                key={`${album.id}-${album.albumcode || ""}-${idx}`}
                                                onClick={() => {
                                                    handleAlbumSelect(album)
                                                }}
                                                sx={{
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    backgroundColor: "#FFFFFF",
                                                    borderRadius: "20px",
                                                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {/* 2:1 Wide Collage Container (Left Hero + Right 2x2 Grid) */}
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        aspectRatio: "2 / 1",
                                                        position: "relative",
                                                        backgroundColor: "#F4F4F5",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <AlbumCoverCollage
                                                        album={album}
                                                        getProductImageUrl={getProductImageUrl}
                                                    />
                                                </Box>

                                                {/* Card Content: Title & Metadata Pills */}
                                                <Box
                                                    sx={{
                                                        p: 2.25,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 1.25,
                                                    }}
                                                >
                                                    {/* Album Title */}
                                                    <Typography
                                                        title={album.albumName || "Untitled"}
                                                        sx={{
                                                            fontFamily: "'Playfair Display', Georgia, serif",
                                                            fontSize: "1.35rem",
                                                            fontWeight: 500,
                                                            color: "#27272A",
                                                            lineHeight: 1.2,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {album.albumName || "Untitled"}
                                                    </Typography>

                                                    {/* Metadata Pills Section */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1.25,
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        {/* Item Count Pill */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#F4F4F5', px: 1.4, py: 0.5, borderRadius: '10px' }}>
                                                            <Gem size={13} color="#71717A" strokeWidth={1.5} />
                                                            <Typography sx={{ fontSize: '0.75rem', color: '#52525B', fontWeight: 500 }}>
                                                                {count > 0 ? count : totalCodes}
                                                            </Typography>
                                                        </Box>

                                                        {/* Date Pill */}
                                                        {album.EntryDate && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#F4F4F5', px: 1.4, py: 0.5, borderRadius: '10px' }}>
                                                                <Calendar size={13} color="#71717A" strokeWidth={1.5} />
                                                                <Typography sx={{ fontSize: '0.75rem', color: '#52525B', fontWeight: 500 }}>
                                                                    {new Date(album.EntryDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {/* Album Code Pill */}
                                                        {album.albumcode && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#F4F4F5', px: 1.4, py: 0.5, borderRadius: '10px' }}>
                                                                <FolderOpen size={13} color="#71717A" strokeWidth={1.5} />
                                                                <Typography sx={{ fontSize: '0.75rem', color: '#52525B', fontWeight: 500 }}>
                                                                    {album.albumcode}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </>
                    )}

                    {/* ============================================================= */}
                    {/* LEVEL 2: ALBUM DETAIL & DESIGNS VIEW                          */}
                    {/* ============================================================= */}
                    {selectedAlbum && (
                        <>
                            {/* Album Header Banner */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    gap: 3.5,
                                    mb: 4,
                                    pb: 3.5,
                                    borderBottom: "1px solid #EEEEEE",
                                }}
                            >
                                {/* Album Cover Art */}
                                <Box
                                    sx={{
                                        width: { xs: 140, sm: 180, md: 220 },
                                        height: { xs: 140, sm: 180, md: 220 },
                                        borderRadius: "20px",
                                        backgroundColor: "#F4F4F5",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)"
                                    }}
                                >
                                    <AlbumCoverCollage
                                        album={selectedAlbum}
                                        getProductImageUrl={getProductImageUrl}
                                    />
                                </Box>

                                {/* Album Title & Metadata */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            color: "#71717A",
                                            mb: 0.5,
                                        }}
                                    >
                                        Curated Collection
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
                                            fontWeight: 400,
                                            color: "#27272A",
                                            lineHeight: 1.1,
                                            mb: 2,
                                        }}
                                    >
                                        {selectedAlbum.albumName}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                            gap: 1.5,
                                        }}
                                    >
                                        {/* Item Count Pill */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#FFFFFF', border: '1px solid #E4E4E7', px: 1.5, py: 0.6, borderRadius: '12px' }}>
                                            <Gem size={14} color="#71717A" strokeWidth={1.5} />
                                            <Typography sx={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 500 }}>
                                                {selectedAlbum.designCount || 0} items
                                            </Typography>
                                        </Box>

                                        {/* Expiry Pill */}
                                        {selectedAlbum.ExpiryDate && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#FFFFFF', border: '1px solid #E4E4E7', px: 1.5, py: 0.6, borderRadius: '12px' }}>
                                                <Calendar size={14} color="#71717A" strokeWidth={1.5} />
                                                <Typography sx={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 500 }}>
                                                    Valid until {new Date(selectedAlbum.ExpiryDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Code Pill */}
                                        {/* {selectedAlbum.albumcode && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#FFFFFF', border: '1px solid #E4E4E7', px: 1.5, py: 0.6, borderRadius: '12px' }}>
                        <FolderOpen size={14} color="#71717A" strokeWidth={1.5} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 500 }}>
                          {selectedAlbum.albumcode}
                        </Typography>
                      </Box>
                    )} */}
                                    </Box>
                                </Box>
                            </Box>

                            {/* Designs Grid (2px Border Radius, Auto-Fill Max Width) */}
                            {currentAlbumDesigns.length === 0 ? (
                                <Box
                                    sx={{
                                        py: 8,
                                        textAlign: "center",
                                        border: "1px dashed #E2E8F0",
                                        borderRadius: "2px",
                                        backgroundColor: "#F8FAFC",
                                    }}
                                >
                                    <Gem size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            color: "#0F172A",
                                            mb: 0.5,
                                        }}
                                    >
                                        {searchQuery
                                            ? "No designs match your search"
                                            : "Designs available for this collection are being prepared"}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.82rem", color: "#64748B" }}>
                                        {searchQuery
                                            ? `Try searching with another keyword or clear search.`
                                            : `Total registered items in this album: ${selectedAlbum.totalAutocodes || 0}`}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "repeat(2, 1fr)",
                                            sm: "repeat(auto-fill, minmax(260px, 1fr))",
                                            md: "repeat(auto-fill, minmax(280px, 1fr))",
                                        },
                                        gap: { xs: 2.5, sm: 3, md: 4 },
                                    }}
                                >
                                    {currentAlbumDesigns.map((design, index) => {
                                        const price =
                                            formatPrice(design.UnitCostWithMarkUpIncTax) ||
                                            formatPrice(design.UnitCostWithMarkUp) ||
                                            formatPrice(design.UnitCost);

                                        const imgUrl = getProductImageUrl(design);

                                        return (
                                            <Box
                                                key={`${design.id || design.autocode}-${design.designno}-${index}`}
                                                onClick={() => handleMoveToProductDetail(design)}
                                                sx={{
                                                    borderRadius: "20px",
                                                    backgroundColor: "#FFFFFF",
                                                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                {/* Image Container */}
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        aspectRatio: "1 / 1",
                                                        backgroundColor: "#F4F4F5",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt={design.TitleLine || design.designno}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = imageNotFound;
                                                        }}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />

                                                    {/* Design Badge */}
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 12,
                                                            right: 12,
                                                            backgroundColor: "#FFFFFF",
                                                            color: "#27272A",
                                                            px: 1.2,
                                                            py: 0.5,
                                                            borderRadius: "12px",
                                                            fontSize: "0.7rem",
                                                            fontWeight: 600,
                                                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                                        }}
                                                    >
                                                        {design.designno}
                                                    </Box>
                                                </Box>

                                                {/* Content */}
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.88rem",
                                                            fontWeight: 700,
                                                            color: "#0F172A",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {design.TitleLine || `Design ${design.designno}`}
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            fontSize: "0.72rem",
                                                            color: "#64748B",
                                                            fontVariantNumeric: "tabular-nums",
                                                            mb: 1.5,
                                                        }}
                                                    >
                                                        <span>
                                                            {design.MetalTypePurity || "14K GOLD"}
                                                            {design.Nwt
                                                                ? ` • ${Number(design.Nwt).toFixed(2)}g`
                                                                : ""}
                                                        </span>
                                                        {design.Dwt && Number(design.Dwt) > 0 ? (
                                                            <span
                                                                style={{ color: "#002FA7", fontWeight: 600 }}
                                                            >
                                                                {Number(design.Dwt).toFixed(2)}ct
                                                            </span>
                                                        ) : null}
                                                    </Box>

                                                    {/* Price */}
                                                    <Box
                                                        sx={{
                                                            mt: "auto",
                                                            pt: 1.25,
                                                            borderTop: "1px solid #F1F5F9",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        {price ? (
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "0.95rem",
                                                                    fontWeight: 800,
                                                                    color: "#0F172A",
                                                                    fontVariantNumeric: "tabular-nums",
                                                                }}
                                                            >
                                                                {price}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                sx={{ fontSize: "0.76rem", color: "#94A3B8" }}
                                                            >
                                                                Price on request
                                                            </Typography>
                                                        )}

                                                        <Button
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMoveToProductDetail(design);
                                                            }}
                                                            sx={{
                                                                minWidth: "auto",
                                                                p: "2px 8px",
                                                                fontSize: "0.72rem",
                                                                fontWeight: 700,
                                                                borderRadius: "2px",
                                                                color: "#0F172A",
                                                                border: "1px solid #E2E8F0",
                                                                "&:hover": {
                                                                    backgroundColor: "#0F172A",
                                                                    color: "#FFFFFF",
                                                                },
                                                            }}
                                                        >
                                                            VIEW
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            {/* ── Powered By Optigo Branding (Bottom-Right Corner) ────── */}
            <Box
                component="a"
                href="https://optigoapps.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    position: "fixed",
                    bottom: { xs: 16, sm: 22 },
                    right: { xs: 16, sm: 24 },
                    zIndex: 40,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    px: 2,
                    py: 1.2,
                    borderRadius: "16px",
                    WebkitBackdropFilter: "blur(12px)",
                    textDecoration: "none",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.2s ease",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#94A3B8",
                        lineHeight: 1,
                    }}
                >
                    Powered by
                </Typography>
                <Box
                    component="img"
                    src="https://www.optigoapps.com/logo.png"
                    alt="Optigo"
                    sx={{
                        height: { xs: 26, sm: 30 },
                        width: "auto",
                        display: "block",
                        objectFit: "contain",
                    }}
                />
            </Box>
        </Dialog>
    );
}
