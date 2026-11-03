/**
 * Table Schema: website_color
 * Stores website theme and color configuration from GetWebsiteColor API / ProcatalogStoreThemeConfig
 */
export const WEBSITE_COLOR_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS website_color (
    id INTEGER PRIMARY KEY,
    store_id INTEGER DEFAULT 0,
    domain_name TEXT,
    primary_theme_color TEXT,
    primary_theme_bg TEXT,
    sticky_header_bg TEXT,
    btn_main_bg TEXT,
    btn_main_text TEXT,
    btn_main_border TEXT,
    btn_product_bg TEXT,
    btn_product_text TEXT,
    btn_product_border TEXT,
    btn_product_border_radius TEXT,
    btn_remove_cart_bg TEXT,
    btn_remove_cart_text TEXT,
    btn_remove_cart_border TEXT,
    btn_remove_cart_border_radius TEXT,
    icon_color TEXT,
    icon_remove_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ufcc TEXT
);

CREATE INDEX IF NOT EXISTS idx_website_color_store_id ON website_color(store_id);
CREATE INDEX IF NOT EXISTS idx_website_color_domain_name ON website_color(domain_name);
`;

/**
 * Ensures the website_color table and performance indexes exist in the tenant SQLite database.
 * @param {import('better-sqlite3').Database} db
 */
export function ensureWebsiteColorTable(db) {
    if (!db) return;
    try {
        db.exec(WEBSITE_COLOR_TABLE_SQL);
    } catch (err) {
        console.warn("[ensureWebsiteColorTable] Warning ensuring website_color table:", err.message);
    }
}

export default WEBSITE_COLOR_TABLE_SQL;
