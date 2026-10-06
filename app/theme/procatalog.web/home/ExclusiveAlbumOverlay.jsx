
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExclusiveAlbum } from "@/app/(core)/hooks/main/useExclusiveAlbum";
import {
  Box,
  Typography,
  IconButton,
  Button,
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
} from "lucide-react";

const imageNotFound = "/image-not-found.jpg";

function AlbumCoverCollage({ album, getProductImageUrl }) {
  const designs = Array.isArray(album?.designs) ? album.designs : [];
  const totalCount = Math.max(
    album?.designCount || 0,
    album?.totalAutocodes || 0,
    designs.length
  );
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

  // Exactly 1 image: Full single square cover filling 100%
  if (designs.length === 1) {
    const imgUrl = getProductImageUrl(designs[0]);
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#F4F4F5",
        }}
      >
        <img
          src={imgUrl}
          alt={designs[0]?.TitleLine || album?.albumName || "Album cover"}
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
      </Box>
    );
  }

  // 2 or more images: Always a proper 2 by 2 layout (4 distinct grid cells)
  // Ensures all 4 boxes are rendered without hiding any slot or duplicating designs
  const remainingCount =
    totalCount > 4 ? totalCount - 3 : designs.length > 4 ? designs.length - 3 : 0;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "2px",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3].map((i) => {
        const d = designs[i] || null;
        const isLastCell = i === 3;
        const showBadge = isLastCell && remainingCount > 1;

        return (
          <Box
            key={i}
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
                alt={d?.TitleLine || `Preview ${i + 1}`}
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
                    opacity: 0.45,
                  }}
                />
              </Box>
            )}
            {showBadge && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(24, 24, 27, 0.68)",
                  backdropFilter: "blur(3px)",
                  WebkitBackdropFilter: "blur(3px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.4rem" },
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  +{remainingCount > 999 ? "999+" : remainingCount}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.68rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    mt: 0.4,
                  }}
                >
                  More
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default function ExclusiveAlbumOverlay({
  initialDomain = "beluxjewel.web",
}) {
  const {
    isOpen,
    loading,
    albums,
    selectedAlbum,
    setSelectedAlbum,
    displayedAlbums,
    currentAlbumDesigns,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    initialRandomNo,
    scrollContainerRef,
    isHeaderVisible,
    isScrolled,
    isScrolledPastMasthead,
    handleAlbumSelect,
    handleBackToAlbums,
    handleClose,
    handleMoveToProductDetail,
    getProductImageUrl,
    formatPrice,
  } = useExclusiveAlbum({ initialDomain });

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

      {/* ── Main Scroll Container (Covers entire overlay below Announcement Bar) ─────── */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* ── Top Navigation Bar (Sticky with Auto-Hide on Scroll Down / Smooth Reveal on Scroll Up) ─────── */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            width: "100%",
            backgroundColor: isScrolled
              ? "rgba(250, 249, 246, 0.94)"
              : "transparent",
            backdropFilter: isScrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
            borderBottom: isScrolled
              ? "1px solid rgba(226, 232, 240, 0.7)"
              : "1px solid transparent",
            boxShadow:
              isScrolled && isHeaderVisible
                ? "0 4px 20px rgba(0, 0, 0, 0.03)"
                : "none",
            transition:
              "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            transform: isHeaderVisible ? "translateY(0)" : "translateY(-100%)",
            pointerEvents: isHeaderVisible ? "auto" : "none",
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
                {/* Left side title next to navigation buttons (Framer Motion) */}
                <AnimatePresence>
                  {isScrolledPastMasthead && (
                    <motion.div
                      key={
                        selectedAlbum
                          ? `album-${selectedAlbum.id || selectedAlbum.albumcode || selectedAlbum.albumName}`
                          : "my-albums-left-header"
                      }
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: 0,
                        marginLeft: 6,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: { xs: "0.95rem", sm: "1.08rem", md: "1.18rem" },
                          fontWeight: 600,
                          color: "#18181B",
                          lineHeight: 1.15,
                          letterSpacing: "-0.01em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: "160px", sm: "240px", md: "380px" },
                        }}
                      >
                        {selectedAlbum ? selectedAlbum.albumName : "My Albums"}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.64rem", sm: "0.7rem" },
                          color: "#71717A",
                          fontWeight: 400,
                          letterSpacing: "0.02em",
                          lineHeight: 1.1,
                          mt: 0.15,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: "160px", sm: "240px", md: "380px" },
                        }}
                      >
                        {selectedAlbum
                          ? `${selectedAlbum.designCount || 0} designs`
                          : "A collection of elegantly curated items"}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  flexShrink: 0,
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
          sx={{
            flex: 1,
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 2, sm: 3, md: 4 },
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
                {/* Masthead Animated with Framer Motion */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    marginBottom: 32,
                    textAlign: "center",
                  }}
                >
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
                </motion.div>

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
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                      columnGap: { xs: 3, sm: 4, md: 5 },
                      rowGap: { xs: 4, sm: 5, md: 6 },
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
                        {/* Square 1:1 Image Loader with rounded card boundary */}
                        <Box
                          sx={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            position: "relative",
                            backgroundColor: "#F4F4F5",
                            overflow: "hidden",
                          }}
                        >
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

                        {/* Content Section: Title & Count Skeleton */}
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.8,
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

                          {/* Count Skeleton */}
                          <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{
                              width: "35%",
                              height: 18,
                              borderRadius: "4px",
                            }}
                          />
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
                  /* Square Album Cards Grid (Exact Reference Image Style) */
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                      columnGap: { xs: 3, sm: 4, md: 5 },
                      rowGap: { xs: 4, sm: 5, md: 6 },
                    }}
                  >
                    {displayedAlbums.map((album, idx) => {
                      const count = album.designCount || 0;
                      const totalCodes = album.totalAutocodes || 0;
                      const totalCount = count > 0 ? count : totalCodes;

                      return (
                        <Box
                          key={`${album.id}-${album.albumcode || ""}-${idx}`}
                          onClick={() => {
                            // setSelectedAlbum(album);
                            // setSearchQuery("");
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
                          {/* Square Collage Container */}
                          <Box
                            sx={{
                              width: "100%",
                              aspectRatio: "1 / 1",
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

                          {/* Card Content: Title in center & total design count under it */}
                          <Box
                            sx={{
                              p: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              gap: 0.5,
                            }}
                          >
                            {/* Album Title */}
                            <Typography
                              title={album.albumName || "Untitled"}
                              sx={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: "1.3rem",
                                fontWeight: 500,
                                color: "#27272A",
                                lineHeight: 1.25,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              {album.albumName || "Untitled"}
                            </Typography>

                            {/* Total Design Count */}
                            <Typography
                              sx={{
                                fontSize: "0.82rem",
                                color: "#71717A",
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                textAlign: "center",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {totalCount} {totalCount === 1 ? "Design" : "Designs"}
                            </Typography>
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
                      {selectedAlbum.albumcode && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: '#FFFFFF', border: '1px solid #E4E4E7', px: 1.5, py: 0.6, borderRadius: '12px' }}>
                          <FolderOpen size={14} color="#71717A" strokeWidth={1.5} />
                          <Typography sx={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 500 }}>
                            {selectedAlbum.albumcode}
                          </Typography>
                        </Box>
                      )}
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
      </Box>
    </Dialog>
  );
}