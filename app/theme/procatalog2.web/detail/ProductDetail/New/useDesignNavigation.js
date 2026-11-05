"use client";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import {
  compressAndEncode,
  getCardImageUrl,
} from "@/app/(core)/utils/product/productListingHelpers";
import { formatRedirectTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

export const STORAGE_KEY_PROCAT_LIST = "procatalog_design_list";

export default function useDesignNavigation({ currentDesignNo, currentAutocode, storeInit }) {
  const navigate = useNextRouterLikeRR();
  const [designList, setDesignList] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_PROCAT_LIST);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setDesignList(parsed);
      }
    } catch (_) {}
  }, []);

  const currentIndex = useMemo(() => {
    if (!Array.isArray(designList) || designList.length === 0) return -1;
    const targetDesign = String(currentDesignNo || "").trim().toLowerCase();
    const targetAuto = String(currentAutocode || "").trim().toLowerCase();
    return designList.findIndex((item) => {
      const itemDesign = String(item?.designno || "").trim().toLowerCase();
      const itemAuto = String(item?.autocode || "").trim().toLowerCase();
      return (
        (targetDesign && itemDesign === targetDesign) ||
        (targetAuto && itemAuto === targetAuto)
      );
    });
  }, [designList, currentDesignNo, currentAutocode]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < designList.length - 1;

  const navigateToProduct = useCallback(
    (productData) => {
      if (!productData) return;
      try {
        const cleanImg = productData?.img || getCardImageUrl(productData, storeInit) || "";
        const obj = {
          a: productData?.autocode,
          b: productData?.designno,
          m: productData?.MetalColorid || productData?.MetalTypeId || null,
          d: productData?.DiamondQualityId || null,
          c: productData?.ColorStoneQualityId || null,
          f: {},
          g: "",
          img: cleanImg,
          ArticleNo: productData?.ArticleNo || productData?.designno || "",
          ArticleId: productData?.ArticleId ?? null,
          title: productData?.TitleLine ?? "",
          nwt: productData?.Nwt ?? 0,
          price: productData?.UnitCostWithMarkUp ?? 0,
          mediaDet: productData?.ImageVideoDetail ?? "",
          l: productData?.ImageExtension || "webp",
          count: productData?.ImageCount || 0,
        };
        const encodeObj = compressAndEncode(JSON.stringify(obj));
        const url = `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`;
        if (navigate?.push) navigate.push(url);
      } catch (err) {
        console.error("[useDesignNavigation] Navigation failed:", err);
      }
    },
    [navigate, storeInit]
  );

  const handlePrev = useCallback(() => {
    if (hasPrev) navigateToProduct(designList[currentIndex - 1]);
  }, [hasPrev, designList, currentIndex, navigateToProduct]);

  const handleNext = useCallback(() => {
    if (hasNext) navigateToProduct(designList[currentIndex + 1]);
  }, [hasNext, designList, currentIndex, navigateToProduct]);

  return { designList, currentIndex, hasPrev, hasNext, handlePrev, handleNext };
}
