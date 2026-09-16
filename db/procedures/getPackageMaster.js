/**
 * Retrieves package master records from SQLite.
 * Formats matching the standard response { Status: "200", Message: "...", Data: { rd: [...] } }.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @param {number} [options.id]
 * @param {string} [options.asPackageName]
 * @param {string} [options.PackageName]
 * @param {boolean} [options.raw]
 * @returns {object|Array<object>}
 */
export function getPackageMaster(db, options = {}) {
    let sql = `
        SELECT 
            id,
            asPackageName,
            asPackageName AS PackageName,
            IncludePackageid,
            IncludePackagename
        FROM packagemaster
    `;
    const conditions = [];
    const params = {};

    if (options.id !== undefined && options.id !== null && options.id !== "") {
        conditions.push("id = @id");
        params.id = Number(options.id);
    }
    const targetName = options.asPackageName || options.PackageName;
    if (targetName) {
        conditions.push("LOWER(asPackageName) = LOWER(@asPackageName)");
        params.asPackageName = String(targetName).trim();
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY id ASC";

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

export default getPackageMaster;
