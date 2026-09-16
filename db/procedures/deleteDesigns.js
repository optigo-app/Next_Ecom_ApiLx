/**
 * Procedure to delete designs from SQLite table.
 * Supports deleting all records or filtering by ArticleNo, id, or DesignId.
 * Automatically runs wal_checkpoint(TRUNCATE) to flush disk state.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {{ success: boolean, deletedCount: number, totalRemaining: number, message: string }}
 */
export function deleteDesigns(db, options = {}) {
    const countBefore = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;

    let deletedCount = 0;
    const articleNo = options.articleNo || options.ArticleNo || options.articleno;
    const id = options.id || options.DesignId || options.designId;

    if (articleNo) {
        const info = db.prepare("DELETE FROM designs WHERE ArticleNo = ?").run(String(articleNo).trim());
        deletedCount = info.changes;
    } else if (id) {
        const info = db.prepare("DELETE FROM designs WHERE id = ? OR DesignId = ?").run(Number(id), Number(id));
        deletedCount = info.changes;
    } else {
        // Truncate all designs
        const info = db.prepare("DELETE FROM designs").run();
        deletedCount = info.changes;
        try {
            db.prepare("DELETE FROM sync_logs WHERE action = 'SYNC_PRODUCTS'").run();
        } catch (_) {}
    }

    // Flush WAL to disk so external GUI tools see data immediately
    try {
        db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    const countAfter = db.prepare("SELECT COUNT(*) as count FROM designs").get()?.count || 0;

    return {
        success: true,
        deletedCount,
        totalRemaining: countAfter,
        message: `Successfully deleted ${deletedCount} designs (${countAfter} remaining in database).`,
    };
}

export default deleteDesigns;
