export const METAL_DENSITY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS metal_density (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gold_type TEXT,
  density REAL,
  raw_json TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

export function ensureMetalDensityTable(db) {
  if (!db) return;
  db.exec(METAL_DENSITY_TABLE_SQL);

  const columns = db.prepare("PRAGMA table_info(metal_density)").all();
  if (columns.some((column) => column.name === "id")) return;

  const migrate = db.transaction(() => {
    db.exec("ALTER TABLE metal_density RENAME TO metal_density_legacy");
    db.exec(METAL_DENSITY_TABLE_SQL);
    db.exec(`
      INSERT INTO metal_density (gold_type, density, updated_at)
      SELECT gold_type, density, updated_at FROM metal_density_legacy
    `);
    db.exec("DROP TABLE metal_density_legacy");
  });
  migrate();
}
