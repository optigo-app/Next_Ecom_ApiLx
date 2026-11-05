/**
 * Table Schema: albums
 * Stores Album definitions and customer album assignments (from GetAlbums API)
 */
export const ALBUMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS albums (
    id INTEGER NOT NULL,
    albumName TEXT NOT NULL DEFAULT '',
    AutocodeList TEXT DEFAULT '',
    ExpiryDate TEXT DEFAULT '',
    IsDeactive INTEGER DEFAULT 0,
    albumcode TEXT DEFAULT '',
    CustomerId INTEGER DEFAULT 0,
    RandomNo TEXT DEFAULT '',
    EntryDate TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, albumcode, CustomerId, RandomNo)
);

CREATE INDEX IF NOT EXISTS idx_albums_id ON albums(id);
CREATE INDEX IF NOT EXISTS idx_albums_name ON albums(albumName);
CREATE INDEX IF NOT EXISTS idx_albums_customer ON albums(CustomerId);
CREATE INDEX IF NOT EXISTS idx_albums_code ON albums(albumcode);
CREATE INDEX IF NOT EXISTS idx_albums_randomno ON albums(RandomNo);
CREATE INDEX IF NOT EXISTS idx_albums_expiry ON albums(ExpiryDate);
`;

/**
 * Ensures the albums table and performance indexes exist in the tenant SQLite database.
 * @param {import('better-sqlite3').Database} db
 */
export function ensureAlbumsTable(db) {
    if (!db) return;
    try {
        const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='albums'").get();
        if (exists) {
            const cols = db.prepare("PRAGMA table_info(albums)").all().map((c) => c.name);
            if (cols.includes("IsDective") && !cols.includes("IsDeactive")) {
                db.exec("ALTER TABLE albums RENAME COLUMN IsDective TO IsDeactive");
                cols.splice(cols.indexOf("IsDective"), 1, "IsDeactive");
            }
            if (!cols.includes("IsDeactive")) {
                db.exec("ALTER TABLE albums ADD COLUMN IsDeactive INTEGER DEFAULT 0");
            }
        }
        db.exec(ALBUMS_TABLE_SQL);
    } catch (err) {
        console.warn("[ensureAlbumsTable] Warning ensuring albums table:", err.message);
    }
}

/**
 * Parses an expiry value (ISO, "yyyy-mm-dd hh:mm:ss", "dd-mm-yyyy", "dd/mm/yyyy") into a Date.
 * Date-only values stay valid until the end of that day. Returns null when empty/unparseable.
 */
export function parseAlbumExpiry(value) {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    if (!str) return null;
    let m = str.match(/^(d{1,2})[-/.](d{1,2})[-/.](d{4})(?:[ T](d{1,2}):(d{2})(?::(d{2}))?)?$/);
    let d;
    if (m) {
        const hasTime = m[4] !== undefined;
        d = new Date(+m[3], +m[2] - 1, +m[1], hasTime ? +m[4] : 23, hasTime ? +m[5] : 59, hasTime ? +(m[6] || 0) : 59);
    } else {
        m = str.match(/^d{4}-d{2}-d{2}$/);
        d = m ? new Date(str + "T23:59:59") : new Date(str);
    }
    return isNaN(d.getTime()) ? null : d;
}

export function isAlbumExpired(expiryDate, now = new Date()) {
    const d = parseAlbumExpiry(expiryDate);
    return d ? d.getTime() < now.getTime() : false;
}

/** IsDeactive: 0 = active, 1 = inactive. Active and not expired => usable. */
export function isAlbumUsable(row) {
    if (!row) return false;
    if (Number(row.IsDeactive) === 1) return false;
    return !isAlbumExpired(row.ExpiryDate);
}

export default ALBUMS_TABLE_SQL;
