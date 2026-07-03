"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Box, Typography, styled, IconButton, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { formatter, formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import cookies from "js-cookie";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext } from "@/app/(core)/cache_utility/CacheBuilder";
import { HeaderV2 } from "./Header";

// ─── Styled Components ───────────────────────────────────────────────────────

const HeroContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
    height: "650px",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(6),
    boxSizing: 'border-box',
    [theme.breakpoints.down("md")]: {
        height: "auto",
        flexDirection: "column",
        padding: 0,
        borderRadius: "0px",
        overflow: "visible",
        backgroundColor: "transparent",
    },
}));

const HeroImage = styled("img")(({ theme }) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
        position: "relative",
        height: "320px",
        width: "100%",
        borderRadius: "16px",
    },
    boxSizing: 'border-box'
}));

const MagazineTitle = styled(Typography)(({ theme }) => ({
    position: "absolute",
    top: "50px",
    left: "50px",
    zIndex: 2,
    color: "#fff",
    fontSize: "3rem",
    fontWeight: 300,
    textTransform: "uppercase",
    letterSpacing: "12px",
    lineHeight: 1.1,
    textShadow: "0 4px 20px rgba(0,0,0,0.4)",
    [theme.breakpoints.down("md")]: {
        top: "30px",
        left: "20px",
        fontSize: "1.4rem",
        letterSpacing: "4px",
    },
}));

const GlassCard = styled(Box)(({ theme }) => ({
    position: "relative",
    zIndex: 3,
    width: "320px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(30px)",
    borderRadius: "16px",
    padding: theme.spacing(4),
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
    [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: "10px",
        borderRadius: "16px",
        backgroundColor: "#fff",
        backdropFilter: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        padding: theme.spacing(3, 2),
        border: "1px solid #f0f0f0",
    },
}));

const NavIconButton = styled(IconButton)(({ theme }) => ({
    color: "#1a1a1a",
    backgroundColor: "rgba(0,0,0,0.05)",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
    "&.swiper-button-disabled": { opacity: 0.2 },
    [theme.breakpoints.down("md")]: {
        backgroundColor: "#f5f5f5",
    }
}));

// ─── Main Component ───────────────────────────────────────────────────────────

