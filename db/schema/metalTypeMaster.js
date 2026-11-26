export const METAL_TYPE_MASTER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS metal_type_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metal_id INTEGER,
  metal_type_id INTEGER,
  metal_type TEXT,
  metal_type_name TEXT,
  metal_purity TEXT,
  sort_order INTEGER DEFAULT 0,
  raw_json TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

export function ensureMetalTypeMasterTable(db) {
  if (!db) return;
  db.exec(METAL_TYPE_MASTER_TABLE_SQL);
}
