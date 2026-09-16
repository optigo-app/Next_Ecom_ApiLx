/**
 * Procedure to delete/truncate menu_filters table in SQLite.
 * Automatically flushes WAL to disk.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {{ success: boolean, deletedCount: number, message: string }}
 */
export function deleteMenuFilters(db, options = {}) {
    let deletedCount = 0;
    const menuIdentifier = options.menuIdentifier || options.menu;

    if (menuIdentifier) {
        const info = db.prepare("DELETE FROM menu_filters WHERE menu_identifier = ?").run(String(menuIdentifier).trim());
        deletedCount = info.changes;
    } else {
        const info = db.prepare("DELETE FROM menu_filters").run();
        deletedCount = info.changes;
        try {
            db.prepare("DELETE FROM sqlite_sequence WHERE name = 'menu_filters'").run();
        } catch (_) {}
    }

    try {
        db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    return {
        success: true,
        deletedCount,
        message: `Successfully deleted ${deletedCount} menu filter records.`,
    };
}

export default deleteMenuFilters;
