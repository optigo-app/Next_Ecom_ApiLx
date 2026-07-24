"use client";
import "./FeatureProduct.css";

import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import Cookies from "js-cookie";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { formatter, formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import FeaturedSkeleton from "./FeaturedSkeleton"

const imageNotFound = "/image-not-found.jpg";


function HeartIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}


function ArrowIcon({ direction }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}


function ProductImageSlider({ images, productName }) {
  const [isHovered, setIsHovered] = useState(false);
  const innerPrevRef = useRef(null);
  const innerNextRef = useRef(null);
  const innerSwiperRef = useRef(null);

  const paginationRef = useRef(null);

  return (
    <div
      className="product-image-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        loop={images.length > 1}
        speed={1200}
        navigation={{
          prevEl: innerPrevRef.current,
          nextEl: innerNextRef.current,
        }}
        pagination={{
          el: paginationRef.current,
          clickable: true,
          bulletClass: "img-dot",
          bulletActiveClass: "active",
          renderBullet: (index, className) =>
            `<button class="${className}" aria-label="Go to image ${index + 1}"></button>`,
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = innerPrevRef.current;
            swiper.params.navigation.nextEl = innerNextRef.current;

            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i} style={{ width: "100%", height: "100%" }}>
            <img
              src={src}
              alt={`${productName} view ${i + 1}`}
              loading="lazy"
              onError={(e) => (e.target.src = imageNotFound)}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button
            ref={innerPrevRef}
            className={`img-nav img-nav--prev ${isHovered ? "visible" : ""}`}
            aria-label="Previous image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            ref={innerNextRef}
            className={`img-nav img-nav--next ${isHovered ? "visible" : ""}`}
            aria-label="Next image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ArrowIcon direction="right" />
          </button>
          {/* the dots are raw DOM buttons created by Swiper's renderBullet,
              so we can't attach onClick to each one — stopping propagation
              on the wrapping div catches the bubbled click before it reaches
              the parent <a> */}
          <div
            ref={paginationRef}
            className="img-dots"
            onClick={(e) => e.stopPropagation()}
          />
        </>
      )}
    </div>
  );
}

// ─── Size Modal ──────────────────────────────────────────────────────────────
function SizeModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-product-info">
          <img src={product.images[0]} alt={product.name} />
          <div>
            <p className="modal-product-name">{product.name}</p>
            <p className="modal-product-desc">{product.description}</p>
            <p className="modal-product-price">{product.price}</p>
          </div>
        </div>
        <p className="modal-size-label">SELECT YOUR SIZE</p>
        <div className="modal-sizes">
          {product.sizes?.map((size) => (
            <button
              key={size}
              className={`size-btn ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <a href="/size-chart" className="size-chart-link">Size Chart →</a>
        <button
          className={`modal-shop-btn ${selectedSize ? "enabled" : ""}`}
          disabled={!selectedSize}
        >
          {selectedSize ? `Shop — Size ${selectedSize}` : "Select a size to continue"}
        </button>
      </div>
    </div>
  );
}

// ─── Contact Modal ───────────────────────────────────────────────────────────
function ContactModal({ product, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-product-info">
          <img src={product.images[0]} alt={product.name} />
          <div>
            <p className="modal-product-name">{product.name}</p>
            <p className="modal-product-desc">{product.description}</p>
            <p className="modal-product-price">{product.price}</p>
          </div>
        </div>
        {!submitted ? (
          <>
            <p className="modal-size-label" style={{ marginTop: "1.5rem" }}>CONTACT US</p>
            <p style={{ fontSize: "0.78rem", color: "#888", marginBottom: "1.2rem" }}>
              Our specialists will be in touch to assist you with this piece.
            </p>
            <input className="contact-input" type="text" placeholder="Your Name" />
            <input className="contact-input" type="email" placeholder="Your Email" />
            <input className="contact-input" type="tel" placeholder="Phone (optional)" />
            <button className="modal-shop-btn enabled" onClick={() => setSubmitted(true)}>
              Send Enquiry
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Thank you</p>
            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              A specialist will contact you shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product, onNavigate }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [modal, setModal] = useState(null);

  const handleCTA = (e) => {
    e.preventDefault();
    if (product.ctaType === "contact") {
      setModal("contact");
    } else if (product.hasSizes) {
      setModal("size");
    }
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    onNavigate(product);
  };

  return (
    <>
      <div
        className={`product-card ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* <div className="card-top">
          {product.isNew && <span className="badge-new">New</span>}
          <button
            className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}
            onClick={() => setWishlisted((w) => !w)}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <HeartIcon filled={wishlisted} />
          </button>
        </div> */}

        <a href={product.href} className="card-image-link" onClick={handleCardClick}>
          <ProductImageSlider images={product.images} productName={product.name + product.id} />
        </a>

        <div className="card-body">
          <a href={product.href} className="card-title-link" onClick={handleCardClick}>
            <h3 className="card-name">{product.name}</h3>
            <p className={`card-desc ${isHovered ? "" : ""}`}>{product.description}</p>
          </a>
          <p className={`card-price ${isHovered ? "hidden" : ""}`}>{product.price}</p>
        </div>

        <div className={`card-hover-footer ${isHovered ? "visible" : ""}`}>
          <p className="card-price-hover">{product.price}</p>
          <button className="cta-btn cta-primary" onClick={handleCTA}>
            Add TO Cart
          </button>
        </div>
      </div>

      {modal === "contact" && (
        <ContactModal product={product} onClose={() => setModal(null)} />
      )}
      {modal === "size" && product.hasSizes && (
        <SizeModal product={product} onClose={() => setModal(null)} />
      )}
    </>
  );
}

