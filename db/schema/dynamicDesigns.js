import { DESIGNS_TABLE_SQL } from "./designs.js";

/**
 * Centralized prefix for dynamic design tables.
 * Can be changed in this single location if naming conventions evolve.
 */
export const DESIGN_TABLE_PREFIX = "design_Productlist_";

/**
 * Normalizes and sanitizes a string token for safe SQL table and index names.
 * Converts any non-alphanumeric character into an underscore and trims.
 * 
 * @param {any} val 
 * @param {string} [fallback="default"] 
 * @returns {string}
 */
export function sanitizeSqlIdentifier(val, fallback = "default") {
  if (val === null || val === undefined) return fallback;
  const str = String(val).trim().replace(/[^a-zA-Z0-9_]/g, "_");
  return str || fallback;
}

/**
 * Generates the standardized dynamic table name from policy configuration parameters.
 * Handles flexible/case-insensitive property names and fallbacks.
 * 
 * Example:
 * { Laboursetid: 24, diamondpricelistname: "testing", colorstonepricelistname: "testing", SettingPriceUniqueNo: 8 }
 * -> "designlist_24_testing_testing_8"
 * 
 * @param {object} [config={}] 
 * @param {string} [prefix=DESIGN_TABLE_PREFIX]
 * @returns {string}
 */
