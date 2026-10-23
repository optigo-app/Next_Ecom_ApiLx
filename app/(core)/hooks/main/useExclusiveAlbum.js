"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { handleMoveToDetail } from "@/app/(core)/utils/product/productListingHelpers";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import {
  ArticleAlbumDesignViewCountAPI,
  ArticleAlbumDesignLikeAPI,
  ArticleAlbumDesignCartAPI,
  ArticleAlbumDesignRemoveCartAPI,
} from "@/app/(core)/utils/API/Album/AlbumApi";

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

  // Global store context for cart badge sync
  let storeCtx = null;
  try {
    storeCtx = useStore();
  } catch (_) {}
  const setCartCountNum = storeCtx?.setCartCountNum;

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
  const [resolvedCustomerId, setResolvedCustomerId] = useState("");
  const [showAlbumList, setShowAlbumList] = useState(false);
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

  // 2.1 Interaction & Unique Tracker State
  const [likedDesigns, setLikedDesigns] = useState({});
  const [cartDesigns, setCartDesigns] = useState({});
  const viewedAlbumsRef = useRef(new Set());
  const viewedDesignsRef = useRef(new Set());

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
    setShowAlbumList(false);

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
      const baseApiUrl = `/api/sqlite/exclusive-albums?domain=${targetDomain}`;
      // A shared link identifies one album. Fetch it directly; its row also
      // contains CustomerId, which is used only if the visitor goes back.
      const query = randomNo
        ? `&RandomNo=${encodeURIComponent(randomNo)}`
        : `&customerId=${encodeURIComponent(custId || defaultCustomerId)}`;
      const res = await fetch(`${baseApiUrl}${query}`, {
        signal: abortController.signal,
      });
      const data = await res.json();

      if (data?.Status === "200" && Array.isArray(data?.Data?.rd)) {
        const fetchedAlbums = data.Data.rd;
        const albumCustomerId = fetchedAlbums[0]?.CustomerId || data?.Data?.customerId || custId;
        setResolvedCustomerId(albumCustomerId ? String(albumCustomerId) : "");

        if (randomNo && autoSelectRandomNo) {
          const albumToSelect = fetchedAlbums.find(
            (a) => String(a.RandomNo) === String(randomNo)
          );
          setSelectedAlbum(albumToSelect || null);
          // Keep the initial shared-link view scoped to the requested album.
          // The customer album grid is fetched only when Back is clicked.
          setAlbums(albumToSelect ? [albumToSelect] : []);
        } else {
          setSelectedAlbum(null);
          setAlbums(fetchedAlbums);
        }

        if (data.Data.storeConfig) {
          setStoreConfig(data.Data.storeConfig);
        }
      } else {
        setAlbums([]);
        setSelectedAlbum(null);
        setResolvedCustomerId("");
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

  const handleBackToAlbums = useCallback(async () => {
    if (initialRandomNo) {
      const { custId } = checkUrlParams();
      const customerId = resolvedCustomerId || custId;
      if (!customerId) {
        setSelectedAlbum(null);
        setAlbums([]);
        setShowAlbumList(true);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const targetDomain = initialDomain || "beluxjewel.web";
        const response = await fetch(
          `/api/sqlite/exclusive-albums?domain=${encodeURIComponent(targetDomain)}&customerId=${encodeURIComponent(customerId)}`
        );
        const data = await response.json();
        if (data?.Status === "200" && Array.isArray(data?.Data?.rd)) {
          setAlbums(data.Data.rd);
          if (data.Data.storeConfig) setStoreConfig(data.Data.storeConfig);
          setShowAlbumList(true);
        } else {
          setAlbums([]);
          setError(new Error(data?.Message || "Could not load albums."));
          setShowAlbumList(true);
        }
      } catch (err) {
        console.error("[useExclusiveAlbum] Fetch customer albums on back failed:", err);
        setAlbums([]);
        setError(err);
        setShowAlbumList(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowAlbumList(true);
    }
    setSelectedAlbum(null);
    setSearchQuery("");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [initialRandomNo, resolvedCustomerId, initialDomain, checkUrlParams]);

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

  // 11.1 ProCatalog Action Payload Builder
  const createAlbumActionPayload = useCallback(
    (design = null, album = selectedAlbum) => {
      const { custId } = checkUrlParams();
      const currentAlbum = album || selectedAlbum;
      const activeCustId = resolvedCustomerId || custId || currentAlbum?.CustomerId || "";

      return {
        Customerid: activeCustId || undefined,
        AlbumId: String(currentAlbum?.id || currentAlbum?.AlbumId || ""),
        AlbumCode: String(
          currentAlbum?.albumcode || currentAlbum?.AlbumCode || ""
        ),
        autocode: String(design?.autocode || ""),
        designno: String(design?.designno || ""),
        ArticleMasterCode: String(
          design?.ArticleMasterCode ||
            design?.ArticleNo ||
            design?.articleno ||
            ""
        ),
        StockBarcode: "",
        Source: "procatalog website",
      };
    },
    [selectedAlbum, resolvedCustomerId, checkUrlParams]
  );

  // 11.2 No-op legacy album view tracker (View count is strictly on product detail click)
  const logAlbumView = useCallback(() => {}, []);

  // 11.3 Unique Product Detail View Tracker
  // View count only triggers when user clicks on a product to navigate to its detail page.
  // It does NOT run on album overlay open or inside album overlay preview.
  const logDesignView = useCallback(
    async (design, album = selectedAlbum) => {
      if (!design) return;
      const currentAlbum = album || selectedAlbum;
      const albumId = currentAlbum?.id || currentAlbum?.AlbumId || "";
      const designKey = design?.designno || design?.autocode || "";
      const { custId } = checkUrlParams();
      const activeCustId = resolvedCustomerId || custId || currentAlbum?.CustomerId || "";
      const vId =
        typeof window !== "undefined" ? Cookies.get("visiterId") || "" : "";
      const custKey = activeCustId || vId || "guest";

      const sessionKey = `procatalog_detail_view_${albumId}_${designKey}_${custKey}`;
      if (
        viewedDesignsRef.current.has(sessionKey) ||
        (typeof window !== "undefined" && sessionStorage.getItem(sessionKey))
      ) {
        return;
      }

      viewedDesignsRef.current.add(sessionKey);
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(sessionKey, "1");
        } catch (_) {}
      }

      const payload = createAlbumActionPayload(design, currentAlbum);

      try {
        await ArticleAlbumDesignViewCountAPI(payload, vId);
      } catch (err) {
        console.warn("[useExclusiveAlbum] Log product detail view failed:", err);
      }
    },
    [createAlbumActionPayload, selectedAlbum, resolvedCustomerId, checkUrlParams]
  );

  // 11.4 Like Toggle (Dislike tracker omitted per requirement)
  const handleToggleLike = useCallback(
    async (design, album = selectedAlbum) => {
      if (!design) return;
      const designKey = design.designno || design.autocode;
      const isCurrentlyLiked = Boolean(likedDesigns[designKey]);
      const nextLiked = !isCurrentlyLiked;

      // Optimistic update
      setLikedDesigns((prev) => ({
        ...prev,
        [designKey]: nextLiked,
      }));

      // Fire like API only when liking (dislike omitted per requirement)
      if (nextLiked) {
        const vId =
          typeof window !== "undefined" ? Cookies.get("visiterId") || "" : "";
        const payload = createAlbumActionPayload(design, album);

        try {
          await ArticleAlbumDesignLikeAPI(payload, vId);
          toast.success("Saved to album favorites");
        } catch (err) {
          console.error("[useExclusiveAlbum] handleToggleLike error:", err);
          // Rollback on error
          setLikedDesigns((prev) => ({
            ...prev,
            [designKey]: isCurrentlyLiked,
          }));
        }
      }
    },
    [likedDesigns, selectedAlbum, createAlbumActionPayload]
  );

  // 11.5 Add to Cart (Dispatches Album Tracker + Store Cart API + Count Sync)
  const handleAddToCart = useCallback(
    async (design, album = selectedAlbum) => {
      if (!design) return;
      const designKey = design.designno || design.autocode;

      // Optimistic update
      setCartDesigns((prev) => ({
        ...prev,
        [designKey]: true,
      }));

      const vId =
        typeof window !== "undefined" ? Cookies.get("visiterId") || "" : "";
      const payload = createAlbumActionPayload(design, album);

      try {
        // 1. ProCatalog Album CallLog Tracker
        const trackerPromise = ArticleAlbumDesignCartAPI(payload, vId);

        // 2. Ecommerce Store Cart API
        const loginInfo = getSession("loginUserDetail");
        const prodObj = {
          autocode: design?.autocode,
          Metalid:
            design?.MetalPurityid ||
            design?.MetalTypeId ||
            loginInfo?.MetalId ||
            "",
          MetalColorId: design?.MetalColorid || "",
          DiaQCid:
            design?.DiamondQualityId || loginInfo?.cmboDiaQCid || "",
          CsQCid:
            design?.ColorStoneQualityId || loginInfo?.cmboCSQCid || "",
          Size: design?.DefaultSize || "",
          Unitcost: design?.UnitCost || 0,
          markup: design?.DesignMarkUp || 0,
          UnitCostWithmarkup:
            design?.UnitCostWithMarkUpIncTax ||
            design?.UnitCostWithMarkUp ||
            design?.UnitCost ||
            0,
          Remark: "",
        };

        const storeCartPromise = CartAndWishListAPI("Cart", prodObj, vId);

        const [, storeCartRes] = await Promise.allSettled([
          trackerPromise,
          storeCartPromise,
        ]);

        if (storeCartRes?.status === "fulfilled" && storeCartRes?.value) {
          const cartCount = storeCartRes.value?.Data?.rd?.[0]?.Cartlistcount;
          if (cartCount !== undefined && typeof setCartCountNum === "function") {
            setCartCountNum(cartCount);
          }
        }

        toast.success("Item added to cart");
      } catch (err) {
        console.error("[useExclusiveAlbum] handleAddToCart error:", err);
        setCartDesigns((prev) => ({
          ...prev,
          [designKey]: false,
        }));
      }
    },
    [selectedAlbum, createAlbumActionPayload, setCartCountNum]
  );

  // 11.6 Remove from Cart (Dispatches Album Tracker + Store Remove Cart API + Count Sync)
  const handleRemoveFromCart = useCallback(
    async (design, album = selectedAlbum) => {
      if (!design) return;
      const designKey = design.designno || design.autocode;

      setCartDesigns((prev) => ({
        ...prev,
        [designKey]: false,
      }));

      const vId =
        typeof window !== "undefined" ? Cookies.get("visiterId") || "" : "";
      const payload = createAlbumActionPayload(design, album);

      try {
        // 1. ProCatalog Album Tracker
        const trackerPromise = ArticleAlbumDesignRemoveCartAPI(payload, vId);

        // 2. Store Remove Cart API
        const removePromise = RemoveCartAndWishAPI(
          "Cart",
          design?.autocode,
          vId,
          false,
          "",
          design?.ArticleNo
        );

        const [, removeRes] = await Promise.allSettled([
          trackerPromise,
          removePromise,
        ]);

        if (removeRes?.status === "fulfilled" && removeRes?.value) {
          const cartCount = removeRes.value?.Data?.rd?.[0]?.Cartlistcount;
          if (cartCount !== undefined && typeof setCartCountNum === "function") {
            setCartCountNum(cartCount);
          }
        }

        toast.info("Item removed from cart");
      } catch (err) {
        console.error("[useExclusiveAlbum] handleRemoveFromCart error:", err);
        setCartDesigns((prev) => ({
          ...prev,
          [designKey]: true,
        }));
      }
    },
    [selectedAlbum, createAlbumActionPayload, setCartCountNum]
  );

  // 11.7 Toggle Cart
  const handleToggleCart = useCallback(
    async (design, album = selectedAlbum) => {
      if (!design) return;
      const designKey = design.designno || design.autocode;
      const isInCart = Boolean(cartDesigns[designKey]);
      if (isInCart) {
        return handleRemoveFromCart(design, album);
      } else {
        return handleAddToCart(design, album);
      }
    },
    [cartDesigns, handleAddToCart, handleRemoveFromCart, selectedAlbum]
  );

  const handleMoveToProductDetail = useCallback(
    async (design) => {
      if (!design) return;
      // View count ONLY triggers when user clicks on a product and navigates to the detail page
      try {
        await Promise.race([
          logDesignView(design, selectedAlbum),
          new Promise((resolve) => setTimeout(resolve, 300)),
        ]);
      } catch (err) {
        console.warn("[useExclusiveAlbum] Product detail view log failed:", err);
      }
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
    [getProductImageUrl, storeConfig, router, logDesignView, selectedAlbum]
  );

  return {
    // State
    isOpen,
    setIsOpen,
    loading,
    error,
    albums,
    resolvedCustomerId,
    showAlbumList,
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

    // Like & Cart States
    likedDesigns,
    setLikedDesigns,
    cartDesigns,
    setCartDesigns,

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
    handleToggleLike,
    handleAddToCart,
    handleRemoveFromCart,
    handleToggleCart,
    logAlbumView,
    logDesignView,
    getProductImageUrl,
    formatPrice,
    refetch: fetchAlbums,
  };
}

export default useExclusiveAlbum;
