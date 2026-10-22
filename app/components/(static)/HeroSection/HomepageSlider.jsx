"use client";

import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const MOBILE_QUERY = "@media (max-width:768px)";
const DESKTOP_QUERY = "@media (min-width:769px)";

const clean = (obj = {}) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

const px = (v) => (typeof v === "number" ? `${v}px` : v);
const pct = (v) => (typeof v === "number" ? `${v}%` : v);

/* ---------- position maps (from the working TopSlider) ---------- */
const POSITION_MAP = {
  "top-left": { justifyContent: "flex-start", alignItems: "flex-start" },
  "top-center": { justifyContent: "center", alignItems: "flex-start" },
  "top-right": { justifyContent: "flex-end", alignItems: "flex-start" },
  "middle-left": { justifyContent: "flex-start", alignItems: "center" },
  "middle-center": { justifyContent: "center", alignItems: "center" },
  "middle-right": { justifyContent: "flex-end", alignItems: "center" },
  "bottom-left": { justifyContent: "flex-start", alignItems: "flex-end" },
  "bottom-center": { justifyContent: "center", alignItems: "flex-end" },
  "bottom-right": { justifyContent: "flex-end", alignItems: "flex-end" },
};

const TEXT_ALIGN_MAP = {
  "top-left": "left", "middle-left": "left", "bottom-left": "left",
  "top-center": "center", "middle-center": "center", "bottom-center": "center",
  "top-right": "right", "middle-right": "right", "bottom-right": "right",
};

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

const ANIM_KEYFRAMES = `
@keyframes bannerFadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes bannerSlideUp { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: translateY(0);} }
@keyframes bannerZoomIn { from { opacity: 0; transform: scale(1.06);} to { opacity: 1; transform: scale(1);} }
.banner-anim-fadeIn { animation: bannerFadeIn .6s ease both; }
.banner-anim-slideUp { animation: bannerSlideUp .6s ease both; }
.banner-anim-zoomIn { animation: bannerZoomIn .8s ease both; }
`;

const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== "string") return `rgba(0,0,0,${alpha})`;
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/* position -> flex alignment (desktop default bottom-left, mobile falls back to desktop) */
const getPos = (pos) => POSITION_MAP[pos] || POSITION_MAP["middle-center"];
const getTextAlign = (pos) => TEXT_ALIGN_MAP[pos] || "left";
const textAlignToItems = (ta) =>
  ta === "center" ? "center" : ta === "right" ? "flex-end" : "flex-start";

function getDataBackgroundStyle(dataCfg) {
  const { backgroundType = "none", backgroundColor = "#000000", backgroundOpacity = 40 } = dataCfg || {};
  const alpha = (backgroundOpacity ?? 40) / 100;

  switch (backgroundType) {
    case "solid":
      return { background: hexToRgba(backgroundColor, alpha) };
    case "glass":
      return {
        background: hexToRgba(backgroundColor, Math.min(alpha, 0.35)),
        backdropFilter: "blur(14px) saturate(150%)",
        WebkitBackdropFilter: "blur(14px) saturate(150%)",
        border: "1px solid rgba(255,255,255,0.25)",
        transform: "translateZ(0)",
        isolation: "isolate",
      };
    case "gradient":
      return { background: `linear-gradient(135deg, ${hexToRgba(backgroundColor, alpha)}, transparent)` };
    default:
      return { background: "transparent" };
  }
}

function overlayBackground(imageCfg) {
  const { overlayColor = "#000000", overlayOpacity = 0, overlayGradient = "none" } = imageCfg || {};
  const alpha = (overlayOpacity ?? 0) / 100;
  const solid = hexToRgba(overlayColor, alpha);
  const transparent = hexToRgba(overlayColor, 0);
  switch (overlayGradient) {
    case "left-dark": return `linear-gradient(to right, ${solid}, ${transparent})`;
    case "right-dark": return `linear-gradient(to right, ${transparent}, ${solid})`;
    case "bottom-dark": return `linear-gradient(to top, ${solid}, ${transparent})`;
    case "radial-dark": return `radial-gradient(circle, ${transparent}, ${solid})`;
    default: return solid;
  }
}

