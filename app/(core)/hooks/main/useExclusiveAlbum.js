"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { handleMoveToDetail } from "@/app/(core)/utils/product/productListingHelpers";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";

const imageNotFound = "/image-not-found.jpg";

/**
 * Decode HTML entities in currency symbols (e.g. '&#8377;' -> '₹')
 */
export function decodeCurrencySymbol(str) {
  if (!str) return "₹";
  if (str === "&#8377;" || str.includes("8377")) return "₹";
  if (str.startsWith("&#") && typeof document !== "undefined") {
    try {
      const txt = document.createElement("textarea");
      txt.innerHTML = str;
      return txt.value;
    } catch (_) {}
  }
  return str;
}

/**
 * useExclusiveAlbum
 *
 * Scalable, production-ready hook managing all data fetching, URL param detection,
 * sorting, search filtering, scroll dynamics, and product detail routing for
 * the Exclusive Album collection feature.
 *
 * @param {Object} options
 * @param {string} [options.initialDomain="beluxjewel.web"] Domain name for API query
 * @param {string} [options.defaultCustomerId="2275"] Fallback customer ID if none resolved
 * @param {boolean} [options.autoSelectRandomNo=true] Whether to auto-select album if randomNo is present in URL
 */
export function useExclusiveAlbum({
  initialDomain = "beluxjewel.web",
  defaultCustomerId = "2275",
  autoSelectRandomNo = true,
} = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 1. URL Parameter Detection (with window fallback for resilient client hydration)
  const checkUrlParams = useCallback(() => {
    let hasExclusive =
      searchParams.has("exclusive-album") ||
      searchParams.get("exclusive-album") !== null;

    let custId =
      searchParams.get("customerid") ||
      searchParams.get("customerId") ||
      searchParams.get("CustomerId") ||
      "";

    let randomNo =
      searchParams.get("randomNo") || searchParams.get("RandomNo") || "";

    if (typeof window !== "undefined") {
      const qs = window.location.search || "";
      if (qs.toLowerCase().includes("exclusive-album")) {
        hasExclusive = true;
      }
      const urlParams = new URLSearchParams(qs);
      if (!custId) {
        custId =
          urlParams.get("customerid") ||
          urlParams.get("customerId") ||
          urlParams.get("CustomerId") ||
          "";
      }
      if (!randomNo) {
        randomNo =
          urlParams.get("randomNo") || urlParams.get("RandomNo") || "";
      }
    }

    return { hasExclusive, custId: custId || "", randomNo };
  }, [searchParams]);

  const initialParams = useMemo(() => checkUrlParams(), [checkUrlParams]);

  // 2. Core State
  const [isOpen, setIsOpen] = useState(initialParams.hasExclusive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // null = Grid view; object = Detail view
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name" | "count" | "date"
  const [storeConfig, setStoreConfig] = useState({
    CDNDesignImageFol: "",
    Currencysymbol: "₹",
  });
  const [initialRandomNo, setInitialRandomNo] = useState(
    initialParams.randomNo || ""
  );

  // 3. Scroll & Header Animation State
  const scrollContainerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledPastMasthead, setIsScrolledPastMasthead] = useState(false);
  const lastScrollTopRef = useRef(0);

  // 4. Data Fetching with AbortController to prevent race conditions
  const fetchAlbums = useCallback(async () => {
    const { hasExclusive, custId, randomNo } = checkUrlParams();
    setInitialRandomNo(randomNo || "");

    if (!hasExclusive) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    const targetDomain = initialDomain || "beluxjewel.web";

    try {
      let activeCustId = custId;
      const baseApiUrl = `/api/sqlite/exclusive-albums?domain=${targetDomain}`;

      // If randomNo is present without customerId, resolve customerId first
      if (randomNo && !activeCustId) {
        try {
          const resolveRes = await fetch(
            `${baseApiUrl}&RandomNo=${encodeURIComponent(randomNo)}`,
            { signal: abortController.signal }
          );
          const resolveData = await resolveRes.json();
          if (
            resolveData?.Status === "200" &&
            resolveData?.Data?.rd?.[0]?.CustomerId
          ) {
            activeCustId = resolveData.Data.rd[0].CustomerId;
          }
        } catch (resolveErr) {
          if (resolveErr.name !== "AbortError") {
            console.warn(
              "[useExclusiveAlbum] Customer resolution from randomNo failed:",
              resolveErr
            );
          }
        }
      }

      // Fallback customer ID if unresolved
      if (!activeCustId) {
        activeCustId = defaultCustomerId;
      }

      // Fetch all albums for this customer
      const res = await fetch(
        `${baseApiUrl}&customerId=${encodeURIComponent(activeCustId)}`,
        { signal: abortController.signal }
      );
      const data = await res.json();

      if (data?.Status === "200" && Array.isArray(data?.Data?.rd)) {
        const fetchedAlbums = data.Data.rd;
        setAlbums(fetchedAlbums);

        if (data.Data.storeConfig) {
          setStoreConfig(data.Data.storeConfig);
        }

        // Auto-select album matching randomNo if configured
        if (randomNo && autoSelectRandomNo) {
          const albumToSelect = fetchedAlbums.find(
            (a) => a.RandomNo === randomNo || a.RandomNo == randomNo
          );
          if (albumToSelect) {
            setSelectedAlbum(albumToSelect);
          }
        }
      } else {
        setAlbums([]);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("[useExclusiveAlbum] Fetch albums error:", err);
        setError(err);
        setAlbums([]);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      abortController.abort();
    };
  }, [checkUrlParams, initialDomain, defaultCustomerId, autoSelectRandomNo]);

  useEffect(() => {
    const cleanup = fetchAlbums();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [fetchAlbums]);

  // 5. Scroll-to-top on selectedAlbum change
  useEffect(() => {
    setIsHeaderVisible(true);
    setIsScrolled(false);
    setIsScrolledPastMasthead(false);
    lastScrollTopRef.current = 0;

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

  // 6. Dynamic Scroll Listener (requestAnimationFrame throttled)
  useEffect(() => {
    if (!isOpen) return;

    let cleanup = null;
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScroll = container.scrollTop;
            const lastScroll = lastScrollTopRef.current;
            const diff = currentScroll - lastScroll;

            if (currentScroll <= 15) {
              setIsHeaderVisible(true);
              setIsScrolled(false);
              setIsScrolledPastMasthead(false);
            } else {
              setIsScrolled(true);

              // Generous hysteresis to eliminate flicker between masthead and header
              if (currentScroll > 100) {
                setIsScrolledPastMasthead(true);
              } else if (currentScroll < 60) {
                setIsScrolledPastMasthead(false);
              }

              // Hide when scrolling down deeper past 160px
              if (diff > 10 && currentScroll > 160) {
                const isInputActive =
                  document.activeElement?.tagName === "INPUT";
                if (!isInputActive) {
                  setIsHeaderVisible(false);
                }
              }
              // Smoothly reveal when scrolling up
              else if (diff < -8) {
                setIsHeaderVisible(true);
              }
            }

            lastScrollTopRef.current = Math.max(0, currentScroll);
            ticking = false;
          });
          ticking = true;
        }
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      cleanup = () => container.removeEventListener("scroll", handleScroll);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, [isOpen]);

  // 7. Memoized Filtered & Sorted Albums (Level 1)
  const displayedAlbums = useMemo(() => {
    if (!albums || albums.length === 0) return [];
    let list = [...albums];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          (a.albumName && a.albumName.toLowerCase().includes(q)) ||
          (a.albumcode && a.albumcode.toLowerCase().includes(q))
      );
    }

    if (sortBy === "count") {
      list.sort((a, b) => (b.designCount || 0) - (a.designCount || 0));
    } else if (sortBy === "date") {
      list.sort(
        (a, b) => new Date(b.EntryDate || 0) - new Date(a.EntryDate || 0)
      );
    } else {
      list.sort((a, b) => (a.albumName || "").localeCompare(b.albumName || ""));
    }

    return list;
  }, [albums, searchQuery, sortBy]);

  // 8. Memoized Filtered Designs for Selected Album (Level 2)
  const currentAlbumDesigns = useMemo(() => {
    if (!selectedAlbum || !Array.isArray(selectedAlbum.designs)) return [];
    if (!searchQuery.trim()) return selectedAlbum.designs;
    const q = searchQuery.toLowerCase().trim();
    return selectedAlbum.designs.filter(
      (d) =>
        (d.designno && d.designno.toLowerCase().includes(q)) ||
        (d.TitleLine && d.TitleLine.toLowerCase().includes(q)) ||
        (d.category && d.category.toLowerCase().includes(q)) ||
        (d.MetalTypePurity && d.MetalTypePurity.toLowerCase().includes(q))
    );
  }, [selectedAlbum, searchQuery]);

  // 9. Pricing & Currency Helpers
  const currencySymbol = useMemo(
    () => decodeCurrencySymbol(storeConfig?.Currencysymbol),
    [storeConfig]
  );

  const formatPrice = useCallback(
    (val) => {
      if (val == null || val === "" || isNaN(val)) return null;
      return `${currencySymbol} ${Math.round(Number(val)).toLocaleString(
        "en-IN"
      )}`;
    },
    [currencySymbol]
  );

  // 10. Product Image Resolution
  const getProductImageUrl = useCallback(
    (design) => {
      if (!design || !design.designno) return imageNotFound;
      const cdn =
        storeConfig.CDNDesignImageFol || storeConfig.DesignImageFol || "";
      const ext = design.ImageExtension || "webp";
      return `${cdn}${design.designno}~1.${ext}`;
    },
    [storeConfig]
  );

  // 11. Navigation Actions
  const handleAlbumSelect = useCallback((album) => {
    setSelectedAlbum(album);
    setSearchQuery("");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const handleBackToAlbums = useCallback(() => {
    setSelectedAlbum(null);
    setSearchQuery("");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

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
    } catch (_) {}
  }, [searchParams, pathname, router]);

  const handleMoveToProductDetail = useCallback(
    (design) => {
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
        console.error("[useExclusiveAlbum] handleMoveToDetail error:", err);
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
            "[useExclusiveAlbum] Fallback redirect error:",
            innerErr
          );
          if (design?.designno) {
            router.push(`/d/${design.designno}`);
          }
        }
      }
    },
    [getProductImageUrl, storeConfig, router]
  );

  return {
    // State
    isOpen,
    setIsOpen,
    loading,
    error,
    albums,
    selectedAlbum,
    setSelectedAlbum,
    displayedAlbums,
    currentAlbumDesigns,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    storeConfig,
    initialRandomNo,
    currencySymbol,

    // Scroll & Header Animation State
    scrollContainerRef,
    isHeaderVisible,
    isScrolled,
    isScrolledPastMasthead,

    // Actions & Helpers
    handleAlbumSelect,
    handleBackToAlbums,
    handleClose,
    handleMoveToProductDetail,
    getProductImageUrl,
    formatPrice,
    refetch: fetchAlbums,
  };
}

export default useExclusiveAlbum;
