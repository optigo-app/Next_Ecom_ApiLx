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
import { useBroadcaster } from "@/app/(core)/contexts/BoardCastContext";
import { getCartWishKey, isItemInMap } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import {
  trackAlbumAction,
  setAlbumContext,
  clearAlbumContext,
} from "@/app/(core)/utils/API/Album/albumTracker";

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
  const setWishCountNum = storeCtx?.setWishCountNum;
  const loginUserDetail = storeCtx?.loginUserDetail;
  const storeCartArr = storeCtx?.cartArr;
  const storeWishArr = storeCtx?.wishArr;
  const setStoreCartArr = storeCtx?.setCartArr;
  const setStoreWishArr = storeCtx?.setWishArr;
  const storeFetchGetCountData = storeCtx?.fetchGetCountData;
  const storeRd1 = storeCtx?.cartAndWishListRd1;
  let broadcast = null;
  try {
    broadcast = useBroadcaster()?.broadcast;
  } catch (_) {}

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
  const [likedOverrides, setLikedOverrides] = useState({});
  const [cartOverrides, setCartOverrides] = useState({});
  const inFlightRef = useRef(new Set());
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
        const firstAlbum = fetchedAlbums[0];
        const albumCustomerId =
          firstAlbum?.CustomerId ?? firstAlbum?.Customerid ?? firstAlbum?.customerId ??
          firstAlbum?.customerid ?? data?.Data?.customerId ?? data?.Data?.CustomerId ?? custId;
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

  // 4.1 Persist album context so listing/detail pages can track against this album (isalbumlogin == 1)
  useEffect(() => {
    if (selectedAlbum) setAlbumContext(selectedAlbum, resolvedCustomerId);
  }, [selectedAlbum, resolvedCustomerId]);

  // 4.2 Landing on the homepage outside an album invalidates the album context (no view/like/cart tracking)
  useEffect(() => {
    if (!isOpen && pathname === "/") clearAlbumContext();
  }, [isOpen, pathname]);

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
    clearAlbumContext();
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

  // 11.1 Shared store cart/wishlist payload builder
  const buildStoreProdObj = useCallback(
    (design) => {
      const loginInfo = getSession("loginUserDetail") || loginUserDetail;
      return {
        autocode: design?.autocode,
        StockBarcode: design?.StockBarcode || "",
        Metalid:
          design?.MetalPurityid || design?.MetalTypeId || loginInfo?.MetalId || "",
        MetalColorId: design?.MetalColorid || "",
        DiaQCid: design?.DiamondQualityId || loginInfo?.cmboDiaQCid || "",
        CsQCid: design?.ColorStoneQualityId || loginInfo?.cmboCSQCid || "",
        Size: design?.DefaultSize || "",
        Unitcost: design?.UnitCost || 0,
        markup: design?.DesignMarkUp || 0,
        UnitCostWithmarkup:
          design?.UnitCostWithMarkUpIncTax ||
          design?.UnitCostWithMarkUp ||
          design?.UnitCost ||
          0,
        Remark: "",
        ArticleNo: design?.ArticleNo || "",
      };
    },
    [loginUserDetail]
  );

  const getVisiterId = () =>
    typeof window !== "undefined" ? Cookies.get("visiterId") || "" : "";

  // Album CallLog tracker; no-op unless the visitor logged in via album (isalbumlogin == 1)
  const track = useCallback(
    (kind, design, album = selectedAlbum) =>
      trackAlbumAction(kind, design, {
        album,
        loginInfo: loginUserDetail,
        customerId: resolvedCustomerId,
      }),
    [selectedAlbum, loginUserDetail, resolvedCustomerId]
  );

  // 11.2 No-op legacy album view tracker (View count is strictly on product detail click)
  const logAlbumView = useCallback(() => {}, []);

  // 11.3 Product detail view tracker (deduped per album/design/article)
  const logDesignView = useCallback(
    async (design, album = selectedAlbum) => {
      if (design) await track("view", design, album);
    },
    [track, selectedAlbum]
  );

  // 11.4 Wishlist/cart state: store maps (hydrated from GetCount) + in-flight optimistic overrides
  const albumDesigns = selectedAlbum?.designs;
  // The album shows the default article of a design, but the user may hold that article (or another article
  // of the same design) in cart/wishlist. Match by design (autocode) from the GetCount rows so the buttons
  // always reflect reality and never create a duplicate line.
  const normCode = (v) => {
    const t = String(v ?? "").trim();
    return t !== "" && !isNaN(t) ? String(Number(t)) : t;
  };
  const getStoreEntries = useCallback(
    (type, design) => {
      const want = type === "Cart" ? 0 : 1;
      const code = normCode(design?.autocode);
      if (!code || !Array.isArray(storeRd1)) return [];
      return storeRd1.filter((r) => Number(r?.IsWishList) === want && normCode(r?.autocode) === code);
    },
    [storeRd1]
  );

  const likedDesigns = useMemo(() => {
    const out = {};
    (albumDesigns || []).forEach((d) => {
      out[d.designno || d.autocode] =
        getStoreEntries("Wish", d).length > 0 || isItemInMap(storeWishArr, d, false);
    });
    return { ...out, ...likedOverrides };
  }, [albumDesigns, storeWishArr, likedOverrides, getStoreEntries]);
  const cartDesigns = useMemo(() => {
    const out = {};
    (albumDesigns || []).forEach((d) => {
      out[d.designno || d.autocode] =
        getStoreEntries("Cart", d).length > 0 || isItemInMap(storeCartArr, d, false);
    });
    return { ...out, ...cartOverrides };
  }, [albumDesigns, storeCartArr, cartOverrides, getStoreEntries]);

  // Same flow as the listing page: store API -> counts -> store maps -> broadcast -> refetch -> album tracker.
  // Wishlist add/remove maps to Like/Dislike, cart add/remove maps to Cart/RemoveCart.
  const toggleStoreItem = useCallback(
    async (type, design, add, album = selectedAlbum) => {
      if (!design) return;
      const isCart = type === "Cart";
      const designKey = design.designno || design.autocode;
      const setOverrides = isCart ? setCartOverrides : setLikedOverrides;
      const clearOverride = () =>
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[designKey];
          return next;
        });

      const flightKey = type + designKey;
      if (inFlightRef.current.has(flightKey)) return;
      const existing = getStoreEntries(type, design);
      const alreadyIn = existing.length > 0 || isItemInMap(isCart ? storeCartArr : storeWishArr, design, false);
      if (add && alreadyIn) return;
      inFlightRef.current.add(flightKey);

      setOverrides((prev) => ({ ...prev, [designKey]: add }));

      try {
        const vId = getVisiterId();
        let res;
        if (add) {
          res = await CartAndWishListAPI(type, buildStoreProdObj(design), vId);
        } else {
          // Remove every article of this design the user holds (default article first)
          const articles = [...new Set([design?.ArticleNo, ...existing.map((r) => r?.ArticleNo)].filter(Boolean))];
          for (const articleNo of articles.length ? articles : [""]) {
            res = await RemoveCartAndWishAPI(type, design?.autocode || "", vId, false, "", articleNo);
            if (!res) break;
          }
        }
        if (!res) throw new Error(`${type} ${add ? "add" : "remove"} failed`);

        const row = res?.Data?.rd?.[0];
        const cartC = row?.Cartlistcount ?? row?.Cartcount ?? row?.cartcount;
        const wishC = row?.Wishlistcount ?? row?.Wishcount ?? row?.wishcount;
        if (cartC !== undefined) setCartCountNum?.(cartC);
        if (wishC !== undefined) setWishCountNum?.(wishC);

        const key = getCartWishKey(design);
        if (key) (isCart ? setStoreCartArr : setStoreWishArr)?.((prev) => ({ ...prev, [key]: add }));

        broadcast?.(
          isCart ? "UPDATE_CART_COUNT" : "UPDATE_WISH_COUNT",
          isCart ? cartC : wishC,
          design?.autocode,
          isCart ? "cart" : "wish",
          add,
          design?.ArticleNo
        );
        await storeFetchGetCountData?.();
        clearOverride();
        track(isCart ? (add ? "cart" : "removeCart") : add ? "like" : "dislike", design, album);

        if (add) toast.success(isCart ? "Item added to cart" : "Saved to wishlist");
        else toast.info(isCart ? "Item removed from cart" : "Removed from wishlist");
      } catch (err) {
        console.error(`[useExclusiveAlbum] ${type} toggle error:`, err);
        clearOverride();
      } finally {
        inFlightRef.current.delete(flightKey);
      }
    },
    [
      selectedAlbum,
      getStoreEntries,
      storeCartArr,
      storeWishArr,
      buildStoreProdObj,
      track,
      broadcast,
      setCartCountNum,
      setWishCountNum,
      setStoreCartArr,
      setStoreWishArr,
      storeFetchGetCountData,
    ]
  );

  const handleToggleLike = useCallback(
    (design, album = selectedAlbum) =>
      toggleStoreItem("Wish", design, !likedDesigns[design?.designno || design?.autocode], album),
    [toggleStoreItem, likedDesigns, selectedAlbum]
  );
  const handleAddToCart = useCallback(
    (design, album = selectedAlbum) => toggleStoreItem("Cart", design, true, album),
    [toggleStoreItem, selectedAlbum]
  );
  const handleRemoveFromCart = useCallback(
    (design, album = selectedAlbum) => toggleStoreItem("Cart", design, false, album),
    [toggleStoreItem, selectedAlbum]
  );
  const handleToggleCart = useCallback(
    (design, album = selectedAlbum) =>
      toggleStoreItem("Cart", design, !cartDesigns[design?.designno || design?.autocode], album),
    [toggleStoreItem, cartDesigns, selectedAlbum]
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
    setLikedDesigns: setLikedOverrides,
    cartDesigns,
    setCartDesigns: setCartOverrides,

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
