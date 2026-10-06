import { ensureAlbumsTable } from "../schema/albums.js";

/**
 * Saves album items into albums table (from GetAlbums API).
 * Strategy: DELETE all existing rows first, then INSERT fresh batch — atomic transaction.
 * This guarantees stale rows (with different composite keys) are fully replaced on every sync.
 *
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>|object} rawPayload - array or response payload of album objects
 * @returns {{ totalReceived: number, savedCount: number, deletedCount: number, elapsedMs: number, success: boolean, error?: string }}
 */
export function saveAlbums(db, rawPayload = []) {
    if (!db) {
        return {
            totalReceived: 0,
            savedCount: 0,
            deletedCount: 0,
            elapsedMs: 0,
            success: false,
            error: "Database instance is required",
        };
    }

    ensureAlbumsTable(db);

    const startTime = performance.now();

    let albumList = [];
    if (Array.isArray(rawPayload)) {
        albumList = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        albumList =
            rawPayload?.Data?.rd ||
            rawPayload?.rd ||
            rawPayload?.data?.rd ||
            rawPayload?.albums ||
            (Array.isArray(rawPayload?.Data) ? rawPayload.Data : null) ||
            (Array.isArray(rawPayload?.data) ? rawPayload.data : null) ||
            [];
    }

    if (!Array.isArray(albumList) || albumList.length === 0) {
        return {
            totalReceived: 0,
            savedCount: 0,
            deletedCount: 0,
            elapsedMs: Math.round((performance.now() - startTime) * 100) / 100,
            success: true,
        };
    }

    const insertStmt = db.prepare(`
        INSERT INTO albums (
            id,
            albumName,
            AutocodeList,
            ExpiryDate,
            albumcode,
            CustomerId,
            RandomNo,
            EntryDate,
            updated_at
        ) VALUES (
            @id,
            @albumName,
            @AutocodeList,
            @ExpiryDate,
            @albumcode,
            @CustomerId,
            @RandomNo,
            @EntryDate,
            CURRENT_TIMESTAMP
        )
    `);

    // ── Atomic: wipe + re-insert in one transaction ──────────────────────────
    const executeBatch = db.transaction((rows) => {
        // 1. Delete all existing albums (exact sync — no stale rows left behind)
        const deleteInfo = db.prepare("DELETE FROM albums").run();
        const deletedCount = deleteInfo.changes;

        // 2. Insert fresh rows
        let count = 0;
        for (const row of rows) {
            if (row.id === undefined || row.id === null) continue;

            insertStmt.run({
                id: Number(row.id),
                albumName: String(row.albumName ?? row.AlbumName ?? "").trim(),
                AutocodeList: String(row.AutocodeList ?? row.autocodeList ?? row.Autocodes ?? "").trim(),
                ExpiryDate: row.ExpiryDate ? String(row.ExpiryDate).trim() : "",
                albumcode: String(row.albumcode ?? row.AlbumCode ?? row.albumCode ?? "").trim(),
                CustomerId: row.CustomerId != null && row.CustomerId !== "" ? Number(row.CustomerId) : 0,
                RandomNo: row.RandomNo != null ? String(row.RandomNo).trim() : "",
                EntryDate: row.EntryDate ? String(row.EntryDate).trim() : "",
            });
            count++;
        }

        return { savedCount: count, deletedCount };
    });

    const { savedCount, deletedCount } = executeBatch(albumList);
    const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
        totalReceived: albumList.length,
        savedCount,
        deletedCount,
        elapsedMs,
        success: true,
    };
}

export default saveAlbums;
