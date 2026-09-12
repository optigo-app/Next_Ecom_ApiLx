/**
 * Saves or updates menu filter options from GETFILTERLIST into menu_filters table.
 * Enforces UNIQUE(menu_identifier, filter_id).
 * Automatically logs sync actions in sync_logs table.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>} filterList - rd array from GETFILTERLIST response
 * @param {string} [menuIdentifier='default']
 * @returns {{ totalReceived: number, savedCount: number, success: boolean }}
 */
export function saveMenuFilters(db, filterList = [], menuIdentifier = "default") {
    const cleanMenu = String(menuIdentifier || "default").trim();

    if (!Array.isArray(filterList) || filterList.length === 0) {
        return { totalReceived: 0, savedCount: 0, success: true };
    }

    const upsertStmt = db.prepare(`
        INSERT INTO menu_filters (
            menu_identifier,
            filter_id,
            name,
            fil_dis_name,
            fil_no,
            options_json,
            updated_at
        ) VALUES (
            @menu_identifier,
            @filter_id,
            @name,
            @fil_dis_name,
            @fil_no,
            @options_json,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT(menu_identifier, filter_id) DO UPDATE SET
            name = excluded.name,
            fil_dis_name = excluded.fil_dis_name,
            fil_no = excluded.fil_no,
            options_json = excluded.options_json,
            updated_at = CURRENT_TIMESTAMP
    `);

    const executeBatch = db.transaction((rows) => {
        let count = 0;
        for (const row of rows) {
            const filterId = String(row.id || row.Name || "").trim().toLowerCase();
            if (!filterId) continue;

            const optionsStr = typeof row.options === "string" ? row.options : JSON.stringify(row.options || []);

            upsertStmt.run({
                menu_identifier: cleanMenu,
                filter_id: filterId,
                name: row.Name || row.name || "",
                fil_dis_name: row.Fil_DisName || row.fil_dis_name || row.Name || "",
                fil_no: Number(row.Fil_No || row.fil_no) || 0,
                options_json: optionsStr,
            });
            count++;
        }
        return count;
    });

    const savedCount = executeBatch(filterList);

    // Log to sync_logs
    try {
        db.prepare(`
            INSERT INTO sync_logs (menu_identifier, action, total_received, inserted_count, updated_count, status, message)
            VALUES (?, 'SYNC_FILTERS', ?, ?, 0, 'SUCCESS', ?)
        `).run(cleanMenu, filterList.length, savedCount, `Saved ${savedCount} filters for menu '${cleanMenu}'`);
    } catch (logErr) {
        console.warn("[sync_logs] Failed writing filter log:", logErr.message);
    }

    // Flush WAL to database.db so external GUI tools see data immediately
    try {
        db.pragma("wal_checkpoint(PASSIVE)");
    } catch (_) {}

    return {
        totalReceived: filterList.length,
        savedCount,
        success: true,
    };
}

export default saveMenuFilters;

