import { ensureWebsiteColorTable } from "../schema/websiteColor.js";

/**
 * Fetches website color / theme configuration from SQLite for the given tenant database.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {number|string} [options.store_id] - Optional filter by store_id
 * @param {number|string} [options.storeId] - Optional filter by storeId
 * @param {number|string} [options.websiteId] - Optional filter by websiteId (maps to store_id)
 * @param {string} [options.domain] - Optional filter by domain_name
 * @param {string} [options.domain_name] - Optional filter by domain_name
 * @param {number|string} [options.id] - Optional filter by id
 * @returns {{ Status: string, Message: string, Data: { rd: Array<object> } }}
 */
export function getWebsiteColor(db, options = {}) {
    if (!db) {
        return {
            Status: "500",
            Message: "Database connection not available",
            Data: { rd: [] },
        };
    }

    try {
        ensureWebsiteColorTable(db);

        const conditions = [];
        const params = [];

        const storeId = options.store_id ?? options.storeId ?? options.websiteId ?? options.WebsiteId;
        if (storeId !== undefined && storeId !== null && String(storeId).trim() !== "") {
            conditions.push("store_id = ?");
            params.push(parseInt(storeId, 10));
        }

        const domain = options.domain_name || options.domainName || options.domain;
        if (domain) {
            conditions.push("(LOWER(domain_name) = LOWER(?) OR domain_name LIKE ?)");
            params.push(String(domain).trim(), `%${String(domain).trim()}%`);
        }

        const id = options.id || options.Id;
        if (id !== undefined && id !== null && String(id).trim() !== "") {
            conditions.push("id = ?");
            params.push(parseInt(id, 10));
        }

        let sql = "SELECT * FROM website_color";
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }
        sql += " ORDER BY id ASC";

        const stmt = db.prepare(sql);
        const rows = stmt.all(...params);

        return {
            Status: "200",
            Message: "Success",
            Data: { rd: rows },
        };
    } catch (err) {
        console.error("[getWebsiteColor] Error reading website_color from SQLite:", err.message);
        return {
            Status: "500",
            Message: `Failed to retrieve website color config: ${err.message}`,
            Data: { rd: [] },
        };
    }
}

export default getWebsiteColor;
