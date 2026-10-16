/**
 * Table Schema: website_content
 * Stores content management data (branding, banners, page content) from GetWebsiteContent API
 */
export const WEBSITE_CONTENT_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS website_content (
    id TEXT PRIMARY KEY,
    WebsiteId INTEGER DEFAULT 0,
    ContentType TEXT NOT NULL,
    BannerTypeId INTEGER,
    PageKey TEXT,
    Title TEXT,
    ContentJson TEXT,
    MediaType TEXT,
    ImageUrl TEXT,
    MobileImageUrl TEXT,
    SortOrder INTEGER DEFAULT 1,
    IsActive INTEGER DEFAULT 1,
    CreatedBy TEXT DEFAULT '',
    CreatedDate TEXT,
    ModifiedBy TEXT,
    ModifiedDate TEXT,
    Websitedomain TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_website_content_type ON website_content(ContentType);
CREATE INDEX IF NOT EXISTS idx_website_content_websiteid ON website_content(WebsiteId);
CREATE INDEX IF NOT EXISTS idx_website_content_domain ON website_content(Websitedomain);
CREATE INDEX IF NOT EXISTS idx_website_content_pagekey ON website_content(PageKey);
CREATE INDEX IF NOT EXISTS idx_website_content_sort ON website_content(SortOrder ASC, id ASC);
`;

/**
 * Ensures the website_content table and performance indexes exist in the tenant SQLite database.
 * @param {import('better-sqlite3').Database} db
 */
export function ensureWebsiteContentTable(db) {
    if (!db) return;
    try {
        db.exec(WEBSITE_CONTENT_TABLE_SQL);
    } catch (err) {
        console.warn("[ensureWebsiteContentTable] Warning ensuring website_content table:", err.message);
    }
}

export default WEBSITE_CONTENT_TABLE_SQL;
