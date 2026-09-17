import { ensureDynamicArticleMaterialTable } from "../schema/dynamicArticles.js";
import { sanitizeSqlIdentifier } from "../schema/dynamicDesigns.js";

/**
 * Batch inserts or updates article material detail records (rd1) into a dynamic article material table.
 * Enforces UNIQUE(id) to prevent duplicate material rows.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>} rawPayload
 * @param {object} [options={}]
 * @param {string} [tableName='article_materials']
 * @returns {{ totalReceived: number, insertedCount: number, updatedCount: number, totalInDatabase: number, success: boolean }}
 */
export function batchInsertArticleMaterials(db, rawPayload = [], options = {}, tableName = "article_materials") {
  const targetTable = sanitizeSqlIdentifier(options?.tableName || tableName, "article_materials");

  let materials = [];
  if (Array.isArray(rawPayload)) {
    materials = rawPayload;
  } else if (rawPayload && typeof rawPayload === "object") {
    materials = rawPayload.materials || rawPayload.Data?.rd1 || rawPayload.rd1 || rawPayload.Data?.rd || rawPayload.rd || [];
  }

  // Ensure dynamic table and indexes exist
  ensureDynamicArticleMaterialTable(db, targetTable);

  if (!Array.isArray(materials) || materials.length === 0) {
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
      id,
      DesignId,
      autocode,
      designno,
      ArticleId,
      ArticleNo,
      MaterialTypeId,
      MaterialTypeName,
      StoneTypeid,
      StoneTypeName,
      Shapeid,
      Shape,
      QualityId,
      Quality,
      ColorId,
      Color,
      SizeId,
      MMsize,
      Supplier,
      IsCenterStone,
      Pointer,
      Pieces,
      Weight,
      GrossDiamondWeight,
      Settingid,
      IsMiscwtAddinGrossWeight,
      MiscCeilling_IsPercentage,
      MiscAppliedPercentage,
      MiscAppliedWeight,
      MiscaddinnetWeight,
      isRateOnPcs,
      Rate,
      TotalAmount,
      IsSettingFix,
      SettingRate,
      TotalSetting,
      FinalAmount,
      findingtypeid,
      findingAccessoriesId,
      findingtypename,
      findingAccessories
    ) VALUES (
      @id,
      @DesignId,
      @autocode,
      @designno,
      @ArticleId,
      @ArticleNo,
      @MaterialTypeId,
      @MaterialTypeName,
      @StoneTypeid,
      @StoneTypeName,
      @Shapeid,
      @Shape,
      @QualityId,
      @Quality,
      @ColorId,
      @Color,
      @SizeId,
      @MMsize,
      @Supplier,
      @IsCenterStone,
      @Pointer,
      @Pieces,
      @Weight,
      @GrossDiamondWeight,
      @Settingid,
      @IsMiscwtAddinGrossWeight,
      @MiscCeilling_IsPercentage,
      @MiscAppliedPercentage,
      @MiscAppliedWeight,
      @MiscaddinnetWeight,
      @isRateOnPcs,
      @Rate,
      @TotalAmount,
      @IsSettingFix,
      @SettingRate,
      @TotalSetting,
      @FinalAmount,
      @findingtypeid,
      @findingAccessoriesId,
      @findingtypename,
      @findingAccessories
    )
    ON CONFLICT(id) DO UPDATE SET
      DesignId = excluded.DesignId,
      autocode = excluded.autocode,
      designno = excluded.designno,
      ArticleId = excluded.ArticleId,
      ArticleNo = excluded.ArticleNo,
      MaterialTypeId = excluded.MaterialTypeId,
      MaterialTypeName = excluded.MaterialTypeName,
      StoneTypeid = excluded.StoneTypeid,
      StoneTypeName = excluded.StoneTypeName,
      Shapeid = excluded.Shapeid,
      Shape = excluded.Shape,
      QualityId = excluded.QualityId,
      Quality = excluded.Quality,
      ColorId = excluded.ColorId,
      Color = excluded.Color,
      SizeId = excluded.SizeId,
      MMsize = excluded.MMsize,
      Supplier = excluded.Supplier,
      IsCenterStone = excluded.IsCenterStone,
      Pointer = excluded.Pointer,
      Pieces = excluded.Pieces,
      Weight = excluded.Weight,
      GrossDiamondWeight = excluded.GrossDiamondWeight,
      Settingid = excluded.Settingid,
      IsMiscwtAddinGrossWeight = excluded.IsMiscwtAddinGrossWeight,
      MiscCeilling_IsPercentage = excluded.MiscCeilling_IsPercentage,
      MiscAppliedPercentage = excluded.MiscAppliedPercentage,
      MiscAppliedWeight = excluded.MiscAppliedWeight,
      MiscaddinnetWeight = excluded.MiscaddinnetWeight,
      isRateOnPcs = excluded.isRateOnPcs,
      Rate = excluded.Rate,
      TotalAmount = excluded.TotalAmount,
      IsSettingFix = excluded.IsSettingFix,
      SettingRate = excluded.SettingRate,
      TotalSetting = excluded.TotalSetting,
      FinalAmount = excluded.FinalAmount,
      findingtypeid = excluded.findingtypeid,
      findingAccessoriesId = excluded.findingAccessoriesId,
      findingtypename = excluded.findingtypename,
      findingAccessories = excluded.findingAccessories,
      updated_at = CURRENT_TIMESTAMP
  `);

  let countBefore = 0;
  try {
    countBefore = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;
  } catch (_) {}

  const sanitizeNumber = (val, fallback = 0) => {
    if (val === null || val === undefined || val === "") return fallback;
    const n = Number(val);
    return isNaN(n) ? fallback : n;
  };

  const sanitizeNullableNumber = (val) => {
    if (val === null || val === undefined || val === "") return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  const sanitizeString = (val, fallback = "") => {
    if (val === null || val === undefined) return fallback;
    return String(val).trim();
  };

  const insertTx = db.transaction((items) => {
    for (const item of items) {
      if (!item || typeof item !== "object") continue;

      const id = item.id != null ? Number(item.id) : null;
      if (!id) continue;

      const record = {
        id,
        DesignId: sanitizeNullableNumber(item.DesignId),
        autocode: sanitizeString(item.autocode),
        designno: sanitizeString(item.designno),
        ArticleId: sanitizeNullableNumber(item.ArticleId),
        ArticleNo: sanitizeString(item.ArticleNo),
        MaterialTypeId: sanitizeNullableNumber(item.MaterialTypeId ?? 0),
        MaterialTypeName: sanitizeString(item.MaterialTypeName),
        StoneTypeid: sanitizeNullableNumber(item.StoneTypeid ?? 0),
        StoneTypeName: sanitizeString(item.StoneTypeName),
        Shapeid: sanitizeNullableNumber(item.Shapeid ?? 0),
        Shape: sanitizeString(item.Shape),
        QualityId: sanitizeNullableNumber(item.QualityId ?? 0),
        Quality: sanitizeString(item.Quality),
        ColorId: sanitizeNullableNumber(item.ColorId ?? 0),
        Color: sanitizeString(item.Color),
        SizeId: sanitizeNullableNumber(item.SizeId ?? 0),
        MMsize: sanitizeString(item.MMsize),
        Supplier: item.Supplier != null ? String(item.Supplier).trim() : null,
        IsCenterStone: sanitizeNumber(item.IsCenterStone, 0),
        Pointer: sanitizeNumber(item.Pointer, 0),
        Pieces: sanitizeNumber(item.Pieces, 0),
        Weight: sanitizeNumber(item.Weight, 0),
        GrossDiamondWeight: sanitizeNumber(item.GrossDiamondWeight, 0),
        Settingid: sanitizeNumber(item.Settingid, 0),
        IsMiscwtAddinGrossWeight: sanitizeNumber(item.IsMiscwtAddinGrossWeight, 0),
        MiscCeilling_IsPercentage: sanitizeNullableNumber(item.MiscCeilling_IsPercentage),
        MiscAppliedPercentage: sanitizeNullableNumber(item.MiscAppliedPercentage),
        MiscAppliedWeight: sanitizeNullableNumber(item.MiscAppliedWeight),
        MiscaddinnetWeight: sanitizeNullableNumber(item.MiscaddinnetWeight),
        isRateOnPcs: sanitizeNullableNumber(item.isRateOnPcs),
        Rate: sanitizeNullableNumber(item.Rate),
        TotalAmount: sanitizeNumber(item.TotalAmount, 0),
        IsSettingFix: sanitizeNullableNumber(item.IsSettingFix),
        SettingRate: sanitizeNullableNumber(item.SettingRate),
        TotalSetting: sanitizeNumber(item.TotalSetting, 0),
        FinalAmount: sanitizeNumber(item.FinalAmount, 0),
        findingtypeid: sanitizeNumber(item.findingtypeid, 0),
        findingAccessoriesId: sanitizeNumber(item.findingAccessoriesId, 0),
        findingtypename: sanitizeString(item.findingtypename),
        findingAccessories: sanitizeString(item.findingAccessories),
      };

      upsertStmt.run(record);
    }
  });

  insertTx(materials);

  const countAfter = db.prepare(`SELECT COUNT(*) as count FROM "${targetTable}"`).get()?.count || 0;
  const netAdded = Math.max(0, countAfter - countBefore);
  const updatedCount = Math.max(0, materials.length - netAdded);

  return {
    totalReceived: materials.length,
    insertedCount: netAdded,
    updatedCount,
    totalInDatabase: countAfter,
    success: true,
  };
}

export default batchInsertArticleMaterials;