const MaxDesignSet = ({ data, storeInit }) => {
    const { push } = useNextRouterLikeRR();
    const { islogin, loginUserDetail } = useStore();
    const { cacheList } = useMaster();

    const [designSetList, setDesignSetList] = useState([]);
    const [imageUrlDesignSet, setImageUrlDesignSet] = useState();
    const [mounted, setMounted] = useState(false);

    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const isFetchingRef = useRef(false);
    const lastRequestKeyRef = useRef("");
    const imageNotFound = "/image-not-found.jpg";

    useEffect(() => {
        setImageUrlDesignSet(storeInit?.CDNDesignImageFolThumb);
        setMounted(true);
    }, [storeInit?.CDNDesignImageFolThumb]);

    const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeInit, islogin), [loginUserDetail, storeInit, islogin]);

    const fetchAndSetDesignSets = useCallback(async (finalID, precomputedKey) => {
        if (!pricingContext || !pricingContext.PackageId || isFetchingRef.current) return;
        const keyALC = normalizeALC("");
        const eventName = "fg_designset";
        const { key, meta } = buildAlbumCacheKey(eventName, storeInit, pricingContext, finalID, keyALC);
        const effectiveKey = precomputedKey || key;
        isFetchingRef.current = true;

        try {
            const localMeta = await fetch(`/api/v1/cache?mode=meta&key=${effectiveKey}`).then(r => r.json()).catch(() => ({ cached: false }));
            const serverEntry = findMatchingCacheEntry(cacheList?.Data?.rd ?? [], pricingContext, eventName, "");

            if (localMeta?.cached && localMeta?.CacheRebuildDate === serverEntry?.CacheRebuildDate) {
                const cached = await fetch(`/api/v1/cache?key=${effectiveKey}`).then(r => r.json());
                if (cached.cached) {
                    setDesignSetList(cached.data);
                    isFetchingRef.current = false;
                    return;
                }
            }

            const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETDesignSet_List", finalID);
            const apiData = res?.Data?.rd || [];
            setDesignSetList(apiData);
            isFetchingRef.current = false;

            if (apiData.length > 0) {
                const bookRes = await BookCache(finalID, eventName, pricingContext, "");
                if (bookRes?.CacheRebuildDate) {
                    fetch("/api/v1/cache", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: effectiveKey, data: apiData, meta: { ...meta, CacheRebuildDate: bookRes.CacheRebuildDate } }),
                    });
                }
            }
        } catch (e) {
            isFetchingRef.current = false;
        }
    }, [pricingContext, storeInit, cacheList]);

    useEffect(() => {
        if (!mounted || !pricingContext || !storeInit || cacheList === null) return;
        const fetchData = async () => {
            const visitorId = cookies.get("visiterId") ?? "0";
            const finalID = storeInit?.IsB2BWebsite == 0 ? (islogin === false ? visitorId : loginUserDetail?.id || "0") : loginUserDetail?.id || "0";
            const keyALC = normalizeALC("");
            const { key } = buildAlbumCacheKey("fg_designset", storeInit, pricingContext, finalID, keyALC);
            if (isFetchingRef.current || lastRequestKeyRef.current === key) return;
            lastRequestKeyRef.current = key;
            await fetchAndSetDesignSets(finalID, key);
        };
        fetchData();
    }, [mounted, islogin, pricingContext, storeInit, fetchAndSetDesignSets, loginUserDetail?.id, cacheList]);

    const handleNavigation = (item) => {
        const obj = {
            a: item?.autocode, b: item?.designno, m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid, c: loginUserDetail?.cmboCSQCid, f: {},
        };
        const encodeObj = compressAndEncode(JSON.stringify(obj));
        push(`/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}?p=${encodeURIComponent(encodeObj)}`);
    };

    if (designSetList.length === 0) return null;

    const currentLook = designSetList[0];
    const subProducts = JSON.parse(currentLook?.Designdetail || "[]");

    return (
        <Box sx={{
            boxSizing: 'border-box',
            width: '100%',
            py: 6, px: { xs: 2, sm: 3, md: 4 },
            bgcolor: "#fff",
        }}>
            <HeroContainer>
                <HeroImage src="WebSiteStaticImage/Banner/lookbookbanner2.webp" alt="Lookbook" />

                <MagazineTitle>
                    Complete<br />Your Look
                </MagazineTitle>

                <GlassCard>
                    <Swiper
                        modules={[Navigation]}
                        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        spaceBetween={30}
                        slidesPerView={1}
                    >
                        {subProducts.map((item, idx) => (
                            <SwiperSlide key={idx}>
                                <Box sx={{
                                    textAlign: "center", cursor: "pointer",
                                    boxSizing: 'border-box',
                                }} onClick={() => handleNavigation(item)}>
                                    <Box
                                        component="img"
                                        src={`${imageUrlDesignSet}${item?.designno}~1.jpg`}
                                        onError={(e) => (e.target.src = imageNotFound)}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "1/1",
                                            objectFit: "contain",
                                            borderRadius: "12px",
                                            backgroundColor: "rgba(255,255,255,0.5)",
                                            mb: 3,
                                            mixBlendMode: "multiply",
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: "0.6rem",
                                            color: "#666",
                                            textTransform: "uppercase",
                                            letterSpacing: "3px",
                                            mb: 1,
                                            fontWeight: 500
                                        }}
                                    >
                                        {item?.designno}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#1a1a1a", mb: 0.5, letterSpacing: "0.5px" }}>
                                        {item?.TitleLine || "Exquisite Piece"}
                                    </Typography>
                                    {storeInit?.IsPriceShow == 1 && (
                                        <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#000" }}>
                                            {islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode} {formatter(item?.UnitCostWithMarkUp)}
                                        </Typography>
                                    )}
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, borderTop: "1px solid rgba(0,0,0,0.05)", pt: 2 }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <NavIconButton ref={prevRef}><ChevronLeft size={16} /></NavIconButton>
                            <NavIconButton ref={nextRef}><ChevronRight size={16} /></NavIconButton>
                        </Box>
                        <Button
                            endIcon={<ArrowRight size={14} />}
                            onClick={() => push(islogin ? "/Lookbook" : "/LoginOption")}
                            sx={{
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                color: "#1a1a1a",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                minWidth: "auto",
                                p: 0,
                                "&:hover": { bgcolor: "transparent", color: "#666" }
                            }}
                        >
                            Explore All
                        </Button>
                    </Box>
                </GlassCard>
            </HeroContainer>
        </Box>
    );
};

export default MaxDesignSet;
