import { ensureAlbumsTable } from "../schema/albums.js";

/**
 * Deletes album records from SQLite.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {number|string} [options.id]
 * @param {number|string} [options.CustomerId]
 * @param {boolean} [options.all=false]
 * @returns {{ deletedCount: number, success: boolean }}
 */
export function deleteAlbums(db, options = {}) {
    if (!db) return { deletedCount: 0, success: false };
    ensureAlbumsTable(db);
    let sql = "DELETE FROM albums";
    const conditions = [];
    const params = {};

    if (options.all) {
        // Delete all rows
    } else {
        if (options.id !== undefined && options.id !== null && options.id !== "") {
            conditions.push("id = @id");
            params.id = Number(options.id);
        }
        if (options.CustomerId !== undefined && options.CustomerId !== null && options.CustomerId !== "") {
            conditions.push("CustomerId = @CustomerId");
            params.CustomerId = Number(options.CustomerId);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        } else {
            // Safety guard: prevent accidental deletion of everything unless options.all is explicitly true
            return { deletedCount: 0, success: true };
        }
    }

    const info = db.prepare(sql).run(params);
    return {
        deletedCount: info.changes,
        success: true,
    };
}

export default deleteAlbums;
