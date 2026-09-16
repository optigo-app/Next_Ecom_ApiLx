/**
 * Procedure to delete/truncate packagemaster table in SQLite.
 * Automatically flushes WAL to disk.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {{ success: boolean, deletedCount: number, message: string }}
 */
export function deletePackageMaster(db, options = {}) {
    let deletedCount = 0;
    const id = options.id;

    if (id) {
        const info = db.prepare("DELETE FROM packagemaster WHERE id = ?").run(Number(id));
        deletedCount = info.changes;
    } else {
        const info = db.prepare("DELETE FROM packagemaster").run();
        deletedCount = info.changes;
        try {
            db.prepare("DELETE FROM sqlite_sequence WHERE name = 'packagemaster'").run();
        } catch (_) {}
    }

    try {
        db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    return {
        success: true,
        deletedCount,
        message: `Successfully deleted ${deletedCount} package master records.`,
    };
}

export default deletePackageMaster;
