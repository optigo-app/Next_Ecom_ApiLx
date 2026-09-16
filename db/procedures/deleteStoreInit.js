/**
 * Procedure to delete/truncate storeinit, account, and companyinfo tables in SQLite.
 * Automatically flushes WAL to disk.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {object} [options={}]
 * @returns {{ success: boolean, message: string }}
 */
export function deleteStoreInit(db, options = {}) {
    db.prepare("DELETE FROM storeinit").run();
    db.prepare("DELETE FROM account").run();
    db.prepare("DELETE FROM companyinfo").run();
    try {
        db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('storeinit', 'account', 'companyinfo')").run();
    } catch (_) {}

    try {
        db.pragma("wal_checkpoint(TRUNCATE)");
    } catch (_) {}

    return {
        success: true,
        message: "Successfully cleared storeInit, account, and companyinfo tables.",
    };
}

export default deleteStoreInit;
