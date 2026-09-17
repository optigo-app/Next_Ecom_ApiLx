import {
  resolveArticleTableName,
  resolveArticleMaterialTableName,
} from "../schema/dynamicArticles.js";
import { getDynamicDesignTableName } from "../schema/dynamicDesigns.js";

/**
 * Executes raw SQLite queries matching the Optigo ERP GETPRODUCTARTICLE stored procedure.
 * Produces pure SQLite direct data without caching:
 * - Data.rd: Design master info & media details
 * - Data.rd1: Article variant combinations with metal type, color, size, and pricing
 * - Data.rd2: Full material breakdown (metals, diamonds, colorstones)
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} options
 * @returns {{ Status: string, Message: string, Data: { rd: Array<object>, rd1: Array<object>, rd2: Array<object> } }}
 */
export function getProductArticle(db, options = {}) {
  const autocode = String(options.autocode ?? options.a ?? "").trim();
  const designno = String(options.designno ?? options.b ?? options.design_no ?? "").trim();
  const articleNo = String(options.ArticleNo ?? options.articleno ?? "").trim();

  if (!autocode && !designno && !articleNo) {
    return {
      Status: "200",
      Message: "Request processed successfully.",
      Data: { rd: [], rd1: [], rd2: [] },
    };
  }

  // 1. Resolve dynamic tables partitioned by policy
  const articleTable = resolveArticleTableName(db, options);
  const matTable = resolveArticleMaterialTableName(db, options, articleTable);
  const designTable = getDynamicDesignTableName(options);

  // 2. Query Design Header (rd)
  let rd = [];
  try {
    // Check dynamic design table first
    const hasDesignTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(designTable);

    const targetDesignTable = hasDesignTable ? designTable : "designs";
    const hasAnyDesignTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(targetDesignTable);

    if (hasAnyDesignTable) {
      const designSql = `
        SELECT 
          id,
          COALESCE(DesignId, id) AS DesignId,
          autocode,
          designno,
          COALESCE(TitleLine, '') AS TitleLine,
          COALESCE(description, '') AS description,
          COALESCE(ImageCount, 0) AS ImageCount,
          COALESCE(ColorImageCount, 0) AS ColorImageCount,
          COALESCE("360ImageCount", 0) AS "360ImageCount",
          COALESCE(VideoCount, 0) AS VideoCount,
          COALESCE(ImageExtension, 'jpg') AS ImageExtension,
          COALESCE("360ImageExtension", '') AS "360ImageExtension",
          COALESCE(VideoExtension, 'mp4') AS VideoExtension,
          COALESCE(IsImageNameWithRandNo, 0) AS IsImageNameWithRandNo,
          COALESCE(ImageVideoDetail, '') AS ImageVideoDetail
        FROM "${targetDesignTable}"
        WHERE (autocode != '' AND autocode = ?) OR (designno != '' AND designno = ? COLLATE NOCASE)
        LIMIT 1
      `;
      const dRow = db.prepare(designSql).get(autocode, designno);
      if (dRow) {
        rd = [dRow];
      }
    }
  } catch (dErr) {
    console.warn(`[getProductArticle] Design header query warning:`, dErr.message);
  }

  // 3. Query Articles (rd1) via Raw SQL with Metal CTE
  let rd1 = [];
  try {
    const hasArtTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(articleTable);

    if (hasArtTable) {
      const hasMatTable = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
        .get(matTable);

      let artSql = "";
      if (hasMatTable) {
        artSql = `
          WITH MetalCTE AS (
            SELECT 
              ArticleId,
              TRIM(Shape || ' ' || Quality) AS MetalType,
              QualityId AS MetalTypeId,
              Color AS MetalColor,
              ColorId AS MetalColorId,
              ROW_NUMBER() OVER (PARTITION BY ArticleId ORDER BY id ASC) AS rn
            FROM "${matTable}"
            WHERE ((autocode != '' AND autocode = ?) OR (designno != '' AND designno = ? COLLATE NOCASE))
              AND StoneTypeid IN (4, 5)
              AND QualityId > 0
              AND ColorId > 0
              AND TRIM(COALESCE(Shape, '') || ' ' || COALESCE(Quality, '')) != ''
              AND TRIM(COALESCE(Color, '')) != ''
          )
          SELECT 
            a.autocode,
            a.designno,
            a.ArticleId,
            a.ArticleNo,
            a.MetalWeight,
            a.FindingWeight,
            a.NetWeight,
            a.TotalDiamondPcs,
            a.ActualDiamondWeight,
            a.DiamondWeightWithLoss,
            a.TotalColorStonePcs,
            a.ActualColorStoneWeight,
            a.CsaddinnetWeight,
            a.CsappliedWeight,
            a.TotalMiscPcs,
            a.TotalMiscWeight,
            a.TotalMiscWeight_addingrossWeight,
            a.MiscaddinnetWeight,
            a.MiscappliedWeight,
            a.ActualGrossWeight,
            a.GrossWeightWithLoss,
            a.IsMrpBase,
            a.MetalRateOnId,
            a.MakingChargeOnId,
            a.Metalrate,
            a.MakingCharge,
            a.TotalMetalCost,
            a.TotalDiamondCost,
            a.TotalColorStoneCost,
            a.TotalMiscCost,
            a.TotalMakingCost,
            a.TotalOtherCost,
            a.TotalSettingCost,
            a.TotalDiamondhandlingCost,
            a.CurrencyRate,
            a.TotalUnitCost,
            a.MarkUp,
            a.UnitCostWithmarkup,
            a.Discount,
            a.MRP,
            a.ToolItemId,
            a.TotalCSSettingCost,
            a.TotalDiaSettingCost,
            COALESCE(NULLIF(a.MetalTypeId, 0), m.MetalTypeId, 0) AS MetalTypeId,
            COALESCE(NULLIF(a.MetalType, ''), m.MetalType, '') AS MetalType,
            COALESCE(NULLIF(a.MetalColorId, 0), m.MetalColorId, 0) AS MetalColorId,
            COALESCE(NULLIF(a.MetalColor, ''), m.MetalColor, '') AS MetalColor,
            COALESCE(a.Size, '') AS Size,
            COALESCE(a.CartId, 0) AS CartId,
            COALESCE(a.IsInWish, 0) AS IsInWish,
            COALESCE(a.IsInCart, 0) AS IsInCart,
            COALESCE(a.CartQuantity, 0) AS CartQuantity,
            COALESCE(a.Remarks, '') AS Remarks,
            COALESCE(a.InStock, 0) AS InStock,
            COALESCE(a.StockBarcode, '') AS StockBarcode
          FROM "${articleTable}" a
          LEFT JOIN MetalCTE m ON a.ArticleId = m.ArticleId AND m.rn = 1
          WHERE (a.autocode != '' AND a.autocode = ?) 
             OR (a.designno != '' AND a.designno = ? COLLATE NOCASE)
             OR (a.ArticleNo != '' AND a.ArticleNo = ? COLLATE NOCASE)
          ORDER BY a.ArticleId ASC, a.id ASC
        `;
        rd1 = db.prepare(artSql).all(autocode, designno, autocode, designno, articleNo);
      } else {
        artSql = `
          SELECT 
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
            COALESCE(MetalTypeId, 0) AS MetalTypeId,
            COALESCE(MetalType, '') AS MetalType,
            COALESCE(MetalColorId, 0) AS MetalColorId,
            COALESCE(MetalColor, '') AS MetalColor,
            COALESCE(Size, '') AS Size,
            COALESCE(CartId, 0) AS CartId,
            COALESCE(IsInWish, 0) AS IsInWish,
            COALESCE(IsInCart, 0) AS IsInCart,
            COALESCE(CartQuantity, 0) AS CartQuantity,
            COALESCE(Remarks, '') AS Remarks,
            COALESCE(InStock, 0) AS InStock,
            COALESCE(StockBarcode, '') AS StockBarcode
          FROM "${articleTable}"
          WHERE (autocode != '' AND autocode = ?) 
             OR (designno != '' AND designno = ? COLLATE NOCASE)
             OR (ArticleNo != '' AND ArticleNo = ? COLLATE NOCASE)
          ORDER BY ArticleId ASC, id ASC
        `;
        rd1 = db.prepare(artSql).all(autocode, designno, articleNo);
      }
    }
  } catch (artErr) {
    console.error(`[getProductArticle] Article query error on '${articleTable}':`, artErr.message);
  }

  // If rd is empty but rd1 has articles, build minimal design header from rd1
  if (rd.length === 0 && rd1.length > 0) {
    const firstArt = rd1[0];
    rd = [
      {
        id: firstArt.ArticleId || 0,
        DesignId: firstArt.ArticleId || 0,
        autocode: firstArt.autocode || autocode,
        designno: firstArt.designno || designno,
        TitleLine: firstArt.designno || "",
        description: "",
        ImageCount: 0,
        ColorImageCount: 0,
        "360ImageCount": 0,
        VideoCount: 0,
        ImageExtension: "jpg",
        "360ImageExtension": "",
        VideoExtension: "mp4",
        IsImageNameWithRandNo: 0,
        ImageVideoDetail: "[]",
      },
    ];
  }

  // 4. Query Materials (rd2) via Raw SQL
  let rd2 = [];
  try {
    const hasMatTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(matTable);

    if (hasMatTable) {
      const matSql = `
        SELECT 
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
        FROM "${matTable}"
        WHERE (autocode != '' AND autocode = ?) 
           OR (designno != '' AND designno = ? COLLATE NOCASE)
           OR (ArticleNo != '' AND ArticleNo = ? COLLATE NOCASE)
        ORDER BY ArticleId ASC, id ASC
      `;
      rd2 = db.prepare(matSql).all(autocode, designno, articleNo);
    }
  } catch (matErr) {
    console.error(`[getProductArticle] Material query error on '${matTable}':`, matErr.message);
  }

  return {
    Status: "200",
    Message: "Request processed successfully.",
    Data: {
      rd,
      rd1,
      rd2,
    },
  };
}

export default getProductArticle;