// ─── Main Carousel (Swiper) ──────────────────────────────────────────────────
export default function ChopardCarousel() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const mainSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [rawProducts, setRawProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const isFetchingRef = useRef(false);

  const { storeInit, islogin, loginUserDetail } = useStore();
  const { push } = useNextRouterLikeRR();

  // ── Fetch ALL products, no filter criteria ──────────────────────────────
  const fetchAllProducts = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const visiterId = Cookies.get("visiterId") ?? "0";
      // mainData="" -> no menu/category filters applied, so this returns the full product list
      const { pdList } = await ProductListApi({}, 1, {}, "", visiterId, "");
      setRawProducts(Array.isArray(pdList) ? pdList : []);
    } catch (err) {
      console.error("[ChopardCarousel] Error fetching products:", err);
      setRawProducts([]);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // ── Map raw API rows -> the shape the existing UI expects ───────────────
  useEffect(() => {
    if (!rawProducts?.length) {
      setProducts([]);
      return;
    }

    const imageUrl = storeInit?.CDNDesignImageFol || storeInit?.CDNDesignImageFolThumb || "";
    const currencyCode = islogin ? loginUserDetail?.CurrencyCode : storeInit?.CurrencyCode;

    const mapped = rawProducts.map((item) => {
      const count = item?.ImageCount > 0 ? item.ImageCount : 0;
      const ext = item?.ImageExtension || "webp";
      const images =
        count > 0
          ? Array.from({ length: count }, (_, i) => `${imageUrl}${item?.designno}~${i + 1}.${ext}`)
          : [imageNotFound];

      return {
        id: item?.id ?? item?.DesignId,
        raw: item,
        name: item?.TitleLine || item?.designno,
        description: [item?.collection, item?.style].filter(Boolean).join(" · "),
        price: `${currencyCode ?? ""} ${formatter(item?.UnitCostWithMarkUp)}`,
        priceRaw: item?.UnitCostWithMarkUp,
        isNew: item?.IsNewArrival === 1,
        category: (item?.category || "uncategorized").toLowerCase(),
        categoryLabel: item?.category || "Uncategorized",
        material: item?.MetalTypePurity || "",
        href: `/d/${formatRedirectTitleLine(item?.TitleLine)}${item?.designno}`,
        images,
        ctaType: "shop",
      };
    });

    setProducts(mapped);
  }, [rawProducts, storeInit, islogin, loginUserDetail]);

  // ── Category tabs derived from actual API data ───────────────────────────
  const categories = [...new Set(products.map((item) => item.category))];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const updateNavState = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveIndex(swiper.snapIndex ?? swiper.realIndex ?? 0);
    setTotalPages(swiper.snapGrid?.length ?? 1);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // ── PDP navigation (same compress/encode pattern as your other components) ─
  const handleNavigateToProduct = (product) => {
    const item = product.raw;
    const obj = {
      a: item?.autocode,
      b: item?.designno,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
      l: item?.ImageExtension,
      count: item?.ImageCount,
    };
    const encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`${product.href}?p=${encodeURIComponent(encodeObj)}`);
  };

  if (!products?.length) return null;

  const handleTabClick = (category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      mainSwiperRef.current?.slideTo(0);
    }, 0);
  };

  if (!filteredProducts?.length) return <FeaturedSkeleton />;

  return (
    <>
      <section className="chopard-carousel-section" id="featuredProducts">
        <div className="carousel-inner">
          <div>
            <p style={{ fontSize: "42px", fontWeight: 400, color: "#2C2C2C", marginBottom: "10px", textAlign: "center" }}>
              Featured Products
            </p>
            <p style={{ fontSize: "20px", fontWeight: 400, color: "gray", marginBottom: "40px", textAlign: "center" }}>
              A showcase of our most exceptional jewelry and signature designs.
            </p>
          </div>



          <div className="category-tabs">
            <button
              key="all"
              className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => handleTabClick("all")}
              style={{ fontWeight: 700 }}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? "active" : ""}`}
                onClick={() => handleTabClick(category)}
                style={{ fontWeight: 700 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setTimeout(() => {
                    mainSwiperRef.current?.slideTo(0);
                  }, 0);
                }}
                style={{ fontWeight: 700 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div> */}

          <Swiper
            className="chopard-main-swiper"
            modules={[Navigation, A11y]}
            slidesPerView={4}
            slidesPerGroup={4}
            speed={500}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
              updateNavState(swiper);
            }}
            onSlideChange={(swiper) => updateNavState(swiper)}
            breakpoints={{
              0: { slidesPerView: 1, slidesPerGroup: 1 },
              640: { slidesPerView: 2, slidesPerGroup: 2 },
              900: { slidesPerView: 3, slidesPerGroup: 3 },
              1200: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} onNavigate={handleNavigateToProduct} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* External prev/next buttons — same look as original */}
          <button
            ref={prevRef}
            className="carousel-nav carousel-nav--prev"
            disabled={isBeginning}
            aria-label="Previous products"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            ref={nextRef}
            className="carousel-nav carousel-nav--next"
            disabled={isEnd}
            aria-label="Next products"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        {/* Custom pagination dots — same look as original */}
        <div className="carousel-pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`page-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => mainSwiperRef.current?.slideTo(i * (mainSwiperRef.current?.params?.slidesPerGroup ?? 4))}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}