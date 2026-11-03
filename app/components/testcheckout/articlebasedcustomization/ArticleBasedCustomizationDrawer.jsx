"use client";

import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CustomizerDrawer from "@/app/theme/procatalog.web/detail/ProductDetail/Customiziation";
import { SingleArticleProdListAPI } from "@/app/(core)/utils/API/ArticleSingleProdListAPI/ArticleSingleProdListAPI";

const normalizeArticle = (row) => ({
  ...row,
  ArticleId: row?.ArticleId ?? row?.id,
  ArticleNo: row?.ArticleNo ?? row?.articleno ?? "",
  MetalTypeId: row?.MetalTypeId ?? row?.Metalid ?? row?.metaltypeid ?? 0,
  MetalColorId: row?.MetalColorId ?? row?.metalcolorid ?? 0,
  MetalType: row?.MetalType ?? row?.metaltypename ?? row?.metal ?? "",
  MetalColor: row?.MetalColor ?? row?.metalcolorname ?? "",
  NetWeight: row?.NetWeight ?? row?.Nwt ?? row?.netweight ?? 0,
});

export default function ArticleBasedCustomizationDrawer({
  storeInit,
  loginData,
  onApply,
  item,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [stones, setStones] = useState([]);
  const [defaultArticleId, setDefaultArticleId] = useState(null);

  useEffect(() => {
    if (!item || item?.IsMrpBase === 1) return;
    let cancelled = false;

    const loadOptions = async () => {
      setLoading(true);
      setArticles([]);
      setStones([]);
      try {
        const result = await SingleArticleProdListAPI(
          {
            a: item?.autocode ?? "",
            b: item?.designno ?? "",
            ArticleNo: item?.ArticleNo ?? item?.articleno ?? "",
          },
          item?.Size ?? "",
          {
            mt: item?.metaltypeid ?? item?.MetalTypeId,
            diaQc: `${item?.diamondqualityid ?? 0},${item?.diamondcolorid ?? 0}`,
            csQc: `${item?.colorstonequalityid ?? 0},${item?.colorstonecolorid ?? 0}`,
          },
          Cookies.get("visiterId"),
        );

        const rd1 = (result?.pdResp?.rd1 ?? []).map(normalizeArticle);
        const rd2 = result?.pdResp?.rd2 ?? [];
        if (cancelled) return;
        if (!rd1.length) {
          toast.error("Customization options are unavailable for this item");
          onClose?.();
          return;
        }

        setArticles(rd1);
        setStones(rd2);
        const selected = rd1.find((article) =>
          String(article.ArticleNo).toLowerCase() ===
          String(item?.ArticleNo ?? item?.articleno ?? "").toLowerCase()
        ) || rd1.find((article) => String(article.ArticleId) === String(item?.ArticleId ?? item?.articleid)) || rd1[0];
        setDefaultArticleId(selected?.ArticleId ?? rd1[0]?.ArticleId);
      } catch (error) {
        console.error("SQLite article customization fetch failed:", error);
        toast.error("Could not load customization options");
        onClose?.();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOptions();
    return () => { cancelled = true; };
  }, [item, onClose]);

  const handleConfirm = async (articleId, size, selectedDiaQc, selectedMetal) => {
    let article = articles.find((row) => String(row.ArticleId) === String(articleId));
    if (selectedDiaQc && selectedMetal) {
      const [quality, color] = selectedDiaQc.split("-");
      const baseStone = stones.find(
        (stone) => String(stone.ArticleId) === String(article?.ArticleId) && Number(stone.StoneTypeid) === 1,
      );
      const matchingArticle = articles.find((candidate) => {
        const stone = stones.find(
          (row) => String(row.ArticleId) === String(candidate.ArticleId) && Number(row.StoneTypeid) === 1,
        );
        return (
          String(candidate.MetalTypeId) === String(selectedMetal.MetalTypeId) &&
          String(candidate.MetalColorId) === String(selectedMetal.MetalColorId) &&
          (!size || String(candidate.Size) === String(size)) &&
          String(stone?.Quality).toUpperCase() === String(quality).toUpperCase() &&
          String(stone?.Color).toUpperCase() === String(color).toUpperCase() &&
          (!baseStone?.MaterialTypeName || stone?.MaterialTypeName === baseStone.MaterialTypeName)
        );
      });
      article = matchingArticle || article;
    }
    if (!article || !item) {
      onClose?.();
      return;
    }

    const articleStones = stones.filter(
      (stone) => String(stone.ArticleId) === String(article.ArticleId),
    );
    await onApply?.({
      cartItem: item,
      article,
      size: size || article.Size || "",
      diamond: articleStones.find((stone) => Number(stone.StoneTypeid) === 1),
      colorStone: articleStones.find((stone) => Number(stone.StoneTypeid) === 2),
    });
    onClose?.();
  };

  return (
    <>
      <Backdrop open={loading} sx={{ zIndex: 1400, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <CustomizerDrawer
        open={Boolean(item && articles.length)}
        onClose={onClose}
        rd1={articles}
        rd2={stones}
        defaultArticleId={defaultArticleId}
        onConfirm={handleConfirm}
        storeInit={storeInit}
        loginData={loginData}
        showArticleId={false}
      />
    </>
  );
}
