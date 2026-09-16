/**
 * Table Schema: menus
 * Header Navigation Menu Hierarchy & Parameter Mapping (from GETMENU)
 */
export const MENUS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY,
    SrNo TEXT,
    levelid INTEGER DEFAULT 0,
    menuid INTEGER DEFAULT 0,
    menuname TEXT NOT NULL,
    IsHashTag INTEGER DEFAULT 0,
    link TEXT,
    displayorder INTEGER DEFAULT 0,
    param0id INTEGER DEFAULT 0,
    param0name TEXT,
    param0dataid INTEGER DEFAULT 0,
    param0dataname TEXT,
    param1id INTEGER DEFAULT 0,
    param1name TEXT,
    param1dataid INTEGER DEFAULT 0,
    param1dataname TEXT,
    param2id INTEGER DEFAULT 0,
    param2name TEXT,
    param2dataid INTEGER DEFAULT 0,
    param2dataname TEXT,
    IsFilterKey1Ignore INTEGER DEFAULT 0,
    PackageIdList TEXT,
    ExclusiveCustomerId TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_menus_levelid ON menus(levelid);
CREATE INDEX IF NOT EXISTS idx_menus_menuid ON menus(menuid);
CREATE INDEX IF NOT EXISTS idx_menus_displayorder ON menus(displayorder ASC, id ASC);
CREATE INDEX IF NOT EXISTS idx_menus_param0 ON menus(param0name, param0dataname);
CREATE INDEX IF NOT EXISTS idx_menus_param1 ON menus(param1name, param1dataname);
CREATE INDEX IF NOT EXISTS idx_menus_param2 ON menus(param2name, param2dataname);
`;

export default MENUS_TABLE_SQL;
