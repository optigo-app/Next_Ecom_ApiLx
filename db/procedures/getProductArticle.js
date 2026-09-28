import {
  resolveArticleTableName,
  resolveArticleMaterialTableName,
} from "../schema/dynamicArticles.js";
import { getDynamicDesignTableName } from "../schema/dynamicDesigns.js";

/**
 * Builds the tightest single-condition WHERE clause for article/material lookup.
 *
 * Priority: designno > autocode > ArticleNo
 *
 * Why single condition vs OR chain:
 *   The original `(autocode != '' AND autocode = ?) OR (designno != '' AND designno = ? COLLATE NOCASE)`
 *   pattern forces SQLite to evaluate all OR branches even when most params are empty strings.
 *   SQLite cannot use a selective index seek when the query has an OR with an always-true branch.
 *   A single targeted condition lets SQLite use the exact covering index for that column.
 *
 * @param {string} designno
 * @param {string} autocode
 * @param {string} articleNo
 * @returns {{ whereClause: string, params: string[], matchField: string }}
 */
function buildLookupCondition(designno, autocode, articleNo) {
  if (designno) {
    return {
      whereClause: "designno = ? COLLATE NOCASE",
      params: [designno],
      matchField: "designno",
    };
  }
  if (autocode) {
    return {
      whereClause: "autocode = ?",
      params: [autocode],
      matchField: "autocode",
    };
  }
  return {
    whereClause: "ArticleNo = ? COLLATE NOCASE",
    params: [articleNo],
    matchField: "articleNo",
  };
}

/**
 * Executes raw SQLite queries matching the Optigo ERP GETPRODUCTARTICLE stored procedure.
 * Production-grade: uses targeted single-condition WHERE clauses + NOCASE composite indexes
 * for instant lookups without full table scans.
 *
 * Produces pure SQLite direct data:
 * - Data.rd:  Design master info & media details
 * - Data.rd1: Article variant combinations with metal type, color, size, and pricing
 * - Data.rd2: Full material breakdown (metals, diamonds, colorstones)
 *
 * @param {import('better-sqlite3').Database} db
 * @param {object} options
 * @returns {{ Status: string, Message: string, Data: { rd: Array<object>, rd1: Array<object>, rd2: Array<object> } }}
 */
