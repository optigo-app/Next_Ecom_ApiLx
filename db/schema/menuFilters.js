/**
 * Table Schema: menu_filters
 * Menu Filter Options (from GETFILTERLIST)
 */
export const MENU_FILTERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS menu_filters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_identifier TEXT NOT NULL,
    filter_id TEXT NOT NULL,
    name TEXT,
    fil_dis_name TEXT,
    fil_no INTEGER,
    options_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_menu_filter UNIQUE (menu_identifier, filter_id)
);

CREATE INDEX IF NOT EXISTS idx_menu_filters_menu ON menu_filters(menu_identifier);
`;

export default MENU_FILTERS_TABLE_SQL;
