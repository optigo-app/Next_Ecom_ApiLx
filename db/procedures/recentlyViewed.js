import { resolveHomeTable } from "./getHomeProducts.js";
import { RECENTLY_VIEWED_TABLE_SQL } from "../schema/recentlyViewed.js";

/**
 * Saves a recently viewed design for a specific customer in SQLite.
 * Designno is NOT globally unique, so multiple customers can view/click the same design.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} options
 * @param {string|number} options.customerId
 * @param {string} options.designno
 * @param {string|number} [options.autocode]
 * @returns {{ success: boolean, error?: string }}
 */
export function saveRecentlyViewed(db, options = {}) {
  const customerId = options.customerId || options.Customerid || options.customer_id;
  const designno = options.designno || options.designNo;
  const autocode = options.autocode || options.autoCode || null;

  if (!customerId || !designno) {
    return { success: false, message: "customerId and designno are required" };
  }

  // Ensure table exists
  db.exec(RECENTLY_VIEWED_TABLE_SQL);

  try {
    const saveTx = db.transaction(() => {
      // 1. Remove prior occurrence for this specific customer so latest click moves to top
      db.prepare(`
        DELETE FROM recently_viewed_designs 
        WHERE customer_id = ? AND designno = ?
      `).run(String(customerId), String(designno));

      // 2. Insert new record
      db.prepare(`
        INSERT INTO recently_viewed_designs (customer_id, designno, autocode, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run(String(customerId), String(designno), autocode ? String(autocode) : null);

      // 3. Prune beyond top 30 for this customer
      db.prepare(`
        DELETE FROM recently_viewed_designs 
        WHERE customer_id = ? 
          AND id NOT IN (
            SELECT id FROM recently_viewed_designs 
            WHERE customer_id = ? 
            ORDER BY updated_at DESC 
            LIMIT 30
          )
      `).run(String(customerId), String(customerId));
    });

    saveTx();
    return { success: true };
  } catch (err) {
    console.error("[saveRecentlyViewed] Error saving recently viewed design:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Retrieves recently viewed designs for a specific customer.
 * Joins against the active product catalog / dynamic pricing table.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} options
 * @param {string|number} options.customerId
 * @param {string} [options.currentDesignno] - Excludes the current PDP design from the list
 * @param {number} [options.limit=12]
 * @returns {Array<object>}
 */
export function getRecentlyViewed(db, options = {}) {
  const customerId = options.customerId || options.Customerid || options.customer_id;
  if (!customerId) return [];

  const currentDesignno = options.currentDesignno || options.currentDesignNo || options.designno || null;
  const limit = Math.min(Number(options.limit) || 12, 30);
  const targetTable = resolveHomeTable(db, options);

  // Ensure recently_viewed_designs table exists
  db.exec(RECENTLY_VIEWED_TABLE_SQL);

  let query = `
    SELECT 
      d.*,
      r.updated_at AS recently_viewed_at
    FROM recently_viewed_designs r
    JOIN "${targetTable}" d ON d.designno = r.designno
    WHERE r.customer_id = ?
  `;
  const params = [String(customerId)];

  if (currentDesignno) {
    query += ` AND r.designno != ? `;
    params.push(String(currentDesignno));
  }

  query += ` ORDER BY r.updated_at DESC LIMIT ? `;
  params.push(limit);

  try {
    const rows = db.prepare(query).all(...params);
    return rows;
  } catch (err) {
    console.error(`[getRecentlyViewed] Query error on table '${targetTable}':`, err.message);
    return [];
  }
}

export default {
  saveRecentlyViewed,
  getRecentlyViewed,
};
