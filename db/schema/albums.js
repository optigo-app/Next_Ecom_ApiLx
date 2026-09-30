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

export default ALBUMS_TABLE_SQL;