export function getProductArticle(db, options = {}) {
  const autocode  = String(options.autocode  ?? options.a ?? "").trim();
  const designno  = String(options.designno  ?? options.b ?? options.design_no ?? "").trim();
  const articleNo = String(options.ArticleNo ?? options.articleno ?? "").trim();

  if (!autocode && !designno && !articleNo) {
    return {
      Status: "200",
      Message: "Request processed successfully.",
      Data: { rd: [], rd1: [], rd2: [] },
    };
  }

  // Single targeted condition — used across all three queries (rd, rd1, rd2)
  const condition = buildLookupCondition(designno, autocode, articleNo);

  // 1. Resolve dynamic tables partitioned by policy
  const articleTable = resolveArticleTableName(db, options);
  const matTable     = resolveArticleMaterialTableName(db, options, articleTable);
  const designTable  = getDynamicDesignTableName(options);

  // ── 2. DESIGN HEADER (rd) ──────────────────────────────────────────────────
  let rd = [];
  try {
    const hasDesignTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(designTable);

    const targetDesignTable = hasDesignTable ? designTable : "designs";
    const hasAnyDesignTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(targetDesignTable);

    if (hasAnyDesignTable) {
      // Single targeted WHERE — uses (designno COLLATE NOCASE) or (autocode) index directly
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
        WHERE ${condition.whereClause}
        LIMIT 1
      `;
      const dRow = db.prepare(designSql).get(...condition.params);
      if (dRow) rd = [dRow];
    }
  } catch (dErr) {
    console.warn("[getProductArticle] Design header query warning:", dErr.message);
  }

  // ── 3. ARTICLES / VARIANTS (rd1) ──────────────────────────────────────────
  let rd1 = [];
  try {
    const hasArtTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(articleTable);

    if (hasArtTable) {
      const hasMatTable = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
        .get(matTable);

      if (hasMatTable) {
        // MetalCTE mirrors the ERP GETPRODUCTARTICLE stored procedure exactly:
        // metal fields come ONLY from the material detail table (StoneTypeid 4/5),
        // first row per article by material id — never from the article info table
        // (whose MetalType columns can carry the diamond row from the full-article feed).
        // Joined on ArticleNo because synced material rows may have NULL ArticleId.
        const artSql = `
          WITH MetalCTE AS (
            SELECT
              ArticleNo,
              TRIM(COALESCE(Shape, '') || ' ' || COALESCE(Quality, '')) AS MetalType,
              QualityId AS MetalTypeId,
              Color AS MetalColor,
              ColorId AS MetalColorId,
              ROW_NUMBER() OVER (
                PARTITION BY ArticleNo
                ORDER BY COALESCE(id, row_id) ASC
              ) AS rn
            FROM "${matTable}"
            WHERE ${condition.whereClause}
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
            m.MetalTypeId AS MetalTypeId,
            m.MetalType AS MetalType,
            m.MetalColorId AS MetalColorId,
            m.MetalColor AS MetalColor,
            COALESCE(a.Size, '') AS Size,
            COALESCE(a.CartId, 0) AS CartId,
            COALESCE(a.IsInWish, 0) AS IsInWish,
            COALESCE(a.IsInCart, 0) AS IsInCart,
            COALESCE(a.CartQuantity, 0) AS CartQuantity,
            COALESCE(a.Remarks, '') AS Remarks,
            COALESCE(a.InStock, 0) AS InStock,
            COALESCE(a.StockBarcode, '') AS StockBarcode
          FROM "${articleTable}" a
          INNER JOIN MetalCTE m ON a.ArticleNo = m.ArticleNo COLLATE NOCASE AND m.rn = 1
          WHERE a.${condition.whereClause}
          ORDER BY a.ArticleId ASC, a.id ASC
        `;
        // condition.params used twice: once for MetalCTE, once for the outer WHERE
        rd1 = db.prepare(artSql).all(...condition.params, ...condition.params);
      } else {
        // No material table — simpler query, same targeted WHERE
        const artSql = `
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
          WHERE ${condition.whereClause}
          ORDER BY ArticleId ASC, id ASC
        `;
        rd1 = db.prepare(artSql).all(...condition.params);
      }
    }
  } catch (artErr) {
    console.error(`[getProductArticle] Article query error on '${articleTable}':`, artErr.message);
  }

  // Fallback: if design header missing but articles found, build minimal rd from rd1
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

  // ── 4. MATERIALS (rd2) ────────────────────────────────────────────────────
  let rd2 = [];
  try {
    const hasMatTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
      .get(matTable);

    if (hasMatTable) {
      // Single targeted WHERE — uses (designno NOCASE, ArticleId) composite index
      // ERP material rows may arrive with NULL ArticleId — backfill it from the
      // article table via ArticleNo so frontend rd1<->rd2 matching stays intact.
      const hasArtTableForMat = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
        .get(articleTable);
      const articleIdExpr = hasArtTableForMat
        ? `COALESCE(mt.ArticleId, (SELECT a2.ArticleId FROM "${articleTable}" a2 WHERE a2.ArticleNo = mt.ArticleNo COLLATE NOCASE LIMIT 1))`
        : "mt.ArticleId";
      const matSql = `
        SELECT
          mt.id,
          mt.DesignId,
          mt.autocode,
          mt.designno,
          ${articleIdExpr} AS ArticleId,
          mt.ArticleNo,
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
        FROM "${matTable}" mt
        WHERE mt.${condition.whereClause}
        ORDER BY ArticleId ASC, mt.id ASC
      `;
      rd2 = db.prepare(matSql).all(...condition.params);
    }
  } catch (matErr) {
    console.error(`[getProductArticle] Material query error on '${matTable}':`, matErr.message);
  }

  return {
    Status: "200",
    Message: "Request processed successfully.",
    Data: { rd, rd1, rd2 },
  };
}

export default getProductArticle;
