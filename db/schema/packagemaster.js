/**
 * Table Schema: packagemaster
 * Package Master & Include Package Mapping (from PACKAGEMASTER)
 */
export const PACKAGEMASTER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS packagemaster (
    id INTEGER PRIMARY KEY,
    asPackageName TEXT NOT NULL,
    IncludePackageid TEXT DEFAULT '',
    IncludePackagename TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_packagemaster_name ON packagemaster(asPackageName);
CREATE INDEX IF NOT EXISTS idx_packagemaster_include_ids ON packagemaster(IncludePackageid);
`;

export default PACKAGEMASTER_TABLE_SQL;
