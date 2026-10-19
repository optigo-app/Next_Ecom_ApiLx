import { ensureAlbumsTable } from "../schema/albums.js";

/**
 * Retrieves album records from SQLite.
 * Formats matching the standard ERP response: { Status: "200", Message: "...", Data: { rd: [...] } }.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {number|string} [options.id] - Filter by specific album ID
 * @param {number|string} [options.CustomerId] - Filter by Customer ID (or 0 for public)
 * @param {string} [options.albumcode] - Filter by albumcode
 * @param {string} [options.RandomNo] - Filter by RandomNo
 * @param {string} [options.albumName] - Filter by albumName
 * @param {string} [options.search] - Partial search on albumName or albumcode
 * @param {boolean} [options.validOnly=false] - Only return unexpired albums
 * @param {number} [options.limit] - Limit results
 * @param {number} [options.offset] - Offset results
 * @param {boolean} [options.raw=false] - If true, returns direct rows array
 * @returns {object|Array<object>}
 */
export function getAlbums(db, options = {}) {
    if (!db) {
        return options.raw ? [] : { Status: "400", Message: "Database instance required", Data: { rd: [] } };
    }

    ensureAlbumsTable(db);

    let sql = `
        SELECT 
            id,
            albumName,
            AutocodeList,
            ExpiryDate,
            albumcode,
            CustomerId,
            RandomNo,
            EntryDate
        FROM albums
    `;

    const conditions = [];
    const params = {};

    if (options.id !== undefined && options.id !== null && options.id !== "") {
        conditions.push("id = @id");
        params.id = Number(options.id);
    }

    if (options.CustomerId !== undefined && options.CustomerId !== null && options.CustomerId !== "") {
        const custId = Number(options.CustomerId);
        if (options.includePublic) {
            conditions.push("(CustomerId = @CustomerId OR CustomerId = 0 OR CustomerId IS NULL)");
        } else {
            conditions.push("CustomerId = @CustomerId");
        }
        params.CustomerId = custId;
    }

    if (options.albumcode) {
        conditions.push("LOWER(albumcode) = LOWER(@albumcode)");
        params.albumcode = String(options.albumcode).trim();
    }

    if (options.RandomNo) {
        conditions.push("RandomNo = @RandomNo");
        params.RandomNo = String(options.RandomNo).trim();
    }

    if (options.albumName) {
        conditions.push("LOWER(albumName) = LOWER(@albumName)");
        params.albumName = String(options.albumName).trim();
    }

    if (options.search) {
        conditions.push("(LOWER(albumName) LIKE @searchPattern OR LOWER(albumcode) LIKE @searchPattern)");
        params.searchPattern = `%${String(options.search).trim().toLowerCase()}%`;
    }

    if (options.validOnly) {
        conditions.push("(ExpiryDate IS NULL OR ExpiryDate = '' OR datetime(ExpiryDate) >= datetime('now'))");
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY id ASC, EntryDate DESC";

    if (options.limit && Number(options.limit) > 0) {
        sql += ` LIMIT ${Number(options.limit)}`;
        if (options.offset && Number(options.offset) > 0) {
            sql += ` OFFSET ${Number(options.offset)}`;
        }
    }

    const rows = db.prepare(sql).all(params);

    if (options.raw) {
        return rows;
    }

    return {
        Status: "200",
        Message: "Request processed successfully.",
        Data: {
            rd: rows,
        },
    };
}

export default getAlbums;
