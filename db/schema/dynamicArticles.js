import { sanitizeSqlIdentifier } from "./dynamicDesigns.js";

/**
 * Standard prefixes for dynamic article and material detail tables:
 * - ArticleManagement_DesignInfo_Web_{Laboursetid}_{diamondpricelistname}_{colorstonepricelistname}_{SettingPriceUniqueNo}
 * - ArticleManagement_DesignMaterialDetail_Web_{Laboursetid}_{diamondpricelistname}_{colorstonepricelistname}_{SettingPriceUniqueNo}
 */
export const ARTICLE_INFO_PREFIX = "ArticleManagement_DesignInfo_Web_";
export const ARTICLE_MATERIAL_PREFIX = "ArticleManagement_DesignMaterialDetail_Web_";
export const ARTICLE_TABLE_PREFIX = ARTICLE_INFO_PREFIX;

/**
 * Generates standardized dynamic article table name from policy configuration parameters.
 * Example:
 * { Laboursetid: 1, diamondpricelistname: "DeePolicy", colorstonepricelistname: "ColorStonePrice", SettingPriceUniqueNo: 1 }
 * -> "ArticleManagement_DesignInfo_Web_1_DeePolicy_ColorStonePrice_1"
 * 
 * @param {object} [config={}]
 * @param {string} [prefix=ARTICLE_INFO_PREFIX]
 * @returns {string}
 */
export function getDynamicArticleTableName(config = {}, prefix = ARTICLE_INFO_PREFIX) {
  const labour = sanitizeSqlIdentifier(
    config.Laboursetid ?? config.laboursetid ?? config.pricemanagement_laboursetid ?? "0",
    "0"
  );
  const dia = sanitizeSqlIdentifier(
    config.diamondpricelistName ?? config.diamondpricelistname ?? config.Diamondpricelistname ?? "default",
    "default"
  );
  const cs = sanitizeSqlIdentifier(
    config.colorstonepricelistName ?? config.colorstonepricelistname ?? config.Colorstonepricelistname ?? "default",
    "default"
  );
  const setting = sanitizeSqlIdentifier(
    config.SettingPriceUniqueNo ?? config.settingpriceuniqueno ?? "0",
    "0"
  );

  return `${prefix}${labour}_${dia}_${cs}_${setting}`;
}

/**
 * Generates standardized dynamic article material detail table name from policy configuration parameters.
 * Example:
 * -> "ArticleManagement_DesignMaterialDetail_Web_1_DeePolicy_ColorStonePrice_1"
 * 
 * @param {object} [config={}]
 * @param {string} [prefix=ARTICLE_MATERIAL_PREFIX]
 * @returns {string}
 */
export function getDynamicArticleMaterialTableName(config = {}, prefix = ARTICLE_MATERIAL_PREFIX) {
  return getDynamicArticleTableName(config, prefix);
}

/**
 * Ensures the dynamic article table and corresponding performance indexes exist in the tenant SQLite database.
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {string} tableName 
 */
