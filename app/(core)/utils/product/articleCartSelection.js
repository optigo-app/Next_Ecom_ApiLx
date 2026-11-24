const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const pairId = (stone) => `${stone?.QualityId ?? 0},${stone?.ColorId ?? 0}`;

/**
 * Single source of truth for "which article/config did the user pick" when it
 * has to be written to an existing cart row (cart page drawer) - the same shape
 * can be reused by the detail page. Pure function, no side effects.
 *
 * Returns everything the CartCustomize payload needs:
 *  - ids (Metalid, MetalColorId, DiaQCid, CsQCid, Size, ArticleId, ArticleNo)
 *  - per-unit price (never multiplied by quantity)
 *  - Quantity
 *  - cost breakdown fields (same names ADDTOCART uses)
 */
export const buildArticleCartSelection = ({
  article,
  diamond,
  colorStone,
  size,
  quantity,
  cartItem,
}) => {
  const qty = Math.max(1, parseInt(quantity, 10) || num(cartItem?.Quantity, 1) || 1);
  const unitCost = num(
    article?.UnitCostWithmarkup ?? article?.TotalUnitCost ?? cartItem?.UnitCostWithMarkUp,
  );
  const finalSize = size || article?.Size || "";

  return {
    quantity: qty,
    size: finalSize,
    unitCost,
    markup: num(article?.MarkUp),
    metalId: article?.MetalTypeId ?? 0,
    metalColorId: article?.MetalColorId ?? 0,
    diaQc: pairId(diamond),
    csQc: pairId(colorStone),
    articleSelection: {
      ArticleId: article?.ArticleId,
      ArticleNo: article?.ArticleNo,
      Quantity: qty,
      UnitCost: unitCost,
      Extra: {
        Metal_Cost: article?.TotalMetalCost,
        Labour_Cost: article?.TotalMakingCost,
        Diamond_Cost: article?.TotalDiamondCost,
        Diamond_SettingCost: article?.TotalDiaSettingCost,
        ColorStone_Cost: article?.TotalColorStoneCost,
        ColorStone_SettingCost: article?.TotalCSSettingCost,
        Misc_Cost: article?.TotalMiscCost,
        Misc_SettingCost: article?.TotalSettingCost,
      },
    },
  };
};
