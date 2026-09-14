/**
 * SQLite Performance & Integrity PRAGMAs
 */
export const PRAGMAS_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;
PRAGMA wal_autocheckpoint = 100;
`;

export default PRAGMAS_SQL;
