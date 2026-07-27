"use client";
import React from "react";
import DetailPageSkeleton from "@/app/theme/beluxjewel.web/detail/DetailPageSkeleton";

import { useSearchParams } from "next/navigation";
import { decodeAndDecompress } from "@/app/(core)/utils/seo/seo-utils";

import { useStore } from "@/app/(core)/contexts/StoreProvider";

export default function Loading() {
  const searchParams = useSearchParams();
  const { loginUserDetail, storeInit } = useStore();

  const decodedData = React.useMemo(() => {
    try {
      const p = searchParams.get("p");
      if (!p) return null;
      return decodeAndDecompress(p);
    } catch (e) {
      return null;
    }
  }, [searchParams]);

  const CurrencyCode = loginUserDetail?.loginData ?? storeInit?.CurrencyCode ?? "$";

  const mediaList = React.useMemo(() => {
    if (!decodedData) return [];
    const fallback = decodedData.img ? [{ type: "image", src: decodedData.img }] : [];

    try {
      const mediaDet = decodedData.mediaDet;
      if (!mediaDet || mediaDet === "0") return fallback;
      const parsed = typeof mediaDet === "string" ? JSON.parse(mediaDet) : mediaDet;
      if (!Array.isArray(parsed) || parsed.length === 0) return fallback;

      const baseImageCDN = storeInit?.CDNDesignImageFol;
      const baseVideoCDN = storeInit?.CDNVPath;
      if (!baseImageCDN) return fallback;

      // Group images and videos
      const normalImages = parsed.filter((item) => Number(item?.TI) === 1);
      const colorImages = parsed.filter((item) => Number(item?.TI) === 2);
      const normalVideos = parsed.filter((item) => Number(item?.TI) === 3);
      const colorVideos = parsed.filter((item) => Number(item?.TI) === 4);

      let colorCode = null;
      if (decodedData?.img) {
        const fileName = decodedData.img.split("/").pop() || "";
        const parts = fileName.split("~");
        if (parts.length > 2) {
          colorCode = parts[2].split(".")[0]?.toUpperCase() || null;
        }
      }

      if (!colorCode && typeof window !== "undefined") {
        try {
          const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo") || "[]");
          const defaultMetalColorId = loginUserDetail?.MetalColorid ?? storeInit?.MetalColorid;
          const matchedColor = mtColorLocal.find((ele) => ele?.id === defaultMetalColorId);
          colorCode = matchedColor?.colorcode || colorImages[0]?.CN || null;
        } catch (err) {}
      }

      const result = [];

      if (colorImages.length > 0 && colorCode) {
        colorImages.forEach((img) => {
          if (img.CN === colorCode) {
            result.push({
              type: "image",
              src: `${baseImageCDN}${decodedData.b}~${img.Nm}~${colorCode}.${img.Ex || "webp"}`,
            });
          }
        });
      }

      if (result.length === 0 && normalImages.length > 0) {
        normalImages.forEach((img) => {
          result.push({
            type: "image",
            src: `${baseImageCDN}${decodedData.b}~${img.Nm}.${img.Ex || "webp"}`,
          });
        });
      }

      if (result.length === 0) {
        result.push(...fallback);
      }

      if (colorVideos.length > 0 && colorCode) {
        colorVideos.forEach((vid) => {
          if (vid.CN === colorCode && baseVideoCDN) {
            result.push({
              type: "video",
              src: `${baseVideoCDN}${decodedData.b}~${vid.Nm}~${colorCode}.${vid.Ex || "mp4"}`,
            });
          }
        });
      }

      normalVideos.forEach((vid) => {
        if (baseVideoCDN) {
          result.push({
            type: "video",
            src: `${baseVideoCDN}${decodedData.b}~${vid.Nm}.${vid.Ex || "mp4"}`,
          });
        }
      });

      return result;
    } catch (e) {
      return fallback;
    }
  }, [decodedData, storeInit, loginUserDetail]);

  return (
    <DetailPageSkeleton
      imageUrl={decodedData?.img}
      title={decodedData?.title || ""}
      ArticleNo={decodedData?.ArticleNo || decodedData?.b || ""}
      price={decodedData?.price}
      CurrencyCode={CurrencyCode}
      nwt={decodedData?.nwt}
      media={mediaList}
    />
  );
}
