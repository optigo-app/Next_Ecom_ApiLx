/**
 * Schema definition for policy_categories.
 * Pre-materialized categories table partitioned by policy table_name.
 * Stores category counts and the primary preview product per category.
 */

export const POLICY_CATEGORIES_TABLE = "policy_categories";

/**
 * Ensures the policy_categories table and performance indexes exist.
 * @param {import('better-sqlite3').Database} db
 */
export function ensurePolicyCategoriesTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS "${POLICY_CATEGORIES_TABLE}" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      CategoryName TEXT NOT NULL,
      categoryId INTEGER,
      designCount INTEGER NOT NULL DEFAULT 0,
      DesignId INTEGER,
      designno TEXT,
      autocode TEXT,
      TitleLine TEXT,
      ImageCount INTEGER DEFAULT 0,
      ImageExtension TEXT,
      ImageVideoDetail TEXT,
      UnitCost REAL,
      UnitCostWithMarkUpIncTax REAL,
      MetalColorid INTEGER,
      MetalPurityid INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(table_name, CategoryName)
    );

    CREATE INDEX IF NOT EXISTS idx_policy_categories_table 
      ON "${POLICY_CATEGORIES_TABLE}"(table_name);

    CREATE INDEX IF NOT EXISTS idx_policy_categories_lookup 
      ON "${POLICY_CATEGORIES_TABLE}"(table_name, designCount DESC);
  `);
}

export default {
  POLICY_CATEGORIES_TABLE,
  ensurePolicyCategoriesTable,
};
