import { useMemo } from "react";

/**
 * Decides which customization mode a product uses.
 *   IsDesignBaseWeb = 1 -> design-based (inline dropdowns, live pricing, no article tag / drawer)
 *   otherwise           -> article-based (customize drawer, article tag)
 * The mode is only "known" once the article rows have loaded, so callers render nothing for the
 * customization area until then (prevents flicker between the two modes).
 */
export default function useCustomizationMode({
  rd1 = [],
  customizationDetail,
  defaultArticleId,
  loadingdata,
  isPriceloading,
}) {
  return useMemo(() => {
    const defaultArticle =
      rd1?.find((r) => r.ArticleId === defaultArticleId) || rd1?.[0] || null;
    const rawArticle = customizationDetail || defaultArticle;
    const isDesignBase = Number(rawArticle?.IsDesignBaseWeb) === 1;
    const isModeKnown = rd1?.length > 0 || (!loadingdata && !isPriceloading);
    return {
      defaultArticle,
      rawArticle,
      isDesignBase,
      isModeKnown,
      activeArticle: isDesignBase ? null : rawArticle,
    };
  }, [rd1, customizationDetail, defaultArticleId, loadingdata, isPriceloading]);
}
