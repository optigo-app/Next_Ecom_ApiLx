/**
 * Procedure to delete/truncate menus table in SQLite.
 * Automatically flushes WAL to disk.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {{ success: boolean, deletedCount: number, message: string }}
 */
export function deleteMenus(db, options = {}) {
    let deletedCount = 0;
    const id = options.id || options.menuid;

    if (id) {
        const info = db.prepare("DELETE FROM menus WHERE id = ? OR menuid = ?").run(Number(id), Number(id));
        deletedCount = info.changes;
    } else {
        const info = db.prepare("DELETE FROM menus").run();
        deletedCount = info.changes;
        try {
            db.prepare("DELETE FROM sqlite_sequence WHERE name = 'menus'").run();
        } catch (_) {}
    }

    try {
        db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    return {
        success: true,
        deletedCount,
        message: `Successfully deleted ${deletedCount} menus.`,
    };
}

export default deleteMenus;