export function getDynamicDesignTableName(config = {}, prefix = DESIGN_TABLE_PREFIX) {
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
 * Ensures the dynamic table and all corresponding performance indexes exist in the tenant database.
 * Clones the full schema and indexes from the standard designs definition.
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {string} tableName 
 */
export function ensureDynamicDesignTable(db, tableName) {
  const cleanTable = sanitizeSqlIdentifier(tableName, "designs");
  if (cleanTable === "designs") return;

  // 1. Create dynamic table matching designs schema
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS "${cleanTable}" (
      id INTEGER,
      SrNo TEXT,
      DesignId INTEGER,
      ArticleNo TEXT UNIQUE,
      designno TEXT,
      autocode TEXT,
      TitleLine TEXT,
      description TEXT,
      DisplayOrder INTEGER DEFAULT 0,
      IsBestSeller INTEGER DEFAULT 0,
      IsTrending INTEGER DEFAULT 0,
      IsNewArrival INTEGER DEFAULT 0,
      IsInReadyStock INTEGER DEFAULT 0,
      IsMrpBase INTEGER DEFAULT 1,
      EntryDate DATETIME,
      FrontEnd1_newArrivalsto DATETIME,
      DiaQuaCol TEXT,
      CsQuaCol TEXT,
      SoldCnt INTEGER DEFAULT 0,
      Nwt DECIMAL(18,3),
      Gwt DECIMAL(18,3),
      Dwt DECIMAL(18,3),
      Dpcs INTEGER DEFAULT 0,
      CSwt DECIMAL(18,3),
      CSpcs INTEGER DEFAULT 0,
      UnitCost DECIMAL(18,2),
      UnitCostWithMarkUp DECIMAL(18,2),
      UnitCostWithMarkUpIncTax DECIMAL(18,2),
      Metal_Cost DECIMAL(18,2),
      Labour_Cost DECIMAL(18,2),
      Diamond_Cost DECIMAL(18,2),
      Diamond_SettingCost DECIMAL(18,2),
      ColorStone_Cost DECIMAL(18,2),
      ColorStone_SettingCost DECIMAL(18,2),
      Misc_Cost DECIMAL(18,2),
      Misc_SettingCost DECIMAL(18,2) DEFAULT 0,
      Other_Cost DECIMAL(18,2),
      SolPrice DECIMAL(18,2) DEFAULT 0,
      MetalPurityid INTEGER,
      MetalColorid INTEGER,
      PackageIdList TEXT,
      ExclusiveCustomerId TEXT,
      MetalTypeid INTEGER,
      MetalTypePurity TEXT,
      CartId INTEGER,
      IsInWish INTEGER DEFAULT 0,
      IsInCart INTEGER DEFAULT 0,
      ImageCount INTEGER DEFAULT 0,
      ColorImageCount INTEGER DEFAULT 0,
      "360ImageCount" INTEGER DEFAULT 0,
      VideoCount INTEGER DEFAULT 0,
      ImageExtension TEXT DEFAULT 'png',
      "360ImageExtension" TEXT,
      VideoExtension TEXT,
      IsImageNameWithRandNo INTEGER DEFAULT 0,
      ImageVideoDetail TEXT,
      product_typeid INTEGER,
      collectionid INTEGER,
      categoryid INTEGER,
      sub_categoryid INTEGER,
      brandid INTEGER,
      genderid INTEGER,
      occasionid INTEGER,
      Styleid INTEGER,
      make_typeid INTEGER,
      category TEXT,
      collection TEXT,
      sub_category TEXT,
      gender TEXT,
      brand TEXT,
      occasion TEXT,
      product_type TEXT,
      style TEXT,
      make_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_${cleanTable}_article UNIQUE (ArticleNo)
    );
  `;

  // 2. Create distinct dynamic indexes
  const indexSql = `
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_article ON "${cleanTable}"(ArticleNo);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_designno ON "${cleanTable}"(designno);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_autocode ON "${cleanTable}"(autocode);

    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_gender_nc ON "${cleanTable}"(gender COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_category_nc ON "${cleanTable}"(category COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_collection_nc ON "${cleanTable}"(collection COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_subcategory_nc ON "${cleanTable}"(sub_category COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_brand_nc ON "${cleanTable}"(brand COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_style_nc ON "${cleanTable}"(style COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_product_type_nc ON "${cleanTable}"(product_type COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_occasion_nc ON "${cleanTable}"(occasion COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_make_type_nc ON "${cleanTable}"(make_type COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_metal_color ON "${cleanTable}"(MetalColorid);

    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_gender_category ON "${cleanTable}"(gender COLLATE NOCASE, category COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_gender_collection ON "${cleanTable}"(gender COLLATE NOCASE, collection COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_gender_brand ON "${cleanTable}"(gender COLLATE NOCASE, brand COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_gender_subcat ON "${cleanTable}"(gender COLLATE NOCASE, sub_category COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_category_subcat ON "${cleanTable}"(category COLLATE NOCASE, sub_category COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_cat_price ON "${cleanTable}"(category COLLATE NOCASE, UnitCostWithMarkUpIncTax ASC);

    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_sort_display ON "${cleanTable}"(DisplayOrder ASC, id ASC);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_sort_price_asc ON "${cleanTable}"(UnitCostWithMarkUpIncTax ASC, DisplayOrder ASC);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_sort_price_desc ON "${cleanTable}"(UnitCostWithMarkUpIncTax DESC, DisplayOrder ASC);
    CREATE INDEX IF NOT EXISTS idx_${cleanTable}_sort_new ON "${cleanTable}"(EntryDate DESC, id DESC);
  `;

  db.exec(createTableSql);
  db.exec(indexSql);
}

/**
 * Ensures the registry table exists to track all created dynamic policy tables.
 * 
 * @param {import('better-sqlite3').Database} db 
 */
export function ensureDynamicRegistryTable(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS dynamic_tables_registry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT UNIQUE,
      domain TEXT,
      laboursetid TEXT,
      diamondpricelistname TEXT,
      colorstonepricelistname TEXT,
      settingpriceuniqueno TEXT,
      config_json TEXT,
      total_products INTEGER DEFAULT 0,
      last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_dynamic_reg_name ON dynamic_tables_registry(table_name);
    CREATE INDEX IF NOT EXISTS idx_dynamic_reg_domain ON dynamic_tables_registry(domain);
  `;
  db.exec(sql);
}

/**
 * Updates or creates an entry in the dynamic tables registry.
 * 
 * @param {import('better-sqlite3').Database} db 
 * @param {object} entry 
 */
export function recordDynamicTableSync(db, entry) {
  ensureDynamicRegistryTable(db);
  const stmt = db.prepare(`
    INSERT INTO dynamic_tables_registry (
      table_name,
      domain,
      laboursetid,
      diamondpricelistname,
      colorstonepricelistname,
      settingpriceuniqueno,
      config_json,
      total_products,
      last_synced_at
    ) VALUES (
      @table_name,
      @domain,
      @laboursetid,
      @diamondpricelistname,
      @colorstonepricelistname,
      @settingpriceuniqueno,
      @config_json,
      @total_products,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(table_name) DO UPDATE SET
      domain = excluded.domain,
      total_products = excluded.total_products,
      config_json = excluded.config_json,
      last_synced_at = CURRENT_TIMESTAMP
  `);

  stmt.run({
    table_name: entry.table_name,
    domain: entry.domain || "",
    laboursetid: String(entry.laboursetid || ""),
    diamondpricelistname: String(entry.diamondpricelistname || ""),
    colorstonepricelistname: String(entry.colorstonepricelistname || ""),
    settingpriceuniqueno: String(entry.settingpriceuniqueno || ""),
    config_json: typeof entry.config_json === "string" ? entry.config_json : JSON.stringify(entry.config_json || {}),
    total_products: Number(entry.total_products || 0),
  });
}
