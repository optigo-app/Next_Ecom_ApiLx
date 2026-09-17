import { ensureDynamicArticleTable } from "../schema/dynamicArticles.js";
import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";

/**
 * Batch inserts or updates article records into a dynamic article table in SQLite.
 * Enforces UNIQUE(ArticleNo) to prevent duplicate article variants.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>} rawPayload
 * @param {object} [options={}]
 * @param {string} [tableName='articles']
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, totalInDatabase: number, success: boolean }}
 */
export function batchInsertArticles(db, rawPayload = [], options = {}, tableName = "articles") {
  const targetTable = sanitizeSqlIdentifier(options?.tableName || tableName, "articles");

  let articles = [];
  if (Array.isArray(rawPayload)) {
    articles = rawPayload;
  } else if (rawPayload && typeof rawPayload === "object") {
    articles = rawPayload.articles || rawPayload.Data?.rd || rawPayload.rd || [];
  }

  // Ensure dynamic table and indexes exist
  ensureDynamicArticleTable(db, targetTable);

  if (!Array.isArray(articles) || articles.length === 0) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;
    return {
      totalReceived: 0,
      insertedCount: 0,
      updatedCount: 0,
      totalInDatabase: count,
      success: true,
    };
  }

  // If truncate or clear was requested
  if (options?.truncate || options?.clearBeforeSync || options?.flush) {
    try {
      db.prepare(`DELETE FROM "${targetTable}"`).run();
    } catch (_) {}
  }

  const upsertStmt = db.prepare(`
    INSERT INTO "${targetTable}" (
      autocode,
      designno,
      ArticleId,
      ArticleNo,
      MetalWeight,
      FindingWeight,
      NetWeight,
      TotalDiamondPcs,
      ActualDiamondWeight,
      DiamondWeightWithLoss,
      TotalColorStonePcs,
      ActualColorStoneWeight,
      CsaddinnetWeight,
      CsappliedWeight,
      TotalMiscPcs,
      TotalMiscWeight,
      TotalMiscWeight_addingrossWeight,
      MiscaddinnetWeight,
      MiscappliedWeight,
      ActualGrossWeight,
      GrossWeightWithLoss,
      IsMrpBase,
      MetalRateOnId,
      MakingChargeOnId,
      Metalrate,
      MakingCharge,
      TotalMetalCost,
      TotalDiamondCost,
      TotalColorStoneCost,
      TotalMiscCost,
      TotalMakingCost,
      TotalOtherCost,
      TotalSettingCost,
      TotalDiamondhandlingCost,
      CurrencyRate,
      TotalUnitCost,
      MarkUp,
      UnitCostWithmarkup,
      Discount,
      MRP,
      ToolItemId,
      TotalCSSettingCost,
      TotalDiaSettingCost,
      MetalTypeId,
      MetalType,
      MetalColorId,
      MetalColor,
      Size,
      CartId,
      IsInWish,
      IsInCart,
      CartQuantity,
      Remarks,
      InStock,
      StockBarcode,
      updated_at
    ) VALUES (
      @autocode,
      @designno,
      @ArticleId,
      @ArticleNo,
      @MetalWeight,
      @FindingWeight,
      @NetWeight,
      @TotalDiamondPcs,
      @ActualDiamondWeight,
      @DiamondWeightWithLoss,
      @TotalColorStonePcs,
      @ActualColorStoneWeight,
      @CsaddinnetWeight,
      @CsappliedWeight,
      @TotalMiscPcs,
      @TotalMiscWeight,
      @TotalMiscWeight_addingrossWeight,
      @MiscaddinnetWeight,
      @MiscappliedWeight,
      @ActualGrossWeight,
      @GrossWeightWithLoss,
      @IsMrpBase,
      @MetalRateOnId,
      @MakingChargeOnId,
      @Metalrate,
      @MakingCharge,
      @TotalMetalCost,
      @TotalDiamondCost,
      @TotalColorStoneCost,
      @TotalMiscCost,
      @TotalMakingCost,
      @TotalOtherCost,
      @TotalSettingCost,
      @TotalDiamondhandlingCost,
      @CurrencyRate,
      @TotalUnitCost,
      @MarkUp,
      @UnitCostWithmarkup,
      @Discount,
      @MRP,
      @ToolItemId,
      @TotalCSSettingCost,
      @TotalDiaSettingCost,
      @MetalTypeId,
      @MetalType,
      @MetalColorId,
      @MetalColor,
      @Size,
      @CartId,
      @IsInWish,
      @IsInCart,
      @CartQuantity,
      @Remarks,
      @InStock,
      @StockBarcode,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(ArticleNo) DO UPDATE SET
      autocode = excluded.autocode,
      designno = excluded.designno,
      ArticleId = excluded.ArticleId,
      MetalWeight = excluded.MetalWeight,
      FindingWeight = excluded.FindingWeight,
      NetWeight = excluded.NetWeight,
      TotalDiamondPcs = excluded.TotalDiamondPcs,
      ActualDiamondWeight = excluded.ActualDiamondWeight,
      DiamondWeightWithLoss = excluded.DiamondWeightWithLoss,
      TotalColorStonePcs = excluded.TotalColorStonePcs,
      ActualColorStoneWeight = excluded.ActualColorStoneWeight,
      CsaddinnetWeight = excluded.CsaddinnetWeight,
      CsappliedWeight = excluded.CsappliedWeight,
      TotalMiscPcs = excluded.TotalMiscPcs,
      TotalMiscWeight = excluded.TotalMiscWeight,
      TotalMiscWeight_addingrossWeight = excluded.TotalMiscWeight_addingrossWeight,
      MiscaddinnetWeight = excluded.MiscaddinnetWeight,
      MiscappliedWeight = excluded.MiscappliedWeight,
      ActualGrossWeight = excluded.ActualGrossWeight,
      GrossWeightWithLoss = excluded.GrossWeightWithLoss,
      IsMrpBase = excluded.IsMrpBase,
      MetalRateOnId = excluded.MetalRateOnId,
      MakingChargeOnId = excluded.MakingChargeOnId,
      Metalrate = excluded.Metalrate,
      MakingCharge = excluded.MakingCharge,
      TotalMetalCost = excluded.TotalMetalCost,
      TotalDiamondCost = excluded.TotalDiamondCost,
      TotalColorStoneCost = excluded.TotalColorStoneCost,
      TotalMiscCost = excluded.TotalMiscCost,
      TotalMakingCost = excluded.TotalMakingCost,
      TotalOtherCost = excluded.TotalOtherCost,
      TotalSettingCost = excluded.TotalSettingCost,
      TotalDiamondhandlingCost = excluded.TotalDiamondhandlingCost,
      CurrencyRate = excluded.CurrencyRate,
      TotalUnitCost = excluded.TotalUnitCost,
      MarkUp = excluded.MarkUp,
      UnitCostWithmarkup = excluded.UnitCostWithmarkup,
      Discount = excluded.Discount,
      MRP = excluded.MRP,
      ToolItemId = excluded.ToolItemId,
      TotalCSSettingCost = excluded.TotalCSSettingCost,
      TotalDiaSettingCost = excluded.TotalDiaSettingCost,
      MetalTypeId = excluded.MetalTypeId,
      MetalType = excluded.MetalType,
      MetalColorId = excluded.MetalColorId,
      MetalColor = excluded.MetalColor,
      Size = excluded.Size,
      CartId = excluded.CartId,
      IsInWish = excluded.IsInWish,
      IsInCart = excluded.IsInCart,
      CartQuantity = excluded.CartQuantity,
      Remarks = excluded.Remarks,
      InStock = excluded.InStock,
      StockBarcode = excluded.StockBarcode,
      updated_at = CURRENT_TIMESTAMP
  `);

  const initialCount = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;

  const insertTx = db.transaction((rows) => {
    for (const art of rows) {
      if (!art || !art.ArticleNo) continue;

      upsertStmt.run({
        autocode: art.autocode != null ? String(art.autocode) : null,
        designno: String(art.designno || "").trim(),
        ArticleId: art.ArticleId != null ? Number(art.ArticleId) : null,
        ArticleNo: String(art.ArticleNo).trim(),
        MetalWeight: art.MetalWeight != null ? Number(art.MetalWeight) : null,
        FindingWeight: art.FindingWeight != null ? Number(art.FindingWeight) : null,
        NetWeight: art.NetWeight != null ? Number(art.NetWeight) : null,
        TotalDiamondPcs: art.TotalDiamondPcs != null ? Number(art.TotalDiamondPcs) : 0,
        ActualDiamondWeight: art.ActualDiamondWeight != null ? Number(art.ActualDiamondWeight) : 0,
        DiamondWeightWithLoss: art.DiamondWeightWithLoss != null ? Number(art.DiamondWeightWithLoss) : 0,
        TotalColorStonePcs: art.TotalColorStonePcs != null ? Number(art.TotalColorStonePcs) : 0,
        ActualColorStoneWeight: art.ActualColorStoneWeight != null ? Number(art.ActualColorStoneWeight) : 0,
        CsaddinnetWeight: art.CsaddinnetWeight != null ? Number(art.CsaddinnetWeight) : 0,
        CsappliedWeight: art.CsappliedWeight != null ? Number(art.CsappliedWeight) : 0,
        TotalMiscPcs: art.TotalMiscPcs != null ? Number(art.TotalMiscPcs) : 0,
        TotalMiscWeight: art.TotalMiscWeight != null ? Number(art.TotalMiscWeight) : 0,
        TotalMiscWeight_addingrossWeight: art.TotalMiscWeight_addingrossWeight != null ? Number(art.TotalMiscWeight_addingrossWeight) : 0,
        MiscaddinnetWeight: art.MiscaddinnetWeight != null ? Number(art.MiscaddinnetWeight) : 0,
        MiscappliedWeight: art.MiscappliedWeight != null ? Number(art.MiscappliedWeight) : 0,
        ActualGrossWeight: art.ActualGrossWeight != null ? Number(art.ActualGrossWeight) : null,
        GrossWeightWithLoss: art.GrossWeightWithLoss != null ? Number(art.GrossWeightWithLoss) : null,
        IsMrpBase: art.IsMrpBase != null ? Number(art.IsMrpBase) : 0,
        MetalRateOnId: art.MetalRateOnId != null ? Number(art.MetalRateOnId) : 0,
        MakingChargeOnId: art.MakingChargeOnId != null ? Number(art.MakingChargeOnId) : 0,
        Metalrate: art.Metalrate != null ? Number(art.Metalrate) : 0,
        MakingCharge: art.MakingCharge != null ? Number(art.MakingCharge) : 0,
        TotalMetalCost: art.TotalMetalCost != null ? Number(art.TotalMetalCost) : 0,
        TotalDiamondCost: art.TotalDiamondCost != null ? Number(art.TotalDiamondCost) : 0,
        TotalColorStoneCost: art.TotalColorStoneCost != null ? Number(art.TotalColorStoneCost) : 0,
        TotalMiscCost: art.TotalMiscCost != null ? Number(art.TotalMiscCost) : 0,
        TotalMakingCost: art.TotalMakingCost != null ? Number(art.TotalMakingCost) : 0,
        TotalOtherCost: art.TotalOtherCost != null ? Number(art.TotalOtherCost) : 0,
        TotalSettingCost: art.TotalSettingCost != null ? Number(art.TotalSettingCost) : 0,
        TotalDiamondhandlingCost: art.TotalDiamondhandlingCost != null ? Number(art.TotalDiamondhandlingCost) : 0,
        CurrencyRate: art.CurrencyRate != null ? Number(art.CurrencyRate) : null,
        TotalUnitCost: art.TotalUnitCost != null ? Number(art.TotalUnitCost) : 0,
        MarkUp: art.MarkUp != null ? Number(art.MarkUp) : null,
        UnitCostWithmarkup: art.UnitCostWithmarkup != null ? Number(art.UnitCostWithmarkup) : 0,
        Discount: art.Discount != null ? Number(art.Discount) : 0,
        MRP: art.MRP != null ? Number(art.MRP) : 0,
        ToolItemId: art.ToolItemId != null ? Number(art.ToolItemId) : 0,
        TotalCSSettingCost: art.TotalCSSettingCost != null ? Number(art.TotalCSSettingCost) : 0,
        TotalDiaSettingCost: art.TotalDiaSettingCost != null ? Number(art.TotalDiaSettingCost) : 0,
        MetalTypeId: art.MetalTypeId != null ? Number(art.MetalTypeId) : null,
        MetalType: art.MetalType != null ? String(art.MetalType) : null,
        MetalColorId: art.MetalColorId != null ? Number(art.MetalColorId) : null,
        MetalColor: art.MetalColor != null ? String(art.MetalColor) : null,
        Size: art.Size != null ? String(art.Size) : null,
        CartId: art.CartId != null ? Number(art.CartId) : 0,
        IsInWish: art.IsInWish != null ? Number(art.IsInWish) : 0,
        IsInCart: art.IsInCart != null ? Number(art.IsInCart) : 0,
        CartQuantity: art.CartQuantity != null ? Number(art.CartQuantity) : 0,
        Remarks: art.Remarks != null ? String(art.Remarks) : "",
        InStock: art.InStock != null ? Number(art.InStock) : 0,
        StockBarcode: art.StockBarcode != null ? String(art.StockBarcode) : "",
      });
    }
  });

  insertTx(articles);

  const finalCount = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;
  const insertedCount = Math.max(0, finalCount - initialCount);
  const updatedCount = Math.max(0, articles.length - insertedCount);

  return {
    totalReceived: articles.length,
    insertedCount,
    updatedCount,
    totalInDatabase: finalCount,
    success: true,
  };
}

export default batchInsertArticles;
