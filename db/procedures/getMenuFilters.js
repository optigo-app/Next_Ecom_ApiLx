/**
 * Retrieves stored filter options for a given menu_identifier.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {string} menuIdentifier
 * @returns {Array<object>} - Array matching the GETFILTERLIST 'rd' response structure
 */
export function getMenuFilters(db, menuIdentifier = "default") {
    const cleanMenu = String(menuIdentifier || "default").trim();

    const sql = `
        SELECT 
            filter_id AS id,
            name AS Name,
            fil_dis_name AS Fil_DisName,
            fil_no AS Fil_No,
            options_json AS options
        FROM menu_filters
        WHERE menu_identifier = ?
        ORDER BY fil_no ASC, id ASC
    `;

    const rows = db.prepare(sql).all(cleanMenu);
    return rows;
}

export default getMenuFilters;
