import { ensureMetalDensityTable } from "../schema/metalDensity.js";

export function saveMetalDensity(db, rawPayload = {}) {
  ensureMetalDensityTable(db);
  const rows = Array.isArray(rawPayload)
    ? rawPayload
    : rawPayload?.Data?.rd || rawPayload?.rd || [];
  const upsert = db.prepare(`
    INSERT INTO metal_density (gold_type, density, raw_json, updated_at)
    VALUES (@goldType, @density, @rawJson, CURRENT_TIMESTAMP)
  `);
  const saveRows = db.transaction((items) => {
    db.prepare("DELETE FROM metal_density").run();
    for (const row of items) {
      const goldType = row?.MasterManagement_goldtypename ?? null;
      const density = Number(row?.density);
      upsert.run({
        goldType: goldType == null ? null : String(goldType),
        density: Number.isFinite(density) ? density : null,
        rawJson: JSON.stringify(row),
      });
    }
  });
  saveRows(Array.isArray(rows) ? rows : []);
  return {
    receivedCount: Array.isArray(rows) ? rows.length : 0,
    savedCount: Array.isArray(rows) ? rows.length : 0,
  };
}
