
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExclusiveAlbum } from "@/app/(core)/hooks/main/useExclusiveAlbum";
import { useAlbumAuth } from "@/app/(core)/hooks/main/useAlbumAuth";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { logoutUser } from "@/app/(core)/utils/authLogout";
import ReusableConfirmModal from "@/app/components/ui/Modal";
import AlbumDeactivatedPage from "./fallbacks/AlbumDeactivatedPage";
import AlbumExpiredPage from "./fallbacks/AlbumExpiredPage";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Skeleton,
  Dialog,
  Fade,
  Tooltip,
  Popover,
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
  Heart,
  ShoppingCart,
  Check,
  User,
  LayoutGrid,
  Home,
} from "lucide-react";

const imageNotFound = "/image-not-found.jpg";

function buildAlbumCoverUrl(album, albumImageBase) {
  const base = String(albumImageBase || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/(^|\/)AlbumImages$/i, "$1ProAlbumImages");

  const folder = String(album?.AlbumImageFol || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");

  const imageName = String(album?.AlbumImageName || "").trim();

  if (!base || !/\/ProAlbumImages$/i.test(base) || !folder || !imageName) {
    return "";
  }

  const encodedName = encodeURIComponent(imageName)
    .replace(/%25([0-9a-f]{2})/gi, "%$1");

  return `${base}/${folder}/${encodedName}`;
}

function AlbumDesignCollage({ album, getProductImageUrl }) {
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
          backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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
            backgroundColor: "var(--hm-border-strong, #e4e4e7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Gem size={22} color="var(--hm-text-faint, #71717a)" strokeWidth={1.5} />
        </Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "var(--hm-text-zinc, #a1a1aa)",
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
          backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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
        backgroundColor: "var(--hm-surface, #ffffff)",
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
              backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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
                  backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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
                    color: "var(--hm-surface, #ffffff)",
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

function AlbumCoverCollage({ album, getProductImageUrl, albumImageBase }) {
  const coverUrl = buildAlbumCoverUrl(album, albumImageBase);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [coverUrl]);

  if (coverUrl && !coverFailed) {
    return (
      <Box sx={{ width: "100%", height: "100%", overflow: "hidden", backgroundColor: "var(--hm-surface-subtle, #f4f4f5)" }}>
        <img
          src={coverUrl}
          alt={album?.albumName || "Album cover"}
          loading="lazy"
          onError={() => setCoverFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Box>
    );
  }

  return <AlbumDesignCollage album={album} getProductImageUrl={getProductImageUrl} />;
}

export default function ExclusiveAlbumOverlay({
  initialDomain = "beluxjewel.web",
}) {
  const {
    isOpen,
    resolvedCustomerId,
    loading,
    error: albumLoadError,
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
    showAlbumList,
    scrollContainerRef,
    isHeaderVisible,
    isScrolled,
    isScrolledPastMasthead,
    handleAlbumSelect,
    handleBackToAlbums,
    handleClose,
    handleMoveToProductDetail,
    handleToggleLike,
    handleToggleCart,
    likedDesigns,
    cartDesigns,
    getProductImageUrl,
    formatPrice,
    blockedStatus,
    blockedAlbum,
    matchedAlbum,
    albumListScope,
    switchAlbumScope,
  } = useExclusiveAlbum({ initialDomain });

  const { islogin, loginUserDetail, setislogin, storeInit } = useStore();

  const albumCustomerId =
    selectedAlbum?.CustomerId ?? selectedAlbum?.Customerid ?? selectedAlbum?.customerId ??
    selectedAlbum?.customerid ?? albums?.[0]?.CustomerId ?? albums?.[0]?.Customerid ??
    albums?.[0]?.customerId ?? albums?.[0]?.customerid ?? resolvedCustomerId;
  useAlbumAuth(albumCustomerId, isOpen);

  // --- Logout / Avatar state ---
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const userName =
    (loginUserDetail?.firstname
      ? `${loginUserDetail.firstname} ${loginUserDetail.lastname || ""}`.trim()
      : "") ||
    loginUserDetail?.fullname ||
    loginUserDetail?.name ||
    "User";

  const userInitial = userName.charAt(0).toUpperCase() || "U";

  const handleAvatarClick = (e) => setAvatarAnchorEl(e.currentTarget);
  const handleAvatarClose = () => setAvatarAnchorEl(null);
  const avatarPopoverOpen = Boolean(avatarAnchorEl);

  const handleLogout = () => {
    setOpenLogoutModal(false);
    handleAvatarClose();
    logoutUser({ setislogin, storeInit, redirectUrl: "/" });
  };

  const handleMoveToDesignWithCache = useCallback(
    (design) => {
      if (typeof window !== "undefined" && Array.isArray(currentAlbumDesigns) && currentAlbumDesigns.length > 0) {
        try {
          sessionStorage.setItem("procatalog_design_list", JSON.stringify(currentAlbumDesigns));
        } catch (_) { }
      }
      handleMoveToProductDetail(design);
    },
    [currentAlbumDesigns, handleMoveToProductDetail]
  );

  if (!isOpen) return null;

  // Album is expired/deactivated: render ONLY the status page inside the same
  // full-screen Dialog so no album content is reachable.
  if (blockedStatus) {
    const StatusPage =
      blockedStatus === "expired" ? AlbumExpiredPage : AlbumDeactivatedPage;
    const statusAlbum = blockedAlbum || selectedAlbum;
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullScreen
        TransitionComponent={Fade}
        transitionDuration={200}
        PaperProps={{
          className: "home-root",
          sx: {
            backgroundColor: "var(--hm-surface-muted, #f8f9fa)",
            color: "var(--hm-text-dark, #27272a)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        <StatusPage
          onReturnHome={handleClose}
          albumName={statusAlbum?.albumName}
          expiresAt={statusAlbum?.expiresAt}
        />
      </Dialog>
    );
  }

  return (
    <>
      <ReusableConfirmModal
        open={openLogoutModal}
        onConfirm={handleLogout}
        onClose={() => setOpenLogoutModal(false)}
        type="logout"
      />
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullScreen
        TransitionComponent={Fade}
        transitionDuration={200}
        PaperProps={{
          className: "home-root",
          sx: {
            backgroundColor: "var(--hm-surface-cream2, #faf9f6)", // elegant off-white
            color: "var(--hm-text-dark, #27272a)",
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
            background: "var(--hm-topbar-gradient)",
            color: "var(--hm-surface, #ffffff)",
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
              backgroundColor: "var(--hm-blue, #0052cc)",
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
                      if (selectedAlbum) handleBackToAlbums();
                    }}
                    disabled={!selectedAlbum}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "25px",
                      border: "1px solid var(--hm-border, #e2e8f0)",
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
                      border: "1px solid var(--hm-border, #e2e8f0)",
                      opacity: 0.3,
                    }}
                  >
                    <ChevronRight size={18} />
                  </IconButton>

                  {/* Go to main home page */}
                  <Button
                    size="small"
                    onClick={handleClose}
                    startIcon={<Home size={15} />}
                    sx={{
                      borderRadius: "2px",
                      color: "var(--hm-text, #0f172a)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.04em",
                      textTransform: "none",
                      ml: 1,
                      px: 1.5,
                      backgroundColor: "var(--hm-surface-soft, #f8fafc)",
                      border: "1px solid var(--hm-border, #e2e8f0)",
                      "&:hover": {
                        backgroundColor: "var(--hm-text, #0f172a)",
                        color: "var(--hm-surface, #ffffff)",
                      },
                    }}
                  >
                    Home
                  </Button>

                  {selectedAlbum && (
                    <Button
                      size="small"
                      onClick={handleBackToAlbums}
                      startIcon={<ArrowLeft size={15} />}
                      sx={{
                        borderRadius: "2px",
                        color: "var(--hm-text, #0f172a)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        letterSpacing: "0.04em",
                        textTransform: "none",
                        ml: 1,
                        px: 1.5,
                        backgroundColor: "var(--hm-surface-soft, #f8fafc)",
                        border: "1px solid var(--hm-border, #e2e8f0)",
                        "&:hover": {
                          backgroundColor: "var(--hm-text, #0f172a)",
                          color: "var(--hm-surface, #ffffff)",
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
                            color: "var(--hm-text-ink-alt, #18181b)",
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
                            color: "var(--hm-text-faint, #71717a)",
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
                    border: "1px solid var(--hm-border, #e2e8f0)",
                    color: "var(--hm-text, #0f172a)",
                    flexShrink: 0,
                    "&:hover": {
                      backgroundColor: "var(--hm-text, #0f172a)",
                      color: "var(--hm-surface, #ffffff)",
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
                    backgroundColor: "var(--hm-surface-soft, #f8fafc)",
                    borderRadius: "15px",
                    border: "1px solid var(--hm-border, #e2e8f0)",
                    px: 1.75,
                    py: 0.85,
                    width: { xs: "100%", md: 320 },
                    flex: { xs: 1, md: "none" },
                    transition: "all 0.15s ease",
                    "&:focus-within": {
                      backgroundColor: "var(--hm-surface, #ffffff)",
                      borderColor: "var(--hm-text, #0f172a)",
                    },
                  }}
                >
                  <Search
                    size={16}
                    color="var(--hm-text-gray, #64748b)"
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
                      color: "var(--hm-text, #0f172a)",
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

                {/* User Avatar (visible when logged in) */}
                {islogin && (
                  <Tooltip title={userName} placement="bottom">
                    <Box
                      id="album-user-avatar"
                      onClick={handleAvatarClick}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--hm-text, #0f172a) 0%, var(--hm-text-slate, #334155) 100%)",
                        color: "var(--hm-surface, #ffffff)",
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        flexShrink: 0,
                        userSelect: "none",
                        transition: "box-shadow 0.2s ease, transform 0.15s ease",
                        "&:hover": {
                          boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.15)",
                          transform: "scale(1.07)",
                        },
                      }}
                    >
                      {userInitial}
                    </Box>
                  </Tooltip>
                )}

                {/* Avatar Popover */}
                <Popover
                  open={avatarPopoverOpen}
                  anchorEl={avatarAnchorEl}
                  onClose={handleAvatarClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{
                    paper: {
                      className: "home-root",
                      sx: {
                        mt: 1,
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        minWidth: 220,
                        overflow: "hidden",
                      },
                    },
                  }}
                >
                  {/* Popover header */}
                  <Box
                    sx={{
                      px: 2.5,
                      py: 2,
                      background: "linear-gradient(135deg, var(--hm-text, #0f172a) 0%, var(--hm-text-slate, #334155) 100%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--hm-surface, #ffffff)",
                        flexShrink: 0,
                      }}
                    >
                      {userInitial}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "var(--hm-surface, #ffffff)",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 140,
                        }}
                      >
                        {userName}
                      </Typography>
                      {(loginUserDetail?.userid || loginUserDetail?.email) && (
                        <Typography
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.72rem",
                            color: "rgba(255,255,255,0.65)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 140,
                            mt: 0.15,
                          }}
                        >
                          {loginUserDetail?.userid || loginUserDetail?.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Logout button */}
                  <Box sx={{ px: 1.5, py: 1.5 }}>
                    <Button
                      id="album-logout-btn"
                      fullWidth
                      onClick={() => {
                        handleAvatarClose();
                        setOpenLogoutModal(true);
                      }}
                      sx={{
                        borderRadius: "10px",
                        py: 1,
                        textTransform: "none",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "var(--hm-danger-red, #ef4444)",
                        backgroundColor: "var(--hm-danger-bg, #fef2f2)",
                        justifyContent: "flex-start",
                        px: 2,
                        "&:hover": {
                          backgroundColor: "var(--hm-danger-soft, #fee2e2)",
                        },
                      }}
                    >
                      Log Out
                    </Button>
                  </Box>
                </Popover>

                {/* Desktop Close Button (hidden on mobile, visible on desktop) */}
                <IconButton
                  onClick={handleClose}
                  aria-label="Close exclusive albums"
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    width: 34,
                    height: 34,
                    borderRadius: "25px",
                    border: "1px solid var(--hm-border, #e2e8f0)",
                    color: "var(--hm-text, #0f172a)",
                    "&:hover": {
                      backgroundColor: "var(--hm-text, #0f172a)",
                      color: "var(--hm-surface, #ffffff)",
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
              {!selectedAlbum && loading && initialRandomNo && !showAlbumList && (
                <Box>
                  {/* Masthead skeleton matching the album list view */}
                  <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Skeleton width={280} height={56} sx={{ mx: "auto", borderRadius: "10px" }} />
                    <Skeleton width={220} height={20} sx={{ mx: "auto", mt: 1, borderRadius: "6px" }} />
                  </Box>
                  {/* Album-card grid skeleton matching the list view cards */}
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
                          backgroundColor: "var(--hm-surface, #ffffff)",
                          borderRadius: "20px",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            position: "relative",
                            backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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
                            sx={{ width: "65%", height: 28, borderRadius: "6px" }}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: "35%", height: 18, borderRadius: "4px" }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* ============================================================= */}
              {/* LEVEL 1: ALL ALBUMS GRID VIEW (Matches Attached Reference)     */}
              {/* ============================================================= */}
              {!selectedAlbum && !loading && initialRandomNo && !showAlbumList && (
                <Box
                  sx={{
                    minHeight: { xs: "55vh", md: "65vh" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mb: 2.5,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "var(--hm-surface-warm2, #f1f0ed)",
                      color: "var(--hm-text-faint, #71717a)",
                      fontSize: 30,
                    }}
                    aria-hidden="true"
                  >
                    ?
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: { xs: "1.8rem", sm: "2.2rem" },
                      color: "var(--hm-text-dark, #27272a)",
                      mb: 1,
                    }}
                  >
                    No such album exists
                  </Typography>
                  <Typography sx={{ color: "var(--hm-text-faint, #71717a)", mb: 3 }}>
                    This album link may be invalid or expired.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleBackToAlbums}
                    sx={{
                      borderRadius: "10px",
                      px: 2.5,
                      py: 1.1,
                      textTransform: "none",
                      backgroundColor: "var(--hm-text-dark, #27272a)",
                      "&:hover": { backgroundColor: "var(--hm-hover-dark, #3f3f46)" },
                    }}
                  >
                    Browse albums
                  </Button>
                </Box>
              )}

              {!selectedAlbum && (!initialRandomNo || showAlbumList) && (
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
                        color: "var(--hm-text-dark, #27272a)",
                        lineHeight: 1.1,
                        mb: 1,
                      }}
                    >
                      {initialRandomNo && albumListScope === "one" && matchedAlbum
                        ? matchedAlbum.albumName || "Shared Album"
                        : "My Albums"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        color: "var(--hm-text-faint, #71717a)",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.02em",
                      }}
                    >
                      A collection of elegantly curated items
                    </Typography>
                  </motion.div>

                  {/* Sub-bar: shared-link scope toggle + Sort Filter */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: initialRandomNo ? "space-between" : "flex-end",
                      flexWrap: "wrap",
                      gap: 1.5,
                      mb: 3,
                    }}
                  >
                    {initialRandomNo && (
                      <Box
                        role="tablist"
                        aria-label="Album scope"
                        sx={{
                          display: "flex",
                          alignItems: "stretch",
                          gap: "6px",
                          p: "6px",
                          borderRadius: "18px",
                          backgroundColor: "var(--hm-surface-warm2, #f1f0ed)",
                          border: "1px solid var(--hm-border, #e7e5e4)",
                          width: { xs: "100%", sm: "auto" },
                          minWidth: { sm: "430px" },
                        }}
                      >
                        {[
                          {
                            key: "one",
                            label: "My Albums",
                            sub: matchedAlbum?.albumName || "This shared album",
                            icon: <User size={18} />,
                          },
                          {
                            key: "all",
                            label: "Albums",
                            sub: "All shared albums",
                            icon: <LayoutGrid size={18} />,
                          },
                        ].map((tab) => {
                          const active = albumListScope === tab.key;
                          return (
                            <Box
                              key={tab.key}
                              component="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => switchAlbumScope(tab.key)}
                              sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                px: 2.5,
                                py: 1.4,
                                border: "none",
                                borderRadius: "13px",
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif",
                                textAlign: "left",
                                color: active ? "#ffffff" : "var(--hm-text-faint, #71717a)",
                                backgroundColor: active ? "#7c3aed" : "transparent",
                                boxShadow: active
                                  ? "0 6px 16px rgba(124, 58, 237, 0.35)"
                                  : "none",
                                transition: "all 0.25s ease",
                                "&:hover": {
                                  color: active ? "#ffffff" : "var(--hm-text-dark, #27272a)",
                                  backgroundColor: active ? "#6d28d9" : "rgba(0,0,0,0.04)",
                                },
                              }}
                            >
                              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                                {tab.icon}
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Box
                                  sx={{
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {tab.label}
                                </Box>
                                <Box
                                  sx={{
                                    fontSize: "0.68rem",
                                    fontWeight: 400,
                                    lineHeight: 1.3,
                                    opacity: active ? 0.85 : 0.75,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: 180,
                                  }}
                                >
                                  {tab.sub}
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontSize: "0.85rem",
                          color: "var(--hm-text-faint, #71717a)",
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
                            color: "var(--hm-text-dark, #27272a)",
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
                            backgroundColor: "var(--hm-surface, #ffffff)",
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
                              backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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
                      <Typography sx={{ fontSize: "1rem", color: "var(--hm-text-gray, #64748b)", mb: 2 }}>
                        {albumLoadError
                          ? "We couldn’t load the albums. Please try again."
                          : searchQuery
                            ? `No albums found matching "${searchQuery}".`
                            : "No albums are available for this customer yet."}
                      </Typography>
                      {albumLoadError && (
                        <Button onClick={handleBackToAlbums} sx={{ textTransform: "none" }}>
                          Try again
                        </Button>
                      )}
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
                              backgroundColor: "var(--hm-surface, #ffffff)",
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
                                backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
                                overflow: "hidden",
                              }}
                            >
                              <AlbumCoverCollage
                                album={album}
                                getProductImageUrl={getProductImageUrl}
                                albumImageBase={storeInit?.AlbumImageFol}
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
                                  color: "var(--hm-text-dark, #27272a)",
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
                                  color: "var(--hm-text-faint, #71717a)",
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
                      borderBottom: "1px solid var(--hm-border, #eeeeee)",
                    }}
                  >
                    {/* Album Cover Art */}
                    <Box
                      sx={{
                        width: { xs: 140, sm: 180, md: 220 },
                        height: { xs: 140, sm: 180, md: 220 },
                        borderRadius: "20px",
                        backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
                        overflow: "hidden",
                        flexShrink: 0,
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)"
                      }}
                    >
                      <AlbumCoverCollage
                        album={selectedAlbum}
                        getProductImageUrl={getProductImageUrl}
                        albumImageBase={storeInit?.AlbumImageFol}
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
                          color: "var(--hm-text-faint, #71717a)",
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
                          color: "var(--hm-text-dark, #27272a)",
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: 'var(--hm-surface, #ffffff)', border: '1px solid var(--hm-border-strong, #e4e4e7)', px: 1.5, py: 0.6, borderRadius: '12px' }}>
                          <Gem size={14} color="var(--hm-text-faint, #71717a)" strokeWidth={1.5} />
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--hm-text-muted, #52525b)', fontWeight: 500 }}>
                            {selectedAlbum.designCount || 0} items
                          </Typography>
                        </Box>

                        {/* Expiry Pill */}
                        {selectedAlbum.ExpiryDate && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: 'var(--hm-surface, #ffffff)', border: '1px solid var(--hm-border-strong, #e4e4e7)', px: 1.5, py: 0.6, borderRadius: '12px' }}>
                            <Calendar size={14} color="var(--hm-text-faint, #71717a)" strokeWidth={1.5} />
                            <Typography sx={{ fontSize: '0.8rem', color: 'var(--hm-text-muted, #52525b)', fontWeight: 500 }}>
                              Valid until {new Date(selectedAlbum.ExpiryDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  {currentAlbumDesigns.length === 0 ? (
                    <Box
                      sx={{
                        py: 8,
                        textAlign: "center",
                        border: "1px dashed var(--hm-border, #e2e8f0)",
                        borderRadius: "2px",
                        backgroundColor: "var(--hm-surface-soft, #f8fafc)",
                      }}
                    >
                      <Gem size={36} color="var(--hm-text-light, #94a3b8)" style={{ marginBottom: 12 }} />
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--hm-text, #0f172a)",
                          mb: 0.5,
                        }}
                      >
                        {searchQuery
                          ? "No designs match your search"
                          : "Designs available for this collection are being prepared"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.82rem", color: "var(--hm-text-gray, #64748b)" }}>
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
                        const designKey = design.designno || design.autocode;
                        const isLiked = Boolean(likedDesigns?.[designKey]);
                        const isInCart = Boolean(cartDesigns?.[designKey]);

                        return (
                          <Box
                            key={`${design.id || design.autocode}-${design.designno}-${index}`}
                            onClick={() => handleMoveToDesignWithCache(design)}
                            sx={{
                              borderRadius: "20px",
                              backgroundColor: "var(--hm-surface, #ffffff)",
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
                                backgroundColor: "var(--hm-surface-subtle, #f4f4f5)",
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

                              {/* Like Action Button */}
                              <IconButton
                                size="small"
                                title={isLiked ? "Unlike" : "Like"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLike(design, selectedAlbum);
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 10,
                                  left: 10,
                                  backgroundColor: isLiked
                                    ? "var(--hm-danger-tint, #fff1f2)"
                                    : "rgba(255, 255, 255, 0.92)",
                                  backdropFilter: "blur(4px)",
                                  width: 34,
                                  height: 34,
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                  zIndex: 2,
                                  "&:hover": {
                                    backgroundColor: "var(--hm-surface, #ffffff)",
                                    transform: "scale(1.08)",
                                  },
                                }}
                              >
                                <Heart
                                  size={17}
                                  color={isLiked ? "var(--hm-rose, #e11d48)" : "var(--hm-text-muted, #52525b)"}
                                  fill={isLiked ? "var(--hm-rose, #e11d48)" : "transparent"}
                                  strokeWidth={isLiked ? 0 : 2}
                                />
                              </IconButton>
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  backgroundColor: "var(--hm-surface, #ffffff)",
                                  color: "var(--hm-text-dark, #27272a)",
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
                                  color: "var(--hm-text, #0f172a)",
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
                                  color: "var(--hm-text-gray, #64748b)",
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
                                    style={{ color: "var(--hm-blue-deep, #002fa7)", fontWeight: 600 }}
                                  >
                                    {Number(design.Dwt).toFixed(2)}ct
                                  </span>
                                ) : null}
                              </Box>

                              {/* Price & Action Buttons */}
                              <Box
                                sx={{
                                  mt: "auto",
                                  pt: 1.25,
                                  borderTop: "1px solid var(--hm-surface-blue, #f1f5f9)",
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
                                      color: "var(--hm-text, #0f172a)",
                                      fontVariantNumeric: "tabular-nums",
                                    }}
                                  >
                                    {price}
                                  </Typography>
                                ) : (
                                  <Typography
                                    sx={{ fontSize: "0.76rem", color: "var(--hm-text-light, #94a3b8)" }}
                                  >
                                    Price on request
                                  </Typography>
                                )}

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                  <IconButton
                                    size="small"
                                    title={isInCart ? "Remove from cart" : "Add to cart"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleCart(design, selectedAlbum);
                                    }}
                                    sx={{
                                      border: isInCart
                                        ? "1px solid var(--hm-success, #16a34a)"
                                        : "1px solid var(--hm-border, #e2e8f0)",
                                      backgroundColor: isInCart ? "var(--hm-success-border, #dcfce7)" : "var(--hm-surface, #ffffff)",
                                      color: isInCart ? "var(--hm-success, #16a34a)" : "var(--hm-text, #0f172a)",
                                      p: "5px",
                                      borderRadius: "4px",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        backgroundColor: isInCart ? "var(--hm-success-text, #bbf7d0)" : "var(--hm-surface-subtle, #f4f4f5)",
                                        transform: "scale(1.06)",
                                      },
                                    }}
                                  >
                                    {isInCart ? (
                                      <Check size={15} strokeWidth={2.5} />
                                    ) : (
                                      <ShoppingCart size={15} strokeWidth={2} />
                                    )}
                                  </IconButton>

                                  <Button
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveToDesignWithCache(design);
                                    }}
                                    sx={{
                                      minWidth: "auto",
                                      p: "2px 8px",
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      borderRadius: "2px",
                                      color: "var(--hm-text, #0f172a)",
                                      border: "1px solid var(--hm-border, #e2e8f0)",
                                      "&:hover": {
                                        backgroundColor: "var(--hm-text, #0f172a)",
                                        color: "var(--hm-surface, #ffffff)",
                                      },
                                    }}
                                  >
                                    VIEW
                                  </Button>
                                </Box>
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
    </>
  );
}
