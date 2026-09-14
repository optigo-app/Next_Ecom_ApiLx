/**
 * Table Schema: account
 * Customer Account Sub-menus & Navigation Permissions (rd1)
 */
export const ACCOUNT_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pageid INTEGER NOT NULL UNIQUE,
    submenuname TEXT NOT NULL,
    isvisible INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_account_pageid ON account(pageid);
CREATE INDEX IF NOT EXISTS idx_account_isvisible ON account(isvisible);
CREATE INDEX IF NOT EXISTS idx_account_display_order ON account(display_order ASC, id ASC);
`;

export default ACCOUNT_TABLE_SQL;
