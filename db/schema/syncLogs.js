/**
 * Table Schema: sync_logs
 * Sync & Operation Audit Logs
 */
export const SYNC_LOGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_identifier TEXT DEFAULT 'GLOBAL',
    action TEXT NOT NULL,
    total_received INTEGER DEFAULT 0,
    inserted_count INTEGER DEFAULT 0,
    updated_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'SUCCESS',
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_menu ON sync_logs(menu_identifier);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created ON sync_logs(created_at);
`;

export default SYNC_LOGS_TABLE_SQL;