export function ensureDynamicArticleTable(db, tableName) {
  const cleanTable = sanitizeSqlIdentifier(tableName, "articles");

  // 1. DDL for dynamic article table matching GETPRODUCTFULLARTICLE payload (rd)
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS "${cleanTable}" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      autocode TEXT,
      designno TEXT NOT NULL,
      ArticleId INTEGER,
      ArticleNo TEXT UNIQUE NOT NULL,
      MetalWeight DECIMAL(18,3),
      FindingWeight DECIMAL(18,3),
      NetWeight DECIMAL(18,3),
      TotalDiamondPcs INTEGER DEFAULT 0,
      ActualDiamondWeight DECIMAL(18,3) DEFAULT 0,
      DiamondWeightWithLoss DECIMAL(18,3) DEFAULT 0,
      TotalColorStonePcs INTEGER DEFAULT 0,
      ActualColorStoneWeight DECIMAL(18,3) DEFAULT 0,
      CsaddinnetWeight DECIMAL(18,3) DEFAULT 0,
      CsappliedWeight DECIMAL(18,3) DEFAULT 0,
      TotalMiscPcs INTEGER DEFAULT 0,
      TotalMiscWeight DECIMAL(18,3) DEFAULT 0,
      TotalMiscWeight_addingrossWeight DECIMAL(18,3) DEFAULT 0,
      MiscaddinnetWeight DECIMAL(18,3) DEFAULT 0,
      MiscappliedWeight DECIMAL(18,3) DEFAULT 0,
      ActualGrossWeight DECIMAL(18,3),
      GrossWeightWithLoss DECIMAL(18,3),
      IsMrpBase INTEGER DEFAULT 0,
      MetalRateOnId INTEGER DEFAULT 0,
      MakingChargeOnId INTEGER DEFAULT 0,
      Metalrate DECIMAL(18,2) DEFAULT 0,
      MakingCharge DECIMAL(18,2) DEFAULT 0,
      TotalMetalCost DECIMAL(18,2) DEFAULT 0,
      TotalDiamondCost DECIMAL(18,2) DEFAULT 0,
      TotalColorStoneCost DECIMAL(18,2) DEFAULT 0,
      TotalMiscCost DECIMAL(18,2) DEFAULT 0,
      TotalMakingCost DECIMAL(18,2) DEFAULT 0,
      TotalOtherCost DECIMAL(18,2) DEFAULT 0,
      TotalSettingCost DECIMAL(18,2) DEFAULT 0,
      TotalDiamondhandlingCost DECIMAL(18,2) DEFAULT 0,
      CurrencyRate DECIMAL(18,4),
      TotalUnitCost DECIMAL(18,2) DEFAULT 0,
      MarkUp DECIMAL(18,2),
      UnitCostWithmarkup DECIMAL(18,2) DEFAULT 0,
      Discount DECIMAL(18,2) DEFAULT 0,
      MRP DECIMAL(18,2) DEFAULT 0,
      ToolItemId INTEGER DEFAULT 0,
      TotalCSSettingCost DECIMAL(18,2) DEFAULT 0,
      TotalDiaSettingCost DECIMAL(18,2) DEFAULT 0,
      MetalTypeId INTEGER,
      MetalType TEXT,
      MetalColorId INTEGER,
      MetalColor TEXT,
      Size TEXT,
      CartId INTEGER DEFAULT 0,
      IsInWish INTEGER DEFAULT 0,
      IsInCart INTEGER DEFAULT 0,
      CartQuantity INTEGER DEFAULT 0,
      Remarks TEXT,
      InStock INTEGER DEFAULT 0,
      StockBarcode TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_${cleanTable}_article UNIQUE (ArticleNo)
    );
  `;

  // 2. High-performance composite indexes for instant PDP variant matching and lookups
  const indexSql = `
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_designno ON "${cleanTable}"(designno);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_autocode ON "${cleanTable}"(autocode);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_article_no ON "${cleanTable}"(ArticleNo);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_article_id ON "${cleanTable}"(ArticleId);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_combo ON "${cleanTable}"(designno, MetalTypeId, MetalColorId);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_size ON "${cleanTable}"(designno, Size);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_cost ON "${cleanTable}"(UnitCostWithmarkup ASC);
  `;

  db.exec(createTableSql);
  db.exec(indexSql);
}

/**
 * Ensures the dynamic article material detail table and corresponding indexes exist in SQLite.
 * Matches GETPRODUCTFULLARTICLE payload (rd1).
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {string} tableName 
 */
export function ensureDynamicArticleMaterialTable(db, tableName) {
  const cleanTable = sanitizeSqlIdentifier(tableName, "article_materials");

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS "${cleanTable}" (
      row_id INTEGER PRIMARY KEY AUTOINCREMENT,
      id INTEGER UNIQUE,
      DesignId INTEGER,
      autocode TEXT,
      designno TEXT NOT NULL,
      ArticleId INTEGER,
      ArticleNo TEXT NOT NULL,
      MaterialTypeId INTEGER,
      MaterialTypeName TEXT,
      StoneTypeid INTEGER,
      StoneTypeName TEXT,
      Shapeid INTEGER,
      Shape TEXT,
      QualityId INTEGER,
      Quality TEXT,
      ColorId INTEGER,
      Color TEXT,
      SizeId INTEGER,
      MMsize TEXT,
      Supplier TEXT,
      IsCenterStone INTEGER DEFAULT 0,
      Pointer DECIMAL(18,3) DEFAULT 0,
      Pieces INTEGER DEFAULT 0,
      Weight DECIMAL(18,3) DEFAULT 0,
      GrossDiamondWeight DECIMAL(18,3) DEFAULT 0,
      Settingid INTEGER DEFAULT 0,
      IsMiscwtAddinGrossWeight INTEGER DEFAULT 0,
      MiscCeilling_IsPercentage DECIMAL(18,2),
      MiscAppliedPercentage DECIMAL(18,2),
      MiscAppliedWeight DECIMAL(18,3),
      MiscaddinnetWeight DECIMAL(18,3),
      isRateOnPcs INTEGER,
      Rate DECIMAL(18,2),
      TotalAmount DECIMAL(18,2) DEFAULT 0,
      IsSettingFix INTEGER,
      SettingRate DECIMAL(18,2),
      TotalSetting DECIMAL(18,2) DEFAULT 0,
      FinalAmount DECIMAL(18,2) DEFAULT 0,
      findingtypeid INTEGER DEFAULT 0,
      findingAccessoriesId INTEGER DEFAULT 0,
      findingtypename TEXT,
      findingAccessories TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const indexSql = `
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_article_no ON "${cleanTable}"(ArticleNo);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_designno ON "${cleanTable}"(designno);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_article_id ON "${cleanTable}"(ArticleId);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_design_id ON "${cleanTable}"(DesignId);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_autocode ON "${cleanTable}"(autocode);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_stone_type ON "${cleanTable}"(StoneTypeid);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_combo ON "${cleanTable}"(designno, StoneTypeid, Shapeid);
  `;

  db.exec(createTableSql);
  db.exec(indexSql);
}

/**
 * Intelligently resolves the dynamic article info table name for a tenant database.
 * Supports both new ArticleManagement_DesignInfo_Web_ and legacy article_DesignInfo_Web_ tables.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {string}
 */
export function resolveArticleTableName(db, options = {}) {
  // 1. Explicit table name provided
  const rawSpecified = options.tableName || options.table;
  if (rawSpecified) {
    const specified = sanitizeSqlIdentifier(rawSpecified, "");
    if (specified) {
      ensureDynamicArticleTable(db, specified);
      return specified;
    }
  }

  // 2. Policy configuration explicitly passed in options
  const hasLabour =
    (options.Laboursetid != null && String(options.Laboursetid).trim() !== "") ||
    (options.laboursetid != null && String(options.laboursetid).trim() !== "") ||
    (options.pricemanagement_laboursetid != null && String(options.pricemanagement_laboursetid).trim() !== "");
  const hasDia =
    (options.diamondpricelistName != null && String(options.diamondpricelistName).trim() !== "") ||
    (options.diamondpricelistname != null && String(options.diamondpricelistname).trim() !== "") ||
    (options.Diamondpricelistname != null && String(options.Diamondpricelistname).trim() !== "");

  if (hasLabour && hasDia) {
    const candidateNew = getDynamicArticleTableName(options, ARTICLE_INFO_PREFIX);
    if (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidateNew)) {
      return candidateNew;
    }
    const candidateOld = getDynamicArticleTableName(options, "article_DesignInfo_Web_");
    if (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE").get(candidateOld)) {
      return candidateOld;
    }
    ensureDynamicArticleTable(db, candidateNew);
    return candidateNew;
  }

  // 3. Check storeinit in DB for default policy table
  let storeInitCandidate = null;
  try {
    const sInit = db.prepare("SELECT * FROM storeinit LIMIT 1").get();
    if (sInit) {
      storeInitCandidate = getDynamicArticleTableName(sInit, ARTICLE_INFO_PREFIX);
      const exists = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? COLLATE NOCASE")
        .get(storeInitCandidate);
      if (exists) return exists.name;
    }
  } catch (_) {}

  // 4. Check for any existing modern dynamic article table in sqlite_master
  try {
    const modernCandidate = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'ArticleManagement_DesignInfo_Web_%' ORDER BY name DESC LIMIT 1")
      .get();
    if (modernCandidate?.name) {
      return modernCandidate.name;
    }
  } catch (_) {}

  // 5. Fallback to legacy article_DesignInfo_Web_ tables if present
  try {
    const legacyCandidate = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'article_DesignInfo_Web_%' ORDER BY name DESC LIMIT 1")
      .get();
    if (legacyCandidate?.name) {
      return legacyCandidate.name;
    }
  } catch (_) {}

  // 5. Fallback
  const fallback = storeInitCandidate || getDynamicArticleTableName({}, ARTICLE_INFO_PREFIX);
  ensureDynamicArticleTable(db, fallback);
  return fallback;
}

/**
 * Intelligently resolves the dynamic material detail table name for a tenant database.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {string} [infoTableName]
 * @returns {string}
 */
export function resolveArticleMaterialTableName(db, options = {}, infoTableName = "") {
  // If explicitly provided
  if (options.materialTableName || options.matTable) {
    const specified = sanitizeSqlIdentifier(options.materialTableName || options.matTable, "");
    if (specified) {
      ensureDynamicArticleMaterialTable(db, specified);
      return specified;
    }
  }

  // If infoTableName was provided, map it directly
  if (infoTableName) {
    if (infoTableName.startsWith(ARTICLE_INFO_PREFIX)) {
      const matName = infoTableName.replace(ARTICLE_INFO_PREFIX, ARTICLE_MATERIAL_PREFIX);
      ensureDynamicArticleMaterialTable(db, matName);
      return matName;
    }
    if (infoTableName.startsWith("article_DesignInfo_Web_")) {
      const matName = infoTableName.replace("article_DesignInfo_Web_", ARTICLE_MATERIAL_PREFIX);
      ensureDynamicArticleMaterialTable(db, matName);
      return matName;
    }
  }

  // Compute from options or storeinit
  const matName = getDynamicArticleMaterialTableName(options, ARTICLE_MATERIAL_PREFIX);
  ensureDynamicArticleMaterialTable(db, matName);
  return matName;
}

export default {
  ARTICLE_INFO_PREFIX,
  ARTICLE_MATERIAL_PREFIX,
  ARTICLE_TABLE_PREFIX,
  getDynamicArticleTableName,
  getDynamicArticleMaterialTableName,
  ensureDynamicArticleTable,
  ensureDynamicArticleMaterialTable,
  resolveArticleTableName,
  resolveArticleMaterialTableName,
};
