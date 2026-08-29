"use client";

import Pako from "pako";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

/**
 * Compress & Base64 encode JSON parameter payload (for product detail URLs)
 */
export const compressAndEncode = (inputString) => {
  try {
    const uint8Array = new TextEncoder().encode(inputString);
    const compressed = Pako.deflate(uint8Array);
    if (typeof compressed === "string") {
      return btoa(compressed);
    }
    let binary = "";
    const len = compressed.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressed[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("Error compressing and encoding:", error);
    return null;
  }
};

/**
 * Get dynamic CDN Image URL for a product card considering color variants
 */
export const getCardImageUrl = (productData, storeinit) => {
  const cdnFol = storeinit?.CDNDesignImageFol || storeinit?.CDNDesignImageFolThumb || "";
  if (!cdnFol || !productData?.designno) return "";
  const ext = productData?.ImageExtension || "webp";

  if (productData?.ImageVideoDetail && productData.ImageVideoDetail !== "0") {
    try {
      const parsed = typeof productData.ImageVideoDetail === "string"
        ? JSON.parse(productData.ImageVideoDetail)
        : productData.ImageVideoDetail;

      if (Array.isArray(parsed) && parsed.length > 0) {
        const mtColorLocal = getSession("MetalColorCombo") || [];
        const targetColorObj = mtColorLocal.find(
          (ele) => Number(ele.id) === Number(productData?.MetalColorid)
        );
        const targetColorCode = targetColorObj?.colorcode || productData?.MetalColor;

        if (targetColorCode) {
          const targetLower = targetColorCode.toLowerCase().trim();
          const matchedColorImg = parsed.find((item) => {
            if (Number(item?.TI) !== 2 || !item?.CN) return false;
            const cnLower = item.CN.toLowerCase().trim();
            return (
              cnLower === targetLower ||
              cnLower.includes(targetLower) ||
              targetLower.includes(cnLower)
            );
          });
          if (matchedColorImg) {
            return `${cdnFol}${productData.designno}~${matchedColorImg.Nm}~${matchedColorImg.CN}.${matchedColorImg.Ex || ext}`;
          }
        }

        const normalImg = parsed.find((item) => Number(item?.TI) === 1);
        if (normalImg) {
          return `${cdnFol}${productData.designno}~${normalImg.Nm}.${normalImg.Ex || ext}`;
        }
      }
    } catch (e) {}
  }
  return `${cdnFol}${productData.designno}~1.${ext}`;
};

/**
 * Convert product object into URL parameter string (`p=...`)
 */
export const convertUrl = ({
  productData,
  storeinit,
  selectedMetalId,
  selectedDiaId,
  selectedCsId,
  detailsMenu,
}) => {
  let obj = {
    a: productData?.autocode,
    b: productData?.designno,
    m: selectedMetalId,
    d: selectedDiaId,
    c: selectedCsId,
    g: detailsMenu,
    img: getCardImageUrl(productData, storeinit),
    ArticleNo: productData?.ArticleNo,
    ArticleId: productData?.ArticleId ?? null,
    title: productData?.TitleLine ?? "",
    nwt: productData?.Nwt ?? 0,
    price: productData?.UnitCostWithMarkUp ?? 0,
    mediaDet: productData?.ImageVideoDetail ?? "",
  };

  return compressAndEncode(JSON.stringify(obj));
};

/**
 * Navigate to Product Detail Page (PDP) with encoded product object
 */
export const handleMoveToDetail = ({
  productData,
  imageUrl,
  storeinit,
  selectedMetalId,
  selectedDiaId,
  selectedCsId,
  detailsMenu,
  outputFilters,
  navigate,
}) => {
  const cleanImg =
    imageUrl && !imageUrl.includes("undefined")
      ? imageUrl
      : getCardImageUrl(productData, storeinit);

  let obj = {
    a: productData?.autocode,
    b: productData?.designno,
    m: selectedMetalId,
    d: selectedDiaId,
    c: selectedCsId,
    f: outputFilters || {},
    g: detailsMenu,
    img: cleanImg,
    ArticleNo: productData?.ArticleNo,
    ArticleId: productData?.ArticleId ?? null,
    title: productData?.TitleLine ?? "",
    nwt: productData?.Nwt ?? 0,
    price: productData?.UnitCostWithMarkUp ?? 0,
    mediaDet: productData?.ImageVideoDetail ?? "",
    l: productData?.ImageExtension || "webp",
    count: productData?.ImageCount || 0,
  };

  let encodeObj = compressAndEncode(JSON.stringify(obj));

  if (typeof window !== "undefined") {
    sessionStorage.setItem("scroll_to_product", productData?.ArticleNo);
  }

  const url = `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`;
  if (navigate?.push) {
    navigate.push(url);
  }
};

/**
 * Parse Range Filter Slider values vs Input values
 */
export const parseRangeData = (filterData, name, sliderValue, inputValue) => {
  const target = filterData?.find(
    (ele) =>
      ele?.Name === (name === "Dia" ? "Diamond" : name === "net" ? "NetWt" : name)
  );
  const options = target?.options?.length > 0 ? JSON.parse(target.options)[0] : {};

  const isChanged =
    JSON.stringify(sliderValue) !==
    JSON.stringify([options?.Min, options?.Max]);

  return {
    [`${name !== "Dia" ? name.toLowerCase() : name}Min`]: isChanged
      ? sliderValue[0] !== inputValue[0]
        ? sliderValue[0]
        : inputValue[0]
      : "",
    [`${name !== "Dia" ? name.toLowerCase() : name}Max`]: isChanged
      ? sliderValue[1] !== inputValue[1]
        ? sliderValue[1]
        : inputValue[1]
      : "",
  };
};

/**
 * Decode HTML entity strings safely
 */
export const decodeEntities = (html) => {
  if (typeof document === "undefined") return html || "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

/**
 * Parse Breadcrumb structure from current URL search params
 */
export const BreadCumsObj = (location) => {
  const searchStr = typeof window !== "undefined" ? window.location.search : "";
  let BreadCum;
  try {
    BreadCum = decodeURI(atob(searchStr.slice(3)))?.split("/");
  } catch (_) {
    BreadCum = ["", ""];
  }

  const values = BreadCum[0]?.split(",");
  const labels = BreadCum[1]?.split(",");

  const updatedBreadCum = labels?.reduce((acc, label, index) => {
    acc[label] = values[index] || "";
    return acc;
  }, {});

  let res =
    updatedBreadCum &&
    Object.entries(updatedBreadCum)?.reduce((acc, [key, value], index) => {
      acc[`FilterKey${index === 0 ? "" : index}`] = key.charAt(0).toUpperCase() + key.slice(1);
      acc[`FilterVal${index === 0 ? "" : index}`] = value;
      return acc;
    }, {});

  res = res || {};
  res.menuname = decodeURI(location || "")?.slice(3)?.slice(0, -1)?.split("/")[0];

  return res;
};

/**
 * Handle navigation when clicking a breadcrumb item
 */
export const handleBreadcums = ({ mparams, isCollectionMenu, navigate, location }) => {
  if (isCollectionMenu) {
    navigate?.push("/collection");
    return;
  }
  const key = Object.keys(mparams || {});
  const val = Object.values(mparams || {});

  const KeyObj = {};
  const ValObj = {};

  key.forEach((value, index) => {
    const keyName = `FilterKey${index === 0 ? "" : index}`;
    KeyObj[keyName] = value;
  });

  val.forEach((value, index) => {
    const keyName = `FilterVal${index === 0 ? "" : index}`;
    ValObj[keyName] = value;
  });

  const finalData = { ...KeyObj, ...ValObj };

  const queryParameters1 = [
    finalData?.FilterKey && `${finalData.FilterVal}`,
    finalData?.FilterKey1 && `${finalData.FilterVal1}`,
    finalData?.FilterKey2 && `${finalData.FilterVal2}`,
  ]
    .filter(Boolean)
    .join("/");

  const queryParameters = [
    finalData?.FilterKey && `${finalData.FilterVal}`,
    finalData?.FilterKey1 && `${finalData.FilterVal1}`,
    finalData?.FilterKey2 && `${finalData.FilterVal2}`,
  ]
    .filter(Boolean)
    .join(",");

  const otherparamUrl = Object.entries({
    b: finalData?.FilterKey,
    g: finalData?.FilterKey1,
    c: finalData?.FilterKey2,
  })
    .filter(([_, value]) => value !== undefined)
    .map(([_, value]) => value)
    .filter(Boolean)
    .join(",");

  const menuEncoded = `${queryParameters}/${otherparamUrl}`;
  const url = `/p/${BreadCumsObj(location)?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

  navigate?.push(url);
};

/**
 * Resolve dynamic document title based on search query / category
 */
export const DynamicListPageTitleLineFunc = (location, defaultTitle = "ELvee Jewels Pvt. Ltd.") => {
  const searchStr = typeof window !== "undefined" ? window.location.search : "";
  if (searchStr.charAt(1) === "S") {
    return decodeURIComponent(location?.split("/")[2] || "") || defaultTitle;
  }
  const menuName = BreadCumsObj(location)?.menuname;
  return menuName || defaultTitle;
};

