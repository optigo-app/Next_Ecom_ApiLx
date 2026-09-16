/**
 * Table Schema: recently_viewed_designs
 * Customer-wise recently viewed product designs
 * Note: designno is NOT unique so multiple customers can view/click the same design.
 */
export const RECENTLY_VIEWED_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS recently_viewed_designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT NOT NULL,
    designno TEXT NOT NULL,
    autocode TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recent_customer_updated 
    ON recently_viewed_designs(customer_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_recent_customer_design 
    ON recently_viewed_designs(customer_id, designno);
CREATE INDEX IF NOT EXISTS idx_recent_designno 
    ON recently_viewed_designs(designno);
`;

export default RECENTLY_VIEWED_TABLE_SQL;