function isVideoSrc(src, mediaType) {
  if (mediaType === "video") return true;
  if (mediaType === "image") return false;
  if (!src) return false;
  const c = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => c.endsWith(ext));
}

const shadowFor = (v, soft, hard) => (v === "soft" ? soft : v === "hard" ? hard : "none");

/* ContentJson may be an object, a JSON string, or null */
function parseBanner(banner) {
  let json = {};
  if (banner?.ContentJson) {
    try {
      json = typeof banner.ContentJson === "string" ? JSON.parse(banner.ContentJson) : banner.ContentJson || {};
    } catch (e) {
      console.error("Failed to parse ContentJson", e);
    }
  }
  return {
    id: banner?.Id,
    container: json.container || {},
    image: {
      imageUrl: json.image?.imageUrl || banner?.ImageUrl || "",
      mobileImageUrl: json.image?.mobileImageUrl || banner?.MobileImageUrl || "",
      ...json.image,
    },
    data: json.data || {},
    mediaType: json.mediaType || banner?.MediaType || "image",
  };
}

function Slide({ slide }) {
  const { container, image, data } = slide;
  const { title = {}, description = {}, button = {} } = data;

  const imgSrc = image.imageUrl;
  const mobileSrc = image.mobileImageUrl;
  const isVideo = isVideoSrc(imgSrc, slide.mediaType || image.mediaType);

  /* desktop / mobile position, width & text alignment */
  const posDesktopKey = data.position || "bottom-left";
  const posMobileKey = data.positionMobile || data.position || "bottom-center";
  const posDesktop = getPos(posDesktopKey);
  const posMobile = getPos(posMobileKey);
  const taDesktop = getTextAlign(posDesktopKey);
  const taMobile = getTextAlign(posMobileKey);
  const widthDesktop = data.width ?? 50;
  const widthMobile = data.widthMobile ?? data.width ?? 80;

  const hasBoxBg = data.backgroundType && data.backgroundType !== "none";
  const hasContent = title.text || description.text || button.text;

  const mediaFilter = `blur(${image.blur || 0}px) grayscale(${image.grayscale || 0}%)`;
  const mediaStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: image.objectFit || "cover",
    objectPosition: image.imagePosition || "center",
    filter: mediaFilter,
    zIndex: 1,
  };

  const wrapperSx = {
    position: "relative",
    overflow: "hidden",
    width: container.containerWidth === "custom" ? px(container.maxWidth || 1440) : "100%",
    maxWidth: container.containerWidth === "boxed" ? px(container.maxWidth || 1440) : "none",
    margin: container.containerWidth === "boxed" ? "0 auto" : undefined,
    height: px(container.heightDesktop || "420px"),
    backgroundColor: container.fallbackBg || "#333",
    borderRadius: px(container.borderRadius || 0),
    [MOBILE_QUERY]: clean({
      height: px(container.heightMobile || "280px"),
      display: container.hideOnMobile ? "none" : undefined,
    }),
    [DESKTOP_QUERY]: clean({
      display: container.hideOnDesktop ? "none" : undefined,
    }),
  };

  return (
    <Box
      className={`slide banner-anim-${container.animation || "none"}`}
      sx={clean(wrapperSx)}
    >
      {container.clickLink && (
        <a
          href={container.clickLink}
          aria-label="Banner link"
          style={{ position: "absolute", inset: 0, zIndex: 3 }}
        />
      )}

      {imgSrc &&
        (isVideo ? (
          <video src={imgSrc} autoPlay muted loop playsInline style={mediaStyle} />
        ) : (
          <picture>
            {mobileSrc && <source media="(max-width:768px)" srcSet={mobileSrc} />}
            <img src={imgSrc} alt={image.altText || ""} draggable={false} style={mediaStyle} />
          </picture>
        ))}

      {/* overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: overlayBackground(image),
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* content layer — 9-point positioned */}
      {hasContent && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            padding: "5%",
            boxSizing: "border-box",
            zIndex: 3,
            pointerEvents: "none",
            ...posDesktop,
            [MOBILE_QUERY]: { ...posMobile },
          }}
        >
          <Box
            sx={{
              pointerEvents: "auto",
              boxSizing: "border-box",
              width: pct(widthDesktop),
              padding: hasBoxBg ? "20px 24px" : 0,
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: textAlignToItems(taDesktop),
              ...getDataBackgroundStyle(data),
              [MOBILE_QUERY]: {
                width: pct(widthMobile),
                alignItems: textAlignToItems(taMobile),
              },
            }}
          >
            {title.text && (
              <Box
                component="h2"
                sx={clean({
                  margin: 0,
                  width: "100%",
                  color: title.color || "#fff",
                  fontFamily: title.fontFamily || "inherit",
                  fontSize: px(title.fontSize || 36),
                  fontWeight: title.fontWeight || 600,
                  fontStyle: title.fontStyle || "normal",
                  textTransform: title.textTransform || "none",
                  letterSpacing: px(title.letterSpacing),
                  lineHeight: title.lineHeight || 1.25,
                  textShadow: shadowFor(title.textShadow, "0 2px 8px rgba(0,0,0,.35)", "0 2px 0 rgba(0,0,0,.6)"),
                  textAlign: title.textAlign || taDesktop,
                  [MOBILE_QUERY]: title.textAlign ? undefined : { textAlign: taMobile },
                })}
              >
                {title.text}
              </Box>
            )}

            {description.text && (
              <Box
                component="p"
                sx={clean({
                  margin: 0,
                  width: "100%",
                  color: description.color || "#eee",
                  fontFamily: description.fontFamily || "inherit",
                  fontSize: px(description.fontSize || 15),
                  fontWeight: description.fontWeight || 400,
                  fontStyle: description.fontStyle || "normal",
                  textTransform: description.textTransform || "none",
                  letterSpacing: px(description.letterSpacing || 0),
                  lineHeight: description.lineHeight || 1.5,
                  textShadow: shadowFor(description.textShadow, "0 1px 6px rgba(0,0,0,.3)", "0 1px 0 rgba(0,0,0,.5)"),
                  textAlign: description.textAlign || taDesktop,
                  [MOBILE_QUERY]: description.textAlign ? undefined : { textAlign: taMobile },
                })}
              >
                {description.text}
              </Box>
            )}

            {button.text && (
              <Box
                component="a"
                href={button.link || "#"}
                sx={{
                  position: "relative",
                  zIndex: 4,
                  display: "inline-block",
                  marginTop: "6px",
                  padding: "10px 22px",
                  color: button.color || "#000",
                  background: button.bgColor || "#fff",
                  border: `${button.borderWidth || 0}px solid ${button.borderColor || "transparent"}`,
                  borderRadius: "6px",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all .2s ease",
                  "&:hover": {
                    color: button.hoverColor || button.color || "#000",
                    background: button.hoverBgColor || button.bgColor || "#fff",
                  },
                }}
              >
                {button.text}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function HomepageSlider({ banners = [] }) {
  const slides = banners
    .filter((b) => b && b.IsActive !== false)
    .sort((a, b) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0))
    .map(parseBanner)
    .filter((s) => s.image.imageUrl); // drop slides with no image

  if (!slides.length) return null;

  const multiple = slides.length > 1;

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <style>{ANIM_KEYFRAMES}</style>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={multiple}
        autoplay={multiple ? { delay: 4000, disableOnInteraction: false } : false}
        // pagination={multiple ? { clickable: true } : false}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id ?? i}>
            <Slide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}