"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Album.modul.scss";
import { Get_Procatalog } from "@/app/(core)/utils/API/Home/Get_Procatalog/Get_Procatalog";
import Cookies from "js-cookie";
import {
  Box,
  Modal,
  Grid,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import AlbumSkeleton from "./AlbumSkeleton/AlbumSkeleton";
import CloseIcon from "@mui/icons-material/Close";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSearchParams } from "next/navigation";
import {
  normalizeALC,
  buildAlbumCacheKey,
  getPricingContext,
} from "./CacheBuilder";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";

// ─── Module-level constants ────────────────────────────────────────────────────
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 1500;
const IMAGE_NOT_FOUND = "/Assets/image-not-found.jpg";

/** Build the URL for an album page */
function buildAlbumUrl(albumName, securityKey) {
  const key =
    securityKey && Number(securityKey) > 0
      ? "K=" + btoa(String(securityKey)) + "/"
      : "";
  return (
    "/p/" +
    encodeURIComponent(albumName || "") +
    "/" +
    key +
    "?A=" +
    btoa("AlbumName=" + (albumName || ""))
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const Album = () => {
  const { islogin, loginUserDetail, storeInit } = useStore();
  const navigation = useNextRouterLikeRR();
  const searchParams = useSearchParams();
  const ALCVAL = searchParams.get("ALC") || "";

  const [albumData, setAlbumData] = useState([]);
  const [designSubData, setDesignSubData] = useState([]);
  const [openAlbumName, setOpenAlbumName] = useState("");
  const [securityKey, setSecurityKey] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  // Fetch-control refs — no extra re-renders
  const isFetchingRef = useRef(false);
  const lastKeyRef = useRef("");
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    },
    [],
  );

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeInit, islogin),
    [loginUserDetail, storeInit, islogin],
  );

  // ── Image resolution ─────────────────────────────────────────────────────────
  const resolveImage = useCallback(
    (data) => {
      if (data && data.AlbumImageName && data.AlbumImageFol) {
        return (
          (storeInit && storeInit.AlbumImageFol ? storeInit.AlbumImageFol : "") +
          data.AlbumImageFol +
          "/" +
          data.AlbumImageName
        );
      }
      if (data && data.AlbumDetail) {
        var details =
          typeof data.AlbumDetail === "string"
            ? JSON.parse(data.AlbumDetail)
            : data.AlbumDetail;
        var imgName = (details && details[0] && details[0].Image_Name) || "";
        if (imgName) {
          if (imgName.startsWith("/") || imgName.startsWith("http")) {
            return imgName;
          }
          return (
            (storeInit && storeInit.CDNDesignImageFol
              ? storeInit.CDNDesignImageFol
              : "") + imgName
          );
        }
      }
      return IMAGE_NOT_FOUND;
    },
    [storeInit],
  );

  // Pre-compute one image src per album — called once on data change, not in render
  const albumImages = useMemo(
    () => albumData.map(resolveImage),
    [albumData, resolveImage],
  );

  // Persist first album URL for other parts of the app
  useEffect(() => {
    if (!albumData.length) return;
    try {
      var first = albumData[0];
      sessionStorage.setItem(
        "firstAlbumUrl",
        buildAlbumUrl(first && first.AlbumName, first && first.AlbumSecurityId),
      );
    } catch (_) {
      // non-critical
    }
  }, [albumData]);

  // ── Retry helper ─────────────────────────────────────────────────────────────
  // Note: references fetchAlbumData which is declared below.
  // Using a ref to avoid a circular useCallback dependency.
  const fetchAlbumDataRef = useRef(null);

  const scheduleRetry = useCallback((value, finalID, precomputedKey) => {
    if (retryCountRef.current >= MAX_RETRIES) {
      // Exhausted all retries — show whatever albumData we have (may be empty)
      // DON'T clear lastKeyRef here — prevents useEffect from kicking off a new
      // duplicate fetch while we're settling. Only clear on a context change.
      retryCountRef.current = 0;
      setImagesReady(true);
      return;
    }
    retryCountRef.current += 1;
    var delay = RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
    // Do NOT clear lastKeyRef during retries — prevents the useEffect trigger
    // from racing against the already-scheduled retry timer.
    retryTimerRef.current = setTimeout(function () {
      if (fetchAlbumDataRef.current) {
        fetchAlbumDataRef.current(value, finalID, precomputedKey);
      }
    }, delay);
  }, []);

  // ── Core fetch ───────────────────────────────────────────────────────────────
  const fetchAlbumData = useCallback(
    async (value, finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) return;

      var keyALC = normalizeALC(value);
      var cacheResult = buildAlbumCacheKey(
        "procatalog_album",
        storeInit,
        pricingContext,
        finalID,
        keyALC,
      );
      var effectiveKey = precomputedKey || cacheResult.key;

      isFetchingRef.current = true;

      try {
        // 1. Disk cache hit
        var cached = await readCache(effectiveKey);
        if (
          cached &&
          cached.cached &&
          Array.isArray(cached.data) &&
          cached.data.length > 0
        ) {
          setAlbumData(cached.data);
          setImagesReady(true);
          isFetchingRef.current = false;
          return;
        }

        // 2. storeInit not ready yet — wait
        if (!storeInit) {
          isFetchingRef.current = false;
          retryTimerRef.current = setTimeout(
            () => fetchAlbumData(value, finalID, effectiveKey),
            500,
          );
          return;
        }

        // 3. API fetch
        var response = await Get_Procatalog(storeInit, finalID, value, islogin);
        var albums = response && response.Data && response.Data.rd;

        if (Array.isArray(albums) && albums.length > 0) {
          retryCountRef.current = 0;
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
          }
          setAlbumData(albums);
          setImagesReady(true);
          isFetchingRef.current = false;
          writeCache(effectiveKey, albums).catch(function () {});
        } else {
          isFetchingRef.current = false;
          scheduleRetry(value, finalID, precomputedKey);
        }
      } catch (err) {
        console.error("[Album] fetch error:", err);
        isFetchingRef.current = false;
        scheduleRetry(value, finalID, precomputedKey);
      }
    },
    [pricingContext, storeInit, islogin, scheduleRetry],
  );

  // Keep ref in sync so scheduleRetry can always call the latest closure
  useEffect(() => {
    fetchAlbumDataRef.current = fetchAlbumData;
  }, [fetchAlbumData]);

  // ── Trigger on auth/store ready ───────────────────────────────────────────────
  useEffect(() => {
    if (!pricingContext || !storeInit) return;

    var visiterID = Cookies.get("visiterId");
    var userId = loginUserDetail && loginUserDetail.id;
    var finalID =
      storeInit.IsB2BWebsite === 0
        ? islogin
          ? userId || ""
          : visiterID
        : userId || "";

    var rawALC = ALCVAL || (getSession("ALCVALUE") || "");
    if (rawALC) sessionStorage.setItem("ALCVALUE", String(rawALC));

    var keyALC = normalizeALC(rawALC);
    var keyResult = buildAlbumCacheKey(
      "procatalog_album",
      storeInit,
      pricingContext,
      finalID,
      keyALC,
    );

    if (isFetchingRef.current || lastKeyRef.current === keyResult.key) return;
    lastKeyRef.current = keyResult.key;
    fetchAlbumData(rawALC, finalID, keyResult.key);
  }, [
    islogin,
    pricingContext,
    storeInit,
    ALCVAL,
    fetchAlbumData,
    loginUserDetail?.id,
  ]);

  // ── Navigation helpers ────────────────────────────────────────────────────────
  var navigate = function (link) {
    navigation.push(link);
  };

  var handlePreview = function (data) {
    var albumName = data && data.AlbumName;
    var sk = data && data.AlbumSecurityId;
    var url = buildAlbumUrl(albumName, sk);
    setSecurityKey(sk);

    var isB2B = storeInit && storeInit.IsB2BWebsite === 1;
    if (!islogin && (isB2B || (sk && Number(sk) > 0))) {
      sessionStorage.setItem("redirectURL", url);
      navigate("/LoginOption/?LoginRedirect=" + encodeURIComponent(url));
      return;
    }

    var rawDetail = data && data.AlbumDetail;
    var subItems = rawDetail
      ? typeof rawDetail === "string"
        ? JSON.parse(rawDetail)
        : rawDetail
      : [];

    if (data && data.IsDual === 1 && subItems.length > 1) {
      setOpenAlbumName(albumName);
      setOpen(true);
      setDesignSubData(
        subItems.map(function (item) {
          return Object.assign({}, item, {
            imageKey:
              item && item.Image_Name
                ? (storeInit && storeInit.CDNDesignImageFol
                    ? storeInit.CDNDesignImageFol
                    : "") + item.Image_Name
                : IMAGE_NOT_FOUND,
          });
        }),
      );
    } else {
      sessionStorage.setItem("redirectURL", url);
      navigate(url);
    }
  };

  var handleRequestAccess = function (data) {
    var url = buildAlbumUrl(data && data.AlbumName, data && data.AlbumSecurityId);
    sessionStorage.setItem("redirectURL", url);
    navigate("/LoginOption/?LoginRedirect=" + encodeURIComponent(url));
  };

  var handleNavigateSub = function (data) {
    var albumName = (data && data.AlbumName) || openAlbumName;
    var sk = securityKey || (data && data.AlbumSecurityId);
    setSecurityKey(sk);
    var url = buildAlbumUrl(albumName, sk);

    var isB2B = storeInit && storeInit.IsB2BWebsite === 1;
    if (!islogin && (isB2B || (sk && Number(sk) > 0))) {
      sessionStorage.setItem("redirectURL", url);
      navigate("/LoginOption/?LoginRedirect=" + encodeURIComponent(url));
      return;
    }
    sessionStorage.setItem("redirectURL", url);
    navigate(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (!imagesReady) return <AlbumSkeleton />;

  var isB2B = storeInit && storeInit.IsB2BWebsite === 1;

  return (
    <div className="proCat_alubmMainDiv">
      {/* Sub-item modal for dual albums */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="proCat_album_box_main">
          <div className="proCat_modalHeader">
            <p className="proCat_modalTitle">
              {openAlbumName}{" "}
              {designSubData.length > 0 &&
                "(" +
                  designSubData.length +
                  " " +
                  (designSubData.length === 1 ? "Design" : "Designs") +
                  ")"}
            </p>
            <IconButton
              onClick={() => setOpen(false)}
              className="proCat_modalCloseBtn"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="proCat_model_overFlow">
            <div className="proCat_modalMasonry">
              {designSubData.map((data, index) => (
                <div
                  key={index}
                  className="proCat_modalCard"
                  onClick={() => handleNavigateSub(data)}
                >
                  <div className="proCat_modalCardMedia">
                    <img
                      src={data && data.imageKey}
                      className="proCat_modalCardImg"
                      alt={openAlbumName}
                      onError={(e) => {
                        e.target.src = IMAGE_NOT_FOUND;
                      }}
                    />
                    {!islogin && data && data.AlbumSecurityId !== 0 && (
                      <LockSvg className="proCat_AlbumLockIcone_popup lock_icon" />
                    )}
                  </div>
                  <p className="proCat_modalCardTitle">
                    {data && data.AlbumName}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="pro_pressESCClose">Press ESC To Close</p>
        </Box>
      </Modal>

      {/* Album grid */}
      {albumData.length > 0 && (
        <Box
          sx={{
            width: "100%",
            maxWidth: isB2B ? 2000 : 1300,
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
          }}
        >
          {isB2B ? (
            <B2BGrid
              albumData={albumData}
              albumImages={albumImages}
              islogin={islogin}
              storeInit={storeInit}
              onNavigate={handlePreview}
              onRequestAccess={handleRequestAccess}
            />
          ) : (
            <B2CGrid
              albumData={albumData}
              albumImages={albumImages}
              islogin={islogin}
              onNavigate={handlePreview}
            />
          )}
        </Box>
      )}
    </div>
  );
};

Album.displayName = "Album";
export default Album;

// ─── Shared lock SVG ──────────────────────────────────────────────────────────
const LockSvg = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#000000"
    className={className}
  >
    <path
      d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"
      fill="#000000"
    />
  </svg>
);

const GridIcon = () => (
  <IconButton
    sx={{ position: "absolute", top: 5, left: 5, bgcolor: "#e6e6e6ed" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 24 24"
    >
      <path
        fill="#4b4b4b"
        d="M5 11h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m0 10h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m8-16v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2m2 16h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2"
      />
    </svg>
  </IconButton>
);

// ─── B2B Grid ─────────────────────────────────────────────────────────────────
const B2BGrid = ({
  albumData,
  albumImages,
  islogin,
  storeInit,
  onNavigate,
  onRequestAccess,
}) => (
  <Grid container spacing={2.5}>
    {albumData.map((data, index) => {
      var rawDetail = data && data.AlbumDetail;
      var subItems = rawDetail
        ? typeof rawDetail === "string"
          ? JSON.parse(rawDetail)
          : rawDetail
        : [];
      var Icount = (data && data.TotalDesignCnt) || 0;
      var src = albumImages[index] || IMAGE_NOT_FOUND;

      return (
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Box
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.05)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            {/* Image area */}
            <Box
              onClick={() => onNavigate(data)}
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={src}
                alt={data && data.AlbumName}
                loading="lazy"
                onError={(e) => {
                  e.target.src = IMAGE_NOT_FOUND;
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.04)",
                  },
                }}
              />
              {data && data.IsDual === 1 && subItems.length > 1 && <GridIcon />}
              {!islogin && data && data.AlbumSecurityId !== 0 && (
                <LockSvg className="proCat_AlbumLockIcone lock_icon" />
              )}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                px: 2,
                pt: 2,
                pb: 2,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                component="h3"
                title={data && data.AlbumName}
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  color: "#0F3D4C",
                  lineHeight: 1.45,
                  textAlign: "center",
                  pt: 0.5,
                  pb: 1.2,
                  px: 0.5,
                  minHeight: "3.2em",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordBreak: "break-word",
                }}
              >
                {data && data.AlbumName}
              </Typography>

              {!islogin && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mt: "auto",
                    pt: 0.5,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      flex: "1 1 50%",
                      borderRadius: "6px",
                      border: "1.5px solid #0F3D4C",
                      color: "#0F3D4C",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      py: 0.9,
                      px: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      boxSizing: "border-box",
                    }}
                  >
                    {Icount} {Icount === 1 ? "Design" : "Designs"}
                  </Box>
                  <Button
                    variant="contained"
                    className="btnColorProCat"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestAccess(data);
                    }}
                    sx={{
                      flex: "1 1 50%",
                      borderRadius: "6px",
                      backgroundColor: "#0F3D4C",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      py: 0.9,
                      px: 1,
                      whiteSpace: "nowrap",
                      boxShadow: "none",
                      border: "1.5px solid #0F3D4C",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#16586e",
                        borderColor: "#16586e",
                        boxShadow: "0 2px 8px rgba(15, 61, 76, 0.25)",
                      },
                    }}
                  >
                    ACCESS
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);

// ─── B2C Grid ─────────────────────────────────────────────────────────────────
const B2CGrid = ({ albumData, albumImages, islogin, onNavigate }) => (
  <Grid container spacing={2.5}>
    {albumData.map((data, index) => {
      var rawDetail = data && data.AlbumDetail;
      var subItems = rawDetail
        ? typeof rawDetail === "string"
          ? JSON.parse(rawDetail)
          : rawDetail
        : [];
      var src = albumImages[index] || IMAGE_NOT_FOUND;

      return (
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Box
            onClick={() => onNavigate(data)}
            sx={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              height: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.05)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                backgroundColor: "#f8f9fa",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={src}
                alt={data && data.AlbumName}
                loading="lazy"
                onError={(e) => {
                  e.target.src = IMAGE_NOT_FOUND;
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.04)",
                  },
                }}
              />
              {data && data.IsDual === 1 && subItems.length > 1 && <GridIcon />}
              {!islogin && data && data.AlbumSecurityId !== 0 && (
                <LockSvg className="proCat_AlbumLockIcone lock_icon" />
              )}
            </Box>

            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  color: "#0F3D4C",
                  py: 1,
                  px: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {data && data.AlbumName}
              </Typography>
            </Box>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);


