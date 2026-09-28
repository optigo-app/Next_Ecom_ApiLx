/**
 * Saves or updates album items into albums table (from GetAlbums API).
 * Supports raw wrapped payload ({ Data: { rd: [...] } } or { rd: [...] }) or direct array.
 * Enforces PRIMARY KEY (id, albumcode, CustomerId, RandomNo) upsert.
 * 
 * @param {import('better-sqlite3').Database} db
 * @param {Array<object>|object} rawPayload - array or response payload of album objects
 * @param {object} [options={}]
 * @param {boolean} [options.replace=false] - If true, clears existing albums before inserting
 * @returns {{ totalReceived: number, savedCount: number, elapsedMs: number, success: boolean }}
 */
export function saveAlbums(db, rawPayload = [], options = {}) {
    const startTime = performance.now();

    let albumList = [];
    if (Array.isArray(rawPayload)) {
        albumList = rawPayload;
    } else if (rawPayload && typeof rawPayload === "object") {
        albumList = rawPayload?.Data?.rd || rawPayload?.rd || [];
    }

    if (!Array.isArray(albumList) || albumList.length === 0) {
        return {
            totalReceived: 0,
            savedCount: 0,
            elapsedMs: Math.round((performance.now() - startTime) * 100) / 100,
            success: true,
        };
    }

    if (options.replace) {
        try {
            db.exec("DELETE FROM albums;");
        } catch (_) {}
    }

    const upsertStmt = db.prepare(`
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
        ON CONFLICT(id, albumcode, CustomerId, RandomNo) DO UPDATE SET
            albumName = excluded.albumName,
            AutocodeList = excluded.AutocodeList,
            ExpiryDate = excluded.ExpiryDate,
            EntryDate = excluded.EntryDate,
            updated_at = CURRENT_TIMESTAMP
    `);

    const executeBatch = db.transaction((rows) => {
        let count = 0;
        for (const row of rows) {
            if (row.id === undefined || row.id === null) continue;

            const id = Number(row.id);
            const albumName = String(row.albumName ?? row.AlbumName ?? "").trim();
            const AutocodeList = String(row.AutocodeList ?? row.autocodeList ?? row.Autocodes ?? "").trim();
            const ExpiryDate = row.ExpiryDate ? String(row.ExpiryDate).trim() : "";
            const albumcode = String(row.albumcode ?? row.AlbumCode ?? row.albumCode ?? "").trim();
            const CustomerId = row.CustomerId != null && row.CustomerId !== "" ? Number(row.CustomerId) : 0;
            const RandomNo = row.RandomNo != null ? String(row.RandomNo).trim() : "";
            const EntryDate = row.EntryDate ? String(row.EntryDate).trim() : "";

            upsertStmt.run({
                id,
                albumName,
                AutocodeList,
                ExpiryDate,
                albumcode,
                CustomerId,
                RandomNo,
                EntryDate,
            });
            count++;
        }
        return count;
    });

    const savedCount = executeBatch(albumList);
    const elapsedMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
        totalReceived: albumList.length,
        savedCount,
        elapsedMs,
        success: true,
    };
}

export default saveAlbums;
