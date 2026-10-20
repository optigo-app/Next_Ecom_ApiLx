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

const hexToRgba = (hex, opacity) => {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return hex;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  const a = typeof opacity === "number" ? opacity / 100 : 1;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const ALIGN = { top: "flex-start", center: "center", bottom: "flex-end", left: "flex-start", right: "flex-end" };

 
const getPosition = (pos) => {
  if (!pos || typeof pos !== "string") return {};
  const [v, h] = pos.split("-");
  return clean({ alignItems: ALIGN[v], justifyContent: ALIGN[h] });
};

const textStyle = (t = {}) =>
  clean({
    color: t.color,
    fontFamily: t.fontFamily,
    fontSize: px(t.fontSize),
    fontWeight: t.fontWeight,
    fontStyle: t.fontStyle,
    textTransform: t.textTransform,
    letterSpacing: px(t.letterSpacing),
    lineHeight: t.lineHeight,
    textShadow: t.textShadow,
    textAlign: t.textAlign,
  });

 

function Slide({ banner }) {
  const { container = {}, image = {}, data = {} } = banner?.ContentJson || {};
  const { title = {}, description = {}, button = {} } = data;

  const imgSrc = image.imageUrl;
  const mobileSrc = image.mobileImageUrl;

  const filters = [
    image.grayscale ? `grayscale(${image.grayscale}%)` : null,
    image.blur ? `blur(${image.blur}px)` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const hasOverlayGradient = image.overlayGradient && image.overlayGradient !== "none";
  const hasOverlay = hasOverlayGradient || image.overlayOpacity > 0;

  const hasBoxBg = data.backgroundType && data.backgroundType !== "none";

  const hasContent = title.text || description.text || button.text;

  const wrapperSx = {
    position: "relative",
    overflow: "hidden",
    width: container.containerWidth === "full" ? "100%" : undefined,
    maxWidth: container.containerWidth !== "full" ? px(container.maxWidth) : undefined,
    margin: container.containerWidth !== "full" ? "0 auto" : undefined,
    height: container.heightDesktop,
    backgroundColor: container.fallbackBg,
    borderRadius: px(container.borderRadius),
    [MOBILE_QUERY]: clean({
      height: container.heightMobile,
      display: container.hideOnMobile ? "none" : undefined,
    }),
    [DESKTOP_QUERY]: clean({
      display: container.hideOnDesktop ? "none" : undefined,
    }),
  };

  const inner = (
    <Box sx={clean(wrapperSx)}>
      {imgSrc && (
        <picture>
          {mobileSrc && <source media="(max-width:768px)" srcSet={mobileSrc} />}
          <img
            src={imgSrc}
            alt={image.altText || ""}
            style={clean({
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: image.objectFit,
              objectPosition: image.imagePosition,
              filter: filters || undefined,
            })}
          />
        </picture>
      )}

      {hasOverlay && (
        <Box
          sx={clean({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: hasOverlayGradient ? image.overlayGradient : undefined,
            backgroundColor: !hasOverlayGradient
              ? hexToRgba(image.overlayColor, image.overlayOpacity)
              : undefined,
          })}
        />
      )}

      {hasContent && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            pointerEvents: "none",
            ...getPosition(data.position),
            [MOBILE_QUERY]: getPosition(data.positionMobile),
          }}
        >
          <Box
            sx={{
              pointerEvents: "auto",
              boxSizing: "border-box",
              width: pct(data.width),
              ...(hasBoxBg && {
                backgroundColor: hexToRgba(data.backgroundColor, data.backgroundOpacity),
              }),
              [MOBILE_QUERY]: clean({ width: pct(data.widthMobile) }),
            }}
          >
            {title.text && (
              <Box component="h2" sx={{ margin: 0, ...textStyle(title) }}>
                {title.text}
              </Box>
            )}

            {description.text && (
              <Box component="p" sx={{ margin: 0, ...textStyle(description) }}>
                {description.text}
              </Box>
            )}

            {button.text && (
              <Box
                component="a"
                href={button.link || undefined}
                sx={clean({
                  display: "inline-block",
                  textDecoration: "none",
                  color: button.color,
                  backgroundColor: button.bgColor,
                  borderColor: button.borderColor,
                  borderWidth: px(button.borderWidth),
                  borderStyle: button.borderWidth ? "solid" : undefined,
                  "&:hover": clean({
                    color: button.hoverColor,
                    backgroundColor: button.hoverBgColor,
                  }),
                })}
              >
                {button.text}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  
  return container.clickLink ? (
    <a href={container.clickLink} style={{ display: "block" }}>
      {inner}
    </a>
  ) : (
    inner
  );
}

 

export default function HomepageSlider({ banners = [] }) {
  if (!banners.length) return null;

  const multiple = banners.length > 1;

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={multiple}
        autoplay={multiple ? { delay: 4000, disableOnInteraction: false } : false}
        // pagination={multiple ? { clickable: true } : false}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.Id}>
            <Slide banner={banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}