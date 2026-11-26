import { ensureMetalTypeMasterTable } from "../schema/metalTypeMaster.js";

/**
 * Saves the METALTYPECOMBO master rows into SQLite (metal_type_master).
 * sort_order keeps the ERP order, which the metal fallback rule depends on
 * ("first GOLD" / "first SILVER").
 * An empty response never wipes an existing master.
 */
export function saveMetalTypeMaster(db, rawPayload = {}) {
  ensureMetalTypeMasterTable(db);
  const rows = Array.isArray(rawPayload) ? rawPayload : rawPayload?.Data?.rd || rawPayload?.rd || [];
  const items = Array.isArray(rows) ? rows.filter((row) => row && row.Metalid != null) : [];
  if (items.length === 0) return { receivedCount: 0, savedCount: 0, skipped: true };

  const insert = db.prepare(`
    INSERT INTO metal_type_master
      (metal_id, metal_type_id, metal_type, metal_type_name, metal_purity, sort_order, raw_json, updated_at)
    VALUES (@metalId, @metalTypeId, @metalType, @metalTypeName, @metalPurity, @sortOrder, @rawJson, CURRENT_TIMESTAMP)
  `);
  db.transaction(() => {
    db.prepare("DELETE FROM metal_type_master").run();
    items.forEach((row, index) => {
      insert.run({
        metalId: Number(row.Metalid),
        metalTypeId: row.MetalTypeId == null ? null : Number(row.MetalTypeId),
        metalType: row.metaltype == null ? null : String(row.metaltype),
        metalTypeName: row.metaltypename == null ? null : String(row.metaltypename),
        metalPurity: row.metalPurity == null ? null : String(row.metalPurity),
        sortOrder: index,
        rawJson: JSON.stringify(row),
      });
    });
  })();
  return { receivedCount: items.length, savedCount: items.length };
}
